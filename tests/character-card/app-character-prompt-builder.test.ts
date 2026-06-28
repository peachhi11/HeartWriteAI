import assert from "node:assert/strict";
import test from "node:test";

import {
  buildCharacterGenPrompt,
  buildCharacterGenPromptTagged,
  buildFillMissingPrompt,
  buildImagePrompt,
  buildRegeneratePrompt,
} from "../../lib/character-card/appCharacterPromptBuilder";
import { buildFieldDetailLines } from "../../lib/character-card/fieldDetail";

const baseInput = {
  idea: "A rain-soaked academy rival with a secret scholarship threat.",
  name: "Mara Vale",
  outputLanguage: "Spanish",
  pov: "third" as const,
};

test("builds JSON character generation prompts with default negative prompt omitted", () => {
  const prompt = buildCharacterGenPrompt(baseInput, {
    contentRating: "sfw",
    useDefaultNegativePrompt: true,
  });

  assert.match(prompt, /Return ONLY valid JSON/);
  assert.match(prompt, /name, description, personality, scenario, first_mes/);
  assert.match(prompt, /image_prompt, pov/);
  assert.doesNotMatch(prompt, /image_prompt, negative_prompt, pov/);
  assert.match(prompt, /Do NOT output negative_prompt; the app will supply it/);
  assert.match(prompt, /Always write image_prompt in English/);
  assert.doesNotMatch(prompt, /Always write image_prompt and negative_prompt in English/);
});

test("builds JSON character generation prompts with explicit negative prompt rules", () => {
  const prompt = buildCharacterGenPrompt(baseInput, {
    contentRating: "nsfw_allowed",
  });

  assert.match(prompt, /image_prompt, negative_prompt, pov/);
  assert.match(prompt, /negative_prompt: English, single line/);
  assert.match(prompt, /NSFW allowed/);
  assert.match(prompt, /focus negative_prompt on quality\/artifacts/);
  assert.match(prompt, /Always write image_prompt and negative_prompt in English/);
});

test("keeps first message requirements agency-safe and story-opening oriented", () => {
  const prompt = buildCharacterGenPrompt(baseInput, {
    contentRating: "sfw",
  });

  assert.match(prompt, /opening of a story scene, not a greeting/);
  assert.match(prompt, /Start in medias res/);
  assert.match(prompt, /Show \{\{char\}\} doing something right now/);
  assert.match(prompt, /do not narrate \{\{user\}\}'s thoughts/);
  assert.match(prompt, /End with a hook that demands a response/);
});

test("builds tagged prompts without mojibake and with the full template", () => {
  const prompt = buildCharacterGenPromptTagged(baseInput, {
    contentRating: "sfw",
    useDefaultNegativePrompt: true,
  });

  assert.match(prompt, /#NAME#/);
  assert.match(prompt, /#NEGATIVE_PROMPT#/);
  assert.match(prompt, /350-500 characters/);
  assert.match(prompt, /\{\{user\}\}'s presence/);
  assert.doesNotMatch(prompt, /\u00e2/);
});

test("builds fill-missing prompts for only requested missing fields", () => {
  const prompt = buildFillMissingPrompt({
    card: {
      name: "Mara Vale",
      description: "Existing description.",
    },
    idea: baseInput.idea,
    missingKeys: ["first_mes", "tags", "negative_prompt"],
    pov: "third",
  });

  assert.match(prompt, /containing ONLY the missing keys/);
  assert.match(prompt, /Missing keys:\nfirst_mes, tags, negative_prompt/);
  assert.match(prompt, /If first_mes is among the missing keys/);
  assert.match(prompt, /first_mes:/);
  assert.match(prompt, /tags:/);
  assert.doesNotMatch(prompt, /negative_prompt:/);
});

test("builds image prompts with normal newlines and optional negative prompt", () => {
  const prompt = buildImagePrompt({
    card: { name: "Mara Vale", description: "Rain-soaked academy rival." },
    contentRating: "sfw",
    styleHints: "cinematic portrait",
  });

  assert.match(prompt, /Return ONLY valid JSON with keys: image_prompt, negative_prompt/);
  assert.match(prompt, /Character fields:\n\{/);
  assert.doesNotMatch(prompt, /Character fields:\\n/);
  assert.match(prompt, /explicit sexual content to avoid/);
});

test("builds regenerate prompts with nonce and target-field field detail only", () => {
  const prompt = buildRegeneratePrompt(
    {
      card: { first_mes: "Old opener.", personality: "Old personality." },
      idea: baseInput.idea,
      pov: "third",
      regenNonce: "abc123",
      requestedName: "Mara Vale",
      targets: ["personality", "first_mes", "image_prompt"],
    },
    { fieldDetail: { level: "compact" } },
  );

  assert.match(prompt, /Regeneration nonce/);
  assert.match(prompt, /abc123/);
  assert.match(prompt, /Target keys:\npersonality, first_mes, image_prompt/);
  assert.match(prompt, /If first_mes is among the target keys/);
  assert.match(prompt, /- personality: 1-2 paragraphs/);
  assert.match(prompt, /- first_mes: 2-3 paragraphs/);
  assert.doesNotMatch(prompt, /- scenario:/);
});

test("builds field detail lines with overrides", () => {
  assert.deepEqual(
    buildFieldDetailLines(
      {
        level: "expanded",
        overrides: {
          tags: "- tags: exactly five tags.",
        },
      },
      ["description", "tags"],
    ),
    [
      "- description: 3-5 polished paragraphs covering identity, appearance, social role, emotional presence, lifestyle, and story hooks.",
      "- tags: exactly five tags.",
    ],
  );
});
