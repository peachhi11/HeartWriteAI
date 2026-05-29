import { LibrariesWorkspace } from "@/components/libraries-workspace";
import { StudioShell } from "@/components/studio-shell";

export default function LibrariesPage() {
  return (
    <StudioShell
      eyebrow="Libraries"
      title="Library"
      subtitle="Browse saved characters, personas, lorebooks, scenarios, and chat bundles."
    >
      <LibrariesWorkspace />
    </StudioShell>
  );
}
