"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRfpStore } from "@/providers/rfp-provider";
import type { IntakeFormData } from "@/types/rfp";
import { Loader2, Sparkles } from "lucide-react";

const emptyForm: IntakeFormData = {
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

export function IntakeForm() {
  const router = useRouter();
  const { createRfp } = useRfpStore();
  const [form, setForm] = useState<IntakeFormData>(emptyForm);
  const [isProcessing, setIsProcessing] = useState(false);

  const updateField = (id: keyof IntakeFormData, value: string) => {
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate AI extraction delay — replace with real LLM call later
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const record = createRfp(form);
    router.push(`/rfps/${record.id}`);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-6">
      <FormSection title="Opportunity">
        <FormField
          label="Advertiser"
          id="advertiser"
          value={form.advertiser}
          onChange={updateField}
          placeholder="e.g. Nike"
        />
        <FormField
          label="Agency"
          id="agency"
          value={form.agency}
          onChange={updateField}
          placeholder="e.g. Omnicom"
        />
        <FormField
          label="Campaign Name"
          id="campaignName"
          value={form.campaignName}
          onChange={updateField}
          placeholder="e.g. World Cup Training Collection"
        />
        <FormField
          label="Sales Owner"
          id="salesOwner"
          value={form.salesOwner}
          onChange={updateField}
          placeholder="e.g. Sarah Chen"
        />
      </FormSection>

      <FormSection title="Timing">
        <FormField
          label="Flight Dates"
          id="flightDates"
          value={form.flightDates}
          onChange={updateField}
          placeholder="e.g. Jul 1 – Aug 15, 2026"
        />
        <FormField
          label="Submission Deadline"
          id="submissionDeadline"
          value={form.submissionDeadline}
          onChange={updateField}
          type="date"
        />
      </FormSection>

      <FormSection title="Business">
        <FormField
          label="Objective"
          id="objective"
          value={form.objective}
          onChange={updateField}
          placeholder="Campaign objective"
        />
        <FormField
          label="KPI"
          id="kpi"
          value={form.kpi}
          onChange={updateField}
          placeholder="Primary KPIs"
        />
        <FormField
          label="Budget"
          id="budget"
          value={form.budget}
          onChange={updateField}
          placeholder="e.g. $2.5M"
          className="sm:col-span-2"
        />
      </FormSection>

      <FormSection title="Audience">
        <FormField
          label="Target Audience"
          id="targetAudience"
          value={form.targetAudience}
          onChange={updateField}
          placeholder="Audience description"
        />
        <FormField
          label="Markets"
          id="markets"
          value={form.markets}
          onChange={updateField}
          placeholder="e.g. US, UK, DE"
        />
        <FormField
          label="Exclusions"
          id="exclusions"
          value={form.exclusions}
          onChange={updateField}
          placeholder="Audience exclusions"
          className="sm:col-span-2"
        />
      </FormSection>

      <FormSection title="Activation">
        <FormField
          label="Requested Channels"
          id="requestedChannels"
          value={form.requestedChannels}
          onChange={updateField}
          placeholder="CTV, display, video..."
        />
        <FormField
          label="PMP Required"
          id="pmpRequired"
          value={form.pmpRequired}
          onChange={updateField}
          placeholder="Yes / No / Details"
        />
        <FormField
          label="DSP"
          id="dsp"
          value={form.dsp}
          onChange={updateField}
          placeholder="e.g. DV360, TTD"
        />
        <FormField
          label="Sponsorship or Broadcast Needs"
          id="sponsorshipNeeds"
          value={form.sponsorshipNeeds}
          onChange={updateField}
          placeholder="Sponsorship requirements"
        />
        <FormField
          label="Custom Moments or Triggers"
          id="customMoments"
          value={form.customMoments}
          onChange={updateField}
          placeholder="Moment-based activation needs"
          className="sm:col-span-2"
        />
      </FormSection>

      <FormSection title="Measurement">
        <FormField
          label="Attribution Required"
          id="attributionRequired"
          value={form.attributionRequired}
          onChange={updateField}
          placeholder="Attribution requirements"
        />
        <FormField
          label="Brand Lift Required"
          id="brandLiftRequired"
          value={form.brandLiftRequired}
          onChange={updateField}
          placeholder="Brand lift study needs"
        />
        <FormField
          label="Reporting Requirements"
          id="reportingRequirements"
          value={form.reportingRequirements}
          onChange={updateField}
          placeholder="Reporting cadence and format"
        />
        <FormField
          label="Data Enrichment Needs"
          id="dataEnrichmentNeeds"
          value={form.dataEnrichmentNeeds}
          onChange={updateField}
          placeholder="Data enrichment requirements"
        />
      </FormSection>

      <Card className="border-lavenderGrey shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-navy">
            Free-Text Intake
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="freeTextIntake">
              Paste RFP text, email requests, or planning notes
            </Label>
            <Textarea
              id="freeTextIntake"
              value={form.freeTextIntake}
              onChange={(e) => updateField("freeTextIntake", e.target.value)}
              placeholder="Paste full RFP content here. Mock AI will extract additional fields from this text."
              rows={8}
              className="resize-y font-body"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 pb-8">
        <Button
          type="button"
          variant="outline"
          onClick={() => setForm(emptyForm)}
          disabled={isProcessing}
        >
          Clear Form
        </Button>
        <Button
          type="submit"
          disabled={isProcessing || (!form.advertiser && !form.freeTextIntake)}
          className="bg-navy text-white hover:bg-navy/90"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Extracting Solution Brief...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Submit & Generate Brief
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
