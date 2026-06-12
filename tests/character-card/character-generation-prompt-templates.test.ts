import assert from "node:assert/strict";
import test from "node:test";

import {
  HEARTWRITE_CHARACTER_GENERATION_CARD_PROMPT,
  HEARTWRITE_CHARACTER_GENERATION_OPENING_PROMPT,
  HEARTWRITE_CHARACTER_GENERATION_SCENARIO_PROMPT,
  HEARTWRITE_INITIAL_STARTER_PROMPT,
  HEARTWRITE_STRUCTURED_SCENARIO_GENERATION_PROMPT,
  compileCharacterGenerationPromptTemplate,
  compileInitialStarterPromptTemplate,
  compileStructuredScenarioPromptTemplate,
} from "../../lib/character-card/characterGenerationPromptTemplates";

test("defines a CCv3-ready character generation prompt without legacy source-count claims", () => {
  assert.match(
    HEARTWRITE_CHARACTER_GENERATION_CARD_PROMPT,
    /Generate a CCv3-ready \{\{char\}\} character card/,
  );
  assert.match(
    HEARTWRITE_CHARACTER_GENERATION_CARD_PROMPT,
    /Preserve \{\{char\}\} macros literally/,
  );
  assert.match(HEARTWRITE_CHARACTER_GENERATION_CARD_PROMPT, /first_mes/);
  assert.match(HEARTWRITE_CHARACTER_GENERATION_CARD_PROMPT, /post_history_instructions/);
  assert.doesNotMatch(HEARTWRITE_CHARACTER_GENERATION_CARD_PROMPT, /Use exactly four different sources/);
  assert.doesNotMatch(HEARTWRITE_CHARACTER_GENERATION_CARD_PROMPT, /fandom\.com/);
});

test("keeps scenario generation instructional and separate from the opening scene", () => {
  assert.match(
    HEARTWRITE_CHARACTER_GENERATION_SCENARIO_PROMPT,
    /clear instructions and definitions/,
  );
  assert.match(HEARTWRITE_CHARACTER_GENERATION_SCENARIO_PROMPT, /morning, day, and evening/);
  assert.match(
    HEARTWRITE_CHARACTER_GENERATION_SCENARIO_PROMPT,
    /Do not build the opening message here/,
  );
});

test("defines a structured scenario prompt with fixed output headings", () => {
  assert.match(
    HEARTWRITE_STRUCTURED_SCENARIO_GENERATION_PROMPT,
    /Generate a roleplay scenario from the provided premise/,
  );
  assert.match(HEARTWRITE_STRUCTURED_SCENARIO_GENERATION_PROMPT, /\[SETTING & WORLD\]/);
  assert.match(HEARTWRITE_STRUCTURED_SCENARIO_GENERATION_PROMPT, /- Location:/);
  assert.match(HEARTWRITE_STRUCTURED_SCENARIO_GENERATION_PROMPT, /\[THE RELATIONSHIP\]/);
  assert.match(HEARTWRITE_STRUCTURED_SCENARIO_GENERATION_PROMPT, /- Status:/);
  assert.match(HEARTWRITE_STRUCTURED_SCENARIO_GENERATION_PROMPT, /- Past:/);
  assert.match(HEARTWRITE_STRUCTURED_SCENARIO_GENERATION_PROMPT, /- Current Perception:/);
  assert.match(HEARTWRITE_STRUCTURED_SCENARIO_GENERATION_PROMPT, /\[THE PLOT\]/);
  assert.match(HEARTWRITE_STRUCTURED_SCENARIO_GENERATION_PROMPT, /- Context:/);
  assert.match(HEARTWRITE_STRUCTURED_SCENARIO_GENERATION_PROMPT, /- Immediate Goal:/);
});

test("keeps structured scenario generation open-ended and user-agency safe", () => {
  assert.match(
    HEARTWRITE_STRUCTURED_SCENARIO_GENERATION_PROMPT,
    /Use the premise as a flexible seed, not a command to force outcomes/,
  );
  assert.match(
    HEARTWRITE_STRUCTURED_SCENARIO_GENERATION_PROMPT,
    /Do not decide \{\{user\}\}'s actions, thoughts, feelings, dialogue, consent, or allegiance/,
  );
  assert.match(
    HEARTWRITE_STRUCTURED_SCENARIO_GENERATION_PROMPT,
    /without controlling \{\{user\}\}/,
  );
  assert.match(
    HEARTWRITE_STRUCTURED_SCENARIO_GENERATION_PROMPT,
    /Do not build the opening message here/,
  );
});

test("keeps opening message generation agency-safe and format-aware", () => {
  assert.match(HEARTWRITE_CHARACTER_GENERATION_OPENING_PROMPT, /maximum of three paragraphs/);
  assert.match(
    HEARTWRITE_CHARACTER_GENERATION_OPENING_PROMPT,
    /3rd person past tense narration and 1st person present tense dialogue/,
  );
  assert.match(
    HEARTWRITE_CHARACTER_GENERATION_OPENING_PROMPT,
    /Do not control, decide, or imply \{\{user\}\}'s thoughts, actions, dialogue, or feelings/,
  );
  assert.match(HEARTWRITE_CHARACTER_GENERATION_OPENING_PROMPT, /without over-focusing on eyes/);
});

test("defines an initial starter prompt with cinematic paragraph and tense rules", () => {
  assert.match(
    HEARTWRITE_INITIAL_STARTER_PROMPT,
    /initial starter prompt \/ first message/,
  );
  assert.match(HEARTWRITE_INITIAL_STARTER_PROMPT, /Write 4-6 paragraphs/);
  assert.match(
    HEARTWRITE_INITIAL_STARTER_PROMPT,
    /cinematic literary grounded prose with no purple phrasing/,
  );
  assert.match(HEARTWRITE_INITIAL_STARTER_PROMPT, /3rd person past tense narrative/);
  assert.match(
    HEARTWRITE_INITIAL_STARTER_PROMPT,
    /1st person present tense dialogue wrapped in double quotes/,
  );
  assert.match(
    HEARTWRITE_INITIAL_STARTER_PROMPT,
    /internal thoughts in 1st person present tense wrapped in asterisks/,
  );
});

test("keeps the initial starter anchored to char POV and user-safe", () => {
  assert.match(
    HEARTWRITE_INITIAL_STARTER_PROMPT,
    /Describe what \{\{char\}\} is doing right before \{\{user\}\} interacts/,
  );
  assert.match(HEARTWRITE_INITIAL_STARTER_PROMPT, /Anchor narration to \{\{char\}\} only/);
  assert.match(HEARTWRITE_INITIAL_STARTER_PROMPT, /No omniscient narration/);
  assert.match(HEARTWRITE_INITIAL_STARTER_PROMPT, /No head-hopping/);
  assert.match(
    HEARTWRITE_INITIAL_STARTER_PROMPT,
    /Never write \{\{user\}\}'s dialogue, actions, thoughts, feelings, intentions, or decisions/,
  );
  assert.match(HEARTWRITE_INITIAL_STARTER_PROMPT, /Never assume \{\{user\}\}'s reaction/);
});

test("compiles default generation prompt with explicit non-NSFW adult field boundary", () => {
  const prompt = compileCharacterGenerationPromptTemplate();

  assert.match(prompt, /Source mode: use only the provided character brief/);
  assert.match(prompt, /Adult field mode: omit explicit anatomy/);
  assert.match(prompt, /Generate a CCv3-ready/);
  assert.match(prompt, /Write the scenario field/);
  assert.match(prompt, /Write \{\{char\}\}'s starting message/);
  assert.doesNotMatch(prompt, /adult-only NSFW details may be generated/);
});

test("compiles research-note and adult-only variants only when requested", () => {
  const prompt = compileCharacterGenerationPromptTemplate({
    includeAdultFields: true,
    sourceMode: "research_notes",
    sections: ["character"],
  });

  assert.match(prompt, /Source mode: use supplied research notes as evidence/);
  assert.match(prompt, /adult-only NSFW details may be generated when explicitly supported/);
  assert.match(prompt, /Do not force binary anatomy assumptions/);
  assert.doesNotMatch(prompt, /Write the scenario field/);
  assert.doesNotMatch(prompt, /Write \{\{char\}\}'s starting message/);
});

test("compiles structured scenario prompts with supplied premise placeholders", () => {
  const prompt = compileStructuredScenarioPromptTemplate({
    premisePlaceholder: "A detective investigating a cyber-crime",
  });

  assert.match(
    prompt,
    /Please provide a scenario based on the following premise: A detective investigating a cyber-crime/,
  );
  assert.match(prompt, /\[SETTING & WORLD\]/);
  assert.match(prompt, /\[THE RELATIONSHIP\]/);
  assert.match(prompt, /\[THE PLOT\]/);
  assert.match(prompt, /\{\{char\}\}/);
  assert.match(prompt, /\{\{user\}\}/);
});

test("compiles structured scenario prompts with a safe generic premise placeholder", () => {
  const prompt = compileStructuredScenarioPromptTemplate();

  assert.match(
    prompt,
    /Please provide a scenario based on the following premise: \[Insert your basic idea, theme, character, trope, or conflict here\]/,
  );
});

test("compiles initial starter prompts with supplied scenario context", () => {
  const prompt = compileInitialStarterPromptTemplate({
    scenarioPlaceholder:
      "{{char}} is waiting in a rain-bright train station after a failed confession.",
  });

  assert.match(
    prompt,
    /Write the first message from this scenario\/context:\n\{\{char\}\} is waiting in a rain-bright train station/,
  );
  assert.match(prompt, /Write 4-6 paragraphs/);
  assert.match(prompt, /\{\{char\}\}/);
  assert.match(prompt, /\{\{user\}\}/);
});

test("compiles initial starter prompts with a safe generic scenario placeholder", () => {
  const prompt = compileInitialStarterPromptTemplate();

  assert.match(
    prompt,
    /\[Insert the generated scenario, character card context, or opening premise here\]/,
  );
});
