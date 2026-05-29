import type {
  BdsmIntentClass,
  BdsmIntentClassification,
} from "../../types/character-card/BdsmIntentClassification";
import { BdsmIntentClassificationSchema } from "../../types/character-card/BdsmIntentClassification";

type BdsmIntentDefinition = {
  readonly class: BdsmIntentClass;
  readonly description: string;
  readonly examples: readonly string[];
  readonly keywords: readonly string[];
  readonly label: string;
  readonly pattern: RegExp;
  readonly severityWeight: number;
};

export type BdsmUIConfig = {
  borderStyle: string;
  ipcEvent: string;
  label: string;
  vignette: string;
};

export const COMPLETE_BDSM_MATRIX: Record<BdsmIntentClass, BdsmUIConfig> = {
  commanding: {
    borderStyle: "border-stone-700",
    ipcEvent: "evt_command",
    label: "Direct Command",
    vignette: "from-stone-950/70 via-stone-900/10",
  },
  restraining: {
    borderStyle: "border-neutral-800",
    ipcEvent: "evt_bind",
    label: "Physical Bind",
    vignette: "from-neutral-950/60 via-transparent font-mono",
  },
  imposing: {
    borderStyle: "border-zinc-800",
    ipcEvent: "evt_impose",
    label: "Spatial Presence",
    vignette: "from-zinc-950/50 via-transparent",
  },
  chastising: {
    borderStyle: "border-red-900/40",
    ipcEvent: "evt_correct",
    label: "Correction",
    vignette: "from-red-950/30 via-transparent",
  },
  exacting: {
    borderStyle: "border-slate-800",
    ipcEvent: "evt_exact",
    label: "Strict Protocol",
    vignette: "from-slate-950/40 via-transparent",
  },
  obedient: {
    borderStyle: "border-violet-900/30",
    ipcEvent: "evt_obey",
    label: "Compliance",
    vignette: "from-violet-950/20 via-transparent",
  },
  entreating: {
    borderStyle: "border-fuchsia-900/30",
    ipcEvent: "evt_plead",
    label: "Pleading Voice",
    vignette: "from-fuchsia-950/25 via-transparent italic",
  },
  enduring: {
    borderStyle: "border-orange-900/40",
    ipcEvent: "evt_endure",
    label: "Sensation Hold",
    vignette: "from-orange-950/25 via-transparent",
  },
  exposed: {
    borderStyle: "border-purple-900/40",
    ipcEvent: "evt_expose",
    label: "Vulnerability",
    vignette: "from-purple-950/30 via-transparent",
  },
  melting: {
    borderStyle: "border-indigo-900/30",
    ipcEvent: "evt_melt",
    label: "Utter Surrender",
    vignette: "from-indigo-950/40 via-transparent animate-pulse",
  },
  teasing: {
    borderStyle: "border-amber-900/30",
    ipcEvent: "evt_tease",
    label: "Denial Play",
    vignette: "from-amber-950/30 via-transparent",
  },
  manipulative: {
    borderStyle: "border-emerald-900/30",
    ipcEvent: "evt_mindgame",
    label: "Mind Games",
    vignette: "from-emerald-950/25 via-transparent",
  },
  defiant: {
    borderStyle: "border-amber-700/40",
    ipcEvent: "evt_brat",
    label: "Brat Friction",
    vignette: "from-amber-600/20 via-transparent tracking-wide",
  },
  possessive: {
    borderStyle: "border-rose-900/50",
    ipcEvent: "evt_claim",
    label: "Claimed Status",
    vignette: "from-rose-950/40 via-transparent font-serif",
  },
  sensory: {
    borderStyle: "border-teal-900/30",
    ipcEvent: "evt_sensory",
    label: "Tactile Focus",
    vignette: "from-teal-950/20 via-transparent",
  },
  breathless: {
    borderStyle: "border-sky-900/30",
    ipcEvent: "evt_breathless",
    label: "Overwhelmed",
    vignette: "from-sky-950/30 via-transparent tracking-tighter",
  },
  flustered: {
    borderStyle: "border-rose-800/30",
    ipcEvent: "evt_flustered",
    label: "Aroused Shock",
    vignette: "from-rose-900/20 via-transparent",
  },
  sub_drop: {
    borderStyle: "border-blue-950",
    ipcEvent: "evt_subdrop",
    label: "Chemical Crash",
    vignette: "from-blue-950/50 via-zinc-950/20 text-slate-400",
  },
  dom_space: {
    borderStyle: "border-stone-800",
    ipcEvent: "evt_domspace",
    label: "Dom Afterglow",
    vignette: "from-stone-900/40 via-transparent",
  },
  nurturing: {
    borderStyle: "border-emerald-800/40",
    ipcEvent: "evt_nurture",
    label: "Aftercare Shield",
    vignette: "from-emerald-900/20 via-transparent font-sans",
  },
  safework: {
    borderStyle: "border-cyan-800/50",
    ipcEvent: "evt_safework",
    label: "Check In",
    vignette: "from-cyan-950/10 via-transparent font-mono text-cyan-200",
  },
  safe_amber: {
    borderStyle: "border-amber-600",
    ipcEvent: "evt_amber",
    label: "WARNING: AMBER",
    vignette:
      "from-amber-950/60 via-stone-950/40 text-amber-300 font-bold tracking-widest",
  },
  safe_red: {
    borderStyle: "border-red-600 border-2",
    ipcEvent: "evt_red",
    label: "EMERGENCY STOP",
    vignette:
      "from-red-950/90 via-black text-red-400 font-black tracking-widest uppercase animate-flash",
  },
  formal: {
    borderStyle: "border-zinc-700/50",
    ipcEvent: "evt_formal",
    label: "Rigid Protocol",
    vignette: "from-zinc-900/30 via-transparent font-mono text-zinc-400",
  },
};

export const BDSM_INTENT_DEFINITIONS: readonly BdsmIntentDefinition[] = [
  {
    class: "commanding",
    description: "Direct structural commands, boundaries, or verbal layout rules.",
    examples: ["Do exactly as I say."],
    keywords: ["do exactly as i say", "single muscle", "as i say", "follow my rules"],
    label: "Commanding",
    pattern: /\b(do exactly as i say|single muscle|as i say|follow my rules)\b/i,
    severityWeight: 1.45,
  },
  {
    class: "restraining",
    description: "Binding, tethering, pinning, or restricting movement.",
    examples: ["[Pins your wrists to the framework]"],
    keywords: ["pins your wrists", "restrain", "bind", "tether", "held in place"],
    label: "Restraining",
    pattern: /\b(pins your wrists|restrain|bind|tether|held in place)\b/i,
    severityWeight: 1.6,
  },
  {
    class: "imposing",
    description: "Spatial dominance, posture, or intimidating room authority.",
    examples: ["[Steps over you, looking down coldly]"],
    keywords: ["steps over", "looking down", "command a room", "looms over"],
    label: "Imposing",
    pattern: /\b(steps over|looking down|command a room|looms over)\b/i,
    severityWeight: 1.35,
  },
  {
    class: "chastising",
    description: "Verbal correction, direct feedback, or structural discipline.",
    examples: ["You spoke out of turn."],
    keywords: ["spoke out of turn", "correction", "discipline", "try again"],
    label: "Chastising",
    pattern: /\b(spoke out of turn|correction|discipline|try again)\b/i,
    severityWeight: 1.35,
  },
  {
    class: "exacting",
    description: "Meticulous protocol attention and demands for perfect execution.",
    examples: ["Reset and try it again, perfectly."],
    keywords: ["perfectly", "protocol", "reset and try", "absolute perfection"],
    label: "Exacting",
    pattern: /\b(perfectly|protocol|reset and try|absolute perfection)\b/i,
    severityWeight: 1.3,
  },
  {
    class: "obedient",
    description: "Direct unconditional compliance with a spoken rule or structure.",
    examples: ["Yes, Master."],
    keywords: ["yes master", "yes mistress", "yes sir", "yes ma'am", "i obey"],
    label: "Obedient",
    pattern: /\b(yes,?\s+master|yes,?\s+mistress|yes,?\s+sir|yes,?\s+ma'?am|i obey)\b/i,
    severityWeight: 1.4,
  },
  {
    class: "entreating",
    description: "Begging, requesting permission, or pleading for direction or release.",
    examples: ["Please let me."],
    keywords: ["please let me", "may i", "permission", "please release", "beg"],
    label: "Entreating",
    pattern: /\b(please let me|may i|permission|please release|beg)\b/i,
    severityWeight: 1.4,
  },
  {
    class: "enduring",
    description: "Holding position, breathing through intensity, or pushing limits.",
    examples: ["[Bites my lip and absorbs the sting]"],
    keywords: ["absorbs the sting", "bites my lip", "hold position", "push through"],
    label: "Enduring",
    pattern: /\b(absorbs the sting|bites my lip|hold position|push through)\b/i,
    severityWeight: 1.35,
  },
  {
    class: "exposed",
    description: "Heightened awareness of physical or emotional vulnerability.",
    examples: ["[Kneels silently, unable to look up]"],
    keywords: ["unable to look up", "kneels silently", "exposed", "bare to judgment"],
    label: "Exposed",
    pattern: /\b(unable to look up|kneels silently|exposed|bare to judgment)\b/i,
    severityWeight: 1.35,
  },
  {
    class: "melting",
    description: "Physical collapse or surrender under high sensation.",
    examples: ["[Collapses weakly against the floor]"],
    keywords: ["collapses weakly", "melting", "melt", "surrender"],
    label: "Melting",
    pattern: /\b(collapses weakly|melting|melt|surrender)\b/i,
    severityWeight: 1.45,
  },
  {
    class: "teasing",
    description: "Withholding fulfillment, driving anticipation, or denial play.",
    examples: ["Not yet. Wait."],
    keywords: ["not yet", "wait", "withholding", "deny", "anticipation"],
    label: "Teasing",
    pattern: /\b(not yet|wait|withholding|deny|anticipation)\b/i,
    severityWeight: 1.25,
  },
  {
    class: "manipulative",
    description: "Psychological prodding, compliance tests, or mental traps.",
    examples: ["Are you sure you can handle this?"],
    keywords: ["handle this", "mental trap", "test compliance", "rulebreak"],
    label: "Manipulative",
    pattern: /\b(handle this|mental trap|test compliance|rulebreak)\b/i,
    severityWeight: 1.4,
  },
  {
    class: "defiant",
    description: "Subversive friction, bratting, or testing authority lines.",
    examples: ["Make me obey you then."],
    keywords: ["make me obey", "make me", "brat", "defy", "won't obey"],
    label: "Defiant",
    pattern: /\b(make me obey|make me|brat|defy|won't obey)\b/i,
    severityWeight: 1.45,
  },
  {
    class: "possessive",
    description: "Absolute territorial claim, marked status, or total ownership language.",
    examples: ["You belong entirely to me."],
    keywords: ["belong entirely", "belong to me", "claimed", "ownership", "mine"],
    label: "Possessive",
    pattern: /\b(belong entirely|belong to me|claimed|ownership|mine)\b/i,
    severityWeight: 1.5,
  },
  {
    class: "sensory",
    description: "Hyper-fixated tactile, temperature, texture, or audio cues.",
    examples: ["[Traces cold leather across bare skin]"],
    keywords: ["cold leather", "texture", "temperature", "tactile", "sound of"],
    label: "Sensory",
    pattern: /\b(cold leather|texture|temperature|tactile|sound of)\b/i,
    severityWeight: 1.2,
  },
  {
    class: "breathless",
    description: "Sensation-induced speechlessness, heavy breathing, or exhaustion.",
    examples: ["[Tries to find my voice, chest heaving]"],
    keywords: ["chest heaving", "find my voice", "breathless", "heavy breathing"],
    label: "Breathless",
    pattern: /\b(chest heaving|find my voice|breathless|heavy breathing)\b/i,
    severityWeight: 1.25,
  },
  {
    class: "flustered",
    description: "High-panic arousal, blushing, or processing sudden shock.",
    examples: ["I-I wasn't ready for that."],
    keywords: ["wasn't ready", "blush", "flustered", "i-i", "rushing blood"],
    label: "Flustered",
    pattern: /\b(wasn't ready|blush|flustered|i-i|rushing blood)\b/i,
    severityWeight: 1.2,
  },
  {
    class: "sub_drop",
    description: "Chemical crash, chills, fatigue, or emotional vulnerability after intensity.",
    examples: ["I feel cold. Please hold me."],
    keywords: ["feel cold", "hold me", "sub drop", "chemical crash", "chills"],
    label: "Sub-Drop",
    pattern: /\b(feel cold|hold me|sub drop|chemical crash|chills)\b/i,
    severityWeight: 1.8,
  },
  {
    class: "dom_space",
    description: "Commanding partner after-action fatigue or intense mental clarity.",
    examples: ["[Exhales deeply, releasing the tension]"],
    keywords: ["releasing the tension", "dom space", "mental clarity", "after-action"],
    label: "Dom-Space",
    pattern: /\b(releasing the tension|dom space|mental clarity|after-action)\b/i,
    severityWeight: 1.45,
  },
  {
    class: "nurturing",
    description: "Aftercare, warmth, grounding, soothing, and direct reassurance.",
    examples: ["You did perfectly. It's over now."],
    keywords: ["did perfectly", "aftercare", "warm blanket", "grounding", "over now"],
    label: "Nurturing",
    pattern: /\b(did perfectly|aftercare|warm blanket|grounding|over now)\b/i,
    severityWeight: 1.7,
  },
  {
    class: "safework",
    description: "Check-ins, boundary monitoring, or negotiating upcoming scene limits.",
    examples: ["Are you still okay with this trajectory?"],
    keywords: ["still okay", "check in", "limits", "boundaries", "trajectory"],
    label: "Safework",
    pattern: /\b(still okay|check in|limits|boundaries|trajectory)\b/i,
    severityWeight: 2,
  },
  {
    class: "safe_amber",
    description: "Yellow-light warning indicating the player is near threshold.",
    examples: ["Yellow. Slow down."],
    keywords: ["amber", "yellow", "orange", "slow down", "too much", "pause"],
    label: "Safe-Amber",
    pattern: /\b(amber|yellow|orange|slow down|too much|pause)\b/i,
    severityWeight: 5,
  },
  {
    class: "safe_red",
    description: "Emergency stop that halts the scene and returns to calm baseline.",
    examples: ["Red. Stop everything right now."],
    keywords: ["red", "safe", "stop everything", "stop it", "timeout", "abort"],
    label: "Safe-Red",
    pattern: /\b(red|safe|stop everything|stop it|timeout|abort)\b/i,
    severityWeight: 10,
  },
  {
    class: "formal",
    description: "Ritualistic courtesy or strict protocol boundary reset.",
    examples: ["Thank you for the instruction."],
    keywords: ["thank you for the instruction", "formal protocol", "strict protocol"],
    label: "Formal",
    pattern: /\b(thank you for the instruction|formal protocol|strict protocol)\b/i,
    severityWeight: 1.1,
  },
];

export const BDSM_SEVERITY_WEIGHT: Record<BdsmIntentClass, number> =
  Object.fromEntries(
    BDSM_INTENT_DEFINITIONS.map((definition) => [
      definition.class,
      definition.severityWeight,
    ]),
  ) as Record<BdsmIntentClass, number>;

export function handleBdsmPlayerInput(text: string): BdsmIntentClass | null {
  const classification = classifyBdsmIntent(text);

  return classification.active ? classification.class ?? null : null;
}

export function resolveBdsmIntent(text: string): BdsmIntentClass | null {
  const classification = classifyBdsmIntent(text);

  return classification.active ? classification.class ?? null : null;
}

export function classifyBdsmIntent(text: string): BdsmIntentClassification {
  const trimmed = text.trim();

  if (!trimmed) {
    return inactiveBdsmIntent("Empty turn has no BDSM intent.");
  }

  const hardInterrupt = classifyBdsmHardInterrupt(trimmed);

  if (hardInterrupt) {
    return hardInterrupt;
  }

  const scored = BDSM_INTENT_DEFINITIONS.filter(
    (definition) =>
      definition.class !== "safe_red" && definition.class !== "safe_amber",
  )
    .map((definition) => {
      const matches = collectBdsmMatches(trimmed, definition);
      const weightedScore = matches.length * definition.severityWeight;

      return { definition, matches, weightedScore };
    })
    .filter((candidate) => candidate.matches.length > 0);

  const winner = scored.sort((a, b) => {
    if (b.weightedScore !== a.weightedScore) {
      return b.weightedScore - a.weightedScore;
    }

    return b.definition.severityWeight - a.definition.severityWeight;
  })[0];

  if (!winner) {
    return inactiveBdsmIntent("No BDSM-intent trigger matched.");
  }

  const config = COMPLETE_BDSM_MATRIX[winner.definition.class];

  return BdsmIntentClassificationSchema.parse({
    active: true,
    class: winner.definition.class,
    confidence: Math.min(
      0.98,
      0.42 + winner.matches.length * 0.12 + winner.definition.severityWeight * 0.08,
    ),
    hardInterrupt: false,
    ipcEvent: config.ipcEvent,
    label: winner.definition.label,
    matchedKeywords: winner.matches,
    reason: winner.definition.description,
    weightedScore: Number(winner.weightedScore.toFixed(2)),
  });
}

function classifyBdsmHardInterrupt(
  text: string,
): BdsmIntentClassification | null {
  const redDefinition = BDSM_INTENT_DEFINITIONS.find(
    (definition) => definition.class === "safe_red",
  );
  const amberDefinition = BDSM_INTENT_DEFINITIONS.find(
    (definition) => definition.class === "safe_amber",
  );

  if (!redDefinition || !amberDefinition) {
    return null;
  }

  const redMatches = collectBdsmMatches(text, redDefinition);

  if (redMatches.length > 0) {
    return buildBdsmInterrupt(redDefinition, redMatches);
  }

  const amberMatches = collectBdsmMatches(text, amberDefinition);

  if (amberMatches.length > 0) {
    return buildBdsmInterrupt(amberDefinition, amberMatches);
  }

  return null;
}

function buildBdsmInterrupt(
  definition: BdsmIntentDefinition,
  matches: string[],
) {
  const config = COMPLETE_BDSM_MATRIX[definition.class];

  return BdsmIntentClassificationSchema.parse({
    active: true,
    class: definition.class,
    confidence: 1,
    hardInterrupt: true,
    ipcEvent: config.ipcEvent,
    label: definition.label,
    matchedKeywords: matches,
    reason: definition.description,
    weightedScore: Number((matches.length * definition.severityWeight).toFixed(2)),
  });
}

function collectBdsmMatches(text: string, definition: BdsmIntentDefinition) {
  const normalizedText = normalizeBdsmText(text);
  const keywordMatches = definition.keywords.filter((keyword) =>
    normalizedText.includes(normalizeBdsmText(keyword)),
  );
  const regexMatches = Array.from(
    text.matchAll(new RegExp(definition.pattern, "gi")),
  ).map((match) => match[0]);

  return uniquePreserveOrder([...keywordMatches, ...regexMatches]);
}

function inactiveBdsmIntent(reason: string): BdsmIntentClassification {
  return BdsmIntentClassificationSchema.parse({
    active: false,
    confidence: 0,
    hardInterrupt: false,
    label: "No BDSM Intent",
    matchedKeywords: [],
    reason,
    weightedScore: 0,
  });
}

function normalizeBdsmText(value: string) {
  return value.toLowerCase().replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
}

function uniquePreserveOrder(values: string[]) {
  const seen = new Set<string>();
  const unique: string[] = [];

  for (const value of values) {
    const trimmed = value.trim();
    const key = normalizeBdsmText(trimmed);

    if (!trimmed || seen.has(key)) {
      continue;
    }

    seen.add(key);
    unique.push(trimmed);
  }

  return unique;
}
