import { describe, expect, it } from "vitest";

import {
  emptyUserPersonaDraft,
  formatUserPersonaDraft,
  type UserPersonaDraft,
} from "./user-persona-builder-panel";

describe("formatUserPersonaDraft", () => {
  it("keeps the default {{user}} heading for an empty draft", () => {
    expect(formatUserPersonaDraft(emptyUserPersonaDraft)).toBe("[{{user}} Persona]");
  });

  it("formats populated persona fields into a paste-ready stack", () => {
    const draft: UserPersonaDraft = {
      appearancePresentation: "Expressive eyes, practical style, and one visible nervous tell.",
      boundaries: "{{user}}'s dialogue stays player-controlled.\nConsent and choices remain with the player.",
      cardFitNotes: "{{char}} already controls the established card voice.",
      compatibilityArchitecture: "Compatibility: shared values. Conflict: different coping styles.",
      connectionToCharacter: "{{user}} is tied to {{char}} through the opening scenario.",
      displayName: "Mara Vale",
      interactionStyle: "Banter first, sincerity when cornered.",
      narrativeArc: "Conflict becomes trust through costed choices.",
      openingAngle: "{{user}} enters with a concrete want and a reason to stay.",
      psychologyInternalConflict: "Wants closeness but fears becoming optional.",
      relationalBackstory: "Learned early that loyalty can become leverage.",
      romanticIntimateDynamics: "Wary, loyal, responsive, and self-possessed.",
      roleInStory: "User player built for an established character card.",
      sceneOpportunities: "1. A scene only this pairing can create.",
      selfConcept: "{{user}} believes they are handling the situation calmly.",
      tropeRelationshipWorldContext: "Trope alignment: friends-to-lovers pressure. World/setting logic: contemporary reality world.",
      voiceDialogue: "Tension line: \"Careful.\"",
      whatUserKnows: "{{user}} knows their own history and what they have directly observed.",
    };

    expect(formatUserPersonaDraft(draft)).toBe(
      [
        "[Mara Vale Persona]",
        "Role: User player built for an established character card.",
        "Story fit:\nTrope alignment: friends-to-lovers pressure. World/setting logic: contemporary reality world.",
        "Appearance + presentation:\nExpressive eyes, practical style, and one visible nervous tell.",
        "Self-concept: {{user}} believes they are handling the situation calmly.",
        "Connection to {{char}}: {{user}} is tied to {{char}} through the opening scenario.",
        "Relational backstory + triggers:\nLearned early that loyalty can become leverage.",
        "Psychology + internal conflict:\nWants closeness but fears becoming optional.",
        "Romantic + intimate dynamics:\nWary, loyal, responsive, and self-possessed.",
        "Compatibility + friction:\nCompatibility: shared values. Conflict: different coping styles.",
        "Interaction style:\nBanter first, sincerity when cornered.",
        "Starting knowledge: {{user}} knows their own history and what they have directly observed.",
        "Opening position: {{user}} enters with a concrete want and a reason to stay.",
        "Narrative + romantic arc:\nConflict becomes trust through costed choices.",
        "Scene hooks:\n1. A scene only this pairing can create.",
        "Voice, dialogue + emotional expression:\nTension line: \"Careful.\"",
        "Agency + boundaries:\n{{user}}'s dialogue stays player-controlled.\nConsent and choices remain with the player.",
        "Source card notes:\n{{char}} already controls the established card voice.",
      ].join("\n\n"),
    );
  });
});
