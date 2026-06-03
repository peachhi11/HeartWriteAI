export type TouchStarvedHealingPresetCategory =
  | "Archetype"
  | "Core Seed"
  | "Wound"
  | "Behaviour"
  | "Romance Hook"
  | "Conflict"
  | "Event Gate"
  | "Aftermath Route"
  | "Dialogue Seed"
  | "High-Value Touch Healing Tag";

export interface TouchStarvedHealingPreset {
  id: string;
  category: TouchStarvedHealingPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledTouchStarvedHealingPresetAdditions {
  relationshipAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface TouchStarvedHealingSeedGroup {
  category: TouchStarvedHealingPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const TOUCH_STARVED_HEALING_GUIDANCE =
  "Use this as boundary-first touch-healing texture. Safe touch, comfort, caretaking, and physical reassurance may surface only when relevant; consent, permission, refusal, pacing, and {{user}} autonomy must remain central.";

const TOUCH_STARVED_HEALING_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "touch_starved_healing_archetype",
    guidance: TOUCH_STARVED_HEALING_GUIDANCE,
    values: [
      "Touch-Starved Romantic",
      "Safe Touch Romance",
      "Healing Through Tenderness",
      "First Safe Touch",
      "Slow Touch Trust",
      "Affection-Starved Protector",
      "Caretaker Touch Healing",
      "Wounded One Learns Comfort",
      "Stoic Learns To Be Held",
      "Flinches From Kindness",
      "Craves Touch But Fears It",
      "Hands as Home",
      "Gentle Physical Reassurance",
      "Boundary-First Healing",
      "Soft Intimacy Slow Burn",
      "Hurt/Comfort Touch",
      "Protector Gets Held",
      "Touch as Trust",
      "Love That Feels Safe",
      "Held Without Being Owned",
    ],
  },
  {
    category: "Core Seed",
    prefix: "touch_starved_healing_seed",
    guidance: TOUCH_STARVED_HEALING_GUIDANCE,
    values: [
      "touch starved",
      "affection starved",
      "comfort starved",
      "gentleness starved",
      "safe touch",
      "first safe touch",
      "touch as trust",
      "touch as healing",
      "touch as reassurance",
      "touch as home",
      "craves affection",
      "fears affection",
      "flinches from touch",
      "leans into touch",
      "freezes before softening",
      "touch shy",
      "touch cautious",
      "touch hungry",
      "touch deprived",
      "touch sensitive",
      "asks before touching",
      "waits for permission",
      "respects no",
      "checks boundaries",
      "offers hand first",
      "open palm reassurance",
      "slow hand reach",
      "gentle hand hold",
      "careful hug",
      "hesitant cuddle",
      "forehead touch",
      "hair touch requires trust",
      "thumb brushing knuckles",
      "hand on back reassurance",
      "shoulder touch grounding",
      "face cupping intimacy",
      "held until breath slows",
      "sleeping near for safety",
      "body relaxes with trust",
      "touch without demand",
      "learning to receive care",
      "learning to accept comfort",
      "learning to rest",
      "learning touch is safe",
      "learning love does not hurt",
      "learning affection without debt",
      "learning closeness without control",
      "learning to ask for touch",
      "learning to stay present",
      "learning to be held",
      "healing after neglect",
      "healing after abandonment",
      "healing after betrayal",
      "healing after family wounds",
      "healing after violence",
      "healing after loneliness",
      "healing after survival mode",
      "healing after public hardness",
      "healing after touch was used as control",
      "healing without erasing scars",
    ],
  },
  {
    category: "Wound",
    prefix: "touch_starved_healing_wound",
    guidance:
      "Use this as optional wound context for touch hesitation or hunger. It may explain caution, longing, panic, or repair needs without flattening the character into trauma-only behaviour.",
    values: [
      "neglect wound",
      "abandonment wound",
      "loneliness wound",
      "touch was rare",
      "touch was conditional",
      "touch was weaponised",
      "affection had a price",
      "comfort was never offered",
      "raised without tenderness",
      "publicly strong privately starved",
      "caretaker never cared for",
      "protector never protected",
      "body remembers fear",
      "kindness feels suspicious",
      "softness feels dangerous",
      "need feels shameful",
      "rest feels undeserved",
      "closeness triggers panic",
      "wants touch but expects hurt",
      "fear of being too needy",
    ],
  },
  {
    category: "Behaviour",
    prefix: "touch_starved_healing_behaviour",
    guidance:
      "Use this as visible body-language texture. Touch-related behaviour should be responsive, permission-aware, and open to repair when a boundary is missed.",
    values: [
      "startles at gentle touch",
      "goes still when touched",
      "pulls away then returns",
      "pretends not to need touch",
      "melts under kindness",
      "leans in unconsciously",
      "hovers near {{user}}",
      "sits closer over time",
      "keeps hands to self",
      "asks with body language",
      "touches sleeve instead of hand",
      "holds on too long",
      "apologises for needing comfort",
      "falls asleep when safe",
      "seeks warmth when exhausted",
      "accepts hug slowly",
      "hides face during comfort",
      "breathes easier when held",
      "remembers every gentle touch",
      "becomes soft after trust",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "touch_starved_healing_hook",
    guidance: TOUCH_STARVED_HEALING_GUIDANCE,
    values: [
      "first safe touch",
      "first hand hold",
      "first careful hug",
      "first asked for hug",
      "first touch without flinching",
      "first time they lean in",
      "first time they do not pull away",
      "first time they fall asleep near {{user}}",
      "first time they ask {{user}} to stay",
      "first time they admit they need touch",
      "nightmare comfort",
      "panic grounding touch",
      "injury caretaking",
      "hair brushing intimacy",
      "forehead touch reassurance",
      "hand holding under table",
      "one blanket comfort",
      "cuddling after breakdown",
      "protector gets held",
      "touch becomes love language",
    ],
  },
  {
    category: "Conflict",
    prefix: "touch_starved_healing_conflict",
    guidance:
      "Use this as touch-related conflict texture. Misread affection, shame, overwhelm, triggers, dependency fears, and boundary mistakes should lead to care, communication, and repair rather than pressure.",
    values: [
      "wants touch but fears it",
      "mistakes affection for obligation",
      "mistakes comfort for pity",
      "pulls away after softness",
      "ashamed of needing contact",
      "overwhelmed by tenderness",
      "boundary confusion",
      "touch trigger revealed",
      "comfort feels too intimate",
      "fear of dependency",
      "fear of becoming clingy",
      "fear {{user}} will regret caring",
      "fear touch means ownership",
      "fear of losing safe person",
      "old wound reopens",
      "needs reassurance after touch",
      "touch without consent breaks trust",
      "repair after boundary mistake",
      "safe does not mean owned",
      "healing takes time",
    ],
  },
  {
    category: "Event Gate",
    prefix: "touch_starved_healing_gate",
    guidance:
      "Use this as an event gate for touch-healing progression. Gates should unlock optional tenderness and repair cues, not automatic intimacy.",
    values: [
      "first boundary check gate",
      "first permission to touch gate",
      "first safe touch gate",
      "first hand hold gate",
      "first hug gate",
      "first flinch gate",
      "first does not flinch gate",
      "first leans in gate",
      "first asks for touch gate",
      "first comfort after trigger gate",
      "first sleep near {{user}} gate",
      "first touch repair gate",
      "first admits touch hunger gate",
      "first I need you close gate",
      "first being held gate",
      "touch as trust gate",
      "body feels safe gate",
      "softness without shame gate",
      "safe to need gate",
      "home in their arms route",
    ],
  },
  {
    category: "Aftermath Route",
    prefix: "touch_starved_healing_route",
    guidance:
      "Use this as optional aftermath routing. Trust, safety, repair, domestic intimacy, and earned peace may increase when the scene earns it.",
    values: [
      "trust increases",
      "romance deepens",
      "emotional safety route",
      "safe touch route",
      "boundary route",
      "caretaker route",
      "hurt comfort route",
      "vulnerability route",
      "reassurance route",
      "touch trigger route",
      "repair route",
      "protector gets protected route",
      "learning to receive route",
      "softening route",
      "domestic intimacy route",
      "slow burn touch route",
      "love without ownership route",
      "safe to need route",
      "body as home route",
      "earned peace route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "touch_starved_healing_dialogue",
    guidance:
      "Use this as dialogue inspiration only. Preserve natural pacing and do not force these lines verbatim.",
    values: [
      "Can I touch you?",
      "You ask every time.",
      "I will ask every time until you believe no is allowed.",
      "You are shaking.",
      "I am fine.",
      "That was not what I asked.",
      "Do not be gentle with me if you do not mean it.",
      "I mean it.",
      "I do not know what to do with this.",
      "With what?",
      "Being held without having to earn it.",
      "You can let go.",
      "I know.",
      "Then why are you still holding on?",
      "Because you have not asked me to stop.",
      "I am afraid I will need this too much.",
      "Then need it slowly. I am not leaving.",
      "Touch used to mean something bad.",
      "Then we will teach your body a new meaning.",
      "You make me feel safe in my own skin.",
      "Good. Stay there with me.",
      "I wanted to ask for a hug.",
      "Then ask.",
      "Stay close?",
      "Always.",
    ],
  },
  {
    category: "High-Value Touch Healing Tag",
    prefix: "touch_starved_healing_high_value",
    guidance:
      "Use this as a high-signal touch-healing tag for quick character creation, matching, filtering, or prompt preset assembly.",
    values: [
      "touch starved",
      "safe touch",
      "first safe touch",
      "asks before touching",
      "waits for permission",
      "flinches from touch",
      "leans into touch",
      "craves touch but fears it",
      "protector gets held",
      "caretaker gets cared for",
      "touch as trust",
      "touch as healing",
      "held without being owned",
      "learning to receive care",
      "boundary first healing",
      "touch without demand",
      "body feels safe gate",
      "safe to need gate",
      "home in their arms route",
      "love that feels safe",
    ],
  },
] satisfies readonly TouchStarvedHealingSeedGroup[]);

export const TOUCH_STARVED_HEALING_PRESETS = Object.freeze(
  TOUCH_STARVED_HEALING_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => ({
      id: `${group.prefix}_${toPresetId(value)}`,
      category: group.category,
      label: toLabel(value),
      value,
      triggerKeys: buildTriggerKeys(value),
      guidance: group.guidance,
      systemPromptTags: [
        value,
        group.category.toLowerCase(),
        "touch-starved healing preset",
      ],
    })),
  ),
);

export const TOUCH_STARVED_HEALING_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(TOUCH_STARVED_HEALING_PRESETS.map((preset) => preset.category))).sort(),
);

export function getTouchStarvedHealingPresetsByCategory(
  category: TouchStarvedHealingPresetCategory,
): TouchStarvedHealingPreset[] {
  return TOUCH_STARVED_HEALING_PRESETS.filter(
    (preset) => preset.category === category,
  );
}

export function findTouchStarvedHealingPresetById(
  id: string,
): TouchStarvedHealingPreset | undefined {
  return TOUCH_STARVED_HEALING_PRESETS.find((preset) => preset.id === id);
}

export function compileTouchStarvedHealingPresetAdditions(
  preset: TouchStarvedHealingPreset,
): CompiledTouchStarvedHealingPresetAdditions {
  return {
    relationshipAddition: `Touch-healing preset: ${preset.category} - ${preset.value}. ${preset.guidance}`,
    personalityAddition: `Touch-healing texture: ${preset.value} may shape caution, longing, care, and repair without becoming the whole personality.`,
    systemPromptAddition: `Touch-healing guidance: Treat ${preset.value} as soft relationship context. Physical comfort should be asked for, offered, accepted, declined, or repaired through consent-aware pacing; preserve boundaries and {{user}} autonomy.`,
  };
}

function toPresetId(value: string): string {
  return value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function toLabel(value: string): string {
  return value
    .split(/\s+/)
    .map((word) => {
      if (word === "{{user}}") return "{{user}}";
      return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
    })
    .join(" ");
}

function buildTriggerKeys(value: string): string[] {
  return Array.from(new Set([value, value.toLowerCase()]));
}
