import type { RomanceTropeClass } from "@/types/character-card/RomanceTropeClassification";

export interface RoleplayTextPart {
  type: "text";
  text: string;
}

export interface RoleplayMessage {
  id: string;
  role: "user" | "assistant";
  detectedTrope?: RomanceTropeClass;
  parts: RoleplayTextPart[];
  timestamp?: string;
}

export function createRoleplayMessage(
  role: RoleplayMessage["role"],
  text: string,
  detectedTrope: RomanceTropeClass = "casual",
): RoleplayMessage {
  return {
    detectedTrope,
    id: crypto.randomUUID(),
    role,
    parts: [{ type: "text", text }],
    timestamp: new Date().toISOString(),
  };
}

export function getMessageText(message: RoleplayMessage) {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

export function toOllamaMessages(messages: RoleplayMessage[]) {
  return messages.map((message) => ({
    role: message.role,
    content: getMessageText(message),
  }));
}
