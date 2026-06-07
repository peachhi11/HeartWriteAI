import assert from "node:assert/strict";
import test from "node:test";

import {
  generateAdultOffspringProfile,
  synthesizeAdultOffspringSeed,
} from "../../lib/character-card/offspringGenerator";

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

test("synthesizes adult offspring seeds from inherited pressure instead of shallow blending", () => {
  const synthesis = synthesizeAdultOffspringSeed({
    contentMode: "SFW",
    parents: [
      {
        given_name: "Maren",
        surname: "Voss",
        archetype: {
          coreMotivation: "Security_Protection",
          defenseMechanism: "Hyper_Rationalization",
          personaType: "The_Perfectionist",
        },
        coreValues: ["control", "procedure"],
        fears: ["being bypassed"],
        occupation: {
          authorityDynamic: "gatekeeper authority",
          jobTitle: "Museum registrar",
        },
        relationshipDynamic: "protector through controlled access",
        tone: { worldviewFilter: "Jaded_Weary" },
      },
      {
        given_name: "Rowan",
        surname: "Vale",
        archetype: {
          coreMotivation: "Autonomy_Freedom",
          defenseMechanism: "Defiant_Autonomy",
          personaType: "The_Rogue_Instigator",
        },
        coreValues: ["freedom", "improvisation"],
        fears: ["becoming trapped"],
        occupation: {
          authorityDynamic: "rule breaker",
          jobTitle: "Private investigator",
        },
        relationshipDynamic: "equal but evasive",
        tone: { worldviewFilter: "Optimistic_Idealistic" },
      },
    ],
    random: () => 0,
  });

  assert.equal(synthesis.developmentalPath, "conflicted_division");
  assert.match(synthesis.seed, /Adult/);
  assert.match(synthesis.seed, /\{\{user\}\}/);
  assert.match(synthesis.seed, /Power dynamic/);
  assert.match(synthesis.seed, /Mode: SFW/);
  assert.ok(synthesis.lineageSignals.includes("Security_Protection"));
});
