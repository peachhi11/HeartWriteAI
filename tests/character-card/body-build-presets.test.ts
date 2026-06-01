import assert from "node:assert/strict";
import test from "node:test";

import {
  BODY_BUILD_CATEGORIES,
  BODY_BUILD_PRESETS,
  findBodyBuildPresetById,
  getBodyBuildPresetsByCategory,
} from "../../data/bodyBuildPresets";

test("loads body build and physique presets with unique ids", () => {
  assert.equal(BODY_BUILD_PRESETS.length, 8);

  const ids = BODY_BUILD_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => id.startsWith("build_")));
});

test("groups body build presets by physique category", () => {
  assert.deepEqual(BODY_BUILD_CATEGORIES, [
    "Athletic",
    "Imposing",
    "Slender",
    "Soft & Curvy",
  ]);

  assert.equal(getBodyBuildPresetsByCategory("athletic").length, 2);
  assert.equal(getBodyBuildPresetsByCategory("Soft & Curvy").length, 2);
  assert.equal(getBodyBuildPresetsByCategory("missing").length, 0);
});

test("exposes stable build preset lookup data for UI seed chips", () => {
  const preset = findBodyBuildPresetById("BUILD_ATH_LEAN_WIRE");

  assert.equal(preset?.vibe, "The Wired Acrobat");
  assert.ok(preset?.personalityInfluence.includes("Disciplined"));
  assert.ok(preset?.systemPromptTags.includes("cat-like reflexes"));
});

test("keeps normalized imposing build wording ready for prompt assembly", () => {
  const preset = findBodyBuildPresetById("build_imp_tank_brawler");

  assert.equal(preset?.category, "Imposing");
  assert.ok(preset?.dynamics.includes("Human Mattress Comfort"));
  assert.doesNotMatch(JSON.stringify(preset), /Mattrass|Discipled/);
});
