"use client";

import { ChangeEvent, useState } from "react";

import { downloadUint8Array } from "@/lib/browser/downloadUint8Array";
import { createCharacterCardExportFileName } from "@/lib/character-card/createCharacterCardExportFileName";
import { createEmptyCharacterCardFormValues } from "@/lib/character-card/createEmptyCharacterCardFormValues";
import { exportCharacterCardPngData } from "@/lib/character-card/exportCharacterCardPngData";
import { createNativeCharacterCardImportData } from "@/lib/character-card/createNativeCharacterCardImportData";
import { importCharacterCardPngData } from "@/lib/character-card/importCharacterCardPngData";
import { mergeCharacterCardIntakeValues } from "@/lib/character-card/mergeCharacterCardIntakeValues";
import { parseMessyCharacterIntake } from "@/lib/character-card/parseMessyCharacterIntake";
import { readFileAsUint8Array } from "@/lib/character-card/readFileAsUint8Array";
import { CharacterCardFormValues } from "@/types/character-card/CharacterCardFormValues";
import { CharacterCardImportSummary } from "@/types/character-card/CharacterCardImportSummary";
import { CharacterCardPayload } from "@/types/character-card/CharacterCardPayload";
import { UseCharacterCardImportExportResult } from "@/types/character-card/UseCharacterCardImportExportResult";

export function useCharacterCardImportExport(): UseCharacterCardImportExportResult {
  const [cardValues, setCardValues] = useState<CharacterCardFormValues>(
    createEmptyCharacterCardFormValues,
  );
  const [error, setError] = useState<string | null>(null);
  const [intakeText, setIntakeText] = useState("");
  const [importSummary, setImportSummary] =
    useState<CharacterCardImportSummary | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sourceCard, setSourceCard] = useState<CharacterCardPayload | null>(null);
  const [sourcePngData, setSourcePngData] = useState<Uint8Array | null>(null);

  function updateIntakeText(value: string) {
    setIntakeText(value);
  }

  function routeIntakeText() {
    const routeResult = parseMessyCharacterIntake(intakeText);

    if (!routeResult.fieldNames.length) {
      setError("Paste character material before routing intake.");
      return routeResult;
    }

    setError(null);
    setCardValues((currentValues) =>
      mergeCharacterCardIntakeValues(currentValues, routeResult.values),
    );

    return routeResult;
  }

  function updateCardField(field: keyof CharacterCardFormValues, value: string) {
    setCardValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  }

  function addAlternateOpening() {
    setCardValues((currentValues) => ({
      ...currentValues,
      alternateOpenings: [
        ...currentValues.alternateOpenings,
        { scenario: "", firstMessage: "" },
      ],
    }));
  }

  function deleteAlternateOpening(index: number) {
    setCardValues((currentValues) => ({
      ...currentValues,
      alternateOpenings: currentValues.alternateOpenings.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  }

  function updateAlternateOpening(
    index: number,
    field: "scenario" | "firstMessage",
    value: string,
  ) {
    setCardValues((currentValues) => ({
      ...currentValues,
      alternateOpenings: currentValues.alternateOpenings.map((opening, itemIndex) =>
        itemIndex === index ? { ...opening, [field]: value } : opening,
      ),
    }));
  }

  function addGroupGreeting() {
    setCardValues((currentValues) => ({
      ...currentValues,
      groupOnlyGreetings: [...currentValues.groupOnlyGreetings, ""],
    }));
  }

  function deleteGroupGreeting(index: number) {
    setCardValues((currentValues) => ({
      ...currentValues,
      groupOnlyGreetings: currentValues.groupOnlyGreetings.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  }

  function updateGroupGreeting(index: number, value: string) {
    setCardValues((currentValues) => ({
      ...currentValues,
      groupOnlyGreetings: currentValues.groupOnlyGreetings.map((greeting, itemIndex) =>
        itemIndex === index ? value : greeting,
      ),
    }));
  }

  async function importPngFile(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];

    if (!file) {
      setIsProcessing(false);
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      const pngData = await readFileAsUint8Array(file);
      const importedCard = importCharacterCardPngData(file.name, pngData);

      setSourcePngData(pngData);
      setSourceCard(importedCard.card);
      setCardValues(importedCard.formValues);
      setImportSummary(importedCard.summary);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Could not import character card metadata.";

      setError(message);
    } finally {
      setIsProcessing(false);
      input.value = "";
    }
  }

  function importNativeCard(card: CharacterCardPayload, fileName: string) {
    const importedCard = createNativeCharacterCardImportData(fileName, card);

    setError(null);
    setSourcePngData(null);
    setSourceCard(importedCard.card);
    setCardValues(importedCard.formValues);
    setImportSummary(importedCard.summary);
  }

  function exportPngFile() {
    if (!sourceCard || !sourcePngData) {
      setError("Import a PNG character card before exporting.");
      return;
    }

    const updatedPngData = exportCharacterCardPngData(
      sourcePngData,
      sourceCard,
      cardValues,
    );
    const fileName = createCharacterCardExportFileName(
      cardValues,
      importSummary?.fileName ?? "character-card.png",
    );

    downloadUint8Array(updatedPngData, fileName, "image/png");
  }

  return {
    cardValues,
    error,
    importSummary,
    intakeText,
    isExportDisabled: !sourceCard || !sourcePngData,
    isProcessing,
    updateIntakeText,
    routeIntakeText,
    updateCardField,
    addAlternateOpening,
    deleteAlternateOpening,
    updateAlternateOpening,
    addGroupGreeting,
    deleteGroupGreeting,
    updateGroupGreeting,
    importNativeCard,
    importPngFile,
    exportPngFile,
  };
}
