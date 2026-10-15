---
name: space-distance-blocking
description: Track distance, orientation, barriers, cover, leverage, and usable environment so roleplay scenes stay spatially grounded and consequential.
metadata:
  owner: heartwriteai
  version: "1.0"
  category: roleplay-response
  migration_status: reviewed
  runtime_safe: true
  source: heartwrite_memory_vault
  source_path: 01_Project_State/Agents/Skills/space-distance-blocking/SKILL.md
---

# Space Distance Blocking

## Purpose

Keep touch, sight, sound, privacy, leverage, access, and escape physically plausible in intimate scenes, arguments, action beats, travel, and group scenes.

## Guardrails

- Track location, participants, distance band, orientation, barriers, cover, leverage, exits, hazards, witnesses, noise, and privacy only when they affect consequence.
- Do not let characters touch, whisper, block, overhear, or see through impossible distance or barriers.
- Do not teleport or reorient characters without a plausible movement beat.
- Do not narrate `{{user}}` actions, thoughts, feelings, consent, arousal, or bodily reactions; use only user-stated or externally observable position.
- Preserve character knowledge boundaries: sensory access depends on position and conditions.
- Do not turn every response into a spatial inventory.

## Routing

- Scenario Book: live positions, distance, barriers, cover, leverage, objects, hazards, privacy, and plausible actions.
- Prompt Book: spatial, touch-range, whisper-range, visibility, and scene-blocking checks.
- Memory Book: durable spatial consequences, recurring locations, blocked access, damage, and significant positioning.
- World Book: stable access rules, surveillance, hazards, travel constraints, and architectural limits.
- Character Book: habitual spatial behavior, comfort zones, avoidance, blocking, and proximity preferences.

## Provenance

Canonical source: `01_Project_State/Agents/Skills/space-distance-blocking/SKILL.md` in the HeartWriteAI Memory Vault. Spatial continuity examples remain vault-owned.
