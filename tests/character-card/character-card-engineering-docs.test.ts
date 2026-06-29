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

test("documents structured human view versus flattened LLM view", () => {
  assert.match(ENGINEERING_DOC, /## Human View vs LLM View/);
  assert.match(ENGINEERING_DOC, /The human view should stay structured/);
  assert.match(ENGINEERING_DOC, /The LLM view should be flattened/);
  assert.match(ENGINEERING_DOC, /Structured data for editing/);
  assert.match(ENGINEERING_DOC, /Flattened prose for prompting/);
});

test("documents cause-chain intake routing into biography psychology and engine", () => {
  assert.match(ENGINEERING_DOC, /## Cause Chain Intake/);
  assert.match(ENGINEERING_DOC, /What happened\?\s+-> Biography \/ Writer Bible/);
  assert.match(ENGINEERING_DOC, /What belief did this create\?\s+-> Psychology/);
  assert.match(ENGINEERING_DOC, /How does that belief affect decisions\?\s+-> Character Engine/);
  assert.match(ENGINEERING_DOC, /The belief becomes the durable psychological\s+truth/);
});

test("documents common layer mismatch failure modes", () => {
  assert.match(ENGINEERING_DOC, /If behavior is wrong, examine the character layer/);
  assert.match(ENGINEERING_DOC, /If prose, formatting, or user agency is wrong, examine the writing layer/);
  assert.match(ENGINEERING_DOC, /If consistency fades over time, examine the context architecture layer/);
  assert.match(ENGINEERING_DOC, /Strong character plus strong writing plus poor architecture produces/);
});
