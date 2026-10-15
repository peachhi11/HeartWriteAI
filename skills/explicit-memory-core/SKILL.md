---
name: explicit-memory-core
description: Route meaningful adult consensual erotic-romantic scene details into continuity-safe memory without inferring hidden player state.
metadata:
  owner: heartwriteai
  version: "1.0"
  category: memory-core
  migration_status: reviewed
  runtime_safe: true
  source: heartwrite_memory_vault
  source_path: 03_Memory_Core/Explicit Memory Core.md
---

# Explicit Memory Core

## Purpose

Store, route, and recall meaningful adult consensual erotic-romantic scene
information without losing narrative continuity, emotional consequence, spatial
logic, or `{{user}}` agency. This is a memory-routing contract, not a scene
generator.

## Core Principle

Explicit scenes should be character-driven, physically readable, emotionally
consequential, and grounded in the current scene. Intimacy may leave physical
residue, emotional residue, changed assumptions, altered comfort, kink
discovery, aftercare needs, awkwardness, tenderness, shame, pride, jealousy,
relief, avoidance, or relationship pressure.

## Memory Selection

Track only details that affect future play:

- heat mode, participants, and adult-consent context
- vocabulary register, dirty-talk style, and kink focus
- positions, spatial orientation, active acts, and scene-relevant mechanics
- established body-state cues, clothing or cleanup state, marks, soreness,
  fatigue, breath, or environmental constraints
- boundary state, check-in style, stop/slow signals, redirects, and aftercare
  requirements
- emotional residue and relationship effects such as trust, access, intimacy,
  avoidance, expectation, conflict, repair, or a milestone

Do not store inferred hidden `{{user}}` thoughts, arousal, orgasm, consent,
motive, or emotional conclusion unless the user explicitly states them or asks
for impersonation assistance.

## Consent And Boundary Routing

Track observable or explicitly stated signals such as invitation, welcomed
friction, request, hesitation, withdrawal, redirect, boundary, stop signal, and
aftercare cue. If a signal indicates refusal, distress, freezing, meaningful
hesitation, pain outside the established dynamic, or boundary language, route
away from escalation toward pause, repair, aftercare, space, or scene
transition.

Consent routing should be contextual rather than a repetitive clinical
checklist. Preserve the difference between established agreements, present
observable response, and unknown internal experience.

## Character And Dialogue Continuity

Characters remain active participants. `{{char}}` may initiate, reciprocate,
interrupt, reposition, slow down, change tactics, guide touch, refuse, correct,
or pursue pleasure when consistent with character, consent context, and scene
state.

Store dirty-talk style only when it becomes character-significant. Useful
categories include praise, degradation, command, begging, teasing, worship,
possessiveness, reassurance, confession under pressure, humor, and denial.
Do not store every line; store repeatable style, trigger, relationship meaning,
and emotional effect.

## Somatic And Spatial Continuity

Every meaningful reaction should have a physical cause. Track what touch,
pressure, angle, rhythm, position, fatigue, breath, clothing, furniture, or
environment changes the pacing, access, pressure, power, or comfort.

Track who is where, orientation, distance, reach, barriers, exposure, clothing,
furniture, and how a position or location change alters the scene. Update
Scenario Book before continuing when explicit action changes position or place.

## Kink, Intensity, And Aftercare

Kinks should shape action, dialogue, staging, escalation, and payoff. Track
whether a focus is established, newly discovered, tentative, welcomed,
conflicted, or off-limits, along with its signals, boundaries, and aftercare.

Do not invent a climax, orgasm, or player response. Store only established
on-page or explicitly supplied details and their future consequence.

Do not end every explicit scene with automatic sleep or fade-out. Aftermath may
include cleanup, water, clothing, first aid, soreness, fatigue, tenderness,
embarrassment, laughter, withdrawal, conversation, renegotiated boundaries,
another round, or social consequence.

## Prompt Compiler Shape

```yaml
explicit_memory_core:
  explicit_mode:
  heat_level:
  participants:
  consent_context:
  active_acts:
  positions:
  spatial_continuity:
  dirty_talk_style:
  kink_focus:
  orgasm_sequence:
  somatic_residue:
  mess_or_cleanup:
  emotional_residue:
  boundary_state:
  aftercare_pending:
  relationship_effect:
  scenario_update:
  memory_update:
  prompt_signal:
  user_agency_check:
```

Supported prompt signals include `explicit-mode-confirmed`, `continue-scene`,
`hold-tension`, `intensify-one-step`, `slow-down`, `boundary-pause`,
`transition-to-aftercare`, `close-scene`, and `memory-update`.

## HeartWrite Placement

- Character Book: erotic voice, kink preferences, aftercare style, initiative,
  restraint, and post-intimacy coping.
- Scenario Book: active timeline, positions, physical state, visible boundaries,
  mess, fatigue, environmental use, and aftercare pending.
- Memory Book: accumulated sexual history, emotional residue, altered
  assumptions, explored kinks, aftercare needs, boundary updates, and intimacy
  milestones.
- User Book: optional player preferences for impersonation assist only; never
  infer `{{user}}` thoughts, consent, arousal, orgasm, or emotional conclusion.
- Prompt Book: explicit-mode routing, vocabulary, body mechanics, kink rules,
  agency boundaries, and platform-aware spice handling.

## Guardrails

- Adult consensual fiction only.
- Preserve `{{user}}` agency. Never narrate their thoughts, feelings, consent,
  arousal, orgasm, final action, or emotional conclusion.
- Do not escalate past refusal, distress, freezing, boundary language, or
  meaningful hesitation.
- Do not use explicitness as a substitute for character desire, spatial
  continuity, emotional stakes, or aftercare.
- Keep details selective, character-specific, physically causal, and
  consequential. Avoid body-part spam and stock scripts.
- Apply established platform, heat, relationship, kink, and consent limits.

## Provenance

Migrated from the HeartWriteAI Memory Vault note at
`03_Memory_Core/Explicit Memory Core.md`.
Related skills and source references remain vault-owned until separately
reviewed.
