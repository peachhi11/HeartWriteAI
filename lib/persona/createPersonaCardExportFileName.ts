import { PersonaCard } from "../../types/persona/PersonaCard";

export function createPersonaCardExportFileName(persona: PersonaCard): string {
  const safeName = persona.displayName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${safeName || "persona"}.heartpersona.json`;
}
