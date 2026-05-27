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
  "Sex/Gender",
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
  "Eyes",
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
  "Setting",
  "Location",
  "Locations",
  "Appearance Details",
  "Personality & Behavior",
  "Personality & Behaviour",
  "Behaviour",
  "Behavior",
  "Dynamic With User",
  "Dynamic With {{user}}",
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

  const normalizedText = normalizeInlineIntakeLabels(trimmedText);
  const importFields = discardWholeTextDescription(
    parseCharacterCardImportText(normalizedText, "", ""),
    normalizedText,
  );
  const labelBlocks = [
    ...parseHeadingBlocks(normalizedText),
    ...parseIntakeLabelBlocks(normalizedText),
  ];
  const heuristicFields = parseHeuristicParagraphs(normalizedText);
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
  const nameBlock = splitNameBlock(readFirstBlock(blocks, ["full name", "name"]));

  return {
    fullName: nameBlock.name,
    aliasesNicknames: readFirstBlock(blocks, [
      "aliases/nicknames",
      "aliases / nicknames",
      "aliases",
      "nicknames",
      "nickname",
    ]),
    ageBirthdate:
      readFirstBlock(blocks, ["age & birthdate"]) ??
      readFirstBlock(blocks, ["age"]) ??
      joinLabeledBlocks(blocks, [
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
      nameBlock.remainder,
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
        "setting",
        "location",
        "locations",
        ...cardFormatLabels,
      ]),
    ]),
    physicalAppearance: joinLabeledBlocks(blocks, [
      "physical appearance",
        "physical description",
        "appearance",
        "appearance details",
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
      "personality & behavior",
      "personality & behaviour",
      "personality",
      "psychology",
      "behaviour",
      "behavior",
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
      "dynamic with user",
      "dynamic with {{user}}",
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
      joinLabeledBlocks(blocks, ["setting", "location", "locations"]),
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
    text.matchAll(
      new RegExp(
        `(^|\\n)\\s*(?:[-*•]\\s*)?(${labelPattern})(?:\\s+\\d+)?\\s*:\\s*`,
        "gi",
      ),
    ),
  );
  const boundaries = [
    ...matches.map((match) => match.index),
    ...findHeadingBoundaries(text).map((boundary) => boundary.index),
  ].sort((left, right) => left - right);

  return matches
    .map((match) => {
      const contentStart = match.index + match[0].length;
      const contentEnd =
        boundaries.find((boundaryIndex) => boundaryIndex > match.index) ??
        text.length;

      return {
        label: normalizeLabel(match[2]),
        content: text.slice(contentStart, contentEnd).trim(),
      };
    })
    .filter((block) => block.content);
}

function findHeadingBoundaries(text: string) {
  const boundaries: Array<{ index: number; length: number }> = [];
  let index = 0;

  for (const line of text.split("\n")) {
    if (normalizeHeadingLine(line)) {
      boundaries.push({ index, length: line.length });
    }

    index += line.length + 1;
  }

  return boundaries;
}

function parseHeadingBlocks(text: string): IntakeLabelBlock[] {
  const headingAliases = new Map<string, string>([
    ["appearance details", "appearance details"],
    ["appearance", "appearance"],
    ["physical appearance", "physical appearance"],
    ["personality & behavior", "personality & behavior"],
    ["personality & behaviour", "personality & behaviour"],
    ["personality", "personality"],
    ["behaviour", "behaviour"],
    ["behavior", "behavior"],
    ["background", "background"],
    ["backstory", "backstory"],
    ["relationships", "relationships"],
    ["connections", "connections"],
    ["dynamic with user", "dynamic with user"],
    ["dynamic with {{user}}", "dynamic with {{user}}"],
    ["scenario", "scenario"],
    ["setting", "setting"],
    ["locations", "locations"],
    ["location", "location"],
    ["sexuality", "sexuality"],
    ["intimacy", "intimacy"],
    ["creator notes", "creator notes"],
  ]);
  const lines = text.split("\n");
  const blocks: IntakeLabelBlock[] = [];
  let currentLabel: string | null = null;
  let currentLines: string[] = [];

  for (const line of lines) {
    const normalizedHeading = normalizeHeadingLine(line);
    const label = normalizedHeading
      ? headingAliases.get(normalizedHeading)
      : undefined;

    if (label) {
      pushHeadingBlock();
      currentLabel = label;
      currentLines = [];
      continue;
    }

    if (currentLabel) {
      currentLines.push(line);
    }
  }

  pushHeadingBlock();

  return blocks;

  function pushHeadingBlock() {
    const content = currentLines.join("\n").trim();

    if (currentLabel && content) {
      blocks.push({ label: currentLabel, content });
    }
  }
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
    } else if (/^(setting|location|locations)\s*:/i.test(paragraph)) {
      blocks.scenario = joinDefined([blocks.scenario, paragraph]);
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

function discardWholeTextDescription(
  values: Partial<CharacterCardFormValues>,
  sourceText: string,
): Partial<CharacterCardFormValues> {
  if (
    values.description?.trim() === sourceText.trim() &&
    Object.keys(values).length === 1
  ) {
    const rest = { ...values };
    delete rest.description;

    return rest;
  }

  return values;
}

function normalizeInlineIntakeLabels(text: string): string {
  const inlineLabels = [
    "scenario",
    "first message",
    "description",
    "personality",
    "appearance",
    "physical appearance",
    "background",
    "backstory",
    "speech style",
    "creator notes",
    "system prompt",
    "tags",
  ];

  const labelPattern = inlineLabels
    .map((label) => label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .sort((left, right) => right.length - left.length)
    .join("|");

  return text.replace(
    new RegExp(`([.!?;])\\s+(${labelPattern})\\s*:`, "gi"),
    (_match, previous: string, label: string) => `${previous}\n${label}:`,
  );
}

function splitNameBlock(nameBlock?: string) {
  if (!nameBlock?.trim()) {
    return { name: undefined, remainder: undefined };
  }

  const trimmedNameBlock = nameBlock
    .trim()
    .split("\n")[0]
    .replace(/^[-*•]\s*/, "")
    .trim();
  const firstSentence = trimmedNameBlock.match(/^([^.!?\n]{2,80})[.!?]\s+([\s\S]+)$/);

  if (!firstSentence) {
    return { name: trimmedNameBlock, remainder: undefined };
  }

  const candidateName = firstSentence[1].trim();
  const remainder = firstSentence[2].trim();
  const looksLikeName =
    candidateName.split(/\s+/).length <= 5 &&
    !matchesAny(candidateName.toLowerCase(), [
      "scenario",
      "personality",
      "appearance",
      "relationship",
      "character",
    ]);

  return looksLikeName
    ? { name: candidateName, remainder }
    : { name: trimmedNameBlock, remainder: undefined };
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

function normalizeHeadingLine(line: string): string | undefined {
  const trimmedLine = line
    .replace(/^[-*•—–\s]+/g, "")
    .replace(/[:：]\s*$/g, "")
    .trim();

  if (!trimmedLine || trimmedLine.length > 60) {
    return undefined;
  }

  const letterCount = (trimmedLine.match(/[a-z]/gi) ?? []).length;

  if (!letterCount) {
    return undefined;
  }

  const uppercaseCount = (trimmedLine.match(/[A-Z]/g) ?? []).length;
  const isMostlyUppercase = uppercaseCount / letterCount > 0.7;
  const isTitleLike =
    /^[A-Z][A-Za-z{}&/\s]+$/.test(trimmedLine) &&
    !/[.!?]$/.test(trimmedLine);

  return isMostlyUppercase || isTitleLike
    ? trimmedLine.toLowerCase()
    : undefined;
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
