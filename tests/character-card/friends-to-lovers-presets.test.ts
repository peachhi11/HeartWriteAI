import assert from "node:assert/strict";
import test from "node:test";

import {
  FRIENDS_TO_LOVERS_PRESET_CATEGORIES,
  FRIENDS_TO_LOVERS_PRESETS,
  compileFriendsToLoversPresetAdditions,
  findFriendsToLoversPresetById,
  getFriendsToLoversPresetsByCategory,
} from "../../data/friendsToLoversPresets";

test("loads friends-to-lovers presets across friendship transition lanes", () => {
  assert.equal(FRIENDS_TO_LOVERS_PRESETS.length, 247);
  assert.deepEqual(FRIENDS_TO_LOVERS_PRESET_CATEGORIES, [
    "Aftermath Route",
    "Archetype",
    "Behaviour",
    "Dialogue Seed",
    "Emotional Flavour",
    "Friendship Type",
    "Gate",
    "Method",
    "Motivation",
    "Romance Trope",
    "Trigger Event",
    "Wound",
  ]);

  const ids = FRIENDS_TO_LOVERS_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => id.startsWith("friends_to_lovers_")));
  assert.equal(
    getFriendsToLoversPresetsByCategory("Behaviour").find(
      (preset) => preset.value === "avoids labelling feelings",
    )?.id,
    "friends_to_lovers_behaviour_avoids_labelling_feelings",
  );
});

test("normalises readable friends-to-lovers values and keeps proximity consent-aware", () => {
  const allText = JSON.stringify(FRIENDS_TO_LOVERS_PRESETS);
  const valueText = FRIENDS_TO_LOVERS_PRESETS.map((preset) => preset.value).join("\n");
  const method = findFriendsToLoversPresetById(
    "friends_to_lovers_method_boundary_crossing",
  );
  const type = findFriendsToLoversPresetById(
    "friends_to_lovers_type_co_worker_friends",
  );
  const trope = findFriendsToLoversPresetById(
    "friends_to_lovers_trope_wedding_date_realisation",
  );

  assert.equal(method?.value, "boundary crossing");
  assert.match(method?.guidance ?? "", /consent-aware/i);
  assert.match(method?.guidance ?? "", /never require \{\{user\}\} to reciprocate/i);
  assert.equal(type?.value, "co-worker friends");
  assert.equal(trope?.value, "wedding date realisation");
  assert.doesNotMatch(allText, /Use code with caution/i);
  assert.doesNotMatch(
    valueText,
    /childhood_friends|coworker_friends|realization|labeling|one_bed_best_friends|almost_lost_you_realization/i,
  );
});

test("compiles friends-to-lovers presets as soft transition guidance", () => {
  const preset = findFriendsToLoversPresetById(
    "friends_to_lovers_archetype_the_childhood_best_friend",
  );
  assert.ok(preset);

  const additions = compileFriendsToLoversPresetAdditions(preset);

  assert.match(
    additions.relationshipAddition,
    /Friends-to-lovers preset: Archetype - The Childhood Best Friend/,
  );
  assert.match(additions.personalityAddition, /Friends-to-lovers archetype texture/);
  assert.match(additions.systemPromptAddition, /Friends-to-lovers guidance/);
  assert.match(additions.systemPromptAddition, /soft friendship-to-romance context/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /player agency/i);
  assert.doesNotMatch(
    additions.systemPromptAddition,
    /must|force|critical|completely overwrite/i,
  );
});
