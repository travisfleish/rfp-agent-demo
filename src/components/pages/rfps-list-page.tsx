"use client";

import { AppShell } from "@/components/layout/app-shell";
import { RfpTable } from "@/components/rfp/rfp-table";
import { useRfpStore } from "@/providers/rfp-provider";

export function RfpsListPage() {
  const { rfps, isLoaded } = useRfpStore();

  if (!isLoaded) {
    return (
      <AppShell title="Existing RFPs">
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          Loading...
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Existing RFPs"
      description={`${rfps.length} opportunities in the system`}
    >
      <RfpTable rfps={rfps} />
    </AppShell>
  );
}
