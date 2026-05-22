"use client";

import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { ImageIcon, Loader2, Plus, Trash2 } from "lucide-react";
import { MouseEvent, useCallback, useEffect, useState } from "react";

import { isTauriRuntime } from "@/lib/tauri/native";
import { ExpressionSprite } from "@/types/character-card/ExpressionSprite";

export interface ExpressionManagerProps {
  activeCardPath: string | null;
  onExpressionSelected: (sprite: ExpressionSprite) => void;
}

export default function ExpressionManager({
  activeCardPath,
  onExpressionSelected,
}: ExpressionManagerProps) {
  const [sprites, setSprites] = useState<ExpressionSprite[]>([]);
  const [activeSpritePath, setActiveSpritePath] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isDesktopRuntime = isTauriRuntime();

  const reloadSpritesFromBackend = useCallback(async function reloadSpritesFromBackend() {
    if (!activeCardPath || !isDesktopRuntime) {
      setSprites([]);
      setActiveSpritePath(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const discoveredSprites = await invoke<ExpressionSprite[]>(
        "scan_character_expressions",
        {
          cardFilePath: activeCardPath,
        },
      );
      setSprites(discoveredSprites);
    } catch (caughtError) {
      const message = String(caughtError);
      console.error("Failed gathering system sprite folder parameters: ", caughtError);
      setError(message);
      setSprites([]);
    } finally {
      setLoading(false);
    }
  }, [activeCardPath, isDesktopRuntime]);

  useEffect(() => {
    if (!activeCardPath || !isDesktopRuntime) {
      queueMicrotask(() => {
        setSprites([]);
        setActiveSpritePath(null);
        setError(null);
      });
      return;
    }

    let isCancelled = false;

    queueMicrotask(() => {
      if (!isCancelled) {
        void reloadSpritesFromBackend();
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [activeCardPath, isDesktopRuntime, reloadSpritesFromBackend]);

  async function handleAttachNewSprite() {
    if (!activeCardPath || !isDesktopRuntime) {
      return;
    }

    const selectedSourcePath = await open({
      multiple: false,
      title: "Select Expression Sprite Asset Artwork",
      filters: [
        {
          name: "Image Assets",
          extensions: ["png", "webp", "jpg", "jpeg", "avif"],
        },
      ],
    });

    if (!selectedSourcePath || typeof selectedSourcePath !== "string") {
      return;
    }

    try {
      const attachedSprite = await invoke<ExpressionSprite>("attach_expression_sprite", {
        cardFilePath: activeCardPath,
        sourceImagePath: selectedSourcePath,
      });
      setActiveSpritePath(attachedSprite.raw_path);
      onExpressionSelected(attachedSprite);
      await reloadSpritesFromBackend();
    } catch (caughtError) {
      const message = String(caughtError);
      console.error("Failed staging expression sprite:", caughtError);
      setError(message);
    }
  }

  async function handleRemoveSpriteClick(
    event: MouseEvent<HTMLButtonElement>,
    sprite: ExpressionSprite,
  ) {
    event.stopPropagation();

    try {
      await invoke("remove_expression_sprite", {
        targetSpriteRawPath: sprite.raw_path,
      });
      if (activeSpritePath === sprite.raw_path) {
        setActiveSpritePath(null);
      }
      await reloadSpritesFromBackend();
    } catch (caughtError) {
      const message = String(caughtError);
      console.error("Failed removing expression sprite:", caughtError);
      setError(message);
    }
  }

  if (!activeCardPath || !isDesktopRuntime) {
    return null;
  }

  return (
    <section className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900/30 p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
            <ImageIcon className="size-4" />
            CCV3 Expression Matrix
          </h2>
          <p className="text-[11px] text-zinc-500">
            Alternate situational emotion sprites synced from local assets.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAttachNewSprite}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
          title="Add expression sprite"
        >
          <Plus className="size-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Loader2 className="size-4 animate-spin" />
          Mapping directory buffers...
        </div>
      ) : null}

      {error && !loading ? (
        <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-4 text-xs text-rose-300">
          {error}
        </div>
      ) : null}

      {!loading && !error && sprites.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-800 p-4 text-center text-xs text-zinc-600">
          No alternate expressions located inside standard{" "}
          <code className="rounded bg-zinc-950 px-1 py-0.5 text-[10px] text-zinc-500">
            _assets/sprites/
          </code>{" "}
          structure path.
        </div>
      ) : null}

      {!loading && !error && sprites.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {sprites.map((sprite) => {
            const isSelected = activeSpritePath === sprite.raw_path;

            return (
              <div
                key={sprite.raw_path}
                role="button"
                tabIndex={0}
                onClick={() => {
                  setActiveSpritePath(sprite.raw_path);
                  onExpressionSelected(sprite);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActiveSpritePath(sprite.raw_path);
                    onExpressionSelected(sprite);
                  }
                }}
                className={`group relative flex flex-col items-center gap-2 rounded-lg border bg-zinc-950 p-2.5 text-center transition focus:outline-none ${
                  isSelected
                    ? "border-violet-500 bg-violet-500/5 ring-2 ring-violet-500/20"
                    : "border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <button
                  type="button"
                  onClick={(event) => void handleRemoveSpriteClick(event, sprite)}
                  className="absolute right-1.5 top-1.5 z-10 flex size-7 items-center justify-center rounded border border-zinc-800 bg-zinc-950/80 text-zinc-500 opacity-0 transition hover:border-rose-500/20 hover:bg-rose-500/10 hover:text-rose-400 group-hover:opacity-100"
                  title="Remove sprite file"
                >
                  <Trash2 className="size-3.5" />
                </button>
                <div className="relative flex h-20 w-full items-center justify-center overflow-hidden rounded-lg bg-zinc-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sprite.local_uri}
                    alt={sprite.name}
                    className="h-full w-auto object-contain transition duration-200 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <span className="w-full truncate text-[10px] font-medium text-zinc-400 transition group-hover:text-zinc-200">
                  {sprite.name.replace(/\.[^/.]+$/, "")}
                </span>
              </div>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
