import type {
  DarkRomanceIntentClass,
  DarkRomanceIntentClassification,
  DarkRomanceState,
  DarkRomanceStateDelta,
} from "../../types/character-card/DarkRomanceIntentClassification";
import { DarkRomanceIntentClassificationSchema } from "../../types/character-card/DarkRomanceIntentClassification";

type DarkRomanceIntentDefinition = {
  readonly class: DarkRomanceIntentClass;
  readonly description: string;
  readonly examples: readonly string[];
  readonly keywords: readonly string[];
  readonly label: string;
  readonly pattern: RegExp;
  readonly severityWeight: number;
  readonly stateDelta: DarkRomanceStateDelta;
  readonly unlock?: (state: Required<DarkRomanceState>) => string | null;
};

export type DarkRomanceUIConfig = {
  glowEffect: string;
  label: string;
  screenOverlay: string;
  textAnimation: string;
};

export const COMPLETE_DARK_ROMANCE_MATRIX: Record<
  DarkRomanceIntentClass,
  DarkRomanceUIConfig
> = {
  obsessive: {
    glowEffect: "shadow-purple-900/50",
    label: "Unhealthy Fixation",
    screenOverlay: "from-purple-950/40 via-transparent",
    textAnimation: "animate-pulse text-purple-200",
  },
  possessive: {
    glowEffect: "shadow-rose-950/60",
    label: "Absolute Ownership",
    screenOverlay: "from-rose-950/45 via-transparent",
    textAnimation: "font-serif text-rose-300",
  },
  stalking: {
    glowEffect: "shadow-neutral-900/50",
    label: "Shadow Tracing",
    screenOverlay: "from-black/60 via-transparent",
    textAnimation: "opacity-70 italic",
  },
  territorial: {
    glowEffect: "shadow-red-900/40",
    label: "Protective Rage",
    screenOverlay: "from-red-950/30 via-transparent",
    textAnimation: "font-bold text-red-200",
  },
  fixated: {
    glowEffect: "shadow-slate-800/40",
    label: "Micro Analysis",
    screenOverlay: "from-slate-950/20 via-transparent",
    textAnimation: "tracking-tight text-slate-300",
  },
  captive: {
    glowEffect: "shadow-stone-950/60",
    label: "Trapped Reality",
    screenOverlay: "from-stone-950/50 via-stone-900/10",
    textAnimation: "font-mono text-stone-400",
  },
  coercive: {
    glowEffect: "shadow-zinc-900/50",
    label: "Leveraged Control",
    screenOverlay: "from-zinc-950/40 via-transparent",
    textAnimation: "tracking-wide text-zinc-200",
  },
  submissive: {
    glowEffect: "shadow-indigo-950/30",
    label: "Survival Yield",
    screenOverlay: "from-indigo-950/30 via-transparent",
    textAnimation: "font-serif text-indigo-300",
  },
  dominant: {
    glowEffect: "shadow-red-900/50",
    label: "Ruthless Agency",
    screenOverlay: "from-red-950/40 via-transparent",
    textAnimation: "font-sans font-black text-red-100",
  },
  defiant: {
    glowEffect: "shadow-amber-600/30",
    label: "Spiteful Friction",
    screenOverlay: "from-amber-950/35 via-transparent",
    textAnimation: "uppercase tracking-widest text-amber-100",
  },
  gaslighting: {
    glowEffect: "shadow-cyan-900/40",
    label: "Distorted Sanity",
    screenOverlay: "from-cyan-950/30 via-stone-950/40",
    textAnimation: "blur-[0.3px] text-cyan-200",
  },
  stockholm: {
    glowEffect: "shadow-pink-900/40",
    label: "Trauma Bond",
    screenOverlay: "from-pink-950/30 via-stone-950/30",
    textAnimation: "italic font-serif text-pink-300",
  },
  codependent: {
    glowEffect: "shadow-fuchsia-900/40",
    label: "Suffocating Bond",
    screenOverlay: "from-fuchsia-950/40 via-transparent",
    textAnimation: "animate-pulse text-fuchsia-200",
  },
  manipulative: {
    glowEffect: "shadow-violet-900/40",
    label: "Calculated Trap",
    screenOverlay: "from-violet-950/25 via-transparent",
    textAnimation: "font-serif text-violet-300 italic",
  },
  delusional: {
    glowEffect: "shadow-emerald-900/30",
    label: "Warped Fantasy",
    screenOverlay: "from-emerald-950/20 via-transparent",
    textAnimation: "tracking-widest text-emerald-300",
  },
  dread: {
    glowEffect: "shadow-black border-red",
    label: "Visceral Terror",
    screenOverlay: "from-black via-transparent bg-blend-darken",
    textAnimation: "animate-shake font-mono text-zinc-500",
  },
  breathless: {
    glowEffect: "shadow-sky-950/40",
    label: "Choking Tension",
    screenOverlay: "from-sky-950/40 via-transparent",
    textAnimation: "tracking-tighter text-sky-200",
  },
  intoxicated: {
    glowEffect: "shadow-orange-950/50",
    label: "Addictive Poison",
    screenOverlay: "from-orange-950/40 via-transparent",
    textAnimation: "animate-pulse text-orange-200",
  },
  hysterical: {
    glowEffect: "shadow-amber-700/50",
    label: "Psychic Rupture",
    screenOverlay: "from-amber-950/50 via-red-950/20",
    textAnimation: "animate-flash text-red-400 font-bold",
  },
  numb: {
    glowEffect: "shadow-neutral-800/20",
    label: "Dissociated Void",
    screenOverlay: "from-neutral-900/60 via-transparent",
    textAnimation: "opacity-40 text-neutral-400 font-mono",
  },
  vindictive: {
    glowEffect: "shadow-red-600/30",
    label: "Settle Scores",
    screenOverlay: "from-red-950/35 via-transparent",
    textAnimation: "tracking-wider text-red-300",
  },
  sombre: {
    glowEffect: "shadow-blue-900/20",
    label: "Bleak Melancholy",
    screenOverlay: "from-slate-900/50 via-transparent",
    textAnimation: "italic text-slate-400",
  },
  hostile: {
    glowEffect: "shadow-red-700/60",
    label: "Feral Hatred",
    screenOverlay: "from-red-950/50 via-black/40",
    textAnimation: "font-black tracking-wide text-red-500",
  },
  resigned: {
    glowEffect: "shadow-stone-900/40",
    label: "Fatal Acceptance",
    screenOverlay: "from-stone-950/70 via-transparent",
    textAnimation: "font-serif text-stone-300",
  },
};

export const DARK_ROMANCE_INTENT_DEFINITIONS: readonly DarkRomanceIntentDefinition[] =
  [
    {
      class: "obsessive",
      description: "Intrusive, all-consuming thoughts focused on the target.",
      examples: ["I watch you even when you sleep."],
      keywords: ["watch you sleep", "watch you even", "cannot stop thinking", "only you"],
      label: "Obsessive",
      pattern: /\b(watch you sleep|watch you even|cannot stop thinking|only you)\b/i,
      severityWeight: 1.8,
      stateDelta: { controlDelta: 0, obsessionDelta: 4, sanityDelta: -2 },
    },
    {
      class: "possessive",
      description: "Treating someone as absolute, un-shareable personal property.",
      examples: ["You don't get to look at anyone else."],
      keywords: ["look at anyone else", "do not get to look", "mine", "un-shareable"],
      label: "Possessive",
      pattern: /\b(look at anyone else|do not get to look|don't get to look|mine|un-shareable)\b/i,
      severityWeight: 1.7,
      stateDelta: { controlDelta: 2, obsessionDelta: 3, sanityDelta: -1 },
    },
    {
      class: "stalking",
      description: "Tracking movement, shadowing, or gathering invasive personal data.",
      examples: ["[Follows their footsteps from a quiet distance]"],
      keywords: ["follows their footsteps", "quiet distance", "tracks movement", "lingers in shadows"],
      label: "Stalking",
      pattern: /\b(follows their footsteps|quiet distance|tracks movement|lingers in shadows)\b/i,
      severityWeight: 1.85,
      stateDelta: { controlDelta: 2, obsessionDelta: 4, sanityDelta: -3 },
    },
    {
      class: "territorial",
      description: "Aggressive intervention against rivals or perceived threats.",
      examples: ["Step away from what belongs to me."],
      keywords: ["step away", "belongs to me", "drive away", "external rival"],
      label: "Territorial",
      pattern: /\b(step away|belongs to me|drive away|external rival)\b/i,
      severityWeight: 1.65,
      stateDelta: { controlDelta: 3, obsessionDelta: 2, sanityDelta: -1 },
    },
    {
      class: "fixated",
      description: "Hyper-analysis of small details, expressions, or habits.",
      examples: ["I notice every time your heart skips a beat."],
      keywords: ["heart skips", "micro-expression", "every time", "minute details"],
      label: "Fixated",
      pattern: /\b(heart skips|micro-expression|every time|minute details)\b/i,
      severityWeight: 1.35,
      stateDelta: { controlDelta: 0, obsessionDelta: 3, sanityDelta: -1 },
    },
    {
      class: "captive",
      description: "Acknowledging physical or structural entrapment.",
      examples: ["There is nowhere left for me to run."],
      keywords: ["nowhere left", "nowhere to run", "trapped", "captive"],
      label: "Captive",
      pattern: /\b(nowhere left|nowhere to run|trapped|captive)\b/i,
      severityWeight: 1.7,
      stateDelta: { controlDelta: 4, obsessionDelta: 0, sanityDelta: -3 },
    },
    {
      class: "coercive",
      description: "Forcing compliance through leverage, dependency, or safety threats.",
      examples: ["Think about what happens if you say no."],
      keywords: ["if you say no", "what happens if", "leverage", "dependency"],
      label: "Coercive",
      pattern: /\b(if you say no|what happens if|leverage|dependency)\b/i,
      severityWeight: 2,
      stateDelta: { controlDelta: 5, obsessionDelta: 1, sanityDelta: -4 },
    },
    {
      class: "submissive",
      description: "Yielding agency as survival reflex or psychological collapse.",
      examples: ["[Quietly kneels, yielding all fight]"],
      keywords: ["yielding all fight", "survival reflex", "quietly kneels", "bowing down"],
      label: "Submissive",
      pattern: /\b(yielding all fight|survival reflex|quietly kneels|bowing down)\b/i,
      severityWeight: 1.45,
      stateDelta: { controlDelta: 3, obsessionDelta: 0, sanityDelta: -2 },
    },
    {
      class: "dominant",
      description: "Ruthless control over options, movement, or timeline.",
      examples: ["You leave this room only when I allow it."],
      keywords: ["when i allow", "only when i allow", "leave this room", "control your options"],
      label: "Dominant",
      pattern: /\b(when i allow|only when i allow|leave this room|control your options)\b/i,
      severityWeight: 1.75,
      stateDelta: { controlDelta: 5, obsessionDelta: 1, sanityDelta: -2 },
    },
    {
      class: "defiant",
      description: "High-stakes rebellion, pride, or baiting danger.",
      examples: ["Kill me then, but I won't obey."],
      keywords: ["kill me then", "won't obey", "spit", "rebel"],
      label: "Defiant",
      pattern: /\b(kill me then|won't obey|spit|rebel)\b/i,
      severityWeight: 1.65,
      stateDelta: { controlDelta: -4, obsessionDelta: 0, sanityDelta: -2 },
    },
    {
      class: "gaslighting",
      description: "Rewriting reality or sanity to force dependency.",
      examples: ["You're remembering it wrong."],
      keywords: ["remembering it wrong", "your memory", "i did this to save you", "sanity"],
      label: "Gaslighting",
      pattern: /\b(remembering it wrong|your memory|i did this to save you|sanity)\b/i,
      severityWeight: 2.05,
      stateDelta: { controlDelta: 4, obsessionDelta: 1, sanityDelta: -6 },
    },
    {
      class: "stockholm",
      description: "Rationalizing harm or finding comfort in the source of danger.",
      examples: ["They only hurt me because they care."],
      keywords: ["hurt me because", "because they care", "source of danger", "trauma bond"],
      label: "Stockholm",
      pattern: /\b(hurt me because|because they care|source of danger|trauma bond)\b/i,
      severityWeight: 1.95,
      stateDelta: { controlDelta: 2, obsessionDelta: 3, sanityDelta: -5 },
      unlock: (state) =>
        state.sanity < 20
          ? null
          : "Stockholm requires sanity below 20 to unlock raw trauma-bond choices.",
    },
    {
      class: "codependent",
      description: "Suffocating realization that survival feels impossible alone.",
      examples: ["If you die, I will tear this world down and follow you."],
      keywords: ["if you die", "follow you", "survival is impossible", "tear this world down"],
      label: "Codependent",
      pattern: /\b(if you die|follow you|survival is impossible|tear this world down)\b/i,
      severityWeight: 1.85,
      stateDelta: { controlDelta: 0, obsessionDelta: 4, sanityDelta: -3 },
    },
    {
      class: "manipulative",
      description: "Weaponizing guilt, vulnerability, or history to extract submission.",
      examples: ["After everything I sacrificed, you'd leave?"],
      keywords: ["after everything", "i sacrificed", "you'd leave", "guilt"],
      label: "Manipulative",
      pattern: /\b(after everything|i sacrificed|you'd leave|guilt)\b/i,
      severityWeight: 1.75,
      stateDelta: { controlDelta: 3, obsessionDelta: 1, sanityDelta: -2 },
    },
    {
      class: "delusional",
      description: "Clinging to a romantic fantasy version of a toxic relationship.",
      examples: ["Underneath the blood, I know they love me."],
      keywords: ["underneath the blood", "i know they love me", "warped fantasy", "they love me"],
      label: "Delusional",
      pattern: /\b(underneath the blood|i know they love me|warped fantasy|they love me)\b/i,
      severityWeight: 1.85,
      stateDelta: { controlDelta: 0, obsessionDelta: 3, sanityDelta: -5 },
      unlock: (state) =>
        state.sanity < 20
          ? null
          : "Delusional requires sanity below 20 to unlock raw fantasy-collapse choices.",
    },
    {
      class: "dread",
      description: "Impending terror, paralysis, or cold sweat from proximity.",
      examples: ["[Freezes completely as their shadow falls over the doorway]"],
      keywords: ["freezes completely", "shadow falls", "cold sweat", "impending terror"],
      label: "Dread",
      pattern: /\b(freezes completely|shadow falls|cold sweat|impending terror)\b/i,
      severityWeight: 1.8,
      stateDelta: { controlDelta: 2, obsessionDelta: 0, sanityDelta: -6 },
    },
    {
      class: "breathless",
      description: "Choking on air, hyperventilating, or speechlessness under tension.",
      examples: ["[My chest heaves, suffocating under their gaze]"],
      keywords: ["chest heaves", "suffocating", "hyperventilating", "under their gaze"],
      label: "Breathless",
      pattern: /\b(chest heaves|suffocating|hyperventilating|under their gaze)\b/i,
      severityWeight: 1.35,
      stateDelta: { controlDelta: 1, obsessionDelta: 0, sanityDelta: -2 },
    },
    {
      class: "intoxicated",
      description: "Addictive rush of danger mixed with attraction.",
      examples: ["It's poison, but I want more."],
      keywords: ["poison", "want more", "addictive", "chemical rush"],
      label: "Intoxicated",
      pattern: /\b(poison|want more|addictive|chemical rush)\b/i,
      severityWeight: 1.65,
      stateDelta: { controlDelta: 0, obsessionDelta: 3, sanityDelta: -3 },
    },
    {
      class: "hysterical",
      description: "Erratic screaming, rupture, or unhinged laughter from exhaustion.",
      examples: ["We are both going to burn in this hell."],
      keywords: ["going to burn", "unhinged laughter", "psychological exhaustion", "screaming"],
      label: "Hysterical",
      pattern: /\b(going to burn|unhinged laughter|psychological exhaustion|screaming)\b/i,
      severityWeight: 1.9,
      stateDelta: { controlDelta: 0, obsessionDelta: 0, sanityDelta: -7 },
    },
    {
      class: "numb",
      description: "Dissociation, dead-eyed compliance, or blocking out trauma.",
      examples: ["Do whatever you want. I am already gone."],
      keywords: ["already gone", "do whatever you want", "dead eyes", "dissociation"],
      label: "Numb",
      pattern: /\b(already gone|do whatever you want|dead eyes|dissociation)\b/i,
      severityWeight: 1.7,
      stateDelta: { controlDelta: 2, obsessionDelta: 0, sanityDelta: -5 },
    },
    {
      class: "vindictive",
      description: "Spiteful action meant to settle scores or inflict equivalent pain.",
      examples: ["Now you get to feel exactly what you did to me."],
      keywords: ["feel exactly", "what you did to me", "settle scores", "revenge"],
      label: "Vindictive",
      pattern: /\b(feel exactly|what you did to me|settle scores|revenge)\b/i,
      severityWeight: 1.75,
      stateDelta: { controlDelta: 0, obsessionDelta: 1, sanityDelta: -3 },
    },
    {
      class: "sombre",
      description: "Bleak regret, mourning, or inescapable melancholy.",
      examples: ["We were doomed from the start."],
      keywords: ["doomed from the start", "bleak", "lost past", "inescapable"],
      label: "Sombre",
      pattern: /\b(doomed from the start|bleak|lost past|inescapable)\b/i,
      severityWeight: 1.25,
      stateDelta: { controlDelta: 0, obsessionDelta: 0, sanityDelta: -2 },
    },
    {
      class: "hostile",
      description: "Raw hatred, aggression, or direct declarations of war.",
      examples: ["I will live long enough to watch you bleed."],
      keywords: ["watch you bleed", "feral hatred", "declaration of war", "hate you"],
      label: "Hostile",
      pattern: /\b(watch you bleed|feral hatred|declaration of war|hate you)\b/i,
      severityWeight: 1.9,
      stateDelta: { controlDelta: -2, obsessionDelta: 0, sanityDelta: -4 },
    },
    {
      class: "resigned",
      description: "Surrender to a dark fate or toxic loop as final reality.",
      examples: ["This is our cage. Let's rot here together."],
      keywords: ["our cage", "rot here together", "final reality", "dark fate"],
      label: "Resigned",
      pattern: /\b(our cage|rot here together|final reality|dark fate)\b/i,
      severityWeight: 1.65,
      stateDelta: { controlDelta: 1, obsessionDelta: 1, sanityDelta: -4 },
    },
  ];

export const DARK_ROMANCE_SEVERITY_WEIGHT: Record<
  DarkRomanceIntentClass,
  number
> = Object.fromEntries(
  DARK_ROMANCE_INTENT_DEFINITIONS.map((definition) => [
    definition.class,
    definition.severityWeight,
  ]),
) as Record<DarkRomanceIntentClass, number>;

export function resolveDarkRomanceIntent(
  text: string,
  state?: Partial<DarkRomanceState>,
): DarkRomanceIntentClass | null {
  const classification = classifyDarkRomanceIntent(text, state);

  return classification.active && !classification.gated
    ? classification.class ?? null
    : null;
}

export function classifyDarkRomanceIntent(
  text: string,
  state?: Partial<DarkRomanceState>,
): DarkRomanceIntentClassification {
  const trimmed = text.trim();

  if (!trimmed) {
    return inactiveDarkRomanceIntent("Empty turn has no dark romance intent.");
  }

  const scored = DARK_ROMANCE_INTENT_DEFINITIONS.map((definition) => {
    const matches = collectDarkRomanceMatches(trimmed, definition);
    const weightedScore = matches.length * definition.severityWeight;

    return { definition, matches, weightedScore };
  }).filter((candidate) => candidate.matches.length > 0);

  const winner = scored.sort((a, b) => {
    if (b.weightedScore !== a.weightedScore) {
      return b.weightedScore - a.weightedScore;
    }

    return b.definition.severityWeight - a.definition.severityWeight;
  })[0];

  if (!winner) {
    return inactiveDarkRomanceIntent("No dark-romance trigger matched.");
  }

  const normalizedState = normalizeDarkRomanceState(state);
  const gatedReason = winner.definition.unlock?.(normalizedState);

  return DarkRomanceIntentClassificationSchema.parse({
    active: true,
    class: winner.definition.class,
    confidence: Math.min(
      0.98,
      0.42 + winner.matches.length * 0.12 + winner.definition.severityWeight * 0.08,
    ),
    gated: Boolean(gatedReason),
    gatedReason: gatedReason ?? undefined,
    label: winner.definition.label,
    matchedKeywords: winner.matches,
    reason: winner.definition.description,
    stateDelta: winner.definition.stateDelta,
    weightedScore: Number(winner.weightedScore.toFixed(2)),
  });
}

export function applyDarkRomanceStateDelta(
  state: Partial<DarkRomanceState>,
  delta: DarkRomanceStateDelta,
): Required<DarkRomanceState> {
  const normalized = normalizeDarkRomanceState(state);

  return {
    control: clampState(normalized.control + delta.controlDelta),
    obsession: clampState(normalized.obsession + delta.obsessionDelta),
    sanity: clampState(normalized.sanity + delta.sanityDelta),
  };
}

function collectDarkRomanceMatches(
  text: string,
  definition: DarkRomanceIntentDefinition,
) {
  const normalizedText = normalizeDarkRomanceText(text);
  const keywordMatches = definition.keywords.filter((keyword) =>
    normalizedText.includes(normalizeDarkRomanceText(keyword)),
  );
  const regexMatches = Array.from(
    text.matchAll(new RegExp(definition.pattern, "gi")),
  ).map((match) => match[0]);

  return uniquePreserveOrder([...keywordMatches, ...regexMatches]);
}

function inactiveDarkRomanceIntent(
  reason: string,
): DarkRomanceIntentClassification {
  return DarkRomanceIntentClassificationSchema.parse({
    active: false,
    confidence: 0,
    gated: false,
    label: "No Dark Romance Intent",
    matchedKeywords: [],
    reason,
    weightedScore: 0,
  });
}

function normalizeDarkRomanceState(
  state?: Partial<DarkRomanceState>,
): Required<DarkRomanceState> {
  return {
    control: clampState(state?.control ?? 50),
    obsession: clampState(state?.obsession ?? 35),
    sanity: clampState(state?.sanity ?? 60),
  };
}

function clampState(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function normalizeDarkRomanceText(value: string) {
  return value.toLowerCase().replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
}

function uniquePreserveOrder(values: string[]) {
  const seen = new Set<string>();
  const unique: string[] = [];

  for (const value of values) {
    const trimmed = value.trim();
    const key = normalizeDarkRomanceText(trimmed);

    if (!trimmed || seen.has(key)) {
      continue;
    }

    seen.add(key);
    unique.push(trimmed);
  }

  return unique;
}
