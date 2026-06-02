import assert from "node:assert/strict";
import test from "node:test";

import {
  compileFlirtingPresetAdditions,
  findFlirtingPresetById,
  FLIRTING_PRESET_CATEGORIES,
  FLIRTING_PRESETS,
  getFlirtingPresetsByCategory,
} from "../../data/flirtingPresets";

test("loads flirting presets with stable unique ids and categories", () => {
  assert.equal(FLIRTING_PRESETS.length, 5);

  const ids = FLIRTING_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(FLIRTING_PRESET_CATEGORIES, [
    "Arrogant & Playful",
    "Charming & Attentive",
    "Gruff & Reluctant",
    "Seductive & Boundary-Crossing",
    "Subtle & Loaded",
  ]);
});

test("renames soductive typo to seductive without changing the category", () => {
  assert.equal(findFlirtingPresetById("flirt_soductive_boundary"), undefined);

  const seductive = must(findFlirtingPresetById("FLIRT_SEDUCTIVE_BOUNDARY"));
  assert.equal(seductive.id, "flirt_seductive_boundary");
  assert.equal(seductive.category, "Seductive & Boundary-Crossing");
  assert.equal(
    getFlirtingPresetsByCategory("seductive & boundary-crossing")[0]?.id,
    "flirt_seductive_boundary",
  );
});

test("keeps dark romance and consent-boundary vocabulary intact", () => {
  const seductive = must(findFlirtingPresetById("flirt_seductive_boundary"));
  const allText = [
    seductive.vibe,
    seductive.flirtingProfile.gazePacing,
    seductive.lexicalTokens.signatureVerbs.join(" "),
    seductive.lexicalTokens.descriptiveAdjectives.join(" "),
    seductive.lexicalTokens.romanticNouns.join(" "),
    seductive.systemPromptTags.join(" "),
  ].join(" ");

  assert.match(allText, /Predatory/i);
  assert.match(allText, /\bconsume\b/i);
  assert.match(allText, /\btrap\b/i);
  assert.match(allText, /\bsuffocating\b/i);
  assert.match(allText, /\bhelpless\b/i);
  assert.match(allText, /\bsurrender\b/i);
  assert.match(allText, /possessive border crossings/i);
});

test("compiles flirting presets as soft guidance with consent and agency framing", () => {
  const seductive = must(findFlirtingPresetById("flirt_seductive_boundary"));
  const additions = compileFlirtingPresetAdditions(seductive);

  assert.match(additions.personalityAddition, /Flirting style/);
  assert.match(additions.scenarioAddition, /Flirting physical tells may include/);
  assert.match(additions.systemPromptAddition, /soft romantic-tension guidance/i);
  assert.match(additions.systemPromptAddition, /consent, reciprocity, and player agency/i);
  assert.match(additions.systemPromptAddition, /dark romance, BDSM, or light humiliation/i);
  assert.match(additions.systemPromptAddition, /\bsuffocating\b/i);
});

function must<T>(value: T | undefined): T {
  assert.ok(value);
  return value;
}
