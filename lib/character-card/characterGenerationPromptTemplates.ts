export type CharacterGenerationPromptSection =
  | "character"
  | "scenario"
  | "opening";

export interface CompileCharacterGenerationPromptOptions {
  sections?: CharacterGenerationPromptSection[];
  sourceMode?: "provided_context" | "research_notes";
  includeAdultFields?: boolean;
}

export interface CompileStructuredScenarioPromptOptions {
  premisePlaceholder?: string;
}

export interface CompileInitialStarterPromptOptions {
  scenarioPlaceholder?: string;
}

export const HEARTWRITE_CHARACTER_GENERATION_CARD_PROMPT = [
  "Generate a CCv3-ready {{char}} character card from the provided description and context.",
  "",
  "Use the provided material as source evidence. If research notes are included, synthesize them carefully, but do not claim live browsing or invent exact source counts.",
  "Preserve {{char}} macros literally. Do not replace {{char}} or {{user}} with names.",
  "Write compact, high-signal fields that help an LLM roleplay the character consistently.",
  "",
  "Required card fields:",
  "- name",
  "- description",
  "- personality",
  "- scenario",
  "- first_mes",
  "- mes_example",
  "- creator_notes",
  "- system_prompt",
  "- post_history_instructions",
  "- tags",
  "",
  "Character content guidance:",
  "- Make personality specific, behavioral, and voice-oriented rather than generic.",
  "- Include habits, quirks, values, contradictions, recurring choices, and social tells.",
  "- Include appearance only as roleplay-relevant visual texture; avoid turning the card into a measurement checklist.",
  "- Include occupation, routine, skills, goals, likes, dislikes, and relationships when they matter.",
  "- Include weapons or combat details only when applicable.",
  "- Keep adult anatomy or erotic presentation out unless the user explicitly requests an adult-only NSFW card.",
  "- If adult-only NSFW details are requested, keep them fictional, consensual, adult-scoped, and compatible with the character's sex, gender, species, and body plan.",
  "- Do not force binary anatomy assumptions onto trans, intersex, synthetic, alien, shapeshifter, or nonhuman characters.",
  "",
  "Prompt safety and continuity:",
  "- Do not write {{user}}'s thoughts, actions, decisions, or dialogue.",
  "- Do not invent unsupported canon, secret lore, or major motivations.",
  "- Treat the card as a baseline identity that can develop through roleplay.",
  "- Keep the character recognizable while leaving room for earned change.",
].join("\n");

export const HEARTWRITE_CHARACTER_GENERATION_SCENARIO_PROMPT = [
  "Write the scenario field for an LLM roleplay character card.",
  "",
  "The scenario must be clear instructions and definitions for the model, not a finished scene.",
  "Keep it concise, open-ended, and reusable across many possible starts.",
  "",
  "Include:",
  "- {{char}}'s everyday life and current circumstances",
  "- {{char}}'s relationship or likely point of contact with {{user}}",
  "- {{char}}'s daily routine across morning, day, and evening",
  "- {{char}}'s current mood",
  "- {{char}}'s current plans or pressures",
  "- story openings that invite interaction without deciding {{user}}'s behavior",
  "",
  "The scenario should reflect {{char}}'s personality, habits, speech style, social role, and setting pressures.",
  "Do not build the opening message here.",
].join("\n");

export const HEARTWRITE_STRUCTURED_SCENARIO_GENERATION_PROMPT = [
  "Generate a roleplay scenario from the provided premise.",
  "",
  "Use the premise as a flexible seed, not a command to force outcomes.",
  "Keep {{char}} and {{user}} macros literal.",
  "Do not decide {{user}}'s actions, thoughts, feelings, dialogue, consent, or allegiance.",
  "Do not build the opening message here.",
  "",
  "Develop these scenario layers:",
  "1. Setting: describe the world, location, tone, era or genre, and key rules.",
  "2. The Relationship: define the trope or status, past context, and current perception.",
  "3. The Plot: define the immediate context, plot hook, pressure, and conflict.",
  "",
  "Give the output in exactly this format:",
  "",
  "[SETTING & WORLD]",
  "- Location: [specific place where the scenario can begin]",
  "- Era/Genre: [genre, era, and tonal frame]",
  "- Key Rules: [setting rules, social rules, magical rules, technology rules, or immediate environmental pressures]",
  "",
  "[THE RELATIONSHIP]",
  "- Status: [relationship trope, power/status relation, or emotional baseline]",
  "- Past: [brief shared history, rumor, obligation, misunderstanding, or reason they know of each other]",
  "- Current Perception: [how {{char}} currently understands or misreads {{user}} without controlling {{user}}]",
  "",
  "[THE PLOT]",
  "- Context: [the immediate situation that brings {{char}} and {{user}} into contact]",
  "- Immediate Goal: [what {{char}} wants to learn, protect, repair, resist, negotiate, or achieve right now]",
].join("\n");

export const HEARTWRITE_CHARACTER_GENERATION_OPENING_PROMPT = [
  "Write {{char}}'s starting message for the generated roleplay card.",
  "",
  "Keep it to a maximum of three paragraphs.",
  "Balance immersive narration with {{char}} dialogue.",
  "Use 3rd person past tense narration and 1st person present tense dialogue.",
  "Do not control, decide, or imply {{user}}'s thoughts, actions, dialogue, or feelings.",
  "End before {{user}} needs to respond.",
  "",
  "Style guidance:",
  "- Start close to an active moment, not a biography dump.",
  "- Let {{char}}'s personality show through action, word choice, restraint, and subtext.",
  "- Use concrete sensory and behavioral detail without over-focusing on eyes.",
  "- Keep the opening flexible enough for many possible {{user}} responses.",
].join("\n");

export const HEARTWRITE_INITIAL_STARTER_PROMPT = [
  "Write the initial starter prompt / first message for a roleplay character card.",
  "",
  "Length and style:",
  "- Write 4-6 paragraphs.",
  "- Use vivid, sensory, cinematic literary grounded prose with no purple phrasing.",
  "- Use 3rd person past tense narrative.",
  '- Use 1st person present tense dialogue wrapped in double quotes.',
  "- Use {{char}}'s internal thoughts in 1st person present tense wrapped in asterisks.",
  "",
  "Scene anchor:",
  "- Describe what {{char}} is doing right before {{user}} interacts with them.",
  "- Start close to a concrete moment with physical action, sensory detail, and situational pressure.",
  "- Let {{char}}'s mood, habits, role, and relationship context appear through behavior rather than exposition.",
  "- End with an open-ended action or question directed at {{user}} that invites a reply.",
  "",
  "POV:",
  "- Anchor narration to {{char}} only.",
  "- Limit narration to what {{char}} can directly perceive, physically feel, remember, or reasonably infer.",
  "- No omniscient narration.",
  "- No head-hopping.",
  "",
  "User boundary:",
  "- Never write {{user}}'s dialogue, actions, thoughts, feelings, intentions, or decisions.",
  "- Never assume {{user}}'s reaction.",
  "- Stop before {{user}} would need to act, speak, decide, or feel.",
].join("\n");

const DEFAULT_CHARACTER_GENERATION_SECTIONS: CharacterGenerationPromptSection[] = [
  "character",
  "scenario",
  "opening",
];

export function compileCharacterGenerationPromptTemplate(
  options: CompileCharacterGenerationPromptOptions = {},
): string {
  const sections = options.sections ?? DEFAULT_CHARACTER_GENERATION_SECTIONS;
  const promptParts: string[] = [];

  if (sections.includes("character")) {
    promptParts.push(HEARTWRITE_CHARACTER_GENERATION_CARD_PROMPT);
  }

  if (sections.includes("scenario")) {
    promptParts.push(HEARTWRITE_CHARACTER_GENERATION_SCENARIO_PROMPT);
  }

  if (sections.includes("opening")) {
    promptParts.push(HEARTWRITE_CHARACTER_GENERATION_OPENING_PROMPT);
  }

  const sourceInstruction =
    options.sourceMode === "research_notes"
      ? "Source mode: use supplied research notes as evidence and mark uncertain details as uncertain."
      : "Source mode: use only the provided character brief and app context unless separate research notes are supplied.";

  const adultInstruction = options.includeAdultFields
    ? "Adult field mode: adult-only NSFW details may be generated when explicitly supported by the brief, but consent, age, agency, and body compatibility remain mandatory."
    : "Adult field mode: omit explicit anatomy, lingerie, eroticized measurements, and NSFW presentation.";

  return [
    sourceInstruction,
    adultInstruction,
    "",
    ...promptParts,
  ].join("\n\n");
}

export function compileStructuredScenarioPromptTemplate(
  options: CompileStructuredScenarioPromptOptions = {},
): string {
  const premise =
    options.premisePlaceholder?.trim() ||
    "[Insert your basic idea, theme, character, trope, or conflict here]";

  return [
    `Please provide a scenario based on the following premise: ${premise}`,
    "",
    HEARTWRITE_STRUCTURED_SCENARIO_GENERATION_PROMPT,
  ].join("\n");
}

export function compileInitialStarterPromptTemplate(
  options: CompileInitialStarterPromptOptions = {},
): string {
  const scenario =
    options.scenarioPlaceholder?.trim() ||
    "[Insert the generated scenario, character card context, or opening premise here]";

  return [
    "Write the first message from this scenario/context:",
    scenario,
    "",
    HEARTWRITE_INITIAL_STARTER_PROMPT,
  ].join("\n");
}
