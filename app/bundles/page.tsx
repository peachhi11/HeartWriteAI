import { StudioShell } from "@/components/studio-shell";
import { BundleSelectionPage } from "@/features/generation/components/BundleSelectionPage";

export default function BundlesPage() {
  return (
    <StudioShell
      eyebrow="Runtime Bundles"
      title="Bundle Selection"
      subtitle="Select saved personas, scenarios, and lorebooks into a prepared runtime context."
    >
      <BundleSelectionPage />
    </StudioShell>
  );
}
