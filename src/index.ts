/**
 * This file contains the main logic
 * Functions are defined in /functions
 */
import { initializeCSV, startMigration } from "./functions";

const csvWriter = initializeCSV();
console.log("STARTING MIGRATION");
const res = await startMigration(null, csvWriter);
