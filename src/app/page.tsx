import { StoryMemoryDashboard } from "@/features/story-memory/components/story-memory-dashboard";
import {
  activeStory,
  corePromptPacks,
  groupedCategoryTags,
  sampleCharacters,
  samplePromptPacks,
  sampleRelationships,
  sampleScenes,
  sampleSecrets,
} from "@/features/story-memory/data/dashboard-seed";

export default function Home() {
  return (
    <StoryMemoryDashboard
      categoryTags={groupedCategoryTags}
      corePromptPacks={corePromptPacks}
      initialCharacters={sampleCharacters}
      initialPromptPacks={samplePromptPacks}
      initialRelationships={sampleRelationships}
      initialScenes={sampleScenes}
      initialSecrets={sampleSecrets}
      story={activeStory}
    />
  );
}
