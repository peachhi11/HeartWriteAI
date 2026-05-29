"use client";

import { useEffect, useState } from "react";

import {
  applyUserTheme,
  loadUserTheme,
  loadUserThemePreference,
} from "@/lib/ui/runtimeTheme";
import { DIM_COLOR_PRESETS } from "@/types/backdrop";
import { type UserThemeConfig } from "@/types/theme";
import { USER_THEME_EVENT } from "@/types/theme";
import { cn } from "@/lib/utils";

export function RuntimeThemeProvider() {
  const [theme, setTheme] = useState<UserThemeConfig | null>(null);

  useEffect(() => {
    let cancelled = false;
    const localTheme = loadUserTheme();

    applyUserTheme(localTheme);
    void Promise.resolve().then(() => {
      if (!cancelled) {
        setTheme(localTheme);
      }
    });
    void loadUserThemePreference().then((theme) => {
      if (!cancelled) {
        setTheme(theme);
        applyUserTheme(theme);
      }
    });

    function syncThemeFromEvent() {
      const nextTheme = loadUserTheme();
      setTheme(nextTheme);
      applyUserTheme(nextTheme);
    }

    window.addEventListener(USER_THEME_EVENT, syncThemeFromEvent);
    window.addEventListener("storage", syncThemeFromEvent);

    return () => {
      cancelled = true;
      window.removeEventListener(USER_THEME_EVENT, syncThemeFromEvent);
      window.removeEventListener("storage", syncThemeFromEvent);
    };
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none fixed inset-0 z-0 opacity-35 transition-colors duration-1000",
          DIM_COLOR_PRESETS[theme?.legibility.dimColor ?? "zinc"],
        )}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-0 transition-opacity duration-1000 data-[active=true]:opacity-100"
        data-active={theme?.customWallpaper ? "true" : "false"}
        style={{
          backgroundImage: theme?.customWallpaper
            ? `url("${theme.customWallpaper.assetProtocolUrl}")`
            : undefined,
          filter: "brightness(var(--wp-brightness, 30%)) blur(var(--wp-blur, 8px))",
          transform: "scale(1.03)",
          willChange: "filter, opacity",
        }}
      />
    </>
  );
}
