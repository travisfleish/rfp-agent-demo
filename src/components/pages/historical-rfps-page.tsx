"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { HistoricalRfpTable } from "@/components/rfp/historical-rfp-table";
import { HistoricalSearchPanel } from "@/components/rfp/historical-search-panel";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HISTORICAL_RFPS } from "@/lib/historical-data";
import { filterHistoricalRfps, getHistoricalYears } from "@/lib/historical-search";
import type { RfpOutcome } from "@/types/historical";
import { Archive, Search, Sparkles } from "lucide-react";

export function HistoricalRfpsPage() {
  const [search, setSearch] = useState("");
  const [outcome, setOutcome] = useState<RfpOutcome | "all">("all");
  const [year, setYear] = useState<string>("all");

  const years = useMemo(() => getHistoricalYears(), []);

  const filteredRfps = useMemo(
    () => filterHistoricalRfps({ search, outcome, year }),
    [search, outcome, year]
  );

  return (
    <AppShell
      title="Historical RFPs"
      description={`${HISTORICAL_RFPS.length} completed opportunities in the archive`}
    >
      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="mb-6 flex h-auto gap-1 bg-white p-1">
          <TabsTrigger value="browse" className="gap-2">
            <Archive className="h-4 w-4" />
            Browse
          </TabsTrigger>
          <TabsTrigger value="search" className="gap-2">
            <Sparkles className="h-4 w-4" />
            AI Search
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by advertiser, campaign, or keyword..."
                className="pl-9"
              />
            </div>
            <Select
              value={outcome}
              onValueChange={(v) => setOutcome(v as RfpOutcome | "all")}
            >
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Outcome" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All outcomes</SelectItem>
                <SelectItem value="Won">Won</SelectItem>
                <SelectItem value="Lost">Lost</SelectItem>
                <SelectItem value="No Bid">No Bid</SelectItem>
              </SelectContent>
            </Select>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-full sm:w-[120px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All years</SelectItem>
                {years.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <HistoricalRfpTable rfps={filteredRfps} />
        </TabsContent>

        <TabsContent value="search">
          <HistoricalSearchPanel />
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
