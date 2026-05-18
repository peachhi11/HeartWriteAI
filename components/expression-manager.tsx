"use client";

import { useEffect, useState } from "react";
import { ImageIcon, Loader2 } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";

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

  useEffect(() => {
    if (!activeCardPath) {
      queueMicrotask(() => {
        setSprites([]);
        setActiveSpritePath(null);
        setError(null);
      });
      return;
    }

    let isCancelled = false;

    async function loadAlternateSprites() {
      setLoading(true);
      setError(null);

      try {
        const discoveredSprites = await invoke<ExpressionSprite[]>(
          "scan_character_expressions",
          {
            cardFilePath: activeCardPath,
          },
        );

        if (!isCancelled) {
          setSprites(discoveredSprites);
        }
      } catch (caughtError) {
        if (!isCancelled) {
          const message = String(caughtError);
          console.error("Failed gathering system sprite folder parameters: ", caughtError);
          setError(message);
          setSprites([]);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    queueMicrotask(() => {
      void loadAlternateSprites();
    });

    return () => {
      isCancelled = true;
    };
  }, [activeCardPath]);

  if (!activeCardPath) {
    return null;
  }

  return (
    <section className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900/30 p-5">
      <div className="space-y-1">
        <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
          <ImageIcon className="size-4" />
          CCV3 Expression Matrix
        </h2>
        <p className="text-[11px] text-zinc-500">
          Alternate situational emotion sprites synced from local assets.
        </p>
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
              <button
                key={sprite.raw_path}
                type="button"
                onClick={() => {
                  setActiveSpritePath(sprite.raw_path);
                  onExpressionSelected(sprite);
                }}
                className={`group relative flex flex-col items-center gap-2 rounded-lg border bg-zinc-950 p-2.5 text-center transition focus:outline-none ${
                  isSelected
                    ? "border-violet-500 bg-violet-500/5 ring-2 ring-violet-500/20"
                    : "border-zinc-800 hover:border-zinc-700"
                }`}
              >
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
              </button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
