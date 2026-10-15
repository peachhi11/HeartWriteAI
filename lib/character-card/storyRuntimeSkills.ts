/**
 * Compatibility export for existing runtime imports.
 *
 * New public surfaces should import publicStoryRuntimeSkills instead so the
 * private metadata artifact cannot enter a public browser bundle.
 */
export {
  findStoryRuntimeSkillsByScope,
  findStoryRuntimeSkillsByTag,
  getStoryRuntimeSkill,
  storyRuntimeSkills,
} from "./runtimeSkillRegistry";
export type {
  StoryRuntimeSkill,
  StoryRuntimeSkillCategory,
  StoryRuntimeSkillSource,
} from "./runtimeSkillMetadataAdapter";
