export type LlmProvider =
  | "ollama"
  | "openai-compatible"
  | "openrouter"
  | "proxy";

export interface LlmChatMessage {
  content: string;
  role: "assistant" | "system" | "user";
}

export interface LlmProviderConfig {
  apiKey?: string;
  baseUrl?: string;
  maxTokens?: number;
  model: string;
  provider: LlmProvider;
  temperature?: number;
  topP?: number;
}

export interface StreamParseResult {
  done: boolean;
  remainingBuffer: string;
  tokens: string[];
}

export interface LlmStreamHandlers {
  onDone?: () => void;
  onToken: (token: string) => void;
}

const DEFAULT_OPENROUTER_ENDPOINT =
  "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_OLLAMA_ENDPOINT = "http://127.0.0.1:11434/api/chat";
const DEFAULT_OPENAI_COMPATIBLE_ENDPOINT =
  "http://127.0.0.1:1234/v1/chat/completions";

export async function streamLlmCompletion(
  messages: LlmChatMessage[],
  config: LlmProviderConfig,
  handlers: LlmStreamHandlers,
): Promise<void> {
  const response = await fetch(resolveProviderEndpoint(config), {
    body: JSON.stringify(createProviderBody(messages, config)),
    headers: createProviderHeaders(config),
    method: "POST",
  });

  if (!response.ok || !response.body) {
    throw new Error(
      `${formatProviderName(config.provider)} returned HTTP ${response.status}`,
    );
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let doneSeen = false;

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    const parsed = parseProviderStreamChunk(
      config.provider,
      buffer + decoder.decode(value, { stream: true }),
    );

    buffer = parsed.remainingBuffer;
    doneSeen = doneSeen || parsed.done;
    parsed.tokens.forEach(handlers.onToken);
  }

  if (buffer.trim()) {
    const parsed = parseProviderStreamChunk(config.provider, `${buffer}\n`);
    doneSeen = doneSeen || parsed.done;
    parsed.tokens.forEach(handlers.onToken);
  }

  if (doneSeen) {
    handlers.onDone?.();
  }
}

export function parseProviderStreamChunk(
  provider: LlmProvider,
  buffer: string,
): StreamParseResult {
  const lines = buffer.split("\n");
  const remainingBuffer = lines.pop() ?? "";
  const tokens: string[] = [];
  let done = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      continue;
    }

    if (
      provider === "openrouter" ||
      provider === "openai-compatible" ||
      provider === "proxy"
    ) {
      const parsed = parseOpenRouterStreamLine(line);
      if (parsed.done) {
        done = true;
      }
      if (parsed.token) {
        tokens.push(parsed.token);
      }
      continue;
    }

    const parsed = parseOllamaStreamLine(line);
    if (parsed.done) {
      done = true;
    }
    if (parsed.token) {
      tokens.push(parsed.token);
    }
  }

  return { done, remainingBuffer, tokens };
}

function parseOpenRouterStreamLine(line: string) {
  if (line === "data: [DONE]") {
    return { done: true, token: "" };
  }

  if (!line.startsWith("data: ")) {
    return { done: false, token: "" };
  }

  try {
    const parsed = JSON.parse(line.slice(6)) as {
      choices?: Array<{
        delta?: { content?: string };
        finish_reason?: string | null;
      }>;
    };
    const choice = parsed.choices?.[0];

    return {
      done: Boolean(choice?.finish_reason),
      token: choice?.delta?.content ?? "",
    };
  } catch {
    return { done: false, token: "" };
  }
}

function parseOllamaStreamLine(line: string) {
  try {
    const parsed = JSON.parse(line) as {
      done?: boolean;
      message?: { content?: string };
      response?: string;
    };

    return {
      done: Boolean(parsed.done),
      token: parsed.message?.content ?? parsed.response ?? "",
    };
  } catch {
    return { done: false, token: "" };
  }
}

function createProviderBody(
  messages: LlmChatMessage[],
  config: LlmProviderConfig,
) {
  if (
    config.provider === "openrouter" ||
    config.provider === "openai-compatible" ||
    config.provider === "proxy"
  ) {
    return {
      max_tokens: config.maxTokens,
      messages,
      model: config.model,
      stream: true,
      temperature: config.temperature,
      top_p: config.topP,
    };
  }

  return {
    messages,
    model: config.model,
    options: {
      num_predict: config.maxTokens,
      temperature: config.temperature,
      top_p: config.topP,
    },
    stream: true,
  };
}

function createProviderHeaders(config: LlmProviderConfig) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (config.provider === "openrouter") {
    if (!config.apiKey?.trim()) {
      throw new Error("OpenRouter API key is required for streaming.");
    }

    headers.Authorization = `Bearer ${config.apiKey.trim()}`;
    headers["HTTP-Referer"] = "https://heartwriteai.local";
    headers["X-Title"] = "HeartWriteAI";
  }

  return headers;
}

function resolveProviderEndpoint(config: LlmProviderConfig) {
  if (config.provider === "openai-compatible") {
    return normalizeOpenAiCompatibleEndpoint(
      config.baseUrl ?? DEFAULT_OPENAI_COMPATIBLE_ENDPOINT,
    );
  }

  if (config.provider === "proxy") {
    return config.baseUrl ?? "http://127.0.0.1:3000/api/chat";
  }

  return config.baseUrl ?? (config.provider === "openrouter"
    ? DEFAULT_OPENROUTER_ENDPOINT
    : DEFAULT_OLLAMA_ENDPOINT);
}

function formatProviderName(provider: LlmProvider) {
  if (provider === "openrouter") {
    return "OpenRouter";
  }

  if (provider === "openai-compatible") {
    return "OpenAI-compatible local";
  }

  return provider === "proxy" ? "Proxy/API" : "Ollama";
}

function normalizeOpenAiCompatibleEndpoint(baseUrl: string) {
  const url = new URL(baseUrl);
  const normalizedPath = url.pathname.replace(/\/+$/g, "");

  if (normalizedPath === "/v1") {
    url.pathname = "/v1/chat/completions";
  }

  return url.toString();
}
