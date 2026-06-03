import assert from "node:assert/strict";
import test from "node:test";

import {
  compileDarkObsessivePresetAdditions,
  compileDarkObsessivePresetSummary,
  DARK_OBSESSIVE_PRESET_CATEGORIES,
  DARK_OBSESSIVE_PRESETS,
  findDarkObsessivePresetById,
  getDarkObsessivePresetsByCategory,
} from "../../data/darkObsessivePresets";

test("loads dark/obsessive presets across attachment and boundary lanes", () => {
  assert.equal(DARK_OBSESSIVE_PRESETS.length, 240);
  assert.deepEqual(DARK_OBSESSIVE_PRESET_CATEGORIES, [
    "Aftermath Route",
    "Archetype",
    "Behaviour",
    "Dialogue Seed",
    "Dynamic Type",
    "Emotional Flavour",
    "Gate",
    "Method",
    "Motivation",
    "Romance Trope",
    "Trigger Event",
    "Wound",
  ]);

  assert.equal(getDarkObsessivePresetsByCategory("archetype").length, 20);
  assert.equal(getDarkObsessivePresetsByCategory("dialogue seed").length, 20);
});

test("normalises readable dark/obsessive values and AU spelling", () => {
  const redFlag = findDarkObsessivePresetById(
    "dark_obsessive_archetype_the_beautiful_red_flag",
  );
  const morallyGrey = findDarkObsessivePresetById(
    "dark_obsessive_archetype_the_morally_grey_devotee",
  );
  const memorises = findDarkObsessivePresetById(
    "dark_obsessive_behaviour_memorises_user_preferences",
  );
  const centre = findDarkObsessivePresetById(
    "dark_obsessive_dialogue_you_became_the_centre_of_everything_before_i_knew_how_to_stop_it",
  );

  assert.equal(redFlag?.label, "The Beautiful Red Flag");
  assert.equal(morallyGrey?.value, "The Morally Grey Devotee");
  assert.equal(memorises?.value, "memorises user preferences");
  assert.equal(
    centre?.value,
    "You became the centre of everything before I knew how to stop it.",
  );

  const readableText = JSON.stringify(
    DARK_OBSESSIVE_PRESETS.map((preset) => ({
      category: preset.category,
      label: preset.label,
      value: preset.value,
      guidance: preset.guidance,
    })),
  );
  assert.doesNotMatch(readableText, /Use code with caution/i);
  assert.doesNotMatch(
    readableText,
    /morally gray|idealization|memorizes|center of everything|savior/i,
  );
});

test("compiles dark/obsessive presets as soft dark-romance guidance", () => {
  const preset = findDarkObsessivePresetById(
    "dark_obsessive_archetype_the_possessive_protector",
  );
  assert.ok(preset);

  const summary = compileDarkObsessivePresetSummary(preset);
  const additions = compileDarkObsessivePresetAdditions(preset);

  assert.match(summary, /Dark\/obsessive preset: Archetype - The Possessive Protector/);
  assert.match(additions.relationshipAddition, /do not use obsession to erase consent/i);
  assert.match(additions.personalityAddition, /only when relevant/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /de-escalate or refuse/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force|override/i);
});
