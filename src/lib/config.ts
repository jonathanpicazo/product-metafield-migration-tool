import nodeConfig from "config";
import { HasMetafieldsIdentifier } from "./types/shopify";

interface Config {
  key: {
    storefront: string;
    admin: string;
  };
  storename: {
    storefront: string;
    admin: string;
  };
  apiVersion: {
    storefront: string;
    admin: string;
  };
  metafieldIdentifiers: {
    product: HasMetafieldsIdentifier[];
    variant: HasMetafieldsIdentifier[];
  };
}

const config: Config = {
  key: {
    storefront: nodeConfig.get<string>("key.storefront"),
    admin: nodeConfig.get<string>("key.admin"),
  },
  storename: {
    storefront: nodeConfig.get<string>("storename.storefront"),
    admin: nodeConfig.get<string>("storename.admin"),
  },
  apiVersion: {
    storefront: nodeConfig.get<string>("apiVersion.storefront"),
    admin: nodeConfig.get<string>("apiVersion.admin"),
  },
  metafieldIdentifiers: {
    product: nodeConfig.get<HasMetafieldsIdentifier[]>(
      "metafieldIdentifiers.product"
    ),
    variant: nodeConfig.get<HasMetafieldsIdentifier[]>(
      "metafieldIdentifiers.variant"
    ),
  },
};
export default config;
