"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { AdvertiserLogo } from "@/components/rfp/advertiser-logo";
import { ComplexityBadge, RiskBadge } from "@/components/rfp/risk-badge";
import { StatusBadge } from "@/components/rfp/status-badge";
import { formatDate } from "@/lib/rfp-utils";
import type { SolutionBrief } from "@/types/rfp";
import { ArrowRight, Calendar, User } from "lucide-react";

function BriefSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h4>
      <dl className="space-y-2">{children}</dl>
    </div>
  );
}

function BriefField({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-3">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-navy sm:col-span-2">{value || "—"}</dd>
    </div>
  );
}

export function SolutionBriefView({ brief }: { brief: SolutionBrief }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="surface-card surface-card-hover">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-navy">
              Opportunity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BriefSection title="">
              <BriefField label="Advertiser" value={brief.opportunity.advertiser} />
              <BriefField label="Agency" value={brief.opportunity.agency} />
              <BriefField label="Campaign" value={brief.opportunity.campaign} />
              <BriefField label="Owner" value={brief.opportunity.owner} />
            </BriefSection>
          </CardContent>
        </Card>

        <Card className="surface-card surface-card-hover">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-navy">Timing</CardTitle>
          </CardHeader>
          <CardContent>
            <BriefField label="Flight" value={brief.timing.flight} />
            <BriefField label="Deadline" value={brief.timing.deadline} />
          </CardContent>
        </Card>

        <Card className="surface-card surface-card-hover">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-navy">Business</CardTitle>
          </CardHeader>
          <CardContent>
            <BriefField label="Objective" value={brief.business.objective} />
            <BriefField label="KPI" value={brief.business.kpi} />
            <BriefField label="Budget" value={brief.business.budget} />
          </CardContent>
        </Card>

        <Card className="surface-card surface-card-hover">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-navy">Audience</CardTitle>
          </CardHeader>
          <CardContent>
            <BriefField label="Target" value={brief.audience.target} />
            <BriefField label="Markets" value={brief.audience.markets} />
            <BriefField label="Exclusions" value={brief.audience.exclusions} />
          </CardContent>
        </Card>

        <Card className="surface-card surface-card-hover">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-navy">
              Activation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BriefField label="Channels" value={brief.activation.channels} />
            <BriefField label="PMP" value={brief.activation.pmp} />
            <BriefField label="DSP" value={brief.activation.dsp} />
            <BriefField label="Sponsorship" value={brief.activation.sponsorshipNeeds} />
            <BriefField label="Moments" value={brief.activation.momentsTriggers} />
          </CardContent>
        </Card>

        <Card className="surface-card surface-card-hover">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-navy">
              Measurement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BriefField label="Attribution" value={brief.measurement.attribution} />
            <BriefField label="Lift Study" value={brief.measurement.liftStudy} />
            <BriefField label="Reporting" value={brief.measurement.reporting} />
            <BriefField label="Enrichment" value={brief.measurement.enrichment} />
          </CardContent>
        </Card>
      </div>

      <Card className="surface-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-navy">
            Recommended Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {brief.recommendedProducts.map((product) => (
              <span
                key={product}
                className="rounded-full bg-lightPurple/30 px-3 py-1 text-xs font-medium text-purple"
              >
                {product}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function RfpDetailHeader({
  advertiser,
  campaign,
  agency,
  owner,
  deadline,
  status,
  complexity,
  riskLevel,
  percentComplete,
  currentStage,
  nextAction,
}: {
  advertiser: string;
  campaign: string;
  agency: string;
  owner: string;
  deadline: string;
  status: import("@/types/rfp").RfpStatus;
  complexity: import("@/types/rfp").Complexity;
  riskLevel: import("@/types/rfp").RiskLevel;
  percentComplete: number;
  currentStage: string;
  nextAction: string;
}) {
  return (
    <div className="surface-card overflow-hidden p-0">
      <div className="border-b border-lavenderGrey/60 bg-gradient-to-r from-lightGrey/60 via-white to-lightPurple/20 px-5 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Solution Brief · Source of Truth
        </p>
        <div className="mt-2 flex items-start gap-4">
          <AdvertiserLogo name={advertiser} size="md" />
          <div className="min-w-0">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-navy">
              {campaign}
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {advertiser} · {agency}
            </p>
          </div>
        </div>
      </div>
      <div className="p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {owner}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Due {formatDate(deadline)}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={status} />
          <ComplexityBadge complexity={complexity} />
          <RiskBadge level={riskLevel} />
        </div>
      </div>

      <div className="mt-5 grid gap-4 border-t border-lavenderGrey pt-5 md:grid-cols-2">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Current Stage</p>
          <p className="mt-1 text-sm font-medium text-navy">{currentStage}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">Next Action</p>
          <p className="mt-1 flex items-start gap-1 text-sm font-medium text-blue">
            <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {nextAction}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs text-muted-foreground">
          <span>Overall Progress</span>
          <span>{percentComplete}%</span>
        </div>
        <Progress
          value={percentComplete}
          className="h-2 bg-lavenderGrey/60 [&>div]:bg-gradient-to-r [&>div]:from-blue [&>div]:to-lightBlue"
        />
      </div>
      </div>
    </div>
  );
}
