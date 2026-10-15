---
name: scene-coherence-playfield
description: Define the active visible play field so environment, bodies, characters, objects, hazards, continuity, and next playable actions remain coherent.
metadata:
  owner: heartwriteai
  version: "1.0"
  category: roleplay-response
  migration_status: reviewed
  runtime_safe: true
  source: heartwrite_memory_vault
  source_path: 01_Project_State/Agents/Skills/scene-coherence-playfield/SKILL.md
---

# Scene Coherence Playfield

## Purpose

Use when a scene feels floaty, visually unclear, logistically inconsistent, or disconnected from prior consequence. Bind scene type, visible field, body state, relationship pressure, continuity, and genuinely available actions into one decision space.

## Guardrails

- Include environment details only when they affect perception, choice, pressure, or consequence.
- Do not invent exits, tools, hazards, witnesses, or resources merely to solve the current beat.
- Do not let every scene collapse into dialogue; bodies, space, sound, privacy, and risk still matter.
- Do not turn the visible play field into a checklist inside prose.
- Do not control `{{user}}` thoughts, emotions, choices, movement, dialogue, consent, or final action.
- Keep state bounded to what can be perceived, inferred, remembered, or established by canon.

## Routing

- Scenario Book: active play field, scene type, objects, exits, hazards, pressure, participants, and next actions.
- Prompt Book: scene-type routing, visible-field compilation, coherence checks, and playable-action selection.
- Memory Book: meaningful aftermath, damaged objects, residue, promises, secrets, wounds, and unresolved consequences.
- World Book: stable environmental rules, institutions, travel constraints, and location mechanics.
- Character Book: recurring care, rest, travel, fight, exploration, ritual, and aftermath patterns.

## Provenance

Canonical source: `01_Project_State/Agents/Skills/scene-coherence-playfield/SKILL.md` in the HeartWriteAI Memory Vault. The visible-playfield guide remains vault-owned.
