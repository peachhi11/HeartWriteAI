import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const ENGINEERING_DOC = readFileSync(
  "docs/character-card-engineering.md",
  "utf8",
);

test("documents the three-layer character-card engineering model", () => {
  assert.match(ENGINEERING_DOC, /# Character Card Engineering/);
  assert.match(ENGINEERING_DOC, /### Level 1: Character Layer/);
  assert.match(ENGINEERING_DOC, /### Level 2: Writing Layer/);
  assert.match(ENGINEERING_DOC, /### Level 3: Context Architecture Layer/);
  assert.match(ENGINEERING_DOC, /This layer generates behavior/);
  assert.match(ENGINEERING_DOC, /This layer generates presentation/);
  assert.match(ENGINEERING_DOC, /This layer generates persistence/);
  assert.match(ENGINEERING_DOC, /Character Layer\s+x Writing Layer\s+x Context Architecture Layer\s+= Roleplay Quality/);
});

test("documents behavior architecture as event interpretation and reaction", () => {
  assert.match(ENGINEERING_DOC, /## Behavior Architecture Belongs to the Character Layer/);
  assert.match(ENGINEERING_DOC, /## Event-Driven Psychology/);
  assert.match(ENGINEERING_DOC, /## Metrics as Friction, Not Gates/);
  assert.match(ENGINEERING_DOC, /## Event Dominance/);
  assert.match(ENGINEERING_DOC, /## Psychological Defense Systems/);
  assert.match(ENGINEERING_DOC, /event -> interpretation -> reaction/);
});

test("documents common layer mismatch failure modes", () => {
  assert.match(ENGINEERING_DOC, /If behavior is wrong, examine the character layer/);
  assert.match(ENGINEERING_DOC, /If prose, formatting, or user agency is wrong, examine the writing layer/);
  assert.match(ENGINEERING_DOC, /If consistency fades over time, examine the context architecture layer/);
  assert.match(ENGINEERING_DOC, /Strong character plus strong writing plus poor architecture produces/);
});
