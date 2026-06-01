import assert from "node:assert/strict";
import test from "node:test";

import { findBodyBuildPresetById } from "../../data/bodyBuildPresets";
import { findColorPresetById } from "../../data/colorPresets";
import { findFacialFeaturePresetById } from "../../data/facialFeaturePresets";
import { findHeightStaturePresetById } from "../../data/heightStaturePresets";
import { findOutfitPresetById } from "../../data/outfitPresets";
import { findRelationshipDynamicPresetById } from "../../data/relationshipDynamicPresets";
import { findRomancePresetById } from "../../data/romancePresets";
import { findSkinPresetById } from "../../data/skinPresets";
import {
  compileCharacterPresetSelection,
  createDefaultCharacterPresetSelection,
  type CharacterPresetSelection,
} from "../../lib/character-card/characterPresetSelection";

function buildSelection(): CharacterPresetSelection {
  return {
    name: "Vesper Vance",
    romance: must(findRomancePresetById("rom_cont_grumpy_billionaire")),
    height: must(findHeightStaturePresetById("height_tower_lofty_giant")),
    build: must(findBodyBuildPresetById("build_ath_lean_wire")),
    face: must(findFacialFeaturePresetById("face_sharp_aristocrat")),
    eyeColor: must(findColorPresetById("eye_nat_molten_amber")),
    hairColor: must(findColorPresetById("hair_nat_raven_wing")),
    skin: must(findSkinPresetById("skin_cool_alabaster_porcelain")),
    outfit: must(findOutfitPresetById("outfit_formal_bespoke_power")),
    relationshipDynamic: must(findRelationshipDynamicPresetById("rival_acad_perfect_scores")),
  };
}

test("creates a default preset selection from the seed library", () => {
  const selection = createDefaultCharacterPresetSelection("Draft Character");

  assert.equal(selection.name, "Draft Character");
  assert.equal(selection.romance.id, "rom_cont_grumpy_billionaire");
  assert.equal(selection.relationshipDynamic.id, "dyn_grumpy_sunshine");
  assert.equal(selection.eyeColor.type, "Eyes");
  assert.equal(selection.hairColor.type, "Hair");
});

test("compiles preset selections into editable character form values", () => {
  const compiled = compileCharacterPresetSelection(buildSelection());

  assert.equal(compiled.formValues.fullName, "Vesper Vance");
  assert.match(compiled.formValues.height, /6'4"/);
  assert.match(compiled.formValues.description, /The Grumpy Billionaire/);
  assert.match(compiled.formValues.physicalAppearance, /Bespoke Power Tailoring/);
  assert.match(compiled.formValues.physicalAppearance, /Molten Amber/);
  assert.match(compiled.formValues.personalityPsychology, /Aloof, Controlling/);
  assert.match(compiled.formValues.relationshipsConnections, /Grumpy x Sunshine/);
  assert.match(compiled.formValues.relationshipsConnections, /Top of the Class/);
  assert.match(compiled.formValues.relationshipsConnections, /Cutthroat Intellect/);
  assert.match(compiled.formValues.relationshipsConnections, /dissect/);
  assert.match(compiled.formValues.scenario, /romance setup shaped by The Grumpy Billionaire/);
  assert.match(compiled.formValues.scenario, /active relationship dynamic is Top of the Class/);
});

test("compiles preset behavior tags without duplicates and preserves user agency", () => {
  const compiled = compileCharacterPresetSelection(buildSelection());

  assert.equal(new Set(compiled.systemPromptTags).size, compiled.systemPromptTags.length);
  assert.ok(compiled.systemPromptTags.includes("stoic dialogue"));
  assert.ok(compiled.systemPromptTags.includes("witty academic insults"));
  assert.ok(compiled.systemPromptTags.includes("staccato verbal friction"));
  assert.ok(compiled.systemPromptTags.includes("spatial crowding"));
  assert.ok(compiled.systemPromptTags.includes("adjusting tie knots under stress"));
  assert.match(compiled.formValues.system_prompt, /Never write \{\{user\}\}'s dialogue/);
  assert.match(compiled.formValues.system_prompt, /not as forced plot resolution/);
  assert.match(compiled.formValues.system_prompt, /Lexical guidance/);
  assert.match(compiled.formValues.first_mes, /leaves the next move entirely to \{\{user\}\}/);
});

test("compiles preset selections into image prompt outputs and tags", () => {
  const compiled = compileCharacterPresetSelection(buildSelection());

  assert.match(compiled.appearancePrompt.naturalLanguage, /Vesper Vance as The Grumpy Billionaire/);
  assert.match(compiled.appearancePrompt.tagStyle, /molten amber eyes/);
  assert.match(compiled.appearancePrompt.tagStyle, /bespoke power tailoring/);
  assert.match(compiled.formValues.tagsText, /Contemporary/);
  assert.match(compiled.formValues.tagsText, /High Status \/ Formal/);
  assert.match(compiled.formValues.tagsText, /rivalry/);
});

function must<T>(value: T | undefined): T {
  assert.ok(value);
  return value;
}
