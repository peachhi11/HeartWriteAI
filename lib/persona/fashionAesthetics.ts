import {
  FashionAesthetic,
  FashionAestheticMacroClassifier,
} from "../../types/persona/FashionAesthetic";

export const fashionMacroClassifiers: Array<{
  id: FashionAestheticMacroClassifier;
  label: string;
  description: string;
  examples: string[];
  mjKeywords: string[];
}> = [
  {
    id: "Subculture_Alternative",
    label: "Subculture / Alternative",
    description: "Music, rebellion, anti-fashion, and visible edge.",
    examples: ["Grunge", "Goth", "Punk", "Emo", "Scene", "Indie Sleaze"],
    mjKeywords: ["distressed", "shredded", "safety pins", "studs", "band tees", "leather"],
  },
  {
    id: "Historical_Vintage_Retro",
    label: "Historical / Vintage Retro",
    description: "Specific decades, romanticized eras, and vintage silhouettes.",
    examples: ["Regencycore", "Victorian", "70s Disco", "90s Minimalist", "Y2K"],
    mjKeywords: ["period-accurate", "nostalgic", "vintage film stock", "repro fashion"],
  },
  {
    id: "Youth_Internet_Culture",
    label: "Youth / Internet Culture",
    description: "Hyper-specific, highly visual internet-born aesthetics.",
    examples: ["Dollcore", "Cottagecore", "Cluttercore", "Gorpcore", "Kidcore"],
    mjKeywords: ["hyper-stylized", "thematic", "suburban", "internet aesthetic"],
  },
  {
    id: "Fantasy_Speculative",
    label: "Fantasy / Speculative",
    description: "Sci-fi, mythology, folklore, or speculative fashion roots.",
    examples: ["Cyberpunk", "Steampunk", "Solarpunk", "Whimsigoth", "Fairycore"],
    mjKeywords: ["utilitarian tech", "neon glow", "brass gears", "ethereal fabric"],
  },
  {
    id: "Socioeconomic_High_Fashion",
    label: "Socioeconomic / High Fashion",
    description: "Status, luxury, minimalism, and runway-level construction.",
    examples: ["Old Money", "Minimalist", "Avant-Garde", "Haute Couture"],
    mjKeywords: ["tailored", "monochromatic", "premium textures", "structural silhouettes"],
  },
  {
    id: "Athletic_Functional",
    label: "Athletic / Functional",
    description: "Sportswear, utility, outdoor performance, and functional styling.",
    examples: ["Streetwear", "Blockette", "Athleisure", "Techwear"],
    mjKeywords: ["oversized", "synthetic fabrics", "straps", "sneakers", "functional"],
  },
];

export const fashionAesthetics: FashionAesthetic[] = [
  {
    id: "coquette",
    name: "Coquette",
    macroClassifier: "Youth_Internet_Culture",
    tags: ["soft", "hyperfeminine", "romantic"],
    formula: "Coquette + lace slip dress + spring street style",
    keyItems: ["pointelle knits", "hair bows", "pearl chokers", "lace trim", "Mary Janes"],
    fabricsPalette: "Chiffon and silk ribbon; pastel pink, cream, white.",
    promptTemplates: {
      spring: "Coquette aesthetic, lace slip dress, pearl choker, pink satin hair bow, spring street style",
      autumn: "Coquette aesthetic, pointelle knit cardigan, lace trim skirt, Mary Janes, autumn street style",
    },
    visualWeights: ["lace", "silk ribbon", "pastel pink", "pearls", "bows"],
  },
  {
    id: "balletcore",
    name: "Balletcore",
    macroClassifier: "Youth_Internet_Culture",
    tags: ["soft", "dance", "feminine"],
    formula: "Balletcore + leg warmers + fall street style",
    keyItems: ["wrap cardigans", "tulle skirts", "bodysuit layers", "flat slippers", "shrugs"],
    fabricsPalette: "Jersey and tulle; heather grey, soft pink, ivory.",
    promptTemplates: {
      autumn: "Balletcore aesthetic, wrap cardigan, tulle skirt, leg warmers, fall street style",
      winter: "Balletcore aesthetic, layered shrug, bodysuit, soft knit leg warmers, winter street style",
    },
    visualWeights: ["tulle", "jersey", "soft pink", "leg warmers", "wrap cardigan"],
  },
  {
    id: "cottagecore",
    name: "Cottagecore",
    macroClassifier: "Youth_Internet_Culture",
    tags: ["pastoral", "soft", "romantic"],
    formula: "Cottagecore + puff-sleeve midi dress + summer street style",
    keyItems: ["milkmaid tops", "corsets", "straw baskets", "aprons", "floral embroidery"],
    fabricsPalette: "Linen and gingham cotton; sage green, butter yellow, beige.",
    promptTemplates: {
      summer: "Cottagecore aesthetic, puff-sleeve midi dress, straw basket, floral embroidery, summer street style",
      spring: "Cottagecore aesthetic, milkmaid blouse, linen skirt, sage ribbon accents, spring street style",
    },
    visualWeights: ["linen", "gingham", "sage green", "floral embroidery", "straw basket"],
  },
  {
    id: "romantic_academia",
    name: "Romantic Academia",
    macroClassifier: "Historical_Vintage_Retro",
    tags: ["intellectual", "moody", "romantic"],
    formula: "Romantic academia + velvet corset + autumn street style",
    keyItems: ["poet blouses", "lace-up boots", "pleated skirts", "lockets", "poetry books"],
    fabricsPalette: "Velvet, lace, and brocade; burgundy, rose, cream, espresso.",
    promptTemplates: {
      autumn: "Romantic academia aesthetic, velvet corset, poet blouse, pleated skirt, autumn street style",
      winter: "Romantic academia aesthetic, brocade coat, lace-up boots, locket, winter street style",
    },
    visualWeights: ["velvet", "lace", "burgundy", "lockets", "poet blouse"],
  },
  {
    id: "dark_academia",
    name: "Dark Academia",
    macroClassifier: "Historical_Vintage_Retro",
    tags: ["intellectual", "tailored", "moody"],
    formula: "Dark academia + trench coat + winter street style",
    keyItems: ["turtlenecks", "tailored trousers", "oxfords", "wire-rimmed glasses", "satchels"],
    fabricsPalette: "Tweed, houndstooth, and wool; charcoal, forest green, black.",
    promptTemplates: {
      winter: "Dark academia aesthetic, trench coat, turtleneck, tailored trousers, winter street style",
      autumn: "Dark academia aesthetic, houndstooth blazer, pleated skirt, satchel, autumn street style",
    },
    visualWeights: ["tweed", "houndstooth", "charcoal", "forest green", "oxfords"],
  },
  {
    id: "whimsigoth",
    name: "Whimsigoth",
    macroClassifier: "Fantasy_Speculative",
    tags: ["witchy", "celestial", "moody"],
    formula: "Whimsigoth + celestial maxi skirt + autumn street style",
    keyItems: ["bell-sleeve tops", "velvet duster coats", "chunky silver rings", "sun/moon prints"],
    fabricsPalette: "Crushed velvet and sheer mesh; deep purple, midnight blue, black.",
    promptTemplates: {
      autumn: "Whimsigoth aesthetic, celestial maxi skirt, bell-sleeve top, chunky silver rings, autumn street style",
      winter: "Whimsigoth aesthetic, velvet duster coat, sheer mesh layers, moon print scarf, winter street style",
    },
    visualWeights: ["crushed velvet", "sheer mesh", "deep purple", "moon prints", "silver rings"],
  },
  {
    id: "fairycore",
    name: "Fairycore",
    macroClassifier: "Fantasy_Speculative",
    tags: ["ethereal", "earthy", "soft"],
    formula: "Fairycore + tattered knit sweater + spring street style",
    keyItems: ["corset vests", "layered asymmetrical skirts", "fingerless gloves", "leaf motifs"],
    fabricsPalette: "Distressed knits and gauze; moss green, earthy brown, muted gold.",
    promptTemplates: {
      spring: "Fairycore aesthetic, tattered knit sweater, layered asymmetrical skirt, leaf motifs, spring street style",
      autumn: "Fairycore aesthetic, corset vest, gauze layers, fingerless gloves, autumn street style",
    },
    visualWeights: ["gauze", "distressed knits", "moss green", "leaf motifs", "muted gold"],
  },
  {
    id: "goth_core",
    name: "Goth-core",
    macroClassifier: "Subculture_Alternative",
    tags: ["dark", "edgy", "alternative"],
    formula: "Goth-core + platform boots + winter street style",
    keyItems: ["fishnets", "leather harness", "chokers", "oversized graphic tees", "dark makeup"],
    fabricsPalette: "Shiny vinyl, heavy leather, and fishnet; pure black, crimson accents.",
    promptTemplates: {
      winter: "Goth-core aesthetic, platform boots, leather harness, fishnets, winter street style",
      night_out: "Goth-core aesthetic, oversized graphic tee, vinyl mini skirt, spiked choker, night-out street style",
    },
    visualWeights: ["black leather", "fishnet", "vinyl", "crimson", "platform boots"],
  },
  {
    id: "grunge",
    name: "Grunge",
    macroClassifier: "Subculture_Alternative",
    tags: ["distressed", "rebellious", "casual"],
    formula: "Grunge + oversized flannel + fall street style",
    keyItems: ["ripped boyfriend jeans", "beanies", "combat boots", "layered band t-shirts"],
    fabricsPalette: "Frayed denim and worn cotton; plaid, mud brown, faded black.",
    promptTemplates: {
      autumn: "Grunge aesthetic, oversized flannel, ripped boyfriend jeans, combat boots, fall street style",
      winter: "Grunge aesthetic, layered band tees, beanie, distressed denim jacket, winter street style",
    },
    visualWeights: ["frayed denim", "worn cotton", "plaid", "faded black", "combat boots"],
  },
  {
    id: "indie_sleaze",
    name: "Indie Sleaze",
    macroClassifier: "Subculture_Alternative",
    tags: ["nightlife", "messy", "retro"],
    formula: "Indie sleaze + metallic disco pants + night-out street style",
    keyItems: ["flash photography look", "smudged eyeliner", "metallic leggings", "skinny scarves", "fur coats"],
    fabricsPalette: "Lame, faux fur, sequins; leopard print, neon pops, silver.",
    promptTemplates: {
      night_out: "Indie sleaze aesthetic, metallic disco pants, smudged eyeliner, skinny scarf, night-out street style",
      winter: "Indie sleaze aesthetic, faux fur coat, sequined mini dress, flash photography look, winter street style",
    },
    visualWeights: ["metallic", "faux fur", "sequins", "leopard print", "smudged eyeliner"],
  },
  {
    id: "cyber_y2k",
    name: "Cyber Y2K",
    macroClassifier: "Fantasy_Speculative",
    tags: ["futuristic", "retro", "technical"],
    formula: "Cyber Y2K + shield sunglasses + futuristic street style",
    keyItems: ["metallic puffer jackets", "visor shades", "technical cargo pants", "chunky sneakers"],
    fabricsPalette: "Nylon, PVC, and mesh; neon green, electric blue, chrome silver.",
    promptTemplates: {
      spring: "Cyber Y2K aesthetic, shield sunglasses, technical cargo pants, chunky sneakers, futuristic street style",
      winter: "Cyber Y2K aesthetic, metallic puffer jacket, PVC mini skirt, chrome visor shades, winter street style",
    },
    visualWeights: ["nylon", "PVC", "mesh", "chrome silver", "electric blue"],
  },
  {
    id: "y2k",
    name: "Y2K",
    macroClassifier: "Historical_Vintage_Retro",
    tags: ["retro", "glitter", "playful"],
    formula: "Y2K + rhinestone low-rise jeans + summer street style",
    keyItems: ["velour tracksuits", "baby tees", "baguette bags", "butterfly clips", "rimless tinted sunglasses"],
    fabricsPalette: "Velour, denim, and satin; hot pink, baby blue, glitter.",
    promptTemplates: {
      summer: "Y2K aesthetic, rhinestone low-rise jeans, baby tee, butterfly clips, summer street style",
      spring: "Y2K aesthetic, velour tracksuit, baguette bag, rimless tinted sunglasses, spring street style",
    },
    visualWeights: ["velour", "rhinestones", "hot pink", "baby blue", "butterfly clips"],
  },
  {
    id: "90s_model_off_duty",
    name: "90s Model Off-Duty",
    macroClassifier: "Socioeconomic_High_Fashion",
    tags: ["minimal", "sleek", "elevated"],
    formula: "90s model off-duty + leather blazer + spring street style",
    keyItems: ["high-waisted straight jeans", "white tank top", "matrix sunglasses", "sleek claw clips"],
    fabricsPalette: "Heavy denim and structured leather; black, white, medium-wash blue.",
    promptTemplates: {
      spring: "90s model off-duty aesthetic, leather blazer, white tank top, straight jeans, spring street style",
      autumn: "90s model off-duty aesthetic, structured leather jacket, high-waisted denim, claw clip, autumn street style",
    },
    visualWeights: ["structured leather", "white tank", "straight denim", "black", "matrix sunglasses"],
  },
  {
    id: "coastal_cowgirl",
    name: "Coastal Cowgirl",
    macroClassifier: "Athletic_Functional",
    tags: ["beach", "western", "casual"],
    formula: "Coastal cowgirl + crochet top + beach street style",
    keyItems: ["white denim shorts", "cowboy boots", "linen button-downs", "turquoise jewelry"],
    fabricsPalette: "Suede, crochet knit, and linen; ocean blue, sandy beige, crisp white.",
    promptTemplates: {
      summer: "Coastal cowgirl aesthetic, linen button-down shirt and denim shorts, cowboy boots, beach street style",
      autumn: "Coastal cowgirl aesthetic, oversized knit sweater, suede boots, turquoise jewelry, fall street style",
      beach: "Coastal cowgirl aesthetic, crochet top, white denim shorts, turquoise jewelry, beach street style",
    },
    visualWeights: ["suede", "linen", "turquoise", "white denim", "cowboy boots"],
  },
  {
    id: "boho_chic",
    name: "Boho Chic",
    macroClassifier: "Historical_Vintage_Retro",
    tags: ["festival", "earthy", "relaxed"],
    formula: "Boho chic + fringed suede jacket + festival street style",
    keyItems: ["tiered maxi skirts", "wide belts", "floppy hats", "gladiator sandals"],
    fabricsPalette: "Suede, lace, and patchwork; rust, tan, olive green.",
    promptTemplates: {
      festival: "Boho chic aesthetic, fringed suede jacket, tiered maxi skirt, festival street style",
      summer: "Boho chic aesthetic, lace crop top, wide belt, gladiator sandals, summer street style",
    },
    visualWeights: ["suede", "fringe", "lace", "rust", "olive green"],
  },
  {
    id: "quiet_luxury",
    name: "Old Money / Quiet Luxury",
    macroClassifier: "Socioeconomic_High_Fashion",
    tags: ["wealthy", "minimal", "elevated"],
    formula: "Quiet luxury + cashmere crewneck + winter street style",
    keyItems: ["tailored blazers", "silk slip skirts", "gold hoops", "trench coats", "unbranded leather bags"],
    fabricsPalette: "Cashmere, heavy silk, and linen; camel, navy, ivory, beige.",
    promptTemplates: {
      winter: "Quiet luxury aesthetic, cashmere crewneck, tailored trousers, gold hoops, winter street style",
      spring: "Quiet luxury aesthetic, silk slip skirt, trench coat, unbranded leather bag, spring street style",
    },
    visualWeights: ["cashmere", "heavy silk", "camel", "navy", "gold hoops"],
  },
];

export function getFashionAestheticById(id: string): FashionAesthetic {
  const aesthetic = fashionAesthetics.find((item) => item.id === id);

  if (!aesthetic) {
    throw new Error(`Unknown fashion aesthetic: ${id}`);
  }

  return aesthetic;
}
