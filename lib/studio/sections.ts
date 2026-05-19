import {
  BookOpenText,
  Bot,
  HeartHandshake,
  ImageIcon,
  LibraryBig,
  MessageSquareText,
  Settings,
  Sparkles,
  UsersRound,
} from "lucide-react";

export const primaryStudioSections = [
  {
    description: "Overview, imports, native bridge, and workflow status.",
    href: "/",
    icon: "/brand/favicon.svg",
    label: "Dashboard",
  },
  {
    description: "Generate, import, edit, convert, and export CCV3 cards.",
    href: "/characters",
    icon: "/brand/icons/character-cards.svg",
    label: "Character Cards",
  },
  {
    description: "Craft player personas independent of a character match.",
    href: "/personas",
    icon: "/brand/icons/persona-matching.svg",
    label: "Persona Studio",
  },
  {
    description: "Match playable personas to a character's romance logic.",
    href: "/persona-matching",
    icon: "/brand/icons/persona-matching.svg",
    label: "Persona Matching",
  },
  {
    description: "Build scoped world, character, and scenario lorebooks.",
    href: "/lorebooks",
    icon: "/brand/icons/lorebooks.svg",
    label: "Lorebooks",
  },
  {
    description: "Generate and process card art and visual assets.",
    href: "/images",
    icon: "/brand/icons/image-generation.svg",
    label: "Image Generation",
  },
  {
    description: "Run private one-on-one romance roleplay previews.",
    href: "/chat",
    icon: "/brand/icons/character-chat.svg",
    label: "Character Chat",
  },
  {
    description: "Stage multi-character room and ensemble openings.",
    href: "/group-chat",
    icon: "/brand/icons/group-chat.svg",
    label: "Group Chat",
  },
] as const;

export const utilityStudioSections = [
  {
    description: "Convert imported V1/V2 cards into editable CCV3 structure.",
    href: "/conversion",
    icon: "/brand/icons/card-conversion.svg",
    label: "V1/V2 to V3",
  },
  {
    description: "Configure local libraries, runtime providers, and app behavior.",
    href: "/settings",
    icon: "/brand/icons/settings.svg",
    label: "Settings",
  },
] as const;

export const sectionBlueprints = {
  conversion: {
    eyebrow: "Card Conversion",
    title: "V1/V2 to V3 Conversion",
    subtitle:
      "Inspect legacy cards, preserve useful fields, and migrate them into HeartWriteAI's CCV3-first structure.",
    status: "Scaffold ready",
    icon: Sparkles,
    primaryAction: "Open Character Cards",
    primaryHref: "/characters",
    panels: [
      {
        title: "Import legacy card",
        body: "Use the Character Cards workspace to drop PNG, CHARX, or JSON cards and inspect their parsed metadata before conversion.",
      },
      {
        title: "Review conversion notes",
        body: "Surface missing fields, legacy example-dialogue quirks, and lorebook compatibility warnings before export.",
      },
      {
        title: "Export CCV3",
        body: "Save migrated cards with embedded CCV3 metadata while keeping JSON available for debugging and backups.",
      },
    ],
  },
  groupChat: {
    eyebrow: "Group Chat",
    title: "Group Chat Workspace",
    subtitle:
      "Prepare ensemble rooms, multi-character openings, group alternate greetings, and shared lore context.",
    status: "Route scaffold",
    icon: UsersRound,
    primaryAction: "Review Chat Preview",
    primaryHref: "/chat",
    panels: [
      {
        title: "Room roster",
        body: "Choose two to four characters, assign spotlight distribution, and keep dialogue attribution readable.",
      },
      {
        title: "Group dynamics",
        body: "Set rivalry, wingman, hostile-front, or internal-fracture tension so the room has motion immediately.",
      },
      {
        title: "Shared runtime",
        body: "Compile active scenario, lorebooks, post-history constraints, and group turn rules into one budget.",
      },
    ],
  },
  images: {
    eyebrow: "Image Generation",
    title: "Image Asset Studio",
    subtitle:
      "Generate, import, process, and prepare romance card art without mixing image data into text metadata.",
    status: "Intake pipeline exists",
    icon: ImageIcon,
    primaryAction: "Open Dashboard Intake",
    primaryHref: "/",
    panels: [
      {
        title: "Character portraits",
        body: "Plan portrait prompts and attach approved art to card export flows once generation providers are wired.",
      },
      {
        title: "Image intake",
        body: "Validate imported images, preserve useful EXIF dates, compress safely, and generate blurhash previews.",
      },
      {
        title: "Brand separation",
        body: "Keep HeartWriteAI icons, lockups, and watermarks separate from user-owned character artwork.",
      },
    ],
  },
  lorebooks: {
    eyebrow: "Lorebooks",
    title: "Lorebook Asset Studio",
    subtitle:
      "Create modular world, character, persona, scenario, and arc lore entries with trigger-aware activation.",
    status: "Data model pending UI",
    icon: LibraryBig,
    primaryAction: "Open Character Cards",
    primaryHref: "/characters",
    panels: [
      {
        title: "Scoped entries",
        body: "Write entries with keys, priority, probability, scope, and attachment targets instead of stuffing lore into the card body.",
      },
      {
        title: "Active lore preview",
        body: "Show which entries activate for a character, persona, scenario, or recent chat trigger.",
      },
      {
        title: "Scenario pairs",
        body: "Keep alternate openings tied to their matching scenario context so greetings do not drift.",
      },
    ],
  },
  personaMatching: {
    eyebrow: "Persona Matching",
    title: "Persona Matching Lab",
    subtitle:
      "Generate playable user personas that fit a character's trope, boundaries, speech style, and romantic pressure.",
    status: "Next functional build",
    icon: HeartHandshake,
    primaryAction: "Open Persona Studio",
    primaryHref: "/personas",
    panels: [
      {
        title: "Read character logic",
        body: "Use trope, archetype, power dynamic, turn-offs, and slow-burn rules to understand what kind of persona will create chemistry.",
      },
      {
        title: "Match the pressure",
        body: "Balance softness, agency, friction, vulnerability, and compatibility without making the persona generic.",
      },
      {
        title: "Export profile",
        body: "Produce editable persona text that can stand alone or travel with the generated character card.",
      },
    ],
  },
  personas: {
    eyebrow: "Persona Studio",
    title: "Persona Studio",
    subtitle:
      "Craft player personas as standalone romance-roleplay assets, with or without a generated character match.",
    status: "Next functional build",
    icon: Bot,
    primaryAction: "Match Persona",
    primaryHref: "/persona-matching",
    panels: [
      {
        title: "Identity and presence",
        body: "Build appearance, voice, temperament, vulnerabilities, relationship stance, and roleplay boundaries.",
      },
      {
        title: "Romance compatibility",
        body: "Shape the persona for soft tension, slow-burn resilience, and believable agency in intimate dynamics.",
      },
      {
        title: "Platform export",
        body: "Keep output compact and paste-ready for external roleplay platforms while preserving HeartWriteAI metadata.",
      },
    ],
  },
  settings: {
    eyebrow: "Settings",
    title: "Settings",
    subtitle:
      "Configure local libraries, runtime providers, token budgets, export defaults, and desktop behavior.",
    status: "Scaffold ready",
    icon: Settings,
    primaryAction: "Open Dashboard",
    primaryHref: "/",
    panels: [
      {
        title: "Local libraries",
        body: "Choose card, image, lorebook, and persona folders once native path management is finalized.",
      },
      {
        title: "Runtime providers",
        body: "Prepare provider endpoints, model presets, token budgets, and stop rules for production chat.",
      },
      {
        title: "Export defaults",
        body: "Control CCV3 packaging, watermark branding, backup behavior, and future compatibility settings.",
      },
    ],
  },
} as const;

export const dashboardHighlights = [
  {
    title: "Character Cards",
    description: "CCV3-first creation, editing, conversion, and PNG export.",
    href: "/characters",
    icon: Bot,
  },
  {
    title: "Persona Studio",
    description: "Standalone player personas with romance-aware profile fields.",
    href: "/personas",
    icon: Sparkles,
  },
  {
    title: "Persona Matching",
    description: "Playable user personas matched to route energy and card tone.",
    href: "/persona-matching",
    icon: HeartHandshake,
  },
  {
    title: "Lorebooks",
    description: "Scoped world, character, persona, and scenario lore assets.",
    href: "/lorebooks",
    icon: LibraryBig,
  },
  {
    title: "Image Generation",
    description: "Character portraits, card art, and visual asset preparation.",
    href: "/images",
    icon: ImageIcon,
  },
  {
    title: "Character Chat",
    description: "Context compilation, active lore, summaries, and local models.",
    href: "/chat",
    icon: MessageSquareText,
  },
  {
    title: "Group Chat",
    description: "Multi-character rooms, group openings, and ensemble tension.",
    href: "/group-chat",
    icon: UsersRound,
  },
  {
    title: "V1/V2 to V3",
    description: "Legacy card migration into HeartWriteAI's native format.",
    href: "/conversion",
    icon: BookOpenText,
  },
] as const;
