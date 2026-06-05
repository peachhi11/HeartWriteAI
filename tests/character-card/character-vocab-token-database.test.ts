import assert from "node:assert/strict";
import test from "node:test";

import {
  CHARACTER_VOCAB_CATEGORIES,
  CHARACTER_VOCAB_TOKENS,
  REQUESTED_VOCAB_TOKEN_TOTAL,
  VOCAB_REJECT_PATTERNS,
  VOCAB_TOKEN_TARGETS,
  buildCharacterVocabExportPayload,
  buildCharacterVocabYamlExports,
  compileVocabTokenPromptCue,
  createVocabRetrievalDocuments,
  exportCharacterVocabJson,
  exportCharacterVocabYaml,
  findVocabTokenById,
  getVocabTokensByCategory,
  normalizeToken,
  triggerActions,
  triggerSubjects,
  woundBases,
  woundForms,
} from "../../data/characterVocabTokenDatabase";

test("generates the requested deterministic vocabulary split", () => {
  assert.equal(REQUESTED_VOCAB_TOKEN_TOTAL, 6600);
  assert.equal(CHARACTER_VOCAB_TOKENS.length, REQUESTED_VOCAB_TOKEN_TOTAL);

  for (const category of CHARACTER_VOCAB_CATEGORIES) {
    assert.equal(
      getVocabTokensByCategory(category).length,
      VOCAB_TOKEN_TARGETS[category],
      category,
    );
  }

  const ids = CHARACTER_VOCAB_TOKENS.map((token) => token.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("normalizes ids, rejects unsafe source patterns, and keeps template seeds visible", () => {
  assert.equal(
    normalizeToken(`  Fear of "Abandonment"!!  `),
    "fear_of_abandonment",
  );

  assert.deepEqual(triggerSubjects, [
    "user",
    "rival",
    "family",
    "enemy",
    "lover",
    "friend",
    "authority",
    "faction",
  ]);
  assert.ok(triggerActions.includes("rejects affection"));
  assert.ok(woundForms.includes("fear of"));
  assert.ok(woundBases.includes("abandonment"));

  for (const token of CHARACTER_VOCAB_TOKENS) {
    assert.equal(token.id, `${token.category}_${normalizeToken(token.label)}`);
    assert.ok(token.label.trim().length > 0);

    for (const pattern of VOCAB_REJECT_PATTERNS) {
      assert.doesNotMatch(token.id, pattern);
      assert.doesNotMatch(token.label, pattern);
    }
  }
});

test("adds aliases and consent-aware content flags for romance-relevant tokens", () => {
  const abandonment = findVocabTokenById("fear_of_abandonment");
  const userLies = findVocabTokenById("user_lies");
  const forbidden = findVocabTokenById("romance_tropes_core_trope_forbidden_love");

  assert.ok(abandonment);
  assert.equal(abandonment.id, "emotional_wounds_fear_of_abandonment");
  assert.equal(abandonment.category, "emotional_wounds");
  assert.deepEqual(abandonment.aliases, [
    "abandonment_anxiety",
    "afraid_of_abandonment",
    "fear_of_abandonment",
  ]);
  assert.equal(abandonment.polarity, "negative");
  assert.equal(abandonment.intensity, "intense");
  assert.equal(abandonment.adult, false);
  assert.equal(abandonment.unsafe, false);
  assert.equal(abandonment.romanceRelevant, true);
  assert.equal(abandonment.contentFlags?.adult_romance, true);
  assert.equal(abandonment.contentFlags?.explicit_allowed, false);
  assert.equal(abandonment.contentFlags?.consent_required, true);

  assert.ok(userLies);
  assert.equal(userLies.id, "triggers_user_lies");
  assert.ok(userLies.aliases?.includes("user_dishonesty"));

  assert.ok(forbidden);
  assert.equal(forbidden.contentFlags?.taboo_risk, true);
  assert.equal(forbidden.unsafe, false);
});

test("exports JSON and YAML from one source of truth", () => {
  const payload = buildCharacterVocabExportPayload();
  const parsed = JSON.parse(exportCharacterVocabJson()) as typeof payload;
  const yaml = exportCharacterVocabYaml();
  const fileExports = buildCharacterVocabYamlExports();

  assert.equal(payload.total, REQUESTED_VOCAB_TOKEN_TOTAL);
  assert.equal(parsed.total, REQUESTED_VOCAB_TOKEN_TOTAL);
  assert.equal(parsed.tokens.length, REQUESTED_VOCAB_TOKEN_TOTAL);
  assert.match(yaml, /schema: "heartwriteai\.character_vocab_tokens\.v1"/);
  assert.match(yaml, /categoryTargets:/);

  assert.deepEqual(Object.keys(fileExports).sort(), [
    "appearance.body.yaml",
    "appearance.face.yaml",
    "appearance.style.yaml",
    "goals.long_term.yaml",
    "goals.short_term.yaml",
    "personality.responses.yaml",
    "personality.traits.yaml",
    "personality.triggers.yaml",
    "personality.wounds.yaml",
    "romance.gates.yaml",
    "romance.routes.yaml",
    "romance.tropes.yaml",
    "safety.flags.yaml",
  ]);
  assert.match(fileExports["personality.wounds.yaml"], /fear_of_abandonment/);
  assert.match(fileExports["safety.flags.yaml"], /consent_required_for_romance: true/);
});

test("creates prompt cues and retrieval documents without forcing character behavior", () => {
  const token = findVocabTokenById("triggers_user_lies");
  assert.ok(token);

  const cue = compileVocabTokenPromptCue(token);
  const [doc] = createVocabRetrievalDocuments([token]);

  assert.match(cue, /Vocabulary cue: User lies/);
  assert.match(cue, /\{\{user\}\} agency intact/);
  assert.doesNotMatch(cue, /must|force prose|override/i);

  assert.equal(doc.metadata.id, "triggers_user_lies");
  assert.equal(doc.metadata.category, "triggers");
  assert.match(doc.pageContent, /category: triggers/);
  assert.match(doc.pageContent, /aliases: user_dishonesty, user_lies/);
});
