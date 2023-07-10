export const RETAIL_PRODUCT_QUERY = `#graphql
  query getRetailProduct($handle: String!) {
    product(handle: $handle) {
      id
      variants(first: 100) {
        nodes {
          id
          fragranceMetafield: metafield(namespace: "debut", key: "variant_fragrance_profile") {
            value
          }
          variantImage1: metafield(namespace: "debut", key: "variant_image_1") {
            reference {
              ... on MediaImage {
                id
                image {
                  url
                  width
                  height
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;
