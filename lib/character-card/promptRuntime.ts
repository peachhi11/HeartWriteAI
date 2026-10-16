import { createSensoryPerceptionContext, extractCardSensoryPerception } from "./sensoryPerception";
import { publicStoryRuntimeSkillSelector } from "./publicStoryRuntimeSkills";
import type { StoryRuntimeSkill } from "./runtimeSkillMetadataAdapter";
import type { StoryRuntimeSkillSelector } from "./storyRuntimeSkillSelector";

export interface RuntimeLoreEntry {
  name?: string;
  content: string;
}

export interface RuntimeChatMessage {
  speaker: string;
  content: string;
}

export interface RuntimeCharacterCard {
  data?: {
    name?: string;
    nickname?: string;
    description?: string;
    personality?: string;
    scenario?: string;
    first_mes?: string;
    mes_example?: string;
    system_prompt?: string;
    post_history_instructions?: string;
    sensory_perception?: unknown;
    tags?: string[];
    extensions?: Record<string, unknown>;
  };
}

export interface CompileChatPromptArgs {
  card: RuntimeCharacterCard;
  appSystemPrompt: string;
  userPersona?: string;
  currentScenario?: string;
  worldLore?: string;
  activeLoreEntries?: RuntimeLoreEntry[];
  retrievedMemories?: string[];
  chatHistory?: RuntimeChatMessage[];
  runtimeSkillSlugs?: readonly string[];
  runtimeSkillTags?: readonly string[];
  runtimeSkillScopes?: readonly StoryRuntimeSkill["scope"][number][];
  runtimeSkillSelector?: StoryRuntimeSkillSelector;
}

export interface CompiledChatPrompt {
  systemPrompt: string;
  systemPromptSource: "app" | "card";
  postHistoryInstructions: string;
  contextBlock: string;
}

export function compileChatPrompt({
  card,
  appSystemPrompt,
  userPersona,
  currentScenario,
  worldLore,
  activeLoreEntries = [],
  retrievedMemories = [],
  chatHistory = [],
  runtimeSkillSlugs = [],
  runtimeSkillTags = [],
  runtimeSkillScopes = [],
  runtimeSkillSelector = publicStoryRuntimeSkillSelector,
}: CompileChatPromptArgs): CompiledChatPrompt {
  const data = card.data ?? {};
  const characterName = data.nickname?.trim() || data.name?.trim() || "{{char}}";
  const sensoryPerception = extractCardSensoryPerception(data);
  const cardSystemPrompt = data.system_prompt?.trim() ?? "";
  const systemPromptSource = cardSystemPrompt ? "card" : "app";
  const systemPrompt = cardSystemPrompt
    ? cardSystemPrompt.replaceAll("{{original}}", appSystemPrompt)
    : appSystemPrompt;
  const postHistoryInstructions = data.post_history_instructions?.trim() ?? "";
  const runtimeSkills = selectRuntimeSkills({
    selector: runtimeSkillSelector,
    slugs: runtimeSkillSlugs,
    tags: runtimeSkillTags,
    scopes: runtimeSkillScopes,
  });

  const contextBlock = [
    section("Character", [
      `Name: ${characterName}`,
      data.description ? `Description: ${data.description}` : undefined,
      data.personality ? `Personality: ${data.personality}` : undefined,
      data.scenario ? `Card scenario: ${data.scenario}` : undefined,
      data.first_mes ? `Opening message: ${data.first_mes}` : undefined,
      data.mes_example ? `Dialogue examples:\n${data.mes_example}` : undefined,
      data.tags?.length ? `Tags: ${data.tags.join(", ")}` : undefined,
    ]),
    section("Current Scenario", [currentScenario]),
    section("User Persona", [userPersona]),
    section("World Lore", [worldLore]),
    section(
      "Active Lore",
      activeLoreEntries.map((entry) =>
        entry.name ? `${entry.name}: ${entry.content}` : entry.content,
      ),
    ),
    section("Retrieved Memories", retrievedMemories),
    formatRuntimeSkillContext(runtimeSkills),
    createSensoryPerceptionContext(sensoryPerception),
    section(
      "Recent Chat",
      chatHistory.map((message) => `[${message.speaker}]: ${message.content}`),
    ),
    postHistoryInstructions ? section("Final Card Instructions", [postHistoryInstructions]) : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    systemPrompt,
    systemPromptSource,
    postHistoryInstructions,
    contextBlock,
  };
}

function selectRuntimeSkills(input: {
  selector: StoryRuntimeSkillSelector;
  slugs: readonly string[];
  tags: readonly string[];
  scopes: readonly StoryRuntimeSkill["scope"][number][];
}): StoryRuntimeSkill[] {
  const selected = new Map<string, StoryRuntimeSkill>();

  for (const slug of input.slugs) {
    const skill = input.selector.getBySlug(slug);
    if (skill) selected.set(skill.slug, skill);
  }
  for (const tag of input.tags) {
    for (const skill of input.selector.findByTag(tag)) selected.set(skill.slug, skill);
  }
  for (const scope of input.scopes) {
    for (const skill of input.selector.findByScope(scope)) selected.set(skill.slug, skill);
  }

  return [...selected.values()];
}

function formatRuntimeSkillContext(skills: readonly StoryRuntimeSkill[]): string {
  if (!skills.length) return "";

  return section(
    "Runtime Skill Signals",
    skills.map(
      (skill) =>
        `${skill.label} (${skill.slug})\n- PROMPT SIGNALS: ${skill.promptCompilerSignals.join(", ")}\n- STATE FIELDS: ${skill.stateFields.join(", ")}\n- MEMORY ROUTING: ${skill.memoryRouting.join(", ")}`,
    ),
  );
}

function section(title: string, lines: Array<string | undefined>): string {
  const body = lines.map((line) => line?.trim()).filter((line): line is string => Boolean(line));

  if (!body.length) {
    return "";
  }

  return `[${title.toUpperCase()}]\n${body.join("\n")}`;
}
