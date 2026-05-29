import type { RomanceTropeClass } from "../../types/character-card/RomanceTropeClassification";
import { classifyTropeInput } from "./tropeMatcher";

export type TropeEvalData = {
  groundTruth: RomanceTropeClass;
  text: string;
};

export type TropeClassMetrics = {
  className: RomanceTropeClass;
  f1: number;
  falseNegative: number;
  falsePositive: number;
  precision: number;
  recall: number;
  truePositive: number;
};

export type TropeMacroEvaluationResult = {
  activeClassesCount: number;
  macroF1: number;
  metrics: TropeClassMetrics[];
};

export const DEFAULT_TROPE_EVALUATION_CLASSES: readonly RomanceTropeClass[] = [
  "antagonistic",
  "protective",
  "flustered",
  "yearning",
  "bantering",
  "recognized",
];

export const DEFAULT_TROPE_EVALUATION_CORPUS: readonly TropeEvalData[] = [
  { groundTruth: "antagonistic", text: "Get out of my face." },
  { groundTruth: "antagonistic", text: "I can't stand you." },
  { groundTruth: "antagonistic", text: "Move away from me." },
  { groundTruth: "protective", text: "Touch them and die." },
  { groundTruth: "flustered", text: "There is only one bed?" },
  { groundTruth: "yearning", text: "I spent years waiting for you." },
  { groundTruth: "bantering", text: "You wish you were that clever." },
  {
    groundTruth: "recognized",
    text: "The moment I met you, it felt like coming home.",
  },
];

export function executeTropeMacroEvaluation(
  evaluationCorpus: readonly TropeEvalData[] = DEFAULT_TROPE_EVALUATION_CORPUS,
  classes?: readonly RomanceTropeClass[],
): TropeMacroEvaluationResult {
  const resolvedClasses =
    classes ?? resolveEvaluationClasses(evaluationCorpus);
  const metrics = resolvedClasses
    .map((className) => calculateClassMetrics(className, evaluationCorpus))
    .filter((metric) =>
      evaluationCorpus.some(({ groundTruth, text }) => {
        const prediction = classifyTropeInput(text);

        return groundTruth === metric.className || prediction === metric.className;
      }),
    );

  const macroF1 =
    metrics.length === 0
      ? 0
      : metrics.reduce((sum, metric) => sum + metric.f1, 0) / metrics.length;

  return {
    activeClassesCount: metrics.length,
    macroF1,
    metrics,
  };
}

function resolveEvaluationClasses(
  evaluationCorpus: readonly TropeEvalData[],
): RomanceTropeClass[] {
  const classes = new Set<RomanceTropeClass>(
    DEFAULT_TROPE_EVALUATION_CLASSES,
  );

  for (const { groundTruth, text } of evaluationCorpus) {
    classes.add(groundTruth);
    classes.add(classifyTropeInput(text));
  }

  return Array.from(classes);
}

function calculateClassMetrics(
  className: RomanceTropeClass,
  evaluationCorpus: readonly TropeEvalData[],
): TropeClassMetrics {
  let truePositive = 0;
  let falsePositive = 0;
  let falseNegative = 0;

  for (const { groundTruth, text } of evaluationCorpus) {
    const prediction = classifyTropeInput(text);

    if (prediction === className && groundTruth === className) {
      truePositive += 1;
    }

    if (prediction === className && groundTruth !== className) {
      falsePositive += 1;
    }

    if (groundTruth === className && prediction !== className) {
      falseNegative += 1;
    }
  }

  const precision =
    truePositive + falsePositive === 0
      ? 0
      : truePositive / (truePositive + falsePositive);
  const recall =
    truePositive + falseNegative === 0
      ? 0
      : truePositive / (truePositive + falseNegative);
  const f1 =
    precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);

  return {
    className,
    f1,
    falseNegative,
    falsePositive,
    precision,
    recall,
    truePositive,
  };
}
