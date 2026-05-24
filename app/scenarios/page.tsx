import { ScenarioGenerationPage } from "@/features/generation/components/ScenarioGenerationPage";
import { StudioShell } from "@/components/studio-shell";

export default function ScenariosPage() {
  return (
    <StudioShell
      eyebrow="Scenario Generation"
      title="Scenario Studio"
      subtitle="Generate scene premises, opening constraints, sensory anchors, and saved local scenario records."
    >
      <ScenarioGenerationPage />
    </StudioShell>
  );
}
