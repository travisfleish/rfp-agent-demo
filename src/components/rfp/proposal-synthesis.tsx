import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProposalDraft } from "@/types/rfp";
import { AlertTriangle, FileOutput } from "lucide-react";

const sections: Array<{
  key: keyof ProposalDraft;
  title: string;
}> = [
  { key: "executiveSummary", title: "Executive Summary" },
  { key: "strategicRecommendation", title: "Strategic Recommendation" },
  { key: "audienceStrategy", title: "Audience Strategy" },
  { key: "recommendedProducts", title: "Recommended Products" },
  { key: "activationPlan", title: "Activation Plan" },
  { key: "measurementPlan", title: "Measurement Plan" },
  { key: "openQuestions", title: "Open Questions" },
  { key: "internalCaveats", title: "Internal Caveats" },
];

export function ProposalSynthesis({ draft }: { draft: ProposalDraft }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-lg border border-blue/20 bg-blue/5 p-4">
        <FileOutput className="mt-0.5 h-5 w-5 shrink-0 text-blue" />
        <div>
          <p className="text-sm font-semibold text-navy">
            Downstream Proposal Output
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Generated from the Solution Brief. This content does not override missing internal approvals or unresolved risks.
            {/* Future: LLM synthesis with Solution Brief as structured context */}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-orange/30 bg-lightOrange/30 p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-orange" />
        <p className="text-sm text-navy">{draft.internalCaveats}</p>
      </div>

      <div className="grid gap-4">
        {sections
          .filter((s) => s.key !== "internalCaveats")
          .map(({ key, title }) => (
            <Card key={key} className="border-lavenderGrey shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-navy">
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {draft[key]}
                </p>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
