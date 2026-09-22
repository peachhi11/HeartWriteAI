insert into public.category_tags (id, group_name, label, slug, description)
values
  ('tag-situationship', 'trope', 'Situationship', 'situationship', 'Undefined relationship with emotional leverage and unclear claims.'),
  ('tag-friends-to-lovers', 'trope', 'Friends to Lovers', 'friends-to-lovers', null),
  ('tag-enemies-to-lovers', 'trope', 'Enemies to Lovers', 'enemies-to-lovers', null),
  ('tag-possessive', 'relationship_dynamic', 'Possessive', 'possessive', null),
  ('tag-hurt-comfort', 'relationship_dynamic', 'Hurt/Comfort', 'hurt-comfort', null),
  ('tag-fwb', 'relationship_dynamic', 'FWB', 'fwb', null),
  ('tag-pg13', 'heat_intimacy_mode', 'PG13', 'pg13', null),
  ('tag-nc17', 'heat_intimacy_mode', 'NC17', 'nc17', null),
  ('tag-r18', 'heat_intimacy_mode', 'R18+', 'r18-plus', null),
  ('tag-storymode', 'pov', 'StoryMode', 'storymode', null),
  ('tag-janitorai', 'platform_export_target', 'JanitorAI', 'janitorai', null),
  ('tag-blocked', 'content_boundary', 'Blocked', 'blocked', null)
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
    'core-changing-perspectives',
    'Changing Perspectives',
    'changing-perspectives',
    'Trope core',
    'For enemies-to-lovers, friends-to-lovers, and shifting emotional read.',
    'Track what each character believes, what they refuse to say, and what the active POV is allowed to know. Let changed behavior prove the shift before anyone explains it.',
    array['enemies-to-lovers', 'friends-to-lovers'],
    array['JanitorAI', 'SillyTavern', 'MarinaraTavern']
  ),
  (
    'core-messy-relationships',
    'Love Triangles + Messy Relationships',
    'love-triangles-messy-relationships',
    'Relationship core',
    'For situationships, FWB, one-sided longing, and asymmetric secrets.',
    'Treat the relationship as active pressure. Preserve asymmetric knowledge, unresolved longing, and the difference between public behavior and private motive.',
    array['situationship', 'fwb', 'possessive'],
    array['JanitorAI', 'SillyTavern', 'MarinaraTavern']
  ),
  (
    'core-dark-romance',
    'Dark Romance',
    'dark-romance',
    'Intensity core',
    'For morally grey, possessive, obsessive, or degradation-compatible dynamics.',
    'Keep intensity rooted in character motive, negotiated boundaries, consequence, and power exchange. Do not flatten possessiveness into generic aggression.',
    array['possessive'],
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
