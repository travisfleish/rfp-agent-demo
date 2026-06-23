"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { RfpTable } from "@/components/rfp/rfp-table";
import { SummaryCard } from "@/components/rfp/summary-cards";
import { Button } from "@/components/ui/button";
import { useRfpStore } from "@/providers/rfp-provider";
import {
  countActiveRfps,
  countAtRisk,
  countAwaitingInputs,
  countDueThisWeek,
} from "@/lib/rfp-utils";
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  ClipboardList,
  FilePlus2,
  FileStack,
  Sparkles,
} from "lucide-react";

export function DashboardPage() {
  const { rfps, isLoaded } = useRfpStore();

  const activeRfps = rfps.filter((r) => r.status !== "Complete");

  if (!isLoaded) {
    return (
      <AppShell title="Dashboard" showPipeline>
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          Loading RFPs...
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Dashboard"
      description="Active RFP opportunities and pipeline status"
      showPipeline
      headerAction={
        <Button asChild className="bg-navy text-white shadow-sm hover:bg-navy/90">
          <Link href="/new">
            <FilePlus2 className="mr-2 h-4 w-4" />
            New RFP
          </Link>
        </Button>
      }
    >
      <div className="space-y-8">
        <div className="surface-card overflow-hidden border-l-4 border-l-blue p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl space-y-2">
              <div className="accent-chip">
                <Sparkles className="h-3 w-3" />
                AI-Powered Intake
              </div>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-navy md:text-3xl">
                Media RFP Operating System
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Turn unstructured advertiser requests into structured Solution Briefs,
                route internal workstreams, and synthesize proposal drafts — all in one flow.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="shrink-0 bg-navy text-white shadow-sm hover:bg-navy/90"
            >
              <Link href="/new">
                Start Intake
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Active RFPs"
            value={countActiveRfps(rfps)}
            description="Opportunities in progress"
            icon={FileStack}
            accent="blue"
          />
          <SummaryCard
            title="Due This Week"
            value={countDueThisWeek(rfps)}
            description="Deadlines within 7 days"
            icon={CalendarClock}
            accent="orange"
          />
          <SummaryCard
            title="At Risk"
            value={countAtRisk(rfps)}
            description="High risk level flagged"
            icon={AlertTriangle}
            accent="red"
          />
          <SummaryCard
            title="Awaiting Internal Inputs"
            value={countAwaitingInputs(rfps)}
            description="Pending workstream responses"
            icon={ClipboardList}
            accent="purple"
          />
        </div>

        <div>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-xl font-semibold text-navy">
                Active Opportunities
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {activeRfps.length} RFP{activeRfps.length !== 1 ? "s" : ""} in pipeline
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <Link href="/rfps">
                View all
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
          <RfpTable rfps={activeRfps} />
        </div>
      </div>
    </AppShell>
  );
}
