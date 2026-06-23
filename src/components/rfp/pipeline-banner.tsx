import { ArrowRight, Bot, FileText, GitBranch, Route } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { icon: Bot, label: "RFP Intake Agent", iconClass: "text-blue" },
  { icon: FileText, label: "Solution Brief Review", iconClass: "text-purple" },
  { icon: Route, label: "Workstream Routing", iconClass: "text-blue" },
  { icon: GitBranch, label: "Proposal Output", iconClass: "text-green" },
];

export function PipelineBanner() {
  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-border bg-accent/60 px-5 py-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent-foreground/70">
          Operating Model
        </p>
      </div>
      <div className="px-5 py-4">
        <div className="flex flex-wrap items-center gap-2 md:gap-0">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center">
              <div className="flex items-center gap-2.5 rounded-xl bg-secondary px-3 py-2 ring-1 ring-border">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-border">
                  <step.icon className={cn("h-3.5 w-3.5", step.iconClass)} />
                </div>
                <span className="text-sm font-medium text-navy">{step.label}</span>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight className="mx-2 hidden h-4 w-4 shrink-0 text-muted-foreground/40 md:block" />
              )}
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          The Solution Brief is the source of truth. Proposal content is a downstream
          synthesis — not a substitute for internal approvals.
        </p>
      </div>
    </div>
  );
}
