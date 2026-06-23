import type {
  Complexity,
  IntakeFormData,
  ProposalDraft,
  RecommendedProduct,
  Risk,
  RiskLevel,
  RfpRecord,
  RiskType,
  SolutionBrief,
  Workstream,
  WorkstreamTeam,
} from "@/types/rfp";

/** Deterministic mock AI — replace with LLM extraction later */
export function extractSolutionBrief(data: IntakeFormData): SolutionBrief {
  const freeText = data.freeTextIntake.toLowerCase();

  return {
    opportunity: {
      advertiser: data.advertiser || extractFromText(freeText, "advertiser") || "TBD",
      agency: data.agency || "TBD",
      campaign: data.campaignName || extractFromText(freeText, "campaign") || "Untitled Campaign",
      owner: data.salesOwner || "Unassigned",
    },
    timing: {
      flight: data.flightDates || "TBD",
      deadline: data.submissionDeadline || "TBD",
    },
    business: {
      objective: data.objective || inferObjective(freeText),
      kpi: data.kpi || inferKpi(freeText),
      budget: data.budget || inferBudget(freeText),
    },
    audience: {
      target: data.targetAudience || inferAudience(freeText),
      markets: data.markets || "US",
      exclusions: data.exclusions || "None specified",
    },
    activation: {
      channels: data.requestedChannels || inferChannels(freeText),
      pmp: data.pmpRequired || (freeText.includes("pmp") ? "Yes" : "Not specified"),
      dsp: data.dsp || (freeText.includes("dv360") ? "DV360" : "TBD"),
      sponsorshipNeeds: data.sponsorshipNeeds || inferSponsorship(freeText),
      momentsTriggers: data.customMoments || inferMoments(freeText),
    },
    measurement: {
      attribution: data.attributionRequired || (freeText.includes("attribution") ? "Required" : "TBD"),
      liftStudy: data.brandLiftRequired || (freeText.includes("brand lift") ? "Required" : "Not requested"),
      reporting: data.reportingRequirements || "Standard campaign reporting",
      enrichment: data.dataEnrichmentNeeds || "None specified",
    },
    recommendedProducts: recommendProducts(data, freeText),
  };
}

export function classifyComplexity(brief: SolutionBrief, freeText: string): Complexity {
  let score = 0;
  const text = freeText.toLowerCase();

  if (brief.business.budget === "TBD" || !brief.business.budget) score += 1;
  if (brief.activation.momentsTriggers && brief.activation.momentsTriggers !== "None") score += 2;
  if (brief.activation.sponsorshipNeeds && brief.activation.sponsorshipNeeds !== "None") score += 2;
  if (brief.measurement.liftStudy === "Required") score += 1;
  if (text.includes("world cup") || text.includes("nfl") || text.includes("broadcast")) score += 2;
  if (brief.recommendedProducts.length >= 4) score += 1;

  if (score >= 5) return "High";
  if (score >= 2) return "Medium";
  return "Low";
}

export function recommendWorkstreams(
  brief: SolutionBrief,
  freeText: string
): Workstream[] {
  const text = freeText.toLowerCase();
  const routes: Array<{
    team: WorkstreamTeam;
    reason: string;
    request: string;
    owner: string;
  }> = [];

  routes.push({
    team: "Commercial / Sales",
    reason: "Owns client relationship and commercial framing",
    request: "Validate budget, timeline, and client priorities",
    owner: brief.opportunity.owner,
  });

  if (
    brief.audience.target ||
    text.includes("audience") ||
    text.includes("targeting") ||
    text.includes("fan")
  ) {
    routes.push({
      team: "Audience & Insights",
      reason: "Audience or targeting requirements detected",
      request: "Recommend Fan Graph segments and reach estimates",
      owner: "Audience Lead",
    });
  }

  if (
    brief.business.budget ||
    text.includes("cpm") ||
    text.includes("impression") ||
    text.includes("inventory") ||
    brief.activation.pmp !== "Not specified"
  ) {
    routes.push({
      team: "Media Planning / Deal Desk",
      reason: "Budget, impressions, CPM, or inventory needs identified",
      request: "Confirm deal availability, pricing, and PMP packaging",
      owner: "Deal Desk Lead",
    });
  }

  if (
    brief.activation.momentsTriggers ||
    text.includes("moment") ||
    text.includes("trigger") ||
    text.includes("dco")
  ) {
    routes.push({
      team: "Product / Moments",
      reason: "Moments, triggers, or DCO requested",
      request: "Assess moment taxonomy fit and activation feasibility",
      owner: "Product Lead",
    });
    routes.push({
      team: "Creative Services",
      reason: "Dynamic or moment-based creative may be required",
      request: "Review creative specs and DCO requirements",
      owner: "Creative Director",
    });
  }

  if (
    brief.measurement.attribution ||
    brief.measurement.liftStudy ||
    text.includes("attribution") ||
    text.includes("brand lift") ||
    text.includes("reporting")
  ) {
    routes.push({
      team: "Measurement & Enrichment",
      reason: "Attribution, brand lift, or reporting requirements present",
      request: "Define measurement design and data enrichment scope",
      owner: "Measurement Lead",
    });
  }

  if (
    text.includes("alcohol") ||
    text.includes("age") ||
    text.includes("legal") ||
    text.includes("terms") ||
    text.includes("data usage") ||
    text.includes("gambling") ||
    text.includes("betting")
  ) {
    routes.push({
      team: "Legal / Data Ops",
      reason: "Regulatory, age, or data usage terms detected",
      request: "Review compliance, data rights, and contractual terms",
      owner: "Legal Counsel",
    });
  }

  if (brief.activation.sponsorshipNeeds && brief.activation.sponsorshipNeeds !== "None") {
    const hasCreative = routes.some((r) => r.team === "Creative Services");
    if (!hasCreative) {
      routes.push({
        team: "Creative Services",
        reason: "Sponsorship or broadcast assets may require creative support",
        request: "Review sponsorship creative and broadcast deliverables",
        owner: "Creative Director",
      });
    }
  }

  const deadline = brief.timing.deadline;
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
    confidence: index === 0 ? "High" : "Medium",
    dependencies:
      route.team === "Media Planning / Deal Desk"
        ? "Audience segment confirmation"
        : route.team === "Measurement & Enrichment"
          ? "Activation plan finalization"
          : "None",
  }));
}

export function identifyMissingFields(brief: SolutionBrief): string[] {
  const missing: string[] = [];
  if (!brief.business.budget || brief.business.budget === "TBD") missing.push("Budget");
  if (!brief.timing.flight || brief.timing.flight === "TBD") missing.push("Flight dates");
  if (!brief.audience.target) missing.push("Target audience");
  if (brief.measurement.attribution === "TBD") missing.push("Attribution requirements");
  if (brief.activation.dsp === "TBD") missing.push("DSP preference");
  return missing;
}

export function generateRisks(
  brief: SolutionBrief,
  freeText: string,
  missingFields: string[]
): Risk[] {
  const risks: Risk[] = [];
  const text = freeText.toLowerCase();

  if (missingFields.includes("Budget")) {
    risks.push({
      id: "risk-budget",
      type: "missing budget",
      description: "Budget not confirmed — commercial packaging and deal sizing at risk",
      severity: "High",
    });
  }

  if (
    brief.measurement.attribution === "TBD" ||
    brief.measurement.liftStudy === "TBD"
  ) {
    risks.push({
      id: "risk-measurement",
      type: "unclear measurement requirement",
      description: "Measurement scope undefined — may delay proposal and post-campaign reporting",
      severity: "Medium",
    });
  }

  if (
    text.includes("alcohol") ||
    text.includes("gambling") ||
    text.includes("betting") ||
    text.includes("age")
  ) {
    risks.push({
      id: "risk-legal",
      type: "legal review needed",
      description: "Regulated category or age restrictions require legal review before commitment",
      severity: "High",
    });
  }

  if (brief.activation.momentsTriggers && brief.activation.momentsTriggers !== "None") {
    risks.push({
      id: "risk-product",
      type: "custom product feasibility needed",
      description: "Custom moments or triggers require product feasibility validation",
      severity: "Medium",
    });
  }

  if (
    text.includes("inventory") ||
    brief.activation.channels.toLowerCase().includes("broadcast")
  ) {
    risks.push({
      id: "risk-inventory",
      type: "inventory availability unknown",
      description: "Inventory or broadcast availability not yet confirmed with supply partners",
      severity: "Medium",
    });
  }

  return risks;
}

export function calculateRiskLevel(risks: Risk[]): RiskLevel {
  if (risks.some((r) => r.severity === "High")) return "High";
  if (risks.length >= 2) return "Medium";
  return "Low";
}

export function generateProposalDraft(
  brief: SolutionBrief,
  workstreams: Workstream[],
  risks: Risk[]
): ProposalDraft {
  const products = brief.recommendedProducts.join(", ");
  const pendingInputs = workstreams.filter((w) => w.status !== "Complete").length;

  return {
    executiveSummary: `${brief.opportunity.advertiser} is seeking a media solution for "${brief.opportunity.campaign}" in partnership with ${brief.opportunity.agency}. Genius Sports recommends a data-driven activation leveraging our sports intelligence platform to deliver against ${brief.business.objective.toLowerCase() || "campaign objectives"}.`,

    strategicRecommendation: `Align media investment to high-intent sports moments where ${brief.opportunity.advertiser}'s target audience is most engaged. Prioritize ${brief.activation.channels || "programmatic and contextual"} channels with Genius Sports proprietary data layers to maximize relevance and measurable outcomes.`,

    audienceStrategy: `Target ${brief.audience.target || "core sports fans"} across ${brief.audience.markets}. Apply Fan Graph segmentation to identify affinity-based audiences. Exclusions: ${brief.audience.exclusions}.`,

    recommendedProducts: `Based on requirements analysis, we recommend: ${products}. Each product maps to validated internal workstreams and is subject to final availability confirmation.`,

    activationPlan: `Flight: ${brief.timing.flight}. Channels: ${brief.activation.channels}. ${brief.activation.pmp !== "Not specified" ? `PMP: ${brief.activation.pmp}.` : ""} DSP: ${brief.activation.dsp}. ${brief.activation.sponsorshipNeeds !== "None" ? `Sponsorship: ${brief.activation.sponsorshipNeeds}.` : ""} ${brief.activation.momentsTriggers !== "None" ? `Moments: ${brief.activation.momentsTriggers}.` : ""}`,

    measurementPlan: `Attribution: ${brief.measurement.attribution}. Brand lift: ${brief.measurement.liftStudy}. Reporting: ${brief.measurement.reporting}. Data enrichment: ${brief.measurement.enrichment}.`,

    openQuestions: pendingInputs > 0
      ? `${pendingInputs} internal workstream(s) still pending. Key open items: budget confirmation, inventory availability, and measurement design sign-off.`
      : "All internal inputs received. Final commercial review pending.",

    internalCaveats: risks.length > 0
      ? `⚠ This draft is downstream of the Solution Brief and does NOT override pending approvals. Active risks: ${risks.map((r) => r.type).join(", ")}. Do not share externally until Legal and Deal Desk sign off.`
      : "⚠ This draft is downstream of the Solution Brief. External distribution requires Commercial approval.",
  };
}

export function processIntake(data: IntakeFormData): Omit<RfpRecord, "id" | "createdAt" | "updatedAt"> {
  const freeText = data.freeTextIntake;
  const brief = extractSolutionBrief(data);
  const complexity = classifyComplexity(brief, freeText);
  const workstreams = recommendWorkstreams(brief, freeText);
  const missingFields = identifyMissingFields(brief);
  const risks = generateRisks(brief, freeText, missingFields);
  const riskLevel = calculateRiskLevel(risks);
  const proposalDraft = generateProposalDraft(brief, workstreams, risks);

  const completedWorkstreams = workstreams.filter((w) => w.status === "Complete").length;
  const percentComplete = Math.round(
    (completedWorkstreams / Math.max(workstreams.length, 1)) * 40 + 20
  );

  return {
    advertiser: brief.opportunity.advertiser,
    agency: brief.opportunity.agency,
    campaign: brief.opportunity.campaign,
    owner: brief.opportunity.owner,
    deadline: brief.timing.deadline,
    status: "Solution Brief Created",
    complexity,
    riskLevel,
    percentComplete,
    intakeNotes: freeText,
    solutionBrief: brief,
    workstreams,
    risks,
    proposalDraft,
    currentStage: "Solution Brief Created",
    nextAction:
      workstreams.length > 1
        ? `Route ${workstreams.length - 1} internal workstreams for input`
        : "Review Solution Brief with client team",
  };
}

function recommendProducts(
  data: IntakeFormData,
  text: string
): RecommendedProduct[] {
  const products = new Set<RecommendedProduct>();

  products.add("Curated Deals");

  if (data.targetAudience || text.includes("audience") || text.includes("fan")) {
    products.add("Audiences / Fan Graph");
  }
  if (data.customMoments || text.includes("moment") || text.includes("trigger")) {
    products.add("Moments");
  }
  if (data.sponsorshipNeeds || text.includes("sponsor") || text.includes("broadcast")) {
    products.add("Sponsorship & Broadcast");
  }
  if (text.includes("managed") || data.budget.toLowerCase().includes("million")) {
    products.add("Managed Service");
  }
  if (
    data.attributionRequired ||
    data.brandLiftRequired ||
    text.includes("measurement")
  ) {
    products.add("Measurement / Insights");
  }

  return Array.from(products);
}

function extractFromText(text: string, field: string): string {
  if (field === "advertiser" && text.includes("nike")) return "Nike";
  if (field === "campaign" && text.includes("world cup")) return "World Cup Campaign";
  return "";
}

function inferObjective(text: string): string {
  if (text.includes("awareness")) return "Brand awareness";
  if (text.includes("conversion")) return "Performance / conversion";
  return "Drive engagement among sports fans";
}

function inferKpi(text: string): string {
  if (text.includes("vcr")) return "VCR, reach, frequency";
  if (text.includes("roas")) return "ROAS, CPA";
  return "Reach, engagement, brand lift";
}

function inferBudget(text: string): string {
  const match = text.match(/\$[\d,.]+(?:m|k|mm)?/i);
  return match ? match[0] : "TBD";
}

function inferAudience(text: string): string {
  if (text.includes("soccer") || text.includes("football")) return "Soccer / football fans";
  if (text.includes("nfl")) return "NFL bettors and fans";
  return "Sports enthusiasts 18-54";
}

function inferChannels(text: string): string {
  if (text.includes("ctv")) return "CTV, programmatic video";
  if (text.includes("display")) return "Display, video, CTV";
  return "Programmatic display and video";
}

function inferSponsorship(text: string): string {
  if (text.includes("sponsor") || text.includes("broadcast")) {
    return "Broadcast sponsorship integration";
  }
  return "None";
}

function inferMoments(text: string): string {
  if (text.includes("goal") || text.includes("touchdown")) {
    return "In-game moment triggers (scores, key plays)";
  }
  return "None";
}

function staggerDueDates(deadline: string, count: number): string[] {
  const base = deadline !== "TBD" ? new Date(deadline) : new Date(Date.now() + 14 * 86400000);
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(base);
    d.setDate(d.getDate() - (count - i) * 2);
    return d.toISOString().split("T")[0];
  });
}
