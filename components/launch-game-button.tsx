"use client";

import { AlertTriangle, LoaderCircle, LockKeyhole, Rocket } from "lucide-react";
import { useState } from "react";

import { bootGameplayLoopInstance } from "@/lib/tauri/tropeInteraction";

type LaunchGameButtonProps = {
  activeSlotIndex: number | null;
  characterName?: string | null;
  hasCharacterLoaded: boolean;
  onLaunchSuccess?: () => void;
};

export function LaunchGameButton({
  activeSlotIndex,
  characterName,
  hasCharacterLoaded,
  onLaunchSuccess,
}: LaunchGameButtonProps) {
  const [isLaunching, setIsLaunching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasSelectedSlot = typeof activeSlotIndex === "number" && activeSlotIndex > 0;
  const canLaunch = hasSelectedSlot && hasCharacterLoaded && !isLaunching;
  const blockedReason = !hasSelectedSlot
    ? "Select a profile slot before launching your session."
    : `Profile Slot ${activeSlotIndex} is blank. Import a Character Card PNG in the studio before launching your session.`;

  async function handleLaunchSequence() {
    if (!canLaunch || !hasSelectedSlot) {
      return;
    }

    setIsLaunching(true);
    setErrorMessage(null);

    try {
      await bootGameplayLoopInstance(activeSlotIndex);
      onLaunchSuccess?.();
    } catch (caught) {
      setErrorMessage(caught instanceof Error ? caught.message : String(caught));
    } finally {
      setIsLaunching(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-2.5">
      <div className="group relative">
        {!canLaunch && (
          <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-72 -translate-x-1/2 rounded-xl border border-amber-500/20 bg-zinc-950/95 p-3 text-center opacity-0 shadow-2xl backdrop-blur transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
            <span className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-300">
              <AlertTriangle className="size-3" />
              Pre-flight required
            </span>
            <p className="mt-1 text-[11px] leading-normal text-zinc-400">
              {blockedReason}
            </p>
          </div>
        )}

        <button
          aria-disabled={!canLaunch}
          className={`relative flex w-full select-none items-center justify-center overflow-hidden rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest shadow-xl transition-all duration-500 ${
            canLaunch
              ? "cursor-pointer bg-gradient-to-r from-rose-700 to-pink-600 text-white shadow-rose-950/20 hover:from-rose-600 hover:to-pink-500 active:scale-[0.98]"
              : "cursor-not-allowed border border-zinc-800/60 bg-zinc-900/40 text-zinc-600 shadow-none"
          }`}
          onClick={() => void handleLaunchSequence()}
          type="button"
        >
          <span className="relative z-10 flex min-w-0 items-center justify-center gap-2">
            {isLaunching ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                <span>Spinning up simulation</span>
              </>
            ) : canLaunch ? (
              <>
                <Rocket className="size-4 shrink-0" />
                <span className="truncate">
                  Enter Chronicle with {characterName ?? "Character"}
                </span>
                <span className="shrink-0 font-mono text-[10px] font-normal normal-case tracking-normal opacity-70">
                  Slot {activeSlotIndex}
                </span>
              </>
            ) : (
              <>
                <LockKeyhole className="size-4" />
                <span>Simulation Locked</span>
              </>
            )}
          </span>

          {canLaunch && (
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent animate-[launch-shimmer_2.5s_infinite]" />
          )}
        </button>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-3 text-left font-mono text-[11px] leading-normal text-red-300">
          <strong className="mb-0.5 block font-sans text-[9px] uppercase tracking-wide">
            Boot intercept exception
          </strong>
          {errorMessage}
        </div>
      )}
    </div>
  );
}
