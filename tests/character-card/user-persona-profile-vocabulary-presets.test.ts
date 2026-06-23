import assert from "node:assert/strict";
import test from "node:test";

import {
  USER_PERSONA_PROFILE_VOCABULARY_STANDARD_SEEDS,
  compileUserPersonaProfilePrompt,
  userPersonaProfilePrinciples,
  userPersonaProfileSections,
  userPersonaProfileSemanticChain,
} from "../../data/userPersonaProfileVocabularyPresets";
import { findSemanticSeedGraphNodeById } from "../../data/semanticSeedRegistry";
import {
  getRichStandardVocabularySeedsBySource,
  searchStandardVocabularySeeds,
} from "../../data/standardVocabularySeedRegistry";

test("defines user persona profile sections from basic identity through story hooks", () => {
  assert.deepEqual(userPersonaProfileSemanticChain, [
    "User Persona Basic",
    "Persona Psychology",
    "Cognition",
    "Motivational Drivers",
    "Relational Style",
    "Attraction and Chemistry Hooks",
    "Behavior Patterns",
    "Story Hooks",
  ]);
  assert.equal(
    userPersonaProfilePrinciples.includes(
      "User persona fields should describe the user's playable stance without writing their actions, thoughts, or consent for them.",
    ),
    true,
  );
});

test("stores every user persona profile section with fields and matching signals", () => {
  assert.deepEqual(
    userPersonaProfileSections.map((section) => section.seed),
    [
      "user_persona_basic",
      "persona_psychology",
      "persona_cognition",
      "persona_motivational_drivers",
      "persona_relational_style",
      "persona_attraction_chemistry_hooks",
      "persona_behavior_patterns",
      "persona_story_hooks",
    ],
  );

  const psychology = userPersonaProfileSections.find(
    (section) => section.seed === "persona_psychology",
  );
  const behaviorPatterns = userPersonaProfileSections.find(
    (section) => section.seed === "persona_behavior_patterns",
  );

  assert.equal(psychology?.fields.includes("boundaries"), true);
  assert.equal(psychology?.matchingSignals.includes("boundary constraints"), true);
  assert.equal(behaviorPatterns?.fields.includes("interpretation"), true);
  assert.equal(behaviorPatterns?.matchingSignals.includes("feedback loop"), true);
});

test("compiles persona profile input into concise prompt-safe prose", () => {
  const prompt = compileUserPersonaProfilePrompt({
    basic: {
      nameAlias: "Mara",
      age: "adult",
      background: "Former medic trying to rebuild a quiet life",
      roleArchetype: "guarded caretaker",
      startingSituation: "Arrives at the safehouse after a failed rescue",
    },
    psychology: {
      coreTraits: ["observant", "loyal", "slow to trust"],
      insecurities: ["being a burden"],
      desires: ["reliable partnership"],
      boundaries: ["no public humiliation"],
    },
    cognition: {
      attention: "tracks exits and tone shifts",
      perception: "reads silence as possible anger",
      memory: "remembers practical details",
      decisionStyle: "acts after checking immediate risks",
    },
    motivationalDrivers: {
      autonomy: "needs choice preserved",
      competence: "wants to be useful",
      relatedness: "bonds through shared responsibility",
      intrinsic: "values quiet repair",
      extrinsic: "responds poorly to public pressure",
    },
    relationalStyle: {
      attachmentStyle: "earned secure",
      trustFormation: "repeated follow-through",
      conflictStyle: "space then direct repair",
    },
    attractionChemistryHooks: {
      whatTheyRespondTo: ["competence", "patient humor"],
      whatDestabilizesThem: ["mixed signals", "reckless sacrifice"],
    },
    behaviorPatterns: [
      {
        trigger: "someone disappears without warning",
        interpretation: "they may not come back",
        response: "asks directly after a quiet delay",
      },
    ],
    storyHooks: {
      goals: ["make the safehouse functional"],
      internalConflicts: ["wants closeness but distrusts need"],
      externalPressures: ["old debts from the failed rescue"],
    },
  });

  assert.match(prompt, /User Persona Profile:/);
  assert.match(prompt, /Name or alias: Mara/);
  assert.match(prompt, /Core traits: observant, loyal, slow to trust/);
  assert.match(prompt, /Behavior patterns: someone disappears without warning -> they may not come back -> asks directly after a quiet delay/);
  assert.doesNotMatch(prompt, /forced_user_behavior/);
  assert.doesNotMatch(prompt, /user_persona_profile:/);
});

test("projects user persona profile seeds into standard vocabulary and semantic graph metadata", () => {
  const seeds = getRichStandardVocabularySeedsBySource(
    "user-persona-profile-vocabulary",
  );
  const behaviorResults = searchStandardVocabularySeeds("trigger to interpretation", {
    sourceIds: ["user-persona-profile-vocabulary"],
    limit: 3,
  });
  const graphNode = findSemanticSeedGraphNodeById(
    "user-persona-profile-vocabulary:user_persona_basic_profile_section",
  );

  assert.equal(seeds.length, USER_PERSONA_PROFILE_VOCABULARY_STANDARD_SEEDS.length);
  assert.equal(behaviorResults[0]?.label, "Behavior Patterns Profile Section");
  assert.equal(graphNode?.category, "metadata_tags");
  assert.equal(graphNode?.label, "User Persona Basic Profile Section");
});
