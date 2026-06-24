"use client";

import { AppShell } from "@/components/layout/app-shell";
import { PageHero } from "@/components/layout/page-hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SettingsPage() {
  return (
    <AppShell>
      <div className="space-y-10">
        <PageHero
          title="Settings"
          description="Application configuration (POC — mock only)"
        />
        <div className="mx-auto max-w-2xl space-y-4">
          <Card className="surface-card">
            <CardHeader>
              <CardTitle className="text-base text-navy">Data Storage</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              RFP records are stored in browser localStorage for this POC.
              {/* Future: Supabase / Postgres integration */}
            </CardContent>
          </Card>

          <Card className="surface-card">
            <CardHeader>
              <CardTitle className="text-base text-navy">Future Agent API Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <ul className="list-disc space-y-1.5 pl-5">
                <li>Intake sources will be sent to a ChatGPT-powered extraction agent</li>
                <li>Agent returns normalized Solution Brief JSON</li>
                <li>Confidence scores identify fields requiring human review</li>
                <li>Routing rules can combine deterministic logic with LLM reasoning</li>
                <li>Proposal synthesis happens only after Solution Brief review</li>
              </ul>
              <p className="pt-2 text-xs">
                Mock layer: <code className="text-xs">src/lib/agent-api.ts</code>
              </p>
            </CardContent>
          </Card>

          <Card className="surface-card">
            <CardHeader>
              <CardTitle className="text-base text-navy">AI Extraction</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Deterministic fallback logic in{" "}
              <code className="text-xs">src/lib/ai-logic.ts</code>. The intake agent
              layer in <code className="text-xs">src/lib/agent-api.ts</code> simulates
              future ChatGPT Agent API integration.
            </CardContent>
          </Card>

          <Card className="surface-card">
            <CardHeader>
              <CardTitle className="text-base text-navy">Integrations</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Future integrations: Salesforce CRM, Slack notifications, Deal Desk API, Legal workflow.
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
