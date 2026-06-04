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

const HOBBIES_TASTES_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "hobbies_tastes_archetype",
    guidance: HOBBIES_TASTES_GUIDANCE,
    values: [
      "The Music Lover",
      "The Comfort Foodie",
      "The Bookworm",
      "The Fashion Romantic",
      "The Quiet Homebody",
      "The Adventurous Athlete",
      "The Collector",
      "The Guilty Pleasure Enthusiast",
      "The Cosy Hobbyist",
      "The Nightlife Regular",
      "The Vintage Taste Romantic",
      "The Luxury Taste Character",
      "The Practical Minimalist",
      "The Artsy Indie Type",
      "The Soft Domestic Type",
      "The Competitive Sports Fan",
      "The Secret Nerd",
      "The Sensory Pleasure Seeker",
      "The Nostalgic Collector",
      "The One With Unexpected Tastes",
    ],
  },
  {
    category: "General Taste",
    prefix: "hobbies_tastes_seed",
    guidance:
      "Use this as general preference texture. Tastes may reveal comfort needs, private softness, routine, identity, or intimacy through small remembered details.",
    values: [
      "hobbies and tastes",
      "music taste",
      "food taste",
      "book taste",
      "fashion taste",
      "leisure style",
      "sports interest",
      "collections",
      "guilty pleasures",
      "comfort hobbies",
      "weekend routines",
      "personal preferences",
      "aesthetic preferences",
      "sensory preferences",
      "nostalgic tastes",
      "secret interests",
      "unexpected hobbies",
      "shared hobbies",
      "private pleasures",
      "taste as personality",
    ],
  },
  {
    category: "Music Taste",
    prefix: "hobbies_tastes_music",
    guidance:
      "Use this as music taste texture. Music may reveal memory, mood, private softness, status, nostalgia, or a shared intimacy ritual.",
    values: [
      "classical music",
      "jazz",
      "blues",
      "soul",
      "R and B",
      "rock",
      "punk",
      "metal",
      "indie music",
      "folk music",
      "country music",
      "pop music",
      "dance music",
      "electronic music",
      "house music",
      "techno",
      "ambient music",
      "lofi music",
      "opera",
      "musical theatre",
      "film scores",
      "video game soundtracks",
      "old love songs",
      "sad ballads",
      "club music",
      "underground bands",
      "vinyl records",
      "playlist maker",
      "sings in private",
      "music as memory",
    ],
  },
  {
    category: "Food Taste",
    prefix: "hobbies_tastes_food",
    guidance:
      "Use this as food taste texture. Food preferences may reveal comfort, family memory, stress, care, ritual, or affection through ordinary habits.",
    values: [
      "comfort food",
      "home cooking",
      "street food",
      "fine dining",
      "spicy food",
      "sweet tooth",
      "savoury snacks",
      "bitter flavours",
      "strong coffee",
      "tea lover",
      "baking lover",
      "breakfast foods",
      "midnight snacks",
      "family recipes",
      "festival food",
      "seafood",
      "noodle dishes",
      "soup when sad",
      "dessert first",
      "experimental foodie",
      "picky eater",
      "simple meals",
      "luxury tastes",
      "cheap eats",
      "cooks for love",
      "eats when stressed",
      "forgets to eat",
      "shares last bite",
      "knows {{user}}'s order",
      "food as love language",
    ],
  },
  {
    category: "Book Taste",
    prefix: "hobbies_tastes_book",
    guidance:
      "Use this as book taste texture. Reading habits may reveal escapism, intellect, nostalgia, private longing, or the kind of story the character secretly wants.",
    values: [
      "romance novels",
      "fantasy books",
      "science fiction books",
      "mystery books",
      "thrillers",
      "horror books",
      "literary fiction",
      "classic literature",
      "poetry",
      "philosophy books",
      "history books",
      "biographies",
      "memoirs",
      "academic texts",
      "mythology books",
      "fairy tales",
      "graphic novels",
      "manga",
      "comics",
      "fanfiction",
      "trashy paperbacks",
      "rare books",
      "annotates books",
      "dog-ears pages",
      "keeps books pristine",
      "reads before bed",
      "library regular",
      "bookstore date",
      "quotes favourite lines",
      "books as escape",
    ],
  },
  {
    category: "Fashion Taste",
    prefix: "hobbies_tastes_fashion",
    guidance:
      "Use this as fashion taste texture. Style may reveal armour, comfort, status, sensuality, rebellion, self-protection, or a wish to be seen.",
    values: [
      "minimalist fashion",
      "classic style",
      "preppy style",
      "streetwear",
      "punk style",
      "goth style",
      "dark academia",
      "light academia",
      "cottagecore",
      "royalcore",
      "vintage fashion",
      "old money style",
      "luxury fashion",
      "practical clothing",
      "soft knits",
      "tailored suits",
      "leather jackets",
      "flowing fabrics",
      "dramatic coats",
      "combat boots",
      "delicate jewellery",
      "statement jewellery",
      "signature colour",
      "signature scent",
      "always overdressed",
      "always underdressed",
      "effortless style",
      "carefully curated style",
      "borrows {{user}}'s clothes",
      "clothing as armour",
    ],
  },
  {
    category: "Leisure Style",
    prefix: "hobbies_tastes_leisure",
    guidance:
      "Use this as leisure texture. Free-time habits may shape pacing, domestic intimacy, public-private contrast, and how affection becomes routine.",
    values: [
      "homebody",
      "social butterfly",
      "night owl",
      "early riser",
      "slow mornings",
      "late night walks",
      "coffee shop regular",
      "museum visits",
      "gallery visits",
      "concert goer",
      "theatre goer",
      "movie nights",
      "game nights",
      "board games",
      "video games",
      "gardening",
      "cooking for fun",
      "baking for fun",
      "crafting",
      "journaling",
      "long drives",
      "road trips",
      "camping",
      "hiking",
      "stargazing",
      "beach days",
      "rainy day reading",
      "spa days",
      "people watching",
      "doing nothing together",
    ],
  },
  {
    category: "Sports Taste",
    prefix: "hobbies_tastes_sports",
    guidance:
      "Use this as sports and movement texture. Sport may reveal discipline, competitiveness, confidence, body awareness, ritual, or playful rivalry.",
    values: [
      "football fan",
      "soccer fan",
      "basketball fan",
      "baseball fan",
      "hockey fan",
      "tennis player",
      "swimmer",
      "runner",
      "boxer",
      "martial arts practice",
      "yoga",
      "pilates",
      "dance fitness",
      "weightlifting",
      "cycling",
      "skateboarding",
      "surfing",
      "skiing",
      "snowboarding",
      "rock climbing",
      "horse riding",
      "archery",
      "fencing",
      "sailing",
      "gym regular",
      "casual walks",
      "competitive streak",
      "sports rivalry",
      "watches games loudly",
      "quietly athletic",
    ],
  },
  {
    category: "Collection",
    prefix: "hobbies_tastes_collection",
    guidance:
      "Use this as collection texture. Collections may reveal memory, control, beauty, nostalgia, secrecy, class, survival, or sentimental attachment.",
    values: [
      "book collection",
      "vinyl collection",
      "tea collection",
      "coffee gear collection",
      "perfume collection",
      "jewellery collection",
      "watch collection",
      "knife collection",
      "weapon collection",
      "antique collection",
      "coin collection",
      "stamp collection",
      "postcard collection",
      "pressed flowers",
      "shell collection",
      "stone collection",
      "crystal collection",
      "art print collection",
      "photograph collection",
      "ticket stub collection",
      "old letters collection",
      "rare maps",
      "vintage clothing",
      "miniatures",
      "figurines",
      "plushies",
      "plants",
      "candles",
      "stationery",
      "keepsakes from {{user}}",
    ],
  },
  {
    category: "Guilty Pleasure",
    prefix: "hobbies_tastes_guilty_pleasure",
    guidance:
      "Use this as guilty-pleasure texture. Private softness and unserious habits may humanise the character without mocking or flattening them.",
    values: [
      "trashy romance novels",
      "reality TV",
      "soap operas",
      "cheesy movies",
      "bad action movies",
      "dramatic ballads",
      "karaoke",
      "celebrity gossip",
      "late night snacks",
      "expensive coffee",
      "sweet cocktails",
      "cute plushies",
      "collecting stickers",
      "romance anime",
      "dating sims",
      "fanfiction",
      "horoscopes",
      "personality quizzes",
      "online shopping",
      "luxury scented candles",
      "sleeping in",
      "dramatic daydreaming",
      "secret soft playlist",
      "crying at happy endings",
      "pretends not to like cute things",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "hobbies_tastes_romance",
    guidance:
      "Use this as romance-facing preference texture. Shared tastes, remembered details, small gifts, and private routines may support earned intimacy.",
    values: [
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
    ],
  },
  {
    category: "Gate",
    prefix: "hobbies_tastes_gate",
    guidance:
      "Use this as an optional event gate. Preferences should surface through remembered details, shared routines, and earned intimacy rather than constant exposition.",
    values: [
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
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "hobbies_tastes_dialogue",
    guidance:
      "Use this as optional dialogue flavour. Dialogue seeds should feel earned by the scene, not pasted in as fixed lines.",
    values: [
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
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "hobbies_tastes_high_value",
    guidance:
      "Use this as a high-signal hobbies and tastes seed. These are compact selectors for character creation, matching, and preset search.",
    values: [
      "music taste",
      "comfort food",
      "book taste",
      "fashion taste",
      "homebody",
      "night owl",
      "coffee shop regular",
      "movie nights",
      "stargazing",
      "sports rivalry",
      "book collection",
      "vinyl collection",
      "keepsakes from {{user}}",
      "guilty pleasures",
      "makes playlist for {{user}}",
      "cooks {{user}}'s favourite meal",
      "borrows {{user}}'s clothes",
      "annotated book as love letter",
      "known by small things gate",
      "home in habits route",
    ],
  },
] satisfies readonly HobbiesTastesSeedGroup[]);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const makePreset = (
  group: HobbiesTastesSeedGroup,
  value: string,
): HobbiesTastesPreset => ({
  id: `${group.prefix}_${slugify(value)}`,
  category: group.category,
  label: value,
  value,
  triggerKeys: Array.from(
    new Set([
      value,
      ...value
        .toLowerCase()
        .replace(/\{\{user\}\}/g, "user")
        .split(/[^a-z0-9]+/)
        .filter((part) => part.length > 2),
    ]),
  ),
  guidance: group.guidance,
  systemPromptTags: [group.category, value],
});

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
