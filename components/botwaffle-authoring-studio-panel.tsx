"use client";

import {
  Archive,
  BookOpenText,
  Boxes,
  BrainCircuit,
  FileText,
  type LucideIcon,
  WandSparkles,
} from "lucide-react";

import {
  BOTWAFFLE_AUTHORING_STUDIO_LANES,
  BOTWAFFLE_EXPORT_BUNDLE_ITEMS,
  BOTWAFFLE_REPLACEMENT_RULES,
  BOTWAFFLE_SECTION_GENERATION_STEPS,
  type BotWaffleAuthoringLaneId,
} from "@/data/botWaffleAuthoringStudio";
import { cn } from "@/lib/utils";

const LANE_ICONS: Record<BotWaffleAuthoringLaneId, LucideIcon> = {
  authoring_studio_flow: Boxes,
  model_connection_settings: BrainCircuit,
  import_export_bundle: Archive,
  section_generation: WandSparkles,
  prompt_template_organization: BookOpenText,
};

export function BotWaffleAuthoringStudioPanel() {
  const nowLanes = BOTWAFFLE_AUTHORING_STUDIO_LANES.filter(
    (lane) => lane.priority === "now",
  );
  const upcomingLanes = BOTWAFFLE_AUTHORING_STUDIO_LANES.filter(
    (lane) => lane.priority !== "now",
  );

  return (
    <section className="liquid-glass-strong grid gap-5 rounded-[1.75rem] border p-5">
      <header className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Authoring studio pattern
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            BotWaffle ideas, translated for HeartWriteAI.
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Keep the useful workflow shape: one character workspace, model
            settings, review-first imports, section generation, and organized
            prompt templates. Leave the Electron data model and unsafe provider
            prompts behind.
          </p>
        </div>

        <div className="rounded-2xl border border-border/70 bg-background/50 p-3 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">Implemented lanes</p>
          <p className="mt-1">
            {nowLanes.length} active / {upcomingLanes.length} queued
          </p>
        </div>
      </header>

      <div className="grid gap-3 xl:grid-cols-5">
        {BOTWAFFLE_AUTHORING_STUDIO_LANES.map((lane) => {
          const Icon = LANE_ICONS[lane.id];

          return (
            <article
              key={lane.id}
              className={cn(
                "grid content-start gap-3 rounded-2xl border bg-background/45 p-4",
                lane.priority === "now"
                  ? "border-emerald-400/30"
                  : "border-border/70",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="liquid-icon flex size-10 shrink-0 items-center justify-center rounded-2xl text-muted-foreground">
                  <Icon className="size-4" />
                </span>
                <span
                  className={cn(
                    "rounded-full border px-2 py-1 text-[9px] font-black uppercase tracking-[0.16em]",
                    lane.priority === "now"
                      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-700 dark:text-emerald-200"
                      : "border-border/70 text-muted-foreground",
                  )}
                >
                  {lane.priority}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-semibold">{lane.title}</h3>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  {lane.heartwriteAdaptation}
                </p>
              </div>
              <ul className="grid gap-1 text-[11px] leading-5 text-muted-foreground">
                {lane.currentSurface.slice(0, 3).map((surface) => (
                  <li key={surface}>- {surface}</li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
        <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
          <div className="mb-3 flex items-center gap-2">
            <WandSparkles className="size-4 text-user-primary" />
            <h3 className="text-sm font-semibold">
              Section-by-section generation map
            </h3>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {BOTWAFFLE_SECTION_GENERATION_STEPS.map((step) => (
              <div
                key={step.id}
                className="rounded-xl border border-border/70 bg-card/55 p-3"
              >
                <p className="text-xs font-semibold">{step.label}</p>
                <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                  {step.targetField}
                </p>
                <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
                  {step.outputRule}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
          <div className="mb-3 flex items-center gap-2">
            <FileText className="size-4 text-user-primary" />
            <h3 className="text-sm font-semibold">
              Review-first bundle contents
            </h3>
          </div>
          <div className="grid gap-2">
            {BOTWAFFLE_EXPORT_BUNDLE_ITEMS.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-border/70 bg-card/55 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold">{item.label}</p>
                  <code className="truncate rounded bg-muted px-1.5 py-1 text-[9px] text-muted-foreground">
                    {item.pathHint}
                  </code>
                </div>
                <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
                  {item.reviewRule}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-400/25 bg-amber-400/10 p-4">
        <div className="mb-3 flex items-center gap-2">
          <Archive className="size-4 text-amber-700 dark:text-amber-200" />
          <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-100">
            Replacement rules
          </h3>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          {BOTWAFFLE_REPLACEMENT_RULES.map((rule) => (
            <article
              key={rule.id}
              className="rounded-xl border border-amber-400/20 bg-background/55 p-3"
            >
              <p className="text-xs font-semibold">{rule.replace}</p>
              <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                {rule.heartwritePolicy}
              </p>
              <p className="mt-2 text-[10px] leading-4 text-amber-800 dark:text-amber-200">
                {rule.reason}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
