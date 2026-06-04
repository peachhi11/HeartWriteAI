export type BusinessSkillPresetCategory =
  | "Archetype"
  | "Core Skill"
  | "Finance Skill"
  | "Sales And Marketing Skill"
  | "Operations Skill"
  | "Weakness"
  | "Romance Hook"
  | "Gate"
  | "Mastery"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface BusinessSkillPreset {
  id: string;
  category: BusinessSkillPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledBusinessSkillPresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface BusinessSkillSeedGroup {
  category: BusinessSkillPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const BUSINESS_SKILL_GUIDANCE =
  "Use this as business skill texture. Leadership, finance, operations, negotiation, pressure, public image, and ambition may shape scenes without replacing personality, consent, or {{user}} agency.";

const BUSINESS_SKILL_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "business_skill_archetype",
    guidance: BUSINESS_SKILL_GUIDANCE,
    values: [
      "The CEO",
      "The Entrepreneur",
      "The Executive Strategist",
      "The Negotiator",
      "The Investor",
      "The Financial Mind",
      "The Marketing Genius",
      "The Sales Closer",
      "The Startup Founder",
      "The Corporate Heir",
      "The Operations Expert",
      "The Project Manager",
      "The Risk Manager",
      "The Brand Builder",
      "The Merchant Prince",
      "The Guild Master",
      "The Family Business Successor",
      "The Ruthless Capitalist",
      "The Ethical Leader",
      "The One Who Builds Empires",
    ],
  },
  {
    category: "Core Skill",
    prefix: "business_skill_core",
    guidance:
      "Use this as core business texture. Management, strategy, hiring, team building, development, stakeholders, and client relationships may shape competence and pressure.",
    values: [
      "business skill",
      "management",
      "leadership",
      "entrepreneurship",
      "executive decision making",
      "strategic planning",
      "business strategy",
      "operations management",
      "project management",
      "team building",
      "delegation",
      "hiring",
      "recruitment",
      "training",
      "performance management",
      "business development",
      "partnership building",
      "stakeholder management",
      "client relations",
      "customer relations",
    ],
  },
  {
    category: "Finance Skill",
    prefix: "business_skill_finance",
    guidance:
      "Use this as finance texture. Budgeting, investment, valuation, risk, tax, capital, wealth, and inheritance may create stakes without turning people into assets.",
    values: [
      "finance",
      "accounting",
      "budgeting",
      "investing",
      "valuation",
      "forecasting",
      "financial modelling",
      "cash flow management",
      "profit analysis",
      "cost control",
      "pricing strategy",
      "risk assessment",
      "tax strategy",
      "fundraising",
      "venture capital",
      "private equity",
      "asset management",
      "wealth management",
      "mergers and acquisitions",
      "inheritance management",
    ],
  },
  {
    category: "Sales And Marketing Skill",
    prefix: "business_skill_sales_marketing",
    guidance:
      "Use this as sales and marketing texture. Pitching, brand, reputation, research, retention, and public image may shape charm and strategy without coercion.",
    values: [
      "sales",
      "negotiation",
      "closing deals",
      "marketing",
      "branding",
      "advertising",
      "public relations",
      "market research",
      "customer discovery",
      "campaign strategy",
      "social media marketing",
      "influencer marketing",
      "luxury branding",
      "product positioning",
      "copywriting",
      "pitching",
      "relationship selling",
      "client retention",
      "reputation management",
      "personal branding",
    ],
  },
  {
    category: "Operations Skill",
    prefix: "business_skill_operations",
    guidance:
      "Use this as operations texture. Logistics, supply chains, procurement, compliance, quality, continuity, and scaling may ground practical stakes.",
    values: [
      "operations",
      "logistics",
      "supply chain management",
      "inventory management",
      "process improvement",
      "quality control",
      "vendor management",
      "procurement",
      "workflow design",
      "resource allocation",
      "systems building",
      "scaling operations",
      "crisis management",
      "compliance management",
      "contract management",
      "facilities management",
      "distribution strategy",
      "production planning",
      "service delivery",
      "business continuity",
    ],
  },
  {
    category: "Weakness",
    prefix: "business_skill_weakness",
    guidance:
      "Use this as business vulnerability texture. Workaholism, control, wealth isolation, legacy pressure, and ambition may surface without glorifying exploitation.",
    values: [
      "workaholism",
      "control issues",
      "ruthless ambition",
      "fear of failure",
      "fear of poverty",
      "trusts contracts more than people",
      "uses work to avoid feelings",
      "profit over people tendency",
      "family business pressure",
      "legacy burden",
      "public image obsession",
      "cannot delegate",
      "burnout",
      "impostor syndrome",
      "financial insecurity wound",
      "success as survival",
      "wealth isolation",
      "power as protection",
      "love as liability",
      "career against love conflict",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "business_skill_romance",
    guidance:
      "Use this as business romance texture. Work, money, status, contracts, travel, and public image may create pressure while preserving adult consent and power awareness.",
    values: [
      "boss drops professional mask",
      "CEO assistant slow burn",
      "rivals for contract",
      "startup cofounders to lovers",
      "family business arranged match",
      "corporate heir and employee",
      "mentor protege tension",
      "business trip forced proximity",
      "late-night office confession",
      "negotiation turns personal",
      "contract relationship becomes real",
      "fake dating for public image",
      "inheritance condition romance",
      "power couple arc",
      "merger marriage alliance",
      "client becomes love interest",
      "wealth isolation softened",
      "love over legacy",
      "career and love balance",
      "building an empire together",
    ],
  },
  {
    category: "Gate",
    prefix: "business_skill_gate",
    guidance:
      "Use this as business progression texture. Meetings, contracts, burnout, risk, masks, and people over profit may mark relationship development.",
    values: [
      "first business meeting gate",
      "first negotiation gate",
      "first contract gate",
      "first power play gate",
      "first late-night work gate",
      "first business trip gate",
      "first public image crisis gate",
      "first financial risk gate",
      "first career against love gate",
      "first legacy pressure gate",
      "first trust over contract gate",
      "first delegation gate",
      "first burnout reveal gate",
      "first chooses people over profit gate",
      "first professional mask drop gate",
      "equal partners gate",
      "love over ambition gate",
      "career and love gate",
      "shared empire gate",
      "soft power route",
    ],
  },
  {
    category: "Mastery",
    prefix: "business_skill_mastery",
    guidance:
      "Use this as business mastery texture. Training, entrepreneurship, negotiation, industry standing, inherited power, and empire building may calibrate status and cost.",
    values: [
      "business novice",
      "trained manager",
      "skilled operator",
      "startup founder",
      "seasoned executive",
      "serial entrepreneur",
      "master negotiator",
      "finance expert",
      "marketing expert",
      "operations expert",
      "guild master",
      "merchant mastermind",
      "corporate strategist",
      "business prodigy",
      "self-made success",
      "old money operator",
      "family business heir",
      "industry leader",
      "empire builder",
      "legendary dealmaker",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "business_skill_dialogue",
    guidance:
      "Use this as dialogue inspiration. Keep lines natural, context-sensitive, and responsive rather than copied as fixed script.",
    values: [
      "Everything is a negotiation to you.",
      "Not everything.",
      "Then what am I?",
      "The first thing I did not want to win. I wanted to keep.",
      "You need to rest.",
      "The company needs me.",
      "So do you.",
      "I can buy almost anything.",
      "That must be lonely.",
      "It was. Before you started refusing to be bought.",
      "This is bad for business.",
      "And good for you?",
      "Terrifyingly good.",
      "I do not want to be another asset in your life.",
      "You are not an asset. You are the reason I remembered I had one.",
      "Choose the deal.",
      "No.",
      "No, just like that?",
      "I am tired of mistaking profit for a future.",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "business_skill_high_value",
    guidance:
      "Use this as a high-signal business seed for matching, quick presets, or compiler weighting. Treat it as additive context only.",
    values: [
      "leadership",
      "management",
      "entrepreneurship",
      "negotiation",
      "strategic planning",
      "finance",
      "investing",
      "marketing",
      "branding",
      "sales",
      "operations management",
      "project management",
      "risk assessment",
      "business development",
      "executive decision making",
      "workaholism",
      "career against love conflict",
      "boss drops professional mask",
      "trust over contract gate",
      "building an empire together",
    ],
  },
] satisfies readonly BusinessSkillSeedGroup[]);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const makePreset = (group: BusinessSkillSeedGroup, value: string): BusinessSkillPreset => ({
  id: `${group.prefix}_${slugify(value)}`,
  category: group.category,
  label: value,
  value,
  triggerKeys: Array.from(
    new Set([
      value,
      ...value
        .toLowerCase()
        .replace(/\{\{user\}\}/g, "user")
        .split(/[^a-z0-9]+/)
        .filter((part) => part.length > 2),
    ]),
  ),
  guidance: group.guidance,
  systemPromptTags: [group.category, value],
});

export const BUSINESS_SKILL_PRESETS = BUSINESS_SKILL_SEED_GROUPS.flatMap((group) =>
  group.values.map((value) => makePreset(group, value)),
);

export const BUSINESS_SKILL_PRESET_CATEGORIES = Array.from(
  new Set(BUSINESS_SKILL_PRESETS.map((preset) => preset.category)),
).sort();

export const getBusinessSkillPresetsByCategory = (category: BusinessSkillPresetCategory) =>
  BUSINESS_SKILL_PRESETS.filter((preset) => preset.category === category);

export const findBusinessSkillPresetById = (id: string) =>
  BUSINESS_SKILL_PRESETS.find((preset) => preset.id === id);

export const compileBusinessSkillPresetAdditions = (
  preset: BusinessSkillPreset,
): CompiledBusinessSkillPresetAdditions => ({
  backgroundAddition: `Business skill context: ${preset.value}. ${preset.guidance}`,
  personalityAddition: `Business texture may include ${preset.value} without replacing the character's full personality, tenderness, limits, contradictions, or growth.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft business context.`,
    "Let leadership, money, contracts, operations, public image, or ambition shape behaviour when relevant.",
    "Keep consent, boundaries, workplace ethics, and {{user}} autonomy intact; power should remain consequence-aware.",
  ].join(" "),
});
