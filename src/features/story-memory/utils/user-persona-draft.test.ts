import { describe, expect, it } from "vitest";

import type { LoadedCharacterCard } from "@/features/story-memory/utils/character-card-parser";

import { buildUserPersonaDraftFromCard } from "./user-persona-draft";

describe("buildUserPersonaDraftFromCard", () => {
  it("builds a separate female {{user}} persona for a Zeke-style card instead of copying the card", () => {
    const card = makeCard({
      firstMessage: [
        "Zeke had been dating Vanessa for a few weeks now.",
        "Specifically, a friend that's been there way before Vanessa. *{{user}}.*",
        "She still made her way into his messy dorm like it was her own.",
        "His hand rested heavy against her thigh while {{user}} watched over his shoulder.",
        "Vanessa: Were you just in the bathroom with her? Did she just suck your fucking dick?",
        "Vanessa: If you won't stop seeing her right now, we're done. Pick.",
        "Zeke muttered, \"Vanessa wants us to stop bein' friends.\"",
      ].join("\n\n"),
      name: "Zeke",
      scenario: "Zeke is caught between his girlfriend Vanessa and {{user}}, the friend who has been there way before Vanessa.",
    });

    const draft = buildUserPersonaDraftFromCard(card);
    const combined = Object.values(draft).join("\n");

    expect(draft.roleInStory).toContain("Female long-time friend");
    expect(draft.roleInStory).toContain("rather than a rewrite of Zeke");
    expect(draft.connectionToCharacter).toContain("before Vanessa became the active relationship pressure");
    expect(draft.connectionToCharacter).toContain("dorm, bed, hoodies, and mess");
    expect(draft.connectionToCharacter).toContain("line Zeke keeps crossing");
    expect(draft.openingAngle).toContain("Vanessa's ultimatum");
    expect(draft.selfConcept).toContain("before Vanessa had a claim on him");
    expect(draft.whatUserKnows).toContain("his hand was on her thigh");
    expect(draft.boundaries).toContain("Do not copy the character card into the persona");
    expect(draft.cardFitNotes).toContain("Zeke's card controls {{char}}");
    expect(combined).not.toContain("Zeke had been dating Vanessa for a few weeks now");
    expect(combined).not.toContain("Did she just suck your fucking dick");
  });

  it("uses the selected neutral persona frame even when the card does not define {{user}} pronouns", () => {
    const card = makeCard({
      firstMessage: "{{char}} waits at the edge of the station for {{user}} to arrive.",
      name: "Riven",
      scenario: "{{user}} is the only person who knows why Riven left the old crew.",
    });

    const draft = buildUserPersonaDraftFromCard(card, "neutral");

    expect(draft.roleInStory).toContain("Neutral user player");
    expect(draft.connectionToCharacter).toContain("the card's active scenario around Riven");
    expect(draft.whatUserKnows).toContain("their own history");
  });

  it("lets the selected persona gender override card-pronoun inference", () => {
    const card = makeCard({
      firstMessage: [
        "{{char}} dragged {{user}} into his apartment before anyone could follow.",
        "He told {{user}} that his brother would assume she was trouble if he saw them together.",
      ].join("\n"),
      name: "Dane",
      scenario: "{{user}} is his best friend's sister and everyone thinks she should stay away from him.",
    });

    const maleDraft = buildUserPersonaDraftFromCard(card, "male");
    const femaleDraft = buildUserPersonaDraftFromCard(card, "female");
    const inferredDraft = buildUserPersonaDraftFromCard(card, "infer");

    expect(maleDraft.roleInStory).toContain("Male");
    expect(maleDraft.whatUserKnows).toContain("his own history");
    expect(femaleDraft.roleInStory).toContain("Female");
    expect(femaleDraft.whatUserKnows).toContain("her own history");
    expect(inferredDraft.roleInStory).toContain("Female");
  });
});

function makeCard(overrides: Partial<LoadedCharacterCard>): LoadedCharacterCard {
  return {
    alternateGreetings: [],
    format: "Test card",
    importedAt: "2026-09-25T00:00:00.000Z",
    rawText: "",
    tags: [],
    warnings: [],
    ...overrides,
  };
}
