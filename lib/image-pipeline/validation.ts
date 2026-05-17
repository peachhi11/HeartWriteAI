import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE_BYTES } from "./types";

export function validateImageFile(file: File): string | null {
  if (!file.type.startsWith("image/")) {
    return "Only image files can be imported.";
  }

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type as typeof ACCEPTED_IMAGE_TYPES[number])) {
    return "Supported image formats are JPG, PNG, GIF, WebP, HEIC, and HEIF.";
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return "Image is too large. Max size is 20MB.";
  }

  return null;
}
