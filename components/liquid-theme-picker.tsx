"use client";

import { Check, Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const STORAGE_KEY = "heartwriteai-liquid-theme";
const THEME_EVENT = "heartwriteai-liquid-theme-change";

const liquidThemes = [
  {
    id: "black-cherry",
    darkLabel: "Black Cherry",
    lightLabel: "Cherry Blossom",
    darkSwatches: ["#080306", "#8B0B28", "#D41F44", "#E79AA2"],
    lightSwatches: ["#FAE4EA", "#E79AA2", "#D41F44", "#8B0B28"],
  },
  {
    id: "amethyst",
    darkLabel: "Orchid",
    lightLabel: "Lilac Lullaby",
    darkSwatches: ["#211522", "#613659", "#A78BBE", "#C197D2"],
    lightSwatches: ["#F7F1FB", "#D3B1C2", "#C197D2", "#A78BBE"],
  },
  {
    id: "sapphire",
    darkLabel: "Midnight Abyss",
    lightLabel: "Glacier Mist",
    darkSwatches: ["#061826", "#1C4E75", "#2FA0C6", "#58C9F3"],
    lightSwatches: ["#DDE4EB", "#C5E2F7", "#A3B9CE", "#6FA5C9"],
  },
  {
    id: "emerald",
    darkLabel: "Oil-slick",
    lightLabel: "Sea Glass",
    darkSwatches: ["#020807", "#052D28", "#00D79F", "#37AAFF"],
    lightSwatches: ["#AEDBB8", "#8FCA97", "#68A877", "#45834D"],
  },
  {
    id: "champagne",
    darkLabel: "Espresso",
    lightLabel: "Gilded Cage",
    darkSwatches: ["#1F1611", "#523828", "#946E4B", "#D4A569"],
    lightSwatches: ["#EFE7DE", "#C3B19B", "#BD956A", "#8E623B"],
  },
] as const;

type LiquidThemeId = (typeof liquidThemes)[number]["id"];
type LiquidTheme = (typeof liquidThemes)[number];

export function LiquidThemePicker() {
  const { theme, setTheme } = useLiquidThemeSelection();
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();
  const activeTheme = liquidThemes.find((item) => item.id === theme) ?? liquidThemes[0];
  const variant = mounted && resolvedTheme === "light" ? "light" : "dark";

  function handleThemeChange(nextTheme: LiquidThemeId) {
    setTheme(nextTheme);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Choose liquid color theme"
          size="icon"
          variant="outline"
        >
          <Palette className="size-4" />
          <span className="sr-only">
            {getThemeLabel(activeTheme, variant)}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {liquidThemes.map((item) => (
          <DropdownMenuItem
            key={item.id}
            onClick={() => handleThemeChange(item.id)}
            className="gap-3"
          >
            <ThemeSwatches theme={item} />
            <span className="flex-1">
              <span className="block text-sm font-medium">
                {getThemeLabel(item, variant)}
              </span>
              <span className="block text-xs text-muted-foreground">
                {item.lightLabel} / {item.darkLabel}
              </span>
            </span>
            {theme === item.id ? <Check className="ml-2 size-3.5" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function LiquidThemePreviewSettings() {
  const { theme, setTheme } = useLiquidThemeSelection();
  const { resolvedTheme, setTheme: setMode } = useTheme();
  const mounted = useMounted();
  const variant = mounted && resolvedTheme === "light" ? "light" : "dark";

  function handleThemeChange(nextTheme: LiquidThemeId) {
    setTheme(nextTheme);
  }

  return (
    <Card className="liquid-glass rounded-[1.75rem]">
      <CardHeader>
        <CardTitle>Theme preview</CardTitle>
        <CardDescription>
          Pick a liquid colorway, then switch light or dark mode to use its paired theme.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={variant === "light" ? "default" : "outline"}
            onClick={() => setMode("light")}
          >
            Light
          </Button>
          <Button
            type="button"
            variant={variant === "dark" ? "default" : "outline"}
            onClick={() => setMode("dark")}
          >
            Dark
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {liquidThemes.map((item) => {
            const active = item.id === theme;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleThemeChange(item.id)}
                className={`liquid-glass flex min-h-32 flex-col items-start justify-between rounded-3xl p-4 text-left transition hover:-translate-y-0.5 ${
                  active ? "ring-2 ring-[color:var(--liquid-accent)]" : ""
                }`}
              >
                <div className="flex w-full items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {variant}
                    </p>
                    <p className="mt-1 text-lg font-semibold">
                      {getThemeLabel(item, variant)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {variant === "light" ? item.darkLabel : item.lightLabel}
                    </p>
                  </div>
                  {active ? <Check className="size-4 text-[color:var(--liquid-accent)]" /> : null}
                </div>
                <div className="mt-4 grid w-full grid-cols-4 gap-2">
                  {(variant === "light" ? item.lightSwatches : item.darkSwatches).map((color) => (
                    <span
                      key={color}
                      className="h-10 rounded-2xl border border-white/25 shadow-inner"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function ThemeSwatches({ theme }: { theme: LiquidTheme }) {
  return (
    <span className="grid h-8 w-10 shrink-0 grid-cols-2 overflow-hidden rounded-xl border border-white/20">
      {[theme.lightSwatches[0], theme.lightSwatches[2], theme.darkSwatches[2], theme.darkSwatches[0]].map((color) => (
        <span key={color} style={{ backgroundColor: color }} />
      ))}
    </span>
  );
}

function useLiquidThemeSelection() {
  const theme = useSyncExternalStore<LiquidThemeId>(
    subscribeToThemeChanges,
    readSavedTheme,
    () => "black-cherry",
  );

  useEffect(() => {
    applyLiquidTheme(theme);
  }, [theme]);

  function setTheme(nextTheme: LiquidThemeId) {
    applyLiquidTheme(nextTheme);
    localStorage.setItem(STORAGE_KEY, nextTheme);
    window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: nextTheme }));
  }

  return { theme, setTheme };
}

function useMounted() {
  return useSyncExternalStore(
    subscribeToMount,
    () => true,
    () => false,
  );
}

function subscribeToThemeChanges(onStoreChange: () => void) {
  window.addEventListener(THEME_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(THEME_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function subscribeToMount(onStoreChange: () => void) {
  queueMicrotask(onStoreChange);

  return () => {};
}

function readSavedTheme(): LiquidThemeId {
  if (typeof window === "undefined") {
    return "black-cherry";
  }

  const savedTheme = localStorage.getItem(STORAGE_KEY);

  return isLiquidThemeId(savedTheme) ? savedTheme : "black-cherry";
}

function applyLiquidTheme(theme: LiquidThemeId) {
  document.documentElement.dataset.liquidTheme = theme;
}

function getThemeLabel(theme: LiquidTheme, variant: "light" | "dark") {
  return variant === "light" ? theme.lightLabel : theme.darkLabel;
}

function isLiquidThemeId(value: unknown): value is LiquidThemeId {
  return liquidThemes.some((item) => item.id === value);
}
