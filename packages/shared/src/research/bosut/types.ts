export type SourceType =
  | "institute"
  | "scientific"
  | "official"
  | "media"
  | "practical"
  | "market";

export type ClaimCategory =
  | "registration"
  | "morphology"
  | "planting"
  | "spacing"
  | "fertilization"
  | "protection"
  | "irrigation"
  | "harvest"
  | "storage"
  | "yield"
  | "economics"
  | "disease"
  | "general";

export type NumericRange = {
  min?: number;
  max?: number;
  value?: number;
  unit?: string;
};

export type ResearchClaim = {
  category: ClaimCategory;
  attribute: string;
  value: string | NumericRange;
  rawText: string;
  confidence: "high" | "medium" | "low";
};

export type ResearchSource = {
  id: string;
  title: string;
  url: string;
  type: SourceType;
  language: "sr" | "en";
  publishedAt?: string;
  author?: string;
  scrapedAt: string;
  excerpt?: string;
  claims: ResearchClaim[];
};

export type MetricComparison = {
  attribute: string;
  category: ClaimCategory;
  unit?: string;
  entries: {
    sourceId: string;
    sourceTitle: string;
    value: string;
    rawText: string;
  }[];
  consensus?: string;
  hasConflict: boolean;
  notes?: string;
};

export type OptimalRecommendation = {
  attribute: string;
  category: ClaimCategory;
  recommended: string;
  range?: NumericRange;
  rationale: string;
  sourceIds: string[];
  confidence: "high" | "medium" | "low";
};
