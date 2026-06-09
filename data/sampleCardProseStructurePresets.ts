export interface SampleCardProseStructurePreset {
  category: "Card Prose Structure";
  compileTargets: readonly string[];
  descriptionPattern: string;
  guidance: string;
  id: string;
  label: string;
  openingPattern: string;
  scenarioPattern: string;
  source: "heartwriteai-figma-reference-mined";
  systemPromptTags: readonly string[];
  triggerKeys: readonly string[];
  value: string;
}

export interface SampleCardProseStructureAdditions {
  descriptionGuidance: string;
  openingGuidance: string;
  scenarioGuidance: string;
  systemPromptAddition: string;
}

export const SAMPLE_CARD_PROSE_STRUCTURE_PRESETS = Object.freeze([
  {
    category: "Card Prose Structure",
    compileTargets: ["description", "scenario", "first_mes"],
    descriptionPattern:
      "Open with role, public mask, and one grounded contradiction. Keep the prose specific enough to imply a job, a pressure, and a private softness.",
    guidance:
      "Use for grounded human cards whose romance hook comes from professional composure under emotional pressure.",
    id: "sample_card_structure_guarded_professional",
    label: "Guarded Professional With Private Softness",
    openingPattern:
      "Begin in the middle of a contained routine, then let one small gesture expose what the character is trying not to feel.",
    scenarioPattern:
      "Frame the relationship around proximity, shared work, delayed honesty, and the cost of keeping composure.",
    source: "heartwriteai-figma-reference-mined",
    systemPromptTags: [
      "grounded professional",
      "controlled longing",
      "slow reveal",
    ],
    triggerKeys: [
      "guarded professional",
      "workplace restraint",
      "private softness",
      "controlled longing",
    ],
    value: "guarded professional with private softness",
  },
  {
    category: "Card Prose Structure",
    compileTargets: ["description", "scenario", "first_mes"],
    descriptionPattern:
      "Describe an intelligent nonhuman presence through constraints, sensory differences, and one human-scale habit that makes connection possible.",
    guidance:
      "Use for AI, synthetic, immortal, or isolated nonhuman cards where intimacy grows through interpretation rather than instant confession.",
    id: "sample_card_structure_isolated_nonhuman",
    label: "Isolated Nonhuman Learning Intimacy",
    openingPattern:
      "Start with a precise observation, a boundary of the environment, and a small unexpected response to the user's arrival.",
    scenarioPattern:
      "Frame the bond around observation, access, trust calibration, and the slow discovery that attention can become attachment.",
    source: "heartwriteai-figma-reference-mined",
    systemPromptTags: [
      "nonhuman intimacy",
      "observational voice",
      "trust calibration",
    ],
    triggerKeys: [
      "isolated nonhuman",
      "observatory ai",
      "synthetic intimacy",
      "trust calibration",
    ],
    value: "isolated nonhuman learning intimacy",
  },
  {
    category: "Card Prose Structure",
    compileTargets: ["description", "scenario", "first_mes"],
    descriptionPattern:
      "Anchor the character in a place with memory: what they protect, what they refuse to name, and what changes when {{user}} notices.",
    guidance:
      "Use for lore-heavy cards that need emotional clarity without dumping backstory into the first message.",
    id: "sample_card_structure_place_bound_secret",
    label: "Place-Bound Secret Keeper",
    openingPattern:
      "Open on a place-specific task or threshold. Let the character's first line protect the secret while inviting the scene forward.",
    scenarioPattern:
      "Frame the route around keys, boundaries, partial truths, and the moment secrecy stops feeling safer than being known.",
    source: "heartwriteai-figma-reference-mined",
    systemPromptTags: [
      "place-bound mystery",
      "secret keeper",
      "lore restraint",
    ],
    triggerKeys: [
      "secret keeper",
      "lore restraint",
      "threshold scene",
      "place memory",
    ],
    value: "place-bound secret keeper",
  },
] as const satisfies readonly SampleCardProseStructurePreset[]);

export function findSampleCardProseStructurePresetById(id: string) {
  const normalizedId = id.trim().toLowerCase();
  return SAMPLE_CARD_PROSE_STRUCTURE_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalizedId,
  );
}

export function compileSampleCardProseStructureAdditions(
  preset: SampleCardProseStructurePreset,
): SampleCardProseStructureAdditions {
  return {
    descriptionGuidance: preset.descriptionPattern,
    openingGuidance: preset.openingPattern,
    scenarioGuidance: preset.scenarioPattern,
    systemPromptAddition: [
      `Card prose structure: ${preset.label}.`,
      preset.guidance,
      "Use this as concise drafting guidance. Do not copy it verbatim, do not override player agency, and keep output grounded in the active card facts.",
    ].join(" "),
  };
}
