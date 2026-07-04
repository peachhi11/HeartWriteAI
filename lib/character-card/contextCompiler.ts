import {
  applyRegexRulesToMessages,
  type RegexMacroContext,
} from "./regexScriptRegistry";
import type { RegexScriptRuleV3 } from "@/types/character-card/RegexScriptRuleV3";

export type ContextChatRole = "system" | "user" | "assistant";

export interface ContextChatMessage {
  role: ContextChatRole;
  name?: string;
  content: string;
  important?: boolean;
  milestone?: boolean;
  protected?: boolean;
  tags?: string[];
}

export interface ContextUserPersona {
  name: string;
  description: string;
}

export interface ContextCharacterState {
  name: string;
  personality: string;
  scenarioModifier?: string;
}

export interface ContextGroupChat {
  roomName: string;
  activeCharacters: ContextCharacterState[];
}

export interface ContextScenarioState {
  title: string;
  setting: string;
  sensoryAnchor: string;
  systemPromptOverride?: string;
  tone?: string;
}

export interface ContextLorebookEntry {
  key: string;
  content: string;
  depth: number;
  priority?: number;
}

export interface ContextCompilationInput {
  systemPrompt: string;
  userPersona?: ContextUserPersona | string;
  groupChat?: ContextGroupChat;
  v3Scenario?: ContextScenarioState;
  activeLorebookEntries?: ContextLorebookEntry[];
  contextDigest?: string;
  chatHistory?: ContextChatMessage[];
  maxTokens: number;
  regexMacroContext?: RegexMacroContext;
  regexRules?: RegexScriptRuleV3[];
  reserveTokens?: number;
}

export interface ContextCompilationResult {
  messages: ContextChatMessage[];
  diagnostics: {
    maxTokens: number;
    reserveTokens: number;
    staticTokens: number;
    historyBudget: number;
    includedHistoryMessages: number;
    prunedHistoryMessages: number;
    protectedHistoryMessages: number;
    totalEstimatedTokens: number;
  };
}

export type ContextTokenCounter = (text: string) => number | Promise<number>;

const DEFAULT_RESERVE_TOKENS = 500;

export class ContextCompiler {
  public static compile(input: ContextCompilationInput): ContextChatMessage[] {
    return this.compileDetailed(input).messages;
  }

  public static compileDetailed(
    input: ContextCompilationInput,
  ): ContextCompilationResult {
    return compileWithCounter(input, estimateTokens);
  }

  public static async compileWithTokenCounter(
    input: ContextCompilationInput,
    tokenCounter: ContextTokenCounter,
  ): Promise<ContextChatMessage[]> {
    return (await this.compileDetailedWithTokenCounter(input, tokenCounter)).messages;
  }

  public static async compileDetailedWithTokenCounter(
    input: ContextCompilationInput,
    tokenCounter: ContextTokenCounter,
  ): Promise<ContextCompilationResult> {
    return compileWithAsyncCounter(input, tokenCounter);
  }
}

export function estimateContextTokens(text: string): number {
  return estimateTokens(text);
}

function compileWithCounter(
  input: ContextCompilationInput,
  tokenCounter: (text: string) => number,
): ContextCompilationResult {
  const staticMessages = applyBeforeLlmRegexRules(input, buildSystemLayers(input));
  const chatHistory = applyBeforeLlmRegexRules(input, input.chatHistory ?? []);
  const staticTokens = countMessages(staticMessages, tokenCounter);
  const reserveTokens = readReserveTokens(input.reserveTokens);
  const historyBudget = Math.max(0, input.maxTokens - staticTokens - reserveTokens);
  const historyMessages = selectHistoryMessages(
    chatHistory,
    historyBudget,
    tokenCounter,
  );
  const messages = [...staticMessages, ...historyMessages.selected];
  const totalEstimatedTokens = countMessages(messages, tokenCounter);

  return {
    messages,
    diagnostics: createDiagnostics({
      input,
      reserveTokens,
      staticTokens,
      historyBudget,
      totalEstimatedTokens,
      historyMessages,
    }),
  };
}

async function compileWithAsyncCounter(
  input: ContextCompilationInput,
  tokenCounter: ContextTokenCounter,
): Promise<ContextCompilationResult> {
  const staticMessages = applyBeforeLlmRegexRules(input, buildSystemLayers(input));
  const chatHistory = applyBeforeLlmRegexRules(input, input.chatHistory ?? []);
  const staticTokens = await countMessagesAsync(staticMessages, tokenCounter);
  const reserveTokens = readReserveTokens(input.reserveTokens);
  const historyBudget = Math.max(0, input.maxTokens - staticTokens - reserveTokens);
  const historyMessages = await selectHistoryMessagesAsync(
    chatHistory,
    historyBudget,
    tokenCounter,
  );
  const messages = [...staticMessages, ...historyMessages.selected];
  const totalEstimatedTokens = await countMessagesAsync(messages, tokenCounter);

  return {
    messages,
    diagnostics: createDiagnostics({
      input,
      reserveTokens,
      staticTokens,
      historyBudget,
      totalEstimatedTokens,
      historyMessages,
    }),
  };
}

function buildSystemLayers(input: ContextCompilationInput): ContextChatMessage[] {
  const messages: ContextChatMessage[] = [];
  messages.push({
    role: "system",
    content: buildPrimarySystemBlock(input),
  });

  const characterBlock = buildGroupCharacterBlock(input.groupChat);
  if (characterBlock) {
    messages.push({ role: "system", content: characterBlock });
  }

  const userPersonaBlock = buildUserPersonaBlock(input.userPersona);
  if (userPersonaBlock) {
    messages.push({ role: "system", content: userPersonaBlock });
  }

  const loreBlock = buildLorebookBlock(input.activeLorebookEntries ?? []);
  if (loreBlock) {
    messages.push({ role: "system", content: loreBlock });
  }

  const digestBlock = buildContextDigestBlock(input.contextDigest);
  if (digestBlock) {
    messages.push({ role: "system", content: digestBlock });
  }

  return messages;
}

function buildPrimarySystemBlock(input: ContextCompilationInput): string {
  const lines = [input.systemPrompt.trim()].filter(Boolean);

  if (input.v3Scenario) {
    lines.push(
      `[CURRENT SCENARIO: "${input.v3Scenario.title}"]`,
      input.v3Scenario.tone ? `Tone Rule: ${input.v3Scenario.tone}` : "",
      `Location/Setting: ${input.v3Scenario.setting}`,
      `Sensory Environment: ${input.v3Scenario.sensoryAnchor}`,
      input.v3Scenario.systemPromptOverride
        ? `AI Execution Guidelines: ${input.v3Scenario.systemPromptOverride}`
        : "",
    );
  }

  return lines.filter(Boolean).join("\n").trim();
}

function buildGroupCharacterBlock(groupChat?: ContextGroupChat): string {
  if (!groupChat?.activeCharacters.length) {
    return "";
  }

  const characterBlocks = groupChat.activeCharacters.map((character) =>
    [
      `--- CHARACTER NAME: ${character.name} ---`,
      `Personality & Attributes: ${character.personality}`,
      character.scenarioModifier
        ? `Current Situational Alignment: ${character.scenarioModifier}`
        : "",
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    `[GROUP CHAT ENVIRONMENT: "${groupChat.roomName}"]`,
    "The following AI characters are active inside this scene. Separate their identities cleanly:",
    ...characterBlocks,
  ].join("\n\n");
}

function buildUserPersonaBlock(userPersona?: ContextUserPersona | string): string {
  if (!userPersona) {
    return "";
  }

  if (typeof userPersona === "string") {
    return userPersona.trim() ? `[USER PROFILE]\n${userPersona.trim()}` : "";
  }

  return [
    "[USER PROFILE]",
    `Name: ${userPersona.name}`,
    `Description & Traits: ${userPersona.description}`,
  ].join("\n");
}

function buildLorebookBlock(entries: ContextLorebookEntry[]): string {
  if (!entries.length) {
    return "";
  }

  const sortedEntries = [...entries].sort((a, b) => {
    const priority = (b.priority ?? 0) - (a.priority ?? 0);
    return priority === 0 ? b.depth - a.depth : priority;
  });

  return [
    "[WORLD LORE & ACTIVE CONTEXT]",
    ...sortedEntries.map((entry) => `Concept (${entry.key}): ${entry.content}`),
  ].join("\n");
}

function buildContextDigestBlock(contextDigest?: string): string {
  const digest = contextDigest?.trim();

  if (!digest) {
    return "";
  }

  return `[CONTEXT DIGEST]\n${digest}`;
}

interface HistorySelection {
  selected: ContextChatMessage[];
  includedCount: number;
  prunedCount: number;
  protectedCount: number;
}

function selectHistoryMessages(
  history: ContextChatMessage[],
  tokenBudget: number,
  tokenCounter: (text: string) => number,
): HistorySelection {
  let remaining = tokenBudget;
  const selectedIndexes = new Set<number>();

  for (let index = 0; index < history.length; index += 1) {
    if (!isProtectedHistoryMessage(history[index])) {
      continue;
    }

    const cost = countMessage(history[index], tokenCounter);
    if (cost <= remaining) {
      selectedIndexes.add(index);
      remaining -= cost;
    }
  }

  for (let index = history.length - 1; index >= 0; index -= 1) {
    if (selectedIndexes.has(index)) {
      continue;
    }

    const cost = countMessage(history[index], tokenCounter);
    if (cost <= remaining) {
      selectedIndexes.add(index);
      remaining -= cost;
    } else if (selectedIndexes.size > 0) {
      break;
    }
  }

  return createHistorySelection(history, selectedIndexes);
}

async function selectHistoryMessagesAsync(
  history: ContextChatMessage[],
  tokenBudget: number,
  tokenCounter: ContextTokenCounter,
): Promise<HistorySelection> {
  let remaining = tokenBudget;
  const selectedIndexes = new Set<number>();

  for (let index = 0; index < history.length; index += 1) {
    if (!isProtectedHistoryMessage(history[index])) {
      continue;
    }

    const cost = await countMessageAsync(history[index], tokenCounter);
    if (cost <= remaining) {
      selectedIndexes.add(index);
      remaining -= cost;
    }
  }

  for (let index = history.length - 1; index >= 0; index -= 1) {
    if (selectedIndexes.has(index)) {
      continue;
    }

    const cost = await countMessageAsync(history[index], tokenCounter);
    if (cost <= remaining) {
      selectedIndexes.add(index);
      remaining -= cost;
    } else if (selectedIndexes.size > 0) {
      break;
    }
  }

  return createHistorySelection(history, selectedIndexes);
}

function createHistorySelection(
  history: ContextChatMessage[],
  selectedIndexes: Set<number>,
): HistorySelection {
  const selected = history.filter((_, index) => selectedIndexes.has(index));
  const protectedCount = selected.filter(isProtectedHistoryMessage).length;

  return {
    selected,
    includedCount: selected.length,
    prunedCount: history.length - selected.length,
    protectedCount,
  };
}

function applyBeforeLlmRegexRules(
  input: ContextCompilationInput,
  messages: ContextChatMessage[],
) {
  if (!input.regexRules?.length && !input.regexMacroContext) {
    return messages;
  }

  return applyRegexRulesToMessages(messages, input.regexRules ?? [], "before_llm", {
    macroContext: input.regexMacroContext,
  });
}

function isProtectedHistoryMessage(message: ContextChatMessage): boolean {
  return Boolean(
    message.protected ||
      message.important ||
      message.milestone ||
      message.tags?.some((tag) => /milestone|pinned|important/i.test(tag)),
  );
}

function countMessages(
  messages: ContextChatMessage[],
  tokenCounter: (text: string) => number,
): number {
  return messages.reduce(
    (total, message) => total + countMessage(message, tokenCounter),
    0,
  );
}

async function countMessagesAsync(
  messages: ContextChatMessage[],
  tokenCounter: ContextTokenCounter,
): Promise<number> {
  let total = 0;
  for (const message of messages) {
    total += await countMessageAsync(message, tokenCounter);
  }
  return total;
}

function countMessage(
  message: ContextChatMessage,
  tokenCounter: (text: string) => number,
): number {
  return tokenCounter(formatMessageForTokenCount(message));
}

async function countMessageAsync(
  message: ContextChatMessage,
  tokenCounter: ContextTokenCounter,
): Promise<number> {
  return tokenCounter(formatMessageForTokenCount(message));
}

function formatMessageForTokenCount(message: ContextChatMessage): string {
  return [message.role, message.name, message.content].filter(Boolean).join("\n");
}

function estimateTokens(text: string): number {
  return Math.max(1, Math.ceil(text.length / 4));
}

function readReserveTokens(value: number | undefined): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return DEFAULT_RESERVE_TOKENS;
  }

  return Math.max(0, Math.round(value));
}

function createDiagnostics(input: {
  input: ContextCompilationInput;
  reserveTokens: number;
  staticTokens: number;
  historyBudget: number;
  totalEstimatedTokens: number;
  historyMessages: HistorySelection;
}): ContextCompilationResult["diagnostics"] {
  return {
    maxTokens: input.input.maxTokens,
    reserveTokens: input.reserveTokens,
    staticTokens: input.staticTokens,
    historyBudget: input.historyBudget,
    includedHistoryMessages: input.historyMessages.includedCount,
    prunedHistoryMessages: input.historyMessages.prunedCount,
    protectedHistoryMessages: input.historyMessages.protectedCount,
    totalEstimatedTokens: input.totalEstimatedTokens,
  };
}
