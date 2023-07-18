/**
 * This file contains the main logic
 * Functions are defined in /functions
 */
import { initializeCSV, startMigration, checkConfig } from "./functions";

const csvWriter = initializeCSV();
const isValidConfig = checkConfig();
if (isValidConfig) {
  console.log("Starting metafield migration");
  const res = await startMigration(null, csvWriter);
} else {
  console.log(
    "Invalid config! Please update your .env file to contain all fields."
  );
}
