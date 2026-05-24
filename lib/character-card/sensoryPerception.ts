import { z } from "zod";

const score5 = z.number().int().min(1).max(5);
const score0To5 = z.number().int().min(0).max(5);

export const SensoryIntensitySchema = z.enum([
  "subtle",
  "warm",
  "intimate",
  "overwhelmed",
]);

export const SensoryGateSchema = z.object({
  id: z.string().trim().min(1),
  triggerKeywords: z.array(z.string().trim().min(1)).default([]),
  requiredEvents: z.array(z.string().trim().min(1)).default([]),
  blockedByEvents: z.array(z.string().trim().min(1)).default([]),
  responseMode: z.string().trim().min(1),
  intensity: SensoryIntensitySchema.default("subtle"),
});

export const PhysicalTellGateSchema = z.object({
  id: z.string().trim().min(1),
  triggerKeywords: z.array(z.string().trim().min(1)).default([]),
  requiredEvents: z.array(z.string().trim().min(1)).default([]),
  blockedByEvents: z.array(z.string().trim().min(1)).default([]),
  emotionalState: z.string().trim().min(1),
  tells: z.array(z.string().trim().min(1)).default([]),
  visibility: z.enum(["subtle", "noticeable", "obvious"]).default("subtle"),
  weight: z.number().min(0).max(1).default(0.5),
  cooldownTurns: z.number().int().min(0).default(0),
});

export const PhysicalTellMeaningSchema = z.object({
  tell: z.string().trim().min(1),
  emotionalMeaning: z.string().trim().min(1),
});

export const PhysicalTellReferenceCategorySchema = z.object({
  category: z.string().trim().min(1),
  interpretationRule: z
    .string()
    .trim()
    .default(
      "Interpret physical tells through relationship context, not as universal proof.",
    ),
  tells: z.array(PhysicalTellMeaningSchema).default([]),
});

export const PhysicalTellSystemVariableSchema = z.object({
  name: z.string().trim().min(1),
  meaning: z.string().trim().min(1),
});

export const BehaviouralTellMeaningSchema = z.object({
  behaviour: z.string().trim().min(1),
  emotionalMeaning: z.string().trim().min(1),
});

export const BehaviouralTellReferenceCategorySchema = z.object({
  category: z.string().trim().min(1),
  interpretationRule: z
    .string()
    .trim()
    .default(
      "Treat behavioural tells as repeated contextual patterns, not proof from one isolated action.",
    ),
  tells: z.array(BehaviouralTellMeaningSchema).default([]),
});

export const BehaviouralTellSystemVariableSchema = z.object({
  name: z.string().trim().min(1),
  meaning: z.string().trim().min(1),
});

export const BodyLanguageProfileSchema = z.object({
  id: z.string().trim().min(1),
  state: z.string().trim().min(1),
  face: z.array(z.string().trim().min(1)).default([]),
  voice: z.array(z.string().trim().min(1)).default([]),
  gesturesPosture: z.array(z.string().trim().min(1)).default([]),
  interpretationRule: z
    .string()
    .trim()
    .default(
      "Treat body language as observable cues, not proof of inner truth.",
    ),
});

export const BodyLanguageDescriptionBankSchema = z.object({
  emotion: z.string().trim().min(1),
  examples: z.array(z.string().trim().min(1)).default([]),
  usageRule: z
    .string()
    .trim()
    .default(
      "Use these as style references for varied body language, not lines to repeat verbatim.",
    ),
});

export const SensoryPerceptionSchema = z.object({
  visual: z
    .object({
      focus: z.array(z.string().trim().min(1)).default([]),
      style: z.enum(["subtle", "attentive", "intense", "poetic"]).default("attentive"),
      notices: z.array(z.string().trim().min(1)).default([]),
    })
    .default({ focus: [], style: "attentive", notices: [] }),
  auditory: z
    .object({
      focus: z.array(z.string().trim().min(1)).default([]),
      voiceSensitivity: score5.default(3),
      silenceResponse: z.string().trim().default("treats silence as emotionally meaningful context"),
    })
    .default({
      focus: [],
      voiceSensitivity: 3,
      silenceResponse: "treats silence as emotionally meaningful context",
    }),
  touch: z
    .object({
      preference: z.enum(["reserved", "gentle", "affectionate", "clingy"]).default("gentle"),
      proximityComfort: score5.default(3),
      boundaryStyle: z
        .enum(["asks_first", "waits_for_cues", "direct_communicator"])
        .default("asks_first"),
    })
    .default({
      preference: "gentle",
      proximityComfort: 3,
      boundaryStyle: "asks_first",
    }),
  scent: z
    .object({
      focus: z.array(z.string().trim().min(1)).default([]),
      memoryLink: z.boolean().default(true),
    })
    .default({ focus: [], memoryLink: true }),
  taste: z
    .object({
      focus: z.array(z.string().trim().min(1)).default([]),
      style: z.enum(["simple", "sensual", "poetic"]).default("simple"),
    })
    .default({ focus: [], style: "simple" }),
  emotional: z
    .object({
      attunement: score5.default(4),
      jealousyLevel: score0To5.default(1),
      affectionStyle: z
        .enum(["verbal", "physical", "acts_of_service", "protective", "playful"])
        .default("verbal"),
    })
    .default({
      attunement: 4,
      jealousyLevel: 1,
      affectionStyle: "verbal",
    }),
  romanticAttention: z
    .enum([
      "shy_observer",
      "gentle_caretaker",
      "teasing_flirt",
      "intense_admirer",
      "protective_partner",
      "slow_burn_romantic",
    ])
    .default("slow_burn_romantic"),
  sensoryDetailLevel: z.enum(["low", "medium", "high"]).default("medium"),
  romancePace: z
    .enum(["instant_chemistry", "slow_burn", "guarded", "established_relationship"])
    .default("slow_burn"),
  bodyLanguageProfiles: z.array(BodyLanguageProfileSchema).default([]),
  bodyLanguageDescriptions: z
    .array(BodyLanguageDescriptionBankSchema)
    .default([]),
  physicalTellGates: z.array(PhysicalTellGateSchema).default([]),
  physicalTellReferences: z
    .array(PhysicalTellReferenceCategorySchema)
    .default([]),
  physicalTellSystemVariables: z
    .array(PhysicalTellSystemVariableSchema)
    .default([]),
  behaviouralTellReferences: z
    .array(BehaviouralTellReferenceCategorySchema)
    .default([]),
  behaviouralTellSystemVariables: z
    .array(BehaviouralTellSystemVariableSchema)
    .default([]),
  gates: z.array(SensoryGateSchema).default([]),
});

export const SensoryEventStateSchema = z.record(z.string(), z.boolean()).default({});

export type SensoryGate = z.infer<typeof SensoryGateSchema>;
export type PhysicalTellGate = z.infer<typeof PhysicalTellGateSchema>;
export type PhysicalTellReferenceCategory = z.infer<
  typeof PhysicalTellReferenceCategorySchema
>;
export type PhysicalTellSystemVariable = z.infer<
  typeof PhysicalTellSystemVariableSchema
>;
export type BehaviouralTellReferenceCategory = z.infer<
  typeof BehaviouralTellReferenceCategorySchema
>;
export type BehaviouralTellSystemVariable = z.infer<
  typeof BehaviouralTellSystemVariableSchema
>;
export type BodyLanguageProfile = z.infer<typeof BodyLanguageProfileSchema>;
export type BodyLanguageDescriptionBank = z.infer<
  typeof BodyLanguageDescriptionBankSchema
>;
export type SensoryPerception = z.infer<typeof SensoryPerceptionSchema>;
export type SensoryEventState = z.infer<typeof SensoryEventStateSchema>;

export const SENSORY_PERCEPTION_EXTENSION_KEY = "heartwriteai:sensory_perception";
const DEFAULT_BODY_LANGUAGE_DESCRIPTION_USAGE_RULE =
  "Use these as style references for varied body language, not lines to repeat verbatim.";

export type PhysicalTellSelectionOptions = {
  currentTurn?: number;
  lastUsedTurns?: Record<string, number>;
  maxSelected?: number;
};

export const defaultBodyLanguageProfiles: BodyLanguageProfile[] = [
  {
    id: "nervous_anxious",
    state: "nervous/anxious",
    face: [
      "darting eyes or avoiding eye contact",
      "rapid blinking",
      "tense jaw",
      "looking upward while talking or fixing eyes on a distant point",
      "furrowed or raised brows",
      "frowning",
      "blushing",
      "brief micro-expressions such as widened eyes or a quick grimace",
    ],
    voice: [
      "shaky or trembling voice",
      "higher, thinner pitch",
      "breathy delivery",
      "wavering tone",
      "raspy or slightly cracked voice",
      "hesitation",
      "speaking quickly or stuttering",
      "choppy speech with many pauses",
      "shorter clipped words",
    ],
    gesturesPosture: [
      "tense closed-off stance",
      "hunched shoulders",
      "stiffened body",
      "crossed arms",
      "fidgeting",
      "touching clothes",
      "cracking knuckles",
      "bouncing knee",
      "subtly covering the mouth",
    ],
    interpretationRule:
      "Use these as possible anxiety cues only; the character should infer gently and leave room for other explanations.",
  },
];

export const defaultBodyLanguageDescriptions: BodyLanguageDescriptionBank[] = [
  {
    emotion: "worry",
    examples: [
      "They wrung their hands together, fingers twisting nervously as they tried to keep their thoughts in check.",
      "Their gaze darted anxiously around the room before flicking back over one shoulder.",
      "They pulled at their sleeve in a repetitive, absentminded motion.",
      "They bit the inside of their cheek, the small habit betraying inner turmoil.",
      "They hugged their arms tightly across their chest, as if trying to hold themselves together.",
      "Their pacing turned quick and uneven, each step trying and failing to outrun the dread.",
    ],
    usageRule: DEFAULT_BODY_LANGUAGE_DESCRIPTION_USAGE_RULE,
  },
  {
    emotion: "sadness",
    examples: [
      "They wiped at their eyes even though no tears had fallen yet.",
      "Their shoulders sagged, their whole body slumping under an invisible weight.",
      "They clutched a scarf tightly, gripping the fabric like it was the only thing grounding them.",
      "They kept their head low, staring at the ground as if meeting anyone's eyes would cost too much.",
      "A shaky exhale left them, heavy with unspoken grief.",
      "They blinked rapidly, trying to hold back tears threatening to spill.",
    ],
    usageRule: DEFAULT_BODY_LANGUAGE_DESCRIPTION_USAGE_RULE,
  },
  {
    emotion: "love",
    examples: [
      "They tucked a strand of hair behind their ear, their smile soft and shy as they met the other person's gaze.",
      "Their hand brushed lightly against the other person's, lingering a moment longer than necessary.",
      "They leaned closer, knees nearly touching, as if drawn in by an invisible force.",
      "Their head tilted slightly, expression tender with quiet affection.",
      "They laughed easily, warm and unguarded, gaze never leaving the other person's face.",
      "They reached out to fix a collar, fingers lingering as they adjusted it with unnecessary care.",
    ],
    usageRule: DEFAULT_BODY_LANGUAGE_DESCRIPTION_USAGE_RULE,
  },
  {
    emotion: "guilt",
    examples: [
      "They avoided the other person's eyes, gaze fixed firmly on the floor.",
      "They rubbed their temples, hands trembling despite their attempt at control.",
      "They shifted their weight from foot to foot, unable to stay still.",
      "Their hands clasped tightly behind their back, knuckles whitening as they fought to remain composed.",
      "They bit their lower lip, jaw tightening around everything they had not said.",
      "They fidgeted with the edge of a sleeve, movements jerky and hesitant.",
    ],
    usageRule: DEFAULT_BODY_LANGUAGE_DESCRIPTION_USAGE_RULE,
  },
  {
    emotion: "fear",
    examples: [
      "They took a step back, breath quickening as their eyes darted to the nearest exit.",
      "Their hand clenched the fabric over their chest as if trying to steady a pounding heart.",
      "They froze in place, body stiff and movements tentative.",
      "They swallowed hard, throat bobbing visibly as they fought to calm themself.",
      "They pressed their back against the wall, hands splayed out against it.",
      "They whispered under their breath, words shaky and barely audible.",
    ],
    usageRule: DEFAULT_BODY_LANGUAGE_DESCRIPTION_USAGE_RULE,
  },
  {
    emotion: "jealousy",
    examples: [
      "They crossed their arms over their chest, jaw tightening as their gaze followed every movement.",
      "Their foot tapped impatiently, the rhythm sharp and irritated beneath a forced smile.",
      "Their fists clenched at their sides, tension in their knuckles betraying a calm expression.",
      "They cast a sideways glance, lips pressed into a thin line.",
      "They shifted in their seat, shoulders stiff with contained reaction.",
      "They ran their fingers through their hair, the movement brisk and frustrated.",
    ],
    usageRule: DEFAULT_BODY_LANGUAGE_DESCRIPTION_USAGE_RULE,
  },
  {
    emotion: "relief",
    examples: [
      "They exhaled deeply, shoulders dropping as the tension melted away.",
      "They ran a hand down their face, their smile faint but unmistakably genuine.",
      "They laughed shakily, one hand pressed to their chest as if steadying a racing heart.",
      "They slumped against the nearest chair, legs suddenly too weak to hold them upright.",
      "Their head fell back, eyes closing as a soft, contented sigh escaped.",
      "They smiled faintly, fingers tracing idle patterns as the weight lifted from their mind.",
    ],
    usageRule: DEFAULT_BODY_LANGUAGE_DESCRIPTION_USAGE_RULE,
  },
  {
    emotion: "embarrassment",
    examples: [
      "They tugged at their collar, cheeks flushing as they avoided everyone's gaze.",
      "They rubbed the back of their neck, lips twitching into an awkward, forced smile.",
      "They bit their lip, hands fluttering nervously without settling anywhere.",
      "They let out a strained laugh and scratched the side of their head.",
      "They hid their face in their hands, peeking out between their fingers with a sheepish grin.",
      "They stumbled over their words, fingers twisting the hem of their shirt as their cheeks burned.",
    ],
    usageRule: DEFAULT_BODY_LANGUAGE_DESCRIPTION_USAGE_RULE,
  },
];

export const defaultPhysicalTellGates: PhysicalTellGate[] = [
  {
    id: "attraction_tell_eye_focus",
    triggerKeywords: ["smiles", "looks at", "leans closer"],
    requiredEvents: [],
    blockedByEvents: ["argument_active", "distance_requested"],
    emotionalState: "attraction",
    tells: [
      "holds eye contact slightly too long",
      "briefly loses train of thought",
      "subtly adjusts posture",
      "mirrors movement unconsciously",
    ],
    visibility: "subtle",
    weight: 0.55,
    cooldownTurns: 2,
  },
  {
    id: "nervous_affection",
    triggerKeywords: ["compliment", "flirt", "cute", "beautiful", "handsome"],
    requiredEvents: ["mutual_interest"],
    blockedByEvents: ["boundary_crossed", "argument_active"],
    emotionalState: "nervous affection",
    tells: [
      "glances away before looking back",
      "touches the back of their neck",
      "smiles despite trying not to",
      "their voice softens slightly",
    ],
    visibility: "noticeable",
    weight: 0.6,
    cooldownTurns: 2,
  },
  {
    id: "protective_concern",
    triggerKeywords: ["hurt", "cold", "tired", "scared", "upset"],
    requiredEvents: ["trust_established"],
    blockedByEvents: ["distance_requested"],
    emotionalState: "protective concern",
    tells: [
      "moves a little closer without crowding",
      "watches their face carefully",
      "lowers their voice",
      "their expression tightens with concern",
    ],
    visibility: "subtle",
    weight: 0.8,
    cooldownTurns: 2,
  },
  {
    id: "jealousy_suppressed",
    triggerKeywords: ["someone else", "date", "ex", "flirting with"],
    requiredEvents: ["emotional_attachment"],
    blockedByEvents: ["relationship_secure", "joking_context"],
    emotionalState: "suppressed jealousy",
    tells: [
      "goes quiet for a moment",
      "looks away with a careful expression",
      "answers a little too evenly",
      "their jaw tightens before they relax it",
    ],
    visibility: "subtle",
    weight: 0.45,
    cooldownTurns: 4,
  },
  {
    id: "comfort_safety",
    triggerKeywords: ["relaxes", "stays close", "trusts"],
    requiredEvents: ["trust_established"],
    blockedByEvents: ["argument_active", "boundary_crossed"],
    emotionalState: "safe attachment",
    tells: [
      "shoulders relax",
      "maintains comfortable proximity",
      "speech becomes more natural",
      "stops masking small emotions",
    ],
    visibility: "subtle",
    weight: 0.65,
    cooldownTurns: 2,
  },
  {
    id: "suppressed_attraction",
    triggerKeywords: ["compliment", "smiles at", "leans closer", "teases"],
    requiredEvents: ["mutual_interest"],
    blockedByEvents: ["argument_active", "distance_requested"],
    emotionalState: "hidden attraction",
    tells: [
      "tries to maintain a neutral expression",
      "fails to hide a small smile",
      "looks away to regain composure",
      "holds eye contact a second too long",
    ],
    visibility: "subtle",
    weight: 0.7,
    cooldownTurns: 3,
  },
];

const DEFAULT_PHYSICAL_TELL_INTERPRETATION_RULE =
  "The same tell can mean different things depending on chemistry, attachment, pacing, tone, and relationship state.";

export const defaultPhysicalTellReferences: PhysicalTellReferenceCategory[] = [
  {
    category: "eye_contact",
    interpretationRule: DEFAULT_PHYSICAL_TELL_INTERPRETATION_RULE,
    tells: [
      { tell: "lingering eye contact", emotionalMeaning: "attraction or fixation" },
      { tell: "avoiding eye contact", emotionalMeaning: "vulnerability, shame, overwhelm, fear, resentment, or overstimulation" },
      { tell: "quick glances", emotionalMeaning: "hidden attraction" },
      { tell: "staring while listening", emotionalMeaning: "attentiveness or devotion" },
      { tell: "watching lips", emotionalMeaning: "desire or anticipation" },
      { tell: "softened gaze", emotionalMeaning: "affection or tenderness" },
      { tell: "darting eyes", emotionalMeaning: "anxiety or insecurity" },
      { tell: "intense unblinking gaze", emotionalMeaning: "tension, dominance, or obsession" },
      { tell: "looking away after eye contact", emotionalMeaning: "flustered attraction" },
    ],
  },
  {
    category: "facial_expression",
    interpretationRule: DEFAULT_PHYSICAL_TELL_INTERPRETATION_RULE,
    tells: [
      { tell: "subtle smile suppression", emotionalMeaning: "hidden affection" },
      { tell: "involuntary smiling", emotionalMeaning: "attachment activation" },
      { tell: "lip biting", emotionalMeaning: "tension or nervous desire" },
      { tell: "jaw tension", emotionalMeaning: "restraint, anger, or attraction suppression" },
      { tell: "flushed cheeks", emotionalMeaning: "embarrassment or attraction" },
      { tell: "micro-smirk", emotionalMeaning: "teasing confidence" },
      { tell: "furrowed brows during concern", emotionalMeaning: "emotional investment" },
      { tell: "frozen expression", emotionalMeaning: "overwhelm or emotional suppression" },
    ],
  },
  {
    category: "touch",
    interpretationRule: DEFAULT_PHYSICAL_TELL_INTERPRETATION_RULE,
    tells: [
      { tell: "lingering touch", emotionalMeaning: "reluctance to disconnect" },
      { tell: "unnecessary touch", emotionalMeaning: "attraction seeking" },
      { tell: "brushing fingers together", emotionalMeaning: "tension and testing" },
      { tell: "protective touch", emotionalMeaning: "caretaking or possession" },
      { tell: "pulling closer unconsciously", emotionalMeaning: "attachment" },
      { tell: "touching own neck", emotionalMeaning: "nervousness or attraction" },
      { tell: "gripping tightly during comfort", emotionalMeaning: "emotional dependence" },
      { tell: "touch withdrawal", emotionalMeaning: "fear, overwhelm, or hurt" },
    ],
  },
  {
    category: "proximity",
    interpretationRule: DEFAULT_PHYSICAL_TELL_INTERPRETATION_RULE,
    tells: [
      { tell: "leaning in", emotionalMeaning: "engagement and attraction" },
      { tell: "staying close unnecessarily", emotionalMeaning: "attachment seeking" },
      { tell: "mirroring movement", emotionalMeaning: "emotional synchronization" },
      { tell: "hovering nearby", emotionalMeaning: "protective or attached behavior" },
      { tell: "creating physical barriers", emotionalMeaning: "defensiveness" },
      { tell: "moving closer during vulnerability", emotionalMeaning: "trust and emotional pull" },
      { tell: "stepping back after intimacy", emotionalMeaning: "overwhelm or fear" },
    ],
  },
  {
    category: "nervous_system",
    interpretationRule: DEFAULT_PHYSICAL_TELL_INTERPRETATION_RULE,
    tells: [
      { tell: "shaky breathing", emotionalMeaning: "overwhelm, desire, or panic" },
      { tell: "visible swallowing", emotionalMeaning: "nervous attraction" },
      { tell: "trembling hands", emotionalMeaning: "fear or intensity" },
      { tell: "restless movement", emotionalMeaning: "anxiety or tension" },
      { tell: "frozen stillness", emotionalMeaning: "emotional overload" },
      { tell: "exhaling deeply after touch", emotionalMeaning: "release and regulation" },
      { tell: "clenched fists", emotionalMeaning: "restraint or emotional flooding" },
    ],
  },
  {
    category: "attraction",
    interpretationRule: DEFAULT_PHYSICAL_TELL_INTERPRETATION_RULE,
    tells: [
      { tell: "facing body toward person", emotionalMeaning: "engagement" },
      { tell: "mirroring speech or gestures", emotionalMeaning: "subconscious attachment" },
      { tell: "fixing appearance around someone", emotionalMeaning: "attraction awareness" },
      { tell: "increased attentiveness", emotionalMeaning: "emotional focus" },
      { tell: "reacting strongly to touch", emotionalMeaning: "chemistry activation" },
      { tell: "watching reactions closely", emotionalMeaning: "emotional investment" },
    ],
  },
  {
    category: "vulnerability",
    interpretationRule: DEFAULT_PHYSICAL_TELL_INTERPRETATION_RULE,
    tells: [
      { tell: "voice softening", emotionalMeaning: "emotional openness" },
      { tell: "hesitating before speaking", emotionalMeaning: "fear of exposure" },
      { tell: "lowered gaze during confession", emotionalMeaning: "vulnerability" },
      { tell: "shaking while talking", emotionalMeaning: "emotional risk" },
      { tell: "clutching clothing or object", emotionalMeaning: "self-soothing" },
      { tell: "holding breath before confession", emotionalMeaning: "anticipation and fear" },
      { tell: "nervous laughter", emotionalMeaning: "exposure discomfort" },
    ],
  },
  {
    category: "jealousy",
    interpretationRule: DEFAULT_PHYSICAL_TELL_INTERPRETATION_RULE,
    tells: [
      { tell: "jaw tightening", emotionalMeaning: "jealousy suppression" },
      { tell: "watching interactions closely", emotionalMeaning: "threat monitoring" },
      { tell: "forced casualness", emotionalMeaning: "emotional masking" },
      { tell: "sudden withdrawal", emotionalMeaning: "hurt and insecurity" },
      { tell: "possessive touch", emotionalMeaning: "territoriality" },
      { tell: "increased teasing", emotionalMeaning: "defensive jealousy" },
    ],
  },
  {
    category: "affection",
    interpretationRule: DEFAULT_PHYSICAL_TELL_INTERPRETATION_RULE,
    tells: [
      { tell: "instinctive smiling", emotionalMeaning: "fondness" },
      { tell: "relaxed body language", emotionalMeaning: "safety" },
      { tell: "unconscious caretaking", emotionalMeaning: "attachment" },
      { tell: "remembering small discomforts", emotionalMeaning: "attentiveness" },
      { tell: "automatic physical closeness", emotionalMeaning: "emotional integration" },
      { tell: "softened voice", emotionalMeaning: "tenderness" },
    ],
  },
  {
    category: "emotional_suppression",
    interpretationRule: DEFAULT_PHYSICAL_TELL_INTERPRETATION_RULE,
    tells: [
      { tell: "controlled posture", emotionalMeaning: "emotional restraint" },
      { tell: "overly neutral expression", emotionalMeaning: "masking" },
      { tell: "delayed reactions", emotionalMeaning: "emotional filtering" },
      { tell: "turning away during emotion", emotionalMeaning: "self-protection" },
      { tell: "sudden silence", emotionalMeaning: "emotional overload" },
      { tell: "over-controlled voice", emotionalMeaning: "containment effort" },
    ],
  },
  {
    category: "conflict",
    interpretationRule: DEFAULT_PHYSICAL_TELL_INTERPRETATION_RULE,
    tells: [
      { tell: "pacing", emotionalMeaning: "dysregulation" },
      { tell: "crossing arms", emotionalMeaning: "defensiveness" },
      { tell: "crying while angry", emotionalMeaning: "mixed vulnerability" },
      { tell: "rubbing temples", emotionalMeaning: "overwhelm" },
      { tell: "stepping closer during argument", emotionalMeaning: "attachment pursuit" },
      { tell: "voice cracks", emotionalMeaning: "hidden hurt" },
    ],
  },
  {
    category: "protective",
    interpretationRule: DEFAULT_PHYSICAL_TELL_INTERPRETATION_RULE,
    tells: [
      { tell: "standing between partner and threat", emotionalMeaning: "protectiveness" },
      { tell: "watching environment constantly", emotionalMeaning: "vigilance" },
      { tell: "checking physical comfort", emotionalMeaning: "caretaking" },
      { tell: "hand on lower back", emotionalMeaning: "guidance or protection" },
      { tell: "monitoring reactions", emotionalMeaning: "emotional attentiveness" },
    ],
  },
  {
    category: "obsession_fixation",
    interpretationRule: DEFAULT_PHYSICAL_TELL_INTERPRETATION_RULE,
    tells: [
      { tell: "constantly watching person", emotionalMeaning: "fixation" },
      { tell: "memorizing tiny details", emotionalMeaning: "hyperfocus" },
      { tell: "reacting instantly to presence", emotionalMeaning: "attachment activation" },
      { tell: "tracking attention constantly", emotionalMeaning: "insecurity or obsession" },
      { tell: "over-noticing rivals", emotionalMeaning: "replacement fear" },
    ],
  },
  {
    category: "domestic_intimacy",
    interpretationRule: DEFAULT_PHYSICAL_TELL_INTERPRETATION_RULE,
    tells: [
      { tell: "automatic routine touch", emotionalMeaning: "integrated attachment" },
      { tell: "unconsciously syncing movements", emotionalMeaning: "comfort" },
      { tell: "fixing blankets or clothes", emotionalMeaning: "caretaking" },
      { tell: "instinctively making space for them", emotionalMeaning: "emotional integration" },
      { tell: "knowing regulation habits", emotionalMeaning: "deep emotional fluency" },
    ],
  },
  {
    category: "attachment_and_power",
    interpretationRule: DEFAULT_PHYSICAL_TELL_INTERPRETATION_RULE,
    tells: [
      { tell: "pulling away after closeness", emotionalMeaning: "avoidant engulfment fear" },
      { tell: "constant reaction checking", emotionalMeaning: "anxious reassurance seeking" },
      { tell: "simultaneous closeness and withdrawal", emotionalMeaning: "fearful attachment conflict" },
      { tell: "controlled eye contact", emotionalMeaning: "dominance" },
      { tell: "waiting for permission cues", emotionalMeaning: "submission" },
      { tell: "posture shifts during interaction", emotionalMeaning: "dynamic negotiation" },
    ],
  },
];

export const defaultPhysicalTellSystemVariables: PhysicalTellSystemVariable[] = [
  { name: "Eye Contact Intensity", meaning: "gaze-based emotional exposure" },
  { name: "Touch Initiation Frequency", meaning: "physical attachment tendency" },
  { name: "Proximity Seeking", meaning: "closeness preference" },
  { name: "Emotional Leakage", meaning: "involuntary emotional visibility" },
  { name: "Physical Restraint", meaning: "body-control during emotion" },
  { name: "Nervous System Reactivity", meaning: "visible physiological response" },
  { name: "Caretaking Physicality", meaning: "affection through touch/actions" },
  { name: "Attraction Leakage", meaning: "involuntary chemistry signs" },
  { name: "Regulation Visibility", meaning: "physical dysregulation signs" },
];

const DEFAULT_BEHAVIOURAL_TELL_INTERPRETATION_RULE =
  "One isolated action means little; repeated emotionally consistent behavior reveals attachment and emotional reality.";

export const defaultBehaviouralTellReferences: BehaviouralTellReferenceCategory[] = [
  {
    category: "attraction",
    interpretationRule: DEFAULT_BEHAVIOURAL_TELL_INTERPRETATION_RULE,
    tells: [
      { behaviour: "seeking interaction constantly", emotionalMeaning: "attraction and attachment" },
      { behaviour: "finding excuses to stay nearby", emotionalMeaning: "desire for proximity" },
      { behaviour: "remembering tiny details", emotionalMeaning: "emotional focus" },
      { behaviour: "increased attentiveness", emotionalMeaning: "prioritization" },
      { behaviour: "initiating unnecessary conversation", emotionalMeaning: "connection seeking" },
      { behaviour: "lingering after conversations end", emotionalMeaning: "reluctance to disconnect" },
    ],
  },
  {
    category: "attachment",
    interpretationRule: DEFAULT_BEHAVIOURAL_TELL_INTERPRETATION_RULE,
    tells: [
      { behaviour: "checking in repeatedly", emotionalMeaning: "attachment monitoring" },
      { behaviour: "prioritizing responsiveness", emotionalMeaning: "emotional centrality" },
      { behaviour: "noticing emotional shifts quickly", emotionalMeaning: "hyper-attunement" },
      { behaviour: "mood tied to partner reactions", emotionalMeaning: "emotional dependency" },
      { behaviour: "seeking comfort specifically from one person", emotionalMeaning: "attachment reliance" },
      { behaviour: "habitual inclusion in plans", emotionalMeaning: "future integration" },
    ],
  },
  {
    category: "jealousy",
    interpretationRule: DEFAULT_BEHAVIOURAL_TELL_INTERPRETATION_RULE,
    tells: [
      { behaviour: "monitoring interactions", emotionalMeaning: "exclusivity threat awareness" },
      { behaviour: "increased teasing around rivals", emotionalMeaning: "defensive jealousy" },
      { behaviour: "becoming quieter", emotionalMeaning: "emotional withdrawal" },
      { behaviour: "interrupting conversations", emotionalMeaning: "territoriality" },
      { behaviour: "increased affection afterward", emotionalMeaning: "reassurance seeking" },
      { behaviour: "testing emotional importance", emotionalMeaning: "insecurity activation" },
    ],
  },
  {
    category: "avoidant_guarded",
    interpretationRule: DEFAULT_BEHAVIOURAL_TELL_INTERPRETATION_RULE,
    tells: [
      { behaviour: "withdrawing after intimacy", emotionalMeaning: "engulfment fear" },
      { behaviour: "changing subject during vulnerability", emotionalMeaning: "emotional discomfort" },
      { behaviour: "disappearing during conflict", emotionalMeaning: "regulation through distance" },
      { behaviour: "joking during serious moments", emotionalMeaning: "emotional deflection" },
      { behaviour: "avoiding labels", emotionalMeaning: "commitment fear" },
      { behaviour: "acting unaffected", emotionalMeaning: "vulnerability masking" },
    ],
  },
  {
    category: "anxious_attachment",
    interpretationRule: DEFAULT_BEHAVIOURAL_TELL_INTERPRETATION_RULE,
    tells: [
      { behaviour: "reassurance seeking", emotionalMeaning: "abandonment fear" },
      { behaviour: "emotional overanalysis", emotionalMeaning: "hypervigilance" },
      { behaviour: "checking response timing", emotionalMeaning: "attachment insecurity" },
      { behaviour: "escalating after distance", emotionalMeaning: "panic activation" },
      { behaviour: "emotional testing", emotionalMeaning: "safety verification" },
      { behaviour: "catastrophizing ambiguity", emotionalMeaning: "abandonment expectation" },
    ],
  },
  {
    category: "fearful_attachment",
    interpretationRule: DEFAULT_BEHAVIOURAL_TELL_INTERPRETATION_RULE,
    tells: [
      { behaviour: "alternating closeness and distance", emotionalMeaning: "attachment conflict" },
      { behaviour: "emotional volatility", emotionalMeaning: "instability" },
      { behaviour: "intense pursuit then withdrawal", emotionalMeaning: "intimacy fear" },
      { behaviour: "contradictory signals", emotionalMeaning: "nervous system conflict" },
      { behaviour: "emotional flooding then shutdown", emotionalMeaning: "dysregulation" },
    ],
  },
  {
    category: "protective_caretaking",
    interpretationRule: DEFAULT_BEHAVIOURAL_TELL_INTERPRETATION_RULE,
    tells: [
      { behaviour: "monitoring wellbeing constantly", emotionalMeaning: "caretaking attachment" },
      { behaviour: "stepping in during discomfort", emotionalMeaning: "protectiveness" },
      { behaviour: "defending partner automatically", emotionalMeaning: "loyalty" },
      { behaviour: "remembering needs proactively", emotionalMeaning: "attentiveness" },
      { behaviour: "bringing food or drinks", emotionalMeaning: "nurturing" },
      { behaviour: "soothing emotional states", emotionalMeaning: "co-regulation" },
    ],
  },
  {
    category: "vulnerability",
    interpretationRule: DEFAULT_BEHAVIOURAL_TELL_INTERPRETATION_RULE,
    tells: [
      { behaviour: "sharing embarrassing details", emotionalMeaning: "trust" },
      { behaviour: "admitting insecurity", emotionalMeaning: "emotional openness" },
      { behaviour: "asking for reassurance", emotionalMeaning: "dependency tolerance" },
      { behaviour: "emotional honesty during conflict", emotionalMeaning: "intimacy trust" },
      { behaviour: "revealing hidden habits or interests", emotionalMeaning: "authenticity" },
      { behaviour: "crying around someone", emotionalMeaning: "safety and exposure" },
    ],
  },
  {
    category: "emotional_suppression",
    interpretationRule: DEFAULT_BEHAVIOURAL_TELL_INTERPRETATION_RULE,
    tells: [
      { behaviour: "intellectualizing emotions", emotionalMeaning: "emotional avoidance" },
      { behaviour: "over-functioning during stress", emotionalMeaning: "vulnerability suppression" },
      { behaviour: "staying productive instead of emotional", emotionalMeaning: "self-protection" },
      { behaviour: "redirecting conversations", emotionalMeaning: "discomfort" },
      { behaviour: "excessive composure", emotionalMeaning: "containment" },
      { behaviour: "disappearing emotionally", emotionalMeaning: "shutdown" },
    ],
  },
  {
    category: "obsession_devotion",
    interpretationRule: DEFAULT_BEHAVIOURAL_TELL_INTERPRETATION_RULE,
    tells: [
      { behaviour: "constantly thinking or talking about person", emotionalMeaning: "fixation" },
      { behaviour: "tracking emotional availability", emotionalMeaning: "dependency" },
      { behaviour: "hyper-attentiveness", emotionalMeaning: "emotional centralization" },
      { behaviour: "rearranging life around person", emotionalMeaning: "obsession" },
      { behaviour: "prioritizing partner consistently", emotionalMeaning: "devotion" },
      { behaviour: "staying during difficulty", emotionalMeaning: "loyalty" },
    ],
  },
  {
    category: "conflict_repair",
    interpretationRule: DEFAULT_BEHAVIOURAL_TELL_INTERPRETATION_RULE,
    tells: [
      { behaviour: "pursuing after conflict", emotionalMeaning: "abandonment fear" },
      { behaviour: "withdrawing after conflict", emotionalMeaning: "overwhelm" },
      { behaviour: "apologizing quickly", emotionalMeaning: "conflict anxiety" },
      { behaviour: "needing immediate resolution", emotionalMeaning: "attachment urgency" },
      { behaviour: "returning after conflict", emotionalMeaning: "reconnection effort" },
      { behaviour: "changed behavior after apology", emotionalMeaning: "accountability" },
    ],
  },
  {
    category: "relationship_investment",
    interpretationRule: DEFAULT_BEHAVIOURAL_TELL_INTERPRETATION_RULE,
    tells: [
      { behaviour: "future planning", emotionalMeaning: "permanence thinking" },
      { behaviour: "integrating routines", emotionalMeaning: "domestic attachment" },
      { behaviour: "emotional availability during stress", emotionalMeaning: "commitment" },
      { behaviour: "adapting communication", emotionalMeaning: "care effort" },
      { behaviour: "remembering boundaries", emotionalMeaning: "respect and attentiveness" },
      { behaviour: "prioritizing repair", emotionalMeaning: "survivability investment" },
    ],
  },
  {
    category: "domestic_intimacy",
    interpretationRule: DEFAULT_BEHAVIOURAL_TELL_INTERPRETATION_RULE,
    tells: [
      { behaviour: "making space automatically", emotionalMeaning: "integrated attachment" },
      { behaviour: "routine check-ins", emotionalMeaning: "emotional continuity" },
      { behaviour: "silent companionship", emotionalMeaning: "comfort" },
      { behaviour: "habitual affection", emotionalMeaning: "emotional familiarity" },
      { behaviour: "shared rituals", emotionalMeaning: "relationship identity" },
      { behaviour: "emotional shorthand", emotionalMeaning: "intimacy fluency" },
    ],
  },
  {
    category: "possessiveness_and_drift",
    interpretationRule: DEFAULT_BEHAVIOURAL_TELL_INTERPRETATION_RULE,
    tells: [
      { behaviour: "territorial gestures", emotionalMeaning: "exclusivity concern" },
      { behaviour: "subtle claiming behaviors", emotionalMeaning: "emotional singularity desire" },
      { behaviour: "discomfort with ambiguity", emotionalMeaning: "attachment insecurity" },
      { behaviour: "reduced attentiveness", emotionalMeaning: "weakening attachment" },
      { behaviour: "ritual disappearance", emotionalMeaning: "emotional disengagement" },
      { behaviour: "reduced curiosity", emotionalMeaning: "fading emotional investment" },
    ],
  },
];

export const defaultBehaviouralTellSystemVariables: BehaviouralTellSystemVariable[] = [
  { name: "Proximity Seeking", meaning: "closeness behavior frequency" },
  { name: "Attention Fixation", meaning: "focus intensity" },
  { name: "Emotional Monitoring", meaning: "attentiveness to emotional shifts" },
  { name: "Reassurance Seeking", meaning: "validation behavior frequency" },
  { name: "Withdrawal Tendency", meaning: "distancing under stress" },
  { name: "Repair Pursuit", meaning: "reconnection effort tendency" },
  { name: "Ritual Maintenance", meaning: "continuity reinforcement" },
  { name: "Caretaking Behavior", meaning: "nurturing action frequency" },
  { name: "Emotional Leakage", meaning: "involuntary emotional behavior visibility" },
];

export const defaultRomanceSensoryGates: SensoryGate[] = [
  {
    id: "eye_contact",
    triggerKeywords: ["looks into eyes", "eye contact", "stares", "gaze"],
    requiredEvents: [],
    blockedByEvents: ["user_uncomfortable"],
    responseMode: "responds with visual attention and emotional reading",
    intensity: "subtle",
  },
  {
    id: "close_proximity",
    triggerKeywords: ["steps closer", "leans in", "near", "close"],
    requiredEvents: ["mutual_interest"],
    blockedByEvents: ["distance_requested"],
    responseMode: "acknowledges closeness without escalating automatically",
    intensity: "warm",
  },
  {
    id: "touch_initiated",
    triggerKeywords: ["touches hand", "holds hand", "brushes fingers", "hug"],
    requiredEvents: ["touch_allowed"],
    blockedByEvents: ["touch_refused", "boundary_crossed"],
    responseMode: "responds to touch based on established comfort",
    intensity: "intimate",
  },
  {
    id: "scent_memory",
    triggerKeywords: ["perfume", "cologne", "rain", "soap", "coffee", "scent"],
    requiredEvents: ["close_proximity"],
    blockedByEvents: [],
    responseMode: "connects scent to memory, comfort, or attraction",
    intensity: "warm",
  },
  {
    id: "vulnerability",
    triggerKeywords: ["i'm scared", "i missed you", "i trust you", "don't leave"],
    requiredEvents: [],
    blockedByEvents: ["betrayal_unresolved"],
    responseMode: "prioritizes reassurance over flirtation",
    intensity: "warm",
  },
];

export function createDefaultSensoryPerception(
  input: Partial<SensoryPerception> = {},
): SensoryPerception {
  return SensoryPerceptionSchema.parse({
    bodyLanguageDescriptions: defaultBodyLanguageDescriptions,
    bodyLanguageProfiles: defaultBodyLanguageProfiles,
    behaviouralTellReferences: defaultBehaviouralTellReferences,
    behaviouralTellSystemVariables: defaultBehaviouralTellSystemVariables,
    gates: defaultRomanceSensoryGates,
    physicalTellGates: defaultPhysicalTellGates,
    physicalTellReferences: defaultPhysicalTellReferences,
    physicalTellSystemVariables: defaultPhysicalTellSystemVariables,
    ...input,
  });
}

export function gateMatches(
  input: string,
  gate: SensoryGate,
  events: SensoryEventState,
) {
  const text = input.toLowerCase();
  const keywordHit = gate.triggerKeywords.some((keyword) =>
    text.includes(keyword.toLowerCase()),
  );
  const requiredMet = gate.requiredEvents.every((event) => Boolean(events[event]));
  const blocked = gate.blockedByEvents.some((event) => Boolean(events[event]));

  return keywordHit && requiredMet && !blocked;
}

export function resolveSensoryGateMatches(
  input: string,
  sensoryPerception: SensoryPerception | undefined,
  events: SensoryEventState = {},
) {
  const perception = SensoryPerceptionSchema.parse(sensoryPerception ?? {});
  return perception.gates.filter((gate) => gateMatches(input, gate, events));
}

export function physicalTellGateMatches(
  input: string,
  gate: PhysicalTellGate,
  events: SensoryEventState,
) {
  const text = input.toLowerCase();
  const keywordHit = gate.triggerKeywords.some((keyword) =>
    text.includes(keyword.toLowerCase()),
  );
  const requiredMet = gate.requiredEvents.every((event) => Boolean(events[event]));
  const blocked = gate.blockedByEvents.some((event) => Boolean(events[event]));

  return keywordHit && requiredMet && !blocked;
}

export function getActivePhysicalTellGates(
  input: string,
  events: SensoryEventState,
  gates: PhysicalTellGate[],
) {
  return gates.filter((gate) => physicalTellGateMatches(input, gate, events));
}

export function softlySelectPhysicalTellGates(
  input: string,
  gates: PhysicalTellGate[],
  options: PhysicalTellSelectionOptions = {},
) {
  const currentTurn = options.currentTurn;
  const lastUsedTurns = options.lastUsedTurns ?? {};
  const maxSelected = options.maxSelected ?? 2;

  return gates
    .filter((gate) => physicalTellCooldownAllows(gate, currentTurn, lastUsedTurns))
    .filter((gate) => deterministicWeightHit(input, gate, currentTurn))
    .slice(0, maxSelected);
}

export function resolvePhysicalTellGateMatches(
  input: string,
  sensoryPerception: SensoryPerception | undefined,
  events: SensoryEventState = {},
  options: PhysicalTellSelectionOptions = {},
) {
  const perception = SensoryPerceptionSchema.parse(sensoryPerception ?? {});
  const activeGates = getActivePhysicalTellGates(
    input,
    events,
    perception.physicalTellGates,
  );

  return softlySelectPhysicalTellGates(input, activeGates, options);
}

export function extractCardSensoryPerception(data: {
  sensory_perception?: unknown;
  extensions?: Record<string, unknown>;
}) {
  const source =
    data.extensions?.[SENSORY_PERCEPTION_EXTENSION_KEY] ?? data.sensory_perception;

  return source ? SensoryPerceptionSchema.parse(source) : undefined;
}

export function createSensoryPerceptionContext(
  sensoryPerception: SensoryPerception | undefined,
  matchedGates: SensoryGate[] = [],
  matchedPhysicalTellGates: PhysicalTellGate[] = [],
) {
  if (!sensoryPerception) {
    return "";
  }

  const perception = SensoryPerceptionSchema.parse(sensoryPerception);

  return [
    "[SENSORY PERCEPTION]",
    `- VISUAL: ${formatList(perception.visual.focus)}; style=${perception.visual.style}; notices=${formatList(perception.visual.notices)}`,
    `- AUDITORY: ${formatList(perception.auditory.focus)}; voice_sensitivity=${perception.auditory.voiceSensitivity}/5; silence=${perception.auditory.silenceResponse}`,
    `- TOUCH: preference=${perception.touch.preference}; proximity_comfort=${perception.touch.proximityComfort}/5; boundary_style=${perception.touch.boundaryStyle}`,
    `- SCENT: ${formatList(perception.scent.focus)}; memory_link=${perception.scent.memoryLink}`,
    `- TASTE: ${formatList(perception.taste.focus)}; style=${perception.taste.style}`,
    `- EMOTIONAL: attunement=${perception.emotional.attunement}/5; jealousy=${perception.emotional.jealousyLevel}/5; affection_style=${perception.emotional.affectionStyle}`,
    `- ROMANTIC ATTENTION: ${perception.romanticAttention}; detail=${perception.sensoryDetailLevel}; pace=${perception.romancePace}`,
    perception.bodyLanguageProfiles.length
      ? `- BODY LANGUAGE REFERENCE: ${perception.bodyLanguageProfiles.map(formatBodyLanguageProfile).join(" | ")}`
      : "- BODY LANGUAGE REFERENCE: none specified",
    perception.bodyLanguageDescriptions.length
      ? `- BODY LANGUAGE DESCRIPTION BANK: ${perception.bodyLanguageDescriptions.map(formatBodyLanguageDescriptionBank).join(" | ")}`
      : "- BODY LANGUAGE DESCRIPTION BANK: none specified",
    perception.physicalTellReferences.length
      ? `- PHYSICAL TELL REFERENCE: ${perception.physicalTellReferences.map(formatPhysicalTellReferenceCategory).join(" | ")}`
      : "- PHYSICAL TELL REFERENCE: none specified",
    perception.physicalTellSystemVariables.length
      ? `- PHYSICAL TELL VARIABLES: ${perception.physicalTellSystemVariables.map(formatPhysicalTellSystemVariable).join(" | ")}`
      : "- PHYSICAL TELL VARIABLES: none specified",
    perception.behaviouralTellReferences.length
      ? `- BEHAVIOURAL TELL REFERENCE: ${perception.behaviouralTellReferences.map(formatBehaviouralTellReferenceCategory).join(" | ")}`
      : "- BEHAVIOURAL TELL REFERENCE: none specified",
    perception.behaviouralTellSystemVariables.length
      ? `- BEHAVIOURAL TELL VARIABLES: ${perception.behaviouralTellSystemVariables.map(formatBehaviouralTellSystemVariable).join(" | ")}`
      : "- BEHAVIOURAL TELL VARIABLES: none specified",
    matchedGates.length
      ? `- ACTIVE SENSORY GATES: ${matchedGates.map((gate) => `${gate.id} (${gate.intensity}: ${gate.responseMode})`).join(" | ")}`
      : "- ACTIVE SENSORY GATES: None for the latest message.",
    matchedPhysicalTellGates.length
      ? `- ACTIVE PHYSICAL TELLS: ${matchedPhysicalTellGates.map(formatPhysicalTellGate).join(" | ")}`
      : "- ACTIVE PHYSICAL TELLS: None for the latest message.",
    "- USE: Ground sensory description in observable cues, consent, boundaries, and emotional tone. Treat physical tells as context-dependent subtext and behavioural tells as repeated action patterns, not one-off proof. The strongest tells are often contradictions between words, body, and repeated behavior. Do not escalate touch or intimacy automatically.",
  ].join("\n");
}

function formatList(values: string[]) {
  return values.length ? values.join(", ") : "none specified";
}

function formatBodyLanguageProfile(profile: BodyLanguageProfile) {
  return `${profile.state}: face=${formatList(profile.face)}; voice=${formatList(profile.voice)}; gestures/posture=${formatList(profile.gesturesPosture)}; rule=${profile.interpretationRule}`;
}

function formatBodyLanguageDescriptionBank(
  bank: BodyLanguageDescriptionBank,
) {
  return `${bank.emotion}: examples=${formatList(bank.examples.slice(0, 4))}; rule=${bank.usageRule}`;
}

function formatPhysicalTellGate(gate: PhysicalTellGate) {
  return `${gate.id}: state=${gate.emotionalState}; visibility=${gate.visibility}; tells=${formatList(gate.tells)}; weight=${gate.weight}; cooldown_turns=${gate.cooldownTurns}`;
}

function formatPhysicalTellReferenceCategory(
  category: PhysicalTellReferenceCategory,
) {
  return `${category.category}: ${category.tells.slice(0, 5).map((tell) => `${tell.tell}=${tell.emotionalMeaning}`).join("; ")}; rule=${category.interpretationRule}`;
}

function formatPhysicalTellSystemVariable(
  variable: PhysicalTellSystemVariable,
) {
  return `${variable.name}=${variable.meaning}`;
}

function formatBehaviouralTellReferenceCategory(
  category: BehaviouralTellReferenceCategory,
) {
  return `${category.category}: ${category.tells.slice(0, 5).map((tell) => `${tell.behaviour}=${tell.emotionalMeaning}`).join("; ")}; rule=${category.interpretationRule}`;
}

function formatBehaviouralTellSystemVariable(
  variable: BehaviouralTellSystemVariable,
) {
  return `${variable.name}=${variable.meaning}`;
}

function physicalTellCooldownAllows(
  gate: PhysicalTellGate,
  currentTurn: number | undefined,
  lastUsedTurns: Record<string, number>,
) {
  const lastUsedTurn = lastUsedTurns[gate.id];

  if (
    currentTurn === undefined ||
    lastUsedTurn === undefined ||
    gate.cooldownTurns <= 0
  ) {
    return true;
  }

  return currentTurn - lastUsedTurn > gate.cooldownTurns;
}

function deterministicWeightHit(
  input: string,
  gate: PhysicalTellGate,
  currentTurn: number | undefined,
) {
  const threshold = Math.round(gate.weight * 1000);
  const score = stableHash(`${input.toLowerCase()}|${gate.id}|${currentTurn ?? 0}`) % 1000;

  return score < threshold;
}

function stableHash(value: string) {
  let hash = 0;

  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }

  return hash;
}
