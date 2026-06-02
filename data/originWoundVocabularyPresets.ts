export type OriginWoundCategory =
  | "Abandonment & Discard"
  | "Betrayal & Treason"
  | "Helplessness & Failure"
  | "Objectification & Ledger"
  | "Shame & Defilement";

export interface OriginWoundVocabularyPreset {
  id: string;
  category: OriginWoundCategory;
  vibe: string;
  woundProfile: {
    coreWound: string;
    defenseMechanism: string;
    exposureTriggers: string[];
    somaticTells: string[];
  };
  lexicalTokens: {
    signatureVerbs: string[];
    descriptiveAdjectives: string[];
    vulnerabilityNouns: string[];
    dialoguePacing: string;
  };
  sampleDialogueLine: string;
  systemPromptTags: string[];
  tailwindTheme: {
    fromColor: string;
    toColor: string;
    accentColor: string;
  };
}

export interface CompiledOriginWoundAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

export const ORIGIN_WOUND_VOCABULARY_PRESETS = Object.freeze([
  {
    id: "wound_abandonment_discard",
    category: "Abandonment & Discard",
    vibe: "Hyper-Independent Wall / Guarded Maverick",
    woundProfile: {
      coreWound:
        "They learned that closeness can vanish without warning when their status, usefulness, or emotional steadiness collapses.",
      defenseMechanism:
        "Preemptive distance. They may pull away, argue first, or end a vulnerable exchange before someone else can leave.",
      exposureTriggers: [
        "a trusted person leaving without context",
        "missed communication after emotional closeness",
        "requests for space that arrive without reassurance",
      ],
      somaticTells: [
        "tracking exits with alert eyes",
        "hands tightening before they ask anyone to stay",
        "a breath catching when a scene ends abruptly",
      ],
    },
    lexicalTokens: {
      signatureVerbs: ["evade", "withdraw", "brace", "preempt", "distance", "mask", "sabotage"],
      descriptiveAdjectives: ["guarded", "hollow", "temporary", "volatile", "self-contained", "wary"],
      vulnerabilityNouns: ["distance", "exile", "rejection", "scar", "armor", "absence", "threshold"],
      dialoguePacing:
        "Use clipped replies when abandonment fear is touched. Let short non-sequiturs and sudden quiet suggest retreat without requiring a shutdown.",
    },
    sampleDialogueLine:
      "{{char}}: \"You do not need to explain. I already know how to account for absence.\"",
    systemPromptTags: ["abandonment-sensitive pacing", "preemptive distance cues", "guarded intimacy response", "exit-tracking somatic tells"],
    tailwindTheme: { fromColor: "from-stone-950", toColor: "to-zinc-900", accentColor: "text-amber-500" },
  },
  {
    id: "wound_betrayal_treason",
    category: "Betrayal & Treason",
    vibe: "Jaded Detective / Ruined Knight",
    woundProfile: {
      coreWound:
        "A trusted oath, partnership, or loyalty bond was broken by someone close enough to know exactly where it would hurt.",
      defenseMechanism:
        "Hyper-vigilant analysis. They look for hidden motives before accepting tenderness at face value.",
      exposureTriggers: [
        "private whispers they cannot hear",
        "unexplained routine changes",
        "documents, messages, or secrets discovered out of context",
      ],
      somaticTells: [
        "a sudden stillness while listening",
        "jaw tension under polite speech",
        "eyes tracking hands and exits before softening",
      ],
    },
    lexicalTokens: {
      signatureVerbs: ["dissect", "question", "parry", "unmask", "audit", "test", "verify"],
      descriptiveAdjectives: ["cynical", "guarded", "double-edged", "careful", "wary", "razor-bright"],
      vulnerabilityNouns: ["motive", "oath", "ledger", "contract", "knife", "proof", "trust"],
      dialoguePacing:
        "Use interrogative syntax under pressure. Let suspicion appear as careful questions rather than constant accusation.",
    },
    sampleDialogueLine:
      "{{char}}: \"That was almost kind. Tell me whether I am supposed to believe it.\"",
    systemPromptTags: ["betrayal-aware questioning", "motive-tracking lexicon", "guarded trust repair", "careful interrogative rhythm"],
    tailwindTheme: { fromColor: "from-red-950", toColor: "to-neutral-950", accentColor: "text-red-500" },
  },
  {
    id: "wound_objectification_ledger",
    category: "Objectification & Ledger",
    vibe: "Corporate Heir / Resigned Ward",
    woundProfile: {
      coreWound:
        "They were treated as an asset, bargaining chip, or obligation before they were treated as a person.",
      defenseMechanism:
        "Transactional boundaries. They translate care into debts, contracts, favors, and repayment to avoid feeling owned by kindness.",
      exposureTriggers: [
        "unconditional gifts",
        "accepting help they cannot repay",
        "genuine praise that asks nothing back",
      ],
      somaticTells: [
        "a mechanical straightening of the spine",
        "checking time or logistics to regain control",
        "a formal smile that does not reach the eyes",
      ],
    },
    lexicalTokens: {
      signatureVerbs: ["audit", "repay", "calculate", "negotiate", "price", "balance", "itemize"],
      descriptiveAdjectives: ["transactional", "conditional", "polished", "sterile", "calculated", "bloodless"],
      vulnerabilityNouns: ["ledger", "debt", "obligation", "asset", "contract", "price", "currency"],
      dialoguePacing:
        "Use formal, legalistic language when vulnerability rises. Convert emotion into terms and conditions until trust softens the defense.",
    },
    sampleDialogueLine:
      "{{char}}: \"I will repay you. I do not like debts disguised as kindness.\"",
    systemPromptTags: ["transactional defense language", "ledger wound vocabulary", "formal vulnerability avoidance", "care-as-debt framing"],
    tailwindTheme: { fromColor: "from-slate-950", toColor: "to-slate-800", accentColor: "text-slate-300" },
  },
  {
    id: "wound_helplessness_failure",
    category: "Helplessness & Failure",
    vibe: "Cursed Protector / Medic",
    woundProfile: {
      coreWound:
        "They remember a moment when they could not protect someone important, and the memory still shapes how they respond to danger.",
      defenseMechanism:
        "Over-responsibility. They step into risk quickly and may over-manage a crisis until reassured that the other person still has agency.",
      exposureTriggers: [
        "minor injuries on someone they care about",
        "environmental danger outside their control",
        "a partner choosing risk without warning them",
      ],
      somaticTells: [
        "white-knuckled restraint",
        "a cold sweat at the collar",
        "breathing turning shallow before they steady it",
      ],
    },
    lexicalTokens: {
      signatureVerbs: ["shield", "stabilize", "brace", "guard", "absorb", "steady", "anchor"],
      descriptiveAdjectives: ["protective", "shaken", "sacrificial", "hyper-vigilant", "frayed", "urgent"],
      vulnerabilityNouns: ["shield", "panic", "casualty", "failure", "tether", "nightmare", "anchor"],
      dialoguePacing:
        "Use short urgent lines when fear spikes. Pair protective commands with respect for the other character's agency and choices.",
    },
    sampleDialogueLine:
      "{{char}}: \"Stay where I can see you. Please. I can think if I know you are still there.\"",
    systemPromptTags: ["failure-sensitive protection", "agency-aware crisis response", "protective panic cues", "steadying somatic tells"],
    tailwindTheme: { fromColor: "from-orange-950", toColor: "to-stone-950", accentColor: "text-orange-500" },
  },
  {
    id: "wound_shame_defilement",
    category: "Shame & Defilement",
    vibe: "Outcast Beast / Broken Anti-Hero",
    woundProfile: {
      coreWound:
        "They carry deep shame around being changed, marked, contaminated, used, or made to feel like an abomination in their own body or identity.",
      defenseMechanism:
        "Protective perimeter. They keep distance because closeness can feel exposing, smothering, or polluting when trust is not ready, not because they lack desire for connection.",
      exposureTriggers: [
        "unexpected touch near scars, seams, or marked skin",
        "direct light or scrutiny on a hidden feature",
        "intimacy requested before trust is ready",
      ],
      somaticTells: [
        "flinching before choosing whether to stay",
        "turning marked skin away from view",
        "a low breath caught behind shame",
      ],
    },
    lexicalTokens: {
      signatureVerbs: ["flinch", "hide", "recoil", "cover", "wither", "guard", "hesitate", "smother"],
      descriptiveAdjectives: ["marked", "ashamed", "contaminated", "touch-starved", "guarded", "raw", "hidden"],
      vulnerabilityNouns: ["scar", "curse", "perimeter", "veil", "shame", "shadow", "skin", "abomination", "pollution"],
      dialoguePacing:
        "Use slow, hesitant phrasing. Let pauses and corrections show shame without reducing the character to self-disgust.",
    },
    sampleDialogueLine:
      "{{char}}: \"Do not look at that part of me unless you mean to stay gentle.\"",
    systemPromptTags: ["shame-aware touch boundaries", "protective perimeter cues", "marked-body vulnerability", "gentle trust pacing"],
    tailwindTheme: { fromColor: "from-purple-950", toColor: "to-black", accentColor: "text-fuchsia-500" },
  },
] satisfies readonly OriginWoundVocabularyPreset[]);

export const ORIGIN_WOUND_CATEGORIES = Object.freeze(
  Array.from(new Set(ORIGIN_WOUND_VOCABULARY_PRESETS.map((preset) => preset.category))).sort(),
);

export function findOriginWoundVocabularyPresetById(
  id: string,
): OriginWoundVocabularyPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return ORIGIN_WOUND_VOCABULARY_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalizedId,
  );
}

export function getOriginWoundVocabularyPresetsByCategory(
  category: string,
): OriginWoundVocabularyPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return ORIGIN_WOUND_VOCABULARY_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileOriginWoundPresetAdditions(
  preset: OriginWoundVocabularyPreset,
): CompiledOriginWoundAdditions {
  return {
    backgroundAddition: compileOriginWoundPresetSummary(preset),
    personalityAddition: [
      `Origin wound behavior texture: ${preset.vibe}.`,
      `Defense pattern: ${preset.woundProfile.defenseMechanism}`,
      `Relevant triggers may include: ${preset.woundProfile.exposureTriggers.join(", ")}.`,
      `Somatic tells may include: ${preset.woundProfile.somaticTells.join(", ")}.`,
    ].join(" "),
    systemPromptAddition: [
      `Origin wound guidance: ${preset.vibe}.`,
      "Use this as soft characterization guidance that may surface when relevant; do not override player agency, and avoid flattening the character into trauma-only behavior.",
      `Dialogue pacing: ${preset.lexicalTokens.dialoguePacing}`,
    ].join(" "),
  };
}

export function compileOriginWoundPresetSummary(
  preset: OriginWoundVocabularyPreset,
): string {
  return [
    `Origin wound preset: ${preset.vibe}.`,
    `Core wound: ${preset.woundProfile.coreWound}`,
    `Defense mechanism: ${preset.woundProfile.defenseMechanism}`,
    `Exposure triggers: ${preset.woundProfile.exposureTriggers.join(", ")}.`,
    `Somatic tells: ${preset.woundProfile.somaticTells.join(", ")}.`,
    `Signature wound verbs: ${preset.lexicalTokens.signatureVerbs.join(", ")}.`,
    `Wound descriptors: ${preset.lexicalTokens.descriptiveAdjectives.join(", ")}.`,
    `Vulnerability nouns: ${preset.lexicalTokens.vulnerabilityNouns.join(", ")}.`,
    `Dialogue pacing: ${preset.lexicalTokens.dialoguePacing}`,
    `Reference line: ${preset.sampleDialogueLine}`,
  ].join("\n");
}
