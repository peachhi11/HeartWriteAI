import assert from "node:assert/strict";
import test from "node:test";

import {
  TOUCH_STARVED_HEALING_PRESET_CATEGORIES,
  TOUCH_STARVED_HEALING_PRESETS,
  compileTouchStarvedHealingPresetAdditions,
  findTouchStarvedHealingPresetById,
  getTouchStarvedHealingPresetsByCategory,
} from "../../data/touchStarvedHealingPresets";

test("loads touch-starved healing presets across boundary and comfort lanes", () => {
  assert.equal(TOUCH_STARVED_HEALING_PRESETS.length, 245);
  assert.deepEqual(TOUCH_STARVED_HEALING_PRESET_CATEGORIES, [
    "Aftermath Route",
    "Archetype",
    "Behaviour",
    "Conflict",
    "Core Seed",
    "Dialogue Seed",
    "Event Gate",
    "High-Value Touch Healing Tag",
    "Romance Hook",
    "Wound",
  ]);

  const ids = TOUCH_STARVED_HEALING_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getTouchStarvedHealingPresetsByCategory("Core Seed").length, 60);
  assert.equal(getTouchStarvedHealingPresetsByCategory("Dialogue Seed").length, 25);
});

test("normalises touch-starved healing values and keeps boundaries visible", () => {
  const userHook = findTouchStarvedHealingPresetById(
    "touch_starved_healing_hook_first_time_they_ask_user_to_stay",
  );
  const apology = findTouchStarvedHealingPresetById(
    "touch_starved_healing_behaviour_apologises_for_needing_comfort",
  );
  const visibleText = JSON.stringify(
    TOUCH_STARVED_HEALING_PRESETS.map((preset) => ({
      label: preset.label,
      value: preset.value,
      guidance: preset.guidance,
    })),
  );

  assert.equal(userHook?.value, "first time they ask {{user}} to stay");
  assert.equal(apology?.value, "apologises for needing comfort");
  assert.match(userHook?.guidance ?? "", /consent/i);
  assert.doesNotMatch(
    visibleText,
    /Use code with caution|weaponized|apologizes|first_time_they_ask_user/i,
  );
});

test("compiles touch-starved healing as consent-aware pacing guidance", () => {
  const preset = findTouchStarvedHealingPresetById(
    "touch_starved_healing_seed_asks_before_touching",
  );
  assert.ok(preset);

  const additions = compileTouchStarvedHealingPresetAdditions(preset);

  assert.match(additions.relationshipAddition, /asks before touching/i);
  assert.match(additions.systemPromptAddition, /soft relationship context/i);
  assert.match(additions.systemPromptAddition, /asked for, offered, accepted, declined, or repaired/i);
  assert.match(additions.systemPromptAddition, /preserve boundaries and \{\{user\}\} autonomy/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});
