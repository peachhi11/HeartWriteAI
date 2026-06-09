import type { RegistryPresetLike } from "./seedPresetRegistry";
import type { VocabularySeedPreset } from "./vocabularySeedTypes";

export type MoralFrameworkVocabularySeed = VocabularySeedPreset;

export interface CompiledMoralFrameworkVocabularySeedAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

export const MORAL_FRAMEWORK_VOCABULARY_CATEGORY =
  "Moral Framework Vocabulary";

export const MORAL_FRAMEWORK_VOCABULARY_SEEDS = Object.freeze([
  {
    seed: "care_ethics",
    label: "Care Ethics",
    description:
      "Believes morality is primarily about reducing suffering, nurturing others, and maintaining healthy relationships.",
    examples: [
      "Protects people even when rules say otherwise.",
      "Prioritises emotional wellbeing over strict fairness.",
      "Sees compassion as a moral responsibility.",
    ],
    tags: ["compassion", "empathy", "caretaking", "healing", "relationships"],
    relatedSeeds: [
      "mercy_ethics",
      "relationship_ethics",
      "protective_morality",
      "redemption_ethics",
    ],
    oppositeSeeds: ["strict_justice", "survival_ethics"],
    romanceHooks: [
      "caretaker_romance",
      "healing_together",
      "protective_partner",
      "comfort_after_conflict",
    ],
    scenarioHooks: [
      "protect_the_vulnerable",
      "care_over_rules",
      "healing_the_enemy",
    ],
    dialoguePatterns: [
      "They're hurting.",
      "Someone has to help.",
      "People matter more than procedures.",
    ],
    metadata: {
      rarity: "common",
      romanceValue: 10,
      conflictPotential: 7,
    },
  },
  {
    seed: "justice_ethics",
    label: "Justice Ethics",
    description:
      "Believes morality centres on fairness, accountability, equality, and impartial treatment.",
    examples: [
      "Refuses favouritism.",
      "Demands accountability regardless of personal feelings.",
      "Protects rights and due process.",
    ],
    tags: ["fairness", "law", "equality", "accountability"],
    relatedSeeds: [
      "truth_ethics",
      "duty_ethics",
      "responsibility_ethics",
    ],
    oppositeSeeds: ["mercy_ethics"],
    romanceHooks: [
      "partners_as_equals",
      "mutual_respect",
      "ethical_rivals",
    ],
    scenarioHooks: [
      "corruption_investigation",
      "wrongful_accusation",
      "justice_vs_mercy",
    ],
    dialoguePatterns: [
      "What's fair?",
      "Actions have consequences.",
      "No one should be above the rules.",
    ],
    metadata: {
      rarity: "common",
      romanceValue: 7,
      conflictPotential: 9,
    },
  },
  {
    seed: "duty_ethics",
    label: "Duty Ethics",
    description:
      "Believes obligations, promises, and responsibilities define moral behaviour regardless of outcomes.",
    examples: [
      "Keeps promises at great personal cost.",
      "Places duty above personal desires.",
      "Fulfils obligations even when painful.",
    ],
    tags: ["duty", "responsibility", "oaths", "honour", "honor"],
    relatedSeeds: [
      "honor_ethics",
      "responsibility_ethics",
      "loyalty_ethics",
    ],
    oppositeSeeds: ["consequentialism"],
    romanceHooks: [
      "duty_vs_love",
      "bodyguard_romance",
      "oath_bound_love",
    ],
    scenarioHooks: [
      "mission_before_desire",
      "oath_conflict",
      "sacrifice_for_duty",
    ],
    dialoguePatterns: [
      "I gave my word.",
      "Duty comes first.",
      "Some promises cannot be broken.",
    ],
    metadata: {
      rarity: "common",
      romanceValue: 8,
      conflictPotential: 10,
    },
  },
  {
    seed: "virtue_ethics",
    label: "Virtue Ethics",
    description:
      "Focuses on becoming a good person rather than simply following rules or pursuing outcomes.",
    examples: [
      "Values courage and wisdom.",
      "Seeks personal growth.",
      "Measures morality through character.",
    ],
    tags: ["character", "growth", "wisdom", "integrity"],
    relatedSeeds: ["honor_ethics", "care_ethics", "balance_ethics"],
    oppositeSeeds: ["survival_ethics"],
    romanceHooks: [
      "mutual_growth",
      "becoming_better_together",
      "respect_before_love",
    ],
    scenarioHooks: [
      "moral_development",
      "coming_of_age",
      "temptation_test",
    ],
    dialoguePatterns: [
      "Who do you want to become?",
      "Character matters.",
      "A good life requires practice.",
    ],
    metadata: {
      rarity: "common",
      romanceValue: 8,
      conflictPotential: 6,
    },
  },
  {
    seed: "consequentialism",
    label: "Consequentialism",
    description:
      "Judges morality primarily through outcomes and overall results rather than intentions or duties.",
    examples: [
      "Accepts difficult sacrifices for the greater good.",
      "Evaluates decisions by their consequences.",
      "Chooses practical solutions when clean choices are unavailable.",
    ],
    tags: ["results", "pragmatism", "utilitarian", "outcomes"],
    relatedSeeds: ["pragmatic_ethics", "harm_reduction_ethics"],
    oppositeSeeds: ["duty_ethics"],
    romanceHooks: [
      "pragmatic_lovers",
      "necessary_sacrifice",
      "hard_choices",
    ],
    scenarioHooks: ["save_many_or_one", "greater_good", "ethical_compromise"],
    dialoguePatterns: [
      "What produces the best outcome?",
      "The result matters.",
      "We don't always get clean choices.",
    ],
    metadata: {
      rarity: "common",
      romanceValue: 6,
      conflictPotential: 10,
    },
  },
  {
    seed: "honor_ethics",
    label: "Honour Ethics",
    description:
      "Believes personal honour, reputation, loyalty, and integrity define moral worth.",
    examples: [
      "Protects reputation and oath.",
      "Cannot tolerate dishonour.",
      "Values dignity and courage.",
    ],
    tags: ["honour", "honor", "reputation", "integrity", "dignity"],
    relatedSeeds: ["duty_ethics", "loyalty_ethics", "virtue_ethics"],
    oppositeSeeds: ["pragmatic_ethics"],
    romanceHooks: [
      "honorable_knight",
      "honourable_knight",
      "courtly_romance",
      "reputation_risk",
    ],
    scenarioHooks: ["duel", "family_honor", "family_honour", "public_scandal"],
    dialoguePatterns: [
      "I will not dishonour myself.",
      "My name means something.",
      "Honour matters.",
    ],
    metadata: {
      rarity: "uncommon",
      romanceValue: 9,
      conflictPotential: 9,
    },
  },
  {
    seed: "mercy_ethics",
    label: "Mercy Ethics",
    description:
      "Believes compassion, forgiveness, and second chances are morally stronger than reflexive punishment.",
    examples: [
      "Spares defeated enemies.",
      "Advocates forgiveness when repair is possible.",
      "Seeks rehabilitation over revenge.",
    ],
    tags: ["mercy", "forgiveness", "redemption", "compassion"],
    relatedSeeds: ["care_ethics", "redemption_ethics"],
    oppositeSeeds: ["justice_ethics"],
    romanceHooks: [
      "forgive_and_heal",
      "redemption_romance",
      "love_after_mistakes",
    ],
    scenarioHooks: ["enemy_spared", "forgiveness_choice", "second_chance"],
    dialoguePatterns: [
      "People deserve another chance.",
      "Mercy is strength.",
      "Punishment is not always justice.",
    ],
    metadata: {
      rarity: "common",
      romanceValue: 10,
      conflictPotential: 8,
    },
  },
  {
    seed: "truth_ethics",
    label: "Truth Ethics",
    description:
      "Believes honesty and truth are moral imperatives, even when the truth is painful.",
    examples: [
      "Refuses deception.",
      "Values transparency.",
      "Prioritises honesty over comfort.",
    ],
    tags: ["truth", "honesty", "transparency", "integrity"],
    relatedSeeds: ["justice_ethics", "responsibility_ethics"],
    oppositeSeeds: ["protective_deception"],
    romanceHooks: [
      "painful_honesty",
      "truth_before_love",
      "confession_arc",
    ],
    scenarioHooks: ["secret_reveal", "truth_vs_loyalty", "exposed_lie"],
    dialoguePatterns: [
      "You deserve the truth.",
      "I won't lie to you.",
      "Truth matters.",
    ],
    metadata: {
      rarity: "common",
      romanceValue: 8,
      conflictPotential: 10,
    },
  },
  {
    seed: "loyalty_ethics",
    label: "Loyalty Ethics",
    description:
      "Believes loyalty to loved ones, family, friends, and community is the highest moral duty.",
    examples: [
      "Protects loved ones first.",
      "Values trust above abstract fairness.",
      "Remains loyal despite hardship.",
    ],
    tags: ["loyalty", "family", "friendship", "devotion"],
    relatedSeeds: ["honor_ethics", "duty_ethics"],
    oppositeSeeds: ["strict_impartiality"],
    romanceHooks: [
      "ride_or_die_romance",
      "devotional_love",
      "us_against_the_world",
    ],
    scenarioHooks: ["family_vs_law", "betrayal", "loyalty_test"],
    dialoguePatterns: [
      "I stand by my people.",
      "Loyalty matters.",
      "I don't abandon those I love.",
    ],
    metadata: {
      rarity: "common",
      romanceValue: 10,
      conflictPotential: 9,
    },
  },
] as const satisfies readonly MoralFrameworkVocabularySeed[]);

export const MORAL_FRAMEWORK_VOCABULARY_REGISTRY_PRESETS = Object.freeze(
  MORAL_FRAMEWORK_VOCABULARY_SEEDS.map(toMoralFrameworkRegistryPreset),
);

export const MORAL_FRAMEWORK_VOCABULARY_TAGS = Object.freeze(
  Array.from(
    new Set(MORAL_FRAMEWORK_VOCABULARY_SEEDS.flatMap((seed) => seed.tags)),
  ).sort(),
);

export function findMoralFrameworkVocabularySeedBySeed(
  seed: string,
): MoralFrameworkVocabularySeed | undefined {
  const normalizedSeed = seed.trim().toLowerCase();
  return MORAL_FRAMEWORK_VOCABULARY_SEEDS.find(
    (preset) => preset.seed.toLowerCase() === normalizedSeed,
  );
}

export function getMoralFrameworkVocabularySeedsByTag(
  tag: string,
): readonly MoralFrameworkVocabularySeed[] {
  const normalizedTag = tag.trim().toLowerCase();
  return MORAL_FRAMEWORK_VOCABULARY_SEEDS.filter((preset) =>
    preset.tags.some((presetTag) => presetTag.toLowerCase() === normalizedTag),
  );
}

export function compileMoralFrameworkVocabularySeedAdditions(
  seed: MoralFrameworkVocabularySeed,
): CompiledMoralFrameworkVocabularySeedAdditions {
  return {
    backgroundAddition: [
      `Moral framework seed: ${seed.label}.`,
      seed.description,
      `Scenario pressure: ${seed.scenarioHooks.join(", ")}.`,
    ].join(" "),
    personalityAddition: [
      `${seed.label} may shape decision pressure, self-justification, attraction, rupture, and repair.`,
      `Examples: ${seed.examples.join(" ")}`,
    ].join(" "),
    systemPromptAddition: [
      `[SOFT MORAL FRAMEWORK GUIDANCE: ${seed.label}]`,
      `Use this as optional ethical texture: ${seed.description}`,
      `It may surface through choices, conflict, dialogue, romance hooks, or scenario hooks when relevant.`,
      `Dialogue cues: ${seed.dialoguePatterns.join(" | ")}`,
      `Do not present this framework as universally correct, force moral certainty, flatten the character into a single ethical rule, or override {{user}} agency.`,
    ].join("\n"),
  };
}

export function compileMoralFrameworkVocabularySeedSummary(
  seed: MoralFrameworkVocabularySeed,
): string {
  return [
    `${seed.label}: ${seed.description}`,
    `Examples: ${seed.examples.join(" ")}`,
    `Related: ${seed.relatedSeeds.join(", ")}.`,
    `Opposite: ${seed.oppositeSeeds.join(", ")}.`,
  ].join("\n");
}

function toMoralFrameworkRegistryPreset(
  seed: MoralFrameworkVocabularySeed,
): RegistryPresetLike {
  const triggerKeys = Array.from(
    new Set([
      seed.seed,
      seed.label,
      ...seed.tags,
      ...seed.relatedSeeds,
      ...seed.oppositeSeeds,
      ...seed.romanceHooks,
      ...seed.scenarioHooks,
      ...seed.dialoguePatterns,
    ]),
  );

  return {
    id: `moral_framework_vocabulary_${seed.seed}`,
    category: MORAL_FRAMEWORK_VOCABULARY_CATEGORY,
    label: seed.label,
    value: seed.label,
    triggerKeys,
    guidance: [
      seed.description,
      `Romance hooks: ${seed.romanceHooks.join(", ")}.`,
      `Conflict potential: ${seed.metadata.conflictPotential}/10.`,
    ].join(" "),
    systemPromptTags: [
      MORAL_FRAMEWORK_VOCABULARY_CATEGORY,
      seed.label,
      ...seed.tags,
    ],
  };
}
