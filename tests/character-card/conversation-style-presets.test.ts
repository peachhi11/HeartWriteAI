import assert from "node:assert/strict";
import test from "node:test";

import {
  compileConversationStylePresetAdditions,
  compileConversationStylePresetSummary,
  CONVERSATION_STYLE_PRESET_CATEGORIES,
  CONVERSATION_STYLE_PRESETS,
  findConversationStylePresetById,
  getConversationStylePresetsByCategory,
} from "../../data/conversationStylePresets";

test("loads conversation style presets across flow, depth, romance, and wound lanes", () => {
  assert.equal(CONVERSATION_STYLE_PRESETS.length, 176);
  assert.deepEqual(CONVERSATION_STYLE_PRESET_CATEGORIES, [
    "Archetype",
    "Conversation Style",
    "Depth",
    "Dialogue Seed",
    "Flow",
    "Gate",
    "Romance",
    "Wound",
  ]);

  const ids = CONVERSATION_STYLE_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => id.startsWith("conversation_")));
  assert.equal(getConversationStylePresetsByCategory("archetype").length, 20);
  assert.equal(
    getConversationStylePresetsByCategory("conversation style").length,
    40,
  );
  assert.equal(getConversationStylePresetsByCategory("flow").length, 20);
  assert.equal(getConversationStylePresetsByCategory("depth").length, 20);
  assert.equal(getConversationStylePresetsByCategory("romance").length, 20);
  assert.equal(getConversationStylePresetsByCategory("wound").length, 20);
  assert.equal(getConversationStylePresetsByCategory("gate").length, 16);
  assert.equal(getConversationStylePresetsByCategory("dialogue seed").length, 20);
});

test("normalises conversation values and keeps user-facing lines readable", () => {
  const allText = JSON.stringify(CONVERSATION_STYLE_PRESETS);
  const valueText = CONVERSATION_STYLE_PRESETS.map((preset) => preset.value).join(
    "\n",
  );
  const archetype = findConversationStylePresetById(
    "conversation_archetype_the_quiet_listener",
  );
  const style = findConversationStylePresetById(
    "conversation_style_summarises_feelings",
  );
  const rememberedUser = findConversationStylePresetById(
    "conversation_romance_remembers_everything_user_says",
  );
  const asksUser = findConversationStylePresetById(
    "conversation_romance_asks_about_user_s_day",
  );
  const dialogue = findConversationStylePresetById(
    "conversation_dialogue_we_can_sit_in_silence_if_talking_is_too_much",
  );

  assert.equal(archetype?.value, "The Quiet Listener");
  assert.equal(style?.value, "summarises feelings");
  assert.equal(rememberedUser?.value, "remembers everything {{user}} says");
  assert.equal(asksUser?.value, "asks about {{user}}'s day");
  assert.equal(
    dialogue?.value,
    "We can sit in silence if talking is too much.",
  );
  assert.doesNotMatch(allText, /Use code with caution/i);
  assert.doesNotMatch(valueText, /summarizes/i);
});

test("compiles conversation style presets as soft boundary-aware guidance", () => {
  const preset = findConversationStylePresetById(
    "conversation_archetype_the_thoughtful_questioner",
  );
  assert.ok(preset);

  const summary = compileConversationStylePresetSummary(preset);
  const additions = compileConversationStylePresetAdditions(preset);

  assert.match(
    summary,
    /Conversation style preset: Archetype - The Thoughtful Questioner/,
  );
  assert.match(additions.personalityAddition, /soft personality texture/i);
  assert.match(additions.relationshipAddition, /mutual curiosity/i);
  assert.match(additions.systemPromptAddition, /soft context only/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /\{\{user\}\} agency/i);
  assert.match(additions.systemPromptAddition, /conversational boundaries/i);
  assert.doesNotMatch(
    additions.systemPromptAddition,
    /must|force|critical|completely overwrite/i,
  );
});
