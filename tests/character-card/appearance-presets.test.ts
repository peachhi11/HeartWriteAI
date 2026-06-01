import assert from "node:assert/strict";
import test from "node:test";

import {
  COLOR_PRESET_CATEGORIES,
  COLOR_PRESETS,
  findColorPresetById,
  getColorPresetsByCategory,
  getColorPresetsByType,
} from "../../data/colorPresets";
import {
  FACIAL_FEATURE_CATEGORIES,
  FACIAL_FEATURE_PRESETS,
  findFacialFeaturePresetById,
  getFacialFeaturePresetsByCategory,
} from "../../data/facialFeaturePresets";
import {
  findOutfitPresetById,
  getOutfitPresetsByCategory,
  OUTFIT_PRESET_CATEGORIES,
  OUTFIT_PRESETS,
} from "../../data/outfitPresets";
import {
  findSkinPresetById,
  getSkinPresetsByCategory,
  SKIN_PRESET_CATEGORIES,
  SKIN_PRESETS,
} from "../../data/skinPresets";

function assertUniqueIds(ids: readonly string[]) {
  assert.equal(new Set(ids).size, ids.length);
}

test("loads facial feature presets by category with stable ids", () => {
  assert.equal(FACIAL_FEATURE_PRESETS.length, 8);
  assertUniqueIds(FACIAL_FEATURE_PRESETS.map((preset) => preset.id));
  assert.deepEqual(FACIAL_FEATURE_CATEGORIES, [
    "Expressive & Intense",
    "Rugged & Weathered",
    "Sharp & Chiseled",
    "Soft & Ethereal",
  ]);

  assert.equal(getFacialFeaturePresetsByCategory("Sharp & Chiseled").length, 2);
  assert.equal(findFacialFeaturePresetById("FACE_SHARP_PREDATORY")?.vibe, "The Predatory Smirk");
  assert.match(
    findFacialFeaturePresetById("face_sharp_predatory")?.description ?? "",
    /fight-or-flight/,
  );
});

test("loads eye and hair color presets with swatch-safe hex values", () => {
  assert.equal(COLOR_PRESETS.length, 8);
  assertUniqueIds(COLOR_PRESETS.map((preset) => preset.id));
  assert.deepEqual(COLOR_PRESET_CATEGORIES, [
    "Natural Cool",
    "Natural Warm",
    "Sci-Fi Neon",
    "Supernatural/Eldritch",
  ]);

  assert.equal(getColorPresetsByType("Eyes").length, 4);
  assert.equal(getColorPresetsByType("Hair").length, 4);
  assert.equal(getColorPresetsByCategory("Sci-Fi Neon").length, 2);
  assert.match(findColorPresetById("hair_scifi_neon_fuchsia")?.hexValue ?? "", /^#[0-9A-F]{6}$/i);
});

test("loads skin presets with tone names, markings, and lookup helpers", () => {
  assert.equal(SKIN_PRESETS.length, 8);
  assertUniqueIds(SKIN_PRESETS.map((preset) => preset.id));
  assert.deepEqual(SKIN_PRESET_CATEGORIES, [
    "Human Cool",
    "Human Warm",
    "Sci-Fi/Alien",
    "Supernatural/Undead",
  ]);

  assert.equal(getSkinPresetsByCategory("Human Warm").length, 2);
  const androidSkin = findSkinPresetById("SKIN_SCIFI_SYNTH_SILICONE");
  assert.equal(androidSkin?.toneName, "Synthetic Pearl");
  assert.ok(androidSkin?.keyMarkings.some((marking) => /serial numbers/.test(marking)));
});

test("loads outfit presets and keeps normalized garment wording", () => {
  assert.equal(OUTFIT_PRESETS.length, 8);
  assertUniqueIds(OUTFIT_PRESETS.map((preset) => preset.id));
  assert.deepEqual(OUTFIT_PRESET_CATEGORIES, [
    "High Status / Formal",
    "Period / Fantasy",
    "Street / Functional",
    "Subcultural / Dark",
  ]);

  assert.equal(getOutfitPresetsByCategory("Street / Functional").length, 2);
  const techwear = findOutfitPresetById("OUTFIT_STREET_TECHWEAR");
  const scrapper = findOutfitPresetById("outfit_street_rugged_scrapper");

  assert.ok(techwear?.keyGarments.includes("Asymmetric drop-shoulder hoodie"));
  assert.ok(scrapper?.systemPromptTags.includes("heavy thudding boot steps"));
  assert.doesNotMatch(JSON.stringify([techwear, scrapper]), /Assymmetric|thudting/);
});
