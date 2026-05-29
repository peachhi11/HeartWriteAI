import { StudioShell } from "@/components/studio-shell";
import { RelationshipTrackerWorkspace } from "@/features/relationship/components/RelationshipTrackerWorkspace";

export default function RelationshipTrackerPage() {
  return (
    <StudioShell
      eyebrow="Relationship Tracking"
      title="Relationship Tracker"
      subtitle="Review trust, intimacy, tension, memories, and relationship changes for the active chat."
    >
      <RelationshipTrackerWorkspace />
    </StudioShell>
  );
}
