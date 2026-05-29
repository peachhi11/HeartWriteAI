import { executeTropeMacroEvaluation } from "../lib/character-card/tropeMacroEvaluation";
import { generateMockTropeDataset } from "../lib/character-card/tropeMockGenerator";

const liveSyntheticDataset = generateMockTropeDataset(
  {
    antagonistic: 500,
    bantering: 350,
    protective: 80,
    flustered: 50,
    yearning: 15,
    recognized: 5,
  },
  { seed: 20260529 },
);

const result = executeTropeMacroEvaluation(liveSyntheticDataset);

console.log(
  `Generated ${liveSyntheticDataset.length} deterministic player mock strings for macro performance stress-tests.`,
);
console.log("");

for (const metric of result.metrics) {
  console.log(
    `Class [${metric.className}] -> Precision: ${metric.precision.toFixed(
      2,
    )}, Recall: ${metric.recall.toFixed(2)}, F1: ${metric.f1.toFixed(2)}`,
  );
}

console.log("\n======================================");
console.log(
  `OVERALL ENGINE MACRO-AVERAGED F1 SCORE: ${(
    result.macroF1 * 100
  ).toFixed(1)}%`,
);
console.log("======================================");
