import {
  appendSensoryPerceptionContext,
  appendPostHistoryOverride,
  chatRequestSchema,
} from "@/lib/character-card/postHistoryRuntime";
import { parseActiveLore } from "@/lib/character-card/lorebookParser";
import { appendRelationshipStateContext } from "@/lib/chat/relationshipStateContext";
import {
  ChatProviderConfigError,
  createChatCompletionRequest,
  createNormalizedChatStream,
  getChatProviderConfig,
  getChatRoutePolicy,
  isChatRouteEnabled,
} from "@/lib/chat/chatProvider";

export async function POST(request: Request) {
  if (!isChatRouteEnabled()) {
    return Response.json({ error: "Private chat is disabled." }, { status: 404 });
  }

  const requestBody = await request.json().catch(() => undefined);

  if (
    requestBody &&
    typeof requestBody === "object" &&
    "status" in requestBody &&
    requestBody.status === "config"
  ) {
    const policy = getChatRoutePolicy();
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

  return streamChatCompletion(optimizedMessages, requestResult.data.model);
}

async function streamChatCompletion(
  messages: ReturnType<typeof appendPostHistoryOverride>,
  modelOverride?: string,
) {
  let provider;
  try {
    provider = getChatProviderConfig();
  } catch (error) {
    if (error instanceof ChatProviderConfigError) {
      return Response.json({ error: error.message }, { status: 503 });
    }
    return Response.json({ error: "Chat provider configuration is unavailable." }, { status: 503 });
  }

  let upstreamResponse: Response;
  try {
    const request = createChatCompletionRequest(provider, messages, modelOverride);
    upstreamResponse = await fetch(request.url, request.init);
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
