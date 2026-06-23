export type RfpStatus =
  | "Intake"
  | "Solution Brief Created"
  | "Awaiting Inputs"
  | "In Review"
  | "Proposal Draft"
  | "Complete";

export type Complexity = "Low" | "Medium" | "High";
export type RiskLevel = "Low" | "Medium" | "High";

export type WorkstreamStatus =
  | "Not Started"
  | "Requested"
  | "In Progress"
  | "Blocked"
  | "Complete";

export type WorkstreamTeam =
  | "Commercial / Sales"
  | "Audience & Insights"
  | "Media Planning / Deal Desk"
  | "Product / Moments"
  | "Measurement & Enrichment"
  | "Creative Services"
  | "Legal / Data Ops"
  | "Sponsorship & Broadcast";

export type IntakeSourceType = "file" | "text" | "quick_request" | "manual";

export type FieldConfidence = "High" | "Medium" | "Low";

export type ExtractedField<T = string> = {
  value: T;
  confidence: FieldConfidence;
  source?: string;
};

export type RiskType =
  | "missing budget"
  | "unclear measurement requirement"
  | "legal review needed"
  | "custom product feasibility needed"
  | "inventory availability unknown";

export type RecommendedProduct =
  | "Curated Deals"
  | "Audiences / Fan Graph"
  | "Moments"
  | "Sponsorship & Broadcast"
  | "Managed Service"
  | "Measurement / Insights";

export interface OpportunityFields {
  advertiser: string;
  agency: string;
  campaign: string;
  owner: string;
}

export interface TimingFields {
  flight: string;
  deadline: string;
}

export interface BusinessFields {
  objective: string;
  kpi: string;
  budget: string;
}

export interface AudienceFields {
  target: string;
  markets: string;
  exclusions: string;
}

export interface ActivationFields {
  channels: string;
  pmp: string;
  dsp: string;
  sponsorshipNeeds: string;
  momentsTriggers: string;
}

export interface MeasurementFields {
  attribution: string;
  liftStudy: string;
  reporting: string;
  enrichment: string;
}

export interface SolutionBrief {
  opportunity: OpportunityFields;
  timing: TimingFields;
  business: BusinessFields;
  audience: AudienceFields;
  activation: ActivationFields;
  measurement: MeasurementFields;
  recommendedProducts: RecommendedProduct[];
}

export interface ExtractedSolutionBrief {
  opportunity: {
    advertiser: ExtractedField;
    agency: ExtractedField;
    campaign: ExtractedField;
    owner: ExtractedField;
  };
  timing: {
    flight: ExtractedField;
    deadline: ExtractedField;
  };
  business: {
    objective: ExtractedField;
    kpi: ExtractedField;
    budget: ExtractedField;
  };
  audience: {
    target: ExtractedField;
    markets: ExtractedField;
    exclusions: ExtractedField;
  };
  activation: {
    channels: ExtractedField;
    pmp: ExtractedField;
    dsp: ExtractedField;
    sponsorshipNeeds: ExtractedField;
    momentsTriggers: ExtractedField;
  };
  measurement: {
    attribution: ExtractedField;
    liftStudy: ExtractedField;
    reporting: ExtractedField;
    enrichment: ExtractedField;
  };
  recommendedProducts: ExtractedField<RecommendedProduct[]>;
  complexity: ExtractedField<Complexity>;
}

export type RfpIntakeSource = {
  type: IntakeSourceType;
  rawText?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  manualFields?: Partial<SolutionBrief>;
};

export type AgentExtractionResult = {
  brief: ExtractedSolutionBrief;
  recommendedProducts: string[];
  workstreams: Workstream[];
  risks: Risk[];
  missingInputs: string[];
  proposalDraft: ProposalDraft;
  sourceText: string;
  complexity: Complexity;
};

export interface Workstream {
  id: string;
  team: WorkstreamTeam;
  routingReason: string;
  request: string;
  owner: string;
  status: WorkstreamStatus;
  dueDate: string;
  response: string;
  confidence: "Low" | "Medium" | "High";
  dependencies: string;
}

export interface Risk {
  id: string;
  type: RiskType;
  description: string;
  severity: RiskLevel;
}

export interface ProposalDraft {
  executiveSummary: string;
  strategicRecommendation: string;
  audienceStrategy: string;
  recommendedProducts: string;
  activationPlan: string;
  measurementPlan: string;
  openQuestions: string;
  internalCaveats: string;
}

export interface RfpRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
  advertiser: string;
  agency: string;
  campaign: string;
  owner: string;
  deadline: string;
  status: RfpStatus;
  complexity: Complexity;
  riskLevel: RiskLevel;
  percentComplete: number;
  intakeNotes?: string;
  intakeSourceType?: IntakeSourceType;
  missingInputs?: string[];
  solutionBrief: SolutionBrief;
  workstreams: Workstream[];
  risks: Risk[];
  proposalDraft: ProposalDraft;
  currentStage: string;
  nextAction: string;
}

/** Raw intake form payload before AI extraction */
export interface IntakeFormData {
  advertiser: string;
  agency: string;
  campaignName: string;
  salesOwner: string;
  flightDates: string;
  submissionDeadline: string;
  objective: string;
  kpi: string;
  budget: string;
  targetAudience: string;
  markets: string;
  exclusions: string;
  requestedChannels: string;
  pmpRequired: string;
  dsp: string;
  sponsorshipNeeds: string;
  customMoments: string;
  attributionRequired: string;
  brandLiftRequired: string;
  reportingRequirements: string;
  dataEnrichmentNeeds: string;
  freeTextIntake: string;
}
