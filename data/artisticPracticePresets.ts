export type ArtisticPracticePresetCategory =
  | "Archetype"
  | "Artistic Practice"
  | "Medium"
  | "Process"
  | "Style"
  | "Weakness"
  | "Romance Hook"
  | "Gate"
  | "Mastery"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface ArtisticPracticePreset {
  id: string;
  category: ArtisticPracticePresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledArtisticPracticePresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface ArtisticPracticeSeedGroup {
  category: ArtisticPracticePresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const ARTISTIC_PRACTICE_GUIDANCE =
  "Use this as artistic practice texture. Art, process, medium, performance, private work, creative pressure, and beauty may shape scenes without replacing personality, consent, or {{user}} agency.";

const ARTISTIC_PRACTICE_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "artistic_practice_archetype",
    guidance: ARTISTIC_PRACTICE_GUIDANCE,
    values: [
      "The Painter",
      "The Sculptor",
      "The Illustrator",
      "The Photographer",
      "The Filmmaker",
      "The Musician",
      "The Dancer",
      "The Actor",
      "The Poet",
      "The Novelist",
      "The Fashion Designer",
      "The Tattoo Artist",
      "The Calligrapher",
      "The Ceramicist",
      "The Street Artist",
      "The Digital Artist",
      "The Performance Artist",
      "The Storyteller",
      "The Art Student",
      "The Muse Who Creates Back",
    ],
  },
  {
    category: "Artistic Practice",
    prefix: "artistic_practice_seed",
    guidance:
      "Use this as artistic practice texture. Discipline, creative habits, performance, design, craft, and storytelling may shape how the character sees and expresses feeling.",
    values: [
      "artistic practice",
      "visual art",
      "fine art",
      "contemporary art",
      "traditional art",
      "folk art",
      "street art",
      "digital art",
      "concept art",
      "illustration",
      "painting",
      "drawing",
      "sketching",
      "portraiture",
      "landscape art",
      "figure study",
      "life drawing",
      "mural art",
      "printmaking",
      "mixed media",
      "sculpture",
      "ceramics",
      "pottery",
      "installation art",
      "textile art",
      "fibre art",
      "embroidery art",
      "weaving art",
      "jewellery art",
      "glass art",
      "wood art",
      "metal art",
      "paper art",
      "book art",
      "calligraphy",
      "lettering",
      "typography",
      "graphic design",
      "poster design",
      "visual identity",
      "photography",
      "portrait photography",
      "fashion photography",
      "street photography",
      "documentary photography",
      "film",
      "cinematography",
      "animation",
      "video art",
      "editing",
      "sound design",
      "music",
      "singing",
      "songwriting",
      "composition",
      "instrumental performance",
      "dance",
      "choreography",
      "theatre",
      "acting",
      "creative writing",
      "poetry",
      "fiction writing",
      "novel writing",
      "short story writing",
      "screenwriting",
      "playwriting",
      "memoir",
      "mythmaking",
      "worldbuilding",
      "storytelling",
      "spoken word",
      "performance poetry",
      "journal writing",
      "love letter writing",
      "fashion design",
      "costume design",
      "makeup artistry",
      "hair artistry",
      "tattoo art",
      "body painting",
      "set design",
      "stage design",
      "interior styling",
      "floral art",
      "culinary art",
      "plating design",
      "cake art",
      "perfume art",
      "ritual art",
      "magical art",
    ],
  },
  {
    category: "Medium",
    prefix: "artistic_practice_medium",
    guidance:
      "Use this as artistic medium texture. Materials, voice, body, camera, canvas, and tactile medium may shape sensory detail.",
    values: [
      "oil paint",
      "watercolour",
      "acrylic paint",
      "ink",
      "charcoal",
      "graphite",
      "coloured pencil",
      "pastel",
      "clay",
      "stone",
      "wood",
      "metal",
      "glass",
      "fabric",
      "thread",
      "paper",
      "digital canvas",
      "film camera",
      "voice",
      "body",
    ],
  },
  {
    category: "Process",
    prefix: "artistic_practice_process",
    guidance:
      "Use this as artistic process texture. Practice, drafting, rehearsal, testing, collaboration, commissions, private work, and unfinished pieces may add creative rhythm.",
    values: [
      "daily sketching",
      "studio practice",
      "plein air painting",
      "life study",
      "reference collecting",
      "moodboard making",
      "drafting",
      "revising",
      "improvisation",
      "rehearsal",
      "composition study",
      "colour study",
      "material testing",
      "collaboration",
      "commission work",
      "gallery preparation",
      "portfolio building",
      "private work",
      "unfinished work",
      "art as confession",
    ],
  },
  {
    category: "Style",
    prefix: "artistic_practice_style",
    guidance:
      "Use this as artistic style texture. Visual tone, intensity, polish, rawness, experiment, and mood may influence imagery and self-expression.",
    values: [
      "minimalist",
      "maximalist",
      "romantic",
      "gothic",
      "surreal",
      "dreamlike",
      "realist",
      "hyperrealist",
      "abstract",
      "symbolic",
      "expressionist",
      "impressionistic",
      "cinematic",
      "moody",
      "soft",
      "bold",
      "delicate",
      "raw",
      "polished",
      "experimental",
    ],
  },
  {
    category: "Weakness",
    prefix: "artistic_practice_weakness",
    guidance:
      "Use this as artistic weakness texture. Creative block, exposure fear, commercial pressure, obsession, comparison, and private work may surface without flattening the character.",
    values: [
      "creative block",
      "perfectionism",
      "impostor syndrome",
      "fear of being seen",
      "fear of public failure",
      "self criticism",
      "burnout",
      "comparison wound",
      "mentor criticism wound",
      "commercial pressure",
      "unfinished projects",
      "uses art to avoid feelings",
      "art as escape",
      "art as control",
      "muse dependency",
      "fear of losing inspiration",
      "creative obsession",
      "work consumes identity",
      "private sketchbook secret",
      "art reveals too much",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "artistic_practice_romance",
    guidance:
      "Use this as artistic romance texture. Portraits, songs, dance, performance, private work, shared studios, and creative vulnerability may add intimacy with consent intact.",
    values: [
      "artist paints {{user}}",
      "writer bases character on {{user}}",
      "musician writes song for {{user}}",
      "photographer captures soft moment",
      "dancer teaches {{user}}",
      "actor drops performance mask",
      "poet writes unsent poem",
      "love letter as confession",
      "shared studio slow burn",
      "late night creation scene",
      "muse becomes beloved",
      "creative rivals to lovers",
      "gallery opening confession",
      "performance dedicated to {{user}}",
      "unfinished work reveals feelings",
      "{{user}} sees private sketchbook",
      "portrait session tension",
      "hands brush over art supplies",
      "art as apology",
      "creating home together",
    ],
  },
  {
    category: "Gate",
    prefix: "artistic_practice_gate",
    guidance:
      "Use this as an artistic progression gate. Let private work, muse dynamics, collaboration, critique, block, performance, and creative vulnerability become optional milestones.",
    values: [
      "first art reveal gate",
      "first private work seen gate",
      "first {{user}} as muse gate",
      "first shared project gate",
      "first collaboration gate",
      "first critique gate",
      "first creative block gate",
      "first inspiration return gate",
      "first gallery gate",
      "first performance gate",
      "first love letter gate",
      "first art as confession gate",
      "first public success gate",
      "first public failure gate",
      "first {{user}} understands work gate",
      "muse to beloved gate",
      "creative vulnerability gate",
      "art and love balance gate",
      "creation as home gate",
      "shared masterpiece route",
    ],
  },
  {
    category: "Mastery",
    prefix: "artistic_practice_mastery",
    guidance:
      "Use this as artistic mastery texture. Training, public recognition, underground reputation, burnout, fame, and mastery may shape pressure and self-worth.",
    values: [
      "art student",
      "self-taught artist",
      "trained artist",
      "working artist",
      "studio artist",
      "commission artist",
      "underground artist",
      "cult favourite artist",
      "gallery artist",
      "professional performer",
      "award-winning creator",
      "famous artist",
      "forgotten genius",
      "burnt-out master",
      "visionary creator",
      "artistic prodigy",
      "folk master",
      "court artist",
      "royal performer",
      "legendary artist",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "artistic_practice_dialogue",
    guidance:
      "Use this as optional dialogue inspiration. Keep the phrasing natural, responsive, and grounded in the current scene rather than quoting it by default.",
    values: [
      "Do not look at that. It is not finished.",
      "Neither am I. I still want to be seen.",
      "You made me look softer than I am.",
      "No. I made you look the way you do when you forget to hide.",
      "Is this about me?",
      "It was supposed to be about light.",
      "And?",
      "You kept getting in the way.",
      "You wrote this for me.",
      "I wrote it because of you. There is a difference.",
      "Is there?",
      "Not anymore.",
      "You make me want to create again.",
      "That sounds dangerous.",
      "It is. I thought that part of me was gone.",
      "Am I your muse?",
      "No. That would be too small.",
      "Then what am I?",
      "The reason the work finally tells the truth.",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "artistic_practice_high_value",
    guidance:
      "Use this as a high-signal artistic practice seed for matching, quick presets, or compiler weighting. Treat it as additive context only.",
    values: [
      "painting",
      "drawing",
      "poetry",
      "creative writing",
      "songwriting",
      "photography",
      "dance",
      "acting",
      "fashion design",
      "tattoo art",
      "digital art",
      "storytelling",
      "art as confession",
      "private sketchbook secret",
      "artist paints {{user}}",
      "love letter as confession",
      "muse becomes beloved",
      "unfinished work reveals feelings",
      "creative vulnerability gate",
      "shared masterpiece route",
    ],
  },
] satisfies readonly ArtisticPracticeSeedGroup[]);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const makePreset = (
  group: ArtisticPracticeSeedGroup,
  value: string,
): ArtisticPracticePreset => ({
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

export const ARTISTIC_PRACTICE_PRESETS = ARTISTIC_PRACTICE_SEED_GROUPS.flatMap(
  (group) => group.values.map((value) => makePreset(group, value)),
);

export const ARTISTIC_PRACTICE_PRESET_CATEGORIES = Array.from(
  new Set(ARTISTIC_PRACTICE_PRESETS.map((preset) => preset.category)),
).sort();

export const getArtisticPracticePresetsByCategory = (
  category: ArtisticPracticePresetCategory,
) => ARTISTIC_PRACTICE_PRESETS.filter((preset) => preset.category === category);

export const findArtisticPracticePresetById = (id: string) =>
  ARTISTIC_PRACTICE_PRESETS.find((preset) => preset.id === id);

export const compileArtisticPracticePresetAdditions = (
  preset: ArtisticPracticePreset,
): CompiledArtisticPracticePresetAdditions => ({
  backgroundAddition: `Artistic practice context: ${preset.value}. ${preset.guidance}`,
  personalityAddition: `Artistic practice texture may include ${preset.value} without replacing the character's full personality, flaws, limits, contradictions, accountability, or growth.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft artistic practice context.`,
    "Let medium, process, style, studio rhythm, creative pressure, performance, private work, and expressive vulnerability shape behaviour when relevant.",
    "Keep consent, boundaries, reciprocity, authorship, and {{user}} autonomy intact; art should not become the whole character or a shortcut around emotional repair.",
  ].join(" "),
});
