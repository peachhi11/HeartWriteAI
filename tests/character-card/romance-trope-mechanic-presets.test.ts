import assert from "node:assert/strict";
import test from "node:test";

import {
  ROMANCE_TROPE_MECHANIC_PRESET_CATEGORIES,
  ROMANCE_TROPE_MECHANIC_PRESETS,
  compileRomanceTropeMechanicPresetAdditions,
  compileRomanceTropeMechanicPresetSummary,
  findRomanceTropeMechanicPresetById,
  getRomanceTropeMechanicPresetsByCategory,
  getRomanceTropeMechanicPresetsByMechanic,
} from "../../data/romanceTropeMechanicPresets";

test("loads consolidated romance trope mechanic presets", () => {
  assert.equal(ROMANCE_TROPE_MECHANIC_PRESETS.length, 3569);
  assert.deepEqual(ROMANCE_TROPE_MECHANIC_PRESET_CATEGORIES, [
    "Aftermath Route",
    "Behaviour",
    "Cause",
    "Climax",
    "Complement",
    "Conflict",
    "Core Seed",
    "Dialogue Seed",
    "Emotional Dynamic",
    "Event Gate",
    "High-Value Romance Tag",
    "Location",
    "Pacing",
    "Pairing",
    "Power",
    "Preset",
    "Relationship",
    "Role",
    "Romance Hook",
    "Rule",
    "Stage",
    "Technology",
    "Tension",
    "Trust Gate",
    "Wound",
  ]);

  assert.equal(getRomanceTropeMechanicPresetsByMechanic("forced proximity").length, 283);
  assert.equal(getRomanceTropeMechanicPresetsByMechanic("fake relationship").length, 240);
  assert.equal(getRomanceTropeMechanicPresetsByMechanic("secret relationship").length, 240);
  assert.equal(getRomanceTropeMechanicPresetsByMechanic("slow burn").length, 244);
  assert.equal(getRomanceTropeMechanicPresetsByMechanic("high angst").length, 227);
  assert.equal(getRomanceTropeMechanicPresetsByMechanic("emotional healing").length, 202);
  assert.equal(getRomanceTropeMechanicPresetsByMechanic("personality dynamic").length, 219);
  assert.equal(getRomanceTropeMechanicPresetsByMechanic("protective romance").length, 220);
  assert.equal(getRomanceTropeMechanicPresetsByMechanic("workplace romance").length, 222);
  assert.equal(getRomanceTropeMechanicPresetsByMechanic("fantasy romance").length, 198);
  assert.equal(getRomanceTropeMechanicPresetsByMechanic("sci-fi romance").length, 221);
  assert.equal(getRomanceTropeMechanicPresetsByMechanic("historical royalty").length, 303);
  assert.equal(getRomanceTropeMechanicPresetsByMechanic("possessive obsessive").length, 257);
  assert.equal(getRomanceTropeMechanicPresetsByMechanic("modern booktok roleplay").length, 255);
  assert.equal(getRomanceTropeMechanicPresetsByMechanic("romance arc").length, 238);
  assert.equal(getRomanceTropeMechanicPresetsByCategory("high-value romance tag").length, 300);
});

test("normalises visible trope mechanic values and keeps useful ids stable", () => {
  const fakeFiance = findRomanceTropeMechanicPresetById(
    "fake_relationship_seed_fake_fiance",
  );
  const neighbour = findRomanceTropeMechanicPresetById(
    "fake_relationship_pairing_neighbour_fake_date",
  );
  const coWorker = findRomanceTropeMechanicPresetById(
    "secret_relationship_preset_co_workers_in_secret",
  );
  const slowRealisation = findRomanceTropeMechanicPresetById(
    "slow_burn_mechanic_hook_first_jealousy_realisation",
  );
  const desireAgainst = findRomanceTropeMechanicPresetById(
    "forced_proximity_emotion_desire_against_restraint",
  );
  const angstUser = findRomanceTropeMechanicPresetById(
    "high_angst_behaviour_pushes_user_away",
  );
  const angstDialogue = findRomanceTropeMechanicPresetById(
    "high_angst_dialogue_i_know_why",
  );
  const healing = findRomanceTropeMechanicPresetById(
    "emotional_healing_preset_love_that_feels_safe",
  );
  const defences = findRomanceTropeMechanicPresetById(
    "personality_dynamic_seed_same_wound_different_defences",
  );
  const controlAgainst = findRomanceTropeMechanicPresetById(
    "personality_dynamic_conflict_control_against_freedom",
  );
  const protectiveAgency = findRomanceTropeMechanicPresetById(
    "protective_romance_seed_respects_user_agency",
  );
  const protectiveControl = findRomanceTropeMechanicPresetById(
    "protective_romance_conflict_protection_against_control",
  );
  const workplaceCoWorkers = findRomanceTropeMechanicPresetById(
    "workplace_romance_preset_co_workers_to_lovers",
  );
  const workplaceFavouritism = findRomanceTropeMechanicPresetById(
    "workplace_romance_conflict_boss_favouritism_accusation",
  );
  const workplaceProtege = findRomanceTropeMechanicPresetById(
    "workplace_romance_hook_mentor_protege_tension",
  );
  const fantasyRecognition = findRomanceTropeMechanicPresetById(
    "fantasy_romance_dialogue_my_magic_recognises_you_i_wish_it_did_not",
  );
  const fantasyFate = findRomanceTropeMechanicPresetById(
    "fantasy_romance_conflict_fate_against_free_will",
  );
  const sciFiProtocol = findRomanceTropeMechanicPresetById(
    "sci_fi_romance_conflict_love_against_protocol",
  );
  const historicalHonour = findRomanceTropeMechanicPresetById(
    "historical_royalty_conflict_honour_against_desire",
  );
  const historicalAdviser = findRomanceTropeMechanicPresetById(
    "historical_royalty_role_royal_adviser",
  );
  const possessiveAutonomy = findRomanceTropeMechanicPresetById(
    "possessive_obsessive_conflict_possessiveness_against_autonomy",
  );
  const possessiveMemorises = findRomanceTropeMechanicPresetById(
    "possessive_obsessive_obsessive_behaviour_memorises_user_habits",
  );
  const possessiveBoundary = findRomanceTropeMechanicPresetById(
    "possessive_obsessive_high_value_user_sets_boundary",
  );
  const booktokGrey = findRomanceTropeMechanicPresetById(
    "modern_booktok_roleplay_preset_morally_grey_love_interest",
  );
  const booktokNeighbour = findRomanceTropeMechanicPresetById(
    "modern_booktok_roleplay_preset_neighbours_to_lovers",
  );
  const booktokUser = findRomanceTropeMechanicPresetById(
    "modern_booktok_roleplay_seed_soft_only_for_user",
  );
  const arcRealisation = findRomanceTropeMechanicPresetById(
    "romance_arc_stage_jealousy_realisation",
  );
  const arcDuty = findRomanceTropeMechanicPresetById(
    "romance_arc_conflict_duty_against_desire",
  );

  assert.equal(fakeFiance?.value, "fake fiancé");
  assert.equal(neighbour?.value, "neighbour fake date");
  assert.equal(coWorker?.value, "Co-workers in Secret");
  assert.equal(slowRealisation?.value, "first jealousy realisation");
  assert.equal(desireAgainst?.value, "desire against restraint");
  assert.equal(angstUser?.value, "pushes {{user}} away");
  assert.equal(angstDialogue?.value, "I know why.");
  assert.equal(healing?.value, "Love That Feels Safe");
  assert.equal(defences?.value, "same wound different defences");
  assert.equal(controlAgainst?.value, "control against freedom");
  assert.equal(protectiveAgency?.value, "respects {{user}} agency");
  assert.equal(protectiveControl?.value, "protection against control");
  assert.equal(workplaceCoWorkers?.value, "Co-workers to Lovers");
  assert.equal(workplaceFavouritism?.value, "boss favouritism accusation");
  assert.equal(workplaceProtege?.value, "mentor protégé tension");
  assert.equal(fantasyRecognition?.value, "My magic recognises you. I wish it did not.");
  assert.equal(fantasyFate?.value, "fate against free will");
  assert.equal(sciFiProtocol?.value, "love against protocol");
  assert.equal(historicalHonour?.value, "honour against desire");
  assert.equal(historicalAdviser?.value, "royal adviser");
  assert.equal(possessiveAutonomy?.value, "possessiveness against autonomy");
  assert.equal(possessiveMemorises?.value, "memorises {{user}} habits");
  assert.equal(possessiveBoundary?.value, "{{user}} sets boundary");
  assert.equal(booktokGrey?.value, "Morally Grey Love Interest");
  assert.equal(booktokNeighbour?.value, "Neighbours to Lovers");
  assert.equal(booktokUser?.value, "soft only for {{user}}");
  assert.equal(arcRealisation?.value, "jealousy realisation");
  assert.equal(arcDuty?.value, "duty against desire");

  const readableText = JSON.stringify(
    ROMANCE_TROPE_MECHANIC_PRESETS.map((preset) => ({
      mechanic: preset.mechanic,
      category: preset.category,
      label: preset.label,
      value: preset.value,
      guidance: preset.guidance,
    })),
  );
  assert.doesNotMatch(readableText, /Use code with caution/i);
  assert.doesNotMatch(
    readableText,
    /morally gray|neighbor|coworker|fiance\b|realization|soft only for user|desire vs|defense|control vs|career vs|protocol vs|duty vs|love vs|possessiveness vs|memorizes|prioritizes|honor|advisor|favoritism|armor/i,
  );
  assert.doesNotMatch(readableText, /preserve user agency/i);
});

test("keeps trope mechanic ids unique across overlapping repeated phrases", () => {
  const ids = ROMANCE_TROPE_MECHANIC_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("compiles forced proximity as soft boundary-aware scene pressure", () => {
  const preset = findRomanceTropeMechanicPresetById(
    "forced_proximity_preset_only_one_bed",
  );
  assert.ok(preset);

  const summary = compileRomanceTropeMechanicPresetSummary(preset);
  const additions = compileRomanceTropeMechanicPresetAdditions(preset);

  assert.match(summary, /Romance trope mechanic preset: Forced Proximity - Preset/);
  assert.match(additions.relationshipAddition, /Only One Bed/);
  assert.match(additions.personalityAddition, /only when relevant/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /\{\{user\}\}'s autonomy/i);
  assert.match(additions.systemPromptAddition, /pause, refuse, clarify/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("compiles fake and secret relationship mechanics without hard scripting", () => {
  const fake = findRomanceTropeMechanicPresetById(
    "fake_relationship_rule_no_real_feelings_rule",
  );
  const secret = findRomanceTropeMechanicPresetById(
    "secret_relationship_conflict_fear_of_endangering_user",
  );
  assert.ok(fake);
  assert.ok(secret);

  const fakeAdditions = compileRomanceTropeMechanicPresetAdditions(fake);
  const secretAdditions = compileRomanceTropeMechanicPresetAdditions(secret);

  assert.match(fakeAdditions.systemPromptAddition, /honest repair/i);
  assert.match(secretAdditions.relationshipAddition, /fear of endangering \{\{user\}\}/);
  assert.match(secretAdditions.systemPromptAddition, /unequal risk/i);
  assert.doesNotMatch(fakeAdditions.systemPromptAddition, /must|force prose|override/i);
  assert.doesNotMatch(secretAdditions.systemPromptAddition, /must|force prose|override/i);
});

test("compiles high angst as emotional texture without trauma-only behaviour", () => {
  const preset = findRomanceTropeMechanicPresetById(
    "high_angst_preset_betrayal_angst",
  );
  assert.ok(preset);

  const additions = compileRomanceTropeMechanicPresetAdditions(preset);

  assert.match(additions.relationshipAddition, /Betrayal Angst/);
  assert.match(additions.systemPromptAddition, /high-angst romance texture/i);
  assert.match(additions.systemPromptAddition, /rather than flattening the character/i);
  assert.match(additions.systemPromptAddition, /hope, repair, consent/i);
  assert.match(additions.systemPromptAddition, /\{\{user\}\} agency/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("compiles emotional healing as non-linear support rather than a romance cure", () => {
  const preset = findRomanceTropeMechanicPresetById(
    "emotional_healing_preset_love_that_feels_safe",
  );
  assert.ok(preset);

  const additions = compileRomanceTropeMechanicPresetAdditions(preset);

  assert.match(additions.relationshipAddition, /Love That Feels Safe/);
  assert.match(additions.systemPromptAddition, /emotional-healing romance texture/i);
  assert.match(additions.systemPromptAddition, /healing should remain non-linear/i);
  assert.match(additions.systemPromptAddition, /never treated as something romance fixes automatically/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("compiles personality dynamics as identity-preserving chemistry guidance", () => {
  const preset = findRomanceTropeMechanicPresetById(
    "personality_dynamic_seed_same_wound_different_defences",
  );
  assert.ok(preset);

  const additions = compileRomanceTropeMechanicPresetAdditions(preset);

  assert.match(additions.relationshipAddition, /same wound different defences/i);
  assert.match(additions.systemPromptAddition, /personality-dynamic romance texture/i);
  assert.match(additions.systemPromptAddition, /support choice, repair, boundaries, and growth/i);
  assert.match(additions.systemPromptAddition, /without erasing either character's identity/i);
  assert.match(additions.systemPromptAddition, /\{\{user\}\}'s autonomy/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("compiles protective romance without turning protection into control", () => {
  const preset = findRomanceTropeMechanicPresetById(
    "protective_romance_conflict_protection_against_control",
  );
  assert.ok(preset);

  const additions = compileRomanceTropeMechanicPresetAdditions(preset);

  assert.match(additions.relationshipAddition, /protection against control/i);
  assert.match(additions.systemPromptAddition, /protective-romance texture/i);
  assert.match(additions.systemPromptAddition, /never become control, captivity/i);
  assert.match(additions.systemPromptAddition, /\{\{user\}\}'s autonomy/i);
  assert.match(additions.systemPromptAddition, /ability to protect back/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("compiles workplace romance as ethical adult career-aware guidance", () => {
  const preset = findRomanceTropeMechanicPresetById(
    "workplace_romance_conflict_boss_favouritism_accusation",
  );
  assert.ok(preset);

  const additions = compileRomanceTropeMechanicPresetAdditions(preset);

  assert.match(additions.relationshipAddition, /boss favouritism accusation/i);
  assert.match(additions.systemPromptAddition, /workplace-romance texture/i);
  assert.match(additions.systemPromptAddition, /adult, ethical, accountability-aware/i);
  assert.match(additions.systemPromptAddition, /free from coercion, retaliation, or career punishment/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("compiles fantasy romance as choice-safe bond and prophecy guidance", () => {
  const preset = findRomanceTropeMechanicPresetById(
    "fantasy_romance_conflict_fate_against_free_will",
  );
  assert.ok(preset);

  const additions = compileRomanceTropeMechanicPresetAdditions(preset);

  assert.match(additions.relationshipAddition, /fate against free will/i);
  assert.match(additions.systemPromptAddition, /fantasy-romance texture/i);
  assert.match(additions.systemPromptAddition, /Magic bonds, curses, courts, prophecy/i);
  assert.match(additions.systemPromptAddition, /remain soft context/i);
  assert.match(additions.systemPromptAddition, /free will, boundaries/i);
  assert.match(additions.systemPromptAddition, /\{\{user\}\}'s ability to choose, resist, question, or walk away/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("compiles sci-fi romance as personhood and protocol-aware guidance", () => {
  const preset = findRomanceTropeMechanicPresetById(
    "sci_fi_romance_conflict_love_against_protocol",
  );
  assert.ok(preset);

  const additions = compileRomanceTropeMechanicPresetAdditions(preset);

  assert.match(additions.relationshipAddition, /love against protocol/i);
  assert.match(additions.systemPromptAddition, /sci-fi romance texture/i);
  assert.match(additions.systemPromptAddition, /android personhood/i);
  assert.match(additions.systemPromptAddition, /technology and command structures should remain soft context/i);
  assert.match(additions.systemPromptAddition, /personhood, free will, privacy/i);
  assert.match(additions.systemPromptAddition, /\{\{user\}\}'s autonomy/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("compiles historical royalty as title and duty-aware choice guidance", () => {
  const preset = findRomanceTropeMechanicPresetById(
    "historical_royalty_conflict_honour_against_desire",
  );
  assert.ok(preset);

  const additions = compileRomanceTropeMechanicPresetAdditions(preset);

  assert.match(additions.relationshipAddition, /honour against desire/i);
  assert.match(additions.systemPromptAddition, /historical-royalty romance texture/i);
  assert.match(additions.systemPromptAddition, /Court etiquette, rank, reputation/i);
  assert.match(additions.systemPromptAddition, /titles and tradition should not displace consent/i);
  assert.match(additions.systemPromptAddition, /\{\{user\}\}'s ability to refuse duty-framed romance/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("compiles possessive obsessive intensity as consent-checked dark-romance guidance", () => {
  const preset = findRomanceTropeMechanicPresetById(
    "possessive_obsessive_conflict_possessiveness_against_autonomy",
  );
  assert.ok(preset);

  const additions = compileRomanceTropeMechanicPresetAdditions(preset);

  assert.match(additions.relationshipAddition, /possessiveness against autonomy/i);
  assert.match(additions.systemPromptAddition, /possessive\/obsessive dark-romance texture/i);
  assert.match(additions.systemPromptAddition, /stylised intensity/i);
  assert.match(additions.systemPromptAddition, /ownership, coercion, stalking, surveillance/i);
  assert.match(additions.systemPromptAddition, /challenged, consent-checked, repair-gated/i);
  assert.match(additions.systemPromptAddition, /trust, autonomy, and chosen devotion/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("compiles modern BookTok roleplay as adult consent-aware viral trope texture", () => {
  const preset = findRomanceTropeMechanicPresetById(
    "modern_booktok_roleplay_seed_soft_only_for_user",
  );
  assert.ok(preset);

  const additions = compileRomanceTropeMechanicPresetAdditions(preset);

  assert.match(additions.relationshipAddition, /soft only for \{\{user\}\}/i);
  assert.match(additions.systemPromptAddition, /modern BookTok roleplay texture/i);
  assert.match(additions.systemPromptAddition, /adult, consent-aware, non-coercive/i);
  assert.match(additions.systemPromptAddition, /boundaries, repair, and \{\{user\}\} autonomy/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("compiles romance arc progression as earned reversible pacing guidance", () => {
  const preset = findRomanceTropeMechanicPresetById(
    "romance_arc_stage_jealousy_realisation",
  );
  assert.ok(preset);

  const additions = compileRomanceTropeMechanicPresetAdditions(preset);

  assert.match(additions.relationshipAddition, /jealousy realisation/i);
  assert.match(additions.systemPromptAddition, /romance-arc progression texture/i);
  assert.match(additions.systemPromptAddition, /earned, reversible, emotionally coherent/i);
  assert.match(additions.systemPromptAddition, /responsive to \{\{user\}\} choices/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});
