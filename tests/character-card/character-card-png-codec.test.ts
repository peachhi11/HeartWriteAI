import assert from "node:assert/strict";
import test from "node:test";

import encodeChunks from "png-chunks-encode";
import { encode as encodeTextChunk } from "png-chunk-text";

import { readCharacterCardFromPng } from "../../lib/character-card/readCharacterCardFromPng";
import { writeCharacterCardToPng } from "../../lib/character-card/writeCharacterCardToPng";
import { CharacterCardPayload } from "../../types/character-card/CharacterCardPayload";

function encodeCard(card: CharacterCardPayload): string {
  return Buffer.from(JSON.stringify(card), "utf8").toString("base64");
}

function createPngWithTextChunks(chunks: Array<{ keyword: string; text: string }>) {
  return encodeChunks([
    {
      name: "IHDR",
      data: Uint8Array.from([0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0]),
    },
    ...chunks.map((chunk) => encodeTextChunk(chunk.keyword, chunk.text)),
    {
      name: "IDAT",
      data: Uint8Array.from([120, 156, 99, 248, 15, 4, 0, 9, 251, 3, 253]),
    },
    {
      name: "IEND",
      data: Uint8Array.from([]),
    },
  ]);
}

test("reads ccv3 metadata before chara metadata", () => {
  const ccv3Card = {
    spec: "chara_card_v3",
    spec_version: "3.0",
    data: { name: "CCV3 Card" },
  };
  const charaCard = {
    spec: "chara_card_v2",
    spec_version: "2.0",
    data: { name: "Legacy Card" },
  };
  const pngData = createPngWithTextChunks([
    { keyword: "chara", text: encodeCard(charaCard) },
    { keyword: "ccv3", text: encodeCard(ccv3Card) },
  ]);

  const result = readCharacterCardFromPng(pngData);

  assert.equal(result.source, "ccv3");
  assert.deepEqual(result.card, ccv3Card);
});

test("falls back to chara metadata", () => {
  const charaCard = {
    spec: "chara_card_v2",
    spec_version: "2.0",
    data: { name: "Legacy Card" },
  };
  const pngData = createPngWithTextChunks([
    { keyword: "chara", text: encodeCard(charaCard) },
  ]);

  const result = readCharacterCardFromPng(pngData);

  assert.equal(result.source, "chara");
  assert.deepEqual(result.card, charaCard);
});

test("throws when no supported card metadata exists", () => {
  const pngData = createPngWithTextChunks([
    { keyword: "notes", text: "not a card" },
  ]);

  assert.throws(
    () => readCharacterCardFromPng(pngData),
    /supported character card metadata/,
  );
});

test("writes a ccv3 metadata chunk that can be read back", () => {
  const pngData = createPngWithTextChunks([]);
  const card = {
    spec: "chara_card_v2",
    spec_version: "2.0",
    data: { name: "Round Trip Card" },
  };

  const updatedPngData = writeCharacterCardToPng(pngData, card, {
    modificationDate: 1_716_199_200,
  });
  const result = readCharacterCardFromPng(updatedPngData);

  assert.equal(result.source, "ccv3");
  assert.deepEqual(result.card, {
    ...card,
    spec: "chara_card_v3",
    spec_version: "3.0",
    data: {
      name: "Round Trip Card",
      description: "",
      tags: [],
      creator: "",
      character_version: "",
      mes_example: "",
      extensions: {},
      system_prompt: "",
      post_history_instructions: "",
      first_mes: "",
      alternate_greetings: [],
      personality: "",
      scenario: "",
      creator_notes: "",
      group_only_greetings: [],
      modification_date: 1_716_199_200,
    },
  });
});

test("removes stale chara and ccv3 chunks during ccv3 export", () => {
  const staleCard = {
    spec: "chara_card_v2",
    spec_version: "2.0",
    data: { name: "Stale Card" },
  };
  const exportedCard = {
    spec: "chara_card_v3",
    spec_version: "3.0",
    data: { name: "Fresh Card", group_only_greetings: ["Group hello"] },
  };
  const pngData = createPngWithTextChunks([
    { keyword: "chara", text: encodeCard(staleCard) },
    { keyword: "ccv3", text: encodeCard(staleCard) },
  ]);

  const updatedPngData = writeCharacterCardToPng(pngData, exportedCard, {
    modificationDate: 1_716_199_201,
  });
  const result = readCharacterCardFromPng(updatedPngData);

  assert.equal(result.source, "ccv3");
  assert.equal(result.card.data?.name, "Fresh Card");
  assert.deepEqual(result.card.data?.group_only_greetings, ["Group hello"]);
});

test("converts character card v1 payloads to ccv3 during export", () => {
  const pngData = createPngWithTextChunks([]);
  const card = {
    name: "Legacy V1 Card",
    description: "A v1 description",
    personality: "Patient",
    scenario: "A quiet room",
    first_mes: "Hello.",
    mes_example: "{{char}}: Hello.",
  };

  const updatedPngData = writeCharacterCardToPng(pngData, card, {
    modificationDate: 1_716_199_202,
  });
  const result = readCharacterCardFromPng(updatedPngData);

  assert.equal(result.source, "ccv3");
  assert.equal(result.card.spec, "chara_card_v3");
  assert.equal(result.card.spec_version, "3.0");
  assert.equal(result.card.data?.name, "Legacy V1 Card");
  assert.equal(result.card.data?.description, "A v1 description");
  assert.deepEqual(result.card.data?.group_only_greetings, []);
  assert.equal(result.card.data?.modification_date, 1_716_199_202);
});
