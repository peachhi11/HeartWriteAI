import type { StoryRuntimeSkill } from "./runtimeSkillMetadataAdapter";

export interface StoryRuntimeSkillSelector {
  readonly skills: readonly StoryRuntimeSkill[];
  getBySlug(slug: string): StoryRuntimeSkill | undefined;
  findByTag(tag: string): StoryRuntimeSkill[];
  findByScope(scope: StoryRuntimeSkill["scope"][number]): StoryRuntimeSkill[];
}

export function createStoryRuntimeSkillSelector(
  skills: readonly StoryRuntimeSkill[],
): StoryRuntimeSkillSelector {
  return {
    skills,
    getBySlug(slug) {
      return skills.find((skill) => skill.slug === slug);
    },
    findByTag(tag) {
      return skills.filter((skill) => skill.activationTags.includes(tag));
    },
    findByScope(scope) {
      return skills.filter((skill) => skill.scope.includes(scope));
    },
  };
}
