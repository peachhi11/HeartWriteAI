"use client";

import { Save } from "lucide-react";
import { useState } from "react";

import { exportGeneratedCardToDesktop } from "@/lib/character-card/exportGeneratedCardToDesktop";
import { CharacterCardData } from "@/lib/character-card/generator";

interface CharacterCardPreviewProps {
  cardData: CharacterCardData;
  greeting: string;
}

export default function CharacterCardPreview({
  cardData,
  greeting,
}: CharacterCardPreviewProps) {
  const [exportStatus, setExportStatus] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  async function handleDesktopExport() {
    setIsExporting(true);
    setExportStatus(null);

    try {
      const result = await exportGeneratedCardToDesktop({ cardData, greeting });
      setExportStatus(`Saved ${result.fileName} to Desktop.`);
    } catch (caughtError) {
      setExportStatus(
        caughtError instanceof Error
          ? caughtError.message
          : "Desktop export failed.",
      );
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-2xl rounded-lg border border-zinc-800 bg-zinc-900/60 p-5 text-zinc-100 shadow-xl">
      <div className="mb-4 flex items-start justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-violet-300">
            {"{{char}}"}: {cardData.given_name} {cardData.surname}
          </h2>
          <p className="mt-1 text-xs text-zinc-400">
            Age: {cardData.age} | Sign: {cardData.zodiac}
          </p>
          {cardData.nationality ? (
            <p className="mt-1 text-[11px] text-zinc-500">
              Passport: {cardData.nationality.passportCountry} |{" "}
              {cardData.nationality.legalStatus.replace(/_/g, " ")}
            </p>
          ) : null}
          {cardData.occupation ? (
            <p className="mt-1 text-[11px] text-zinc-500">
              Work: {cardData.occupation.jobTitle} |{" "}
              {cardData.occupation.authorityDynamic}
            </p>
          ) : null}
          {cardData.relationships?.length ? (
            <p className="mt-1 text-[11px] text-zinc-500">
              NPC: {cardData.relationships[0].npcName} |{" "}
              {cardData.relationships[0].romanceFunction.replace(/_/g, " ")}
            </p>
          ) : null}
          {cardData.relationshipStatus ? (
            <p className="mt-1 text-[11px] text-zinc-500">
              Status: {cardData.relationshipStatus.currentLabel.replace(/_/g, " ")} |{" "}
              {cardData.relationshipStatus.scandalFactor.replace(/_/g, " ")}
            </p>
          ) : null}
          {cardData.kink?.nsfwEnabled ? (
            <p className="mt-1 text-[11px] text-zinc-500">
              Adult: {cardData.kink.primaryRole} |{" "}
              {cardData.kink.intensityLevel.replace(/_/g, " ")}
            </p>
          ) : null}
          {cardData.fetish?.fetishEnabled ? (
            <p className="mt-1 text-[11px] text-zinc-500">
              Fetish: {cardData.fetish.anatomicalFocus.replace(/_/g, " ")} |{" "}
              {cardData.fetish.situationalTrigger.replace(/_/g, " ")}
            </p>
          ) : null}
          {cardData.intimacyStyle ? (
            <p className="mt-1 text-[11px] text-zinc-500">
              Intimacy: {cardData.intimacyStyle.expressionType.replace(/_/g, " ")} |{" "}
              {cardData.intimacyStyle.aftercareStyle.replace(/_/g, " ")}
            </p>
          ) : null}
          {cardData.turnOffs ? (
            <p className="mt-1 text-[11px] text-zinc-500">
              Hardline: {cardData.turnOffs.dynamicHardlines.replace(/_/g, " ")}
            </p>
          ) : null}
          {cardData.scenario ? (
            <p className="mt-1 text-[11px] text-zinc-500">
              Scene: {cardData.scenario.settingType.replace(/_/g, " ")} |{" "}
              {cardData.scenario.plotHook.replace(/_/g, " ")}
            </p>
          ) : null}
          {cardData.firstMessage ? (
            <p className="mt-1 text-[11px] text-zinc-500">
              Opening: {cardData.firstMessage.entryPoint.replace(/_/g, " ")} |{" "}
              {cardData.firstMessage.userCallToAction.replace(/_/g, " ")}
            </p>
          ) : null}
          {cardData.alternateGreetings?.length ? (
            <p className="mt-1 text-[11px] text-zinc-500">
              Alt Greetings: {cardData.alternateGreetings.length} fork
              {cardData.alternateGreetings.length === 1 ? "" : "s"}
            </p>
          ) : null}
          {cardData.groupGreetings?.length ? (
            <p className="mt-1 text-[11px] text-zinc-500">
              Group Greetings: {cardData.groupGreetings.length} room
              {cardData.groupGreetings.length === 1 ? "" : "s"}
            </p>
          ) : null}
          {cardData.groupAlternateGreetings?.length ? (
            <p className="mt-1 text-[11px] text-zinc-500">
              Group AUs: {cardData.groupAlternateGreetings.length} fork
              {cardData.groupAlternateGreetings.length === 1 ? "" : "s"}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => void handleDesktopExport()}
          disabled={isExporting}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-700 bg-zinc-950 px-3 text-xs font-semibold text-zinc-300 transition hover:border-violet-500/50 hover:text-violet-200 disabled:opacity-50"
        >
          <Save className="h-3.5 w-3.5" aria-hidden="true" />
          {isExporting ? "Saving..." : "Export JSON"}
        </button>
      </div>

      <div className="max-h-60 overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4">
        <p className="whitespace-pre-line font-mono text-sm leading-relaxed text-zinc-300">
          {greeting}
        </p>
      </div>

      {exportStatus ? (
        <p className="mt-3 rounded-md border border-zinc-800 bg-zinc-950/70 p-2 text-xs text-zinc-400">
          {exportStatus}
        </p>
      ) : null}
    </section>
  );
}
