-- Seeds drawn from the paraphrased research-library synthesis in:
-- /Users/meganmckinnon/Downloads/The Visceral Codex - NSFW Enhancer/research_library/03_DARK_RELATIONSHIP_DYNAMICS
-- /Users/meganmckinnon/Downloads/The Visceral Codex - NSFW Enhancer/research_library/10_CREATIVE_APPLICATION/dark_romance_dynamics.md
-- /Users/meganmckinnon/Downloads/The Visceral Codex - NSFW Enhancer/research_library/10_CREATIVE_APPLICATION/manipulation_in_characterisation.md
-- /Users/meganmckinnon/Downloads/The Visceral Codex - NSFW Enhancer/research_library/10_CREATIVE_APPLICATION/obsession_and_possessiveness.md

insert into public.category_tags (id, group_name, label, slug, description)
values
  (
    'tag-psych-pursuit-withdrawal',
    'relationship_dynamic',
    'Pursuit and Withdrawal',
    'psych-pursuit-withdrawal',
    'One character seeks contact or proof while another retreats, creating a loop of urgency, fear, and misread intent.'
  ),
  (
    'tag-psych-dependency-cycle',
    'relationship_dynamic',
    'Dependency Cycle',
    'psych-dependency-cycle',
    'Need, reward, instability, and fear of loss reinforce repeated return to a damaging or high-pressure bond.'
  ),
  (
    'tag-psych-toxic-repair-loop',
    'relationship_dynamic',
    'Toxic Repair Loop',
    'psych-toxic-repair-loop',
    'Conflict followed by intense repair becomes rewarding enough to preserve the pattern instead of changing it.'
  ),
  (
    'tag-psych-dark-obsession-cycle',
    'relationship_dynamic',
    'Dark Obsession Cycle',
    'psych-dark-obsession-cycle',
    'Fixation narrows attention until longing, threat, jealousy, and reward become the character''s main organizing pressure.'
  ),
  (
    'tag-psych-power-imbalance',
    'relationship_dynamic',
    'Power Imbalance',
    'psych-power-imbalance',
    'Formal, physical, social, economic, emotional, or informational leverage changes what refusal, risk, and consent cost.'
  ),
  (
    'tag-psych-manipulation-pattern',
    'relationship_dynamic',
    'Manipulation Pattern',
    'psych-manipulation-pattern',
    'Charm, selective truth, pressure, guilt, reward, misdirection, or secrecy shifts another person''s choices without full clarity.'
  ),
  (
    'tag-psych-reality-control',
    'relationship_dynamic',
    'Reality Control',
    'psych-reality-control',
    'Denial, contradiction, minimization, blame reversal, or selective evidence makes another person doubt their read of events.'
  ),
  (
    'tag-psych-protective-overreach',
    'relationship_dynamic',
    'Protective Overreach',
    'psych-protective-overreach',
    'Protection crosses into control when safety becomes a justification for narrowing another person''s agency.'
  ),
  (
    'tag-psych-symbolic-possession',
    'relationship_dynamic',
    'Symbolic Possession',
    'psych-symbolic-possession',
    'Territorial behavior operates as fantasy, reassurance, status claim, threat response, or coercive control depending on context.'
  ),
  (
    'tag-psych-accountability-pressure',
    'relationship_dynamic',
    'Accountability Pressure',
    'psych-accountability-pressure',
    'A character must face the difference between their self-story, their behavior, and the impact on another person.'
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
    'core-dark-relationship-loop-map',
    'Dark Relationship Loop Map',
    'dark-relationship-loop-map',
    'Dark relationship psychology',
    'Maps obsession, dependency, pursuit-withdrawal, idealization, jealousy, and repair loops into playable story pressure.',
    'Treat a dark relationship as a loop with trigger, interpretation, behavior, reward, cost, and aftermath. Track what activates the loop: distance, secrecy, rival attention, shame, loss of control, scarce reward, or intimacy. Track what the loop gives each character: relief, proof, control, attention, punishment, protection, or a fantasy of being chosen. Then track the cost: narrowed agency, resentment, confusion, secrecy, fear, relapse, or an escalated boundary problem. A loop is useful only when it changes choices, raises consequences, or exposes contradiction.',
    array[
      'psych-pursuit-withdrawal',
      'psych-dependency-cycle',
      'psych-toxic-repair-loop',
      'psych-dark-obsession-cycle',
      'psych-idealization-devaluation',
      'psych-intermittent-reinforcement'
    ],
    array['JanitorAI', 'SillyTavern', 'MarinaraTavern']
  ),
  (
    'core-coercion-vs-negotiated-power',
    'Coercion vs Negotiated Power',
    'coercion-vs-negotiated-power',
    'Dark relationship psychology',
    'Separates consensual power exchange, protective competence, fantasy symbolism, and coercive control.',
    'Classify power by agency, information, reversibility, capacity, context, and freedom from undue pressure. Negotiated dominance has mutuality, repair paths, and the ability to refuse. Protective competence respects the protected person''s agency. Coercive control narrows options through fear, guilt, surveillance, isolation, dependency, threats, selective reward, or punishment framed as care. In scene memory and prompt exports, keep the character''s justification separate from the actual impact of the behavior.',
    array[
      'psych-coercive-control',
      'psych-power-imbalance',
      'psych-consent-boundaries',
      'psych-protective-overreach',
      'dominant-submissive',
      'switch-submissive'
    ],
    array['JanitorAI', 'SillyTavern', 'MarinaraTavern']
  ),
  (
    'core-manipulation-and-reality-control',
    'Manipulation and Reality Control',
    'manipulation-and-reality-control',
    'Dark relationship psychology',
    'For psychological pressure, gaslighting, selective disclosure, blame reversal, and strategic charm.',
    'Write manipulation as behavior with a target, method, and effect. The method may be charm, omission, guilt, selective truth, scarcity, praise, denial, contradiction, minimization, misdirection, blame reversal, or selective evidence. The effect may be confusion, dependency, apology, hypervigilance, secrecy, compliance, or a distorted risk calculation. Do not flatten every conflict into gaslighting. Ordinary disagreement, flawed memory, and deliberate reality control should remain distinct.',
    array[
      'psych-manipulation-pattern',
      'psych-reality-control',
      'psych-gaslighting-reality-control',
      'psych-dark-triad-traits',
      'psych-self-justification'
    ],
    array['JanitorAI', 'SillyTavern', 'MarinaraTavern']
  ),
  (
    'core-jealousy-territoriality-cycle',
    'Jealousy and Territoriality Cycle',
    'jealousy-territoriality-cycle',
    'Dark relationship psychology',
    'Turns possessiveness into specific threat interpretation, behavior, fantasy charge, and consequence.',
    'Jealousy should answer what the character thinks is being lost: bond, status, exclusivity, safety, identity, public face, or control. Show the behavior concretely: monitoring, claims, rivalry, withdrawal, accusations, territorial touch, protection, provocation, or a test. Symbolic possession can be charged in genre, but coercive impact must stay visible if another character''s options narrow. Preserve the difference between wanting reassurance, performing dominance, and controlling a person.',
    array[
      'psych-jealousy-possessiveness',
      'psych-symbolic-possession',
      'psych-attachment-activation',
      'psych-power-imbalance',
      'possessive',
      'obsessive'
    ],
    array['JanitorAI', 'SillyTavern', 'MarinaraTavern']
  ),
  (
    'core-idealization-devaluation-cycle',
    'Idealization and Devaluation Cycle',
    'idealization-devaluation-cycle',
    'Dark relationship psychology',
    'For devotion spikes, disappointment collapses, all-good/all-bad thinking, and unstable reconciliation.',
    'Use idealization and devaluation when a character manages ambivalence, shame, unmet need, or fear by simplifying the other person into perfect proof or betrayer. The shift should be triggered by closeness, disappointment, boundaries, jealousy, vulnerability, or unmet expectation. Express it through lavish attention, intensity, idolizing language, contempt, criticism, punishment, or withdrawal. Keep the pattern contextual rather than diagnostic, and make the breaking point the moment the strategy threatens the bond it tries to secure.',
    array[
      'psych-idealization-devaluation',
      'psych-toxic-repair-loop',
      'psych-self-justification',
      'psych-attachment-activation',
      'obsessive'
    ],
    array['JanitorAI', 'SillyTavern', 'MarinaraTavern']
  ),
  (
    'core-accountability-and-impact',
    'Accountability and Impact',
    'accountability-and-impact',
    'Dark relationship psychology',
    'Keeps morally grey intensity consequential by tracking self-story, impact, repair, and changed behavior.',
    'For dark romance pressure, always store three layers: what the character says they are doing, what they privately want, and what the behavior does to the other person. Repair is not the same as forgiveness. Believable repair answers the emotional injury, restores agency, changes the pattern, or makes refusal safer. If the story wants redemption, require visible altered behavior under pressure, not only regret, confession, or tenderness after harm.',
    array[
      'psych-accountability-pressure',
      'psych-conflict-repair',
      'psych-self-justification',
      'psych-consent-boundaries',
      'psych-coercive-control'
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
