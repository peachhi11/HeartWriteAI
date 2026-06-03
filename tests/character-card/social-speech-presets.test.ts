import assert from "node:assert/strict";
import test from "node:test";

import {
  compileSocialSpeechPresetAdditions,
  compileSocialSpeechPresetSummary,
  findSocialSpeechPresetById,
  getSocialSpeechPresetsByCategory,
  SOCIAL_SPEECH_PRESET_CATEGORIES,
  SOCIAL_SPEECH_PRESETS,
} from "../../data/socialSpeechPresets";

test("loads social speech presets across public voice and social pressure lanes", () => {
  assert.equal(SOCIAL_SPEECH_PRESETS.length, 207);
  assert.deepEqual(SOCIAL_SPEECH_PRESET_CATEGORIES, [
    "Archetype",
    "Context",
    "Dialogue Seed",
    "Gate",
    "Power",
    "Romance",
    "Social Speech",
    "Wound",
  ]);

  const ids = SOCIAL_SPEECH_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => id.startsWith("social_speech")));
  assert.equal(getSocialSpeechPresetsByCategory("archetype").length, 20);
  assert.equal(getSocialSpeechPresetsByCategory("social speech").length, 70);
  assert.equal(getSocialSpeechPresetsByCategory("context").length, 20);
  assert.equal(getSocialSpeechPresetsByCategory("power").length, 20);
  assert.equal(getSocialSpeechPresetsByCategory("romance").length, 20);
  assert.equal(getSocialSpeechPresetsByCategory("wound").length, 20);
  assert.equal(getSocialSpeechPresetsByCategory("gate").length, 17);
  assert.equal(getSocialSpeechPresetsByCategory("dialogue seed").length, 20);
});

test("normalises social speech values and keeps user-facing cues readable", () => {
  const allText = JSON.stringify(SOCIAL_SPEECH_PRESETS);
  const valueText = SOCIAL_SPEECH_PRESETS.map((preset) => preset.value).join("\n");
  const archetype = findSocialSpeechPresetById(
    "social_speech_archetype_the_charismatic_speaker",
  );
  const armour = findSocialSpeechPresetById(
    "social_speech_context_uses_charm_as_armour",
  );
  const humour = findSocialSpeechPresetById(
    "social_speech_context_uses_humour_as_bridge",
  );
  const defence = findSocialSpeechPresetById(
    "social_speech_gate_first_public_defence_gate",
  );
  const userClose = findSocialSpeechPresetById(
    "social_speech_keeps_user_close",
  );
  const romance = findSocialSpeechPresetById(
    "social_speech_romance_makes_user_feel_chosen",
  );
  const dialogue = findSocialSpeechPresetById(
    "social_speech_dialogue_i_speak_softer_when_something_matters",
  );

  assert.equal(archetype?.value, "The Charismatic Speaker");
  assert.equal(armour?.value, "uses charm as armour");
  assert.equal(humour?.value, "uses humour as bridge");
  assert.equal(defence?.value, "first public defence gate");
  assert.equal(userClose?.value, "keeps {{user}} close");
  assert.equal(romance?.value, "makes {{user}} feel chosen");
  assert.equal(dialogue?.value, "I speak softer when something matters.");
  assert.doesNotMatch(allText, /Use code with caution/i);
  assert.doesNotMatch(valueText, /armor|humor|defense/i);
});

test("compiles social speech presets as soft audience-aware guidance", () => {
  const preset = findSocialSpeechPresetById(
    "social_speech_archetype_the_professional_mask",
  );
  assert.ok(preset);

  const summary = compileSocialSpeechPresetSummary(preset);
  const additions = compileSocialSpeechPresetAdditions(preset);

  assert.match(
    summary,
    /Social speech preset: Archetype - The Professional Mask/,
  );
  assert.match(additions.speechStyleAddition, /soft speech texture/i);
  assert.match(additions.relationshipAddition, /public performance drops/i);
  assert.match(additions.systemPromptAddition, /soft context only/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /\{\{user\}\} agency/i);
  assert.match(additions.systemPromptAddition, /conversational boundaries/i);
  assert.doesNotMatch(
    additions.systemPromptAddition,
    /must|force|critical|completely overwrite/i,
  );
});
