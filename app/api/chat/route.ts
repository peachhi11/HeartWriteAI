import {
  appendSensoryPerceptionContext,
  appendPostHistoryOverride,
  chatRequestSchema,
} from "@/lib/character-card/postHistoryRuntime";
import { parseActiveLore } from "@/lib/character-card/lorebookParser";
import { appendRelationshipStateContext } from "@/lib/chat/relationshipStateContext";
import {
  buildChatCompletionUrl,
  createNormalizedChatStream,
  getChatProviderConfig,
} from "@/lib/chat/chatProvider";

export async function POST(request: Request) {
  const requestBody = await request.json().catch(() => undefined);
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

  return streamChatCompletion(optimizedMessages);
}

async function streamChatCompletion(messages: ReturnType<typeof appendPostHistoryOverride>) {
  const provider = getChatProviderConfig();

  const upstreamResponse = await fetch(buildChatCompletionUrl(provider.baseUrl), {
    body: JSON.stringify({
      messages,
      model: provider.model,
      stream: true,
    }),
    headers: {
      ...(provider.apiKey ? { Authorization: `Bearer ${provider.apiKey}` } : {}),
      "Content-Type": "application/json",
    },
    method: "POST",
  });

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
