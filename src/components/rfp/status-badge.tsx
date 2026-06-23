import { cn } from "@/lib/utils";
import type { RfpStatus } from "@/types/rfp";

const statusStyles: Record<RfpStatus, { badge: string; dot: string }> = {
  Intake: {
    badge: "bg-secondary text-muted-foreground border-border",
    dot: "bg-muted-foreground/50",
  },
  "Solution Brief Created": {
    badge: "bg-accent text-purple border-lightPurple/50",
    dot: "bg-purple",
  },
  "Awaiting Inputs": {
    badge: "bg-lightOrange/40 text-orange border-lightOrange/60",
    dot: "bg-orange",
  },
  "In Review": {
    badge: "bg-lightBlue/30 text-blue border-lightBlue/50",
    dot: "bg-blue",
  },
  "Proposal Draft": {
    badge: "bg-lightGreen/15 text-green border-lightGreen/40",
    dot: "bg-lightGreen",
  },
  Complete: {
    badge: "bg-green/10 text-green border-green/20",
    dot: "bg-green",
  },
};

export function StatusBadge({
  status,
  className,
}: {
  status: RfpStatus;
  className?: string;
}) {
  const styles = statusStyles[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        styles.badge,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", styles.dot)} />
      {status}
    </span>
  );
}
