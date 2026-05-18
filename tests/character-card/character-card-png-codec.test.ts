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
import { mergeCharacterCardIntakeValues } from "../../lib/character-card/mergeCharacterCardIntakeValues";
import { parseMessyCharacterIntake } from "../../lib/character-card/parseMessyCharacterIntake";
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
  generateIntimacyStyleData,
  generateKinkData,
  generateLoreEntriesData,
  generateLorebookSummaryData,
  generateCreatorsNotesData,
  generateNationalityData,
  generateOccupationData,
  generatePostHistoryInstructionsData,
  generateRaceData,
  generateRelationshipsData,
  generateRelationshipStatusData,
  generateScenarioData,
  generateScenarioOpeningPairData,
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
  });

  assert.equal(classification.macro.framework, "Narrative RPG");
  assert.deepEqual(classification.tags.micro_tropes, ["hurt/comfort"]);
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
  assert.equal(direct.aiOutputConstraint.includes("Output ONLY"), true);
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
  assert.equal(systemPrompt.includes("Output ONLY the raw character text string"), true);
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
    slowBurn.postHistoryInstructions?.formattingHardlines.some((rule) =>
      rule.includes("Never write"),
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
  assert.match(override, /Never write thoughts, actions, decisions, or dialogue for \{\{user\}\}/);
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
  assert.equal(formatting.markdownEmphasisStyle, "Code_Block_Shielding");
  assert.match(
    formatting.formattingSystemPromptInjection,
    /MANDATORY FORMATTING/,
  );
  assert.match(prompt, /FORMATTING CONFIGURATION/);
  assert.equal(masterPayload.metadata.formatting?.maxParagraphsPerTurn, 4);
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
  assert.match(tone.toneSystemPromptInjection, /NARRATIVE TONE/);
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
