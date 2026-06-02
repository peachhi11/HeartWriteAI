import assert from "node:assert/strict";
import test from "node:test";

import {
  findRelationshipDynamicPresetById,
  getRelationshipDynamicPresetsByMode,
  RELATIONSHIP_DYNAMIC_MODES,
  RELATIONSHIP_DYNAMIC_PRESETS,
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

test("keeps every dynamic compiler-friendly with non-empty behavior arrays", () => {
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
  assert.match(secondChance?.safetyBoundary ?? "", /changed behavior/i);
  assert.match(workplace?.safetyBoundary ?? "", /adults/i);
  assert.match(workplace?.safetyBoundary ?? "", /coercion/i);
});
