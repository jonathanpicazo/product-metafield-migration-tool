/*
  utility functions used to fetch/parse data
*/

import "dotenv/config";
import fetch from "node-fetch";

const retailKey = process.env.RETAIL_SHOPIFY_STOREFRONT_KEY as string;
const wholesaleKey = process.env.WHOLESALE_STAGING_SHOPIFY_ADMIN_KEY as string;

export const fetchRetailStorefront = async (
  query: string,
  variables?: any
): Promise<any> => {
  try {
    const url = `https://suavecito.myshopify.com/api/2023-04/graphql.json`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": retailKey,
      },
      body: JSON.stringify({ query, variables }),
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    console.error("ERROR", err);
  }
};

export const fetchWholesaleStagingAdmin = async (
  query: string,
  variables?: any
): Promise<any> => {
  try {
    const url = `https://staging-suavecito-wholesale.myshopify.com/admin/api/2023-04/graphql.json`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": wholesaleKey,
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
}) => {
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
