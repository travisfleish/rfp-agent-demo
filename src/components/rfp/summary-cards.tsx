import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  accent?: "blue" | "purple" | "orange" | "red";
}

const accentConfig = {
  blue: {
    bar: "bg-blue",
    icon: "bg-blue/8 text-blue ring-blue/15",
  },
  purple: {
    bar: "bg-purple",
    icon: "bg-purple/8 text-purple ring-purple/15",
  },
  orange: {
    bar: "bg-orange",
    icon: "bg-orange/8 text-orange ring-orange/15",
  },
  red: {
    bar: "bg-red",
    icon: "bg-red/8 text-red ring-red/15",
  },
};

export function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  accent = "blue",
}: SummaryCardProps) {
  const config = accentConfig[accent];

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-border bg-white shadow-[0_1px_2px_rgba(13,18,38,0.03),0_8px_24px_rgba(13,18,38,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(13,18,38,0.05),0_16px_40px_rgba(13,18,38,0.06)]"
      )}
    >
      <div className={cn("absolute inset-x-0 top-0 h-0.5", config.bar)} />
      <CardContent className="flex items-start gap-4 p-5 pt-6">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 transition-transform duration-200 group-hover:scale-105",
            config.icon
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-1 font-heading text-4xl font-bold tracking-tight text-navy">
            {value}
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
