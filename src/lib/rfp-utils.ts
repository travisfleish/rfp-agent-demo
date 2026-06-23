import type { RfpRecord } from "@/types/rfp";
import { SEED_RFPS } from "@/lib/mock-data";

const STORAGE_KEY = "rfp-agent-os-records";

export function loadRfps(): RfpRecord[] {
  if (typeof window === "undefined") return SEED_RFPS;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return SEED_RFPS;

    const parsed = JSON.parse(stored) as RfpRecord[];
    const seedIds = new Set(SEED_RFPS.map((r) => r.id));
    const custom = parsed.filter((r) => !seedIds.has(r.id));
    const mergedSeeds = SEED_RFPS.map((seed) => {
      const updated = parsed.find((r) => r.id === seed.id);
      return updated ?? seed;
    });
    return [...mergedSeeds, ...custom];
  } catch {
    return SEED_RFPS;
  }
}

export function saveRfps(rfps: RfpRecord[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rfps));
}

export function getRfpById(id: string, rfps: RfpRecord[]): RfpRecord | undefined {
  return rfps.find((r) => r.id === id);
}

export function generateRfpId(advertiser: string, campaign: string): string {
  const slug = `${advertiser}-${campaign}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `rfp-${slug}-${Date.now().toString(36)}`;
}

/** Dashboard aggregation helpers */
export function countActiveRfps(rfps: RfpRecord[]): number {
  return rfps.filter((r) => r.status !== "Complete").length;
}

export function countDueThisWeek(rfps: RfpRecord[]): number {
  const now = new Date();
  const weekEnd = new Date(now);
  weekEnd.setDate(weekEnd.getDate() + 7);

  return rfps.filter((r) => {
    if (r.status === "Complete") return false;
    const deadline = new Date(r.deadline);
    return deadline >= now && deadline <= weekEnd;
  }).length;
}

export function countAtRisk(rfps: RfpRecord[]): number {
  return rfps.filter(
    (r) => r.riskLevel === "High" && r.status !== "Complete"
  ).length;
}

export function countAwaitingInputs(rfps: RfpRecord[]): number {
  return rfps.filter((r) => r.status === "Awaiting Inputs").length;
}

export function isDueSoon(deadline: string, days = 7): boolean {
  const d = new Date(deadline);
  const now = new Date();
  const diff = (d.getTime() - now.getTime()) / 86400000;
  return diff >= 0 && diff <= days;
}

export function formatDate(dateStr: string): string {
  if (dateStr === "TBD") return "TBD";
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}
