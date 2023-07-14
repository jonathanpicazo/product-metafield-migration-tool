import {
  fetchAdminDestination,
  fetchStorefrontSource,
  flattenConnection,
  isEmpty,
} from "./utils";

import {
  ADMIN_GET_PRODUCT_QUERY,
  STOREFRONT_GET_PRODUCT_QUERY,
} from "./queries";

import {
  createFilePayload,
  uploadFiles,
  createImageMetafield,
} from "./helpers";

const testHandle = "test-multi";

const res = await fetchStorefrontSource(STOREFRONT_GET_PRODUCT_QUERY, {
  handle: testHandle,
});

const res2 = await fetchAdminDestination(ADMIN_GET_PRODUCT_QUERY, {
  handle: testHandle,
});
const srcProduct = res.data.product;
const dstProduct = res2.data.productByHandle;

if (srcProduct && dstProduct) {
  // if handles match, copy over source metafields to destination variant
  if (srcProduct.handle === dstProduct.handle) {
    const srcVariants = flattenConnection(srcProduct.variants);
    const dstVariants = flattenConnection(dstProduct.variants);

    for (const variant of dstVariants) {
      const matchingSrcVariant = srcVariants.find(
        (el) => el.sku === variant.sku
      );
      if (matchingSrcVariant) {
        const filePayload = createFilePayload(matchingSrcVariant);
        console.log("filePayload", filePayload);
        // const imageIds = await uploadFiles(filePayload);
        // if (imageIds && !isEmpty(imageIds)) {
        //   const response = await createImageMetafield(imageIds, variant.id);
        // }
      }
    }
  }
}
