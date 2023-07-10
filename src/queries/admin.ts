export const WHOLESALE_PRODUCT_QUERY = `#graphql
  query getWholesaleProduct($handle: String!) {
    productByHandle(handle: $handle) {
      id
      handle
      title
      variants(first: 40) {
        nodes {
          id
          title
          selectedOptions {
            name
            value
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
            value
          }
        }
      }
    }
  }
`;
