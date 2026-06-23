"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AgentProcessingTimeline } from "@/components/rfp/agent-processing-timeline";
import { OutcomeBadge } from "@/components/rfp/historical-rfp-table";
import {
  aiSearchHistoricalRfps,
  SEARCH_PROCESSING_STEPS,
} from "@/lib/historical-search";
import type { HistoricalSearchResult } from "@/types/historical";
import { ArrowRight, Loader2, Search, Sparkles } from "lucide-react";

const EXAMPLE_QUERIES = [
  "NFL sponsorship with brand lift study",
  "Gambling category with legal review",
  "MLB moment-based video activation",
  "College sports Fan Graph audiences",
];

export function HistoricalSearchPanel() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<HistoricalSearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  const runSearch = useCallback(async (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    setIsSearching(true);
    setHasSearched(true);
    setResults([]);
    setProcessingStep(0);

    const stepInterval = setInterval(() => {
      setProcessingStep((s) =>
        s < SEARCH_PROCESSING_STEPS.length - 1 ? s + 1 : s
      );
    }, 200);

    try {
      const searchResults = await aiSearchHistoricalRfps(trimmed);
      setResults(searchResults);
    } finally {
      clearInterval(stepInterval);
      setProcessingStep(SEARCH_PROCESSING_STEPS.length - 1);
      setIsSearching(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(query);
  };

  return (
    <div className="space-y-6">
      <Card className="surface-card overflow-hidden border-lavenderGrey/60">
        <CardContent className="p-6">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple/10 to-lightPurple/20 ring-1 ring-purple/20">
              <Sparkles className="h-5 w-5 text-purple" />
            </div>
            <div>
              <h3 className="font-heading text-base font-semibold text-navy">
                AI Document Search
              </h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Describe what you&apos;re looking for in natural language — similar
                campaigns, products, sports, or measurement requirements.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='e.g. "NFL brand lift study with sponsorship integration"'
                className="pl-9"
                disabled={isSearching}
              />
            </div>
            <Button type="submit" disabled={isSearching || !query.trim()}>
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground">Try:</span>
            {EXAMPLE_QUERIES.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => {
                  setQuery(example);
                  runSearch(example);
                }}
                disabled={isSearching}
                className="rounded-full bg-lightGrey/60 px-3 py-1 text-xs text-navy/70 transition-colors hover:bg-lightBlue/20 hover:text-navy disabled:opacity-50"
              >
                {example}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {isSearching && (
        <AgentProcessingTimeline
          steps={[...SEARCH_PROCESSING_STEPS]}
          currentStep={processingStep}
          title="AI Search Processing"
          description="Analyzing your query against the historical RFP archive..."
        />
      )}

      {!isSearching && hasSearched && results.length === 0 && (
        <div className="surface-card flex flex-col items-center justify-center px-6 py-12 text-center">
          <p className="text-sm font-medium text-navy">No similar documents found</p>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            Try broadening your search — use sport names, product types, or
            measurement requirements.
          </p>
        </div>
      )}

      {!isSearching && results.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {results.length} similar document{results.length !== 1 ? "s" : ""} found
          </p>
          {results.map((result) => (
            <Link
              key={result.id}
              href={`/historical/${result.id}`}
              className="surface-card group block rounded-xl p-5 transition-all hover:ring-2 hover:ring-blue/20"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-heading font-semibold text-navy group-hover:text-blue">
                      {result.record.advertiser} — {result.record.campaign}
                    </h4>
                    <OutcomeBadge outcome={result.record.outcome} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {result.record.agency} · Completed{" "}
                    {new Date(result.record.completedAt).getFullYear()}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-navy/80">
                    {result.snippet}
                  </p>
                  {result.matchedFields.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {result.matchedFields.slice(0, 4).map((field) => (
                        <Badge
                          key={field}
                          variant="secondary"
                          className="text-[10px] font-normal capitalize"
                        >
                          {field.replace(/([A-Z])/g, " $1").trim()}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <div className="rounded-lg bg-lightBlue/10 px-2.5 py-1 text-xs font-semibold tabular-nums text-blue">
                    {Math.round(result.score * 10)}% match
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-blue" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
