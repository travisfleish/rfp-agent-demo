import { cn } from "@/lib/utils";
import type { Complexity, RiskLevel } from "@/types/rfp";

const complexityStyles: Record<Complexity, string> = {
  Low: "bg-lightGreen/20 text-green",
  Medium: "bg-lightOrange/60 text-orange",
  High: "bg-lightRed/30 text-red",
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
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        complexityStyles[complexity],
        className
      )}
    >
      {complexity}
    </span>
  );
}

const riskStyles: Record<RiskLevel, string> = {
  Low: "bg-lightGreen/20 text-green border-lightGreen/50",
  Medium: "bg-lightOrange/60 text-orange border-lightOrange/50",
  High: "bg-lightRed/30 text-red border-lightRed/50",
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
