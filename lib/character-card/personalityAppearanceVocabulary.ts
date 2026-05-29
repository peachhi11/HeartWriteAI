export type VocabularyPolarity = "positive" | "negative" | "neutral";

export type VocabularyDomain =
  | "appearance"
  | "body"
  | "facial-hair"
  | "hair"
  | "hairstyle"
  | "personality"
  | "person-noun"
  | "skin"
  | "age";

export type VocabularySource =
  | "personality-and-appearance-pdf"
  | "user-provided-person-descriptor-list";

export interface CharacterVocabularyEntry {
  aliases?: readonly string[];
  definition: string;
  domain: VocabularyDomain;
  key: string;
  label: string;
  polarity: VocabularyPolarity;
  source: VocabularySource;
}

const source = "personality-and-appearance-pdf" as const;
const descriptorSource = "user-provided-person-descriptor-list" as const;

function slugifyVocabularyKey(label: string) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function createDescriptorEntries(
  prefix: string,
  domain: VocabularyDomain,
  items: readonly (readonly [label: string, definition: string])[],
  polarity: VocabularyPolarity = "positive",
): readonly CharacterVocabularyEntry[] {
  return items.map(([label, definition]) => ({
    key: `${prefix}-${slugifyVocabularyKey(label)}`,
    label,
    definition,
    domain,
    polarity,
    source: descriptorSource,
  }));
}

const GOOD_APPEARANCE_DESCRIPTOR_VOCABULARY = createDescriptorEntries("appearance", "appearance", [
  ["Athletic", "Strong and fit."],
  ["Beaming", "Radiating bright smiles."],
  ["Beautiful", "Very pleasing look."],
  ["Brawny", "Muscular and strong."],
  ["Bright-eyed", "Alert and lively."],
  ["Bronze", "Tan skin tone."],
  ["Chiseled", "Sharp facial features."],
  ["Clean-cut", "Neat and tidy."],
  ["Comely", "Attractive and pleasant."],
  ["Dapper", "Neat and stylish."],
  ["Dazzling", "Exceptionally bright beauty."],
  ["Deep-set", "Recessed eye shape."],
  ["Delicate", "Fragile and dainty."],
  ["Distinguished", "Dignified and noble."],
  ["Elegant", "Graceful in appearance."],
  ["Fair", "Light skin tone."],
  ["Fit", "Healthy and toned."],
  ["Freckled", "Small brown spots."],
  ["Gallant", "Grand and stately."],
  ["Glistening", "Sparkling or shining."],
  ["Glowing", "Healthy skin radiance."],
  ["Graceful", "Moving with ease."],
  ["Handsome", "Good looking male."],
  ["Healthy", "Looking physically well."],
  ["Impeccable", "Flawless in appearance."],
  ["Lanky", "Tall and thin."],
  ["Lithe", "Thin and flexible."],
  ["Luminous", "Radiating soft light."],
  ["Mighty", "Powerful in build."],
  ["Muscular", "Having large muscles."],
  ["Nimble", "Quick and light."],
  ["Petite", "Small and slender."],
  ["Piercing", "Intense eye gaze."],
  ["Polished", "Refined and neat."],
  ["Portly", "Stout and stately."],
  ["Radiant", "Beaming with beauty."],
  ["Rosy", "Pink healthy cheeks."],
  ["Rugged", "Rough and tough."],
  ["Sculpted", "Well-defined physical form."],
  ["Shimmering", "Softly shining look."],
  ["Sinewy", "Lean and muscular."],
  ["Slender", "Thin and graceful."],
  ["Statuesque", "Tall and beautiful."],
  ["Strong", "Physically powerful build."],
  ["Sun-kissed", "Slightly tanned skin."],
  ["Svelte", "Sophisticated and slim."],
  ["Tall", "Above average height."],
  ["Tidy", "Orderly in appearance."],
  ["Vibrant", "Strikingly bright appearance."],
  ["Wiry", "Thin but strong."],
] as const);

const CUTE_PERSON_DESCRIPTOR_VOCABULARY = createDescriptorEntries("cute", "appearance", [
  ["Adorable", "Inspiring great affection."],
  ["Angelic", "Innocent and beautiful."],
  ["Animated", "Full of life."],
  ["Bubbly", "Cheerful and high-spirited."],
  ["Charming", "Pleasing and delightful."],
  ["Cherubic", "Sweet and innocent."],
  ["Cheerful", "Noticeably happy person."],
  ["Chippy", "Lively and upbeat."],
  ["Cuddly", "Soft and inviting."],
  ["Dainty", "Small and delicate."],
  ["Darling", "Very dearly loved."],
  ["Dear", "Kind and sweet."],
  ["Delectable", "Delightful and attractive."],
  ["Delightful", "Giving great pleasure."],
  ["Dimpled", "Having small indentations."],
  ["Dreamy", "Wonderfully pleasing appearance."],
  ["Effervescent", "Vivacious and bubbly."],
  ["Elfin", "Small and mischievous."],
  ["Endearing", "Making one lovable."],
  ["Engaging", "Charming and attractive."],
  ["Fair", "Beautiful and sweet."],
  ["Fanciful", "Whimsical and playful."],
  ["Fascinating", "Highly attractive interest."],
  ["Feisty", "Lively and spunky."],
  ["Friendly", "Kind and pleasant."],
  ["Gentle", "Mild and tender."],
  ["Glee", "Full of joy."],
  ["Graceful", "Elegant and sweet."],
  ["Heartwarming", "Evoking sympathetic pleasure."],
  ["Honeyed", "Sweet and soothing."],
  ["Innocent", "Pure and simple."],
  ["Jaunty", "Sprightly and cheerful."],
  ["Jolly", "Happy and cheerful."],
  ["Joyful", "Feeling great happiness."],
  ["Lovable", "Easy to love."],
  ["Lovely", "Beautiful and kind."],
  ["Luminous", "Softly glowing appearance."],
  ["Mellow", "Pleasantly smooth nature."],
  ["Merry", "Cheerful and lively."],
  ["Mighty", "Small but strong."],
  ["Modest", "Simple and sweet."],
  ["Moonstruck", "Dreamily in love."],
  ["Peppy", "Full of energy."],
  ["Pixie", "Small and playful."],
  ["Playful", "Full of fun."],
  ["Precious", "Highly valued person."],
  ["Radiant", "Beaming with joy."],
  ["Rosy", "Cheerful and bright."],
  ["Sprightly", "Lively and energetic."],
  ["Sweet", "Kind and gentle."],
] as const);

const PERSON_NOUN_DESCRIPTOR_VOCABULARY = createDescriptorEntries(
  "noun",
  "person-noun",
  [
    ["Achiever", "Reaches high goals."],
    ["Adherent", "Loyal supporter or follower."],
    ["Adversary", "Opponent or enemy."],
    ["Advocate", "Supports a cause."],
    ["Aesthete", "Appreciates great beauty."],
    ["Altruist", "Unselfishly helpful person."],
    ["Ambassador", "Representative for others."],
    ["Analyst", "Examines complex data."],
    ["Architect", "Designer and creator."],
    ["Artisan", "Skilled manual worker."],
    ["Ascetic", "Practices self-denial."],
    ["Authority", "Expert in field."],
    ["Benefactor", "Gives financial help."],
    ["Cavalier", "Gallant young gentleman."],
    ["Champion", "Defender or winner."],
    ["Charlatan", "Fraud or faker."],
    ["Collaborator", "Works with others."],
    ["Confidant", "Trusted secret keeper."],
    ["Connoisseur", "Expert judge of taste."],
    ["Diplomat", "Handles sensitive matters."],
    ["Doyen", "Senior respected member."],
    ["Dynamo", "Energetic hardworking person."],
    ["Eccentric", "Unconventional unique person."],
    ["Empath", "Feels others' emotions."],
    ["Enthusiast", "Shows intense interest."],
    ["Epicure", "Enjoys fine food."],
    ["Expert", "Highly skilled person."],
    ["Fanatic", "Excessively devoted person."],
    ["Gourmet", "Fine food lover."],
    ["Guardian", "Protector or keeper."],
    ["Iconoclast", "Challenges traditional beliefs."],
    ["Idealist", "Pursues high principles."],
    ["Innovator", "Introduces new ideas."],
    ["Intellectual", "Values high intelligence."],
    ["Intermediary", "Links two parties."],
    ["Luminary", "Influential famous person."],
    ["Maverick", "Independent minded person."],
    ["Mentor", "Trusted wise advisor."],
    ["Misanthrope", "Dislikes human society."],
    ["Narcissist", "Excessively self-admiring person."],
    ["Optimist", "Expects positive outcomes."],
    ["Orator", "Skilled public speaker."],
    ["Outcast", "Rejected by society."],
    ["Pacifist", "Opposes all war."],
    ["Patron", "Supports with money."],
    ["Pessimist", "Expects worst results."],
    ["Philanthropist", "Promotes human welfare."],
    ["Prodigy", "Young talented person."],
    ["Savant", "Learned distinguished person."],
    ["Visionary", "Thinks about future."],
  ] as const,
  "neutral",
);

export const PERSONALITY_APPEARANCE_VOCABULARY: readonly CharacterVocabularyEntry[] = [
  { key: "ambitious", label: "Ambitious", definition: "Determined and aspiring.", domain: "personality", polarity: "positive", source },
  { key: "assertive", label: "Assertive", definition: "Confident and strong.", domain: "personality", polarity: "positive", source },
  { key: "chatty", label: "Chatty", aliases: ["talkative"], definition: "Likes to talk.", domain: "personality", polarity: "positive", source },
  { key: "cheerful", label: "Cheerful", definition: "Generally happy and upbeat.", domain: "personality", polarity: "positive", source },
  { key: "charming", label: "Charming", definition: "Enchanting or socially appealing.", domain: "personality", polarity: "positive", source },
  { key: "conscientious", label: "Conscientious", definition: "Reliable and hardworking.", domain: "personality", polarity: "positive", source },
  { key: "easy-going", label: "Easy-going", aliases: ["laid-back"], definition: "Relaxed and low-pressure.", domain: "personality", polarity: "positive", source },
  { key: "funny", label: "Funny", definition: "Comic or joke-prone.", domain: "personality", polarity: "positive", source },
  { key: "fun", label: "Fun", definition: "Enjoyable to spend time with.", domain: "personality", polarity: "positive", source },
  { key: "kind", label: "Kind", definition: "Caring and good-hearted.", domain: "personality", polarity: "positive", source },
  { key: "mature", label: "Mature", definition: "Reliable and emotionally developed.", domain: "personality", polarity: "positive", source },
  { key: "loyal", label: "Loyal", definition: "Trustworthy and consistently supportive.", domain: "personality", polarity: "positive", source },
  { key: "outgoing", label: "Outgoing", definition: "Sociable and comfortable with people.", domain: "personality", polarity: "positive", source },
  { key: "open-minded", label: "Open-minded", definition: "Willing to consider new ideas.", domain: "personality", polarity: "positive", source },
  { key: "reliable", label: "Reliable", definition: "Can be trusted to follow through.", domain: "personality", polarity: "positive", source },
  { key: "sensitive", label: "Sensitive", definition: "Feels emotion deeply.", domain: "personality", polarity: "positive", source },
  { key: "sensible", label: "Sensible", definition: "Responsible and practical.", domain: "personality", polarity: "positive", source },
  { key: "selfless", label: "Selfless", definition: "Often prioritizes others.", domain: "personality", polarity: "positive", source },
  { key: "thoughtful", label: "Thoughtful", definition: "Reflective and considerate.", domain: "personality", polarity: "positive", source },
  { key: "trustworthy", label: "Trustworthy", definition: "Can be trusted.", domain: "personality", polarity: "positive", source },
  { key: "smart", label: "Smart", definition: "Intelligent.", domain: "personality", polarity: "positive", source },
  { key: "wise", label: "Wise", definition: "Intelligent and compassionate through experience.", domain: "personality", polarity: "positive", source },

  { key: "arrogant", label: "Arrogant", definition: "Superior or egotistical.", domain: "personality", polarity: "negative", source },
  { key: "bossy", label: "Bossy", definition: "Domineering or authoritarian.", domain: "personality", polarity: "negative", source },
  { key: "closed-minded", label: "Closed-minded", definition: "Unwilling to consider new ideas.", domain: "personality", polarity: "negative", source },
  { key: "forgetful", label: "Forgetful", definition: "Often forgets things.", domain: "personality", polarity: "negative", source },
  { key: "immature", label: "Immature", definition: "Not emotionally mature.", domain: "personality", polarity: "negative", source },
  { key: "insecure", label: "Insecure", definition: "Marked by anxiety or self-doubt.", domain: "personality", polarity: "negative", source },
  { key: "insincere", label: "Insincere", definition: "Dishonest or hypocritical.", domain: "personality", polarity: "negative", source },
  { key: "moody", label: "Moody", definition: "Prone to changing moods.", domain: "personality", polarity: "negative", source },
  { key: "disorganised", label: "Disorganised", aliases: ["disorganized"], definition: "Not organized.", domain: "personality", polarity: "negative", source },
  { key: "stubborn", label: "Stubborn", definition: "Obstinate or hard to move from a position.", domain: "personality", polarity: "negative", source },
  { key: "selfish", label: "Selfish", definition: "Self-centred or egotistical.", domain: "personality", polarity: "negative", source },
  { key: "spoilt", label: "Spoilt", aliases: ["spoiled"], definition: "Overindulged and ungrateful.", domain: "personality", polarity: "negative", source },
  { key: "vain", label: "Vain", definition: "Overly focused on appearance.", domain: "personality", polarity: "negative", source },

  { key: "belly-paunch", label: "Belly / paunch", definition: "A larger stomach on an otherwise slimmer body.", domain: "body", polarity: "neutral", source },
  { key: "slim", label: "Slim", definition: "Lean or slender build.", domain: "body", polarity: "neutral", source },
  { key: "skinny-thin", label: "Skinny / thin", definition: "Very slim or underweight.", domain: "body", polarity: "neutral", source },
  { key: "overweight", label: "Overweight", definition: "Having excess body weight.", domain: "body", polarity: "neutral", source },
  { key: "muscular", label: "Muscular", aliases: ["well-built"], definition: "Having a strong, muscled build.", domain: "body", polarity: "neutral", source },
  { key: "height", label: "Tall / short / medium height", definition: "General height descriptors.", domain: "body", polarity: "neutral", source },

  { key: "curly-hair", label: "Curly hair", definition: "Hair with lots of curls.", domain: "hair", polarity: "neutral", source },
  { key: "bald", label: "Bald", definition: "Having no hair.", domain: "hair", polarity: "neutral", source },
  { key: "hair-colors", label: "Blond, brown, black, grey, red hair", definition: "Common hair colour descriptors.", domain: "hair", polarity: "neutral", source },
  { key: "straight-hair", label: "Straight hair", definition: "Hair with no curls.", domain: "hair", polarity: "neutral", source },
  { key: "wavy-hair", label: "Wavy hair", definition: "Hair with a slight curl.", domain: "hair", polarity: "neutral", source },
  { key: "ponytail", label: "Ponytail", definition: "Hair collected at the back of the head in a tail.", domain: "hairstyle", polarity: "neutral", source },
  { key: "bun", label: "Bun", definition: "Hair collected at the back of the head without a tail.", domain: "hairstyle", polarity: "neutral", source },
  { key: "fringe-bangs", label: "Fringe / bangs", definition: "Shorter hair at the front of the face.", domain: "hairstyle", polarity: "neutral", source },

  { key: "beautiful", label: "Beautiful", definition: "Very attractive, typically used for women.", domain: "appearance", polarity: "positive", source },
  { key: "pretty", label: "Pretty", definition: "Nice-looking, typically used for women or girls.", domain: "appearance", polarity: "positive", source },
  { key: "cute", label: "Cute", definition: "Appealing in a sweet or small-featured way.", domain: "appearance", polarity: "positive", source },
  { key: "handsome", label: "Handsome", definition: "Very attractive, typically used for men.", domain: "appearance", polarity: "positive", source },
  { key: "good-looking", label: "Good-looking", definition: "Attractive; generic for any gender.", domain: "appearance", polarity: "positive", source },
  { key: "unattractive", label: "Unattractive", definition: "Not attractive.", domain: "appearance", polarity: "negative", source },
  { key: "ugly", label: "Ugly", definition: "Extremely unattractive; insulting when applied to a person.", domain: "appearance", polarity: "negative", source },

  { key: "white-skin", label: "White", definition: "White skin tone descriptor.", domain: "skin", polarity: "neutral", source },
  { key: "black-skin", label: "Black / Afro-American", definition: "Black skin tone or Afro-American identity descriptor.", domain: "skin", polarity: "neutral", source },
  { key: "brown-skin", label: "Brown", definition: "Brown skin tone descriptor.", domain: "skin", polarity: "neutral", source },
  { key: "freckles", label: "Freckles", definition: "Small brown marks on skin from sun exposure or complexion.", domain: "skin", polarity: "neutral", source },
  { key: "pale-skin", label: "Pale skin", definition: "Very light skin.", domain: "skin", polarity: "neutral", source },
  { key: "olive-skin", label: "Olive skin", definition: "Darker Mediterranean-style skin tone.", domain: "skin", polarity: "neutral", source },
  { key: "rosy-cheeks", label: "Rosy cheeks", definition: "Pink cheeks.", domain: "skin", polarity: "neutral", source },

  { key: "beard", label: "Beard", definition: "Full facial hair.", domain: "facial-hair", polarity: "neutral", source },
  { key: "clean-shaven", label: "Clean-shaven", definition: "No facial hair.", domain: "facial-hair", polarity: "neutral", source },
  { key: "goatee", label: "Goatee", definition: "A small beard on the chin.", domain: "facial-hair", polarity: "neutral", source },
  { key: "moustache", label: "Moustache", aliases: ["mustache"], definition: "A line of hair under the nose.", domain: "facial-hair", polarity: "neutral", source },
  { key: "sideburns", label: "Sideburns", definition: "Facial hair from the ear down toward the jaw.", domain: "facial-hair", polarity: "neutral", source },

  { key: "approximate-age", label: "Early / mid / late decade", definition: "Approximate age phrasing such as early-20s, late-30s, or mid-40s.", domain: "age", polarity: "neutral", source },
  ...GOOD_APPEARANCE_DESCRIPTOR_VOCABULARY,
  ...CUTE_PERSON_DESCRIPTOR_VOCABULARY,
  ...PERSON_NOUN_DESCRIPTOR_VOCABULARY,
];

export function findPersonalityAppearanceVocabularyEntry(key: string) {
  return PERSONALITY_APPEARANCE_VOCABULARY.find((entry) => entry.key === key);
}
