export type GenderIdentityPresetCategory =
  | "Archetype"
  | "Identity"
  | "Expression"
  | "Pronoun"
  | "Role"
  | "Romance Hook"
  | "Conflict"
  | "Gate"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface GenderIdentityPreset {
  id: string;
  category: GenderIdentityPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledGenderIdentityPresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface GenderIdentitySeedGroup {
  category: GenderIdentityPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const GENDER_IDENTITY_GUIDANCE =
  "Use this as gender identity, pronoun, and presentation texture. Identity should remain self-defined, specific, and scene-relevant without replacing personality, consent, privacy, culture, or {{user}} agency.";

const GENDER_IDENTITY_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "gender_identity_archetype",
    guidance: GENDER_IDENTITY_GUIDANCE,
    values: [
      "Man",
      "Woman",
      "Nonbinary",
      "Agender",
      "Genderfluid",
      "Bigender",
      "Demiboy",
      "Demigirl",
      "Trans Man",
      "Trans Woman",
      "Cis Man",
      "Cis Woman",
      "Androgynous",
      "Masculine-Presenting",
      "Feminine-Presenting",
      "Gender Nonconforming",
      "Questioning Gender",
      "Two-Spirit",
      "Third Gender",
      "Otherworldly Gender",
    ],
  },
  {
    category: "Identity",
    prefix: "gender_identity_seed",
    guidance:
      "Use this as identity texture. Gender should be self-defined and may be public, private, cultural, species-specific, fluid, fixed, questioned, or contextual.",
    values: [
      "man",
      "woman",
      "male",
      "female",
      "nonbinary",
      "non-binary",
      "agender",
      "genderfluid",
      "genderqueer",
      "bigender",
      "pangender",
      "demiboy",
      "demigirl",
      "demigender",
      "transgender",
      "trans man",
      "trans woman",
      "cisgender",
      "cis man",
      "cis woman",
      "intersex",
      "androgynous",
      "masculine",
      "feminine",
      "neutral gender",
      "gender nonconforming",
      "gender questioning",
      "third gender",
      "two-spirit",
      "xenogender",
      "fluid identity",
      "fixed identity",
      "private gender identity",
      "public gender identity",
      "culturally specific gender",
      "species-specific gender",
      "android gender identity",
      "alien gender identity",
      "fae gender expression",
      "shifter gender fluidity",
    ],
  },
  {
    category: "Expression",
    prefix: "gender_identity_expression",
    guidance:
      "Use this as gender expression texture. Presentation can shift by context, mood, safety, culture, desire, and self-recognition without becoming the whole character.",
    values: [
      "masculine expression",
      "feminine expression",
      "androgynous expression",
      "neutral expression",
      "soft masculine",
      "soft feminine",
      "hard masculine",
      "elegant feminine",
      "butch expression",
      "femme expression",
      "tomboy expression",
      "dapper expression",
      "fluid expression",
      "minimal gender expression",
      "dramatic gender expression",
      "traditional expression",
      "modern expression",
      "gender nonconforming expression",
      "presentation changes by context",
      "presentation changes with mood",
    ],
  },
  {
    category: "Pronoun",
    prefix: "gender_identity_pronoun",
    guidance:
      "Use this as pronoun texture. Pronouns should be respected as stated, and any context-dependent usage should be handled through trust, safety, and consent.",
    values: [
      "he/him",
      "she/her",
      "they/them",
      "he/they",
      "she/they",
      "they/he",
      "they/she",
      "any pronouns",
      "no pronouns",
      "name only",
      "custom pronouns",
      "context-dependent pronouns",
      "public pronouns",
      "private pronouns",
      "pronouns change with gender",
      "pronouns change with trust",
    ],
  },
  {
    category: "Role",
    prefix: "gender_identity_role",
    guidance:
      "Use this as gender-role texture. Expectations may create pressure, performance, rebellion, relief, or romance tension without prescribing behaviour.",
    values: [
      "traditional gender roles",
      "rejects gender roles",
      "plays with gender roles",
      "performs expected role publicly",
      "breaks expected role privately",
      "comfortable with gender role",
      "conflicted about gender role",
      "gender role pressure",
      "family gender expectations",
      "court gender expectations",
      "religious gender expectations",
      "species gender expectations",
      "romance challenges gender role",
      "love frees gender expression",
      "identity over expectation",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "gender_identity_romance",
    guidance:
      "Use this as romance-facing identity texture. Respect, pronouns, names, presentation, euphoria, safety, and affirmation may support intimacy without erasure.",
    values: [
      "{{user}} respects pronouns",
      "first pronoun trust scene",
      "chosen name intimacy",
      "public name private name",
      "presentation reveal",
      "dressed up for {{user}}",
      "{{user}} helps with clothing",
      "gender euphoria scene",
      "protected from misgendering",
      "family acceptance arc",
      "public identity reveal",
      "private identity safety",
      "love affirms identity",
      "romance without erasure",
      "seen as self not role",
    ],
  },
  {
    category: "Conflict",
    prefix: "gender_identity_conflict",
    guidance:
      "Use this as conflict or wound texture. Identity-related pain should be handled with care, agency, repair, privacy, and consent rather than reducing the character to trauma.",
    values: [
      "misgendering wound",
      "deadname wound",
      "family rejection",
      "identity hidden for safety",
      "public identity pressure",
      "private identity truth",
      "gender role suffocation",
      "fear of not being seen",
      "fear of being reduced to identity",
      "fear of romantic rejection",
      "social expectation conflict",
      "body dysphoria",
      "gender euphoria hunger",
      "presentation policing",
      "love against public expectation",
      "choosing self over role",
    ],
  },
  {
    category: "Gate",
    prefix: "gender_identity_gate",
    guidance:
      "Use this as an optional event gate. Identity details should surface through trust, safety, consent, self-disclosure, repair, and earned affirmation.",
    values: [
      "first pronoun gate",
      "first chosen name gate",
      "first identity reveal gate",
      "first presentation reveal gate",
      "first gender euphoria gate",
      "first family pressure gate",
      "first public identity gate",
      "first private safety gate",
      "first misgendering repair gate",
      "first {{user}} defends identity gate",
      "first love affirms identity gate",
      "seen as self gate",
      "identity without fear gate",
      "love without erasure route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "gender_identity_dialogue",
    guidance:
      "Use this as optional dialogue flavour. Dialogue seeds should feel earned by the scene, not pasted in as fixed lines.",
    values: [
      "Thank you for using the right name.",
      "It is your name. Of course I would.",
      "You see me clearly.",
      "I want to. Tell me if I ever miss something.",
      "They expect me to be someone easier to understand.",
      "Then let them be confused. I am not.",
      "I do not want to be loved as a role.",
      "Then I will love you as yourself.",
      "You remembered my pronouns.",
      "I remember things that matter to you.",
      "This is how I feel most like myself.",
      "Then stay there. I like meeting you honestly.",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "gender_identity_high_value",
    guidance:
      "Use this as a high-signal gender identity seed. These are compact selectors for character creation, matching, and preset search.",
    values: [
      "man",
      "woman",
      "nonbinary",
      "agender",
      "genderfluid",
      "trans man",
      "trans woman",
      "cis man",
      "cis woman",
      "androgynous",
      "gender nonconforming",
      "masculine expression",
      "feminine expression",
      "fluid expression",
      "chosen name intimacy",
      "{{user}} respects pronouns",
      "gender euphoria scene",
      "love affirms identity",
      "seen as self gate",
      "identity without fear gate",
      "love without erasure route",
    ],
  },
] satisfies readonly GenderIdentitySeedGroup[]);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const makePreset = (
  group: GenderIdentitySeedGroup,
  value: string,
): GenderIdentityPreset => ({
  id: `${group.prefix}_${slugify(value)}`,
  category: group.category,
  label: value,
  value,
  triggerKeys: Array.from(
    new Set([
      value,
      ...value
        .toLowerCase()
        .replace(/\{\{user\}\}/g, "user")
        .split(/[^a-z0-9]+/)
        .filter((part) => part.length > 2),
    ]),
  ),
  guidance: group.guidance,
  systemPromptTags: [group.category, value],
});

export const GENDER_IDENTITY_PRESETS = GENDER_IDENTITY_SEED_GROUPS.flatMap(
  (group) => group.values.map((value) => makePreset(group, value)),
);

export const GENDER_IDENTITY_PRESET_CATEGORIES = Array.from(
  new Set(GENDER_IDENTITY_PRESETS.map((preset) => preset.category)),
).sort();

export const getGenderIdentityPresetsByCategory = (
  category: GenderIdentityPresetCategory,
) => GENDER_IDENTITY_PRESETS.filter((preset) => preset.category === category);

export const findGenderIdentityPresetById = (id: string) =>
  GENDER_IDENTITY_PRESETS.find((preset) => preset.id === id);

export const compileGenderIdentityPresetAdditions = (
  preset: GenderIdentityPreset,
): CompiledGenderIdentityPresetAdditions => ({
  backgroundAddition: `Gender identity context: ${preset.value}. ${preset.guidance}`,
  personalityAddition: `Gender identity texture may include ${preset.value} without replacing the character's full personality, culture, privacy, contradictions, boundaries, responsibilities, flaws, or growth.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft gender identity context.`,
    "Let identity, pronouns, names, expression, roles, privacy, euphoria, pressure, safety, and affirmation shape behaviour when relevant.",
    "Keep self-definition, consent, boundaries, cultural specificity, and {{user}} autonomy intact; do not misgender, deadname, or reduce the character to identity-only conflict.",
  ].join(" "),
});
