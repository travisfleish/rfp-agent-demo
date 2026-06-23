import type { RfpRecord } from "@/types/rfp";

export type RfpOutcome = "Won" | "Lost" | "No Bid";

export interface HistoricalRfpRecord extends RfpRecord {
  completedAt: string;
  outcome: RfpOutcome;
  tags: string[];
  summary: string;
}

export interface HistoricalSearchResult {
  id: string;
  score: number;
  snippet: string;
  matchedFields: string[];
  record: HistoricalRfpRecord;
}
