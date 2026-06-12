import { VectorMath } from "./vectorMath";

export interface MathBrainSpokes {
  cognitive?: readonly string[];
  affective: readonly string[];
  somatic: readonly string[];
  behavioral: readonly string[];
}

export interface SemanticMathNode {
  concept: string;
  embedding: readonly number[];
  weight: number;
  decayRate: number;
  sensitivityThreshold: number;
  spokes: MathBrainSpokes;
  sourceSeedId?: string;
}

export interface VectorCharacterBrain {
  name: string;
  currentState: Record<string, number>;
  nodes: readonly SemanticMathNode[];
}

export interface SemanticMathBrainMatch {
  concept: string;
  similarity: number;
  activationBoost: number;
}

export interface SemanticMathBrainInputResult {
  brain: VectorCharacterBrain;
  matchedConcepts: readonly string[];
  matches: readonly SemanticMathBrainMatch[];
}

export interface SemanticMathBrainPromptOptions {
  activationThreshold?: number;
  header?: string;
  includeAgencyReminder?: boolean;
  maxCuesPerLayer?: number;
}

const DEFAULT_ACTIVATION_THRESHOLD = 30;
const DEFAULT_MAX_CUES_PER_LAYER = 8;

export class SemanticMathBrainService {
  static processVectorInput(
    userEmbedding: readonly number[],
    brain: VectorCharacterBrain,
  ): VectorCharacterBrain {
    return this.evaluateVectorInput(userEmbedding, brain).brain;
  }

  static evaluateVectorInput(
    userEmbedding: readonly number[],
    brain: VectorCharacterBrain,
  ): SemanticMathBrainInputResult {
    const nextState = { ...brain.currentState };
    const matches: SemanticMathBrainMatch[] = [];

    for (const node of brain.nodes) {
      validateSemanticMathNode(node);

      const currentValue = nextState[node.concept] ?? 0;
      nextState[node.concept] = clampActivation(
        currentValue * (1 - node.decayRate),
      );

      const similarity = VectorMath.cosineSimilarity(
        userEmbedding,
        node.embedding,
      );

      if (similarity < node.sensitivityThreshold) {
        continue;
      }

      const intensityFactor =
        (similarity - node.sensitivityThreshold) /
        (1 - node.sensitivityThreshold);
      const activationBoost = clampActivation(intensityFactor * node.weight * 60);
      nextState[node.concept] = clampActivation(
        (nextState[node.concept] ?? 0) + activationBoost,
      );
      matches.push({
        concept: node.concept,
        similarity: roundNumber(similarity),
        activationBoost,
      });
    }

    return {
      brain: {
        ...brain,
        currentState: nextState,
      },
      matchedConcepts: uniqueText(matches.map((match) => match.concept)),
      matches,
    };
  }

  static generatePromptContext(
    brain: VectorCharacterBrain,
    options: SemanticMathBrainPromptOptions = {},
  ): string {
    const activationThreshold =
      options.activationThreshold ?? DEFAULT_ACTIVATION_THRESHOLD;
    const maxCuesPerLayer = options.maxCuesPerLayer ?? DEFAULT_MAX_CUES_PER_LAYER;
    const activeNodes = brain.nodes.filter(
      (node) => (brain.currentState[node.concept] ?? 0) >= activationThreshold,
    );

    if (activeNodes.length === 0) {
      return "";
    }

    const header =
      options.header ?? `Current semantic vector state for ${brain.name}`;
    const cognitive = collectLayerCues(activeNodes, "cognitive", maxCuesPerLayer);
    const affective = collectLayerCues(activeNodes, "affective", maxCuesPerLayer);
    const somatic = collectLayerCues(activeNodes, "somatic", maxCuesPerLayer);
    const behavioral = collectLayerCues(activeNodes, "behavioral", maxCuesPerLayer);
    const agencyReminder =
      options.includeAgencyReminder === false
        ? ""
        : "Use as soft internal state guidance only; let active vector cues shape subtext, pacing, body language, and dialogue choices without naming the system state. Preserve player agency, authored boundaries, and character dimensionality.";

    return [
      header,
      ...activeNodes.map((node) =>
        `- ${node.concept} is active (${Math.round(brain.currentState[node.concept] ?? 0)}%).`,
      ),
      cognitive.length > 0 ? `Cognitive associations: ${cognitive.join(", ")}.` : "",
      affective.length > 0 ? `Affective texture: ${affective.join(", ")}.` : "",
      somatic.length > 0 ? `Embodied cues available: ${somatic.join(", ")}.` : "",
      behavioral.length > 0 ? `Behavioral cues available: ${behavioral.join(", ")}.` : "",
      agencyReminder,
    ].filter(Boolean).join("\n");
  }
}

function validateSemanticMathNode(node: SemanticMathNode): void {
  if (node.sensitivityThreshold < 0 || node.sensitivityThreshold >= 1) {
    throw new Error("Sensitivity threshold must be between 0 and 1.");
  }

  if (node.decayRate < 0 || node.decayRate > 1) {
    throw new Error("Decay rate must be between 0 and 1.");
  }
}

function collectLayerCues(
  nodes: readonly SemanticMathNode[],
  layer: keyof MathBrainSpokes,
  limit: number,
): readonly string[] {
  return uniqueText(nodes.flatMap((node) => node.spokes[layer] ?? []))
    .filter(isPromptSafeCue)
    .slice(0, limit);
}

function clampActivation(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return roundNumber(Math.max(0, Math.min(100, value)));
}

function roundNumber(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function isPromptSafeCue(value: string): boolean {
  const trimmed = value.trim();
  return (
    !trimmed.includes(":") &&
    !trimmed.includes("__") &&
    !/standard_vocabulary/i.test(trimmed) &&
    !/^[a-z0-9]+(?:[_-][a-z0-9]+)+$/.test(trimmed)
  );
}

function uniqueText(values: readonly (string | undefined)[]): readonly string[] {
  return Array.from(new Set(values.filter((value): value is string =>
    value !== undefined && value.trim().length > 0,
  )));
}
