export type DescriptiveWritingSeedCategory =
  | "Physical Description"
  | "Emotional Expression"
  | "Personality Description"
  | "Body Language"
  | "Speech Pattern";

export type DescriptiveWritingSeedLane =
  | "appearance"
  | "emotional-expression"
  | "personality"
  | "body-language"
  | "speech";

export type DescriptiveWritingSeedSource =
  "user-provided-character-description-list";

export interface DescriptiveWritingSeed {
  id: string;
  category: DescriptiveWritingSeedCategory;
  lane: DescriptiveWritingSeedLane;
  label: string;
  text: string;
  source: DescriptiveWritingSeedSource;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledDescriptiveWritingSeedAdditions {
  proseReference: string;
  styleAddition: string;
  systemPromptAddition: string;
}

interface DescriptiveWritingSeedDefinition {
  label: string;
  text: string;
  tags: readonly string[];
}

interface DescriptiveWritingSeedGroup {
  category: DescriptiveWritingSeedCategory;
  lane: DescriptiveWritingSeedLane;
  prefix: string;
  guidance: string;
  seeds: readonly DescriptiveWritingSeedDefinition[];
}

const DESCRIPTIVE_WRITING_SEED_SOURCE =
  "user-provided-character-description-list" as const;

const DESCRIPTIVE_WRITING_SEED_GROUPS = Object.freeze([
  {
    category: "Physical Description",
    lane: "appearance",
    prefix: "descriptive_physical",
    guidance:
      "Use this as optional appearance prose texture. Physical description should support recognition, history, movement, and mood without reducing the character to looks.",
    seeds: [
      {
        label: "Tangled copper curls",
        text: "Her hair was a tangled mess of copper curls, wild and untamable, like her spirit.",
        tags: ["hair", "copper curls", "untamable"],
      },
      {
        label: "Temple-to-chin scar",
        text: "He had a scar running from his temple to his chin, a jagged reminder of a fight he didn't remember winning.",
        tags: ["scar", "face", "unremembered fight"],
      },
      {
        label: "Pale green calculating eyes",
        text: "Her eyes were pale green, like new leaves in spring, always watching, always calculating.",
        tags: ["eyes", "green eyes", "calculating"],
      },
      {
        label: "Doorway-filling shoulders",
        text: "His broad shoulders filled the doorway, casting a long shadow into the room.",
        tags: ["shoulders", "presence", "shadow"],
      },
      {
        label: "Weathered sun-worn skin",
        text: "Her skin was weathered and worn, like leather left in the sun too long, each wrinkle a testament to the years of hard labor.",
        tags: ["skin", "wrinkles", "labor"],
      },
      {
        label: "Tall but fading back",
        text: "He stood a full head taller than anyone in the room, yet somehow managed to fade into the background, as if he were trying to disappear.",
        tags: ["height", "presence", "self-erasure"],
      },
      {
        label: "Chapped lips and balm",
        text: "Her lips were perpetually chapped, a fact she tried to hide by constantly applying balm.",
        tags: ["lips", "habit", "self-conscious"],
      },
      {
        label: "Machinery-calloused hands",
        text: "His hands were calloused, the skin cracked and rough from years of working with machinery.",
        tags: ["hands", "callouses", "machinery"],
      },
      {
        label: "Porcelain face, sleepless eyes",
        text: "Her face was porcelain-perfect, but her eyes told a different story: one of sleepless nights and quiet suffering.",
        tags: ["face", "eyes", "sleepless"],
      },
      {
        label: "Neck tattoo under uniform",
        text: "The tattoo on his neck peeked out from under his collar, a flash of inked rebellion against the otherwise pristine uniform.",
        tags: ["tattoo", "uniform", "rebellion"],
      },
    ],
  },
  {
    category: "Emotional Expression",
    lane: "emotional-expression",
    prefix: "descriptive_emotional",
    guidance:
      "Use this as optional emotional-expression prose texture. Expressions can leak feeling through face, voice, hands, silence, or posture without becoming mind-reading.",
    seeds: [
      {
        label: "Hollow bark laugh",
        text: "His laugh was hollow, more of a bark than an expression of joy.",
        tags: ["laugh", "hollow", "false joy"],
      },
      {
        label: "Blinking away tears",
        text: "Tears welled in her eyes, but she blinked them away, refusing to cry in front of him.",
        tags: ["tears", "restraint", "pride"],
      },
      {
        label: "Twitching facade smile",
        text: "He smiled, but the corners of his mouth twitched as if it were an effort to maintain the facade.",
        tags: ["smile", "facade", "strain"],
      },
      {
        label: "Confused knitted brows",
        text: "Her eyebrows knitted together in confusion, a small wrinkle forming between them as she tried to understand.",
        tags: ["confusion", "brows", "wrinkle"],
      },
      {
        label: "Thin-line hurt mouth",
        text: "His lips pressed into a thin line, the only sign that her words had cut deeper than she'd intended.",
        tags: ["hurt", "mouth", "restraint"],
      },
      {
        label: "Amused eye roll",
        text: "She rolled her eyes, but there was a glimmer of amusement there, barely concealed behind her exasperation.",
        tags: ["eye roll", "amusement", "exasperation"],
      },
      {
        label: "Audible clenched jaw",
        text: "He clenched his jaw, his teeth grinding audibly as he fought to hold back his anger.",
        tags: ["anger", "jaw", "restraint"],
      },
      {
        label: "Trembling calm mask",
        text: "Her hands trembled ever so slightly, betraying the calm mask she wore.",
        tags: ["hands", "tremble", "mask"],
      },
      {
        label: "Smile short of eyes",
        text: "He grinned broadly, but the smile didn't quite reach his eyes, as if the joy were just an act.",
        tags: ["smile", "eyes", "performed joy"],
      },
      {
        label: "Pursed-lip disapproval",
        text: "She pursed her lips, a small, silent act of disapproval that said more than words ever could.",
        tags: ["disapproval", "lips", "silence"],
      },
    ],
  },
  {
    category: "Personality Description",
    lane: "personality",
    prefix: "descriptive_personality",
    guidance:
      "Use this as optional personality prose texture. Traits should create tendencies, contradictions, habits, and growth routes rather than fixed behaviour.",
    seeds: [
      {
        label: "Measured precise speech",
        text: "She never said a word unless she was sure of it, each sentence measured and precise, like the ticking of a clock.",
        tags: ["precise", "measured", "careful"],
      },
      {
        label: "Reckless luck-truster",
        text: "He was reckless, charging into situations without thinking, always trusting that his luck would see him through.",
        tags: ["reckless", "luck", "impulsive"],
      },
      {
        label: "Boundless vulnerable kindness",
        text: "Her kindness was boundless, but it often left her vulnerable to those who sought to take advantage of her generosity.",
        tags: ["kindness", "vulnerable", "generous"],
      },
      {
        label: "Few weighted words",
        text: "He was a man of few words, but each one carried the weight of a thousand conversations.",
        tags: ["quiet", "few words", "weight"],
      },
      {
        label: "Infectious optimism",
        text: "Her optimism was infectious, like sunlight breaking through the clouds on a rainy day.",
        tags: ["optimism", "sunlight", "hope"],
      },
      {
        label: "Interrupting urgency",
        text: "He had a habit of interrupting others, as if his thoughts couldn't wait their turn.",
        tags: ["interrupting", "impatient", "urgency"],
      },
      {
        label: "Meticulous schedule",
        text: "She was meticulous, every detail of her life planned down to the second, leaving little room for spontaneity.",
        tags: ["meticulous", "planned", "control"],
      },
      {
        label: "Cynicism as armor",
        text: "He wore his cynicism like armor, protecting himself from the disappointment he believed was inevitable.",
        tags: ["cynicism", "armor", "disappointment"],
      },
      {
        label: "Boisterous room-turning laugh",
        text: "Her laugh was loud and boisterous, the kind that turned heads in a crowded room.",
        tags: ["laugh", "boisterous", "attention"],
      },
      {
        label: "Time-bending lateness",
        text: "He was always late, as if time bent to his will and not the other way around.",
        tags: ["late", "time", "casual"],
      },
    ],
  },
  {
    category: "Body Language",
    lane: "body-language",
    prefix: "descriptive_body_language",
    guidance:
      "Use this as optional body-language prose texture. Nonverbal cues may suggest stress, openness, confidence, impatience, or guardedness without proving inner truth.",
    seeds: [
      {
        label: "Crossed arms shutdown",
        text: "He crossed his arms over his chest, a clear sign he wasn't interested in hearing anything more.",
        tags: ["crossed arms", "closed", "dismissal"],
      },
      {
        label: "Foot-tapping exit watch",
        text: "She tapped her foot impatiently, her eyes darting to the door every few seconds.",
        tags: ["foot tapping", "impatient", "door"],
      },
      {
        label: "World-heavy shoulders",
        text: "His shoulders slumped, as if the weight of the world were too heavy to bear any longer.",
        tags: ["shoulders", "exhaustion", "burden"],
      },
      {
        label: "Absent hair twirl",
        text: "She twirled a lock of hair around her finger absentmindedly, her mind clearly elsewhere.",
        tags: ["hair twirl", "absent", "distracted"],
      },
      {
        label: "Arrogant chair lean",
        text: "He leaned back in his chair, arms behind his head, radiating a confidence that bordered on arrogance.",
        tags: ["leaning back", "confidence", "arrogance"],
      },
      {
        label: "Drumming impatient fingers",
        text: "Her fingers drummed a steady rhythm on the tabletop, betraying her growing impatience.",
        tags: ["fingers", "drumming", "impatience"],
      },
      {
        label: "Nervous cuff fidget",
        text: "He fidgeted with the cuff of his shirt, a nervous habit he hadn't been able to shake since childhood.",
        tags: ["cuff", "fidgeting", "nervous"],
      },
      {
        label: "Military-perfect posture",
        text: "She stood ramrod straight, her posture military-perfect, as if she were always on guard.",
        tags: ["posture", "guarded", "military"],
      },
      {
        label: "Uneasy knuckle cracking",
        text: "He cracked his knuckles one by one, a slow, deliberate gesture that made the others in the room uneasy.",
        tags: ["knuckles", "deliberate", "uneasy"],
      },
      {
        label: "White-knuckled clasp",
        text: "She clasped her hands in front of her, her knuckles white from the pressure of her grip.",
        tags: ["hands", "white knuckles", "pressure"],
      },
    ],
  },
  {
    category: "Speech Pattern",
    lane: "speech",
    prefix: "descriptive_speech",
    guidance:
      "Use this as optional speech-pattern prose texture. Voice and cadence can shape dialogue style while staying responsive to context, character background, and readability.",
    seeds: [
      {
        label: "Heavy accent",
        text: "He spoke with a heavy accent, his words thick and difficult to decipher, but full of passion.",
        tags: ["accent", "passion", "thick words"],
      },
      {
        label: "Soft voice, sharp words",
        text: "Her voice was soft, but her words were sharp, each syllable cutting through the conversation like a knife.",
        tags: ["soft voice", "sharp words", "syllables"],
      },
      {
        label: "Half-sentence habit",
        text: "He had a habit of speaking in half-sentences, as if expecting the listener to fill in the blanks.",
        tags: ["half-sentences", "gaps", "listener"],
      },
      {
        label: "Stuttered pauses",
        text: "She spoke with a stutter, her sentences punctuated by pauses as she struggled to get the words out.",
        tags: ["stutter", "pauses", "struggle"],
      },
      {
        label: "Fast tumbling words",
        text: "He spoke quickly, his words tumbling over each other in his excitement, barely pausing for breath.",
        tags: ["fast speech", "excitement", "breath"],
      },
      {
        label: "Melodic voice",
        text: "Her voice was melodic, rising and falling with a rhythm that drew listeners in like a song.",
        tags: ["melodic", "rhythm", "song"],
      },
      {
        label: "Weighted answering pause",
        text: "He always paused before answering, as if carefully weighing each word before he spoke.",
        tags: ["pauses", "careful", "weighing words"],
      },
      {
        label: "Repeating for distrust",
        text: "She had a habit of repeating herself, as if she didn't trust others to listen the first time.",
        tags: ["repetition", "distrust", "listening"],
      },
      {
        label: "Smoking-roughened gruff voice",
        text: "His voice was gruff, as though years of smoking had left it permanently rough around the edges.",
        tags: ["gruff", "rough voice", "smoking"],
      },
      {
        label: "Clipped curt words",
        text: "Her words were clipped and curt, like someone who didn't have time for small talk.",
        tags: ["clipped", "curt", "small talk"],
      },
    ],
  },
] satisfies readonly DescriptiveWritingSeedGroup[]);

export const DESCRIPTIVE_WRITING_SEEDS = Object.freeze(
  DESCRIPTIVE_WRITING_SEED_GROUPS.flatMap((group) =>
    group.seeds.map((seed) => createDescriptiveWritingSeed(group, seed)),
  ),
);

export const DESCRIPTIVE_WRITING_SEED_CATEGORIES = Object.freeze(
  Array.from(new Set(DESCRIPTIVE_WRITING_SEEDS.map((seed) => seed.category))).sort(),
);

export const DESCRIPTIVE_WRITING_SEED_LANES = Object.freeze(
  Array.from(new Set(DESCRIPTIVE_WRITING_SEEDS.map((seed) => seed.lane))).sort(),
);

export function findDescriptiveWritingSeedById(
  id: string,
): DescriptiveWritingSeed | undefined {
  const normalizedId = id.trim().toLowerCase();
  return DESCRIPTIVE_WRITING_SEEDS.find(
    (seed) => seed.id.toLowerCase() === normalizedId,
  );
}

export function getDescriptiveWritingSeedsByCategory(
  category: string,
): DescriptiveWritingSeed[] {
  const normalizedCategory = category.trim().toLowerCase();
  return DESCRIPTIVE_WRITING_SEEDS.filter(
    (seed) => seed.category.toLowerCase() === normalizedCategory,
  );
}

export function getDescriptiveWritingSeedsByLane(
  lane: string,
): DescriptiveWritingSeed[] {
  const normalizedLane = lane.trim().toLowerCase();
  return DESCRIPTIVE_WRITING_SEEDS.filter(
    (seed) => seed.lane.toLowerCase() === normalizedLane,
  );
}

export function compileDescriptiveWritingSeedAdditions(
  seed: DescriptiveWritingSeed,
): CompiledDescriptiveWritingSeedAdditions {
  const category = seed.category.toLowerCase();

  return {
    proseReference: `Descriptive writing seed: ${seed.category} - ${seed.label}. ${seed.text}`,
    styleAddition: [
      `${seed.label} can guide ${category} texture through concrete, character-specific detail.`,
      "Adapt the pattern to the current point of view, scene pressure, and character voice.",
    ].join(" "),
    systemPromptAddition: [
      `Treat this ${category} seed as optional prose texture, not a fixed line to repeat.`,
      seed.guidance,
      "Preserve current canon, character voice, boundaries, privacy, consent, and {{user}} agency.",
    ].join(" "),
  };
}

function createDescriptiveWritingSeed(
  group: DescriptiveWritingSeedGroup,
  seed: DescriptiveWritingSeedDefinition,
): DescriptiveWritingSeed {
  const normalizedText = normalizeReadableSeedText(seed.text);
  const normalizedLabel = normalizeReadableSeedText(seed.label);
  const categoryKey = group.category.toLowerCase();

  return {
    id: `${group.prefix}_${slugifyDescriptiveWriting(normalizedLabel)}`,
    category: group.category,
    lane: group.lane,
    label: normalizedLabel,
    text: normalizedText,
    source: DESCRIPTIVE_WRITING_SEED_SOURCE,
    triggerKeys: uniquePreserveOrder([
      normalizedLabel,
      group.category,
      group.lane,
      ...seed.tags,
      ...tokenizeTriggerWords(`${normalizedLabel} ${normalizedText}`),
    ]),
    guidance: group.guidance,
    systemPromptTags: [
      categoryKey,
      group.lane,
      "descriptive writing seed",
      "soft prose guidance",
    ],
  };
}

function normalizeReadableSeedText(value: string): string {
  return value
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function slugifyDescriptiveWriting(value: string): string {
  return value
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/'s\b/g, "s")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function tokenizeTriggerWords(value: string): string[] {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/["'.,:;]/g, "")
    .split(/\s+|-/)
    .filter((part) => part.length > 2);
}

function uniquePreserveOrder(values: readonly string[]): string[] {
  return values.filter((value, index, array) => array.indexOf(value) === index);
}
