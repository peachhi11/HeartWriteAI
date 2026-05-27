import { LibrariesWorkspace } from "@/components/libraries-workspace";
import { StudioShell } from "@/components/studio-shell";

export default function LibrariesPage() {
  return (
    <StudioShell
      eyebrow="Libraries"
      title="Library"
      subtitle="Browse saved characters, personas, lore, and bundle-ready assets."
    >
      <LibrariesWorkspace />
    </StudioShell>
  );
}
