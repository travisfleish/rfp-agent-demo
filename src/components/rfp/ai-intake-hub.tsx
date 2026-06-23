"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AgentProcessingTimeline } from "@/components/rfp/agent-processing-timeline";
import { ExtractionReviewScreen } from "@/components/rfp/extraction-review-screen";
import {
  emptyManualForm,
  IntakeManualForm,
} from "@/components/rfp/intake-manual-form";
import {
  flattenExtractedBrief,
  generateProposalShell,
  identifyRisksAndMissingInputs,
  MOCK_FILE_EXTRACTION,
  processRfpIntake,
  recommendWorkstreams,
  SAMPLE_RFP_EMAIL,
} from "@/lib/agent-api";
import { generateRisks, identifyMissingFields } from "@/lib/ai-logic";
import { useRfpStore } from "@/providers/rfp-provider";
import type {
  AgentExtractionResult,
  IntakeSourceType,
  RfpIntakeSource,
} from "@/types/rfp";
import {
  ArrowLeft,
  FileUp,
  Loader2,
  MessageSquareText,
  PenLine,
  Sparkles,
  Zap,
} from "lucide-react";

const ACCEPTED_FILE_TYPES = ".csv,.xlsx,.pdf,.docx,.txt";

type Phase = "input" | "processing" | "review";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function intakeFormToManualFields(form: typeof emptyManualForm) {
  return {
    opportunity: {
      advertiser: form.advertiser,
      agency: form.agency,
      campaign: form.campaignName,
      owner: form.salesOwner,
    },
    timing: {
      flight: form.flightDates,
      deadline: form.submissionDeadline,
    },
    business: {
      objective: form.objective,
      kpi: form.kpi,
      budget: form.budget,
    },
    audience: {
      target: form.targetAudience,
      markets: form.markets,
      exclusions: form.exclusions,
    },
    activation: {
      channels: form.requestedChannels,
      pmp: form.pmpRequired,
      dsp: form.dsp,
      sponsorshipNeeds: form.sponsorshipNeeds,
      momentsTriggers: form.customMoments,
    },
    measurement: {
      attribution: form.attributionRequired,
      liftStudy: form.brandLiftRequired,
      reporting: form.reportingRequirements,
      enrichment: form.dataEnrichmentNeeds,
    },
  };
}

export function AiIntakeHub() {
  const router = useRouter();
  const { createRfpFromAgent } = useRfpStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [phase, setPhase] = useState<Phase>("input");
  const [activeTab, setActiveTab] = useState<IntakeSourceType>("text");
  const [pasteText, setPasteText] = useState("");
  const [quickRequest, setQuickRequest] = useState("");
  const [manualForm, setManualForm] = useState(emptyManualForm);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [extractionResult, setExtractionResult] = useState<AgentExtractionResult | null>(null);
  const [intakeSource, setIntakeSource] = useState<RfpIntakeSource | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingSource, setPendingSource] = useState<RfpIntakeSource | null>(null);

  const readFileContent = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "txt" || ext === "csv") {
      try {
        return await file.text();
      } catch {
        return null;
      }
    }
    return null;
  };

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    const content = await readFileContent(file);
    setFileContent(content);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) await handleFileSelect(file);
  };

  const buildIntakeSource = (): RfpIntakeSource | null => {
    switch (activeTab) {
      case "file":
        if (!selectedFile) return null;
        return {
          type: "file",
          fileName: selectedFile.name,
          fileType: selectedFile.type || selectedFile.name.split(".").pop() || "unknown",
          fileSize: selectedFile.size,
          rawText: fileContent ?? undefined,
        };
      case "text":
        if (!pasteText.trim()) return null;
        return { type: "text", rawText: pasteText.trim() };
      case "quick_request":
        if (!quickRequest.trim()) return null;
        return { type: "quick_request", rawText: quickRequest.trim() };
      case "manual": {
        const hasData =
          manualForm.advertiser ||
          manualForm.campaignName ||
          manualForm.freeTextIntake;
        if (!hasData) return null;
        return {
          type: "manual",
          rawText: manualForm.freeTextIntake,
          manualFields: intakeFormToManualFields(manualForm),
        };
      }
      default:
        return null;
    }
  };

  const canGenerate = (): boolean => {
    switch (activeTab) {
      case "file":
        return !!selectedFile;
      case "text":
        return !!pasteText.trim();
      case "quick_request":
        return !!quickRequest.trim();
      case "manual":
        return !!(manualForm.advertiser || manualForm.campaignName || manualForm.freeTextIntake);
      default:
        return false;
    }
  };

  const handleGenerate = async () => {
    const source = buildIntakeSource();
    if (!source) return;

    setIntakeSource(source);
    setPendingSource(source);
    setPhase("processing");
  };

  const handleProcessingComplete = useCallback(async () => {
    if (!pendingSource) return;

    const result = await processRfpIntake(pendingSource);
    setExtractionResult(result);
    setPhase("review");
  }, [pendingSource]);

  const handleBriefChange = (brief: AgentExtractionResult["brief"]) => {
    if (!extractionResult) return;
    const flat = flattenExtractedBrief(brief);
    const sourceText = extractionResult.sourceText;
    const workstreams = recommendWorkstreams(brief, sourceText);
    const missingInputs = identifyRisksAndMissingInputs(brief, sourceText);
    const missingFields = identifyMissingFields(flat);
    const risks = generateRisks(flat, sourceText, missingFields);
    const proposalDraft = generateProposalShell(brief, workstreams, risks);

    setExtractionResult({
      ...extractionResult,
      brief,
      workstreams,
      missingInputs,
      risks,
      proposalDraft,
      recommendedProducts: brief.recommendedProducts.value.map(String),
      complexity: brief.complexity.value,
    });
  };

  const handleCreateProject = async () => {
    if (!extractionResult || !intakeSource) return;
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const record = createRfpFromAgent(extractionResult, intakeSource.type);
    router.push(`/rfps/${record.id}`);
  };

  if (phase === "processing") {
    return <AgentProcessingTimeline onComplete={handleProcessingComplete} />;
  }

  if (phase === "review" && extractionResult) {
    return (
      <div className="space-y-6 pb-8">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2"
          onClick={() => {
            setPhase("input");
            setExtractionResult(null);
          }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to intake
        </Button>

        <ExtractionReviewScreen
          result={extractionResult}
          onBriefChange={handleBriefChange}
        />

        <div className="flex justify-end gap-3 border-t border-border pt-6">
          <Button
            variant="outline"
            onClick={() => {
              setPhase("input");
              setExtractionResult(null);
            }}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateProject}
            disabled={isSaving}
            className="bg-navy text-white hover:bg-navy/90"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating project...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Create RFP Project
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-8">
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as IntakeSourceType)}
        className="w-full"
      >
        <TabsList className="mb-6 flex h-auto w-full flex-wrap gap-1.5 rounded-xl border border-border bg-secondary/50 p-1.5">
          <TabsTrigger
            value="text"
            className="gap-1.5 rounded-lg px-4 py-2.5 data-[state=active]:bg-white data-[state=active]:text-navy data-[state=active]:shadow-sm"
          >
            <MessageSquareText className="h-4 w-4" />
            Paste Email / Brief
          </TabsTrigger>
          <TabsTrigger
            value="file"
            className="gap-1.5 rounded-lg px-4 py-2.5 data-[state=active]:bg-white data-[state=active]:text-navy data-[state=active]:shadow-sm"
          >
            <FileUp className="h-4 w-4" />
            Upload RFP File
          </TabsTrigger>
          <TabsTrigger
            value="quick_request"
            className="gap-1.5 rounded-lg px-4 py-2.5 data-[state=active]:bg-white data-[state=active]:text-navy data-[state=active]:shadow-sm"
          >
            <Zap className="h-4 w-4" />
            Quick Request
          </TabsTrigger>
          <TabsTrigger
            value="manual"
            className="gap-1.5 rounded-lg px-4 py-2.5 data-[state=active]:bg-white data-[state=active]:text-navy data-[state=active]:shadow-sm"
          >
            <PenLine className="h-4 w-4" />
            Manual Entry / Override
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file" className="mt-0">
          <div
            role="button"
            tabIndex={0}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
            }}
            className={`surface-card cursor-pointer border-2 border-dashed p-12 text-center transition-all duration-200 ${
              isDragging
                ? "border-blue bg-lightBlue/15 shadow-[0_0_0_4px_rgba(0,0,220,0.06)]"
                : "border-border hover:border-blue/30 hover:bg-accent/50 hover:shadow-md"
            }`}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue/8 ring-1 ring-blue/15">
              <FileUp className="h-7 w-7 text-blue" />
            </div>
            <p className="mt-5 text-base font-medium text-navy">
              Drop RFP file here or click to browse
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Accepts CSV, XLSX, PDF, DOCX, TXT
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_FILE_TYPES}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleFileSelect(file);
              }}
            />
          </div>

          {selectedFile && (
            <Card className="mt-4 border-border shadow-sm">
              <CardContent className="space-y-3 pt-6">
                <div className="grid gap-2 text-sm sm:grid-cols-3">
                  <div>
                    <span className="text-muted-foreground">File: </span>
                    <span className="font-medium text-navy">{selectedFile.name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Type: </span>
                    <span className="font-medium text-navy">
                      {selectedFile.type || selectedFile.name.split(".").pop()?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Size: </span>
                    <span className="font-medium text-navy">
                      {formatFileSize(selectedFile.size)}
                    </span>
                  </div>
                </div>
                <p className="rounded-md bg-lightBlue/15 px-3 py-2 text-sm text-navy ring-1 ring-lightBlue/30">
                  File received. In production, this would be parsed by the intake agent
                  using document extraction.
                </p>
                <p className="text-xs text-muted-foreground">
                  {fileContent
                    ? "CSV/TXT content read client-side for extraction."
                    : `Mock extraction will be used for this file type. Preview: "${MOCK_FILE_EXTRACTION.slice(0, 80)}..."`}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="text" className="mt-0 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="paste-text">Paste unstructured RFP content</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPasteText(SAMPLE_RFP_EMAIL)}
              >
                Fill sample email
              </Button>
            </div>
            <Textarea
              id="paste-text"
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="Paste RFP email, agency planning request, inventory request, client brief, or internal seller notes..."
              rows={12}
              className="resize-y font-body"
            />
          </div>
        </TabsContent>

        <TabsContent value="quick_request" className="mt-0 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quick-request">Describe the opportunity in one line</Label>
            <Textarea
              id="quick-request"
              value={quickRequest}
              onChange={(e) => setQuickRequest(e.target.value)}
              placeholder='e.g. "FanDuel wants NFL live odds awareness ideas for Q4 with attribution and age-gating review."'
              rows={4}
              className="resize-y font-body text-base"
            />
            <p className="text-xs text-muted-foreground">
              The intake agent will expand this into a structured Solution Brief with
              routing and confidence scores.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="manual" className="mt-0">
          <IntakeManualForm form={manualForm} onChange={setManualForm} />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3 border-t border-border pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setPasteText("");
            setQuickRequest("");
            setManualForm(emptyManualForm);
            setSelectedFile(null);
            setFileContent(null);
          }}
        >
          Clear
        </Button>
        <Button
          onClick={handleGenerate}
          disabled={!canGenerate()}
          className="bg-navy px-6 text-white shadow-sm hover:bg-navy/90"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Generate Solution Brief
        </Button>
      </div>
    </div>
  );
}
