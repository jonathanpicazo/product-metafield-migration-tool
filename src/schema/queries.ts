import { MEDIA_IMAGE_FRAGMENT } from "./fragments";

export const STOREFRONT_PRODUCTS_LOOP_QUERY = `#graphql
  ${MEDIA_IMAGE_FRAGMENT}
  query getStorefrontProducts($pageBy: Int!, $cursor: String, $productIdentifiers: [HasMetafieldsIdentifier!]!, $variantIdentifiers: [HasMetafieldsIdentifier!]!) {
    products(first: $pageBy, after: $cursor) {
      nodes {
        id  
        handle
        title
        metafields(identifiers: $productIdentifiers) {
          key
          namespace
          type
          value
          reference {
            ...MediaImageFragment
          }
          references(first: 10) {
            nodes {
              ...MediaImageFragment
            }
          }
        }
        variants(first: 100) {
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
            metafields(identifiers: $variantIdentifiers) {
              key
              namespace
              type
              value
              reference {
                ...MediaImageFragment
              }
              references(first: 10) {
                nodes {
                  ...MediaImageFragment
                }
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const ADMIN_GET_PRODUCT_QUERY = `#graphql
  query getDestinationProduct($handle: String!) {
    productByHandle(handle: $handle) {
      id
      handle
      variants(first: 100) {
        nodes {
          id
          sku
        }
      }
    }
  }
`;

export const ADMIN_SET_METAFIELD_QUERY = `#graphql
  mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        id
        key
        namespace
        value
        type
        ownerType
        createdAt
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const ADMIN_UPLOAD_FIlES_QUERY = `#graphql
  mutation fileCreate($fileInput: [FileCreateInput!]!) {
    fileCreate(files: $fileInput) {
      files {
        ... on MediaImage {
          id
          alt
        }
        fileStatus
        createdAt
      }
      userErrors {
        field
        message
      }
    }
  }
`;
