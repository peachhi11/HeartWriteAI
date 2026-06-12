"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  Clapperboard,
  Feather,
  ImageIcon,
  LibraryBig,
  MessageSquareText,
  PencilRuler,
  UserRoundPlus,
  WandSparkles,
} from "lucide-react";

import { GlobalSetupCanvas } from "@/components/global-setup-canvas";
import { StudioShell } from "@/components/studio-shell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const workflowCards = [
  {
    title: "Create Character",
    description: "Build a new character card from guided prompts.",
    href: "/workspace?mode=create",
    icon: UserRoundPlus,
    group: "Cards",
  },
  {
    title: "Edit Character",
    description: "Import, polish, convert, and export character cards.",
    href: "/workspace?mode=edit",
    icon: PencilRuler,
    group: "Cards",
  },
  {
    title: "Create Persona",
    description: "Create a {{user}} persona for your chats.",
    href: "/personas",
    icon: Feather,
    group: "Cards",
  },
  {
    title: "Persona Match",
    description: "Match your persona to characters, scenarios, and tone.",
    href: "/personas?mode=match",
    icon: WandSparkles,
    group: "Runtime",
  },
  {
    title: "Create Scenario",
    description: "Roll scene beats, openings, and lore-ready story context.",
    href: "/scenarios",
    icon: Clapperboard,
    group: "Writing",
  },
  {
    title: "Lorebooks",
    description: "Create lorebooks with world info, keys, and story rules.",
    href: "/lorebooks",
    icon: LibraryBig,
    group: "Writing",
  },
  {
    title: "Image Generation",
    description: "Prepare avatars, card art, and visual assets.",
    href: "/images",
    icon: ImageIcon,
    group: "Writing",
  },
  {
    title: "Chat",
    description: "Test a one-on-one character chat with your selected lore.",
    href: "/chat",
    icon: MessageSquareText,
    group: "Runtime",
  },
  {
    title: "Library",
    description: "Browse saved characters, personas, lorebooks, and bundles.",
    href: "/libraries",
    icon: LibraryBig,
    group: "Runtime",
  },
] as const;

const dashboardGroups = [
  {
    description: "Character cards, user personas, and import/edit work.",
    label: "Cards",
  },
  {
    description: "Scenario, lorebook, image, and prose-support work.",
    label: "Writing",
  },
  {
    description: "Matching, testing, libraries, and runtime surfaces.",
    label: "Runtime",
  },
] as const;

export default function Home() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardHome />
    </Suspense>
  );
}

function DashboardHome() {
  const searchParams = useSearchParams();
  const activeSection = searchParams.get("section");
  const isSettings = activeSection === "settings";

  return (
    <StudioShell
      eyebrow={isSettings ? "Game settings" : "Romance creation suite"}
      title={isSettings ? "Settings" : "Studio Dashboard"}
      subtitle={
        isSettings
          ? "Adjust your game's visual settings, color options, and advanced graphics."
          : "Choose what you want to make or test next."
      }
    >
      {isSettings ? (
        <GlobalSetupCanvas />
      ) : (
        <section className="grid gap-7">
          {dashboardGroups.map((group) => (
            <DashboardWorkflowGroup key={group.label} group={group} />
          ))}
        </section>
      )}
    </StudioShell>
  );
}

function DashboardFallback() {
  return (
    <StudioShell
      eyebrow="Romance creation suite"
      title="Studio Dashboard"
      subtitle="Choose what you want to make or test next."
    >
      <section className="grid gap-7">
        {dashboardGroups.map((group) => (
          <DashboardWorkflowGroup key={group.label} group={group} />
        ))}
      </section>
    </StudioShell>
  );
}

function DashboardWorkflowGroup({
  group,
}: {
  group: (typeof dashboardGroups)[number];
}) {
  const cards = workflowCards.filter((card) => card.group === group.label);

  return (
    <section className="grid gap-3">
      <header>
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {group.label}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{group.description}</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.title} href={card.href} className="group block">
            <Card className="liquid-glass-strong min-h-36 rounded-xl transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-xl">
              <CardHeader className="gap-4 p-5">
                <div className="liquid-icon flex size-12 items-center justify-center rounded-xl text-muted-foreground transition group-hover:text-foreground">
                  <card.icon className="size-5" />
                </div>
                <div className="space-y-1.5">
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                  <CardDescription className="text-sm leading-6">
                    {card.description}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
