import { StudioShell } from "@/components/studio-shell";
import { BundleSelectionPage } from "@/features/generation/components/BundleSelectionPage";

export default function BundlesPage() {
  return (
    <StudioShell
      eyebrow="Chat Setup"
      title="Roleplay Bundles"
      subtitle="Pair a character with a persona, then add optional scenario notes and lorebooks."
    >
      <BundleSelectionPage />
    </StudioShell>
  );
}
