"use client";

import { Check, Palette } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const STORAGE_KEY = "heartwriteai-liquid-theme";

const liquidThemes = [
  {
    id: "black-cherry",
    label: "Black Cherry",
    swatch: "bg-[linear-gradient(135deg,#080306,#e91e78)]",
  },
  {
    id: "amethyst",
    label: "Amethyst",
    swatch: "bg-[linear-gradient(135deg,#10051f,#a855f7)]",
  },
  {
    id: "sapphire",
    label: "Sapphire",
    swatch: "bg-[linear-gradient(135deg,#020617,#38bdf8)]",
  },
  {
    id: "emerald",
    label: "Emerald",
    swatch: "bg-[linear-gradient(135deg,#02130d,#34d399)]",
  },
  {
    id: "champagne",
    label: "Champagne",
    swatch: "bg-[linear-gradient(135deg,#1f1307,#f7d9a8)]",
  },
] as const;

type LiquidThemeId = (typeof liquidThemes)[number]["id"];

export function LiquidThemePicker() {
  const [theme, setTheme] = useState<LiquidThemeId>(() => readSavedTheme());

  useEffect(() => {
    applyLiquidTheme(theme);
  }, [theme]);

  function handleThemeChange(nextTheme: LiquidThemeId) {
    applyLiquidTheme(nextTheme);
    localStorage.setItem(STORAGE_KEY, nextTheme);
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
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {liquidThemes.map((item) => (
          <DropdownMenuItem
            key={item.id}
            onClick={() => handleThemeChange(item.id)}
          >
            <span className={`mr-2 size-3 rounded-full ${item.swatch}`} />
            <span className="flex-1">{item.label}</span>
            {theme === item.id ? <Check className="ml-2 size-3.5" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function readSavedTheme(): LiquidThemeId {
  if (typeof window === "undefined") {
    return "black-cherry";
  }

  const savedTheme = localStorage.getItem(STORAGE_KEY);

  return liquidThemes.some((item) => item.id === savedTheme)
    ? (savedTheme as LiquidThemeId)
    : "black-cherry";
}

function applyLiquidTheme(theme: LiquidThemeId) {
  document.documentElement.dataset.liquidTheme = theme;
}
