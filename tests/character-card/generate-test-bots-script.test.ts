import assert from "node:assert/strict";
import test from "node:test";

import {
  createCardPayloadFromProfile,
  createProfiles,
  createRandomGenerator,
} from "../../scripts/generate-test-bots";

test("generates deterministic BotWaffle-style profiles from a fixed seed", () => {
  const firstRun = createProfiles(3, "smoke", createRandomGenerator(12345));
  const secondRun = createProfiles(3, "smoke", createRandomGenerator(12345));

  assert.deepEqual(firstRun, secondRun);
  assert.deepEqual(
    firstRun.map((profile) => profile.name),
    [
      "zane-martinez-smoke-001",
      "harley-rodriguez-smoke-002",
      "morgan-davis-smoke-003",
    ],
  );
});

test("converts generated profiles into CCV3 character cards", () => {
  const [profile] = createProfiles(1, "smoke", createRandomGenerator(12345));
  assert.ok(profile);

  const card = createCardPayloadFromProfile(profile, 12345, "smoke");

  assert.equal(card.spec, "chara_card_v3");
  assert.equal(card.spec_version, "3.0");
  assert.equal(card.data?.name, profile.displayName);
  assert.match(String(card.data?.description), /Full Name:/);
  assert.match(String(card.data?.creator_notes), /Seed: 12345/);
  assert.deepEqual(
    (card.data?.tags as string[]).slice(0, 3),
    ["botwaffle", "test-bot", "generated"],
  );
});
