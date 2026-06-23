import { Badge } from "@/components/ui/badge";
import type { FieldConfidence } from "@/types/rfp";
import { cn } from "@/lib/utils";

const styles: Record<FieldConfidence, string> = {
  High: "bg-lightGreen/15 text-green border-lightGreen/40",
  Medium: "bg-lightOrange/40 text-orange border-lightOrange/50",
  Low: "bg-lightRed/15 text-red border-lightRed/40",
};

export function ConfidenceBadge({
  confidence,
  className,
}: {
  confidence: FieldConfidence;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium", styles[confidence], className)}
    >
      {confidence} confidence
    </Badge>
  );
}
