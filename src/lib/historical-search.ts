import type {
  HistoricalRfpRecord,
  HistoricalSearchResult,
  RfpOutcome,
} from "@/types/historical";
import { HISTORICAL_RFPS } from "@/lib/historical-data";

export const SEARCH_PROCESSING_STEPS = [
  "Parsing search intent",
  "Scanning historical archive",
  "Matching requirements & products",
  "Ranking by relevance",
  "Preparing result snippets",
] as const;

const FIELD_WEIGHTS: Record<string, number> = {
  advertiser: 3,
  campaign: 3,
  tags: 2.5,
  summary: 2,
  intakeNotes: 1.5,
  objective: 1.5,
  kpi: 1,
  products: 2,
  proposal: 1,
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

function flattenRecord(record: HistoricalRfpRecord): Record<string, string> {
  const { solutionBrief: b, proposalDraft: p } = record;
  return {
    advertiser: record.advertiser,
    campaign: record.campaign,
    agency: record.agency,
    tags: record.tags.join(" "),
    summary: record.summary,
    intakeNotes: record.intakeNotes ?? "",
    objective: b.business.objective,
    kpi: b.business.kpi,
    products: b.recommendedProducts.join(" "),
    audience: b.audience.target,
    markets: b.audience.markets,
    channels: b.activation.channels,
    sponsorship: b.activation.sponsorshipNeeds,
    moments: b.activation.momentsTriggers,
    measurement: `${b.measurement.liftStudy} ${b.measurement.attribution}`,
    proposal: [
      p.executiveSummary,
      p.strategicRecommendation,
      p.audienceStrategy,
      p.activationPlan,
      p.measurementPlan,
    ].join(" "),
  };
}

function scoreRecord(
  record: HistoricalRfpRecord,
  queryTokens: string[]
): { score: number; matchedFields: string[]; snippet: string } {
  const fields = flattenRecord(record);
  let score = 0;
  const matchedFields: string[] = [];

  for (const [field, weight] of Object.entries(FIELD_WEIGHTS)) {
    const fieldText = fields[field]?.toLowerCase() ?? "";
    if (!fieldText) continue;

    const fieldTokens = tokenize(fieldText);
    let fieldMatches = 0;

    for (const qt of queryTokens) {
      if (fieldText.includes(qt)) {
        fieldMatches++;
      } else if (fieldTokens.some((ft) => ft.startsWith(qt) || qt.startsWith(ft))) {
        fieldMatches += 0.5;
      }
    }

    if (fieldMatches > 0) {
      score += fieldMatches * weight;
      matchedFields.push(field);
    }
  }

  // Boost exact phrase matches in summary/intake
  const queryLower = queryTokens.join(" ");
  if (record.summary.toLowerCase().includes(queryLower)) score += 5;
  if (record.intakeNotes?.toLowerCase().includes(queryLower)) score += 3;

  const snippetSource =
    matchedFields.includes("summary")
      ? record.summary
      : matchedFields.includes("intakeNotes")
        ? (record.intakeNotes ?? record.summary)
        : matchedFields.includes("proposal")
          ? record.proposalDraft.executiveSummary
          : record.summary;

  const snippet = buildSnippet(snippetSource, queryTokens);

  return { score, matchedFields, snippet };
}

function buildSnippet(text: string, queryTokens: string[]): string {
  const lower = text.toLowerCase();
  let bestIdx = 0;

  for (const qt of queryTokens) {
    const idx = lower.indexOf(qt);
    if (idx >= 0) {
      bestIdx = idx;
      break;
    }
  }

  const start = Math.max(0, bestIdx - 60);
  const end = Math.min(text.length, start + 180);
  let snippet = text.slice(start, end).trim();

  if (start > 0) snippet = "…" + snippet;
  if (end < text.length) snippet = snippet + "…";

  return snippet;
}

export function searchHistoricalRfps(
  query: string,
  filters?: { outcome?: RfpOutcome; year?: string; advertiser?: string }
): HistoricalSearchResult[] {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  let pool = HISTORICAL_RFPS;

  if (filters?.outcome) {
    pool = pool.filter((r) => r.outcome === filters.outcome);
  }
  if (filters?.year) {
    pool = pool.filter((r) => r.completedAt.startsWith(filters.year!));
  }
  if (filters?.advertiser) {
    const adv = filters.advertiser.toLowerCase();
    pool = pool.filter((r) => r.advertiser.toLowerCase().includes(adv));
  }

  const results = pool
    .map((record) => {
      const { score, matchedFields, snippet } = scoreRecord(record, queryTokens);
      return { id: record.id, score, snippet, matchedFields, record };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  return results;
}

/**
 * Simulates semantic AI search with latency.
 * Future integration: Vercel AI SDK + embeddings API.
 */
export async function aiSearchHistoricalRfps(
  query: string,
  filters?: { outcome?: RfpOutcome; year?: string; advertiser?: string }
): Promise<HistoricalSearchResult[]> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return searchHistoricalRfps(query, filters);
}

export function filterHistoricalRfps(filters: {
  search?: string;
  outcome?: RfpOutcome | "all";
  year?: string | "all";
}): HistoricalRfpRecord[] {
  let results = HISTORICAL_RFPS;

  if (filters.outcome && filters.outcome !== "all") {
    results = results.filter((r) => r.outcome === filters.outcome);
  }
  if (filters.year && filters.year !== "all") {
    results = results.filter((r) => r.completedAt.startsWith(filters.year!));
  }
  if (filters.search?.trim()) {
    const scored = searchHistoricalRfps(filters.search);
    const ids = new Set(scored.map((s) => s.id));
    results = results.filter((r) => ids.has(r.id));
  }

  return results.sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );
}

export function getHistoricalRfpById(id: string): HistoricalRfpRecord | undefined {
  return HISTORICAL_RFPS.find((r) => r.id === id);
}

export function getHistoricalYears(): string[] {
  const years = new Set(
    HISTORICAL_RFPS.map((r) => r.completedAt.slice(0, 4))
  );
  return Array.from(years).sort((a, b) => b.localeCompare(a));
}
