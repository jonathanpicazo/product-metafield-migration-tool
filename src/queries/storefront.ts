export const RETAIL_PRODUCT_QUERY = `#graphql
  query getRetailProduct($handle: String!) {
    product(handle: $handle) {
      id
      variants(first: 100) {
        nodes {
          id
          selectedOptions {
            name
            value
          }
          fragranceMetafield: metafield(namespace: "debut", key: "variant_fragrance_profile") {
            value
          }
          variantImage1: metafield(namespace: "debut", key: "variant_image_1") {
            reference {
              ... on MediaImage {
                id
                image {
                  url
                  altText
                }
              }
            }
          }
          variantImage2: metafield(namespace: "debut", key: "variant_image_2") {
            reference {
              ... on MediaImage {
                id
                image {
                  url
                  altText
                }
              }
            }
          }
          variantImage3: metafield(namespace: "debut", key: "variant_image_3") {
            reference {
              ... on MediaImage {
                id
                image {
                  url
                  altText
                }
              }
            }
          }
          variantImage4: metafield(namespace: "debut", key: "variant_image_4") {
            reference {
              ... on MediaImage {
                id
                image {
                  url
                  altText
                }
              }
            }
          }
          variantImage5: metafield(namespace: "debut", key: "variant_image_5") {
            reference {
              ... on MediaImage {
                id
                image {
                  url
                  altText
                }
              }
            }
          }
          variantImage6: metafield(namespace: "debut", key: "variant_image_6") {
            reference {
              ... on MediaImage {
                id
                image {
                  url
                  altText
                }
              }
            }
          }
          variantImage7: metafield(namespace: "debut", key: "variant_image_7") {
            reference {
              ... on MediaImage {
                id
                image {
                  url
                  altText
                }
              }
            }
          }
          variantImage8: metafield(namespace: "debut", key: "variant_image_8") {
            reference {
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
      }
    }
  }
`;
