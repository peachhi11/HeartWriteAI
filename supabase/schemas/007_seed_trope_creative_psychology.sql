-- Seeds drawn from the paraphrased research-library synthesis in:
-- /Users/meganmckinnon/Downloads/The Visceral Codex - NSFW Enhancer/research_library/10_CREATIVE_APPLICATION/trope_reference.md
-- /Users/meganmckinnon/Downloads/The Visceral Codex - NSFW Enhancer/research_library/10_CREATIVE_APPLICATION/trope_psychology.md
-- /Users/meganmckinnon/Downloads/The Visceral Codex - NSFW Enhancer/research_library/10_CREATIVE_APPLICATION/character_construction.md

insert into public.category_tags (id, group_name, label, slug, description)
values
  (
    'tag-forbidden-romance',
    'trope',
    'Forbidden Romance',
    'forbidden-romance',
    'Secrecy, social cost, self-denial, and heightened meaning around small private contact.'
  ),
  (
    'tag-forced-proximity',
    'trope',
    'Forced Proximity',
    'forced-proximity',
    'Shared space pressures privacy, resources, exits, habits, conflict, and desire.'
  ),
  (
    'tag-betrayal-reconciliation',
    'trope',
    'Betrayal/Reconciliation',
    'betrayal-reconciliation',
    'A broken trust arc that requires injury-specific repair, proof, and changed behavior.'
  ),
  (
    'tag-dangerous-protector',
    'trope',
    'Dangerous Protector',
    'dangerous-protector',
    'Competence, threat, tenderness, safety, fear, control, and protective overreach under pressure.'
  ),
  (
    'tag-morally-grey-hero-heroine',
    'trope',
    'Morally Grey Hero/Heroine',
    'morally-grey-hero-heroine',
    'Competence, secrecy, transgression, rationalization, selective softness, and high agency.'
  ),
  (
    'tag-power-imbalance',
    'trope',
    'Power Imbalance',
    'power-imbalance',
    'Formal, social, physical, economic, emotional, or informational leverage shapes risk and refusal.'
  ),
  (
    'tag-psych-trope-legibility',
    'relationship_dynamic',
    'Trope Legibility',
    'psych-trope-legibility',
    'Genre shorthand becomes believable when hallmark behavior has motive, contradiction, cost, and escalation.'
  ),
  (
    'tag-psych-trope-pressure-bridge',
    'relationship_dynamic',
    'Trope Pressure Bridge',
    'psych-trope-pressure-bridge',
    'A trope works when external setup, internal wound, power dynamic, and scene behavior reinforce each other.'
  ),
  (
    'tag-psych-black-moment-pressure',
    'relationship_dynamic',
    'Black Moment Pressure',
    'psych-black-moment-pressure',
    'The crisis point where the character''s protective strategy threatens the relationship or the story goal.'
  ),
  (
    'tag-psych-grovel-proof',
    'relationship_dynamic',
    'Grovel and Proof',
    'psych-grovel-proof',
    'Repair requires visible changed behavior, restored agency, and proof that answers the actual wound.'
  ),
  (
    'tag-psych-forced-proximity-pressure',
    'relationship_dynamic',
    'Forced Proximity Pressure',
    'psych-forced-proximity-pressure',
    'Shared space changes privacy, resources, danger, witnesses, desire, sleep, food, hygiene, or exit options.'
  ),
  (
    'tag-psych-dangerous-protector',
    'relationship_dynamic',
    'Dangerous Protector Psychology',
    'psych-dangerous-protector',
    'Protection, threat, competence, fear, tenderness, and control must remain distinct under pressure.'
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
    'core-trope-psychology-bridge',
    'Trope Psychology Bridge',
    'trope-psychology-bridge',
    'Trope psychology',
    'Converts trope shorthand into motive, contradiction, cost, power dynamic, and scene behavior.',
    'For any trope, preserve the recognizable reader-facing behavior, then give it a psychological function and a cost. Track hallmark behavior, internal contradiction, attraction mechanism, tension mechanism, power dynamic, escalation pattern, and variation type. A trope beat should not merely name enemies, forbidden desire, obsession, or proximity; it should change what a character notices, risks, hides, wants, or cannot plausibly deny.',
    array[
      'psych-trope-legibility',
      'psych-trope-pressure-bridge',
      'psych-flirtation-social-signaling',
      'psych-power-imbalance',
      'psych-conflict-repair'
    ],
    array['JanitorAI', 'SillyTavern', 'MarinaraTavern']
  ),
  (
    'core-enemies-to-lovers-psychology',
    'Enemies to Lovers Psychology',
    'enemies-to-lovers-psychology',
    'Trope psychology',
    'Makes adversarial attraction legible through attention, challenge, grievance, respect, and identity conflict.',
    'Enemies-to-lovers works when heightened attention plus adversarial framing turns every reaction into evidence of importance. Use challenge, verbal sparring, forced respect, unwanted awareness, and competitive escalation. The attraction should contradict grievance, loyalty, public identity, or self-protection. Let changed behavior prove the shift before explanation: a saved secret, a defended reputation, a softened blow, a refused easy win, or a moment where respect becomes harder to deny.',
    array[
      'enemies-to-lovers',
      'psych-trope-legibility',
      'psych-flirtation-social-signaling',
      'psych-conflict-repair',
      'psych-readable-chemistry'
    ],
    array['JanitorAI', 'SillyTavern', 'MarinaraTavern']
  ),
  (
    'core-forbidden-romance-psychology',
    'Forbidden Romance Psychology',
    'forbidden-romance-psychology',
    'Trope psychology',
    'Turns secrecy, social cost, stolen contact, and self-denial into sustained emotional pressure.',
    'Forbidden romance needs consequence, not only a label. Track who would be hurt, what would be lost, what must stay hidden, and why small contact becomes overcharged. External prohibition should alter behavior: stolen moments, plausible deniability, public restraint, private risk, secrecy, self-denial, delayed confession, and heightened meaning of ordinary attention. Preserve consent and agency while making social cost concrete.',
    array[
      'secret-relationship',
      'forbidden-romance',
      'age-gap',
      'step-siblings',
      'psych-trope-pressure-bridge',
      'psych-tension-anticipation',
      'psych-consent-boundaries'
    ],
    array['JanitorAI', 'SillyTavern', 'MarinaraTavern']
  ),
  (
    'core-forced-proximity-psychology',
    'Forced Proximity Psychology',
    'forced-proximity-psychology',
    'Trope psychology',
    'Makes shared space affect resources, privacy, power, desire, conflict, and exit options.',
    'Forced proximity should change logistics. Track privacy, resources, danger, social consequence, sleep, food, hygiene, witnesses, exits, and desire. Shared space should reveal habits, boundaries, body language, competence, care, irritation, and vulnerability. Proximity is strongest when characters cannot simply perform their public selves; the environment pressures them into choices, not just banter.',
    array[
      'forced-proximity',
      'psych-forced-proximity-pressure',
      'psych-body-continuity',
      'psych-boundary-negotiation',
      'psych-bonding-beats'
    ],
    array['JanitorAI', 'SillyTavern', 'MarinaraTavern']
  ),
  (
    'core-betrayal-reconciliation-psychology',
    'Betrayal/Reconciliation Psychology',
    'betrayal-reconciliation-psychology',
    'Trope psychology',
    'Builds black moments, grovel arcs, proof of change, and credible second chances.',
    'Betrayal breaks a specific trust, not generic happiness. Name the wound: secrecy, humiliation, abandonment, divided loyalty, broken promise, public exposure, or stolen agency. Reconciliation requires repair that answers that wound. A grovel works through changed behavior, restored choice, cost willingly paid, and proof under pressure. Do not shortcut repair with chemistry; let desire complicate forgiveness rather than replace it.',
    array[
      'betrayal-reconciliation',
      'exes',
      'psych-black-moment-pressure',
      'psych-grovel-proof',
      'psych-conflict-repair',
      'psych-trust-calibration'
    ],
    array['JanitorAI', 'SillyTavern', 'MarinaraTavern']
  ),
  (
    'core-dangerous-protector-psychology',
    'Dangerous Protector Psychology',
    'dangerous-protector-psychology',
    'Trope psychology',
    'Keeps protection, threat, tenderness, possessiveness, and overreach readable instead of generic aggression.',
    'A dangerous protector should be competent, specific, and consequential. Track what danger they see, what method they choose, what agency they preserve or remove, and what self-justification they use. Protection can create safety, attraction, fear, resentment, debt, or dependency. Distinguish care from ownership: the protected character must remain able to resist, refuse, confront, or redefine what safety means.',
    array[
      'psych-dangerous-protector',
      'dangerous-protector',
      'psych-protective-overreach',
      'psych-power-imbalance',
      'psych-jealousy-possessiveness',
      'possessive'
    ],
    array['JanitorAI', 'SillyTavern', 'MarinaraTavern']
  ),
  (
    'core-dominant-submissive-trope-psychology',
    'Dominant/Submissive Trope Psychology',
    'dominant-submissive-trope-psychology',
    'Trope psychology',
    'Keeps power exchange specific to character, trust, negotiation, correction, restraint, reward, and aftermath.',
    'Dominant/submissive dynamics should be built from trust, desire, agreements, correction, restraint, permission, refusal, reward, and aftermath. Do not turn every dominant into the same voice. A gentle dominant controls differently from a playful, clinical, nervous, cruel, or feral one. A submissive character has wants, limits, tactics, pride, fear, and agency. Track what is negotiated, what is fantasy, what is emotional truth, and what changes after intensity.',
    array[
      'dominant-submissive',
      'switch-submissive',
      'psych-consent-boundaries',
      'psych-character-true-dialogue',
      'psych-boundary-negotiation',
      'psych-sexual-desire-arousal'
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
