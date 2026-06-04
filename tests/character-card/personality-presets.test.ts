import assert from "node:assert/strict";
import test from "node:test";

import {
  PERSONALITY_PRESET_CATEGORIES,
  PERSONALITY_PRESETS,
  compilePersonalityPresetAdditions,
  findPersonalityPresetById,
  getPersonalityPresetsByCategory,
} from "../../data/personalityPresets";

test("loads personality presets across trait, romance, gate, and dialogue lanes", () => {
  assert.equal(PERSONALITY_PRESETS.length, 280);
  assert.deepEqual(PERSONALITY_PRESET_CATEGORIES, [
    "Archetype",
    "Dialogue Seed",
    "Gate",
    "High-Value Seed",
    "Personality",
    "Romance Hook",
    "Strength",
    "Trait Category",
    "Weakness",
  ]);

  const ids = PERSONALITY_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getPersonalityPresetsByCategory("Archetype").length, 20);
  assert.equal(getPersonalityPresetsByCategory("Personality").length, 120);
  assert.equal(getPersonalityPresetsByCategory("Trait Category").length, 20);
  assert.equal(getPersonalityPresetsByCategory("Strength").length, 20);
  assert.equal(getPersonalityPresetsByCategory("Weakness").length, 20);
  assert.equal(getPersonalityPresetsByCategory("Romance Hook").length, 20);
  assert.equal(getPersonalityPresetsByCategory("Gate").length, 20);
  assert.equal(getPersonalityPresetsByCategory("Dialogue Seed").length, 20);
  assert.equal(getPersonalityPresetsByCategory("High-Value Seed").length, 20);
});

test("normalises personality values for visible prompt text", () => {
  const greyProtector = findPersonalityPresetById(
    "personality_archetype_the_morally_grey_protector",
  );
  const dryWit = findPersonalityPresetById("personality_seed_dry_wit");
  const softOnlyForUser = findPersonalityPresetById(
    "personality_seed_soft_only_for_user",
  );
  const truthGate = findPersonalityPresetById("personality_gate_first_user_sees_truth_gate");

  assert.equal(greyProtector?.value, "The Morally Grey Protector");
  assert.equal(dryWit?.value, "dry wit");
  assert.equal(softOnlyForUser?.value, "soft only for {{user}}");
  assert.equal(truthGate?.value, "first {{user}} sees truth gate");

  const visibleText = PERSONALITY_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.doesNotMatch(
    visibleText,
    /Use code with caution|morally gray|dry_humor|flirtatious|humor_trait|soft only for user|first user sees truth|apologizes|apologize|force prose|SYSTEM PROTOCOL/i,
  );
});

test("compiles personality presets as soft growth-aware context", () => {
  const preset = findPersonalityPresetById(
    "personality_romance_grump_softens_only_for_user",
  );
  assert.ok(preset);

  const additions = compilePersonalityPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Personality context/);
  assert.match(additions.personalityAddition, /without replacing the character's full self/i);
  assert.match(additions.systemPromptAddition, /soft personality context/i);
  assert.match(additions.systemPromptAddition, /\{\{user\}\} agency intact/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("keeps personality weaknesses as repairable pressure rather than identity lock", () => {
  const possessivenessRisk = findPersonalityPresetById("personality_weakness_possessiveness_risk");
  const slowToApologise = findPersonalityPresetById("personality_weakness_slow_to_apologise");
  assert.ok(possessivenessRisk);
  assert.ok(slowToApologise);

  assert.match(possessivenessRisk.guidance, /accountability, repair, boundaries, or growth/i);
  assert.match(slowToApologise.value, /apologise/);
});
