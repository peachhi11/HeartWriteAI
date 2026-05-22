"use client";

import { useState } from "react";
import {
  BookOpenText,
  Download,
  FileUp,
  Images,
  MessageSquareText,
  Plus,
  RefreshCw,
  Sparkles,
  Tags,
  Trash2,
} from "lucide-react";

import { CharacterCardDropZoneOverlay } from "@/components/character-card-drop-zone-overlay";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useCharacterCardImportExport } from "@/hooks/character-card/useCharacterCardImportExport";
import { humanizeOptionLabel } from "@/lib/ui/humanizeOptionLabel";
import { CharacterCardFormValues } from "@/types/character-card/CharacterCardFormValues";

const simulationFrameworks = [
  "Sandbox",
  "Narrative RPG",
  "Text Adventure",
  "Scene-Locked",
] as const;

const promptFormats = ["W++", "JSON", "Boostyle", "Natural Language"] as const;

const relationshipModes = [
  "Symmetric",
  "Asymmetric (Bot Dominant)",
  "Asymmetric (User Dominant)",
  "Antagonistic",
] as const;

const macroToneTags = [
  "sweet & wholesome",
  "angsty",
  "cozy romance",
  "slow burn",
  "dead dove",
  "dark rp",
] as const;

const storyEnginePresets = [
  { label: "Choose a story engine", tag: "" },
  { label: "Angst", tag: "angsty" },
  { label: "Slow burn", tag: "slow burn" },
  { label: "Comfort", tag: "hurt/comfort" },
  { label: "Cozy romance", tag: "cozy romance" },
  { label: "Fluff", tag: "fluff" },
  { label: "Dark romance", tag: "dark romance" },
  { label: "Second chance", tag: "second chance" },
  { label: "High agency", tag: "high agency" },
  { label: "Curious tension", tag: "curious" },
] as const;

export function CharacterCardImportExport() {
  const {
    cardValues,
    error,
    importSummary,
    intakeText,
    isExportDisabled,
    isProcessing,
    addAlternateOpening,
    addGroupGreeting,
    deleteAlternateOpening,
    deleteGroupGreeting,
    updateCardField,
    updateAlternateOpening,
    updateGroupGreeting,
    updateIntakeText,
    routeIntakeText,
    importPngFile,
    importNativeCard,
    exportPngFile,
  } = useCharacterCardImportExport();
  const [intakeRouteMessage, setIntakeRouteMessage] = useState<string | null>(null);
  const [dropMessage, setDropMessage] = useState<string | null>(null);

  function handleRouteIntake() {
    const result = routeIntakeText();

    setIntakeRouteMessage(
      result.fieldNames.length
        ? `Routed ${result.fieldNames.length} structured fields.`
        : null,
    );
  }

  function updateMacroClassification(label: string, value: string) {
    updateCardField(
      "system_prompt",
      upsertLabeledLine(cardValues.system_prompt, label, value),
    );
  }

  function toggleTag(tag: string) {
    updateCardField("tagsText", toggleCommaSeparatedValue(cardValues.tagsText, tag));
  }

  function setStoryEngineTag(tag: string) {
    updateCardField("tagsText", replaceStoryEngineTag(cardValues.tagsText, tag));
  }

  return (
    <Card className="border bg-card/85 shadow-2xl backdrop-blur">
      <CharacterCardDropZoneOverlay
        onAssetTranscoded={(filePath) =>
          setDropMessage(`Converted image asset to ${filePath}.`)
        }
        onCardParsed={(card, filePath) => {
          importNativeCard(card, filePath);
          setDropMessage(`Imported ${filePath}.`);
        }}
        onDropError={setDropMessage}
      />
      <CardHeader>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <FileUp data-icon="inline-start" />
              Character card import / export
            </CardTitle>
            <CardDescription>
              Import a PNG character card, edit the core readable fields, and
              export the same image with fresh embedded CCV3 metadata.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <label>
                {isProcessing ? (
                  <RefreshCw className="animate-spin" />
                ) : (
                  <FileUp />
                )}
                {isProcessing ? "Importing" : "Import PNG"}
                <input
                  type="file"
                  accept="image/png,image/apng"
                  className="sr-only"
                  disabled={isProcessing}
                  onChange={importPngFile}
                />
              </label>
            </Button>
            <Button disabled={isExportDisabled} onClick={exportPngFile}>
              <Download />
              Export CCV3 PNG
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {error ? (
          <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        {dropMessage ? (
          <p className="rounded-xl border bg-muted/45 px-3 py-2 text-sm text-muted-foreground">
            {dropMessage}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          {importSummary ? (
            <>
              <Badge variant="secondary">
                {importSummary.source === "ccv3" ? "CCV3" : "Legacy chara"}
              </Badge>
              <span className="font-medium text-foreground">
                {importSummary.fileName}
              </span>
              <span>
                {importSummary.spec ?? "unknown spec"}
                {importSummary.specVersion ? ` ${importSummary.specVersion}` : ""}
              </span>
            </>
          ) : (
            <span>No card loaded yet.</span>
          )}
        </div>

        {importSummary ? (
          <div className="grid gap-3 rounded-lg border bg-background/60 p-3 md:grid-cols-3 xl:grid-cols-6">
            <div className="md:col-span-3 xl:col-span-2">
              <p className="text-xs text-muted-foreground">Loaded card</p>
              <p className="truncate text-sm font-medium">
                {importSummary.loadedSummary.name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Tags className="size-4 text-muted-foreground" />
              <span className="text-sm">
                {importSummary.loadedSummary.tagsCount} tags
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquareText className="size-4 text-muted-foreground" />
              <span className="text-sm">
                {importSummary.loadedSummary.alternateGreetingsCount} alt
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquareText className="size-4 text-muted-foreground" />
              <span className="text-sm">
                {importSummary.loadedSummary.groupOnlyGreetingsCount} group
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpenText className="size-4 text-muted-foreground" />
              <span className="text-sm">
                {importSummary.loadedSummary.lorebookEntriesCount} lore
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Images className="size-4 text-muted-foreground" />
              <span className="text-sm">
                {importSummary.loadedSummary.assetsCount} assets
              </span>
            </div>
          </div>
        ) : null}

        <div className="grid gap-3 rounded-lg border bg-background/60 p-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="space-y-1">
              <p className="flex items-center gap-2 text-sm font-medium">
                <Sparkles className="size-4 text-muted-foreground" />
                Messy Intake
              </p>
              <p className="max-w-3xl text-xs text-muted-foreground">
                Paste notes, scraped card text, friction riffs, or rough character
                ideas, then route them into the editor fields below.
              </p>
            </div>
            <Button type="button" variant="secondary" onClick={handleRouteIntake}>
              <Sparkles />
              Route Intake
            </Button>
          </div>
          <Textarea
            value={intakeText}
            placeholder="Paste rough material here: Name, age, appearance, wants, fears, background, relationships, kinks, scenario, first message..."
            className="min-h-40 resize-y"
            onChange={(event) => updateIntakeText(event.currentTarget.value)}
          />
          {intakeRouteMessage ? (
            <p className="text-xs text-muted-foreground">{intakeRouteMessage}</p>
          ) : null}
        </div>

        <Tabs defaultValue="profile" className="grid gap-4">
          <TabsList className="w-fit flex-wrap">
            <TabsTrigger value="profile">Character Profile</TabsTrigger>
            <TabsTrigger value="openings">Scenario & Openings</TabsTrigger>
            <TabsTrigger value="lore">Lore</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="grid gap-4">
            <div className="grid gap-3 md:grid-cols-3">
              <label className="grid gap-2 text-sm font-medium md:col-span-2">
                Full Name
                <Input
                  value={cardValues.fullName}
                  placeholder="First Middle Last"
                  onChange={(event) =>
                    updateCardField("fullName", event.currentTarget.value)
                  }
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Age & Birthdate
                <Input
                  value={cardValues.ageBirthdate}
                  placeholder="Chronological age / approximate"
                  onChange={(event) =>
                    updateCardField("ageBirthdate", event.currentTarget.value)
                  }
                />
              </label>
            </div>

            <label className="grid gap-2 text-sm font-medium">
              Aliases / Nicknames
              <Textarea
                value={cardValues.aliasesNicknames}
                placeholder="What they go by, and who gave the name to them."
                className="min-h-24 resize-y"
                onChange={(event) =>
                  updateCardField("aliasesNicknames", event.currentTarget.value)
                }
              />
            </label>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <label className="grid gap-2 text-sm font-medium">
                Race / Ethnicity
                <Input
                  value={cardValues.raceEthnicity}
                  onChange={(event) =>
                    updateCardField("raceEthnicity", event.currentTarget.value)
                  }
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Species
                <Input
                  value={cardValues.species}
                  placeholder="Human, supernatural type..."
                  onChange={(event) =>
                    updateCardField("species", event.currentTarget.value)
                  }
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Birthplace
                <Input
                  value={cardValues.birthplace}
                  onChange={(event) =>
                    updateCardField("birthplace", event.currentTarget.value)
                  }
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Height
                <Input
                  value={cardValues.height}
                  placeholder={`5'10" / 178 cm`}
                  onChange={(event) =>
                    updateCardField("height", event.currentTarget.value)
                  }
                />
              </label>
            </div>

            <label className="grid gap-2 text-sm font-medium">
              Tags
              <Input
                value={cardValues.tagsText}
                placeholder="male, dominant, alpha, supernatural, enemies to lovers"
                onChange={(event) =>
                  updateCardField("tagsText", event.currentTarget.value)
                }
              />
            </label>

            <div className="grid gap-3 lg:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                Description
                <Textarea
                  value={cardValues.description}
                  placeholder="Condensed hook: what they want, what gets in their way, and why {{user}} matters to the friction."
                  className="min-h-36 resize-y"
                  onChange={(event) =>
                    updateCardField("description", event.currentTarget.value)
                  }
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Creator Notes
                <Textarea
                  value={cardValues.creator_notes}
                  placeholder="Creator-facing card notes, publishing notes, warnings, credits, or platform-specific metadata."
                  className="min-h-36 resize-y"
                  onChange={(event) =>
                    updateCardField("creator_notes", event.currentTarget.value)
                  }
                />
              </label>
            </div>

            <label className="grid gap-2 text-sm font-medium">
              Physical Appearance
                <Textarea
                  value={cardValues.physicalAppearance}
                  placeholder="Body, posture, style, marks, and first outfit. Tie details to behavior: what their body/clothes make them assume, avoid, perform, or hide."
                className="min-h-32 resize-y"
                onChange={(event) =>
                  updateCardField("physicalAppearance", event.currentTarget.value)
                }
              />
            </label>

            <label className="grid gap-2 text-sm font-medium">
              Personality & Psychology
                <Textarea
                  value={cardValues.personalityPsychology}
                  placeholder="Write causal texture: want, fear, mask vs truth, contradictions, irrational habits, petty likes/dislikes, and how those pressures change behavior."
                className="min-h-36 resize-y"
                onChange={(event) =>
                  updateCardField(
                    "personalityPsychology",
                    event.currentTarget.value,
                  )
                }
              />
            </label>

            <div className="grid gap-3 lg:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                Background & Story
                <Textarea
                  value={cardValues.backgroundStory}
                  placeholder="Environment and shaping events: class, family, culture, education, work, one defining mistake, and what they learned from it."
                  className="min-h-32 resize-y"
                  onChange={(event) =>
                    updateCardField("backgroundStory", event.currentTarget.value)
                  }
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Speech Style
                <Textarea
                  value={cardValues.speechStyle}
                  placeholder="Voice as behavior: cadence, evasions, tells, class/culture markers, insults, tenderness, and what slips out under pressure."
                  className="min-h-32 resize-y"
                  onChange={(event) =>
                    updateCardField("speechStyle", event.currentTarget.value)
                  }
                />
              </label>
            </div>

            <label className="grid gap-2 text-sm font-medium">
              Relationships / Connections
              <Textarea
                value={cardValues.relationshipsConnections}
                placeholder="NPCs, family, rivals, allies, exes, factions. For each: what they want from them, resent, owe, fear, or perform around."
                className="min-h-32 resize-y"
                onChange={(event) =>
                  updateCardField(
                    "relationshipsConnections",
                    event.currentTarget.value,
                  )
                }
              />
            </label>

            <label className="grid gap-2 text-sm font-medium">
              Sexuality / Intimacy Profile
              <Textarea
                value={cardValues.intimacyProfile}
                placeholder="Compact, triggerable notes: orientation, role/dynamic, intimacy style, kinks/fetishes, boundaries, skills, shame, confidence, habits, and consent rules."
                className="min-h-28 resize-y"
                onChange={(event) =>
                  updateCardField("intimacyProfile", event.currentTarget.value)
                }
              />
            </label>

            <label className="grid gap-2 text-sm font-medium">
              Example Messages
              <Textarea
                value={cardValues.mes_example}
                className="min-h-32 resize-y"
                onChange={(event) =>
                  updateCardField("mes_example", event.currentTarget.value)
                }
              />
            </label>
          </TabsContent>

          <TabsContent value="openings" className="grid gap-4">
            <MacroClassificationSelector
              values={cardValues}
              onSelect={updateMacroClassification}
              onSelectStoryEngine={setStoryEngineTag}
              onToggleTag={toggleTag}
            />

            <div className="grid gap-3 lg:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                Default Scenario
                <Textarea
                  value={cardValues.scenario}
                  placeholder="Current situation with built-in friction: setting, immediate pressure, relationship state, stakes, and what can go wrong."
                  className="min-h-36 resize-y"
                  onChange={(event) =>
                    updateCardField("scenario", event.currentTarget.value)
                  }
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Default First Message
                <Textarea
                  value={cardValues.first_mes}
                  placeholder="Open in motion. Show tone, setting, and one live contradiction or pressure point for {{user}} to respond to."
                  className="min-h-36 resize-y"
                  onChange={(event) =>
                    updateCardField("first_mes", event.currentTarget.value)
                  }
                />
              </label>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">Alternate Openings</p>
                  <p className="text-xs text-muted-foreground">
                    Each opening pairs an optional alternate scenario with a first message.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAlternateOpening}
                >
                  <Plus />
                  Add
                </Button>
              </div>

              {cardValues.alternateOpenings.length ? (
                cardValues.alternateOpenings.map((opening, index) => (
                  <div
                    key={`opening-${index}`}
                    className="grid gap-3 rounded-lg border bg-background/60 p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        Alternate opening {index + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteAlternateOpening(index)}
                        aria-label={`Delete alternate opening ${index + 1}`}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                    <label className="grid gap-2 text-sm font-medium">
                      Alternate Scenario
                      <Textarea
                        value={opening.scenario}
                        placeholder="Alternate setup: different pressure, relationship state, or route premise."
                        className="min-h-28 resize-y"
                        onChange={(event) =>
                          updateAlternateOpening(
                            index,
                            "scenario",
                            event.currentTarget.value,
                          )
                        }
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-medium">
                      Alternate First Message
                      <Textarea
                        value={opening.firstMessage}
                        placeholder="Alternate first message that shows personality through action, not explanation."
                        className="min-h-32 resize-y"
                        onChange={(event) =>
                          updateAlternateOpening(
                            index,
                            "firstMessage",
                            event.currentTarget.value,
                          )
                        }
                      />
                    </label>
                  </div>
                ))
              ) : (
                <p className="rounded-lg border border-dashed bg-background/40 px-3 py-6 text-center text-sm text-muted-foreground">
                  No alternate openings yet.
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">Group Only Greetings</p>
                  <p className="text-xs text-muted-foreground">
                    Openings used only when the card is in a group chat.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addGroupGreeting}
                >
                  <Plus />
                  Add
                </Button>
              </div>

              {cardValues.groupOnlyGreetings.length ? (
                cardValues.groupOnlyGreetings.map((greeting, index) => (
                  <div
                    key={`group-${index}`}
                    className="grid gap-2 rounded-lg border bg-background/60 p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        Group greeting {index + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteGroupGreeting(index)}
                        aria-label={`Delete group greeting ${index + 1}`}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                    <Textarea
                      value={greeting}
                      placeholder="Group opening with social pressure, visible dynamics, and room for multiple characters to react."
                      className="min-h-32 resize-y"
                      onChange={(event) =>
                        updateGroupGreeting(index, event.currentTarget.value)
                      }
                    />
                  </div>
                ))
              ) : (
                <p className="rounded-lg border border-dashed bg-background/40 px-3 py-6 text-center text-sm text-muted-foreground">
                  No group-only greetings yet.
                </p>
              )}
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                System Prompt
                <Textarea
                  value={cardValues.system_prompt}
                  placeholder="Permanent high-priority instructions for how the character should be interpreted."
                  className="min-h-32 resize-y"
                  onChange={(event) =>
                    updateCardField("system_prompt", event.currentTarget.value)
                  }
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Post History Instructions
                <Textarea
                  value={cardValues.post_history_instructions}
                  placeholder="Ongoing steering notes appended after chat history, such as persistent traits, mechanics, or route rules."
                  className="min-h-32 resize-y"
                  onChange={(event) =>
                    updateCardField(
                      "post_history_instructions",
                      event.currentTarget.value,
                    )
                  }
                />
              </label>
            </div>
          </TabsContent>

          <TabsContent value="lore" className="grid gap-4 lg:grid-cols-3">
            <div className="grid content-start gap-3 rounded-lg border bg-background/60 p-4">
              <div>
                <p className="text-sm font-medium">Character Lorebook</p>
                <p className="text-sm text-muted-foreground">
                  {importSummary
                    ? `${importSummary.loadedSummary.lorebookEntriesCount} entries detected`
                    : "Import a card to inspect lorebook entries."}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Character-Associated World Lore</p>
                <p className="text-sm text-muted-foreground">
                  World-lore attachment editing will live here after the card
                  basics are stable.
                </p>
              </div>
            </div>
            <div className="grid content-start gap-3 rounded-lg border bg-background/60 p-4">
              <p className="text-sm font-medium">Relationships / NPC Context</p>
              <p className="text-sm text-muted-foreground">
                Relationship lists stay in the Character Profile for now and can
                later generate focused lorebook entries.
              </p>
            </div>
            <div className="grid content-start gap-3 rounded-lg border bg-background/60 p-4">
              <p className="text-sm font-medium">Family / Factions / World Links</p>
              <p className="text-sm text-muted-foreground">
                Family trees, faction ties, and world-lore attachments will be
                editable here after import/export is solid.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function MacroClassificationSelector({
  values,
  onSelect,
  onSelectStoryEngine,
  onToggleTag,
}: {
  readonly values: CharacterCardFormValues;
  readonly onSelect: (label: string, value: string) => void;
  readonly onSelectStoryEngine: (tag: string) => void;
  readonly onToggleTag: (tag: string) => void;
}) {
  const frameworkValue = readLabeledLine(values.system_prompt, "Framework");
  const formattingValue = readLabeledLine(values.system_prompt, "Formatting");
  const relationshipValue = readLabeledLine(values.system_prompt, "Relationship");
  const activeStoryEngine =
    storyEnginePresets.find((preset) =>
      preset.tag ? hasCommaSeparatedValue(values.tagsText, preset.tag) : false,
    )?.tag ?? "";

  return (
    <div className="grid gap-4 rounded-lg border bg-background/60 p-4">
      <div className="space-y-1">
        <p className="text-sm font-medium">Story Engine</p>
        <p className="text-xs text-muted-foreground">
          Pick the kind of emotional route this card should lean toward. The app
          handles the deeper routing quietly.
        </p>
      </div>

      <label className="grid gap-2 text-sm font-medium md:max-w-sm">
        Engine preset
        <select
          value={activeStoryEngine}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
          onChange={(event) => {
            onSelectStoryEngine(event.currentTarget.value);
          }}
        >
          {storyEnginePresets.map((preset) => (
            <option key={preset.label} value={preset.tag}>
              {preset.label}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 lg:grid-cols-3">
        <SegmentedButtonGroup
          label="Play Style"
          options={simulationFrameworks}
          value={frameworkValue}
          tone="violet"
          onSelect={(value) => onSelect("Framework", value)}
        />
        <SegmentedButtonGroup
          label="Writing Format"
          options={promptFormats}
          value={formattingValue}
          tone="cyan"
          onSelect={(value) => onSelect("Formatting", value)}
        />
        <SegmentedButtonGroup
          label="Starting Relationship"
          options={relationshipModes}
          value={relationshipValue}
          tone="emerald"
          onSelect={(value) => onSelect("Relationship", value)}
        />
      </div>

      <div className="grid gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Tone Tags
        </p>
        <div className="flex flex-wrap gap-2">
          {macroToneTags.map((tag) => {
            const isActive = hasCommaSeparatedValue(values.tagsText, tag);

            return (
              <Button
                key={tag}
                type="button"
                variant={isActive ? "secondary" : "outline"}
                size="sm"
                onClick={() => onToggleTag(tag)}
              >
                {tag}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SegmentedButtonGroup<TOption extends string>({
  label,
  options,
  value,
  tone,
  onSelect,
}: {
  readonly label: string;
  readonly options: readonly TOption[];
  readonly value: string | undefined;
  readonly tone: "cyan" | "emerald" | "violet";
  readonly onSelect: (value: TOption) => void;
}) {
  return (
    <div className="grid gap-2">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => {
          const isActive = value === option;

          return (
            <button
              key={option}
              type="button"
              className={[
                "min-h-11 min-w-0 rounded-md border px-3 py-2 text-left text-sm leading-snug transition",
                isActive
                  ? activeToneClassNames[tone]
                  : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground",
              ].join(" ")}
              onClick={() => onSelect(option)}
              title={option}
            >
              <span className="block break-words">
                {humanizeOptionLabel(option)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const activeToneClassNames = {
  cyan: "border-cyan-500/70 bg-cyan-500/10 text-cyan-700 ring-2 ring-cyan-500/20 dark:text-cyan-300",
  emerald:
    "border-emerald-500/70 bg-emerald-500/10 text-emerald-700 ring-2 ring-emerald-500/20 dark:text-emerald-300",
  violet:
    "border-violet-500/70 bg-violet-500/10 text-violet-700 ring-2 ring-violet-500/20 dark:text-violet-300",
};

function readLabeledLine(text: string, label: string): string | undefined {
  const match = text.match(new RegExp(`^${escapeRegExp(label)}:\\s*(.+)$`, "im"));

  return match?.[1]?.trim();
}

function upsertLabeledLine(text: string, label: string, value: string): string {
  const line = `${label}: ${value}`;
  const labelPattern = new RegExp(`^${escapeRegExp(label)}:\\s*.*$`, "im");

  if (labelPattern.test(text)) {
    return text.replace(labelPattern, line);
  }

  return [line, text.trim()].filter(Boolean).join("\n");
}

function hasCommaSeparatedValue(text: string, value: string): boolean {
  return text
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .includes(value.toLowerCase());
}

function toggleCommaSeparatedValue(text: string, value: string): string {
  const values = text
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const valueIndex = values.findIndex(
    (item) => item.toLowerCase() === value.toLowerCase(),
  );

  if (valueIndex >= 0) {
    return values.filter((_, index) => index !== valueIndex).join(", ");
  }

  return [...values, value].join(", ");
}

function replaceStoryEngineTag(text: string, value: string): string {
  const engineTags = new Set(
    storyEnginePresets
      .map((preset) => preset.tag.toLowerCase())
      .filter(Boolean),
  );
  const values = text
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item && !engineTags.has(item.toLowerCase()));

  if (value) {
    values.push(value);
  }

  return values.join(", ");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
