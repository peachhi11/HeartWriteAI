import test from "node:test";
import assert from "node:assert/strict";

import { compilePersonaPostHistoryInstruction, compilePersonaPromptBlock } from "../../lib/persona/compilePersonaPromptBlock";
import { createEmptyPersonaCardFormValues } from "../../lib/persona/createEmptyPersonaCardFormValues";
import { createPersonaCardFromFormValues } from "../../lib/persona/createPersonaCardFromFormValues";
import { createPersonaCardExportFileName } from "../../lib/persona/createPersonaCardExportFileName";

test("compiles only the playable persona block for normal AI context", () => {
  const values = createEmptyPersonaCardFormValues();
  values.displayName = "{{user}}";
  values.age = "22";
  values.gender = "Female";
  values.appearance = "Soft green eyes and long dark hair.";
  values.personality = "Sweet, affectionate, and soft-spoken.";
  values.notes = "Private reply-writing notes.";

  const persona = createPersonaCardFromFormValues(values);
  const promptBlock = compilePersonaPromptBlock(persona);

  assert.match(promptBlock, /# \{\{user\}\} Persona/);
  assert.match(promptBlock, /## Basic Details/);
  assert.match(promptBlock, /- Age: 22/);
  assert.match(promptBlock, /## Appearance/);
  assert.match(promptBlock, /## Personality/);
  assert.doesNotMatch(promptBlock, /Private reply-writing notes/);
  assert.doesNotMatch(promptBlock, /psychological profile/i);
});

test("keeps persona notes in PHI impersonation support", () => {
  const values = createEmptyPersonaCardFormValues();
  values.notes = "She tends to choose gentle refusal before direct confrontation.";

  const persona = createPersonaCardFromFormValues(values);
  const phi = compilePersonaPostHistoryInstruction(persona);

  assert.match(phi, /\[PERSONA IMPERSONATION SUPPORT\]/);
  assert.match(phi, /explicitly asks for help writing as \{\{user\}\}/);
  assert.match(phi, /gentle refusal/);
});

test("links matched personas to a character without making it the only option", () => {
  const values = createEmptyPersonaCardFormValues();
  values.creationMode = "matched_to_character";
  values.linkedCharacterName = "Nikolai Volkov";
  values.linkedCharacterCardId = "cc-seed-001";
  values.setAsCharacterDefault = true;

  const persona = createPersonaCardFromFormValues(values);

  assert.equal(persona.creationMode, "matched_to_character");
  assert.equal(persona.linkedCharacters.length, 1);
  assert.equal(persona.linkedCharacters[0].characterCardId, "cc-seed-001");
  assert.equal(persona.linkedCharacters[0].isDefaultForCharacter, true);
  assert.equal(persona.linkedCharacters[0].linkSource, "persona_match");
});

test("creates a stable persona card export filename", () => {
  const values = createEmptyPersonaCardFormValues();
  values.displayName = "Soft Dollcore Persona";

  const persona = createPersonaCardFromFormValues(values);

  assert.equal(
    createPersonaCardExportFileName(persona),
    "soft-dollcore-persona.heartpersona.json",
  );
});
