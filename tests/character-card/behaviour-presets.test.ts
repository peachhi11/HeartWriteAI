import assert from "node:assert/strict";
import test from "node:test";

import {
  BEHAVIOUR_PRESET_CATEGORIES,
  BEHAVIOUR_PRESETS,
  compileBehaviourPresetAdditions,
  findBehaviourPresetById,
  getBehaviourPresetsByCategory,
} from "../../data/behaviourPresets";

test("loads behaviour presets across action, social, romance, conflict, and dialogue lanes", () => {
  assert.equal(BEHAVIOUR_PRESETS.length, 243);
  assert.deepEqual(BEHAVIOUR_PRESET_CATEGORIES, [
    "Archetype",
    "Behaviour",
    "Conflict Behaviour",
    "Dialogue Seed",
    "Emotional Behaviour",
    "Gate",
    "High-Value Seed",
    "Romance Hook",
    "Romantic Behaviour",
    "Social Behaviour",
    "Weakness",
  ]);

  const ids = BEHAVIOUR_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getBehaviourPresetsByCategory("Archetype").length, 20);
  assert.equal(getBehaviourPresetsByCategory("Behaviour").length, 40);
  assert.equal(getBehaviourPresetsByCategory("Social Behaviour").length, 20);
  assert.equal(getBehaviourPresetsByCategory("Romantic Behaviour").length, 20);
  assert.equal(getBehaviourPresetsByCategory("Conflict Behaviour").length, 20);
  assert.equal(getBehaviourPresetsByCategory("Emotional Behaviour").length, 20);
  assert.equal(getBehaviourPresetsByCategory("Weakness").length, 20);
  assert.equal(getBehaviourPresetsByCategory("Romance Hook").length, 20);
  assert.equal(getBehaviourPresetsByCategory("Gate").length, 20);
  assert.equal(getBehaviourPresetsByCategory("Dialogue Seed").length, 23);
  assert.equal(getBehaviourPresetsByCategory("High-Value Seed").length, 20);
});

test("normalises behaviour values for visible prompt text", () => {
  const greyHelper = findBehaviourPresetById("behaviour_archetype_the_morally_grey_helper");
  const checksOnUser = findBehaviourPresetById("behaviour_seed_checks_on_user");
  const publicDefence = findBehaviourPresetById("behaviour_romance_first_public_defence");
  const apologises = findBehaviourPresetById("behaviour_conflict_apologises_quickly");
  const armour = findBehaviourPresetById("behaviour_social_uses_charm_as_armour");
  const malformedDialogueFix = findBehaviourPresetById("behaviour_dialogue_unfortunately");

  assert.equal(greyHelper?.value, "The Morally Grey Helper");
  assert.equal(checksOnUser?.value, "checks on {{user}}");
  assert.equal(publicDefence?.value, "first public defence");
  assert.equal(apologises?.value, "apologises quickly");
  assert.equal(armour?.value, "uses charm as armour");
  assert.equal(malformedDialogueFix?.value, "Unfortunately.");

  const visibleText = BEHAVIOUR_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.doesNotMatch(
    visibleText,
    /Use code with caution|morally gray|flirtatious|checks on user|walks user home|keeps user close|softens only for user|introduces user|user notices|user calls out|uses_humor|deflects with humor|apologizes|apologize|behavior|public defense|armor|force prose|SYSTEM PROTOCOL/i,
  );
});

test("compiles behaviour presets as soft accountable pattern guidance", () => {
  const preset = findBehaviourPresetById("behaviour_high_value_trust_through_actions_gate");
  assert.ok(preset);

  const additions = compileBehaviourPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Behaviour context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft behaviour context/i);
  assert.match(additions.systemPromptAddition, /\{\{user\}\} agency intact/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("keeps behaviour weaknesses repairable and boundary-aware", () => {
  const controlIssues = findBehaviourPresetById("behaviour_weakness_control_issues");
  const silence = findBehaviourPresetById(
    "behaviour_conflict_does_not_use_silence_as_punishment",
  );
  assert.ok(controlIssues);
  assert.ok(silence);

  assert.match(controlIssues.guidance, /accountability, boundaries, and growth/i);
  assert.match(silence.guidance, /repair, boundaries, and healthier choices/i);
});
