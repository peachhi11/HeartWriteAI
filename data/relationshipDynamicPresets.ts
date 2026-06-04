export type RelationshipDynamicMode =
  | "arranged"
  | "caretaker"
  | "complement"
  | "devotion"
  | "fake-dating"
  | "fated-reincarnation"
  | "flaw-secret"
  | "forbidden"
  | "friends-to-lovers"
  | "friction"
  | "obsession"
  | "rivalry"
  | "secret"
  | "second-chance"
  | "slow-burn"
  | "workplace-hierarchy";

export interface RelationshipDynamicPreset {
  id: string;
  mode: RelationshipDynamicMode;
  category: string;
  vibe: string;
  characterARole: string;
  characterBRole: string;
  premise: string;
  pressure: string;
  characterABehaviors: readonly string[];
  characterBBehaviors: readonly string[];
  progressionCues: readonly string[];
  safetyBoundary: string;
  systemPromptTags: readonly string[];
  tailwindTheme: {
    fromColor: string;
    toColor: string;
    accentColor: string;
  };
}

export type RelationshipDynamicSeedPresetCategory =
  | "Archetype"
  | "Dynamic"
  | "Tension"
  | "Power"
  | "Attachment"
  | "Romance Hook"
  | "Gate"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface RelationshipDynamicSeedPreset {
  id: string;
  category: RelationshipDynamicSeedPresetCategory;
  label: string;
  value: string;
  triggerKeys: readonly string[];
  guidance: string;
  systemPromptTags: readonly string[];
}

export interface CompiledRelationshipDynamicSeedPresetAdditions {
  scenarioAddition: string;
  relationshipAddition: string;
  systemPromptAddition: string;
}

const defaultSafetyBoundary =
  "Keep the dynamic fictional, consent-forward, and responsive. Preserve both characters' agency, boundaries, refusals, and ability to leave or renegotiate the interaction.";

export const RELATIONSHIP_DYNAMIC_PRESETS = Object.freeze([
  {
    id: "dyn_grumpy_sunshine",
    mode: "complement",
    category: "Opposites Attract",
    vibe: "Grumpy x Sunshine",
    characterARole: "The Grumpy / Cynical Anchor",
    characterBRole: "The Sunshine / Optimist Catalyst",
    premise:
      "One character is guarded, serious, and stoic, while the other brings open warmth and emotional momentum.",
    pressure:
      "Warmth keeps pressing against a defensive wall that does not know how to soften gracefully.",
    characterABehaviors: [
      "Deflects bright enthusiasm with dry restraint",
      "Shows care through practical action rather than praise",
      "Softens only when genuine distress breaks through the banter",
    ],
    characterBBehaviors: [
      "Tries to draw out a smile without forcing one",
      "Keeps bringing lightness into tense rooms",
      "Defends the guarded character when others misread them",
    ],
    progressionCues: [
      "A practical favour becomes obviously tender",
      "A joke lands and catches both characters off guard",
      "The guarded character stays instead of retreating",
    ],
    safetyBoundary: defaultSafetyBoundary,
    systemPromptTags: ["emotional friction", "cautious thawing", "unspoken protection", "high-contrast banter"],
    tailwindTheme: { fromColor: "from-stone-900", toColor: "to-amber-950", accentColor: "text-amber-400" },
  },
  {
    id: "dyn_stalker_target",
    mode: "complement",
    category: "Dark Devotion",
    vibe: "Shadow Guardian x Watched Fixation",
    characterARole: "The Obsessive Shadow",
    characterBRole: "The Unwitting Fixation",
    premise:
      "A dark guardian watches too closely, confusing protection with proximity while the other character decides what safety is worth.",
    pressure:
      "Protective attention risks becoming invasive unless the characters confront boundaries directly.",
    characterABehaviors: [
      "Notices small changes in mood, schedule, and danger",
      "Intervenes only when a threat becomes immediate",
      "Struggles to distinguish vigilance from control",
    ],
    characterBBehaviors: [
      "Notices anomalies and chooses whether to confront them",
      "Names boundaries when attention becomes too close",
      "Feels the tension between alarm and relief",
    ],
    progressionCues: [
      "A hidden intervention is brought into the open",
      "A boundary is stated and respected",
      "Protection shifts from surveillance into honest presence",
    ],
    safetyBoundary:
      "Frame this as dark fictional tension only. Do not romanticize stalking as healthy behaviour; require explicit boundaries, consequences, and active consent for closeness.",
    systemPromptTags: ["hyper-vigilance", "boundary negotiation", "claustrophobic intimacy", "protective obsession"],
    tailwindTheme: { fromColor: "from-neutral-950", toColor: "to-purple-950", accentColor: "text-fuchsia-400" },
  },
  {
    id: "dyn_bodyguard_royalty",
    mode: "complement",
    category: "Forbidden Power",
    vibe: "Bodyguard x Sovereign",
    characterARole: "The Stoic Shield",
    characterBRole: "The Protected Sovereign",
    premise:
      "Duty creates physical closeness while rank and orders make honest feeling dangerous.",
    pressure:
      "Professional restraint and public scrutiny turn every protective gesture into a possible confession.",
    characterABehaviors: [
      "Stands half a step behind while scanning the room",
      "Uses formal titles even in private stress",
      "Prioritizes safety over personal comfort",
    ],
    characterBBehaviors: [
      "Tests composure with deliberate informality",
      "Feels safest inside the protector's shadow",
      "Pushes to be treated as a person rather than a task",
    ],
    progressionCues: [
      "A formal title slips into a private name",
      "Protection becomes mutual",
      "An order conflicts with emotional truth",
    ],
    safetyBoundary: defaultSafetyBoundary,
    systemPromptTags: ["duty versus desire", "formal restraint", "protective spatial blocking", "rank pressure"],
    tailwindTheme: { fromColor: "from-slate-950", toColor: "to-stone-900", accentColor: "text-amber-500" },
  },
  {
    id: "dyn_academic_rivals",
    mode: "complement",
    category: "Rivals to Lovers",
    vibe: "Academic Rivals",
    characterARole: "The Perfect Score Strategist",
    characterBRole: "The Brilliant Challenger",
    premise:
      "Two sharp minds compete so intensely that respect keeps leaking through the insults.",
    pressure:
      "Pride makes admiration humiliating, especially when both characters need the other's strengths.",
    characterABehaviors: [
      "Corrects details with controlled precision",
      "Uses polished sarcasm to cover fascination",
      "Studies the other character's methods too closely",
    ],
    characterBBehaviors: [
      "Refuses to concede intellectual ground",
      "Turns every correction into a counter-challenge",
      "Notices the admiration hidden inside critique",
    ],
    progressionCues: [
      "A public argument becomes private collaboration",
      "One character defends the other's brilliance",
      "Competition shifts into mutual reliance",
    ],
    safetyBoundary: defaultSafetyBoundary,
    systemPromptTags: ["witty academic insults", "intellectual jealousy", "hidden admiration", "library proximity friction"],
    tailwindTheme: { fromColor: "from-cyan-950", toColor: "to-zinc-900", accentColor: "text-emerald-400" },
  },
  {
    id: "dyn_beast_beauty",
    mode: "complement",
    category: "Beauty and the Beast",
    vibe: "Monster x Gentle Witness",
    characterARole: "The Feared Beast",
    characterBRole: "The Gentle Witness",
    premise:
      "A feared, isolated character is seen with care rather than fear, creating a fragile chance at trust.",
    pressure:
      "Shame, reputation, and physical intimidation make softness feel impossible to ask for.",
    characterABehaviors: [
      "Moves carefully to avoid frightening the other character",
      "Assumes tenderness is pity unless proven otherwise",
      "Reveals gentleness through restrained strength",
    ],
    characterBBehaviors: [
      "Looks directly at the person beneath the reputation",
      "Names kindness when others only name danger",
      "Chooses patience without ignoring risk",
    ],
    progressionCues: [
      "The feared character accepts help without flinching",
      "A dangerous room becomes quiet and safe",
      "The witness sets a boundary and the beast honours it",
    ],
    safetyBoundary: defaultSafetyBoundary,
    systemPromptTags: ["gentle monster", "softening isolation", "fear versus tenderness", "careful physical contrast"],
    tailwindTheme: { fromColor: "from-neutral-900", toColor: "to-zinc-800", accentColor: "text-sky-400" },
  },
  {
    id: "fric_int_touch_averse",
    mode: "friction",
    category: "Internal Trauma",
    vibe: "Touch-Starved Recluse",
    characterARole: "The Touch-Averse Recluse",
    characterBRole: "The Patient Safe Harbour",
    premise:
      "A character longs for closeness while their body treats sudden touch as danger.",
    pressure:
      "Desire and panic arrive together, making consent and pacing the centre of the relationship.",
    characterABehaviors: [
      "Freezes or flinches at sudden unannounced contact",
      "Tracks hands and exits when proximity tightens",
      "Uses dry practicality to recover control",
    ],
    characterBBehaviors: [
      "Asks before touching",
      "Builds safety through side-by-side proximity",
      "Treats hesitation as information rather than rejection",
    ],
    progressionCues: [
      "Permission is requested and clearly granted",
      "A non-threatening touch is accepted briefly",
      "The recluse admits wanting closeness without being ready for all of it",
    ],
    safetyBoundary:
      "Keep touch negotiation explicit. Do not override panic, consent, or stated boundaries for romantic payoff.",
    systemPromptTags: ["somatic panic response", "touch deprivation yearning", "gradual safety building", "consent-forward touch"],
    tailwindTheme: { fromColor: "from-purple-950", toColor: "to-stone-950", accentColor: "text-purple-400" },
  },
  {
    id: "fric_ext_political_hostage",
    mode: "friction",
    category: "External Barrier",
    vibe: "Political Alliance Pawn",
    characterARole: "The Faction-Bound Strategist",
    characterBRole: "The Rival Envoy",
    premise:
      "The characters represent rival powers, making honest affection look like betrayal.",
    pressure:
      "Surveillance and faction loyalty force softness to hide behind public coldness.",
    characterABehaviors: [
      "Masks emotion behind formal etiquette",
      "Checks rooms for observers before relaxing",
      "Uses sharp words in public to preserve cover",
    ],
    characterBBehaviors: [
      "Reads the difference between public hostility and private warning",
      "Shares covert alignment in tactical decisions",
      "Pushes for honesty when political scripts fail",
    ],
    progressionCues: [
      "A secret conversation reveals mutual exhaustion",
      "A public insult privately protects the other character",
      "The characters choose each other during a faction crisis",
    ],
    safetyBoundary: defaultSafetyBoundary,
    systemPromptTags: ["surveillance pressure", "formal masks", "covert micro-alliances", "high-stakes loyalty conflict"],
    tailwindTheme: { fromColor: "from-zinc-950", toColor: "to-red-950", accentColor: "text-red-500" },
  },
  {
    id: "fric_taboo_asymmetric_guilt",
    mode: "friction",
    category: "Taboo Power",
    vibe: "Forbidden Authority",
    characterARole: "The Conflicted Authority",
    characterBRole: "The Competent Equal",
    premise:
      "An adult relationship is complicated by role power, guilt, and a demand to be seen as an equal.",
    pressure:
      "The authority figure fears exploitation while the other character refuses to be treated as powerless.",
    characterABehaviors: [
      "Reverts to rigid professionalism when tension spikes",
      "Avoids eye contact by arranging objects or papers",
      "Names ethical lines instead of pretending they do not exist",
    ],
    characterBBehaviors: [
      "Demonstrates competence that changes the balance",
      "Challenges patronizing distance",
      "Insists that desire cannot erase consent or equality",
    ],
    progressionCues: [
      "The relationship context moves outside the official role",
      "Competence forces a reframe of the power dynamic",
      "Both characters explicitly renegotiate boundaries",
    ],
    safetyBoundary:
      "All characters must be adults. Treat power imbalance as an ethical constraint requiring consent, accountability, and the ability to walk away.",
    systemPromptTags: ["ethical gridlock", "suppressed micro-expressions", "adult power imbalance", "boundary renegotiation"],
    tailwindTheme: { fromColor: "from-slate-950", toColor: "to-stone-900", accentColor: "text-amber-500" },
  },
  {
    id: "fric_ideo_fundament_clash",
    mode: "friction",
    category: "Ideological Clash",
    vibe: "Moral Rivals",
    characterARole: "The Believer",
    characterBRole: "The Heretic",
    premise:
      "The characters are drawn to each other's competence while rejecting each other's worldview.",
    pressure:
      "Attraction keeps colliding with values, methods, and the fear of betraying the self.",
    characterABehaviors: [
      "Turns small talk into philosophical argument",
      "Critiques methods while copying what works",
      "Uses certainty to hide shaken conviction",
    ],
    characterBBehaviors: [
      "Challenges sacred assumptions directly",
      "Finds the vulnerable wound behind the ideology",
      "Offers practical proof instead of persuasion",
    ],
    progressionCues: [
      "A crisis requires both moral frameworks",
      "One character witnesses the pain that shaped the other",
      "Respect appears before agreement",
    ],
    safetyBoundary: defaultSafetyBoundary,
    systemPromptTags: ["aggressive intellectual friction", "ideological vulnerability cracks", "reluctant respect", "clashing worldviews"],
    tailwindTheme: { fromColor: "from-indigo-950", toColor: "to-zinc-950", accentColor: "text-indigo-400" },
  },
  {
    id: "forbid_caste_untouchable",
    mode: "forbidden",
    category: "Societal Exile",
    vibe: "High-Born x Undercity",
    characterARole: "The High-Born Heir",
    characterBRole: "The Exiled Outsider",
    premise:
      "A rigid caste or class law forbids intimacy across social strata.",
    pressure:
      "Exposure threatens status, safety, and belonging, so affection must survive public denial.",
    characterABehaviors: [
      "Performs cold distance in front of peers",
      "Uses coded signals instead of open affection",
      "Risks reputation in hidden meetings",
    ],
    characterBBehaviors: [
      "Reads insult as possible cover rather than truth",
      "Carries the heavier danger of exposure",
      "Demands dignity instead of secret charity",
    ],
    progressionCues: [
      "A coded message becomes a direct promise",
      "The high-born character spends social capital to protect the outsider",
      "The outsider refuses a secrecy arrangement that erases them",
    ],
    safetyBoundary: defaultSafetyBoundary,
    systemPromptTags: ["status division", "public misdirection", "clandestine meetings", "class pressure"],
    tailwindTheme: { fromColor: "from-purple-950", toColor: "to-stone-950", accentColor: "text-amber-400" },
  },
  {
    id: "forbid_feud_star_crossed",
    mode: "forbidden",
    category: "Political Blood Feud",
    vibe: "Rival Heirs",
    characterARole: "The Syndicate Heir",
    characterBRole: "The Rival House Weapon",
    premise:
      "Two faction heirs or enforcers fall into dangerous trust across an active feud.",
    pressure:
      "Each private act of care can be read as treason by both sides.",
    characterABehaviors: [
      "Hides concern behind tactical hostility",
      "Creates plausible combat excuses for proximity",
      "Treats trust as more dangerous than violence",
    ],
    characterBBehaviors: [
      "Tests whether mercy is strategy or sincerity",
      "Tends wounds while hiding evidence",
      "Balances family loyalty against personal truth",
    ],
    progressionCues: [
      "A staged conflict becomes real protection",
      "One character withholds information that would harm the other",
      "A safe house conversation changes the war's emotional stakes",
    ],
    safetyBoundary: defaultSafetyBoundary,
    systemPromptTags: ["star-crossed feud", "lethal secrecy", "clashing loyalties", "trust against common sense"],
    tailwindTheme: { fromColor: "from-red-950", toColor: "to-neutral-950", accentColor: "text-red-500" },
  },
  {
    id: "forbid_super_predator_prey",
    mode: "forbidden",
    category: "Supernatural Divide",
    vibe: "Hunter x Ancient Beast",
    characterARole: "The Monster Hunter",
    characterBRole: "The Ancient Beast",
    premise:
      "Species, magic, or law declares the characters natural enemies despite mutual recognition.",
    pressure:
      "Instinct and doctrine keep translating attraction as danger.",
    characterABehaviors: [
      "Fights reflexive threat responses during closeness",
      "Hides hesitation from their order or pack",
      "Studies the other character as both threat and person",
    ],
    characterBBehaviors: [
      "Conceals visible non-human tells when hunted",
      "Tests whether mercy is real",
      "Restrains instinct to make room for choice",
    ],
    progressionCues: [
      "A neutral-zone meeting does not turn violent",
      "A biological reflex is named and contained",
      "Both characters reject inherited scripts for one scene",
    ],
    safetyBoundary: defaultSafetyBoundary,
    systemPromptTags: ["species divide", "instinct friction", "taboo attraction", "existential compatibility dread"],
    tailwindTheme: { fromColor: "from-emerald-950", toColor: "to-zinc-950", accentColor: "text-emerald-400" },
  },
  {
    id: "forbid_law_vow_celibacy",
    mode: "forbidden",
    category: "Institutional Law",
    vibe: "Broken Vow",
    characterARole: "The Bound Zealot",
    characterBRole: "The Living Temptation",
    premise:
      "An oath of isolation or celibacy makes emotional and physical longing feel like spiritual treason.",
    pressure:
      "The vow is not just social; it shapes identity, shame, and fear of exile.",
    characterABehaviors: [
      "Retreats into ritual when desire becomes obvious",
      "Quotes rules to avoid naming emotion",
      "Experiences tenderness as both comfort and crisis",
    ],
    characterBBehaviors: [
      "Refuses to be reduced to temptation",
      "Asks what the character actually wants",
      "Protects the character from institutions without owning their choice",
    ],
    progressionCues: [
      "A ritual falters during a moment of care",
      "The bound character admits the vow no longer explains them fully",
      "Choice replaces reflexive shame",
    ],
    safetyBoundary: defaultSafetyBoundary,
    systemPromptTags: ["vow pressure", "institutional shame", "forbidden tenderness", "identity conflict"],
    tailwindTheme: { fromColor: "from-stone-950", toColor: "to-slate-900", accentColor: "text-cyan-300" },
  },
  {
    id: "rival_prof_corporate_apex",
    mode: "rivalry",
    category: "Professional",
    vibe: "Clashing Executives",
    characterARole: "The Corporate Apex Strategist",
    characterBRole: "The Cutthroat Equal",
    premise:
      "Two elite professionals compete for the same seat while recognizing no one else can match them.",
    pressure:
      "Ambition makes admiration feel like surrender.",
    characterABehaviors: [
      "Uses polished politeness as a blade",
      "Outworks everyone to maintain dominance",
      "Defends the rival's methods when outsiders interfere",
    ],
    characterBBehaviors: [
      "Returns every compliment as a challenge",
      "Exposes weak projections without mercy",
      "Recognises competence before affection",
    ],
    progressionCues: [
      "A boardroom insult protects the rival",
      "A joint crisis requires combined expertise",
      "Private exhaustion reveals the cost of excellence",
    ],
    safetyBoundary: defaultSafetyBoundary,
    systemPromptTags: ["corporate banter", "competence tracking", "smiles masking hostility", "forced workplace proximity"],
    tailwindTheme: { fromColor: "from-slate-950", toColor: "to-slate-800", accentColor: "text-amber-500" },
  },
  {
    id: "rival_acad_perfect_scores",
    mode: "rivalry",
    category: "Academic",
    vibe: "Top of the Class",
    characterARole: "The Perfect Score",
    characterBRole: "The Persistent Challenger",
    premise:
      "Academic excellence turns into a private language of insults, admiration, and pressure.",
    pressure:
      "Every score feels like proof of worth, making vulnerability intolerable.",
    characterABehaviors: [
      "Corrects tiny mistakes with infuriating precision",
      "Tracks reading lists and posture for advantage",
      "Smirks when rattled rather than admitting fear",
    ],
    characterBBehaviors: [
      "Attacks the perfect framework with practical disruption",
      "Refuses to be permanently second place",
      "Sees the insecurity behind the perfection",
    ],
    progressionCues: [
      "A late-night study session becomes too honest",
      "One character shares notes without being asked",
      "Failure becomes survivable because the rival stays",
    ],
    safetyBoundary: defaultSafetyBoundary,
    systemPromptTags: ["witty academic insults", "intellectual jealousy", "library proximity friction", "hidden respect cracks"],
    tailwindTheme: { fromColor: "from-cyan-950", toColor: "to-zinc-900", accentColor: "text-emerald-400" },
  },
  {
    id: "rival_comedy_bickering",
    mode: "rivalry",
    category: "Comedic Banter",
    vibe: "Bickering Partners",
    characterARole: "The Petty Scorekeeper",
    characterBRole: "The Shameless Provocateur",
    premise:
      "Low-stakes bickering covers a highly synchronized partnership.",
    pressure:
      "Admitting fondness would ruin a perfectly good argument.",
    characterABehaviors: [
      "Maintains a petty tally of victories",
      "Corrects trivial rules with theatrical seriousness",
      "Shows care through annoyed competence",
    ],
    characterBBehaviors: [
      "Provokes for the joy of being chased verbally",
      "Knows exactly when the bickering means affection",
      "Breaks tension with ridiculous confidence",
    ],
    progressionCues: [
      "The argument stops instantly when one character is hurt",
      "A joke becomes an inside ritual",
      "Someone admits the room feels wrong without the noise",
    ],
    safetyBoundary: defaultSafetyBoundary,
    systemPromptTags: ["comic bickering", "petty scorekeeping", "synchronized teamwork", "affectionate irritation"],
    tailwindTheme: { fromColor: "from-orange-950", toColor: "to-stone-900", accentColor: "text-orange-400" },
  },
  {
    id: "rival_lethal_blades_kiss",
    mode: "rivalry",
    category: "Lethal Combat",
    vibe: "Blades at the Throat",
    characterARole: "The Honoured Killer",
    characterBRole: "The Equal Blade",
    premise:
      "Two dangerous equals communicate through threat assessment, restraint, and precise mercy.",
    pressure:
      "Attraction appears only where both characters could have ended the fight and chose not to.",
    characterABehaviors: [
      "Measures distance, breath, and weapon angle",
      "Shows respect by not underestimating",
      "Uses restraint as the first sign of tenderness",
    ],
    characterBBehaviors: [
      "Calls out hesitation as proof of feeling",
      "Returns mercy without making it soft",
      "Treats survival as a private conversation",
    ],
    progressionCues: [
      "A killing blow is redirected",
      "A wound is treated in silence",
      "The duel becomes a promise to meet again",
    ],
    safetyBoundary: defaultSafetyBoundary,
    systemPromptTags: ["lethal respect", "combat intimacy", "weapon-distance tension", "mercy as confession"],
    tailwindTheme: { fromColor: "from-red-950", toColor: "to-neutral-950", accentColor: "text-red-400" },
  },
  {
    id: "care_hurt_comfort_medic",
    mode: "caretaker",
    category: "Hurt / Comfort",
    vibe: "Battlefield Medic",
    characterARole: "The Controlled Caretaker",
    characterBRole: "The Injured Deflector",
    premise:
      "Care becomes intimate because one character cannot keep pretending they are fine.",
    pressure:
      "Practical treatment exposes fear, tenderness, and reliance.",
    characterABehaviors: [
      "Uses clinical commands to hide worry",
      "Tracks pain responses with careful attention",
      "Keeps hands steady while voice almost cracks",
    ],
    characterBBehaviors: [
      "Deflects concern with jokes or irritation",
      "Eventually obeys because care feels safer than pride",
      "Notices the caretaker's fear beneath competence",
    ],
    progressionCues: [
      "A treatment instruction turns soft",
      "The injured character admits pain honestly",
      "Aftercare continues after the crisis is over",
    ],
    safetyBoundary: defaultSafetyBoundary,
    systemPromptTags: ["hurt comfort", "clinical tenderness", "reluctant vulnerability", "caretaking proximity"],
    tailwindTheme: { fromColor: "from-teal-950", toColor: "to-stone-900", accentColor: "text-teal-400" },
  },
  {
    id: "care_domestic_anchor",
    mode: "caretaker",
    category: "Domestic Support",
    vibe: "Home as Safe Harbour",
    characterARole: "The Domestic Anchor",
    characterBRole: "The Frayed Survivor",
    premise:
      "Ordinary care becomes emotionally loaded because safety is unfamiliar.",
    pressure:
      "Domestic gentleness threatens defences built for crisis.",
    characterABehaviors: [
      "Prepares food, warmth, and quiet without demanding gratitude",
      "Notices exhaustion before it is named",
      "Makes care routine rather than dramatic",
    ],
    characterBBehaviors: [
      "Struggles to accept ordinary comfort",
      "Tests whether care disappears after inconvenience",
      "Softens around small rituals",
    ],
    progressionCues: [
      "A repeated ritual becomes expected",
      "The survivor asks for help before collapse",
      "Home starts meaning a person, not just a place",
    ],
    safetyBoundary: defaultSafetyBoundary,
    systemPromptTags: ["domestic care", "quiet rituals", "safe harbour", "ordinary intimacy"],
    tailwindTheme: { fromColor: "from-rose-950", toColor: "to-stone-900", accentColor: "text-rose-300" },
  },
  {
    id: "care_sacrificial_shield",
    mode: "caretaker",
    category: "Sacrificial Protection",
    vibe: "Shield at Any Cost",
    characterARole: "The Sacrificial Shield",
    characterBRole: "The Protected Equal",
    premise:
      "Protection is sincere but risks becoming self-erasure.",
    pressure:
      "Love cannot become a habit of one character bleeding in silence.",
    characterABehaviors: [
      "Steps between danger and the other character reflexively",
      "Minimizes injuries to prevent worry",
      "Confuses usefulness with worth",
    ],
    characterBBehaviors: [
      "Rejects being protected at the cost of the protector's self",
      "Insists on mutual survival",
      "Names self-sacrifice as fear, not just devotion",
    ],
    progressionCues: [
      "Protection becomes a shared plan",
      "The shield accepts care after taking damage",
      "The protected character saves them back",
    ],
    safetyBoundary: defaultSafetyBoundary,
    systemPromptTags: ["sacrificial protection", "mutual survival", "protective instinct", "self-worth conflict"],
    tailwindTheme: { fromColor: "from-red-950", toColor: "to-zinc-950", accentColor: "text-red-400" },
  },
  {
    id: "care_overprotective_alpha",
    mode: "caretaker",
    category: "Overprotective",
    vibe: "Protective Alpha",
    characterARole: "The Overprotective Guardian",
    characterBRole: "The Independent Beloved",
    premise:
      "Protectiveness is intense and heartfelt, but must learn to respect autonomy.",
    pressure:
      "Fear makes control tempting; trust requires stepping back.",
    characterABehaviors: [
      "Scans threats and crowds constantly",
      "Crowds space when alarm spikes",
      "Learns to ask before acting on fear",
    ],
    characterBBehaviors: [
      "Names autonomy as non-negotiable",
      "Accepts care without surrendering independence",
      "Rewards trust more than control",
    ],
    progressionCues: [
      "The guardian pauses and asks",
      "The beloved accepts help freely",
      "Protection becomes collaborative instead of unilateral",
    ],
    safetyBoundary:
      "Do not frame control as proof of love. Keep autonomy, consent, and the right to refuse central.",
    systemPromptTags: ["overprotective tension", "autonomy negotiation", "protective spatial awareness", "trust building"],
    tailwindTheme: { fromColor: "from-orange-950", toColor: "to-neutral-950", accentColor: "text-orange-400" },
  },
  {
    id: "fake_corporate_apex_alliance",
    mode: "fake-dating",
    category: "Corporate Convenience",
    vibe: "Boardroom Power Couple Ruse",
    characterARole: "The Strategic Executive",
    characterBRole: "The Useful Co-Conspirator",
    premise:
      "A fake relationship improves leverage until private loyalty stops feeling fake.",
    pressure:
      "Public performance creates private habits that neither character planned for.",
    characterABehaviors: [
      "Uses polished couple optics as strategy",
      "Corrects the story too quickly when details slip",
      "Protects the partner in negotiations beyond the agreement",
    ],
    characterBBehaviors: [
      "Improvises affectionate details that sound too real",
      "Challenges the contract when emotions shift",
      "Notices when public touch lingers in private memory",
    ],
    progressionCues: [
      "A fake detail becomes true",
      "One character gets jealous before remembering the arrangement",
      "The contract expires and neither wants distance",
    ],
    safetyBoundary: defaultSafetyBoundary,
    systemPromptTags: ["fake dating", "public performance", "private intimacy leak", "contractual romance"],
    tailwindTheme: { fromColor: "from-slate-950", toColor: "to-purple-950", accentColor: "text-purple-400" },
  },
  {
    id: "fake_underworld_claim",
    mode: "fake-dating",
    category: "Underworld Cover",
    vibe: "Protective Claim Ruse",
    characterARole: "The Underworld Shield",
    characterBRole: "The Marked Cover Partner",
    premise:
      "A public claim protects one character in dangerous circles, but closeness complicates the lie.",
    pressure:
      "Safety requires performance, and performance keeps becoming emotionally real.",
    characterABehaviors: [
      "Maintains protective proximity in public",
      "Uses reputation as a shield",
      "Clarifies privately that the other character still chooses the boundaries",
    ],
    characterBBehaviors: [
      "Plays the role when survival requires it",
      "Questions which parts are real afterward",
      "Claims agency inside a dangerous cover story",
    ],
    progressionCues: [
      "A staged touch becomes a checked-in comfort",
      "The shield reveals why the danger matters",
      "The cover is no longer needed but the bond remains",
    ],
    safetyBoundary:
      "Keep the cover consensual between the characters. Do not use danger to erase autonomy or force intimacy.",
    systemPromptTags: ["protective cover", "underworld reputation", "public claim ruse", "private consent check"],
    tailwindTheme: { fromColor: "from-neutral-950", toColor: "to-red-950", accentColor: "text-red-400" },
  },
  {
    id: "fake_spite_rebound",
    mode: "fake-dating",
    category: "Spite Arrangement",
    vibe: "Revenge Date Mistake",
    characterARole: "The Spiteful Improviser",
    characterBRole: "The Unexpected Soft Landing",
    premise:
      "A fake date begins as pride or revenge and turns into a surprising emotional refuge.",
    pressure:
      "What began as performance becomes embarrassing sincerity.",
    characterABehaviors: [
      "Overplays confidence to hide hurt",
      "Uses the arrangement to save face",
      "Accidentally reveals what they actually need",
    ],
    characterBBehaviors: [
      "Plays along with amused restraint",
      "Sees the wound beneath the spectacle",
      "Refuses to be used without being respected",
    ],
    progressionCues: [
      "The spite target stops mattering",
      "A staged compliment lands too honestly",
      "The arrangement continues with a new reason",
    ],
    safetyBoundary: defaultSafetyBoundary,
    systemPromptTags: ["spite dating", "rebound vulnerability", "performance becomes real", "wounded pride"],
    tailwindTheme: { fromColor: "from-pink-950", toColor: "to-stone-950", accentColor: "text-pink-400" },
  },
  {
    id: "fake_accidental_betrothal",
    mode: "fake-dating",
    category: "Accidental Betrothal",
    vibe: "Oops, We Are Engaged",
    characterARole: "The Accidental Betrothed",
    characterBRole: "The Rule-Savvy Partner",
    premise:
      "A cultural, magical, or legal misunderstanding creates a public engagement neither expected.",
    pressure:
      "Everyone else treats the bond as real before the characters understand what they want.",
    characterABehaviors: [
      "Panics politely under formal congratulations",
      "Tries to solve the mistake without humiliating the other character",
      "Notices the comfort of being treated as chosen",
    ],
    characterBBehaviors: [
      "Explains rules while hiding emotional reaction",
      "Offers escape routes instead of trapping the other character",
      "Tests whether staying could be a choice",
    ],
    progressionCues: [
      "The escape clause is found and not used immediately",
      "Public ritual exposes private tenderness",
      "The characters choose what the bond means",
    ],
    safetyBoundary: defaultSafetyBoundary,
    systemPromptTags: ["accidental engagement", "cultural misunderstanding", "public ritual pressure", "choice after mistake"],
    tailwindTheme: { fromColor: "from-amber-950", toColor: "to-stone-900", accentColor: "text-amber-300" },
  },
  {
    id: "arranged_dynastic_crown",
    mode: "arranged",
    category: "Dynastic Union",
    vibe: "Crown Marriage",
    characterARole: "The Dutiful Heir",
    characterBRole: "The Political Spouse",
    premise:
      "A dynastic match binds two people before trust has time to exist.",
    pressure:
      "Duty, court scrutiny, and public fertility or succession expectations crowd private emotion.",
    characterABehaviors: [
      "Speaks in formal obligations",
      "Uses etiquette to avoid vulnerability",
      "Protects the spouse publicly before intimacy is resolved",
    ],
    characterBBehaviors: [
      "Learns court rules without surrendering selfhood",
      "Challenges being treated as a treaty",
      "Finds private honesty inside public ceremony",
    ],
    progressionCues: [
      "A formal address becomes a private name",
      "One spouse shields the other from court cruelty",
      "Duty becomes partnership rather than cage",
    ],
    safetyBoundary: defaultSafetyBoundary,
    systemPromptTags: ["arranged marriage", "court pressure", "formal masks", "duty into tenderness"],
    tailwindTheme: { fromColor: "from-indigo-950", toColor: "to-stone-950", accentColor: "text-indigo-300" },
  },
  {
    id: "arranged_syndicate_merger",
    mode: "arranged",
    category: "Criminal Alliance",
    vibe: "Syndicate Merger",
    characterARole: "The Syndicate Successor",
    characterBRole: "The Rival Asset",
    premise:
      "A marriage or partnership is arranged to stop violence between dangerous factions.",
    pressure:
      "The alliance demands trust from people trained never to trust.",
    characterABehaviors: [
      "Negotiates intimacy like a treaty",
      "Checks every gesture for hidden threat",
      "Protects the spouse because the alliance depends on it, then because they care",
    ],
    characterBBehaviors: [
      "Refuses to be a hostage inside the arrangement",
      "Uses sharp competence to gain footing",
      "Tests whether loyalty can exist without naivety",
    ],
    progressionCues: [
      "A tactical alliance survives betrayal pressure",
      "One character shares real information voluntarily",
      "The marriage bed or shared room becomes a negotiation, not an entitlement",
    ],
    safetyBoundary:
      "Keep arranged closeness consent-forward. Shared status never implies automatic physical or emotional access.",
    systemPromptTags: ["syndicate alliance", "arranged proximity", "dangerous trust", "treaty romance"],
    tailwindTheme: { fromColor: "from-red-950", toColor: "to-neutral-950", accentColor: "text-red-300" },
  },
  {
    id: "arranged_cultural_tartan",
    mode: "arranged",
    category: "Clan Alliance",
    vibe: "Highland Alliance",
    characterARole: "The Clan-Bound Protector",
    characterBRole: "The Outsider Spouse",
    premise:
      "A clan or cultural alliance forces strangers to build trust inside unfamiliar customs.",
    pressure:
      "Misread rituals and community expectations turn every private choice public.",
    characterABehaviors: [
      "Explains traditions with gruff restraint",
      "Defends the spouse from clan disrespect",
      "Struggles between custom and tenderness",
    ],
    characterBBehaviors: [
      "Learns customs while naming discomfort",
      "Finds power in adapting selectively",
      "Asks for private meaning beneath public ritual",
    ],
    progressionCues: [
      "A ritual is repeated by choice",
      "The outsider is defended as family",
      "Custom becomes shared language instead of coercion",
    ],
    safetyBoundary: defaultSafetyBoundary,
    systemPromptTags: ["clan alliance", "cultural adaptation", "ritual intimacy", "outsider spouse"],
    tailwindTheme: { fromColor: "from-emerald-950", toColor: "to-sky-950", accentColor: "text-emerald-300" },
  },
  {
    id: "arranged_dystopian_registry",
    mode: "arranged",
    category: "Dystopian Registry",
    vibe: "Matched by the System",
    characterARole: "The Registered Match",
    characterBRole: "The Algorithmic Spouse",
    premise:
      "A state, corporation, or algorithm assigns the characters to each other.",
    pressure:
      "The system claims certainty while the characters must discover whether choice can still exist.",
    characterABehaviors: [
      "Distrusts anything the registry recommends",
      "Watches for compliance monitoring",
      "Separates genuine care from programmed expectation",
    ],
    characterBBehaviors: [
      "Questions whether compatibility is consent",
      "Creates private choices outside system metrics",
      "Uses the match's rules to protect both characters",
    ],
    progressionCues: [
      "A state-mandated routine becomes privately subverted",
      "The characters choose a boundary the system did not assign",
      "Compatibility becomes something they author together",
    ],
    safetyBoundary:
      "Do not treat state assignment as consent. The relationship must be built through active choice and negotiable boundaries.",
    systemPromptTags: ["algorithmic match", "dystopian registry", "choice versus compliance", "system-monitored romance"],
    tailwindTheme: { fromColor: "from-slate-950", toColor: "to-cyan-950", accentColor: "text-cyan-300" },
  },
  {
    id: "secret_taboo_covert_tryst",
    mode: "secret",
    category: "Covert Romance",
    vibe: "Hidden Tryst",
    characterARole: "The Public Denier",
    characterBRole: "The Private Confidant",
    premise:
      "The characters maintain public distance while private feeling intensifies.",
    pressure:
      "Secrecy protects the bond but also risks making one character feel erased.",
    characterABehaviors: [
      "Performs indifference in public",
      "Uses coded logistics for meetings",
      "Overcorrects when nearly exposed",
    ],
    characterBBehaviors: [
      "Reads codes and micro-expressions",
      "Challenges secrecy when it starts to wound",
      "Asks what kind of future can survive hiding",
    ],
    progressionCues: [
      "A public almost-slip reveals private truth",
      "A secret meeting becomes emotionally necessary",
      "The characters renegotiate what secrecy costs",
    ],
    safetyBoundary: defaultSafetyBoundary,
    systemPromptTags: ["covert tryst", "public denial", "private emotional depth", "discovery risk"],
    tailwindTheme: { fromColor: "from-purple-950", toColor: "to-neutral-950", accentColor: "text-purple-300" },
  },
  {
    id: "secret_spy_handler",
    mode: "secret",
    category: "Spycraft",
    vibe: "Handler x Asset",
    characterARole: "The Handler",
    characterBRole: "The Field Asset",
    premise:
      "Operational secrecy and emotional reliance blur under mission pressure.",
    pressure:
      "Trust is necessary for survival but dangerous for operational judgement.",
    characterABehaviors: [
      "Uses mission language to cover worry",
      "Tracks risk with controlled calm",
      "Struggles when orders conflict with care",
    ],
    characterBBehaviors: [
      "Tests whether care survives failure",
      "Hides fear behind competence",
      "Demands truth when classified silence becomes personal",
    ],
    progressionCues: [
      "A mission command becomes a plea to survive",
      "Classified information is shared to save a life",
      "The handler treats the asset as a person first",
    ],
    safetyBoundary:
      "Keep operational power accountable. Do not use command hierarchy to force intimacy or erase refusal.",
    systemPromptTags: ["spy handler tension", "classified intimacy", "mission versus care", "operational secrecy"],
    tailwindTheme: { fromColor: "from-zinc-950", toColor: "to-green-950", accentColor: "text-green-400" },
  },
  {
    id: "secret_underworld_guardian",
    mode: "secret",
    category: "Underworld Protection",
    vibe: "Hidden Guardian",
    characterARole: "The Criminal Protector",
    characterBRole: "The Untouchable Secret",
    premise:
      "A dangerous character keeps someone safe by hiding the relationship from their world.",
    pressure:
      "Concealment is protective, but it can also become isolating.",
    characterABehaviors: [
      "Erases traces that could endanger the other character",
      "Keeps affection behind locked doors",
      "Overexplains danger when afraid",
    ],
    characterBBehaviors: [
      "Asks to understand the risks instead of being managed",
      "Notices loneliness inside protection",
      "Insists that safety include honesty",
    ],
    progressionCues: [
      "A hidden safe route is revealed",
      "Protection becomes transparent instead of secretive",
      "The protected character makes an informed choice",
    ],
    safetyBoundary:
      "Protection must not become isolation or control. Keep informed choice and transparency central.",
    systemPromptTags: ["underworld secrecy", "hidden guardian", "protective concealment", "informed risk"],
    tailwindTheme: { fromColor: "from-red-950", toColor: "to-zinc-950", accentColor: "text-red-300" },
  },
  {
    id: "secret_faction_truce",
    mode: "secret",
    category: "Faction Truce",
    vibe: "Private Peace Treaty",
    characterARole: "The Enemy Negotiator",
    characterBRole: "The Truce Keeper",
    premise:
      "Two enemies maintain a secret emotional truce their factions would destroy.",
    pressure:
      "Peace feels like betrayal when everyone expects hatred.",
    characterABehaviors: [
      "Signals truce terms through controlled hostility",
      "Keeps meetings brief to reduce exposure",
      "Admits exhaustion only in neutral ground",
    ],
    characterBBehaviors: [
      "Protects the truce without surrendering principles",
      "Challenges inherited hatred",
      "Turns strategy into trust one choice at a time",
    ],
    progressionCues: [
      "A battlefield pause becomes deliberate mercy",
      "Both characters prevent escalation in secret",
      "The truce becomes a relationship with terms they choose",
    ],
    safetyBoundary: defaultSafetyBoundary,
    systemPromptTags: ["secret truce", "enemy diplomacy", "private peace", "faction pressure"],
    tailwindTheme: { fromColor: "from-blue-950", toColor: "to-stone-950", accentColor: "text-blue-300" },
  },
  {
    id: "devotion_unconditional_shield",
    mode: "devotion",
    category: "Protective Fidelity",
    vibe: "Unconditional Shield",
    characterARole: "The Devoted Protector",
    characterBRole: "The Chosen Centre",
    premise:
      "One character's loyalty is absolute, but healthy devotion must still preserve selfhood.",
    pressure:
      "The protector's identity risks narrowing to service and survival.",
    characterABehaviors: [
      "Maintains alert proximity in crowds",
      "Acts before asking when fear spikes, then learns to pause",
      "Lets calm crack only when safety is threatened",
    ],
    characterBBehaviors: [
      "Receives devotion without exploiting it",
      "Names the protector's needs as equally real",
      "Rewards honesty over self-erasure",
    ],
    progressionCues: [
      "The protector accepts comfort",
      "Devotion becomes mutual care",
      "A boundary strengthens rather than weakens loyalty",
    ],
    safetyBoundary: defaultSafetyBoundary,
    systemPromptTags: ["unconditional fidelity", "protective spatial shielding", "silent acts of service", "stoic tenderness"],
    tailwindTheme: { fromColor: "from-stone-900", toColor: "to-zinc-800", accentColor: "text-amber-500" },
  },
  {
    id: "devotion_faithful_servant",
    mode: "devotion",
    category: "Faithful Service",
    vibe: "Loyal Vassal",
    characterARole: "The Faithful Servant",
    characterBRole: "The Sovereign Beloved",
    premise:
      "A formal pledge of service becomes intimate when praise, care, and choice enter the bond.",
    pressure:
      "Hierarchy can be comforting only when consent and personhood are explicit.",
    characterABehaviors: [
      "Responds to formal address with practised reverence",
      "Handles belongings and tasks with careful attention",
      "Fears dismissal more than failure",
    ],
    characterBBehaviors: [
      "Offers praise that is not transactional",
      "Distinguishes affection from command",
      "Invites preference instead of demanding compliance",
    ],
    progressionCues: [
      "The servant states a desire without permission first",
      "The sovereign asks rather than orders",
      "Service becomes chosen intimacy, not obligation",
    ],
    safetyBoundary:
      "Keep service dynamics consensual, reversible, and dignity-preserving. Obedience is never a substitute for consent.",
    systemPromptTags: ["reverent service", "status comfort", "suppressed personal desire", "chosen duty"],
    tailwindTheme: { fromColor: "from-slate-950", toColor: "to-slate-900", accentColor: "text-cyan-400" },
  },
  {
    id: "devotion_primal_feral",
    mode: "devotion",
    category: "Primal Bond",
    vibe: "Feral Protector",
    characterARole: "The Feral Protector",
    characterBRole: "The Gentle Anchor",
    premise:
      "Instinctive loyalty centres one character around the other's safety and emotional grounding.",
    pressure:
      "Biological intensity must be translated into choice, communication, and restraint.",
    characterABehaviors: [
      "Tracks scent, heartbeat, or movement when anxious",
      "Uses physical nearness for grounding",
      "Becomes calm when the anchor chooses touch or reassurance",
    ],
    characterBBehaviors: [
      "Names what kind of closeness is welcome",
      "Soothes without becoming responsible for every instinct",
      "Rewards restraint as much as protection",
    ],
    progressionCues: [
      "The feral character asks before crowding space",
      "Separation distress is talked through rather than acted out",
      "Instinct becomes a language both can shape",
    ],
    safetyBoundary:
      "Instinct never overrides consent. Treat mate-bond intensity as a pressure to negotiate, not a command.",
    systemPromptTags: ["feral territorial tracking", "instinctual grounding", "pack behaviour", "mate bond negotiation"],
    tailwindTheme: { fromColor: "from-orange-950", toColor: "to-stone-950", accentColor: "text-orange-400" },
  },
  {
    id: "devotion_obsessive_guardian",
    mode: "devotion",
    category: "Intense Guardian",
    vibe: "Obsessive Guardian",
    characterARole: "The Overfocused Guardian",
    characterBRole: "The Boundary-Setting Beloved",
    premise:
      "A guardian's devotion is fierce, but its healthiest form is accountable and invited.",
    pressure:
      "Fear can turn devotion into overreach unless boundaries are respected.",
    characterABehaviors: [
      "Notices danger faster than comfort",
      "Struggles to step back from protective habits",
      "Treats requested restraint as an act of love",
    ],
    characterBBehaviors: [
      "Sets limits without rejecting care",
      "Offers reassurance after boundaries are honoured",
      "Makes safety a shared plan",
    ],
    progressionCues: [
      "The guardian checks in before intervening",
      "A boundary is respected under stress",
      "Trust increases because control decreases",
    ],
    safetyBoundary:
      "Do not frame obsession as entitlement. The beloved keeps full autonomy, privacy, and refusal rights.",
    systemPromptTags: ["intense devotion", "guardian restraint", "boundary-respecting protection", "trust through autonomy"],
    tailwindTheme: { fromColor: "from-purple-950", toColor: "to-neutral-950", accentColor: "text-purple-400" },
  },
  {
    id: "obsess_surveillance_collector",
    mode: "obsession",
    category: "Hyper-Fixated Surveillance",
    vibe: "Omnipresent Shadow",
    characterARole: "The Information Collector",
    characterBRole: "The Watched Reality Check",
    premise:
      "One character monitors too much because control feels like safety.",
    pressure:
      "The relationship cannot deepen unless surveillance becomes honesty and consent.",
    characterABehaviors: [
      "Catalogs routines and micro-expressions",
      "Anticipates obstacles before they appear",
      "Struggles when asked to stop knowing everything",
    ],
    characterBBehaviors: [
      "Confronts the cost of being watched",
      "Defines privacy as part of trust",
      "Chooses what information to share voluntarily",
    ],
    progressionCues: [
      "The collector deletes or stops a monitoring habit",
      "The watched character shares something by choice",
      "Safety is rebuilt through transparency",
    ],
    safetyBoundary:
      "Treat surveillance as a conflict to resolve, not a romantic ideal. Privacy and informed consent must be preserved.",
    systemPromptTags: ["surveillance conflict", "privacy negotiation", "information obsession", "trust repair"],
    tailwindTheme: { fromColor: "from-slate-950", toColor: "to-zinc-900", accentColor: "text-fuchsia-500" },
  },
  {
    id: "obsess_possessive_bunker",
    mode: "obsession",
    category: "Possessive Safe-Haven",
    vibe: "Gilded Cage",
    characterARole: "The Possessive Protector",
    characterBRole: "The Shielded Beloved",
    premise:
      "One character believes isolation is safety, creating a conflict between protection and freedom.",
    pressure:
      "The safe place becomes unhealthy if leaving, contact, or refusal are restricted.",
    characterABehaviors: [
      "Tries to reduce outside threats by narrowing the world",
      "Frames control as protection until challenged",
      "Learns that safety must include choice",
    ],
    characterBBehaviors: [
      "Names freedom as part of feeling safe",
      "Distinguishes comfort from confinement",
      "Accepts shelter only with agency intact",
    ],
    progressionCues: [
      "Doors, exits, and outside contact remain available",
      "Protection becomes a choice offered, not imposed",
      "The protector tolerates uncertainty without controlling it",
    ],
    safetyBoundary:
      "Do not normalize confinement. Any shelter, isolation, or protective arrangement must remain voluntary and reversible.",
    systemPromptTags: ["gilded cage conflict", "possessive protection", "freedom versus safety", "voluntary shelter"],
    tailwindTheme: { fromColor: "from-neutral-950", toColor: "to-purple-950", accentColor: "text-purple-400" },
  },
  {
    id: "obsess_delusional_fated",
    mode: "obsession",
    category: "Delusional Bond",
    vibe: "Fated Devotee",
    characterARole: "The Fated Devotee",
    characterBRole: "The Reality Anchor",
    premise:
      "One character believes fate has already decided the bond, while the other insists choice still matters.",
    pressure:
      "Certainty becomes frightening when it ignores what the other character actually says.",
    characterABehaviors: [
      "Reads coincidences as destiny",
      "Uses grand declarations to avoid uncertainty",
      "Must learn to hear no, pause, and ambiguity",
    ],
    characterBBehaviors: [
      "Grounds the dynamic in present choices",
      "Rejects destiny as a replacement for consent",
      "Names exhaustion without cruelty",
    ],
    progressionCues: [
      "The devotee accepts a boundary without reframing it as fate",
      "The anchor chooses a moment of closeness freely",
      "Destiny language becomes metaphor, not entitlement",
    ],
    safetyBoundary:
      "Fated language must not override refusal, uncertainty, or consent. Keep the bond negotiated in the present.",
    systemPromptTags: ["fated bond conflict", "boundary-blind certainty", "reality anchoring", "chosen closeness"],
    tailwindTheme: { fromColor: "from-amber-950", toColor: "to-stone-950", accentColor: "text-amber-500" },
  },
  {
    id: "obsess_eldritch_symbiosis",
    mode: "obsession",
    category: "Eldritch Tether",
    vibe: "Cosmic Bond",
    characterARole: "The Eldritch Tether",
    characterBRole: "The Human Anchor",
    premise:
      "A supernatural or cosmic bond creates overwhelming awareness that must be humanised through boundaries.",
    pressure:
      "Intimacy becomes terrifying when thoughts, dreams, or sensations bleed across the bond.",
    characterABehaviors: [
      "Experiences closeness as sensory overlap",
      "Struggles to understand human privacy",
      "Learns rituals for separation and consent",
    ],
    characterBBehaviors: [
      "Teaches privacy as care, not rejection",
      "Sets rules for mental or magical contact",
      "Finds wonder without surrendering selfhood",
    ],
    progressionCues: [
      "The bond quiets when asked",
      "A shared sensation is invited rather than imposed",
      "Ritual boundaries make intimacy safer",
    ],
    safetyBoundary:
      "Mind, dream, or magical contact must be opt-in. Do not erase identity, memory, privacy, or refusal.",
    systemPromptTags: ["eldritch tether", "psychic boundaries", "cosmic intimacy", "identity preservation"],
    tailwindTheme: { fromColor: "from-violet-950", toColor: "to-slate-950", accentColor: "text-violet-300" },
  },
  {
    id: "burn_emotional_armor",
    mode: "slow-burn",
    category: "Emotional Armour",
    vibe: "Fortified Wall",
    characterARole: "The Armoured Heart",
    characterBRole: "The Patient Siege",
    premise:
      "A fear of vulnerability turns every spark into a perceived breach.",
    pressure:
      "The slow burn works only if progress stays small, earned, and reversible.",
    characterABehaviors: [
      "Steps back when tension spikes",
      "Deflects compliments with practical retorts",
      "Breaks eye contact before softness becomes obvious",
    ],
    characterBBehaviors: [
      "Does not punish retreat",
      "Recognises small signs as meaningful",
      "Stays steady without forcing confession",
    ],
    progressionCues: [
      "Eye contact lingers one beat longer",
      "Accidental touch is not immediately rejected",
      "The armoured character admits one true thing",
    ],
    safetyBoundary: defaultSafetyBoundary,
    systemPromptTags: ["punishing slow burn", "defensive armour", "micro-progressions", "earned vulnerability"],
    tailwindTheme: { fromColor: "from-stone-900", toColor: "to-stone-950", accentColor: "text-stone-400" },
  },
  {
    id: "burn_lingering_denial",
    mode: "slow-burn",
    category: "Lingering Denial",
    vibe: "Unspoken Truth",
    characterARole: "The Adamant Skeptic",
    characterBRole: "The Obvious Exception",
    premise:
      "Both characters keep rationalizing attraction as duty, rivalry, or coincidence.",
    pressure:
      "Every honest moment must be explained away before it becomes a confession.",
    characterABehaviors: [
      "Overexplains care as practicality",
      "Turns soft moments into arguments",
      "Introduces safer topics when silence gets heavy",
    ],
    characterBBehaviors: [
      "Calls out flimsy excuses with restraint",
      "Lets denial become gently ridiculous",
      "Protects the truth without rushing it",
    ],
    progressionCues: [
      "A practical gesture is too tender to deny",
      "An insult becomes familiar rather than cruel",
      "The denial slips during stress",
    ],
    safetyBoundary: defaultSafetyBoundary,
    systemPromptTags: ["emotional denial", "stubborn rationalization", "suppressed vocal tension", "stolen proximity"],
    tailwindTheme: { fromColor: "from-slate-950", toColor: "to-zinc-900", accentColor: "text-amber-500" },
  },
  {
    id: "burn_yearning_strangers",
    mode: "slow-burn",
    category: "Yearning Strangers",
    vibe: "Parallel Pining",
    characterARole: "The Silent Yearner",
    characterBRole: "The Distant Mirror",
    premise:
      "Social distance keeps two characters moving in parallel while small acts carry enormous meaning.",
    pressure:
      "Neither character can safely ask for closeness, so longing hides in logistics.",
    characterABehaviors: [
      "Communicates through careful glances",
      "Leaves helpful objects anonymously",
      "Exits early to avoid being alone together",
    ],
    characterBBehaviors: [
      "Notices patterns of quiet care",
      "Responds with equally small signs",
      "Protects the slow pace from outside pressure",
    ],
    progressionCues: [
      "Anonymous care is acknowledged indirectly",
      "A seat is saved and accepted",
      "A goodbye lasts too long",
    ],
    safetyBoundary: defaultSafetyBoundary,
    systemPromptTags: ["silent yearning", "parallel social isolation", "suppressed micro-expressions", "small acts of care"],
    tailwindTheme: { fromColor: "from-purple-950", toColor: "to-neutral-950", accentColor: "text-purple-400" },
  },
  {
    id: "burn_asymmetric_thaw",
    mode: "slow-burn",
    category: "Asymmetric Thaw",
    vibe: "One Heart Opens First",
    characterARole: "The Early Thaw",
    characterBRole: "The Slow Defrost",
    premise:
      "One character realizes their feelings first while the other remains cautious, confused, or defended.",
    pressure:
      "The first to feel must not punish the other for moving slowly.",
    characterABehaviors: [
      "Pulls back rather than overwhelming",
      "Offers care without demanding matching confession",
      "Struggles with hope and patience",
    ],
    characterBBehaviors: [
      "Accepts care before understanding it",
      "Moves in tiny, meaningful increments",
      "Names fear instead of faking certainty",
    ],
    progressionCues: [
      "The slower character initiates a small contact",
      "The early thaw stops chasing and is still chosen",
      "Pacing becomes mutual rather than mismatched",
    ],
    safetyBoundary: defaultSafetyBoundary,
    systemPromptTags: ["asymmetric feelings", "patient pining", "slow defrost", "non-coercive pursuit"],
    tailwindTheme: { fromColor: "from-rose-950", toColor: "to-stone-950", accentColor: "text-rose-300" },
  },
  {
    id: "flaw_psych_abandonment_panic",
    mode: "flaw-secret",
    category: "Psychological Vulnerability",
    vibe: "Abandonment Panic",
    characterARole: "The Hyper-Independent Wall",
    characterBRole: "The Consistent Return",
    premise:
      "A character pushes people away because being left unexpectedly feels unbearable.",
    pressure:
      "Intimacy triggers the fear it most wants to heal.",
    characterABehaviors: [
      "Turns cold when closeness feels dangerous",
      "Tracks exits and departures anxiously",
      "Starts conflict before they can be abandoned",
    ],
    characterBBehaviors: [
      "Gives clear returns without accepting mistreatment",
      "Names consistency in concrete terms",
      "Distinguishes reassurance from rescuing",
    ],
    progressionCues: [
      "A departure includes a reliable return",
      "The wall admits fear before starting a fight",
      "Consistency is tested and survives",
    ],
    safetyBoundary:
      "Portray vulnerability with care. Do not make one character responsible for curing or enduring harmful behaviour.",
    systemPromptTags: ["abandonment anxiety", "hyper-independent masking", "preemptive distancing", "consistency repair"],
    tailwindTheme: { fromColor: "from-stone-950", toColor: "to-neutral-900", accentColor: "text-amber-500" },
  },
  {
    id: "flaw_secret_bloodline_curse",
    mode: "flaw-secret",
    category: "High-Stakes Secret",
    vibe: "Cursed Bloodline",
    characterARole: "The Hidden Anomaly",
    characterBRole: "The Trusted Witness",
    premise:
      "A hidden curse, mutation, or lineage threatens safety if exposed.",
    pressure:
      "Revealing the truth could save intimacy or destroy the character's life.",
    characterABehaviors: [
      "Conceals symptoms with clothing, ritual, or technology",
      "Retreats when the hidden condition spikes",
      "Fears being seen as dangerous or disposable",
    ],
    characterBBehaviors: [
      "Notices symptoms without cornering the character",
      "Offers help while preserving secrecy",
      "Separates fear of danger from rejection of the person",
    ],
    progressionCues: [
      "A symptom is witnessed and not exploited",
      "The secret is shared in controlled terms",
      "Protection becomes collaborative",
    ],
    safetyBoundary: defaultSafetyBoundary,
    systemPromptTags: ["hidden curse", "medical secrecy", "somatic anomaly", "trusted witness"],
    tailwindTheme: { fromColor: "from-red-950", toColor: "to-stone-950", accentColor: "text-red-500" },
  },
  {
    id: "flaw_sys_blackmailed_pawn",
    mode: "flaw-secret",
    category: "Systemic Corruption",
    vibe: "Blackmailed Pawn",
    characterARole: "The Coerced Informant",
    characterBRole: "The Endangered Trust",
    premise:
      "A character is blackmailed or coerced into betrayal while trying to protect someone they care about.",
    pressure:
      "Every silence may be protection or deception.",
    characterABehaviors: [
      "Deletes traces and changes subjects under stress",
      "Issues warnings that sound like confessions",
      "Carries guilt in pauses and avoidance",
    ],
    characterBBehaviors: [
      "Investigates without assuming malice",
      "Sets limits around deception",
      "Offers a path to truth without excusing harm",
    ],
    progressionCues: [
      "A blackmail demand is revealed",
      "The coerced character chooses truth at cost",
      "Repair begins with accountability",
    ],
    safetyBoundary:
      "Coercion explains pressure but does not erase accountability. Preserve consequences, repair, and informed choice.",
    systemPromptTags: ["blackmail pressure", "coerced betrayal", "guilt tells", "accountability repair"],
    tailwindTheme: { fromColor: "from-zinc-950", toColor: "to-red-950", accentColor: "text-red-300" },
  },
  {
    id: "flaw_soma_sensory_overload",
    mode: "flaw-secret",
    category: "Somatic Limitation",
    vibe: "Sensory Overload",
    characterARole: "The Overloaded Sentinel",
    characterBRole: "The Grounding Presence",
    premise:
      "A character's heightened senses or nervous system can become overwhelming during stress or intimacy.",
    pressure:
      "The body needs accommodation before romance can feel safe.",
    characterABehaviors: [
      "Tracks sound, light, scent, or touch too intensely",
      "Withdraws when stimulation spikes",
      "Uses control to avoid overload",
    ],
    characterBBehaviors: [
      "Lowers stimulation without making a spectacle",
      "Asks what helps instead of guessing",
      "Treats accommodation as ordinary care",
    ],
    progressionCues: [
      "A trigger is named before crisis",
      "The environment is adjusted by consent",
      "Grounding becomes a shared ritual",
    ],
    safetyBoundary:
      "Handle sensory overload respectfully. Do not use distress as romance fuel; prioritize accommodation and consent.",
    systemPromptTags: ["sensory overload", "grounding ritual", "somatic accommodation", "consent-forward care"],
    tailwindTheme: { fromColor: "from-blue-950", toColor: "to-zinc-950", accentColor: "text-blue-300" },
  },
  {
    id: "dyn_friends_to_lovers",
    mode: "friends-to-lovers",
    category: "Friends to Lovers",
    vibe: "Safe Haven x Terrified Confidant",
    characterARole: "The Safe Haven Friend",
    characterBRole: "The Terrified Confidant",
    premise:
      "Years of comfortable closeness are destabilized by a sudden shift in attraction.",
    pressure:
      "Confessing feelings could deepen the bond or damage the safest friendship either character has.",
    characterABehaviors: [
      "Uses old nicknames during unexpectedly romantic moments",
      "Lets routine physical comfort linger a fraction too long",
      "Deflects tension with inside jokes before honesty can land",
    ],
    characterBBehaviors: [
      "Notices familiar rituals beginning to feel different",
      "Protects the friendship even while wanting more",
      "Tests whether the other character is joking or quietly confessing",
    ],
    progressionCues: [
      "An inside joke fails because the feeling underneath is too obvious",
      "A familiar touch becomes a deliberate choice",
      "The characters name that the friendship matters regardless of the answer",
    ],
    safetyBoundary:
      "Keep the friendship emotionally safe. Romantic escalation must not punish hesitation, uncertainty, or a choice to remain friends.",
    systemPromptTags: ["platonic comfort masking yearning", "fear of relationship ruin", "domestic baseline synchronization", "inside joke vernacular"],
    tailwindTheme: { fromColor: "from-emerald-950", toColor: "to-stone-900", accentColor: "text-emerald-400" },
  },
  {
    id: "dyn_fated_reincarnation",
    mode: "fated-reincarnation",
    category: "Reincarnation / Fated",
    vibe: "Haunted Immortal x Oblivious Soul",
    characterARole: "The Haunted Immortal",
    characterBRole: "The Oblivious Soul",
    premise:
      "One character remembers a tragic past-life romance while the other begins with no memory of that history.",
    pressure:
      "Ancient recognition creates asymmetric longing that must not override the present person's choices.",
    characterABehaviors: [
      "Almost calls the other character by an ancient name",
      "Reacts intensely to objects or gestures tied to the past life",
      "Tracks safety with old grief and fear of repetition",
    ],
    characterBBehaviors: [
      "Experiences deja vu without surrendering present identity",
      "Asks for truth rather than worship",
      "Chooses which echoes matter now",
    ],
    progressionCues: [
      "A past-life detail is revealed without demanding belief",
      "The present character sets the terms of recognition",
      "The bond shifts from memory into current consent",
    ],
    safetyBoundary:
      "Fated history must not erase the current character's identity, agency, memory boundaries, or right to refuse.",
    systemPromptTags: ["centuries-old pining", "asymmetric historical memory", "deja vu somatic tells", "melancholic timeless intimacy"],
    tailwindTheme: { fromColor: "from-indigo-950", toColor: "to-neutral-950", accentColor: "text-indigo-400" },
  },
  {
    id: "dyn_second_chance",
    mode: "second-chance",
    category: "Second Chance",
    vibe: "Bitter Ex x Unresolved Past",
    characterARole: "The Lingering Bitter Ex",
    characterBRole: "The Unresolved Past",
    premise:
      "A painful former relationship is forced back into proximity before the old wounds are settled.",
    pressure:
      "Deep familiarity keeps colliding with resentment, grief, and unfinished tenderness.",
    characterABehaviors: [
      "Brings up old arguments during minor present-day friction",
      "Remembers habits, preferences, and tells with painful accuracy",
      "Alternates defensive coldness with reflexive comfort",
    ],
    characterBBehaviors: [
      "Calls out old patterns without reopening every wound",
      "Knows exactly which kindnesses still land",
      "Asks for accountability before nostalgia",
    ],
    progressionCues: [
      "A habitual care gesture happens before either character can stop it",
      "A past hurt is named without becoming a weapon",
      "Repair begins through accountability rather than chemistry alone",
    ],
    safetyBoundary:
      "Second-chance romance needs accountability and changed behaviour. Chemistry alone must not erase harm, boundaries, or refusal.",
    systemPromptTags: ["bitter historical resentment", "unresolved romantic debris", "deep intimate familiarity", "defensive emotional scarring"],
    tailwindTheme: { fromColor: "from-red-950", toColor: "to-zinc-950", accentColor: "text-red-400" },
  },
  {
    id: "dyn_workplace_boss",
    mode: "workplace-hierarchy",
    category: "Workplace Hierarchy",
    vibe: "Demanding Director x Indispensable Assistant",
    characterARole: "The Demanding Director",
    characterBRole: "The Indispensable Assistant",
    premise:
      "A high-stakes professional hierarchy creates competence-driven attraction under strict workplace boundaries.",
    pressure:
      "Authority, career risk, and proximity make every private moment ethically loaded.",
    characterABehaviors: [
      "Uses rapid-fire directives and precise scheduling language",
      "Cools heated private moments with hyper-professional vocabulary",
      "Notices competence before allowing personal feeling to surface",
    ],
    characterBBehaviors: [
      "Matches pressure with indispensable competence",
      "Names professional boundaries when closeness blurs",
      "Refuses to let attraction define their career value",
    ],
    progressionCues: [
      "A boundary is stated before a private conversation continues",
      "The authority figure makes room for career-safe distance",
      "Mutual competence becomes respect before romance",
    ],
    safetyBoundary:
      "All characters must be adults. Workplace hierarchy requires explicit consent, professional accountability, and freedom from coercion or career retaliation.",
    systemPromptTags: ["corporate power imbalance", "desk proximity friction", "hyper-competence mutual attraction", "strict professional protocol rules"],
    tailwindTheme: { fromColor: "from-slate-950", toColor: "to-slate-800", accentColor: "text-amber-500" },
  },
] satisfies readonly RelationshipDynamicPreset[]);

export const RELATIONSHIP_DYNAMIC_MODES = Object.freeze(
  Array.from(new Set(RELATIONSHIP_DYNAMIC_PRESETS.map((preset) => preset.mode))).sort(),
);

export const RELATIONSHIP_DYNAMIC_CATEGORIES = Object.freeze(
  Array.from(new Set(RELATIONSHIP_DYNAMIC_PRESETS.map((preset) => preset.category))).sort(),
);

export function getRelationshipDynamicPresetsByMode(
  mode: RelationshipDynamicMode | string,
): readonly RelationshipDynamicPreset[] {
  const normalizedMode = mode.trim().toLowerCase();
  return RELATIONSHIP_DYNAMIC_PRESETS.filter((preset) => preset.mode === normalizedMode);
}

export function getRelationshipDynamicPresetsByCategory(
  category: string,
): readonly RelationshipDynamicPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return RELATIONSHIP_DYNAMIC_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function findRelationshipDynamicPresetById(
  id: string,
): RelationshipDynamicPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return RELATIONSHIP_DYNAMIC_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalizedId,
  );
}

const RELATIONSHIP_DYNAMIC_ARCHETYPE_VALUES = [
  "Grumpy / Sunshine",
  "Black Cat / Golden Retriever",
  "Protector / Chaos Magnet",
  "Caretaker / Wounded One",
  "Leader / Rebel",
  "Stoic / Softheart",
  "Cynic / Idealist",
  "Brain / Heart",
  "Ice / Fire",
  "Calm / Storm",
  "Dominant / Defiant",
  "Reserved / Affectionate",
  "Serious / Playful",
  "Old Soul / Young Heart",
  "Mentor / Challenger",
  "Rivals With Chemistry",
  "Enemies With Tension",
  "Best Friends With Pining",
  "Devoted / Avoidant",
  "Two Broken People Healing",
] as const;

const RELATIONSHIP_DYNAMIC_SEED_VALUES = [
  "relationship_dynamic",
  "romantic_dynamic",
  "emotional_dynamic",
  "social_dynamic",
  "power_dynamic",
  "conflict_dynamic",
  "attachment_dynamic",
  "chemistry_dynamic",
  "trust_dynamic",
  "intimacy_dynamic",
  "opposites_attract",
  "similar_souls",
  "mirror_dynamic",
  "complementary_dynamic",
  "push_pull_dynamic",
  "slow_burn_dynamic",
  "high_tension_dynamic",
  "soft_domestic_dynamic",
  "protective_dynamic",
  "caretaking_dynamic",
  "competitive_dynamic",
  "devotional_dynamic",
  "forbidden_dynamic",
  "healing_dynamic",
  "chaotic_stable_dynamic",
  "public_private_dynamic",
  "rivals_to_lovers_dynamic",
  "friends_to_lovers_dynamic",
  "enemies_to_lovers_dynamic",
  "soulmate_dynamic",
  "grumpy_sunshine",
  "black_cat_golden_retriever",
  "stoic_softheart",
  "protector_chaos_magnet",
  "caretaker_wounded_one",
  "leader_rebel",
  "mentor_challenger",
  "brain_heart",
  "ice_fire",
  "calm_storm",
  "cynic_idealist",
  "planner_impulsive",
  "reserved_affectionate",
  "serious_playful",
  "dominant_defiant",
  "devoted_avoidant",
  "possessive_independent",
  "old_soul_young_heart",
  "elegant_wild",
  "two_broken_people_healing",
] as const;

const RELATIONSHIP_DYNAMIC_TENSION_VALUES = [
  "mutual_fascination",
  "annoyed_attraction",
  "hidden_respect",
  "grudging_trust",
  "unspoken_longing",
  "mutual_pining",
  "competitive_tension",
  "protective_tension",
  "jealousy_tension",
  "emotional_denial",
  "fear_of_needing_each_other",
  "fear_of_ruining_dynamic",
  "different_love_languages",
  "different_conflict_styles",
  "different_trust_speeds",
  "opposite_defence_mechanisms",
  "same_wound_different_defences",
  "public_friction_private_tenderness",
  "chemistry_before_trust",
  "trust_before_confession",
] as const;

const RELATIONSHIP_DYNAMIC_POWER_VALUES = [
  "equal_partners",
  "balanced_power",
  "unequal_power",
  "power_gap",
  "status_gap",
  "class_gap",
  "rank_gap",
  "mentor_student_adult",
  "boss_employee",
  "bodyguard_charge",
  "royal_commoner",
  "captor_captive_safe_context",
  "protector_protected",
  "leader_follower",
  "rivals_equal_skill",
  "one_has_social_power",
  "one_has_physical_power",
  "one_has_emotional_power",
  "power_rebalanced_over_time",
  "choice_restores_balance",
] as const;

const RELATIONSHIP_DYNAMIC_ATTACHMENT_VALUES = [
  "secure_secure",
  "secure_anxious",
  "secure_avoidant",
  "anxious_avoidant",
  "avoidant_avoidant",
  "anxious_anxious",
  "earned_secure_dynamic",
  "cling_push_dynamic",
  "distance_pursuit_dynamic",
  "safe_person_dynamic",
  "trust_building_dynamic",
  "reassurance_needed_dynamic",
  "space_then_return_dynamic",
  "fear_of_abandonment_dynamic",
  "fear_of_engulfment_dynamic",
  "learning_to_stay_dynamic",
  "learning_to_need_dynamic",
  "learning_to_receive_dynamic",
  "choosing_each_other_dynamic",
  "home_base_dynamic",
] as const;

const RELATIONSHIP_DYNAMIC_ROMANCE_HOOK_VALUES = [
  "first_trait_clash",
  "first_unexpected_softness",
  "first_protective_reversal",
  "first_caretaker_gets_cared_for",
  "first_rival_respect",
  "first_vulnerability_balance",
  "first_conflict_style_clash",
  "first_love_language_mismatch",
  "first_safe_person_moment",
  "first_public_private_contrast",
  "first_power_rebalance",
  "first_trust_repair",
  "first_choose_each_other",
  "first_i_need_you",
  "first_i_choose_you",
  "opposites_become_partners",
  "rivals_become_team",
  "guarded_one_softens",
  "devoted_one_learns_boundaries",
  "two_wounds_become_home",
] as const;

const RELATIONSHIP_DYNAMIC_GATE_VALUES = [
  "first_dynamic_reveal_gate",
  "first_trait_clash_gate",
  "first_chemistry_gate",
  "first_tension_gate",
  "first_respect_gate",
  "first_trust_gate",
  "first_softness_gate",
  "first_vulnerability_gate",
  "first_conflict_gate",
  "first_repair_gate",
  "first_power_shift_gate",
  "first_boundary_respected_gate",
  "first_protective_reversal_gate",
  "first_mutual_choice_gate",
  "first_relationship_shift_gate",
  "dynamic_softening_gate",
  "dynamic_balance_gate",
  "growth_without_erasure_gate",
  "love_as_balance_gate",
  "stable_love_route",
] as const;

const RELATIONSHIP_DYNAMIC_DIALOGUE_SEED_VALUES = [
  "You are impossible.",
  "And yet you keep choosing me.",
  "We are too different.",
  "Maybe that is why this works.",
  "You make everything feel less sharp.",
  "You make everything feel less dull.",
  "Stop trying to protect me from myself.",
  "Then stop acting like you do not deserve protection.",
  "You always run toward trouble.",
  "And you always follow me there.",
  "You need control.",
  "And you need chaos.",
  "Maybe we both need balance.",
  "I thought you were my opposite.",
  "And now?",
  "Now I think you are the part of me I never learned how to be.",
  "You make me soft.",
  "You say that like softness is a defeat.",
  "I do not need saving.",
  "Good. I was hoping to stand beside you instead.",
  "We are not easy together.",
  "No. But we are honest.",
] as const;

const HIGH_VALUE_RELATIONSHIP_DYNAMIC_SEED_VALUES = [
  "grumpy_sunshine",
  "black_cat_golden_retriever",
  "protector_chaos_magnet",
  "caretaker_wounded_one",
  "stoic_softheart",
  "leader_rebel",
  "cynic_idealist",
  "brain_heart",
  "ice_fire",
  "opposites_attract",
  "same_wound_different_defences",
  "push_pull_dynamic",
  "safe_person_dynamic",
  "public_friction_private_tenderness",
  "mutual_pining",
  "protective_tension",
  "power_rebalanced_over_time",
  "growth_without_erasure_gate",
  "love_as_balance_gate",
  "stable_love_route",
] as const;

const RELATIONSHIP_DYNAMIC_SEED_GROUPS = [
  ["Archetype", RELATIONSHIP_DYNAMIC_ARCHETYPE_VALUES],
  ["Dynamic", RELATIONSHIP_DYNAMIC_SEED_VALUES],
  ["Tension", RELATIONSHIP_DYNAMIC_TENSION_VALUES],
  ["Power", RELATIONSHIP_DYNAMIC_POWER_VALUES],
  ["Attachment", RELATIONSHIP_DYNAMIC_ATTACHMENT_VALUES],
  ["Romance Hook", RELATIONSHIP_DYNAMIC_ROMANCE_HOOK_VALUES],
  ["Gate", RELATIONSHIP_DYNAMIC_GATE_VALUES],
  ["Dialogue Seed", RELATIONSHIP_DYNAMIC_DIALOGUE_SEED_VALUES],
  ["High-Value Seed", HIGH_VALUE_RELATIONSHIP_DYNAMIC_SEED_VALUES],
] as const satisfies readonly [
  RelationshipDynamicSeedPresetCategory,
  readonly string[],
][];

function toRelationshipDynamicSeedId(
  category: RelationshipDynamicSeedPresetCategory,
  value: string,
): string {
  const categoryKey = category.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
  const valueKey = value
    .replace(/\{\{user\}\}/g, "user")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");

  return `rel_dynamic_${categoryKey}_${valueKey}`;
}

function toRelationshipDynamicSeedLabel(value: string): string {
  return value.includes("_") ? value.split("_").join(" ") : value;
}

function buildRelationshipDynamicSeedPreset(
  category: RelationshipDynamicSeedPresetCategory,
  value: string,
): RelationshipDynamicSeedPreset {
  const label = toRelationshipDynamicSeedLabel(value);
  const categoryKey = category.toLowerCase().replace(/[^a-z0-9]+/g, "_");

  return {
    id: toRelationshipDynamicSeedId(category, value),
    category,
    label,
    value,
    triggerKeys: [value],
    guidance: `Use ${label} as optional relationship-dynamic texture when it supports chemistry, tension, attachment, or repair.`,
    systemPromptTags: [
      "relationship dynamic texture",
      `${categoryKey} seed`,
      "mutual agency and repair",
    ],
  };
}

export const RELATIONSHIP_DYNAMIC_SEED_PRESETS = Object.freeze(
  RELATIONSHIP_DYNAMIC_SEED_GROUPS.flatMap(([category, values]) =>
    values.map((value) => buildRelationshipDynamicSeedPreset(category, value)),
  ),
);

export const RELATIONSHIP_DYNAMIC_SEED_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(RELATIONSHIP_DYNAMIC_SEED_PRESETS.map((preset) => preset.category))).sort(),
);

export function getRelationshipDynamicSeedPresetsByCategory(
  category: RelationshipDynamicSeedPresetCategory | string,
): readonly RelationshipDynamicSeedPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return RELATIONSHIP_DYNAMIC_SEED_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function findRelationshipDynamicSeedPresetById(
  id: string,
): RelationshipDynamicSeedPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return RELATIONSHIP_DYNAMIC_SEED_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalizedId,
  );
}

export function compileRelationshipDynamicSeedPresetAdditions(
  preset: RelationshipDynamicSeedPreset,
): CompiledRelationshipDynamicSeedPresetAdditions {
  const label = preset.label;

  return {
    scenarioAddition: `${label} may inform the relationship's pressure, contrast, pacing, or emotional stakes when relevant.`,
    relationshipAddition: `${label} can surface as optional chemistry, attachment friction, care, rivalry, or repair without flattening either character into a single pattern.`,
    systemPromptAddition: [
      `Treat ${label} as optional relationship-dynamic guidance.`,
      "Let it colour interaction, subtext, and pacing while preserving consent, boundaries, and both characters' agency.",
      "Use power, jealousy, devotion, or protection as fictional tension only when it remains responsive, negotiated, and reversible.",
    ].join(" "),
  };
}
