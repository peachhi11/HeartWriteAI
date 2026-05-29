"use client";

import type * as React from "react";
import Image from "next/image";
import { Gauge, Heart, ShieldAlert, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { RomanceTropeClass } from "@/types/character-card/RomanceTropeClassification";
import type { ExtractedCharacterPayload } from "@/types/studio";
import { COMPLETE_TROPE_MATRIX } from "@/types/tropes";

interface CharacterPreviewSheetProps {
  cardPayload: ExtractedCharacterPayload | null;
  isCommitting?: boolean;
  onClose: () => void;
  onCommitToSlot: () => void;
}

export function CharacterPreviewSheet(props: CharacterPreviewSheetProps) {
  const isOpen = props.cardPayload !== null;
  const payload = props.cardPayload;

  return (
    <>
      <button
        aria-hidden={!isOpen}
        aria-label="Close character preview"
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ease-out",
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        onClick={props.onClose}
        tabIndex={isOpen ? 0 : -1}
        type="button"
      />

      <aside
        aria-hidden={!isOpen}
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-full max-w-md transform-gpu flex-col border-l bg-background shadow-2xl transition-transform duration-theatrical ease-snappy-slide will-change-transform",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {payload ? (
          <>
            <div className="flex items-center justify-between gap-4 border-b p-5">
              <div className="min-w-0">
                <h3 className="text-xs font-black uppercase tracking-wide text-primary">
                  Staging Inspection
                </h3>
                <p className="mt-1 truncate font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                  Verifying card metadata before commit
                </p>
              </div>
              <Button
                aria-label="Close preview sheet"
                onClick={props.onClose}
                size="icon"
                type="button"
                variant="outline"
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <div className="grid gap-5">
                <section className="animate-fade-in flex items-center gap-4 rounded-md border bg-muted/30 p-4">
                  <Image
                    alt={`${payload.name} avatar preview`}
                    className="size-16 shrink-0 rounded-full border object-cover"
                    height={64}
                    src={payload.avatarDataUri}
                    unoptimized
                    width={64}
                  />
                  <div className="min-w-0">
                    <h4 className="truncate text-base font-black">
                      {payload.name}
                    </h4>
                    <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">
                      {payload.description || "No visible description provided."}
                    </p>
                  </div>
                </section>

                <ToneSection
                  emptyLabel="No priority preferences set."
                  icon={<Heart className="size-3.5" />}
                  label="Preferred Conversational Tokens"
                  tones={payload.preferredTones}
                  variant="preferred"
                />

                <ToneSection
                  emptyLabel="No forbidden friction fields."
                  icon={<ShieldAlert className="size-3.5" />}
                  label="Forbidden Behavioral Classes"
                  tones={payload.forbiddenTones}
                  variant="forbidden"
                />

                <section className="grid gap-2">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wide text-muted-foreground">
                    <Gauge className="size-3.5" />
                    Persona Soft-Gating Baselines
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <ThresholdCard
                      label="Min Charm"
                      value={payload.requiredThresholds?.minCharm ?? 0}
                    />
                    <ThresholdCard
                      label="Min Willpower"
                      value={payload.requiredThresholds?.minWillpower ?? 0}
                    />
                  </div>
                </section>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t bg-background p-5">
              <Button onClick={props.onClose} type="button" variant="outline">
                Discard Card
              </Button>
              <Button
                disabled={props.isCommitting}
                onClick={props.onCommitToSlot}
                type="button"
              >
                {props.isCommitting ? "Committing..." : "Commit to Profile Slot"}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-center text-xs text-muted-foreground">
            Waiting for parsed character payload.
          </div>
        )}
      </aside>
    </>
  );
}

function ToneSection(props: {
  emptyLabel: string;
  icon: React.ReactNode;
  label: string;
  tones: RomanceTropeClass[];
  variant: "forbidden" | "preferred";
}) {
  return (
    <section className="grid gap-2">
      <div
        className={cn(
          "flex items-center gap-2 text-[10px] font-black uppercase tracking-wide",
          props.variant === "forbidden"
            ? "text-destructive"
            : "text-muted-foreground",
        )}
      >
        {props.icon}
        {props.label}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {props.tones.length > 0 ? (
          props.tones.map((tone) => {
            const config = COMPLETE_TROPE_MATRIX[tone];

            return (
              <span
                className={cn(
                  "rounded-full border bg-background px-2 py-1 text-[10px] font-bold uppercase tracking-wide",
                  props.variant === "forbidden"
                    ? "border-destructive/30 text-destructive"
                    : config.border,
                  props.variant === "preferred" ? config.headerText : null,
                )}
                key={tone}
              >
                {formatTropeLabel(tone)}
              </span>
            );
          })
        ) : (
          <span className="text-xs text-muted-foreground">{props.emptyLabel}</span>
        )}
      </div>
    </section>
  );
}

function ThresholdCard(props: { label: string; value: number }) {
  return (
    <div className="rounded-md border bg-muted/30 p-3">
      <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
        {props.label}
      </p>
      <p className="mt-1 font-mono text-lg font-black">
        {props.value}
        <span className="ml-1 text-xs font-normal text-muted-foreground">
          pts
        </span>
      </p>
    </div>
  );
}

function formatTropeLabel(trope: RomanceTropeClass) {
  return trope
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
