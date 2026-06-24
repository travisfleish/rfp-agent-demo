"use client";

import { AppShell } from "@/components/layout/app-shell";
import { PageHero } from "@/components/layout/page-hero";
import { RfpTable } from "@/components/rfp/rfp-table";
import { useRfpStore } from "@/providers/rfp-provider";

export function RfpsListPage() {
  const { rfps, isLoaded } = useRfpStore();

  if (!isLoaded) {
    return (
      <AppShell>
        <div className="space-y-10">
          <PageHero title="Existing RFPs" />
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            Loading...
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-10">
        <PageHero
          title="Existing RFPs"
          description={`${rfps.length} opportunities in the system`}
        />
        <RfpTable rfps={rfps} />
      </div>
    </AppShell>
  );
}
