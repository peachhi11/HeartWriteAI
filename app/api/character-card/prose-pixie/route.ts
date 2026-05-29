import { z } from "zod";

const prosePixieRequestSchema = z.object({
  actionId: z.string(),
  actionInstruction: z.string().min(1).max(1200),
  actionLabel: z.string().min(1).max(80),
  adultModeEnabled: z.boolean().default(false),
  characterName: z.string().max(120).default(""),
  customInstruction: z.string().max(1200).default(""),
  fieldLabel: z.string().min(1).max(120),
  originalText: z.string().min(1).max(20000),
});

export async function POST(request: Request) {
  const requestBody = await request.json().catch(() => undefined);
  const requestResult = prosePixieRequestSchema.safeParse(requestBody);

  if (!requestResult.success) {
    return Response.json({ error: "Invalid Prose Pixie request." }, { status: 400 });
  }

  const payload = requestResult.data;

  if (payload.actionId === "uncensored" && !payload.adultModeEnabled) {
    return Response.json(
      { error: "Uncensored mode is locked until adult content is enabled for this card." },
      { status: 403 },
    );
  }

  const endpoint = process.env.YOUR_API_CHAT_ENDPOINT;

  if (!endpoint) {
    return Response.json(
      {
        error:
          "Your AI provider is not configured yet. Prose Pixie is ready, but needs an AI connection before it can draft rewrites.",
      },
      { status: 501 },
    );
  }

  const upstreamResponse = await fetch(endpoint, {
    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content:
            "You are Prose Pixie, a character-card prose editor. Rewrite only the requested field. Return only the revised field text. Preserve canon facts, names, placeholders like {{char}} and {{user}}, and the user's stated content rating boundaries.",
        },
        {
          role: "user",
          content: buildRewritePrompt(payload),
        },
      ],
      model: process.env.YOUR_API_CHAT_MODEL ?? "YOUR_API_CHAT_MODEL",
      stream: false,
    }),
    headers: {
      Authorization: process.env.YOUR_API_KEY
        ? `Bearer ${process.env.YOUR_API_KEY}`
        : "",
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  const upstreamPayload = await upstreamResponse.json().catch(() => null);

  if (!upstreamResponse.ok) {
    return Response.json(
      { error: "Your AI provider rejected the Prose Pixie request." },
      { status: upstreamResponse.status || 502 },
    );
  }

  const rewrittenText = extractTextFromProviderPayload(upstreamPayload);

  if (!rewrittenText) {
    return Response.json(
      { error: "Your AI provider did not return usable rewritten text." },
      { status: 502 },
    );
  }

  return Response.json({ rewrittenText });
}

function buildRewritePrompt(payload: z.infer<typeof prosePixieRequestSchema>) {
  const customInstruction = payload.customInstruction.trim()
    ? `\nExtra user direction:\n${payload.customInstruction.trim()}`
    : "";

  return [
    `Character: ${payload.characterName || "Unnamed character"}`,
    `Field: ${payload.fieldLabel}`,
    `Mode: ${payload.actionLabel}`,
    `Mode instruction: ${payload.actionInstruction}`,
    `Adult mode enabled: ${payload.adultModeEnabled ? "yes" : "no"}`,
    customInstruction,
    "Original field text:",
    payload.originalText,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function extractTextFromProviderPayload(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  const record = payload as Record<string, unknown>;

  if (typeof record.output_text === "string") {
    return record.output_text.trim();
  }

  if (typeof record.text === "string") {
    return record.text.trim();
  }

  const choices = record.choices;
  if (Array.isArray(choices)) {
    for (const choice of choices) {
      if (!choice || typeof choice !== "object") {
        continue;
      }

      const choiceRecord = choice as Record<string, unknown>;
      const message = choiceRecord.message;
      if (message && typeof message === "object") {
        const content = (message as Record<string, unknown>).content;
        if (typeof content === "string") {
          return content.trim();
        }
      }

      if (typeof choiceRecord.text === "string") {
        return choiceRecord.text.trim();
      }
    }
  }

  return "";
}
