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
  assert.ok(powerDynamics.activationTags.includes("explicit_intimacy_mechanics"));
  assert.ok(powerDynamics.activationTags.includes("explicit_scene_choreography"));
  assert.ok(powerDynamics.triggerSeeds.includes("degradation"));
  assert.ok(powerDynamics.triggerSeeds.includes("position family"));
  assert.ok(powerDynamics.triggerSeeds.includes("sensory pacing"));
  assert.ok(powerDynamics.stateFields.includes("active_power_dynamic"));
  assert.ok(powerDynamics.stateFields.includes("movement_mechanics"));
  assert.ok(powerDynamics.stateFields.includes("position_family"));
  assert.ok(powerDynamics.stateFields.includes("environment_risk_context"));
  assert.ok(powerDynamics.stateFields.includes("boundary_state"));
  assert.ok(
    powerDynamics.promptCompilerSignals.includes("explicit-register-check"),
  );
  assert.ok(
    powerDynamics.promptCompilerSignals.includes("position-family-check"),
  );
  assert.ok(
    powerDynamics.sourceVaultLinks.includes(
      "power-dynamics-scene-writing/references/kink_sensation_edgeplay_logic.md",
    ),
  );
  assert.ok(
    powerDynamics.sourceVaultLinks.includes(
      "dominance-and-intimacy-flow/references/explicit_intimacy_scene_mechanics.md",
    ),
  );
  assert.ok(
    powerDynamics.sourceVaultLinks.includes(
      "dominance-and-intimacy-flow/references/explicit_scene_choreography_router.md",
    ),
  );
  assert.ok(powerDynamics.continuityLinks.includes("explicit-memory-core"));
  assert.ok(powerDynamics.continuityLinks.includes("domain-vocabulary-seeds"));
  assert.match(powerDynamics.guardrails.join(" "), /operational instruction/);
  assert.match(powerDynamics.guardrails.join(" "), /euphemise/);
  assert.match(powerDynamics.guardrails.join(" "), /\{\{user\}\} thoughts/);
});

test("erotic dynamics prose calibrates heat as camera distance and character voice", () => {
  const prose = requireSkill("erotic-dynamics-prose");

  assert.equal(prose.category, "roleplay-response");
  assert.equal(prose.source, "heartwrite_memory_vault");
  assert.ok(prose.scope.includes("prompt_book"));
  assert.ok(prose.scope.includes("character_book"));
  assert.ok(prose.scope.includes("scenario_book"));
  assert.ok(prose.scope.includes("memory_book"));
  assert.ok(prose.activationTags.includes("heat_register_calibration"));
  assert.ok(prose.activationTags.includes("camera_dial_not_plot_dial"));
  assert.ok(prose.activationTags.includes("voice_card"));
  assert.ok(prose.activationTags.includes("attention_consequence_heat"));
  assert.ok(prose.activationTags.includes("authority_signature_variety"));
  assert.ok(prose.triggerSeeds.includes("camera dial"));
  assert.ok(prose.triggerSeeds.includes("voice card"));
  assert.ok(prose.triggerSeeds.includes("flat and floaty"));
  assert.ok(prose.triggerSeeds.includes("hot but empty"));
  assert.ok(prose.stateFields.includes("requested_heat_register"));
  assert.ok(prose.stateFields.includes("camera_distance"));
  assert.ok(prose.stateFields.includes("voice_card_status"));
  assert.ok(prose.stateFields.includes("authority_signature"));
  assert.ok(prose.stateFields.includes("attention_read"));
  assert.ok(prose.stateFields.includes("landing_required"));
  assert.ok(prose.promptCompilerSignals.includes("heat-register-check"));
  assert.ok(prose.promptCompilerSignals.includes("camera-distance-check"));
  assert.ok(prose.promptCompilerSignals.includes("voice-card-required"));
  assert.ok(prose.promptCompilerSignals.includes("authority-variety-check"));
  assert.ok(prose.promptCompilerSignals.includes("landing-required-check"));
  assert.ok(prose.sourceVaultLinks.includes("erotic-dynamics-prose/SKILL.md"));
  assert.ok(
    prose.sourceVaultLinks.includes(
      "erotic-dynamics-prose/references/dynamics-deep.md",
    ),
  );
  assert.ok(
    prose.sourceVaultLinks.includes(
      "erotic-dynamics-prose/references/heat-levels.md",
    ),
  );
  assert.ok(
    prose.sourceVaultLinks.includes(
      "erotic-dynamics-prose/references/voice-card.md",
    ),
  );
  assert.ok(prose.continuityLinks.includes("power-dynamics-scene-writing"));
  assert.ok(prose.continuityLinks.includes("erotic-archetypes-engine"));
  assert.ok(prose.continuityLinks.includes("romantic-speech-pattern"));
  assert.match(prose.guardrails.join(" "), /camera distance/);
  assert.match(prose.guardrails.join(" "), /stillness or low speech/);
  assert.match(prose.guardrails.join(" "), /claim the person/);
  assert.match(prose.guardrails.join(" "), /\{\{user\}\} thoughts/);
});

test("dominance and intimacy flow links explicit somatic flow resource", () => {
  const intimacyFlow = requireSkill("dominance-and-intimacy-flow");

  assert.equal(intimacyFlow.category, "roleplay-response");
  assert.ok(intimacyFlow.activationTags.includes("explicit_scene_flow"));
  assert.ok(intimacyFlow.activationTags.includes("explicit_intimacy_mechanics"));
  assert.ok(intimacyFlow.activationTags.includes("explicit_scene_choreography"));
  assert.ok(intimacyFlow.activationTags.includes("position_family_routing"));
  assert.ok(intimacyFlow.activationTags.includes("sensory_pacing"));
  assert.ok(intimacyFlow.stateFields.includes("arousal_response"));
  assert.ok(intimacyFlow.stateFields.includes("position_family"));
  assert.ok(intimacyFlow.stateFields.includes("environment_risk_context"));
  assert.ok(intimacyFlow.stateFields.includes("consent_boundary_state"));
  assert.ok(intimacyFlow.stateFields.includes("protection_or_risk_state"));
  assert.ok(intimacyFlow.stateFields.includes("aftercare_pending"));
  assert.ok(intimacyFlow.promptCompilerSignals.includes("transition-to-aftercare"));
  assert.ok(
    intimacyFlow.promptCompilerSignals.includes(
      "explicit-intimacy-mechanics-check",
    ),
  );
  assert.ok(
    intimacyFlow.promptCompilerSignals.includes("explicit-choreography-route"),
  );
  assert.ok(intimacyFlow.promptCompilerSignals.includes("position-family-check"));
  assert.ok(
    intimacyFlow.promptCompilerSignals.includes("mechanics-with-agency-check"),
  );
  assert.ok(
    intimacyFlow.sourceVaultLinks.includes(
      "dominance-and-intimacy-flow/references/sexual_somatic_flow_and_afterglow.md",
    ),
  );
  assert.ok(
    intimacyFlow.sourceVaultLinks.includes(
      "dominance-and-intimacy-flow/references/explicit_intimacy_scene_mechanics.md",
    ),
  );
  assert.ok(
    intimacyFlow.sourceVaultLinks.includes(
      "dominance-and-intimacy-flow/references/explicit_scene_choreography_router.md",
    ),
  );
  assert.ok(intimacyFlow.continuityLinks.includes("power-dynamics-scene-writing"));
  assert.match(intimacyFlow.guardrails.join(" "), /operational instruction/);
  assert.match(intimacyFlow.guardrails.join(" "), /adult fictional framing/);
  assert.match(intimacyFlow.guardrails.join(" "), /explicit vocabulary/);
  assert.match(intimacyFlow.guardrails.join(" "), /\{\{user\}\} input/);
});

test("erotic archetypes engine maps desire profiles without turning them into labels", () => {
  const archetypes = requireSkill("erotic-archetypes-engine");

  assert.equal(archetypes.category, "roleplay-response");
  assert.equal(archetypes.source, "heartwrite_memory_vault");
  assert.ok(archetypes.scope.includes("character_book"));
  assert.ok(archetypes.scope.includes("prompt_book"));
  assert.ok(archetypes.activationTags.includes("erotic_archetypes"));
  assert.ok(archetypes.activationTags.includes("desire_profiles"));
  assert.ok(archetypes.activationTags.includes("power_role_tendency"));
  assert.ok(archetypes.activationTags.includes("sensory_register_routing"));
  assert.ok(archetypes.triggerSeeds.includes("erotic blueprint"));
  assert.ok(archetypes.triggerSeeds.includes("desire profile"));
  assert.ok(archetypes.triggerSeeds.includes("brat dynamic"));
  assert.ok(archetypes.stateFields.includes("primary_desire_profile"));
  assert.ok(archetypes.stateFields.includes("power_role_tendency"));
  assert.ok(archetypes.stateFields.includes("pairing_friction"));
  assert.ok(archetypes.stateFields.includes("sensory_register"));
  assert.ok(
    archetypes.promptCompilerSignals.includes("erotic-archetype-route"),
  );
  assert.ok(
    archetypes.promptCompilerSignals.includes("profile-not-label-check"),
  );
  assert.ok(
    archetypes.sourceVaultLinks.includes(
      "erotic-archetypes-engine/references/erotic_blueprints.md",
    ),
  );
  assert.ok(
    archetypes.sourceVaultLinks.includes(
      "erotic-archetypes-engine/references/power_dynamics.md",
    ),
  );
  assert.ok(
    archetypes.sourceVaultLinks.includes(
      "erotic-archetypes-engine/references/sensory_textures.md",
    ),
  );
  assert.ok(archetypes.continuityLinks.includes("characterisation"));
  assert.ok(archetypes.continuityLinks.includes("dominance-and-intimacy-flow"));
  assert.ok(archetypes.continuityLinks.includes("explicit-memory-core"));
  assert.match(archetypes.guardrails.join(" "), /flexible story lenses/);
  assert.match(archetypes.guardrails.join(" "), /one erotic label/);
  assert.match(archetypes.guardrails.join(" "), /\{\{user\}\} thoughts/);
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
  assert.ok(
    emotionalEscalation.activationTags.includes("confession_truth_rupture"),
  );
  assert.ok(emotionalEscalation.activationTags.includes("cost_of_truth"));
  assert.ok(emotionalEscalation.triggerSeeds.includes("almost confession"));
  assert.ok(emotionalEscalation.triggerSeeds.includes("love confession"));
  assert.ok(emotionalEscalation.triggerSeeds.includes("deep secret"));
  assert.ok(emotionalEscalation.stateFields.includes("partial_admission"));
  assert.ok(emotionalEscalation.stateFields.includes("emotional_truth"));
  assert.ok(emotionalEscalation.stateFields.includes("truth_cost"));
  assert.ok(emotionalEscalation.stateFields.includes("rupture_trigger"));
  assert.ok(emotionalEscalation.stateFields.includes("immediate_fallout"));
  assert.ok(emotionalEscalation.stateFields.includes("irreversible_shift"));
  assert.ok(emotionalEscalation.stateFields.includes("emotional_crosscurrent"));
  assert.ok(
    emotionalEscalation.promptCompilerSignals.includes("advance-one-stage"),
  );
  assert.ok(
    emotionalEscalation.promptCompilerSignals.includes(
      "confession-rupture-check",
    ),
  );
  assert.ok(
    emotionalEscalation.promptCompilerSignals.includes("truth-cost-check"),
  );
  assert.ok(
    emotionalEscalation.promptCompilerSignals.includes(
      "impossible-aftermath-check",
    ),
  );
  assert.ok(
    emotionalEscalation.sourceVaultLinks.includes(
      "emotional-escalation/references/emotional_escalation_framework.md",
    ),
  );
  assert.ok(
    emotionalEscalation.sourceVaultLinks.includes(
      "emotional-escalation/references/confession_truth_rupture_system.md",
    ),
  );
  assert.ok(emotionalEscalation.continuityLinks.includes("relationship-tracker"));
  assert.match(
    emotionalEscalation.guardrails.join(" "),
    /instant confession/,
  );
  assert.match(emotionalEscalation.guardrails.join(" "), /instant repair/);
});

test("romantic tension builder supports slow burn pacing", () => {
  const tension = requireSkill("romantic-tension-builder");

  assert.equal(tension.category, "roleplay-response");
  assert.equal(tension.source, "heartwrite_memory_vault");
  assert.ok(tension.scope.includes("scenario_book"));
  assert.ok(tension.scope.includes("memory_book"));
  assert.ok(tension.activationTags.includes("slow_burn_system"));
  assert.ok(tension.activationTags.includes("earned_intimacy"));
  assert.ok(tension.activationTags.includes("no_fast_forwarding"));
  assert.ok(tension.activationTags.includes("half_brave_gesture"));
  assert.ok(tension.activationTags.includes("unspoken_desire_tension"));
  assert.ok(tension.activationTags.includes("motivated_silence"));
  assert.ok(tension.activationTags.includes("internal_wall"));
  assert.ok(tension.triggerSeeds.includes("slow burn"));
  assert.ok(tension.triggerSeeds.includes("earned intimacy"));
  assert.ok(tension.triggerSeeds.includes("half-brave gesture"));
  assert.ok(tension.triggerSeeds.includes("testing safety"));
  assert.ok(tension.triggerSeeds.includes("unspoken desire"));
  assert.ok(tension.triggerSeeds.includes("motivated silence"));
  assert.ok(tension.stateFields.includes("slow_burn_pacing_state"));
  assert.ok(tension.stateFields.includes("attraction_evidence"));
  assert.ok(tension.stateFields.includes("trust_evidence"));
  assert.ok(tension.stateFields.includes("safety_test"));
  assert.ok(tension.stateFields.includes("desire_cost"));
  assert.ok(tension.stateFields.includes("internal_wall"));
  assert.ok(tension.stateFields.includes("silence_motivation"));
  assert.ok(tension.stateFields.includes("leak_or_tell"));
  assert.ok(tension.stateFields.includes("unresolved_edge"));
  assert.ok(tension.stateFields.includes("missing_evidence"));
  assert.ok(tension.promptCompilerSignals.includes("slow-burn-active"));
  assert.ok(tension.promptCompilerSignals.includes("no-fast-forward"));
  assert.ok(tension.promptCompilerSignals.includes("earned-intimacy-check"));
  assert.ok(tension.promptCompilerSignals.includes("hold-before-confession"));
  assert.ok(tension.promptCompilerSignals.includes("motivated-silence-check"));
  assert.ok(tension.promptCompilerSignals.includes("desire-cost-check"));
  assert.ok(tension.promptCompilerSignals.includes("internal-wall-check"));
  assert.ok(tension.promptCompilerSignals.includes("leak-pullback-check"));
  assert.ok(
    tension.sourceVaultLinks.includes(
      "romantic-tension-builder/references/slow_burn_pacing_system.md",
    ),
  );
  assert.ok(
    tension.sourceVaultLinks.includes(
      "romantic-tension-builder/references/unspoken_desire_tension_system.md",
    ),
  );
  assert.ok(tension.continuityLinks.includes("relationship-tracker"));
  assert.ok(tension.continuityLinks.includes("emotional-escalation"));
  assert.ok(tension.continuityLinks.includes("escalating-proximity"));
  assert.match(tension.guardrails.join(" "), /\{\{user\}\} thoughts/);
  assert.match(tension.guardrails.join(" "), /physical attraction/);
  assert.match(tension.guardrails.join(" "), /stall forever/);
  assert.match(tension.guardrails.join(" "), /concrete wall/);
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
  assert.ok(
    subtext.sourceVaultLinks.includes(
      "emotional-subtext-engine/references/subtext_writing_principles.md",
    ),
  );
  assert.ok(
    subtext.sourceVaultLinks.includes(
      "emotional-subtext-engine/references/subtext_workshop_exercises.md",
    ),
  );
  assert.ok(
    subtext.promptCompilerSignals.includes("subtext-workshop-check"),
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
  assert.ok(relationship.activationTags.includes("relationship_arc_beats"));
  assert.ok(relationship.activationTags.includes("love_proving_moment"));
  assert.ok(relationship.activationTags.includes("earned_break"));
  assert.ok(relationship.activationTags.includes("competing_want"));
  assert.ok(relationship.activationTags.includes("sacrificial_grovel"));
  assert.ok(relationship.activationTags.includes("trust_repair"));
  assert.ok(relationship.triggerSeeds.includes("relationship framework"));
  assert.ok(relationship.triggerSeeds.includes("relationship milestone"));
  assert.ok(relationship.triggerSeeds.includes("moving in together"));
  assert.ok(relationship.triggerSeeds.includes("relationship beats"));
  assert.ok(relationship.triggerSeeds.includes("first intimate moment"));
  assert.ok(relationship.triggerSeeds.includes("love proving moment"));
  assert.ok(relationship.triggerSeeds.includes("breakup"));
  assert.ok(relationship.triggerSeeds.includes("walks away"));
  assert.ok(relationship.triggerSeeds.includes("competing want"));
  assert.ok(relationship.triggerSeeds.includes("grovel"));
  assert.ok(relationship.triggerSeeds.includes("earn forgiveness"));
  assert.ok(relationship.triggerSeeds.includes("tangible sacrifice"));
  assert.ok(relationship.triggerSeeds.includes("BRANCH"));
  assert.ok(relationship.stateFields.includes("dominant_type"));
  assert.ok(relationship.stateFields.includes("milestone_plausibility"));
  assert.ok(relationship.stateFields.includes("trust_web"));
  assert.ok(relationship.stateFields.includes("blocked_or_premature_beats"));
  assert.ok(relationship.stateFields.includes("relationship_arc_beat"));
  assert.ok(relationship.stateFields.includes("missing_setup"));
  assert.ok(relationship.stateFields.includes("new_status_quo"));
  assert.ok(relationship.stateFields.includes("break_reason"));
  assert.ok(relationship.stateFields.includes("threshold_event"));
  assert.ok(relationship.stateFields.includes("repair_requirement"));
  assert.ok(relationship.stateFields.includes("armor_surrendered"));
  assert.ok(relationship.stateFields.includes("tangible_sacrifice"));
  assert.ok(relationship.stateFields.includes("future_evidence_required"));
  assert.ok(relationship.promptCompilerSignals.includes("milestone-assessment"));
  assert.ok(relationship.promptCompilerSignals.includes("plausibility-check"));
  assert.ok(relationship.promptCompilerSignals.includes("canon-fit"));
  assert.ok(
    relationship.promptCompilerSignals.includes(
      "relationship-arc-beats-check",
    ),
  );
  assert.ok(
    relationship.promptCompilerSignals.includes(
      "love-proving-moment-check",
    ),
  );
  assert.ok(
    relationship.promptCompilerSignals.includes("earned-break-check"),
  );
  assert.ok(
    relationship.promptCompilerSignals.includes(
      "separation-aftermath-check",
    ),
  );
  assert.ok(
    relationship.promptCompilerSignals.includes(
      "sacrificial-grovel-check",
    ),
  );
  assert.ok(
    relationship.promptCompilerSignals.includes(
      "forgiveness-not-forced-check",
    ),
  );
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
  assert.ok(
    relationship.sourceVaultLinks.includes(
      "relationship-tracker/references/relationship_arc_scene_beats.md",
    ),
  );
  assert.ok(
    relationship.sourceVaultLinks.includes(
      "relationship-tracker/references/earned_break_separation_system.md",
    ),
  );
  assert.ok(
    relationship.sourceVaultLinks.includes(
      "relationship-tracker/references/sacrificial_grovel_repair_system.md",
    ),
  );
  assert.ok(relationship.continuityLinks.includes("intimacy-shift"));
  assert.ok(relationship.continuityLinks.includes("knowledge-boundary-response"));
  assert.match(relationship.guardrails.join(" "), /numeric matrix/);
  assert.match(relationship.guardrails.join(" "), /mandatory staircase/);
  assert.match(relationship.guardrails.join(" "), /required sequence/);
  assert.match(relationship.guardrails.join(" "), /force a breakup/);
  assert.match(relationship.guardrails.join(" "), /apology words/);
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
  assert.ok(storyIdea.activationTags.includes("opening_hook"));
  assert.ok(storyIdea.activationTags.includes("inciting_incident"));
  assert.ok(storyIdea.activationTags.includes("meet_cute_system"));
  assert.ok(storyIdea.activationTags.includes("spark_obstacle"));
  assert.ok(storyIdea.activationTags.includes("trope_world"));
  assert.ok(storyIdea.activationTags.includes("three_act_emotional_arc"));
  assert.ok(storyIdea.triggerSeeds.includes("trope world"));
  assert.ok(storyIdea.triggerSeeds.includes("opening hook"));
  assert.ok(storyIdea.triggerSeeds.includes("inciting incident"));
  assert.ok(storyIdea.triggerSeeds.includes("first chapter"));
  assert.ok(storyIdea.triggerSeeds.includes("meet cute"));
  assert.ok(storyIdea.triggerSeeds.includes("first encounter"));
  assert.ok(storyIdea.triggerSeeds.includes("spark plus obstacle"));
  assert.ok(storyIdea.triggerSeeds.includes("character need"));
  assert.ok(storyIdea.triggerSeeds.includes("psychological flaw"));
  assert.ok(storyIdea.stateFields.includes("reader_promise"));
  assert.ok(storyIdea.stateFields.includes("status_quo"));
  assert.ok(storyIdea.stateFields.includes("interruption"));
  assert.ok(storyIdea.stateFields.includes("first_action"));
  assert.ok(storyIdea.stateFields.includes("spark"));
  assert.ok(storyIdea.stateFields.includes("obstacle"));
  assert.ok(storyIdea.stateFields.includes("same_glance_evidence"));
  assert.ok(storyIdea.stateFields.includes("desire_before_safety"));
  assert.ok(storyIdea.stateFields.includes("next_scene_pressure"));
  assert.ok(storyIdea.stateFields.includes("character_desire"));
  assert.ok(storyIdea.stateFields.includes("character_need"));
  assert.ok(storyIdea.stateFields.includes("character_lie"));
  assert.ok(storyIdea.stateFields.includes("care_goal"));
  assert.ok(storyIdea.promptCompilerSignals.includes("character-engine-check"));
  assert.ok(storyIdea.promptCompilerSignals.includes("story-concept-generation"));
  assert.ok(storyIdea.promptCompilerSignals.includes("opening-hook-route"));
  assert.ok(storyIdea.promptCompilerSignals.includes("inciting-incident-check"));
  assert.ok(storyIdea.promptCompilerSignals.includes("status-quo-interruption-action"));
  assert.ok(storyIdea.promptCompilerSignals.includes("meet-cute-check"));
  assert.ok(storyIdea.promptCompilerSignals.includes("spark-obstacle-pairing"));
  assert.ok(storyIdea.promptCompilerSignals.includes("same-glance-check"));
  assert.ok(storyIdea.promptCompilerSignals.includes("desire-before-safety-check"));
  assert.ok(storyIdea.promptCompilerSignals.includes("gmcs-voice-route"));
  assert.ok(storyIdea.promptCompilerSignals.includes("fresh-romance-strategy-check"));
  assert.ok(storyIdea.promptCompilerSignals.includes("trope-world-check"));
  assert.ok(
    storyIdea.sourceVaultLinks.includes(
      "story-idea-generator/references/character_arc_need_desire_engine.md",
    ),
  );
  assert.ok(
    storyIdea.sourceVaultLinks.includes(
      "story-idea-generator/references/story_crafting_engine_router.md",
    ),
  );
  assert.ok(
    storyIdea.sourceVaultLinks.includes(
      "story-idea-generator/references/meet_cute_first_contact_system.md",
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

test("narrative complications engine routes subplots secrets and macguffins", () => {
  const complications = requireSkill("narrative-complications-engine");

  assert.equal(complications.category, "story-development");
  assert.equal(complications.source, "heartwrite_memory_vault");
  assert.ok(complications.scope.includes("prompt_book"));
  assert.ok(complications.scope.includes("scenario_book"));
  assert.ok(complications.scope.includes("world_book"));
  assert.ok(complications.activationTags.includes("subplot_engine"));
  assert.ok(complications.activationTags.includes("secrets_revelations"));
  assert.ok(complications.activationTags.includes("macguffin_engine"));
  assert.ok(complications.activationTags.includes("reveal_aftermath"));
  assert.ok(complications.triggerSeeds.includes("relationship subplot"));
  assert.ok(complications.triggerSeeds.includes("secret reveal"));
  assert.ok(complications.triggerSeeds.includes("MacGuffin"));
  assert.ok(complications.triggerSeeds.includes("living MacGuffin"));
  assert.ok(complications.stateFields.includes("mode"));
  assert.ok(complications.stateFields.includes("secret_holder"));
  assert.ok(complications.stateFields.includes("secret_seeker"));
  assert.ok(complications.stateFields.includes("macguffin_status"));
  assert.ok(complications.stateFields.includes("legitimate_claimants"));
  assert.ok(
    complications.promptCompilerSignals.includes(
      "narrative-complication-route",
    ),
  );
  assert.ok(complications.promptCompilerSignals.includes("subplot-build-check"));
  assert.ok(
    complications.promptCompilerSignals.includes("secret-revelation-check"),
  );
  assert.ok(
    complications.promptCompilerSignals.includes("macguffin-pressure-check"),
  );
  assert.ok(complications.promptCompilerSignals.includes("failure-mode-check"));
  assert.ok(
    complications.sourceVaultLinks.includes(
      "narrative-complications-engine/references/subplots_engine.md",
    ),
  );
  assert.ok(
    complications.sourceVaultLinks.includes(
      "narrative-complications-engine/references/secrets_revelations_engine.md",
    ),
  );
  assert.ok(
    complications.sourceVaultLinks.includes(
      "narrative-complications-engine/references/macguffin_quest_object_engine.md",
    ),
  );
  assert.ok(complications.continuityLinks.includes("story-idea-generator"));
  assert.ok(complications.continuityLinks.includes("relationship-tracker"));
  assert.ok(
    complications.continuityLinks.includes("knowledge-boundary-response"),
  );
  assert.ok(complications.continuityLinks.includes("motive-tracker"));
  assert.match(complications.guardrails.join(" "), /\{\{user\}\} agency/);
  assert.match(complications.guardrails.join(" "), /force romance/);
  assert.match(complications.guardrails.join(" "), /secrets leak/);
  assert.match(complications.guardrails.join(" "), /living MacGuffins/);
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
  assert.ok(gmcs.activationTags.includes("character_agency_check"));
  assert.ok(gmcs.activationTags.includes("action_reaction_loop"));
  assert.ok(gmcs.triggerSeeds.includes("character GMCS"));
  assert.ok(gmcs.triggerSeeds.includes("why does this character care"));
  assert.ok(gmcs.stateFields.includes("story_goal"));
  assert.ok(gmcs.stateFields.includes("character_goal"));
  assert.ok(gmcs.stateFields.includes("character_motivation"));
  assert.ok(gmcs.stateFields.includes("character_conflict"));
  assert.ok(gmcs.stateFields.includes("character_stakes"));
  assert.ok(gmcs.stateFields.includes("scene_application"));
  assert.ok(gmcs.stateFields.includes("external_pressure"));
  assert.ok(gmcs.stateFields.includes("plot_reaction"));
  assert.ok(gmcs.promptCompilerSignals.includes("character-gmcs-map"));
  assert.ok(gmcs.promptCompilerSignals.includes("story-gmcs-alignment"));
  assert.ok(gmcs.promptCompilerSignals.includes("scene-action-alignment"));
  assert.ok(gmcs.promptCompilerSignals.includes("character-agency-check"));
  assert.ok(gmcs.promptCompilerSignals.includes("action-reaction-loop"));
  assert.ok(
    gmcs.promptCompilerSignals.includes("passive-character-diagnostic"),
  );
  assert.ok(
    gmcs.promptCompilerSignals.includes("overpowered-character-diagnostic"),
  );
  assert.ok(
    gmcs.sourceVaultLinks.includes(
      "character-gmcs/references/character_gmcs_alignment_worksheet.md",
    ),
  );
  assert.ok(
    gmcs.sourceVaultLinks.includes(
      "character-gmcs/references/gmcs_agency_plot_integration.md",
    ),
  );
  assert.ok(gmcs.continuityLinks.includes("character-arc-structure"));
  assert.ok(gmcs.continuityLinks.includes("romance-conflict-outliner"));
  assert.ok(gmcs.continuityLinks.includes("scene-sequel-structure"));
  assert.match(gmcs.guardrails.join(" "), /protagonist's exact goal/);
  assert.match(gmcs.guardrails.join(" "), /passive/);
  assert.match(gmcs.guardrails.join(" "), /competence/);
  assert.match(gmcs.guardrails.join(" "), /\{\{user\}\} goals/);
});

test("motive tracker maps motive states and intent reframing", () => {
  const motive = requireSkill("motive-tracker");

  assert.equal(motive.category, "roleplay-response");
  assert.equal(motive.source, "heartwrite_memory_vault");
  assert.ok(motive.scope.includes("character_book"));
  assert.ok(motive.scope.includes("scenario_book"));
  assert.ok(motive.scope.includes("memory_book"));
  assert.ok(motive.activationTags.includes("active_motive"));
  assert.ok(motive.activationTags.includes("blocked_motive"));
  assert.ok(motive.activationTags.includes("conflicted_motive"));
  assert.ok(motive.activationTags.includes("motive_interpretation"));
  assert.ok(motive.activationTags.includes("intent_reframe"));
  assert.ok(motive.activationTags.includes("moral_weight"));
  assert.ok(motive.triggerSeeds.includes("why did they do that"));
  assert.ok(motive.triggerSeeds.includes("what was their intention"));
  assert.ok(motive.triggerSeeds.includes("hidden motive"));
  assert.ok(motive.stateFields.includes("motive_state"));
  assert.ok(motive.stateFields.includes("blockers"));
  assert.ok(motive.stateFields.includes("competing_motives"));
  assert.ok(motive.stateFields.includes("observed_action"));
  assert.ok(motive.stateFields.includes("motive_hypotheses"));
  assert.ok(motive.stateFields.includes("moral_weight"));
  assert.ok(motive.stateFields.includes("identity_reframe"));
  assert.ok(motive.stateFields.includes("confidence"));
  assert.ok(motive.promptCompilerSignals.includes("motive-state-update"));
  assert.ok(motive.promptCompilerSignals.includes("active-motive-check"));
  assert.ok(motive.promptCompilerSignals.includes("blocked-motive-check"));
  assert.ok(motive.promptCompilerSignals.includes("conflicted-motive-check"));
  assert.ok(motive.promptCompilerSignals.includes("motive-interpretation-check"));
  assert.ok(motive.promptCompilerSignals.includes("intent-reframe-check"));
  assert.ok(motive.promptCompilerSignals.includes("moral-weight-check"));
  assert.ok(motive.promptCompilerSignals.includes("motive-confidence-check"));
  assert.ok(motive.sourceVaultLinks.includes("motive-tracker/SKILL.md"));
  assert.ok(
    motive.sourceVaultLinks.includes(
      "motive-tracker/references/motive_interpretation_and_moral_weight.md",
    ),
  );
  assert.ok(motive.sourceVaultLinks.includes("personality-values-and-morals/SKILL.md"));
  assert.ok(motive.continuityLinks.includes("character-gmcs"));
  assert.ok(motive.continuityLinks.includes("personality-values-and-morals"));
  assert.ok(motive.continuityLinks.includes("flaw-preservation"));
  assert.ok(motive.continuityLinks.includes("knowledge-boundary-response"));
  assert.match(motive.guardrails.join(" "), /\{\{user\}\} agency/);
  assert.match(motive.guardrails.join(" "), /moralize through the narrator/);
  assert.match(motive.guardrails.join(" "), /motive confidence/);
});

test("character arc structure maps lie truth want need and plot-point evidence", () => {
  const arc = requireSkill("character-arc-structure");

  assert.equal(arc.category, "story-development");
  assert.equal(arc.source, "heartwrite_memory_vault");
  assert.ok(arc.scope.includes("character_book"));
  assert.ok(arc.scope.includes("scenario_book"));
  assert.ok(arc.activationTags.includes("positive_change_arc"));
  assert.ok(arc.activationTags.includes("lie_truth_arc"));
  assert.ok(arc.activationTags.includes("want_need_split"));
  assert.ok(arc.activationTags.includes("reactive_to_active_shift"));
  assert.ok(arc.activationTags.includes("transformation_evidence"));
  assert.ok(arc.triggerSeeds.includes("character arc"));
  assert.ok(arc.triggerSeeds.includes("Inciting Event"));
  assert.ok(arc.triggerSeeds.includes("Third Plot Point"));
  assert.ok(arc.triggerSeeds.includes("Resolution baseline"));
  assert.ok(arc.stateFields.includes("character_lie"));
  assert.ok(arc.stateFields.includes("counter_truth"));
  assert.ok(arc.stateFields.includes("ghost_wound"));
  assert.ok(arc.stateFields.includes("lie_based_tactics"));
  assert.ok(arc.stateFields.includes("reactive_to_active_shift"));
  assert.ok(arc.stateFields.includes("truth_choice"));
  assert.ok(arc.stateFields.includes("midpoint_revelation"));
  assert.ok(arc.stateFields.includes("climax_proof"));
  assert.ok(arc.promptCompilerSignals.includes("internal-elements-check"));
  assert.ok(arc.promptCompilerSignals.includes("act-one-setup-check"));
  assert.ok(arc.promptCompilerSignals.includes("act-two-struggle-check"));
  assert.ok(arc.promptCompilerSignals.includes("act-three-climax-check"));
  assert.ok(arc.promptCompilerSignals.includes("lie-truth-check"));
  assert.ok(arc.promptCompilerSignals.includes("third-plot-point-sacrifice"));
  assert.ok(arc.promptCompilerSignals.includes("resolution-baseline"));
  assert.ok(arc.sourceVaultLinks.includes("character-arc-structure/references/internal_elements.md"));
  assert.ok(arc.sourceVaultLinks.includes("character-arc-structure/references/act_one_setup.md"));
  assert.ok(arc.sourceVaultLinks.includes("character-arc-structure/references/act_two_struggle.md"));
  assert.ok(arc.sourceVaultLinks.includes("character-arc-structure/references/act_three_climax.md"));
  assert.ok(arc.sourceVaultLinks.includes("character-gmcs/SKILL.md"));
  assert.ok(arc.continuityLinks.includes("character-gmcs"));
  assert.ok(arc.continuityLinks.includes("story-idea-generator"));
  assert.ok(arc.continuityLinks.includes("scene-sequel-structure"));
  assert.ok(arc.continuityLinks.includes("romance-conflict-outliner"));
  assert.ok(arc.continuityLinks.includes("crafting-satisfying-ending"));
  assert.match(arc.guardrails.join(" "), /moral correction/);
  assert.match(arc.guardrails.join(" "), /revelation as full transformation/);
  assert.match(arc.guardrails.join(" "), /\{\{user\}\}'s arc/);
});

test("archetypal character arcs map life-cycle shadows and impact roles", () => {
  const archetype = requireSkill("archetypal-character-arcs");

  assert.equal(archetype.category, "story-development");
  assert.equal(archetype.source, "heartwrite_memory_vault");
  assert.ok(archetype.scope.includes("character_book"));
  assert.ok(archetype.scope.includes("prompt_book"));
  assert.ok(archetype.activationTags.includes("life_cycle_arcs"));
  assert.ok(archetype.activationTags.includes("positive_change_archetypes"));
  assert.ok(archetype.activationTags.includes("shadow_archetypes"));
  assert.ok(archetype.activationTags.includes("flat_impact_archetypes"));
  assert.ok(archetype.activationTags.includes("death_rebirth_beat"));
  assert.ok(archetype.triggerSeeds.includes("archetypal arc"));
  assert.ok(archetype.triggerSeeds.includes("Maiden Arc"));
  assert.ok(archetype.triggerSeeds.includes("Mage Arc"));
  assert.ok(archetype.triggerSeeds.includes("shadow archetype"));
  assert.ok(archetype.triggerSeeds.includes("impact character"));
  assert.ok(archetype.stateFields.includes("archetypal_lie"));
  assert.ok(archetype.stateFields.includes("archetypal_truth"));
  assert.ok(archetype.stateFields.includes("shadow_polarity"));
  assert.ok(archetype.stateFields.includes("flat_impact_role"));
  assert.ok(archetype.stateFields.includes("death_rebirth_beat"));
  assert.ok(archetype.promptCompilerSignals.includes("archetypal-arc-route"));
  assert.ok(archetype.promptCompilerSignals.includes("positive-change-archetype-check"));
  assert.ok(archetype.promptCompilerSignals.includes("shadow-polarity-check"));
  assert.ok(archetype.promptCompilerSignals.includes("flat-impact-role-check"));
  assert.ok(archetype.promptCompilerSignals.includes("archetype-not-label-check"));
  assert.ok(archetype.sourceVaultLinks.includes("archetypal-character-arcs/SKILL.md"));
  assert.ok(
    archetype.sourceVaultLinks.includes(
      "archetypal-character-arcs/references/positive_change_arcs.md",
    ),
  );
  assert.ok(
    archetype.sourceVaultLinks.includes(
      "archetypal-character-arcs/references/shadow_archetypes.md",
    ),
  );
  assert.ok(
    archetype.sourceVaultLinks.includes(
      "archetypal-character-arcs/references/flat_archetypes.md",
    ),
  );
  assert.ok(
    archetype.sourceVaultLinks.includes(
      "archetypal-character-arcs/references/structural_beats.md",
    ),
  );
  assert.ok(archetype.continuityLinks.includes("character-arc-structure"));
  assert.ok(archetype.continuityLinks.includes("character-gmcs"));
  assert.ok(archetype.continuityLinks.includes("flaw-preservation"));
  assert.ok(archetype.continuityLinks.includes("personality-gradual-development"));
  assert.match(archetype.guardrails.join(" "), /age, gender/);
  assert.match(archetype.guardrails.join(" "), /single label/);
  assert.match(archetype.guardrails.join(" "), /shadow archetypes as automatic villainy/);
  assert.match(archetype.guardrails.join(" "), /\{\{user\}\}'s inner life/);
});

test("flaw preservation routes character-flaw-system without duplicating the skill", () => {
  const flaw = requireSkill("flaw-preservation");

  assert.equal(flaw.category, "roleplay-response");
  assert.equal(flaw.source, "heartwrite_memory_vault");
  assert.ok(flaw.scope.includes("character_book"));
  assert.ok(flaw.scope.includes("scenario_book"));
  assert.ok(flaw.scope.includes("memory_book"));
  assert.ok(flaw.scope.includes("prompt_book"));
  assert.ok(flaw.activationTags.includes("flaw_preservation"));
  assert.ok(flaw.activationTags.includes("character_flaw_system"));
  assert.ok(flaw.activationTags.includes("flaw_consequence"));
  assert.ok(flaw.activationTags.includes("earned_change"));
  assert.ok(flaw.activationTags.includes("resist_correction"));
  assert.ok(flaw.triggerSeeds.includes("character-flaw-system"));
  assert.ok(flaw.triggerSeeds.includes("messy characterization"));
  assert.ok(flaw.triggerSeeds.includes("resist correction"));
  assert.ok(flaw.stateFields.includes("recognition_level"));
  assert.ok(flaw.stateFields.includes("earned_change_evidence"));
  assert.ok(flaw.promptCompilerSignals.includes("character-flaw-system-route"));
  assert.ok(flaw.promptCompilerSignals.includes("resist-correction-check"));
  assert.ok(flaw.sourceVaultLinks.includes("flaw-preservation/SKILL.md"));
  assert.ok(
    flaw.sourceVaultLinks.includes(
      "flaw-preservation/references/character_flaw_system_source_fold_in.md",
    ),
  );
  assert.ok(flaw.continuityLinks.includes("personality-behavioral-contradiction"));
  assert.ok(flaw.continuityLinks.includes("personality-gradual-development"));
  assert.ok(flaw.continuityLinks.includes("stress-response"));
  assert.match(flaw.guardrails.join(" "), /\{\{user\}\} agency/);
  assert.match(flaw.guardrails.join(" "), /correct flaws before story events earn/);
});

test("story grid engine maps core promise antagonist pressure and love mechanics", () => {
  const storyGrid = requireSkill("story-grid-engine");

  assert.equal(storyGrid.category, "story-development");
  assert.equal(storyGrid.source, "heartwrite_memory_vault");
  assert.ok(storyGrid.scope.includes("prompt_book"));
  assert.ok(storyGrid.scope.includes("world_book"));
  assert.ok(storyGrid.activationTags.includes("four_core_framework"));
  assert.ok(storyGrid.activationTags.includes("core_need"));
  assert.ok(storyGrid.activationTags.includes("core_event"));
  assert.ok(storyGrid.activationTags.includes("antagonist_pressure"));
  assert.ok(storyGrid.activationTags.includes("love_story_conventions"));
  assert.ok(storyGrid.activationTags.includes("love_triangle_dynamics"));
  assert.ok(storyGrid.triggerSeeds.includes("story grid"));
  assert.ok(storyGrid.triggerSeeds.includes("core need"));
  assert.ok(storyGrid.triggerSeeds.includes("antagonist design"));
  assert.ok(storyGrid.triggerSeeds.includes("proof of love"));
  assert.ok(storyGrid.triggerSeeds.includes("love triangle"));
  assert.ok(storyGrid.stateFields.includes("core_need"));
  assert.ok(storyGrid.stateFields.includes("core_value_spectrum"));
  assert.ok(storyGrid.stateFields.includes("core_emotion"));
  assert.ok(storyGrid.stateFields.includes("core_event"));
  assert.ok(storyGrid.stateFields.includes("antagonist_function"));
  assert.ok(storyGrid.stateFields.includes("love_story_conventions"));
  assert.ok(storyGrid.stateFields.includes("proof_of_love_cost"));
  assert.ok(storyGrid.stateFields.includes("triangle_active_choice"));
  assert.ok(storyGrid.promptCompilerSignals.includes("four-core-check"));
  assert.ok(storyGrid.promptCompilerSignals.includes("antagonist-pressure-check"));
  assert.ok(storyGrid.promptCompilerSignals.includes("love-genre-convention-check"));
  assert.ok(storyGrid.promptCompilerSignals.includes("proof-of-love-check"));
  assert.ok(storyGrid.promptCompilerSignals.includes("love-triangle-viability-check"));
  assert.ok(storyGrid.sourceVaultLinks.includes("story-grid-engine/SKILL.md"));
  assert.ok(
    storyGrid.sourceVaultLinks.includes(
      "story-grid-engine/references/four_core_framework.md",
    ),
  );
  assert.ok(
    storyGrid.sourceVaultLinks.includes(
      "story-grid-engine/references/antagonist_design.md",
    ),
  );
  assert.ok(
    storyGrid.sourceVaultLinks.includes(
      "story-grid-engine/references/love_genre_mechanics.md",
    ),
  );
  assert.ok(
    storyGrid.sourceVaultLinks.includes(
      "story-grid-engine/references/love_triangle_dynamics.md",
    ),
  );
  assert.ok(storyGrid.continuityLinks.includes("story-idea-generator"));
  assert.ok(storyGrid.continuityLinks.includes("relationship-tracker"));
  assert.ok(storyGrid.continuityLinks.includes("romance-conflict-outliner"));
  assert.ok(storyGrid.continuityLinks.includes("trope-world-builder"));
  assert.match(storyGrid.guardrails.join(" "), /mandatory formula/);
  assert.match(storyGrid.guardrails.join(" "), /proof-of-love beats/);
  assert.match(storyGrid.guardrails.join(" "), /\{\{user\}\} feelings/);
  assert.match(storyGrid.guardrails.join(" "), /moralize through the narrator/);
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
