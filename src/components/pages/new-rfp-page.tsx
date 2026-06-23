"use client";

import { AppShell } from "@/components/layout/app-shell";
import { AiIntakeHub } from "@/components/rfp/ai-intake-hub";

export function NewRfpPage() {
  return (
    <AppShell
      title="AI RFP Intake"
      description="Upload, paste, or describe an advertiser request. The intake agent will extract requirements and create a Solution Brief."
      showPipeline
    >
      <AiIntakeHub />
    </AppShell>
  );
}
