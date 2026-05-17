export const MAX_IMAGE_SIZE_BYTES = 20 * 1024 * 1024;
export const COMPRESSION_THRESHOLD_BYTES = 1024 * 1024;
export const MAX_COMPRESSED_IMAGE_EDGE = 1920;
export const COMPRESSED_IMAGE_QUALITY = 0.8;

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/heic",
  "image/heif",
] as const;

export interface ProcessedImageItem {
  id: string;
  fileName: string;
  originalType: string;
  originalSize: number;
  compressedSize: number;
  imageDataUrl: string;
  blurhash: string;
  photoDate?: string;
  wasCompressed: boolean;
}

export interface PendingImageBatch {
  imageUrls: string[];
  blurhashes: string[];
  photoDate?: string;
  items: ProcessedImageItem[];
}
