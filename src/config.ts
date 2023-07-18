import "dotenv/config";
import { Config } from "./lib";

const config: Config = {
  apiKey: {
    storefront: process.env.SOURCE_SHOPIFY_STOREFRONT_KEY,
    admin: process.env.DESTINATION_SHOPIFY_ADMIN_KEY,
  },
  storename: {
    storefront: process.env.SOURCE_SHOPIFY_STOREFRONT_NAME,
    admin: process.env.DESTINATION_SHOPIFY_STOREFRONT_NAME,
  },
  apiVersion: {
    storefront: process.env.DESTINATION_SHOPIFY_API_VERSION,
    admin: process.env.DESTINATION_SHOPIFY_API_VERSION,
  },
  metafieldIdentifiers: {
    product: [
      // {
      //   key: "example_key",
      //   namespace: "example",
      // },
      // {
      //   key: "example_key2",
      //   namespace: "example",
      // },
    ],
    variant: [
      // {
      //   key: "example_key",
      //   namespace: "example",
      // },
      // {
      //   key: "example_key2",
      //   namespace: "example",
      // },
    ],
  },
};
export default config;
