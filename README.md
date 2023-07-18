# Metafield Migration Tool

## Description

This is a node script utilizing the Shopify Storefront and Admin API to copy product and variant metafields from one store to another. Metafields will be copied over from a source store to a destination store. Metafields of type image files will be uploaded to the destination store. A CSV file will be created that keeps a log of all the metafields that have been updated.

NOTE: This tool does not create the metafield definitions for the metafields created for your destination store, so they will be created and found in metafields without destination if the two stores do not have the same metafield definitions.

## Usage

### Metafield Type Support

The only metafield reference supported is of type MediaImages. So a metafield that holds an image or a list of images is supported. Any other reference type is not supported. All other metafield values that arent references are supported. The metafield list type is also supported. This fits our current use case.

### Configuration

Fill out the .env file according to this example

```
SOURCE_SHOPIFY_STOREFRONT_KEY={OLD STORE STOREFRONT KEY}
SOURCE_SHOPIFY_STOREFRONT_NAME=oldstorename
SOURCE_SHOPIFY_API_VERSION=2023-04
DESTINATION_SHOPIFY_ADMIN_KEY={NEW STORE ADMIN API KEY}
DESTINATION_SHOPIFY_STOREFRONT_NAME=newstorename
DESTINATION_SHOPIFY_API_VERSION=2023-04
```

Also go into src/config.ts and add the metafields you want copied over in the metafieldIdentifiers.
Your config should look like this.

```
const config = {
  apiKey: {
    storefront: process.env.SOURCE_SHOPIFY_STOREFRONT_KEY,
    admin: process.env.DESTINATION_SHOPIFY_ADMIN_KEY,
  },
  storename: {
    storefront: process.env.SOURCE_SHOPIFY_STOREFRONT_NAME,
    admin: process.env.DESTINATION_SHOPIFY_STOREFRONT_NAME,
  },
  apiVersion: {
    storefront: process.env.DESTINATION_SHOPIFY_API_VERSION,
    admin: process.env.DESTINATION_SHOPIFY_API_VERSION,
  },
  metafieldIdentifiers: {
    product: [
      {
        key: "example_key",
        namespace: "example",
      },
      {
        key: "example_key2",
        namespace: "example",
      },
    ],
    variant: [
      {
        key: "example_v_key",
        namespace: "example",
      },
      {
        key: "example_v_key",
        namespace: "example",
      },
    ],
  },
};
```

**The suggested Shopify admin and storefront api version is 04/23 for this script!!!!**

### Installation

Clone the repo, run npm install, and **make sure to fill out the .env according to the example and config with the metafields you want to copy over to your new store**.
Then run

```
npm start
```

The script will run and output the product metafield status in progress-logs/progress.csv in CSV format. There is a console-output.txt with standard output logs.
This way you can see the mutations called in the destination store via the admin api.
