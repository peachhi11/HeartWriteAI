create extension if not exists pgcrypto;

create table if not exists public.stories (
  id text primary key default gen_random_uuid()::text,
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  genre text,
  subgenre text,
  heat_level text check (heat_level in ('sweet', 'sensual', 'spicy', 'explicit', 'extreme')),
  default_pov_mode text not null default 'narrator_pov'
    check (default_pov_mode in ('char_pov', 'user_pov', 'narrator_pov')),
  supported_pov_modes text[] not null default array['char_pov', 'user_pov', 'narrator_pov'],
  default_tense text,
  active_status text not null default 'active'
    check (active_status in ('active', 'paused', 'archived')),
  author_notes text,
  content_boundaries text[] not null default array[]::text[],
  style_notes text,
  export_targets text[] not null default array[]::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.characters (
  id text primary key default gen_random_uuid()::text,
  owner_id uuid not null references auth.users(id) on delete cascade,
  story_id text not null references public.stories(id) on delete cascade,
  name text not null,
  aliases text[] not null default array[]::text[],
  role text,
  public_facts text[] not null default array[]::text[],
  private_truths text[] not null default array[]::text[],
  self_beliefs text[] not null default array[]::text[],
  false_beliefs text[] not null default array[]::text[],
  wants text[] not null default array[]::text[],
  fears text[] not null default array[]::text[],
  boundaries text[] not null default array[]::text[],
  voice_notes text,
  current_emotional_state text,
  author_only_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.scene_memories (
  id text primary key default gen_random_uuid()::text,
  owner_id uuid not null references auth.users(id) on delete cascade,
  story_id text not null references public.stories(id) on delete cascade,
  title text,
  sequence_index integer,
  scene_date_or_time text,
  location text,
  pov_mode text not null check (pov_mode in ('char_pov', 'user_pov', 'narrator_pov')),
  participants text[] not null default array[]::text[],
  summary text not null,
  key_actions text[] not null default array[]::text[],
  emotional_shift text,
  relationship_shift text,
  intimacy_shift text,
  conflict_shift text,
  new_information text[] not null default array[]::text[],
  unresolved_hooks text[] not null default array[]::text[],
  continuity_flags text[] not null default array[]::text[],
  canon_status text not null default 'draft'
    check (canon_status in ('canon', 'draft', 'contradicted', 'retconned')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.relationship_threads (
  id text primary key default gen_random_uuid()::text,
  owner_id uuid not null references auth.users(id) on delete cascade,
  story_id text not null references public.stories(id) on delete cascade,
  participants text[] not null default array[]::text[],
  dynamic_label text not null,
  current_state text,
  attraction_notes text,
  trust_notes text,
  conflict_notes text,
  intimacy_history text,
  power_dynamic_notes text,
  boundaries text[] not null default array[]::text[],
  linked_secret_ids text[] not null default array[]::text[],
  last_major_change text,
  unresolved_tension text,
  next_pressure_point text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.secrets (
  id text primary key default gen_random_uuid()::text,
  owner_id uuid not null references auth.users(id) on delete cascade,
  story_id text not null references public.stories(id) on delete cascade,
  title text,
  secret_text text not null,
  truth_status text,
  who_knows text[] not null default array[]::text[],
  who_suspects text[] not null default array[]::text[],
  who_is_wrong text[] not null default array[]::text[],
  who_is_hiding_it text[] not null default array[]::text[],
  who_knows_that_someone_knows text[] not null default array[]::text[],
  who_falsely_believes_they_are_safe text[] not null default array[]::text[],
  who_is_pretending_not_to_know text[] not null default array[]::text[],
  reveal_status text not null default 'hidden'
    check (reveal_status in ('hidden', 'suspected', 'partially_revealed', 'revealed', 'misunderstood')),
  reveal_scene_id text references public.scene_memories(id) on delete set null,
  related_scene_ids text[] not null default array[]::text[],
  related_relationship_thread_ids text[] not null default array[]::text[],
  consequences_if_revealed text,
  current_pressure text,
  author_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.category_tags (
  id text primary key default gen_random_uuid()::text,
  group_name text not null,
  label text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.core_prompt_packs (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  slug text not null unique,
  category text not null,
  description text not null,
  base_prompt text not null,
  compatible_tag_slugs text[] not null default array[]::text[],
  default_platform_targets text[] not null default array[]::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saved_prompt_packs (
  id text primary key default gen_random_uuid()::text,
  owner_id uuid not null references auth.users(id) on delete cascade,
  story_id text not null references public.stories(id) on delete cascade,
  source_core_pack_id text references public.core_prompt_packs(id) on delete set null,
  title text not null,
  target_platform text not null,
  tailoring_goal text,
  active_pov_mode text not null check (active_pov_mode in ('char_pov', 'user_pov', 'narrator_pov')),
  spice_visibility_snapshot text not null check (spice_visibility_snapshot in ('censored', 'uncensored')),
  included_sections text[] not null default array[]::text[],
  max_length_preference text not null default 'balanced'
    check (max_length_preference in ('compact', 'balanced', 'detailed')),
  selected_tropes text[] not null default array[]::text[],
  selected_characters text[] not null default array[]::text[],
  selected_relationship_threads text[] not null default array[]::text[],
  selected_scene_memories text[] not null default array[]::text[],
  selected_secrets_policy text not null default 'active_pov_only'
    check (selected_secrets_policy in ('active_pov_only', 'include_author_only', 'exclude_all', 'custom')),
  generated_text text not null,
  saved_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.story_tag_selections (
  story_id text not null references public.stories(id) on delete cascade,
  tag_id text not null references public.category_tags(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (story_id, tag_id)
);

create index if not exists stories_owner_id_idx on public.stories (owner_id);
create index if not exists characters_owner_id_idx on public.characters (owner_id);
create index if not exists characters_story_id_idx on public.characters (story_id);
create index if not exists scene_memories_owner_id_idx on public.scene_memories (owner_id);
create index if not exists scene_memories_story_id_idx on public.scene_memories (story_id);
create index if not exists relationship_threads_owner_id_idx on public.relationship_threads (owner_id);
create index if not exists relationship_threads_story_id_idx on public.relationship_threads (story_id);
create index if not exists secrets_owner_id_idx on public.secrets (owner_id);
create index if not exists secrets_story_id_idx on public.secrets (story_id);
create index if not exists secrets_reveal_scene_id_idx on public.secrets (reveal_scene_id);
create index if not exists saved_prompt_packs_owner_id_idx on public.saved_prompt_packs (owner_id);
create index if not exists saved_prompt_packs_story_id_idx on public.saved_prompt_packs (story_id);
create index if not exists saved_prompt_packs_source_core_pack_id_idx
  on public.saved_prompt_packs (source_core_pack_id);
create index if not exists story_tag_selections_owner_id_idx on public.story_tag_selections (owner_id);
create index if not exists story_tag_selections_tag_id_idx on public.story_tag_selections (tag_id);

alter table public.stories enable row level security;
alter table public.characters enable row level security;
alter table public.scene_memories enable row level security;
alter table public.relationship_threads enable row level security;
alter table public.secrets enable row level security;
alter table public.saved_prompt_packs enable row level security;
alter table public.story_tag_selections enable row level security;
alter table public.category_tags enable row level security;
alter table public.core_prompt_packs enable row level security;

drop policy if exists "owners can read stories" on public.stories;
create policy "owners can read stories" on public.stories
  for select to authenticated
  using ((select auth.uid()) = owner_id);

drop policy if exists "owners can insert stories" on public.stories;
create policy "owners can insert stories" on public.stories
  for insert to authenticated
  with check ((select auth.uid()) = owner_id);

drop policy if exists "owners can update stories" on public.stories;
create policy "owners can update stories" on public.stories
  for update to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

drop policy if exists "owners can delete stories" on public.stories;
create policy "owners can delete stories" on public.stories
  for delete to authenticated
  using ((select auth.uid()) = owner_id);

drop policy if exists "owners manage characters" on public.characters;
create policy "owners manage characters" on public.characters
  for all to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

drop policy if exists "owners manage scene memories" on public.scene_memories;
create policy "owners manage scene memories" on public.scene_memories
  for all to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

drop policy if exists "owners manage relationship threads" on public.relationship_threads;
create policy "owners manage relationship threads" on public.relationship_threads
  for all to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

drop policy if exists "owners manage secrets" on public.secrets;
create policy "owners manage secrets" on public.secrets
  for all to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

drop policy if exists "owners manage saved prompt packs" on public.saved_prompt_packs;
create policy "owners manage saved prompt packs" on public.saved_prompt_packs
  for all to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

drop policy if exists "owners manage story tag selections" on public.story_tag_selections;
create policy "owners manage story tag selections" on public.story_tag_selections
  for all to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

drop policy if exists "authenticated users can read category tags" on public.category_tags;
create policy "authenticated users can read category tags" on public.category_tags
  for select to authenticated
  using (true);

drop policy if exists "authenticated users can read core prompt packs" on public.core_prompt_packs;
create policy "authenticated users can read core prompt packs" on public.core_prompt_packs
  for select to authenticated
  using (true);

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.stories to authenticated;
grant select, insert, update, delete on public.characters to authenticated;
grant select, insert, update, delete on public.scene_memories to authenticated;
grant select, insert, update, delete on public.relationship_threads to authenticated;
grant select, insert, update, delete on public.secrets to authenticated;
grant select, insert, update, delete on public.saved_prompt_packs to authenticated;
grant select, insert, update, delete on public.story_tag_selections to authenticated;
grant select on public.category_tags to authenticated;
grant select on public.core_prompt_packs to authenticated;
