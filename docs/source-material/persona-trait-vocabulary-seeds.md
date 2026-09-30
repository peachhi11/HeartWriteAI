# Persona Trait Vocabulary Seeds

This is the light-touch trait bank: the useful everyday stuff that keeps characters from becoming trauma diagrams, kink bundles, or trope labels with shoes.

Use it for persona truth, trait contradiction, normal human behavior, user-player style, romcom warmth, friendship texture, and non-dark relationship grounding. It is source material, not a runtime prompt.

## Source Shape

The source maps simple trait words to playable behavior:

- what the trait makes a character do
- what pressure exposes the trait
- where the trait becomes a contradiction
- what the trait protects
- what would make the character choose differently

This is valuable because it turns adjectives into behavior. `Patient` is flat by itself. It becomes playable when the StoryBook knows what patience costs, when silence stops being kind, and when waiting lets someone else pay the price.

## Core Trait Families

### Social Warmth And Approach

Seeds:

- nice
- kind
- lovely
- friendly
- outgoing
- shy
- polite
- unfriendly
- rude

Routing use:

- User Book: default approach style, social hesitation, warmth, courtesy mask
- Character Book: public presentation, trust threshold, conflict softness
- Scenario Book: first meeting, public behavior, awkward repair, group dynamics
- Prompt Book: keep warmth behavioral rather than generic

Compiler cues:

- Does the character initiate contact or wait to be invited?
- Does politeness mean respect, distance, fear, class training, or control?
- Does friendliness arrive before trust, after trust, or instead of vulnerability?
- Does shyness disappear once a shared topic gives them footing?

### Humor, Play, And Emotional Deflection

Seeds:

- silly
- funny
- boring
- cute
- serious

Routing use:

- Speech Profile: joke timing, dry delivery, absurdity, restraint, play refusal
- Relationship Memory: private jokes, old failed jokes, comfort routines
- Prompt Book: romcom banter, tension release, deflection detection

Compiler cues:

- Does humor invite closeness or dodge confession?
- Does seriousness protect responsibility or block play?
- Does "boring" mean steady, safe, overlooked, domestic, loyal, or emotionally under-read?
- Does cuteness create charm, underestimation, or frustration when anger needs to land?

### Work, Effort, And Time

Seeds:

- hardworking
- lazy
- punctual
- busy
- successful
- patient

Routing use:

- Character Psychology: self-worth through output, avoidance, endurance, ambition
- Scenario Book: missed dates, overwork, waiting, schedule pressure
- Relationship Memory: repeated reliability, repeated absence, resentment loops

Compiler cues:

- What does the character believe effort proves?
- Does busyness protect purpose or prevent self-awareness?
- Does patience become generosity, avoidance, fear, or self-erasure?
- What kind of lateness or neglect feels personal to them?

### Courage, Risk, And Pressure Response

Seeds:

- brave
- cowardly
- confident
- nervous
- lucky
- fit
- clumsy

Routing use:

- UserMoveTrigger: approach, hesitation, withdrawal, stumble, visible anxiety
- Character Book: action threshold, fear visibility, physical confidence
- Scenario Book: crisis behavior, physical staging, risk-taking, embarrassment

Compiler cues:

- What fear is still visible when they act bravely?
- What cost makes them retreat?
- Does confidence read as certainty, performance, seduction, arrogance, or steadiness?
- Does nervousness make them perceptive, prepared, frozen, or over-controlling?
- Does physical competence hide exhaustion or create pressure to always endure?

### Power, Morality, And Self-Interest

Seeds:

- honest
- heartless
- ruthless
- spiteful
- evil
- powerful
- selfish
- stubborn
- immature

Routing use:

- Character Psychology: moral code, self-justification, harm threshold, pride
- Relationship Memory: betrayals, tests, vengeance, refused apologies
- Prompt Book: damaged-character logic, dark romance pressure, redemption arcs

Compiler cues:

- What harm do they allow, and what line will they still not cross?
- Does honesty cost them something, or is it just bluntness with better branding?
- Does selfishness make them cruel, clear, hungry, honest, or self-protective?
- What principle deserves stubborn loyalty, and what belief is only pride wearing armor?
- Treat `evil` as a judgment that must be decomposed into chosen harm, motive, method, and limit.

## Persona Field Uses

### Character Book

Useful fields:

- Personality
- Psychology
- Cognition
- Behaviour
- Speech Profile
- Relationships

Trait seeds should compile into action habits, not summary adjectives.

Good shape:

- `patient_until_silence_costs_someone_else`
- `funny_when_cornered`
- `kind_in_specific_practical_ways`
- `selfish_but_clear_about_want`
- `ruthless_until_the_cost_is_someone_they_love`

Weak shape:

- patient
- funny
- kind
- selfish
- ruthless

### User Book

Useful fields:

- player-facing persona identity
- social style
- conflict style
- vulnerability style
- attraction response
- impersonation assist palette

These seeds are good for lighter user-player options because they do not overfit to trauma, kink, or dark-romance pressure.

Examples:

- shy but bold once a shared interest gives them footing
- polite as a way to keep control of the room
- friendly before trust has fully formed
- patient until their silence lets someone else pay the cost
- nervous but observant under pressure

### Prompt Compiler

Use trait seeds as a three-part route:

```ts
traitTruth =
  traitLabel
  + protectedNeed
  + failurePressure
  + changedChoiceCondition
```

The compiler should prefer behavioral phrasing:

- "keeps interactions pleasant until honesty becomes the kinder act"
- "turns vulnerability into a joke before anyone can answer it seriously"
- "shows up after enthusiasm fades, then mistakes exhaustion for proof of love"
- "waits with real grace until waiting becomes complicity"

## Gaps Filled

This source helps fill:

- everyday character trait vocabulary
- lighter persona generation
- secure or semi-secure personality texture
- non-kink social behavior
- contradiction-based character construction
- user persona variety
- practical trait-to-behavior conversion

It partially balances the archive's heavier emphasis on dark romance, kink, coercive pressure, shame, jealousy, and wounded attachment.

## Remaining Gaps

Still needed:

- domestic intimacy vocabulary
- established-couple comfort
- light romcom banter
- gentle sensuality and vanilla heat
- secure attachment in action
- friendship-to-love warmth
- healthy conflict repair without therapy language
- practical affection: food, errands, care, rest, home, routine, chosen reliability
