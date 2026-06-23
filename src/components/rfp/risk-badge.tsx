import { cn } from "@/lib/utils";
import type { Complexity, RiskLevel } from "@/types/rfp";

const complexityStyles: Record<Complexity, string> = {
  Low: "bg-lightGreen/15 text-green border-lightGreen/40",
  Medium: "bg-lightOrange/40 text-orange border-lightOrange/50",
  High: "bg-lightRed/15 text-red border-lightRed/40",
};

export function ComplexityBadge({
  complexity,
  className,
}: {
  complexity: Complexity;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        complexityStyles[complexity],
        className
      )}
    >
      {complexity}
    </span>
  );
}

const riskStyles: Record<RiskLevel, string> = {
  Low: "bg-lightGreen/15 text-green border-lightGreen/40",
  Medium: "bg-lightOrange/40 text-orange border-lightOrange/50",
  High: "bg-lightRed/15 text-red border-lightRed/40",
};

export function RiskBadge({
  level,
  className,
}: {
  level: RiskLevel;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        riskStyles[level],
        className
      )}
    >
      {level} Risk
    </span>
  );
}
