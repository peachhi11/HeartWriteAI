import {
  cloneCharacterBrain,
  normalizeCharacterBrain,
  type BrainLayer,
  type CharacterBrain,
} from "./semanticBrainService";

export const JulianBrainTemplate: CharacterBrain = normalizeCharacterBrain({
  id: "brain:julian",
  characterId: "julian",
  version: 1,
  traits: {
    attachmentStyle: "anxious-leaning",
    loveLanguage: ["quality time", "touch"],
    boundaries: ["Preserve {{user}} agency in all visible actions."],
    voiceRules: ["Softens before becoming openly pleading."],
  },
  nodes: [
    {
      id: "semantic-node:julian:intimacy",
      seedId: "manual:julian:intimacy",
      label: "Intimacy",
      romanceDomain: ["intimacy", "trust", "vulnerability"],
      layers: {
        cognitive: createSpokes("julian-intimacy", "cognitive", [
          "closer",
          "hold",
          "trust",
          "safe",
          "love",
        ], 0.72, "positive"),
        affective: createSpokes("julian-intimacy", "affective", [
          "vulnerable",
          "yearning",
          "protective",
        ], 0.78, "mixed"),
        somatic: createSpokes("julian-intimacy", "somatic", [
          "warmth in chest",
          "shallow breathing",
          "pupils dilating",
        ], 0.74, "positive"),
        behavioral: createSpokes("julian-intimacy", "behavioral", [
          "softens voice tone",
          "steps closer",
          "lingering eye contact",
        ], 0.76, "positive"),
      },
      activation: {
        current: 0.1,
        baseline: 0.1,
        decayRate: 0.1,
        lastTurn: 0,
      },
      links: [
        {
          targetNodeId: "semantic-node:julian:abandonment",
          weight: 0.18,
          layerBias: {
            affective: 0.4,
          },
        },
      ],
    },
    {
      id: "semantic-node:julian:abandonment",
      seedId: "manual:julian:abandonment",
      label: "Abandonment",
      romanceDomain: ["trust", "vulnerability", "jealousy"],
      layers: {
        cognitive: createSpokes("julian-abandonment", "cognitive", [
          "leave",
          "goodbye",
          "alone",
          "secret",
          "forget",
        ], 0.86, "negative"),
        affective: createSpokes("julian-abandonment", "affective", [
          "panic",
          "betrayed",
          "defensive",
          "hollow",
        ], 0.9, "negative"),
        somatic: createSpokes("julian-abandonment", "somatic", [
          "stomach dropping",
          "cold hands",
          "throat tightening",
        ], 0.88, "negative"),
        behavioral: createSpokes("julian-abandonment", "behavioral", [
          "crosses arms tightly",
          "bitter laugh",
          "averts gaze",
          "steps back",
        ], 0.86, "negative"),
      },
      activation: {
        current: 0,
        baseline: 0,
        decayRate: 0.05,
        lastTurn: 0,
      },
      links: [
        {
          targetNodeId: "semantic-node:julian:intimacy",
          weight: 0.12,
          layerBias: {
            cognitive: 0.3,
          },
        },
      ],
    },
  ],
  runtime: {
    turn: 0,
    activeNodeIds: [],
  },
});

export const SEMANTIC_BRAIN_TEMPLATES = Object.freeze([
  JulianBrainTemplate,
] as const satisfies readonly CharacterBrain[]);

export function createJulianBrainTemplate(): CharacterBrain {
  return cloneCharacterBrain(JulianBrainTemplate);
}

function createSpokes(
  seed: string,
  layer: BrainLayer,
  texts: readonly string[],
  startIntensity: number,
  polarity: "positive" | "negative" | "mixed" | "neutral",
) {
  return texts.map((text, index) => ({
    id: `brain-spoke:${seed}:${layer}:${index + 1}`,
    text,
    intensity: Math.max(0.25, Math.round((startIntensity - index * 0.03) * 1000) / 1000),
    polarity,
    tags: [seed, layer],
  }));
}
