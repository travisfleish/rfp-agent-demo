"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AgentExtractionResult, IntakeFormData, IntakeSourceType, RfpRecord, Workstream } from "@/types/rfp";
import { processIntake } from "@/lib/ai-logic";
import { agentResultToRfpRecord } from "@/lib/agent-api";
import { SEED_RFPS } from "@/lib/mock-data";
import { generateRfpId, loadRfps, saveRfps } from "@/lib/rfp-utils";

interface RfpContextValue {
  rfps: RfpRecord[];
  isLoaded: boolean;
  getRfp: (id: string) => RfpRecord | undefined;
  createRfp: (data: IntakeFormData) => RfpRecord;
  createRfpFromAgent: (
    result: AgentExtractionResult,
    intakeSourceType: IntakeSourceType
  ) => RfpRecord;
  updateRfp: (id: string, updater: (rfp: RfpRecord) => RfpRecord) => void;
  updateWorkstream: (
    rfpId: string,
    workstreamId: string,
    updates: Partial<Workstream>
  ) => void;
}

const RfpContext = createContext<RfpContextValue | null>(null);

export function RfpProvider({ children }: { children: ReactNode }) {
  const [rfps, setRfps] = useState<RfpRecord[]>(SEED_RFPS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setRfps(loadRfps());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) saveRfps(rfps);
  }, [rfps, isLoaded]);

  const getRfp = useCallback(
    (id: string) => rfps.find((r) => r.id === id),
    [rfps]
  );

  const createRfp = useCallback((data: IntakeFormData) => {
    const processed = processIntake(data);
    const now = new Date().toISOString();
    const record: RfpRecord = {
      ...processed,
      id: generateRfpId(processed.advertiser, processed.campaign),
      createdAt: now,
      updatedAt: now,
    };
    setRfps((prev) => [record, ...prev]);
    return record;
  }, []);

  const updateRfp = useCallback(
    (id: string, updater: (rfp: RfpRecord) => RfpRecord) => {
      setRfps((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...updater(r), updatedAt: new Date().toISOString() }
            : r
        )
      );
    },
    []
  );

  const updateWorkstream = useCallback(
    (
      rfpId: string,
      workstreamId: string,
      updates: Partial<Workstream>
    ) => {
      updateRfp(rfpId, (rfp) => {
        const workstreams = rfp.workstreams.map((ws) =>
          ws.id === workstreamId ? { ...ws, ...updates } : ws
        );
        const completed = workstreams.filter((w) => w.status === "Complete").length;
        const percentComplete = Math.round(
          (completed / Math.max(workstreams.length, 1)) * 60 +
            (rfp.status === "Proposal Draft" ? 30 : 15)
        );
        const allComplete = workstreams.every((w) => w.status === "Complete");
        const anyBlocked = workstreams.some((w) => w.status === "Blocked");
        const anyInProgress = workstreams.some(
          (w) => w.status === "In Progress" || w.status === "Requested"
        );

        let status = rfp.status;
        let nextAction = rfp.nextAction;
        if (allComplete && status !== "Complete") {
          status = "In Review";
          nextAction = "All workstreams complete — proceed to proposal review";
        } else if (anyBlocked) {
          status = "Awaiting Inputs";
          nextAction = "Resolve blocked workstreams before proceeding";
        } else if (anyInProgress) {
          status = "Awaiting Inputs";
          nextAction = `Collect pending workstream responses (${workstreams.length - completed} remaining)`;
        }

        return { ...rfp, workstreams, percentComplete, status, nextAction };
      });
    },
    [updateRfp]
  );

  const createRfpFromAgent = useCallback(
    (result: AgentExtractionResult, intakeSourceType: IntakeSourceType) => {
      const processed = agentResultToRfpRecord(result, intakeSourceType);
      const now = new Date().toISOString();
      const record: RfpRecord = {
        ...processed,
        id: generateRfpId(processed.advertiser, processed.campaign),
        createdAt: now,
        updatedAt: now,
      };
      setRfps((prev) => [record, ...prev]);
      return record;
    },
    []
  );

  const value = useMemo(
    () => ({
      rfps,
      isLoaded,
      getRfp,
      createRfp,
      createRfpFromAgent,
      updateRfp,
      updateWorkstream,
    }),
    [rfps, isLoaded, getRfp, createRfp, createRfpFromAgent, updateRfp, updateWorkstream]
  );

  return <RfpContext.Provider value={value}>{children}</RfpContext.Provider>;
}

export function useRfpStore() {
  const ctx = useContext(RfpContext);
  if (!ctx) throw new Error("useRfpStore must be used within RfpProvider");
  return ctx;
}
