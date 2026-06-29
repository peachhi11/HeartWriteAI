import assert from "node:assert/strict";
import test from "node:test";

import {
  HEARTWRITE_PROJECT_ACTIONS,
  HeartWriteCardBundleManifest,
  HeartWriteContinuityAudit,
  HeartWriteContextSourceSummary,
  runHeartWriteProjectAction,
} from "../../lib/character-card/heartwriteProjectActionBus";
import type { ContinuityCanonLedger } from "../../lib/continuityCanonLedger";
import {
  createEmptyCharacterCreationForm,
} from "../../lib/character-card/characterCreationFormCompiler";

test("registers a compact HeartWriteAI project action bus", () => {
  assert.deepEqual(
    HEARTWRITE_PROJECT_ACTIONS.map((action) => action.id),
    [
      "card.compileTruth",
      "lorebook.promoteStoryTruth",
      "scenario.compileSettingTruth",
      "runtime.auditContinuity",
      "runtime.compileCanonLedger",
      "context.inspectPromptSources",
      "export.packageCardBundle",
    ],
  );
  assert.equal(
    HEARTWRITE_PROJECT_ACTIONS.find(
      (action) => action.id === "card.compileTruth",
    )?.commandToken,
    "!card compile-truth",
  );
  assert.equal(
    HEARTWRITE_PROJECT_ACTIONS.find(
      (action) => action.id === "context.inspectPromptSources",
    )?.role,
    "context_inspector",
  );
});

test("compiles portable character truth without story or setting leaks", () => {
  const result = runHeartWriteProjectAction("card.compileTruth", {
    form: createActionBusExampleForm(),
  });

  assert.equal(result.status, "ok");
  assert.equal(result.issues.length, 0);
  assert.equal(result.artifacts.length, 1);
  assert.equal(result.artifacts[0]?.tier, "character_truth");
  assert.equal(result.artifacts[0]?.kind, "character_card_values");
  assert.match(result.promptSafeSummary, /portable card fields/i);
  assert.doesNotMatch(JSON.stringify(result.artifacts[0]?.data), /\{\{user\}\}/);
  assert.doesNotMatch(JSON.stringify(result.artifacts[0]?.data), /auction scandal/i);
  assert.doesNotMatch(JSON.stringify(result.artifacts[0]?.data), /harbor city/i);
});

test("promotes story-specific truth into a review-required lorebook artifact", () => {
  const result = runHeartWriteProjectAction("lorebook.promoteStoryTruth", {
    form: createActionBusExampleForm(),
  });

  assert.equal(result.status, "needs_review");
  assert.equal(result.artifacts[0]?.kind, "lorebook_v3");
  assert.equal(result.artifacts[0]?.reviewRequired, true);
  assert.match(JSON.stringify(result.artifacts[0]?.data), /\{\{user\}\}/);
  assert.match(JSON.stringify(result.artifacts[0]?.data), /auction scandal/i);
});

test("compiles setting truth as scenario context", () => {
  const result = runHeartWriteProjectAction("scenario.compileSettingTruth", {
    form: createActionBusExampleForm(),
  });

  assert.equal(result.status, "ok");
  assert.equal(result.artifacts[0]?.kind, "scenario_truth");
  assert.equal(result.artifacts[0]?.tier, "setting_truth");
  assert.match(JSON.stringify(result.artifacts[0]?.data), /harbor city/i);
  assert.match(JSON.stringify(result.artifacts[0]?.data), /Cash-poor/i);
});

test("audits continuity boundaries across card, lorebook, scenario, and runtime tiers", () => {
  const result = runHeartWriteProjectAction("runtime.auditContinuity", {
    form: createActionBusExampleForm(),
  });
  const audit = result.artifacts[0]?.data as HeartWriteContinuityAudit;

  assert.equal(result.status, "ok");
  assert.equal(audit.passed, true);
  assert.deepEqual(audit.checkedTiers, [
    "character_truth",
    "story_truth",
    "setting_truth",
    "runtime_context",
  ]);
  assert.equal(audit.issues.length, 0);
});

test("compiles a continuity canon ledger from separated project truth", () => {
  const result = runHeartWriteProjectAction("runtime.compileCanonLedger", {
    form: createActionBusExampleForm(),
  });
  const ledger = result.artifacts[0]?.data as ContinuityCanonLedger;

  assert.equal(result.status, "ok");
  assert.equal(result.artifacts[0]?.kind, "continuity_canon_ledger");
  assert.equal(result.artifacts[0]?.tier, "runtime_context");
  assert.ok(ledger.facts.some((fact) => /harbor city/i.test(fact.statement)));
  assert.ok(
    ledger.facts.some((fact) => /auction scandal/i.test(fact.statement)),
  );
  assert.ok(
    ledger.relationshipStates.some((state) =>
      state.participantIds.includes("Avery Vale"),
    ),
  );
});

test("reports prompt sources without requiring every section to know every artifact", () => {
  const result = runHeartWriteProjectAction("context.inspectPromptSources", {
    form: createActionBusExampleForm(),
    recentMessages: [
      "The room went quiet after the accusation.",
      "Avery checked the door before answering.",
    ],
    runtimeNotes: ["Internal note: watch for trust rupture."],
    activeLorebooks: [
      {
        name: "Rival House Notes",
        entries: [
          {
            name: "Matriarch Pressure",
            content: "A rival matriarch pressures the house through debt.",
            keys: ["debt", "rival"],
            reviewRequired: true,
          },
        ],
      },
    ],
  });
  const report = result.artifacts[0]?.data as {
    sources: HeartWriteContextSourceSummary[];
    totalTokenEstimate: number;
  };

  assert.equal(result.status, "ok");
  assert.ok(report.totalTokenEstimate > 0);
  assert.ok(
    report.sources.some((source) => source.tier === "character_truth"),
  );
  assert.ok(report.sources.some((source) => source.tier === "story_truth"));
  assert.ok(report.sources.some((source) => source.tier === "setting_truth"));
  assert.ok(
    report.sources.some(
      (source) =>
        source.tier === "runtime_context" &&
        source.id === "recent-messages",
    ),
  );
  assert.ok(
    report.sources.some((source) => source.id === "active-lorebook-1-entry-1"),
  );
});

test("packages export targets as a reviewable card bundle manifest", () => {
  const result = runHeartWriteProjectAction("export.packageCardBundle", {
    form: createActionBusExampleForm(),
  });
  const manifestArtifact = result.artifacts.find(
    (artifact) => artifact.kind === "export_manifest",
  );
  const manifest = manifestArtifact?.data as HeartWriteCardBundleManifest;

  assert.equal(result.status, "ok");
  assert.equal(manifestArtifact?.tier, "export_bundle");
  assert.deepEqual(
    manifest.targets.map((target) => target.id),
    [
      "ccv3-card-fields",
      "story-lorebook-v3",
      "scenario-truth",
      "continuity-audit",
      "continuity-canon-ledger",
      "prompt-source-report",
    ],
  );
  assert.ok(
    manifest.reviewChecklist.some((item) =>
      /continuity canon ledger/i.test(item),
    ),
  );
});

test("blocks form-dependent project actions when no form is provided", () => {
  const result = runHeartWriteProjectAction("card.compileTruth");

  assert.equal(result.status, "blocked");
  assert.equal(result.artifacts.length, 0);
  assert.equal(result.issues[0]?.severity, "error");
});

function createActionBusExampleForm() {
  const empty = createEmptyCharacterCreationForm();

  return {
    ...empty,
    semanticSeedIds: ["fear_of_abandonment", "slow_burn"],
    identity: {
      ...empty.identity,
      characterName: "Avery Vale",
      birthplace: "Old harbor city",
      occupation: "Forensic accountant",
      pronouns: "they/them",
      genderIdentity: "Nonbinary",
    },
    personality: {
      ...empty.personality,
      archetype: "Watchful strategist with a caretaker streak",
      positiveTraits: "Patient, observant, loyal",
      flaws: "Guarded, stubborn, slow to ask for help",
    },
    psychology: {
      ...empty.psychology,
      coreWound: "Being useful was treated as the same thing as being loved",
      attachmentStyle: "Earned secure under consistency",
      conflictStyle: "Quiet first, precise later",
    },
    behaviour: {
      ...empty.behaviour,
      bodyLanguagePosture: "Keeps their shoulders squared near exits",
      goalOrientedActions: "Gathers evidence before making promises",
    },
    lifestyle: {
      ...empty.lifestyle,
      residence: "A warehouse flat above the harbor",
      wealth: "Cash-poor but resourceful",
    },
    relationships: {
      ...empty.relationships,
      affiliationCore: {
        factionOrGroup: "Disgraced merchant house",
        hierarchicalRank: "Public consultant, private protector",
        publicStatus: "Professionally distant while under investigation",
      },
      emotionalBonds: {
        attachmentType: "Slow-burn trust",
        trustMetric: "Vets every word until loyalty is proven",
        sharedHistoryAnchor:
          "They protected {{user}} during an auction scandal.",
      },
      behavioralFriction: {
        ideologicalClash: "Truth versus family survival",
        boundaries:
          "Does not use NPCs to pressure {{user}} into accepting care.",
        microAggressionsOrTells: "Gets overly formal when frightened.",
      },
      targetOverrides: [
        {
          targetId: "{{user}}",
          contextualPromptInjection:
            "With {{user}}, suspicion should soften after consistent honesty.",
        },
      ],
    },
    speechCommunication: {
      ...empty.speechCommunication,
      toneVocabulary: "Low, exact, dryly warm under pressure",
      subtext: "Care appears as practical risk assessment",
    },
  };
}
