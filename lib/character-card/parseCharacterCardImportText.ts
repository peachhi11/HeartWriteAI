import { ParsedCharacterCardImportText } from "../../types/character-card/ParsedCharacterCardImportText";

interface NamedTextSection {
  name: string;
  content: string;
}

const descriptionSectionNames = new Set([
  "basic information",
  "basic info",
  "profile",
]);

const personalitySectionNames = new Set([
  "core personality",
  "personality",
  "personal likes/dislikes",
  "likes/dislikes",
  "emotional responses",
  "scenario responses",
]);

const backgroundSectionNames = new Set(["background", "backstory"]);
const speechSectionNames = new Set(["dialogue style", "speech style"]);
const relationshipSectionNames = new Set([
  "relationships",
  "dynamic with {{user}}",
  "dynamic with user",
]);
const intimacySectionNames = new Set([
  "sexual behavior",
  "sexual behaviour",
  "sexuality",
  "intimacy profile",
  "{{char}}'s behavior during sex",
  "{{char}}'s behaviour during sex",
]);

const templateLabelNames = [
  "Relationship with {{user}}",
  "Relationship with character",
  "Penis Descriptors",
  "Ball Descriptors",
  "Nipple Descriptors",
  "Breast Descriptors",
  "Vagina Descriptors",
  "Anus Descriptors",
  "Sexual Behavior",
  "Sexual Behaviour",
  "Sex/Gender",
  "Sexuality",
  "Nationality",
  "Ethnicity",
  "Occupation",
  "Appearance",
  "Facial Features",
  "Backstory",
  "Mannerisms",
  "Personality",
  "Relationships",
  "Aliases",
  "Species",
  "Birthplace",
  "Height",
  "Outfit",
  "Accent",
  "Speech",
  "Quirks",
  "Likes",
  "Dislikes",
  "Hobbies",
  "Kinks",
  "Other",
  "Name",
  "Age",
  "Hair",
  "Eyes",
];

export function parseCharacterCardImportText(
  description: string,
  personality: string,
  creatorNotes: string,
): ParsedCharacterCardImportText {
  const descriptionFields = parseDescriptionFields(description);
  const personalityFields = parsePersonalityFields(personality);
  const creatorNotesFields = parseCreatorNotesFields(creatorNotes);

  return {
    ...descriptionFields,
    ...personalityFields,
    ...creatorNotesFields,
  };
}

function parseDescriptionFields(description: string): ParsedCharacterCardImportText {
  const sections = parseNamedSections(description);
  const templateFields = parseTemplateLabelFields(description);

  if (!sections.length) {
    return templateFields.description || templateFields.fullName
      ? templateFields
      : { description };
  }

  return {
    ...templateFields,
    fullName: templateFields.fullName ?? extractFirstLabel(sections, ["name"]),
    ageBirthdate:
      templateFields.ageBirthdate ?? extractFirstLabel(sections, ["age", "birthdate"]),
    description:
      templateFields.description ??
      joinSectionGroup(sections, descriptionSectionNames, {
        omitLabels: ["name", "age", "appearance"],
      }),
    physicalAppearance: joinDefined([
      templateFields.physicalAppearance,
      extractFirstLabel(sections, ["appearance"]),
      joinSectionGroup(sections, new Set(["physical appearance", "appearance"])),
    ]),
    personalityPsychology: joinDefined([
      templateFields.personalityPsychology,
      joinSectionGroup(sections, personalitySectionNames),
    ]),
    backgroundStory: joinDefined([
      templateFields.backgroundStory,
      joinSectionGroup(sections, backgroundSectionNames),
    ]),
    speechStyle: joinDefined([
      templateFields.speechStyle,
      joinSectionGroup(sections, speechSectionNames),
    ]),
    relationshipsConnections: joinDefined([
      templateFields.relationshipsConnections,
      joinSectionGroup(sections, relationshipSectionNames),
    ]),
    intimacyProfile: joinDefined([
      templateFields.intimacyProfile,
      joinSectionGroup(sections, intimacySectionNames),
    ]),
  };
}

function parsePersonalityFields(personality: string): ParsedCharacterCardImportText {
  if (!personality.trim()) {
    return {};
  }

  const sections = parseNamedSections(personality);
  const templateFields = parseTemplateLabelFields(personality);

  if (!sections.length) {
    return templateFields.personalityPsychology || templateFields.fullName
      ? templateFields
      : { personalityPsychology: personality };
  }

  return {
    ...templateFields,
    physicalAppearance: joinDefined([
      templateFields.physicalAppearance,
      joinSectionGroup(sections, new Set(["physical appearance"])),
    ]),
    personalityPsychology: joinDefined([
      templateFields.personalityPsychology,
      joinSectionGroup(sections, personalitySectionNames),
    ]),
    backgroundStory: joinDefined([
      templateFields.backgroundStory,
      joinSectionGroup(sections, backgroundSectionNames),
    ]),
    speechStyle: joinDefined([
      templateFields.speechStyle,
      joinSectionGroup(sections, speechSectionNames),
    ]),
    relationshipsConnections: joinDefined([
      templateFields.relationshipsConnections,
      joinSectionGroup(sections, relationshipSectionNames),
    ]),
    intimacyProfile: joinDefined([
      templateFields.intimacyProfile,
      joinSectionGroup(sections, intimacySectionNames),
    ]),
  };
}

function parseCreatorNotesFields(creatorNotes: string): ParsedCharacterCardImportText {
  const alternateOpenings = parseScenarioSummaries(creatorNotes);

  return {
    alternateOpenings,
    creatorNotes: removeScenarioSummaryBlock(creatorNotes),
  };
}

function parseNamedSections(text: string): NamedTextSection[] {
  const matches = Array.from(
    text.matchAll(/(^|\n)\s*\[([^\]\n:]+)(?::|\])\s*/g),
  );

  return matches
    .map((match, index) => {
      const contentStart = match.index + match[0].length;
      const contentEnd = matches[index + 1]?.index ?? text.length;

      return {
        name: normalizeSectionName(match[2]),
        content: cleanSectionContent(text.slice(contentStart, contentEnd)),
      };
    })
    .filter((section) => section.name && section.content);
}

function parseTemplateLabelFields(text: string): ParsedCharacterCardImportText {
  const labels = parseTemplateLabels(text);

  if (!Object.keys(labels).length) {
    return {};
  }

  return {
    fullName: labels.name,
    aliasesNicknames: labels.aliases,
    ageBirthdate: labels.age,
    raceEthnicity: joinDefined([labels.nationality, labels.ethnicity]),
    species: labels.species,
    birthplace: labels.birthplace,
    height: labels.height,
    description: joinLabeledValues(labels, [
      "sex/gender",
      "occupation",
      "other",
    ]),
    physicalAppearance: joinLabeledValues(labels, [
      "appearance",
      "hair",
      "eyes",
      "facial features",
      "outfit",
    ]),
    personalityPsychology: joinLabeledValues(labels, [
      "personality",
      "quirks",
      "mannerisms",
      "likes",
      "dislikes",
      "hobbies",
    ]),
    backgroundStory: labels.backstory,
    speechStyle: joinLabeledValues(labels, ["accent", "speech"]),
    relationshipsConnections: joinLabeledValues(labels, [
      "relationships",
      "relationship with character",
      "relationship with {{user}}",
    ]),
    intimacyProfile: joinLabeledValues(labels, [
      "sexuality",
      "kinks",
      "sexual behavior",
      "sexual behaviour",
      "penis descriptors",
      "ball descriptors",
      "nipple descriptors",
      "breast descriptors",
      "vagina descriptors",
      "anus descriptors",
    ]),
  };
}

function parseTemplateLabels(text: string): Record<string, string> {
  const labelPattern = templateLabelNames
    .map(escapeRegExp)
    .sort((left, right) => right.length - left.length)
    .join("|");
  const matches = Array.from(
    text.matchAll(new RegExp(`(^|[\\n;(])\\s*(${labelPattern})\\s*=\\s*`, "gi")),
  );

  return Object.fromEntries(
    matches
      .map((match, index) => {
        const contentStart = match.index + match[0].length;
        const contentEnd = matches[index + 1]?.index ?? text.length;
        const label = normalizeSectionName(match[2]);
        const value = cleanTemplateLabelContent(text.slice(contentStart, contentEnd));

        return [label, value];
      })
      .filter(([, value]) => value),
  );
}

function parseScenarioSummaries(text: string) {
  const matches = Array.from(
    text.matchAll(/(?:^|\n)\s*SCENARIO\s+(\d+)\s*:\s*/gi),
  );

  return matches
    .map((match, index) => {
      const contentStart = match.index + match[0].length;
      const contentEnd = matches[index + 1]?.index ?? text.length;

      return {
        scenario: cleanScenarioSummary(text.slice(contentStart, contentEnd)),
        firstMessage: "",
      };
    })
    .filter((opening) => opening.scenario);
}

function removeScenarioSummaryBlock(text: string): string {
  return text
    .replace(
      /\n?\s*\*\*SUMMARY\*\*[\s\S]*?(?=\n\s*\*\*[A-Z][^*\n]+\*\*|\n\s*!\[|$)/i,
      "\n\n",
    )
    .trim();
}

function joinSectionGroup(
  sections: NamedTextSection[],
  names: Set<string>,
  options: { omitLabels?: string[] } = {},
): string {
  return joinDefined(
    sections
      .filter((section) => names.has(section.name))
      .map((section) => omitLabeledLines(section.content, options.omitLabels ?? [])),
  );
}

function extractFirstLabel(
  sections: NamedTextSection[],
  labelNames: string[],
): string | undefined {
  for (const section of sections) {
    const value = extractLabeledValue(section.content, labelNames);

    if (value) {
      return value;
    }
  }

  return undefined;
}

function extractLabeledValue(content: string, labelNames: string[]): string | undefined {
  for (const labelName of labelNames) {
    const escapedLabelName = escapeRegExp(labelName);
    const match = content.match(
      new RegExp(`(^|\\n)\\s*${escapedLabelName}\\s*:\\s*([^\\n]+)`, "i"),
    );

    if (match?.[2]?.trim()) {
      return match[2].trim();
    }
  }

  return undefined;
}

function omitLabeledLines(content: string, labelNames: string[]): string {
  return content
    .split("\n")
    .filter((line) => {
      const normalizedLine = line.trim().toLowerCase();

      return !labelNames.some((labelName) =>
        normalizedLine.startsWith(`${labelName.toLowerCase()}:`),
      );
    })
    .join("\n")
    .trim();
}

function cleanScenarioSummary(content: string): string {
  return content
    .replace(/\n\s*!\[[^\n]*\]\([^)]+\)\s*/g, "\n")
    .replace(/\n\s*\*\*[A-Z][^*\n]+\*\*[\s\S]*$/g, "")
    .trim();
}

function cleanSectionContent(content: string): string {
  return content
    .replace(/\]\s*$/g, "")
    .trim();
}

function cleanTemplateLabelContent(content: string): string {
  const trimmedContent = content.replace(/\s+$/g, "");
  const withoutWrapperClose =
    countCharacter(trimmedContent, ")") > countCharacter(trimmedContent, "(")
      ? trimmedContent.replace(/\)+$/g, "")
      : trimmedContent;

  return withoutWrapperClose.replace(/\.\s*$/g, "").trim();
}

function normalizeSectionName(name: string): string {
  const normalizedName = name.trim().toLowerCase();

  if (normalizedName.includes("behavior during sex")) {
    return "{{char}}'s behavior during sex";
  }

  if (normalizedName.includes("behaviour during sex")) {
    return "{{char}}'s behaviour during sex";
  }

  return normalizedName;
}

function joinDefined(values: Array<string | undefined>): string {
  return values.filter((value): value is string => Boolean(value?.trim())).join("\n\n");
}

function joinLabeledValues(
  labels: Record<string, string>,
  labelNames: string[],
): string {
  return joinDefined(
    labelNames.map((labelName) => {
      const value = labels[labelName];

      return value ? `${labelName}: ${value}` : undefined;
    }),
  );
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function countCharacter(value: string, character: string): number {
  return Array.from(value).filter((item) => item === character).length;
}
