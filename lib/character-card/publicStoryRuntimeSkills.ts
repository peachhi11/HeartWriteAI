import { publicRuntimeSkillMetadataRecords } from "./generatedPublicRuntimeSkillMetadata";
import { StoryRuntimeSkill, toStoryRuntimeSkill } from "./runtimeSkillMetadataAdapter";
import { createStoryRuntimeSkillSelector } from "./storyRuntimeSkillSelector";

export const publicStoryRuntimeSkills: StoryRuntimeSkill[] =
  publicRuntimeSkillMetadataRecords.map(toStoryRuntimeSkill);
export const publicStoryRuntimeSkillSelector =
  createStoryRuntimeSkillSelector(publicStoryRuntimeSkills);

export function getPublicStoryRuntimeSkill(slug: string): StoryRuntimeSkill | undefined {
  return publicStoryRuntimeSkillSelector.getBySlug(slug);
}

export function findPublicStoryRuntimeSkillsByTag(tag: string): StoryRuntimeSkill[] {
  return publicStoryRuntimeSkillSelector.findByTag(tag);
}

export function findPublicStoryRuntimeSkillsByScope(
  scope: StoryRuntimeSkill["scope"][number],
): StoryRuntimeSkill[] {
  return publicStoryRuntimeSkillSelector.findByScope(scope);
}
