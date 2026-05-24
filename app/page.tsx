"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  BookOpenText,
  Bot,
  Boxes,
  Braces,
  Feather,
  LibraryBig,
  MessageSquareText,
} from "lucide-react";

import { CharacterCardImportExport } from "@/components/character-card-import-export";
import { RelationshipDashboard } from "@/features/relationship/components/RelationshipDashboard";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImageIntakePreview } from "@/components/image-pipeline/image-intake-preview";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getNativeAppVersion, greetNative } from "@/lib/tauri/native";

const workflowCards = [
  {
    title: "Character Cards",
    description: "CCV3-first creation, editing, conversion, and PNG export.",
    icon: Bot,
  },
  {
    title: "Persona Matching",
    description: "Playable user personas matched to route energy and card tone.",
    icon: Feather,
  },
  {
    title: "Lorebooks",
    description: "Scoped world, character, persona, and scenario lore assets.",
    icon: LibraryBig,
  },
  {
    title: "Chat Runtime",
    description: "Context compilation, active lore, summaries, and local models.",
    icon: MessageSquareText,
  },
];

const migrationLanes = [
  "Next.js app router shell",
  "Tailwind v4 design tokens",
  "shadcn/ui source components",
  "Tauri desktop wrapper",
  "Local-first asset storage",
  "Future Ollama / llama.cpp bridge",
];

export default function Home() {
  const [nativeStatus, setNativeStatus] = useState("Tauri bridge not checked yet.");
  const [nativeVersion, setNativeVersion] = useState<string | null>(null);

  async function checkNativeBridge() {
    try {
      const response = await greetNative("HeartWriteAI");
      const version = await getNativeAppVersion();

      setNativeStatus(response);
      setNativeVersion(version);
    } catch {
      setNativeStatus(
        "Running in browser preview. Tauri bridge will respond inside the desktop shell.",
      );
      setNativeVersion(null);
    }
  }

  return (
    <StudioShell
      eyebrow="Romance creation suite"
      title="Studio Dashboard"
      subtitle="A local-first workspace for character cards, persona matching, lorebooks, images, chat, and group chat."
      actions={
        <>
          <Badge variant="outline" className="hidden sm:inline-flex">
            Next.js
          </Badge>
          <Badge variant="outline" className="hidden sm:inline-flex">
            Tauri
          </Badge>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        <CharacterCardImportExport />

        <section className="grid gap-6">
          <Card className="border bg-card/85 shadow-2xl backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Braces data-icon="inline-start" />
                Desktop bridge
              </CardTitle>
              <CardDescription>
                Tauri is wired as the primary native wrapper. Electron can stay as a
                later alternative if file handling or plugin needs justify it.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Button variant="outline" onClick={checkNativeBridge}>
                Check native command
              </Button>
              <p className="rounded-2xl border bg-muted/45 p-4 text-sm text-muted-foreground">
                {nativeStatus}
              </p>
              {nativeVersion ? (
                <p className="text-xs text-muted-foreground">
                  Native app version: {nativeVersion}
                </p>
              ) : null}
              <Separator />
              <div className="grid gap-2 text-sm">
                {migrationLanes.map((lane) => (
                  <div key={lane} className="flex items-center gap-2">
                    <BadgeCheck className="size-4 text-muted-foreground" />
                    <span>{lane}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <ImageIntakePreview />

        <Tabs defaultValue="workspace" className="rounded-3xl border bg-card/75 p-4 shadow-xl backdrop-blur">
          <TabsList>
            <TabsTrigger value="workspace">Workspace</TabsTrigger>
            <TabsTrigger value="runtime">Runtime</TabsTrigger>
            <TabsTrigger value="lore">Lore</TabsTrigger>
          </TabsList>
          <TabsContent value="workspace" className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {workflowCards.map((card) => (
              <Card key={card.title} className="bg-background/70">
                <CardHeader>
                  <card.icon className="size-5 text-muted-foreground" />
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </TabsContent>
          <TabsContent value="runtime" className="mt-4 grid gap-4">
            <RelationshipDashboard />
            <Card className="bg-background/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Boxes data-icon="inline-start" />
                  Context compiler first
                </CardTitle>
                <CardDescription>
                  Chat should wait until character, persona, scenario, active lore,
                  recent chat, and summaries compile into one shared token budget.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline">
                  <Link href="/chat">Open chat preview</Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="lore" className="mt-4">
            <Card className="bg-background/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpenText data-icon="inline-start" />
                  Lorebook assets stay editable
                </CardTitle>
                <CardDescription>
                  Generated entries should remain modular fields with priority,
                  probability, trigger, scope, and attachment controls.
                </CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StudioShell>
  );
}
