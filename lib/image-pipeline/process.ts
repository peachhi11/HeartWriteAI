import { encodeImageToBlurhash } from "./blurhash";
import { compressImage } from "./compression";
import { extractPhotoDate } from "./exif";
import { extractCharacterCardMetadata } from "./extractCharacterCardMetadata";
import { PendingImageBatch, ProcessedImageItem } from "./types";
import { validateImageFile } from "./validation";

export async function processImageFile(file: File): Promise<ProcessedImageItem> {
  const validationError = validateImageFile(file);

  if (validationError) {
    throw new Error(validationError);
  }

  const [{ dataUrl, size, wasCompressed }, photoDate, characterCard] = await Promise.all([
    compressImage(file),
    extractPhotoDate(file),
    extractCharacterCardMetadata(file),
  ]);

  let blurhash = "";

  try {
    blurhash = await encodeImageToBlurhash(dataUrl);
  } catch {
    // Non-critical: upload/import must still work without a placeholder hash.
  }

  return {
    id: crypto.randomUUID(),
    fileName: file.name,
    originalType: file.type,
    originalSize: file.size,
    compressedSize: size,
    imageDataUrl: dataUrl,
    blurhash,
    photoDate,
    characterCard,
    wasCompressed,
  };
}

export async function processImageFiles(files: FileList | File[]) {
  const items = await Promise.all(Array.from(files).map(processImageFile));

  return createPendingImageBatch(items);
}

export function createPendingImageBatch(items: ProcessedImageItem[]): PendingImageBatch {
  return {
    imageUrls: items.map((item) => item.imageDataUrl),
    blurhashes: items.map((item) => item.blurhash),
    photoDate: items[0]?.photoDate,
    items,
  };
}
