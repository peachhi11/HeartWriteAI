# Character Card Engineering

HeartWriteAI treats character cards as layered design artifacts, not just
descriptions. Many roleplay-card problems become confusing because authors try
to solve three different systems inside one field.

The core organizing model is:

```text
Character Layer
x Writing Layer
x Context Architecture Layer
= Roleplay Quality
```

Weakness in any layer limits the result.

## The Three-Layer Model

### Level 1: Character Layer

The character layer answers: who is this character?

Common inputs:

- Description
- Personality
- History
- Relationships
- Motivations
- Goals
- Flaws
- Examples
- Character books
- Reinforcement
- Behavior architecture

This layer generates behavior. It defines the character's baseline identity and
the psychological processes that turn events into actions.

Examples:

- Former combat medic
- Distrustful of authority
- Loyal to patients
- Checks exits automatically
- Intellectualizes emotions

### Level 2: Writing Layer

The writing layer answers: how is the behavior presented?

Common controls:

- POV
- Tense
- Formatting
- Agency rules
- Continuity rules
- Scene pacing
- NPC autonomy
- Dialogue style
- OOC systems

This layer generates presentation. It does not decide who the character is. It
decides how the character's behavior reaches the reader through narration, turn
structure, prose style, boundaries, and scene flow.

Examples:

- Close third person limited
- Past tense
- Do not write user thoughts
- End before user response
- Maintain continuity

### Level 3: Context Architecture Layer

The context architecture layer answers: where should information be placed for
maximum effectiveness?

Common controls:

- Description strategy
- Solo vs party design
- Attention management
- Field visibility
- Reinforcement placement
- Author's Notes
- Post-History
- Context decay mitigation
- Entropy management

This layer generates persistence. It decides which information the model is
most likely to retain, which fields should carry which kinds of instructions,
and how important details survive long sessions.

Examples:

- Abstract concepts early
- Concrete behaviors late
- Important group information in description
- Hidden lore in character books

## Why This Distinction Matters

Many card authors try to fix a writing problem with character design.

Example:

```text
Desired outcome: better prose
Mistaken fix: {{char}} is eloquent.
```

The real issue is usually a writing-layer problem, not a character-layer
problem. The solution belongs in presentation guidance:

```text
Use literary prose.
Vary sentence rhythm.
Emphasize sensory details.
```

Likewise, if the character keeps puppeting the user, rewriting personality is
usually the wrong fix. That is an agency-rule problem, and agency rules belong
in the writing layer.

Most roleplay problems can be traced to the wrong layer:

- If behavior is wrong, examine the character layer.
- If prose, formatting, or user agency is wrong, examine the writing layer.
- If consistency fades over time, examine the context architecture layer.

Effective roleplay design comes from understanding how all three layers
interact instead of trying to solve every problem inside the character
description.

## Truth Separation Model

The next HeartWriteAI compiler layer separates portable character truth from
scenario truth and setting truth.

The character card should carry only the stable system that generates the
character:

- immutable identity facts
- core behavioral laws
- law hierarchy
- wounds, fears, desires, defenses, and biases
- state-based behavior generators
- speech laws and voice causes
- portable relational architecture
- constraints and replacement actions

The character card should not carry story-specific facts:

- no `{{user}}` relationship facts
- no named NPC dependencies
- no shared-history anchors
- no timeline-specific secrets
- no scene-specific backstory
- no setting facts that define only one scenario

Story-specific truths belong in lorebooks. These include current relationship
status, shared history, secrets, target-specific behavior overrides, NPC
pressure, faction status, and route-specific emotional stakes.

Setting truth belongs in the scenario layer. These include location, social
environment, economic pressure, cultural rules, legal constraints, current
premise, and immediate scene pressure.

The compiler should therefore treat a full authoring form as a source document,
not as a single card prompt. It should split the source into:

```text
Tier 1: Character Truth
-> CCV3 character fields and character-truth extensions

Tier 2: Behavior/Writing Runtime
-> hidden runtime state, prompt-safe projections, and post-history guidance

Tier 3: Story-Specific Truths
-> lorebook entries

Tier 4: Setting Truth
-> scenario records and opening-scene context
```

This stops the card from describing one timeline and makes it describe the
system that generates the character across many timelines.

## Character Architecture Generation Prompt

The character-generation prompt should not ask the model to write a pretty
roleplay profile first. It should ask for a portable behavioral architecture:
the stable source code that generates the character across many scenes.

The prompt should therefore prefer:

- immutable character laws over personality labels
- cause-based psychology over decorative backstory
- stable physical traits over scene-specific styling
- speech laws over repeated catchphrases
- event-processing rules over vague mood descriptions
- replacement actions whenever a constraint forbids an action

For example:

```text
Weak: {{char}} is loyal and protective.

Stronger:
Once a person is classified as safe, {{char}} evaluates threats to them under a
different standard than threats to strangers. Protection must respect consent;
if help is not requested, {{char}} stays nearby, watches the room, and offers a
clear exit instead of taking control.
```

The generation prompt should also enforce truth placement:

```text
Portable character truth -> card fields and character engine
Story-specific truth -> lorebook or runtime canon ledger
Setting truth -> scenario
Opening prose -> first_mes only
```

Adult-only character material follows the same rule. It should be generated
from psychology, trust, safety needs, consent style, shame, confidence, and
boundaries. It should not become a random preference list, and it should not be
included at all unless adult field mode is explicitly enabled for adult
fictional characters.

## Human View vs LLM View

The creator UI and the model prompt should not use the same formatting.

The human view should stay structured:

```text
Identity
Psychology
Character Engine
Runtime
Scene Directives
Response
```

Tabs, headings, labels, collapsible fields, and clean categories help humans
edit complex characters without losing the plot.

The LLM view should be flattened. Headings and schema labels usually cost
tokens without improving behavior once the compiler already knows what each
source means. Model-facing output should read like compact executable prose:

```text
Levi Hayes notices exits before he notices decor.

When someone vulnerable is being harmed, remaining passive creates immediate
internal discomfort. He intervenes first with words, then with presence, and
only uses force when other options have failed.

During conflict, Levi becomes quieter rather than louder. He attempts
conversation first. If violence becomes necessary, he ends it quickly.
```

The compiler rule is:

```text
Structured data for editing.
Flattened prose for prompting.
Beautiful headings for humans.
No unnecessary headings for the LLM.
```

This makes debugging easier. If behavior breaks, ask which layer generated the
problem:

- identity or psychology if the person feels wrong
- character engine if the reaction logic feels wrong
- runtime if the relationship or scene state feels wrong
- scene directives if the immediate response shape feels wrong
- writing layer if the prose, POV, or agency handling feels wrong

## Cause Chain Intake

The app can reduce creator friction by asking for causal material once and
routing it into the right layer automatically:

```text
What happened?
-> Biography / Writer Bible

What belief did this create?
-> Psychology

How does that belief affect decisions?
-> Character Engine
```

The important boundary is that the formative event itself does not need to
become prompt-facing law. It can stay in the Writer Bible as human-readable
biography or source context. The belief becomes the durable psychological
truth. The decision effect becomes executable behavior.

Example:

```text
What happened?
During a childhood evacuation, she learned that exits mattered more than
promises.

What belief did this create?
Safety depends on knowing the way out before anyone panics.

How does that belief affect decisions?
She chooses routes with exits, keeps spare plans, and resists being trapped in
one option.
```

Compiled placement:

```text
Writer Bible:
During a childhood evacuation, she learned that exits mattered more than
promises.

Psychology:
Safety depends on knowing the way out before anyone panics.

Character Engine:
When the current situation activates this belief, she chooses routes with exits,
keeps spare plans, and resists being trapped in one option. When blocked, she
names the exit, offers a choice, and lets the other person move first.
```

This preserves the cause without forcing the model to repeat biography as
exposition every time the behavior appears.

## Writer Bible vs Character Engine

HeartWriteAI now treats creator-facing character documentation and model-facing
character cognition as two different authoring lanes.

The Writer Bible is for humans. It can read like a polished reference document:

- project summary
- themes
- world and character reference
- relationship arc notes
- active threads
- style notes
- source notes

This lane can contain rich story context because its job is comprehension. It
should help a creator understand the character, the tone, and the emotional
promise of the project. It is stored as a non-prompt-facing reference layer and
should not be treated as portable card law by default.

The Character Engine is for machines. It turns the character into compact,
repeatable cognition:

- core wound
- core belief
- core fear
- primary drive
- decision rules
- defense mechanisms
- attachment style
- behavioral triggers
- relationship dynamics
- speech rules
- sexuality rules

Decision rules should be written as event-processing logic:

```text
Protection asks, "Does the other person request help?"
If the answer is yes, protect with explicit consent and shared control.
If the answer is no, observe and stay available without taking over.
Do not override autonomy to make the character feel safer.
When blocked, ask before touching and offer a practical exit route.
```

The alternative action is required whenever a rule says the character cannot,
does not, should not, or must not do something. This gives the model an allowed
replacement behavior and prevents backsliding into the forbidden action.

The authoring rule is:

```text
Writer Bible -> human-facing reference
Character Engine -> prompt-safe runtime cognition
Story-specific truth -> lorebook
Setting truth -> scenario
```

## Project Action Bus

HeartWriteAI uses a small deterministic project action bus to move source
material between truth tiers. This borrows the general command-orchestration
idea from writing tools, but the implementation is native to HeartWriteAI:
typed TypeScript actions, reviewable artifacts, and compiler boundaries instead
of giant prompt calls.

Current project actions:

- `card.compileTruth`
  - compiles portable character truth into CCV3 card fields
  - detects story or setting leaks before export
- `lorebook.promoteStoryTruth`
  - moves relationship facts, target overrides, shared-history anchors, and
    scenario-specific secrets into review-required lorebook entries
- `scenario.compileSettingTruth`
  - moves residence, wealth, social pressure, faction, and location context into
    scenario truth
- `runtime.auditContinuity`
  - checks whether compiled outputs respect the character, story, setting, and
    runtime boundaries
- `runtime.compileCanonLedger`
  - compiles character state, relationship state, known facts, timeline anchors,
    memory anchors, plotlines, and hard constraints into one reviewable runtime
    canon ledger
- `context.inspectPromptSources`
  - summarizes which card, lorebook, scenario, runtime, and recent-chat sources
    would feed a prompt
- `export.packageCardBundle`
  - creates a review manifest for exporting the card fields, lorebook, scenario
    truth, and continuity audit together

These actions are not user-facing prompt text. They are internal compiler
commands. Their job is to keep the system honest: character laws stay in the
card, story facts move to lorebooks, setting facts move to scenarios, and
runtime inspection stays prompt-safe.

## Continuity Canon Ledger

The continuity canon ledger is the first durable runtime container for the
material that should affect future turns without being baked permanently into a
portable character card.

It stores:

- character state
- relationship state
- known facts
- timeline anchors
- open plotlines
- memory anchors
- hard constraints and replacement actions

This layer answers: what has become true in this project or session, and how
should it affect the next generation pass?

The ledger is deliberately separate from the Writer Bible and the Character
Engine. The Writer Bible stays human-facing. The Character Engine describes the
portable system that generates behavior. The canon ledger stores evolving
runtime continuity: what happened, what it meant, what remains unresolved, what
must not be contradicted, and what the model should do instead when a constraint
blocks an action.

Prompt projection from the ledger must stay compact and prompt-safe:

- expose prose guidance, not internal IDs
- expose qualitative state, not raw scores
- keep review-required facts out of default prompt context
- include replacement actions for physical, protocol, ethical, or behavioral
  constraints
- never treat the ledger as a replacement for user agency

## Lorebook Intelligence Layer

Lorebooks are not just lists of notes. In long roleplay sessions they behave
like activation graphs: one entry can trigger another through keywords,
constant entries consume context every turn, hidden entries still compile for
the model, and recursive links can create surprising context pressure.

HeartWriteAI keeps this deterministic. The lorebook intelligence layer provides:

- shared keyword matching for literal and regex keys
- activation graph construction from entry content to target keys
- recursion cycle detection
- keyword inventory with duplicate, generic, invalid-regex, and substring checks
- deterministic health QC across structure, config, keyword, recursion, budget,
  and spoiler/review categories
- multi-message activation simulation with recursion trace and token budget
  pressure

This layer is deliberately separate from LLM review. It should answer the
questions a machine can answer reliably:

```text
Which entries can activate?
Which entries activate each other?
Which keywords are brittle, duplicated, or too broad?
Which hidden entries need review?
Which constants consume budget before the scene even starts?
What would fire for this sample chat?
```

LLM review can sit on top later for prose quality, split suggestions, and
semantic keyword expansion, but it should not replace deterministic activation
and budget checks.

## Layer Failure Patterns

Strong character plus weak writing produces:

- Interesting psychology
- Poor immersion
- User puppeting
- Flat prose

Strong writing plus weak character produces:

- Beautiful prose
- Boring behavior
- No internal conflict
- No memorable identity

Strong character plus strong writing plus poor architecture produces:

- Excellent opening
- Severe drift after 30 messages
- Lost personality
- Broken continuity

Strong all three produces:

- Interesting behavior
- Strong prose
- Stable long-term consistency
- High immersion
- Good user agency

## Behavior Architecture Belongs to the Character Layer

Behavior architecture is not writing style. It is character psychology.

It answers a more specific character-layer question:

```text
How does this character process events?
```

For example:

```text
Authority threat -> defiance
Vulnerability -> intellectualization
Alliance -> reluctant cooperation
Attraction + low trust -> conflicted friction
```

This is not just who the character is. It is how the character interprets
important events and converts them into behavior.

## Dynamic State System Bends Behavior

The dynamic state system is the character-layer bridge between fixed identity
and moment-to-moment behavior. The character is still recognizable, but their
perception, tone, restraint, and decisions shift as internal state changes.

The primary axes are:

```text
Trust:
- low trust: defensive, suspicious, closed
- middle trust: cautious engagement
- high trust: open, responsive, more personal
- very high trust: vulnerable, invested, protective

Attraction:
- optional romance layer
- low: neutral or only curious
- high: drawn in, attentive, proximity-seeking
- very high: fixated, attached, difficult to compartmentalize

Emotional regulation:
- low: volatile, impulsive, fragmented
- middle: reactive but still able to think
- high: controlled and responsive
- very high: composed, filtered, possibly suppressed

Power perception:
- negative: feels dominated, cornered, or intimidated
- neutral: equal footing
- positive: feels able to steer, protect, or command
```

State changes should follow the same causal pattern as events:

```text
Trigger -> Interpretation -> Adjustment
```

For example:

```text
Kindness without cost
-> "This might be genuine"
-> trust rises slightly

Inconsistency
-> "Something is off"
-> trust drops and regulation tightens

Emotional vulnerability shown
-> "They are opening up"
-> trust or attraction may rise, depending on the character
```

States modify the existing behavior profile. They do not overwrite it.

```text
Baseline:
Being helped -> suspicious -> resists

High trust:
Being helped -> accepts -> quiet gratitude

Low regulation:
Being helped -> snaps -> regrets the overreaction later
```

Expose effects, not numbers. The prompt should show tone shifts, openness,
initiative, visible restraint, and decision bias. Raw state values belong to
the engine, not to the prose-facing card output.

State memory prevents reset. Trust should not return to neutral after a
meaningful betrayal or repair. Attraction can decay if ignored. Emotional
spikes can normalize, but repeated triggers should keep pressure active.

The implementation rule is:

```text
Character Sheet
+ Current State
= Final Behavior
```

Never use state alone, and never use traits alone. The believable behavior is
the interaction of both.

## Dialogue Control Belongs to the Writing Layer

Dialogue control is not the same thing as personality. It is the writing-layer
system that decides how a character's current voice is performed on the page.

Good dialogue comes from three inputs working together:

```text
Character sheet voice
x Dynamic state modulation
x Narrative arc phase
= Performed dialogue
```

The character sheet anchors baseline voice: sentence length, vocabulary level,
directness, emotional expressiveness, and quirks.

The dynamic state system modulates that voice. Low trust makes dialogue more
guarded and testing. High trust makes it more personal. Low emotional
regulation makes it sharper, interrupted, or incomplete. Attraction can make
language more specific and attentive without requiring direct confession.

The narrative arc phase controls pacing and exposure. Initiation favors
probing and observation. Development allows light personal reveals. Escalation
sharpens the tone. Crisis strips dialogue down to urgent truth. Resolution
slows the rhythm and lets reflection enter.

Dialogue should also rotate function. A line can probe, push, pull, deflect,
reveal, or control. Repeating the same function over and over makes scenes feel
circular even if every line is technically in character.

Subtext is the pressure valve. What is said should not always equal what is
meant. Instead of making a character announce "I like you," a stronger line may
be:

```text
"You're... harder to ignore than you should be."
```

Variation matters. Avoid repeated phrases, predictable openings and closings,
and identical sentence shapes. Use silence, pauses, short replies, and
action-only beats when negative space carries more force than explanation.

The compact rule is:

```text
No repeated phrases.
State affects tone.
Alternate sentence length.
Maintain voice consistency.
```

## First Message Generator Converts Sheet Into Starter

The first message generator is the opening-scene compiler. It should not invent
a generic greeting and then paste the character's name into it. It should pull
from the sheet and turn character data into a playable first beat.

The generator reads:

```text
Core traits -> tone and pacing
Speech profile -> voice and quirks
Behavior profile -> revealing action and reaction pattern
Motivational drivers -> hidden intent and subtext
Worldview -> framing of the situation
```

The message structure is:

```text
Hook:
- immediate sensory or situational anchor
- reflects the character's perception style

Character action:
- small revealing behavior
- not a generic greeting

Interpretation layer:
- how {{char}} processes {{user}} or the situation
- anchored only to what {{char}} can perceive or infer

Dialogue:
- voice, tone, diction, and quirks from the speech profile

Subtext:
- hidden intent from motivational drivers

Optional tension or curiosity gap:
- question, contradiction, withheld detail, or open action
```

The starter must imply personality, power dynamic, and emotional stance. It
should create curiosity, tension, or invitation.

Avoid:

```text
"Hi."
"Hello."
generic smiles
neutral exposition
writing {{user}}'s thoughts, actions, feelings, or decisions
```

The compact output template is:

```text
*<environmental or physical action>*

"<dialogue line>"

*<micro-reaction or internal interpretation>*

Optional: add tension hook or curiosity gap.
```

Variation types change how the same structure enters the scene:

```text
Dominant entry:
- controls the scene frame

Reactive entry:
- responds to {{user}}'s presence or interruption

Slow-burn entry:
- low intensity, high subtext

High-tension entry:
- conflict or danger is already present
```

The first message should end before {{user}} responds. It is an invitation to
play, not both sides of the exchange.

## User Persona Profiles Shape Matching

User persona profiles describe the user's playable stance for matching,
search, and route pressure. They are not instructions to write the user's
actions, thoughts, feelings, or consent.

The useful sections are:

```text
Basic:
- name or alias
- age
- background
- role or archetype
- starting situation

Psychology:
- core traits
- insecurities
- desires
- boundaries

Cognition:
- attention
- perception
- memory
- decision style

Motivational drivers:
- autonomy
- competence
- relatedness
- intrinsic
- extrinsic

Relational style:
- attachment style
- trust formation
- conflict style

Attraction and chemistry hooks:
- what they respond to
- what destabilizes them

Behavior patterns:
- trigger -> interpretation -> response

Story hooks:
- goals
- internal conflicts
- external pressures
```

This layer gives the compatibility matrix something concrete to compare
against character models. It should remain editable and prompt-safe: expose
the persona's tags, boundaries, preferences, and route-relevant signals, but
do not convert them into forced user behavior.

## Compatibility Matrix Predicts Pair Dynamics

The compatibility matrix is the persona-matching layer. It does not decide
that a pairing must succeed or fail. It predicts what kind of pressure the
character and persona will create together.

The matrix asks:

```text
Attraction vector:
- what the character is drawn to
- what the persona emits
- alignment: high, medium, or low
- result: immediate chemistry, slow burn, or no spark

Friction points:
- character sensitivities
- persona pressure points
- collision type: value clash, emotional mismatch, pacing mismatch, or power
  imbalance
- result: productive tension, destructive loop, or avoidance pattern

Emotional economy:
- who invests first
- who withholds
- reciprocity pattern
- result: balanced, asymmetrical, parasitic, or volatile

Power dynamics:
- control axis: dominant, reactive, or avoidant
- dependency axis
- stability: stable, shifting, or unstable

Behavioral feedback loop:
- character -> persona -> character
- trigger -> response -> escalation or de-escalation
- loop type: reinforcing, degrading, or chaotic

Narrative trajectory:
- likely arc: collapse, growth, obsession, rivalry, or slow bond
- sustainability: short-term, mid-term, or long-term viable

Risk factors:
- burnout risks
- repetition risks
- derailment triggers
```

The final assessment should name:

```text
overall compatibility
best use case
required adjustments
```

High compatibility does not mean low friction. A strong pairing may have sharp
friction if the loop produces repair, growth, attraction, or useful tension.
Low compatibility usually means the loop burns out, repeats destructively, or
requires adjustments before it can sustain long-form roleplay.

## Memory Compression Stabilizes Long Context

Long-form roleplay should not remember everything equally. The memory layer
separates identity, relationship continuity, and disposable scene noise.

Use three tiers:

```text
Tier 1 - Core Identity:
- character laws
- core traits
- speech profile
- motivational drivers
- never decays

Tier 2 - Relationship Memory:
- trust shifts
- key emotional events
- turning points
- promises, betrayals, confessions
- compressed and slow to decay

Tier 3 - Contextual Memory:
- locations
- minor actions
- temporary states
- scene details
- fast decay unless relevant again
```

Compression should convert raw history into:

```text
event -> meaning -> state impact
```

Example:

```text
Conflict about trust -> unresolved tension -> trust decreases
```

Recall should trigger only when the current scene meaningfully resembles a
stored pattern: a similar situation, the same emotional trigger, a repeated
behavior pattern, or a state threshold crossing.

Good recall changes expectation, tone, and subtext. It should not dump old
transcripts back into the prompt.

Weak pattern:

```text
As you said twenty messages ago...
```

Stronger pattern:

```text
You have a habit of disappearing when things get complicated.
```

The rule is simple: do not remember everything. Remember what changes
behavior.

## Narrative Arc Control Guides Story Movement

Narrative arc control is the route-level system that keeps story pressure from
burning out early, stagnating in the middle, or escalating chaotically.

It tracks:

- current phase
- allowed event type
- emotional intensity
- state movement speed
- phase transition pressure
- narrative fatigue

The five core phases are:

```text
Phase 1 - Initiation:
- establish tone, dynamics, and baseline states
- use micro events, light friction, and environmental hooks
- avoid confessions, extreme attachment, and major betrayal

Phase 2 - Development:
- build connection, repeated patterns, and tension loops
- use micro and meso events, misunderstandings, and early vulnerability
- avoid repetition loops

Phase 3 - Escalation:
- increase stakes and emotional intensity
- use meso events and selective major events
- avoid chaos without direction

Phase 4 - Crisis / Turning Point:
- force irreversible change
- use major events only
- avoid small talk loops and low-stakes filler

Phase 5 - Resolution / Stabilization:
- process consequences or redefine the relationship
- use vulnerability, reflection, and soft interpersonal events
- avoid dragging the aftermath too long
```

Pacing modes change how quickly the controller allows phase movement. Slow burn
stays longer in initiation and development. Fast-paced routes inject earlier
conflict. Chaotic routes can overlap phases, but they need stabilization after
large spikes.

Arc correction handles derailment:

- Too calm: inject escalation.
- Too chaotic: force stabilization.
- Too repetitive: shift phase or add a new event category.
- Premature crisis: downshift into development or escalation pressure.
- Dragging resolution: lock the new baseline or seed the next arc.

The golden rule is:

```text
Phase controls events.
Events change states.
States modify behavior.
```

Do not let states alone drive story, and do not let events alone drive story.
The route should feel like things build, peak, and resolve.

## Event Engine Creates Context-Aware Pressure

The event engine is the system that injects pressures into the route. Events
are not random incidents. They are context-aware, state-aware, and
character-aware.

Events should:

- force state changes
- reveal hidden traits
- prevent repetition
- create narrative momentum

The core event categories are:

```text
Interpersonal:
- conflict
- vulnerability moments
- misunderstandings
- power shifts

Environmental:
- new location
- external threat
- resource limitation
- time pressure

Internal:
- emotional spikes
- memory triggers
- moral dilemmas
- identity conflict

Relationship:
- third-party interference
- jealousy triggers
- loyalty tests
- betrayal opportunities
```

Events also have escalation tiers:

```text
Tier 1 - Micro:
- tone change
- slight misunderstanding
- small reveal

Tier 2 - Meso:
- argument
- emotional reveal
- external complication

Tier 3 - Major:
- betrayal
- confession
- crisis
- forced separation
```

Do not jump tiers too quickly unless the current phase, premise, or state
pressure justifies it.

Each event should compile through the same structure:

```text
Trigger:
what happens externally

Interpretation:
how the character processes it based on sheet and state

State impact:
which states change and how

Behavioral outcome:
what the character does
```

The same event should not affect every character the same way. A late reply may
be nothing to a secure character, but to an anxious character it can become a
fear of replacement, loss, or abandonment.

Inject events when a loop is detected, a state plateaus, the route becomes too
predictable, or emotional intensity stays too stable. Avoid injecting when a
strong moment is already unfolding or natural progression is happening.

The event engine works best when it feels inevitable in context:

```text
Character Sheet
+ Dynamic State System
+ Persona Pressure
= Emergent Story
```

## Event-Driven Psychology

Use events to drive behavior. A character can be guarded in many different
ways depending on what happened.

Weak pattern:

```text
{{char}} is distrustful.
```

Stronger pattern:

```text
When someone requests trust:
- verifies claims
- seeks corroboration
- tests consistency
```

Weak pattern:

```text
{{char}} is emotionally unavailable.
```

Stronger pattern:

```text
When confronted with emotional intimacy:
- redirects toward practical concerns
- offers solutions instead of comfort
- changes subject when uncomfortable
```

Actions and behaviors outperform abstract traits because they give the model
something observable to generate.

## Metrics as Friction, Not Gates

Avoid treating relationship scores as hard locks.

Weak pattern:

```text
Trust below 50 means {{char}} cannot cooperate.
```

Stronger pattern:

```text
Low trust makes cooperation uncomfortable.
High trust makes cooperation natural.
```

Narrative events should still be able to produce exceptions. People often
cooperate before trusting, feel attraction before liking someone, protect
people they dislike, and reject people they love.

Metrics should influence expression rather than determine possibility.

## Event Dominance

Major narrative events often matter more than relationship scores.

Example:

```text
Trust: low
Event: {{user}} saves {{char}}'s life
```

A rigid system says trust is still too low.

A flexible system says {{char}} reluctantly relies on {{user}} while
struggling to reconcile that reliance internally.

The second pattern usually produces better storytelling because the character
reacts to circumstance without pretending the long-term relationship has
already changed.

## Psychological Defense Systems

Advanced solo characters benefit from defense mechanisms that generate
recurring behavior.

Examples:

- Intellectualization: when emotionally overwhelmed, the character retreats
  into analysis, technical explanations, and problem-solving.
- Humor: when vulnerable, the character uses jokes to redirect attention.
- Withdrawal: when threatened, the character becomes quieter and emotionally
  distant.

These mechanisms should be written as actions, not labels. The model needs to
know what the character does.

## Relationship Processing Models

Instead of storing only numbers:

```text
Trust: 35
Affinity: 22
```

Define what changes when trust increases:

```text
Low trust:
- shares little information
- checks motives
- keeps escape routes visible

Medium trust:
- asks for limited help
- reveals practical needs
- accepts short-term cooperation

High trust:
- reveals fears
- asks directly for comfort
- lets silence feel safe
```

Observable progression gives the model concrete behavior to generate.

## Attraction Architecture

Attraction should not be binary.

Weak pattern:

```text
{{char}} is attracted or not attracted.
```

Stronger pattern:

```text
Attracted + low trust:
- conflicted attraction
- involuntary attention
- sharp verbal deflection
- sudden withdrawal after closeness

Attracted + high trust:
- comfortable attraction
- relaxed proximity
- open warmth
- steadier physical affection
```

The same underlying emotion can have different expressions depending on trust,
stress, context, and history.

## State Machines as Behavioral Compression

State design is an advanced technique for compressing repeated behavior into
reusable packages.

Example states:

```text
Neutral:
- precise
- controlled
- observant

Defensive:
- sarcastic
- guarded
- dismissive

Vulnerable:
- hesitant
- less formal
- more emotionally honest

Protective:
- takes initiative
- accepts risk
- prioritizes others
```

States help the model translate internal psychology into visible actions,
dialogue texture, pacing, and body language.

## Core Teaching

Basic cards describe traits. Advanced cards describe processes.

The most durable roleplay characters are often built around repeatable:

```text
event -> interpretation -> reaction
```

patterns that let the model reconstruct consistent behavior under changing
circumstances.
