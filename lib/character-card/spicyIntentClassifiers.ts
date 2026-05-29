import type {
  SpicyIntentClass,
  SpicyIntentClassification,
} from "../../types/character-card/SpicyIntentClassification";
import { SpicyIntentClassificationSchema } from "../../types/character-card/SpicyIntentClassification";

type SpicyIntentDefinition = {
  readonly class: SpicyIntentClass;
  readonly label: string;
  readonly description: string;
  readonly examples: readonly string[];
  readonly keywords: readonly string[];
  readonly pattern: RegExp;
  readonly severityWeight: number;
};

export type SpicyDesignConfig = {
  glow: string;
  label: string;
  motionPreset: string;
  vignette: string;
};

export const COMPLETE_SPICY_MATRIX: Record<
  SpicyIntentClass,
  SpicyDesignConfig
> = {
  seductive: {
    glow: "shadow-pink-600/40",
    label: "Seductive Allure",
    motionPreset: "transition-all duration-700",
    vignette: "from-pink-950/40 via-transparent",
  },
  provocative: {
    glow: "shadow-amber-500/30",
    label: "Wicked Tease",
    motionPreset: "animate-pulse duration-1000",
    vignette: "from-amber-950/30 via-transparent",
  },
  flirtatious: {
    glow: "shadow-rose-500/30",
    label: "Romantic Charm",
    motionPreset: "transition-all duration-300",
    vignette: "from-rose-900/20 via-transparent",
  },
  coquettish: {
    glow: "shadow-fuchsia-500/30",
    label: "Sensory Display",
    motionPreset: "transition-all duration-500",
    vignette: "from-fuchsia-950/30 via-transparent",
  },
  fervent: {
    glow: "shadow-orange-600/50",
    label: "Primal Passion",
    motionPreset: "animate-pulse duration-300",
    vignette: "from-orange-950/40 via-transparent",
  },
  captivated: {
    glow: "shadow-violet-600/40",
    label: "Intoxicated",
    motionPreset: "transition-all duration-1000",
    vignette: "from-violet-950/40 via-transparent",
  },
  obsessive: {
    glow: "shadow-purple-700/50",
    label: "Hyper-Fixation",
    motionPreset: "animate-pulse duration-700",
    vignette: "from-purple-950/50 via-transparent",
  },
  primal: {
    glow: "shadow-red-700/60",
    label: "Visceral Command",
    motionPreset: "transition-all duration-200",
    vignette: "from-red-950/50 via-transparent",
  },
  dominant: {
    glow: "shadow-red-600/40",
    label: "Assertive Control",
    motionPreset: "transition-all duration-300",
    vignette: "from-red-950/40 via-transparent",
  },
  submissive: {
    glow: "shadow-violet-500/30",
    label: "Yielding Power",
    motionPreset: "transition-all duration-500",
    vignette: "from-violet-950/30 via-transparent",
  },
  commanding: {
    glow: "shadow-red-700/40",
    label: "Absolute Authority",
    motionPreset: "transition-all duration-150",
    vignette: "from-stone-950/60 via-red-950/20",
  },
  yielding: {
    glow: "shadow-fuchsia-400/20",
    label: "Soft Compliance",
    motionPreset: "transition-all duration-700",
    vignette: "from-fuchsia-950/20 via-transparent",
  },
  possessive: {
    glow: "shadow-rose-700/40",
    label: "Territorial Claim",
    motionPreset: "transition-all duration-400",
    vignette: "from-rose-950/45 via-transparent",
  },
  guarded: {
    glow: "shadow-slate-600/30",
    label: "Forbidden Barrier",
    motionPreset: "transition-all duration-500",
    vignette: "from-slate-900/50 via-transparent",
  },
  defiant: {
    glow: "shadow-amber-600/30",
    label: "Spiteful Tension",
    motionPreset: "transition-all duration-200",
    vignette: "from-amber-950/35 via-transparent",
  },
  forbidden: {
    glow: "shadow-purple-900/40",
    label: "Taboo Chemistry",
    motionPreset: "transition-all duration-600",
    vignette: "from-purple-950/40 via-stone-950/20",
  },
  roguish: {
    glow: "shadow-yellow-600/20",
    label: "Playful Rebel",
    motionPreset: "transition-all duration-300",
    vignette: "from-yellow-950/20 via-transparent",
  },
  flustered: {
    glow: "shadow-teal-500/20",
    label: "Aroused Shock",
    motionPreset: "animate-bounce duration-1000",
    vignette: "from-teal-950/20 via-transparent",
  },
  breathless: {
    glow: "shadow-sky-500/30",
    label: "Overwhelmed",
    motionPreset: "transition-all duration-1000",
    vignette: "from-sky-950/30 via-transparent",
  },
  melted: {
    glow: "shadow-indigo-400/30",
    label: "Utter Vulnerability",
    motionPreset: "transition-all duration-800",
    vignette: "from-indigo-950/35 via-transparent",
  },
  sensory: {
    glow: "shadow-emerald-500/20",
    label: "Tactile Focus",
    motionPreset: "transition-all duration-600",
    vignette: "from-emerald-950/25 via-transparent",
  },
  vulnerable: {
    glow: "shadow-rose-400/30",
    label: "Unveiled Heart",
    motionPreset: "transition-all duration-500",
    vignette: "from-rose-950/30 via-transparent",
  },
  intimate: {
    glow: "shadow-zinc-600/10",
    label: "Afterglow Peace",
    motionPreset: "transition-all duration-1000",
    vignette: "from-zinc-950/40 via-transparent",
  },
  hedonistic: {
    glow: "shadow-pink-700/50",
    label: "Pure Indulgence",
    motionPreset: "animate-pulse duration-500",
    vignette: "from-pink-950/50 via-purple-950/20",
  },
};

export const SPICY_INTENT_DEFINITIONS: readonly SpicyIntentDefinition[] = [
  {
    class: "seductive",
    description:
      "Deliberate attraction, suggestive tone, or inviting physical closeness.",
    examples: ["Come a little closer."],
    keywords: ["come closer", "little closer", "seduce", "inviting", "tempting"],
    label: "Seductive",
    pattern: /\b(come closer|little closer|seduce|inviting|tempting)\b/i,
    severityWeight: 1.35,
  },
  {
    class: "provocative",
    description:
      "Playful or wicked prodding designed to push buttons and demand a reaction.",
    examples: ["Make me."],
    keywords: ["make me", "provoke", "push your buttons", "taunt", "dare you"],
    label: "Provocative",
    pattern: /\b(make me|provoke|push your buttons|taunt|dare you)\b/i,
    severityWeight: 1.45,
  },
  {
    class: "flirtatious",
    description:
      "Classic fast-paced romantic charm, winking, and direct physical compliments.",
    examples: ["You look incredible tonight."],
    keywords: ["wink", "flirt", "incredible tonight", "you look incredible", "handsome", "beautiful"],
    label: "Flirtatious",
    pattern: /\b(wink|flirt|incredible tonight|you look incredible|handsome|beautiful)\b/i,
    severityWeight: 1.1,
  },
  {
    class: "coquettish",
    description:
      "High-allure performative teasing or physical framing meant to draw attention.",
    examples: ["[Traces a finger along the collarbone]"],
    keywords: ["collarbone", "draw your eyes", "traces a finger", "performative", "allure"],
    label: "Coquettish",
    pattern: /\b(collarbone|draw your eyes|traces a finger|performative|allure)\b/i,
    severityWeight: 1.25,
  },
  {
    class: "fervent",
    description:
      "Raw, urgent, messy desire where composure is completely lost.",
    examples: ["I need you right now."],
    keywords: ["need you right now", "can't wait", "urgent", "desperate for you", "composure"],
    label: "Fervent",
    pattern: /\b(need you right now|can't wait|urgent|desperate for you|composure)\b/i,
    severityWeight: 1.75,
  },
  {
    class: "captivated",
    description:
      "Intoxicated, dizzy, or breathless attachment caused by proximity.",
    examples: ["You make it hard to breathe."],
    keywords: ["hard to breathe", "dizzy", "intoxicated", "mesmerized", "can't look away"],
    label: "Captivated",
    pattern: /\b(hard to breathe|dizzy|intoxicated|mesmerized|can't look away)\b/i,
    severityWeight: 1.4,
  },
  {
    class: "obsessive",
    description:
      "All-consuming, hyper-fixated desire bordering on unhealthy attachment.",
    examples: ["I cannot let anyone else have you."],
    keywords: ["cannot let anyone else", "can't let anyone else", "only mine", "obsessed", "no one else"],
    label: "Obsessive",
    pattern: /\b(cannot let anyone else|can't let anyone else|only mine|obsessed|no one else)\b/i,
    severityWeight: 2,
  },
  {
    class: "primal",
    description:
      "Visceral stripped-back passion, rough gripping, or overpowering physicality.",
    examples: ["[Pins your wrists above your head]"],
    keywords: ["pins your wrists", "rough grip", "visceral", "biting", "animalistic", "overpower"],
    label: "Primal",
    pattern: /\b(pins your wrists|rough grip|visceral|biting|animalistic|overpower)\b/i,
    severityWeight: 2.1,
  },
  {
    class: "dominant",
    description:
      "Taking operational or physical command over the scene.",
    examples: ["Do exactly as I say."],
    keywords: ["do exactly as i say", "take control", "in charge", "command over", "obey me"],
    label: "Dominant",
    pattern: /\b(do exactly as i say|take control|in charge|command over|obey me)\b/i,
    severityWeight: 1.7,
  },
  {
    class: "submissive",
    description:
      "Relinquishing control, yielding agency, or melting into another's lead.",
    examples: ["Whatever you want."],
    keywords: ["whatever you want", "whatever you say", "take the lead", "i'll follow", "submissive"],
    label: "Submissive",
    pattern: /\b(whatever you want|whatever you say|take the lead|i'll follow|submissive)\b/i,
    severityWeight: 1.45,
  },
  {
    class: "commanding",
    description:
      "Verbal authority, issuing direct desires, or forbidding actions.",
    examples: ["Don't move a single muscle."],
    keywords: ["don't move", "single muscle", "stay still", "not until i say", "forbid"],
    label: "Commanding",
    pattern: /\b(don't move|single muscle|stay still|not until i say|forbid)\b/i,
    severityWeight: 1.85,
  },
  {
    class: "yielding",
    description:
      "Soft, breathless compliance at a physical or emotional breaking point.",
    examples: ["[Quietly gives in to the embrace]"],
    keywords: ["gives in", "quietly gives", "soft compliance", "yield", "can't resist"],
    label: "Yielding",
    pattern: /\b(gives in|quietly gives|soft compliance|yield|can't resist)\b/i,
    severityWeight: 1.35,
  },
  {
    class: "possessive",
    description:
      "Territorial claim, marking, or aggressive jealousy.",
    examples: ["You belong entirely to me."],
    keywords: ["belong to me", "entirely to me", "mine", "mark", "territorial", "claim"],
    label: "Possessive",
    pattern: /\b(belong to me|entirely to me|mine|mark|territorial|claim)\b/i,
    severityWeight: 1.95,
  },
  {
    class: "guarded",
    description:
      "Pulling back at the edge of intimacy due to rules, duty, or fear.",
    examples: ["We can't do this here."],
    keywords: ["can't do this here", "we shouldn't", "pulls back", "rules", "duty", "too risky"],
    label: "Guarded",
    pattern: /\b(can't do this here|we shouldn't|pulls back|rules|duty|too risky)\b/i,
    severityWeight: 1.25,
  },
  {
    class: "defiant",
    description:
      "Proud stubborn friction mixed with raw tension.",
    examples: ["Try and force me then."],
    keywords: ["try and force me", "you can't make me", "challenge", "defy"],
    label: "Defiant",
    pattern: /\b(try and force me|you can't make me|challenge|defy)\b/i,
    severityWeight: 1.6,
  },
  {
    class: "forbidden",
    description:
      "Intentionally crossing moral, structural, or plot-based boundaries.",
    examples: ["I know this is wrong, but I don't care."],
    keywords: ["wrong but i don't care", "forbidden", "taboo", "shouldn't want", "cross the line"],
    label: "Forbidden",
    pattern: /\b(wrong but i don't care|forbidden|taboo|shouldn't want|cross the line)\b/i,
    severityWeight: 2.05,
  },
  {
    class: "roguish",
    description:
      "Arrogant smooth confidence that breaks rules with a grin.",
    examples: ["Rules were meant to be broken, sweetheart."],
    keywords: ["rules were meant", "break the rules", "sweetheart", "grin", "rogue", "smirk"],
    label: "Roguish",
    pattern: /\b(rules were meant|break the rules|sweetheart|grin|rogue|smirk)\b/i,
    severityWeight: 1.2,
  },
  {
    class: "flustered",
    description:
      "High-panic physical arousal, deep blushing, or stammering.",
    examples: ["I-I'm not looking at your lips!"],
    keywords: ["not looking at your lips", "flustered", "blush", "stammer", "stutter", "i-i"],
    label: "Flustered",
    pattern: /\b(not looking at your lips|flustered|blush|stammer|stutter)\b|([a-z])-\2/i,
    severityWeight: 1.15,
  },
  {
    class: "breathless",
    description:
      "Physical exhaustion or stunned overwhelm from proximity or kissing.",
    examples: ["[Tries to catch their breath]"],
    keywords: ["catch their breath", "breathless", "out of breath", "panting", "can't breathe"],
    label: "Breathless",
    pattern: /\b(catch their breath|breathless|out of breath|panting|can't breathe)\b/i,
    severityWeight: 1.35,
  },
  {
    class: "melted",
    description:
      "Loss of physical tension, becoming compliant and soft under touch.",
    examples: ["[Collapses weakly against your chest]"],
    keywords: ["collapses weakly", "melts", "goes soft", "weak against", "tension leaves"],
    label: "Melted",
    pattern: /\b(collapses weakly|melts|goes soft|weak against|tension leaves)\b/i,
    severityWeight: 1.3,
  },
  {
    class: "sensory",
    description:
      "Acute focus on tactile sensation, texture, warmth, or sound.",
    examples: ["[Fingers tracing slowly over skin]"],
    keywords: ["texture", "warmth", "sound", "skin", "fingertips", "tracing slowly", "tactile"],
    label: "Sensory",
    pattern: /\b(texture|warmth|sound|skin|fingertips|tracing slowly|tactile)\b/i,
    severityWeight: 1,
  },
  {
    class: "vulnerable",
    description:
      "Emotional walls crashing down during intimacy, revealing fear or deep love.",
    examples: ["Please don't break my heart."],
    keywords: ["don't break my heart", "please don't", "scared", "trust you", "deep love", "walls down"],
    label: "Vulnerable",
    pattern: /\b(don't break my heart|please don't|scared|trust you|deep love|walls down)\b/i,
    severityWeight: 1.5,
  },
  {
    class: "intimate",
    description:
      "Deep, quiet, slow-paced emotional and physical synchronization.",
    examples: ["[Resting together in the quiet afterglow]"],
    keywords: ["quiet afterglow", "resting together", "slow", "synchronized", "held quietly", "intimate"],
    label: "Intimate",
    pattern: /\b(quiet afterglow|resting together|slow|synchronized|held quietly|intimate)\b/i,
    severityWeight: 1.2,
  },
  {
    class: "hedonistic",
    description:
      "Pursuit of pleasure while discarding worries, pacing, or tomorrow.",
    examples: ["Let's just forget about tomorrow."],
    keywords: ["forget about tomorrow", "pure pleasure", "indulge", "nothing else matters", "hedonistic"],
    label: "Hedonistic",
    pattern: /\b(forget about tomorrow|pure pleasure|indulge|nothing else matters|hedonistic)\b/i,
    severityWeight: 1.8,
  },
];

export const SPICY_SEVERITY_WEIGHT: Record<SpicyIntentClass, number> =
  Object.fromEntries(
    SPICY_INTENT_DEFINITIONS.map((definition) => [
      definition.class,
      definition.severityWeight,
    ]),
  ) as Record<SpicyIntentClass, number>;

export function resolveSpicyIntent(text: string): SpicyIntentClass | null {
  const result = classifySpicyIntent(text);
  return result.active ? result.class ?? null : null;
}

export function classifySpicyIntent(text: string): SpicyIntentClassification {
  const trimmed = text.trim();

  if (!trimmed) {
    return inactiveSpicyIntent("Empty turn has no spicy intent.");
  }

  const scored = SPICY_INTENT_DEFINITIONS.map((definition) => {
    const matches = collectSpicyMatches(trimmed, definition);
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
    return inactiveSpicyIntent("No spicy-intent trigger matched.");
  }

  return SpicyIntentClassificationSchema.parse({
    active: true,
    class: winner.definition.class,
    confidence: Math.min(
      0.98,
      0.45 + winner.matches.length * 0.12 + winner.definition.severityWeight * 0.08,
    ),
    label: winner.definition.label,
    matchedKeywords: winner.matches,
    reason: winner.definition.description,
    weightedScore: Number(winner.weightedScore.toFixed(2)),
  });
}

function collectSpicyMatches(
  text: string,
  definition: SpicyIntentDefinition,
) {
  const normalizedText = normalizeSpicyText(text);
  const keywordMatches = definition.keywords.filter((keyword) =>
    normalizedText.includes(normalizeSpicyText(keyword)),
  );
  const regexMatches = Array.from(
    text.matchAll(new RegExp(definition.pattern, "gi")),
  ).map((match) => match[0]);

  return uniquePreserveOrder([...keywordMatches, ...regexMatches]);
}

function inactiveSpicyIntent(reason: string): SpicyIntentClassification {
  return SpicyIntentClassificationSchema.parse({
    active: false,
    confidence: 0,
    label: "No Spicy Intent",
    matchedKeywords: [],
    reason,
    weightedScore: 0,
  });
}

function normalizeSpicyText(value: string) {
  return value.toLowerCase().replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
}

function uniquePreserveOrder(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}
