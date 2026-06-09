import assert from "node:assert/strict";
import test from "node:test";

import {
  compileOriginWoundPresetAdditions,
  compileOriginWoundPresetSummary,
  findOriginWoundVocabularyPresetById,
  getOriginWoundVocabularyPresetsByCategory,
  ORIGIN_WOUND_CATEGORIES,
  ORIGIN_WOUND_SEEDS,
  ORIGIN_WOUND_VOCABULARY_SEEDS,
  ORIGIN_WOUND_VOCABULARY_PRESETS,
} from "../../data/originWoundVocabularyPresets";
import type { WoundSeed } from "../../data/vocabularySeedTypes";

const EXPECTED_WOUND_SEED_KEYS = [
  "seed",
  "label",
  "description",
  "examples",
  "tags",
  "relatedSeeds",
  "oppositeSeeds",
  "romanceHooks",
  "scenarioHooks",
  "dialoguePatterns",
  "triggers",
  "defenseMechanisms",
  "attachmentEffects",
  "healingNeeds",
  "repairMethods",
  "growthArcs",
  "metadata",
].sort();

test("loads normalized origin wound presets with stable categories", () => {
  assert.equal(ORIGIN_WOUND_VOCABULARY_PRESETS.length, 5);

  const ids = ORIGIN_WOUND_VOCABULARY_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(ORIGIN_WOUND_CATEGORIES, [
    "Abandonment & Discard",
    "Betrayal & Treason",
    "Helplessness & Failure",
    "Objectification & Ledger",
    "Shame & Defilement",
  ]);
  assert.equal(
    getOriginWoundVocabularyPresetsByCategory("shame & defilement")[0]?.id,
    "wound_shame_defilement",
  );
});

test("exports wound-specific seeds with trauma routing fields", () => {
  const shame = must(
    ORIGIN_WOUND_SEEDS.find((seed) => seed.seed === "wound_shame_defilement"),
  );

  assert.equal(ORIGIN_WOUND_SEEDS.length, ORIGIN_WOUND_VOCABULARY_PRESETS.length);
  assertWoundSeedShape(shame);
  assert.equal(shame.metadata.category, "Shame & Defilement");
  assert.equal(shame.metadata.severity, "core");
  assert.equal(shame.metadata.angstValue, 8);
  assert.equal(shame.metadata.healingValue, 9);
  assert.ok(shame.triggers.includes("intimacy requested before trust is ready"));
  assert.ok(shame.defenseMechanisms.some((mechanism) => /Protective perimeter/.test(mechanism)));
  assert.ok(shame.attachmentEffects.includes("Needs choice over exposure, touch, and disclosure."));
  assert.ok(shame.healingNeeds.includes("Choice over disclosure"));
  assert.ok(shame.repairMethods.includes("Ask before looking or touching"));
  assert.ok(shame.growthArcs.includes("Stops reducing the self to the wound"));
});

test("adapts wound-specific seeds back into standardized vocabulary seeds", () => {
  const woundSeed = must(
    ORIGIN_WOUND_SEEDS.find((seed) => seed.seed === "wound_abandonment_discard"),
  );
  const vocabularySeed = must(
    ORIGIN_WOUND_VOCABULARY_SEEDS.find(
      (seed) => seed.seed === woundSeed.seed,
    ),
  );

  assert.equal(vocabularySeed.label, woundSeed.label);
  assert.equal(vocabularySeed.description, woundSeed.description);
  assert.deepEqual(vocabularySeed.examples, woundSeed.examples);
  assert.deepEqual(vocabularySeed.scenarioHooks, woundSeed.scenarioHooks);
  assert.equal(vocabularySeed.metadata.romanceValue, woundSeed.metadata.romanceValue);
  assert.equal(vocabularySeed.metadata.conflictPotential, woundSeed.metadata.angstValue);
});

test("renames and repairs malformed shame defilement preset", () => {
  const malformedId = findOriginWoundVocabularyPresetById("wound_shame_definement");
  const repaired = must(findOriginWoundVocabularyPresetById("WOUND_SHAME_DEFILEMENT"));

  assert.equal(malformedId, undefined);
  assert.equal(repaired.category, "Shame & Defilement");
  assert.match(repaired.woundProfile.coreWound, /changed, marked, contaminated/i);
  assert.ok(repaired.lexicalTokens.signatureVerbs.includes("flinch"));
  assert.ok(repaired.lexicalTokens.vulnerabilityNouns.includes("scar"));
  assert.match(repaired.sampleDialogueLine, /stay gentle/i);
});

test("compiles origin wound additions as soft guidance", () => {
  const abandonment = must(findOriginWoundVocabularyPresetById("wound_abandonment_discard"));
  const additions = compileOriginWoundPresetAdditions(abandonment);

  assert.match(additions.backgroundAddition, /Origin wound preset/);
  assert.match(additions.personalityAddition, /Defence pattern/);
  assert.match(additions.systemPromptAddition, /soft characterisation guidance/i);
  assert.match(additions.systemPromptAddition, /may surface when relevant/i);
  assert.match(additions.systemPromptAddition, /do not override player agency/i);
  assert.match(additions.systemPromptAddition, /avoid flattening the character into trauma-only behaviour/i);
});

test("keeps heated wound vocabulary while blocking code-dump artifacts", () => {
  const allText = ORIGIN_WOUND_VOCABULARY_PRESETS
    .map((preset) =>
      [
        compileOriginWoundPresetSummary(preset),
        compileOriginWoundPresetAdditions(preset).systemPromptAddition,
      ].join(" "),
    )
    .join(" ");
  assert.match(allText, /\bsmother/i);
  assert.match(allText, /\bcontaminated\b/i);
  assert.match(allText, /\babomination\b/i);
  assert.match(allText, /\bpollut/i);
});

function must<T>(value: T | undefined): T {
  assert.ok(value);
  return value;
}

function assertWoundSeedShape(seed: WoundSeed | undefined) {
  assert.ok(seed);
  assert.deepEqual(Object.keys(seed).sort(), EXPECTED_WOUND_SEED_KEYS);
  assert.deepEqual(Object.keys(seed.metadata).sort(), [
    "angstValue",
    "category",
    "healingValue",
    "romanceValue",
    "severity",
  ]);
}
