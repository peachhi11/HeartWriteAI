import { PersonaGenerationPage } from "@/features/generation/components/PersonaGenerationPage";
import { StudioShell } from "@/components/studio-shell";

export default function PersonasPage() {
  return (
    <StudioShell
      eyebrow="Persona Matching"
      title="Persona Studio"
      subtitle="Generate, save, export, and reload user personas before chat runtime consumes them."
    >
      <PersonaGenerationPage />
    </StudioShell>
  );
}
