"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CloudUpload,
  Eye,
  Gauge,
  BrainCircuit,
  LibraryBig,
  Network,
  Settings2,
  SlidersHorizontal,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import { AppUpdateChecker } from "@/components/app-update-checker";
import { CameraSnapperButton } from "@/components/camera-snapper-button";
import { CloudSyncControlCard } from "@/components/cloud-sync-control-card";
import { InferenceSettingsCard } from "@/components/inference-settings-card";
import { LorebookControlPanel } from "@/components/lorebook-control-panel";
import { RelationshipTreeGraph } from "@/components/relationship-tree-graph";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  clampCardOpacity,
  clampSidebarWidth,
  loadUserTheme,
  loadUserThemePreference,
  saveUserTheme,
} from "@/lib/ui/runtimeTheme";
import { cn } from "@/lib/utils";
import { DEFAULT_LEGIBILITY_CONFIG, type DimColor } from "@/types/backdrop";
import type { RomanceTropeClass } from "@/types/character-card/RomanceTropeClassification";
import { DEFAULT_USER_THEME, type UserThemeConfig } from "@/types/theme";
import { INITIAL_TRANSPARENCY_STATE } from "@/types/transparency";
import type { UnifiedWorkspaceConfig, WorkspaceTab } from "@/types/workspace";

const baselineWorkspaceConfig: UnifiedWorkspaceConfig = {
  blurRadius: DEFAULT_LEGIBILITY_CONFIG.blurRadius,
  borderOpacity: INITIAL_TRANSPARENCY_STATE.borderOpacity,
  brightnessLevel: DEFAULT_LEGIBILITY_CONFIG.brightnessLevel,
  charm: 40,
  dimColor: DEFAULT_LEGIBILITY_CONFIG.dimColor,
  name: "Protagonist",
  panelOpacity: INITIAL_TRANSPARENCY_STATE.panelOpacity,
  primaryBias: "bantering",
  secondaryBias: "flustered",
  sidebarWidth: DEFAULT_USER_THEME.sidebarWidth,
  textGlowAlpha: INITIAL_TRANSPARENCY_STATE.textGlowAlpha,
  vulnerability: 30,
  willpower: 50,
};

const workspaceTabs: {
  icon: LucideIcon;
  id: WorkspaceTab;
  label: string;
  sublabel: string;
}[] = [
  {
    icon: UserRound,
    id: "personality",
    label: "Persona",
    sublabel: "Traits and tone",
  },
  {
    icon: Eye,
    id: "legibility",
    label: "Visuals",
    sublabel: "Light and opacity",
  },
  {
    icon: LibraryBig,
    id: "lorebook",
    label: "Lorebooks",
    sublabel: "World info",
  },
  {
    icon: Network,
    id: "relationships",
    label: "Bonds",
    sublabel: "Cast map",
  },
  {
    icon: BrainCircuit,
    id: "inference",
    label: "AI Replies",
    sublabel: "Style and length",
  },
  {
    icon: CloudUpload,
    id: "backup",
    label: "Backup",
    sublabel: "Cloud backup",
  },
];

const biasOptions: RomanceTropeClass[] = [
  "bantering",
  "flustered",
  "protective",
  "yearning",
  "antagonistic",
  "recognized",
];

const dimColorOptions: DimColor[] = ["zinc", "rose", "indigo"];

export function GlobalSetupCanvas() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("personality");
  const [currentTheme, setCurrentTheme] = useState<UserThemeConfig>(DEFAULT_USER_THEME);
  const [workspaceConfig, setWorkspaceConfig] =
    useState<UnifiedWorkspaceConfig>(baselineWorkspaceConfig);
  const [hasHydratedNativeTheme, setHasHydratedNativeTheme] = useState(false);
  const visualSummary = useMemo(
    () => [
      `${workspaceConfig.brightnessLevel}% bright`,
      `${workspaceConfig.blurRadius}px blur`,
      `${workspaceConfig.panelOpacity}% panel`,
      `${workspaceConfig.sidebarWidth}px side panel`,
    ],
    [
      workspaceConfig.blurRadius,
      workspaceConfig.brightnessLevel,
      workspaceConfig.panelOpacity,
      workspaceConfig.sidebarWidth,
    ],
  );

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) {
        return;
      }

      const localTheme = loadUserTheme();
      setCurrentTheme(localTheme);
      setWorkspaceConfig((current) => themeToWorkspaceConfig(localTheme, current));
    });

    void loadUserThemePreference().then((theme) => {
      if (cancelled) {
        return;
      }

      setCurrentTheme(theme);
      setWorkspaceConfig((current) => themeToWorkspaceConfig(theme, current));
      setHasHydratedNativeTheme(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  function updateWorkspaceField<Key extends keyof UnifiedWorkspaceConfig>(
    key: Key,
    value: UnifiedWorkspaceConfig[Key],
  ) {
    setWorkspaceConfig((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function updateThemeFromWorkspace(patch: Partial<UnifiedWorkspaceConfig>) {
    setWorkspaceConfig((current) => ({
      ...current,
      ...patch,
    }));

    const nextTheme = workspacePatchToTheme(currentTheme, patch);
    setCurrentTheme(nextTheme);

    if (hasHydratedNativeTheme) {
      void saveUserTheme(nextTheme).then((savedTheme) => {
        setCurrentTheme(savedTheme);
        setWorkspaceConfig((current) => themeToWorkspaceConfig(savedTheme, current));
      });
    }
  }

  return (
    <section className="liquid-glass-strong relative z-30 flex min-h-[34rem] w-full flex-col gap-5 overflow-hidden rounded-[1.75rem] border p-4 shadow-2xl md:min-h-[36rem] md:flex-row md:p-5">
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-b opacity-35 transition-all duration-1000",
          currentTheme.bgVignette,
          "to-transparent",
        )}
      />

      <aside className="relative z-10 flex shrink-0 flex-col gap-3 border-b border-border/70 pb-4 md:w-52 md:border-b-0 md:border-r md:pb-0 md:pr-4">
        <div className="hidden space-y-1 md:block">
          <div className="flex items-center gap-2">
            <Settings2 className="size-4 text-user-primary" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.22em] text-user-primary">
              Settings
            </h2>
          </div>
          <p className="text-[10px] text-muted-foreground">Tune your play space</p>
        </div>

        <nav className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-1">
          {workspaceTabs.map((tab) => {
            const Icon = tab.icon;
            const selected = activeTab === tab.id;

            return (
              <button
                className={cn(
                  "flex min-w-0 items-center gap-2 rounded-xl border px-3 py-2 text-left transition",
                  selected
                    ? "border-user-primary/45 bg-user-primary/10 text-foreground shadow-md"
                    : "border-transparent bg-background/30 text-muted-foreground hover:border-border hover:bg-background/55 hover:text-foreground",
                )}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                type="button"
              >
                <Icon className="size-4 shrink-0" />
                <span className="min-w-0">
                  <span className="block truncate text-[10px] font-black uppercase tracking-wide">
                    {tab.label}
                  </span>
                  <span className="hidden truncate text-[9px] text-muted-foreground md:block">
                    {tab.sublabel}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto hidden gap-3 border-t border-border/60 pt-4 md:grid">
          <div className="grid gap-1.5">
            {visualSummary.map((item) => (
              <Badge
                className="w-max max-w-full truncate bg-background/55 font-mono text-[9px]"
                key={item}
                variant="outline"
              >
                {item}
              </Badge>
            ))}
          </div>
          <CameraSnapperButton />
        </div>
      </aside>

      <div className="relative z-10 min-h-0 flex-1 overflow-y-auto pr-1">
        {activeTab === "personality" ? (
          <PersonalityWorkspace
            config={workspaceConfig}
            onUpdate={updateWorkspaceField}
          />
        ) : null}

        {activeTab === "legibility" ? (
          <LegibilityWorkspace
            config={workspaceConfig}
            onUpdate={updateThemeFromWorkspace}
          />
        ) : null}

        {activeTab === "lorebook" ? (
          <LorebookWorkspace />
        ) : null}

        {activeTab === "relationships" ? (
          <RelationshipWorkspace playerName={workspaceConfig.name} />
        ) : null}

        {activeTab === "inference" ? (
          <InferenceWorkspace />
        ) : null}

        {activeTab === "backup" ? (
          <BackupWorkspace />
        ) : null}
      </div>
    </section>
  );
}

function PersonalityWorkspace({
  config,
  onUpdate,
}: {
  config: UnifiedWorkspaceConfig;
  onUpdate: <Key extends keyof UnifiedWorkspaceConfig>(
    key: Key,
    value: UnifiedWorkspaceConfig[Key],
  ) => void;
}) {
  return (
    <div className="grid gap-5 animate-fade-in">
      <PanelHeader
        icon={UserRound}
        title="Player Persona"
        description="Shape the {{user}} point of view without jumping between pages."
      />

      <label className="grid gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
          Persona Name
        </span>
        <input
          className="h-11 rounded-xl border border-border/70 bg-background/75 px-3 text-sm text-foreground outline-none transition focus:border-user-primary/60"
          onChange={(event) => onUpdate("name", event.currentTarget.value)}
          value={config.name}
        />
      </label>

      <div className="grid gap-3 md:grid-cols-2">
        <BiasSelector
          label="Main Romance Energy"
          onChange={(value) => onUpdate("primaryBias", value)}
          value={config.primaryBias}
        />
        <BiasSelector
          label="Secondary Romance Energy"
          onChange={(value) => onUpdate("secondaryBias", value)}
          value={config.secondaryBias}
        />
      </div>

      <div className="grid gap-4">
        <SliderControl
          accentClass="accent-rose-600"
          label="Charm"
          max={100}
          min={0}
          onChange={(value) => onUpdate("charm", value)}
          suffix=""
          value={config.charm}
        />
        <SliderControl
          accentClass="accent-amber-600"
          label="Willpower"
          max={100}
          min={0}
          onChange={(value) => onUpdate("willpower", value)}
          suffix=""
          value={config.willpower}
        />
        <SliderControl
          accentClass="accent-sky-600"
          label="Vulnerability"
          max={100}
          min={0}
          onChange={(value) => onUpdate("vulnerability", value)}
          suffix=""
          value={config.vulnerability}
        />
      </div>
    </div>
  );
}

function LegibilityWorkspace({
  config,
  onUpdate,
}: {
  config: UnifiedWorkspaceConfig;
  onUpdate: (patch: Partial<UnifiedWorkspaceConfig>) => void;
}) {
  return (
    <div className="grid gap-5 animate-fade-in">
      <PanelHeader
        icon={SlidersHorizontal}
        title="Reading Comfort"
        description="Adjust brightness, blur, transparency, and panel size while the chat preview updates live."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <SliderControl
          accentClass="accent-rose-600"
          label="Background Brightness"
          max={100}
          min={0}
          onChange={(value) => onUpdate({ brightnessLevel: value })}
          suffix="%"
          value={config.brightnessLevel}
        />
        <SliderControl
          accentClass="accent-rose-600"
          label="Background Blur"
          max={20}
          min={0}
          onChange={(value) => onUpdate({ blurRadius: value })}
          suffix="px"
          value={config.blurRadius}
        />
        <SliderControl
          accentClass="accent-rose-600"
          label="Chat Panel Opacity"
          max={95}
          min={10}
          onChange={(value) => onUpdate({ panelOpacity: value })}
          suffix="%"
          value={config.panelOpacity}
        />
        <SliderControl
          accentClass="accent-rose-600"
          label="Border Visibility"
          max={100}
          min={0}
          onChange={(value) => onUpdate({ borderOpacity: value })}
          suffix="%"
          value={config.borderOpacity}
        />
        <SliderControl
          accentClass="accent-rose-600"
          label="Text Glow"
          max={100}
          min={0}
          onChange={(value) => onUpdate({ textGlowAlpha: value })}
          suffix="%"
          value={config.textGlowAlpha}
        />
        <SliderControl
          accentClass="accent-rose-600"
          label="Side Panel Width"
          max={480}
          min={240}
          onChange={(value) => onUpdate({ sidebarWidth: value })}
          suffix="px"
          value={config.sidebarWidth}
        />
      </div>

      <div className="grid gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
          Background Tint
        </span>
        <div className="grid grid-cols-3 gap-2">
          {dimColorOptions.map((dimColor) => (
            <Button
              className="justify-start"
              key={dimColor}
              onClick={() => onUpdate({ dimColor })}
              type="button"
              variant={config.dimColor === dimColor ? "secondary" : "outline"}
            >
              <span
                className={cn(
                  "size-2 rounded-full",
                  dimColor === "indigo" && "bg-indigo-500",
                  dimColor === "rose" && "bg-rose-500",
                  dimColor === "zinc" && "bg-zinc-500",
                )}
              />
              {dimColor}
            </Button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border/70 bg-background/45 p-3 text-xs leading-relaxed text-muted-foreground">
        Headings use Aboreto. Body text, dialogue, and controls use Figtree.
      </div>
    </div>
  );
}

function LorebookWorkspace() {
  return (
    <div className="grid min-h-[29rem] gap-5 animate-fade-in md:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="grid content-start gap-4">
        <PanelHeader
          icon={LibraryBig}
          title="Lorebook Links"
          description="Link, mute, refresh, or remove lorebooks without opening the character editor."
        />
        <div className="rounded-2xl border border-border/70 bg-background/55 p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Gauge className="size-4 text-user-primary" />
            Linked World Info
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Lorebooks stay as separate files. Character and persona screens can
            attach them when needed, which keeps long world details out of the
            card form and closer to the SillyTavern and Chub-style workflow.
          </p>
        </div>
        <div className="md:hidden">
          <CameraSnapperButton />
        </div>
      </div>

      <div className="min-h-0">
        <LorebookControlPanel
          isOpen
          onClose={() => {}}
          variant="dock"
        />
      </div>
    </div>
  );
}

function InferenceWorkspace() {
  return (
    <div className="grid gap-5 animate-fade-in md:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="grid content-start gap-4">
        <PanelHeader
          icon={BrainCircuit}
          title="AI Reply Style"
          description="Tune local model settings for steadier prose, longer replies, or more playful roleplay."
        />
        <div className="rounded-2xl border border-border/70 bg-background/55 p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Gauge className="size-4 text-user-primary" />
            Local AI Settings
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            These settings are saved on your device and used by the desktop app
            when it writes character replies. Browser preview keeps a simpler
            fallback for quick testing.
          </p>
        </div>
      </div>

      <InferenceSettingsCard />
    </div>
  );
}

function RelationshipWorkspace({ playerName }: { playerName: string }) {
  return (
    <div className="grid gap-5 animate-fade-in md:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="grid content-start gap-4">
        <PanelHeader
          icon={Network}
          title="Relationship Map"
          description="See who is warming up, pulling away, or creating tension around your current persona."
        />
        <div className="rounded-2xl border border-border/70 bg-background/55 p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Gauge className="size-4 text-user-primary" />
            Cast Chemistry
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Each connection shows the character&apos;s current romance energy,
            relationship label, and bond strength. This stays compact enough to
            live beside chat without turning the story screen into a stats page.
          </p>
        </div>
      </div>

      <RelationshipTreeGraph playerName={playerName || "Protagonist"} />
    </div>
  );
}

function BackupWorkspace() {
  return (
    <div className="grid gap-5 animate-fade-in md:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="grid content-start gap-4">
        <PanelHeader
          icon={CloudUpload}
          title="Story Backup"
          description="Back up your active story slot to a private backup service so you can restore it on another machine."
        />
        <div className="rounded-2xl border border-border/70 bg-background/55 p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Gauge className="size-4 text-user-primary" />
            What Gets Backed Up
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            HeartWriteAI packages your active playthrough, including relationship
            progress, unlocked milestones, character details, and saved chat lines.
            Your backup key is only sent to the backup link you enter.
          </p>
        </div>
        <AppUpdateChecker />
      </div>

      <CloudSyncControlCard />
    </div>
  );
}

function PanelHeader({
  description,
  icon: Icon,
  title,
}: {
  description: string;
  icon: LucideIcon;
  title: string;
}) {
  return (
    <header className="border-b border-border/70 pb-3">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-user-primary" />
        <h3 className="text-xs font-black uppercase tracking-[0.18em] text-foreground">
          {title}
        </h3>
      </div>
      <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </header>
  );
}

function BiasSelector({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: RomanceTropeClass) => void;
  value: RomanceTropeClass;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <select
        className="h-11 rounded-xl border border-border/70 bg-background/75 px-3 text-sm text-foreground outline-none transition focus:border-user-primary/60"
        onChange={(event) => onChange(event.currentTarget.value as RomanceTropeClass)}
        value={value}
      >
        {biasOptions.map((option) => (
          <option key={option} value={option}>
            {formatBiasLabel(option)}
          </option>
        ))}
      </select>
    </label>
  );
}

function SliderControl({
  accentClass,
  label,
  max,
  min,
  onChange,
  suffix,
  value,
}: {
  accentClass: string;
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  suffix: string;
  value: number;
}) {
  return (
    <label className="grid gap-2">
      <span className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
        <span>{label}</span>
        <span className="font-mono text-foreground">
          {value}
          {suffix}
        </span>
      </span>
      <input
        className={cn(
          "h-1 w-full cursor-pointer appearance-none rounded-lg bg-muted",
          accentClass,
        )}
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
        type="range"
        value={value}
      />
    </label>
  );
}

function themeToWorkspaceConfig(
  theme: UserThemeConfig,
  current: UnifiedWorkspaceConfig,
): UnifiedWorkspaceConfig {
  return {
    ...current,
    blurRadius: theme.legibility.blurRadius,
    borderOpacity: theme.transparency.borderOpacity,
    brightnessLevel: theme.legibility.brightnessLevel,
    dimColor: theme.legibility.dimColor,
    panelOpacity: theme.transparency.panelOpacity,
    sidebarWidth: theme.sidebarWidth,
    textGlowAlpha: theme.transparency.textGlowAlpha,
  };
}

function workspacePatchToTheme(
  theme: UserThemeConfig,
  patch: Partial<UnifiedWorkspaceConfig>,
): UserThemeConfig {
  return {
    ...theme,
    cardOpacity:
      patch.panelOpacity !== undefined
        ? clampCardOpacity(patch.panelOpacity)
        : theme.cardOpacity,
    id: theme.id === "custom" ? theme.id : "custom",
    legibility: {
      ...theme.legibility,
      blurRadius: patch.blurRadius ?? theme.legibility.blurRadius,
      brightnessLevel:
        patch.brightnessLevel ?? theme.legibility.brightnessLevel,
      dimColor: patch.dimColor ?? theme.legibility.dimColor,
    },
    name: theme.id === "custom" ? theme.name : "Custom Setup",
    sidebarWidth:
      patch.sidebarWidth !== undefined
        ? clampSidebarWidth(patch.sidebarWidth)
        : theme.sidebarWidth,
    transparency: {
      ...theme.transparency,
      borderOpacity: patch.borderOpacity ?? theme.transparency.borderOpacity,
      panelOpacity: patch.panelOpacity ?? theme.transparency.panelOpacity,
      textGlowAlpha: patch.textGlowAlpha ?? theme.transparency.textGlowAlpha,
    },
  };
}

function formatBiasLabel(value: RomanceTropeClass) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
