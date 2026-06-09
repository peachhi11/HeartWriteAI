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
