export type SystemSyncStatus =
  | "connected"
  | "degraded"
  | "fault"
  | "idle"
  | "syncing";

export interface NodeStatusConfig {
  description: string;
  dotColor: string;
  glowPreset: string;
  label: string;
  textColor: string;
}

export const DIAGNOSTIC_NODE_MATRIX: Record<
  SystemSyncStatus,
  NodeStatusConfig
> = {
  connected: {
    description:
      "Your linked lorebooks are active. The chat can use matching world info when the scene calls for it.",
    dotColor: "bg-emerald-500",
    glowPreset:
      "shadow-emerald-500/40 shadow-lg ring-1 ring-emerald-500/20 animate-pulse [animation-duration:3s]",
    label: "Lorebooks Ready",
    textColor: "text-emerald-500",
  },
  degraded: {
    description:
      "Some lorebook keywords overlap. Chat can continue, but a few entries may compete for attention.",
    dotColor: "bg-amber-500",
    glowPreset: "shadow-amber-500/30 shadow-md",
    label: "Lore Needs Review",
    textColor: "text-amber-500",
  },
  fault: {
    description:
      "A lorebook could not be read correctly. Check the details before relying on it in chat.",
    dotColor: "bg-destructive",
    glowPreset: "shadow-destructive/60 shadow-xl ring-2 ring-destructive/30",
    label: "Lorebook Error",
    textColor: "font-bold text-destructive",
  },
  idle: {
    description:
      "No lorebooks are attached to the active chat.",
    dotColor: "bg-muted-foreground",
    glowPreset: "shadow-transparent",
    label: "No Lorebook Linked",
    textColor: "text-muted-foreground",
  },
  syncing: {
    description:
      "The app is importing or refreshing lorebook files.",
    dotColor: "animate-pulse bg-cyan-500",
    glowPreset: "shadow-cyan-500/20 shadow-md",
    label: "Updating Lorebooks",
    textColor: "text-cyan-500",
  },
};
