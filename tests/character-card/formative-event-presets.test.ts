import assert from "node:assert/strict";
import test from "node:test";

import {
  compileFormativeEventPresetAdditions,
  findFormativeEventPresetById,
  FORMATIVE_EVENT_CATEGORIES,
  FORMATIVE_EVENT_PRESETS,
  getFormativeEventPresetsByCategory,
} from "../../data/formativeEventPresets";

test("loads formative event presets with stable ids and categories", () => {
  assert.equal(FORMATIVE_EVENT_PRESETS.length, 4);
  assert.deepEqual(FORMATIVE_EVENT_CATEGORIES, [
    "Dark Romance/Noir",
    "Fantasy/Mythic",
    "Historical/Period",
    "Sci-Fi/Cyberpunk",
  ]);

  const ids = FORMATIVE_EVENT_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => id.startsWith("event_")));
  assert.equal(
    getFormativeEventPresetsByCategory("Fantasy/Mythic")[0]?.id,
    "event_fant_blade_shattering",
  );
});

test("removes pasted boilerplate and fixes obvious typos", () => {
  const allText = JSON.stringify(FORMATIVE_EVENT_PRESETS);
  const noir = findFormativeEventPresetById("event_dark_first_execution");
  const scifi = findFormativeEventPresetById("event_scifi_sentience_overload");
  const fantasy = findFormativeEventPresetById("event_fant_blade_shattering");

  assert.ok(noir?.lexicalTokens.transformativeVerbs.includes("launder"));
  assert.ok(scifi?.lexicalTokens.scarringAdjectives.includes("sedentary"));
  assert.ok(fantasy?.lexicalTokens.historicalNouns.includes("bloodline"));
  assert.match(fantasy?.lexicalTokens.flashbackDirectives ?? "", /catastrophic coup/i);
  assert.doesNotMatch(allText, /FormalityEventPreset/);
  assert.doesNotMatch(allText, /CATASTROPHIC COUPE/i);
  assert.doesNotMatch(allText, /\blunder\b/);
  assert.doesNotMatch(allText, /must force|Force background|Replicate this structural/i);
});

test("compiles formative events as soft backstory guidance", () => {
  const preset = findFormativeEventPresetById("event_hist_forced_betrothal");
  assert.ok(preset);

  const additions = compileFormativeEventPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Formative event preset/);
  assert.match(additions.personalityAddition, /Formative event behaviour texture/);
  assert.match(additions.systemPromptAddition, /Formative event guidance/);
  assert.match(additions.systemPromptAddition, /soft backstory guidance/i);
  assert.match(additions.systemPromptAddition, /do not override player agency/i);
  assert.match(additions.systemPromptAddition, /avoid reducing the character to one historical event/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must adjust|force|replicate/i);
});
