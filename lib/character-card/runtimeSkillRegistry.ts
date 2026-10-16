import { runtimeSkillMetadataRecords } from "./generatedRuntimeSkillMetadata";
import { StoryRuntimeSkill, toStoryRuntimeSkill } from "./runtimeSkillMetadataAdapter";
import { createStoryRuntimeSkillSelector } from "./storyRuntimeSkillSelector";

export const storyRuntimeSkills: StoryRuntimeSkill[] =
  runtimeSkillMetadataRecords.map(toStoryRuntimeSkill);
export const storyRuntimeSkillSelector = createStoryRuntimeSkillSelector(storyRuntimeSkills);

export function getStoryRuntimeSkill(slug: string): StoryRuntimeSkill | undefined {
  return storyRuntimeSkillSelector.getBySlug(slug);
}

export function findStoryRuntimeSkillsByTag(tag: string): StoryRuntimeSkill[] {
  return storyRuntimeSkillSelector.findByTag(tag);
}

export function findStoryRuntimeSkillsByScope(
  scope: StoryRuntimeSkill["scope"][number],
): StoryRuntimeSkill[] {
  return storyRuntimeSkillSelector.findByScope(scope);
}
