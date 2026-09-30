# Semantic Programming Language JetBrains Reference

Source repo:

`/Users/meganmckinnon/Downloads/Archive/00_Source_Reference_Library/reference-repos/Semantic-Programming-Language-for-JetBrains`

Remote:

`https://github.com/SemanticProgrammingLanguage/Semantic-Programming-Language-for-JetBrains.git`

Push is disabled on the local clone with `DISABLED_NO_PUSH`.

## What It Is

This repo is a small JetBrains syntax-highlighting plugin for Semantic Programming Language files. It is reference material only. It is not a complete parser, compiler, runtime, or data model we should build on directly.

The useful part for HeartWriteAI is the compact semantic shape:

- `program`: names the whole semantic map.
- `object`: declares the main thing being mapped.
- `scope`: groups related meaning.
- `node`: declares a semantic point inside a scope.
- `relations`: starts relationship/link declarations.
- `%N`: value reference.
- `@N`: type or node reference.
- `true`, `false`, `null`, `unknown`: small state constants.
- `#`: human comments.

The JetBrains plugin currently tokenizes and highlights these concepts. It does not validate meaning deeply. That is useful for us because HeartWrite can borrow the readable notation without inheriting a heavy language.

## HeartWriteAI Use

Use this as inspiration for a lightweight internal semantic map format between source vocabulary and generated prompt behavior.

HeartWrite has a growing amount of source material: trope banks, dirty-talk registers, kink/dynamic terms, psychology vocabulary, worldbuilding fields, persona traits, and prompt modules. A semantic map can sit between those banks and the generator so the app knows what each seed should do.

The map should answer:

- What does this word or tag mean in fiction?
- Which Book does it belong to?
- Which user-facing label should hide heavier backend logic?
- What other seeds does it imply?
- What context makes it affirming, playful, conflicted, wounding, repair-needed, boundary-routed, or blocked?
- Which prompt module should receive it?
- Which platform export can safely use it?

## Adapted Mapping Terms

HeartWrite can adapt SPL terms like this:

- `program`: a StoryBook-level semantic map.
- `object`: a Book, entity, vocabulary bank, trope cluster, platform profile, or prompt module.
- `scope`: a context layer such as character, user, world, scenario, memory, prompt, heat, consent route, or platform route.
- `node`: a tag, seed, trope, move trigger, book field, generated trait, or prompt behavior.
- `relations`: semantic edges between nodes.
- `@type_ref`: a reference to another semantic node or object.
- `%value_ref`: a reference to a stored source seed, row, field, or generated value.

## Relation Types

Useful relation types for future implementation:

- `aliases`: user-facing terms that map to the same backend concept.
- `evokes`: softer or more literary language linked to the same feeling.
- `intensifies`: raises heat, urgency, power, danger, intimacy, or conflict.
- `softens`: makes the same material warmer, safer, gentler, or more romantic.
- `contrasts_with`: creates useful friction.
- `conflicts_with`: should not compile together without a route decision.
- `requires_context`: needs a Book field, tag, relationship state, or consent route to be safe/useful.
- `routes_to`: sends a seed to a prompt module, book field, or export slot.
- `writes_to`: populates a Character/User/World/Scenario/Memory/Prompt Book field.
- `triggered_by`: can activate when a user move, card field, or tag appears.
- `blocked_by`: cannot compile if a boundary tag or content exclusion is active.
- `platform_alias`: converts the same intent for JanitorAI, SillyTavern, or Marinara.

## Vocabulary-Seed Mapping

This is the core payoff. A seed should not only be a phrase. It should have semantic context:

- surface label: what the user sees
- backend token: what the generator understands
- tone route: romantic, playful, dark, tender, clinical, formal, filthy, literary, comedic
- reception route: welcomed, affirming, conflicted, hesitant, wounding, repair-needed, boundary, blocked
- book target: Character, User, World, Scenario, Memory, Prompt
- prompt role: style, action, relationship pressure, scene mechanics, knowledge boundary, heat language, platform adaptation
- user-agency effect: whether it can write `{{user}}`, suggest a write-for-me line, or only inform `{{char}}`

This matters because the same seed can have completely different fictional meaning. Persistence can read as devotion in one StoryBook and stalking pressure in another. Possessive language can be affirming, playful, darkly romantic, or threatening depending on relationship state, consent route, power balance, and active boundaries.

## What Not To Do

- Do not turn this into a second app language users have to learn.
- Do not expose backend route names as clunky UI copy.
- Do not make every seed require exhaustive manual metadata.
- Do not use this as runtime prompt text by itself.
- Do not edit or push to the reference repo.

## Implementation Direction

Near-term:

1. Keep `.se` maps as docs/design artifacts.
2. Use the maps to shape taxonomy, tests, and prompt compiler rules.
3. Add tests later that confirm a seed can compile differently based on StoryBook context.

Later:

1. Add a small TypeScript representation for semantic nodes and edges.
2. Load maps from seed data rather than freeform docs.
3. Use the mapping layer to generate safer, hotter, more specific prompt language without leaking backend taxonomy into user-facing fields.
