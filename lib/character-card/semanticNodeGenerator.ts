import {
  DEFAULT_LOCAL_EMBEDDING_DIMENSIONS,
  getLocalEmbedding,
  type GetLocalEmbeddingOptions,
} from "./localEmbeddingExtractor";
import type {
  MathBrainSpokes,
  SemanticMathNode,
} from "./semanticMathBrain";

export type SemanticBrainArchetypeSeed =
  | "coldness"
  | "obsession"
  | "vulnerability";

export type SemanticNodeEmbeddingProvider = (
  text: string,
  options?: GetLocalEmbeddingOptions,
) => Promise<readonly number[]>;

export interface AutoGenerateSemanticNodeOptions extends GetLocalEmbeddingOptions {
  embeddingProvider?: SemanticNodeEmbeddingProvider;
}

export const BRAIN_ARCHETYPE_DICTIONARY: Record<
  SemanticBrainArchetypeSeed,
  MathBrainSpokes
> = {
  coldness: {
    cognitive: ["distance", "self-protection", "control", "withheld trust"],
    affective: ["detached", "guarded", "resentful", "apprehensive"],
    somatic: ["slight chill", "stiff posture", "shallow breath"],
    behavioral: [
      "crosses arms tightly",
      "scoffs quietly",
      "answers in short sentences",
      "deliberately shifts gaze away",
    ],
  },
  obsession: {
    cognitive: ["fixation", "possession", "fear of loss", "exclusive focus"],
    affective: [
      "hyper-focused",
      "terrified of loss",
      "intense longing",
      "possessive",
    ],
    somatic: [
      "racing pulse",
      "flushed neck",
      "dry mouth",
      "hyper-awareness of touch",
    ],
    behavioral: [
      "leans in too close",
      "checks for signs of distance",
      "holds eye contact too long",
      "voice drops lower",
    ],
  },
  vulnerability: {
    cognitive: ["exposure", "hope", "risk", "trust hunger"],
    affective: ["exposed", "yearning", "anxious", "hopeful"],
    somatic: [
      "trembling hands",
      "knot in stomach",
      "warm cheeks",
      "fluttering heartbeat",
    ],
    behavioral: [
      "avoids long eye contact",
      "fidgets with clothes",
      "pauses mid-sentence",
      "speaks more quietly",
    ],
  },
};

export class SemanticNodeGenerator {
  static async autoGenerateNode(
    concept: string,
    archetypeSeed: SemanticBrainArchetypeSeed,
    options: AutoGenerateSemanticNodeOptions = {},
  ): Promise<SemanticMathNode> {
    const selectedSpokes = BRAIN_ARCHETYPE_DICTIONARY[archetypeSeed];
    const descriptiveContext = createSemanticNodeEmbeddingText(
      concept,
      selectedSpokes,
    );
    const embeddingProvider = options.embeddingProvider ?? getLocalEmbedding;
    const compiledVector = await embeddingProvider(descriptiveContext, options);

    return {
      concept: concept.trim(),
      embedding: Array.from(compiledVector),
      weight: inferArchetypeWeight(archetypeSeed),
      decayRate: inferArchetypeDecayRate(archetypeSeed),
      sensitivityThreshold: 0.42,
      spokes: selectedSpokes,
    };
  }
}

export function createSemanticNodeEmbeddingText(
  concept: string,
  spokes: MathBrainSpokes,
): string {
  return [
    `Concept: ${concept.trim()}.`,
    spokes.cognitive && spokes.cognitive.length > 0
      ? `Cognitive associations: ${spokes.cognitive.join(", ")}.`
      : "",
    `Feeling: ${spokes.affective.join(", ")}.`,
    `Somatic cues: ${spokes.somatic.join(", ")}.`,
    `Behavioral expression: ${spokes.behavioral.join(", ")}.`,
  ].filter(Boolean).join(" ");
}

export function isLikelyMiniLmEmbedding(embedding: readonly number[]): boolean {
  return embedding.length === DEFAULT_LOCAL_EMBEDDING_DIMENSIONS;
}

function inferArchetypeWeight(seed: SemanticBrainArchetypeSeed): number {
  if (seed === "obsession") {
    return 0.9;
  }

  return seed === "vulnerability" ? 0.78 : 0.7;
}

function inferArchetypeDecayRate(seed: SemanticBrainArchetypeSeed): number {
  if (seed === "coldness") {
    return 0.04;
  }

  return seed === "obsession" ? 0.1 : 0.12;
}
