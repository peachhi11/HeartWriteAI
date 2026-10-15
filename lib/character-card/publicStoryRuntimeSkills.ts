import { publicRuntimeSkillMetadataRecords } from "./generatedPublicRuntimeSkillMetadata";
import { StoryRuntimeSkill, toStoryRuntimeSkill } from "./runtimeSkillMetadataAdapter";

export const publicStoryRuntimeSkills: StoryRuntimeSkill[] =
  publicRuntimeSkillMetadataRecords.map(toStoryRuntimeSkill);

export function getPublicStoryRuntimeSkill(slug: string): StoryRuntimeSkill | undefined {
  return publicStoryRuntimeSkills.find((skill) => skill.slug === slug);
}

export function findPublicStoryRuntimeSkillsByTag(tag: string): StoryRuntimeSkill[] {
  return publicStoryRuntimeSkills.filter((skill) => skill.activationTags.includes(tag));
}

export function findPublicStoryRuntimeSkillsByScope(
  scope: StoryRuntimeSkill["scope"][number],
): StoryRuntimeSkill[] {
  return publicStoryRuntimeSkills.filter((skill) => skill.scope.includes(scope));
}
