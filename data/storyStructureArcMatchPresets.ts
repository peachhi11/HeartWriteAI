import {
  createVocabularySeedPreset,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";
import type {
  NarrativeArcPhase,
  NarrativeEventScale,
} from "./narrativeArcControllerVocabularyPresets";

export type StoryStructureLensId =
  | "three_act_structure"
  | "four_act_structure"
  | "hero_journey_structure"
  | "save_the_cat_structure"
  | "kishotenketsu_structure"
  | "freytag_structure"
  | "dan_wells_seven_point_structure"
  | "scientific_method_structure"
  | "romance_route_structure"
  | "relationship_repair_structure";

export type CanonicalStoryBeatRole =
  | "setup"
  | "inciting_trigger"
  | "threshold_choice"
  | "complication"
  | "midpoint_reversal"
  | "escalation"
  | "crisis"
  | "climax"
  | "resolution"
  | "new_equilibrium";

export type StoryShapeSignal =
  | "external_adventure"
  | "internal_growth"
  | "relationship_progression"
  | "romance_slow_burn"
  | "rupture_repair"
  | "mystery_research"
  | "episodic_complication"
  | "ensemble_web"
  | "transformation_arc"
  | "quiet_slice_of_life"
  | "high_concept_premise"
  | "choice_pressure"
  | "twist_based"
  | "tragedy_pressure";

export interface StoryBeatAlias {
  role: CanonicalStoryBeatRole;
  aliases: readonly string[];
  narrativePhase: NarrativeArcPhase;
  eventScale: NarrativeEventScale;
  function: string;
}

export interface StoryStructureLens {
  id: StoryStructureLensId;
  label: string;
  description: string;
  bestForSignals: readonly StoryShapeSignal[];
  lessIdealForSignals: readonly StoryShapeSignal[];
  pacingProfile: "linear" | "episodic" | "circular" | "contrast_based" | "investigative" | "romance_route";
  beatAliases: readonly StoryBeatAlias[];
  routeIntegration: readonly string[];
  caution: string;
}

export interface StoryArcMatchInput {
  storySignals: readonly StoryShapeSignal[];
  desiredPacing?: "slow" | "medium" | "fast" | "variable";
  hasExternalPlot?: boolean;
  hasRelationshipRoute?: boolean;
  needsLowConflictStructure?: boolean;
}

export interface StoryArcMatch {
  lens: StoryStructureLens;
  score: number;
  reasons: readonly string[];
  canonicalBeatRoles: readonly CanonicalStoryBeatRole[];
  compactGuidance: string;
}

export const canonicalStoryBeatRoles = [
  "setup",
  "inciting_trigger",
  "threshold_choice",
  "complication",
  "midpoint_reversal",
  "escalation",
  "crisis",
  "climax",
  "resolution",
  "new_equilibrium",
] as const satisfies readonly CanonicalStoryBeatRole[];

export const storyStructureArcPrinciples = [
  "A structure lens should help the writer understand which pressure pattern fits the story, not force every story into one template.",
  "External plot, relationship route, and character growth can use different structures at the same time.",
  "Framework-specific beat names should compile into canonical internal beat roles before reaching the runtime.",
  "Romance and character simulation need earned phase movement more than perfect beat-sheet compliance.",
  "Quiet stories may need contrast, repetition, or emotional reframing instead of large external reversals.",
] as const;

const BASE_BEAT_ALIASES = {
  setup: {
    narrativePhase: "initiation",
    eventScale: "micro_event",
    function:
      "Establish baseline identity, ordinary pressure, relationship position, and what normal currently costs.",
  },
  inciting_trigger: {
    narrativePhase: "initiation",
    eventScale: "environmental_hook",
    function:
      "Introduce the need, invitation, disruption, or problem that makes stillness harder to maintain.",
  },
  threshold_choice: {
    narrativePhase: "development",
    eventScale: "meso_event",
    function:
      "Make the character or relationship commit to movement, even if the commitment is reluctant.",
  },
  complication: {
    narrativePhase: "development",
    eventScale: "meso_event",
    function:
      "Create repeated pressure, adaptation, new information, or friction that changes the pattern.",
  },
  midpoint_reversal: {
    narrativePhase: "escalation",
    eventScale: "meso_event",
    function:
      "Reframe what the story is really about and alter the character's strategy or emotional stakes.",
  },
  escalation: {
    narrativePhase: "escalation",
    eventScale: "major_event",
    function:
      "Raise cost, urgency, conflict, intimacy, or consequence until avoidance stops working.",
  },
  crisis: {
    narrativePhase: "crisis_turning_point",
    eventScale: "major_event",
    function:
      "Force a decision, confession, rupture, revelation, sacrifice, or loss that cannot be cleanly undone.",
  },
  climax: {
    narrativePhase: "crisis_turning_point",
    eventScale: "major_event",
    function:
      "Pay off the central pressure through action, choice, confrontation, or emotional truth.",
  },
  resolution: {
    narrativePhase: "resolution_stabilization",
    eventScale: "soft_interpersonal_event",
    function:
      "Process consequences, name what changed, and settle the immediate route pressure.",
  },
  new_equilibrium: {
    narrativePhase: "resolution_stabilization",
    eventScale: "micro_event",
    function:
      "Show the new normal, next arc seed, relationship identity, or changed internal baseline.",
  },
} as const satisfies Record<
  CanonicalStoryBeatRole,
  {
    narrativePhase: NarrativeArcPhase;
    eventScale: NarrativeEventScale;
    function: string;
  }
>;

export const STORY_STRUCTURE_LENSES = Object.freeze([
  {
    id: "three_act_structure",
    label: "Three Act Structure",
    description:
      "A broad setup, confrontation, and resolution lens for stories with clear external or relationship movement.",
    bestForSignals: [
      "external_adventure",
      "transformation_arc",
      "high_concept_premise",
      "choice_pressure",
    ],
    lessIdealForSignals: ["quiet_slice_of_life", "twist_based"],
    pacingProfile: "linear",
    beatAliases: makeBeatAliases({
      setup: ["setup", "ordinary baseline", "introduce the characters"],
      inciting_trigger: ["inciting incident", "call to change", "problem appears"],
      threshold_choice: ["plot point one", "crossing the threshold", "commitment"],
      complication: ["confrontation", "progressive complications", "tests and allies"],
      midpoint_reversal: ["midpoint", "critical choice", "reframing"],
      escalation: ["pinch point two", "stakes rise", "approach to crisis"],
      crisis: ["plot point two", "ordeal", "all is lost"],
      climax: ["climax", "final attempt", "resurrection"],
      resolution: ["resolution", "return", "solve the problem"],
      new_equilibrium: ["new normal", "return with elixir", "mastery"],
    }),
    routeIntegration: [
      "Use as the default external plot spine when the story has a visible problem to solve.",
      "Overlay romance route phases so emotional commitment does not jump only because the plot advanced.",
    ],
    caution:
      "Too broad on its own; pair it with relationship route or character-growth signals for romantic roleplay.",
  },
  {
    id: "four_act_structure",
    label: "Four Act Structure",
    description:
      "A cleaner split for stories that need setup, adaptation, crisis pressure, and return/reintegration as separate movements.",
    bestForSignals: [
      "relationship_progression",
      "romance_slow_burn",
      "transformation_arc",
      "choice_pressure",
    ],
    lessIdealForSignals: ["quiet_slice_of_life"],
    pacingProfile: "linear",
    beatAliases: makeBeatAliases({
      setup: ["act one", "ordinary world", "baseline"],
      inciting_trigger: ["refusal", "trigger", "need for something"],
      threshold_choice: ["act two", "unfamiliar situation", "commitment"],
      complication: ["searching and adapting", "tests", "surprise"],
      midpoint_reversal: ["critical choice", "midpoint continues", "big change"],
      escalation: ["act three", "paying the price", "consequences"],
      crisis: ["reversal", "road back", "final attempt"],
      climax: ["resurrection", "climax", "capable of change"],
      resolution: ["act four return", "resolution", "rededication"],
      new_equilibrium: ["return with elixir", "mastery", "new normal"],
    }),
    routeIntegration: [
      "Good for slow-burn romance because the middle can hold adaptation and cost as distinct pressures.",
      "Let relationship evidence accumulate before the crisis/return movement.",
    ],
    caution:
      "Can feel mechanically segmented if each act does not change both external pressure and internal belief.",
  },
  {
    id: "hero_journey_structure",
    label: "Hero Journey Structure",
    description:
      "A separation, initiation, and return lens for stories about entering a special world and coming back changed.",
    bestForSignals: ["external_adventure", "transformation_arc", "internal_growth"],
    lessIdealForSignals: ["quiet_slice_of_life", "relationship_progression"],
    pacingProfile: "circular",
    beatAliases: makeBeatAliases({
      setup: ["ordinary world", "limited awareness", "comfort zone"],
      inciting_trigger: ["call to adventure", "trigger", "need for something"],
      threshold_choice: ["crossing the threshold", "committing", "supernatural aid"],
      complication: ["tests allies and enemies", "road of trials", "searching and adapting"],
      midpoint_reversal: ["meeting with the goddess", "temptation", "finding a solution"],
      escalation: ["ordeal", "death and rebirth", "paying the price"],
      crisis: ["refusal of return", "magic flight", "road back"],
      climax: ["resurrection", "master of two worlds", "final attempt"],
      resolution: ["return with the elixir", "freedom to live", "return"],
      new_equilibrium: ["ordinary world changed", "mastery", "capable of change"],
    }),
    routeIntegration: [
      "Use for fantasy, adventure, portal, training, pilgrimage, or life-changing quest arcs.",
      "For romance, map the love interest to relational meaning only when the story actually supports it.",
    ],
    caution:
      "Do not force mentor, goddess, or reward roles onto characters; modernize role language and preserve agency.",
  },
  {
    id: "save_the_cat_structure",
    label: "Save the Cat Structure",
    description:
      "A highly beat-aware lens for commercial pacing, reversals, and clear act turns.",
    bestForSignals: [
      "high_concept_premise",
      "choice_pressure",
      "episodic_complication",
      "external_adventure",
    ],
    lessIdealForSignals: ["quiet_slice_of_life"],
    pacingProfile: "linear",
    beatAliases: makeBeatAliases({
      setup: ["opening image", "theme stated", "setup"],
      inciting_trigger: ["catalyst", "inciting incident"],
      threshold_choice: ["debate", "break into two"],
      complication: ["b story", "fun and games", "promise of the premise"],
      midpoint_reversal: ["midpoint", "false victory", "false defeat"],
      escalation: ["bad guys close in", "stakes tighten"],
      crisis: ["all is lost", "dark night of the soul"],
      climax: ["break into three", "finale", "execution of new plan"],
      resolution: ["final image", "dig deep down", "new plan lands"],
      new_equilibrium: ["changed final image", "new normal", "aftermath"],
    }),
    routeIntegration: [
      "Useful when the writer wants a crisp dashboard of where the story feels stuck.",
      "B-story can map to relationship route, but only as an overlay rather than a subordinate plot by default.",
    ],
    caution:
      "Can over-steer organic roleplay; use it as a pacing diagnostic rather than an automatic beat generator.",
  },
  {
    id: "kishotenketsu_structure",
    label: "Kishotenketsu",
    description:
      "A contrast-based introduction, development, twist, and reconciliation lens that does not require conflict as the primary engine.",
    bestForSignals: ["quiet_slice_of_life", "twist_based", "internal_growth"],
    lessIdealForSignals: ["tragedy_pressure", "external_adventure"],
    pacingProfile: "contrast_based",
    beatAliases: makeBeatAliases({
      setup: ["ki", "introduction", "living fully within identity"],
      inciting_trigger: ["glimpse", "longing", "destiny", "new situation"],
      threshold_choice: ["sho", "development", "moving towards essence"],
      complication: ["development", "complication", "variation"],
      midpoint_reversal: ["ten", "twist", "complication"],
      escalation: ["contrast deepens", "fully committed but growing fear"],
      crisis: ["return or fall", "living one's truth with everything to lose"],
      climax: ["ketsu", "conclusion", "reconciliation"],
      resolution: ["resolution", "reconciliation", "completed journey"],
      new_equilibrium: ["new harmony", "identity integrated", "complete destiny achieved"],
    }),
    routeIntegration: [
      "Strong for cozy, domestic, reflective, and relationship-discovery routes.",
      "Use twist as reframing or contrast, not necessarily betrayal or violence.",
    ],
    caution:
      "If the premise needs urgent external stakes, pair this with an external plot structure.",
  },
  {
    id: "freytag_structure",
    label: "Freytag Structure",
    description:
      "A rise, climax, fall, and catastrophe/resolution lens for tragic, high-consequence, or classical dramatic pressure.",
    bestForSignals: ["tragedy_pressure", "external_adventure", "choice_pressure"],
    lessIdealForSignals: ["romance_slow_burn", "quiet_slice_of_life"],
    pacingProfile: "linear",
    beatAliases: makeBeatAliases({
      setup: ["introduction", "exposition", "proposition"],
      inciting_trigger: ["inciting incident", "complication begins"],
      threshold_choice: ["rise", "first crisis", "argument begins"],
      complication: ["rising action", "second crisis", "epitasis"],
      midpoint_reversal: ["climax", "turning pressure"],
      escalation: ["return or fall", "fourth crisis", "falling action"],
      crisis: ["catastrophe pressure", "final crisis"],
      climax: ["catastrophe", "climax", "final confrontation"],
      resolution: ["denouement", "unravelling", "resolution"],
      new_equilibrium: ["end", "aftermath", "settled consequence"],
    }),
    routeIntegration: [
      "Best when the route needs consequence gravity, tragic pressure, or moral cost.",
      "Use carefully in romance so suffering does not replace emotional development.",
    ],
    caution:
      "High-pressure by nature; not the default for healing-forward or cozy romance.",
  },
  {
    id: "dan_wells_seven_point_structure",
    label: "Seven Point Structure",
    description:
      "A hook-to-resolution lens that emphasizes turns, pinch pressure, midpoint reversal, and final transformation.",
    bestForSignals: [
      "external_adventure",
      "transformation_arc",
      "choice_pressure",
      "high_concept_premise",
    ],
    lessIdealForSignals: ["quiet_slice_of_life"],
    pacingProfile: "linear",
    beatAliases: makeBeatAliases({
      setup: ["hook", "stasis", "starting contrast"],
      inciting_trigger: ["plot turn one", "inciting turn"],
      threshold_choice: ["pinch point one", "pressure starts"],
      complication: ["progress", "drive", "attack by ally"],
      midpoint_reversal: ["midpoint", "reversal", "active pursuit begins"],
      escalation: ["pinch point two", "major setback", "apparent defeat"],
      crisis: ["plot turn two", "gate gauntlet", "decision to death"],
      climax: ["climax", "battle", "self revelation"],
      resolution: ["resolution", "new equilibrium"],
      new_equilibrium: ["better than where they began", "aftermath", "changed self"],
    }),
    routeIntegration: [
      "Useful when matching a character's opening flaw to a final reversed state.",
      "Midpoint should alter agency: the character stops only reacting and starts choosing.",
    ],
    caution:
      "Pinches can become arbitrary pressure unless they emerge from the character's own fears and route gates.",
  },
  {
    id: "scientific_method_structure",
    label: "Scientific Method Structure",
    description:
      "A problem, research, hypothesis, experiment, analysis, and conclusion lens for mysteries, investigations, trials, and learning arcs.",
    bestForSignals: ["mystery_research", "internal_growth", "high_concept_premise"],
    lessIdealForSignals: ["romance_slow_burn", "tragedy_pressure"],
    pacingProfile: "investigative",
    beatAliases: makeBeatAliases({
      setup: ["problem", "premise", "question"],
      inciting_trigger: ["research begins", "deliberation", "questioning"],
      threshold_choice: ["hypothesis", "brave new world", "first test"],
      complication: ["experiment", "harder obstacles", "gaining new skills"],
      midpoint_reversal: ["analysis", "pushed to the limit", "failure"],
      escalation: ["on the run", "off-balance urgency", "new data changes meaning"],
      crisis: ["epiphany", "realization", "recommitment"],
      climax: ["final confrontation", "prove or disprove"],
      resolution: ["conclusion", "denouement"],
      new_equilibrium: ["glimpse of future", "new model", "learned truth"],
    }),
    routeIntegration: [
      "Excellent for detective, scholar, healer, science, therapy, puzzle, or self-knowledge arcs.",
      "Can route emotional growth as revised hypothesis: what belief did the experience disprove?",
    ],
    caution:
      "Do not let analysis replace feeling when the route needs vulnerability or embodied consequence.",
  },
  {
    id: "romance_route_structure",
    label: "Romance Route Structure",
    description:
      "A relationship-first lens that tracks attraction, trust, vulnerability, rupture, repair, choice, and identity.",
    bestForSignals: [
      "relationship_progression",
      "romance_slow_burn",
      "internal_growth",
      "choice_pressure",
    ],
    lessIdealForSignals: ["mystery_research"],
    pacingProfile: "romance_route",
    beatAliases: makeBeatAliases({
      setup: ["initial dynamic", "first meeting", "established baseline"],
      inciting_trigger: ["spark", "forced contact", "curiosity phase"],
      threshold_choice: ["repeated contact", "routine building", "shared task"],
      complication: ["trust testing", "softening", "secret sharing"],
      midpoint_reversal: ["reframing", "enemy to person", "fake to real"],
      escalation: ["mutual pining", "priority shift", "near confession"],
      crisis: ["rupture", "near loss", "truth crisis"],
      climax: ["public choice", "private vow", "confession or escalation"],
      resolution: ["repair", "accountability", "trust rebuilding"],
      new_equilibrium: ["integration", "domestic integration", "relationship identity"],
    }),
    routeIntegration: [
      "Use as the default internal relationship arc beneath any external plot structure.",
      "Best suited to HeartWrite's wound, fear, desire, trigger, response, repair, and payoff chain.",
    ],
    caution:
      "Do not let romance beats erase story truth; separate character truth, lorebook truth, scenario, and runtime memory.",
  },
  {
    id: "relationship_repair_structure",
    label: "Relationship Repair Structure",
    description:
      "A rupture-to-repair lens for stories where the main movement is broken trust, accountability, changed behavior, and renewed safety.",
    bestForSignals: [
      "rupture_repair",
      "relationship_progression",
      "internal_growth",
      "tragedy_pressure",
    ],
    lessIdealForSignals: ["quiet_slice_of_life"],
    pacingProfile: "romance_route",
    beatAliases: makeBeatAliases({
      setup: ["pre-rupture baseline", "what safety used to mean"],
      inciting_trigger: ["rupture", "boundary break", "trust damage"],
      threshold_choice: ["aftermath", "stay or leave pressure"],
      complication: ["accountability attempts", "defensiveness", "evidence gathering"],
      midpoint_reversal: ["honest naming", "new understanding", "harm becomes clear"],
      escalation: ["changed behavior tested", "old pattern returns", "repair pressure"],
      crisis: ["forgiveness gate", "final trust test", "repair or exit choice"],
      climax: ["accountability lands", "boundary respected", "changed behavior proven"],
      resolution: ["trust rebuilding", "new agreement", "repaired pattern"],
      new_equilibrium: ["safer bond", "separation with dignity", "new relationship identity"],
    }),
    routeIntegration: [
      "Best when a conflict beat or rupture type is already active.",
      "Requires visible changed behavior rather than apology-only resolution.",
    ],
    caution:
      "Repair is not guaranteed; the matcher should allow dignified separation when trust cannot be safely restored.",
  },
] as const satisfies readonly StoryStructureLens[]);

export const STORY_STRUCTURE_ARC_MATCH_STANDARD_SEEDS = Object.freeze(
  STORY_STRUCTURE_LENSES.map((lens) =>
    createVocabularySeedPreset({
      seed: lens.id,
      label: lens.label,
      description: lens.description,
      examples: [
        ...lens.routeIntegration,
        lens.caution,
      ],
      tags: [
        "story_structure_arc_match",
        "narrative_structure",
        lens.pacingProfile,
        ...lens.bestForSignals,
      ],
      relatedSeeds: [
        ...lens.bestForSignals,
        ...lens.beatAliases.flatMap((beat) => beat.aliases),
      ],
      oppositeSeeds: lens.lessIdealForSignals,
      romanceHooks: lens.bestForSignals.filter((signal) =>
        /romance|relationship|repair|growth/.test(signal),
      ),
      scenarioHooks: lens.beatAliases.flatMap((beat) => beat.aliases.slice(0, 1)),
      dialoguePatterns: [],
      metadata: {
        rarity: lens.id === "romance_route_structure" ? "common" : "uncommon",
        romanceValue:
          lens.id === "romance_route_structure" ||
          lens.id === "relationship_repair_structure"
            ? 10
            : hasStorySignal(lens.bestForSignals, "relationship_progression")
              ? 8
              : 6,
        conflictPotential:
          hasStorySignal(lens.bestForSignals, "tragedy_pressure") ||
          hasStorySignal(lens.bestForSignals, "choice_pressure")
            ? 9
            : 6,
      },
    }),
  ),
) satisfies readonly VocabularySeedPreset[];

export function matchStoryStructureArc(
  input: StoryArcMatchInput,
): readonly StoryArcMatch[] {
  const signalSet = new Set(input.storySignals);

  return STORY_STRUCTURE_LENSES.map((lens) => {
    const reasons: string[] = [];
    let score = 0;

    for (const signal of input.storySignals) {
      if (hasStorySignal(lens.bestForSignals, signal)) {
        score += 20;
        reasons.push(`Fits ${humanizeStorySignal(signal)}.`);
      }
      if (hasStorySignal(lens.lessIdealForSignals, signal)) {
        score -= 12;
        reasons.push(`Less ideal for ${humanizeStorySignal(signal)}.`);
      }
    }

    if (input.hasRelationshipRoute && lens.pacingProfile === "romance_route") {
      score += 18;
      reasons.push("Designed for relationship-route pressure.");
    }
    if (input.hasExternalPlot && lens.pacingProfile === "linear") {
      score += 10;
      reasons.push("Provides a clear external plot spine.");
    }
    if (input.needsLowConflictStructure && lens.pacingProfile === "contrast_based") {
      score += 18;
      reasons.push("Supports change without requiring conflict as the engine.");
    }
    if (input.desiredPacing === "slow" && lens.id === "romance_route_structure") {
      score += 10;
      reasons.push("Supports earned slow-burn phase movement.");
    }
    if (input.desiredPacing === "fast" && lens.id === "save_the_cat_structure") {
      score += 10;
      reasons.push("Supports sharper commercial pacing.");
    }
    if (
      signalSet.has("mystery_research") &&
      lens.id === "scientific_method_structure"
    ) {
      score += 15;
      reasons.push("Investigation signals map directly to problem-testing beats.");
    }

    return {
      lens,
      score,
      reasons: Array.from(new Set(reasons)),
      canonicalBeatRoles: lens.beatAliases.map((beat) => beat.role),
      compactGuidance: compileStoryStructureMatchGuidance(lens),
    };
  })
    .filter((match) => match.score > 0)
    .sort((first, second) => second.score - first.score);
}

export function getStoryStructureLensById(id: StoryStructureLensId) {
  return STORY_STRUCTURE_LENSES.find((lens) => lens.id === id);
}

export function compileStoryStructureMatchGuidance(lens: StoryStructureLens): string {
  return [
    `${lens.label}: ${lens.description}`,
    `Best fit: ${lens.bestForSignals.map(humanizeStorySignal).join(", ")}.`,
    `Internal beat roles: ${lens.beatAliases.map((beat) => beat.role).join(" -> ")}.`,
    `Runtime rule: compile framework-specific names into canonical beat roles before routing arc phase, event type, relationship beat, or memory updates.`,
    `Caution: ${lens.caution}`,
  ].join(" ");
}

function makeBeatAliases(
  aliasesByRole: Record<CanonicalStoryBeatRole, readonly string[]>,
): readonly StoryBeatAlias[] {
  return canonicalStoryBeatRoles.map((role) => ({
    role,
    aliases: aliasesByRole[role],
    narrativePhase: BASE_BEAT_ALIASES[role].narrativePhase,
    eventScale: BASE_BEAT_ALIASES[role].eventScale,
    function: BASE_BEAT_ALIASES[role].function,
  }));
}

function humanizeStorySignal(signal: StoryShapeSignal) {
  return signal.replace(/_/g, " ");
}

function hasStorySignal(
  signals: readonly StoryShapeSignal[],
  signal: StoryShapeSignal,
) {
  return signals.includes(signal);
}
