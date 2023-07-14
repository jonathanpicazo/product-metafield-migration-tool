import {
  Product,
  ProductVariant,
  FileCreateInput,
  Image,
  File,
  MetafieldsSetInput,
} from "./types";
import {
  flattenConnection,
  isEmpty,
  fetchAdminDestination,
  prettyPrint,
} from "./utils";
import { ADMIN_SET_METAFIELD_QUERY, ADMIN_UPLOAD_FIlES_QUERY } from "./queries";

import { IMAGE_METAFIELD_KEY, METAFIELD_NAMESPACE } from "./consts";

export const createFilePayload = (variant: ProductVariant) => {
  const metafieldImages = flattenConnection(variant.images.references);

  const unformattedTitle =
    variant.title === "Default Title"
      ? variant.product.title
      : `${variant.product.title}-${variant.title}`;
  const title = unformattedTitle.replace(/\s/g, "_").replace("/", "-").trim();
  return metafieldImages.map(
    (variantImage: { id: string; image: Image }, index) => {
      const { image } = variantImage;
      return {
        alt: image.altText ?? "",
        contentType: "IMAGE",
        // duplicateResolutionMode: "REPLACE",
        // filename: `migration-${title}-variant-meta-image-${index + 1}`,
        originalSource: image.url,
      } as FileCreateInput;
    }
  );
};

export const uploadFiles = async (filePayload: FileCreateInput[]) => {
  try {
    if (!isEmpty(filePayload)) {
      const res = await fetchAdminDestination(ADMIN_UPLOAD_FIlES_QUERY, {
        fileInput: filePayload,
      });
      const { files }: { files: File[] } = res.data.fileCreate;
      const { throttleStatus } = res.extensions.cost;
      console.log("files", files);
      console.log("throttleStatus", throttleStatus);
      if (files) {
        return files.map((file) => file.id);
      }
    }
    return [];
  } catch (error) {
    console.log("error", error);
  }
};

export const createStringMetafieldPayload = (variant: ProductVariant) => {
  try {
    console.log("variant", variant);
  } catch (error) {
    console.log("error", error);
  }
};

export const createImageMetafield = async (
  mediaImageIDArr: string[],
  variantId: string
) => {
  const metafieldPayload = mediaImageIDArr.map(
    (id) =>
      ({
        key: IMAGE_METAFIELD_KEY,
        namespace: METAFIELD_NAMESPACE,
        ownerId: variantId,
        type: "list.file_reference",
        value: String(id),
      } as MetafieldsSetInput)
  );
  console.log("metafieldPayload", metafieldPayload);
  const res = await fetchAdminDestination(ADMIN_SET_METAFIELD_QUERY, {
    metafields: metafieldPayload,
  });
  console.log(prettyPrint(res));
};
