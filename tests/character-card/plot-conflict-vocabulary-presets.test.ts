import assert from "node:assert/strict";
import test from "node:test";

import {
  PLOT_CONFLICT_CONCEPT_SEEDS,
  PLOT_CONFLICT_VOCABULARY_STANDARD_SEEDS,
  compilePlotConflictConceptSeed,
  findPlotConflictConceptSeedBySeed,
  getPlotConflictConceptSeedsByCategory,
  plotConflictCategories,
  plotConflictPresets,
  plotConflictSemanticChain,
  plotConflictSourceSummary,
} from "../../data/plotConflictVocabularyPresets";
import {
  compileStandardVocabularySeedPrompt,
  findStandardVocabularySeedBySeed,
  searchStandardVocabularySeeds,
} from "../../data/standardVocabularySeedRegistry";
import { findSemanticSeedGraphNodeById } from "../../data/semanticSeedRegistry";

const OUTDATED_SOURCE_LANGUAGE =
  /\binferior race\b|\bsuperior race\b|\binferior person\b|\bsuperior person\b|\bladies\b|wealthy and aristocratic/i;

test("mines Plotto conflicts into modern purpose-obstacle-pressure concepts", () => {
  assert.equal(plotConflictSourceSummary.inspectedConflictCount, 1462);
  assert.equal(
    plotConflictSourceSummary.adaptationPolicy.includes("Do not preserve outdated"),
    true,
  );
  assert.deepEqual(plotConflictSemanticChain, [
    "purpose",
    "obstacle",
    "pressure",
    "choice",
    "consequence",
    "repair",
    "payoff",
  ]);
  assert.equal(PLOT_CONFLICT_CONCEPT_SEEDS.length, 31);
  assert.equal(plotConflictPresets.length, PLOT_CONFLICT_CONCEPT_SEEDS.length);

  const seedIds = PLOT_CONFLICT_CONCEPT_SEEDS.map((seed) => seed.seed);
  assert.equal(new Set(seedIds).size, seedIds.length);
});

test("keeps plot conflict categories queryable and complete", () => {
  assert.deepEqual(Object.keys(plotConflictCategories).sort(), [
    "betrayal",
    "coercive_pressure",
    "duty",
    "family_pressure",
    "longing",
    "misrecognition",
    "prejudice",
    "repair",
    "resource_pressure",
    "revenge",
    "rivalry",
    "separation",
    "social_pressure",
    "survival",
    "temptation",
  ]);

  assert.equal(
    getPlotConflictConceptSeedsByCategory("misrecognition").some(
      (seed) => seed.seed === "ambiguous_evidence_wrong_conclusion",
    ),
    true,
  );
  assert.equal(
    getPlotConflictConceptSeedsByCategory("prejudice").some(
      (seed) => seed.seed === "structural_prejudice_barrier",
    ),
    true,
  );
});

test("keeps conflict 270 as a modernized missed-chance route, not copied source prose", () => {
  const seed = findPlotConflictConceptSeedBySeed(
    "secret_pining_after_missed_chance",
  );
  assert.ok(seed);
  assert.deepEqual(seed.sourceConflictIds, ["270"]);
  assert.equal(seed.category, "longing");
  assert.match(seed.description, /privately loves someone/i);
  assert.equal(seed.antiPatterns.includes("self_erasure_as_romance"), true);
  assert.equal(seed.antiPatterns.includes("suffering_as_proof_of_love"), true);

  const compiled = compilePlotConflictConceptSeed(seed);
  assert.match(compiled, /Purpose: To preserve love without demanding possession/);
  assert.match(compiled, /Obstacle:/);
  assert.match(compiled, /Avoid: self_erasure_as_romance/);
  assert.doesNotMatch(compiled, OUTDATED_SOURCE_LANGUAGE);
});

test("flags sensitive source adaptations without carrying discriminatory framing forward", () => {
  const sensitiveSeeds = PLOT_CONFLICT_CONCEPT_SEEDS.filter(
    (seed) => seed.metadata.modernizationReview === "sensitive_source",
  );
  const structuralPrejudice = findPlotConflictConceptSeedBySeed(
    "structural_prejudice_barrier",
  );
  const serializedSeeds = JSON.stringify(PLOT_CONFLICT_CONCEPT_SEEDS);

  assert.equal(sensitiveSeeds.length >= 1, true);
  assert.ok(structuralPrejudice);
  assert.equal(structuralPrejudice.tags.includes("review_required"), true);
  assert.match(structuralPrejudice.description, /prejudiced social order/i);
  assert.equal(
    structuralPrejudice.antiPatterns.includes("prejudice_as_romantic_obstacle_only"),
    true,
  );
  assert.doesNotMatch(serializedSeeds, OUTDATED_SOURCE_LANGUAGE);
});

test("standardizes plot conflicts for registry search and prompt routing", () => {
  assert.equal(
    PLOT_CONFLICT_VOCABULARY_STANDARD_SEEDS.length,
    PLOT_CONFLICT_CONCEPT_SEEDS.length,
  );

  const missedChance = findStandardVocabularySeedBySeed(
    "plot-conflict-vocabulary:secret_pining_after_missed_chance",
  );
  const statusResults = searchStandardVocabularySeeds("pretending to belong", {
    sourceIds: ["plot-conflict-vocabulary"],
    limit: 3,
  });

  assert.equal(missedChance?.label, "Secret Pining After Missed Chance");
  assert.equal(missedChance?.tags.includes("plot-conflict-vocabulary"), true);
  assert.equal(statusResults[0]?.label, "Status Gap Mask");
  assert.match(
    compileStandardVocabularySeedPrompt(must(missedChance)),
    /Use as concise, optional routing prose/,
  );
});

test("projects plot conflict vocabulary into the semantic graph as route nodes", () => {
  const graphNode = findSemanticSeedGraphNodeById(
    "plot-conflict-vocabulary:secret_pining_after_missed_chance",
  );

  assert.equal(graphNode?.category, "routes");
  assert.equal(graphNode?.tags.includes("standard_vocabulary"), true);
  assert.equal(
    graphNode?.sourceRegistryKeys?.includes(
      "plot-conflict-vocabulary:secret_pining_after_missed_chance",
    ),
    true,
  );
  assert.match(graphNode?.description ?? "", /moved into another life/);
});

function must<T>(value: T | undefined): T {
  assert.ok(value);
  return value;
}
