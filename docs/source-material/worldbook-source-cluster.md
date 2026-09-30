# World Book Source Cluster

This note mines the worldbuilding files from the Archive inbox into HeartWrite's World Book model.

Use it when building the World Book section, lorebook extraction, world presets, scenario routing, or prompt-pack compilation. This is source material, not a runtime prompt.

Plain-English rule: the World Book is not a lore dump. It is the part of the StoryBook that tells the AI what kind of world the character lives in, what rules matter, what pressure the setting creates, and what details should be triggered only when relevant.

## Source Files Checked

Inbox sources:

- `/Users/meganmckinnon/Downloads/Archive/00_Source_Reference_Library/inbox/Inbox/149747572-World-Building.docx`
- `/Users/meganmckinnon/Downloads/Archive/00_Source_Reference_Library/inbox/Inbox/305773768-7-Deadly-Sins-of-Worldbuilding.pdf`
- `/Users/meganmckinnon/Downloads/Archive/00_Source_Reference_Library/inbox/Inbox/409836508-The-Ultimate-Guide-To-WorldBuilding-How-To-Write-Fantasy-SciFi-And-RealLife-Worlds.pdf`
- `/Users/meganmckinnon/Downloads/Archive/00_Source_Reference_Library/inbox/Inbox/441900715-Worldbuilding-Theory.pdf`
- `/Users/meganmckinnon/Downloads/Archive/00_Source_Reference_Library/inbox/Inbox/600861970-ultimate-worldbuilding-template-reedsy24.pdf`
- `/Users/meganmckinnon/Downloads/Archive/00_Source_Reference_Library/inbox/Inbox/684055159-Worldbuilding-Planner-Printable.pdf`
- `/Users/meganmckinnon/Downloads/Archive/00_Source_Reference_Library/inbox/Inbox/853996476-World-Building.pdf`

Kept duplicate-cleanup source:

- `/Users/meganmckinnon/Downloads/Archive/00_Source_Reference_Library/source-documents/751784566-world-building-handout-FINAL.pdf`

## Source Shapes

### Big Checklist Sources

These are strong for field discovery:

- physical world and geography
- government and law
- society and class
- culture and customs
- religion and belief
- technology
- magic
- species
- characters
- weapons and armor
- economy and trade
- foreign relations
- history and lore
- language and communication
- travel and transportation
- fashion and clothing
- arts and entertainment
- daily life
- conflict and war

App use:

- world-builder form fields
- lorebook extraction categories
- tag suggestions
- missing-field prompts
- modular world kit conversion

### Theory And Process Sources

These are strong for compiler rules:

- worldbuilding should serve the story, not trap the user in prep
- build inside-out when the story/character already implies the needed world
- build outside-in when the user wants a broad setting first
- begin where the world's rules crack, fail, or put pressure on the character
- infrastructure matters: food, shelter, clothing, waste, transportation, labor, and survival make a setting feel real
- "why now?" matters: the world should explain why the story pressure is active at this moment
- genre, time/place, and tone establish what is possible, normal, forbidden, comedic, dangerous, or romantic
- continuity and rules matter more than encyclopedic detail

App use:

- prompt compiler guardrails
- world-preset quality checks
- scenario/world split
- StoryBook continuity checks
- generated lorebook pruning

## World Book Placement In The Stack

Builder order:

1. Character Card / Character Book
2. World Book
3. Participants
4. Relationships
5. Secrets
6. Scenario Book
7. Memory Book
8. User Book
9. Prompt Book / Prompt Packs

Why the World Book sits below the character card:

- the character card tells us what kind of world is already implied
- the World Book should extract and organize what the card contains before inventing anything new
- a vampire card, omegaverse card, mafia card, university card, celebrity card, workplace card, or sci-fi card needs a different extraction lens
- world details should support the specific story, not overwrite the card's premise

Prompt compile order:

1. Prompt Book
2. Character Book
3. World Book
4. User Book
5. Scenario Book
6. Memory Book
7. Latest User Move

Compile rule:

- Character Book defines who `{{char}}` is.
- World Book defines what kind of reality they live in.
- Scenario Book defines what is happening right now.
- Memory Book defines what history, secrets, and relationship knowledge still matter.

## Core World Book Sections

### World Type

Useful values:

- contemporary reality
- alternate reality
- hidden world
- supernatural
- omegaverse
- vampire
- werewolf
- superhero
- sci-fi
- fantasy
- historical
- dark romance
- mafia / underworld
- gangs
- workplace
- university / college
- celebrity / rock star
- royal / aristocratic
- small town
- dystopian
- post-apocalyptic

Compiler use:

- sets genre expectations
- limits what is normal
- determines what needs explanation
- controls how much exposition is needed
- suggests which tags and lorebook entries matter

### Geography And Locations

Fields:

- world name
- region
- country / city / town / campus / ship / estate / pack territory / coven district
- climate
- terrain
- borders
- neighborhoods
- roads and routes
- private places
- public places
- liminal places
- forbidden places
- recurring scene locations

Compiler use:

- ground scenes physically
- support travel and interruption logic
- create privacy and exposure pressure
- track where secrets can be overheard or discovered

### Rules And Physics

Fields:

- mundane physics
- magic rules
- supernatural rules
- biological rules
- heat/rut rules
- technology limits
- social rules
- legal rules
- taboo rules
- consequences for breaking rules
- exceptions
- loopholes

Compiler use:

- prevent contradictions
- make escalation coherent
- tell the AI what cannot happen without cost
- route rule-breaking into consequence, secrecy, punishment, danger, or temptation

### Government, Law, And Power

Fields:

- formal authority
- informal authority
- law enforcement
- courts or justice system
- corruption
- surveillance
- class access
- military or security
- leadership succession
- who is above the law
- who is vulnerable to the law
- what punishments exist

Compiler use:

- create external pressure
- support forbidden attraction, class disparity, corruption, mafia, royal, and underworld stories
- distinguish private desire from public consequence

### Society, Class, And Culture

Fields:

- social classes
- status markers
- wealth gap
- education
- family structure
- gender norms
- sexuality norms
- courtship norms
- marriage norms
- reputation rules
- public/private behavior gap
- etiquette
- slang
- holidays
- art and entertainment
- clothing and presentation

Compiler use:

- make romance socially specific
- create shame, secrecy, risk, gossip, class pressure, family pressure, and public performance
- keep character behavior tied to what their society rewards or punishes

### Economy And Infrastructure

Fields:

- common jobs
- labor systems
- food production
- housing
- transportation
- trade
- money
- scarcity
- medicine
- waste and sanitation
- communication systems
- energy sources
- who does invisible work
- who profits
- who is exploited

Compiler use:

- make the world feel lived-in
- explain why characters cannot simply leave, buy safety, cross a border, avoid a boss, or ignore a power structure
- reveal class and survival pressure through ordinary logistics

### History, Lore, And Events

Fields:

- founding events
- wars
- disasters
- scandals
- treaties
- betrayals
- migrations
- plagues
- supernatural awakenings
- regime changes
- family histories
- local legends
- recent incidents
- unresolved historical wounds

Compiler use:

- define what the world remembers
- support faction conflict
- explain inherited prejudice, old debts, rivalries, and taboos
- answer "why now?" for current story pressure

### Religion, Belief, And Myth

Fields:

- religions
- gods/deities
- rituals
- prophets
- sacred places
- myths
- superstition
- moral codes
- heresy
- blasphemy
- cults
- spiritual authority
- secular disbelief

Compiler use:

- create taboo, ritual, obligation, guilt, awe, devotion, and rebellion
- distinguish private belief from public performance
- support supernatural and historical settings

### Magic, Technology, And Tools

Fields:

- magic system
- who can use magic
- how magic is learned
- costs and limits
- technology level
- weapons
- medical tech
- communication tech
- surveillance tech
- transport tech
- household tech
- forbidden tools
- rare artifacts

Compiler use:

- define available solutions
- set costs for power
- prevent the AI from solving problems with unsupported abilities
- make objects and tools matter in scenes

### Species, Biology, And Bodies

Fields:

- species
- subspecies
- biological cycles
- lifespan
- senses
- strength and vulnerability
- reproduction rules
- scent/pheromone rules
- transformation rules
- feeding rules
- illness and injury rules
- social status attached to biology

Compiler use:

- support omegaverse, vampire, werewolf, alien, fae, monster, and hybrid settings
- route body logic into character behavior without turning biology into exposition
- keep adult-only intimacy rules explicit when relevant

### Factions And Groups

Fields:

- families
- houses
- packs
- covens
- gangs
- companies
- schools
- clubs
- governments
- religions
- criminal networks
- activist groups
- military units
- rival crews
- fan/public communities

Compiler use:

- create allegiance and betrayal pressure
- track who has power over whom
- support NPC generation
- explain why a relationship has consequences beyond the couple

### Items, Documents, And Artifacts

Fields:

- letters
- phones
- journals
- contracts
- heirlooms
- weapons
- magical objects
- clothing items
- rings/collars/tokens
- IDs or passes
- drugs/medicine
- photos/videos/screenshots
- keys
- vehicles

Compiler use:

- trigger secrets and reveals
- support physical continuity
- make evidence, proof, memory, and leverage concrete

## World Book Entry Shape

Recommended entry fields:

```ts
type WorldBookEntry = {
  id: string;
  type:
    | "world_type"
    | "rule"
    | "location"
    | "faction"
    | "culture"
    | "law"
    | "event"
    | "history"
    | "species"
    | "magic"
    | "technology"
    | "item"
    | "language"
    | "economy"
    | "religion"
    | "npc_group";
  name: string;
  summary: string;
  content: string;
  keys: string[];
  secondaryKeys?: string[];
  relatedEntryIds: string[];
  sourceEvidence: string[];
  priority: "core" | "high" | "medium" | "low";
  triggerMode: "always" | "keyword" | "scene_linked" | "manual";
  visibility: "prompt" | "builder_only" | "context_only";
};
```

Important:

- `sourceEvidence` should point to what was actually present in the character card or user input.
- Avoid speculative lore during card import. Suggested lore can be generated later, but imported lore should stay traceable.
- Unknown fields should be preserved where platform specs require it.

## Lorebook Trigger Logic

Good trigger keys:

- proper nouns
- place names
- faction names
- titles
- species names
- laws/rules
- recurring objects
- social rituals
- named events
- nicknames for places

Risky trigger keys:

- generic words like `magic`, `school`, `family`, `city`, `law`, `blood`, `night`, `boss`
- common trope labels unless paired with a secondary key
- words that fire every scene and flood context

Recommended routing:

- `always`: only for tiny core rules the story breaks without
- `keyword`: for locations, factions, items, and named lore
- `scene_linked`: for active scenario places, NPC groups, and current arc lore
- `manual`: for deep background or optional setting expansion

## Scenario Book Split

World Book stores semantic memory:

- the world type
- stable rules
- locations
- factions
- social norms
- history
- magic/technology systems
- recurring lore

Scenario Book stores active memory:

- where the scene is happening now
- who is present
- what time it is
- what recently changed
- which rules are currently under pressure
- what secrets are active
- what interruption is seeded
- what consequence is about to arrive

Do not store every current scene beat in the World Book. If it changes every few turns, it belongs in Scenario Book or Memory Book.

## Prompt Compiler Rules

- Use World Book entries to constrain possibility, not to dump exposition.
- Prefer one or two relevant world details per generated prompt section.
- Let world details appear through character behavior, objects, setting, obstacles, dialogue, and consequences.
- A world rule should change a choice, cost, risk, or available action.
- If the user chooses a platform preset, compile only the amount of lore that platform can carry.
- Character card lore should take precedence over generic world presets.
- If the World Book conflicts with the Character Book, flag it instead of silently merging.

## Quality Checks

A useful World Book entry should answer at least one of these:

- What does this change about what characters can do?
- What does this make dangerous, shameful, expensive, illegal, sacred, desirable, or impossible?
- Who benefits from this rule?
- Who is harmed by it?
- How does it affect romance, secrecy, conflict, or power?
- What scene trigger should make it appear?
- What related entries should it pull with it?

Weak entries:

- static trivia
- generic fantasy filler
- geography with no story pressure
- institutions with no effect on characters
- magic with no cost or limit
- history that never changes the present

Strong entries:

- a dorm rule that makes secret meetings risky
- a pack hierarchy that changes who can touch whom in public
- a vampire feeding law that turns hunger into legal danger
- a mafia debt that makes a romantic favor politically loaded
- a celebrity contract that makes public dating costly
- a family scandal that makes a step-sibling romance explosive
- an omegaverse scent rule that turns jealousy into a social event

## Current Gaps Filled By This Cluster

This source cluster helps with:

- World Book builder shape
- lorebook extraction categories
- modular world kit conversion
- world/prompt stack ordering
- setting-specific relationship pressure
- trigger keys and related-entry linking
- stable world memory versus active scenario memory
- avoiding overbuilt lore dumps

Still needed:

- specific world presets for HeartWrite tags: omegaverse, vampire, werewolf, mafia, university, celebrity, workplace, royal/aristocratic, superhero, sci-fi
- platform-specific worldbook export examples for JanitorAI, SillyTavern, and Marinara
- tests for character-card world extraction into World Book entries
- UI copy for adding/editing World Book entries without making it feel like homework
