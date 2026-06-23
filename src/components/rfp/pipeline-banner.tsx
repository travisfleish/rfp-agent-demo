import { ArrowRight, Bot, FileText, GitBranch, Route } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: Bot,
    label: "RFP Intake Agent",
    color: "text-blue",
    bg: "bg-blue/10 ring-blue/20",
  },
  {
    icon: FileText,
    label: "Solution Brief Review",
    color: "text-purple",
    bg: "bg-purple/10 ring-purple/20",
  },
  {
    icon: Route,
    label: "Workstream Routing",
    color: "text-orange",
    bg: "bg-orange/10 ring-orange/20",
  },
  {
    icon: GitBranch,
    label: "Proposal Output",
    color: "text-green",
    bg: "bg-green/10 ring-green/20",
  },
];

export function PipelineBanner() {
  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-lavenderGrey/60 bg-gradient-to-r from-lightGrey/80 via-white to-lightPurple/20 px-5 py-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Operating Model
        </p>
      </div>
      <div className="px-5 py-4">
        <div className="flex flex-wrap items-center gap-2 md:gap-0">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center">
              <div
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-3 py-2 ring-1 transition-colors",
                  step.bg
                )}
              >
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm",
                    step.color
                  )}
                >
                  <step.icon className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm font-medium text-navy">{step.label}</span>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight className="mx-2 hidden h-4 w-4 shrink-0 text-lavenderGrey md:block" />
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
