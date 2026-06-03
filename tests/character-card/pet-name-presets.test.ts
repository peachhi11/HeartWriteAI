import assert from "node:assert/strict";
import test from "node:test";

import {
  compilePetNamePresetAdditions,
  findPetNamePresetById,
  PET_NAME_PRESET_CATEGORIES,
  PET_NAME_PRESETS,
} from "../../data/petNamePresets";

test("loads pet name presets with stable ids and categories", () => {
  assert.equal(PET_NAME_PRESETS.length, 6);

  const ids = PET_NAME_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(PET_NAME_PRESET_CATEGORIES, [
    "Archaic/Formal Titles",
    "Gruff/Reluctant",
    "Playful/Casual",
    "Possessive/Dominant",
    "Reverent/Devotional",
    "Strictly Banned",
  ]);
});

test("repairs malformed strict banned object and removes code-dump artifact", () => {
  const banned = must(findPetNamePresetById("pet_strictly_banned"));
  const allText = PET_NAME_PRESETS.map((preset) => JSON.stringify(preset)).join(" ");

  assert.equal(banned.endearmentProfile.frequencyScale, "Absolute Zero");
  assert.match(banned.lexicalTokens.authorizedEndearments.join(" "), /NONE/);
  assert.doesNotMatch(allText, new RegExp(["Use", "code", "with", "caution"].join(" "), "i"));
});

test("removes duplicate chief but preserves dark and bdsm-adjacent terms", () => {
  const playful = must(findPetNamePresetById("pet_playful_casual"));
  const possessive = must(findPetNamePresetById("pet_possessive_dominant"));

  assert.equal(
    playful.lexicalTokens.authorizedEndearments.filter((name) => name === "chief").length,
    1,
  );
  assert.ok(possessive.lexicalTokens.authorizedEndearments.includes("good girl"));
  assert.ok(possessive.lexicalTokens.authorizedEndearments.includes("mine"));
  assert.ok(possessive.lexicalTokens.sensoryAdjectives.includes("captive"));
  assert.ok(possessive.lexicalTokens.contextNouns.includes("surrender"));
});

test("compiles pet names as consent and agency framed guidance", () => {
  const possessive = must(findPetNamePresetById("pet_possessive_dominant"));
  const additions = compilePetNamePresetAdditions(possessive);

  assert.match(additions.speechStyleAddition, /good girl/);
  assert.match(additions.systemPromptAddition, /optional endearment guidance/i);
  assert.match(additions.systemPromptAddition, /consent, reciprocity, boundaries, and player agency/i);
  assert.doesNotMatch(additions.systemPromptAddition, /penalize|must adjust/i);
});

function must<T>(value: T | undefined): T {
  assert.ok(value);
  return value;
}
