import assert from "node:assert/strict";
import test from "node:test";

import {
  BETRAYAL_PRESET_CATEGORIES,
  BETRAYAL_PRESETS,
  compileBetrayalPresetAdditions,
  findBetrayalPresetById,
  getBetrayalPresetsByCategory,
} from "../../data/betrayalPresets";

test("loads betrayal presets across all useful vocabulary lanes", () => {
  assert.equal(BETRAYAL_PRESETS.length, 167);
  assert.deepEqual(BETRAYAL_PRESET_CATEGORIES, [
    "Archetype",
    "Attachment Style",
    "Dialogue Seed",
    "Emotional Flavour",
    "Method",
    "Motivation",
    "Recovery Potential",
    "Romance Trope",
    "Severity",
  ]);

  const ids = BETRAYAL_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => id.startsWith("betrayal_")));
  assert.equal(
    getBetrayalPresetsByCategory("Method").find((preset) => preset.value === "gaslighting")?.id,
    "betrayal_method_gaslighting",
  );
});

test("removes pasted architecture notes and normalises risky betrayal wording", () => {
  const allText = JSON.stringify(BETRAYAL_PRESETS);
  const attachment = findBetrayalPresetById("betrayal_attachment_disorganised");
  const trope = findBetrayalPresetById("betrayal_trope_secret_fiance_or_fiancee");
  const method = findBetrayalPresetById("betrayal_method_coercion");

  assert.equal(attachment?.value, "disorganised");
  assert.equal(trope?.value, "secret fiance or fiancee");
  assert.match(method?.guidance ?? "", /consent, safety, and consequences/i);
  assert.match(method?.guidance ?? "", /not as instructions to violate player agency/i);
  assert.doesNotMatch(allText, /BetrayalProfile|PersonalityEngine|jealousy_weight|trust_gain_rate/i);
  assert.doesNotMatch(allText, /Use code with caution/i);
});

test("compiles betrayal presets as keyword and event-gated guidance", () => {
  const preset = findBetrayalPresetById("betrayal_archetype_the_reluctant_betrayer");
  assert.ok(preset);

  const additions = compileBetrayalPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Betrayal preset: Archetype - The Reluctant Betrayer/);
  assert.match(additions.personalityAddition, /Betrayal archetype texture/);
  assert.match(additions.systemPromptAddition, /Betrayal guidance/);
  assert.match(additions.systemPromptAddition, /keyword triggers and event gates as soft context/i);
  assert.match(additions.systemPromptAddition, /do not override player agency/i);
  assert.match(additions.systemPromptAddition, /do not reduce the character to betrayal-only behaviour/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force|critical|completely overwrite/i);
});
