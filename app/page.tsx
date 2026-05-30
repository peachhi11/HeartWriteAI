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
  },
  {
    title: "Edit Character",
    description: "Import, polish, convert, and export character cards.",
    href: "/workspace?mode=edit",
    icon: PencilRuler,
  },
  {
    title: "Create Persona",
    description: "Create a {{user}} persona for your chats.",
    href: "/personas",
    icon: Feather,
  },
  {
    title: "Persona Match",
    description: "Match your persona to characters, scenarios, and tone.",
    href: "/personas?mode=match",
    icon: WandSparkles,
  },
  {
    title: "Create Scenario",
    description: "Roll scene beats, openings, and lore-ready story context.",
    href: "/scenarios",
    icon: Clapperboard,
  },
  {
    title: "Lorebooks",
    description: "Create lorebooks with world info, keys, and story rules.",
    href: "/lorebooks",
    icon: LibraryBig,
  },
  {
    title: "Image Generation",
    description: "Prepare avatars, card art, and visual assets.",
    href: "/images",
    icon: ImageIcon,
  },
  {
    title: "Chat",
    description: "Test a one-on-one character chat with your selected lore.",
    href: "/chat",
    icon: MessageSquareText,
  },
  {
    title: "Library",
    description: "Browse saved characters, personas, lorebooks, and bundles.",
    href: "/libraries",
    icon: LibraryBig,
  },
];

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
        <section className="grid gap-5 sm:grid-cols-2">
          {workflowCards.map((card) => (
            <Link key={card.title} href={card.href} className="group block">
              <Card className="liquid-glass-strong min-h-44 rounded-[2rem] transition duration-200 group-hover:-translate-y-1 group-hover:shadow-2xl">
                <CardHeader className="gap-5 p-7">
                  <div className="liquid-icon flex size-16 items-center justify-center rounded-3xl text-muted-foreground transition group-hover:text-foreground">
                    <card.icon className="size-7" />
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-2xl">{card.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {card.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
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
      <section className="grid gap-5 sm:grid-cols-2">
        {workflowCards.map((card) => (
          <Card
            className="liquid-glass-strong min-h-44 rounded-[2rem]"
            key={card.title}
          >
            <CardHeader className="gap-5 p-7">
              <div className="liquid-icon flex size-16 items-center justify-center rounded-3xl text-muted-foreground">
                <card.icon className="size-7" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl">{card.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {card.description}
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </section>
    </StudioShell>
  );
}
