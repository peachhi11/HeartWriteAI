import type { ChatMessage } from "@/types/chat";

export function compileChatTranscript(messages: ChatMessage[]) {
  const lines = [
    "==================================================",
    "             HEARTWRITEAI STORY LOG              ",
    `          Export Generated: ${new Date().toISOString()}`,
    "==================================================",
    "",
  ];

  for (const message of messages) {
    const speaker = formatSpeaker(message);
    const mood = formatMood(message.detectedTrope);

    lines.push(`[${message.timestamp}] ${speaker} (Mood: ${mood})`);
    lines.push(`  ${message.text.trim()}`);
    lines.push("");
  }

  lines.push("--------------------------------------------------");
  lines.push("End of Story Log. Built with HeartWriteAI.");

  return lines.join("\n");
}

export function downloadChatTranscript(messages: ChatMessage[]) {
  const browserGlobal = globalThis as typeof globalThis & {
    document?: BrowserDocument;
  };
  const browserDocument = browserGlobal.document;

  if (!browserDocument) {
    throw new Error("Browser transcript download is unavailable here.");
  }

  const transcript = compileChatTranscript(messages);
  const blob = new Blob([transcript], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = browserDocument.createElement("a");

  anchor.href = url;
  anchor.download = "heartwriteai-story-transcript.txt";
  anchor.rel = "noopener";
  browserDocument.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

type BrowserDocument = {
  body: {
    appendChild: (node: unknown) => void;
  };
  createElement: (tagName: "a") => {
    click: () => void;
    download: string;
    href: string;
    rel: string;
    remove: () => void;
  };
};

function formatSpeaker(message: ChatMessage) {
  if (message.speakerName) {
    return message.speakerName.toUpperCase();
  }

  if (message.role === "Player") {
    return "YOU";
  }

  if (message.role === "NPC") {
    return "CHARACTER";
  }

  return message.role.toUpperCase();
}

function formatMood(value: string) {
  return value
    .split("_")
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}
