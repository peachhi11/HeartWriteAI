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

test("power dynamics scene writing preserves explicit register and user agency", () => {
  const powerDynamics = requireSkill("power-dynamics-scene-writing");

  assert.equal(powerDynamics.category, "roleplay-response");
  assert.equal(powerDynamics.source, "heartwrite_memory_vault");
  assert.ok(powerDynamics.activationTags.includes("explicit_register"));
  assert.ok(powerDynamics.activationTags.includes("dominance_submission"));
  assert.ok(powerDynamics.triggerSeeds.includes("degradation"));
  assert.ok(powerDynamics.stateFields.includes("active_power_dynamic"));
  assert.ok(powerDynamics.stateFields.includes("boundary_state"));
  assert.ok(
    powerDynamics.promptCompilerSignals.includes("explicit-register-check"),
  );
  assert.ok(
    powerDynamics.sourceVaultLinks.includes(
      "power-dynamics-scene-writing/references/kink_sensation_edgeplay_logic.md",
    ),
  );
  assert.ok(powerDynamics.continuityLinks.includes("explicit-memory-core"));
  assert.ok(powerDynamics.continuityLinks.includes("domain-vocabulary-seeds"));
  assert.match(powerDynamics.guardrails.join(" "), /euphemise/);
  assert.match(powerDynamics.guardrails.join(" "), /\{\{user\}\} thoughts/);
});

test("dominance and intimacy flow links explicit somatic flow resource", () => {
  const intimacyFlow = requireSkill("dominance-and-intimacy-flow");

  assert.equal(intimacyFlow.category, "roleplay-response");
  assert.ok(intimacyFlow.activationTags.includes("explicit_scene_flow"));
  assert.ok(intimacyFlow.stateFields.includes("aftercare_pending"));
  assert.ok(intimacyFlow.promptCompilerSignals.includes("transition-to-aftercare"));
  assert.ok(
    intimacyFlow.sourceVaultLinks.includes(
      "dominance-and-intimacy-flow/references/sexual_somatic_flow_and_afterglow.md",
    ),
  );
  assert.ok(intimacyFlow.continuityLinks.includes("power-dynamics-scene-writing"));
  assert.match(intimacyFlow.guardrails.join(" "), /\{\{user\}\} input/);
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

test("knowledge boundary response separates canon truth from disclosure", () => {
  const knowledge = requireSkill("knowledge-boundary-response");

  assert.equal(knowledge.category, "roleplay-response");
  assert.equal(knowledge.source, "heartwrite_memory_vault");
  assert.ok(knowledge.activationTags.includes("spoiler_control"));
  assert.ok(knowledge.activationTags.includes("character_knowledge_ledger"));
  assert.ok(knowledge.triggerSeeds.includes("you couldn't know"));
  assert.ok(knowledge.triggerSeeds.includes("secret identity"));
  assert.ok(knowledge.stateFields.includes("story_frontier"));
  assert.ok(knowledge.stateFields.includes("disclosure_permission"));
  assert.ok(knowledge.stateFields.includes("reader_knowledge_state"));
  assert.ok(
    knowledge.promptCompilerSignals.includes("truth-vs-disclosure-split"),
  );
  assert.ok(
    knowledge.sourceVaultLinks.includes(
      "knowledge-boundary-response/references/spoiler_control_and_knowledge_ledgers.md",
    ),
  );
  assert.ok(knowledge.continuityLinks.includes("explicit-recall-memory"));
  assert.match(knowledge.guardrails.join(" "), /canon truth/);
  assert.match(knowledge.guardrails.join(" "), /\{\{user\}\} agency/);
});

test("relationship tracker interprets plausible next beats without flattening trust", () => {
  const relationship = requireSkill("relationship-tracker");

  assert.equal(relationship.category, "relationship-continuity");
  assert.equal(relationship.source, "heartwrite_memory_vault");
  assert.ok(relationship.activationTags.includes("trust_web"));
  assert.ok(relationship.activationTags.includes("relationship_milestones"));
  assert.ok(relationship.activationTags.includes("alt_branch_routing"));
  assert.ok(relationship.triggerSeeds.includes("relationship framework"));
  assert.ok(relationship.triggerSeeds.includes("relationship milestone"));
  assert.ok(relationship.triggerSeeds.includes("moving in together"));
  assert.ok(relationship.triggerSeeds.includes("BRANCH"));
  assert.ok(relationship.stateFields.includes("dominant_type"));
  assert.ok(relationship.stateFields.includes("milestone_plausibility"));
  assert.ok(relationship.stateFields.includes("trust_web"));
  assert.ok(relationship.stateFields.includes("blocked_or_premature_beats"));
  assert.ok(relationship.promptCompilerSignals.includes("milestone-assessment"));
  assert.ok(relationship.promptCompilerSignals.includes("plausibility-check"));
  assert.ok(relationship.promptCompilerSignals.includes("canon-fit"));
  assert.ok(
    relationship.sourceVaultLinks.includes(
      "relationship-tracker/references/relationship_framework_plausibility_layer.md",
    ),
  );
  assert.ok(
    relationship.sourceVaultLinks.includes(
      "relationship-tracker/references/relationship_milestone_assessment.md",
    ),
  );
  assert.ok(relationship.continuityLinks.includes("intimacy-shift"));
  assert.ok(relationship.continuityLinks.includes("knowledge-boundary-response"));
  assert.match(relationship.guardrails.join(" "), /numeric matrix/);
  assert.match(relationship.guardrails.join(" "), /mandatory staircase/);
  assert.match(relationship.guardrails.join(" "), /\{\{user\}\} feelings/);
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
  assert.ok(
    mentor.sourceVaultLinks.includes(
      "erotic-romance-writing-mentor/references/commercial_pulp_romance_patterns.md",
    ),
  );
  assert.ok(mentor.activationTags.includes("commercial_romance_patterns"));
  assert.ok(mentor.stateFields.includes("reader_promise"));
  assert.ok(mentor.promptCompilerSignals.includes("revision-plan"));
  assert.ok(mentor.promptCompilerSignals.includes("commercial-pattern-check"));

  const persona = requireSkill("character-persona-creation");
  assert.ok(persona.scope.includes("character_book"));
  assert.ok(persona.promptCompilerSignals.includes("character-pov-only"));

  const keyword = requireSkill("roleplay-keyword-discovery");
  assert.ok(keyword.promptCompilerSignals.includes("entry-activation-qc"));
  assert.ok(keyword.guardrails.some((rule) => rule.includes("one to eight")));
});

test("story idea generator includes character engine concept support", () => {
  const storyIdea = requireSkill("story-idea-generator");

  assert.equal(storyIdea.category, "story-development");
  assert.equal(storyIdea.source, "heartwrite_memory_vault");
  assert.ok(storyIdea.activationTags.includes("character_engine"));
  assert.ok(storyIdea.activationTags.includes("three_act_emotional_arc"));
  assert.ok(storyIdea.triggerSeeds.includes("character need"));
  assert.ok(storyIdea.triggerSeeds.includes("psychological flaw"));
  assert.ok(storyIdea.stateFields.includes("character_desire"));
  assert.ok(storyIdea.stateFields.includes("character_need"));
  assert.ok(storyIdea.stateFields.includes("character_lie"));
  assert.ok(storyIdea.stateFields.includes("care_goal"));
  assert.ok(storyIdea.promptCompilerSignals.includes("character-engine-check"));
  assert.ok(storyIdea.promptCompilerSignals.includes("story-concept-generation"));
  assert.ok(
    storyIdea.sourceVaultLinks.includes(
      "story-idea-generator/references/character_arc_need_desire_engine.md",
    ),
  );
  assert.ok(storyIdea.continuityLinks.includes("world-bible-builder"));
  assert.ok(storyIdea.continuityLinks.includes("relationship-tracker"));
  assert.match(storyIdea.guardrails.join(" "), /adult and fiction-framed/);
  assert.match(storyIdea.guardrails.join(" "), /generic trope paste/);
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
