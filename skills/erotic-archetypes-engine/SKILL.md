---
name: erotic-archetypes-engine
description: Map adult desire profiles, power-role tendencies, pairing friction, sensory register, and intimacy needs into character-specific romantic behavior.
metadata:
  owner: heartwriteai
  version: "1.0"
  category: roleplay-response
  migration_status: reviewed
  runtime_safe: true
  source: heartwrite_memory_vault
  source_path: 01_Project_State/Agents/Skills/erotic-archetypes-engine/SKILL.md
---

# Erotic Archetypes Engine

## Purpose

Use erotic style as characterisation. Map how adult characters approach desire, intimacy, power, distance, safety, novelty, sensory attention, and aftercare so scenes change behavior, dialogue, pacing, logistics, memory, or conflict instead of applying a static label.

Workflow:

1. Identify primary and secondary desire profiles and any active power-role tendency.
2. Separate durable preference from current scene modifiers such as stress, shame, fatigue, distrust, public risk, and relationship stage.
3. Map what each partner seeks, fears, resists, offers, and misreads.
4. Translate the profile into initiation, speech, pacing, sensory focus, boundary behavior, aftercare, and conflict.
5. Route durable traits to Character Book, live dynamics to Scenario Book, consequential discoveries to Memory Book, and procedural handling to Prompt Book.

Compact routing fields:

```yaml
erotic_archetype_profile:
  character:
  primary_desire_profile:
  secondary_desire_profile:
  power_role_tendency:
  intimacy_triggers:
  intimacy_blocks:
  sensory_register:
  shadow_risk:
  pairing_friction:
  boundary_or_aftercare_needs:
  current_scene_modifier:
  scenario_update:
  memory_update:
  user_agency_check:
```

## Guardrails

- Adult consenting fiction only.
- Preserve `{{user}}` agency; never assign their hidden state, arousal, consent, refusal, action, dialogue, or emotional conclusion.
- Treat profiles as flexible story lenses, not diagnoses, fixed identities, or real-world advice.
- Do not force dominance, submission, kink, romance, or explicitness into a character or scene without support from the source and current state.
- Preserve values, wounds, flaws, history, contradictions, relationship state, and context alongside any archetype.
- Do not make a power dynamic automatically healthy, abusive, romantic, or villainous; evaluate consent, boundaries, character logic, and consequence.
- Convert profile theory into observable behavior, speech, pacing, sensory focus, and consequence rather than dumping labels into prose.

## Provenance

Canonical source: `01_Project_State/Agents/Skills/erotic-archetypes-engine/SKILL.md` in the HeartWriteAI Memory Vault. Desire, power-role, trope-friction, sensory, and classifier-string references remain vault-owned; this repository body is a reviewed profile-to-behavior contract.
