import assert from "node:assert/strict";
import test from "node:test";

import {
  BDSM_DYNAMIC_PRESET_CATEGORIES,
  BDSM_DYNAMIC_PRESETS,
  compileBdsmDynamicPresetAdditions,
  findBdsmDynamicPresetById,
  getBdsmDynamicPresetsByCategory,
} from "../../data/bdsmDynamicPresets";

test("loads BDSM dynamic presets across consent, trust, protocol, service, and dialogue lanes", () => {
  assert.equal(BDSM_DYNAMIC_PRESETS.length, 257);
  assert.deepEqual(BDSM_DYNAMIC_PRESET_CATEGORIES, [
    "Archetype",
    "Authority Role",
    "Caretaking",
    "Core Dynamic",
    "Devotion",
    "Dialogue Seed",
    "Gate",
    "High-Value Seed",
    "Power Exchange Style",
    "Protocol",
    "Romance Hook",
    "Service Role",
    "Trust",
  ]);

  const ids = BDSM_DYNAMIC_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getBdsmDynamicPresetsByCategory("Archetype").length, 20);
  assert.equal(getBdsmDynamicPresetsByCategory("Core Dynamic").length, 20);
  assert.equal(getBdsmDynamicPresetsByCategory("Authority Role").length, 20);
  assert.equal(getBdsmDynamicPresetsByCategory("Service Role").length, 20);
  assert.equal(getBdsmDynamicPresetsByCategory("Protocol").length, 20);
  assert.equal(getBdsmDynamicPresetsByCategory("Trust").length, 20);
  assert.equal(getBdsmDynamicPresetsByCategory("Devotion").length, 20);
  assert.equal(getBdsmDynamicPresetsByCategory("Caretaking").length, 20);
  assert.equal(getBdsmDynamicPresetsByCategory("Power Exchange Style").length, 20);
  assert.equal(getBdsmDynamicPresetsByCategory("Romance Hook").length, 20);
  assert.equal(getBdsmDynamicPresetsByCategory("Gate").length, 20);
  assert.equal(getBdsmDynamicPresetsByCategory("Dialogue Seed").length, 17);
  assert.equal(getBdsmDynamicPresetsByCategory("High-Value Seed").length, 20);
});

test("normalises BDSM dynamic values for visible prompt text", () => {
  const consent = findBdsmDynamicPresetById(
    "bdsm_dynamic_archetype_consent_centred_dynamic",
  );
  const ritual = findBdsmDynamicPresetById(
    "bdsm_dynamic_archetype_ritualised_partnership",
  );
  const teacher = findBdsmDynamicPresetById(
    "bdsm_dynamic_authority_adult_teacher",
  );
  const behaviour = findBdsmDynamicPresetById(
    "bdsm_dynamic_caretaking_nurturing_behaviour",
  );

  assert.equal(consent?.value, "Consent-Centred Dynamic");
  assert.equal(ritual?.value, "Ritualised Partnership");
  assert.equal(teacher?.value, "adult teacher");
  assert.equal(behaviour?.value, "nurturing behaviour");

  const visibleText = BDSM_DYNAMIC_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.doesNotMatch(
    visibleText,
    /Use code with caution|centered|ritualized|behavior|teacher_student|force prose|SYSTEM PROTOCOL/i,
  );
});

test("compiles BDSM dynamics as soft adult negotiated power-exchange guidance", () => {
  const preset = findBdsmDynamicPresetById(
    "bdsm_dynamic_high_value_ongoing_consent",
  );
  assert.ok(preset);

  const additions = compileBdsmDynamicPresetAdditions(preset);

  assert.match(additions.relationshipAddition, /Adult negotiated power-exchange context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft adult power-exchange context/i);
  assert.match(additions.systemPromptAddition, /consent, boundaries, ongoing choice/i);
  assert.match(additions.systemPromptAddition, /safewords or stop signals/i);
  assert.match(additions.systemPromptAddition, /aftercare/i);
  assert.match(additions.systemPromptAddition, /\{\{user\}\} agency/i);
  assert.match(additions.systemPromptAddition, /avoid romanticising coercion/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("keeps service, authority, and protocol lanes consent-centred", () => {
  const authority = findBdsmDynamicPresetById("bdsm_dynamic_authority_commander");
  const service = findBdsmDynamicPresetById("bdsm_dynamic_service_devotional_service");
  const protocol = findBdsmDynamicPresetById("bdsm_dynamic_protocol_relationship_rules");
  const trust = findBdsmDynamicPresetById("bdsm_dynamic_trust_ongoing_consent");
  assert.ok(authority);
  assert.ok(service);
  assert.ok(protocol);
  assert.ok(trust);

  assert.match(authority.guidance, /responsibility, service, steadiness/i);
  assert.match(authority.guidance, /rather than coercion or entitlement/i);
  assert.match(service.guidance, /chosen, reciprocal, emotionally safe/i);
  assert.match(protocol.guidance, /without overriding consent or comfort/i);
  assert.match(trust.guidance, /renewed through communication, boundaries/i);
});
