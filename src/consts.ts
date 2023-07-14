// TODO:  move to config file

import { HasMetafieldsIdentifier } from "./types";
export const METAFIELD_NAMESPACE = "suavecito";
export const PRODUCT_SOURCE_METAFIELD_IDENTIFIER: HasMetafieldsIdentifier[] = [
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
];
export const VARIANT_SOURCE_METAFIELD_IDENTIFIER: HasMetafieldsIdentifier[] = [
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
];
