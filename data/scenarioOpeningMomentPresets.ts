export type ScenarioOpeningMomentPresetCategory =
  | "Archetype"
  | "Opening Seed"
  | "First Meeting Mode"
  | "Inciting Incident"
  | "Conflict Starter"
  | "Confession Trigger"
  | "Domestic Opener"
  | "Danger Opener"
  | "Emotional Opener"
  | "Gate"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface ScenarioOpeningMomentPreset {
  id: string;
  category: ScenarioOpeningMomentPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledScenarioOpeningMomentPresetAdditions {
  scenarioAddition: string;
  firstMessageAddition: string;
  systemPromptAddition: string;
}

interface ScenarioOpeningMomentSeedGroup {
  category: ScenarioOpeningMomentPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const SCENARIO_OPENING_MOMENT_GUIDANCE =
  "Use this as scenario opening texture. First meetings, inciting incidents, conflict starters, confession triggers, domestic openers, danger, and emotional hooks may launch a scene without forcing {{user}} response, romance, danger, or escalation.";

const CONSENT_SAFE_TROPE_GUIDANCE =
  "One-bed, forced proximity, fake relationship, soulmark, and mate-bond openers are fictional trope pressure only. Preserve consent, choice, boundaries, refusal, and the option to slow down or reject the premise.";

const DANGER_OPENER_GUIDANCE =
  "Use this as fictional danger-opener texture. Danger can create urgency, protection, fear, rescue, or investigation while preserving {{user}} agency, escape routes, consent, and de-escalation.";

const EMOTIONAL_OPENER_GUIDANCE =
  "Use this as emotional opening texture. Panic, grief, shame, exhaustion, kindness, apology, and trust tests should stay non-diagnostic, supportive, boundary-aware, and responsive to {{user}} agency.";

export const scenarioOpeningMomentPresets = [
  "Meet Cute",
  "Meet Disaster",
  "Rescue First Meeting",
  "Mistaken Identity",
  "Forced Proximity Opening",
  "Enemies First Clash",
  "Rivals First Challenge",
  "Fake Relationship Inciting Incident",
  "Secret Assignment",
  "Single Room Arrival",
  "Domestic Morning Opener",
  "Rainstorm Shelter",
  "Danger at the Door",
  "Injury Care Opener",
  "Confession Under Pressure",
  "Jealousy Trigger",
  "Old Flame Returns",
  "Safehouse Arrival",
  "Public Scandal",
  "Life-or-Death Choice",
];

export const scenarioOpeningMomentSeeds = [
  "scenario_opening",
  "opening_moment",
  "first_scene",
  "inciting_incident",
  "first_meeting",
  "conflict_starter",
  "romance_starter",
  "danger_opener",
  "domestic_opener",
  "confession_trigger",
  "forced_proximity_start",
  "relationship_shift_start",
  "plot_hook",
  "scene_prompt",
  "roleplay_opener",
  "character_card_opening",
  "first_message_seed",
  "tension_starter",
  "emotional_hook",
  "story_launch",
];

const firstMeetingModeSeedCore = [
  "meet_cute",
  "meet_disaster",
  "rescue_meeting",
  "mistaken_identity",
  "wrong_room_meeting",
  "shared_table_meeting",
  "coffee_spill_meeting",
  "bookstore_meeting",
  "library_meeting",
  "market_meeting",
  "train_station_meeting",
  "airport_meeting",
  "rainstorm_meeting",
  "masked_ball_meeting",
  "court_introduction",
  "academy_first_day",
  "workplace_first_day",
  "new_neighbor_meeting",
  "bodyguard_assignment_meeting",
  "enemy_across_battlefield_meeting",
  "rival_introduction",
  "arranged_match_first_meeting",
  "fake_date_first_meeting",
  "safehouse_first_meeting",
  "hospital_bedside_meeting",
  "accidental_roommates_meeting",
  "undercover_identity_meeting",
  "summoning_circle_meeting",
  "crash_landing_meeting",
  "distress_signal_meeting",
];

const meetCuteScenarioOpeningPresets = [
  "Coffee Shop — Bumping into each other while reaching for the same coffee order.",
  "Bookstore — Both reach for the same book on a shelf.",
  "Airport — Sitting next to each other during a flight delay.",
  "Subway — One falls into the lap of another as the train jolts.",
  "Dog Park — Each of their pets runs after the other.",
  "Art Gallery — Having different opinions of a painting.",
  "Music Festival — Dancing the same awkward way to the music.",
  "Wedding — Catching the bouquet and the garter.",
  "Gardening Store — Both reaching for the last bag of soil.",
  "Food Truck — Ordering the same unique dish.",
  "Charity Event — Volunteering side by side.",
  "Escape Room — Working together to solve puzzles.",
  "Hiking Trail — Being lost on the same path.",
  "Farmers' Market — Both reaching for the last ripe tomato.",
  "Yoga Class — Accidentally knocking each other over.",
  "Karaoke Night — Being forced to sing a duet together.",
  "Dog Shelter — Wanting to adopt the same dog.",
  "Antique Shop — Haggling over the same vintage item.",
  "Picnic in the Park — The wind blows their picnic blankets together.",
  "Film Premiere — Spilling popcorn on the other.",
  "Food Truck Festival — Being last in line for closing food truck.",
  "Bike Ride — Colliding and falling in a heap.",
  "Outdoor Concert — Dancing next to each other in the rain.",
  "Museum — Discussing a historical artifact.",
  "Train Station — Both missing their train.",
  "Pet Store — Playfully arguing over which fish to buy.",
  "Costume Party — Wearing complementary costumes.",
  "Ferry Ride — Being seasick next to each other on the deck.",
  "Carnival — Being randomly seated next to each other on a Ferris wheel.",
  "Board Game Night — Competing in a heated game with friends.",
  "Bakery — Both reaching for the last croissant.",
  "Rock Climbing — Helping the other who is frozen in fear.",
  "Thrift Store — Discovering they both bought the same vintage clothes.",
  "Salsa Dance Class — Becoming dance partners.",
  "Photography Workshop — Discovering that they took pictures of one another.",
  "Ballet Class — One is there for balance as a football player while the other is a true ballet dancer.",
  "Food Competition — Both judging the same dish.",
  "Hotel Bar — Sharing travel stories.",
  "Scavenger Hunt — Teaming up to find hidden clues.",
  "Beach Volleyball — Competing on opposing teams.",
  "Film Set — Working together as troublemaking extras.",
  "Piano Lessons — Mistaking the other for a fellow student when they’re actually the teacher.",
  "Movie Audition — Auditioning for the same role.",
  "Paint and Sip — Painting side by side.",
  "Campground — Accidentally going into someone else’s tent.",
  "Cooking Class — Being partnered to make a dish.",
  "New Year’s Eve Fireworks — Needing someone to kiss.",
  "Trivia Night — Going up against each other.",
  "DIY Workshop — One is teaching and the other is learning.",
  "Christmas Tree Lot — Reaching for the same tree.",
  "Protest or Rally — Debating different sides but with instant attraction.",
  "College Orientation — Being paired as roommates by mistake.",
  "Tennis Court — Hitting a ball into the next court.",
  "Bike Race — Crashing into each other.",
  "Beekeeping Workshop — One freaks out while the other calms them.",
  "Comic Convention — Bonding over shared fandom.",
  "Photobooth — Squeezing into a small booth together by accident.",
  "Choir Practice — Being paired together for a duet.",
  "Ice Skating Rink — Both trying to regain balance.",
  "Ski Resort — Riding the same ski lift.",
  "Underwater Scuba Dive — Exploring the depths together.",
  "Botanical Garden — One dealing with an allergy attack while the other helps.",
  "Sushi Bar — Sharing a laugh over a sushi mishap.",
  "Zip Line Adventure — One freezing in fear while the other helps them.",
  "Sailing Mishap — Boats nearly crash into one another.",
  "Food Festival — Rival jam selling.",
  "Local Theater Production — Overbearing director versus lead actor.",
  "Jazz Club — Playing jazz together as strangers.",
  "Dog Obedience Class — Training their unruly dogs.",
  "Hot Air Balloon Ride — Surviving an accident.",
  "Camping Trip — Seeing each other from one fire pit to the next.",
  "Paddleboarding — Trying to balance on paddleboards.",
  "Horseback Riding — Going out of control as another rescues them.",
  "Wine Tasting — Sitting at the same wine bar.",
  "Aquarium — Admiring colorful marine life.",
  "Pottery Class — Creating art from clay together.",
  "Restaurant — Requesting to meet the chef.",
  "Indoor Skydiving — One instructing the other.",
  "Meditation Retreat — Being the only two that can’t relax.",
  "Zoo — Divorced parents taking their kids to the zoo and meeting.",
  "Rock Concert — Saving someone from a mosh pit.",
  "Dance — Being partnered by chance.",
  "Uber Ride — A glitch scheduling two rides at the same time.",
  "Local Park — Single parents see their kids playing together.",
  "College Library — Both reach for the same book.",
  "Martial Arts Class — Being partnered to spar with each other.",
  "Apple Orchard — One falls from a tree while the other saves them.",
  "Sailing Regatta — Competing against each other.",
  "Science Museum — Exploring interactive exhibits.",
  "Amusement Park — Riding a roller coaster together.",
  "Art Class — A nude model falls for one of the painters.",
  "Book Club — Debating the quality of an assigned book.",
  "Poker Tournament — Going all-in against each other.",
  "Kids Soccer Game — Coaching against each other.",
  "Potluck Dinner — Bringing the same dishes.",
  "Community Class — Student mistaking instructor for a student.",
  "Bowling Alley — Throwing bowling ball into someone else’s lane.",
  "Water Park — Lifeguard saving a person who doesn’t swim well.",
  "Street Corner — Bumping into each other and mixing up their things.",
  "Spa — Going into the same massage room in the nude by accident.",
  "Bumping into each other on a crowded city street and dropping everything",
  "Reaching for the last item on a store shelf at the same time",
  "Getting stuck in an elevator together",
  "Sitting next to each other on a plane/train and striking up a conversation",
  "Having the same boring office job and bonding over hating it",
  "Waiting in the long line at a food truck and chatting to pass the time",
  "Competing for the same apartment/house and butting heads initially",
  "One character is a dog walker, the other’s dog gets away and they chase it together",
  "Neighbors who keep running into each other doing laundry",
  "Arguing over the same cab/Uber and ending up sharing it",
  "Meeting at a bad blind date – realizing they were set up with the wrong people",
  "Getting kicked out of a nightclub at the same time for a silly reason",
  "Battling for the same parking spot and having a confrontation",
  "Running into each other at the dog park while playing with their dogs",
  "Roommates whose friends ditch them so they end up hanging out",
  "Tourist asking a local for directions and getting helped out",
  "Spilling coffee/food on each other in a cafe line",
  "Getting sat next to each other at a wedding reception",
  "Competing on opposing teams in a trivia night",
  "Singing horribly at a karaoke night and bonding over it",
  "Working as co-volunteers for a charitable event",
  "A case of mistaken identity or misunderstanding",
  "Being in the same yoga/workout class and encouraging each other",
  "Sitting next to each other on a long bus ride and conversing",
  "Getting their pets confused at the vet’s office",
  "Working as baristas at the same coffee shop",
  "Waiters at the same restaurant who despise a rude customer together",
  "College classmates in a huge lecture hall",
  "One saving the other from choking at a restaurant",
  "Locking themselves out of their apartment/home on the same day",
  "Neighbors arguing over a property line dispute",
  "New employees at a company who get lost together on the first day",
  "Rivals fighting over a job promotion who are forced to work together",
  "Speed dating participants who only seem to click with each other",
  "Bickering strangers on a jury who slowly warm up over the trial",
  "One tutors the other for a subject they struggle with",
  "They meet in line for a hugely popular concert/event",
  "Competing for the same tutoring job and trying to one-up each other",
  "Volunteer Santa and elf at a holiday event",
  "Having the same take-out food delivery guy mix up their orders",
  "Geeky fans bonding over a mutual interest at a convention",
  "Neighbors having a noise/disturbance dispute that leads to friendship",
  "One is an author, the other is a reader who idolizes them",
  "Bickering apartment-hunters being shown the same place",
  "Riders on the same commuter train/bus every day",
  "Summer camp counselors assigned to work together",
  "Arguing over the check at a restaurant when their dates ditch them",
  "Meeting in an airport when their flights are delayed",
  "Neighbors who hit it off while collecting packages for each other",
  "Rival bakery/restaurant/shop owners who later bond",
  "Meeting at a high school reunion after being interested in high school",
  "Members of rival kickball/bowling/recreational sports teams",
  "Falling into a fountain or body of water and helping each other out",
  "Arguing parents at their kids’ little league game",
  "A cashier and a loyal customer who frequent the same shop",
  "Signing up for the same terrible dating service and getting matched",
  "Meeting at a disastrous bank robbery and bonding over the trauma",
  "Riding in the same Uber or taxi and realizing they know someone in common",
  "Running the same nature trail and bonding over the activity",
  "An accidental pocket dial that leads to an actual conversation",
  "Meeting while stuck overnight working late on a group project",
  "Getting their kids, dogs, belongings mixed up at a busy park",
  "Sharing an oversold hotel room on vacation due to a mixup",
  "Coming from very different backgrounds but finding common ground",
  "Taking a required workplace safety training class together",
  "Being set up on a blind date by meddling but well-meaning friends",
  "Pizza delivery person and a customer who keeps ordering",
  "Valet with a rude customer whose day they end up turning around",
  "Apartment building regulars keep running into each other",
  "Amateur actors cast as  romantic leads in a community theater production",
  "Grabbing for the same book at a used bookstore sale",
  "Taking turns saving each other in an arcade shooting game",
  "One gives the other directions when they’re hopelessly lost",
  "Food truck vendors with competing businesses who fall for each other",
  "Gardeners at a communal community garden plot",
  "Each returns the other’s lost wallet or item, sparking a connection",
  "Vying for the same job at an interview then later connecting",
  "Regulars at the same bar who are there every night after work",
  "Adult education/learning annex class they randomly signed up for",
  "Members of the same gym who encourage each other’s fitness goals",
  "Art gallery attendees who debate over a strange modern piece",
  "Volunteer Santa and mall elf who spread the holiday cheer together",
  "Playing as opponents in a competitive rec sports league",
  "Moving into the same apartment building on the same day",
  "Joining the same book club and having a combative debate",
  "Sitting across from each other struggling with a crossword on the train",
  "Arguing about the politics behind their opposing protest signs",
  "Sharing an Uber and getting trapped in traffic, allowing them to connect",
  "Camping at the same site but on different camping trips",
  "Bonding over being the only adults at a children’s theme park",
  "Taking the same disastrous cooking class but sticking it out",
  "The only two jurors who see things differently during deliberations",
  "Getting caught climbing the same fence or trespassing somewhere",
  "One saving the other from getting mugged or victimized in the city",
  "Battling for the same apartment and trying to undercut each other",
  "New employees having to work a graveyard shift together",
  "Arguing over who had the restaurant reservation first that night",
  "Waiting in the long return line after holiday shopping and venting",
  "Taking the same awful part-time job but making the best of it",
  "One helping the other deal with a home repair emergency as a pro",
];

export const firstMeetingModeSeeds = [...firstMeetingModeSeedCore, ...meetCuteScenarioOpeningPresets];

export const incitingIncidentSeeds = [
  "unexpected_assignment",
  "forced_partnership",
  "arranged_marriage_order",
  "fake_relationship_request",
  "inheritance_condition",
  "public_scandal",
  "secret_revealed",
  "dangerous_debt_called_in",
  "enemy_attack",
  "missing_person_case",
  "murder_investigation",
  "stolen_artifact",
  "prophecy_activated",
  "soulmark_revealed",
  "mate_bond_triggered",
  "curse_begins",
  "safehouse_needed",
  "storm_traps_them",
  "last_room_available",
  "one_bed_problem",
  "car_breakdown",
  "ship_malfunction",
  "life_support_alarm",
  "job_offer_changes_everything",
  "ex_returns",
  "family_demands_choice",
  "rival_challenge",
  "public_proposal_fake_or_real",
  "witness_protection_start",
  "escape_plan_goes_wrong",
];

export const conflictStarterSeeds = [
  "misunderstanding_starts_conflict",
  "opposing_goals",
  "competing_for_same_prize",
  "secret_agenda",
  "bad_first_impression",
  "old_grudge",
  "professional_rivalry",
  "family_rivalry",
  "class_gap_tension",
  "status_gap_tension",
  "power_gap_tension",
  "forbidden_rule",
  "broken_promise",
  "hidden_identity",
  "protective_lie",
  "jealousy_misread",
  "public_insult",
  "private_betrayal",
  "boundary_crossed",
  "trust_test_failed",
  "mission_conflict",
  "duty_vs_desire",
  "love_vs_reputation",
  "enemy_threatens_user",
  "patron_demands_separation",
  "employer_forbids_romance",
  "family_disapproves",
  "rival_interferes",
  "ex_complication",
  "secret_relationship_nearly_exposed",
];

export const confessionTriggerSeeds = [
  "near_loss_confession",
  "jealousy_breaks_denial",
  "injury_confession",
  "nightmare_confession",
  "rain_confession",
  "late_night_confession",
  "argument_confession",
  "forced_separation_confession",
  "fake_relationship_feels_real",
  "secret_almost_exposed",
  "public_choice_confession",
  "private_vow_confession",
  "truth_spell_confession",
  "soul_bond_confession",
  "one_bed_confession",
  "dance_confession",
  "letter_found_confession",
  "playlist_confession",
  "gift_reveals_feelings",
  "caretaking_breaks_wall",
  "protector_gets_protected",
  "user_asks_do_you_love_me",
  "character_says_stay",
  "final_battle_confession",
  "goodbye_confession",
];

export const domesticOpenerSeeds = [
  "morning_after_storm",
  "shared_breakfast",
  "coffee_made_wrong_but_sweet",
  "tea_after_bad_day",
  "cooking_together",
  "burnt_dinner_rescue",
  "laundry_day",
  "grocery_run",
  "apartment_power_outage",
  "fixing_leaky_sink",
  "cleaning_after_party",
  "sick_day_caretaking",
  "nightmare_comfort",
  "blanket_on_couch",
  "rainy_day_reading",
  "movie_night",
  "pet_escape_opener",
  "plant_watering_opener",
  "first_spare_key",
  "left_drawer_empty",
  "shared_chore_tension",
  "sleepy_kitchen_confession",
  "accidental_domesticity",
  "home_feels_too_real",
  "ordinary_morning_after_extraordinary_night",
];

export const dangerOpenerSeeds = [
  "danger_at_the_door",
  "blood_on_the_doorstep",
  "injured_character_arrives",
  "user_is_followed",
  "ambush_in_alley",
  "safehouse_compromised",
  "assassin_attack",
  "monster_attack",
  "enemy_siege",
  "poisoning_attempt",
  "kidnapping_attempt",
  "car_chase",
  "storm_traps_them",
  "ship_alarm",
  "life_support_failure",
  "spacewalk_accident",
  "curse_flare",
  "magic_backfire",
  "prophecy_warning",
  "rival_duel_challenge",
  "explosion_nearby",
  "blackout_with_threat",
  "witness_in_danger",
  "secret_identity_exposed",
  "final_warning_message",
];

export const emotionalOpenerSeeds = [
  "found_crying_in_private",
  "panic_attack_opener",
  "grief_anniversary",
  "old_letter_found",
  "unsent_message_discovered",
  "public_mask_slips",
  "character_returns_changed",
  "user_notices_they_are_not_fine",
  "quiet_breakdown",
  "first_time_asking_for_help",
  "too_tired_to_pretend",
  "lonely_holiday",
  "birthday_no_one_remembers",
  "homecoming_feels_wrong",
  "old_wound_reopened",
  "unexpected_kindness_breaks_them",
  "soft_touch_triggers_memory",
  "trust_test_opener",
  "apology_needed",
  "forgiveness_not_yet_possible",
];

export const scenarioOpeningGates = [
  "first_meeting_gate",
  "inciting_incident_gate",
  "first_conflict_gate",
  "first_forced_proximity_gate",
  "first_danger_gate",
  "first_domesticity_gate",
  "first_secret_gate",
  "first_confession_trigger_gate",
  "first_trust_test_gate",
  "first_safehouse_gate",
  "first_one_bed_gate",
  "first_public_scandal_gate",
  "first_emotional_break_gate",
  "first_choice_gate",
  "story_begins_route",
];

export const scenarioOpeningDialogueSeeds = [
  "You are not supposed to be here.",
  "Neither are you.",
  "This is a terrible first impression.",
  "I have had worse.",
  "That is not comforting.",
  "We have one room.",
  "Of course we do.",
  "Who did this to you?",
  "Do not start a war.",
  "Then give me a better option.",
  "I need you to pretend to love me.",
  "That sounds dangerously easy.",
  "You are bleeding on my floor.",
  "I missed you too.",
  "If we survive this, we talk.",
  "If we survive this, I am confessing badly.",
  "You made breakfast.",
  "You looked like someone who needed one kind thing today.",
];

export const highValueScenarioOpeningMomentSeeds = [
  "meet_cute",
  "meet_disaster",
  "rescue_meeting",
  "forced_partnership",
  "fake_relationship_request",
  "one_bed_problem",
  "safehouse_needed",
  "storm_traps_them",
  "bad_first_impression",
  "secret_agenda",
  "near_loss_confession",
  "jealousy_breaks_denial",
  "shared_breakfast",
  "sick_day_caretaking",
  "danger_at_the_door",
  "injured_character_arrives",
  "panic_attack_opener",
  "too_tired_to_pretend",
  "inciting_incident_gate",
  "story_begins_route",
];

const SCENARIO_OPENING_MOMENT_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "scenario_opening_archetype",
    guidance: SCENARIO_OPENING_MOMENT_GUIDANCE,
    values: scenarioOpeningMomentPresets,
  },
  {
    category: "Opening Seed",
    prefix: "scenario_opening_seed",
    guidance:
      "Use this as broad opening-scene vocabulary. Openers can define the first message, scene prompt, roleplay launch, tension starter, emotional hook, or story start without scripting {{user}}.",
    values: scenarioOpeningMomentSeeds,
  },
  {
    category: "First Meeting Mode",
    prefix: "scenario_opening_first_meeting",
    guidance: `${CONSENT_SAFE_TROPE_GUIDANCE} Use this as first-meeting texture. Meeting modes can set location, mistake, rescue, role, rivalry, assignment, or genre without deciding attraction for {{user}}.`,
    values: firstMeetingModeSeeds,
  },
  {
    category: "Inciting Incident",
    prefix: "scenario_opening_inciting",
    guidance: `${CONSENT_SAFE_TROPE_GUIDANCE} Use this as inciting-incident texture. Assignments, debts, scandals, bonds, curses, storms, rooms, alarms, exes, and choices should launch pressure without forcing compliance.`,
    values: incitingIncidentSeeds,
  },
  {
    category: "Conflict Starter",
    prefix: "scenario_opening_conflict",
    guidance:
      "Use this as conflict-starter texture. Misunderstandings, secrets, rivalries, gaps, rules, lies, betrayal, boundaries, duty, reputation, enemies, patrons, employers, family, and exes can create tension while preserving repair and choice.",
    values: conflictStarterSeeds,
  },
  {
    category: "Confession Trigger",
    prefix: "scenario_opening_confession",
    guidance: `${CONSENT_SAFE_TROPE_GUIDANCE} Use this as confession-trigger texture. Near loss, jealousy, injury, truth, letters, gifts, caretaking, protection, and goodbye scenes can loosen denial without forcing {{user}} to reciprocate.`,
    values: confessionTriggerSeeds,
  },
  {
    category: "Domestic Opener",
    prefix: "scenario_opening_domestic",
    guidance:
      "Use this as domestic opener texture. Ordinary routines, chores, sick days, food, keys, couches, rain, movies, and shared homes can make softness feel lived-in without removing boundaries.",
    values: domesticOpenerSeeds,
  },
  {
    category: "Danger Opener",
    prefix: "scenario_opening_danger",
    guidance: DANGER_OPENER_GUIDANCE,
    values: dangerOpenerSeeds,
  },
  {
    category: "Emotional Opener",
    prefix: "scenario_opening_emotional",
    guidance: EMOTIONAL_OPENER_GUIDANCE,
    values: emotionalOpenerSeeds,
  },
  {
    category: "Gate",
    prefix: "scenario_opening_gate",
    guidance:
      "Use this as an opening-scene event gate. Gates should mark first meetings, incidents, conflict, proximity, danger, domesticity, secrets, confession triggers, trust tests, safehouses, choices, and story launch only when earned.",
    values: scenarioOpeningGates,
  },
  {
    category: "Dialogue Seed",
    prefix: "scenario_opening_dialogue",
    guidance:
      "Use this as optional opening dialogue inspiration. Dialogue seeds should be adapted to character voice, genre, stakes, and consent context rather than pasted as fixed lines.",
    values: scenarioOpeningDialogueSeeds,
  },
  {
    category: "High-Value Seed",
    prefix: "scenario_opening_high_value",
    guidance:
      "Use this as a high-signal scenario opening seed for character creation, route planning, first-message generation, and preset search.",
    values: highValueScenarioOpeningMomentSeeds,
  },
] satisfies readonly ScenarioOpeningMomentSeedGroup[]);

function normalizeReadableScenarioOpeningMomentValue(value: string): string {
  const readable = value.includes("_")
    ? value
        .replace(/users_/g, "{{user}}_s_")
        .replace(/_for_user\b/g, "_for_{{user}}")
        .replace(/_with_user\b/g, "_with_{{user}}")
        .replace(/_user_/g, "_{{user}}_")
        .replace(/\buser_/g, "{{user}}_")
        .replace(/_user\b/g, "_{{user}}")
        .replace(/_/g, " ")
        .replace(/\{\{user\}\} s/g, "{{user}}'s")
    : value;

  return readable
    .replace(/\b[Nn]eighbor\b/g, (match) =>
      match === "Neighbor" ? "Neighbour" : "neighbour",
    )
    .replace(/\b[Aa]rtifact\b/g, (match) =>
      match === "Artifact" ? "Artefact" : "artefact",
    )
    .replace(/\bone bed\b/gi, "one-bed")
    .replace(/\blife support\b/gi, "life-support")
    .replace(/\s+/g, " ")
    .trim();
}

function slugifyScenarioOpeningMoment(value: string) {
  return value
    .toLowerCase()
    .replace(/\{\{user\}\}'s/g, "user_s")
    .replace(/\{\{user\}\}/g, "user")
    .replace(/&/g, " and ")
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function makeScenarioOpeningMomentPreset(
  group: ScenarioOpeningMomentSeedGroup,
  rawValue: string,
): ScenarioOpeningMomentPreset {
  const value = normalizeReadableScenarioOpeningMomentValue(rawValue);
  const normalizedTriggerValue = value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user");

  return {
    id: `${group.prefix}_${slugifyScenarioOpeningMoment(value)}`,
    category: group.category,
    label: value,
    value,
    triggerKeys: Array.from(
      new Set([
        rawValue,
        value,
        slugifyScenarioOpeningMoment(value),
        ...normalizedTriggerValue
          .split(/[^a-z0-9]+/)
          .filter((part) => part.length > 2),
      ]),
    ),
    guidance: group.guidance,
    systemPromptTags: [group.category, value],
  };
}

export const SCENARIO_OPENING_MOMENT_PRESETS = SCENARIO_OPENING_MOMENT_SEED_GROUPS.flatMap(
  (group) => group.values.map((value) => makeScenarioOpeningMomentPreset(group, value)),
);

export const SCENARIO_OPENING_MOMENT_PRESET_CATEGORIES = Array.from(
  new Set(SCENARIO_OPENING_MOMENT_PRESETS.map((preset) => preset.category)),
).sort();

export const getScenarioOpeningMomentPresetsByCategory = (
  category: ScenarioOpeningMomentPresetCategory,
) => SCENARIO_OPENING_MOMENT_PRESETS.filter((preset) => preset.category === category);

export const findScenarioOpeningMomentPresetById = (id: string) =>
  SCENARIO_OPENING_MOMENT_PRESETS.find((preset) => preset.id === id);

export const compileScenarioOpeningMomentPresetAdditions = (
  preset: ScenarioOpeningMomentPreset,
): CompiledScenarioOpeningMomentPresetAdditions => ({
  scenarioAddition: `Scenario opening context: ${preset.value}. ${preset.guidance}`,
  firstMessageAddition: `Opening moment texture may include ${preset.value} as a launch point without scripting {{user}}'s feelings, actions, consent, or response.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft scenario opening context.`,
    "Let first meetings, inciting incidents, conflict, confession pressure, domestic detail, danger, emotional vulnerability, and gates shape the initial scene when relevant.",
    "Preserve consent, boundaries, pacing, de-escalation, mental safety, and {{user}} autonomy; do not force romance, danger, mate bonds, one-bed intimacy, fake affection, panic, harm, or reciprocation.",
  ].join(" "),
});
