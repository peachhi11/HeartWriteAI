import { describe, expect, it } from "vitest";

import {
  compactSentence,
  extractCharacterCardSourceFromPng,
  parseCharacterCard,
} from "./character-card-parser";

describe("parseCharacterCard", () => {
  it("reads JanitorAI/SillyTavern v2 card data from the data wrapper", () => {
    const card = parseCharacterCard(
      JSON.stringify({
        spec: "chara_card_v2",
        spec_version: "2.0",
        data: {
          alternate_greetings: ["Second opener", "Third opener"],
          creator_notes: "Private author note.",
          description: "A guarded musician with a sharp mouth.",
          first_mes: "Do not touch the guitar case.",
          mes_example: "{{char}}: You heard me.",
          name: "Caleb Myers",
          personality: "Protective, competitive, lonely.",
          post_history_instructions: "Respect the established fallout.",
          scenario: "{{char}} and {{user}} are forced to collaborate.",
          system_prompt: "Keep role boundaries intact.",
          tags: ["JanitorAI", "Enemies to Lovers"],
        },
      }),
      "caleb.json",
    );

    expect(card.format).toBe("chara_card_v2 2.0 from caleb.json");
    expect(card.name).toBe("Caleb Myers");
    expect(card.description).toBe("A guarded musician with a sharp mouth.");
    expect(card.scenario).toBe("{{char}} and {{user}} are forced to collaborate.");
    expect(card.firstMessage).toBe("Do not touch the guitar case.");
    expect(card.alternateGreetings).toEqual(["Second opener", "Third opener"]);
    expect(card.tags).toEqual(["JanitorAI", "Enemies to Lovers"]);
    expect(card.warnings).toEqual([]);
  });

  it("falls back to plain card notes for invalid JSON", () => {
    const card = parseCharacterCard("Name: Unstructured card\nScenario: improvised");

    expect(card.format).toBe("Plain text card notes");
    expect(card.description).toBe("Name: Unstructured card\nScenario: improvised");
    expect(card.warnings).toEqual(["This was not valid JSON, so it was loaded as plain card notes."]);
  });

  it("normalizes comma-separated tag strings", () => {
    const card = parseCharacterCard(
      JSON.stringify({
        name: "Tag Test",
        tags: "JanitorAI, Friends to Lovers, Slow Burn",
      }),
    );

    expect(card.tags).toEqual(["JanitorAI", "Friends to Lovers", "Slow Burn"]);
  });
});

describe("extractCharacterCardSourceFromPng", () => {
  it("extracts base64 character card JSON from a PNG text chunk", async () => {
    const source = JSON.stringify({
      spec: "chara_card_v2",
      data: {
        name: "PNG Card",
        description: "Embedded in PNG metadata.",
      },
    });
    const file = new File([makePngWithTextChunk("chara", btoa(source))], "card.png", {
      type: "image/png",
    });

    await expect(extractCharacterCardSourceFromPng(file)).resolves.toBe(source);
  });
});

describe("compactSentence", () => {
  it("returns a fallback for empty input", () => {
    expect(compactSentence(undefined, "fallback text")).toBe("fallback text");
  });

  it("normalizes whitespace and shortens long text", () => {
    const result = compactSentence(`A ${"long ".repeat(80)}sentence`, "fallback");

    expect(result).toHaveLength(220);
    expect(result.endsWith("...")).toBe(true);
    expect(result).not.toContain("  ");
  });
});

function makePngWithTextChunk(keyword: string, text: string) {
  const signature = Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = makeChunk("IHDR", Uint8Array.from([0, 0, 0, 1, 0, 0, 0, 1, 8, 2, 0, 0, 0]));
  const textChunk = makeChunk(
    "tEXt",
    new Uint8Array([...latin1(keyword), 0, ...new TextEncoder().encode(text)]),
  );
  const iend = makeChunk("IEND", new Uint8Array());

  return new Uint8Array([...signature, ...ihdr, ...textChunk, ...iend]);
}

function makeChunk(type: string, data: Uint8Array) {
  const length = new Uint8Array(4);
  new DataView(length.buffer).setUint32(0, data.length);
  const crc = new Uint8Array(4);

  return new Uint8Array([...length, ...latin1(type), ...data, ...crc]);
}

function latin1(value: string) {
  return Uint8Array.from(value, (character) => character.charCodeAt(0));
}
