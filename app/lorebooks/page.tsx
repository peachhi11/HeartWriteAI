import { LorebookGenerationPage } from "@/features/generation/components/LorebookGenerationPage";
import { StudioShell } from "@/components/studio-shell";

export default function LorebooksPage() {
  return (
    <StudioShell
      eyebrow="Lorebooks"
      title="Lorebook Studio"
      subtitle="Create world info books with keywords, rules, placeholders, and saved local files."
    >
      <LorebookGenerationPage />
    </StudioShell>
  );
}
