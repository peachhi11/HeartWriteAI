"use client";

import Link from "next/link";
import { useState } from "react";
import { convertFileSrc } from "@tauri-apps/api/core";
import {
  BookOpen,
  Heart,
  LibraryBig,
  MessageCircle,
  PanelsTopLeft,
  Sparkles,
  UserRound,
} from "lucide-react";

import type { CacheItemSummary, useCardLibrary } from "@/hooks/useCardLibrary";
import type { ValidatedCharacterCardV3 } from "@/types/ccv3";

interface CharacterLibraryWorkspaceProps {
  activeCard: ValidatedCharacterCardV3 | null;
  currentFilePath: string | null;
  library: ReturnType<typeof useCardLibrary>;
  onCardSelect: (filePath: string) => void;
  onConvertToPersona?: () => void;
  onOpenLibraryDrawer: () => void;
}

const profileSections = [
  {
    key: "profile",
    label: "Profile",
  },
  {
    key: "personality",
    label: "Personality",
  },
  {
    key: "behaviour",
    label: "Behaviour",
  },
  {
    key: "romance",
    label: "Romance Dynamics",
  },
  {
    key: "creator",
    label: "Creator Notes",
  },
] as const;

export function CharacterLibraryWorkspace({
  activeCard,
  currentFilePath,
  library,
  onCardSelect,
  onConvertToPersona,
  onOpenLibraryDrawer,
}: CharacterLibraryWorkspaceProps) {
  if (activeCard) {
    return (
      <section className="grid gap-5 xl:grid-cols-[minmax(22rem,0.82fr)_minmax(0,1fr)]">
        <FeaturedCharacterProfile
          activeCard={activeCard}
          currentFilePath={currentFilePath}
          onConvertToPersona={onConvertToPersona}
          onOpenLibraryDrawer={onOpenLibraryDrawer}
        />
        <ProfileAccordion activeCard={activeCard} />
      </section>
    );
  }

  return (
    <section className="grid min-h-[34rem] overflow-hidden rounded-lg border bg-card/80 xl:grid-cols-[minmax(22rem,0.9fr)_minmax(0,1fr)]">
      <div className="flex flex-col justify-end border-b bg-muted/30 p-6 xl:border-b-0 xl:border-r">
        <div className="mb-auto flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <LibraryBig className="size-4" />
          Character Library
        </div>
        <div className="mx-auto flex aspect-[4/3] w-full max-w-sm items-center justify-center rounded-md border border-dashed bg-background/60">
          <UserRound className="size-24 text-muted-foreground/25" />
        </div>
        <div className="mt-8 max-w-xl">
          <h2 className="text-3xl font-semibold tracking-tight">
            Choose a character to inspect their card.
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            The drawer stays compact for quick switching. This page gives the
            selected card room for profile, personality, behaviour, romance,
            and creator notes before editing.
          </p>
          <button
            type="button"
            onClick={onOpenLibraryDrawer}
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:opacity-90"
          >
            <PanelsTopLeft className="size-4" />
            Open Libraries
          </button>
        </div>
      </div>

      <div className="grid content-start gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold">Saved Characters</h3>
            <p className="text-sm text-muted-foreground">
              {library.isDesktopRuntime
                ? `${library.metadata.totalCount} saved in the local cache`
                : "Desktop library cache appears in the Tauri app"}
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenLibraryDrawer}
            className="rounded-md border px-3 py-2 text-xs font-semibold transition hover:bg-muted"
          >
            Filters
          </button>
        </div>

        <CharacterCardGrid
          items={library.items}
          isDesktopRuntime={library.isDesktopRuntime}
          loading={library.loading}
          onCardSelect={onCardSelect}
        />
      </div>
    </section>
  );
}

function FeaturedCharacterProfile({
  activeCard,
  currentFilePath,
  onConvertToPersona,
  onOpenLibraryDrawer,
}: {
  activeCard: ValidatedCharacterCardV3;
  currentFilePath: string | null;
  onConvertToPersona?: () => void;
  onOpenLibraryDrawer: () => void;
}) {
  const profile = buildCharacterProfile(activeCard);

  return (
    <section className="overflow-hidden rounded-lg border bg-card">
      <CardAvatarPreview
        className="aspect-[5/3] border-b"
        filePath={currentFilePath}
        name={activeCard.data.name}
      />
      <div className="grid gap-5 p-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-semibold tracking-tight">
              {activeCard.data.name}
            </h2>
            <Heart className="size-8 text-muted-foreground" />
          </div>
          {profile.hook ? (
            <p className="mt-2 text-lg text-muted-foreground">
              &quot;{profile.hook}&quot;
            </p>
          ) : null}
          {profile.summary ? (
            <p className="mt-4 leading-7 text-muted-foreground">
              {profile.summary}
            </p>
          ) : null}
        </div>

        <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <InfoPill label="Creator" value={activeCard.data.creator || "Unknown"} />
          <InfoPill
            label="Version"
            value={activeCard.data.character_version || "Draft"}
          />
          <InfoPill label="Source" value={currentFilePath ?? "Unsaved import"} />
          <InfoPill
            label="Greetings"
            value={`${1 + activeCard.data.alternate_greetings.length}`}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {activeCard.data.tags.slice(0, 8).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
          <button
            type="button"
            onClick={onOpenLibraryDrawer}
            className="inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition hover:bg-muted"
          >
            <LibraryBig className="size-4" />
            Switch Character
          </button>
          <Link
            href="/chat"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:opacity-90"
            title="Open chat. Scenario override remains optional because character cards include their own scenario."
          >
            <MessageCircle className="size-4" />
            Chat
          </Link>
        </div>
        {onConvertToPersona ? (
          <button
            type="button"
            onClick={onConvertToPersona}
            className="inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition hover:bg-muted"
          >
            <UserRound className="size-4" />
            Convert to Persona
          </button>
        ) : null}
      </div>
    </section>
  );
}

function ProfileAccordion({
  activeCard,
}: {
  activeCard: ValidatedCharacterCardV3;
}) {
  const content = buildAccordionContent(activeCard);

  return (
    <section className="rounded-lg border bg-card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Character Profile</h2>
          <p className="text-sm text-muted-foreground">
            Quick-read card sections before the full editor.
          </p>
        </div>
        <BookOpen className="size-5 text-muted-foreground" />
      </div>
      <div className="grid gap-3">
        {profileSections.map((section, index) => (
          <details
            key={section.key}
            className="rounded-md border bg-background/60 p-4"
            open={index === 0}
          >
            <summary className="cursor-pointer text-sm font-semibold">
              {section.label}
            </summary>
            <div className="mt-3 whitespace-pre-line text-sm leading-6 text-muted-foreground">
              {content[section.key] || "No saved content for this section yet."}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

function CharacterCardGrid({
  isDesktopRuntime,
  items,
  loading,
  onCardSelect,
}: {
  isDesktopRuntime: boolean;
  items: CacheItemSummary[];
  loading: boolean;
  onCardSelect: (filePath: string) => void;
}) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-56 animate-pulse rounded-md border bg-muted/40"
          />
        ))}
      </div>
    );
  }

  if (!isDesktopRuntime || items.length === 0) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-md border border-dashed bg-background/50 p-6 text-center">
        <Sparkles className="mb-3 size-8 text-muted-foreground/40" />
        <p className="max-w-sm text-sm text-muted-foreground">
          Saved character cards will appear here after importing or saving them
          in the desktop workspace.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((card) => (
        <button
          key={card.id}
          type="button"
          onClick={() => onCardSelect(card.file_path)}
          className="group overflow-hidden rounded-md border bg-background text-left transition hover:border-rose-200 hover:shadow-sm"
        >
          <CardAvatarPreview
            className="aspect-[4/3] border-b"
            filePath={card.file_path}
            name={card.name}
          />
          <div className="grid gap-3 p-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {card.framework || "Character Card"}
              </p>
              <h3 className="mt-1 line-clamp-2 text-lg font-semibold tracking-tight">
                {card.name}
              </h3>
            </div>
            <div className="flex flex-wrap gap-1">
              {card.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
            <span className="text-sm font-semibold text-foreground">
              Open profile
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}

function CardAvatarPreview(props: {
  className?: string;
  filePath: string | null;
  name: string;
}) {
  const canPreview = props.filePath
    ? /\.(apng|png)$/i.test(props.filePath)
    : false;
  const src = canPreview && props.filePath ? convertFileSrc(props.filePath) : null;
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const canRenderImage = src && failedSrc !== src;

  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-muted/40 ${props.className ?? ""}`}>
      {canRenderImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={`${props.name} avatar preview`}
          className="absolute inset-0 size-full object-cover"
          loading="lazy"
          onError={() => setFailedSrc(src)}
          src={src}
        />
      ) : (
        <div className="flex size-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_top,var(--liquid-tint),transparent_55%)] text-center">
          <UserRound className="size-14 text-muted-foreground/25" />
          <p className="max-w-56 px-4 text-xs font-medium text-muted-foreground/70">
            Avatar preview unavailable
          </p>
        </div>
      )}
    </div>
  );
}

function InfoPill(props: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-md border bg-background/60 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {props.label}
      </p>
      <p className="mt-1 truncate font-medium text-foreground">{props.value}</p>
    </div>
  );
}

function buildCharacterProfile(card: ValidatedCharacterCardV3) {
  return {
    hook: firstNonEmptyLine(card.data.first_mes),
    summary: firstParagraph(card.data.description) || firstParagraph(card.data.scenario),
  };
}

function buildAccordionContent(card: ValidatedCharacterCardV3) {
  return {
    behaviour: joinSections([
      card.data.mes_example ? `Dialogue examples:\n${card.data.mes_example}` : "",
      card.data.post_history_instructions
        ? `Runtime behaviour:\n${card.data.post_history_instructions}`
        : "",
      card.data.system_prompt ? `System posture:\n${card.data.system_prompt}` : "",
    ]),
    creator: card.data.creator_notes,
    personality: card.data.personality,
    profile: joinSections([
      card.data.description,
      card.data.scenario ? `Scenario:\n${card.data.scenario}` : "",
    ]),
    romance: joinSections([
      card.data.first_mes ? `Opening:\n${card.data.first_mes}` : "",
      card.data.alternate_greetings.length
        ? `Alternate openings:\n${card.data.alternate_greetings.join("\n\n")}`
        : "",
    ]),
  };
}

function joinSections(sections: string[]) {
  return sections
    .map((section) => section.trim())
    .filter(Boolean)
    .join("\n\n");
}

function firstParagraph(value: string) {
  return value.trim().split(/\n\s*\n/)[0]?.trim() ?? "";
}

function firstNonEmptyLine(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean) ?? "";
}
