-- Seeds drawn from the paraphrased research-library synthesis in:
-- /Users/meganmckinnon/Downloads/The Visceral Codex - NSFW Enhancer/research_library/02_CHARACTER_PSYCHOLOGY
-- /Users/meganmckinnon/Downloads/The Visceral Codex - NSFW Enhancer/research_library/10_CREATIVE_APPLICATION/character_construction.md

insert into public.category_tags (id, group_name, label, slug, description)
values
  (
    'tag-psych-attachment-activation',
    'relationship_dynamic',
    'Attachment Activation',
    'psych-attachment-activation',
    'A relational threat or longing makes closeness, reassurance, distance, testing, or shutdown feel urgent.'
  ),
  (
    'tag-psych-intermittent-reinforcement',
    'relationship_dynamic',
    'Intermittent Reinforcement',
    'psych-intermittent-reinforcement',
    'Unpredictable reward intensifies attention, hope, persistence, and relapse pressure.'
  ),
  (
    'tag-psych-idealization-devaluation',
    'relationship_dynamic',
    'Idealization and Devaluation',
    'psych-idealization-devaluation',
    'A character swings another person between fantasy object and disappointing betrayer.'
  ),
  (
    'tag-psych-self-justification',
    'relationship_dynamic',
    'Self-Justification',
    'psych-self-justification',
    'A character protects self-image by narrating harmful or contradictory behavior as necessary.'
  ),
  (
    'tag-psych-jealousy-possessiveness',
    'relationship_dynamic',
    'Jealousy and Possessiveness',
    'psych-jealousy-possessiveness',
    'Threatened bond or status becomes vigilance, rivalry, territoriality, withdrawal, accusation, or control.'
  ),
  (
    'tag-psych-dark-triad-traits',
    'relationship_dynamic',
    'Dark-Triad Trait Pressure',
    'psych-dark-triad-traits',
    'Status hunger, strategic manipulation, low empathy, thrill seeking, charm, or emotional detachment as fiction pressure.'
  ),
  (
    'tag-psych-coercive-control',
    'relationship_dynamic',
    'Coercive Control',
    'psych-coercive-control',
    'Leverage, restriction, monitoring, pressure, or dependency creation narrows another person''s autonomy.'
  ),
  (
    'tag-psych-gaslighting-reality-control',
    'relationship_dynamic',
    'Gaslighting and Reality Control',
    'psych-gaslighting-reality-control',
    'Reality control undermines a person''s trust in perception, memory, or interpretation.'
  ),
  (
    'tag-psych-consent-boundaries',
    'relationship_dynamic',
    'Consent and Boundaries',
    'psych-consent-boundaries',
    'Agency, information, capacity, reversibility, context, and freedom from undue pressure define whether intensity stays mutual.'
  ),
  (
    'tag-psych-character-true-dialogue',
    'relationship_dynamic',
    'Character-True Sexual Dialogue',
    'psych-character-true-dialogue',
    'Erotic speech reveals real-time intent, personality, power, vulnerability, sensory feedback, and relationship meaning.'
  ),
  (
    'tag-psych-body-continuity',
    'relationship_dynamic',
    'Body Mechanics and Spatial Continuity',
    'psych-body-continuity',
    'Physical scenes track weight, reach, support, angle, fatigue, transitions, and available leverage.'
  ),
  (
    'tag-psych-persona-compatibility',
    'relationship_dynamic',
    'Persona Compatibility Architecture',
    'psych-persona-compatibility',
    '{{user}} persona design built from self-concept, internal conflict, backstory pressure, friction, and playable agency.'
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
    'core-character-psychology-map',
    'Character Psychology Map',
    'character-psychology-map',
    'Character psychology',
    'Turns research-library mechanisms into usable character memory fields, motives, contradictions, and scene pressure.',
    'Build each character from motive, fear, defense, strategy, contradiction, trigger, behavior, and interpersonal effect. Store what the character believes about themself separately from author-level interpretation: self_beliefs are page-one honest self-understanding; false_beliefs are playable misreads; private_truths are not leaked outside the active POV. Do not diagnose a character from a checklist. Translate mechanisms into wants, fears, boundaries, voice notes, current emotional state, and conflict behavior that can change through scenes.',
    array[
      'psych-attachment-activation',
      'psych-self-justification',
      'psych-idealization-devaluation',
      'psych-dark-triad-traits',
      'psych-jealousy-possessiveness'
    ],
    array['JanitorAI', 'SillyTavern', 'MarinaraTavern']
  ),
  (
    'core-user-persona-psychology',
    'User Persona Psychology',
    'user-persona-psychology',
    'Persona psychology',
    'Guides {{user}} persona seeds through self-concept, internal conflict, relational backstory, and compatibility pressure.',
    'Draft {{user}} as a playable person, not a perfect compatibility plug. The persona should contain what {{user}} could honestly understand about themself: self-concept, role in story, relational backstory, internal conflict, interaction style, boundaries, and what {{user}} knows. Keep author diagnosis out of the persona. Build friction with {{char}} through different coping styles, public versus private loyalty, unmet needs, and the cost of admitting the relationship matters. Preserve user agency: never prewrite {{user}} choices, consent, feelings, dialogue, or body reactions.',
    array[
      'psych-persona-compatibility',
      'psych-attachment-activation',
      'psych-consent-boundaries',
      'psych-character-true-dialogue'
    ],
    array['JanitorAI', 'SillyTavern', 'MarinaraTavern']
  ),
  (
    'core-attachment-pressure-engine',
    'Attachment Pressure Engine',
    'attachment-pressure-engine',
    'Character psychology',
    'For wounded, guarded, avoidant, anxious, or pursuit-withdrawal dynamics where closeness feels unsafe and necessary.',
    'Use attachment activation when distance, delayed response, vulnerability, betrayal cues, conflict, or escalating intimacy makes closeness or escape feel urgent. Express it through clinging, testing, withdrawal, pursuit, jealousy, reassurance seeking, shutdown, or sudden tenderness. Keep the cause-and-effect visible: the character reads availability as safety data. Let repair require consistency, accountability, reciprocal vulnerability, or chosen restraint rather than one speech fixing the wound.',
    array[
      'psych-attachment-activation',
      'psych-idealization-devaluation',
      'hurt-comfort',
      'mutual-longing',
      'one-sided-pining'
    ],
    array['JanitorAI', 'SillyTavern', 'MarinaraTavern']
  ),
  (
    'core-obsession-dependency-loop',
    'Obsession and Dependency Loop',
    'obsession-dependency-loop',
    'Dark romance psychology',
    'For fixation, relapse, scarce affection, jealousy, mutual obsession, and emotionally addictive highs.',
    'Use intermittent reinforcement and jealousy as pressure systems, not as decoration. Unpredictable tenderness should make small signals feel disproportionately meaningful; rival attention, secrecy, comparison, or status loss should create concrete behavior such as monitoring, territoriality, provocative challenges, withdrawal, or accusations. Track the interpersonal cost. A possessive fantasy can be charged, but coercive impact must remain legible when autonomy is narrowed.',
    array[
      'psych-intermittent-reinforcement',
      'psych-jealousy-possessiveness',
      'psych-idealization-devaluation',
      'possessive',
      'obsessive'
    ],
    array['JanitorAI', 'SillyTavern', 'MarinaraTavern']
  ),
  (
    'core-morally-grey-defense-engine',
    'Morally Grey Defense Engine',
    'morally-grey-defense-engine',
    'Dark romance psychology',
    'Keeps antiheroes, villains, and morally grey love interests motivated, contradictory, and accountable.',
    'Give morally grey behavior an internal defense story and an external impact. Self-justification reframes harm as protection, necessity, deserved reward, honesty, or restraint. Dark-triad pressure may show as charm, calculated disclosure, status hunger, rule-breaking, contempt, or instrumental seduction. Gaslighting and coercive control should be named by their effects when present: confusion, dependency, narrowed options, fear, secrecy, resentment, or rupture. Do not let the character''s self-story become the story''s verdict.',
    array[
      'psych-self-justification',
      'psych-dark-triad-traits',
      'psych-coercive-control',
      'psych-gaslighting-reality-control',
      'psych-consent-boundaries',
      'possessive',
      'obsessive'
    ],
    array['JanitorAI', 'SillyTavern', 'MarinaraTavern']
  ),
  (
    'core-intimacy-boundary-continuity',
    'Intimacy, Boundaries, and Body Continuity',
    'intimacy-boundary-continuity',
    'Intimacy craft',
    'Links consent-aware escalation, character-true erotic dialogue, and clear physical scene continuity.',
    'Write intimacy through agency, motive, consent context, and physical continuity. Boundaries decide whether pressure remains mutual or becomes coercive; meaningful hesitation, refusal, withdrawal, distress, pain, or stated limits should stop or redirect escalation. Dialogue should sound like the character under pressure and react to what is happening now. Track support points, reach, angle, pressure, fatigue, clothing, environment, and position changes so desire stays embodied instead of floating above the scene.',
    array[
      'psych-consent-boundaries',
      'psych-character-true-dialogue',
      'psych-body-continuity',
      'dominant-submissive',
      'switch-submissive'
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
