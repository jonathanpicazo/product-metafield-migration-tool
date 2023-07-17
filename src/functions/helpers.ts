/**
 * This file contains helper functions used to migrate metafields to destination store
 * majority of complex logic lives here
 */
import {
  flattenConnection,
  isEmpty,
  fetchAdminDestination,
  prettyPrint,
  fetchStorefrontSource,
} from "./utils";
import {
  ADMIN_SET_METAFIELD_QUERY,
  ADMIN_UPLOAD_FIlES_QUERY,
  STOREFRONT_GET_PRODUCT_QUERY,
  ADMIN_GET_PRODUCT_QUERY,
} from "../schema";
import {
  VARIANT_SOURCE_METAFIELD_IDENTIFIER,
  PRODUCT_SOURCE_METAFIELD_IDENTIFIER,
} from "../lib/consts";

import type {
  Product,
  ProductVariant,
  FileCreateInput,
  File,
  MetafieldsSetInput,
  Metafield,
  MediaImage,
} from "../lib/types";

import config from "../lib/config";

/**
 * Migrates a product and child variants metafield from source to destination
 * @param {string} productHandle - handle of a product
 */
export const migrateMetafields = async (productHandle: string) => {
  try {
    console.log("MIGRATING ON HANDLE", productHandle);
    // fetch src and dst products
    const srcRes = await fetchStorefrontSource(STOREFRONT_GET_PRODUCT_QUERY, {
      handle: productHandle,
      productIdentifiers: PRODUCT_SOURCE_METAFIELD_IDENTIFIER,
      variantIdentifiers: VARIANT_SOURCE_METAFIELD_IDENTIFIER,
    });

    const dstRes = await fetchAdminDestination(ADMIN_GET_PRODUCT_QUERY, {
      handle: productHandle,
    });
    const srcProduct = srcRes.data.product;
    const dstProduct = dstRes.data.productByHandle;

    if (!(srcProduct && dstProduct)) return;
    if (srcProduct.handle !== dstProduct.handle) return;

    // if handles match, copy over source metafields to destination product
    // product metafield migration
    if (srcProduct.metafields) {
      const productMetafields = srcProduct.metafields.filter(
        (m: Metafield | null) => m
      );
      const metafieldPayload: MetafieldsSetInput[] = await getMetafieldPayload(
        productMetafields,
        srcProduct,
        dstProduct
      );
      // upload source metafields to destination if payload created
      if (!isEmpty(metafieldPayload)) {
        const res = await uploadMetafields(metafieldPayload);
        console.log("UPLOADED PRODUCT METAFIELDS", prettyPrint(res));
      }
    }

    // variant metafield migration

    const srcVariants = flattenConnection(
      srcProduct.variants
    ) as ProductVariant[];
    const dstVariants = flattenConnection(
      dstProduct.variants
    ) as ProductVariant[];

    for (const variant of dstVariants) {
      // if source variant exists, copy metafield data
      const matchingSrcVariant = srcVariants.find(
        (el) => el.sku === variant.sku
      );
      if (!matchingSrcVariant || !matchingSrcVariant.metafields) break;

      const variantMetafields = matchingSrcVariant.metafields.filter(
        (m: Metafield | null) => m
      );

      const metafieldPayload: MetafieldsSetInput[] = await getMetafieldPayload(
        variantMetafields,
        matchingSrcVariant,
        variant
      );

      if (isEmpty(metafieldPayload)) break;
      // upload source metafields to destination if payload created
      const res = await uploadMetafields(metafieldPayload);

      console.log("UPLOADED VARIANT METAFIELDS", prettyPrint(res));
    }
    return true;
  } catch (error) {
    console.log("ERROR", error);
    return false;
  }
};

/**
 * Determines whether the metafield value property is a normal value, reference, or list_reference
 * @param {string} type - metafield.type property
 */
export const getMetafieldValueType = (
  type: string
): "list-reference" | "reference" | "value" => {
  if (type.includes("reference")) {
    if (type.includes("list")) return "list-reference";
    return "reference";
  }
  return "value";
};

/**
 * Returns the metafieldValueInput to be used in metafieldSet mutation
 * @param {Metafield} metafield - metafield for metafield value input
 * @param {Product | ProductVariant} owner - owner for the metafield value input (dstOwner)
 */
export const getMetafieldValueInput = async (
  metafield: Metafield,
  owner: Product | ProductVariant
) => {
  const metafieldDataType = getMetafieldValueType(metafield.type);
  if (metafieldDataType === "value") {
    console.log("METAFIELD INPUT", metafield.value);
    return metafield.value;
  }
  // metafield is a file reference
  const metafieldImages =
    metafieldDataType === "list-reference"
      ? // @ts-ignore
        flattenConnection(metafield.references)
      : [metafield.reference];
  const filePayload = createFilePayload(metafieldImages, owner);
  const imageIds = await uploadFiles(filePayload);
  if (!imageIds || isEmpty(imageIds)) return;

  // if reference is a list, return stringified array
  // else, return single string value
  const metafieldInput =
    metafieldDataType === "list-reference"
      ? JSON.stringify(imageIds)
      : imageIds[0];

  return metafieldInput;
};

/**
 * Creates a payload of type FileCreateInput[] for mutation
 * @param {MediaImage[]} metafieldImages - array of MediaImages
 * @param {Product | ProductVariant} owner - owner of the newly created image metafield, destination product/variant in this case
 */
export const createFilePayload = (
  metafieldImages: MediaImage[],
  owner: Product | ProductVariant
): FileCreateInput[] => {
  return metafieldImages.map((variantImage, index) => {
    const { image } = variantImage;
    return {
      alt: image.altText ?? "",
      contentType: "IMAGE",
      originalSource: image.url,
    } as FileCreateInput;
  });
};

/**
 * Uploads files to destination store
 * @param {FileCreateInput[]} metafieldPayload - payload for filesCreate mutation
 */
export const uploadFiles = async (filePayload: FileCreateInput[]) => {
  try {
    if (!isEmpty(filePayload)) {
      const res = await fetchAdminDestination(ADMIN_UPLOAD_FIlES_QUERY, {
        fileInput: filePayload,
      });
      const { files }: { files: File[] } = res.data.fileCreate;
      const { throttleStatus } = res.extensions.cost;
      if (!files) return [];
      console.log("UPLOADED FILES", files);
      return files.map((file) => file.id);
    }
  } catch (error) {
    console.log("error", error);
  }
};

/**
 * Returns the metafieldSet mutation payload for the destination product/variant
 * @param {Metafield[]} metafields - metafields to create payload for
 * @param {Product | ProductVariant} srcOwner - the source owner (where the metafield is copied from)
 * @param {Product | ProductVariant} dstOwner - the destination owner (where the metafield will be copied to)
 */
export const getMetafieldPayload = async (
  metafields: Metafield[],
  srcOwner: Product | ProductVariant,
  dstOwner: Product | ProductVariant
): Promise<MetafieldsSetInput[]> => {
  const metafieldPayload: MetafieldsSetInput[] = [];
  try {
    for (const metafield of metafields) {
      // get input for metafield
      const metafieldInput = await getMetafieldValueInput(metafield, srcOwner);
      const { key, namespace, type } = metafield;
      metafieldPayload.push({
        key,
        namespace,
        type,
        ownerId: dstOwner.id,
        value: metafieldInput as string,
      });
    }
  } catch (error) {
    console.log("ERROR", error);
  }
  return metafieldPayload;
};

/**
 * Uploads metafields to destination store
 * @param {MetafieldsSetInput[]} metafieldPayload - payload for metafieldSet mutation
 */
export const uploadMetafields = async (
  metafieldPayload: MetafieldsSetInput[]
) => {
  try {
    const res = await fetchAdminDestination(ADMIN_SET_METAFIELD_QUERY, {
      metafields: metafieldPayload,
    });
    return res;
  } catch (error) {
    console.log("error", error);
  }
};
