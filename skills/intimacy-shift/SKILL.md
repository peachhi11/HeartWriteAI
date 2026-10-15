---
name: intimacy-shift
description: Track how established physical or avoided intimacy changes emotional comfort, sexual comfort, boundaries, assumptions, and relationship state.
metadata:
  owner: heartwriteai
  version: "1.0"
  category: roleplay-response
  migration_status: reviewed
  runtime_safe: true
  source: heartwrite_memory_vault
  source_path: 01_Project_State/Agents/Skills/intimacy-shift/SKILL.md
---

# Intimacy Shift

## Purpose

Track the aftermath of physical or near-intimacy so characters do not return to an identical prior state. Separate emotional comfort from sexual comfort and identify changed assumptions, boundaries, access, trust, jealousy, avoidance, tenderness, shame, or routine.

## Guardrails

- Process only intimacy established on-page or directly implied by user/player input.
- Track emotional comfort and sexual comfort separately; awkwardness is not automatically regret and intimacy is not automatically love, repair, or commitment.
- Record boundary state as confirmed, softened, tested, unclear, crossed, repaired, or withheld when supported by the scene.
- Do not use intimacy to override stated boundaries, withdrawal, distress, meaningful hesitation, or refusal.
- Preserve `{{user}}` agency. Do not dictate their thoughts, feelings, arousal, bodily reactions, orgasm, consent, refusal, dialogue, choices, or conclusions.
- Keep `{{char}}` and NPC responses bounded by characterization, relationship state, and established consent context.

## Routing

- Character Book: intimacy tendencies, comfort profile, aftercare style, avoidance, possessiveness, shame, and boundary behavior.
- Scenario Book: current intimacy event, emotional delta, boundary state, proximity, and immediate consequence.
- Memory Book: milestones, altered assumptions, boundary changes, aftercare patterns, jealousy triggers, and callbacks.
- Prompt Book: separate emotional and sexual comfort while preserving consequence.

## Provenance

Canonical source: `01_Project_State/Agents/Skills/intimacy-shift/SKILL.md` in the HeartWriteAI Memory Vault. Intimacy progression references remain vault-owned.
