export interface RoleplayTextPart {
  type: "text";
  text: string;
}

export interface RoleplayMessage {
  id: string;
  role: "user" | "assistant";
  parts: RoleplayTextPart[];
}

export function createRoleplayMessage(
  role: RoleplayMessage["role"],
  text: string,
): RoleplayMessage {
  return {
    id: crypto.randomUUID(),
    role,
    parts: [{ type: "text", text }],
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
