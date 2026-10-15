---
name: relationship-tracker
description: Track incremental relationship development through milestones, access, trust, disclosure, routines, social integration, conflict, and repair.
metadata:
  owner: heartwriteai
  version: "1.0"
  category: relationship-continuity
  migration_status: reviewed
  runtime_safe: true
  source: heartwrite_memory_vault
  source_path: 01_Project_State/Agents/Skills/relationship-tracker/SKILL.md
---

# Relationship Tracker

## Purpose

Map slow, believable relationship progression and route meaningful changes to
active scene state and durable story memory without rushing attraction into
devotion or assigning `{{user}}` feelings.

## Core Principle

Relationships build incrementally. A private joke, a casual touch that is not
withdrawn, a personal item left behind, a shared routine, a missed routine, or
a changed willingness to answer can matter. One warm exchange is not full
trust, one conflict is not total collapse, and one intimate moment is not
permanent commitment.

## Relationship Axes

Track only the axes that matter to the current story:

- Access: private spaces, contact, secrets, proximity, caretaking, or intimacy.
- Trust: what each character can rely on the other for; trust is directional
  and specific.
- Disclosure: confession, partial admission, omission, secrecy, or changed
  willingness to answer.
- Reciprocity: whether care, pursuit, risk, attention, apology, or vulnerability
  is mutual, uneven, refused, or changing.
- Social integration: friends, family, coworkers, public acknowledgement,
  gossip, reputation, permission, and forbiddenness.
- Routine: repeated ordinary patterns that show comfort, dependence, drift, or
  neglect.
- Conflict and repair: rupture, avoidance, apology, changed behavior, repair
  evidence, relapse, and unresolved residue.

## Milestone Families

- Contact shift: a new touch, gaze, nickname, or closeness.
- Private language: jokes, gestures, rituals, names, or callbacks only they
  understand.
- Access granted: room, family, phone, routine, secret, vulnerability, body,
  or social world.
- Care exchanged: comfort, protection, practical help, listening, cleanup, or
  repair.
- Conflict: argument, jealousy, refusal, boundary, betrayal, or repair attempt.
- Social change: acknowledgement, introduction, gossip, exclusion, invitation,
  shared attendance, or reputation shift.
- Domestic change: item left behind, spare key, shared drawer, usual seat,
  morning routine, or absence of a routine.
- Intimacy: confession, partial admission, erotic first, aftercare, or reliance.
- Regression: withdrawal, forgotten promise, missed routine, cooling contact,
  secrecy, or social distance.

## Workflow

1. Detect a narrative or dialogue event that may change the relationship.
2. Identify which axes changed and whether the direction is progression,
   regression, complication, stabilization, rupture, repair, or ambiguous.
3. Require observable evidence proportional to the claimed change.
4. Reflect `{{char}}`'s immediate response through behavior, dialogue, distance,
   attention, hesitation, or routine.
5. Preserve `{{user}}` agency. Do not decide their feelings, consent, choices,
   dialogue, bodily reactions, or emotional conclusion.
6. Route active effects to Scenario Book.
7. Route durable milestones, residue, repair evidence, and callback potential to
   Memory Book.
8. Keep progression gradual unless the event carries major cost, risk, or an
   explicit canon change.

## Output Shape

```yaml
relationship_tracker:
  participants:
  milestone:
  milestone_type:
  axes_changed:
    access:
    trust:
    disclosure:
    reciprocity:
    social_integration:
    routine:
    conflict_repair:
  direction: progression|regression|complication|stabilization|rupture|repair|ambiguous
  evidence:
  immediate_char_response:
  scenario_update:
  memory_update:
  callback_potential:
  user_agency_check:
```

For roleplay response generation, show the milestone through changed behavior,
routine, access, social response, or distance instead of explaining the whole
relationship state to the reader.

## HeartWrite Placement

- Scenario Book: active tension, current milestone, immediate reaction,
  participants, setting, and unresolved pressure.
- Memory Book: durable milestones, residue, callbacks, repair evidence,
  regressions, and changed trust.
- Character Book: baseline attachment, trust pattern, intimacy pace, conflict
  style, repair style, and social visibility tolerance.
- User Book: optional player preferences for impersonation assist only; never
  use it to assign `{{user}}` feelings or choices.
- Prompt Book: milestone recognition, gradual progression, and memory routing.

## Guardrails

- Preserve `{{user}}` agency and never dictate their thoughts, feelings,
  reactions, consent, choices, dialogue, or emotional conclusion.
- Do not rush from attraction to devotion, conflict to repair, or intimacy to
  commitment without evidence.
- Do not flatten relationship state into a single positive or negative label.
- Not every milestone is romantic; trust, routine, visibility, practical
  reliance, conflict, avoidance, and grief also matter.
- Do not overwrite established history because the current beat is warmer or
  colder.
- Do not force a breakup or separation without a real reason, competing want,
  prior pressure, and aftermath.
- Do not treat apology words as full repair without changed behavior, tangible
  cost, and room for forgiveness to be withheld.
- Keep reactions aligned with prior development, current state, and knowledge
  boundaries.
- Use ALT for a compatible alternate setup and BRANCH for hard divergence from
  canon or established history.

## Quality Checks

- What changed, and what evidence justifies it?
- Which axis moved, and was the change proportional?
- Does the update preserve prior history and unresolved residue?
- Should it update Scenario Book, Memory Book, or both?
- Did the response avoid assigning `{{user}}` a feeling or action?

## Provenance

Migrated from the HeartWriteAI Memory Vault skill at
`01_Project_State/Agents/Skills/relationship-tracker/SKILL.md`.
Supporting worksheets and repair references remain vault-owned until separately
reviewed.
