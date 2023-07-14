export const PRODUCT_FRAGMENT_STOREFRONT = `#graphql
  fragment ProductFragment on Product {
    id
    handle
    title
    variants(first: 30) {
      nodes {
        id
        title
        sku
        image {
          url
          altText
        }
        product {
          title
        }
        images: metafield(namespace: "suavecito", key: "images") {
          references(first: 8) {
            nodes {
              ... on MediaImage {
                id
                image {
                  url
                  altText
                }
              }
            }
          }
        }
        fragranceMetafield: metafield(namespace: "suavecito", key: "fragrance_profile") {
          type
          value
        }
        packQuantity: metafield(namespace: "suavecito", key: "pack_quantity") {
          type
          value
        }
        retailPrice: metafield(namespace: "suavecito", key: "retail_price") {
          type
          value
        }
      }
    }
  }`;

export const PRODUCT_FRAGMENT_ADMIN = `#graphql
  fragment ProductFragment on Product  {
    handle
    variants(first: 100) {
      nodes {
        sku
      }
    }
  }
`;
