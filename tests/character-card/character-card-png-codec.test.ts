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
