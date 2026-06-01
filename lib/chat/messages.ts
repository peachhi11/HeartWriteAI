import type { RomanceTropeClass } from "@/types/character-card/RomanceTropeClassification";

export interface RoleplayTextPart {
  type: "text";
  text: string;
}

export interface RoleplayMessage {
  activeVariantIndex?: number;
  id: string;
  role: "user" | "assistant";
  detectedTrope?: RomanceTropeClass;
  parts: RoleplayTextPart[];
  speakerName?: string;
  swipedVariants?: string[];
  timestamp?: string;
}

export function createRoleplayMessage(
  role: RoleplayMessage["role"],
  text: string,
  detectedTrope: RomanceTropeClass = "casual",
  speakerName?: string,
): RoleplayMessage {
  return {
    detectedTrope,
    id: crypto.randomUUID(),
    role,
    parts: [{ type: "text", text }],
    speakerName: speakerName?.trim() || undefined,
    timestamp: new Date().toISOString(),
  };
}

export function getMessageText(message: RoleplayMessage) {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

export function getMessageVariants(message: RoleplayMessage) {
  const currentText = getMessageText(message);
  if (message.swipedVariants?.length) {
    return [...message.swipedVariants];
  }

  return currentText ? [currentText] : [];
}

export function updateRoleplayMessageText(
  message: RoleplayMessage,
  text: string,
): RoleplayMessage {
  const variants = getMessageVariants(message);
  const activeVariantIndex = clampVariantIndex(
    message.activeVariantIndex ?? variants.length - 1,
    variants.length,
  );

  if (variants.length > 0) {
    variants[activeVariantIndex] = text;
  }

  return {
    ...message,
    activeVariantIndex,
    parts: [{ type: "text", text }],
    swipedVariants: variants,
  };
}

export function createRegenerationVariant(
  message: RoleplayMessage,
): RoleplayMessage {
  const variants = getMessageVariants(message);
  variants.push("");

  return {
    ...message,
    activeVariantIndex: variants.length - 1,
    parts: [{ type: "text", text: "" }],
    swipedVariants: variants,
    timestamp: new Date().toISOString(),
  };
}

export function selectRoleplayMessageVariant(
  message: RoleplayMessage,
  variantIndex: number,
): RoleplayMessage {
  const variants = getMessageVariants(message);
  const activeVariantIndex = clampVariantIndex(variantIndex, variants.length);

  return {
    ...message,
    activeVariantIndex,
    parts: [{ type: "text", text: variants[activeVariantIndex] ?? "" }],
    swipedVariants: variants,
  };
}

export function navigateRoleplayMessageVariant(
  message: RoleplayMessage,
  direction: "next" | "prev",
): RoleplayMessage {
  const variants = getMessageVariants(message);

  if (variants.length <= 1) {
    return message;
  }

  const currentIndex = clampVariantIndex(
    message.activeVariantIndex ?? variants.length - 1,
    variants.length,
  );
  const offset = direction === "next" ? 1 : -1;
  const activeVariantIndex =
    (currentIndex + offset + variants.length) % variants.length;

  return {
    ...message,
    activeVariantIndex,
    parts: [{ type: "text", text: variants[activeVariantIndex] ?? "" }],
    swipedVariants: variants,
  };
}

export function appendRoleplayMessageVariant(
  message: RoleplayMessage,
  text: string,
): RoleplayMessage {
  const trimmedText = text.trim();

  if (!trimmedText) {
    return message;
  }

  const variants = getMessageVariants(message);
  variants.push(trimmedText);

  return {
    ...message,
    activeVariantIndex: variants.length - 1,
    parts: [{ type: "text", text: trimmedText }],
    swipedVariants: variants,
    timestamp: new Date().toISOString(),
  };
}

function clampVariantIndex(index: number, variantCount: number) {
  if (variantCount <= 0) {
    return 0;
  }

  return Math.min(Math.max(index, 0), variantCount - 1);
}

export function toOllamaMessages(messages: RoleplayMessage[]) {
  return messages.map((message) => ({
    role: message.role,
    content: getMessageText(message),
  }));
}
