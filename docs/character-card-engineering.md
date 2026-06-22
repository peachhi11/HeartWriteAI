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
