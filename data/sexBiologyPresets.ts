export type SexBiologyPresetCategory =
  | "Archetype"
  | "Sex"
  | "Biological Classification"
  | "Reproductive Type"
  | "Fantasy Biology"
  | "Sci-Fi Biology"
  | "Social Context"
  | "Lineage"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface SexBiologyPreset {
  id: string;
  category: SexBiologyPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledSexBiologyPresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface SexBiologySeedGroup {
  category: SexBiologyPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const SEX_BIOLOGY_GUIDANCE =
  "Use this as sex and biology texture. Biology, species traits, reproductive context, privacy, lineage, and social assumptions may shape lore without replacing gender identity, personality, consent, or {{user}} agency.";

const SEX_BIOLOGY_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "sex_biology_archetype",
    guidance: SEX_BIOLOGY_GUIDANCE,
    values: [
      "Male",
      "Female",
      "Intersex",
      "Sex Unknown",
      "Sex Not Disclosed",
      "Artificially Constructed",
      "Synthetic",
      "Engineered",
      "Shapeshifter Variable Sex",
      "Alien Reproductive Type",
      "Magical Sex Variant",
      "Dual-Sex Species",
      "Asexual Reproductive Species",
      "Parthenogenetic Species",
      "Hermaphroditic Species",
      "Sexless Species",
      "Custom Fantasy Biology",
      "Custom Sci-Fi Biology",
      "Species-Dependent",
      "Variable Biology",
    ],
  },
  {
    category: "Sex",
    prefix: "sex_biology_seed",
    guidance:
      "Use this as biological sex context. Sex should remain separate from gender identity and should only matter when privacy, species lore, medical context, or worldbuilding makes it relevant.",
    values: [
      "male",
      "female",
      "intersex",
      "sex unknown",
      "sex undisclosed",
      "sexless",
      "hermaphroditic",
      "dual-sex",
      "variable sex",
      "species-specific sex",
      "engineered sex",
      "synthetic sex",
      "artificial biology",
      "alien biology",
      "magical biology",
      "reproductive variant",
      "nonhuman sex",
      "mutable biology",
      "shifting biology",
      "custom biology",
    ],
  },
  {
    category: "Biological Classification",
    prefix: "sex_biology_classification",
    guidance:
      "Use this as biological classification texture. Classification can support species lore, medical records, or sci-fi/fantasy taxonomy without reducing the character to a body type.",
    values: [
      "human male",
      "human female",
      "human intersex",
      "android male model",
      "android female model",
      "android neutral model",
      "alien male analogue",
      "alien female analogue",
      "alien nonbinary biology",
      "fae variable biology",
      "angelic biology",
      "demonic biology",
      "shifter variable sex",
      "vampiric biology",
      "dragon biology",
      "construct biology",
      "spirit biology",
      "energy-based biology",
      "clone biology",
      "genetically modified biology",
    ],
  },
  {
    category: "Reproductive Type",
    prefix: "sex_biology_reproductive_type",
    guidance:
      "Use this as reproductive worldbuilding texture. Reproductive details should remain optional, private, species-aware, and never treated as the character's whole purpose.",
    values: [
      "sexual reproduction",
      "asexual reproduction",
      "parthenogenesis",
      "spore reproduction",
      "cloning reproduction",
      "magical reproduction",
      "artificial creation",
      "laboratory creation",
      "divine creation",
      "summoned existence",
      "egg laying",
      "live birth",
      "hybrid reproduction",
      "bond-based reproduction",
      "species-specific reproduction",
      "unknown reproduction",
      "non-reproductive",
      "sterile",
      "fertile",
      "conditional fertility",
    ],
  },
  {
    category: "Fantasy Biology",
    prefix: "sex_biology_fantasy",
    guidance:
      "Use this as fantasy biology texture. Magic, species, form, curses, blessings, and ancient lineage may shape lore while preserving choice and privacy.",
    values: [
      "fae biology",
      "angelic biology",
      "demonic biology",
      "dragon biology",
      "shifter biology",
      "vampiric biology",
      "merfolk biology",
      "spirit biology",
      "monster biology",
      "godly biology",
      "divine duality",
      "moon-dependent biology",
      "seasonal biology",
      "magic-shaped biology",
      "true form variable",
      "glamour modified",
      "ancient species biology",
      "hybrid species",
      "cursed biology",
      "blessed biology",
    ],
  },
  {
    category: "Sci-Fi Biology",
    prefix: "sex_biology_scifi",
    guidance:
      "Use this as sci-fi biology texture. Engineered, synthetic, alien, cloned, posthuman, or adaptive biology should support personhood and worldbuilding, not objectification.",
    values: [
      "engineered biology",
      "clone biology",
      "synthetic biology",
      "android framework",
      "cybernetic biology",
      "gene modified",
      "alien reproductive system",
      "laboratory designed",
      "terraform adapted",
      "space-adapted biology",
      "posthuman biology",
      "nanotech modified",
      "designer genetics",
      "vat grown",
      "replicant biology",
      "bioengineered variant",
      "xenobiological type",
      "adaptive biology",
      "artificial womb origin",
      "custom genome",
    ],
  },
  {
    category: "Social Context",
    prefix: "sex_biology_social_context",
    guidance:
      "Use this as social context texture. Sex may be private, protected, misunderstood, politically significant, irrelevant, or separate from gender depending on the world and character.",
    values: [
      "sex publicly known",
      "sex privately known",
      "sex irrelevant to identity",
      "sex culturally significant",
      "sex politically significant",
      "sex hidden",
      "sex misunderstood",
      "sex assumed incorrectly",
      "sex documented",
      "sex classified",
      "sex unrecorded",
      "sex protected information",
      "sex used for lineage",
      "sex used for succession",
      "sex used for species role",
      "sex not socially relevant",
      "sex separate from gender",
      "sex and gender aligned",
      "sex and gender different",
      "sex context dependent",
    ],
  },
  {
    category: "Lineage",
    prefix: "sex_biology_lineage",
    guidance:
      "Use this as lineage texture. Bloodline, inheritance, legacy, or family expectation may matter socially without overriding chosen family, consent, or self-definition.",
    values: [
      "patrilineal expectations",
      "matrilineal expectations",
      "lineage irrelevant",
      "heir biology significant",
      "bloodline significant",
      "dynastic expectations",
      "species reproductive role",
      "magical bloodline",
      "genetic legacy",
      "clone lineage",
      "constructed without lineage",
      "unknown parentage",
      "hybrid lineage",
      "royal bloodline",
      "sacred bloodline",
      "forbidden bloodline",
      "artificial lineage",
      "chosen family over lineage",
      "legacy pressure",
      "inheritance expectations",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "sex_biology_dialogue",
    guidance:
      "Use this as optional dialogue flavour. Dialogue seeds should feel earned by the scene, not pasted in as fixed lines.",
    values: [
      "My biology is only one part of who I am.",
      "People make assumptions when they learn that.",
      "Let them. They are rarely as interesting as the truth.",
      "Our species does not think about sex the way humans do.",
      "That sounds complicated.",
      "Only from the outside.",
      "Bloodlines matter where I come from.",
      "Do they matter to you?",
      "Less than the person standing in front of me.",
      "You keep asking what I am.",
      "I am more interested in who you are.",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "sex_biology_high_value",
    guidance:
      "Use this as a high-signal sex and biology seed. These are compact selectors for character creation, matching, and preset search.",
    values: [
      "male",
      "female",
      "intersex",
      "sexless",
      "variable sex",
      "species-specific sex",
      "human male",
      "human female",
      "human intersex",
      "alien biology",
      "engineered biology",
      "clone biology",
      "shifter variable sex",
      "sex separate from gender",
      "bloodline significant",
      "hybrid lineage",
      "custom biology",
      "magical biology",
      "synthetic biology",
      "posthuman biology",
    ],
  },
] satisfies readonly SexBiologySeedGroup[]);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const makePreset = (
  group: SexBiologySeedGroup,
  value: string,
): SexBiologyPreset => ({
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

export const SEX_BIOLOGY_PRESETS = SEX_BIOLOGY_SEED_GROUPS.flatMap((group) =>
  group.values.map((value) => makePreset(group, value)),
);

export const SEX_BIOLOGY_PRESET_CATEGORIES = Array.from(
  new Set(SEX_BIOLOGY_PRESETS.map((preset) => preset.category)),
).sort();

export const getSexBiologyPresetsByCategory = (
  category: SexBiologyPresetCategory,
) => SEX_BIOLOGY_PRESETS.filter((preset) => preset.category === category);

export const findSexBiologyPresetById = (id: string) =>
  SEX_BIOLOGY_PRESETS.find((preset) => preset.id === id);

export const compileSexBiologyPresetAdditions = (
  preset: SexBiologyPreset,
): CompiledSexBiologyPresetAdditions => ({
  backgroundAddition: `Sex and biology context: ${preset.value}. ${preset.guidance}`,
  personalityAddition: `Sex and biology texture may include ${preset.value} without replacing the character's gender identity, full personality, privacy, contradictions, boundaries, responsibilities, flaws, or growth.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft sex and biology context.`,
    "Let biology, species traits, reproductive context, lineage, privacy, medical or social records, and worldbuilding shape behaviour only when relevant.",
    "Keep gender identity, consent, privacy, boundaries, personhood, and {{user}} autonomy intact; biology should never be treated as destiny or the whole character.",
  ].join(" "),
});
