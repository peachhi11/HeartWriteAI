import assert from "node:assert/strict";
import test from "node:test";

import { findBodyBuildPresetById } from "../../data/bodyBuildPresets";
import { findColorPresetById } from "../../data/colorPresets";
import { findFacialFeaturePresetById } from "../../data/facialFeaturePresets";
import { findFlirtingPresetById } from "../../data/flirtingPresets";
import { findHeightStaturePresetById } from "../../data/heightStaturePresets";
import { findOriginWoundVocabularyPresetById } from "../../data/originWoundVocabularyPresets";
import { findOutfitPresetById } from "../../data/outfitPresets";
import { findRelationshipDynamicPresetById } from "../../data/relationshipDynamicPresets";
import { findRomancePresetById } from "../../data/romancePresets";
import { findSkinPresetById } from "../../data/skinPresets";
import { findSpeechStylePresetById } from "../../data/speechStylePresets";
import { findVoiceVocabularyPresetById } from "../../data/voiceVocabularyPresets";
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

test("maps optional speech presets into editable voice guidance", () => {
  const compiled = compileCharacterPresetSelection({
    ...buildSelection(),
    speechStyle: must(findSpeechStylePresetById("speech_elite_aristocrat")),
    voiceVocabulary: must(findVoiceVocabularyPresetById("voice_crisp_angular_rival")),
  });

  assert.match(compiled.formValues.speechStyle, /Speech preset: Cold Aristocrat/);
  assert.match(compiled.formValues.speechStyle, /Mapped speech engine: Velvet_Formal/);
  assert.match(compiled.formValues.speechStyle, /Voice vocabulary preset: Academic Rival/);
  assert.match(compiled.formValues.speechStyle, /Signature voice verbs: dissect, counter/);
  assert.match(compiled.formValues.tagsText, /Elite & Controlled/);
  assert.match(compiled.formValues.tagsText, /Cold Aristocrat \/ Corporate Suit/);
  assert.match(compiled.formValues.tagsText, /Crisp & Angular/);
  assert.match(compiled.formValues.tagsText, /Academic Rival \/ Cold Aristocrat/);
  assert.ok(compiled.systemPromptTags.includes("controlled elite diction"));
  assert.ok(compiled.systemPromptTags.includes("formal address discipline"));
  assert.ok(compiled.systemPromptTags.includes("crisp angular voice texture"));
});

test("maps optional flirting and origin wound presets into editable guidance", () => {
  const compiled = compileCharacterPresetSelection({
    ...buildSelection(),
    flirtingStyle: must(findFlirtingPresetById("flirt_seductive_boundary")),
    originWound: must(findOriginWoundVocabularyPresetById("wound_shame_defilement")),
  });

  assert.match(compiled.formValues.backgroundStory, /Origin wound preset: Outcast Beast/);
  assert.match(compiled.formValues.backgroundStory, /contaminated/);
  assert.match(compiled.formValues.personalityPsychology, /Origin wound behavior texture/);
  assert.match(compiled.formValues.relationshipsConnections, /Flirting style: The Possessive Vampire/);
  assert.match(compiled.formValues.relationshipsConnections, /Proximity Encroachment/);
  assert.match(compiled.formValues.scenario, /Flirting physical tells may include/);
  assert.match(compiled.formValues.system_prompt, /soft romantic-tension guidance/i);
  assert.match(compiled.formValues.system_prompt, /soft characterization guidance/i);
  assert.match(compiled.formValues.system_prompt, /do not override player agency/i);
  assert.match(compiled.formValues.tagsText, /Seductive & Boundary-Crossing/);
  assert.match(compiled.formValues.tagsText, /Shame & Defilement/);
  assert.ok(compiled.systemPromptTags.includes("possessive border crossings"));
  assert.ok(compiled.systemPromptTags.includes("shame-aware touch boundaries"));
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
