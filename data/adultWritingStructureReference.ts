export type AdultWritingStructureLane =
  | "adult-pacing"
  | "prompt-format"
  | "chunk-length"
  | "topic-taxonomy"
  | "sft-shape"
  | "prose-pixie-fixture"
  | "creative-prompt-layout-fixture";

export interface NumericDistributionSummary {
  min: number;
  p25: number;
  median: number;
  p75: number;
  max: number;
  mean: number;
}

export interface AdultWritingCorpusObservation {
  id: string;
  datasetId: string;
  sampleScope: string;
  rowsInspected: number;
  lanes: AdultWritingStructureLane[];
  usageBoundary: string;
  sourceMix?: Record<string, number>;
  promptStructure: string[];
  pacingFindings: string[];
  chunkLengthFindings: string[];
  topicTaxonomyFindings: string[];
  fixtureGuidance: string[];
}

export interface OriginalWritingFixture {
  id: string;
  lane: Extract<
    AdultWritingStructureLane,
    "prose-pixie-fixture" | "creative-prompt-layout-fixture"
  >;
  title: string;
  promptShape: string;
  expectedOutputShape: string;
  testAssertions: string[];
}

export const ADULT_WRITING_STRUCTURE_REFERENCES: readonly AdultWritingCorpusObservation[] =
  Object.freeze([
    {
      id: "adult_structure_literotica_reddit_sample_k100",
      datasetId: "agentlans/literotica-reddit-dirty-writing-prompts",
      sampleScope:
        "sample_k100.jsonl.zst inspected structurally only; no source prose is stored.",
      rowsInspected: 100,
      lanes: ["adult-pacing", "prompt-format", "chunk-length", "topic-taxonomy"],
      usageBoundary:
        "Reference only. Mine pacing, prompt format, chunk length, and broad taxonomy; do not copy story text, explicit prose, or dataset rows into HeartWriteAI.",
      sourceMix: {
        "nothingiisreal/Reddit-Dirty-And-WritingPrompts": 95,
        "taozi555/literotica-stories": 5,
      },
      promptStructure: [
        "Rows behave like mixed story/prompt chunks rather than clean chat pairs.",
        "Many rows include scene-forward prose with some question-driven prompts and quoted dialogue.",
        "The sample includes both Reddit prompt material and longer fiction chunks, so fixture design should separate prompt-intake tests from prose-revision tests.",
      ],
      pacingFindings: [
        "Short chunks often move quickly from premise to escalation.",
        "Dialogue presence is common enough to test quote handling, but not universal.",
        "Question marks appear frequently enough to test prompt-intent extraction from compact setups.",
      ],
      chunkLengthFindings: [
        "Word-count median: 176; p25: 138; p75: 250; max: 1615 in the inspected sample.",
        "Line-count median: 5; p75: 7; max: 42, suggesting chunk fixtures should include both compact paragraphs and multi-line scenes.",
        "The full corpus card describes approximate 2000-token segmentation, but the small sample contains many shorter prompt-like entries.",
      ],
      topicTaxonomyFindings: [
        "Broad observed buckets: domestic/slice-of-life, relationship setup, social power, speculative/fantasy, sci-fi/technology, quest/adventure, adult-intimacy context, and horror/thriller.",
        "Uncategorized rows remain high, so taxonomy mining should use conservative labels and never assume a single romance lane.",
        "Treat adult-intimacy taxonomy as contextual pacing metadata, not as app-facing wording.",
      ],
      fixtureGuidance: [
        "Build original fixtures that test pacing compression, dialogue preservation, content-boundary classification, and prompt-vs-story detection.",
        "Use neutral adult-romance labels such as intimacy pacing, private stakes, consent boundary, and scene escalation; avoid source phrase reuse.",
      ],
    },
    {
      id: "creative_structure_oyi77_short_sft_pairs",
      datasetId: "oyi77/creative-writing-uncensored",
      sampleScope:
        "Full 78-row JSONL inspected structurally only; no source prose is stored.",
      rowsInspected: 78,
      lanes: ["sft-shape", "prompt-format", "chunk-length", "creative-prompt-layout-fixture"],
      usageBoundary:
        "Use with review. Small Apache-tagged SFT-format corpus can inform original short-pair fixtures, but raw rows should not be copied into product presets.",
      promptStructure: [
        "Every inspected row has exactly two messages in a user-to-assistant pattern.",
        "Prompts are usually direct generation instructions rather than multi-turn roleplay.",
        "Prompt starts are dominated by simple commands such as write and continue.",
      ],
      pacingFindings: [
        "Assistant replies are compact flash-scene responses, not long-form chapters.",
        "The shape is useful for Prose Pixie smoke fixtures that expect one concise rewrite or continuation.",
      ],
      chunkLengthFindings: [
        "User prompt median: 18 words; p75: 21; max: 23.",
        "Assistant response median: 101 words; p75: 112; max: 126.",
        "Total pair median: 115 words, making it useful for short SFT layout tests.",
      ],
      topicTaxonomyFindings: [
        "Broad observed buckets include domestic/slice-of-life, horror/thriller, relationship setup, quest/adventure, and sci-fi/technology.",
        "The small sample is not broad enough to drive a comprehensive vocabulary taxonomy.",
      ],
      fixtureGuidance: [
        "Create original two-message fixtures with short user instructions and concise assistant outputs.",
        "Use genre-named prompt-layout fixtures and Prose Pixie rewrite fixtures to test shape, not source wording.",
      ],
    },
  ]);

export const ORIGINAL_WRITING_STRUCTURE_FIXTURES: readonly OriginalWritingFixture[] =
  Object.freeze([
    {
      id: "prose_pixie_private_stakes_tighten",
      lane: "prose-pixie-fixture",
      title: "Tighten Private Stakes",
      promptShape:
        "Rewrite a short romantic scene so the desire stays implied through gesture, hesitation, and pacing rather than explanation.",
      expectedOutputShape:
        "A concise original rewrite that preserves agency, keeps the scene adult but non-explicit, and improves subtext.",
      testAssertions: [
        "Keeps the same scene facts.",
        "Shortens rambling exposition.",
        "Adds observable beats without copying external prose.",
        "Does not override either participant's choice.",
      ],
    },
    {
      id: "prose_pixie_dialogue_preserve",
      lane: "prose-pixie-fixture",
      title: "Preserve Dialogue Rhythm",
      promptShape:
        "Polish a multi-line exchange while preserving who speaks, the emotional turn, and the unresolved tension.",
      expectedOutputShape:
        "A cleaned dialogue-forward passage with clearer beats and no invented resolution.",
      testAssertions: [
        "Maintains speaker order.",
        "Keeps unresolved tension unresolved.",
        "Avoids melodramatic over-explanation.",
        "Keeps the rewrite original.",
      ],
    },
    {
      id: "creative_layout_short_generation_pair",
      lane: "creative-prompt-layout-fixture",
      title: "Short Generation Pair",
      promptShape:
        "A 10-25 word user instruction naming a genre, scene unit, and emotional pressure.",
      expectedOutputShape:
        "A 90-130 word assistant passage that behaves like a compact flash scene.",
      testAssertions: [
        "Uses a two-message user/assistant layout.",
        "Keeps the assistant output compact.",
        "Names genre and scene pressure in the fixture metadata.",
        "Does not rely on external dataset wording.",
      ],
    },
    {
      id: "creative_layout_continue_scene_pair",
      lane: "creative-prompt-layout-fixture",
      title: "Continue Scene Pair",
      promptShape:
        "A short continue-this-scene instruction that supplies a clean original setup and a target tone.",
      expectedOutputShape:
        "A concise continuation that advances one beat, avoids finalizing the whole story, and keeps the requested tone visible.",
      testAssertions: [
        "Uses a short user prompt.",
        "Advances one scene beat only.",
        "Leaves room for later continuation.",
        "Avoids source corpus phrasing.",
      ],
    },
  ]);

export function getAdultWritingStructureReferenceByDataset(
  datasetId: string,
): AdultWritingCorpusObservation[] {
  return ADULT_WRITING_STRUCTURE_REFERENCES.filter(
    (reference) => reference.datasetId === datasetId,
  );
}

export function getOriginalWritingFixturesByLane(
  lane: OriginalWritingFixture["lane"],
): OriginalWritingFixture[] {
  return ORIGINAL_WRITING_STRUCTURE_FIXTURES.filter(
    (fixture) => fixture.lane === lane,
  );
}
