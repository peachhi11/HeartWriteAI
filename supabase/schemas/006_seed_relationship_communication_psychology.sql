-- Seeds drawn from the paraphrased research-library synthesis in:
-- /Users/meganmckinnon/Downloads/The Visceral Codex - NSFW Enhancer/research_library/05_RELATIONSHIP_PSYCHOLOGY
-- /Users/meganmckinnon/Downloads/The Visceral Codex - NSFW Enhancer/research_library/06_COMMUNICATION
-- /Users/meganmckinnon/Downloads/The Visceral Codex - NSFW Enhancer/research_library/10_CREATIVE_APPLICATION/intimacy_and_vulnerability.md

insert into public.category_tags (id, group_name, label, slug, description)
values
  (
    'tag-psych-conflict-repair',
    'relationship_dynamic',
    'Conflict and Repair',
    'psych-conflict-repair',
    'Relationships become durable or unstable through how characters rupture connection and attempt repair.'
  ),
  (
    'tag-psych-trust-calibration',
    'relationship_dynamic',
    'Trust Calibration',
    'psych-trust-calibration',
    'Trust shifts through kept promises, accurate information, boundaries, repair, consistency, and changed behavior.'
  ),
  (
    'tag-psych-vulnerability-disclosure',
    'relationship_dynamic',
    'Vulnerability and Disclosure',
    'psych-vulnerability-disclosure',
    'What a character reveals, hides, tests, or confesses changes intimacy, power, and risk.'
  ),
  (
    'tag-psych-bonding-beats',
    'relationship_dynamic',
    'Bonding Beats',
    'psych-bonding-beats',
    'Shared risk, care, humor, attention, body response, and remembered detail make attachment feel earned.'
  ),
  (
    'tag-psych-reconciliation-arc',
    'relationship_dynamic',
    'Reconciliation Arc',
    'psych-reconciliation-arc',
    'A rupture can deepen intimacy only when repair answers the injury and changes future behavior.'
  ),
  (
    'tag-psych-verbal-signaling',
    'relationship_dynamic',
    'Verbal Signaling',
    'psych-verbal-signaling',
    'Dialogue communicates desire, status, refusal, repair, shame, control, affection, and hidden need.'
  ),
  (
    'tag-psych-nonverbal-signaling',
    'relationship_dynamic',
    'Nonverbal Signaling',
    'psych-nonverbal-signaling',
    'Gesture, posture, distance, gaze, touch, and stillness reveal pressure before a character explains it.'
  ),
  (
    'tag-psych-persuasion-influence',
    'relationship_dynamic',
    'Persuasion and Influence',
    'psych-persuasion-influence',
    'Influence changes choices through framing, proof, status, trust, timing, desire, pressure, or emotional leverage.'
  ),
  (
    'tag-psych-boundary-negotiation',
    'relationship_dynamic',
    'Boundary Negotiation',
    'psych-boundary-negotiation',
    'Boundaries become story material through refusal, hesitation, agreements, renegotiation, repair, and consequences.'
  ),
  (
    'tag-psych-intimacy-vulnerability',
    'relationship_dynamic',
    'Intimacy and Vulnerability',
    'psych-intimacy-vulnerability',
    'Emotional closeness intensifies when desire, fear, truth, body response, and choice collide.'
  )
on conflict (slug) do update set
  group_name = excluded.group_name,
  label = excluded.label,
  description = excluded.description,
  updated_at = now();

insert into public.core_prompt_packs (
  id,
  title,
  slug,
  category,
  description,
  base_prompt,
  compatible_tag_slugs,
  default_platform_targets
)
values
  (
    'core-conflict-repair-architecture',
    'Conflict and Repair Architecture',
    'conflict-repair-architecture',
    'Relationship psychology',
    'Designs rupture, black moment, apology, proof, and changed behavior without collapsing conflict too fast.',
    'A conflict beat should identify the injury, the surface argument, the deeper need, and the failed strategy. Repair works when it answers the emotional injury, restores agency, or changes the pattern that caused the rupture. Repair is not the same as forgiveness. Track apology, withdrawal, pursuit, bargaining, confession, touch, proof of change, repeated failure, and consequences. Let reconciliation be earned by behavior under pressure, not by one beautiful line.',
    array[
      'psych-conflict-repair',
      'psych-reconciliation-arc',
      'psych-accountability-pressure',
      'betrayal-reconciliation',
      'exes'
    ],
    array['JanitorAI', 'SillyTavern', 'MarinaraTavern']
  ),
  (
    'core-trust-vulnerability-map',
    'Trust and Vulnerability Map',
    'trust-vulnerability-map',
    'Relationship psychology',
    'Tracks how trust, secrecy, disclosure, consistency, and vulnerability change intimacy over time.',
    'Trust is not a static feeling. Track what information is accurate, what promise was kept, what boundary was honored, what secret remains active, and what repair changed. Vulnerability should cost something: pride, leverage, control, safety, plausible deniability, or an old self-protective story. A disclosure beat should change what the other character can know, choose, forgive, fear, or use.',
    array[
      'psych-trust-calibration',
      'psych-vulnerability-disclosure',
      'psych-intimacy-vulnerability',
      'psych-attachment-activation',
      'hurt-comfort'
    ],
    array['JanitorAI', 'SillyTavern', 'MarinaraTavern']
  ),
  (
    'core-communication-signal-map',
    'Communication Signal Map',
    'communication-signal-map',
    'Communication psychology',
    'Links verbal and nonverbal cues to desire, conflict, refusal, repair, power, and subtext.',
    'For each exchange, identify what is said, what is avoided, what the body reveals, what the speaker wants, and what the listener thinks it means. Verbal signals include confession, command, praise, refusal, bargaining, teasing, apology, accusation, and correction. Nonverbal signals include gaze, distance, posture, touch, stillness, breath, interruption, and retreat. Do not let dialogue explain what behavior can prove.',
    array[
      'psych-verbal-signaling',
      'psych-nonverbal-signaling',
      'psych-character-true-dialogue',
      'psych-flirtation-social-signaling',
      'psych-conflict-repair'
    ],
    array['JanitorAI', 'SillyTavern', 'MarinaraTavern']
  ),
  (
    'core-boundary-negotiation-engine',
    'Boundary Negotiation Engine',
    'boundary-negotiation-engine',
    'Communication psychology',
    'Turns consent, refusal, hesitation, renegotiation, and aftercare into active story mechanics.',
    'Boundaries should affect plot, intimacy, trust, and power. Track what is known, what is agreed, what changes, what hesitation means in context, and what happens when a limit is reached. If a character refuses, withdraws, shows distress, or sets a boundary, the scene must stop, redirect, repair, or renegotiate. For dark material, do not confuse fantasy shorthand with mutuality; classify pressure by its impact on agency.',
    array[
      'psych-boundary-negotiation',
      'psych-consent-boundaries',
      'psych-power-imbalance',
      'psych-conflict-repair',
      'psych-intimacy-vulnerability'
    ],
    array['JanitorAI', 'SillyTavern', 'MarinaraTavern']
  ),
  (
    'core-persuasion-influence-ethics',
    'Persuasion and Influence Ethics',
    'persuasion-influence-ethics',
    'Communication psychology',
    'Separates flirtation, persuasion, pressure, manipulation, and coercion by method and impact.',
    'Influence should be legible by method and effect. Persuasion can use evidence, appeal, timing, trust, desire, or framing while preserving agency. Manipulation hides relevant context or distorts choice. Coercion narrows options through fear, dependency, threat, punishment, or undue pressure. Flirtation invites response; pressure corners response. Track what the influenced character knows, can refuse, risks by refusing, and believes afterward.',
    array[
      'psych-persuasion-influence',
      'psych-manipulation-pattern',
      'psych-consent-boundaries',
      'psych-flirtation-social-signaling',
      'psych-reality-control'
    ],
    array['JanitorAI', 'SillyTavern', 'MarinaraTavern']
  ),
  (
    'core-bonding-and-intimacy-beats',
    'Bonding and Intimacy Beats',
    'bonding-and-intimacy-beats',
    'Relationship psychology',
    'Makes closeness accumulate through care, attention, desire, shared stress, private truth, and remembered detail.',
    'Bonding should accumulate through specific beats: shared risk, practical care, humor, remembered detail, accurate attention, body response, mutual protection, private disclosure, or chosen restraint. Intimacy becomes stronger when it changes what the characters risk, what they can ask for, and what they cannot pretend anymore. Keep attachment, trust, desire, vulnerability, and conflict braided rather than isolated.',
    array[
      'psych-bonding-beats',
      'psych-intimacy-vulnerability',
      'psych-sexual-desire-arousal',
      'psych-trust-calibration',
      'mutual-longing'
    ],
    array['JanitorAI', 'SillyTavern', 'MarinaraTavern']
  )
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  description = excluded.description,
  base_prompt = excluded.base_prompt,
  compatible_tag_slugs = excluded.compatible_tag_slugs,
  default_platform_targets = excluded.default_platform_targets,
  updated_at = now();
