export const PRODUCT_FRAGMENT_ADMIN = `#graphql
  fragment ProductFragment on Product  {
    id
    handle
    variants(first: 100) {
      nodes {
        id
        sku
      }
    }
  }
`;

export const MEDIA_IMAGE_FRAGMENT = `#graphql
fragment MediaImageFragment on MediaImage {
  id
  image {
    url
    altText
  }
}`;
