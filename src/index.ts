import { migrateMetafields } from "./functions";

import * as csvWriter from "csv-writer";

// import config from "./lib/config";
// import * as config from "config";
const loopProducts = async (productHandles: string[]) => {
  for (const handle of productHandles) {
    const response = await migrateMetafields(handle);
  }
};

// main
// console.log("config", config);
console.log("createCSV", csvWriter);
// const res = await loopProducts([
//   "test-multi",
//   "original-hold-pomade-1",
//   "test-multi",
// ]);
