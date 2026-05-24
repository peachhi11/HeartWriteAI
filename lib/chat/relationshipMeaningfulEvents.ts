import { z } from "zod";

const score = z.coerce.number().min(0).max(100);

export const EmotionalRoleSchema = z.enum([
  "comfort_person",
  "protector",
  "trusted_confidant",
  "romantic_priority",
  "sexual_tension_source",
  "safe_person",
  "challenge_rival",
  "caretaker",
]);

export const WitnessContextSchema = z.enum([
  "seen_directly",
  "heard_about",
  "suspected",
  "imagined",
  "hidden",
]);

export const AttentionEventTypeSchema = z.enum([
  "chosen",
  "ignored",
  "noticed_first",
  "private_time",
  "public_praise",
]);

export const ComparisonTraitSchema = z.enum([
  "funnier",
  "safer",
  "more_attractive",
  "understands_better",
  "more_stable",
]);

export const InitiativeTypeSchema = z.enum([
  "texts_first",
  "apologizes_first",
  "initiates_touch",
  "escalates_intimacy",
  "avoids_defining",
]);

export const PatternLoopSchema = z.enum([
  "pursue_withdraw",
  "tease_fluster_retreat",
  "jealousy_reassurance",
  "conflict_silence_apology",
]);

export const RoleOwnershipSchema = z
  .object({
    comfortPerson: z.string().trim().min(1).optional(),
    protector: z.string().trim().min(1).optional(),
    trustedConfidant: z.string().trim().min(1).optional(),
    romanticPriority: z.string().trim().min(1).optional(),
    sexualTensionSource: z.string().trim().min(1).optional(),
    safePerson: z.string().trim().min(1).optional(),
    challengeRival: z.string().trim().min(1).optional(),
    caretaker: z.string().trim().min(1).optional(),
  })
  .default({});

export const AttentionEconomySchema = z
  .object({
    lastChosenId: z.string().trim().min(1).optional(),
    lastIgnoredId: z.string().trim().min(1).optional(),
    noticedFirstId: z.string().trim().min(1).optional(),
    privateTimeWithId: z.string().trim().min(1).optional(),
    publicPraiseForId: z.string().trim().min(1).optional(),
    userAttentionScore: score.default(0),
    rivalAttentionScore: score.default(0),
  })
  .default({
    userAttentionScore: 0,
    rivalAttentionScore: 0,
  });

export const ComparisonSystemSchema = z
  .object({
    rivalId: z.string().trim().min(1).optional(),
    rivalAdvantages: z.array(ComparisonTraitSchema).default([]),
    userInadequacy: score.default(0),
    rivalIdealization: score.default(0),
  })
  .default({
    rivalAdvantages: [],
    userInadequacy: 0,
    rivalIdealization: 0,
  });

export const EmotionalRankSchema = z
  .object({
    perceivedPriority: z
      .enum(["first", "backup", "hidden", "replaceable", "publicly_chosen"])
      .default("backup"),
    publiclyChosen: z.boolean().default(false),
    hidden: z.boolean().default(false),
    replaceabilityFear: score.default(0),
  })
  .default({
    perceivedPriority: "backup",
    publiclyChosen: false,
    hidden: false,
    replaceabilityFear: 0,
  });

export const PublicPrivateTreatmentSchema = z
  .object({
    privateAffection: score.default(0),
    publicAffection: score.default(0),
    publicDistance: score.default(0),
    privateNeglect: score.default(0),
    publicTeasing: score.default(0),
    insecurityPressure: score.default(0),
    confusionPressure: score.default(0),
    layeredIntimacy: score.default(0),
  })
  .default({
    privateAffection: 0,
    publicAffection: 0,
    publicDistance: 0,
    privateNeglect: 0,
    publicTeasing: 0,
    insecurityPressure: 0,
    confusionPressure: 0,
    layeredIntimacy: 0,
  });

export const WitnessedEventSchema = z.object({
  id: z.string().trim().min(1),
  actorId: z.string().trim().min(1),
  targetId: z.string().trim().min(1),
  witness: WitnessContextSchema,
  emotionalImpact: score.default(0),
  summary: z.string().trim().min(1),
});

export const SecrecyDisclosureSchema = z
  .object({
    hiddenCrush: z.boolean().default(false),
    secretKiss: z.boolean().default(false),
    concealedJealousy: z.boolean().default(false),
    unspokenPromise: z.boolean().default(false),
    privateBetrayal: z.boolean().default(false),
    knownBy: z.array(z.string().trim().min(1)).default([]),
    secrecyPressure: score.default(0),
  })
  .default({
    hiddenCrush: false,
    secretKiss: false,
    concealedJealousy: false,
    unspokenPromise: false,
    privateBetrayal: false,
    knownBy: [],
    secrecyPressure: 0,
  });

export const RivalryScoreSchema = z
  .object({
    rivalId: z.string().trim().min(1).optional(),
    rivalThreat: score.default(0),
    romanticThreat: score.default(0),
    sexualThreat: score.default(0),
    emotionalThreat: score.default(0),
    socialThreat: score.default(0),
    humiliationThreat: score.default(0),
  })
  .default({
    rivalThreat: 0,
    romanticThreat: 0,
    sexualThreat: 0,
    emotionalThreat: 0,
    socialThreat: 0,
    humiliationThreat: 0,
  });

export const EmotionalDebtSchema = z
  .object({
    owedApology: score.default(0),
    owedExplanation: score.default(0),
    owedReassurance: score.default(0),
    owedRepair: score.default(0),
    owedHonesty: score.default(0),
  })
  .default({
    owedApology: 0,
    owedExplanation: 0,
    owedReassurance: 0,
    owedRepair: 0,
    owedHonesty: 0,
  });

export const OpportunityLossSchema = z.object({
  id: z.string().trim().min(1),
  type: z.enum([
    "rival_comforted_first",
    "rival_confessed_first",
    "user_hesitated_too_long",
    "npc_chosen_during_crisis",
  ]),
  summary: z.string().trim().min(1),
  severity: score.default(0),
});

export const RelationshipReputationSchema = z
  .object({
    label: z
      .enum([
        "private",
        "secret",
        "obvious",
        "unstable",
        "power_couple",
        "messy",
        "unrequited",
        "publicly_claimed",
      ])
      .default("private"),
    publicCertainty: score.default(0),
    socialRisk: score.default(0),
  })
  .default({
    label: "private",
    publicCertainty: 0,
    socialRisk: 0,
  });

export const TrustAsymmetrySchema = z
  .object({
    aTrustsB: score.default(30),
    bTrustsA: score.default(30),
  })
  .default({
    aTrustsB: 30,
    bTrustsA: 30,
  });

export const DesireAsymmetrySchema = z
  .object({
    aDesiresB: score.default(0),
    bDesiresA: score.default(0),
  })
  .default({
    aDesiresB: 0,
    bDesiresA: 0,
  });

export const InitiativeTrackingSchema = z
  .record(z.string(), z.record(InitiativeTypeSchema, score.default(0)))
  .default({});

export const EmotionalPatternDetectionSchema = z
  .record(PatternLoopSchema, score.default(0))
  .default({
    pursue_withdraw: 0,
    tease_fluster_retreat: 0,
    jealousy_reassurance: 0,
    conflict_silence_apology: 0,
  });

export const MeaningfulEventRecordSchema = z.object({
  id: z.string().trim().min(1),
  action: z.string().trim().min(1),
  emotionalRole: EmotionalRoleSchema.optional(),
  witness: WitnessContextSchema,
  consequence: z.string().trim().min(1),
  impact: score.default(0),
});

export const RelationshipMeaningSystemsSchema = z
  .object({
    roleOwnership: RoleOwnershipSchema,
    attention: AttentionEconomySchema,
    comparison: ComparisonSystemSchema,
    emotionalRank: EmotionalRankSchema,
    treatment: PublicPrivateTreatmentSchema,
    witnessedEvents: z.array(WitnessedEventSchema).default([]),
    secrecy: SecrecyDisclosureSchema,
    rivalry: RivalryScoreSchema,
    emotionalDebt: EmotionalDebtSchema,
    opportunityLosses: z.array(OpportunityLossSchema).default([]),
    reputation: RelationshipReputationSchema,
    trustAsymmetry: TrustAsymmetrySchema,
    desireAsymmetry: DesireAsymmetrySchema,
    initiative: InitiativeTrackingSchema,
    patterns: EmotionalPatternDetectionSchema,
    meaningfulEvents: z.array(MeaningfulEventRecordSchema).default([]),
  })
  .default({
    roleOwnership: {},
    attention: {
      userAttentionScore: 0,
      rivalAttentionScore: 0,
    },
    comparison: {
      rivalAdvantages: [],
      userInadequacy: 0,
      rivalIdealization: 0,
    },
    emotionalRank: {
      perceivedPriority: "backup",
      publiclyChosen: false,
      hidden: false,
      replaceabilityFear: 0,
    },
    treatment: {
      privateAffection: 0,
      publicAffection: 0,
      publicDistance: 0,
      privateNeglect: 0,
      publicTeasing: 0,
      insecurityPressure: 0,
      confusionPressure: 0,
      layeredIntimacy: 0,
    },
    witnessedEvents: [],
    secrecy: {
      hiddenCrush: false,
      secretKiss: false,
      concealedJealousy: false,
      unspokenPromise: false,
      privateBetrayal: false,
      knownBy: [],
      secrecyPressure: 0,
    },
    rivalry: {
      rivalThreat: 0,
      romanticThreat: 0,
      sexualThreat: 0,
      emotionalThreat: 0,
      socialThreat: 0,
      humiliationThreat: 0,
    },
    emotionalDebt: {
      owedApology: 0,
      owedExplanation: 0,
      owedReassurance: 0,
      owedRepair: 0,
      owedHonesty: 0,
    },
    opportunityLosses: [],
    reputation: {
      label: "private",
      publicCertainty: 0,
      socialRisk: 0,
    },
    trustAsymmetry: {
      aTrustsB: 30,
      bTrustsA: 30,
    },
    desireAsymmetry: {
      aDesiresB: 0,
      bDesiresA: 0,
    },
    initiative: {},
    patterns: {
      pursue_withdraw: 0,
      tease_fluster_retreat: 0,
      jealousy_reassurance: 0,
      conflict_silence_apology: 0,
    },
    meaningfulEvents: [],
  });

export type EmotionalRole = z.infer<typeof EmotionalRoleSchema>;
export type WitnessContext = z.infer<typeof WitnessContextSchema>;
export type RelationshipMeaningSystems = z.infer<
  typeof RelationshipMeaningSystemsSchema
>;

export type MeaningfulRelationshipEventInput = {
  id: string;
  action: string;
  actorId: string;
  targetId: string;
  observerIds?: string[];
  userId: string;
  charId: string;
  rivalId?: string;
  emotionalRole?: EmotionalRole;
  witness: WitnessContext;
  attention?: z.infer<typeof AttentionEventTypeSchema>;
  comparison?: z.infer<typeof ComparisonTraitSchema>;
  initiative?: z.infer<typeof InitiativeTypeSchema>;
  pattern?: z.infer<typeof PatternLoopSchema>;
  publicTreatment?: "private_affection" | "public_distance" | "public_claim" | "private_neglect" | "public_teasing";
  secrecy?: keyof z.infer<typeof SecrecyDisclosureSchema>;
  opportunityLoss?: z.infer<typeof OpportunityLossSchema>["type"];
  consequence: string;
  impact: number;
  romanticThreat?: number;
  sexualThreat?: number;
  emotionalThreat?: number;
  socialThreat?: number;
  humiliationThreat?: number;
};

export function applyMeaningfulRelationshipEvent(
  current: RelationshipMeaningSystems,
  input: MeaningfulRelationshipEventInput,
) {
  const systems = RelationshipMeaningSystemsSchema.parse(
    structuredClone(current),
  );
  const impact = clamp(input.impact);
  const witnessMultiplier = witnessImpactMultiplier(input.witness);

  if (input.emotionalRole) {
    assignRoleOwner(systems, input.emotionalRole, input.actorId);
  }

  if (input.attention) {
    applyAttention(systems, input, impact);
  }

  if (input.comparison && input.rivalId) {
    systems.comparison.rivalId = input.rivalId;
    systems.comparison.rivalAdvantages = unique([
      ...systems.comparison.rivalAdvantages,
      input.comparison,
    ]);
    systems.comparison.userInadequacy = clamp(
      systems.comparison.userInadequacy + impact * 0.35,
    );
    systems.comparison.rivalIdealization = clamp(
      systems.comparison.rivalIdealization + impact * 0.25,
    );
  }

  applyRank(systems, input, impact);
  applyTreatment(systems, input, impact);
  applyWitnessedEvent(systems, input, impact, witnessMultiplier);
  applySecrecy(systems, input, impact);
  applyRivalry(systems, input, impact);
  applyEmotionalDebt(systems, input, impact);
  applyOpportunityLoss(systems, input, impact);
  applyReputation(systems, input, impact);
  applyAsymmetry(systems, input, impact);
  applyInitiative(systems, input, impact);
  applyPattern(systems, input, impact);

  systems.meaningfulEvents = [
    {
      id: input.id,
      action: input.action,
      emotionalRole: input.emotionalRole,
      witness: input.witness,
      consequence: input.consequence,
      impact,
    },
    ...systems.meaningfulEvents,
  ].slice(0, 60);

  return RelationshipMeaningSystemsSchema.parse(systems);
}

export function witnessImpactMultiplier(witness: WitnessContext) {
  switch (witness) {
    case "seen_directly":
      return 1;
    case "heard_about":
      return 0.75;
    case "suspected":
      return 0.55;
    case "imagined":
      return 0.4;
    case "hidden":
      return 0.2;
  }
}

function assignRoleOwner(
  systems: RelationshipMeaningSystems,
  role: EmotionalRole,
  ownerId: string,
) {
  const keyByRole: Record<EmotionalRole, keyof RelationshipMeaningSystems["roleOwnership"]> = {
    comfort_person: "comfortPerson",
    protector: "protector",
    trusted_confidant: "trustedConfidant",
    romantic_priority: "romanticPriority",
    sexual_tension_source: "sexualTensionSource",
    safe_person: "safePerson",
    challenge_rival: "challengeRival",
    caretaker: "caretaker",
  };

  systems.roleOwnership[keyByRole[role]] = ownerId;
}

function applyAttention(
  systems: RelationshipMeaningSystems,
  input: MeaningfulRelationshipEventInput,
  impact: number,
) {
  const actorIsUser = input.actorId === input.userId;
  const actorIsRival = input.actorId === input.rivalId;

  if (input.attention === "chosen") systems.attention.lastChosenId = input.actorId;
  if (input.attention === "ignored") systems.attention.lastIgnoredId = input.targetId;
  if (input.attention === "noticed_first") systems.attention.noticedFirstId = input.actorId;
  if (input.attention === "private_time") systems.attention.privateTimeWithId = input.actorId;
  if (input.attention === "public_praise") systems.attention.publicPraiseForId = input.actorId;

  if (actorIsUser) {
    systems.attention.userAttentionScore = clamp(
      systems.attention.userAttentionScore + impact,
    );
  }

  if (actorIsRival) {
    systems.attention.rivalAttentionScore = clamp(
      systems.attention.rivalAttentionScore + impact,
    );
  }
}

function applyRank(
  systems: RelationshipMeaningSystems,
  input: MeaningfulRelationshipEventInput,
  impact: number,
) {
  if (input.attention === "chosen" && input.actorId === input.userId) {
    systems.emotionalRank.perceivedPriority = "publicly_chosen";
    systems.emotionalRank.publiclyChosen = true;
    systems.emotionalRank.hidden = false;
    return;
  }

  if (input.rivalId && input.actorId === input.rivalId) {
    systems.emotionalRank.perceivedPriority = "replaceable";
    systems.emotionalRank.replaceabilityFear = clamp(
      systems.emotionalRank.replaceabilityFear + impact * 0.45,
    );
  }

  if (input.witness === "hidden") {
    systems.emotionalRank.hidden = true;
    systems.emotionalRank.perceivedPriority = "hidden";
  }
}

function applyTreatment(
  systems: RelationshipMeaningSystems,
  input: MeaningfulRelationshipEventInput,
  impact: number,
) {
  switch (input.publicTreatment) {
    case "private_affection":
      systems.treatment.privateAffection = clamp(
        systems.treatment.privateAffection + impact,
      );
      break;
    case "public_distance":
      systems.treatment.publicDistance = clamp(
        systems.treatment.publicDistance + impact,
      );
      break;
    case "public_claim":
      systems.treatment.publicAffection = clamp(
        systems.treatment.publicAffection + impact,
      );
      break;
    case "private_neglect":
      systems.treatment.privateNeglect = clamp(
        systems.treatment.privateNeglect + impact,
      );
      break;
    case "public_teasing":
      systems.treatment.publicTeasing = clamp(
        systems.treatment.publicTeasing + impact,
      );
      break;
  }

  systems.treatment.insecurityPressure = clamp(
    Math.max(
      systems.treatment.insecurityPressure,
      systems.treatment.privateAffection * 0.45 +
        systems.treatment.publicDistance * 0.55,
    ),
  );
  systems.treatment.confusionPressure = clamp(
    Math.max(
      systems.treatment.confusionPressure,
      systems.treatment.publicAffection * 0.45 +
        systems.treatment.privateNeglect * 0.55,
    ),
  );
  systems.treatment.layeredIntimacy = clamp(
    Math.max(
      systems.treatment.layeredIntimacy,
      systems.treatment.privateAffection * 0.55 +
        systems.treatment.publicTeasing * 0.45,
    ),
  );
}

function applyWitnessedEvent(
  systems: RelationshipMeaningSystems,
  input: MeaningfulRelationshipEventInput,
  impact: number,
  multiplier: number,
) {
  systems.witnessedEvents = [
    {
      id: input.id,
      actorId: input.actorId,
      targetId: input.targetId,
      witness: input.witness,
      emotionalImpact: clamp(impact * multiplier),
      summary: input.action,
    },
    ...systems.witnessedEvents,
  ].slice(0, 40);
}

function applySecrecy(
  systems: RelationshipMeaningSystems,
  input: MeaningfulRelationshipEventInput,
  impact: number,
) {
  if (input.secrecy && input.secrecy !== "knownBy") {
    const key = input.secrecy;

    if (typeof systems.secrecy[key] === "boolean") {
      systems.secrecy[key] = true as never;
    }
  }

  if (input.witness === "hidden") {
    systems.secrecy.secrecyPressure = clamp(
      systems.secrecy.secrecyPressure + impact,
    );
  }

  systems.secrecy.knownBy = unique([
    ...systems.secrecy.knownBy,
    ...(input.observerIds ?? []),
  ]);
}

function applyRivalry(
  systems: RelationshipMeaningSystems,
  input: MeaningfulRelationshipEventInput,
  impact: number,
) {
  if (!input.rivalId) return;

  systems.rivalry.rivalId = input.rivalId;
  systems.rivalry.romanticThreat = clamp(
    systems.rivalry.romanticThreat + (input.romanticThreat ?? 0),
  );
  systems.rivalry.sexualThreat = clamp(
    systems.rivalry.sexualThreat + (input.sexualThreat ?? 0),
  );
  systems.rivalry.emotionalThreat = clamp(
    systems.rivalry.emotionalThreat + (input.emotionalThreat ?? 0),
  );
  systems.rivalry.socialThreat = clamp(
    systems.rivalry.socialThreat + (input.socialThreat ?? 0),
  );
  systems.rivalry.humiliationThreat = clamp(
    systems.rivalry.humiliationThreat + (input.humiliationThreat ?? 0),
  );
  systems.rivalry.rivalThreat = clamp(
    systems.rivalry.rivalThreat +
      Math.max(
        impact * 0.35,
        input.romanticThreat ?? 0,
        input.sexualThreat ?? 0,
        input.emotionalThreat ?? 0,
        input.socialThreat ?? 0,
        input.humiliationThreat ?? 0,
      ),
  );
}

function applyEmotionalDebt(
  systems: RelationshipMeaningSystems,
  input: MeaningfulRelationshipEventInput,
  impact: number,
) {
  if (input.action.includes("apology")) {
    systems.emotionalDebt.owedApology = clamp(
      systems.emotionalDebt.owedApology + impact,
    );
  }
  if (input.action.includes("explanation")) {
    systems.emotionalDebt.owedExplanation = clamp(
      systems.emotionalDebt.owedExplanation + impact,
    );
  }
  if (input.action.includes("reassurance") || input.rivalId) {
    systems.emotionalDebt.owedReassurance = clamp(
      systems.emotionalDebt.owedReassurance + impact * 0.5,
    );
  }
  if (input.action.includes("repair")) {
    systems.emotionalDebt.owedRepair = clamp(
      systems.emotionalDebt.owedRepair + impact,
    );
  }
  if (input.secrecy) {
    systems.emotionalDebt.owedHonesty = clamp(
      systems.emotionalDebt.owedHonesty + impact * 0.5,
    );
  }
}

function applyOpportunityLoss(
  systems: RelationshipMeaningSystems,
  input: MeaningfulRelationshipEventInput,
  impact: number,
) {
  if (!input.opportunityLoss) return;

  systems.opportunityLosses = [
    {
      id: input.id,
      type: input.opportunityLoss,
      summary: input.action,
      severity: impact,
    },
    ...systems.opportunityLosses,
  ].slice(0, 40);
}

function applyReputation(
  systems: RelationshipMeaningSystems,
  input: MeaningfulRelationshipEventInput,
  impact: number,
) {
  if (input.publicTreatment === "public_claim") {
    systems.reputation.label = "publicly_claimed";
    systems.reputation.publicCertainty = clamp(
      systems.reputation.publicCertainty + impact,
    );
    return;
  }

  if (input.witness === "hidden" || input.secrecy) {
    systems.reputation.label = "secret";
    systems.reputation.socialRisk = clamp(systems.reputation.socialRisk + impact);
  }

  if (input.rivalId && input.humiliationThreat && input.humiliationThreat > 50) {
    systems.reputation.label = "messy";
    systems.reputation.socialRisk = clamp(
      systems.reputation.socialRisk + input.humiliationThreat,
    );
  }
}

function applyAsymmetry(
  systems: RelationshipMeaningSystems,
  input: MeaningfulRelationshipEventInput,
  impact: number,
) {
  if (input.actorId === input.userId) {
    systems.desireAsymmetry.aDesiresB = clamp(
      systems.desireAsymmetry.aDesiresB + impact * 0.35,
    );
    systems.trustAsymmetry.aTrustsB = clamp(
      systems.trustAsymmetry.aTrustsB + impact * 0.15,
    );
  }

  if (input.actorId === input.charId) {
    systems.desireAsymmetry.bDesiresA = clamp(
      systems.desireAsymmetry.bDesiresA + impact * 0.35,
    );
    systems.trustAsymmetry.bTrustsA = clamp(
      systems.trustAsymmetry.bTrustsA + impact * 0.15,
    );
  }

  if (input.rivalId && input.actorId === input.rivalId) {
    systems.trustAsymmetry.aTrustsB = clamp(
      systems.trustAsymmetry.aTrustsB - impact * 0.2,
    );
  }
}

function applyInitiative(
  systems: RelationshipMeaningSystems,
  input: MeaningfulRelationshipEventInput,
  impact: number,
) {
  if (!input.initiative) return;

  systems.initiative[input.actorId] ??= {
    texts_first: 0,
    apologizes_first: 0,
    initiates_touch: 0,
    escalates_intimacy: 0,
    avoids_defining: 0,
  };
  systems.initiative[input.actorId][input.initiative] = clamp(
    systems.initiative[input.actorId][input.initiative] + impact,
  );
}

function applyPattern(
  systems: RelationshipMeaningSystems,
  input: MeaningfulRelationshipEventInput,
  impact: number,
) {
  if (!input.pattern) return;

  systems.patterns[input.pattern] = clamp(
    (systems.patterns[input.pattern] ?? 0) + impact,
  );
}

function unique<Value extends string>(values: Value[]) {
  return Array.from(new Set(values));
}

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}
