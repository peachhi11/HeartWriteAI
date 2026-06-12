export type VocabularySeedRarity = "common" | "uncommon" | "rare";

export interface VocabularySeedMetadata {
  rarity: VocabularySeedRarity;
  romanceValue: number;
  conflictPotential: number;
}

export interface VocabularySeedPreset {
  seed: string;
  label: string;
  description: string;
  examples: readonly string[];
  tags: readonly string[];
  relatedSeeds: readonly string[];
  oppositeSeeds: readonly string[];
  romanceHooks: readonly string[];
  scenarioHooks: readonly string[];
  dialoguePatterns: readonly string[];
  metadata: VocabularySeedMetadata;
}

export interface VocabularySeedPresetInput {
  seed: string;
  label: string;
  description: string;
  examples?: readonly string[];
  tags?: readonly string[];
  relatedSeeds?: readonly string[];
  oppositeSeeds?: readonly string[];
  romanceHooks?: readonly string[];
  scenarioHooks?: readonly string[];
  dialoguePatterns?: readonly string[];
  metadata?: Partial<VocabularySeedMetadata>;
}

export type WoundSeedSeverity = "soft" | "major" | "core" | "extreme";

export interface WoundSeedMetadata {
  category: string;
  severity: WoundSeedSeverity;
  romanceValue: number;
  angstValue: number;
  healingValue: number;
}

export interface WoundSeed {
  seed: string;
  label: string;
  description: string;
  examples: readonly string[];
  tags: readonly string[];
  relatedSeeds: readonly string[];
  oppositeSeeds: readonly string[];
  romanceHooks: readonly string[];
  scenarioHooks: readonly string[];
  dialoguePatterns: readonly string[];
  triggers: readonly string[];
  defenseMechanisms: readonly string[];
  attachmentEffects: readonly string[];
  healingNeeds: readonly string[];
  repairMethods: readonly string[];
  growthArcs: readonly string[];
  metadata: WoundSeedMetadata;
}

export interface WoundSeedInput {
  seed: string;
  label: string;
  description: string;
  examples?: readonly string[];
  tags?: readonly string[];
  relatedSeeds?: readonly string[];
  oppositeSeeds?: readonly string[];
  romanceHooks?: readonly string[];
  scenarioHooks?: readonly string[];
  dialoguePatterns?: readonly string[];
  triggers?: readonly string[];
  defenseMechanisms?: readonly string[];
  attachmentEffects?: readonly string[];
  healingNeeds?: readonly string[];
  repairMethods?: readonly string[];
  growthArcs?: readonly string[];
  metadata?: Partial<WoundSeedMetadata>;
}

export type FearSeedType =
  | "attachment"
  | "identity"
  | "safety"
  | "social"
  | "romantic"
  | "emotional"
  | "moral"
  | "existential"
  | "control"
  | "self_worth"
  | "obsession"
  | "healing";

export type FearSeedSeverity = "soft" | "moderate" | "major" | "core" | "extreme";

export type FearSeedPacingPressure = "low" | "medium" | "high";

export interface FearSeedMetadata {
  category: "fear";
  severity: FearSeedSeverity;
  romanceValue: number;
  angstValue: number;
  conflictPotential: number;
  healingValue: number;
  pacingPressure: FearSeedPacingPressure;
}

export interface FearSeed {
  seed: string;
  label: string;
  description: string;
  examples: readonly string[];
  tags: readonly string[];
  relatedSeeds: readonly string[];
  oppositeSeeds: readonly string[];
  romanceHooks: readonly string[];
  scenarioHooks: readonly string[];
  dialoguePatterns: readonly string[];
  fearType: FearSeedType;
  coreBelief: string;
  hiddenNeed: string;
  perceivedThreat: string;
  triggers: readonly string[];
  earlyWarnings: readonly string[];
  escalationPattern: readonly string[];
  defenseMechanisms: readonly string[];
  copingBehaviors: readonly string[];
  avoidancePatterns: readonly string[];
  attachmentEffects: readonly string[];
  intimacyEffects: readonly string[];
  conflictEffects: readonly string[];
  misreadSignals: readonly string[];
  reassuranceNeeds: readonly string[];
  repairMethods: readonly string[];
  healingNeeds: readonly string[];
  growthArcs: readonly string[];
  routeGates: readonly string[];
  compatibleWounds: readonly string[];
  incompatibleDynamics: readonly string[];
  metadata: FearSeedMetadata;
}

export interface FearSeedInput {
  seed: string;
  label: string;
  description: string;
  examples?: readonly string[];
  tags?: readonly string[];
  relatedSeeds?: readonly string[];
  oppositeSeeds?: readonly string[];
  romanceHooks?: readonly string[];
  scenarioHooks?: readonly string[];
  dialoguePatterns?: readonly string[];
  fearType: FearSeedType;
  coreBelief: string;
  hiddenNeed: string;
  perceivedThreat: string;
  triggers?: readonly string[];
  earlyWarnings?: readonly string[];
  escalationPattern?: readonly string[];
  defenseMechanisms?: readonly string[];
  copingBehaviors?: readonly string[];
  avoidancePatterns?: readonly string[];
  attachmentEffects?: readonly string[];
  intimacyEffects?: readonly string[];
  conflictEffects?: readonly string[];
  misreadSignals?: readonly string[];
  reassuranceNeeds?: readonly string[];
  repairMethods?: readonly string[];
  healingNeeds?: readonly string[];
  growthArcs?: readonly string[];
  routeGates?: readonly string[];
  compatibleWounds?: readonly string[];
  incompatibleDynamics?: readonly string[];
  metadata?: Partial<FearSeedMetadata>;
}

export type DesireSeedType =
  | "attachment"
  | "romantic"
  | "identity"
  | "safety"
  | "self_worth"
  | "social"
  | "ambition"
  | "sensory"
  | "moral"
  | "existential"
  | "healing"
  | "obsessive";

export type DesireSeedIntensity =
  | "soft"
  | "moderate"
  | "strong"
  | "core"
  | "overwhelming";

export type DesireSeedPacingPressure = "low" | "medium" | "high";

export interface DesireSeedMetadata {
  category: DesireSeedType;
  intensity: DesireSeedIntensity;
  romanceValue: number;
  angstValue: number;
  conflictPotential: number;
  healingValue: number;
  pacingPressure: DesireSeedPacingPressure;
}

export interface DesireSeed {
  seed: string;
  label: string;
  description: string;
  examples: readonly string[];
  tags: readonly string[];
  relatedSeeds: readonly string[];
  oppositeSeeds: readonly string[];
  romanceHooks: readonly string[];
  scenarioHooks: readonly string[];
  dialoguePatterns: readonly string[];
  metadata: DesireSeedMetadata;
}

export interface DesireSeedInput {
  seed: string;
  label: string;
  description: string;
  examples?: readonly string[];
  tags?: readonly string[];
  relatedSeeds?: readonly string[];
  oppositeSeeds?: readonly string[];
  romanceHooks?: readonly string[];
  scenarioHooks?: readonly string[];
  dialoguePatterns?: readonly string[];
  metadata?: Partial<DesireSeedMetadata>;
}

export type HiddenNeedSeedType =
  | "safety"
  | "attachment"
  | "belonging"
  | "recognition"
  | "autonomy"
  | "boundaries"
  | "rest"
  | "truth"
  | "repair"
  | "touch"
  | "validation"
  | "mutuality"
  | "acceptance";

export type HiddenNeedUrgency = "soft" | "moderate" | "strong" | "core";
export type HiddenNeedPacingPressure = "low" | "medium" | "high";

export interface HiddenNeedSeedMetadata {
  category: "hidden_need";
  urgency: HiddenNeedUrgency;
  romanceValue: number;
  conflictPotential: number;
  healingValue: number;
  pacingPressure: HiddenNeedPacingPressure;
}

export interface HiddenNeedSeed {
  seed: string;
  label: string;
  description: string;
  examples: readonly string[];
  tags: readonly string[];
  relatedSeeds: readonly string[];
  oppositeSeeds: readonly string[];
  romanceHooks: readonly string[];
  scenarioHooks: readonly string[];
  dialoguePatterns: readonly string[];
  needType: HiddenNeedSeedType;
  masksAs: readonly string[];
  createdByWounds: readonly string[];
  drivenByFears: readonly string[];
  expressedAsDesires: readonly string[];
  activatedByTriggers: readonly string[];
  commonResponses: readonly string[];
  loveLanguages: readonly string[];
  compatibleRepairStyles: readonly string[];
  growthArcs: readonly string[];
  unmetConsequences: readonly string[];
  fulfillmentSignals: readonly string[];
  routeGates: readonly string[];
  milestoneMemories: readonly string[];
  metadata: HiddenNeedSeedMetadata;
}

export interface HiddenNeedSeedInput {
  seed: string;
  label: string;
  description: string;
  examples?: readonly string[];
  tags?: readonly string[];
  relatedSeeds?: readonly string[];
  oppositeSeeds?: readonly string[];
  romanceHooks?: readonly string[];
  scenarioHooks?: readonly string[];
  dialoguePatterns?: readonly string[];
  needType: HiddenNeedSeedType;
  masksAs?: readonly string[];
  createdByWounds?: readonly string[];
  drivenByFears?: readonly string[];
  expressedAsDesires?: readonly string[];
  activatedByTriggers?: readonly string[];
  commonResponses?: readonly string[];
  loveLanguages?: readonly string[];
  compatibleRepairStyles?: readonly string[];
  growthArcs?: readonly string[];
  unmetConsequences?: readonly string[];
  fulfillmentSignals?: readonly string[];
  routeGates?: readonly string[];
  milestoneMemories?: readonly string[];
  metadata?: Partial<HiddenNeedSeedMetadata>;
}

export type EmotionalMeaningSeedType =
  | "attention"
  | "safety"
  | "choice"
  | "reassurance"
  | "devotion"
  | "care"
  | "respect"
  | "validation"
  | "belonging"
  | "repair"
  | "presence"
  | "home";

export type EmotionalMeaningSubtlety = "low" | "medium" | "high";

export interface EmotionalMeaningSeedMetadata {
  category: "emotional_meaning";
  subtlety: EmotionalMeaningSubtlety;
  romanceValue: number;
  healingValue: number;
  conflictPotential: number;
  intimacyValue: number;
}

export interface EmotionalMeaningSeed {
  seed: string;
  label: string;
  description: string;
  examples: readonly string[];
  tags: readonly string[];
  relatedSeeds: readonly string[];
  oppositeSeeds: readonly string[];
  romanceHooks: readonly string[];
  scenarioHooks: readonly string[];
  dialoguePatterns: readonly string[];
  meaningType: EmotionalMeaningSeedType;
  expressedThrough: readonly string[];
  oftenMisreadAs: readonly string[];
  hiddenNeedMet: readonly string[];
  associatedWounds: readonly string[];
  associatedFears: readonly string[];
  associatedDesires: readonly string[];
  compatibleLoveLanguages: readonly string[];
  compatibleVisibleBehaviors: readonly string[];
  triggerWhenAbsent: readonly string[];
  likelyResponsesWhenAbsent: readonly string[];
  repairStyles: readonly string[];
  growthArcs: readonly string[];
  payoffFantasies: readonly string[];
  relationshipIdentities: readonly string[];
  routeGates: readonly string[];
  milestoneMemories: readonly string[];
  metadata: EmotionalMeaningSeedMetadata;
}

export interface EmotionalMeaningSeedInput {
  seed: string;
  label: string;
  description: string;
  examples?: readonly string[];
  tags?: readonly string[];
  relatedSeeds?: readonly string[];
  oppositeSeeds?: readonly string[];
  romanceHooks?: readonly string[];
  scenarioHooks?: readonly string[];
  dialoguePatterns?: readonly string[];
  meaningType: EmotionalMeaningSeedType;
  expressedThrough?: readonly string[];
  oftenMisreadAs?: readonly string[];
  hiddenNeedMet?: readonly string[];
  associatedWounds?: readonly string[];
  associatedFears?: readonly string[];
  associatedDesires?: readonly string[];
  compatibleLoveLanguages?: readonly string[];
  compatibleVisibleBehaviors?: readonly string[];
  triggerWhenAbsent?: readonly string[];
  likelyResponsesWhenAbsent?: readonly string[];
  repairStyles?: readonly string[];
  growthArcs?: readonly string[];
  payoffFantasies?: readonly string[];
  relationshipIdentities?: readonly string[];
  routeGates?: readonly string[];
  milestoneMemories?: readonly string[];
  metadata?: Partial<EmotionalMeaningSeedMetadata>;
}

export type RepairNeedSeedType =
  | "reassurance"
  | "accountability"
  | "behavior_change"
  | "truth"
  | "validation"
  | "presence"
  | "return"
  | "consistency"
  | "boundary"
  | "choice"
  | "dignity"
  | "loyalty"
  | "comfort"
  | "space"
  | "time"
  | "action"
  | "vulnerability"
  | "recommitment";

export type RepairNeedUrgency = "low" | "medium" | "high" | "critical";

export interface RepairNeedSeedMetadata {
  category: "repair_need";
  urgency: RepairNeedUrgency;
  repairPower: number;
  trustRepairValue: number;
  attachmentRepairValue: number;
  healingValue: number;
}

export interface RepairNeedSeed {
  seed: string;
  label: string;
  description: string;
  examples: readonly string[];
  tags: readonly string[];
  relatedSeeds: readonly string[];
  oppositeSeeds: readonly string[];
  romanceHooks: readonly string[];
  scenarioHooks: readonly string[];
  dialoguePatterns: readonly string[];
  needType: RepairNeedSeedType;
  repairsConsequences: readonly string[];
  repairsRuptures: readonly string[];
  activatedByWounds: readonly string[];
  activatedByFears: readonly string[];
  frustratedDesires: readonly string[];
  compatibleRepairStyles: readonly string[];
  compatibleRepairBeats: readonly string[];
  incompatibleRepairs: readonly string[];
  requiredConditions: readonly string[];
  fulfillmentSignals: readonly string[];
  failureModes: readonly string[];
  growthArcs: readonly string[];
  routeGates: readonly string[];
  milestoneMemories: readonly string[];
  metadata: RepairNeedSeedMetadata;
}

export interface RepairNeedSeedInput {
  seed: string;
  label: string;
  description: string;
  examples?: readonly string[];
  tags?: readonly string[];
  relatedSeeds?: readonly string[];
  oppositeSeeds?: readonly string[];
  romanceHooks?: readonly string[];
  scenarioHooks?: readonly string[];
  dialoguePatterns?: readonly string[];
  needType: RepairNeedSeedType;
  repairsConsequences?: readonly string[];
  repairsRuptures?: readonly string[];
  activatedByWounds?: readonly string[];
  activatedByFears?: readonly string[];
  frustratedDesires?: readonly string[];
  compatibleRepairStyles?: readonly string[];
  compatibleRepairBeats?: readonly string[];
  incompatibleRepairs?: readonly string[];
  requiredConditions?: readonly string[];
  fulfillmentSignals?: readonly string[];
  failureModes?: readonly string[];
  growthArcs?: readonly string[];
  routeGates?: readonly string[];
  milestoneMemories?: readonly string[];
  metadata?: Partial<RepairNeedSeedMetadata>;
}

export type RouteGateSeedType =
  | "opening"
  | "trust"
  | "boundary"
  | "reassurance"
  | "vulnerability"
  | "conflict"
  | "rupture"
  | "repair"
  | "choice"
  | "confession"
  | "commitment"
  | "integration"
  | "payoff";

export type RouteGateImportance = "minor" | "moderate" | "major" | "critical";

export interface RouteGateSeedMetadata {
  category: "route_gate";
  importance: RouteGateImportance;
  romanceValue: number;
  angstValue: number;
  healingValue: number;
  routeProgressValue: number;
}

export interface RouteGateSeed {
  seed: string;
  label: string;
  description: string;
  examples: readonly string[];
  tags: readonly string[];
  relatedSeeds: readonly string[];
  oppositeSeeds: readonly string[];
  romanceHooks: readonly string[];
  scenarioHooks: readonly string[];
  dialoguePatterns: readonly string[];
  gateType: RouteGateSeedType;
  unlocksRoutePhases: readonly string[];
  requiredBefore: readonly string[];
  blockedBy: readonly string[];
  activatedByWounds: readonly string[];
  activatedByFears: readonly string[];
  fulfillsDesires: readonly string[];
  satisfiesHiddenNeeds: readonly string[];
  likelyTriggers: readonly string[];
  likelyResponses: readonly string[];
  compatibleRepairBeats: readonly string[];
  compatibleGrowthArcs: readonly string[];
  successSignals: readonly string[];
  failureSignals: readonly string[];
  milestoneMemories: readonly string[];
  metadata: RouteGateSeedMetadata;
}

export interface RouteGateSeedInput {
  seed: string;
  label: string;
  description: string;
  examples?: readonly string[];
  tags?: readonly string[];
  relatedSeeds?: readonly string[];
  oppositeSeeds?: readonly string[];
  romanceHooks?: readonly string[];
  scenarioHooks?: readonly string[];
  dialoguePatterns?: readonly string[];
  gateType: RouteGateSeedType;
  unlocksRoutePhases?: readonly string[];
  requiredBefore?: readonly string[];
  blockedBy?: readonly string[];
  activatedByWounds?: readonly string[];
  activatedByFears?: readonly string[];
  fulfillsDesires?: readonly string[];
  satisfiesHiddenNeeds?: readonly string[];
  likelyTriggers?: readonly string[];
  likelyResponses?: readonly string[];
  compatibleRepairBeats?: readonly string[];
  compatibleGrowthArcs?: readonly string[];
  successSignals?: readonly string[];
  failureSignals?: readonly string[];
  milestoneMemories?: readonly string[];
  metadata?: Partial<RouteGateSeedMetadata>;
}

export type TriggerSeedType =
  | "attachment"
  | "rejection"
  | "betrayal"
  | "shame"
  | "control"
  | "safety"
  | "social"
  | "identity"
  | "romantic"
  | "sensory"
  | "moral"
  | "existential";

export type TriggerSeedIntensity =
  | "soft"
  | "moderate"
  | "strong"
  | "core"
  | "overwhelming";

export type TriggerSeedPacingPressure = "low" | "medium" | "high";

export interface TriggerSeedMetadata {
  category: "trigger";
  intensity: TriggerSeedIntensity;
  romanceValue: number;
  angstValue: number;
  conflictPotential: number;
  healingValue: number;
  pacingPressure: TriggerSeedPacingPressure;
}

export interface TriggerSeed {
  seed: string;
  label: string;
  description: string;
  examples: readonly string[];
  tags: readonly string[];
  relatedSeeds: readonly string[];
  oppositeSeeds: readonly string[];
  romanceHooks: readonly string[];
  scenarioHooks: readonly string[];
  dialoguePatterns: readonly string[];
  triggerType: TriggerSeedType;
  activatesWounds: readonly string[];
  activatesFears: readonly string[];
  activatesDesires: readonly string[];
  likelyResponses: readonly string[];
  emotionalMeaning: string;
  misreadAs: readonly string[];
  actualNeutralMeaning?: readonly string[];
  earlySigns: readonly string[];
  escalationPath: readonly string[];
  deescalationNeeds: readonly string[];
  repairMethods: readonly string[];
  growthArcs: readonly string[];
  routeGates: readonly string[];
  metadata: TriggerSeedMetadata;
}

export interface TriggerSeedInput {
  seed: string;
  label: string;
  description: string;
  examples?: readonly string[];
  tags?: readonly string[];
  relatedSeeds?: readonly string[];
  oppositeSeeds?: readonly string[];
  romanceHooks?: readonly string[];
  scenarioHooks?: readonly string[];
  dialoguePatterns?: readonly string[];
  triggerType: TriggerSeedType;
  activatesWounds?: readonly string[];
  activatesFears?: readonly string[];
  activatesDesires?: readonly string[];
  likelyResponses?: readonly string[];
  emotionalMeaning: string;
  misreadAs?: readonly string[];
  actualNeutralMeaning?: readonly string[];
  earlySigns?: readonly string[];
  escalationPath?: readonly string[];
  deescalationNeeds?: readonly string[];
  repairMethods?: readonly string[];
  growthArcs?: readonly string[];
  routeGates?: readonly string[];
  metadata?: Partial<TriggerSeedMetadata>;
}

export type RepairStyleSeedType =
  | "verbal"
  | "accountability"
  | "behavioral"
  | "reassurance"
  | "presence"
  | "space_based"
  | "physical_comfort"
  | "acts_of_service"
  | "ritual"
  | "vulnerability"
  | "collaborative"
  | "devotional"
  | "attachment"
  | "shame"
  | "betrayal"
  | "identity"
  | "romantic"
  | "domestic"
  | "protective"
  | "healing"
  | "meta";

export type RepairStyleSeedReliability = "low" | "medium" | "high";

export type RepairStyleSeedPacingPressure = "low" | "medium" | "high";

export interface RepairStyleSeedMetadata {
  category: "repair_style";
  reliability: RepairStyleSeedReliability;
  romanceValue: number;
  angstValue: number;
  conflictResolutionValue: number;
  healingValue: number;
  pacingPressure: RepairStyleSeedPacingPressure;
}

export interface RepairStyleSeed {
  seed: string;
  label: string;
  description: string;
  examples: readonly string[];
  tags: readonly string[];
  relatedSeeds: readonly string[];
  oppositeSeeds: readonly string[];
  romanceHooks: readonly string[];
  scenarioHooks: readonly string[];
  dialoguePatterns: readonly string[];
  repairType: RepairStyleSeedType;
  repairsBestFor: readonly string[];
  weakForRuptures: readonly string[];
  coreRepairMessage: string;
  emotionalNeedMet: string;
  failureMode: string;
  requiredConditions: readonly string[];
  repairActions: readonly string[];
  timingNeeds: readonly string[];
  conflictEffects: readonly string[];
  attachmentEffects: readonly string[];
  intimacyEffects: readonly string[];
  misreadByOthersAs: readonly string[];
  compatibleWounds: readonly string[];
  compatibleFears: readonly string[];
  compatibleConflictStyles: readonly string[];
  incompatibleDynamics: readonly string[];
  routeGates: readonly string[];
  growthArcs: readonly string[];
  metadata: RepairStyleSeedMetadata;
}

export interface RepairStyleSeedInput {
  seed: string;
  label: string;
  description: string;
  examples?: readonly string[];
  tags?: readonly string[];
  relatedSeeds?: readonly string[];
  oppositeSeeds?: readonly string[];
  romanceHooks?: readonly string[];
  scenarioHooks?: readonly string[];
  dialoguePatterns?: readonly string[];
  repairType: RepairStyleSeedType;
  repairsBestFor?: readonly string[];
  weakForRuptures?: readonly string[];
  coreRepairMessage: string;
  emotionalNeedMet: string;
  failureMode: string;
  requiredConditions?: readonly string[];
  repairActions?: readonly string[];
  timingNeeds?: readonly string[];
  conflictEffects?: readonly string[];
  attachmentEffects?: readonly string[];
  intimacyEffects?: readonly string[];
  misreadByOthersAs?: readonly string[];
  compatibleWounds?: readonly string[];
  compatibleFears?: readonly string[];
  compatibleConflictStyles?: readonly string[];
  incompatibleDynamics?: readonly string[];
  routeGates?: readonly string[];
  growthArcs?: readonly string[];
  metadata?: Partial<RepairStyleSeedMetadata>;
}

export type ResponseSeedType =
  | "fight"
  | "flight"
  | "freeze"
  | "fawn"
  | "shutdown"
  | "masking"
  | "caretaking"
  | "control"
  | "humor"
  | "intellectualizing"
  | "reassurance_seeking"
  | "avoidance"
  | "repair"
  | "vulnerability"
  | "protective";

export type ResponseSeedIntensity =
  | "soft"
  | "moderate"
  | "strong"
  | "core"
  | "overwhelming";

export type ResponseSeedPacingPressure = "low" | "medium" | "high";

export interface ResponseSeedMetadata {
  category: "response";
  intensity: ResponseSeedIntensity;
  romanceValue: number;
  angstValue: number;
  conflictPotential: number;
  healingValue: number;
  pacingPressure: ResponseSeedPacingPressure;
}

export interface ResponseSeed {
  seed: string;
  label: string;
  description: string;
  examples: readonly string[];
  tags: readonly string[];
  relatedSeeds: readonly string[];
  oppositeSeeds: readonly string[];
  romanceHooks: readonly string[];
  scenarioHooks: readonly string[];
  dialoguePatterns: readonly string[];
  responseType: ResponseSeedType;
  coreImpulse: string;
  hiddenFear: string;
  hiddenNeed: string;
  activators: readonly string[];
  earlySignals: readonly string[];
  escalationPattern: readonly string[];
  outwardBehaviors: readonly string[];
  internalExperience: readonly string[];
  bodyLanguage: readonly string[];
  attachmentEffects: readonly string[];
  intimacyEffects: readonly string[];
  conflictEffects: readonly string[];
  misreadByOthersAs: readonly string[];
  reassuranceNeeds: readonly string[];
  repairMethods: readonly string[];
  growthArcs: readonly string[];
  routeGates: readonly string[];
  compatibleWounds: readonly string[];
  compatibleFears: readonly string[];
  compatibleDesires: readonly string[];
  metadata: ResponseSeedMetadata;
}

export interface ResponseSeedInput {
  seed: string;
  label: string;
  description: string;
  examples?: readonly string[];
  tags?: readonly string[];
  relatedSeeds?: readonly string[];
  oppositeSeeds?: readonly string[];
  romanceHooks?: readonly string[];
  scenarioHooks?: readonly string[];
  dialoguePatterns?: readonly string[];
  responseType: ResponseSeedType;
  coreImpulse: string;
  hiddenFear: string;
  hiddenNeed: string;
  activators?: readonly string[];
  earlySignals?: readonly string[];
  escalationPattern?: readonly string[];
  outwardBehaviors?: readonly string[];
  internalExperience?: readonly string[];
  bodyLanguage?: readonly string[];
  attachmentEffects?: readonly string[];
  intimacyEffects?: readonly string[];
  conflictEffects?: readonly string[];
  misreadByOthersAs?: readonly string[];
  reassuranceNeeds?: readonly string[];
  repairMethods?: readonly string[];
  growthArcs?: readonly string[];
  routeGates?: readonly string[];
  compatibleWounds?: readonly string[];
  compatibleFears?: readonly string[];
  compatibleDesires?: readonly string[];
  metadata?: Partial<ResponseSeedMetadata>;
}

export type ActsOfServiceSeedType =
  | "domestic"
  | "protective"
  | "caretaking"
  | "practical"
  | "ritual"
  | "repair"
  | "devotional"
  | "emergency"
  | "administrative";

export interface ActsOfServiceSeedMetadata {
  category: "acts_of_service";
  romanceValue: number;
  intimacyValue: number;
  healingValue: number;
  conflictPotential: number;
}

export interface ActsOfServiceSeed {
  seed: string;
  label: string;
  description: string;
  examples: readonly string[];
  tags: readonly string[];
  relatedSeeds: readonly string[];
  oppositeSeeds: readonly string[];
  romanceHooks: readonly string[];
  scenarioHooks: readonly string[];
  dialoguePatterns: readonly string[];
  serviceType: ActsOfServiceSeedType;
  emotionalMeaning: string;
  hiddenMotivation: string;
  fantasyFulfillment: string;
  activatedBy: readonly string[];
  associatedWounds: readonly string[];
  associatedFears: readonly string[];
  associatedDesires: readonly string[];
  visibleBehaviors: readonly string[];
  escalationPath: readonly string[];
  relationshipEffects: readonly string[];
  conflictEffects: readonly string[];
  intimacyEffects: readonly string[];
  canBecomeUnhealthyAs: readonly string[];
  healingVersion: string;
  routeGates: readonly string[];
  growthArcs: readonly string[];
  metadata: ActsOfServiceSeedMetadata;
}

export interface ActsOfServiceSeedInput {
  seed: string;
  label: string;
  description: string;
  examples?: readonly string[];
  tags?: readonly string[];
  relatedSeeds?: readonly string[];
  oppositeSeeds?: readonly string[];
  romanceHooks?: readonly string[];
  scenarioHooks?: readonly string[];
  dialoguePatterns?: readonly string[];
  serviceType: ActsOfServiceSeedType;
  emotionalMeaning: string;
  hiddenMotivation: string;
  fantasyFulfillment: string;
  activatedBy?: readonly string[];
  associatedWounds?: readonly string[];
  associatedFears?: readonly string[];
  associatedDesires?: readonly string[];
  visibleBehaviors?: readonly string[];
  escalationPath?: readonly string[];
  relationshipEffects?: readonly string[];
  conflictEffects?: readonly string[];
  intimacyEffects?: readonly string[];
  canBecomeUnhealthyAs?: readonly string[];
  healingVersion: string;
  routeGates?: readonly string[];
  growthArcs?: readonly string[];
  metadata?: Partial<ActsOfServiceSeedMetadata>;
}

export type RelationshipDynamicSeedType =
  | "attachment"
  | "power"
  | "personality"
  | "caretaking"
  | "protective"
  | "healing"
  | "conflict"
  | "obsessive"
  | "domestic"
  | "identity";

export type RelationshipDynamicSeedIntensity = "low" | "medium" | "high";

export interface RelationshipDynamicSeedMetadata {
  category: "relationship_dynamic";
  chemistryValue: number;
  conflictPotential: number;
  healingPotential: number;
  intensity: RelationshipDynamicSeedIntensity;
}

export interface RelationshipDynamicSeed {
  seed: string;
  label: string;
  description: string;
  examples: readonly string[];
  tags: readonly string[];
  relatedSeeds: readonly string[];
  oppositeSeeds: readonly string[];
  romanceHooks: readonly string[];
  scenarioHooks: readonly string[];
  dialoguePatterns: readonly string[];
  dynamicType: RelationshipDynamicSeedType;
  emotionalCore: string;
  primaryNeeds: readonly string[];
  primaryFears: readonly string[];
  typicalTriggers: readonly string[];
  commonResponses: readonly string[];
  conflictPatterns: readonly string[];
  repairPatterns: readonly string[];
  associatedWounds: readonly string[];
  associatedFears: readonly string[];
  associatedDesires: readonly string[];
  evolutionPath: readonly string[];
  unhealthyVersion: readonly string[];
  healthyVersion: readonly string[];
  routeGates: readonly string[];
  metadata: RelationshipDynamicSeedMetadata;
}

export interface RelationshipDynamicSeedInput {
  seed: string;
  label: string;
  description: string;
  examples?: readonly string[];
  tags?: readonly string[];
  relatedSeeds?: readonly string[];
  oppositeSeeds?: readonly string[];
  romanceHooks?: readonly string[];
  scenarioHooks?: readonly string[];
  dialoguePatterns?: readonly string[];
  dynamicType: RelationshipDynamicSeedType;
  emotionalCore: string;
  primaryNeeds?: readonly string[];
  primaryFears?: readonly string[];
  typicalTriggers?: readonly string[];
  commonResponses?: readonly string[];
  conflictPatterns?: readonly string[];
  repairPatterns?: readonly string[];
  associatedWounds?: readonly string[];
  associatedFears?: readonly string[];
  associatedDesires?: readonly string[];
  evolutionPath?: readonly string[];
  unhealthyVersion?: readonly string[];
  healthyVersion?: readonly string[];
  routeGates?: readonly string[];
  metadata?: Partial<RelationshipDynamicSeedMetadata>;
}

export type RomanceTropeSeedType =
  | "conflict_based"
  | "intimacy_based"
  | "circumstance_based"
  | "forbidden"
  | "healing"
  | "obsessive"
  | "destiny"
  | "domestic"
  | "power_dynamic"
  | "second_chance";

export type RomanceTropeSeedIntensity = "soft" | "medium" | "high" | "extreme";
export type RomanceTropeBurnSpeed = "fast" | "medium" | "slow" | "variable";

export interface RomanceTropeSeedMetadata {
  category: "romance_trope";
  intensity: RomanceTropeSeedIntensity;
  burnSpeed: RomanceTropeBurnSpeed;
  angstValue: number;
  comfortValue: number;
  chemistryValue: number;
  conflictPotential: number;
  healingPotential: number;
}

export interface RomanceTropeSeed {
  seed: string;
  label: string;
  description: string;
  examples: readonly string[];
  tags: readonly string[];
  relatedSeeds: readonly string[];
  oppositeSeeds: readonly string[];
  romanceHooks: readonly string[];
  scenarioHooks: readonly string[];
  dialoguePatterns: readonly string[];
  tropeType: RomanceTropeSeedType;
  emotionalCore: string;
  payoffFantasy: string;
  startingConditions: readonly string[];
  emotionalBarriers: readonly string[];
  commonTriggers: readonly string[];
  commonResponses: readonly string[];
  associatedWounds: readonly string[];
  associatedFears: readonly string[];
  associatedDesires: readonly string[];
  relationshipDynamics: readonly string[];
  routePhases: readonly string[];
  conflictBeats: readonly string[];
  repairBeats: readonly string[];
  intimacyGates: readonly string[];
  healthyVersion: readonly string[];
  unhealthyVersion: readonly string[];
  antiPatterns: readonly string[];
  compatibleSettings: readonly string[];
  compatibleOpeners: readonly string[];
  metadata: RomanceTropeSeedMetadata;
}

export interface RomanceTropeSeedInput {
  seed: string;
  label: string;
  description: string;
  examples?: readonly string[];
  tags?: readonly string[];
  relatedSeeds?: readonly string[];
  oppositeSeeds?: readonly string[];
  romanceHooks?: readonly string[];
  scenarioHooks?: readonly string[];
  dialoguePatterns?: readonly string[];
  tropeType: RomanceTropeSeedType;
  emotionalCore: string;
  payoffFantasy: string;
  startingConditions?: readonly string[];
  emotionalBarriers?: readonly string[];
  commonTriggers?: readonly string[];
  commonResponses?: readonly string[];
  associatedWounds?: readonly string[];
  associatedFears?: readonly string[];
  associatedDesires?: readonly string[];
  relationshipDynamics?: readonly string[];
  routePhases?: readonly string[];
  conflictBeats?: readonly string[];
  repairBeats?: readonly string[];
  intimacyGates?: readonly string[];
  healthyVersion?: readonly string[];
  unhealthyVersion?: readonly string[];
  antiPatterns?: readonly string[];
  compatibleSettings?: readonly string[];
  compatibleOpeners?: readonly string[];
  metadata?: Partial<RomanceTropeSeedMetadata>;
}

export type RoutePhaseSeedType =
  | "opening"
  | "spark"
  | "contact"
  | "trust"
  | "vulnerability"
  | "reframing"
  | "investment"
  | "crisis"
  | "confession"
  | "integration"
  | "repair"
  | "aftermath";

export type RoutePhaseSeedIntensity = "low" | "medium" | "high" | "peak";
export type RoutePhaseBurnPressure = "low" | "medium" | "high";

export interface RoutePhaseSeedMetadata {
  category: "route_phase";
  order: number;
  intensity: RoutePhaseSeedIntensity;
  burnPressure: RoutePhaseBurnPressure;
  angstValue: number;
  comfortValue: number;
  chemistryValue: number;
  healingValue: number;
}

export interface RoutePhaseSeed {
  seed: string;
  label: string;
  description: string;
  examples: readonly string[];
  tags: readonly string[];
  relatedSeeds: readonly string[];
  oppositeSeeds: readonly string[];
  romanceHooks: readonly string[];
  scenarioHooks: readonly string[];
  dialoguePatterns: readonly string[];
  phaseType: RoutePhaseSeedType;
  emotionalFunction: string;
  phaseQuestion: string;
  readinessSignals: readonly string[];
  blockingForces: readonly string[];
  activatesWounds: readonly string[];
  activatesFears: readonly string[];
  activatesDesires: readonly string[];
  likelyTriggers: readonly string[];
  likelyResponses: readonly string[];
  relationshipDynamics: readonly string[];
  compatibleTropes: readonly string[];
  conflictBeats: readonly string[];
  repairBeats: readonly string[];
  entryConditions: readonly string[];
  exitConditions: readonly string[];
  routeGates: readonly string[];
  milestoneMemories: readonly string[];
  healthyVersion: readonly string[];
  unhealthyVersion: readonly string[];
  growthArcs: readonly string[];
  metadata: RoutePhaseSeedMetadata;
}

export interface RoutePhaseSeedInput {
  seed: string;
  label: string;
  description: string;
  examples?: readonly string[];
  tags?: readonly string[];
  relatedSeeds?: readonly string[];
  oppositeSeeds?: readonly string[];
  romanceHooks?: readonly string[];
  scenarioHooks?: readonly string[];
  dialoguePatterns?: readonly string[];
  phaseType: RoutePhaseSeedType;
  emotionalFunction: string;
  phaseQuestion: string;
  readinessSignals?: readonly string[];
  blockingForces?: readonly string[];
  activatesWounds?: readonly string[];
  activatesFears?: readonly string[];
  activatesDesires?: readonly string[];
  likelyTriggers?: readonly string[];
  likelyResponses?: readonly string[];
  relationshipDynamics?: readonly string[];
  compatibleTropes?: readonly string[];
  conflictBeats?: readonly string[];
  repairBeats?: readonly string[];
  entryConditions?: readonly string[];
  exitConditions?: readonly string[];
  routeGates?: readonly string[];
  milestoneMemories?: readonly string[];
  healthyVersion?: readonly string[];
  unhealthyVersion?: readonly string[];
  growthArcs?: readonly string[];
  metadata?: Partial<RoutePhaseSeedMetadata>;
}

export type PayoffFantasySeedType =
  | "chosen"
  | "safety"
  | "belonging"
  | "healing"
  | "devotion"
  | "freedom"
  | "trust"
  | "recognition"
  | "protection"
  | "partnership"
  | "domestic"
  | "redemption"
  | "victory";

export type PayoffFantasySeedIntensity =
  | "soft"
  | "medium"
  | "high"
  | "transformational";

export interface PayoffFantasySeedMetadata {
  category: "payoff_fantasy";
  intensity: PayoffFantasySeedIntensity;
  comfortValue: number;
  romanceValue: number;
  healingValue: number;
  catharsisValue: number;
}

export interface PayoffFantasySeed {
  seed: string;
  label: string;
  description: string;
  examples: readonly string[];
  tags: readonly string[];
  relatedSeeds: readonly string[];
  oppositeSeeds: readonly string[];
  romanceHooks: readonly string[];
  scenarioHooks: readonly string[];
  dialoguePatterns: readonly string[];
  payoffType: PayoffFantasySeedType;
  fulfillsDesires: readonly string[];
  resolvesFears: readonly string[];
  healsWounds: readonly string[];
  compatibleTropes: readonly string[];
  compatibleDynamics: readonly string[];
  compatibleGrowthArcs: readonly string[];
  requiredRoutePhases: readonly string[];
  payoffScenes: readonly string[];
  emotionalProofs: readonly string[];
  endingFlavors: readonly string[];
  antiPatterns: readonly string[];
  routeGates: readonly string[];
  milestoneMemories: readonly string[];
  metadata: PayoffFantasySeedMetadata;
}

export interface PayoffFantasySeedInput {
  seed: string;
  label: string;
  description: string;
  examples?: readonly string[];
  tags?: readonly string[];
  relatedSeeds?: readonly string[];
  oppositeSeeds?: readonly string[];
  romanceHooks?: readonly string[];
  scenarioHooks?: readonly string[];
  dialoguePatterns?: readonly string[];
  payoffType: PayoffFantasySeedType;
  fulfillsDesires?: readonly string[];
  resolvesFears?: readonly string[];
  healsWounds?: readonly string[];
  compatibleTropes?: readonly string[];
  compatibleDynamics?: readonly string[];
  compatibleGrowthArcs?: readonly string[];
  requiredRoutePhases?: readonly string[];
  payoffScenes?: readonly string[];
  emotionalProofs?: readonly string[];
  endingFlavors?: readonly string[];
  antiPatterns?: readonly string[];
  routeGates?: readonly string[];
  milestoneMemories?: readonly string[];
  metadata?: Partial<PayoffFantasySeedMetadata>;
}

export type RelationshipIdentitySeedType =
  | "safety"
  | "home"
  | "belonging"
  | "partnership"
  | "devotion"
  | "freedom"
  | "healing"
  | "trust"
  | "second_chance"
  | "domestic"
  | "adventure"
  | "power"
  | "quiet_love"
  | "public_choice"
  | "earned_ending";

export type RelationshipIdentityEndingStrength =
  | "soft"
  | "solid"
  | "epic"
  | "transformational";

export interface RelationshipIdentitySeedMetadata {
  category: "relationship_identity";
  stabilityValue: number;
  romanceValue: number;
  healingValue: number;
  conflictPotential: number;
  endingStrength: RelationshipIdentityEndingStrength;
}

export interface RelationshipIdentitySeed {
  seed: string;
  label: string;
  description: string;
  examples: readonly string[];
  tags: readonly string[];
  relatedSeeds: readonly string[];
  oppositeSeeds: readonly string[];
  romanceHooks: readonly string[];
  scenarioHooks: readonly string[];
  dialoguePatterns: readonly string[];
  identityType: RelationshipIdentitySeedType;
  fulfillsDesires: readonly string[];
  resolvesFears: readonly string[];
  healsWounds: readonly string[];
  compatibleDynamics: readonly string[];
  compatibleTropes: readonly string[];
  compatiblePayoffFantasies: readonly string[];
  requiredGrowthArcs: readonly string[];
  relationshipRules: readonly string[];
  emotionalProofs: readonly string[];
  dailyExpressions: readonly string[];
  conflictRisks: readonly string[];
  repairNeeds: readonly string[];
  routeGates: readonly string[];
  milestoneMemories: readonly string[];
  metadata: RelationshipIdentitySeedMetadata;
}

export interface RelationshipIdentitySeedInput {
  seed: string;
  label: string;
  description: string;
  examples?: readonly string[];
  tags?: readonly string[];
  relatedSeeds?: readonly string[];
  oppositeSeeds?: readonly string[];
  romanceHooks?: readonly string[];
  scenarioHooks?: readonly string[];
  dialoguePatterns?: readonly string[];
  identityType: RelationshipIdentitySeedType;
  fulfillsDesires?: readonly string[];
  resolvesFears?: readonly string[];
  healsWounds?: readonly string[];
  compatibleDynamics?: readonly string[];
  compatibleTropes?: readonly string[];
  compatiblePayoffFantasies?: readonly string[];
  requiredGrowthArcs?: readonly string[];
  relationshipRules?: readonly string[];
  emotionalProofs?: readonly string[];
  dailyExpressions?: readonly string[];
  conflictRisks?: readonly string[];
  repairNeeds?: readonly string[];
  routeGates?: readonly string[];
  milestoneMemories?: readonly string[];
  metadata?: Partial<RelationshipIdentitySeedMetadata>;
}

export type AttachmentStyleSeedType =
  | "secure"
  | "anxious"
  | "avoidant"
  | "fearful_avoidant"
  | "disorganized"
  | "earned_secure"
  | "caretaker"
  | "devotional"
  | "protective"
  | "healing";

export type AttachmentStyleSecurityLevel = "low" | "medium" | "high" | "earned";

export interface AttachmentStyleSeedMetadata {
  category: "attachment_style";
  securityLevel: AttachmentStyleSecurityLevel;
  romanceValue: number;
  angstValue: number;
  conflictPotential: number;
  healingValue: number;
}

export interface AttachmentStyleSeed {
  seed: string;
  label: string;
  description: string;
  examples: readonly string[];
  tags: readonly string[];
  relatedSeeds: readonly string[];
  oppositeSeeds: readonly string[];
  romanceHooks: readonly string[];
  scenarioHooks: readonly string[];
  dialoguePatterns: readonly string[];
  attachmentType: AttachmentStyleSeedType;
  coreBelief: string;
  coreFear: string;
  coreDesire: string;
  associatedWounds: readonly string[];
  associatedFears: readonly string[];
  associatedDesires: readonly string[];
  commonTriggers: readonly string[];
  commonResponses: readonly string[];
  intimacyPattern: readonly string[];
  conflictPattern: readonly string[];
  repairNeeds: readonly string[];
  compatibleRepairStyles: readonly string[];
  healthyVersion: readonly string[];
  unhealthyVersion: readonly string[];
  growthArcs: readonly string[];
  routeGates: readonly string[];
  metadata: AttachmentStyleSeedMetadata;
}

export interface AttachmentStyleSeedInput {
  seed: string;
  label: string;
  description: string;
  examples?: readonly string[];
  tags?: readonly string[];
  relatedSeeds?: readonly string[];
  oppositeSeeds?: readonly string[];
  romanceHooks?: readonly string[];
  scenarioHooks?: readonly string[];
  dialoguePatterns?: readonly string[];
  attachmentType: AttachmentStyleSeedType;
  coreBelief: string;
  coreFear: string;
  coreDesire: string;
  associatedWounds?: readonly string[];
  associatedFears?: readonly string[];
  associatedDesires?: readonly string[];
  commonTriggers?: readonly string[];
  commonResponses?: readonly string[];
  intimacyPattern?: readonly string[];
  conflictPattern?: readonly string[];
  repairNeeds?: readonly string[];
  compatibleRepairStyles?: readonly string[];
  healthyVersion?: readonly string[];
  unhealthyVersion?: readonly string[];
  growthArcs?: readonly string[];
  routeGates?: readonly string[];
  metadata?: Partial<AttachmentStyleSeedMetadata>;
}

export type LoveLanguageSeedType =
  | "words"
  | "service"
  | "gifts"
  | "time"
  | "touch"
  | "presence"
  | "protection"
  | "loyalty"
  | "ritual"
  | "banter"
  | "intellectual"
  | "creative"
  | "domestic"
  | "practical"
  | "reassurance"
  | "vulnerability"
  | "silence";

export type LoveLanguagePacingPressure = "low" | "medium" | "high";

export interface LoveLanguageSeedMetadata {
  category: "love_language";
  romanceValue: number;
  intimacyValue: number;
  healingValue: number;
  conflictPotential: number;
  pacingPressure: LoveLanguagePacingPressure;
}

export interface LoveLanguageSeed {
  seed: string;
  label: string;
  description: string;
  examples: readonly string[];
  tags: readonly string[];
  relatedSeeds: readonly string[];
  oppositeSeeds: readonly string[];
  romanceHooks: readonly string[];
  scenarioHooks: readonly string[];
  dialoguePatterns: readonly string[];
  loveLanguageType: LoveLanguageSeedType;
  emotionalMeaning: string;
  hiddenNeed: string;
  commonMisread: string;
  associatedWounds: readonly string[];
  associatedFears: readonly string[];
  associatedDesires: readonly string[];
  compatibleAttachmentStyles: readonly string[];
  compatibleDynamics: readonly string[];
  visibleBehaviors: readonly string[];
  fulfillmentSignals: readonly string[];
  deprivationSignals: readonly string[];
  conflictRisks: readonly string[];
  repairStyles: readonly string[];
  growthArcs: readonly string[];
  routeGates: readonly string[];
  metadata: LoveLanguageSeedMetadata;
}

export interface LoveLanguageSeedInput {
  seed: string;
  label: string;
  description: string;
  examples?: readonly string[];
  tags?: readonly string[];
  relatedSeeds?: readonly string[];
  oppositeSeeds?: readonly string[];
  romanceHooks?: readonly string[];
  scenarioHooks?: readonly string[];
  dialoguePatterns?: readonly string[];
  loveLanguageType: LoveLanguageSeedType;
  emotionalMeaning: string;
  hiddenNeed: string;
  commonMisread: string;
  associatedWounds?: readonly string[];
  associatedFears?: readonly string[];
  associatedDesires?: readonly string[];
  compatibleAttachmentStyles?: readonly string[];
  compatibleDynamics?: readonly string[];
  visibleBehaviors?: readonly string[];
  fulfillmentSignals?: readonly string[];
  deprivationSignals?: readonly string[];
  conflictRisks?: readonly string[];
  repairStyles?: readonly string[];
  growthArcs?: readonly string[];
  routeGates?: readonly string[];
  metadata?: Partial<LoveLanguageSeedMetadata>;
}

export type VisibleBehaviorSeedType =
  | "domestic"
  | "protective"
  | "caretaking"
  | "practical"
  | "ritual"
  | "reassurance"
  | "devotional"
  | "attention"
  | "touch"
  | "communication"
  | "repair"
  | "public_loyalty";

export type VisibleBehaviorSubtlety = "low" | "medium" | "high";
export type VisibleBehaviorRepeatability = "one_off" | "recurring" | "ritual";

export interface VisibleBehaviorSeedMetadata {
  category: "visible_behavior";
  subtlety: VisibleBehaviorSubtlety;
  romanceValue: number;
  intimacyValue: number;
  healingValue: number;
  conflictPotential: number;
  repeatability: VisibleBehaviorRepeatability;
}

export interface VisibleBehaviorSeed {
  seed: string;
  label: string;
  description: string;
  examples: readonly string[];
  tags: readonly string[];
  relatedSeeds: readonly string[];
  oppositeSeeds: readonly string[];
  romanceHooks: readonly string[];
  scenarioHooks: readonly string[];
  dialoguePatterns: readonly string[];
  behaviorType: VisibleBehaviorSeedType;
  emotionalMeaning: string;
  hiddenMotivation: string;
  loveLanguageSource: readonly string[];
  associatedWounds: readonly string[];
  associatedFears: readonly string[];
  associatedDesires: readonly string[];
  associatedDynamics: readonly string[];
  activatedBy: readonly string[];
  fulfillmentSignals: readonly string[];
  misreadRisks: readonly string[];
  conflictRisks: readonly string[];
  repairStyles: readonly string[];
  growthArcs: readonly string[];
  routeGates: readonly string[];
  milestoneMemories: readonly string[];
  metadata: VisibleBehaviorSeedMetadata;
}

export interface VisibleBehaviorSeedInput {
  seed: string;
  label: string;
  description: string;
  examples?: readonly string[];
  tags?: readonly string[];
  relatedSeeds?: readonly string[];
  oppositeSeeds?: readonly string[];
  romanceHooks?: readonly string[];
  scenarioHooks?: readonly string[];
  dialoguePatterns?: readonly string[];
  behaviorType: VisibleBehaviorSeedType;
  emotionalMeaning: string;
  hiddenMotivation: string;
  loveLanguageSource?: readonly string[];
  associatedWounds?: readonly string[];
  associatedFears?: readonly string[];
  associatedDesires?: readonly string[];
  associatedDynamics?: readonly string[];
  activatedBy?: readonly string[];
  fulfillmentSignals?: readonly string[];
  misreadRisks?: readonly string[];
  conflictRisks?: readonly string[];
  repairStyles?: readonly string[];
  growthArcs?: readonly string[];
  routeGates?: readonly string[];
  milestoneMemories?: readonly string[];
  metadata?: Partial<VisibleBehaviorSeedMetadata>;
}

export type GrowthArcSeedType =
  | "trust"
  | "attachment"
  | "self_worth"
  | "vulnerability"
  | "care"
  | "rest"
  | "belonging"
  | "boundaries"
  | "autonomy"
  | "repair"
  | "forgiveness"
  | "love";

export type GrowthArcSeedIntensity =
  | "soft"
  | "medium"
  | "high"
  | "transformational";

export type GrowthArcPacingPressure = "low" | "medium" | "high";

export interface GrowthArcSeedMetadata {
  category: "growth_arc";
  intensity: GrowthArcSeedIntensity;
  healingValue: number;
  angstValue: number;
  romanceValue: number;
  pacingPressure: GrowthArcPacingPressure;
}

export interface GrowthArcSeed {
  seed: string;
  label: string;
  description: string;
  examples: readonly string[];
  tags: readonly string[];
  relatedSeeds: readonly string[];
  oppositeSeeds: readonly string[];
  romanceHooks: readonly string[];
  scenarioHooks: readonly string[];
  dialoguePatterns: readonly string[];
  arcType: GrowthArcSeedType;
  startingWounds: readonly string[];
  startingFears: readonly string[];
  coreDesires: readonly string[];
  commonTriggers: readonly string[];
  oldResponses: readonly string[];
  newResponses: readonly string[];
  requiredRepairBeats: readonly string[];
  milestoneMemories: readonly string[];
  routeGates: readonly string[];
  regressionRisks: readonly string[];
  healthyOutcome: readonly string[];
  relationshipEffects: readonly string[];
  metadata: GrowthArcSeedMetadata;
}

export interface GrowthArcSeedInput {
  seed: string;
  label: string;
  description: string;
  examples?: readonly string[];
  tags?: readonly string[];
  relatedSeeds?: readonly string[];
  oppositeSeeds?: readonly string[];
  romanceHooks?: readonly string[];
  scenarioHooks?: readonly string[];
  dialoguePatterns?: readonly string[];
  arcType: GrowthArcSeedType;
  startingWounds?: readonly string[];
  startingFears?: readonly string[];
  coreDesires?: readonly string[];
  commonTriggers?: readonly string[];
  oldResponses?: readonly string[];
  newResponses?: readonly string[];
  requiredRepairBeats?: readonly string[];
  milestoneMemories?: readonly string[];
  routeGates?: readonly string[];
  regressionRisks?: readonly string[];
  healthyOutcome?: readonly string[];
  relationshipEffects?: readonly string[];
  metadata?: Partial<GrowthArcSeedMetadata>;
}

export type RepairBeatSeedType =
  | "apology"
  | "clarification"
  | "validation"
  | "accountability"
  | "truth"
  | "behavior_change"
  | "return"
  | "boundary"
  | "comfort"
  | "dignity"
  | "loyalty"
  | "reassurance"
  | "touch"
  | "ritual"
  | "service"
  | "vulnerability"
  | "forgiveness"
  | "recommitment"
  | "symbolic"
  | "growth";

export type RepairBeatSeedIntensity = "low" | "medium" | "high" | "peak";
export type RepairBeatPacingPressure = "low" | "medium" | "high";

export interface RepairBeatSeedMetadata {
  category: "repair_beat";
  intensity: RepairBeatSeedIntensity;
  repairPower: number;
  trustRepairValue: number;
  attachmentRepairValue: number;
  healingValue: number;
  pacingPressure: RepairBeatPacingPressure;
}

export interface RepairBeatSeed {
  seed: string;
  label: string;
  description: string;
  examples: readonly string[];
  tags: readonly string[];
  relatedSeeds: readonly string[];
  oppositeSeeds: readonly string[];
  romanceHooks: readonly string[];
  scenarioHooks: readonly string[];
  dialoguePatterns: readonly string[];
  beatType: RepairBeatSeedType;
  emotionalFunction: string;
  repairQuestion: string;
  repairsConsequences: readonly string[];
  repairsRuptures: readonly string[];
  compatibleRepairStyles: readonly string[];
  requiredConditions: readonly string[];
  likelyResistance: readonly string[];
  failureModes: readonly string[];
  successSignals: readonly string[];
  relationshipEffects: readonly string[];
  milestoneMemories: readonly string[];
  growthPotential: readonly string[];
  metadata: RepairBeatSeedMetadata;
}

export interface RepairBeatSeedInput {
  seed: string;
  label: string;
  description: string;
  examples?: readonly string[];
  tags?: readonly string[];
  relatedSeeds?: readonly string[];
  oppositeSeeds?: readonly string[];
  romanceHooks?: readonly string[];
  scenarioHooks?: readonly string[];
  dialoguePatterns?: readonly string[];
  beatType: RepairBeatSeedType;
  emotionalFunction: string;
  repairQuestion: string;
  repairsConsequences?: readonly string[];
  repairsRuptures?: readonly string[];
  compatibleRepairStyles?: readonly string[];
  requiredConditions?: readonly string[];
  likelyResistance?: readonly string[];
  failureModes?: readonly string[];
  successSignals?: readonly string[];
  relationshipEffects?: readonly string[];
  milestoneMemories?: readonly string[];
  growthPotential?: readonly string[];
  metadata?: Partial<RepairBeatSeedMetadata>;
}

export type ConsequenceSeedType =
  | "trust_damage"
  | "attachment_damage"
  | "emotional_safety"
  | "vulnerability"
  | "withdrawal"
  | "hypervigilance"
  | "reassurance"
  | "avoidance"
  | "fear_reinforcement"
  | "resentment"
  | "distance"
  | "ritual_damage"
  | "identity_damage"
  | "public"
  | "boundary"
  | "jealousy"
  | "reliability"
  | "priority"
  | "self_worth"
  | "repair_readiness";

export type ConsequenceSeedSeverity = "minor" | "moderate" | "major" | "severe";
export type ConsequenceSeedPersistence =
  | "brief"
  | "scene_level"
  | "arc_level"
  | "long_term";

export interface ConsequenceSeedMetadata {
  category: "consequence";
  severity: ConsequenceSeedSeverity;
  persistence: ConsequenceSeedPersistence;
  angstValue: number;
  healingValue: number;
  repairDifficulty: number;
}

export interface ConsequenceSeed {
  seed: string;
  label: string;
  description: string;
  examples: readonly string[];
  tags: readonly string[];
  relatedSeeds: readonly string[];
  oppositeSeeds: readonly string[];
  romanceHooks: readonly string[];
  scenarioHooks: readonly string[];
  dialoguePatterns: readonly string[];
  consequenceType: ConsequenceSeedType;
  causedBy: readonly string[];
  affectsTrustLayers: readonly string[];
  likelyResponses: readonly string[];
  repairNeeds: readonly string[];
  compatibleRepairStyles: readonly string[];
  growthPotential: readonly string[];
  milestoneMemories: readonly string[];
  metadata: ConsequenceSeedMetadata;
}

export interface ConsequenceSeedInput {
  seed: string;
  label: string;
  description: string;
  examples?: readonly string[];
  tags?: readonly string[];
  relatedSeeds?: readonly string[];
  oppositeSeeds?: readonly string[];
  romanceHooks?: readonly string[];
  scenarioHooks?: readonly string[];
  dialoguePatterns?: readonly string[];
  consequenceType: ConsequenceSeedType;
  causedBy?: readonly string[];
  affectsTrustLayers?: readonly string[];
  likelyResponses?: readonly string[];
  repairNeeds?: readonly string[];
  compatibleRepairStyles?: readonly string[];
  growthPotential?: readonly string[];
  milestoneMemories?: readonly string[];
  metadata?: Partial<ConsequenceSeedMetadata>;
}

export type RuptureTypeSeedType =
  | "abandonment"
  | "betrayal"
  | "broken_promise"
  | "invalidation"
  | "humiliation"
  | "boundary"
  | "trust"
  | "attachment"
  | "identity"
  | "safety"
  | "exclusivity"
  | "neglect"
  | "public"
  | "separation";

export type RuptureSeverityBias =
  | "minor"
  | "moderate"
  | "major"
  | "identity_level";

export interface RuptureTypeSeedMetadata {
  category: "rupture_type";
  severityBias: RuptureSeverityBias;
  trustDamage: number;
  attachmentDamage: number;
  repairDifficulty: number;
  angstValue: number;
  healingValue: number;
}

export interface RuptureTypeSeed {
  seed: string;
  label: string;
  description: string;
  examples: readonly string[];
  tags: readonly string[];
  relatedSeeds: readonly string[];
  oppositeSeeds: readonly string[];
  romanceHooks: readonly string[];
  scenarioHooks: readonly string[];
  dialoguePatterns: readonly string[];
  ruptureType: RuptureTypeSeedType;
  emotionalDamage: string;
  damagedTrustLayer: readonly string[];
  activatesWounds: readonly string[];
  activatesFears: readonly string[];
  frustratesDesires: readonly string[];
  commonTriggers: readonly string[];
  commonResponses: readonly string[];
  compatibleConflictBeats: readonly string[];
  repairNeeds: readonly string[];
  compatibleRepairStyles: readonly string[];
  incompatibleRepairStyles: readonly string[];
  consequencePatterns: readonly string[];
  memoryEffects: readonly string[];
  growthPotential: readonly string[];
  routeGates: readonly string[];
  milestoneMemories: readonly string[];
  metadata: RuptureTypeSeedMetadata;
}

export interface RuptureTypeSeedInput {
  seed: string;
  label: string;
  description: string;
  examples?: readonly string[];
  tags?: readonly string[];
  relatedSeeds?: readonly string[];
  oppositeSeeds?: readonly string[];
  romanceHooks?: readonly string[];
  scenarioHooks?: readonly string[];
  dialoguePatterns?: readonly string[];
  ruptureType: RuptureTypeSeedType;
  emotionalDamage: string;
  damagedTrustLayer?: readonly string[];
  activatesWounds?: readonly string[];
  activatesFears?: readonly string[];
  frustratesDesires?: readonly string[];
  commonTriggers?: readonly string[];
  commonResponses?: readonly string[];
  compatibleConflictBeats?: readonly string[];
  repairNeeds?: readonly string[];
  compatibleRepairStyles?: readonly string[];
  incompatibleRepairStyles?: readonly string[];
  consequencePatterns?: readonly string[];
  memoryEffects?: readonly string[];
  growthPotential?: readonly string[];
  routeGates?: readonly string[];
  milestoneMemories?: readonly string[];
  metadata?: Partial<RuptureTypeSeedMetadata>;
}

export type ConflictBeatSeedType =
  | "misunderstanding"
  | "trust_test"
  | "jealousy"
  | "betrayal"
  | "withdrawal"
  | "argument"
  | "boundary"
  | "secret"
  | "choice"
  | "separation"
  | "public_pressure"
  | "near_loss"
  | "rupture";

export type ConflictBeatSeedIntensity = "low" | "medium" | "high" | "peak";
export type ConflictBeatPacingPressure = "low" | "medium" | "high";

export interface ConflictBeatSeedMetadata {
  category: "conflict_beat";
  intensity: ConflictBeatSeedIntensity;
  ruptureRisk: number;
  angstValue: number;
  chemistryValue: number;
  healingValue: number;
  pacingPressure: ConflictBeatPacingPressure;
}

export interface ConflictBeatSeed {
  seed: string;
  label: string;
  description: string;
  examples: readonly string[];
  tags: readonly string[];
  relatedSeeds: readonly string[];
  oppositeSeeds: readonly string[];
  romanceHooks: readonly string[];
  scenarioHooks: readonly string[];
  dialoguePatterns: readonly string[];
  beatType: ConflictBeatSeedType;
  emotionalFunction: string;
  hiddenQuestion: string;
  activatesWounds: readonly string[];
  activatesFears: readonly string[];
  activatesDesires: readonly string[];
  commonTriggers: readonly string[];
  likelyResponses: readonly string[];
  compatibleConflictStyles: readonly string[];
  compatibleRepairStyles: readonly string[];
  compatibleRoutePhases: readonly string[];
  compatibleTropes: readonly string[];
  escalationPath: readonly string[];
  ruptureRisks: readonly string[];
  repairNeeds: readonly string[];
  growthPotential: readonly string[];
  routeGates: readonly string[];
  milestoneMemories: readonly string[];
  metadata: ConflictBeatSeedMetadata;
}

export interface ConflictBeatSeedInput {
  seed: string;
  label: string;
  description: string;
  examples?: readonly string[];
  tags?: readonly string[];
  relatedSeeds?: readonly string[];
  oppositeSeeds?: readonly string[];
  romanceHooks?: readonly string[];
  scenarioHooks?: readonly string[];
  dialoguePatterns?: readonly string[];
  beatType: ConflictBeatSeedType;
  emotionalFunction: string;
  hiddenQuestion: string;
  activatesWounds?: readonly string[];
  activatesFears?: readonly string[];
  activatesDesires?: readonly string[];
  commonTriggers?: readonly string[];
  likelyResponses?: readonly string[];
  compatibleConflictStyles?: readonly string[];
  compatibleRepairStyles?: readonly string[];
  compatibleRoutePhases?: readonly string[];
  compatibleTropes?: readonly string[];
  escalationPath?: readonly string[];
  ruptureRisks?: readonly string[];
  repairNeeds?: readonly string[];
  growthPotential?: readonly string[];
  routeGates?: readonly string[];
  milestoneMemories?: readonly string[];
  metadata?: Partial<ConflictBeatSeedMetadata>;
}

export type ConflictStyleSeedType =
  | "pursuer"
  | "withdrawer"
  | "explosive"
  | "appeasing"
  | "intellectual"
  | "deflective"
  | "dominance"
  | "passive"
  | "avoidant"
  | "repair_oriented";

export type ConflictStyleSeedIntensity = "low" | "medium" | "high" | "volatile";

export interface ConflictStyleSeedMetadata {
  category: "conflict_style";
  intensity: ConflictStyleSeedIntensity;
  ruptureRisk: number;
  repairDifficulty: number;
  angstValue: number;
  romanceValue: number;
  healingPotential: number;
}

export interface ConflictStyleSeed {
  seed: string;
  label: string;
  description: string;
  examples: readonly string[];
  tags: readonly string[];
  relatedSeeds: readonly string[];
  oppositeSeeds: readonly string[];
  romanceHooks: readonly string[];
  scenarioHooks: readonly string[];
  dialoguePatterns: readonly string[];
  conflictType: ConflictStyleSeedType;
  emotionalCore: string;
  hiddenFear: string;
  hiddenNeed: string;
  commonTriggers: readonly string[];
  stressResponses: readonly string[];
  escalationPattern: readonly string[];
  attachmentEffects: readonly string[];
  intimacyEffects: readonly string[];
  ruptureRisks: readonly string[];
  likelyRepairStyles: readonly string[];
  incompatibleRepairStyles: readonly string[];
  associatedWounds: readonly string[];
  associatedFears: readonly string[];
  associatedDesires: readonly string[];
  associatedResponses: readonly string[];
  healthyVersion: readonly string[];
  unhealthyVersion: readonly string[];
  growthArcs: readonly string[];
  routeGates: readonly string[];
  metadata: ConflictStyleSeedMetadata;
}

export interface ConflictStyleSeedInput {
  seed: string;
  label: string;
  description: string;
  examples?: readonly string[];
  tags?: readonly string[];
  relatedSeeds?: readonly string[];
  oppositeSeeds?: readonly string[];
  romanceHooks?: readonly string[];
  scenarioHooks?: readonly string[];
  dialoguePatterns?: readonly string[];
  conflictType: ConflictStyleSeedType;
  emotionalCore: string;
  hiddenFear: string;
  hiddenNeed: string;
  commonTriggers?: readonly string[];
  stressResponses?: readonly string[];
  escalationPattern?: readonly string[];
  attachmentEffects?: readonly string[];
  intimacyEffects?: readonly string[];
  ruptureRisks?: readonly string[];
  likelyRepairStyles?: readonly string[];
  incompatibleRepairStyles?: readonly string[];
  associatedWounds?: readonly string[];
  associatedFears?: readonly string[];
  associatedDesires?: readonly string[];
  associatedResponses?: readonly string[];
  healthyVersion?: readonly string[];
  unhealthyVersion?: readonly string[];
  growthArcs?: readonly string[];
  routeGates?: readonly string[];
  metadata?: Partial<ConflictStyleSeedMetadata>;
}

export interface VocabularySeedPresetLike {
  id: string;
  category: string;
  label: string;
  value?: string;
  triggerKeys?: readonly string[];
  guidance: string;
  systemPromptTags?: readonly string[];
}

export function createVocabularySeedPreset(
  input: VocabularySeedPresetInput,
): VocabularySeedPreset {
  return {
    seed: input.seed,
    label: input.label,
    description: input.description,
    examples: uniqueText(input.examples ?? []),
    tags: uniqueText(input.tags ?? []),
    relatedSeeds: uniqueText(input.relatedSeeds ?? []),
    oppositeSeeds: uniqueText(input.oppositeSeeds ?? []),
    romanceHooks: uniqueText(input.romanceHooks ?? []),
    scenarioHooks: uniqueText(input.scenarioHooks ?? []),
    dialoguePatterns: uniqueText(input.dialoguePatterns ?? []),
    metadata: {
      rarity: input.metadata?.rarity ?? "common",
      romanceValue: clampScore(input.metadata?.romanceValue ?? 5),
      conflictPotential: clampScore(input.metadata?.conflictPotential ?? 5),
    },
  };
}

export function createWoundSeedPreset(input: WoundSeedInput): WoundSeed {
  const base = createVocabularySeedPreset({
    seed: input.seed,
    label: input.label,
    description: input.description,
    examples: input.examples,
    tags: input.tags,
    relatedSeeds: input.relatedSeeds,
    oppositeSeeds: input.oppositeSeeds,
    romanceHooks: input.romanceHooks,
    scenarioHooks: input.scenarioHooks,
    dialoguePatterns: input.dialoguePatterns,
    metadata: {
      romanceValue: input.metadata?.romanceValue,
      conflictPotential: input.metadata?.angstValue,
    },
  });

  return {
    ...base,
    triggers: uniqueText(input.triggers ?? []),
    defenseMechanisms: uniqueText(input.defenseMechanisms ?? []),
    attachmentEffects: uniqueText(input.attachmentEffects ?? []),
    healingNeeds: uniqueText(input.healingNeeds ?? []),
    repairMethods: uniqueText(input.repairMethods ?? []),
    growthArcs: uniqueText(input.growthArcs ?? []),
    metadata: {
      category: input.metadata?.category ?? "wounds",
      severity: input.metadata?.severity ?? "major",
      romanceValue: clampScore(input.metadata?.romanceValue ?? 7),
      angstValue: clampScore(input.metadata?.angstValue ?? 7),
      healingValue: clampScore(input.metadata?.healingValue ?? 7),
    },
  };
}

export function createFearSeedPreset(input: FearSeedInput): FearSeed {
  const base = createVocabularySeedPreset({
    seed: input.seed,
    label: input.label,
    description: input.description,
    examples: input.examples,
    tags: input.tags,
    relatedSeeds: input.relatedSeeds,
    oppositeSeeds: input.oppositeSeeds,
    romanceHooks: input.romanceHooks,
    scenarioHooks: input.scenarioHooks,
    dialoguePatterns: input.dialoguePatterns,
    metadata: {
      romanceValue: input.metadata?.romanceValue,
      conflictPotential: input.metadata?.conflictPotential,
    },
  });

  return {
    ...base,
    fearType: input.fearType,
    coreBelief: input.coreBelief,
    hiddenNeed: input.hiddenNeed,
    perceivedThreat: input.perceivedThreat,
    triggers: uniqueText(input.triggers ?? []),
    earlyWarnings: uniqueText(input.earlyWarnings ?? []),
    escalationPattern: uniqueText(input.escalationPattern ?? []),
    defenseMechanisms: uniqueText(input.defenseMechanisms ?? []),
    copingBehaviors: uniqueText(input.copingBehaviors ?? []),
    avoidancePatterns: uniqueText(input.avoidancePatterns ?? []),
    attachmentEffects: uniqueText(input.attachmentEffects ?? []),
    intimacyEffects: uniqueText(input.intimacyEffects ?? []),
    conflictEffects: uniqueText(input.conflictEffects ?? []),
    misreadSignals: uniqueText(input.misreadSignals ?? []),
    reassuranceNeeds: uniqueText(input.reassuranceNeeds ?? []),
    repairMethods: uniqueText(input.repairMethods ?? []),
    healingNeeds: uniqueText(input.healingNeeds ?? []),
    growthArcs: uniqueText(input.growthArcs ?? []),
    routeGates: uniqueText(input.routeGates ?? []),
    compatibleWounds: uniqueText(input.compatibleWounds ?? []),
    incompatibleDynamics: uniqueText(input.incompatibleDynamics ?? []),
    metadata: {
      category: "fear",
      severity: input.metadata?.severity ?? "moderate",
      romanceValue: clampScore(input.metadata?.romanceValue ?? 7),
      angstValue: clampScore(input.metadata?.angstValue ?? 7),
      conflictPotential: clampScore(input.metadata?.conflictPotential ?? 7),
      healingValue: clampScore(input.metadata?.healingValue ?? 7),
      pacingPressure: input.metadata?.pacingPressure ?? "medium",
    },
  };
}

export function createDesireSeedPreset(input: DesireSeedInput): DesireSeed {
  const base = createVocabularySeedPreset({
    seed: input.seed,
    label: input.label,
    description: input.description,
    examples: input.examples,
    tags: input.tags,
    relatedSeeds: input.relatedSeeds,
    oppositeSeeds: input.oppositeSeeds,
    romanceHooks: input.romanceHooks,
    scenarioHooks: input.scenarioHooks,
    dialoguePatterns: input.dialoguePatterns,
    metadata: {
      romanceValue: input.metadata?.romanceValue,
      conflictPotential: input.metadata?.conflictPotential,
    },
  });

  return {
    ...base,
    metadata: {
      category: input.metadata?.category ?? "romantic",
      intensity: input.metadata?.intensity ?? "moderate",
      romanceValue: clampScore(input.metadata?.romanceValue ?? 7),
      angstValue: clampScore(input.metadata?.angstValue ?? 6),
      conflictPotential: clampScore(input.metadata?.conflictPotential ?? 6),
      healingValue: clampScore(input.metadata?.healingValue ?? 7),
      pacingPressure: input.metadata?.pacingPressure ?? "medium",
    },
  };
}

export function createTriggerSeedPreset(input: TriggerSeedInput): TriggerSeed {
  const base = createVocabularySeedPreset({
    seed: input.seed,
    label: input.label,
    description: input.description,
    examples: input.examples,
    tags: input.tags,
    relatedSeeds: input.relatedSeeds,
    oppositeSeeds: input.oppositeSeeds,
    romanceHooks: input.romanceHooks,
    scenarioHooks: input.scenarioHooks,
    dialoguePatterns: input.dialoguePatterns,
    metadata: {
      romanceValue: input.metadata?.romanceValue,
      conflictPotential: input.metadata?.conflictPotential,
    },
  });

  const actualNeutralMeaning = uniqueText(input.actualNeutralMeaning ?? []);

  return {
    ...base,
    triggerType: input.triggerType,
    activatesWounds: uniqueText(input.activatesWounds ?? []),
    activatesFears: uniqueText(input.activatesFears ?? []),
    activatesDesires: uniqueText(input.activatesDesires ?? []),
    likelyResponses: uniqueText(input.likelyResponses ?? []),
    emotionalMeaning: input.emotionalMeaning,
    misreadAs: uniqueText(input.misreadAs ?? []),
    ...(actualNeutralMeaning.length > 0 ? { actualNeutralMeaning } : {}),
    earlySigns: uniqueText(input.earlySigns ?? []),
    escalationPath: uniqueText(input.escalationPath ?? []),
    deescalationNeeds: uniqueText(input.deescalationNeeds ?? []),
    repairMethods: uniqueText(input.repairMethods ?? []),
    growthArcs: uniqueText(input.growthArcs ?? []),
    routeGates: uniqueText(input.routeGates ?? []),
    metadata: {
      category: "trigger",
      intensity: input.metadata?.intensity ?? "moderate",
      romanceValue: clampScore(input.metadata?.romanceValue ?? 7),
      angstValue: clampScore(input.metadata?.angstValue ?? 7),
      conflictPotential: clampScore(input.metadata?.conflictPotential ?? 7),
      healingValue: clampScore(input.metadata?.healingValue ?? 7),
      pacingPressure: input.metadata?.pacingPressure ?? "medium",
    },
  };
}

export function createRepairStyleSeedPreset(
  input: RepairStyleSeedInput,
): RepairStyleSeed {
  const base = createVocabularySeedPreset({
    seed: input.seed,
    label: input.label,
    description: input.description,
    examples: input.examples,
    tags: input.tags,
    relatedSeeds: input.relatedSeeds,
    oppositeSeeds: input.oppositeSeeds,
    romanceHooks: input.romanceHooks,
    scenarioHooks: input.scenarioHooks,
    dialoguePatterns: input.dialoguePatterns,
    metadata: {
      romanceValue: input.metadata?.romanceValue,
      conflictPotential: input.metadata?.conflictResolutionValue,
    },
  });

  return {
    ...base,
    repairType: input.repairType,
    repairsBestFor: uniqueText(input.repairsBestFor ?? []),
    weakForRuptures: uniqueText(input.weakForRuptures ?? []),
    coreRepairMessage: input.coreRepairMessage,
    emotionalNeedMet: input.emotionalNeedMet,
    failureMode: input.failureMode,
    requiredConditions: uniqueText(input.requiredConditions ?? []),
    repairActions: uniqueText(input.repairActions ?? []),
    timingNeeds: uniqueText(input.timingNeeds ?? []),
    conflictEffects: uniqueText(input.conflictEffects ?? []),
    attachmentEffects: uniqueText(input.attachmentEffects ?? []),
    intimacyEffects: uniqueText(input.intimacyEffects ?? []),
    misreadByOthersAs: uniqueText(input.misreadByOthersAs ?? []),
    compatibleWounds: uniqueText(input.compatibleWounds ?? []),
    compatibleFears: uniqueText(input.compatibleFears ?? []),
    compatibleConflictStyles: uniqueText(input.compatibleConflictStyles ?? []),
    incompatibleDynamics: uniqueText(input.incompatibleDynamics ?? []),
    routeGates: uniqueText(input.routeGates ?? []),
    growthArcs: uniqueText(input.growthArcs ?? []),
    metadata: {
      category: "repair_style",
      reliability: input.metadata?.reliability ?? "medium",
      romanceValue: clampScore(input.metadata?.romanceValue ?? 7),
      angstValue: clampScore(input.metadata?.angstValue ?? 5),
      conflictResolutionValue: clampScore(
        input.metadata?.conflictResolutionValue ?? 7,
      ),
      healingValue: clampScore(input.metadata?.healingValue ?? 7),
      pacingPressure: input.metadata?.pacingPressure ?? "medium",
    },
  };
}

export function createResponseSeedPreset(input: ResponseSeedInput): ResponseSeed {
  const base = createVocabularySeedPreset({
    seed: input.seed,
    label: input.label,
    description: input.description,
    examples: input.examples,
    tags: input.tags,
    relatedSeeds: input.relatedSeeds,
    oppositeSeeds: input.oppositeSeeds,
    romanceHooks: input.romanceHooks,
    scenarioHooks: input.scenarioHooks,
    dialoguePatterns: input.dialoguePatterns,
    metadata: {
      romanceValue: input.metadata?.romanceValue,
      conflictPotential: input.metadata?.conflictPotential,
    },
  });

  return {
    ...base,
    responseType: input.responseType,
    coreImpulse: input.coreImpulse,
    hiddenFear: input.hiddenFear,
    hiddenNeed: input.hiddenNeed,
    activators: uniqueText(input.activators ?? []),
    earlySignals: uniqueText(input.earlySignals ?? []),
    escalationPattern: uniqueText(input.escalationPattern ?? []),
    outwardBehaviors: uniqueText(input.outwardBehaviors ?? []),
    internalExperience: uniqueText(input.internalExperience ?? []),
    bodyLanguage: uniqueText(input.bodyLanguage ?? []),
    attachmentEffects: uniqueText(input.attachmentEffects ?? []),
    intimacyEffects: uniqueText(input.intimacyEffects ?? []),
    conflictEffects: uniqueText(input.conflictEffects ?? []),
    misreadByOthersAs: uniqueText(input.misreadByOthersAs ?? []),
    reassuranceNeeds: uniqueText(input.reassuranceNeeds ?? []),
    repairMethods: uniqueText(input.repairMethods ?? []),
    growthArcs: uniqueText(input.growthArcs ?? []),
    routeGates: uniqueText(input.routeGates ?? []),
    compatibleWounds: uniqueText(input.compatibleWounds ?? []),
    compatibleFears: uniqueText(input.compatibleFears ?? []),
    compatibleDesires: uniqueText(input.compatibleDesires ?? []),
    metadata: {
      category: "response",
      intensity: input.metadata?.intensity ?? "moderate",
      romanceValue: clampScore(input.metadata?.romanceValue ?? 7),
      angstValue: clampScore(input.metadata?.angstValue ?? 7),
      conflictPotential: clampScore(input.metadata?.conflictPotential ?? 7),
      healingValue: clampScore(input.metadata?.healingValue ?? 7),
      pacingPressure: input.metadata?.pacingPressure ?? "medium",
    },
  };
}

export function createActsOfServiceSeedPreset(
  input: ActsOfServiceSeedInput,
): ActsOfServiceSeed {
  const base = createVocabularySeedPreset({
    seed: input.seed,
    label: input.label,
    description: input.description,
    examples: input.examples,
    tags: input.tags,
    relatedSeeds: input.relatedSeeds,
    oppositeSeeds: input.oppositeSeeds,
    romanceHooks: input.romanceHooks,
    scenarioHooks: input.scenarioHooks,
    dialoguePatterns: input.dialoguePatterns,
    metadata: {
      romanceValue: input.metadata?.romanceValue,
      conflictPotential: input.metadata?.conflictPotential,
    },
  });

  return {
    ...base,
    serviceType: input.serviceType,
    emotionalMeaning: input.emotionalMeaning,
    hiddenMotivation: input.hiddenMotivation,
    fantasyFulfillment: input.fantasyFulfillment,
    activatedBy: uniqueText(input.activatedBy ?? []),
    associatedWounds: uniqueText(input.associatedWounds ?? []),
    associatedFears: uniqueText(input.associatedFears ?? []),
    associatedDesires: uniqueText(input.associatedDesires ?? []),
    visibleBehaviors: uniqueText(input.visibleBehaviors ?? []),
    escalationPath: uniqueText(input.escalationPath ?? []),
    relationshipEffects: uniqueText(input.relationshipEffects ?? []),
    conflictEffects: uniqueText(input.conflictEffects ?? []),
    intimacyEffects: uniqueText(input.intimacyEffects ?? []),
    canBecomeUnhealthyAs: uniqueText(input.canBecomeUnhealthyAs ?? []),
    healingVersion: input.healingVersion,
    routeGates: uniqueText(input.routeGates ?? []),
    growthArcs: uniqueText(input.growthArcs ?? []),
    metadata: {
      category: "acts_of_service",
      romanceValue: clampScore(input.metadata?.romanceValue ?? 7),
      intimacyValue: clampScore(input.metadata?.intimacyValue ?? 7),
      healingValue: clampScore(input.metadata?.healingValue ?? 7),
      conflictPotential: clampScore(input.metadata?.conflictPotential ?? 4),
    },
  };
}

export function createRelationshipDynamicSeedPreset(
  input: RelationshipDynamicSeedInput,
): RelationshipDynamicSeed {
  const base = createVocabularySeedPreset({
    seed: input.seed,
    label: input.label,
    description: input.description,
    examples: input.examples,
    tags: input.tags,
    relatedSeeds: input.relatedSeeds,
    oppositeSeeds: input.oppositeSeeds,
    romanceHooks: input.romanceHooks,
    scenarioHooks: input.scenarioHooks,
    dialoguePatterns: input.dialoguePatterns,
    metadata: {
      romanceValue: input.metadata?.chemistryValue,
      conflictPotential: input.metadata?.conflictPotential,
    },
  });

  return {
    ...base,
    dynamicType: input.dynamicType,
    emotionalCore: input.emotionalCore,
    primaryNeeds: uniqueText(input.primaryNeeds ?? []),
    primaryFears: uniqueText(input.primaryFears ?? []),
    typicalTriggers: uniqueText(input.typicalTriggers ?? []),
    commonResponses: uniqueText(input.commonResponses ?? []),
    conflictPatterns: uniqueText(input.conflictPatterns ?? []),
    repairPatterns: uniqueText(input.repairPatterns ?? []),
    associatedWounds: uniqueText(input.associatedWounds ?? []),
    associatedFears: uniqueText(input.associatedFears ?? []),
    associatedDesires: uniqueText(input.associatedDesires ?? []),
    evolutionPath: uniqueText(input.evolutionPath ?? []),
    unhealthyVersion: uniqueText(input.unhealthyVersion ?? []),
    healthyVersion: uniqueText(input.healthyVersion ?? []),
    routeGates: uniqueText(input.routeGates ?? []),
    metadata: {
      category: "relationship_dynamic",
      chemistryValue: clampScore(input.metadata?.chemistryValue ?? 8),
      conflictPotential: clampScore(input.metadata?.conflictPotential ?? 6),
      healingPotential: clampScore(input.metadata?.healingPotential ?? 7),
      intensity: input.metadata?.intensity ?? "medium",
    },
  };
}

export function createRomanceTropeSeedPreset(
  input: RomanceTropeSeedInput,
): RomanceTropeSeed {
  const base = createVocabularySeedPreset({
    seed: input.seed,
    label: input.label,
    description: input.description,
    examples: input.examples,
    tags: input.tags,
    relatedSeeds: input.relatedSeeds,
    oppositeSeeds: input.oppositeSeeds,
    romanceHooks: input.romanceHooks,
    scenarioHooks: input.scenarioHooks,
    dialoguePatterns: input.dialoguePatterns,
    metadata: {
      romanceValue: input.metadata?.chemistryValue,
      conflictPotential: input.metadata?.conflictPotential,
    },
  });

  return {
    ...base,
    tropeType: input.tropeType,
    emotionalCore: input.emotionalCore,
    payoffFantasy: input.payoffFantasy,
    startingConditions: uniqueText(input.startingConditions ?? []),
    emotionalBarriers: uniqueText(input.emotionalBarriers ?? []),
    commonTriggers: uniqueText(input.commonTriggers ?? []),
    commonResponses: uniqueText(input.commonResponses ?? []),
    associatedWounds: uniqueText(input.associatedWounds ?? []),
    associatedFears: uniqueText(input.associatedFears ?? []),
    associatedDesires: uniqueText(input.associatedDesires ?? []),
    relationshipDynamics: uniqueText(input.relationshipDynamics ?? []),
    routePhases: uniqueText(input.routePhases ?? []),
    conflictBeats: uniqueText(input.conflictBeats ?? []),
    repairBeats: uniqueText(input.repairBeats ?? []),
    intimacyGates: uniqueText(input.intimacyGates ?? []),
    healthyVersion: uniqueText(input.healthyVersion ?? []),
    unhealthyVersion: uniqueText(input.unhealthyVersion ?? []),
    antiPatterns: uniqueText(input.antiPatterns ?? []),
    compatibleSettings: uniqueText(input.compatibleSettings ?? []),
    compatibleOpeners: uniqueText(input.compatibleOpeners ?? []),
    metadata: {
      category: "romance_trope",
      intensity: input.metadata?.intensity ?? "medium",
      burnSpeed: input.metadata?.burnSpeed ?? "variable",
      angstValue: clampScore(input.metadata?.angstValue ?? 6),
      comfortValue: clampScore(input.metadata?.comfortValue ?? 6),
      chemistryValue: clampScore(input.metadata?.chemistryValue ?? 8),
      conflictPotential: clampScore(input.metadata?.conflictPotential ?? 7),
      healingPotential: clampScore(input.metadata?.healingPotential ?? 7),
    },
  };
}

export function createRoutePhaseSeedPreset(
  input: RoutePhaseSeedInput,
): RoutePhaseSeed {
  const base = createVocabularySeedPreset({
    seed: input.seed,
    label: input.label,
    description: input.description,
    examples: input.examples,
    tags: input.tags,
    relatedSeeds: input.relatedSeeds,
    oppositeSeeds: input.oppositeSeeds,
    romanceHooks: input.romanceHooks,
    scenarioHooks: input.scenarioHooks,
    dialoguePatterns: input.dialoguePatterns,
    metadata: {
      romanceValue: input.metadata?.chemistryValue,
      conflictPotential: input.metadata?.angstValue,
    },
  });

  return {
    ...base,
    phaseType: input.phaseType,
    emotionalFunction: input.emotionalFunction,
    phaseQuestion: input.phaseQuestion,
    readinessSignals: uniqueText(input.readinessSignals ?? []),
    blockingForces: uniqueText(input.blockingForces ?? []),
    activatesWounds: uniqueText(input.activatesWounds ?? []),
    activatesFears: uniqueText(input.activatesFears ?? []),
    activatesDesires: uniqueText(input.activatesDesires ?? []),
    likelyTriggers: uniqueText(input.likelyTriggers ?? []),
    likelyResponses: uniqueText(input.likelyResponses ?? []),
    relationshipDynamics: uniqueText(input.relationshipDynamics ?? []),
    compatibleTropes: uniqueText(input.compatibleTropes ?? []),
    conflictBeats: uniqueText(input.conflictBeats ?? []),
    repairBeats: uniqueText(input.repairBeats ?? []),
    entryConditions: uniqueText(input.entryConditions ?? []),
    exitConditions: uniqueText(input.exitConditions ?? []),
    routeGates: uniqueText(input.routeGates ?? []),
    milestoneMemories: uniqueText(input.milestoneMemories ?? []),
    healthyVersion: uniqueText(input.healthyVersion ?? []),
    unhealthyVersion: uniqueText(input.unhealthyVersion ?? []),
    growthArcs: uniqueText(input.growthArcs ?? []),
    metadata: {
      category: "route_phase",
      order: Math.max(0, Math.round(input.metadata?.order ?? 0)),
      intensity: input.metadata?.intensity ?? "medium",
      burnPressure: input.metadata?.burnPressure ?? "medium",
      angstValue: clampScore(input.metadata?.angstValue ?? 6),
      comfortValue: clampScore(input.metadata?.comfortValue ?? 6),
      chemistryValue: clampScore(input.metadata?.chemistryValue ?? 7),
      healingValue: clampScore(input.metadata?.healingValue ?? 7),
    },
  };
}

export function createPayoffFantasySeedPreset(
  input: PayoffFantasySeedInput,
): PayoffFantasySeed {
  const base = createVocabularySeedPreset({
    seed: input.seed,
    label: input.label,
    description: input.description,
    examples: input.examples,
    tags: input.tags,
    relatedSeeds: input.relatedSeeds,
    oppositeSeeds: input.oppositeSeeds,
    romanceHooks: input.romanceHooks,
    scenarioHooks: input.scenarioHooks,
    dialoguePatterns: input.dialoguePatterns,
    metadata: {
      romanceValue: input.metadata?.romanceValue,
      conflictPotential: input.metadata?.catharsisValue,
    },
  });

  return {
    ...base,
    payoffType: input.payoffType,
    fulfillsDesires: uniqueText(input.fulfillsDesires ?? []),
    resolvesFears: uniqueText(input.resolvesFears ?? []),
    healsWounds: uniqueText(input.healsWounds ?? []),
    compatibleTropes: uniqueText(input.compatibleTropes ?? []),
    compatibleDynamics: uniqueText(input.compatibleDynamics ?? []),
    compatibleGrowthArcs: uniqueText(input.compatibleGrowthArcs ?? []),
    requiredRoutePhases: uniqueText(input.requiredRoutePhases ?? []),
    payoffScenes: uniqueText(input.payoffScenes ?? []),
    emotionalProofs: uniqueText(input.emotionalProofs ?? []),
    endingFlavors: uniqueText(input.endingFlavors ?? []),
    antiPatterns: uniqueText(input.antiPatterns ?? []),
    routeGates: uniqueText(input.routeGates ?? []),
    milestoneMemories: uniqueText(input.milestoneMemories ?? []),
    metadata: {
      category: "payoff_fantasy",
      intensity: input.metadata?.intensity ?? "medium",
      comfortValue: clampScore(input.metadata?.comfortValue ?? 7),
      romanceValue: clampScore(input.metadata?.romanceValue ?? 8),
      healingValue: clampScore(input.metadata?.healingValue ?? 7),
      catharsisValue: clampScore(input.metadata?.catharsisValue ?? 7),
    },
  };
}

export function createRelationshipIdentitySeedPreset(
  input: RelationshipIdentitySeedInput,
): RelationshipIdentitySeed {
  const base = createVocabularySeedPreset({
    seed: input.seed,
    label: input.label,
    description: input.description,
    examples: input.examples,
    tags: input.tags,
    relatedSeeds: input.relatedSeeds,
    oppositeSeeds: input.oppositeSeeds,
    romanceHooks: input.romanceHooks,
    scenarioHooks: input.scenarioHooks,
    dialoguePatterns: input.dialoguePatterns,
    metadata: {
      romanceValue: input.metadata?.romanceValue,
      conflictPotential: input.metadata?.conflictPotential,
    },
  });

  return {
    ...base,
    identityType: input.identityType,
    fulfillsDesires: uniqueText(input.fulfillsDesires ?? []),
    resolvesFears: uniqueText(input.resolvesFears ?? []),
    healsWounds: uniqueText(input.healsWounds ?? []),
    compatibleDynamics: uniqueText(input.compatibleDynamics ?? []),
    compatibleTropes: uniqueText(input.compatibleTropes ?? []),
    compatiblePayoffFantasies: uniqueText(input.compatiblePayoffFantasies ?? []),
    requiredGrowthArcs: uniqueText(input.requiredGrowthArcs ?? []),
    relationshipRules: uniqueText(input.relationshipRules ?? []),
    emotionalProofs: uniqueText(input.emotionalProofs ?? []),
    dailyExpressions: uniqueText(input.dailyExpressions ?? []),
    conflictRisks: uniqueText(input.conflictRisks ?? []),
    repairNeeds: uniqueText(input.repairNeeds ?? []),
    routeGates: uniqueText(input.routeGates ?? []),
    milestoneMemories: uniqueText(input.milestoneMemories ?? []),
    metadata: {
      category: "relationship_identity",
      stabilityValue: clampScore(input.metadata?.stabilityValue ?? 8),
      romanceValue: clampScore(input.metadata?.romanceValue ?? 8),
      healingValue: clampScore(input.metadata?.healingValue ?? 8),
      conflictPotential: clampScore(input.metadata?.conflictPotential ?? 5),
      endingStrength: input.metadata?.endingStrength ?? "solid",
    },
  };
}

export function createAttachmentStyleSeedPreset(
  input: AttachmentStyleSeedInput,
): AttachmentStyleSeed {
  const base = createVocabularySeedPreset({
    seed: input.seed,
    label: input.label,
    description: input.description,
    examples: input.examples,
    tags: input.tags,
    relatedSeeds: input.relatedSeeds,
    oppositeSeeds: input.oppositeSeeds,
    romanceHooks: input.romanceHooks,
    scenarioHooks: input.scenarioHooks,
    dialoguePatterns: input.dialoguePatterns,
    metadata: {
      romanceValue: input.metadata?.romanceValue,
      conflictPotential: input.metadata?.conflictPotential,
    },
  });

  return {
    ...base,
    attachmentType: input.attachmentType,
    coreBelief: input.coreBelief,
    coreFear: input.coreFear,
    coreDesire: input.coreDesire,
    associatedWounds: uniqueText(input.associatedWounds ?? []),
    associatedFears: uniqueText(input.associatedFears ?? []),
    associatedDesires: uniqueText(input.associatedDesires ?? []),
    commonTriggers: uniqueText(input.commonTriggers ?? []),
    commonResponses: uniqueText(input.commonResponses ?? []),
    intimacyPattern: uniqueText(input.intimacyPattern ?? []),
    conflictPattern: uniqueText(input.conflictPattern ?? []),
    repairNeeds: uniqueText(input.repairNeeds ?? []),
    compatibleRepairStyles: uniqueText(input.compatibleRepairStyles ?? []),
    healthyVersion: uniqueText(input.healthyVersion ?? []),
    unhealthyVersion: uniqueText(input.unhealthyVersion ?? []),
    growthArcs: uniqueText(input.growthArcs ?? []),
    routeGates: uniqueText(input.routeGates ?? []),
    metadata: {
      category: "attachment_style",
      securityLevel: input.metadata?.securityLevel ?? "medium",
      romanceValue: clampScore(input.metadata?.romanceValue ?? 8),
      angstValue: clampScore(input.metadata?.angstValue ?? 7),
      conflictPotential: clampScore(input.metadata?.conflictPotential ?? 7),
      healingValue: clampScore(input.metadata?.healingValue ?? 8),
    },
  };
}

export function createLoveLanguageSeedPreset(
  input: LoveLanguageSeedInput,
): LoveLanguageSeed {
  const base = createVocabularySeedPreset({
    seed: input.seed,
    label: input.label,
    description: input.description,
    examples: input.examples,
    tags: input.tags,
    relatedSeeds: input.relatedSeeds,
    oppositeSeeds: input.oppositeSeeds,
    romanceHooks: input.romanceHooks,
    scenarioHooks: input.scenarioHooks,
    dialoguePatterns: input.dialoguePatterns,
    metadata: {
      romanceValue: input.metadata?.romanceValue,
      conflictPotential: input.metadata?.conflictPotential,
    },
  });

  return {
    ...base,
    loveLanguageType: input.loveLanguageType,
    emotionalMeaning: input.emotionalMeaning,
    hiddenNeed: input.hiddenNeed,
    commonMisread: input.commonMisread,
    associatedWounds: uniqueText(input.associatedWounds ?? []),
    associatedFears: uniqueText(input.associatedFears ?? []),
    associatedDesires: uniqueText(input.associatedDesires ?? []),
    compatibleAttachmentStyles: uniqueText(input.compatibleAttachmentStyles ?? []),
    compatibleDynamics: uniqueText(input.compatibleDynamics ?? []),
    visibleBehaviors: uniqueText(input.visibleBehaviors ?? []),
    fulfillmentSignals: uniqueText(input.fulfillmentSignals ?? []),
    deprivationSignals: uniqueText(input.deprivationSignals ?? []),
    conflictRisks: uniqueText(input.conflictRisks ?? []),
    repairStyles: uniqueText(input.repairStyles ?? []),
    growthArcs: uniqueText(input.growthArcs ?? []),
    routeGates: uniqueText(input.routeGates ?? []),
    metadata: {
      category: "love_language",
      romanceValue: clampScore(input.metadata?.romanceValue ?? 8),
      intimacyValue: clampScore(input.metadata?.intimacyValue ?? 8),
      healingValue: clampScore(input.metadata?.healingValue ?? 8),
      conflictPotential: clampScore(input.metadata?.conflictPotential ?? 5),
      pacingPressure: input.metadata?.pacingPressure ?? "medium",
    },
  };
}

export function createHiddenNeedSeedPreset(
  input: HiddenNeedSeedInput,
): HiddenNeedSeed {
  const base = createVocabularySeedPreset({
    seed: input.seed,
    label: input.label,
    description: input.description,
    examples: input.examples,
    tags: input.tags,
    relatedSeeds: input.relatedSeeds,
    oppositeSeeds: input.oppositeSeeds,
    romanceHooks: input.romanceHooks,
    scenarioHooks: input.scenarioHooks,
    dialoguePatterns: input.dialoguePatterns,
    metadata: {
      romanceValue: input.metadata?.romanceValue,
      conflictPotential: input.metadata?.conflictPotential,
    },
  });

  return {
    ...base,
    needType: input.needType,
    masksAs: uniqueText(input.masksAs ?? []),
    createdByWounds: uniqueText(input.createdByWounds ?? []),
    drivenByFears: uniqueText(input.drivenByFears ?? []),
    expressedAsDesires: uniqueText(input.expressedAsDesires ?? []),
    activatedByTriggers: uniqueText(input.activatedByTriggers ?? []),
    commonResponses: uniqueText(input.commonResponses ?? []),
    loveLanguages: uniqueText(input.loveLanguages ?? []),
    compatibleRepairStyles: uniqueText(input.compatibleRepairStyles ?? []),
    growthArcs: uniqueText(input.growthArcs ?? []),
    unmetConsequences: uniqueText(input.unmetConsequences ?? []),
    fulfillmentSignals: uniqueText(input.fulfillmentSignals ?? []),
    routeGates: uniqueText(input.routeGates ?? []),
    milestoneMemories: uniqueText(input.milestoneMemories ?? []),
    metadata: {
      category: "hidden_need",
      urgency: input.metadata?.urgency ?? "moderate",
      romanceValue: clampScore(input.metadata?.romanceValue ?? 8),
      conflictPotential: clampScore(input.metadata?.conflictPotential ?? 6),
      healingValue: clampScore(input.metadata?.healingValue ?? 8),
      pacingPressure: input.metadata?.pacingPressure ?? "medium",
    },
  };
}

export function createEmotionalMeaningSeedPreset(
  input: EmotionalMeaningSeedInput,
): EmotionalMeaningSeed {
  const base = createVocabularySeedPreset({
    seed: input.seed,
    label: input.label,
    description: input.description,
    examples: input.examples,
    tags: input.tags,
    relatedSeeds: input.relatedSeeds,
    oppositeSeeds: input.oppositeSeeds,
    romanceHooks: input.romanceHooks,
    scenarioHooks: input.scenarioHooks,
    dialoguePatterns: input.dialoguePatterns,
    metadata: {
      romanceValue: input.metadata?.romanceValue,
      conflictPotential: input.metadata?.conflictPotential,
    },
  });

  return {
    ...base,
    meaningType: input.meaningType,
    expressedThrough: uniqueText(input.expressedThrough ?? []),
    oftenMisreadAs: uniqueText(input.oftenMisreadAs ?? []),
    hiddenNeedMet: uniqueText(input.hiddenNeedMet ?? []),
    associatedWounds: uniqueText(input.associatedWounds ?? []),
    associatedFears: uniqueText(input.associatedFears ?? []),
    associatedDesires: uniqueText(input.associatedDesires ?? []),
    compatibleLoveLanguages: uniqueText(input.compatibleLoveLanguages ?? []),
    compatibleVisibleBehaviors: uniqueText(input.compatibleVisibleBehaviors ?? []),
    triggerWhenAbsent: uniqueText(input.triggerWhenAbsent ?? []),
    likelyResponsesWhenAbsent: uniqueText(input.likelyResponsesWhenAbsent ?? []),
    repairStyles: uniqueText(input.repairStyles ?? []),
    growthArcs: uniqueText(input.growthArcs ?? []),
    payoffFantasies: uniqueText(input.payoffFantasies ?? []),
    relationshipIdentities: uniqueText(input.relationshipIdentities ?? []),
    routeGates: uniqueText(input.routeGates ?? []),
    milestoneMemories: uniqueText(input.milestoneMemories ?? []),
    metadata: {
      category: "emotional_meaning",
      subtlety: input.metadata?.subtlety ?? "medium",
      romanceValue: clampScore(input.metadata?.romanceValue ?? 8),
      healingValue: clampScore(input.metadata?.healingValue ?? 8),
      conflictPotential: clampScore(input.metadata?.conflictPotential ?? 5),
      intimacyValue: clampScore(input.metadata?.intimacyValue ?? 8),
    },
  };
}

export function createRepairNeedSeedPreset(
  input: RepairNeedSeedInput,
): RepairNeedSeed {
  const base = createVocabularySeedPreset({
    seed: input.seed,
    label: input.label,
    description: input.description,
    examples: input.examples,
    tags: input.tags,
    relatedSeeds: input.relatedSeeds,
    oppositeSeeds: input.oppositeSeeds,
    romanceHooks: input.romanceHooks,
    scenarioHooks: input.scenarioHooks,
    dialoguePatterns: input.dialoguePatterns,
    metadata: {
      romanceValue: input.metadata?.repairPower,
      conflictPotential: 11 - (input.metadata?.healingValue ?? 8),
    },
  });

  return {
    ...base,
    needType: input.needType,
    repairsConsequences: uniqueText(input.repairsConsequences ?? []),
    repairsRuptures: uniqueText(input.repairsRuptures ?? []),
    activatedByWounds: uniqueText(input.activatedByWounds ?? []),
    activatedByFears: uniqueText(input.activatedByFears ?? []),
    frustratedDesires: uniqueText(input.frustratedDesires ?? []),
    compatibleRepairStyles: uniqueText(input.compatibleRepairStyles ?? []),
    compatibleRepairBeats: uniqueText(input.compatibleRepairBeats ?? []),
    incompatibleRepairs: uniqueText(input.incompatibleRepairs ?? []),
    requiredConditions: uniqueText(input.requiredConditions ?? []),
    fulfillmentSignals: uniqueText(input.fulfillmentSignals ?? []),
    failureModes: uniqueText(input.failureModes ?? []),
    growthArcs: uniqueText(input.growthArcs ?? []),
    routeGates: uniqueText(input.routeGates ?? []),
    milestoneMemories: uniqueText(input.milestoneMemories ?? []),
    metadata: {
      category: "repair_need",
      urgency: input.metadata?.urgency ?? "medium",
      repairPower: clampScore(input.metadata?.repairPower ?? 8),
      trustRepairValue: clampScore(input.metadata?.trustRepairValue ?? 8),
      attachmentRepairValue: clampScore(input.metadata?.attachmentRepairValue ?? 8),
      healingValue: clampScore(input.metadata?.healingValue ?? 8),
    },
  };
}

export function createRouteGateSeedPreset(
  input: RouteGateSeedInput,
): RouteGateSeed {
  const base = createVocabularySeedPreset({
    seed: input.seed,
    label: input.label,
    description: input.description,
    examples: input.examples,
    tags: input.tags,
    relatedSeeds: input.relatedSeeds,
    oppositeSeeds: input.oppositeSeeds,
    romanceHooks: input.romanceHooks,
    scenarioHooks: input.scenarioHooks,
    dialoguePatterns: input.dialoguePatterns,
    metadata: {
      romanceValue: input.metadata?.romanceValue,
      conflictPotential: input.metadata?.angstValue,
    },
  });

  return {
    ...base,
    gateType: input.gateType,
    unlocksRoutePhases: uniqueText(input.unlocksRoutePhases ?? []),
    requiredBefore: uniqueText(input.requiredBefore ?? []),
    blockedBy: uniqueText(input.blockedBy ?? []),
    activatedByWounds: uniqueText(input.activatedByWounds ?? []),
    activatedByFears: uniqueText(input.activatedByFears ?? []),
    fulfillsDesires: uniqueText(input.fulfillsDesires ?? []),
    satisfiesHiddenNeeds: uniqueText(input.satisfiesHiddenNeeds ?? []),
    likelyTriggers: uniqueText(input.likelyTriggers ?? []),
    likelyResponses: uniqueText(input.likelyResponses ?? []),
    compatibleRepairBeats: uniqueText(input.compatibleRepairBeats ?? []),
    compatibleGrowthArcs: uniqueText(input.compatibleGrowthArcs ?? []),
    successSignals: uniqueText(input.successSignals ?? []),
    failureSignals: uniqueText(input.failureSignals ?? []),
    milestoneMemories: uniqueText(input.milestoneMemories ?? []),
    metadata: {
      category: "route_gate",
      importance: input.metadata?.importance ?? "moderate",
      romanceValue: clampScore(input.metadata?.romanceValue ?? 7),
      angstValue: clampScore(input.metadata?.angstValue ?? 6),
      healingValue: clampScore(input.metadata?.healingValue ?? 7),
      routeProgressValue: clampScore(input.metadata?.routeProgressValue ?? 7),
    },
  };
}

export function createVisibleBehaviorSeedPreset(
  input: VisibleBehaviorSeedInput,
): VisibleBehaviorSeed {
  const base = createVocabularySeedPreset({
    seed: input.seed,
    label: input.label,
    description: input.description,
    examples: input.examples,
    tags: input.tags,
    relatedSeeds: input.relatedSeeds,
    oppositeSeeds: input.oppositeSeeds,
    romanceHooks: input.romanceHooks,
    scenarioHooks: input.scenarioHooks,
    dialoguePatterns: input.dialoguePatterns,
    metadata: {
      romanceValue: input.metadata?.romanceValue,
      conflictPotential: input.metadata?.conflictPotential,
    },
  });

  return {
    ...base,
    behaviorType: input.behaviorType,
    emotionalMeaning: input.emotionalMeaning,
    hiddenMotivation: input.hiddenMotivation,
    loveLanguageSource: uniqueText(input.loveLanguageSource ?? []),
    associatedWounds: uniqueText(input.associatedWounds ?? []),
    associatedFears: uniqueText(input.associatedFears ?? []),
    associatedDesires: uniqueText(input.associatedDesires ?? []),
    associatedDynamics: uniqueText(input.associatedDynamics ?? []),
    activatedBy: uniqueText(input.activatedBy ?? []),
    fulfillmentSignals: uniqueText(input.fulfillmentSignals ?? []),
    misreadRisks: uniqueText(input.misreadRisks ?? []),
    conflictRisks: uniqueText(input.conflictRisks ?? []),
    repairStyles: uniqueText(input.repairStyles ?? []),
    growthArcs: uniqueText(input.growthArcs ?? []),
    routeGates: uniqueText(input.routeGates ?? []),
    milestoneMemories: uniqueText(input.milestoneMemories ?? []),
    metadata: {
      category: "visible_behavior",
      subtlety: input.metadata?.subtlety ?? "medium",
      romanceValue: clampScore(input.metadata?.romanceValue ?? 8),
      intimacyValue: clampScore(input.metadata?.intimacyValue ?? 8),
      healingValue: clampScore(input.metadata?.healingValue ?? 8),
      conflictPotential: clampScore(input.metadata?.conflictPotential ?? 4),
      repeatability: input.metadata?.repeatability ?? "recurring",
    },
  };
}

export function createGrowthArcSeedPreset(
  input: GrowthArcSeedInput,
): GrowthArcSeed {
  const base = createVocabularySeedPreset({
    seed: input.seed,
    label: input.label,
    description: input.description,
    examples: input.examples,
    tags: input.tags,
    relatedSeeds: input.relatedSeeds,
    oppositeSeeds: input.oppositeSeeds,
    romanceHooks: input.romanceHooks,
    scenarioHooks: input.scenarioHooks,
    dialoguePatterns: input.dialoguePatterns,
    metadata: {
      romanceValue: input.metadata?.romanceValue,
      conflictPotential: input.metadata?.angstValue,
    },
  });

  return {
    ...base,
    arcType: input.arcType,
    startingWounds: uniqueText(input.startingWounds ?? []),
    startingFears: uniqueText(input.startingFears ?? []),
    coreDesires: uniqueText(input.coreDesires ?? []),
    commonTriggers: uniqueText(input.commonTriggers ?? []),
    oldResponses: uniqueText(input.oldResponses ?? []),
    newResponses: uniqueText(input.newResponses ?? []),
    requiredRepairBeats: uniqueText(input.requiredRepairBeats ?? []),
    milestoneMemories: uniqueText(input.milestoneMemories ?? []),
    routeGates: uniqueText(input.routeGates ?? []),
    regressionRisks: uniqueText(input.regressionRisks ?? []),
    healthyOutcome: uniqueText(input.healthyOutcome ?? []),
    relationshipEffects: uniqueText(input.relationshipEffects ?? []),
    metadata: {
      category: "growth_arc",
      intensity: input.metadata?.intensity ?? "medium",
      healingValue: clampScore(input.metadata?.healingValue ?? 7),
      angstValue: clampScore(input.metadata?.angstValue ?? 6),
      romanceValue: clampScore(input.metadata?.romanceValue ?? 7),
      pacingPressure: input.metadata?.pacingPressure ?? "medium",
    },
  };
}

export function createRepairBeatSeedPreset(
  input: RepairBeatSeedInput,
): RepairBeatSeed {
  const base = createVocabularySeedPreset({
    seed: input.seed,
    label: input.label,
    description: input.description,
    examples: input.examples,
    tags: input.tags,
    relatedSeeds: input.relatedSeeds,
    oppositeSeeds: input.oppositeSeeds,
    romanceHooks: input.romanceHooks,
    scenarioHooks: input.scenarioHooks,
    dialoguePatterns: input.dialoguePatterns,
    metadata: {
      romanceValue: input.metadata?.repairPower,
      conflictPotential: input.metadata?.trustRepairValue,
    },
  });

  return {
    ...base,
    beatType: input.beatType,
    emotionalFunction: input.emotionalFunction,
    repairQuestion: input.repairQuestion,
    repairsConsequences: uniqueText(input.repairsConsequences ?? []),
    repairsRuptures: uniqueText(input.repairsRuptures ?? []),
    compatibleRepairStyles: uniqueText(input.compatibleRepairStyles ?? []),
    requiredConditions: uniqueText(input.requiredConditions ?? []),
    likelyResistance: uniqueText(input.likelyResistance ?? []),
    failureModes: uniqueText(input.failureModes ?? []),
    successSignals: uniqueText(input.successSignals ?? []),
    relationshipEffects: uniqueText(input.relationshipEffects ?? []),
    milestoneMemories: uniqueText(input.milestoneMemories ?? []),
    growthPotential: uniqueText(input.growthPotential ?? []),
    metadata: {
      category: "repair_beat",
      intensity: input.metadata?.intensity ?? "medium",
      repairPower: clampScore(input.metadata?.repairPower ?? 7),
      trustRepairValue: clampScore(input.metadata?.trustRepairValue ?? 7),
      attachmentRepairValue: clampScore(input.metadata?.attachmentRepairValue ?? 7),
      healingValue: clampScore(input.metadata?.healingValue ?? 7),
      pacingPressure: input.metadata?.pacingPressure ?? "medium",
    },
  };
}

export function createConsequenceSeedPreset(
  input: ConsequenceSeedInput,
): ConsequenceSeed {
  const base = createVocabularySeedPreset({
    seed: input.seed,
    label: input.label,
    description: input.description,
    examples: input.examples,
    tags: input.tags,
    relatedSeeds: input.relatedSeeds,
    oppositeSeeds: input.oppositeSeeds,
    romanceHooks: input.romanceHooks,
    scenarioHooks: input.scenarioHooks,
    dialoguePatterns: input.dialoguePatterns,
    metadata: {
      romanceValue: input.metadata?.healingValue,
      conflictPotential: input.metadata?.repairDifficulty,
    },
  });

  return {
    ...base,
    consequenceType: input.consequenceType,
    causedBy: uniqueText(input.causedBy ?? []),
    affectsTrustLayers: uniqueText(input.affectsTrustLayers ?? []),
    likelyResponses: uniqueText(input.likelyResponses ?? []),
    repairNeeds: uniqueText(input.repairNeeds ?? []),
    compatibleRepairStyles: uniqueText(input.compatibleRepairStyles ?? []),
    growthPotential: uniqueText(input.growthPotential ?? []),
    milestoneMemories: uniqueText(input.milestoneMemories ?? []),
    metadata: {
      category: "consequence",
      severity: input.metadata?.severity ?? "moderate",
      persistence: input.metadata?.persistence ?? "scene_level",
      angstValue: clampScore(input.metadata?.angstValue ?? 7),
      healingValue: clampScore(input.metadata?.healingValue ?? 7),
      repairDifficulty: clampScore(input.metadata?.repairDifficulty ?? 7),
    },
  };
}

export function createRuptureTypeSeedPreset(
  input: RuptureTypeSeedInput,
): RuptureTypeSeed {
  const base = createVocabularySeedPreset({
    seed: input.seed,
    label: input.label,
    description: input.description,
    examples: input.examples,
    tags: input.tags,
    relatedSeeds: input.relatedSeeds,
    oppositeSeeds: input.oppositeSeeds,
    romanceHooks: input.romanceHooks,
    scenarioHooks: input.scenarioHooks,
    dialoguePatterns: input.dialoguePatterns,
    metadata: {
      romanceValue: input.metadata?.healingValue,
      conflictPotential: input.metadata?.repairDifficulty,
    },
  });

  return {
    ...base,
    ruptureType: input.ruptureType,
    emotionalDamage: input.emotionalDamage,
    damagedTrustLayer: uniqueText(input.damagedTrustLayer ?? []),
    activatesWounds: uniqueText(input.activatesWounds ?? []),
    activatesFears: uniqueText(input.activatesFears ?? []),
    frustratesDesires: uniqueText(input.frustratesDesires ?? []),
    commonTriggers: uniqueText(input.commonTriggers ?? []),
    commonResponses: uniqueText(input.commonResponses ?? []),
    compatibleConflictBeats: uniqueText(input.compatibleConflictBeats ?? []),
    repairNeeds: uniqueText(input.repairNeeds ?? []),
    compatibleRepairStyles: uniqueText(input.compatibleRepairStyles ?? []),
    incompatibleRepairStyles: uniqueText(input.incompatibleRepairStyles ?? []),
    consequencePatterns: uniqueText(input.consequencePatterns ?? []),
    memoryEffects: uniqueText(input.memoryEffects ?? []),
    growthPotential: uniqueText(input.growthPotential ?? []),
    routeGates: uniqueText(input.routeGates ?? []),
    milestoneMemories: uniqueText(input.milestoneMemories ?? []),
    metadata: {
      category: "rupture_type",
      severityBias: input.metadata?.severityBias ?? "moderate",
      trustDamage: clampScore(input.metadata?.trustDamage ?? 7),
      attachmentDamage: clampScore(input.metadata?.attachmentDamage ?? 7),
      repairDifficulty: clampScore(input.metadata?.repairDifficulty ?? 7),
      angstValue: clampScore(input.metadata?.angstValue ?? 7),
      healingValue: clampScore(input.metadata?.healingValue ?? 7),
    },
  };
}

export function createConflictBeatSeedPreset(
  input: ConflictBeatSeedInput,
): ConflictBeatSeed {
  const base = createVocabularySeedPreset({
    seed: input.seed,
    label: input.label,
    description: input.description,
    examples: input.examples,
    tags: input.tags,
    relatedSeeds: input.relatedSeeds,
    oppositeSeeds: input.oppositeSeeds,
    romanceHooks: input.romanceHooks,
    scenarioHooks: input.scenarioHooks,
    dialoguePatterns: input.dialoguePatterns,
    metadata: {
      romanceValue: input.metadata?.healingValue,
      conflictPotential: input.metadata?.ruptureRisk,
    },
  });

  return {
    ...base,
    beatType: input.beatType,
    emotionalFunction: input.emotionalFunction,
    hiddenQuestion: input.hiddenQuestion,
    activatesWounds: uniqueText(input.activatesWounds ?? []),
    activatesFears: uniqueText(input.activatesFears ?? []),
    activatesDesires: uniqueText(input.activatesDesires ?? []),
    commonTriggers: uniqueText(input.commonTriggers ?? []),
    likelyResponses: uniqueText(input.likelyResponses ?? []),
    compatibleConflictStyles: uniqueText(input.compatibleConflictStyles ?? []),
    compatibleRepairStyles: uniqueText(input.compatibleRepairStyles ?? []),
    compatibleRoutePhases: uniqueText(input.compatibleRoutePhases ?? []),
    compatibleTropes: uniqueText(input.compatibleTropes ?? []),
    escalationPath: uniqueText(input.escalationPath ?? []),
    ruptureRisks: uniqueText(input.ruptureRisks ?? []),
    repairNeeds: uniqueText(input.repairNeeds ?? []),
    growthPotential: uniqueText(input.growthPotential ?? []),
    routeGates: uniqueText(input.routeGates ?? []),
    milestoneMemories: uniqueText(input.milestoneMemories ?? []),
    metadata: {
      category: "conflict_beat",
      intensity: input.metadata?.intensity ?? "medium",
      ruptureRisk: clampScore(input.metadata?.ruptureRisk ?? 7),
      angstValue: clampScore(input.metadata?.angstValue ?? 7),
      chemistryValue: clampScore(input.metadata?.chemistryValue ?? 6),
      healingValue: clampScore(input.metadata?.healingValue ?? 7),
      pacingPressure: input.metadata?.pacingPressure ?? "medium",
    },
  };
}

export function createConflictStyleSeedPreset(
  input: ConflictStyleSeedInput,
): ConflictStyleSeed {
  const base = createVocabularySeedPreset({
    seed: input.seed,
    label: input.label,
    description: input.description,
    examples: input.examples,
    tags: input.tags,
    relatedSeeds: input.relatedSeeds,
    oppositeSeeds: input.oppositeSeeds,
    romanceHooks: input.romanceHooks,
    scenarioHooks: input.scenarioHooks,
    dialoguePatterns: input.dialoguePatterns,
    metadata: {
      romanceValue: input.metadata?.romanceValue,
      conflictPotential: input.metadata?.ruptureRisk,
    },
  });

  return {
    ...base,
    conflictType: input.conflictType,
    emotionalCore: input.emotionalCore,
    hiddenFear: input.hiddenFear,
    hiddenNeed: input.hiddenNeed,
    commonTriggers: uniqueText(input.commonTriggers ?? []),
    stressResponses: uniqueText(input.stressResponses ?? []),
    escalationPattern: uniqueText(input.escalationPattern ?? []),
    attachmentEffects: uniqueText(input.attachmentEffects ?? []),
    intimacyEffects: uniqueText(input.intimacyEffects ?? []),
    ruptureRisks: uniqueText(input.ruptureRisks ?? []),
    likelyRepairStyles: uniqueText(input.likelyRepairStyles ?? []),
    incompatibleRepairStyles: uniqueText(input.incompatibleRepairStyles ?? []),
    associatedWounds: uniqueText(input.associatedWounds ?? []),
    associatedFears: uniqueText(input.associatedFears ?? []),
    associatedDesires: uniqueText(input.associatedDesires ?? []),
    associatedResponses: uniqueText(input.associatedResponses ?? []),
    healthyVersion: uniqueText(input.healthyVersion ?? []),
    unhealthyVersion: uniqueText(input.unhealthyVersion ?? []),
    growthArcs: uniqueText(input.growthArcs ?? []),
    routeGates: uniqueText(input.routeGates ?? []),
    metadata: {
      category: "conflict_style",
      intensity: input.metadata?.intensity ?? "medium",
      ruptureRisk: clampScore(input.metadata?.ruptureRisk ?? 6),
      repairDifficulty: clampScore(input.metadata?.repairDifficulty ?? 6),
      angstValue: clampScore(input.metadata?.angstValue ?? 7),
      romanceValue: clampScore(input.metadata?.romanceValue ?? 6),
      healingPotential: clampScore(input.metadata?.healingPotential ?? 7),
    },
  };
}

export function createVocabularySeedFromPresetLike(
  preset: VocabularySeedPresetLike,
  options: {
    seedPrefix?: string;
    description?: string;
    examples?: readonly string[];
    tags?: readonly string[];
    relatedSeeds?: readonly string[];
    oppositeSeeds?: readonly string[];
    romanceHooks?: readonly string[];
    scenarioHooks?: readonly string[];
    dialoguePatterns?: readonly string[];
    metadata?: Partial<VocabularySeedMetadata>;
  } = {},
): VocabularySeedPreset {
  const value = preset.value ?? preset.label;
  const seed = options.seedPrefix === undefined
    ? preset.id
    : `${options.seedPrefix}_${preset.id}`;

  return createVocabularySeedPreset({
    seed,
    label: preset.label,
    description: options.description ?? preset.guidance,
    examples: options.examples ?? [
      `Use ${value} as the active vocabulary cue.`,
      preset.guidance,
    ],
    tags: [
      preset.category,
      ...(preset.systemPromptTags ?? []),
      ...(preset.triggerKeys ?? []),
      ...(options.tags ?? []),
    ],
    relatedSeeds: options.relatedSeeds,
    oppositeSeeds: options.oppositeSeeds,
    romanceHooks: options.romanceHooks,
    scenarioHooks: options.scenarioHooks,
    dialoguePatterns: options.dialoguePatterns,
    metadata: options.metadata,
  });
}

export function assertVocabularySeedPresetShape(
  seed: VocabularySeedPreset,
): VocabularySeedPreset {
  return createVocabularySeedPreset(seed);
}

function clampScore(value: number): number {
  if (!Number.isFinite(value)) {
    return 5;
  }

  return Math.max(1, Math.min(10, Math.round(value)));
}

function uniqueText(values: readonly string[]): readonly string[] {
  return Array.from(new Set(values.filter((value) => value.trim().length > 0)));
}
