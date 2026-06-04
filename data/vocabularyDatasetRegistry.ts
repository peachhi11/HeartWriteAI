export type DatasetIntakeLane =
  | "taxonomy"
  | "dialogue-style"
  | "persona-structure"
  | "relationship-structure"
  | "eval-fixtures"
  | "reference-only";

export type DatasetLicenseUse =
  | "permissive-with-attribution"
  | "openrail-review-required"
  | "noncommercial-reference-only"
  | "unknown-license-review-required";

export type DatasetIntakeStatus =
  | "recommended"
  | "use-with-review"
  | "reference-only"
  | "parked";

export interface VocabularyDatasetCandidate {
  id: string;
  hubUrl: string;
  label: string;
  license: string;
  licenseUse: DatasetLicenseUse;
  status: DatasetIntakeStatus;
  lanes: DatasetIntakeLane[];
  bestFor: string;
  allowedUse: string;
  blockedUse: string;
  notes: string[];
}

export const VOCABULARY_DATASET_CANDIDATES: readonly VocabularyDatasetCandidate[] =
  Object.freeze([
    {
      id: "google-research-datasets/go_emotions",
      hubUrl: "https://huggingface.co/datasets/google-research-datasets/go_emotions",
      label: "GoEmotions",
      license: "apache-2.0",
      licenseUse: "permissive-with-attribution",
      status: "recommended",
      lanes: ["taxonomy"],
      bestFor:
        "Emotion taxonomy seeds for affection, desire, caring, admiration, embarrassment, nervousness, relief, grief, remorse, and related feeling lanes.",
      allowedUse:
        "Derive label maps, emotion category fixtures, and tests for seed routing with attribution.",
      blockedUse:
        "Do not import user-authored comment text into app-facing romance prompts.",
      notes: [
        "Use the simplified config first; it has compact label arrays and a smaller footprint.",
        "Best immediate fit for expanding emotional state vocabulary without copying prose.",
      ],
    },
    {
      id: "diltdicker/romance_novel_data-2022",
      hubUrl: "https://huggingface.co/datasets/diltdicker/romance_novel_data-2022",
      label: "Romance Novel Data 2022",
      license: "openrail",
      licenseUse: "openrail-review-required",
      status: "use-with-review",
      lanes: ["taxonomy", "reference-only"],
      bestFor:
        "Romance taxonomy extraction from genre and trope fields such as enemies-to-lovers, fake relationship, forced proximity, second chance, office romance, small town, and related commercial-romance labels.",
      allowedUse:
        "Extract normalized trope labels and coverage-gap reports after license review.",
      blockedUse:
        "Do not import book descriptions, blurbs, summaries, or author text into generated seed dialogue or prompt prose.",
      notes: [
        "Treat as a source for label coverage, not a prose corpus.",
        "Useful for comparing our BookTok and relationship-dynamic coverage against wider romance taxonomy.",
      ],
    },
    {
      id: "Estwld/empathetic_dialogues_llm",
      hubUrl: "https://huggingface.co/datasets/Estwld/empathetic_dialogues_llm",
      label: "Empathetic Dialogues LLM",
      license: "apache-2.0",
      licenseUse: "permissive-with-attribution",
      status: "recommended",
      lanes: ["dialogue-style", "eval-fixtures"],
      bestFor:
        "Supportive response structure, reassurance, hurt/comfort, loneliness, guilt, hope, apology, and repair dialogue patterns.",
      allowedUse:
        "Mine conversation-shape heuristics and rewrite into original HeartWriteAI dialogue examples with attribution.",
      blockedUse:
        "Do not copy raw utterances into seed modules as final app text.",
      notes: [
        "Prefer this Apache-licensed derivative over the NC-only Facebook source when building reusable fixtures.",
        "Still run humaniser review because generated chat turns can be flat or repetitive.",
      ],
    },
    {
      id: "facebook/empathetic_dialogues",
      hubUrl: "https://huggingface.co/datasets/facebook/empathetic_dialogues",
      label: "EmpatheticDialogues",
      license: "cc-by-nc-4.0",
      licenseUse: "noncommercial-reference-only",
      status: "reference-only",
      lanes: ["dialogue-style", "reference-only"],
      bestFor:
        "Reference-only comparison for supportive dialogue categories and empathy situations.",
      allowedUse:
        "Use as noncommercial research inspiration or compare category coverage if the product boundary permits.",
      blockedUse:
        "Do not import rows or derived app fixtures into commercial/product-facing seed data without a license decision.",
      notes: [
        "NC license makes this a poor default for product seed assets.",
        "Use the Apache LLM variant for implementation-oriented work where possible.",
      ],
    },
    {
      id: "google/Synthetic-Persona-Chat",
      hubUrl: "https://huggingface.co/datasets/google/Synthetic-Persona-Chat",
      label: "Synthetic Persona Chat",
      license: "cc-by-4.0",
      licenseUse: "permissive-with-attribution",
      status: "recommended",
      lanes: ["persona-structure", "dialogue-style"],
      bestFor:
        "Persona-grounded dialogue patterns and mappings from profile traits into chat behavior.",
      allowedUse:
        "Derive persona form fixtures, schema-routing tests, and original rewritten chat-behavior examples with attribution.",
      blockedUse:
        "Do not paste raw synthetic conversation strings directly into product seed dialogue.",
      notes: [
        "Good fit for persona creation and matching form coverage.",
        "Inspect sample quality before using for dialogue tone, because synthetic data can feel generic.",
      ],
    },
    {
      id: "Kkordik/persona-based-chat-messages",
      hubUrl: "https://huggingface.co/datasets/Kkordik/persona-based-chat-messages",
      label: "Persona-Based Chat Messages",
      license: "cc-by-4.0",
      licenseUse: "permissive-with-attribution",
      status: "use-with-review",
      lanes: ["persona-structure", "dialogue-style"],
      bestFor:
        "Message-shaped persona examples with system, messages, persona_b, and dialogue fields.",
      allowedUse:
        "Use for schema-shape inspiration, parser fixtures, and rewritten persona-to-chat behavior tests with attribution.",
      blockedUse:
        "Do not import raw message bodies into shipping seed modules.",
      notes: [
        "Helpful because it is already close to chat-message format.",
        "Needs extra quality filtering and typo cleanup before any derivative fixture work.",
      ],
    },
    {
      id: "mfigurski80/processed_narrative_relationship_dataset",
      hubUrl:
        "https://huggingface.co/datasets/mfigurski80/processed_narrative_relationship_dataset",
      label: "Processed Narrative Relationship Dataset",
      license: "unspecified",
      licenseUse: "unknown-license-review-required",
      status: "parked",
      lanes: ["relationship-structure", "reference-only"],
      bestFor:
        "Narrative relationship mechanics such as speaker-pair exchange shape, familiarity, tension, and conflict structure.",
      allowedUse:
        "Inspect column shape and high-level relationship mechanics only after source/license review.",
      blockedUse:
        "Do not import dialogue or relationship examples until licensing and source provenance are clear.",
      notes: [
        "Interesting for relationship-dialogue structure, but the missing license blocks ingestion.",
        "Could become useful for evaluator ideas rather than seed text.",
      ],
    },
    {
      id: "baixue6269/character-profiles-romance-output",
      hubUrl: "https://huggingface.co/datasets/baixue6269/character-profiles-romance-output",
      label: "Character Profiles Romance Output",
      license: "unspecified",
      licenseUse: "unknown-license-review-required",
      status: "parked",
      lanes: ["taxonomy", "persona-structure", "reference-only"],
      bestFor:
        "Tiny directly relevant sample of romance profiles with categories, personalities, descriptions, and conversations.",
      allowedUse:
        "Use only as a schema-shape reference after license review.",
      blockedUse:
        "Do not import profile descriptions or conversation content into HeartWriteAI seed modules.",
      notes: [
        "Only ten rows, so it is not a strong source for broad vocabulary coverage.",
        "Potentially useful as a hand-check target for our one-form character creator.",
      ],
    },
    {
      id: "lazyweasel/roleplay-bench",
      hubUrl: "https://huggingface.co/datasets/lazyweasel/roleplay-bench",
      label: "RP-Bench",
      license: "cc-by-nc-4.0",
      licenseUse: "noncommercial-reference-only",
      status: "reference-only",
      lanes: ["eval-fixtures", "reference-only"],
      bestFor:
        "Roleplay evaluation dimensions, compact scenario fixtures, adversarial seeds, and rubric alignment checks.",
      allowedUse:
        "Use as a noncommercial benchmark reference and to design original internal QC rubrics.",
      blockedUse:
        "Do not vendor benchmark rows or rubrics into commercial app assets without a license decision.",
      notes: [
        "The local parquet inspection found eight seed scenarios and twenty-six rubric rows.",
        "Good fit for original QC fixture design rather than vocabulary ingestion.",
      ],
    },
    {
      id: "agentlans/literotica-reddit-dirty-writing-prompts",
      hubUrl:
        "https://huggingface.co/datasets/agentlans/literotica-reddit-dirty-writing-prompts",
      label: "Literotica and Reddit Dirty and Writing Prompts",
      license: "apache-2.0 plus mixed-source review",
      licenseUse: "unknown-license-review-required",
      status: "reference-only",
      lanes: ["taxonomy", "dialogue-style", "eval-fixtures", "reference-only"],
      bestFor:
        "High-level adult-writing structure: pacing, prompt/story chunk format, broad topic taxonomy, dialogue density, and chunk-length calibration.",
      allowedUse:
        "Mine structural statistics and broad taxonomy labels from small samples; use only original rewritten HeartWriteAI fixtures.",
      blockedUse:
        "Do not import explicit prose, story chunks, source prompts, or dataset rows into presets, prompts, tests, or bundled fixtures.",
      notes: [
        "Hugging Face marks the repo Not-For-All-Audiences and the Dataset Viewer is disabled.",
        "The combined repo is Apache-tagged, but one named source did not expose clear license metadata during inspection.",
        "Use only for private reference and structure mining unless source provenance is reviewed.",
      ],
    },
    {
      id: "oyi77/creative-writing-uncensored",
      hubUrl: "https://huggingface.co/datasets/oyi77/creative-writing-uncensored",
      label: "Creative Writing Uncensored",
      license: "apache-2.0",
      licenseUse: "permissive-with-attribution",
      status: "use-with-review",
      lanes: ["dialogue-style", "eval-fixtures", "reference-only"],
      bestFor:
        "Short SFT pair shape: two-message user/assistant creative-writing prompts, compact assistant continuations, and prompt-layout smoke fixtures.",
      allowedUse:
        "Inspect prompt/response structure and derive original Prose Pixie or creative-writing prompt-layout fixtures with attribution.",
      blockedUse:
        "Do not copy raw uncensored messages, assistant responses, or prompt wording into product seed modules.",
      notes: [
        "Dataset Viewer reports 78 rows, while the card text claims 400+ samples.",
        "Every inspected row used a two-message user/assistant pattern.",
        "Useful for fixture shape, not for vocabulary or prose import.",
      ],
    },
  ]);

export const VOCABULARY_DATASET_LANES = Object.freeze(
  Array.from(
    new Set(VOCABULARY_DATASET_CANDIDATES.flatMap((candidate) => candidate.lanes)),
  ).sort(),
);

export function getVocabularyDatasetCandidatesByLane(
  lane: DatasetIntakeLane,
): VocabularyDatasetCandidate[] {
  return VOCABULARY_DATASET_CANDIDATES.filter((candidate) =>
    candidate.lanes.includes(lane),
  );
}

export function getVocabularyDatasetCandidatesByStatus(
  status: DatasetIntakeStatus,
): VocabularyDatasetCandidate[] {
  return VOCABULARY_DATASET_CANDIDATES.filter(
    (candidate) => candidate.status === status,
  );
}

export function findVocabularyDatasetCandidateById(
  id: string,
): VocabularyDatasetCandidate | undefined {
  return VOCABULARY_DATASET_CANDIDATES.find((candidate) => candidate.id === id);
}

export function compileVocabularyDatasetIntakeSummary(
  candidate: VocabularyDatasetCandidate,
): string {
  return [
    `Dataset candidate: ${candidate.label} (${candidate.id}).`,
    `License boundary: ${candidate.license} / ${candidate.licenseUse}.`,
    `Recommended lane(s): ${candidate.lanes.join(", ")}.`,
    `Allowed use: ${candidate.allowedUse}`,
    `Blocked use: ${candidate.blockedUse}`,
  ].join("\n");
}
