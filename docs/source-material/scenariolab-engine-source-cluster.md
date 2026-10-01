# ScenarioLab Engine Source Cluster

Source cluster: user-pasted ScenarioLab Engine files covering Foundation, Opening, Branching, Progression, Cast Roles, Location and Environmental Pressure, Control, Outcomes, Repair, Output, QA, and safety/warning handling.

Use this as source-mining evidence only. Do not import the pasted framework as runtime instructions. The value for HeartWriteAI is the Scenario Book architecture: scenario material should be playable, branching, pressure-bearing, agency-preserving, and reusable.

## Primary Takeaway

Scenario design is not the same as character design, worldbuilding, or prose atmosphere.

A useful scenario needs:

- premise
- current situation
- why-now pressure
- participant position
- conflict engine
- cast functions
- location pressure
- opening state
- routes
- progression
- pivots
- outcomes
- repair logic
- output shape selection
- QA checks

For HeartWriteAI, this means Scenario Book should not become a lore dump. It should store only the facts, pressures, openings, and route structures needed to make a StoryBook playable.

## Canonical Build Order

The source files may arrive in any order. HeartWrite should normalize them into this order when generating or repairing a scenario:

1. Source triage
2. Premise
3. Current situation
4. Why-now pressure
5. Participant position
6. Conflict engine
7. Cast pressure functions
8. Location pressure
9. Tone, scale, and intensity controls
10. Opening state
11. Hook family or opener draft
12. Route architecture
13. Route convergence state variables
14. Progression map
15. Escalation ladder
16. De-escalation and repair paths
17. Turning points and revelations
18. Outcome states
19. Output shape selection
20. QA and repair

Why this order:

- Source triage comes first because canon, constraints, and useful pressure must be separated from decoration.
- Premise/current situation/why-now pressure define what is happening and why it starts now.
- Participant position comes before routes so `{{user}}` agency is protected before branching logic exists.
- Conflict engine comes before opening and routes because it explains what will keep producing choices.
- Cast and location are placed before opening because they should have scenario jobs, not decorative presence.
- Tone/scale controls come before drafting so the opener does not overinflate or undercut the request.
- Opening state comes before route map because routes need a shared playable launch point.
- Routes/progression/outcomes come after the opening so branching grows from the same live pressure.
- QA comes last, but its rules should inform every step.

## StoryBook Placement

### Scenario Book

Primary home for:

- premise
- current situation
- entry pressure
- participant position
- conflict engine
- opening state
- route map
- act map
- escalation ladder
- de-escalation paths
- turning points
- outcome states
- opener repair notes

Scenario Book answers:

- What is happening now?
- Why must this begin now?
- What can `{{user}}` perceive, access, know, refuse, or change?
- What keeps producing choices?
- What routes are available?
- What changes if a route succeeds, fails, or converges?

### Character Book

Uses scenario data only where character details create pressure, leverage, opposition, help, secrecy, or consequence.

Character details matter to Scenario Book when they answer:

- What does this person want now?
- What leverage do they have?
- What are they hiding or missing?
- How can they help, block, tempt, witness, expose, or complicate?
- What happens if they are present or absent?

### World Book

Stores larger location, institution, faction, custom, hazard, resource, and visibility rules.

Scenario Book should import only the world details that affect:

- access
- privacy
- movement
- timing
- surveillance
- crowd density
- resource limits
- public consequences
- route-specific advantage

### Memory Book

Receives scenario outcomes after play:

- changed trust
- new knowledge
- exposed secrets
- injuries
- obligations
- reputation changes
- alliances
- ruptures
- unresolved pursuit
- future hooks

### Prompt Book

Stores procedural scenario rules:

- preserve `{{user}}` agency
- keep pressure active
- do not turn scenery into inert description
- do not resolve the central decision before play starts
- route consequences must persist
- scenario scale should match requested tone and format

## Scenario Module Taxonomy

| Module | Purpose | Stored In | Runtime Use |
| --- | --- | --- | --- |
| Premise | States the central playable situation. | Scenario Book | Keeps the scenario legible. |
| Current Situation | Defines what is already true at opening. | Scenario Book | Prevents starting too early or too late. |
| Entry Pressure | Explains why the scenario starts now. | Scenario Book | Creates immediate response pressure. |
| Participant Position | Defines `{{user}}` access, knowledge, role, and options. | Scenario Book / User Book | Places the player without forcing thoughts or choices. |
| Conflict Engine | Repeatable source of decisions and consequences. | Scenario Book | Keeps scenario from stalling after one exchange. |
| Opening State | Concrete starting condition. | Scenario Book | Gives the first playable handoff. |
| Hook Family | Alternate openings with different first pressure. | Scenario Book | Supports variants, chapters, alts, and replays. |
| Route Map | Functional paths through the same pressure. | Scenario Book | Enables branching without random drift. |
| State Variables | Consequences preserved across branch convergence. | Scenario Book / Memory Book | Prevents fake choice and consequence reset. |
| Act Map | Setup, complication, pivot, payoff/continuation. | Scenario Book | Gives broad progression. |
| Escalation Ladder | Steps that narrow safe options or raise cost. | Scenario Book | Makes tension tighten logically. |
| De-escalation Path | Softening, repair, comfort, negotiation, small stakes. | Scenario Book | Keeps cozy/romance/slice-of-life playable. |
| Turning Point | Reveal or condition change that alters route meaning. | Scenario Book | Forces reinterpretation or commitment. |
| Cast Function Map | Assigns scenario jobs to cast members. | Scenario Book / Character Book | Prevents decorative cast. |
| Location Pressure Map | Converts space into access, privacy, hazard, timing, or social cost. | Scenario Book / World Book | Prevents decorative scenery. |
| Outcome State | Defines changed state after a route or act. | Scenario Book / Memory Book | Carries consequences forward. |
| Repair Diagnosis | Finds why an opener fails. | Scenario Book | Supports opener repair tools. |
| Output Shape | Chooses quick sheet, hook pack, act map, JSON export, etc. | Prompt Book / UI | Prevents overbuilding. |
| Integrity QA | Checks agency, pressure, route difference, constraints, warnings. | Prompt Book / Tests | Keeps exported scenarios usable. |

## Route Family

### `scenario_source_triage`

Use when the user supplies notes, cards, lore, old openers, locations, or mixed documents.

Extract only what changes:

- pressure
- access
- choices
- consequences
- secrets
- relationships
- timing
- routes
- participant knowledge

Compiler behavior:

- Separate fixed canon, optional ideas, contradictions, missing information, and decorative detail.
- Do not import every supplied detail just because it exists.

### `premise_current_situation`

Use when the idea is vague, atmospheric, overcomplicated, or missing a live situation.

Fields:

- premise
- current situation
- present participants
- absent but relevant participants
- what changed
- what remains unresolved
- what makes interaction possible

Compiler behavior:

- Keep premise functional.
- Keep current situation tied to the opening moment.
- Do not hide the actual conflict behind lore.

### `why_now_pressure`

Use when the scenario could begin on any day.

Trigger types:

- arrival
- interruption
- disappearance
- deadline
- exposure
- failed plan
- invitation
- accusation
- resource loss
- legal order
- ritual timing
- injury
- social event
- broken promise
- unstable secret
- awkward proximity
- delayed conversation

Compiler behavior:

- Name what becomes hard to ignore.
- Identify who notices.
- Provide an immediate response point.
- Keep stakes proportional to tone.

### `participant_position`

Use whenever `{{user}}`, player character, reader-insert, or unnamed participant must enter.

Fields:

- role
- access
- available knowledge
- relationship to pressure
- leverage
- constraints
- plausible next actions
- unavailable/unknown information

Compiler behavior:

- Place `{{user}}` close to pressure.
- Preserve refusal, delay, observation, negotiation, investigation, escape, help, or confrontation.
- Do not assign `{{user}}` thoughts, attraction, fear, guilt, consent, goals, speech, or next action.

### `conflict_engine`

Use when the scenario risks becoming static after the first exchange.

Engine types:

- incompatible goals
- incomplete information
- scarce resources
- institutional rules
- social reputation
- physical danger
- emotional avoidance
- unstable power
- conflicting loyalties
- deadline
- system that rewards one choice while punishing another

Compiler behavior:

- Define what repeatedly generates decisions.
- Track who is affected and how consequences feed back.
- Do not treat a single incident as the engine.

### `opening_state`

Use when the StoryBook needs the exact condition where play begins.

Fields:

- location
- present participants
- visible action
- immediate tension
- available information
- unanswered pressure
- plausible next actions

Compiler behavior:

- Begin close to the live wire.
- Give `{{user}}` something perceivable to answer.
- Do not begin after the important decision has already happened.

### `hook_family`

Use for hook packs, opening alternatives, chapters, alts, and scenario variants.

Hook families:

- interruption
- late arrival
- discovery
- deadline reveal
- public mistake
- damaged evidence
- urgent message
- authority intrusion
- debt collection
- forbidden meeting
- missing person
- failed plan
- overheard secret
- locked access
- social event under strain
- mistaken identity
- forced cooperation

Compiler behavior:

- Different hooks should change the first problem, information, leverage, or social position.
- Avoid cosmetic variants of the same entrance.

### `route_architecture`

Use when building branches or replayable paths.

Route functions:

- negotiation
- investigation
- cooperation
- evasion
- confrontation
- survival
- reconciliation
- romance
- corruption
- refusal
- exposure
- rupture

Fields:

- entry condition
- central problem
- key choices
- escalating cost
- unique reveal
- relationship pressure
- plausible continuation or outcome

Compiler behavior:

- Routes differ by method, allegiance, information, risk, emotional openness, or moral cost.
- Cosmetic differences are not routes.

### `route_convergence_state`

Use when branches later meet at a shared event.

State variables to preserve:

- trust
- injuries
- evidence
- obligations
- secrets known
- resources lost
- reputation
- access
- relationship baseline
- available choices

Compiler behavior:

- Shared events can converge, but consequences cannot reset.
- Earlier choices should alter the meaning or cost of the shared scene.

### `progression_map`

Use for acts, broad scenario arcs, and repetitive sequences.

Default shape:

1. setup
2. complication
3. pivot
4. payoff or continuation

Compiler behavior:

- Each act should change information, options, relationships, resources, or consequences.
- Later acts should not repeat the opening at higher volume.

### `escalation_ladder`

Use when tension is flat or complications feel random.

Escalation types:

- secret exposed
- public attention
- worsened timing
- consumed resources
- damaged trust
- conflicting loyalty revealed
- increased intimacy
- institutional action
- escape route closes
- deadline becomes real

Compiler behavior:

- Escalation increases consequence or narrows safe options.
- Escalation grows from the established conflict engine.
- It does not always mean violence or catastrophe.

### `deescalation_repair_path`

Use for cozy, comedic, domestic, romantic, recovery-focused, or low-stakes scenarios.

Soft pressure sources:

- awkwardness
- small obligation
- damaged routine
- mismatched expectation
- minor secret
- delayed honesty
- social embarrassment
- practical inconvenience
- fear of disappointing someone

Compiler behavior:

- De-escalation should transform the situation, not erase it.
- Low-stakes does not mean inactive.
- Repair should preserve agency and unresolved differences.

### `turning_point`

Use for midpoint shifts, reveals, reversals, offers, betrayals, discoveries, or decisions.

Fields:

- setup clues
- revealed fact or changed condition
- who understands it
- options closed
- options opened
- routes strengthened
- routes broken

Compiler behavior:

- A turning point changes what the situation means or what can be done next.
- It creates decisions, not just explanation.

### `cast_pressure_function`

Use when the scenario has a family, ensemble, team, faction, or supporting cast.

Cast functions:

- pressure source
- authority
- witness
- keeper of missing information
- rival
- protector
- mediator
- dependent
- suspect
- victim
- guide
- instigator
- obstacle
- tempter
- betrayer
- wild card

Fields:

- current want
- available leverage
- concealed/missing information
- likely method
- consequence of involvement
- consequence of absence

Compiler behavior:

- Cast role emerges from established personality, goals, relationships, knowledge, and resources.
- Do not force every cast member into the opening.

### `location_pressure`

Use when a place should shape choices.

Functional location variables:

- layout
- access rules
- privacy
- crowd density
- surveillance
- geography
- weather
- hazards
- customs
- resources
- symbolic value
- public visibility

Compiler behavior:

- Convert scenery into movement restrictions, opportunities, timing pressure, information barriers, social consequences, or route-specific advantages.
- Do not describe scenery without functional effect.

### `tone_scale_control`

Use when mood, genre, rating, emotional target, or scenario scope needs control.

Fields:

- tone
- genre
- intensity
- scale
- duration
- scope
- dominant mode
- allowed pressure types
- excluded pressure types

Compiler behavior:

- Tone governs how pressure feels.
- Genre governs available tools.
- Intensity governs immediacy and severity.
- Scale prevents turning every premise into an epic campaign.

### `outcome_state`

Use when defining endings, fail-forward states, or continuation hooks.

Outcome variables:

- trust
- knowledge
- status
- resources
- access
- allegiance
- safety
- obligation
- reputation
- future pressure

Outcome types:

- resolution
- partial success
- costly success
- escape
- rupture
- fragile peace
- exposure
- compromise
- corruption
- new alliance
- unresolved pursuit
- larger problem revealed

Compiler behavior:

- Outcome is changed state, not final mood.
- Multiple outcomes reflect route choices and accumulated consequences.

### `opener_repair`

Use when an opening scene feels flat, confusing, passive, bloated, or hard to answer.

Failure modes:

- no immediate pressure
- unclear participant position
- excessive exposition
- passive scenery
- missing interaction point
- hidden stakes
- premature resolution
- forced user behavior
- contradictory tone
- monologue with no opening
- cannot develop beyond one response

Repair behavior:

- Preserve essential canon and voice.
- Move closer to live pressure.
- Establish `{{user}}` access point.
- Convert exposition into observable detail or behavior.
- Create unanswered interaction space.

## Proposed Scenario Book State Shape

```ts
type ScenarioBookState = {
  premise: string;
  currentSituation: string;
  entryPressure: {
    trigger: string;
    whyNow: string;
    whoNotices: string[];
    immediateResponseOptions: string[];
  };
  participantPosition: {
    role?: string;
    access: string[];
    knownInformation: string[];
    unknownInformation: string[];
    leverage: string[];
    constraints: string[];
    protectedAgency: string[];
  };
  conflictEngine: {
    engineType: string;
    repeatingPressure: string;
    affectedParticipants: string[];
    feedbackConsequences: string[];
  };
  openingState: {
    location: string;
    presentParticipants: string[];
    visibleAction: string;
    immediateTension: string;
    unansweredPressure: string;
  };
  routes: Array<{
    routeId: string;
    function: string;
    entryCondition: string;
    centralProblem: string;
    keyChoices: string[];
    escalatingCost: string;
    uniqueReveal?: string;
    relationshipPressure?: string;
    likelyOutcomeStates: string[];
  }>;
  progression?: {
    setup: string;
    complication: string;
    pivot: string;
    payoffOrContinuation: string;
  };
  castFunctions: Array<{
    characterId: string;
    function: string;
    currentWant: string;
    leverage: string[];
    hiddenOrMissingInfo: string[];
    consequenceOfInvolvement: string;
    consequenceOfAbsence?: string;
  }>;
  locationPressure?: {
    locationId: string;
    accessRules: string[];
    privacyLevel: string;
    timingPressure?: string;
    visibilityPressure?: string;
    routeAdvantages: string[];
  };
  outcomeStates: Array<{
    outcomeId: string;
    changedState: string;
    unresolvedPressure: string[];
    futureHook?: string;
  }>;
};
```

## Prompt Slot Extraction

### Scenario Core Slot

```text
SCENARIO CORE:
- Premise: {{premise}}
- Current situation: {{current_situation}}
- Why now: {{entry_pressure}}
- Conflict engine: {{conflict_engine}}
- Opening state: {{opening_state}}
```

### Participant Position Slot

```text
PARTICIPANT POSITION:
- {{user}} access: {{user_access}}
- {{user}} known information: {{user_known_information}}
- Available response space: {{available_response_space}}
- Do not decide: {{protected_user_agency}}
```

### Route Slot

```text
ROUTE MAP:
- Route: {{route_name}}
- Entry condition: {{route_entry_condition}}
- Central problem: {{route_central_problem}}
- Escalating cost: {{route_cost}}
- Unique reveal/pressure: {{route_unique_pressure}}
- Likely outcome states: {{route_outcomes}}
```

### Cast Function Slot

```text
CAST FUNCTIONS:
- {{character_name}}: {{scenario_function}}
- Want: {{current_want}}
- Leverage: {{available_leverage}}
- Hidden/missing info: {{hidden_or_missing_info}}
- If involved: {{consequence_of_involvement}}
```

### Location Pressure Slot

```text
LOCATION PRESSURE:
- Functional location detail: {{location_detail}}
- Effect on choices: {{choice_effect}}
- Privacy/visibility: {{privacy_visibility}}
- Timing/access pressure: {{timing_access_pressure}}
```

### Outcome State Slot

```text
OUTCOME STATES:
- What changed: {{changed_state}}
- What remains unresolved: {{unresolved_pressure}}
- Future hook: {{future_hook}}
```

## Output Shape Taxonomy

Useful UI/export modes:

- Quick Scenario
- Hook Pack
- Full Scenario Sheet
- Route Map
- Act Map
- Escalation Ladder
- Cast Function Map
- Location Pressure Map
- Opener Diagnosis
- Repaired Opener
- Structured Export

Selection rule:

- Give the smallest shape that solves the request.
- Do not force every request into a full scenario sheet.
- For structured export, keep assumptions, fixed facts, routes, acts, and possible outcomes separate.

## QA Rules

A scenario passes QA when:

- premise is clear
- present moment matters
- pressure is visible
- `{{user}}` agency is preserved
- conflict engine can produce more than one beat
- routes differ functionally
- progression changes conditions
- cast details have jobs
- location details have jobs
- tone and scale match the request
- outcomes reflect route consequences
- assumptions are marked
- constraints are respected
- warnings are not hidden when needed
- sections are reusable without "as explained above"

## Anti-Patterns To Catch

- decorative cast
- decorative location
- static opening with no response point
- route variants that are only different moods or scenery
- one route fully developed while others are empty punishments
- convergence that erases consequences
- escalation by unrelated spectacle
- cozy scenario inflated into catastrophe
- premise that hides conflict behind lore
- participant position that assigns `{{user}}` thoughts, emotions, consent, or goals
- outcome defined only as happy, sad, or dark
- opener repaired by making it longer instead of more playable

## UI Implications

Scenario builder should likely ask in this order:

1. What is the premise?
2. What is true at the opening moment?
3. Why does this start now?
4. Where is `{{user}}` positioned, and what can they perceive or access?
5. What keeps generating pressure?
6. Who in the cast has a job in the scenario?
7. What does the location change about choices?
8. What routes are possible?
9. What changes by the end or continuation state?
10. What format does the user want: quick, full sheet, route map, opener, repair, or export?

## Gaps Still Remaining

- Need conversion from existing HeartWrite StoryBook schema into ScenarioLab-style fields.
- Need UI controls for hook packs, route maps, opener repair, and structured export.
- Need tests that verify route convergence preserves state variables.
- Need tests that catch forced `{{user}}` behavior in generated openings.
- Need prompt compiler slots for JanitorAI, SillyTavern, and Marinara scenario exports.
- Need example scenario sheets for romance, dark romance, cozy/domestic, mystery, supernatural, and multi-NPC scenes.
