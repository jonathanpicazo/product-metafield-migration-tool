/*
  utility functions used to fetch/parse data
*/

import "dotenv/config";
import fetch from "node-fetch";

const sourceKey = process.env.SOURCE_SHOPIFY_STOREFRONT_KEY as string;
const sourceStorefrontName = process.env
  .SOURCE_SHOPIFY_STOREFRONT_NAME as string;
const sourceApiVer = process.env.SOURCE_SHOPIFY_API_VERSION as string;
const destinationKey = process.env.DESTINATION_SHOPIFY_ADMIN_KEY as string;
const destinationStorefrontName = process.env
  .DESTINATION_SHOPIFY_STOREFRONT_NAME as string;
const destinationApiVer = process.env.DESTINATION_SHOPIFY_API_VERSION as string;

export const fetchStorefrontSource = async (
  query: string,
  variables?: any
): Promise<any> => {
  try {
    const url = `https://${sourceStorefrontName}.myshopify.com/api/${sourceApiVer}/graphql.json`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": sourceKey,
      },
      body: JSON.stringify({ query, variables }),
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    console.error("ERROR", err);
  }
};

export const fetchAdminDestination = async (
  query: string,
  variables?: any
): Promise<any> => {
  try {
    const url = `https://${destinationStorefrontName}.myshopify.com/admin/api/${destinationApiVer}/graphql.json`;
    console.log("admin using url", url);
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": destinationKey,
      },
      body: JSON.stringify({ query, variables }),
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    console.error("ERROR", err);
  }
};

export const flattenConnection = (connectionArray: {
  edges?: { node: any }[];
  nodes?: any[];
}): any[] => {
  if (!connectionArray) return [];
  if (
    !Array.isArray(connectionArray.edges) &&
    !Array.isArray(connectionArray.nodes)
  ) {
    return [];
  }
  if (connectionArray.edges) {
    return connectionArray.edges.map((el) => ({ ...el.node }));
  } else if (connectionArray.nodes) {
    return connectionArray.nodes.map((el) => el);
  } else {
    return [];
  }
};

export const isEmpty = (array: any[]): boolean => {
  if (array && array.length === 0) {
    return true;
  }
  return false;
};

export const prettyPrint = (obj: {}) => {
  if (typeof obj !== "object") {
    return "please pass an object into this function, pretty print failed";
  }
  return JSON.stringify(obj, null, 2);
};
