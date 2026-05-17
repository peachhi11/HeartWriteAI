import assert from "node:assert/strict";
import test from "node:test";

import encodeChunks from "png-chunks-encode";
import { encode as encodeTextChunk } from "png-chunk-text";

import { readCharacterCardFromPng } from "../../lib/character-card/readCharacterCardFromPng";
import { writeCharacterCardToPng } from "../../lib/character-card/writeCharacterCardToPng";
import { createCharacterCardFormValues } from "../../lib/character-card/createCharacterCardFormValues";
import { createCharacterCardFromFormValues } from "../../lib/character-card/createCharacterCardFromFormValues";
import { exportCharacterCardPngData } from "../../lib/character-card/exportCharacterCardPngData";
import { importCharacterCardPngData } from "../../lib/character-card/importCharacterCardPngData";
import { CharacterCardPayload } from "../../types/character-card/CharacterCardPayload";

function encodeCard(card: CharacterCardPayload): string {
  return Buffer.from(JSON.stringify(card), "utf8").toString("base64");
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
