"use client";

import { Copy, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

import {
  clearGameSlot,
  cloneGameSlot,
  getSaveSlotsManifest,
  loadGameSlot,
  type NativeTropeInteractionPayload,
  type SaveSlotMetadata,
} from "@/lib/tauri/tropeInteraction";
import { DeleteConfirmModal } from "./delete-confirm-modal";
import { LaunchGameButton } from "./launch-game-button";
import { SlotStatusBadge } from "./slot-status-badge";
import { TimestampBadge } from "./timestamp-badge";

type SaveSlotModalProps = {
  onLaunchSuccess?: () => void;
  onSlotLoaded?: (
    slot: SaveSlotMetadata,
    profile: NativeTropeInteractionPayload | null,
  ) => void;
};

export function SaveSlotModal({
  onLaunchSuccess,
  onSlotLoaded,
}: SaveSlotModalProps) {
  const [slots, setSlots] = useState<SaveSlotMetadata[]>([]);
  const [currentActive, setCurrentActive] = useState(1);
  const [cloningFrom, setCloningFrom] = useState<number | null>(null);
  const [purgingSlot, setPurgingSlot] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refreshManifest() {
    const manifest = await getSaveSlotsManifest();
    setSlots(manifest);
    return manifest;
  }

  async function handleSelectSlot(slotIndex: number) {
    setError(null);

    try {
      const loaded = await loadGameSlot(slotIndex);
      setCurrentActive(loaded?.active_slot ?? slotIndex);
      const manifest = await refreshManifest();

      const selected = manifest.find((slot) => slot.slot_index === slotIndex);
      if (selected) {
        onSlotLoaded?.(selected, loaded);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    }
  }

  async function handleCloneToSlot(targetSlot: number) {
    if (cloningFrom === null) {
      return;
    }

    setError(null);

    try {
      await cloneGameSlot(cloningFrom, targetSlot);
      setCloningFrom(null);
      await refreshManifest();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    }
  }

  async function handleClearSlot(slotIndex: number) {
    setError(null);

    try {
      await clearGameSlot(slotIndex);
      setPurgingSlot(null);
      if (currentActive === slotIndex) {
        setCurrentActive(slotIndex);
      }
      await refreshManifest();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    }
  }

  useEffect(() => {
    let cancelled = false;

    getSaveSlotsManifest()
      .then((manifest) => {
        if (!cancelled) {
          setSlots(manifest);
        }
      })
      .catch((caught) => {
        if (!cancelled) {
          setError(caught instanceof Error ? caught.message : String(caught));
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="w-full max-w-md rounded-[2rem] border border-[var(--panel-border)] bg-[var(--panel)] p-5 shadow-[var(--shadow-soft)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-[var(--foreground)]">
            Select story profile
          </h3>
          <p className="text-xs text-[var(--muted)]">
            Manage separate playthrough variables without mixing runtime saves.
          </p>
        </div>

        {cloningFrom !== null && (
          <button
            type="button"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-[var(--panel-border)] bg-[var(--panel-soft)] text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
            title="Cancel clone"
            onClick={() => setCloningFrom(null)}
          >
            <X className="size-4" />
            <span className="sr-only">Cancel clone</span>
          </button>
        )}
      </div>

      {cloningFrom !== null && (
        <div className="mb-3 rounded-2xl border border-[var(--accent)] bg-[var(--panel-strong)] p-3 text-xs text-[var(--muted)]">
          Choose a target slot to overwrite with Profile Slot {cloningFrom}.
        </div>
      )}

      <div className="space-y-3">
        {slots.map((slot) => {
          const isActive = currentActive === slot.slot_index;
          const isCloneSource = cloningFrom === slot.slot_index;
          const canReceiveClone = cloningFrom !== null && !isCloneSource;
          const isPurging = purgingSlot === slot.slot_index;

          return (
            <div
              key={slot.slot_index}
              className={`relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-2xl border p-4 text-left transition ${
                isActive
                  ? "border-[var(--accent)] bg-[var(--panel-strong)] shadow-[var(--shadow-soft)]"
                  : "border-[var(--panel-border)] bg-[var(--panel-soft)] hover:border-[var(--accent)]"
              } ${
                isPurging ? "min-h-64 border-red-500/40 hover:border-red-500/40" : ""
              }`}
            >
              {isPurging && (
                <DeleteConfirmModal
                  onCancel={() => setPurgingSlot(null)}
                  onConfirm={() => void handleClearSlot(slot.slot_index)}
                  slotIndex={slot.slot_index}
                />
              )}

              <button
                type="button"
                onClick={() =>
                  !isPurging &&
                  (canReceiveClone
                    ? void handleCloneToSlot(slot.slot_index)
                    : void handleSelectSlot(slot.slot_index))
                }
                className="min-w-0 flex-1 text-left"
              >
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wide text-[var(--muted)]">
                    Profile Slot {slot.slot_index}
                  </span>
                  {isActive && (
                    <span className="rounded-full bg-[var(--accent)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[var(--accent-contrast)]">
                      Active
                    </span>
                  )}
                  {isCloneSource && (
                    <span className="rounded-full border border-[var(--accent)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[var(--accent)]">
                      Copying
                    </span>
                  )}
                </span>
                <span className="mt-2 block">
                  <SlotStatusBadge
                    characterName={slot.active_character?.name}
                    hasCharacter={slot.exists && slot.active_character !== null}
                  />
                </span>
                <span className="mt-1 block text-xs text-[var(--muted)]">
                  {slot.exists
                    ? `Turns executed: ${slot.total_turns_played}`
                    : "Empty file profile"}
                </span>
              </button>

              <div className="flex shrink-0 items-center gap-3 text-right">
                <TimestampBadge
                  isSlotEmpty={!slot.exists}
                  rawTimestamp={slot.last_updated}
                />

                {canReceiveClone ? (
                  <button
                    type="button"
                    onClick={() => void handleCloneToSlot(slot.slot_index)}
                    className="rounded-full bg-[var(--accent)] px-3 py-2 text-xs font-bold text-[var(--accent-contrast)] transition hover:brightness-110"
                  >
                    Clone here
                  </button>
                ) : (
                  <div className="flex items-center gap-1">
                    {slot.exists && (
                      <button
                        type="button"
                        className="inline-flex size-9 items-center justify-center rounded-full border border-[var(--panel-border)] bg-[var(--panel)] text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                        title="Copy this save to another slot"
                        onClick={() => setCloningFrom(slot.slot_index)}
                      >
                        <Copy className="size-4" />
                        <span className="sr-only">
                          Copy Profile Slot {slot.slot_index}
                        </span>
                      </button>
                    )}

                    {slot.exists && (
                      <button
                        type="button"
                        className="inline-flex size-9 items-center justify-center rounded-full border border-red-500/20 bg-red-950/10 text-red-300 transition hover:border-red-400 hover:bg-red-950/20"
                        title="Erase this save slot"
                        onClick={() => {
                          setCloningFrom(null);
                          setPurgingSlot(slot.slot_index);
                        }}
                      >
                        <Trash2 className="size-4" />
                        <span className="sr-only">
                          Erase Profile Slot {slot.slot_index}
                        </span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-950/20 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="mt-4 border-t border-[var(--panel-border)] pt-4">
        <LaunchGameButton
          activeSlotIndex={currentActive}
          characterName={
            slots.find((slot) => slot.slot_index === currentActive)
              ?.active_character?.name
          }
          hasCharacterLoaded={Boolean(
            slots.find((slot) => slot.slot_index === currentActive)
              ?.active_character,
          )}
          onLaunchSuccess={onLaunchSuccess}
        />
      </div>
    </section>
  );
}
