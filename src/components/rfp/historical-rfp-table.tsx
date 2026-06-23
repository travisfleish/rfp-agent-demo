"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/rfp-utils";
import type { HistoricalRfpRecord, RfpOutcome } from "@/types/historical";
import { cn } from "@/lib/utils";

const avatarColors = [
  "bg-blue/10 text-blue ring-blue/20",
  "bg-purple/10 text-purple ring-purple/20",
  "bg-orange/10 text-orange ring-orange/20",
  "bg-green/10 text-green ring-green/20",
];

function AdvertiserAvatar({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const colorIndex = name.charCodeAt(0) % avatarColors.length;

  return (
    <div
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ring-1",
        avatarColors[colorIndex]
      )}
    >
      {initials}
    </div>
  );
}

const outcomeStyles: Record<RfpOutcome, string> = {
  Won: "bg-green/10 text-green ring-green/20",
  Lost: "bg-orange/10 text-orange ring-orange/20",
  "No Bid": "bg-lavenderGrey/40 text-navy/60 ring-lavenderGrey/60",
};

export function OutcomeBadge({ outcome }: { outcome: RfpOutcome }) {
  return (
    <Badge
      variant="outline"
      className={cn("font-medium ring-1", outcomeStyles[outcome])}
    >
      {outcome}
    </Badge>
  );
}

export function HistoricalRfpTable({ rfps }: { rfps: HistoricalRfpRecord[] }) {
  if (rfps.length === 0) {
    return (
      <div className="surface-card flex flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-sm font-medium text-navy">No matching RFPs</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your filters or search query.
        </p>
      </div>
    );
  }

  return (
    <div className="surface-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-lavenderGrey/60 bg-lightGrey/40 hover:bg-lightGrey/40">
            <TableHead className="font-semibold text-navy/70">Advertiser</TableHead>
            <TableHead className="font-semibold text-navy/70">Campaign</TableHead>
            <TableHead className="hidden font-semibold text-navy/70 md:table-cell">
              Agency
            </TableHead>
            <TableHead className="font-semibold text-navy/70">Completed</TableHead>
            <TableHead className="font-semibold text-navy/70">Outcome</TableHead>
            <TableHead className="hidden font-semibold text-navy/70 lg:table-cell">
              Products
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rfps.map((rfp) => (
            <TableRow
              key={rfp.id}
              className="group cursor-pointer border-lavenderGrey/40 transition-colors hover:bg-lightBlue/5"
            >
              <TableCell>
                <Link
                  href={`/historical/${rfp.id}`}
                  className="flex items-center gap-3"
                >
                  <AdvertiserAvatar name={rfp.advertiser} />
                  <span className="font-medium text-navy transition-colors group-hover:text-blue">
                    {rfp.advertiser}
                  </span>
                </Link>
              </TableCell>
              <TableCell className="max-w-[220px]">
                <Link href={`/historical/${rfp.id}`} className="block">
                  <span className="block truncate font-medium text-navy/80 group-hover:text-blue">
                    {rfp.campaign}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                    {rfp.summary}
                  </span>
                </Link>
              </TableCell>
              <TableCell className="hidden text-muted-foreground md:table-cell">
                {rfp.agency}
              </TableCell>
              <TableCell className="text-navy/80">
                {formatDate(rfp.completedAt)}
              </TableCell>
              <TableCell>
                <OutcomeBadge outcome={rfp.outcome} />
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <div className="flex flex-wrap gap-1">
                  {rfp.solutionBrief.recommendedProducts.slice(0, 2).map((p) => (
                    <Badge
                      key={p}
                      variant="secondary"
                      className="text-[10px] font-normal"
                    >
                      {p.split(" / ")[0]}
                    </Badge>
                  ))}
                  {rfp.solutionBrief.recommendedProducts.length > 2 && (
                    <Badge variant="secondary" className="text-[10px] font-normal">
                      +{rfp.solutionBrief.recommendedProducts.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
