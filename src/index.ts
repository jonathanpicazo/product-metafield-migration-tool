import {
  fetchRetailStorefront,
  fetchWholesaleStagingAdmin,
  flattenConnection,
} from "./utils";

import type { Product } from "./types";

import { RETAIL_PRODUCT_QUERY, WHOLESALE_PRODUCT_QUERY } from "./queries";

const matchMetafields = (oldProduct: Product, newProduct: Product) => {
  const oldVariants = flattenConnection(oldProduct.variants);

  const newVariants = flattenConnection(newProduct.variants);
  newVariants.forEach((el) => {
    console.log("el", el);
  });
};

const sampleProduct = {
  storefrontHandle: "original-hold-pomade",
  adminHandle: "test-variants",
};

const { data } = await fetchRetailStorefront(RETAIL_PRODUCT_QUERY, {
  handle: sampleProduct.storefrontHandle,
});
const storefrontProduct = data.product;

const data2 = await fetchWholesaleStagingAdmin(WHOLESALE_PRODUCT_QUERY, {
  handle: sampleProduct.adminHandle,
});

const adminProduct = data2.data.productByHandle;

matchMetafields(storefrontProduct, adminProduct);
