# HeartWriteAI Implementation Plan

HeartWriteAI is the Next.js + Tailwind + shadcn + Tauri rebuild of CharacterGen. The app should become a local-first studio for CCV3 character cards, editable personas, lorebooks, scenario arcs, and eventually chat runtime compilation.

## Current Checkpoint

The app has moved beyond the initial scaffold into an integrated local runtime
prototype. The current branch includes:

- Scenario/persona/lorebook generation surfaces with editable prompt previews
  and schema/debug copy actions.
- Chat runtime UI with lore diagnostics, relationship state, interaction intent
  modal support, response regeneration, and swiped-variant navigation.
- Context guard work for trimming oversized histories while preserving protected
  milestone memory anchors.
- Milestone memory anchoring for important long-running story beats.
- Diagnostics/status node behavior for lore/sync-style states without
  conflating unrelated runtime errors with lorebook faults.
- Global copy affordances for ordinary text inputs/textareas, while excluding
  passwords, file inputs, sliders, date/color controls, disabled fields, and
  explicit `data-no-field-copy` opt-outs.
- Seed vocabulary ingestion fixes for skinny/thin body-line semantics and wavy
  hair wording.
- Build/test/QC coverage through lint, Node tests, Next build, Cargo tests, and
  debug Tauri app bundling.

The concise product roadmap now lives in [`ROADMAP.md`](ROADMAP.md). This file
remains the detailed engineering plan and rationale.

## Scope Reset

CharacterGen is now treated as a concept and reference archive, not as code to move wholesale.

The build target is:

- Next.js App Router for screens, stateful editors, and browser-compatible import/export fallbacks.
- Tailwind CSS v4 and shadcn-style primitives for the user-facing interface.
- Tauri v2 for desktop-only file dialogs, local library scanning, SQLite/cache work, asset IO, and packaged app distribution.
- TypeScript for normalized card models, schema validation, prompt/runtime assembly, and UI logic.
- Rust for native file, PNG/CHARX, cache, and filesystem-heavy commands.

Python/PyQt CharacterGen modules should be ported only as distilled behavior, schemas, test cases, prompt maps, or product workflows. Do not copy recovered Python UI code, old migrations, raw PDFs, or prompt source dumps into the app unless they have been deliberately converted into HeartWriteAI docs, fixtures, or implementation tasks.

## Phase 1: Stable Scaffold and Docs Checkpoint

Goal: establish a clean, reproducible base before porting major CharacterGen behavior.

- Keep the current Next.js App Router, Tailwind v4, shadcn/ui, and Tauri v2 scaffold as the primary app foundation.
- Keep README focused on setup, current status, and next milestone.
- Keep this plan as the roadmap for implementation order and handoff.
- Keep updater work parked in [`docs/auto-update-security.md`](docs/auto-update-security.md) until real signing and release infrastructure exists.
- Before committing this checkpoint, verify:
  - `npm run lint`
  - `npm run build`
  - `npm run tauri:build`

Exit criteria:

- README and PLAN are current.
- The app builds as a static frontend for Tauri.
- The desktop shell can be bundled locally.

Status: complete for the scaffold baseline. Continue updating docs as features
graduate from prototype to committed runtime surfaces.

## Phase 2: CCV3 PNG Import/Export Codec

Goal: make HeartWriteAI capable of reading and writing character-card metadata across browser and desktop runtimes, with PNG plus embedded CCV3 metadata as the primary card format. CHARX and JSON remain bundle/archive/debug infrastructure rather than first-class card formats.

- Add a small app-native character-card codec layer using:
  - `png-chunks-extract`
  - `png-chunks-encode`
  - `png-chunk-text`
- Read PNG `tEXt` chunks and prefer `ccv3` metadata when present.
- Fall back to `chara` metadata for V1/V2 imports and conversion checks.
- Accept raw JSON and base64-encoded JSON metadata.
- Support browser drag/drop and file-picker imports without requiring Tauri APIs.
- Support desktop native dialogs and desktop drag/drop when Tauri APIs are available.
- Write exported PNGs with embedded `ccv3` metadata.
- Support CHARX import/export for bundled/archive packages that need adjacent assets.
- Import CHARX through a safe archive pipeline: reject encrypted zips, reject path traversal, require root `card.json`, cap file count and decompressed size, allowlist asset MIME types, and preserve the original package as a backup/export artifact.
- Store accepted desktop CHARX imports under Tauri app data as `characters/{character_id}/card.json`, `original.charx`, copied `assets/`, and local `meta.json`.
- Use Rust/Tauri commands for local CHARX reads, zip validation, asset copying, SQLite writes, and searchable-field indexing; keep the Next.js side focused on preview, confirmation, library browsing, and publish/sync actions.
- Treat local CHARX validation as sufficient for private desktop library use, but require repeated server-side validation before any publish/sync/public listing path.
- Keep JSON visible as export/debug infrastructure, not the main editing UI.
- Do not maintain a HeartWriteAI-only `.hwcard` card format.
- Add focused tests for:
  - PNG with `ccv3`
  - PNG with only `chara`
  - PNG with no supported card metadata
  - write/read round trip

Exit criteria:

- A dragged-in character PNG can be parsed into app data.
- A generated or edited CCV3 card can be embedded back into a PNG.
- Browser mode downloads exported JSON/PNG safely, while desktop mode can use native save dialogs.
- Desktop mode can save CCV3 PNG cards as the primary portable artifact and
  use CHARX only when a bundle/archive package is needed.

Reference signals:

- Use old `character_app/png_metadata_engine.py` only as historical context. HeartWriteAI should keep the current spec-aware PNG codec as the source of truth.
- Use old `card_format_conversion.py` as a list of conversion cases to test, not as the target V3 shape.

## Phase 2.5: CharacterGen Reference Port Map

Goal: turn the old CharacterGen archive into an explicit migration map so the project does not drift or accidentally re-import the old stack.

- Create and maintain `docs/charactergen-reference-port-map.md`.
- Map each old module family to its HeartWriteAI destination:
  - card codecs and schemas
  - local library/cache
  - prompt templates and reference bundles
  - lorebook assets and lore activation
  - trope/route engines
  - chat context compiler
  - runtime state/session saves
  - UI workflows
- Mark each source as one of:
  - port now
  - distill later
  - reference only
  - quarantine
- Prefer extracting tests, data shapes, and product rules over copying implementation.
- Keep explicit/source-heavy material behind distillation and prompt-validation boundaries.

Exit criteria:

- There is a readable porting map from old CharacterGen concepts to new HeartWriteAI modules.
- The roadmap names which CharacterGen ideas are in scope for the Next.js/Tailwind/Tauri rebuild.
- Accidental source drops remain ignored and out of app commits.

## Phase 3: Character Intake Hub

Goal: make the character page the first creation point.

- Treat the first page as the raw intake hub: paste messy notes, scraped text, or imported card data.
- Import existing CharacterGen prompt templates as structured prompt packs only after they are reviewed, deduplicated, and rewritten into user-facing language.
- Route intake into editable output groups:
  - character card
  - persona
  - scenario
  - world/character/persona/scenario lorebooks
- Keep all generated outputs editable through normal fields, not raw JSON.
- Preserve CCV3 as the main new-card format.
- Treat V1/V2 as import/convert/sanity-check paths.
- Add dirty-state protection before switching cards or clearing fields.

Exit criteria:

- A user can paste raw notes and receive editable structured outputs.
- The user can adjust any generated field before export.
- The intake hub can suggest likely tags, route/trope metadata, and lorebook candidates without exposing raw taxonomy noise.

## Phase 4: Editable Lorebook, Persona, and Scenario Assets

Goal: preserve generated content as user-facing assets, not hidden one-shot generation output.

Current status: partially implemented. Persona, scenario, lorebook, and runtime
bundle generation surfaces exist with editable previews/import-export flows; the
remaining work is deeper attachment management, deletion flows, and active
lorebook visibility across every runtime surface.

- Add editable lorebook output as nested entries with user-facing fields:
  - name
  - keys/triggers
  - content
  - priority
  - probability
  - gates/tags when implemented
- Support world, character, persona, scenario, and arc lorebook scopes.
- Attach and detach lorebooks from characters, personas, worlds, and scenarios.
- Show which lorebooks are active and whether each active book is direct or inherited.
- Add delete-with-confirmation for unwanted saved assets.
- Feed trope/scenario selections into scenario and arc lorebooks rather than permanently bloating character cards.
- Rebuild the useful parts of CharacterGen `lorebook_context.py` and `lorebook_assets.py` as TypeScript/Rust-friendly concepts:
  - trigger keys
  - priorities
  - probabilities
  - output channels
  - recursion prevention
  - owner attachments
  - active/inherited visibility

Exit criteria:

- Lorebooks can be saved, loaded, attached, detached, edited, and deleted.
- Active lorebook state is visible and understandable.
- Triggered lore can be previewed before it enters chat context.

## Phase 4.5: Tag, Trope, and Route Suggestion Engine

Goal: replace raw technical filters with a friendly suggestion layer inspired by CharacterGen's trope catalogs and the Janitor-style tag ecosystem.

- Build a local suggestion engine for card tags, AU tags, role tags, POV tags, and route/trope tags.
- Use CharacterGen `trope_engine_catalog.py` and `engine_state_card_tropes/` as source taxonomy references, then normalize into readable HeartWriteAI labels.
- Keep tags searchable by aliases such as Dom, Domme, Sub, switch, FemPOV, MalePOV, AnyPOV, enemies to lovers, omegaverse, rockstar AU, esports AU, college AU, mafia AU, and royal AU.
- Add a ForceBary-style action that can suggest tags from card text, scenario, first message, lorebook entries, and creator notes.
- Show suggestions as user-reviewable chips, never as silent hidden metadata.
- Keep emotion/feeling/body-cue analysis hidden inside the suggestion engine. Users should choose or confirm plain route tags such as `angsty`, `slow burn`, `hurt/comfort`, `cozy romance`, or `dark romance`; the internal matrix should only decide which engine/prompt support those tags activate.
- Present route selection as a simple story-engine dropdown/typeahead and optional tag chips, not as emotion matrices, classifier payloads, model labels, or prompt-routing internals.
- Keep safety/content-policy tags separate from romance discovery tags so the UI can explain what each tag is for.

Exit criteria:

- Users can ask the app to suggest tags for imported or generated cards.
- Suggested tags explain themselves in friendly language.
- Tags populate the library filters and exported metadata only after user confirmation.
- The user-facing surface exposes the chosen tag/engine label, while hidden compiler logic handles the detailed emotion, feeling, body-signal, and prose-routing rules.

## Phase 5: Tauri Local Library and File Bridge

Goal: support real local libraries rather than one-file browser demos.

- Add Tauri commands for native open/save dialogs and safe local file reads/writes.
- Add a local folder intake reviewer for mixed card folders containing PNG/APNG, JSON, CHARX, and stray image files.
- Sort intake results into user-facing states: ready, will convert, image only, lorebook, skipped, and needs review.
- Save selected ready imports into the local library while preserving PNG/CCV3
  as the primary character-card artifact and using CHARX only for bundles.
- Use lazy card metadata loading and thumbnail caching so large libraries remain responsive.
- Keep image and card storage local-first.
- Add settings for library paths, cache behavior, and backup behavior.
- Keep library filters friendly and romance-platform familiar: chat style, POV, character role, user role, tropes, and AU tags.
- Rebuild the durable parts of CharacterGen `card_library.py` as Tauri commands and typed frontend hooks.
- Keep browser mode functional with explicit no-desktop fallbacks instead of calling Tauri APIs outside Tauri.

Exit criteria:

- The app can browse and manage a local card library without loading every card fully into memory.
- Users can import/export card PNGs and JSON through native desktop dialogs.
- Users can scan an inbox folder, review each file before import, and promote selected cards into the local library or a bundle/archive package.
- Desktop-only controls are hidden or clearly downgraded in browser mode.

## Phase 6: Context Compiler and Chat Runtime

Goal: integrate chat only after character/persona/scenario/lore data has reliable structure.

Architecture reference: [`docs/chat-runtime-architecture.md`](docs/chat-runtime-architecture.md).

Current status: in active implementation. The chat surface now includes
save/load, lore diagnostics, relationship state hooks, scenario overrides,
interaction intent, regeneration, swiped variants, copy actions, and context
guard/milestone anchoring tests. Keep browser and real Tauri shell behavior in
lockstep for every runtime addition.

- Add a formal context compiler that assembles:
  - character
  - persona
  - active scenario
  - active lorebooks
  - recent chat
  - summaries
  - runtime instructions
- Enforce one shared token budget across all prompt channels.
- Add model/proxy/settings UI with configurable provider, endpoint, model, token budget, and stop presets.
- Add turn prefixing so the model knows whose turn is expected.
- Add hierarchical chat summaries before long-running chat becomes core.
- Add scenario tracks as the memory boundary for chat runtime: every transcript turn, relationship state record, profile fact, summary, and later vector/FTS memory row must be scoped by `scenario_id`.
- Build the scenario selector as a desktop-safe Tauri IPC workflow, not a Next API route dependency.
- Keep current scenario override editable so users can load a character into a different trope or setting.
- Treat scenario arcs as modular narrative scaffolds: they provide available beats, continuity, and pacing context, but the user can follow, skip, branch, rewind, or jump between beats.
- Let CCV3 `system_prompt` replace the app default prompt, or extend it with `{{original}}`.
- Keep `post_history_instructions` as final card-authored steering.
- Add hidden relationship-state gates for romance pacing:
  - Track route state separately from stable card metadata as event flags, unresolved beats, current phase, attachment style, and current mood.
  - Model universal relationship phases as `initial_dynamic`, `friction_or_spark`, `repeated_contact`, `vulnerability_leak`, `reframing`, `emotional_investment`, `crisis_or_choice`, `confession_or_escalation`, and `integration`.
  - Treat romance tropes as emotional progression templates, not static tags, with starting conditions, emotional obstacles, common events, pacing profile, chemistry bias, likely dynamics, and payoff fantasy.
  - Group tropes into conflict-based, intimacy-based, circumstance-based, forbidden, healing, obsession/fixation, destiny/fated, and domestic categories so user-facing trope choices can map to hidden route behavior.
  - Add route templates for enemies to lovers, friends to lovers, strangers to lovers, age gap romance, fake dating, forbidden romance, childhood sweethearts, opposites attract, grumpy x sunshine, second chance, protector x vulnerable, rivals to lovers, slow burn, soulmates, marriage of convenience, workplace romance, healer x wounded, best friend's sibling, celebrity x normal person, reunion after betrayal, online to real life, redemption romance, polyamorous formation, guardian x protected, forced proximity, roommates to lovers, academic rivals, royalty x commoner, single parent romance, amnesia romance, arranged partnership, teacher x adult student, holiday romance, and love triangle so each trope can map those phases to its own emotional engine, barriers, hidden variables, and mature payoff.
  - Add affection mismatch realism as scenario/trope guidance: two characters can care deeply while intention, expression, and interpretation fail to translate, creating tension without requiring malice or lack of love.
  - Support affection mismatch patterns such as verbal vs behavioral, teasing vs reassurance, quiet vs expressive, independence vs closeness, protective vs vulnerability, devotional vs casual, touch vs verbal, conflict repair mismatch, stability vs excitement, and symbolic vs practical affection.
  - Use affection mismatch route beats such as care attempt, missed recognition, hurt interpretation, conflict or withdrawal, revealed intention, adapted expression, felt recognition, and deeper intimacy.
  - Let user-facing story-engine tags choose the pacing profile, while the runtime privately maps those tags into trigger rules, emotional response directives, and soft intensity counters.
  - Use deterministic keyword, event, lore, and scene triggers to update relationship state before each model call.
  - Treat soft stats as emotional weather, events as story evidence, keywords as player intent, and phase as narrative interpretation.
  - Make events decide meaning while hidden numbers only decide intensity, decay, sorting, readiness scoring, or conflict pressure.
  - Persist relationship memory anchors for emotionally important landmarks such as first kiss, first apology, broken promise, traumatic confession, public choice, shared grief, reconciliation, and future plans.
  - Add a memory significance filter so filler interactions stay as short-term texture, emotional events can decay unless reinforced, and core relationship memories persist as canonical emotional history.
  - Add continuity mechanics so events become memories, memories become patterns, patterns shape expectations, expectations form relational identity, and identity influences trajectory.
  - Track continuity layers such as persistent relationship memory, emotional momentum, callbacks, dynamic evolution, emotional scars, habits, relational state persistence, pattern recognition, escalation memory, relational identity, future projection, repair continuity, threshold evolution, contextual activation, and trajectory.
  - Use continuity variables such as memory weight, emotional momentum, ritual density, callback frequency, trust persistence, scar persistence, dynamic stability, relationship identity strength, vulnerability evolution, escalation memory, future projection, repair continuity, and contextual activation.
  - Prevent emotional amnesia by making characters speak, react, trust, flirt, and repair differently because of shared history.
  - Track vulnerability thresholds as layered intimacy gates for emotional expression, attachment, confession, reassurance-seeking, trauma disclosure, dependency, physical intimacy, shame exposure, conflict vulnerability, and authentic self-revelation.
  - Track vulnerability-threshold variables such as emotional openness threshold, attachment threshold, confession threshold, reassurance-seeking threshold, trauma disclosure threshold, dependency threshold, physical intimacy threshold, shame exposure threshold, conflict vulnerability threshold, authenticity threshold, threshold adaptability, threshold lowering momentum, and threshold spikes after rupture.
  - Track emotional memory sensitivity so past abandonment, betrayal, rejection, humiliation, invalidation, neglect, broken promises, dependency pain, unsafe conflict, and safety experiences continue shaping present interpretation and trust.
  - Track emotional-memory variables such as emotional memory weight, trigger sensitivity, abandonment memory sensitivity, betrayal memory sensitivity, rejection memory sensitivity, shame memory sensitivity, invalidation memory sensitivity, neglect memory sensitivity, broken promise memory sensitivity, dependency memory sensitivity, conflict memory sensitivity, safety memory sensitivity, reassurance retention, repair retention, emotional reset speed, and attachment memory strength.
  - Track idealization versus reality tolerance so attraction can survive or collapse when fantasy becomes ordinary humanity, routine, flaws, emotional complexity, and imperfection.
  - Track idealization variables such as idealization intensity, reality tolerance, fantasy dependence, imperfection tolerance, routine tolerance, projection intensity, emotional complexity tolerance, stability tolerance, humanization comfort, expectation flexibility, attachment reality tolerance, mature attachment capacity, devaluation cycle risk, and fantasy collapse risk.
  - Track relationship values as the emotional principles characters believe love should contain, including loyalty, honesty, safety, autonomy, devotion, growth, stability, passion, freedom, exclusivity, caretaking, equality, acceptance, excitement, and commitment.
  - Track relationship-value variables such as loyalty importance, emotional honesty value, emotional safety value, autonomy value, devotion value, growth orientation, stability preference, passion importance, freedom value, exclusivity importance, caretaking value, equality value, acceptance value, excitement value, commitment importance, value rigidity, and value alignment.
  - Track rituals and habits as repeated behaviors, routines, gestures, patterns, and symbolic interactions that create emotional continuity, attachment reinforcement, intimacy texture, and relationship identity over time.
  - Support ritual types such as greeting, goodbye, comfort, conflict repair, domestic, teasing, reassurance, protective, physical affection, symbolic, public, and private rituals.
  - Preserve concrete ritual examples such as goodnight texts, coffee together, forehead kisses, teasing nicknames, always walking together, one fixing the other's clothes, recurring sleeping positions, and checking in after stress as small repeated behaviors that create lived relationship texture.
  - Model ritual evolution and disruption so repeated behaviors can mature with intimacy, while missed or withheld rituals can signal instability, threaten emotional safety, or damage relationship identity.
  - Track ritual variables such as ritual density, ritual importance, reassurance ritual dependence, domestic integration, symbolic attachment, ritual stability, emotional continuity, ritual sensitivity, shared culture strength, ritual evolution, ritual disruption risk, weaponized ritual risk, and habit specificity.
  - Track compatibility axes as multidimensional long-term relational fit rather than a single match score, separate from chemistry, attraction, love, obsession, attachment, and relationship identity.
  - Support compatibility axes such as emotional, communication, conflict, attachment, intimacy, sexual, pacing, domestic, ambition, social, exclusivity, autonomy, stability, lifestyle, value, growth, ritual, devotion, and novelty compatibility.
  - Expand emotional compatibility through regulation fit, vulnerability compatibility, reassurance compatibility, expression compatibility, attachment interaction, emotional need compatibility, conflict compatibility, emotional safety fit, intensity compatibility, and empathy synchronization.
  - Expand communication compatibility through directness compatibility, emotional transparency fit, reassurance compatibility, conflict communication fit, subtext compatibility, vulnerability pace compatibility, processing speed compatibility, affection translation accuracy, emotional vocabulary compatibility, and emotional listening quality.
  - Expand conflict compatibility through regulation compatibility under stress, repair compatibility, pursuit/withdrawal fit, accountability capacity, emotional safety during conflict, escalation tolerance match, resolution timing compatibility, vulnerability preservation, conflict meaning compatibility, and boundary respect under stress.
  - Expand sexual compatibility through desire style fit, libido compatibility, emotional intimacy integration, vulnerability safety, touch compatibility, pace compatibility, dynamic compatibility, communication openness, sexual exclusivity compatibility, emotional regulation during intimacy, exploration compatibility, and sensual compatibility.
  - Distinguish sexual chemistry from sexual compatibility; keep sexual compatibility adult-gated, consent-aware, boundary-controlled, and tied to emotional safety rather than raw attraction alone.
  - Track desire style as attraction activation and behavior distinct from libido, chemistry, sexual compatibility, and intimacy style; support spontaneous, responsive, tension-driven, emotional-intimacy, devotional, pursuit-oriented, security-based, validation-driven, power-dynamic, intellectual, forbidden, sensory/sensual, obsessive, slow-burn, and chaotic desire styles.
  - Track desire variables such as desire activation style, desire pace, emotional integration, vulnerability integration, validation dependence, tension responsiveness, security-based desire, novelty dependence, and obsession tendency.
  - Track libido style as the way sexual desire behaves over time, distinct from desire style, sexual chemistry, sexual compatibility, and intimacy style; support high-stable, responsive, tension-driven, security-based, novelty-dependent, attachment-reactive, avoidant, obsessive, devotional, chaotic, and low-reactive libido styles.
  - Track libido variables such as libido intensity, libido activation style, libido regulation style, libido emotional integration, libido novelty dependence, libido security dependence, libido stress sensitivity, libido attachment influence, libido intimacy integration, pursuit reactivity, and libido stability.
  - Track sexual chemistry variation so pairings feel psychologically and rhythmically unique, supporting tension-based, emotional-intimacy, competitive, devotional, playful, protective, forbidden, obsessive, soft-domestic, chaotic, intellectual, and slow-burn chemistry.
  - Track chemistry variables such as tension density, emotional intimacy chemistry, playfulness chemistry, devotional chemistry, protective chemistry, obsessive chemistry, attachment activation, novelty dependence, and erotic rhythm compatibility.
  - Expand pacing compatibility through emotional pace preference fit, attachment speed compatibility, commitment pace comfort, intimacy escalation comfort, vulnerability threshold fit, conflict processing speed fit, domestic pacing compatibility, exclusivity pacing compatibility, intensity pacing compatibility, relationship identity pacing fit, progression flexibility, pacing pressure risk, emotional acceleration overload risk, chronic stagnation risk, and avoidance pacing risk.
  - Expand domestic compatibility through routine compatibility, shared space compatibility, responsibility sharing fit, daily regulation fit, domestic affection fit, chore expectation alignment, cleanliness preference fit, sleep schedule compatibility, food and care rhythm fit, home privacy compatibility, domestic conflict risk, domestic integration sustainability, and ordinary life connection.
  - Expand ambition compatibility through goal alignment, work-life priority compatibility, achievement drive compatibility, time availability fit, success identity compatibility, ambition growth compatibility, lifestyle pace compatibility, emotional availability under ambition, sacrifice compatibility, security/aspiration compatibility, competitiveness risk, ambition supportiveness, and future inclusion strength.
  - Expand social compatibility through social energy match, public affection compatibility, relationship visibility preference fit, friendship integration fit, attention distribution comfort, lifestyle social rhythm, family compatibility, social boundary compatibility, reputation sensitivity fit, social supportiveness, public identity comfort, social jealousy risk, public invalidation risk, and social exhaustion risk.
  - Expand lifestyle compatibility through routine rhythm fit, energy compatibility, organization compatibility, social lifestyle fit, work-life compatibility, domestic responsibility balance, financial lifestyle compatibility, leisure compatibility, space need compatibility, stress habit compatibility, health/wellness compatibility, change tolerance match, daily intimacy sustainability, lifestyle friction accumulation, and over-adaptation risk.
  - Model compatibility types such as natural compatibility, growth compatibility, high chemistry/low compatibility as compelling drama, high compatibility/low chemistry as stable but flat, and transformational compatibility.
  - Track compatibility variables such as emotional compatibility, emotional regulation fit, vulnerability compatibility, reassurance compatibility, expression compatibility, emotional need compatibility, emotional safety fit, intensity compatibility, empathy synchronization, communication compatibility, directness compatibility, emotional transparency fit, conflict communication fit, subtext compatibility, vulnerability pace compatibility, processing speed compatibility, affection translation accuracy, emotional vocabulary compatibility, emotional listening quality, conflict compatibility, regulation compatibility under stress, repair compatibility, pursuit/withdrawal fit, accountability capacity, emotional safety during conflict, escalation tolerance match, resolution timing compatibility, vulnerability preservation, conflict meaning compatibility, boundary respect under stress, attachment compatibility, intimacy compatibility, sexual compatibility, desire style fit, libido compatibility, emotional intimacy integration, sexual vulnerability safety, touch compatibility, sexual pace compatibility, dynamic compatibility, sexual communication openness, sexual exclusivity compatibility, intimacy regulation compatibility, exploration compatibility, sensual compatibility, pressure mismatch risk, sexual communication collapse risk, emotional disconnect risk, static erotic dynamic risk, pacing compatibility, emotional pace preference fit, attachment speed compatibility, commitment pace comfort, intimacy escalation comfort, vulnerability threshold fit, conflict processing speed fit, domestic pacing compatibility, exclusivity pacing compatibility, intensity pacing compatibility, relationship identity pacing fit, progression flexibility, pacing pressure risk, emotional acceleration overload risk, chronic stagnation risk, avoidance pacing risk, domestic compatibility, routine compatibility, shared space compatibility, responsibility sharing fit, daily regulation fit, domestic affection fit, chore expectation alignment, cleanliness preference fit, sleep schedule compatibility, food and care rhythm fit, home privacy compatibility, domestic conflict risk, domestic integration sustainability, ordinary life connection, ambition compatibility, goal alignment, work-life priority compatibility, achievement drive compatibility, time availability fit, success identity compatibility, ambition growth compatibility, lifestyle pace compatibility, emotional availability under ambition, sacrifice compatibility, security/aspiration compatibility, competitiveness risk, ambition supportiveness, future inclusion strength, social compatibility, social energy match, public affection compatibility, relationship visibility preference fit, friendship integration fit, attention distribution comfort, lifestyle social rhythm, family compatibility, social boundary compatibility, reputation sensitivity fit, social supportiveness, public identity comfort, social jealousy risk, public invalidation risk, social exhaustion risk, exclusivity compatibility, autonomy compatibility, stability compatibility, lifestyle compatibility, routine rhythm fit, energy compatibility, organization compatibility, social lifestyle fit, work-life compatibility, domestic responsibility balance, financial lifestyle compatibility, leisure compatibility, space need compatibility, stress habit compatibility, health/wellness compatibility, change tolerance match, daily intimacy sustainability, lifestyle friction accumulation, over-adaptation risk, value compatibility, growth compatibility, ritual compatibility, devotion compatibility, novelty compatibility, natural compatibility, adaptation capacity, transformational compatibility, chemistry/compatibility gap, and compatibility stress.
  - Add progression mechanics so relationships move through accumulated emotional meaning rather than scene count or a single romance score.
  - Track progression layers across emotional progression, narrative progression, behavioral progression, intimacy progression, and stability progression.
  - Support progression mechanisms for emotional readiness, trigger-based movement, soft gates, phase transitions, escalation, regression, repair, momentum, dynamic evolution, thresholds, intimacy-layer asymmetry, relationship identity, emotional saturation, trajectory prediction, milestones, compatibility stress, and plateaus.
  - Use multi-axis progression across trust, attraction, attachment, vulnerability, commitment, stability, tension, familiarity, and devotion so milestones alter interpretation instead of merely raising a score.
  - Track progression variables such as emotional readiness, progression momentum, vulnerability threshold, regression sensitivity, repair effectiveness, milestone density, stability level, dynamic evolution, emotional saturation, plateau risk, compatibility stress, and trajectory prediction.
  - Track relationship trajectory prediction as emotional probability modeling based on accumulated patterns, momentum, repair, attachment, adaptation, stress, compatibility, rupture history, and emotional behavior.
  - Support trajectory types such as secure deepening, obsessive escalation, push-pull, slow-burn deepening, emotional drift, repair/redemption, chaotic collapse, domestic stabilization, fantasy collapse, and transformational trajectory.
  - Track trajectory variables such as attachment trajectory, trust trajectory, stability trajectory, intimacy trajectory, rupture trajectory, repair trajectory, identity trajectory, drift risk, identity consolidation, survivability projection, collapse risk, turning point volatility, and trajectory confidence.
  - Track relationship momentum as accumulated emotional inertia, separate from progression stage, so repeated patterns alter future emotional probability instead of resetting between scenes.
  - Support momentum types such as positive attachment momentum, romantic escalation momentum, trust momentum, negative momentum, obsession momentum, repair momentum, domestic momentum, vulnerability momentum, conflict momentum, emotional drift momentum, and stability momentum.
  - Support momentum states such as escalating, stabilizing, volatile, repairing, deteriorating, and stagnant, with turning points able to redirect relationship trajectory.
  - Track momentum variables such as attachment momentum, romantic escalation momentum, trust momentum, negative momentum, obsession momentum, repair momentum, domestic momentum, vulnerability momentum, conflict momentum, emotional drift momentum, stability momentum, emotional memory weight, expectation reinforcement, trajectory acceleration, turning point sensitivity, emotional reset risk, infinite escalation risk, and trajectory clarity.
  - Track relationship lifecycle state as the current macro emotional condition of the relationship, distinct from status labels, progression phase, identity, and momentum.
  - Support lifecycle states such as potential, attraction, tension, pursuit, denial, attachment formation, vulnerability, instability, obsession, devotional, domestic integration, stable partnership, plateau, drift, fracture, repair, reconnection, transformation, dissolution, and post-attachment.
  - Use lifecycle state to change dialogue interpretation, chemistry, trust, pacing, rituals, vulnerability, expectations, affection style, conflict tone, and relationship identity.
  - Track lifecycle variables such as current lifecycle state, attachment depth, lifecycle stability level, momentum direction, vulnerability openness, trust integrity, lifecycle ritual density, emotional volatility, repair progress, state transition readiness, state memory weight, lifecycle regression risk, lifecycle plateau risk, dissolution risk, and post-attachment residue.
  - Track relationship survivability as the long-term resilience capacity of the relationship, distinct from chemistry, attraction, obsession, love, stability, compatibility, trust, and attachment.
  - Support survivability components such as conflict survivability, trust durability, repair competence, emotional safety stability, adaptation capacity, attachment resilience, identity stability, intimacy survivability, lifestyle sustainability, rupture recovery capacity, future survivability, shared willingness to continue, and stress absorption.
  - Distinguish high chemistry/low survivability as intense but collapse-prone, high survivability/low chemistry as safe but potentially flat, and high chemistry/high survivability as mature romance where intensity, trust, repair, and adaptation coexist.
  - Track survivability variables such as overall survivability, conflict survivability, trust durability, repair competence, emotional safety stability, adaptation capacity, attachment resilience, identity stability, intimacy survivability, lifestyle sustainability, rupture recovery capacity, future survivability, shared willingness to continue, stress absorption, false survivability risk, fragility loop risk, repair failure risk, and intensity addiction risk.
  - Track relationship identity as the shared "we" layer that emerges from history, rituals, emotional roles, shared language, relational mythology, public/private identity, expectations, and future orientation.
  - Support relationship identity states such as curious, flirtatious, emotionally attached, devotional, fragile, domestic, competitive, obsessive, safe haven, chaotic, healing, transformational, repairing, stable partnership, and co-dependent.
  - Treat identity ruptures as deeper than ordinary trust damage when an event violates the couple's shared self-concept, and require symbolic restoration for identity repair.
  - Track relationship identity variables such as shared identity strength, ritual density, future integration, emotional interdependence, identity stability, shared mythology, couple culture depth, public/private contrast, role rigidity, emotional mythology, relationship uniqueness, shared value alignment, emotional tone identity, identity rupture risk, and identity repair readiness.
  - Track relationship status as a multi-layer current relational state rather than a single label, including structural, emotional, commitment, exclusivity, stability, intimacy, visibility, and attachment dimensions.
  - Support high-resolution statuses such as strangers, familiar strangers, curious, flirtation state, denial state, emotionally interested, tension-heavy undefined, situationship, secretly attached, mutual yearning, casual dating, emotionally exclusive, official relationship, deep attachment, devotional relationship, domestic partnership, secure partnership, fragile, push-pull, obsessive, conflict-dominant, emotional avoidance, emotional drift, estranged, broken up but attached, repairing, reconciliation, soulmate identity, companionate love, transformational bond, open relationship, polyamorous bond, nested partnership, and fluid attachment network.
  - Track relationship-status variables such as structural definition, emotional attachment, commitment level, stability level, exclusivity state, intimacy level, visibility state, relationship identity strength, repair state, unresolved tension, and status ambiguity.
  - Track emotional tone separately from phase, mood, and emotional state, with tones such as tender, yearning, playful, tense, devotional, fragile, chaotic, comforting, obsessive, bittersweet, reverent, predatory, melancholic, hopeful, and intimate domesticity shaping dialogue and scene atmosphere.
  - Track pacing profiles separately from route phase so emotional access, romantic escalation, sexual escalation, conflict, trust, dependency, and domestic integration can move at different speeds.
  - Support fast burn, slow burn, push-pull, stable/gentle, chaotic, episodic, and continuous pacing modes, with milestone spacing, recovery time, vulnerability resistance, emotional momentum, and conflict density kept as hidden runtime controls.
  - Model attachment style as an adaptive emotional survival strategy, not a rigid personality lock, using secure, anxious, avoidant, and fearful tendencies to shape interpretation, flirting, conflict, jealousy, vulnerability, reassurance, dependency, withdrawal, and post-intimacy behavior.
  - Track attachment variables such as abandonment fear, vulnerability resistance, reassurance need, autonomy need, emotional reactivity, conflict recovery, trust speed, dependency tendency, and intimacy tolerance.
  - Let attachment security evolve or regress through repeated safety, rupture, repair, betrayal, abandonment, stress, and consistency, so long-running arcs can move from fear to trust to vulnerability to emotional safety.
  - Track emotional regulation style as the characteristic way a character manages, processes, suppresses, expresses, stabilizes, or responds to emotional activation under stress, intimacy, conflict, vulnerability, jealousy, or attachment pressure.
  - Support regulation styles such as self-regulating, co-regulating, suppression-based, intellectualization, expressive, withdrawal, reassurance-seeking, humor/teasing, chaotic, caretaking, avoidance-based, and physical regulation.
  - Use regulation mismatch to create realistic conflict loops, such as one character needing space while another needs immediate reassurance, without treating either coping strategy as lack of care.
  - Track regulation variables such as self-regulation capacity, co-regulation need, emotional flooding threshold, withdrawal tendency, suppression level, reassurance dependence, conflict recovery speed, emotional recovery style, vulnerability regulation, intellectualization tendency, expressive processing, humor deflection, caretaking deflection, physical grounding need, avoidance level, co-regulation safety, and regulation mismatch risk.
  - Track emotional availability as the capacity for sustained emotional intimacy, vulnerability, attachment, responsiveness, and relational presence, distinct from emotional openness, attraction, affection, desire, and commitment.
  - Support availability styles such as highly available, situationally available, guardedly available, inconsistently available, and functionally unavailable.
  - Treat high chemistry, intense pursuit, or visible feeling as insufficient evidence of emotional availability unless the character can sustain presence through attachment, conflict, vulnerability, accountability, and ordinary reality.
  - Track availability variables such as vulnerability capacity, attachment capacity, emotional presence capacity, conflict endurance capacity, emotional responsiveness capacity, intimacy sustainability capacity, attachment tolerance, withdrawal tendency, fear activation threshold, availability consistency, stability phase availability, crisis phase availability, accountability availability, performative availability risk, intensity-only availability risk, and emotional withdrawal loop risk.
  - Track core wounds as deep formative relational injuries that shape love, attachment, intimacy, trust, vulnerability, self-worth, conflict, emotional safety, interpretation, triggers, and defense mechanisms.
  - Support core wounds such as abandonment, rejection, betrayal, emotional neglect, humiliation, inadequacy, engulfment, emotional invalidation, conditional love, control, replacement, emotional burden, visibility, dependency, and worthlessness.
  - Use core wounds as hidden emotional architecture beneath relationship fears, misunderstanding, jealousy, withdrawal, reassurance seeking, masking, hyper-independence, obsession, and self-sabotage.
  - Track wound variables such as abandonment wound severity, rejection wound severity, betrayal wound severity, emotional neglect wound severity, humiliation wound severity, inadequacy wound severity, engulfment wound severity, invalidation wound severity, conditional love wound severity, control wound severity, replacement wound severity, emotional burden wound severity, visibility wound severity, dependency wound severity, worthlessness wound severity, wound activation level, trigger sensitivity, defensive adaptation strength, attraction to wound activation, corrective experience readiness, wound healing progress, self-worth stability, emotional visibility fear, and emotional invalidation sensitivity.
  - Track relationship fears as hidden emotional threats that drive protective adaptations in pacing, jealousy, restraint, conflict, vulnerability, commitment, power dynamics, miscommunication, and self-sabotage.
  - Support fears such as abandonment, engulfment, rejection, vulnerability, replacement, inadequacy, dependency, betrayal, emotional exposure, conflict, emotional irrelevance, stability, intimacy, losing autonomy, and being truly known.
  - Model fear loops such as abandonment pursuit and engulfment withdrawal, while distinguishing protective adaptations from lack of care and never using fear to excuse coercion or harm.
  - Track fear variables such as abandonment fear, engulfment fear, rejection sensitivity, vulnerability fear, replacement fear, inadequacy fear, dependency fear, betrayal sensitivity, emotional exposure fear, conflict fear, irrelevance fear, stability fear, intimacy avoidance, losing autonomy fear, being known fear, protective adaptation strength, sabotage risk, repair responsiveness, and fear transformation progress.
  - Add specialized fear modules for abandonment, engulfment, betrayal, inadequacy, fear of being controlled, fear of being forgotten, vulnerability fear, emotional dependence fear, replacement fear, and rejection fear so specific trust wounds alter pacing, interpretation, memory weight, repair difficulty, and future vulnerability thresholds.
  - Track abandonment variables such as reassurance dependence, withdrawal triggering, emotional return trust, hypervigilance, separation tolerance, attachment security, conflict survival trust, and emotional availability sensitivity.
  - Track engulfment and control-fear variables such as engulfment sensitivity, space need, emotional pressure sensitivity, identity stability, control sensitivity, boundary rigidity, agency preservation, possessiveness reactivity, and closeness tolerance.
  - Track betrayal, inadequacy, and forgotten-fear variables such as trust damage, vulnerability damage, repair resistance, relationship identity damage, forgiveness readiness, accountability recognition, self-worth stability, comparison sensitivity, shame sensitivity, validation hunger, imperfection tolerance, emotional burden fear, emotional permanence need, sentimentality, attachment persistence, nostalgia intensity, memory preservation need, and emotional visibility need.
  - Track vulnerability, dependence, replacement, and rejection variables such as emotional control need, openness threshold, emotional armor strength, vulnerability recovery speed, emotional self-sufficiency, closeness panic threshold, reassurance resistance, attachment denial, emotional withdrawal tendency, interdependence capacity, emotional singularity need, comparison reactivity, rival hypervigilance, reciprocity confidence, emotional risk tolerance, confession hesitation, and emotional exposure threshold.
  - Track jealousy style as the way a character experiences, interprets, expresses, regulates, or hides fear of losing significance, attention, attachment, or emotional uniqueness.
  - Support jealousy styles such as anxious, silent, possessive, competitive, teasing, defensive, devotional, reactive, intellectualized, chaotic, reassurance-seeking, protective, subtle, shame-based, and secure jealousy.
  - Distinguish healthy jealousy as communicated emotional significance from unhealthy jealousy as control, punishment, surveillance, coercion, or manipulation.
  - Track jealousy variables such as jealousy reactivity, rival sensitivity, reassurance need, exclusivity need, emotional security, comparison sensitivity, possessiveness tendency, emotional transparency, shame around neediness, regulation capacity, communication readiness, territoriality, control risk, reassurance responsiveness, and vulnerability reveal potential.
  - Track possessiveness as the desire to secure, protect, maintain, or control emotional, romantic, sexual, or relational exclusivity and significance, distinct from jealousy, exclusivity, devotion, and control.
  - Support possessiveness types such as emotional, romantic, sexual, protective, devotional, insecurity-driven, silent, territorial, and chaotic possessiveness.
  - Distinguish healthy possessiveness as communicated desire for uniqueness, prioritization, protective affection, and reassurance from unhealthy possessiveness as monitoring, isolation, coercion, punishment, ownership mentality, emotional monopolization, or autonomy collapse.
  - Track possessiveness variables such as exclusivity need, emotional territoriality, rival sensitivity, prioritization need, possessiveness intensity, autonomy respect, replacement fear, devotional intensity, reassurance dependence, agency preservation, control impulse, monitoring impulse, emotional monopolization risk, ownership mentality risk, and secure singularity.
  - Track obsession as overwhelming psychological fixation where another person dominates thoughts, emotions, attention, identity, regulation, or meaning, distinct from love, devotion, attachment, infatuation, and dependency.
  - Support obsession types such as romantic, emotional, sexual, jealous, devotional, transformational, fear-based, chaotic, mutual, and silent obsession.
  - Distinguish safe obsession as mutual fixation with reassurance, emotional safety, boundaries, and regulation from unsafe obsession as coercion, emotional monopolization, autonomy destruction, instability addiction, surveillance, or identity collapse.
  - Track obsession variables such as attachment intensity, emotional fixation, replacement fear, exclusivity need, dependency level, hypervigilance, devotional intensity, autonomy preservation, emotional regulation stability, uncertainty amplification, intermittent reward sensitivity, identity absorption, attention dominance, reciprocity stability, boundary integrity, safe obsession potential, and destabilization risk.
  - Track conflict style as the recurring protection pattern used when emotional safety feels threatened, separate from attachment style and generic conflict events.
  - Support conflict styles such as pursuer, withdrawer, explosive, passive-avoidant, teasing/deflective, intellectual, appeasing, dominance-based, emotional shutdown, and repair-oriented.
  - Model conflict escalation through friction, tension, defensive behavior, rupture, vulnerability or revelation, repair attempt, and reconnection, while distinguishing conflict, argument, rupture, repair, and abuse.
  - Use conflict variables such as conflict avoidance, emotional reactivity, repair ability, vulnerability under stress, withdrawal tendency, pursuit urgency, accountability, emotional flooding, reassurance need, and rupture risk.
  - Track repair style as the characteristic way a character attempts to reconnect, restore safety, reduce tension, rebuild trust, and re-establish emotional connection after rupture, distinct from conflict style and repair arcs.
  - Support repair styles such as verbal reassurance, accountability, behavioral, physical, presence-based, humor/play, space-based, vulnerability, devotional, practical, collaborative, ritual, silent, and sacrificial repair.
  - Use repair-style mismatch to create realistic post-conflict tension, such as one character needing space while another needs immediate reassurance, and require repair style to match rupture type for emotional success.
  - Track repair-style variables such as reassurance repair preference, accountability capacity, behavioral repair reliability, space-based repair need, physical repair preference, presence reliability, collaborative repair skill, repair timing compatibility, repair effectiveness, validation skill, vulnerability repair capacity, ritual repair reliability, repair bypassing risk, premature repair risk, and one-sided repair burden.
  - Track communication style as emotional translation behavior: how a character expresses needs, emotions, attraction, boundaries, conflict, affection, and vulnerability.
  - Support communication styles such as direct, indirect, teasing, emotionally expressive, restrained, intellectual, reassurance-oriented, avoidant, chaotic, caretaking, devotional, conflict-avoidant, subtext-heavy, reactive, and silent.
  - Use communication-style mismatch to create subtext, misunderstanding, pacing friction, slow-burn tension, and emotional translation arcs.
  - Track communication variables such as directness, emotional transparency, subtext density, reassurance frequency, conflict openness, vulnerability expression, playfulness, emotional filtering, responsiveness, nonverbal weight, and translation mismatch risk.
  - Track emotional transparency as the visibility of genuine emotional state, distinct from vulnerability, honesty, emotional expression, regulation, oversharing, and emotional dumping.
  - Support transparency styles such as high, balanced, low, and inconsistent transparency, plus verbal, behavioral, reactive, controlled, and accidental transparency modes.
  - Use transparency balance to control clarity, subtext, mystery, slow-burn tension, emotional leakage, misunderstanding risk, and vulnerability progression as safety increases.
  - Track transparency variables such as emotional openness, expression clarity, vulnerability comfort, emotional filtering, subtext density, leakage tendency, transparency consistency, emotional safety dependence, reactivity visibility, mystery balance, defensive opacity risk, weaponized transparency risk, and inauthentic transparency risk.
  - Track miscommunication as mismatch between intended meaning, expressed meaning, perceived meaning, and emotional interpretation, distinct from withholding, deception, and simple ambiguity.
  - Support miscommunication types such as emotional, protective, timing, expectation, jealousy, silence, intent, conflict, vulnerability, and romantic ambiguity.
  - Use miscommunication progression from ambiguity to incorrect interpretation, emotional reaction, escalation, vulnerability reveal, clarification, and deeper intimacy when the scene earns it.
  - Track miscommunication variables such as directness, interpretation bias, vulnerability avoidance, clarification tendency, emotional projection, subtext density, ambiguity tolerance, reassurance sensitivity, escalation risk, and resolution readiness.
  - Track misunderstanding as mistaken emotional interpretation of intentions, feelings, motives, needs, boundaries, or behavior, distinct from miscommunication, betrayal, ambiguity, and projection.
  - Support misunderstanding types such as emotional intent, affection, teasing, withdrawal, vulnerability, exclusivity, jealousy, timing, silence, and self-protection misunderstanding.
  - Use misunderstanding to model the gap between hidden feeling and visible behavior, with recovery through clarification, emotional translation, reassurance, and learned emotional fluency.
  - Track misunderstanding variables such as interpretation bias, ambiguity tolerance, clarification tendency, projection sensitivity, emotional translation accuracy, reassurance dependence, subtext recognition, attachment trigger sensitivity, misunderstanding recovery ability, and endless loop risk.
  - Track admiration as emotionally significant respect, appreciation, fascination, or esteem that can turn attraction into sustained emotional gravity.
  - Support admiration types such as competence, emotional, protective, intellectual, moral, vulnerability, transformational, physical, devotional, and hidden admiration.
  - Distinguish admiration from idealization, devotion, attraction, and infatuation so long-term romance can mature from projection into realistic respect.
  - Track admiration variables such as respect level, fascination, competence attraction, emotional reverence, idealization tendency, pride in partner, validation importance, devotional intensity, realism of admiration, and conditional admiration risk.
  - Track excitement as emotional stimulation, anticipation, novelty, intensity, momentum, and energetic engagement, distinct from love, safety, intimacy, compatibility, and chemistry.
  - Support excitement sources such as novelty, tension, uncertainty, challenge, sexual, emotional, forbidden, transformational, chaotic, and playful excitement.
  - Balance excitement with emotional safety and stability so the runtime can distinguish sustainable passion from artificial drama, stagnation, or anxiety misread as attraction.
  - Track excitement variables such as novelty need, tension enjoyment, emotional stimulation, predictability tolerance, escalation desire, playfulness, risk attraction, passion stability, responsiveness, attention fixation, excitement-safety balance, instability addiction risk, and stagnation risk.
  - Track novelty as emotional, psychological, relational, or experiential newness that creates curiosity, anticipation, discovery, renewed engagement, and rediscovery without relying on random chaos.
  - Support novelty types such as personal discovery, emotional, experiential, sexual, intellectual, identity, dynamic, vulnerability, domestic, and relational novelty.
  - Balance novelty with stability and familiarity so long-term romance can keep evolving without becoming volatile, artificial, or psychologically static.
  - Track novelty variables such as novelty need, curiosity persistence, adaptation speed, exploration desire, emotional evolution, routine tolerance, rediscovery capacity, dynamic flexibility, excitement dependency, novelty-stability balance, artificial novelty risk, novelty starvation risk, and instability confusion risk.
  - Track stability as emotional reliability, resilience, predictability, sustainability, and security over time, distinct from comfort, safety, commitment, compatibility, and routine.
  - Support stability components such as emotional consistency, conflict stability, behavioral reliability, attachment stability, identity stability, commitment stability, intimacy stability, and routine stability.
  - Balance stability with excitement so the runtime can distinguish sustainable passion from volatile obsession, comfortable stagnation, false stability, and avoidance-based calm.
  - Track stability variables such as emotional consistency, conflict resilience, repair reliability, behavioral reliability, attachment security, identity stability, commitment durability, intimacy persistence, routine integration, predictability, stability satisfaction, false stability risk, hyper-instability risk, and stagnation risk.
  - Track consistency as reliable repetition of emotionally meaningful behavior over time, distinct from stability, routine, reliability, predictability, and emotional flatness.
  - Support consistency forms such as emotional consistency, behavioral consistency, reassurance consistency, conflict consistency, affection consistency, vulnerability consistency, presence consistency, and identity consistency.
  - Balance consistency with intensity and novelty so the runtime can distinguish emotionally secure passion from hot/cold obsession, false consistency, rigid routine, and over-predictable stagnation.
  - Track consistency variables such as emotional reliability, behavioral reliability, affection stability, repair reliability, vulnerability safety, reassurance frequency, conflict consistency, presence durability, identity consistency, predictability comfort, attachment security, intentionality signal, inconsistency sensitivity, false consistency risk, and rigid consistency risk.
  - Track emotional intensity as emotional activation, psychological impact, attachment force, vulnerability weight, and emotional significance, distinct from passion, intimacy, attachment, chemistry, drama, safety, and health.
  - Support intensity sources such as vulnerability, tension, attachment, conflict, sexual, devotional, chaotic, transformational, forbidden, and mutual-recognition intensity.
  - Balance intensity with emotional safety and stability so the runtime can distinguish transformative emotional gravity from intensity addiction, emotional collapse, artificial drama, and chaos mistaken for love.
  - Track intensity variables such as attachment depth, emotional reactivity, vulnerability weight, fear of loss, obsession tendency, emotional saturation, devotional intensity, tension density, identity impact, intensity-safety balance, intensity addiction risk, intensity collapse risk, and artificial intensity risk.
  - Track challenge as stimulation through resistance, growth pressure, self-confrontation, and expansion, distinct from conflict, hostility, competition, tension, criticism, and toxicity.
  - Support challenge types such as intellectual, emotional, identity, competitive, moral, emotional-regulation, vulnerability, sexual, autonomy, and stability challenge.
  - Balance challenge with emotional safety so the runtime can distinguish growth-oriented intimacy from volatility, exhaustion, destructive challenge, contempt, coercion, or stagnation.
  - Track challenge variables such as stimulation need, conflict tolerance, growth orientation, ego sensitivity, competitiveness, vulnerability resistance, transformation readiness, stability need, curiosity, challenge-safety balance, admiration potential, destructive challenge risk, exhaustion risk, and stagnation risk.
  - Track chemistry type separately from compatibility, attraction, attachment, and intimacy so the runtime can shape why interactions feel charged without assuming the relationship is healthy or sustainable.
  - Support chemistry profiles such as banter, tension, comfort, intellectual, sexual, emotional, chaotic, protective, devotional, oppositional, domestic, melancholic, predatory, soft longing, and transformational chemistry, with chemistry allowed to evolve across the route.
  - Add an adult-gated sexual chemistry sublayer for physical awareness, tension, responsiveness, escalation comfort, vulnerability linkage, touch sensitivity, and anticipation, while keeping consent, reciprocity, adult-only eligibility, and minor-NPC exclusion app-controlled.
  - Support adult-gated sexual chemistry modes such as slow burn, explosive, playful, devotional, dominance-tension, emotional, forbidden, and soft domestic, with escalation disabled when the adult module is off or scene boundaries are not met.
  - Track trust mechanics as layered emotional prediction and risk tolerance rather than a single trust score, governing what emotional risks a character is willing to take.
  - Support trust dimensions such as emotional trust, reliability trust, vulnerability trust, loyalty trust, conflict trust, physical trust, sexual trust, autonomy trust, and repair trust.
  - Use trust thresholds to gate believable escalation events such as emotional confession, dependency, trauma disclosure, sexual vulnerability, commitment, and emotional surrender.
  - Make trust damage persistent and layer-specific, so broken promises damage reliability trust, mocked vulnerability damages vulnerability trust, abandonment during conflict damages conflict trust, and coercive pressure damages autonomy, physical, or sexual trust.
  - Track trust variables such as emotional trust, reliability trust, vulnerability trust, loyalty trust, conflict trust, physical trust, sexual trust, autonomy trust, repair trust, trust fragility, trust recovery speed, trust persistence, trust damage memory, threshold readiness, faith under uncertainty, dependability evidence, and vulnerability risk tolerance.
  - Track rupture severity as the emotional, psychological, relational, and attachment damage caused by conflict, betrayal, disconnection, violation, or destabilizing events, separate from conflict itself.
  - Score rupture severity across trust damage, attachment damage, identity damage, vulnerability damage, emotional safety damage, exclusivity damage, stability damage, and momentum damage so repair effort scales with actual emotional impact.
  - Support rupture severity levels from no meaningful rupture through minor friction, emotional discomfort, significant rupture, major attachment rupture, and identity-level rupture.
  - Track rupture variables such as trust damage severity, attachment damage severity, identity damage severity, vulnerability damage severity, emotional safety damage severity, exclusivity damage severity, stability damage severity, momentum damage severity, repair difficulty, rupture memory weight, accountability need, consistency restoration need, symbolic repair need, hypervigilance increase, future vulnerability delay, rupture context sensitivity, infinite punishment risk, and consequence reset risk.
  - Support rupture subtypes such as betrayal rupture, abandonment rupture, humiliation rupture, broken promise rupture, and emotional invalidation rupture so repair targets the actual damaged trust layer.
  - Track rupture subtype variables such as betrayal rupture severity, abandonment rupture severity, humiliation rupture severity, broken promise rupture severity, invalidation rupture severity, trust rupture severity, attachment destabilization, emotional presence collapse, shame activation severity, reliability trust damage, emotional validation reliability, emotional self-trust damage, vulnerability shutdown, emotional permanence damage, dignity damage, promise weight, repair credibility, reconciliation viability, emotional return trust, and repair recognition capacity.
  - Track repair arcs as post-rupture story paths selected by rupture type, severity, trust damage, accountability, changed behavior, and emotional readiness.
  - Support repair arcs such as clarification, apology, reassurance, accountability, trust rebuilding, emotional safety, presence, boundary, mutual responsibility, redemption, reconciliation, and non-repair.
  - Match repair arcs to wounds so misunderstanding needs clarity, insecurity needs reassurance, neglect needs renewed presence, broken promises need consistency, betrayal needs accountability, humiliation needs dignity restoration, abandonment needs reliable return, and boundary violations need demonstrated respect.
  - Track repair arc variables such as repair arc, repair readiness, accountability level, hurt partner openness, trust damage, repair attempts, changed behavior evidence, resentment level, forgiveness readiness, emotional readiness, validation quality, reassurance effectiveness, boundary respect evidence, presence reliability, reconciliation viability, and closure readiness.
  - Track emotional neglect as chronic emotional under-response that erodes attachment through inattentiveness, unavailability, reassurance neglect, vulnerability neglect, conflict neglect, presence neglect, priority neglect, affection neglect, ritual neglect, and psychological neglect.
  - Track neglect variables such as emotional responsiveness, reassurance consistency, presence stability, ritual maintenance, emotional prioritization, vulnerability responsiveness, repair engagement, emotional visibility, inattentiveness level, priority neglect, affection neglect, psychological neglect, drift risk, resignation risk, and one-sided labor risk.
  - Track emotional safety as the felt sense that vulnerability, honesty, emotional needs, mistakes, fears, and authentic self-expression will not be punished, humiliated, abandoned, or weaponized.
  - Support emotional safety components such as vulnerability safety, conflict safety, emotional consistency, acceptance safety, boundary safety, reassurance safety, repair safety, and nonjudgmental presence.
  - Distinguish emotional safety from trust, comfort, attachment, stability, and chemistry so high chemistry with low safety can remain volatile instead of being mistaken for healthy intimacy.
  - Track emotional safety variables such as vulnerability safety, conflict safety, consistency, boundary respect, reassurance reliability, judgment sensitivity, emotional stability, repair trust, authenticity comfort, conditional safety risk, and false safety risk.
  - Track caretaking as emotional, physical, practical, or psychological care that supports wellbeing, regulation, comfort, safety, and functioning without erasing autonomy.
  - Support caretaking types such as emotional, physical, practical, protective, reassurance-based, domestic, devotional, mutual, silent, and transformational caretaking.
  - Distinguish healthy caretaking from control, rescue, emotional parenting, martyrdom, codependency, infantilizing support, transactional care, and dependency encouragement.
  - Track caretaking variables such as caretaking instinct, emotional responsiveness, protective impulse, autonomy respect, reassurance ability, domestic integration, burnout risk, reciprocity balance, emotional attunement, support consent, dependency encouragement risk, control disguised as care risk, martyrdom risk, and noticing sensitivity.
  - Track affection expression style as behavioral emotional translation: how a character naturally communicates care, attachment, desire, and emotional significance, distinct from love intensity, attachment depth, commitment, love-language reception, intimacy style, and communication style.
  - Support affection expression styles such as verbal, physical, caretaking, protective, teasing, devotional, quiet, service-based, attention-based, possessive, playful, emotional transparency, loyalty-based, sacrificial, domestic, admiration-based, and presence-based affection.
  - Treat love-language reception as the receiving side of affection: what behaviors make the character feel emotionally loved and recognized, including affirmation, touch, service, quality time, gifts/symbols, reassurance, transparency, protection, devotional attention, play, presence during distress, and exclusivity signals.
  - Model expression/reception mismatch so a character can show love in one mode while needing to receive love in another, creating believable loneliness despite care and repair through emotional translation.
  - Track affection-expression variables such as verbal expressiveness, physical affection frequency, caretaking instinct, protective impulse, playfulness, devotional focus, emotional transparency, presence reliability, attention intensity, domestic integration, service orientation, loyalty consistency, sacrificial tendency, admiration visibility, possessive signaling, reception match accuracy, expression evolution, and mismatch risk.
  - Track intimacy as sustained mutual emotional access, separate from attraction, chemistry, vulnerability, attachment, dependency, affection, romance, and sex.
  - Model intimacy as exposure plus safe reception plus consistency over time, using emotional safety, familiarity, reception, consistency, trust, vulnerability depth, reciprocity, comfort, attachment, shared history, domestic integration, and emotional attunement as hidden variables.
  - Support intimacy modes such as emotional, physical, sexual, intellectual, domestic, vulnerability, experiential, silent, protective, and identity intimacy, with false-intimacy checks for obsession, dependency, constant contact, sexual intensity, or trauma dumping.
  - Let intimacy soften rigid power structures over time, such as dominant characters becoming vulnerable, guarded characters relying safely, or reactive characters becoming trusted caretakers.
  - Track intimacy style as the character's emotional language of closeness, separate from attachment style, love language, chemistry, and relationship dynamic.
  - Support intimacy styles such as emotional, physical, domestic, intellectual, playful, protective, devotional, quiet, sexual, vulnerability-based, service-based, tension-based, chaos, mutual competence, and transformational intimacy.
  - Use intimacy-style mismatch as a source of believable conflict and growth when characters care deeply but recognize closeness through different behaviors.
  - Track intimacy-style variables such as emotional openness, physical affection need, domestic integration, intellectual engagement, playfulness, protective instinct, devotional intensity, sexual responsiveness, quiet comfort, style compatibility, adaptation willingness, and recognition need.
  - Track commitment style as the character's approach to permanence, exclusivity, emotional responsibility, future-building, and relational stability.
  - Support commitment styles such as secure, devotional, avoidant, anxious, fearful, situational, protective, idealistic, pragmatic, independent, chaotic, and slow-build commitment.
  - Treat commitment evidence as consistency, future language, emotional availability, prioritization, repair attempts, and life integration, not only relationship labels or declarations.
  - Track commitment variables such as commitment readiness, exclusivity need, autonomy need, stability desire, fear of engulfment, fear of abandonment, future orientation, loyalty intensity, repair persistence, label comfort, integration comfort, and breakup risk.
  - Track autonomy as preserved selfhood, agency, identity, boundaries, and internal emotional independence inside intimacy and attachment.
  - Support autonomy types such as emotional autonomy, identity autonomy, social autonomy, emotional boundary autonomy, decision-making autonomy, sexual autonomy, and psychological autonomy.
  - Model autonomy styles such as high-autonomy, fusion-oriented, balanced interdependence, and fluctuating autonomy, and distinguish healthy space from avoidance and healthy closeness from codependency.
  - Track autonomy variables such as autonomy need, emotional independence, space need, fusion desire, boundary strength, dependency comfort, identity stability, closeness tolerance, exclusivity sensitivity, engulfment fear, codependency risk, and intimacy starvation risk.
  - Track relationship boundaries as emotional, physical, psychological, relational, and behavioral limits that define what feels safe, acceptable, respectful, intimate, exclusive, or sustainable.
  - Support boundary types such as emotional, vulnerability, conflict, physical, sexual, exclusivity, communication, autonomy, social, time, psychological, and ritual boundaries.
  - Model boundary styles such as rigid, porous, flexible, and inconsistent, and treat healthy boundaries as intimacy-enabling rather than rejection or lack of love.
  - Track boundary variables such as emotional boundary strength, vulnerability pace preference, autonomy preservation, exclusivity boundary strictness, conflict boundary clarity, consent sensitivity, space need, privacy need, boundary flexibility, physical boundary comfort, sexual boundary clarity, communication boundary clarity, time boundary strength, psychological boundary strength, ritual boundary importance, boundary negotiation skill, violation sensitivity, boundary repair readiness, coercion risk, and boundary punishment risk.
  - Track exclusivity as layered emotional, romantic, sexual, psychological, ritual, future, social, and vulnerability access, not as a single monogamy boolean or ownership flag.
  - Support exclusivity styles such as fully monogamous, emotionally monogamous, sexually possessive, emotionally possessive, devotional, autonomous, flexible/negotiated, low exclusivity need, and high territorial exclusivity, while distinguishing chosen prioritization from possessiveness, coercion, or autonomy collapse.
  - Track exclusivity variables such as emotional exclusivity need, sexual exclusivity need, prioritization sensitivity, ritual exclusivity importance, relationship visibility style, boundary rigidity, emotional sharing tolerance, territoriality level, jealousy reactivity, autonomy preservation, emotional permanence need, and boundary flexibility.
  - Track relationship structures such as monogamous, monogamish, open, polyamorous, hierarchical poly, non-hierarchical poly, relationship anarchy, solo poly, sexual non-exclusive, swinging, and undefined structures.
  - Model ENM and poly dynamics through consent clarity, boundary clarity, communication transparency, emotional bandwidth, time allocation pressure, hierarchy preference, relationship differentiation, compersion capacity, jealousy sensitivity, reassurance need, agreement stability, ambiguity risk, coercion risk, and emotional neglect risk.
  - Track relationship expectations as conscious or unconscious beliefs about how love, intimacy, care, commitment, conflict, and emotional priority are supposed to work.
  - Support expectation categories for communication, affection, commitment, conflict resolution, intimacy, exclusivity, availability, relationship roles, romantic fantasy, repair, future, and emotional priority.
  - Treat expectation mismatch and expectation violation as major drivers of jealousy, disappointment, conflict, repair arcs, and renegotiated intimacy.
  - Track expectation variables such as reassurance expectation, communication expectation, exclusivity expectation, conflict resolution expectation, emotional availability expectation, affection expectation, future orientation, independence expectation, mind-reading expectation, mismatch risk, violation sensitivity, and renegotiation openness.
  - Track emotional restraint as the pressure-building layer between attraction and expression, including social, self-protective, power-based, protective, mutual, fear-based, identity-based, and devotional restraint.
  - Use restraint variables such as vulnerability resistance, emotional leakage, composure, emotional pressure, fear of consequence, desire suppression, and confession threshold to create slow-burn micro-tension and earned release.
  - Treat confessions as phase-transition events: intentional revelations of emotionally significant truth that collapse ambiguity, shift leverage, and alter future interpretation.
  - Support confession types such as romantic, vulnerability, dependency, desire, fear, jealousy, betrayal, identity, devotional, and silent confession, with styles such as direct, indirect, accidental, defensive, desperate, quiet, and silent.
  - Treat redemption as sustained demonstrated transformation after harm, separate from punishment, guilt, forgiveness, atonement, reconciliation, and self-forgiveness.
  - Support redemption arcs for betrayal, moral harm, emotional harm, self-redemption, protective failure, and identity collapse, with phases for harm, awareness, unworthiness, atonement, trust resistance, demonstration, emotional reopening, and reconciliation.
  - Track reassurance as behavior that restores emotional safety, significance, trust, or relational security after uncertainty, fear, vulnerability, jealousy, conflict, or destabilization.
  - Support reassurance modes such as verbal, physical, behavioral, protective, exclusivity, conflict, vulnerability, silent, devotional, and future-oriented reassurance.
  - Treat reassurance failure, saturation, credibility, and underlying-fear alignment as important attachment stabilizers rather than assuming all affectionate statements repair insecurity.
  - Track reassurance variables such as reassurance need, reassurance ability, emotional security, fear of abandonment, trust stability, validation sensitivity, consistency, repair speed, reassurance credibility, reassurance saturation, and underlying fear addressed.
  - Track romantic intent as the hidden emotional objective behind behavior, separate from emotion, surface dialogue, tone, and practical goals.
  - Support intent categories such as connection-seeking, reassurance-seeking, emotional testing, desire expression, self-protection, control, comfort-giving, provocation, vulnerability, avoidance, possessiveness, and repair so the model can write subtext instead of literal dialogue.
  - Track teasing as playful emotional provocation that creates attention, tension, intimacy, reaction, or flirtation while preserving emotional safety and reciprocity.
  - Support teasing modes such as playful, flirtatious, affectionate, competitive, protective, defensive, adult-gated sexual, devotional, soft-cruel, and silent teasing, with failure checks for mockery, bullying, humiliation, repetition, and cruelty without care.
  - Model bratty dynamics as a safety-bounded subtype of teasing and power negotiation: playful resistance plus attention-seeking, provocation, emotional testing, or flirt-tension creation.
  - Support bratty modes such as playfully defiant, attention-seeking, flirt-brat, defensive, competitive, affectionate, and chaos energy, while rejecting cruelty, contempt, boundary violation, and one-sided hostility.
  - Track relationship dynamic as the recurring emotional and behavioral loop between characters, separate from trope, chemistry, tone, and attachment.
  - Support dynamic profiles such as pursuer-withdrawer, banter rivals, caregiver-guarded, mutual yearning, chaotic push-pull, soft dominance plus playful resistance, emotional sanctuary, obsession, mutual competence admiration, emotional translation, protective dependency, devotional partnership, emotional chess, domestic comfort, and transformational dynamics.
  - Separate attraction from flirting expression, with flirting styles such as playful, teasing, sincere, bold, subtle, intellectual, protective, awkward, dominant, submissive, domestic, antagonistic, devotional, chaotic, and silent/nonverbal shaping dialogue and chemistry.
  - Model power dynamics as shifting leverage across emotional, social, psychological, sexual, protective, competence, dependency, pursuit/avoidance, mutual-dominance, and soft-dominance axes rather than static Dom/Sub flags.
  - Model dominance/submission as consent-responsive relational energy patterns involving initiative, guidance, yielding, emotional leadership, responsiveness, and power exchange across flirting, pacing, caretaking, teasing, and conflict.
  - Support D/s modes such as soft dominance plus playful submission, emotional leadership, tension control, mutual dominance, devotional submission, protective dominance, brat-handler, service-oriented submission, command/resistance, and switch dynamics.
  - Model dominant archetypes as distinct emotional influence strategies, including soft, teasing, protective, commanding, devotional, intellectual, chaotic, possessive, service, stoic, predator, rival, gentle caretaker, sadistic tease, and only-soft-for-you patterns.
  - Let dominant archetypes blend and evolve over time, such as commanding to protective to vulnerable to devotional, instead of treating dominance as a static order-giving label.
  - Model submissive archetypes as active emotional participation through responsiveness and trust, not weakness, passivity, or obedience without agency.
  - Support submissive archetypes such as brat, devotional, soft, praise-seeking, stoic, service-oriented, reactive, guarded, chaotic, curious, emotionally hungry, only-vulnerable-with-you, emotional mirror, competent, and yearning patterns.
  - Model switch archetypes as adaptive power fluidity where emotional leadership, yielding, vulnerability, dominance, or submission shifts by context, mood, trust, chemistry, or need.
  - Support switch archetypes such as playful, emotional, guarded, competitive, devotional, brat-to-soft, stoic-to-reactive, service/control, chaotic, competent vulnerability, mirror, and only-with-you patterns.
  - Treat kink-aware dynamics as opt-in style and meaning layers over romance, not as replacements for trust, attachment, pacing, consent, or emotional development.
  - Support kink-aware categories such as praise, power exchange, attention/focus, restraint/denial, protective caretaking, vulnerability, possessive/claiming, competence admiration, brat/provocation, devotional, emotional dependency, chase, corruption/transformation, size/strength/protection, and emotional overwhelm dynamics.
  - Support granular kink tag groups for affection/attention, power exchange, tension/anticipation, emotional vulnerability, devotional/romantic, psychological, sensory/physical, praise/degradation spectrum, possession/exclusivity, romantic roleplay, attachment-linked, and intimacy-oriented dynamics.
  - Track kink variables such as trust, responsiveness, power preference, attention need, validation need, vulnerability comfort, tension enjoyment, emotional dependency, exclusivity desire, fantasy integration, boundary fit, attachment link strength, wound resonance, consent clarity, and aftercare need.
  - Block or redirect kink-aware escalation when adult eligibility, boundaries, consent, reciprocity, or scene context are not met.
  - Treat fetish-aware dynamics as narrower, stimulus-specific attraction triggers that shape attention, sensory focus, symbolic intimacy, tension, and fixation without replacing relationship development.
  - Support fetish-aware categories such as body-part, clothing/material, sensory, psychological/situational, power/control, emotional/attachment, relationship-dynamic, and fantasy-archetype fixations.
  - Track fetish focus tags for body parts, clothing/materials, sensory triggers, psychological situations, power/control, emotional/attachment, relationship dynamics, and fantasy archetypes.
  - Track fetish variables such as attention fixation, sensory responsiveness, emotional symbolism, trust, tension enjoyment, validation need, power comfort, emotional reactivity, novelty seeking, symbolic intimacy, boundary fit, desire style link, attachment pattern link, fixation centrality, and context specificity.
  - Inject the current emotional brain into compiled runtime context so the model cannot rush emotional intimacy, confession, trust, or physical affection beyond the active gate.
  - Keep app-owned control over continuity, progression, pacing, memory persistence, and boundaries while leaving dialogue, chemistry, body language, banter, and scene detail emergent from the model.
  - Avoid VN-style dialogue trees, exact scripted emotional responses, and visible affection/trust meters.
  - Keep Plutchik-style emotion blends, body cues, sensory priorities, and intimacy scores as internal compiler data only. Users should see simple engine labels, route tags, milestones, and optional relationship progress, not the underlying matrix.
- Enforce minor-NPC safety in runtime context: minor NPCs may appear in SFW family/slice-of-life scenes, but must not participate in or remain present for sexual/NSFW scenes.
- Rebuild CharacterGen `chat_context_compiler.py`, `runtime_chat.py`, and `runtime_state.py` as HeartWriteAI-native modules:
  - TypeScript compiler for previewable prompt assembly
  - Tauri/Rust persistence for local sessions where needed
  - token budgeting and recent-chat pruning
  - summaries and persistent memory blocks
  - deterministic trigger engine for route milestones and intimacy gates
  - stop sequence presets
  - group-chat next-speaker routing

Exit criteria:

- Chat runtime consumes compiled context instead of raw page state.
- Lorebooks and scenario arcs can influence ongoing chat beyond the opening message.
- Romance progression is paced by app-owned event flags and emotional triggers rather than by asking the model to self-police its own intimacy level.
- Users can preview what context will be sent before chat starts.
- Runtime session state remains separate from stable card assets.

## Phase 6.5: Group Chat and Multi-Character Runtime

Goal: bring over the useful CharacterGen chat-workspace concepts without porting the PyQt UI.

- Create a Next.js group-chat workspace with participant roster, active card/persona/lore visibility, and compact session panels.
- Add a next-speaker orchestrator that can choose which character should reply next.
- Format group history explicitly as speaker-labeled turns.
- Support per-character active lorebooks and shared scene state.
- Keep group-only greetings and CCV3 group greeting fields visible in the editor.

Exit criteria:

- A user can stage a multi-character room from imported/generated cards.
- Each character receives only the relevant compiled context plus shared scene state.
- Group sessions can be saved and resumed locally.

## Phase 7: Legacy and Generational Series Tools

Goal: support long-running romance series, families, and adult descendant casts without making unsafe user or NPC assumptions.

- Generate adult-only offspring and legacy profile drafts from parent cards.
- Track inherited names, species/world rules, relationship lineage, and suggested AU/trope tags.
- Keep children as SFW-only NPC context when needed for family realism.
- Promote adult descendants into normal editable character cards only after explicit user review.

Exit criteria:

- Users can plan a generational series without manually rebuilding every inherited trait.
- Generated legacy outputs include safety notes and remain editable before card export.

## Phase 8: Reference Bundle Distillation and Prompt Quality

Goal: move valuable CharacterGen prompt/reference material into HeartWriteAI without importing raw source dumps or bloated wording.

- Convert old base prompts and persona prompts into versioned prompt packs.
- Distill design-reference files into small runtime references:
  - character psychology
  - romance craft
  - setting scaffolds
  - emotion, feeling, body-sensation, and sensory lexicon coverage
  - explicit dialogue boundaries
  - prompt validation
  - source quality/quarantine rules
- Use inbox emotion/sensation charts as reference-only taxonomy inputs. Do not commit, ship, or directly transcribe the source charts; build an app-owned lexicon from distilled categories and aliases.
- Keep explicit/BDSM material as consent-forward behavior, safety, role motivation, negotiation, aftercare, and anti-flattening guidance.
- Quarantine weak, unsafe, redundant, or source-dumped material.
- Add regression tests or golden examples for high-risk prompt routing.

Exit criteria:

- Prompt packs are editable, versioned, and explainable.
- Reference material improves output behavior without leaking raw source prose.
- The app can tell users why a reference pack or route suggestion was applied.

## Defaults and Constraints

- New cards are CCV3-first.
- PNG/APNG with embedded CCV3 metadata is the primary saved card format.
- CHARX is reserved for bundle/archive workflows that need adjacent assets.
- V1/V2 support exists for import, conversion, and sanity checks.
- User-facing editing should be readable fields and controls, not exposed raw JSON.
- JSON remains necessary for export, embedded PNG metadata, validation, and debugging.
- HeartWriteAI-only `.hwcard` imports/exports are out of scope.
- Tauri is the primary desktop wrapper unless a concrete Electron-only requirement appears.
- Auto-update remains disabled until signing keys, HTTPS releases, updater artifacts, rollback behavior, and staged rollout are real.
- CharacterGen Python/PyQt remains a reference archive. HeartWriteAI implementation lives in Next.js, Tailwind, TypeScript, Rust, and Tauri v2.
