import { Index, Settings, Mapping } from "@/types/types";

export const mockIndexes: Index[] = [
  {
    indexName: "product_20230628_120000",
    alias: "products",
    documentCount: 10000,
    healthStatus: "green",
    lastModified: "2023-06-28T12:00:00Z", // ISO string, serializable
  },
  {
    indexName: "product_20230627_120000",
    alias: null,
    documentCount: 9500,
    healthStatus: "yellow",
    lastModified: "2023-06-27T12:00:00Z",
  },
  {
    indexName: "product_20230626_120000",
    alias: null,
    documentCount: 9000,
    healthStatus: "green",
    lastModified: "2023-06-26T12:00:00Z",
  },
];

export const mockSettings: Settings = {
  oldIndexesToKeep: 3,
  deltaUpdateFrequency: 60,
  fullReindexFrequency: 1440,
};

export const mockMapping: Mapping = {
  properties: {
    ProductName: { type: "text" },
    Description: { type: "text" },
    RecordId: { type: "long" },
    ItemId: { type: "keyword" },
    Price: { type: "float" },
  },
};
