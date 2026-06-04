import assert from "node:assert/strict";
import test from "node:test";

import {
  LIKES_DISLIKES_PRESET_CATEGORIES,
  LIKES_DISLIKES_PRESETS,
  compileLikesDislikesPresetAdditions,
  findLikesDislikesPresetById,
  getLikesDislikesPresetsByCategory,
} from "../../data/likesDislikesPresets";

test("loads likes and dislikes presets across preference, sensory, romance, gate, and dialogue lanes", () => {
  assert.equal(LIKES_DISLIKES_PRESETS.length, 260);
  assert.deepEqual(LIKES_DISLIKES_PRESET_CATEGORIES, [
    "Archetype",
    "Dialogue Seed",
    "Dislike",
    "Gate",
    "High-Value Seed",
    "Like",
    "Romance Dislike",
    "Romance Like",
    "Sensory Dislike",
    "Sensory Like",
  ]);

  const ids = LIKES_DISLIKES_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getLikesDislikesPresetsByCategory("Like").length, 58);
  assert.equal(getLikesDislikesPresetsByCategory("Dislike").length, 50);
  assert.equal(getLikesDislikesPresetsByCategory("Dialogue Seed").length, 17);
  assert.equal(getLikesDislikesPresetsByCategory("High-Value Seed").length, 20);
});

test("normalises likes and dislikes values for visible prompt text", () => {
  const cosy = findLikesDislikesPresetById("likes_dislikes_archetype_the_cosy_romantic");
  const userRemembers = findLikesDislikesPresetById(
    "likes_dislikes_gate_first_user_remembers_like_gate",
  );
  const userRespects = findLikesDislikesPresetById(
    "likes_dislikes_gate_first_user_respects_dislike_gate",
  );
  const highValueUser = findLikesDislikesPresetById(
    "likes_dislikes_high_value_user_remembers_like_gate",
  );
  const visibleText = LIKES_DISLIKES_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.equal(cosy?.value, "The Cosy Romantic");
  assert.equal(userRemembers?.value, "first {{user}} remembers like gate");
  assert.equal(userRespects?.value, "first {{user}} respects dislike gate");
  assert.equal(highValueUser?.value, "{{user}} remembers like gate");
  assert.doesNotMatch(
    visibleText,
    /Use code with caution|cozy|first user remembers|first user respects|user_remembers_like_gate|force prose|SYSTEM PROTOCOL/i,
  );
});

test("compiles likes and dislikes presets as soft boundary-aware context", () => {
  const preset = findLikesDislikesPresetById(
    "likes_dislikes_romance_dislike_being_saved_without_consent",
  );
  assert.ok(preset);

  const additions = compileLikesDislikesPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Likes and dislikes context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft likes and dislikes context/i);
  assert.match(additions.systemPromptAddition, /disliked things should be respected/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("keeps sensory dislikes and romance dislikes framed as limits", () => {
  const sensory = findLikesDislikesPresetById(
    "likes_dislikes_sensory_dislike_touch_when_startled",
  );
  const romance = findLikesDislikesPresetById(
    "likes_dislikes_romance_dislike_control_disguised_as_care",
  );
  assert.ok(sensory);
  assert.ok(romance);

  assert.match(sensory.guidance, /boundaries, and grounding/i);
  assert.match(romance.guidance, /consent, trust, privacy, pacing/i);
});
