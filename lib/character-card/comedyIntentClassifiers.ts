import type { RelationshipStats } from "./behaviorMacroClassifiers";
import type {
  ComedyIntentClass,
  ComedyIntentClassification,
  ComedyLanding,
} from "../../types/character-card/ComedyIntentClassification";
import { ComedyIntentClassificationSchema } from "../../types/character-card/ComedyIntentClassification";

type ComedyIntentDefinition = {
  readonly class: ComedyIntentClass;
  readonly description: string;
  readonly examples: readonly string[];
  readonly keywords: readonly string[];
  readonly label: string;
  readonly pattern: RegExp;
  readonly severityWeight: number;
};

export type ComedyUIConfig = {
  borderColor: string;
  bounceStyle: string;
  label: string;
  soundTrigger: string;
};

export const COMPLETE_COMEDY_MATRIX: Record<ComedyIntentClass, ComedyUIConfig> = {
  sarcastic: {
    borderColor: "border-cyan-400",
    bounceStyle: "hover:rotate-1",
    label: "Sarcastic Irony",
    soundTrigger: "sfx_rimshot",
  },
  deadpan: {
    borderColor: "border-zinc-500",
    bounceStyle: "transform-none",
    label: "Deadpan Flat",
    soundTrigger: "sfx_crickets",
  },
  snarky: {
    borderColor: "border-teal-400",
    bounceStyle: "hover:-translate-y-0.5",
    label: "Snarky Wit",
    soundTrigger: "sfx_whip",
  },
  bantering: {
    borderColor: "border-emerald-400",
    bounceStyle: "animate-pulse duration-700",
    label: "Playful Banter",
    soundTrigger: "sfx_ping",
  },
  teasing: {
    borderColor: "border-lime-400",
    bounceStyle: "hover:-rotate-1",
    label: "Affectionate Mock",
    soundTrigger: "sfx_giggle",
  },
  absurdist: {
    borderColor: "border-purple-400",
    bounceStyle: "animate-bounce duration-500",
    label: "Pure Nonsense",
    soundTrigger: "sfx_boing",
  },
  gremlin: {
    borderColor: "border-orange-500",
    bounceStyle: "animate-wiggle",
    label: "Gremlin Chaos",
    soundTrigger: "sfx_shatter",
  },
  goblin: {
    borderColor: "border-yellow-600",
    bounceStyle: "hover:scale-105",
    label: "Feral Goblin",
    soundTrigger: "sfx_munch",
  },
  delusional: {
    borderColor: "border-fuchsia-400",
    bounceStyle: "hover:translate-x-1",
    label: "Hyper Confidence",
    soundTrigger: "sfx_sparkle",
  },
  exaggerated: {
    borderColor: "border-indigo-400",
    bounceStyle: "animate-ping duration-1000",
    label: "Massive Tragedy",
    soundTrigger: "sfx_violin",
  },
  exasperated: {
    borderColor: "border-slate-600",
    bounceStyle: "hover:translate-y-1",
    label: "Done With This",
    soundTrigger: "sfx_sigh",
  },
  panicked: {
    borderColor: "border-red-500",
    bounceStyle: "animate-bounce text-lg",
    label: "Over The Top",
    soundTrigger: "sfx_scream",
  },
  clueless: {
    borderColor: "border-sky-300",
    bounceStyle: "hover:skew-x-3",
    label: "Pure Oblivion",
    soundTrigger: "sfx_empty",
  },
  awkward: {
    borderColor: "border-amber-700",
    bounceStyle: "animate-shake",
    label: "Cringe Fumble",
    soundTrigger: "sfx_record_scratch",
  },
  deflective: {
    borderColor: "border-yellow-400",
    bounceStyle: "hover:-translate-x-1",
    label: "Topic Pivot",
    soundTrigger: "sfx_slide",
  },
  meta: {
    borderColor: "border-pink-500",
    bounceStyle: "font-mono tracking-widest",
    label: "Breaking The Wall",
    soundTrigger: "sfx_glitch",
  },
  genre_savvy: {
    borderColor: "border-blue-400",
    bounceStyle: "font-sans font-bold",
    label: "Trope Breaker",
    soundTrigger: "sfx_chime",
  },
  parodying: {
    borderColor: "border-rose-400",
    bounceStyle: "italic tracking-wide",
    label: "Mock Drama",
    soundTrigger: "sfx_orchestra",
  },
  sceptical: {
    borderColor: "border-stone-400",
    bounceStyle: "opacity-80",
    label: "Dead-Eyed Doubt",
    soundTrigger: "sfx_hmmm",
  },
  goofy: {
    borderColor: "border-amber-400",
    bounceStyle: "animate-bounce",
    label: "Silly Energy",
    soundTrigger: "sfx_honk",
  },
  sappy: {
    borderColor: "border-pink-300",
    bounceStyle: "font-serif text-rose-300",
    label: "Unironic Cringe",
    soundTrigger: "sfx_harp",
  },
  cheerleading: {
    borderColor: "border-green-400",
    bounceStyle: "scale-110 font-black",
    label: "Toxic Positivity",
    soundTrigger: "sfx_fanfare",
  },
  braggart: {
    borderColor: "border-yellow-500",
    bounceStyle: "-translate-y-1 uppercase",
    label: "Pompous Ego",
    soundTrigger: "sfx_trumpet",
  },
  clownish: {
    borderColor: "border-orange-400",
    bounceStyle: "rotate-3 hover:-rotate-3",
    label: "Self Deprecating",
    soundTrigger: "sfx_slip",
  },
};

export const COMEDY_INTENT_DEFINITIONS: readonly ComedyIntentDefinition[] = [
  {
    class: "sarcastic",
    description: "Dry mockery, saying the opposite of what is meant with irony.",
    examples: ["Oh, wonderful. Another dragon."],
    keywords: ["oh wonderful", "fantastic", "great, just great", "how convenient"],
    label: "Sarcastic",
    pattern: /\b(oh,?\s+wonderful|fantastic|great,? just great|how convenient)\b/i,
    severityWeight: 1.25,
  },
  {
    class: "deadpan",
    description: "Unblinking understatement in chaos or intense romance.",
    examples: ["Cool story."],
    keywords: ["cool story", "noted", "sure", "okay then", "neat"],
    label: "Deadpan",
    pattern: /\b(cool story|noted|okay then|neat)\b/i,
    severityWeight: 1,
  },
  {
    class: "snarky",
    description: "Quick-witted, slightly biting insults aimed at ego.",
    examples: ["Nice outfit. Did you get it from a dumpster?"],
    keywords: ["nice outfit", "dumpster", "genius move", "brilliant plan"],
    label: "Snarky",
    pattern: /\b(nice outfit|dumpster|genius move|brilliant plan)\b/i,
    severityWeight: 1.35,
  },
  {
    class: "bantering",
    description: "Rapid-fire playful back-and-forth where neither side is serious.",
    examples: ["You wish you were that clever."],
    keywords: ["you wish", "that clever", "keep up", "is that all you've got"],
    label: "Bantering",
    pattern: /\b(you wish|that clever|keep up|is that all you've got)\b/i,
    severityWeight: 1.2,
  },
  {
    class: "teasing",
    description: "Affection hidden inside mild, lighthearted mockery.",
    examples: ["Look at you, getting all blushed over a simple hello."],
    keywords: ["look at you", "blushed", "simple hello", "adorable", "getting shy"],
    label: "Teasing",
    pattern: /\b(look at you|blushed|simple hello|adorable|getting shy)\b/i,
    severityWeight: 1.15,
  },
  {
    class: "absurdist",
    description: "Bizarre non-sequiturs or nonsense logic that derails the scene.",
    examples: ["I can't marry you, I am currently legally a potato."],
    keywords: ["legally a potato", "non sequitur", "bizarre logic", "sentient spoon"],
    label: "Absurdist",
    pattern: /\b(legally a potato|non sequitur|bizarre logic|sentient spoon)\b/i,
    severityWeight: 1.6,
  },
  {
    class: "gremlin",
    description: "Chaotic, feral, mischievous choices made to cause trouble.",
    examples: ["[Intentionally knocks their expensive wine glass off the table]"],
    keywords: ["knocks", "wine glass", "watch the world burn", "chaotic option"],
    label: "Gremlin",
    pattern: /\b(knocks|wine glass|watch the world burn|chaotic option)\b/i,
    severityWeight: 1.75,
  },
  {
    class: "goblin",
    description: "Food, loot, hoarding, or feral priorities mid-dialogue.",
    examples: ["Can I eat this rock?"],
    keywords: ["eat this rock", "hoard", "loot", "snack", "can i eat"],
    label: "Goblin",
    pattern: /\b(eat this rock|hoard|loot|snack|can i eat)\b/i,
    severityWeight: 1.45,
  },
  {
    class: "delusional",
    description: "Hyper-confidently clinging to an obviously false reality.",
    examples: ["It's just their love language!"],
    keywords: ["love language", "obviously fine", "they adore me", "this is normal"],
    label: "Delusional",
    pattern: /\b(love language|obviously fine|they adore me|this is normal)\b/i,
    severityWeight: 1.55,
  },
  {
    class: "exaggerated",
    description: "A tiny inconvenience framed as a world-ending tragedy.",
    examples: ["I dropped my spoon. My life is fundamentally ruined."],
    keywords: ["fundamentally ruined", "my life is over", "world-ending", "tiny tragedy"],
    label: "Exaggerated",
    pattern: /\b(fundamentally ruined|my life is over|world-ending|tiny tragedy)\b/i,
    severityWeight: 1.4,
  },
  {
    class: "exasperated",
    description: "Being completely done with the plot, chaos, or dramatic antics.",
    examples: ["[Deep, exhausting sigh]"],
    keywords: ["deep sigh", "exhausting sigh", "done with this", "not this again"],
    label: "Exasperated",
    pattern: /\b(deep sigh|exhausting sigh|done with this|not this again)\b/i,
    severityWeight: 1.3,
  },
  {
    class: "panicked",
    description: "Screaming overreaction to minor stakes or sudden plot jumps.",
    examples: ["Everything is on fire and we're all going to die!"],
    keywords: ["everything is on fire", "going to die", "oh my god", "panic"],
    label: "Panicked",
    pattern: /\b(everything is on fire|going to die|oh my god|panic)\b/i,
    severityWeight: 1.7,
  },
  {
    class: "clueless",
    description: "Obliviousness to obvious tension, danger, or plot twists.",
    examples: ["Wait, we were fighting? I thought we were dancing!"],
    keywords: ["we were fighting", "thought we were dancing", "wait what", "missed that"],
    label: "Clueless",
    pattern: /\b(we were fighting|thought we were dancing|wait what|missed that)\b/i,
    severityWeight: 1.25,
  },
  {
    class: "awkward",
    description: "Cringe-inducing conversational fumbling.",
    examples: ["Uh... thanks. You have... nice teeth."],
    keywords: ["nice teeth", "uh thanks", "awkward", "what do hands do"],
    label: "Awkward",
    pattern: /\b(nice teeth|uh thanks|awkward|what do hands do)\b/i,
    severityWeight: 1.2,
  },
  {
    class: "deflective",
    description: "Terrible jokes or sudden pivots to dodge vulnerability.",
    examples: ["Hey look, a very shiny beetle!"],
    keywords: ["shiny beetle", "deep question", "anyway", "moving on"],
    label: "Deflective",
    pattern: /\b(shiny beetle|deep question|anyway|moving on)\b/i,
    severityWeight: 1.35,
  },
  {
    class: "meta",
    description: "Directly breaking the fourth wall or commenting on game structure.",
    examples: ["I only picked this dialogue option because the others looked boring."],
    keywords: ["dialogue option", "fourth wall", "game design", "choice menu"],
    label: "Meta",
    pattern: /\b(dialogue option|fourth wall|game design|choice menu)\b/i,
    severityWeight: 1.6,
  },
  {
    class: "genre_savvy",
    description: "Predicting and dodging tropes before they happen.",
    examples: ["I'm not going into that alley. That's where the flashback happens."],
    keywords: ["tragic flashback", "that's where", "trope", "genre savvy"],
    label: "Genre-Savvy",
    pattern: /\b(tragic flashback|that's where|trope|genre savvy)\b/i,
    severityWeight: 1.45,
  },
  {
    class: "parodying",
    description: "Mocking a dramatic or spicy archetype through exaggerated mimicry.",
    examples: ["[Leans against the wall with ridiculous smouldering intensity]"],
    keywords: ["ridiculous smouldering", "smouldering", "mock drama", "parody"],
    label: "Parodying",
    pattern: /\b(ridiculous smouldering|smouldering|mock drama|parody)\b/i,
    severityWeight: 1.4,
  },
  {
    class: "sceptical",
    description: "Dead-eyed refusal to believe the dramatic premise.",
    examples: ["Right. You're a vampire. And I'm the Queen of England."],
    keywords: ["queen of england", "right, you're", "sure you are", "sceptical"],
    label: "Sceptical",
    pattern: /\b(queen of england|right, you're|sure you are|sceptical)\b/i,
    severityWeight: 1.3,
  },
  {
    class: "goofy",
    description: "Silly, uncoordinated energy meant to make someone smile.",
    examples: ["[Makes a ridiculous face to break the tension]"],
    keywords: ["ridiculous face", "goofy", "silly", "funny face"],
    label: "Goofy",
    pattern: /\b(ridiculous face|goofy|silly|funny face)\b/i,
    severityWeight: 1.1,
  },
  {
    class: "sappy",
    description: "Cheesy or cringe romantic lines deployed for comedy.",
    examples: ["Did it hurt when you fell from heaven?"],
    keywords: ["fell from heaven", "cheesy", "pick-up line", "out of this world"],
    label: "Sappy",
    pattern: /\b(fell from heaven|cheesy|pick-up line|out of this world)\b/i,
    severityWeight: 1.15,
  },
  {
    class: "cheerleading",
    description: "Blind, aggressively enthusiastic, unhelpful positivity.",
    examples: ["You failed spectacularly, but you looked amazing doing it!"],
    keywords: ["yay team", "looked amazing doing it", "failed spectacularly", "you've got this"],
    label: "Cheerleading",
    pattern: /\b(yay team|looked amazing doing it|failed spectacularly|you've got this)\b/i,
    severityWeight: 1.15,
  },
  {
    class: "braggart",
    description: "Cartoony self-aggrandizement nobody believes.",
    examples: ["Step aside, I am a god of tactical brilliance!"],
    keywords: ["god of tactical brilliance", "step aside", "behold my genius", "legendary"],
    label: "Braggart",
    pattern: /\b(god of tactical brilliance|step aside|behold my genius|legendary)\b/i,
    severityWeight: 1.25,
  },
  {
    class: "clownish",
    description: "Self-deprecating physical or verbal comedy.",
    examples: ["Don't worry, my head completely broke my fall!"],
    keywords: ["broke my fall", "my head", "self-deprecating", "i meant to do that"],
    label: "Clownish",
    pattern: /\b(broke my fall|my head|self-deprecating|i meant to do that)\b/i,
    severityWeight: 1.2,
  },
];

export const COMEDY_SEVERITY_WEIGHT: Record<ComedyIntentClass, number> =
  Object.fromEntries(
    COMEDY_INTENT_DEFINITIONS.map((definition) => [
      definition.class,
      definition.severityWeight,
    ]),
  ) as Record<ComedyIntentClass, number>;

export function resolveComedyIntent(text: string): ComedyIntentClass | null {
  const result = classifyComedyIntent(text);
  return result.active ? result.class ?? null : null;
}

export function classifyComedyIntent(
  text: string,
  relationshipStats?: Partial<RelationshipStats>,
): ComedyIntentClassification {
  const trimmed = text.trim();

  if (!trimmed) {
    return inactiveComedyIntent("Empty turn has no comedy intent.");
  }

  const scored = COMEDY_INTENT_DEFINITIONS.map((definition) => {
    const matches = collectComedyMatches(trimmed, definition);
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
    return inactiveComedyIntent("No comedy-intent trigger matched.");
  }

  return ComedyIntentClassificationSchema.parse({
    active: true,
    class: winner.definition.class,
    confidence: Math.min(
      0.98,
      0.42 + winner.matches.length * 0.12 + winner.definition.severityWeight * 0.08,
    ),
    label: winner.definition.label,
    landing: evaluateComedyLanding(winner.definition.class, relationshipStats),
    matchedKeywords: winner.matches,
    reason: winner.definition.description,
    weightedScore: Number(winner.weightedScore.toFixed(2)),
  });
}

function evaluateComedyLanding(
  comedyClass: ComedyIntentClass,
  stats?: Partial<RelationshipStats>,
): ComedyLanding {
  const trust = clampStat(stats?.trust ?? 50);
  const affection = clampStat(stats?.affection ?? 50);
  const highTrustChaos =
    ["gremlin", "goblin", "absurdist", "snarky"].includes(comedyClass) &&
    trust > 60;
  const lowTrustChaos =
    ["gremlin", "goblin", "snarky", "sarcastic"].includes(comedyClass) &&
    trust <= 40;

  if (highTrustChaos) {
    return {
      affectionDelta: 2,
      angstDelta: 0,
      landed: true,
      npcReaction: "PLAYFUL_SIGH",
      trustDelta: 0,
    };
  }

  if (lowTrustChaos) {
    return {
      affectionDelta: -1,
      angstDelta: 10,
      landed: false,
      npcReaction: "ANNOYED_FREEZE",
      trustDelta: -5,
    };
  }

  if (["goofy", "sappy", "cheerleading", "clownish"].includes(comedyClass)) {
    return {
      affectionDelta: affection >= 30 ? 2 : 0,
      angstDelta: -1,
      landed: affection >= 30,
      npcReaction: affection >= 30 ? "SOFTENED_SMILE" : "CONFUSED_BLINK",
      trustDelta: 1,
    };
  }

  if (["meta", "genre_savvy", "parodying"].includes(comedyClass)) {
    return {
      affectionDelta: 0,
      angstDelta: 0,
      landed: trust >= 35,
      npcReaction: trust >= 35 ? "AMUSED_SPARK" : "SOCIAL_STATIC",
      trustDelta: 0,
    };
  }

  return {
    affectionDelta: 1,
    angstDelta: 0,
    landed: true,
    npcReaction: "AMUSED_SPARK",
    trustDelta: 0,
  };
}

function collectComedyMatches(
  text: string,
  definition: ComedyIntentDefinition,
) {
  const normalizedText = normalizeComedyText(text);
  const keywordMatches = definition.keywords.filter((keyword) =>
    normalizedText.includes(normalizeComedyText(keyword)),
  );
  const regexMatches = Array.from(
    text.matchAll(new RegExp(definition.pattern, "gi")),
  ).map((match) => match[0]);

  return uniquePreserveOrder([...keywordMatches, ...regexMatches]);
}

function inactiveComedyIntent(reason: string): ComedyIntentClassification {
  return ComedyIntentClassificationSchema.parse({
    active: false,
    confidence: 0,
    label: "No Comedy Intent",
    matchedKeywords: [],
    reason,
    weightedScore: 0,
  });
}

function normalizeComedyText(value: string) {
  return value.toLowerCase().replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
}

function clampStat(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function uniquePreserveOrder(values: string[]) {
  const seen = new Set<string>();
  const unique: string[] = [];

  for (const value of values) {
    const trimmed = value.trim();
    const key = normalizeComedyText(trimmed);

    if (!trimmed || seen.has(key)) {
      continue;
    }

    seen.add(key);
    unique.push(trimmed);
  }

  return unique;
}
