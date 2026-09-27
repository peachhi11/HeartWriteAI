# Prose Bank App Translation

This note translates `docs/source-material/prose_vocabulary_bank_humanized.md` into HeartWriteAI product architecture. The source bank is reference material, not runtime instruction text. App features should adapt its structures into user-editable fields, prompt modules, tests, and export behavior.

## Core Product Principle

HeartWriteAI should build isolated roleplay story stacks, not one giant prompt. The prose bank repeatedly separates durable identity, scene setup, triggerable lore, active memory, runtime rules, and review notes. That maps cleanly onto the current Bookshelf -> StoryBook -> Library Books model.

The app should help users answer one practical question at every layer: what does the model need here to stop making the story worse?

## StoryBook Shape

A StoryBook should be the assembled playable package for one character/user/storyline combination. It is the modular story object created by combining the Character Book, User Book, Scenario Book, World Book, Memory Book, and Prompt Book.

The StoryBook can be used in three related ways:

- as a continuous ongoing roleplay
- as a sequence of chapters or openings for the same storyline
- as a set of scenes, Alt branches, seasons, or narrative arcs that remain packaged with the same character/user/world/prompt context

It should bind these book types:

- Character Book: `{{char}}` identity and behavior model.
- User Book: lighter `{{user}}` identity and player-persona model.
- Scenario Book: active runtime context that updates regularly.
- World Book: semantic memory for setting, systems, and world facts.
- Memory Book: episodic memory for secrets, relationships, and story history.
- Prompt Book: procedural memory for how the AI should run the stack.

Books should stay linked, but not merged. The exporter decides which pieces are active for the current platform and prompt slot.

The StoryBook is where modular material becomes playable. Books preserve clean separation; the StoryBook assembles the active combination so stories do not bleed into each other.

## Character Book

The bank treats a character card as playable behavior, not authorial thesis. Character Books should support fields such as:

- Character Identity: name, role, age range, presentation, reputation, first impression, aliases, public facts
- Backstory: formative history, old damage, private truths, learned rules, origin of the mask
- Relationships: existing bonds, loyalties, obligations, pressure points, trust/desire/friction levers
- Personality: social style, cooperation style, emotional reactivity, duty/follow-through, openness to novelty
- Psychology: current want, hidden need, fear, shame, hope, self-beliefs, false beliefs, limits
- Cognition: what they notice first, how they infer, misread, remember, rationalize, decide, and problem-solve
- Behaviour: pressure habits, action palette, conflict habits, care language, consequence loop
- Sexuality: desire pattern, intimacy triggers, boundaries, power dynamics, heat permissions, aftercare/aftermath tendencies
- Speech Profile: rhythm, formality, swearing, humor, directness, silence, pet names, topic dodges, register shifts

The character-card intake panel should eventually save a loaded PNG/JSON card directly as a Character Book payload and preserve the raw card snapshot separately from app-generated interpretation.

## User Book

The User Book should not turn the character card into a persona. It should build a distinct `{{user}}` role that fits around the established card. It can mirror the Character Book headings, but should stay lighter because the AI does not own the player character. It only needs enough structure to support occasional impersonation, write-for-me, enhance-writing, and persona-aware prompt generation.

Useful fields:

- User Identity: the player character's name/handle, presentation, reputation, role, and first impression
- Backstory: lighter player-facing history and optional hooks
- Relationships: the user player's known bonds, loyalties, obligations, and pressure points
- Personality: default social style without locking the player's choices
- Psychology: wants, fears, self-concept, private pressure, and optional contradictions
- Cognition: what the user player tends to notice, assume, misread, or avoid
- Behaviour: habits, reactions, tells, boundaries, and default coping patterns
- Sexuality: optional desire pattern, boundaries, heat permissions, and intimacy preferences
- Speech Profile: optional voice notes for write-for-me, enhance-writing, and impersonation
- persona gender and pronoun frame
- display name / handle
- role in story
- connection to `{{char}}`
- what `{{user}}` knows directly
- what `{{user}}` suspects
- what `{{user}}` does not automatically know
- self-concept
- private want
- defensible reason to stay, leave, confront, hide, flirt, or refuse
- boundaries and player agency rules
- optional secrets `{{user}}` carries
- opening angle options

The User Book should keep player choice open. It should state possible pressure, not force emotion, consent, desire, motive, or next action.

## Scenario Book

The bank defines scenario as the setup or situation the characters are caught inside. In HeartWriteAI, the Scenario Book is the active runtime context layer: the AI's regularly updated contextual memory for what is happening now and what has recently changed.

It should update more often than the Character, User, World, or Prompt Books. It is not the whole story archive. It is the live scene packet and recent context the next generation needs.

Fields to support:

- scenario premise
- physical location
- setting frame: location + world context + situational frame
- time pressure
- relationship pressure
- visible problem
- active cast
- active objects
- privacy level
- first playable opening
- continuity mode: canon or Alt
- chapter, season, or narrative arc label
- recent context
- active memory packet
- current scene state
- next pressure

Scene is different from scenario. Scenario is the setup. Scene is what is happening right now.

## World Book

Worldbuilding should work through cause and effect. It should not be decorative lore. The World Book is the semantic memory layer: stable world knowledge that should be recalled when relevant, not constantly pasted into every prompt.

Fields to support:

- world type
- rules
- locations
- items
- factions
- events
- world seed: the one change the world grows from
- cascade: language, food, bodies, power, economy, family, ritual, tools, class, danger, intimacy, jokes, sensory foreground
- story use: how the world changes what characters want, fear, access, lose, or choose
- evolution: what changed before, what is changing now, who benefits, who resists, what may break next
- rituals/procedures
- social pressure systems

The UI should favor small world packets and lore entries over encyclopedia dumping.

## Memory Book

Memory should stay factual, current, and bounded. It should not become a transcript replay or reasoning log. The Memory Book is the episodic memory layer for the AI: secrets, relationship histories, important story events, and the lived sequence of what happened.

Fields to support:

- secrets
- relationship histories
- episodic memory
- current state: where, when, privacy, active pressure
- present cast: physically present, nearby, offscreen
- user-established facts: what `{{user}}` said, did, chose, refused, revealed, or visibly showed
- character knowledge: what `{{char}}` and NPCs know, suspect, misunderstand, or do not know
- open threads: promises, debts, lies, secrets, injuries, objects, messages, deadlines
- pivotal events: only events that change future behavior, leverage, knowledge, or relationship state
- relationship state: trust, attraction, conflict, power, repair, public/private status
- next pressure: the immediate playable issue, not a full plot plan

Secrets should stay structured as knowledge maps: who knows, suspects, misunderstands, hides, pretends not to know, or falsely believes they are safe.

## Prompt Book

Prompt Books should assemble modules rather than flatten everything into one prompt. The Prompt Book is the procedural memory layer for the AI: the guidelines for how to run the whole StoryBook stack.

The clean prompt stack is:

1. Global Prompt / Prompt Book: universal writing law, style, POV rules, consent logic, explicitness standards, user agency, no generic smut, and no narrator drift.
2. Character Book / User Book: the specific people, including voice, wounds, desire, kink logic, relationship dynamic, and blind spots.
3. World Book: semantic canon such as world type, places, NPCs, factions, rules, past events, and recurring pressures.
4. Proxy Context Layer / StoryBook: the operational brain for the active roleplay. It translates the global prompt into current-scene behavior.
5. Latest User Move: the immediate turn anchor, `LATEST_USER_MOVE: {{latest_user_move}}`.

Prompt module shape:

- role
- task
- subject
- context
- structure
- constraints
- quality target
- output format

Runtime modules should be grouped by job:

- stable global behavior: user-space, bounded knowledge, anti-parrot, continuity, physical scene logic
- StoryBook operational mode / proxy context layer: stable canon, live scene state, who knows what, active romantic/sexual pressure, boundaries, escalation pressure, and what must not be narrated for `{{user}}`
- active session layer: scenario, setting, current scene, relationship pressure, secrets, continuity branch, next pressure
- writing style: POV/lens/distance, rhythm/density, tone/sensory detail, dialogue/voice, subtext/emotion
- user-authoring mode: write-for-me, enhance writing, impersonate `{{user}}`
- memory compaction: updated memory only, no analysis, no inferred user motives
- review mode: pause scene, diagnose drift, separate fact from inference, name repair move

JanitorAI can map this into Global Prompt and Proxy Prompt first. The Global Prompt carries universal law. The Proxy Prompt carries the active StoryBook context layer: in this scene, who is angry, who is protective, who knows half the truth, what kink or romantic pressure is active, what secret has not surfaced, and what must stay open for `{{user}}`.

SillyTavern and Marinara need later controls for main prompt stack, AI role/guidelines, impersonation style, summary prompts, trackers, guided generation, and addable/subtractable fields.

## UI Implications

The Library tab should evolve from generic linked books into editable book-specific forms. Each book type needs its own compact field set, generate button, and source snapshot.

Near-term components:

- Save loaded character card as Character Book.
- Save generated user persona as User Book.
- Convert active scene/scenario fields into Scenario Book.
- Add World Book editor with world seed/cascade/story-use fields.
- Add Memory Book packet editor with current state, user-established facts, character knowledge, open threads, pivotal events, next pressure.
- Add Prompt Book module editor that outputs platform-specific slots.

Quality checks should test that exports do not:

- write `{{user}}` thoughts, feelings, dialogue, consent, body reactions, or next action
- turn silence, posture, clothing, friendliness, proximity, arousal, fear, or lack of refusal into hidden consent or motive
- give `{{char}}` information they cannot know
- parrot the user's previous message as filler
- collapse scenario, scene, setting, and memory into one unstructured block
- merge unrelated StoryBooks or leak one story's memory into another

## Suggested Roadmap

1. Add one-click Character Book save from loaded PNG/JSON card.
2. Add one-click User Book save from persona draft.
3. Add book-specific editors for Character, User, Scenario, World, Memory, and Prompt Books.
4. Add export assembler that reads active StoryBook bindings and builds platform-specific prompt slots.
5. Add tests for book isolation, prompt-slot placement, user-space protection, bounded knowledge, and memory compaction shape.
