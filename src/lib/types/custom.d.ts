import type { CsvWriter } from "csv-writer/src/lib/csv-writer";
import type { ObjectMap } from "csv-writer/src/lib/lang/object";

export interface CSVRecord {
  handle: string;
  sku: string;
  metafields: string;
  outcome: string;
}

export type CSVWriterType = CsvWriter<ObjectMap<any>>;

export interface Config {
  apiKey: {
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
