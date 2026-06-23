import { cn } from "@/lib/utils";
import type { RfpStatus } from "@/types/rfp";

const statusStyles: Record<RfpStatus, { badge: string; dot: string }> = {
  Intake: {
    badge: "bg-lavenderGrey/60 text-navy border-lavenderGrey",
    dot: "bg-navy/40",
  },
  "Solution Brief Created": {
    badge: "bg-lightPurple/50 text-purple border-lightPurple/80",
    dot: "bg-purple",
  },
  "Awaiting Inputs": {
    badge: "bg-lightOrange/70 text-orange border-lightOrange/80",
    dot: "bg-orange",
  },
  "In Review": {
    badge: "bg-lightBlue/50 text-blue border-lightBlue/80",
    dot: "bg-blue",
  },
  "Proposal Draft": {
    badge: "bg-lightGreen/30 text-green border-lightGreen/80",
    dot: "bg-lightGreen",
  },
  Complete: {
    badge: "bg-brightGreen/40 text-green border-brightGreen/60",
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
