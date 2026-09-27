import { describe, expect, it } from "vitest";

import type {
  Character,
  HeatLevelLabel,
  LibraryBook,
  PovMode,
  RelationshipThread,
  SceneMemory,
  SecretOrReveal,
  SpiceVisibility,
  Story,
  StoryBook,
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

  it("pulls saved User Book and linked StoryBook package details into the operational mode", () => {
    const suggestions = makeSuggestions({
      storybookPackage: {
        books: [
          makeLibraryBook({
            book_type: "character_book",
            description: "Saved Rowan character card.",
            title: "Rowan Character Book",
          }),
          makeLibraryBook({
            book_type: "world_book",
            description: "Saved theatre world.",
            payload: {
              draft: {
                crossReferences: "Main stage -> public exposure -> career pressure.",
                loreEntries:
                  "Section/type: location\nKeys: main stage, green room\nContent: Public reputation and private rehearsal spaces.",
                locations: "Main stage, green room, rehearsal hall.",
                rules: "Reputation and casting politics shape access.",
                triggerPrecedence: "Active scene beats outrank general theatre lore.",
                worldType: "Contemporary theatre",
              },
              formattedWorldBook:
                "# Rowan Theatre World\n\n## Rules\nReputation and casting politics shape access.\n\n## Locations\nMain stage, green room, rehearsal hall.",
            },
            title: "Theatre World Book",
          }),
          makeLibraryBook({
            book_type: "scenario_book",
            description: "Saved active theatre scenario.",
            payload: {
              draft: {
                activePressure: "Opening night forces Rowan and {{user}} into the same locked dressing room.",
                currentScene: "Rowan finds {{user}} holding the missing contract.",
                nextBeat: "{{user}} has to decide whether to confront him or hide the page.",
                scenario: "Rival performers are trapped inside the same production scandal.",
              },
              formattedScenarioBook:
                "# Rowan Scenario\n\n## Scenario\nRival performers are trapped inside the same production scandal.\n\n## Active Pressure\nOpening night forces Rowan and {{user}} into the same locked dressing room.",
            },
            title: "Opening Night Scenario Book",
          }),
          makeLibraryBook({
            book_type: "memory_book",
            description: "Saved theatre memory.",
            payload: {
              draft: {
                knowledgeBoundaries: "Rowan does not know {{user}} copied the contract yet.",
                relationshipHistories: "Rivalry became reluctant trust after the casting leak.",
                secrets: "The contract is hidden in {{user}}'s bag; Rowan suspects another actor.",
                triggerRules: "Secrets activate only when a character can plausibly know or suspect them.",
              },
              formattedMemoryBook:
                "# Rowan Memory\n\n## Secrets\nThe contract is hidden in {{user}}'s bag; Rowan suspects another actor.",
            },
            title: "Theatre Memory Book",
          }),
          makeLibraryBook({
            book_type: "user_book",
            description: "Saved {{user}} persona.",
            payload: {
              draft: {
                connectionToCharacter: "{{user}} knows why Rowan stayed.",
                roleInStory: "Rival performer with private leverage.",
                whatUserKnows: "{{user}} knows Rowan rejected another role.",
              },
              formattedPersona: "[{{user}} Persona]\nRole: Rival performer with private leverage.",
              sourceStoryContext: {
                activeRelationshipId: "rel-1",
                activeSecretId: "secret-1",
                selectedTagLabels: ["Enemies to Lovers", "Competitive"],
              },
            },
            title: "{{user}} User Book",
          }),
          makeLibraryBook({
            book_type: "prompt_book",
            description: "Saved Janitor prompt routing.",
            payload: {
              draft: {
                compilerInstructions:
                  "Compile Prompt Book, Character Book, World Book, User Book, Scenario Book, Memory Book, then Latest User Move.",
                globalRules: "Preserve {{user}} agency and theatre rivalry pressure.",
                proxyRules: "Current scene pressure translates saved books into live behavior.",
              },
              formattedPromptBook:
                "# Rowan Prompt Book\n\n## Compiler Instructions\nCompile Prompt Book, Character Book, World Book, User Book, Scenario Book, Memory Book, then Latest User Move.",
            },
            title: "Janitor Prompt Book",
          }),
        ],
        storybook: makeStoryBook({ title: "Rowan / {{user}} StoryBook" }),
      },
    });

    expect(suggestions.storybookOperationalMode).toContain(
      'Prompt generation source: active StoryBook package "Rowan / {{user}} StoryBook".',
    );
    expect(suggestions.storybookOperationalMode).toContain("Character Book source: Rowan Character Book");
    expect(suggestions.storybookOperationalMode).toContain("User Book source: {{user}} User Book");
    expect(suggestions.storybookOperationalMode).toContain("[{{user}} Persona]");
    expect(suggestions.storybookOperationalMode).toContain("Saved {{user}} role: Rival performer with private leverage.");
    expect(suggestions.storybookOperationalMode).toContain("Saved {{user}} connection: {{user}} knows why Rowan stayed.");
    expect(suggestions.storybookOperationalMode).toContain(
      "Saved {{user}} starting knowledge: {{user}} knows Rowan rejected another role.",
    );
    expect(suggestions.storybookOperationalMode).toContain(
      "selectedTagLabels: Enemies to Lovers, Competitive",
    );
    expect(suggestions.storybookOperationalMode).toContain("Scenario Book source: Opening Night Scenario Book");
    expect(suggestions.storybookOperationalMode).toContain("Saved Scenario Book:");
    expect(suggestions.storybookOperationalMode).toContain(
      "Saved scenario: Rival performers are trapped inside the same production scandal.",
    );
    expect(suggestions.storybookOperationalMode).toContain(
      "Saved scenario pressure: Opening night forces Rowan and {{user}} into the same locked dressing room.",
    );
    expect(suggestions.storybookOperationalMode).toContain(
      "Saved next playable beat: {{user}} has to decide whether to confront him or hide the page.",
    );
    expect(suggestions.storybookOperationalMode).toContain("World Book source: Theatre World Book");
    expect(suggestions.storybookOperationalMode).toContain("Saved World Book:");
    expect(suggestions.storybookOperationalMode).toContain("Saved modular lore entries:");
    expect(suggestions.storybookOperationalMode).toContain(
      "Saved world trigger precedence: Active scene beats outrank general theatre lore.",
    );
    expect(suggestions.storybookOperationalMode).toContain(
      "Saved world cross-references: Main stage -> public exposure -> career pressure.",
    );
    expect(suggestions.storybookOperationalMode).toContain("Saved world type: Contemporary theatre");
    expect(suggestions.storybookOperationalMode).toContain(
      "Saved world rules: Reputation and casting politics shape access.",
    );
    expect(suggestions.storybookOperationalMode).toContain(
      "Saved world locations: Main stage, green room, rehearsal hall.",
    );
    expect(suggestions.storybookOperationalMode).toContain("Memory Book source: Theatre Memory Book");
    expect(suggestions.storybookOperationalMode).toContain("Saved Memory Book:");
    expect(suggestions.storybookOperationalMode).toContain(
      "Saved memory secrets: The contract is hidden in {{user}}'s bag; Rowan suspects another actor.",
    );
    expect(suggestions.storybookOperationalMode).toContain(
      "Saved knowledge boundaries: Rowan does not know {{user}} copied the contract yet.",
    );
    expect(suggestions.storybookOperationalMode).toContain("Prompt Book source: Janitor Prompt Book");
    expect(suggestions.storybookOperationalMode).toContain("Saved Prompt Book:");
    expect(suggestions.storybookOperationalMode).toContain(
      "Saved compiler instructions: Compile Prompt Book, Character Book, World Book, User Book, Scenario Book, Memory Book, then Latest User Move.",
    );
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
  storybookPackage,
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
  storybookPackage?: {
    books: LibraryBook[];
    storybook?: StoryBook;
  };
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
    storybookPackage,
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

function makeStoryBook(overrides: Partial<StoryBook> = {}): StoryBook {
  return {
    active_story_id: "story-1",
    bookshelf_id: "shelf-1",
    created_at: "2026-09-25T00:00:00.000Z",
    id: "storybook-1",
    sort_order: 1,
    status: "active",
    title: "Test StoryBook",
    updated_at: "2026-09-25T00:00:00.000Z",
    ...overrides,
  };
}

function makeLibraryBook(overrides: Partial<LibraryBook> = {}): LibraryBook {
  return {
    book_type: "user_book",
    bookshelf_id: "shelf-1",
    created_at: "2026-09-25T00:00:00.000Z",
    id: "book-1",
    payload: {},
    sort_order: 1,
    title: "Test Book",
    updated_at: "2026-09-25T00:00:00.000Z",
    ...overrides,
  };
}
