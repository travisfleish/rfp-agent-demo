import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  accent?: "blue" | "orange" | "red" | "purple";
}

const accentConfig = {
  blue: {
    bar: "from-blue to-lightBlue",
    icon: "bg-blue/10 text-blue ring-blue/20",
    glow: "group-hover:shadow-blue/10",
  },
  orange: {
    bar: "from-orange to-lightOrange",
    icon: "bg-orange/10 text-orange ring-orange/20",
    glow: "group-hover:shadow-orange/10",
  },
  red: {
    bar: "from-red to-lightRed",
    icon: "bg-red/10 text-red ring-red/20",
    glow: "group-hover:shadow-red/10",
  },
  purple: {
    bar: "from-purple to-lightPurple",
    icon: "bg-purple/10 text-purple ring-purple/20",
    glow: "group-hover:shadow-purple/10",
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
        "group relative overflow-hidden border-lavenderGrey/80 bg-white shadow-[0_1px_2px_rgba(13,18,38,0.04),0_4px_16px_rgba(13,18,38,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(13,18,38,0.08),0_12px_32px_rgba(13,18,38,0.06)]",
        config.glow
      )}
    >
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-80",
          config.bar
        )}
      />
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
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground/80">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
