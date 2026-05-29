import { ScenarioGenerationPage } from "@/features/generation/components/ScenarioGenerationPage";
import { StudioShell } from "@/components/studio-shell";

export default function ScenariosPage() {
  return (
    <StudioShell
      eyebrow="Scenarios"
      title="Scenario Studio"
      subtitle="Create scene premises, opening pressure, sensory details, and saved scenarios."
    >
      <ScenarioGenerationPage />
    </StudioShell>
  );
}
