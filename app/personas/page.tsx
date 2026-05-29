import { PersonaGenerationPage } from "@/features/generation/components/PersonaGenerationPage";
import { StudioShell } from "@/components/studio-shell";

export default function PersonasPage() {
  return (
    <StudioShell
      eyebrow="Persona Matching"
      title="Persona Studio"
      subtitle="Create, save, export, and reuse {{user}} personas for character chats."
    >
      <PersonaGenerationPage />
    </StudioShell>
  );
}
