export type MusicPresetCategory =
  | "Archetype"
  | "Music Seed"
  | "Genre"
  | "Mood"
  | "Behaviour"
  | "Romance Hook"
  | "Gate"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface MusicPreset {
  id: string;
  category: MusicPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledMusicPresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface MusicSeedGroup {
  category: MusicPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const MUSIC_GUIDANCE =
  "Use this as music taste and music-memory texture. Music may reveal mood, nostalgia, private softness, identity, ritual, affection, or shared intimacy without replacing personality, consent, or {{user}} agency.";

export const musicPresets = [
  "Classical Romantic",
  "Jazz Lover",
  "Indie Softheart",
  "Rock Soul",
  "Punk Rebel",
  "Metal Heart",
  "Pop Enthusiast",
  "R&B Romantic",
  "Soulful Listener",
  "Folk Storyteller",
  "Country Heart",
  "Electronic Night Owl",
  "Lo-Fi Comfort",
  "Opera Dramatic",
  "Musical Theatre Kid",
  "Film Score Dreamer",
  "Vinyl Collector",
  "Playlist Maker",
  "Secret Singer",
  "Music as Memory",
];

export const musicSeeds = [
  "music_taste",
  "music_lover",
  "playlist_maker",
  "vinyl_collector",
  "private_singer",
  "hums_when_focused",
  "dances_in_private",
  "concert_goer",
  "headphones_always_on",
  "music_as_memory",
  "music_as_escape",
  "music_as_love_language",
  "shared_headphones",
  "song_recommendations",
  "mixtape_romance",
  "late_night_playlist",
  "comfort_song",
  "breakup_song",
  "love_song",
  "theme_song",
];

export const musicGenreSeeds = [
  "classical_music",
  "baroque_music",
  "romantic_era_music",
  "opera",
  "jazz",
  "blues",
  "soul",
  "r_and_b",
  "funk",
  "disco",
  "rock",
  "punk",
  "metal",
  "indie_music",
  "alternative_music",
  "folk_music",
  "country_music",
  "pop_music",
  "dance_music",
  "electronic_music",
  "house_music",
  "techno",
  "ambient_music",
  "lofi_music",
  "hip_hop",
  "rap",
  "reggae",
  "latin_music",
  "k_pop",
  "j_pop",
  "city_pop",
  "musical_theatre",
  "film_scores",
  "video_game_soundtracks",
  "world_music",
  "experimental_music",
];

export const musicMoodSeeds = [
  "sad_ballads",
  "old_love_songs",
  "soft_acoustic",
  "angry_music",
  "comfort_playlist",
  "rainy_day_music",
  "late_night_music",
  "study_music",
  "workout_music",
  "road_trip_music",
  "sleep_playlist",
  "dance_playlist",
  "dramatic_playlist",
  "yearning_playlist",
  "heartbreak_playlist",
  "healing_playlist",
  "nostalgic_music",
  "hopeful_music",
  "dark_romantic_music",
  "warm_domestic_music",
];

export const musicBehaviorSeeds = [
  "makes_playlists_for_people",
  "sends_songs_instead_of_words",
  "quotes_lyrics",
  "remembers_users_favorite_song",
  "keeps_concert_tickets",
  "collects_records",
  "plays_music_while_cooking",
  "sings_when_alone",
  "sings_to_comfort_user",
  "dances_in_kitchen",
  "listens_to_one_song_on_repeat",
  "uses_music_to_process_feelings",
  "shares_earbuds",
  "learns_users_music_taste",
  "writes_songs_secretly",
  "plays_instrument_for_user",
  "makes_breakup_playlists",
  "makes_falling_in_love_playlists",
  "turns_down_music_to_hear_user",
  "associates_user_with_a_song",
];

export const musicRomanceHooks = [
  "playlist_as_confession",
  "shared_headphones_intimacy",
  "dancing_in_kitchen",
  "concert_confession",
  "slow_dance_scene",
  "song_recommendation_flirting",
  "love_song_dedication",
  "private_singing_scene",
  "user_finds_playlist_about_them",
  "vinyl_store_date",
  "late_night_drive_music",
  "piano_room_confession",
  "karaoke_flirting",
  "rainy_day_music_cuddle",
  "first_dance_memory",
  "song_triggers_old_feelings",
  "writes_song_for_user",
  "hums_user_to_sleep",
  "music_becomes_love_language",
  "our_song_route",
];

export const musicGates = [
  "first_music_preference_gate",
  "first_song_recommendation_gate",
  "first_shared_headphones_gate",
  "first_playlist_gate",
  "first_dance_gate",
  "first_concert_gate",
  "first_private_singing_gate",
  "first_song_about_user_gate",
  "first_music_memory_gate",
  "first_love_song_gate",
  "playlist_as_confession_gate",
  "music_as_intimacy_gate",
  "our_song_gate",
  "soundtrack_to_love_route",
];

export const musicDialogueSeeds = [
  "You made me a playlist?",
  "Do not make it sound so romantic.",
  "It is romantic.",
  "This song reminds me of you.",
  "Should I be worried?",
  "Only if you hate being understood.",
  "You sing when you think no one is listening.",
  "You were not supposed to hear that.",
  "I am glad I did.",
  "Why this song?",
  "Because I did not know how to say it myself.",
  "You remembered my favorite band.",
  "I remember things that matter to you.",
  "Dance with me.",
  "There is no music.",
  "Then hum something.",
];

export const highValueMusicSeeds = [
  "music_taste",
  "playlist_maker",
  "vinyl_collector",
  "private_singer",
  "music_as_memory",
  "music_as_love_language",
  "classical_music",
  "jazz",
  "indie_music",
  "rock",
  "r_and_b",
  "lofi_music",
  "film_scores",
  "sad_ballads",
  "old_love_songs",
  "makes_playlists_for_people",
  "shared_headphones",
  "playlist_as_confession",
  "dancing_in_kitchen",
  "our_song_route",
];

const MUSIC_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "music_preset",
    guidance: MUSIC_GUIDANCE,
    values: musicPresets,
  },
  {
    category: "Music Seed",
    prefix: "music_seed",
    guidance:
      "Use this as a compact music identity seed. It can suggest private habits, memory cues, playlists, records, headphones, or music-as-affection without making music the whole character.",
    values: musicSeeds,
  },
  {
    category: "Genre",
    prefix: "music_genre",
    guidance:
      "Use this as genre taste texture. Genre preference may reveal status, rebellion, nostalgia, softness, culture, study habits, nightlife, or emotional processing.",
    values: musicGenreSeeds,
  },
  {
    category: "Mood",
    prefix: "music_mood",
    guidance:
      "Use this as mood-based music texture. Playlists and songs may tune scene atmosphere, comfort, heartbreak, longing, healing, focus, or domestic warmth.",
    values: musicMoodSeeds,
  },
  {
    category: "Behaviour",
    prefix: "music_behaviour",
    guidance:
      "Use this as observable music behaviour. Let songs, playlists, tickets, records, humming, dancing, and instruments show attention or avoidance through action.",
    values: musicBehaviorSeeds,
  },
  {
    category: "Romance Hook",
    prefix: "music_romance",
    guidance:
      "Use this as romance-facing music texture. Music can carry confession, flirtation, memory, date structure, or love-language beats while preserving consent, privacy, and pacing.",
    values: musicRomanceHooks,
  },
  {
    category: "Gate",
    prefix: "music_gate",
    guidance:
      "Use this as an optional music event gate. Music gates should unlock through remembered preferences, shared listening, private performance, or earned confession.",
    values: musicGates,
  },
  {
    category: "Dialogue Seed",
    prefix: "music_dialogue",
    guidance:
      "Use this as optional dialogue flavour. Music dialogue seeds should be adapted to scene context and character voice rather than pasted as fixed lines.",
    values: musicDialogueSeeds,
  },
  {
    category: "High-Value Seed",
    prefix: "music_high_value",
    guidance:
      "Use this as a high-signal music seed for character creation, matching, and preset search.",
    values: highValueMusicSeeds,
  },
] satisfies readonly MusicSeedGroup[]);

const slugifyMusicPreset = (value: string) =>
  value
    .toLowerCase()
    .replace(/\{\{user\}\}'s/g, "user_s")
    .replace(/\{\{user\}\}/g, "user")
    .replace(/&/g, " and ")
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

function normalizeReadableMusicValue(value: string): string {
  if (!value.includes("_")) return value.replace("favorite", "favourite");

  return value
    .replace(/users_/g, "{{user}}_s_")
    .replace(/_for_user\b/g, "_for_{{user}}")
    .replace(/_user_/g, "_{{user}}_")
    .replace(/\buser_/g, "{{user}}_")
    .replace(/_user\b/g, "_{{user}}")
    .replace(/favorite/g, "favourite")
    .replace(/r_and_b/g, "R and B")
    .replace(/k_pop/g, "K-pop")
    .replace(/j_pop/g, "J-pop")
    .replace(/_/g, " ")
    .replace(/\{\{user\}\} s/g, "{{user}}'s")
    .replace(/\s+/g, " ")
    .trim();
}

function toMusicLabel(value: string): string {
  if (/^[A-Z]/.test(value) && !value.includes("_")) return value;

  const readable = normalizeReadableMusicValue(value);
  return readable
    .split(" ")
    .map((word) => {
      if (word === "{{user}}'s" || word === "{{user}}") return word;
      if (word === "R" || word === "B") return word;
      if (word === "K-pop" || word === "J-pop") return word;
      return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
    })
    .join(" ");
}

function makeMusicPreset(group: MusicSeedGroup, rawValue: string): MusicPreset {
  const value = normalizeReadableMusicValue(rawValue);
  const label = group.category === "Dialogue Seed" ? value : toMusicLabel(rawValue);
  const normalizedTriggerValue = value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user");

  return {
    id: `${group.prefix}_${slugifyMusicPreset(value)}`,
    category: group.category,
    label,
    value,
    triggerKeys: Array.from(
      new Set([
        rawValue,
        value,
        slugifyMusicPreset(value),
        ...normalizedTriggerValue
          .split(/[^a-z0-9]+/)
          .filter((part) => part.length > 2),
      ]),
    ),
    guidance: group.guidance,
    systemPromptTags: [group.category, value],
  };
}

export const MUSIC_PRESETS = MUSIC_SEED_GROUPS.flatMap((group) =>
  group.values.map((value) => makeMusicPreset(group, value)),
);

export const MUSIC_PRESET_CATEGORIES = Array.from(
  new Set(MUSIC_PRESETS.map((preset) => preset.category)),
).sort();

export const getMusicPresetsByCategory = (category: MusicPresetCategory) =>
  MUSIC_PRESETS.filter((preset) => preset.category === category);

export const findMusicPresetById = (id: string) =>
  MUSIC_PRESETS.find((preset) => preset.id === id);

export const compileMusicPresetAdditions = (
  preset: MusicPreset,
): CompiledMusicPresetAdditions => ({
  backgroundAddition: `Music context: ${preset.value}. ${preset.guidance}`,
  personalityAddition: `Music texture may include ${preset.value} without replacing the character's full personality, contradictions, responsibilities, flaws, or growth.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft music and taste context.`,
    "Let music reveal memory, mood, ritual, identity, private softness, affection, avoidance, or shared attention when the scene supports it.",
    "Keep consent, privacy, boundaries, and {{user}} autonomy intact; music should add human specificity without turning the character into a single gimmick.",
  ].join(" "),
});
