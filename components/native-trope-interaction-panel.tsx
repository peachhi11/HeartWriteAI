"use client";

import { useState } from "react";

import {
  classifyAndSyncTropeInteraction,
  type NativeRelationshipStatsPayload,
} from "@/lib/tauri/tropeInteraction";

export function NativeTropeInteractionPanel() {
  const [input, setInput] = useState("");
  const [vignette, setVignette] = useState("from-transparent");
  const [stats, setStats] = useState<NativeRelationshipStatsPayload | null>(
    null,
  );
  const [unlockedEvent, setUnlockedEvent] = useState<string | null>(null);
  const [detectedTrope, setDetectedTrope] = useState<string | null>(null);
  const [turnCount, setTurnCount] = useState(0);
  const [milestones, setMilestones] = useState<string[]>([]);
  const [nativeNote, setNativeNote] = useState<string | null>(null);

  async function processTurnToRust() {
    if (!input.trim()) {
      return;
    }

    const response = await classifyAndSyncTropeInteraction(input);

    setStats(response.current_stats);
    setVignette(response.active_vignette);
    setDetectedTrope(response.detected_trope);
    setUnlockedEvent(response.triggered_event_flag);
    setTurnCount(response.total_turns_played);
    setMilestones(response.active_trope_milestones);
    setNativeNote(
      response.native_available
        ? null
        : "Browser preview: saved story updates run inside the desktop app.",
    );
    setInput("");
  }

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-[var(--panel-border)] bg-[var(--panel)] p-5 shadow-[var(--shadow-soft)]">
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${vignette} to-transparent opacity-70 transition-all duration-700`}
      />

      <div className="relative z-10 space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
            Desktop Story Tracker
          </p>
          <h2 className="text-xl font-semibold text-[var(--foreground)]">
            Story Response Test
          </h2>
        </div>

        {stats && (
          <div className="grid grid-cols-5 gap-2 rounded-2xl border border-[var(--panel-border)] bg-[var(--panel-strong)] p-3">
            {Object.entries(stats).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]">
                  {key}
                </div>
                <div className="text-lg font-black text-[var(--accent)]">
                  {value}
                </div>
              </div>
            ))}
          </div>
        )}

        {detectedTrope && (
          <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel-soft)] px-3 py-2 text-sm text-[var(--foreground)]">
            Detected mood: <span className="font-semibold">{detectedTrope}</span>
            <span className="ml-2 text-[var(--muted)]">Turn {turnCount}</span>
          </div>
        )}

        {unlockedEvent && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-950/30 p-3 text-center text-xs font-semibold uppercase tracking-wide text-amber-200">
            Event unlocked: {unlockedEvent}
          </div>
        )}

        {milestones.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {milestones.map((milestone) => (
              <span
                key={milestone}
                className="rounded-full border border-[var(--panel-border)] bg-[var(--panel-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]"
              >
                {milestone}
              </span>
            ))}
          </div>
        )}

        {nativeNote && (
          <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel-soft)] p-3 text-sm text-[var(--muted)]">
            {nativeNote}
          </div>
        )}

        <div className="flex gap-2 rounded-2xl border border-[var(--panel-border)] bg-[var(--panel-strong)] p-2">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                void processTurnToRust();
              }
            }}
            placeholder='Type an action, e.g. "[He steps in front of her] Back off!"'
            className="min-w-0 flex-1 rounded-xl border border-[var(--panel-border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
          />
          <button
            type="button"
            onClick={() => void processTurnToRust()}
            className="rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-bold text-[var(--accent-contrast)] transition hover:brightness-110"
          >
            Submit
          </button>
        </div>
      </div>
    </section>
  );
}
