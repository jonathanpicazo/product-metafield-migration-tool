import { fetchRetailStorefront, flattenConnection } from "./utils";
import { RETAIL_PRODUCT_QUERY } from "./queries";

export const initializeScript = async () => {
  const productHandles: string[] = ["original-hold-pomade"];

  const { data } = await fetchRetailStorefront(RETAIL_PRODUCT_QUERY, {
    handle: productHandles[0],
  });
  const firstVariant = flattenConnection(data.product.variants)[0];
  console.log("firstVariant", firstVariant);
  const firstImage = firstVariant.variantImage1;
  console.log("firstImage", firstImage);
};
