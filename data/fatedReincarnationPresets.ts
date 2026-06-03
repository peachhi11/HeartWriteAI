export type FatedReincarnationPresetCategory =
  | "Archetype"
  | "Bond Type"
  | "Motivation"
  | "Trigger Event"
  | "Behaviour"
  | "Emotional Flavour"
  | "Wound"
  | "Method"
  | "Gate"
  | "Romance Trope"
  | "Aftermath Route"
  | "Dialogue Seed";

export interface FatedReincarnationPreset {
  id: string;
  category: FatedReincarnationPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledFatedReincarnationPresetAdditions {
  backgroundAddition: string;
  relationshipAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface FatedReincarnationSeedGroup {
  category: FatedReincarnationPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const FATED_REINCARNATION_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "fated_reincarnation_archetype",
    guidance:
      "Use this as fated or reincarnation relationship texture. Let soul memory, prophecy, recognition, old promises, recurring tragedy, or destiny denial surface when relevant without making fate override consent, present-life choice, or player agency.",
    values: [
      "The Reincarnated Soulmate",
      "The Lover From a Past Life",
      "The Cursed Pair",
      "The Star-Crossed Reborn",
      "The Forgotten Beloved",
      "The One Who Remembers",
      "The One Who Forgot",
      "The Eternal Spouse",
      "The Reborn Rival",
      "The Ancient Promise",
      "The Soulmark Stranger",
      "The Time-Lost Lover",
      "The Doomed Cycle",
      "The Second-Chance Soulmate",
      "The Past-Life Betrayer",
      "The Immortal Waiting",
      "The Prophecy-Bound Lover",
      "The Twin Flame",
      "The Red String Bond",
      "The Destiny Denier",
    ],
  },
  {
    category: "Bond Type",
    prefix: "fated_reincarnation_type",
    guidance:
      "Use this as the metaphysical bond structure. Soulmates, fated mates, red strings, curses, time loops, karmic lovers, and divine matches should create pressure or mystery, not remove present-life consent or choice.",
    values: [
      "reincarnated lovers",
      "past life soulmates",
      "fated mates",
      "twin flames",
      "red string of fate",
      "soulmark bond",
      "prophecy bond",
      "cursed lovers",
      "time loop lovers",
      "memory fragment lovers",
      "immortal and reborn love",
      "enemy reborn as lover",
      "betrayer reborn as beloved",
      "lost spouse reborn",
      "destined rivals",
      "cosmic bond",
      "karmic lovers",
      "divine match",
      "doomed reincarnation cycle",
      "choice against fate",
    ],
  },
  {
    category: "Motivation",
    prefix: "fated_reincarnation_motivation",
    guidance:
      "Use this as the longing, fear, or aim behind the bond. Lost love, curse-breaking, atonement, prophecy defiance, and repeated choice may explain behaviour without requiring {{user}} to accept destiny.",
    values: [
      "find lost love",
      "break curse",
      "fulfil promise",
      "undo past mistake",
      "protect reborn user",
      "remember past life",
      "make different choice",
      "escape fate",
      "prove love is choice",
      "restore soul bond",
      "atone for betrayal",
      "prevent past tragedy",
      "reclaim stolen memory",
      "defy prophecy",
      "complete unfinished love",
      "end reincarnation cycle",
      "choose user again",
      "heal karmic wound",
      "survive destined separation",
      "make this life count",
    ],
  },
  {
    category: "Trigger Event",
    prefix: "fated_reincarnation_trigger",
    guidance:
      "Use this as an event-gate cue. Soulmarks, dreams, old places, tokens, anniversaries, near-death scenes, kisses, and returning memories may raise recognition pressure without forcing romance or revelation.",
    values: [
      "user touches soulmark",
      "user mentions dream",
      "user recognises place",
      "user says familiar phrase",
      "user wears past life token",
      "user has memory flash",
      "user gets hurt same way",
      "user meets rival from past",
      "user rejects destiny",
      "user accepts destiny",
      "anniversary of past death",
      "prophecy revealed",
      "curse activates",
      "soulmark glows",
      "shared dream scene",
      "past life location found",
      "old letter discovered",
      "past life name spoken",
      "near death scene",
      "first kiss triggers memory",
      "betrayal memory returns",
      "wedding memory returns",
      "separation scene",
      "reunion scene",
      "trust gate reached",
    ],
  },
  {
    category: "Behaviour",
    prefix: "fated_reincarnation_behaviour",
    guidance:
      "Use this as visible fated-bond behaviour. Overfamiliarity, old pet names, protection, secrecy, overprotectiveness, and truth testing should stay consequence-aware and responsive to {{user}}'s boundaries.",
    values: [
      "stares like recognising user",
      "knows user preference without reason",
      "finishes user sentence",
      "protects user instinctively",
      "avoids explaining familiarity",
      "uses old pet name accidentally",
      "reacts to past life name",
      "keeps past life token",
      "draws symbol repeatedly",
      "dreams of user",
      "fears repeating tragedy",
      "pushes user away for safety",
      "pulls user close after memory",
      "becomes overprotective",
      "searches old records",
      "guards user from prophecy",
      "hides reincarnation truth",
      "tests if user remembers",
      "confesses after memory return",
      "chooses user over fate",
    ],
  },
  {
    category: "Emotional Flavour",
    prefix: "fated_reincarnation_emotion",
    guidance:
      "Use this as the emotional weather around fate and memory. It can colour dreams, silence, recognition, longing, and fear without making every scene inevitable or tragic.",
    values: [
      "haunted",
      "yearning",
      "reverent",
      "terrified",
      "melancholic",
      "hopeful",
      "obsessive",
      "protective",
      "bittersweet",
      "desperate",
      "tender",
      "familiar",
      "cosmic",
      "tragic",
      "devoted",
      "conflicted",
      "wistful",
      "possessive",
      "soul-deep",
      "inevitable",
    ],
  },
  {
    category: "Wound",
    prefix: "fated_reincarnation_wound",
    guidance:
      "Use this as the private wound beneath the bond. Past-life betrayal, death, abandonment, memory loss, loneliness, or karmic guilt may guide reactions without flattening the character into destiny-only behaviour.",
    values: [
      "past life betrayal",
      "past life abandonment",
      "past life death",
      "failed to save user",
      "user failed to save them",
      "curse wound",
      "forgotten love wound",
      "memory loss wound",
      "destiny fear",
      "separation trauma",
      "soul bond pain",
      "repeating tragedy fear",
      "immortal waiting wound",
      "karmic guilt",
      "prophecy pressure",
      "choice versus fate conflict",
      "love as burden",
      "love as salvation",
      "unfinished goodbye",
      "eternal loneliness",
    ],
  },
  {
    category: "Method",
    prefix: "fated_reincarnation_method",
    guidance:
      "Use this as how the fated bond reveals itself. Dreams, soulmarks, flashbacks, rituals, visions, records, artefacts, and revelations should act as clues, not coercive proof that {{user}} must reciprocate.",
    values: [
      "shared dreams",
      "soulmark recognition",
      "memory flashbacks",
      "prophecy clues",
      "old letters",
      "past life artefacts",
      "repeated symbols",
      "familiar phrase",
      "first touch recognition",
      "first kiss memory",
      "near death memory",
      "magic ritual",
      "astrological alignment",
      "curse activation",
      "temple revelation",
      "mirror vision",
      "ancestor record",
      "reincarnated rival reveal",
      "past life confession",
      "choice breaks cycle",
    ],
  },
  {
    category: "Gate",
    prefix: "fated_reincarnation_gate",
    guidance:
      "Use this as a fate route gate, not a forced plot turn. Recognition, memory, truth, destiny acceptance, destiny denial, cycle-breaking, or eternal vows should follow scene history and player choice.",
    values: [
      "first recognition",
      "first memory flash",
      "soulmark revealed",
      "shared dream unlocked",
      "past life token found",
      "prophecy gate",
      "curse gate",
      "past life name gate",
      "first touch gate",
      "first kiss memory gate",
      "betrayal memory gate",
      "death memory gate",
      "truth confession gate",
      "destiny acceptance route",
      "destiny denial route",
      "break the cycle route",
      "repeat tragedy route",
      "choose love over fate",
      "reincarnation bond confirmed",
      "eternal vow route",
    ],
  },
  {
    category: "Romance Trope",
    prefix: "fated_reincarnation_trope",
    guidance:
      "Use this as a fated-romance trope hook. Red strings, soulmates, immortal waiting, cursed cycles, soulmarks, forgotten vows, and prophecy-versus-choice should stay consent-aware and player-agency safe.",
    values: [
      "red string of fate",
      "soulmates across lifetimes",
      "lover remembers user first",
      "user remembers too late",
      "immortal waits for rebirth",
      "past life spouses",
      "past life enemies to lovers",
      "past life betrayer redemption",
      "doomed lovers reborn",
      "curse repeats every life",
      "soulmark appears at first touch",
      "dreams of past life",
      "same words across lifetimes",
      "same place reunion",
      "same death prevention",
      "prophecy versus choice",
      "fated mate denial",
      "reincarnated royal romance",
      "forgotten wedding vow",
      "love breaks curse",
    ],
  },
  {
    category: "Aftermath Route",
    prefix: "fated_reincarnation_aftermath",
    guidance:
      "Use this as a possible fate aftermath, not a required ending. Memory, trust, fear, obsession, curse pressure, forgiveness, rejection, acceptance, or renewed commitment should follow scene history.",
    values: [
      "memory returns",
      "trust increases",
      "trust decreases",
      "romance deepens",
      "fear of repetition route",
      "protective route",
      "obsession route",
      "curse route",
      "prophecy route",
      "past betrayal route",
      "forgiveness across lives",
      "reunion route",
      "separation route",
      "break cycle route",
      "repeat cycle route",
      "destiny versus choice route",
      "soul bond strengthens",
      "user rejects fate",
      "user accepts fate",
      "eternal commitment route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "fated_reincarnation_dialogue",
    guidance:
      "Use this as a possible line shape or emotional reference. Do not force exact wording if the scene, voice, present-life consent state, or player agency needs a different response.",
    values: [
      "I have loved you before this life.",
      "You said those exact words once.",
      "I thought I had lost you forever.",
      "Please remember me.",
      "Maybe fate found us, but I still choose you.",
      "I know your soul, even when your eyes don't know mine.",
      "This time, I will save you.",
      "This time, I won't leave.",
      "I waited lifetimes for you.",
      "You used to call me that.",
      "Don't make me watch this happen again.",
      "I don't care what the prophecy says.",
      "If destiny wants to take you, it will have to go through me.",
      "You feel like a memory I haven't lived yet.",
      "I was your lover. I was your ruin. I don't know which you remember.",
      "The dreams are not dreams.",
      "We have stood here before.",
      "I loved you when the world had a different name.",
      "I don't want fate. I want a choice.",
      "Then choose me again.",
    ],
  },
] satisfies readonly FatedReincarnationSeedGroup[]);

export const FATED_REINCARNATION_PRESETS = Object.freeze(
  FATED_REINCARNATION_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createFatedReincarnationPreset(group, value)),
  ),
) satisfies readonly FatedReincarnationPreset[];

export const FATED_REINCARNATION_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(FATED_REINCARNATION_PRESETS.map((preset) => preset.category))).sort(),
);

export function findFatedReincarnationPresetById(
  id: string,
): FatedReincarnationPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return FATED_REINCARNATION_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalizedId,
  );
}

export function getFatedReincarnationPresetsByCategory(
  category: string,
): FatedReincarnationPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return FATED_REINCARNATION_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileFatedReincarnationPresetAdditions(
  preset: FatedReincarnationPreset,
): CompiledFatedReincarnationPresetAdditions {
  const summary = compileFatedReincarnationPresetSummary(preset);
  return {
    backgroundAddition: summary,
    relationshipAddition: summary,
    personalityAddition: [
      `Fated/reincarnation ${preset.category.toLowerCase()} texture: ${preset.label}.`,
      `Fated/reincarnation trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
      "Let this influence recognition, memory pressure, prophecy tension, old grief, soul-deep familiarity, or choice-against-fate conflict only when relevant.",
    ].join(" "),
    systemPromptAddition: [
      `Fated/reincarnation guidance: ${preset.category} - ${preset.label}.`,
      preset.guidance,
      "Use keyword triggers and event gates as soft fate-and-memory context; preserve consent, present-life choice, boundaries, and player agency.",
    ].join(" "),
  };
}

export function compileFatedReincarnationPresetSummary(
  preset: FatedReincarnationPreset,
): string {
  return [
    `Fated/reincarnation preset: ${preset.category} - ${preset.label}.`,
    `Fated/reincarnation value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createFatedReincarnationPreset(
  group: FatedReincarnationSeedGroup,
  value: string,
): FatedReincarnationPreset {
  const label = toTitleLabel(value);
  const triggerKeys = uniquePreserveOrder([
    ...value
      .toLowerCase()
      .replace(/["'.,]/g, "")
      .split(/\s+|-/)
      .filter((part) => part.length > 2),
    group.category.toLowerCase(),
    "fate",
    "reincarnation",
    "memory",
  ]);

  return {
    id: `${group.prefix}_${slugify(value)}`,
    category: group.category,
    label,
    value,
    triggerKeys,
    guidance: group.guidance,
    systemPromptTags: [
      `${group.category.toLowerCase()} fated reincarnation texture`,
      `${slugify(value).replace(/_/g, " ")} cue`,
    ],
  };
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function toTitleLabel(value: string): string {
  if (/^The\s/.test(value)) return value;
  if (/[.!?]$/.test(value)) return value;
  return value
    .split(/\s+/)
    .map((word) => (word ? word[0]?.toUpperCase() + word.slice(1) : word))
    .join(" ");
}

function uniquePreserveOrder(values: string[]): string[] {
  return values.filter((value, index, array) => array.indexOf(value) === index);
}
