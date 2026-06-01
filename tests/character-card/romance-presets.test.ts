import assert from "node:assert/strict";
import test from "node:test";

import {
  ALL_ROMANCE_PRESETS,
  findRomancePresetById,
  getRomancePresetsByCategory,
  ROMANCE_PRESET_CATEGORIES,
} from "../../data/romancePresets";

test("loads a complete romance preset seed library with unique ids", () => {
  assert.equal(ALL_ROMANCE_PRESETS.length, 25);

  const ids = ALL_ROMANCE_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => id.startsWith("rom_")));
});

test("groups romance presets by major genre category", () => {
  assert.deepEqual(ROMANCE_PRESET_CATEGORIES, [
    "Contemporary",
    "Dark Romance",
    "Fantasy",
    "Historical",
    "Paranormal",
    "Sci-Fi",
  ]);

  assert.equal(getRomancePresetsByCategory("contemporary").length, 8);
  assert.equal(getRomancePresetsByCategory("Dark Romance").length, 3);
  assert.equal(getRomancePresetsByCategory("missing").length, 0);
});

test("exposes stable preset lookups for UI seed cards", () => {
  const preset = findRomancePresetById("ROM_CONT_GRUMPY_BILLIONAIRE");

  assert.equal(preset?.vibe, "The Grumpy Billionaire");
  assert.equal(preset?.tailwindTheme.accentColor, "text-amber-500");
  assert.ok(preset?.dynamics.includes("Grumpy x Sunshine"));
});

test("keeps forbidden professor preset clearly adult scoped", () => {
  const preset = findRomancePresetById("rom_cont_forbidden_professor");

  assert.ok(preset?.dynamics.includes("Professor x Adult Student"));
  assert.equal(
    preset?.dynamics.some((dynamic) => dynamic === "Teacher x Student"),
    false,
  );
});
