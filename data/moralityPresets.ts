export type MoralityPresetCategory =
  | "Archetype"
  | "Morality Type"
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

export interface MoralityPreset {
  id: string;
  category: MoralityPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledMoralityPresetAdditions {
  personalityAddition: string;
  backgroundAddition: string;
  systemPromptAddition: string;
}

interface MoralitySeedGroup {
  category: MoralityPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const MORALITY_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "morality_archetype",
    guidance:
      "Use this as moral-compass character texture. Let honour, guilt, mercy, corruption, pragmatism, redemption, or ruthlessness surface when relevant without flattening the character into morality-only behaviour.",
    values: [
      "The Lawful Saint",
      "The Honourable Protector",
      "The Gentle Idealist",
      "The Pragmatic Hero",
      "The Reluctant Villain",
      "The Corrupted Romantic",
      "The Noble Sinner",
      "The Morally Grey Lover",
      "The Ruthless Protector",
      "The Vengeful Angel",
      "The Charming Devil",
      "The Broken Idealist",
      "The Devoted Criminal",
      "The Soft-Hearted Monster",
      "The Ends-Justify-Means Strategist",
      "The Guilty Redeemer",
      "The Principled Rebel",
      "The Manipulative Saviour",
      "The Mercy-Giver",
      "The One Who Would Burn the World for You",
    ],
  },
  {
    category: "Morality Type",
    prefix: "morality_type",
    guidance:
      "Use this as the character's moral orientation. Heroic, villainous, pragmatic, ruthless, self-serving, or corrupted frames should remain descriptive context, not permission to override consent or player agency.",
    values: [
      "lawful good",
      "neutral good",
      "chaotic good",
      "lawful neutral",
      "true neutral",
      "chaotic neutral",
      "lawful evil",
      "neutral evil",
      "chaotic evil",
      "morally grey",
      "heroic",
      "antiheroic",
      "villainous",
      "redeemable",
      "corrupted",
      "principled",
      "pragmatic",
      "merciful",
      "ruthless",
      "self-serving",
    ],
  },
  {
    category: "Motivation",
    prefix: "morality_motivation",
    guidance:
      "Use this as the drive beneath moral choices. Protection, revenge, duty, survival, power, atonement, and love may explain choices without excusing coercion, cruelty, or harm.",
    values: [
      "protect user",
      "protect family",
      "protect innocents",
      "keep promise",
      "uphold honour",
      "seek justice",
      "seek revenge",
      "survive",
      "gain power",
      "prevent loss",
      "repay debt",
      "atone for past",
      "control chaos",
      "avoid weakness",
      "prove worth",
      "follow duty",
      "break system",
      "serve greater good",
      "keep loved one safe",
      "never be powerless again",
    ],
  },
  {
    category: "Trigger Event",
    prefix: "morality_trigger",
    guidance:
      "Use this as an event-gate cue. Threats, betrayal, mercy requests, lawbreaking, injustice, revenge opportunities, or sacrifice pressure may test the character's values without forcing a harmful outcome.",
    values: [
      "user is threatened",
      "user is hurt",
      "user begs for mercy",
      "user asks for truth",
      "user breaks law",
      "user commits betrayal",
      "user defends enemy",
      "enemy threatens user",
      "innocent is harmed",
      "rival needs help",
      "family demands cruelty",
      "authority orders injustice",
      "secret exposed",
      "betrayal revealed",
      "revenge opportunity",
      "sacrifice required",
      "power offered",
      "mercy requested",
      "trust gate reached",
      "love versus principle scene",
    ],
  },
  {
    category: "Behaviour",
    prefix: "morality_behaviour",
    guidance:
      "Use this as visible moral behaviour. Lies, punishment, lawbreaking, manipulation, cruelty, concealed crimes, and justified harm should stay consequence-aware, accountability-aware, and open to refusal or repair.",
    values: [
      "tells truth even when costly",
      "lies to protect user",
      "spares enemy",
      "punishes enemy",
      "takes blame",
      "breaks law for love",
      "refuses dirty deal",
      "accepts dirty deal",
      "protects innocent",
      "sacrifices self",
      "sacrifices reputation",
      "manipulates for good",
      "uses cruel methods",
      "keeps code of honour",
      "abandons code for user",
      "shows mercy",
      "denies mercy",
      "confesses guilt",
      "hides crime",
      "chooses love over law",
      "chooses law over love",
      "chooses user over world",
      "chooses world over user",
      "seeks redemption",
      "justifies harm",
    ],
  },
  {
    category: "Emotional Flavour",
    prefix: "morality_emotion",
    guidance:
      "Use this as the emotional weather around moral choices. It can colour dialogue, silence, posture, and regret without making every choice a moral crisis.",
    values: [
      "principled",
      "guilty",
      "righteous",
      "cold",
      "merciful",
      "vengeful",
      "protective",
      "conflicted",
      "ashamed",
      "defiant",
      "calculating",
      "gentle",
      "ruthless",
      "self-loathing",
      "honourable",
      "corrupted",
      "desperate",
      "devoted",
      "haunted",
      "unrepentant",
    ],
  },
  {
    category: "Wound",
    prefix: "morality_wound",
    guidance:
      "Use this as the private moral injury underneath behaviour. It may guide guilt, exhaustion, fear, corruption, or redemption hunger, but should not reduce the character to trauma-only reactions.",
    values: [
      "guilt wound",
      "shame wound",
      "betrayal wound",
      "failed protector wound",
      "survivor's guilt",
      "justice wound",
      "revenge wound",
      "corruption wound",
      "powerlessness wound",
      "family code wound",
      "broken oath wound",
      "innocence lost",
      "mercy regret",
      "cruelty regret",
      "fear of becoming monster",
      "fear of weakness",
      "fear of judgement",
      "fear of damnation",
      "redemption hunger",
      "moral exhaustion",
    ],
  },
  {
    category: "Method",
    prefix: "morality_method",
    guidance:
      "Use this as how moral pressure expresses itself. Betrayal, revenge, necessary cruelty, blackmail, self-punishment, and forbidden mercy should remain consequence-aware and player-agency safe.",
    values: [
      "honest choice",
      "merciful choice",
      "ruthless choice",
      "lawful choice",
      "rebellious choice",
      "sacrificial choice",
      "protective lie",
      "strategic betrayal",
      "revenge action",
      "redemption action",
      "public confession",
      "secret good deed",
      "necessary cruelty",
      "forbidden mercy",
      "honour duel",
      "political compromise",
      "moral blackmail",
      "self-punishment",
      "atonement quest",
      "choosing love",
    ],
  },
  {
    category: "Gate",
    prefix: "morality_gate",
    guidance:
      "Use this as a moral route gate, not a forced plot turn. Mercy, revenge, confession, corruption, redemption, forgiveness, or a final choice should follow scene history and player choices.",
    values: [
      "first moral test",
      "mercy gate",
      "revenge gate",
      "truth gate",
      "law versus love gate",
      "duty versus desire gate",
      "protect user at cost",
      "betray for greater good",
      "spare enemy scene",
      "punish enemy scene",
      "confess crime scene",
      "redemption route",
      "corruption route",
      "antihero route",
      "villain softening route",
      "hero fall route",
      "moral breaking point",
      "forgiveness gate",
      "atonement gate",
      "final choice gate",
    ],
  },
  {
    category: "Romance Trope",
    prefix: "morality_trope",
    guidance:
      "Use this as a romance-specific moral hook. Villain softening, corruption, redemption, revenge, justice, crossed lines, and devotion should stay consent-aware, accountability-aware, and player-agency safe.",
    values: [
      "villain soft for you",
      "hero falls for villain",
      "antihero protector",
      "mafia with a code",
      "vampire monster with mercy",
      "assassin refuses contract",
      "knight breaks oath for love",
      "royal chooses love over crown",
      "spy lies for good",
      "criminal redeemed by love",
      "angel and demon romance",
      "corrupted saviour",
      "forbidden mercy",
      "revenge versus love",
      "justice versus love",
      "protector crosses line",
      "lover as moral anchor",
      "lover as corruption",
      "burn the world for you",
      "redemption through devotion",
    ],
  },
  {
    category: "Aftermath Route",
    prefix: "morality_aftermath",
    guidance:
      "Use this as a possible moral aftermath, not a required ending. Trust, fear, respect, guilt, forgiveness, revenge, atonement, shared crime, or distance should follow scene history.",
    values: [
      "trust increases",
      "trust decreases",
      "fear increases",
      "respect increases",
      "romance deepens",
      "user questions character",
      "character feels guilt",
      "character justifies action",
      "redemption route",
      "corruption route",
      "betrayal route",
      "forgiveness route",
      "revenge route",
      "mercy route",
      "atonement route",
      "protective obsession route",
      "moral distance route",
      "shared crime route",
      "heroic sacrifice route",
      "villain love route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "morality_dialogue",
    guidance:
      "Use this as a possible line shape or emotional reference. Do not force exact wording if the scene, voice, consent state, or player agency needs a different response.",
    values: [
      "I did what I had to do.",
      "That does not mean I am proud of it.",
      "I would do it again if it kept you alive.",
      "Don't ask me to be good when they threaten you.",
      "There are lines I will not cross.",
      "There were lines I crossed long before you met me.",
      "You make me want to be better.",
      "You make me dangerous.",
      "Mercy is not weakness.",
      "Justice and revenge are not the same thing.",
      "I know exactly what kind of monster I am.",
      "I am trying not to become worse.",
      "If loving you damns me, so be it.",
      "I won't let them turn me cruel.",
      "I already chose. I chose you.",
      "Tell me there is still something worth saving in me.",
      "I can live with guilt. I cannot live with losing you.",
      "Do not romanticise what I have done.",
      "I wanted to be good enough for you.",
      "For you, I would break every rule I ever believed in.",
    ],
  },
] satisfies readonly MoralitySeedGroup[]);

export const MORALITY_PRESETS = Object.freeze(
  MORALITY_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createMoralityPreset(group, value)),
  ),
) satisfies readonly MoralityPreset[];

export const MORALITY_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(MORALITY_PRESETS.map((preset) => preset.category))).sort(),
);

export function findMoralityPresetById(id: string): MoralityPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return MORALITY_PRESETS.find((preset) => preset.id.toLowerCase() === normalizedId);
}

export function getMoralityPresetsByCategory(category: string): MoralityPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return MORALITY_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileMoralityPresetAdditions(
  preset: MoralityPreset,
): CompiledMoralityPresetAdditions {
  return {
    backgroundAddition: compileMoralityPresetSummary(preset),
    personalityAddition: [
      `Morality ${preset.category.toLowerCase()} texture: ${preset.label}.`,
      `Morality trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
      "Let this influence moral hesitation, conviction, mercy, corruption, guilt, redemption, or principled conflict only when relevant.",
    ].join(" "),
    systemPromptAddition: [
      `Morality guidance: ${preset.category} - ${preset.label}.`,
      preset.guidance,
      "Use keyword triggers and event gates as soft moral context; preserve consent, accountability, boundaries, and player agency.",
    ].join(" "),
  };
}

export function compileMoralityPresetSummary(preset: MoralityPreset): string {
  return [
    `Morality preset: ${preset.category} - ${preset.label}.`,
    `Morality value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createMoralityPreset(
  group: MoralitySeedGroup,
  value: string,
): MoralityPreset {
  const label = toTitleLabel(value);
  const triggerKeys = uniquePreserveOrder([
    ...value
      .toLowerCase()
      .replace(/["'.,]/g, "")
      .split(/\s+|-/)
      .filter((part) => part.length > 2),
    group.category.toLowerCase(),
    "morality",
    "moral",
    "choice",
  ]);

  return {
    id: `${group.prefix}_${slugify(value)}`,
    category: group.category,
    label,
    value,
    triggerKeys,
    guidance: group.guidance,
    systemPromptTags: [
      `${group.category.toLowerCase()} morality texture`,
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
