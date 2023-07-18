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
      {
        key: "display_pomade_compare",
        namespace: "suavecito",
      },
      {
        key: "styling_tip",
        namespace: "suavecito",
      },
      {
        key: "suggested_styles",
        namespace: "suavecito",
      },
    ],
    variant: [
      {
        key: "images",
        namespace: "suavecito",
      },
      {
        key: "fragrance_profile",
        namespace: "suavecito",
      },
      {
        key: "pack_quantity",
        namespace: "suavecito",
      },
      {
        key: "retail_price",
        namespace: "suavecito",
      },
    ],
  },
};
export default config;
