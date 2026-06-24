"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageHero } from "@/components/layout/page-hero";
import { OutcomeBadge } from "@/components/rfp/historical-rfp-table";
import { ProposalSynthesis } from "@/components/rfp/proposal-synthesis";
import { RequirementsView } from "@/components/rfp/risk-panel";
import {
  RfpDetailHeader,
  SolutionBriefView,
} from "@/components/rfp/solution-brief-view";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/rfp-utils";
import { getHistoricalRfpById } from "@/lib/historical-search";
import { ArrowLeft, Archive } from "lucide-react";

export function HistoricalRfpDetailPage({ id }: { id: string }) {
  const rfp = getHistoricalRfpById(id);

  if (!rfp) {
    return (
      <AppShell>
        <div className="space-y-10">
          <PageHero title="Document Not Found" size="compact" />
          <div className="flex flex-col items-center justify-center gap-4 py-16">
            <p className="text-muted-foreground">
              This historical RFP could not be found.
            </p>
            <Button asChild variant="outline">
              <Link href="/historical">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Archive
              </Link>
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-10">
        <PageHero
          title={rfp.campaign}
          description={`${rfp.advertiser} · ${rfp.agency} · Archived ${formatDate(rfp.completedAt)}`}
          size="compact"
        />

        <div>
          <div className="mb-4 flex items-center justify-between">
            <Button asChild variant="ghost" size="sm" className="-ml-2">
              <Link href="/historical">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Historical RFPs
              </Link>
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Archive className="h-4 w-4" />
              Read-only archive
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <OutcomeBadge outcome={rfp.outcome} />
              {rfp.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs font-normal">
                  {tag}
                </Badge>
              ))}
            </div>

            <RfpDetailHeader
              advertiser={rfp.advertiser}
              campaign={rfp.campaign}
              agency={rfp.agency}
              owner={rfp.owner}
              deadline={rfp.deadline}
              status={rfp.status}
              complexity={rfp.complexity}
              riskLevel={rfp.riskLevel}
              percentComplete={rfp.percentComplete}
              currentStage={rfp.currentStage}
              nextAction={rfp.nextAction}
            />

            <Tabs defaultValue="brief" className="w-full">
              <TabsList className="mb-4 flex-wrap">
                <TabsTrigger value="brief">Solution Brief</TabsTrigger>
                <TabsTrigger value="requirements">Intake Notes</TabsTrigger>
                <TabsTrigger value="proposal">Final Proposal</TabsTrigger>
              </TabsList>

              <TabsContent value="brief">
                <SolutionBriefView brief={rfp.solutionBrief} />
              </TabsContent>

              <TabsContent value="requirements">
                <RequirementsView
                  intakeNotes={rfp.intakeNotes}
                  missingFields={[]}
                  clarificationItems={[]}
                />
              </TabsContent>

              <TabsContent value="proposal">
                <ProposalSynthesis draft={rfp.proposalDraft} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
