import assert from "node:assert/strict";
import test from "node:test";

import {
  ContinuityCanonLedgerSchema,
  applyContinuityCanonLedgerUpdate,
  auditContinuityCanonLedger,
  compileContinuityCanonPromptContext,
  createContinuityCanonLedger,
  createContinuityCanonLedgerFromNarrativeRuntime,
} from "../../lib/continuityCanonLedger";
import {
  createDefaultNarrativeRuntimeState,
  processNarrativeTurn,
} from "../../lib/character-card/narrativeEngine";

test("creates a normalized continuity canon ledger with stable v1 schema", () => {
  const ledger = createContinuityCanonLedger({
    characterId: "avery",
    characterStates: [
      {
        characterId: "avery",
        displayName: "Avery Vale",
        location: "warehouse flat",
        knowledge: ["auction scandal"],
        constraints: ["does not pressure care"],
        updatedAtTurn: 2,
      },
    ],
    relationshipStates: [
      {
        id: "relationship:avery:primary",
        participantIds: ["Avery", "{{user}}"],
        publicStatus: "professionally distant",
        privateStatus: "slow-burn trust",
        openLoops: ["old debt pressure"],
        boundaries: ["no coercive care"],
        updatedAtTurn: 2,
      },
    ],
    facts: [
      {
        id: "fact:setting:harbor",
        category: "location",
        scope: "setting_truth",
        statement: "The current scenario is set above the harbor.",
        source: {
          tier: "setting_truth",
          label: "Scenario",
          reviewRequired: false,
          hiddenFromUser: false,
        },
        evidence: [],
        tags: ["harbor"],
        active: true,
        confidence: 90,
        promptVisibility: "prompt_safe",
        hiddenFromUser: false,
      },
    ],
  });

  assert.equal(ledger.schemaVersion, 1);
  assert.equal(ContinuityCanonLedgerSchema.parse(ledger).characterId, "avery");
  assert.equal(ledger.characterStates.length, 1);
  assert.equal(ledger.relationshipStates.length, 1);
});

test("projects prompt-safe canon without leaking internal ids or review-only facts", () => {
  const ledger = createContinuityCanonLedger({
    characterId: "julian",
    facts: [
      {
        id: "fact:public",
        category: "relationship",
        scope: "story_truth",
        statement: "Julian remembers that trust broke after the hospital lie.",
        source: {
          tier: "story_truth",
          label: "Lorebook",
          sourceId: "story-lorebook-entry-1",
          reviewRequired: false,
          hiddenFromUser: false,
        },
        evidence: ["chapter 4"],
        tags: ["trust"],
        active: true,
        confidence: 80,
        promptVisibility: "prompt_safe",
        hiddenFromUser: false,
      },
      {
        id: "fact:review",
        category: "memory",
        scope: "runtime_context",
        statement: "Writer-only twist should not enter the prompt.",
        source: {
          tier: "runtime_context",
          label: "Private Notes",
          reviewRequired: true,
          hiddenFromUser: true,
        },
        evidence: [],
        tags: ["spoiler"],
        active: true,
        confidence: 80,
        promptVisibility: "review_required",
        hiddenFromUser: true,
      },
    ],
    hardConstraints: [
      {
        id: "constraint:mute",
        label: "Uses written replies",
        rule: "The character does not speak aloud while injured.",
        alternativeAction: "Writes, gestures, or signals for help.",
        source: {
          tier: "character_truth",
          label: "Character Engine",
          reviewRequired: false,
          hiddenFromUser: false,
        },
        scope: "character_truth",
        tags: ["replacement_action"],
        promptVisibility: "prompt_safe",
      },
    ],
  });
  const prompt = compileContinuityCanonPromptContext(ledger);

  assert.match(prompt, /hospital lie/);
  assert.match(prompt, /writes, gestures, or signals/);
  assert.doesNotMatch(prompt, /Known canon:|Hard constraint:|Alternative action:/);
  assert.doesNotMatch(prompt, /fact:public|constraint:mute|story-lorebook-entry-1/);
  assert.doesNotMatch(prompt, /Writer-only twist/);
});

test("applies ledger updates with upsert behavior and audits missing alternatives", () => {
  const ledger = createContinuityCanonLedger({
    characterId: "mara",
    hardConstraints: [
      {
        id: "constraint:protocol",
        label: "Bound by protocol",
        rule: "Mara cannot break medical protocol casually.",
        source: {
          tier: "character_truth",
          label: "Character Engine",
          reviewRequired: false,
          hiddenFromUser: false,
        },
        scope: "character_truth",
        tags: ["protocol"],
        promptVisibility: "prompt_safe",
      },
    ],
  });
  const updated = applyContinuityCanonLedgerUpdate(ledger, {
    hardConstraints: [
      {
        id: "constraint:protocol",
        label: "Bound by protocol",
        rule: "Mara cannot break medical protocol casually.",
        alternativeAction:
          "Explains the rule, delegates safely, or seeks consented alternatives.",
        source: {
          tier: "character_truth",
          label: "Character Engine",
          reviewRequired: false,
          hiddenFromUser: false,
        },
        scope: "character_truth",
        tags: ["protocol"],
        promptVisibility: "prompt_safe",
      },
    ],
  });

  assert.equal(updated.hardConstraints.length, 1);
  assert.equal(auditContinuityCanonLedger(ledger).length, 1);
  assert.equal(auditContinuityCanonLedger(updated).length, 0);
});

test("bridges narrative runtime into timeline, memory, fact, and constraint canon", () => {
  const runtime = processNarrativeTurn(
    createDefaultNarrativeRuntimeState({
      characterId: "rowan",
      causeProfile: {
        immutableLaws: [
          {
            id: "law:autonomy",
            label: "Protect autonomy",
            priority: 1,
            description: "Rowan will not decide for someone else.",
            protects: ["autonomy"],
            pressuredBy: ["being ordered"],
            generatedBehaviors: ["asks before acting"],
          },
        ],
        storyTruths: [
          {
            id: "secret-route",
            scope: "secret",
            label: "Hidden vow",
            truth: "Rowan is privately bound by an old vow.",
            pressure: "The vow complicates confession.",
            active: true,
          },
        ],
      },
    }),
    {
      label: "Confession under pressure",
      summary: "Rowan admits the vow during a crisis.",
      tier: "major_event",
      outcome: "reveal",
      tags: ["confession", "secret", "crisis"],
    },
  ).state;

  const ledger = createContinuityCanonLedgerFromNarrativeRuntime(runtime);
  const prompt = compileContinuityCanonPromptContext(ledger);

  assert.equal(ledger.timeline.length, 1);
  assert.equal(ledger.memoryAnchors.length, 1);
  assert.equal(ledger.facts.length, 1);
  assert.equal(ledger.hardConstraints.length, 1);
  assert.match(prompt, /old vow/);
  assert.match(prompt, /Rowan admits the vow/);
  assert.match(prompt, /asks before acting/);
  assert.doesNotMatch(prompt, /Timeline anchor:|Memory anchor:|Known canon:/);
  assert.doesNotMatch(prompt, /secret-route|law:autonomy|runtime-truth/);
});
