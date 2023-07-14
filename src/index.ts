import {
  fetchAdminDestination,
  fetchStorefrontSource,
  flattenConnection,
  isEmpty,
  prettyPrint,
} from "./utils";

import {
  ADMIN_GET_PRODUCT_QUERY,
  STOREFRONT_GET_PRODUCT_QUERY,
} from "./queries";

import { uploadMetafields, getMetafieldPayload } from "./helpers";

import {
  PRODUCT_SOURCE_METAFIELD_IDENTIFIER,
  VARIANT_SOURCE_METAFIELD_IDENTIFIER,
} from "./consts";
import { Metafield, MetafieldsSetInput, ProductVariant } from "./types";

const migrateMetafields = async (productHandle: string) => {
  try {
    const srcRes = await fetchStorefrontSource(STOREFRONT_GET_PRODUCT_QUERY, {
      handle: testHandle,
      productIdentifiers: PRODUCT_SOURCE_METAFIELD_IDENTIFIER,
      variantIdentifiers: VARIANT_SOURCE_METAFIELD_IDENTIFIER,
    });

    const dstRes = await fetchAdminDestination(ADMIN_GET_PRODUCT_QUERY, {
      handle: testHandle,
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

      const res = await uploadMetafields(metafieldPayload);

      console.log("UPLOADED VARIANT METAFIELDS", prettyPrint(res));
    }
  } catch (error) {
    console.log("ERROR", error);
  }
};

const testHandle = "test-multi";

const response = await migrateMetafields("test-handle");
