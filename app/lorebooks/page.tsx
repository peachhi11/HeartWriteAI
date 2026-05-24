import { LorebookGenerationPage } from "@/features/generation/components/LorebookGenerationPage";
import { StudioShell } from "@/components/studio-shell";

export default function LorebooksPage() {
  return (
    <StudioShell
      eyebrow="Lorebooks"
      title="Lorebook Studio"
      subtitle="Generate scoped lorebooks with activation keys, world rules, placeholders, and saved local records."
    >
      <LorebookGenerationPage />
    </StudioShell>
  );
}
