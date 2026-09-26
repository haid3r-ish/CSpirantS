export interface CoveredByEntry {
  source: string; // "The Nation"
  url: string;    // original article URL
}

export interface LlmDuplicateGroup {
  canonical: string;
  duplicates: string[];
}
