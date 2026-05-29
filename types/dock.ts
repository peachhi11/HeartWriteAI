export type SidePanelType = "Lorebook" | "None" | "Statistics" | "ThemeStudio";

export interface DockingState {
  activePanel: SidePanelType;
  dockPosition: "left" | "right";
  isCollapsed: boolean;
}
