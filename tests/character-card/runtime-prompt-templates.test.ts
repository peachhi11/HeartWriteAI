import assert from "node:assert/strict";
import test from "node:test";

import {
  HEARTWRITE_DEFAULT_RUNTIME_RESPONSE_PROMPT,
  HEARTWRITE_ENHANCED_CHARACTER_DEFINITION_PROMPT,
  HEARTWRITE_IMPERSONATION_TURN_PROMPT,
  HEARTWRITE_MAIN_REPLY_PROMPT,
  compileRuntimePromptTemplate,
} from "../../lib/character-card/runtimePromptTemplates";

test("defines the default main reply prompt with tense and POV contract", () => {
  assert.equal(
    HEARTWRITE_MAIN_REPLY_PROMPT,
    "Write {{char}}'s next reply in an immersive, character-driven roleplay with {{user}} in 3rd person past tense narrative, 1st person present tense dialogue.",
  );
  assert.match(HEARTWRITE_MAIN_REPLY_PROMPT, /3rd person past tense narrative/);
  assert.match(HEARTWRITE_MAIN_REPLY_PROMPT, /1st person present tense dialogue/);
});

test("keeps enhanced character definitions cumulative instead of static", () => {
  assert.match(
    HEARTWRITE_ENHANCED_CHARACTER_DEFINITION_PROMPT,
    /baseline identity, not a behavioral prison/,
  );
  assert.match(
    HEARTWRITE_ENHANCED_CHARACTER_DEFINITION_PROMPT,
    /repeated interaction/,
  );
  assert.match(
    HEARTWRITE_ENHANCED_CHARACTER_DEFINITION_PROMPT,
    /external events, pressure, loss, danger, success, failure, separation, revelation, and consequence/,
  );
  assert.match(
    HEARTWRITE_ENHANCED_CHARACTER_DEFINITION_PROMPT,
    /Do not reset emotional progress between scenes/,
  );
  assert.match(
    HEARTWRITE_ENHANCED_CHARACTER_DEFINITION_PROMPT,
    /experiences should leave traces/,
  );
});

test("builds the normal runtime response prompt without enabling impersonation", () => {
  assert.equal(
    compileRuntimePromptTemplate(),
    HEARTWRITE_DEFAULT_RUNTIME_RESPONSE_PROMPT,
  );
  assert.match(
    HEARTWRITE_DEFAULT_RUNTIME_RESPONSE_PROMPT,
    /Output only \{\{char\}\}'s immediate response/,
  );
  assert.match(
    HEARTWRITE_DEFAULT_RUNTIME_RESPONSE_PROMPT,
    /Never write thoughts, actions, decisions, or dialogue for \{\{user\}\}/,
  );
  assert.doesNotMatch(
    HEARTWRITE_DEFAULT_RUNTIME_RESPONSE_PROMPT,
    /normal rules preventing writing for \{\{user\}\} are suspended/,
  );
});

test("keeps impersonation prompt explicit and user-perspective only", () => {
  assert.equal(
    compileRuntimePromptTemplate({ impersonationTurn: true }),
    HEARTWRITE_IMPERSONATION_TURN_PROMPT,
  );
  assert.match(
    HEARTWRITE_IMPERSONATION_TURN_PROMPT,
    /Write the next reply only from the perspective of \{\{user\}\}/,
  );
  assert.match(
    HEARTWRITE_IMPERSONATION_TURN_PROMPT,
    /For this turn only, all normal rules preventing writing for \{\{user\}\} are suspended/,
  );
  assert.match(
    HEARTWRITE_IMPERSONATION_TURN_PROMPT,
    /Do not write \{\{char\}\}'s dialogue, actions, thoughts, feelings, or decisions/,
  );
  assert.match(HEARTWRITE_IMPERSONATION_TURN_PROMPT, /End before \{\{char\}\} responds/);
});
