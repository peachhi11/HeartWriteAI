import assert from "node:assert/strict";
import test from "node:test";

import {
  RIVALRY_PRESET_CATEGORIES,
  RIVALRY_PRESETS,
  compileRivalryPresetAdditions,
  compileRivalryPresetSummary,
  findRivalryPresetById,
  getRivalryPresetsByCategory,
} from "../../data/rivalryPresets";

test("loads rivalry presets across competition, respect, and partnership lanes", () => {
  assert.equal(RIVALRY_PRESETS.length, 250);
  assert.deepEqual(RIVALRY_PRESET_CATEGORIES, [
    "Aftermath Route",
    "Archetype",
    "Behaviour",
    "Dialogue Seed",
    "Emotional Flavour",
    "Gate",
    "Method",
    "Motivation",
    "Rivalry Type",
    "Romance Trope",
    "Trigger Event",
    "Wound",
  ]);

  assert.equal(getRivalryPresetsByCategory("archetype").length, 20);
  assert.equal(getRivalryPresetsByCategory("behaviour").length, 25);
  assert.equal(getRivalryPresetsByCategory("trigger event").length, 25);
});

test("normalises readable rivalry values and risk routes", () => {
  const proudRival = findRivalryPresetById("rivalry_archetype_the_proud_rival");
  const honourableOpponent = findRivalryPresetById(
    "rivalry_archetype_the_honourable_opponent",
  );
  const mentorFavourite = findRivalryPresetById(
    "rivalry_type_mentor_favourite_rivalry",
  );
  const toxicRiskRoute = findRivalryPresetById(
    "rivalry_aftermath_toxic_competition_risk_route",
  );

  assert.equal(proudRival?.label, "The Proud Rival");
  assert.equal(honourableOpponent?.value, "The Honourable Opponent");
  assert.equal(mentorFavourite?.value, "mentor favourite rivalry");
  assert.equal(toxicRiskRoute?.value, "toxic competition risk route");

  const readableText = JSON.stringify(
    RIVALRY_PRESETS.map((preset) => ({
      category: preset.category,
      label: preset.label,
      value: preset.value,
      guidance: preset.guidance,
    })),
  );
  assert.doesNotMatch(readableText, /Use code with caution/i);
  assert.doesNotMatch(readableText, /toxic_rivalry_route|toxic_competition_route/i);
  assert.doesNotMatch(readableText, /mentor_favorite/i);
});

test("compiles rivalry presets as soft competition and respect guidance", () => {
  const preset = findRivalryPresetById("rivalry_archetype_the_proud_rival");
  assert.ok(preset);

  const summary = compileRivalryPresetSummary(preset);
  const additions = compileRivalryPresetAdditions(preset);

  assert.match(summary, /Rivalry preset: Archetype - The Proud Rival/);
  assert.match(additions.relationshipAddition, /do not make winning more important/i);
  assert.match(additions.personalityAddition, /only when relevant/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /player agency/i);
  assert.match(additions.systemPromptAddition, /mutual respect over winning/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force|override/i);
});
