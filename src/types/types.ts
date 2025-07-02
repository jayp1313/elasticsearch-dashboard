export type Index = {
  indexName: string;
  alias?: string;
  documentCount: number;
  healthStatus: "green" | "yellow" | "red";
  lastModified: string;
};

export type MappingProperty = {
  type: string;
};

export type Mapping = {
  [indexName: string]: {
    mappings: {
      properties: {
        [fieldName: string]: MappingProperty;
      };
    };
  };
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

export type SynonymRule = {
  id: string;
  synonyms: string;
};

export type SynonymSet = {
  count: number;
  synonyms_set: SynonymRule[];
};
