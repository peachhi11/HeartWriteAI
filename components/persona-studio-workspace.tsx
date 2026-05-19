"use client";

import { ChangeEvent, useMemo, useState } from "react";
import {
  BadgeCheck,
  Blend,
  Download,
  HeartHandshake,
  ImagePlus,
  Link2,
  Sparkles,
} from "lucide-react";

import { StudioShell } from "@/components/studio-shell";
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { blendFashionAesthetics } from "@/lib/persona/blendFashionAesthetics";
import {
  compilePersonaPostHistoryInstruction,
  compilePersonaPromptBlock,
} from "@/lib/persona/compilePersonaPromptBlock";
import { createEmptyPersonaCardFormValues } from "@/lib/persona/createEmptyPersonaCardFormValues";
import { createPersonaCardExportFileName } from "@/lib/persona/createPersonaCardExportFileName";
import { createPersonaCardFromFormValues } from "@/lib/persona/createPersonaCardFromFormValues";
import { fashionAesthetics } from "@/lib/persona/fashionAesthetics";
import { personaSelectionPriority } from "@/lib/persona/personaSelectionPriority";
import { PersonaCardFormValues } from "@/types/persona/PersonaCardFormValues";
import { FashionSeasonContext } from "@/types/persona/FashionAesthetic";

const personaExamples = [
  {
    label: "Soft Dollcore",
    values: {
      displayName: "{{user}}",
      age: "22",
      gender: "Female",
      height: "5'0\"",
      eyes: "Green",
      hair: "Long dark brown hair, usually worn in soft waves or loose curls.",
      body: "Petite hourglass figure with soft curves, plush thighs, and a small waist.",
      aesthetic: "Dollcore, soft girl, hyperfeminine, romantic, lace-and-ribbons style.",
      appearance:
        "{{user}} has a sweet, doll-like appearance with large green eyes, soft facial features, plush lips, and a naturally gentle expression. She often wears glossy makeup, pink blush, soft shimmer, and neat manicures.",
      outfit:
        "She commonly wears lace camisoles, cropped cardigans or oversized hoodies, pleated mini skirts, sheer tights, heart-shaped accessories, chokers, ribbons, and platform shoes. She often smells like vanilla, sugar, or soft floral perfume.",
      personality:
        "{{user}} is genuinely sweet, affectionate, gentle, romantic, and soft-spoken. She can be shy at first, but becomes clingy, playful, and openly loving when comfortable. She is soft, but she can still say no, withdraw, sulk, or ask directly for what she wants.",
      behaviour:
        "- Twirls necklace charms, hoodie strings, or ribbons when nervous.\n- Likes sitting close, leaning against people, holding hands, or curling up beside someone.\n- Pouts when embarrassed, teased, or denied attention.\n- Keeps lip gloss, perfume, and small cute accessories in her bag.\n- Enjoys skincare, soft music, plush blankets, romance media, pretty outfits, and cozy spaces.",
      speech:
        "{{user}} speaks in a soft, feminine, affectionate way. Her voice is gentle and sometimes breathy when shy or flustered.",
      speechQuirks:
        "- Often says “mm,” “okayyy,” “baby,” “please,” “you’re mean,” and “stoppp.”\n- Gets quieter when embarrassed.\n- Uses playful whining when she wants attention.\n- Laughs softly when nervous.\n- Says things directly but gently.",
      exampleDialogue:
        'Greeting: "Hi baby… I missed you."\nWhen shy: "Don’t look at me like that, you’re making me nervous."\nWhen upset: "I’m not mad. I just don’t like feeling ignored."\nWhen affectionate: "You feel warm. I wanna stay like this."',
      intimacy:
        "{{user}} is affectionate, sensual, and physically responsive with someone she trusts. Her trust and comfort determine how openly she responds. She enjoys praise, closeness, possessive affection, size difference, lingerie, teasing, being guided, and feeling desired.",
      boundaries:
        "{{user}} dislikes cruelty, humiliation meant to genuinely hurt her, emotional coldness, being dismissed, or being pushed when she is clearly upset. She responds best to clear attention, reassurance, praise, and affection.",
      notes:
        "{{user}} is genuinely sweet; her softness is not an act. She is not manipulative, calculating, or secretly cruel. Use only for explicit {{user}} impersonation help, not as knowledge available to {{char}}.",
      tagsText: "soft, romantic, dollcore",
      vibeTagsText: "sweetheart, affectionate, shy-playful",
    },
  },
];

const fieldGroups = [
  {
    title: "Basic Details",
    fields: [
      ["displayName", "Name"],
      ["age", "Age"],
      ["gender", "Gender"],
      ["height", "Height"],
      ["eyes", "Eyes"],
      ["hair", "Hair"],
      ["body", "Body"],
      ["aesthetic", "Aesthetic"],
    ],
  },
] as const;

export function PersonaStudioWorkspace() {
  const [values, setValues] = useState<PersonaCardFormValues>(
    createEmptyPersonaCardFormValues,
  );
  const [dominantAestheticId, setDominantAestheticId] = useState("coquette");
  const [secondaryAestheticId, setSecondaryAestheticId] = useState("grunge");
  const [fashionSeason, setFashionSeason] =
    useState<FashionSeasonContext>("autumn");
  const personaCard = useMemo(
    () => createPersonaCardFromFormValues(values),
    [values],
  );
  const fashionBlend = useMemo(
    () =>
      blendFashionAesthetics({
        dominantAestheticId,
        secondaryAestheticId,
        season: fashionSeason,
      }),
    [dominantAestheticId, fashionSeason, secondaryAestheticId],
  );
  const promptPreview = useMemo(
    () => compilePersonaPromptBlock(personaCard),
    [personaCard],
  );
  const phiPreview = useMemo(
    () => compilePersonaPostHistoryInstruction(personaCard),
    [personaCard],
  );

  function updateValue(
    key: keyof PersonaCardFormValues,
    value: string | boolean,
  ) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleInputChange(key: keyof PersonaCardFormValues) {
    return (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => updateValue(key, event.currentTarget.value);
  }

  function loadExample(index: number) {
    setValues((current) => ({
      ...current,
      ...personaExamples[index].values,
    }));
  }

  function applyFashionBlend() {
    setValues((current) => ({
      ...current,
      aesthetic: fashionBlend.personaAestheticLine,
      outfit: current.outfit
        ? `${current.outfit}\n\n${fashionBlend.personaOutfitLine}`
        : fashionBlend.personaOutfitLine,
      tagsText: mergeCommaText(current.tagsText, [
        fashionBlend.hybridName.toLowerCase(),
        dominantAestheticId,
        secondaryAestheticId,
      ]),
      vibeTagsText: mergeCommaText(current.vibeTagsText, [
        fashionBlend.hybridName,
        "fashion-blend",
      ]),
    }));
  }

  function exportPersonaCard() {
    const blob = new Blob([JSON.stringify(personaCard, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = createPersonaCardExportFileName(personaCard);
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <StudioShell
      eyebrow="Persona Studio"
      title="Persona Studio"
      subtitle="Create standalone personas or match a persona to a specific character card."
      actions={
        <>
          <Badge variant="outline">Persona Card v1</Badge>
          <Button onClick={exportPersonaCard} size="sm">
            <Download data-icon="inline-start" />
            Save Persona
          </Button>
        </>
      }
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_30rem]">
        <section className="space-y-5">
          <Card className="bg-card/85">
            <CardHeader>
              <CardTitle>Creation Mode</CardTitle>
              <CardDescription>
                Build from scratch, or prepare a persona that is linked to a
                specific character card.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() => updateValue("creationMode", "from_scratch")}
                className={cn(
                  "rounded-lg border p-4 text-left transition hover:bg-muted",
                  values.creationMode === "from_scratch" &&
                    "border-rose-300 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/25",
                )}
              >
                <Sparkles className="mb-3 size-5 text-rose-700 dark:text-rose-200" />
                <p className="font-medium">Create From Scratch</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Start with a blank reusable persona card.
                </p>
              </button>
              <button
                type="button"
                onClick={() => updateValue("creationMode", "matched_to_character")}
                className={cn(
                  "rounded-lg border p-4 text-left transition hover:bg-muted",
                  values.creationMode === "matched_to_character" &&
                    "border-rose-300 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/25",
                )}
              >
                <HeartHandshake className="mb-3 size-5 text-rose-700 dark:text-rose-200" />
                <p className="font-medium">Match To Character</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Link this persona to a character mini-library.
                </p>
              </button>
            </CardContent>
          </Card>

          <Tabs defaultValue="identity">
            <TabsList className="flex-wrap">
              <TabsTrigger value="identity">Identity</TabsTrigger>
              <TabsTrigger value="aesthetic">Aesthetic</TabsTrigger>
              <TabsTrigger value="voice">Voice</TabsTrigger>
              <TabsTrigger value="links">Links</TabsTrigger>
              <TabsTrigger value="notes">PHI Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="identity" className="mt-4 space-y-5">
              <Card>
                <CardHeader>
                  <CardTitle>Visible Persona Shape</CardTitle>
                  <CardDescription>
                    These fields become the exported persona block. Keep them
                    playable and observable rather than clinical.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {fieldGroups.map((group) => (
                    <div key={group.title} className="grid gap-3 md:grid-cols-2">
                      {group.fields.map(([key, label]) => (
                        <label key={key} className="grid gap-1.5 text-sm">
                          <span className="font-medium">{label}</span>
                          <Input
                            value={values[key]}
                            onChange={handleInputChange(key)}
                          />
                        </label>
                      ))}
                    </div>
                  ))}
                  <PersonaTextarea
                    label="Appearance"
                    value={values.appearance}
                    onChange={handleInputChange("appearance")}
                  />
                  <PersonaTextarea
                    label="Usual Outfit"
                    value={values.outfit}
                    onChange={handleInputChange("outfit")}
                  />
                  <PersonaTextarea
                    label="Personality"
                    value={values.personality}
                    onChange={handleInputChange("personality")}
                  />
                  <PersonaTextarea
                    label="Behaviour and Habits"
                    value={values.behaviour}
                    onChange={handleInputChange("behaviour")}
                  />
                  <PersonaTextarea
                    label="Intimacy"
                    helper="Private compatibility data. The character should not magically know this at first meeting."
                    value={values.intimacy}
                    onChange={handleInputChange("intimacy")}
                  />
                  <PersonaTextarea
                    label="Boundaries"
                    value={values.boundaries}
                    onChange={handleInputChange("boundaries")}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="aesthetic" className="mt-4 space-y-5">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Blend data-icon="inline-start" />
                    Fashion Aesthetic Builder
                  </CardTitle>
                  <CardDescription>
                    Blend a primary style with a secondary accent, then apply it
                    to the persona&apos;s aesthetic and outfit fields.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-3 md:grid-cols-3">
                    <FashionSelect
                      label="Primary Style"
                      value={dominantAestheticId}
                      onChange={setDominantAestheticId}
                    />
                    <FashionSelect
                      label="Secondary Accent"
                      value={secondaryAestheticId}
                      onChange={setSecondaryAestheticId}
                    />
                    <label className="grid gap-1.5 text-sm">
                      <span className="font-medium">Season / Context</span>
                      <select
                        value={fashionSeason}
                        onChange={(event) =>
                          setFashionSeason(
                            event.currentTarget.value as FashionSeasonContext,
                          )
                        }
                        className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                      >
                        <option value="spring">Spring</option>
                        <option value="summer">Summer</option>
                        <option value="autumn">Autumn</option>
                        <option value="winter">Winter</option>
                        <option value="night_out">Night Out</option>
                        <option value="festival">Festival</option>
                        <option value="beach">Beach</option>
                      </select>
                    </label>
                  </div>

                  <div className="grid gap-3 rounded-lg border bg-background/70 p-4 text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{fashionBlend.hybridName}</Badge>
                      <Badge variant="outline">
                        {Math.round(fashionBlend.dominantWeight * 100)} /{" "}
                        {Math.round(fashionBlend.secondaryWeight * 100)}
                      </Badge>
                    </div>
                    <p>
                      <span className="font-medium">Silhouette:</span>{" "}
                      {fashionBlend.silhouette}
                    </p>
                    <p>
                      <span className="font-medium">Fabrics:</span>{" "}
                      {fashionBlend.fabrics}
                    </p>
                    <p>
                      <span className="font-medium">Palette:</span>{" "}
                      {fashionBlend.palette}
                    </p>
                    <p>
                      <span className="font-medium">Street-style prompt:</span>{" "}
                      {fashionBlend.streetStylePrompt}
                    </p>
                  </div>

                  <Button onClick={applyFashionBlend}>
                    Apply Blend to Persona
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="voice" className="mt-4 space-y-5">
              <Card>
                <CardHeader>
                  <CardTitle>Speech and Examples</CardTitle>
                  <CardDescription>
                    Give the model phrasing, habits, and response texture
                    without turning the persona into a psychology report.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <PersonaTextarea
                    label="Speech"
                    value={values.speech}
                    onChange={handleInputChange("speech")}
                  />
                  <PersonaTextarea
                    label="Speech Quirks"
                    value={values.speechQuirks}
                    onChange={handleInputChange("speechQuirks")}
                  />
                  <PersonaTextarea
                    label="Example Dialogue"
                    value={values.exampleDialogue}
                    onChange={handleInputChange("exampleDialogue")}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="links" className="mt-4 space-y-5">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link2 data-icon="inline-start" />
                    Character Links
                  </CardTitle>
                  <CardDescription>
                    A character can have multiple linked personas. One can be
                    marked as the default without removing the others.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="grid gap-1.5 text-sm">
                      <span className="font-medium">Source Character Name</span>
                      <Input
                        value={values.sourceCharacterName}
                        onChange={handleInputChange("sourceCharacterName")}
                        placeholder="Optional imported/generated card name"
                      />
                    </label>
                    <label className="grid gap-1.5 text-sm">
                      <span className="font-medium">Source Character ID</span>
                      <Input
                        value={values.sourceCharacterCardId}
                        onChange={handleInputChange("sourceCharacterCardId")}
                        placeholder="Optional card id"
                      />
                    </label>
                    <label className="grid gap-1.5 text-sm">
                      <span className="font-medium">Linked Character Name</span>
                      <Input
                        value={values.linkedCharacterName}
                        onChange={handleInputChange("linkedCharacterName")}
                        placeholder="Character this persona should appear under"
                      />
                    </label>
                    <label className="grid gap-1.5 text-sm">
                      <span className="font-medium">Linked Character ID</span>
                      <Input
                        value={values.linkedCharacterCardId}
                        onChange={handleInputChange("linkedCharacterCardId")}
                        placeholder="Optional saved card id"
                      />
                    </label>
                  </div>
                  <label className="flex items-center gap-3 rounded-lg border p-3 text-sm">
                    <input
                      type="checkbox"
                      checked={values.setAsCharacterDefault}
                      onChange={(event) =>
                        updateValue(
                          "setAsCharacterDefault",
                          event.currentTarget.checked,
                        )
                      }
                    />
                    Set as default persona for this character
                  </label>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      Runtime persona selection priority
                    </p>
                    <div className="grid gap-2">
                      {personaSelectionPriority.map((rule, index) => (
                        <div
                          key={rule}
                          className="flex items-center gap-2 rounded-lg border bg-background/70 px-3 py-2 text-sm"
                        >
                          <Badge variant="secondary">{index + 1}</Badge>
                          {rule}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="mt-4 space-y-5">
              <Card>
                <CardHeader>
                  <CardTitle>PHI / Impersonation Notes</CardTitle>
                  <CardDescription>
                    These are not normal in-scene facts. They only support
                    explicit requests to help write as the user persona.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PersonaTextarea
                    label="Notes"
                    value={values.notes}
                    onChange={handleInputChange("notes")}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
          <Card className="bg-card/85">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BadgeCheck data-icon="inline-start" />
                Persona Card Preview
              </CardTitle>
              <CardDescription>
                Rich data is stored, but only the playable block below should be
                sent as the normal user persona.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{values.creationMode}</Badge>
                {personaCard.linkedCharacters.length ? (
                  <Badge variant="outline">
                    {personaCard.linkedCharacters.length} linked character
                  </Badge>
                ) : null}
              </div>
              <pre className="max-h-[32rem] overflow-auto rounded-lg border bg-background p-4 text-xs leading-5 whitespace-pre-wrap">
                {promptPreview || "# {{user}} Persona"}
              </pre>
            </CardContent>
          </Card>

          <Card className="bg-card/85">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImagePlus data-icon="inline-start" />
                Persona Image
              </CardTitle>
              <CardDescription>
                Persona Studio can attach an avatar; generation will route
                through Image Generation.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Input
                value={values.avatarImagePath}
                onChange={handleInputChange("avatarImagePath")}
                placeholder="Local image path or future asset id"
              />
              <Button variant="outline" disabled>
                Generate Persona Image
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card/85">
            <CardHeader>
              <CardTitle>Starter Example</CardTitle>
              <CardDescription>
                Load the test persona shape as a starting point.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={() => loadExample(0)}
                className="w-full"
              >
                Load {personaExamples[0].label}
              </Button>
            </CardContent>
          </Card>

          {phiPreview ? (
            <Card className="bg-card/85">
              <CardHeader>
                <CardTitle>PHI Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="max-h-48 overflow-auto rounded-lg border bg-background p-3 text-xs leading-5 whitespace-pre-wrap">
                  {phiPreview}
                </pre>
              </CardContent>
            </Card>
          ) : null}
        </aside>
      </div>
    </StudioShell>
  );
}

function mergeCommaText(current: string, nextValues: string[]): string {
  const merged = new Set(
    current
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  );

  nextValues.forEach((value) => {
    if (value.trim()) {
      merged.add(value.trim());
    }
  });

  return [...merged].join(", ");
}

function FashionSelect({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
      >
        {fashionAesthetics.map((aesthetic) => (
          <option key={aesthetic.id} value={aesthetic.id}>
            {aesthetic.name}
          </option>
        ))}
      </select>
    </label>
  );
}

function PersonaTextarea({
  helper,
  label,
  onChange,
  value,
}: {
  helper?: string;
  label: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  value: string;
}) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium">{label}</span>
      {helper ? (
        <span className="text-xs text-muted-foreground">{helper}</span>
      ) : null}
      <Textarea value={value} onChange={onChange} className="min-h-28" />
    </label>
  );
}
