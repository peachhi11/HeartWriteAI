import { StudioShell } from "@/components/studio-shell";
import { BundleSelectionPage } from "@/features/generation/components/BundleSelectionPage";

export default function BundlesPage() {
  return (
    <StudioShell
      eyebrow="Runtime Bundles"
      title="Bundle Selection"
      subtitle="Pair a character card with a user persona, then optionally add scenario overrides and lorebook context."
    >
      <BundleSelectionPage />
    </StudioShell>
  );
}
