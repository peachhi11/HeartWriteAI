import type { StoryRuntimeSkill } from "./runtimeSkillMetadataAdapter";

export interface StoryRuntimeSkillSelector {
  readonly skills: readonly StoryRuntimeSkill[];
  getBySlug(slug: string): StoryRuntimeSkill | undefined;
  findByMode(mode: StoryRuntimeSkill["activationMode"]): StoryRuntimeSkill[];
  findByTag(tag: string): StoryRuntimeSkill[];
  findByTriggerSeed(triggerSeed: string): StoryRuntimeSkill[];
  findByStateField(stateField: string): StoryRuntimeSkill[];
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
    findByMode(mode) {
      return skills.filter((skill) => skill.activationMode === mode);
    },
    findByTag(tag) {
      return skills.filter((skill) => skill.activationTags.includes(tag));
    },
    findByTriggerSeed(triggerSeed) {
      return skills.filter((skill) => skill.triggerSeeds.includes(triggerSeed));
    },
    findByStateField(stateField) {
      return skills.filter((skill) => skill.stateFields.includes(stateField));
    },
    findByScope(scope) {
      return skills.filter((skill) => skill.scope.includes(scope));
    },
  };
}
