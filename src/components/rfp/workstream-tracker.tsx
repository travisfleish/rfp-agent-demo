"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRfpStore } from "@/providers/rfp-provider";
import type { Workstream, WorkstreamStatus } from "@/types/rfp";
import { formatDate } from "@/lib/rfp-utils";
import { AlertCircle, Users } from "lucide-react";

const statusOptions: WorkstreamStatus[] = [
  "Not Started",
  "Requested",
  "In Progress",
  "Blocked",
  "Complete",
];

const confidenceOptions = ["Low", "Medium", "High"] as const;

const statusColors: Record<WorkstreamStatus, string> = {
  "Not Started": "bg-secondary text-muted-foreground ring-1 ring-border",
  Requested: "bg-lightBlue/30 text-blue ring-1 ring-lightBlue/40",
  "In Progress": "bg-lightOrange/40 text-orange ring-1 ring-lightOrange/50",
  Blocked: "bg-lightRed/15 text-red ring-1 ring-lightRed/40",
  Complete: "bg-lightGreen/15 text-green ring-1 ring-lightGreen/40",
};

function WorkstreamCard({
  workstream,
  rfpId,
}: {
  workstream: Workstream;
  rfpId: string;
}) {
  const { updateWorkstream } = useRfpStore();

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy/5">
              <Users className="h-4 w-4 text-navy" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-navy">
                {workstream.team}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Owner: {workstream.owner} · Due {formatDate(workstream.dueDate)}
              </p>
            </div>
          </div>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[workstream.status]}`}
          >
            {workstream.status}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md bg-secondary p-3">
          <p className="text-xs font-medium text-muted-foreground">
            Why routed
          </p>
          <p className="mt-1 text-sm text-navy">{workstream.routingReason}</p>
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Requested input
          </p>
          <p className="mt-1 text-sm text-navy">{workstream.request}</p>
        </div>

        {workstream.dependencies !== "None" && (
          <div className="flex items-start gap-2 rounded-md border border-lightOrange/40 bg-lightOrange/15 p-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
            <div>
              <p className="text-xs font-medium text-orange">Dependencies</p>
              <p className="text-sm text-navy">{workstream.dependencies}</p>
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`status-${workstream.id}`}>Status</Label>
            <Select
              value={workstream.status}
              onValueChange={(value) =>
                updateWorkstream(rfpId, workstream.id, {
                  status: value as WorkstreamStatus,
                })
              }
            >
              <SelectTrigger id={`status-${workstream.id}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`confidence-${workstream.id}`}>Confidence</Label>
            <Select
              value={workstream.confidence}
              onValueChange={(value) =>
                updateWorkstream(rfpId, workstream.id, {
                  confidence: value as "Low" | "Medium" | "High",
                })
              }
            >
              <SelectTrigger id={`confidence-${workstream.id}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {confidenceOptions.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`response-${workstream.id}`}>Response</Label>
          <Textarea
            id={`response-${workstream.id}`}
            placeholder="Enter team response..."
            value={workstream.response}
            onChange={(e) =>
              updateWorkstream(rfpId, workstream.id, {
                response: e.target.value,
              })
            }
            rows={3}
            className="resize-y"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function WorkstreamTracker({
  workstreams,
  rfpId,
}: {
  workstreams: Workstream[];
  rfpId: string;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Internal teams routed based on RFP requirements. Update status and responses as inputs are collected.
        {/* Future: webhook notifications to team owners */}
      </p>
      <div className="grid gap-4 lg:grid-cols-2">
        {workstreams.map((ws) => (
          <WorkstreamCard key={ws.id} workstream={ws} rfpId={rfpId} />
        ))}
      </div>
    </div>
  );
}
