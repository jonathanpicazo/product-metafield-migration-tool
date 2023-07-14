import {
  Product,
  ProductVariant,
  FileCreateInput,
  File,
  MetafieldsSetInput,
  Metafield,
  MediaImage,
} from "./types";
import { flattenConnection, isEmpty, fetchAdminDestination } from "./utils";
import { ADMIN_SET_METAFIELD_QUERY, ADMIN_UPLOAD_FIlES_QUERY } from "./queries";

export const createFilePayload = (
  metafieldImages: MediaImage[],
  owner: Product | ProductVariant
) => {
  // const unformattedTitle =
  //   variant.title === "Default Title"
  //     ? variant.product.title
  //     : `${variant.product.title}-${variant.title}`;
  // const title = unformattedTitle.replace(/\s/g, "_").replace("/", "-").trim();

  return metafieldImages.map((variantImage, index) => {
    const { image } = variantImage;
    return {
      alt: image.altText ?? "",
      contentType: "IMAGE",
      // duplicateResolutionMode: "REPLACE",
      // filename: `migration-${title}-variant-meta-image-${index + 1}`,
      originalSource: image.url,
    } as FileCreateInput;
  });
};

export const uploadFiles = async (filePayload: FileCreateInput[]) => {
  try {
    if (!isEmpty(filePayload)) {
      const res = await fetchAdminDestination(ADMIN_UPLOAD_FIlES_QUERY, {
        fileInput: filePayload,
      });
      const { files }: { files: File[] } = res.data.fileCreate;
      const { throttleStatus } = res.extensions.cost;
      if (!files) return [];

      return files.map((file) => file.id);
    }
  } catch (error) {
    console.log("error", error);
  }
};

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

export const getMetafieldValueType = (
  type: string
): "list-reference" | "reference" | "value" => {
  if (type.includes("reference")) {
    if (type.includes("list")) return "list-reference";
    return "reference";
  }
  return "value";
};

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
