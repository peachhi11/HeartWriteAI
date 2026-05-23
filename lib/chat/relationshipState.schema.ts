import { z } from "zod";

const score = z.coerce.number().min(0).max(100);
const signedScore = z.coerce.number().min(-100).max(100);

function defaultObject<T extends z.ZodType>(schema: T) {
  return z.preprocess((value) => value ?? {}, schema);
}

export const RelationshipTypeSchema = z.enum([
  "strangers_to_lovers",
  "friends_to_lovers",
  "enemies_to_lovers",
  "rivals_to_lovers",
  "forbidden_romance",
  "age_gap",
  "second_chance",
  "arranged_relationship",
  "fake_dating",
  "mentor_student",
  "workplace_romance",
  "polyamory",
  "ethical_non_monogamy",
  "open_relationship",
  "swinging",
]);

export const LifecycleStateSchema = z.enum([
  "potential",
  "attraction",
  "tension",
  "pursuit",
  "denial",
  "attachment_formation",
  "vulnerability",
  "instability",
  "obsession",
  "devotional",
  "domestic_integration",
  "stable_partnership",
  "plateau",
  "drift",
  "fracture",
  "repair",
  "reconnection",
  "transformation",
  "dissolution",
  "post_attachment",
]);

export const AttachmentStyleSchema = z.enum([
  "secure",
  "anxious",
  "avoidant",
  "fearful_avoidant",
]);

export const RepairArcSchema = z.enum([
  "none",
  "clarification",
  "apology",
  "reassurance",
  "accountability",
  "trust_rebuild",
  "emotional_safety",
  "presence",
  "boundary",
  "mutual_responsibility",
  "redemption",
  "reconciliation",
  "non_repair",
]);

export const RuptureTypeSchema = z.enum([
  "misunderstanding",
  "emotional_neglect",
  "betrayal",
  "abandonment",
  "humiliation",
  "broken_promise",
  "emotional_invalidation",
  "boundary_violation",
  "conflict_spiral",
]);

export const EventMemorySchema = z.object({
  id: z.string().trim().min(1),
  type: z.enum([
    "first_kiss",
    "confession",
    "apology",
    "betrayal",
    "breakup",
    "promise",
    "traumatic_confession",
    "comfort",
    "jealousy",
    "reassurance",
    "repair",
    "custom",
  ]),
  summary: z.string().trim().min(1),
  emotionalWeight: score,
  trustImpact: signedScore.default(0),
  intimacyImpact: signedScore.default(0),
  timestamp: z.number(),
  tags: z.array(z.string().trim().min(1)).default([]),
});

export const KinkTagSchema = z.enum([
  "praise",
  "worship",
  "attention_focus",
  "devotion",
  "adoration",
  "obsession_neediness",
  "possessiveness",
  "jealousy_play",
  "pet_names",
  "being_watched",
  "validation_seeking",
  "begging_dynamics",
  "power_exchange",
  "dominance",
  "submission",
  "service",
  "obedience",
  "bratting",
  "discipline",
  "command_control",
  "ownership_language",
  "soft_dominance",
  "gentle_femdom",
  "caregiver_little",
  "protector_dynamics",
  "authority_figure",
  "teasing",
  "denial",
  "slow_seduction",
  "edge_play_nondangerous",
  "chase_pursuit",
  "consensual_resistance_play",
  "push_pull",
  "forbidden_attraction",
  "almost_touching",
  "emotional_restraint",
  "flirt_fighting",
  "emotional_exposure",
  "comfort_aftercare",
  "crying_comfort",
  "confession_dynamics",
  "dependency_themes",
  "needing_reassurance",
  "safe_surrender",
  "emotional_caretaking",
  "stay_with_me",
  "emotional_softening",
  "soulmate_fantasy",
  "exclusive_attention",
  "romantic_possession",
  "loyalty_dynamics",
  "sacrifice_worship",
  "emotional_monopolization",
  "eternal_commitment",
  "rescue_fantasy",
  "healing_dynamics",
  "reunion_return",
  "mind_games",
  "consensual_manipulation_fantasy",
  "corruption_fantasy",
  "temptation_dynamics",
  "emotional_power_imbalance",
  "rivalry_attraction",
  "intimidation_attraction",
  "fear_tension",
  "touch_sensitivity",
  "sensory_deprivation",
  "restraint",
  "temperature_play",
  "sensual_touch",
  "hair_pulling",
  "biting",
  "marking",
  "clothing_uniform_attraction",
  "scent_attraction",
  "consensual_humiliation",
  "consensual_degradation",
  "territoriality",
  "mine_yours_language",
  "protective_jealousy",
  "exclusivity_rituals",
  "public_claiming",
  "emotional_dependency",
  "obsessive_attention",
]);

export const FetishCategorySchema = z.enum([
  "body_part",
  "clothing_material",
  "sensory",
  "psychological_situational",
  "power_control",
  "emotional_attachment",
  "relationship_dynamic",
  "fantasy_archetype",
]);

const optionalTagList = z.array(z.string().trim().min(1)).default([]);

export const RelationshipStateSchema = z
  .object({
    schemaVersion: z.literal(1).default(1),
    id: z.string().trim().min(1),
    scenarioId: z.string().trim().min(1).optional(),

    characters: z.object({
      aId: z.string().trim().min(1),
      bId: z.string().trim().min(1),
    }),

    type: RelationshipTypeSchema.default("strangers_to_lovers"),
    lifecycleState: LifecycleStateSchema.default("potential"),

    phase: defaultObject(
      z.object({
        macro: z.string().default("pre_romance"),
        stage: z.number().int().min(0).max(100).default(0),
        softGate: z.number().int().min(0).max(100).default(0),
      }),
    ),

    attachment: defaultObject(
      z.object({
        aStyle: AttachmentStyleSchema.default("secure"),
        bStyle: AttachmentStyleSchema.default("secure"),
        bondDepth: score.default(0),
        dependency: score.default(0),
        abandonmentSensitivity: score.default(0),
        engulfmentSensitivity: score.default(0),
      }),
    ),

    trust: defaultObject(
      z.object({
        emotional: score.default(30),
        vulnerability: score.default(20),
        reliability: score.default(30),
        conflict: score.default(20),
        loyalty: score.default(30),
        autonomy: score.default(50),
        sexual: score.default(30),
      }),
    ),

    intimacy: defaultObject(
      z.object({
        emotional: score.default(0),
        physical: score.default(0),
        sexual: score.default(0),
        domestic: score.default(0),
        vulnerability: score.default(0),
      }),
    ),

    chemistry: defaultObject(
      z.object({
        romantic: score.default(0),
        sexual: score.default(0),
        intellectual: score.default(0),
        tension: score.default(0),
        playful: score.default(0),
        devotional: score.default(0),
        obsessive: score.default(0),
      }),
    ),

    compatibility: defaultObject(
      z.object({
        emotional: score.default(50),
        communication: score.default(50),
        conflict: score.default(50),
        sexual: score.default(50),
        pacing: score.default(50),
        domestic: score.default(50),
        ambition: score.default(50),
        social: score.default(50),
        lifestyle: score.default(50),
        values: score.default(50),
      }),
    ),

    needs: defaultObject(
      z.object({
        reassurance: score.default(50),
        autonomy: score.default(50),
        admiration: score.default(50),
        emotionalSafety: score.default(50),
        excitement: score.default(50),
        stability: score.default(50),
        novelty: score.default(50),
        exclusivity: score.default(50),
      }),
    ),

    exclusivity: defaultObject(
      z.object({
        style: z
          .enum([
            "fully_monogamous",
            "emotionally_monogamous",
            "sexually_open",
            "polyamorous",
            "flexible_negotiated",
            "low_exclusivity",
            "territorial",
          ])
          .default("fully_monogamous"),
        emotionalNeed: score.default(60),
        sexualNeed: score.default(60),
        jealousyReactivity: score.default(30),
        possessiveness: score.default(20),
      }),
    ),

    desire: defaultObject(
      z.object({
        style: z
          .enum([
            "spontaneous",
            "responsive",
            "tension_driven",
            "security_based",
            "novelty_dependent",
            "devotional",
            "avoidant",
            "obsessive",
            "chaotic",
          ])
          .default("responsive"),
        libidoIntensity: score.default(50),
        noveltyDependence: score.default(40),
        securityDependence: score.default(50),
        stressSensitivity: score.default(50),
      }),
    ),

    wounds: defaultObject(
      z.object({
        abandonment: score.default(0),
        rejection: score.default(0),
        betrayal: score.default(0),
        emotionalNeglect: score.default(0),
        humiliation: score.default(0),
        inadequacy: score.default(0),
        engulfment: score.default(0),
        invalidation: score.default(0),
        control: score.default(0),
        replacement: score.default(0),
        dependency: score.default(0),
      }),
    ),

    rupture: defaultObject(
      z.object({
        active: z.boolean().default(false),
        type: RuptureTypeSchema.optional(),
        severity: z.number().int().min(0).max(5).default(0),
        trustDamage: score.default(0),
        vulnerabilityDamage: score.default(0),
        repairArc: RepairArcSchema.default("none"),
        repairProgress: score.default(0),
        accountabilityLevel: score.default(0),
        changedBehaviorEvidence: score.default(0),
      }),
    ),

    momentum: defaultObject(
      z.object({
        attachment: signedScore.default(0),
        trust: signedScore.default(0),
        conflict: signedScore.default(0),
        repair: signedScore.default(0),
        drift: signedScore.default(0),
        obsession: signedScore.default(0),
        stability: signedScore.default(0),
      }),
    ),

    eroticDynamics: defaultObject(
      z.object({
        adultOnlyWhenErotic: z.literal(true).default(true),
        kinkTags: z.array(KinkTagSchema).default([]),
        fetishCategory: FetishCategorySchema.optional(),
        fetishTags: optionalTagList,
        consentClarity: score.default(0),
        boundaryFit: score.default(0),
        aftercareNeed: score.default(0),
      }),
    ),

    memories: z.array(EventMemorySchema).default([]),

    flags: defaultObject(
      z.object({
        firstKiss: z.boolean().default(false),
        confessionOccurred: z.boolean().default(false),
        officialRelationship: z.boolean().default(false),
        breakupOccurred: z.boolean().default(false),
        betrayalOccurred: z.boolean().default(false),
        sexualIntimacyOccurred: z.boolean().default(false),
      }),
    ),

    tags: z.array(z.string().trim().min(1)).default([]),
  })
  .passthrough();

export type RelationshipState = z.infer<typeof RelationshipStateSchema>;

export function createDefaultRelationshipState(input: {
  id: string;
  aId: string;
  bId: string;
  scenarioId?: string;
  type?: z.infer<typeof RelationshipTypeSchema>;
}): RelationshipState {
  return RelationshipStateSchema.parse({
    id: input.id,
    scenarioId: input.scenarioId,
    characters: {
      aId: input.aId,
      bId: input.bId,
    },
    type: input.type ?? "strangers_to_lovers",
  });
}

export function normalizeRelationshipState(input: unknown): RelationshipState {
  return RelationshipStateSchema.parse(input);
}
