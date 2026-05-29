"use client";

import { useState } from "react";
import { FileImage, Loader2, ShieldAlert, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  pickAndParseCharacterCardWithAvatar,
  type CharacterImportPayload,
} from "@/lib/tauri/characterCardParser";

interface CardParserUploaderProps {
  onCardSuccessfullyParsed: (payload: CharacterImportPayload) => void;
}

export function CardParserUploader(props: CardParserUploaderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [successText, setSuccessText] = useState<string | null>(null);

  async function handlePickAndParseFile() {
    setIsProcessing(true);
    setErrorText(null);
    setSuccessText(null);

    try {
      const parsedPayload = await pickAndParseCharacterCardWithAvatar();
      props.onCardSuccessfullyParsed(parsedPayload);
      setSuccessText(`Imported ${parsedPayload.metadata.name}`);
    } catch (caughtError) {
      setErrorText(
        caughtError instanceof Error ? caughtError.message : String(caughtError),
      );
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="grid gap-2">
      <Button
        className="h-auto justify-start gap-3 border-dashed px-4 py-4 text-left"
        disabled={isProcessing}
        onClick={handlePickAndParseFile}
        type="button"
        variant="outline"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md border bg-background">
          {isProcessing ? (
            <Loader2 className="size-4 animate-spin text-primary" />
          ) : (
            <FileImage className="size-4 text-primary" />
          )}
        </span>
        <span className="grid min-w-0 gap-1">
          <span className="flex items-center gap-2 text-sm font-semibold">
            {isProcessing ? "Decoding image buffer..." : "Import character PNG"}
            {!isProcessing ? <Upload className="size-3.5" /> : null}
          </span>
          <span className="text-xs font-normal text-muted-foreground">
            Reads SillyTavern V2/V3 `chara` or `ccv3` metadata from PNG chunks.
          </span>
        </span>
      </Button>

      {successText ? (
        <div className="flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-950/20 px-3 py-2 text-xs text-emerald-300">
          <span className="size-2 rounded-full bg-emerald-400" />
          <span>{successText}</span>
        </div>
      ) : null}

      {errorText ? (
        <div className="rounded-md border border-red-500/40 bg-red-950/20 px-3 py-2 text-xs text-red-300">
          <div className="mb-1 flex items-center gap-1.5 font-black uppercase tracking-wide text-red-300">
            <ShieldAlert className="size-3.5" />
            Security shield intercept
          </div>
          <p className="font-mono leading-relaxed text-red-200/90">
            {errorText}
          </p>
        </div>
      ) : null}
    </div>
  );
}
