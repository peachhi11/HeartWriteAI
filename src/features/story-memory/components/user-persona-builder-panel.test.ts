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
      boundaries: "Do not write {{user}}'s dialogue.\nKeep consent and choices user-controlled.",
      cardFitNotes: "{{char}} already controls the established card voice.",
      connectionToCharacter: "{{user}} is tied to {{char}} through the opening scenario.",
      displayName: "Mara Vale",
      openingAngle: "{{user}} enters with a concrete want and a reason to stay.",
      roleInStory: "User player built for an established character card.",
      selfConcept: "{{user}} believes they are handling the situation calmly.",
      whatUserKnows: "{{user}} knows their own history and what they have directly observed.",
    };

    expect(formatUserPersonaDraft(draft)).toBe(
      [
        "[Mara Vale Persona]",
        "Role: User player built for an established character card.",
        "Self-concept: {{user}} believes they are handling the situation calmly.",
        "Connection to {{char}}: {{user}} is tied to {{char}} through the opening scenario.",
        "Starting knowledge: {{user}} knows their own history and what they have directly observed.",
        "Opening angle: {{user}} enters with a concrete want and a reason to stay.",
        "Boundaries:\nDo not write {{user}}'s dialogue.\nKeep consent and choices user-controlled.",
        "Card-fit notes:\n{{char}} already controls the established card voice.",
      ].join("\n\n"),
    );
  });
});
