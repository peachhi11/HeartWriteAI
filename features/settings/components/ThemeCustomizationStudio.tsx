"use client";

import {
  Check,
  FolderOpen,
  ImageIcon,
  Palette,
  RotateCcw,
  Type,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  DIM_COLOR_PRESETS,
  type DimColor,
  type LegibilityEngineConfig,
} from "@/types/backdrop";
import { type InterfaceOpacityConfig } from "@/types/transparency";
import {
  clampCardOpacity,
  isHexColor,
  loadUserTheme,
  loadUserThemePreference,
  saveUserTheme,
} from "@/lib/ui/runtimeTheme";
import { cn } from "@/lib/utils";
import { pickCustomWallpaperAsset } from "@/lib/tauri/wallpaper";
import {
  BUILTIN_THEMES,
  DEFAULT_USER_THEME,
  type FontPreset,
  type UserThemeConfig,
  type WallpaperPreference,
} from "@/types/theme";

const fontPresets: FontPreset[] = ["serif", "sans", "mono"];
const dimColorOptions: DimColor[] = ["zinc", "rose", "indigo"];

export function ThemeCustomizationStudio() {
  const [currentTheme, setCurrentTheme] =
    useState<UserThemeConfig>(DEFAULT_USER_THEME);
  const [hexDraft, setHexDraft] = useState(DEFAULT_USER_THEME.primaryGlow);
  const [hasHydratedNativeTheme, setHasHydratedNativeTheme] = useState(false);
  const [isPickingWallpaper, setIsPickingWallpaper] = useState(false);
  const [wallpaperError, setWallpaperError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void Promise.resolve().then(() => {
      if (cancelled) {
        return;
      }

      const localTheme = loadUserTheme();
      setCurrentTheme(localTheme);
      setHexDraft(localTheme.primaryGlow);
    });

    void loadUserThemePreference().then((theme) => {
      if (cancelled) {
        return;
      }

      setCurrentTheme(theme);
      setHexDraft(theme.primaryGlow);
      setHasHydratedNativeTheme(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hasHydratedNativeTheme) {
      return;
    }

    void saveUserTheme(currentTheme);
  }, [currentTheme, hasHydratedNativeTheme]);

  const selectedPreset = useMemo(
    () => BUILTIN_THEMES.find((theme) => theme.id === currentTheme.id),
    [currentTheme.id],
  );

  function applyPreset(theme: UserThemeConfig) {
    setHexDraft(theme.primaryGlow);
    setCurrentTheme(theme);
  }

  function updateAccent(value: string) {
    setHexDraft(value);

    if (!isHexColor(value)) {
      return;
    }

    setCurrentTheme((current) => ({
      ...current,
      id: "custom",
      name: "Custom Setup",
      primaryGlow: value,
    }));
  }

  function updateFont(fontFamily: FontPreset) {
    setCurrentTheme((current) => ({
      ...current,
      fontFamily,
      id: "custom",
      name: current.id === "custom" ? current.name : "Custom Setup",
    }));
  }

  function updateCardOpacity(value: number) {
    setCurrentTheme((current) => ({
      ...current,
      cardOpacity: clampCardOpacity(value),
      id: "custom",
      name: current.id === "custom" ? current.name : "Custom Setup",
    }));
  }

  function updateLegibility(patch: Partial<LegibilityEngineConfig>) {
    setCurrentTheme((current) => ({
      ...current,
      id: current.id === "custom" ? current.id : "custom",
      legibility: {
        ...current.legibility,
        ...patch,
      },
      name: current.id === "custom" ? current.name : "Custom Setup",
    }));
  }

  function updateTransparency(patch: Partial<InterfaceOpacityConfig>) {
    setCurrentTheme((current) => ({
      ...current,
      id: current.id === "custom" ? current.id : "custom",
      name: current.id === "custom" ? current.name : "Custom Setup",
      transparency: {
        ...current.transparency,
        ...patch,
      },
    }));
  }

  function previewPresetVignette(theme: UserThemeConfig) {
    setCurrentTheme((current) => ({
      ...current,
      bgVignette: theme.bgVignette,
      id: "custom",
      name: current.id === "custom" ? current.name : "Custom Setup",
    }));
  }

  async function pickWallpaper() {
    setIsPickingWallpaper(true);
    setWallpaperError(null);

    try {
      const wallpaper = await pickCustomWallpaperAsset();
      updateWallpaper(wallpaper);
    } catch (error) {
      setWallpaperError(String(error));
    } finally {
      setIsPickingWallpaper(false);
    }
  }

  function updateWallpaper(customWallpaper: WallpaperPreference | null) {
    setCurrentTheme((current) => ({
      ...current,
      customWallpaper,
      id: current.id === "custom" ? current.id : "custom",
      name: current.id === "custom" ? current.name : "Custom Setup",
    }));
  }

  return (
    <section className="liquid-glass-strong relative grid overflow-hidden rounded-[1.75rem] border p-5 shadow-xl md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.85fr)]">
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-b opacity-45 transition-all duration-1000",
          currentTheme.bgVignette,
          "to-transparent",
        )}
      />

      <div className="relative z-10 grid gap-5 p-1 md:p-2">
        <header className="space-y-2">
          <div className="flex items-center gap-2">
            <Palette className="size-5 text-user-primary" />
            <h2 className="text-sm font-black uppercase tracking-[0.18em] text-user-primary">
              Interface Workspace Designer
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Tune the runtime reading surface with persisted local preferences
            for accent glow, vignette tone, typography, and card opacity.
          </p>
        </header>

        <div className="grid gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            Built-in Presets
          </span>
          <div className="flex flex-wrap gap-2">
            {BUILTIN_THEMES.map((theme) => {
              const active = selectedPreset?.id === theme.id;

              return (
                <button
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition",
                    active
                      ? "border-user-primary bg-background/80 text-foreground shadow-md"
                      : "border-border bg-background/45 text-muted-foreground hover:border-user-primary hover:text-foreground",
                  )}
                  key={theme.id}
                  onClick={() => applyPreset(theme)}
                  type="button"
                >
                  <span
                    className="size-3 rounded-full border border-white/25"
                    style={{ backgroundColor: theme.primaryGlow }}
                  />
                  {theme.name}
                  {active ? <Check className="size-3" /> : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-2">
          <label
            className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground"
            htmlFor="theme-glow"
          >
            Accent Focus Glow Vector
          </label>
          <div className="flex gap-2">
            <input
              className="h-10 w-11 cursor-pointer rounded-xl border border-border bg-background p-1"
              id="theme-glow"
              onChange={(event) => updateAccent(event.currentTarget.value)}
              type="color"
              value={isHexColor(hexDraft) ? hexDraft : currentTheme.primaryGlow}
            />
            <input
              aria-invalid={!isHexColor(hexDraft)}
              className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 font-mono text-sm uppercase text-foreground outline-none transition focus:border-user-primary aria-invalid:border-destructive"
              onChange={(event) => updateAccent(event.currentTarget.value)}
              value={hexDraft}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            <Type className="size-3.5" />
            Typography Schema
          </span>
          <div className="grid grid-cols-3 gap-2">
            {fontPresets.map((fontFamily) => (
              <button
                className={cn(
                  "rounded-xl border px-3 py-2 text-xs font-bold uppercase tracking-wide transition",
                  currentTheme.fontFamily === fontFamily
                    ? "border-user-primary bg-background/80 text-foreground"
                    : "border-border bg-background/40 text-muted-foreground hover:text-foreground",
                )}
                key={fontFamily}
                onClick={() => updateFont(fontFamily)}
                type="button"
              >
                {fontFamily}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            <span>Container Card Opacity</span>
            <span className="font-mono text-user-primary">
              {currentTheme.cardOpacity}%
            </span>
          </div>
          <input
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-user-primary"
            max={90}
            min={10}
            onChange={(event) => updateCardOpacity(Number(event.currentTarget.value))}
            type="range"
            value={currentTheme.cardOpacity}
          />
        </div>

        <div className="grid gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            Background Vignette
          </span>
          <div className="grid grid-cols-2 gap-2">
            {BUILTIN_THEMES.map((theme) => (
              <button
                className={cn(
                  "rounded-xl border bg-gradient-to-b px-3 py-3 text-left text-xs font-bold transition",
                  theme.bgVignette,
                  "to-transparent",
                  currentTheme.bgVignette === theme.bgVignette
                    ? "border-user-primary text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
                key={theme.bgVignette}
                onClick={() => previewPresetVignette(theme)}
                type="button"
              >
                {theme.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 rounded-2xl border border-border bg-background/35 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-2">
              <ImageIcon
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-user-primary"
              />
              <div className="min-w-0">
                <span className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Environment Canvas
                </span>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Pick a local image to render as a subtle desktop backdrop.
                </p>
              </div>
            </div>

            {currentTheme.customWallpaper ? (
              <button
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-destructive transition hover:bg-destructive/15"
                onClick={() => updateWallpaper(null)}
                type="button"
              >
                <RotateCcw className="size-3" />
                Reset
              </button>
            ) : null}
          </div>

          {currentTheme.customWallpaper ? (
            <div className="flex min-w-0 items-center gap-3 rounded-xl border border-border bg-background/70 p-3">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                  src={currentTheme.customWallpaper.assetProtocolUrl}
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Secured in app storage
                </span>
                <p className="truncate font-mono text-xs text-user-primary">
                  {currentTheme.customWallpaper.internalSandboxPath}
                </p>
              </div>
            </div>
          ) : (
            <button
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-background/45 px-4 py-3 text-xs font-bold text-muted-foreground transition hover:border-user-primary hover:text-foreground disabled:cursor-wait disabled:opacity-60"
              disabled={isPickingWallpaper}
              onClick={pickWallpaper}
              type="button"
            >
              <FolderOpen className="size-4" />
              {isPickingWallpaper
                ? "Awaiting file selection..."
                : "Browse local wallpaper image"}
            </button>
          )}

          {wallpaperError ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 font-mono text-[11px] text-destructive">
              {wallpaperError}
            </div>
          ) : null}
        </div>

        <div className="grid gap-4 rounded-2xl border border-border bg-background/35 p-4">
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wide text-user-primary">
              Backdrop Legibility Engine
            </span>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Tune wallpaper light, blur, and tint for comfortable long-form reading.
            </p>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              <span>Ambient Brightness Dimmer</span>
              <span className="font-mono text-user-primary">
                {currentTheme.legibility.brightnessLevel}%
              </span>
            </div>
            <input
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-user-primary"
              max={100}
              min={0}
              onChange={(event) =>
                updateLegibility({
                  brightnessLevel: Number(event.currentTarget.value),
                })
              }
              type="range"
              value={currentTheme.legibility.brightnessLevel}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              <span>Diffusion Blur Radius</span>
              <span className="font-mono text-user-primary">
                {currentTheme.legibility.blurRadius}px
              </span>
            </div>
            <input
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-user-primary"
              max={20}
              min={0}
              onChange={(event) =>
                updateLegibility({ blurRadius: Number(event.currentTarget.value) })
              }
              type="range"
              value={currentTheme.legibility.blurRadius}
            />
          </div>

          <div className="grid gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              Ambient Underlay Tint Profile
            </span>
            <div className="grid grid-cols-3 gap-2">
              {dimColorOptions.map((dimColor) => {
                const active = currentTheme.legibility.dimColor === dimColor;

                return (
                  <button
                    className={cn(
                      "rounded-xl border px-3 py-2 text-[10px] font-bold uppercase tracking-wide transition",
                      active
                        ? "border-user-primary bg-background/80 text-user-primary shadow-md"
                        : "border-border bg-background/40 text-muted-foreground hover:text-foreground",
                    )}
                    key={dimColor}
                    onClick={() => updateLegibility({ dimColor })}
                    type="button"
                  >
                    <span
                      className={cn(
                        "mr-1.5 inline-block size-2 rounded-full",
                        DIM_COLOR_PRESETS[dimColor],
                      )}
                    />
                    {dimColor}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid gap-4 rounded-2xl border border-border bg-background/35 p-4">
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wide text-user-primary">
              Interface Opacity Studio
            </span>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Balance panel density, border visibility, and text glow across the interface.
            </p>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              <span>Dialogue Panel Alpha Density</span>
              <span className="font-mono text-user-primary">
                {currentTheme.transparency.panelOpacity}%
              </span>
            </div>
            <input
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-user-primary"
              max={95}
              min={10}
              onChange={(event) =>
                updateTransparency({
                  panelOpacity: Number(event.currentTarget.value),
                })
              }
              type="range"
              value={currentTheme.transparency.panelOpacity}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              <span>Structural Border Alpha</span>
              <span className="font-mono text-user-primary">
                {currentTheme.transparency.borderOpacity}%
              </span>
            </div>
            <input
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-user-primary"
              max={100}
              min={0}
              onChange={(event) =>
                updateTransparency({
                  borderOpacity: Number(event.currentTarget.value),
                })
              }
              type="range"
              value={currentTheme.transparency.borderOpacity}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              <span>Text Glow Anchor</span>
              <span className="font-mono text-user-primary">
                {currentTheme.transparency.textGlowAlpha}%
              </span>
            </div>
            <input
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-user-primary"
              max={100}
              min={0}
              onChange={(event) =>
                updateTransparency({
                  textGlowAlpha: Number(event.currentTarget.value),
                })
              }
              type="range"
              value={currentTheme.transparency.textGlowAlpha}
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-6 flex flex-col justify-center rounded-2xl border border-border bg-background/45 p-5 shadow-inner md:mt-0">
        <Badge className="mb-4 w-max border-user-primary/30 bg-background/60 text-user-primary" variant="outline">
          Sandbox Viewport Live Preview
        </Badge>

        <div
          className="rounded-xl border p-4 backdrop-blur-md transition-all duration-300"
          style={{
            backgroundColor: "rgb(9 9 11 / var(--ui-panel-opacity))",
            borderColor: "rgb(225 29 72 / var(--ui-border-opacity))",
            boxShadow:
              "0 25px 50px -12px rgb(0 0 0 / calc(var(--ui-glow-alpha) * 2))",
          }}
        >
          <div className="mb-2 flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <span>Character Bubble</span>
            <span className="text-user-primary">Active Hook</span>
          </div>

          <p
            className={cn(
              "text-sm leading-relaxed text-zinc-100",
              currentTheme.fontFamily === "serif" && "font-serif",
              currentTheme.fontFamily === "mono" && "font-mono",
              currentTheme.fontFamily === "sans" && "font-sans",
            )}
          >
            “I [step closer, looking away reluctantly]. If you truly mean what
            you say, don&apos;t move a single muscle.”
          </p>
        </div>
      </div>
    </section>
  );
}
