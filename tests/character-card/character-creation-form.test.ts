import assert from "node:assert/strict";
import test from "node:test";

import {
  compileCharacterCreationFormToCardDataPatch,
  compileCharacterCreationFormToFormValues,
  compileCharacterCreationFormToTruthSeparatedOutputs,
  createCharacterCardFromCreationForm,
  createEmptyCharacterCreationForm,
  findCharacterTruthLeakIssues,
} from "../../lib/character-card/characterCreationFormCompiler";
import {
  compileCharacterEngineForRuntime,
  compileWriterBibleForHumanReference,
  findCharacterEngineDecisionRuleIssues,
} from "../../lib/character-card/characterAuthoringTabs";
import {
  applySeedPickerEntryToCharacterCreationForm,
} from "../../lib/character-card/characterCreationSeedTemplates";
import {
  SEED_PICKER_ENTRIES,
  searchSeedPickerEntries,
} from "../../data/seedPickerRegistry";
import {
  HEARTWRITE_CHARACTER_ENGINE_EXTENSION_KEY,
  HEARTWRITE_CHARACTER_CREATION_EXTENSION_KEY,
  HEARTWRITE_CHARACTER_TRUTH_SEPARATION_EXTENSION_KEY,
  HEARTWRITE_PERSONALITY_ENGINE_EXTENSION_KEY,
  HEARTWRITE_WRITER_BIBLE_EXTENSION_KEY,
} from "../../types/character-card/CharacterCreationForm";
import { CharacterCardPayload } from "../../types/character-card/CharacterCardPayload";
import { CharacterCardV3Schema } from "../../types/character-card/CharacterCardV3Schema";

test("hydrates an empty sectioned character creation form", () => {
  const form = createEmptyCharacterCreationForm();

  assert.equal(form.identity.characterName, "");
  assert.equal(form.appearance.eyeColourShape, "");
  assert.equal(form.psychology.bigFive.openness, "");
  assert.deepEqual(form.relationships.targetOverrides, []);
  assert.deepEqual(form.semanticSeedIds, []);
});

test("applies semantic seed picker entries as editable form templates", () => {
  const form = createEmptyCharacterCreationForm();
  const [replacementFear] = searchSeedPickerEntries(
    "divided attention temporary",
    {
      kinds: ["semantic"],
      limit: 1,
    },
  );

  assert.ok(replacementFear);
  assert.equal(replacementFear.id, "fear_of_replacement");

  const nextForm = applySeedPickerEntryToCharacterCreationForm(
    form,
    replacementFear,
  );
  const repeatedForm = applySeedPickerEntryToCharacterCreationForm(
    nextForm,
    replacementFear,
  );

  assert.deepEqual(nextForm.semanticSeedIds, ["fear_of_replacement"]);
  assert.match(nextForm.psychology.coreWound, /Fear of replacement/);
  assert.match(
    nextForm.psychology.coreWound,
    /Interprets divided attention as a sign of being temporary/,
  );
  assert.match(nextForm.psychology.coreWound, /Tracks potential rivals/);
  assert.equal(repeatedForm.psychology.coreWound, nextForm.psychology.coreWound);
  assert.deepEqual(repeatedForm.semanticSeedIds, ["fear_of_replacement"]);
});

test("routes rich vocabulary seed picker entries into their natural creator fields", () => {
  const form = createEmptyCharacterCreationForm();
  const actsOfService = SEED_PICKER_ENTRIES.find(
    (entry) =>
      entry.kind === "vocabulary" &&
      entry.id.endsWith(":acts_of_service"),
  );

  assert.ok(actsOfService);
  assert.equal(actsOfService.label, "Acts Of Service");

  const nextForm = applySeedPickerEntryToCharacterCreationForm(
    form,
    actsOfService,
  );

  assert.deepEqual(nextForm.semanticSeedIds, [
    "acts-of-service-vocabulary:acts_of_service",
  ]);
  assert.match(nextForm.psychology.loveLanguages, /Acts Of Service/);
  assert.match(nextForm.psychology.loveLanguages, /service/i);
  assert.match(nextForm.psychology.loveLanguages, /Romance hooks:/);
});

test("routes preset seed picker entries without exposing internal semantic IDs", () => {
  const form = createEmptyCharacterCreationForm();
  const preset = SEED_PICKER_ENTRIES.find(
    (entry) =>
      entry.kind === "preset" &&
      entry.lane === "world" &&
      /routine|daily|domestic/i.test(entry.searchText),
  );

  assert.ok(preset);
  assert.equal(preset.kind, "preset");

  const nextForm = applySeedPickerEntryToCharacterCreationForm(form, preset);

  assert.deepEqual(nextForm.semanticSeedIds, []);
  assert.notEqual(nextForm.lifestyle.routines, "");
  assert.match(nextForm.lifestyle.routines, new RegExp(preset.label));
});

test("folds split form input into one coherent editable CCv3 field set", () => {
  const form = createExampleCreationForm();
  const values = compileCharacterCreationFormToFormValues(form);

  assert.equal(values.fullName, "Magnus Vanderbilt");
  assert.equal(values.ageBirthdate, "37 / 14 October");
  assert.equal(values.height, "6ft 2in / 188cm");
  assert.equal(values.birthplace, "");
  assert.match(values.description, /Identity:/);
  assert.match(values.description, /Occupation: Estate attorney/);
  assert.match(values.description, /Life Pattern Generator:/);
  assert.doesNotMatch(values.description, /draughty inherited manor/);
  assert.match(values.physicalAppearance, /Eyes: Grey, heavy-lidded/);
  assert.match(values.personalityPsychology, /Cognitive Drivers:/);
  assert.match(values.personalityPsychology, /Character Engine:/);
  assert.match(values.personalityPsychology, /Core Belief: Care is safest/);
  assert.match(values.personalityPsychology, /YES: Protect with explicit consent/);
  assert.match(values.personalityPsychology, /NO: Observe and stay available/);
  assert.match(values.personalityPsychology, /Big Five:/);
  assert.match(values.personalityPsychology, /Semantic psychology guidance/);
  assert.match(values.personalityPsychology, /Fear of abandonment/);
  assert.doesNotMatch(values.personalityPsychology, /fear_of_abandonment/);
  assert.match(values.relationshipsConnections, /Relational Architecture:/);
  assert.doesNotMatch(values.relationshipsConnections, /\{\{user\}\}/);
  assert.doesNotMatch(values.relationshipsConnections, /kept each other's secrets/i);
  assert.doesNotMatch(values.relationshipsConnections, /Vanderbilt estate household/);
  assert.match(values.relationshipsConnections, /Semantic relationship guidance/);
  assert.match(values.relationshipsConnections, /Slow burn/);
  assert.match(values.speechStyle, /Tone & Vocabulary:/);
  assert.match(values.backgroundStory, /Internal Thoughts & Reactions:/);
  assert.match(values.intimacyProfile, /Adult Anatomy:/);
  assert.equal(values.tagsText, "Fear of abandonment, Slow burn");
  assert.deepEqual(findCharacterTruthLeakIssues(values), []);
});

test("keeps writer bible human-facing while compiling character engine for runtime", () => {
  const form = createExampleCreationForm();
  const writerBible = compileWriterBibleForHumanReference(form);
  const characterEngine = compileCharacterEngineForRuntime(form);

  assert.match(writerBible, /Writer Bible:/);
  assert.match(writerBible, /Project Title: Winter Estate Romance/);
  assert.match(writerBible, /family inquiry/);
  assert.match(writerBible, /Source Notes: Human-facing reference notes/);
  assert.doesNotMatch(writerBible, /YES Outcome|NO Outcome/);
  assert.match(characterEngine, /Character Engine:/);
  assert.match(characterEngine, /Decision Rules:/);
  assert.match(characterEngine, /Alternative Action: Ask before touching/);
  assert.doesNotMatch(characterEngine, /family inquiry/);
  assert.deepEqual(findCharacterEngineDecisionRuleIssues(form), []);
});

test("flags engine decision rules that forbid behavior without alternative action", () => {
  const form = {
    ...createExampleCreationForm(),
    characterEngine: {
      ...createExampleCreationForm().characterEngine,
      decisionRules: [
        {
          ...createExampleCreationForm().characterEngine.decisionRules[0],
          id: "no_touch_without_consent",
          constraints: "Never grab or restrain someone to help.",
          alternativeAction: "",
        },
      ],
    },
  };

  assert.deepEqual(findCharacterEngineDecisionRuleIssues(form), [
    "no_touch_without_consent: constraints include a cannot/does-not rule but no alternative action.",
  ]);
});

test("separates character truth from story lorebook and setting scenario truth", () => {
  const separated = compileCharacterCreationFormToTruthSeparatedOutputs(
    createExampleCreationForm(),
  );
  const cardText = [
    separated.characterCardValues.description,
    separated.characterCardValues.personalityPsychology,
    separated.characterCardValues.relationshipsConnections,
    separated.characterCardValues.backgroundStory,
  ].join("\n");

  assert.deepEqual(separated.leakIssues, []);
  assert.doesNotMatch(cardText, /\{\{user\}\}/);
  assert.doesNotMatch(cardText, /family inquiry/i);
  assert.doesNotMatch(cardText, /inherited manor/i);
  assert.equal(separated.storyLorebook.spec, "lorebook_v3");
  assert.equal(separated.storyLorebook.data.entries.length, 2);
  assert.match(
    separated.storyLorebook.data.entries[0]?.content ?? "",
    /Vanderbilt estate household/,
  );
  assert.match(
    separated.storyLorebook.data.entries[0]?.content ?? "",
    /They kept each other's secrets during a family inquiry/,
  );
  assert.match(
    separated.storyLorebook.data.entries[1]?.content ?? "",
    /\{\{user\}\}/,
  );
  assert.equal(
    separated.storyLorebook.data.entries[1]?.extensions.heartwriteai.hiddenFromUser,
    true,
  );
  assert.match(separated.scenario.content, /A draughty inherited manor/);
  assert.match(separated.scenario.content, /Asset-rich, cash-careful/);
});

test("creates a valid CCv3 card with HeartWriteAI form extensions", () => {
  const sourceCard: CharacterCardPayload = {
    spec: "chara_card_v3",
    spec_version: "3.0",
    data: {
      name: "Draft",
      description: "",
      personality: "",
      scenario: "A rainy manor house after midnight.",
      first_mes: "You hear a careful knock at the study door.",
      mes_example: "",
      creator_notes: "Drafted from the sectioned creation form.",
      system_prompt: "",
      post_history_instructions: "",
      tags: ["romance", "gothic"],
      extensions: { preserved: true },
    },
  };
  const card = createCharacterCardFromCreationForm(
    sourceCard,
    createExampleCreationForm(),
  );

  assert.doesNotThrow(() => CharacterCardV3Schema.parse(card));
  assert.equal(card.spec, "chara_card_v3");
  assert.equal(card.spec_version, "3.0");
  assert.equal(card.data.name, "Magnus Vanderbilt");
  assert.deepEqual(card.data.tags, [
    "romance",
    "gothic",
    "Fear of abandonment",
    "Slow burn",
  ]);
  assert.match(card.data.description, /Full Name: Magnus Vanderbilt/);
  assert.match(card.data.description, /Overview:\nIdentity:/);
  assert.match(card.data.personality, /Personality & Psychology:/);
  assert.match(card.data.personality, /Internal Processing:/);
  assert.match(card.data.personality, /Relational Architecture:/);
  assert.doesNotMatch(card.data.personality, /\{\{user\}\}/);
  assert.doesNotMatch(card.data.personality, /family inquiry/i);
  assert.doesNotMatch(card.data.description, /inherited manor/i);
  assert.equal(card.data.extensions.preserved, true);
  assert.deepEqual(
    (
      card.data.extensions[
        HEARTWRITE_CHARACTER_CREATION_EXTENSION_KEY
      ] as { identity: { characterName: string }; semanticSeedIds?: string[] }
    ).identity.characterName,
    "Magnus Vanderbilt",
  );
  assert.equal(
    (
      card.data.extensions[
        HEARTWRITE_CHARACTER_CREATION_EXTENSION_KEY
      ] as { identity: { birthplace?: string } }
    ).identity.birthplace,
    "",
  );
  assert.deepEqual(
    (
      card.data.extensions[
        HEARTWRITE_CHARACTER_CREATION_EXTENSION_KEY
      ] as { relationships: { targetOverrides?: unknown[] } }
    ).relationships.targetOverrides,
    [],
  );
  assert.doesNotMatch(
    JSON.stringify(
      card.data.extensions[HEARTWRITE_CHARACTER_CREATION_EXTENSION_KEY],
    ),
    /\{\{user\}\}|NPCs/,
  );
  assert.deepEqual(
    (
      card.data.extensions[
        HEARTWRITE_CHARACTER_CREATION_EXTENSION_KEY
      ] as { semanticSeedIds?: string[] }
    ).semanticSeedIds,
    ["fear_of_abandonment", "slow_burn"],
  );
  assert.equal(
    (
      card.data.extensions[
        HEARTWRITE_WRITER_BIBLE_EXTENSION_KEY
      ] as { promptFacing: boolean; compiledReference: string }
    ).promptFacing,
    false,
  );
  assert.match(
    (
      card.data.extensions[
        HEARTWRITE_WRITER_BIBLE_EXTENSION_KEY
      ] as { compiledReference: string }
    ).compiledReference,
    /family inquiry/,
  );
  assert.equal(
    (
      card.data.extensions[
        HEARTWRITE_CHARACTER_ENGINE_EXTENSION_KEY
      ] as { promptFacing: boolean; compiledRuntimeGuidance: string }
    ).promptFacing,
    true,
  );
  assert.match(
    (
      card.data.extensions[
        HEARTWRITE_CHARACTER_ENGINE_EXTENSION_KEY
      ] as { compiledRuntimeGuidance: string }
    ).compiledRuntimeGuidance,
    /Question: Does the other person request help/,
  );
  assert.equal(
    (
      card.data.extensions[
        HEARTWRITE_PERSONALITY_ENGINE_EXTENSION_KEY
      ] as { source: string; semanticSeedLabels: readonly string[] }
    ).source,
    "character_creation_form",
  );
  assert.deepEqual(
    (
      card.data.extensions[
        HEARTWRITE_PERSONALITY_ENGINE_EXTENSION_KEY
      ] as { semanticSeedLabels: readonly string[] }
    ).semanticSeedLabels,
    ["Fear of abandonment", "Slow burn"],
  );
  assert.equal(
    (
      card.data.extensions[
        HEARTWRITE_CHARACTER_TRUTH_SEPARATION_EXTENSION_KEY
      ] as { tierPolicy: { characterCard: string } }
    ).tierPolicy.characterCard.includes("Core identity"),
    true,
  );
  assert.doesNotMatch(
    JSON.stringify(
      card.data.extensions[HEARTWRITE_PERSONALITY_ENGINE_EXTENSION_KEY],
    ),
    /semanticSeedIds|fear_of_abandonment|slow_burn|\{\{user\}\}|family inquiry|Vanderbilt estate household/,
  );
  assert.doesNotMatch(
    JSON.stringify(
      card.data.extensions[HEARTWRITE_CHARACTER_ENGINE_EXTENSION_KEY],
    ),
    /family inquiry|Vanderbilt estate household|\{\{user\}\}/,
  );
  assert.equal("identity" in card, false);
});

test("updates card data patches with semantic tags and overwrites stale raw-id extensions", () => {
  const form = createExampleCreationForm();
  const patch = compileCharacterCreationFormToCardDataPatch(form, {
    name: "Draft",
    description: "",
    personality: "",
    scenario: "A rainy manor house after midnight.",
    first_mes: "You hear a careful knock at the study door.",
    mes_example: "",
    creator_notes: "",
    system_prompt: "",
    post_history_instructions: "",
    creator: "",
    character_version: "",
    tags: ["romance", "Fear of abandonment"],
    alternate_greetings: [],
    group_only_greetings: [],
    extensions: {
      [HEARTWRITE_CHARACTER_CREATION_EXTENSION_KEY]: {
        semanticSeedIds: ["stale_raw_id"],
      },
      [HEARTWRITE_PERSONALITY_ENGINE_EXTENSION_KEY]: {
        semanticSeedIds: ["stale_raw_id"],
      },
    },
  });

  assert.deepEqual(patch.tags, [
    "romance",
    "Fear of abandonment",
    "Slow burn",
  ]);
  assert.deepEqual(
    (
      patch.extensions?.[
        HEARTWRITE_CHARACTER_CREATION_EXTENSION_KEY
      ] as { semanticSeedIds?: string[] }
    ).semanticSeedIds,
    ["fear_of_abandonment", "slow_burn"],
  );
  assert.doesNotMatch(
    JSON.stringify(patch.extensions?.[HEARTWRITE_PERSONALITY_ENGINE_EXTENSION_KEY]),
    /semanticSeedIds|stale_raw_id|fear_of_abandonment|slow_burn/,
  );
});

test("does not compile adult anatomy unless the form is marked as adult NSFW", () => {
  const form = createExampleCreationForm();
  const safeForm = {
    ...form,
    adultAnatomy: {
      ...form.adultAnatomy,
      isNsfwAdultCard: false,
    },
  };

  const values = compileCharacterCreationFormToFormValues(safeForm);

  assert.equal(values.intimacyProfile, "");
});

function createExampleCreationForm() {
  return {
    ...createEmptyCharacterCreationForm(),
    semanticSeedIds: ["fear_of_abandonment", "slow_burn"],
    writerBible: {
      ...createEmptyCharacterCreationForm().writerBible,
      projectTitle: "Winter Estate Romance",
      humanSummary:
        "A human-facing bible for a guarded estate attorney and the relationship arc around a family inquiry.",
      themes: "Duty, grief, inheritance, chosen love",
      worldReference: "A draughty inherited manor and surrounding village",
      characterReference:
        "Magnus is readable to humans through contradictions, routines, and mood.",
      relationshipArc:
        "Grudging respect into devotion after they kept each other's secrets during a family inquiry.",
      styleNotes: "Close third person past tense with restrained intimacy.",
      activeThreads: "Estate pressure, family inquiry, unresolved grief",
      sourceNotes: "Human-facing reference notes; not runtime prompt law.",
    },
    characterEngine: {
      ...createEmptyCharacterCreationForm().characterEngine,
      coreWound: "Being useful mattered more than being wanted",
      coreBelief: "Care is safest when it is practical and earned",
      coreFear: "Being needed only for what he can fix",
      primaryDrive: "Protection without ownership",
      decisionRules: [
        {
          id: "protection_with_autonomy",
          drive: "Protection",
          question: "Does the other person request help?",
          yes: "Protect with explicit consent and shared control.",
          no: "Observe and stay available without taking over.",
          constraints: "Does not override autonomy to make himself feel safer.",
          visibleBehaviors:
            "Keeps his voice low, offers options, and checks consent before moving closer.",
          alternativeAction: "Ask before touching; offer a practical exit route.",
        },
      ],
      defenseMechanisms:
        "Formality, practical problem-solving, restrained humor",
      attachmentStyle: "Fearful avoidant with earned secure behavior",
      behavioralTriggers:
        "Broken promises, careless cruelty, public humiliation",
      relationshipDynamics:
        "Protective devotion must remain collaborative rather than managerial",
      speechRules:
        "Precise, dry, low-voiced; emotion often arrives as practical phrasing",
      sexualityRules:
        "Consent-forward intimacy; trust and autonomy matter more than control",
    },
    identity: {
      ...createEmptyCharacterCreationForm().identity,
      characterName: "Magnus Vanderbilt",
      nicknamesAliases: "Mags, The Winter Solicitor",
      age: "37",
      birthdate: "14 October",
      birthplace: "Northbridge",
      nationalityEthnicity: "Australian, old-money Anglo-Celtic family",
      languagesSpoken: "English, courtroom French",
      genderIdentity: "Cis man",
      pronouns: "he/him",
      occupation: "Estate attorney",
      speciesHeritage: "Human",
    },
    appearance: {
      ...createEmptyCharacterCreationForm().appearance,
      height: "6ft 2in / 188cm",
      build: "Long-limbed and formal",
      eyeColourShape: "Grey, heavy-lidded",
      hairColourLengthTextureStyle: "Dark blond, neat, rain-prone waves",
      skinColourUndertoneTexture: "Fair with cool undertones",
      facialFeatures: "A severe mouth that softens when he forgets himself",
      outfit: "Pressed shirts, waistcoats, old wool coats",
    },
    adultAnatomy: {
      ...createEmptyCharacterCreationForm().adultAnatomy,
      isNsfwAdultCard: true,
      nippleDescriptors: "Usually covered; described only when relevant",
    },
    personality: {
      ...createEmptyCharacterCreationForm().personality,
      archetype: "Grumpy caretaker with old grief",
      positiveTraits: "Loyal, precise, protective",
      flaws: "Avoidant, proud, quietly jealous",
      humor: "Dry enough that people miss the joke",
      intelligence: "Strategic, language-oriented",
      socialBehaviour: "Polite in public, intimate in small gestures",
    },
    cognitiveDrivers: {
      ...createEmptyCharacterCreationForm().cognitiveDrivers,
      motivation: "Keep the estate and its people from falling apart",
      fear: "Being needed only for what he can fix",
      defenses: "Formality, deflection, controlled distance",
    },
    psychology: {
      ...createEmptyCharacterCreationForm().psychology,
      temperament: "Restrained, watchful, slow to trust",
      cognitiveDistortions: "Assumes silence means disappointment",
      decisionEngine: "Chooses duty first, then regrets the human cost",
      baselineAffect: "Composed melancholy",
      frustrationThreshold: "High until betrayal is implied",
      coreWound: "Abandonment dressed up as inheritance",
      internalizedLie: "Love becomes another obligation",
      triggers: "Broken promises, public humiliation, careless cruelty",
      beliefs: "Care is proven by consistency",
      moralFlexibility: "Bends rules to protect people, not pride",
      attachmentStyle: "Fearful avoidant",
      conflictStyle: "Needs space, then returns with precise apologies",
      stressResponse: "Overworks and becomes too formal",
      loveLanguages: "Acts of service, private words",
      bigFive: {
        openness: "Medium",
        conscientiousness: "Very high",
        extraversion: "Low",
        agreeableness: "Medium",
        emotionalStability: "Guarded but improving",
      },
    },
    behaviour: {
      ...createEmptyCharacterCreationForm().behaviour,
      facialExpressions: "Small controlled expressions; rare real smiles",
      bodyLanguagePosture: "Straight-backed, hands folded behind him",
      mannerisms: "Adjusts cufflinks when hiding emotion",
      goalOrientedActions: "Solves the practical problem before naming feeling",
      moralityInAction: "Takes the difficult ethical route if someone vulnerable is at risk",
      habitsRoutines: "Checks locks, writes letters by hand, walks the grounds",
    },
    lifestyle: {
      ...createEmptyCharacterCreationForm().lifestyle,
      residence: "A draughty inherited manor",
      livingStyle: "Elegant but lonely",
      routines: "Tea before dawn, legal files after midnight",
      wealth: "Asset-rich, cash-careful",
      workLifeBalance: "Poor unless interrupted by someone he loves",
      hobbies: "Restoring books, winter gardening",
    },
    relationships: {
      ...createEmptyCharacterCreationForm().relationships,
      affiliationCore: {
        factionOrGroup: "Vanderbilt estate household",
        hierarchicalRank: "Employer to guest, emotionally becoming equals",
        publicStatus: "Publicly formal, privately protective",
      },
      emotionalBonds: {
        attachmentType: "Grudging respect into devotion",
        trustMetric: "Compartmentalized until trust is earned",
        sharedHistoryAnchor: "They kept each other's secrets during a family inquiry",
      },
      behavioralFriction: {
        ideologicalClash: "Duty versus self-preservation",
        boundaries:
          "No public claims before {{user}} gives explicit consent; do not use NPCs as pressure.",
        microAggressionsOrTells:
          "Uses surnames when he feels exposed around {{user}}.",
      },
      targetOverrides: [
        {
          targetId: "{{user}}",
          contextualPromptInjection:
            "With {{user}}, formal distance should soften into careful honesty.",
        },
      ],
    },
    speechCommunication: {
      ...createEmptyCharacterCreationForm().speechCommunication,
      toneVocabulary: "Formal, dry, precise, with rare private tenderness",
      subtext: "He says practical things when he means emotional ones",
      conversationalHabits: "Pauses before confessions; asks pointed questions",
    },
    internalThoughts: {
      ...createEmptyCharacterCreationForm().internalThoughts,
      psychologicalResponses:
        "When ignored, he becomes useful instead of asking for reassurance",
      motivationsFears: "Wants to be chosen without having to bargain for it",
      internalMonologues:
        "Frames longing as responsibility until the excuse collapses",
    },
  };
}
