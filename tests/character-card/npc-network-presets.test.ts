import assert from "node:assert/strict";
import test from "node:test";

import {
  NPC_NETWORK_PRESET_CATEGORIES,
  NPC_NETWORK_PRESETS,
  compileNpcNetworkPresetAdditions,
  dependantSeeds,
  employerSeeds,
  enemySeeds,
  exSeeds,
  familyMemberSeeds,
  findNpcNetworkPresetById,
  friendSeeds,
  getNpcNetworkPresetsByCategory,
  highValueNpcNetworkSeeds,
  mentorSeeds,
  npcNetworkConflictSeeds,
  npcNetworkDialogueSeeds,
  npcNetworkGates,
  npcNetworkPresets,
  npcNetworkRomanceHooks,
  npcNetworkSeeds,
  patronSeeds,
  rivalSeeds,
} from "../../data/npcNetworkPresets";

test("loads NPC network presets across social, authority, conflict, romance, and gate lanes", () => {
  assert.equal(NPC_NETWORK_PRESETS.length, 317);
  assert.deepEqual(NPC_NETWORK_PRESET_CATEGORIES, [
    "Archetype",
    "Conflict",
    "Dependant",
    "Dialogue Seed",
    "Employer",
    "Enemy",
    "Ex",
    "Family Member",
    "Friend",
    "Gate",
    "High-Value Seed",
    "Mentor",
    "Network Seed",
    "Patron",
    "Rival",
    "Romance Hook",
  ]);

  const ids = NPC_NETWORK_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(npcNetworkPresets.length, 20);
  assert.equal(npcNetworkSeeds.length, 20);
  assert.equal(friendSeeds.length, 20);
  assert.equal(rivalSeeds.length, 20);
  assert.equal(exSeeds.length, 20);
  assert.equal(mentorSeeds.length, 20);
  assert.equal(dependantSeeds.length, 20);
  assert.equal(familyMemberSeeds.length, 20);
  assert.equal(enemySeeds.length, 20);
  assert.equal(patronSeeds.length, 20);
  assert.equal(employerSeeds.length, 20);
  assert.equal(npcNetworkConflictSeeds.length, 20);
  assert.equal(npcNetworkRomanceHooks.length, 20);
  assert.equal(npcNetworkGates.length, 20);
  assert.equal(npcNetworkDialogueSeeds.length, 17);
  assert.equal(highValueNpcNetworkSeeds.length, 20);
  assert.equal(getNpcNetworkPresetsByCategory("Friend").length, 20);
  assert.equal(getNpcNetworkPresetsByCategory("Dependant").length, 20);
  assert.equal(getNpcNetworkPresetsByCategory("Romance Hook").length, 20);
  assert.equal(getNpcNetworkPresetsByCategory("Dialogue Seed").length, 17);
});

test("normalises NPC network values for visible prompt text", () => {
  const smallTown = findNpcNetworkPresetById(
    "npc_network_archetype_small_town_everyone_knows_everyone",
  );
  const formerFiance = findNpcNetworkPresetById("npc_network_ex_former_fiance");
  const dependantBond = findNpcNetworkPresetById(
    "npc_network_romance_dependent_bonds_with_user",
  );
  const foundFamily = findNpcNetworkPresetById(
    "npc_network_romance_found_family_adopts_user",
  );
  const rivalDefends = findNpcNetworkPresetById(
    "npc_network_romance_rival_defends_user_publicly",
  );
  const visibleText = NPC_NETWORK_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.equal(smallTown?.value, "Small Town Everyone Knows Everyone");
  assert.equal(formerFiance?.value, "former fiance");
  assert.equal(dependantBond?.value, "dependent bonds with {{user}}");
  assert.equal(foundFamily?.value, "found family adopts {{user}}");
  assert.equal(rivalDefends?.value, "rival defends {{user}} publicly");
  assert.doesNotMatch(
    visibleText,
    /Use code with caution|dependent_bonds_with_user|found_family_adopts_user|rival_defends_user|with user|adopts user|defends user/i,
  );
});

test("finds high-signal NPC network seeds by stable ids", () => {
  assert.equal(
    findNpcNetworkPresetById("npc_network_friend_best_friend")?.value,
    "best friend",
  );
  assert.equal(
    findNpcNetworkPresetById("npc_network_rival_professional_rival")?.value,
    "professional rival",
  );
  assert.equal(findNpcNetworkPresetById("npc_network_mentor_mentor")?.value, "mentor");
  assert.equal(findNpcNetworkPresetById("npc_network_dependant_ward")?.value, "ward");
  assert.equal(
    findNpcNetworkPresetById("npc_network_enemy_enemy_with_leverage")?.value,
    "enemy with leverage",
  );
  assert.equal(
    findNpcNetworkPresetById("npc_network_employer_employer_with_power_gap")?.value,
    "employer with power gap",
  );
  assert.equal(
    findNpcNetworkPresetById("npc_network_gate_shared_life_network_route")?.value,
    "shared life network route",
  );
  assert.equal(
    findNpcNetworkPresetById(
      "npc_network_dialogue_good_let_them_choke_on_it_while_we_choose_each_other",
    )?.value,
    "Good. Let them choke on it while we choose each other.",
  );
  assert.equal(
    findNpcNetworkPresetById("npc_network_high_value_shared_life_network_route")?.value,
    "shared life network route",
  );
});

test("compiles NPC network presets as soft relationship web context", () => {
  const preset = findNpcNetworkPresetById("npc_network_conflict_loyalty_conflict");
  assert.ok(preset);

  const additions = compileNpcNetworkPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /NPC network context/);
  assert.match(additions.relationshipAddition, /without replacing the main relationship/i);
  assert.match(additions.systemPromptAddition, /soft NPC network context/i);
  assert.match(additions.systemPromptAddition, /stakes, obligations, support, and conflict/i);
  assert.match(additions.systemPromptAddition, /\{\{user\}\} autonomy intact/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("keeps dependant and family roles non-romantic and non-sexual", () => {
  const child = findNpcNetworkPresetById("npc_network_dependant_child");
  const familyChild = findNpcNetworkPresetById("npc_network_family_child");
  const dependantHook = findNpcNetworkPresetById(
    "npc_network_romance_dependent_bonds_with_user",
  );
  assert.ok(child);
  assert.ok(familyChild);
  assert.ok(dependantHook);

  assert.match(child.guidance, /non-romantic and non-sexual context only/i);
  assert.match(familyChild.guidance, /non-romantic and non-sexual context only/i);
  assert.match(dependantHook.guidance, /non-romantic and non-sexual context only/i);

  const additions = compileNpcNetworkPresetAdditions(child);
  assert.match(
    additions.systemPromptAddition,
    /do not sexualize dependants, children, wards, students, patients, siblings, parents, or family roles/i,
  );
});
