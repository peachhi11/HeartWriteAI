"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  Feather,
  ImageIcon,
  LibraryBig,
  MessageSquareText,
  PencilRuler,
  UserRoundPlus,
  WandSparkles,
} from "lucide-react";

import { LiquidThemePreviewSettings } from "@/components/liquid-theme-picker";
import { StudioShell } from "@/components/studio-shell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdvancedRuntimeSettings } from "@/features/settings/components/AdvancedRuntimeSettings";
import { ThemeCustomizationStudio } from "@/features/settings/components/ThemeCustomizationStudio";

const workflowCards = [
  {
    title: "Create Character",
    description: "Generate a new CCV3-ready character from guided inputs.",
    href: "/workspace?mode=create",
    icon: UserRoundPlus,
  },
  {
    title: "Edit Character",
    description: "Import, refine, convert, and export editable card drafts.",
    href: "/workspace?mode=edit",
    icon: PencilRuler,
  },
  {
    title: "Create Persona",
    description: "Build playable {{user}} POV personas for roleplay bundles.",
    href: "/personas",
    icon: Feather,
  },
  {
    title: "Persona Match",
    description: "Match persona energy to characters, scenarios, and tone.",
    href: "/personas?mode=match",
    icon: WandSparkles,
  },
  {
    title: "Lorebooks",
    description: "Create modular V3 lorebooks and runtime-ready entries.",
    href: "/lorebooks",
    icon: LibraryBig,
  },
  {
    title: "Image Generation",
    description: "Prepare visual assets, avatars, and card art workflows.",
    href: "/images",
    icon: ImageIcon,
  },
  {
    title: "Chat",
    description: "Preview one-on-one character chat with runtime context.",
    href: "/chat",
    icon: MessageSquareText,
  },
  {
    title: "Library",
    description: "Browse saved characters, personas, lore, and bundles.",
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
      eyebrow={isSettings ? "Workspace controls" : "Romance creation suite"}
      title={isSettings ? "Settings" : "Studio Dashboard"}
      subtitle={
        isSettings
          ? "Tune runtime appearance, colorways, and advanced engine visibility."
          : "Choose a studio tool to open its workspace."
      }
    >
      {isSettings ? (
        <section className="grid gap-5">
          <ThemeCustomizationStudio />
          <div className="grid gap-5 xl:grid-cols-2">
            <LiquidThemePreviewSettings />
            <AdvancedRuntimeSettings />
          </div>
        </section>
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
      subtitle="Choose a studio tool to open its workspace."
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
