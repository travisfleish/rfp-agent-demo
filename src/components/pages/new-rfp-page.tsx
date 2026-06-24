"use client";

import { AppShell } from "@/components/layout/app-shell";
import { PageHero } from "@/components/layout/page-hero";
import { AiIntakeHub } from "@/components/rfp/ai-intake-hub";

export function NewRfpPage() {
  return (
    <AppShell>
      <div className="space-y-10">
        <PageHero
          title="AI RFP Intake"
          description="Upload, paste, or describe an advertiser request. The intake agent will extract requirements and create a Solution Brief."
        />
        <AiIntakeHub />
      </div>
    </AppShell>
  );
}
