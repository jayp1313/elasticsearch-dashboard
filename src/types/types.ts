// lib/types.ts
export interface Index {
  indexName: string;
  alias: string | null;
  documentCount: number;
  healthStatus: "green" | "yellow" | "red";
  lastModified: string; // ISO string, not Date
}

export interface Settings {
  oldIndexesToKeep: number;
  deltaUpdateFrequency: number;
  fullReindexFrequency: number;
}

export interface Mapping {
  properties: Record<string, { type: string }>;
}
