import {
  SemanticBrainService,
  type CharacterBrain,
  type SemanticBrainPromptOptions,
} from "./semanticBrainService";

export interface SemanticBrainChatMessage {
  role: "system" | "user";
  content: string;
}

export interface CreateSemanticBrainChatTurnOptions {
  userMessage: string;
  previousBrainState: CharacterBrain;
  characterName?: string;
  systemPrompt?: string;
  promptOptions?: SemanticBrainPromptOptions;
}

export interface SemanticBrainChatTurnResult {
  updatedBrain: CharacterBrain;
  brainContextPrompt: string;
  matchedConcepts: readonly string[];
  llmPayload: readonly SemanticBrainChatMessage[];
}

export function createSemanticBrainChatTurn(
  options: CreateSemanticBrainChatTurnOptions,
): SemanticBrainChatTurnResult {
  const result = SemanticBrainService.processInput(
    options.userMessage,
    options.previousBrainState,
  );
  const brainContextPrompt = SemanticBrainService.generatePromptContext(
    result.brain,
    options.promptOptions,
  );
  const systemPrompt = createSemanticBrainSystemPrompt({
    brain: result.brain,
    brainContextPrompt,
    characterName: options.characterName,
    systemPrompt: options.systemPrompt,
  });

  return {
    updatedBrain: result.brain,
    brainContextPrompt,
    matchedConcepts: result.matchedConcepts,
    llmPayload: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: options.userMessage,
      },
    ],
  };
}

export function createSemanticBrainSystemPrompt(options: {
  brain: CharacterBrain;
  brainContextPrompt?: string;
  characterName?: string;
  systemPrompt?: string;
}): string {
  const characterName = options.characterName ?? humanizeCharacterId(
    options.brain.characterId,
  );
  const basePrompt =
    options.systemPrompt ??
    `You are playing ${characterName} in a romance roleplay. Act out their dialogue naturally.`;

  return [basePrompt.trim(), options.brainContextPrompt?.trim()]
    .filter(Boolean)
    .join("\n\n");
}

function humanizeCharacterId(characterId: string): string {
  return characterId
    .split(/[-_:]+/g)
    .filter(Boolean)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ") || "the character";
}
