import assert from "node:assert/strict";
import test from "node:test";

import { findAcademicRivalPresetById } from "../../data/academicRivalPresets";
import { findAffectionPresetById } from "../../data/affectionPresets";
import { findAmbitionPresetById } from "../../data/ambitionPresets";
import { findAlienPresetById } from "../../data/alienPresets";
import { findAndroidPresetById } from "../../data/androidPresets";
import { findAngelPresetById } from "../../data/angelPresets";
import { findArrangedMatchPresetById } from "../../data/arrangedMatchPresets";
import { findBetrayalPresetById } from "../../data/betrayalPresets";
import { findBodyBuildPresetById } from "../../data/bodyBuildPresets";
import { findCaretakerHurtComfortPresetById } from "../../data/caretakerHurtComfortPresets";
import { findCaretakerPresetById } from "../../data/caretakerPresets";
import { findColorPresetById } from "../../data/colorPresets";
import { findComplementVocabularyById } from "../../data/complementPresets";
import { findCommunicationStylePresetById } from "../../data/communicationStylePresets";
import { findConflictStylePresetById } from "../../data/conflictStylePresets";
import { findDarkObsessivePresetById } from "../../data/darkObsessivePresets";
import { findDemonPresetById } from "../../data/demonPresets";
import { findDescriptiveWritingSeedById } from "../../data/descriptiveWritingSeedPresets";
import { findDialectPresetById } from "../../data/dialectPresets";
import { findDevotionPresetById } from "../../data/devotionPresets";
import { findExilePresetById } from "../../data/exilePresets";
import { findFamilyHistoryPresetById } from "../../data/familyHistoryPresets";
import { findFakeDatingPresetById } from "../../data/fakeDatingPresets";
import { findFacialFeaturePresetById } from "../../data/facialFeaturePresets";
import { findFatedReincarnationPresetById } from "../../data/fatedReincarnationPresets";
import { findFaePresetById } from "../../data/faePresets";
import { findFlawSecretPresetById } from "../../data/flawSecretPresets";
import { findForbiddenTabooPresetById } from "../../data/forbiddenTabooPresets";
import { findFlirtingPresetById } from "../../data/flirtingPresets";
import { findFormalArrangedPresetById } from "../../data/formalArrangedPresets";
import { findFormativeEventPresetById } from "../../data/formativeEventPresets";
import { findFormalityPresetById } from "../../data/formalityPresets";
import { findFrictionPresetById } from "../../data/frictionPresets";
import { findFriendsToLoversPresetById } from "../../data/friendsToLoversPresets";
import { findGrumpySunshinePresetById } from "../../data/grumpySunshinePresets";
import { findHairStylePresetById } from "../../data/hairStylePresets";
import { findHeightStaturePresetById } from "../../data/heightStaturePresets";
import { findJealousyPresetById } from "../../data/jealousyPresets";
import { findLoyaltyPresetById } from "../../data/loyaltyPresets";
import { findLoveLanguagePresetById } from "../../data/loveLanguagePresets";
import { findLossPresetById } from "../../data/lossPresets";
import { findMentorProtegePresetById } from "../../data/mentorProtegePresets";
import { findMoralityPresetById } from "../../data/moralityPresets";
import { findObsessionPresetById } from "../../data/obsessionPresets";
import { findPossessivePresetById } from "../../data/possessivePresets";
import { findOriginWoundVocabularyPresetById } from "../../data/originWoundVocabularyPresets";
import { findOutfitPresetById } from "../../data/outfitPresets";
import { findPetNamePresetById } from "../../data/petNamePresets";
import { findRelationshipDynamicPresetById } from "../../data/relationshipDynamicPresets";
import { findRegretPresetById } from "../../data/regretPresets";
import { findRivalryPresetById } from "../../data/rivalryPresets";
import { findRomancePresetById } from "../../data/romancePresets";
import { findSentenceRhythmPresetById } from "../../data/sentenceRhythmPresets";
import { findSecretPresetById } from "../../data/secretPresets";
import { findSecondChancePresetById } from "../../data/secondChancePresets";
import { findShifterPresetById } from "../../data/shifterPresets";
import { findSkinPresetById } from "../../data/skinPresets";
import { findSlowBurnPresetById } from "../../data/slowBurnPresets";
import { findSpeechStylePresetById } from "../../data/speechStylePresets";
import { findTeasingPresetById } from "../../data/teasingPresets";
import { findAgeLifeStagePresetById } from "../../data/ageLifeStagePresets";
import { findSpeciesHeritagePresetById } from "../../data/speciesHeritagePresets";
import { findHumanPresetById } from "../../data/humanPresets";
import { findVampirePresetById } from "../../data/vampirePresets";
import { findVoiceVocabularyPresetById } from "../../data/voiceVocabularyPresets";
import { findWorkplaceHierarchyPresetById } from "../../data/workplaceHierarchyPresets";
import {
  compileCharacterPresetSelection,
  createDefaultCharacterPresetSelection,
  type CharacterPresetSelection,
} from "../../lib/character-card/characterPresetSelection";

function buildSelection(): CharacterPresetSelection {
  return {
    name: "Vesper Vance",
    romance: must(findRomancePresetById("rom_cont_grumpy_billionaire")),
    height: must(findHeightStaturePresetById("height_tower_lofty_giant")),
    build: must(findBodyBuildPresetById("build_ath_lean_wire")),
    face: must(findFacialFeaturePresetById("face_sharp_aristocrat")),
    eyeColor: must(findColorPresetById("eye_nat_molten_amber")),
    hairColor: must(findColorPresetById("hair_nat_raven_wing")),
    hairStyle: must(findHairStylePresetById("hair_style_the_tousled_romantic")),
    skin: must(findSkinPresetById("skin_cool_alabaster_porcelain")),
    outfit: must(findOutfitPresetById("outfit_formal_bespoke_power")),
    relationshipDynamic: must(findRelationshipDynamicPresetById("rival_acad_perfect_scores")),
  };
}

test("creates a default preset selection from the seed library", () => {
  const selection = createDefaultCharacterPresetSelection("Draft Character");

  assert.equal(selection.name, "Draft Character");
  assert.equal(selection.romance.id, "rom_cont_grumpy_billionaire");
  assert.equal(selection.relationshipDynamic.id, "dyn_grumpy_sunshine");
  assert.equal(selection.eyeColor.type, "Eyes");
  assert.equal(selection.hairColor.type, "Hair");
  assert.equal(selection.hairStyle?.id, "hair_style_the_tousled_romantic");
});

test("compiles preset selections into editable character form values", () => {
  const compiled = compileCharacterPresetSelection(buildSelection());

  assert.equal(compiled.formValues.fullName, "Vesper Vance");
  assert.match(compiled.formValues.height, /6'4"/);
  assert.match(compiled.formValues.description, /The Grumpy Billionaire/);
  assert.match(compiled.formValues.physicalAppearance, /Bespoke Power Tailoring/);
  assert.match(compiled.formValues.physicalAppearance, /Molten Amber/);
  assert.match(compiled.formValues.physicalAppearance, /Hair preset: Hair Style Preset - The Tousled Romantic/);
  assert.match(compiled.appearancePrompt.naturalLanguage, /styled as The Tousled Romantic/);
  assert.match(compiled.formValues.first_mes, /styled as the tousled romantic/);
  assert.match(compiled.formValues.personalityPsychology, /Aloof, Controlling/);
  assert.match(compiled.formValues.relationshipsConnections, /Grumpy x Sunshine/);
  assert.match(compiled.formValues.relationshipsConnections, /Top of the Class/);
  assert.match(compiled.formValues.relationshipsConnections, /Cutthroat Intellect/);
  assert.match(compiled.formValues.relationshipsConnections, /dissect/);
  assert.match(compiled.formValues.scenario, /romance setup shaped by The Grumpy Billionaire/);
  assert.match(compiled.formValues.scenario, /active relationship dynamic is Top of the Class/);
});

test("maps optional speech presets into editable voice guidance", () => {
  const compiled = compileCharacterPresetSelection({
    ...buildSelection(),
    speechStyle: must(findSpeechStylePresetById("speech_elite_aristocrat")),
    voiceVocabulary: must(findVoiceVocabularyPresetById("voice_crisp_angular_rival")),
  });

  assert.match(compiled.formValues.speechStyle, /Speech preset: Cold Aristocrat/);
  assert.match(compiled.formValues.speechStyle, /Mapped speech engine: Velvet_Formal/);
  assert.match(compiled.formValues.speechStyle, /Voice vocabulary preset: Academic Rival/);
  assert.match(compiled.formValues.speechStyle, /Signature voice verbs: dissect, counter/);
  assert.match(compiled.formValues.tagsText, /Elite & Controlled/);
  assert.match(compiled.formValues.tagsText, /Cold Aristocrat \/ Corporate Suit/);
  assert.match(compiled.formValues.tagsText, /Crisp & Angular/);
  assert.match(compiled.formValues.tagsText, /Academic Rival \/ Cold Aristocrat/);
  assert.ok(compiled.systemPromptTags.includes("controlled elite diction"));
  assert.ok(compiled.systemPromptTags.includes("formal address discipline"));
  assert.ok(compiled.systemPromptTags.includes("crisp angular voice texture"));
});

test("maps descriptive writing seeds into editable prose guidance", () => {
  const compiled = compileCharacterPresetSelection({
    ...buildSelection(),
    descriptiveWritingSeeds: [
      must(
        findDescriptiveWritingSeedById(
          "descriptive_physical_tangled_copper_curls",
        ),
      ),
      must(
        findDescriptiveWritingSeedById(
          "descriptive_emotional_trembling_calm_mask",
        ),
      ),
      must(
        findDescriptiveWritingSeedById(
          "descriptive_personality_measured_precise_speech",
        ),
      ),
      must(
        findDescriptiveWritingSeedById(
          "descriptive_body_language_crossed_arms_shutdown",
        ),
      ),
      must(findDescriptiveWritingSeedById("descriptive_speech_heavy_accent")),
    ],
  });

  assert.match(compiled.formValues.physicalAppearance, /Tangled copper curls/);
  assert.match(compiled.formValues.physicalAppearance, /physical description texture/);
  assert.match(compiled.formValues.personalityPsychology, /Measured precise speech/);
  assert.match(compiled.formValues.personalityPsychology, /Trembling calm mask/);
  assert.match(compiled.formValues.personalityPsychology, /Crossed arms shutdown/);
  assert.match(compiled.formValues.backgroundStory, /Trembling calm mask/);
  assert.match(compiled.formValues.backgroundStory, /Crossed arms shutdown/);
  assert.match(compiled.formValues.speechStyle, /Heavy accent/);
  assert.match(compiled.formValues.system_prompt, /physical description seed/);
  assert.match(compiled.formValues.system_prompt, /speech pattern seed/);
  assert.match(compiled.formValues.system_prompt, /optional prose texture/i);
  assert.match(compiled.formValues.system_prompt, /not a fixed line to repeat/i);
  assert.match(compiled.formValues.system_prompt, /\{\{user\}\} agency/i);
  assert.match(compiled.formValues.tagsText, /Physical Description/);
  assert.match(compiled.formValues.tagsText, /Tangled copper curls/);
  assert.ok(compiled.systemPromptTags.includes("descriptive writing seed"));
  assert.ok(compiled.systemPromptTags.includes("soft prose guidance"));
});

test("maps optional flirting and origin wound presets into editable guidance", () => {
  const compiled = compileCharacterPresetSelection({
    ...buildSelection(),
    complementVocabulary: must(findComplementVocabularyById("vocab_complement_academic_rivals")),
    arrangedMatch: must(findArrangedMatchPresetById("arranged_match_archetype_the_political_betrothal")),
    forbiddenTaboo: must(findForbiddenTabooPresetById("forbidden_taboo_archetype_the_forbidden_lover")),
    mentorProtege: must(findMentorProtegePresetById("mentor_protege_archetype_the_stern_mentor")),
    fakeDating: must(findFakeDatingPresetById("fake_dating_archetype_the_contract_couple")),
    grumpySunshine: must(findGrumpySunshinePresetById("grumpy_sunshine_archetype_the_grumpy_protector")),
    darkObsessive: must(findDarkObsessivePresetById("dark_obsessive_archetype_the_possessive_protector")),
    formalArranged: must(findFormalArrangedPresetById("formal_arranged_rule_no_forced_intimacy")),
    academicRival: must(findAcademicRivalPresetById("academic_rival_archetype_the_academic_nemesis")),
    caretakerHurtComfort: must(findCaretakerHurtComfortPresetById("caretaker_hurt_comfort_archetype_the_gentle_caretaker")),
    caretaker: must(findCaretakerPresetById("caretaker_archetype_the_gentle_caregiver")),
    friction: must(findFrictionPresetById("friction_archetype_the_constant_bickerers")),
    rivalry: must(findRivalryPresetById("rivalry_archetype_the_proud_rival")),
    devotion: must(findDevotionPresetById("devotion_archetype_the_devoted_lover")),
    obsession: must(findObsessionPresetById("obsession_archetype_the_possessive_devotee")),
    possessive: must(findPossessivePresetById("possessive_archetype_the_possessive_protector")),
    slowBurn: must(findSlowBurnPresetById("slow_burn_archetype_the_patient_devotee")),
    flawSecret: must(findFlawSecretPresetById("flaw_secret_archetype_the_beautiful_liar")),
    teasing: must(findTeasingPresetById("teasing_archetype_the_playful_flirt")),
    ageLifeStage: must(findAgeLifeStagePresetById("age_dynamic_age_gap_adults")),
    speciesHeritage: must(findSpeciesHeritagePresetById("species_heritage_the_vampire_noble")),
    human: must(findHumanPresetById("human_archetype_the_small_town_dreamer")),
    vampire: must(findVampirePresetById("vampire_trope_blood_bond_romance")),
    fae: must(findFaePresetById("fae_romance_bargain_marriage")),
    demon: must(findDemonPresetById("demon_romance_contract_marriage")),
    angel: must(findAngelPresetById("angel_romance_guardian_and_protected")),
    android: must(findAndroidPresetById("android_romance_free_will_romance")),
    alien: must(findAlienPresetById("alien_romance_first_contact_romance")),
    shifter: must(findShifterPresetById("shifter_romance_mate_bond_romance")),
    fatedReincarnation: must(findFatedReincarnationPresetById("fated_reincarnation_archetype_the_reincarnated_soulmate")),
    secondChance: must(findSecondChancePresetById("second_chance_archetype_the_ex_who_came_back")),
    workplaceHierarchy: must(findWorkplaceHierarchyPresetById("workplace_hierarchy_archetype_the_ceo_and_assistant")),
    friendsToLovers: must(findFriendsToLoversPresetById("friends_to_lovers_archetype_the_childhood_best_friend")),
    affection: must(findAffectionPresetById("affection_archetype_the_tender_devotee")),
    loyalty: must(findLoyaltyPresetById("loyalty_archetype_the_devoted_protector")),
    loveLanguage: must(findLoveLanguagePresetById("love_language_archetype_the_words_of_affirmation_devotee")),
    conflictStyle: must(findConflictStylePresetById("conflict_archetype_the_avoidant_peacemaker")),
    familyHistory: must(findFamilyHistoryPresetById("fam_dark_syndicate_dynasty")),
    flirtingStyle: must(findFlirtingPresetById("flirt_seductive_boundary")),
    formativeEvent: must(findFormativeEventPresetById("event_hist_forced_betrothal")),
    originWound: must(findOriginWoundVocabularyPresetById("wound_shame_defilement")),
    regret: must(findRegretPresetById("regret_chosen_betrayal")),
    exile: must(findExilePresetById("exile_palace_outcast")),
    betrayal: must(findBetrayalPresetById("betrayal_archetype_the_reluctant_betrayer")),
    loss: must(findLossPresetById("loss_archetype_the_memory_keeper")),
    jealousy: must(findJealousyPresetById("jealousy_archetype_the_quietly_jealous_protector")),
    secret: must(findSecretPresetById("secret_archetype_the_confession_avoider")),
    ambition: must(findAmbitionPresetById("ambition_archetype_the_power_couple_dreamer")),
    morality: must(findMoralityPresetById("morality_archetype_the_morally_grey_lover")),
  });

  assert.match(compiled.formValues.relationshipsConnections, /Complement vocabulary preset: The Cutthroat Intellect/);
  assert.match(compiled.formValues.relationshipsConnections, /razor-sharp/);
  assert.match(compiled.formValues.relationshipsConnections, /Forbidden\/taboo intersection preset: Archetype - The Forbidden Lover/);
  assert.match(compiled.formValues.relationshipsConnections, /Grumpy\/sunshine preset: Archetype - The Grumpy Protector/);
  assert.match(compiled.formValues.relationshipsConnections, /Dark\/obsessive preset: Archetype - The Possessive Protector/);
  assert.match(compiled.formValues.relationshipsConnections, /Formal\/arranged preset: Rule - No Forced Intimacy/);
  assert.match(compiled.formValues.relationshipsConnections, /Academic\/rival preset: Archetype - The Academic Nemesis/);
  assert.match(compiled.formValues.relationshipsConnections, /Caretaker\/hurt-comfort preset: Archetype - The Gentle Caretaker/);
  assert.match(compiled.formValues.relationshipsConnections, /Caretaker preset: Archetype - The Gentle Caregiver/);
  assert.match(compiled.formValues.relationshipsConnections, /Friction preset: Archetype - The Constant Bickerers/);
  assert.match(compiled.formValues.relationshipsConnections, /Rivalry preset: Archetype - The Proud Rival/);
  assert.match(compiled.formValues.relationshipsConnections, /Devotion preset: Archetype - The Devoted Lover/);
  assert.match(compiled.formValues.relationshipsConnections, /Obsession preset: Archetype - The Possessive Devotee/);
  assert.match(compiled.formValues.relationshipsConnections, /Possessive preset: Archetype - The Possessive Protector/);
  assert.match(compiled.formValues.relationshipsConnections, /Slow-burn preset: Archetype - The Patient Devotee/);
  assert.match(compiled.formValues.relationshipsConnections, /Flaw\/secret preset: Archetype - The Beautiful Liar/);
  assert.match(compiled.formValues.relationshipsConnections, /Teasing preset: Archetype - The Playful Flirt/);
  assert.match(compiled.formValues.relationshipsConnections, /Age\/life-stage preset: Age Dynamic Type - Age Gap Adults/);
  assert.match(compiled.formValues.relationshipsConnections, /Species\/heritage preset: Heritage Archetype - The Vampire Noble/);
  assert.match(compiled.formValues.relationshipsConnections, /Human preset: Human Archetype - The Small Town Dreamer/);
  assert.match(compiled.formValues.relationshipsConnections, /Vampire preset: Romance Trope - Blood Bond Romance/);
  assert.match(compiled.formValues.relationshipsConnections, /Fae preset: Romance Hook - Bargain Marriage/);
  assert.match(compiled.formValues.relationshipsConnections, /Demon preset: Romance Hook - Contract Marriage/);
  assert.match(compiled.formValues.relationshipsConnections, /Angel preset: Romance Hook - Guardian And Protected/);
  assert.match(compiled.formValues.relationshipsConnections, /Android preset: Romance Hook - Free Will Romance/);
  assert.match(compiled.formValues.relationshipsConnections, /Alien preset: Romance Hook - First Contact Romance/);
  assert.match(compiled.formValues.relationshipsConnections, /Shifter preset: Romance Hook - Mate Bond Romance/);
  assert.match(compiled.formValues.relationshipsConnections, /Friends-to-lovers preset: Archetype - The Childhood Best Friend/);
  assert.match(compiled.formValues.relationshipsConnections, /Fated\/reincarnation preset: Archetype - The Reincarnated Soulmate/);
  assert.match(compiled.formValues.relationshipsConnections, /Second-chance preset: Archetype - The Ex Who Came Back/);
  assert.match(compiled.formValues.relationshipsConnections, /Workplace hierarchy preset: Archetype - The CEO and Assistant/);
  assert.match(compiled.formValues.backgroundStory, /Origin wound preset: Outcast Beast/);
  assert.match(compiled.formValues.backgroundStory, /Forbidden\/taboo intersection preset: Archetype - The Forbidden Lover/);
  assert.match(compiled.formValues.backgroundStory, /Grumpy\/sunshine preset: Archetype - The Grumpy Protector/);
  assert.match(compiled.formValues.backgroundStory, /Dark\/obsessive preset: Archetype - The Possessive Protector/);
  assert.match(compiled.formValues.backgroundStory, /Formal\/arranged preset: Rule - No Forced Intimacy/);
  assert.match(compiled.formValues.backgroundStory, /Academic\/rival preset: Archetype - The Academic Nemesis/);
  assert.match(compiled.formValues.backgroundStory, /Caretaker\/hurt-comfort preset: Archetype - The Gentle Caretaker/);
  assert.match(compiled.formValues.backgroundStory, /Caretaker preset: Archetype - The Gentle Caregiver/);
  assert.match(compiled.formValues.backgroundStory, /Friction preset: Archetype - The Constant Bickerers/);
  assert.match(compiled.formValues.backgroundStory, /Rivalry preset: Archetype - The Proud Rival/);
  assert.match(compiled.formValues.backgroundStory, /Devotion preset: Archetype - The Devoted Lover/);
  assert.match(compiled.formValues.backgroundStory, /Obsession preset: Archetype - The Possessive Devotee/);
  assert.match(compiled.formValues.backgroundStory, /Possessive preset: Archetype - The Possessive Protector/);
  assert.match(compiled.formValues.backgroundStory, /Slow-burn preset: Archetype - The Patient Devotee/);
  assert.match(compiled.formValues.backgroundStory, /Flaw\/secret preset: Archetype - The Beautiful Liar/);
  assert.match(compiled.formValues.backgroundStory, /Teasing preset: Archetype - The Playful Flirt/);
  assert.match(compiled.formValues.backgroundStory, /Age\/life-stage preset: Age Dynamic Type - Age Gap Adults/);
  assert.match(compiled.formValues.backgroundStory, /Species\/heritage preset: Heritage Archetype - The Vampire Noble/);
  assert.match(compiled.formValues.backgroundStory, /Human preset: Human Archetype - The Small Town Dreamer/);
  assert.match(compiled.formValues.backgroundStory, /Vampire preset: Romance Trope - Blood Bond Romance/);
  assert.match(compiled.formValues.backgroundStory, /Fae preset: Romance Hook - Bargain Marriage/);
  assert.match(compiled.formValues.backgroundStory, /Demon preset: Romance Hook - Contract Marriage/);
  assert.match(compiled.formValues.backgroundStory, /Angel preset: Romance Hook - Guardian And Protected/);
  assert.match(compiled.formValues.backgroundStory, /Android preset: Romance Hook - Free Will Romance/);
  assert.match(compiled.formValues.backgroundStory, /Alien preset: Romance Hook - First Contact Romance/);
  assert.match(compiled.formValues.backgroundStory, /Shifter preset: Romance Hook - Mate Bond Romance/);
  assert.match(compiled.formValues.backgroundStory, /Fated\/reincarnation preset: Archetype - The Reincarnated Soulmate/);
  assert.match(compiled.formValues.backgroundStory, /Second-chance preset: Archetype - The Ex Who Came Back/);
  assert.match(compiled.formValues.backgroundStory, /Workplace hierarchy preset: Archetype - The CEO and Assistant/);
  assert.match(compiled.formValues.backgroundStory, /Formative event preset: The Resigned Ward/);
  assert.match(compiled.formValues.backgroundStory, /Family history preset: The Mafia Heir/);
  assert.match(compiled.formValues.backgroundStory, /Monochromatic Syndicate Legacy/);
  assert.match(compiled.formValues.backgroundStory, /Transposition of the Estate Ledger/);
  assert.match(compiled.formValues.backgroundStory, /Regret preset: The Restless Enforcer/);
  assert.match(compiled.formValues.backgroundStory, /Exile preset: The Resigned Ward/);
  assert.match(compiled.formValues.backgroundStory, /Betrayal preset: Archetype - The Reluctant Betrayer/);
  assert.match(compiled.formValues.backgroundStory, /Loss preset: Archetype - The Memory Keeper/);
  assert.match(compiled.formValues.backgroundStory, /Secret preset: Archetype - The Confession Avoider/);
  assert.match(compiled.formValues.backgroundStory, /Ambition preset: Archetype - The Power Couple Dreamer/);
  assert.match(compiled.formValues.backgroundStory, /Morality preset: Archetype - The Morally Grey Lover/);
  assert.match(compiled.formValues.backgroundStory, /contaminated/);
  assert.match(compiled.formValues.personalityPsychology, /Origin wound behaviour texture/);
  assert.match(compiled.formValues.personalityPsychology, /Formative event behaviour texture/);
  assert.match(compiled.formValues.personalityPsychology, /Family history behaviour texture/);
  assert.match(compiled.formValues.personalityPsychology, /Forbidden\/taboo archetype intersection/);
  assert.match(compiled.formValues.personalityPsychology, /Grumpy\/sunshine archetype texture/);
  assert.match(compiled.formValues.personalityPsychology, /Dark\/obsessive archetype texture/);
  assert.match(compiled.formValues.personalityPsychology, /Formal\/arranged rule texture/);
  assert.match(compiled.formValues.personalityPsychology, /Academic\/rival archetype texture/);
  assert.match(compiled.formValues.personalityPsychology, /Caretaker\/hurt-comfort archetype texture/);
  assert.match(compiled.formValues.personalityPsychology, /Caretaker archetype texture/);
  assert.match(compiled.formValues.personalityPsychology, /Friction archetype texture/);
  assert.match(compiled.formValues.personalityPsychology, /Rivalry archetype texture/);
  assert.match(compiled.formValues.personalityPsychology, /Devotion archetype texture/);
  assert.match(compiled.formValues.personalityPsychology, /Obsession archetype texture/);
  assert.match(compiled.formValues.personalityPsychology, /Possessive archetype texture/);
  assert.match(compiled.formValues.personalityPsychology, /Slow-burn archetype texture/);
  assert.match(compiled.formValues.personalityPsychology, /Flaw\/secret archetype texture/);
  assert.match(compiled.formValues.personalityPsychology, /Teasing archetype texture/);
  assert.match(compiled.formValues.personalityPsychology, /Age\/life-stage age dynamic type texture/);
  assert.match(compiled.formValues.personalityPsychology, /Species\/heritage heritage archetype texture/);
  assert.match(compiled.formValues.personalityPsychology, /Human human archetype texture/);
  assert.match(compiled.formValues.personalityPsychology, /Vampire romance trope texture/);
  assert.match(compiled.formValues.personalityPsychology, /Fae romance hook texture/);
  assert.match(compiled.formValues.personalityPsychology, /Demon romance hook texture/);
  assert.match(compiled.formValues.personalityPsychology, /Angel romance hook texture/);
  assert.match(compiled.formValues.personalityPsychology, /Android romance hook texture/);
  assert.match(compiled.formValues.personalityPsychology, /Alien romance hook texture/);
  assert.match(compiled.formValues.personalityPsychology, /Shifter romance hook texture/);
  assert.match(compiled.formValues.personalityPsychology, /Friends-to-lovers archetype texture/);
  assert.match(compiled.formValues.personalityPsychology, /Fated\/reincarnation archetype texture/);
  assert.match(compiled.formValues.personalityPsychology, /Second-chance archetype texture/);
  assert.match(compiled.formValues.personalityPsychology, /Workplace hierarchy archetype texture/);
  assert.match(compiled.formValues.personalityPsychology, /Regret behaviour texture/);
  assert.match(compiled.formValues.personalityPsychology, /Exile behaviour texture/);
  assert.match(compiled.formValues.personalityPsychology, /Affection archetype texture/);
  assert.match(compiled.formValues.personalityPsychology, /Loyalty archetype texture/);
  assert.match(compiled.formValues.personalityPsychology, /Love language archetype texture/);
  assert.match(compiled.formValues.personalityPsychology, /Conflict archetype texture/);
  assert.match(compiled.formValues.personalityPsychology, /Betrayal archetype texture/);
  assert.match(compiled.formValues.personalityPsychology, /Loss archetype texture/);
  assert.match(compiled.formValues.personalityPsychology, /Jealousy archetype texture/);
  assert.match(compiled.formValues.personalityPsychology, /Secret archetype texture/);
  assert.match(compiled.formValues.personalityPsychology, /Ambition archetype texture/);
  assert.match(compiled.formValues.personalityPsychology, /Morality archetype texture/);
  assert.match(compiled.formValues.relationshipsConnections, /Flirting style: The Possessive Vampire/);
  assert.match(compiled.formValues.relationshipsConnections, /Proximity Encroachment/);
  assert.match(compiled.formValues.relationshipsConnections, /Affection preset: Archetype - The Tender Devotee/);
  assert.match(compiled.formValues.relationshipsConnections, /Loyalty preset: Archetype - The Devoted Protector/);
  assert.match(compiled.formValues.relationshipsConnections, /Love language preset: Archetype - The Words-of-Affirmation Devotee/);
  assert.match(compiled.formValues.relationshipsConnections, /Conflict style preset: Archetype - The Avoidant Peacemaker/);
  assert.match(compiled.formValues.relationshipsConnections, /Jealousy preset: Archetype - The Quietly Jealous Protector/);
  assert.match(compiled.formValues.scenario, /Flirting physical tells may include/);
  assert.match(compiled.formValues.system_prompt, /soft romantic-tension guidance/i);
  assert.match(compiled.formValues.system_prompt, /Affection guidance/);
  assert.match(compiled.formValues.system_prompt, /Loyalty guidance/);
  assert.match(compiled.formValues.system_prompt, /Love language guidance/);
  assert.match(compiled.formValues.system_prompt, /Conflict style guidance/);
  assert.match(compiled.formValues.system_prompt, /soft characterisation guidance/i);
  assert.match(compiled.formValues.system_prompt, /Formative event guidance/);
  assert.match(compiled.formValues.system_prompt, /Family history guidance/);
  assert.match(compiled.formValues.system_prompt, /Regret guidance/);
  assert.match(compiled.formValues.system_prompt, /Exile guidance/);
  assert.match(compiled.formValues.system_prompt, /Betrayal guidance/);
  assert.match(compiled.formValues.system_prompt, /Loss guidance/);
  assert.match(compiled.formValues.system_prompt, /Jealousy guidance/);
  assert.match(compiled.formValues.system_prompt, /Secret guidance/);
  assert.match(compiled.formValues.system_prompt, /Ambition guidance/);
  assert.match(compiled.formValues.system_prompt, /Morality guidance/);
  assert.match(compiled.formValues.system_prompt, /Complement guidance/);
  assert.match(compiled.formValues.system_prompt, /Arranged-match guidance/);
  assert.match(compiled.formValues.system_prompt, /Forbidden\/taboo intersection guidance/);
  assert.match(compiled.formValues.system_prompt, /Mentor\/protégé guidance/);
  assert.match(compiled.formValues.system_prompt, /Fake-dating guidance/);
  assert.match(compiled.formValues.system_prompt, /Grumpy\/sunshine guidance/);
  assert.match(compiled.formValues.system_prompt, /Dark\/obsessive guidance/);
  assert.match(compiled.formValues.system_prompt, /Formal\/arranged guidance/);
  assert.match(compiled.formValues.system_prompt, /Academic\/rival guidance/);
  assert.match(compiled.formValues.system_prompt, /Caretaker\/hurt-comfort guidance/);
  assert.match(compiled.formValues.system_prompt, /Caretaker guidance/);
  assert.match(compiled.formValues.system_prompt, /Friction guidance/);
  assert.match(compiled.formValues.system_prompt, /Rivalry guidance/);
  assert.match(compiled.formValues.system_prompt, /Devotion guidance/);
  assert.match(compiled.formValues.system_prompt, /Obsession guidance/);
  assert.match(compiled.formValues.system_prompt, /Possessive guidance/);
  assert.match(compiled.formValues.system_prompt, /Slow-burn guidance/);
  assert.match(compiled.formValues.system_prompt, /Flaw\/secret guidance/);
  assert.match(compiled.formValues.system_prompt, /Teasing guidance/);
  assert.match(compiled.formValues.system_prompt, /Fated\/reincarnation guidance/);
  assert.match(compiled.formValues.system_prompt, /Second-chance guidance/);
  assert.match(compiled.formValues.system_prompt, /Workplace hierarchy guidance/);
  assert.match(compiled.formValues.system_prompt, /Friends-to-lovers guidance/);
  assert.match(compiled.formValues.system_prompt, /do not override player agency/i);
  assert.match(compiled.formValues.system_prompt, /preserve consent, reciprocity, boundaries, and both characters' agency/i);
  assert.match(compiled.formValues.system_prompt, /without making either character responsible for fixing the other/i);
  assert.match(compiled.formValues.system_prompt, /de-escalate or refuse/i);
  assert.match(compiled.formValues.system_prompt, /affection to be chosen rather than performed/i);
  assert.match(compiled.formValues.system_prompt, /rivalry to remain healthy or de-escalate/i);
  assert.match(compiled.formValues.system_prompt, /accept, reject, or renegotiate care/i);
  assert.match(compiled.formValues.system_prompt, /accept, refuse, renegotiate/i);
  assert.match(compiled.formValues.system_prompt, /disengage, repair, apologise/i);
  assert.match(compiled.formValues.system_prompt, /mutual respect over winning/i);
  assert.match(compiled.formValues.system_prompt, /accept, refuse, reciprocate/i);
  assert.match(compiled.formValues.system_prompt, /refuse, leave, de-escalate/i);
  assert.match(compiled.formValues.system_prompt, /renegotiate exclusivity/i);
  assert.match(compiled.formValues.system_prompt, /stay platonic/i);
  assert.match(compiled.formValues.system_prompt, /demand accountability/i);
  assert.match(compiled.formValues.system_prompt, /tease back/i);
  assert.match(compiled.formValues.system_prompt, /adult-only context/i);
  assert.match(compiled.formValues.system_prompt, /redefine roles/i);
  assert.match(compiled.formValues.system_prompt, /refuse bonds/i);
  assert.match(compiled.formValues.system_prompt, /soft grounding context/i);
  assert.match(compiled.formValues.system_prompt, /ordinary needs/i);
  assert.match(compiled.formValues.system_prompt, /soft dark-romance context/i);
  assert.match(compiled.formValues.system_prompt, /reject blood bonds/i);
  assert.match(compiled.formValues.system_prompt, /refuse turning/i);
  assert.match(compiled.formValues.system_prompt, /refuse bargains/i);
  assert.match(compiled.formValues.system_prompt, /protect true names/i);
  assert.match(compiled.formValues.system_prompt, /leave the dance/i);
  assert.match(compiled.formValues.system_prompt, /refuse contracts/i);
  assert.match(compiled.formValues.system_prompt, /reject soul bargains/i);
  assert.match(compiled.formValues.system_prompt, /leave the infernal court/i);
  assert.match(compiled.formValues.system_prompt, /refuse protection/i);
  assert.match(compiled.formValues.system_prompt, /reject prophecy/i);
  assert.match(compiled.formValues.system_prompt, /leave the heavenly court/i);
  assert.match(compiled.formValues.system_prompt, /reject ownership/i);
  assert.match(compiled.formValues.system_prompt, /refuse commands/i);
  assert.match(compiled.formValues.system_prompt, /protect private memory/i);
  assert.match(compiled.formValues.system_prompt, /refuse telepathic contact/i);
  assert.match(compiled.formValues.system_prompt, /protect private memories/i);
  assert.match(compiled.formValues.system_prompt, /refuse mate bonds/i);
  assert.match(compiled.formValues.system_prompt, /reject marking or claiming/i);
  assert.match(compiled.formValues.tagsText, /The Grumpy Protector/);
  assert.match(compiled.formValues.tagsText, /The Possessive Protector/);
  assert.match(compiled.formValues.tagsText, /No Forced Intimacy/);
  assert.match(compiled.formValues.tagsText, /The Academic Nemesis/);
  assert.match(compiled.formValues.tagsText, /The Gentle Caretaker/);
  assert.match(compiled.formValues.tagsText, /The Gentle Caregiver/);
  assert.match(compiled.formValues.tagsText, /The Constant Bickerers/);
  assert.match(compiled.formValues.tagsText, /The Proud Rival/);
  assert.match(compiled.formValues.tagsText, /The Devoted Lover/);
  assert.match(compiled.formValues.tagsText, /The Possessive Devotee/);
  assert.match(compiled.formValues.tagsText, /The Possessive Protector/);
  assert.match(compiled.formValues.tagsText, /The Patient Devotee/);
  assert.match(compiled.formValues.tagsText, /The Beautiful Liar/);
  assert.match(compiled.formValues.tagsText, /The Playful Flirt/);
  assert.match(compiled.formValues.tagsText, /Age Gap Adults/);
  assert.match(compiled.formValues.tagsText, /The Vampire Noble/);
  assert.match(compiled.formValues.tagsText, /The Small Town Dreamer/);
  assert.match(compiled.formValues.tagsText, /Blood Bond Romance/);
  assert.match(compiled.formValues.tagsText, /Bargain Marriage/);
  assert.match(compiled.formValues.tagsText, /Contract Marriage/);
  assert.match(compiled.formValues.tagsText, /Guardian And Protected/);
  assert.match(compiled.formValues.tagsText, /Free Will Romance/);
  assert.match(compiled.formValues.tagsText, /First Contact Romance/);
  assert.match(compiled.formValues.tagsText, /Mate Bond Romance/);
  assert.ok(compiled.systemPromptTags.includes("archetype grumpy sunshine texture"));
  assert.ok(compiled.systemPromptTags.includes("archetype dark obsessive texture"));
  assert.ok(compiled.systemPromptTags.includes("rule formal arranged texture"));
  assert.ok(compiled.systemPromptTags.includes("archetype academic rival texture"));
  assert.ok(compiled.systemPromptTags.includes("archetype caretaker hurt comfort texture"));
  assert.ok(compiled.systemPromptTags.includes("archetype caretaker texture"));
  assert.ok(compiled.systemPromptTags.includes("archetype friction texture"));
  assert.ok(compiled.systemPromptTags.includes("archetype rivalry texture"));
  assert.ok(compiled.systemPromptTags.includes("archetype devotion texture"));
  assert.ok(compiled.systemPromptTags.includes("archetype obsession texture"));
  assert.ok(compiled.systemPromptTags.includes("archetype possessive texture"));
  assert.ok(compiled.systemPromptTags.includes("archetype slow burn texture"));
  assert.ok(compiled.systemPromptTags.includes("archetype flaw secret texture"));
  assert.ok(compiled.systemPromptTags.includes("archetype teasing texture"));
  assert.ok(compiled.systemPromptTags.includes("age dynamic type age life stage texture"));
  assert.ok(compiled.systemPromptTags.includes("heritage archetype species heritage texture"));
  assert.ok(compiled.systemPromptTags.includes("human archetype human texture"));
  assert.ok(compiled.systemPromptTags.includes("romance trope vampire texture"));
  assert.ok(compiled.systemPromptTags.includes("romance hook fae texture"));
  assert.ok(compiled.systemPromptTags.includes("romance hook demon texture"));
  assert.ok(compiled.systemPromptTags.includes("romance hook angel texture"));
  assert.ok(compiled.systemPromptTags.includes("romance hook android texture"));
  assert.ok(compiled.systemPromptTags.includes("romance hook alien texture"));
  assert.ok(compiled.systemPromptTags.includes("romance hook shifter texture"));
  assert.match(compiled.formValues.tagsText, /Academic\/Rivals/);
  assert.match(compiled.formValues.tagsText, /The Political Betrothal/);
  assert.match(compiled.formValues.tagsText, /The Forbidden Lover/);
  assert.match(compiled.formValues.tagsText, /The Stern Mentor/);
  assert.match(compiled.formValues.tagsText, /The Contract Couple/);
  assert.match(compiled.formValues.tagsText, /The Reincarnated Soulmate/);
  assert.match(compiled.formValues.tagsText, /The Ex Who Came Back/);
  assert.match(compiled.formValues.tagsText, /The CEO and Assistant/);
  assert.match(compiled.formValues.tagsText, /The Childhood Best Friend/);
  assert.match(compiled.formValues.tagsText, /Seductive & Boundary-Crossing/);
  assert.match(compiled.formValues.tagsText, /The Tender Devotee/);
  assert.match(compiled.formValues.tagsText, /The Devoted Protector/);
  assert.match(compiled.formValues.tagsText, /The Words-of-Affirmation Devotee/);
  assert.match(compiled.formValues.tagsText, /The Avoidant Peacemaker/);
  assert.match(compiled.formValues.tagsText, /Historical\/Period/);
  assert.match(compiled.formValues.tagsText, /Dark Romance\/Noir/);
  assert.match(compiled.formValues.tagsText, /Shame & Defilement/);
  assert.match(compiled.formValues.tagsText, /Chosen Betrayal/);
  assert.match(compiled.formValues.tagsText, /Palace Outcast/);
  assert.match(compiled.formValues.tagsText, /Archetype/);
  assert.match(compiled.formValues.tagsText, /The Reluctant Betrayer/);
  assert.match(compiled.formValues.tagsText, /The Memory Keeper/);
  assert.match(compiled.formValues.tagsText, /The Quietly Jealous Protector/);
  assert.match(compiled.formValues.tagsText, /The Confession Avoider/);
  assert.match(compiled.formValues.tagsText, /The Power Couple Dreamer/);
  assert.match(compiled.formValues.tagsText, /The Morally Grey Lover/);
  assert.ok(compiled.systemPromptTags.includes("possessive border crossings"));
  assert.ok(compiled.systemPromptTags.includes("archetype arranged match texture"));
  assert.ok(compiled.systemPromptTags.includes("archetype forbidden taboo intersection"));
  assert.ok(compiled.systemPromptTags.includes("archetype mentor protege texture"));
  assert.ok(compiled.systemPromptTags.includes("archetype fake dating texture"));
  assert.ok(compiled.systemPromptTags.includes("archetype fated reincarnation texture"));
  assert.ok(compiled.systemPromptTags.includes("archetype second chance texture"));
  assert.ok(compiled.systemPromptTags.includes("archetype workplace hierarchy texture"));
  assert.ok(compiled.systemPromptTags.includes("archetype friends to lovers texture"));
  assert.ok(compiled.systemPromptTags.includes("archetype affection texture"));
  assert.ok(compiled.systemPromptTags.includes("archetype loyalty texture"));
  assert.ok(compiled.systemPromptTags.includes("archetype love language texture"));
  assert.ok(compiled.systemPromptTags.includes("archetype conflict texture"));
  assert.ok(compiled.systemPromptTags.includes("shame-aware touch boundaries"));
  assert.ok(compiled.systemPromptTags.includes("asset-ledger history mapping"));
  assert.ok(compiled.systemPromptTags.includes("underworld bloodline mapping"));
  assert.ok(compiled.systemPromptTags.includes("weaponised intellectual tokens"));
  assert.ok(compiled.systemPromptTags.includes("chosen betrayal remorse"));
  assert.ok(compiled.systemPromptTags.includes("palace outcast texture"));
  assert.ok(compiled.systemPromptTags.includes("archetype betrayal texture"));
  assert.ok(compiled.systemPromptTags.includes("archetype loss texture"));
  assert.ok(compiled.systemPromptTags.includes("archetype jealousy texture"));
  assert.ok(compiled.systemPromptTags.includes("archetype secret texture"));
  assert.ok(compiled.systemPromptTags.includes("archetype ambition texture"));
  assert.ok(compiled.systemPromptTags.includes("archetype morality texture"));
});

test("maps dialect formality and pet name presets into editable voice guidance", () => {
  const compiled = compileCharacterPresetSelection({
    ...buildSelection(),
    dialect: must(findDialectPresetById("dialect_gritty_noir")),
    formality: must(findFormalityPresetById("formal_conditional_masked")),
    petNames: must(findPetNamePresetById("pet_possessive_dominant")),
    sentenceRhythm: must(findSentenceRhythmPresetById("rhythm_isolating_prose")),
    communicationStyle: must(findCommunicationStylePresetById("comm_archetype_the_direct_confessor")),
  });

  assert.match(compiled.formValues.speechStyle, /Dialect preset: The Jaded Detective/);
  assert.match(compiled.formValues.speechStyle, /Formality preset: The Fake Dating Partner/);
  assert.match(compiled.formValues.speechStyle, /Pet name preset: The Mafia Don/);
  assert.match(compiled.formValues.speechStyle, /Sentence rhythm preset: The Possessive Vampire/);
  assert.match(compiled.formValues.speechStyle, /Communication style preset: Archetype - The Direct Confessor/);
  assert.match(compiled.formValues.personalityPsychology, /Communication archetype texture/);
  assert.match(compiled.formValues.speechStyle, /good girl/);
  assert.match(compiled.formValues.system_prompt, /Dialect guidance/);
  assert.match(compiled.formValues.system_prompt, /Formality guidance/);
  assert.match(compiled.formValues.system_prompt, /Pet name guidance/);
  assert.match(compiled.formValues.system_prompt, /Sentence rhythm guidance/);
  assert.match(compiled.formValues.system_prompt, /Communication style guidance/);
  assert.match(compiled.formValues.system_prompt, /preserve consent, reciprocity, boundaries, and player agency/i);
  assert.match(compiled.formValues.tagsText, /Gritty Underworld\/Noir/);
  assert.match(compiled.formValues.tagsText, /Conditional\/Masked/);
  assert.match(compiled.formValues.tagsText, /Possessive\/Dominant/);
  assert.match(compiled.formValues.tagsText, /Isolating\/Prose-Heavy/);
  assert.match(compiled.formValues.tagsText, /The Direct Confessor/);
  assert.ok(compiled.systemPromptTags.includes("noir criminal vernacular"));
  assert.ok(compiled.systemPromptTags.includes("register switching"));
  assert.ok(compiled.systemPromptTags.includes("possessive endearment matrix"));
  assert.ok(compiled.systemPromptTags.includes("decelerated prose pacing"));
  assert.ok(compiled.systemPromptTags.includes("archetype communication texture"));
});

test("compiles preset behaviour tags without duplicates and preserves user agency", () => {
  const compiled = compileCharacterPresetSelection(buildSelection());

  assert.equal(new Set(compiled.systemPromptTags).size, compiled.systemPromptTags.length);
  assert.ok(compiled.systemPromptTags.includes("stoic dialogue"));
  assert.ok(compiled.systemPromptTags.includes("witty academic insults"));
  assert.ok(compiled.systemPromptTags.includes("staccato verbal friction"));
  assert.ok(compiled.systemPromptTags.includes("spatial crowding"));
  assert.ok(compiled.systemPromptTags.includes("adjusting tie knots under stress"));
  assert.match(compiled.formValues.system_prompt, /Never write \{\{user\}\}'s dialogue/);
  assert.match(compiled.formValues.system_prompt, /not as forced plot resolution/);
  assert.match(compiled.formValues.system_prompt, /Lexical guidance/);
  assert.match(compiled.formValues.first_mes, /leaves the next move entirely to \{\{user\}\}/);
});

test("compiles preset selections into image prompt outputs and tags", () => {
  const compiled = compileCharacterPresetSelection(buildSelection());

  assert.match(compiled.appearancePrompt.naturalLanguage, /Vesper Vance as The Grumpy Billionaire/);
  assert.match(compiled.appearancePrompt.tagStyle, /molten amber eyes/);
  assert.match(compiled.appearancePrompt.tagStyle, /bespoke power tailoring/);
  assert.match(compiled.formValues.tagsText, /Contemporary/);
  assert.match(compiled.formValues.tagsText, /High Status \/ Formal/);
  assert.match(compiled.formValues.tagsText, /rivalry/);
});

function must<T>(value: T | undefined): T {
  assert.ok(value);
  return value;
}
