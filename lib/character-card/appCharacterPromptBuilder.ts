import {
  buildFieldDetailLines,
  type FieldDetailSettings,
  type FieldKey,
} from "./fieldDetail";

export type CharacterGenPov = "first" | "second" | "third";
export type CharacterGenContentRating = "sfw" | "nsfw_allowed";

export type CharacterGenInput = {
  idea: string;
  lorebook?: string;
  name?: string;
  outputLanguage?: string;
  pov: CharacterGenPov;
};

export type CharacterGenPromptOptions = {
  contentRating: CharacterGenContentRating;
  fieldDetail?: FieldDetailSettings;
  useDefaultNegativePrompt?: boolean;
};

type FillMissingInput = {
  card: Record<string, unknown>;
  idea?: string;
  lorebook?: string;
  missingKeys: string[];
  outputLanguage?: string;
  pov: CharacterGenPov;
};

type ImagePromptInput = {
  card: Record<string, unknown>;
  contentRating: CharacterGenContentRating;
  styleHints?: string;
  useDefaultNegativePrompt?: boolean;
};

type RegenerateInput = {
  card: Record<string, unknown>;
  idea: string;
  lorebook?: string;
  outputLanguage?: string;
  pov: CharacterGenPov;
  regenNonce?: string;
  requestedName?: string;
  targets: string[];
};

const CARD_TEXT_FIELD_KEYS = [
  "description",
  "personality",
  "scenario",
  "first_mes",
  "mes_example",
  "creator_notes",
  "tags",
] as const satisfies readonly FieldKey[];

const CARD_TEXT_FIELD_KEY_SET = new Set<string>(CARD_TEXT_FIELD_KEYS);

function normalizeOutputLanguage(lang?: string): string | null {
  const value = (lang ?? "").trim();
  if (!value) return null;
  if (value.toLowerCase() === "auto") return null;
  return value;
}

export function buildCharacterGenPrompt(
  input: CharacterGenInput,
  options: CharacterGenPromptOptions,
) {
  const useDefaultNegativePrompt = options.useDefaultNegativePrompt === true;

  return [
    "You are generating a SillyTavern-compatible CCv3 character card.",
    "Return ONLY valid JSON. No markdown, no commentary.",
    "Rules:",
    ...languageRequirementLines(input.outputLanguage, useDefaultNegativePrompt),
    "- Output must be a single JSON object with keys exactly:",
    `  ${characterGenJsonKeys(useDefaultNegativePrompt).join(", ")}`,
    "- Use standard JSON escaping for newlines (\\n). No trailing commas.",
    "- tags must be an array of short strings.",
    "- image_prompt must be a concise, detailed portrait prompt for the avatar.",
    "- image_prompt: English, exactly one paragraph, 350-500 characters max, no newlines.",
    ...negativePromptRules(options.contentRating, useDefaultNegativePrompt),
    "- If you exceed limits, rewrite shorter before responding.",
    "- Do not use quotes or markdown in image_prompt or negative_prompt.",
    "- mes_example must use {{user}} and {{char}} labels.",
    contentRatingLine(options.contentRating),
    ...negativePromptContentRatingLines(options.contentRating, useDefaultNegativePrompt),
    ...povRuleLines(),
    "",
    "FIELD LENGTH & STRUCTURE PRESET (MANDATORY):",
    ...buildFieldDetailLines(options.fieldDetail, CARD_TEXT_FIELD_KEYS),
    "",
    ...firstMessageQualityBarLines(),
    "",
    "If you cannot comply with JSON, return ONLY the tagged template below and nothing else:",
    ...taggedFallbackLines(useDefaultNegativePrompt),
    "",
    "Input:",
    `Idea: ${input.idea.trim()}`,
    preferredNameLine(input.name, "(invent a fitting name)"),
    `POV: ${input.pov}`,
    loreLine(input.lorebook),
  ].join("\n");
}

export function buildCharacterGenPromptTagged(
  input: CharacterGenInput,
  options: CharacterGenPromptOptions,
) {
  const useDefaultNegativePrompt = options.useDefaultNegativePrompt === true;

  return [
    "You are generating a SillyTavern-compatible CCv3 character card.",
    "Return ONLY the tagged template below. No JSON, no markdown, no commentary.",
    "Rules:",
    ...languageRequirementLines(input.outputLanguage, useDefaultNegativePrompt),
    "- Use the exact tag names shown in the template.",
    "- tags must be a comma-separated list of short strings.",
    "- image_prompt must be a concise, detailed portrait prompt for the avatar.",
    "- image_prompt: English, exactly one paragraph, 350-500 characters max, no newlines.",
    ...negativePromptRules(options.contentRating, useDefaultNegativePrompt, {
      tagged: true,
    }),
    "- If you exceed limits, rewrite shorter before responding.",
    "- Do not use quotes or markdown in image_prompt or negative_prompt.",
    "- mes_example must use {{user}} and {{char}} labels.",
    contentRatingLine(options.contentRating),
    ...negativePromptContentRatingLines(options.contentRating, useDefaultNegativePrompt),
    ...povRuleLines(),
    "",
    "FIELD LENGTH & STRUCTURE PRESET (MANDATORY):",
    ...buildFieldDetailLines(options.fieldDetail, CARD_TEXT_FIELD_KEYS),
    "",
    ...firstMessageQualityBarLines(),
    "",
    "Template (fill in each section; keep blank lines between sections):",
    ...taggedTemplateLines(),
    "",
    "Input:",
    `Idea: ${input.idea.trim()}`,
    preferredNameLine(input.name, "(invent a fitting name)"),
    `POV: ${input.pov}`,
    loreLine(input.lorebook),
  ].join("\n");
}

export function buildFillMissingPrompt(
  input: FillMissingInput,
  options: { fieldDetail?: FieldDetailSettings } = {},
) {
  const fields = JSON.stringify(input.card, null, 2);
  const missingFieldKeys = filterCardTextFieldKeys(input.missingKeys);
  const needsFirstMes = missingFieldKeys.includes("first_mes");

  return [
    "You are completing missing fields for a SillyTavern-compatible CCv3 character card.",
    "Return ONLY valid JSON. No markdown, no commentary.",
    "Rules:",
    ...languageRequirementLines(input.outputLanguage, false),
    "- Output must be a JSON object containing ONLY the missing keys listed below.",
    "- Do NOT include keys that already have content.",
    "- Use standard JSON escaping for newlines (\\n). No trailing commas.",
    "- mes_example must use {{user}} and {{char}} labels if requested.",
    ...povRuleLines(),
    "",
    "FIELD LENGTH & STRUCTURE PRESET (MANDATORY):",
    ...buildFieldDetailLines(options.fieldDetail, missingFieldKeys),
    "",
    ...(needsFirstMes ? firstMessageMissingOrRegenLines("missing keys") : []),
    "Missing keys:",
    input.missingKeys.join(", "),
    "",
    "Existing fields:",
    fields,
    input.idea?.trim() ? `Idea: ${input.idea.trim()}` : "Idea: (none)",
    `POV: ${input.pov}`,
    loreLine(input.lorebook),
  ].join("\n");
}

export function buildImagePrompt(input: ImagePromptInput) {
  const useDefaultNegativePrompt = input.useDefaultNegativePrompt === true;

  return [
    "You are generating an avatar portrait prompt for a SillyTavern-compatible character.",
    useDefaultNegativePrompt
      ? "Return ONLY valid JSON with keys: image_prompt."
      : "Return ONLY valid JSON with keys: image_prompt, negative_prompt.",
    "Rules:",
    "- image_prompt must be a concise, detailed portrait prompt.",
    "- image_prompt: English, exactly one paragraph, 350-500 characters max, no newlines.",
    ...negativePromptRules(input.contentRating, useDefaultNegativePrompt),
    "- If you exceed limits, rewrite shorter before responding.",
    "- Do not use quotes or markdown in image_prompt or negative_prompt.",
    contentRatingLine(input.contentRating),
    ...negativePromptContentRatingLines(input.contentRating, useDefaultNegativePrompt),
    "- Use standard JSON escaping for newlines (\\n). No trailing commas.",
    "",
    "Character fields:",
    JSON.stringify(input.card, null, 2),
    input.styleHints?.trim()
      ? `Style hints: ${input.styleHints.trim()}`
      : "Style hints: (none)",
  ].join("\n");
}

export function buildRegeneratePrompt(
  input: RegenerateInput,
  options: { fieldDetail?: FieldDetailSettings } = {},
) {
  const nameRule = input.requestedName?.trim()
    ? "If you update name, use the preferred name exactly unless you must adjust capitalization."
    : "";
  const targetFieldKeys = filterCardTextFieldKeys(input.targets);
  const needsFirstMes = targetFieldKeys.includes("first_mes");

  return [
    "You are regenerating selected fields for a SillyTavern-compatible CCv3 character card.",
    "Return ONLY valid JSON. No markdown, no commentary.",
    "Rules:",
    ...languageRequirementLines(input.outputLanguage, false),
    "- Output must be a JSON object containing ONLY the target keys listed below.",
    "- Do NOT include keys that are not in the target list.",
    "- Use standard JSON escaping for newlines (\\n). No trailing commas.",
    "- mes_example must use {{user}} and {{char}} labels if requested.",
    nameRule,
    "Regeneration rules (MANDATORY):",
    "- You are regenerating the target keys ONLY.",
    "- For each target key, produce a NEW value that is not identical to the existing value for that key.",
    "- Do NOT return the exact same text or array as the existing value for that key.",
    "- If you accidentally repeat a target value, regenerate internally until it differs.",
    "Regeneration nonce (use to vary phrasing/details; do not output it):",
    input.regenNonce ?? "(none)",
    "",
    ...povRuleLines(),
    "",
    "FIELD LENGTH & STRUCTURE PRESET (MANDATORY):",
    ...buildFieldDetailLines(options.fieldDetail, targetFieldKeys),
    "",
    ...(needsFirstMes ? firstMessageMissingOrRegenLines("target keys") : []),
    "Target keys:",
    input.targets.join(", "),
    "",
    "Existing fields:",
    JSON.stringify(input.card, null, 2),
    "",
    "Input:",
    `Idea: ${input.idea.trim()}`,
    preferredNameLine(input.requestedName, "(unchanged)"),
    `POV: ${input.pov}`,
    loreLine(input.lorebook),
  ].join("\n");
}

function languageRequirementLines(
  outputLanguage: string | undefined,
  useDefaultNegativePrompt: boolean,
) {
  const lang = normalizeOutputLanguage(outputLanguage);
  if (!lang) {
    return [];
  }

  return [
    "LANGUAGE REQUIREMENT (CRITICAL):",
    `- Write all non-image field values in ${lang} and do not mix languages.`,
    "- Keep proper names as names, but write all other prose in the selected language.",
    "- Avoid English filler words such as 'but', 'and', and 'so' in non-English text.",
    useDefaultNegativePrompt
      ? "- Always write image_prompt in English."
      : "- Always write image_prompt and negative_prompt in English.",
    "",
  ];
}

function characterGenJsonKeys(useDefaultNegativePrompt: boolean) {
  const keys = [
    "name",
    "description",
    "personality",
    "scenario",
    "first_mes",
    "mes_example",
    "tags",
    "creator_notes",
    "image_prompt",
  ];

  return useDefaultNegativePrompt
    ? [...keys, "pov"]
    : [...keys, "negative_prompt", "pov"];
}

function negativePromptRules(
  contentRating: CharacterGenContentRating,
  useDefaultNegativePrompt: boolean,
  options: { tagged?: boolean } = {},
) {
  if (useDefaultNegativePrompt) {
    return options.tagged
      ? [
          "- negative_prompt will be supplied by the app; include the tag with an empty value.",
        ]
      : ["- Do NOT output negative_prompt; the app will supply it."];
  }

  return [
    "- negative_prompt should list what to avoid.",
    "- negative_prompt: English, single line, comma-separated phrases, 200-300 characters max, no newlines.",
    contentRating === "sfw"
      ? "- negative_prompt must include nudity and explicit sexual content to avoid."
      : "- negative_prompt should focus on quality and artifacts unless the user requests otherwise.",
  ];
}

function negativePromptContentRatingLines(
  contentRating: CharacterGenContentRating,
  useDefaultNegativePrompt: boolean,
) {
  if (useDefaultNegativePrompt) {
    return [];
  }

  return [
    contentRating === "sfw"
      ? "- Keep the negative_prompt aligned with SFW output boundaries."
      : "- Do not add safety constraints to negative_prompt unless requested.",
  ];
}

function contentRatingLine(contentRating: CharacterGenContentRating) {
  return contentRating === "sfw"
    ? "Content rating: SFW only. Keep content safe and avoid sexual content."
    : "Content rating: NSFW allowed. Do not add safety constraints unless requested; focus negative_prompt on quality/artifacts.";
}

function povRuleLines() {
  return [
    "POV rules for first_mes:",
    "- first: {{char}} speaks in first person.",
    "- second: address {{user}} in second person without controlling their actions.",
    "- third: write in third person, acknowledge {{user}} presence without controlling them.",
  ];
}

function firstMessageQualityBarLines() {
  return [
    "FIRST MESSAGE (first_mes) QUALITY BAR (MANDATORY):",
    "- first_mes must read like the opening of a story scene, not a greeting.",
    "- Length and structure: follow the Field Length preset above for first_mes.",
    "- Start in medias res with concrete sensory detail and immediate context such as place, time, weather, or sound.",
    "- Show {{char}} doing something right now through action, body language, or small physical beats before or around dialogue.",
    "- Include at least one spoken line from {{char}} in quoted dialogue.",
    "- Acknowledge {{user}}'s presence naturally, but do not narrate {{user}}'s thoughts, feelings, decisions, or dialogue.",
    "- You may establish a minimal premise for {{user}} entering the scene, arriving, noticing, or standing there, but do not force choices or internal monologue onto {{user}}.",
    "- End with a hook that demands a response: a question, urgent request, reveal, or interrupting event.",
    "- Avoid generic openers like 'Greetings', 'Hello', 'How may I help', or 'Welcome'.",
    "- Do not include meta commentary.",
  ];
}

function firstMessageMissingOrRegenLines(fieldGroupLabel: string) {
  return [
    `If first_mes is among the ${fieldGroupLabel}, apply these FIRST MESSAGE requirements:`,
    "- first_mes must read like the opening of a story scene, not a greeting.",
    "- Length and structure: follow the Field Length preset above for first_mes.",
    "- Start in medias res with concrete sensory detail and immediate context.",
    "- Show {{char}} doing something right now through action, body language, or small physical beats.",
    "- Include at least one spoken line from {{char}} in quoted dialogue.",
    "- Acknowledge {{user}} without controlling their thoughts, choices, actions, feelings, or dialogue.",
    "- End with a hook that demands a response.",
    "- Avoid generic openers like 'Greetings', 'Hello', 'How may I help', or 'Welcome'.",
    "- Do not include meta commentary.",
    "",
  ];
}

function taggedFallbackLines(useDefaultNegativePrompt: boolean) {
  return [
    "#NAME#",
    "#DESCRIPTION#",
    "#PERSONALITY#",
    "#SCENARIO#",
    "#FIRST_MESSAGE#",
    "#EXAMPLE_MESSAGES#",
    "#TAGS#",
    "#CREATOR_NOTES#",
    "#IMAGE_PROMPT#",
    ...(useDefaultNegativePrompt ? [] : ["#NEGATIVE_PROMPT#"]),
    "#POV#",
  ];
}

function taggedTemplateLines() {
  return [
    "#NAME#",
    "",
    "#DESCRIPTION#",
    "",
    "#PERSONALITY#",
    "",
    "#SCENARIO#",
    "",
    "#FIRST_MESSAGE#",
    "",
    "#EXAMPLE_MESSAGES#",
    "",
    "#TAGS#",
    "",
    "#CREATOR_NOTES#",
    "",
    "#IMAGE_PROMPT#",
    "",
    "#NEGATIVE_PROMPT#",
    "",
    "#POV#",
  ];
}

function preferredNameLine(name: string | undefined, fallback: string) {
  return name?.trim()
    ? `Preferred name: ${name.trim()}`
    : `Preferred name: ${fallback}`;
}

function loreLine(lorebook: string | undefined) {
  return lorebook?.trim()
    ? `Lorebook:\n${lorebook.trim()}`
    : "Lorebook: (none)";
}

function filterCardTextFieldKeys(keys: readonly string[]): FieldKey[] {
  return keys.filter((key): key is FieldKey => CARD_TEXT_FIELD_KEY_SET.has(key));
}
