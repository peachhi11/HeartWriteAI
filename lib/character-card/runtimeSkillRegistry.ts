import { runtimeSkillMetadataRecords } from "./generatedRuntimeSkillMetadata";
import { StoryRuntimeSkill, toStoryRuntimeSkill } from "./runtimeSkillMetadataAdapter";

export const storyRuntimeSkills: StoryRuntimeSkill[] =
  runtimeSkillMetadataRecords.map(toStoryRuntimeSkill);

export function getStoryRuntimeSkill(slug: string): StoryRuntimeSkill | undefined {
  return storyRuntimeSkills.find((skill) => skill.slug === slug);
}

export function findStoryRuntimeSkillsByTag(tag: string): StoryRuntimeSkill[] {
  return storyRuntimeSkills.filter((skill) => skill.activationTags.includes(tag));
}

export function findStoryRuntimeSkillsByScope(
  scope: StoryRuntimeSkill["scope"][number],
): StoryRuntimeSkill[] {
  return storyRuntimeSkills.filter((skill) => skill.scope.includes(scope));
}
