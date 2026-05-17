"use client";

import { ChangeEvent, useState } from "react";
import Image from "next/image";
import { Blurhash } from "react-blurhash";
import { ImagePlus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  processImageFiles,
  ProcessedImageItem,
} from "@/lib/image-pipeline";
import { getCharacterCardDisplayName } from "@/lib/character-card/getCharacterCardDisplayName";

function formatBytes(bytes: number) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export function ImageIntakePreview() {
  const [items, setItems] = useState<ProcessedImageItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.currentTarget.files;

    if (!files?.length) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const batch = await processImageFiles(files);
      setItems(batch.items);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Could not process selected image.";

      setError(message);
    } finally {
      setIsProcessing(false);
      event.currentTarget.value = "";
    }
  }

  return (
    <Card className="border bg-card/85 shadow-2xl backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImagePlus data-icon="inline-start" />
          Image intake pipeline
        </CardTitle>
        <CardDescription>
          Browser-side validation, compression, blurhash placeholders, and EXIF
          date extraction for future avatars and embedded character-card PNGs.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="outline">
            <label>
              {isProcessing ? "Processing..." : "Choose image"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,image/heic,image/heif"
                className="sr-only"
                multiple
                onChange={handleFileChange}
                disabled={isProcessing}
              />
            </label>
          </Button>
          <p className="text-xs text-muted-foreground">
            Max 20MB each. Images over 1MB compress to JPEG at 1920px max edge.
          </p>
        </div>

        {error ? (
          <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        {items.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {items.map((item) => (
              <div key={item.id} className="rounded-2xl border bg-background/70 p-3">
                <div className="mb-3 h-28 overflow-hidden rounded-xl border bg-muted">
                  {item.blurhash ? (
                    <Blurhash
                      hash={item.blurhash}
                      width="100%"
                      height="100%"
                      resolutionX={32}
                      resolutionY={32}
                      punch={1}
                    />
                  ) : (
                    <Image
                      src={item.imageDataUrl}
                      alt={item.fileName}
                      width={384}
                      height={224}
                      unoptimized
                      className="size-full object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                  <p className="truncate font-medium text-foreground">{item.fileName}</p>
                  <p>
                    {formatBytes(item.originalSize)} → {formatBytes(item.compressedSize)}
                    {item.wasCompressed ? " compressed" : " original"}
                  </p>
                  <p>{item.photoDate ? `Photo date: ${item.photoDate}` : "No date found"}</p>
                  <p>{item.blurhash ? "Blurhash generated" : "Blurhash unavailable"}</p>
                  {item.characterCard ? (
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">
                        {item.characterCard.source === "ccv3" ? "CCV3" : "Legacy card"}
                      </Badge>
                      <span className="truncate text-foreground">
                        {getCharacterCardDisplayName(item.characterCard.card) ??
                          "Unnamed card"}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
