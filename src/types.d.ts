type FileStatus = "FAILED" | "PROCESSING" | "READY" | "UPLOADED";
type FileContentType = "FILE" | "IMAGE" | "VIDEO";

type FileCreateInput = {
  alt: string;
  contentType: FileContentType;
  originalSource: string;
};

type File = {
  alt: string;
  createdAt: string;
  fileStatus: FileStatus;
  preview: {
    image: Image;
    status: FileStatus;
  };
};

type Image = {
  altText: string;
  height: number;
  id: string;
  url: string;
  width: number;
};

type ProductVariant = {
  id: string;
  title: string;
  selectedOptions: { name: string; value: string }[];
};

export type Product = {
  id: string;
  variants:
    | {
        edges: {
          node: ProductVariant;
        }[];
      }
    | { nodes: ProductVariant[] };
};
