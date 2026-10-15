---
name: character-gmcs
description: Define and audit a character's goal, motivation, conflict, and stakes against the larger story GMCS.
metadata:
  owner: heartwriteai
  version: "1.0"
  category: story-development
  migration_status: reviewed
  runtime_safe: true
  source: heartwrite_memory_vault
  source_path: 01_Project_State/Agents/Skills/character-gmcs/SKILL.md
---

# Character GMCS

## Purpose

Give each character a purposeful relationship to the larger story goal,
motivation, conflict, and stakes. This is author-support and prompt-pack
scaffolding, not a visible worksheet in live prose unless requested.

## Core Contract

Story GMCS supplies the shared frame. Character GMCS turns it into personal
desire, private reason, internal pressure, and personal risk. Strong GMCS makes
plot movement reciprocal: the plot acts on the character, the character
chooses, and the plot changes because of that choice.

## Workflow

1. Capture the story goal, motivation, conflict, and stakes.
2. Define the character's specific sub-goal within that frame.
3. Identify why the character personally cares.
4. Name the internal or personal conflict the situation activates.
5. Clarify what the character gains, loses, protects, risks, or proves.
6. Audit scene actions and dialogue against the character GMCS.
7. Check whether the character reacts to pressure and acts back on the plot.
8. Refine the GMCS when development changes the goal, motive, conflict, or
   stakes.

## Output Shape

```yaml
character_gmcs:
  story_goal:
  story_motivation:
  story_conflict:
  story_stakes:
  character_goal:
  character_motivation:
  character_conflict:
  character_stakes:
  story_alignment:
  scene_application:
  arc_refinement:
```

## HeartWrite Placement

- Character Book: durable goal, motive, internal conflict, stakes, and decision
  pressure.
- Scenario Book: active scene goal, immediate motive, current obstacle, and
  scene-level stakes.
- Memory Book: meaningful GMCS changes, abandoned goals, revealed motives,
  raised stakes, and arc turns.
- Prompt Book: diagnostics, scene-action checks, and character-purpose
  scaffolds.

## Guardrails

- Do not make every character share the protagonist's exact goal.
- Make motivation personal, practical, emotional, social, or relational rather
  than abstract virtue.
- Distinguish external obstacles from internal conflict.
- Do not force actions to obey an old plan after the story clearly changes the
  character's goal, motive, conflict, or stakes.
- Do not overwrite `{{user}}` goals, motivations, hidden motives, or final
  choices unless authoring or impersonation support is explicitly requested.

## Provenance

Migrated from the HeartWriteAI Memory Vault skill at
`01_Project_State/Agents/Skills/character-gmcs/SKILL.md`.
Worksheets and expanded integration references remain vault-owned.
