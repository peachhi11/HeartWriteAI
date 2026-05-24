import {
  RelationshipStateSchema,
  type RelationshipState,
} from "./relationshipState.schema";

type Role = "user" | "assistant";

export interface RelationshipUpdateMessage {
  role: Role;
  content: string;
  createdAt?: number;
}

export interface RelationshipPatchReason {
  key: string;
  delta: number;
  reason: string;
}

export interface RelationshipUpdateResult {
  state: RelationshipState;
  reasons: RelationshipPatchReason[];
}

const clamp = (value: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(value)));

const clampSigned = (value: number) =>
  Math.max(-100, Math.min(100, Math.round(value)));

const includesAny = (text: string, terms: readonly string[]) =>
  terms.some((term) => text.includes(term));

const countMatches = (text: string, terms: readonly string[]) =>
  terms.reduce((sum, term) => sum + (text.includes(term) ? 1 : 0), 0);

const KEYWORDS = {
  affection: [
    "i care",
    "i missed you",
    "i love you",
    "sweetheart",
    "darling",
    "baby",
    "hold you",
    "hug",
    "kiss",
  ],
  reassurance: [
    "i'm here",
    "i am here",
    "you matter",
    "i won't leave",
    "not leaving",
    "still choose you",
    "you're safe",
  ],
  confession: [
    "i love you",
    "i'm in love",
    "i have feelings",
    "i want us",
    "i need you",
    "i can't stop thinking about you",
  ],
  apology: [
    "i'm sorry",
    "i apologize",
    "i was wrong",
    "i hurt you",
    "forgive me",
  ],
  accountability: [
    "i understand why",
    "i take responsibility",
    "i should not have",
    "i won't do that again",
    "i will change",
  ],
  comfort: [
    "it's okay",
    "come here",
    "breathe",
    "i've got you",
    "you're not alone",
    "let me hold you",
  ],
  jealousy: [
    "jealous",
    "who was that",
    "do you like them",
    "replace me",
    "choose them",
    "mine",
  ],
  conflict: [
    "leave me alone",
    "shut up",
    "i hate you",
    "you never",
    "you always",
    "whatever",
  ],
  abandonment: [
    "i'm done",
    "goodbye",
    "don't contact me",
    "i'm leaving",
    "go away",
    "disappear",
  ],
  betrayal: [
    "you lied",
    "cheated",
    "betrayed",
    "kept this from me",
    "secret",
    "behind my back",
  ],
  invalidation: [
    "overreacting",
    "too sensitive",
    "not a big deal",
    "dramatic",
    "calm down",
  ],
  humiliation: ["pathetic", "embarrassing", "ridiculous", "weak", "laughable"],
  boundary: [
    "stop",
    "don't touch me",
    "i need space",
    "that crossed a line",
    "respect my boundary",
  ],
  commitment: [
    "exclusive",
    "official",
    "boyfriend",
    "girlfriend",
    "partner",
    "together",
    "relationship",
  ],
  breakup: ["break up", "it's over", "we're done", "end this"],
  firstKiss: ["kiss you", "kissed", "first kiss"],
  sexualIntimacy: ["sleep with you", "slept together", "make love", "sex"],
} as const;

type MetricPath =
  | "attachment.abandonmentSensitivity"
  | "attachment.bondDepth"
  | "chemistry.romantic"
  | "chemistry.sexual"
  | "chemistry.tension"
  | "exclusivity.jealousyReactivity"
  | "intimacy.emotional"
  | "intimacy.physical"
  | "intimacy.sexual"
  | "intimacy.vulnerability"
  | "momentum.attachment"
  | "momentum.conflict"
  | "momentum.repair"
  | "momentum.stability"
  | "momentum.trust"
  | "needs.exclusivity"
  | "rupture.accountabilityLevel"
  | "rupture.repairProgress"
  | "trust.autonomy"
  | "trust.conflict"
  | "trust.emotional"
  | "trust.loyalty"
  | "trust.reliability"
  | "trust.sexual"
  | "trust.vulnerability";

type EventMemoryType = RelationshipState["memories"][number]["type"];
type RuptureType = NonNullable<RelationshipState["rupture"]["type"]>;

export function updateRelationshipFromMessages(
  current: RelationshipState,
  recentMessages: RelationshipUpdateMessage[],
): RelationshipUpdateResult {
  const state = RelationshipStateSchema.parse(structuredClone(current));
  const reasons: RelationshipPatchReason[] = [];
  const timestampSeed = getTimestampSeed(state, recentMessages);

  const text = recentMessages
    .slice(-12)
    .map((message) => message.content.toLowerCase())
    .join("\n");

  const affection = countMatches(text, KEYWORDS.affection);
  const reassurance = countMatches(text, KEYWORDS.reassurance);
  const confession = countMatches(text, KEYWORDS.confession);
  const apology = countMatches(text, KEYWORDS.apology);
  const accountability = countMatches(text, KEYWORDS.accountability);
  const comfort = countMatches(text, KEYWORDS.comfort);
  const jealousy = countMatches(text, KEYWORDS.jealousy);
  const conflict = countMatches(text, KEYWORDS.conflict);

  if (affection) {
    applyDelta(
      state,
      reasons,
      "intimacy.emotional",
      affection * 3,
      "affection expressed",
    );
    applyDelta(
      state,
      reasons,
      "chemistry.romantic",
      affection * 2,
      "romantic warmth increased",
    );
    applyDelta(
      state,
      reasons,
      "momentum.attachment",
      affection * 2,
      "positive attachment momentum",
    );
  }

  if (reassurance) {
    applyDelta(
      state,
      reasons,
      "trust.emotional",
      reassurance * 4,
      "reassurance restored emotional safety",
    );
    applyDelta(
      state,
      reasons,
      "attachment.abandonmentSensitivity",
      -reassurance * 2,
      "abandonment fear soothed",
    );
    applyDelta(
      state,
      reasons,
      "momentum.stability",
      reassurance * 3,
      "stability momentum increased",
    );
    addMemory(
      state,
      "reassurance",
      "Reassurance was offered.",
      55,
      timestampSeed,
      { trustImpact: 5 },
      ["reassurance"],
    );
  }

  if (confession) {
    state.flags.confessionOccurred = true;
    applyDelta(
      state,
      reasons,
      "intimacy.vulnerability",
      10,
      "confession increased vulnerability",
    );
    applyDelta(
      state,
      reasons,
      "attachment.bondDepth",
      8,
      "confession deepened attachment",
    );
    applyDelta(
      state,
      reasons,
      "chemistry.romantic",
      8,
      "romantic confession",
    );
    addMemory(
      state,
      "confession",
      "A romantic or emotional confession occurred.",
      80,
      timestampSeed,
      { intimacyImpact: 10 },
      ["confession"],
    );
  }

  if (apology) {
    applyDelta(
      state,
      reasons,
      "trust.conflict",
      apology * 4,
      "apology improved conflict trust",
    );
    applyDelta(
      state,
      reasons,
      "rupture.repairProgress",
      apology * 8,
      "apology advanced repair",
    );
    addMemory(
      state,
      "apology",
      "An apology was made.",
      50,
      timestampSeed,
      { trustImpact: 4 },
      ["repair"],
    );
  }

  if (accountability) {
    applyDelta(
      state,
      reasons,
      "rupture.accountabilityLevel",
      accountability * 12,
      "accountability shown",
    );
    applyDelta(
      state,
      reasons,
      "trust.reliability",
      accountability * 4,
      "accountability supports reliability trust",
    );
    applyDelta(
      state,
      reasons,
      "momentum.repair",
      accountability * 5,
      "repair momentum increased",
    );
  }

  if (comfort) {
    applyDelta(
      state,
      reasons,
      "intimacy.emotional",
      comfort * 4,
      "comfort increased emotional intimacy",
    );
    applyDelta(
      state,
      reasons,
      "trust.vulnerability",
      comfort * 3,
      "comfort made vulnerability safer",
    );
    applyDelta(
      state,
      reasons,
      "momentum.trust",
      comfort * 2,
      "comfort built trust momentum",
    );
    addMemory(
      state,
      "comfort",
      "Comfort was offered during emotional need.",
      65,
      timestampSeed,
      { trustImpact: 5, intimacyImpact: 6 },
      ["comfort"],
    );
  }

  if (jealousy) {
    applyDelta(
      state,
      reasons,
      "exclusivity.jealousyReactivity",
      jealousy * 5,
      "jealousy activated exclusivity system",
    );
    applyDelta(
      state,
      reasons,
      "chemistry.tension",
      jealousy * 3,
      "jealousy increased tension",
    );
    applyDelta(
      state,
      reasons,
      "attachment.abandonmentSensitivity",
      jealousy * 2,
      "jealousy increased attachment insecurity",
    );
    addMemory(
      state,
      "jealousy",
      "A jealousy moment occurred.",
      60,
      timestampSeed,
      { trustImpact: -2 },
      ["jealousy"],
    );
  }

  if (conflict) {
    applyDelta(
      state,
      reasons,
      "trust.conflict",
      -conflict * 5,
      "conflict damaged conflict trust",
    );
    applyDelta(
      state,
      reasons,
      "momentum.conflict",
      conflict * 6,
      "conflict momentum increased",
    );
    applyDelta(
      state,
      reasons,
      "momentum.stability",
      -conflict * 4,
      "stability decreased",
    );

    if (conflict >= 2) {
      setRupture(state, "conflict_spiral", Math.min(4, conflict), reasons);
    }
  }

  if (includesAny(text, KEYWORDS.abandonment)) {
    setRupture(state, "abandonment", 3, reasons);
    applyDelta(
      state,
      reasons,
      "trust.emotional",
      -14,
      "abandonment damaged emotional trust",
    );
    applyDelta(
      state,
      reasons,
      "attachment.abandonmentSensitivity",
      15,
      "abandonment sensitivity increased",
    );
    applyDelta(
      state,
      reasons,
      "momentum.trust",
      -12,
      "trust momentum damaged",
    );
  }

  if (includesAny(text, KEYWORDS.betrayal)) {
    state.flags.betrayalOccurred = true;
    setRupture(state, "betrayal", 4, reasons);
    applyDelta(
      state,
      reasons,
      "trust.loyalty",
      -25,
      "betrayal damaged loyalty trust",
    );
    applyDelta(
      state,
      reasons,
      "trust.vulnerability",
      -20,
      "betrayal damaged vulnerability trust",
    );
    applyDelta(
      state,
      reasons,
      "momentum.trust",
      -20,
      "betrayal reversed trust momentum",
    );
    addMemory(
      state,
      "betrayal",
      "A betrayal rupture occurred.",
      95,
      timestampSeed,
      { trustImpact: -25, intimacyImpact: -10 },
      ["rupture"],
    );
  }

  if (includesAny(text, KEYWORDS.invalidation)) {
    setRupture(state, "emotional_invalidation", 3, reasons);
    applyDelta(
      state,
      reasons,
      "trust.emotional",
      -12,
      "emotional invalidation damaged safety",
    );
    applyDelta(
      state,
      reasons,
      "trust.vulnerability",
      -12,
      "vulnerability became less safe",
    );
  }

  if (includesAny(text, KEYWORDS.humiliation)) {
    setRupture(state, "humiliation", 3, reasons);
    applyDelta(
      state,
      reasons,
      "trust.vulnerability",
      -16,
      "humiliation damaged vulnerability trust",
    );
    applyDelta(
      state,
      reasons,
      "intimacy.vulnerability",
      -10,
      "humiliation reduced openness",
    );
  }

  if (includesAny(text, KEYWORDS.boundary)) {
    applyDelta(state, reasons, "trust.autonomy", 6, "boundary was named");

    if (
      includesAny(text, ["crossed a line", "don't touch me", "stop"])
    ) {
      setRupture(state, "boundary_violation", 3, reasons);
      applyDelta(
        state,
        reasons,
        "trust.autonomy",
        -18,
        "boundary violation damaged autonomy trust",
      );
    }
  }

  if (includesAny(text, KEYWORDS.commitment)) {
    state.flags.officialRelationship = true;
    applyDelta(
      state,
      reasons,
      "attachment.bondDepth",
      10,
      "commitment language increased bond depth",
    );
    applyDelta(
      state,
      reasons,
      "trust.loyalty",
      8,
      "commitment increased loyalty trust",
    );
    applyDelta(
      state,
      reasons,
      "needs.exclusivity",
      5,
      "exclusivity expectation increased",
    );
  }

  if (includesAny(text, KEYWORDS.breakup)) {
    state.flags.breakupOccurred = true;
    setRupture(state, "abandonment", 4, reasons);
    addMemory(
      state,
      "breakup",
      "A breakup occurred.",
      95,
      timestampSeed,
      { trustImpact: -20, intimacyImpact: -20 },
      ["breakup"],
    );
  }

  if (includesAny(text, KEYWORDS.firstKiss) && !state.flags.firstKiss) {
    state.flags.firstKiss = true;
    applyDelta(
      state,
      reasons,
      "intimacy.physical",
      15,
      "first kiss increased physical intimacy",
    );
    applyDelta(
      state,
      reasons,
      "chemistry.romantic",
      10,
      "first kiss increased romantic chemistry",
    );
    addMemory(
      state,
      "first_kiss",
      "The first kiss happened.",
      85,
      timestampSeed,
      { intimacyImpact: 15 },
      ["milestone"],
    );
  }

  if (
    includesAny(text, KEYWORDS.sexualIntimacy) &&
    !state.flags.sexualIntimacyOccurred
  ) {
    state.flags.sexualIntimacyOccurred = true;
    applyDelta(
      state,
      reasons,
      "intimacy.sexual",
      20,
      "sexual intimacy occurred",
    );
    applyDelta(
      state,
      reasons,
      "chemistry.sexual",
      10,
      "sexual chemistry increased",
    );
    applyDelta(
      state,
      reasons,
      "trust.sexual",
      8,
      "sexual trust increased if context was positive",
    );
  }

  if (state.rupture.active && state.rupture.repairProgress >= 80) {
    state.rupture.active = false;
    state.rupture.severity = Math.max(0, state.rupture.severity - 2);
    state.rupture.trustDamage = clamp(state.rupture.trustDamage - 30);
    state.rupture.vulnerabilityDamage = clamp(
      state.rupture.vulnerabilityDamage - 25,
    );
    reasons.push({
      key: "rupture.active",
      delta: -1,
      reason: "repair progress resolved active rupture",
    });
  }

  state.lifecycleState = resolveLifecycle(state);

  return {
    state: RelationshipStateSchema.parse(state),
    reasons,
  };
}

function applyDelta(
  state: RelationshipState,
  reasons: RelationshipPatchReason[],
  path: MetricPath,
  delta: number,
  reason: string,
) {
  setMetric(state, path, getMetric(state, path) + delta);
  reasons.push({ key: path, delta, reason });
}

function getMetric(state: RelationshipState, path: MetricPath) {
  switch (path) {
    case "attachment.abandonmentSensitivity":
      return state.attachment.abandonmentSensitivity;
    case "attachment.bondDepth":
      return state.attachment.bondDepth;
    case "chemistry.romantic":
      return state.chemistry.romantic;
    case "chemistry.sexual":
      return state.chemistry.sexual;
    case "chemistry.tension":
      return state.chemistry.tension;
    case "exclusivity.jealousyReactivity":
      return state.exclusivity.jealousyReactivity;
    case "intimacy.emotional":
      return state.intimacy.emotional;
    case "intimacy.physical":
      return state.intimacy.physical;
    case "intimacy.sexual":
      return state.intimacy.sexual;
    case "intimacy.vulnerability":
      return state.intimacy.vulnerability;
    case "momentum.attachment":
      return state.momentum.attachment;
    case "momentum.conflict":
      return state.momentum.conflict;
    case "momentum.repair":
      return state.momentum.repair;
    case "momentum.stability":
      return state.momentum.stability;
    case "momentum.trust":
      return state.momentum.trust;
    case "needs.exclusivity":
      return state.needs.exclusivity;
    case "rupture.accountabilityLevel":
      return state.rupture.accountabilityLevel;
    case "rupture.repairProgress":
      return state.rupture.repairProgress;
    case "trust.autonomy":
      return state.trust.autonomy;
    case "trust.conflict":
      return state.trust.conflict;
    case "trust.emotional":
      return state.trust.emotional;
    case "trust.loyalty":
      return state.trust.loyalty;
    case "trust.reliability":
      return state.trust.reliability;
    case "trust.sexual":
      return state.trust.sexual;
    case "trust.vulnerability":
      return state.trust.vulnerability;
  }
}

function setMetric(
  state: RelationshipState,
  path: MetricPath,
  value: number,
) {
  const nextValue = path.startsWith("momentum.")
    ? clampSigned(value)
    : clamp(value);

  switch (path) {
    case "attachment.abandonmentSensitivity":
      state.attachment.abandonmentSensitivity = nextValue;
      return;
    case "attachment.bondDepth":
      state.attachment.bondDepth = nextValue;
      return;
    case "chemistry.romantic":
      state.chemistry.romantic = nextValue;
      return;
    case "chemistry.sexual":
      state.chemistry.sexual = nextValue;
      return;
    case "chemistry.tension":
      state.chemistry.tension = nextValue;
      return;
    case "exclusivity.jealousyReactivity":
      state.exclusivity.jealousyReactivity = nextValue;
      return;
    case "intimacy.emotional":
      state.intimacy.emotional = nextValue;
      return;
    case "intimacy.physical":
      state.intimacy.physical = nextValue;
      return;
    case "intimacy.sexual":
      state.intimacy.sexual = nextValue;
      return;
    case "intimacy.vulnerability":
      state.intimacy.vulnerability = nextValue;
      return;
    case "momentum.attachment":
      state.momentum.attachment = nextValue;
      return;
    case "momentum.conflict":
      state.momentum.conflict = nextValue;
      return;
    case "momentum.repair":
      state.momentum.repair = nextValue;
      return;
    case "momentum.stability":
      state.momentum.stability = nextValue;
      return;
    case "momentum.trust":
      state.momentum.trust = nextValue;
      return;
    case "needs.exclusivity":
      state.needs.exclusivity = nextValue;
      return;
    case "rupture.accountabilityLevel":
      state.rupture.accountabilityLevel = nextValue;
      return;
    case "rupture.repairProgress":
      state.rupture.repairProgress = nextValue;
      return;
    case "trust.autonomy":
      state.trust.autonomy = nextValue;
      return;
    case "trust.conflict":
      state.trust.conflict = nextValue;
      return;
    case "trust.emotional":
      state.trust.emotional = nextValue;
      return;
    case "trust.loyalty":
      state.trust.loyalty = nextValue;
      return;
    case "trust.reliability":
      state.trust.reliability = nextValue;
      return;
    case "trust.sexual":
      state.trust.sexual = nextValue;
      return;
    case "trust.vulnerability":
      state.trust.vulnerability = nextValue;
      return;
  }
}

function addMemory(
  state: RelationshipState,
  type: EventMemoryType,
  summary: string,
  emotionalWeight: number,
  timestampSeed: number,
  impacts: Partial<
    Pick<RelationshipState["memories"][number], "trustImpact" | "intimacyImpact">
  > = {},
  tags: string[] = [],
) {
  const memoryIndex = state.memories.length;

  state.memories.push({
    id: `mem_${timestampSeed}_${memoryIndex}`,
    type,
    summary,
    emotionalWeight: clamp(emotionalWeight),
    trustImpact: impacts.trustImpact ?? 0,
    intimacyImpact: impacts.intimacyImpact ?? 0,
    timestamp: timestampSeed,
    tags,
  });

  state.memories = state.memories
    .sort((a, b) => b.emotionalWeight - a.emotionalWeight)
    .slice(0, 80);
}

function setRupture(
  state: RelationshipState,
  type: RuptureType,
  severity: number,
  reasons: RelationshipPatchReason[],
) {
  state.rupture.active = true;
  state.rupture.type = type;
  state.rupture.severity = Math.max(state.rupture.severity, severity);
  state.rupture.trustDamage = clamp(
    state.rupture.trustDamage + severity * 12,
  );
  state.rupture.vulnerabilityDamage = clamp(
    state.rupture.vulnerabilityDamage + severity * 10,
  );
  state.rupture.repairArc = repairArcByRuptureType[type];

  reasons.push({
    key: "rupture",
    delta: severity,
    reason: `${type} rupture detected`,
  });
}

function resolveLifecycle(
  state: RelationshipState,
): RelationshipState["lifecycleState"] {
  const { trust, intimacy, chemistry, attachment, rupture, momentum, flags } =
    state;

  if (flags.breakupOccurred) {
    return "dissolution";
  }

  if (rupture.active && rupture.severity >= 3 && rupture.repairProgress < 40) {
    return "fracture";
  }

  if (rupture.active && rupture.repairProgress >= 40) {
    return "repair";
  }

  if (momentum.drift > 40) {
    return "drift";
  }

  if (chemistry.obsessive > 70 || momentum.obsession > 60) {
    return "obsession";
  }

  if (intimacy.domestic > 60 && attachment.bondDepth > 60) {
    return "domestic_integration";
  }

  if (
    trust.emotional > 70 &&
    trust.conflict > 60 &&
    attachment.bondDepth > 70
  ) {
    return "stable_partnership";
  }

  if (intimacy.vulnerability > 50) {
    return "vulnerability";
  }

  if (attachment.bondDepth > 45) {
    return "attachment_formation";
  }

  if (chemistry.tension > 45) {
    return "tension";
  }

  if (chemistry.romantic > 30 || chemistry.sexual > 30) {
    return "attraction";
  }

  return "potential";
}

function getTimestampSeed(
  state: RelationshipState,
  recentMessages: RelationshipUpdateMessage[],
) {
  const latestMessageTime = recentMessages.reduce(
    (latest, message) => Math.max(latest, message.createdAt ?? 0),
    0,
  );
  const latestMemoryTime = state.memories.reduce(
    (latest, memory) => Math.max(latest, memory.timestamp),
    0,
  );

  return Math.max(latestMessageTime, latestMemoryTime, 0);
}

const repairArcByRuptureType: Record<
  RuptureType,
  RelationshipState["rupture"]["repairArc"]
> = {
  misunderstanding: "clarification",
  emotional_neglect: "presence",
  betrayal: "trust_rebuild",
  abandonment: "presence",
  humiliation: "emotional_safety",
  broken_promise: "accountability",
  emotional_invalidation: "emotional_safety",
  boundary_violation: "boundary",
  conflict_spiral: "mutual_responsibility",
};
