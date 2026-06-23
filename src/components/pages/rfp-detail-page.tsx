"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { ProposalSynthesis } from "@/components/rfp/proposal-synthesis";
import { RequirementsView, RiskPanel } from "@/components/rfp/risk-panel";
import {
  RfpDetailHeader,
  SolutionBriefView,
} from "@/components/rfp/solution-brief-view";
import { WorkstreamTracker } from "@/components/rfp/workstream-tracker";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { identifyMissingFields } from "@/lib/ai-logic";
import { useRfpStore } from "@/providers/rfp-provider";
import { ArrowLeft } from "lucide-react";

export function RfpDetailPage({ id }: { id: string }) {
  const { getRfp, isLoaded } = useRfpStore();
  const rfp = getRfp(id);

  if (!isLoaded) {
    return (
      <AppShell title="Loading...">
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          Loading RFP...
        </div>
      </AppShell>
    );
  }

  if (!rfp) {
    return (
      <AppShell title="RFP Not Found">
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <p className="text-muted-foreground">This RFP could not be found.</p>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  const missingFields = identifyMissingFields(rfp.solutionBrief);
  const clarificationItems =
    rfp.missingInputs && rfp.missingInputs.length > 0
      ? rfp.missingInputs
      : missingFields.map((f) => `Confirm ${f.toLowerCase()}`);

  return (
    <AppShell
      title={rfp.campaign}
      description={`${rfp.advertiser} · ${rfp.agency}`}
    >
      <div className="mb-4">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
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
          <TabsList className="mb-4 flex h-auto flex-wrap gap-1 bg-white p-1">
            <TabsTrigger value="brief">Solution Brief</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="workstreams">
              Workstreams ({rfp.workstreams.length})
            </TabsTrigger>
            <TabsTrigger value="risks">
              Risks ({rfp.risks.length})
            </TabsTrigger>
            <TabsTrigger value="proposal">Proposal Draft</TabsTrigger>
          </TabsList>

          <TabsContent value="brief">
            <SolutionBriefView brief={rfp.solutionBrief} />
          </TabsContent>

          <TabsContent value="requirements">
            <RequirementsView
              intakeNotes={rfp.intakeNotes}
              missingFields={missingFields}
              clarificationItems={clarificationItems}
            />
          </TabsContent>

          <TabsContent value="workstreams">
            <WorkstreamTracker workstreams={rfp.workstreams} rfpId={rfp.id} />
          </TabsContent>

          <TabsContent value="risks">
            <RiskPanel risks={rfp.risks} />
          </TabsContent>

          <TabsContent value="proposal">
            <ProposalSynthesis draft={rfp.proposalDraft} />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
