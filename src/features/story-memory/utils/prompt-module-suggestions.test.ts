import { describe, expect, it } from "vitest";

import type {
  Character,
  HeatLevelLabel,
  PovMode,
  RelationshipThread,
  SceneMemory,
  SecretOrReveal,
  SpiceVisibility,
  Story,
} from "@/features/story-memory/types/story-memory";
import type { PromptModuleText } from "@/features/story-memory/utils/prompt-slot-builder";

import {
  getPromptModuleSuggestions,
  getPromptModuleValues,
  povLabels,
} from "./prompt-module-suggestions";

describe("getPromptModuleSuggestions", () => {
  it.each([
    ["char_pov", "{{char}} POV"],
    ["user_pov", "{{user}} POV"],
    ["narrator_pov", "Narrator POV"],
  ] satisfies [PovMode, string][])("creates POV guardrails for %s", (povMode, label) => {
    const suggestions = makeSuggestions({ povMode });

    expect(suggestions.povGuardrails).toBe(
      `POV: ${label}. Do not write {{user}} thoughts, dialogue, consent, or choices.`,
    );
    expect(povLabels[povMode]).toBe(label);
  });

  it.each([
    ["censored", "Spice visibility: censored language for exports."],
    [
      "uncensored",
      "Spice visibility: uncensored language is allowed where the target platform and story boundaries allow it.",
    ],
  ] satisfies [SpiceVisibility, string][])("creates %s spice wording", (spiceVisibility, expected) => {
    const suggestions = makeSuggestions({
      heatLevel: "explicit",
      spiceVisibility,
    });

    expect(suggestions.heatSpice).toBe(`Heat label: Explicit. ${expected}`);
  });

  it("creates the StoryBook operational mode framework", () => {
    const suggestions = makeSuggestions({
      activeRelationship: {
        boundaries: [],
        created_at: "2026-09-25T00:00:00.000Z",
        dynamic_label: "Forbidden mutual longing",
        id: "rel-1",
        linked_secret_ids: [],
        next_pressure_point: "A locked office leaves them too close to pretend.",
        participants: ["char", "user"],
        story_id: "story-1",
        updated_at: "2026-09-25T00:00:00.000Z",
      },
      activeSecret: makeSecret({ title: "Hidden breakup ultimatum" }),
      heatLevel: "explicit",
      spiceVisibility: "uncensored",
      story: makeStory({
        content_boundaries: ["No non-consensual sexual content."],
        genre: "Romance",
        subgenre: "Erotic roleplay",
      }),
    });

    expect(suggestions.storybookOperationalMode).toContain(
      "[EROTIC ROMANTIC ROLEPLAY CONTEXT FRAMEWORK]",
    );
    expect(suggestions.storybookOperationalMode).toContain(
      "- All sexual/romantic content involves consenting adults only.",
    );
    expect(suggestions.storybookOperationalMode).toContain(
      "Do not narrate {{user}}'s thoughts, dialogue, hidden motives, consent, choices, arousal, orgasm, or body reactions.",
    );
    expect(suggestions.storybookOperationalMode).toContain(
      "LATEST_USER_MOVE: {{latest_user_move}}",
    );
    expect(suggestions.storybookOperationalMode).toContain("Heat label: Explicit.");
    expect(suggestions.storybookOperationalMode).toContain("Spice visibility: uncensored.");
  });

  it("uses roleplay scenario and setting terminology from the active scene", () => {
    const suggestions = makeSuggestions({
      activeScene: makeScene({
        location: "Back hallway",
        scenario: "{{char}} and {{user}} are stuck covering for each other after the party.",
        setting: "Back hallway, late-night party aftermath, everyone close enough to overhear.",
      }),
    });

    expect(suggestions.scenarioSetup).toBe(
      "Scenario: {{char}} and {{user}} are stuck covering for each other after the party.",
    );
    expect(suggestions.settingFrame).toBe(
      "Setting: Back hallway, late-night party aftermath, everyone close enough to overhear.",
    );
  });

  it("falls back from setting to location with setting guidance", () => {
    const suggestions = makeSuggestions({
      activeScene: makeScene({
        location: "Private kitchen doorway",
        scenario: undefined,
        setting: undefined,
      }),
      story: makeStory({ description: "Story-level setup." }),
    });

    expect(suggestions.scenarioSetup).toBe("Scenario: Story-level setup.");
    expect(suggestions.settingFrame).toBe(
      "Setting: Private kitchen doorway. Use setting as the combined location, world context, and situation frame.",
    );
  });

  it("keeps secret policy wording concrete and character-named", () => {
    const suggestions = makeSuggestions({
      activeSecret: makeSecret({
        reveal_status: "suspected",
        title: "The Secret Leverage",
        who_knows: ["char-user"],
      }),
      characters: [makeCharacter({ id: "char-user", name: "{{user}}" })],
    });

    expect(suggestions.activeSecrets).toBe(
      "Secret policy: The Secret Leverage stays suspected; known by {{user}}.",
    );
    expect(suggestions.activeSecrets).not.toContain("known unknown");
  });

  it("marks canon and Alt continuity differently", () => {
    const canon = makeSuggestions({
      activeScene: makeScene({ continuity_mode: "canon" }),
    });
    const alt = makeSuggestions({
      activeScene: makeScene({ continuity_mode: "alt" }),
    });

    expect(canon.continuityBranch).toContain("Continuity: Canon.");
    expect(canon.continuityBranch).toContain("Treat this as the main continuity");
    expect(alt.continuityBranch).toContain("Continuity: Alt.");
    expect(alt.continuityBranch).toContain("Keep branch-specific changes separate");
  });

  it("punctuates chapter and narrative arc labels", () => {
    const suggestions = makeSuggestions({
      activeScene: makeScene({
        chapter_label: "Opening pressure point",
        narrative_arc: "Mutual suspicion becomes reluctant intimacy",
      }),
    });

    expect(suggestions.chapterArc).toBe(
      "Chapter: Opening pressure point. Arc: Mutual suspicion becomes reluctant intimacy.",
    );
  });
});

describe("getPromptModuleValues", () => {
  it("lets draft text override suggestions, including an intentionally empty module", () => {
    const suggestions = makeSuggestions({});
    const values = getPromptModuleValues(suggestions, {
      activeTags: "",
      scenarioSetup: "Scenario: custom user-written setup.",
    });

    expect(values.activeTags).toBe("");
    expect(values.scenarioSetup).toBe("Scenario: custom user-written setup.");
    expect(values.povGuardrails).toBe(suggestions.povGuardrails);
  });
});

function makeSuggestions({
  activeScene,
  activeRelationship,
  activeSecret,
  characters = [],
  heatLevel = "spicy",
  povMode = "narrator_pov",
  selectedTagLabels = [],
  spiceVisibility = "censored",
  story = makeStory(),
}: {
  activeScene?: SceneMemory;
  activeRelationship?: RelationshipThread;
  activeSecret?: SecretOrReveal;
  characters?: Character[];
  heatLevel?: HeatLevelLabel;
  povMode?: PovMode;
  selectedTagLabels?: string[];
  spiceVisibility?: SpiceVisibility;
  story?: Story;
}): PromptModuleText {
  return getPromptModuleSuggestions({
    activeRelationship,
    activeScene,
    activeSecret,
    characters,
    heatLevel,
    povMode,
    selectedTagLabels,
    spiceVisibility,
    story,
  });
}

function makeStory(overrides: Partial<Story> = {}): Story {
  return {
    active_status: "active",
    created_at: "2026-09-25T00:00:00.000Z",
    description: undefined,
    id: "story-1",
    supported_pov_modes: ["char_pov", "user_pov", "narrator_pov"],
    title: "Test Story",
    updated_at: "2026-09-25T00:00:00.000Z",
    ...overrides,
  };
}

function makeCharacter(overrides: Partial<Character> = {}): Character {
  return {
    aliases: [],
    boundaries: [],
    created_at: "2026-09-25T00:00:00.000Z",
    false_beliefs: [],
    fears: [],
    id: "char-1",
    name: "{{char}}",
    private_truths: [],
    public_facts: [],
    role: "Lead",
    self_beliefs: [],
    story_id: "story-1",
    updated_at: "2026-09-25T00:00:00.000Z",
    wants: [],
    ...overrides,
  };
}

function makeScene(overrides: Partial<SceneMemory> = {}): SceneMemory {
  return {
    canon_status: "canon",
    continuity_flags: [],
    continuity_mode: "canon",
    created_at: "2026-09-25T00:00:00.000Z",
    id: "scene-1",
    key_actions: [],
    new_information: [],
    participants: [],
    pov_mode: "narrator_pov",
    story_id: "story-1",
    summary: "{{char}} and {{user}} left with new leverage.",
    unresolved_hooks: [],
    updated_at: "2026-09-25T00:00:00.000Z",
    ...overrides,
  };
}

function makeSecret(overrides: Partial<SecretOrReveal> = {}): SecretOrReveal {
  return {
    created_at: "2026-09-25T00:00:00.000Z",
    id: "secret-1",
    reveal_status: "hidden",
    related_relationship_thread_ids: [],
    related_scene_ids: [],
    secret_text: "Hidden leverage.",
    story_id: "story-1",
    updated_at: "2026-09-25T00:00:00.000Z",
    who_falsely_believes_they_are_safe: [],
    who_is_hiding_it: [],
    who_is_pretending_not_to_know: [],
    who_is_wrong: [],
    who_knows: [],
    who_knows_that_someone_knows: [],
    who_suspects: [],
    ...overrides,
  };
}
