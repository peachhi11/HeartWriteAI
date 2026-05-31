import assert from "node:assert/strict";
import test from "node:test";

import encodeChunks from "png-chunks-encode";
import { encode as encodeTextChunk } from "png-chunk-text";

import { readCharacterCardFromPng } from "../../lib/character-card/readCharacterCardFromPng";
import { writeCharacterCardToPng } from "../../lib/character-card/writeCharacterCardToPng";
import { createCharacterCardFormValues } from "../../lib/character-card/createCharacterCardFormValues";
import { createCharacterCardFromFormValues } from "../../lib/character-card/createCharacterCardFromFormValues";
import { createCharacterCardV3Export } from "../../lib/character-card/createCharacterCardV3Export";
import {
  createBlankDraftCharacterCard,
  createDraftCharacterCardFromIntake,
} from "../../lib/character-card/createDraftCharacterCard";
import { exportCharacterCardPngData } from "../../lib/character-card/exportCharacterCardPngData";
import {
  scrubExportPayload,
  scrubCardForPublicExport,
} from "../../lib/character-card/exportPrivacyScrubber";
import { importBrowserCharacterCardFile } from "../../lib/character-card/importBrowserCharacterCardFile";
import { importCharacterCardPngData } from "../../lib/character-card/importCharacterCardPngData";
import { mergeCharacterCardIntakeValues } from "../../lib/character-card/mergeCharacterCardIntakeValues";
import { parseMessyCharacterIntake } from "../../lib/character-card/parseMessyCharacterIntake";
import { analyzeEmotionLexicon } from "../../lib/character-card/emotionLexicon";
import {
  BEHAVIOR_MACRO_DEFINITIONS,
  BEHAVIOR_MACRO_UI_CONFIG,
  COMPLETE_EMOTIONAL_MATRIX,
  HIGH_PRIORITY_CRISIS_CLASSES,
  LOW_PRIORITY_STATE_CLASSES,
  MID_PRIORITY_ACTION_CLASSES,
  classifyPlayerBehaviorMacro,
  evaluatePlayerTurnBehavior,
} from "../../lib/character-card/behaviorMacroClassifiers";
import {
  BDSM_INTENT_DEFINITIONS,
  BDSM_SEVERITY_WEIGHT,
  COMPLETE_BDSM_MATRIX,
  classifyBdsmIntent,
  handleBdsmPlayerInput,
  resolveBdsmIntent,
} from "../../lib/character-card/bdsmIntentClassifiers";
import {
  COMEDY_INTENT_DEFINITIONS,
  COMEDY_SEVERITY_WEIGHT,
  COMPLETE_COMEDY_MATRIX,
  classifyComedyIntent,
  resolveComedyIntent,
} from "../../lib/character-card/comedyIntentClassifiers";
import {
  COMPLETE_DARK_ROMANCE_MATRIX,
  DARK_ROMANCE_INTENT_DEFINITIONS,
  DARK_ROMANCE_SEVERITY_WEIGHT,
  applyDarkRomanceStateDelta,
  classifyDarkRomanceIntent,
  resolveDarkRomanceIntent,
} from "../../lib/character-card/darkRomanceIntentClassifiers";
import {
  COMPLETE_SPICY_MATRIX,
  SPICY_INTENT_DEFINITIONS,
  SPICY_SEVERITY_WEIGHT,
  classifySpicyIntent,
  resolveSpicyIntent,
} from "../../lib/character-card/spicyIntentClassifiers";
import { CharacterCardMacroClassificationSchema } from "../../types/character-card/CharacterCardMacroClassification";
import { CharacterCardV3Schema } from "../../types/character-card/CharacterCardV3Schema";
import { CharacterCardPayload } from "../../types/character-card/CharacterCardPayload";
import {
  calculateZodiac,
  characterCardSeeds,
  daysInMonth,
  generateAgeGapRomance,
  generateAlternateGreetingData,
  generateArchetypeConfigurationData,
  generateCharacterCardFromSeed,
  generateDefaultAlternateGreetingForks,
  generateDefaultScenarioOpeningPairs,
  generateEthnicityData,
  generateFetishData,
  generateFirstMessageData,
  generateFormattingConfigurationData,
  generateFrameworkConfigurationData,
  generateDefaultGroupGreetingSet,
  generateDefaultGroupAlternateGreetingForks,
  generateGroupAlternateGreetingData,
  generateGroupGreetingData,
  generateDialogueArrayData,
  generateIntimacyStyleData,
  generateKinkData,
  generateLoreEntriesData,
  generateLorebookSummaryData,
  generateCreatorsNotesData,
  generateNationalityData,
  generateOccupationData,
  generatePostHistoryInstructionsData,
  generateProseGuidanceData,
  generateRaceData,
  generateRelationshipsData,
  generateRelationshipStatusData,
  generateScenarioData,
  generateScenarioOpeningPairData,
  generateSpeechExamplesData,
  generateSpeechStyleData,
  generateSpeciesData,
  generateToneConfigurationData,
  generateTurnOffData,
  generateWorldLorePlaceholders,
  isLeapYear,
} from "../../lib/character-card/generator";
import { parseActiveLore } from "../../lib/character-card/lorebookParser";
import {
  compileMasterJsonPayload,
  createMasterCharacterCardPayload,
} from "../../lib/character-card/masterCardCompiler";
import { createGeneratedCharacterCardPayload } from "../../lib/character-card/exportGeneratedCardToDesktop";
import { generateScenarioOpeningPair } from "../../lib/character-card/pairCompiler";
import {
  appendPostHistoryOverride,
  createPostHistoryOverride,
} from "../../lib/character-card/postHistoryRuntime";
import {
  resolveDescriptionWorldPlaceholders,
  resolveWorldPlaceholders,
} from "../../lib/character-card/placeholderResolver";
import { compileSystemPrompt } from "../../lib/character-card/promptCompiler";
import {
  createFrameworkSerializablePayload,
  createSerializedCardString,
} from "../../lib/character-card/frameworkSerializer";

function encodeCard(card: CharacterCardPayload): string {
  return Buffer.from(JSON.stringify(card), "utf8").toString("base64");
}

function stringifyCard(card: CharacterCardPayload): string {
  return JSON.stringify(card);
}

function createPngWithTextChunks(chunks: Array<{ keyword: string; text: string }>) {
  return encodeChunks([
    {
      name: "IHDR",
      data: Uint8Array.from([0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0]),
    },
    ...chunks.map((chunk) => encodeTextChunk(chunk.keyword, chunk.text)),
    {
      name: "IDAT",
      data: Uint8Array.from([120, 156, 99, 248, 15, 4, 0, 9, 251, 3, 253]),
    },
    {
      name: "IEND",
      data: Uint8Array.from([]),
    },
  ]);
}

test("reads ccv3 metadata before chara metadata", () => {
  const ccv3Card = {
    spec: "chara_card_v3",
    spec_version: "3.0",
    data: { name: "CCV3 Card" },
  };
  const charaCard = {
    spec: "chara_card_v2",
    spec_version: "2.0",
    data: { name: "Legacy Card" },
  };
  const pngData = createPngWithTextChunks([
    { keyword: "chara", text: encodeCard(charaCard) },
    { keyword: "ccv3", text: encodeCard(ccv3Card) },
  ]);

  const result = readCharacterCardFromPng(pngData);

  assert.equal(result.source, "ccv3");
  assert.deepEqual(result.card, ccv3Card);
});

test("reads raw-json ccv3 metadata before legacy chara metadata", () => {
  const ccv3Card = {
    spec: "chara_card_v3",
    spec_version: "3.0",
    data: { name: "Raw CCV3 Card" },
  };
  const charaCard = {
    spec: "chara_card_v2",
    spec_version: "2.0",
    data: { name: "Legacy Card" },
  };
  const pngData = createPngWithTextChunks([
    { keyword: "chara", text: encodeCard(charaCard) },
    { keyword: "ccv3", text: stringifyCard(ccv3Card) },
  ]);

  const result = readCharacterCardFromPng(pngData);

  assert.equal(result.source, "ccv3");
  assert.deepEqual(result.card, ccv3Card);
});

test("falls back to chara metadata", () => {
  const charaCard = {
    spec: "chara_card_v2",
    spec_version: "2.0",
    data: { name: "Legacy Card" },
  };
  const pngData = createPngWithTextChunks([
    { keyword: "chara", text: encodeCard(charaCard) },
  ]);

  const result = readCharacterCardFromPng(pngData);

  assert.equal(result.source, "chara");
  assert.deepEqual(result.card, charaCard);
});

test("throws when no supported card metadata exists", () => {
  const pngData = createPngWithTextChunks([
    { keyword: "notes", text: "not a card" },
  ]);

  assert.throws(
    () => readCharacterCardFromPng(pngData),
    /supported character card metadata/,
  );
});

test("rejects oversized browser PNG text metadata chunks before decoding", () => {
  const pngData = createPngWithTextChunks([
    { keyword: "ccv3", text: "x".repeat(2 * 1024 * 1024 + 1) },
  ]);

  assert.throws(
    () => readCharacterCardFromPng(pngData),
    /text metadata chunk is too large/,
  );
});

test("rejects cumulative browser PNG metadata text over safe limits", () => {
  const pngData = createPngWithTextChunks([
    { keyword: "chara", text: "a".repeat(1_500_000) },
    { keyword: "chara", text: "b".repeat(1_500_000) },
    { keyword: "ccv3", text: "c".repeat(1_500_000) },
  ]);

  assert.throws(
    () => readCharacterCardFromPng(pngData),
    /Combined PNG metadata text is too large/,
  );
});

test("rejects compressed browser character metadata and defers to desktop import", () => {
  const keyword = Buffer.from("ccv3", "ascii");
  const chunkData = new Uint8Array(keyword.length + 3);
  chunkData.set(keyword, 0);
  chunkData[keyword.length] = 0;
  chunkData[keyword.length + 1] = 0;
  chunkData[keyword.length + 2] = 1;
  const pngData = encodeChunks([
    {
      name: "IHDR",
      data: Uint8Array.from([0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0]),
    },
    {
      name: "zTXt",
      data: chunkData,
    },
    {
      name: "IDAT",
      data: Uint8Array.from([120, 156, 99, 248, 15, 4, 0, 9, 251, 3, 253]),
    },
    {
      name: "IEND",
      data: Uint8Array.from([]),
    },
  ]);

  assert.throws(
    () => readCharacterCardFromPng(pngData),
    /needs the desktop app for safe import/,
  );
});

test("rejects oversized browser card files before reading them into memory", async () => {
  const oversizedPng = new File(
    [new Uint8Array(20 * 1024 * 1024 + 1)],
    "oversized.png",
    { type: "image/png" },
  );
  const oversizedJson = new File(
    [new Uint8Array(20 * 1024 * 1024 + 1)],
    "oversized.json",
    { type: "application/json" },
  );

  await assert.rejects(
    () => importBrowserCharacterCardFile(oversizedPng),
    /too large for browser import/,
  );
  await assert.rejects(
    () => importBrowserCharacterCardFile(oversizedJson),
    /too large for browser import/,
  );
});

test("writes a ccv3 metadata chunk that can be read back", () => {
  const pngData = createPngWithTextChunks([]);
  const card = {
    spec: "chara_card_v2",
    spec_version: "2.0",
    data: { name: "Round Trip Card" },
  };

  const updatedPngData = writeCharacterCardToPng(pngData, card, {
    modificationDate: 1_716_199_200,
  });
  const result = readCharacterCardFromPng(updatedPngData);

  assert.equal(result.source, "ccv3");
  assert.deepEqual(result.card, {
    ...card,
    spec: "chara_card_v3",
    spec_version: "3.0",
    data: {
      name: "Round Trip Card",
      description: "",
      tags: [],
      creator: "",
      character_version: "",
      mes_example: "",
      extensions: {},
      system_prompt: "",
      post_history_instructions: "",
      first_mes: "",
      alternate_greetings: [],
      personality: "",
      scenario: "",
      creator_notes: "",
      group_only_greetings: [],
      modification_date: 1_716_199_200,
    },
  });
});

test("scrubs repeated API keys from public export payloads", () => {
  const dirtyCard = {
    spec: "chara_card_v3",
    spec_version: "3.0",
    data: {
      name: "Key Leak",
      description:
        "Primary sk-1234567890abcdef1234567890abcdef123456 and backup sk-abcdef1234567890abcdef1234567890abcdef123456.",
    },
  };

  const report = scrubExportPayload(dirtyCard);
  const scrubbedJson = JSON.stringify(report.sanitizedPayload);

  assert.equal(report.redactedCount, 2);
  assert.ok(report.redactedCategories.includes("openai_api_key"));
  assert.doesNotMatch(scrubbedJson, /sk-[A-Za-z0-9_-]{32,}/);
  assert.match(scrubbedJson, /REDACTED_OPENAI_API_KEY/);
});

test("scrubs bearer tokens URL credentials and local config blocks", () => {
  const dirtyCard = {
    spec: "chara_card_v3",
    spec_version: "3.0",
    data: {
      name: "Config Leak",
      creator_notes:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9 connects to https://admin:pass123@example.test",
      chat_history: [{ role: "user", content: "private chat" }],
      local_api_keys: { openrouter: "sk-or-1234567890abcdef1234567890abcdef" },
    },
  };

  const report = scrubExportPayload(dirtyCard);
  const scrubbedJson = JSON.stringify(report.sanitizedPayload);

  assert.ok(report.redactedCategories.includes("bearer_token"));
  assert.ok(report.redactedCategories.includes("inline_url_credentials"));
  assert.ok(report.redactedCategories.includes("field:chat_history"));
  assert.ok(report.redactedCategories.includes("field:local_api_keys"));
  assert.doesNotMatch(scrubbedJson, /Bearer eyJ/);
  assert.doesNotMatch(scrubbedJson, /admin:pass123/);
  assert.deepEqual(report.sanitizedPayload.data.chat_history, []);
  assert.deepEqual(report.sanitizedPayload.data.local_api_keys, {});
});

test("export scrubber preserves normal romantic mystery prose", () => {
  const narrativeCard = {
    spec: "chara_card_v3",
    spec_version: "3.0",
    data: {
      name: "Eldrin",
      personality:
        "He keeps a dark secret close to his heart. The password to the ancient gate is a family riddle.",
    },
  };

  const report = scrubExportPayload(narrativeCard);

  assert.equal(report.redactedCount, 0);
  assert.equal(
    report.sanitizedPayload.data.personality,
    narrativeCard.data.personality,
  );
});

test("public PNG exports scrub sensitive metadata before writing ccv3 chunks", () => {
  const pngData = createPngWithTextChunks([]);
  const dirtyCard = {
    spec: "chara_card_v3",
    spec_version: "3.0",
    data: {
      name: "Public Export",
      description: "Leaked key sk-1234567890abcdef1234567890abcdef123456.",
      user_settings: { theme: "private" },
    },
  };

  const updatedPngData = writeCharacterCardToPng(pngData, dirtyCard);
  const result = readCharacterCardFromPng(updatedPngData);

  assert.equal(result.source, "ccv3");
  assert.match(result.card.data?.description as string, /REDACTED_OPENAI_API_KEY/);
  assert.doesNotMatch(JSON.stringify(result.card), /sk-1234567890abcdef/);
  assert.deepEqual(result.card.data?.user_settings, {});
});

test("public CHARX helper scrubber preserves card shape while removing local fields", () => {
  const card = {
    spec: "chara_card_v3",
    spec_version: "3.0",
    data: {
      name: "Charx Export",
      description: "Bearer abcdefghijklmnopqrstuvwxyz123456",
      proxy_configurations: { url: "https://user:pass@example.test" },
    },
  };

  const scrubbedCard = scrubCardForPublicExport(card);

  assert.equal(scrubbedCard.spec, "chara_card_v3");
  assert.match(scrubbedCard.data.description, /REDACTED_BEARER_TOKEN/);
  assert.deepEqual(scrubbedCard.data.proxy_configurations, {});
});

test("removes stale chara and ccv3 chunks during ccv3 export", () => {
  const staleCard = {
    spec: "chara_card_v2",
    spec_version: "2.0",
    data: { name: "Stale Card" },
  };
  const exportedCard = {
    spec: "chara_card_v3",
    spec_version: "3.0",
    data: { name: "Fresh Card", group_only_greetings: ["Group hello"] },
  };
  const pngData = createPngWithTextChunks([
    { keyword: "chara", text: encodeCard(staleCard) },
    { keyword: "ccv3", text: encodeCard(staleCard) },
  ]);

  const updatedPngData = writeCharacterCardToPng(pngData, exportedCard, {
    modificationDate: 1_716_199_201,
  });
  const result = readCharacterCardFromPng(updatedPngData);

  assert.equal(result.source, "ccv3");
  assert.equal(result.card.data?.name, "Fresh Card");
  assert.deepEqual(result.card.data?.group_only_greetings, ["Group hello"]);
});

test("converts character card v1 payloads to ccv3 during export", () => {
  const pngData = createPngWithTextChunks([]);
  const card = {
    name: "Legacy V1 Card",
    description: "A v1 description",
    personality: "Patient",
    scenario: "A quiet room",
    first_mes: "Hello.",
    mes_example: "{{char}}: Hello.",
  };

  const updatedPngData = writeCharacterCardToPng(pngData, card, {
    modificationDate: 1_716_199_202,
  });
  const result = readCharacterCardFromPng(updatedPngData);

  assert.equal(result.source, "ccv3");
  assert.equal(result.card.spec, "chara_card_v3");
  assert.equal(result.card.spec_version, "3.0");
  assert.equal(result.card.data?.name, "Legacy V1 Card");
  assert.equal(result.card.data?.description, "A v1 description");
  assert.deepEqual(result.card.data?.group_only_greetings, []);
  assert.equal(result.card.data?.modification_date, 1_716_199_202);
});

test("maps editable form values back to a ccv3 card", () => {
  const sourceCard = {
    spec: "chara_card_v3",
    spec_version: "3.0",
    data: {
      name: "Original",
      description: "Before",
      extensions: { stable: true },
      alternate_greetings: ["Old greeting"],
      group_only_greetings: [],
    },
  };
  const values = createCharacterCardFormValues(sourceCard);

  const updatedCard = createCharacterCardFromFormValues(sourceCard, {
    ...values,
    fullName: "Updated",
    aliasesNicknames: "Goes by Dated",
    ageBirthdate: "29 / unknown",
    raceEthnicity: "Human",
    species: "Human",
    birthplace: "Harbor City",
    height: "6'1\" / 185 cm",
    description: "A condensed hook.",
    physicalAppearance: "Tall and watchful.",
    personalityPsychology: "Patient and observant.",
    backgroundStory: "Raised near the docks.",
    speechStyle: "Low voice, careful words.",
    relationshipsConnections: "Knows Mira, owes Sol.",
    intimacyProfile: "Dominant, praise-heavy, firm boundaries.",
    tagsText: "slow burn, modern",
    alternateOpenings: [
      {
        scenario: "The first alternate setup.",
        firstMessage: "First alternate",
      },
      {
        scenario: "",
        firstMessage: "Second alternate",
      },
    ],
    groupOnlyGreetings: ["Group greeting"],
  });

  assert.equal(updatedCard.spec, "chara_card_v3");
  assert.equal(updatedCard.data.name, "Updated");
  assert.deepEqual(updatedCard.data.extensions.stable, true);
  assert.equal(updatedCard.data.extensions.amourai, undefined);
  assert.match(updatedCard.data.description, /Full Name: Updated/);
  assert.match(updatedCard.data.description, /Height: 6'1" \/ 185 cm/);
  assert.match(updatedCard.data.description, /Overview:\nA condensed hook./);
  assert.match(updatedCard.data.personality, /Physical Appearance/);
  assert.match(updatedCard.data.personality, /Speech Style/);
  assert.match(updatedCard.data.personality, /Relationships \/ Connections/);
  assert.match(updatedCard.data.personality, /Sexuality \/ Intimacy Profile/);
  assert.deepEqual(updatedCard.data.tags, ["slow burn", "modern"]);
  assert.deepEqual(updatedCard.data.alternate_greetings, [
    "[Opening Scenario]\nThe first alternate setup.\n\n[First Message]\nFirst alternate",
    "Second alternate",
  ]);
  assert.deepEqual(updatedCard.data.group_only_greetings, ["Group greeting"]);
});

test("routes bracketed legacy profile text into structured form fields", () => {
  const sourceCard = {
    spec: "chara_card_v2",
    spec_version: "2.0",
    data: {
      name: "Cole",
      description: `[Basic Information:

Name: Cole Brennan
Age: 22
Occupation/Role: Defensive Lineman
Appearance: 6'4", bright blue eyes, messy black hair.]

[Core Personality:

Archetype: Douchebag Himbo.
Core Goal/Motivation: Keep his status.]

[Background:

Grew up rich in Newport Beach.]

[Dialogue Style:

Thick Cali accent, heavy use of "bro" and "babe."]

[Relationships:

Lucas Harrington - quarterback and teammate.]

[Dynamic with {{user}}:

Low-key catching feelings but would never admit it.]

[Sexual Behavior:

Orientation: heterosexual.
Turn-ons/Kinks: power play, praise, control.]`,
      creator_notes: `**SUMMARY**

SCENARIO 1: They have been hooking up for a while and he asks her to leave.

SCENARIO 2: He corners her at a party after she ignores him.

**TRIGGER WARNINGS**

Toxic frat guy.`,
      alternate_greetings: ["Morning opening", "Party opening"],
      group_only_greetings: [],
    },
  };

  const values = createCharacterCardFormValues(sourceCard);

  assert.equal(values.fullName, "Cole Brennan");
  assert.equal(values.ageBirthdate, "22");
  assert.equal(values.description, "Occupation/Role: Defensive Lineman");
  assert.equal(values.physicalAppearance, "6'4\", bright blue eyes, messy black hair.");
  assert.match(values.personalityPsychology, /Archetype: Douchebag Himbo/);
  assert.equal(values.backgroundStory, "Grew up rich in Newport Beach.");
  assert.match(values.speechStyle, /Thick Cali accent/);
  assert.match(values.relationshipsConnections, /Lucas Harrington/);
  assert.match(values.relationshipsConnections, /Low-key catching feelings/);
  assert.match(values.intimacyProfile, /Turn-ons\/Kinks/);
  assert.deepEqual(values.alternateOpenings, [
    {
      scenario: "They have been hooking up for a while and he asks her to leave.",
      firstMessage: "Morning opening",
    },
    {
      scenario: "He corners her at a party after she ignores him.",
      firstMessage: "Party opening",
    },
  ]);
  assert.doesNotMatch(values.creator_notes, /SCENARIO 1/);
  assert.match(values.creator_notes, /TRIGGER WARNINGS/);
});

test("routes absolutetrash-style template labels into structured form fields", () => {
  const sourceCard = {
    spec: "chara_card_v2",
    spec_version: "2.0",
    data: {
      name: "Template Name",
      description: `({{char}} Info:
Name= Tommy Brennan (goes by Tom)
Aliases= T, Trouble
Sex/Gender= Male
Age= 31
Nationality= American
Ethnicity= Irish-American
Species= Human
Birthplace= Boston
Height= 6'2"
Occupation= Detective
Appearance= Tall, muscular, large hands
Hair= Short black hair
Eyes= Green eyes
Facial Features= Crooked nose
Outfit= Rumpled suit
Accent= Thick southern accent
Speech= Blunt, clipped sentences
Personality= Abrasive, observant, hard-working
Relationships= Works with Jane Doe
Backstory= Born in a poor household
Quirks= Hums when nervous
Mannerisms= Maintains steady eye contact
Likes= Craft whiskey
Dislikes= Small talk
Hobbies= Examining cold cases
Kinks= Power play
Penis Descriptors= Large, uncircumcised
Other= Keeps old case files in his closet)

[{{char}}'s Behavior During Sex: Always on top; very aggressive and rough.]`,
      creator_notes: "",
      alternate_greetings: [],
      group_only_greetings: [],
    },
  };

  const values = createCharacterCardFormValues(sourceCard);

  assert.equal(values.fullName, "Tommy Brennan (goes by Tom)");
  assert.equal(values.aliasesNicknames, "T, Trouble");
  assert.equal(values.ageBirthdate, "31");
  assert.equal(values.raceEthnicity, "American\n\nIrish-American");
  assert.equal(values.species, "Human");
  assert.equal(values.birthplace, "Boston");
  assert.equal(values.height, "6'2\"");
  assert.match(values.description, /occupation: Detective/i);
  assert.match(values.physicalAppearance, /appearance: Tall, muscular/);
  assert.match(values.physicalAppearance, /outfit: Rumpled suit/);
  assert.match(values.personalityPsychology, /personality: Abrasive/);
  assert.match(values.personalityPsychology, /hobbies: Examining cold cases/);
  assert.match(values.backgroundStory, /Born in a poor household/);
  assert.match(values.speechStyle, /accent: Thick southern accent/);
  assert.match(values.relationshipsConnections, /Works with Jane Doe/);
  assert.match(values.intimacyProfile, /kinks: Power play/);
  assert.match(values.intimacyProfile, /penis descriptors: Large/);
  assert.match(values.intimacyProfile, /Always on top/);
});

test("repairs imported cards that cram profile sections into description", () => {
  const sourceCard = createCharacterCardV3Export({
    spec: "chara_card_v3",
    spec_version: "3.0",
    data: {
      name: "Chris Henries",
      description: `### Chris's Profile
Surname: Henries
Age: 24
Role: Brother's Best Friend

Appearance:
- Tall, athletic, dyed blonde hair.

Relationships:
Lucas: {{user}}'s older brother.

Core Personality:
Cocky, charismatic, and protective.

Dialogue Style:
Teasing and casual.`,
      personality: "",
      scenario: "",
      first_mes: "Hey.",
      mes_example: "",
      creator_notes: "",
      tags: [],
      creator: "",
      character_version: "",
      extensions: {},
      alternate_greetings: [],
      group_only_greetings: [],
      system_prompt: "",
      post_history_instructions: "",
    },
  });

  assert.match(sourceCard.data.description, /Chris's Profile/);
  assert.match(sourceCard.data.description, /Age: 24/);
  assert.doesNotMatch(sourceCard.data.description, /Appearance:/);
  assert.match(sourceCard.data.personality, /Appearance:/);
  assert.match(sourceCard.data.personality, /Relationships:/);
  assert.match(sourceCard.data.personality, /Core Personality:/);
  assert.match(sourceCard.data.personality, /Dialogue Style:/);
});

test("routes messy intake into structured character form fields", () => {
  const result = parseMessyCharacterIntake(`Full Name: Mira Vale
Age & Birthdate: 29 / October 13
Tags: investigator, slow burn, haunted
Description: A private investigator who wants the truth but keeps sabotaging every person who tries to help her.
Physical Appearance: Tall, sleepless posture, black coat, old scar over one eyebrow.
Motivations: Mira wants closure, but she is terrified the case will prove her family deserved what happened.
Backstory: Raised by a corrupt police captain and learned early that love came with leverage.
Speech Style: Dry, clipped, and too calm when she is angry.
Relationships: Owes Jonah a debt; resents her sister Elise for leaving.
Sexuality / Intimacy Profile: Guarded, praise-starved, strict consent boundaries.
Scenario: {{user}} finds her breaking into a sealed evidence room.
First Message: "You can either help me open this, or pretend you never saw me."
Alternate Scenario: Mira catches {{user}} hiding a file.
Alternate First Message: "That better not be what I think it is."
Group Greeting: Mira shuts the office blinds before anyone can ask why.`);

  assert.equal(result.values.fullName, "Mira Vale");
  assert.equal(result.values.ageBirthdate, "29 / October 13");
  assert.equal(result.values.tagsText, "investigator, slow burn, haunted");
  assert.match(result.values.description ?? "", /wants the truth/);
  assert.match(result.values.physicalAppearance ?? "", /old scar/);
  assert.match(result.values.personalityPsychology ?? "", /terrified/);
  assert.match(result.values.backgroundStory ?? "", /corrupt police captain/);
  assert.match(result.values.speechStyle ?? "", /Dry, clipped/);
  assert.match(result.values.relationshipsConnections ?? "", /Jonah/);
  assert.match(result.values.intimacyProfile ?? "", /strict consent/);
  assert.equal(
    result.values.scenario,
    "{{user}} finds her breaking into a sealed evidence room.",
  );
  assert.equal(
    result.values.first_mes,
    `"You can either help me open this, or pretend you never saw me."`,
  );
  assert.deepEqual(result.values.alternateOpenings, [
    {
      scenario: "Mira catches {{user}} hiding a file.",
      firstMessage: `"That better not be what I think it is."`,
    },
  ]);
  assert.deepEqual(result.values.groupOnlyGreetings, [
    "Mira shuts the office blinds before anyone can ask why.",
  ]);
});

test("routes inline messy intake labels without swallowing the whole note as a name", () => {
  const result = parseMessyCharacterIntake(
    "Name: Mara Vale. Rival academic. Tired eyes, elegant posture, dry restraint. She is terrified of being ordinary. Scenario: {{user}} catches her hiding scholarship sabotage evidence.",
  );

  assert.equal(result.values.fullName, "Mara Vale");
  assert.match(result.values.description ?? "", /Rival academic/);
  assert.equal(
    result.values.scenario,
    "{{user}} catches her hiding scholarship sabotage evidence.",
  );
});

test("creates an editable ccv3 draft from messy intake without an imported card", () => {
  const result = createDraftCharacterCardFromIntake({
    intakeText: `Full Name: Mara Vale
Description: A scholarship finalist hiding how badly she needs to win.
Physical Appearance: Tall, severe posture, tired eyes, careful black blazer.
Motivations: She wants security but fears being pitied.
Scenario: {{user}} finds her alone in the locked auditorium after the campus event collapses.
First Message: "You weren't supposed to see this."`,
    sourceName: "blank-avatar.png",
  });

  assert.equal(result.card.spec, "chara_card_v3");
  assert.equal(result.card.data.name, "Mara Vale");
  assert.match(result.card.data.description, /scholarship finalist/);
  assert.match(result.card.data.personality, /Physical Appearance:/);
  assert.match(result.card.data.personality, /tired eyes/);
  assert.match(result.card.data.personality, /fears being pitied/);
  assert.match(result.card.data.scenario, /locked auditorium/);
  assert.match(result.card.data.first_mes, /supposed to see this/);
  assert.ok(result.routedFieldNames.length >= 5);
});

test("routes bulleted messy intake into a blank PNG draft shell", () => {
  const blankDraft = createBlankDraftCharacterCard(
    "/Users/mmdev/characterhub/personas/magnus vanderbilt yikes Daddy.standard avatar preview.png",
  );
  const result = createDraftCharacterCardFromIntake({
    currentCard: blankDraft,
    intakeText: `Setting: Chicago

- Lincoln Park: Where Magnus lives with his wife in a large modern house, quiet street, enough space for the family they're building.
- The Loop: Home to MV Construction, a high-rise in the heart of Chicago's business district.

APPEARANCE DETAILS

• Full Name: Magnus Vanderbilt
• Sex/Gender: Male
• Height: 6'4
• Age: 32
• Hair: dark blond, neatly styled
• Eyes: blue-gray

PERSONALITY & BEHAVIOR

Disciplined, protective, controlled, quietly possessive, and deeply private.

BACKGROUND

Magnus built MV Construction after leaving his family's money behind.

Scenario: {{user}} walks into his office after everyone else has gone home.`,
  });

  assert.equal(result.card.data.name, "Magnus Vanderbilt");
  assert.doesNotMatch(result.card.data.name, /avatar preview/i);
  assert.match(result.card.data.description, /Age & Birthdate: 32/);
  assert.match(result.card.data.description, /Height: 6'4/);
  assert.match(result.card.data.personality, /Hair: dark blond/);
  assert.match(result.card.data.personality, /Disciplined, protective/);
  assert.match(result.card.data.personality, /MV Construction/);
  assert.match(result.card.data.scenario, /Chicago/);
  assert.match(result.card.data.scenario, /walks into his office/);
});

test("routes basic information and appearance classifier labels", () => {
  const result = parseMessyCharacterIntake(`SECTION CLASSIFIER: BASIC INFORMATION
Full Name: Seraphina Vale
Nickname: Sera
Apparent Age vs. Actual Age: Looks 25 / actually 512
Date of Birth: 13 / 10 / 1513
Place of Birth: Old Prague
Residence: A locked townhouse above the river
Biological Sex & Gender: Female
Pronouns: she/her
Sexual Orientation: Demisexual
Relationship Status: Widowed, refusing to admit she is lonely
Species: Vampire
Ethnicity: Czech
Occupation: Antiquarian and information broker

SECTION CLASSIFIER: APPEARANCE:
Physical description: Silver hair in a severe braid, heavy lashes, black brows, amber eyes, sharp cheekbones, a small scar through her lower lip, and porcelain skin with one beauty mark under her left eye.
BUILD: Tall and cold-skinned with rigid posture, narrow waist, long fingers, visible veins at the wrist, and a stillness that makes rooms feel watched.
STYLE: Dark academia wardrobe, black wool coats, antique rings, reading glasses, neat grooming, and polished boots.`);

  assert.equal(result.values.fullName, "Seraphina Vale");
  assert.equal(result.values.aliasesNicknames, "Sera");
  assert.match(result.values.ageBirthdate ?? "", /Looks 25 \/ actually 512/);
  assert.match(result.values.ageBirthdate ?? "", /13 \/ 10 \/ 1513/);
  assert.equal(result.values.birthplace, "Old Prague");
  assert.equal(result.values.raceEthnicity, "Czech");
  assert.equal(result.values.species, "Vampire");
  assert.match(result.values.description ?? "", /residence/i);
  assert.match(result.values.description ?? "", /A locked townhouse/);
  assert.match(result.values.description ?? "", /pronouns/i);
  assert.match(result.values.description ?? "", /Demisexual/);
  assert.match(result.values.description ?? "", /information broker/);
  assert.doesNotMatch(result.values.intimacyProfile ?? "", /Demisexual/);
  assert.match(result.values.physicalAppearance ?? "", /Silver hair/);
  assert.match(result.values.physicalAppearance ?? "", /narrow waist/);
  assert.match(result.values.physicalAppearance ?? "", /Dark academia wardrobe/);
  assert.match(result.values.physicalAppearance ?? "", /reading glasses/);
});

test("routes macro-style appearance and residence classifiers", () => {
  const result = parseMessyCharacterIntake(`{{wardrobe}}: Bespoke Luxury: Hand-stitched suits, custom-tailored silk shirts, flawless fit, premium natural fabrics.
{{Accessories}}: Heirloom Jewelry: Family crest rings, antique pearls, platinum bands.
{{Grooming}}: Labor-Strained: Calloused palms, cracked cuticles, oil-stained fingers, chapped lips.
{{posture}}: Defensive/Guarded: Crossed arms, slightly hunched shoulders, avoiding eye contact, keeping close to exits.
{{complexion}}: Weather-Beaten: Permanent freckles, crow's feet from squinting in the sun, dry patches.
{{Residence}}: Luxury Rental: A high-end loft in the most expensive part of the city, paid by parental allowance.`);

  assert.match(result.values.physicalAppearance ?? "", /Hand-stitched suits/);
  assert.match(result.values.physicalAppearance ?? "", /Family crest rings/);
  assert.match(result.values.physicalAppearance ?? "", /Calloused palms/);
  assert.match(result.values.physicalAppearance ?? "", /Crossed arms/);
  assert.match(result.values.physicalAppearance ?? "", /Weather-Beaten/);
  assert.match(result.values.description ?? "", /high-end loft/);
  assert.doesNotMatch(result.values.description ?? "", /Hand-stitched suits/);
});

test("routes height build body texture and alteration classifiers", () => {
  const result = parseMessyCharacterIntake(`{{Height}}: Very Tall: Exceptionally tall, towering, imposing, mountain-framed, forcing others to look up.
{{build}}: Functional/Labor-Built: Dense hard muscle from physical work, sinewy, thick-wristed, rugged, knotty muscle.
Movement: The Exhausted Heavy-Foot: Leaden, dragging, heavy-footed, weary, slumped.
Hands: The Calloused Grip: Sandpaper-rough, scarred, oil-stained, split-knuckled, leathery.
Body Texture: The Nervous-Habit Body: Bitten-down nails, picked-at cuticles, raw knuckles, restless-legged.
Body Modifications & Modern Alterations: The Curated Canvas: Ink-sleeved, heavily pierced, patchwork-tattooed.`);

  assert.match(result.values.physicalAppearance ?? "", /Very Tall/);
  assert.match(result.values.physicalAppearance ?? "", /Functional\/Labor-Built/);
  assert.match(result.values.physicalAppearance ?? "", /Exhausted Heavy-Foot/);
  assert.match(result.values.physicalAppearance ?? "", /Calloused Grip/);
  assert.match(result.values.physicalAppearance ?? "", /Nervous-Habit Body/);
  assert.match(result.values.physicalAppearance ?? "", /Curated Canvas/);
});

test("routes body modification skin mark and scar macros", () => {
  const result = parseMessyCharacterIntake(`{{body mod}}: Subtle Adjustment: porcelain-toothed veneers and laser-smooth skin.
{{tattoos}}: Patchwork tattoos across both thighs and one inked sleeve.
{{piercings}}: Gold septum ring, tongue piercing, and three cartilage hoops.
{{birthmarks}}: Heart-shaped birthmark behind the left knee.
{{blemishes}}: Freckles over the nose, two moles on the collarbone, and stress pimples near the jaw.
{{scars}}: Split eyebrow scar from a street fight and pale burn scars across the wrist.`);

  assert.match(result.values.physicalAppearance ?? "", /porcelain-toothed/);
  assert.match(result.values.physicalAppearance ?? "", /Patchwork tattoos/);
  assert.match(result.values.physicalAppearance ?? "", /septum ring/);
  assert.match(result.values.physicalAppearance ?? "", /birthmark/);
  assert.match(result.values.physicalAppearance ?? "", /Freckles/);
  assert.match(result.values.physicalAppearance ?? "", /street fight/);
});

test("routes gender pronoun and genital macros", () => {
  const result = parseMessyCharacterIntake(`{{gender}}: Trans man
{{pronouns}}: he/him
{{genitals}}: T-dick, post-top-surgery chest, sensitive inner thighs.`);

  assert.match(result.values.description ?? "", /Trans man/);
  assert.match(result.values.description ?? "", /he\/him/);
  assert.match(result.values.intimacyProfile ?? "", /T-dick/);
  assert.doesNotMatch(result.values.physicalAppearance ?? "", /T-dick/);
});

test("routes facial feature macros into appearance", () => {
  const result = parseMessyCharacterIntake(`{{facial shape}}: Diamond: narrow forehead, pointed chin, high-cheekboned and gemstone-cut.
{{eyes}}: Hooded, heavy-lidded, mysterious and sultry.
{{eye_shape}}: Almond, cat-like and upswept.
{{eye_distance}}: Deep-set, shadowed, piercing, brooding.
{{nose}}: Aquiline / Roman, patrician, hawk-like, aristocratic.
{{mouth}}: Natural smirk, perpetually amused.
{{lips}}: Full / Plush, pillowy and bee-stung.
{{smile}}: Stern / Downturned, unapproachable when resting.
{{Eyebrow}}: Straight / Flat, blunt, heavy-browed, intense.`);

  assert.match(result.values.physicalAppearance ?? "", /Diamond/);
  assert.match(result.values.physicalAppearance ?? "", /Hooded/);
  assert.match(result.values.physicalAppearance ?? "", /Almond/);
  assert.match(result.values.physicalAppearance ?? "", /Deep-set/);
  assert.match(result.values.physicalAppearance ?? "", /Aquiline/);
  assert.match(result.values.physicalAppearance ?? "", /Natural smirk/);
  assert.match(result.values.physicalAppearance ?? "", /Full \/ Plush/);
  assert.match(result.values.physicalAppearance ?? "", /Downturned/);
  assert.match(result.values.physicalAppearance ?? "", /Straight \/ Flat/);
});

test("routes undertone and skin tone classifiers into appearance", () => {
  const result = parseMessyCharacterIntake(`{{undertone}}: Warm / Golden: distinct yellow, peach, or golden undertones; sunkissed, honey-hued, amber, olive, gilded, toasted.
Skin Tone: Deep: rich and dark in color, often with warm undertones, rarely burns, natural resistance to the sun.
Base Hue: Neutral olive, balanced between yellow and green with a muted, realistic cast.`);

  assert.match(result.values.physicalAppearance ?? "", /Warm \/ Golden/);
  assert.match(result.values.physicalAppearance ?? "", /Deep/);
  assert.match(result.values.physicalAppearance ?? "", /Neutral olive/);
  assert.doesNotMatch(result.values.description ?? "", /Warm \/ Golden/);
});

test("routes skin surface classifiers into appearance", () => {
  const result = parseMessyCharacterIntake(`{{skin_type}}: Dewy / Luminous: hydrated skin with a natural sheen, glass-like, glossy, fresh-faced.
{{skin_texture}}: Textured / Pitted: visible pores, acne scarring, orange-peel, cratered, rough-hewn.
{{blemishes}}: Freckled / Sun-Dappled: freckle-dusted across the nose and shoulders.
{{scars}}: Small facial scar from an old piercing, silver-lined and split-browed.
{{blush}}: Flushes red from the neck to the ears at the slightest provocation, easily-flushed and high-color.`);

  assert.match(result.values.physicalAppearance ?? "", /Dewy \/ Luminous/);
  assert.match(result.values.physicalAppearance ?? "", /Textured \/ Pitted/);
  assert.match(result.values.physicalAppearance ?? "", /Freckled/);
  assert.match(result.values.physicalAppearance ?? "", /silver-lined/);
  assert.match(result.values.physicalAppearance ?? "", /easily-flushed/);
  assert.doesNotMatch(result.values.description ?? "", /Dewy \/ Luminous/);
});

test("routes hair classifiers into appearance", () => {
  const result = parseMessyCharacterIntake(`{{hair}}: Black hair falling in glossy curtains around the jaw.
{{hair_type}}: Coily / Kinky: dense zig-zag 4b coils, pillowy cloud crown, twist-out volume.
{{hair_texture}}: Chemically Processed / Altered: peroxide-fried ends, dye-soaked, bleached, straw-textured.
{{hair_style}}: The Corporate Slick: razor-sharp part line held with high-end pomade.`);

  assert.match(result.values.physicalAppearance ?? "", /glossy curtains/);
  assert.match(result.values.physicalAppearance ?? "", /Coily \/ Kinky/);
  assert.match(result.values.physicalAppearance ?? "", /Chemically Processed/);
  assert.match(result.values.physicalAppearance ?? "", /Corporate Slick/);
  assert.doesNotMatch(result.values.description ?? "", /Corporate Slick/);
});

test("routes expanded basic identity and university macros", () => {
  const result = parseMessyCharacterIntake(`{{sexual orientation}}: Bisexual
{{romantic orientation}}: Demiromantic
{{relationship status}}: Recently divorced and pretending not to care
{{species}}: Elf
{{ethnicity}}: Korean
{{nationality}}: Australian
{{occupation}}: Night-shift paramedic
{{education major}}: Biomedical engineering major at Northvale University`);

  assert.equal(result.values.species, "Elf");
  assert.equal(result.values.raceEthnicity, "Korean");
  assert.match(result.values.description ?? "", /Bisexual/);
  assert.match(result.values.description ?? "", /Demiromantic/);
  assert.match(result.values.description ?? "", /Recently divorced/);
  assert.match(result.values.description ?? "", /Night-shift paramedic/);
  assert.match(result.values.description ?? "", /Biomedical engineering/);
  assert.doesNotMatch(result.values.intimacyProfile ?? "", /Bisexual/);
});

test("routes sexual orientation subcategory macros into description", () => {
  const result = parseMessyCharacterIntake(`{{sexual orientation}}: Attraction shapes how they read {{user}} and navigate relationship dynamics.
{{monosexual}}: Gay: exclusively attracted to masculine-aligned individuals.
{{Multisexual}}: Omnisexual: attracted to all genders while recognizing gender as part of attraction.
{{ace}}: Demisexual: sexual attraction only after a strong emotional or romantic bond.
{{Disclosure_Status}}: Closeted / Concealed: recognizes their attraction but has not disclosed it to others.`);

  assert.match(result.values.description ?? "", /navigate relationship dynamics/);
  assert.match(result.values.description ?? "", /Gay/);
  assert.match(result.values.description ?? "", /Omnisexual/);
  assert.match(result.values.description ?? "", /Demisexual/);
  assert.match(result.values.description ?? "", /Closeted/);
  assert.doesNotMatch(result.values.intimacyProfile ?? "", /Demisexual/);
});

test("routes romantic orientation and polyamory macros into description", () => {
  const result = parseMessyCharacterIntake(`{{romantic_orientation}}: The direction and nature of their romantic attraction.
{{Homoromantic}}: Attracted exclusively to the same gender.
{{Bi/Polyromantic}}: Attracted to two or more genders.
{{Romantic_Spectrum}}: 16-40 Aloof / Sluggish, requiring deep emotional grounding.
{{Demiromantic}}: Only experiences romantic attraction after a deep emotional bond.
{{Polyamory}}: Solo-Polyamorous: seeks deep connections while practicing total autonomy.
Relationship Matrix Score: Group/Family Integration: Kitchen Table Polyamory and high compersion.`);

  assert.match(result.values.description ?? "", /romantic attraction/);
  assert.match(result.values.description ?? "", /same gender/);
  assert.match(result.values.description ?? "", /two or more genders/);
  assert.match(result.values.description ?? "", /Aloof \/ Sluggish/);
  assert.match(result.values.description ?? "", /Demiromantic/);
  assert.match(result.values.description ?? "", /Solo-Polyamorous/);
  assert.match(result.values.description ?? "", /Kitchen Table Polyamory/);
  assert.doesNotMatch(result.values.intimacyProfile ?? "", /Kitchen Table Polyamory/);
});

test("routes romance trope macros into scenario", () => {
  const result = parseMessyCharacterIntake(`{{relational_dynamics_tags}}: Grumpy x Sunshine, Opposites Attract, and Slow Burn tension define how they interact.
{{Enemies to Lovers}}: They start with mutual rivalry and gradually develop a passionate bond.
{{Narrative_Hook}}: Forced Proximity keeps them stuck together after a storm closes the roads.
{{Fake Dating}}: They pretend to be a couple for mutual benefit and catch genuine feelings.
{{Archetype_trope}}: Billionaire x everyday commoner clash.
{{The Bodyguard}}: A professional security agent falls for the VIP client they protect.
{{setting_hook}}: Small Town Romance where gossip runs rampant.
{{micro_trope}}: Only One Bed in the last room at the roadside motel.
{{hurt/comfort}}: Who Hurt You? protective rage after {{user}} is harmed.
{{possessive}}: Touch Her and You Die warning to an antagonist.`);

  assert.match(result.values.scenario ?? "", /Grumpy x Sunshine/);
  assert.match(result.values.scenario ?? "", /mutual rivalry/);
  assert.match(result.values.scenario ?? "", /Forced Proximity/);
  assert.match(result.values.scenario ?? "", /pretend to be a couple/);
  assert.match(result.values.scenario ?? "", /Billionaire/);
  assert.match(result.values.scenario ?? "", /security agent/);
  assert.match(result.values.scenario ?? "", /Small Town Romance/);
  assert.match(result.values.scenario ?? "", /Only One Bed/);
  assert.match(result.values.scenario ?? "", /Who Hurt You/);
  assert.match(result.values.scenario ?? "", /Touch Her and You Die/);
  assert.doesNotMatch(result.values.description ?? "", /Only One Bed/);
});

test("routes romance tones structure archetypes openers and boundaries", () => {
  const result = parseMessyCharacterIntake(`{{Sweet & Wholesome}}: Focuses on emotional intimacy, humor, and heart with zero explicit content.
{{Angsty}}: High emotional stakes, deep yearning, heavy pining, and intense suffering.
User is the Captive: The bot has captured or imprisoned the user, creating high-tension negotiation.
{{multi-char}}: Multiple characters share the main-character role and must not be treated as NPCs.
{{ALT}}: Alternate timeline spin-off of a canon card.
The {{Yandere}}: Obsessive, fiercely protective, and dangerously possessive.
The {{Morally Grey}}: Ruthless to the world, soft only for the user.
{{Scenario Openers}}: Greeting starters that begin mid-action.
{{Caught Red-Handed}}: The bot catches the user sneaking into their office.
The {{Rainy Night Knock}}: The bot shows up soaked and bleeding at the user's doorstep.
{{Slow Burn}} RP: Resist falling in love too quickly and maintain tension for dozens of messages.
{{Dead Dove}} / {{Dark RP}}: Contains toxic, psychological, or distressing themes requiring strict user discretion.`);

  assert.match(result.values.scenario ?? "", /Sweet & Wholesome/);
  assert.match(result.values.scenario ?? "", /high-tension negotiation/);
  assert.match(result.values.description ?? "", /Multiple characters/);
  assert.match(result.values.description ?? "", /Alternate timeline/);
  assert.match(result.values.personalityPsychology ?? "", /Obsessive/);
  assert.match(result.values.personalityPsychology ?? "", /Ruthless to the world/);
  assert.match(result.values.first_mes ?? "", /Greeting starters/);
  assert.match(result.values.first_mes ?? "", /sneaking into their office/);
  assert.match(result.values.first_mes ?? "", /soaked and bleeding/);
  assert.match(result.values.system_prompt ?? "", /Resist falling in love/);
  assert.match(result.values.system_prompt ?? "", /strict user discretion/);
});

test("routes macro classifications and card library tags", () => {
  const result = parseMessyCharacterIntake(`Framework: Narrative RPG
Formatting: Natural Language
Relationship: Asymmetric (Bot Dominant)
Dynamics: enemies to lovers, slow burn
Archetypes: morally grey, protector
micro_tropes: only one bed, hurt/comfort`);

  assert.match(result.values.system_prompt ?? "", /Narrative RPG/);
  assert.match(result.values.system_prompt ?? "", /Natural Language/);
  assert.match(result.values.system_prompt ?? "", /Asymmetric \(Bot Dominant\)/);
  assert.match(result.values.tagsText ?? "", /enemies to lovers/);
  assert.match(result.values.tagsText ?? "", /morally grey/);
  assert.match(result.values.tagsText ?? "", /hurt\/comfort/);
});

test("validates generated macro classification payloads", () => {
  const classification = CharacterCardMacroClassificationSchema.parse({
    macro: {
      framework: "Narrative RPG",
      formatting: "Natural Language",
      relationship: "Antagonistic",
      tones: ["angsty", "slow burn"],
    },
    tags: {
      dynamics: ["enemies to lovers"],
      archetypes: ["morally grey"],
      micro_tropes: ["hurt/comfort"],
    },
    behavior: {
      class: "melodramatic",
      confidence: 0.8,
      valence: "negative",
      energy: "high",
      reason: "Despair, jealousy, heartbreak, or betrayal.",
      matchedKeywords: ["how could you"],
    },
    comedy: {
      active: true,
      class: "deadpan",
      confidence: 0.7,
      label: "Deadpan",
      landing: {
        affectionDelta: 1,
        angstDelta: 0,
        landed: true,
        npcReaction: "AMUSED_SPARK",
        trustDelta: 0,
      },
      matchedKeywords: ["cool story"],
      reason: "Unblinking understatement.",
      weightedScore: 1,
    },
    spicy: {
      active: true,
      class: "guarded",
      confidence: 0.7,
      label: "Guarded",
      reason: "Pulling back at the edge of intimacy.",
      matchedKeywords: ["we shouldn't"],
      weightedScore: 1.25,
    },
  });

  assert.equal(classification.macro.framework, "Narrative RPG");
  assert.equal(classification.behavior?.class, "melodramatic");
  assert.equal(classification.comedy?.class, "deadpan");
  assert.equal(classification.spicy?.class, "guarded");
  assert.deepEqual(classification.tags.micro_tropes, ["hurt/comfort"]);
});

test("classifies player behaviour macro turns independently of casual baseline", () => {
  assert.equal(BEHAVIOR_MACRO_DEFINITIONS.length, 24);
  assert.deepEqual(
    BEHAVIOR_MACRO_DEFINITIONS.map((definition) => definition.class),
    [
      "hostile",
      "melodramatic",
      "vindictive",
      "hysterical",
      "resigned",
      "coquettish",
      "bold",
      "defiant",
      "possessive",
      "manipulative",
      "affectionate",
      "teasing",
      "earnest",
      "starstruck",
      "anxious",
      "sombre",
      "suspicious",
      "shocked",
      "apathetic",
      "defensive",
      "formal",
      "distant",
      "submissive",
      "casual",
    ],
  );
  assert.deepEqual(HIGH_PRIORITY_CRISIS_CLASSES, [
    "hostile",
    "melodramatic",
    "vindictive",
    "hysterical",
    "resigned",
  ]);
  assert.deepEqual(MID_PRIORITY_ACTION_CLASSES, [
    "coquettish",
    "bold",
    "defiant",
    "possessive",
    "manipulative",
  ]);
  assert.deepEqual(LOW_PRIORITY_STATE_CLASSES, [
    "affectionate",
    "teasing",
    "earnest",
    "starstruck",
    "anxious",
    "sombre",
    "suspicious",
    "shocked",
    "apathetic",
    "defensive",
    "formal",
    "distant",
    "submissive",
  ]);

  const affectionate = classifyPlayerBehaviorMacro("I'm just glad you're safe.");
  const teasing = classifyPlayerBehaviorMacro("Oh, so you admit you missed me?");
  const distant = classifyPlayerBehaviorMacro("I'm fine. Don't worry about me.");
  const melodramatic = classifyPlayerBehaviorMacro(
    "How could you do this after everything?",
  );
  const bold = classifyPlayerBehaviorMacro(
    "[Steps closer, backing you against the wall] Look at me.",
  );
  const anxious = classifyPlayerBehaviorMacro(
    "I... I didn't mean it like that! [Quickly looks away, ears burning]",
  );
  const casual = classifyPlayerBehaviorMacro("Let's see what's over there.");
  const hostile = classifyPlayerBehaviorMacro("Get the hell away from me.");
  const earnest = classifyPlayerBehaviorMacro("I swear, I mean it. This is real.");
  const coquettish = classifyPlayerBehaviorMacro("I whisper closer and hold your gaze.");
  const possessive = classifyPlayerBehaviorMacro("Mine. Look only at me.");
  const submissive = classifyPlayerBehaviorMacro("I obey and yield.");
  const manipulative = classifyPlayerBehaviorMacro("If you actually cared, you'd stay.");
  const vindictive = classifyPlayerBehaviorMacro("Now you know exactly how it feels.");
  const defiant = classifyPlayerBehaviorMacro("No way. Make me.");
  const sombre = classifyPlayerBehaviorMacro("I'm sorry. That mistake still haunts me.");
  const starstruck = classifyPlayerBehaviorMacro("You're breathtaking. Absolutely stunning.");
  const resigned = classifyPlayerBehaviorMacro("Fine then. It doesn't matter. Forget me.");
  const shocked = classifyPlayerBehaviorMacro("I don't know what to say. I'm speechless.");
  const hysterical = classifyPlayerBehaviorMacro("Everything is spinning out of control.");
  const apathetic = classifyPlayerBehaviorMacro("Do whatever you want. I don't care.");
  const suspicious = classifyPlayerBehaviorMacro("What are you actually after?");
  const formal = classifyPlayerBehaviorMacro("Thank you for your assistance.");
  const defensive = classifyPlayerBehaviorMacro("That's completely irrelevant. Drop it.");

  assert.equal(affectionate.class, "affectionate");
  assert.equal(teasing.class, "teasing");
  assert.equal(distant.class, "distant");
  assert.equal(melodramatic.class, "melodramatic");
  assert.equal(bold.class, "bold");
  assert.equal(anxious.class, "anxious");
  assert.equal(casual.class, "casual");
  assert.equal(hostile.class, "hostile");
  assert.equal(earnest.class, "earnest");
  assert.equal(coquettish.class, "coquettish");
  assert.equal(possessive.class, "possessive");
  assert.equal(submissive.class, "submissive");
  assert.equal(manipulative.class, "manipulative");
  assert.equal(vindictive.class, "vindictive");
  assert.equal(defiant.class, "defiant");
  assert.equal(sombre.class, "sombre");
  assert.equal(starstruck.class, "starstruck");
  assert.equal(resigned.class, "resigned");
  assert.equal(shocked.class, "shocked");
  assert.equal(hysterical.class, "hysterical");
  assert.equal(apathetic.class, "apathetic");
  assert.equal(suspicious.class, "suspicious");
  assert.equal(formal.class, "formal");
  assert.equal(defensive.class, "defensive");
  assert.equal(melodramatic.valence, "negative");
  assert.equal(anxious.energy, "high");
});

test("provides Tailwind UI styling anchors for every behaviour macro", () => {
  const behaviorClasses = BEHAVIOR_MACRO_DEFINITIONS.map(
    (definition) => definition.class,
  );

  assert.deepEqual(Object.keys(BEHAVIOR_MACRO_UI_CONFIG).sort(), [
    ...behaviorClasses,
  ].sort());
  assert.equal(BEHAVIOR_MACRO_UI_CONFIG.affectionate.label, "Warm & Close");
  assert.equal(BEHAVIOR_MACRO_UI_CONFIG.earnest.label, "Pure Sincerity");
  assert.equal(BEHAVIOR_MACRO_UI_CONFIG.possessive.label, "Territorial Envy");
  assert.equal(BEHAVIOR_MACRO_UI_CONFIG.manipulative.label, "Calculated Intent");
  assert.equal(BEHAVIOR_MACRO_UI_CONFIG.resigned.color, "text-cyan-600");
  assert.equal(BEHAVIOR_MACRO_UI_CONFIG.hostile.color, "text-red-400");
  assert.equal(BEHAVIOR_MACRO_UI_CONFIG.casual.border, "border-zinc-800/40");
  assert.equal(COMPLETE_EMOTIONAL_MATRIX.hysterical.glowColor, "shadow-orange-600/30");
  assert.equal(COMPLETE_EMOTIONAL_MATRIX.formal.textStyle, "font-mono text-stone-300 tracking-wide");
});

test("soft-gates behaviour macros with relationship stats and event context", () => {
  const blockedEarnest = evaluatePlayerTurnBehavior({
    text: "I swear, I mean it. This is real.",
    relationshipStats: { affection: 80, trust: 32, angst: 10 },
    eventContext: "NORMAL_SCENE",
  });

  assert.equal(blockedEarnest.class, "casual");
  assert.equal(blockedEarnest.engineAction, "blocked_by_soft_gate");
  assert.match(blockedEarnest.gatedReason ?? "", /low trust/);

  const blockedDefiant = evaluatePlayerTurnBehavior({
    text: "No way. Make me.",
    relationshipStats: { affection: 80, trust: 80, angst: 10 },
    eventContext: "NORMAL_SCENE",
  });

  assert.equal(blockedDefiant.class, "casual");
  assert.equal(blockedDefiant.engineAction, "blocked_by_soft_gate");
  assert.match(blockedDefiant.gatedReason ?? "", /low angst/);

  const blockedResigned = evaluatePlayerTurnBehavior({
    text: "Fine then. It doesn't matter. Forget me.",
    relationshipStats: { affection: 80, trust: 80, angst: 24 },
    eventContext: "NORMAL_SCENE",
  });

  assert.equal(blockedResigned.class, "casual");
  assert.equal(blockedResigned.engineAction, "blocked_by_soft_gate");
  assert.match(blockedResigned.gatedReason ?? "", /low angst/);

  const blockedCoquettish = evaluatePlayerTurnBehavior({
    text: "I whisper closer and hold your gaze.",
    relationshipStats: { affection: 30, charisma: 80, trust: 80, angst: 10 },
    eventContext: "NORMAL_SCENE",
  });

  assert.equal(blockedCoquettish.class, "casual");
  assert.equal(blockedCoquettish.engineAction, "blocked_by_soft_gate");
  assert.match(blockedCoquettish.gatedReason ?? "", /low affection/);

  const blockedPossessive = evaluatePlayerTurnBehavior({
    text: "Mine. Look only at me.",
    relationshipStats: { affection: 60, trust: 80, angst: 12 },
    eventContext: "NORMAL_SCENE",
  });

  assert.equal(blockedPossessive.class, "casual");
  assert.equal(blockedPossessive.engineAction, "blocked_by_soft_gate");
  assert.match(blockedPossessive.gatedReason ?? "", /low angst/);

  const landedCoquettish = evaluatePlayerTurnBehavior({
    text: "I whisper closer and hold your gaze.",
    relationshipStats: { affection: 70, confidence: 38, trust: 80, angst: 10 },
    eventContext: "NORMAL_SCENE",
  });

  assert.equal(landedCoquettish.class, "coquettish");
  assert.equal(landedCoquettish.engineAction, "trigger_intent");

  const blockedMelodrama = evaluatePlayerTurnBehavior({
    text: "This pain has ruined everything. I feel hopeless.",
    relationshipStats: { affection: 80, trust: 80, angst: 12 },
    eventContext: "NORMAL_SCENE",
  });

  assert.equal(blockedMelodrama.class, "casual");
  assert.equal(blockedMelodrama.engineAction, "blocked_by_soft_gate");
  assert.match(blockedMelodrama.gatedReason ?? "", /low angst/);

  const blockedBold = evaluatePlayerTurnBehavior({
    text: "[Steps closer] Look at me and tell me that's true.",
    relationshipStats: { affection: 15, trust: 35, angst: 10 },
    eventContext: "NORMAL_SCENE",
  });

  assert.equal(blockedBold.class, "casual");
  assert.equal(blockedBold.engineAction, "blocked_by_soft_gate");
  assert.equal(blockedBold.gated, true);
  assert.match(blockedBold.gatedReason ?? "", /low affection/);

  const landedBold = evaluatePlayerTurnBehavior({
    text: "[Steps closer] Look at me and tell me that's true.",
    relationshipStats: { affection: 45, trust: 60, angst: 10 },
    eventContext: "NORMAL_SCENE",
  });

  assert.equal(landedBold.class, "bold");
  assert.equal(landedBold.engineAction, "trigger_intent");
  assert.equal(landedBold.gated, false);

  const crisisTeasing = evaluatePlayerTurnBehavior({
    text: "Oh, so you admit you missed me?",
    relationshipStats: { affection: 80, trust: 80, angst: 40 },
    eventContext: "CRISIS_MOMENT",
  });

  assert.equal(crisisTeasing.class, "distant");
  assert.equal(crisisTeasing.engineAction, "context_override");
  assert.equal(crisisTeasing.eventContext, "CRISIS_MOMENT");

  const heavyMixedTurn = classifyPlayerBehaviorMacro("I slap him, but then I cry.");

  assert.equal(heavyMixedTurn.class, "hostile");
  assert.deepEqual(heavyMixedTurn.matchedKeywords.slice(0, 1), ["slap"]);
});

test("classifies spicy intent with weighted multi-sentence resolution", () => {
  assert.equal(SPICY_INTENT_DEFINITIONS.length, 24);
  assert.deepEqual(
    SPICY_INTENT_DEFINITIONS.map((definition) => definition.class),
    [
      "seductive",
      "provocative",
      "flirtatious",
      "coquettish",
      "fervent",
      "captivated",
      "obsessive",
      "primal",
      "dominant",
      "submissive",
      "commanding",
      "yielding",
      "possessive",
      "guarded",
      "defiant",
      "forbidden",
      "roguish",
      "flustered",
      "breathless",
      "melted",
      "sensory",
      "vulnerable",
      "intimate",
      "hedonistic",
    ],
  );

  const samples = [
    ["seductive", "Come a little closer."],
    ["provocative", "Make me."],
    ["flirtatious", "You look incredible tonight."],
    ["coquettish", "[Traces a finger along the collarbone]"],
    ["fervent", "I need you right now."],
    ["captivated", "You make it hard to breathe."],
    ["obsessive", "I cannot let anyone else have you."],
    ["primal", "[Pins your wrists above your head]"],
    ["dominant", "Do exactly as I say."],
    ["submissive", "Whatever you want."],
    ["commanding", "Don't move a single muscle."],
    ["yielding", "[Quietly gives in to the embrace]"],
    ["possessive", "You belong entirely to me."],
    ["guarded", "We can't do this here."],
    ["defiant", "Try and force me then."],
    ["forbidden", "I know this is wrong but I don't care."],
    ["roguish", "Rules were meant to be broken, sweetheart."],
    ["flustered", "I-I'm not looking at your lips!"],
    ["breathless", "[Tries to catch their breath]"],
    ["melted", "[Collapses weakly against your chest]"],
    ["sensory", "[Fingertips tracing slowly over warm skin]"],
    ["vulnerable", "Please don't break my heart."],
    ["intimate", "[Resting together in the quiet afterglow]"],
    ["hedonistic", "Let's just forget about tomorrow."],
  ] as const;

  for (const [expectedClass, text] of samples) {
    assert.equal(classifySpicyIntent(text).class, expectedClass);
  }

  const weighted = classifySpicyIntent(
    "They wink, then say this is forbidden and cross the line anyway.",
  );

  assert.equal(weighted.class, "forbidden");
  assert.equal(resolveSpicyIntent("Let's go find something to eat."), null);
  assert.equal(COMPLETE_SPICY_MATRIX.primal.glow, "shadow-red-700/60");
  assert.equal(COMPLETE_SPICY_MATRIX.hedonistic.label, "Pure Indulgence");
  assert.equal(SPICY_SEVERITY_WEIGHT.forbidden, 2.05);
});

test("classifies comedy intent and evaluates soft-gated joke landing", () => {
  assert.equal(COMEDY_INTENT_DEFINITIONS.length, 24);
  assert.deepEqual(
    COMEDY_INTENT_DEFINITIONS.map((definition) => definition.class),
    [
      "sarcastic",
      "deadpan",
      "snarky",
      "bantering",
      "teasing",
      "absurdist",
      "gremlin",
      "goblin",
      "delusional",
      "exaggerated",
      "exasperated",
      "panicked",
      "clueless",
      "awkward",
      "deflective",
      "meta",
      "genre_savvy",
      "parodying",
      "sceptical",
      "goofy",
      "sappy",
      "cheerleading",
      "braggart",
      "clownish",
    ],
  );

  const samples = [
    ["sarcastic", "Oh, wonderful. Another dragon."],
    ["deadpan", "Cool story."],
    ["snarky", "Nice outfit. Did you get it from a dumpster?"],
    ["bantering", "You wish you were that clever."],
    ["teasing", "Look at you, getting all blushed over a simple hello."],
    ["absurdist", "I am currently legally a potato."],
    ["gremlin", "[Intentionally knocks their expensive wine glass off the table]"],
    ["goblin", "Can I eat this rock?"],
    ["delusional", "It's just their love language!"],
    ["exaggerated", "My life is fundamentally ruined."],
    ["exasperated", "[Deep, exhausting sigh]"],
    ["panicked", "Everything is on fire and we're all going to die!"],
    ["clueless", "Wait, we were fighting? I thought we were dancing!"],
    ["awkward", "Uh thanks. You have nice teeth."],
    ["deflective", "Hey look, a very shiny beetle!"],
    ["meta", "I picked this dialogue option because the other choices looked boring."],
    ["genre_savvy", "I'm not going into that alley. That's where the tragic flashback happens."],
    ["parodying", "[Leans against the wall with ridiculous smouldering intensity]"],
    ["sceptical", "Right, you're a vampire. And I'm the Queen of England."],
    ["goofy", "[Makes a ridiculous face to break the tension]"],
    ["sappy", "Did it hurt when you fell from heaven?"],
    ["cheerleading", "You failed spectacularly, but you looked amazing doing it! Yay team!"],
    ["braggart", "Step aside, I am a god of tactical brilliance!"],
    ["clownish", "Don't worry, my head completely broke my fall!"],
  ] as const;

  for (const [expectedClass, text] of samples) {
    assert.equal(classifyComedyIntent(text).class, expectedClass);
  }

  const trustedChaos = classifyComedyIntent(
    "[Intentionally knocks their expensive wine glass off the table]",
    { trust: 80, affection: 55 },
  );
  const lowTrustChaos = classifyComedyIntent(
    "[Intentionally knocks their expensive wine glass off the table]",
    { trust: 20, affection: 20 },
  );

  assert.equal(trustedChaos.class, "gremlin");
  assert.equal(trustedChaos.landing?.npcReaction, "PLAYFUL_SIGH");
  assert.equal(trustedChaos.landing?.affectionDelta, 2);
  assert.equal(lowTrustChaos.landing?.npcReaction, "ANNOYED_FREEZE");
  assert.equal(lowTrustChaos.landing?.trustDelta, -5);
  assert.equal(lowTrustChaos.landing?.angstDelta, 10);

  const weighted = classifyComedyIntent(
    "Cool story. Anyway, I am currently legally a potato.",
  );

  assert.equal(weighted.class, "absurdist");
  assert.equal(resolveComedyIntent("Let's go find something to eat."), null);
  assert.equal(COMPLETE_COMEDY_MATRIX.meta.soundTrigger, "sfx_glitch");
  assert.equal(COMPLETE_COMEDY_MATRIX.cheerleading.borderColor, "border-green-400");
  assert.equal(COMEDY_SEVERITY_WEIGHT.gremlin, 1.75);
});

test("classifies bdsm intent with hard-priority safety interrupts", () => {
  assert.equal(BDSM_INTENT_DEFINITIONS.length, 24);
  assert.deepEqual(
    BDSM_INTENT_DEFINITIONS.map((definition) => definition.class),
    [
      "commanding",
      "restraining",
      "imposing",
      "chastising",
      "exacting",
      "obedient",
      "entreating",
      "enduring",
      "exposed",
      "melting",
      "teasing",
      "manipulative",
      "defiant",
      "possessive",
      "sensory",
      "breathless",
      "flustered",
      "sub_drop",
      "dom_space",
      "nurturing",
      "safework",
      "safe_amber",
      "safe_red",
      "formal",
    ],
  );

  const samples = [
    ["commanding", "Do exactly as I say."],
    ["restraining", "[Pins your wrists to the framework]"],
    ["imposing", "[Steps over you, looking down coldly]"],
    ["chastising", "You spoke out of turn."],
    ["exacting", "Reset and try it again, perfectly."],
    ["obedient", "Yes, Master."],
    ["entreating", "Please let me."],
    ["enduring", "[Bites my lip and absorbs the sting]"],
    ["exposed", "[Kneels silently, unable to look up]"],
    ["melting", "[Collapses weakly against the floor]"],
    ["teasing", "Not yet. Wait."],
    ["manipulative", "Are you sure you can handle this?"],
    ["defiant", "Make me obey you then."],
    ["possessive", "You belong entirely to me."],
    ["sensory", "[Traces cold leather across bare skin]"],
    ["breathless", "[Tries to find my voice, chest heaving]"],
    ["flustered", "I-I wasn't ready for that."],
    ["sub_drop", "I feel cold. Please hold me."],
    ["dom_space", "[Exhales deeply, releasing the tension]"],
    ["nurturing", "You did perfectly. It's over now."],
    ["safework", "Are you still okay with this trajectory?"],
    ["safe_amber", "Yellow. Slow down."],
    ["safe_red", "Red. Stop everything right now."],
    ["formal", "Thank you for the instruction."],
  ] as const;

  for (const [expectedClass, text] of samples) {
    assert.equal(classifyBdsmIntent(text).class, expectedClass);
  }

  const redInterrupt = classifyBdsmIntent(
    "Do exactly as I say. Red. Stop everything right now.",
  );
  const amberInterrupt = classifyBdsmIntent("Make me obey you then. Slow down.");

  assert.equal(redInterrupt.class, "safe_red");
  assert.equal(redInterrupt.hardInterrupt, true);
  assert.equal(redInterrupt.ipcEvent, "evt_red");
  assert.equal(amberInterrupt.class, "safe_amber");
  assert.equal(amberInterrupt.hardInterrupt, true);
  assert.equal(resolveBdsmIntent("Let's go find something to eat."), null);
  assert.equal(handleBdsmPlayerInput("Abort."), "safe_red");
  assert.equal(COMPLETE_BDSM_MATRIX.safe_red.borderStyle, "border-red-600 border-2");
  assert.equal(COMPLETE_BDSM_MATRIX.nurturing.ipcEvent, "evt_nurture");
  assert.equal(BDSM_SEVERITY_WEIGHT.safe_red, 10);
});

test("classifies dark romance intent with psychological state gating", () => {
  assert.equal(DARK_ROMANCE_INTENT_DEFINITIONS.length, 24);
  assert.deepEqual(
    DARK_ROMANCE_INTENT_DEFINITIONS.map((definition) => definition.class),
    [
      "obsessive",
      "possessive",
      "stalking",
      "territorial",
      "fixated",
      "captive",
      "coercive",
      "submissive",
      "dominant",
      "defiant",
      "gaslighting",
      "stockholm",
      "codependent",
      "manipulative",
      "delusional",
      "dread",
      "breathless",
      "intoxicated",
      "hysterical",
      "numb",
      "vindictive",
      "sombre",
      "hostile",
      "resigned",
    ],
  );

  const samples = [
    ["obsessive", "I watch you even when you sleep."],
    ["possessive", "You don't get to look at anyone else."],
    ["stalking", "[Follows their footsteps from a quiet distance]"],
    ["territorial", "Step away from what belongs to me."],
    ["fixated", "I notice every time your heart skips a beat."],
    ["captive", "There is nowhere left for me to run."],
    ["coercive", "Think about what happens if you say no."],
    ["submissive", "[Quietly kneels, yielding all fight]"],
    ["dominant", "You leave this room only when I allow it."],
    ["defiant", "Kill me then, but I won't obey."],
    ["gaslighting", "You're remembering it wrong."],
    ["stockholm", "They only hurt me because they care."],
    ["codependent", "If you die, I will tear this world down and follow you."],
    ["manipulative", "After everything I sacrificed, you'd leave?"],
    ["delusional", "Underneath the blood, I know they love me."],
    ["dread", "[Freezes completely as their shadow falls over the doorway]"],
    ["breathless", "[My chest heaves, suffocating under their gaze]"],
    ["intoxicated", "It's poison, but I want more."],
    ["hysterical", "We are both going to burn in this hell."],
    ["numb", "Do whatever you want. I am already gone."],
    ["vindictive", "Now you get to feel exactly what you did to me."],
    ["sombre", "We were doomed from the start."],
    ["hostile", "I will live long enough to watch you bleed."],
    ["resigned", "This is our cage. Let's rot here together."],
  ] as const;

  for (const [expectedClass, text] of samples) {
    assert.equal(
      classifyDarkRomanceIntent(text, { sanity: 10 }).class,
      expectedClass,
    );
  }

  const gatedStockholm = classifyDarkRomanceIntent(
    "They only hurt me because they care.",
    { sanity: 60 },
  );
  const unlockedStockholm = classifyDarkRomanceIntent(
    "They only hurt me because they care.",
    { sanity: 10 },
  );
  const weighted = classifyDarkRomanceIntent(
    "I hate you, but underneath the blood, I know they love me.",
    { sanity: 10 },
  );

  assert.equal(gatedStockholm.class, "stockholm");
  assert.equal(gatedStockholm.gated, true);
  assert.match(gatedStockholm.gatedReason ?? "", /sanity below 20/);
  assert.equal(unlockedStockholm.gated, false);
  assert.equal(weighted.class, "delusional");
  assert.equal(resolveDarkRomanceIntent("Let's go find something to eat."), null);
  assert.equal(
    resolveDarkRomanceIntent("Underneath the blood, I know they love me.", {
      sanity: 60,
    }),
    null,
  );
  assert.equal(
    resolveDarkRomanceIntent("Underneath the blood, I know they love me.", {
      sanity: 10,
    }),
    "delusional",
  );

  const mutatedState = applyDarkRomanceStateDelta(
    { control: 98, obsession: 97, sanity: 3 },
    { controlDelta: 5, obsessionDelta: 4, sanityDelta: -6 },
  );

  assert.deepEqual(mutatedState, { control: 100, obsession: 100, sanity: 0 });
  assert.equal(
    COMPLETE_DARK_ROMANCE_MATRIX.gaslighting.textAnimation,
    "blur-[0.3px] text-cyan-200",
  );
  assert.equal(
    COMPLETE_DARK_ROMANCE_MATRIX.hostile.glowEffect,
    "shadow-red-700/60",
  );
  assert.equal(DARK_ROMANCE_SEVERITY_WEIGHT.gaslighting, 2.05);
});

test("derives friendly tone tags from emotion language", () => {
  const analysis = analyzeEmotionLexicon(
    "He is guarded, lonely, tense, and secretly longing for someone kind.",
  );

  assert.deepEqual(
    analysis.signals.map((signal) => signal.cluster),
    ["sadness", "tension", "vulnerability", "yearning"],
  );
  assert.deepEqual(analysis.toneTags, ["angsty", "hurt/comfort", "slow burn"]);
  assert.deepEqual(analysis.microTropes, [
    "hurt/comfort",
    "mutual pining",
    "who hurt you",
  ]);
});

test("recognizes curiosity courage disconnection and guilt emotion signals", () => {
  const analysis = analyzeEmotionLexicon(
    "She is brave and fascinated, but he has shut down after years of regret.",
  );

  assert.deepEqual(
    analysis.signals.map((signal) => signal.cluster),
    ["courage", "curiosity", "disconnection", "guilt"],
  );
  assert.deepEqual(analysis.toneTags, [
    "angsty",
    "curious",
    "high agency",
    "quiet tension",
    "second chance",
  ]);
  assert.deepEqual(analysis.microTropes, ["hurt/comfort", "who hurt you"]);
});

test("validates ccv3 cards with tolerant defaults and extension macro data", () => {
  const card = CharacterCardV3Schema.parse({
    spec: "chara_card_v3",
    spec_version: "3.0",
    data: {
      name: "Mara",
      extensions: {
        amourai: {
          macro: {
            framework: "Narrative RPG",
            formatting: "Natural Language",
          },
        },
      },
      character_book: {
        extensions: {},
        entries: [
          {
            id: "safehouse-route",
            keys: ["safehouse"],
            content: "Mara keeps a safehouse under the bridge.",
            extensions: {},
            enabled: true,
            insertion_order: 1,
            use_regex: false,
          },
        ],
      },
    },
  });

  assert.equal(card.data.description, "");
  assert.deepEqual(card.data.tags, []);
  assert.equal(card.data.group_only_greetings.length, 0);
  assert.equal(card.data.character_book?.entries[0]?.id, "safehouse-route");
  assert.equal(
    card.data.extensions.amourai &&
      typeof card.data.extensions.amourai === "object" &&
      "macro" in card.data.extensions.amourai,
    true,
  );
});

test("merges routed intake without clobbering edited fields", () => {
  const currentValues = createCharacterCardFormValues({
    data: {
      name: "Existing Name",
      tags: ["slow burn"],
      alternate_greetings: ["Existing opening"],
    },
  });
  const mergedValues = mergeCharacterCardIntakeValues(currentValues, {
    fullName: "Routed Name",
    description: "New hook.",
    tagsText: "noir, slow burn",
    alternateOpenings: [
      {
        scenario: "New route.",
        firstMessage: "New opening.",
      },
    ],
  });

  assert.equal(mergedValues.fullName, "Existing Name");
  assert.equal(mergedValues.description, "New hook.");
  assert.equal(mergedValues.tagsText, "slow burn, noir");
  assert.deepEqual(mergedValues.alternateOpenings, [
    {
      scenario: "New route.",
      firstMessage: "New opening.",
    },
  ]);
});

test("can apply edit notes by overwriting populated character fields", () => {
  const currentValues = createCharacterCardFormValues({
    data: {
      name: "Existing Name",
      description: "Old overview.",
      scenario: "Old scenario.",
      tags: ["slow burn"],
    },
  });
  const mergedValues = mergeCharacterCardIntakeValues(
    currentValues,
    {
      fullName: "Edited Name",
      description: "Updated overview.",
      scenario: "Updated scenario.",
      tagsText: "noir, slow burn",
    },
    { overwrite: true },
  );

  assert.equal(mergedValues.fullName, "Edited Name");
  assert.equal(mergedValues.description, "Updated overview.");
  assert.equal(mergedValues.scenario, "Updated scenario.");
  assert.equal(mergedValues.tagsText, "slow burn, noir");
});

test("imports fixture png values and exports edited ccv3 metadata", () => {
  const fixtureCard = {
    spec: "chara_card_v3",
    spec_version: "3.0",
    data: {
      name: "Fixture Card",
      description: "Fixture description",
      tags: ["test", "fixture"],
      extensions: {},
      alternate_greetings: ["Alternate hello"],
      group_only_greetings: ["Group hello"],
      character_book: {
        extensions: {},
        entries: [
          {
            keys: ["fixture"],
            content: "Fixture lore",
            extensions: {},
            enabled: true,
            insertion_order: 0,
            use_regex: false,
          },
        ],
      },
      assets: [
        {
          type: "icon",
          uri: "ccdefault:",
          name: "main",
          ext: "png",
        },
      ],
    },
  };
  const fixturePng = createPngWithTextChunks([
    { keyword: "ccv3", text: encodeCard(fixtureCard) },
  ]);

  const importedCard = importCharacterCardPngData("fixture.png", fixturePng);

  assert.equal(importedCard.formValues.fullName, "Fixture Card");
  assert.equal(importedCard.formValues.tagsText, "test, fixture");
  assert.deepEqual(importedCard.summary.loadedSummary, {
    name: "Fixture Card",
    tagsCount: 2,
    alternateGreetingsCount: 1,
    groupOnlyGreetingsCount: 1,
    lorebookEntriesCount: 1,
    assetsCount: 1,
  });

  const exportedPng = exportCharacterCardPngData(
    fixturePng,
    importedCard.card,
    {
      ...importedCard.formValues,
      fullName: "Edited Fixture Card",
      groupOnlyGreetings: ["Group hello", "Second group hello"],
    },
  );
  const exportedCard = readCharacterCardFromPng(exportedPng).card;

  assert.equal(exportedCard.spec, "chara_card_v3");
  assert.equal(exportedCard.data?.name, "Edited Fixture Card");
  assert.deepEqual(exportedCard.data?.group_only_greetings, [
    "Group hello",
    "Second group hello",
  ]);
});

test("calculates leap years and dynamic month bounds", () => {
  assert.equal(isLeapYear(2024), true);
  assert.equal(isLeapYear(1900), false);
  assert.equal(isLeapYear(2000), true);
  assert.equal(daysInMonth(2024, 2), 29);
  assert.equal(daysInMonth(2023, 2), 28);
  assert.equal(daysInMonth(2023, 4), 30);
  assert.equal(daysInMonth(2023, 1), 31);
});

test("calculates zodiac signs from month and day boundaries", () => {
  assert.equal(calculateZodiac(3, 21), "Aries");
  assert.equal(calculateZodiac(4, 19), "Aries");
  assert.equal(calculateZodiac(4, 20), "Taurus");
  assert.equal(calculateZodiac(11, 22), "Sagittarius");
  assert.equal(calculateZodiac(12, 22), "Capricorn");
  assert.equal(calculateZodiac(2, 19), "Pisces");
});

test("generates age gap romance data with bounded senior age and birthdate", () => {
  const generated = generateAgeGapRomance("Age Gap (Senior)", {
    anchorYear: 2026,
    powerDynamic: "Age Gap (Senior)",
    random: () => 0,
  });

  assert.equal(generated.given_name, "Cole");
  assert.equal(generated.surname, "Askew");
  assert.equal(generated.age, 31);
  assert.equal(generated.birth_year, 1995);
  assert.equal(generated.birth_month, "January");
  assert.equal(generated.birth_day, 1);
  assert.equal(generated.zodiac, "Capricorn");
});

test("uses trope birthdate presets when supplied", () => {
  const generated = generateAgeGapRomance("Age Gap (Senior)", {
    anchorYear: 2026,
    powerDynamic: "Age Gap (Senior)",
    random: () => 0,
    trope: "Dark/Possessive Anti-Hero",
  });

  assert.equal(generated.birth_month, "November");
  assert.equal(generated.birth_day, 11);
  assert.equal(generated.zodiac, "Scorpio");
});

test("keeps human species as the mortal baseline generation path", () => {
  const generated = generateAgeGapRomance("Age Gap (Senior)", {
    anchorYear: 2026,
    powerDynamic: "Age Gap (Senior)",
    random: () => 0,
    speciesType: "Human",
  });

  assert.equal(generated.species?.type, "Human");
  assert.equal(generated.species?.isImmortal, false);
  assert.equal(generated.species?.instinctualTrait, "Mortal / Baseline");
  assert.equal(generated.species?.dietaryNeed, "Standard food");
  assert.equal(generated.apparent_age, undefined);
  assert.equal(generated.age, 31);
  assert.equal(generated.birth_year, 1995);
});

test("does not trigger age gap math unless the power dynamic requests it", () => {
  const generated = generateAgeGapRomance("Generated Preview", {
    anchorYear: 2026,
    powerDynamic: "Peers / Equals",
    random: () => 0,
    speciesType: "Human",
  });

  assert.equal(generated.species?.type, "Human");
  assert.equal(generated.age, 25);
  assert.equal(generated.birth_year, 2001);
  assert.equal(generated.apparent_age, undefined);
});

test("applies supernatural species age and name modifiers only when selected", () => {
  const fae = generateAgeGapRomance("Age Gap (Senior)", {
    random: () => 0,
    speciesType: "Fae",
  });
  const werewolf = generateAgeGapRomance("Age Gap (Senior)", {
    anchorYear: 2026,
    random: () => 0,
    speciesType: "Werewolf",
  });
  const human = generateSpeciesData("Human", () => 0);

  assert.equal(fae.given_name, "Caspian");
  assert.equal(fae.surname, "Thorne");
  assert.equal(fae.species?.type, "Fae");
  assert.equal(fae.species?.isImmortal, true);
  assert.equal(fae.species?.heritage, "Gaelic & Celtic");
  assert.equal(fae.species?.nameAura, "Elite / Noble");
  assert.equal(fae.species?.nameEra, "Medieval & Ancient");
  assert.equal(fae.age, 342);
  assert.equal(fae.apparent_age, 27);
  assert.equal(fae.birth_year, 1684);
  assert.equal(fae.zodiac, "Capricorn");

  assert.equal(werewolf.species?.type, "Werewolf");
  assert.equal(werewolf.species?.nameAura, "Gritty / Edgy");
  assert.equal(werewolf.species?.instinctualTrait, "Fated Mates / Pack Alpha");
  assert.equal(werewolf.age, 21);
  assert.equal(werewolf.apparent_age, undefined);

  assert.equal(human.nameAura, undefined);
});

test("selects curated supernatural seeds by species", () => {
  const demon = generateAgeGapRomance("Generated Preview", {
    random: () => 0,
    speciesType: "Demon",
  });
  const angel = generateAgeGapRomance("Generated Preview", {
    random: () => 0,
    speciesType: "Angel",
  });
  const siren = generateAgeGapRomance("Generated Preview", {
    random: () => 0,
    speciesType: "Siren",
  });
  const wraith = generateAgeGapRomance("Generated Preview", {
    random: () => 0,
    speciesType: "Wraith",
  });

  assert.equal(demon.given_name, "Valerius");
  assert.equal(demon.species?.instinctualTrait.includes("Aura Siphoning"), true);
  assert.equal(demon.age, 666);

  assert.equal(angel.given_name, "Gideon");
  assert.equal(angel.zodiac, "Leo");
  assert.equal(angel.apparent_age, 29);

  assert.equal(siren.given_name, "Ronan");
  assert.equal(siren.species?.dietaryNeed, "Emotional fixation");
  assert.equal(siren.birth_year, 1928);

  assert.equal(wraith.given_name, "Alistair");
  assert.equal(wraith.species?.instinctualTrait.includes("Intangible Touch"), true);
  assert.equal(wraith.zodiac, "Sagittarius");
});

test("routes ethnicity classifiers into surname pools and metadata", () => {
  const southern = generateAgeGapRomance("Generated Preview", {
    anchorYear: 2026,
    ethnicityRegion: "Southern_European",
    linguisticMatrix: "Latinate / Romance",
    powerDynamic: "Peers / Equals",
    random: () => 0,
    speciesType: "Human",
  });
  const slavic = generateAgeGapRomance("Generated Preview", {
    anchorYear: 2026,
    ethnicityRegion: "Eastern_European_Slavic",
    linguisticMatrix: "Slavic / Cyrillic-Derived",
    powerDynamic: "Peers / Equals",
    random: () => 0,
    speciesType: "Human",
  });
  const diaspora = generateEthnicityData(
    "Italian-American",
    "Diaspora_Blended",
    "Latinate / Romance",
    () => 0.9,
  );

  assert.equal(southern.surname, "Bello");
  assert.equal(southern.ethnicity?.region, "Southern_European");
  assert.equal(southern.ethnicity?.linguisticMatrix, "Latinate / Romance");
  assert.equal(southern.ethnicity?.nativeLanguage, "Romance-language endearment markers");

  assert.equal(slavic.surname, "Anatowicz");
  assert.equal(slavic.ethnicity?.region, "Eastern_European_Slavic");
  assert.equal(slavic.ethnicity?.nativeLanguage, "Slavic endearment markers");

  assert.equal(diaspora.region, "Diaspora_Blended");
  assert.equal(diaspora.societalContext, "Multigenerational Diaspora");
  assert.equal(diaspora.hasDiasporicBaggage, true);
});

test("routes nationality separately from ethnicity and race", () => {
  const southern = generateAgeGapRomance("Generated Preview", {
    anchorYear: 2026,
    ethnicityRegion: "Southern_European",
    linguisticMatrix: "Latinate / Romance",
    powerDynamic: "Peers / Equals",
    random: () => 0.5,
    speciesType: "Human",
  });
  const diasporaEthnicity = generateEthnicityData(
    "Italian-American",
    "Diaspora_Blended",
    "Latinate / Romance",
    () => 0,
  );
  const diasporaNationality = generateNationalityData(
    undefined,
    undefined,
    undefined,
    undefined,
    diasporaEthnicity,
  );
  const fictionalNationality = generateNationalityData(
    "Solar Fae Court",
    "Fictional_Empire",
    "Dual_Citizen",
    undefined,
    southern.ethnicity!,
  );

  assert.equal(southern.nationality?.passportCountry, "Italy");
  assert.equal(southern.nationality?.regionalAlliance, "EU_Schengen");
  assert.equal(southern.nationality?.legalStatus, "Native");
  assert.equal(
    southern.nationality?.linguisticVibe.includes("Italy"),
    true,
  );

  assert.equal(diasporaNationality.passportCountry, "United States");
  assert.equal(diasporaNationality.regionalAlliance, "Western_Allies");
  assert.equal(diasporaNationality.legalStatus, "Naturalized");

  assert.equal(fictionalNationality.passportCountry, "Solar Fae Court");
  assert.equal(fictionalNationality.regionalAlliance, "Fictional_Empire");
  assert.equal(fictionalNationality.legalStatus, "Dual_Citizen");
  assert.equal(
    fictionalNationality.linguisticVibe.includes("Code-switches"),
    true,
  );
});

test("routes professional occupation metadata by trope and explicit fields", () => {
  const inferred = generateAgeGapRomance("Billionaire CEO Office Romance", {
    anchorYear: 2026,
    powerDynamic: "Peers / Equals",
    random: () => 0,
    speciesType: "Human",
  });
  const explicit = generateOccupationData({
    authorityDynamic: "Outsider",
    jobTitle: "Personal Bodyguard",
    professionalDomain: "Security_Defense",
    socioeconomicTier: "High_Professional",
    workplaceVibe: "Armored private security office",
  });

  assert.equal(inferred.occupation?.kind, "professional");
  assert.equal(inferred.occupation?.jobTitle, "Chief Executive Officer");
  assert.equal(inferred.occupation?.authorityDynamic, "Superior");
  if (inferred.occupation?.kind === "professional") {
    assert.equal(inferred.occupation.socioeconomicTier, "Ultra_Elite");
    assert.equal(inferred.occupation.professionalDomain, "Corporate_Finance");
  }

  assert.equal(explicit.kind, "professional");
  assert.equal(explicit.jobTitle, "Personal Bodyguard");
  assert.equal(explicit.authorityDynamic, "Outsider");
  if (explicit.kind === "professional") {
    assert.equal(explicit.professionalDomain, "Security_Defense");
  }
});

test("switches university student occupation into academic schema", () => {
  const academicRival = generateAgeGapRomance("Academic_Rivals", {
    anchorYear: 2026,
    random: () => 0,
    speciesType: "Human",
  });
  const student = generateOccupationData({
    academicYear: "Postgrad_PhD",
    campusAffiliation: "Varsity Rowing Team",
    fundingType: "Legacy_Trust",
    jobTitle: "University Student",
    majorField: "Athletics",
  });

  assert.equal(academicRival.occupation?.kind, "student");
  assert.equal(academicRival.occupation?.jobTitle, "University Student");
  assert.equal(academicRival.age, 21);
  if (academicRival.occupation?.kind === "student") {
    assert.equal(academicRival.occupation.academicYear, "Senior");
    assert.equal(academicRival.occupation.majorField, "Humanities_Law");
    assert.equal(academicRival.occupation.authorityDynamic, "Equal");
    assert.equal(
      academicRival.occupation.workplaceVibe.includes("library archive"),
      true,
    );
  }

  assert.equal(student.kind, "student");
  if (student.kind === "student") {
    assert.equal(student.academicYear, "Postgrad_PhD");
    assert.equal(student.fundingType, "Legacy_Trust");
    assert.equal(student.majorField, "Athletics");
    assert.equal(student.campusAffiliation, "Varsity Rowing Team");
  }
});

test("routes romance NPC relationships by trope and caps custom arrays", () => {
  const arranged = generateAgeGapRomance("Arranged Marriage", {
    anchorYear: 2026,
    random: () => 0,
    speciesType: "Human",
  });
  const fakeDatingRelationships = generateRelationshipsData("Fake Dating");
  const custom = generateAgeGapRomance("Generated Preview", {
    relationships: [
      {
        connectionType: "Family_Lineage",
        emotionalStatus: "Dependent_Protected",
        npcName: "Julian Thorne",
        oneLineDescription: "A younger brother {{char}} protects from family debt.",
        romanceFunction: "The_Secret_Keeper",
      },
      {
        connectionType: "Found_Family",
        emotionalStatus: "Devoted_Loyal",
        npcName: "Beatrice Volkov",
        oneLineDescription: "A loyal roommate who pushes {{char}} toward honesty.",
        romanceFunction: "The_Matchmaker",
      },
      {
        connectionType: "Professional_Circle",
        emotionalStatus: "Strained_Fractured",
        npcName: "Maeve Cross",
        oneLineDescription: "A business partner who distrusts romantic distractions.",
        romanceFunction: "The_Barrier",
      },
      {
        connectionType: "Antagonistic_Force",
        emotionalStatus: "Estranged_Ghosted",
        npcName: "Roxie",
        oneLineDescription: "A jealous ex who should be trimmed by the cap.",
        romanceFunction: "The_Jealousy_Instigator",
      },
    ],
    random: () => 0,
  });

  assert.equal(arranged.relationships?.length, 1);
  assert.equal(arranged.relationships?.[0].npcName, "Lord Arthur Thorne");
  assert.equal(arranged.relationships?.[0].connectionType, "Family_Lineage");
  assert.equal(arranged.relationships?.[0].romanceFunction, "The_Barrier");
  assert.equal(arranged.relationships?.[0].emotionalStatus, "Strained_Fractured");

  assert.equal(fakeDatingRelationships[0].npcName, "Roxie");
  assert.equal(
    fakeDatingRelationships[0].romanceFunction,
    "The_Jealousy_Instigator",
  );
  assert.equal(fakeDatingRelationships[0].connectionType, "Antagonistic_Force");

  assert.equal(custom.relationships?.length, 3);
  assert.equal(custom.relationships?.[2].npcName, "Maeve Cross");
});

test("routes relationship status availability by trope and industry", () => {
  const secondChance = generateAgeGapRomance("Second Chance Romance", {
    anchorYear: 2026,
    random: () => 0,
    speciesType: "Human",
  });
  const underworldArranged = generateAgeGapRomance("Arranged Marriage", {
    occupationProfessionalDomain: "Underworld",
    random: () => 0,
    speciesType: "Human",
  });
  const fakeDating = generateRelationshipStatusData("Fake Dating");
  const defaultStatus = generateRelationshipStatusData("Generated Preview");

  assert.equal(secondChance.relationshipStatus?.currentLabel, "Divorced_Separated");
  assert.equal(
    secondChance.relationshipStatus?.emotionalAvailability,
    "Lingering_Past",
  );
  assert.equal(
    secondChance.relationshipStatus?.statusContext.includes("{{user}}"),
    true,
  );

  assert.equal(
    underworldArranged.relationshipStatus?.currentLabel,
    "Betrothed_Promised",
  );
  assert.equal(
    underworldArranged.relationshipStatus?.emotionalAvailability,
    "Guarded_Closed",
  );
  assert.equal(underworldArranged.relationshipStatus?.scandalFactor, "High_Taboo");

  assert.equal(fakeDating.currentLabel, "It_Complicated");
  assert.equal(fakeDating.emotionalAvailability, "Casual_Only");
  assert.equal(defaultStatus.currentLabel, "Single");
  assert.equal(defaultStatus.scandalFactor, "None");
});

test("routes opt-in adult intimacy metadata by trope species and authority", () => {
  const vampire = generateAgeGapRomance("Dark Romance", {
    random: () => 0,
    speciesType: "Vampire",
  });
  const grumpyBoss = generateKinkData("Grumpy Sunshine", "Human", "Superior");
  const defaultKink = generateKinkData("Generated Preview", "Human", "Equal");
  const custom = generateAgeGapRomance("Generated Preview", {
    kink: {
      intensityLevel: "Moderate_Sensory",
      nsfwEnabled: true,
      preferredSensoryTags: ["Praise", "Control"],
      primaryRole: "Dominant",
      systemPromptInstruction:
        "When adult scenes are explicitly invited, keep {{char}} attentive and consent-forward.",
    },
    random: () => 0,
  });

  assert.equal(vampire.kink?.nsfwEnabled, true);
  assert.equal(vampire.kink?.primaryRole, "Primal");
  assert.equal(vampire.kink?.intensityLevel, "Intense_Heavy");
  assert.equal(vampire.kink?.preferredSensoryTags.includes("Marking"), true);
  assert.equal(
    vampire.kink?.systemPromptInstruction.includes("consent checks"),
    true,
  );

  assert.equal(grumpyBoss.nsfwEnabled, true);
  assert.equal(grumpyBoss.primaryRole, "Dominant");
  assert.equal(grumpyBoss.intensityLevel, "Moderate_Sensory");
  assert.equal(defaultKink.nsfwEnabled, false);
  assert.equal(defaultKink.primaryRole, "Switch");

  assert.equal(custom.kink?.nsfwEnabled, true);
  assert.equal(custom.kink?.preferredSensoryTags.length, 2);
});

test("routes opt-in fetish metadata separately from kink behavior", () => {
  const workplaceElite = generateAgeGapRomance("Workplace Romance", {
    occupationSocioeconomicTier: "Ultra_Elite",
    random: () => 0,
    speciesType: "Human",
  });
  const vampire = generateFetishData("Generated Preview", "Vampire");
  const darkRomance = generateAgeGapRomance("Dark Romance", {
    random: () => 0,
    speciesType: "Human",
  });
  const defaultFetish = generateFetishData("Generated Preview", "Human");
  const custom = generateAgeGapRomance("Generated Preview", {
    fetish: {
      aiDescriptiveFocus:
        "Focus narrative descriptions on silk garments and held eye contact.",
      anatomicalFocus: "Hair_Face",
      fetishEnabled: true,
      materialPreference: "Lace_Silk",
      situationalTrigger: "Exhibitionism_Risk",
      sizeFantasyModifier: "Standard_Scale",
    },
    random: () => 0,
  });

  assert.equal(workplaceElite.fetish?.fetishEnabled, true);
  assert.equal(workplaceElite.fetish?.materialPreference, "Uniforms_Suits");
  assert.equal(workplaceElite.fetish?.situationalTrigger, "Exhibitionism_Risk");
  assert.equal(workplaceElite.fetish?.anatomicalFocus, "Hair_Face");
  assert.equal(
    workplaceElite.fetish?.aiDescriptiveFocus.includes("business attire"),
    true,
  );

  assert.equal(vampire.fetishEnabled, true);
  assert.equal(vampire.situationalTrigger, "Sanguine_Biting");
  assert.equal(vampire.materialPreference, "Leather_Latex");
  assert.equal(vampire.sizeFantasyModifier, "Extreme_Height_Gap");
  assert.equal(darkRomance.fetish?.situationalTrigger, "Sanguine_Biting");
  assert.equal(defaultFetish.fetishEnabled, false);
  assert.equal(defaultFetish.anatomicalFocus, "None");

  assert.equal(custom.fetish?.fetishEnabled, true);
  assert.equal(custom.fetish?.materialPreference, "Lace_Silk");
});

test("routes intimacy style separately from kink and fetish metadata", () => {
  const hurtComfort = generateAgeGapRomance("Hurt Comfort", {
    random: () => 0,
    speciesType: "Human",
  });
  const forcedProximity = generateIntimacyStyleData("Forced Proximity");
  const enemies = generateIntimacyStyleData(
    "Enemies to Lovers",
    "Gritty / Edgy",
  );
  const custom = generateAgeGapRomance("Generated Preview", {
    intimacyStyle: {
      aftercareStyle: "The_Confessor",
      aiBehaviorPrompt:
        "During private moments, {{char}} gets honest before they get brave.",
      expressionType: "Vulnerable_Yielding",
      physicalLoveLanguage: "Verbal_Affirmation",
      verbalCadence: "Hesitant_Reassurance",
    },
    random: () => 0,
  });

  assert.equal(hurtComfort.intimacyStyle?.expressionType, "Vulnerable_Yielding");
  assert.equal(hurtComfort.intimacyStyle?.aftercareStyle, "The_Nurturer");
  assert.equal(hurtComfort.intimacyStyle?.verbalCadence, "Praise_Validation");
  assert.equal(
    hurtComfort.intimacyStyle?.physicalLoveLanguage,
    "Touch_Holding",
  );

  assert.equal(forcedProximity.expressionType, "Vulnerable_Yielding");
  assert.equal(enemies.expressionType, "Stoic_Restrained");
  assert.equal(enemies.aftercareStyle, "The_Processor");
  assert.equal(enemies.verbalCadence, "Silent_Connection");
  assert.equal(enemies.physicalLoveLanguage, "Protective_Proximity");

  assert.equal(custom.intimacyStyle?.aftercareStyle, "The_Confessor");
  assert.equal(custom.intimacyStyle?.verbalCadence, "Hesitant_Reassurance");
});

test("routes turn-off constraints from kink role intimacy style and aura", () => {
  const dominantPraise = generateTurnOffData(
    "Generated Preview",
    {
      intensityLevel: "Moderate_Sensory",
      nsfwEnabled: true,
      preferredSensoryTags: ["Praise"],
      primaryRole: "Dominant",
      systemPromptInstruction: "Praise-heavy dominant mode.",
    },
    {
      aftercareStyle: "The_Nurturer",
      aiBehaviorPrompt: "Soft praise.",
      expressionType: "Intense_Devoted",
      physicalLoveLanguage: "Touch_Holding",
      verbalCadence: "Praise_Validation",
    },
  );
  const slowBurn = generateTurnOffData(
    "Slow Burn",
    {
      intensityLevel: "Mild_Vanilla",
      nsfwEnabled: false,
      preferredSensoryTags: [],
      primaryRole: "Switch",
      systemPromptInstruction: "Default.",
    },
    generateIntimacyStyleData("Generated Preview"),
    "Gritty / Edgy",
  );
  const generated = generateAgeGapRomance("Slow Burn", {
    random: () => 0,
    speciesType: "Werewolf",
  });

  assert.equal(dominantPraise.dynamicHardlines, "No_Role_Reversal");
  assert.equal(dominantPraise.behavioralTurnOffs.includes("Entitlement"), true);
  assert.equal(
    dominantPraise.sensoryTurnOffs.includes("Overly aggressive touch"),
    true,
  );

  assert.equal(slowBurn.dynamicHardlines, "No_Rushed_Pacing");
  assert.equal(slowBurn.behavioralTurnOffs.includes("Desperation"), true);

  assert.equal(generated.turnOffs?.dynamicHardlines, "No_Rushed_Pacing");
  assert.equal(
    generated.turnOffs?.aiReactionPrompt.includes("slow down"),
    true,
  );
});

test("routes scenario metadata from trope occupation and taboo context", () => {
  const forcedProximity = generateScenarioData("Forced Proximity");
  const academicRivals = generateAgeGapRomance("Academic_Rivals", {
    random: () => 0,
    speciesType: "Human",
  });
  const darkRomance = generateAgeGapRomance("Dark Romance", {
    random: () => 0,
    speciesType: "Human",
  });
  const custom = generateAgeGapRomance("Generated Preview", {
    random: () => 0,
    scenario: {
      plotHook: "The_Crisis",
      scenePremiseDescription:
        "{{char}} and {{user}} are stranded in a coastal estate during a blackout.",
      sensoryDetails: ["Salt air", "Cold marble", "Distant thunder"],
      settingType: "Contained_Insular",
      startingTension: "Vulnerable_Exhausted",
    },
  });

  assert.equal(forcedProximity.settingType, "Contained_Insular");
  assert.equal(forcedProximity.plotHook, "The_Crisis");
  assert.equal(forcedProximity.startingTension, "Charged_Electric");
  assert.equal(academicRivals.scenario?.settingType, "Corporate_Institutional");
  assert.equal(academicRivals.scenario?.plotHook, "The_Mandate");
  assert.equal(academicRivals.scenario?.startingTension, "Combative_Friction");
  assert.equal(darkRomance.scenario?.plotHook, "The_Secret_Transaction");
  assert.equal(darkRomance.scenario?.settingType, "Atmospheric_Wilderness");
  assert.equal(custom.scenario?.scenePremiseDescription.includes("coastal estate"), true);
  assert.equal(custom.scenario?.startingTension, "Vulnerable_Exhausted");
});

test("compiles full character and scenario data into a system prompt", () => {
  const generated = generateAgeGapRomance("Workplace Romance", {
    occupationSocioeconomicTier: "Ultra_Elite",
    random: () => 0,
    speciesType: "Human",
  });
  const systemPrompt = compileSystemPrompt(generated);

  assert.equal(systemPrompt.includes("NAME: {{char}}"), true);
  assert.equal(systemPrompt.includes("PARTNER: {{user}}"), true);
  assert.equal(systemPrompt.includes("CURRENT ACTIVE SCENARIO"), true);
  assert.equal(systemPrompt.includes("Soft hum of a server rack"), true);
  assert.equal(systemPrompt.includes("Never, under any circumstances"), true);
  assert.equal(systemPrompt.includes("No fetish focus is active"), false);
  assert.equal(systemPrompt.includes("corporate risk"), true);
});

test("routes first message presentation metadata from scenario and style", () => {
  const forcedProximity = generateAgeGapRomance("Forced Proximity", {
    random: () => 0,
    speciesType: "Human",
  });
  const enemies = generateAgeGapRomance("Enemies to Lovers", {
    random: () => 0,
    speciesType: "Werewolf",
  });
  const custom = generateAgeGapRomance("Generated Preview", {
    firstMessage: {
      aiOutputConstraint:
        "Output exactly three paragraphs and end with a direct challenge to {{user}}.",
      entryPoint: "Mid_Action_Dialogue",
      literaryStyle: "Chat_Symphonic",
      tokenLengthCap: 360,
      userCallToAction: "Direct_Question",
    },
    random: () => 0,
  });
  const direct = generateFirstMessageData("Generated Preview", {
    plotHook: "The_Chance_Encounter",
    scenePremiseDescription: "{{char}} and {{user}} collide.",
    sensoryDetails: ["A sharp sound"],
    settingType: "Public_HighExposure",
    startingTension: "Charged_Electric",
  });

  assert.equal(forcedProximity.firstMessage?.entryPoint, "Post_Crisis_Quiet");
  assert.equal(
    forcedProximity.firstMessage?.userCallToAction,
    "Vulnerable_Slip",
  );
  assert.equal(enemies.firstMessage?.literaryStyle, "Internal_Monologue_Heavy");
  assert.equal(enemies.firstMessage?.tokenLengthCap, 520);
  assert.equal(custom.firstMessage?.literaryStyle, "Chat_Symphonic");
  assert.equal(
    custom.firstMessage?.aiOutputConstraint.includes("three paragraphs"),
    true,
  );
  assert.equal(direct.entryPoint, "Active_Collision");
  assert.equal(
    direct.aiOutputConstraint.includes("Write only the character's first message"),
    true,
  );
});

test("includes first message execution rules in compiled prompts", () => {
  const generated = generateAgeGapRomance("Forced Proximity", {
    random: () => 0,
    speciesType: "Human",
  });
  const systemPrompt = compileSystemPrompt(generated);

  assert.equal(systemPrompt.includes("FIRST MESSAGE EXECUTION ARRAY"), true);
  assert.equal(systemPrompt.includes("ENTRY POINT: Post Crisis Quiet"), true);
  assert.equal(systemPrompt.includes("TOKEN LENGTH CAP"), true);
  assert.equal(
    systemPrompt.includes("Write only the character's first message"),
    true,
  );
  assert.equal(
    systemPrompt.includes("strictly forbidden from writing or completing actions for {{user}}"),
    true,
  );
});

test("normalizes alternate greeting fork metadata and caps arrays", () => {
  const base = generateAgeGapRomance("Workplace Billionaire", {
    random: () => 0,
    speciesType: "Human",
  });
  const generatedFork = generateAlternateGreetingData(base, {
    aiGenerationDirective:
      "Generate a Universe AU greeting where {{char}} is a Vampire Lord and {{user}} is a political captive.",
    associatedTrope: "Dark Fantasy AU",
    forkType: "Universe_AU",
  });
  const defaults = generateDefaultAlternateGreetingForks(base);
  const capped = generateAgeGapRomance("Generated Preview", {
    alternateGreetings: [
      generatedFork,
      ...defaults,
      ...defaults.map((fork, index) => ({
        ...fork,
        greetingId: `${index + 4}4444444-0000-4000-8000-000000000000`,
      })),
    ],
    random: () => 0,
  });

  assert.equal(generatedFork.greetingId.includes("-4000-8000-"), true);
  assert.equal(generatedFork.completedGreeting.includes("Vampire Lord"), true);
  assert.equal(defaults.length, 3);
  assert.equal(defaults[0].forkType, "Timeline_Shift");
  assert.equal(capped.alternateGreetings?.length, 5);
});

test("includes alternate greeting fork directives in compiled prompts", () => {
  const base = generateAgeGapRomance("Generated Preview", {
    alternateGreetings: [
      {
        aiGenerationDirective:
          "Generate a breakup AU where {{char}} and {{user}} have just separated after a major betrayal.",
        associatedTrope: "Breakup / AU Friction",
        completedGreeting:
          "{{char}} stands in the hallway with the key still in his palm.",
        forkType: "Canon_Divergence",
        greetingId: "aaaaaaaa-0000-4000-8000-000000000000",
      },
    ],
    random: () => 0,
  });
  const systemPrompt = compileSystemPrompt(base);

  assert.equal(systemPrompt.includes("ALTERNATE GREETING FORKS"), true);
  assert.equal(systemPrompt.includes("Breakup / AU Friction"), true);
  assert.equal(systemPrompt.includes("Generate no more than five"), true);
});

test("normalizes group greeting room metadata and caps arrays", () => {
  const base = generateAgeGapRomance("Generated Preview", {
    relationships: [
      {
        connectionType: "Found_Family",
        emotionalStatus: "Devoted_Loyal",
        npcName: "Alistair Sterling",
        oneLineDescription: "A loyal friend who reads the room too quickly.",
        romanceFunction: "The_Matchmaker",
      },
    ],
    random: () => 0,
  });
  const generatedRoom = generateGroupGreetingData(base, {
    aiGroupDirective:
      "Generate a group greeting where Cole and Alistair are mid-argument in the office when {{user}} enters.",
    formattingStyle: "Explicit_Name_Tags",
    interpersonalDynamic: "Love_Triangle_Rivalry",
    participatingCharacters: ["Cole Vance", "Alistair Sterling"],
    spotlightDistribution: "Duo_Synergy",
  });
  const defaults = generateDefaultGroupGreetingSet(base);
  const capped = generateAgeGapRomance("Generated Preview", {
    groupGreetings: [
      generatedRoom,
      ...defaults,
      ...defaults.map((room, index) => ({
        ...room,
        greetingId: `${index + 6}6666666-1111-4000-8000-000000000000`,
      })),
      {
        ...generatedRoom,
        greetingId: "99999999-1111-4000-8000-000000000000",
      },
    ],
    random: () => 0,
  });

  assert.equal(generatedRoom.greetingId.includes("-1111-4000-"), true);
  assert.equal(generatedRoom.completedGreeting.includes("Cole Vance"), true);
  assert.equal(defaults.length, 2);
  assert.equal(defaults[0].spotlightDistribution, "Leader_Alpha");
  assert.equal(defaults[0].participatingCharacters[1], "Alistair Sterling");
  assert.equal(capped.groupGreetings?.length, 5);
});

test("includes group greeting room directives in compiled prompts", () => {
  const base = generateAgeGapRomance("Generated Preview", {
    groupGreetings: [
      {
        aiGroupDirective:
          "Generate an opening scene where Cole speaks first while Alistair reacts defensively as {{user}} enters.",
        completedGreeting:
          "**Cole Vance:** \"Sit down.\"\n\nAlistair folds his arms by the door.",
        formattingStyle: "Explicit_Name_Tags",
        greetingId: "bbbbbbbb-1111-4000-8000-000000000000",
        interpersonalDynamic: "Wingman_Loop",
        participatingCharacters: ["Cole Vance", "Alistair Sterling"],
        spotlightDistribution: "Leader_Alpha",
      },
    ],
    random: () => 0,
  });
  const systemPrompt = compileSystemPrompt(base);

  assert.equal(systemPrompt.includes("GROUP GREETING ROOMS"), true);
  assert.equal(systemPrompt.includes("Cole Vance, Alistair Sterling"), true);
  assert.equal(systemPrompt.includes("dialogue attribution"), true);
});

test("normalizes group alternate greeting fork metadata and caps arrays", () => {
  const base = generateAgeGapRomance("Generated Preview", {
    relationships: [
      {
        connectionType: "Professional_Circle",
        emotionalStatus: "Strained_Fractured",
        npcName: "Roxie Knight",
        oneLineDescription: "A fixer with divided loyalty.",
        romanceFunction: "The_Secret_Keeper",
      },
    ],
    random: () => 0,
  });
  const generatedFork = generateGroupAlternateGreetingData(base, {
    aiMultiCharacterPrompt:
      "Generate a group alternate greeting where the corporate cast is re-skinned as an underworld crew interrogating {{user}} in a warehouse backroom.",
    forkCategory: "Collective_AU",
    includedNpcNames: ["Cole Vance", "Roxie Knight"],
    targetSettingVibe: "Gritty Safehouse",
  });
  const defaults = generateDefaultGroupAlternateGreetingForks(base);
  const capped = generateAgeGapRomance("Generated Preview", {
    groupAlternateGreetings: [
      generatedFork,
      ...defaults,
      ...defaults.map((fork, index) => ({
        ...fork,
        altGreetingId: `${index + 8}8888888-2222-4000-8000-000000000000`,
      })),
      {
        ...generatedFork,
        altGreetingId: "eeeeeeee-2222-4000-8000-000000000000",
      },
    ],
    random: () => 0,
  });

  assert.equal(generatedFork.altGreetingId.includes("-2222-4000-"), true);
  assert.equal(generatedFork.completedGreeting.includes("Gritty Safehouse"), true);
  assert.equal(defaults.length, 2);
  assert.equal(defaults[0].forkCategory, "Team_Loyalty_Shift");
  assert.equal(defaults[0].includedNpcNames[1], "Roxie Knight");
  assert.equal(capped.groupAlternateGreetings?.length, 5);
});

test("includes group alternate greeting fork directives in compiled prompts", () => {
  const base = generateAgeGapRomance("Generated Preview", {
    groupAlternateGreetings: [
      {
        aiMultiCharacterPrompt:
          "Generate a period court intrigue fork where the whole cast confronts {{user}} over a broken engagement contract.",
        altGreetingId: "cccccccc-2222-4000-8000-000000000000",
        completedGreeting:
          "The ballroom stills as every member of the family turns toward {{user}}.",
        forkCategory: "Collective_AU",
        includedNpcNames: ["Cole Vance", "Alistair Sterling"],
        targetSettingVibe: "Regency Ballroom",
      },
    ],
    random: () => 0,
  });
  const systemPrompt = compileSystemPrompt(base);

  assert.equal(systemPrompt.includes("GROUP ALTERNATE GREETING FORKS"), true);
  assert.equal(systemPrompt.includes("Regency Ballroom"), true);
  assert.equal(systemPrompt.includes("Collective AU"), true);
});

test("normalizes linked scenario opening pairs and caps arrays", () => {
  const base = generateAgeGapRomance("Generated Preview", {
    random: () => 0,
    speciesType: "Human",
  });
  const generatedPair = generateScenarioOpeningPairData(base, "Status_Valve");
  const compiledPair = generateScenarioOpeningPair(
    base,
    "Environmental_Anchor",
  );
  const defaults = generateDefaultScenarioOpeningPairs(base);
  const capped = generateAgeGapRomance("Generated Preview", {
    random: () => 0,
    scenarioOpeningPairs: [
      generatedPair,
      ...defaults,
      ...defaults.map((pair, index) => ({
        ...pair,
        pairId: `${index + 9}9999999-3333-4000-8000-000000000000`,
      })),
    ],
  });

  assert.equal(generatedPair.pairId.includes("-3333-4000-"), true);
  assert.equal(generatedPair.classificationType, "Status_Valve");
  assert.equal(generatedPair.pairTitle, "Aftermath of the Betrayal");
  assert.equal(
    generatedPair.alternateScenarioContext.settingType,
    "Contained_Insular",
  );
  assert.equal(compiledPair.pairTitle, "Blizzard Cabin Refuge");
  assert.equal(defaults.length, 3);
  assert.equal(defaults[1].classificationType, "Timeline_Link");
  assert.equal(capped.scenarioOpeningPairs?.length, 5);
});

test("includes linked scenario opening pairs in compiled prompts", () => {
  const base = generateAgeGapRomance("Generated Preview", {
    random: () => 0,
    scenarioOpeningPairs: [
      {
        alternateFirstMessage:
          "*{{char}} keeps one hand braced on the locked safehouse door.*",
        alternateScenarioContext: {
          plotHook: "The_Secret_Transaction",
          scenePremiseDescription:
            "{{char}} and {{user}} are trapped inside an underworld backroom after a deal goes wrong.",
          sensoryDetails: ["Stale smoke", "Rainwater on concrete"],
          settingType: "Contained_Insular",
          startingTension: "Combative_Friction",
        },
        classificationType: "Environmental_Anchor",
        pairId: "dddddddd-3333-4000-8000-000000000000",
        pairTitle: "Underworld Safehouse Lock-In",
      },
    ],
  });
  const systemPrompt = compileSystemPrompt(base);

  assert.equal(
    systemPrompt.includes("LINKED ALTERNATE SCENARIO OPENING PAIRS"),
    true,
  );
  assert.equal(systemPrompt.includes("Underworld Safehouse Lock-In"), true);
  assert.equal(systemPrompt.includes("inseparable"), true);
  assert.equal(systemPrompt.includes("Rainwater on concrete"), true);
});

test("generates compressed lorebook summaries from character context", () => {
  const supernatural = generateAgeGapRomance("Dark Romance", {
    random: () => 0,
    speciesType: "Vampire",
  });
  const corporate = generateAgeGapRomance("Billionaire CEO Office Romance", {
    random: () => 0,
    speciesType: "Human",
  });
  const direct = generateLorebookSummaryData(
    "Academic Rivals",
    corporate.species!,
    {
      academicYear: "Senior",
      authorityDynamic: "Equal",
      campusAffiliation: "Debate Society",
      fundingType: "Scholarship",
      jobTitle: "University Student",
      kind: "student",
      majorField: "Humanities_Law",
      workplaceVibe: "Old campus library",
    },
    [],
  );

  assert.equal(supernatural.lorebookSummary?.universeAnchor, "Modern Dark Fantasy Hidden World");
  assert.equal(
    supernatural.lorebookSummary?.worldSystemRules.some((rule) =>
      rule.includes("Vampire"),
    ),
    true,
  );
  assert.equal(corporate.lorebookSummary?.universeAnchor, "Contemporary Corporate High Society");
  assert.equal(direct.universeAnchor, "Contemporary University Social Field");
  assert.equal(direct.worldSystemRules.length, 3);
});

test("includes lorebook summary in compiled prompts and master payloads", () => {
  const base = generateAgeGapRomance("Generated Preview", {
    lorebookSummary: {
      aiLoreInstruction:
        "Maintain strict dark-fantasy suspicion around {{char}} without adding exposition.",
      factionOrDynastyContext:
        "The Volkov family is fighting a quiet turf war under corporate cover.",
      tokenOptimizationCap: 150,
      universeAnchor: "Neo-London Dark Corporate Coven",
      worldSystemRules: [
        "Magic requires equal exchange.",
        "The Corporate Syndicate controls local law enforcement.",
      ],
    },
    random: () => 0,
    scenarioOpeningPairs: generateDefaultScenarioOpeningPairs(
      generateAgeGapRomance("Generated Preview", { random: () => 0 }),
    ),
  });
  const systemPrompt = compileSystemPrompt(base);
  const masterPayload = createMasterCharacterCardPayload(base);
  const masterJson = compileMasterJsonPayload(base);

  assert.equal(systemPrompt.includes("LOREBOOK SUMMARY"), true);
  assert.equal(systemPrompt.includes("Neo-London Dark Corporate Coven"), true);
  assert.equal(masterPayload.metadata.lorebook_summary?.tokenOptimizationCap, 150);
  assert.equal(masterPayload.alt_greetings.length, 3);
  assert.equal(masterJson.includes("linked_pairs"), true);
});

test("generates human-facing creator notes and exports them to card metadata", () => {
  const dark = generateAgeGapRomance("Dark Romance", {
    random: () => 0,
    speciesType: "Vampire",
  });
  const direct = generateCreatorsNotesData(
    "Grumpy Sunshine",
    generateKinkData("Grumpy Sunshine", "Human", "Superior"),
    generateFetishData("Generated Preview", "Human"),
    dark.lorebookSummary!,
  );
  const exported = createGeneratedCharacterCardPayload(dark, "Hello.");
  const masterPayload = createMasterCharacterCardPayload(dark);

  assert.equal(dark.creatorsNotes?.contentRating, "Dark_Romance_Heavy");
  assert.equal(
    dark.creatorsNotes?.recommendedModels.every((model) =>
      model.startsWith("YOUR_API"),
    ),
    true,
  );
  assert.equal(
    dark.creatorsNotes?.triggerWarnings.includes("Dark romance tension"),
    true,
  );
  assert.equal(direct.contentRating, "M_Rated_Sensory");
  assert.match(exported.data.creator_notes, /CREATOR NOTES \/ READ ME/);
  assert.match(exported.data.creator_notes, /YOUR_API/);
  assert.equal(
    exported.data.extensions.amourai &&
      typeof exported.data.extensions.amourai === "object" &&
      "creators_notes" in exported.data.extensions.amourai,
    true,
  );
  assert.equal(masterPayload.metadata.creators_notes?.contentRating, "Dark_Romance_Heavy");
});

test("generates post-history runtime instructions and exports injection text", () => {
  const slowBurn = generateAgeGapRomance("Enemies to Lovers Slow Burn", {
    random: () => 0,
    speciesType: "Human",
  });
  const direct = generatePostHistoryInstructionsData(
    "Hurt Comfort",
    slowBurn.turnOffs!,
    generateIntimacyStyleData("Hurt Comfort"),
    slowBurn.lorebookSummary!,
  );
  const exported = createGeneratedCharacterCardPayload(slowBurn, "Hello.");
  const masterPayload = createMasterCharacterCardPayload(slowBurn);

  assert.equal(slowBurn.postHistoryInstructions?.injectionTokenWeight, 50);
  assert.equal(
    slowBurn.postHistoryInstructions?.driftControlRules.some((rule) =>
      rule.includes("slow-burn resistance"),
    ),
    true,
  );
  assert.equal(
    slowBurn.postHistoryInstructions?.driftControlRules.some((rule) =>
      rule.includes("Do not suppress high-heat physical escalation"),
    ),
    true,
  );
  assert.equal(
    slowBurn.postHistoryInstructions?.driftControlRules.some((rule) =>
      rule.includes("continuity, character logic, and the established dynamic"),
    ),
    true,
  );
  assert.equal(
    slowBurn.postHistoryInstructions?.formattingHardlines.some((rule) =>
      rule.includes("Never write"),
    ),
    true,
  );
  assert.equal(
    slowBurn.postHistoryInstructions?.formattingHardlines.some((rule) =>
      rule.includes("immersive, character-driven roleplay with {{user}}"),
    ),
    true,
  );
  assert.equal(
    slowBurn.postHistoryInstructions?.formattingHardlines.some((rule) =>
      rule.includes("cannot hear, know, answer, or react"),
    ),
    true,
  );
  assert.equal(
    slowBurn.postHistoryInstructions?.formattingHardlines.some((rule) =>
      rule.includes("Only reference {{user}} through explicitly provided dialogue, visible actions, and directly observable presence"),
    ),
    true,
  );
  assert.equal(
    slowBurn.postHistoryInstructions?.formattingHardlines.some((rule) =>
      rule.includes("not physically with {{user}}"),
    ),
    true,
  );
  assert.equal(
    slowBurn.postHistoryInstructions?.formattingHardlines.some((rule) =>
      rule.includes("own life, routine, friends, goals, and motivations"),
    ),
    true,
  );
  assert.equal(
    slowBurn.postHistoryInstructions?.formattingHardlines.some((rule) =>
      rule.includes("Standard Prose Format"),
    ),
    true,
  );
  assert.equal(
    slowBurn.postHistoryInstructions?.formattingHardlines.some((rule) =>
      rule.includes("new paragraph whenever a different character speaks"),
    ),
    true,
  );
  assert.equal(
    slowBurn.postHistoryInstructions?.formattingHardlines.some((rule) =>
      rule.includes("Do not output APP: or USER: labels"),
    ),
    true,
  );
  assert.equal(
    slowBurn.postHistoryInstructions?.formattingHardlines.some((rule) =>
      rule.includes("perception and immediate inference"),
    ),
    true,
  );
  assert.equal(
    slowBurn.postHistoryInstructions?.formattingHardlines.some((rule) =>
      rule.includes("Show uncertainty as interpretation, not fact"),
    ),
    true,
  );
  assert.equal(
    slowBurn.postHistoryInstructions?.formattingHardlines.some((rule) =>
      rule.includes("continuity of space, timing, and prior actions"),
    ),
    true,
  );
  assert.equal(
    slowBurn.postHistoryInstructions?.formattingHardlines.some((rule) =>
      rule.includes("Write exactly one reply only"),
    ),
    true,
  );
  assert.equal(
    slowBurn.postHistoryInstructions?.formattingHardlines.some((rule) =>
      rule.includes("Stop immediately before {{user}} would need to respond"),
    ),
    true,
  );
  assert.equal(
    slowBurn.postHistoryInstructions?.formattingHardlines.some((rule) =>
      rule.includes("Do not quote, paraphrase, mirror, or lightly restyle"),
    ),
    true,
  );
  assert.equal(
    slowBurn.postHistoryInstructions?.formattingHardlines.some((rule) =>
      rule.includes("key noun, verb, adjective, gesture, or line pattern"),
    ),
    true,
  );
  assert.equal(
    direct.dynamicToneModifiers.some((modifier) =>
      modifier.includes("hidden caregiving"),
    ),
    true,
  );
  assert.match(
    exported.data.post_history_instructions,
    /POST-HISTORY RUNTIME OVERRIDES/,
  );
  assert.match(exported.data.post_history_instructions, /Never write/);
  assert.equal(
    exported.data.extensions.amourai &&
      typeof exported.data.extensions.amourai === "object" &&
      "post_history_instructions_generation" in exported.data.extensions.amourai,
    true,
  );
  assert.equal(
    masterPayload.metadata.post_history_instructions?.injectionTokenWeight,
    50,
  );
});

test("appends post-history override as the final hidden chat system message", () => {
  const postHistory = generateAgeGapRomance("Enemies to Lovers Slow Burn", {
    random: () => 0,
    speciesType: "Human",
  }).postHistoryInstructions!;
  const override = createPostHistoryOverride(postHistory);
  const optimizedMessages = appendPostHistoryOverride(
    [{ role: "user", content: "I step into the room." }],
    postHistory,
  );

  assert.match(override, /POST-HISTORY EXECUTION OVERRIDE/);
  assert.match(override, /CURRENT CHARACTER INTENT/);
  assert.match(override, /CONDITIONAL RESPONSE SHIFT/);
  assert.match(override, /HARD ARCHITECTURAL LIMITS/);
  assert.match(override, /Write \{\{char\}\}'s next reply in an immersive, character-driven roleplay with \{\{user\}\}/);
  assert.match(override, /exactly one reply/);
  assert.match(override, /Never write thoughts, actions, decisions, or dialogue for \{\{user\}\}/);
  assert.match(override, /Do not write or simulate \{\{user\}\} under any circumstances/);
  assert.match(override, /Stop immediately before \{\{user\}\} would need to respond, narrate, make a choice, or speak/);
  assert.match(override, /Show uncertainty as interpretation, not fact/);
  assert.match(override, /continuity of space, timing, and prior actions/);
  assert.match(override, /cannot hear, know, answer, or react to \{\{user\}\}'s internal thoughts/);
  assert.match(override, /Only reference \{\{user\}\} through explicitly provided dialogue, visible actions, and directly observable presence/);
  assert.match(override, /\{\{user\}\} behavior aligned with their persona and lorebook-defined patterns without inventing unobserved reactions/);
  assert.match(override, /not physically with \{\{user\}\}/);
  assert.match(override, /own life, routine, friends, goals, and motivations outside of \{\{user\}\}/);
  assert.match(override, /Do not quote, paraphrase, mirror, or lightly restyle \{\{user\}\}'s previous message/);
  assert.match(override, /key noun, verb, adjective, gesture, or line pattern/);
  assert.equal(optimizedMessages.length, 2);
  assert.equal(optimizedMessages[1].role, "system");
  assert.equal(optimizedMessages[1].content, override);
});

test("generates and resolves world lore placeholders without bloating card text", () => {
  const vampire = generateAgeGapRomance("Dark Romance Mafia", {
    occupationProfessionalDomain: "Underworld",
    random: () => 0,
    speciesType: "Vampire",
  });
  const generatedPlaceholders = generateWorldLorePlaceholders(
    "Dark Romance Mafia",
    vampire.species!,
    vampire.occupation!,
    vampire.lorebookSummary!,
  );
  const resolved = resolveWorldPlaceholders(
    vampire,
    "Setting: {{world_setting}}\nSpecies: {{species_status}}\nLaw: {{law_system}}\nSecret: {{taboo_history}}",
  );
  const directResolved = resolveDescriptionWorldPlaceholders(
    "HQ: {{faction_hq}}",
    generatedPlaceholders,
  );
  const exported = createGeneratedCharacterCardPayload(vampire, "Hello.");
  const masterPayload = createMasterCharacterCardPayload(vampire);

  assert.equal(vampire.worldLorePlaceholders?.length, 9);
  assert.equal(
    vampire.worldLorePlaceholders?.some(
      (placeholder) => placeholder.variableKey === "{{species_status}}",
    ),
    true,
  );
  assert.doesNotMatch(resolved, /\{\{world_setting\}\}/);
  assert.match(resolved, /Vampire status/);
  assert.match(directResolved, /safehouse/);
  assert.doesNotMatch(exported.data.description, /\{\{law_system\}\}/);
  assert.equal(
    exported.data.extensions.amourai &&
      typeof exported.data.extensions.amourai === "object" &&
      "world_lore_placeholder" in exported.data.extensions.amourai,
    true,
  );
  assert.equal(masterPayload.metadata.world_lore_placeholders?.length, 9);
});

test("generates keyed lore entries and injects active lore on chat triggers", () => {
  const vampire = generateAgeGapRomance("Dark Romance Mafia", {
    occupationProfessionalDomain: "Underworld",
    random: () => 0,
    speciesType: "Vampire",
  });
  const generatedLoreEntries = generateLoreEntriesData(
    "Dark Romance Mafia",
    vampire.species!,
    vampire.occupation!,
    vampire.relationships!,
    vampire.lorebookSummary!,
    vampire.worldLorePlaceholders!,
  );
  const activeLoreMessages = parseActiveLore(
    "The coven mentioned a blood bond inside the syndicate safehouse.",
    vampire.loreEntries!,
  );
  const exported = createGeneratedCharacterCardPayload(vampire, "Hello.");
  const masterPayload = createMasterCharacterCardPayload(vampire);

  assert.equal(vampire.loreEntries?.length, 4);
  assert.equal(generatedLoreEntries.length, 4);
  assert.equal(
    vampire.loreEntries?.some((entry) =>
      entry.activationKeys.includes("blood bond"),
    ),
    true,
  );
  assert.equal(
    vampire.loreEntries?.some((entry) =>
      entry.activationKeys.includes("syndicate"),
    ),
    true,
  );
  assert.equal(activeLoreMessages[0]?.role, "system");
  assert.match(activeLoreMessages[0]?.content ?? "", /LOREBOOK ACTIVATION/);
  assert.equal(exported.data.character_book?.entries.length, 4);
  assert.equal(
    exported.data.extensions.amourai &&
      typeof exported.data.extensions.amourai === "object" &&
      "lore_entries" in exported.data.extensions.amourai,
    true,
  );
  assert.equal(masterPayload.metadata.lore_entries?.length, 4);
});

test("generates framework config and serializes by target specification", () => {
  const generated = generateAgeGapRomance("Dark Romance Mafia", {
    occupationProfessionalDomain: "Underworld",
    random: () => 0,
    speciesType: "Vampire",
  });
  const framework = generateFrameworkConfigurationData(
    "Dark Romance Mafia",
    generated.lorebookSummary!,
    generated.firstMessage!,
  );
  const payload = createFrameworkSerializablePayload(generated, "Hello.");
  const v2Serialized = createSerializedCardString(payload, {
    ...framework,
    targetSpecification: "V2_Card_Standard",
  });
  const agnosticSerialized = createSerializedCardString(payload, {
    ...framework,
    targetSpecification: "Raw_Agnostic_JSON",
  });
  const exported = createGeneratedCharacterCardPayload(generated, "Hello.");
  const prompt = compileSystemPrompt(generated);

  assert.equal(generated.framework?.targetSpecification, "V3_Card_Layout");
  assert.equal(framework.injectionPipelineRouter, "Dynamic_Variable_Loop");
  assert.match(v2Serialized, /"spec": "chara_card_v2"/);
  assert.match(agnosticSerialized, /"framework"/);
  assert.match(prompt, /FRAMEWORK CONFIGURATION/);
  assert.equal(
    exported.data.extensions.amourai &&
      typeof exported.data.extensions.amourai === "object" &&
      "framework" in exported.data.extensions.amourai,
    true,
  );
});

test("generates formatting config and exports strict render rules", () => {
  const generated = generateAgeGapRomance("Enemies to Lovers Dark Romance", {
    occupationJobTitle: "Cybersecurity Analyst",
    occupationProfessionalDomain: "Corporate_Finance",
    random: () => 0,
  });
  const formatting = generateFormattingConfigurationData(
    "Enemies to Lovers Dark Romance",
    generated.occupation!,
    generated.firstMessage!,
  );
  const exported = createGeneratedCharacterCardPayload(generated, "Hello.");
  const masterPayload = createMasterCharacterCardPayload(generated);
  const prompt = compileSystemPrompt(generated);

  assert.equal(generated.formatting?.narrativePerspective, "Third_Person_Past");
  assert.equal(generated.formatting?.actionWrappingStandard, "Quote_Isolated_Prose");
  assert.equal(formatting.markdownEmphasisStyle, "Code_Block_Shielding");
  assert.match(
    formatting.formattingSystemPromptInjection,
    /Standard Prose Format/,
  );
  assert.match(
    formatting.formattingSystemPromptInjection,
    /dialogue in double quotation marks/,
  );
  assert.match(
    formatting.formattingSystemPromptInjection,
    /new paragraph whenever a different character speaks/,
  );
  assert.match(
    formatting.formattingSystemPromptInjection,
    /do not output APP: or USER: labels/i,
  );
  assert.match(formatting.formattingSystemPromptInjection, /Formatting:/);
  assert.match(
    formatting.formattingSystemPromptInjection,
    /dialogue as \{\{char\}\} speaking in first-person present tense/,
  );
  assert.match(prompt, /FORMATTING CONFIGURATION/);
  assert.match(prompt, /Narrative must be written in third-person past tense/);
  assert.match(prompt, /spoken dialogue must be written as \{\{char\}\} speaking in first-person present tense/);
  assert.match(prompt, /Use Standard Prose Format/);
  assert.match(prompt, /dialogue in double quotation marks/);
  assert.match(prompt, /actions, body language, reactions, narration, and brief internal thoughts woven into prose paragraphs/);
  assert.match(prompt, /new paragraph whenever a different character speaks/);
  assert.match(prompt, /Do not output APP: or USER: labels/);
  assert.equal(masterPayload.metadata.formatting?.maxParagraphsPerTurn, 4);
  assert.match(masterPayload.description, /Perspective Lock/);
  assert.match(exported.data.description, /Perspective Lock/);
  assert.equal(
    exported.data.extensions.amourai &&
      typeof exported.data.extensions.amourai === "object" &&
      "formatting" in exported.data.extensions.amourai,
    true,
  );
});

test("generates tone config and exports narrative atmosphere rules", () => {
  const vampire = generateAgeGapRomance("Dark Romance", {
    occupationProfessionalDomain: "Underworld",
    random: () => 0,
    speciesType: "Vampire",
  });
  const wholesome = generateAgeGapRomance("Friends to Lovers Small Town", {
    random: () => 0,
    speciesType: "Human",
  });
  const tone = generateToneConfigurationData(
    "Dark Romance",
    vampire.species!,
    vampire.occupation!,
  );
  const exported = createGeneratedCharacterCardPayload(vampire, "Hello.");
  const masterPayload = createMasterCharacterCardPayload(vampire);
  const prompt = compileSystemPrompt(vampire);

  assert.equal(vampire.tone?.proseTexture, "Gritty_Melodramatic");
  assert.equal(vampire.tone?.pacingVelocity, "Slow_Tease_Prose");
  assert.equal(tone.worldviewFilter, "Ruthless_Cynical");
  assert.deepEqual(wholesome.tone?.aiVocabularyDirectives.slice(0, 2), [
    "soft",
    "warmth",
  ]);
  assert.match(tone.toneSystemPromptInjection, /Narrative tone/);
  assert.match(prompt, /TONE CONFIGURATION/);
  assert.equal(masterPayload.metadata.tone?.worldviewFilter, "Ruthless_Cynical");
  assert.equal(
    exported.data.extensions.amourai &&
      typeof exported.data.extensions.amourai === "object" &&
      "tone" in exported.data.extensions.amourai,
    true,
  );
});

test("generates archetype config and cross-links intimacy behavior", () => {
  const grumpy = generateAgeGapRomance("Grumpy Sunshine", {
    random: () => 0,
    speciesType: "Human",
  });
  const fakeDating = generateAgeGapRomance("Fake Dating Banter", {
    random: () => 0,
    speciesType: "Human",
  });
  const archetype = generateArchetypeConfigurationData(
    "Grumpy Sunshine",
    grumpy.species!,
    grumpy.occupation!,
  );
  const exported = createGeneratedCharacterCardPayload(grumpy, "Hello.");
  const masterPayload = createMasterCharacterCardPayload(grumpy);
  const prompt = compileSystemPrompt(grumpy);

  assert.equal(grumpy.archetype?.personaType, "The_Stoic_Wall");
  assert.equal(grumpy.archetype?.defenseMechanism, "Silent_Withdrawal");
  assert.equal(archetype.coreMotivation, "Security_Protection");
  assert.equal(grumpy.intimacyStyle?.expressionType, "Stoic_Restrained");
  assert.equal(fakeDating.archetype?.personaType, "The_Rogue_Instigator");
  assert.equal(fakeDating.intimacyStyle?.expressionType, "Playful_Teasing");
  assert.match(prompt, /ARCHETYPE CONFIGURATION/);
  assert.equal(masterPayload.metadata.archetype?.personaType, "The_Stoic_Wall");
  assert.equal(
    exported.data.extensions.amourai &&
      typeof exported.data.extensions.amourai === "object" &&
      "archetype" in exported.data.extensions.amourai,
    true,
  );
});

test("generates speech style and example macros for card voice", () => {
  const darkRomance = generateAgeGapRomance("Dark Romance Arranged Marriage", {
    occupationProfessionalDomain: "Underworld",
    occupationSocioeconomicTier: "Shadow_Economy",
    random: () => 0,
  });
  const academic = generateAgeGapRomance("Academic Rivals", {
    occupationJobTitle: "University Student",
    random: () => 0,
  });
  const speechStyle = generateSpeechStyleData(
    "Academic Rivals",
    academic.archetype!,
    academic.occupation!,
    academic.tone!,
  );
  const speechExamples = generateSpeechExamplesData(
    speechStyle,
    academic.archetype!,
    academic.relationshipStatus!,
    "Academic Rivals",
  );
  const dialogueArrays = generateDialogueArrayData(
    "Dark Romance Arranged Marriage",
    darkRomance.archetype!,
    darkRomance.occupation!,
    darkRomance.species!,
    darkRomance.speechStyle!,
  );
  const proseGuidance = generateProseGuidanceData(
    "Dark Romance Arranged Marriage",
    darkRomance.tone!,
    darkRomance.formatting!,
    darkRomance.scenario!,
  );
  const exported = createGeneratedCharacterCardPayload(darkRomance, "Hello.");
  const masterPayload = createMasterCharacterCardPayload(darkRomance);
  const prompt = compileSystemPrompt(darkRomance);

  assert.equal(darkRomance.speechStyle?.register, "Clipped_Command");
  assert.equal(darkRomance.speechStyle?.pitch, "Baritone");
  assert.equal(darkRomance.speechStyle?.texture, "Raspy");
  assert.equal(darkRomance.speechStyle?.volumeBaseline, "Measured");
  assert.equal(darkRomance.speechStyle?.emotionalDelivery, "Curt");
  assert.equal(darkRomance.speechStyle?.syntaxCadence, "Laconic_Clipped");
  assert.equal(darkRomance.speechStyle?.linguisticFlavor, "Jargon_Infused");
  assert.equal(darkRomance.speechStyle?.vocalRegister, "Muted_Whisper");
  assert.deepEqual(darkRomance.speechStyle?.dialogueTagsWhitelist.slice(0, 2), [
    "murmured",
    "clipped",
  ]);
  assert.deepEqual(darkRomance.speechStyle?.physicalMannerisms, [
    "Space_Invasion",
  ]);
  assert.equal(academic.speechStyle?.register, "Academic_Precise");
  assert.deepEqual(academic.speechStyle?.physicalMannerisms, [
    "Nose_Pinch",
    "Eye_Contact_Avoidance",
  ]);
  assert.equal(speechStyle.vocabularyMode, "Technical_Precise");
  assert.equal(speechStyle.syntaxCadence, "Laconic_Clipped");
  assert.equal(speechStyle.linguisticFlavor, "Jargon_Infused");
  assert.match(speechStyle.speechPatternInstruction, /SPEECH OVERRIDE/);
  assert.match(speechStyle.speechPatternInstruction, /physical voice/);
  assert.match(speechStyle.speechSystemPromptInjection, /DIALOGUE LOCK/);
  assert.equal(speechExamples.length >= 3, true);
  assert.match(speechExamples[0].exampleLine, /\{\{char\}\}:/);
  assert.equal(speechExamples[0].stateLabel, "calm");
  assert.match(prompt, /SPEECH STYLE CONFIGURATION/);
  assert.match(prompt, /PHYSICAL VOICE/);
  assert.match(prompt, /PHYSICAL SPEECH MANNERISMS/);
  assert.match(prompt, /SYNTAX CADENCE/);
  assert.match(prompt, /DIALOGUE TAGS WHITELIST/);
  assert.match(prompt, /SYSTEM DIALOGUE REGULATION FILTER/);
  assert.match(prompt, /BANNED KEYWORDS/);
  assert.match(prompt, /CRITICAL DIALOGUE REALISM/);
  assert.match(prompt, /character-specific and context-aware/);
  assert.match(prompt, /CRITICAL FOR DARK \/ EROTIC TENSION/);
  assert.match(prompt, /ROMANCE PROSE GROUNDING FILTER/);
  assert.match(prompt, /BANNED NARRATION PATTERNS/);
  assert.match(prompt, /VOICE REFERENCES ONLY/);
  assert.equal(
    darkRomance.dialogueArrays?.dontVocabularyBlacklist.includes("smirk"),
    true,
  );
  assert.equal(
    darkRomance.dialogueArrays?.structuralDontRules.includes(
      "Never use exclamation marks in {{char}} dialogue",
    ),
    true,
  );
  assert.equal(dialogueArrays.doVocabularyWhitelist.includes("territory"), true);
  assert.match(dialogueArrays.aiLinguisticConstraintPrompt, /DIALOGUE FILTER/);
  assert.match(
    dialogueArrays.aiLinguisticConstraintPrompt,
    /current goal, relationship history, pressure, and emotional state/,
  );
  assert.match(dialogueArrays.aiLinguisticConstraintPrompt, /pauses, interruptions, evasions/);
  assert.match(dialogueArrays.aiLinguisticConstraintPrompt, /Avoid canned phrasing/);
  assert.equal(dialogueArrays.dontVocabularyBlacklist.includes("as you know"), true);
  assert.match(
    dialogueArrays.aiLinguisticConstraintPrompt,
    /DARK \/ EROTIC TENSION DISCIPLINE/,
  );
  assert.equal(
    darkRomance.dialogueArrays?.structuralDoRules.some((rule) =>
      rule.includes("character-specific and context-aware"),
    ),
    true,
  );
  assert.equal(
    darkRomance.dialogueArrays?.structuralDontRules.some((rule) =>
      rule.includes("canned phrasing"),
    ),
    true,
  );
  assert.equal(
    darkRomance.dialogueArrays?.structuralDoRules.some((rule) =>
      rule.includes("Keep charged dialogue spoken and natural"),
    ),
    true,
  );
  assert.equal(
    darkRomance.dialogueArrays?.structuralDoRules.some((rule) =>
      rule.includes("Integrate dialogue with movement"),
    ),
    true,
  );
  assert.equal(
    darkRomance.proseGuidance?.bannedNarrationPatterns.includes(
      "No one-line dramatic beats outside dialogue",
    ),
    true,
  );
  assert.equal(proseGuidance.sensoryAnchors.includes("dry throat"), true);
  assert.match(proseGuidance.proseConstraintPrompt, /ROMANCE PROSE FILTER/);
  assert.match(proseGuidance.proseConstraintPrompt, /immersive, emotionally intense, dark romantic prose/);
  assert.match(proseGuidance.proseConstraintPrompt, /real novel scene/);
  assert.match(proseGuidance.proseConstraintPrompt, /free of fragmentary, poetic, or abstract affectation/);
  assert.match(proseGuidance.proseConstraintPrompt, /close third-person past tense limited/);
  assert.match(proseGuidance.proseConstraintPrompt, /POV control/);
  assert.match(proseGuidance.proseConstraintPrompt, /directly perceive, physically feel, remember, or reasonably infer/);
  assert.match(proseGuidance.proseConstraintPrompt, /cannot hear, know, answer, or react to \{\{user\}\}'s internal thoughts/);
  assert.match(proseGuidance.proseConstraintPrompt, /do not quote, paraphrase, mirror, or lightly restyle/);
  assert.match(proseGuidance.proseConstraintPrompt, /grounded, vivid, concrete/);
  assert.match(proseGuidance.proseConstraintPrompt, /sensory detail, physicality, gesture, restraint, subtext/);
  assert.match(proseGuidance.proseConstraintPrompt, /Preserve cause and effect/);
  assert.match(proseGuidance.proseConstraintPrompt, /continuity, character logic, established dynamic/);
  assert.match(proseGuidance.proseConstraintPrompt, /goals, priorities, agency, hesitation, contradiction, misreading, restraint, and refusal/);
  assert.match(proseGuidance.proseConstraintPrompt, /own life, routine, friends, goals, and motivations outside of \{\{user\}\}/);
  assert.match(proseGuidance.proseConstraintPrompt, /User boundary/);
  assert.match(proseGuidance.proseConstraintPrompt, /never write \{\{user\}\}'s dialogue, actions, thoughts, feelings, intentions, or decisions/);
  assert.match(proseGuidance.proseConstraintPrompt, /never assume \{\{user\}\}'s reaction/);
  assert.match(proseGuidance.proseConstraintPrompt, /reference \{\{user\}\} only through explicitly provided dialogue, visible actions, and directly observable presence/);
  assert.match(proseGuidance.proseConstraintPrompt, /behavior aligned with their persona and lorebook-defined patterns without inventing unobserved reactions/);
  assert.match(proseGuidance.proseConstraintPrompt, /If \{\{char\}\} is not physically with \{\{user\}\}/);
  assert.match(proseGuidance.proseConstraintPrompt, /World and NPC control/);
  assert.match(proseGuidance.proseConstraintPrompt, /control NPCs, background events, and the environment/);
  assert.match(proseGuidance.proseConstraintPrompt, /NPCs may initiate, delay, refuse, redirect, interrupt, or disengage/);
  assert.match(proseGuidance.proseConstraintPrompt, /Turn rules: write only \{\{char\}\}'s side/);
  assert.match(proseGuidance.proseConstraintPrompt, /end at a natural handoff point before \{\{user\}\}'s response/);
  assert.match(proseGuidance.proseConstraintPrompt, /Melodrama is allowed/);
  assert.match(proseGuidance.proseConstraintPrompt, /embodied interaction/);
  assert.match(proseGuidance.proseConstraintPrompt, /Sensual detail is allowed/);
  assert.match(proseGuidance.proseConstraintPrompt, /skin awareness, breath, heat, pressure, distance, and restraint/);
  assert.match(proseGuidance.proseConstraintPrompt, /Consent and power dynamics handling/);
  assert.match(proseGuidance.proseConstraintPrompt, /clear agency, visible resistance\/hesitation\/consent/);
  assert.match(proseGuidance.proseConstraintPrompt, /Slow-burn high-heat rule/);
  assert.match(proseGuidance.proseConstraintPrompt, /physical and erotic\/NSFW escalation can happen often and quickly/);
  assert.match(proseGuidance.proseConstraintPrompt, /trust, vulnerability, confession, and romantic certainty must develop more slowly than physical heat/);
  assert.match(proseGuidance.proseConstraintPrompt, /Self-correction pass, applied silently before output/);
  assert.match(proseGuidance.proseConstraintPrompt, /strict POV and tense consistency/);
  assert.equal(proseGuidance.sensoryAnchors.includes("skin awareness"), true);
  assert.equal(proseGuidance.sensoryAnchors.includes("restraint"), true);
  assert.equal(
    proseGuidance.groundingInstructions.some((rule) =>
      rule.includes("reads like a real novel scene"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.groundingInstructions.some((rule) =>
      rule.includes("close third-person past tense limited"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.groundingInstructions.some((rule) =>
      rule.includes("NPCs, and world atmosphere only"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.groundingInstructions.some((rule) =>
      rule.includes("directly perceive"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.groundingInstructions.some((rule) =>
      rule.includes("cause and effect"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.groundingInstructions.some((rule) =>
      rule.includes("continuity, character logic, and the established dynamic"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.groundingInstructions.some((rule) =>
      rule.includes("Control NPCs, background events, and the environment"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.groundingInstructions.some((rule) =>
      rule.includes("Earn melodrama through interaction mechanics"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.microActionPrompts.some((rule) =>
      rule.includes("physical positioning"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.microActionPrompts.some((rule) =>
      rule.includes("sensory detail, physicality, gesture, restraint, and subtext"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.groundingInstructions.some((rule) =>
      rule.includes("Anchor every scene in physical space"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.groundingInstructions.some((rule) =>
      rule.includes("coercive tension"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.groundingInstructions.some((rule) =>
      rule.includes("erotic and NSFW physical escalation can happen often and quickly"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.groundingInstructions.some((rule) =>
      rule.includes("Separate physical heat from emotional burn"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.microActionPrompts.some((rule) =>
      rule.includes("concrete bodily continuity"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.microActionPrompts.some((rule) =>
      rule.includes("agency shifts"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.microActionPrompts.some((rule) =>
      rule.includes("anticipation, delay, interruption, and renewed contact"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.microActionPrompts.some((rule) =>
      rule.includes("independent priorities"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.microActionPrompts.some((rule) =>
      rule.includes("world active through movement"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.microActionPrompts.some((rule) =>
      rule.includes("NPCs initiate, delay, refuse, redirect, interrupt, or disengage"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.microActionPrompts.some((rule) =>
      rule.includes("next perception, movement, thought, or speech"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.microActionPrompts.some((rule) =>
      rule.includes("self-correction pass"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.pacingRules.some((rule) =>
      rule.includes("do not treat slow burn as low heat"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.pacingRules.some((rule) =>
      rule.includes("emotional escalation slower than physical escalation"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.pacingRules.some((rule) =>
      rule.includes("Vary sentence length naturally"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.pacingRules.some((rule) =>
      rule.includes("mechanical description"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.pacingRules.some((rule) =>
      rule.includes("hesitation, contradiction, misreading, restraint, and refusal"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.pacingRules.some((rule) =>
      rule.includes("continuity, character logic, and the established dynamic"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.pacingRules.some((rule) =>
      rule.includes("only {{char}}'s side of the exchange"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.pacingRules.some((rule) =>
      rule.includes("NPCs and background events alter timing"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.pacingRules.some((rule) =>
      rule.includes("explicitly provided dialogue, visible actions"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.pacingRules.some((rule) =>
      rule.includes("without inventing unobserved reactions"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.pacingRules.some((rule) =>
      rule.includes("not physically with {{user}}"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.pacingRules.some((rule) =>
      rule.includes("key noun, verb, adjective, gesture, or line pattern"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.pacingRules.some((rule) =>
      rule.includes("reads like a novel"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.bannedNarrationPatterns.some((rule) =>
      rule.includes("fragmentary, poetic, or abstract affectation"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.bannedNarrationPatterns.some((rule) =>
      rule.includes("filler, recap, cliches, repeated hooks"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.bannedNarrationPatterns.some((rule) =>
      rule.includes("philosophical rumination"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.bannedNarrationPatterns.some((rule) =>
      rule.includes("abstract erotic language"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.bannedNarrationPatterns.some((rule) =>
      rule.includes("skipping emotional or psychological transitions"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.bannedNarrationPatterns.some((rule) =>
      rule.includes("emotional conflict to explicit action"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.bannedNarrationPatterns.some((rule) =>
      rule.includes("mood-board prose"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.bannedNarrationPatterns.some((rule) =>
      rule.includes("omniscient narration or head-hopping"),
    ),
    true,
  );
  assert.equal(
    proseGuidance.bannedNarrationPatterns.some((rule) =>
      rule.includes("mirroring"),
    ),
    true,
  );
  assert.match(prompt, /CRITICAL CONSENT \/ POWER CONTROL/);
  assert.match(prompt, /Make resistance, hesitation, or consent visible through action/);
  assert.match(prompt, /CRITICAL ESCALATION PACING/);
  assert.match(prompt, /slow-burn, high-heat spicy erotic\/NSFW roleplay/);
  assert.match(prompt, /Physical and erotic escalation can happen often and quickly/);
  assert.match(prompt, /CRITICAL SELF-CORRECTION PASS/);
  assert.match(prompt, /Smooth rhythm so prose reads like a novel/);
  assert.match(prompt, /CRITICAL NOVELISTIC TARGET/);
  assert.match(prompt, /psychologically charged/);
  assert.match(prompt, /CRITICAL STYLE TARGET/);
  assert.match(prompt, /Avoid filler, recap, cliches, repeated hooks, and generic reactions/);
  assert.match(prompt, /CRITICAL BEHAVIORAL REALISM/);
  assert.match(prompt, /Preserve cause and effect, continuity, character logic, and the established dynamic/);
  assert.match(prompt, /\{\{char\}\} has independent goals, priorities, agency/);
  assert.match(prompt, /own life, routine, friends, goals, and motivations outside of \{\{user\}\}/);
  assert.match(prompt, /CRITICAL WORLD \/ NPC ACTIVITY/);
  assert.match(prompt, /Let the world stay active through movement, interruption, timing, pressure, and continuity/);
  assert.match(prompt, /CRITICAL USER BOUNDARY/);
  assert.match(prompt, /Never write \{\{user\}\}'s dialogue, actions, thoughts, feelings, intentions, or decisions/);
  assert.match(prompt, /Only reference \{\{user\}\} through explicitly provided dialogue, visible actions, and directly observable presence/);
  assert.match(prompt, /\{\{user\}\} behavior aligned with their persona and lorebook-defined patterns without inventing unobserved reactions/);
  assert.match(prompt, /If \{\{char\}\} is not physically with \{\{user\}\}/);
  assert.match(prompt, /Never assume \{\{user\}\}'s reaction/);
  assert.match(prompt, /CRITICAL POV CONTROL/);
  assert.match(prompt, /No omniscient narration/);
  assert.match(prompt, /cannot hear, know, answer, or react to \{\{user\}\}'s internal thoughts/);
  assert.match(prompt, /Do not quote, paraphrase, mirror, or lightly restyle/);
  assert.match(prompt, /Write only \{\{char\}\}'s side of the exchange/);
  assert.match(prompt, /End at a natural handoff point before \{\{user\}\}'s response/);
  assert.equal(
    masterPayload.metadata.speech_style?.addressStyle,
    "Possessive_Terms",
  );
  assert.equal(
    masterPayload.metadata.dialogue_arrays?.dontVocabularyBlacklist.includes(
      "chuckle",
    ),
    true,
  );
  assert.equal(
    masterPayload.metadata.prose_guidance?.bannedNarrationPatterns.includes(
      "No aphorisms, moral commentary, or sweeping thematic declarations",
    ),
    true,
  );
  assert.equal(
    exported.data.extensions.amourai &&
      typeof exported.data.extensions.amourai === "object" &&
      "speech_style_generation" in exported.data.extensions.amourai,
    true,
  );
  assert.equal(
    exported.data.extensions.amourai &&
      typeof exported.data.extensions.amourai === "object" &&
      "dialogue_array_generation" in exported.data.extensions.amourai,
    true,
  );
  assert.equal(
    exported.data.extensions.amourai &&
      typeof exported.data.extensions.amourai === "object" &&
      "prose_guidance_generation" in exported.data.extensions.amourai,
    true,
  );
  assert.match(exported.data.mes_example, /Speech Examples and Opinions/);
  assert.match(exported.data.mes_example, /\[When \{\{char\}\} is calm\]/);
});

test("selects expanded archetype profiles for elite rebel and supernatural paths", () => {
  const vampire = generateAgeGapRomance("Vampire Mutual Longing", {
    random: () => 0,
    speciesType: "Vampire",
  });
  const fae = generateAgeGapRomance("Arranged Marriage Forbidden Love", {
    random: () => 0,
    speciesType: "Fae",
  });
  const oldMoney = generateAgeGapRomance("Old Money Forced Proximity", {
    random: () => 0,
    speciesType: "Human",
  });
  const veteran = generateAgeGapRomance("Second Chance Romance Age Gap", {
    random: () => 0,
    speciesType: "Human",
  });

  assert.equal(vampire.archetype?.personaType, "The_Ancient_Predator");
  assert.equal(
    vampire.archetype?.defenseMechanism,
    "Temporal_Disconnection",
  );
  assert.equal(fae.archetype?.personaType, "The_Fae_Deal_Maker");
  assert.equal(fae.archetype?.coreMotivation, "Autonomy_Freedom");
  assert.equal(oldMoney.archetype?.personaType, "The_Ruthless_Architect");
  assert.equal(oldMoney.archetype?.defenseMechanism, "Intellectualization");
  assert.equal(veteran.archetype?.personaType, "The_Jaded_Veteran");
  assert.equal(veteran.archetype?.coreMotivation, "Peace_Quiet");
});

test("hydrates curated character card seeds into engine modules", () => {
  const [darkRomanceSeed, academicSeed, vampireSeed, sunshineSeed] =
    characterCardSeeds;
  const darkRomance = generateCharacterCardFromSeed(darkRomanceSeed);
  const academic = generateCharacterCardFromSeed(academicSeed);
  const vampire = generateCharacterCardFromSeed(vampireSeed);
  const sunshine = generateCharacterCardFromSeed(sunshineSeed);

  assert.equal(characterCardSeeds.length, 4);
  assert.equal(darkRomance.given_name, "Nikolai");
  assert.equal(darkRomance.surname, "Volkov");
  assert.equal(darkRomance.age, 31);
  assert.equal(darkRomance.birth_month, "November");
  assert.equal(darkRomance.birth_day, 11);
  assert.equal(darkRomance.archetype?.personaType, "The_Ruthless_Architect");
  assert.equal(darkRomance.occupation?.jobTitle, "Syndicate Underboss");
  assert.equal(darkRomance.relationshipStatus?.currentLabel, "Betrothed_Promised");
  assert.equal(darkRomance.kink?.primaryRole, "Dominant");
  assert.equal(darkRomance.fetish?.situationalTrigger, "Exhibitionism_Risk");
  assert.equal(darkRomance.tone?.proseTexture, "Gritty_Melodramatic");
  assert.equal(darkRomance.framework?.targetSpecification, "V2_Card_Standard");

  assert.equal(academic.occupation?.kind, "student");
  assert.equal(
    academic.occupation?.kind === "student"
      ? academic.occupation.academicYear
      : "",
    "Senior",
  );
  assert.equal(academic.archetype?.defenseMechanism, "Hyper_Rationalization");
  assert.equal(academic.formatting?.narrativePerspective, "Third_Person_Present");

  assert.equal(vampire.species?.type, "Vampire");
  assert.equal(vampire.age, 450);
  assert.equal(vampire.apparent_age, 28);
  assert.equal(vampire.framework?.targetSpecification, "V3_Card_Layout");
  assert.equal(vampire.fetish?.situationalTrigger, "Sanguine_Biting");
  assert.equal(vampire.relationships?.[0]?.npcName, "Lilith Crowley");

  assert.equal(sunshine.archetype?.personaType, "The_Golden_Retriever");
  assert.equal(sunshine.intimacyStyle?.aftercareStyle, "The_Seeker");
  assert.equal(sunshine.relationshipStatus?.emotionalAvailability, "Fully_Open");
  assert.equal(sunshine.race?.syncMode, "Homogeneous Alignment");
});

test("keeps race default aligned to the primary european database path", () => {
  const generated = generateAgeGapRomance("Generated Preview", {
    anchorYear: 2026,
    ethnicityRegion: "Northern_Western_European",
    linguisticMatrix: "Celtic / Gaelic",
    powerDynamic: "Peers / Equals",
    random: () => 0,
    speciesType: "Human",
  });

  assert.equal(generated.race?.macroGroup, "White_Caucasian");
  assert.equal(generated.race?.syncMode, "Homogeneous Alignment");
  assert.equal(generated.race?.isCulturallySalient, false);
  assert.equal(generated.race?.narrativeStyle, "Stylised / Aesthetic Focus");
  assert.equal(
    generated.race?.physicalDescriptors.includes("fair to olive undertones"),
    true,
  );
});

test("marks non-default race and diaspora pairings as diasporic shifts", () => {
  const ethnicity = generateEthnicityData(
    "British Black",
    "Diaspora_Blended",
    "Anglophone",
    () => 0,
  );
  const race = generateRaceData("Black_African", ethnicity);

  assert.equal(race.macroGroup, "Black_African");
  assert.equal(race.syncMode, "Diasporic Shift");
  assert.equal(race.isCulturallySalient, true);
  assert.equal(race.narrativeStyle, "Phenotypic Palette Focus");
  assert.equal(race.physicalDescriptors.includes("deep brown undertones"), true);
});
