import assert from "node:assert/strict";
import test from "node:test";

import { generateAdultOffspringProfile } from "../../lib/character-card/offspringGenerator";

test("generates adult offspring profiles with policy-safe defaults", () => {
  const offspring = generateAdultOffspringProfile({
    anchorYear: 2026,
    parents: [
      {
        given_name: "Mara",
        surname: "Vale",
        age: 44,
        species: { type: "Human", isImmortal: false },
      },
    ],
    random: () => 0,
  });

  assert.equal(offspring.age, 18);
  assert.equal(offspring.birthYear, 2008);
  assert.equal(offspring.fullName, "Ari Vale");
  assert.ok(offspring.suggestedTags.includes("Adult Offspring"));
  assert.match(offspring.safetyNotes.join(" "), /always adults/);
  assert.match(offspring.minorNpcRuntimeGuardrail, /slice-of-life/);
  assert.match(offspring.minorNpcRuntimeGuardrail, /refuse briefly/);
});

test("clamps requested offspring age to adult range", () => {
  const offspring = generateAdultOffspringProfile({
    anchorYear: 2026,
    parents: [{ given_name: "Rowan", surname: "Frost" }],
    targetAge: 12,
  });

  assert.equal(offspring.age, 18);
});

test("inherits supernatural lineage when a parent has one", () => {
  const offspring = generateAdultOffspringProfile({
    parents: [
      {
        given_name: "Lucien",
        surname: "Black",
        species: { type: "Vampire", isImmortal: true },
      },
      {
        given_name: "Iris",
        surname: "Vale",
        species: { type: "Human", isImmortal: false },
      },
    ],
    random: () => 0,
  });

  assert.equal(offspring.species, "Vampire");
  assert.ok(offspring.inheritedSignals.includes("Vampire lineage"));
});
