export type Index = {
  indexName: string;
  alias?: string;
  documentCount: number;
  healthStatus: "green" | "yellow" | "red";
  lastModified: string;
};

export type Mapping = {
  properties: Record<string, { type: string }>;
};

export type Settings = {
  oldIndexesToKeep: number;
  deltaUpdateFrequency: number;
  fullReindexFrequency: number;
};

export type Aggregation = {
  id: string;
  name: string;
  type: string;
  field: string;
  enabled: boolean;
};

export type Stopword = {
  id: string;
  value: string;
};

export type Synonym = {
  id: string;
  terms: string[];
};
