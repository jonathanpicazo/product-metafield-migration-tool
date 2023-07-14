type FileStatus = "FAILED" | "PROCESSING" | "READY" | "UPLOADED";
type FileContentType = "FILE" | "IMAGE" | "VIDEO";

export type FileCreateInput = {
  alt: string;
  contentType: FileContentType;
  originalSource: string;
  filename: string;
  duplicateResolutionMode: "APPEND_UUID" | "RAISE_ERROR" | "REPLACE";
};

export type File = {
  id: string;
  alt: string;
  createdAt: string;
  fileStatus: FileStatus;
  preview: {
    image: Image;
    status: FileStatus;
  };
};

export type Image = {
  id: string;
  url: string;
  altText: string;
  height: number;
  width: number;
};

export type ProductVariant = {
  id: string;
  title: string;
  selectedOptions: { name: string; value: string }[];
  sku: string;
  image: Image;
  images: {
    references: {
      nodes: Image[];
    };
  };
  fragranceMetafield: {
    value: string;
  };
  product: {
    handle: string;
    title: string;
  };
};

export type MetafieldsSetInput = {
  key: string;
  namespace: string;
  ownerId: string;
  type: "list.file_reference";
  value: string;
};

export type Product = {
  id: string;
  handle: string;
  variants:
    | {
        edges: {
          node: ProductVariant;
        }[];
      }
    | { nodes: ProductVariant[] };
};
