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

## Behavior Architecture

Advanced character cards should distinguish three systems that authors often
accidentally mix together:

- Character layer: who the character is and how they process events.
- Writing layer: how behavior is presented in prose, formatting, agency, and
  scene flow.
- Context architecture layer: where information is placed so it survives
  attention pressure, context decay, and long sessions.

The behavior architecture vocabulary in
[`data/behaviorArchitectureVocabularyPresets.ts`](../data/behaviorArchitectureVocabularyPresets.ts)
captures this as reusable internal guidance:

- Character layer: description, personality, history, relationships,
  motivations, goals, flaws, examples, character books, reinforcement, and
  behavior architecture.
- Writing layer: POV, tense, agency, formatting, continuity, scene pacing, NPC
  autonomy, dialogue style, and OOC diagnostics.
- Context architecture layer: description strategy, solo vs party design,
  attention management, field visibility, reinforcement placement, Author's
  Notes, Post-History, context decay mitigation, and entropy management.

Use behavior architecture seeds when a card needs repeatable
`event -> interpretation -> reaction` patterns rather than a larger pile of
static traits. Metrics should color delivery as friction or ease, not act as
absolute locks that prevent believable narrative exceptions.

See [`docs/character-card-engineering.md`](./character-card-engineering.md)
for the author-facing explanation of the same design principle.

## Dynamic State System

Dynamic state system vocabulary stores the internal axes that bend character
behavior without replacing personality. The source module is
[`data/dynamicStateSystemVocabularyPresets.ts`](../data/dynamicStateSystemVocabularyPresets.ts).

It models current behavior as:

```text
Character Sheet
+ Current State
= Final Behavior
```

State updates follow:

```text
Trigger -> Interpretation -> Adjustment
```

Use dynamic state seeds when prompt output needs:

- trust, attraction, emotional regulation, and power perception axes
- low, middle, high, and extreme state bands
- state modifiers such as kindness without cost, inconsistency, vulnerability,
  or challenges to authority
- behavior overrides where the same baseline trait bends under high trust or
  low regulation
- character-specific weighting, such as guarded trust, impulsive regulation,
  or dominant power perception
- prompt-safe guidance that exposes tone and behavior effects without exposing
  raw state numbers

Dynamic state seeds project into the semantic graph as `states`. The shared
HeartWrite seed adapter maps that lane to mood-style prompt support while the
graph keeps the more specific state category for matching and route logic.

## User Persona Profile

User persona profile vocabulary stores the input scaffold for player/user
persona cards. The source module is
[`data/userPersonaProfileVocabularyPresets.ts`](../data/userPersonaProfileVocabularyPresets.ts).

It models persona input as:

```text
Basic Identity
+ Psychology
+ Cognition
+ Motivational Drivers
+ Relational Style
+ Chemistry Hooks
+ Behavior Patterns
+ Story Hooks
= Persona Matching Profile
```

Use user persona profile seeds when the app needs:

- searchable persona form sections
- user-side profile templates for persona cards
- compatibility matching inputs
- route pressure from insecurities, desires, boundaries, and goals
- behavior pattern templates shaped as trigger -> interpretation -> response
- prompt-safe compact persona prose for model routing

These seeds project into the semantic graph as `metadata_tags`, because they
describe the user's profile surface for matching and organization. They should
not be compiled into instructions that write {{user}}'s dialogue, actions,
thoughts, feelings, intentions, or consent.

## Compatibility Matrix

Compatibility matrix vocabulary stores character/persona matching and route
prediction fields. The source module is
[`data/compatibilityMatrixVocabularyPresets.ts`](../data/compatibilityMatrixVocabularyPresets.ts).

It models pair fit as:

```text
Attraction Vector
+ Friction Points
+ Emotional Economy
+ Power Dynamics
+ Behavioral Feedback Loop
+ Narrative Trajectory
+ Risk Factors
= Compatibility Assessment
```

Use compatibility matrix seeds when prompt output or internal routing needs:

- attraction alignment between what a character wants and what a persona emits
- collision typing across value clash, emotional mismatch, pacing mismatch, and
  power imbalance
- emotional economy tracking for investment, withholding, reciprocity, and
  volatility
- power-dynamic stability checks
- character -> persona -> character feedback loops
- trajectory prediction such as collapse, growth, obsession, rivalry, or slow
  bond
- burnout, repetition, and derailment risk flags
- final assessment fields for overall compatibility, best use case, and
  required adjustments

Compatibility matrix seeds project into the semantic graph as
`relationship_dynamics`, because they describe how two profiles interact rather
than a single character trait.

## Memory Compression + Recall

Memory compression and recall vocabulary stores long-context stability rules.
The source module is
[`data/memoryCompressionRecallVocabularyPresets.ts`](../data/memoryCompressionRecallVocabularyPresets.ts).

It models continuity as:

```text
Raw Interaction
+ Event
+ Meaning
+ State Impact
= Compressed Memory
```

Recall then activates through:

```text
Similar Situation
or Same Emotional Trigger
or Repeated Behavior Pattern
or State Threshold Crossed
= Reinforced Behavior
```

Use memory compression recall seeds when the app needs:

- tiered memory routing for core identity, relationship memory, and contextual
  scene details
- compression rules that preserve meaning and state impact instead of raw logs
- recall triggers for similar situations, emotional triggers, repeated
  patterns, and state threshold changes
- integration points for dynamic state, event engine, dialogue subtext, and
  narrative arc control
- low-token memory context that keeps what changed behavior and drops filler

These seeds project into the semantic graph as `metadata_tags`, because they
describe internal context architecture and persistence behavior. Prompt output
should expose concise memory effects, not raw transcripts or internal storage
details.

## Dialogue Control

Dialogue control is a writing-layer vocabulary source for keeping character
speech recognizable without letting it become static. The source module is
[`data/dialogueControlVocabularyPresets.ts`](../data/dialogueControlVocabularyPresets.ts).

It models dialogue as:

```text
Character Sheet
+ Dynamic State System
+ Narrative Arc Phase
+ Variation Engine
+ Subtext
= Performed Dialogue
```

Use dialogue control seeds when prompt output needs:

- baseline voice anchoring from the character sheet
- anti-repetition rules for sentence structure, phrasing, openings, and
  closings
- state-based modulation for trust, attraction, regulation, and perceived power
- arc-based dialogue pacing from initiation through resolution
- subtext, silence, negative space, and action beats
- dialogue-function rotation across probe, push, pull, deflect, reveal, and
  control

The low-token version is: no repeated phrases, state affects tone, alternate
sentence length, and maintain voice consistency.

## First Message Generator

First message generator vocabulary stores starter-prompt construction rules.
The source module is
[`data/firstMessageGeneratorVocabularyPresets.ts`](../data/firstMessageGeneratorVocabularyPresets.ts).

It models the opening message as:

```text
Character Sheet
+ Core Traits
+ Speech Profile
+ Behavior Profile
+ Motivational Drivers
+ Worldview
= Opening Hook + Action + Dialogue + Subtext
```

Use first message generator seeds when prompt output needs:

- sheet-driven starter prompts rather than generic greetings
- hooks that reflect the character's sensory or situational perception style
- small revealing behaviors before exposition
- interpretation layers anchored to {{char}} only
- dialogue that matches the speech profile
- subtext from motivational drivers
- variation types such as dominant, reactive, slow-burn, or high-tension entry
- playable endings that preserve {{user}} autonomy

First message generator seeds project into the semantic graph as
`scenario_tags`, because they shape opening scene construction and starter
prompt layout.

## Narrative Arc Controller

Narrative arc control is a route-level vocabulary source for pacing story
movement. The source module is
[`data/narrativeArcControllerVocabularyPresets.ts`](../data/narrativeArcControllerVocabularyPresets.ts).

It models story pressure as:

```text
Current Phase
+ Allowed Event Type
+ Event Outcome
+ State Change
+ Behavior Modulation
= Next Phase Pressure
```

Use narrative arc controller seeds when prompt output needs:

- phase-aware event restrictions
- slow burn, fast-paced, or chaotic pacing modes
- state movement speed controls
- transition pressure between initiation, development, escalation, crisis, and
  resolution
- anti-derail correction for calm, chaos, repetition, premature crisis, or
  dragging aftermath
- route guidance where phase controls events, events change states, and states
  modify behavior

## Event Engine

Event engine vocabulary stores context-aware pressures that create route
movement without feeling random. The source module is
[`data/eventEngineVocabularyPresets.ts`](../data/eventEngineVocabularyPresets.ts).

It models events as:

```text
Context
+ Current State
+ Recent Interaction Pattern
+ Narrative Fatigue
= Event Pressure
```

Every event should compile through:

```text
Trigger -> Interpretation -> State Impact -> Behavioral Outcome
```

Use event engine seeds when prompt output needs:

- interpersonal, environmental, internal, or relationship event categories
- micro, meso, and major escalation tiers
- state-aware event selection
- character-specific interpretation through fears, desires, and values
- event chains such as misunderstanding -> argument -> emotional reveal
- anti-repetition safeguards that vary category or scale
- momentum injection when loops, plateaus, predictable trajectories, or overly
  stable emotional intensity appear

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
