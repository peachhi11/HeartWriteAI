# Inbox Intake Triage - 2026-09-29

This note records the first pass over:

`/Users/meganmckinnon/Downloads/Archive/00_Source_Reference_Library/inbox/Inbox`

The inbox is a source-material holding pen. Nothing here should be treated as runtime instruction just because it exists in the folder. Mine these files as evidence, vocabulary, structures, and test cases, then adapt the useful parts into HeartWrite's source notes, seeds, compiler logic, or tests.

## Intake Snapshot

- Initial total files: 239
- After duplicate cleanup: 227
- Initial PDFs: 185
- Initial DOCX: 35
- Initial legacy DOC: 13
- Initial Markdown: 3
- Initial JSON: 3

Exact duplicate found and cleaned up:

- Kept: `647644050-Core-Belief-Clusters.pdf`
- Deleted: `540372960-Core-Belief-Clusters.pdf`
- Deleted: `647644050-Core-Belief-Clusters (1).pdf`

After cleanup, no exact duplicate hashes remained inside Inbox.

## Overlap With Existing Archive Work

The inbox does overlap with earlier archive material.

Same basename elsewhere in the Archive source library, and SHA-256 confirmed byte-for-byte identical. The Inbox copies were deleted and the organized source-document copies were kept:

- `121555171-Writing-Romance.pdf`
- `45946842-Plot-Guide.pdf`
- `492300706-Character-Development-from-Fundamentals-to-Flesh-and-Bone-Writers-com.pdf`
- `519290499-Writing-Vivid-Emotions.pdf`
- `658813991-Character-Arcs-in-Romantic-Comedies-Handout.pdf`
- `704137335-Scene-Structure.pdf`
- `751784566-world-building-handout-FINAL.pdf`
- `783892277-Ebin-pub-the-Trope-Thesaurus.pdf`
- `82941370-Sexual-Intimacy-and-Emotional-Intimacy.doc`
- `92516272-Patterns-of-Relationships.doc`

Already mentioned in existing HeartWrite source notes:

- 97 inbox filenames are already referenced somewhere under `docs/source-material/`.
- This means the inbox is partly a duplicate stash, partly a consolidation of already-discussed materials, and partly genuinely new.

No same-basename matches were found in:

- `/Users/meganmckinnon/Downloads/The Visceral Codex - NSFW Enhancer`
- `/Users/mmdev/characterhub`

Mining rule:

- If a file is already referenced in a source note, check whether it has actually been mined before adding a new note.
- If it was a byte-for-byte duplicate of a top-level archive file, use the kept top-level Archive copy or existing source-note coverage.
- Treat Inbox as the current intake location, not proof that every file is new.

## High-Value Source Groups

### Character Card And Prompt-Stack Specs

Files:

- `spec_v1.md`
- `spec_v2.md`
- `SPEC_V3.md`
- `Stab's Lab v1.0.json`
- `ProseEngine_AutoBackup_2026-08-21.json`
- `whether-you-re-writing-an.json`

Why this matters:

- The V1/V2/V3 specs are directly useful for PNG/JSON/CHARX character-card import, metadata preservation, unknown-field preservation, lorebook support, alternate greetings, assets, and extension handling.
- `Stab's Lab v1.0.json` is useful as a SillyTavern-style prompt-stack specimen: prompt slots, injection order, markers, persona fields, world info markers, impersonation prompt, and disabled optional modules.
- `ProseEngine_AutoBackup_2026-08-21.json` is useful as a story-structure specimen: books, chapters, scenes, versions, POV, emotional beat, reveal level, action level, heat, scene type, motifs, relationship shifts, world state changes, and reader-vs-character knowledge.
- `whether-you-re-writing-an.json` is useful as an example of a saved prompt artifact, but it reads polished and generic; mine the fields/shape more than the voice.

Best route:

- Build a `character-card-import-specs.md` source note.
- Add parser tests for V1/V2/V3 preservation and PNG metadata routes.
- Mine `Stab's Lab` for prompt-slot architecture, not policy language.
- Mine `ProseEngine` for StoryBook/chapter/scene/version fields.

### Worldbuilding And Setting Design

Files include:

- `149747572-World-Building.docx`
- `305773768-7-Deadly-Sins-of-Worldbuilding.pdf`
- `409836508-The-Ultimate-Guide-To-WorldBuilding-How-To-Write-Fantasy-SciFi-And-RealLife-Worlds.pdf`
- `441900715-Worldbuilding-Theory.pdf`
- `600861970-ultimate-worldbuilding-template-reedsy24.pdf`
- `684055159-Worldbuilding-Planner-Printable.pdf`
- `751784566-world-building-handout-FINAL.pdf`
- `853996476-World-Building.pdf`

Why this matters:

- This is the obvious next mining target for the World Book builder.
- These files can fill the current gap around setting types, world rules, location logic, factions, events, objects, genre constraints, and modular lore entries.

Best route:

- Mine into a `worldbook-source-cluster.md` note.
- Convert into World Book fields: world type, rules, locations, factions, items, events, social norms, genre pressure, and trigger keys.
- Keep the output modular and lorebook-ready, not essay-shaped.

### Romance, Plot, Scene, And Subtext Craft

Files include:

- `121555171-Writing-Romance.pdf`
- `413217351-Characteristics-of-Romance-Genre.pdf`
- `588548424-Romance-Beats-vs-12-Stages-of-Intimacy-Jami-Gold-Paranormal-Author.pdf`
- `658813991-Character-Arcs-in-Romantic-Comedies-Handout.pdf`
- `714504566-StoryDesignROMANCE.pdf`
- `819629040-Paul-Tomlinson-Romance-How-to-Write-a-Romantic-Novel-Paul-Tomlinson-2022.pdf`
- `902360856-the-stranger-to-soulmate-2025-27-06-11-04-5.pdf`
- `202655048-Master-Plots.pdf`
- `375177447-Plot-Formulas.pdf`
- `438611286-plot-pardigms-pdf.pdf`
- `45946842-Plot-Guide.pdf`
- `704137335-Scene-Structure.pdf`
- `508968841-Story-Stakes-Your-1-Writing-S-H-R-D-Costa.pdf`
- `337471442-Writing-Subtext-2nd-edition-sample.pdf`
- `52953563-Writing-Subtext-sample-PDF.pdf`
- `77215174-Writing-Love-Scene.pdf`
- `782098936-Writing-Love-Scenes-Rayne-Hall-Hall-Rayne.pdf`

Why this matters:

- This fills the softer gap left by the kink/power-dynamics material: romance pacing, intimacy stages, romcom arcs, ordinary warmth, subtext, scene structure, stakes, and love-scene craft.

Best route:

- Mine into `romance-scene-craft-source-cluster.md`.
- Build prompt-pack seeds for low heat, slow burn, romcom banter, domestic tenderness, attraction-to-attachment, reconciliation, and scene-level subtext.

### Character, Persona, And Appearance Construction

Files include:

- `492300706-Character-Development-from-Fundamentals-to-Flesh-and-Bone-Writers-com.pdf`
- `464403899-Building-Characters-For-Writers-and-Roleplayers-revised-pdf.pdf`
- `682670988-Kinsman-Berin-Building-Characters-For-Writers-and-Roleplayers-Revised-Text-v1-01-2016.pdf`
- `703531900-8-Elements-of-Character.pdf`
- `784644444-The-Character-Creation-Workbook-TNS.pdf`
- `820665905-Kira-Anne-Pelican-The-Science-of-Writing-Characters.pdf`
- `EADeverell-intelligent-characters.pdf`
- `EADeverell-unintelligent-characters.pdf`
- `Personality-and-appearance.pdf`
- `52785660-describing-people-examples.doc`

Why this matters:

- This is ideal for Character Book and User Book field quality.
- It can improve appearance generation, cognition, intelligence style, decision logic, contradiction, speech behavior, and roleplay-ready persona fields.

Best route:

- Mine into `character-persona-construction-source-cluster.md`.
- Route appearance details into behavior and self-perception, not just visual inventory.

### Psychology, Emotion, Attachment, And Relationship Repair

Files include:

- Big Five, temperament, personality, values, primal world beliefs, schemas, cognitive distortions, attachment, shame, anger, boundaries, conflict repair, family roles, core beliefs, emotional regulation, codependency, infidelity, intimacy, and healthy/unhealthy relationship material.

Why this matters:

- Some of this has already been represented in `psychology-relationship-fiction-mechanics-cluster.md`.
- The inbox adds enough depth to split this into cleaner sub-notes later: attachment, emotional vocabulary, conflict repair, values/beliefs, family systems, and sexuality/intimacy psychology.

Best route:

- Do not keep expanding one giant psychology note forever.
- Split by app function: Character Psychology, Relationship Memory, User Persona Vulnerability, Conflict/Repair, and Memory Book triggers.

### Sexuality, Kink, Intimacy, And Power

Files include:

- `1022393298-Navigating-a-Female-Led-Relationship.pdf`
- `1028305275-When-Power-and-Pain-Are-Eroticized.pdf`
- `1057159692-796914535-a-Detailed-BDSM-Task-List-for-a-Submissive-Can-Vary-Greatly-Based-on-the-Dynamics-of-the-Relationship.pdf`
- `183528498-Sexual-Intelligence.pdf`
- `474374292-The-Languages-of-Sexuality.pdf`
- `594757993-Sadism-and-Masochism.pdf`
- `628532013-Physical-Pain-as-Pleasure-A-Theoretical-Perspective.pdf`
- `685106476-Sexuality-Beyond-Consent-Avgi-Saketopoulou.pdf`
- `82941370-Sexual-Intimacy-and-Emotional-Intimacy.doc`

Why this matters:

- This can deepen the fiction/consent/context-routing model without flattening kink into danger language or turning every relationship into formal protocol.
- It is especially useful for adult fictional psychology, arousal logic, power/pain meaning, intimacy wounds, and softer non-protocol dynamics.

Best route:

- Mine into the existing dirty-talk/power-dynamics note only where it adds routing or vocabulary.
- Create a separate `sexuality-intimacy-psychology-source-cluster.md` if it starts becoming more about meaning, shame, desire, intimacy, and relationship repair than kink mechanics.

### Flirtation, Seduction, Pursuit, And Dark-Romance Worldview Material

Files include:

- `364102025-Obsession-Phrases.pdf`
- `579339905-Infatuation-Scripts-6-0.pdf`
- `618089347-Body-Language-and-Style-Guide.pdf`
- `732104568-Step-3-Become-A-Flirtatious-Tease.pdf`
- `732104561-Step-4-Learn-How-To-Initiate-Sex-Effortlessly.pdf`
- `403558614-10-teases-pdf.pdf`
- `453493401-Book-of-Negs-by-Mystery-pdf.pdf`
- `145086648-81-Ways-to-Break-Rapport.pdf`
- `78107232-PUALingoDictionary.pdf`
- `29275732-Swingcat-Real-World-Seduction.pdf`
- `623282363-The-Game.pdf`
- `915190861-Dark-Seduction-Persuasion-Charisma-the-3-In-1-Bible.pdf`
- `923691050-The-Art-of-Dark-Seduction-Audiobook-You-Were-Warned-Not-to-Listen-to-English-Auto-generated-GetSubs-cc.pdf`

Why this matters:

- The useful layer is fiction mechanics: pursuit, fixation, confidence performance, push-pull, flirtation, teasing, social power, status display, misfires, obsession, and damaged worldview.
- Some material may be unpleasant or manipulative as real-world advice. For HeartWrite, mine it as character worldview, dark-romance pressure, antagonist logic, damaged love-interest logic, or route tests.

Best route:

- Keep it in backend taxonomy and fiction-language banks.
- User-facing labels should be clean and fiction-friendly: tease, pursuit, fixation, push-pull, dangerous charm, social power, jealousy pressure, misread signals.

## Immediate Mining Priority

1. Worldbuilding and World Book sources.
2. Romance/scene/subtext sources for softer, non-kink relationship texture.
3. Character/persona construction sources for stronger Character Book and User Book fields.
4. Card spec and JSON prompt-stack artifacts for import/export and prompt-stack architecture.
5. Sexuality/intimacy psychology sources for deeper adult-fiction desire logic.
6. Remaining seduction/dark-romance worldview files as backend routing tests and vocabulary.

## Current Gaps This Inbox Can Fill

- World Book generation and lorebook extraction.
- Low-heat romance and tenderness.
- Domestic intimacy.
- Romcom banter and playful flirting that is not kink-coded.
- Established-couple comfort.
- Romance beats and slow-burn pacing.
- Character cognition and intelligence style.
- Appearance-to-behavior routing.
- Scene stakes and subtext.
- Character-card import/export compatibility.

## Mining Progress

- `worldbook-source-cluster.md` was added from the worldbuilding group. It covers World Book sections, stable world memory versus active Scenario Book memory, modular lorebook entry shape, trigger-key logic, compile rules, and remaining world-preset/export/test gaps.

## QC Notes

- Exact duplicate check was done by SHA-256.
- Archive overlap check was done by basename first, then SHA-256 for matching top-level Archive files.
- Duplicate cleanup deleted 12 Inbox files total: 2 internal Core Belief duplicates plus 10 copies that were identical to top-level Archive files.
- Existing source-note overlap was checked by matching inbox basenames against `docs/source-material/*.md`.
- File-type inspection was done with `file`.
- The Markdown and JSON files were inspected directly.
- PDF/DOC/DOCX content has not been fully mined in this pass; the filenames and available metadata were used for triage.
- Treat large copyrighted books as source evidence only. Do not copy long passages into docs or seeds.
