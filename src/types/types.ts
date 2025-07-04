export type Index = {
  health: string;
  status: string;
  index: string;
  uuid: string;
  pri: string;
  rep: string;
  "docs.count": string;
  "docs.deleted": string;
  "store.size": string;
  "pri.store.size": string;
  alias?: string;
  lastModified: Date;
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

export interface AggregationParams {
  aggType: string;
  field: string;
  interval?: number;
  size?: number;
}

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
