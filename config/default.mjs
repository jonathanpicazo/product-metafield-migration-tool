// import "dotenv/config";

const METAFIELD_NAMESPACE = "suavecito";
export default {
  key: {
    storefront: process.env.SOURCE_SHOPIFY_STOREFRONT_KEY,
    admin: process.env.DESTINATION_SHOPIFY_ADMIN_KEY,
  },
  storenames: {
    storefront: process.env.SOURCE_SHOPIFY_STOREFRONT_NAME,
    admin: process.env.DESTINATION_SHOPIFY_STOREFRONT_NAME,
  },
  apiVersion: {
    storefront: process.env.SOURCE_SHOPIFY_API_VERSION,
    admin: process.env.DESTINATION_SHOPIFY_API_VERSION,
  },
  metafieldIdentifiers: {
    product: [
      {
        key: "display_pomade_compare",
        namespace: METAFIELD_NAMESPACE,
      },
      {
        key: "styling_tip",
        namespace: METAFIELD_NAMESPACE,
      },
      {
        key: "suggested_styles",
        namespace: METAFIELD_NAMESPACE,
      },
    ],
    variant: [
      {
        key: "images",
        namespace: METAFIELD_NAMESPACE,
      },
      {
        key: "fragrance_profile",
        namespace: METAFIELD_NAMESPACE,
      },
      {
        key: "pack_quantity",
        namespace: METAFIELD_NAMESPACE,
      },
      {
        key: "retail_price",
        namespace: METAFIELD_NAMESPACE,
      },
    ],
  },
};
