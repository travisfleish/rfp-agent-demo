import {
  classifyComplexity,
  extractSolutionBrief as extractFlatSolutionBrief,
  generateProposalDraft,
  generateRisks,
  calculateRiskLevel,
  identifyMissingFields,
} from "@/lib/ai-logic";
import type {
  AgentExtractionResult,
  Complexity,
  ExtractedField,
  ExtractedSolutionBrief,
  FieldConfidence,
  IntakeFormData,
  ProposalDraft,
  RecommendedProduct,
  Risk,
  RfpIntakeSource,
  SolutionBrief,
  Workstream,
  WorkstreamTeam,
} from "@/types/rfp";

export const SAMPLE_RFP_EMAIL = `Hi team — Omnicom is asking for ideas for Nike's World Cup Training Collection campaign. They're looking to reach 18-34 soccer fans across the US and UK from June 1 through July 15. Budget is around $2.5M. They're interested in high-impact soccer inventory, custom audience segments, moments around goals and match starts, and measurement showing brand lift and site visits. They need initial recommendations by Friday. Can we include PMP options and any relevant Genius Sports fan data?`;

export const MOCK_FILE_EXTRACTION = `Advertiser: Nike
Agency: Omnicom
Campaign: World Cup Training Collection
Flight: June 1 – July 15, 2026
Markets: US, UK
Budget: $2.5M (directional)
Audience: 18-34 soccer fans
Inventory: High-impact soccer placements, PMP preferred
Moments: Goals, match starts
Measurement: Brand lift, site visits, attribution
Deadline: Initial recommendations required this week`;

export const PROCESSING_STEPS = [
  "Reading source material",
  "Extracting opportunity details",
  "Normalizing requirements",
  "Identifying missing information",
  "Classifying complexity",
  "Recommending internal workstreams",
  "Creating Solution Brief",
  "Preparing proposal synthesis shell",
] as const;

/**
 * Simulates ChatGPT Agent API intake processing.
 *
 * Future integration:
 * POST source file/text to ChatGPT Agent API
 * Agent returns normalized Solution Brief, confidence scores, risks, routing, and proposal shell
 */
export async function processRfpIntake(
  input: RfpIntakeSource
): Promise<AgentExtractionResult> {
  // Future integration: upload file to agent, poll for extraction job status
  await new Promise((resolve) => setTimeout(resolve, 400));

  const sourceText = resolveSourceText(input);
  const brief = extractSolutionBriefFromSource(input, sourceText);
  const flatBrief = flattenExtractedBrief(brief);
  const workstreams = recommendWorkstreams(brief, sourceText);
  const missingInputs = identifyRisksAndMissingInputs(brief, sourceText);
  const missingFields = identifyMissingFields(flatBrief);
  const risks = generateRisks(flatBrief, sourceText, missingFields);
  const proposalDraft = generateProposalShell(brief, workstreams, risks);

  return {
    brief,
    recommendedProducts: brief.recommendedProducts.value.map(String),
    workstreams,
    risks,
    missingInputs,
    proposalDraft,
    sourceText,
    complexity: brief.complexity.value,
  };
}

export function extractSolutionBrief(sourceText: string): ExtractedSolutionBrief {
  const formData = textToIntakeForm(sourceText);
  return buildExtractedBrief(formData, sourceText);
}

export function recommendWorkstreams(
  brief: ExtractedSolutionBrief,
  sourceText: string
): Workstream[] {
  const flat = flattenExtractedBrief(brief);
  const text = sourceText.toLowerCase();
  const routes: Array<{
    team: WorkstreamTeam;
    reason: string;
    request: string;
    owner: string;
    confidence: FieldConfidence;
  }> = [];

  routes.push({
    team: "Commercial / Sales",
    reason: "Owns client relationship and commercial framing",
    request: "Validate budget, timeline, and client priorities",
    owner: flat.opportunity.owner || "Unassigned",
    confidence: "High",
  });

  if (
    brief.audience.target.value ||
    text.includes("audience") ||
    text.includes("targeting") ||
    text.includes("fan") ||
    text.includes("segment")
  ) {
    routes.push({
      team: "Audience & Insights",
      reason: "Audience or targeting requirements detected",
      request: "Recommend Fan Graph segments and reach estimates",
      owner: "Audience Lead",
      confidence: brief.audience.target.confidence,
    });
  }

  if (
    brief.business.budget.value ||
    text.includes("cpm") ||
    text.includes("impression") ||
    text.includes("inventory") ||
    text.includes("pmp") ||
    text.includes("avails") ||
    brief.activation.pmp.value.toLowerCase().includes("yes")
  ) {
    routes.push({
      team: "Media Planning / Deal Desk",
      reason: "Budget, impressions, CPM, inventory, or PMP needs identified",
      request: "Confirm deal availability, pricing, and PMP packaging",
      owner: "Deal Desk Lead",
      confidence: brief.business.budget.confidence,
    });
  }

  if (
    brief.activation.momentsTriggers.value !== "None" ||
    text.includes("moment") ||
    text.includes("trigger") ||
    text.includes("dco") ||
    text.includes("dynamic messaging") ||
    text.includes("live event")
  ) {
    routes.push({
      team: "Product / Moments",
      reason: "Moments, triggers, live events, or DCO requested",
      request: "Assess moment taxonomy fit and activation feasibility",
      owner: "Product Lead",
      confidence: brief.activation.momentsTriggers.confidence,
    });
  }

  if (
    brief.measurement.attribution.value !== "TBD" ||
    brief.measurement.liftStudy.value !== "Not requested" ||
    text.includes("attribution") ||
    text.includes("brand lift") ||
    text.includes("reporting") ||
    text.includes("conversion") ||
    text.includes("site visit") ||
    text.includes("measurement")
  ) {
    routes.push({
      team: "Measurement & Enrichment",
      reason: "Attribution, brand lift, reporting, or measurement requirements present",
      request: "Define measurement design and data enrichment scope",
      owner: "Measurement Lead",
      confidence: "Medium",
    });
  }

  if (
    text.includes("creative") ||
    text.includes("custom unit") ||
    text.includes("dco") ||
    text.includes("dynamic messaging")
  ) {
    routes.push({
      team: "Creative Services",
      reason: "Creative, custom units, or dynamic messaging may be required",
      request: "Review creative specs and DCO requirements",
      owner: "Creative Director",
      confidence: "Medium",
    });
  }

  if (
    text.includes("alcohol") ||
    text.includes("betting") ||
    text.includes("gambling") ||
    text.includes("age-gat") ||
    text.includes("age gat") ||
    text.includes("regulated") ||
    text.includes("privacy") ||
    text.includes("data usage") ||
    text.includes("vendor tag")
  ) {
    routes.push({
      team: "Legal / Data Ops",
      reason: "Regulated category, age-gating, privacy, or data usage terms detected",
      request: "Review compliance, data rights, and contractual terms",
      owner: "Legal Counsel",
      confidence: "High",
    });
  }

  if (
    brief.activation.sponsorshipNeeds.value !== "None" ||
    text.includes("sponsor") ||
    text.includes("broadcast") ||
    text.includes("integration") ||
    text.includes("augmentation")
  ) {
    routes.push({
      team: "Sponsorship & Broadcast",
      reason: "Sponsorship, broadcast, or integration requirements identified",
      request: "Confirm broadcast inventory and sponsorship packaging options",
      owner: "Sponsorship Lead",
      confidence: brief.activation.sponsorshipNeeds.confidence,
    });
  }

  const deadline = flat.timing.deadline;
  const dueDates = staggerDueDates(deadline, routes.length);

  return routes.map((route, index) => ({
    id: `ws-${route.team.replace(/\s+/g, "-").toLowerCase()}-${index}`,
    team: route.team,
    routingReason: route.reason,
    request: route.request,
    owner: route.owner,
    status: index === 0 ? "In Progress" : "Requested",
    dueDate: dueDates[index],
    response: "",
    confidence: route.confidence,
    dependencies:
      route.team === "Media Planning / Deal Desk"
        ? "Audience segment confirmation"
        : route.team === "Measurement & Enrichment"
          ? "Activation plan finalization"
          : route.team === "Creative Services"
            ? "Product / Moments feasibility sign-off"
            : "None",
  }));
}

export function identifyRisksAndMissingInputs(
  brief: ExtractedSolutionBrief,
  sourceText: string
): string[] {
  const missing: string[] = [];
  const text = sourceText.toLowerCase();

  if (brief.timing.deadline.confidence === "Low" || brief.timing.deadline.value === "TBD") {
    missing.push("Confirm exact submission deadline date");
  }

  if (
    brief.business.budget.confidence !== "High" ||
    text.includes("around") ||
    text.includes("directional")
  ) {
    missing.push("Confirm whether budget is approved or directional");
  }

  if (brief.activation.dsp.confidence !== "High" || brief.activation.dsp.value === "TBD") {
    missing.push("Confirm DSP preference");
  }

  if (
    brief.measurement.attribution.value === "TBD" ||
    text.includes("attribution") ||
    text.includes("measurement")
  ) {
    missing.push("Confirm required attribution vendor");
  }

  if (
    text.includes("creative") ||
    text.includes("dco") ||
    brief.activation.momentsTriggers.value !== "None"
  ) {
    missing.push("Confirm creative requirements");
  }

  if (brief.audience.target.confidence === "Low" || !brief.audience.target.value) {
    missing.push("Confirm target audience definition and exclusions");
  }

  if (text.includes("pmp") && !text.includes("dsp")) {
    missing.push("Confirm PMP deal structure and buyer seat details");
  }

  return missing;
}

export function generateProposalShell(
  brief: ExtractedSolutionBrief,
  workstreams: Workstream[],
  risks: Risk[]
): ProposalDraft {
  const flat = flattenExtractedBrief(brief);
  return generateProposalDraft(flat, workstreams, risks);
}

export function flattenExtractedBrief(brief: ExtractedSolutionBrief): SolutionBrief {
  return {
    opportunity: {
      advertiser: brief.opportunity.advertiser.value,
      agency: brief.opportunity.agency.value,
      campaign: brief.opportunity.campaign.value,
      owner: brief.opportunity.owner.value,
    },
    timing: {
      flight: brief.timing.flight.value,
      deadline: brief.timing.deadline.value,
    },
    business: {
      objective: brief.business.objective.value,
      kpi: brief.business.kpi.value,
      budget: brief.business.budget.value,
    },
    audience: {
      target: brief.audience.target.value,
      markets: brief.audience.markets.value,
      exclusions: brief.audience.exclusions.value,
    },
    activation: {
      channels: brief.activation.channels.value,
      pmp: brief.activation.pmp.value,
      dsp: brief.activation.dsp.value,
      sponsorshipNeeds: brief.activation.sponsorshipNeeds.value,
      momentsTriggers: brief.activation.momentsTriggers.value,
    },
    measurement: {
      attribution: brief.measurement.attribution.value,
      liftStudy: brief.measurement.liftStudy.value,
      reporting: brief.measurement.reporting.value,
      enrichment: brief.measurement.enrichment.value,
    },
    recommendedProducts: brief.recommendedProducts.value,
  };
}

export function agentResultToRfpRecord(
  result: AgentExtractionResult,
  intakeSourceType: RfpIntakeSource["type"]
): Omit<import("@/types/rfp").RfpRecord, "id" | "createdAt" | "updatedAt"> {
  const flat = flattenExtractedBrief(result.brief);
  const riskLevel = calculateRiskLevel(result.risks);
  const completedWorkstreams = result.workstreams.filter(
    (w) => w.status === "Complete"
  ).length;
  const percentComplete = Math.round(
    (completedWorkstreams / Math.max(result.workstreams.length, 1)) * 40 + 20
  );

  return {
    advertiser: flat.opportunity.advertiser,
    agency: flat.opportunity.agency,
    campaign: flat.opportunity.campaign,
    owner: flat.opportunity.owner,
    deadline: flat.timing.deadline,
    status: "Solution Brief Created",
    complexity: result.complexity,
    riskLevel,
    percentComplete,
    intakeNotes: result.sourceText,
    intakeSourceType,
    missingInputs: result.missingInputs,
    solutionBrief: flat,
    workstreams: result.workstreams,
    risks: result.risks,
    proposalDraft: result.proposalDraft,
    currentStage: "Solution Brief Created",
    nextAction:
      result.workstreams.length > 1
        ? `Route ${result.workstreams.length - 1} internal workstreams for input`
        : "Review Solution Brief with client team",
  };
}

function extractSolutionBriefFromSource(
  input: RfpIntakeSource,
  sourceText: string
): ExtractedSolutionBrief {
  if (input.type === "manual" && input.manualFields) {
    const formData = manualFieldsToIntakeForm(input.manualFields, sourceText);
    return buildExtractedBrief(formData, sourceText, true);
  }
  return buildExtractedBrief(textToIntakeForm(sourceText), sourceText);
}

function resolveSourceText(input: RfpIntakeSource): string {
  if (input.rawText?.trim()) return input.rawText.trim();

  if (input.type === "file") {
    return MOCK_FILE_EXTRACTION;
  }

  return "";
}

function textToIntakeForm(text: string): IntakeFormData {
  const lower = text.toLowerCase();
  return {
    advertiser: extractNamedEntity(text, "nike", "Nike") || extractNamedEntity(text, "fanduel", "FanDuel") || "",
    agency: lower.includes("omnicom") ? "Omnicom" : lower.includes("wpp") ? "WPP" : "",
    campaignName: inferCampaign(text),
    salesOwner: "",
    flightDates: inferFlight(text),
    submissionDeadline: inferDeadline(text),
    objective: inferObjective(text),
    kpi: inferKpi(text),
    budget: inferBudget(text),
    targetAudience: inferAudience(text),
    markets: inferMarkets(text),
    exclusions: "",
    requestedChannels: inferChannels(text),
    pmpRequired: lower.includes("pmp") ? "Yes — PMP options requested" : "",
    dsp: lower.includes("dv360") ? "DV360" : "",
    sponsorshipNeeds: lower.includes("sponsor") || lower.includes("broadcast") ? "Broadcast sponsorship integration" : "",
    customMoments: inferMoments(text),
    attributionRequired: lower.includes("attribution") ? "Required" : "",
    brandLiftRequired: lower.includes("brand lift") ? "Required" : "",
    reportingRequirements: lower.includes("reporting") ? "Standard + custom reporting" : "",
    dataEnrichmentNeeds: lower.includes("fan data") ? "Genius Sports fan data enrichment" : "",
    freeTextIntake: text,
  };
}

function manualFieldsToIntakeForm(
  fields: Partial<SolutionBrief>,
  sourceText: string
): IntakeFormData {
  return {
    advertiser: fields.opportunity?.advertiser ?? "",
    agency: fields.opportunity?.agency ?? "",
    campaignName: fields.opportunity?.campaign ?? "",
    salesOwner: fields.opportunity?.owner ?? "",
    flightDates: fields.timing?.flight ?? "",
    submissionDeadline: fields.timing?.deadline ?? "",
    objective: fields.business?.objective ?? "",
    kpi: fields.business?.kpi ?? "",
    budget: fields.business?.budget ?? "",
    targetAudience: fields.audience?.target ?? "",
    markets: fields.audience?.markets ?? "",
    exclusions: fields.audience?.exclusions ?? "",
    requestedChannels: fields.activation?.channels ?? "",
    pmpRequired: fields.activation?.pmp ?? "",
    dsp: fields.activation?.dsp ?? "",
    sponsorshipNeeds: fields.activation?.sponsorshipNeeds ?? "",
    customMoments: fields.activation?.momentsTriggers ?? "",
    attributionRequired: fields.measurement?.attribution ?? "",
    brandLiftRequired: fields.measurement?.liftStudy ?? "",
    reportingRequirements: fields.measurement?.reporting ?? "",
    dataEnrichmentNeeds: fields.measurement?.enrichment ?? "",
    freeTextIntake: sourceText,
  };
}

function buildExtractedBrief(
  formData: IntakeFormData,
  sourceText: string,
  fromManual = false
): ExtractedSolutionBrief {
  const flat = extractFlatSolutionBrief(formData);
  const text = sourceText.toLowerCase();
  const complexity = classifyComplexity(flat, sourceText);

  const field = (
    value: string,
    explicitKey: keyof IntakeFormData,
    inferConfidence: FieldConfidence = "Medium"
  ): ExtractedField => {
    const explicit = formData[explicitKey];
    if (fromManual && explicit) {
      return { value, confidence: "High", source: "Manual entry" };
    }
    if (explicit && explicit.trim()) {
      return { value, confidence: "High", source: "Explicit in source" };
    }
    if (value === "TBD" || !value) {
      return { value: value || "TBD", confidence: "Low", source: "Not found" };
    }
    return { value, confidence: inferConfidence, source: "Inferred from source" };
  };

  return {
    opportunity: {
      advertiser: field(flat.opportunity.advertiser, "advertiser", text.includes("nike") || text.includes("fanduel") ? "High" : "Medium"),
      agency: field(flat.opportunity.agency, "agency", text.includes("omnicom") ? "High" : "Medium"),
      campaign: field(flat.opportunity.campaign, "campaignName", "Medium"),
      owner: field(flat.opportunity.owner, "salesOwner", "Low"),
    },
    timing: {
      flight: field(flat.timing.flight, "flightDates", text.includes("june") ? "Medium" : "Low"),
      deadline: inferDeadlineField(flat.timing.deadline, formData.submissionDeadline, text),
    },
    business: {
      objective: field(flat.business.objective, "objective", "Medium"),
      kpi: field(flat.business.kpi, "kpi", "Medium"),
      budget: inferBudgetField(flat.business.budget, formData.budget, text),
    },
    audience: {
      target: field(flat.audience.target, "targetAudience", text.includes("18-34") || text.includes("soccer") ? "High" : "Medium"),
      markets: field(flat.audience.markets, "markets", text.includes("us") && text.includes("uk") ? "High" : "Medium"),
      exclusions: field(flat.audience.exclusions, "exclusions", "Low"),
    },
    activation: {
      channels: field(flat.activation.channels, "requestedChannels", "Medium"),
      pmp: field(flat.activation.pmp, "pmpRequired", text.includes("pmp") ? "High" : "Low"),
      dsp: field(flat.activation.dsp, "dsp", "Low"),
      sponsorshipNeeds: field(flat.activation.sponsorshipNeeds, "sponsorshipNeeds", "Low"),
      momentsTriggers: field(flat.activation.momentsTriggers, "customMoments", text.includes("goal") || text.includes("moment") ? "High" : "Medium"),
    },
    measurement: {
      attribution: field(flat.measurement.attribution, "attributionRequired", text.includes("attribution") ? "Medium" : "Low"),
      liftStudy: field(flat.measurement.liftStudy, "brandLiftRequired", text.includes("brand lift") ? "High" : "Low"),
      reporting: field(flat.measurement.reporting, "reportingRequirements", "Medium"),
      enrichment: field(flat.measurement.enrichment, "dataEnrichmentNeeds", text.includes("fan data") ? "High" : "Low"),
    },
    recommendedProducts: {
      value: flat.recommendedProducts,
      confidence: flat.recommendedProducts.length >= 3 ? "High" : "Medium",
      source: "Product mapping rules",
    },
    complexity: {
      value: complexity,
      confidence: complexity === "High" ? "Medium" : "High",
      source: "Complexity classifier",
    },
  };
}

function inferDeadlineField(
  value: string,
  explicit: string,
  text: string
): ExtractedField {
  if (explicit) {
    return { value, confidence: "High", source: "Explicit date" };
  }
  if (text.includes("friday")) {
    return { value: "Friday (exact date TBD)", confidence: "Low", source: "Relative date in email" };
  }
  if (value === "TBD") {
    return { value, confidence: "Low", source: "Not found" };
  }
  return { value, confidence: "Medium", source: "Inferred from source" };
}

function inferBudgetField(
  value: string,
  explicit: string,
  text: string
): ExtractedField {
  if (explicit) {
    return { value, confidence: "High", source: "Explicit in source" };
  }
  if (text.includes("around") && value !== "TBD") {
    return { value, confidence: "Medium", source: "Directional budget mentioned" };
  }
  if (value === "TBD") {
    return { value, confidence: "Low", source: "Not found" };
  }
  return { value, confidence: "Medium", source: "Inferred from source" };
}

function extractNamedEntity(text: string, needle: string, label: string): string {
  return text.toLowerCase().includes(needle) ? label : "";
}

function inferCampaign(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("world cup training")) return "World Cup Training Collection";
  if (lower.includes("world cup")) return "World Cup Campaign";
  if (lower.includes("nfl") && lower.includes("odds")) return "NFL Live Odds Awareness";
  return "";
}

function inferFlight(text: string): string {
  if (text.toLowerCase().includes("june 1") && text.toLowerCase().includes("july 15")) {
    return "June 1 – July 15, 2026";
  }
  if (text.toLowerCase().includes("q4")) return "Q4 2026";
  return "";
}

function inferDeadline(text: string): string {
  if (text.toLowerCase().includes("friday")) return "Friday (exact date TBD)";
  return "";
}

function inferObjective(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("awareness")) return "Brand awareness";
  if (lower.includes("conversion")) return "Performance / conversion";
  return "";
}

function inferKpi(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("brand lift") && lower.includes("site visit")) {
    return "Brand lift, site visits, reach";
  }
  return "";
}

function inferBudget(text: string): string {
  const match = text.match(/\$[\d,.]+(?:m|k|mm)?/i);
  return match ? match[0] : "";
}

function inferAudience(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("18-34") && lower.includes("soccer")) return "18-34 soccer fans";
  if (lower.includes("nfl")) return "NFL bettors and fans";
  return "";
}

function inferMarkets(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("us") && lower.includes("uk")) return "US, UK";
  if (lower.includes("us")) return "US";
  return "";
}

function inferChannels(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("soccer inventory")) return "High-impact soccer inventory, programmatic video";
  if (lower.includes("nfl")) return "Programmatic display and video, live sports contexts";
  return "";
}

function inferMoments(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("goal") || lower.includes("match start")) {
    return "Goals, match starts, key in-game moments";
  }
  return "";
}

function staggerDueDates(deadline: string, count: number): string[] {
  const base = deadline !== "TBD" && !deadline.includes("Friday")
    ? new Date(deadline)
    : new Date(Date.now() + 14 * 86400000);
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(base);
    d.setDate(d.getDate() - (count - i) * 2);
    return d.toISOString().split("T")[0];
  });
}
