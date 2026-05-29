import type {
  BehaviorMacroClass,
  BehaviorMacroClassification,
} from "@/types/character-card/CharacterCardMacroClassification";

type BehaviorMacroDefinition = {
  readonly class: BehaviorMacroClass;
  readonly label: string;
  readonly valence: BehaviorMacroClassification["valence"];
  readonly energy: BehaviorMacroClassification["energy"];
  readonly description: string;
  readonly examples: readonly string[];
  readonly keywords: readonly string[];
  readonly pattern: RegExp;
  readonly priority: number;
  readonly requiredStats?: Partial<RelationshipStats>;
};

export type RelationshipStats = {
  affection: number;
  charisma: number;
  confidence: number;
  jealousy: number;
  trust: number;
  angst: number;
};

export type PlayerTurnEvaluationInput = {
  eventContext?: string;
  relationshipStats?: Partial<RelationshipStats>;
  text: string;
};

export type BehaviorMacroUiConfig = {
  bg: string;
  border: string;
  color: string;
  label: string;
};

export type BehaviorMacroMatrixConfig = {
  defaultVignette: string;
  glowColor: string;
  label: string;
  textStyle: string;
};

export const HIGH_PRIORITY_CRISIS_CLASSES: readonly BehaviorMacroClass[] = [
  "hostile",
  "melodramatic",
  "vindictive",
  "hysterical",
  "resigned",
];

export const MID_PRIORITY_ACTION_CLASSES: readonly BehaviorMacroClass[] = [
  "coquettish",
  "bold",
  "defiant",
  "possessive",
  "manipulative",
];

export const LOW_PRIORITY_STATE_CLASSES: readonly BehaviorMacroClass[] = [
  "affectionate",
  "teasing",
  "earnest",
  "starstruck",
  "anxious",
  "sombre",
  "suspicious",
  "shocked",
  "apathetic",
  "defensive",
  "formal",
  "distant",
  "submissive",
];

export const BEHAVIOR_MACRO_UI_CONFIG: Record<
  BehaviorMacroClass,
  BehaviorMacroUiConfig
> = {
  affectionate: {
    bg: "bg-rose-950/30",
    border: "border-rose-900/40",
    color: "text-rose-400",
    label: "Warm & Close",
  },
  teasing: {
    bg: "bg-amber-950/30",
    border: "border-amber-900/40",
    color: "text-amber-400",
    label: "Playful Friction",
  },
  bold: {
    bg: "bg-orange-950/30",
    border: "border-orange-900/40",
    color: "text-orange-400",
    label: "Assertive",
  },
  earnest: {
    bg: "bg-emerald-950/20",
    border: "border-emerald-900/40",
    color: "text-emerald-300",
    label: "Pure Sincerity",
  },
  coquettish: {
    bg: "bg-pink-950/20",
    border: "border-pink-900/40",
    color: "text-pink-400",
    label: "Seductive Allure",
  },
  submissive: {
    bg: "bg-violet-950/30",
    border: "border-violet-900/40",
    color: "text-violet-400",
    label: "Yielding Agency",
  },
  possessive: {
    bg: "bg-fuchsia-950/20",
    border: "border-fuchsia-900/40",
    color: "text-fuchsia-400",
    label: "Territorial Envy",
  },
  defiant: {
    bg: "bg-amber-950/20",
    border: "border-amber-900/40",
    color: "text-amber-500",
    label: "Spiteful Pride",
  },
  sombre: {
    bg: "bg-slate-900/40",
    border: "border-slate-800/50",
    color: "text-slate-400",
    label: "Quiet Melancholy",
  },
  starstruck: {
    bg: "bg-yellow-950/10",
    border: "border-yellow-900/30",
    color: "text-yellow-300",
    label: "Total Awe",
  },
  resigned: {
    bg: "bg-cyan-950/20",
    border: "border-cyan-900/40",
    color: "text-cyan-600",
    label: "Fatalistic",
  },
  anxious: {
    bg: "bg-teal-950/15",
    border: "border-teal-900/40",
    color: "text-teal-200",
    label: "Flustered Shock",
  },
  shocked: {
    bg: "bg-blue-950/20",
    border: "border-blue-900/40",
    color: "text-blue-200",
    label: "Stunned Disbelief",
  },
  hysterical: {
    bg: "bg-orange-950/35",
    border: "border-orange-900/50",
    color: "text-orange-300",
    label: "Erratic Crisis",
  },
  apathetic: {
    bg: "bg-zinc-900/50",
    border: "border-zinc-800/50",
    color: "text-zinc-400",
    label: "Emotional Fatigue",
  },
  suspicious: {
    bg: "bg-lime-950/15",
    border: "border-lime-900/40",
    color: "text-lime-200",
    label: "Wary Cynicism",
  },
  distant: {
    bg: "bg-sky-950/30",
    border: "border-sky-900/40",
    color: "text-sky-400",
    label: "Emotional Guard",
  },
  melodramatic: {
    bg: "bg-purple-950/30",
    border: "border-purple-900/40",
    color: "text-purple-400",
    label: "High Angst",
  },
  hostile: {
    bg: "bg-red-950/30",
    border: "border-red-900/40",
    color: "text-red-400",
    label: "Active Conflict",
  },
  manipulative: {
    bg: "bg-indigo-950/25",
    border: "border-indigo-900/40",
    color: "text-indigo-300",
    label: "Calculated Intent",
  },
  vindictive: {
    bg: "bg-red-950/30",
    border: "border-red-900/40",
    color: "text-red-300",
    label: "Petty Revenge",
  },
  casual: {
    bg: "bg-zinc-950/30",
    border: "border-zinc-800/40",
    color: "text-zinc-400",
    label: "Neutral Talk",
  },
  formal: {
    bg: "bg-stone-900/30",
    border: "border-stone-800/50",
    color: "text-stone-300",
    label: "Rigid Courtesy",
  },
  defensive: {
    bg: "bg-neutral-900/30",
    border: "border-neutral-800/50",
    color: "text-neutral-300",
    label: "Vulnerability Guard",
  },
};

export const COMPLETE_EMOTIONAL_MATRIX: Record<
  BehaviorMacroClass,
  BehaviorMacroMatrixConfig
> = {
  affectionate: { label: "Warm Affinity", glowColor: "shadow-rose-500/20", textStyle: "font-serif text-rose-200", defaultVignette: "from-rose-950/20 via-transparent" },
  earnest: { label: "Pure Sincerity", glowColor: "shadow-emerald-500/20", textStyle: "font-sans text-emerald-200", defaultVignette: "from-emerald-950/10 via-transparent" },
  coquettish: { label: "Seductive Allure", glowColor: "shadow-pink-500/20", textStyle: "font-serif text-pink-200 italic", defaultVignette: "from-pink-950/25 via-transparent" },
  teasing: { label: "Playful Friction", glowColor: "shadow-amber-500/10", textStyle: "font-sans text-amber-200", defaultVignette: "from-amber-950/15 via-transparent" },
  starstruck: { label: "Starry Admiration", glowColor: "shadow-yellow-500/20", textStyle: "font-serif text-yellow-100 font-medium", defaultVignette: "from-yellow-950/10 via-transparent" },
  distant: { label: "Emotional Guard", glowColor: "shadow-sky-500/10", textStyle: "font-sans text-sky-200", defaultVignette: "from-sky-950/20 via-transparent" },
  melodramatic: { label: "High Drama", glowColor: "shadow-purple-500/30", textStyle: "font-serif text-purple-200 tracking-wide", defaultVignette: "from-purple-950/30 via-transparent" },
  sombre: { label: "Quiet Melancholy", glowColor: "shadow-slate-500/10", textStyle: "font-sans text-slate-300 italic", defaultVignette: "from-slate-900/40 via-transparent" },
  resigned: { label: "Tragic Acceptance", glowColor: "shadow-cyan-500/20", textStyle: "font-serif text-cyan-200", defaultVignette: "from-cyan-950/30 via-transparent" },
  possessive: { label: "Territorial Envy", glowColor: "shadow-fuchsia-500/20", textStyle: "font-serif text-fuchsia-300", defaultVignette: "from-fuchsia-950/25 via-transparent" },
  bold: { label: "Assertive Control", glowColor: "shadow-orange-500/20", textStyle: "font-sans text-orange-200 font-bold", defaultVignette: "from-orange-950/20 via-transparent" },
  defiant: { label: "Spiteful Pride", glowColor: "shadow-amber-600/20", textStyle: "font-sans text-amber-100 font-semibold", defaultVignette: "from-amber-950/25 via-transparent" },
  submissive: { label: "Yielding Agency", glowColor: "shadow-violet-500/10", textStyle: "font-serif text-violet-300 tracking-tight", defaultVignette: "from-violet-950/20 via-transparent" },
  manipulative: { label: "Calculated Intent", glowColor: "shadow-indigo-500/20", textStyle: "font-serif text-indigo-300 italic", defaultVignette: "from-indigo-950/25 via-transparent" },
  vindictive: { label: "Petty Revenge", glowColor: "shadow-red-500/20", textStyle: "font-sans text-red-300 tracking-wider", defaultVignette: "from-red-950/30 via-transparent" },
  anxious: { label: "Flustered Shock", glowColor: "shadow-teal-500/10", textStyle: "font-sans text-teal-200 tracking-tight", defaultVignette: "from-teal-950/15 via-transparent" },
  shocked: { label: "Stunned Disbelief", glowColor: "shadow-blue-500/20", textStyle: "font-sans text-blue-200 tracking-wide", defaultVignette: "from-blue-950/20 via-transparent" },
  hysterical: { label: "Erratic Crisis", glowColor: "shadow-orange-600/30", textStyle: "font-sans text-orange-300 uppercase tracking-tighter", defaultVignette: "from-orange-950/35 via-transparent" },
  apathetic: { label: "Emotional Fatigue", glowColor: "shadow-zinc-700/10", textStyle: "font-mono text-zinc-400", defaultVignette: "from-zinc-900/50 via-transparent" },
  suspicious: { label: "Wary Cynicism", glowColor: "shadow-lime-500/10", textStyle: "font-sans text-lime-200 italic", defaultVignette: "from-lime-950/15 via-transparent" },
  casual: { label: "Neutral Focus", glowColor: "shadow-transparent", textStyle: "font-sans text-zinc-300", defaultVignette: "from-transparent" },
  hostile: { label: "Active Aggression", glowColor: "shadow-red-600/40", textStyle: "font-sans text-red-100 font-black tracking-wide", defaultVignette: "from-red-950/40 via-transparent" },
  formal: { label: "Rigid Courtesy", glowColor: "shadow-stone-500/10", textStyle: "font-mono text-stone-300 tracking-wide", defaultVignette: "from-stone-900/30 via-transparent" },
  defensive: { label: "Vulnerability Guard", glowColor: "shadow-neutral-500/10", textStyle: "font-sans text-neutral-300", defaultVignette: "from-neutral-900/30 via-transparent" },
};

const DEFAULT_RELATIONSHIP_STATS: RelationshipStats = {
  affection: 50,
  angst: 0,
  charisma: 50,
  confidence: 50,
  jealousy: 0,
  trust: 50,
};

export const BEHAVIOR_MACRO_DEFINITIONS: readonly BehaviorMacroDefinition[] = [
  {
    class: "hostile",
    label: "Hostile",
    valence: "negative",
    energy: "high",
    description: "Active cruelty, explosive anger, or severe verbal attack.",
    examples: ["Get the hell away from me.", "I hate you."],
    keywords: ["get the hell away", "i hate you", "shut up", "get out", "monster", "scum", "pathetic", "slap", "punch", "shout", "scream"],
    pattern: /\b(get the hell away|i hate you|shut up|get out|monster|scum|pathetic|slap|punch|shout|scream)\b/i,
    priority: 24,
    requiredStats: {},
  },
  {
    class: "melodramatic",
    label: "Melodramatic",
    valence: "negative",
    energy: "high",
    description: "High-decibel heartbreak, betrayal, ruin, or catastrophic romantic pain.",
    examples: ["You've shattered everything.", "How could you do this after everything?"],
    keywords: ["shattered everything", "how could you", "betray", "heartbreak", "ruined", "destroyed", "agony", "hopeless", "never again", "lost forever"],
    pattern: /\b(shattered everything|how could you|betray|heartbreak|ruined|destroyed|agony|hopeless|never again|lost forever)\b/i,
    priority: 23,
    requiredStats: { angst: 40 },
  },
  {
    class: "vindictive",
    label: "Vindictive",
    valence: "negative",
    energy: "high",
    description: "Spiteful actions meant to sting, punish, or settle emotional scores.",
    examples: ["Now you know exactly how it feels.", "I hope it hurts."],
    keywords: ["now you know", "how it feels", "payback", "revenge", "spite", "serve you right", "hope it hurts"],
    pattern: /\b(now you know|how it feels|payback|revenge|spite|serve you right|hope it hurts)\b/i,
    priority: 22,
    requiredStats: { angst: 25 },
  },
  {
    class: "hysterical",
    label: "Hysterical",
    valence: "negative",
    energy: "high",
    description: "High-panic energy, erratic pacing, or overwhelming stress responses.",
    examples: ["Everything is spinning out of control!", "I can't breathe."],
    keywords: ["spinning out", "out of control", "can't breathe", "panic", "panicking", "falling apart", "spiraling", "breaking down"],
    pattern: /\b(spinning out|out of control|can't breathe|panic|panicking|falling apart|spiraling|breaking down)\b/i,
    priority: 21,
    requiredStats: { angst: 20 },
  },
  {
    class: "resigned",
    label: "Resigned",
    valence: "negative",
    energy: "low",
    description: "Giving up on the romance, tragic self-sacrifice, or stepping aside.",
    examples: ["Go to them. I'm letting you go.", "Forget me. It's too late."],
    keywords: ["go to them", "letting you go", "give up", "fine then", "doesn't matter", "forget me", "too late", "let go"],
    pattern: /\b(go to them|letting you go|give up|fine then|doesn't matter|forget me|too late|let go)\b/i,
    priority: 20,
    requiredStats: { angst: 50 },
  },
  {
    class: "coquettish",
    label: "Coquettish",
    valence: "positive",
    energy: "high",
    description: "High-allure, suggestive charm, and deliberate physical proximity.",
    examples: ["Come a little closer.", "She lets her gaze linger."],
    keywords: ["come closer", "little closer", "charm", "allure", "whisper", "gaze", "lip", "breathe", "captivate", "provoke", "softly"],
    pattern: /\b(come closer|little closer|charm|allure|whisper|gaze|lip|breathe|captivate|provoke|softly)\b/i,
    priority: 19,
    requiredStats: { affection: 45, charisma: 30 },
  },
  {
    class: "bold",
    label: "Bold",
    valence: "tense",
    energy: "high",
    description: "Taking physical or conversational command with unshakeable confidence.",
    examples: ["Look at me when I speak.", "[Steps closer]"],
    keywords: ["look at me", "step closer", "steps closer", "grab", "pull", "lean in", "demand", "force", "trap", "pin"],
    pattern: /\b(look at me|step closer|steps closer|grab|pull|lean in|demand|force|trap|pin)\b/i,
    priority: 18,
    requiredStats: { affection: 20, trust: 40 },
  },
  {
    class: "defiant",
    label: "Defiant",
    valence: "tense",
    energy: "high",
    description: "Proud rebellion, direct resistance, and sharp pushback.",
    examples: ["You can't make me do a thing.", "Try it."],
    keywords: ["make me", "can't make me", "dare you", "never", "won't", "try it", "challenge", "prove it", "proud"],
    pattern: /\b(make me|can't make me|dare you|never|won't|try it|challenge|prove it|proud)\b/i,
    priority: 17,
    requiredStats: { angst: 15 },
  },
  {
    class: "possessive",
    label: "Possessive",
    valence: "tense",
    energy: "high",
    description: "High jealousy, territorial entitlement, or protective envy.",
    examples: ["Don't look at anyone else.", "Mine."],
    keywords: ["mine", "alone", "don't touch", "who was", "stay away from", "belongs to", "look only at", "don't look at anyone else"],
    pattern: /\b(mine|alone|don't touch|who was|stay away from|belongs to|look only at|don't look at anyone else)\b/i,
    priority: 16,
    requiredStats: { affection: 25, angst: 30 },
  },
  {
    class: "manipulative",
    label: "Manipulative",
    valence: "tense",
    energy: "medium",
    description: "Crafty guilt-tripping, playing hard to get, or strategic emotional framing.",
    examples: ["If you actually cared, you'd stay.", "I study their reaction before answering."],
    keywords: ["if you cared", "if you actually cared", "guilt", "test you", "study their reaction", "playing hard to get", "strategy", "predict", "analyze"],
    pattern: /\b(if you cared|if you actually cared|guilt|test you|study their reaction|playing hard to get|strategy|predict|analyze)\b/i,
    priority: 15,
    requiredStats: {},
  },
  {
    class: "affectionate",
    label: "Affectionate",
    valence: "positive",
    energy: "medium",
    description: "Direct warmth, physical sweetness, and verbal reassurance.",
    examples: ["I want to protect you.", "I'm just glad you're safe."],
    keywords: ["i want to protect you", "glad you're safe", "i love you", "i missed you", "i care", "hold you", "hug", "kiss", "protect you", "you're safe", "adore"],
    pattern: /\b(i want to protect you|glad you're safe|i love you|i missed you|i care|hold you|hug|kiss|protect you|you're safe|adore)\b/i,
    priority: 14,
    requiredStats: { affection: 30 },
  },
  {
    class: "teasing",
    label: "Teasing",
    valence: "positive",
    energy: "high",
    description: "Lighthearted mockery, playful friction, and inside jokes.",
    examples: ["You're a handful, you know that?", "Oh, so you admit you missed me?"],
    keywords: ["handful", "so you admit", "don't get used to it", "tease", "teasing", "wink", "laugh", "sarcastic", "trouble", "playful", "mock"],
    pattern: /\b(handful|so you admit|don't get used to it|tease|teasing|wink|laugh|sarcastic|trouble|playful|mock)\b/i,
    priority: 13,
    requiredStats: { trust: 25 },
  },
  {
    class: "earnest",
    label: "Earnest",
    valence: "positive",
    energy: "medium",
    description: "Stripped-back sincere honesty without humor or masks.",
    examples: ["I truly mean what I say.", "Believe me, this is real."],
    keywords: ["promise", "honestly", "swear", "truth", "believe me", "truly mean", "mean what i say", "real", "genuine"],
    pattern: /\b(promise|honestly|swear|truth|believe me|truly mean|mean what i say|real|genuine)\b|(?<!didn't )\bmean it\b/i,
    priority: 12,
    requiredStats: { trust: 50 },
  },
  {
    class: "starstruck",
    label: "Starstruck",
    valence: "positive",
    energy: "high",
    description: "Unveiled admiration, awe, and starry-eyed idealization.",
    examples: ["You are completely breathtaking.", "You're stunning."],
    keywords: ["beautiful", "amazing", "perfect", "angel", "breathtaking", "gorgeous", "stunning", "star", "dazzle"],
    pattern: /\b(beautiful|amazing|perfect|angel|breathtaking|gorgeous|stunning|star|dazzle)\b/i,
    priority: 11,
    requiredStats: { affection: 15 },
  },
  {
    class: "anxious",
    label: "Anxious",
    valence: "tense",
    energy: "high",
    description: "Flustered, stuttering, fidgeting, or showing fear of rejection.",
    examples: ["I-I didn't mean it like that!", "[Looks away, ears burning]"],
    keywords: ["i...", "didn't mean it like that", "blush", "stutter", "nervous", "flustered", "fidget", "shy", "embarrassed", "look down", "mumble"],
    pattern: /\b(blush|stutter|nervous|flustered|fidget|shy|embarrassed|look down|mumble|didn't mean it like that)\b|([a-z])-\2/i,
    priority: 10,
    requiredStats: {},
  },
  {
    class: "sombre",
    label: "Sombre",
    valence: "negative",
    energy: "low",
    description: "Quiet sadness, melancholy, past regret, or mourning.",
    examples: ["I am a burden to you.", "That mistake still haunts me."],
    keywords: ["burden", "sorry", "regret", "mistake", "blame", "shadow", "quiet", "heavy", "haunt", "past", "mourning"],
    pattern: /\b(burden|sorry|regret|mistake|blame|shadow|quiet|heavy|haunt|past|mourning)\b/i,
    priority: 9,
    requiredStats: { angst: 20 },
  },
  {
    class: "suspicious",
    label: "Suspicious",
    valence: "tense",
    energy: "medium",
    description: "Deep skepticism, probing for hidden lies, or analyzing words closely.",
    examples: ["What are you actually after?", "I study what you're not saying."],
    keywords: ["what are you after", "actually after", "what do you want", "lying", "lie", "hidden", "not saying", "suspicious", "skeptical", "trust this"],
    pattern: /\b(what are you after|actually after|what do you want|lying|lie|hidden|not saying|suspicious|skeptical|trust this)\b/i,
    priority: 8,
    requiredStats: {},
  },
  {
    class: "shocked",
    label: "Shocked",
    valence: "tense",
    energy: "medium",
    description: "Speechlessness, freezing up, or processing a major revelation.",
    examples: ["I don't even know what to say.", "[Freezes]"],
    keywords: ["don't know what to say", "speechless", "freeze", "freezes", "stunned", "can't believe", "what did you say", "revelation"],
    pattern: /\b(don't know what to say|speechless|freeze|freezes|stunned|can't believe|what did you say|revelation)\b/i,
    priority: 7,
    requiredStats: {},
  },
  {
    class: "apathetic",
    label: "Apathetic",
    valence: "neutral",
    energy: "low",
    description: "Flat deadpan indifference or exhausted emotional fatigue.",
    examples: ["Do whatever you want. I don't care.", "Whatever."],
    keywords: ["do whatever you want", "i don't care", "whatever", "numb", "empty", "tired of this", "nothing matters"],
    pattern: /\b(do whatever you want|i don't care|whatever|numb|empty|tired of this|nothing matters)\b/i,
    priority: 6,
    requiredStats: {},
  },
  {
    class: "defensive",
    label: "Defensive",
    valence: "tense",
    energy: "medium",
    description: "Quick deflection, backtracking, or dodging direct emotional vulnerability.",
    examples: ["That's completely irrelevant.", "Forget I said anything."],
    keywords: ["irrelevant", "forget i said anything", "never mind", "drop it", "that's not what i meant", "back off", "deflect"],
    pattern: /\b(irrelevant|forget i said anything|never mind|drop it|that's not what i meant|back off|deflect)\b/i,
    priority: 5,
    requiredStats: {},
  },
  {
    class: "formal",
    label: "Formal",
    valence: "neutral",
    energy: "low",
    description: "Polished distant courtesy, professional reset, or polite boundaries.",
    examples: ["Thank you for your assistance.", "That will be all."],
    keywords: ["thank you for your assistance", "that will be all", "with respect", "professionally", "appreciate your time", "good evening"],
    pattern: /\b(thank you for your assistance|that will be all|with respect|professionally|appreciate your time|good evening)\b/i,
    priority: 4,
    requiredStats: {},
  },
  {
    class: "distant",
    label: "Distant",
    valence: "tense",
    energy: "medium",
    description: "Emotional walls, cold brush-offs, and sudden conversational withdrawal.",
    examples: ["It's fine. Drop it.", "I can take care of myself."],
    keywords: ["it's fine", "take care of myself", "leave it", "i'm fine", "don't worry about me", "walk away", "cold", "avoid", "turn back"],
    pattern: /\b(it's fine|take care of myself|leave it|i'm fine|don't worry about me|walk away|cold|avoid|turn back)\b/i,
    priority: 3,
    requiredStats: {},
  },
  {
    class: "submissive",
    label: "Submissive",
    valence: "positive",
    energy: "medium",
    description: "Yielding agency, soft compliance, and letting the NPC dictate the pace.",
    examples: ["Whatever you want.", "I obey and yield."],
    keywords: ["whatever you want", "whatever you say", "obey", "yield", "nod softly", "let them", "allow", "meek", "quietly comply"],
    pattern: /\b(whatever you want|whatever you say|obey|yield|nod softly|let them|allow|meek|quietly comply)\b/i,
    priority: 2,
    requiredStats: { trust: 35 },
  },
  {
    class: "casual",
    label: "Casual",
    valence: "neutral",
    energy: "low",
    description: "Structural dialogue, world-building progression, or basic friendly chatter.",
    examples: ["Let's see what's over there.", "What should we do next?"],
    keywords: ["let's see", "what should we do", "let's go", "where are we", "tell me about", "okay", "sure", "sounds good", "next"],
    pattern: /\b(let's see|what should we do|let's go|where are we|tell me about|okay|sure|sounds good|next)\b/i,
    priority: 1,
    requiredStats: {},
  },
];

const DEFAULT_BEHAVIOR_CLASS =
  BEHAVIOR_MACRO_DEFINITIONS.find((definition) => definition.class === "casual") ??
  BEHAVIOR_MACRO_DEFINITIONS[BEHAVIOR_MACRO_DEFINITIONS.length - 1];

export function classifyPlayerBehaviorMacro(
  input: string,
): BehaviorMacroClassification {
  const normalizedInput = normalizeBehaviorText(input);

  if (!normalizedInput) {
    return {
      class: "casual",
      confidence: 0.35,
      valence: "neutral",
      energy: "low",
      reason: "Empty or structural turn defaults to casual.",
      matchedKeywords: [],
    };
  }

  const matchedDefinition = BEHAVIOR_MACRO_DEFINITIONS.map((definition) => {
    const matchedKeywords = definition.keywords.filter((keyword) =>
      normalizedInput.includes(normalizeBehaviorText(keyword)),
    );
    const regexMatches = Array.from(input.matchAll(new RegExp(definition.pattern, "gi")))
      .map((match) => match[0])
      .filter(Boolean);
    const bracketActionBoost = getBracketActionBoost(input, definition.class);
    const allMatches = uniquePreserveOrder([...matchedKeywords, ...regexMatches]);
    const matched = allMatches.length > 0 || bracketActionBoost > 0;

    return { definition, matchedKeywords: allMatches, matched };
  }).find((result) => result.matched);

  const winner = matchedDefinition ?? {
    definition: DEFAULT_BEHAVIOR_CLASS,
    matchedKeywords: [],
    matched: false,
  };
  const confidence = Math.min(
    0.98,
    Math.max(
      winner.matchedKeywords.length ? 0.58 : 0.38,
      0.38 + winner.matchedKeywords.length * 0.16,
    ),
  );

  return {
    class: winner.definition.class,
    confidence,
    valence: winner.definition.valence,
    energy: winner.definition.energy,
    reason: winner.definition.description,
    matchedKeywords: winner.matchedKeywords,
    engineAction: "trigger_intent",
  };
}

export function evaluatePlayerTurnBehavior(
  input: PlayerTurnEvaluationInput,
): BehaviorMacroClassification {
  const immediateIntent = classifyPlayerBehaviorMacro(input.text);
  const definition = BEHAVIOR_MACRO_DEFINITIONS.find(
    (candidate) => candidate.class === immediateIntent.class,
  ) ?? DEFAULT_BEHAVIOR_CLASS;
  const relationshipStats = normalizeRelationshipStats(input.relationshipStats);
  const eventContext = input.eventContext?.trim() || "NORMAL_SCENE";
  const requiredStats = definition.requiredStats ?? {};

  for (const [stat, minimum] of Object.entries(requiredStats)) {
    const key = stat as keyof RelationshipStats;

    if (relationshipStats[key] < minimum) {
      return {
        ...immediateIntent,
        class: "casual",
        confidence: Math.max(0.42, immediateIntent.confidence - 0.18),
        energy: "low",
        engineAction: "blocked_by_soft_gate",
        eventContext,
        gated: true,
        gatedReason:
          `Blocked by low ${stat}: required ${minimum}, current ${relationshipStats[key]}`,
        reason:
          "Keyword intent matched, but relationship state is not ready for that event to land cleanly.",
        valence: "neutral",
      };
    }
  }

  if (
    isCrisisContext(eventContext) &&
    immediateIntent.class === "teasing"
  ) {
    return {
      ...immediateIntent,
      class: "distant",
      confidence: Math.max(0.55, immediateIntent.confidence - 0.08),
      energy: "medium",
      engineAction: "context_override",
      eventContext,
      gated: false,
      reason:
        "Crisis context converts playful teasing into defensive distance.",
      valence: "tense",
    };
  }

  return {
    ...immediateIntent,
    engineAction: "trigger_intent",
    eventContext,
    gated: false,
  };
}

function normalizeBehaviorText(value: string) {
  return value.toLowerCase().replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeRelationshipStats(
  stats: Partial<RelationshipStats> | undefined,
): RelationshipStats {
  return {
    affection: clampStat(stats?.affection ?? DEFAULT_RELATIONSHIP_STATS.affection),
    angst: clampStat(stats?.angst ?? DEFAULT_RELATIONSHIP_STATS.angst),
    charisma: clampStat(
      stats?.charisma ?? stats?.confidence ?? DEFAULT_RELATIONSHIP_STATS.charisma,
    ),
    confidence: clampStat(
      stats?.confidence ?? stats?.charisma ?? DEFAULT_RELATIONSHIP_STATS.confidence,
    ),
    jealousy: clampStat(stats?.jealousy ?? DEFAULT_RELATIONSHIP_STATS.jealousy ?? 0),
    trust: clampStat(stats?.trust ?? DEFAULT_RELATIONSHIP_STATS.trust),
  };
}

function clampStat(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function isCrisisContext(eventContext: string) {
  return /crisis|betrayal|danger|emergency|rupture|argument|conflict/i.test(
    eventContext,
  );
}

function getBracketActionBoost(input: string, behaviorClass: BehaviorMacroClass) {
  if (
    behaviorClass === "bold" &&
    /\[(steps|step|leans|backs|takes|grabs|pulls|pins|traps)/i.test(input)
  ) {
    return 1;
  }

  if (
    behaviorClass === "anxious" &&
    /\[(quickly looks away|looks away|look down|blush|stutter|fidget|turns away|turn away)/i.test(input)
  ) {
    return 1;
  }

  return 0;
}

function uniquePreserveOrder(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}
