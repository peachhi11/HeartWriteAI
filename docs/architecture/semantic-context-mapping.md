# Semantic Context Mapping

Semantic context mapping is the bridge between HeartWriteAI's source banks and its prompt compiler.

The goal is simple: vocabulary seeds should not sit in storage as loose word piles. They should know what they mean, where they belong, what they imply, and how they should change when the StoryBook context changes.

## Why This Layer Exists

HeartWrite has overlapping material:

- trope tags
- relationship dynamics
- kink and heat language
- body-language moves
- dirty-talk registers
- psychology and attachment vocabulary
- worldbuilding terms
- platform prompt slots
- StoryBook memory fields

Without a mapping layer, the generator can only paste generic language. With one, the compiler can route the same user-facing intent into specific Character, User, World, Scenario, Memory, and Prompt Book fields.

Example:

- User-facing phrase: `possessive`
- Backend routes: romantic ownership language, jealousy pressure, protective behavior, control-risk route, dark-romance trope pressure
- Possible outputs:
  - affirming and consensual: protective touch, claimed-as-chosen language, private reassurance
  - playful: teasing jealousy, flirtatious territoriality
  - conflicted: pressure, ambivalence, attraction/fear split
  - boundary: repair, backing off, changed behavior
  - blocked: do not eroticize or continue

Same seed, different StoryBook behavior.

## Inspired By SPL

The local reference clone at `/Users/meganmckinnon/Downloads/Archive/00_Source_Reference_Library/reference-repos/Semantic-Programming-Language-for-JetBrains` gives us a useful notation:

- `program`
- `object`
- `scope`
- `node`
- `relations`
- `@` references
- `%` value references

HeartWrite should borrow the shape, not the implementation.

## HeartWrite Map Shape

A semantic node should eventually carry:

- `id`
- `label`
- `kind`
- `bookTargets`
- `promptTargets`
- `aliases`
- `sourceRefs`
- `compatibleTags`
- `blockedBy`
- `requiresContext`
- `contextRoutes`
- `platformRoutes`

Context routes should cover:

- affirming
- welcomed
- playful
- dark_romance_pressure
- conflicted
- hesitant
- wounding
- repair_needed
- boundary
- blocked

Book targets should cover:

- Character Book
- User Book
- World Book
- Scenario Book
- Memory Book
- Prompt Book

Prompt targets should cover:

- style
- POV
- knowledge boundary
- relationship pressure
- physical scene continuity
- heat language
- user move trigger
- write-for-me assist
- platform export

## Compiler Rules

The compiler should use semantic maps to decide:

- where a seed belongs
- whether it should compile at all
- how strongly it should shape the prompt
- whether it should show as user-facing copy
- whether it should only influence hidden backend prompt text
- whether it can write `{{user}}` directly

Default rule:

`{{user}}` is not written by the AI unless an explicit impersonation/write-for-me mode is active.

If impersonation assist is active, semantic maps can provide language banks for likely `{{user}}` actions, but the output should still be framed as an editable assist draft.

## User-Move Trigger Role

This layer should also help parse `{{user}}` moves.

Incoming user text can map to triggers such as:

- approach
- verbal invitation
- touch
- tease
- challenge
- hesitation
- withdrawal
- boundary signal
- scene redirect
- aftercare cue

Those triggers should route the next prompt differently. For example, a playful challenge and a real boundary can share some surface words, but they should not compile the same way.

The semantic map is where the app can encode that difference.

## Human-Facing UI

User-facing controls should stay fiction-friendly:

- `possessive`
- `protective`
- `push-pull`
- `dangerous chemistry`
- `messy jealousy`
- `soft dominance`
- `bratty tension`
- `slow-burn hesitation`

Backend routes can be more technical, but the UI should not read like a policy form.

## First Implementation Boundary

For now, this layer is documented and illustrated as `.se` design material under `docs/semantic-maps`.

Do not build a full parser yet. The next app-level implementation should be a TypeScript seed graph that borrows these node/edge concepts and has focused tests.
