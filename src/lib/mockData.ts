import {
  Aggregation,
  Index,
  Mapping,
  Settings,
  Stopword,
  Synonym,
} from "@/types/types";

export const mockIndexes: Index[] = [
  {
    indexName: "product-20230601",
    alias: "products",
    documentCount: 1245,
    healthStatus: "green",
    lastModified: "2023-06-15T14:30:00Z",
  },
  {
    indexName: "product-20230501",
    documentCount: 1200,
    healthStatus: "green",
    lastModified: "2023-05-15T10:15:00Z",
  },
  {
    indexName: "product-20230401",
    documentCount: 1180,
    healthStatus: "yellow",
    lastModified: "2023-04-20T09:45:00Z",
  },
  {
    indexName: "product-20230301",
    documentCount: 1150,
    healthStatus: "red",
    lastModified: "2023-03-10T16:20:00Z",
  },
];

export const mockMapping: Mapping = {
  properties: {
    ProductName: { type: "text" },
    Description: { type: "text" },
    Price: { type: "float" },
    Category: { type: "keyword" },
    InStock: { type: "boolean" },
    CreatedAt: { type: "date" },
  },
};

export const mockSettings: Settings = {
  oldIndexesToKeep: 3,
  deltaUpdateFrequency: 30,
  fullReindexFrequency: 1440,
};

export const mockAggregations: Aggregation[] = [
  {
    id: "1",
    name: "Category",
    type: "terms",
    field: "Category",
    enabled: true,
  },
  {
    id: "2",
    name: "Price Range",
    type: "range",
    field: "Price",
    enabled: false,
  },
  {
    id: "3",
    name: "In Stock",
    type: "filter",
    field: "InStock",
    enabled: true,
  },
];

export const mockStopwords: Stopword[] = [
  { id: "1", value: "and" },
  { id: "2", value: "the" },
  { id: "3", value: "to" },
  { id: "4", value: "in" },
];

export const mockSynonyms: Synonym[] = [
  { id: "1", terms: ["bike", "bicycle", "cycle"] },
  { id: "2", terms: ["tv", "television"] },
  { id: "3", terms: ["pc", "computer", "desktop"] },
];
