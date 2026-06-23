import type { RfpRecord } from "@/types/rfp";

export const SEED_RFPS: RfpRecord[] = [
  {
    id: "rfp-nike-wc-2026",
    createdAt: "2026-06-10T09:00:00Z",
    updatedAt: "2026-06-18T14:30:00Z",
    advertiser: "Nike",
    agency: "Omnicom",
    campaign: "World Cup Training Collection",
    owner: "Sarah Chen",
    deadline: "2026-06-27",
    status: "Awaiting Inputs",
    complexity: "High",
    riskLevel: "Medium",
    percentComplete: 45,
    intakeNotes:
      "Nike launching World Cup training collection. Need soccer fan audiences, moment-based activation around goals, brand lift study. Budget ~$2.5M. PMP required on DV360.",
    solutionBrief: {
      opportunity: {
        advertiser: "Nike",
        agency: "Omnicom",
        campaign: "World Cup Training Collection",
        owner: "Sarah Chen",
      },
      timing: {
        flight: "Jul 1 – Aug 15, 2026",
        deadline: "2026-06-27",
      },
      business: {
        objective: "Drive awareness and consideration for World Cup training collection",
        kpi: "Reach, VCR, brand lift (+5pts)",
        budget: "$2.5M",
      },
      audience: {
        target: "Soccer fans 18-34, fitness enthusiasts, Nike loyalists",
        markets: "US, UK, DE, FR, BR",
        exclusions: "Competitive athletic wear purchasers (last 30d)",
      },
      activation: {
        channels: "CTV, programmatic video, display",
        pmp: "Yes — Genius Sports PMP on DV360",
        dsp: "DV360",
        sponsorshipNeeds: "None",
        momentsTriggers: "Goal scored, penalty kick, match start moments",
      },
      measurement: {
        attribution: "Multi-touch attribution required",
        liftStudy: "Required — brand lift study",
        reporting: "Weekly dashboards + post-campaign readout",
        enrichment: "Fan Graph segment performance overlay",
      },
      recommendedProducts: [
        "Curated Deals",
        "Audiences / Fan Graph",
        "Moments",
        "Measurement / Insights",
      ],
    },
    workstreams: [
      {
        id: "ws-nike-commercial",
        team: "Commercial / Sales",
        routingReason: "Owns client relationship and commercial framing",
        request: "Validate budget, timeline, and client priorities",
        owner: "Sarah Chen",
        status: "Complete",
        dueDate: "2026-06-14",
        response: "Budget confirmed at $2.5M. Client prioritizes soccer markets and moment-based creative.",
        confidence: "High",
        dependencies: "None",
      },
      {
        id: "ws-nike-audience",
        team: "Audience & Insights",
        routingReason: "Audience or targeting requirements detected",
        request: "Recommend Fan Graph segments and reach estimates",
        owner: "Marcus Webb",
        status: "In Progress",
        dueDate: "2026-06-20",
        response: "Draft segments: Soccer Superfans, Fitness Crossover, Nike Brand Loyalists. Reach TBD.",
        confidence: "Medium",
        dependencies: "Market prioritization from Commercial",
      },
      {
        id: "ws-nike-dealdesk",
        team: "Media Planning / Deal Desk",
        routingReason: "Budget, impressions, CPM, or inventory needs identified",
        request: "Confirm deal availability, pricing, and PMP packaging",
        owner: "Priya Sharma",
        status: "Requested",
        dueDate: "2026-06-22",
        response: "",
        confidence: "Medium",
        dependencies: "Audience segment confirmation",
      },
      {
        id: "ws-nike-product",
        team: "Product / Moments",
        routingReason: "Moments, triggers, or DCO requested",
        request: "Assess moment taxonomy fit and activation feasibility",
        owner: "James Okonkwo",
        status: "In Progress",
        dueDate: "2026-06-21",
        response: "Goal and penalty moments available in WC taxonomy. Custom training collection overlay pending.",
        confidence: "Medium",
        dependencies: "Creative specs from client",
      },
      {
        id: "ws-nike-measurement",
        team: "Measurement & Enrichment",
        routingReason: "Attribution, brand lift, or reporting requirements present",
        request: "Define measurement design and data enrichment scope",
        owner: "Elena Vasquez",
        status: "Requested",
        dueDate: "2026-06-23",
        response: "",
        confidence: "Low",
        dependencies: "Activation plan finalization",
      },
    ],
    risks: [
      {
        id: "risk-nike-product",
        type: "custom product feasibility needed",
        description: "Custom moment overlays for training collection require product validation",
        severity: "Medium",
      },
      {
        id: "risk-nike-inventory",
        type: "inventory availability unknown",
        description: "WC inventory in BR market not yet confirmed",
        severity: "Medium",
      },
    ],
    proposalDraft: {
      executiveSummary:
        "Nike is seeking a high-impact World Cup activation for its Training Collection across five key markets. Genius Sports recommends a moment-driven programmatic strategy powered by Fan Graph audiences.",
      strategicRecommendation:
        "Activate around live match moments with Nike-branded overlays tied to goal events and training content. Prioritize CTV and video for brand impact.",
      audienceStrategy:
        "Target Soccer Superfans and Fitness Crossover segments via Fan Graph. Apply competitive exclusions and geo-specific weighting.",
      recommendedProducts:
        "Curated Deals, Audiences / Fan Graph, Moments, Measurement / Insights",
      activationPlan:
        "Jul 1 – Aug 15 flight. CTV + programmatic video on DV360 PMP. Goal/penalty moment triggers with DCO-ready assets.",
      measurementPlan:
        "Multi-touch attribution + brand lift study (+5pt target). Weekly dashboards with Fan Graph enrichment.",
      openQuestions:
        "3 workstreams pending. BR inventory confirmation and custom moment overlay feasibility outstanding.",
      internalCaveats:
        "⚠ Downstream draft only. Do not share until Deal Desk confirms inventory and Product validates custom moments.",
    },
    currentStage: "Awaiting Inputs",
    nextAction: "Collect Audience & Insights and Deal Desk responses before proposal draft",
  },
  {
    id: "rfp-fanduel-nfl-2026",
    createdAt: "2026-06-05T11:00:00Z",
    updatedAt: "2026-06-17T10:00:00Z",
    advertiser: "FanDuel",
    agency: "Publicis",
    campaign: "NFL Live Odds Awareness",
    owner: "Mike Torres",
    deadline: "2026-06-30",
    status: "Solution Brief Created",
    complexity: "Medium",
    riskLevel: "High",
    percentComplete: 30,
    intakeNotes:
      "FanDuel NFL season awareness. Gambling/betting category — legal review required. Need reach among NFL fans. Age 21+ targeting. Reporting on odds engagement.",
    solutionBrief: {
      opportunity: {
        advertiser: "FanDuel",
        agency: "Publicis",
        campaign: "NFL Live Odds Awareness",
        owner: "Mike Torres",
      },
      timing: {
        flight: "Sep 1 – Jan 15, 2027",
        deadline: "2026-06-30",
      },
      business: {
        objective: "Drive awareness of live odds features during NFL season",
        kpi: "Reach, frequency, odds page visits",
        budget: "$1.8M",
      },
      audience: {
        target: "NFL fans 21+, sports bettors, fantasy players",
        markets: "US (state-level compliance)",
        exclusions: "Under 21, non-legal betting states",
      },
      activation: {
        channels: "Programmatic display, video, in-app",
        pmp: "Yes",
        dsp: "The Trade Desk",
        sponsorshipNeeds: "None",
        momentsTriggers: "Touchdown, red zone entry, 4th quarter",
      },
      measurement: {
        attribution: "Last-click + view-through",
        liftStudy: "Not requested",
        reporting: "Weekly reach/frequency + odds engagement",
        enrichment: "State-level compliance tagging",
      },
      recommendedProducts: ["Curated Deals", "Measurement / Insights"],
    },
    workstreams: [
      {
        id: "ws-fd-commercial",
        team: "Commercial / Sales",
        routingReason: "Owns client relationship and commercial framing",
        request: "Validate budget, timeline, and client priorities",
        owner: "Mike Torres",
        status: "Complete",
        dueDate: "2026-06-10",
        response: "Budget $1.8M confirmed. Priority states: NJ, PA, MI, IL, AZ.",
        confidence: "High",
        dependencies: "None",
      },
      {
        id: "ws-fd-dealdesk",
        team: "Media Planning / Deal Desk",
        routingReason: "Budget, impressions, CPM, or inventory needs identified",
        request: "Confirm deal availability, pricing, and PMP packaging",
        owner: "Priya Sharma",
        status: "Requested",
        dueDate: "2026-06-24",
        response: "",
        confidence: "Medium",
        dependencies: "Legal state list approval",
      },
      {
        id: "ws-fd-legal",
        team: "Legal / Data Ops",
        routingReason: "Regulatory, age, or data usage terms detected",
        request: "Review compliance, data rights, and contractual terms",
        owner: "Legal Counsel",
        status: "In Progress",
        dueDate: "2026-06-20",
        response: "Reviewing state-level targeting restrictions and responsible gaming disclaimers.",
        confidence: "Low",
        dependencies: "Client legal terms document",
      },
      {
        id: "ws-fd-measurement",
        team: "Measurement & Enrichment",
        routingReason: "Attribution, brand lift, or reporting requirements present",
        request: "Define measurement design and data enrichment scope",
        owner: "Elena Vasquez",
        status: "Not Started",
        dueDate: "2026-06-26",
        response: "",
        confidence: "Medium",
        dependencies: "Legal approval of tracking pixels",
      },
    ],
    risks: [
      {
        id: "risk-fd-legal",
        type: "legal review needed",
        description: "Gambling category requires legal review before any external commitment",
        severity: "High",
      },
      {
        id: "risk-fd-measurement",
        type: "unclear measurement requirement",
        description: "Odds engagement tracking methodology not yet defined with client",
        severity: "Medium",
      },
    ],
    proposalDraft: {
      executiveSummary:
        "FanDuel seeks NFL season awareness for live odds features. Genius Sports recommends a compliant, reach-focused programmatic strategy targeting NFL fans in legal betting states.",
      strategicRecommendation:
        "Maximize reach during high-intent NFL moments while maintaining strict age and geo compliance.",
      audienceStrategy:
        "NFL fans 21+ in approved states. Exclude non-legal markets and under-21 audiences.",
      recommendedProducts: "Curated Deals, Measurement / Insights",
      activationPlan:
        "Sep–Jan flight on TTD PMP. Touchdown and red zone moment triggers with responsible gaming messaging.",
      measurementPlan:
        "Last-click + VTA attribution. Weekly reach/frequency with state-level compliance reporting.",
      openQuestions:
        "Legal review in progress. Measurement design pending legal pixel approval.",
      internalCaveats:
        "⚠ DO NOT SHARE externally until Legal completes review. Gambling category restrictions apply.",
    },
    currentStage: "Solution Brief Created",
    nextAction: "Complete Legal / Data Ops review before routing to Deal Desk",
  },
  {
    id: "rfp-toyota-cfb-2026",
    createdAt: "2026-05-28T08:00:00Z",
    updatedAt: "2026-06-19T16:00:00Z",
    advertiser: "Toyota",
    agency: "IPG",
    campaign: "College Football Sponsorship Extension",
    owner: "Lisa Park",
    deadline: "2026-06-25",
    status: "Proposal Draft",
    complexity: "High",
    riskLevel: "Low",
    percentComplete: 78,
    intakeNotes:
      "Toyota extending CFB sponsorship package. Broadcast integration, custom creative, brand lift. $4M budget. Managed service preferred.",
    solutionBrief: {
      opportunity: {
        advertiser: "Toyota",
        agency: "IPG",
        campaign: "College Football Sponsorship Extension",
        owner: "Lisa Park",
      },
      timing: {
        flight: "Aug 28 – Dec 31, 2026",
        deadline: "2026-06-25",
      },
      business: {
        objective: "Extend Toyota CFB sponsorship visibility and drive dealership traffic",
        kpi: "Brand lift, sponsorship recall, dealer visit intent",
        budget: "$4M",
      },
      audience: {
        target: "College football fans 25-54, Toyota intenders, alumni",
        markets: "US — SEC, Big Ten, ACC priority",
        exclusions: "Existing Toyota owners (CRM suppression)",
      },
      activation: {
        channels: "Broadcast, CTV, programmatic, social amplification",
        pmp: "Yes",
        dsp: "DV360 + Amazon DSP",
        sponsorshipNeeds: "Broadcast sponsorship integration, in-game branding, halftime features",
        momentsTriggers: "Touchdown, rivalry games, bowl season",
      },
      measurement: {
        attribution: "Brand lift + geo-lift for dealership visits",
        liftStudy: "Required — sponsorship recall and purchase intent",
        reporting: "Bi-weekly sponsorship reporting + post-season analysis",
        enrichment: "Alumni affiliation and conference affinity overlays",
      },
      recommendedProducts: [
        "Sponsorship & Broadcast",
        "Audiences / Fan Graph",
        "Managed Service",
        "Measurement / Insights",
      ],
    },
    workstreams: [
      {
        id: "ws-toyota-commercial",
        team: "Commercial / Sales",
        routingReason: "Owns client relationship and commercial framing",
        request: "Validate budget, timeline, and client priorities",
        owner: "Lisa Park",
        status: "Complete",
        dueDate: "2026-06-05",
        response: "$4M confirmed. Managed service model preferred.",
        confidence: "High",
        dependencies: "None",
      },
      {
        id: "ws-toyota-creative",
        team: "Creative Services",
        routingReason: "Sponsorship or broadcast assets may require creative support",
        request: "Review sponsorship creative and broadcast deliverables",
        owner: "Creative Director",
        status: "Complete",
        dueDate: "2026-06-12",
        response: "Broadcast assets approved. Custom rivalry game overlays in production.",
        confidence: "High",
        dependencies: "Broadcast partner specs",
      },
      {
        id: "ws-toyota-sponsorship",
        team: "Media Planning / Deal Desk",
        routingReason: "Budget, impressions, CPM, or inventory needs identified",
        request: "Confirm deal availability, pricing, and PMP packaging",
        owner: "Priya Sharma",
        status: "Complete",
        dueDate: "2026-06-15",
        response: "SEC and Big Ten broadcast inventory confirmed. CPM packages finalized.",
        confidence: "High",
        dependencies: "None",
      },
      {
        id: "ws-toyota-measurement",
        team: "Measurement & Enrichment",
        routingReason: "Attribution, brand lift, or reporting requirements present",
        request: "Define measurement design and data enrichment scope",
        owner: "Elena Vasquez",
        status: "In Progress",
        dueDate: "2026-06-22",
        response: "Brand lift study design drafted. Geo-lift methodology under review.",
        confidence: "Medium",
        dependencies: "Dealer geo data from client",
      },
    ],
    risks: [],
    proposalDraft: {
      executiveSummary:
        "Toyota is extending its College Football sponsorship with a $4M integrated broadcast and digital package. Genius Sports recommends a managed service approach with Fan Graph-powered audience targeting.",
      strategicRecommendation:
        "Leverage broadcast sponsorship equity with digital amplification during rivalry games and bowl season. Managed service ensures end-to-end execution.",
      audienceStrategy:
        "Target CFB fans 25-54 with alumni and conference affinity overlays. Suppress existing Toyota owners.",
      recommendedProducts:
        "Sponsorship & Broadcast, Audiences / Fan Graph, Managed Service, Measurement / Insights",
      activationPlan:
        "Aug–Dec flight. Broadcast integration + CTV/programmatic amplification. Rivalry game and bowl season moment triggers.",
      measurementPlan:
        "Brand lift study for sponsorship recall + geo-lift for dealership visits. Bi-weekly reporting.",
      openQuestions:
        "Dealer geo data pending from client for geo-lift methodology.",
      internalCaveats:
        "⚠ Draft ready for internal review. Measurement geo-lift contingent on client data delivery.",
    },
    currentStage: "Proposal Draft",
    nextAction: "Final measurement sign-off, then Commercial review before client delivery",
  },
];

export function getSeedRfpById(id: string): RfpRecord | undefined {
  return SEED_RFPS.find((r) => r.id === id);
}
