import {
  createVocabularySeedPreset,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export const orchestrationPolicySemanticChain = [
  "Source",
  "Permission",
  "Routing Strategy",
  "Review Status",
  "Prompt Projection",
  "Export Boundary",
] as const;

export const orchestrationPolicyPrinciples = [
  "AI helpers may read more than they may write.",
  "Every generated change resolves as applied, staged for review, or rejected before it can become canon.",
  "Knowledge routing should expose concise prompt prose, not internal ids, raw scores, or storage structure.",
  "Semantic retrieval can reorder relevant context, but tags should not rescue context that fails the semantic floor.",
  "Portable exports must omit local paths, credentials, raw runtime internals, and unreviewed drafts unless explicitly requested.",
] as const;

export const ORCHESTRATION_POLICY_VOCABULARY_STANDARD_SEEDS = [
  createVocabularySeedPreset({
    seed: "ai_write_policy_review",
    label: "AI Write Policy - Review Required",
    description:
      "Allows an AI helper to suggest edits while keeping the original artifact unchanged until a human approves the proposal.",
    examples: [
      "A lorebook enrichment agent drafts a sharper keyword set, but the draft does not become active canon.",
      "A card compiler proposes a cleaner field summary and sends it to review instead of overwriting the source.",
    ],
    tags: [
      "orchestration_policy",
      "review_required",
      "ai_helper",
      "prompt_safe",
      "canon_boundary",
    ],
    relatedSeeds: [
      "system_ai_maintenance_lane",
      "portable_package_manifest",
      "workflow_context_overflow_review",
    ],
    oppositeSeeds: ["ai_write_policy_open", "ai_write_policy_locked"],
    romanceHooks: [],
    scenarioHooks: [
      "review_queue",
      "draft_lorebook_update",
      "staged_card_revision",
    ],
    dialoguePatterns: [
      "Treat this as a proposed update, not established canon.",
      "Keep the original source active until review is complete.",
    ],
    metadata: {
      rarity: "common",
      romanceValue: 2,
      conflictPotential: 4,
    },
  }),
  createVocabularySeedPreset({
    seed: "ai_write_policy_locked",
    label: "AI Write Policy - Locked Source",
    description:
      "Marks a source as readable reference material that AI helpers must not rewrite, replace, or silently summarize into canon.",
    examples: [
      "A writer-approved character law stays fixed even when a helper suggests a smoother sentence.",
      "A canonical relationship boundary can be read for context, but generated maintenance passes cannot alter it.",
    ],
    tags: [
      "orchestration_policy",
      "locked_source",
      "canon_boundary",
      "prompt_safe",
      "writer_control",
    ],
    relatedSeeds: [
      "character_law",
      "hard_constraint",
      "replacement_action_rule",
    ],
    oppositeSeeds: ["ai_write_policy_open", "ai_write_policy_review"],
    romanceHooks: [],
    scenarioHooks: [
      "writer_locked_law",
      "protected_boundary",
      "canonical_source",
    ],
    dialoguePatterns: [
      "Read this source for context, but do not change it.",
      "If a new idea conflicts with this source, stage the conflict for review.",
    ],
    metadata: {
      rarity: "common",
      romanceValue: 1,
      conflictPotential: 6,
    },
  }),
  createVocabularySeedPreset({
    seed: "ai_write_policy_open",
    label: "AI Write Policy - Open Update",
    description:
      "Allows a helper to apply low-risk generated changes directly when the evidence is explicit and the artifact is marked as editable.",
    examples: [
      "A tag-normalization pass adds missing search tags to an unlocked draft artifact.",
      "A formatting helper fixes harmless punctuation in a scratchpad note without requiring review.",
    ],
    tags: [
      "orchestration_policy",
      "open_update",
      "low_risk",
      "ai_helper",
    ],
    relatedSeeds: [
      "system_ai_maintenance_lane",
      "semantic_tag_boost",
      "review_queue",
    ],
    oppositeSeeds: ["ai_write_policy_locked", "ai_write_policy_review"],
    romanceHooks: [],
    scenarioHooks: [
      "tag_cleanup",
      "draft_formatting",
      "low_risk_maintenance",
    ],
    dialoguePatterns: [
      "Apply the update only when the artifact is explicitly open.",
      "Do not use open update for canon, secrets, or relationship-changing facts.",
    ],
    metadata: {
      rarity: "uncommon",
      romanceValue: 1,
      conflictPotential: 5,
    },
  }),
  createVocabularySeedPreset({
    seed: "knowledge_strategy_constant_context",
    label: "Knowledge Strategy - Constant Context",
    description:
      "Keeps a compact, high-priority source in every prompt because it is always relevant to identity, safety, continuity, or writing law.",
    examples: [
      "Character laws remain active every turn because they define the behavior engine.",
      "A user agency rule stays in constant context so generated prose never puppets the user.",
    ],
    tags: [
      "knowledge_routing",
      "constant_context",
      "context_architecture",
      "prompt_safe",
    ],
    relatedSeeds: [
      "core_identity",
      "character_law",
      "context_architecture_layer",
    ],
    oppositeSeeds: ["knowledge_strategy_semantic_retrieval"],
    romanceHooks: [],
    scenarioHooks: [
      "always_on_prompt_context",
      "identity_law_projection",
      "agency_boundary_projection",
    ],
    dialoguePatterns: [
      "Keep this guidance active, compact, and non-diagnostic.",
      "Project the law as prose behavior rather than storage metadata.",
    ],
    metadata: {
      rarity: "common",
      romanceValue: 3,
      conflictPotential: 3,
    },
  }),
  createVocabularySeedPreset({
    seed: "knowledge_strategy_semantic_retrieval",
    label: "Knowledge Strategy - Semantic Retrieval",
    description:
      "Injects context only when the current user message, scene pressure, or active arc meaningfully matches the source.",
    examples: [
      "A betrayal memory is recalled when a new secrecy beat appears, not on every quiet domestic turn.",
      "A lorebook entry activates when its meaning fits the scene even if the exact keyword is absent.",
    ],
    tags: [
      "knowledge_routing",
      "semantic_retrieval",
      "context_digest",
      "memory_lane",
    ],
    relatedSeeds: [
      "same_emotional_trigger",
      "similar_situation",
      "semantic_tag_boost",
    ],
    oppositeSeeds: ["knowledge_strategy_constant_context"],
    romanceHooks: [
      "old_wound_recalled_by_new_scene",
      "meaning_based_memory_activation",
    ],
    scenarioHooks: [
      "semantic_lorebook_activation",
      "runtime_memory_recall",
      "context_digest_retrieval",
    ],
    dialoguePatterns: [
      "Recall this only when the scene meaning matches.",
      "Let recalled context color behavior without reciting the source.",
    ],
    metadata: {
      rarity: "common",
      romanceValue: 5,
      conflictPotential: 6,
    },
  }),
  createVocabularySeedPreset({
    seed: "portable_package_manifest",
    label: "Portable Package Manifest",
    description:
      "A human-reviewable export summary that names what a bundle includes and what it deliberately omits for privacy, portability, and prompt safety.",
    examples: [
      "A card bundle includes CCv3 fields, scenario truth, and reviewed lorebook entries.",
      "The export manifest notes that API keys, local file paths, raw runtime scores, and unreviewed drafts were omitted.",
    ],
    tags: [
      "export",
      "portable_package",
      "manifest",
      "privacy",
      "review_required",
    ],
    relatedSeeds: [
      "export_package_card_bundle",
      "export_privacy_scrubber",
      "ai_write_policy_review",
    ],
    oppositeSeeds: ["raw_workspace_export"],
    romanceHooks: [],
    scenarioHooks: [
      "card_bundle_export",
      "lorebook_package",
      "runtime_snapshot_export",
    ],
    dialoguePatterns: [
      "Include reviewed story material and omit local-only runtime internals.",
      "Summarize the package boundary before export.",
    ],
    metadata: {
      rarity: "common",
      romanceValue: 1,
      conflictPotential: 4,
    },
  }),
  createVocabularySeedPreset({
    seed: "system_ai_maintenance_lane",
    label: "System AI Maintenance Lane",
    description:
      "A non-character helper lane for tagging, summarizing, enrichment, duplicate detection, context digestion, and QC passes.",
    examples: [
      "A maintenance helper proposes better lorebook keys after deterministic keyword checks.",
      "A context digest helper compresses a long chat into event, meaning, and state impact without speaking as the character.",
    ],
    tags: [
      "system_ai",
      "maintenance",
      "qc",
      "context_digest",
      "not_character_voice",
    ],
    relatedSeeds: [
      "memory_compression_recall",
      "lorebook_intelligence_layer",
      "ai_write_policy_review",
    ],
    oppositeSeeds: ["character_voice_generation"],
    romanceHooks: [],
    scenarioHooks: [
      "tag_suggestion_pass",
      "context_digest_pass",
      "lorebook_qc_pass",
      "duplicate_detection_pass",
    ],
    dialoguePatterns: [
      "Do not perform as the character in this lane.",
      "Return maintenance findings as reviewable system output.",
    ],
    metadata: {
      rarity: "common",
      romanceValue: 2,
      conflictPotential: 3,
    },
  }),
  createVocabularySeedPreset({
    seed: "canonical_entity_alias_map",
    label: "Canonical Entity Alias Map",
    description:
      "Connects a character, place, object, faction, or route concept to known aliases so retrieval and lore activation stay consistent.",
    examples: [
      "Julian, Jules, Doctor Vale, and the hospital director all resolve to the same entity when appropriate.",
      "A faction's formal name, street name, and acronym are stored together to avoid duplicated lore entries.",
    ],
    tags: [
      "semantic_graph",
      "entity_resolution",
      "alias_map",
      "lorebook",
      "retrieval",
    ],
    relatedSeeds: [
      "semantic_retrieval",
      "lorebook_activation_graph",
      "relationship_graph",
    ],
    oppositeSeeds: ["duplicate_entity_records"],
    romanceHooks: [
      "nickname_as_intimacy_signal",
      "private_name_recognition",
    ],
    scenarioHooks: [
      "faction_alias_resolution",
      "character_alias_merge",
      "place_alias_merge",
    ],
    dialoguePatterns: [
      "Resolve aliases before creating a new entity.",
      "Use private names as relationship context only when the scene earned them.",
    ],
    metadata: {
      rarity: "common",
      romanceValue: 4,
      conflictPotential: 4,
    },
  }),
  createVocabularySeedPreset({
    seed: "semantic_tag_boost",
    label: "Semantic Tag Boost",
    description:
      "Uses tags to gently reorder already-relevant retrieval candidates without letting tags override a failed meaning match.",
    examples: [
      "A chunk tagged abandonment rises above other relevant memory chunks when the scene also semantically matches abandonment.",
      "A tag match alone cannot inject an unrelated lorebook entry into the prompt.",
    ],
    tags: [
      "semantic_graph",
      "retrieval",
      "tag_boost",
      "ranking",
      "prompt_safe",
    ],
    relatedSeeds: [
      "knowledge_strategy_semantic_retrieval",
      "canonical_entity_alias_map",
      "context_digest",
    ],
    oppositeSeeds: ["keyword_only_activation"],
    romanceHooks: [
      "wound_relevant_memory_ranking",
      "trope_relevant_lore_ranking",
    ],
    scenarioHooks: [
      "semantic_floor_check",
      "retrieval_ranking",
      "tagged_context_rerank",
    ],
    dialoguePatterns: [
      "Use tags as a boost, not as permission.",
      "If the meaning match fails, do not inject the context.",
    ],
    metadata: {
      rarity: "uncommon",
      romanceValue: 4,
      conflictPotential: 4,
    },
  }),
  createVocabularySeedPreset({
    seed: "workflow_context_overflow_review",
    label: "Workflow Context Overflow Review",
    description:
      "Routes oversized or conflicting context through a review step instead of silently stuffing everything into the prompt.",
    examples: [
      "A constant lorebook entry is flagged when it consumes too much budget before the scene starts.",
      "Conflicting memory summaries are staged for review instead of both being injected.",
    ],
    tags: [
      "context_budget",
      "review_required",
      "prompt_safety",
      "lorebook_qc",
      "maintenance",
    ],
    relatedSeeds: [
      "context_decay_mitigation",
      "memory_compression_recall",
      "ai_write_policy_review",
    ],
    oppositeSeeds: ["context_stuffing"],
    romanceHooks: [],
    scenarioHooks: [
      "context_budget_warning",
      "conflicting_memory_review",
      "constant_entry_audit",
    ],
    dialoguePatterns: [
      "Reduce to the sources that change behavior now.",
      "Stage conflicts for review instead of injecting both versions.",
    ],
    metadata: {
      rarity: "uncommon",
      romanceValue: 2,
      conflictPotential: 5,
    },
  }),
] as const satisfies readonly VocabularySeedPreset[];
