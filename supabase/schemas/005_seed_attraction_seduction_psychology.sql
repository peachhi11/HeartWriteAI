-- Seeds drawn from the paraphrased research-library synthesis in:
-- /Users/meganmckinnon/Downloads/The Visceral Codex - NSFW Enhancer/research_library/04_ATTRACTION_AND_SEDUCTION
-- /Users/meganmckinnon/Downloads/The Visceral Codex - NSFW Enhancer/research_library/10_CREATIVE_APPLICATION/attraction_and_desire.md
-- /Users/meganmckinnon/Downloads/The Visceral Codex - NSFW Enhancer/research_library/10_CREATIVE_APPLICATION/flirtation_and_tension.md
-- /Users/meganmckinnon/Downloads/The Visceral Codex - NSFW Enhancer/research_library/10_CREATIVE_APPLICATION/intimacy_and_vulnerability.md

insert into public.category_tags (id, group_name, label, slug, description)
values
  (
    'tag-psych-flirtation-social-signaling',
    'relationship_dynamic',
    'Flirtation and Social Signaling',
    'psych-flirtation-social-signaling',
    'Attraction is communicated through ambiguous signals that invite response without demanding certainty.'
  ),
  (
    'tag-psych-seduction-escalation',
    'relationship_dynamic',
    'Seduction Escalation',
    'psych-seduction-escalation',
    'Interest intensifies through staged attention, reciprocal disclosure, proximity, anticipation, and action.'
  ),
  (
    'tag-psych-sexual-desire-arousal',
    'relationship_dynamic',
    'Sexual Desire and Arousal',
    'psych-sexual-desire-arousal',
    'Desire arises from anticipation, context, emotional state, body response, novelty, fantasy, or relational meaning.'
  ),
  (
    'tag-psych-body-language',
    'relationship_dynamic',
    'Body Language',
    'psych-body-language',
    'Gaze, posture, mirroring, touch, distance, angle, and stillness communicate desire, resistance, status, or uncertainty.'
  ),
  (
    'tag-psych-tension-anticipation',
    'relationship_dynamic',
    'Tension and Anticipation',
    'psych-tension-anticipation',
    'Delay, uncertainty, proximity, risk, and almost-contact create charge before overt action.'
  ),
  (
    'tag-psych-escalation-withdrawal',
    'relationship_dynamic',
    'Escalation and Withdrawal',
    'psych-escalation-withdrawal',
    'Approach, pause, retreat, and return shape desire by altering risk, certainty, and emotional stakes.'
  ),
  (
    'tag-psych-arousal-contradiction',
    'relationship_dynamic',
    'Arousal Contradiction',
    'psych-arousal-contradiction',
    'A body response, fantasy, fixation, or hesitation exposes what a character denies, fears, or wants.'
  ),
  (
    'tag-psych-readable-chemistry',
    'relationship_dynamic',
    'Readable Chemistry',
    'psych-readable-chemistry',
    'Attraction escalates through concrete cues, partner reactions, and changed choices rather than exposition.'
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
    'core-attraction-signal-ladder',
    'Attraction Signal Ladder',
    'attraction-signal-ladder',
    'Attraction psychology',
    'Builds attraction through readable cues, ambiguity, response, and escalating interpretation.',
    'Escalate attraction through signal, interpretation, response, and changed behavior. Signals may be gaze, selective attention, teasing, banter, mirroring, small touch, leaning in, challenge, withdrawal, or deliberate stillness. Keep enough ambiguity for risk and enough specificity for the reader to read the chemistry. Culture, personality, relationship context, and power imbalance alter the meaning of every cue, so make each signal character-specific.',
    array[
      'psych-flirtation-social-signaling',
      'psych-body-language',
      'psych-readable-chemistry',
      'enemies-to-lovers',
      'forced-proximity'
    ],
    array['JanitorAI', 'SillyTavern', 'MarinaraTavern']
  ),
  (
    'core-seduction-cause-and-effect',
    'Seduction Cause and Effect',
    'seduction-cause-and-effect',
    'Attraction psychology',
    'Keeps seduction grounded in reciprocal cues, agency, context, and turning points.',
    'Seduction is not a vibe cloud. Track the ladder: attention, cue, accepted signal, disclosure, proximity, timing, withdrawal, decisive move, and consequence. Each accepted signal can make the next move feel more expected, but escalation is not consent by itself. Preserve agency and context. A good seduction beat changes the room: what can be denied, what becomes visible, what is now riskier, and who has to make the next choice.',
    array[
      'psych-seduction-escalation',
      'psych-tension-anticipation',
      'psych-consent-boundaries',
      'psych-escalation-withdrawal',
      'secret-relationship'
    ],
    array['JanitorAI', 'SillyTavern', 'MarinaraTavern']
  ),
  (
    'core-desire-arousal-map',
    'Desire and Arousal Map',
    'desire-arousal-map',
    'Attraction psychology',
    'Connects desire to anticipation, context, body response, fantasy, trust, taboo, novelty, and character meaning.',
    'Ground desire in individual triggers instead of universal response. Desire may come from safety, novelty, taboo, confidence, stress, threat, trust, fantasy, touch, or relationship tension. Show approach, hesitation, fixation, avoidance, shifting risk threshold, or bodily contradiction. Arousal should reveal character: what they want, what they deny, what scares them, what context makes them bolder, and what kind of attention changes their behavior.',
    array[
      'psych-sexual-desire-arousal',
      'psych-arousal-contradiction',
      'psych-attachment-activation',
      'psych-character-true-dialogue',
      'mutual-longing'
    ],
    array['JanitorAI', 'SillyTavern', 'MarinaraTavern']
  ),
  (
    'core-tension-anticipation-engine',
    'Tension and Anticipation Engine',
    'tension-anticipation-engine',
    'Attraction psychology',
    'For almost-contact, delayed confession, proximity pressure, charged pauses, and unresolved desire.',
    'Tension comes from delay with consequence. Use privacy, proximity, risk, novelty, challenge, unresolved desire, and interrupted action to make the next beat matter. Almost-contact should change interpretation even when nothing explicit happens. A withdrawal beat is strongest when it protects dignity, tests interest, avoids exposure, or raises the cost of continuing. Do not stall; make delay create new information, sharper hunger, or a harder choice.',
    array[
      'psych-tension-anticipation',
      'psych-escalation-withdrawal',
      'psych-readable-chemistry',
      'secret-relationship',
      'one-sided-pining'
    ],
    array['JanitorAI', 'SillyTavern', 'MarinaraTavern']
  ),
  (
    'core-nonverbal-desire-continuity',
    'Nonverbal Desire Continuity',
    'nonverbal-desire-continuity',
    'Attraction psychology',
    'Links body language, spatial staging, and physical continuity so desire stays visible and embodied.',
    'Track where the bodies are, what remains reachable, and what the nonverbal cue changes. Gaze, breath, posture, turning away, bracing, small touch, mirroring, distance, angle, and stillness should connect to motive and space. Do not let chemistry float outside the room. Let furniture, height, clothing, fatigue, privacy, public exposure, and available exits shape how bold or restrained the cue can be.',
    array[
      'psych-body-language',
      'psych-body-continuity',
      'psych-flirtation-social-signaling',
      'psych-sexual-desire-arousal',
      'psych-readable-chemistry'
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
