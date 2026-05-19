import { PersonaCard } from "../../types/persona/PersonaCard";

const PLAYABLE_FIELD_LABELS: Array<{
  key: keyof PersonaCard["fields"];
  label: string;
}> = [
  { key: "basicDetails", label: "Basic Details" },
  { key: "appearance", label: "Appearance" },
  { key: "outfit", label: "Usual Outfit" },
  { key: "personality", label: "Personality" },
  { key: "behaviour", label: "Behaviour and Habits" },
  { key: "speech", label: "Speech" },
  { key: "exampleDialogue", label: "Example Dialogue" },
  { key: "intimacy", label: "Intimacy" },
  { key: "boundaries", label: "Boundaries" },
];

export function compilePersonaPromptBlock(persona: PersonaCard): string {
  const sections = PLAYABLE_FIELD_LABELS.flatMap(({ key, label }) => {
    const value = persona.fields[key].trim();

    return value ? [`## ${label}\n${value}`] : [];
  });

  return [`# {{user}} Persona`, ...sections].join("\n\n").trim();
}

export function compilePersonaPostHistoryInstruction(
  persona: PersonaCard,
): string {
  const notes = persona.fields.notes.trim();

  if (!notes) {
    return "";
  }

  return [
    "[PERSONA IMPERSONATION SUPPORT]",
    "Use this only when the user explicitly asks for help writing as {{user}} or generating possible {{user}} replies. Do not treat these notes as facts known by {{char}} inside the scene.",
    notes,
  ].join("\n");
}
