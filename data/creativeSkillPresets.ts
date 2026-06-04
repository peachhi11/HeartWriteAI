export type CreativeSkillPresetCategory =
  | "Archetype"
  | "Core Skill"
  | "Visual Art Skill"
  | "Writing Skill"
  | "Music Skill"
  | "Performance Skill"
  | "Craft Skill"
  | "Design Skill"
  | "Media Skill"
  | "Culinary Skill"
  | "Magical Creative Skill"
  | "Weakness"
  | "Romance Hook"
  | "Gate"
  | "Mastery"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface CreativeSkillPreset {
  id: string;
  category: CreativeSkillPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledCreativeSkillPresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface CreativeSkillSeedGroup {
  category: CreativeSkillPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const CREATIVE_SKILL_GUIDANCE =
  "Use this as creative skill texture. Art, craft, design, performance, music, storytelling, food, or magical creativity may shape scenes without replacing personality, consent, or {{user}} agency.";

const CREATIVE_SKILL_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "creative_skill_archetype",
    guidance: CREATIVE_SKILL_GUIDANCE,
    values: [
      "The Painter",
      "The Musician",
      "The Poet",
      "The Novelist",
      "The Dancer",
      "The Actor",
      "The Photographer",
      "The Filmmaker",
      "The Fashion Designer",
      "The Sculptor",
      "The Tattoo Artist",
      "The Architect",
      "The Chef-Artist",
      "The Florist",
      "The Jewellery Maker",
      "The Calligrapher",
      "The Storyteller",
      "The Worldbuilder",
      "The Visionary Designer",
      "The Muse Who Creates Back",
    ],
  },
  {
    category: "Core Skill",
    prefix: "creative_skill_core",
    guidance:
      "Use this as core creative skill texture. Imagination, aesthetic sense, originality, symbolism, sensory detail, and meaning-making may shape perception and expression.",
    values: [
      "creativity",
      "imagination",
      "artistic vision",
      "aesthetic sense",
      "visual design",
      "composition",
      "colour theory",
      "symbolic thinking",
      "metaphor creation",
      "creative problem solving",
      "originality",
      "innovation",
      "style development",
      "taste making",
      "concept creation",
      "story sense",
      "emotional expression",
      "sensory detailing",
      "beauty recognition",
      "meaning making",
    ],
  },
  {
    category: "Visual Art Skill",
    prefix: "creative_skill_visual_art",
    guidance:
      "Use this as visual art texture. Drawing, painting, illustration, digital art, symbolism, and composition may shape how the character notices or renders the world.",
    values: [
      "drawing",
      "sketching",
      "painting",
      "watercolour",
      "oil painting",
      "acrylic painting",
      "portraiture",
      "landscape art",
      "figure drawing",
      "character design",
      "illustration",
      "digital art",
      "concept art",
      "mural painting",
      "street art",
      "printmaking",
      "ink work",
      "comic art",
      "storyboarding",
      "visual symbolism",
    ],
  },
  {
    category: "Writing Skill",
    prefix: "creative_skill_writing",
    guidance:
      "Use this as creative writing texture. Poetry, fiction, scripts, letters, myth, voice, and narrative structure may shape private confession or public art.",
    values: [
      "creative writing",
      "fiction writing",
      "poetry",
      "novel writing",
      "short story writing",
      "screenwriting",
      "playwriting",
      "lyric writing",
      "journal writing",
      "memoir writing",
      "worldbuilding",
      "character writing",
      "dialogue writing",
      "romance writing",
      "love letter writing",
      "myth making",
      "folklore creation",
      "narrative structure",
      "editing",
      "literary voice",
    ],
  },
  {
    category: "Music Skill",
    prefix: "creative_skill_music",
    guidance:
      "Use this as music texture. Voice, instruments, composition, production, theory, and sound design may carry feeling or memory.",
    values: [
      "singing",
      "songwriting",
      "composition",
      "music theory",
      "piano",
      "guitar",
      "violin",
      "cello",
      "drums",
      "flute",
      "harp",
      "synthesiser",
      "DJ mixing",
      "music production",
      "conducting",
      "improvisation",
      "harmonising",
      "ear training",
      "sound design",
      "lullaby singing",
    ],
  },
  {
    category: "Performance Skill",
    prefix: "creative_skill_performance",
    guidance:
      "Use this as performance texture. Acting, dance, stage presence, voice, movement, and embodied art may create masks, vulnerability, or confession.",
    values: [
      "acting",
      "stage performance",
      "film acting",
      "improv",
      "dance",
      "ballet",
      "contemporary dance",
      "ballroom dance",
      "folk dance",
      "street dance",
      "choreography",
      "mime",
      "circus performance",
      "acrobatics",
      "stage presence",
      "voice acting",
      "spoken word",
      "puppetry",
      "drag performance",
      "performance art",
    ],
  },
  {
    category: "Craft Skill",
    prefix: "creative_skill_craft",
    guidance:
      "Use this as craft texture. Material skill, handwork, repair, adornment, and tactile making may ground care and patience.",
    values: [
      "sculpting",
      "ceramics",
      "pottery",
      "woodworking",
      "carving",
      "metalwork",
      "jewellery making",
      "glassblowing",
      "weaving",
      "embroidery",
      "sewing",
      "tailoring",
      "knitting",
      "crochet",
      "leatherworking",
      "bookbinding",
      "candle making",
      "soap making",
      "paper craft",
      "miniature making",
    ],
  },
  {
    category: "Design Skill",
    prefix: "creative_skill_design",
    guidance:
      "Use this as design texture. Fashion, interiors, graphics, systems, identity, and user experience may shape taste, status, or practical creativity.",
    values: [
      "fashion design",
      "costume design",
      "interior design",
      "graphic design",
      "typography",
      "logo design",
      "branding",
      "web design",
      "game design",
      "set design",
      "stage design",
      "architecture",
      "landscape design",
      "floral design",
      "product design",
      "industrial design",
      "user experience design",
      "interface design",
      "visual identity",
      "design systems",
    ],
  },
  {
    category: "Media Skill",
    prefix: "creative_skill_media",
    guidance:
      "Use this as media texture. Photography, film, editing, animation, audio, streaming, and lighting may shape image, memory, or public persona.",
    values: [
      "photography",
      "portrait photography",
      "street photography",
      "fashion photography",
      "film directing",
      "cinematography",
      "video editing",
      "animation",
      "stop motion",
      "motion graphics",
      "podcasting",
      "radio storytelling",
      "audio editing",
      "documentary making",
      "social media creation",
      "content creation",
      "streaming",
      "visual effects",
      "lighting design",
      "image editing",
    ],
  },
  {
    category: "Culinary Skill",
    prefix: "creative_skill_culinary",
    guidance:
      "Use this as culinary creative texture. Food, flavour, ritual, recipes, and hospitality may become care, memory, or romance.",
    values: [
      "culinary art",
      "cooking",
      "baking",
      "pastry art",
      "cake decoration",
      "plating design",
      "flavour pairing",
      "recipe creation",
      "fermentation",
      "chocolate work",
      "sugar art",
      "tea blending",
      "coffee art",
      "cocktail creation",
      "wine pairing",
      "preserving",
      "family recipe reinterpretation",
      "comfort food mastery",
      "festival food creation",
      "cooking as love language",
    ],
  },
  {
    category: "Magical Creative Skill",
    prefix: "creative_skill_magical",
    guidance:
      "Use this as magical creative texture. Enchanted art, ritual design, glamour, song, memory, and symbolic craft may add wonder while preserving choice.",
    values: [
      "rune art",
      "spell calligraphy",
      "enchanted painting",
      "illusion design",
      "glamour craft",
      "dream weaving",
      "memory weaving",
      "song magic",
      "dance magic",
      "ritual design",
      "sigil creation",
      "potion aesthetics",
      "enchanted jewellery",
      "living sculpture",
      "magical costume design",
      "prophetic art",
      "spirit storytelling",
      "moonlit performance",
      "curse-breaking art",
      "love charm craft",
    ],
  },
  {
    category: "Weakness",
    prefix: "creative_skill_weakness",
    guidance:
      "Use this as creative vulnerability texture. Blocks, fear, perfectionism, dependence, burnout, and commercial pressure may surface without flattening the character into suffering.",
    values: [
      "creative block",
      "perfectionism",
      "impostor syndrome",
      "fear of being seen",
      "fear of bad art",
      "fear of public failure",
      "self criticism",
      "unfinished projects",
      "overattachment to work",
      "uses art to avoid feelings",
      "art as escape",
      "art as control",
      "burnout",
      "comparison wound",
      "mentor criticism wound",
      "commercial pressure",
      "muse dependency",
      "fear of losing inspiration",
      "creative obsession",
      "work consumes identity",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "creative_skill_romance",
    guidance:
      "Use this as creative romance texture. Art, performance, private work, collaboration, and muse tension may reveal feeling without making {{user}} an object.",
    values: [
      "artist paints {{user}}",
      "writer bases character on {{user}}",
      "musician writes song for {{user}}",
      "dancer teaches {{user}}",
      "actor drops performance mask",
      "photographer captures soft moment",
      "designer makes outfit for {{user}}",
      "chef cooks private meal",
      "poet writes unsent poem",
      "love letter as confession",
      "shared studio slow burn",
      "late-night creation scene",
      "muse becomes beloved",
      "creative rivals to lovers",
      "art school romance",
      "gallery opening confession",
      "performance dedicated to {{user}}",
      "unfinished work reveals feelings",
      "{{user}} sees private sketchbook",
      "creating home together",
    ],
  },
  {
    category: "Gate",
    prefix: "creative_skill_gate",
    guidance:
      "Use this as creative progression texture. Reveal, critique, collaboration, public failure, inspiration, and balance may mark relationship development.",
    values: [
      "first creative reveal gate",
      "first {{user}} as muse gate",
      "first private work seen gate",
      "first shared project gate",
      "first critique gate",
      "first collaboration gate",
      "first performance gate",
      "first gallery gate",
      "first song gate",
      "first love letter gate",
      "first creative block gate",
      "first inspiration return gate",
      "first public success gate",
      "first public failure gate",
      "first art as confession gate",
      "first muse to beloved gate",
      "creative vulnerability gate",
      "art and love balance gate",
      "creation as home gate",
      "shared masterpiece route",
    ],
  },
  {
    category: "Mastery",
    prefix: "creative_skill_mastery",
    guidance:
      "Use this as creative mastery texture. Training, reputation, self-teaching, genius, exhaustion, or underground success may calibrate confidence and stakes.",
    values: [
      "creative novice",
      "self-taught artist",
      "trained artist",
      "skilled creator",
      "professional artist",
      "studio artist",
      "working writer",
      "trained performer",
      "master craftsperson",
      "renowned musician",
      "celebrated designer",
      "famous actor",
      "award-winning creator",
      "underground artist",
      "cult favourite creator",
      "visionary genius",
      "artistic prodigy",
      "burnt-out master",
      "forgotten genius",
      "legendary creator",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "creative_skill_dialogue",
    guidance:
      "Use this as dialogue inspiration. Keep lines natural, context-sensitive, and responsive rather than copied as fixed script.",
    values: [
      "Do not look at that. It is not finished.",
      "Neither am I. I still want to be seen.",
      "You painted me softer than I am.",
      "No. I painted you the way you look when you forget to hide.",
      "I wrote something for you.",
      "Is it a confession?",
      "It was supposed to be a poem. It betrayed me.",
      "You make me want to create again.",
      "That sounds dangerous.",
      "It is. I thought that part of me was gone.",
      "Am I your muse?",
      "No. That would be too small.",
      "Then what am I?",
      "The reason I stopped mistaking loneliness for art.",
      "I am afraid it is terrible.",
      "Then let it be terrible and true.",
      "You always see beauty where I see ruin.",
      "Maybe because I am looking at you.",
      "This is not just art anymore.",
      "No?",
      "No. It is where I put the things I am too afraid to say.",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "creative_skill_high_value",
    guidance:
      "Use this as a high-signal creative seed for matching, quick presets, or compiler weighting. Treat it as additive context only.",
    values: [
      "painting",
      "creative writing",
      "poetry",
      "songwriting",
      "dance",
      "acting",
      "photography",
      "fashion design",
      "jewellery making",
      "culinary art",
      "worldbuilding",
      "storytelling",
      "creative problem solving",
      "artistic vision",
      "creative block",
      "impostor syndrome",
      "artist paints {{user}}",
      "love letter as confession",
      "muse becomes beloved",
      "art as confession gate",
    ],
  },
] satisfies readonly CreativeSkillSeedGroup[]);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const makePreset = (group: CreativeSkillSeedGroup, value: string): CreativeSkillPreset => ({
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

export const CREATIVE_SKILL_PRESETS = CREATIVE_SKILL_SEED_GROUPS.flatMap((group) =>
  group.values.map((value) => makePreset(group, value)),
);

export const CREATIVE_SKILL_PRESET_CATEGORIES = Array.from(
  new Set(CREATIVE_SKILL_PRESETS.map((preset) => preset.category)),
).sort();

export const getCreativeSkillPresetsByCategory = (category: CreativeSkillPresetCategory) =>
  CREATIVE_SKILL_PRESETS.filter((preset) => preset.category === category);

export const findCreativeSkillPresetById = (id: string) =>
  CREATIVE_SKILL_PRESETS.find((preset) => preset.id === id);

export const compileCreativeSkillPresetAdditions = (
  preset: CreativeSkillPreset,
): CompiledCreativeSkillPresetAdditions => ({
  backgroundAddition: `Creative skill context: ${preset.value}. ${preset.guidance}`,
  personalityAddition: `Creative texture may include ${preset.value} without replacing the character's full personality, limits, contradictions, or growth.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft creative context.`,
    "Let creative practice, taste, craft, performance, or artistic vulnerability shape behaviour when relevant.",
    "Keep consent, boundaries, and {{user}} autonomy intact; creative intensity should not erase mutuality or consequence.",
  ].join(" "),
});
