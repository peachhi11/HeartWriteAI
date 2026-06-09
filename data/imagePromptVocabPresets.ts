import {
  createVocabularySeedFromPresetLike,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export type ImagePromptVocabPresetCategory =
  | "Image Prompt Preset"
  | "Appearance Tag"
  | "Lighting"
  | "Pose"
  | "Camera Framing"
  | "Art Style"
  | "Material & Texture"
  | "Environment Tag"
  | "Image Mood"
  | "Image Quality"
  | "Negative Prompt"
  | "High-Value Image Seed";

export interface ImagePromptVocabPreset {
  id: string;
  category: ImagePromptVocabPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledImagePromptVocabPresetAdditions {
  imagePromptAddition: string;
  negativePromptAddition: string;
  systemPromptAddition: string;
}

interface ImagePromptVocabSeedGroup {
  category: ImagePromptVocabPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const IMAGE_PROMPT_VOCAB_GUIDANCE =
  "Use this as image prompt vocabulary for character cards, portraits, scene art, reference sheets, and visual search. Visual tags should support prompt assembly without changing the authored character, scenario, consent boundaries, or {{user}} agency.";

export const imagePromptVocabPresets = [
  "Romance Portrait",
  "Character Card Portrait",
  "Cinematic Close-Up",
  "Full Body Reference",
  "Fashion Editorial",
  "Dark Fantasy Portrait",
  "Soft Domestic Scene",
  "Gothic Atmosphere",
  "Cyberpunk Neon",
  "Royal Court Portrait",
  "Academy Character Art",
  "Underworld Noir",
  "Sci-Fi Crew Portrait",
  "Monster Romance Art",
  "Painterly Illustration",
  "Anime-Inspired Character",
  "Realistic Concept Art",
  "Cozy Slice-of-Life",
  "Dramatic Confession Scene",
  "Hero Shot",
];

export const tagStyleAppearanceSeeds = [
  "solo_character",
  "couple_portrait",
  "full_body",
  "half_body",
  "bust_portrait",
  "close_up",
  "expressive_face",
  "soft_features",
  "sharp_features",
  "delicate_features",
  "rugged_features",
  "androgynous_beauty",
  "elegant_presence",
  "commanding_presence",
  "gentle_presence",
  "messy_hair",
  "long_hair",
  "short_hair",
  "piercing_gaze",
  "warm_gaze",
  "scarred_skin",
  "freckles",
  "beauty_mark",
  "calloused_hands",
  "tailored_outfit",
  "flowing_fabric",
  "leather_jacket",
  "armor_details",
  "jewelry_details",
  "signature_scent_visual",
];

export const lightingSeeds = [
  "soft_lighting",
  "golden_hour",
  "blue_hour",
  "candlelight",
  "firelight",
  "moonlight",
  "neon_lighting",
  "rim_lighting",
  "backlighting",
  "dramatic_lighting",
  "low_key_lighting",
  "high_key_lighting",
  "diffused_light",
  "window_light",
  "overcast_light",
  "spotlight",
  "volumetric_light",
  "glowing_magic_light",
  "holographic_light",
  "storm_flash_lighting",
];

export const poseSeeds = [
  "standing_pose",
  "seated_pose",
  "leaning_against_wall",
  "looking_over_shoulder",
  "arms_crossed",
  "hands_in_pockets",
  "hand_over_heart",
  "holding_weapon",
  "holding_book",
  "holding_teacup",
  "reaching_out",
  "protective_stance",
  "soft_smile_pose",
  "guarded_posture",
  "relaxed_posture",
  "walking_toward_camera",
  "kneeling_pose",
  "dance_pose",
  "embrace_pose",
  "almost_touch_pose",
];

export const cameraFramingSeeds = [
  "portrait_orientation",
  "landscape_orientation",
  "square_crop",
  "close_up_framing",
  "medium_shot",
  "cowboy_shot",
  "full_body_shot",
  "over_the_shoulder",
  "profile_view",
  "three_quarter_view",
  "front_view",
  "low_angle",
  "high_angle",
  "eye_level",
  "wide_shot",
  "establishing_shot",
  "shallow_depth_of_field",
  "cinematic_composition",
  "centered_composition",
  "rule_of_thirds",
];

export const artStyleSeeds = [
  "realistic_concept_art",
  "semi_realistic",
  "painterly_illustration",
  "anime_inspired",
  "manga_style",
  "webtoon_style",
  "visual_novel_style",
  "oil_painting_style",
  "watercolor_style",
  "ink_illustration",
  "digital_painting",
  "character_sheet_style",
  "fashion_editorial_style",
  "film_still_style",
  "noir_style",
  "gothic_romance_style",
  "dark_fantasy_style",
  "high_fantasy_style",
  "cyberpunk_style",
  "solarpunk_style",
];

export const materialTextureSeeds = [
  "silk",
  "velvet",
  "lace",
  "linen",
  "wool",
  "leather",
  "denim",
  "polished_metal",
  "brushed_steel",
  "gold_details",
  "silver_details",
  "gemstone_details",
  "glass",
  "ceramic",
  "wood_grain",
  "stone_texture",
  "rain_wet_surface",
  "smoke",
  "mist",
  "glowing_runes",
];

export const environmentTagSeeds = [
  "bedroom",
  "kitchen",
  "coffee_shop",
  "bookstore",
  "library",
  "academy_hallway",
  "royal_ballroom",
  "throne_room",
  "manor_hall",
  "haunted_corridor",
  "rainy_street",
  "neon_alley",
  "nightclub",
  "safehouse",
  "hospital_room",
  "forest_path",
  "enchanted_forest",
  "battlefield",
  "space_station_corridor",
  "starship_observation_deck",
  "cyberpunk_city",
  "seaside_cliff",
  "desert_road",
  "mountain_cabin",
  "flower_garden",
  "storm_shelter",
  "underworld_bar",
  "magic_circle",
  "workshop",
  "artist_studio",
];

export const imagePromptMoodSeeds = [
  "romantic_mood",
  "soft_intimacy",
  "yearning",
  "melancholy",
  "dangerous_tension",
  "protective_energy",
  "cozy_warmth",
  "gothic_dread",
  "noir_mystery",
  "royal_elegance",
  "academic_atmosphere",
  "underworld_glamour",
  "sci_fi_isolation",
  "hopeful_future",
  "post_apocalyptic_grit",
  "quiet_vulnerability",
  "dramatic_confession",
  "domestic_peace",
  "battle_worn_beauty",
  "love_as_home",
];

export const imagePromptQualitySeeds = [
  "high_detail",
  "clean_linework",
  "soft_rendering",
  "sharp_focus",
  "cinematic_detail",
  "expressive_lighting",
  "rich_color_palette",
  "subtle_texture",
  "atmospheric_depth",
  "high_contrast",
  "soft_contrast",
  "detailed_background",
  "minimal_background",
  "professional_character_art",
  "polished_render",
  "emotional_expression",
  "dynamic_composition",
  "romantic_composition",
  "visual_storytelling",
  "character_card_ready",
];

export const negativePromptSeeds = [
  "blurry",
  "low_resolution",
  "extra_fingers",
  "missing_fingers",
  "distorted_hands",
  "distorted_face",
  "bad_anatomy",
  "awkward_pose",
  "crossed_eyes",
  "flat_lighting",
  "muddy_colors",
  "overexposed",
  "underexposed",
  "busy_background",
  "unreadable_details",
  "random_text",
  "watermark",
  "logo",
  "duplicate_character",
  "inconsistent_style",
];

export const highValueImagePromptSeeds = [
  "character_card_portrait",
  "full_body",
  "close_up",
  "expressive_face",
  "soft_lighting",
  "golden_hour",
  "candlelight",
  "neon_lighting",
  "protective_stance",
  "almost_touch_pose",
  "cinematic_composition",
  "three_quarter_view",
  "painterly_illustration",
  "realistic_concept_art",
  "visual_novel_style",
  "velvet",
  "leather",
  "rainy_street",
  "royal_ballroom",
  "starship_observation_deck",
];

const IMAGE_PROMPT_VOCAB_SEED_GROUPS = Object.freeze([
  {
    category: "Image Prompt Preset",
    prefix: "image_prompt_preset",
    guidance: IMAGE_PROMPT_VOCAB_GUIDANCE,
    values: imagePromptVocabPresets,
  },
  {
    category: "Appearance Tag",
    prefix: "image_prompt_appearance",
    guidance:
      "Use this as visual appearance prompt vocabulary. Appearance tags can describe framing, features, outfit details, gaze, posture, and visible presence without reducing the character to surface traits.",
    values: tagStyleAppearanceSeeds,
  },
  {
    category: "Lighting",
    prefix: "image_prompt_lighting",
    guidance:
      "Use this as lighting prompt vocabulary. Light direction, time of day, atmosphere, glow, contrast, and cinematic illumination can shape mood without obscuring the character design.",
    values: lightingSeeds,
  },
  {
    category: "Pose",
    prefix: "image_prompt_pose",
    guidance:
      "Use this as pose prompt vocabulary. Poses should support readable character attitude, romance tension, action, or softness while avoiding rigid staging or unsafe body distortion.",
    values: poseSeeds,
  },
  {
    category: "Camera Framing",
    prefix: "image_prompt_camera",
    guidance:
      "Use this as camera and composition vocabulary. Framing can guide crop, angle, depth, orientation, and composition without cutting off important character-card details.",
    values: cameraFramingSeeds,
  },
  {
    category: "Art Style",
    prefix: "image_prompt_art_style",
    guidance:
      "Use this as art-style prompt vocabulary. Style tags can guide medium, rendering feel, genre look, and illustration mode without copying a living artist or locked brand style.",
    values: artStyleSeeds,
  },
  {
    category: "Material & Texture",
    prefix: "image_prompt_material",
    guidance:
      "Use this as material and texture vocabulary. Fabric, metal, stone, wood, mist, rain, smoke, and magical surfaces can add tactile detail without crowding the image.",
    values: materialTextureSeeds,
  },
  {
    category: "Environment Tag",
    prefix: "image_prompt_environment",
    guidance:
      "Use this as environment prompt vocabulary. Settings should support story context, genre, atmosphere, and character presence while keeping the subject legible.",
    values: environmentTagSeeds,
  },
  {
    category: "Image Mood",
    prefix: "image_prompt_mood",
    guidance:
      "Use this as image mood vocabulary. Mood tags can guide emotional tone, romance pressure, vulnerability, danger, comfort, elegance, isolation, and home-feeling without forcing story outcomes.",
    values: imagePromptMoodSeeds,
  },
  {
    category: "Image Quality",
    prefix: "image_prompt_quality",
    guidance:
      "Use this as image quality vocabulary. Quality tags should support clean, expressive, detailed, polished, character-card-ready output without overloading prompts with redundant adjectives.",
    values: imagePromptQualitySeeds,
  },
  {
    category: "Negative Prompt",
    prefix: "image_prompt_negative",
    guidance:
      "Use this as negative-prompt quality control. It should suppress rendering artefacts, text, watermarks, duplicate characters, inconsistent style, and readability issues without shaming bodies or limiting safe variation.",
    values: negativePromptSeeds,
  },
  {
    category: "High-Value Image Seed",
    prefix: "image_prompt_high_value",
    guidance:
      "Use this as a high-signal image prompt seed for character-card portraits, reference images, style presets, scene art, visual routing, and prompt search.",
    values: highValueImagePromptSeeds,
  },
] satisfies readonly ImagePromptVocabSeedGroup[]);

function normalizeReadableImagePromptVocabValue(value: string): string {
  const readable = value.includes("_") ? value.replace(/_/g, " ") : value;

  return readable
    .replace(/\b[Cc]ozy\b/g, (match) => (match === "Cozy" ? "Cosy" : "cosy"))
    .replace(/\b[Aa]rmor\b/g, (match) => (match === "Armor" ? "Armour" : "armour"))
    .replace(/\b[Jj]ewelry\b/g, (match) =>
      match === "Jewelry" ? "Jewellery" : "jewellery",
    )
    .replace(/\b[Ww]atercolor\b/g, (match) =>
      match === "Watercolor" ? "Watercolour" : "watercolour",
    )
    .replace(/\b[Cc]olor(s?)\b/g, (match, plural: string) => {
      const replacement = plural ? "colours" : "colour";
      return match[0] === "C"
        ? `${replacement.charAt(0).toUpperCase()}${replacement.slice(1)}`
        : replacement;
    })
    .replace(/\b[Cc]entered\b/g, (match) =>
      match === "Centered" ? "Centred" : "centred",
    )
    .replace(/\b[Ss]ci fi\b/g, (match) => (match[0] === "S" ? "Sci-Fi" : "sci-fi"))
    .replace(/\s+/g, " ")
    .trim();
}

function slugifyImagePromptVocab(value: string) {
  return value
    .toLowerCase()
    .replace(/\{\{user\}\}'s/g, "user_s")
    .replace(/\{\{user\}\}/g, "user")
    .replace(/&/g, " and ")
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function makeImagePromptVocabPreset(
  group: ImagePromptVocabSeedGroup,
  rawValue: string,
): ImagePromptVocabPreset {
  const value = normalizeReadableImagePromptVocabValue(rawValue);

  return {
    id: `${group.prefix}_${slugifyImagePromptVocab(value)}`,
    category: group.category,
    label: value,
    value,
    triggerKeys: Array.from(
      new Set([
        rawValue,
        value,
        slugifyImagePromptVocab(value),
        ...value
          .toLowerCase()
          .split(/[^a-z0-9]+/)
          .filter((part) => part.length > 2),
      ]),
    ),
    guidance: group.guidance,
    systemPromptTags: [group.category, value],
  };
}

export const IMAGE_PROMPT_VOCAB_PRESETS = IMAGE_PROMPT_VOCAB_SEED_GROUPS.flatMap(
  (group) => group.values.map((value) => makeImagePromptVocabPreset(group, value)),
);

export const IMAGE_PROMPT_VOCABULARY_SEEDS = Object.freeze(
  IMAGE_PROMPT_VOCAB_PRESETS.map((preset) =>
    createVocabularySeedFromPresetLike(preset, {
      examples: [
        `Use ${preset.value} as image prompt vocabulary.`,
        preset.guidance,
      ],
      tags: ["image", "visual_prompt", preset.category],
      scenarioHooks:
        preset.category === "Environment Tag" || preset.category === "Image Mood"
          ? [preset.value]
          : [],
      metadata: {
        rarity: preset.category === "High-Value Image Seed" ? "uncommon" : "common",
        romanceValue: imagePromptRomanceValue(preset.category),
        conflictPotential:
          preset.category === "Negative Prompt" || preset.category === "Image Quality"
            ? 1
            : 3,
      },
    }),
  ),
) satisfies readonly VocabularySeedPreset[];

export const IMAGE_PROMPT_VOCAB_PRESET_CATEGORIES = Array.from(
  new Set(IMAGE_PROMPT_VOCAB_PRESETS.map((preset) => preset.category)),
).sort();

function imagePromptRomanceValue(category: ImagePromptVocabPresetCategory): number {
  if (["Image Prompt Preset", "Image Mood", "Pose"].includes(category)) {
    return 7;
  }

  if (["Appearance Tag", "Lighting", "Environment Tag"].includes(category)) {
    return 6;
  }

  return 4;
}

export const getImagePromptVocabPresetsByCategory = (
  category: ImagePromptVocabPresetCategory,
) => IMAGE_PROMPT_VOCAB_PRESETS.filter((preset) => preset.category === category);

export const findImagePromptVocabPresetById = (id: string) =>
  IMAGE_PROMPT_VOCAB_PRESETS.find((preset) => preset.id === id);

export const compileImagePromptVocabPresetAdditions = (
  preset: ImagePromptVocabPreset,
): CompiledImagePromptVocabPresetAdditions => {
  const isNegativePrompt = preset.category === "Negative Prompt";

  return {
    imagePromptAddition: isNegativePrompt
      ? ""
      : `Image prompt vocabulary: ${preset.value}. ${preset.guidance}`,
    negativePromptAddition: isNegativePrompt
      ? `Negative prompt vocabulary: ${preset.value}. ${preset.guidance}`
      : "",
    systemPromptAddition: [
      `Treat ${preset.value} as ${isNegativePrompt ? "negative" : "positive"} image prompt vocabulary.`,
      "Use image prompt tags for visual routing, portrait prompts, reference sheets, scene art, and card-library search without changing the authored character or live chat context.",
      "Keep prompts consent-aware, adult-safe, non-instructional, and free of artist-copying; negative prompt seeds are quality controls, not character traits.",
    ].join(" "),
  };
};
