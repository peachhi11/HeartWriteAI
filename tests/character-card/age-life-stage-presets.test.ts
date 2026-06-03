import assert from "node:assert/strict";
import test from "node:test";

import {
  AGE_LIFE_STAGE_PRESET_CATEGORIES,
  AGE_LIFE_STAGE_PRESETS,
  compileAgeLifeStagePresetAdditions,
  compileAgeLifeStagePresetSummary,
  findAgeLifeStagePresetById,
  getAgeLifeStagePresetsByCategory,
} from "../../data/ageLifeStagePresets";

test("loads age/life-stage presets across adult identity and romance lanes", () => {
  assert.equal(AGE_LIFE_STAGE_PRESETS.length, 4556);
  assert.equal(AGE_LIFE_STAGE_PRESET_CATEGORIES.length, 262);
  assert.deepEqual(AGE_LIFE_STAGE_PRESET_CATEGORIES.filter(
    (category) =>
        !/^(40|42|44|46|48|50|52|54|56|58|60|62|64|66|68|70|72|74|76|78|80|82|84|86|88|90|92|94|96|98)-/.test(
          category,
        ),
  ), [
    "18-19 Age Bracket",
    "18-19 Career Stage",
    "18-19 Character Archetype",
    "18-19 Development Stage",
    "18-19 Energy Stage",
    "18-19 Family Stage",
    "18-19 Mortality Awareness",
    "18-19 Psychological Stage",
    "18-19 Reputation Stage",
    "18-19 Romance Stage",
    "18-19 Social Stage",
    "18-29 Age Bracket",
    "18-29 Career Stage",
    "18-29 Development Stage",
    "18-29 Energy Stage",
    "18-29 Family Stage",
    "18-29 Mortality Awareness",
    "18-29 Psychological Stage",
    "18-29 Reputation Stage",
    "18-29 Romance Archetype",
    "18-29 Romance Stage",
    "18-29 Social Stage",
    "20-21 Age Bracket",
    "20-21 Career Stage",
    "20-21 Character Archetype",
    "20-21 Core Theme",
    "20-21 Development Stage",
    "20-21 Energy Stage",
    "20-21 Family Stage",
    "20-21 Mortality Awareness",
    "20-21 Psychological Stage",
    "20-21 Reputation Stage",
    "20-21 Romance Stage",
    "20-21 Social Stage",
    "22-23 Age Bracket",
    "22-23 Career Stage",
    "22-23 Development Stage",
    "22-23 Energy Stage",
    "22-23 Family Stage",
    "22-23 Mortality Awareness",
    "22-23 Psychological Stage",
    "22-23 Reputation Stage",
    "22-23 Romance Stage",
    "22-23 Social Stage",
    "24-25 Age Bracket",
    "24-25 Core Theme",
    "24-25 Development Stage",
    "24-25 Social Stage",
    "24-29 Romance Archetype",
    "26-27 Age Bracket",
    "26-27 Core Theme",
    "26-27 Psychological Stage",
    "28-29 Age Bracket",
    "28-29 Core Theme",
    "28-29 Mortality Awareness",
    "30-31 Age Bracket",
    "30-31 Career Stage",
    "30-31 Development Stage",
    "30-31 Energy Stage",
    "30-31 Family Stage",
    "30-31 Mortality Awareness",
    "30-31 Psychological Stage",
    "30-31 Reputation Stage",
    "30-31 Romance Stage",
    "30-31 Social Stage",
    "30-39 Romance Archetype",
    "32-33 Age Bracket",
    "32-33 Core Theme",
    "32-33 Psychological Stage",
    "34-35 Age Bracket",
    "34-35 Core Theme",
    "34-35 Romance Stage",
    "36-37 Age Bracket",
    "36-37 Career Stage",
    "36-37 Core Theme",
    "38-39 Age Bracket",
    "38-39 Core Theme",
    "38-39 Mortality Awareness",
    "Adult Age Bracket",
    "Adult Age Category",
    "Aftermath Route",
    "Age Discrepancy",
    "Age Dynamic Type",
    "Age Presentation",
    "Apparent Age",
    "Beauty Age",
    "Behaviour",
    "Body Age",
    "Career Stage",
    "Dialogue Seed",
    "Early Adult Descriptor",
    "Emotional Flavour",
    "Energy Age",
    "Facial Age",
    "Family Stage",
    "Gate",
    "Life Stage",
    "Life Stage Pressure",
    "Life Stage Pressure Dialogue Seed",
    "Life Stage Pressure Preset",
    "Life Stage Pressure Trigger",
    "Maturity Aftermath Route",
    "Maturity Age",
    "Maturity Behaviour",
    "Maturity Dialogue Seed",
    "Maturity Emotional Flavour",
    "Maturity Gate",
    "Maturity Method",
    "Maturity Romance Trope",
    "Maturity Trigger Event",
    "Maturity Type",
    "Maturity Vibe",
    "Maturity Wound",
    "Middle Adult Descriptor",
    "Motivation",
    "Numerical Bracket",
    "Older Adult Descriptor",
    "Romance Stage",
    "Romance Trope",
    "Social Age",
    "Species Age Masking",
    "Trigger Event",
    "Voice Age",
    "Wound",
    "Young Adult Descriptor",
  ]);

  assert.equal(getAgeLifeStagePresetsByCategory("life stage").length, 20);
  assert.equal(getAgeLifeStagePresetsByCategory("adult age bracket").length, 20);
  assert.equal(getAgeLifeStagePresetsByCategory("numerical bracket").length, 14);
  assert.equal(getAgeLifeStagePresetsByCategory("18-19 age bracket").length, 2);
  assert.equal(
    getAgeLifeStagePresetsByCategory("18-19 development stage").length,
    20,
  );
  assert.equal(getAgeLifeStagePresetsByCategory("18-19 social stage").length, 20);
  assert.equal(getAgeLifeStagePresetsByCategory("18-19 career stage").length, 20);
  assert.equal(getAgeLifeStagePresetsByCategory("18-19 romance stage").length, 20);
  assert.equal(getAgeLifeStagePresetsByCategory("18-19 family stage").length, 20);
  assert.equal(
    getAgeLifeStagePresetsByCategory("18-19 psychological stage").length,
    20,
  );
  assert.equal(getAgeLifeStagePresetsByCategory("18-19 energy stage").length, 20);
  assert.equal(
    getAgeLifeStagePresetsByCategory("18-19 reputation stage").length,
    20,
  );
  assert.equal(
    getAgeLifeStagePresetsByCategory("18-19 mortality awareness").length,
    20,
  );
  assert.equal(
    getAgeLifeStagePresetsByCategory("18-19 character archetype").length,
    20,
  );
  assert.equal(getAgeLifeStagePresetsByCategory("18-29 age bracket").length, 5);
  assert.equal(
    getAgeLifeStagePresetsByCategory("18-29 development stage").length,
    20,
  );
  assert.equal(getAgeLifeStagePresetsByCategory("18-29 social stage").length, 20);
  assert.equal(getAgeLifeStagePresetsByCategory("18-29 career stage").length, 20);
  assert.equal(getAgeLifeStagePresetsByCategory("18-29 romance stage").length, 20);
  assert.equal(getAgeLifeStagePresetsByCategory("18-29 family stage").length, 20);
  assert.equal(
    getAgeLifeStagePresetsByCategory("18-29 psychological stage").length,
    20,
  );
  assert.equal(getAgeLifeStagePresetsByCategory("18-29 energy stage").length, 20);
  assert.equal(
    getAgeLifeStagePresetsByCategory("18-29 reputation stage").length,
    20,
  );
  assert.equal(
    getAgeLifeStagePresetsByCategory("18-29 mortality awareness").length,
    20,
  );
  assert.equal(
    getAgeLifeStagePresetsByCategory("18-29 romance archetype").length,
    20,
  );
  assert.equal(getAgeLifeStagePresetsByCategory("20-21 age bracket").length, 2);
  assert.equal(
    getAgeLifeStagePresetsByCategory("20-21 development stage").length,
    20,
  );
  assert.equal(getAgeLifeStagePresetsByCategory("20-21 social stage").length, 20);
  assert.equal(getAgeLifeStagePresetsByCategory("20-21 career stage").length, 20);
  assert.equal(getAgeLifeStagePresetsByCategory("20-21 romance stage").length, 20);
  assert.equal(getAgeLifeStagePresetsByCategory("20-21 family stage").length, 20);
  assert.equal(
    getAgeLifeStagePresetsByCategory("20-21 psychological stage").length,
    20,
  );
  assert.equal(getAgeLifeStagePresetsByCategory("20-21 energy stage").length, 20);
  assert.equal(
    getAgeLifeStagePresetsByCategory("20-21 reputation stage").length,
    20,
  );
  assert.equal(
    getAgeLifeStagePresetsByCategory("20-21 mortality awareness").length,
    20,
  );
  assert.equal(
    getAgeLifeStagePresetsByCategory("20-21 character archetype").length,
    20,
  );
  assert.equal(getAgeLifeStagePresetsByCategory("20-21 core theme").length, 20);
  assert.equal(getAgeLifeStagePresetsByCategory("22-23 age bracket").length, 2);
  assert.equal(
    getAgeLifeStagePresetsByCategory("22-23 development stage").length,
    20,
  );
  assert.equal(getAgeLifeStagePresetsByCategory("22-23 social stage").length, 20);
  assert.equal(getAgeLifeStagePresetsByCategory("22-23 career stage").length, 20);
  assert.equal(getAgeLifeStagePresetsByCategory("22-23 romance stage").length, 20);
  assert.equal(getAgeLifeStagePresetsByCategory("22-23 family stage").length, 20);
  assert.equal(
    getAgeLifeStagePresetsByCategory("22-23 psychological stage").length,
    20,
  );
  assert.equal(getAgeLifeStagePresetsByCategory("22-23 energy stage").length, 20);
  assert.equal(
    getAgeLifeStagePresetsByCategory("22-23 reputation stage").length,
    20,
  );
  assert.equal(
    getAgeLifeStagePresetsByCategory("22-23 mortality awareness").length,
    20,
  );
  assert.equal(getAgeLifeStagePresetsByCategory("24-25 age bracket").length, 2);
  assert.equal(getAgeLifeStagePresetsByCategory("24-25 core theme").length, 20);
  assert.equal(
    getAgeLifeStagePresetsByCategory("24-25 development stage").length,
    20,
  );
  assert.equal(getAgeLifeStagePresetsByCategory("24-25 social stage").length, 20);
  assert.equal(
    getAgeLifeStagePresetsByCategory("24-29 romance archetype").length,
    20,
  );
  assert.equal(getAgeLifeStagePresetsByCategory("26-27 age bracket").length, 2);
  assert.equal(getAgeLifeStagePresetsByCategory("26-27 core theme").length, 20);
  assert.equal(
    getAgeLifeStagePresetsByCategory("26-27 psychological stage").length,
    20,
  );
  assert.equal(getAgeLifeStagePresetsByCategory("28-29 age bracket").length, 2);
  assert.equal(getAgeLifeStagePresetsByCategory("28-29 core theme").length, 20);
  assert.equal(
    getAgeLifeStagePresetsByCategory("28-29 mortality awareness").length,
    20,
  );
  assert.equal(getAgeLifeStagePresetsByCategory("30-31 age bracket").length, 2);
  assert.equal(
    getAgeLifeStagePresetsByCategory("30-31 development stage").length,
    20,
  );
  assert.equal(getAgeLifeStagePresetsByCategory("30-31 social stage").length, 20);
  assert.equal(getAgeLifeStagePresetsByCategory("30-31 career stage").length, 20);
  assert.equal(getAgeLifeStagePresetsByCategory("30-31 romance stage").length, 20);
  assert.equal(getAgeLifeStagePresetsByCategory("30-31 family stage").length, 20);
  assert.equal(
    getAgeLifeStagePresetsByCategory("30-31 psychological stage").length,
    20,
  );
  assert.equal(getAgeLifeStagePresetsByCategory("30-31 energy stage").length, 20);
  assert.equal(
    getAgeLifeStagePresetsByCategory("30-31 reputation stage").length,
    20,
  );
  assert.equal(
    getAgeLifeStagePresetsByCategory("30-31 mortality awareness").length,
    20,
  );
  assert.equal(
    getAgeLifeStagePresetsByCategory("30-39 romance archetype").length,
    20,
  );
  assert.equal(getAgeLifeStagePresetsByCategory("32-33 age bracket").length, 2);
  assert.equal(getAgeLifeStagePresetsByCategory("32-33 core theme").length, 20);
  assert.equal(
    getAgeLifeStagePresetsByCategory("32-33 psychological stage").length,
    20,
  );
  assert.equal(getAgeLifeStagePresetsByCategory("34-35 age bracket").length, 2);
  assert.equal(getAgeLifeStagePresetsByCategory("34-35 core theme").length, 20);
  assert.equal(getAgeLifeStagePresetsByCategory("34-35 romance stage").length, 20);
  assert.equal(getAgeLifeStagePresetsByCategory("36-37 age bracket").length, 2);
  assert.equal(getAgeLifeStagePresetsByCategory("36-37 core theme").length, 20);
  assert.equal(getAgeLifeStagePresetsByCategory("36-37 career stage").length, 20);
  assert.equal(getAgeLifeStagePresetsByCategory("38-39 age bracket").length, 2);
  assert.equal(getAgeLifeStagePresetsByCategory("38-39 core theme").length, 20);
  assert.equal(
    getAgeLifeStagePresetsByCategory("38-39 mortality awareness").length,
    20,
  );
  const laterAdultCategoryCounts = [
    ["40-41 age bracket", 2],
    ["40-41 development stage", 20],
    ["40-41 social stage", 20],
    ["40-41 career stage", 20],
    ["40-41 romance stage", 20],
    ["40-41 family stage", 20],
    ["40-41 psychological stage", 20],
    ["40-41 energy stage", 20],
    ["40-41 reputation stage", 20],
    ["40-41 mortality awareness", 20],
    ["42-43 age bracket", 2],
    ["42-43 core theme", 20],
    ["42-43 psychological stage", 20],
    ["44-45 age bracket", 2],
    ["44-45 core theme", 20],
    ["44-45 romance stage", 20],
    ["46-47 age bracket", 2],
    ["46-47 core theme", 20],
    ["46-47 career stage", 20],
    ["48-49 age bracket", 2],
    ["48-49 core theme", 20],
    ["48-49 mortality awareness", 20],
    ["40-49 romance archetype", 20],
    ["50-51 age bracket", 2],
    ["50-51 development stage", 20],
    ["50-51 social stage", 20],
    ["50-51 career stage", 20],
    ["50-51 romance stage", 20],
    ["50-51 family stage", 20],
    ["50-51 psychological stage", 20],
    ["50-51 energy stage", 20],
    ["50-51 reputation stage", 20],
    ["50-51 mortality awareness", 20],
    ["52-53 age bracket", 2],
    ["52-53 core theme", 20],
    ["52-53 psychological stage", 20],
    ["54-55 age bracket", 2],
    ["54-55 core theme", 20],
    ["54-55 romance stage", 20],
    ["56-57 age bracket", 2],
    ["56-57 core theme", 20],
    ["56-57 career stage", 20],
    ["58-59 age bracket", 2],
    ["58-59 core theme", 20],
    ["58-59 mortality awareness", 20],
    ["50-59 romance archetype", 20],
    ["60-61 age bracket", 2],
    ["60-61 development stage", 20],
    ["60-61 social stage", 20],
    ["60-61 career stage", 20],
    ["60-61 romance stage", 20],
    ["60-61 family stage", 20],
    ["60-61 psychological stage", 20],
    ["60-61 energy stage", 20],
    ["60-61 reputation stage", 20],
    ["60-61 mortality awareness", 20],
    ["62-63 age bracket", 2],
    ["62-63 core theme", 20],
    ["62-63 psychological stage", 20],
    ["64-65 age bracket", 2],
    ["64-65 core theme", 20],
    ["64-65 romance stage", 20],
    ["66-67 age bracket", 2],
    ["66-67 core theme", 20],
    ["66-67 career stage", 20],
    ["68-69 age bracket", 2],
    ["68-69 core theme", 20],
    ["68-69 mortality awareness", 20],
    ["60-69 romance archetype", 20],
    ["70-71 age bracket", 2],
    ["70-71 development stage", 20],
    ["70-71 social stage", 20],
    ["70-71 career stage", 20],
    ["70-71 romance stage", 20],
    ["70-71 family stage", 20],
    ["70-71 psychological stage", 20],
    ["70-71 energy stage", 20],
    ["70-71 reputation stage", 20],
    ["70-71 mortality awareness", 20],
    ["72-73 age bracket", 2],
    ["72-73 core theme", 20],
    ["74-75 age bracket", 2],
    ["74-75 core theme", 20],
    ["74-75 romance stage", 20],
    ["76-77 age bracket", 2],
    ["76-77 core theme", 20],
    ["76-77 career stage", 20],
    ["78-79 age bracket", 2],
    ["78-79 core theme", 20],
    ["78-79 mortality awareness", 20],
    ["70-79 romance archetype", 20],
    ["80-81 age bracket", 2],
    ["80-81 career stage", 20],
    ["80-81 development stage", 20],
    ["80-81 energy stage", 20],
    ["80-81 family stage", 20],
    ["80-81 mortality awareness", 20],
    ["80-81 psychological stage", 20],
    ["80-81 reputation stage", 20],
    ["80-81 romance stage", 20],
    ["80-81 social stage", 20],
    ["80-89 romance archetype", 20],
    ["82-83 age bracket", 2],
    ["82-83 core theme", 20],
    ["82-83 psychological stage", 20],
    ["84-85 age bracket", 2],
    ["84-85 core theme", 20],
    ["84-85 romance stage", 20],
    ["86-87 age bracket", 2],
    ["86-87 career stage", 20],
    ["86-87 core theme", 20],
    ["88-89 age bracket", 2],
    ["88-89 core theme", 20],
    ["88-89 mortality awareness", 20],
    ["90-91 age bracket", 2],
    ["90-91 career stage", 20],
    ["90-91 development stage", 20],
    ["90-91 energy stage", 20],
    ["90-91 family stage", 20],
    ["90-91 mortality awareness", 20],
    ["90-91 psychological stage", 20],
    ["90-91 reputation stage", 20],
    ["90-91 romance stage", 20],
    ["90-91 social stage", 20],
    ["90-99 romance archetype", 20],
    ["92-93 age bracket", 2],
    ["92-93 core theme", 20],
    ["92-93 psychological stage", 20],
    ["94-95 age bracket", 2],
    ["94-95 core theme", 20],
    ["94-95 romance stage", 20],
    ["96-97 age bracket", 2],
    ["96-97 career stage", 20],
    ["96-97 core theme", 20],
    ["98-99 age bracket", 2],
    ["98-99 core theme", 20],
    ["98-99 mortality awareness", 20],
    ["age discrepancy", 20],
    ["age presentation", 10],
    ["beauty age", 20],
    ["body age", 20],
    ["energy age", 20],
    ["facial age", 20],
    ["maturity aftermath route", 20],
    ["maturity age", 20],
    ["maturity behaviour", 20],
    ["maturity dialogue seed", 20],
    ["maturity emotional flavour", 20],
    ["maturity gate", 20],
    ["maturity method", 20],
    ["maturity romance trope", 20],
    ["maturity trigger event", 20],
    ["maturity type", 20],
    ["maturity wound", 20],
    ["social age", 20],
    ["species age masking", 20],
    ["voice age", 20],
  ] satisfies Array<[string, number]>;

  laterAdultCategoryCounts.forEach(([category, count]) => {
    assert.equal(getAgeLifeStagePresetsByCategory(category).length, count);
  });
  assert.equal(getAgeLifeStagePresetsByCategory("career stage").length, 15);
  assert.equal(getAgeLifeStagePresetsByCategory("romance stage").length, 15);
  assert.equal(getAgeLifeStagePresetsByCategory("family stage").length, 15);
  assert.equal(getAgeLifeStagePresetsByCategory("maturity vibe").length, 54);
  assert.equal(getAgeLifeStagePresetsByCategory("apparent age").length, 54);
  assert.equal(getAgeLifeStagePresetsByCategory("life stage pressure").length, 66);
  assert.equal(
    getAgeLifeStagePresetsByCategory("life stage pressure preset").length,
    20,
  );
  assert.equal(
    getAgeLifeStagePresetsByCategory("life stage pressure trigger").length,
    20,
  );
  assert.equal(
    getAgeLifeStagePresetsByCategory("life stage pressure dialogue seed").length,
    16,
  );
  assert.equal(getAgeLifeStagePresetsByCategory("dialogue seed").length, 20);
});

test("normalises readable age/life-stage values and UK spelling", () => {
  const youngProfessional = findAgeLifeStagePresetById(
    "age_life_stage_the_young_professional",
  );
  const bracket = findAgeLifeStagePresetById("age_bracket_early_20s");
  const finalised = findAgeLifeStagePresetById("age_trigger_divorce_finalised");
  const patronising = findAgeLifeStagePresetById("age_behaviour_avoids_patronising");
  const prioritises = findAgeLifeStagePresetById("age_behaviour_prioritises_stability");
  const ageing = findAgeLifeStagePresetById("age_wound_ageing_visibility_wound");
  const twentySomething = findAgeLifeStagePresetById(
    "age_life_stage_the_ambitious_twenty_something",
  );
  const numerical = findAgeLifeStagePresetById("age_numerical_25_to_29");
  const career = findAgeLifeStagePresetById("age_career_senior_professional");
  const romanceStage = findAgeLifeStagePresetById("age_romance_stage_single_after_loss");
  const familyStage = findAgeLifeStagePresetById("age_family_stage_single_parent");
  const maturityHighValue = findAgeLifeStagePresetById(
    "age_maturity_high_value_legacy_driven",
  );
  const unknownAdultAge = findAgeLifeStagePresetById(
    "age_bracket_unknown_adult_age",
  );
  const futureUncertainty = findAgeLifeStagePresetById(
    "age_wound_future_uncertainty",
  );
  const fineBracket = findAgeLifeStagePresetById("age_18_29_bracket_22_to_24");
  const youngAdultDevelopment = findAgeLifeStagePresetById(
    "age_18_29_development_newly_independent",
  );
  const socialStage = findAgeLifeStagePresetById(
    "age_18_29_social_chronically_online",
  );
  const youngAdultCareer = findAgeLifeStagePresetById(
    "age_18_29_career_startup_founder",
  );
  const youngAdultRomance = findAgeLifeStagePresetById(
    "age_18_29_romance_situationship_survivor",
  );
  const youngAdultFamily = findAgeLifeStagePresetById(
    "age_18_29_family_single_parent_young_adult",
  );
  const psychologicalStage = findAgeLifeStagePresetById(
    "age_18_29_psychological_impostor_syndrome",
  );
  const energyStage = findAgeLifeStagePresetById(
    "age_18_29_energy_burnout_prone",
  );
  const reputationStage = findAgeLifeStagePresetById(
    "age_18_29_reputation_rising_star",
  );
  const mortalityAwareness = findAgeLifeStagePresetById(
    "age_18_29_mortality_fear_of_wasting_potential",
  );
  const romanceArchetype = findAgeLifeStagePresetById(
    "age_18_29_archetype_career_vs_love",
  );
  const age18 = findAgeLifeStagePresetById("age_18_19_bracket_18");
  const newlyAdult = findAgeLifeStagePresetById(
    "age_18_19_development_newly_adult",
  );
  const finalYearStudent = findAgeLifeStagePresetById(
    "age_18_19_social_final_year_student",
  );
  const firstYearStudent = findAgeLifeStagePresetById(
    "age_18_19_career_first_year_student",
  );
  const discoversLove = findAgeLifeStagePresetById(
    "age_18_19_romance_discovering_what_love_means",
  );
  const foundFamily = findAgeLifeStagePresetById(
    "age_18_19_family_found_family_seeking",
  );
  const futureAnxious = findAgeLifeStagePresetById(
    "age_18_19_psychological_future_anxious",
  );
  const dreamFuelled = findAgeLifeStagePresetById(
    "age_18_19_energy_dream_fuelled",
  );
  const campusKnown = findAgeLifeStagePresetById(
    "age_18_19_reputation_campus_known",
  );
  const firstMortalityEncounter = findAgeLifeStagePresetById(
    "age_18_19_mortality_first_encounter_with_mortality",
  );
  const stillBecoming = findAgeLifeStagePresetById(
    "age_18_19_archetype_still_becoming_someone",
  );
  const identityConsolidation = findAgeLifeStagePresetById(
    "age_20_21_development_identity_consolidation",
  );
  const thirdYearStudent = findAgeLifeStagePresetById(
    "age_20_21_social_third_year_student",
  );
  const buildingResume = findAgeLifeStagePresetById(
    "age_20_21_career_building_resume",
  );
  const firstRealisation = findAgeLifeStagePresetById(
    "age_20_21_mortality_first_realisation_of_time",
  );
  const futureCeo = findAgeLifeStagePresetById("age_20_21_archetype_future_ceo");
  const selfAuthorship = findAgeLifeStagePresetById(
    "age_22_23_development_self_authorship",
  );
  const professionalSocialising = findAgeLifeStagePresetById(
    "age_22_23_social_professional_socialising",
  );
  const sociallyRecognised = findAgeLifeStagePresetById(
    "age_22_23_reputation_socially_recognised",
  );
  const maximiseOpportunity = findAgeLifeStagePresetById(
    "age_22_23_mortality_trying_to_maximise_opportunity",
  );
  const groupOrganiser = findAgeLifeStagePresetById(
    "age_24_25_social_group_organiser",
  );
  const lessValidationSeeking = findAgeLifeStagePresetById(
    "age_26_27_psychological_less_validation_seeking",
  );
  const awareOfAgeing = findAgeLifeStagePresetById(
    "age_28_29_mortality_aware_of_ageing",
  );
  const lessFomo = findAgeLifeStagePresetById(
    "age_28_29_mortality_less_fear_of_missing_out_more_intention",
  );
  const powerCouple = findAgeLifeStagePresetById(
    "age_24_29_archetype_power_couple_material",
  );
  const identityStabilised = findAgeLifeStagePresetById(
    "age_30_31_development_identity_stabilised",
  );
  const eventOrganiser = findAgeLifeStagePresetById(
    "age_30_31_social_event_organiser",
  );
  const recognisedExpertise = findAgeLifeStagePresetById(
    "age_30_31_career_recognised_expertise",
  );
  const trustedAdviser = findAgeLifeStagePresetById(
    "age_30_31_reputation_trusted_adviser",
  );
  const earlyThirtiesAgeing = findAgeLifeStagePresetById(
    "age_30_31_mortality_aware_of_ageing",
  );
  const deeplySelfAware = findAgeLifeStagePresetById(
    "age_32_33_psychological_deeply_self_aware",
  );
  const devotionBasedLove = findAgeLifeStagePresetById(
    "age_34_35_romance_devotion_based_love",
  );
  const recognisedExpert = findAgeLifeStagePresetById(
    "age_36_37_career_recognised_expert",
  );
  const nonRenewableTime = findAgeLifeStagePresetById(
    "age_38_39_mortality_time_is_non_renewable",
  );
  const lifePartnerMaterial = findAgeLifeStagePresetById(
    "age_30_39_archetype_life_partner_material",
  );
  const fortiesAdviserRole = findAgeLifeStagePresetById(
    "age_40_41_social_adviser_role",
  );
  const fortiesTrustedAdviser = findAgeLifeStagePresetById(
    "age_40_41_reputation_trusted_adviser",
  );
  const fortiesOrganisationalAnchor = findAgeLifeStagePresetById(
    "age_46_47_career_organisational_anchor",
  );
  const fiftiesFulfilment = findAgeLifeStagePresetById(
    "age_50_51_development_personal_fulfilment",
  );
  const fiftiesRelationshipStabiliser = findAgeLifeStagePresetById(
    "age_50_51_social_relationship_stabiliser",
  );
  const sixtiesLegacyRealisation = findAgeLifeStagePresetById(
    "age_60_61_development_legacy_realisation",
  );
  const sixtiesAdviserRole = findAgeLifeStagePresetById(
    "age_60_61_social_adviser_role",
  );
  const seventiesRespectedNeighbour = findAgeLifeStagePresetById(
    "age_70_71_social_respected_neighbour",
  );
  const seventiesHonouredContributor = findAgeLifeStagePresetById(
    "age_70_71_reputation_honoured_contributor",
  );
  const seventiesFamilyAdviser = findAgeLifeStagePresetById(
    "age_76_77_career_family_adviser",
  );
  const seventiesLoveLegacy = findAgeLifeStagePresetById(
    "age_78_79_mortality_love_is_the_legacy",
  );
  const eightiesCentrepiece = findAgeLifeStagePresetById(
    "age_80_81_social_family_centrepiece",
  );
  const eightiesHonouredFounder = findAgeLifeStagePresetById(
    "age_80_81_career_honoured_founder",
  );
  const eightiesFulfilment = findAgeLifeStagePresetById(
    "age_82_83_core_fulfilment",
  );
  const eightiesHonouringMemory = findAgeLifeStagePresetById(
    "age_84_85_romance_widowed_and_honouring_memory",
  );
  const eightiesRespectedAdviser = findAgeLifeStagePresetById(
    "age_86_87_career_respected_adviser",
  );
  const ninetiesGratitudeCentred = findAgeLifeStagePresetById(
    "age_90_91_development_gratitude_centred_living",
  );
  const ninetiesHonouredElder = findAgeLifeStagePresetById(
    "age_90_91_reputation_honoured_elder",
  );
  const ninetiesFulfilled = findAgeLifeStagePresetById(
    "age_92_93_psychological_fulfilled",
  );
  const ninetiesLoveCentury = findAgeLifeStagePresetById(
    "age_90_99_archetype_love_after_a_century",
  );
  const apparentEighty = findAgeLifeStagePresetById(
    "age_apparent_core_appears_80",
  );
  const speciesStoppedAgeing = findAgeLifeStagePresetById(
    "age_species_masking_stops_ageing_at_25",
  );
  const ageDiscrepancy = findAgeLifeStagePresetById(
    "age_discrepancy_centuries_old_but_appears_25",
  );
  const beautyAgeing = findAgeLifeStagePresetById(
    "age_beauty_elegant_ageing",
  );
  const maturityDialogue = findAgeLifeStagePresetById(
    "age_maturity_dialogue_maturity_is_choosing_love_with_open_eyes",
  );
  const pressureFinancialIndependence = findAgeLifeStagePresetById(
    "age_pressure_financial_independence",
  );
  const pressureAgeing = findAgeLifeStagePresetById("age_pressure_ageing_pressure");
  const pressurePreset = findAgeLifeStagePresetById(
    "age_pressure_preset_the_overachieving_young_adult",
  );
  const pressureTriggerFinalised = findAgeLifeStagePresetById(
    "age_pressure_trigger_divorce_finalised",
  );
  const pressureDialogueTimeline = findAgeLifeStagePresetById(
    "age_pressure_dialogue_i_don_t_want_a_perfect_timeline_i_want_a_real_life",
  );

  assert.equal(youngProfessional?.label, "The Young Professional");
  assert.equal(twentySomething?.label, "The Ambitious Twenty-Something");
  assert.equal(bracket?.value, "early 20s");
  assert.equal(numerical?.value, "25 to 29");
  assert.equal(career?.value, "senior professional");
  assert.equal(romanceStage?.value, "single after loss");
  assert.equal(familyStage?.value, "single parent");
  assert.equal(maturityHighValue?.value, "legacy driven");
  assert.equal(unknownAdultAge?.value, "unknown adult age");
  assert.equal(finalised?.value, "divorce finalised");
  assert.equal(patronising?.value, "avoids patronising");
  assert.equal(prioritises?.value, "prioritises stability");
  assert.equal(ageing?.value, "ageing visibility wound");
  assert.equal(futureUncertainty?.value, "future uncertainty");
  assert.equal(fineBracket?.value, "22 to 24");
  assert.equal(youngAdultDevelopment?.value, "newly independent");
  assert.equal(socialStage?.value, "chronically online");
  assert.equal(youngAdultCareer?.value, "startup founder");
  assert.equal(youngAdultRomance?.value, "situationship survivor");
  assert.equal(youngAdultFamily?.value, "single parent young adult");
  assert.equal(psychologicalStage?.value, "impostor syndrome");
  assert.equal(energyStage?.value, "burnout prone");
  assert.equal(reputationStage?.value, "rising star");
  assert.equal(mortalityAwareness?.value, "fear of wasting potential");
  assert.equal(romanceArchetype?.value, "career versus love");
  assert.equal(age18?.value, "18");
  assert.equal(newlyAdult?.value, "newly adult");
  assert.equal(finalYearStudent?.value, "final year student");
  assert.equal(firstYearStudent?.value, "first year student");
  assert.equal(discoversLove?.value, "discovering what love means");
  assert.equal(foundFamily?.value, "found family seeking");
  assert.equal(futureAnxious?.value, "future anxious");
  assert.equal(dreamFuelled?.value, "dream fuelled");
  assert.equal(campusKnown?.value, "campus known");
  assert.equal(firstMortalityEncounter?.value, "first encounter with mortality");
  assert.equal(stillBecoming?.value, "still becoming someone");
  assert.equal(identityConsolidation?.value, "identity consolidation");
  assert.equal(thirdYearStudent?.value, "third year student");
  assert.equal(buildingResume?.value, "building resume");
  assert.equal(firstRealisation?.value, "first realisation of time");
  assert.equal(futureCeo?.value, "future CEO");
  assert.equal(selfAuthorship?.value, "self authorship");
  assert.equal(professionalSocialising?.value, "professional socialising");
  assert.equal(sociallyRecognised?.value, "socially recognised");
  assert.equal(maximiseOpportunity?.value, "trying to maximise opportunity");
  assert.equal(groupOrganiser?.value, "group organiser");
  assert.equal(lessValidationSeeking?.value, "less validation seeking");
  assert.equal(awareOfAgeing?.value, "aware of ageing");
  assert.equal(lessFomo?.value, "less fear of missing out more intention");
  assert.equal(powerCouple?.value, "power couple material");
  assert.equal(identityStabilised?.value, "identity stabilised");
  assert.equal(eventOrganiser?.value, "event organiser");
  assert.equal(recognisedExpertise?.value, "recognised expertise");
  assert.equal(trustedAdviser?.value, "trusted adviser");
  assert.equal(earlyThirtiesAgeing?.value, "aware of ageing");
  assert.equal(deeplySelfAware?.value, "deeply self aware");
  assert.equal(devotionBasedLove?.value, "devotion based love");
  assert.equal(recognisedExpert?.value, "recognised expert");
  assert.equal(nonRenewableTime?.value, "time is non-renewable");
  assert.equal(lifePartnerMaterial?.value, "life partner material");
  assert.equal(fortiesAdviserRole?.value, "adviser role");
  assert.equal(fortiesTrustedAdviser?.value, "trusted adviser");
  assert.equal(
    fortiesOrganisationalAnchor?.value,
    "organisational anchor",
  );
  assert.equal(fiftiesFulfilment?.value, "personal fulfilment");
  assert.equal(
    fiftiesRelationshipStabiliser?.value,
    "relationship stabiliser",
  );
  assert.equal(sixtiesLegacyRealisation?.value, "legacy realisation");
  assert.equal(sixtiesAdviserRole?.value, "adviser role");
  assert.equal(seventiesRespectedNeighbour?.value, "respected neighbour");
  assert.equal(seventiesHonouredContributor?.value, "honoured contributor");
  assert.equal(seventiesFamilyAdviser?.value, "family adviser");
  assert.equal(seventiesLoveLegacy?.value, "love is the legacy");
  assert.equal(eightiesCentrepiece?.value, "family centrepiece");
  assert.equal(eightiesHonouredFounder?.value, "honoured founder");
  assert.equal(eightiesFulfilment?.value, "fulfilment");
  assert.equal(
    eightiesHonouringMemory?.value,
    "widowed and honouring memory",
  );
  assert.equal(eightiesRespectedAdviser?.value, "respected adviser");
  assert.equal(
    ninetiesGratitudeCentred?.value,
    "gratitude centred living",
  );
  assert.equal(ninetiesHonouredElder?.value, "honoured elder");
  assert.equal(ninetiesFulfilled?.value, "fulfilled");
  assert.equal(ninetiesLoveCentury?.value, "love after a century");
  assert.equal(apparentEighty?.value, "appears 80");
  assert.equal(speciesStoppedAgeing?.value, "stops ageing at 25");
  assert.equal(
    ageDiscrepancy?.value,
    "centuries old but appears 25",
  );
  assert.equal(beautyAgeing?.value, "elegant ageing");
  assert.equal(
    maturityDialogue?.value,
    "Maturity is choosing love with open eyes.",
  );
  assert.equal(
    pressureFinancialIndependence?.value,
    "financial independence",
  );
  assert.equal(pressureAgeing?.value, "ageing pressure");
  assert.equal(pressurePreset?.value, "The Overachieving Young Adult");
  assert.equal(pressureTriggerFinalised?.value, "divorce finalised");
  assert.equal(
    pressureDialogueTimeline?.value,
    "I don't want a perfect timeline. I want a real life.",
  );

  const readableText = JSON.stringify(
    AGE_LIFE_STAGE_PRESETS.map((preset) => ({
      category: preset.category,
      label: preset.label,
      value: preset.value,
      guidance: preset.guidance,
    })),
  );
  assert.doesNotMatch(readableText, /Use code with caution/i);
  assert.doesNotMatch(readableText, /early_20s|25_29|18_19|22_24/i);
  assert.doesNotMatch(readableText, /divorce_finalized|patronizing/i);
  assert.doesNotMatch(
    readableText,
    /prioritizes|aging_visibility|career_focused|newly_independent|career_vs_love/i,
  );
  assert.doesNotMatch(
    readableText,
    /newly_adult|leaving_childhood|high_school_senior|freshman|dream_fueled|emotion_fueled|college_freshman|still_becoming_someone/i,
  );
  assert.doesNotMatch(
    readableText,
    /identity_consolidation|junior_student|future_ceo|first_realization|post_education|self_authorship/i,
  );
  assert.doesNotMatch(
    readableText,
    /professional_socializing|socially_recognized|maximize|new_city_settled|group_organizer|less_fomo|aware_of_aging/i,
  );
  assert.doesNotMatch(
    readableText,
    /identity_stabilized|professional_networked|event_organizer|career_stabilized|recognized|\badvisor\b/i,
  );
  assert.doesNotMatch(
    readableText,
    /less_fomo|tradeoffs|nonrenewable|building_what_outlasts_me/i,
  );
  assert.doesNotMatch(
    readableText,
    /stabilizer|organizer|aging|fulfillment|realization|centered|honored|honoring|neighbor|pretense|centerpiece|teenage_energy|college_energy/i,
  );
});

test("compiles age/life-stage presets as soft adult-only agency guidance", () => {
  const preset = findAgeLifeStagePresetById("age_dynamic_age_gap_adults");
  assert.ok(preset);

  const summary = compileAgeLifeStagePresetSummary(preset);
  const additions = compileAgeLifeStagePresetAdditions(preset);

  assert.match(summary, /Age\/life-stage preset: Age Dynamic Type - Age Gap Adults/);
  assert.match(additions.relationshipAddition, /adult relationship dynamic context/i);
  assert.match(additions.personalityAddition, /only when relevant/i);
  assert.match(additions.systemPromptAddition, /adult-only context/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /player agency/i);
  assert.match(additions.systemPromptAddition, /refuse guidance/);
  assert.match(additions.systemPromptAddition, /redefine roles/);
  assert.doesNotMatch(additions.systemPromptAddition, /must|override/i);
});
