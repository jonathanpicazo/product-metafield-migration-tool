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

/*
  creates a payload of type FileCreateInput[] for mutation
  accepts an array of MediaImages
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

/*
  determines whether the metafield value property is a normal value, reference, or list_reference
  accepts a string, which should be metafield.value
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

/*
  returns the metafieldSet payload for the destination product/variant
  accepts metafields array, source owner, and destination owner
  owners are either product or variant
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

/*
  returns the metafieldValueInput to be used in metafieldSet mutation
  accepts metafield and owner
  will upload files to destination store if type reference
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

/*
  uploads files to destination store
  runs mutation filesCreate
  accepts FileCreateInput[] arr
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

      return files.map((file) => file.id);
    }
  } catch (error) {
    console.log("error", error);
  }
};

/*
  uploads metafields to destination store
  runs mutation metafieldSet
  accepts MetafieldSetInput[] arr
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
