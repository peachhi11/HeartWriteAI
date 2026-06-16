# Seed Preset Registry

`data/seedPresetRegistry.ts` is the app-facing index for approved HeartWriteAI
seed presets. It lets creator forms ask for broad seed lanes without importing
every `data/*Presets.ts` module by hand.

`data/semanticSeedRegistry.ts` is the graph layer above that flat index. It
stores what a seed means: aliases, parent/child links, related nodes,
opposites, tags, trigger hooks, goal hooks, story payloads, source registry
keys, and guidance. Use it for persona matching, relationship routes, scenario
generation, lorebook routing, and future recommendation/similarity features.

`data/heartwriteSeedTypes.ts` defines the shared future storage unit:
`SeedBase` plus category-specific shapes such as `WoundSeed`, `ResponseSeed`,
`AppearanceSeed`, `RomanceTropeSeed`, `GateSeed`, `RouteSeed`, and
`SafetyFlagSeed`. The semantic graph can adapt nodes into the shared base shape
through `toSeedBaseFromSemanticNode`.

## Lanes

- `appearance`: visual presence, appearance presets, and descriptive appearance
  prose texture.
- `personality`: personality engine vocabulary, mental/emotional patterns,
  backstory events, music, player-side persona preferences, speech/body
  language prose texture, and related persona matching seeds.
- `world`: world lore, setting subtype, genre pack, scenario opener, and NPC
  network seeds.
- `image`: image prompt vocabulary, portrait tags, art/lighting/framing tags,
  and negative prompt quality controls.
- `metadata`: card discoverability tags, content warnings, compatibility
  markers, relationship types, chat styles, scenario labels, and library gates.

## Source Modules

Individual preset modules remain the source of truth for deterministic data,
normalization, safety framing, and focused tests. The registry adapts those
modules into a shared `SeedPresetRegistryEntry` shape:

- `registryKey`: stable lane/source/id key for UI selection.
- `lane`: broad UI lane.
- `sourceId`: source module identity.
- `category`: source category.
- `label` and `value`: readable text for chips and inputs.
- `triggerKeys` and `systemPromptTags`: search and routing helpers.
- `guidance`: source safety and usage framing.
- `originalLane`: optional source-specific lane, useful for descriptive writing
  seeds such as `speech` or `body-language`.

## Semantic Graph

The semantic registry uses stable `SemanticSeedNode` records today, with an
adapter into the shared `SeedBase` shape:

- `id`: durable slug used by forms, compilers, and route engines.
- `category`: focused semantic category such as `wounds`, `fears`,
  `responses`, `relationship_dynamics`, or `romance_tropes`.
- `label` and `aliases`: readable display text plus search terms.
- `parents`, `children`, `related`, and `opposite`: graph links for expansion,
  matching, and recommendation.
- `tags`: routing and capability tags such as `route_engine` or
  `highest_priority`.
- `triggers` and `goals`: optional event and motivation hooks.
- `description`, `internalMeaning`, and `emotionalMeaning`: prose-first
  explanations of what the seed means in story context.
- `behaviors`, `dialogueExamples`, and `bodyLanguage`: generation-ready
  surface texture for cards, chat behavior, scenario hooks, and dialogue tests.
- `commonTriggers`, `commonConflicts`, `hiddenNeeds`, `commonWounds`, and
  `growthPath`: route and relationship-engine support.
- `relatedConcepts`: readable conceptual links for human-facing suggestions.
- `visual`, `impression`, and `associatedVibes`: optional appearance/fashion
  story texture for later visual seed nodes.
- `emotionalArc` and `payoff`: optional trope/route structure.
- `sourceRegistryKeys`: optional links back to flat seed registry entries.
- `guidance`: soft usage framing for compilers.

The semantic graph should avoid becoming a catalogue of bare labels. A useful
seed is a small story-psychology record. For example, `fear_of_abandonment`
should describe the fear, explain how silence or distance is interpreted,
provide observable behaviors, body language, dialogue examples, triggers,
conflicts, needs, healing/growth paths, and related concepts. The app can then
reuse one seed for card descriptions, persona matching, scenario generation,
lorebook suggestions, route progression, memory interpretation, and dialogue
generation.

## Shared Seed Base

Every future category-specific seed should start from this base:

- `id`, `label`, `category`, `aliases`, `description`, and `tags`.
- `polarity` and `intensity` when useful.
- `romanceRelevant`, `adult`, and `unsafe` as explicit routing flags.
- `related`, `opposites`, `requires`, and `blocks` for graph logic.

Then specialize by category:

- Traits carry expression, internal meaning, behaviours, dialogue, body
  language, triggers, wounds, and growth path.
- Wounds carry core fear, internal belief, defensive behaviours, triggers,
  misreads, healing signals, and growth path.
- Responses carry action, emotional intent, visible behaviour, dialogue, body
  language, de-escalators, and escalation targets.
- Romance tropes carry premise, emotional arc, starting conditions, conflicts,
  gates, and payoff fantasy.
- Gates and routes carry enter/exit/escalation/de-escalation structure.
- Safety flags carry purpose, adult gating, generation blocking, user-facing
  label, and explanation.

This keeps the flat registry useful for UI discovery while the semantic/storage
layer becomes a reusable story database for character creation, persona
matching, lorebooks, scenario generation, dialogue generation, route
progression, memory interpretation, tag suggestions, and recommendations.

The first semantic build prioritizes psychology and route pressure before
appearance scale:

1. Wounds
2. Fears
3. Desires
4. Triggers
5. Responses
6. Relationship dynamics
7. Romance tropes

Appearance, fashion, occupation, hobby, skill, world, and metadata nodes remain
important, but the product advantage comes from making the same normalized
psychology/trope graph feed character creation, persona matching, scenario
generation, lorebooks, relationship gates, and long-form chat progression.

## Usage Rules

- Use the registry for UI discovery, search, and seed-chip selection.
- Keep selected seed output editable before it becomes CCV3 card text.
- Do not use metadata seeds to silently override live chat safety, runtime
  pacing, or character behavior.
- Keep image negative prompts as quality controls, not character traits.
- Add new seed modules to the registry only after they have normalized values,
  stable IDs, soft guidance, and focused tests.
- Add semantic graph nodes when a seed needs relationship expansion, matching,
  route behavior, trigger handling, or similarity search beyond simple UI
  discovery.
- Keep graph guidance soft: semantic nodes may suggest interpretation, pacing,
  and matching, but selected output remains reviewable and editable before
  CCV3 export.
- Prefer story-ready semantic payloads over bare labels. When a node is meant
  to drive generation, give it description, internal meaning, behaviors,
  dialogue examples, body language, triggers/conflicts, growth path, and
  related concepts.
- Pair every negative constraint with a positive alternative action. If a seed
  says a character cannot, does not, refuses to, avoids, or never does
  something, also state what they do instead. For example, pair "does not speak
  aloud" with "writes on a notepad, gestures, or signals for help" so the model
  has an active behavior to generate instead of drifting back into the blocked
  behavior.

## Related Files

- App-facing registry: [`data/seedPresetRegistry.ts`](../data/seedPresetRegistry.ts)
- Registry tests: [`tests/character-card/seed-preset-registry.test.ts`](../tests/character-card/seed-preset-registry.test.ts)
- Shared seed types: [`data/heartwriteSeedTypes.ts`](../data/heartwriteSeedTypes.ts)
- Shared seed type tests: [`tests/character-card/heartwrite-seed-types.test.ts`](../tests/character-card/heartwrite-seed-types.test.ts)
- Semantic graph: [`data/semanticSeedRegistry.ts`](../data/semanticSeedRegistry.ts)
- Semantic graph tests: [`tests/character-card/semantic-seed-registry.test.ts`](../tests/character-card/semantic-seed-registry.test.ts)
- External dataset intake registry: [`data/vocabularyDatasetRegistry.ts`](../data/vocabularyDatasetRegistry.ts)
- Dataset intake policy: [`docs/vocabulary-dataset-intake.md`](./vocabulary-dataset-intake.md)
