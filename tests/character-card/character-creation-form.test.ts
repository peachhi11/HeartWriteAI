import assert from "node:assert/strict";
import test from "node:test";

import {
  compileCharacterCreationFormToCardDataPatch,
  compileCharacterCreationFormToFormValues,
  createCharacterCardFromCreationForm,
  createEmptyCharacterCreationForm,
} from "../../lib/character-card/characterCreationFormCompiler";
import {
  HEARTWRITE_CHARACTER_CREATION_EXTENSION_KEY,
  HEARTWRITE_PERSONALITY_ENGINE_EXTENSION_KEY,
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

test("folds split form input into one coherent editable CCv3 field set", () => {
  const form = createExampleCreationForm();
  const values = compileCharacterCreationFormToFormValues(form);

  assert.equal(values.fullName, "Magnus Vanderbilt");
  assert.equal(values.ageBirthdate, "37 / 14 October");
  assert.equal(values.height, "6ft 2in / 188cm");
  assert.match(values.description, /Identity:/);
  assert.match(values.description, /Occupation: Estate attorney/);
  assert.match(values.description, /Lifestyle:/);
  assert.match(values.physicalAppearance, /Eyes: Grey, heavy-lidded/);
  assert.match(values.personalityPsychology, /Cognitive Drivers:/);
  assert.match(values.personalityPsychology, /Big Five:/);
  assert.match(values.personalityPsychology, /Semantic psychology guidance/);
  assert.match(values.personalityPsychology, /Fear of abandonment/);
  assert.doesNotMatch(values.personalityPsychology, /fear_of_abandonment/);
  assert.match(values.relationshipsConnections, /Rapport Ledger:/);
  assert.match(values.relationshipsConnections, /{{user}}:/);
  assert.match(values.relationshipsConnections, /Semantic relationship guidance/);
  assert.match(values.relationshipsConnections, /Slow burn/);
  assert.match(values.speechStyle, /Tone & Vocabulary:/);
  assert.match(values.backgroundStory, /Internal Thoughts & Reactions:/);
  assert.match(values.intimacyProfile, /Adult Anatomy:/);
  assert.equal(values.tagsText, "Fear of abandonment, Slow burn");
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
  assert.match(card.data.personality, /Relationships \/ Connections:/);
  assert.equal(card.data.extensions.preserved, true);
  assert.deepEqual(
    (
      card.data.extensions[
        HEARTWRITE_CHARACTER_CREATION_EXTENSION_KEY
      ] as { identity: { characterName: string }; semanticSeedIds?: string[] }
    ).identity.characterName,
    "Magnus Vanderbilt",
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
  assert.doesNotMatch(
    JSON.stringify(
      card.data.extensions[HEARTWRITE_PERSONALITY_ENGINE_EXTENSION_KEY],
    ),
    /semanticSeedIds|fear_of_abandonment|slow_burn/,
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
        boundaries: "No public claims before consent is explicit",
        microAggressionsOrTells: "Uses surnames when he feels exposed",
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
