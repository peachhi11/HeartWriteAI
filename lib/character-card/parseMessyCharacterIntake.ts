import { CharacterCardFormValues } from "../../types/character-card/CharacterCardFormValues";
import { CharacterCardIntakeRouteResult } from "../../types/character-card/CharacterCardIntakeRouteResult";
import { parseCharacterCardImportText } from "./parseCharacterCardImportText";

interface IntakeLabelBlock {
  label: string;
  content: string;
}

const intakeLabelNames = [
  "Alternate First Message",
  "Alternate Greeting",
  "Alternate Scenario",
  "Post History Instructions",
  "Personality & Psychology",
  "Relationships / Connections",
  "Sexuality / Intimacy Profile",
  "Physical Appearance",
  "Physical Description",
  "Apparent Age vs. Actual Age",
  "Biological Sex & Gender",
  "Sexual Orientation",
  "Romantic Orientation",
  "Relationship Status",
  "Framework",
  "Formatting",
  "Relationship",
  "Macro",
  "Macro Classifications",
  "Card Library Tags",
  "Dynamics",
  "Archetypes",
  "Micro Tropes",
  "micro_tropes",
  "Clothing/Wardrobe",
  "{{wardrobe}}",
  "{{Accessories}}",
  "{{Grooming}}",
  "{{posture}}",
  "{{complexion}}",
  "{{undertone}}",
  "{{skin tone}}",
  "{{skin_type}}",
  "{{skin_texture}}",
  "{{hair}}",
  "{{hair_type}}",
  "{{hair_texture}}",
  "{{hair_style}}",
  "{{Residence}}",
  "{{Height}}",
  "{{build}}",
  "Body Modifications & Modern Alterations",
  "Body Modifications",
  "Modern Alterations",
  "{{body mod}}",
  "{{tattoos}}",
  "{{piercings}}",
  "{{birthmarks}}",
  "{{blemishes}}",
  "{{scars}}",
  "{{blush}}",
  "{{genitals}}",
  "{{gender}}",
  "{{pronouns}}",
  "{{facial shape}}",
  "{{eyes}}",
  "{{eye_shape}}",
  "{{eye_distance}}",
  "{{nose}}",
  "{{mouth}}",
  "{{lips}}",
  "{{smile}}",
  "{{Eyebrow}}",
  "{{sexual orientation}}",
  "{{monosexual}}",
  "{{Multisexual}}",
  "{{ace}}",
  "{{Disclosure_Status}}",
  "{{romantic_orientation}}",
  "{{Homoromantic}}",
  "{{Heteroromantic}}",
  "{{Bi/Polyromantic}}",
  "{{Panromantic}}",
  "{{Aromantic}}",
  "{{Romantic_Spectrum}}",
  "{{Alloromantic}}",
  "{{Demiromantic}}",
  "{{Greyromantic}}",
  "{{Frayromantic}}",
  "{{Cupioromantic}}",
  "{{Polyamory}}",
  "{{Relationship_Matrix}}",
  "{{relational_dynamics_tags}}",
  "{{Enemies to Lovers}}",
  "{{Friends to Lovers}}",
  "{{Grumpy x Sunshine}}",
  "{{Opposites Attract}}",
  "{{Second Chance Romance}}",
  "{{Forbidden Love}}",
  "{{Love Triangle}}",
  "{{Slow Burn}}",
  "{{Insta-Love}}",
  "{{Unrequited Love}}",
  "{{Narrative_Hook}}",
  "{{Forced Proximity}}",
  "{{Fake Dating}}",
  "{{Marriage of Convenience}}",
  "{{The Bet}}",
  "{{Secret Identity}}",
  "{{Hidden Billionaire}}",
  "{{Mistaken Identity}}",
  "{{Accidental Pregnancy}}",
  "{{Fish Out of Water}}",
  "{{Amnesia}}",
  "{{Road Trip Romance}}",
  "{{Archetype_trope}}",
  "{{Billionaire}}",
  "{{Royalty}}",
  "{{Mafia}}",
  "{{Dark Romance}}",
  "{{Sports Romance}}",
  "{{The Bodyguard}}",
  "{{Protector}}",
  "{{The Nanny / Single Parent}}",
  "{{Age Gap Romance}}",
  "{{Fated Mates}}",
  "{{Soulmates}}",
  "{{Rockstar}}",
  "{{Celebrity}}",
  "{{setting_hook}}",
  "{{Small Town Romance}}",
  "{{Workplace / Office Romance}}",
  "{{micro_trope}}",
  "{{Only One Bed}}",
  "{{hurt/comfort}}",
  "{{possessive}}",
  "{{caretaker}}",
  "{{The Makeover}}",
  "{{Sweet & Wholesome}}",
  "{{Rom-Com}}",
  "{{Angsty}}",
  "{{Cozy Romance}}",
  "{{Widow/Widower}}",
  "{{Runaway Bride}}",
  "{{Redemption}}",
  "{{Cinderella Story}}",
  "{{multi-char}}",
  "{{Interconnected}}",
  "{{Standalones}}",
  "{{ALT}}",
  "The {{Yandere}}",
  "The {{Tsundere}}",
  "The {{Kuudere}}",
  "The {{Himbo}}",
  "The {{DILF}} / {{Milf}}",
  "The {{Morally Grey}}",
  "User is the Enemy",
  "User is the Captive",
  "User is the Comfort",
  "User is the Secret Lover",
  "User is the Stranded Companion",
  "{{Scenario Openers}}",
  "{{Caught Red-Handed}}",
  "The {{Arranged Meeting}}",
  "The {{Rainy Night Knock}}",
  "The {{Drunken Confession}}",
  "The {{Rescue}}",
  "{{Slow Burn}} RP",
  "{{Dead Dove}} / {{Dark RP}}",
  "{{Fluff}} RP",
  "{{Smut}} / ERP",
  "{{romantic orientation}}",
  "{{relationship status}}",
  "{{species}}",
  "{{ethnicity}}",
  "{{nationality}}",
  "{{occupation}}",
  "{{education major}}",
  "Hands",
  "Skin Texture",
  "Skin Tone",
  "Base Hue",
  "Undertone",
  "Skin Type",
  "Hair",
  "Hair Type",
  "Hair Texture",
  "Hair Style",
  "Body Texture",
  "Movement",
  "Example Messages",
  "System Prompt",
  "Creator Notes",
  "First Message",
  "Age & Birthdate",
  "Aliases/Nicknames",
  "Aliases / Nicknames",
  "Race/Ethnicity",
  "Race / Ethnicity",
  "Background & Story",
  "Speech Style",
  "Group Only Greeting",
  "Group Greeting",
  "Full Name",
  "Date of Birth",
  "Place of Birth",
  "Description",
  "Birthplace",
  "Residence",
  "Scenario",
  "Pronouns",
  "Species",
  "Height",
  "Tags",
  "Nickname",
  "Name",
  "Age",
  "Aliases",
  "Nicknames",
  "Build",
  "Style",
  "Wardrobe",
  "Accessories",
  "Grooming",
  "Posture",
  "Complexion",
  "Appearance",
  "Occupation",
  "Ethnicity",
  "Personality",
  "Psychology",
  "Motivations",
  "Fears",
  "Contradictions",
  "Mask vs Truth",
  "Likes",
  "Dislikes",
  "Habits",
  "Quirks",
  "Background",
  "Backstory",
  "Upbringing",
  "Defining Past Event",
  "Shaping Events",
  "Voice",
  "Dialogue Style",
  "Relationships",
  "Connections",
  "NPCs",
  "Family",
  "Factions",
  "Sexuality",
  "Intimacy",
  "Polyamory",
  "Relationship Matrix Score",
  "Relational Dynamics Tags",
  "Narrative Hook",
  "Archetype Trope",
  "Setting Hook",
  "Micro Trope",
  "Structural Formats",
  "User Dynamic",
  "Scenario Openers",
  "Boundary Classifiers",
  "Kinks",
  "Boundaries",
  "Sexual Behavior",
  "Sexual Skills",
  "Creator Note",
];

const romanceTropeLabels = [
  "{{relational_dynamics_tags}}",
  "{{enemies to lovers}}",
  "{{friends to lovers}}",
  "{{grumpy x sunshine}}",
  "{{opposites attract}}",
  "{{second chance romance}}",
  "{{forbidden love}}",
  "{{love triangle}}",
  "{{slow burn}}",
  "{{insta-love}}",
  "{{unrequited love}}",
  "{{narrative_hook}}",
  "{{forced proximity}}",
  "{{fake dating}}",
  "{{marriage of convenience}}",
  "{{the bet}}",
  "{{secret identity}}",
  "{{hidden billionaire}}",
  "{{mistaken identity}}",
  "{{accidental pregnancy}}",
  "{{fish out of water}}",
  "{{amnesia}}",
  "{{road trip romance}}",
  "{{archetype_trope}}",
  "{{billionaire}}",
  "{{royalty}}",
  "{{mafia}}",
  "{{dark romance}}",
  "{{sports romance}}",
  "{{the bodyguard}}",
  "{{protector}}",
  "{{the nanny / single parent}}",
  "{{age gap romance}}",
  "{{fated mates}}",
  "{{soulmates}}",
  "{{rockstar}}",
  "{{celebrity}}",
  "{{setting_hook}}",
  "{{small town romance}}",
  "{{workplace / office romance}}",
  "{{micro_trope}}",
  "{{only one bed}}",
  "{{hurt/comfort}}",
  "{{possessive}}",
  "{{caretaker}}",
  "{{the makeover}}",
  "relational dynamics tags",
  "narrative hook",
  "archetype trope",
  "setting hook",
  "micro trope",
];

const romanceToneLabels = [
  "{{sweet & wholesome}}",
  "{{rom-com}}",
  "{{angsty}}",
  "{{cozy romance}}",
  "{{widow/widower}}",
  "{{runaway bride}}",
  "{{redemption}}",
  "{{cinderella story}}",
];

const cardFormatLabels = [
  "structural formats",
  "{{multi-char}}",
  "{{interconnected}}",
  "{{standalones}}",
  "{{alt}}",
];

const characterArchetypeLabels = [
  "the {{yandere}}",
  "the {{tsundere}}",
  "the {{kuudere}}",
  "the {{himbo}}",
  "the {{dilf}} / {{milf}}",
  "the {{morally grey}}",
];

const userDynamicLabels = [
  "user dynamic",
  "user is the enemy",
  "user is the captive",
  "user is the comfort",
  "user is the secret lover",
  "user is the stranded companion",
];

const scenarioOpenerLabels = [
  "scenario openers",
  "{{scenario openers}}",
  "{{caught red-handed}}",
  "the {{arranged meeting}}",
  "the {{rainy night knock}}",
  "the {{drunken confession}}",
  "the {{rescue}}",
];

const boundarySystemPromptLabels = [
  "boundary classifiers",
  "{{slow burn}} rp",
  "{{dead dove}} / {{dark rp}}",
  "{{fluff}} rp",
  "{{smut}} / erp",
];

export function parseMessyCharacterIntake(
  intakeText: string,
): CharacterCardIntakeRouteResult {
  const trimmedText = intakeText.trim();

  if (!trimmedText) {
    return { values: {}, fieldNames: [] };
  }

  const importFields = parseCharacterCardImportText(trimmedText, "", "");
  const labelBlocks = parseIntakeLabelBlocks(trimmedText);
  const heuristicFields = parseHeuristicParagraphs(trimmedText);
  const values: Partial<CharacterCardFormValues> = {
    ...heuristicFields,
    ...importFields,
    ...createValuesFromLabelBlocks(labelBlocks),
  };
  const cleanedValues = removeEmptyValues(values);

  return {
    values: cleanedValues,
    fieldNames: Object.keys(cleanedValues),
  };
}

function createValuesFromLabelBlocks(
  blocks: IntakeLabelBlock[],
): Partial<CharacterCardFormValues> {
  const alternateOpenings = createAlternateOpenings(blocks);
  const groupOnlyGreetings = readBlockGroup(blocks, [
    "group only greeting",
    "group greeting",
  ]);

  return {
    fullName: readFirstBlock(blocks, ["full name", "name"]),
    aliasesNicknames: readFirstBlock(blocks, [
      "aliases/nicknames",
      "aliases / nicknames",
      "aliases",
      "nicknames",
      "nickname",
    ]),
    ageBirthdate:
      readFirstBlock(blocks, ["age & birthdate"]) ??
      joinLabeledBlocks(blocks, [
        "age",
        "apparent age vs. actual age",
        "date of birth",
      ]),
    raceEthnicity: readFirstBlock(blocks, [
      "race/ethnicity",
      "race / ethnicity",
      "ethnicity",
      "{{ethnicity}}",
      "{{nationality}}",
    ]),
    species: readFirstBlock(blocks, ["species", "{{species}}"]),
    birthplace: readFirstBlock(blocks, ["birthplace", "place of birth"]),
    height: readFirstBlock(blocks, ["height"]),
    tagsText: joinCommaValues(
      readBlockGroup(blocks, [
        "tags",
        "card library tags",
        "dynamics",
        "archetypes",
        "micro tropes",
        "micro_tropes",
      ]),
    ),
    description: joinDefined([
      readFirstBlock(blocks, ["description"]),
      joinLabeledBlocks(blocks, [
        "biological sex & gender",
        "sexual orientation",
        "romantic orientation",
        "{{gender}}",
        "pronouns",
        "{{pronouns}}",
        "{{sexual orientation}}",
        "{{monosexual}}",
        "{{multisexual}}",
        "{{ace}}",
        "{{disclosure_status}}",
        "{{romantic_orientation}}",
        "{{romantic orientation}}",
        "{{homoromantic}}",
        "{{heteroromantic}}",
        "{{bi/polyromantic}}",
        "{{panromantic}}",
        "{{aromantic}}",
        "{{romantic_spectrum}}",
        "{{alloromantic}}",
        "{{demiromantic}}",
        "{{greyromantic}}",
        "{{frayromantic}}",
        "{{cupioromantic}}",
        "{{polyamory}}",
        "polyamory",
        "{{relationship_matrix}}",
        "relationship matrix score",
        "relationship status",
        "{{relationship status}}",
        "residence",
        "{{residence}}",
        "occupation",
        "{{occupation}}",
        "{{education major}}",
        ...cardFormatLabels,
      ]),
    ]),
    physicalAppearance: joinLabeledBlocks(blocks, [
      "physical appearance",
        "physical description",
        "appearance",
        "{{height}}",
        "build",
        "{{build}}",
        "style",
      "wardrobe",
      "{{wardrobe}}",
      "clothing/wardrobe",
      "accessories",
      "{{accessories}}",
      "grooming",
      "{{grooming}}",
      "posture",
      "{{posture}}",
      "movement",
      "complexion",
      "{{complexion}}",
      "undertone",
      "{{undertone}}",
      "skin tone",
      "{{skin tone}}",
      "skin type",
      "{{skin_type}}",
      "skin texture",
      "{{skin_texture}}",
      "hair",
      "{{hair}}",
      "hair type",
      "{{hair_type}}",
      "hair texture",
      "{{hair_texture}}",
      "hair style",
      "{{hair_style}}",
      "base hue",
      "{{facial shape}}",
      "{{eyes}}",
      "{{eye_shape}}",
      "{{eye_distance}}",
      "{{nose}}",
      "{{mouth}}",
      "{{lips}}",
      "{{smile}}",
      "{{eyebrow}}",
      "body modifications & modern alterations",
      "body modifications",
      "modern alterations",
      "{{body mod}}",
      "{{tattoos}}",
      "{{piercings}}",
      "{{birthmarks}}",
      "{{blemishes}}",
      "{{scars}}",
      "{{blush}}",
      "hands",
      "skin texture",
      "body texture",
    ]),
    personalityPsychology: joinLabeledBlocks(blocks, [
      "personality & psychology",
      "personality",
      "psychology",
      "motivations",
      "fears",
      "contradictions",
      "mask vs truth",
      "likes",
      "dislikes",
      "habits",
      "quirks",
      ...characterArchetypeLabels,
    ]),
    backgroundStory: joinLabeledBlocks(blocks, [
      "background & story",
      "background",
      "backstory",
      "upbringing",
      "defining past event",
      "shaping events",
    ]),
    speechStyle: joinLabeledBlocks(blocks, [
      "speech style",
      "voice",
      "dialogue style",
    ]),
    relationshipsConnections: joinLabeledBlocks(blocks, [
      "relationships / connections",
      "relationships",
      "connections",
      "npcs",
      "family",
      "factions",
    ]),
    intimacyProfile: joinLabeledBlocks(blocks, [
      "sexuality / intimacy profile",
      "intimacy",
      "{{genitals}}",
      "kinks",
      "boundaries",
      "sexual behavior",
      "sexual skills",
    ]),
    scenario: joinDefined([
      readFirstBlock(blocks, ["scenario"]),
      joinLabeledBlocks(blocks, romanceTropeLabels),
      joinLabeledBlocks(blocks, romanceToneLabels),
      joinLabeledBlocks(blocks, userDynamicLabels),
    ]),
    first_mes: joinDefined([
      readFirstBlock(blocks, ["first message"]),
      joinLabeledBlocks(blocks, scenarioOpenerLabels),
    ]),
    mes_example: readFirstBlock(blocks, ["example messages"]),
    creator_notes: readFirstBlock(blocks, ["creator notes", "creator note"]),
    system_prompt: joinDefined([
      readFirstBlock(blocks, ["system prompt"]),
      joinLabeledBlocks(blocks, [
        "macro",
        "macro classifications",
        "framework",
        "formatting",
        "relationship",
      ]),
      joinLabeledBlocks(blocks, boundarySystemPromptLabels),
    ]),
    post_history_instructions: readFirstBlock(blocks, [
      "post history instructions",
    ]),
    alternateOpenings: alternateOpenings.length ? alternateOpenings : undefined,
    groupOnlyGreetings: groupOnlyGreetings.length ? groupOnlyGreetings : undefined,
  };
}

function parseIntakeLabelBlocks(text: string): IntakeLabelBlock[] {
  const labelPattern = intakeLabelNames
    .map(escapeRegExp)
    .sort((left, right) => right.length - left.length)
    .join("|");
  const matches = Array.from(
    text.matchAll(new RegExp(`(^|\\n)\\s*(${labelPattern})(?:\\s+\\d+)?\\s*:\\s*`, "gi")),
  );

  return matches
    .map((match, index) => {
      const contentStart = match.index + match[0].length;
      const contentEnd = matches[index + 1]?.index ?? text.length;

      return {
        label: normalizeLabel(match[2]),
        content: text.slice(contentStart, contentEnd).trim(),
      };
    })
    .filter((block) => block.content);
}

function parseHeuristicParagraphs(text: string): Partial<CharacterCardFormValues> {
  const blocks: Partial<CharacterCardFormValues> = {};
  const paragraphs = text
    .split(/\n{2,}/g)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  for (const paragraph of paragraphs) {
    const lowerParagraph = paragraph.toLowerCase();

    if (matchesAny(lowerParagraph, ["look", "hair", "eyes", "height", "wear", "scar", "tattoo", "body", "posture"])) {
      blocks.physicalAppearance = joinDefined([blocks.physicalAppearance, paragraph]);
    } else if (matchesAny(lowerParagraph, ["want", "fear", "mask", "truth", "personality", "motivat", "dislike", "like", "habit", "quirk", "contradict"])) {
      blocks.personalityPsychology = joinDefined([
        blocks.personalityPsychology,
        paragraph,
      ]);
    } else if (matchesAny(lowerParagraph, ["grew", "born", "family", "childhood", "school", "raised", "past", "upbringing"])) {
      blocks.backgroundStory = joinDefined([blocks.backgroundStory, paragraph]);
    } else if (matchesAny(lowerParagraph, ["speak", "voice", "accent", "tone", "cadence"])) {
      blocks.speechStyle = joinDefined([blocks.speechStyle, paragraph]);
    } else if (matchesAny(lowerParagraph, ["relationship", "friend", "rival", "ex", "npc", "faction"])) {
      blocks.relationshipsConnections = joinDefined([
        blocks.relationshipsConnections,
        paragraph,
      ]);
    } else if (matchesAny(lowerParagraph, ["sex", "kink", "intimacy", "sexual", "fetish", "boundary", "consent"])) {
      blocks.intimacyProfile = joinDefined([blocks.intimacyProfile, paragraph]);
    } else if (!blocks.description) {
      blocks.description = paragraph;
    }
  }

  return blocks;
}

function createAlternateOpenings(blocks: IntakeLabelBlock[]) {
  const scenarioBlocks = blocks.filter((block) => block.label === "alternate scenario");
  const greetingBlocks = blocks.filter((block) =>
    ["alternate greeting", "alternate first message"].includes(block.label),
  );
  const count = Math.max(scenarioBlocks.length, greetingBlocks.length);

  return Array.from({ length: count }, (_, index) => ({
    scenario: scenarioBlocks[index]?.content ?? "",
    firstMessage: greetingBlocks[index]?.content ?? "",
  })).filter((opening) => opening.scenario || opening.firstMessage);
}

function readFirstBlock(
  blocks: IntakeLabelBlock[],
  labels: string[],
): string | undefined {
  return blocks.find((block) => labels.includes(block.label))?.content;
}

function readBlockGroup(blocks: IntakeLabelBlock[], labels: string[]): string[] {
  return blocks
    .filter((block) => labels.includes(block.label))
    .map((block) => block.content);
}

function joinLabeledBlocks(blocks: IntakeLabelBlock[], labels: string[]): string {
  return joinDefined(
    blocks
      .filter((block) => labels.includes(block.label))
      .map((block) => `${toTitleLabel(block.label)}:\n${block.content}`),
  );
}

function removeEmptyValues(
  values: Partial<CharacterCardFormValues>,
): Partial<CharacterCardFormValues> {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) =>
      Array.isArray(value) ? value.length : Boolean(value?.trim()),
    ),
  ) as Partial<CharacterCardFormValues>;
}

function matchesAny(value: string, needles: string[]): boolean {
  return needles.some((needle) => value.includes(needle));
}

function normalizeLabel(label: string): string {
  return label.trim().toLowerCase();
}

function toTitleLabel(label: string): string {
  return label.replace(/\b\w/g, (character) => character.toUpperCase());
}

function joinDefined(values: Array<string | undefined>): string {
  return values.filter((value): value is string => Boolean(value?.trim())).join("\n\n");
}

function joinCommaValues(values: string[]): string | undefined {
  const joinedValue = values
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean)
    .join(", ");

  return joinedValue || undefined;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
