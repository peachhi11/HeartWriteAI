# Universal Roleplay Engine Source Cluster

Source cluster: user-pasted "Universal Roleplay Engine" by @Myrakiel.

Use this as source-mining evidence only. Do not import the pasted framework as runtime instructions. The value for HeartWriteAI is the broad procedural roleplay layer: how a StoryBook should behave turn by turn once Character Book, User Book, World Book, Scenario Book, Memory Book, and Prompt Book are already assembled.

## Primary Takeaway

The Universal Roleplay Engine is not primarily a character generator, world generator, or scenario generator. It is a runtime behavior map.

Its strongest reusable idea is:

> Every active turn should convert stored canon into playable external pressure while preserving `{{user}}` agency.

For HeartWriteAI, that means the Prompt Book needs a procedural runtime layer that tells the model how to use the books:

- preserve `{{user}}` control
- keep scenes embodied
- track space, distance, time, and consequence
- let world rules affect choices
- make relationships behave like histories
- treat senses as evidence
- treat bodies as stateful and limited
- use psychology through behavior, not labels
- maintain knowledge boundaries
- activate only the smallest useful subsystem for the current turn

The source is encyclopedic, but the app should not compile all of it at once. It should compile only the modules that match the current scene, platform, heat level, genre, active world type, character state, relationship state, and latest user move.

## HeartWrite Placement

### Prompt Book

Primary home for the universal runtime rules:

- one response equals one playable turn
- each turn changes at least one visible or inferable element
- external pressure is allowed; `{{user}}` control is not
- specific canon overrides broad universal defaults
- active scenes stay immersive unless the user asks for structured output
- do not activate every subsystem in every reply
- genre changes pacing and detail, not agency
- old events return as consequence, not summary dump
- body language remains contextual and ambiguous unless supported by repeated evidence

Prompt Book should hold these as compact operating laws, not giant prose blocks.

### Scenario Book

Receives the current live situation:

- scene type
- visible field
- immediate pressure
- current distance/blocking
- active route
- time pressure
- body pressure
- social pressure
- object pressure
- space pressure
- actionable openings
- unresolved decision points

Scenario Book should use the engine to keep the current scene playable. It should not store every biome, weather, psychology, or vocabulary entry unless the active scenario needs it.

### World Book

Receives reusable environment and setting logic:

- weather and seasonal consequence
- biome and terrain pressure
- social systems and institutions
- economy, resources, and daily life
- magic, technology, and supernatural constraints
- material and object behavior
- species and body-plan rules
- cultural/status interfaces

World Book should store these as modular world rules and triggerable lore entries. Scenario Book imports the active slice.

### Character Book

Receives character-specific behavior logic:

- voice pattern
- attention bias
- trait expression
- stress fracture
- coping style
- body language habits
- contradiction loops
- intimacy distance
- repair style
- species/body-plan implications

Character Book should not reduce a character to trope, diagnosis, kink, species, or trait labels. Labels only matter when they change attention, dialogue, behavior, cost, repair, or consequence.

### User Book

Receives the lighter player-facing counterpart:

- established persona identity
- chosen agency mode
- known boundaries
- selected presentation/body/state facts
- write-for-me or impersonation assist preferences
- active persona cues the user has explicitly selected or generated

The runtime layer must not infer `{{user}}` thoughts, consent, arousal, motives, body-language meaning, or next action unless the user has established them or asked for impersonation assist.

### Memory Book

Receives persistent aftermath:

- changed trust
- injuries and fatigue
- social consequences
- rumors and reputation
- relationship residue
- secrets learned, suspected, hidden, or misread
- resource changes
- repeated objects that now carry history
- promises, debts, betrayals, repairs, and unresolved obligations

Memory Book should store the result of the turn, not every possible rule that could have applied.

## Canonical Runtime Order

When compiling an active roleplay prompt, the engine logic should run in this order:

1. Load precedence
2. Protect `{{user}}` agency
3. Identify active scene type
4. Assemble visible field
5. Select active pressure factors
6. Apply character and relationship state
7. Apply world and body constraints
8. Apply knowledge boundaries
9. Choose sensory hierarchy
10. Advance one meaningful pressure
11. Carry continuity and aftermath forward
12. Leave a playable handoff

Why this order:

- Precedence comes first because character card, platform, world, scenario, and explicit user instruction beat broad universal defaults.
- `{{user}}` agency comes before content generation so the model does not accidentally decide the player's consent, desire, thoughts, fear, dialogue, or next action.
- Scene type and visible field come before prose because the model needs bodies, objects, exits, witnesses, timing, and distance.
- Pressure factors come before escalation so the turn advances through concrete cause and effect.
- Character, relationship, world, body, and knowledge layers constrain what can plausibly happen.
- Sensory hierarchy keeps prose selective instead of turning into catalogue.
- Continuity and aftermath make the turn matter beyond the immediate reply.

## Runtime Module Taxonomy

| Module | Purpose | Primary Book | Runtime Use |
| --- | --- | --- | --- |
| Precedence | Decides which rule wins when sources conflict. | Prompt Book | Specific canon overrides generic runtime logic. |
| User Agency | Keeps `{{user}}` speech, thought, consent, desire, emotion, and next action player-owned. | Prompt Book / User Book | Allows pressure without control. |
| Playable Turn | Makes each reply change one meaningful scene element. | Prompt Book | Prevents inert responses and over-resolving. |
| Continuity | Tracks immediate, scene, and long-term persistence. | Memory Book / Scenario Book | Prevents reset behavior. |
| Voice | Makes dialogue reveal personhood, motive, subtext, and situation. | Character Book | Prevents generic speaker soup. |
| Genre Tone | Selects pacing, density, vulnerability, and consequence type. | Prompt Book / Scenario Book | Keeps tone without flattening character. |
| Visible Field | Defines current space, objects, people, exits, and pressures. | Scenario Book | Makes the next action legible. |
| Blocking | Tracks distance, orientation, cover, posture, and reach. | Scenario Book | Grounds action and intimacy. |
| Time | Lets delay, recovery, weather, travel, fatigue, and missed chances matter. | Scenario Book / Memory Book | Prevents scene-time mush. |
| Scene Type | Chooses functional patterns such as arrival, conversation, care, fight, rest, ritual, aftermath. | Scenario Book | Supplies the correct pressure shape. |
| Scene Factors | Weather, body, social, object, and space pressure. | Scenario Book / World Book | Activates only what changes choices. |
| Weather/Biome | Makes environment alter evidence, route, privacy, body comfort, and social permission. | World Book | Stops setting from becoming wallpaper. |
| Sensory Engine | Treats sensory detail as evidence, warning, comfort, or proof of change. | Prompt Book / World Book | Selects one dominant sense and useful support. |
| Physics/Materials | Gives bodies, objects, magic, and technology constraints and aftermath. | World Book / Prompt Book | Makes impossible settings still playable. |
| Body Engine | Connects anatomy, fatigue, injury, hunger, species, and state to action limits. | Character Book / World Book | Keeps bodies consequential. |
| Psychology | Shows attention, memory, motivation, coping, and learning through behavior. | Character Book / Memory Book | Avoids diagnosis-as-personality. |
| Trait Mechanics | Turns traits into attention, voice, stress response, flaw, virtue, and repair path. | Character Book / User Book | Makes tags generate behavior. |
| Archetype Mechanics | Converts archetypes into scene promise, mask, shadow, and function. | Character Book / Scenario Book | Prevents archetypes becoming costume. |
| Emotion Mechanics | Tracks trigger, appraisal, body cue, impulse, expression, action, and residue. | Memory Book / Character Book | Makes emotion causal and persistent. |
| Relationship Mechanics | Treats bonds as histories with rituals, debts, trust tests, and repair routes. | Memory Book / Scenario Book | Keeps romance and conflict earned. |
| Body Language | Reads observable cues as ambiguous clusters, not proof. | Prompt Book / Character Book | Avoids false mind-reading. |
| Social Systems | Expresses culture, class, institutions, law, work, and economy through interfaces. | World Book | Turns systems into concrete scene pressure. |
| Investigation | Keeps clues source-bound, textured, partial, and actionable. | Scenario Book / Memory Book | Protects secrets and knowledge boundaries. |
| Resource Loops | Tracks food, water, sleep, hygiene, tools, money, time, favors, reputation. | World Book / Memory Book | Gives mundane logistics narrative weight. |

## Scene Type Routing

The source defines scene types as functional pressure shapes. HeartWrite can expose these as Scenario Book modules or internal compiler routes:

- `arrival`: threshold, access, reception, first visible pressure
- `conversation`: subtext, witnesses, distance, interruption, stakes
- `exploration`: clues, blocked routes, hazards, movement cost
- `chase`: changing distance, terrain, breath, partial gains/losses
- `fight`: objective, reach, cover, stamina, wound, terrain, witness
- `care`: need, dignity, privacy, touch boundaries, tools, recovery
- `meal`: appetite, hierarchy, culture, negotiation, surveillance, comfort
- `travel`: route, weather, supplies, fatigue, local signs, delay
- `rest`: lowered guard, shelter, wounds, dreams, watches, shared space
- `ritual`: symbols, witnesses, rules, timing, materials, cost, aftermath
- `aftermath`: residue, cleanup, paperwork, altered distance, new story

These should sit after ScenarioLab's premise/current-situation/route architecture. ScenarioLab decides what the scenario is; Universal Roleplay Engine decides how the active scene behaves once play begins.

## Pressure Factor Routing

The source repeatedly returns to five active pressure families:

### Weather Pressure

Weather should affect:

- visibility
- sound
- smell
- clothing
- travel
- evidence
- shelter
- social permission
- body comfort
- infrastructure

Compile only when weather changes the next move. Do not use rain, snow, fog, heat, or storms as automatic romance or fear.

### Body Pressure

Body pressure should affect:

- stamina
- breath
- heat/cold
- hunger/thirst
- injury
- fatigue
- posture
- speech length
- care needs
- what is physically reachable

For `{{user}}`, describe only established or externally visible body state. Do not assign internal reaction.

### Social Pressure

Social pressure should affect:

- witnesses
- reputation
- public/private boundaries
- status
- overhearing
- gossip
- family/institutional consequences
- whether refusal feels safe
- who is believed

This is especially useful for forbidden attraction, age gap, workplace, university, celebrity, mafia, aristocracy, pack/coven, and small-town routes.

### Object Pressure

Objects should behave as persistent evidence or leverage:

- keys
- letters
- phones
- stains
- weapons
- gifts
- rings
- clothing
- broken locks
- medical tools
- trophies
- documents
- missing items

Object placement matters: in reach, hidden, damaged, in someone's hand, behind glass, near the exit, or already noticed by a witness.

### Space Pressure

Space should affect:

- distance
- privacy
- movement
- sound
- escape
- intimacy
- surveillance
- crowding
- authority
- touch permission

The same relationship beat changes meaning across a hallway, bedroom, public kitchen, locked car, campus party, hospital corridor, courtroom, or storm shelter.

## Sensory Routing

The source is strongest when it treats sensory detail as evidence, not decoration.

HeartWrite should route sensory modules through:

1. source
2. distance
3. intensity
4. reliability
5. body effect
6. species/tool difference
7. action or suspicion it enables

Compiler rule:

- choose one dominant sense
- optionally add one supporting sense
- tie the cue to a cause or possible action
- preserve uncertainty where the cue is ambiguous
- do not overload paragraphs with catalogue vocabulary

Useful sensory families:

- sight: light, contrast, motion, posture, injury, concealment
- hearing: rhythm, silence, echo, breath, machine, footstep, voice strain
- smell: smoke, rain, sweat, perfume, blood, rot, antiseptic, ozone
- taste: salt, metal, smoke, medicine, dust, stale air
- touch: pressure, texture, heat, cold, wetness, vibration, grip
- temperature: fever, chill, wet clothes, cold metal, sunlight, windchill
- pain: warning, strain, injury, fatigue, damage
- proprioception/vestibular: balance, leverage, falling, lifting, spinning
- interoception: hunger, thirst, nausea, heartbeat, fatigue, breath
- social sense: turn-taking, status, shame, flirtation, sincerity, exclusion
- magical/technological sense: signatures with concrete rules

The source contains large vocabulary lists, but many are too broad or stale for direct app seeding. Mine selectively into standard vocabulary banks only when a term is useful, modern, and functionally routed.

## Body, Species, And Physical State Routing

The body engine should not be a static anatomy inventory. It should answer:

- what movement is possible
- what is vulnerable
- what care is needed
- what evidence the body carries
- what clothing/tools/furniture do or fail to do
- how species/body plan changes doors, chairs, weather, senses, touch, food, and social reading
- what consequence persists after the exciting moment

Strong reusable rule:

> Use only the anatomy needed for the current scene and connect it to body state, access, evidence, care, tools, environment, or aftermath.

HeartWrite should treat body logic as:

- Character Book: stable anatomy, presentation, body language habits, species traits
- World Book: species rules, fantasy biology, medical/magic/tech constraints
- Scenario Book: active injury/fatigue/hunger/weather exposure
- Memory Book: persistent wounds, scars, sensory associations, recovery status
- Prompt Book: do not invent `{{user}}` pain response, desire, arousal, or voluntary action

## Psychology And Trait Routing

The psychology sections reinforce an existing HeartWrite principle: psychology should operate through behavior.

A good character trait changes:

- what the character notices
- what they avoid
- how directly they speak
- how they handle silence
- how they ask for care
- how they apologize
- what they misunderstand
- what they protect when rushed
- how they repair or refuse repair
- what they repeat under stress

Recommended generated Character/User Book fields:

- attention bias
- learned prediction
- core need
- core fear
- stress fracture
- coping behavior
- shame response
- anger style
- intimacy distance
- repair path
- contradiction
- repeated mistake
- growth pressure

Avoid:

- using diagnosis as personality
- using trope labels as behavior
- assigning `{{user}}` mental health, motive, emotion, or intent
- making distress an erotic shortcut

## Emotion, Body Language, And Relationship Routing

Emotion should be compiled as a process:

1. trigger
2. appraisal
3. body cue
4. attention bias
5. impulse
6. chosen action
7. social meaning
8. residue

Body language should be compiled as ambiguous clusters, not proof:

- cue
- physical context
- possible meanings
- reliability
- culture/species/neurotype/disability variation
- relationship context
- action it makes possible

Relationship mechanics should be compiled as history in motion:

- recurring evidence
- remembered harm
- private language
- unmet need
- debt
- trust test
- permission
- forbidden move
- repair route
- power shift
- social fallout

This is important for romance because attraction, trust, jealousy, resentment, comfort, longing, possessiveness, protectiveness, shame, and surrender all need different behavioral outputs depending on consent context and relationship history.

## Social, Institution, And Resource Routing

The social-system sections are especially useful for World Book and Scenario Book.

World Book should model systems through:

- titles
- prices
- wages
- paperwork
- schedules
- uniforms
- doors
- transport
- food
- housing
- tools
- gossip
- favors
- inspections
- sanctions
- services
- unequal access

Scenario Book should import only the immediate social consequence:

- who can interrupt
- who controls the door
- who is believed
- who can refuse safely
- who has privacy
- who pays the visible cost
- what institution notices
- what rumor or record might travel

Memory Book stores the result:

- public story
- official record
- bill/debt
- rumor
- family call
- missed appointment
- damaged reputation
- changed access

## Knowledge, Secrets, And Investigation Routing

The source aligns cleanly with the existing Memory Book model.

Secrets need:

- who knows
- who suspects
- who benefits
- who is hiding
- who pretends not to know
- what evidence exists
- what false reading is plausible
- what changes when revealed

Clues need:

- location
- access condition
- sensory form
- interpretation path
- uncertainty
- possible false lead
- action opened by discovery

Runtime rule:

- Characters know only what they observed, inferred, were told, remembered, sensed, or could reasonably deduce.
- Hidden facts stay hidden until evidence appears.
- Suspicion can change behavior before proof.
- Revelation needs aftermath.

## UI Implications

This source suggests the Prompt Book and Scenario Book UI should eventually support:

- active scene type selector
- visible field editor
- pressure factor toggles
- weather/biome active slice selector
- dominant sense selector
- body state chips
- social pressure chips
- object/evidence tracker
- space/blocking editor
- active institution/faction pressure
- relationship residue tracker
- aftermath-to-memory capture
- clue/secret knowledge boundary editor

For V1, the most useful additions are:

1. Active Scene Type
2. Visible Field
3. Active Pressures
4. Blocking / Distance
5. Dominant Sensory Cue
6. Consequence / Aftermath
7. Knowledge Boundary

## Suggested Compile Slots

### Universal Runtime Law

Use in Prompt Book:

```text
Use only the active runtime modules needed for this turn. Preserve {{user}} agency. Ground the reply in the visible field, advance one meaningful pressure, respect knowledge boundaries, carry continuity forward, and end with a playable opening.
```

### Scene Field

Use in Scenario Book:

```text
Current scene type: {{scene_type}}
Visible field: {{visible_field}}
Distance/blocking: {{distance_blocking}}
Active pressures: {{active_pressures}}
Dominant sensory cue: {{dominant_sense}}
Actionable opening: {{playable_handoff}}
```

### Relationship Residue

Use in Memory Book:

```text
Relationship residue: {{recent_emotional_residue}}
Trust/test/debt: {{relationship_currency}}
Unresolved repair: {{repair_needed}}
Known/suspected/hidden: {{knowledge_state}}
```

### World Interface

Use in World Book:

```text
Active world interface: {{weather_biome_institution_resource}}
Concrete effects: {{effects_on_access_body_route_privacy_evidence}}
Aftereffects to preserve: {{world_residue}}
```

## Anti-Patterns To Avoid

- compiling the entire universal engine into every prompt
- treating vocabulary lists as automatically valuable
- letting sensory detail become disconnected prose garnish
- turning weather into instant romance, fear, or confession
- making body language a mind-reading oracle
- making trait labels or diagnoses replace behavior
- making nonhuman traits erase sapience or personhood
- resolving a scene before `{{user}}` can act
- revealing secrets without an evidence path
- using systems/institutions as exposition instead of interfaces
- forgetting mundane aftermath after intense scenes

## Gaps Still Remaining

The source is very broad, but HeartWrite still needs app-specific work in these areas:

- a compact runtime module registry rather than a giant prompt
- user-facing labels that feel fiction-friendly instead of procedural
- a trigger schema for latest-user-move parsing
- a prompt compiler rule for selecting only relevant modules
- a saved visible-field / blocking data shape
- UI for active scene type and pressure selection
- tests that ensure `{{user}}` agency rules survive prompt compilation
- a migration path from current Scenario Book fields into the richer scene-state model
- curated vocabulary import so stale or clunky words do not pollute generation
- connection between generated Prompt Packs and saved StoryBook state
