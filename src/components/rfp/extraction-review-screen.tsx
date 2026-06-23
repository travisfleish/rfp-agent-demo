"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ConfidenceBadge } from "@/components/rfp/confidence-badge";
import { MissingInputsPanel } from "@/components/rfp/missing-inputs-panel";
import { RiskPanel } from "@/components/rfp/risk-panel";
import type {
  AgentExtractionResult,
  ExtractedField,
  ExtractedSolutionBrief,
  FieldConfidence,
  Workstream,
} from "@/types/rfp";
import { Users } from "lucide-react";

function ExtractedFieldInput({
  label,
  field,
  onChange,
  multiline = false,
  className,
}: {
  label: string;
  field: ExtractedField;
  onChange: (value: string) => void;
  multiline?: boolean;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Label className="text-sm font-medium text-navy">{label}</Label>
        <ConfidenceBadge confidence={field.confidence} />
      </div>
      {multiline ? (
        <Textarea
          value={field.value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          className="resize-y font-body"
        />
      ) : (
        <Input value={field.value} onChange={(e) => onChange(e.target.value)} />
      )}
      {field.source && (
        <p className="text-xs text-muted-foreground">Source: {field.source}</p>
      )}
    </div>
  );
}

function ReviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-navy">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">{children}</CardContent>
    </Card>
  );
}

function WorkstreamReviewCard({ workstream }: { workstream: Workstream }) {
  const statusColors: Record<string, string> = {
    Requested: "bg-lightBlue/30 text-blue ring-1 ring-lightBlue/40",
    "In Progress": "bg-lightOrange/40 text-orange ring-1 ring-lightOrange/50",
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy/5">
              <Users className="h-4 w-4 text-navy" />
            </div>
            <CardTitle className="text-sm font-semibold text-navy">
              {workstream.team}
            </CardTitle>
          </div>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[workstream.status] ?? "bg-secondary text-muted-foreground ring-1 ring-border"}`}
          >
            {workstream.status}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Why routed</p>
          <p className="mt-1 text-navy">{workstream.routingReason}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">Requested input</p>
          <p className="mt-1 text-navy">{workstream.request}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ConfidenceBadge confidence={workstream.confidence as FieldConfidence} />
          {workstream.dependencies !== "None" && (
            <span className="text-xs text-muted-foreground">
              Depends on: {workstream.dependencies}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function ExtractionReviewScreen({
  result,
  onBriefChange,
}: {
  result: AgentExtractionResult;
  onBriefChange: (brief: ExtractedSolutionBrief) => void;
}) {
  const { brief, workstreams, risks, missingInputs } = result;

  const updateField = (
    section: keyof ExtractedSolutionBrief,
    field: string,
    value: string
  ) => {
    const sectionData = brief[section];
    if (typeof sectionData === "object" && sectionData !== null && field in sectionData) {
      onBriefChange({
        ...brief,
        [section]: {
          ...sectionData,
          [field]: {
            ...(sectionData as Record<string, ExtractedField>)[field],
            value,
          },
        },
      });
    }
  };

  const updateProducts = (value: string) => {
    const products = value.split(",").map((p) => p.trim()).filter(Boolean);
    onBriefChange({
      ...brief,
      recommendedProducts: {
        ...brief.recommendedProducts,
        value: products as ExtractedSolutionBrief["recommendedProducts"]["value"],
      },
    });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-navy">
          Review Extracted Solution Brief
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Confirm extracted fields before creating the RFP project. Edit any value that
          needs correction — low-confidence fields require human review.
        </p>
      </div>

      <MissingInputsPanel items={missingInputs} />

      <ReviewSection title="Opportunity">
        <ExtractedFieldInput
          label="Advertiser"
          field={brief.opportunity.advertiser}
          onChange={(v) => updateField("opportunity", "advertiser", v)}
        />
        <ExtractedFieldInput
          label="Agency"
          field={brief.opportunity.agency}
          onChange={(v) => updateField("opportunity", "agency", v)}
        />
        <ExtractedFieldInput
          label="Campaign"
          field={brief.opportunity.campaign}
          onChange={(v) => updateField("opportunity", "campaign", v)}
        />
        <ExtractedFieldInput
          label="Owner"
          field={brief.opportunity.owner}
          onChange={(v) => updateField("opportunity", "owner", v)}
        />
      </ReviewSection>

      <ReviewSection title="Timing">
        <ExtractedFieldInput
          label="Flight"
          field={brief.timing.flight}
          onChange={(v) => updateField("timing", "flight", v)}
        />
        <ExtractedFieldInput
          label="Deadline"
          field={brief.timing.deadline}
          onChange={(v) => updateField("timing", "deadline", v)}
        />
      </ReviewSection>

      <ReviewSection title="Business">
        <ExtractedFieldInput
          label="Objective"
          field={brief.business.objective}
          onChange={(v) => updateField("business", "objective", v)}
        />
        <ExtractedFieldInput
          label="KPI"
          field={brief.business.kpi}
          onChange={(v) => updateField("business", "kpi", v)}
        />
        <ExtractedFieldInput
          label="Budget"
          field={brief.business.budget}
          onChange={(v) => updateField("business", "budget", v)}
          className="sm:col-span-2"
        />
      </ReviewSection>

      <ReviewSection title="Audience">
        <ExtractedFieldInput
          label="Target"
          field={brief.audience.target}
          onChange={(v) => updateField("audience", "target", v)}
        />
        <ExtractedFieldInput
          label="Markets"
          field={brief.audience.markets}
          onChange={(v) => updateField("audience", "markets", v)}
        />
        <ExtractedFieldInput
          label="Exclusions"
          field={brief.audience.exclusions}
          onChange={(v) => updateField("audience", "exclusions", v)}
          multiline
          className="sm:col-span-2"
        />
      </ReviewSection>

      <ReviewSection title="Activation">
        <ExtractedFieldInput
          label="Channels"
          field={brief.activation.channels}
          onChange={(v) => updateField("activation", "channels", v)}
        />
        <ExtractedFieldInput
          label="PMP"
          field={brief.activation.pmp}
          onChange={(v) => updateField("activation", "pmp", v)}
        />
        <ExtractedFieldInput
          label="DSP"
          field={brief.activation.dsp}
          onChange={(v) => updateField("activation", "dsp", v)}
        />
        <ExtractedFieldInput
          label="Sponsorship Needs"
          field={brief.activation.sponsorshipNeeds}
          onChange={(v) => updateField("activation", "sponsorshipNeeds", v)}
        />
        <ExtractedFieldInput
          label="Moments / Triggers"
          field={brief.activation.momentsTriggers}
          onChange={(v) => updateField("activation", "momentsTriggers", v)}
          multiline
          className="sm:col-span-2"
        />
      </ReviewSection>

      <ReviewSection title="Measurement">
        <ExtractedFieldInput
          label="Attribution"
          field={brief.measurement.attribution}
          onChange={(v) => updateField("measurement", "attribution", v)}
        />
        <ExtractedFieldInput
          label="Brand Lift"
          field={brief.measurement.liftStudy}
          onChange={(v) => updateField("measurement", "liftStudy", v)}
        />
        <ExtractedFieldInput
          label="Reporting"
          field={brief.measurement.reporting}
          onChange={(v) => updateField("measurement", "reporting", v)}
        />
        <ExtractedFieldInput
          label="Enrichment"
          field={brief.measurement.enrichment}
          onChange={(v) => updateField("measurement", "enrichment", v)}
        />
      </ReviewSection>

      <ReviewSection title="Recommended Products">
        <div className="space-y-2 sm:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Label className="text-sm font-medium text-navy">Recommended Products</Label>
            <ConfidenceBadge confidence={brief.recommendedProducts.confidence} />
          </div>
          <Input
            value={brief.recommendedProducts.value.join(", ")}
            onChange={(e) => updateProducts(e.target.value)}
            placeholder="Curated Deals, Audiences / Fan Graph, Moments..."
          />
        </div>
      </ReviewSection>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-navy">Internal Workstreams</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          {workstreams.map((ws) => (
            <WorkstreamReviewCard key={ws.id} workstream={ws} />
          ))}
        </div>
      </div>

      {risks.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-navy">Risks & Missing Inputs</h3>
          <RiskPanel risks={risks} />
        </div>
      )}
    </div>
  );
}
