import assert from "node:assert/strict";
import test from "node:test";

import {
  compileAiWritePolicyPromptLine,
  compileKnowledgeRoutingPrompt,
  compilePortablePackageManifestSummary,
  createPortablePackageManifest,
  resolveAiWritePolicyDecision,
  scoreSemanticTagBoost,
  type AiWritableArtifact,
} from "../../lib/character-card/orchestrationPolicy";

test("rejects AI write proposals for locked sources while keeping them readable", () => {
  const artifact: AiWritableArtifact = {
    id: "law:autonomy",
    label: "Autonomy Law",
    policy: "locked",
    content: "Never decide for the user.",
    category: "character law",
  };
  const decision = resolveAiWritePolicyDecision(artifact, {
    artifactId: "law:autonomy",
    proposedContent: "Decide for the user when worried.",
    summary: "Weakens agency boundary.",
    sourceAction: "system-ai-maintenance",
  });

  assert.equal(decision.status, "rejected");
  assert.equal(decision.artifact.content, "Never decide for the user.");
  assert.match(decision.promptSafeMessage, /locked reference material/i);
  assert.doesNotMatch(
    compileAiWritePolicyPromptLine(artifact),
    /law:autonomy/,
  );
  assert.match(compileAiWritePolicyPromptLine(artifact), /Use it for context/);
});

test("stages review-policy writes without mutating canon", () => {
  const artifact: AiWritableArtifact = {
    id: "lorebook:trust-rupture",
    label: "Trust Rupture Lore",
    policy: "review",
    content: "Trust broke after a hidden promise failed.",
  };
  const decision = resolveAiWritePolicyDecision(artifact, {
    artifactId: "lorebook:trust-rupture",
    proposedContent: "Trust broke after the hidden promise failed in public.",
    summary: "Adds public consequence.",
    sourceAction: "lorebook-enrichment",
  });

  assert.equal(decision.status, "staged");
  assert.equal(decision.artifact.content, artifact.content);
  assert.equal(
    decision.stagedProposal?.proposedContent,
    "Trust broke after the hidden promise failed in public.",
  );
  assert.match(decision.promptSafeMessage, /draft material/i);
});

test("applies open-policy writes for low-risk maintenance artifacts", () => {
  const artifact: AiWritableArtifact<readonly string[]> = {
    id: "tags:card",
    label: "Card Tags",
    policy: "open",
    content: ["slow_burn"],
  };
  const decision = resolveAiWritePolicyDecision(artifact, {
    artifactId: "tags:card",
    proposedContent: ["slow_burn", "mutual_pining"],
    summary: "Adds a search tag.",
    sourceAction: "tag-maintenance",
  });

  assert.equal(decision.status, "applied");
  assert.deepEqual(decision.artifact.content, [
    "slow_burn",
    "mutual_pining",
  ]);
});

test("rejects proposals that target a different source", () => {
  const decision = resolveAiWritePolicyDecision(
    {
      id: "artifact:one",
      label: "One",
      policy: "open",
      content: "Original.",
    },
    {
      artifactId: "artifact:two",
      proposedContent: "Changed.",
      summary: "Wrong target.",
      sourceAction: "maintenance",
    },
  );

  assert.equal(decision.status, "rejected");
  assert.equal(decision.artifact.content, "Original.");
});

test("compiles prompt-safe knowledge routing without disabled sources or ids", () => {
  const prompt = compileKnowledgeRoutingPrompt([
    {
      id: "rule:constant-character-law",
      label: "Character Laws",
      strategy: "constant_context",
      description: "Use as always-on behavior law.",
      includeInPrompt: true,
    },
    {
      id: "rule:semantic-memory",
      label: "Relationship Memory",
      strategy: "semantic_retrieval",
      description: "Recall only when the scene repeats the same wound pressure.",
      includeInPrompt: true,
      requiresSemanticMatch: true,
      reviewRequired: true,
    },
    {
      id: "rule:disabled",
      label: "Disabled Draft",
      strategy: "disabled",
      description: "Should not appear.",
      includeInPrompt: true,
    },
  ]);

  assert.match(prompt, /Knowledge routing:/);
  assert.match(prompt, /Character Laws/);
  assert.match(prompt, /Relationship Memory/);
  assert.match(prompt, /Require a meaning match/);
  assert.doesNotMatch(prompt, /rule:constant-character-law|rule:semantic-memory/);
  assert.doesNotMatch(prompt, /Disabled Draft/);
});

test("creates a portable package manifest with privacy-safe default omissions", () => {
  const manifest = createPortablePackageManifest({
    packageKind: "character_bundle",
    name: "Avery Vale Bundle",
    version: "v1",
    createdAt: "2026-07-10",
    includes: [
      "ccv3_card_fields",
      "reviewed_story_lorebook",
      "scenario_truth",
    ],
    reviewRequired: ["hidden_lore_entries"],
    sourceIds: ["ccv3-card-fields"],
  });
  const summary = compilePortablePackageManifestSummary(manifest);

  assert.deepEqual(manifest.omits.slice(0, 5), [
    "api_keys",
    "local_file_paths",
    "raw_runtime_scores",
    "unreviewed_drafts",
    "private_agent_notes",
  ]);
  assert.match(summary, /Avery Vale Bundle/);
  assert.match(summary, /reviewed_story_lorebook/);
  assert.match(summary, /api_keys/);
  assert.match(summary, /Review before release: hidden_lore_entries/);
});

test("uses semantic tags as a boost, not a replacement for meaning", () => {
  const failedMeaning = scoreSemanticTagBoost({
    cosineSimilarity: 0.2,
    sparseScore: 1,
    hasTagMatch: true,
  });
  const plainMatch = scoreSemanticTagBoost({
    cosineSimilarity: 0.7,
    sparseScore: 0.2,
    hasTagMatch: false,
  });
  const taggedMatch = scoreSemanticTagBoost({
    cosineSimilarity: 0.7,
    sparseScore: 0.2,
    hasTagMatch: true,
  });

  assert.equal(failedMeaning.passesSemanticFloor, false);
  assert.equal(failedMeaning.fusionScore, 0);
  assert.equal(taggedMatch.passesSemanticFloor, true);
  assert.equal(taggedMatch.fusionScore > plainMatch.fusionScore, true);
});
