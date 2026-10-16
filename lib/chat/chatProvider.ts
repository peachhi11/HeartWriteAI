export interface ChatCompletionMessage {
  role: "assistant" | "system" | "user";
  content: string;
}

export interface ChatProviderConfig {
  provider: "openrouter" | "ollama" | "openai-compatible";
  baseUrl: string;
  apiKey?: string;
  model: string;
}

export class ChatProviderConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ChatProviderConfigError";
  }
}

export type ChatStreamEvent =
  | { type: "text_delta"; text: string }
  | { type: "finish"; reason?: string }
  | { type: "error"; message: string };

export function getChatProviderConfig(env: NodeJS.ProcessEnv = process.env): ChatProviderConfig {
  const provider = env.HEARTWRITE_CHAT_PROVIDER;

  if (provider !== "openrouter" && provider !== "ollama" && provider !== "openai-compatible") {
    throw new ChatProviderConfigError(
      "Set HEARTWRITE_CHAT_PROVIDER to openrouter, ollama, or openai-compatible before enabling chat.",
    );
  }

  const baseUrl = (
    env.HEARTWRITE_CHAT_BASE_URL ??
    (provider === "openrouter" ? "https://openrouter.ai/api" : undefined) ??
    (provider === "ollama" ? "http://localhost:11434" : undefined)
  )?.replace(/\/$/, "");

  if (!baseUrl) {
    throw new ChatProviderConfigError(
      "Set HEARTWRITE_CHAT_BASE_URL for the selected chat provider.",
    );
  }

  const apiKey = provider === "openrouter" ? env.OPENROUTER_API_KEY : env.HEARTWRITE_CHAT_API_KEY;
  if (provider === "openrouter" && !apiKey) {
    throw new ChatProviderConfigError("Set OPENROUTER_API_KEY before enabling OpenRouter chat.");
  }

  const model =
    env.HEARTWRITE_CHAT_MODEL ??
    (provider === "openrouter" ? env.OPENROUTER_MODEL : undefined) ??
    (provider === "ollama" ? "llama3" : undefined);
  if (!model) {
    throw new ChatProviderConfigError("Set HEARTWRITE_CHAT_MODEL before enabling chat.");
  }

  return {
    provider,
    baseUrl,
    apiKey,
    model,
  };
}

export function isChatRouteEnabled(env: NodeJS.ProcessEnv = process.env) {
  return env.HEARTWRITE_CHAT_ENABLED === "1";
}

export function getChatRoutePolicy(env: NodeJS.ProcessEnv = process.env) {
  if (!isChatRouteEnabled(env)) {
    return { enabled: false as const };
  }

  try {
    const provider = getChatProviderConfig(env);
    return {
      enabled: true as const,
      provider: provider.provider,
      model: provider.model,
      credentialConfigured: Boolean(provider.apiKey),
    };
  } catch (error) {
    return {
      enabled: true as const,
      error:
        error instanceof ChatProviderConfigError
          ? error.message
          : "Chat provider configuration is unavailable.",
    };
  }
}

export function buildChatCompletionUrl(baseUrl: string) {
  return `${baseUrl.replace(/\/$/, "")}/v1/chat/completions`;
}

export function parseOpenAICompatibleSseLine(line: string): ChatStreamEvent | null {
  if (!line.startsWith("data:")) return null;

  const payload = line.slice("data:".length).trim();
  if (!payload || payload === "[DONE]") {
    return payload === "[DONE]" ? { type: "finish" } : null;
  }

  try {
    const parsed = JSON.parse(payload) as {
      choices?: Array<{
        delta?: { content?: unknown };
        finish_reason?: unknown;
      }>;
      error?: { message?: unknown };
    };
    const choice = parsed.choices?.[0];

    if (typeof parsed.error?.message === "string") {
      return { type: "error", message: parsed.error.message };
    }
    if (typeof choice?.delta?.content === "string" && choice.delta.content) {
      return { type: "text_delta", text: choice.delta.content };
    }
    if (typeof choice?.finish_reason === "string") {
      return { type: "finish", reason: choice.finish_reason };
    }
  } catch {
    return { type: "error", message: "The chat provider returned malformed stream data." };
  }

  return null;
}

export function encodeChatStreamEvent(event: ChatStreamEvent) {
  return `data: ${JSON.stringify(event)}\n\n`;
}

export function createNormalizedChatStream(upstreamBody: ReadableStream<Uint8Array>) {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstreamBody.getReader();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          buffer += decoder.decode(value, { stream: !done });
          const lines = buffer.split(/\r?\n/);
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const event = parseOpenAICompatibleSseLine(line);
            if (event) controller.enqueue(encoder.encode(encodeChatStreamEvent(event)));
          }

          if (done) {
            const finalEvent = parseOpenAICompatibleSseLine(buffer);
            if (finalEvent) controller.enqueue(encoder.encode(encodeChatStreamEvent(finalEvent)));
            break;
          }
        }
        controller.close();
      } catch {
        controller.enqueue(
          encoder.encode(
            encodeChatStreamEvent({
              type: "error",
              message: "The chat provider stream ended unexpectedly.",
            }),
          ),
        );
        controller.close();
      } finally {
        reader.releaseLock();
      }
    },
  });
}
