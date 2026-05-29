"use client";

import {
  DEFAULT_LEGIBILITY_CONFIG,
  type DimColor,
  type LegibilityEngineConfig,
} from "@/types/backdrop";
import {
  INITIAL_TRANSPARENCY_STATE,
  type InterfaceOpacityConfig,
} from "@/types/transparency";
import {
  BUILTIN_THEMES,
  DEFAULT_USER_THEME,
  USER_THEME_EVENT,
  USER_THEME_STORAGE_KEY,
  type FontPreset,
  type UserThemeConfig,
  type WallpaperPreference,
} from "@/types/theme";
import {
  exportUserThemePreferences,
  getBootThemeSettings,
} from "@/lib/tauri/themePreferences";

const HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;
const WALLPAPER_ASSET_PROTOCOL_PATTERN = /^ccv3-asset:\/\/localhost\/.+/;
const FONT_PRESETS = new Set<FontPreset>(["serif", "sans", "mono"]);
const DIM_COLOR_PRESETS = new Set<DimColor>(["zinc", "rose", "indigo"]);
const ALLOWED_VIGNETTES = new Set(BUILTIN_THEMES.map((theme) => theme.bgVignette));

export function applyUserTheme(theme: UserThemeConfig) {
  if (typeof document === "undefined") {
    return;
  }

  const safeTheme = normalizeUserTheme(theme);
  const root = document.documentElement;

  root.dataset.userTheme = safeTheme.id;
  root.dataset.userFont = safeTheme.fontFamily;
  root.dataset.userDimColor = safeTheme.legibility.dimColor;
  root.dataset.userWallpaper = safeTheme.customWallpaper ? "active" : "none";
  root.style.setProperty("--user-glow", safeTheme.primaryGlow);
  root.style.setProperty(
    "--wp-brightness",
    `${safeTheme.legibility.brightnessLevel}%`,
  );
  root.style.setProperty("--wp-blur", `${safeTheme.legibility.blurRadius}px`);
  root.style.setProperty(
    "--ui-panel-opacity",
    (safeTheme.transparency.panelOpacity / 100).toFixed(2),
  );
  root.style.setProperty(
    "--ui-border-opacity",
    (safeTheme.transparency.borderOpacity / 100).toFixed(2),
  );
  root.style.setProperty(
    "--ui-glow-alpha",
    (safeTheme.transparency.textGlowAlpha / 100).toFixed(2),
  );
  root.style.setProperty(
    "--user-wallpaper-image",
    safeTheme.customWallpaper
      ? `url("${safeTheme.customWallpaper.assetProtocolUrl}")`
      : "none",
  );
  root.style.setProperty(
    "--user-card-opacity",
    (safeTheme.cardOpacity / 100).toFixed(2),
  );
}

export async function saveUserTheme(theme: UserThemeConfig) {
  if (typeof window === "undefined") {
    return DEFAULT_USER_THEME;
  }

  const safeTheme = normalizeUserTheme(theme);
  window.localStorage.setItem(USER_THEME_STORAGE_KEY, JSON.stringify(safeTheme));
  applyUserTheme(safeTheme);
  window.dispatchEvent(new CustomEvent(USER_THEME_EVENT, { detail: safeTheme }));

  try {
    const nativeTheme = await exportUserThemePreferences(safeTheme);
    if (nativeTheme) {
      const normalizedNativeTheme = normalizeUserTheme(nativeTheme);
      window.localStorage.setItem(
        USER_THEME_STORAGE_KEY,
        JSON.stringify(normalizedNativeTheme),
      );
      applyUserTheme(normalizedNativeTheme);
      return normalizedNativeTheme;
    }
  } catch (error) {
    console.warn("Native theme preference persistence failed:", error);
  }

  return safeTheme;
}

export function loadUserTheme() {
  if (typeof window === "undefined") {
    return DEFAULT_USER_THEME;
  }

  try {
    return normalizeUserTheme(
      JSON.parse(window.localStorage.getItem(USER_THEME_STORAGE_KEY) ?? "null"),
    );
  } catch {
    return DEFAULT_USER_THEME;
  }
}

export async function loadUserThemePreference() {
  if (typeof window === "undefined") {
    return DEFAULT_USER_THEME;
  }

  try {
    const nativeTheme = await getBootThemeSettings();
    if (nativeTheme) {
      const safeTheme = normalizeUserTheme(nativeTheme);
      window.localStorage.setItem(USER_THEME_STORAGE_KEY, JSON.stringify(safeTheme));
      applyUserTheme(safeTheme);
      return safeTheme;
    }
  } catch (error) {
    console.warn("Native theme preference hydration failed:", error);
  }

  const fallbackTheme = loadUserTheme();
  applyUserTheme(fallbackTheme);
  return fallbackTheme;
}

export function normalizeUserTheme(value: unknown): UserThemeConfig {
  if (!value || typeof value !== "object") {
    return DEFAULT_USER_THEME;
  }

  const candidate = value as Partial<UserThemeConfig>;
  const fallback = BUILTIN_THEMES.find((theme) => theme.id === candidate.id);
  const primaryGlow = isHexColor(candidate.primaryGlow)
    ? candidate.primaryGlow
    : fallback?.primaryGlow ?? DEFAULT_USER_THEME.primaryGlow;
  const bgVignette =
    typeof candidate.bgVignette === "string" &&
    ALLOWED_VIGNETTES.has(candidate.bgVignette)
      ? candidate.bgVignette
      : fallback?.bgVignette ?? DEFAULT_USER_THEME.bgVignette;
  const fontFamily =
    candidate.fontFamily && FONT_PRESETS.has(candidate.fontFamily)
      ? candidate.fontFamily
      : fallback?.fontFamily ?? DEFAULT_USER_THEME.fontFamily;

  return {
    bgVignette,
    cardOpacity: clampCardOpacity(candidate.cardOpacity),
    customWallpaper: normalizeWallpaperPreference(candidate.customWallpaper),
    fontFamily,
    id: typeof candidate.id === "string" ? candidate.id : DEFAULT_USER_THEME.id,
    legibility: normalizeLegibilityConfig(candidate.legibility),
    name:
      typeof candidate.name === "string" && candidate.name.trim()
        ? candidate.name.trim().slice(0, 48)
        : fallback?.name ?? DEFAULT_USER_THEME.name,
    primaryGlow,
    sidebarWidth: clampSidebarWidth(candidate.sidebarWidth),
    transparency: normalizeTransparencyConfig(candidate.transparency),
  };
}

export function normalizeTransparencyConfig(
  value: unknown,
): InterfaceOpacityConfig {
  if (!value || typeof value !== "object") {
    return INITIAL_TRANSPARENCY_STATE;
  }

  const candidate = value as Partial<InterfaceOpacityConfig>;

  return {
    borderOpacity: clampNumber(
      candidate.borderOpacity,
      0,
      100,
      INITIAL_TRANSPARENCY_STATE.borderOpacity,
    ),
    panelOpacity: clampNumber(
      candidate.panelOpacity,
      10,
      95,
      INITIAL_TRANSPARENCY_STATE.panelOpacity,
    ),
    textGlowAlpha: clampNumber(
      candidate.textGlowAlpha,
      0,
      100,
      INITIAL_TRANSPARENCY_STATE.textGlowAlpha,
    ),
  };
}

export function normalizeLegibilityConfig(
  value: unknown,
): LegibilityEngineConfig {
  if (!value || typeof value !== "object") {
    return DEFAULT_LEGIBILITY_CONFIG;
  }

  const candidate = value as Partial<LegibilityEngineConfig>;
  const dimColor =
    candidate.dimColor && DIM_COLOR_PRESETS.has(candidate.dimColor)
      ? candidate.dimColor
      : DEFAULT_LEGIBILITY_CONFIG.dimColor;

  return {
    blurRadius: clampNumber(
      candidate.blurRadius,
      0,
      20,
      DEFAULT_LEGIBILITY_CONFIG.blurRadius,
    ),
    brightnessLevel: clampNumber(
      candidate.brightnessLevel,
      0,
      100,
      DEFAULT_LEGIBILITY_CONFIG.brightnessLevel,
    ),
    dimColor,
  };
}

export function normalizeWallpaperPreference(
  value: unknown,
): WallpaperPreference | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<WallpaperPreference>;
  const internalSandboxPath =
    typeof candidate.internalSandboxPath === "string"
      ? candidate.internalSandboxPath
      : candidate.rawAbsolutePath;

  if (
    typeof internalSandboxPath !== "string" ||
    !internalSandboxPath.trim() ||
    typeof candidate.assetProtocolUrl !== "string" ||
    !WALLPAPER_ASSET_PROTOCOL_PATTERN.test(candidate.assetProtocolUrl)
  ) {
    return null;
  }

  return {
    assetProtocolUrl: candidate.assetProtocolUrl,
    internalSandboxPath,
  };
}

export function isHexColor(value: unknown): value is string {
  return typeof value === "string" && HEX_COLOR_PATTERN.test(value);
}

export function clampCardOpacity(value: unknown) {
  return clampNumber(value, 10, 90, DEFAULT_USER_THEME.cardOpacity);
}

export function clampSidebarWidth(value: unknown) {
  return clampNumber(value, 240, 480, DEFAULT_USER_THEME.sidebarWidth);
}

function clampNumber(value: unknown, min: number, max: number, fallback: number) {
  const numeric = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(numeric)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, Math.round(numeric)));
}
