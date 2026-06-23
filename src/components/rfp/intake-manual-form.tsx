"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { IntakeFormData } from "@/types/rfp";

export const emptyManualForm: IntakeFormData = {
  advertiser: "",
  agency: "",
  campaignName: "",
  salesOwner: "",
  flightDates: "",
  submissionDeadline: "",
  objective: "",
  kpi: "",
  budget: "",
  targetAudience: "",
  markets: "",
  exclusions: "",
  requestedChannels: "",
  pmpRequired: "",
  dsp: "",
  sponsorshipNeeds: "",
  customMoments: "",
  attributionRequired: "",
  brandLiftRequired: "",
  reportingRequirements: "",
  dataEnrichmentNeeds: "",
  freeTextIntake: "",
};

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-lavenderGrey shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold text-navy">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">{children}</CardContent>
    </Card>
  );
}

function FormField({
  label,
  id,
  value,
  onChange,
  placeholder,
  className,
  type = "text",
}: {
  label: string;
  id: keyof IntakeFormData;
  value: string;
  onChange: (id: keyof IntakeFormData, value: string) => void;
  placeholder?: string;
  className?: string;
  type?: string;
}) {
  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export function IntakeManualForm({
  form,
  onChange,
}: {
  form: IntakeFormData;
  onChange: (form: IntakeFormData) => void;
}) {
  const updateField = (id: keyof IntakeFormData, value: string) => {
    onChange({ ...form, [id]: value });
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Manual Entry / Override — use when structured intake is unavailable or you need
        to override agent-extracted values before processing.
      </p>

      <FormSection title="Opportunity">
        <FormField label="Advertiser" id="advertiser" value={form.advertiser} onChange={updateField} placeholder="e.g. Nike" />
        <FormField label="Agency" id="agency" value={form.agency} onChange={updateField} placeholder="e.g. Omnicom" />
        <FormField label="Campaign Name" id="campaignName" value={form.campaignName} onChange={updateField} placeholder="Campaign name" />
        <FormField label="Sales Owner" id="salesOwner" value={form.salesOwner} onChange={updateField} placeholder="e.g. Sarah Chen" />
      </FormSection>

      <FormSection title="Timing">
        <FormField label="Flight Dates" id="flightDates" value={form.flightDates} onChange={updateField} placeholder="Jul 1 – Aug 15, 2026" />
        <FormField label="Submission Deadline" id="submissionDeadline" value={form.submissionDeadline} onChange={updateField} type="date" />
      </FormSection>

      <FormSection title="Business">
        <FormField label="Objective" id="objective" value={form.objective} onChange={updateField} placeholder="Campaign objective" />
        <FormField label="KPI" id="kpi" value={form.kpi} onChange={updateField} placeholder="Primary KPIs" />
        <FormField label="Budget" id="budget" value={form.budget} onChange={updateField} placeholder="e.g. $2.5M" className="sm:col-span-2" />
      </FormSection>

      <FormSection title="Audience">
        <FormField label="Target Audience" id="targetAudience" value={form.targetAudience} onChange={updateField} placeholder="Audience description" />
        <FormField label="Markets" id="markets" value={form.markets} onChange={updateField} placeholder="US, UK" />
        <FormField label="Exclusions" id="exclusions" value={form.exclusions} onChange={updateField} placeholder="Audience exclusions" className="sm:col-span-2" />
      </FormSection>

      <FormSection title="Activation">
        <FormField label="Requested Channels" id="requestedChannels" value={form.requestedChannels} onChange={updateField} placeholder="CTV, display, video..." />
        <FormField label="PMP Required" id="pmpRequired" value={form.pmpRequired} onChange={updateField} placeholder="Yes / No" />
        <FormField label="DSP" id="dsp" value={form.dsp} onChange={updateField} placeholder="DV360, TTD" />
        <FormField label="Sponsorship Needs" id="sponsorshipNeeds" value={form.sponsorshipNeeds} onChange={updateField} placeholder="Sponsorship requirements" />
        <FormField label="Custom Moments" id="customMoments" value={form.customMoments} onChange={updateField} placeholder="Moment-based activation" className="sm:col-span-2" />
      </FormSection>

      <FormSection title="Measurement">
        <FormField label="Attribution Required" id="attributionRequired" value={form.attributionRequired} onChange={updateField} placeholder="Attribution requirements" />
        <FormField label="Brand Lift Required" id="brandLiftRequired" value={form.brandLiftRequired} onChange={updateField} placeholder="Brand lift study" />
        <FormField label="Reporting Requirements" id="reportingRequirements" value={form.reportingRequirements} onChange={updateField} placeholder="Reporting cadence" />
        <FormField label="Data Enrichment" id="dataEnrichmentNeeds" value={form.dataEnrichmentNeeds} onChange={updateField} placeholder="Data enrichment needs" />
      </FormSection>

      <Card className="border-lavenderGrey shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-navy">Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={form.freeTextIntake}
            onChange={(e) => updateField("freeTextIntake", e.target.value)}
            placeholder="Optional free-text notes to include with manual entry..."
            rows={4}
            className="resize-y font-body"
          />
        </CardContent>
      </Card>
    </div>
  );
}
