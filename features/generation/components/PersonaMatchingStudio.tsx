"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Activity, Gauge, HeartHandshake, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  calculatePsychologicalResonance,
  type PersonaTraits,
} from "@/lib/persona/psychologyEngine";
import { fetchContextualNpcDialogue } from "@/lib/tauri/contextualDialogue";
import { initializeProfileWithResonance } from "@/lib/tauri/personaResonance";
import type { CharacterImportPayload } from "@/lib/tauri/characterCardParser";
import { commitCharacterCardToActiveSlot } from "@/lib/tauri/tropeInteraction";
import {
  RomanceTropeClassSchema,
  type RomanceTropeClass,
} from "@/types/character-card/RomanceTropeClassification";
import type {
  ExtractedCharacterPayload,
  SavedPersonaMetadata,
} from "@/types/studio";
import { CardParserUploader } from "./CardParserUploader";
import { CharacterPreviewSheet } from "./CharacterPreviewSheet";
import { Field } from "./GenerationShell";
import { PersonaSelectorGrid } from "./PersonaSelectorGrid";

const selectableTropes: RomanceTropeClass[] = [
  "bantering",
  "flustered",
  "yearning",
  "grumpy",
  "sunshine",
  "protective",
  "antagonistic",
  "forbidden",
];

const fallbackTargetForbiddenTones: RomanceTropeClass[] = [
  "antagonistic",
  "forbidden",
];

const fallbackTargetPreferredTones: RomanceTropeClass[] = [
  "bantering",
  "sunshine",
];

export function PersonaMatchingStudio() {
  const [name, setName] = useState("Protagonist");
  const [primaryBias, setPrimaryBias] =
    useState<RomanceTropeClass>("bantering");
  const [secondaryBias, setSecondaryBias] =
    useState<RomanceTropeClass>("flustered");
  const [charm, setCharm] = useState(40);
  const [willpower, setWillpower] = useState(50);
  const [vulnerability, setVulnerability] = useState(30);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [dialoguePreview, setDialoguePreview] = useState<string | null>(null);
  const [activeProfileId, setActiveProfileId] = useState<string | undefined>();
  const [stagedCard, setStagedCard] =
    useState<ExtractedCharacterPayload | null>(null);
  const [isCommittingStagedCard, setIsCommittingStagedCard] = useState(false);
  const [targetName, setTargetName] = useState("Lucas");
  const [targetDescription, setTargetDescription] = useState(
    "A protective, brooding royal guard who shields his isolation with rigid, polite duty.",
  );
  const [targetAvatarDataUri, setTargetAvatarDataUri] = useState<string | null>(
    null,
  );
  const [targetForbiddenTones, setTargetForbiddenTones] = useState<
    RomanceTropeClass[]
  >(fallbackTargetForbiddenTones);
  const [targetPreferredTones, setTargetPreferredTones] = useState<
    RomanceTropeClass[]
  >(fallbackTargetPreferredTones);

  const personaTraits: PersonaTraits = useMemo(
    () => ({
      name,
      primaryBias,
      secondaryBias,
      stats: { charm, vulnerability, willpower },
    }),
    [charm, name, primaryBias, secondaryBias, vulnerability, willpower],
  );

  const report = useMemo(
    () =>
      calculatePsychologicalResonance(
        personaTraits,
        targetForbiddenTones,
        targetPreferredTones,
      ),
    [personaTraits, targetForbiddenTones, targetPreferredTones],
  );

  async function initializeNarrativeBranch() {
    setIsSyncing(true);
    setSyncStatus(null);

    try {
      const result = await initializeProfileWithResonance({
        archetype: report.dynamicArchetype,
        name,
        primaryBias,
        resonanceScore: report.resonanceScore,
      });
      const preview = await fetchContextualNpcDialogue(
        "scene_01_alley_encounter",
      );
      setDialoguePreview(
        `${preview.speaker} / ${preview.applied_archetype}: ${preview.transformed_text}`,
      );
      setSyncStatus(result.message);
    } catch (caughtError) {
      setSyncStatus(
        `Could not initialize branch: ${
          caughtError instanceof Error ? caughtError.message : String(caughtError)
        }`,
      );
    } finally {
      setIsSyncing(false);
    }
  }

  function activateSavedPersona(profile: SavedPersonaMetadata) {
    setActiveProfileId(profile.id);
    setName(profile.name);
    setPrimaryBias(profile.coreClass);
    setCharm(profile.charm);
    setWillpower(profile.willpower);
    setVulnerability(profile.vulnerability);
    setSyncStatus(`Loaded ${profile.name} into the match controls.`);
    setDialoguePreview(null);
  }

  function handleImportedCharacterCard(payload: CharacterImportPayload) {
    const extractedPayload = toExtractedCharacterPayload(payload);
    setStagedCard(extractedPayload);
    setSyncStatus(`Loaded ${extractedPayload.name} for staging inspection.`);
    setDialoguePreview(null);
  }

  async function commitStagedCharacterCard() {
    if (!stagedCard) {
      return;
    }

    setIsCommittingStagedCard(true);
    setSyncStatus(null);

    try {
      await commitCharacterCardToActiveSlot(stagedCard);
      setTargetAvatarDataUri(stagedCard.avatarDataUri);
      setTargetName(stagedCard.name);
      setTargetDescription(
        stagedCard.description || "Imported card has no description.",
      );
      setTargetPreferredTones(stagedCard.preferredTones);
      setTargetForbiddenTones(stagedCard.forbiddenTones);
      setSyncStatus(`Committed ${stagedCard.name} to the active profile slot.`);
      setDialoguePreview(null);
      setStagedCard(null);
    } catch (caughtError) {
      setSyncStatus(
        `Could not commit staged card: ${
          caughtError instanceof Error ? caughtError.message : String(caughtError)
        }`,
      );
    } finally {
      setIsCommittingStagedCard(false);
    }
  }

  return (
    <Card className="bg-card/85">
      <CardHeader className="gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1.5">
          <CardTitle className="flex items-center gap-2">
            {targetAvatarDataUri ? (
              <Image
                alt={`${targetName} avatar`}
                className="size-8 rounded-full border object-cover"
                height={32}
                src={targetAvatarDataUri}
                unoptimized
                width={32}
              />
            ) : null}
            <HeartHandshake className="size-5 text-primary" />
            Persona Match
          </CardTitle>
          <CardDescription>
            Tune the player persona against a target character without blocking
            difficult story routes.
          </CardDescription>
        </div>
        <Badge variant="outline">{targetName} target profile</Badge>
      </CardHeader>
      <CardContent className="grid gap-5">
        <CardParserUploader
          onCardSuccessfullyParsed={handleImportedCharacterCard}
        />
        <CharacterPreviewSheet
          cardPayload={stagedCard}
          isCommitting={isCommittingStagedCard}
          onClose={() => setStagedCard(null)}
          onCommitToSlot={commitStagedCharacterCard}
        />

        <PersonaSelectorGrid
          activeId={activeProfileId}
          onPersonaActivated={activateSavedPersona}
        />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.9fr)]">
        <div className="grid gap-4">
          <Field label="Persona name">
            <Input value={name} onChange={(event) => setName(event.currentTarget.value)} />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Primary tone">
              <select
                value={primaryBias}
                onChange={(event) =>
                  setPrimaryBias(event.currentTarget.value as RomanceTropeClass)
                }
                className="h-10 rounded-md border bg-background px-3 text-sm"
              >
                {selectableTropes.map((trope) => (
                  <option key={trope} value={trope}>
                    {formatTropeLabel(trope)}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Secondary tone">
              <select
                value={secondaryBias}
                onChange={(event) =>
                  setSecondaryBias(event.currentTarget.value as RomanceTropeClass)
                }
                className="h-10 rounded-md border bg-background px-3 text-sm"
              >
                {selectableTropes.map((trope) => (
                  <option key={trope} value={trope}>
                    {formatTropeLabel(trope)}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid gap-4 rounded-md border bg-background/70 p-4">
            <RangeControl label="Charm" value={charm} onChange={setCharm} />
            <RangeControl
              label="Willpower"
              value={willpower}
              onChange={setWillpower}
            />
            <RangeControl
              label="Vulnerability"
              value={vulnerability}
              onChange={setVulnerability}
            />
          </div>
        </div>

        <section className={`grid gap-4 rounded-md border p-4 shadow-inner transition-all duration-300 ${report.uiGlow}`}>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Badge variant="outline" className="bg-background/70">
                Target Analysis
              </Badge>
              <span className="font-mono text-2xl font-black">
                {report.resonanceScore}%
              </span>
            </div>
            <h3 className="text-base font-semibold text-foreground">
              {report.dynamicArchetype}
            </h3>
            <p className="text-xs font-medium text-muted-foreground">
              Target: {targetName}
            </p>
            {targetAvatarDataUri ? (
              <div className="flex items-center gap-3 rounded-md border bg-background/70 p-3">
                <Image
                  alt={`${targetName} character card avatar`}
                  className="size-14 rounded-md border object-cover"
                  height={56}
                  src={targetAvatarDataUri}
                  unoptimized
                  width={56}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {targetName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Imported PNG avatar
                  </p>
                </div>
              </div>
            ) : null}
            <p className="text-sm leading-6 text-muted-foreground">
              {report.description}
            </p>
            <p className="line-clamp-3 text-xs leading-5 text-muted-foreground">
              {targetDescription}
            </p>
          </div>

          <div className="h-2 overflow-hidden rounded-full border bg-background/70">
            <div
              className="h-full rounded-full bg-current transition-all duration-500"
              style={{ width: `${report.resonanceScore}%` }}
            />
          </div>

          <div className="grid gap-2 text-xs text-muted-foreground">
            <p className="flex items-center gap-2">
              <Activity className="size-3.5" />
              Preferred: {formatToneList(targetPreferredTones)}
            </p>
            <p className="flex items-center gap-2">
              <Gauge className="size-3.5" />
              Friction: {formatToneList(targetForbiddenTones)}
            </p>
          </div>

          <Button
            type="button"
            onClick={initializeNarrativeBranch}
            disabled={isSyncing}
          >
            <Sparkles className="size-4" />
            {isSyncing ? "Initializing..." : "Initialize Narrative Branch"}
          </Button>

          {syncStatus ? (
            <p className="text-xs leading-5 text-muted-foreground">{syncStatus}</p>
          ) : null}
          {dialoguePreview ? (
            <blockquote className="rounded-md border bg-background/70 p-3 text-xs leading-5 text-muted-foreground">
              {dialoguePreview}
            </blockquote>
          ) : null}
        </section>
        </div>
      </CardContent>
    </Card>
  );
}

function RangeControl(props: {
  label: string;
  onChange: (value: number) => void;
  value: number;
}) {
  return (
    <label className="grid gap-2">
      <span className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {props.label}
        <span className="font-mono text-primary">{props.value}</span>
      </span>
      <input
        className="h-2 w-full cursor-pointer accent-primary"
        max={100}
        min={0}
        onChange={(event) => props.onChange(Number(event.currentTarget.value))}
        type="range"
        value={props.value}
      />
    </label>
  );
}

function formatTropeLabel(trope: RomanceTropeClass) {
  return trope
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatToneList(tones: RomanceTropeClass[]) {
  return tones.length > 0 ? tones.map(formatTropeLabel).join(", ") : "None tagged";
}

function normalizeTropeList(tones: string[]) {
  const normalized = tones
    .map((tone) => tone.trim().toLowerCase().replace(/[\s-]+/g, "_"))
    .map((tone) => RomanceTropeClassSchema.safeParse(tone))
    .filter((result) => result.success)
    .map((result) => result.data);

  return Array.from(new Set(normalized));
}

function toExtractedCharacterPayload(
  payload: CharacterImportPayload,
): ExtractedCharacterPayload {
  const preferredTones = normalizeTropeList(payload.metadata.preferredTones);
  const forbiddenTones = normalizeTropeList(payload.metadata.forbiddenTones);

  return {
    avatarDataUri: payload.avatarDataUri,
    description: payload.metadata.description,
    forbiddenTones,
    name: payload.metadata.name,
    preferredTones,
    requiredThresholds: inferRequiredThresholds(preferredTones, forbiddenTones),
  };
}

function inferRequiredThresholds(
  preferredTones: RomanceTropeClass[],
  forbiddenTones: RomanceTropeClass[],
) {
  const minCharm = preferredTones.some((tone) =>
    ["bantering", "flustered", "recognized", "sunshine"].includes(tone),
  )
    ? 45
    : 0;

  const minWillpower = [...preferredTones, ...forbiddenTones].some((tone) =>
    ["antagonistic", "commanding", "forbidden", "protective"].includes(tone),
  )
    ? 50
    : 0;

  return { minCharm, minWillpower };
}
