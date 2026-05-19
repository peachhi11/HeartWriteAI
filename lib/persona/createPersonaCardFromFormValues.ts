import { currentUnixTimestamp } from "../character-card/currentUnixTimestamp";
import { PersonaCard } from "../../types/persona/PersonaCard";
import { PersonaCardFormValues } from "../../types/persona/PersonaCardFormValues";

function splitTags(value: string): string[] {
  return value
    .split(/[,\n]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function createBasicDetails(values: PersonaCardFormValues): string {
  const rows = [
    ["Name", values.displayName || "{{user}}"],
    ["Age", values.age],
    ["Gender", values.gender],
    ["Height", values.height],
    ["Eyes", values.eyes],
    ["Hair", values.hair],
    ["Body", values.body],
    ["Aesthetic", values.aesthetic],
  ];

  return rows
    .filter(([, value]) => value.trim())
    .map(([label, value]) => `- ${label}: ${value.trim()}`)
    .join("\n");
}

export function createPersonaCardFromFormValues(
  values: PersonaCardFormValues,
): PersonaCard {
  const now = currentUnixTimestamp();
  const linkedCharacters =
    values.linkedCharacterCardId || values.linkedCharacterName
      ? [
          {
            characterCardId:
              values.linkedCharacterCardId ||
              values.linkedCharacterName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            characterName: values.linkedCharacterName || "Linked Character",
            isDefaultForCharacter: values.setAsCharacterDefault,
            linkSource:
              values.creationMode === "matched_to_character"
                ? "persona_match"
                : "manual",
          } as const,
        ]
      : [];

  return {
    id: `persona-${now}`,
    schemaVersion: "heartwrite_persona_v1",
    creationMode: values.creationMode,
    displayName: values.displayName.trim() || "{{user}}",
    avatarImagePath: values.avatarImagePath.trim() || undefined,
    tags: splitTags(values.tagsText),
    vibeTags: splitTags(values.vibeTagsText),
    createdAt: now,
    updatedAt: now,
    fields: {
      basicDetails: createBasicDetails(values),
      appearance: values.appearance.trim(),
      outfit: values.outfit.trim(),
      personality: values.personality.trim(),
      behaviour: values.behaviour.trim(),
      speech: [values.speech.trim(), values.speechQuirks.trim()]
        .filter(Boolean)
        .join("\n\n"),
      exampleDialogue: values.exampleDialogue.trim(),
      intimacy: values.intimacy.trim(),
      boundaries: values.boundaries.trim(),
      notes: values.notes.trim(),
    },
    linkedCharacters,
    chatLocks: [],
    sourceCharacterCardId: values.sourceCharacterCardId.trim() || undefined,
    sourceCharacterName: values.sourceCharacterName.trim() || undefined,
  };
}
