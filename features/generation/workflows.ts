import {
  generateFirstMessageData,
  generateLorebookSummaryData,
  generateLoreEntriesData,
  generateOccupationData,
  generateRelationshipsData,
  generateScenarioData,
  generateSpeciesData,
  generateWorldLorePlaceholders,
  type GeneratedFirstMessageData,
  type GeneratedLorebookSummaryData,
  type GeneratedLoreEntryData,
  type GeneratedOccupationData,
  type GeneratedScenarioData,
  type GeneratedSpeciesData,
  type GeneratedWorldLorePlaceholderData,
  type OccupationProfessionalDomain,
  type SpeciesType,
} from "../../lib/character-card/generator";
import {
  createLorebookV3Document,
  LorebookV3EntrySchema,
  type LorebookV3Document,
} from "../lorebooks/schema";

export type PersonaGenerationInput = {
  name: string;
  archetype: string;
  characteristics: string;
  constructionPrompt?: string;
  pointOfView: string;
  playStyle: string;
  referenceCharacter: string;
  relationshipToCharacter: string;
  emotionalNeed: string;
  boundaries: string;
  tags: string;
};

export type GeneratedPersonaArtifact = {
  id: string;
  name: string;
  summary: string;
  prompt: string;
  tags: string[];
  updatedAt: number;
  source?: "blank" | "generated" | "imported";
};

export type ScenarioGenerationInput = {
  constructionPrompt?: string;
  openingBeat?: string;
  relationshipPressure?: string;
  referenceCharacter?: string;
  referenceLorebook?: string;
  referencePersona?: string;
  settingNotes?: string;
  title: string;
  trope: string;
  jobTitle: string;
  professionalDomain: OccupationProfessionalDomain;
};

export type ScenarioTemplateCategory =
  | "University rivalry"
  | "Arranged marriage"
  | "Mafia protection"
  | "Workplace taboo"
  | "Friends to lovers"
  | "Enemies to lovers"
  | "Roommates to lovers"
  | "Meet cute"
  | "Meet crazy"
  | "Meet ugly";

export type ScenarioTemplate = {
  id: string;
  category: ScenarioTemplateCategory;
  title: string;
  premise: string;
  input: Omit<ScenarioGenerationInput, "constructionPrompt">;
};

export type GeneratedScenarioArtifact = {
  id: string;
  title: string;
  trope: string;
  summary: string;
  tags: string[];
  scenario: GeneratedScenarioData;
  firstMessage: GeneratedFirstMessageData;
  occupation: GeneratedOccupationData;
  updatedAt: number;
  source?: "blank" | "generated" | "imported";
};

export type LorebookGenerationInput = {
  title: string;
  trope: string;
  speciesType: SpeciesType;
  jobTitle: string;
  professionalDomain: OccupationProfessionalDomain;
};

export type GeneratedLorebookArtifact = {
  id: string;
  title: string;
  trope: string;
  summary: GeneratedLorebookSummaryData;
  entries: GeneratedLoreEntryData[];
  placeholders: GeneratedWorldLorePlaceholderData[];
  species: GeneratedSpeciesData;
  occupation: GeneratedOccupationData;
  tags: string[];
  updatedAt: number;
  source?: "blank" | "generated" | "imported";
  v3Document?: LorebookV3Document;
};

export type BundlePersonaSource = {
  id: string;
  name: string;
  prompt?: string;
  summary?: string;
  tags?: string[];
};

export type BundleCharacterSource = {
  file_path?: string;
  filePath?: string;
  framework?: string;
  id: string;
  name: string;
  relationship?: string;
  summary?: string;
  tags?: string[];
};

export type RuntimeScenarioOverride = {
  context: string;
  setting: string;
  scene: string;
  dynamic: string;
};

export type RuntimeBundleArtifact = {
  id: string;
  title: string;
  source?: "created" | "imported";
  character?: {
    filePath: string;
    framework: string;
    id: string;
    name: string;
    relationship: string;
    summary: string;
    tags: string[];
  };
  persona?: {
    id: string;
    name: string;
    summary: string;
    prompt: string;
  };
  scenario?: {
    id: string;
    title: string;
    summary: string;
    openingConstraint: string;
    settingType: string;
    startingTension: string;
  };
  lorebook?: {
    id: string;
    title: string;
    universeAnchor: string;
    summary: string;
    entries: {
      title: string;
      activationKeys: string[];
      content: string;
    }[];
  };
  scenarioOverride?: RuntimeScenarioOverride;
  tags: string[];
  compiledContext: string;
  updatedAt: number;
};

export type RuntimeBundleInput = {
  character?: BundleCharacterSource | null;
  title: string;
  persona?: BundlePersonaSource | null;
  scenario?: GeneratedScenarioArtifact | null;
  lorebook?: GeneratedLorebookArtifact | null;
  scenarioOverride?: Partial<RuntimeScenarioOverride> | null;
};

export const DEFAULT_PERSONA_CONSTRUCTION_PROMPT = [
  "Build a playable {{user}} POV persona for romance roleplay.",
  "Keep the persona lean, user-controlled, emotionally specific, and compatible with the selected character or scenario.",
  "Do not overwrite the user's agency. Do not write their private thoughts, dialogue, consent, or decisions.",
  "Support femPOV, malePOV, anyPOV, and player-character/reader-style persona use without forcing one interpretation.",
  "Prioritize POV, boundaries, relationship role, emotional pressure points, speech posture, and post-history instructions.",
].join("\n");

export const DEFAULT_SCENARIO_CONSTRUCTION_PROMPT = [
  "Build a romance roleplay scenario that gives the selected character and user persona a specific place, pressure, and opening direction.",
  "Keep it playable, sensory, emotionally directional, and easy to edit.",
  "Do not write the user's reply, private thoughts, consent, or choices.",
  "Prioritize scene premise, relationship pressure, opening constraint, sensory anchors, and the first turn's call-to-action.",
].join("\n");

export const SCENARIO_TEMPLATES: ScenarioTemplate[] = [
  {
    category: "University rivalry",
    id: "university_rivalry_scholarship_event",
    input: {
      jobTitle: "University Student",
      openingBeat:
        "Start as the campus event visibly begins falling apart and neither rival can leave without losing the scholarship committee's attention.",
      professionalDomain: "Corporate_Finance",
      relationshipPressure:
        "academic rivalry, forced leadership, public embarrassment, and unwanted mutual competence",
      settingNotes:
        "campus event venue, scholarship committee nearby, broken schedule, rain-soaked arrivals, students watching",
      title: "Scholarship Rivals",
      trope: "University rivalry forced co-leadership",
    },
    premise:
      "Two top students competing for the same scholarship are forced to co-lead a disastrous campus event.",
    title: "Scholarship Rivals",
  },
  {
    category: "University rivalry",
    id: "university_rivalry_scandal",
    input: {
      jobTitle: "University Student",
      openingBeat:
        "Begin just after the cheating accusation goes public, while both characters realize the scandal has been staged to ruin them.",
      professionalDomain: "Arts_Entertainment",
      relationshipPressure:
        "public humiliation, reputation warfare, reluctant alliance, and competitive attraction",
      settingNotes:
        "campus athletic building, debate trophy case, phones buzzing with rumors, witnesses pretending not to stare",
      title: "Scandal Rivals",
      trope: "University rivalry scandal alliance",
    },
    premise:
      "A star athlete and the debate-team president keep humiliating each other publicly until a cheating scandal threatens them both.",
    title: "Scandal Rivals",
  },
  {
    category: "Arranged marriage",
    id: "arranged_marriage_shared_enemy",
    input: {
      jobTitle: "Political Heir",
      openingBeat:
        "Open during the private contract signing, when both realize their separate sabotage plans point toward the same hidden enemy.",
      professionalDomain: "Corporate_Finance",
      relationshipPressure:
        "political obligation, mutual sabotage, dynastic pressure, and dangerous private recognition",
      settingNotes:
        "ancestral estate, contract table, family envoys outside the door, expensive silence, concealed documents",
      title: "Sabotage Vows",
      trope: "Arranged marriage with shared enemy",
    },
    premise:
      "Two heirs agree to a political marriage, each secretly planning to sabotage it, until they discover a shared enemy.",
    title: "Sabotage Vows",
  },
  {
    category: "Arranged marriage",
    id: "arranged_marriage_falling_kingdom",
    input: {
      jobTitle: "Royal Consort",
      openingBeat:
        "Begin after the wedding procession, when the first sign arrives that the kingdom is already collapsing.",
      professionalDomain: "Security_Defense",
      relationshipPressure:
        "alliance marriage, concealed catastrophe, duty, distrust, and battlefield intimacy",
      settingNotes:
        "cold palace chapel, armored guards, war maps hidden beneath ceremonial fabric, bells sounding too early",
      title: "Kingdom in Ruin",
      trope: "Arranged royal marriage under collapse",
    },
    premise:
      "A reluctant royal bride and a disgraced general marry for alliance, but only one knows the kingdom is already falling.",
    title: "Kingdom in Ruin",
  },
  {
    category: "Mafia protection",
    id: "mafia_protection_witness",
    input: {
      jobTitle: "Protected Witness",
      openingBeat:
        "Start when the safehouse door closes and the witness realizes their protector is the mob heir they testified against.",
      professionalDomain: "Underworld",
      relationshipPressure:
        "protection, betrayal history, fear, proximity, debt, and dangerous reluctant trust",
      settingNotes:
        "secure apartment above a closed restaurant, covered windows, burner phones, rain on fire escapes",
      title: "Witness Under Guard",
      trope: "Mafia protection forced proximity",
    },
    premise:
      "A civilian witness is placed under the protection of the mob heir they testified against.",
    title: "Witness Under Guard",
  },
  {
    category: "Mafia protection",
    id: "mafia_protection_nightclub_singer",
    input: {
      jobTitle: "Nightclub Singer",
      openingBeat:
        "Open backstage after the singer recognizes the assassin in the crowd and the crime family has seconds to hide them.",
      professionalDomain: "Underworld",
      relationshipPressure:
        "dangerous concealment, criminal loyalty, performance masks, and intimate survival pressure",
      settingNotes:
        "velvet nightclub, backstage mirror lights, bass through the walls, hidden exits, armed family members",
      title: "Hidden in Plain Sight",
      trope: "Mafia protection nightclub witness",
    },
    premise:
      "A nightclub singer becomes the only person who can identify an assassin, and a crime family hides them in plain sight.",
    title: "Hidden in Plain Sight",
  },
  {
    category: "Workplace taboo",
    id: "workplace_taboo_coverup",
    input: {
      jobTitle: "Ethics Officer",
      openingBeat:
        "Begin when the executive and ethics officer discover the same locked file and realize exposing it would destroy them both.",
      professionalDomain: "Corporate_Finance",
      relationshipPressure:
        "authority tension, moral compromise, corporate danger, and forced confidentiality",
      settingNotes:
        "glass boardroom after hours, locked compliance server, city lights, shredded memos, silent elevators",
      title: "Ethics Breach",
      trope: "Workplace taboo corporate cover-up",
    },
    premise:
      "A ruthless executive and their new ethics officer are trapped in a corporate cover-up neither can expose alone.",
    title: "Ethics Breach",
  },
  {
    category: "Workplace taboo",
    id: "workplace_taboo_merger_sabotage",
    input: {
      jobTitle: "Corporate Strategist",
      openingBeat:
        "Start during the merger presentation when their fake cooperation becomes the only cover for investigating sabotage from above.",
      professionalDomain: "Corporate_Finance",
      relationshipPressure:
        "promotion rivalry, public cooperation, private suspicion, and career-threatening attraction",
      settingNotes:
        "merger war room, executive observers, shared laptop, hostile smiles, documents changing overnight",
      title: "Merger Sabotage",
      trope: "Workplace rivals fake cooperation",
    },
    premise:
      "Two rivals up for the same promotion fake cooperation during a merger, only to uncover sabotage from above.",
    title: "Merger Sabotage",
  },
  {
    category: "Friends to lovers",
    id: "friends_to_lovers_backup_wedding",
    input: {
      jobTitle: "Childhood Friend",
      openingBeat:
        "Open after the engagement announcement, when the old backup pact is mentioned too casually to be harmless.",
      professionalDomain: "Arts_Entertainment",
      relationshipPressure:
        "old promises, jealousy, emotional denial, loyalty, and fear of being too late",
      settingNotes:
        "engagement party kitchen, half-finished toast, familiar family photos, private hallway away from guests",
      title: "The Backup Pact",
      trope: "Friends to lovers wedding pact",
    },
    premise:
      "Two childhood friends make a pact to be each other's wedding backup, then one gets engaged.",
    title: "The Backup Pact",
  },
  {
    category: "Friends to lovers",
    id: "friends_to_lovers_flirting_lesson",
    input: {
      jobTitle: "Best Friend",
      openingBeat:
        "Begin at the first flirting lesson, when the practice suddenly stops feeling like practice.",
      professionalDomain: "Arts_Entertainment",
      relationshipPressure:
        "friendship intimacy, playful teaching, hidden longing, and accidental emotional exposure",
      settingNotes:
        "quiet apartment, couch cushions, mock date setup, takeout containers, too much eye contact",
      title: "Practice Date",
      trope: "Friends to lovers flirting lesson",
    },
    premise:
      "A best friend agrees to teach the other how to flirt, not realizing they are the real object of affection.",
    title: "Practice Date",
  },
  {
    category: "Enemies to lovers",
    id: "enemies_to_lovers_chained_escape",
    input: {
      jobTitle: "Bounty Hunter",
      openingBeat:
        "Start immediately after the prison break, with the chain still locked and pursuit closing in.",
      professionalDomain: "Security_Defense",
      relationshipPressure:
        "physical tethering, distrust, survival, mutual competence, and forced bodily coordination",
      settingNotes:
        "storm drain outside a prison, alarms, mud, bruised wrists, searchlights sweeping closer",
      title: "Chained Escape",
      trope: "Enemies to lovers chained together",
    },
    premise:
      "A bounty hunter and a fugitive are chained together after a prison break.",
    title: "Chained Escape",
  },
  {
    category: "Enemies to lovers",
    id: "enemies_to_lovers_spy_marriage",
    input: {
      jobTitle: "Field Spy",
      openingBeat:
        "Open as their fake marriage papers are approved at the border and the enemy checkpoint asks them to prove the act.",
      professionalDomain: "Security_Defense",
      relationshipPressure:
        "assassination orders, false intimacy, enemy territory, performance pressure, and lethal attraction",
      settingNotes:
        "foreign checkpoint, forged rings, cold passports, listening devices, one shared hotel room ahead",
      title: "Married to the Target",
      trope: "Enemy spies fake marriage",
    },
    premise:
      "Two rival spies assigned to kill each other must pretend to be married to survive enemy territory.",
    title: "Married to the Target",
  },
  {
    category: "Roommates to lovers",
    id: "roommates_to_lovers_novelist",
    input: {
      jobTitle: "Graduate Student",
      openingBeat:
        "Begin when the student finds a draft scene that is unmistakably about them, written by the reclusive novelist downstairs.",
      professionalDomain: "Arts_Entertainment",
      relationshipPressure:
        "domestic proximity, creative obsession, privacy boundaries, and being seen too accurately",
      settingNotes:
        "old rental house, thin walls, manuscript pages, midnight kettle, rain at the windows",
      title: "The Draft Upstairs",
      trope: "Roommates to lovers novelist muse",
    },
    premise:
      "A broke grad student rents a room from a reclusive novelist and starts appearing in their drafts.",
    title: "The Draft Upstairs",
  },
  {
    category: "Roommates to lovers",
    id: "roommates_to_lovers_exes_lease",
    input: {
      jobTitle: "Reluctant Roommate",
      openingBeat:
        "Open on move-in day, when both exes realize the lease is legally airtight and neither will surrender first.",
      professionalDomain: "Arts_Entertainment",
      relationshipPressure:
        "unfinished history, domestic warfare, pride, shared space, and unwanted familiarity",
      settingNotes:
        "small apartment, stacked boxes, one broken elevator, duplicate keys, old arguments in every room",
      title: "Same Lease",
      trope: "Roommates to lovers exes forced proximity",
    },
    premise:
      "Two exes accidentally sign the same lease and refuse to move out first.",
    title: "Same Lease",
  },
  {
    category: "Meet cute",
    id: "meet_cute_obscure_book",
    input: {
      jobTitle: "Bookstore Regular",
      openingBeat:
        "Start with both hands landing on the last copy and neither person letting go.",
      professionalDomain: "Arts_Entertainment",
      relationshipPressure:
        "instant banter, intellectual rivalry, curiosity, and playful refusal to yield",
      settingNotes:
        "independent bookshop, narrow aisle, rain outside, rare edition shelf, amused cashier nearby",
      title: "The Last Copy",
      trope: "Meet cute bookshop rivalry",
    },
    premise:
      "They both reach for the last copy of the same obscure book and spend the day arguing over who needs it more.",
    title: "The Last Copy",
  },
  {
    category: "Meet cute",
    id: "meet_cute_lost_dog",
    input: {
      jobTitle: "Neighbor",
      openingBeat:
        "Begin with the runaway dog proudly arriving again, forcing the owner and stranger into another doorstep conversation.",
      professionalDomain: "Arts_Entertainment",
      relationshipPressure:
        "gentle repetition, neighborly curiosity, accidental routine, and low-stakes vulnerability",
      settingNotes:
        "apartment doorway, muddy pawprints, dog leash, sunset hallway light, familiar embarrassed apology",
      title: "Runaway Matchmaker",
      trope: "Meet cute runaway dog",
    },
    premise:
      "A lost dog keeps escaping one owner's yard and showing up at the same stranger's apartment.",
    title: "Runaway Matchmaker",
  },
  {
    category: "Meet crazy",
    id: "meet_crazy_bank_robbery",
    input: {
      jobTitle: "Dangerous Stranger",
      openingBeat:
        "Open during the robbery, when both characters clock each other as far more dangerous than the robbers.",
      professionalDomain: "Underworld",
      relationshipPressure:
        "concealed competence, adrenaline, mutual suspicion, and attraction under threat",
      settingNotes:
        "bank lobby, alarms, dropped cash, masked robbers shouting, two strangers staying too calm",
      title: "Wrong Hostage",
      trope: "Meet crazy bank robbery",
    },
    premise:
      "They meet during a bank robbery, both pretending not to be the most dangerous person in the room.",
    title: "Wrong Hostage",
  },
  {
    category: "Meet crazy",
    id: "meet_crazy_trunk",
    input: {
      jobTitle: "Kidnapping Victim",
      openingBeat:
        "Start in the trunk, with both strangers tied up and accusing each other before the car stops.",
      professionalDomain: "Underworld",
      relationshipPressure:
        "panic, suspicion, absurd intimacy, survival strategy, and immediate forced trust",
      settingNotes:
        "dark car trunk, muffled road noise, zip ties, stale carpet, brake lights through metal seams",
      title: "Same Trunk",
      trope: "Meet crazy mistaken kidnapping",
    },
    premise:
      "A mistaken kidnapping puts two strangers in the same trunk, each convinced the other is involved.",
    title: "Same Trunk",
  },
  {
    category: "Meet ugly",
    id: "meet_ugly_prototype_coffee",
    input: {
      jobTitle: "Product Designer",
      openingBeat:
        "Begin seconds after the coffee hits the prototype, with the presentation room already filling outside.",
      professionalDomain: "Corporate_Finance",
      relationshipPressure:
        "career damage, outrage, forced repair, public stakes, and unwilling dependence",
      settingNotes:
        "conference prep room, ruined prototype, coffee smell, countdown timer, executives outside",
      title: "Prototype Disaster",
      trope: "Meet ugly career sabotage accident",
    },
    premise:
      "One ruins the other's career-making presentation by spilling coffee on the only prototype.",
    title: "Prototype Disaster",
  },
  {
    category: "Meet ugly",
    id: "meet_ugly_parking_wedding",
    input: {
      jobTitle: "Wedding Guest",
      openingBeat:
        "Open at the reception table assignment, moments after the parking-lot screaming match.",
      professionalDomain: "Arts_Entertainment",
      relationshipPressure:
        "bad first impression, social confinement, public politeness, and escalating irritation",
      settingNotes:
        "wedding reception, assigned seats, champagne flutes, family watching, one empty chair between them",
      title: "Parking Spot Wedding",
      trope: "Meet ugly wedding seating disaster",
    },
    premise:
      "They get into a screaming match over a parking spot, then discover they are seated together at a wedding.",
    title: "Parking Spot Wedding",
  },
];

export function generatePersonaArtifact(
  input: PersonaGenerationInput,
): GeneratedPersonaArtifact {
  const name = input.name.trim() || "New Persona";
  const tags = normalizeTags(
    `${input.tags}, ${input.pointOfView}, ${input.playStyle}, ${input.archetype}, ${input.relationshipToCharacter}`,
  );
  const characteristics = input.characteristics.trim() ||
    "emotionally observant, consent-aware, and responsive to character tone";
  const referenceCharacter = input.referenceCharacter.trim();
  const relationshipToCharacter = input.relationshipToCharacter.trim() ||
    "romantic lead / user-controlled counterpart";
  const emotionalNeed = input.emotionalNeed.trim() ||
    "to feel emotionally respected without having their agency overwritten";
  const boundaries = input.boundaries.trim() ||
    "Do not write this persona's thoughts, dialogue, or decisions for them.";
  const summary = [
    `${name} is a ${input.pointOfView} persona built for ${input.playStyle.toLowerCase()}.`,
    `They are shaped as ${relationshipToCharacter.toLowerCase()}.`,
    `Their roleplay pressure point is ${emotionalNeed}.`,
  ].join(" ");
  const prompt = [
    `USER PERSONA: ${name}`,
    `Archetype: ${input.archetype}`,
    `POV: ${input.pointOfView}`,
    `Play style: ${input.playStyle}`,
    `Desired characteristics: ${characteristics}`,
    `Relationship role: ${relationshipToCharacter}`,
    referenceCharacter ? `Matched character/context: ${referenceCharacter}` : "",
    `Core emotional need: ${emotionalNeed}`,
    `Boundaries: ${boundaries}`,
    "Runtime rule: treat this persona as user-controlled. Never narrate their private thoughts, unstated feelings, dialogue, choices, or consent.",
  ].filter(Boolean).join("\n");

  return {
    id: createArtifactId("persona", name),
    name,
    prompt,
    summary,
    tags,
    updatedAt: Date.now(),
    source: "generated",
  };
}

export function compilePersonaConstructionPrompt(input: PersonaGenerationInput) {
  const constructionPrompt = input.constructionPrompt?.trim() ||
    DEFAULT_PERSONA_CONSTRUCTION_PROMPT;

  return [
    constructionPrompt,
    "",
    "[PERSONA INGREDIENTS]",
    `Name: ${input.name.trim() || "New Persona"}`,
    `Archetype: ${input.archetype.trim() || "Unspecified"}`,
    `POV: ${input.pointOfView}`,
    `Play style: ${input.playStyle}`,
    `Desired characteristics: ${input.characteristics.trim() || "Unspecified"}`,
    `Relationship role: ${input.relationshipToCharacter.trim() || "Unspecified"}`,
    `Matched character/context: ${input.referenceCharacter.trim() || "None provided"}`,
    `Core emotional need: ${input.emotionalNeed.trim() || "Unspecified"}`,
    `Boundaries: ${input.boundaries.trim() || "Use default agency-safe boundaries"}`,
    `Tags: ${input.tags.trim() || "None"}`,
    "",
    "[OUTPUT REQUIREMENTS]",
    "Return a concise editable persona artifact with summary, tags, and runtime prompt text.",
  ].join("\n");
}

export function createBlankPersonaArtifact(
  name = "Untitled Persona",
): GeneratedPersonaArtifact {
  return createPersonaArtifactFromEditable({
    id: createArtifactId("persona", `${name}:blank`),
    name,
    prompt: [
      `USER PERSONA: ${name}`,
      "POV: AnyPOV",
      "Play style: Story roleplay",
      "Boundaries: Do not write this persona's thoughts, dialogue, decisions, consent, or hidden feelings.",
      "Runtime rule: treat this persona as user-controlled. Never narrate their private thoughts, unstated feelings, dialogue, choices, or consent.",
    ].join("\n"),
    source: "blank",
    summary: "A blank editable user persona draft.",
    tags: ["blank", "persona"],
  });
}

export function createImportedPersonaArtifact(
  value: unknown,
  sourceFileName?: string,
): GeneratedPersonaArtifact {
  if (!isRecord(value)) {
    throw new Error("Persona JSON must be an object.");
  }

  const fileNameTitle = sourceFileName?.replace(/\.json$/i, "").trim();
  const name = readUnknownString(value.name) ||
    readUnknownString(value.title) ||
    fileNameTitle ||
    "Imported Persona";
  const prompt = readUnknownString(value.prompt) ||
    readUnknownString(value.content) ||
    `USER PERSONA: ${name}`;
  const summary = readUnknownString(value.summary) ||
    readUnknownString(value.description) ||
    `${name} is an imported user persona.`;

  return createPersonaArtifactFromEditable({
    id: readUnknownString(value.id) ||
      createArtifactId("persona", `${name}:${sourceFileName ?? "imported"}`),
    name,
    prompt,
    source: "imported",
    summary,
    tags: normalizeTagsFromUnknown(value.tags),
    updatedAt: readUnknownNumber(value.updatedAt) ?? Date.now(),
  });
}

export function createPersonaArtifactFromEditable(input: {
  id: string;
  name: string;
  prompt: string;
  source?: GeneratedPersonaArtifact["source"];
  summary: string;
  tags: string[] | string;
  updatedAt?: number;
}): GeneratedPersonaArtifact {
  const name = input.name.trim() || "Untitled Persona";
  const prompt = input.prompt.trim() || `USER PERSONA: ${name}`;
  const summary = input.summary.trim() || `${name} is a saved user persona.`;

  return {
    id: input.id,
    name,
    prompt,
    source: input.source,
    summary,
    tags: Array.isArray(input.tags)
      ? normalizeTags(input.tags.join(", "))
      : normalizeTags(input.tags),
    updatedAt: input.updatedAt ?? Date.now(),
  };
}

export function generateScenarioArtifact(
  input: ScenarioGenerationInput,
): GeneratedScenarioArtifact {
  const trope = input.trope.trim() || "Slow burn romance";
  const occupation = generateOccupationData({
    jobTitle: input.jobTitle.trim() || undefined,
    professionalDomain: input.professionalDomain,
    trope,
  });
  const scenario = generateScenarioData(trope, occupation);
  const firstMessage = generateFirstMessageData(trope, scenario);
  const title = input.title.trim() || humanize(scenario.plotHook);
  const settingNotes = input.settingNotes?.trim();
  const relationshipPressure = input.relationshipPressure?.trim();
  const openingBeat = input.openingBeat?.trim();
  const referenceContext = buildScenarioReferenceContext(input);
  const scenePremiseDescription = [
    scenario.scenePremiseDescription,
    settingNotes ? `Setting notes: ${settingNotes}` : "",
    relationshipPressure ? `Relationship pressure: ${relationshipPressure}` : "",
    referenceContext ? `Workbench context: ${referenceContext}` : "",
  ].filter(Boolean).join(" ");
  const aiOutputConstraint = [
    firstMessage.aiOutputConstraint,
    openingBeat ? `Opening beat: ${openingBeat}` : "",
  ].filter(Boolean).join(" ");

  return {
    firstMessage: {
      ...firstMessage,
      aiOutputConstraint,
    },
    id: createArtifactId("scenario", `${title}:${trope}`),
    occupation,
    scenario: {
      ...scenario,
      scenePremiseDescription,
    },
    summary: scenePremiseDescription,
    tags: normalizeTags(`${trope}, ${scenario.settingType}, ${scenario.startingTension}, ${relationshipPressure ?? ""}`),
    title,
    trope,
    updatedAt: Date.now(),
    source: "generated",
  };
}

export function createScenarioInputFromTemplate(
  templateId: string,
  previousInput?: Partial<ScenarioGenerationInput>,
): ScenarioGenerationInput {
  const template = getScenarioTemplate(templateId);
  if (!template) {
    throw new Error(`Scenario template "${templateId}" was not found.`);
  }

  return {
    ...template.input,
    constructionPrompt: previousInput?.constructionPrompt ??
      DEFAULT_SCENARIO_CONSTRUCTION_PROMPT,
    referenceCharacter: previousInput?.referenceCharacter,
    referenceLorebook: previousInput?.referenceLorebook,
    referencePersona: previousInput?.referencePersona,
  };
}

export function getScenarioTemplate(templateId: string) {
  return SCENARIO_TEMPLATES.find((template) => template.id === templateId);
}

export function getScenarioTemplateCategories(): ScenarioTemplateCategory[] {
  return Array.from(
    new Set(SCENARIO_TEMPLATES.map((template) => template.category)),
  );
}

export function createBlankScenarioArtifact(
  title = "Untitled Scenario",
): GeneratedScenarioArtifact {
  const occupation = generateOccupationData({
    jobTitle: "Roleplay Setting",
    professionalDomain: "Arts_Entertainment",
    trope: "blank scenario",
  });

  return createScenarioArtifactFromEditable({
    firstMessage: {
      aiOutputConstraint:
        "Open with {{char}} reacting to the immediate scene pressure while leaving {{user}} fully free to respond.",
      entryPoint: "The_Approach",
      literaryStyle: "Action_Dialogue_Hybrid",
      tokenLengthCap: 450,
      userCallToAction: "Direct_Question",
    },
    id: createArtifactId("scenario", `${title}:blank`),
    occupation,
    scenario: {
      plotHook: "The_Chance_Encounter",
      scenePremiseDescription:
        "Write the core scene premise here, including where {{char}} and {{user}} are, why the moment matters, and what pressure keeps the exchange alive.",
      sensoryDetails: ["ambient sound", "lighting", "physical distance"],
      settingType: "Public_HighExposure",
      startingTension: "Charged_Electric",
    },
    source: "blank",
    summary:
      "Write the core scene premise here, including where {{char}} and {{user}} are, why the moment matters, and what pressure keeps the exchange alive.",
    tags: ["blank", "scenario"],
    title,
    trope: "Blank scenario",
  });
}

export function createImportedScenarioArtifact(
  value: unknown,
  sourceFileName?: string,
): GeneratedScenarioArtifact {
  if (!isRecord(value)) {
    throw new Error("Scenario JSON must be an object.");
  }

  const fallback = createBlankScenarioArtifact(
    readUnknownString(value.title) ||
      sourceFileName?.replace(/\.json$/i, "").trim() ||
      "Imported Scenario",
  );
  const scenario = isRecord(value.scenario) ? value.scenario : {};
  const firstMessage = isRecord(value.firstMessage) ? value.firstMessage : {};
  const title = readUnknownString(value.title) || fallback.title;
  const summary = readUnknownString(value.summary) ||
    readUnknownString(scenario.scenePremiseDescription) ||
    fallback.summary;

  return createScenarioArtifactFromEditable({
    firstMessage: {
      ...fallback.firstMessage,
      aiOutputConstraint:
        readUnknownString(firstMessage.aiOutputConstraint) ||
        fallback.firstMessage.aiOutputConstraint,
      entryPoint: readKnownValue(
        firstMessage.entryPoint,
        ["Active_Collision", "Mid_Action_Dialogue", "Post_Crisis_Quiet", "The_Approach"] as const,
        fallback.firstMessage.entryPoint,
      ),
      literaryStyle: readKnownValue(
        firstMessage.literaryStyle,
        ["Action_Dialogue_Hybrid", "Chat_Symphonic", "Internal_Monologue_Heavy", "Novella_Prose"] as const,
        fallback.firstMessage.literaryStyle,
      ),
      tokenLengthCap:
        readUnknownNumber(firstMessage.tokenLengthCap) ??
        fallback.firstMessage.tokenLengthCap,
      userCallToAction: readKnownValue(
        firstMessage.userCallToAction,
        ["Direct_Question", "Physical_Gesture", "Vulnerable_Slip", "Weighted_StandOff"] as const,
        fallback.firstMessage.userCallToAction,
      ),
    },
    id: readUnknownString(value.id) ||
      createArtifactId("scenario", `${title}:${sourceFileName ?? "imported"}`),
    occupation: fallback.occupation,
    scenario: {
      ...fallback.scenario,
      plotHook: readKnownValue(
        scenario.plotHook,
        ["The_Chance_Encounter", "The_Crisis", "The_Mandate", "The_Secret_Transaction"] as const,
        fallback.scenario.plotHook,
      ),
      scenePremiseDescription: summary,
      sensoryDetails: Array.isArray(scenario.sensoryDetails)
        ? scenario.sensoryDetails
            .map((detail) => readUnknownString(detail))
            .filter(Boolean)
            .slice(0, 8)
        : fallback.scenario.sensoryDetails,
      settingType: readKnownValue(
        scenario.settingType,
        ["Atmospheric_Wilderness", "Contained_Insular", "Corporate_Institutional", "Public_HighExposure"] as const,
        fallback.scenario.settingType,
      ),
      startingTension: readKnownValue(
        scenario.startingTension,
        ["Charged_Electric", "Combative_Friction", "Formal_Chilling", "Vulnerable_Exhausted"] as const,
        fallback.scenario.startingTension,
      ),
    },
    source: "imported",
    summary,
    tags: normalizeTagsFromUnknown(value.tags),
    title,
    trope: readUnknownString(value.trope) || "Imported scenario",
    updatedAt: readUnknownNumber(value.updatedAt) ?? Date.now(),
  });
}

export function createScenarioArtifactFromEditable(input: {
  firstMessage: GeneratedFirstMessageData;
  id: string;
  occupation: GeneratedOccupationData;
  scenario: GeneratedScenarioData;
  source?: GeneratedScenarioArtifact["source"];
  summary: string;
  tags: string[] | string;
  title: string;
  trope: string;
  updatedAt?: number;
}): GeneratedScenarioArtifact {
  const title = input.title.trim() || "Untitled Scenario";
  const summary = input.summary.trim() ||
    input.scenario.scenePremiseDescription.trim() ||
    "Untitled scenario premise.";
  const trope = input.trope.trim() || "Custom scenario";

  return {
    firstMessage: {
      ...input.firstMessage,
      aiOutputConstraint:
        input.firstMessage.aiOutputConstraint.trim() ||
        "Open the scene without writing {{user}}'s reply, choices, or internal state.",
      tokenLengthCap: Math.max(
        120,
        Math.min(1200, Math.round(input.firstMessage.tokenLengthCap)),
      ),
    },
    id: input.id,
    occupation: input.occupation,
    scenario: {
      ...input.scenario,
      scenePremiseDescription: summary,
      sensoryDetails: input.scenario.sensoryDetails
        .map((detail) => detail.trim())
        .filter(Boolean)
        .slice(0, 8),
    },
    source: input.source,
    summary,
    tags: Array.isArray(input.tags)
      ? normalizeTags(input.tags.join(", "))
      : normalizeTags(input.tags),
    title,
    trope,
    updatedAt: input.updatedAt ?? Date.now(),
  };
}

export function compileScenarioConstructionPrompt(input: ScenarioGenerationInput) {
  const constructionPrompt = input.constructionPrompt?.trim() ||
    DEFAULT_SCENARIO_CONSTRUCTION_PROMPT;

  return [
    constructionPrompt,
    "",
    "[SCENARIO INGREDIENTS]",
    `Title: ${input.title.trim() || "Untitled Scenario"}`,
    `Trope / route pressure: ${input.trope.trim() || "Unspecified"}`,
    `Occupation / role: ${input.jobTitle.trim() || "Unspecified"}`,
    `Professional domain: ${input.professionalDomain.replaceAll("_", " ")}`,
    `Setting notes: ${input.settingNotes?.trim() || "Unspecified"}`,
    `Relationship pressure: ${input.relationshipPressure?.trim() || "Unspecified"}`,
    `Opening beat: ${input.openingBeat?.trim() || "Unspecified"}`,
    `Saved character context: ${input.referenceCharacter?.trim() || "None selected"}`,
    `Saved persona context: ${input.referencePersona?.trim() || "None selected"}`,
    `Saved lorebook context: ${input.referenceLorebook?.trim() || "None selected"}`,
    "",
    "[OUTPUT REQUIREMENTS]",
    "Return a concise editable scenario artifact with scene premise, sensory anchors, opening constraint, tags, and runtime shape.",
    "Never assign {{user}} dialogue, internal thoughts, choices, or consent.",
  ].join("\n");
}

export function generateLorebookArtifact(
  input: LorebookGenerationInput,
): GeneratedLorebookArtifact {
  const trope = input.trope.trim() || "Contemporary romance";
  const species = generateSpeciesData(input.speciesType);
  const occupation = generateOccupationData({
    jobTitle: input.jobTitle.trim() || undefined,
    professionalDomain: input.professionalDomain,
    trope,
  });
  const relationships = generateRelationshipsData(trope);
  const summary = generateLorebookSummaryData(
    trope,
    species,
    occupation,
    relationships,
  );
  const placeholders = generateWorldLorePlaceholders(
    trope,
    species,
    occupation,
    summary,
  );
  const entries = generateLoreEntriesData(
    trope,
    species,
    occupation,
    relationships,
    summary,
    placeholders,
  );
  const title = input.title.trim() || summary.universeAnchor;

  return {
    entries,
    id: createArtifactId("lorebook", `${title}:${trope}`),
    occupation,
    placeholders,
    species,
    summary,
    tags: normalizeTags(`${trope}, ${species.type}, ${summary.universeAnchor}`),
    title,
    trope,
    updatedAt: Date.now(),
    source: "generated",
  };
}

export function generateSuggestedLorebookFromScenario(
  scenario: GeneratedScenarioArtifact,
  options: Partial<Pick<LorebookGenerationInput, "professionalDomain" | "speciesType">> = {},
): GeneratedLorebookArtifact {
  const professionalDomain = options.professionalDomain ??
    readProfessionalDomainFromOccupation(scenario.occupation);
  const speciesType = options.speciesType ?? "Human";
  const lorebook = generateLorebookArtifact({
    jobTitle: scenario.occupation.jobTitle,
    professionalDomain,
    speciesType,
    title: `${scenario.title} Lore`,
    trope: scenario.trope,
  });

  return {
    ...lorebook,
    summary: {
      ...lorebook.summary,
      aiLoreInstruction: [
        lorebook.summary.aiLoreInstruction,
        `Scenario bridge: ${scenario.summary}`,
        `Opening constraint: ${scenario.firstMessage.aiOutputConstraint}`,
      ].join("\n"),
      universeAnchor: `${scenario.title} Lore`,
    },
    tags: normalizeTags(
      [
        ...lorebook.tags,
        "suggested lore",
        "scenario bridge",
        scenario.title,
      ].join(", "),
    ),
    title: `${scenario.title} Lore`,
    updatedAt: Date.now(),
  };
}

export function createBlankLorebookArtifact(
  title = "Untitled Lorebook",
): GeneratedLorebookArtifact {
  const document = createLorebookV3Document({
    description: "A small modular lorebook draft.",
    entries: [
      LorebookV3EntrySchema.parse({
        content: "Write one focused lore rule, fact, relationship, location, or runtime cue here.",
        enabled: true,
        id: `entry_${Date.now().toString(36)}`,
        insertion_order: 0,
        keys: ["new trigger"],
        name: "New lore entry",
        use_regex: false,
      }),
    ],
    extensions: {
      heartwriteai: {
        source: "blank_lorebook",
      },
    },
    name: title,
    recursive_scanning: false,
    scan_depth: 3,
    token_budget: 600,
  });

  return createLorebookArtifactFromV3Document({
    document,
    id: createArtifactId("lorebook", `${title}:blank`),
    source: "blank",
  });
}

export function createImportedLorebookArtifact(
  document: LorebookV3Document,
  sourceFileName?: string,
): GeneratedLorebookArtifact {
  return createLorebookArtifactFromV3Document({
    document,
    id: createArtifactId(
      "lorebook",
      `${document.data.name ?? sourceFileName ?? "imported"}:${sourceFileName ?? "imported"}`,
    ),
    source: "imported",
    sourceFileName,
  });
}

export function createLorebookArtifactFromV3Document(input: {
  document: LorebookV3Document;
  id: string;
  source: NonNullable<GeneratedLorebookArtifact["source"]>;
  sourceFileName?: string;
}): GeneratedLorebookArtifact {
  const { document } = input;
  const title = document.data.name?.trim() ||
    input.sourceFileName?.replace(/\.json$/i, "").trim() ||
    "Untitled Lorebook";
  const description = document.data.description?.trim() ||
    `Imported lorebook with ${document.data.entries.length} entries.`;
  const species = generateSpeciesData("Human");
  const occupation = generateOccupationData({
    jobTitle: "Lorebook",
    professionalDomain: "Arts_Entertainment",
    trope: `${input.source} lorebook`,
  });
  const tags = normalizeTags(
    [
      input.source,
      "lorebook",
      input.sourceFileName?.replace(/\.json$/i, ""),
      ...document.data.entries.flatMap((entry) => entry.keys.slice(0, 2)),
    ]
      .filter(Boolean)
      .join(", "),
  );

  return {
    entries: document.data.entries.map((entry, index) => ({
      activationKeys: entry.keys,
      domainScope: "Societal_Customs",
      entryContent: entry.content,
      entryId: String(entry.id ?? `imported_${index + 1}`),
      insertionPriority: entry.constant
        ? "Constant_Anchor"
        : entry.selective
          ? "Recursive_Linked"
          : "Reactive_Contextual",
      title: entry.name ?? entry.comment ?? `Entry ${index + 1}`,
      tokenReserveCost: Math.max(25, Math.ceil(entry.content.length / 4)),
    })),
    id: input.id,
    occupation,
    placeholders: [],
    species,
    summary: {
      aiLoreInstruction: description,
      factionOrDynastyContext: description,
      tokenOptimizationCap: document.data.token_budget ?? 1200,
      universeAnchor: title,
      worldSystemRules: document.data.entries
        .slice(0, 4)
        .map((entry) => entry.name ?? entry.comment ?? String(entry.id ?? "Lore entry")),
    },
    tags,
    title,
    trope: `${input.source} lorebook`,
    updatedAt: Date.now(),
    source: input.source,
    v3Document: document,
  };
}

export function createRuntimeBundleArtifact(
  input: RuntimeBundleInput,
): RuntimeBundleArtifact {
  const character = input.character
    ? {
        filePath: input.character.filePath ?? input.character.file_path ?? "",
        framework: input.character.framework?.trim() || "Character card",
        id: input.character.id,
        name: input.character.name.trim() || "Untitled character",
        relationship:
          input.character.relationship?.trim() || "Unspecified dynamic",
        summary: input.character.summary?.trim() ||
          `${input.character.name} is the selected character card.`,
        tags: normalizeTagList(input.character.tags ?? []),
      }
    : undefined;
  const persona = input.persona
    ? {
        id: input.persona.id,
        name: input.persona.name,
        prompt: input.persona.prompt?.trim() ||
          `USER PERSONA: ${input.persona.name}`,
        summary: input.persona.summary?.trim() ||
          `${input.persona.name} is the selected user persona.`,
      }
    : undefined;
  const scenario = input.scenario
    ? {
        id: input.scenario.id,
        openingConstraint: input.scenario.firstMessage.aiOutputConstraint,
        settingType: input.scenario.scenario.settingType,
        startingTension: input.scenario.scenario.startingTension,
        summary: input.scenario.summary,
        title: input.scenario.title,
      }
    : undefined;
  const lorebook = input.lorebook
    ? {
        entries: input.lorebook.v3Document
          ? input.lorebook.v3Document.data.entries.map((entry) => ({
              activationKeys: entry.keys,
              content: entry.content,
              title: entry.name ?? String(entry.id ?? "Untitled entry"),
            }))
          : input.lorebook.entries.map((entry) => ({
              activationKeys: entry.activationKeys,
              content: entry.entryContent,
              title: entry.title,
            })),
        id: input.lorebook.id,
        summary:
          input.lorebook.v3Document?.data.description ??
          input.lorebook.summary.aiLoreInstruction,
        title: input.lorebook.v3Document?.data.name ?? input.lorebook.title,
        universeAnchor:
          input.lorebook.v3Document?.data.name ??
          input.lorebook.summary.universeAnchor,
      }
    : undefined;
  const title = input.title.trim() ||
    [character?.name, persona?.name, scenario?.title, lorebook?.title]
      .filter(Boolean)
      .join(" + ") ||
    "Untitled Runtime Bundle";
  const scenarioOverride = normalizeScenarioOverride(input.scenarioOverride);
  const tags = normalizeTags(
    [
      "bundle",
      ...(character?.tags ?? []),
      ...(input.persona?.tags ?? []),
      ...(input.scenario?.tags ?? []),
      ...(input.lorebook?.tags ?? []),
    ].join(", "),
  );

  return {
    compiledContext: compileRuntimeBundleContext({
      character,
      lorebook,
      persona,
      scenario,
      scenarioOverride,
      title,
    }),
    id: createArtifactId(
      "bundle",
      `${title}:${character?.id ?? "no-character"}:${persona?.id ?? "no-persona"}:${scenario?.id ?? "no-scenario"}:${lorebook?.id ?? "no-lorebook"}`,
    ),
    character,
    lorebook,
    persona,
    scenario,
    scenarioOverride,
    source: "created",
    tags,
    title,
    updatedAt: Date.now(),
  };
}

export function createRuntimeBundleArtifactFromEditable(
  input: RuntimeBundleArtifact,
): RuntimeBundleArtifact {
  const title = input.title.trim() || "Untitled Runtime Bundle";
  const tags = normalizeTags(
    [
      "bundle",
      ...(input.tags ?? []),
      input.character?.name,
      input.persona?.name,
      input.scenario?.title,
      input.lorebook?.title,
    ].filter(Boolean).join(", "),
  );

  return {
    ...input,
    compiledContext: compileRuntimeBundleContext({
      character: input.character,
      lorebook: input.lorebook,
      persona: input.persona,
      scenario: input.scenario,
      scenarioOverride: normalizeScenarioOverride(input.scenarioOverride),
      title,
    }),
    scenarioOverride: normalizeScenarioOverride(input.scenarioOverride),
    tags,
    title,
    updatedAt: input.updatedAt ?? Date.now(),
  };
}

export function createImportedRuntimeBundleArtifact(
  value: unknown,
  sourceFileName?: string,
): RuntimeBundleArtifact {
  if (!isRecord(value)) {
    throw new Error("Runtime bundle JSON must be an object.");
  }

  const title = readUnknownString(value.title) ||
    sourceFileName?.replace(/\.json$/i, "").trim() ||
    "Imported Runtime Bundle";
  const character = readBundleCharacter(value.character);
  const persona = readBundlePersona(value.persona);
  const scenario = readBundleScenario(value.scenario);
  const lorebook = readBundleLorebook(value.lorebook);
  const scenarioOverride = readScenarioOverride(value.scenarioOverride);

  return createRuntimeBundleArtifactFromEditable({
    character,
    compiledContext: readUnknownString(value.compiledContext),
    id: readUnknownString(value.id) ||
      createArtifactId("bundle", `${title}:${sourceFileName ?? "imported"}`),
    lorebook,
    persona,
    scenario,
    scenarioOverride,
    source: "imported",
    tags: normalizeTagsFromUnknown(value.tags),
    title,
    updatedAt: readUnknownNumber(value.updatedAt) ?? Date.now(),
  });
}

export function artifactToJsonBytes(artifact: unknown) {
  return new TextEncoder().encode(JSON.stringify(artifact, null, 2));
}

export function createArtifactFileName(title: string, suffix: string) {
  const safe = title
    .trim()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return `${safe || "heartwriteai-artifact"}${suffix}`;
}

export function createDuplicateArtifactId(prefix: string, source: string) {
  return createArtifactId(prefix, `${source}:copy`);
}

function createArtifactId(prefix: string, source: string) {
  const slug = source
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 40);

  return `${prefix}_${slug || "draft"}_${Date.now().toString(36)}`;
}

function normalizeTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean)
    .filter((tag, index, tags) => tags.indexOf(tag) === index)
    .slice(0, 12);
}

function normalizeTagsFromUnknown(value: unknown) {
  if (Array.isArray(value)) {
    return normalizeTags(
      value
        .map((tag) => readUnknownString(tag))
        .filter(Boolean)
        .join(", "),
    );
  }

  return normalizeTags(readUnknownString(value));
}

function normalizeTagList(tags: string[]) {
  return normalizeTags(tags.join(", "));
}

function buildScenarioReferenceContext(input: ScenarioGenerationInput) {
  return [
    input.referenceCharacter?.trim()
      ? `Character: ${input.referenceCharacter.trim()}`
      : "",
    input.referencePersona?.trim()
      ? `Persona: ${input.referencePersona.trim()}`
      : "",
    input.referenceLorebook?.trim()
      ? `Lorebook: ${input.referenceLorebook.trim()}`
      : "",
  ].filter(Boolean).join(" ");
}

function normalizeScenarioOverride(
  value: Partial<RuntimeScenarioOverride> | null | undefined,
): RuntimeScenarioOverride | undefined {
  const override = {
    context: value?.context?.trim() ?? "",
    dynamic: value?.dynamic?.trim() ?? "",
    scene: value?.scene?.trim() ?? "",
    setting: value?.setting?.trim() ?? "",
  };

  return Object.values(override).some(Boolean) ? override : undefined;
}

function humanize(value: string) {
  return value.replaceAll("_", " ").toLowerCase();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function readUnknownString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readUnknownNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function readProfessionalDomainFromOccupation(
  occupation: GeneratedOccupationData,
): OccupationProfessionalDomain {
  if (occupation.kind === "professional") {
    return occupation.professionalDomain;
  }

  return "Arts_Entertainment";
}

function readKnownValue<const T extends readonly string[]>(
  value: unknown,
  allowed: T,
  fallback: T[number],
): T[number] {
  return typeof value === "string" && allowed.includes(value as T[number])
    ? value as T[number]
    : fallback;
}

function readBundleCharacter(
  value: unknown,
): RuntimeBundleArtifact["character"] | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const name = readUnknownString(value.name);
  const id = readUnknownString(value.id);

  if (!name || !id) {
    return undefined;
  }

  return {
    filePath:
      readUnknownString(value.filePath) ||
      readUnknownString(value.file_path),
    framework: readUnknownString(value.framework) || "Character card",
    id,
    name,
    relationship:
      readUnknownString(value.relationship) || "Unspecified dynamic",
    summary: readUnknownString(value.summary) ||
      `${name} is the selected character card.`,
    tags: normalizeTagsFromUnknown(value.tags),
  };
}

function readBundlePersona(
  value: unknown,
): RuntimeBundleArtifact["persona"] | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const name = readUnknownString(value.name);
  const id = readUnknownString(value.id);

  if (!name || !id) {
    return undefined;
  }

  return {
    id,
    name,
    prompt: readUnknownString(value.prompt) || `USER PERSONA: ${name}`,
    summary: readUnknownString(value.summary) ||
      `${name} is the selected user persona.`,
  };
}

function readBundleScenario(
  value: unknown,
): RuntimeBundleArtifact["scenario"] | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const title = readUnknownString(value.title);
  const id = readUnknownString(value.id);

  if (!title || !id) {
    return undefined;
  }

  return {
    id,
    openingConstraint: readUnknownString(value.openingConstraint) ||
      "Open the scene without writing {{user}}'s reply, choices, or internal state.",
    settingType: readUnknownString(value.settingType) || "Unspecified",
    startingTension: readUnknownString(value.startingTension) || "Unspecified",
    summary: readUnknownString(value.summary) ||
      `${title} is the selected roleplay scenario.`,
    title,
  };
}

function readBundleLorebook(
  value: unknown,
): RuntimeBundleArtifact["lorebook"] | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const title = readUnknownString(value.title);
  const id = readUnknownString(value.id);

  if (!title || !id) {
    return undefined;
  }

  return {
    entries: Array.isArray(value.entries)
      ? value.entries
          .filter(isRecord)
          .map((entry) => ({
            activationKeys: Array.isArray(entry.activationKeys)
              ? entry.activationKeys
                  .map((key) => readUnknownString(key))
                  .filter(Boolean)
                  .slice(0, 12)
              : [],
            content: readUnknownString(entry.content),
            title: readUnknownString(entry.title) || "Untitled entry",
          }))
          .filter((entry) => entry.content)
          .slice(0, 80)
      : [],
    id,
    summary: readUnknownString(value.summary) ||
      `${title} is the selected lorebook.`,
    title,
    universeAnchor: readUnknownString(value.universeAnchor) || title,
  };
}

function readScenarioOverride(value: unknown) {
  if (!isRecord(value)) {
    return undefined;
  }

  return normalizeScenarioOverride({
    context: readUnknownString(value.context),
    dynamic: readUnknownString(value.dynamic),
    scene: readUnknownString(value.scene),
    setting: readUnknownString(value.setting),
  });
}

function compileRuntimeBundleContext(input: {
  character?: RuntimeBundleArtifact["character"];
  lorebook?: RuntimeBundleArtifact["lorebook"];
  persona?: RuntimeBundleArtifact["persona"];
  scenario?: RuntimeBundleArtifact["scenario"];
  scenarioOverride?: RuntimeBundleArtifact["scenarioOverride"];
  title: string;
}) {
  const sections = [
    `RUNTIME BUNDLE: ${input.title}`,
    "",
    "[SELECTED CHARACTER]",
    input.character
      ? [
          `Name: ${input.character.name}`,
          `Framework: ${input.character.framework}`,
          `Relationship shape: ${input.character.relationship}`,
          `Summary: ${input.character.summary}`,
          input.character.filePath ? `Source: ${input.character.filePath}` : "",
          input.character.tags.length
            ? `Tags: ${input.character.tags.join(", ")}`
            : "",
        ].filter(Boolean).join("\n")
      : "No character selected. Chat creation should require a character card before runtime.",
    "",
    "[SELECTED PERSONA]",
    input.persona
      ? [
          `Name: ${input.persona.name}`,
          `Summary: ${input.persona.summary}`,
          "Prompt:",
          input.persona.prompt,
        ].join("\n")
      : "No persona selected.",
    "",
    "[SELECTED SCENARIO]",
    input.scenario
      ? [
          `Title: ${input.scenario.title}`,
          `Summary: ${input.scenario.summary}`,
          `Setting: ${input.scenario.settingType}`,
          `Starting tension: ${input.scenario.startingTension}`,
          `Opening constraint: ${input.scenario.openingConstraint}`,
        ].join("\n")
      : "No scenario selected. Use the selected character card's built-in scenario unless a structured override is provided.",
    "",
    "[SCENARIO OVERRIDE]",
    input.scenarioOverride
      ? [
          `Context: ${input.scenarioOverride.context || "Use character-origin context."}`,
          `Setting: ${input.scenarioOverride.setting || "Use character-origin setting."}`,
          `Scene: ${input.scenarioOverride.scene || "Use character-origin scene."}`,
          `Dynamic: ${input.scenarioOverride.dynamic || "Use character-origin dynamic."}`,
        ].join("\n")
      : "No scenario override. Runtime should use the character card's built-in scenario or selected saved scenario.",
    "",
    "[SELECTED LOREBOOK]",
    input.lorebook
      ? [
          `Title: ${input.lorebook.title}`,
          `Universe anchor: ${input.lorebook.universeAnchor}`,
          `Core premise: ${input.lorebook.summary}`,
          "",
          "Entries:",
          ...input.lorebook.entries.map((entry) =>
            [
              `- ${entry.title}`,
              `  Keys: ${entry.activationKeys.join(", ")}`,
              `  Content: ${entry.content}`,
            ].join("\n"),
          ),
        ].join("\n")
      : "No lorebook selected.",
  ];

  return sections.join("\n");
}
