# Wholesale Metafield Migration Tool

## Description

This tool will migrate the product and variant metafield values from one store to another. Metafields of type image files will upload the images to the destination store.

## Usage

### Metafield Type Support

The only metafield reference supported is of type MediaImages. So a metafield that holds an image or a list of images is supported. Any other reference type is not supported. All other metafield values that arent references are supported. The metafield list type is also supported. This fits our current use case.

### Configuration

Fill out the .env file according to this example

```
SOURCE_SHOPIFY_STOREFRONT_KEY={OLD STORE STOREFRONT KEY}
SOURCE_SHOPIFY_STOREFRONT_NAME=oldstore
SOURCE_SHOPIFY_API_VERSION=2023-04
DESTINATION_SHOPIFY_ADMIN_KEY={NEW STORE ADMIN API KEY}
DESTINATION_SHOPIFY_STOREFRONT_NAME=newstore
DESTINATION_SHOPIFY_API_VERSION=2023-04

```

**The suggested shopify admin and storefront api version is 04/23**

### Installation

Clone the repo and make sure to fill out the .env according to the example and config with the metafields you want to copy over to your new store.
