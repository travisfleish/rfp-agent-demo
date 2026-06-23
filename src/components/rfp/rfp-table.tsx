"use client";

import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ComplexityBadge, RiskBadge } from "@/components/rfp/risk-badge";
import { StatusBadge } from "@/components/rfp/status-badge";
import { formatDate, isDueSoon } from "@/lib/rfp-utils";
import type { RfpRecord } from "@/types/rfp";
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

export function RfpTable({ rfps }: { rfps: RfpRecord[] }) {
  if (rfps.length === 0) {
    return (
      <div className="surface-card flex flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-sm font-medium text-navy">No RFPs yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Start by uploading or pasting an advertiser request.
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
            <TableHead className="font-semibold text-navy/70">Agency</TableHead>
            <TableHead className="font-semibold text-navy/70">Campaign</TableHead>
            <TableHead className="hidden font-semibold text-navy/70 md:table-cell">
              Owner
            </TableHead>
            <TableHead className="font-semibold text-navy/70">Deadline</TableHead>
            <TableHead className="font-semibold text-navy/70">Status</TableHead>
            <TableHead className="hidden font-semibold text-navy/70 lg:table-cell">
              Complexity
            </TableHead>
            <TableHead className="hidden font-semibold text-navy/70 lg:table-cell">
              Risk
            </TableHead>
            <TableHead className="font-semibold text-navy/70">Progress</TableHead>
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
                  href={`/rfps/${rfp.id}`}
                  className="flex items-center gap-3"
                >
                  <AdvertiserAvatar name={rfp.advertiser} />
                  <span className="font-medium text-navy transition-colors group-hover:text-blue">
                    {rfp.advertiser}
                  </span>
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">{rfp.agency}</TableCell>
              <TableCell className="max-w-[200px] truncate text-navy/80">
                {rfp.campaign}
              </TableCell>
              <TableCell className="hidden text-muted-foreground md:table-cell">
                {rfp.owner}
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    "text-sm",
                    isDueSoon(rfp.deadline) && rfp.status !== "Complete"
                      ? "font-semibold text-orange"
                      : "text-navy/80"
                  )}
                >
                  {formatDate(rfp.deadline)}
                </span>
              </TableCell>
              <TableCell>
                <StatusBadge status={rfp.status} />
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <ComplexityBadge complexity={rfp.complexity} />
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <RiskBadge level={rfp.riskLevel} />
              </TableCell>
              <TableCell>
                <div className="flex min-w-[100px] items-center gap-2.5">
                  <Progress
                    value={rfp.percentComplete}
                    className="h-1.5 flex-1 bg-lavenderGrey/60 [&>div]:bg-gradient-to-r [&>div]:from-blue [&>div]:to-lightBlue"
                  />
                  <span className="w-8 text-xs font-medium tabular-nums text-muted-foreground">
                    {rfp.percentComplete}%
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
