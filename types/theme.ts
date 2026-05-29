import {
  DEFAULT_LEGIBILITY_CONFIG,
  type LegibilityEngineConfig,
} from "./backdrop";
import {
  INITIAL_TRANSPARENCY_STATE,
  type InterfaceOpacityConfig,
} from "./transparency";

export type FontPreset = "serif" | "sans" | "mono";

export interface WallpaperPreference {
  assetProtocolUrl: string;
  internalSandboxPath: string;
  rawAbsolutePath?: string;
}

export interface UserThemeConfig {
  bgVignette: string;
  cardOpacity: number;
  customWallpaper?: WallpaperPreference | null;
  fontFamily: FontPreset;
  id: string;
  legibility: LegibilityEngineConfig;
  name: string;
  primaryGlow: string;
  transparency: InterfaceOpacityConfig;
}

export const BUILTIN_THEMES: UserThemeConfig[] = [
  {
    bgVignette: "from-rose-950/40 via-transparent",
    cardOpacity: 40,
    customWallpaper: null,
    fontFamily: "serif",
    id: "dark-romance",
    legibility: DEFAULT_LEGIBILITY_CONFIG,
    name: "Crimson Velvet",
    primaryGlow: "#e11d48",
    transparency: INITIAL_TRANSPARENCY_STATE,
  },
  {
    bgVignette: "from-cyan-950/40 via-transparent",
    cardOpacity: 25,
    customWallpaper: null,
    fontFamily: "mono",
    id: "neon-cyber",
    legibility: DEFAULT_LEGIBILITY_CONFIG,
    name: "Cyber Quartz",
    primaryGlow: "#06b6d4",
    transparency: INITIAL_TRANSPARENCY_STATE,
  },
  {
    bgVignette: "from-amber-950/30 via-transparent",
    cardOpacity: 50,
    customWallpaper: null,
    fontFamily: "serif",
    id: "cozy-latte",
    legibility: DEFAULT_LEGIBILITY_CONFIG,
    name: "Sepia Vintage",
    primaryGlow: "#d97706",
    transparency: INITIAL_TRANSPARENCY_STATE,
  },
  {
    bgVignette: "from-zinc-900/60 via-transparent",
    cardOpacity: 15,
    customWallpaper: null,
    fontFamily: "sans",
    id: "clean-slate",
    legibility: DEFAULT_LEGIBILITY_CONFIG,
    name: "Terminal Zinc",
    primaryGlow: "#71717a",
    transparency: INITIAL_TRANSPARENCY_STATE,
  },
] as const satisfies UserThemeConfig[];

export const DEFAULT_USER_THEME = BUILTIN_THEMES[0];

export const USER_THEME_STORAGE_KEY = "heartwriteai:user-theme-preference";
export const USER_THEME_EVENT = "heartwriteai:user-theme-change";
