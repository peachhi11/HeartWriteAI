"use client";

import { useState } from "react";
import {
  BookOpenText,
  Brush,
  Flame,
  Heart,
  History,
  NotebookTabs,
  Orbit,
  Scissors,
  Sparkles,
  WandSparkles,
  X,
} from "lucide-react";

export type ProsePixieActionId =
  | "glow_up"
  | "aura_alignment"
  | "soul_sketcher"
  | "glamour_glow_up"
  | "mirror_mirror"
  | "memory_mint"
  | "hook_and_line"
  | "flesh_it_out"
  | "trim_the_fat"
  | "memory_maker"
  | "spark_starter"
  | "vibe_check"
  | "spice_rack"
  | "add_some_spice"
  | "heat_wave"
  | "uncensored";

export interface ProsePixieTarget {
  characterName: string;
  fieldLabel: string;
  value: string;
}

interface ProsePixieAction {
  id: ProsePixieActionId;
  label: string;
  description: string;
  instruction: string;
  tone: "blue" | "emerald" | "rose" | "violet";
  icon: typeof Sparkles;
  requiresAdultMode?: boolean;
}

interface ProsePixieModalProps {
  adultModeEnabled: boolean;
  target: ProsePixieTarget | null;
  onApply: (value: string) => void;
  onClose: () => void;
}

export const PROSE_PIXIE_ACTIONS: ProsePixieAction[] = [
  {
    id: "glow_up",
    label: "Glow Up",
    description: "Make the section read cleaner, richer, and more intentional.",
    instruction:
      `Role: Expert fiction editor.

Task:
Rewrite the provided text so it reads smoother, stronger, and more professionally written while preserving the original meaning, facts, characterization, lore, and intent.

Instructions:
- Improve prose quality, rhythm, sentence flow, clarity, and readability.
- Strengthen word choice where appropriate.
- Remove awkward phrasing.
- Do not add new lore, traits, events, or facts.
- Preserve the original tone.
- Keep approximately the same length unless minor adjustments improve quality.

Output Rules:
- Output only the revised text.
- Do not explain changes.
- Do not add notes, headings, commentary, or formatting outside the revised text.`,
    tone: "violet",
    icon: Sparkles,
  },
  {
    id: "aura_alignment",
    label: "Aura Alignment",
    description: "Tune the character's core energy, vibes, and emotional gravity.",
    instruction:
      `Role: Character identity analyst.

Task:
Refine and strengthen the character's core energy and overall presence.

Instructions:
- Clarify worldview, emotional themes, strengths, flaws, desires, fears, and social dynamics.
- Make personality traits feel cohesive and intentional.
- Emphasize what makes the character memorable.

Output Rules:
- Output only the revised text.
- Do not explain changes.
- Do not add headings, notes, or commentary.`,
    tone: "violet",
    icon: Orbit,
  },
  {
    id: "soul_sketcher",
    label: "Soul Sketcher",
    description: "Draw out quirks, private habits, and inner texture.",
    instruction:
      `Role: Personality development specialist.

Task:
Reveal deeper individuality and uniqueness.

Instructions:
- Add quirks, rituals, habits, preferences, contradictions, comforts, pet peeves, and distinctive behaviors.
- Focus on memorable details that make the character feel unique.
- Keep additions consistent with the existing character.

Output Rules:
- Output only the revised text.
- Do not explain changes.
- Do not add headings, notes, or commentary.`,
    tone: "emerald",
    icon: BookOpenText,
  },
  {
    id: "glamour_glow_up",
    label: "Glamour Glow-Up",
    description: "Add vivid aesthetic and styling detail.",
    instruction:
      `Role: Character visual designer.

Task:
Enhance the richness and appeal of the character's visual presentation.

Instructions:
- Add vivid aesthetic details, style choices, accessories, grooming habits, posture, and visual motifs.
- Ensure appearance supports and reflects personality.
- Maintain consistency with existing descriptions.

Output Rules:
- Output only the revised text.
- Do not explain changes.
- Do not add headings, notes, or commentary.`,
    tone: "violet",
    icon: Brush,
  },
  {
    id: "mirror_mirror",
    label: "Mirror Mirror",
    description: "Paint a clearer, more grounded appearance.",
    instruction:
      `Role: Character portrait writer.

Task:
Create a clearer, more vivid physical description.

Instructions:
- Improve descriptions of facial features, expressions, movement, posture, build, and distinguishing characteristics.
- Increase visual clarity and specificity.
- Remain grounded and internally consistent.

Output Rules:
- Output only the revised text.
- Do not explain changes.
- Do not add headings, notes, or commentary.`,
    tone: "blue",
    icon: Sparkles,
  },
  {
    id: "memory_mint",
    label: "Memory Mint",
    description: "Craft the past moments that shaped them.",
    instruction:
      `Role: Character historian.

Task:
Develop meaningful events that shaped the character.

Instructions:
- Add defining memories, relationships, victories, failures, losses, lessons, and turning points.
- Connect those experiences to present-day behavior and personality.
- Maintain lore consistency.

Output Rules:
- Output only the revised text.
- Do not explain changes.
- Do not add headings, notes, or commentary.`,
    tone: "emerald",
    icon: History,
  },
  {
    id: "hook_and_line",
    label: "Hook & Line",
    description: "Make the first sentence pull the user in.",
    instruction:
      `Role: Roleplay onboarding specialist.

Task:
Rewrite the introduction to maximize engagement and response potential.

Instructions:
- Begin with a compelling hook.
- Establish immediate curiosity, tension, emotion, stakes, or intrigue.
- Encourage user participation through natural opportunities for interaction.
- Avoid generic openings.

Output Rules:
- Output only the revised text.
- Do not explain changes.
- Do not add headings, notes, or commentary.`,
    tone: "rose",
    icon: Heart,
  },
  {
    id: "flesh_it_out",
    label: "Flesh It Out",
    description: "Add substance, specificity, and emotional texture.",
    instruction:
      `Role: Character and narrative development specialist.

Task:
Expand the provided text with richer detail and specificity.

Instructions:
- Add sensory detail, body language, behavioral cues, emotional nuance, environmental texture, and distinctive observations.
- Add depth without changing established lore.
- Preserve the original tone and intent.
- Make additions feel natural rather than padded.

Output Rules:
- Output only the revised text.
- Do not explain changes.
- Do not add headings, notes, or commentary.`,
    tone: "emerald",
    icon: BookOpenText,
  },
  {
    id: "trim_the_fat",
    label: "Trim the Fat",
    description: "Condense repetition and keep only the sharpest material.",
    instruction:
      `Role: Developmental editor.

Task:
Condense the provided text while preserving its strongest ideas and characterization.

Instructions:
- Remove repetition, filler, redundancy, weak modifiers, and unnecessary exposition.
- Retain important information and memorable lines.
- Improve clarity and efficiency.

Output Rules:
- Output only the revised text.
- Do not explain changes.
- Do not add headings, notes, or commentary.`,
    tone: "blue",
    icon: Scissors,
  },
  {
    id: "memory_maker",
    label: "Memory Maker",
    description: "Build past experiences that shape the character now.",
    instruction:
      `Role: Character backstory architect.

Task:
Deepen the character's history and personal foundation.

Instructions:
- Add formative experiences, important relationships, defining moments, motivations, fears, habits, regrets, and personal values.
- Ensure new details logically support current behavior and personality.
- Remain consistent with existing lore and characterization.

Output Rules:
- Output only the revised text.
- Do not explain changes.
- Do not add headings, notes, or commentary.`,
    tone: "emerald",
    icon: NotebookTabs,
  },
  {
    id: "spark_starter",
    label: "Spark Starter",
    description: "Create initial romantic tension and a stronger hook.",
    instruction:
      `Role: Interactive roleplay writer.

Task:
Strengthen an opening message, greeting, or scenario introduction.

Instructions:
- Increase intrigue, chemistry, tension, curiosity, and emotional engagement.
- Create stronger opportunities for user participation.
- Establish a compelling narrative hook immediately.
- Avoid passive introductions.

Output Rules:
- Output only the revised text.
- Do not explain changes.
- Do not add headings, notes, or commentary.`,
    tone: "rose",
    icon: Heart,
  },
  {
    id: "vibe_check",
    label: "Vibe Check",
    description: "Fix slang, attitude, cadence, and social voice.",
    instruction:
      `Role: Voice and tone specialist.

Task:
Adjust the character's voice and presentation.

Instructions:
- Match the requested tone, age, confidence level, social background, slang usage, and personality style.
- Preserve meaning while changing delivery.
- Keep characterization internally consistent.

Output Rules:
- Output only the revised text.
- Do not explain changes.
- Do not add headings, notes, or commentary.`,
    tone: "blue",
    icon: WandSparkles,
  },
  {
    id: "spice_rack",
    label: "Spice Rack",
    description: "Increase tension slightly while staying within this rating.",
    instruction:
      `Role: Romance editor.

Task:
Increase romantic tension while maintaining the current content rating.

Instructions:
- Strengthen attraction, emotional intimacy, flirtation, anticipation, and chemistry.
- Focus on subtext, longing, and connection.
- Do not introduce explicit sexual content.
- Do not exceed the existing rating.

Output Rules:
- Output only the revised text.
- Do not explain changes.
- Do not add headings, notes, or commentary.`,
    tone: "rose",
    icon: Flame,
  },
  {
    id: "add_some_spice",
    label: "Add Some Spice",
    description: "Raise the heat and allow the rating to move one step up.",
    instruction:
      `Role: Romance progression specialist.

Task:
Increase romantic and sensual intensity.

Instructions:
- Strengthen chemistry, attraction, emotional vulnerability, and desire.
- Allow the content to naturally move up one rating level if appropriate.
- Maintain character consistency and narrative quality.
- Prioritize tension and emotional engagement over explicitness.

Output Rules:
- Output only the revised text.
- Do not explain changes.
- Do not add headings, notes, or commentary.`,
    tone: "rose",
    icon: Flame,
  },
  {
    id: "heat_wave",
    label: "Heat Wave",
    description: "Make the scene immediately hotter and more physically charged.",
    instruction:
      `Role: High-intensity romance writer.

Task:
Make the scene significantly more emotionally charged and physically intense.

Instructions:
- Increase urgency, attraction, chemistry, emotional tension, and romantic momentum.
- Preserve narrative coherence and character consistency.
- Escalate naturally from the existing text.

Output Rules:
- Output only the revised text.
- Do not explain changes.
- Do not add headings, notes, or commentary.`,
    tone: "rose",
    icon: Flame,
  },
  {
    id: "uncensored",
    label: "Uncensored",
    description: "Adult-only mode for explicitly NSFW card material.",
    instruction:
      "Rewrite for explicit adult material only when the card is configured for adult content. Preserve consent, adult status, and safety boundaries.",
    tone: "rose",
    icon: Flame,
    requiresAdultMode: true,
  },
];

export default function ProsePixieModal({
  adultModeEnabled,
  onApply,
  onClose,
  target,
}: ProsePixieModalProps) {
  const [selectedActionId, setSelectedActionId] =
    useState<ProsePixieActionId>("glow_up");
  const [customInstruction, setCustomInstruction] = useState("");
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const isOpen = target !== null;
  const selectedAction =
    PROSE_PIXIE_ACTIONS.find((action) => action.id === selectedActionId) ??
    PROSE_PIXIE_ACTIONS[0];

  async function handleGenerateDraft() {
    if (!target) {
      return;
    }

    if (selectedAction.requiresAdultMode && !adultModeEnabled) {
      setError("Uncensored mode is locked until adult content is enabled for this card.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/character-card/prose-pixie", {
        body: JSON.stringify({
          actionId: selectedAction.id,
          actionInstruction: selectedAction.instruction,
          actionLabel: selectedAction.label,
          adultModeEnabled,
          characterName: target.characterName,
          customInstruction,
          fieldLabel: target.fieldLabel,
          originalText: target.value,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload = (await response.json().catch(() => null)) as
        | { rewrittenText?: string; error?: string }
        | null;

      if (!response.ok || !payload?.rewrittenText) {
        throw new Error(payload?.error ?? "Prose Pixie could not produce a draft.");
      }

      setDraft(payload.rewrittenText.trim());
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Prose Pixie could not produce a draft.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function handleApplyDraft() {
    if (!draft.trim()) {
      return;
    }

    onApply(draft.trim());
    onClose();
    setDraft("");
    setCustomInstruction("");
    setError(null);
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
        className={`fixed left-1/2 top-1/2 z-50 flex max-h-[88vh] w-[min(92vw,980px)] -translate-x-1/2 flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl transition-all duration-300 ${
          isOpen
            ? "-translate-y-1/2 scale-100 opacity-100"
            : "pointer-events-none -translate-y-[46%] scale-95 opacity-0"
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-900 bg-zinc-900/50 p-5">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-200">
              <WandSparkles className="size-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-black uppercase tracking-widest text-zinc-100">
                Prose Pixie
              </h2>
              <p className="mt-1 text-xs text-zinc-500">
                {target
                  ? `Rewrite ${target.fieldLabel} for ${target.characterName || "this card"}.`
                  : "Polish a selected card section."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-500 transition hover:border-zinc-700 hover:text-zinc-200"
            title="Close Prose Pixie"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 gap-5 overflow-y-auto p-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Quick Improvements
              </h3>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {PROSE_PIXIE_ACTIONS.map((action) => {
                  const Icon = action.icon;
                  const isSelected = action.id === selectedActionId;
                  const isLocked =
                    action.requiresAdultMode === true && !adultModeEnabled;

                  return (
                    <button
                      key={action.id}
                      type="button"
                      disabled={isLocked}
                      onClick={() => setSelectedActionId(action.id)}
                      className={`min-h-20 rounded-xl border p-3 text-left transition ${
                        isSelected
                          ? selectedActionClassName(action.tone)
                          : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                      } ${isLocked ? "cursor-not-allowed opacity-45" : ""}`}
                    >
                      <span className="flex items-center gap-2 text-xs font-bold">
                        <Icon className="size-4 shrink-0" />
                        {action.label}
                      </span>
                      <span className="mt-1 block text-[11px] leading-4 opacity-75">
                        {isLocked ? "Enable adult content to use this mode." : action.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="grid gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Extra Direction
              </span>
              <textarea
                value={customInstruction}
                onChange={(event) => setCustomInstruction(event.currentTarget.value)}
                placeholder="Optional: keep it sweeter, make it sharper, preserve the exact canon facts..."
                className="h-28 resize-none rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-xs leading-5 text-zinc-300 outline-none transition focus:border-violet-500"
              />
            </label>

            {error ? (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs leading-5 text-rose-200">
                {error}
              </div>
            ) : null}
          </div>

          <div className="grid min-h-[440px] gap-3 lg:grid-rows-2">
            <PreviewPane label="Original" value={target?.value ?? ""} />
            <PreviewPane
              label="New Draft"
              placeholder="Your rewritten section will appear here."
              value={draft}
              onChange={setDraft}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-zinc-900 bg-zinc-950 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-zinc-600">
            Uses your configured AI provider. Nothing is applied until you
            accept the draft.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleGenerateDraft()}
              disabled={!target || isGenerating}
              className="inline-flex items-center gap-2 rounded-xl border border-violet-500/40 bg-violet-500/10 px-4 py-2 text-xs font-bold text-violet-200 transition hover:bg-violet-500/20 disabled:cursor-wait disabled:opacity-50"
            >
              <WandSparkles className="size-4" />
              {isGenerating ? "Drafting..." : "Draft Rewrite"}
            </button>
            <button
              type="button"
              onClick={handleApplyDraft}
              disabled={!draft.trim()}
              className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
            >
              Replace Text
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function PreviewPane({
  label,
  onChange,
  placeholder,
  value,
}: {
  label: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  value: string;
}) {
  return (
    <label className="grid min-h-0 gap-2">
      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
        {label}
      </span>
      <textarea
        readOnly={!onChange}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange?.(event.currentTarget.value)}
        className="min-h-0 flex-1 resize-none rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm leading-6 text-zinc-300 outline-none transition placeholder:text-zinc-700 focus:border-violet-500 read-only:text-zinc-500"
      />
    </label>
  );
}

function selectedActionClassName(tone: ProsePixieAction["tone"]) {
  switch (tone) {
    case "blue":
      return "border-sky-500/40 bg-sky-500/10 text-sky-200";
    case "emerald":
      return "border-emerald-500/40 bg-emerald-500/10 text-emerald-200";
    case "rose":
      return "border-rose-500/40 bg-rose-500/10 text-rose-200";
    case "violet":
      return "border-violet-500/40 bg-violet-500/10 text-violet-200";
  }
}
