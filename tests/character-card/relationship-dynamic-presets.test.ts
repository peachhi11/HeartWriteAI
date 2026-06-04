import assert from "node:assert/strict";
import test from "node:test";

import {
  compileRelationshipDynamicSeedPresetAdditions,
  findRelationshipDynamicPresetById,
  findRelationshipDynamicSeedPresetById,
  getRelationshipDynamicPresetsByMode,
  getRelationshipDynamicSeedPresetsByCategory,
  RELATIONSHIP_DYNAMIC_MODES,
  RELATIONSHIP_DYNAMIC_PRESETS,
  RELATIONSHIP_DYNAMIC_SEED_PRESET_CATEGORIES,
  RELATIONSHIP_DYNAMIC_SEED_PRESETS,
} from "../../data/relationshipDynamicPresets";

test("loads one consolidated relationship dynamic seed library", () => {
  assert.equal(RELATIONSHIP_DYNAMIC_PRESETS.length, 53);

  const ids = RELATIONSHIP_DYNAMIC_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.includes("dyn_grumpy_sunshine"));
  assert.ok(ids.includes("fric_taboo_asymmetric_guilt"));
  assert.ok(ids.includes("obsess_eldritch_symbiosis"));
  assert.ok(ids.includes("flaw_soma_sensory_overload"));
  assert.ok(ids.includes("dyn_friends_to_lovers"));
  assert.ok(ids.includes("dyn_fated_reincarnation"));
  assert.ok(ids.includes("dyn_second_chance"));
  assert.ok(ids.includes("dyn_workplace_boss"));
});

test("groups relationship dynamic presets by normalized mode", () => {
  assert.deepEqual(RELATIONSHIP_DYNAMIC_MODES, [
    "arranged",
    "caretaker",
    "complement",
    "devotion",
    "fake-dating",
    "fated-reincarnation",
    "flaw-secret",
    "forbidden",
    "friction",
    "friends-to-lovers",
    "obsession",
    "rivalry",
    "second-chance",
    "secret",
    "slow-burn",
    "workplace-hierarchy",
  ]);

  assert.equal(getRelationshipDynamicPresetsByMode("complement").length, 5);
  assert.equal(getRelationshipDynamicPresetsByMode("friction").length, 4);
  assert.equal(getRelationshipDynamicPresetsByMode("obsession").length, 4);
  assert.equal(getRelationshipDynamicPresetsByMode("friends-to-lovers").length, 1);
  assert.equal(getRelationshipDynamicPresetsByMode("second-chance").length, 1);
  assert.equal(getRelationshipDynamicPresetsByMode("missing").length, 0);
});

test("fixes malformed friction attachment into a valid adult-scoped preset", () => {
  const preset = findRelationshipDynamicPresetById("FRIC_TABOO_ASYMMETRIC_GUILT");

  assert.equal(preset?.mode, "friction");
  assert.equal(preset?.category, "Taboo Power");
  assert.match(preset?.safetyBoundary ?? "", /adults/i);
  assert.match(preset?.safetyBoundary ?? "", /consent/i);
  assert.match(preset?.safetyBoundary ?? "", /walk away/i);
});

test("normalizes dark dynamics with explicit privacy, consent, and autonomy boundaries", () => {
  const surveillance = findRelationshipDynamicPresetById("obsess_surveillance_collector");
  const bunker = findRelationshipDynamicPresetById("obsess_possessive_bunker");
  const guardian = findRelationshipDynamicPresetById("dyn_stalker_target");

  assert.match(surveillance?.safetyBoundary ?? "", /privacy/i);
  assert.match(surveillance?.safetyBoundary ?? "", /informed consent/i);
  assert.match(bunker?.safetyBoundary ?? "", /voluntary/i);
  assert.match(bunker?.safetyBoundary ?? "", /reversible/i);
  assert.match(guardian?.safetyBoundary ?? "", /boundaries/i);
  assert.match(guardian?.safetyBoundary ?? "", /active consent/i);
});

test("keeps every dynamic compiler-friendly with non-empty behaviour arrays", () => {
  for (const preset of RELATIONSHIP_DYNAMIC_PRESETS) {
    assert.ok(preset.vibe.trim(), preset.id);
    assert.ok(preset.characterARole.trim(), preset.id);
    assert.ok(preset.characterBRole.trim(), preset.id);
    assert.ok(preset.premise.trim(), preset.id);
    assert.ok(preset.pressure.trim(), preset.id);
    assert.ok(preset.safetyBoundary.trim(), preset.id);
    assert.ok(preset.characterABehaviors.length >= 3, preset.id);
    assert.ok(preset.characterBBehaviors.length >= 3, preset.id);
    assert.ok(preset.progressionCues.length >= 3, preset.id);
    assert.ok(preset.systemPromptTags.length >= 4, preset.id);
  }
});

test("normalizes final expansion dynamics with consent and accountability boundaries", () => {
  const fated = findRelationshipDynamicPresetById("dyn_fated_reincarnation");
  const secondChance = findRelationshipDynamicPresetById("dyn_second_chance");
  const workplace = findRelationshipDynamicPresetById("dyn_workplace_boss");

  assert.match(fated?.safetyBoundary ?? "", /agency/i);
  assert.match(fated?.safetyBoundary ?? "", /right to refuse/i);
  assert.match(secondChance?.safetyBoundary ?? "", /accountability/i);
  assert.match(secondChance?.safetyBoundary ?? "", /changed behaviour/i);
  assert.match(workplace?.safetyBoundary ?? "", /adults/i);
  assert.match(workplace?.safetyBoundary ?? "", /coercion/i);
});

test("loads relationship dynamic vocabulary seed lane with unique ids", () => {
  assert.equal(RELATIONSHIP_DYNAMIC_SEED_PRESETS.length, 212);

  const ids = RELATIONSHIP_DYNAMIC_SEED_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => id.startsWith("rel_dynamic_")));
});

test("groups relationship dynamic vocabulary seeds by safe category", () => {
  assert.deepEqual(RELATIONSHIP_DYNAMIC_SEED_PRESET_CATEGORIES, [
    "Archetype",
    "Attachment",
    "Dialogue Seed",
    "Dynamic",
    "Gate",
    "High-Value Seed",
    "Power",
    "Romance Hook",
    "Tension",
  ]);

  assert.equal(getRelationshipDynamicSeedPresetsByCategory("Archetype").length, 20);
  assert.equal(getRelationshipDynamicSeedPresetsByCategory("Dynamic").length, 50);
  assert.equal(getRelationshipDynamicSeedPresetsByCategory("Tension").length, 20);
  assert.equal(getRelationshipDynamicSeedPresetsByCategory("Power").length, 20);
  assert.equal(getRelationshipDynamicSeedPresetsByCategory("Attachment").length, 20);
  assert.equal(getRelationshipDynamicSeedPresetsByCategory("Romance Hook").length, 20);
  assert.equal(getRelationshipDynamicSeedPresetsByCategory("Gate").length, 20);
  assert.equal(getRelationshipDynamicSeedPresetsByCategory("Dialogue Seed").length, 22);
  assert.equal(getRelationshipDynamicSeedPresetsByCategory("High-Value Seed").length, 20);
});

test("normalizes relationship dynamic seed wording and spelling", () => {
  const tension = findRelationshipDynamicSeedPresetById(
    "rel_dynamic_tension_same_wound_different_defences",
  );
  const highValue = findRelationshipDynamicSeedPresetById(
    "rel_dynamic_high_value_seed_same_wound_different_defences",
  );
  const combinedText = RELATIONSHIP_DYNAMIC_SEED_PRESETS.map((preset) => preset.value).join(" ");

  assert.equal(tension?.label, "same wound different defences");
  assert.equal(highValue?.value, "same_wound_different_defences");
  assert.doesNotMatch(combinedText, /defense|defenses|Use code with caution/i);
});

test("compiles relationship dynamic seed additions as optional guidance", () => {
  const preset = findRelationshipDynamicSeedPresetById("rel_dynamic_dynamic_grumpy_sunshine");
  assert.ok(preset);

  const compiled = compileRelationshipDynamicSeedPresetAdditions(preset);
  const combinedText = [
    compiled.scenarioAddition,
    compiled.relationshipAddition,
    compiled.systemPromptAddition,
  ].join(" ");

  assert.match(combinedText, /optional relationship-dynamic guidance/);
  assert.match(combinedText, /preserving consent, boundaries, and both characters' agency/);
  assert.match(combinedText, /negotiated, and reversible/);
  assert.doesNotMatch(combinedText, /must|force|override|SYSTEM PROTOCOL/i);
});
