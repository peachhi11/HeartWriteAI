---
name: narrative-complications-engine
description: Add consequential subplots, secrets, revelations, and MacGuffins when a story needs secondary pressure, hidden truth, contested objects, or harder choices.
metadata:
  owner: heartwriteai
  version: "1.0"
  category: story-development
  migration_status: reviewed
  runtime_safe: true
  source: heartwrite_memory_vault
  source_path: 01_Project_State/Agents/Skills/narrative-complications-engine/SKILL.md
---

# Narrative Complications Engine

## Purpose

Generate or diagnose complications that make the main conflict harder, more
personal, or more morally pressured. A subplot, secret, or MacGuffin should
change choices, reveal character under pressure, alter victory cost, or change
the meaning of the central conflict.

## Modes

- Subplot: adds personal stakes, relationship pressure, external constraint,
  or mystery that affects action, access, risk, timing, trust, or cost.
- Secret or revelation: defines holders, seekers, evidence, reveal mechanics,
  permission, and aftermath without revealing a twist merely because it is due.
- MacGuffin or quest object: creates a contested goal whose pursuit changes
  character behavior and consequences. A living MacGuffin retains agency,
  motives, limits, and knowledge boundaries.

## Workflow

1. Identify the current gap: personal stakes, relationship pressure, hidden
   truth, investigation, contested object, faction collision, moral pressure,
   or pacing.
2. Select one mode and define who is affected, helped, or threatened.
3. Add a setup trail such as a cue, object, contradiction, rumor, obligation,
   debt, symbol, or missing information.
4. Choose timing and define the consequence if ignored.
5. Name the failure mode to avoid.
6. In roleplay, end with a playable handoff rather than deciding `{{user}}`'s
   response.

## Output Shape

```yaml
narrative_complication:
  mode: subplot | secret_revelation | macguffin
  family:
  affected_characters:
  hook:
  pressure_created:
  how_it_complicates_main_goal:
  timing:
  reveal_or_escalation_cues:
  consequence_if_ignored:
  failure_mode_to_avoid:
  storybook_routing:
  user_agency_check:
```

## HeartWrite Placement

- Character Book: secrets, personal stakes, motives, debts, promises, flaws,
  guilt, divided loyalty, and relationship pressure.
- Scenario Book: active subplot, secret pressure, MacGuffin state, investigation
  cue, contested access, or live consequence.
- World Book: institutional secrets, faction claims, social pressure, resource
  scarcity, or location-based objects.
- Memory Book: revealed truths, unresolved arcs, recurring symbols, clue trails,
  promise/debt history, and ownership changes.
- Prompt Book: routing, timing, build checks, and failure modes.

## Guardrails

- Preserve `{{user}}` agency; do not decide their feelings, dialogue, consent,
  pursuit, forgiveness, revelation, or final action.
- Do not force romance when friendship, family, rivalry, duty, guilt,
  dependency, politics, or mystery fits better.
- Do not add a twist, subplot, or object that can disappear without changing
  the main story.
- Do not leak secrets before the story frontier permits them.
- Keep complications tied to character, theme, relationship, world pressure, or
  consequential logistics.

## Provenance

Migrated from the HeartWriteAI Memory Vault skill at
`01_Project_State/Agents/Skills/narrative-complications-engine/SKILL.md`.
Supporting subplot, secret, and MacGuffin references remain vault-owned.
