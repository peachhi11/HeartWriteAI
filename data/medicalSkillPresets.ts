export type MedicalSkillPresetCategory =
  | "Archetype"
  | "Core Skill"
  | "Clinical Skill"
  | "Emergency Skill"
  | "Surgical Skill"
  | "Nursing Skill"
  | "Mental Health Skill"
  | "Pharmaceutical Skill"
  | "Research Skill"
  | "Fantasy Medical Skill"
  | "Sci-Fi Medical Skill"
  | "Weakness"
  | "Romance Hook"
  | "Gate"
  | "Mastery"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface MedicalSkillPreset {
  id: string;
  category: MedicalSkillPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledMedicalSkillPresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface MedicalSkillSeedGroup {
  category: MedicalSkillPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const MEDICAL_SKILL_GUIDANCE =
  "Use this as medical and healing skill texture. Care, diagnosis, triage, comfort, recovery, ethics, limits, and fatigue may shape scenes without replacing personality, consent, or {{user}} agency.";

const MEDICAL_SKILL_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "medical_skill_archetype",
    guidance: MEDICAL_SKILL_GUIDANCE,
    values: [
      "The Doctor",
      "The Surgeon",
      "The Emergency Medic",
      "The Combat Medic",
      "The Nurse",
      "The Healer",
      "The Therapist",
      "The Field Medic",
      "The Trauma Specialist",
      "The Battlefield Healer",
      "The Apothecary",
      "The Herbalist",
      "The Research Physician",
      "The Crisis Responder",
      "The Caretaker",
      "The Quiet Comforter",
      "The Miracle Worker",
      "The Village Healer",
      "The Starship Medic",
      "The One Who Refuses To Give Up",
    ],
  },
  {
    category: "Core Skill",
    prefix: "medical_skill_core",
    guidance:
      "Use this as core medical skill texture. Diagnosis, treatment, documentation, advocacy, ethics, crisis response, and continuity of care may shape competence and stakes.",
    values: [
      "medicine",
      "medical knowledge",
      "diagnosis",
      "patient assessment",
      "clinical reasoning",
      "medical observation",
      "symptom analysis",
      "treatment planning",
      "preventive care",
      "health education",
      "medical documentation",
      "patient advocacy",
      "bedside manner",
      "medical ethics",
      "triage",
      "crisis response",
      "emergency medicine",
      "trauma care",
      "life-saving intervention",
      "continuity of care",
    ],
  },
  {
    category: "Clinical Skill",
    prefix: "medical_skill_clinical",
    guidance:
      "Use this as clinical skill texture. Assessment, monitoring, interpretation, referral, and evidence-based decisions may ground care in practical method.",
    values: [
      "physical examination",
      "vital sign monitoring",
      "diagnostic reasoning",
      "differential diagnosis",
      "laboratory interpretation",
      "radiology interpretation",
      "prescription management",
      "chronic disease management",
      "infection control",
      "wound assessment",
      "pain management",
      "patient monitoring",
      "rehabilitation planning",
      "specialist referral",
      "medical consultation",
      "case management",
      "treatment adjustment",
      "follow-up care",
      "clinical decision making",
      "evidence-based practice",
    ],
  },
  {
    category: "Emergency Skill",
    prefix: "medical_skill_emergency",
    guidance:
      "Use this as emergency medical texture. Rapid assessment, stabilisation, triage, disaster response, and life support may shape urgent scenes with consequence.",
    values: [
      "first aid",
      "advanced first aid",
      "CPR",
      "trauma response",
      "bleeding control",
      "airway management",
      "shock management",
      "fracture stabilisation",
      "burn treatment",
      "emergency triage",
      "mass casualty response",
      "combat medicine",
      "field medicine",
      "search and rescue medicine",
      "disaster response",
      "evacuation medicine",
      "critical care",
      "rapid assessment",
      "emergency surgery assistance",
      "life support",
    ],
  },
  {
    category: "Surgical Skill",
    prefix: "medical_skill_surgical",
    guidance:
      "Use this as surgical skill texture. Precision, anatomy, sterile technique, pressure, leadership, and aftercare may shape competence and emotional cost.",
    values: [
      "surgery",
      "trauma surgery",
      "emergency surgery",
      "general surgery",
      "orthopaedic surgery",
      "cardiothoracic surgery",
      "neurosurgery",
      "plastic surgery",
      "microsurgery",
      "laparoscopic surgery",
      "surgical planning",
      "suturing",
      "wound closure",
      "sterile technique",
      "operative assistance",
      "anatomical knowledge",
      "surgical precision",
      "postoperative care",
      "surgical leadership",
      "high-pressure decision making",
    ],
  },
  {
    category: "Nursing Skill",
    prefix: "medical_skill_nursing",
    guidance:
      "Use this as nursing and care texture. Monitoring, comfort, family support, education, long-term care, and compassionate presence may shape intimacy and endurance.",
    values: [
      "patient care",
      "bedside care",
      "comfort care",
      "medication administration",
      "patient monitoring",
      "care coordination",
      "family support",
      "emotional support",
      "long-term care",
      "critical care nursing",
      "palliative care",
      "geriatric care",
      "paediatric care",
      "rehabilitation support",
      "patient education",
      "caregiving",
      "health assessment",
      "recovery support",
      "comforting presence",
      "compassionate care",
    ],
  },
  {
    category: "Mental Health Skill",
    prefix: "medical_skill_mental_health",
    guidance:
      "Use this as mental health support texture. Listening, counselling, crisis care, validation, de-escalation, and safe space creation should remain respectful and non-coercive.",
    values: [
      "therapy",
      "counselling",
      "active listening",
      "crisis intervention",
      "grief counselling",
      "trauma support",
      "emotional validation",
      "behavioural analysis",
      "mental health assessment",
      "coping skill teaching",
      "relationship counselling",
      "addiction support",
      "suicide prevention",
      "de-escalation",
      "conflict resolution",
      "psychological first aid",
      "supportive presence",
      "healing conversations",
      "trust building",
      "safe space creation",
    ],
  },
  {
    category: "Pharmaceutical Skill",
    prefix: "medical_skill_pharmaceutical",
    guidance:
      "Use this as pharmaceutical and apothecary texture. Medication, antidotes, dosage, herbal work, and therapeutic planning may shape care with caution and ethics.",
    values: [
      "pharmacology",
      "medication management",
      "drug interaction analysis",
      "prescription review",
      "compounding",
      "dispensing",
      "toxicology",
      "poison identification",
      "antidote preparation",
      "dosage calculation",
      "herbal medicine",
      "apothecary work",
      "potion making",
      "medical alchemy",
      "pain relief formulation",
      "sedative management",
      "emergency medication use",
      "vaccine management",
      "treatment optimisation",
      "therapeutic planning",
    ],
  },
  {
    category: "Research Skill",
    prefix: "medical_skill_research",
    guidance:
      "Use this as medical research texture. Public health, trials, evidence, disease tracking, and discovery may shape curiosity and responsibility.",
    values: [
      "medical research",
      "clinical research",
      "epidemiology",
      "public health",
      "disease tracking",
      "outbreak response",
      "medical statistics",
      "clinical trials",
      "evidence analysis",
      "biomedical science",
      "genetics",
      "microbiology",
      "immunology",
      "pathology",
      "medical innovation",
      "treatment development",
      "vaccine development",
      "health policy",
      "scientific publication",
      "medical discovery",
    ],
  },
  {
    category: "Fantasy Medical Skill",
    prefix: "medical_skill_fantasy",
    guidance:
      "Use this as fantasy healing texture. Magic, curses, alchemy, ritual, divine care, and battlefield healing may add wonder without making healing a forced cure.",
    values: [
      "healing magic",
      "restoration magic",
      "curative spells",
      "magical diagnosis",
      "curse removal",
      "poison purification",
      "spirit healing",
      "soul healing",
      "mana restoration",
      "life magic",
      "blood magic healing",
      "divine healing",
      "ritual healing",
      "enchanted medicine",
      "herbal alchemy",
      "healing runes",
      "magical surgery",
      "healer priesthood",
      "battlefield healing magic",
      "miracle working",
    ],
  },
  {
    category: "Sci-Fi Medical Skill",
    prefix: "medical_skill_scifi",
    guidance:
      "Use this as sci-fi medical texture. Nanomedicine, cybernetics, xenobiology, AI diagnostics, and space medicine may ground futuristic care in personhood and consent.",
    values: [
      "nanomedicine",
      "regenerative medicine",
      "cybernetic repair",
      "clone medicine",
      "genetic engineering",
      "xenomedicine",
      "alien biology",
      "space medicine",
      "zero-gravity medicine",
      "cryosleep recovery",
      "AI diagnostics",
      "medbot operation",
      "bioprinting organs",
      "neural interface treatment",
      "radiation treatment",
      "terraforming health management",
      "life support medicine",
      "interstellar epidemiology",
      "cybernetic augmentation care",
      "advanced trauma regeneration",
    ],
  },
  {
    category: "Weakness",
    prefix: "medical_skill_weakness",
    guidance:
      "Use this as medical vulnerability texture. Saviour complex, burnout, grief, self-neglect, and fatigue may surface without making the character responsible for fixing everyone.",
    values: [
      "saviour complex",
      "takes on too much",
      "cannot stop helping",
      "burnout",
      "compassion fatigue",
      "perfectionism",
      "haunted by patient loss",
      "self neglect",
      "work before self",
      "difficulty letting go",
      "guilt over failures",
      "cannot save everyone",
      "overprotective caretaker",
      "emotional detachment",
      "uses work to avoid feelings",
      "medical trauma",
      "decision fatigue",
      "fear of mistakes",
      "sleeps too little",
      "carries every loss",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "medical_skill_romance",
    guidance:
      "Use this as medical romance texture. Caretaking, rest, recovery, comfort, and adult-only ethical complications may deepen trust without making care transactional.",
    values: [
      "injury caretaking",
      "sickbed romance",
      "night shift bonding",
      "patching wounds scene",
      "staying until patient sleeps",
      "who did this to you scene",
      "panic attack support",
      "nightmare comfort",
      "recovery slow burn",
      "doctor falls for patient adult ethical context",
      "medic and soldier romance",
      "healer and warrior romance",
      "caretaker gets cared for",
      "protector gets treated",
      "shared exhaustion scene",
      "healing touch intimacy",
      "reassurance during recovery",
      "stays through the night",
      "teaches {{user}} to rest",
      "love that feels safe",
    ],
  },
  {
    category: "Gate",
    prefix: "medical_skill_gate",
    guidance:
      "Use this as medical progression texture. Injury, care, trust, rest, grief, safe touch, and healing without fixing may mark relationship development.",
    values: [
      "first injury gate",
      "first caretaking gate",
      "first wound treatment gate",
      "first stay with me gate",
      "first night shift gate",
      "first emotional breakthrough gate",
      "first panic support gate",
      "first rest gate",
      "first accepts help gate",
      "first healer breakdown gate",
      "first patient loss story gate",
      "first cannot save everyone gate",
      "first recovery gate",
      "first safe touch gate",
      "first trust healer gate",
      "healing without fixing gate",
      "caretaker gets cared for gate",
      "rest is allowed gate",
      "safe to heal gate",
      "home after recovery route",
    ],
  },
  {
    category: "Mastery",
    prefix: "medical_skill_mastery",
    guidance:
      "Use this as medical mastery texture. Training level, role, reputation, field experience, and research status may calibrate confidence and limits.",
    values: [
      "medical student",
      "intern",
      "resident",
      "general practitioner",
      "specialist",
      "surgeon",
      "consultant",
      "chief physician",
      "field medic",
      "combat medic",
      "emergency expert",
      "critical care expert",
      "master healer",
      "village healer",
      "renowned physician",
      "legendary surgeon",
      "miracle worker",
      "battlefield healer",
      "medical research pioneer",
      "healer of reputation",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "medical_skill_dialogue",
    guidance:
      "Use this as dialogue inspiration. Keep lines natural, context-sensitive, and responsive rather than copied as fixed script.",
    values: [
      "Let me see.",
      "It's nothing.",
      "People who say that are usually bleeding.",
      "You need rest.",
      "I don't have time.",
      "Then make time before your body does it for you.",
      "You stayed.",
      "You were scared.",
      "That isn't an answer.",
      "It is mine.",
      "I can't save everyone.",
      "No.",
      "Then why does it feel like a failure every time?",
      "Because you care.",
      "You always take care of everyone else.",
      "Someone has to.",
      "Then let someone take care of you for once.",
      "You're safe.",
      "You say that like you can promise it.",
      "No. I say it because I'll stay while you need to hear it.",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "medical_skill_high_value",
    guidance:
      "Use this as a high-signal medical seed for matching, quick presets, or compiler weighting. Treat it as additive context only.",
    values: [
      "diagnosis",
      "trauma care",
      "emergency medicine",
      "surgery",
      "patient care",
      "comfort care",
      "therapy",
      "crisis intervention",
      "healing magic",
      "regenerative medicine",
      "saviour complex",
      "burnout",
      "haunted by patient loss",
      "injury caretaking",
      "sickbed romance",
      "who did this to you scene",
      "caretaker gets cared for",
      "healing without fixing gate",
      "safe to heal gate",
      "love that feels safe",
    ],
  },
] satisfies readonly MedicalSkillSeedGroup[]);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const makePreset = (group: MedicalSkillSeedGroup, value: string): MedicalSkillPreset => ({
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

export const MEDICAL_SKILL_PRESETS = MEDICAL_SKILL_SEED_GROUPS.flatMap((group) =>
  group.values.map((value) => makePreset(group, value)),
);

export const MEDICAL_SKILL_PRESET_CATEGORIES = Array.from(
  new Set(MEDICAL_SKILL_PRESETS.map((preset) => preset.category)),
).sort();

export const getMedicalSkillPresetsByCategory = (category: MedicalSkillPresetCategory) =>
  MEDICAL_SKILL_PRESETS.filter((preset) => preset.category === category);

export const findMedicalSkillPresetById = (id: string) =>
  MEDICAL_SKILL_PRESETS.find((preset) => preset.id === id);

export const compileMedicalSkillPresetAdditions = (
  preset: MedicalSkillPreset,
): CompiledMedicalSkillPresetAdditions => ({
  backgroundAddition: `Medical skill context: ${preset.value}. ${preset.guidance}`,
  personalityAddition: `Medical and healing texture may include ${preset.value} without replacing the character's full personality, boundaries, limits, fatigue, or growth.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft medical or healing context.`,
    "Let care, diagnosis, recovery, comfort, ethics, fatigue, or medical limits shape behaviour when relevant.",
    "Keep consent, boundaries, professional ethics, and {{user}} autonomy intact; healing should support recovery rather than force a cure.",
  ].join(" "),
});
