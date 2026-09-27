import { describe, expect, it } from "vitest";

import type { LoadedCharacterCard } from "@/features/story-memory/utils/character-card-parser";

import { buildUserPersonaDraftFromCard, romanticRoleplayUserPersonaPrompt } from "./user-persona-draft";

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
      tags: ["Friends to Lovers", "Situationship", "College"],
    });

    const draft = buildUserPersonaDraftFromCard(card);
    const combined = Object.values(draft).join("\n");

    expect(draft.roleInStory).toContain("Female long-time friend");
    expect(draft.roleInStory).toContain("rather than a rewrite of Zeke");
    expect(draft.tropeRelationshipWorldContext).toContain("friends-to-lovers pressure");
    expect(draft.tropeRelationshipWorldContext).toContain("messy situationship/FWB pressure");
    expect(draft.tropeRelationshipWorldContext).toContain("college/dorm contemporary world");
    expect(draft.tropeRelationshipWorldContext).toContain("active partner jealousy");
    expect(draft.connectionToCharacter).toContain("before Vanessa became the active relationship pressure");
    expect(draft.connectionToCharacter).toContain("dorm, bed, hoodies, and mess");
    expect(draft.connectionToCharacter).toContain("line Zeke keeps crossing");
    expect(draft.openingAngle).toContain("Vanessa's ultimatum");
    expect(draft.selfConcept).toContain("before Vanessa had a claim on him");
    expect(combined).not.toContain("own person in");
    expect(draft.appearancePresentation).toContain("Memorable but editable physical anchors");
    expect(draft.relationalBackstory).toContain("A past romantic disappointment");
    expect(draft.psychologyInternalConflict).toContain("Core wound");
    expect(draft.romanticIntimateDynamics).toContain("Love languages");
    expect(draft.compatibilityArchitecture).toContain("Compatibility summary");
    expect(draft.compatibilityArchitecture).toContain("Enduring compatibility");
    expect(draft.compatibilityArchitecture).toContain("Enduring conflict");
    expect(draft.interactionStyle).toContain("Flirtation style");
    expect(draft.narrativeArc).toContain("Romantic payoff");
    expect(draft.sceneOpportunities).toContain("1. A private aftermath scene");
    expect(draft.sceneOpportunities).toContain("10. A turning-point scene");
    expect(draft.voiceDialogue).toContain("Tension line");
    expect(draft.whatUserKnows).toContain("his hand was on her thigh");
    expect(draft.boundaries).toContain("The character card stays source context for {{char}}");
    expect(draft.cardFitNotes).toContain("Zeke's card controls {{char}}");
    expect(combined).not.toMatch(/\bshould\b/i);
    expect(combined).not.toContain("Zeke had been dating Vanessa for a few weeks now");
    expect(combined).not.toContain("Did she just suck your fucking dick");
  });

  it("uses card tags to detect supernatural, world, and relationship context", () => {
    const card = makeCard({
      description: "A possessive vampire prince keeps {{user}} close because court rivals are circling.",
      name: "Lucien",
      scenario: "{{user}} is the only human in a vampire court who knows Lucien's private weakness.",
      tags: ["Vampire", "Morally Grey Love Interest", "Forbidden Attraction"],
    });

    const draft = buildUserPersonaDraftFromCard(card, "neutral");

    expect(draft.tropeRelationshipWorldContext).toContain("supernatural-romance pressure");
    expect(draft.tropeRelationshipWorldContext).toContain("dark-romance pressure");
    expect(draft.tropeRelationshipWorldContext).toContain("forbidden attraction pressure");
    expect(draft.tropeRelationshipWorldContext).toContain("supernatural world");
    expect(draft.relationalBackstory).toContain("supernatural world");
    expect(draft.narrativeArc).toContain("supernatural-romance pressure");
  });

  it("turns concrete card facts into user persona fields instead of prompt instructions", () => {
    const card = makeCard({
      description: [
        "Kieran is {{user}}'s stepbrother in an omegaverse household.",
        "{{user}} is a 21-year-old omega university student.",
        "They live together under the same roof.",
        "Kieran believes {{user}} sees him as indifferent to her and only as a protective older brother figure.",
      ].join(" "),
      name: "Kieran",
      scenario:
        "{{user}} and Kieran are step-siblings living together while university, heat cycles, and family boundaries keep forcing them into close proximity.",
      tags: ["Step Siblings", "Age Gap", "Omegaverse", "University"],
    });

    const draft = buildUserPersonaDraftFromCard(card, "female");
    const combined = Object.values(draft).join("\n");

    expect(draft.cardFitNotes).toContain("Card-derived persona facts:");
    expect(draft.appearancePresentation).toContain("{{user}} is 21 years old.");
    expect(draft.appearancePresentation).toContain("{{user}} is an omega");
    expect(draft.appearancePresentation).toContain("{{user}} is a university student");
    expect(draft.roleInStory).toContain("21-year-old woman");
    expect(draft.roleInStory).toContain("omega");
    expect(draft.roleInStory).toContain("university student");
    expect(draft.roleInStory).toContain("step-sibling");
    expect(draft.roleInStory).toContain("living with Kieran");
    expect(draft.tropeRelationshipWorldContext).toContain("Kieran's step-sibling");
    expect(draft.tropeRelationshipWorldContext).toContain("share a home");
    expect(draft.tropeRelationshipWorldContext).toContain("omegaverse");
    expect(draft.selfConcept).toContain("Being omega affects how {{user}} manages attention");
    expect(draft.selfConcept).toContain("University gives {{user}} an independent identity");
    expect(draft.selfConcept).toContain("The step-sibling bond makes closeness socially dangerous");
    expect(draft.openingAngle).toContain("At the start of play, {{user}} is positioned as");
    expect(draft.whatUserKnows).toContain("Kieran believes {{user}} reads him as indifferent");
    expect(draft.whatUserKnows).toContain("protective older-brother figure");
    expect(combined).not.toContain("The player has room");
    expect(combined).not.toContain("Seeded");
    expect(combined).not.toContain("seed:");
  });

  it("draws in participants, relationship, secrets, scene, and selected tags when generating late in the flow", () => {
    const card = makeCard({
      description: "A closed-off rival keeps {{user}} at arm's length during rehearsals.",
      name: "Rowan",
      scenario: "{{user}} and Rowan are forced to share the same stage role.",
    });

    const draft = buildUserPersonaDraftFromCard(card, "female", {
      activeCorePack: {
        base_prompt:
          "Track changed behavior through rivalry, withheld respect, and visible proof before anyone explains the emotional shift.",
        category: "Trope core",
        compatible_tag_slugs: ["enemies-to-lovers"],
        created_at: "2026-09-25T00:00:00.000Z",
        default_platform_targets: ["JanitorAI", "SillyTavern", "MarinaraTavern"],
        description: "For enemies-to-lovers and competitive romantic pressure.",
        id: "core-changing-perspectives",
        slug: "changing-perspectives",
        title: "Changing Perspectives",
        updated_at: "2026-09-25T00:00:00.000Z",
      },
      activeRelationship: {
        attraction_notes: "Mutual fixation under pressure.",
        boundaries: [],
        conflict_notes: "Neither wants to admit the rivalry has become intimate.",
        created_at: "2026-09-25T00:00:00.000Z",
        current_state: "Competitive partners with a private near-kiss behind them.",
        dynamic_label: "Rivals to lovers",
        id: "rel-1",
        linked_secret_ids: [],
        next_pressure_point: "A public duet forces them to trust each other.",
        participants: ["char-rowan", "user-player"],
        story_id: "story-1",
        updated_at: "2026-09-25T00:00:00.000Z",
      },
      activeScene: {
        canon_status: "draft",
        chapter_label: "Act two",
        continuity_flags: [],
        continuity_mode: "canon",
        created_at: "2026-09-25T00:00:00.000Z",
        id: "scene-1",
        key_actions: [],
        narrative_arc: "Public performance pressure",
        new_information: [],
        participants: ["char-rowan", "user-player"],
        pov_mode: "narrator_pov",
        scenario: "They have to rehearse after the secret almost-kiss.",
        sequence_index: 2,
        setting: "Contemporary theatre world",
        story_id: "story-1",
        summary: "The duet choreography keeps putting Rowan's hands at {{user}}'s waist.",
        unresolved_hooks: [],
        updated_at: "2026-09-25T00:00:00.000Z",
      },
      activeSecret: {
        created_at: "2026-09-25T00:00:00.000Z",
        current_pressure: "Rising",
        id: "secret-1",
        related_relationship_thread_ids: ["rel-1"],
        related_scene_ids: ["scene-1"],
        reveal_status: "hidden",
        secret_text: "{{user}} knows Rowan turned down another role to stay in the production.",
        story_id: "story-1",
        title: "The rejected role",
        updated_at: "2026-09-25T00:00:00.000Z",
        who_falsely_believes_they_are_safe: ["char-rowan"],
        who_is_hiding_it: ["char-rowan"],
        who_is_pretending_not_to_know: ["user-player"],
        who_is_wrong: [],
        who_knows: ["user-player"],
        who_knows_that_someone_knows: [],
        who_suspects: [],
      },
      characters: [makeCharacter("char-rowan", "Rowan"), makeCharacter("user-player", "{{user}}")],
      selectedTagLabels: ["Enemies to Lovers", "Competitive", "Theatre"],
      selectedTagSlugs: ["enemies-to-lovers", "competitive"],
    });

    expect(draft.tropeRelationshipWorldContext).toContain("enemies-to-lovers pressure");
    expect(draft.cardFitNotes).toContain("Persona source patterns: Rival/competitive.");
    expect(draft.cardFitNotes).toContain("Selected story tags: Enemies to Lovers, Competitive, Theatre.");
    expect(draft.cardFitNotes).toContain("Active relationship: Rivals to lovers.");
    expect(draft.cardFitNotes).toContain("Relationship participants: Rowan, {{user}}.");
    expect(draft.cardFitNotes).toContain("Active secret: The rejected role.");
    expect(draft.cardFitNotes).toContain("Known by: {{user}}.");
    expect(draft.cardFitNotes).toContain("Pretending not to know: {{user}}.");
    expect(draft.cardFitNotes).toContain(
      "Current scene: The duet choreography keeps putting Rowan's hands at {{user}}'s waist.",
    );
    expect(draft.selfConcept).toContain("{{user}} believes composure is armor");
    expect(draft.selfConcept.startsWith("{{user}} believes composure is armor")).toBe(true);
    expect(draft.psychologyInternalConflict).toContain("Pride under pressure");
    expect(draft.interactionStyle).toContain("Interaction pattern");
    expect(draft.sceneOpportunities).toContain("Scene pressure: a public competence test");
    expect(draft.voiceDialogue).toContain("If you want me to fold");
    expect(draft.connectionToCharacter).toContain("Romantic rival/counterforce");
  });

  it("uses the selected neutral persona frame even when the card does not define {{user}} pronouns", () => {
    const card = makeCard({
      firstMessage: "{{char}} waits at the edge of the station for {{user}} to arrive.",
      name: "Riven",
      scenario: "{{user}} is the only person who knows why Riven left the old crew.",
    });

    const draft = buildUserPersonaDraftFromCard(card, "neutral");

    expect(draft.roleInStory).toContain("Neutral {{user}} persona");
    expect(draft.connectionToCharacter).toContain("the card's active scenario around Riven");
    expect(draft.selfConcept).not.toContain("own person in");
    expect(draft.selfConcept).toContain("hidden refusal");
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

  it("keeps the persona generation prompt available as the button source spec", () => {
    expect(romanticRoleplayUserPersonaPrompt).toContain("Romantic Roleplay User Persona Character Prompt");
    expect(romanticRoleplayUserPersonaPrompt).toContain("Physical Appearance & Presentation");
    expect(romanticRoleplayUserPersonaPrompt).toContain("Compatibility Architecture");
    expect(romanticRoleplayUserPersonaPrompt).toContain("Long-Term Scene Opportunities");
    expect(romanticRoleplayUserPersonaPrompt).toContain("Voice, Dialogue & Emotional Expression");
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

function makeCharacter(id: string, name: string) {
  return {
    aliases: [],
    boundaries: [],
    created_at: "2026-09-25T00:00:00.000Z",
    false_beliefs: [],
    fears: [],
    id,
    name,
    private_truths: [],
    public_facts: [],
    self_beliefs: [],
    story_id: "story-1",
    updated_at: "2026-09-25T00:00:00.000Z",
    wants: [],
  };
}
