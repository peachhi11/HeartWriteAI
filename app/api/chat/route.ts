import {
  appendSensoryPerceptionContext,
  appendPostHistoryOverride,
  chatRequestSchema,
} from "@/lib/character-card/postHistoryRuntime";
import { parseActiveLore } from "@/lib/character-card/lorebookParser";
import { appendRelationshipStateContext } from "@/lib/chat/relationshipStateContext";

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
    [...requestResult.data.messages]
      .reverse()
      .find((message) => message.role === "user")?.content ?? "";
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
  const optimizedMessages = appendPostHistoryOverride(
    sensoryAwareMessages,
    postHistory,
  );

  return streamYourApiChatCompletion(optimizedMessages);
}

async function streamYourApiChatCompletion(
  messages: ReturnType<typeof appendPostHistoryOverride>,
) {
  const endpoint = process.env.YOUR_API_CHAT_ENDPOINT;

  if (!endpoint) {
    return Response.json(
      {
        error:
          "Your AI provider is not configured yet. Chat replies need an AI connection before they can stream.",
        messages,
      },
      { status: 501 },
    );
  }

  const upstreamResponse = await fetch(endpoint, {
    body: JSON.stringify({
      messages,
      model: process.env.YOUR_API_CHAT_MODEL ?? "YOUR_API_CHAT_MODEL",
      stream: true,
    }),
    headers: {
      Authorization: process.env.YOUR_API_KEY
        ? `Bearer ${process.env.YOUR_API_KEY}`
        : "",
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!upstreamResponse.ok || !upstreamResponse.body) {
    return Response.json(
      { error: "Your AI provider returned an invalid reply stream." },
      { status: upstreamResponse.status || 502 },
    );
  }

  return new Response(upstreamResponse.body, {
    headers: {
      "Cache-Control": "no-cache",
      "Content-Type":
        upstreamResponse.headers.get("Content-Type") ??
        "text/event-stream; charset=utf-8",
    },
  });
}
