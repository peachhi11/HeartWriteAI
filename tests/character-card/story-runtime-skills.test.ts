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
  assert.ok(subtext.activationTags.includes("surface_subterranean_gap"));
  assert.ok(subtext.activationTags.includes("dramatic_irony"));
  assert.ok(subtext.activationTags.includes("pov_bounded_inference"));
  assert.ok(subtext.triggerSeeds.includes("hidden feelings"));
  assert.ok(subtext.triggerSeeds.includes("proxy conflict"));
  assert.ok(subtext.triggerSeeds.includes("scene secret"));
  assert.ok(subtext.stateFields.includes("surface_layer"));
  assert.ok(subtext.stateFields.includes("subterranean_layer"));
  assert.ok(subtext.stateFields.includes("subtext_channel"));
  assert.ok(subtext.stateFields.includes("inferred_subtext"));
  assert.ok(subtext.stateFields.includes("visible_cues"));
  assert.ok(subtext.stateFields.includes("reader_knowledge_gap"));
  assert.ok(
    subtext.promptCompilerSignals.includes("surface-subterranean-map"),
  );
  assert.ok(
    subtext.promptCompilerSignals.includes("subtext-channel-routing"),
  );
  assert.ok(subtext.promptCompilerSignals.includes("remove-subtext-test"));
  assert.ok(subtext.promptCompilerSignals.includes("dramatic-irony-check"));
  assert.ok(subtext.promptCompilerSignals.includes("show-dont-explain"));
  assert.ok(
    subtext.sourceVaultLinks.includes(
      "emotional-subtext-engine/references/subtext_examples.md",
    ),
  );
  assert.ok(
    subtext.sourceVaultLinks.includes(
      "emotional-subtext-engine/references/subtext_engine_channels.md",
    ),
  );
  assert.match(subtext.guardrails.join(" "), /\{\{user\}\} thoughts/);
  assert.match(subtext.guardrails.join(" "), /withholding information/);
});

test("knowledge boundary response separates canon truth from disclosure", () => {
  const knowledge = requireSkill("knowledge-boundary-response");

  assert.equal(knowledge.category, "roleplay-response");
  assert.equal(knowledge.source, "heartwrite_memory_vault");
  assert.ok(knowledge.activationTags.includes("spoiler_control"));
  assert.ok(knowledge.activationTags.includes("character_knowledge_ledger"));
  assert.ok(knowledge.activationTags.includes("epistemic_pacing"));
  assert.ok(knowledge.activationTags.includes("structured_knowledge_tree"));
  assert.ok(knowledge.triggerSeeds.includes("you couldn't know"));
  assert.ok(knowledge.triggerSeeds.includes("secret identity"));
  assert.ok(knowledge.triggerSeeds.includes("premature disclosure"));
  assert.ok(knowledge.stateFields.includes("story_frontier"));
  assert.ok(knowledge.stateFields.includes("disclosure_permission"));
  assert.ok(knowledge.stateFields.includes("reader_knowledge_state"));
  assert.ok(knowledge.stateFields.includes("reveal_prerequisites"));
  assert.ok(knowledge.stateFields.includes("contradicts_with"));
  assert.ok(knowledge.stateFields.includes("verification_status"));
  assert.ok(
    knowledge.promptCompilerSignals.includes("truth-vs-disclosure-split"),
  );
  assert.ok(knowledge.promptCompilerSignals.includes("epistemic-pacing-check"));
  assert.ok(
    knowledge.promptCompilerSignals.includes("premature-disclosure-check"),
  );
  assert.ok(
    knowledge.promptCompilerSignals.includes("response-verification-check"),
  );
  assert.ok(
    knowledge.sourceVaultLinks.includes(
      "knowledge-boundary-response/references/spoiler_control_and_knowledge_ledgers.md",
    ),
  );
  assert.ok(
    knowledge.sourceVaultLinks.includes(
      "knowledge-boundary-response/references/structured_knowledge_tree_epistemic_pacing.md",
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
  assert.ok(storyIdea.activationTags.includes("trope_world"));
  assert.ok(storyIdea.activationTags.includes("three_act_emotional_arc"));
  assert.ok(storyIdea.triggerSeeds.includes("trope world"));
  assert.ok(storyIdea.triggerSeeds.includes("character need"));
  assert.ok(storyIdea.triggerSeeds.includes("psychological flaw"));
  assert.ok(storyIdea.stateFields.includes("reader_promise"));
  assert.ok(storyIdea.stateFields.includes("character_desire"));
  assert.ok(storyIdea.stateFields.includes("character_need"));
  assert.ok(storyIdea.stateFields.includes("character_lie"));
  assert.ok(storyIdea.stateFields.includes("care_goal"));
  assert.ok(storyIdea.promptCompilerSignals.includes("character-engine-check"));
  assert.ok(storyIdea.promptCompilerSignals.includes("story-concept-generation"));
  assert.ok(storyIdea.promptCompilerSignals.includes("trope-world-check"));
  assert.ok(
    storyIdea.sourceVaultLinks.includes(
      "story-idea-generator/references/character_arc_need_desire_engine.md",
    ),
  );
  assert.ok(storyIdea.sourceVaultLinks.includes("character-arc-structure/SKILL.md"));
  assert.ok(storyIdea.sourceVaultLinks.includes("character-gmcs/SKILL.md"));
  assert.ok(storyIdea.sourceVaultLinks.includes("scene-sequel-structure/SKILL.md"));
  assert.ok(storyIdea.sourceVaultLinks.includes("trope-world-builder/SKILL.md"));
  assert.ok(storyIdea.continuityLinks.includes("character-gmcs"));
  assert.ok(storyIdea.continuityLinks.includes("character-arc-structure"));
  assert.ok(storyIdea.continuityLinks.includes("world-bible-builder"));
  assert.ok(storyIdea.continuityLinks.includes("trope-world-builder"));
  assert.ok(storyIdea.continuityLinks.includes("relationship-tracker"));
  assert.match(storyIdea.guardrails.join(" "), /adult and fiction-framed/);
  assert.match(storyIdea.guardrails.join(" "), /generic trope paste/);
});

test("weather natural phenomena maps climate natural law and scene hazards", () => {
  const weather = requireSkill("weather-natural-phenomena");

  assert.equal(weather.category, "world-setting");
  assert.equal(weather.source, "heartwrite_memory_vault");
  assert.ok(weather.scope.includes("world_book"));
  assert.ok(weather.scope.includes("scenario_book"));
  assert.ok(weather.activationTags.includes("natural_law"));
  assert.ok(weather.activationTags.includes("magical_phenomenon"));
  assert.ok(weather.activationTags.includes("environmental_hazard"));
  assert.ok(weather.triggerSeeds.includes("magical storm"));
  assert.ok(weather.triggerSeeds.includes("geological event"));
  assert.ok(weather.triggerSeeds.includes("three moons"));
  assert.ok(weather.stateFields.includes("weather_state"));
  assert.ok(weather.stateFields.includes("natural_phenomenon"));
  assert.ok(weather.stateFields.includes("manifestation"));
  assert.ok(weather.stateFields.includes("localization"));
  assert.ok(weather.stateFields.includes("magic_system_rules"));
  assert.ok(weather.stateFields.includes("continuity_traces"));
  assert.ok(weather.promptCompilerSignals.includes("weather-natural-phenomena"));
  assert.ok(weather.promptCompilerSignals.includes("manifestation-localization"));
  assert.ok(weather.promptCompilerSignals.includes("magic-system-law"));
  assert.ok(
    weather.sourceVaultLinks.includes(
      "weather-natural-phenomena/references/weather_natural_law_magic_system_guide.md",
    ),
  );
  assert.ok(
    weather.sourceVaultLinks.includes(
      "world-bible-builder/references/worldbuilding_prompt_taxonomy.md",
    ),
  );
  assert.ok(weather.continuityLinks.includes("environmental-movement"));
  assert.ok(weather.continuityLinks.includes("world-bible-builder"));
  assert.ok(weather.continuityLinks.includes("scene-coherence-playfield"));
  assert.match(weather.guardrails.join(" "), /sudden disasters/);
  assert.match(weather.guardrails.join(" "), /\{\{user\}\} thoughts/);
});

test("character gmcs maps personal goals motives conflicts and stakes", () => {
  const gmcs = requireSkill("character-gmcs");

  assert.equal(gmcs.category, "story-development");
  assert.equal(gmcs.source, "heartwrite_memory_vault");
  assert.ok(gmcs.scope.includes("character_book"));
  assert.ok(gmcs.scope.includes("scenario_book"));
  assert.ok(gmcs.activationTags.includes("story_gmcs_alignment"));
  assert.ok(gmcs.activationTags.includes("personal_stakes"));
  assert.ok(gmcs.triggerSeeds.includes("character GMCS"));
  assert.ok(gmcs.triggerSeeds.includes("why does this character care"));
  assert.ok(gmcs.stateFields.includes("story_goal"));
  assert.ok(gmcs.stateFields.includes("character_goal"));
  assert.ok(gmcs.stateFields.includes("character_motivation"));
  assert.ok(gmcs.stateFields.includes("character_conflict"));
  assert.ok(gmcs.stateFields.includes("character_stakes"));
  assert.ok(gmcs.stateFields.includes("scene_application"));
  assert.ok(gmcs.promptCompilerSignals.includes("character-gmcs-map"));
  assert.ok(gmcs.promptCompilerSignals.includes("story-gmcs-alignment"));
  assert.ok(gmcs.promptCompilerSignals.includes("scene-action-alignment"));
  assert.ok(
    gmcs.sourceVaultLinks.includes(
      "character-gmcs/references/character_gmcs_alignment_worksheet.md",
    ),
  );
  assert.ok(gmcs.continuityLinks.includes("character-arc-structure"));
  assert.ok(gmcs.continuityLinks.includes("romance-conflict-outliner"));
  assert.ok(gmcs.continuityLinks.includes("scene-sequel-structure"));
  assert.match(gmcs.guardrails.join(" "), /protagonist's exact goal/);
  assert.match(gmcs.guardrails.join(" "), /\{\{user\}\} goals/);
});

test("character arc structure maps lie truth want need and plot-point evidence", () => {
  const arc = requireSkill("character-arc-structure");

  assert.equal(arc.category, "story-development");
  assert.equal(arc.source, "heartwrite_memory_vault");
  assert.ok(arc.scope.includes("character_book"));
  assert.ok(arc.scope.includes("scenario_book"));
  assert.ok(arc.activationTags.includes("lie_truth_arc"));
  assert.ok(arc.activationTags.includes("want_need_split"));
  assert.ok(arc.activationTags.includes("transformation_evidence"));
  assert.ok(arc.triggerSeeds.includes("character arc"));
  assert.ok(arc.triggerSeeds.includes("Third Plot Point"));
  assert.ok(arc.triggerSeeds.includes("Resolution baseline"));
  assert.ok(arc.stateFields.includes("character_lie"));
  assert.ok(arc.stateFields.includes("counter_truth"));
  assert.ok(arc.stateFields.includes("ghost_wound"));
  assert.ok(arc.stateFields.includes("midpoint_revelation"));
  assert.ok(arc.stateFields.includes("climax_proof"));
  assert.ok(arc.promptCompilerSignals.includes("lie-truth-check"));
  assert.ok(arc.promptCompilerSignals.includes("third-plot-point-sacrifice"));
  assert.ok(arc.promptCompilerSignals.includes("resolution-baseline"));
  assert.ok(
    arc.sourceVaultLinks.includes(
      "character-arc-structure/references/character_arc_beat_structure_guide.md",
    ),
  );
  assert.ok(arc.sourceVaultLinks.includes("character-gmcs/SKILL.md"));
  assert.ok(arc.continuityLinks.includes("character-gmcs"));
  assert.ok(arc.continuityLinks.includes("story-idea-generator"));
  assert.ok(arc.continuityLinks.includes("scene-sequel-structure"));
  assert.ok(arc.continuityLinks.includes("romance-conflict-outliner"));
  assert.ok(arc.continuityLinks.includes("crafting-satisfying-ending"));
  assert.match(arc.guardrails.join(" "), /moral correction/);
  assert.match(arc.guardrails.join(" "), /\{\{user\}\}'s arc/);
});

test("scene sequel structure maps goal conflict disaster and aftermath handoff", () => {
  const sceneSequel = requireSkill("scene-sequel-structure");

  assert.equal(sceneSequel.category, "story-development");
  assert.equal(sceneSequel.source, "heartwrite_memory_vault");
  assert.ok(sceneSequel.scope.includes("prompt_book"));
  assert.ok(sceneSequel.scope.includes("scenario_book"));
  assert.ok(sceneSequel.activationTags.includes("goal_conflict_disaster"));
  assert.ok(sceneSequel.activationTags.includes("reaction_dilemma_decision"));
  assert.ok(sceneSequel.activationTags.includes("next_goal_handoff"));
  assert.ok(sceneSequel.triggerSeeds.includes("scene sequel"));
  assert.ok(sceneSequel.triggerSeeds.includes("yes but disaster"));
  assert.ok(sceneSequel.triggerSeeds.includes("half scene"));
  assert.ok(sceneSequel.stateFields.includes("scene_question"));
  assert.ok(sceneSequel.stateFields.includes("disaster_type"));
  assert.ok(sceneSequel.stateFields.includes("sequel_reaction"));
  assert.ok(sceneSequel.stateFields.includes("dilemma_question"));
  assert.ok(sceneSequel.stateFields.includes("next_scene_goal"));
  assert.ok(sceneSequel.promptCompilerSignals.includes("goal-conflict-disaster"));
  assert.ok(sceneSequel.promptCompilerSignals.includes("reaction-dilemma-decision"));
  assert.ok(sceneSequel.promptCompilerSignals.includes("next-goal-bridge"));
  assert.ok(
    sceneSequel.sourceVaultLinks.includes(
      "scene-sequel-structure/references/scene_sequel_structure_guide.md",
    ),
  );
  assert.ok(sceneSequel.sourceVaultLinks.includes("character-gmcs/SKILL.md"));
  assert.ok(sceneSequel.continuityLinks.includes("character-gmcs"));
  assert.ok(sceneSequel.continuityLinks.includes("scene-coherence-playfield"));
  assert.ok(sceneSequel.continuityLinks.includes("chapter-cut-evaluator"));
  assert.ok(sceneSequel.continuityLinks.includes("character-arc-structure"));
  assert.match(sceneSequel.guardrails.join(" "), /visible worksheet/);
  assert.match(sceneSequel.guardrails.join(" "), /random disasters/);
  assert.match(sceneSequel.guardrails.join(" "), /\{\{user\}\} agency/);
});

test("trope world builder maps subgenre conventions and reader promise", () => {
  const tropeWorld = requireSkill("trope-world-builder");

  assert.equal(tropeWorld.category, "world-setting");
  assert.equal(tropeWorld.source, "heartwrite_memory_vault");
  assert.ok(tropeWorld.scope.includes("world_book"));
  assert.ok(tropeWorld.scope.includes("prompt_book"));
  assert.ok(tropeWorld.activationTags.includes("reader_promise"));
  assert.ok(tropeWorld.activationTags.includes("subgenre_conventions"));
  assert.ok(tropeWorld.activationTags.includes("controlled_subversion"));
  assert.ok(tropeWorld.activationTags.includes("worldbuilding_prompt_taxonomy"));
  assert.ok(tropeWorld.triggerSeeds.includes("trope world"));
  assert.ok(tropeWorld.triggerSeeds.includes("Regency romance"));
  assert.ok(tropeWorld.triggerSeeds.includes("mafia romance"));
  assert.ok(tropeWorld.triggerSeeds.includes("400 worldbuilding prompts"));
  assert.ok(tropeWorld.stateFields.includes("foundational_elements"));
  assert.ok(tropeWorld.stateFields.includes("world_divergences"));
  assert.ok(tropeWorld.stateFields.includes("worldbuilding_gap"));
  assert.ok(tropeWorld.stateFields.includes("question_function"));
  assert.ok(tropeWorld.stateFields.includes("promise_break_risk"));
  assert.ok(tropeWorld.promptCompilerSignals.includes("trope-world-contract"));
  assert.ok(tropeWorld.promptCompilerSignals.includes("reader-promise-check"));
  assert.ok(tropeWorld.promptCompilerSignals.includes("promise-break-risk"));
  assert.ok(
    tropeWorld.promptCompilerSignals.includes("worldbuilding-question-routing"),
  );
  assert.ok(
    tropeWorld.sourceVaultLinks.includes(
      "trope-world-builder/references/trope_world_contract_checklist.md",
    ),
  );
  assert.ok(
    tropeWorld.sourceVaultLinks.includes(
      "world-bible-builder/references/worldbuilding_prompt_taxonomy.md",
    ),
  );
  assert.ok(tropeWorld.continuityLinks.includes("world-bible-builder"));
  assert.ok(tropeWorld.continuityLinks.includes("story-idea-generator"));
  assert.match(tropeWorld.guardrails.join(" "), /surface aesthetic/);
  assert.match(tropeWorld.guardrails.join(" "), /core appeal/);
});

test("crafting satisfying ending maps storycoaster pacing and payoff", () => {
  const ending = requireSkill("crafting-satisfying-ending");

  assert.equal(ending.category, "story-development");
  assert.equal(ending.source, "heartwrite_memory_vault");
  assert.ok(ending.activationTags.includes("storycoaster"));
  assert.ok(ending.activationTags.includes("highest_peak"));
  assert.ok(ending.activationTags.includes("post_climax_resolution"));
  assert.ok(ending.triggerSeeds.includes("cliffhanger"));
  assert.ok(ending.triggerSeeds.includes("storycoaster"));
  assert.ok(ending.stateFields.includes("storycoaster_sequence"));
  assert.ok(ending.stateFields.includes("decisive_moment"));
  assert.ok(ending.stateFields.includes("new_baseline"));
  assert.ok(ending.promptCompilerSignals.includes("highest-peak-check"));
  assert.ok(ending.promptCompilerSignals.includes("ending-payoff-check"));
  assert.ok(
    ending.sourceVaultLinks.includes(
      "crafting-satisfying-ending/references/storycoaster_planning_template.md",
    ),
  );
  assert.ok(ending.sourceVaultLinks.includes("character-arc-structure/SKILL.md"));
  assert.ok(ending.sourceVaultLinks.includes("scene-sequel-structure/SKILL.md"));
  assert.ok(ending.continuityLinks.includes("character-arc-structure"));
  assert.ok(ending.continuityLinks.includes("scene-sequel-structure"));
  assert.ok(ending.continuityLinks.includes("story-idea-generator"));
  assert.ok(ending.continuityLinks.includes("relationship-tracker"));
  assert.match(ending.guardrails.join(" "), /unrelated external event/);
  assert.match(ending.guardrails.join(" "), /author control/);
});

test("chapter cut evaluator maps cliffhanger placement and fallout timing", () => {
  const chapterCut = requireSkill("chapter-cut-evaluator");

  assert.equal(chapterCut.category, "story-development");
  assert.equal(chapterCut.source, "heartwrite_memory_vault");
  assert.ok(chapterCut.activationTags.includes("chapter_cut_evaluation"));
  assert.ok(chapterCut.activationTags.includes("cliffhanger_placement"));
  assert.ok(chapterCut.activationTags.includes("not_enough_climb"));
  assert.ok(chapterCut.triggerSeeds.includes("chapter ending"));
  assert.ok(chapterCut.triggerSeeds.includes("where should this chapter end"));
  assert.ok(chapterCut.stateFields.includes("conflict_peak"));
  assert.ok(chapterCut.stateFields.includes("recommended_cut_point"));
  assert.ok(chapterCut.stateFields.includes("fallout_placement"));
  assert.ok(chapterCut.promptCompilerSignals.includes("chapter-cut-evaluation"));
  assert.ok(chapterCut.promptCompilerSignals.includes("unrelated-cliffhanger"));
  assert.ok(chapterCut.promptCompilerSignals.includes("fallout-placement"));
  assert.ok(
    chapterCut.sourceVaultLinks.includes(
      "chapter-cut-evaluator/references/cliffhanger_and_chapter_cut_evaluation.md",
    ),
  );
  assert.ok(chapterCut.continuityLinks.includes("crafting-satisfying-ending"));
  assert.ok(chapterCut.continuityLinks.includes("scene-sequel-structure"));
  assert.ok(chapterCut.continuityLinks.includes("romance-conflict-outliner"));
  assert.match(chapterCut.guardrails.join(" "), /emotional or narrative peak/);
  assert.match(chapterCut.guardrails.join(" "), /unrelated external interruption/);
});

test("romance conflict outliner maps gmcs and internal external conflict", () => {
  const conflict = requireSkill("romance-conflict-outliner");

  assert.equal(conflict.category, "story-development");
  assert.equal(conflict.source, "heartwrite_memory_vault");
  assert.ok(conflict.activationTags.includes("gmcs"));
  assert.ok(conflict.activationTags.includes("internal_external_conflict"));
  assert.ok(conflict.activationTags.includes("fall_back_beat"));
  assert.ok(conflict.triggerSeeds.includes("romance conflict"));
  assert.ok(conflict.triggerSeeds.includes("GMCS"));
  assert.ok(conflict.stateFields.includes("internal_conflicts"));
  assert.ok(conflict.stateFields.includes("external_conflicts"));
  assert.ok(conflict.stateFields.includes("fall_back_trigger"));
  assert.ok(conflict.promptCompilerSignals.includes("romance-conflict-outline"));
  assert.ok(conflict.promptCompilerSignals.includes("gmcs-map"));
  assert.ok(conflict.promptCompilerSignals.includes("internal-external-conflict-check"));
  assert.ok(
    conflict.sourceVaultLinks.includes(
      "romance-conflict-outliner/references/romance_gmcs_conflict_outline.md",
    ),
  );
  assert.ok(conflict.sourceVaultLinks.includes("character-gmcs/SKILL.md"));
  assert.ok(conflict.sourceVaultLinks.includes("character-arc-structure/SKILL.md"));
  assert.ok(conflict.sourceVaultLinks.includes("scene-sequel-structure/SKILL.md"));
  assert.ok(conflict.continuityLinks.includes("character-gmcs"));
  assert.ok(conflict.continuityLinks.includes("character-arc-structure"));
  assert.ok(conflict.continuityLinks.includes("crafting-satisfying-ending"));
  assert.ok(conflict.continuityLinks.includes("scene-sequel-structure"));
  assert.ok(conflict.continuityLinks.includes("relationship-conflict-tracker"));
  assert.match(conflict.guardrails.join(" "), /misunderstandings/);
  assert.match(conflict.guardrails.join(" "), /author control/);
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

test("space distance blocking maps spatial continuity and plausible action", () => {
  const blocking = requireSkill("space-distance-blocking");

  assert.equal(blocking.category, "roleplay-response");
  assert.equal(blocking.source, "heartwrite_memory_vault");
  assert.ok(blocking.scope.includes("scenario_book"));
  assert.ok(blocking.activationTags.includes("spatial_blocking"));
  assert.ok(blocking.activationTags.includes("distance_band"));
  assert.ok(blocking.activationTags.includes("barrier_check"));
  assert.ok(blocking.triggerSeeds.includes("behind glass"));
  assert.ok(blocking.triggerSeeds.includes("pinned against a wall"));
  assert.ok(blocking.stateFields.includes("distance_band"));
  assert.ok(blocking.stateFields.includes("sensory_reach"));
  assert.ok(blocking.stateFields.includes("plausible_actions"));
  assert.ok(blocking.promptCompilerSignals.includes("touch-range-check"));
  assert.ok(blocking.promptCompilerSignals.includes("whisper-range-check"));
  assert.ok(blocking.promptCompilerSignals.includes("visibility-check"));
  assert.ok(
    blocking.sourceVaultLinks.includes(
      "space-distance-blocking/references/spatial_blocking_scene_continuity.md",
    ),
  );
  assert.ok(blocking.continuityLinks.includes("position-tracking"));
  assert.ok(blocking.continuityLinks.includes("escalating-proximity"));
  assert.match(blocking.guardrails.join(" "), /impossible distance/);
  assert.match(blocking.guardrails.join(" "), /spatial inventory/);
});

test("scene coherence playfield routes visible scene definition and scene types", () => {
  const playfield = requireSkill("scene-coherence-playfield");

  assert.equal(playfield.category, "roleplay-response");
  assert.equal(playfield.source, "heartwrite_memory_vault");
  assert.ok(playfield.scope.includes("scenario_book"));
  assert.ok(playfield.scope.includes("prompt_book"));
  assert.ok(playfield.activationTags.includes("scene_coherence"));
  assert.ok(playfield.activationTags.includes("visible_playfield"));
  assert.ok(playfield.activationTags.includes("scene_type_routing"));
  assert.ok(playfield.triggerSeeds.includes("exploration scene"));
  assert.ok(playfield.triggerSeeds.includes("aftermath scene"));
  assert.ok(playfield.stateFields.includes("visible_field"));
  assert.ok(playfield.stateFields.includes("objects_resources"));
  assert.ok(playfield.stateFields.includes("next_playable_actions"));
  assert.ok(playfield.promptCompilerSignals.includes("scene-type-routing"));
  assert.ok(playfield.promptCompilerSignals.includes("care-agency"));
  assert.ok(playfield.promptCompilerSignals.includes("aftermath-continuity"));
  assert.ok(
    playfield.sourceVaultLinks.includes(
      "scene-coherence-playfield/references/visible_playfield_scene_type_guide.md",
    ),
  );
  assert.ok(playfield.continuityLinks.includes("space-distance-blocking"));
  assert.ok(playfield.continuityLinks.includes("scene-sequel-structure"));
  assert.ok(playfield.continuityLinks.includes("state-tracking-and-continuity"));
  assert.match(playfield.guardrails.join(" "), /decorative filler/);
  assert.match(playfield.guardrails.join(" "), /\{\{user\}\} thoughts/);
});

test("multi-character world narration preserves npc distinction and world autonomy", () => {
  const multi = requireSkill("multi-character-world-narration");

  assert.equal(multi.category, "roleplay-response");
  assert.equal(multi.source, "heartwrite_memory_vault");
  assert.ok(multi.scope.includes("scenario_book"));
  assert.ok(multi.scope.includes("world_book"));
  assert.ok(multi.activationTags.includes("multi_character_differentiation"));
  assert.ok(multi.activationTags.includes("npc_autonomy"));
  assert.ok(multi.activationTags.includes("anti_hivemind_check"));
  assert.ok(multi.triggerSeeds.includes("crowd reaction"));
  assert.ok(multi.triggerSeeds.includes("care languages"));
  assert.ok(multi.stateFields.includes("sensory_focus_map"));
  assert.ok(multi.stateFields.includes("care_language"));
  assert.ok(multi.stateFields.includes("npc_relationship_edges"));
  assert.ok(multi.stateFields.includes("world_reaction_channels"));
  assert.ok(multi.promptCompilerSignals.includes("cross-npc-dynamics"));
  assert.ok(multi.promptCompilerSignals.includes("world-reaction-timeline"));
  assert.ok(multi.promptCompilerSignals.includes("anti-hivemind-check"));
  assert.ok(
    multi.sourceVaultLinks.includes(
      "multi-character-world-narration/references/multi_character_world_reaction_guide.md",
    ),
  );
  assert.ok(multi.continuityLinks.includes("npc-continuity"));
  assert.ok(multi.continuityLinks.includes("social-worldbuilding-driver"));
  assert.match(multi.guardrails.join(" "), /all NPCs agree/);
  assert.match(multi.guardrails.join(" "), /\{\{user\}\} thoughts/);
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
