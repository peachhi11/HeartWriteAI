import assert from "node:assert/strict";
import test from "node:test";

import {
  PERSONALITY_ENGINE_VOCABULARY_CATEGORIES,
  PERSONALITY_ENGINE_VOCABULARY_PRESETS,
  compilePersonalityEngineVocabularyAdditions,
  findPersonalityEngineVocabularyById,
  getPersonalityEngineVocabularyByCategory,
} from "../../data/personalityEngineVocabularyPresets";

test("loads personality engine vocabulary across route, gate, pressure, and repair lanes", () => {
  assert.equal(PERSONALITY_ENGINE_VOCABULARY_PRESETS.length, 666);
  assert.deepEqual(PERSONALITY_ENGINE_VOCABULARY_CATEGORIES, [
    "Aftermath",
    "Archetype",
    "Attachment Style",
    "Betrayal Aftermath",
    "Betrayal Method",
    "Betrayal Trigger",
    "Core Identity",
    "De-escalation",
    "Desire",
    "Dislike",
    "Emotional State",
    "Escalation",
    "Gate",
    "High-Value Engine Tag",
    "Like",
    "Method",
    "Motivation",
    "Redemption Potential",
    "Resolution",
    "Response",
    "Romance Trope",
    "Route",
    "Route Entry",
    "Secret",
    "Severity",
    "Trait",
    "Trigger",
    "Wound",
  ]);

  const ids = PERSONALITY_ENGINE_VOCABULARY_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getPersonalityEngineVocabularyByCategory("Core Identity").length, 60);
  assert.equal(getPersonalityEngineVocabularyByCategory("Archetype").length, 40);
  assert.equal(getPersonalityEngineVocabularyByCategory("Trigger").length, 39);
  assert.equal(getPersonalityEngineVocabularyByCategory("Response").length, 41);
  assert.equal(getPersonalityEngineVocabularyByCategory("High-Value Engine Tag").length, 20);
});

test("normalises personality engine vocabulary for visible prompt text", () => {
  const grey = findPersonalityEngineVocabularyById("engine_core_identity_morally_grey");
  const humour = findPersonalityEngineVocabularyById(
    "engine_response_deflects_with_humour",
  );
  const artefact = findPersonalityEngineVocabularyById(
    "engine_betrayal_method_stolen_artefact",
  );
  const userPast = findPersonalityEngineVocabularyById(
    "engine_secret_knows_user_s_past",
  );
  const allText = JSON.stringify(PERSONALITY_ENGINE_VOCABULARY_PRESETS);

  assert.equal(grey?.value, "morally grey");
  assert.equal(humour?.value, "deflects with humour");
  assert.equal(artefact?.value, "stolen artefact");
  assert.equal(userPast?.value, "knows {{user}}'s past");
  assert.doesNotMatch(
    allText,
    /Use code with caution|deflects_with_humor|own user heart|soft_yandere|forbidden_teacher|force prose|SYSTEM PROTOCOL/i,
  );
});

test("compiles personality engine vocabulary as soft route context", () => {
  const preset = findPersonalityEngineVocabularyById(
    "engine_secret_hiding_true_identity",
  );
  assert.ok(preset);

  const additions = compilePersonalityEngineVocabularyAdditions(preset);

  assert.match(additions.personalityAddition, /Personality engine context/);
  assert.match(additions.relationshipAddition, /without replacing the character's full self/i);
  assert.match(additions.systemPromptAddition, /soft personality-engine context/i);
  assert.match(additions.systemPromptAddition, /\{\{user\}\} agency intact/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});
