import assert from "node:assert/strict";
import test from "node:test";

import {
  MUSIC_PRESET_CATEGORIES,
  MUSIC_PRESETS,
  compileMusicPresetAdditions,
  findMusicPresetById,
  getMusicPresetsByCategory,
  highValueMusicSeeds,
  musicBehaviorSeeds,
  musicDialogueSeeds,
  musicGates,
  musicGenreSeeds,
  musicMoodSeeds,
  musicPresets,
  musicRomanceHooks,
  musicSeeds,
} from "../../data/musicPresets";

test("loads music presets across archetype, genre, mood, romance, gate, and dialogue lanes", () => {
  assert.equal(MUSIC_PRESETS.length, 186);
  assert.deepEqual(MUSIC_PRESET_CATEGORIES, [
    "Archetype",
    "Behaviour",
    "Dialogue Seed",
    "Gate",
    "Genre",
    "High-Value Seed",
    "Mood",
    "Music Seed",
    "Romance Hook",
  ]);

  assert.equal(musicPresets.length, 20);
  assert.equal(musicSeeds.length, 20);
  assert.equal(musicGenreSeeds.length, 36);
  assert.equal(musicMoodSeeds.length, 20);
  assert.equal(musicBehaviorSeeds.length, 20);
  assert.equal(musicRomanceHooks.length, 20);
  assert.equal(musicGates.length, 14);
  assert.equal(musicDialogueSeeds.length, 16);
  assert.equal(highValueMusicSeeds.length, 20);

  const ids = MUSIC_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getMusicPresetsByCategory("Genre").length, 36);
  assert.equal(getMusicPresetsByCategory("Romance Hook").length, 20);
  assert.equal(getMusicPresetsByCategory("High-Value Seed").length, 20);
});

test("normalises readable music values, user references, and genre labels", () => {
  const rAndB = findMusicPresetById("music_genre_r_and_b");
  const kPop = findMusicPresetById("music_genre_k_pop");
  const favouriteSong = findMusicPresetById(
    "music_behaviour_remembers_user_s_favourite_song",
  );
  const learnsTaste = findMusicPresetById(
    "music_behaviour_learns_user_s_music_taste",
  );
  const writesSong = findMusicPresetById("music_romance_writes_song_for_user");
  const findsPlaylist = findMusicPresetById(
    "music_romance_user_finds_playlist_about_them",
  );
  const aboutUserGate = findMusicPresetById(
    "music_gate_first_song_about_user_gate",
  );
  const allValues = MUSIC_PRESETS.map((preset) => preset.value).join("\n");

  assert.equal(rAndB?.value, "R and B");
  assert.equal(rAndB?.label, "R And B");
  assert.equal(kPop?.value, "K-pop");
  assert.equal(favouriteSong?.value, "remembers {{user}}'s favourite song");
  assert.equal(learnsTaste?.value, "learns {{user}}'s music taste");
  assert.equal(writesSong?.value, "writes song for {{user}}");
  assert.equal(findsPlaylist?.value, "{{user}} finds playlist about them");
  assert.equal(aboutUserGate?.value, "first song about {{user}} gate");

  assert.doesNotMatch(
    allValues,
    /users|favorite|writes_song|learns_users|for_user|about_user/i,
  );
});

test("preserves dialogue seeds as dialogue text", () => {
  const playlist = findMusicPresetById("music_dialogue_you_made_me_a_playlist");
  const favouriteBand = findMusicPresetById(
    "music_dialogue_you_remembered_my_favourite_band",
  );

  assert.equal(playlist?.value, "You made me a playlist?");
  assert.equal(playlist?.label, "You made me a playlist?");
  assert.equal(favouriteBand?.value, "You remembered my favourite band.");
  assert.equal(favouriteBand?.triggerKeys.includes("You remembered my favorite band."), true);
  assert.match(playlist?.guidance ?? "", /adapted to scene context/i);
});

test("compiles music presets as soft scene texture", () => {
  const preset = findMusicPresetById("music_romance_playlist_as_confession");
  assert.ok(preset);

  const additions = compileMusicPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Music context: playlist as confession/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft music and taste context/i);
  assert.match(additions.systemPromptAddition, /memory, mood, ritual, identity/i);
  assert.match(additions.systemPromptAddition, /\{\{user\}\} autonomy intact/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});
