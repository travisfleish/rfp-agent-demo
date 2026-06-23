import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export function MissingInputsPanel({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <Card className="border-orange/40 bg-lightOrange/20 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-navy">
          <AlertTriangle className="h-5 w-5 text-orange" />
          Missing Inputs / Clarifications Needed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 rounded-md bg-white/80 px-3 py-2 text-sm text-navy"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
