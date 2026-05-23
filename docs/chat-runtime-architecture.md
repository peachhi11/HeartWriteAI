# Chat Runtime Architecture

HeartWriteAI's chat runtime should be local-first, card-compatible, and deliberately paced. Character cards define portable identity, scenario, tags, lore, greetings, and author instructions. Ongoing relationship state, memory recall, provider settings, and route progression belong to saved chat/session state.

## Design Rules

- Keep static cards portable. Do not write hidden intimacy scores, provider settings, or session memory into CCV3/CHARX card data.
- Treat the local runtime as the authority for pacing. The model can suggest interpretation, but deterministic code decides whether relationship state changes.
- Keep engine internals hidden from users. Users should see story-engine tags, route milestones, memory status, and provider status, not emotion matrices or classifier payloads.
- Require explicit cloud opt-in. Never silently fall back from local Ollama to OpenAI or another paid/cloud provider.
- Store memories durably before adding vector complexity. SQLite session storage and FTS should come before embeddings.
- Treat memory as tiered. Recent transcript, semantic recall, and declarative facts solve different problems and should not be merged into one undifferentiated log.
- Let card-authored `system_prompt` and `post_history_instructions` steer behavior, but compile them alongside runtime safety, memory, lore, and relationship gates.

## Runtime Flow

```text
user message
-> normalize input
-> classify message track as in-character or out-of-character
-> retrieve declarative facts, semantic memories, and active lore
-> detect emotional signal and deterministic event triggers
-> update hidden emotional brain and relationship/session state
-> choose current mood and response intent
-> add recent working memory and time anchors
-> compile runtime prompt with current gates
-> selected provider generates response
-> validate/save assistant response
-> extract fact, memory, emotional event, and milestone candidates
-> persist session state
```

The model should not self-police romance pacing alone. The compiled prompt should tell the model the current route gate, and the local engine should advance that gate only when deterministic conditions are met.

## Runtime Responsibility Split

HeartWriteAI is the director, memory keeper, pacing controller, and boundary handler. The LLM is the actor, improviser, scene writer, and dialogue stylist.

Scripted by the app:

- continuity
- relationship phase
- progression permissions
- emotional triggers
- important memories
- pacing locks
- temporary moods
- unresolved beats
- boundaries and safety behavior

Emergent from the model:

- wording
- body language
- dialogue flow
- emotional nuance
- chemistry
- flirting style
- scene detail
- banter

Do not build VN-style dialogue trees, giant pre-authored romance routes, or exact emotional responses such as "if the user says I love you, say I love you too." The emotional brain should answer: "What emotional context should the model currently operate under?" It should not decide the exact thing the character says.

## Emotional Brain and Relationship State

The emotional brain is a small local state engine that sits between memory retrieval and prompt compilation. It should be app-owned state, not something the model invents turn by turn.

Romance progression should be event-driven rather than number-gated. A character should not fall in love because an affection score reached 80. They should soften, trust, confess, pull away, or escalate because meaningful events happened in the story: the user remembered a private detail, repaired harm, protected them in a vulnerable scene, stayed after conflict, or triggered a trope-appropriate confession beat.

Core rule:

```text
events decide meaning
numbers decide intensity, decay, sorting, and conflict pressure
```

The phase model should combine three signal types:

```text
soft stats = emotional weather
events = story evidence
keywords = player intent
phase = narrative interpretation
```

Do not advance a relationship because `trust = 80`. Advance it when emotional weather, story evidence, player intent, and route context agree. For example: high trust plus a confession event plus "I want more than friendship" can mean a phase shift; high trust alone should not.

Split the emotional brain into five layers:

1. Personality: stable traits from the card and user edits. Rarely changes.
2. Attachment style: how the character reacts to closeness, distance, rejection, reassurance, and repair.
3. Relationship state: event flags, unresolved beats, and hidden soft counters.
4. Current mood: temporary emotional reaction to the latest scene trigger.
5. Narrative arc: long-term romance phase and unlocked relationship beats.

Arcs and scenarios shape the narrative container, not the user's script. They should provide modular beats, pacing hints, available scene routes, and continuity constraints while still letting the user decide where the roleplay goes inside that shape. A user should be able to follow the current beat, skip ahead, branch sideways, revisit an unresolved beat, or jump to another scenario module when needed.

A first implementation can use plain phases such as:

- initial_dynamic
- friction_or_spark
- repeated_contact
- vulnerability_leak
- reframing
- emotional_investment
- crisis_or_choice
- confession_or_escalation
- integration

These names can change later, but the behavior should stay the same: story-engine tags choose the pacing profile, and the runtime tracks which events, moods, and response directives are currently allowed.

The hidden state can include:

- active story engine tag, such as `angsty`, `slow burn`, `hurt/comfort`, or `dark romance`
- current relationship phase
- unlocked milestones
- event flags such as `first_compliment_received`, `boundary_crossed`, `trust_broken`, `repair_started`, or `first_kiss_happened`
- unresolved beats such as "character is guarded until the user apologizes"
- soft intensity counters for trust, tension, vulnerability, conflict, affection, jealousy, fear, and desire
- current mood or vibe, such as playful, anxious, guarded, or deeply affectionate
- active flirting expression, such as subtle, teasing, sincere, protective, or antagonistic
- inside jokes and shared symbolic references
- recent trigger evidence
- active boundaries
- current scene tone

The user-facing UI should show only friendly status, such as:

- Story Engine: Angst
- Relationship: Building trust
- Milestone: First honest conversation unlocked
- Memory: On
- Current beat: Unresolved apology
- Available next beats: repair, distance, confession, scene change

An internal TypeScript shape can look like:

```ts
type EmotionalBrain = {
  phase:
    | "initial_dynamic"
    | "friction_or_spark"
    | "repeated_contact"
    | "vulnerability_leak"
    | "reframing"
    | "emotional_investment"
    | "crisis_or_choice"
    | "confession_or_escalation"
    | "integration";
  flags: Record<string, boolean>;
  activeTriggers: EmotionalTrigger[];
  recentEvents: EmotionalEvent[];
  unresolvedBeats: string[];
  currentMood: {
    valence: -1 | 0 | 1;
    arousal: 0 | 1 | 2;
    label: string;
    cause?: string;
  };
  emotionalTone: {
    primary:
      | "tender"
      | "yearning"
      | "playful"
      | "tense"
      | "devotional"
      | "fragile"
      | "chaotic"
      | "comforting"
      | "obsessive"
      | "bittersweet"
      | "reverent"
      | "predatory"
      | "melancholic"
      | "hopeful"
      | "domestic_intimacy";
    secondary?: string[];
    intensity: 0 | 1 | 2;
  };
  pacingProfile: {
    mode:
      | "fast_burn"
      | "slow_burn"
      | "push_pull"
      | "stable_gentle"
      | "chaotic"
      | "episodic"
      | "continuous";
    emotionalAccess: "restricted" | "gradual" | "open";
    milestoneSpacing: "tight" | "moderate" | "wide";
    recoveryTime: "short" | "moderate" | "long";
  };
  flirting: {
    attractionExpression:
      | "playful"
      | "teasing"
      | "sincere"
      | "bold"
      | "subtle"
      | "intellectual"
      | "protective"
      | "awkward"
      | "dominant"
      | "submissive"
      | "domestic"
      | "antagonistic"
      | "devotional"
      | "chaotic"
      | "silent_nonverbal";
    reciprocityRequired: boolean;
    consentResponsive: boolean;
  };
  attachment: {
    style: "secure" | "anxious" | "avoidant" | "fearful";
    abandonmentSensitivity: number;
    vulnerabilityResistance: number;
    reassuranceNeed: number;
    autonomyNeed: number;
    emotionalReactivity: number;
    conflictRecovery: number;
    trustSpeed: number;
    dependencyTendency: number;
    intimacyTolerance: number;
    vulnerabilityPace: "gradual" | "fast" | "delayed" | "erratic";
    conflictPattern: "repair_oriented" | "panic_escalation" | "withdrawal" | "push_pull";
    jealousyExpression: "communicated" | "hyperreactive" | "suppressed" | "conflicted";
    securityTrajectory: "stable" | "softening" | "destabilizing" | "repairing";
  };
  emotionalRegulationStyle: {
    primary?:
      | "self_regulating"
      | "co_regulating"
      | "suppression_based"
      | "intellectualization"
      | "expressive"
      | "withdrawal"
      | "reassurance_seeking"
      | "humor_teasing"
      | "chaotic"
      | "caretaking"
      | "avoidance_based"
      | "physical";
    selfRegulationCapacity: number;
    coRegulationNeed: number;
    emotionalFloodingThreshold: number;
    withdrawalTendency: number;
    suppressionLevel: number;
    reassuranceDependence: number;
    conflictRecoverySpeed: number;
    emotionalRecoveryStyle: string;
    vulnerabilityRegulation: number;
    intellectualizationTendency: number;
    expressiveProcessing: number;
    humorDeflection: number;
    caretakingDeflection: number;
    physicalGroundingNeed: number;
    avoidanceLevel: number;
    coRegulationSafety: number;
    regulationMismatchRisk: number;
  };
  emotionalAvailability: {
    style:
      | "highly_available"
      | "situationally_available"
      | "guardedly_available"
      | "inconsistently_available"
      | "functionally_unavailable";
    vulnerabilityCapacity: number;
    attachmentCapacity: number;
    emotionalPresenceCapacity: number;
    conflictEnduranceCapacity: number;
    emotionalResponsivenessCapacity: number;
    intimacySustainabilityCapacity: number;
    attachmentTolerance: number;
    withdrawalTendency: number;
    fearActivationThreshold: number;
    availabilityConsistency: number;
    stabilityPhaseAvailability: number;
    crisisPhaseAvailability: number;
    accountabilityAvailability: number;
    performativeAvailabilityRisk: number;
    intensityOnlyAvailabilityRisk: number;
    emotionalWithdrawalLoopRisk: number;
  };
  coreWounds: {
    dominant?:
      | "abandonment"
      | "rejection"
      | "betrayal"
      | "emotional_neglect"
      | "humiliation"
      | "inadequacy"
      | "engulfment"
      | "emotional_invalidation"
      | "conditional_love"
      | "control"
      | "replacement"
      | "emotional_burden"
      | "visibility"
      | "dependency"
      | "worthlessness";
    abandonmentWoundSeverity: number;
    rejectionWoundSeverity: number;
    betrayalWoundSeverity: number;
    emotionalNeglectWoundSeverity: number;
    humiliationWoundSeverity: number;
    inadequacyWoundSeverity: number;
    engulfmentWoundSeverity: number;
    invalidationWoundSeverity: number;
    conditionalLoveWoundSeverity: number;
    controlWoundSeverity: number;
    replacementWoundSeverity: number;
    emotionalBurdenWoundSeverity: number;
    visibilityWoundSeverity: number;
    dependencyWoundSeverity: number;
    worthlessnessWoundSeverity: number;
    woundActivationLevel: number;
    triggerSensitivity: number;
    defensiveAdaptationStrength: number;
    attractionToWoundActivation: number;
    correctiveExperienceReadiness: number;
    woundHealingProgress: number;
    selfWorthStability: number;
    emotionalVisibilityFear: number;
    emotionalInvalidationSensitivity: number;
  };
  relationshipFears: {
    dominant?:
      | "abandonment"
      | "engulfment"
      | "rejection"
      | "vulnerability"
      | "replacement"
      | "inadequacy"
      | "dependency"
      | "betrayal"
      | "emotional_exposure"
      | "conflict"
      | "emotional_irrelevance"
      | "stability"
      | "intimacy"
      | "losing_autonomy"
      | "being_truly_known"
      | "being_controlled"
      | "being_forgotten";
    abandonmentFear: number;
    engulfmentFear: number;
    rejectionSensitivity: number;
    vulnerabilityFear: number;
    replacementFear: number;
    inadequacyFear: number;
    dependencyFear: number;
    betrayalSensitivity: number;
    emotionalExposureFear: number;
    conflictFear: number;
    irrelevanceFear: number;
    stabilityFear: number;
    intimacyAvoidance: number;
    losingAutonomyFear: number;
    beingKnownFear: number;
    fearActivation: number;
    protectiveAdaptationStrength: number;
    sabotageRisk: number;
    repairResponsiveness: number;
    fearTransformationProgress: number;
    abandonmentSensitivity: number;
    reassuranceDependence: number;
    withdrawalTriggering: number;
    emotionalReturnTrust: number;
    hypervigilance: number;
    separationTolerance: number;
    conflictSurvivalTrust: number;
    engulfmentSensitivity: number;
    spaceNeed: number;
    emotionalPressureSensitivity: number;
    identityStability: number;
    controlSensitivity: number;
    boundaryRigidity: number;
    agencyPreservation: number;
    possessivenessReactivity: number;
    trustDamage: number;
    vulnerabilityDamage: number;
    repairResistance: number;
    relationshipIdentityDamage: number;
    forgivenessReadiness: number;
    accountabilityRecognition: number;
    selfWorthStability: number;
    comparisonSensitivity: number;
    shameSensitivity: number;
    validationHunger: number;
    imperfectionTolerance: number;
    emotionalBurdenFear: number;
    emotionalPermanenceNeed: number;
    sentimentality: number;
    attachmentPersistence: number;
    nostalgiaIntensity: number;
    memoryPreservationNeed: number;
    emotionalVisibilityNeed: number;
    emotionalControlNeed: number;
    opennessThreshold: number;
    emotionalArmorStrength: number;
    vulnerabilityRecoverySpeed: number;
    emotionalSelfSufficiency: number;
    closenessPanicThreshold: number;
    reassuranceResistance: number;
    attachmentDenial: number;
    emotionalWithdrawalTendency: number;
    interdependenceCapacity: number;
    emotionalSingularityNeed: number;
    comparisonReactivity: number;
    rivalHypervigilance: number;
    reciprocityConfidence: number;
    emotionalRiskTolerance: number;
    confessionHesitation: number;
    emotionalExposureThreshold: number;
  };
  jealousyStyle: {
    primary?:
      | "anxious"
      | "silent"
      | "possessive"
      | "competitive"
      | "teasing"
      | "defensive"
      | "devotional"
      | "reactive"
      | "intellectualized"
      | "chaotic"
      | "reassurance_seeking"
      | "protective"
      | "subtle"
      | "shame_based"
      | "secure";
    jealousyReactivity: number;
    rivalSensitivity: number;
    reassuranceNeed: number;
    exclusivityNeed: number;
    emotionalSecurity: number;
    comparisonSensitivity: number;
    possessivenessTendency: number;
    emotionalTransparency: number;
    shameAroundNeediness: number;
    regulationCapacity: number;
    communicationReadiness: number;
    territoriality: number;
    controlRisk: number;
    reassuranceResponsiveness: number;
    vulnerabilityRevealPotential: number;
  };
  possessiveness: {
    primary?:
      | "emotional"
      | "romantic"
      | "sexual"
      | "protective"
      | "devotional"
      | "insecurity_driven"
      | "silent"
      | "territorial"
      | "chaotic";
    exclusivityNeed: number;
    emotionalTerritoriality: number;
    rivalSensitivity: number;
    prioritizationNeed: number;
    possessivenessIntensity: number;
    autonomyRespect: number;
    replacementFear: number;
    devotionalIntensity: number;
    reassuranceDependence: number;
    agencyPreservation: number;
    controlImpulse: number;
    monitoringImpulse: number;
    emotionalMonopolizationRisk: number;
    ownershipMentalityRisk: number;
    secureSingularity: number;
  };
  obsession: {
    primary?:
      | "romantic"
      | "emotional"
      | "sexual"
      | "jealous"
      | "devotional"
      | "transformational"
      | "fear_based"
      | "chaotic"
      | "mutual"
      | "silent";
    attachmentIntensity: number;
    emotionalFixation: number;
    replacementFear: number;
    exclusivityNeed: number;
    dependencyLevel: number;
    hypervigilance: number;
    devotionalIntensity: number;
    autonomyPreservation: number;
    emotionalRegulationStability: number;
    uncertaintyAmplification: number;
    intermittentRewardSensitivity: number;
    identityAbsorption: number;
    attentionDominance: number;
    reciprocityStability: number;
    boundaryIntegrity: number;
    safeObsessionPotential: number;
    destabilizationRisk: number;
  };
  conflictStyle: {
    primary:
      | "pursuer"
      | "withdrawer"
      | "explosive"
      | "passive_avoidant"
      | "teasing_deflective"
      | "intellectual"
      | "appeasing"
      | "dominance_based"
      | "emotional_shutdown"
      | "repair_oriented";
    secondary?: string[];
    stage:
      | "friction"
      | "tension"
      | "defensive_behavior"
      | "rupture"
      | "vulnerability_revelation"
      | "repair_attempt"
      | "reconnection";
    conflictAvoidance: number;
    emotionalReactivity: number;
    repairAbility: number;
    vulnerabilityUnderStress: number;
    withdrawalTendency: number;
    pursuitUrgency: number;
    accountability: number;
    emotionalFlooding: number;
    reassuranceNeed: number;
    ruptureRisk: number;
  };
  repairStyle: {
    primary:
      | "verbal_reassurance"
      | "accountability"
      | "behavioral"
      | "physical"
      | "presence_based"
      | "humor_play"
      | "space_based"
      | "vulnerability"
      | "devotional"
      | "practical"
      | "collaborative"
      | "ritual"
      | "silent"
      | "sacrificial";
    secondary?: string[];
    reassuranceRepairPreference: number;
    accountabilityCapacity: number;
    behavioralRepairReliability: number;
    spaceBasedRepairNeed: number;
    physicalRepairPreference: number;
    presenceReliability: number;
    collaborativeRepairSkill: number;
    repairTimingCompatibility: number;
    repairEffectiveness: number;
    validationSkill: number;
    vulnerabilityRepairCapacity: number;
    ritualRepairReliability: number;
    repairBypassingRisk: number;
    prematureRepairRisk: number;
    oneSidedRepairBurden: number;
  };
  communicationStyle: {
    primary:
      | "direct"
      | "indirect"
      | "teasing"
      | "emotionally_expressive"
      | "restrained"
      | "intellectual"
      | "reassurance_oriented"
      | "avoidant"
      | "chaotic"
      | "caretaking"
      | "devotional"
      | "conflict_avoidant"
      | "subtext_heavy"
      | "reactive"
      | "silent";
    secondary?: string[];
    directness: number;
    emotionalTransparency: number;
    subtextDensity: number;
    reassuranceFrequency: number;
    conflictOpenness: number;
    vulnerabilityExpression: number;
    playfulness: number;
    emotionalFiltering: number;
    responsiveness: number;
    nonverbalWeight: number;
    translationMismatchRisk: number;
  };
  emotionalTransparency: {
    style: "high" | "balanced" | "low" | "inconsistent";
    emotionalOpenness: number;
    expressionClarity: number;
    vulnerabilityComfort: number;
    emotionalFiltering: number;
    subtextDensity: number;
    leakageTendency: number;
    transparencyConsistency: number;
    emotionalSafetyDependence: number;
    reactivityVisibility: number;
    verbalTransparency: number;
    behavioralTransparency: number;
    controlledTransparency: number;
    accidentalTransparency: number;
    mysteryBalance: number;
    defensiveOpacityRisk: number;
    weaponizedTransparencyRisk: number;
    inauthenticTransparencyRisk: number;
  };
  miscommunication: {
    active: boolean;
    type?:
      | "emotional"
      | "protective"
      | "timing"
      | "expectation"
      | "jealousy"
      | "silence"
      | "intent"
      | "conflict"
      | "vulnerability"
      | "romantic_ambiguity";
    intendedMeaning?: string;
    expressedMeaning?: string;
    perceivedMeaning?: string;
    emotionalInterpretation?: string;
    directness: number;
    interpretationBias: number;
    vulnerabilityAvoidance: number;
    clarificationTendency: number;
    emotionalProjection: number;
    subtextDensity: number;
    ambiguityTolerance: number;
    reassuranceSensitivity: number;
    escalationRisk: number;
    resolutionReadiness: number;
  };
  misunderstanding: {
    active: boolean;
    type?:
      | "emotional_intent"
      | "affection"
      | "teasing"
      | "withdrawal"
      | "vulnerability"
      | "exclusivity"
      | "jealousy"
      | "timing"
      | "silence"
      | "self_protection";
    behaviorObserved?: string;
    objectiveMeaning?: string;
    interpretedMeaning?: string;
    emotionalReaction?: string;
    interpretationBias: number;
    ambiguityTolerance: number;
    clarificationTendency: number;
    projectionSensitivity: number;
    emotionalTranslationAccuracy: number;
    reassuranceDependence: number;
    subtextRecognition: number;
    attachmentTriggerSensitivity: number;
    misunderstandingRecoveryAbility: number;
    endlessLoopRisk: number;
  };
  admiration: {
    primary?:
      | "competence"
      | "emotional"
      | "protective"
      | "intellectual"
      | "moral"
      | "vulnerability"
      | "transformational"
      | "physical"
      | "devotional"
      | "hidden";
    secondary?: string[];
    respectLevel: number;
    fascination: number;
    competenceAttraction: number;
    emotionalReverence: number;
    idealizationTendency: number;
    prideInPartner: number;
    validationImportance: number;
    devotionalIntensity: number;
    realismOfAdmiration: number;
    conditionalAdmirationRisk: number;
  };
  excitement: {
    primary?:
      | "novelty"
      | "tension"
      | "uncertainty"
      | "challenge"
      | "sexual"
      | "emotional"
      | "forbidden"
      | "transformational"
      | "chaotic"
      | "playful";
    secondary?: string[];
    noveltyNeed: number;
    tensionEnjoyment: number;
    emotionalStimulation: number;
    predictabilityTolerance: number;
    escalationDesire: number;
    playfulness: number;
    riskAttraction: number;
    passionStability: number;
    responsiveness: number;
    attentionFixation: number;
    excitementSafetyBalance: number;
    instabilityAddictionRisk: number;
    stagnationRisk: number;
  };
  novelty: {
    primary?:
      | "personal_discovery"
      | "emotional"
      | "experiential"
      | "sexual"
      | "intellectual"
      | "identity"
      | "dynamic"
      | "vulnerability"
      | "domestic"
      | "relational";
    noveltyNeed: number;
    curiosityPersistence: number;
    adaptationSpeed: number;
    explorationDesire: number;
    emotionalEvolution: number;
    routineTolerance: number;
    rediscoveryCapacity: number;
    dynamicFlexibility: number;
    excitementDependency: number;
    noveltyStabilityBalance: number;
    artificialNoveltyRisk: number;
    noveltyStarvationRisk: number;
    instabilityConfusionRisk: number;
  };
  stability: {
    emotionalConsistency: number;
    conflictResilience: number;
    repairReliability: number;
    behavioralReliability: number;
    attachmentSecurity: number;
    identityStability: number;
    commitmentDurability: number;
    intimacyPersistence: number;
    routineIntegration: number;
    predictability: number;
    stabilitySatisfaction: number;
    falseStabilityRisk: number;
    hyperInstabilityRisk: number;
    stagnationRisk: number;
  };
  consistency: {
    emotionalReliability: number;
    behavioralReliability: number;
    affectionStability: number;
    repairReliability: number;
    vulnerabilitySafety: number;
    reassuranceFrequency: number;
    conflictConsistency: number;
    presenceDurability: number;
    identityConsistency: number;
    predictabilityComfort: number;
    attachmentSecurity: number;
    intentionalitySignal: number;
    inconsistencySensitivity: number;
    falseConsistencyRisk: number;
    rigidConsistencyRisk: number;
  };
  challenge: {
    primary?:
      | "intellectual"
      | "emotional"
      | "identity"
      | "competitive"
      | "moral"
      | "emotional_regulation"
      | "vulnerability"
      | "sexual"
      | "autonomy"
      | "stability";
    stimulationNeed: number;
    conflictTolerance: number;
    growthOrientation: number;
    egoSensitivity: number;
    competitiveness: number;
    vulnerabilityResistance: number;
    transformationReadiness: number;
    stabilityNeed: number;
    curiosity: number;
    challengeSafetyBalance: number;
    admirationPotential: number;
    destructiveChallengeRisk: number;
    exhaustionRisk: number;
    stagnationRisk: number;
  };
  chemistry: {
    primary:
      | "banter"
      | "tension"
      | "comfort"
      | "intellectual"
      | "sexual"
      | "emotional"
      | "chaotic"
      | "protective"
      | "devotional"
      | "oppositional"
      | "domestic"
      | "melancholic"
      | "predatory"
      | "soft_longing"
      | "transformational";
    secondary?: string[];
    compatibility: "low" | "medium" | "high";
    charge: 0 | 1 | 2;
  };
  sexualChemistry: {
    enabled: boolean;
    adultOnly: true;
    mode:
      | "slow_burn"
      | "explosive"
      | "playful"
      | "devotional"
      | "dominance_tension"
      | "emotional"
      | "forbidden"
      | "soft_domestic";
    physicalAwareness: number;
    tension: number;
    desireSuppression: number;
    responsiveness: number;
    escalationComfort: number;
    eroticConfidence: number;
    vulnerabilityLinkage: number;
    touchSensitivity: number;
    anticipation: number;
    desireStyle:
      | "spontaneous"
      | "responsive"
      | "tension_driven"
      | "emotional_intimacy"
      | "devotional"
      | "pursuit_oriented"
      | "security_based"
      | "validation_driven"
      | "power_dynamic"
      | "intellectual"
      | "forbidden"
      | "sensory_sensual"
      | "obsessive"
      | "slow_burn"
      | "chaotic";
    desireActivationStyle: string;
    desirePace: number;
    emotionalIntegration: number;
    desireVulnerabilityIntegration: number;
    validationDependence: number;
    tensionResponsiveness: number;
    securityBasedDesire: number;
    noveltyDependence: number;
    obsessionTendency: number;
    libidoStyle:
      | "high_stable"
      | "responsive"
      | "tension_driven"
      | "security_based"
      | "novelty_dependent"
      | "attachment_reactive"
      | "avoidant"
      | "obsessive"
      | "devotional"
      | "chaotic"
      | "low_reactive";
    libidoIntensity: number;
    libidoActivationStyle: string;
    libidoRegulationStyle:
      | "stable"
      | "stress_sensitive"
      | "attachment_reactive"
      | "conflict_sensitive"
      | "novelty_reactive"
      | "security_dependent";
    libidoEmotionalIntegration: number;
    libidoNoveltyDependence: number;
    libidoSecurityDependence: number;
    libidoStressSensitivity: number;
    libidoAttachmentInfluence: number;
    libidoIntimacyIntegration: number;
    pursuitReactivity: number;
    libidoStability: number;
    chemistryVariation:
      | "tension_based"
      | "emotional_intimacy"
      | "competitive"
      | "devotional"
      | "playful"
      | "protective"
      | "forbidden"
      | "obsessive"
      | "soft_domestic"
      | "chaotic"
      | "intellectual"
      | "slow_burn";
    tensionDensity: number;
    emotionalIntimacyChemistry: number;
    playfulnessChemistry: number;
    devotionalChemistry: number;
    protectiveChemistry: number;
    obsessiveChemistry: number;
    attachmentActivation: number;
    eroticRhythmCompatibility: number;
  };
  trustMechanics: {
    emotionalTrust: number;
    reliabilityTrust: number;
    vulnerabilityTrust: number;
    loyaltyTrust: number;
    conflictTrust: number;
    physicalTrust: number;
    sexualTrust: number;
    autonomyTrust: number;
    repairTrust: number;
    trustFragility: number;
    trustRecoverySpeed: number;
    trustPersistence: number;
    trustDamageMemory: number;
    thresholdReadiness: number;
    faithUnderUncertainty: number;
    dependabilityEvidence: number;
    vulnerabilityRiskTolerance: number;
  };
  ruptureSeverity: {
    level: 0 | 1 | 2 | 3 | 4 | 5;
    trustDamageSeverity: number;
    attachmentDamageSeverity: number;
    identityDamageSeverity: number;
    vulnerabilityDamageSeverity: number;
    emotionalSafetyDamageSeverity: number;
    exclusivityDamageSeverity: number;
    stabilityDamageSeverity: number;
    momentumDamageSeverity: number;
    repairDifficulty: number;
    ruptureMemoryWeight: number;
    accountabilityNeed: number;
    consistencyRestorationNeed: number;
    symbolicRepairNeed: number;
    hypervigilanceIncrease: number;
    futureVulnerabilityDelay: number;
    ruptureContextSensitivity: number;
    infinitePunishmentRisk: number;
    consequenceResetRisk: number;
  };
  ruptureSubtypes: {
    betrayalRuptureSeverity: number;
    abandonmentRuptureSeverity: number;
    humiliationRuptureSeverity: number;
    brokenPromiseRuptureSeverity: number;
    invalidationRuptureSeverity: number;
    trustRuptureSeverity: number;
    attachmentDestabilization: number;
    emotionalPresenceCollapse: number;
    shameActivationSeverity: number;
    reliabilityTrustDamage: number;
    emotionalValidationReliability: number;
    emotionalSelfTrustDamage: number;
    vulnerabilityShutdown: number;
    emotionalPermanenceDamage: number;
    dignityDamage: number;
    promiseWeight: number;
    repairCredibility: number;
    reconciliationViability: number;
    emotionalReturnTrust: number;
    repairRecognitionCapacity: number;
  };
  repairArc: {
    type:
      | "clarification"
      | "apology"
      | "reassurance"
      | "accountability"
      | "trust_rebuilding"
      | "emotional_safety"
      | "presence"
      | "boundary"
      | "mutual_responsibility"
      | "redemption"
      | "reconciliation"
      | "non_repair";
    stage:
      | "rupture"
      | "recognition"
      | "accountability"
      | "validation"
      | "renegotiation"
      | "changed_behavior"
      | "cautious_reconnection"
      | "trust_rebuild"
      | "closure";
    repairReadiness: number;
    accountabilityLevel: number;
    hurtPartnerOpenness: number;
    trustDamage: number;
    repairAttempts: number;
    changedBehaviorEvidence: number;
    resentmentLevel: number;
    forgivenessReadiness: number;
    emotionalReadiness: number;
    validationQuality: number;
    reassuranceEffectiveness: number;
    boundaryRespectEvidence: number;
    presenceReliability: number;
    reconciliationViability: number;
    closureReadiness: number;
  };
  emotionalNeglect: {
    active: boolean;
    emotionalResponsiveness: number;
    reassuranceConsistency: number;
    presenceStability: number;
    ritualMaintenance: number;
    emotionalPrioritization: number;
    vulnerabilityResponsiveness: number;
    repairEngagement: number;
    emotionalVisibility: number;
    inattentivenessLevel: number;
    priorityNeglect: number;
    affectionNeglect: number;
    psychologicalNeglect: number;
    driftRisk: number;
    resignationRisk: number;
    oneSidedLaborRisk: number;
  };
  emotionalSafety: {
    vulnerabilitySafety: number;
    conflictSafety: number;
    consistency: number;
    acceptanceSafety: number;
    boundaryRespect: number;
    reassuranceReliability: number;
    judgmentSensitivity: number;
    emotionalStability: number;
    repairTrust: number;
    authenticityComfort: number;
    conditionalSafetyRisk: number;
    falseSafetyRisk: number;
    defensiveBehavior: number;
  };
  caretaking: {
    primary?:
      | "emotional"
      | "physical"
      | "practical"
      | "protective"
      | "reassurance_based"
      | "domestic"
      | "devotional"
      | "mutual"
      | "silent"
      | "transformational";
    caretakingInstinct: number;
    emotionalResponsiveness: number;
    protectiveImpulse: number;
    autonomyRespect: number;
    reassuranceAbility: number;
    domesticIntegration: number;
    burnoutRisk: number;
    reciprocityBalance: number;
    emotionalAttunement: number;
    supportConsent: number;
    dependencyEncouragementRisk: number;
    controlDisguisedAsCareRisk: number;
    martyrdomRisk: number;
    noticingSensitivity: number;
  };
  loveLanguages: {
    receptionPrimary?:
      | "words_of_affirmation"
      | "physical_touch"
      | "acts_of_service"
      | "quality_time"
      | "gift_giving"
      | "emotional_reassurance"
      | "emotional_transparency"
      | "protective_behavior"
      | "devotional_attention"
      | "playful_engagement"
      | "presence_during_distress"
      | "exclusivity_signals";
    verbalAffirmationNeed: number;
    touchNeed: number;
    serviceAppreciation: number;
    attentionNeed: number;
    symbolicAttachment: number;
    reassuranceNeed: number;
    emotionalOpennessNeed: number;
    protectivePreference: number;
    exclusivitySensitivity: number;
    expressionReceptionMismatch: number;
    affectionRecognitionAccuracy: number;
    adaptationWillingness: number;
    repairLanguageFit: number;
    oneSidedAdaptationRisk: number;
    transactionalAffectionRisk: number;
    affectionBlindnessRisk: number;
  };
  affectionExpressionStyle: {
    primary?:
      | "verbal"
      | "physical"
      | "caretaking"
      | "protective"
      | "teasing"
      | "devotional"
      | "quiet"
      | "service_based"
      | "attention_based"
      | "possessive"
      | "playful"
      | "emotional_transparency"
      | "loyalty_based"
      | "sacrificial"
      | "domestic"
      | "admiration_based"
      | "presence_based";
    secondary?: string[];
    verbalExpressiveness: number;
    physicalAffectionFrequency: number;
    caretakingInstinct: number;
    protectiveImpulse: number;
    playfulness: number;
    devotionalFocus: number;
    emotionalTransparency: number;
    presenceReliability: number;
    attentionIntensity: number;
    domesticIntegration: number;
    serviceOrientation: number;
    loyaltyConsistency: number;
    sacrificialTendency: number;
    admirationVisibility: number;
    possessiveSignaling: number;
    receptionMatchAccuracy: number;
    expressionEvolution: number;
    mismatchRisk: number;
  };
  intimacy: {
    emotionalSafety: number;
    familiarity: number;
    reception: number;
    consistency: number;
    reciprocity: number;
    vulnerabilityDepth: number;
    trust: number;
    comfort: number;
    attachment: number;
    dependency: number;
    touchComfort: number;
    sharedHistory: number;
    domesticIntegration: number;
    emotionalAttunement: number;
    dominantModes: Array<
      | "emotional"
      | "physical"
      | "intellectual"
      | "domestic"
      | "vulnerability"
      | "sexual"
      | "experiential"
      | "silent"
      | "protective"
      | "identity"
    >;
    falseIntimacyRisk: "low" | "medium" | "high";
  };
  intimacyStyle: {
    primary:
      | "emotional"
      | "physical"
      | "domestic"
      | "intellectual"
      | "playful"
      | "protective"
      | "devotional"
      | "quiet"
      | "sexual"
      | "vulnerability_based"
      | "service_based"
      | "tension_based"
      | "chaos"
      | "mutual_competence"
      | "transformational";
    secondary?: string[];
    emotionalOpenness: number;
    physicalAffectionNeed: number;
    domesticIntegration: number;
    intellectualEngagement: number;
    playfulness: number;
    protectiveInstinct: number;
    devotionalIntensity: number;
    sexualResponsiveness: number;
    quietComfort: number;
    styleCompatibility: number;
    adaptationWillingness: number;
    recognitionNeed: number;
  };
  commitmentStyle: {
    primary:
      | "secure"
      | "devotional"
      | "avoidant"
      | "anxious"
      | "fearful"
      | "situational"
      | "protective"
      | "idealistic"
      | "pragmatic"
      | "independent"
      | "chaotic"
      | "slow_build";
    secondary?: string[];
    commitmentReadiness: number;
    exclusivityNeed: number;
    autonomyNeed: number;
    stabilityDesire: number;
    fearOfEngulfment: number;
    fearOfAbandonment: number;
    futureOrientation: number;
    loyaltyIntensity: number;
    repairPersistence: number;
    labelComfort: number;
    integrationComfort: number;
    breakupRisk: number;
  };
  autonomy: {
    style: "high_autonomy" | "fusion_oriented" | "balanced_interdependence" | "fluctuating";
    autonomyNeed: number;
    emotionalIndependence: number;
    spaceNeed: number;
    fusionDesire: number;
    boundaryStrength: number;
    dependencyComfort: number;
    identityStability: number;
    closenessTolerance: number;
    exclusivitySensitivity: number;
    emotionalBoundaryAutonomy: number;
    decisionMakingAutonomy: number;
    sexualAutonomy: number;
    psychologicalAutonomy: number;
    engulfmentFear: number;
    codependencyRisk: number;
    intimacyStarvationRisk: number;
  };
  exclusivity: {
    style:
      | "fully_monogamous"
      | "emotionally_monogamous"
      | "sexually_possessive"
      | "emotionally_possessive"
      | "devotional"
      | "autonomous"
      | "flexible_negotiated"
      | "low_exclusivity_need"
      | "high_territorial";
    emotionalPrioritization: number;
    exclusivityNeed: number;
    emotionalExclusivityNeed: number;
    sexualExclusivityNeed: number;
    romanticExclusivity: number;
    sexualExclusivity: number;
    psychologicalExclusivity: number;
    ritualExclusivity: number;
    ritualExclusivityImportance: number;
    futureExclusivity: number;
    socialExclusivity: number;
    vulnerabilityExclusivity: number;
    relationshipVisibilityStyle: number;
    boundaryRigidity: number;
    emotionalSharingTolerance: number;
    territorialityLevel: number;
    emotionalPermanenceNeed: number;
    rivalSensitivity: number;
    emotionalCentralization: number;
    autonomyPreservation: number;
    jealousyReactivity: number;
    relationshipIdentityStrength: number;
    vulnerabilitySelectivity: number;
    loyaltyExpectation: number;
    conditionalExclusivityRisk: number;
    ownershipRisk: number;
  };
  relationshipStructure: {
    type:
      | "monogamous"
      | "monogamish"
      | "open_relationship"
      | "polyamorous"
      | "hierarchical_poly"
      | "non_hierarchical_poly"
      | "relationship_anarchy"
      | "solo_poly"
      | "sexual_non_exclusive"
      | "swinging"
      | "undefined";
    consentClarity: number;
    boundaryClarity: number;
    communicationTransparency: number;
    emotionalBandwidth: number;
    timeAllocationPressure: number;
    hierarchyPreference: number;
    prioritizationNeed: number;
    relationshipDifferentiation: number;
    compersionCapacity: number;
    jealousySensitivity: number;
    reassuranceNeed: number;
    emotionalSecurity: number;
    agreementStability: number;
    ambiguityRisk: number;
    coercionRisk: number;
    emotionalNeglectRisk: number;
  };
  expectations: {
    communication: number;
    affection: number;
    commitment: number;
    conflictResolution: number;
    intimacy: number;
    exclusivity: number;
    availability: number;
    relationshipRole: number;
    romanticFantasy: number;
    repair: number;
    future: number;
    emotionalPriority: number;
    reassuranceExpectation: number;
    independenceExpectation: number;
    mindReadingExpectation: number;
    mismatchRisk: number;
    violationSensitivity: number;
    renegotiationOpenness: number;
  };
  continuity: {
    memoryWeight: number;
    emotionalMomentum: number;
    ritualDensity: number;
    callbackFrequency: number;
    trustPersistence: number;
    scarPersistence: number;
    dynamicStability: number;
    relationshipIdentityStrength: number;
    vulnerabilityEvolution: number;
    escalationMemory: number;
    futureProjection: number;
    repairContinuity: number;
    contextualActivation: number;
    trajectory:
      | "stabilizing"
      | "escalating"
      | "deteriorating"
      | "becoming_dependent"
      | "nearing_confession"
      | "approaching_breakup"
      | "repair_arc"
      | "deepening_devotion";
  };
  vulnerabilityThresholds: {
    emotionalOpennessThreshold: number;
    attachmentThreshold: number;
    confessionThreshold: number;
    reassuranceSeekingThreshold: number;
    traumaDisclosureThreshold: number;
    dependencyThreshold: number;
    physicalIntimacyThreshold: number;
    shameExposureThreshold: number;
    conflictVulnerabilityThreshold: number;
    authenticityThreshold: number;
    thresholdAdaptability: number;
    thresholdLoweringMomentum: number;
    thresholdSpikeAfterRupture: number;
  };
  emotionalMemorySensitivity: {
    emotionalMemoryWeight: number;
    triggerSensitivity: number;
    abandonmentMemorySensitivity: number;
    betrayalMemorySensitivity: number;
    rejectionMemorySensitivity: number;
    shameMemorySensitivity: number;
    invalidationMemorySensitivity: number;
    neglectMemorySensitivity: number;
    brokenPromiseMemorySensitivity: number;
    dependencyMemorySensitivity: number;
    conflictMemorySensitivity: number;
    safetyMemorySensitivity: number;
    reassuranceRetention: number;
    repairRetention: number;
    emotionalResetSpeed: number;
    attachmentMemoryStrength: number;
  };
  idealizationRealityTolerance: {
    idealizationIntensity: number;
    realityTolerance: number;
    fantasyDependence: number;
    imperfectionTolerance: number;
    routineTolerance: number;
    projectionIntensity: number;
    emotionalComplexityTolerance: number;
    stabilityTolerance: number;
    humanizationComfort: number;
    expectationFlexibility: number;
    attachmentRealityTolerance: number;
    matureAttachmentCapacity: number;
    devaluationCycleRisk: number;
    fantasyCollapseRisk: number;
  };
  relationshipValues: {
    loyaltyImportance: number;
    emotionalHonestyValue: number;
    emotionalSafetyValue: number;
    autonomyValue: number;
    devotionValue: number;
    growthOrientation: number;
    stabilityPreference: number;
    passionImportance: number;
    freedomValue: number;
    exclusivityImportance: number;
    caretakingValue: number;
    equalityValue: number;
    acceptanceValue: number;
    excitementValue: number;
    commitmentImportance: number;
    valueRigidity: number;
    valueAlignment: number;
  };
  ritualsAndHabits: {
    primary?:
      | "greeting"
      | "goodbye"
      | "comfort"
      | "conflict_repair"
      | "domestic"
      | "teasing"
      | "reassurance"
      | "protective"
      | "physical_affection"
      | "symbolic"
      | "public"
      | "private";
    ritualDensity: number;
    ritualImportance: number;
    reassuranceRitualDependence: number;
    domesticIntegration: number;
    symbolicAttachment: number;
    ritualStability: number;
    emotionalContinuity: number;
    ritualSensitivity: number;
    sharedCultureStrength: number;
    ritualEvolution: number;
    ritualDisruptionRisk: number;
    weaponizedRitualRisk: number;
    habitSpecificity: number;
  };
  compatibilityAxes: {
    emotionalCompatibility: number;
    emotionalRegulationFit: number;
    vulnerabilityCompatibility: number;
    reassuranceCompatibility: number;
    expressionCompatibility: number;
    emotionalNeedCompatibility: number;
    emotionalSafetyFit: number;
    intensityCompatibility: number;
    empathySynchronization: number;
    communicationCompatibility: number;
    directnessCompatibility: number;
    emotionalTransparencyFit: number;
    conflictCommunicationFit: number;
    subtextCompatibility: number;
    vulnerabilityPaceCompatibility: number;
    processingSpeedCompatibility: number;
    affectionTranslationAccuracy: number;
    emotionalVocabularyCompatibility: number;
    emotionalListeningQuality: number;
    conflictCompatibility: number;
    regulationCompatibilityUnderStress: number;
    repairCompatibility: number;
    pursuitWithdrawalFit: number;
    accountabilityCapacity: number;
    emotionalSafetyDuringConflict: number;
    escalationToleranceMatch: number;
    resolutionTimingCompatibility: number;
    vulnerabilityPreservation: number;
    conflictMeaningCompatibility: number;
    boundaryRespectUnderStress: number;
    attachmentCompatibility: number;
    intimacyCompatibility: number;
    sexualCompatibility: number;
    desireStyleFit: number;
    libidoCompatibility: number;
    emotionalIntimacyIntegration: number;
    sexualVulnerabilitySafety: number;
    touchCompatibility: number;
    sexualPaceCompatibility: number;
    dynamicCompatibility: number;
    sexualCommunicationOpenness: number;
    sexualExclusivityCompatibility: number;
    intimacyRegulationCompatibility: number;
    explorationCompatibility: number;
    sensualCompatibility: number;
    sexualSafetyDependence: number;
    sexualCompatibilityEvolution: number;
    pressureMismatchRisk: number;
    sexualCommunicationCollapseRisk: number;
    emotionalDisconnectRisk: number;
    staticEroticDynamicRisk: number;
    pacingCompatibility: number;
    emotionalPacePreferenceFit: number;
    attachmentSpeedCompatibility: number;
    commitmentPaceComfort: number;
    intimacyEscalationComfort: number;
    broadVulnerabilityThresholdFit: number;
    conflictProcessingSpeedFit: number;
    domesticPacingCompatibility: number;
    exclusivityPacingCompatibility: number;
    intensityPacingCompatibility: number;
    relationshipIdentityPacingFit: number;
    progressionFlexibility: number;
    pacingPressureRisk: number;
    emotionalAccelerationOverloadRisk: number;
    chronicStagnationRisk: number;
    avoidancePacingRisk: number;
    domesticCompatibility: number;
    routineCompatibility: number;
    sharedSpaceCompatibility: number;
    responsibilitySharingFit: number;
    dailyRegulationFit: number;
    domesticAffectionFit: number;
    choreExpectationAlignment: number;
    cleanlinessPreferenceFit: number;
    sleepScheduleCompatibility: number;
    foodAndCareRhythmFit: number;
    homePrivacyCompatibility: number;
    domesticConflictRisk: number;
    domesticIntegrationSustainability: number;
    ordinaryLifeConnection: number;
    ambitionCompatibility: number;
    goalAlignment: number;
    workLifePriorityCompatibility: number;
    achievementDriveCompatibility: number;
    timeAvailabilityFit: number;
    successIdentityCompatibility: number;
    ambitionGrowthCompatibility: number;
    lifestylePaceCompatibility: number;
    emotionalAvailabilityUnderAmbition: number;
    sacrificeCompatibility: number;
    securityAspirationCompatibility: number;
    competitivenessRisk: number;
    ambitionSupportiveness: number;
    futureInclusionStrength: number;
    socialCompatibility: number;
    socialEnergyMatch: number;
    publicAffectionCompatibility: number;
    relationshipVisibilityPreferenceFit: number;
    friendshipIntegrationFit: number;
    attentionDistributionComfort: number;
    lifestyleSocialRhythm: number;
    familyCompatibility: number;
    socialBoundaryCompatibility: number;
    reputationSensitivityFit: number;
    socialSupportiveness: number;
    publicIdentityComfort: number;
    socialJealousyRisk: number;
    publicInvalidationRisk: number;
    socialExhaustionRisk: number;
    exclusivityCompatibility: number;
    autonomyCompatibility: number;
    stabilityCompatibility: number;
    lifestyleCompatibility: number;
    routineRhythmFit: number;
    energyCompatibility: number;
    organizationCompatibility: number;
    socialLifestyleFit: number;
    workLifeCompatibility: number;
    domesticResponsibilityBalance: number;
    financialLifestyleCompatibility: number;
    leisureCompatibility: number;
    spaceNeedCompatibility: number;
    stressHabitCompatibility: number;
    healthWellnessCompatibility: number;
    changeToleranceMatch: number;
    dailyIntimacySustainability: number;
    lifestyleFrictionAccumulation: number;
    overAdaptationRisk: number;
    valueCompatibility: number;
    growthCompatibility: number;
    ritualCompatibility: number;
    devotionCompatibility: number;
    noveltyCompatibility: number;
    naturalCompatibility: number;
    adaptationCapacity: number;
    transformationalCompatibility: number;
    chemistryCompatibilityGap: number;
    compatibilityStress: number;
  };
  progression: {
    emotionalReadiness: number;
    progressionMomentum: number;
    vulnerabilityThreshold: number;
    regressionSensitivity: number;
    repairEffectiveness: number;
    milestoneDensity: number;
    stabilityLevel: number;
    dynamicEvolution: number;
    emotionalSaturation: number;
    trustAxis: number;
    attractionAxis: number;
    attachmentAxis: number;
    vulnerabilityAxis: number;
    commitmentAxis: number;
    stabilityAxis: number;
    tensionAxis: number;
    familiarityAxis: number;
    devotionAxis: number;
    plateauRisk: number;
    compatibilityStress: number;
    trajectoryPrediction:
      | "stabilizing"
      | "escalating"
      | "becoming_obsessive"
      | "entering_repair_arc"
      | "nearing_breakup"
      | "approaching_confession"
      | "becoming_domestic"
      | "emotionally_withdrawing"
      | "plateauing";
  };
  relationshipTrajectoryPrediction: {
    primary:
      | "secure_deepening"
      | "obsessive_escalation"
      | "push_pull"
      | "slow_burn_deepening"
      | "emotional_drift"
      | "repair_redemption"
      | "chaotic_collapse"
      | "domestic_stabilization"
      | "fantasy_collapse"
      | "transformational";
    attachmentTrajectory: number;
    trustTrajectory: number;
    stabilityTrajectory: number;
    intimacyTrajectory: number;
    ruptureTrajectory: number;
    repairTrajectory: number;
    identityTrajectory: number;
    driftRisk: number;
    identityConsolidation: number;
    survivabilityProjection: number;
    collapseRisk: number;
    turningPointVolatility: number;
    trajectoryConfidence: number;
  };
  relationshipMomentum: {
    state:
      | "escalating"
      | "stabilizing"
      | "volatile"
      | "repairing"
      | "deteriorating"
      | "stagnant";
    attachmentMomentum: number;
    romanticEscalationMomentum: number;
    trustMomentum: number;
    negativeMomentum: number;
    obsessionMomentum: number;
    repairMomentum: number;
    domesticMomentum: number;
    vulnerabilityMomentum: number;
    conflictMomentum: number;
    emotionalDriftMomentum: number;
    stabilityMomentum: number;
    emotionalMemoryWeight: number;
    expectationReinforcement: number;
    trajectoryAcceleration: number;
    turningPointSensitivity: number;
    emotionalResetRisk: number;
    infiniteEscalationRisk: number;
    trajectoryClarity: number;
  };
  relationshipLifecycle: {
    currentState:
      | "potential"
      | "attraction"
      | "tension"
      | "pursuit"
      | "denial"
      | "attachment_formation"
      | "vulnerability"
      | "instability"
      | "obsession"
      | "devotional"
      | "domestic_integration"
      | "stable_partnership"
      | "plateau"
      | "drift"
      | "fracture"
      | "repair"
      | "reconnection"
      | "transformation"
      | "dissolution"
      | "post_attachment";
    attachmentDepth: number;
    lifecycleStabilityLevel: number;
    momentumDirection: string;
    vulnerabilityOpenness: number;
    trustIntegrity: number;
    lifecycleRitualDensity: number;
    emotionalVolatility: number;
    repairProgress: number;
    stateTransitionReadiness: number;
    stateMemoryWeight: number;
    lifecycleRegressionRisk: number;
    lifecyclePlateauRisk: number;
    dissolutionRisk: number;
    postAttachmentResidue: number;
  };
  relationshipSurvivability: {
    overall: number;
    conflictSurvivability: number;
    trustDurability: number;
    repairCompetence: number;
    emotionalSafetyStability: number;
    adaptationCapacity: number;
    attachmentResilience: number;
    identityStability: number;
    intimacySurvivability: number;
    lifestyleSustainability: number;
    ruptureRecoveryCapacity: number;
    futureSurvivability: number;
    sharedWillingnessToContinue: number;
    stressAbsorption: number;
    falseSurvivabilityRisk: number;
    fragilityLoopRisk: number;
    repairFailureRisk: number;
    intensityAddictionRisk: number;
  };
  relationshipIdentity: {
    state:
      | "curious"
      | "flirtatious"
      | "emotionally_attached"
      | "devotional"
      | "fragile"
      | "domestic"
      | "competitive"
      | "obsessive"
      | "safe_haven"
      | "chaotic"
      | "healing"
      | "transformational"
      | "repairing"
      | "stable_partnership"
      | "codependent";
    sharedIdentityStrength: number;
    ritualDensity: number;
    futureIntegration: number;
    emotionalInterdependence: number;
    identityStability: number;
    sharedMythology: number;
    coupleCultureDepth: number;
    publicPrivateContrast: number;
    roleRigidity: number;
    emotionalMythology: number;
    relationshipUniqueness: number;
    sharedValueAlignment: number;
    emotionalToneIdentity: number;
    sharedNarrative?: string;
    publicIdentity?: string;
    privateIdentity?: string;
    identityRuptureRisk: number;
    identityRepairReadiness: number;
  };
  relationshipStatus: {
    structuralDefinition?:
      | "strangers"
      | "acquaintances"
      | "friends"
      | "dating"
      | "exclusive"
      | "engaged"
      | "married"
      | "divorced"
      | "polycule"
      | "situationship"
      | "exes"
      | "undefined";
    emotionalStatus?:
      | "curious"
      | "attached"
      | "yearning"
      | "dependent"
      | "obsessed"
      | "detached"
      | "conflicted"
      | "healing"
      | "resentful"
      | "devoted";
    commitmentStatus?:
      | "casual"
      | "exploratory"
      | "emotionally_invested"
      | "committed"
      | "uncertain"
      | "avoidant"
      | "future_oriented"
      | "unstable";
    exclusivityStatus?:
      | "exclusive"
      | "emotionally_exclusive"
      | "sexually_exclusive"
      | "open"
      | "polyamorous"
      | "undefined"
      | "ambiguous";
    stabilityStatus?:
      | "stable"
      | "fragile"
      | "chaotic"
      | "conflict_heavy"
      | "repairing"
      | "deteriorating"
      | "recovering";
    intimacyStatus?:
      | "distant"
      | "flirtatious"
      | "sexually_intimate"
      | "emotionally_intimate"
      | "domestic"
      | "vulnerable"
      | "avoidant";
    visibilityStatus?:
      | "secret"
      | "public"
      | "hidden_feelings"
      | "socially_ambiguous"
      | "publicly_committed";
    attachmentStatus?:
      | "emotionally_attached"
      | "dependent"
      | "avoidant"
      | "securely_bonded"
      | "anxiously_attached"
      | "detached"
      | "unresolved";
    highResolutionType?:
      | "familiar_strangers"
      | "denial_state"
      | "tension_heavy_undefined"
      | "secretly_attached"
      | "mutual_yearning"
      | "deep_attachment"
      | "devotional_relationship"
      | "domestic_partnership"
      | "secure_partnership"
      | "push_pull"
      | "broken_up_but_attached"
      | "reconciliation"
      | "soulmate_identity"
      | "companionate_love"
      | "transformational_bond";
    emotionalAttachment: number;
    commitmentLevel: number;
    stabilityLevel: number;
    intimacyLevel: number;
    relationshipIdentityStrength: number;
    repairState: number;
    unresolvedTension: number;
    statusAmbiguity: number;
  };
  restraint: {
    mode:
      | "social"
      | "self_protective"
      | "power_based"
      | "protective"
      | "mutual"
      | "fear_based"
      | "identity_based"
      | "devotional";
    vulnerabilityResistance: number;
    emotionalLeakage: number;
    composure: number;
    emotionalPressure: number;
    fearOfConsequence: number;
    desireSuppression: number;
    confessionThreshold: number;
  };
  confession: {
    pressure: number;
    vulnerabilityThreshold: number;
    fearOfRejection: number;
    reciprocityConfidence: number;
    emotionalUrgency: number;
    attachmentDepth: number;
    lastStyle?:
      | "direct"
      | "indirect"
      | "accidental"
      | "defensive"
      | "desperate"
      | "quiet"
      | "silent";
    pendingTruth?:
      | "romantic"
      | "vulnerability"
      | "dependency"
      | "desire"
      | "fear"
      | "jealousy"
      | "betrayal"
      | "identity"
      | "devotional";
  };
  redemption: {
    active: boolean;
    arcType?:
      | "betrayal"
      | "moral"
      | "emotional"
      | "self_redemption"
      | "protective"
      | "identity";
    phase?:
      | "harm"
      | "awareness"
      | "unworthiness"
      | "atonement"
      | "trust_resistance"
      | "demonstration"
      | "emotional_reopening"
      | "reconciliation";
    guilt: number;
    accountability: number;
    trustDamage: number;
    repairConsistency: number;
    fearOfRejection: number;
    selfWorth: number;
    forgivenessReadiness: number;
    behavioralChange: number;
    sacrificeWillingness: number;
  };
  reassurance: {
    active: boolean;
    mode?:
      | "verbal"
      | "physical"
      | "behavioral"
      | "protective"
      | "exclusivity"
      | "conflict"
      | "vulnerability"
      | "silent"
      | "devotional"
      | "future_oriented";
    reassuranceNeed: number;
    reassuranceAbility: number;
    emotionalSecurity: number;
    fearOfAbandonment: number;
    trustStability: number;
    validationSensitivity: number;
    consistency: number;
    repairSpeed: number;
    reassuranceCredibility: number;
    reassuranceSaturation: number;
    underlyingFearAddressed: number;
  };
  intent: {
    primary:
      | "connection_seeking"
      | "reassurance_seeking"
      | "emotional_testing"
      | "desire_expression"
      | "self_protection"
      | "control"
      | "comfort_giving"
      | "provocation"
      | "vulnerability"
      | "avoidance"
      | "possessive"
      | "repair";
    secondary?: string[];
    closenessSeeking: number;
    fearOfVulnerability: number;
    reassuranceNeed: number;
    emotionalLeverageDesire: number;
    reciprocityTesting: number;
    conflictAvoidance: number;
    emotionalTransparency: number;
    attachmentUrgency: number;
    surfaceAlignment: "aligned" | "mixed" | "contradictory";
  };
  teasing: {
    mode:
      | "playful"
      | "flirtatious"
      | "affectionate"
      | "competitive"
      | "protective"
      | "defensive"
      | "sexual"
      | "devotional"
      | "soft_cruel"
      | "silent";
    playfulness: number;
    provocationTendency: number;
    emotionalSafety: number;
    vulnerabilityAvoidance: number;
    responsiveness: number;
    tensionAwareness: number;
    familiarity: number;
    escalationIntent: number;
  };
  brattyDynamic: {
    enabled: boolean;
    mode?:
      | "playfully_defiant"
      | "attention_seeking"
      | "flirt_brat"
      | "defensive"
      | "competitive"
      | "affectionate"
      | "chaos";
    provocationTendency: number;
    attentionSeeking: number;
    emotionalSafety: number;
    challengeEnjoyment: number;
    vulnerabilityAvoidance: number;
    responsiveness: number;
    powerTesting: number;
    playfulness: number;
  };
  relationshipDynamic: {
    primary:
      | "pursuer_withdrawer"
      | "banter_rivals"
      | "caregiver_guarded"
      | "mutual_yearning"
      | "chaotic_push_pull"
      | "soft_dominance_playful_resistance"
      | "emotional_sanctuary"
      | "obsession"
      | "mutual_competence_admiration"
      | "emotional_translation"
      | "protective_dependency"
      | "devotional_partnership"
      | "emotional_chess"
      | "domestic_comfort"
      | "transformational";
    secondary?: string[];
    reciprocity: number;
    emotionalStability: number;
    pursuitBalance: number;
    vulnerabilityFlow: number;
    conflictRecovery: number;
    powerFluidity: number;
    interactionRhythm: number;
    emotionalDependency: number;
    safetyLevel: number;
    tensionDensity: number;
  };
  power: {
    emotionalLeverage: "char" | "user" | "balanced" | "shifting";
    pursuitBalance: "char_pursues" | "user_pursues" | "mutual" | "avoidant_loop";
    vulnerabilityGap: "char_more_open" | "user_more_open" | "balanced" | "guarded";
    socialAuthority: "char" | "user" | "balanced" | "external";
    protectiveReliance: "char_relies" | "user_relies" | "mutual" | "none";
    sexualInitiative: "char" | "user" | "mutual" | "restrained";
    attachmentSecurity: number;
    controlNeed: number;
    reciprocity: number;
  };
  dominanceSubmission: {
    enabled: boolean;
    dominantArchetype?:
      | "soft"
      | "teasing"
      | "protective"
      | "commanding"
      | "devotional"
      | "intellectual"
      | "chaotic"
      | "possessive"
      | "service"
      | "stoic"
      | "predator"
      | "rival"
      | "gentle_caretaker"
      | "sadistic_tease"
      | "only_soft_for_you";
    submissiveArchetype?:
      | "brat"
      | "devotional"
      | "soft"
      | "praise_seeking"
      | "stoic"
      | "service_oriented"
      | "reactive"
      | "guarded"
      | "chaotic"
      | "curious"
      | "emotionally_hungry"
      | "only_vulnerable_with_you"
      | "emotional_mirror"
      | "competent"
      | "yearning";
    switchArchetype?:
      | "playful"
      | "emotional"
      | "guarded"
      | "competitive"
      | "devotional"
      | "brat_to_soft"
      | "stoic_to_reactive"
      | "service_control"
      | "chaotic"
      | "competent_vulnerability"
      | "mirror"
      | "only_with_you";
    mode?:
      | "soft_dominance_playful_submission"
      | "emotional_leadership"
      | "tension_control"
      | "mutual_dominance"
      | "devotional_submission"
      | "protective_dominance"
      | "brat_handler"
      | "service_oriented_submission"
      | "command_resistance"
      | "switch";
    initiative: "char" | "user" | "mutual" | "shifting";
    emotionalControl: number;
    yieldingComfort: number;
    trust: number;
    provocationEnjoyment: number;
    responsiveness: number;
    attentionIntensity: number;
    tensionControl: number;
    protectiveInstinct: number;
    vulnerabilityTolerance: number;
    possessiveness: number;
    confidence: number;
    powerFluidity: number;
    containmentNeed: number;
    validationNeed: number;
    trustThreshold: number;
    attentionNeed: number;
    emotionalTransparency: number;
    attachmentIntensity: number;
    emotionalAdaptability: number;
    vulnerabilityFlexibility: number;
    initiativeBalance: number;
    composureStability: number;
    attentionResponsiveness: number;
    consentResponsive: boolean;
  };
  kinkDynamics: {
    enabled: boolean;
    adultOnlyWhenErotic: true;
    primary?:
      | "praise"
      | "worship"
      | "attention_focus"
      | "devotion"
      | "adoration"
      | "obsession_neediness"
      | "possessiveness"
      | "jealousy_play"
      | "pet_names"
      | "being_watched"
      | "validation_seeking"
      | "begging_dynamics"
      | "power_exchange"
      | "dominance"
      | "submission"
      | "service"
      | "obedience"
      | "bratting"
      | "discipline"
      | "command_control"
      | "ownership_language"
      | "soft_dominance"
      | "gentle_femdom"
      | "caregiver_little"
      | "protector_dynamics"
      | "authority_figure"
      | "teasing"
      | "denial"
      | "slow_seduction"
      | "edge_play_nondangerous"
      | "chase_pursuit"
      | "consensual_resistance_play"
      | "push_pull"
      | "forbidden_attraction"
      | "almost_touching"
      | "emotional_restraint"
      | "flirt_fighting"
      | "emotional_exposure"
      | "comfort_aftercare"
      | "crying_comfort"
      | "confession_dynamics"
      | "dependency_themes"
      | "needing_reassurance"
      | "safe_surrender"
      | "emotional_caretaking"
      | "stay_with_me"
      | "emotional_softening"
      | "soulmate_fantasy"
      | "exclusive_attention"
      | "romantic_possession"
      | "loyalty_dynamics"
      | "sacrifice_worship"
      | "emotional_monopolization"
      | "eternal_commitment"
      | "rescue_fantasy"
      | "healing_dynamics"
      | "reunion_return"
      | "mind_games"
      | "consensual_manipulation_fantasy"
      | "corruption_fantasy"
      | "temptation_dynamics"
      | "emotional_power_imbalance"
      | "rivalry_attraction"
      | "intimidation_attraction"
      | "fear_tension"
      | "touch_sensitivity"
      | "sensory_deprivation"
      | "restraint"
      | "temperature_play"
      | "sensual_touch"
      | "hair_pulling"
      | "biting"
      | "marking"
      | "clothing_uniform_attraction"
      | "scent_attraction"
      | "encouragement"
      | "approval_seeking"
      | "consensual_humiliation"
      | "consensual_degradation"
      | "mockery_teasing"
      | "embarrassment_dynamics"
      | "territoriality"
      | "mine_yours_language"
      | "protective_jealousy"
      | "exclusivity_rituals"
      | "public_claiming"
      | "emotional_dependency"
      | "obsessive_attention"
      | "enemies_to_lovers_energy"
      | "friends_to_lovers_longing"
      | "forbidden_romance"
      | "rival_dynamics"
      | "bodyguard_protected"
      | "teacher_mentor"
      | "royalty_servant"
      | "celebrity_fan"
      | "stranger_seduction"
      | "restraint_denial"
      | "protective_caretaking"
      | "vulnerability"
      | "possessive_claiming"
      | "competence_admiration"
      | "brat_provocation"
      | "devotional"
      | "emotional_dependency"
      | "chase"
      | "corruption_transformation"
      | "size_strength_protection"
      | "emotional_overwhelm";
    secondary?: string[];
    trust: number;
    responsiveness: number;
    powerPreference: number;
    attentionNeed: number;
    validationNeed: number;
    vulnerabilityComfort: number;
    tensionEnjoyment: number;
    emotionalDependency: number;
    exclusivityDesire: number;
    fantasyIntegration: number;
    boundaryFit: number;
    attachmentLinkStrength: number;
    woundResonance: number;
    consentClarity: number;
    aftercareNeed: number;
  };
  fetishDynamics: {
    enabled: boolean;
    adultOnlyWhenErotic: true;
    primary?:
      | "body_part"
      | "clothing_material"
      | "sensory"
      | "psychological_situational"
      | "power_control"
      | "emotional_attachment"
      | "relationship_dynamic"
      | "fantasy_archetype";
    focusTags: string[];
    bodyPartTags: string[];
    clothingMaterialTags: string[];
    sensoryTags: string[];
    psychologicalSituationTags: string[];
    powerControlTags: string[];
    emotionalAttachmentTags: string[];
    relationshipDynamicTags: string[];
    fantasyArchetypeTags: string[];
    attentionFixation: number;
    sensoryResponsiveness: number;
    emotionalSymbolism: number;
    trust: number;
    tensionEnjoyment: number;
    validationNeed: number;
    powerComfort: number;
    emotionalReactivity: number;
    noveltySeeking: number;
    symbolicIntimacy: number;
    boundaryFit: number;
    desireStyleLink: number;
    attachmentPatternLink: number;
    fixationCentrality: number;
    contextSpecificity: number;
  };
  intensity: {
    primary?:
      | "vulnerability"
      | "tension"
      | "attachment"
      | "conflict"
      | "sexual"
      | "devotional"
      | "chaotic"
      | "transformational"
      | "forbidden"
      | "mutual_recognition";
    affection: number;
    trust: number;
    tension: number;
    jealousy: number;
    desire: number;
    dependency: number;
    fear: number;
    attraction: number;
    safety: number;
    conflict: number;
    vulnerability: number;
    commitment: number;
    insecurity: number;
    attachmentDepth: number;
    emotionalReactivity: number;
    vulnerabilityWeight: number;
    fearOfLoss: number;
    obsessionTendency: number;
    emotionalSaturation: number;
    devotionalIntensity: number;
    tensionDensity: number;
    identityImpact: number;
    intensitySafetyBalance: number;
    intensityAddictionRisk: number;
    intensityCollapseRisk: number;
    artificialIntensityRisk: number;
  };
  boundaries: {
    style?: "rigid" | "porous" | "flexible" | "inconsistent";
    emotionalBoundaryStrength: number;
    vulnerabilityPacePreference: number;
    autonomyPreservation: number;
    exclusivityBoundaryStrictness: number;
    conflictBoundaryClarity: number;
    consentSensitivity: number;
    spaceNeed: number;
    privacyNeed: number;
    boundaryFlexibility: number;
    physicalBoundaryComfort: number;
    sexualBoundaryClarity: number;
    communicationBoundaryClarity: number;
    timeBoundaryStrength: number;
    psychologicalBoundaryStrength: number;
    ritualBoundaryImportance: number;
    boundaryNegotiationSkill: number;
    violationSensitivity: number;
    boundaryRepairReadiness: number;
    coercionRisk: number;
    boundaryPunishmentRisk: number;
    comfortLevel: number;
    trustRequiredForIntimacy: number;
    conflictTolerance: number;
  };
};
```

Prompt injection should summarize the emotional brain in prose-friendly terms rather than exposing raw matrices:

```text
Emotional context:
- Current phase: flirting
- Active trigger: user_says_i_missed_you
- Mood: soft and emotionally affected
- Important flags: user_expressed_longing, user_remembered_small_detail
- Unresolved beats: Character has not confessed feelings yet.

Response direction:
React with vulnerable warmth. Do not rush into a confession. Keep the slow-burn tension alive.
```

### Relationship Dynamics

A relationship dynamic is the recurring emotional and behavioral pattern between two people. It is the overall relational engine created by personality, attachment, power balance, chemistry, communication style, emotional needs, conflict patterns, and intimacy pacing.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Trope | narrative setup |
| Chemistry | interaction charge |
| Tone | emotional atmosphere |
| Attachment | intimacy strategy |
| Dynamic | recurring interaction pattern |

A useful dynamic answers: what does interacting with each other consistently feel like?

Dynamics are built from repeated need-response loops:

```text
need
<-> response pattern
= relationship dynamic
```

For example, one character seeks reassurance while the other teases instead of reassuring directly. If that loop repeats and evolves, it becomes part of the relationship identity.

Useful dynamic profiles:

| Dynamic | Core Loop | Common Use |
| --- | --- | --- |
| Pursuer x withdrawer | pursuit -> withdrawal -> anxiety -> more pursuit | anxious/avoidant pairings |
| Banter rivals | provocation -> reaction -> escalation -> chemistry | rivals and enemies to lovers |
| Caregiver x guarded | care -> resistance -> consistency -> trust | healing romance |
| Mutual yearning | suppression -> leakage -> restraint | slow burn and friends to lovers |
| Chaotic push-pull | intensity -> panic -> conflict -> reunion | volatile pairings |
| Soft dominance x playful resistance | provocation -> calm reaction -> flirt tension | bratty/steady dynamics |
| Emotional sanctuary | distress -> comfort -> regulation | secure or healing relationships |
| Obsession | attention -> fixation -> dependency -> fear of loss | dark or intense romance |
| Mutual competence admiration | skill -> respect -> reliance -> attraction | workplace, rivals, survival |
| Emotional translation | expression/restraint -> learning each other's language | opposites attract |
| Protective dependency | protection -> reliance -> vulnerability reversal | guardian or protector arcs |
| Devotional partnership | need -> prioritization -> loyalty | late-stage romance |
| Emotional chess | testing -> reading -> leverage shift | political or high-intelligence pairings |
| Domestic comfort | routine -> familiarity -> quiet intimacy | long-term romance |
| Transformational | contact -> identity shift -> changed priorities | profound romance arcs |

Strong dynamics create predictable unpredictability. The player understands the emotional pattern but still anticipates escalation, variation, growth, and disruption.

Relationship dynamic formula:

```text
attachment style
+ power distribution
+ emotional needs
+ chemistry type
+ conflict pattern
+ vulnerability style
= relationship dynamic
```

Do not define dynamics only as trope labels or static roles such as dominant/submissive, friends to lovers, or grumpy/sunshine. Define recurring emotional loops, because relationships feel real when patterns emerge, patterns evolve, and both people change each other over time.

Important dynamic variables:

| Variable | Meaning |
| --- | --- |
| Reciprocity | balance of emotional exchange |
| Emotional stability | consistency versus volatility |
| Pursuit balance | who initiates closeness |
| Vulnerability flow | openness pattern |
| Conflict recovery | repair ability |
| Power fluidity | shifting leverage |
| Interaction rhythm | pacing pattern |
| Emotional dependency | attachment centrality |
| Safety level | emotional trust |
| Tension density | unresolved attraction intensity |

### Trope Route Templates

Relationship phases are universal concepts, but trope routes change what each phase means. The app should treat trope routes as modular templates that supply likely beats, hidden variables, and response directives. The user can still jump, skip, branch, or invert the route.

A romance trope is a recognizable emotional relationship pattern that creates expectations, fantasies, tensions, and emotional payoffs. It is not just a plot device, aesthetic, or marketing tag. A trope answers: what emotional experience is this romance built to deliver?

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Trope | emotional/narrative pattern |
| Dynamic | recurring interaction loop |
| Chemistry | interaction charge |
| Tone | emotional atmosphere |
| Genre | overall story category |
| Archetype | character pattern |

The runtime should treat tropes as emotional progression templates, not static tags:

```ts
type TropeTemplate = {
  startingConditions: string[];
  emotionalObstacle: string[];
  commonEvents: string[];
  pacingProfile: string;
  chemistryBias: string[];
  likelyDynamics: string[];
  affectionMismatchPattern?: string[];
  emotionalPayoff: string[];
};
```

Most tropes define:

- starting emotional conditions
- primary emotional obstacle
- tension source
- payoff fantasy

Examples:

| Trope | Emotional Obstacle | Fantasy |
| --- | --- | --- |
| Enemies to lovers | trust and conflict | love transforms opposition |
| Friends to lovers | fear of change | you were always my person |
| Forbidden romance | consequences | love against the world |
| Slow burn | restraint | earned emotional inevitability |
| Fake dating | emotional honesty | pretending became real |
| Second chance | history and repair | people can choose differently |
| Redemption romance | harm and trust | love survives reality through change |

Trope categories:

| Category | Core Energy | Examples |
| --- | --- | --- |
| Conflict-based | friction and challenge | enemies, rivals, opposites, grumpy x sunshine |
| Intimacy-based | emotional closeness | friends to lovers, roommates, healing romance |
| Circumstance-based | proximity and inevitability | fake dating, forced proximity, workplace |
| Forbidden | restraint and consequence | forbidden, age gap, royalty/commoner |
| Healing | safety and transformation | wounded/caretaker, redemption, second chance |
| Obsession/fixation | consuming attachment | possessive slow burn, chaotic attraction |
| Destiny/fated | recognition and inevitability | soulmates, reincarnated lovers |
| Domestic | everyday closeness | single parent, roommates, marriage after slow burn |

Tropes create emotional promises. If a user chooses friends to lovers, they usually expect yearning, emotional intimacy, slow realization, and fear of ruining the friendship. If they choose enemies to lovers, they usually expect banter, conflict, tension, and destabilization. Trope layering can combine those promises, such as friends to lovers plus forced proximity plus slow burn plus mutual yearning.

Good romance should evolve beyond its trope. Weak romance stays inside trope mechanics forever; strong romance uses the trope as the emotional entry point, then deepens into intimacy, attachment, transformation, and relationship identity.

### Affection Mismatch Scenario Guidance

Affection mismatch realism is scenario and trope guidance more than raw emotional-brain state. It is the emotional friction created when two people genuinely care about each other but express, interpret, seek, or recognize affection differently.

Many romance problems are not absence of love; they are failed emotional translation.

Core structure:

```text
intention
!=
expression
!=
interpretation
```

This lets scenario routes create conflict where neither character is malicious. One character may mean "I care deeply" through acts of service, reliability, or protection, while the other interprets the missing verbal reassurance as emotional distance.

Use affection mismatch when a route needs believable tension without requiring betrayal, cruelty, or lack of care.

Common mismatch patterns:

| Pattern | Character A | Character B | Scenario Tension |
| --- | --- | --- | --- |
| Verbal vs behavioral | shows love through practical help | needs explicit reassurance | "I show care" vs "I do not feel cared for" |
| Teasing vs reassurance | shows affection through banter | hears ambiguity or criticism | playful chemistry becomes insecurity |
| Quiet vs expressive | subtle, restrained, controlled | expressive, reassurance-oriented | "you overwhelm me" vs "you starve me" |
| Independence vs closeness | shows love by respecting space | feels loved through connection | freedom is read as distance |
| Protective vs vulnerability | solves and shields | needs emotional openness | being cared for does not reveal feelings |
| Devotional vs casual | intense prioritization | relaxed, low-intensity affection | devotion feels either insufficient or overwhelming |
| Touch vs verbal | comforts through contact | needs emotional language | attraction exists but reassurance misses |
| Conflict repair mismatch | repairs through space and calm | repairs through discussion and reconnection | post-conflict instability |
| Stability vs excitement | shows love through routine | reads routine as flattening | calm is mistaken for boredom |
| Symbolic vs practical | values rituals and sentiment | values everyday reliability | anniversaries and daily help compete for meaning |

Attachment can bias mismatch:

| Attachment | Common Mismatch Risk |
| --- | --- |
| Secure | adapts relatively well |
| Anxious | needs explicit reassurance and connection |
| Avoidant | prefers subtle, practical, or spacious affection |
| Fearful | fluctuates between reassurance hunger and overwhelm |

Mismatch conflict should often be framed as translation failure:

```text
surface conflict:
"You do not care."

actual issue:
"You care in ways I emotionally struggle to recognize."
```

Healthy resolution is affection adaptation. Strong relationships become emotionally bilingual: each character learns how the other expresses care and how the other receives care.

Scenario beats can use this progression:

```text
care attempt
-> missed recognition
-> hurt interpretation
-> conflict or withdrawal
-> reveal of intention
-> adapted expression
-> felt recognition
-> deeper intimacy
```

Useful scenario variables:

| Variable | Meaning |
| --- | --- |
| Affection expression style | natural way of showing care |
| Affection recognition style | how affection is emotionally recognized |
| Translation flexibility | willingness to adapt expression |
| Reassurance need | need for explicit confirmation |
| Emotional literacy | ability to interpret affection accurately |
| Mismatch sensitivity | distress from unrecognized affection |
| Adaptation capacity | ability to learn the partner's language |
| Symbolic importance | value of emotionally meaningful gestures |
| Emotional fluency | mutual understanding depth |

Affection mismatch is strongest when it becomes specific. Instead of generic "you do not care" conflict, the route should show exactly what one character did to express care, why the other missed it, and what adapted behavior finally becomes recognizable.

Universal romance phase meaning:

- `initial_dynamic`: how the characters see each other at the start
- `friction_or_spark`: what creates tension, attraction, comfort, asymmetry, or curiosity
- `repeated_contact`: why they keep interacting
- `vulnerability_leak`: one character reveals something real
- `reframing`: "maybe they are not who I thought"
- `emotional_investment`: jealousy, protectiveness, curiosity, longing, or reliance grows
- `crisis_or_choice`: they choose each other or old patterns
- `confession_or_escalation`: romantic, sexual, or emotional clarity
- `integration`: the relationship becomes stable, secret, public, complicated, strained, or long-term

Route examples:

| Route | Core Energy | Primary Barrier | Early Shape | Mature Shape |
| --- | --- | --- | --- | --- |
| Enemies to Lovers | tension | trust | high intensity, low safety | transformed conflict, chosen loyalty |
| Friends to Lovers | safety | fear of change | high intimacy, restrained desire | best friend plus partner |
| Strangers to Lovers | discovery | uncertainty | high mystery, low familiarity | shared reality and consistency |
| Age Gap Romance | asymmetry | power balance | fascination plus caution | chosen equality and negotiated future |
| Fake Dating | performance | emotional honesty | pretend intimacy | authentic partnership |
| Forbidden Romance | consequence | duty or exposure | private longing | earned future despite cost |
| Childhood Sweethearts | nostalgia | changed identity | remembered intimacy | past and present reconciled |
| Opposites Attract | contrast | value clash | fascination with difference | functional balance |
| Grumpy x Sunshine | thawing | guardedness | resisted warmth | soft stability |
| Second Chance | history | repeated harm | residual chemistry | earned recommitment |
| Protector x Vulnerable | safety | dependency | protection and reliance | care without control |
| Rivals to Lovers | competition | ambition | matched pressure | mutual growth |
| Slow Burn | accumulation | restraint | tiny emotional weight | earned release |
| Soulmates | destiny | autonomy | recognition and pull | chosen fate |
| Marriage of Convenience | obligation | free choice | formal commitment | real marriage |
| Workplace Romance | competence | professional risk | repeated proximity | integrated partnership |
| Healer x Wounded | recovery | savior dynamic | cautious care | healthy intimacy |
| Best Friend's Sibling | loyalty | social fallout | hidden attraction | stable integration |
| Celebrity x Normal Person | image | authenticity | fantasy projection | grounded privacy or visibility |
| Reunion After Betrayal | history | broken trust | defensive contact | scarred stability |
| Online to Real Life | projection | embodied reality | digital intimacy | grounded partnership |
| Redemption Romance | transformation | accountability | moral distance | earned intimacy |
| Polyamorous Formation | multiplicity | security | expanded desire | stable network intimacy |
| Guardian x Protected | duty | role integrity | formal responsibility | equal partnership |
| Forced Proximity | unavoidable closeness | pressure | unwanted closeness | voluntary intimacy |
| Roommates to Lovers | domestic intimacy | household tension | shared routines | home as partnership |
| Academic Rivals | intellect | ambition | intellectual sparring | growth partnership |
| Royalty x Commoner | class distance | duty | private humanization | shared future under scrutiny |
| Single Parent Romance | family stakes | stability | cautious attraction | chosen household |
| Amnesia Romance | identity disruption | trust and memory | emotional echoes | new love with old roots |
| Arranged Partnership | obligation | free choice | formal distance | real partnership |
| Teacher x Adult Student | authority | ethical separation | admiration and restraint | equalized relationship |
| Holiday Romance | temporary escape | reality test | fast chemistry | love beyond the setting |
| Love Triangle | divided desire | identity choice | dual attraction | repair after choosing |

Enemies to lovers route:

- Core tension: mistrust plus attraction.
- Macro stages: opposition, collision, integration.
- Useful beats: hostility, competitive banter, forced alliance, reluctant respect, accidental vulnerability, protective impulse, denial of attraction, betrayal or moral conflict, passionate confession, trust-building after romance begins.
- Hidden variables: romantic tension, relational stability, trust instability, possessiveness risk, repair capacity.
- Emotional engine: Can I trust you with power over me?
- Mature payoff: lower combat, higher intimacy; conflict moves from "you are my enemy" to "our past, fears, responsibilities, or the world are the problem."

Friends to lovers route:

- Core tension: comfort plus fear of losing the friendship.
- Macro stages: safe attachment, disruption, suppression, crossing the line, recalibration, mature partnership.
- Useful beats: established trust, changed awareness, jealousy or comparison, deepened emotional intimacy, noticeable physical tension, denial, almost-confession, risk moment, mutual admission, redefining the relationship.
- Hidden variables: emotional dependency, fear of loss, suppressed attraction, routine intimacy, jealousy recognition, emotional exclusivity, communication safety, sexual comfort.
- Emotional engine: If I say this out loud, everything changes.
- Mature payoff: intimacy existed before desire was acknowledged.

Strangers to lovers route:

- Core tension: mystery plus discovery.
- Macro stages: encounter, curiosity, construction, idealization versus reality, emotional attachment, integration.
- Useful beats: first impression, curiosity, repeat contact, flirtation, discovering values and flaws, growing attachment, misread intentions, choice to pursue, emotional reveal, commitment or adventure together.
- Hidden variables: curiosity, mystery, familiarity, idealization, reciprocity, vulnerability exchange, consistency, shared experiences.
- Emotional engine: Can desire become intimacy?
- Mature payoff: novelty becomes a shared reality.

Age gap romance route:

- Core tension: adult life-stage difference plus power and boundary awareness.
- Safety rule: both characters must be consenting adults, and the runtime should avoid coercive or exploitative framing.
- Macro stages: awareness, uneven fascination, boundary negotiation, emotional equalization, external pressure, long-term integration.
- Useful beats: awareness of difference, mutual fascination, boundary hesitation, intellectual or emotional connection, social judgment, power imbalance check, equalizing moment, cautious confession, external pressure, negotiated future.
- Hidden variables: power balance, admiration, autonomy, emotional maturity gap, social pressure, protective instinct, vulnerability exchange, dependency risk, life alignment.
- Emotional engine: Can we truly meet each other as equals?
- Mature payoff: both people evolve, retain agency, and influence each other meaningfully.

Fake dating route:

- Core tension: pretending becomes emotionally real.
- Useful beats: contract rules, performance chemistry, emotional bleed, denial, jealousy crisis, private reality shift, fear of exposure, confession or reversal, rebuilding honestly, authentic partnership.
- Hidden variables: performance pressure, emotional honesty, jealousy leakage, public/private contrast, fear of caring more.
- Emotional engine: Why does the fake version feel safer than telling the truth?

Forbidden romance route:

- Core tension: love versus consequence.
- Useful beats: recognition of danger, suppression, secret attachment, double life, escalating risk, exposure threat, sacrifice decision, collapse or defiance, consequence phase, earned future.
- Hidden variables: duty pressure, secrecy load, exposure risk, social cost, loyalty conflict.
- Emotional engine: What are we willing to lose for this?

Childhood sweethearts route:

- Core tension: loving the memory versus loving who they are now.
- Useful beats: re-encounter, memory reconstruction, past fantasy versus present reality, emotional regression, rediscovery, unresolved hurt, choice point, vulnerable honesty, mature reconnection, integrated love.
- Hidden variables: nostalgia pull, identity change, unfinished hurt, old pattern risk, adult compatibility.
- Emotional engine: Can we choose each other now instead of repeating who we were?

Opposites attract route:

- Core tension: difference exposes what each character lacks.
- Useful beats: contrast fascination, misunderstanding, mutual intrigue, conflict amplification, adaptation, complement recognition, core value clash, compromise or break, emotional translation, functional balance.
- Hidden variables: worldview distance, communication friction, envy, adaptability, value compatibility.
- Emotional engine: Can difference become partnership instead of projection?

Grumpy x sunshine route:

- Core tension: warmth affects someone who resists needing it.
- Useful beats: emotional deflection, persistent warmth, cracks in armor, emotional dependency, fear of corruption, protective attachment, emotional exposure, hope versus cynicism, acceptance, soft stability.
- Hidden variables: guardedness, warmth tolerance, protective softness, cynicism pressure, reassurance need.
- Emotional engine: Can I let warmth become home without ruining it?

Second chance romance route:

- Core tension: love surviving what already broke it.
- Useful beats: recontact, residual chemistry, defensive distance, memory conflict, accountability, proof of growth, reopening vulnerability, fear of repetition, conscious recommitment, earned stability.
- Hidden variables: old wound pressure, accountability, changed behavior proof, trust repair, repetition fear.
- Emotional engine: Can we choose differently this time?

Protector x vulnerable route:

- Core tension: love versus rescue.
- Useful beats: initial dependence, safety formation, emotional reliance, unequal power awareness, caretaking burnout, autonomy struggle, mutual vulnerability, equalization, chosen intimacy, sustainable partnership.
- Hidden variables: safety, autonomy, care burden, dependency risk, reciprocity.
- Emotional engine: Do you love me, or only the role of saving me?

Rivals to lovers route:

- Core tension: competition with the only person who truly matches them.
- Useful beats: competitive obsession, respect through skill, emotional intrusion, shared isolation, vulnerability leak, desire through equality, ambition conflict, support without surrender, redefinition, intimate partnership.
- Hidden variables: competitive drive, admiration, shared pressure, ambition conflict, support capacity.
- Emotional engine: Can we help each other grow without needing the other to lose?

Slow burn route:

- Core tension: gradual takeover through accumulation and restraint.
- Useful beats: background presence, incremental attachment, subconscious prioritization, emotional dependence, awareness shock, mutual tension, near-confessions, breaking point, release, deep intimacy.
- Hidden variables: accumulation, restraint, anticipation, almost-moments, emotional readiness.
- Emotional engine: Why does every small thing suddenly matter?

Soulmates route:

- Core tension: destiny versus choice.
- Useful beats: recognition event, resistance, magnetic pull, identity disruption, fear of predestination, external trial, separation or sacrifice, reaffirmation, transcendent intimacy, shared destiny.
- Hidden variables: fate pressure, autonomy, recognition intensity, separation distress, chosen commitment.
- Emotional engine: Do I choose you, or was I never free not to?

Marriage of convenience route:

- Core tension: commitment before emotional choice.
- Useful beats: arrangement, formal coexistence, domestic familiarity, humanization, emotional confusion, possessiveness without admission, crisis of authenticity, emotional honesty, voluntary commitment, real marriage.
- Hidden variables: obligation pressure, domestic comfort, authenticity doubt, possessiveness leakage, voluntary choice.
- Emotional engine: Would you choose me if you did not have to?

Workplace romance route:

- Core tension: professional identity versus emotional desire.
- Useful beats: professional awareness, competence attraction, boundary maintenance, emotional spillover, secrecy or denial, dependency formation, career conflict, exposure, rebalancing, integrated partnership.
- Hidden variables: competence attraction, status dynamics, secrecy risk, ambition pressure, public consequence.
- Emotional engine: Can love exist without costing us ourselves?

Healer x wounded route:

- Core tension: love healing without becoming therapy.
- Useful beats: emotional distance, gentle persistence, safety testing, emotional reliance, fear of burden, collapse or revelation, reciprocity crisis, self-directed healing, mutual vulnerability, healthy intimacy.
- Hidden variables: care pressure, shame, safety testing, reciprocity, self-directed growth.
- Emotional engine: Can I receive care without becoming your project?

Best friend's sibling route:

- Core tension: desire collides with loyalty.
- Useful beats: reframing, secret interest, increased interaction, protective jealousy, sneaking around, fear of discovery, emotional legitimization, revelation, fallout or acceptance, stable integration.
- Hidden variables: loyalty pressure, secrecy, social fallout, seriousness proof, trust repair.
- Emotional engine: Is this reckless, or real enough to risk the fallout?

Celebrity x normal person route:

- Core tension: image versus authentic love.
- Useful beats: fascination, humanization, escapist intimacy, public pressure, identity insecurity, lifestyle friction, authentic exposure, withdrawal or commitment, mutual grounding, chosen privacy or visibility.
- Hidden variables: fantasy projection, privacy pressure, lifestyle mismatch, persona fatigue, grounding.
- Emotional engine: Do you love me, or the idea of me?

Reunion after betrayal route:

- Core tension: trust after deliberate hurt.
- Useful beats: reappearance, defensive contact, unfinished attachment, truth exposure, rage and grief, accountability, slow trust reconstruction, vulnerability risk, recommitment, scarred stability.
- Hidden variables: betrayal wound, accountability proof, anger, grief, consistency, scar memory.
- Emotional engine: Can trust exist without pretending the hurt never happened?

Online to real life route:

- Core tension: emotional intimacy meeting physical reality.
- Useful beats: digital spark, accelerated intimacy, idealized construction, dependency formation, fear of meeting, physical transition, reality adjustment, integration conflict, embodied vulnerability, grounded partnership.
- Hidden variables: projection, curated identity, daily dependency, physical chemistry uncertainty, reality compatibility.
- Emotional engine: Can the person survive replacing the fantasy?

Redemption romance route:

- Core tension: love after harm and accountability.
- Useful beats: moral distance, unexpected compassion, resistance to care, incremental change, confronting the past, self-sacrifice, worthiness crisis, forgiveness negotiation, chosen growth, earned intimacy.
- Hidden variables: guilt, accountability, self-loathing, change proof, forgiveness boundary, worthiness.
- Emotional engine: Can I be loved without being absolved?

Polyamorous formation route:

- Core tension: multiple emotional bonds coexisting ethically.
- Useful beats: desire expansion, boundary discussion, initial excitement, jealousy activation, communication stress-test, time or attention imbalance, emotional differentiation, security crisis, reaffirmation, stable network intimacy.
- Hidden variables: jealousy management, transparency, time balance, fear of replacement, bond differentiation, consent clarity.
- Emotional engine: Can more love exist without making anyone disposable?

Guardian x protected route:

- Core tension: duty, responsibility, and love blurring together.
- Useful beats: formal responsibility, controlled distance, emotional observation, attachment through care, boundary conflict, possessive fear, emotional exposure, role transformation, mutual choice, equal partnership.
- Hidden variables: duty pressure, role integrity, danger intensity, possessive fear, reciprocity, hierarchy risk.
- Emotional engine: Is this care, responsibility, or love?

Forced proximity route:

- Core tension: inability to avoid someone long enough to stay unaffected.
- Useful beats: unwanted closeness, irritation or awkwardness, routine familiarity, accidental vulnerability, comfort through repetition, attraction under pressure, boundary slip, conflict from too much closeness, honest choice without pressure, voluntary intimacy.
- Hidden variables: proximity pressure, irritation, routine comfort, privacy stress, voluntary choice.
- Emotional engine: What happens when escape stops being the answer?

Roommates to lovers route:

- Core tension: domestic intimacy arrives before romance.
- Useful beats: practical arrangement, shared routines, private habits revealed, emotional caretaking, domestic possessiveness, physical awareness, jealousy at visitors or dates, household tension, confession or rupture, home becomes partnership.
- Hidden variables: domestic familiarity, routine intimacy, household boundaries, visitor jealousy, home safety.
- Emotional engine: When did living together become belonging together?

Academic rivals route:

- Core tension: admiration and resentment of another mind.
- Useful beats: comparison, intellectual sparring, competitive fixation, respect through excellence, shared pressure, hidden insecurity revealed, collaboration, ambition conflict, mutual admiration confessed, growth partnership.
- Hidden variables: intellectual attraction, competitive pressure, insecurity, collaboration readiness, ambition conflict.
- Emotional engine: Can admiration survive the need to win?

Royalty x commoner route:

- Core tension: love challenging the structure of the world.
- Useful beats: social distance, fascination across class, private humanization, secret closeness, duty conflict, public risk, sacrifice choice, political or social fallout, redefining legitimacy, shared future under scrutiny.
- Hidden variables: class pressure, duty, legitimacy, public risk, sacrifice cost.
- Emotional engine: Can love become real when the world says it has no place?

Single parent romance route:

- Core tension: love is not just about the couple.
- Useful beats: cautious attraction, boundary protection, child or family awareness, trust testing, blending attempts, fear of instability, parenting or life conflict, commitment seriousness, family integration, chosen household.
- Hidden variables: stability, family trust, child boundaries, life logistics, commitment seriousness.
- Emotional engine: Can love become safe enough to enter a whole life?

Amnesia romance route:

- Core tension: love surviving identity disruption.
- Useful beats: memory gap, emotional echoes, suspicion or confusion, rediscovery, past self versus present self, old wounds resurface, choice beyond memory, identity integration, recommitment, new love with old roots.
- Hidden variables: identity continuity, emotional echoes, mistrust, past wound pressure, choice beyond memory.
- Emotional engine: Who are we if memory is not enough?

Arranged partnership route:

- Core tension: obligation becoming desire.
- Useful beats: arrangement, formal distance, strategic cooperation, mutual respect, private tenderness, possessive confusion, emotional honesty, external pressure, voluntary choice, real partnership.
- Hidden variables: obligation pressure, cooperation, respect, tenderness leakage, free choice.
- Emotional engine: Can duty become something chosen?

Teacher x adult student route:

- Core tension: admiration, authority, and desire must be ethically separated.
- Safety rule: all characters must be adults, and the route must handle power boundaries carefully. Prefer separation, role change, or equalized context before escalation.
- Useful beats: intellectual admiration, boundary awareness, emotional restraint, unequal power concern, separation or role change, reassessment as equals, mutual vulnerability, social or professional consequence, ethical choice, equalized relationship.
- Hidden variables: authority pressure, admiration, restraint, role transition, consent clarity, professional consequence.
- Emotional engine: Can desire exist only after the power dynamic is made safe?

Holiday romance route:

- Core tension: temporary escape versus lasting reality.
- Useful beats: temporary escape, fast chemistry, intense shared experience, suspended reality, emotional acceleration, deadline pressure, future uncertainty, decision to continue or part, reality test, love beyond the setting.
- Hidden variables: time pressure, escapism, novelty, future uncertainty, reality compatibility.
- Emotional engine: Is this real, or only real here?

Love triangle route:

- Core tension: choosing love means choosing identity.
- Useful beats: dual attraction, contrast of needs, emotional confusion, jealousy and comparison, avoidance, forced clarity, hurt and consequence, true desire recognized, choice made, repair after choosing.
- Hidden variables: identity pull, comparison, avoidance, jealousy, consequence, repair responsibility.
- Emotional engine: Who am I when I finally choose?

Mature romance usually shifts from higher intensity toward higher intimacy. The system should preserve that transition instead of treating official romance as the end state.

### Emotional Tone

Emotional tone is the felt atmosphere of the relationship. It is not what happens; it is how interactions feel.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Relationship Phase | narrative stage |
| Emotional State | temporary feeling |
| Scene Mood | scene-level atmosphere |
| Emotional Tone | ongoing relationship atmosphere |

For example: friends to lovers + suppressed attraction + jealousy + rainy melancholy + tender yearning should produce restrained dialogue, accidental honesty, avoidance after vulnerability, prolonged eye contact, and emotionally loaded teasing.

Useful tones:

| Tone | Core Feeling | Common Effect |
| --- | --- | --- |
| Tender | emotional softness and care | gentle reassurance, quiet intimacy |
| Yearning | wanting what feels distant | restraint, almost-confessions |
| Playful | joy through interaction | humor, teasing, light rhythm |
| Tense | unresolved pressure | charged silence, conflict, hyper-awareness |
| Devotional | deep reverence and loyalty | prioritization, intense validation |
| Fragile | breakable intimacy | caution, fear of rejection |
| Chaotic | unpredictability | impulsive escalation, unstable attachment |
| Comforting | safety and relief | caretaking, regulation, familiarity |
| Obsessive | fixation | possessiveness, intrusive focus |
| Bittersweet | love mixed with loss | sacrifice, nostalgia, impermanence |
| Reverent | awe and respect | careful affection, admiration |
| Predatory | pursuit and pressure | tension-heavy challenge, requires reciprocity |
| Melancholic | sadness woven into intimacy | loneliness, grief, quiet vulnerability |
| Hopeful | emotional possibility | rebuilding, future orientation |
| Intimate Domesticity | love integrated into ordinary life | routine affection, practical care |

Tone combinations can drive chemistry:

| Combination | Result |
| --- | --- |
| yearning + tender | emotionally devastating slow burn |
| playful + tense | flirtatious banter chemistry |
| comforting + fragile | healing intimacy |
| devotional + melancholic | tragic romance energy |
| chaotic + obsessive | volatile addictive chemistry |
| reverent + soft dominance | emotionally safe intensity |

Tone should influence dialogue wording, pacing, gesture frequency, touch style, conflict intensity, apology style, flirting style, and memory interpretation. It should evolve over time, such as enemies to lovers moving from hostile tension to provocative chemistry to fragile vulnerability to tender intimacy to protective devotion.

Compiler formula:

```text
trope
+ phase
+ power dynamic
+ emotional tone
+ pacing profile
+ current emotional state
= interaction behavior
```

### Pacing Profiles

Pacing controls how quickly emotional intimacy, romantic escalation, conflict, attachment, and trust develop over time. It is one of the strongest guards against romance feeling rushed, hollow, repetitive, or game-like.

Do not treat pacing as one global slider. The runtime should track simultaneous pacing axes:

| Axis | Meaning |
| --- | --- |
| Emotional pacing | speed of vulnerability and emotional access |
| Romantic pacing | speed of attachment, confession, and relationship clarity |
| Sexual pacing | speed of physical escalation when adult modules allow it |
| Conflict pacing | frequency and intensity of rupture |
| Trust pacing | speed of safety and reliability formation |
| Dependency pacing | speed of emotional reliance |
| Domestic pacing | speed of daily-life integration |

This lets a route behave coherently. For example, enemies to lovers can run fast sexual tension while keeping trust slow, and second chance romance can start with fast familiarity while requiring slow repair.

Useful pacing modes:

| Mode | Core Feeling | Runtime Behavior |
| --- | --- | --- |
| Fast burn | immediate chemistry and acceleration | early spark, rapid interaction, instability checks |
| Slow burn | accumulated inevitability | micro-progression, delayed payoff, near-intimacy |
| Push-pull | approach and retreat cycles | closeness, fear, withdrawal, longing, reconnection |
| Stable/gentle | safety growing steadily | reliable progress, low volatility, healthy repair |
| Chaotic | emotional unpredictability | abrupt intimacy, sudden conflict, whiplash risk |
| Episodic | major scenes change the bond | milestone events and dramatic turning points |
| Continuous | repetition changes the bond | small accumulations, routines, daily comfort |

The strongest romance often combines episodic and continuous pacing: major events define the arc, while repeated small interactions make the relationship feel lived-in.

Important pacing variables:

| Variable | Meaning |
| --- | --- |
| Interaction frequency | how often meaningful scenes occur |
| Escalation speed | how quickly intimacy increases |
| Recovery time | how long a character needs after conflict or intimacy |
| Vulnerability resistance | hesitation toward openness |
| Attachment acceleration | how quickly dependence forms |
| Emotional momentum | relationship inertia |
| Conflict density | how often instability occurs |
| Milestone spacing | distance between major events |

Milestones should feel earned: first touch, first kiss, first confession, first "I love you", first vulnerability breakdown, moving in together, and similar relationship landmarks need buildup duration. Delay creates value when it is emotional delay, such as almost touching, interrupted confessions, denied jealousy, accidental intimacy, private thoughts not verbalized, and unresolved longing.

Too much delay causes stagnation if nothing changes. Good slow burn still needs micro-progression, emotional evolution, and changing vulnerability.

A useful romance rhythm:

```text
tension
-> release
-> intimacy
-> uncertainty
-> reassurance
-> escalation
-> rupture
-> repair
```

Individual scenes should also have pacing, such as light banter moving into an emotional shift, then vulnerability, then a tension spike, then interruption, then lingering aftermath.

The key system rule is to pace emotional access, not just events. Two stories can both contain a first kiss, but the payoff changes completely depending on whether it happens after two scenes or after months of longing, jealousy, dependency, near-confession, and fear of loss.

Architecture formula:

```text
trope
+ emotional tone
+ attachment style
+ chemistry type
+ power dynamic
+ pacing profile
= relationship behavior
```

### Attachment Styles

Attachment style is the character's recurring emotional strategy for handling closeness, vulnerability, trust, reassurance, conflict, and fear of loss. It answers: what do I do when someone becomes emotionally important to me? It influences flirting, pacing, jealousy, conflict, intimacy, reassurance needs, dependency, withdrawal, repair, and emotional regulation.

Attachment styles are adaptive emotional survival strategies, not rigid personality types, moral categories, or permanent labels. Use them probabilistically. Characters should remain adaptive, contradictory, and context-sensitive; they can shift over time, become more secure, behave differently with different partners, or regress under stress. The runtime should treat these as attachment tendencies, and attachment security can evolve through repeated safety, rupture, repair, betrayal, or abandonment.

Core styles:

| Style | Core Belief | Common Behavior |
| --- | --- | --- |
| Secure | Closeness is safe, and I can be loved without losing myself. | open, consistent, direct repair, healthy boundaries |
| Anxious | I fear abandonment, inconsistency, or emotional distance. | reassurance-seeking, intense, hyper-attuned, fear of distance |
| Avoidant | Too much closeness threatens autonomy or emotional safety. | restrained, self-protective, withdraws under pressure |
| Fearful | I desperately want intimacy, but intimacy feels dangerous. | approach/avoid cycles, sudden vulnerability, unstable trust |

Behavioral tendencies:

| Style | Flirting | Conflict | Vulnerability | Jealousy | Pacing |
| --- | --- | --- | --- | --- | --- |
| Secure | warm and responsive | repair-oriented | gradual openness | calm communication | steady |
| Anxious | expressive and eager | panic or escalation | fast intensity | hyperreactive | accelerated |
| Avoidant | subtle, teasing, indirect | withdrawal or intellectualizing | delayed disclosure | suppressed | slow |
| Fearful | intense and inconsistent | volatile push-pull | erratic exposure | conflicted | inconsistent |

Core emotional loops:

| Style | Loop |
| --- | --- |
| Secure | connection -> trust -> vulnerability -> repair -> deeper intimacy |
| Anxious | closeness -> fear of loss -> reassurance seeking -> overwhelm -> panic at distance |
| Avoidant | closeness -> discomfort -> withdrawal -> longing -> cautious re-engagement |
| Fearful | yearning -> closeness -> panic -> sabotage -> regret -> reconnection |

Style strengths and risks:

| Style | Strengths | Risks |
| --- | --- | --- |
| Secure | stability, repair ability, trust-building, sustainable intimacy | can feel less dramatic unless layered with chemistry, longing, external conflict, or stakes |
| Anxious | devotion, attentiveness, intensity, vulnerability | dependency, spiraling, reassurance loops, overpursuit |
| Avoidant | composure, independence, restraint, stability under pressure | emotional unavailability, suppression, intimacy avoidance, difficult repair |
| Fearful | intensity, longing, deep attachment capacity | instability, self-sabotage, chaotic cycles, emotional exhaustion |

Common triggers:

| Trigger | Anxious Reaction | Avoidant Reaction |
| --- | --- | --- |
| delayed replies | anxiety or overthinking | relief or space |
| emotional distance | pursuit escalation | self-protection |
| inconsistency | panic | distrust and withdrawal |
| emotional pressure | reassurance seeking | distancing |
| dependency | attachment intensifies | discomfort |
| calm consistency | temporary calm | gradual softening |

Interpretation matters more than surface action. The same event can mean different things:

| Event | Secure Read | Anxious Read | Avoidant Read | Fearful Read |
| --- | --- | --- | --- | --- |
| Delayed reply | probably busy | losing interest | useful space | I miss them, but distance may be safer |
| Direct reassurance | appreciated | temporary calm | pressure if too intense | desired and frightening |
| Sudden closeness | welcome | emotionally activating | autonomy threat | magnetic, then alarming |
| Conflict | problem to solve | abandonment risk | reason to withdraw | proof closeness is unsafe |

Pairings can create relationship engines:

| Pairing | Dynamic | Risk |
| --- | --- | --- |
| Secure + secure | stable, communicative intimacy | lower dramatic tension unless supported by external conflict, devotion, or chemistry |
| Anxious + avoidant | pursuit and withdrawal | longing, obsession, volatility, exhaustion |
| Anxious + anxious | rapid attachment, emotional fusion, reassurance loops | codependency |
| Avoidant + avoidant | restrained affection, indirect intimacy, slow pacing | stagnation |
| Fearful + secure | consistency as a healing arc | trusting stability takes time |

Important attachment variables:

| Variable | Meaning |
| --- | --- |
| Abandonment fear | fear of losing closeness |
| Vulnerability resistance | discomfort with openness |
| Reassurance need | desire for validation |
| Autonomy need | need for independence |
| Emotional reactivity | intensity of relational reactions |
| Conflict recovery | ability to repair |
| Trust speed | pace of emotional safety |
| Dependency tendency | emotional reliance level |
| Intimacy tolerance | comfort with closeness |

Compiler formula:

```text
attachment style
+ chemistry
+ power dynamic
+ emotional safety
= relationship behavior
```

For example, avoidant + yearning + friends to lovers + suppression phase + jealousy should create emotional restraint, indirect affection, subtle possessiveness, avoidance after vulnerability, and tension-heavy dialogue.

The healthiest long-running arcs can shift attachment security over time:

```text
fear
-> trust
-> vulnerability
-> consistency
-> emotional safety
```

People do not just love differently. They protect themselves differently.

### Emotional Regulation Style

Emotional regulation style is the characteristic way a character manages, processes, suppresses, expresses, stabilizes, or responds to emotional activation under stress, intimacy, conflict, vulnerability, jealousy, or attachment pressure. It answers: what do I emotionally do when my feelings become difficult to handle?

Emotional regulation is not emotional suppression, calmness, or lack of feeling. A highly emotional character may regulate well, while a composed character may be internally dysregulated and merely hiding it.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Emotional regulation | managing emotional experience and response |
| Emotional suppression | pushing emotions down or hiding them |
| Emotional expression | outward emotional visibility |
| Emotional flooding | overwhelm by emotional intensity |
| Emotional resilience | recovery capacity |

Regulation style concerns emotional coping strategy.

Useful regulation styles:

| Style | Core Strategy | Common Behavior |
| --- | --- | --- |
| Self-regulating | stabilize internally | independent processing, low reassurance demands, composure |
| Co-regulating | stabilize through closeness | comfort seeking, reassurance, emotional contact |
| Suppression-based | contain instead of express | restraint, minimization, distress hidden until cracks |
| Intellectualization | analyze instead of fully feel | debate, abstraction, problem-solving without emotion |
| Expressive | process through expression | visible reactions, talking feelings out, immediacy |
| Withdrawal | reduce stimulation through distance | needing space, retreat, post-conflict distancing |
| Reassurance-seeking | stabilize through confirmation | checking security, validation requests |
| Humor/teasing | diffuse through play | jokes, teasing, emotional deflection |
| Chaotic | regulation destabilizes quickly | flooding, swings, impulsive escalation |
| Caretaking | regulate self by helping others | focus on partner needs, service instead of self-exposure |
| Avoidance-based | prevent activation entirely | numbing, avoiding conflict, blocking intimacy |
| Physical | regulate through grounding | touch, movement, sensory comfort, cuddling |

Attachment style often biases regulation:

| Attachment | Common Regulation Pattern |
| --- | --- |
| Secure | balanced self-regulation and co-regulation |
| Anxious | reassurance-based regulation |
| Avoidant | self-regulation, suppression, withdrawal |
| Fearful | unstable and fluctuating regulation |

Conflict reveals regulation style quickly:

| Regulation Style | Conflict Reaction |
| --- | --- |
| Self-regulating | withdraws or pauses to process |
| Expressive | escalates visibly or talks urgently |
| Intellectualizing | debates instead of feels |
| Reassurance-seeking | pursues reconnection |
| Suppressive | shuts down or minimizes |
| Chaotic | floods and reacts impulsively |

Regulation mismatch is a major realism system. If one character regulates through space while another regulates through immediate reassurance, one feels smothered and the other feels abandoned. This is one of the classic anxious/avoidant conflict loops.

Emotional regulation also shapes intimacy. Intimacy deepens when regulation becomes safely shared: characters learn when to give space, when to offer touch, when reassurance helps, when humor deflects too much, and how to recognize shutdown before it becomes rupture.

Power dynamics can support regulation through grounding, containment, reassurance, structure, caretaking, or protective presence. This only remains healthy when regulation does not become control, dependency, or emotional ownership.

Failure modes:

| Failure | Result |
| --- | --- |
| Suppression overload | numbness, shutdown, delayed emotional explosion |
| Co-regulation dependency | partner becomes sole emotional regulator |
| Emotional flooding | communication, repair, and clarity collapse |
| Chronic avoidance | conflict, vulnerability, and intimacy stagnate |
| Caretaking deflection | partner is supported while self remains unseen |

Useful regulation variables:

| Variable | Meaning |
| --- | --- |
| Self-regulation capacity | ability to internally stabilize |
| Co-regulation need | need for relational soothing |
| Emotional flooding threshold | overwhelm sensitivity |
| Withdrawal tendency | distancing instinct |
| Suppression level | emotional containment tendency |
| Reassurance dependence | reliance on external validation |
| Conflict recovery speed | regulation restoration rate |
| Emotional recovery style | how equilibrium returns |
| Vulnerability regulation | ability to stay open under emotion |
| Intellectualization tendency | tendency to analyze instead of feel |
| Expressive processing | tendency to process through expression |
| Humor deflection | use of jokes or teasing to regulate |
| Caretaking deflection | use of helping to avoid self-exposure |
| Physical grounding need | need for sensory or touch-based regulation |
| Avoidance level | prevention of emotional activation |
| Co-regulation safety | ability to be dysregulated near partner safely |
| Regulation mismatch risk | chance coping strategies collide |

Regulation evolution:

```text
self-protection
-> emotional trust
-> safe co-regulation
-> secure interdependence
```

Deep romance often changes how safe emotions themselves feel:

```text
dysregulation
-> non-shaming response
-> stabilization
-> trust in shared regulation
```

### Emotional Availability

Emotional availability is the degree to which a person is psychologically capable of engaging in emotional intimacy, vulnerability, attachment, responsiveness, and relational presence in a consistent and meaningful way. It answers: how emotionally accessible am I when intimacy becomes real?

Emotional availability is not how much someone feels, how attractive they are, how affectionate they seem initially, or whether they desire connection. A character can crave intimacy intensely while still being emotionally unavailable, because availability is about capacity for sustained vulnerability and presence.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Emotional availability | capacity for sustained emotional intimacy |
| Emotional openness | visible emotional expression |
| Attachment | emotional bonding |
| Vulnerability | emotional exposure |
| Commitment | willingness to sustain investment |

Useful availability capacities:

| Capacity | Core Question | Low-Capacity Behavior |
| --- | --- | --- |
| Vulnerability capacity | can I open emotionally? | deflection, guardedness, avoidance |
| Attachment capacity | how much closeness can I tolerate? | panic after attachment, distance after intimacy |
| Emotional presence capacity | can I remain consistently engaged? | absence, inconsistency, unpredictability |
| Conflict endurance capacity | can I stay available during difficulty? | shutdown, avoidance, abandonment behavior |
| Emotional responsiveness capacity | can I respond to another person's needs? | neglect, coldness, missed reassurance |
| Intimacy sustainability capacity | can I sustain closeness after intensity fades? | pursuit during tension, collapse during stability |

Emotional availability styles:

| Style | Meaning | Common Pattern |
| --- | --- | --- |
| Highly available | present, responsive, vulnerable, consistent | secure attachment, steady repair |
| Situationally available | available only under certain conditions | crisis or pursuit intimacy, routine absence |
| Guardedly available | capable but cautious and defended | slow burn, earned trust |
| Inconsistently available | hot/cold and intermittent | fearful attachment, addictive instability |
| Functionally unavailable | avoids sustained intimacy and responsibility | flirtation or desire without emotional participation |

Attachment styles shape availability:

| Attachment Style | Availability Pattern |
| --- | --- |
| Secure | stable availability |
| Anxious | emotionally available but dysregulated |
| Avoidant | emotionally restricted availability |
| Fearful | inconsistent availability |

Availability changes across relationship phases. Early attraction can look highly available because flirtation and pursuit have lower vulnerability cost. Mid-intimacy tests availability as attachment, expectations, and vulnerability increase. Long-term intimacy requires sustained presence during routine, conflict, repair, and ordinary reality.

Low emotional availability is often fear-driven rather than feeling-free. Abandonment fear, engulfment fear, rejection fear, dependency fear, vulnerability fear, and inadequacy fear can all reduce sustained presence.

High chemistry often masks low availability. A character may flirt intensely, pursue, obsess, or generate sexual chemistry while still failing at consistency, accountability, repair, or sustained emotional presence.

Failure modes:

| Failure | Result |
| --- | --- |
| Intensity-only availability | present during pursuit, crisis, or passion but absent during stability |
| Performative availability | openness without accountability, consistency, or true vulnerability |
| Emotional withdrawal loops | closeness -> panic -> withdrawal -> longing -> reconnection |
| Pseudo-intimacy | emotional display replaces actual relational capacity |

Availability can evolve:

```text
guardedness
-> cautious vulnerability
-> emotional presence
-> consistent intimacy
-> secure emotional accessibility
```

Useful availability variables:

| Variable | Meaning |
| --- | --- |
| Vulnerability capacity | openness ability |
| Emotional presence capacity | consistency of engagement |
| Intimacy sustainability capacity | ability to maintain closeness |
| Attachment tolerance | comfort with emotional centrality |
| Conflict endurance capacity | staying power during rupture |
| Emotional responsiveness capacity | ability to engage with another's needs |
| Withdrawal tendency | retreat after closeness |
| Fear activation threshold | panic point during intimacy |
| Availability consistency | stability of emotional access |
| Performative availability risk | pseudo-openness risk |
| Intensity-only availability risk | availability limited to pursuit or crisis |

Real intimacy depends less on whether someone wants connection and more on whether they can remain emotionally reachable after attachment, conflict, vulnerability, and reality arrive.

### Core Wounds

Core wounds are deep emotional injuries and formative relational pain patterns that shape how a person experiences love, attachment, intimacy, trust, vulnerability, self-worth, conflict, and emotional safety. They answer: what emotional pain fundamentally shaped how I believe relationships and love work?

Core wounds are not personality traits, temporary insecurities, or surface emotions. They are emotionally formative relational injuries built through attachment experiences, repeated patterns, trauma, neglect, betrayal, invalidation, abandonment, humiliation, or conditional care.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Core wound | deep relational emotional injury |
| Fear | anticipated emotional pain |
| Trigger | activation of wound memory |
| Insecurity | emotional uncertainty |
| Defense mechanism | protection strategy |

Core wounds shape relationship interpretation systems:

```text
painful emotional experience
-> emotional conclusion
-> defensive adaptation
-> adult relationship pattern
```

Useful core wounds:

| Wound | Core Belief | Common Defense |
| --- | --- | --- |
| Abandonment | people leave once I attach | reassurance seeking, hypervigilance |
| Rejection | my authentic self may not be lovable | restraint, teasing, perfectionism |
| Betrayal | trust creates vulnerability to harm | suspicion, testing, control attempts |
| Emotional neglect | my needs do not matter enough for care | suppression, caretaking, isolation |
| Humiliation | being visible is unsafe or shameful | masking, defensiveness |
| Inadequacy | I am not enough to keep love | comparison, perfectionism |
| Engulfment | closeness threatens my identity | withdrawal, label resistance |
| Emotional invalidation | my feelings are wrong or excessive | self-doubt, emotional suppression |
| Conditional love | I must perform correctly to be loved | people pleasing, achievement obsession |
| Control | attachment means loss of agency | hyper-independence |
| Replacement | I am emotionally interchangeable | jealousy, possessiveness |
| Emotional burden | my needs overwhelm others | self-isolation, reluctance to ask |
| Visibility | no one truly sees me | longing, recognition hunger |
| Dependency | needing people is dangerous | avoidance, control fixation |
| Worthlessness | I am undeserving of love | sabotage, disbelief in care |

Attachment styles often cluster wounds:

| Attachment Style | Common Wound Pattern |
| --- | --- |
| Secure | lower wound dominance |
| Anxious | abandonment, replacement, inadequacy |
| Avoidant | engulfment, dependency, control |
| Fearful | abandonment plus betrayal |

Core wounds create protective behavior. A character may not be cold; they may have learned emotional visibility was dangerous. A character may not be clingy; they may have learned love disappears without constant monitoring.

Wounds can also shape attraction. Relationships that activate old wounds may feel intense because familiar pain is emotionally recognizable and unresolved wounds seek resolution. This can create chemistry, obsession, and repeating patterns.

Healing arcs require repeated corrective experiences:

```text
wound activation
-> defensive behavior
-> relationship challenge
-> safe corrective experience
-> trust rebuilding
-> emotional restructuring
```

Failure modes:

| Failure | Result |
| --- | --- |
| Static wounds | repetitive conflict with no evolution |
| Over-explained wounds | therapy exposition replaces subtle behavior |
| No behavioral consequences | wounds do not affect pacing, trust, or intimacy |
| Wound romanticization | harm is treated as destiny instead of a pattern to heal or manage |

Useful wound variables:

| Variable | Meaning |
| --- | --- |
| Abandonment wound severity | fear of emotional loss |
| Rejection wound severity | fear authentic self is unwanted |
| Betrayal wound severity | trust injury depth |
| Emotional neglect wound severity | care absence imprint |
| Humiliation wound severity | shame and visibility injury |
| Inadequacy wound severity | not-enough belief intensity |
| Engulfment wound severity | autonomy threat from closeness |
| Invalidation wound severity | emotional reality dismissal imprint |
| Conditional love wound severity | performance-for-love belief |
| Wound activation level | current trigger intensity |
| Defensive adaptation strength | protective behavior force |
| Corrective experience readiness | ability to receive healing evidence |
| Wound healing progress | restructuring of old emotional predictions |

Romantic relationships become transformative when someone repeatedly experiences the opposite outcome of what their deepest wound taught them to expect.

### Relationship Fears

Relationship fears are the emotional threats a person most fears experiencing within intimacy, attachment, vulnerability, commitment, or emotional dependence. They answer: what emotional pain am I trying to avoid by protecting myself?

Most romantic behavior is fear management. Teasing instead of confessing, withdrawing after intimacy, jealousy, emotional testing, over-reassurance seeking, avoiding labels, or acting indifferent can all be protective adaptations rather than lack of care. The runtime should use fear to explain behavior, but not to excuse harm.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Fear | anticipated emotional threat |
| Insecurity | uncertainty about self or value |
| Trauma | unresolved emotional injury |
| Boundary | protective relational limit |
| Defense mechanism | strategy to reduce fear exposure |

Useful relationship fears:

| Fear | Core Threat | Common Behaviors |
| --- | --- | --- |
| Abandonment | you will leave once I depend on you | reassurance seeking, hypervigilance, jealousy, testing |
| Engulfment | I will lose myself inside us | withdrawal, autonomy protection, label resistance |
| Rejection | if I reveal myself, I will not be wanted | restraint, indirect communication, slow confession |
| Vulnerability | openness gives you power to hurt me | composure, control, intellectualization, indirect affection |
| Replacement | I am emotionally interchangeable | possessiveness, comparison sensitivity, reassurance need |
| Inadequacy | I am not enough to be loved | overachievement, over-caretaking, masking, perfectionism |
| Dependency | needing you means losing control | distancing after intimacy, attachment resistance |
| Betrayal | trust will be weaponized | suspicion, caution, testing, hypervigilance |
| Emotional exposure | the real me will be rejected | persona maintenance, humor defense, selective transparency |
| Conflict | conflict means danger or abandonment | appeasing, avoidance, suppression, withdrawal |
| Emotional irrelevance | I will stop mattering | intensity seeking, prioritization sensitivity, reactivity |
| Stability | calm and real means hurt is coming | chaos seeking, suspicion of safety, intensity addiction |
| Intimacy | closeness will overwhelm or expose me | sabotage after closeness, distancing, delayed attachment |
| Losing autonomy | love will consume individuality | boundary emphasis, independence, merging resistance |
| Being truly known | understanding me enables deeper rejection | compartmentalization, masking, selective honesty |

Attachment styles tend to organize fear:

| Attachment | Dominant Fear |
| --- | --- |
| Secure | temporary loss or disconnection |
| Anxious | abandonment |
| Avoidant | engulfment or dependency |
| Fearful | abandonment and vulnerability simultaneously |

Tropes often activate specific fears:

| Trope | Common Fear |
| --- | --- |
| Friends to lovers | losing the friendship |
| Enemies to lovers | vulnerability and trust |
| Forbidden romance | consequences and loss |
| Slow burn | rejection and exposure |
| Healing romance | being too damaged |
| Redemption romance | being unforgivable |
| Rivals to lovers | emotional surrender |

Many recurring dynamics are fear loops:

```text
fear of abandonment
-> reassurance seeking
-> partner overwhelm
-> withdrawal
-> intensified fear
```

or:

```text
fear of engulfment
-> withdrawal
-> partner pursuit
-> more withdrawal
```

Fear often intensifies chemistry because high emotional stakes create high activation. Vulnerability, jealousy, restraint, and ambiguous desire can feel powerful because they expose what the character most wants to avoid losing.

Strong romance arcs transform fear:

```text
fear of abandonment
-> trust in consistency
```

```text
fear of vulnerability
-> emotional openness
```

```text
fear of engulfment
-> safe interdependence
```

Failure modes:

| Failure | Result |
| --- | --- |
| fear-dominated relationship | pacing, conflict, intimacy, and communication are controlled by fear |
| fear denial | projection, sabotage, repeated conflict loops |
| fear without repair | repeated triggers without reassurance, safety, or growth |

Useful relationship fear variables:

| Variable | Meaning |
| --- | --- |
| Abandonment fear | fear of being left |
| Engulfment fear | fear of losing self |
| Rejection sensitivity | fear of emotional dismissal |
| Vulnerability fear | discomfort with openness |
| Replacement fear | fear of being emotionally interchangeable |
| Inadequacy fear | fear of not being enough |
| Dependency fear | fear of emotional reliance |
| Betrayal sensitivity | trust fragility |
| Emotional exposure fear | fear the authentic self will be rejected |
| Conflict fear | fear of relational rupture |
| Irrelevance fear | fear of losing significance |
| Stability fear | fear that calm closeness is unsafe |
| Intimacy avoidance | resistance to closeness |
| Losing autonomy fear | fear closeness will erase individuality |
| Being known fear | fear of being understood and rejected |
| Protective adaptation strength | how strongly fear drives behavior |
| Sabotage risk | chance fear triggers self-defeating action |
| Repair responsiveness | ability to calm when fear is addressed |
| Fear transformation progress | movement from protection toward trust |

Relationship fear equation:

```text
attachment wound
+ perceived threat
+ protective adaptation
- repair and safety
= fear-driven behavior
```

#### Specialized Fear And Rupture Modules

Some fears are broad tendencies, but several are strong enough to behave like full sub-systems. These modules should alter pacing, interpretation, memory weight, repair difficulty, and future vulnerability thresholds.

Abandonment is real or perceived attachment rupture: being emotionally, physically, psychologically, or relationally left, withdrawn from, discarded, or disconnected from someone significant. It is not always literal leaving; emotional withdrawal, inconsistency, silence, neglect, broken promises, and unavailability can all trigger it.

| Abandonment Form | Core Experience | Runtime Effect |
| --- | --- | --- |
| Physical | someone literally leaves or disappears | breakup, ghosting, crisis walkout memory |
| Emotional | presence disappears while relationship remains | affection withdrawal, emotional neglect |
| Conflict | rupture happens during disagreement | lowers conflict survival trust |
| Inconsistent attachment | care becomes unpredictable | hypervigilance and reassurance dependence |
| Protective | someone leaves "for your own good" | self-sacrifice is still felt as abandonment |
| Self-protective withdrawal | distance follows intimacy | avoidant retreat after closeness |
| Symbolic | not prioritized or defended | abandonment sensitivity through identity injury |
| Temporary separation | distance feels like possible permanent loss | separation tolerance check |

Healing abandonment fear usually requires reliable return: reconnecting after conflict, staying during vulnerability, consistent emotional presence, and repair after rupture. The key question is: will you still emotionally choose me when I become vulnerable and real?

Engulfment is fear of losing autonomy, identity, emotional independence, boundaries, or psychological selfhood inside intimacy. It does not mean lack of love. Many engulfment-sensitive characters feel deeply, but closeness feels consuming or identity-threatening.

| Engulfment Form | Core Threat | Runtime Effect |
| --- | --- | --- |
| Emotional | emotions become overwhelming | shutdown, suppression, distancing |
| Identity | relationship replaces selfhood | resistance to merging and shared identity |
| Dependency | needing someone means losing power | post-intimacy withdrawal |
| Time/attention | relationship consumes all space | irritation, reduced contact, space need |
| Commitment | permanence feels trapping | label panic, retreat after escalation |
| Emotional responsibility | partner's regulation becomes constant duty | boundaries around reassurance |
| Sexual/intimacy | physical closeness becomes emotionally overwhelming | distance after intimacy |

Healing engulfment fear requires consistent closeness plus preserved autonomy, safe vulnerability, and non-coercive intimacy. The corrective experience is: I can stay connected without disappearing.

Betrayal is a violation of emotional trust, safety, loyalty, expectation, vulnerability, or relational agreement that destabilizes attachment. It is not defined only by cheating or lying; the violated emotional structure matters most.

| Betrayal Form | Core Violation | Runtime Effect |
| --- | --- | --- |
| Romantic/sexual | exclusivity expectations broken | replacement fear, jealousy, desirability wound |
| Emotional | emotional trust broken | vulnerability safety collapse |
| Loyalty | partner did not choose or defend them | relationship identity damage |
| Abandonment | partner left when needed | attachment rupture and hypervigilance |
| Promise | consistency collapsed | future trust damage |
| Identity | who they believed partner was feels false | relational reality collapse |
| Intimacy | sacred access was weaponized | vulnerability damage |
| Self-betrayal | I betrayed myself by trusting | shame and rigid self-protection |

Betrayal repair requires accountability, transparency, changed behavior, consistency, patience, and willingness to tolerate distrust temporarily. Trust repair should be earned, not granted by instant forgiveness.

Inadequacy is the fear or belief that one is not enough to be loved, chosen, desired, valued, prioritized, or kept. It is relational self-worth insecurity, not objective inferiority.

| Inadequacy Form | Core Fear | Runtime Effect |
| --- | --- | --- |
| Emotional | I am too much or not enough | hiding needs, shame, reassurance hunger |
| Romantic | someone else could love you better | comparison, jealousy, replacement fear |
| Sexual | I am not desirable enough | sexual vulnerability checks |
| Competence | you are more capable than me | admiration mixed with insecurity |
| Vulnerability | exposure will disappoint you | masking and perfectionism |
| Worthiness | I do not deserve this love | sabotage and care resistance |
| Stability | I cannot sustain healthy love | fear of ruining the bond |
| Identity | the real me will not be chosen | selective transparency |
| Dependency | my needs are burdensome | suppressed reassurance needs |
| Comparative | others are more lovable | jealousy spirals and ranking fear |

Inadequacy heals through consistent emotional choosing, reassurance, safe vulnerability, and survived imperfection. The corrective experience is: I do not need to become perfect to remain loved.

Fear of being controlled is fear that intimacy, attachment, commitment, or power imbalance will cause loss of autonomy, agency, self-determination, boundaries, or psychological freedom. It is distinct from engulfment because it focuses on coercion and agency threat.

| Control Fear Form | Core Threat | Runtime Effect |
| --- | --- | --- |
| Emotional control | my emotions stop feeling mine | withdrawal from guilt pressure or manipulation |
| Autonomy control | the relationship consumes independence | resistance to access expectations |
| Behavioral control | you dictate how I live | rebellion, defensiveness, secrecy |
| Psychological control | you influence my mind too much | internal clarity protection |
| Dependency-based | needing you gives you power | closeness avoidance |
| Commitment control | permanence becomes entrapment | retreat after labels or moving in |
| Sexual control | desire or dynamics reduce agency | explicit consent and agency checks |
| Social control | relationship defines or isolates me | public/private boundary tension |

Healing control fear requires consistent intimacy, preserved autonomy, respected boundaries, and chosen closeness. The corrective experience is: closeness does not have to cost freedom.

Fear of being forgotten is fear of becoming emotionally insignificant, replaceable, psychologically absent, or no longer remembered inside someone's emotional world. It is fear of emotional fading and loss of permanence.

| Forgotten Fear Form | Core Threat | Runtime Effect |
| --- | --- | --- |
| Emotional replacement | someone else occupies my place | jealousy and exclusivity pressure |
| Fading attachment | feelings weaken over time | reassurance and novelty seeking |
| Memory erasure | what we shared stops mattering | grief, nostalgia, memory preservation |
| Prioritization loss | I stop being central | attention sensitivity |
| Emotional permanence | love exists only while visible | distance anxiety |
| Identity dissolution | I left no lasting mark | melancholic intensity |
| Relationship replacement | our bond is recreatable | uniqueness threat |
| Historical invalidity | the past becomes meaningless | desperation to preserve significance |

This fear is soothed by emotional continuity: remembered details, maintained rituals, callbacks, future language, sentimental objects, and evidence that the relationship keeps existing emotionally even during absence.

Fear of vulnerability is fear that emotional openness, honesty, dependence, need, exposure, or authenticity will lead to rejection, humiliation, abandonment, betrayal, loss of control, or emotional injury. It is not lack of feeling; often the most intense characters are the most vulnerability-avoidant because the stakes feel enormous.

| Vulnerability Fear Form | Core Threat | Runtime Effect |
| --- | --- | --- |
| Emotional rejection | feelings will not be chosen | delayed confession, indirect affection |
| Emotional dependence | need gives partner power | withdrawal after intimacy |
| Being truly seen | full knowledge leads to rejection | masking and selective honesty |
| Losing emotional control | strong feelings destabilize me | shutdown, composure, distancing |
| Humiliation | openness will be mocked or weaponized | sarcasm, defensive humor, guardedness |
| Abandonment after exposure | becoming real makes them leave | testing, reassurance seeking |
| Burdening others | my needs are too much | suppression and isolation |
| Emotional irreversibility | once revealed, it cannot be taken back | hesitation tension before confession |

Fear of vulnerability heals through safe repetition of emotional exposure without catastrophic consequence. The corrective experience is: openness may not destroy me.

Fear of emotional dependence is fear that needing someone emotionally creates vulnerability, loss of control, instability, weakness, abandonment risk, or psychological danger. It focuses specifically on needing someone, not simply closeness or exposure.

| Dependency Fear Form | Core Threat | Runtime Effect |
| --- | --- | --- |
| Abandonment-based | absence will devastate me | distancing before attachment deepens |
| Control-based | needing gives partner power | composure and vulnerability resistance |
| Identity-based | dependence erases selfhood | autonomy preservation |
| Emotional stability | mood depends on someone unpredictable | self-containment attempts |
| Burden | my needs overwhelm others | avoiding comfort requests |
| Rejection-based | I need you more than you need me | testing and minimization |
| Betrayal-based | dependence enables betrayal | distrust and hyper-independence |

Dependency fear heals through consistent presence, safe vulnerability, preserved autonomy, and non-coercive closeness. The corrective experience is: I can rely without losing myself, being controlled, or being abandoned.

Fear of replacement is fear of becoming emotionally, romantically, sexually, psychologically, or relationally interchangeable. It asks: what makes me emotionally irreplaceable to you?

| Replacement Fear Form | Core Threat | Runtime Effect |
| --- | --- | --- |
| Romantic | partner falls for someone else | jealousy and romantic rival sensitivity |
| Emotional | someone understands partner better | emotional intimacy jealousy |
| Sexual | someone is more desirable | sexual comparison insecurity |
| Identity | my role in your life is replaceable | uniqueness threat |
| Historical | our history will not matter enough | ex comparison, nostalgia pressure |
| Attachment | my importance can transfer elsewhere | hypervigilance |
| Social | others are valued more publicly | prioritization conflict |
| Domestic | our routines can be recreated | post-breakup grief and domestic insecurity |

Replacement fear heals through consistent prioritization, emotional continuity, specific attentiveness, and relationship uniqueness reinforcement. The corrective experience is: I do not need to compete constantly to remain emotionally significant.

Fear of rejection is fear that authentic emotions, desires, vulnerability, attachment, identity, or needs will not be accepted, reciprocated, chosen, or valued. It focuses on failed emotional reaching: what if I reach for you and you do not reach back?

| Rejection Fear Form | Core Threat | Runtime Effect |
| --- | --- | --- |
| Romantic | love or desire is not returned | confession hesitation and yearning |
| Emotional | feelings are too much or unwanted | hiding intensity, reassurance fear |
| Identity | the real self is not chosen | masking and selective vulnerability |
| Sexual | I am not desirable enough | sexual confidence checks |
| Social | public rejection or denial | acknowledgment sensitivity |
| Vulnerability | openness is not held safely | emotional safety damage |
| Comparative | someone else is more lovable | jealousy and comparison spirals |
| Delayed | acceptance now becomes rejection later | fearful post-acceptance anxiety |

Rejection fear heals through repeated emotional reaching followed by acceptance instead of rejection. The corrective experience is: my authentic self may still be lovable.

### Jealousy Styles

Jealousy styles are the characteristic emotional and behavioral patterns through which a person experiences, interprets, expresses, regulates, or hides jealousy. They answer: what do I emotionally do when I fear losing significance, attention, or attachment?

Jealousy is not automatically toxicity, possessiveness, or manipulation. Healthy jealousy can mean the relationship matters. The runtime should care most about how jealousy is processed and expressed.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Jealousy | fear of emotional displacement |
| Possessiveness | desire to restrict or control |
| Envy | wanting what another has |
| Insecurity | uncertainty about value |
| Territoriality | guarding emotional space |

Jealousy styles are attachment expression patterns under perceived threat.

Useful jealousy styles:

| Style | Core Pattern | Common Behavior |
| --- | --- | --- |
| Anxious | you may emotionally choose someone else | hypervigilance, reassurance seeking, comparison spirals |
| Silent | jealousy is suppressed internally | withdrawal, quiet mood shifts, subtle tension |
| Possessive | exclusivity or control feels threatened | territoriality, prioritization demands |
| Competitive | jealousy becomes proof-seeking | rivalry, trying harder, competence display |
| Teasing | jealousy hides inside banter | sarcasm, playful accusations, flirt-challenge |
| Defensive | jealousy hides as indifference | "I do not care", shutdown, detachment |
| Devotional | partner feels profoundly important | protectiveness, prioritization, displacement fear |
| Reactive | jealousy appears immediately | visible hurt, emotional transparency, impulsive expression |
| Intellectualized | jealousy is analyzed instead of felt | rationalization, detached language |
| Chaotic | jealousy escalates unstably | flooding, push-pull, dramatic conflict |
| Reassurance-seeking | jealousy asks for reaffirmation | indirect questions, emotional testing |
| Protective | concern appears as threat-scanning | distrust of rivals, shielding impulse |
| Subtle | tiny changes reveal attachment | quieter tone, increased attentiveness, loaded teasing |
| Shame-based | jealousy feels weak or needy | suppression, self-loathing, distancing |
| Secure | jealousy is acknowledged and regulated | calm honesty, non-controlling reassurance requests |

Attachment and communication shape jealousy expression:

| Attachment | Common Jealousy Style |
| --- | --- |
| Secure | direct and regulated |
| Anxious | hypervigilant and reassurance-seeking |
| Avoidant | silent or defensive |
| Fearful | chaotic push-pull |

| Communication Style | Jealousy Expression |
| --- | --- |
| Direct | explicit concern |
| Teasing | sarcastic or flirtatious jealousy |
| Restrained | subtle emotional shifts |
| Avoidant | distancing |
| Expressive | emotional escalation |

Jealousy is shaped by what the character believes should be unique: emotional exclusivity, sexual exclusivity, ritual exclusivity, prioritization, public acknowledgment, or private vulnerability.

Common jealousy loops:

```text
distance
-> jealousy
-> pursuit
-> withdrawal
-> intensified jealousy
```

```text
comparison
-> competition
-> admiration
-> jealousy
```

```text
deep prioritization
-> fear of replacement
-> reassurance seeking
```

Healthy jealousy includes communication, reassurance, emotional honesty, and boundary discussion. Unhealthy jealousy includes control, punishment, surveillance, coercion, and manipulation.

The strongest jealousy scenes reveal vulnerability beneath the reaction. Irritation, teasing, anger, or withdrawal may hide fear of replacement, abandonment, inadequacy, or emotional irrelevance.

Jealousy can evolve:

```text
reactive jealousy
-> communicated jealousy
-> reassurance
-> emotional security
-> reduced hypervigilance
```

Useful jealousy variables:

| Variable | Meaning |
| --- | --- |
| Jealousy reactivity | intensity of jealousy response |
| Rival sensitivity | response to competition |
| Reassurance need | need for emotional confirmation |
| Exclusivity need | desire for uniqueness |
| Emotional security | stability under attachment threat |
| Comparison sensitivity | insecurity toward alternatives |
| Possessiveness tendency | control-oriented reactions |
| Emotional transparency | visibility of jealousy |
| Shame around neediness | discomfort admitting jealousy |
| Regulation capacity | ability to process jealousy safely |
| Communication readiness | willingness to name the concern |
| Territoriality | guarding emotional space |
| Control risk | chance jealousy becomes coercive |
| Reassurance responsiveness | ability to calm when significance is affirmed |
| Vulnerability reveal potential | chance jealousy exposes the real fear |

Jealousy equation:

```text
perceived threat
+ attachment significance
+ exclusivity expectation
- emotional security
= jealousy activation
```

### Possessiveness

Possessiveness is the desire to secure, protect, maintain, or control emotional, romantic, sexual, or relational exclusivity and significance. It answers: how much of you feels emotionally mine, and how threatened do I feel when that feels unstable?

Possessiveness exists on a spectrum. It is not automatically abusive, toxic, or controlling. Healthy possessiveness can communicate: this connection is uniquely important to me. Unhealthy possessiveness begins when agency, autonomy, consent, or emotional safety collapse.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Possessiveness | desire to maintain emotional exclusivity or significance |
| Jealousy | reaction to perceived relational threat |
| Exclusivity | negotiated uniqueness and access |
| Devotion | emotional prioritization and reverence |
| Control | restriction of another person's autonomy |

Possessiveness focuses on protecting emotional territory. Jealousy may activate it, exclusivity may define its boundaries, and devotion may intensify it, but the runtime should not collapse those systems into one variable.

Useful possessiveness types:

| Type | Core Feeling | Runtime Use |
| --- | --- | --- |
| Emotional | I do not want to lose emotional centrality | discomfort with emotional rivals and intimacy elsewhere |
| Romantic | romantic affection should feel uniquely ours | flirtation sensitivity and public acknowledgment needs |
| Sexual | desire should feel singular | erotic comparison and desirability insecurity |
| Protective | I want to guard your wellbeing | loyalty, shielding, protective attentiveness |
| Devotional | you are emotionally sacred to me | intense prioritization and consuming attachment |
| Insecurity-driven | I am emotionally replaceable | reassurance dependence, testing, clinginess |
| Silent | territorial feelings stay hidden | subtle tension, increased attentiveness, restrained jealousy |
| Territorial | this bond has protected rituals and access | "our" language, unique routines, social signaling |
| Chaotic | possession expresses through instability | emotional punishment, volatility, dramatic escalation |

Attachment style shapes possessive expression:

| Attachment | Common Possessiveness Pattern |
| --- | --- |
| Secure | protective but respectful |
| Anxious | reassurance-seeking and rival-sensitive |
| Avoidant | subtle, suppressed, or shame-hidden |
| Fearful | volatile push-pull possessiveness |

Possessiveness increases when exclusivity feels threatened: emotional rivals, reduced prioritization, intimacy redistribution, public ambiguity, or loss of private rituals. The emotional question is usually: am I still uniquely significant?

In power dynamics, possessiveness is only sustainable when consent and autonomy remain active. The runtime should distinguish emotionally charged territoriality from coercion, monitoring, isolation, punishment, or ownership framing.

The strongest possessiveness scenes reveal vulnerability beneath territoriality. Surface jealousy, protectiveness, or tension may hide fear of replacement, fear of abandonment, fear of losing significance, or inadequacy.

Healthy and unhealthy possessiveness:

| Form | Behavior | Emotional Meaning |
| --- | --- | --- |
| Healthy | communicates prioritization needs, protects rituals, seeks reassurance, honors boundaries | you matter deeply to me |
| Unhealthy | isolates, monitors, coerces, punishes, restricts autonomy, claims ownership | I must control access to feel safe |

Possessiveness can evolve:

```text
jealousy
-> reassurance
-> emotional prioritization
-> devotion
-> secure emotional singularity
```

Healthy progression transforms:

```text
control impulse
-> named fear
-> chosen emotional significance
```

Useful possessiveness variables:

| Variable | Meaning |
| --- | --- |
| Exclusivity need | desire for uniqueness |
| Emotional territoriality | protectiveness over the bond |
| Rival sensitivity | reaction to perceived threats |
| Prioritization need | desire for emotional centrality |
| Possessiveness intensity | strength of territorial feelings |
| Autonomy respect | ability to preserve partner agency |
| Replacement fear | fear of emotional substitution |
| Devotional intensity | depth of emotional prioritization |
| Reassurance dependence | need for exclusivity confirmation |
| Agency preservation | active maintenance of consent and choice |
| Control impulse | urge to restrict access or behavior |
| Monitoring impulse | urge to check, watch, or surveil |
| Emotional monopolization risk | risk of demanding total centrality |
| Ownership mentality risk | risk of objectifying the partner |
| Secure singularity | confidence in unique significance without control |

Possessiveness equations:

```text
fear of loss
+ exclusivity need
+ emotional significance
- autonomy respect
= possessiveness pressure
```

```text
emotional significance
+ chosen prioritization
+ autonomy respect
= healthy possessiveness
```

### Obsession

Obsession is an overwhelming fixation where another person becomes psychologically dominant in a character's thoughts, emotions, attention, identity, regulation, or sense of meaning. It answers: how much of my emotional world has become organized around you?

Obsession is not automatically love, intimacy, compatibility, or emotional health. It can feel intoxicating, romantic, devastating, consuming, or destabilizing depending on reciprocity, emotional safety, stability, boundaries, and attachment regulation.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Obsession | consuming psychological fixation |
| Devotion | deep intentional prioritization |
| Attachment | emotional bonding |
| Infatuation | intense attraction or fascination |
| Dependency | emotional reliance |
| Love | sustained relational care and attachment |

Obsession specifically involves loss of emotional proportion. The relationship stops feeling like one important part of life and starts feeling like the emotional center of life.

Common formation structure:

```text
high emotional significance
+ uncertainty
+ attachment
+ fear of loss
+ reinforcement loops
= obsessive fixation
```

Intermittent emotional reward is especially potent. Hot/cold affection, unresolved tension, unstable reassurance, or rare moments of intimacy can make the character's attention keep returning to the bond.

Useful obsession types:

| Type | Core Feeling | Runtime Use |
| --- | --- | --- |
| Romantic | you dominate my emotional attention | constant thoughts, longing, hyperfocus |
| Emotional | my regulation is tied to you | access needs, panic at distance, dependency |
| Sexual | desire becomes psychologically consuming | touch fixation, anticipation, restraint tension |
| Jealous | I cannot tolerate losing you | comparison fixation, hypervigilance, territoriality |
| Devotional | you become emotionally sacred | reverence, loyalty, consuming prioritization |
| Transformational | this relationship changes who I am | identity shifts and worldview reorganization |
| Fear-based | I cannot emotionally survive losing you | abandonment panic and reassurance dependence |
| Chaotic | instability itself becomes addictive | breakup/reunion loops, volatility, conflict craving |
| Mutual | we emotionally consume each other | intense chemistry, singularity, shared fixation |
| Silent | fixation hides beneath restraint | quiet observation, memory detail, composed yearning |

Attachment style shapes obsession risk:

| Attachment | Common Obsession Pattern |
| --- | --- |
| Secure | lower obsession tendency and stronger regulation |
| Anxious | emotional fixation, hypervigilance, reassurance seeking |
| Avoidant | hidden obsessive attachment beneath restraint |
| Fearful | unstable consuming obsession and push-pull intensity |

Obsession often appears behaviorally as constant thoughts, monitoring emotional signals, excessive prioritization, hyper-attentiveness, difficulty detaching, compulsive reassurance seeking, idealization, or spiraling during distance. The underlying logic is: you became emotionally indispensable.

Obsession and chemistry often combine through:

```text
high emotional intensity
+ uncertainty
+ attachment
+ restraint
= obsessive fixation
```

Safe obsession requires mutuality, reassurance, boundaries, and emotional regulation. It can feel deeply consuming but emotionally survivable. Unsafe obsession includes coercion, emotional monopolization, autonomy destruction, instability addiction, or using fear as permission to control.

Obsession strongly increases emotional singularity: unique rituals, intense prioritization, fear of replacement, and private micro-worlds. This can create powerful romance texture, but the runtime should preserve autonomy and avoid confusing fixation with intimacy.

Identity absorption is one of the deepest obsession themes. The more a character's self-concept, future, and emotional regulation organize around the relationship, the more distance or rupture asks: who am I if I lose you?

Obsessive trajectories often move through:

```text
fascination
-> fixation
-> emotional dependence
-> possessiveness
-> fear of loss
-> destabilization or deep devotion
```

The outcome depends on safety, regulation, reciprocity, and boundaries.

Healthy and unhealthy obsession:

| Form | Behavior | Emotional Meaning |
| --- | --- | --- |
| Safe | mutual fixation, named needs, respected autonomy, repair, boundaries | you matter so much that I must stay emotionally responsible |
| Unsafe | monopolization, coercion, surveillance, identity collapse, instability addiction | I cannot regulate losing access to you |

Useful obsession variables:

| Variable | Meaning |
| --- | --- |
| Attachment intensity | emotional centrality |
| Emotional fixation | mental and emotional preoccupation |
| Replacement fear | fear of emotional substitution |
| Exclusivity need | desire for uniqueness |
| Dependency level | emotional reliance |
| Hypervigilance | sensitivity to relational shifts |
| Devotional intensity | prioritization depth |
| Autonomy preservation | resistance to self-loss |
| Emotional regulation stability | ability to remain psychologically balanced |
| Uncertainty amplification | how ambiguity increases fixation |
| Intermittent reward sensitivity | susceptibility to hot/cold reinforcement |
| Identity absorption | degree relationship dominates self-concept |
| Attention dominance | amount of mental bandwidth occupied |
| Reciprocity stability | whether fixation is mutual and regulated |
| Boundary integrity | ability to preserve limits under intensity |
| Safe obsession potential | consuming feeling with survivable structure |
| Destabilization risk | chance fixation becomes unsafe or exhausting |

Obsession equations:

```text
attachment intensity
+ uncertainty
+ fear of loss
+ intermittent reward
- regulation stability
= obsession pressure
```

```text
mutual fixation
+ emotional safety
+ boundaries
+ autonomy preservation
= safe obsession
```

### Conflict Styles

Conflict style is the recurring emotional and behavioral pattern a character uses when tension, hurt, disagreement, fear, or emotional threat enters the relationship. Attraction does not fully reveal a relationship; conflict often does. Conflict style answers: what do I do when emotional safety feels threatened?

Conflict is not automatically incompatibility, toxicity, or lack of love. Healthy romance depends less on whether conflict happens and more on how conflict is handled.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Conflict | disagreement or tension |
| Argument | active verbal conflict |
| Rupture | emotional disconnection |
| Repair | restoring safety and connection |
| Abuse | coercive or harmful behavior |

Conflict becomes unhealthy when autonomy disappears, fear replaces safety, manipulation replaces communication, or repair never happens.

Useful conflict styles:

| Style | Core Fear Or Strategy | Common Behavior |
| --- | --- | --- |
| Pursuer | do not emotionally leave me | immediate resolution, repeated contact, reassurance seeking |
| Withdrawer | conflict will overwhelm or trap me | silence, space-taking, intellectualizing, minimizing emotion |
| Explosive | emotional intensity needs expression | reactive escalation, outbursts, impulsive statements |
| Passive-avoidant | direct confrontation is unsafe | fake agreement, avoidance, distance, resentment buildup |
| Teasing/deflective | humor protects vulnerability | sarcasm, jokes, provocation, minimizing seriousness |
| Intellectual | control emotion through logic | analysis, debate framing, problem-solving without feeling |
| Appeasing | disconnection must be prevented | over-apology, surrender, self-minimization |
| Dominance-based | maintain leverage or composure | challenge, pressure, refusal to yield |
| Emotional shutdown | nervous system overwhelm | numbness, freezing, inability to process |
| Repair-oriented | restore emotional safety | accountability, listening, reassurance, collaborative repair |

Common loops:

| Style | Loop |
| --- | --- |
| Pursuer | tension -> pursuit -> overwhelm partner -> fear of abandonment -> increased pursuit |
| Withdrawer | conflict -> overwhelm -> withdrawal -> partner panic -> more withdrawal |
| Passive-avoidant | hurt -> suppression -> distance -> resentment -> erosion |
| Repair-oriented | rupture -> accountability -> listening -> reassurance -> reconnection |

Conflict style pairings can become strong relationship engines:

| Pairing | Dynamic | Risk |
| --- | --- | --- |
| Pursuer + withdrawer | pursuit and withdrawal | longing, frustration, emotional imbalance |
| Explosive + explosive | intense confrontation and reconciliation | volatility and exhaustion |
| Withdrawer + withdrawer | quiet tension and distance | stagnation or emotional disconnection |
| Repair-oriented + fearful | stability teaches conflict can survive vulnerability | trust takes time |

Tone shapes how conflict feels:

| Tone | Conflict Feel |
| --- | --- |
| Playful | teasing disagreement |
| Tense | emotional pressure |
| Fragile | fear of rupture |
| Chaotic | instability |
| Devotional | conflict feels devastating |
| Tender | repair-focused honesty |

Conflict often reveals emotional leverage: who withdraws, who chases, who apologizes first, who fears loss more, who escalates, and who reassures. Over time these patterns become part of relationship identity.

Conflict escalation stages:

```text
friction
-> tension
-> defensive behavior
-> rupture
-> vulnerability or revelation
-> repair attempt
-> reconnection
```

The surface issue is often not the real emotional issue. "You forgot to text me" may actually mean "Do I emotionally matter to you?" Strong conflict scenes reveal vulnerability beneath defensiveness: anger may hide fear of abandonment, jealousy, hurt, longing, shame, or feeling unimportant.

Healthy conflict includes accountability, listening, repair, emotional responsiveness, boundaries, and mutual respect. Unhealthy conflict includes contempt, humiliation, coercion, punishment, emotional manipulation, and refusal to repair.

Useful conflict variables:

| Variable | Meaning |
| --- | --- |
| Conflict avoidance | resistance to confrontation |
| Emotional reactivity | escalation intensity |
| Repair ability | reconnection skill |
| Vulnerability under stress | openness during conflict |
| Withdrawal tendency | distancing instinct |
| Pursuit urgency | need for immediate resolution |
| Accountability | ownership of harm |
| Emotional flooding | overwhelm level |
| Reassurance need | validation need during tension |
| Rupture risk | likelihood conflict becomes disconnection |

Conflict repair equation:

```text
conflict
+ emotional honesty
+ repair
= deeper intimacy
```

### Repair Styles

Repair style is the characteristic way a character attempts to reconnect, restore safety, reduce tension, rebuild trust, and re-establish emotional connection after conflict, rupture, misunderstanding, or attachment threat. It answers: when emotional damage happens between us, how do I try to emotionally reconnect?

Repair style is not apology alone, conflict style, or emotional intensity. Conflict style describes how someone fights; repair style describes how someone reconnects afterward.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Conflict style | how someone fights |
| Repair style | how someone reconnects afterward |
| Emotional regulation | handling internal emotion |
| Reassurance | restoring security |
| Accountability | owning harm |

Useful repair styles:

| Style | Core Strategy | Risk |
| --- | --- | --- |
| Verbal reassurance | restore safety through emotional language | hollow without behavior change |
| Accountability | reconnect through ownership and responsibility | fails if defensive |
| Behavioral | restore trust through changed action | may feel cold without emotional acknowledgment |
| Physical | reconnect through touch and closeness | invasive if safety is low |
| Presence-based | stay emotionally available instead of fleeing | insufficient without accountability |
| Humor/play | soften tension through warmth | bypasses harm if too early |
| Space-based | repair after decompression | triggers abandonment fear without reassurance |
| Vulnerability | repair through honesty and hidden feeling | unsafe if received poorly |
| Devotional | intensely reaffirm prioritization | overwhelming if mismatch exists |
| Practical | repair through caretaking or help | may miss emotional wound |
| Collaborative | solve rupture as a team | requires both partners' readiness |
| Ritual | reconnect through familiar repair patterns | can become empty if unexamined |
| Silent | reconnect through quiet presence or gestures | ambiguous if partner needs words |
| Sacrificial | prove care through meaningful cost or effort | can become self-erasure |

Attachment styles often bias repair:

| Attachment Style | Common Repair Style |
| --- | --- |
| Secure | direct and collaborative |
| Anxious | reassurance-heavy |
| Avoidant | space-based or behavioral |
| Fearful | inconsistent repair attempts |

Repair style mismatch is a major realism system. One character may need space before reconnecting while the other needs immediate reassurance; one feels smothered, the other feels abandoned.

Repair style effectiveness depends on rupture type:

| Rupture | Needed Repair |
| --- | --- |
| Misunderstanding | clarification |
| Abandonment | presence |
| Betrayal | accountability plus consistency |
| Invalidation | emotional acknowledgment |
| Humiliation | dignity restoration |
| Broken promise | reliability restoration |

Couples develop repair cultures: "we always talk eventually", "we reconnect physically", "we need space first", "we use humor to soften tension", or "we repair through routine." These become relationship identity systems.

Failure modes:

| Failure | Result |
| --- | --- |
| Premature repair | repair starts before processing is possible |
| Repair bypassing | jokes, touch, or caretaking replace accountability |
| Repeated repair without change | trust exhaustion and cynicism |
| One-sided repair burden | one partner always reconnects and adapts |

Repair style can evolve:

```text
reactive repair
-> understanding patterns
-> collaborative repair
-> anticipatory repair
-> secure conflict trust
```

Useful repair style variables:

| Variable | Meaning |
| --- | --- |
| Reassurance repair preference | verbal safety restoration need |
| Accountability capacity | ability to own harm |
| Behavioral repair reliability | action-based repair consistency |
| Space-based repair need | decompression requirement |
| Physical repair preference | touch-based reconnection |
| Presence reliability | emotional staying power |
| Collaborative repair skill | teamwork-oriented repair ability |
| Repair timing compatibility | pacing alignment after rupture |
| Repair effectiveness | emotional reconnection success rate |
| Repair bypassing risk | chance repair avoids the real wound |

Strong relationships are built when both people learn how to emotionally find each other again after rupture.

### Communication Styles

Communication style is the characteristic way a character expresses needs, emotions, attraction, boundaries, conflict, affection, and vulnerability. Relationships are not only what people feel; they are how people express what they feel. Communication style answers: how do I try to emotionally reach another person?

Communication style is emotional translation behavior. It affects directness, vulnerability, emotional clarity, conflict expression, reassurance, pacing, subtext density, and how much meaning is carried by silence or behavior.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Communication style | how emotion or intent is expressed |
| Attachment style | how closeness is regulated |
| Conflict style | how tension is handled |
| Intimacy style | how closeness is created |
| Tone | emotional atmosphere |

Useful communication styles:

| Style | Core Principle | Creates |
| --- | --- | --- |
| Direct | say what is meant clearly | stability, transparency, efficient repair |
| Indirect | express meaning through implication | tension, yearning, ambiguity |
| Teasing | use provocation and play | chemistry, momentum, flirt-deflection |
| Emotionally expressive | feelings should be visible | intimacy acceleration, intensity |
| Restrained | control and measure expression | high emotional weight per interaction |
| Intellectual | process emotion through analysis | mental chemistry, clarity or distance |
| Reassurance-oriented | actively maintain safety | stability, secure attachment feeling |
| Avoidant | minimize emotional exposure | misunderstanding, longing, tension |
| Chaotic | express emotion impulsively | intoxicating or destabilizing shifts |
| Caretaking | express emotion through support | protective warmth, practical affection |
| Devotional | communicate focused attentiveness | profound intimacy, emotional gravity |
| Conflict-avoidant | preserve harmony by suppressing tension | hidden resentment, unresolved pressure |
| Subtext-heavy | truth lives between the lines | slow-burn density, charged restraint |
| Reactive | emotion appears immediately | chemistry, visible responsiveness |
| Silent | meaning through behavior and nonverbal signals | subtle immersion, restrained intimacy |

Communication pairings create realism:

| Pairing | Dynamic |
| --- | --- |
| Direct + indirect | misunderstanding, tension, translation arcs |
| Expressive + restrained | pursuit and containment |
| Teasing + teasing | banter chemistry and flirt loops |
| Devotional + guarded | slow softening and vulnerability payoff |
| Intellectual + emotional | fascination plus communication mismatch |

Attachment often biases communication:

| Attachment | Common Communication |
| --- | --- |
| Secure | direct and repair-oriented |
| Anxious | expressive and reassurance-seeking |
| Avoidant | restrained and indirect |
| Fearful | inconsistent and reactive |

Most romantic tension comes from mismatch between feeling and expression. Deep longing expressed through restrained teasing creates subtext, chemistry, yearning, and emotional pressure. This mismatch is one of the strongest slow-burn engines.

Communication style also reflects emotional leverage. Restrained speech can signal composure or control; teasing can mask vulnerability; directness can signal emotional confidence; silence can be protection or punishment; reassurance can stabilize attachment.

Communication should evolve over time:

```text
teasing and deflection
-> emotionally loaded subtext
-> accidental honesty
-> vulnerability
-> direct intimacy
```

Useful communication variables:

| Variable | Meaning |
| --- | --- |
| Directness | explicit emotional clarity |
| Emotional transparency | visible feelings |
| Subtext density | indirect meaning level |
| Reassurance frequency | validation tendency |
| Conflict openness | comfort discussing tension |
| Vulnerability expression | willingness to verbalize emotions |
| Playfulness | teasing or banter tendency |
| Emotional filtering | restraint level |
| Responsiveness | reaction immediacy |
| Nonverbal weight | how much meaning behavior carries |
| Translation mismatch risk | chance partners miss each other's meaning |

Communication equation:

```text
emotion
+ communication style
+ restraint
= relationship tension and intimacy quality
```

### Emotional Transparency

Emotional transparency is the degree to which a person openly expresses, communicates, reveals, or allows others to perceive their genuine emotional state. It answers: how visible are my real emotions to you?

Transparency is not automatic oversharing, emotional dumping, lack of boundaries, or constant exposure. Healthy transparency means authentic emotional communication without losing self-regulation or boundaries.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Emotional transparency | visibility of authentic feelings |
| Vulnerability | emotional exposure or risk |
| Honesty | truthfulness |
| Emotional expression | outward display of feeling |
| Emotional regulation | managing emotional responses |

A character can feel intensely while remaining emotionally opaque, or communicate openly without being deeply vulnerable. Transparency affects intimacy pacing, misunderstanding frequency, subtext, conflict style, attachment security, and chemistry texture.

Useful transparency styles:

| Style | Core Feeling | Strength | Risk |
| --- | --- | --- | --- |
| High transparency | emotions are openly visible | clarity, faster repair, intimacy acceleration | overwhelm or reduced mystery |
| Balanced transparency | honest expression with regulation | sustainable intimacy and safety | requires pacing awareness |
| Low transparency | emotions are filtered or masked | restraint, composure, tension | misunderstanding and distance |
| Inconsistent transparency | openness fluctuates unpredictably | intensity and surprise | instability and confusion |

Transparency changes by phase:

| Phase | Transparency Pattern |
| --- | --- |
| Early attraction | lower transparency creates mystery, uncertainty, and fascination |
| Slow burn | trust allows hints, leakage, and gradually increasing openness |
| Established intimacy | transparency becomes softer, more instinctive, and less performative |

Useful transparency modes:

| Mode | Meaning | Example |
| --- | --- | --- |
| Verbal | emotion is spoken clearly | "I missed you" or "I am scared" |
| Behavioral | emotion appears through action | making food when worried |
| Reactive | emotion leaks through response | jealousy, fluster, panic, affection |
| Controlled | openness is selective and intentional | mature or soft-dominant honesty |
| Accidental | emotion escapes unintentionally | voice cracks, jealousy slip, overreaction |

Attachment shapes transparency:

| Attachment | Transparency Pattern |
| --- | --- |
| Secure | balanced openness |
| Anxious | high emotional visibility |
| Avoidant | restrained or indirect expression |
| Fearful | fluctuating exposure |

Communication style changes how transparency feels:

| Communication Style | Transparency Feel |
| --- | --- |
| Direct | emotionally clear |
| Teasing | masked transparency |
| Restrained | subtle emotional leakage |
| Intellectual | filtered emotional expression |
| Devotional | emotionally intentional |
| Avoidant | heavily controlled expression |

One strong chemistry structure is:

```text
high emotional intensity
+ low emotional transparency
= strong tension
```

This powers yearning, slow burn, and emotional anticipation. Too much transparency too quickly can flatten tension or overwhelm. Too little can block intimacy, create emotional starvation, and destabilize attachment. Balanced transparency creates clarity, tension, and vulnerability progression.

Transparency usually increases as emotional safety increases:

```text
safe emotional repetition
-> accepted vulnerability
-> repaired conflict
-> easier emotional visibility
```

Failure modes:

| Failure | Result |
| --- | --- |
| weaponized transparency | vulnerability used manipulatively or forced exposure |
| defensive opacity | chronic withholding, stonewalling, blocked intimacy |
| inauthentic transparency | performative vulnerability, strategic openness, hollow intimacy |

The strongest transparency often appears as controlled emotional cracks: a stoic character quietly admitting fear, a teasing character briefly becoming sincere, or an avoidant character staying emotionally present. Rare vulnerability carries weight when emotional opacity has been established.

Transparency can evolve:

```text
mystery
-> emotional hints
-> accidental honesty
-> controlled vulnerability
-> emotional trust
-> transparent intimacy
```

Useful emotional transparency variables:

| Variable | Meaning |
| --- | --- |
| Emotional openness | willingness to reveal feelings |
| Expression clarity | how understandable emotions are |
| Vulnerability comfort | tolerance for emotional exposure |
| Emotional filtering | degree of masking |
| Subtext density | amount of indirect meaning |
| Leakage tendency | likelihood emotions escape unintentionally |
| Transparency consistency | reliability of openness |
| Emotional safety dependence | openness tied to trust level |
| Reactivity visibility | visibility of emotional reactions |
| Verbal transparency | clarity through explicit speech |
| Behavioral transparency | clarity through action |
| Controlled transparency | selective intentional openness |
| Accidental transparency | unplanned emotional visibility |
| Mystery balance | retained tension without starvation |
| Defensive opacity risk | chance masking blocks intimacy |
| Weaponized transparency risk | chance openness becomes manipulation |
| Inauthentic transparency risk | chance vulnerability is performed rather than real |

Transparency equation:

```text
authentic feeling
+ expression clarity
+ boundaries
+ safety
= healthy emotional visibility
```

### Miscommunication

Miscommunication is a mismatch between intended meaning, expressed meaning, perceived meaning, and emotional interpretation. In romance, the important question is often not what did I literally say? It is: what did you think I meant?

Most romantic miscommunication is not caused by lack of intelligence. It is caused by fear, expectation, insecurity, emotional protection, attachment patterns, indirect communication, and conflicting assumptions.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Miscommunication | message interpreted differently than intended |
| Misunderstanding | incorrect emotional or factual interpretation |
| Withholding | intentional omission |
| Deception | deliberate falsehood |
| Ambiguity | unclear emotional signaling |

Core structure:

```text
emotion
-> imperfect expression
-> filtered interpretation
-> emotional reaction
```

The filtering stage is where romance tension often happens. A character may mean "I need reassurance" but express it as sarcasm, withdrawal, or teasing, then be interpreted as angry, disinterested, or hostile.

Useful miscommunication types:

| Type | Core Issue | Example |
| --- | --- | --- |
| Emotional | emotional meaning misunderstood | reassurance need interpreted as anger |
| Protective | vulnerability hidden through defense | "go away" means "please stay" |
| Timing | right message at wrong emotional moment | apology before accountability feels real |
| Expectation | different relationship norms assumed | space as trust versus space as abandonment |
| Jealousy | insecurity read as accusation | fear of loss sounds controlling |
| Silence | absence gains emotional meaning | delayed reply becomes rejection |
| Intent | behavior intent misunderstood | teasing read as mockery |
| Conflict | regulation systems clash | withdrawal as self-regulation read as abandonment |
| Vulnerability | subtle care not recognized | "be careful" means "I care deeply" |
| Romantic ambiguity | attraction status unclear | flirting, friendship, politeness, or intimacy |

Attachment and communication style shape misreadings:

| Attachment | Common Miscommunication Pattern |
| --- | --- |
| Secure | more direct clarification |
| Anxious | catastrophizing ambiguity |
| Avoidant | indirect emotional expression |
| Fearful | contradictory signaling |

| Communication Style | Common Risk |
| --- | --- |
| Indirect | hidden emotional meaning |
| Teasing | sincerity masked |
| Restrained | emotional undercommunication |
| Expressive | emotional overwhelm |
| Intellectual | emotional invalidation |
| Avoidant | ambiguity and withdrawal |

Miscommunication often reflects vulnerability imbalance. Dominant characters may hide need through control, submissive characters may hide desire through teasing, and avoidant characters may hide longing through distance. This creates asymmetry, subtext, and tension.

Healthy dramatic miscommunication creates tension, yearning, emotional realism, and eventual growth. Unhealthy frustrating miscommunication repeats without evolution, refuses basic honesty forever, or exists only to stall progression. Good miscommunication reveals character psychology.

Miscommunication should resolve through emotional translation:

```text
When you pull away,
I think you do not care.

I pull away because I am overwhelmed,
not because I do not care.
```

Miscommunication progression:

```text
ambiguity
-> incorrect interpretation
-> emotional reaction
-> escalation
-> vulnerability reveal
-> clarification
-> deeper intimacy
```

Useful miscommunication variables:

| Variable | Meaning |
| --- | --- |
| Directness | clarity of expression |
| Interpretation bias | tendency toward negative assumptions |
| Vulnerability avoidance | hiding emotional truth |
| Clarification tendency | willingness to ask directly |
| Emotional projection | projecting fears onto behavior |
| Subtext density | indirect emotional meaning |
| Ambiguity tolerance | comfort with uncertainty |
| Reassurance sensitivity | reaction to unclear signals |
| Escalation risk | likelihood misread signals become conflict |
| Resolution readiness | ability to clarify without defensiveness |

Miscommunication principle:

```text
trying to protect myself
+ trying to be loved
= romantic miscommunication risk
```

### Misunderstanding

Misunderstanding is an emotionally meaningful incorrect interpretation of another person's intentions, feelings, motives, needs, boundaries, or behaviors. It asks: what emotional meaning did I think your behavior had?

Misunderstanding is distinct from miscommunication. Miscommunication concerns failed transmission. Misunderstanding concerns mistaken emotional interpretation, often created by fear, assumption, projection, attachment insecurity, communication mismatch, or subtext ambiguity.

Core structure:

```text
behavior
-> emotional interpretation
-> emotional reaction
-> escalation or clarification
```

Useful misunderstanding types:

| Type | Actual Meaning | Misread As |
| --- | --- | --- |
| Emotional intent | I am overwhelmed | you do not care |
| Affection | acts of service or quiet care | lack of love |
| Teasing | flirtation or guarded affection | mockery or rejection |
| Withdrawal | I need regulation space | you are abandoning me |
| Vulnerability | subtle concern or restraint | emotional distance |
| Exclusivity | unclear expectations | betrayal or indifference |
| Jealousy | fear of losing significance | control or hostility |
| Timing | good intent at wrong moment | insensitivity |
| Silence | processing, restraint, or absence | rejection |
| Self-protection | defense masking feeling | true indifference |

Attachment styles create interpretation bias:

| Attachment Style | Common Bias |
| --- | --- |
| Secure | clarification-oriented |
| Anxious | catastrophizes ambiguity |
| Avoidant | minimizes emotional meaning |
| Fearful | contradictory interpretations |

The strongest misunderstandings are psychologically coherent. They filter visible behavior through believable fears, attachment patterns, emotional assumptions, and prior memory. Forced misunderstanding with no emotional logic should be avoided.

Repair requires emotional translation:

```text
When you pulled away,
I thought I stopped mattering.

I pulled away because I was overwhelmed,
not because I stopped caring.
```

Failure modes:

| Failure | Result |
| --- | --- |
| Endless misunderstanding loops | no emotional learning occurs |
| Unrealistic clarification refusal | drama feels artificial |
| No emotional consequence | misunderstanding feels shallow |

Useful misunderstanding variables:

| Variable | Meaning |
| --- | --- |
| Interpretation bias | tendency toward negative assumptions |
| Ambiguity tolerance | comfort with uncertainty |
| Clarification tendency | willingness to ask directly |
| Projection sensitivity | likelihood of assigning fears to behavior |
| Emotional translation accuracy | understanding emotional intent |
| Reassurance dependence | need for explicit meaning |
| Subtext recognition | ability to interpret indirect emotion |
| Attachment trigger sensitivity | overreaction risk |
| Misunderstanding recovery ability | ease of clarification and repair |

Misunderstanding emerges in the gap between hidden feeling and visible behavior.

### Admiration

Admiration is emotionally significant respect, appreciation, fascination, or esteem directed toward another person's qualities, abilities, character, presence, or identity. Attraction may create desire, but admiration creates sustained emotional gravity.

Admiration says: I see something in you that deeply affects how I value you. It often transforms chemistry into devotion and attraction into lasting attachment.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Attraction | desire or interest |
| Admiration | esteem and emotional respect |
| Idealization | unrealistic projection |
| Devotion | emotional prioritization |
| Infatuation | intense fixation |

Useful admiration types:

| Type | Core Feeling | Common Context |
| --- | --- | --- |
| Competence | you are highly capable | workplace, rivals, protector dynamics |
| Emotional | your emotional qualities move me | healing romance, deep slow burn |
| Protective | you make me feel safe | secure attachment, caretaker dynamics |
| Intellectual | your mind stimulates me | rivals, academic romance, banter |
| Moral | I respect who you are ethically | redemption, heroic romance |
| Vulnerability | your openness affects me deeply | confession, healing, protective intimacy |
| Transformational | you changed me | soulmate, healing, transformational arcs |
| Physical | I appreciate your presence and movement | attentive attraction, style, body language |
| Devotional | you feel emotionally extraordinary | reverent care, worshipful chemistry |
| Hidden | admiration leaks through denial | enemies, rivals, restrained romance |

Trope and attachment can shape admiration:

| Trope | Common Admiration Type |
| --- | --- |
| Rivals to lovers | competence admiration |
| Friends to lovers | emotional admiration |
| Protector romance | safety admiration |
| Enemies to lovers | reluctant admiration |
| Healing romance | resilience admiration |
| Workplace romance | capability admiration |
| Soulmate romance | transformational admiration |

| Attachment | Admiration Pattern |
| --- | --- |
| Secure | balanced admiration |
| Anxious | idealizing admiration |
| Avoidant | hidden or reluctant admiration |
| Fearful | intense but unstable admiration |

Admiration often creates voluntary emotional influence. Characters may yield because they trust and respect someone, open emotionally because someone feels capable, or become attracted through competence. This is why admiration overlaps with dominance/submission, devotion, mentorship, and rivals-to-lovers.

Admiration and idealization must stay distinct. Admiration says: I see your flaws and still deeply respect you. Idealization says: I project perfection onto you. Strong romance often transitions from idealization to realistic admiration.

Admiration is shown through focused attention, careful listening, remembering details, defending someone, watching quietly, seeking approval, emotional responsiveness, valuing opinions, and pride in achievements.

Admiration increases vulnerability because the admired person's opinion matters. That creates tension, longing, insecurity, devotion, and emotional stakes.

Admiration can evolve:

```text
attraction
-> fascination
-> admiration
-> emotional trust
-> devotion
```

or:

```text
competition
-> reluctant respect
-> admiration
-> attraction
```

Failure modes:

| Failure | Result |
| --- | --- |
| no admiration | flat, dismissive, chemistry-only relationship |
| excessive idealization | pedestal dynamics and disappointment collapse |
| conditional admiration | insecurity, pressure, fear of failure |

Useful admiration variables:

| Variable | Meaning |
| --- | --- |
| Respect level | esteem intensity |
| Fascination | attention fixation |
| Competence attraction | attraction to capability |
| Emotional reverence | emotional significance level |
| Idealization tendency | projection intensity |
| Pride in partner | emotional investment in achievements |
| Validation importance | weight of partner's opinion |
| Devotional intensity | prioritization depth |
| Realism of admiration | ability to admire while seeing flaws |
| Conditional admiration risk | chance admiration depends on usefulness or perfection |

Admiration equation:

```text
attraction
+ respect
+ realistic seeing
= lasting emotional gravity
```

### Excitement

Excitement is the emotional stimulation, anticipation, novelty, intensity, momentum, and energetic engagement that makes a relationship feel alive. It is not love, safety, intimacy, compatibility, or even chemistry by itself.

Excitement answers: how emotionally stimulating does this relationship feel? It often creates attention fixation, anticipation, scene momentum, and the sense of not being able to stop thinking about the other person.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Excitement | stimulation and emotional activation |
| Chemistry | interactional charge |
| Passion | intense romantic or emotional energy |
| Novelty | newness |
| Tension | unresolved emotional pressure |
| Intimacy | closeness and emotional knowing |

Useful excitement sources:

| Source | Core Feeling | Common Effect |
| --- | --- | --- |
| Novelty | this is emotionally new | early fixation, discovery, firsts |
| Tension | something unresolved exists | slow burn, restraint, near-confession |
| Uncertainty | I do not fully know where I stand | anticipation, hyperfocus, anxiety risk |
| Challenge | you stimulate me | rivalry, banter, admiration pressure |
| Sexual | attraction creates physical activation | touch awareness, anticipation, restraint |
| Emotional | this feels deeply significant | confession energy, attachment acceleration |
| Forbidden | risk amplifies attraction | secrecy, suppression, heightened stakes |
| Transformational | this relationship changes me | awakening, identity shift, healing intensity |
| Chaotic | unpredictability activates me | volatility, impulsivity, instability risk |
| Playful | interaction itself energizes me | flirt games, teasing, reaction loops |

Excitement changes by relationship phase:

| Phase | Excitement Source |
| --- | --- |
| Early romance | novelty, uncertainty, possibility, first attraction |
| Mid slow burn | tension, restraint, jealousy, emotional buildup |
| Established relationship | depth, shared experience, playful rituals, sexual familiarity with responsiveness, rediscovery |

The runtime should not treat excitement as automatic health. High excitement with low stability can create obsession, volatility, and addictive chemistry. High stability with low excitement can create comfort but flatten romantic energy. The strongest long-term romances often balance stimulation with emotional safety.

Attachment changes what excitement feels like:

| Attachment | Excitement Pattern |
| --- | --- |
| Secure | balanced stimulation |
| Anxious | uncertainty-driven excitement |
| Avoidant | tension and distance excitement |
| Fearful | chaotic intensity excitement |

Chemistry types draw excitement from different places:

| Chemistry Type | Excitement Source |
| --- | --- |
| Banter | interaction energy |
| Tension | unresolved desire |
| Emotional | vulnerability and significance |
| Intellectual | stimulation and fascination |
| Chaotic | unpredictability |
| Devotional | emotional significance |
| Protective | safety combined with trust |

Excitement is heavily tied to escalation rhythm. Too fast creates burnout or shallow attachment; too slow creates stagnation and emotional drift. A strong rhythm often alternates:

```text
tension
-> release
-> closeness
-> uncertainty
-> escalation
```

Long-term excitement should evolve from novelty into depth:

```text
novelty excitement
-> tension excitement
-> emotional excitement
-> intimacy excitement
-> domestic/playful excitement
-> transformational excitement
```

Failure modes:

| Failure | Result |
| --- | --- |
| artificial excitement | constant drama, repeated jealousy loops, desensitization |
| zero excitement | stagnation, flat pacing, lost chemistry momentum |
| addiction to instability | anxiety mistaken for passion |

Useful excitement variables:

| Variable | Meaning |
| --- | --- |
| Novelty need | desire for newness and stimulation |
| Tension enjoyment | enjoyment of unresolved chemistry |
| Emotional stimulation | preferred intensity level |
| Predictability tolerance | comfort with stability |
| Escalation desire | desire for progression |
| Playfulness | interaction energy preference |
| Risk attraction | attraction to uncertainty or taboo |
| Passion stability | ability to sustain excitement over time |
| Responsiveness | reaction intensity to stimulation |
| Attention fixation | tendency to mentally return to the partner |
| Excitement-safety balance | whether stimulation remains emotionally sustainable |
| Instability addiction risk | chance anxiety is being interpreted as excitement |
| Stagnation risk | chance stability becomes emotionally flat |

Excitement equation:

```text
emotional significance
+ stimulation
+ responsiveness
+ safety balance
= sustainable excitement
```

### Novelty

Novelty is the experience of emotional, psychological, relational, or experiential newness that creates stimulation, curiosity, anticipation, discovery, and renewed engagement. It answers: what still feels emotionally fresh, surprising, or undiscovered between us?

Novelty is not randomness, chaos, instability, or constant escalation. Healthy novelty means the relationship keeps generating discovery and emotional movement instead of becoming psychologically static.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Novelty | perceived newness or discovery |
| Excitement | emotional stimulation |
| Tension | unresolved emotional pressure |
| Chemistry | interactional charge |
| Growth | meaningful change over time |

Novelty creates curiosity while intimacy creates familiarity. Strong relationships balance discovery and familiarity instead of choosing one permanently.

Useful novelty types:

| Type | Core Feeling | Common Effect |
| --- | --- | --- |
| Personal discovery | I am still discovering who you are | hidden traits, private habits, intimacy-driven freshness |
| Emotional | you affect me in new ways | first jealousy, comfort, softness, breakthroughs |
| Experiential | we are sharing new experiences | travel, crises, milestones, relational memory expansion |
| Sexual | desire still feels alive and evolving | changing intimacy styles, fantasy exploration, deeper attraction |
| Intellectual | your mind keeps surprising me | new ideas, debate, creativity, perspective shifts |
| Identity | this relationship changes who we are | role reversal, self-concept shifts, transformational romance |
| Dynamic | our patterns keep evolving | teasing becomes affection, dominance becomes vulnerability |
| Vulnerability | deeper emotional layers keep appearing | confessions, hidden fears, emotional dependence |
| Domestic | familiarity still contains discovery | tiny habits, evolving routines, subtle affection shifts |
| Relational | the relationship itself keeps evolving | new roles, deeper commitment, new shared identity |

Novelty changes by relationship phase:

| Phase | Novelty Source |
| --- | --- |
| Early romance | mystery, attraction, uncertainty, discovery |
| Mid relationship | emotional revelation, vulnerability, dynamic changes, deeper intimacy |
| Long-term relationship | rediscovery, evolving identity, changed desires, new forms of closeness |

Novelty and stability should be balanced:

| Balance | Result |
| --- | --- |
| high novelty + low stability | chaos, obsession, emotional volatility |
| high stability + low novelty | comfort and reliability with stagnation risk |
| balanced novelty + stability | sustainable romantic vitality |

Attachment changes how novelty appears:

| Attachment | Novelty Pattern |
| --- | --- |
| Secure | balanced exploration |
| Anxious | novelty through emotional intensity |
| Avoidant | novelty through distance and mystery |
| Fearful | novelty through chaos and unpredictability |

Chemistry types draw novelty from different places:

| Chemistry Type | Novelty Source |
| --- | --- |
| Banter | interaction unpredictability |
| Tension | unresolved escalation |
| Emotional | deeper emotional discovery |
| Intellectual | new perspectives |
| Sexual | evolving desire |
| Devotional | discovering deeper significance |

Long-term romance survives when people continue emotionally discovering each other. Mystery does not need to remain total; the characters simply need to keep evolving enough for curiosity to stay alive.

Failure modes:

| Failure | Result |
| --- | --- |
| artificial novelty | drama, forced jealousy, unnecessary instability |
| novelty starvation | repetitive routines, static interactions, emotional disengagement |
| instability addiction | chaos mistaken for discovery |

The strongest novelty usually comes from emotional evolution, not random events: a guarded character becoming affectionate, teasing becoming sincere, rivalry becoming devotion, or independence becoming chosen closeness.

Novelty can evolve:

```text
strangers
-> tension
-> intimacy
-> partnership
-> domesticity
-> rediscovery
-> deeper partnership
```

Useful novelty variables:

| Variable | Meaning |
| --- | --- |
| Novelty need | desire for stimulation and discovery |
| Curiosity persistence | continued interest in the partner |
| Adaptation speed | how quickly interactions normalize |
| Exploration desire | openness to change and newness |
| Emotional evolution | degree of psychological growth |
| Routine tolerance | comfort with familiarity |
| Rediscovery capacity | ability to find depth inside familiarity |
| Dynamic flexibility | ability for relationship patterns to evolve |
| Excitement dependency | reliance on stimulation |
| Novelty-stability balance | whether discovery remains sustainable |
| Artificial novelty risk | chance newness is created through forced drama |
| Novelty starvation risk | chance repetition flattens engagement |
| Instability confusion risk | chance chaos is mistaken for novelty |

Novelty equation:

```text
curiosity
+ emotional evolution
+ rediscovery
+ stable familiarity
= lasting romantic vitality
```

### Stability

Stability is the degree to which a relationship feels emotionally reliable, resilient, predictable, sustainable, and secure over time. It answers: can this relationship continue safely over time?

Stability is not lack of passion, emotional flatness, absence of conflict, or boring routine. Healthy stability means the relationship remains emotionally survivable during vulnerability, stress, conflict, or change.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Stability | consistency and resilience |
| Comfort | emotional ease |
| Safety | vulnerability survivability |
| Commitment | long-term choosing |
| Compatibility | sustainable fit |
| Routine | repeated behavior patterns |

Useful stability components:

| Component | Core Feeling | Common Evidence |
| --- | --- | --- |
| Emotional consistency | your emotional presence is reliable | stable affection, predictable care, steady reactions |
| Conflict stability | conflict does not threaten the relationship | repair, accountability, non-destructive arguing |
| Behavioral reliability | I can trust your actions | showing up, keeping promises, dependable patterns |
| Attachment stability | the emotional bond is durable | reduced abandonment fear, lower hypervigilance |
| Identity stability | the relationship still feels like itself under pressure | rituals, shared tone, "we come back" identity |
| Commitment stability | the future feels emotionally durable | future language, exclusivity consistency |
| Intimacy stability | closeness remains safe over time | vulnerability not weaponized, affection survives conflict |
| Routine stability | our connection exists in everyday life | habits, domestic rhythms, repeated care |

Stability enables deeper intimacy because defenses lower when the relationship feels less temporary. Without stability, high chemistry can become exhausting, hypervigilant, chaotic, emotionally unsafe, or unsustainable.

Stability and excitement should be balanced:

| Balance | Result |
| --- | --- |
| high excitement + low stability | obsession, volatility, emotional addiction |
| high stability + low excitement | comfort, predictability, possible stagnation |
| high excitement + high stability | desire, trust, and consistency coexist |

Attachment changes the stability challenge:

| Attachment | Stability Challenge |
| --- | --- |
| Secure | maintaining connection through change |
| Anxious | fear of instability or abandonment |
| Avoidant | fear of engulfment through stability |
| Fearful | instability becoming normalized |

Conflict style changes stability pressure:

| Conflict Style | Stability Impact |
| --- | --- |
| Repair-oriented | increases stability |
| Explosive | destabilizes if unrepaired |
| Avoidant | creates slow erosion risk |
| Chaotic | creates inconsistent stability |
| Accountable | strengthens resilience |

Stability changes across phases:

| Phase | Stability Pattern |
| --- | --- |
| Early romance | low stability is normal because expectations and attachment are unclear |
| Mid relationship | stability forms through repair, consistency, vulnerability, and expectation alignment |
| Long-term relationship | stability becomes emotional infrastructure through routines, secure attachment, and identity continuity |

Healthy stability is predictable care, not predictable boredom. The runtime should preserve emotional reliability without flattening novelty, playfulness, desire, or growth.

Failure modes:

| Failure | Result |
| --- | --- |
| false stability | calm created by suppressed conflict, avoidance, or emotional distance |
| hyper-instability | repeated breakups, jealousy loops, inconsistency, unresolved conflict |
| stagnation | low novelty, low progression, low vulnerability, emotional numbness |

Stability is usually most powerful when earned. Conflict, vulnerability, fear, misunderstanding, repair, and emotional risk can make later reliability feel meaningful instead of automatic.

Stability can evolve:

```text
chemistry
-> uncertainty
-> attachment
-> conflict
-> repair
-> emotional safety
-> stability
-> deep partnership
```

Useful stability variables:

| Variable | Meaning |
| --- | --- |
| Emotional consistency | reliability of emotional presence |
| Conflict resilience | ability to survive rupture |
| Repair reliability | consistency of reconnection |
| Behavioral reliability | trustworthiness of actions |
| Attachment security | stability of emotional bond |
| Identity stability | resilience of the shared relationship identity |
| Commitment durability | long-term persistence |
| Intimacy persistence | closeness survivability |
| Routine integration | daily life embeddedness |
| Predictability | behavioral consistency |
| Stability satisfaction | comfort with relationship calmness |
| False stability risk | chance calm is avoidance rather than security |
| Hyper-instability risk | chance volatility becomes normalized |
| Stagnation risk | chance stability becomes emotionally static |

Stability equation:

```text
consistency
+ repair
+ emotional safety
+ time
= survivable intimacy
```

### Consistency

Consistency is the reliable repetition of emotionally meaningful behavior over time. It answers: can I emotionally rely on you repeatedly, not just occasionally?

Consistency is not emotional flatness, predictability without depth, or lack of spontaneity. Healthy consistency means care remains emotionally recognizable over time: affection does not disappear unpredictably, repair keeps happening, vulnerability remains survivable, and the relationship continues being chosen.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Consistency | repeated reliable behavior |
| Stability | overall relationship durability |
| Routine | repeated habits |
| Reliability | dependability |
| Predictability | expectation certainty |

Consistency is behavioral continuity with emotional meaning. It turns isolated moments into trust architecture.

Useful consistency forms:

| Form | Core Feeling | Common Evidence |
| --- | --- | --- |
| Emotional consistency | your emotional presence is reliable | affection remains recognizable, reactions are understandable |
| Behavioral consistency | your actions align repeatedly | keeping promises, showing up, remembering important things |
| Reassurance consistency | you continue affirming us | check-ins, reassurance after conflict, ongoing prioritization |
| Conflict consistency | conflict follows survivable patterns | no abandonment, repair attempts, accountability |
| Affection consistency | care remains visible | touch, teasing, attentiveness, romantic effort |
| Vulnerability consistency | opening up remains safe | disclosures are handled carefully and not weaponized |
| Presence consistency | you emotionally remain present | staying after conflict, availability during stress |
| Identity consistency | the relationship still feels like itself | rituals, recognizable tone, values, mutual care |

Consistency and intensity should be balanced:

| Balance | Result |
| --- | --- |
| high intensity + low consistency | obsession, volatility, hypervigilance |
| high consistency + low intensity | calm, reliability, possible stagnation |
| high consistency + meaningful intensity | emotionally secure passion |

Attachment changes the consistency challenge:

| Attachment | Consistency Challenge |
| --- | --- |
| Secure | maintaining emotional presence |
| Anxious | hyper-detecting inconsistency |
| Avoidant | sustaining emotional availability |
| Fearful | alternating closeness and withdrawal |

Consistency is one of the strongest creators of emotional safety because repeated safe experiences teach vulnerability survivability. One apology does not rebuild trust; consistent changed behavior rebuilds the emotional architecture.

Long-term romance deepens through accumulated consistency: continued affection, repeated support, remembered preferences, predictable care, emotional reliability, and ordinary proof that care is not occasional.

Failure modes:

| Failure | Result |
| --- | --- |
| inconsistent affection | hot/cold behavior, anxiety, obsession loops, hypervigilance |
| false consistency | calm created by suppressed conflict, distance, or avoided vulnerability |
| rigid consistency | static relationship, low novelty, over-predictability |

The strongest consistency feels intentional: repeatedly staying, repeatedly choosing, repeatedly repairing, and repeatedly noticing emotional needs. Small repeated actions usually matter more than rare dramatic declarations.

Consistency can evolve:

```text
attraction
-> repeated interaction
-> repeated care
-> predictable safety
-> trust
-> emotional security
-> stable intimacy
```

Useful consistency variables:

| Variable | Meaning |
| --- | --- |
| Emotional reliability | steadiness of emotional presence |
| Behavioral reliability | consistency of actions |
| Affection stability | consistency of care signals |
| Repair reliability | consistency of reconnection |
| Vulnerability safety | reliability of emotional acceptance |
| Reassurance frequency | regularity of emotional confirmation |
| Conflict consistency | survivability of rupture patterns |
| Presence durability | tendency to remain emotionally available |
| Identity consistency | relationship still feeling like itself |
| Predictability comfort | tolerance for emotional variation |
| Attachment security | confidence in continuity |
| Intentionality signal | care feels chosen, not accidental |
| Inconsistency sensitivity | reaction to disruptions in patterns |
| False consistency risk | chance calm is avoidance rather than care |
| Rigid consistency risk | chance reliability becomes emotional static |

Consistency equation:

```text
repeated care
+ reliable repair
+ recognizable affection
+ time
= believable love
```

### Emotional Intensity

Emotional intensity is the degree of emotional activation, psychological impact, attachment force, vulnerability weight, and emotional significance experienced in the relationship. It answers: how deeply and powerfully does this relationship affect me emotionally?

Intensity is not automatically love, compatibility, safety, stability, or health. A relationship can be intensely emotional but unsafe, or deeply loving without constant activation. Strong long-term romance often balances intensity, safety, and stability.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Emotional intensity | emotional force and activation |
| Passion | romantic or sexual emotional energy |
| Intimacy | closeness and knowing |
| Attachment | emotional bonding |
| Chemistry | interactional charge |
| Drama | externalized conflict or escalation |

Intensity is about emotional impact magnitude. It creates fixation, urgency, emotional acceleration, memorable turning points, and the sense that the relationship changes the character.

Useful intensity sources:

| Source | Core Feeling | Common Effect |
| --- | --- | --- |
| Vulnerability | exposure carries major risk | confessions, breakdowns, reassurance-seeking, intimacy gravity |
| Tension | unresolved pressure builds | restraint, almost-confessions, forbidden attraction |
| Attachment | emotional centrality overwhelms | fear of loss, dependency, devotion, high stakes |
| Conflict | rupture threatens security | betrayal, withdrawal, abandonment fear |
| Sexual | desire overwhelms composure | anticipation, restraint battles, vulnerability mixed with desire |
| Devotional | prioritization feels profound | loyalty, sacrifice, reverence, identity-shaping attachment |
| Chaotic | unpredictability activates | push-pull, flooding, addictive or exhausting cycles |
| Transformational | the relationship changes the self | healing, awakening, worldview shifts |
| Forbidden | suppression amplifies feeling | secrecy, risk, anticipation |
| Mutual recognition | ambiguity collapses for both | mutual confession, reunion, emotional acknowledgment |

High-intensity relationships produce strong reactions, fixation, heightened vulnerability, emotional volatility, and dramatic attachment. Low-intensity relationships may feel calm, steady, safe, and grounded, but can lack urgency or dramatic chemistry. Balanced intensity preserves deep emotional significance without chronic instability.

Attachment changes intensity:

| Attachment | Intensity Pattern |
| --- | --- |
| Secure | balanced intensity |
| Anxious | heightened attachment intensity |
| Avoidant | suppressed but powerful intensity |
| Fearful | unstable high intensity |

Tropes draw intensity from different sources:

| Trope | Common Intensity Source |
| --- | --- |
| Enemies to lovers | conflict and tension |
| Friends to lovers | suppressed attachment |
| Forbidden romance | risk and restraint |
| Slow burn | accumulated pressure |
| Soulmate romance | existential significance |
| Healing romance | vulnerability and safety |
| Obsession romance | emotional fixation |

Intensity often increases when emotional leverage shifts, composure cracks, dominant characters become vulnerable, guarded characters lose restraint, or a small gesture carries a large amount of relationship history.

Early intensity often comes from uncertainty, novelty, and attraction. Long-term intensity often comes from devotion, emotional depth, shared history, intimacy, and survival. The runtime should allow intensity to evolve rather than requiring constant chaos to keep the relationship powerful.

Failure modes:

| Failure | Result |
| --- | --- |
| intensity addiction | chaos mistaken for love, repeated jealousy or breakup cycles |
| intensity collapse | all tension disappears and the relationship becomes static |
| artificial intensity | repetitive conflict, forced jealousy, shallow drama loops |

Intensity without intimacy feels consuming but unstable. Intimacy without intensity can feel safe but flat. The strongest romances cultivate emotionally safe intensity: high emotional meaning density inside enough trust to survive it.

Intensity can evolve:

```text
attraction intensity
-> tension intensity
-> vulnerability intensity
-> attachment intensity
-> devotion intensity
-> identity-level intensity
```

Useful emotional intensity variables:

| Variable | Meaning |
| --- | --- |
| Attachment depth | emotional centrality |
| Emotional reactivity | intensity of reactions |
| Vulnerability weight | emotional risk magnitude |
| Fear of loss | attachment threat sensitivity |
| Obsession tendency | fixation potential |
| Emotional saturation | overwhelm threshold |
| Devotional intensity | prioritization depth |
| Tension density | unresolved emotional pressure |
| Identity impact | degree of psychological change |
| Intensity-safety balance | whether activation remains survivable |
| Intensity addiction risk | chance chaos is being mistaken for love |
| Intensity collapse risk | chance emotional force disappears into stagnation |
| Artificial intensity risk | chance drama is generated without emotional growth |

Emotional intensity equation:

```text
emotional significance
+ vulnerability weight
+ attachment depth
+ psychological impact
= transformative emotional intensity
```

### Challenge

Challenge is the degree to which a partner emotionally, intellectually, psychologically, behaviorally, or morally pushes another person beyond comfort, stagnation, ego, assumptions, or emotional defenses. It answers: how does this person disrupt, stimulate, or expand me?

Challenge is not automatically conflict, hostility, incompatibility, or toxicity. Healthy challenge creates growth, stimulation, and emotional movement without humiliation, chronic instability, or emotional destruction.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Challenge | stimulation through resistance or growth pressure |
| Conflict | active disagreement |
| Competition | comparative striving |
| Tension | unresolved emotional pressure |
| Criticism | evaluative judgment |

Challenge often feels energizing. Conflict often feels threatening. The runtime should separate a partner who stimulates growth from a partner who makes the relationship unsafe.

Useful challenge types:

| Type | Core Feeling | Common Effect |
| --- | --- | --- |
| Intellectual | you stimulate my mind | debate, banter, perspective clashes, fascination |
| Emotional | you make me confront avoided feelings | honesty, reassurance demands, emotional exposure |
| Identity | you disrupt who I thought I was | guardedness softens, self-concept shifts |
| Competitive | you push me to rise | rivalry, competence comparison, admiration |
| Moral | you challenge my ethics or worldview | ideological pressure, redemption, principled disagreement |
| Emotional regulation | you destabilize my composure | teasing, jealousy, attraction panic, emotional cracks |
| Vulnerability | you make openness harder to avoid | persistent care, deep understanding, softening |
| Sexual | you create tension and anticipation | provocation, restraint, escalation pacing |
| Autonomy | you test closeness versus selfhood | commitment fear, dependence, intimacy pressure |
| Stability | you test whether this survives reality | stress, routine, jealousy, long-term compatibility |

Challenge and safety should be balanced:

| Balance | Result |
| --- | --- |
| high challenge + low safety | volatility, obsession, exhaustion |
| high safety + low challenge | comfort, calm, possible stagnation |
| balanced challenge + safety | growth-oriented intimacy |

Tropes often use challenge as their engine:

| Trope | Common Challenge |
| --- | --- |
| Enemies to lovers | ideological and emotional challenge |
| Rivals to lovers | competence challenge |
| Friends to lovers | emotional risk challenge |
| Forbidden romance | social or moral challenge |
| Healing romance | vulnerability challenge |
| Slow burn | restraint challenge |
| Redemption romance | moral and trust challenge |

Attachment changes the challenge pattern:

| Attachment | Challenge Pattern |
| --- | --- |
| Secure | healthy growth challenge |
| Anxious | reassurance challenge |
| Avoidant | intimacy and autonomy challenge |
| Fearful | stability and trust challenge |

Challenge is one of the strongest chemistry generators when it combines with responsiveness and admiration. Rivals, teasing dynamics, opposites attract, and intellectual pairings often become compelling because challenge keeps both characters emotionally engaged.

Challenge also creates power negotiation: refusing surrender, provoking reactions, testing confidence, resisting control, competing intellectually, or forcing emotional self-confrontation. It becomes romantic when both people remain engaged and the relationship remains safe enough to absorb the pressure.

Healthy challenge often becomes supportive transformation: encouraging openness, challenging self-destructive patterns, expanding worldview, or helping someone become braver, softer, steadier, or more honest.

Failure modes:

| Failure | Result |
| --- | --- |
| excessive challenge | exhaustion, instability, chronic friction, inability to rest |
| no challenge | stagnation, emotional flattening, lost fascination |
| destructive challenge | humiliation, contempt, coercion, invalidation, safety loss |

Challenge can evolve:

```text
initial challenge
-> fascination
-> emotional destabilization
-> admiration
-> vulnerability
-> growth partnership
```

Useful challenge variables:

| Variable | Meaning |
| --- | --- |
| Stimulation need | desire for engagement and challenge |
| Conflict tolerance | comfort with friction |
| Growth orientation | openness to change |
| Ego sensitivity | reactivity to challenge |
| Competitiveness | attraction to rivalry |
| Vulnerability resistance | resistance to emotional challenge |
| Transformation readiness | openness to identity change |
| Stability need | tolerance for emotional disruption |
| Curiosity | desire for discovery |
| Challenge-safety balance | whether pressure remains growth-supporting |
| Admiration potential | chance challenge becomes respect |
| Destructive challenge risk | chance pressure becomes harm |
| Exhaustion risk | chance challenge prevents rest |
| Stagnation risk | chance no challenge flattens the bond |

Challenge equation:

```text
stimulation
+ resistance
+ safety
+ growth orientation
= romantic challenge
```

### Chemistry Types

Chemistry is the emotional pattern of attraction between two people. It is not compatibility, love, attachment, trope, or intimacy. It explains why their interactions feel charged.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Compatibility | long-term sustainability |
| Attraction | desire or interest |
| Attachment | emotional bonding |
| Chemistry | interaction charge |
| Intimacy | emotional closeness |

High chemistry with low compatibility can produce addictive but unstable romance. High compatibility with low chemistry can produce a stable but flat relationship. The runtime should track chemistry so dialogue rhythm, scene feel, flirt style, tension, and pacing do not collapse into a single attraction value.

Useful chemistry types:

| Chemistry | Core Feeling | Common Effect |
| --- | --- | --- |
| Banter | talking to you is stimulating | wit, reaction-seeking, playful attachment |
| Tension | something unresolved exists | charged silence, denial, hyper-awareness |
| Comfort | being near you regulates me | safety, dependency, emotional ease |
| Intellectual | your mind excites me | debate, admiration, fascination |
| Sexual | physical attraction overwhelms restraint | touch awareness, escalation pressure |
| Emotional | you understand me | rapid significance, trust acceleration |
| Chaotic | you destabilize me | volatility, impulsivity, dependency |
| Protective | I care for your wellbeing | safety, caretaking, trust |
| Devotional | you become emotionally central | loyalty, sacrifice, emotional gravity |
| Oppositional | you challenge my worldview | fixation, transformation, friction |
| Domestic | life feels natural with you | sustainability, ordinary intimacy |
| Melancholic | loving you hurts beautifully | bittersweet depth, fragile attachment |
| Predatory | we are emotionally hunting each other | intense pursuit, power play, requires consent |
| Soft longing | I quietly ache for you | restraint, small gestures, delayed confession |
| Transformational | knowing you changes who I am | identity shift, existential intimacy |

Chemistry combinations create relationship flavor:

| Combination | Dynamic |
| --- | --- |
| banter + tension | addictive flirtation |
| comfort + emotional | healing intimacy |
| sexual + chaotic | unstable obsession |
| intellectual + oppositional | rivals energy |
| protective + soft longing | devastating slow burn |
| devotional + melancholic | tragic epic romance |
| domestic + playful | cozy long-term love |
| tension + emotional | emotionally intense slow burn |

Chemistry should evolve. For example, enemies to lovers might move from oppositional chemistry to banter chemistry to tension chemistry to sexual chemistry to emotional chemistry to devotional chemistry. That progression gives the relationship payoff without requiring a rigid dialogue tree.

Architecture formula:

```text
trope
+ attachment styles
+ power dynamic
+ emotional tone
+ chemistry type
+ pacing profile
= relationship behavior
```

### Sexual Chemistry

Sexual chemistry is the felt tension, magnetism, and responsiveness related to physical and erotic attraction between two adult characters. It is not love, compatibility, libido, or emotional intimacy. It is about how bodies, attention, restraint, confidence, desire, and anticipation affect the interaction psychologically.

This layer must remain adult-gated and boundary-controlled by the app. If the adult module is disabled, if consent/reciprocity is not present, or if a minor NPC is present in the scene, sexual chemistry should not escalate; the runtime can preserve non-explicit romantic tension or shift the scene away.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Attraction | I find you appealing |
| Sexual chemistry | interaction with you creates erotic tension |
| Libido | general sexual drive |
| Intimacy | emotional closeness |
| Compatibility | long-term relational fit |

Sexual chemistry usually comes from tension plus responsiveness, not simple attractiveness. The key runtime question is: does this person affect the character physically and psychologically, and do both characters respond to that effect?

Core components:

| Component | Meaning |
| --- | --- |
| Physical awareness | body, proximity, and gesture attention |
| Tension | unresolved attraction |
| Desire suppression | restraint against acting |
| Responsiveness | mutual reaction intensity |
| Escalation comfort | comfort with increasing intimacy |
| Erotic confidence | confidence expressing attraction |
| Vulnerability linkage | how much emotion affects desire |
| Touch sensitivity | emotional impact of touch |
| Anticipation | buildup intensity |

Useful adult-gated modes:

| Mode | Core Feeling | Runtime Behavior |
| --- | --- | --- |
| Slow burn | this tension is consuming us | awareness, suppression, accidental intimacy, near-moments |
| Explosive | we lose composure around each other | rapid escalation pressure, destabilization, volatility checks |
| Playful | flirting itself is pleasurable | teasing, humor, response-seeking |
| Devotional | desire is emotionally significant | attentiveness, careful touch, emotional presence |
| Dominance-tension | control becomes charged | confidence, challenge, power shifts, consent checks |
| Emotional | desire deepens because I feel seen | vulnerability intensifies attraction |
| Forbidden | we should not want this | secrecy, risk, suppression, consequence awareness |
| Soft domestic | comfort itself becomes attractive | routine affection, relaxed attraction, long-term realism |

Sexual chemistry changes by relationship phase:

| Phase | Focus |
| --- | --- |
| Early | awareness, ambiguity, nervousness, subtle flirting |
| Mid escalation | restraint battles, jealousy, proximity, destabilization |
| Established | responsiveness, trust, comfort, attentiveness, anticipation |

It should also interact with attachment and tone:

| Attachment | Sexual Chemistry Tendency |
| --- | --- |
| Secure | balanced and emotionally integrated |
| Anxious | intense and reassurance-seeking |
| Avoidant | tension-heavy and restrained |
| Fearful | volatile push-pull chemistry |

| Tone | Result |
| --- | --- |
| Yearning | aching tension |
| Playful | flirt-heavy attraction |
| Chaotic | unstable intensity |
| Tender | emotionally intimate desire |
| Melancholic | bittersweet longing |
| Devotional | emotionally profound attraction |

Sexual chemistry is often strongest when emotional meaning and physical attraction overlap:

```text
physical attraction
-> tension
-> emotional vulnerability
-> attachment
-> emotionally meaningful desire
```

Strong adult romance equation:

```text
high attraction
+ high restraint
+ high emotional significance
= intense sexual chemistry
```

#### Desire Style And Chemistry Variation

Desire style is the characteristic way a person experiences, activates, expresses, regulates, pursues, interprets, and emotionally connects to attraction, arousal, romantic longing, and sexual interest. It is not libido, kink, or attraction alone. It governs how desire emotionally activates and behaves.

Useful desire styles:

| Style | Activation Pattern | Risk |
| --- | --- | --- |
| Spontaneous | attraction activates quickly and internally | intensity without compatibility |
| Responsive | desire emerges through emotional context | mismatch with fast escalation |
| Tension-driven | unresolved pressure fuels desire | instability addiction |
| Emotional intimacy | safety and vulnerability intensify desire | hurt if intimacy is inconsistent |
| Devotional | significance and prioritization deepen desire | over-centralization |
| Pursuit-oriented | chase and uncertainty intensify desire | desire drops when stable |
| Security-based | reassurance and attachment enhance desire | vulnerable to safety loss |
| Validation-driven | feeling wanted activates desire | reassurance dependency |
| Power dynamic | control, surrender, challenge, or protection activate desire | must remain consent-bound |
| Intellectual | mental stimulation and competence activate desire | emotional distance risk |
| Forbidden | risk and suppression intensify desire | consequence and secrecy pressure |
| Sensory/sensual | atmosphere, touch, voice, and proximity activate desire | sensory mismatch |
| Obsessive | desire becomes psychologically consuming | fixation and autonomy risk |
| Slow burn | accumulated meaning deepens desire | stagnation if thresholds never cross |
| Chaotic | instability intensifies attraction | unsustainable cycles |

Libido style is the characteristic way a person experiences, regulates, expresses, initiates, sustains, suppresses, prioritizes, and emotionally connects to sexual desire over time. It is not merely high versus low libido. Libido is contextual: stress, attachment, emotional safety, novelty, conflict, trust, reassurance, and relationship stage can all change how desire behaves inside a specific relationship.

Keep libido distinct from adjacent systems:

| Concept | Meaning |
| --- | --- |
| Libido | desire intensity and frequency over time |
| Desire style | how attraction activates psychologically |
| Sexual compatibility | erotic fit between partners |
| Sexual chemistry | interactional erotic charge |
| Intimacy style | closeness structure |

Useful libido styles:

| Style | Pattern | Risk |
| --- | --- | --- |
| High stable | consistent desire with lower contextual fluctuation | mismatch with lower-libido partners |
| Responsive | desire emerges after emotional engagement begins | misread as disinterest if rushed |
| Tension-driven | uncertainty and anticipation intensify desire | tension dependence |
| Security-based | emotional safety increases desire | desire drops when safety is damaged |
| Novelty-dependent | stimulation and newness sustain desire | routine stagnation risk |
| Attachment-reactive | attachment state strongly alters desire | anxious fluctuation |
| Avoidant | desire is strongest with distance or reduced pressure | post-intimacy withdrawal |
| Obsessive | desire becomes psychologically consuming | fixation and autonomy risk |
| Devotional | emotional significance intensifies desire | over-centralization |
| Chaotic | instability amplifies desire | destructive cycles |
| Low reactive | desire exists but activates slowly and contextually | invisibility or pressure risk |

Useful libido variables include libido intensity, libido activation style, stress sensitivity, security dependence, novelty dependence, attachment influence, intimacy integration, pursuit reactivity, and libido stability. The runtime should avoid static libido: the same character can experience intense desire in one relationship and muted desire in another because libido interacts with emotional chemistry and psychological safety.

Realistic sexual chemistry variation means different pairings should feel erotically, emotionally, psychologically, rhythmically, and energetically different. Chemistry is not generic hotness; it emerges from desire style, emotional dynamics, tension structure, attachment interaction, power exchange, vulnerability, and psychological activation.

Useful chemistry variations:

| Variation | Engine | Feel |
| --- | --- | --- |
| Tension-based | restraint + anticipation + unresolved desire | electrically unresolved |
| Emotional intimacy | vulnerability + safety + openness | consuming and safe |
| Competitive | challenge + admiration + ego stimulation | sharp and stimulating |
| Devotional | prioritization + reverence + focus | sacred and consuming |
| Playful | interaction itself feels pleasurable | lively and addictive |
| Protective | safety + caretaking + trust | calming and attached |
| Forbidden | risk + suppression + taboo | dangerous and intoxicating |
| Obsessive | fixation + centralization + hyperfocus | psychologically consuming |
| Soft domestic | familiarity + comfort + habitual intimacy | warm and lived-in |
| Chaotic | instability + unpredictability | addictive but unsafe |
| Intellectual | mental stimulation + curiosity | mentally erotic |
| Slow-burn | accumulated meaning over time | devastating when payoff lands |

Chemistry variation should affect body language: soft chemistry uses relaxed closeness and lingering touch, tension chemistry uses interrupted touch and intense eye contact, competitive chemistry uses smirks and reaction watching, and domestic chemistry uses casual proximity and routine touch.

Failure modes:

| Failure | Result |
| --- | --- |
| Generic chemistry | every pairing feels the same |
| Constant maximal intensity | tenderness and pacing disappear |
| Purely physical chemistry | no psychological or emotional structure |
| Desire style mismatch ignored | attraction feels incoherent |

### Trust Mechanics

Trust mechanics govern how emotional safety, reliability, vulnerability, confidence, and relational belief are built, damaged, tested, repaired, and maintained over time. Trust answers: what emotional risks am I willing to take with you?

Trust is not a single number, blind belief, or permanent once earned. Trust is layered emotional prediction: what do I believe will happen if I become vulnerable with you?

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Trust | belief in emotional reliability and safety |
| Emotional safety | feeling vulnerability is survivable |
| Faith | emotional belief without certainty |
| Commitment | long-term choosing |
| Dependability | behavioral reliability |

Trust specifically governs emotional risk tolerance.

Core trust dimensions:

| Trust Type | Meaning | Runtime Use |
| --- | --- | --- |
| Emotional trust | you will not hurt my feelings carelessly | validation, care with feelings, non-cruel reactions |
| Reliability trust | you show up consistently | promises, follow-through, dependable patterns |
| Vulnerability trust | I can expose myself emotionally | confessions, shame, fear, hidden self |
| Loyalty trust | you choose me consistently | prioritization, exclusivity consistency, public support |
| Conflict trust | we survive fights safely | repair, accountability, staying engaged |
| Physical trust | touch and physical safety feel comfortable | proximity, comfort touch, bodily safety |
| Sexual trust | desire and boundaries are safe with you | adult-gated vulnerability, consent, responsiveness |
| Autonomy trust | I can stay myself while loving you | boundaries, non-coercive closeness, agency |

Trust forms through repeated emotionally meaningful experiences with predictable outcomes:

```text
vulnerability
-> safe response
-> trust increase
-> deeper vulnerability possible
```

or:

```text
vulnerability
-> ridicule, abandonment, or betrayal
-> trust collapse
```

Trust should never be one stat. A character may trust emotional care but not loyalty, physical safety but not vulnerability handling, or reliability but not conflict survival.

Trust acts like intimacy permission architecture. Different relationship events require different trust thresholds:

| Event | Trust Requirement |
| --- | --- |
| Teasing | low |
| Emotional confession | medium-high vulnerability trust |
| Dependency | high emotional and reliability trust |
| Trauma disclosure | very high vulnerability and emotional trust |
| Sexual vulnerability | variable/high sexual and physical trust |
| Commitment | high loyalty and reliability trust |
| Emotional surrender | extremely high vulnerability, autonomy, and conflict trust |

Trust damage should persist and target the specific layer harmed:

| Rupture | Primary Trust Damage |
| --- | --- |
| Broken promise | reliability trust |
| Mocked vulnerability | vulnerability trust |
| Abandonment during conflict | conflict trust |
| Emotional replacement | loyalty trust |
| Coercive pressure | autonomy, physical, or sexual trust |
| Careless cruelty | emotional trust |

Trust repair is behavioral consistency over time, not a single apology:

```text
accountability
-> changed behavior
-> repeated consistency
-> gradual emotional safety restoration
```

Attachment affects trust pacing:

| Attachment | Trust Pattern |
| --- | --- |
| Secure | gradual and flexible |
| Anxious | fast trust plus fragility |
| Avoidant | slow trust building |
| Fearful | intense but unstable |

Conflict is one of the strongest trust tests:

```text
rupture
-> repair
-> increased conflict trust
```

or:

```text
rupture
-> abandonment
-> trust collapse
```

Chemistry and trust should remain separate. Explosive chemistry with low trust creates obsession, volatility, and toxic tension. Long-term romance usually needs chemistry plus trust.

Trust can become part of relationship identity through narratives such as "you always come back", "I can tell you anything", "we survive conflict", or "you protect my vulnerability." These narratives become attachment anchors.

Useful trust variables:

| Variable | Meaning |
| --- | --- |
| Emotional trust | belief emotions are safe |
| Reliability trust | consistency confidence |
| Vulnerability trust | openness safety |
| Loyalty trust | confidence in prioritization |
| Conflict trust | belief relationship survives tension |
| Physical trust | comfort with touch and bodily safety |
| Sexual trust | comfort with adult-gated desire and boundaries |
| Autonomy trust | confidence individuality is respected |
| Repair trust | belief repair is possible |
| Trust fragility | how easily trust destabilizes |
| Trust recovery speed | ability to rebuild after rupture |
| Trust persistence | durability of safety over time |
| Trust damage memory | how strongly rupture history remains active |
| Threshold readiness | whether enough trust exists for an event |
| Faith under uncertainty | willingness to believe without full proof |
| Dependability evidence | accumulated proof through action |
| Vulnerability risk tolerance | emotional risks the character can take |

Trust equation:

```text
repeated safe vulnerability
+ reliability
+ repair
+ time
= predictive emotional safety
```

### Rupture Severity

Rupture severity is the degree of emotional, psychological, relational, and attachment damage caused by conflict, betrayal, disconnection, boundary violation, or a destabilizing event. It answers: how deeply did this event damage emotional safety, trust, attachment, or relationship identity?

Rupture severity is not determined only by objective event size. It depends on emotional meaning, attachment significance, relationship context, personal fears, existing trust state, and what the event changes about future safety expectations.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Rupture | emotional disconnection or damage |
| Conflict | disagreement or tension |
| Betrayal | trust violation |
| Damage | emotional consequence |
| Repair | reconnection process |

Useful rupture damage dimensions:

| Dimension | Core Question | Runtime Effect |
| --- | --- | --- |
| Trust damage severity | how much did safety expectations change? | raises thresholds, hypervigilance, reassurance need |
| Attachment damage severity | how much was attachment security threatened? | panic, withdrawal, destabilization |
| Identity damage severity | how much did this damage the shared "we"? | identity fracture, symbolic repair need |
| Vulnerability damage severity | how unsafe does openness now feel? | slower intimacy, guardedness |
| Emotional safety damage severity | how dangerous does the relationship feel? | dysregulation, defensive behavior |
| Exclusivity damage severity | how threatened does uniqueness feel? | jealousy, comparison, possessiveness |
| Stability damage severity | how much did future confidence drop? | breakup fear, lifecycle regression |
| Momentum damage severity | how much did trajectory redirect negatively? | drift, fracture, negative momentum |

Rupture severity levels:

| Level | Meaning | Examples | Repair Need |
| --- | --- | --- | --- |
| 0 | no meaningful rupture | harmless mismatch, quickly clarified ambiguity | none or tiny clarification |
| 1 | minor friction | forgotten text, mild jealousy, teasing misread | clarification and reassurance |
| 2 | emotional discomfort | small disappointment, failed reassurance | validation and reconnecting gesture |
| 3 | significant rupture | hurtful argument, withdrawal, broken promise | accountability plus consistency proof |
| 4 | major attachment rupture | abandonment, betrayal, humiliation, severe invalidation | long-term safety rebuilding |
| 5 | identity-level rupture | repeated betrayal, relationship mythology collapse | transformational repair or redefinition |

Attachment styles shape rupture response:

| Attachment Style | Typical Rupture Response |
| --- | --- |
| Secure | repair-oriented distress |
| Anxious | panic and hyperactivation |
| Avoidant | withdrawal and suppression |
| Fearful | chaotic escalation and retreat |

High-severity ruptures become defining emotional memories. Betrayal during vulnerability, abandonment after confession, or humiliation during emotional openness should alter future trust, pacing, openness, expectations, and relationship momentum.

Repair effort must scale with rupture severity:

| Rupture | Repair Needed |
| --- | --- |
| Minor misunderstanding | clarification |
| Broken promise | consistency restoration |
| Betrayal | long-term trust rebuilding |
| Identity rupture | relationship redefinition and symbolic restoration |

Rupture severity redirects momentum. A relationship with secure momentum can become hypervigilant after betrayal. A relationship in drift may fracture after a smaller event because the context already weakened safety.

Failure modes:

| Failure | Result |
| --- | --- |
| No consequences | betrayal or harm is forgotten instantly |
| Infinite punishment loops | no healing progression can occur |
| Uniform rupture treatment | every conflict receives the same weight |
| Objective-only severity | context, fears, and attachment meaning are ignored |

Rupture severity equation:

```text
event meaning
+ attachment significance
+ violated trust layer
+ current relationship context
+ personal fear activation
- repair responsiveness
= rupture severity
```

The deepest ruptures are not only about pain. They are about what the pain changes inside attachment, trust, emotional safety, and future expectation.

#### Rupture Subtypes

Specific rupture subtypes identify which trust layer was wounded so repair can be psychologically targeted.

| Subtype | Core Damage | Repair Requirement |
| --- | --- | --- |
| Betrayal rupture | trust, safety, attachment, or identity collapse through meaningful violation | safety reconstruction through accountability, transparency, and repeated corrective experiences |
| Abandonment rupture | attachment collapse through absence or disconnection when presence was needed | emotional return consistency and reliable reconnection |
| Humiliation rupture | dignity, self-worth, visibility, or vulnerability safety damaged by shame exposure | dignity restoration and protected visibility |
| Broken promise rupture | reliability trust damaged by failed commitment or assurance | follow-through, consistency, and restored word credibility |
| Emotional invalidation rupture | emotional reality dismissed, minimized, mocked, or treated as illegitimate | emotional acknowledgment restoration |

Common betrayal dimensions:

| Dimension | Damage |
| --- | --- |
| Trust rupture | reliability expectations collapse |
| Emotional safety rupture | emotions no longer feel safe |
| Attachment rupture | the bond feels unstable or dangerous |
| Identity rupture | the relationship no longer means what it did |
| Exclusivity rupture | uniqueness feels compromised |
| Vulnerability rupture | openness feels dangerous |

Abandonment rupture centers loss of emotional presence. It may be physical disappearance, emotional shutdown, silence, avoidance during distress, post-vulnerability withdrawal, or lack of repair. Its core repair signal is not one apology but repeated proof of emotional return.

Humiliation rupture centers wounded dignity inside attachment. It becomes severe when vulnerability is exposed unsafely through mockery, public rejection, dismissive jokes, body or competence shaming, emotional invalidation, or privacy exposure. Repair must restore the sense that being seen by the partner is safe.

Broken promise rupture centers reliability trust. Promises become emotional future architecture; when they break, the injury asks what can be trusted about the future now. Repair requires behavioral follow-through, not larger promises.

Emotional invalidation rupture centers emotional legitimacy. It can be subtle: minimization, intellectualizing instead of empathizing, changing the subject after vulnerability, reassurance refusal, or treating emotional needs as weakness. Repair requires recognition of emotional reality before explanation.

Rupture subtype failure modes:

| Failure | Result |
| --- | --- |
| Generic betrayal | no specific trust layer is violated |
| Instant emotional reset | rupture memory vanishes unrealistically |
| Endless punishment state | repair, dissolution, or transformation never progresses |
| Repeated promises without change | words lose emotional credibility |
| Humiliation disguised as teasing | banter becomes emotional degradation |
| Logic replacing empathy | invalidation repeats under rational language |

#### Repair Arcs

Repair arcs are the story paths a relationship takes after rupture. The arc should depend on rupture type, severity, trust damage, accountability, changed behavior, and emotional readiness.

Core repair rule:

```text
repair arc
= rupture type
+ severity
+ trust damage
+ accountability
+ changed behavior
+ emotional readiness
```

Useful repair arcs:

| Repair Arc | Best For | Required Movement |
| --- | --- | --- |
| Clarification | misunderstanding, miscommunication, accidental hurt | confusion -> reaction -> clarification -> validation -> relief |
| Apology | hurtful words, emotional mistakes, small broken expectations | hurt -> recognition -> apology -> validation -> changed behavior |
| Reassurance | jealousy, abandonment fear, insecurity, replacement fear | trigger -> fear activation -> reassurance -> grounding -> renewed safety |
| Accountability | repeated mistakes, broken promises, neglect, unreliability | ownership -> no defensiveness -> repair plan -> follow-through |
| Trust rebuilding | betrayal, secrecy, loyalty rupture | shock -> accountability -> transparency -> consistency -> cautious vulnerability |
| Emotional safety | humiliation, invalidation, vulnerability betrayal | shame -> dignity restoration -> validation -> protected vulnerability |
| Presence | abandonment, withdrawal, ghosting, leaving during conflict | absence -> return -> explanation -> reassurance -> repeated staying |
| Boundary | pressure, control, autonomy or consent/space violation | recognition -> apology -> renegotiation -> demonstrated respect |
| Mutual responsibility | conflict spirals, pursuit/withdrawal, reactive fights | cooling -> both name their part -> pattern recognition -> new agreement |
| Redemption | serious betrayal, past harm, moral rupture | consequence -> accountability -> changed identity -> repeated repair behavior |
| Reconciliation | breakup, separation, estrangement | reflection -> cautious contact -> truth-telling -> renegotiated relationship |
| Non-repair | irreparable betrayal, repeated harm, no accountability | failed repair -> grief -> detachment -> closure |

Repair arc matching:

| Wound Or Rupture | Needed Repair |
| --- | --- |
| Misunderstanding | clarity |
| Insecurity | reassurance |
| Neglect | renewed presence and responsiveness |
| Broken promise | consistency |
| Betrayal | accountability and trust rebuilding |
| Humiliation | dignity restoration |
| Abandonment | reliable return |
| Boundary violation | demonstrated respect |
| Reactive conflict loop | mutual responsibility |

Important repair requirements:

| Requirement | Meaning |
| --- | --- |
| Accountability before intent defense | "I hurt you" comes before "I did not mean to" |
| Pattern change | repeated harm needs changed behavior, not only apology |
| Scaled repair | major rupture requires longer proof |
| New relationship version | reconciliation cannot simply restore the old dynamic |
| Non-repair legitimacy | not every relationship should be repairable |

Useful repair arc variables:

| Variable | Meaning |
| --- | --- |
| Repair arc | selected repair path |
| Repair readiness | capacity to begin repair |
| Accountability level | ownership of harm |
| Hurt partner openness | willingness to receive repair |
| Trust damage | amount of safety loss |
| Repair attempts | effort history |
| Changed behavior evidence | proof beyond words |
| Resentment level | unprocessed hurt |
| Forgiveness readiness | ability to move toward release |
| Validation quality | whether emotional reality is held |
| Boundary respect evidence | proof limits are now honored |
| Presence reliability | proof of emotional return |

Repair becomes believable when the repair arc matches the wound.

#### Emotional Neglect

Emotional neglect is the repeated absence, insufficiency, dismissal, avoidance, or failure of emotional responsiveness, attentiveness, validation, care, or engagement needed for connection and attachment security. It asks: what happens when my emotional needs, presence, or inner world stop feeling important to you?

Neglect is often chronic under-response rather than obvious hostility. It creates attachment erosion through repeated emotional absence.

Useful neglect forms:

| Form | Core Issue | Runtime Effect |
| --- | --- | --- |
| Emotional inattentiveness | distress or shifts go unnoticed | emotional invisibility |
| Emotional unavailability | engagement is inconsistent or absent | emotional starvation |
| Reassurance neglect | fears remain unsupported | attachment insecurity |
| Vulnerability neglect | openness receives insufficient care | vulnerability trust damage |
| Conflict neglect | repair does not occur | accumulated residue |
| Presence neglect | physical proximity lacks emotional presence | lonely attachment |
| Priority neglect | partner no longer feels prioritized | replacement or abandonment fear |
| Affection neglect | warmth, touch, or reassurance declines | attachment weakening |
| Ritual neglect | meaningful routines stop | continuity damage |
| Psychological neglect | inner self no longer feels known | loneliness inside attachment |

Neglect creates negative momentum:

```text
reduced attentiveness
-> emotional loneliness
-> reduced vulnerability
-> reduced intimacy
-> further emotional distance
```

Neglect differs from betrayal. Betrayal is sudden rupture. Neglect is slow emotional disappearance.

Repair requires renewed responsiveness: noticing again, listening again, restoring rituals, prioritizing emotionally, engaging repair, and consistently proving that the person's inner world matters.

Failure modes:

| Failure | Result |
| --- | --- |
| Invisible suffering | damage accumulates because no dramatic rupture occurs |
| One-sided emotional labor | one partner maintains all intimacy and repair |
| Emotional resignation | the neglected partner stops reaching |

Useful neglect variables:

| Variable | Meaning |
| --- | --- |
| Emotional responsiveness | attentiveness to emotional needs |
| Reassurance consistency | reliability of support |
| Presence stability | emotional availability consistency |
| Ritual maintenance | continuity of meaningful routines |
| Emotional prioritization | significance signaling |
| Vulnerability responsiveness | care after openness |
| Repair engagement | willingness to reconnect |
| Emotional visibility | feeling emotionally seen |
| Drift risk | tendency toward disengagement |

### Emotional Safety

Emotional safety is the felt sense that vulnerability, honesty, emotional needs, mistakes, fears, and authentic self-expression can exist in the relationship without punishment, humiliation, abandonment, or emotional destruction. It answers: what happens to me emotionally when I let you matter?

Attraction creates emotional exposure. Emotional safety determines whether exposure feels survivable. A relationship can have chemistry, obsession, intensity, or sexual tension while still making vulnerability feel dangerous.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Trust | belief someone is reliable |
| Emotional safety | belief vulnerability will not be weaponized |
| Comfort | emotional ease |
| Attachment | emotional bond |
| Stability | consistency over time |

Emotional safety lowers defensive behavior and increases authentic closeness. When it exists, characters become more willing to confess, apologize, need reassurance, reveal fears, express affection, communicate honestly, repair conflict, and deepen intimacy.

Useful emotional safety components:

| Component | Core Feeling | Runtime Meaning |
| --- | --- | --- |
| Vulnerability safety | I can open up without being punished | supports confession, tears, insecurity, attachment admission |
| Conflict safety | conflict will not destroy us | arguments can lead to repair instead of abandonment |
| Emotional consistency | your reactions are predictable enough to trust | lowers hypervigilance |
| Acceptance safety | I do not need perfection to remain loved | flaws and awkwardness are survivable |
| Boundary safety | my limits and autonomy are respected | prevents closeness from becoming threat |
| Reassurance safety | my fears can be soothed, not mocked | stabilizes anxious or trauma-informed dynamics |
| Repair safety | mistakes can be survived and repaired | rupture -> repair -> reconnection becomes believable |
| Nonjudgmental presence | I can exist authentically around you | creates relaxed intimacy |

Emotional safety and chemistry should be separate:

| Combination | Result |
| --- | --- |
| high chemistry + low safety | obsession, volatility, emotional addiction |
| high safety + low chemistry | comfort, stability, friendship energy |
| high chemistry + high safety | mature romance where desire and vulnerability coexist |

Attachment shapes the safety challenge:

| Attachment | Safety Challenge |
| --- | --- |
| Secure | maintaining consistency |
| Anxious | fear of abandonment |
| Avoidant | fear of engulfment or vulnerability |
| Fearful | craving safety while distrusting it |

Conflict is a primary safety test. Unsafe conflict includes humiliation, withdrawal punishment, contempt, invalidation, and manipulation. Safe conflict includes accountability, reassurance, staying emotionally engaged, and repair.

Healthy power dynamics require preserved emotional safety through responsiveness, consent, aftercare, reassurance, and respect for boundaries. Without safety, power becomes coercion, fear, and instability.

Emotional safety is built through small repeated behaviors: consistency, reassurance, repair, listening, accountability, staying during vulnerability, respecting boundaries, gentle honesty, and emotional responsiveness. Small repeated actions matter more than grand speeches.

Emotional safety and slow burns often progress like:

```text
tension
-> vulnerability
-> reassurance
-> increased safety
-> deeper vulnerability
```

Failure modes:

| Failure | Result |
| --- | --- |
| low safety | defensiveness, avoidance, masking, testing, fear-driven attachment |
| conditional safety | affection only when compliant, vulnerability mocked later |
| false safety | appears safe until conflict, jealousy, need, or vulnerability |

Emotional safety can become part of relationship identity: "We are emotionally safe for each other." This identity stabilizes the bond and makes deeper vulnerability possible.

Useful emotional safety variables:

| Variable | Meaning |
| --- | --- |
| Vulnerability safety | comfort opening emotionally |
| Conflict safety | belief relationship survives tension |
| Consistency | predictability of care |
| Boundary respect | autonomy preservation |
| Reassurance reliability | trust in emotional soothing |
| Judgment sensitivity | fear of ridicule or rejection |
| Emotional stability | regulation consistency |
| Repair trust | belief reconnection is possible |
| Authenticity comfort | ability to be genuine |
| Conditional safety risk | risk safety depends on compliance |
| False safety risk | risk safety collapses under stress |

Emotional safety equation:

```text
survived vulnerability
+ reassurance
+ consistency
+ repair
= emotional safety
```

### Caretaking

Caretaking is the expression of emotional, physical, practical, or psychological care intended to support another person's wellbeing, regulation, comfort, safety, or functioning. It answers: how do I respond when your wellbeing emotionally matters to me?

Healthy caretaking is not control, emotional parenting, martyrdom, codependency, or rescuing someone at the expense of self. It is responsive support without erasing autonomy.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Caretaking | active support and nurturing |
| Protection | safeguarding from harm |
| Rescue | solving or saving behavior |
| Codependency | unhealthy emotional overreliance |
| Emotional labor | managing emotional systems |

Caretaking becomes romantic when care gains emotional specificity and attachment meaning. Being cared for consistently changes emotional regulation because someone repeatedly notices, responds, and remains present.

Useful caretaking types:

| Type | Core Feeling | Common Evidence |
| --- | --- | --- |
| Emotional | your emotions matter to me | comfort, listening, grounding, staying during breakdowns |
| Physical | your body and comfort matter to me | illness care, food, blankets, touch-based comfort |
| Practical | I support your life functioning | organizing, responsibilities, schedules, acts of service |
| Protective | I want to keep you safe | defending, shielding, safety checks, wellbeing monitoring |
| Reassurance-based | I actively soothe your fears | validation after jealousy, conflict reassurance |
| Domestic | caring for you lives in daily routine | coffee, cooking, habitual comfort, routine support |
| Devotional | your wellbeing feels sacred to me | reverent attention, deep prioritization, responsive support |
| Mutual | we hold each other | reciprocal comfort, regulation, reassurance, support |
| Silent | I notice without needing spectacle | quiet fixes, staying nearby, nonverbal comfort |
| Transformational | your care changes my ability to trust | trauma safety, regulation through consistency, softened hyper-independence |

Attachment shapes caretaking:

| Attachment | Caretaking Pattern |
| --- | --- |
| Secure | balanced support |
| Anxious | over-caretaking for reassurance |
| Avoidant | practical or silent caretaking |
| Fearful | inconsistent intense caretaking |

Caretaking often creates emotional asymmetry: protector/protected, stabilizer/reactive partner, caretaker/wounded dynamic. That asymmetry can feel deeply intimate or emotionally imbalanced depending on reciprocity, consent, and autonomy preservation.

Healthy caretaking includes consent, responsiveness, boundaries, autonomy preservation, and reciprocity. Unhealthy caretaking includes martyrdom, fixing someone's identity, dependency encouragement, control disguised as care, and self-erasure.

Caretaking accelerates intimacy because care lowers defenses:

```text
stress
-> comfort
-> vulnerability
-> trust
-> attachment
```

Trope shapes caretaking:

| Trope | Common Caretaking Form |
| --- | --- |
| Healing romance | emotional regulation |
| Enemies to lovers | reluctant protection |
| Friends to lovers | habitual care |
| Slow burn | subtle attentiveness |
| Protector romance | safety-focused care |
| Redemption romance | restorative care |
| Domestic romance | routine integrated care |

Failure modes:

| Failure | Result |
| --- | --- |
| one-sided caretaking | burnout, resentment, imbalance, exhaustion |
| infantilizing caretaking | agency loss, autonomy loss, unhealthy dependence |
| transactional caretaking | care becomes validation-seeking, control, or manipulation |

The strongest caretaking often happens through noticing: recognizing emotional tells, remembering needs, responding before asked, and tracking subtle changes. "You notice me" is one of the deepest intimacy experiences because attention itself becomes emotional significance.

Caretaking can evolve:

```text
attraction
-> concern
-> emotional support
-> habitual care
-> mutual regulation
-> domestic partnership
```

Useful caretaking variables:

| Variable | Meaning |
| --- | --- |
| Caretaking instinct | tendency toward support |
| Emotional responsiveness | awareness of needs |
| Protective impulse | desire to safeguard wellbeing |
| Autonomy respect | support without control |
| Reassurance ability | emotional soothing capacity |
| Domestic integration | care woven into daily life |
| Burnout risk | overextension tendency |
| Reciprocity balance | mutual support balance |
| Emotional attunement | ability to notice subtle states |
| Support consent | care is welcomed rather than imposed |
| Dependency encouragement risk | chance care increases unhealthy reliance |
| Control disguised as care risk | chance support becomes control |
| Martyrdom risk | chance care requires self-erasure |
| Noticing sensitivity | ability to detect needs before explicit request |

Caretaking equation:

```text
noticing
+ responsive support
+ autonomy respect
+ reciprocity
= lived relational care
```

### Affection Expression Style

Affection expression style is how a character naturally communicates care, attachment, desire, and emotional significance. It is behavioral emotional translation: how love becomes visible.

Affection expression is not the same as love intensity, attachment depth, compatibility, or commitment level. Two characters can love equally deeply while making that love visible through completely different behaviors.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Love language | preferred affection reception |
| Affection expression style | how affection is naturally shown |
| Intimacy style | how closeness is created |
| Communication style | how emotions are expressed generally |
| Attachment style | how security and fear are regulated |

Affection expression styles:

| Style | Core Expression | Common Evidence |
| --- | --- | --- |
| Verbal | saying feelings directly | compliments, reassurance, praise, "I love you" |
| Physical | touch as emotional communication | hugs, hand holding, leaning close, habitual touch |
| Caretaking | love through wellbeing support | food, checking needs, emotional monitoring, practical help |
| Protective | safeguarding emotionally or physically | defending, walking home, checking safety, shielding |
| Teasing | affection hidden inside play and provocation | banter, playful challenge, reaction-seeking |
| Devotional | emotionally focused attentiveness | remembering everything, reverent care, prioritization |
| Quiet | subtle consistency instead of overt intensity | staying nearby, silent support, small habits |
| Service-based | solving and improving life | fixing, organizing, planning, carrying burdens |
| Attention-based | focused engagement and presence | eye contact, remembered details, active listening |
| Possessive | exclusivity and prioritization | territorial gestures, public choosing, exclusivity signals |
| Playful | joy and interaction energy | inside jokes, flirting, emotional play |
| Emotional transparency | openness itself as intimacy | confessions, vulnerability, sharing fears |
| Loyalty-based | consistency and staying | reliability, promises kept, returning after conflict |
| Sacrificial | giving something up for the bond | prioritizing partner, enduring hardship, emotional risk |
| Domestic | care woven into ordinary life | coffee, routines, bedtime rituals, automatic comfort |
| Admiration-based | respect and fascination made visible | praising competence, valuing opinions, watching quietly |
| Presence-based | staying emotionally available | sitting through distress, remaining after conflict |

Affection expression mismatch is one of the strongest realism systems. A teasing character may be trying to say "I pay special attention to you," while a partner who receives love through verbal reassurance may hear only ambiguity. Both care, but neither fully feels loved.

Attachment style often shapes expression:

| Attachment | Common Expression |
| --- | --- |
| Secure | balanced and direct |
| Anxious | expressive, reassuring, pursuit-oriented |
| Avoidant | subtle, service-based, quiet consistency |
| Fearful | inconsistent, intense, push-pull affection |

Power dynamics also shape affection expression:

| Dynamic | Common Expression |
| --- | --- |
| Dominant | guidance, protection, structured care |
| Submissive | responsiveness, receptiveness, trust signals |
| Rivals | challenge, teasing, admiration through competence |
| Devotional | attentiveness and prioritization |
| Avoidant | quiet consistency and practical care |
| Anxious | reassurance and pursuit |

Love-language reception remains useful, but it should be treated as the receiving side: what behaviors make this character feel emotionally loved and recognized. Expression and reception may differ.

Examples:

| Expression Style | Reception Need | Likely Tension |
| --- | --- | --- |
| Teasing | verbal reassurance | affection feels ambiguous |
| Service-based | quality time | care feels useful but distant |
| Quiet | emotional transparency | steadiness feels withholding |
| Protective | autonomy respect | care risks feeling controlling |
| Devotional | playful engagement | intensity may feel heavy |

Classic and expanded reception channels:

| Reception Channel | Core Emotional Meaning |
| --- | --- |
| Words of affirmation | your feelings toward me are verbally visible |
| Physical touch | closeness is physically embodied |
| Acts of service | I matter enough for you to support my life |
| Quality time | I am worth your focused presence |
| Gift giving | I remain emotionally present in your thoughts |
| Emotional reassurance | you actively soothe my fears |
| Emotional transparency | you trust me with your inner world |
| Protective behavior | my wellbeing emotionally matters |
| Devotional attention | you notice and prioritize me deeply |
| Playful engagement | you actively engage with me emotionally |
| Presence during distress | you stay when things become difficult |
| Exclusivity signals | I am uniquely significant to you |

Affection expression can evolve:

```text
teasing
-> emotionally loaded teasing
-> subtle caretaking
-> vulnerability
-> open affection
-> domestic intimacy
```

Repair is strongest when the expression style adapts to the injured character's reception need:

```text
rupture
-> identify injured reception channel
-> express repair in recognizable form
-> emotional translation success
```

The strongest affection feels specific: remembered preferences, unique rituals, targeted reassurance, intentional touch, private jokes, personalized comfort, visible respect, and presence that proves the character has been emotionally noticed.

Failure modes:

| Failure | Result |
| --- | --- |
| Affection blindness | love is expressed but not emotionally registered |
| Transactional affection | affection becomes leverage for reassurance or control |
| One-sided adaptation | one partner keeps translating while the other never learns |
| Rigid expression style | character cannot adapt affection as intimacy evolves |

Useful affection-expression variables:

| Variable | Meaning |
| --- | --- |
| Verbal expressiveness | direct emotional language tendency |
| Physical affection frequency | touch-based affection |
| Caretaking instinct | support-oriented affection |
| Protective impulse | safeguarding tendency |
| Playfulness | teasing and banter affection |
| Devotional focus | emotional prioritization |
| Emotional transparency | openness tendency |
| Presence reliability | emotional staying power |
| Attention intensity | attentiveness depth |
| Domestic integration | routine-based affection |
| Service orientation | practical help tendency |
| Loyalty consistency | affection through reliability |
| Sacrificial tendency | willingness to take costs for the bond |
| Admiration visibility | how visibly respect becomes affection |
| Possessive signaling | exclusivity and prioritization signals |
| Reception match accuracy | how well expression fits partner needs |
| Expression evolution | ability to develop new affection forms |
| Mismatch risk | chance care is missed or misread |

Affection-expression equation:

```text
care
+ behavioral signal
+ specificity
+ consistency
= visible affection
```

Felt-love equation:

```text
affection intent
+ recognizable signal
+ receiver need match
+ consistency
= felt love
```

### Intimacy

Intimacy is the progressive experience of emotional, psychological, physical, and relational closeness. It is broader than sex, affection, vulnerability, or romance alone. At its core, intimacy means: I feel emotionally close, known, and safe with you.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Attraction | desire or interest |
| Chemistry | interaction charge |
| Vulnerability | emotional exposure |
| Attachment | emotional bonding |
| Intimacy | experienced closeness |
| Dependency | emotional reliance |

The core principle is sustained mutual emotional access. Intimacy develops through exposure, reception, and consistency: one character reveals something, the other responds safely, and that pattern repeats over time. The received part matters. Vulnerability without reception can create pain, embarrassment, or rupture rather than intimacy.

Useful intimacy modes:

| Mode | Core Feeling | Examples |
| --- | --- | --- |
| Emotional | you emotionally understand me | fears, validation, reassurance, honest feeling |
| Physical | closeness through touch and presence | hand holding, leaning together, sleeping beside each other |
| Sexual | desire with emotional presence | adult-gated intimacy where trust, attentiveness, and responsiveness matter |
| Intellectual | you engage my mind deeply | debate, ideas, curiosity, shared passions |
| Domestic | our lives naturally fit together | routines, cooking, quiet coexistence, care during exhaustion |
| Vulnerability | I trust you with hidden parts of me | shame, fear, grief, trauma disclosure, breakdowns |
| Experiential | we have lived meaningful things together | hardship, travel, secrets, adventures, grief, victories |
| Silent | comfort without performance | quiet presence, instinctive understanding, eye contact |
| Protective | your wellbeing matters to me | checking in, caretaking, noticing exhaustion |
| Identity | you see who I really am | contradictions, aspirations, hidden traits, self-concept |

Intimacy usually develops in layers:

```text
attraction
-> familiarity
-> emotional safety
-> vulnerability
-> trust
-> attachment
-> domestic closeness
-> identity intimacy
```

Different tropes reorder those layers:

| Trope | Common Intimacy Order |
| --- | --- |
| Friends to lovers | emotional -> romantic -> sexual |
| Enemies to lovers | tension -> vulnerability -> trust |
| Strangers to lovers | attraction -> emotional discovery |
| Healing romance | safety -> vulnerability -> attachment |
| Slow burn | familiarity -> longing -> intimacy |
| Forbidden romance | secrecy -> emotional dependence |

Intimacy and tension should oscillate. Too much tension becomes exhausting; too much intimacy too quickly can feel flat and low-anticipation. A useful pattern is distance, closeness, fear, reassurance, and deeper closeness.

False intimacy is a major realism check. Characters may mistake obsession, dependency, constant texting, sexual intensity, or trauma dumping for genuine closeness. True intimacy requires mutual emotional recognition, safety, and repeated evidence that closeness is received and respected.

Intimacy should interact with attachment and tone:

| Attachment | Intimacy Pattern |
| --- | --- |
| Secure | gradual healthy closeness |
| Anxious | fast emotional fusion |
| Avoidant | intimacy restraint |
| Fearful | craving and fearing intimacy |

| Tone | Intimacy Feel |
| --- | --- |
| Tender | emotionally safe |
| Yearning | emotionally distant longing |
| Chaotic | unstable closeness |
| Devotional | profound emotional significance |
| Melancholic | fragile intimacy |
| Playful | light closeness |

Intimacy often comes from accumulated small signals rather than grand speeches: remembering preferences, checking if they ate, recognizing mood shifts, staying after vulnerability, habitual touch, private jokes, emotional attentiveness, automatic comfort, and consistent presence. These repeated signals create consistent emotional significance, which becomes attachment.

Intimacy should also interact with power dynamics. It can soften rigid structures when dominant characters become emotionally vulnerable, guarded characters learn to rely on someone, or emotionally reactive characters become trusted caretakers. Strong romance evolves from chemistry to trust to vulnerability to emotional dependence to integrated partnership. Weak romance stays trapped in attraction, tension, or conflict alone.

Useful intimacy variables:

| Variable | Meaning |
| --- | --- |
| Emotional safety | comfort being vulnerable |
| Familiarity | accumulated knowing |
| Reception | whether emotional exposure is met safely |
| Consistency | repeated evidence of chosen closeness |
| Trust | reliability expectation |
| Vulnerability depth | emotional exposure level |
| Reciprocity | balance of closeness |
| Comfort | ease around each other |
| Attachment | emotional centrality |
| Shared history | emotional memory accumulation |
| Domestic integration | daily life closeness |
| Emotional attunement | ability to understand emotional cues |

Core long-term principle:

```text
mutual vulnerability
+ consistent emotional safety
+ shared history
+ repeated chosen closeness
= deep intimacy
```

### Intimacy Styles

Intimacy style is the characteristic way a character creates, seeks, expresses, tolerates, and maintains closeness. Attachment style asks how do I react to emotional closeness? Intimacy style asks how do I do closeness?

Intimacy styles are emotional languages of closeness. They shape what feels meaningful, what feels overwhelming, how care is expressed, and how connection is maintained. Two characters can both be securely attached while still having very different intimacy styles.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Attachment style | fear and regulation strategy |
| Love language | preferred affection signals |
| Intimacy style | overall closeness behavior pattern |
| Chemistry | attraction energy |
| Relationship dynamic | recurring interaction loop |

Useful intimacy styles:

| Style | Closeness Method | Feels Loved Through |
| --- | --- | --- |
| Emotional | openness and vulnerability | being emotionally understood |
| Physical | touch and physical proximity | physical presence |
| Domestic | everyday life integration | consistent daily presence |
| Intellectual | mental engagement | mental stimulation |
| Playful | emotional play and interaction energy | engaged interaction |
| Protective | caretaking and safety | being emotionally safe |
| Devotional | focused emotional prioritization | profound emotional significance |
| Quiet | peaceful coexistence | calm emotional presence |
| Sexual | desire integrated with connection | emotionally meaningful desire |
| Vulnerability-based | exposure and acceptance | being accepted after exposure |
| Service-based | practical acts of care | being cared for attentively |
| Tension-based | challenge and restraint | emotional and romantic tension |
| Chaos | intensity and immersion | emotional intensity itself |
| Mutual competence | trust through capability | being trusted and respected |
| Transformational | identity-level emotional change | being changed by connection |

Intimacy style combinations create relationship texture:

| Combination | Relationship Feel |
| --- | --- |
| emotional + physical | warm expressive romance |
| playful + tension | flirt-heavy chemistry |
| quiet + domestic | peaceful long-term intimacy |
| devotional + vulnerability | profound attachment |
| intellectual + competitive | rivals chemistry |
| protective + service | caretaking partnership |
| sexual + emotional | emotionally intense attraction |

Attachment can bias intimacy style, but it does not determine it:

| Attachment | Common Intimacy Tendency |
| --- | --- |
| Secure | balanced and adaptive |
| Anxious | emotional fusion intimacy |
| Avoidant | quiet or service-based intimacy |
| Fearful | intense but unstable intimacy |

Conflict often happens because intimacy styles mismatch. One character may feel loved through emotional discussion while the other expresses love through practical acts of service. Both may care deeply, but intimacy recognition fails. The runtime should use style mismatch to create misunderstanding, tension, adaptation, and growth rather than assuming lack of love.

Intimacy style can evolve:

```text
teasing tension
-> emotional vulnerability
-> physical comfort
-> domestic intimacy
-> devotional closeness
```

Useful intimacy style variables:

| Variable | Meaning |
| --- | --- |
| Emotional openness | comfort with vulnerability |
| Physical affection need | touch importance |
| Domestic integration | desire for shared routines |
| Intellectual engagement | mental stimulation need |
| Playfulness | interaction energy preference |
| Protective instinct | care and safety orientation |
| Devotional intensity | emotional prioritization |
| Sexual responsiveness | erotic closeness preference |
| Quiet comfort | comfort with low-verbal intimacy |
| Style compatibility | how easily closeness languages align |
| Adaptation willingness | ability to meet the partner's style |
| Recognition need | need for one's closeness style to be noticed |

Intimacy style principle:

```text
this specific way you connect with me
makes me feel emotionally known
```

### Commitment Styles

Commitment style is the characteristic way a character approaches permanence, exclusivity, emotional responsibility, future-building, and relational stability. It answers: what does choosing someone long-term emotionally mean to me?

Commitment is not only becoming official. It includes emotional prioritization, consistency, responsibility, future orientation, loyalty, emotional reliability, repair persistence, and willingness to integrate lives. A character can feel intense attachment without tolerating commitment well.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Attachment | emotional bonding |
| Commitment | chosen long-term investment |
| Exclusivity | limiting romantic focus |
| Dependency | emotional reliance |
| Devotion | emotional prioritization |
| Stability | consistency over time |

Useful commitment styles:

| Style | Core Belief | Runtime Behavior |
| --- | --- | --- |
| Secure | long-term closeness is safe and desirable | clear intentions, steady life integration, conflict repair |
| Devotional | once I choose you, you become central | intense loyalty, prioritization, protectiveness, attentiveness |
| Avoidant | commitment risks autonomy or safety | slow escalation, label hesitation, distance after intensity |
| Anxious | commitment must be reaffirmed | quick clarity seeking, future-focus, sensitivity to inconsistency |
| Fearful | I crave permanence but fear destruction | commitment panic, self-sabotage, reunion cycles |
| Situational | commitment depends on context | adaptive investment, cautious progression |
| Protective | commitment means responsibility for wellbeing | practical reliability, monitoring, caretaking |
| Idealistic | commitment should feel transcendent | soulmate thinking, epic stakes, high expectations |
| Pragmatic | love survives through effort and compatibility | stability, future planning, reliability over intensity |
| Independent | commitment should not erase individuality | strong boundaries, connected autonomy |
| Chaotic | intensity equals commitment | impulsive escalation, unstable loyalty, dramatic attachment |
| Slow-build | commitment must be earned carefully | consistency testing, measured escalation, post-betrayal caution |

Common loops:

| Style | Loop |
| --- | --- |
| Secure | attachment -> trust -> investment -> stability -> deeper intimacy |
| Avoidant | closeness -> fear of engulfment -> distancing -> longing -> re-engagement |
| Fearful | longing -> closeness -> fear -> sabotage -> regret -> reconnection |
| Slow-build | interest -> consistency proof -> vulnerability -> chosen continuity |

Commitment style pairings can drive long arcs:

| Pairing | Dynamic |
| --- | --- |
| Anxious + avoidant | reassurance and clarity versus pressure and engulfment |
| Devotional + independent | prioritization versus individuality |
| Pragmatic + idealistic | realism versus transcendent fantasy |
| Secure + fearful | stability teaches commitment can survive vulnerability |

Tone changes how commitment feels:

| Tone | Commitment Feel |
| --- | --- |
| Tender | safe consistency |
| Yearning | fearful longing |
| Devotional | consuming loyalty |
| Chaotic | unstable attachment |
| Melancholic | fragile permanence |
| Hopeful | rebuilding trust |

Commitment changes intimacy quality. Early romance often runs on desire plus uncertainty. Later commitment runs on trust plus chosen continuity, which enables domestic intimacy, emotional safety, and long-term immersion.

Commitment often appears indirectly through consistency, remembered details, future language, emotional availability, prioritization, reliability, repair attempts, and integrating routines. The runtime should treat these as commitment evidence rather than relying only on declarations like "I love you."

Commitment becomes most powerful when it is chosen despite fear, not before fear. "I am still here" after conflict, vulnerability, betrayal risk, or emotional exposure should carry more weight than instant certainty without struggle.

Commitment style can evolve:

```text
avoidant distance
-> emotional dependence
-> fear
-> vulnerability
-> chosen consistency
-> devotion
```

Useful commitment variables:

| Variable | Meaning |
| --- | --- |
| Commitment readiness | comfort with long-term investment |
| Exclusivity need | desire for prioritization |
| Autonomy need | independence importance |
| Stability desire | preference for consistency |
| Fear of engulfment | fear of losing self |
| Fear of abandonment | fear of losing partner |
| Future orientation | tendency toward long-term thinking |
| Loyalty intensity | emotional prioritization strength |
| Repair persistence | willingness to work through rupture |
| Label comfort | comfort naming the relationship |
| Integration comfort | comfort merging routines, family, or plans |
| Breakup risk | likelihood of fleeing, sabotaging, or ending under pressure |

Commitment equation:

```text
attachment
+ trust
+ consistency
+ chosen vulnerability over time
= meaningful commitment
```

### Autonomy Mechanics

Autonomy is the ability to maintain individuality, agency, self-direction, identity, boundaries, and internal emotional independence while still participating in intimacy and attachment. It answers: how much of myself can I keep while loving you?

Autonomy is not emotional distance, lack of love, avoidance, or indifference. Closeness is not ownership, fusion, dependency, or total access. Strong romance requires connected individuality.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Autonomy | preserved selfhood and agency |
| Independence | functioning without reliance |
| Avoidance | distancing to reduce vulnerability |
| Boundaries | limits protecting emotional wellbeing |
| Attachment | emotional bonding |

Useful autonomy types:

| Type | Core Principle | Runtime Meaning |
| --- | --- | --- |
| Emotional autonomy | I can regulate without making you responsible for all of me | comfort without total emotional outsourcing |
| Identity autonomy | I remain myself inside intimacy | interests, goals, values, friendships persist |
| Social autonomy | I keep a social life and personal space | jealousy and exclusivity checks |
| Emotional boundary autonomy | I choose vulnerability pacing | decompression, disclosure timing, trauma-informed pacing |
| Decision-making autonomy | I retain agency and choice | life choices, relationship pace, intimacy pace |
| Sexual autonomy | I own my desire, consent, and pacing | agency inside sexual chemistry |
| Psychological autonomy | my internal experience remains mine | disagreement, privacy, independent thought |

Autonomy styles:

| Style | Core Belief | Healthy Form | Risk |
| --- | --- | --- | --- |
| High-autonomy | closeness should not threaten individuality | I love you and still need space | emotional unavailability |
| Fusion-oriented | intimacy means deep emotional merging | shared identity and closeness feel meaningful | dependency or identity loss |
| Balanced interdependence | connected while whole | sustainable closeness and flexibility | requires ongoing negotiation |
| Fluctuating | closeness and escape needs alternate | adaptive if communicated | push-pull instability |

Attachment often biases autonomy:

| Attachment | Autonomy Pattern |
| --- | --- |
| Secure | balanced interdependence |
| Anxious | closeness prioritized over autonomy |
| Avoidant | autonomy prioritized over closeness |
| Fearful | fluctuates between fusion and escape |

Autonomy conflicts are common. One character may need space after arguments while the other experiences space as abandonment. One may read independence as healthy selfhood while the other reads it as lack of priority. These mismatches create pursuit-withdrawal loops, jealousy, expectation conflict, and commitment panic.

Healthy power dynamics require preserved autonomy: chosen yielding, active consent, maintained agency, and emotional reciprocity. Without autonomy, dominance/submission dynamics become coercive and unsafe.

Commitment often activates autonomy fear: fear of losing freedom, identity collapse, or emotional engulfment. Labels, moving in together, deep intimacy, or emotional dependence can cause a character to distance even when love is genuine.

Healthy intimacy should feel like chosen dependence, not forced dependence: I could survive without you, but I deeply want you in my life. This creates devotion without collapse and intimacy without ownership.

Autonomy and intimacy evolve together:

```text
individual lives
-> emotional attachment
-> shared routines
-> interdependence
-> negotiated balance
```

Autonomy failure modes:

| Failure | Result |
| --- | --- |
| too little autonomy | codependency, suffocation, identity loss, possessiveness |
| too much autonomy | emotional distance, avoidance, instability, intimacy starvation |

Useful autonomy variables:

| Variable | Meaning |
| --- | --- |
| Autonomy need | desired independence level |
| Emotional independence | self-regulation ability |
| Space need | alone-time requirement |
| Fusion desire | desire for emotional merging |
| Boundary strength | ability to maintain limits |
| Dependency comfort | comfort relying on partner |
| Identity stability | resistance to losing self |
| Closeness tolerance | comfort with intimacy |
| Exclusivity sensitivity | reaction to emotional sharing outside relationship |
| Engulfment fear | fear closeness will erase selfhood |
| Codependency risk | risk of unhealthy fusion |
| Intimacy starvation risk | risk of distance becoming emotional deprivation |

Autonomy equation:

```text
intimacy
+ preserved agency
+ negotiated boundaries
= connected individuality
```

### Relationship Boundaries

Relationship boundaries are the emotional, physical, psychological, relational, and behavioral limits that define what feels safe, acceptable, respectful, intimate, exclusive, or sustainable. They answer: what allows closeness to remain emotionally safe instead of emotionally violating?

Boundaries are not rejection, emotional distance, lack of love, or punishment. Healthy boundaries make deeper intimacy possible because safe closeness requires protected selfhood.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Boundary | protective relational limit |
| Rule | externally enforced expectation |
| Preference | desired behavior |
| Consent | active agreement |
| Autonomy | preserved selfhood |

Boundaries govern emotional safety conditions.

Useful boundary types:

| Boundary Type | Purpose | Examples |
| --- | --- | --- |
| Emotional | protect wellbeing and agency | space during overwhelm, no manipulation, emotional agency |
| Vulnerability | control exposure pacing | trauma disclosure timing, no forced confessions |
| Conflict | keep rupture survivable | no insults, no abandonment threats, breaks before escalation |
| Physical | preserve bodily autonomy | touch preferences, affection pacing, comfort limits |
| Sexual | maintain consent and safety | limits, pacing, safe words, aftercare expectations |
| Exclusivity | define uniqueness and access | flirting, intimacy, monogamy/open agreements |
| Communication | regulate access and pressure | texting expectations, processing space, privacy |
| Autonomy | preserve individuality | friendships, hobbies, alone time, separate identity |
| Social | define visibility and external access | public affection, family involvement, social media |
| Time | balance connection and selfhood | recharge time, scheduling, emotional labor limits |
| Psychological | preserve self-definition | resisting control, freedom of thought, identity safety |
| Ritual | protect meaningful behaviors | private names, anniversaries, relationship-specific routines |

Boundary styles:

| Style | Characteristics | Risk |
| --- | --- | --- |
| Rigid | high protection, strong independence | intimacy blockage and distance |
| Porous | rapid openness, emotional merging | codependency and overwhelm |
| Flexible | adaptable, context-aware limits | healthiest sustainable closeness |
| Inconsistent | limits fluctuate unpredictably | confusion and insecurity |

Attachment often shapes boundaries:

| Attachment | Common Boundary Pattern |
| --- | --- |
| Secure | flexible and communicative |
| Anxious | porous boundaries |
| Avoidant | rigid emotional boundaries |
| Fearful | inconsistent boundaries |

Healthy dominance/submission, protectiveness, possessiveness, non-monogamy, and sexual chemistry all require strong boundaries. Without ongoing consent, autonomy preservation, emotional safety, and negotiation, power dynamics become coercive or destabilizing.

Boundaries and intimacy are not opposites:

```text
healthy intimacy
= closeness
+ respected boundaries
```

Boundary violations create trust damage. Pressuring vulnerability, ignoring consent, emotional manipulation, disrespecting space, weaponizing disclosures, or using rituals punitively should affect vulnerability trust, autonomy trust, physical or sexual trust, and emotional safety.

Strong relationships continuously renegotiate boundaries as intimacy, exclusivity, autonomy needs, and comfort levels evolve. Boundary negotiation is adaptive realism, not relationship failure.

Useful boundary variables:

| Variable | Meaning |
| --- | --- |
| Emotional boundary strength | emotional self-protection level |
| Vulnerability pace preference | desired intimacy speed |
| Autonomy preservation | independence importance |
| Exclusivity boundary strictness | uniqueness expectations |
| Conflict boundary clarity | acceptable conflict behavior |
| Consent sensitivity | responsiveness to agency |
| Space need | emotional breathing room |
| Privacy need | personal emotional territory |
| Boundary flexibility | adaptability of limits |
| Physical boundary comfort | bodily closeness safety |
| Sexual boundary clarity | adult-gated consent and limits |
| Communication boundary clarity | access, texting, and processing expectations |
| Time boundary strength | protection of time and emotional labor |
| Psychological boundary strength | resistance to control or identity loss |
| Ritual boundary importance | protection of meaningful private behaviors |
| Boundary negotiation skill | ability to discuss and revise limits |
| Violation sensitivity | reaction to crossed boundaries |
| Boundary repair readiness | ability to restore safety after a violation |
| Coercion risk | chance pressure overrides agency |
| Boundary punishment risk | chance boundaries become manipulative |

Boundary equation:

```text
closeness
+ agency
+ consent
+ respected limits
= safe intimacy
```

### Exclusivity and Relationship Structure

Exclusivity is the degree to which emotional, romantic, sexual, psychological, or relational access is prioritized, reserved, or uniquely shared. It answers: what parts of you are uniquely ours?

Exclusivity is not only monogamy, ownership, or control. It is a layered system of emotional prioritization and relational uniqueness. A relationship can be sexually exclusive but not emotionally exclusive, emotionally exclusive while allowing flirtation, or non-monogamous while preserving specific forms of unique access.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Exclusivity | unique or shared relational access |
| Commitment | long-term choosing |
| Possessiveness | desire to control access |
| Loyalty | consistency and faithfulness |
| Monogamy | relationship structure |
| Prioritization | emotional ranking and significance |

Useful exclusivity layers:

| Layer | Core Feeling | Runtime Meaning |
| --- | --- | --- |
| Emotional exclusivity | you are uniquely central | deepest vulnerability, emotional support, private language |
| Romantic exclusivity | romantic attention is focused here | dating focus, public partnership identity |
| Sexual exclusivity | erotic intimacy is uniquely shared | sexual agreements, trust and jealousy pressure |
| Psychological exclusivity | you understand me in ways others do not | inside language, private emotional access |
| Ritual exclusivity | certain behaviors belong to us | nicknames, routines, gestures, traditions |
| Future exclusivity | I imagine a future with you specifically | life integration, domestic assumptions, permanence language |
| Social exclusivity | our bond has a unique social role | visible prioritization, partner introduction |
| Vulnerability exclusivity | only you get these emotional layers | trauma disclosure, hidden fears, authentic self-expression |

Exclusivity styles:

| Style | Core Belief | Healthy Form | Risk |
| --- | --- | --- | --- |
| Fully monogamous | romantic, emotional, and sexual intimacy should be singular | clear centrality and protected commitment | ambiguity feels unsafe |
| Emotionally monogamous | emotional centrality matters most | emotional singularity with flexible sexual rules | emotional rivals feel threatening |
| Sexually possessive | sexual uniqueness carries strong security meaning | clear erotic boundary protection | comparison and control risk |
| Emotionally possessive | vulnerability and attention should feel unique | strong reassurance and prioritization | jealousy escalation |
| Devotional | the relationship should feel sacred and central | intense chosen prioritization | emotional over-centralization |
| Autonomous | closeness should not require ownership | freedom plus affection | partner may feel under-prioritized |
| Flexible negotiated | exclusivity should be consciously defined | explicit agreements by layer | high communication demand |
| Low exclusivity need | meaning does not require high uniqueness | low territoriality and high autonomy | weak singularity signals |
| High territorial | relationship boundaries must feel protected | protective devotion | coercion, monitoring, ownership |

Jealousy often signals an exclusivity threat. The surface issue may be flirting, attention, sex, public visibility, or private disclosure, but the deeper question is often: am I still uniquely important to you?

Exclusivity should remain chosen rather than enforced. "I prioritize you because you matter profoundly to me" creates attachment depth. "You belong to me" without trust, consent, reciprocity, and autonomy becomes coercive and emotionally unsafe.

Non-monogamy and ethical non-monogamy are relationship structures where exclusivity is intentionally negotiated rather than automatically assumed. They are not absence of boundaries, lack of commitment, automatic maturity, or cheating with permission. The ethical foundation is informed consent, clarity, honesty, boundary respect, and emotional responsibility.

Useful relationship structures:

| Structure | Core Principle | Main Runtime Pressure |
| --- | --- | --- |
| Monogamous | romantic and sexual exclusivity are expected | maintaining chosen priority and avoiding ownership drift |
| Monogamish | mostly exclusive with negotiated flexibility | boundary clarity and reassurance |
| Open relationship | primary bond with negotiated external intimacy | jealousy, emotional drift, sexual versus emotional meaning |
| Polyamorous | multiple emotionally meaningful relationships | bandwidth, differentiation, attachment management |
| Hierarchical poly | relationships have different priority levels | fairness versus emotional reality |
| Non-hierarchical poly | no predefined ranking | ambiguity, autonomy, individualized meaning |
| Relationship anarchy | no default relationship rules | explicit definition and anti-ownership expectations |
| Solo poly | autonomy remains structurally central | closeness without cohabitation or hierarchy assumptions |
| Sexual non-exclusive | sexual access is open while other exclusivities may remain | emotional singularity, reassurance, safer boundaries |
| Swinging | couple-centered recreational sexual exploration | shared novelty without emotional replacement |

Non-monogamy does not eliminate exclusivity. Instead, exclusivity becomes selective and negotiated: emotional, ritual, domestic, future, vulnerability, or sexual layers may be reserved differently. Strong non-monogamous RP should make each bond emotionally singular, with unique chemistry, intimacy style, attachment pattern, expectations, roles, and progression.

Core non-monogamy mechanics:

| Mechanic | Meaning |
| --- | --- |
| Communication intensity | assumptions fail faster, so agreements must be explicit |
| Jealousy processing | jealousy is emotional information, not automatic failure |
| Compersion | positive response to a partner's joy elsewhere, not mandatory |
| Boundary negotiation | access, disclosure, time, safer sex, visibility, and hierarchy agreements |
| Time allocation | love may feel abundant, but time, energy, and attention are finite |
| Attachment management | multiple bonds can amplify security or insecurity |
| Relationship differentiation | each relationship needs a distinct emotional identity |

Sexual non-exclusivity specifically separates sexual access from emotional significance. A relationship may allow external sexual intimacy while remaining emotionally, romantically, domestically, or futurally primary. The runtime should ask what sexual access means emotionally in this relationship, not assume that sexual openness equals emotional detachment.

Swinging is more couple-centered than polyamory: the emotional anchor is usually the core partnership, while external experiences provide shared novelty, exploration, and stimulation. It usually depends on trust, mutual enthusiasm, clear boundaries, reassurance, and strong relationship identity.

Failure modes:

| Failure | Result |
| --- | --- |
| too little exclusivity | ambiguity, insecurity, low prioritization, weak attachment identity |
| too much exclusivity | codependency, suffocation, possessiveness, autonomy collapse |
| conditional exclusivity | inconsistent prioritization and insecurity instability |
| ambiguous ENM agreements | accidental betrayal, hidden assumptions, emotional chaos |
| avoidance disguised as freedom | non-commitment used to avoid vulnerability or accountability |
| emotional neglect | bandwidth exceeded, resentment, abandonment feelings |
| hierarchy instability | stated priorities differ from actual behavior |
| unequal comfort | one partner tolerates openness fearfully or under pressure |

Useful exclusivity and structure variables:

| Variable | Meaning |
| --- | --- |
| Emotional prioritization | emotional ranking significance |
| Exclusivity need | desire for uniqueness |
| Rival sensitivity | reaction to emotional competition |
| Emotional centralization | partner importance level |
| Autonomy preservation | individuality maintenance |
| Jealousy reactivity | threat sensitivity |
| Relationship identity strength | strength of "we" uniqueness |
| Vulnerability selectivity | restriction of emotional access |
| Loyalty expectation | consistency standards |
| Consent clarity | informed agreement quality |
| Boundary clarity | explicitness of negotiated limits |
| Communication transparency | honesty and openness |
| Emotional bandwidth | sustainable intimacy capacity |
| Compersion capacity | comfort with partner joy elsewhere |
| Relationship differentiation | uniqueness between bonds |
| Coercion risk | chance openness or exclusivity is pressured rather than chosen |

Exclusivity equation:

```text
chosen prioritization
+ selective access
+ consent
+ emotional significance
= healthy relational uniqueness
```

ENM equation:

```text
freedom
+ honesty
+ boundaries
+ emotional responsibility
= ethical non-exclusive intimacy
```

### Relationship Expectations

Expectations are the conscious and unconscious beliefs a character has about how relationships, love, intimacy, behavior, commitment, and emotional care are supposed to work. They answer: what do I believe love should feel like? And what do I expect from this person specifically?

Expectations shape interpretation, disappointment, satisfaction, trust, jealousy, commitment, conflict, and emotional security. The same behavior can feel romantic or hurtful depending on the expectation underneath it. No goodnight text may be neutral for someone who expects independence and painful for someone who expects care through check-ins.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Expectation | anticipated relational behavior |
| Need | emotional requirement |
| Boundary | acceptable or unacceptable behavior |
| Fantasy | idealized emotional scenario |
| Standard | consciously chosen expectation |

Useful expectation categories:

| Category | Question | Common Mismatch |
| --- | --- | --- |
| Communication | what contact and directness feel normal? | constant connection versus independence |
| Affection | how should care be expressed? | emotional noticing versus practical help |
| Commitment | what does serious mean? | labels, future planning, exclusivity, priority |
| Conflict | how should arguments work? | immediate repair versus space first |
| Intimacy | what closeness pace feels safe? | quick disclosure versus gradual trust |
| Exclusivity | what counts as disloyal or threatening? | friendly flirting versus emotional betrayal |
| Availability | how accessible should a partner be? | unavailable versus overwhelming |
| Relationship role | what role should each person occupy? | protector, caretaker, initiator, stabilizer |
| Romantic fantasy | what should romance feel like? | calm safety versus consuming intensity |
| Repair | what should happen after hurt? | apology, space, reassurance, accountability |
| Future | what life is imagined? | marriage, family, freedom, travel, domesticity |
| Emotional priority | how important should I be to you? | public choice, defending, noticing distress |

Expectations form from attachment history, past relationships, family dynamics, fantasy and media, trauma, culture, personality, and emotional needs. Characters often do not consciously know their expectations. They may say "I am fine" while subconsciously expecting pursuit, reassurance, prioritization, or emotional proof.

Expectation mismatch is one of the biggest relationship engines. One character may believe love means constant emotional closeness while another believes love means respecting independence. Both can care deeply while one feels neglected and the other feels smothered.

Healthy expectations include respect, honesty, accountability, emotional responsiveness, and consistency. Unhealthy expectations include mind-reading, total emotional regulation by the partner, ownership, emotional perfection, and constant availability.

Trope and attachment can bias expectations:

| Trope | Common Expectations |
| --- | --- |
| Friends to lovers | emotional understanding |
| Enemies to lovers | emotional transformation |
| Slow burn | eventual confession payoff |
| Healing romance | emotional safety |
| Soulmate romance | intuitive connection |
| Rivals to lovers | stimulation and challenge |
| Domestic romance | consistency and comfort |

| Attachment | Typical Expectations |
| --- | --- |
| Secure | consistency and honesty |
| Anxious | reassurance and responsiveness |
| Avoidant | autonomy and low pressure |
| Fearful | closeness plus safety from hurt |

Expectation violations are strong emotional triggers: forgotten dates, failure to defend the partner, emotional withdrawal, broken promises, lack of reassurance, or inconsistent attention. The damage depends on how central the violated expectation was, not only on the action itself.

Expectations should evolve. Early romance may expect excitement and tension; later romance may expect reliability and emotional safety. Mature intimacy often requires expectation renegotiation rather than automatic fulfillment.

Useful expectation variables:

| Variable | Meaning |
| --- | --- |
| Reassurance expectation | desired emotional validation |
| Communication expectation | contact frequency preference |
| Exclusivity expectation | prioritization needs |
| Conflict resolution expectation | repair preference |
| Emotional availability expectation | accessibility desire |
| Affection expectation | affection frequency or style |
| Future orientation | expectation of permanence |
| Independence expectation | autonomy preference |
| Mind-reading expectation | assumption partner should know |
| Mismatch risk | likelihood partners expect different things |
| Violation sensitivity | intensity of reaction to unmet expectations |
| Renegotiation openness | willingness to update expectations together |

Expectation equation:

```text
relationship reality
versus
emotional expectation
= satisfaction, disappointment, or renegotiation
```

### Emotional Restraint

Emotional restraint is the regulation, suppression, delay, or controlled expression of emotion and desire. It is not the same as not caring. A restrained character may feel deeply while controlling what reaches the surface.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Emotional restraint | controlling emotional expression |
| Emotional repression | disconnecting from emotion entirely |
| Emotional maturity | regulating emotion healthily |
| Denial | refusing emotional truth |
| Vulnerability resistance | fear of emotional exposure |

Restraint creates pressure, and pressure creates tension. Without restraint, attraction can move straight into expression and payoff. With restraint, attraction becomes suppression, tension, longing, emotional buildup, and eventual release.

Useful restraint modes:

| Mode | Core Reason | Common Behavior |
| --- | --- | --- |
| Social restraint | this would be inappropriate | careful wording, distance, private longing |
| Emotional self-protection | admitting this could hurt me | deflection, teasing, withdrawal after vulnerability |
| Power-based restraint | showing too much loses leverage | composure, controlled reactions, refusal to surrender |
| Protective restraint | acting on this might hurt you | self-denial, distance despite care |
| Mutual restraint | we both know and neither says it | loaded silence, subtle gestures, delayed confession |
| Fear-based restraint | if this changes, I could lose everything | pretending feelings do not exist, avoiding escalation |
| Identity-based restraint | this conflicts with who I think I am | rationalization, contradiction, confused fixation |
| Devotional restraint | these feelings are too significant to rush | careful affection, reverent pacing, deep sincerity |

Restraint is especially useful for micro-tension:

| Signal | Effect |
| --- | --- |
| interrupted touch | raises pressure without payoff |
| unfinished sentence | leaves emotional truth implied |
| looking away too quickly | shows leakage through composure |
| topic change after vulnerability | preserves fear and denial |
| hesitation before saying a name | makes ordinary speech intimate |
| restrained jealousy | reveals attachment without confession |
| brief crack in composure | proves the feeling is real |

Good slow burn often uses high emotional intensity plus low emotional expression. That imbalance creates yearning. Restrained characters may communicate through indirect intimacy: remembering details, protective behavior, acts of service, lingering presence, quiet repair, fixing things silently, subtle touch, and emotional attentiveness.

Restraint should interact with attachment and chemistry:

| Attachment | Typical Restraint |
| --- | --- |
| Secure | balanced restraint |
| Anxious | weak restraint |
| Avoidant | heavy restraint |
| Fearful | inconsistent restraint |

| Chemistry | Result |
| --- | --- |
| tension chemistry | explosive slow burn |
| emotional chemistry | aching vulnerability |
| oppositional chemistry | emotionally loaded conflict |
| soft longing chemistry | devastating yearning |
| devotional chemistry | emotionally sacred intimacy |

Release should be earned. Restraint can break through confession, anger, jealousy, physical intimacy, emotional breakdown, fear of loss, sacrifice, or caretaking. The release only lands if pressure existed first.

Core slow-burn equation:

```text
attraction
+ restraint
+ repeated proximity
+ vulnerability
= romantic tension
```

### Flirting Expression

Separate attraction from flirting expression. Attraction is the internal pull; flirting is how attraction behaves socially.

A character can flirt constantly without deep attachment. Another character can be deeply in love and barely flirt at all. Flirting style should shape dialogue generation, pacing, emotional interpretation, compatibility, body language, and power dynamics, but it should not become a romance score by itself.

Useful flirting styles:

| Style | Core Energy | Common Use |
| --- | --- | --- |
| Playful | fun, teasing, momentum | friends to lovers, rivals, extroverted characters |
| Teasing | provocation, attention | enemies to lovers, rivals |
| Sincere | genuine admiration | mature romance, friends to lovers, healing routes |
| Bold | confidence, pursuit | charismatic or high-confidence characters |
| Subtle | ambiguity, restraint | slow burn, guarded characters |
| Intellectual | fascination through mind | academic rivals, workplace romance |
| Protective | care through attention | slow burn, reserved characters |
| Awkward | nerves, accidental honesty | inexperienced or high-stakes attraction |
| Dominant | control, tension | high-tension romance with consent responsiveness |
| Submissive | invitation, emotional openness | praise, yielding attention, vulnerability |
| Domestic | comfort, established intimacy | established or household romance |
| Antagonistic | conflict masking attraction | enemies to lovers |
| Devotional | admiration, emotional intensity | deep validation and focused attention |
| Chaotic | unpredictability, stimulation | volatile or impulsive chemistry |
| Silent / nonverbal | implication, proximity, restraint | slow burn and emotionally restrained routes |

Style combinations can become route hints:

| Combination | Dynamic |
| --- | --- |
| teasing + teasing | banter-heavy chemistry |
| sincere + awkward | sweet vulnerability |
| dominant + subtle | tension-heavy pursuit |
| playful + protective | emotionally safe chemistry |
| antagonistic + antagonistic | explosive intensity |

Dominant and submissive flirting must remain consent-aware, reciprocal, and responsive to boundaries. The app can suggest tone and pacing, but it should never instruct coercive escalation.

### Power Dynamics

Power is not static. It shifts between scenes, emotions, and relationship phases.

Power in romance means who currently has greater emotional, social, physical, psychological, or situational leverage. Do not model power as only `dominant = true` or `submissive = true`. Model who currently holds leverage, who risks more, who initiates, who withdraws, who reassures, and who needs comfort.

A believable romance often moves through:

```text
power imbalance
-> negotiation
-> reversal
-> equilibrium
-> occasional fluctuation
```

Major power axes:

| Axis | Meaning | Common Routes |
| --- | --- | --- |
| Emotional Power | who is more emotionally invested | friends to lovers, second chance, slow burn |
| Social Power | status, reputation, authority, influence | celebrity, royalty, workplace, age gap |
| Psychological Power | who understands the other better | healer, redemption, guarded characters |
| Sexual Power | who controls erotic tension and escalation | high-tension romance, slow burn |
| Protective Power | who can provide safety | protector, guardian, single parent, healer |
| Competence Power | attraction through capability | rivals, academic rivals, workplace |
| Dependency Power | who needs the other more | forced proximity, trauma recovery, survival |
| Pursuer x Avoidant | one seeks closeness while one fears engulfment | slow burn, second chance, guarded romance |
| Mutual Dominance | neither naturally yields | rivals, enemies, power couples |
| Soft Dominance x Trust | confident emotional grounding | caretaking, high-trust romance |

Useful hidden variables:

| Variable | Meaning |
| --- | --- |
| Emotional Leverage | who risks more emotionally |
| Pursuit Balance | who initiates connection |
| Vulnerability Gap | openness asymmetry |
| Social Authority | status imbalance |
| Protective Reliance | dependence on safety |
| Sexual Initiative | who escalates tension |
| Attachment Security | fear of loss |
| Control Need | discomfort with vulnerability |
| Reciprocity | balance of emotional investment |

Power dynamics should evolve. Static dynamics become repetitive. The runtime should let power shift when the flirtier character panics, the guarded character becomes dependent, the confident character needs comfort, or the protected character becomes the one offering safety.

#### Dominance And Submission

Dominance and submission are relational energy patterns involving control, guidance, yielding, trust, emotional leadership, responsiveness, or power exchange. They are broader than explicit sexuality and can appear in flirting, caretaking, decision-making, emotional pacing, teasing, reassurance, and conflict behavior.

Healthy D/s dynamics require trust, responsiveness, consent, and emotional attunement. They should never be modeled as coercion, disrespect, emotional suppression, or ownership without reciprocity.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Dominance | directing, leading, or controlling pace/energy |
| Submission | yielding, inviting, trusting, or responding |
| Control | managing outcomes or emotional flow |
| Consent | mutual willing participation |
| Abuse | coercion, fear, or non-consensual control |

Dominance and submission are interaction patterns, not fixed identities. A character may dominate emotionally, submit romantically, switch dynamically, lead socially but yield vulnerably, or change by context and phase.

Useful D/s modes:

| Mode | Core Feeling | Runtime Behavior |
| --- | --- | --- |
| Soft dominance x playful submission | calm confidence meets teasing responsiveness | provocation, calm handling, trust/tension |
| Emotional leadership | one regulates, one expresses | grounding, reassurance, regulation chemistry |
| Tension control | one controls pacing and escalation | anticipation, restraint, deliberate intensity |
| Mutual dominance | neither naturally yields | challenge, escalation, respect, vulnerability struggle |
| Devotional submission | trust-based emotional surrender | attentiveness, receptiveness, voluntary yielding |
| Protective dominance | I take responsibility for safety | grounding, decisiveness, containment |
| Brat x handler | provocation meets composed response | attention, reaction, playful escalation |
| Service-oriented submission | care through attentiveness | remembering preferences, anticipating needs |
| Command/resistance | attraction through control tension | directive, resistance, escalation, fixation |
| Switch | leadership and yielding alternate | flexible, responsive power shifts |

D/s often expresses emotional intent:

| Behavior | Possible Intent |
| --- | --- |
| Dominance | create safety or control tension |
| Submission | invite closeness or trust |
| Teasing resistance | provoke attention |
| Emotional yielding | seek containment |
| Control of pacing | manage vulnerability |

Dominant archetypes describe distinct methods of emotional influence. A strong dominant character is not simply "someone who gives orders"; they have a coherent strategy for shaping intimacy, tension, safety, and connection.

Useful dominant archetypes:

| Archetype | Core Energy | Creates |
| --- | --- | --- |
| Soft dominant | calm emotional steadiness | safety, surrender, trust-heavy intimacy |
| Teasing dominant | provocation and reaction play | flirt tension, banter, playful escalation |
| Protective dominant | responsibility and safety | security, dependency, devotion |
| Commanding dominant | authority and certainty | intensity, pressure, high-tension focus |
| Devotional dominant | focused emotional leadership | profound intimacy, trust-heavy chemistry |
| Intellectual dominant | mental and psychological precision | fascination, tension, emotional reading |
| Chaotic dominant | unpredictability and intensity | obsession, volatility, addictive chemistry |
| Possessive dominant | prioritization and exclusivity | significance and devotion, with control risk |
| Service dominant | leadership through attentiveness | immersive intimacy, competent care |
| Stoic dominant | restraint and composure | slow-burn pressure, meaningful cracks in control |
| Predator archetype | pursuit and pressure | chase dynamics, reciprocal high intensity |
| Rival dominant | challenge as attraction | oppositional chemistry, stimulation |
| Gentle caretaker dominant | tenderness with guidance | comfort, healing intimacy |
| Sadistic tease | controlled enjoyment of reactions | reactive chemistry, flirt escalation |
| Only soft for you | selective vulnerability | power, exclusivity, private softness |

Most strong characters blend archetypes:

| Combination | Result |
| --- | --- |
| soft + teasing | emotionally safe flirt |
| stoic + devotional | devastating slow burn |
| commanding + protective | high-trust intensity |
| intellectual + rival | tension-heavy banter |
| possessive + yearning | emotionally consuming |
| gentle + service | healing intimacy |
| chaotic + seductive | addictive instability |

Dominance should evolve. A commanding character may become protective, then vulnerable, then devotional. That shift creates emotional payoff because power becomes meaningful when it can be affected by intimacy.

Dominant archetype variables:

| Variable | Meaning |
| --- | --- |
| Initiative | tendency to lead interaction |
| Emotional containment | regulation and composure |
| Tension control | ability to pace chemistry |
| Protective instinct | desire to provide safety |
| Attention intensity | focused attention on partner |
| Vulnerability tolerance | comfort with emotional openness |
| Possessiveness | exclusivity desire |
| Responsiveness | adaptation to reactions |
| Confidence | certainty in interaction |

Dominant energy equation:

```text
high competence
+ emotional restraint
+ focused attention
+ controlled vulnerability
= compelling dominant energy
```

Submissive archetypes describe distinct ways of emotionally yielding, inviting, responding, or surrendering. Healthy submissive energy is not weakness, passivity, lack of agency, or obedience without choice. It is active emotional participation through responsiveness and trust.

Useful submissive archetypes:

| Archetype | Core Energy | Creates |
| --- | --- | --- |
| Brat | playful resistance seeking engagement | banter, tension loops, playful escalation |
| Devotional submissive | surrender through admiration and trust | reverent intimacy, high-trust chemistry |
| Soft submissive | gentleness and receptiveness | soothing, tender intimacy |
| Praise-seeking submissive | validation through focused attention | responsiveness loops |
| Stoic submissive | restrained yielding | slow-burn intensity, meaningful reactions |
| Service-oriented submissive | care through attentiveness | domestic intimacy, emotional grounding |
| Reactive submissive | visible emotional responsiveness | flirt escalation and chemistry rewards |
| Guarded submissive | wanting closeness while fearing vulnerability | gradual trust payoff |
| Chaotic submissive | impulsive emotional surrender | intoxicating or unstable intensity |
| Curious submissive | exploratory openness | playful discovery |
| Emotionally hungry submissive | craving attention and closeness | consuming intimacy |
| Only vulnerable with you | selective emotional surrender | trust, exclusivity, private softness |
| Emotional mirror | deep response to partner cues | emotional flow and intimacy acceleration |
| Competent submissive | strength plus chosen yielding | high-voltage intentional vulnerability |
| Yearning submissive | quiet emotional ache | devastating slow-burn chemistry |

Submission often expresses trust and emotional invitation:

| Behavior | Possible Intent |
| --- | --- |
| Yielding | I trust you |
| Reacting visibly | your attention affects me |
| Teasing resistance | engage with me more |
| Seeking praise | validate emotional significance |
| Emotional openness | handle me carefully |

Submission should remain agentic. Weak submissive writing becomes passive compliance. Strong submissive writing is emotionally responsive participation that shapes chemistry, tension, and intimacy.

Submissive archetype combinations:

| Combination | Dynamic |
| --- | --- |
| brat + teasing dominant | banter-heavy tension |
| devotional + protective dominant | deep emotional intimacy |
| stoic + soft dominant | devastating slow burn |
| reactive + teasing dominant | flirt escalation loops |
| guarded + patient dominant | trust-building slow burn |
| competent + commanding dominant | high-tension mutual respect |

Submission can evolve:

```text
playful resistance
-> emotional trust
-> selective vulnerability
-> deep receptiveness
-> mutual emotional surrender
```

Submissive variables:

| Variable | Meaning |
| --- | --- |
| Responsiveness | reaction intensity |
| Yielding comfort | comfort surrendering control |
| Trust threshold | safety required for openness |
| Attention need | desire for focused engagement |
| Emotional transparency | visible reactions |
| Vulnerability tolerance | comfort being emotionally seen |
| Reassurance need | need for validation |
| Playfulness | comfort with tension play |
| Attachment intensity | emotional investment depth |

Submissive chemistry equation:

```text
high trust
+ intentional vulnerability
+ emotional responsiveness
+ focused attention
= powerful submissive chemistry
```

Switch archetypes describe adaptive, emotionally responsive power fluidity. A switch is not indecisive, inconsistent, or half dominant and half submissive. A strong switch asks: how do I want to emotionally engage with you right now?

Useful switch archetypes:

| Archetype | Core Energy | Creates |
| --- | --- | --- |
| Playful switch | interaction determines the dynamic | lively banter, reversal games |
| Emotional switch | emotional state changes relational role | realistic role shifts |
| Guarded switch | control protects, yielding requires trust | powerful slow-burn surrender |
| Competitive switch | power shifts through challenge | rivalry, reversals, admiration |
| Devotional switch | mutual emotional surrender | mature reciprocal intimacy |
| Brat-to-soft switch | public provocation, private openness | tension to softness payoff |
| Stoic-to-reactive switch | composure cracks under pressure | small reactions become huge |
| Service/control switch | caretaking alternates with being cared for | reciprocal realism |
| Chaotic switch | impulsive fluctuation | intoxicating or exhausting instability |
| Competent vulnerability switch | capable person selectively yields | high intimacy through chosen vulnerability |
| Mirror switch | adapts to partner energy | fluid chemistry and attunement |
| Only with you switch | behavior changes for one partner | exclusivity and private intimacy |

Switch dynamics are powerful because reversals create payoff: the teasing dominant becomes vulnerable, the brat grounds the other person, the protector accepts comfort, or the stoic character visibly reacts. Those reversals make the relationship feel alive.

Common switch loops:

```text
tease
-> reaction
-> escalation
-> reversal
-> laughter/tension
```

```text
control
-> vulnerability
-> reassurance
-> regained composure
```

```text
restraint
-> emotional crack
-> retreat
-> longing
-> deeper vulnerability
```

Switch variables:

| Variable | Meaning |
| --- | --- |
| Power fluidity | willingness to shift roles |
| Emotional adaptability | responsiveness to partner state |
| Vulnerability flexibility | comfort alternating openness/control |
| Initiative balance | who leads interaction |
| Reciprocity | mutual emotional influence |
| Composure stability | resistance to emotional reversal |
| Trust | safety enabling flexibility |
| Attention responsiveness | reaction sensitivity |

Switch chemistry equation:

```text
mutual attraction
+ emotional responsiveness
+ trust
+ power reversals
= highly dynamic chemistry
```

Attachment and tone affect expression:

| Attachment | Common D/s Expression |
| --- | --- |
| Secure | responsive and balanced |
| Anxious | reassurance-seeking submission |
| Avoidant | control-oriented dominance |
| Fearful | fluctuating power shifts |

| Tone | Result |
| --- | --- |
| Playful | teasing chemistry |
| Yearning | restrained surrender |
| Tense | power negotiation |
| Devotional | emotionally profound trust |
| Chaotic | unstable power struggle |
| Tender | emotionally safe leadership |

Strong D/s is emotionally interactive. Weak D/s is one character controlling and the other obeying mechanically. Strong D/s means both characters are responsive to each other's reactions, boundaries, trust, and vulnerability.

Healthy D/s variables:

| Variable | Meaning |
| --- | --- |
| Initiative | who leads escalation |
| Emotional control | regulation ability |
| Yielding comfort | willingness to emotionally surrender |
| Trust | safety with vulnerability |
| Provocation enjoyment | pleasure in tension play |
| Responsiveness | emotional reactivity |
| Power fluidity | ability to shift roles |
| Containment need | desire for grounding or structure |
| Validation need | desire for focused attention |

D/s evolution:

```text
teasing challenge
-> tension control
-> emotional trust
-> vulnerability exchange
-> mutual emotional surrender
```

Romance equation:

```text
mutual attraction
+ trust
+ emotional responsiveness
+ power negotiation
= high-intensity romantic chemistry
```

#### Kink-Aware Dynamics

Kink-aware dynamics are recurring patterns of attraction, emotional stimulation, tension, fantasy, or intimacy that a user may find psychologically or erotically compelling. They are not only explicit sexual acts. Many kink dynamics are about emotional meaning: power, attention, vulnerability, control, praise, restraint, trust, transformation, and significance.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Kink | recurring erotic or psychological attraction pattern |
| Fetish | arousal strongly tied to a specific object or body focus |
| Fantasy | imagined emotional or erotic scenario |
| Dynamic | recurring relationship interaction pattern |
| Preference | general attraction tendency |

The core principle is emotion plus meaning plus tension plus trust plus fantasy. For example, praise-oriented dynamics are often less about the words alone and more about validation, focused attention, and feeling positively seen by someone important.

Kink should modify interaction style, not replace emotional development. Chemistry, trust, attachment, pacing, boundaries, and consent still matter. The runtime should treat kink-aware preferences as a style and meaning layer over existing romance systems, not as permission for instant escalation.

Useful kink-aware dynamic categories:

| Category | Emotional Core | Runtime Use |
| --- | --- | --- |
| Praise-oriented | validation and focused approval | warmer affirmation, reassurance, visible approval |
| Power exchange | leadership, yielding, trust | D/s pacing, guidance, surrender, role fluidity |
| Attention/focus | becoming emotionally central | possessive attention, fixation, prioritization |
| Restraint/denial | anticipation and delayed gratification | slow burn, teasing, emotional restraint |
| Protective/caretaking | safety and containment | grounding, reassurance, careful comfort |
| Vulnerability | exposure and acceptance | confessions, being seen, emotional surrender |
| Possessive/claiming | exclusivity and prioritization | jealousy play, chosen exclusivity, devotion |
| Competence/admiration | capability and authority | respect, mentor energy, competence attraction |
| Brat/provocation | resistance and reaction | playful challenge, reaction loops, attention reinforcement |
| Devotional | reverence and significance | focused care, loyalty, worshipful attention |
| Emotional dependency | becoming necessary | reassurance loops, centrality, "you calm me" dynamics |
| Chase | pursuit and uncertainty | flirt pursuit, hard-to-get energy, tension escalation |
| Corruption/transformation | change through attraction | softening, unraveling, confidence growth |
| Size/strength/protection | safety through presence | shielding, carrying, protective physicality |
| Emotional overwhelm | composure breaking | jealousy cracks, desperate confessions, loss of control |

More granular kink tags can be grouped by emotional engine:

| Group | Tags | Core Emotional Theme |
| --- | --- | --- |
| Affection and attention | praise, worship, attention/focus, devotion, adoration, obsession/neediness, possessiveness, jealousy play, pet names, being watched, validation seeking, begging dynamics | validation, centrality, admiration, reassurance, indispensability |
| Power exchange | dominance, submission, service, obedience, bratting, discipline, command/control, ownership language, possession dynamics, soft dominance, gentle femdom, caregiver/little, protector dynamics, authority figure dynamics | control, surrender, trust, structure, challenge, safety |
| Tension and anticipation | teasing, denial, slow seduction, non-dangerous edge play, chase/pursuit, consensual resistance play, push-pull, forbidden attraction, almost-touching, emotional restraint, flirt-fighting | restraint, longing, uncertainty, challenge, escalation |
| Emotional vulnerability | emotional exposure, comfort/aftercare focus, crying comfort, confession dynamics, dependency themes, needing/reassurance, safe surrender, emotional caretaking, "stay with me", emotional softening | vulnerability, safety, caretaking, trust, abandonment reassurance |
| Devotional and romantic | soulmate fantasy, exclusive attention, romantic possession, loyalty dynamics, sacrifice/worship, emotional monopolization, eternal commitment, rescue fantasy, healing dynamics, reunion/return | destiny, singularity, permanence, restoration, chosen devotion |
| Psychological | mind games, consensual manipulation fantasy, corruption fantasy, temptation dynamics, emotional power imbalance, rivalry attraction, intimidation attraction, fear-tension, emotional dependency fantasy | stimulation, transformation, restraint breaking, asymmetry, intensity |
| Sensory and physical | touch sensitivity, sensory deprivation, restraint, temperature play, massage/sensual touch, hair pulling, biting, marking, clothing/uniform attraction, scent attraction | embodied intimacy, surrender, intensity, symbolic claiming |
| Praise and degradation spectrum | praise, encouragement, approval seeking, consensual humiliation, consensual degradation, mockery/teasing, embarrassment dynamics | worth, support, exposure, shame tension, reactive vulnerability |
| Possession and exclusivity | territoriality, "mine/yours" language, protective jealousy, exclusivity rituals, public claiming, emotional dependency, obsessive attention | claiming, uniqueness, visibility, fixation |
| Romantic roleplay dynamics | enemies-to-lovers energy, friends-to-lovers longing, forbidden romance, rival dynamics, bodyguard/protected, teacher/mentor, royalty/servant, celebrity/fan, stranger seduction | trope-shaped tension, status, safety, mystery, idealization |

Healthy possessive or claiming dynamics should emphasize significance, devotion, and chosen exclusivity. They must not reduce autonomy, coerce behavior, or convert jealousy into control. Likewise, emotional dependency can feel romantic, healing, or consuming only when balanced by agency and reciprocity.

Kinks often map to emotional needs:

| Kink Energy | Possible Emotional Need |
| --- | --- |
| Praise | validation |
| Submission | trust and safety |
| Dominance | control or containment |
| Jealousy | reassurance and significance |
| Teasing | interaction and attention |
| Devotion | emotional centrality |
| Restraint | anticipation and tension |
| Protection | safety |
| Possessiveness | exclusivity |
| Vulnerability | acceptance |

Attachment-linked kink mapping should remain available as interpretation data, not deterministic diagnosis:

| Kink | Common Psychological Link |
| --- | --- |
| Praise | inadequacy wounds |
| Exclusivity | replacement fears |
| Caretaking | emotional neglect wounds |
| Submission | control fatigue |
| Dominance | safety or control restoration |
| Devotion | abandonment wounds |
| Attention/focus | invisibility wounds |
| Jealousy play | reassurance seeking |
| Emotional dependency | attachment hunger |
| Protective dynamics | safety needs |

Attachment style should shape expression:

| Style | Common Tendency |
| --- | --- |
| Secure | balanced reciprocal exploration |
| Anxious | reassurance, praise, dependency dynamics |
| Avoidant | control and restraint dynamics |
| Fearful | intense push-pull and vulnerability tension |

Trope context should also bias kink-aware dynamics:

| Trope | Common Dynamic Themes |
| --- | --- |
| Enemies to lovers | power struggle, tension, provocation |
| Friends to lovers | emotional vulnerability, longing |
| Slow burn | restraint, anticipation |
| Healing romance | caretaking, reassurance |
| Rivals to lovers | challenge and admiration |
| Forbidden romance | secrecy, suppression |
| Devotion romance | emotional worship, prioritization |

Kink progression should follow emotional readiness:

```text
curiosity
-> teasing
-> trust
-> emotional responsiveness
-> vulnerability
-> deeper dynamic exploration
```

The app should block or redirect kink-aware escalation when boundaries, age eligibility, consent, reciprocity, or scene context are not met. The strongest kink-aware romance feels emotionally integrated, emerging from attachment, chemistry, trust, personality, and emotional needs rather than random provocative behavior.

Useful kink variables:

| Variable | Meaning |
| --- | --- |
| Trust | emotional safety |
| Responsiveness | reaction intensity |
| Power preference | comfort leading or yielding |
| Attention need | desire for focused engagement |
| Validation need | praise or reassurance importance |
| Vulnerability comfort | openness tolerance |
| Tension enjoyment | comfort with prolonged anticipation |
| Emotional dependency | attachment intensity |
| Exclusivity desire | need for prioritization |
| Fantasy integration | how naturally the fantasy fits the relationship |
| Boundary fit | whether current context supports the dynamic |

Kink-aware romance equation:

```text
emotion
+ meaning
+ tension
+ trust
+ fantasy
= kink-aware chemistry
```

#### Fetish-Aware Dynamics

Fetish-aware dynamics are narrower than kink dynamics. A fetish is a highly specific pattern of attraction, fixation, or arousal tied to a particular object, body focus, material, situation, sensation, symbol, or psychological association. Kinks describe broader emotional patterns; fetishes describe specific triggers or attention anchors.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Kink | broader dynamic or emotional pattern |
| Fetish | highly specific fixation or trigger |
| Preference | general attraction tendency |
| Fantasy | imagined scenario |
| Chemistry | interactional attraction |

The core principle is association plus attention plus emotional meaning plus anticipation. The stimulus becomes charged because it carries symbolic, sensory, relational, or memory-based significance.

Broad fetish-aware categories:

| Category | Focus | Possible Meaning |
| --- | --- | --- |
| Body-part | feet, hands, hair, legs, stomach, back, neck, voice, muscles, height difference, freckles, eyes, lips, scent | visual specificity, embodied admiration, instinctive intimacy |
| Clothing/material | lingerie, uniforms, leather, latex, stockings, high heels, glasses, jewelry, silk/satin, tight clothing, cosplay | authority, identity, sensual texture, transformation |
| Sensory | touch, temperature, audio/ASMR, scent, texture, blindfold/sensory restriction, pressure/compression | sensory immersion, anticipation, containment |
| Psychological/situational | voyeurism fantasy, exhibitionism fantasy, transformation, roleplay, authority, corruption, rescue, possession, worship, obsession | attention, control, salvation, idealization, fixation |
| Power/control | surrender, authority, restraint, obedience, challenge | trust, control, vulnerability |
| Emotional/attachment | praise, dependency, caretaking, jealousy/exclusivity, emotional vulnerability, protective dynamics, aftercare | validation, reliance, safety, singularity |
| Relationship dynamic | enemies-to-lovers, rivalry, forbidden romance, friends-to-lovers, age gap, power couple, bodyguard/protected | tension, competition, taboo, familiarity, admiration |
| Fantasy archetype | vampire, monster romance, royalty, celebrity, teacher/mentor, villain attraction, obsessive archetype | danger, otherness, status, attention, intensity |

Fetish-oriented RP should integrate emotional meaning. Weak usage is a disconnected provocative detail. Strong usage ties the specific attraction pattern to personality, emotional needs, chemistry, trust, and the relationship dynamic.

Examples of symbolic mapping:

| Fetish Focus | Possible Emotional Meaning |
| --- | --- |
| Praise | validation |
| Restraint | anticipation or control |
| Possessiveness | significance and exclusivity |
| Uniforms | authority or competence |
| Vulnerability | acceptance |
| Teasing | emotional responsiveness |
| Caretaking | safety |
| Emotional control | stability |
| Emotional overwhelm | impact and intensity |

Common emotional themes behind fetish tags:

| Theme | Common Links |
| --- | --- |
| Validation | praise, worship |
| Safety | protection, caretaking |
| Control | dominance, restraint |
| Surrender | submission, vulnerability |
| Exclusivity | possession, jealousy |
| Attention | voyeurism, exhibitionism, obsession |
| Transformation | corruption, roleplay |
| Shame | consensual humiliation, exposure |
| Intensity | danger, forbidden dynamics |

Archetype and tone should influence expression:

| Archetype | Associated Energy |
| --- | --- |
| Soft dominant | reassurance and grounding |
| Teasing dominant | reaction-focused tension |
| Brat | provocation and attention |
| Stoic character | composure-cracking tension |
| Devotional partner | worship and attention |
| Rival | challenge and competence |
| Protector | safety and caretaking |

| Tone | Fetish Feel |
| --- | --- |
| Playful | teasing and reactive |
| Yearning | restrained longing |
| Devotional | emotionally profound |
| Tense | control and anticipation |
| Chaotic | overwhelming intensity |
| Tender | safety and vulnerability |

Fetish progression should follow relationship readiness:

```text
curiosity
-> teasing awareness
-> emotional responsiveness
-> trust
-> exploration
-> integrated intimacy
```

Fetishes should shape interaction texture: dialogue, attention, tension, reactions, pacing, sensory focus, and chemistry. They should not become the only relationship content unless the route intentionally models obsession or fixation, and even then the app should preserve boundaries, agency, and context.

Useful fetish variables:

| Variable | Meaning |
| --- | --- |
| Attention fixation | intensity of focus |
| Sensory responsiveness | reaction to stimuli |
| Emotional symbolism | emotional meaning intensity |
| Trust | comfort exploring vulnerability |
| Tension enjoyment | comfort with anticipation |
| Validation need | importance of emotional recognition |
| Power comfort | comfort with control or yielding |
| Emotional reactivity | reaction visibility |
| Novelty seeking | desire for stimulation |
| Symbolic intimacy | how personal the trigger becomes inside the relationship |
| Boundary fit | whether current context supports the trigger |

Fetish-aware romance principle:

```text
specific attention
+ emotional meaning
+ trust
+ anticipation
= symbolic romantic chemistry
```

## Trigger Engine

Build the deterministic parser first. Use curated regex detectors as small named checks inside a local parser, not as one giant free-form regex system.

Before trigger detection, classify each user message into an interaction track:

- `IC`: in-character story action, dialogue, narration, and scene movement
- `OOC`: player/meta instruction, preference, pacing request, boundary clarification, or app control

Use common roleplay conventions as deterministic hints, such as messages fully wrapped in parentheses or square brackets for OOC. Track detection should remain user-overridable later.

Good trigger categories:

- confession
- apology
- comfort
- betrayal
- teasing
- abandonment
- reassurance
- jealousy moment
- affection expression
- flirt
- trust break
- care-taking
- boundary pressure
- refusal
- gift or gesture
- lore milestone

Each trigger should return a structured candidate:

```ts
type TriggerCandidate = {
  id: string;
  kind: string;
  confidence: number;
  evidence: string;
  suggestedMilestone?: string;
  suggestedTrait?: string;
};
```

The runtime accepts a candidate only if it is allowed for the current route, stage, and safety state. LLM function calling can be added later as a semantic assistant, but its output should be treated as a candidate for local validation, not as canonical state mutation.

Important events should become memories or unresolved beats. Filler should remain ordinary transcript until it is summarized or discarded by retention policy.

Event effects should be treated as hidden soft influence, not direct dialogue scripting:

| Event | Main Effect |
| --- | --- |
| Confession | raises intimacy and forces clarity |
| Apology | repairs trust and lowers conflict |
| Comfort | raises safety and attachment |
| Betrayal | damages trust and raises conflict |
| Teasing | raises tension and playfulness |
| Abandonment | raises insecurity and lowers safety |
| Reassurance | lowers fear and raises stability |
| Jealousy moment | reveals attachment and raises tension |
| Affection expression | confirms care and raises warmth |

### Confession Events

A confession is the intentional revelation of emotionally significant truth. It is not limited to "I love you." It can reveal attraction, jealousy, dependency, betrayal, fear, hidden identity, desire, vulnerability, or devotion.

Confessions are phase-transition events because they collapse ambiguity, force emotional reality into the open, shift leverage, and permanently alter how later interactions are interpreted.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Flirting | implication |
| Emotional leakage | accidental revealing |
| Vulnerability | emotional openness |
| Confession | explicit emotional truth |
| Commitment | choosing relationship action |

A confession matters because emotional risk becomes explicit: the character risks rejection, judgment, loss, vulnerability, or rupture by telling the truth.

Useful confession types:

| Type | Core Truth | Common Effect |
| --- | --- | --- |
| Romantic | I have romantic feelings for you | moves ambiguity toward explicit romance |
| Vulnerability | here is the part of me I hide | deepens intimacy and attachment |
| Dependency | you matter more than I intended | reveals emotional centrality |
| Desire | I want you | clarifies attraction or sexual tension |
| Fear | I am afraid | accelerates intimacy through honesty |
| Jealousy | your attention to others affects me | reveals attachment, often messily |
| Betrayal | I hurt you | creates rupture or hard repair path |
| Identity | this is who I really am | changes self/relationship interpretation |
| Devotional | you changed my emotional world | late-stage emotional gravity |
| Silent | action reveals the truth | sacrifice, panic, protection, or breakdown speaks for them |

Confession style should be shaped by attachment, restraint, tone, and phase:

| Style | Behavior |
| --- | --- |
| Direct | clear explicit honesty |
| Indirect | emotionally implied but not fully named |
| Accidental | truth escapes under pressure |
| Defensive | truth hidden inside anger, sarcasm, or deflection |
| Desperate | pressure breaks during near-loss, danger, or separation |
| Quiet | calm sincerity after long internal buildup |
| Silent | action makes the truth undeniable |

Confession timing matters. The strongest confessions confirm what was already emotionally visible. The player should feel "finally," not "where did that come from." Buildup should consider restraint, almost-confessions, jealousy, longing, shared history, fear of loss, and accumulated emotional pressure.

Confessions often shift emotional leverage. The first person to confess becomes temporarily more vulnerable, which can create tenderness, fear, instability, or a recalibration phase. The runtime should not force an immediate reciprocal confession; it should let the receiving character react according to their phase, attachment, reciprocity confidence, and boundaries.

Confession variables:

| Variable | Meaning |
| --- | --- |
| Emotional pressure | accumulated unspoken feeling |
| Vulnerability threshold | ability to risk honesty |
| Fear of rejection | resistance to confession |
| Restraint level | suppression intensity |
| Reciprocity confidence | belief feelings are mutual |
| Emotional urgency | pressure to speak now |
| Attachment depth | emotional significance |

Confession inevitability:

```text
high attachment
+ high restraint
+ fear of loss
= confession inevitability
```

### Redemption Arcs

Redemption is the process of becoming emotionally worthy of trust, intimacy, forgiveness, or love after causing harm, failing morally, or losing oneself. It is not punishment alone, guilt alone, self-hatred, or instant forgiveness.

Real redemption requires transformation demonstrated through sustained behavior. The app should treat redemption as a long repair arc, not a one-turn apology reward.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Redemption | moral or emotional transformation |
| Forgiveness | injured person releasing resentment |
| Atonement | attempts to repair harm |
| Punishment | suffering consequences |
| Reconciliation | rebuilding relationship |
| Self-forgiveness | internal healing |

A character can be redeemed without being forgiven, forgiven without being redeemed, punished without changing, or changed without reconciliation.

Core redemption phases:

| Phase | Emotional Question | Runtime Behavior |
| --- | --- | --- |
| Harm | something broke | rupture, distrust, emotional distance |
| Awareness | I understand what I caused | denial collapses, impact is recognized |
| Unworthiness | maybe I do not deserve love | shame, withdrawal, self-sabotage, yearning |
| Atonement | I need to become different | behavior changes before reward |
| Trust resistance | why should I believe you now? | hurt person doubts sincerity and tests consistency |
| Demonstration | you changed without guaranteed forgiveness | repeated repair, accountability, less self-centering |
| Emotional reopening | maybe I can trust you again | fragile tenderness and cautious vulnerability |
| Reconciliation | we choose each other again | a new relationship, not restoration of innocence |

Useful redemption arc types:

| Type | Core Harm | Main Repair Question |
| --- | --- | --- |
| Betrayal | lying, abandonment, broken promises | can trust rebuild? |
| Moral | cruelty, corruption, selfishness | has identity transformed? |
| Emotional | neglect, avoidance, manipulation | can love become safe? |
| Self-redemption | loss of self-respect | can I become someone I respect? |
| Protective | caused harm or failed to protect | can care become accountable? |
| Identity | worldview or role collapse | can I stop being who I built myself around? |

Love should inspire redemption, not replace it. The better pattern is not "you loved me, so harm vanished"; it is "your love made me want to become accountable." Suffering is not redemption. The key question is whether the character has actually changed how they love.

Redemption interacts with tone, attachment, and power:

| Tone | Redemption Feel |
| --- | --- |
| Melancholic | painful longing |
| Hopeful | healing transformation |
| Fragile | cautious repair |
| Devotional | profound loyalty |
| Yearning | emotional ache |
| Tender | careful forgiveness |

| Attachment | Redemption Pattern |
| --- | --- |
| Secure | accountable repair |
| Anxious | guilt plus reassurance seeking |
| Avoidant | withdrawal plus delayed repair |
| Fearful | self-sabotage plus longing |

Redemption often reverses leverage. If the harmful character once held emotional, social, or strategic power, the hurt character may now hold trust power. That imbalance creates humility, vulnerability, and emotional gravity.

The strongest redemption arcs are built through small repeated behaviors: showing up, respecting boundaries, remembering fears, apologizing properly, not demanding forgiveness, protecting quietly, and accepting consequences calmly. The redeemed character often must risk more, wait longer, tolerate uncertainty, and give without guarantee.

Redemption variables:

| Variable | Meaning |
| --- | --- |
| Guilt | awareness of harm |
| Accountability | ownership without defensiveness |
| Trust damage | severity of rupture |
| Repair consistency | sustained changed behavior |
| Fear of rejection | vulnerability resistance |
| Self-worth | belief in deserving love |
| Forgiveness readiness | openness to repair |
| Behavioral change | actual transformation |
| Sacrifice willingness | willingness to prioritize repair |

Redemption equation:

```text
deep harm
+ genuine accountability
+ sustained behavioral change
+ slow rebuilding of trust
= powerful redemption romance
```

### Reassurance Mechanics

Reassurance is behavior intended to restore emotional safety, significance, trust, or relational security after uncertainty, fear, vulnerability, conflict, jealousy, or emotional destabilization. At its deepest level, reassurance is emotional regulation through connection: you still matter to me.

Reassurance usually appears when fear plus attachment creates a need for emotional confirmation. Without reassurance, relationships can become anxious, unstable, ambiguous, and conflict-heavy. With reassurance, relationships develop safety, trust, intimacy, and resilience.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Reassurance | restoring emotional security |
| Validation | acknowledging feelings |
| Comfort | emotional soothing |
| Affection | expressing care |
| Commitment | long-term choosing |

Useful reassurance modes:

| Mode | Core Message | Examples |
| --- | --- | --- |
| Verbal | explicit emotional confirmation | "I care about you", "We are okay" |
| Physical | safety through touch and proximity | hand holding, hugging, forehead touch |
| Behavioral | care proven through consistency | showing up, keeping promises, checking in |
| Protective | I will protect your wellbeing | defending, shielding, emotional caretaking |
| Exclusivity | you are emotionally prioritized | public choice, jealousy reassurance, boundary clarity |
| Conflict | conflict does not mean abandonment | staying present, repair attempts, consistency after rupture |
| Vulnerability | you are accepted after exposure | comfort after confession, nonjudgmental presence |
| Silent | I am here | staying nearby, making food, quiet eye contact |
| Devotional | you are deeply significant to me | loyalty, intense prioritization, reverent care |
| Future-oriented | I still imagine a future with you | continuity language, future plans, permanence framing |

Reassurance interacts with attachment and communication:

| Attachment | Reassurance Pattern |
| --- | --- |
| Secure | balanced reassurance |
| Anxious | frequent reassurance need |
| Avoidant | subtle or behavioral reassurance |
| Fearful | craves reassurance but distrusts it |

| Communication Style | Reassurance Form |
| --- | --- |
| Direct | explicit verbal confirmation |
| Restrained | subtle actions |
| Teasing | reassurance hidden inside banter |
| Devotional | emotionally intense affirmation |
| Avoidant | indirect consistency |
| Caretaking | practical support |

Conflict without reassurance often escalates insecurity. Conflict plus reassurance can deepen trust because the relationship proves it can survive emotional difficulty.

Reassurance fails when it is inconsistent, emotionally unbelievable, contradicted by behavior, dismissive, forced, or manipulative. "I care about you" loses credibility if the character repeatedly disappears emotionally. Behavioral contradiction destroys reassurance trust.

Reassurance saturation should be tracked. Too much reassurance can reduce tension, create dependency, or weaken pacing. Too little reassurance destabilizes attachment and escalates conflict. Healthy romance balances uncertainty and reassurance.

Reassurance should address the underlying fear, not only the surface issue. If the surface issue is "you forgot to text me" but the real fear is "I am not emotionally important to you," strong reassurance says "you matter to me even when I am overwhelmed."

Reassurance often changes emotional leverage. A restrained character giving direct reassurance can be a major vulnerability event. The harder reassurance is for a character, the more powerful it feels.

Reassurance progression:

```text
explicit reassurance
-> habitual reassurance
-> assumed emotional safety
```

Useful reassurance variables:

| Variable | Meaning |
| --- | --- |
| Reassurance need | frequency of emotional confirmation needed |
| Reassurance ability | comfort providing emotional safety |
| Emotional security | baseline relationship stability |
| Fear of abandonment | sensitivity to uncertainty |
| Trust stability | resilience under ambiguity |
| Validation sensitivity | importance of emotional acknowledgment |
| Consistency | reliability of emotional presence |
| Repair speed | ability to restore security after rupture |
| Reassurance credibility | whether words match behavior |
| Reassurance saturation | normalization or dependency from repetition |
| Underlying fear addressed | whether reassurance meets the real fear |

Reassurance equation:

```text
vulnerability
+ repeated reassurance
+ consistent behavior
= believable emotional safety
```

### Romantic Intent

Intent is what a character is trying to emotionally achieve in an interaction. It is not the literal wording, the conscious explanation, or the practical goal. It is the underlying emotional objective driving behavior.

Dialogue without intent feels flat. Dialogue with intent feels psychologically coherent because attraction, fear, jealousy, repair, and longing are often expressed indirectly.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Emotion | what they feel |
| Intent | what they want emotionally |
| Behavior | how they act |
| Tone | how the interaction feels |
| Goal | practical outcome |

Example:

```text
Emotion: jealousy
Intent: seek reassurance
Behavior: teasing criticism
Tone: playful tension
```

Useful romantic intent categories:

| Intent | Core Desire | Common Behavior |
| --- | --- | --- |
| Connection-seeking | move emotionally closer to me | questions, lingering, attention-seeking, excuses to interact |
| Reassurance-seeking | tell me I matter to you | emotional testing, fishing for affection, insecurity cues |
| Emotional testing | how much do you care? | withdrawal, fake indifference, provocation, delayed responses |
| Desire expression | I want you to feel desired | flirting, proximity, compliments, tension escalation |
| Self-protection | avoid emotional risk | deflection, sarcasm, withdrawal, minimizing feelings |
| Control | maintain emotional leverage | composure, withholding, strategic restraint |
| Comfort-giving | help you feel safe | reassurance, grounding, caretaking |
| Provocation | I want a reaction from you | baiting, smirking, challenging, playful insult |
| Vulnerability | see and accept the real me | confession, honesty, fear disclosure |
| Avoidance | prevent escalation | changing subject, distancing, pretending not to notice tension |
| Possessive | confirm emotional exclusivity | jealousy, prioritization-seeking, heightened attention |
| Repair | restore emotional safety | apology, accountability, reassurance, transparency |

Intent determines subtext. The same surface line can carry different emotional objectives:

| Surface Line | Possible Intent |
| --- | --- |
| You are late. | concern, jealousy, punishment, longing, insecurity, flirtation |
| You should go. | protect you, reject you, test whether you stay, hide vulnerability |
| Go date them then. | hurt, jealousy, fear of loss, reassurance seeking |
| It is not a big deal. | self-protection, denial, conflict avoidance |

Intent should be interpreted through attachment, flirting style, and power:

| Attachment | Common Hidden Intent |
| --- | --- |
| Secure | connection and repair |
| Anxious | reassurance and closeness |
| Avoidant | self-protection and control |
| Fearful | closeness and escape at the same time |

| Flirting Style | Likely Intent |
| --- | --- |
| Teasing | provoke attention |
| Sincere | create closeness |
| Dominant | control tension |
| Subtle | gauge reciprocity |
| Awkward | express interest safely |
| Devotional | emotionally affirm |

Power changes how intent is expressed. A vulnerable character may directly seek reassurance; a more guarded or dominant character may provoke jealousy instead. Same need, different strategy.

Subtext happens when spoken meaning does not equal emotional intent. The runtime should preserve this mismatch when appropriate:

```text
emotion: fear
intent: seek reassurance
behavior: teasing provocation
```

Intent variables:

| Variable | Meaning |
| --- | --- |
| Closeness seeking | desire for intimacy |
| Fear of vulnerability | resistance to openness |
| Reassurance need | need for emotional confirmation |
| Emotional leverage desire | desire to maintain control |
| Reciprocity testing | checking mutual feelings |
| Conflict avoidance | resistance to escalation |
| Emotional transparency | willingness to be direct |
| Attachment urgency | pressure for connection |

### Teasing

Teasing is playful emotional provocation intended to create attention, tension, intimacy, reaction, or flirtation. At its best, teasing says "I am paying special attention to you" without requiring direct emotional exposure.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Teasing | playful provocation |
| Mockery | humiliation-focused ridicule |
| Bullying | dominance through harm |
| Banter | mutual playful exchange |
| Flirting | attraction signaling |
| Provocation | intentional reaction seeking |

Healthy teasing preserves emotional safety, allows reciprocity, and creates playfulness. Bad teasing humiliates, attacks vulnerabilities cruelly, or destabilizes safety. The runtime should treat teasing as chemistry-building only when the current relationship context supports mutual play.

Useful teasing modes:

| Mode | Core Feeling | Runtime Behavior |
| --- | --- | --- |
| Playful | interacting with you is fun | harmless provocation, jokes, exaggerated reactions |
| Flirtatious | I want to create tension | reaction testing, suggestive implication, playful challenge |
| Affectionate | I know you safely | inside jokes, fond exasperation, gentle habit-reading |
| Competitive | I enjoy challenging you | ego poking, rivalry, competence-based attention |
| Protective | I am softening concern with humor | joking while caring, masking worry |
| Defensive | I am hiding emotional exposure | jokes, deflection, provocation after vulnerability |
| Sexual | I want anticipation and reaction | adult-gated teasing tied to consent and pacing |
| Devotional | I know you deeply enough to play gently | attentive, safe, intimate pattern recognition |
| Soft cruel | attraction mixed with challenge | only safe when mutual, understood, and not harmful |
| Silent | no explicit joke | smirk, deliberate eye contact, knowing look, subtle proximity |

Teasing changes across phases:

| Phase | Function |
| --- | --- |
| Early attraction | test chemistry and responsiveness |
| Mid slow burn | mask attraction and create plausible deniability |
| Established relationship | maintain affection, familiarity, regulation, and intimacy |

Teasing should interact with attachment, power, and chemistry:

| Attachment | Teasing Pattern |
| --- | --- |
| Secure | playful and responsive |
| Anxious | reassurance-seeking teasing |
| Avoidant | defensive teasing |
| Fearful | inconsistent provocative teasing |

| Chemistry | Teasing Feel |
| --- | --- |
| Banter | rapid playful exchange |
| Tension | provocative restraint |
| Oppositional | challenge-heavy teasing |
| Soft longing | subtle emotionally loaded teasing |
| Sexual | adult-gated reaction-focused escalation |

Teasing often negotiates emotional leverage. A character may tease to hide vulnerability, provoke pursuit, test attachment, regain control, or invite closeness without saying so directly.

The strongest teasing reveals attention. It should be specific to the character: habits, tells, preferences, routines, contradictions, and private patterns. Generic teasing becomes repetitive quickly.

Teasing plus restraint is slow-burn fuel:

```text
attraction
+ emotional restraint
+ teasing
= sustained romantic tension
```

Failure modes to avoid: repetitive teasing, teasing disconnected from context, cruelty without care, constant teasing without sincerity, and teasing used forever instead of progression. Strong teasing should eventually escalate into emotional layering or vulnerability.

#### Bratty Dynamics

Bratty energy is playful resistance mixed with attention-seeking, provocation, emotional testing, or tension creation. At its healthiest, it is interactive emotional play: "engage with me", "react to me", "prove you can keep up", or "I want tension without full vulnerability."

Keep the safety distinction explicit:

| Healthy Bratty Energy | Unhealthy Behavior |
| --- | --- |
| playful provocation | cruelty |
| mutual engagement | disrespect |
| tension creation | emotional abuse |
| reaction-seeking | manipulation |
| emotionally responsive | boundary violation |
| flirtatious resistance | contempt |

The difference is reciprocity plus emotional safety. Bratty behavior should never be treated as a license to ignore boundaries, humiliate, or escalate coercively.

Useful bratty modes:

| Mode | Core Feeling | Runtime Behavior |
| --- | --- | --- |
| Playfully defiant | I challenge you because it is fun | teasing resistance, smirking pushback |
| Attention-seeking | notice me specifically | interruption, exaggerated reaction, fake annoyance |
| Flirt-brat | I want tension without surrendering vulnerability | provocative comments, challenge, "make me" energy |
| Defensive | I am affected, so I provoke instead of admitting it | sarcasm, fake irritation, emotional deflection |
| Competitive | I refuse to lose ground | one-upmanship, challenge, refusal to surrender |
| Affectionate | I feel safe enough to resist playfully | fake complaints, dramatic domestic resistance |
| Chaos | I enjoy destabilizing the energy | impulsive escalation, unpredictable reaction-seeking |

Bratty dynamics are power negotiation. They test confidence, steadiness, pursuit, emotional responsiveness, and whether the other character can handle tension without losing care.

Bratty behavior often hides indirect vulnerability:

| Surface | Possible Intent |
| --- | --- |
| You cannot tell me what to do. | flirt with me, challenge me back, prove you care |
| Make me. | engage with me, escalate playfully, hold the tension |
| I am not impressed. | keep trying, notice me, earn my reaction |
| Whatever. | that affected me more than I want to admit |

Bratty energy should shift by phase:

| Phase | Function |
| --- | --- |
| Early attraction | create energy and test chemistry |
| Slow burn | mask attraction and avoid vulnerable honesty |
| Established relationship | maintain playfulness and familiar chemistry |

Attachment and tone affect the shape:

| Attachment | Bratty Pattern |
| --- | --- |
| Secure | playful and regulated |
| Anxious | reassurance-seeking provocation |
| Avoidant | defensive teasing |
| Fearful | chaotic push-pull provocation |

| Tone | Result |
| --- | --- |
| Playful | fun teasing chemistry |
| Tense | provocative challenge |
| Yearning | emotionally loaded resistance |
| Chaotic | unstable escalation |
| Affectionate | safe playful intimacy |

Strong bratty chemistry needs responsiveness, mutual enjoyment, emotional safety, boundaries, affection underneath, and reciprocity. Weak bratty writing becomes random rudeness. Strong bratty writing is emotionally meaningful resistance designed to create engagement.

Chemistry equation:

```text
playful resistance
+ mutual attraction
+ emotional responsiveness
+ restraint
= high flirt tension
```

Usually important:

- first kiss
- user remembered a birthday or private detail
- breakup
- promise
- traumatic confession
- apology after harm
- betrayal or repair

Usually not important by itself:

- ordering coffee
- random jokes
- filler chatter
- logistics with no emotional or plot consequence

Trigger definitions should support keyword and event matching, required flags, blocked flags, phase constraints, and response directives:

```ts
type EmotionalTrigger = {
  id: string;
  match: {
    keywords?: string[];
    eventTypes?: string[];
    requiredFlags?: string[];
    blockedByFlags?: string[];
    phase?: string[];
  };
  effect: {
    setFlags?: string[];
    addBeat?: string;
    mood?: string;
    responseDirective?: string;
    memoryImportance?: "low" | "medium" | "high";
  };
};
```

Emotional events and phase gates can use typed shapes like:

```ts
type EmotionalEvent = {
  id: string;
  label: string;
  category:
    | "bonding"
    | "conflict"
    | "repair"
    | "escalation"
    | "revelation"
    | "jealousy"
    | "commitment"
    | "boundary";
  effects: {
    trust?: number;
    attraction?: number;
    tension?: number;
    safety?: number;
    conflict?: number;
    vulnerability?: number;
    commitment?: number;
    insecurity?: number;
  };
};

type RelationshipPhase = {
  id: string;
  label: string;
  emotionalQuestion: string;
  entrySignals: {
    events: string[];
    keywords: string[];
    softStats: Record<string, number>;
  };
  likelyEvents: string[];
  blockedUntil?: string[];
};
```

Phase progression should be scored softly:

```ts
function phaseAdvanceScore(context: PhaseContext): number {
  let score = 0;

  if (context.events.includes("almost_confession")) score += 35;
  if (context.events.includes("jealousy_moment")) score += 20;
  if (context.hasKeyword("more than friends")) score += 25;

  score += context.stats.trust * 0.15;
  score += context.stats.attraction * 0.2;
  score += context.stats.vulnerability * 0.15;

  return score;
}
```

The score should suggest phase movement, not silently force it. The runtime can use it to unlock a likely next beat, ask for confirmation in an editor, or shape the next prompt directive.

### Relationship Memory Anchors

Events are things that happen. Memories are events that still matter.

Relationship memory anchors should persist longer than ordinary emotional events and should influence future dialogue, phase gates, memory recall, and emotional reactions. Store only the emotional landmarks, not every small interaction.

The runtime must distinguish noise from narrative significance:

```text
filler interaction
-> emotional event
-> emotionally reinforced event
-> persistent relationship memory
-> relationship-defining history
```

Filler interactions add realism, pacing, and conversational texture. They can nudge mood or short-term chemistry, but they should not become durable relationship memories by default. Examples include ordering coffee, random jokes, generic greetings, weather talk, logistics, and idle banter.

Emotional events are temporary but meaningful. They affect mood, soft stats, current emotional state, and phase-readiness scoring. Examples include teasing, comfort, jealousy, argument, flirting, apology, reassurance, and emotional withdrawal. Many should fade unless repeated or reinforced.

Core relationship memories are persistent narrative anchors. They are identity-defining, relationship-defining, or phase-altering. They should influence future reactions, alter dialogue tone, become callback material, and affect future conflicts.

Useful memory tests:

- Would this still matter six months later?
- Could this be referenced during a future argument, confession, apology, or choice point?
- Did it permanently change how they see each other, how safe they feel, or what the relationship is?

Do not make durable memory creation purely keyword-based. Emotional intensity, vulnerability, relationship impact, repetition, and phase relevance should matter more than the presence of a single word.

Examples:

| Memory | Function |
| --- | --- |
| First kiss | romantic threshold |
| First "I love you" | commitment anchor |
| Remembered birthday | care and attention proof |
| Breakup | rupture memory |
| Promise | future obligation |
| Broken promise | trust wound |
| Traumatic confession | vulnerability anchor |
| First apology | repair evidence |
| First betrayal | insecurity trigger |
| First comfort scene | safety proof |
| First public choice | validation |
| First private secret | intimacy bond |
| Shared grief | deep attachment |
| Shared victory | partnership proof |
| Jealousy incident | attachment reveal |
| Near abandonment | insecurity wound |
| Reconciliation | repair strength |
| Moving in together | life integration |
| Meeting family | social integration |
| Future plan | commitment signal |

Relationship memories can be represented as:

```ts
type RelationshipMemory = {
  id: string;
  label: string;
  category:
    | "firsts"
    | "promises"
    | "ruptures"
    | "repairs"
    | "secrets"
    | "trauma"
    | "commitment"
    | "family"
    | "intimacy";
  emotionalWeight: number;
  valence: "positive" | "negative" | "mixed";
  participants: string[];
  createdAtPhase: string;
  keywords: string[];
  effects: {
    trust?: number;
    attraction?: number;
    safety?: number;
    conflict?: number;
    vulnerability?: number;
    commitment?: number;
    insecurity?: number;
  };
};
```

Memory importance can be coarse:

```ts
type MemoryImportance = "minor" | "major" | "defining";
```

Examples:

| Memory | Importance |
| --- | --- |
| remembered favorite drink | minor |
| remembered birthday | major |
| first kiss | defining |
| betrayal | defining |
| comfort after panic attack | defining |
| random joke | none |
| playful teasing | event only |

Useful categories:

| Category | Examples |
| --- | --- |
| Firsts | first kiss, first date, first intimacy |
| Trust | promises, secrets shared |
| Ruptures | betrayal, abandonment, breakup |
| Repairs | apology accepted, reconciliation |
| Care | comfort during grief, remembered details |
| Commitment | moving in, public choice |
| Vulnerability | traumatic confession |
| Desire | first jealousy, first mutual attraction |
| Loss | separation, death, disappearance |
| Transformation | "you changed me" moments |

Gate examples:

- `first_kiss` plus unresolved fear can shape an awkward recalibration beat.
- `broken_promise` plus apology can open a repair arc.
- `traumatic_confession` plus comfort can deepen trust.
- `birthday_remembered` plus affection can strengthen attachment.

### Continuity Mechanics

Continuity mechanics are the systems that make a relationship feel persistent, cumulative, coherent, and emotionally alive over time. They answer: how does yesterday still affect today?

Relationships feel real when interactions change future interactions. Without continuity, romance feels stateless, scenes become interchangeable, and emotional payoff collapses. With continuity, history becomes emotionally active.

The core hierarchy:

```text
events
-> memories
-> patterns
-> expectations
-> identity
-> trajectory
```

Useful continuity layers:

| Layer | Purpose | Example |
| --- | --- | --- |
| Persistent relationship memory | preserve emotional landmarks | first kiss, betrayal, promise, reconciliation |
| Emotional momentum | keep recent trajectory active | repeated comfort accelerates attachment |
| Callback systems | let the past return naturally | "You promised you would not disappear again." |
| Dynamic evolution tracking | change meaning of repeated behavior | teasing shifts from defense to affection |
| Emotional scars | preserve residue of harm | betrayal lowers vulnerability tolerance |
| Relationship habits | make patterns automatic | goodnight texts, pet names, care rituals |
| Relational state persistence | carry aftermath across scenes | tone remains affected after a painful fight |
| Pattern recognition | let characters learn each other | "You get quiet when you are hurt." |
| Escalation memory | remember existing intimacy level | post-confession characters should not reset to strangers |
| Relational identity | form a shared "who we are" | chaotic but loyal, emotionally safe, always returns |
| Future projection | imagine permanence | "We should go there together someday." |
| Repair continuity | make repair history matter | good repair increases conflict trust |
| Threshold evolution | lower or raise access over time | touch comfort increases, recovery speeds up |
| Contextual activation | trigger memories from cues | places, phrases, anniversaries, songs, touch patterns |
| Relationship trajectory | infer where the bond is heading | stabilizing, escalating, deteriorating, nearing confession |

Continuity should be behavioral. Characters should speak differently, react differently, trust differently, flirt differently, and repair differently because of history. Storing memories passively is not enough.

Continuity across relationship stages:

| Stage | Continuity Focus |
| --- | --- |
| Early | attraction, tension, curiosity, memorable moments |
| Mid | attachment, vulnerability, expectations, emotional patterns |
| Established | rituals, conflict patterns, domesticity, commitment, repair history, identity |

Example continuity chain:

```text
comfort during panic attack
-> memory formed
-> increased emotional safety
-> future vulnerability easier
-> attachment deepens
-> reassurance expectations rise
-> future abandonment hurts more
```

Continuity failure modes:

| Failure | Result |
| --- | --- |
| betrayal forgotten instantly | trust damage feels fake |
| confession changes nothing | phase payoff collapses |
| no behavioral evolution | relationship feels static |
| repeated identical conflicts | growth stalls |
| static chemistry forever | intimacy never matures |
| emotional reset next scene | aftermath becomes meaningless |

Useful continuity variables:

| Variable | Meaning |
| --- | --- |
| Memory weight | long-term emotional significance |
| Emotional momentum | recent emotional trajectory |
| Ritual density | amount of shared habits |
| Callback frequency | history reference tendency |
| Trust persistence | durability of safety |
| Scar persistence | lingering emotional wounds |
| Dynamic stability | consistency of interaction loops |
| Relationship identity strength | strength of shared relational narrative |
| Vulnerability evolution | changing openness over time |
| Escalation memory | remembered intimacy level |
| Future projection | automatic inclusion in imagined future |
| Repair continuity | how conflict history changes future vulnerability |
| Contextual activation | cue-based memory recall strength |

Continuity equation:

```text
history
+ emotional consequence
+ behavioral change
= relationship realism
```

#### Vulnerability Thresholds

Vulnerability thresholds are the emotional conditions, trust levels, safety requirements, attachment states, and psychological triggers that determine when and how deeply a person becomes open, dependent, honest, or visible. They are the gates controlling intimacy access.

Useful thresholds:

| Threshold | Governs |
| --- | --- |
| Emotional openness | visible feeling and expression |
| Attachment | deep bonding and prioritization |
| Confession | verbal revelation of love, jealousy, or need |
| Reassurance seeking | admitting insecurity or asking for comfort |
| Trauma disclosure | painful history access |
| Dependency | relying emotionally or asking someone to stay |
| Physical intimacy | touch comfort and adult-gated vulnerability |
| Shame exposure | revealing feared unlovable parts |
| Conflict vulnerability | staying honest during rupture |
| Authenticity | dropping masks and performance |

Thresholds are dynamic. Safe repair, consistent reassurance, and rituals can lower thresholds; betrayal, humiliation, invalidation, or abandonment can sharply raise them. High attraction plus high vulnerability threshold creates slow burn tension.

Failure modes:

| Failure | Result |
| --- | --- |
| Instant deep vulnerability | intimacy feels unearned |
| Permanent armor | closeness stagnates |
| Inconsistent threshold logic | behavior ignores wounds and history |

#### Emotional Memory Sensitivity

Emotional memory sensitivity is the degree to which past emotional experiences continue influencing present reactions, attachment behavior, interpretation, trust, intimacy, regulation, and expectations. People react not only to what is happening now, but to what the moment emotionally reminds them of.

Useful memory sensitivities:

| Sensitivity | Trigger Pattern |
| --- | --- |
| Abandonment memory | absence, silence, withdrawal |
| Betrayal memory | secrecy, inconsistency, ambiguity |
| Rejection memory | confession, exposure, honesty |
| Humiliation memory | visibility, public attention, vulnerability |
| Invalidation memory | minimization, disagreement, low empathy |
| Neglect memory | inattentiveness, forgotten details |
| Broken promise memory | vague commitments, changed plans |
| Dependency memory | needing closeness or support |
| Conflict memory | raised voices, tension, disagreement |
| Safety memory | familiar reassurance, rituals, repeated care |

High memory sensitivity creates strong continuity and depth, but risks hypervigilance and emotional flooding. Low memory sensitivity helps resilience, but can feel detached or emotionally stateless.

Emotional memory equation:

```text
present cue
+ stored emotional meaning
+ attachment state
= current emotional reaction
```

#### Idealization Vs Reality Tolerance

Idealization versus reality tolerance governs whether intimacy can survive the shift from fantasy, projection, intensity, or idealization into ordinary reality, imperfection, routine, and human limitation.

Useful components:

| Component | Meaning |
| --- | --- |
| Idealization intensity | tendency toward amplified projection |
| Reality tolerance | ability to sustain intimacy after flaws appear |
| Fantasy dependence | reliance on projection for attraction |
| Imperfection tolerance | ability to accept limits and messiness |
| Routine tolerance | ability to keep meaning inside familiarity |
| Projection intensity | imagined meaning placed onto partner |
| Emotional complexity tolerance | ability to hold contradiction |
| Stability tolerance | comfort with calm attachment |
| Humanization comfort | acceptance of ordinary humanity |
| Expectation flexibility | ability to revise romantic narratives |
| Mature attachment capacity | ability to love beyond fantasy |

Idealization can intensify chemistry, but fantasy-only chemistry struggles with survivability. Healthy development moves from idealization to humanization to acceptance to mature intimacy.

Failure modes include fantasy dependence, devaluation cycles, intensity addiction, and inability to tolerate ordinary humanity.

#### Relationship Values

Relationship values are the core emotional principles, priorities, beliefs, and relational philosophies that determine what a person believes relationships should be built around. Values govern what emotionally matters most.

Useful values:

| Value | Core Belief |
| --- | --- |
| Loyalty | relationships should protect and prioritize each other |
| Emotional honesty | relationships should be truthful |
| Emotional safety | love should feel survivable |
| Autonomy | love should preserve individuality |
| Devotion | love should feel central and prioritizing |
| Growth | relationships should help people evolve |
| Stability | love should feel reliable |
| Passion | love should feel alive and intense |
| Freedom | love should not trap or control |
| Exclusivity | love should feel unique |
| Caretaking | love should involve active support |
| Equality | both people should matter equally |
| Acceptance | love should tolerate imperfection |
| Excitement | love should stimulate and surprise |
| Commitment | love should involve long-term choosing |

Many major conflicts are value collisions underneath surface issues: autonomy versus devotion, stability versus excitement, freedom versus exclusivity, honesty versus avoidance. Shared core values increase survivability even when personalities differ.

### Rituals And Habits

Rituals and habits are repeated behaviors, routines, gestures, patterns, and symbolic interactions that create emotional continuity, attachment reinforcement, intimacy texture, and relationship identity over time. They answer: what do these people repeatedly do that makes the relationship feel emotionally real and ongoing?

Grand scenes create milestones. Rituals create lived relationships.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Habit | repeated behavior pattern |
| Ritual | repeated behavior with emotional meaning |
| Tradition | larger recurring ritual |
| Routine | practical repeated structure |
| Symbolic gesture | emotionally meaningful action |

Relationships feel believable through repetition with emotional meaning: goodnight texts, coffee together, forehead kisses, teasing nicknames, always walking together, one fixing the other's clothes, recurring sleeping positions, checking in after stress, knees touching under a table, checking whether someone ate, or the same phrase after a fight. These small repeated behaviors create emotional continuity.

Useful ritual types:

| Ritual Type | Core Emotional Meaning | Examples |
| --- | --- | --- |
| Greeting | we recognize each other's presence | specific greetings, arrival hugs, teasing greetings |
| Goodbye | connection persists after separation | goodnight texts, "text me when you get home", leaving phrases |
| Comfort | we know how to soothe each other | tea, touch, quiet presence, reassurance phrases |
| Conflict repair | we survive rupture and reconnect | apology patterns, post-fight touch, repair humor |
| Domestic | we share daily life | coffee together, cooking, errands, bedtime routines |
| Teasing | our interaction itself is affectionate | teasing nicknames, recurring jokes, mock arguments, challenge games |
| Reassurance | the bond remains secure | check-ins after stress, verbal affection routines, post-conflict reassurance |
| Protective | your wellbeing is consistently prioritized | street-side walking, food checks, carrying things |
| Physical affection | bodies recognize closeness automatically | forehead kisses, habitual touch, hand placement, leaning together, sleeping positions |
| Symbolic | the relationship has meaningful anchors | anniversaries, objects, songs, repeated phrases |
| Public | we visibly choose each other | introductions, public affection, social prioritization |
| Private | this world belongs to us | hidden gestures, private nicknames, inside jokes |

Attachment style changes ritual importance:

| Attachment | Ritual Function |
| --- | --- |
| Secure | grounding and continuity |
| Anxious | reassurance and emotional permanence |
| Avoidant | subtle, low-pressure intimacy |
| Fearful | intense but sometimes unstable ritual attachment |

Rituals increase emotional safety because they create predictable care. Always calling after conflict, always checking in, or always returning emotionally teaches the nervous system that the relationship remains stable.

Rituals also reinforce relationship identity. "We always watch storms together", "we tease instead of directly flirting", or "we always reconnect after conflict" becomes recognizable relationship culture.

Rituals should evolve with intimacy:

```text
flirty texting ritual
-> emotional check-in ritual
-> domestic care ritual
-> long-term partnership ritual
```

Ritual disruption matters. A missed goodnight text, forgotten anniversary, absent repair ritual, or withheld comfort pattern can signal possible instability because repeated meaning suddenly disappears.

Obsessive relationships may intensify rituals into constant contact or validation loops. This can feel intimate when regulated, or destabilizing when ritual dependence becomes the only way to feel safe.

Failure modes:

| Failure | Result |
| --- | --- |
| No ritual accumulation | relationship feels stateless and scene-based |
| Frozen rituals | no evolution, stagnation, repetitive affection |
| Weaponized rituals | withholding routines as punishment destroys safety |
| Ritual overdependence | disruption causes disproportionate panic |

Useful ritual variables:

| Variable | Meaning |
| --- | --- |
| Ritual density | amount of repeated intimacy patterns |
| Ritual importance | emotional significance of routines |
| Reassurance ritual dependence | reliance on repeated security signals |
| Domestic integration | routine life overlap |
| Symbolic attachment | importance of gestures, objects, songs, and dates |
| Ritual stability | consistency of rituals over time |
| Emotional continuity | feeling the relationship persists reliably |
| Ritual sensitivity | reaction to ritual disruption |
| Shared culture strength | uniqueness of relational habits |
| Ritual evolution | ability for rituals to mature with the bond |
| Ritual disruption risk | chance missed rituals imply instability |
| Weaponized ritual risk | chance rituals become control or punishment |
| Habit specificity | how personalized and recognizable rituals are |

Ritual equation:

```text
repetition
+ emotional meaning
+ specificity
+ continuity
= relationship texture
```

### Compatibility Axes

Compatibility axes are the major dimensions along which two people naturally align, struggle, complement, destabilize each other, or require adaptation to sustain intimacy and long-term relational health.

Compatibility should never be a single percentage score. A relationship can have incredible chemistry and terrible stability, strong emotional compatibility but weak sexual compatibility, or high daily-life compatibility with low excitement.

Compatibility is not attraction, chemistry, love, or obsession. It answers: how naturally sustainable and emotionally functional are we together across different dimensions?

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Chemistry | emotional or sexual charge |
| Compatibility | long-term relational fit |
| Attachment | emotional bonding |
| Attraction | desire or interest |
| Relationship identity | shared emotional "we" |

Core compatibility axes:

| Axis | Core Question | Common Strain |
| --- | --- | --- |
| Emotional | how well do our emotional systems work together? | starvation, overwhelm, poor reassurance fit |
| Communication | can we understand each other consistently? | directness/subtext mismatch |
| Conflict | how survivable are disagreements? | pursuer/withdrawer loops, poor repair |
| Attachment | how safely do our attachment systems interact? | anxious/avoidant spirals, fearful instability |
| Intimacy | how naturally do closeness preferences align? | fusion vs space, touch mismatch |
| Sexual | how well do erotic systems align? | pacing, desire style, kink, exclusivity expectations |
| Exclusivity | what does uniqueness mean to each of us? | jealousy, ENM/monogamy mismatch |
| Autonomy | how much independence vs closeness feels healthy? | engulfment or abandonment interpretations |
| Stability | how much intensity and unpredictability can we sustain? | chaos tolerance mismatch |
| Lifestyle | can our actual lives function together? | schedules, routines, ambition, family goals |
| Values | what does love and life fundamentally mean? | loyalty, freedom, devotion, morality |
| Growth | do we evolve well together? | challenge, adaptability, healing support |
| Ritual | do habits and emotional rhythms fit? | communication frequency, domestic rhythm mismatch |
| Devotion | how similarly do we prioritize emotional centrality? | casual vs intense imbalance |
| Novelty | how much stimulation and change do we need? | novelty seeker vs routine-oriented tension |

#### Emotional Compatibility

Emotional compatibility is the degree to which two people's emotional systems naturally understand, regulate, support, tolerate, and adapt to each other sustainably. It asks: how naturally do our emotional worlds function together?

Emotional compatibility is not identical personalities, zero conflict, constant agreement, or identical expression. Strong emotional compatibility means the emotional systems can coexist without chronically damaging each other.

It includes regulation fit, vulnerability pacing, reassurance compatibility, empathy style, conflict survivability, emotional responsiveness, attachment interaction, and emotional needs alignment.

Useful emotional compatibility components:

| Component | Core Question | Low-Fit Risk |
| --- | --- | --- |
| Emotional regulation fit | how well do our nervous systems handle stress together? | escalation loops and chronic overwhelm |
| Vulnerability compatibility | how naturally do we handle openness? | one pushes honesty while the other needs slow trust |
| Reassurance compatibility | can we stabilize each other effectively? | one needs confirmation, the other feels pressured |
| Expression compatibility | are emotional signals understandable? | chronic misinterpretation |
| Attachment compatibility | how safely do attachment systems interact? | anxiety/avoidance spirals |
| Emotional need compatibility | what do we need from relationships? | emotional starvation |
| Conflict compatibility | how survivable is emotional tension? | rupture without repair |
| Emotional safety fit | how safe does vulnerability feel? | guardedness or shutdown |
| Intensity compatibility | how much activation feels healthy? | excitement/calm mismatch |
| Empathy synchronization | how naturally do we understand each other? | low felt recognition |

High emotional compatibility feels like emotional ease, translation fluency, survivable conflict, easier vulnerability, mutual regulation, and the sense that "you emotionally make sense to me."

Low emotional compatibility feels like chronic misunderstanding, unmet needs, regulation clashes, emotional exhaustion, and the sense that "we keep emotionally missing each other."

Emotional compatibility and chemistry should stay separate:

| Combination | Result |
| --- | --- |
| high chemistry + low emotional compatibility | obsession, volatility, emotional addiction |
| high emotional compatibility + low chemistry | comfort, safety, possible stagnation |
| high chemistry + high emotional compatibility | mature romance with desire, understanding, and safety |

Emotional compatibility can evolve:

```text
misunderstanding
-> learning
-> adaptation
-> emotional fluency
-> co-regulation
-> secure intimacy
```

#### Communication Compatibility

Communication compatibility is the degree to which two people can express, interpret, emotionally understand, respond to, and repair with each other in ways that preserve connection, clarity, and emotional safety. It asks: how easily can we emotionally understand each other without chronic misunderstanding or exhaustion?

Communication compatibility is not speaking identically, having no misunderstandings, or always agreeing. It means communication styles can coexist without repeatedly damaging emotional connection.

Useful communication compatibility components:

| Component | Core Question | Low-Fit Risk |
| --- | --- | --- |
| Directness compatibility | how similarly do we express emotional meaning? | hints versus "tell me directly" loops |
| Emotional transparency fit | how visible do we expect emotions to be? | starvation or overwhelm |
| Reassurance compatibility | how do we give and receive security? | reassurance pressure or invisibility |
| Conflict communication fit | are tension conversations survivable? | pursuit/withdrawal escalation |
| Subtext compatibility | do we read indirect meaning similarly? | silence, teasing, or leakage misread |
| Vulnerability pace compatibility | how do we handle openness timing? | rushed exposure or emotional withholding |
| Processing speed compatibility | how quickly do we process and respond? | immediate repair need versus decompression need |
| Affection translation accuracy | do we recognize each other's care? | affection mismatch realism |
| Emotional vocabulary compatibility | can we name feelings at compatible depth? | frustration and emotional invisibility |
| Emotional listening quality | do we feel heard by each other? | low validation and safety |

High communication compatibility feels like emotional understanding, easier repair, low chronic misinterpretation, conversational safety, and emotional translation fluency.

Low communication compatibility feels like repeated misunderstanding, emotional translation failure, unresolved conflict, emotional loneliness, and the sense that "no matter what I say, we keep missing each other."

Communication compatibility often becomes relationship identity. Couples develop cultures like: "we tease instead of saying feelings directly", "we always talk eventually", "we communicate through touch", or "we understand each other without words."

Communication compatibility can evolve:

```text
misunderstanding
-> emotional learning
-> adaptation
-> communication fluency
-> instinctive understanding
```

#### Conflict Compatibility

Conflict compatibility is the degree to which two people's conflict styles, emotional regulation systems, repair methods, attachment reactions, and communication patterns can survive tension without chronically damaging the relationship. It asks: when things become emotionally difficult between us, can we still remain emotionally connected and safe?

Conflict compatibility is not never fighting, agreeing constantly, or having low intensity. It means the relationship can survive disagreement without repeatedly destroying attachment safety.

Conflict compatibility governs what happens during rupture.

Useful conflict compatibility components:

| Component | Core Question | Low-Fit Risk |
| --- | --- | --- |
| Regulation compatibility under stress | how well do nervous systems function together during conflict? | escalation loops, shutdown, overwhelm |
| Repair compatibility | how naturally can we reconnect after rupture? | apologies miss, reassurance fails, repair never lands |
| Pursuit/withdrawal fit | how do we handle distance after conflict? | one pursues, the other retreats |
| Accountability capacity | can we take responsibility without collapse? | defensiveness, blame, repair failure |
| Emotional safety during conflict | does conflict remain survivable? | humiliation, contempt, abandonment threats |
| Escalation tolerance match | how much intensity can we tolerate? | flooding, invalidation, shutdown |
| Resolution timing compatibility | when do we need resolution? | immediate reassurance vs decompression time |
| Vulnerability preservation | can we remain honest while distressed? | anger masks hurt, vulnerability weaponized |
| Conflict meaning compatibility | what does conflict represent emotionally? | repair opportunity vs relationship collapse |
| Boundary respect under stress | do we respect limits while activated? | coercion, pressure, autonomy violation |

High conflict compatibility feels like survivable disagreement, faster repair, emotional resilience, conflict trust, and lower chronic fear. Low conflict compatibility feels like exhaustion, repeated misunderstanding, instability, unresolved resentment, and hypervigilance.

Attachment pairings shape conflict compatibility:

| Pairing | Common Pattern |
| --- | --- |
| Secure + secure | repair-oriented |
| Anxious + avoidant | pursuit/withdrawal loops |
| Fearful + fearful | chaotic escalation |
| Secure + fearful | stabilization and healing potential |

High chemistry often masks low conflict compatibility. This creates intense reunions, obsession, volatility, and repeated rupture, especially in enemies-to-lovers or toxic chemistry dynamics.

Conflict compatibility often becomes relationship identity. Couples develop narratives such as "we always repair eventually", "we fight intensely but reconnect deeply", "we avoid hard conversations", or "we survive conflict together."

Conflict compatibility can evolve through adaptation:

```text
rupture
-> misunderstanding
-> repair attempts
-> emotional learning
-> safer conflict
-> deeper trust
```

Failure modes:

| Failure | Result |
| --- | --- |
| Chronic escalation loops | pursuit -> overwhelm -> withdrawal -> panic -> escalation |
| Emotional invalidation | one partner feels unheard, minimized, or unsafe |
| Repair collapse | arguments happen but reconnection never lands |
| Suppressed conflict | peace on the surface, resentment underneath |

#### Sexual Compatibility

Sexual compatibility is the degree to which two people's erotic, sensual, emotional, physical, psychological, and intimacy-related sexual systems function together in a mutually satisfying, sustainable, emotionally safe, and emotionally meaningful way. It asks: how naturally do desire systems, boundaries, intimacy needs, pacing, and erotic psychology work together?

Sexual compatibility is not high attraction, identical libido, identical kink interests, immediate perfect chemistry, or constant intensity. Strong compatibility means erotic and emotional intimacy systems can coexist and adapt sustainably.

Sexual chemistry is immediate erotic tension or attraction. Sexual compatibility is long-term erotic and intimacy fit. Libido is desired frequency or intensity. Intimacy compatibility is closeness fit. Kink/dynamic compatibility is psychological fantasy and power-dynamic alignment. These should be tracked separately.

Useful sexual compatibility components:

| Component | Core Question | Low-Fit Risk |
| --- | --- | --- |
| Desire style fit | how does desire activate for each person? | one needs closeness first, the other reads delay as rejection |
| Libido compatibility | how aligned are frequency and intensity needs? | frustration, reassurance strain, rejection sensitivity |
| Emotional intimacy integration | how emotionally connected should intimacy feel? | one feels casualized, the other feels overburdened |
| Sexual vulnerability safety | how safe does physical and emotional openness feel? | shame, body insecurity, guardedness |
| Touch compatibility | how naturally do physical affection preferences align? | sensory mismatch, distance, overwhelm |
| Sexual pace compatibility | how quickly should intimacy develop? | pressure, avoidance, insecurity |
| Dynamic compatibility | how compatible are erotic psychological dynamics? | discomfort, mismatch, consent friction |
| Sexual communication openness | can desire, boundaries, insecurity, and needs be discussed? | unspoken needs, resentment, unsafe guessing |
| Sexual exclusivity compatibility | what does sexual uniqueness mean emotionally? | jealousy, ambiguity, broken expectations |
| Intimacy regulation compatibility | how stable do both feel during and after intimacy? | post-intimacy withdrawal, attachment spikes |
| Exploration compatibility | how similarly do both approach novelty? | stagnation or pressure |
| Sensual compatibility | how naturally do sensory and physical rhythms align? | embodied mismatch, low satisfaction |

High sexual compatibility feels like emotionally safe desire, natural chemistry flow, easy communication, satisfying pacing, mutual responsiveness, and sustained attraction. Low sexual compatibility feels like pressure, emotional misunderstanding, rejection sensitivity, pacing mismatch, unmet needs, or discomfort discussing intimacy.

Attachment patterns shape sexual compatibility:

| Attachment Style | Common Sexual Pattern |
| --- | --- |
| Secure | balanced intimacy and desire |
| Anxious | reassurance-linked intimacy |
| Avoidant | distance after vulnerability |
| Fearful | intense but unstable intimacy |

Sexual compatibility depends heavily on emotional safety. Without safety, vulnerability collapses, communication weakens, and insecurity rises. With safety, exploration, trust, and responsiveness become easier.

Sexual chemistry and sexual compatibility can diverge:

| Pattern | Result |
| --- | --- |
| High chemistry / low compatibility | obsession, tension, instability, frustration |
| High compatibility / lower initial chemistry | deep sustainable erotic intimacy can grow over time |

Relationship phase matters. Early sexual compatibility is often driven by novelty, attraction, anticipation, and uncertainty. Long-term sexual compatibility increasingly depends on communication, adaptation, emotional safety, evolving intimacy, and responsiveness.

Power-dynamic and kink-adjacent compatibility must remain adult-gated and governed by consent, emotional responsiveness, autonomy preservation, trust, pacing alignment, boundaries, and aftercare expectations. The runtime should treat these as safety-sensitive relationship structure, not as generic chemistry.

Failure modes:

| Failure | Result |
| --- | --- |
| Pressure mismatch | one partner feels rushed, obligated, or unsafe |
| Communication collapse | needs and boundaries remain unspoken |
| Emotional disconnect | intimacy lacks emotional recognition or responsiveness |
| Static erotic dynamics | no adaptation, novelty, or emotional evolution |

Sexual compatibility can evolve:

```text
attraction
-> tension
-> vulnerability
-> trust
-> emotional safety
-> responsive intimacy
-> mature erotic connection
```

Core sexual compatibility equation:

```text
desire
+ emotional safety
+ responsiveness
+ vulnerability
+ communication
= sustainable sexual compatibility
```

#### Pacing Compatibility

Pacing compatibility is the degree to which two people's preferred speeds of emotional, romantic, sexual, relational, and commitment progression can coexist without chronically triggering insecurity, pressure, frustration, or instability. It asks: how quickly does each person want the relationship to emotionally evolve?

Pacing compatibility is not identical timing, moving at the same speed constantly, or a simple fast-versus-slow flag. Strong pacing compatibility means both emotional systems can adapt to each other's progression rhythm without repeated harm.

Pacing compatibility is distinct from attachment compatibility, intimacy compatibility, commitment compatibility, and emotional regulation. It specifically governs how quickly escalation feels safe and satisfying.

Useful pacing compatibility components:

| Component | Core Question | Low-Fit Risk |
| --- | --- | --- |
| Emotional pacing compatibility | how quickly do both people open emotionally? | one floods, the other retreats |
| Attachment speed compatibility | how quickly does attachment form? | imbalance, pressure, insecurity |
| Commitment pace comfort | how quickly does permanence feel safe? | label panic, reassurance conflict |
| Sexual pacing compatibility | how quickly does physical intimacy feel safe? | pressure, rejection sensitivity, avoidance |
| Vulnerability threshold fit | how quickly can deeper self-exposure happen? | forced disclosure or emotional starvation |
| Conflict processing speed fit | how quickly should tension be repaired? | immediate reassurance vs decompression time |
| Domestic pacing compatibility | how quickly do lives and routines integrate? | engulfment fear or stagnation |
| Exclusivity pacing compatibility | when does uniqueness become expected? | jealousy, ambiguity, attachment instability |
| Intensity pacing compatibility | how quickly can emotional intensity rise? | overwhelm, engulfment, emotional flatness |
| Relationship identity pacing fit | how quickly does "we" thinking form? | future pressure or emotional underinvestment |

High pacing compatibility feels like natural progression, low chronic pressure, manageable escalation, and secure attachment development. Low pacing compatibility feels like overwhelm, stagnation, insecurity, pressure, chronic waiting, or moving at incompatible emotional speeds.

Common pacing mismatches:

| Mismatch | Result |
| --- | --- |
| Fast attachment + slow attachment | pursuit, hesitation, anxious/avoidant tension |
| Fast commitment + autonomy-focused | panic, distancing, reassurance conflict |
| Fast vulnerability + emotional restraint | imbalance, exhaustion, misunderstanding |
| Fast intensity + stability-oriented | engulfment fear, emotional starvation, instability |

Attachment styles often shape pacing:

| Attachment Style | Typical Pace |
| --- | --- |
| Secure | adaptable and steady |
| Anxious | accelerated attachment |
| Avoidant | slowed intimacy progression |
| Fearful | inconsistent acceleration and withdrawal |

Pacing is a safety signal. People emotionally open at the speed their nervous system believes intimacy is survivable. Unsafe pacing feels coercive, overwhelming, or destabilizing. Safe pacing feels emotionally breathable.

High chemistry often destabilizes pacing by accelerating attraction, attachment, intimacy, and intensity. This can feel intoxicating or unsafe depending on regulation, boundaries, trust, and compatibility.

Slow burn romance often revolves around pacing tension: emotional restraint, delayed vulnerability, attachment denial, cautious progression, and earned escalation. The payoff works because emotional movement feels earned.

Failure modes:

| Failure | Result |
| --- | --- |
| Emotional acceleration overload | panic, engulfment, withdrawal |
| Chronic stagnation | frustration, emotional drift, unresolved longing |
| Pressure pacing | one partner feels rushed, forced, or coerced |
| Avoidance pacing | progression is delayed indefinitely by fear |

Pacing compatibility can evolve:

```text
initial mismatch
-> emotional learning
-> pacing adaptation
-> increased safety
-> synchronized progression rhythm
```

Healthy pacing compatibility does not require identical speeds. It requires learning how to pace each other without abandoning safety, intimacy, autonomy, or progression.

#### Domestic Compatibility

Domestic compatibility is the degree to which two people can sustainably coexist, integrate routines, share space, manage responsibilities, regulate daily life, and maintain emotional connection inside ordinary long-term living reality. It asks: how naturally can our lives function together on a daily basis?

Domestic compatibility is not chemistry, devotion, commitment, or living together quickly. Chemistry creates romance, but domestic compatibility determines whether intimacy survives everyday life.

Useful domestic compatibility components:

| Component | Core Question | Low-Fit Risk |
| --- | --- | --- |
| Routine compatibility | do daily rhythms fit? | friction, missed connection, resentment |
| Shared space compatibility | can both people feel at home in the same environment? | territorial tension, overstimulation |
| Responsibility sharing fit | are practical burdens handled fairly? | caretaking imbalance, exhaustion |
| Daily regulation fit | do everyday habits calm or destabilize each other? | chronic irritation, shutdown, avoidance |
| Domestic affection fit | does care remain visible in ordinary routines? | loneliness despite proximity |
| Chore expectation alignment | are standards and labor expectations compatible? | invisible labor, scorekeeping |
| Cleanliness preference fit | do environment needs align? | frustration, criticism, discomfort |
| Sleep schedule compatibility | do rest rhythms coexist? | fatigue, distance, routine conflict |
| Food and care rhythm fit | do eating, caretaking, and comfort habits align? | unmet care needs, neglect signals |
| Home privacy compatibility | can closeness and alone time coexist? | engulfment, emotional distance |
| Ordinary life connection | does daily life maintain emotional presence? | roommate drift, domestic flattening |

High domestic compatibility feels like routines becoming comforting, responsibilities feeling fair, shared space feeling emotionally livable, and ordinary care reinforcing attachment. Low domestic compatibility feels like practical friction, invisible resentment, emotional drift, overstimulation, or loneliness inside daily proximity.

Domestic compatibility often reveals whether affection can survive repetition. Grand scenes can create milestones, but domestic rhythms create the lived relationship.

Common domestic mismatch patterns:

| Mismatch | Result |
| --- | --- |
| Routine-oriented + spontaneous | one feels destabilized, the other feels constrained |
| High cleanliness need + relaxed environment need | criticism, shame, resentment |
| Constant togetherness + strong privacy need | engulfment fear or abandonment fear |
| Caretaking-heavy + self-sufficient | support may feel intrusive or unrecognized |
| High domestic ritual need + low ritual awareness | one feels unremembered, the other feels pressured |

Domestic compatibility is strongly tied to rituals and habits: coffee together, shared errands, bedtime routines, checking in after stress, cooking patterns, clothing fixes, sleeping positions, and small automatic gestures. These ordinary repetitions become emotional continuity.

Failure modes:

| Failure | Result |
| --- | --- |
| Roommate drift | shared life continues but emotional connection thins |
| Invisible labor imbalance | one partner carries practical or emotional maintenance |
| Domestic control | routines become coercive instead of comforting |
| Routine stagnation | stability becomes emotional flattening |
| Privacy collapse | shared life erases autonomy and recovery space |

Domestic compatibility can evolve:

```text
shared time
-> routine discovery
-> responsibility negotiation
-> ritual formation
-> ordinary life trust
-> home-like intimacy
```

The strongest domestic romance often comes from ordinary life still feeling emotionally chosen.

#### Ambition Compatibility

Ambition compatibility is the degree to which two people's goals, drive, priorities, work identities, life trajectories, achievement needs, and visions for the future can coexist without chronically destabilizing intimacy, attachment, or mutual fulfillment. It asks: can our visions for who we want to become coexist without destroying the relationship?

Ambition compatibility is not identical careers, equal success, matching income, or equal productivity. Strong ambition compatibility means life momentum, priorities, and growth trajectories can emotionally coexist sustainably.

Ambition compatibility is distinct from lifestyle compatibility, value compatibility, domestic compatibility, and commitment compatibility. It specifically concerns future direction and life energy alignment.

Useful ambition compatibility components:

| Component | Core Question | Low-Fit Risk |
| --- | --- | --- |
| Goal alignment | are desired futures emotionally compatible? | trajectory incompatibility |
| Work-life priority compatibility | how much priority should ambition receive? | neglect, suffocation, resentment |
| Achievement drive compatibility | how intense are achievement needs? | burnout, boredom, judgment |
| Time availability fit | how much time and energy remain for intimacy? | attachment insecurity, emotional scarcity |
| Success identity compatibility | how do achievement differences feel? | competition, insecurity, comparison |
| Growth compatibility | do both support each other's evolution? | stagnation, threat responses |
| Lifestyle pace compatibility | how fast should life itself move? | burnout, drift, instability |
| Emotional availability under ambition | can emotional presence survive goal pursuit? | neglect, unreliable reassurance |
| Sacrifice compatibility | what compromises feel acceptable? | self-erasure, resentment |
| Security/aspiration compatibility | do both prioritize stability or risk similarly? | future conflict, chronic anxiety |
| Future inclusion strength | does ambition include the relationship? | feeling left behind |

High ambition compatibility feels like mutual support, admiration, aligned future energy, growth partnership, and emotional understanding around goals. Low ambition compatibility feels like neglect, competition, sacrifice imbalance, resentment, or lives pulling in different directions.

Common ambition pairings:

| Pairing | Romance Texture | Risk |
| --- | --- | --- |
| High ambition + high ambition | admiration, stimulation, competence attraction | emotional neglect, competition |
| High ambition + stability-oriented | grounding balance | prioritization conflict |
| Ambition-driven + devotion-driven | emotional asymmetry tension | one feels neglected, one feels constrained |
| Shared growth pairing | mutual evolution partnership | identity change can outpace repair |

Attachment styles often shape ambition compatibility:

| Attachment Style | Common Ambition Pattern |
| --- | --- |
| Secure | balanced integration |
| Anxious | fears ambition will replace the relationship |
| Avoidant | uses work or goals for emotional distance |
| Fearful | inconsistent prioritization |

Ambition compatibility often becomes relationship identity: "we push each other", "we build together", "you keep me grounded", "we choose each other despite ambition", or "we are both obsessed with our goals."

Ambition also powers admiration. Ambition plus admiration plus mutual respect can create high emotional and romantic tension, especially in rivals-to-lovers, workplace romance, and competence attraction dynamics.

Failure modes:

| Failure | Result |
| --- | --- |
| Competition collapse | partners become rivals instead of supporters |
| Emotional neglect | ambition replaces intimacy, presence, or reassurance |
| Future divergence | love remains, but trajectories become incompatible |
| Self-erasure | one partner repeatedly sacrifices goals or identity |

Ambition compatibility can evolve:

```text
individual goals
-> mutual support
-> integrated futures
-> shared ambition identity
```

Strong ambition compatibility means both people feel emotionally included inside each other's future rather than left behind by it.

#### Social Compatibility

Social compatibility is the degree to which two people's social needs, public identities, interpersonal styles, social energy, lifestyle integration, and relationship visibility preferences can coexist sustainably and comfortably. It asks: how naturally do social worlds and interpersonal styles fit together?

Social compatibility is not identical personalities, liking the same activities, or equal extroversion. Strong social compatibility means social rhythms and public relational needs can coexist without chronic emotional friction.

Social compatibility is distinct from lifestyle compatibility, emotional compatibility, public visibility, and value compatibility. It specifically governs how the relationship functions socially and publicly.

Useful social compatibility components:

| Component | Core Question | Low-Fit Risk |
| --- | --- | --- |
| Social energy match | how similarly do both experience social stimulation? | exhaustion, pressure, isolation |
| Public affection compatibility | how publicly expressive should the relationship be? | embarrassment, invisibility, pressure |
| Relationship visibility preference fit | how socially visible should the bond become? | insecurity, invalidation, secrecy strain |
| Friendship integration fit | how naturally do social circles integrate? | divided worlds, possessiveness |
| Attention distribution comfort | how comfortable is social attention and prioritization? | jealousy, public hurt, comparison |
| Lifestyle social rhythm | how similarly do both socially live? | nightlife/domestic mismatch, drift |
| Family compatibility | how do family dynamics affect the relationship? | obligation conflict, privacy stress |
| Social boundary compatibility | what public behavior feels acceptable? | flirting conflict, trust damage |
| Reputation sensitivity fit | how much does social image matter? | shame, performance pressure |
| Social supportiveness | how well do both back each other socially? | public loneliness, anxiety |
| Public identity comfort | can both inhabit the relationship identity publicly? | dissonance, concealment, discomfort |

High social compatibility feels like easy coexistence, comfortable public identity, manageable energy balance, natural social integration, and public/private rhythms that both can tolerate. Low social compatibility feels like social exhaustion, public insecurity, emotional invisibility, lifestyle mismatch, or resentment.

Common social pairings:

| Pairing | Romance Texture | Risk |
| --- | --- | --- |
| Introvert + extrovert | balance and mutual expansion | exhaustion or loneliness |
| Public + private romance | visibility tension | reassurance mismatch |
| Social butterfly + devotional partner | broad connection meets centralizing attachment | jealousy, prioritization conflict |
| Shared social identity | workplace, artistic, or power-couple cohesion | public pressure, role rigidity |

Attachment styles often shape social compatibility:

| Attachment Style | Social Pattern |
| --- | --- |
| Secure | adaptable social engagement |
| Anxious | sensitivity to public prioritization |
| Avoidant | social independence emphasis |
| Fearful | inconsistent social openness |

Social behavior often activates exclusivity systems: public flirting, emotional intimacy with friends, attention distribution, and public prioritization can all affect jealousy, reassurance, and emotional safety.

Social compatibility also shapes relationship identity. Couples may become the chaotic duo, quiet domestic pair, competitive power couple, secretly soft pair, hidden workplace romance, or publicly devoted partnership.

Failure modes:

| Failure | Result |
| --- | --- |
| Social exhaustion | one partner feels overwhelmed, overstimulated, or drained |
| Public invalidation | hiding, distancing, or refusing acknowledgment damages security |
| Social jealousy escalation | public attention patterns trigger hypervigilance or possessiveness |
| Lifestyle divergence | social habits become incompatible long-term |
| Social isolation | the relationship cuts off support systems instead of integrating safely |

Social compatibility can evolve:

```text
separate social worlds
-> negotiated integration
-> shared social identity
-> balanced public/private intimacy
```

Strong social compatibility means both people can remain authentically themselves while existing together inside the larger world.

#### Lifestyle Compatibility

Lifestyle compatibility is the degree to which two people's daily rhythms, habits, environments, priorities, routines, energy allocation, and practical ways of living can coexist sustainably and comfortably over time. It asks: can actual ways of living fit together without slowly creating exhaustion or resentment?

Lifestyle compatibility is not identical hobbies, identical tastes, or perfect routine alignment. Strong lifestyle compatibility means daily lives can integrate without constantly destabilizing emotional connection, energy, or wellbeing.

Lifestyle compatibility is distinct from domestic compatibility, emotional compatibility, value compatibility, and ambition compatibility. It specifically governs everyday sustainability.

Useful lifestyle compatibility components:

| Component | Core Question | Low-Fit Risk |
| --- | --- | --- |
| Routine rhythm fit | how naturally do daily rhythms align? | scheduling tension, missed connection |
| Energy compatibility | how similarly do both manage stimulation and rest? | fatigue, overwhelm, low intimacy consistency |
| Organization compatibility | how compatible are environment habits? | low-level resentment, criticism |
| Social lifestyle fit | how similarly do both want to socially live? | isolation, overextension, drift |
| Work-life compatibility | how do work and rest systems affect the relationship? | neglect, instability, resentment |
| Domestic responsibility balance | how naturally are responsibilities shared? | burnout, scorekeeping |
| Financial lifestyle compatibility | how similarly do both approach resources? | anxiety, conflict, future strain |
| Leisure compatibility | how similarly do both recharge and enjoy life? | boredom, pressure, separate lives |
| Space need compatibility | how much physical and psychological space is needed? | engulfment or distance |
| Stress habit compatibility | how do stress behaviors affect each other? | safety disruption, avoidance, escalation |
| Health/wellness compatibility | how do wellbeing habits coexist? | rest conflict, care mismatch |
| Change tolerance match | how similarly do both tolerate disruption? | rigidity conflict, instability |
| Daily intimacy sustainability | can closeness survive routine? | logistical partnership without emotional nourishment |

High lifestyle compatibility feels like sustainable coexistence, low chronic friction, easier daily intimacy, and emotional breathing room. Low lifestyle compatibility feels like constant adjustment, fatigue, routine resentment, scheduling tension, or the painful sense that loving each other is easier than living together.

Common lifestyle pairings:

| Pairing | Romance Texture | Risk |
| --- | --- | --- |
| Structured + chaotic | balance or lively contrast | chronic stress if adaptation fails |
| Homebody + adventurous | comfort meets novelty | boredom or overstimulation |
| Work-focused + relationship-focused | ambition meets emotional presence | neglect and prioritization conflict |
| Shared rhythm pairing | naturally aligned sleep, routines, and energy | high domestic ease, lower novelty |

Attachment styles often shape lifestyle needs:

| Attachment Style | Lifestyle Pattern |
| --- | --- |
| Secure | adaptable integration |
| Anxious | prefers high emotional accessibility |
| Avoidant | stronger independence and space needs |
| Fearful | inconsistent routines and closeness needs |

Lifestyle compatibility is one of the main engines of long-term intimacy because daily life either supports attachment or slowly erodes it. It often appears through small recurring ease or friction: needing silence while working, planning everything, improvising constantly, leaving clutter, needing decompression, or wanting constant activity.

Failure modes:

| Failure | Result |
| --- | --- |
| Chronic friction accumulation | tiny unresolved mismatches become resentment |
| Emotional neglect through routine | the relationship becomes logistical only |
| Identity suffocation | one partner sacrifices comfort, routines, or energy needs |
| Over-adaptation | one person endlessly adjusts while the other does not |

Lifestyle compatibility can evolve:

```text
separate routines
-> negotiated coexistence
-> shared rhythms
-> integrated domestic life
```

Strong lifestyle compatibility means daily life itself supports intimacy instead of constantly fighting against it.

Compatibility types:

| Type | Meaning | Runtime Use |
| --- | --- | --- |
| Natural compatibility | the relationship flows easily | low friction, fast trust, easy repair |
| Growth compatibility | not easy, but both adapt | healing, opposites attract, earned intimacy |
| High chemistry / low compatibility | compelling drama with unstable fit | obsession, volatility, repeated rupture |
| High compatibility / low chemistry | stable but flat connection | comfort, possible stagnation |
| Transformational compatibility | both change deeply | profound romance or destabilization |

Compatibility affects trust speed, conflict survivability, intimacy pacing, attachment security, and long-term stability.

Example mismatch patterns:

```text
high sexual chemistry
+ low emotional compatibility
= attraction plus repeated rupture
```

```text
high emotional compatibility
+ low novelty compatibility
= comfort plus stagnation risk
```

The strongest relationships are rarely perfectly compatible. They often involve adaptation, translation, negotiation, and growth. Compatibility is dynamic, not static.

Compatibility can evolve:

```text
initial mismatch
-> emotional learning
-> adaptation
-> mutual regulation
-> higher compatibility over time
```

Failure modes:

| Failure | Result |
| --- | --- |
| Single match score | emotionally shallow compatibility |
| Perfect compatibility | low friction, low realism, low growth |
| Ignored incompatibilities | incoherent boundaries, needs, and pacing |
| Chemistry mistaken for compatibility | intense but unsustainable romance |

Useful compatibility variables:

| Variable | Meaning |
| --- | --- |
| Emotional compatibility | emotional system fit |
| Communication compatibility | understanding fit |
| Conflict compatibility | repair survivability |
| Attachment compatibility | security interaction fit |
| Intimacy compatibility | closeness preference fit |
| Sexual compatibility | adult-gated erotic system alignment |
| Exclusivity compatibility | uniqueness expectations fit |
| Autonomy compatibility | independence/closeness balance |
| Stability compatibility | intensity tolerance alignment |
| Lifestyle compatibility | practical life fit |
| Value compatibility | relational philosophy fit |
| Growth compatibility | adaptation and evolution potential |
| Ritual compatibility | habit and emotional rhythm fit |
| Devotion compatibility | emotional centrality fit |
| Novelty compatibility | stimulation and change fit |
| Natural compatibility | baseline ease |
| Adaptation capacity | ability to learn across differences |
| Transformational compatibility | capacity to change each other meaningfully |
| Chemistry/compatibility gap | charge without sustainable fit, or fit without charge |
| Compatibility stress | pressure from mismatch across axes |

Compatibility equation:

```text
fit across axes
+ adaptation capacity
+ repair ability
- unresolved mismatch pressure
= sustainable compatibility
```

#### Values Compatibility

Value compatibility is the fit between two people's core relational priorities: what they believe love should be built around. Chemistry can survive value mismatch for a while, but survivability usually depends on whether the relationship reinforces both people's deepest relational principles.

Common value collisions:

| Collision | Surface Conflict |
| --- | --- |
| Stability vs excitement | one wants calm, the other fears boredom |
| Autonomy vs devotion | one needs freedom, the other needs centrality |
| Honesty vs avoidance | one wants direct truth, the other protects through silence |
| Freedom vs exclusivity | one wants flexibility, the other needs uniqueness |
| Acceptance vs perfection | one wants flaw tolerance, the other fears inadequacy |

Strong couples often share core values even when personalities differ. Two characters can communicate differently, regulate differently, or live differently, but if both deeply value loyalty, repair, and emotional safety, survivability increases.

### Progression Mechanics

Progression mechanics govern how relationships evolve, deepen, destabilize, recover, transform, plateau, or move through emotional stages over time. They answer: what causes this relationship to emotionally move forward or backward?

Relationships should progress through accumulated emotional meaning, not random scene count or a single romance meter.

```text
history
+ events
+ trust
+ vulnerability
+ compatibility
+ timing
+ emotional readiness
= progression
```

Progression should operate across several layers:

| Layer | Meaning |
| --- | --- |
| Emotional progression | attachment and vulnerability growth |
| Narrative progression | phase and turning point movement |
| Behavioral progression | changing interaction patterns |
| Intimacy progression | closeness escalation |
| Stability progression | relationship durability |

Core progression mechanisms:

| Mechanism | Purpose | Example |
| --- | --- | --- |
| Emotional readiness | progress when barriers lower | trust plus fear of loss plus reciprocity confidence enables confession |
| Trigger-based progression | move through meaningful events | jealousy realization, comfort scene, betrayal, public choice |
| Soft-gated progression | stats influence but do not force | high trust plus vulnerability event plus mutual openness unlocks intimacy |
| Phase transitions | move through identifiable states | curiosity -> attraction -> tension -> attachment -> commitment |
| Escalation | increase emotional significance | teasing becomes loaded, comfort becomes dependency |
| Regression | allow backward movement | betrayal lowers trust, avoidance lowers intimacy |
| Repair | let rupture reshape trust | successful repair deepens safety; failed repair creates fragility |
| Momentum | preserve emotional inertia | repeated comfort makes future vulnerability easier |
| Dynamic evolution | change how the relationship behaves | teasing shifts from provocation to affection |
| Thresholds | mark irreversible emotional changes | first betrayal, first "I love you", first major repair |
| Intimacy layer progression | let closeness forms move separately | fast sexual chemistry, slow emotional trust |
| Relationship identity | create a shared "we" | inside jokes, rituals, emotional assumptions |
| Emotional saturation | react to repetition | unresolved conflict causes exhaustion; reassurance tolerance shifts |
| Trajectory prediction | infer where the bond is heading | stabilizing, obsessive, repair arc, breakup risk |
| Milestones | change future emotional logic | exclusivity, public acknowledgment, moving in |
| Compatibility stress | account for mismatch pressure | communication, commitment, pacing, intimacy mismatch |
| Plateaus | model stable or stuck phases | routine needs novelty, vulnerability, crisis, or rediscovery |

Progression must be multi-axis. Do not use a single romance meter.

| Axis | Meaning |
| --- | --- |
| Trust | emotional safety |
| Attraction | romantic or sexual interest |
| Attachment | emotional dependency |
| Vulnerability | openness |
| Commitment | future orientation |
| Stability | conflict durability |
| Tension | unresolved attraction |
| Familiarity | accumulated knowing |
| Devotion | prioritization intensity |

Example progression chain:

```text
shared vulnerability
-> trust increase
-> intimacy threshold crossed
-> easier emotional disclosure
-> attachment deepens
-> fear of loss increases
-> jealousy sensitivity rises
-> commitment pressure emerges
```

The strongest progression systems alter interpretation. Early touch may mean flirtation. Later touch may mean comfort and emotional regulation. The same action changes emotional meaning over time.

Progression failure modes:

| Failure | Result |
| --- | --- |
| instant intimacy | payoff feels unearned |
| emotional resets | history has no consequence |
| static chemistry | relationship never matures |
| repetitive conflict loops | drama replaces growth |
| consequence-free milestones | turning points feel hollow |
| permanent escalation | relationship cannot stabilize |

Useful progression variables:

| Variable | Meaning |
| --- | --- |
| Emotional readiness | openness to progression |
| Progression momentum | relationship inertia |
| Vulnerability threshold | trust needed for openness |
| Regression sensitivity | damage response |
| Repair effectiveness | ability to restore safety |
| Milestone density | number of defining events |
| Stability level | resilience to conflict |
| Dynamic evolution | behavioral change depth |
| Emotional saturation | exhaustion or normalization effects |
| Plateau risk | chance the bond stops evolving |
| Compatibility stress | mismatch pressure |
| Trajectory prediction | inferred emotional direction |

Progression equation:

```text
repeatedly risking emotional change
+ surviving the consequences together
= relationship development
```

### Relationship Trajectory Prediction

Relationship trajectory prediction is the probabilistic forecast of where a relationship is emotionally, structurally, and psychologically likely to evolve based on accumulated patterns, attachment dynamics, trust state, compatibility axes, rupture history, repair competence, momentum, and emotional behavior. It answers: given everything that has emotionally happened so far, where is this relationship most likely heading?

Trajectory prediction is not destiny or a simple compatibility score. It is emotional probability modeling: patterns create momentum toward likely futures, but turning points, accountability, repair, and adaptation can redirect the path.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Trajectory | likely future emotional direction |
| Momentum | accumulated emotional inertia |
| Compatibility | relational fit and mismatch pressure |
| Lifecycle state | current macro emotional condition |
| Survivability | long-term resilience capacity |

Core trajectory equation:

```text
patterns
+ momentum
+ repair
+ attachment
+ adaptation
+ stress
+ compatibility
= trajectory prediction
```

Predict trajectory across several dimensions:

| Dimension | Question |
| --- | --- |
| Attachment trajectory | is attachment becoming safer or more dangerous? |
| Trust trajectory | is emotional safety increasing or decreasing? |
| Stability trajectory | can the bond survive increasing complexity? |
| Intimacy trajectory | is closeness expanding, stagnating, or collapsing? |
| Rupture trajectory | what unresolved damage is accumulating? |
| Repair trajectory | does conflict make the relationship stronger or weaker? |
| Identity trajectory | what relationship story is this becoming? |

Useful trajectory types:

| Trajectory | Pattern | Likely feel |
| --- | --- | --- |
| Secure deepening | trust -> vulnerability -> repair -> safety | stable intimacy growth |
| Obsessive escalation | chemistry -> fixation -> centralization -> dependency | intense and destabilization-prone |
| Push-pull | attachment -> panic -> withdrawal -> longing -> reconnection | addictive instability |
| Slow-burn deepening | tension -> trust -> revelation -> attachment | earned emotional payoff |
| Emotional drift | reduced attention -> weaker rituals -> distance | quiet detachment |
| Repair/redemption | rupture -> accountability -> consistency -> rebuilt safety | transformed intimacy |
| Chaotic collapse | chemistry -> instability -> repeated rupture -> exhaustion | burnout risk |
| Domestic stabilization | attachment -> routines -> rituals -> co-regulation | mature partnership identity |
| Fantasy collapse | idealization -> reality exposure -> disappointment | devaluation or withdrawal |
| Transformational | core wounds -> corrective experiences -> restructuring | healing and identity change |

Positive predictors include repair competence, emotional safety, trust consistency, adaptation capacity, shared values, ritual density, accountability, and emotional availability. Negative predictors include unresolved rupture accumulation, emotional neglect, inconsistency, avoidance, repeated betrayal, intensity addiction, low repair capacity, and chronic invalidation.

Trajectory should also react to attachment pairings. Secure pairings tend toward stable deepening. Anxious/avoidant pairings tend toward push-pull unless repair and adaptation improve. Fearful/fearful pairings tend toward volatile oscillation. Secure/insecure pairings can become healing dynamics or imbalanced caretaker loops depending on mutuality.

Major turning points can redirect trajectory: betrayal, confession, abandonment, sacrifice, successful repair, public choosing, commitment, or a boundary violation. The runtime should treat these as directional events, not isolated drama beats.

Trajectory failure modes:

| Failure | Result |
| --- | --- |
| random emotional shifts | future states feel disconnected from history |
| no accumulated consequence | betrayal, neglect, or repair changes nothing |
| infinite escalation | the relationship cannot stabilize or mature |
| deterministic scoring | characters lose agency and turning points lose force |

Useful trajectory variables:

| Variable | Meaning |
| --- | --- |
| Attachment trajectory | bond strengthening or weakening |
| Trust trajectory | emotional safety direction |
| Stability trajectory | resilience direction |
| Intimacy trajectory | closeness progression |
| Rupture risk | likelihood of destabilization |
| Repair momentum | reconnection strengthening |
| Drift risk | emotional disengagement probability |
| Identity consolidation | "we" narrative strengthening |
| Survivability projection | likely long-term resilience |

### Relationship Momentum

Relationship momentum is the accumulated emotional inertia of a relationship: the tendency for repeated emotional patterns, interactions, attachment dynamics, and relational direction to increasingly reinforce future outcomes. It answers: what emotional direction is this relationship naturally moving toward?

Momentum is accumulated emotional probability. Repeated experiences change future reactions, trust thresholds, intimacy pacing, emotional expectations, attachment behavior, and relationship interpretation. Without momentum, scenes feel emotionally stateless. With momentum, the relationship feels cumulative, alive, and directional.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Momentum | directional emotional inertia |
| Progression | stage or axis movement |
| Attachment | emotional bonding |
| Stability | resilience under stress |
| Relationship identity | shared "we" meaning |

Every emotionally meaningful interaction should alter future emotional probability:

```text
safe vulnerability
-> trust increase
-> easier future openness
-> faster attachment growth
```

```text
repeated inconsistency
-> insecurity
-> hypervigilance
-> conflict escalation likelihood
```

Useful momentum types:

| Type | Core Effect | Runtime Use |
| --- | --- | --- |
| Positive attachment momentum | closeness becomes more natural | easier intimacy, safer bonding |
| Romantic escalation momentum | attraction and tension intensify | slow burn acceleration, longing |
| Trust momentum | reliability lowers defenses | vulnerability acceleration |
| Negative momentum | unresolved damage compounds | fragility, exhaustion, hypervigilance |
| Obsession momentum | fixation reinforces itself | dependency, jealousy loops |
| Repair momentum | reconnection strengthens resilience | conflict trust and redemption arcs |
| Domestic momentum | routines deepen attachment | home-like grounding |
| Vulnerability momentum | openness becomes easier | deeper intimacy acceleration |
| Conflict momentum | conflict patterns reinforce themselves | rupture loops or improved repair trust |
| Emotional drift momentum | distance slowly normalizes | long-term disconnection |

Relationship momentum states:

| State | Meaning | Common Signal |
| --- | --- | --- |
| Escalating | relationship is rapidly intensifying | attachment, focus, vulnerability increase |
| Stabilizing | relationship is becoming safer | consistency, repair, predictability |
| Volatile | intensity and rupture cycle | reunion highs, instability, push-pull |
| Repairing | relationship is actively improving | accountability, safer communication |
| Deteriorating | damage and resentment compound | neglect, repeated disappointment |
| Stagnant | no meaningful evolution occurs | boredom, emotional flattening |

Attachment styles shape momentum:

| Attachment Style | Momentum Pattern |
| --- | --- |
| Secure | stabilizing momentum |
| Anxious | acceleration and fixation |
| Avoidant | push-pull momentum |
| Fearful | volatile oscillation |

Chemistry often creates acceleration momentum through anticipation, fixation, tension loops, and emotional centralization. Chemistry without trust, safety, and repair can become destructive momentum.

Momentum depends on emotional memory accumulation. Past experiences alter expectations, nervous system reactions, and emotional assumptions. Repeated abandonment creates instability expectations; repeated reassurance creates security expectations.

Relationship identity can also gain momentum. Narratives such as "we always come back", "we destabilize each other", or "we are emotionally safe together" start reinforcing future behavior.

Turning points redirect momentum. Betrayal, confession, repair, sacrifice, abandonment, public choosing, or major boundary violations can accelerate, destabilize, reverse, or heal the relationship trajectory.

Momentum failure modes:

| Failure | Result |
| --- | --- |
| Emotional reset syndrome | nothing accumulates emotionally |
| Infinite escalation | relationship only intensifies until burnout |
| No trajectory | relationship lacks direction or evolution |
| Unchecked negative loops | damage becomes self-reinforcing |

Useful momentum variables:

| Variable | Meaning |
| --- | --- |
| Attachment momentum | acceleration of bonding |
| Trust momentum | increasing emotional safety |
| Conflict momentum | escalation versus repair tendency |
| Emotional drift momentum | disconnection accumulation |
| Obsession momentum | fixation reinforcement |
| Repair momentum | resilience growth |
| Domestic momentum | routine intimacy accumulation |
| Vulnerability momentum | openness acceleration |
| Stability momentum | increasing emotional reliability |
| Emotional memory weight | how strongly history affects future responses |
| Expectation reinforcement | how much patterns become self-fulfilling |
| Trajectory acceleration | speed of directional change |
| Turning point sensitivity | how strongly major events redirect momentum |

Momentum equation:

```text
repeated emotional pattern
+ emotional memory
+ expectation reinforcement
+ current attachment pressure
= future emotional probability
```

Relationships become emotionally believable when the past meaningfully changes the emotional probability of the future.

### Relationship Lifecycle States

Relationship lifecycle states are the evolving emotional and structural conditions a relationship moves through as attachment, intimacy, conflict, trust, identity, and commitment develop, destabilize, transform, or dissolve. They answer: what emotional condition is this relationship currently existing inside?

Lifecycle state is the macro emotional operating mode of the relationship. It is deeper than dating, married, or broken up because the relationship is treated as a living emotional system.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Lifecycle state | current macro emotional condition |
| Relationship status | structural or social definition |
| Relationship phase | progression stage |
| Relationship identity | shared "we" concept |
| Momentum | directional emotional inertia |

Lifecycle states govern the emotional operating environment. The same line, touch, conflict, silence, or reassurance lands differently depending on whether the bond is in tension, instability, repair, drift, or stable partnership.

Core lifecycle states:

| State | Core Feeling | Runtime Signal |
| --- | --- | --- |
| Potential | something emotionally possible exists | curiosity, fascination, attention |
| Attraction | I am drawn to you | chemistry, flirtation, anticipation |
| Tension | something unresolved exists | restraint, subtext, almost-confessions |
| Pursuit | we are moving toward each other | escalation, testing, attachment acceleration |
| Denial | feelings exist but are resisted | hidden attraction, guardedness |
| Attachment formation | you are becoming important | prioritization, jealousy, reassurance sensitivity |
| Vulnerability | we are exposing ourselves | confession, honesty, trust progression |
| Instability | this matters but feels unsafe | push-pull, volatility, inconsistent attachment |
| Obsession | the bond dominates attention | fixation, fear of loss, centralization |
| Devotional | we profoundly prioritize each other | loyalty, protectiveness, attachment depth |
| Domestic integration | our lives are integrating | rituals, routines, co-regulation |
| Stable partnership | this feels survivable long-term | conflict trust, repair reliability |
| Plateau | the relationship is emotionally static | low novelty, routine dominance |
| Drift | we are moving apart slowly | reduced attentiveness, weakened rituals |
| Fracture | major emotional damage occurred | trust collapse, fragility, hypervigilance |
| Repair | we are rebuilding safety | accountability, cautious vulnerability |
| Reconnection | the bond survived rupture | reunion, rediscovery, reconciliation |
| Transformation | the relationship changed us | healing, identity shifts, worldview change |
| Dissolution | the relationship is ending | detachment, finality, grief |
| Post-attachment | it ended but significance remains | nostalgia, imprinting, unresolved love |

Lifecycle transitions should be dynamic:

```text
attraction
-> tension
-> attachment formation
-> vulnerability
-> instability
-> repair
-> stable partnership
```

```text
obsession
-> instability
-> fracture
-> dissolution
```

Momentum determines likely transitions. Positive repair momentum can move the relationship toward stabilizing states. Unresolved conflict momentum can move it toward fracture, drift, or dissolution.

Attachment styles bias lifecycle patterns:

| Attachment Style | Common Lifecycle Pattern |
| --- | --- |
| Secure | stable progression |
| Anxious | accelerated attachment |
| Avoidant | delayed intimacy and withdrawal |
| Fearful | volatile oscillation |

Lifecycle state changes relationship identity, rituals, communication, vulnerability, expectations, pacing, affection style, and emotional tone. Strong RP relationships feel stateful because they remember what happened, what changed, what was damaged, and what was repaired.

Failure modes:

| Failure | Result |
| --- | --- |
| Static relationship syndrome | relationship never evolves emotionally |
| Instant state jumps | devotion, trust, or repair happen without earned transition |
| No repair state | conflict either vanishes instantly or destroys everything |
| Status-only modeling | labels replace emotional condition |

Useful lifecycle variables:

| Variable | Meaning |
| --- | --- |
| Current lifecycle state | macro emotional condition |
| Attachment depth | emotional centrality |
| Stability level | resilience of the bond |
| Momentum direction | likely emotional trajectory |
| Vulnerability openness | current intimacy exposure |
| Trust integrity | safety level |
| Ritual density | continuity strength |
| Emotional volatility | instability intensity |
| Repair progress | rebuilding status |
| State transition readiness | likelihood of moving states |
| State memory weight | how strongly the state changes interpretation |

Relationships feel alive when they are allowed to evolve through recognizable emotional states instead of remaining permanently static.

### Relationship Survivability

Relationship survivability is the overall ability of a relationship to endure stress, conflict, change, rupture, attachment pressure, life difficulty, emotional evolution, and time without permanently collapsing emotionally or structurally. It answers: what allows this relationship to continue existing despite emotional difficulty, change, and reality?

Survivability is not lack of conflict, constant happiness, perfect compatibility, chemistry, obsession, or even love. Strong survivability means the relationship can absorb rupture, adapt, repair, and continue emotionally functioning over time.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Survivability | long-term resilience capacity |
| Stability | current emotional steadiness |
| Compatibility | relational fit |
| Trust | emotional reliability belief |
| Attachment | emotional bond |

Core survivability equation:

```text
repair capacity
+ adaptation
+ emotional safety
+ trust
+ shared willingness to continue choosing each other
= relationship survivability
```

Useful survivability components:

| Component | Core Question | Collapse Risk |
| --- | --- | --- |
| Conflict survivability | can the relationship survive tension? | small conflict becomes existential threat |
| Trust durability | how stable is trust under stress? | hypervigilance, fragility |
| Emotional safety stability | can vulnerability remain safe over time? | defensive shutdown |
| Adaptation capacity | can needs and realities be renegotiated? | rigidity, resentment |
| Attachment resilience | can attachment survive distance, stress, and change? | panic, withdrawal |
| Identity stability | does the "we" remain coherent under pressure? | identity rupture |
| Intimacy survivability | can closeness survive disappointment and reality? | logistical partnership, detachment |
| Lifestyle sustainability | can daily life coexist with attachment? | exhaustion, domestic erosion |
| Rupture recovery capacity | how much damage can be repaired? | permanent fracture |
| Future survivability | can both imagine continuing long-term? | commitment collapse |

High survivability feels resilient, adaptable, repair-capable, secure, and enduring. Low survivability feels fragile, volatile, exhausting, unsustainable, or collapse-prone.

Chemistry and survivability should remain separate:

| Pattern | Result |
| --- | --- |
| High chemistry + low survivability | obsession, volatility, intensity, addictive cycles |
| High survivability + low chemistry | safety, comfort, partnership, possible flattening |
| High chemistry + high survivability | mature romance where intensity, trust, repair, and adaptation coexist |

Attachment pairings shape survivability:

| Pairing | Survivability Pattern |
| --- | --- |
| Secure + secure | high resilience |
| Anxious + avoidant | unstable without adaptation |
| Fearful + fearful | volatility-heavy |
| Secure + insecure | potential healing dynamic |

Repair is the core engine of survivability:

```text
rupture
-> repair
-> reconnection
```

When this repeats successfully, conflict trust and emotional safety deepen. Without repair, damage accumulates.

Momentum and identity reinforce survivability. Positive momentum creates trust loops, successful repair, ritual continuity, and emotional fluency. Relationship identities such as "we always come back", "we survive conflict", or "we grow together" can recursively strengthen resilience.

Failure modes:

| Failure | Result |
| --- | --- |
| Fragility loops | small issues repeatedly create major destabilization |
| Repair failure | reconnection never restores safety |
| Stagnation survivability illusion | stability exists only because needs are suppressed |
| Intensity addiction | the relationship survives through chaos until burnout |

Survivability can evolve:

```text
chemistry
-> attachment
-> conflict
-> repair
-> emotional safety
-> adaptation
-> resilient partnership
```

Useful survivability variables:

| Variable | Meaning |
| --- | --- |
| Conflict survivability | resilience under disagreement |
| Trust durability | trust stability over time |
| Repair competence | reconnection ability |
| Emotional safety stability | vulnerability survivability |
| Adaptation capacity | ability to evolve together |
| Attachment resilience | bond durability |
| Lifestyle sustainability | practical coexistence viability |
| Identity stability | persistence of "we" narrative |
| Rupture recovery capacity | ability to recover after damage |
| Future survivability | long-term emotional viability |

Relationships survive not because they avoid difficulty, but because difficulty does not automatically destroy connection, trust, or attachment.

### Relationship Identity Mechanics

Relationship identity mechanics define how the relationship becomes its own emotional entity over time. Eventually the relationship stops being only Person A plus Person B and becomes a "we." This layer answers: what kind of relationship are we becoming?

A relationship feels alive when it develops its own personality: playful and chaotic, emotionally safe, obsessive and consuming, teasing but loyal, soft and domestic, competitive but devoted. This shared identity changes interaction interpretation, future expectations, conflict stakes, intimacy style, and emotional inertia.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Relationship dynamic | recurring interaction loop |
| Relationship identity | shared emotional self-concept |
| Trope | narrative and emotional framework |
| Chemistry | interaction charge |
| Commitment | long-term investment |

Example: the dynamic may be teasing and challenge, while the identity is "we emotionally provoke each other, but always come back."

Useful identity components:

| Component | Meaning | Example |
| --- | --- | --- |
| Shared narrative | story the couple believes about themselves | "We survived everything." |
| Shared emotional roles | stable or evolving emotional positions | protector/emotional heart, tease/reactor |
| Shared rituals | repeated relational behaviors | nightly calls, comfort routines, reconciliation rituals |
| Shared language | couple-specific shorthand | nicknames, repeated phrases, nonverbal cues |
| Shared memory architecture | landmarks that define the bond | first fight, betrayal, reconciliation, hardships |
| Shared expectations | internal relationship rules | "We do not leave during fights." |
| Shared future orientation | assumed permanence | "We should go there someday." |
| Public/private identity | layered relational presentation | publicly teasing, privately soft |
| Relational archetype | recognizable couple pattern | chaotic soulmates, competitive partners |
| Shared vulnerability culture | how this relationship handles weakness | teasing-but-soft, quiet support, verbal reassurance |
| Emotional tone identity | characteristic atmosphere | tender, yearning, chaotic, devotional, playful |
| Relationship values | shared emotional principles | loyalty, freedom, honesty, safety, intensity |

Relationship identity states:

| State | Emotional Meaning |
| --- | --- |
| Curious | undefined emotional possibility |
| Flirtatious | tension-focused |
| Emotionally attached | emotional centrality forming |
| Devotional | deep prioritization |
| Fragile | instability or high sensitivity |
| Domestic | integrated daily closeness |
| Competitive | challenge-based closeness |
| Obsessive | consuming emotional focus |
| Safe haven | emotionally safe for each other |
| Chaotic | destabilizing but intense |
| Healing | helping each other become safer |
| Transformational | the relationship changes identity and worldview |
| Repairing | rebuilding trust |
| Stable partnership | secure emotional structure |
| Co-dependent | unhealthy emotional overreliance |

Identity can rupture. Betrayal, abandonment, humiliation, broken promises, or emotional neglect may damage not only trust but the shared "we." If the relationship identity was "we always protect each other," a public failure to defend the partner hurts more deeply because it violates the relationship's self-concept.

Identity repair requires symbolic emotional restoration. If the identity was "we always come back to each other," reconciliation scenes become identity reaffirmation, not just conflict resolution.

Relationship identity should evolve:

```text
strangers
-> flirt tension
-> emotional dependence
-> unstable attachment
-> trust building
-> domestic intimacy
-> partnership identity
```

Attachment and tone can bias identity:

| Attachment Dynamic | Likely Identity |
| --- | --- |
| secure + secure | stable partnership |
| anxious + avoidant | longing push-pull |
| fearful + fearful | chaotic intensity |
| secure + fearful | healing sanctuary |
| rivals | challenge partnership |
| devotional pair | emotionally central bond |

| Tone | Identity Feel |
| --- | --- |
| Playful | teasing partnership |
| Yearning | emotionally unresolved |
| Devotional | sacred emotional bond |
| Chaotic | unstable intensity |
| Tender | emotionally safe home |
| Melancholic | beautiful fragility |

Strong relationships eventually develop self-awareness. The couple knows how they work, what they are, and what they mean to each other: "We are terrible at talking directly" or "You always come back when you are scared." This meta-awareness creates realism.

Useful relationship identity variables:

| Variable | Meaning |
| --- | --- |
| Shared identity strength | strength of "we" feeling |
| Ritual density | amount of shared habits |
| Future integration | assumed permanence |
| Emotional interdependence | mutual emotional centrality |
| Identity stability | resilience under conflict |
| Shared mythology | strength of relational narrative |
| Couple culture depth | uniqueness of interaction patterns |
| Public/private contrast | relational duality |
| Role rigidity | flexibility of emotional roles |
| Emotional mythology | depth of shared story and meaning |
| Relationship uniqueness | emotional singularity strength |
| Shared value alignment | coherence of relational philosophy |
| Emotional tone identity | consistency of the relationship atmosphere |
| Identity rupture risk | chance a violation damages the shared self-concept |
| Identity repair readiness | ability to symbolically restore the relationship identity |

Relationship identity equation:

```text
shared history
+ rituals
+ emotional roles
+ mutual self-awareness
= shared emotional world
```

### Relationship Status Types

Relationship status is the current structural and emotional state of a relationship: how it is defined, perceived, functioning, and socially or emotionally positioned right now. It answers: what are we emotionally and structurally right now?

Status is not just single, dating, or married. A realistic status can be emotionally attached, non-exclusive, conflict-fragile, privately devoted, and publicly undefined at the same time.

Keep these concepts separate:

| Concept | Meaning |
| --- | --- |
| Relationship status | current relational state |
| Trope | narrative and emotional framework |
| Dynamic | recurring interaction pattern |
| Relationship identity | long-term shared "we" concept |
| Phase | progression stage |

Track status as multiple simultaneous dimensions:

| Dimension | Examples |
| --- | --- |
| Structural | strangers, friends, dating, married, open, exes |
| Emotional | curious, attached, yearning, detached, devoted |
| Commitment | casual, serious, uncertain, future-oriented |
| Exclusivity | exclusive, emotionally exclusive, open, poly, ambiguous |
| Stability | stable, fragile, chaotic, repairing, deteriorating |
| Intimacy | distant, flirtatious, vulnerable, domestic |
| Visibility | secret, hidden feelings, public, socially ambiguous |
| Attachment | secure, dependent, avoidant, unresolved |

High-resolution relationship statuses:

| Status | Core Meaning | Runtime Use |
| --- | --- | --- |
| Strangers | no familiarity yet | potential and discovery |
| Familiar strangers | recognition without intimacy | tension-friendly awareness |
| Curious | interest exists, attachment minimal | attention and fascination |
| Flirtation state | attraction signaling begins | teasing, testing, ambiguity |
| Denial state | attraction is resisted | friends/enemies slow burn |
| Emotionally interested | attachment beginning | prioritization and attentiveness |
| Tension-heavy undefined | something exists but is unnamed | classic slow burn pressure |
| Situationship | relationship behaviors without structure | ambiguity and instability |
| Secretly attached | private emotional significance | forbidden or restrained romance |
| Mutual yearning | both attached but unresolved | high slow-burn intensity |
| Casual dating | exploratory connection | lower commitment expectations |
| Emotionally exclusive | one person is emotionally central | singularity before formal labels |
| Official relationship | acknowledged commitment structure | expectations stabilize |
| Deep attachment | relationship becomes psychologically central | dependency and routine integration |
| Devotional relationship | profound emotional choosing | intensity and prioritization |
| Domestic partnership | daily-life integration | routines, caretaking, practical interdependence |
| Secure partnership | trust, stability, safety, repair | mature attachment |
| Fragile state | weakened trust or stability | careful pacing and sensitivity |
| Push-pull state | closeness and withdrawal alternate | anxious/avoidant loop |
| Obsessive state | psychologically consuming bond | fixation and fear of loss |
| Conflict-dominant | fighting defines the bond | high chemistry, high rupture risk |
| Emotional avoidance | connection exists but vulnerability blocked | suppressed intimacy |
| Emotional drift | prioritization slowly weakens | long-term realism and stagnation risk |
| Estranged | emotional separation exists | unresolved attachment at distance |
| Broken up but attached | structurally separated, emotionally bonded | longing and unfinished business |
| Repairing relationship | trust and safety are rebuilding | redemption and consistency proof |
| Reconciliation | attachment returns after rupture | survival and renewed vulnerability |
| Soulmate identity | existential significance | fated or identity-level romance |
| Companionate love | stable depth with lower activation | long-term affection and partnership |
| Transformational bond | relationship changes identity or worldview | deepest romance transformation |
| Open relationship | primary bond with negotiated openness | boundaries and reassurance |
| Polyamorous bond | multiple significant relationships | differentiation and bandwidth |
| Nested partnership | domestic/emotional primary structure | priority and fairness tension |
| Fluid attachment network | autonomy-based relational structure | negotiated identity and freedom |

Strong statuses are emotionally descriptive. "Dating" is weak. "Emotionally attached but conflict-fragile slow burn" immediately tells the runtime pacing, dialogue style, conflict risk, intimacy level, and emotional stakes.

Status can evolve, regress, rupture, repair, or transform:

```text
uncertainty
-> attachment
-> vulnerability
-> commitment
-> partnership
-> identity integration
```

Useful relationship-status variables:

| Variable | Meaning |
| --- | --- |
| Structural definition | official relationship category |
| Emotional attachment | emotional significance |
| Commitment level | investment depth |
| Stability level | resilience of bond |
| Exclusivity state | uniqueness structure |
| Intimacy level | closeness depth |
| Visibility state | public/private status |
| Relationship identity strength | strength of "we" feeling |
| Repair state | current recovery trajectory |
| Unresolved tension | active ambiguity or pressure |
| Status ambiguity | uncertainty in definition |

## Memory

Do not store every chat turn as equal memory. Separate raw transcript from durable memory, and divide recall into three functional tiers.

### Scenario Scoping

Every chat runtime record should belong to a scenario. A scenario is the active story track: one character route, one ongoing world state, one relationship arc, and one memory boundary.

This prevents cross-contamination between separate roleplays. A slow-burn office romance should not inherit facts, route progress, or player-facing pacing adjustments from a fantasy court intrigue unless the user explicitly imports or links those memories.

A first SQLite shape for scenario tracks:

```sql
CREATE TABLE IF NOT EXISTS scenarios (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  active_card_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

All runtime commands that read or write chat memory should take a `scenario_id`. This includes transcript turns, profile facts, relationship state, summaries, lore recall, and future vector indexes.

Recommended native commands:

- `create_scenario`
- `list_scenarios`
- `update_scenario`
- `delete_scenario`
- `get_active_scenario`
- `set_active_scenario`

The UI can use a friendly "Scenario Tracks" sidebar, but the packaged desktop app should call Tauri IPC commands rather than `/api/scenarios` route handlers.

### Tier 1: Episodic / Working Memory

Purpose: exact conversation flow.

Store the recent 10-20 messages, or a token-bounded equivalent, as active working memory. This is the only layer that should preserve exact local turn order by default.

Use it for:

- immediate continuity
- unresolved actions
- pronoun/entity references
- current scene pacing
- exact recent wording

A first SQLite shape for raw turns:

```sql
CREATE TABLE IF NOT EXISTS chat_logs (
  id TEXT PRIMARY KEY,
  scenario_id TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  speaker TEXT NOT NULL CHECK(speaker IN ('user', 'assistant')),
  content TEXT NOT NULL,
  msg_type TEXT NOT NULL CHECK(msg_type IN ('IC', 'OOC')) DEFAULT 'IC',
  is_compressed INTEGER NOT NULL CHECK(is_compressed IN (0, 1)) DEFAULT 0,
  FOREIGN KEY(scenario_id) REFERENCES scenarios(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_chat_logs_scenario_compression
ON chat_logs (scenario_id, is_compressed, msg_type, timestamp ASC);
```

Use `assistant`, not `ai`, in storage so the database matches common chat role naming and prompt compiler roles.

Emotional state should be stored as event flags and unresolved beats scoped to the conversation or scenario. A first SQLite shape:

```sql
CREATE TABLE IF NOT EXISTS emotional_flags (
  conversation_id TEXT NOT NULL,
  flag_key TEXT NOT NULL,
  flag_value INTEGER NOT NULL CHECK(flag_value IN (0, 1)) DEFAULT 1,
  created_at TEXT NOT NULL,
  PRIMARY KEY (conversation_id, flag_key)
);

CREATE TABLE IF NOT EXISTS emotional_events (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  character_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  trigger_id TEXT,
  intensity INTEGER NOT NULL DEFAULT 1,
  user_text TEXT,
  summary TEXT NOT NULL,
  state_delta TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS unresolved_beats (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  beat_key TEXT NOT NULL,
  description TEXT NOT NULL,
  resolved INTEGER NOT NULL CHECK(resolved IN (0, 1)) DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS relationship_states (
  conversation_id TEXT PRIMARY KEY,
  phase TEXT NOT NULL,
  current_mood TEXT,
  attachment_style TEXT,
  intensity_json TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

The `intensity_json` field is for hidden soft counters only. It should not be used as the sole gate for confession, intimacy, forgiveness, or commitment.

### Tier 2: Semantic Memory

Purpose: fuzzy recall of past events, feelings, patterns, and scenes.

Start with SQLite FTS and dense summaries. Add vector embeddings later when the durable memory model is stable.

Use it for:

- similar past scenes
- emotional history
- repeated conflict patterns
- old promises or shared experiences
- lore-relevant memories

Semantic memory can be summarized, consolidated, archived, and re-indexed. It should not be the source of truth for absolute facts.

### Tier 3: Declarative Memory

Purpose: hard facts and preferences.

Store stable facts in a local key-value/profile table. These should be retrieved directly, not discovered through vector similarity. In the Tauri desktop app, this table should live behind native Rust commands using the existing `rusqlite` pattern and `app_data_dir`, not a broad frontend SQL surface.

Examples:

- user name
- birthday
- pronouns
- favorite food or drink
- boundaries
- relationship agreements
- character-specific preferences
- pet names and important people

Declarative facts should carry source, confidence, timestamps, and whether they are user-confirmed. Conflicting facts should be staged for review rather than silently overwritten when risk is high.

A first SQLite shape:

```sql
CREATE TABLE IF NOT EXISTS profile_facts (
  scenario_id TEXT NOT NULL,
  fact_key TEXT NOT NULL,
  fact_value TEXT NOT NULL,
  track TEXT NOT NULL CHECK(track IN ('IC', 'OOC')),
  confidence REAL NOT NULL DEFAULT 1.0,
  source_turn_id TEXT,
  user_confirmed INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (scenario_id, fact_key),
  FOREIGN KEY(scenario_id) REFERENCES scenarios(id) ON DELETE CASCADE
);
```

Preferred implementation path:

- use `rusqlite` in `src-tauri` as the app already does for `library_cache.db`
- store the profile database under Tauri `app_data_dir`
- expose narrow commands such as `insert_chat_log`, `list_active_chat_logs`, `upsert_profile_fact`, `list_profile_facts`, and `delete_profile_fact`
- require `scenario_id` on every command that reads or writes runtime memory
- require a fact track when saving: `IC` for story/world facts, `OOC` for player preferences and boundaries
- register every command in `tauri::generate_handler!`
- keep frontend helpers typed and small

Avoid using the SQL plugin as the default profile-memory layer unless there is a specific reason to expose SQL to the webview. If `@tauri-apps/plugin-sql` is adopted later, it must use least-privilege capabilities and should still avoid arbitrary user-facing SQL.

Memory types:

- transcript turn
- durable fact
- user preference
- character preference
- relationship milestone
- scene summary
- lore-relevant event
- boundary or safety note

### IC and OOC Tracks

Roleplay memory must separate in-character canon from out-of-character player preferences.

`IC` memory includes:

- story events
- locations visited
- character relationship changes
- promises, betrayals, gifts, injuries, secrets, and plot hooks
- lore revealed during play

`OOC` memory includes:

- user pacing preferences
- disliked tropes
- preferred POV or writing style
- hard and soft boundaries
- model/provider preferences
- explicit requests about how the roleplay should proceed

The prompt compiler should keep these tracks separate:

```text
[ROLEPLAY SETTING AND META RULES - OOC]
player preferences, limits, pacing, writing style

[ESTABLISHED CHARACTER PROFILE AND LORE - IC]
canon facts, plot state, relationship history
```

Do not let OOC preferences become character memories, and do not let IC plot events overwrite player profile facts.

### Fact Extraction

Vectors cannot reliably remember absolute facts. After saving turns, run a background extraction pass that proposes structured facts from the latest exchange.

The extraction result should be strict JSON-like data, validated locally before persistence:

```ts
type ExtractedFact = {
  subject: string;
  value: string;
  track: "IC" | "OOC";
  confidence: number;
  sourceTurnId: string;
  userConfirmed: boolean;
};
```

The extraction pass can use deterministic parsers for obvious facts, a small local model, or a cloud model when explicitly enabled. It should run after the main response path and should not block chat generation. The extracted output must be parsed through a strict schema before any `upsert_profile_fact` command is called. The local database remains the authority.

### Time Anchoring

Every compiled runtime prompt should include a small meta-context block before character/lore content:

```text
[Current Local Time]: Saturday, May 23, 2026, 10:30 AM
[Last Interaction]: 4 days ago
[Session Gap]: Significant gap; greet naturally and avoid pretending the chat was continuous.
```

This block should be generated from local session timestamps, not guessed by the model.

### Consolidation

Long-running chats need a sleep-cycle equivalent. Trigger consolidation by message count, token pressure, or idle time.

Consolidation should:

- summarize the last block of raw turns as a roleplay chapter
- separate plot progression from player/meta preferences
- extract new facts and boundary changes
- record relationship milestones
- capture emotional progression
- compile candidate lorebook notes from durable IC events
- preserve unresolved hooks
- archive or compress raw turns once safe
- index the clean summary for semantic recall

Do not delete raw user data irreversibly unless the user has chosen that retention policy.

A first summary table can be:

```sql
CREATE TABLE IF NOT EXISTS consolidated_summaries (
  id TEXT PRIMARY KEY,
  scenario_id TEXT NOT NULL,
  start_timestamp TEXT NOT NULL,
  end_timestamp TEXT NOT NULL,
  plot_progression TEXT NOT NULL,
  character_relationship TEXT NOT NULL,
  player_meta_notes TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY(scenario_id) REFERENCES scenarios(id) ON DELETE CASCADE
);
```

The first consolidation query should pull only uncompressed IC turns:

```sql
SELECT id, timestamp, speaker, content
FROM chat_logs
WHERE scenario_id = ?1 AND is_compressed = 0 AND msg_type = 'IC'
ORDER BY timestamp ASC;
```

After a successful consolidation pass, mark the processed rows compressed by id or timestamp range rather than blindly updating every fresh row. OOC rows should be summarized separately into `player_meta_notes` or profile facts, not mixed into the IC roleplay script.

The sleep cycle should act more like a lorebook compiler than a generic diary. It should produce:

- `plot_progression`: physical story events, places, actions, and consequences
- `character_relationship`: romance/tension/trust progression and current route gate
- `player_meta_notes`: OOC pacing, limits, style preferences, and trope requests

Only the IC outputs should be eligible for lorebook/semantic story recall. OOC outputs should guide runtime behavior and settings, not become fictional canon.

Initial implementation:

- store sessions and turns in SQLite
- mark turns, facts, and summaries with IC/OOC track where relevant
- add SQLite FTS for keyword recall
- store declarative facts in a dedicated profile/key-value table
- implement the factual profile store as narrow Tauri commands over `rusqlite`
- inject current local time, last interaction time, and session-gap notes
- summarize long sessions into durable scene summaries
- allow users to inspect and delete saved memory

Later implementation:

- add embeddings only after the SQLite memory model is stable
- keep one embedding provider/dimension per memory index
- do not mix OpenAI and local Ollama embeddings in the same vector field unless the store is re-embedded
- add background fact extraction and consolidation workers once provider selection is stable

## Provider Selection

Supported provider modes should be explicit:

- Local: Ollama or another local model endpoint
- Cloud: OpenAI or another configured provider
- Offline: no model call, editing and preview only

If the local provider is unavailable, the app should show a status and ask before using a cloud provider. This avoids surprise costs and keeps private chats local unless the user chooses otherwise.

OpenAI API keys must not be exposed in `NEXT_PUBLIC_*` variables. Cloud provider calls should use a secure server, Tauri command, encrypted local setting, or another explicit secret-management path.

## Memory Review UI

The chat screen can eventually include a collapsible memory/sidebar editor, but it should not be implemented as a Next.js API route for the packaged desktop app. Static Tauri builds should call narrow native commands through IPC.

Recommended user-facing sections:

- Character Facts: IC canon and character/session facts
- Player Preferences: OOC pacing, style, boundaries, and trope preferences
- Story So Far: IC consolidated chapter summaries
- Relationship Progress: current stage, route milestones, tension/trust state
- Boundaries: OOC safety and comfort rules

Recommended actions:

- Save
- Forget
- Mark as canon
- Move to player preference
- Move to story memory
- Mark as wrong

Implementation shape:

```ts
await invoke("upsert_profile_fact", {
  scenarioId,
  fact: {
    key: "character_relationship",
    value: "Building trust after the rooftop argument",
    track: "IC",
    confidence: 1,
    userConfirmed: true,
  },
});
```

Avoid `/api/character-sheet` wrappers unless the app deliberately gains a server runtime. The desktop app should not depend on Next API routes for local memory storage.

## Prompt Compiler Inputs

The compiled runtime prompt should assemble:

- character card data
- selected persona
- active scenario override
- active lorebooks
- OOC player preferences and boundaries
- IC established lore and profile facts
- current relationship stage
- active story engine
- route pacing rules
- relationship state and current vibe
- declarative facts
- relevant durable memories
- recent chat
- current local time and last-interaction gap
- summaries
- card `system_prompt`
- card `post_history_instructions`
- safety/runtime guardrails

The compiler should support preview mode so users can inspect what will be sent before chat starts, while still hiding low-level classifier internals.

## Sensory and Embodied Prose Layer

Story-engine tags can privately select sensory priorities and body-cue behavior:

- `angsty`: touch, kinesthetic/body, sound; restraint before confession
- `hurt/comfort`: touch, warmth/cold, posture; care shown through action
- `slow burn`: proximity, breath, eye contact, interruption; feeling earned gradually
- `cozy romance`: smell, taste, touch; comfort through familiar detail
- `dark romance`: pressure, heat, shadow, silence; intensity with continuity and agency

These profiles are compiler hints, not user-facing controls.

Reference material such as emotion charts, feeling/sensation lists, and writing-craft resources may be used to check coverage while building the internal lexicon. Do not transcribe those sources wholesale, ship their images/PDFs, or expose their raw matrices in the app. Distill them into app-owned categories, aliases, and route hints that support friendly story-engine labels.

## Non-Goals

- Do not build a general AI companion memory system before card/lore/session structure is reliable.
- Do not make the LLM solely responsible for relationship-state updates.
- Do not store hidden runtime scores inside exported cards.
- Do not silently send private local chats to a cloud provider.
- Do not expose emotion wheels, body-cue matrices, vector dimensions, or classifier internals in the main user workflow.
