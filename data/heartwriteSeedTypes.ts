export type HeartWriteSeedPolarity = "positive" | "neutral" | "negative" | "mixed";

export type HeartWriteSeedIntensity = "soft" | "moderate" | "intense" | "extreme";

export type HeartWriteSeedCategory =
  | "personality_trait"
  | "strength"
  | "weakness"
  | "mood"
  | "appearance"
  | "clothing_aesthetic"
  | "wound"
  | "trigger"
  | "response"
  | "like"
  | "dislike"
  | "secret"
  | "humor"
  | "skill"
  | "intelligence_style"
  | "motivation"
  | "short_term_goal"
  | "long_term_goal"
  | "relationship_dynamic"
  | "romance_trope"
  | "relationship_gate"
  | "route"
  | "safety_flag";

export interface SeedBase {
  id: string;
  label: string;
  category: HeartWriteSeedCategory;
  aliases: readonly string[];
  description: string;
  tags: readonly string[];
  polarity?: HeartWriteSeedPolarity;
  intensity?: HeartWriteSeedIntensity;
  romanceRelevant: boolean;
  adult: boolean;
  unsafe: boolean;
  related?: readonly string[];
  opposites?: readonly string[];
  requires?: readonly string[];
  blocks?: readonly string[];
}

export interface TraitSeed extends SeedBase {
  category: "personality_trait";
  expression: readonly string[];
  internalMeaning: string;
  behaviors: readonly string[];
  dialogueExamples: readonly string[];
  bodyLanguage: readonly string[];
  commonTriggers: readonly string[];
  commonWounds: readonly string[];
  growthPath: readonly string[];
}

export interface StrengthSeed extends SeedBase {
  category: "strength";
  usefulWhen: readonly string[];
  supports: readonly string[];
  visibleAs: readonly string[];
  failureMode?: string;
}

export interface WeaknessSeed extends SeedBase {
  category: "weakness";
  manifestsAs: readonly string[];
  worsensWhen: readonly string[];
  softensWhen: readonly string[];
  repairPath: readonly string[];
}

export interface MoodSeed extends SeedBase {
  category: "mood";
  emotionalTexture: string;
  speechShift: readonly string[];
  bodyLanguage: readonly string[];
  likelyResponses: readonly string[];
  decayInto?: readonly string[];
  escalatesInto?: readonly string[];
}

export interface AppearanceSeed extends SeedBase {
  category: "appearance";
  visual: string;
  impression: string;
  proseSnippets: readonly string[];
  associatedVibes: readonly string[];
  imagePromptTags: readonly string[];
}

export interface AestheticSeed extends SeedBase {
  category: "clothing_aesthetic";
  visual: string;
  materials: readonly string[];
  colors: readonly string[];
  silhouette: readonly string[];
  impression: string;
  settingFit: readonly string[];
}

export interface WoundSeed extends SeedBase {
  category: "wound";
  coreFear: string;
  internalBelief: string;
  defensiveBehaviors: readonly string[];
  triggers: readonly string[];
  misreadsAs: readonly string[];
  healingSignals: readonly string[];
  growthPath: readonly string[];
}

export interface TriggerSeed extends SeedBase {
  category: "trigger";
  eventPattern: string;
  activatesWounds: readonly string[];
  likelyResponses: readonly string[];
  relationshipEffects: readonly string[];
  gatesOpened?: readonly string[];
  gatesClosed?: readonly string[];
}

export interface ResponseSeed extends SeedBase {
  category: "response";
  action: string;
  emotionalIntent: string;
  visibleBehavior: readonly string[];
  dialogueExamples: readonly string[];
  bodyLanguage: readonly string[];
  deescalatedBy: readonly string[];
  escalatesTo?: readonly string[];
}

export interface LikeSeed extends SeedBase {
  category: "like";
  whyItMatters: string;
  affectionSignal: string;
  sceneUses: readonly string[];
  memoryValue: "low" | "medium" | "high";
}

export interface DislikeSeed extends SeedBase {
  category: "dislike";
  emotionalReason: string;
  reactionStyle: readonly string[];
  relatedTriggers: readonly string[];
  boundaryImplication?: string;
}

export interface SecretSeed extends SeedBase {
  category: "secret";
  hiddenTruth: string;
  whyHidden: string;
  leakSignals: readonly string[];
  discoveryTriggers: readonly string[];
  revealConsequences: readonly string[];
  routeHooks: readonly string[];
}

export interface HumorSeed extends SeedBase {
  category: "humor";
  style: string;
  delivery: readonly string[];
  usedWhen: readonly string[];
  canMask: readonly string[];
  badFitWith?: readonly string[];
}

export interface SkillSeed extends SeedBase {
  category: "skill";
  competenceFantasy: string;
  visibleUses: readonly string[];
  romanticUses: readonly string[];
  scenarioHooks: readonly string[];
}

export interface IntelligenceSeed extends SeedBase {
  category: "intelligence_style";
  thinksBy: string;
  strengths: readonly string[];
  blindSpots: readonly string[];
  dialogueTexture: readonly string[];
}

export interface MotivationSeed extends SeedBase {
  category: "motivation";
  wants: string;
  because: string;
  methods: readonly string[];
  conflictsWith: readonly string[];
  payoffFantasy: string;
}

export interface ShortTermGoalSeed extends SeedBase {
  category: "short_term_goal";
  objective: string;
  timeframe: "scene" | "chapter" | "arc";
  tactics: readonly string[];
  complications: readonly string[];
  successSignals: readonly string[];
}

export interface LongTermGoalSeed extends SeedBase {
  category: "long_term_goal";
  objective: string;
  emotionalPayoff: string;
  requiredGrowth: readonly string[];
  obstacles: readonly string[];
  endingHooks: readonly string[];
}

export interface RelationshipDynamicSeed extends SeedBase {
  category: "relationship_dynamic";
  premise: string;
  affectionSignals: readonly string[];
  misunderstandings: readonly string[];
  commonConflicts: readonly string[];
  growthPath: readonly string[];
  compatibleWith: readonly string[];
}

export interface RomanceTropeSeed extends SeedBase {
  category: "romance_trope";
  premise: string;
  emotionalArc: readonly string[];
  startingConditions: readonly string[];
  commonConflicts: readonly string[];
  gates: readonly string[];
  payoffFantasy: string;
}

export interface GateSeed extends SeedBase {
  category: "relationship_gate";
  meaning: string;
  entersWhen: readonly string[];
  exitsWhen: readonly string[];
  unlocks: readonly string[];
  blocks: readonly string[];
}

export interface RouteSeed extends SeedBase {
  category: "route";
  premise: string;
  entersWhen: readonly string[];
  escalatesWhen: readonly string[];
  deescalatesWhen: readonly string[];
  phases: readonly string[];
  resolutions: readonly string[];
}

export interface SafetyFlagSeed extends SeedBase {
  category: "safety_flag";
  purpose: "content_warning" | "adult_gate" | "boundary" | "compatibility";
  blocksGeneration: boolean;
  requiresAdultCharacters: boolean;
  userFacingLabel: string;
  explanation: string;
}

export type HeartWriteSeed =
  | TraitSeed
  | StrengthSeed
  | WeaknessSeed
  | MoodSeed
  | AppearanceSeed
  | AestheticSeed
  | WoundSeed
  | TriggerSeed
  | ResponseSeed
  | LikeSeed
  | DislikeSeed
  | SecretSeed
  | HumorSeed
  | SkillSeed
  | IntelligenceSeed
  | MotivationSeed
  | ShortTermGoalSeed
  | LongTermGoalSeed
  | RelationshipDynamicSeed
  | RomanceTropeSeed
  | GateSeed
  | RouteSeed
  | SafetyFlagSeed;

export const HEARTWRITE_SEED_CATEGORIES = Object.freeze([
  "personality_trait",
  "strength",
  "weakness",
  "mood",
  "appearance",
  "clothing_aesthetic",
  "wound",
  "trigger",
  "response",
  "like",
  "dislike",
  "secret",
  "humor",
  "skill",
  "intelligence_style",
  "motivation",
  "short_term_goal",
  "long_term_goal",
  "relationship_dynamic",
  "romance_trope",
  "relationship_gate",
  "route",
  "safety_flag",
] as const satisfies readonly HeartWriteSeedCategory[]);
