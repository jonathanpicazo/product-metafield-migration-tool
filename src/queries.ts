import { PRODUCT_FRAGMENT_ADMIN, MEDIA_IMAGE_FRAGMENT } from "./fragments";

export const STOREFRONT_GET_PRODUCT_QUERY = `#graphql
  ${MEDIA_IMAGE_FRAGMENT}
  query getSourceProduct($handle: String!, $productIdentifiers: [HasMetafieldsIdentifier!]! ,$variantIdentifiers: [HasMetafieldsIdentifier!]!) {
    product(handle: $handle) {
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
