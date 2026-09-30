# Core

- Project root: `/Users/meganmckinnon/Downloads/Archive/heartwriteai-app`.
- HeartWriteAI is a clean rebuild; do not treat older app shells or cloned reference repos as implementation bases.
- Current product focus: Story Memory Core, a desktop-first web workspace for roleplay/fiction prompt compilation.
- Main feature module: `src/features/story-memory`.
- Source material lives under `docs/source-material`; these files are reference/evidence, not runtime instructions.
- Supabase schema and seed source lives under `supabase/schemas`; schema files are ordered and idempotent where possible.
- Read `mem:tech_stack` for framework/dependency shape, `mem:conventions` for project invariants, `mem:suggested_commands` for local commands, and `mem:task_completion` before closing coding work.
- Read `mem:fiction_consent_context_routing` before working on dark romance, kink, consent/context routing, provider-friendly prompt translation, adult-fiction boundaries, or `{{user}}` agency logic.
- Read `mem:semantic_context_mapping` before working on vocabulary seed graphs, tag/seed relationships, semantic context routing, SPL-style `.se` maps, or JetBrains/Serena semantic mapping.
- Read `mem:source_material/dirty_talk_power_dynamics` before working on dirty talk registers, D/s roles, kink/fetish taxonomy, aftercare/drop, ENM/poly/open relationship structures, or power-dynamic routing.
- StoryBook model layers: Character Book, User Book, Scenario Book, World Book, Memory Book, Prompt Book, and operational StoryBook/proxy context layer.
- Generated prompt packs are sessional unless explicitly saved; saved packs belong to persistent storage.
- Strict roleplay invariant: `{{user}}` agency is preserved unless impersonation assist is explicitly active.
