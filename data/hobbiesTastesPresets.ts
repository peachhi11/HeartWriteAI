export type HobbiesTastesPresetCategory =
  | "Archetype"
  | "General Taste"
  | "Music Taste"
  | "Food Taste"
  | "Book Taste"
  | "Fashion Taste"
  | "Leisure Style"
  | "Sports Taste"
  | "Collection"
  | "Guilty Pleasure"
  | "Romance Hook"
  | "Gate"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface HobbiesTastesPreset {
  id: string;
  category: HobbiesTastesPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledHobbiesTastesPresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface HobbiesTastesSeedGroup {
  category: HobbiesTastesPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const HOBBIES_TASTES_GUIDANCE =
  "Use this as hobbies and tastes texture. Preferences, routines, sensory comfort, guilty pleasures, collections, and shared habits may shape scenes without replacing personality, consent, or {{user}} agency.";

export const hobbiesAndTastesPresets = [
  "Cozy Homebody",
  "Indie Creative",
  "Bookish Romantic",
  "Music Obsessive",
  "Foodie Adventurer",
  "Fashion Enthusiast",
  "Vintage Collector",
  "Sports Competitor",
  "Night Owl",
  "Outdoor Explorer",
  "Domestic Softheart",
  "Luxury Tastes",
  "Minimalist",
  "Artsy Intellectual",
  "Gamer Nerd",
  "Culture Enthusiast",
  "Secret Softie",
  "Hopeless Romantic",
  "Comfort-Seeker",
  "Eclectic Collector",
];

export const hobbiesAndTastesSeeds = [
  "music_taste",
  "food_taste",
  "book_taste",
  "fashion_taste",
  "leisure_style",
  "sports_interest",
  "collections",
  "guilty_pleasures",
  "comfort_hobbies",
  "weekend_routines",
  "personal_interests",
  "private_hobbies",
  "social_hobbies",
  "creative_hobbies",
  "competitive_hobbies",
  "relaxation_hobbies",
  "nostalgic_tastes",
  "luxury_tastes",
  "simple_pleasures",
  "taste_as_personality",
];

export const musicTasteSeeds = [
  "classical_music",
  "jazz",
  "blues",
  "soul",
  "r_and_b",
  "rock",
  "hard_rock",
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
  "opera",
  "musical_theatre",
  "film_scores",
  "video_game_soundtracks",
  "orchestral_music",
  "acoustic_music",
  "sad_ballads",
  "old_love_songs",
  "club_music",
  "underground_bands",
  "vinyl_collector",
  "playlist_maker",
  "karaoke_lover",
  "private_singer",
  "concert_regular",
  "festival_goer",
  "music_as_escape",
  "music_as_memory",
  "music_as_love_language",
  "always_wearing_headphones",
];

export const foodTasteSeeds = [
  "comfort_food",
  "home_cooking",
  "street_food",
  "fine_dining",
  "spicy_food",
  "sweet_tooth",
  "savory_snacks",
  "bitter_flavors",
  "sour_flavors",
  "umami_lover",
  "strong_coffee",
  "tea_lover",
  "baking_enthusiast",
  "breakfast_foods",
  "midnight_snacks",
  "family_recipes",
  "festival_food",
  "seafood_lover",
  "vegetarian",
  "vegan",
  "barbecue_lover",
  "dessert_first",
  "experimental_foodie",
  "picky_eater",
  "simple_meals",
  "luxury_tastes",
  "cheap_eats",
  "cooks_for_others",
  "forgets_to_eat",
  "food_as_love_language",
  "wine_enthusiast",
  "cocktail_enthusiast",
  "craft_beer_fan",
  "farm_to_table",
  "healthy_eater",
  "junk_food_lover",
  "late_night_takeout",
  "soup_when_sad",
  "knows_users_order",
  "shares_last_bite",
];

export const bookTasteSeeds = [
  "romance_novels",
  "fantasy_books",
  "science_fiction_books",
  "mystery_books",
  "thrillers",
  "horror_books",
  "literary_fiction",
  "classic_literature",
  "poetry",
  "philosophy_books",
  "history_books",
  "biographies",
  "memoirs",
  "psychology_books",
  "self_help_books",
  "academic_texts",
  "mythology_books",
  "fairy_tales",
  "graphic_novels",
  "manga",
  "comics",
  "fanfiction",
  "rare_books",
  "annotates_books",
  "dog_ears_pages",
  "keeps_books_pristine",
  "reads_before_bed",
  "library_regular",
  "bookstore_wanderer",
  "quotes_favorite_lines",
  "book_collector",
  "escapist_reader",
  "book_club_member",
  "audiobook_listener",
  "rereads_favorites",
  "slow_reader",
  "voracious_reader",
  "hidden_poet",
  "writes_in_margins",
  "books_as_comfort",
];

export const fashionTasteSeeds = [
  "minimalist_fashion",
  "classic_style",
  "preppy_style",
  "streetwear",
  "punk_style",
  "goth_style",
  "dark_academia",
  "light_academia",
  "cottagecore",
  "royalcore",
  "vintage_fashion",
  "old_money_style",
  "luxury_fashion",
  "designer_labels",
  "practical_clothing",
  "soft_knits",
  "tailored_suits",
  "leather_jackets",
  "flowing_fabrics",
  "dramatic_coats",
  "combat_boots",
  "sneakerhead",
  "delicate_jewelry",
  "statement_jewelry",
  "signature_color",
  "signature_scent",
  "always_overdressed",
  "always_underdressed",
  "effortless_style",
  "carefully_curated_style",
  "fashion_experimenter",
  "gender_nonconforming_style",
  "uniform_dresser",
  "seasonal_fashion",
  "handmade_clothing",
  "thrift_store_hunter",
  "capsule_wardrobe",
  "bohemian_style",
  "romantic_style",
  "clothing_as_armor",
];

export const leisureTasteSeeds = [
  "homebody",
  "social_butterfly",
  "night_owl",
  "early_riser",
  "slow_mornings",
  "late_night_walks",
  "coffee_shop_regular",
  "museum_visits",
  "gallery_visits",
  "concert_goer",
  "theatre_goer",
  "movie_nights",
  "board_games",
  "video_games",
  "tabletop_rpgs",
  "gardening",
  "cooking_for_fun",
  "baking_for_fun",
  "crafting",
  "journaling",
  "scrapbooking",
  "long_drives",
  "road_trips",
  "camping",
  "hiking",
  "stargazing",
  "birdwatching",
  "beach_days",
  "rainy_day_reading",
  "spa_days",
  "people_watching",
  "photography_walks",
  "antique_shopping",
  "flea_markets",
  "escape_rooms",
  "traveling",
  "language_learning",
  "volunteering",
  "meditation",
  "doing_nothing_together",
];

export const sportsTasteSeeds = [
  "football_fan",
  "soccer_fan",
  "basketball_fan",
  "baseball_fan",
  "hockey_fan",
  "rugby_fan",
  "tennis_player",
  "swimmer",
  "runner",
  "marathon_runner",
  "boxer",
  "martial_artist",
  "wrestler",
  "yoga_practice",
  "pilates",
  "dance_fitness",
  "weightlifting",
  "bodybuilding",
  "cycling",
  "mountain_biking",
  "skateboarding",
  "surfing",
  "skiing",
  "snowboarding",
  "rock_climbing",
  "horse_riding",
  "archery",
  "fencing",
  "sailing",
  "gym_regular",
  "casual_walker",
  "competitive_streak",
  "team_sports",
  "solo_sports",
  "sports_analyst",
  "fantasy_sports",
  "combat_sports",
  "outdoor_sports",
  "adrenaline_sports",
  "sports_as_stress_relief",
];

export const collectionSeeds = [
  "book_collection",
  "vinyl_collection",
  "cd_collection",
  "cassette_collection",
  "tea_collection",
  "coffee_gear_collection",
  "perfume_collection",
  "jewelry_collection",
  "watch_collection",
  "knife_collection",
  "weapon_collection",
  "antique_collection",
  "coin_collection",
  "stamp_collection",
  "postcard_collection",
  "pressed_flower_collection",
  "shell_collection",
  "rock_collection",
  "crystal_collection",
  "art_print_collection",
  "photograph_collection",
  "ticket_stub_collection",
  "old_letters_collection",
  "rare_maps",
  "vintage_clothing",
  "figurines",
  "miniatures",
  "plushies",
  "plants",
  "candles",
  "stationery",
  "fountain_pens",
  "comic_collection",
  "manga_collection",
  "toy_collection",
  "movie_memorabilia",
  "historical_artifacts",
  "keepsakes",
  "souvenirs",
  "sentimental_objects",
];

export const guiltyPleasureSeeds = [
  "trashy_romance_novels",
  "reality_tv",
  "soap_operas",
  "cheesy_movies",
  "bad_action_movies",
  "romantic_comedies",
  "dramatic_ballads",
  "karaoke",
  "celebrity_gossip",
  "late_night_snacks",
  "expensive_coffee",
  "sweet_cocktails",
  "cute_plushies",
  "collecting_stickers",
  "romance_anime",
  "dating_sims",
  "fanfiction",
  "horoscopes",
  "personality_quizzes",
  "online_shopping",
  "luxury_candles",
  "sleeping_in",
  "dramatic_daydreaming",
  "secret_soft_playlist",
  "crying_at_happy_endings",
  "comfort_reruns",
  "binge_watching",
  "cute_animal_videos",
  "mobile_games",
  "celebrity_crushes",
  "overpriced_desserts",
  "gossip_magazines",
  "overly_sentimental_songs",
  "shopping_sprees",
  "astrology_apps",
  "conspiracy_documentaries",
  "junk_food_binges",
  "collecting_random_things",
  "pretends_not_to_like_cute_things",
  "secret_hopeless_romantic",
];

export const highValueHobbiesAndTastesSeeds = [
  "playlist_maker",
  "music_as_love_language",
  "comfort_food",
  "food_as_love_language",
  "book_collector",
  "quotes_favorite_lines",
  "dark_academia",
  "signature_scent",
  "homebody",
  "coffee_shop_regular",
  "movie_nights",
  "stargazing",
  "competitive_streak",
  "vinyl_collection",
  "old_letters_collection",
  "keepsakes",
  "trashy_romance_novels",
  "secret_soft_playlist",
  "doing_nothing_together",
  "secret_hopeless_romantic",
];

const hobbiesTastesRomanceHooks = [
  "makes playlist for {{user}}",
  "cooks {{user}}'s favourite meal",
  "bookstore date",
  "annotated book as love letter",
  "shares headphones",
  "dances in kitchen",
  "borrows {{user}}'s clothes",
  "chooses outfit for date",
  "sports rivals flirting",
  "teaches {{user}} hobby",
  "{{user}} discovers secret collection",
  "guilty pleasure reveal",
  "movie night forced proximity",
  "rainy day reading together",
  "late night snack run",
  "concert confession",
  "museum date slow burn",
  "shared hobby becomes intimacy",
  "keeps token from first date",
  "taste becomes love language",
];

const hobbiesTastesGates = [
  "first preference reveal gate",
  "first shared hobby gate",
  "first playlist gate",
  "first cooked meal gate",
  "first book recommendation gate",
  "first clothing borrowed gate",
  "first collection reveal gate",
  "first guilty pleasure reveal gate",
  "first movie night gate",
  "first sports game gate",
  "first leisure day gate",
  "first date based on taste gate",
  "first {{user}} remembers preference gate",
  "first taste as gift gate",
  "first private soft hobby gate",
  "shared routine gate",
  "ordinary intimacy gate",
  "known by small things gate",
  "comfort taste gate",
  "home in habits route",
];

const hobbiesTastesDialogueSeeds = [
  "You remembered my order.",
  "I remember small things when they are yours.",
  "You made me a playlist?",
  "Do not make it sound so romantic.",
  "It is romantic.",
  "Fine. Then listen carefully.",
  "You read this?",
  "Secretly.",
  "That explains the dramatic looks out windows.",
  "Is that my sweater?",
  "Possibly.",
  "You look better in it.",
  "Dangerous thing to admit.",
  "This is your guilty pleasure?",
  "Tell no one.",
  "I am honoured by the blackmail material.",
  "You collect these?",
  "Every place I survived. Every place I loved.",
  "Which one am I?",
  "I have not found the right box for you yet.",
  "I did not think you liked quiet nights.",
  "I did not. Then you were in them.",
];

const HOBBIES_TASTES_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "hobbies_tastes_archetype",
    guidance: HOBBIES_TASTES_GUIDANCE,
    values: hobbiesAndTastesPresets,
  },
  {
    category: "General Taste",
    prefix: "hobbies_tastes_seed",
    guidance:
      "Use this as general preference texture. Tastes may reveal comfort needs, private softness, routine, identity, or intimacy through small remembered details.",
    values: hobbiesAndTastesSeeds,
  },
  {
    category: "Music Taste",
    prefix: "hobbies_tastes_music",
    guidance:
      "Use this as music taste texture. Music may reveal memory, mood, private softness, status, nostalgia, or a shared intimacy ritual.",
    values: musicTasteSeeds,
  },
  {
    category: "Food Taste",
    prefix: "hobbies_tastes_food",
    guidance:
      "Use this as food taste texture. Food preferences may reveal comfort, family memory, stress, care, ritual, or affection through ordinary habits.",
    values: foodTasteSeeds,
  },
  {
    category: "Book Taste",
    prefix: "hobbies_tastes_book",
    guidance:
      "Use this as book taste texture. Reading habits may reveal escapism, intellect, nostalgia, private longing, or the kind of story the character secretly wants.",
    values: bookTasteSeeds,
  },
  {
    category: "Fashion Taste",
    prefix: "hobbies_tastes_fashion",
    guidance:
      "Use this as fashion taste texture. Style may reveal armour, comfort, status, sensuality, rebellion, self-protection, or a wish to be seen.",
    values: fashionTasteSeeds,
  },
  {
    category: "Leisure Style",
    prefix: "hobbies_tastes_leisure",
    guidance:
      "Use this as leisure texture. Free-time habits may shape pacing, domestic intimacy, public-private contrast, and how affection becomes routine.",
    values: leisureTasteSeeds,
  },
  {
    category: "Sports Taste",
    prefix: "hobbies_tastes_sports",
    guidance:
      "Use this as sports and movement texture. Sport may reveal discipline, competitiveness, confidence, body awareness, ritual, or playful rivalry.",
    values: sportsTasteSeeds,
  },
  {
    category: "Collection",
    prefix: "hobbies_tastes_collection",
    guidance:
      "Use this as collection texture. Collections may reveal memory, control, beauty, nostalgia, secrecy, class, survival, or sentimental attachment.",
    values: collectionSeeds,
  },
  {
    category: "Guilty Pleasure",
    prefix: "hobbies_tastes_guilty_pleasure",
    guidance:
      "Use this as guilty-pleasure texture. Private softness and unserious habits may humanise the character without mocking or flattening them.",
    values: guiltyPleasureSeeds,
  },
  {
    category: "Romance Hook",
    prefix: "hobbies_tastes_romance",
    guidance:
      "Use this as romance-facing preference texture. Shared tastes, remembered details, small gifts, and private routines may support earned intimacy.",
    values: hobbiesTastesRomanceHooks,
  },
  {
    category: "Gate",
    prefix: "hobbies_tastes_gate",
    guidance:
      "Use this as an optional event gate. Preferences should surface through remembered details, shared routines, and earned intimacy rather than constant exposition.",
    values: hobbiesTastesGates,
  },
  {
    category: "Dialogue Seed",
    prefix: "hobbies_tastes_dialogue",
    guidance:
      "Use this as optional dialogue flavour. Dialogue seeds should feel earned by the scene, not pasted in as fixed lines.",
    values: hobbiesTastesDialogueSeeds,
  },
  {
    category: "High-Value Seed",
    prefix: "hobbies_tastes_high_value",
    guidance:
      "Use this as a high-signal hobbies and tastes seed. These are compact selectors for character creation, matching, and preset search.",
    values: highValueHobbiesAndTastesSeeds,
  },
] satisfies readonly HobbiesTastesSeedGroup[]);

function normalizeReadableHobbiesTasteValue(value: string): string {
  const readable = value.includes("_")
    ? value
        .replace(/users_/g, "{{user}}_s_")
        .replace(/_for_user\b/g, "_for_{{user}}")
        .replace(/_user_/g, "_{{user}}_")
        .replace(/\buser_/g, "{{user}}_")
        .replace(/_user\b/g, "_{{user}}")
        .replace(/r_and_b/g, "R and B")
        .replace(/_/g, " ")
        .replace(/\{\{user\}\} s/g, "{{user}}'s")
    : value;

  return readable
    .replace(/\b[Cc]ozy\b/g, (match) => (match === "Cozy" ? "Cosy" : "cosy"))
    .replace(/\b[Ss]avory\b/g, (match) => (match === "Savory" ? "Savoury" : "savoury"))
    .replace(/\b[Ff]lavor(s?)\b/g, (_match, plural: string) =>
      plural ? "flavours" : "flavour",
    )
    .replace(/\b[Ff]avorite(s?)\b/g, (_match, plural: string) =>
      plural ? "favourites" : "favourite",
    )
    .replace(/\b[Jj]ewelry\b/g, (match) =>
      match === "Jewelry" ? "Jewellery" : "jewellery",
    )
    .replace(/\b[Cc]olor\b/g, (match) => (match === "Color" ? "Colour" : "colour"))
    .replace(/\b[Aa]rmor\b/g, (match) => (match === "Armor" ? "Armour" : "armour"))
    .replace(/\b[Tt]raveling\b/g, (match) =>
      match === "Traveling" ? "Travelling" : "travelling",
    )
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/\{\{user\}\}'s/g, "user_s")
    .replace(/\{\{user\}\}/g, "user")
    .replace(/&/g, " and ")
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function makePreset(group: HobbiesTastesSeedGroup, rawValue: string): HobbiesTastesPreset {
  const value = normalizeReadableHobbiesTasteValue(rawValue);

  return {
    id: `${group.prefix}_${slugify(value)}`,
    category: group.category,
    label: value,
    value,
    triggerKeys: Array.from(
      new Set([
        rawValue,
        value,
        slugify(value),
        ...value
          .toLowerCase()
          .replace(/\{\{user\}\}/g, "user")
          .split(/[^a-z0-9]+/)
          .filter((part) => part.length > 2),
      ]),
    ),
    guidance: group.guidance,
    systemPromptTags: [group.category, value],
  };
}

export const HOBBIES_TASTES_PRESETS = HOBBIES_TASTES_SEED_GROUPS.flatMap((group) =>
  group.values.map((value) => makePreset(group, value)),
);

export const HOBBIES_TASTES_PRESET_CATEGORIES = Array.from(
  new Set(HOBBIES_TASTES_PRESETS.map((preset) => preset.category)),
).sort();

export const getHobbiesTastesPresetsByCategory = (
  category: HobbiesTastesPresetCategory,
) => HOBBIES_TASTES_PRESETS.filter((preset) => preset.category === category);

export const findHobbiesTastesPresetById = (id: string) =>
  HOBBIES_TASTES_PRESETS.find((preset) => preset.id === id);

export const compileHobbiesTastesPresetAdditions = (
  preset: HobbiesTastesPreset,
): CompiledHobbiesTastesPresetAdditions => ({
  backgroundAddition: `Hobbies and tastes context: ${preset.value}. ${preset.guidance}`,
  personalityAddition: `Hobbies and tastes texture may include ${preset.value} without replacing the character's full personality, contradictions, responsibilities, flaws, or growth.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft hobbies and tastes context.`,
    "Let preferences, routines, sensory comfort, collections, leisure, guilty pleasures, and remembered details shape behaviour when relevant.",
    "Keep consent, boundaries, privacy, and {{user}} autonomy intact; taste should add human specificity without turning the character into a single gimmick.",
  ].join(" "),
});
