import {
  PRODUCT_FRAGMENT_STOREFRONT,
  PRODUCT_FRAGMENT_ADMIN,
} from "./fragments";

export const STOREFRONT_GET_PRODUCT_QUERY = `#graphql
  ${PRODUCT_FRAGMENT_STOREFRONT}
  query getSourceProduct($handle: String!) {
    product(handle: $handle) {
      ...ProductFragment
    }
  }
`;

export const ADMIN_GET_PRODUCT_QUERY = `#graphql
  ${PRODUCT_FRAGMENT_ADMIN}
  query getDestinationProduct($handle: String!) {
    productByHandle(handle: $handle) {
      ...ProductFragment
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
        ownerType
        value
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
