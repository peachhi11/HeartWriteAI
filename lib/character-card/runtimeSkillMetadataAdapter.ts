import type { MemoryVaultBookType } from "./memoryVaultRetrieval";

export type StoryRuntimeSkillCategory =
  | "character-persona"
  | "explicit-romantic-roleplay-skill-framework"
  | "keyword-discovery"
  | "memory-core"
  | "relationship-continuity"
  | "roleplay-response"
  | "story-development"
  | "writing-mentor"
  | "world-setting";

export type StoryRuntimeSkillSource = "agents_md" | "heartwrite_memory_vault" | "source_material";

export interface StoryRuntimeSkill {
  slug: string;
  label: string;
  category: StoryRuntimeSkillCategory;
  summary: string;
  source: StoryRuntimeSkillSource;
  sourceVaultLinks: string[];
  scope: MemoryVaultBookType[];
  activationTags: string[];
  triggerSeeds: string[];
  stateFields: string[];
  promptCompilerSignals: string[];
  memoryRouting: string[];
  continuityLinks: string[];
  guardrails: string[];
}

type RuntimeSkillMetadataRecord = {
  identity: { slug: string; label: string; category: StoryRuntimeSkillCategory; summary: string };
  provenance: { source: StoryRuntimeSkillSource; source_links: readonly string[] };
  runtime: { scopes: readonly MemoryVaultBookType[] };
  activation: { tags: readonly string[]; trigger_seeds: readonly string[] };
  state: { fields: readonly string[] };
  routing: {
    prompt_compiler_signals: readonly string[];
    memory_routing: readonly string[];
    continuity_links: readonly string[];
  };
  safety: { guardrails: readonly string[] };
};

export function toStoryRuntimeSkill(record: RuntimeSkillMetadataRecord): StoryRuntimeSkill {
  return {
    slug: record.identity.slug,
    label: record.identity.label,
    category: record.identity.category,
    summary: record.identity.summary,
    source: record.provenance.source,
    sourceVaultLinks: [...record.provenance.source_links],
    scope: [...record.runtime.scopes],
    activationTags: [...record.activation.tags],
    triggerSeeds: [...record.activation.trigger_seeds],
    stateFields: [...record.state.fields],
    promptCompilerSignals: [...record.routing.prompt_compiler_signals],
    memoryRouting: [...record.routing.memory_routing],
    continuityLinks: [...record.routing.continuity_links],
    guardrails: [...record.safety.guardrails],
  };
}
