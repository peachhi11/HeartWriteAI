import { z } from "zod";

import {
  type CharacterCreationForm,
  CharacterCreationFormSchema,
} from "../../types/character-card/CharacterCreationForm";
import {
  LorebookV3DocumentSchema,
  type LorebookV3Document,
} from "../../features/lorebooks/schema";
import { compileSemanticSeedVisibleTags } from "./semanticSeedResolver";

export type RevisionTargetKind =
  | "character_creation_form"
  | "lorebook_v3";
export type RevisionPathPart = string | number;
export type RevisionValueKind = "string" | "boolean" | "string_array";
export type RevisionOperationAction = "replace" | "append" | "prepend" | "clear";

export interface RevisionFieldDefinition {
  group: string;
  label: string;
  path: RevisionPathPart[];
  pathId: string;
  valueKind: RevisionValueKind;
}

export interface RevisionContextSection {
  body: string;
  title: string;
}

export interface RevisionDiffItem {
  after: string;
  before: string;
  group: string;
  label: string;
  pathId: string;
}

export interface RevisionApplyResult<TTarget> {
  diffs: RevisionDiffItem[];
  next: TTarget;
  patch: RevisionResponse;
}

export interface RevisionPromptInput {
  contextSections: RevisionContextSection[];
  fields: RevisionFieldDefinition[];
  targetLabel: string;
  targetKind: RevisionTargetKind;
  userInstruction: string;
}

export const RevisionOperationSchema = z.object({
  action: z
    .enum(["replace", "append", "prepend", "clear"])
    .default("replace"),
  path: z.string().min(1),
  reason: z.string().default(""),
  value: z.union([z.string(), z.boolean(), z.array(z.string())]).optional(),
});

export const RevisionResponseSchema = z.object({
  operations: z.array(RevisionOperationSchema).default([]),
  summary: z.string().default(""),
});

export type RevisionOperation = z.infer<typeof RevisionOperationSchema>;
export type RevisionResponse = z.infer<typeof RevisionResponseSchema>;

const CHARACTER_CREATION_BASE_FIELDS: Array<
  Omit<RevisionFieldDefinition, "pathId">
> = [
  field("Writer Bible", "Project Title", ["writerBible", "projectTitle"]),
  field("Writer Bible", "Human Summary", ["writerBible", "humanSummary"]),
  field("Writer Bible", "Themes", ["writerBible", "themes"]),
  field("Writer Bible", "World Reference", ["writerBible", "worldReference"]),
  field("Writer Bible", "Character Reference", ["writerBible", "characterReference"]),
  field("Writer Bible", "Relationship Arc", ["writerBible", "relationshipArc"]),
  field("Writer Bible", "Style Notes", ["writerBible", "styleNotes"]),
  field("Writer Bible", "Active Threads", ["writerBible", "activeThreads"]),
  field("Writer Bible", "Source Notes", ["writerBible", "sourceNotes"]),

  field("Character Engine", "Core Wound", ["characterEngine", "coreWound"]),
  field("Character Engine", "Core Belief", ["characterEngine", "coreBelief"]),
  field("Character Engine", "Core Fear", ["characterEngine", "coreFear"]),
  field("Character Engine", "Primary Drive", ["characterEngine", "primaryDrive"]),
  field("Character Engine", "Defense Mechanisms", ["characterEngine", "defenseMechanisms"]),
  field("Character Engine", "Attachment Style", ["characterEngine", "attachmentStyle"]),
  field("Character Engine", "Behavioral Triggers", ["characterEngine", "behavioralTriggers"]),
  field("Character Engine", "Relationship Dynamics", ["characterEngine", "relationshipDynamics"]),
  field("Character Engine", "Speech Rules", ["characterEngine", "speechRules"]),
  field("Character Engine", "Sexuality Rules", ["characterEngine", "sexualityRules"]),

  field("Character Identity", "Character Name", ["identity", "characterName"]),
  field("Character Identity", "Nicknames / Aliases", ["identity", "nicknamesAliases"]),
  field("Character Identity", "Age", ["identity", "age"]),
  field("Character Identity", "Birthdate", ["identity", "birthdate"]),
  field("Character Identity", "Birthplace", ["identity", "birthplace"]),
  field("Character Identity", "Nationality / Ethnicity", ["identity", "nationalityEthnicity"]),
  field("Character Identity", "Languages Spoken", ["identity", "languagesSpoken"]),
  field("Character Identity", "Gender Identity", ["identity", "genderIdentity"]),
  field("Character Identity", "Pronouns", ["identity", "pronouns"]),
  field("Character Identity", "Occupation", ["identity", "occupation"]),
  field("Character Identity", "Species / Heritage", ["identity", "speciesHeritage"]),

  field("Appearance", "Height", ["appearance", "height"]),
  field("Appearance", "Build", ["appearance", "build"]),
  field("Appearance", "Eyes", ["appearance", "eyeColourShape"]),
  field("Appearance", "Hair", ["appearance", "hairColourLengthTextureStyle"]),
  field("Appearance", "Skin", ["appearance", "skinColourUndertoneTexture"]),
  field("Appearance", "Facial Features", ["appearance", "facialFeatures"]),
  field("Appearance", "Piercings", ["appearance", "piercings"]),
  field("Appearance", "Tattoos", ["appearance", "tattoos"]),
  field("Appearance", "Blemishes / Scars", ["appearance", "blemishesScars"]),
  field("Appearance", "Freckles / Moles / Beauty Marks", ["appearance", "frecklesMolesBeautyMarks"]),
  field("Appearance", "Outfit", ["appearance", "outfit"]),

  field("Adult Anatomy", "NSFW Adult Anatomy Enabled", ["adultAnatomy", "isNsfwAdultCard"], "boolean"),
  field("Adult Anatomy", "Penis Descriptors", ["adultAnatomy", "penisDescriptors"]),
  field("Adult Anatomy", "Testicle / Scrotum Descriptors", ["adultAnatomy", "testicleScrotumDescriptors"]),
  field("Adult Anatomy", "Nipple Descriptors", ["adultAnatomy", "nippleDescriptors"]),
  field("Adult Anatomy", "Breast Descriptors", ["adultAnatomy", "breastDescriptors"]),
  field("Adult Anatomy", "Vagina Descriptors", ["adultAnatomy", "vaginaDescriptors"]),
  field("Adult Anatomy", "Anus Descriptors", ["adultAnatomy", "anusDescriptors"]),

  field("Personality", "Archetype", ["personality", "archetype"]),
  field("Personality", "Positive Traits", ["personality", "positiveTraits"]),
  field("Personality", "Flaws", ["personality", "flaws"]),
  field("Personality", "Humor", ["personality", "humor"]),
  field("Personality", "Intelligence", ["personality", "intelligence"]),
  field("Personality", "Social Behaviour", ["personality", "socialBehaviour"]),

  field("Cognitive Drivers", "Motivation", ["cognitiveDrivers", "motivation"]),
  field("Cognitive Drivers", "Fear", ["cognitiveDrivers", "fear"]),
  field("Cognitive Drivers", "Defenses", ["cognitiveDrivers", "defenses"]),

  field("Psychology", "Temperament", ["psychology", "temperament"]),
  field("Psychology", "Cognitive Distortions", ["psychology", "cognitiveDistortions"]),
  field("Psychology", "Decision Engine", ["psychology", "decisionEngine"]),
  field("Psychology", "Baseline Affect", ["psychology", "baselineAffect"]),
  field("Psychology", "Frustration Threshold", ["psychology", "frustrationThreshold"]),
  field("Psychology", "Core Wound", ["psychology", "coreWound"]),
  field("Psychology", "Internalized Lie", ["psychology", "internalizedLie"]),
  field("Psychology", "Triggers", ["psychology", "triggers"]),
  field("Psychology", "Beliefs", ["psychology", "beliefs"]),
  field("Psychology", "Moral Flexibility", ["psychology", "moralFlexibility"]),
  field("Psychology", "Attachment Style", ["psychology", "attachmentStyle"]),
  field("Psychology", "Conflict Style", ["psychology", "conflictStyle"]),
  field("Psychology", "Stress Response", ["psychology", "stressResponse"]),
  field("Psychology", "Love Languages", ["psychology", "loveLanguages"]),
  field("Psychology", "Big Five Openness", ["psychology", "bigFive", "openness"]),
  field("Psychology", "Big Five Conscientiousness", ["psychology", "bigFive", "conscientiousness"]),
  field("Psychology", "Big Five Extraversion", ["psychology", "bigFive", "extraversion"]),
  field("Psychology", "Big Five Agreeableness", ["psychology", "bigFive", "agreeableness"]),
  field("Psychology", "Big Five Emotional Stability", ["psychology", "bigFive", "emotionalStability"]),

  field("Behaviour", "Facial Expressions", ["behaviour", "facialExpressions"]),
  field("Behaviour", "Body Language & Posture", ["behaviour", "bodyLanguagePosture"]),
  field("Behaviour", "Mannerisms", ["behaviour", "mannerisms"]),
  field("Behaviour", "Goal-Oriented Actions", ["behaviour", "goalOrientedActions"]),
  field("Behaviour", "Morality in Action", ["behaviour", "moralityInAction"]),
  field("Behaviour", "Habits & Routines", ["behaviour", "habitsRoutines"]),

  field("Lifestyle", "Residence", ["lifestyle", "residence"]),
  field("Lifestyle", "Living Style", ["lifestyle", "livingStyle"]),
  field("Lifestyle", "Routines", ["lifestyle", "routines"]),
  field("Lifestyle", "Wealth", ["lifestyle", "wealth"]),
  field("Lifestyle", "Work / Life Balance", ["lifestyle", "workLifeBalance"]),
  field("Lifestyle", "Hobbies", ["lifestyle", "hobbies"]),

  field("Relationships", "Faction or Group", ["relationships", "affiliationCore", "factionOrGroup"]),
  field("Relationships", "Hierarchical Rank", ["relationships", "affiliationCore", "hierarchicalRank"]),
  field("Relationships", "Public Status", ["relationships", "affiliationCore", "publicStatus"]),
  field("Relationships", "Attachment Type", ["relationships", "emotionalBonds", "attachmentType"]),
  field("Relationships", "Trust Metric", ["relationships", "emotionalBonds", "trustMetric"]),
  field("Relationships", "Shared History Anchor", ["relationships", "emotionalBonds", "sharedHistoryAnchor"]),
  field("Relationships", "Ideological Clash", ["relationships", "behavioralFriction", "ideologicalClash"]),
  field("Relationships", "Boundaries", ["relationships", "behavioralFriction", "boundaries"]),
  field("Relationships", "Micro-Aggressions or Tells", ["relationships", "behavioralFriction", "microAggressionsOrTells"]),

  field("NPC Network", "NPC Discovery Notes", ["npcNetwork", "discoveryNotes"]),

  field("Speech & Communication", "Tone & Vocabulary", ["speechCommunication", "toneVocabulary"]),
  field("Speech & Communication", "Subtext", ["speechCommunication", "subtext"]),
  field("Speech & Communication", "Conversational Habits", ["speechCommunication", "conversationalHabits"]),

  field("Internal Thoughts", "Psychological Responses", ["internalThoughts", "psychologicalResponses"]),
  field("Internal Thoughts", "Motivations & Fears", ["internalThoughts", "motivationsFears"]),
  field("Internal Thoughts", "Internal Monologues", ["internalThoughts", "internalMonologues"]),
];

const CHARACTER_ENGINE_DECISION_RULE_FIELDS = [
  "id",
  "drive",
  "question",
  "yes",
  "no",
  "constraints",
  "visibleBehaviors",
  "alternativeAction",
] as const;

const TARGET_OVERRIDE_FIELDS = [
  "targetId",
  "contextualPromptInjection",
] as const;

const NPC_MINI_PROFILE_FIELDS = [
  "id",
  "name",
  "role",
  "relationshipToCharacter",
  "publicRole",
  "privateHistory",
  "storyFunction",
  "emotionalPressure",
  "behaviorShift",
  "conflictHook",
  "supportHook",
  "boundaries",
  "lorebookKeys",
] as const;

export function createCharacterCreationRevisionFields(
  form: CharacterCreationForm,
): RevisionFieldDefinition[] {
  const parsed = CharacterCreationFormSchema.parse(form);
  const fields = [...CHARACTER_CREATION_BASE_FIELDS];

  parsed.characterEngine.decisionRules.forEach((_rule, index) => {
    CHARACTER_ENGINE_DECISION_RULE_FIELDS.forEach((key) => {
      fields.push(
        field(
          "Character Engine Decision Rules",
          `Decision Rule ${index + 1}: ${humanizeKey(key)}`,
          ["characterEngine", "decisionRules", index, key],
        ),
      );
    });
  });

  parsed.relationships.targetOverrides.forEach((_override, index) => {
    TARGET_OVERRIDE_FIELDS.forEach((key) => {
      fields.push(
        field(
          "Relationship Target Overrides",
          `Target Override ${index + 1}: ${humanizeKey(key)}`,
          ["relationships", "targetOverrides", index, key],
        ),
      );
    });
  });

  parsed.npcNetwork.miniProfiles.forEach((_profile, index) => {
    fields.push(
      field(
        "NPC Mini Profiles",
        `NPC Profile ${index + 1}: Profile Type`,
        ["npcNetwork", "miniProfiles", index, "profileType"],
      ),
    );

    NPC_MINI_PROFILE_FIELDS.forEach((key) => {
      fields.push(
        field(
          "NPC Mini Profiles",
          `NPC Profile ${index + 1}: ${humanizeKey(key)}`,
          ["npcNetwork", "miniProfiles", index, key],
        ),
      );
    });
  });

  return withPathIds(fields);
}

export function createLorebookRevisionFields(
  document: LorebookV3Document,
): RevisionFieldDefinition[] {
  const parsed = LorebookV3DocumentSchema.parse(document);
  const fields: Array<Omit<RevisionFieldDefinition, "pathId">> = [
    field("Lorebook", "Name", ["data", "name"]),
    field("Lorebook", "Description", ["data", "description"]),
    field("Lorebook", "Recursive Scanning", ["data", "recursive_scanning"], "boolean"),
  ];

  parsed.data.entries.forEach((entry, index) => {
    const label = entry.name || entry.comment || `Entry ${index + 1}`;
    fields.push(
      field("Lorebook Entries", `${label}: Name`, ["data", "entries", index, "name"]),
      field("Lorebook Entries", `${label}: Comment`, ["data", "entries", index, "comment"]),
      field("Lorebook Entries", `${label}: Content`, ["data", "entries", index, "content"]),
      field("Lorebook Entries", `${label}: Keys`, ["data", "entries", index, "keys"], "string_array"),
      field("Lorebook Entries", `${label}: Secondary Keys`, ["data", "entries", index, "secondary_keys"], "string_array"),
      field("Lorebook Entries", `${label}: Enabled`, ["data", "entries", index, "enabled"], "boolean"),
      field("Lorebook Entries", `${label}: Constant`, ["data", "entries", index, "constant"], "boolean"),
      field("Lorebook Entries", `${label}: Selective`, ["data", "entries", index, "selective"], "boolean"),
      field("Lorebook Entries", `${label}: Regex`, ["data", "entries", index, "use_regex"], "boolean"),
    );
  });

  return withPathIds(fields);
}

export function createCharacterCreationRevisionContext(
  form: CharacterCreationForm,
): {
  contextSections: RevisionContextSection[];
  fields: RevisionFieldDefinition[];
} {
  const parsed = CharacterCreationFormSchema.parse(form);
  const fields = createCharacterCreationRevisionFields(parsed);
  const visibleSemanticTags = compileSemanticSeedVisibleTags(parsed.semanticSeedIds);

  return {
    contextSections: [
      {
        title: "Target",
        body: [
          "Character creation form.",
          "Keep portable character truth separate from story truth and setting truth.",
          "Do not introduce {{user}}-specific facts into character-truth fields.",
          visibleSemanticTags.length
            ? `Visible semantic tags: ${visibleSemanticTags.join(", ")}`
            : "Visible semantic tags: none",
        ].join("\n"),
      },
      createFieldSnapshotSection(parsed, fields),
      createAllowedPathsSection(fields),
    ],
    fields,
  };
}

export function createLorebookRevisionContext(
  document: LorebookV3Document,
): {
  contextSections: RevisionContextSection[];
  fields: RevisionFieldDefinition[];
} {
  const parsed = LorebookV3DocumentSchema.parse(document);
  const fields = createLorebookRevisionFields(parsed);

  return {
    contextSections: [
      {
        title: "Target",
        body: [
          `Lorebook: ${parsed.data.name || "Untitled lorebook"}`,
          "Only edit lorebook structure and entry content through approved path IDs.",
          "Hidden/spoiler entries may still compile into model context; keep spoiler previews non-revealing.",
        ].join("\n"),
      },
      createFieldSnapshotSection(parsed, fields),
      createAllowedPathsSection(fields),
    ],
    fields,
  };
}

export function createRevisionResponseSchema(fields: RevisionFieldDefinition[]) {
  const pathIds = fields.map((fieldDefinition) => fieldDefinition.pathId);

  if (pathIds.length === 0) {
    throw new Error("Cannot build revision schema without editable paths.");
  }

  const OperationSchema = RevisionOperationSchema.extend({
    path: z.enum(pathIds as [string, ...string[]]),
  });

  return z.object({
    operations: z.array(OperationSchema).default([]),
    summary: z.string().default(""),
  });
}

export function parseRevisionResponse(
  raw: string,
  fields: RevisionFieldDefinition[],
): RevisionResponse {
  const parsedJson = tryParseRevisionJson(raw);
  if (!parsedJson) {
    throw new Error("Revision response was not valid JSON.");
  }

  return createRevisionResponseSchema(fields).parse(parsedJson);
}

export function applyCharacterCreationRevisionResponse(
  form: CharacterCreationForm,
  response: unknown,
): RevisionApplyResult<CharacterCreationForm> {
  const fields = createCharacterCreationRevisionFields(form);
  const patch = createRevisionResponseSchema(fields).parse(response);
  const next = CharacterCreationFormSchema.parse(
    applyRevisionOperations(form, fields, patch.operations),
  );

  return {
    diffs: createRevisionDiff(form, next, fields),
    next,
    patch,
  };
}

export function applyLorebookRevisionResponse(
  document: LorebookV3Document,
  response: unknown,
): RevisionApplyResult<LorebookV3Document> {
  const fields = createLorebookRevisionFields(document);
  const patch = createRevisionResponseSchema(fields).parse(response);
  const next = LorebookV3DocumentSchema.parse(
    applyRevisionOperations(document, fields, patch.operations),
  );

  return {
    diffs: createRevisionDiff(document, next, fields),
    next,
    patch,
  };
}

export function buildRevisionPromptMessages(input: RevisionPromptInput) {
  const schemaExample = {
    operations: [
      {
        action: "replace",
        path: input.fields[0]?.pathId ?? "identity.characterName",
        reason: "Brief explanation of why this field changes.",
        value: "New field value",
      },
    ],
    summary: "One sentence summary of the edits.",
  };

  return [
    {
      role: "system" as const,
      content: [
        "You are HeartWriteAI's internal revision assistant.",
        "Return only valid JSON. Do not include markdown fences.",
        "Use only the provided path values. Do not invent fields.",
        "Prefer concise, prompt-efficient prose.",
        "Preserve established facts unless the user explicitly asks to change them.",
        "If a rule says a character cannot or does not do something, include an alternative action.",
      ].join("\n"),
    },
    {
      role: "user" as const,
      content: [
        `Target: ${input.targetLabel} (${input.targetKind})`,
        "",
        "User revision request:",
        input.userInstruction.trim(),
        "",
        "Current editable context:",
        formatRevisionContextSections(input.contextSections),
        "",
        "Required JSON shape:",
        JSON.stringify(schemaExample, null, 2),
      ].join("\n"),
    },
  ];
}

export function formatRevisionContextSections(
  sections: RevisionContextSection[],
) {
  return sections
    .map((section) => `[${section.title}]\n${section.body.trim()}`)
    .join("\n\n");
}

export function createRevisionDiff(
  before: unknown,
  after: unknown,
  fields: RevisionFieldDefinition[],
): RevisionDiffItem[] {
  return fields.flatMap((fieldDefinition) => {
    const beforeValue = formatRevisionValue(
      readValueAtPath(before, fieldDefinition.path),
    );
    const afterValue = formatRevisionValue(
      readValueAtPath(after, fieldDefinition.path),
    );

    if (beforeValue === afterValue) {
      return [];
    }

    return [
      {
        after: afterValue,
        before: beforeValue,
        group: fieldDefinition.group,
        label: fieldDefinition.label,
        pathId: fieldDefinition.pathId,
      },
    ];
  });
}

function applyRevisionOperations(
  source: unknown,
  fields: RevisionFieldDefinition[],
  operations: RevisionOperation[],
) {
  const fieldMap = new Map(fields.map((fieldDefinition) => [
    fieldDefinition.pathId,
    fieldDefinition,
  ]));
  let next = structuredClone(source);

  for (const operation of operations) {
    const fieldDefinition = fieldMap.get(operation.path);
    if (!fieldDefinition) {
      throw new Error(`Unknown revision path: ${operation.path}`);
    }

    const currentValue = readValueAtPath(next, fieldDefinition.path);
    const nextValue = resolveRevisionOperationValue(
      currentValue,
      fieldDefinition,
      operation,
    );
    next = updateNestedValueAtPath(next, fieldDefinition.path, nextValue);
  }

  return next;
}

function resolveRevisionOperationValue(
  currentValue: unknown,
  fieldDefinition: RevisionFieldDefinition,
  operation: RevisionOperation,
) {
  if (operation.action === "clear") {
    return fieldDefinition.valueKind === "boolean"
      ? false
      : fieldDefinition.valueKind === "string_array"
        ? []
        : "";
  }

  if (fieldDefinition.valueKind === "boolean") {
    if (typeof operation.value !== "boolean") {
      throw new Error(`${operation.path} expects a boolean value.`);
    }

    return operation.value;
  }

  if (fieldDefinition.valueKind === "string_array") {
    const nextArray = coerceStringArray(operation.value);
    const currentArray = coerceStringArray(currentValue);

    switch (operation.action) {
      case "append":
        return uniqueList([...currentArray, ...nextArray]);
      case "prepend":
        return uniqueList([...nextArray, ...currentArray]);
      case "replace":
      default:
        return uniqueList(nextArray);
    }
  }

  const nextText = typeof operation.value === "string"
    ? operation.value
    : Array.isArray(operation.value)
      ? operation.value.join("\n")
      : "";
  const currentText = typeof currentValue === "string" ? currentValue : "";

  switch (operation.action) {
    case "append":
      return joinTextBlocks([currentText, nextText]);
    case "prepend":
      return joinTextBlocks([nextText, currentText]);
    case "replace":
    default:
      return nextText;
  }
}

function createFieldSnapshotSection(
  source: unknown,
  fields: RevisionFieldDefinition[],
): RevisionContextSection {
  const body = fields
    .map((fieldDefinition) => {
      const value = formatRevisionValue(
        readValueAtPath(source, fieldDefinition.path),
      );
      return `${fieldDefinition.pathId} (${fieldDefinition.label}): ${
        value || "(empty)"
      }`;
    })
    .join("\n");

  return {
    body,
    title: "Current Fields",
  };
}

function createAllowedPathsSection(
  fields: RevisionFieldDefinition[],
): RevisionContextSection {
  return {
    title: "Allowed Patch Paths",
    body: fields
      .map(
        (fieldDefinition) =>
          `${fieldDefinition.pathId} | ${fieldDefinition.valueKind} | ${fieldDefinition.group} | ${fieldDefinition.label}`,
      )
      .join("\n"),
  };
}

function tryParseRevisionJson(raw: string) {
  const candidates = [
    ...[...raw.matchAll(/```(?:json)?\s*([\s\S]*?)```/gi)].map((match) =>
      match[1]?.trim(),
    ),
    raw.trim(),
    raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1).trim(),
  ].filter(Boolean);

  for (const candidate of candidates.reverse()) {
    try {
      return JSON.parse(candidate);
    } catch {
      // Try the next likely JSON region.
    }
  }

  return null;
}

function field(
  group: string,
  label: string,
  path: RevisionPathPart[],
  valueKind: RevisionValueKind = "string",
): Omit<RevisionFieldDefinition, "pathId"> {
  return {
    group,
    label,
    path,
    valueKind,
  };
}

function withPathIds(
  fields: Array<Omit<RevisionFieldDefinition, "pathId">>,
): RevisionFieldDefinition[] {
  return fields.map((fieldDefinition) => ({
    ...fieldDefinition,
    pathId: formatRevisionPath(fieldDefinition.path),
  }));
}

function formatRevisionPath(path: readonly RevisionPathPart[]) {
  return path
    .map((part, index) =>
      typeof part === "number"
        ? `[${part}]`
        : index === 0
          ? part
          : `.${part}`,
    )
    .join("");
}

function readValueAtPath(source: unknown, path: readonly RevisionPathPart[]) {
  return path.reduce<unknown>((currentValue, pathPart) => {
    if (currentValue === undefined || currentValue === null) {
      return undefined;
    }

    return (currentValue as Record<string | number, unknown>)[pathPart];
  }, source);
}

function updateNestedValueAtPath(
  source: unknown,
  path: readonly RevisionPathPart[],
  value: unknown,
): unknown {
  if (path.length === 0) {
    return value;
  }

  const [pathPart, ...remainingPath] = path;
  const currentValue =
    isRecord(source) || Array.isArray(source)
      ? (source as Record<string | number, unknown>)[pathPart]
      : undefined;
  const nextValue = updateNestedValueAtPath(
    currentValue,
    remainingPath,
    value,
  );

  if (Array.isArray(source)) {
    return source.map((item, index) =>
      index === pathPart ? nextValue : item,
    );
  }

  return {
    ...(isRecord(source) ? source : {}),
    [pathPart]: nextValue,
  };
}

function formatRevisionValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map(String).join(", ");
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  if (value === undefined || value === null) {
    return "";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function coerceStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String).map((item) => item.trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/,|\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function joinTextBlocks(values: readonly string[]) {
  return values.map((value) => value.trim()).filter(Boolean).join("\n");
}

function uniqueList(values: readonly string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function humanizeKey(key: string) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function isRecord(value: unknown): value is Record<string | number, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
