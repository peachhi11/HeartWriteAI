import { StoryMemoryDashboard } from "@/features/story-memory/components/story-memory-dashboard";
import { loadStoryMemoryWorkspace } from "@/features/story-memory/persistence/workspace";

export const dynamic = "force-dynamic";

export default async function Home() {
  const workspace = await loadStoryMemoryWorkspace();

  return (
    <StoryMemoryDashboard
      {...workspace}
    />
  );
}
