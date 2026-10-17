import {
  appendSensoryPerceptionContext,
  appendPostHistoryOverride,
  chatRequestSchema,
} from "../character-card/postHistoryRuntime";
import { parseActiveLore } from "../character-card/lorebookParser";
import { appendRelationshipStateContext } from "./relationshipStateContext";
import {
  ChatProviderConfigError,
  createChatCompletionRequest,
  createNormalizedChatStream,
  getChatProviderConfig,
  getChatRoutePolicy,
  isChatRouteEnabled,
} from "./chatProvider";

export interface ChatRouteDependencies {
  env?: NodeJS.ProcessEnv;
  fetch?: typeof fetch;
}

export async function handleChatRequest(
  request: Request,
  dependencies: ChatRouteDependencies = {},
) {
  const env = dependencies.env ?? process.env;
  const fetcher = dependencies.fetch ?? globalThis.fetch;

  if (!isChatRouteEnabled(env)) {
    return Response.json({ error: "Private chat is disabled." }, { status: 404 });
  }

  const requestBody = await request.json().catch(() => undefined);

  if (
    requestBody &&
    typeof requestBody === "object" &&
    "status" in requestBody &&
    requestBody.status === "config"
  ) {
    const policy = getChatRoutePolicy(env);
    return Response.json(policy, policy.enabled && policy.error ? { status: 503 } : undefined);
  }

  const requestResult = chatRequestSchema.safeParse(requestBody);

  if (!requestResult.success) {
    return Response.json({ error: "Invalid chat request." }, { status: 400 });
  }

  const postHistory =
    requestResult.data.characterConfig?.postHistory ??
    requestResult.data.characterConfig?.postHistoryInstructions;
  const latestUserMessage =
    [...requestResult.data.messages].reverse().find((message) => message.role === "user")
      ?.content ?? "";
  const activeLoreMessages = parseActiveLore(
    latestUserMessage,
    requestResult.data.characterConfig?.loreEntries ?? [],
  );
  const relationshipAwareMessages = appendRelationshipStateContext(
    [...requestResult.data.messages, ...activeLoreMessages],
    requestResult.data.characterConfig?.relationshipState,
  );
  const sensoryAwareMessages = appendSensoryPerceptionContext(
    relationshipAwareMessages,
    requestResult.data.characterConfig?.sensoryPerception,
    requestResult.data.characterConfig?.sensoryEventState,
    requestResult.data.characterConfig?.physicalTellState,
  );
  const optimizedMessages = appendPostHistoryOverride(sensoryAwareMessages, postHistory);

  return streamChatCompletion(optimizedMessages, requestResult.data.model, env, fetcher);
}

async function streamChatCompletion(
  messages: ReturnType<typeof appendPostHistoryOverride>,
  modelOverride: string | undefined,
  env: NodeJS.ProcessEnv,
  fetcher: typeof fetch,
) {
  let provider;
  try {
    provider = getChatProviderConfig(env);
  } catch (error) {
    if (error instanceof ChatProviderConfigError) {
      return Response.json({ error: error.message }, { status: 503 });
    }
    return Response.json({ error: "Chat provider configuration is unavailable." }, { status: 503 });
  }

  let upstreamResponse: Response;
  try {
    const providerRequest = createChatCompletionRequest(provider, messages, modelOverride);
    upstreamResponse = await fetcher(providerRequest.url, providerRequest.init);
  } catch {
    return Response.json(
      { error: "The configured chat provider could not be reached." },
      { status: 502 },
    );
  }

  if (!upstreamResponse.ok || !upstreamResponse.body) {
    return Response.json(
      { error: "The configured chat provider returned an invalid stream." },
      { status: upstreamResponse.status || 502 },
    );
  }

  return new Response(createNormalizedChatStream(upstreamResponse.body), {
    headers: {
      "Cache-Control": "no-cache",
      "Content-Type": "text/event-stream; charset=utf-8",
    },
  });
}
