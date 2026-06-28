import {
  createSensoryPerceptionContext,
  extractCardSensoryPerception,
} from "./sensoryPerception";
import {
  compileNarrativeRuntimePromptContext,
  type NarrativeRuntimeState,
} from "./narrativeEngine";

export interface RuntimeLoreEntry {
  name?: string;
  content: string;
}

export interface RuntimeChatMessage {
  speaker: string;
  content: string;
  important?: boolean;
  milestone?: boolean;
  tags?: string[];
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
  narrativeRuntime?: NarrativeRuntimeState;
  narrativeRuntimeContext?: string;
  chatHistory?: RuntimeChatMessage[];
  contextGuard?: RuntimeContextGuardOptions;
}

export interface CompiledChatPrompt {
  systemPrompt: string;
  systemPromptSource: "app" | "card";
  postHistoryInstructions: string;
  contextBlock: string;
}

export interface RuntimeContextGuardOptions {
  maxRecentChatCharacters?: number;
  maxRecentChatMessages?: number;
  maxMessageCharacters?: number;
  protectedMilestoneKeywords?: string[];
}

const DEFAULT_CONTEXT_GUARD = {
  maxRecentChatCharacters: 12_000,
  maxRecentChatMessages: 48,
  maxMessageCharacters: 2_000,
  protectedMilestoneKeywords: [
    "betrayal",
    "breakup",
    "commitment",
    "confession",
    "first kiss",
    "forgive",
    "milestone",
    "promise",
    "secret",
    "trust",
  ],
} satisfies Required<RuntimeContextGuardOptions>;

export function compileChatPrompt({
  card,
  appSystemPrompt,
  userPersona,
  currentScenario,
  worldLore,
  activeLoreEntries = [],
  retrievedMemories = [],
  narrativeRuntime,
  narrativeRuntimeContext,
  chatHistory = [],
  contextGuard,
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
  const guardedRecentChat = createGuardedRecentChatContext(
    chatHistory,
    contextGuard,
  );
  const narrativeContext =
    narrativeRuntimeContext?.trim() ||
    (narrativeRuntime
      ? compileNarrativeRuntimePromptContext(narrativeRuntime)
      : "");

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
    narrativeContext ? section("Narrative Runtime", [narrativeContext]) : "",
    createSensoryPerceptionContext(sensoryPerception),
    guardedRecentChat,
    postHistoryInstructions
      ? section("Final Card Instructions", [postHistoryInstructions])
      : "",
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

export function createGuardedRecentChatContext(
  chatHistory: RuntimeChatMessage[],
  options: RuntimeContextGuardOptions = {},
): string {
  const guard = {
    maxRecentChatCharacters:
      options.maxRecentChatCharacters ??
      DEFAULT_CONTEXT_GUARD.maxRecentChatCharacters,
    maxRecentChatMessages:
      options.maxRecentChatMessages ?? DEFAULT_CONTEXT_GUARD.maxRecentChatMessages,
    maxMessageCharacters:
      options.maxMessageCharacters ?? DEFAULT_CONTEXT_GUARD.maxMessageCharacters,
    protectedMilestoneKeywords:
      options.protectedMilestoneKeywords ??
      DEFAULT_CONTEXT_GUARD.protectedMilestoneKeywords,
  };
  const maxRecentChatCharacters = Math.max(1_000, guard.maxRecentChatCharacters);
  const maxRecentChatMessages = Math.max(1, guard.maxRecentChatMessages);
  const maxMessageCharacters = Math.min(
    Math.max(200, guard.maxMessageCharacters),
    Math.max(200, maxRecentChatCharacters - 120),
  );
  const formattedHistory = chatHistory
    .map((message, index) => ({
      index,
      isMilestone: isProtectedMilestone(message, guard.protectedMilestoneKeywords),
      line: formatRuntimeChatMessage(message, maxMessageCharacters),
    }))
    .filter((entry) => entry.line);

  if (!formattedHistory.length) {
    return "";
  }

  const selectedRecent: typeof formattedHistory = [];
  let usedCharacters = 0;

  for (let index = formattedHistory.length - 1; index >= 0; index -= 1) {
    if (selectedRecent.length >= maxRecentChatMessages) {
      break;
    }

    const entry = formattedHistory[index];
    const nextSize = entry.line.length + 1;

    if (usedCharacters + nextSize > maxRecentChatCharacters) {
      break;
    }

    selectedRecent.unshift(entry);
    usedCharacters += nextSize;
  }

  const selectedIds = new Set(selectedRecent.map((entry) => entry.index));
  const milestoneBudget = Math.max(600, Math.floor(maxRecentChatCharacters * 0.25));
  const protectedMilestones: typeof formattedHistory = [];
  let milestoneCharacters = 0;

  for (const entry of formattedHistory) {
    if (!entry.isMilestone || selectedIds.has(entry.index)) {
      continue;
    }

    const milestoneLine = `[Milestone preserved] ${entry.line}`;
    const nextSize = milestoneLine.length + 1;

    if (milestoneCharacters + nextSize > milestoneBudget) {
      continue;
    }

    protectedMilestones.push({
      ...entry,
      line: milestoneLine,
    });
    milestoneCharacters += nextSize;
  }

  const visibleCount = selectedRecent.length + protectedMilestones.length;
  const trimmedCount = Math.max(0, formattedHistory.length - visibleCount);
  const lines = [
    trimmedCount
      ? `[Context Guard]: Trimmed ${trimmedCount} older message${trimmedCount === 1 ? "" : "s"} to keep the runtime prompt bounded.`
      : undefined,
    protectedMilestones.length
      ? `[Context Guard]: Preserved ${protectedMilestones.length} milestone message${protectedMilestones.length === 1 ? "" : "s"} outside the recent window.`
      : undefined,
    ...protectedMilestones.map((entry) => entry.line),
    ...selectedRecent.map((entry) => entry.line),
  ];

  return section("Recent Chat", lines);
}

function formatRuntimeChatMessage(
  message: RuntimeChatMessage,
  maxMessageCharacters: number,
) {
  const speaker = clampText(message.speaker.trim() || "Unknown", 80);
  const content = clampText(message.content.trim(), maxMessageCharacters);

  if (!content) {
    return "";
  }

  return `[${speaker}]: ${content}`;
}

function isProtectedMilestone(
  message: RuntimeChatMessage,
  milestoneKeywords: string[],
) {
  if (message.important || message.milestone) {
    return true;
  }

  const tags = message.tags?.map((tag) => tag.trim().toLowerCase()) ?? [];
  if (tags.some((tag) => tag === "milestone" || tag === "memory")) {
    return true;
  }

  const content = message.content.toLowerCase();
  return milestoneKeywords.some((keyword) =>
    content.includes(keyword.toLowerCase()),
  );
}

function clampText(value: string, maxCharacters: number) {
  if (value.length <= maxCharacters) {
    return value;
  }

  return `${value.slice(0, Math.max(0, maxCharacters - 15)).trimEnd()}... [truncated]`;
}

function section(title: string, lines: Array<string | undefined>): string {
  const body = lines
    .map((line) => line?.trim())
    .filter((line): line is string => Boolean(line));

  if (!body.length) {
    return "";
  }

  return `[${title.toUpperCase()}]\n${body.join("\n")}`;
}
