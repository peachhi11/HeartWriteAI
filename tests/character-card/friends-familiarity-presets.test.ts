import assert from "node:assert/strict";
import test from "node:test";

import {
  FRIENDS_FAMILIARITY_PRESET_CATEGORIES,
  FRIENDS_FAMILIARITY_PRESETS,
  compileFriendsFamiliarityPresetAdditions,
  compileFriendsFamiliarityPresetSummary,
  findFriendsFamiliarityPresetById,
  getFriendsFamiliarityPresetsByCategory,
} from "../../data/friendsFamiliarityPresets";

test("loads friends familiarity presets across history, pining, and formula lanes", () => {
  assert.equal(FRIENDS_FAMILIARITY_PRESETS.length, 264);
  assert.deepEqual(FRIENDS_FAMILIARITY_PRESET_CATEGORIES, [
    "Conflict Source",
    "Core Dynamic",
    "Dialogue Seed",
    "Emotional Dynamic",
    "Event Gate",
    "Familiar Behaviour",
    "Familiarity Level",
    "Generator Formula",
    "Hidden Romance",
    "High-Value Romance Tag",
    "Romance Progression",
    "Romance Trope",
    "Shared History",
  ]);

  assert.equal(getFriendsFamiliarityPresetsByCategory("core dynamic").length, 40);
  assert.equal(getFriendsFamiliarityPresetsByCategory("dialogue seed").length, 22);
  assert.equal(getFriendsFamiliarityPresetsByCategory("generator formula").length, 2);
});

test("normalises readable friends familiarity values and keeps useful ids", () => {
  const neighbours = findFriendsFamiliarityPresetById(
    "friends_familiarity_core_neighbours",
  );
  const sharedNeighbourhood = findFriendsFamiliarityPresetById(
    "friends_familiarity_history_same_neighbourhood",
  );
  const realising = findFriendsFamiliarityPresetById(
    "friends_familiarity_hidden_realising_it_late",
  );
  const formula = findFriendsFamiliarityPresetById(
    "friends_familiarity_formula_best_friends_almost_lost_realisation",
  );

  assert.equal(neighbours?.value, "Neighbours");
  assert.equal(sharedNeighbourhood?.value, "same neighbourhood");
  assert.equal(realising?.value, "realising it late");
  assert.deepEqual(formula?.formulaParts, [
    "best friends",
    "shared everything",
    "fear of ruining friendship",
    "safe person",
    "almost lost them realisation",
  ]);

  const readableText = JSON.stringify(
    FRIENDS_FAMILIARITY_PRESETS.map((preset) => ({
      category: preset.category,
      label: preset.label,
      value: preset.value,
      guidance: preset.guidance,
      formulaParts: preset.formulaParts,
    })),
  );
  assert.doesNotMatch(readableText, /Use code with caution/i);
  assert.doesNotMatch(readableText, /Neighbors|neighbor|neighborhood|realization|realizing/i);
});

test("compiles friends familiarity presets as soft friendship and agency guidance", () => {
  const preset = findFriendsFamiliarityPresetById(
    "friends_familiarity_emotion_friendship_as_home",
  );
  assert.ok(preset);

  const summary = compileFriendsFamiliarityPresetSummary(preset);
  const additions = compileFriendsFamiliarityPresetAdditions(preset);

  assert.match(
    summary,
    /Friends\/familiarity preset: Emotional Dynamic - Friendship As Home/,
  );
  assert.match(additions.relationshipAddition, /friendship as home/);
  assert.match(additions.personalityAddition, /only when relevant/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /the value of platonic friendship/i);
  assert.match(additions.systemPromptAddition, /\{\{user\}\}'s autonomy/i);
  assert.match(additions.systemPromptAddition, /choose romance gradually/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force|override/i);
});

test("compiles friends familiarity formulas as modular recipes", () => {
  const formula = findFriendsFamiliarityPresetById(
    "friends_familiarity_formula_childhood_friends_jealousy_realisation",
  );
  assert.ok(formula);

  const summary = compileFriendsFamiliarityPresetSummary(formula);
  const additions = compileFriendsFamiliarityPresetAdditions(formula);

  assert.match(summary, /Formula parts: childhood friends \+ deep familiarity/);
  assert.match(additions.personalityAddition, /Formula parts: childhood friends/);
  assert.match(additions.systemPromptAddition, /modular friends-to-lovers recipe/i);
  assert.match(additions.systemPromptAddition, /do not treat the formula as a scripted confession/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force|override/i);
});
