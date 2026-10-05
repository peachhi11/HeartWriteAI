import assert from "node:assert/strict";
import test from "node:test";

import {
  type StoryRuntimeSkill,
  findStoryRuntimeSkillsByScope,
  findStoryRuntimeSkillsByTag,
  getStoryRuntimeSkill,
  storyRuntimeSkills,
} from "../../lib/character-card/storyRuntimeSkills";

function requireSkill(slug: string): StoryRuntimeSkill {
  const skill = getStoryRuntimeSkill(slug);
  assert.ok(skill, `expected ${slug} to exist`);
  return skill;
}

test("story runtime skills have unique stable slugs", () => {
  const slugs = storyRuntimeSkills.map((skill) => skill.slug);

  assert.equal(new Set(slugs).size, slugs.length);
  assert.ok(slugs.length >= 6);

  for (const slug of slugs) {
    assert.match(slug, /^[a-z][a-z0-9-]+$/);
  }
});

test("story runtime skills include compiler-ready routing metadata", () => {
  for (const skill of storyRuntimeSkills) {
    assert.ok(skill.label.trim(), skill.slug);
    assert.ok(skill.summary.trim(), skill.slug);
    assert.ok(skill.sourceVaultLinks.length >= 1, skill.slug);
    assert.ok(skill.scope.length >= 2, skill.slug);
    assert.ok(skill.activationTags.length >= 3, skill.slug);
    assert.ok(skill.triggerSeeds.length >= 5, skill.slug);
    assert.ok(skill.stateFields.length >= 5, skill.slug);
    assert.ok(skill.promptCompilerSignals.length >= 3, skill.slug);
    assert.ok(skill.memoryRouting.length >= 1, skill.slug);
    assert.ok(skill.guardrails.length >= 2, skill.slug);
  }
});

test("explicit memory core preserves explicit routing and agency boundaries", () => {
  const explicit = requireSkill("explicit-memory-core");

  assert.equal(explicit.category, "memory-core");
  assert.ok(explicit.scope.includes("memory_book"));
  assert.ok(explicit.sourceVaultLinks.includes("[[Explicit Memory Core]]"));
  assert.ok(explicit.stateFields.includes("aftercare_pending"));
  assert.ok(explicit.stateFields.includes("orgasm_sequence"));
  assert.ok(explicit.promptCompilerSignals.includes("transition-to-aftercare"));
  assert.match(explicit.guardrails.join(" "), /\{\{user\}\} thoughts/);
});

test("emotional continuity tracks residue without controlling the user", () => {
  const emotionalContinuity = requireSkill("emotional-continuity");

  assert.equal(emotionalContinuity.category, "roleplay-response");
  assert.ok(emotionalContinuity.activationTags.includes("personality_skill"));
  assert.ok(emotionalContinuity.triggerSeeds.includes("jealous"));
  assert.ok(emotionalContinuity.stateFields.includes("suppression_or_mask"));
  assert.ok(emotionalContinuity.stateFields.includes("resolution_tracker"));
  assert.ok(
    emotionalContinuity.promptCompilerSignals.includes(
      "masking-not-resolution",
    ),
  );
  assert.ok(
    emotionalContinuity.sourceVaultLinks.includes(
      "emotional-continuity/references/emotional_continuity_examples.md",
    ),
  );
  assert.match(
    emotionalContinuity.guardrails.join(" "),
    /\{\{user\}\} emotions/,
  );
});

test("emotional escalation stages feeling without instant confession", () => {
  const emotionalEscalation = requireSkill("emotional-escalation");

  assert.equal(emotionalEscalation.category, "roleplay-response");
  assert.ok(emotionalEscalation.activationTags.includes("slow_burn_emotion"));
  assert.ok(emotionalEscalation.activationTags.includes("no_instant_confession"));
  assert.ok(emotionalEscalation.triggerSeeds.includes("almost confession"));
  assert.ok(emotionalEscalation.stateFields.includes("partial_admission"));
  assert.ok(emotionalEscalation.stateFields.includes("emotional_crosscurrent"));
  assert.ok(
    emotionalEscalation.promptCompilerSignals.includes("advance-one-stage"),
  );
  assert.ok(
    emotionalEscalation.sourceVaultLinks.includes(
      "emotional-escalation/references/emotional_escalation_framework.md",
    ),
  );
  assert.match(
    emotionalEscalation.guardrails.join(" "),
    /instant confession/,
  );
});

test("emotional subtext engine maps hidden feeling through bounded inference", () => {
  const subtext = requireSkill("emotional-subtext-engine");

  assert.equal(subtext.category, "roleplay-response");
  assert.ok(subtext.activationTags.includes("pov_bounded_inference"));
  assert.ok(subtext.triggerSeeds.includes("hidden feelings"));
  assert.ok(subtext.stateFields.includes("inferred_subtext"));
  assert.ok(subtext.stateFields.includes("visible_cues"));
  assert.ok(subtext.promptCompilerSignals.includes("show-dont-explain"));
  assert.ok(
    subtext.sourceVaultLinks.includes(
      "emotional-subtext-engine/references/subtext_examples.md",
    ),
  );
  assert.match(subtext.guardrails.join(" "), /\{\{user\}\} thoughts/);
});

test("AGENTS.md skills are available as app-facing source-material skills", () => {
  const expected = [
    "erotic-romance-writing-mentor",
    "romantic-erotic-storytelling-generator",
    "explicit-tbrp-scene-guidance",
    "roleplay-keyword-discovery",
    "character-persona-creation",
  ];

  for (const slug of expected) {
    assert.equal(requireSkill(slug).source, "agents_md");
  }

  const mentor = requireSkill("erotic-romance-writing-mentor");
  assert.ok(
    mentor.sourceVaultLinks.includes(
      "erotic-romance-writing-mentor/references/mentor_prompt_resource.md",
    ),
  );
  assert.ok(mentor.promptCompilerSignals.includes("revision-plan"));

  const persona = requireSkill("character-persona-creation");
  assert.ok(persona.scope.includes("character_book"));
  assert.ok(persona.promptCompilerSignals.includes("character-pov-only"));

  const keyword = requireSkill("roleplay-keyword-discovery");
  assert.ok(keyword.promptCompilerSignals.includes("entry-activation-qc"));
  assert.ok(keyword.guardrails.some((rule) => rule.includes("one to eight")));
});

test("proximity routing keeps trope logic without creating missing candidate skills", () => {
  const proximity = requireSkill("escalating-proximity");

  assert.ok(proximity.activationTags.includes("trope_stack_routing"));
  assert.ok(proximity.triggerSeeds.includes("only one bed"));
  assert.ok(proximity.stateFields.includes("near_miss_count"));
  assert.ok(proximity.promptCompilerSignals.includes("payoff-needed"));
  assert.ok(
    !storyRuntimeSkills.some((skill) => skill.slug === "dirty-talk-reactive"),
  );
  assert.ok(
    !storyRuntimeSkills.some((skill) => skill.slug === "mirror-position-display"),
  );
});

test("story runtime skills can be selected by tag and StoryBook scope", () => {
  assert.deepEqual(
    findStoryRuntimeSkillsByTag("explicit_mode").map((skill) => skill.slug),
    ["explicit-memory-core"],
  );
  assert.deepEqual(
    findStoryRuntimeSkillsByTag("proximity_engine").map((skill) => skill.slug),
    ["escalating-proximity"],
  );
  assert.ok(
    findStoryRuntimeSkillsByScope("prompt_book")
      .map((skill) => skill.slug)
      .includes("romantic-roleplay-skill-creator"),
  );
  assert.ok(
    findStoryRuntimeSkillsByScope("world_book")
      .map((skill) => skill.slug)
      .includes("modern-real-world-setting"),
  );
});
