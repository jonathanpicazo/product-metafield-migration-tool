/**
 * This file contains util functions used for fetching or parsing data
 */

import config from "../config";
import fetch from "node-fetch";
import * as CSVWriter from "csv-writer";
import path from "path";
import { fileURLToPath } from "url";
import type { CSVRecord, CSVWriterType } from "../lib";

export const fetchStorefrontSource = async (
  query: string,
  variables?: any
): Promise<any> => {
  try {
    const sourceKey = config.apiKey.storefront;
    const sourceStorefrontName = config.storename.storefront;
    const sourceApiVer = config.apiVersion.storefront;
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
    const destinationKey = config.apiKey.admin;
    const destinationStorefrontName = config.storename.admin;
    const destinationApiVer = config.apiVersion.admin;
    const url = `https://${destinationStorefrontName}.myshopify.com/admin/api/${destinationApiVer}/graphql.json`;
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

export const initializeCSV = () => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const createCSVWriter = CSVWriter.createObjectCsvWriter;
  const csvWriter = createCSVWriter({
    path: path.join(__dirname, "../../progress-logs/progress.csv"),
    header: [
      { id: "handle", title: "Handle" },
      { id: "sku", title: "SKU" },
      { id: "metafields", title: "Metafields Set" },
      { id: "outcome", title: "Outcome" },
    ],
  });
  return csvWriter;
};

export const writeCSVColumn = async (
  csvWriter: CSVWriterType,
  record: CSVRecord
) => {
  const csvRes = await csvWriter.writeRecords([record]);
  return csvRes;
};

export const checkConfig = () => {
  if (
    !config.apiKey.admin ||
    !config.apiKey.storefront ||
    !config.storename.admin ||
    !config.storename.storefront ||
    !config.apiVersion.admin ||
    !config.apiVersion.storefront
  ) {
    return false;
  }
  return true;
};
