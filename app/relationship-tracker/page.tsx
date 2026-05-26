import { StudioShell } from "@/components/studio-shell";
import { RelationshipTrackerWorkspace } from "@/features/relationship/components/RelationshipTrackerWorkspace";

export default function RelationshipTrackerPage() {
  return (
    <StudioShell
      eyebrow="Relationship Tracking"
      title="Relationship Tracker"
      subtitle="Read-only emotional brain, trajectory, rupture, memory, and relationship state output for the active chat."
    >
      <RelationshipTrackerWorkspace />
    </StudioShell>
  );
}
