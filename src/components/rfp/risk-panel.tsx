import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskBadge } from "@/components/rfp/risk-badge";
import type { Risk } from "@/types/rfp";
import { AlertTriangle } from "lucide-react";

const riskLabels: Record<Risk["type"], string> = {
  "missing budget": "Missing Budget",
  "unclear measurement requirement": "Unclear Measurement",
  "legal review needed": "Legal Review Needed",
  "custom product feasibility needed": "Product Feasibility",
  "inventory availability unknown": "Inventory Unknown",
};

export function RiskPanel({ risks }: { risks: Risk[] }) {
  if (risks.length === 0) {
    return (
      <Card className="border-border shadow-sm">
        <CardContent className="flex items-center gap-3 p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lightGreen/15">
            <AlertTriangle className="h-5 w-5 text-green" />
          </div>
          <div>
            <p className="font-medium text-navy">No active risks identified</p>
            <p className="text-sm text-muted-foreground">
              Continue monitoring as workstreams progress.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {risks.map((risk) => (
        <Card key={risk.id} className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="text-sm font-semibold text-navy">
                {riskLabels[risk.type]}
              </CardTitle>
              <RiskBadge level={risk.severity} />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{risk.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function RequirementsView({
  intakeNotes,
  missingFields,
  clarificationItems,
}: {
  intakeNotes?: string;
  missingFields: string[];
  clarificationItems?: string[];
}) {
  const clarifications = clarificationItems ?? missingFields.map((f) => `Confirm ${f.toLowerCase()}`);

  return (
    <div className="space-y-4">
      {clarifications.length > 0 && (
        <Card className="border-lightOrange/40 bg-lightOrange/15 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-orange">
              Missing Inputs / Clarifications Needed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc text-sm text-navy">
              {clarifications.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card className="border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-navy">
            Original Intake
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap rounded-md bg-lightGrey p-4 text-sm text-navy font-body">
            {intakeNotes || "No free-text intake provided."}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
