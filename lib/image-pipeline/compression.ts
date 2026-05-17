import {
  COMPRESSED_IMAGE_QUALITY,
  COMPRESSION_THRESHOLD_BYTES,
  MAX_COMPRESSED_IMAGE_EDGE,
} from "./types";

interface CompressionResult {
  dataUrl: string;
  size: number;
  wasCompressed: boolean;
}

export function needsCompression(file: File) {
  return file.size > COMPRESSION_THRESHOLD_BYTES;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("Could not read image file."));
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not decode image."));
    image.src = dataUrl;
  });
}

function estimateDataUrlBytes(dataUrl: string) {
  const base64 = dataUrl.split(",", 2)[1] ?? "";

  return Math.floor((base64.length * 3) / 4);
}

export async function compressImage(file: File): Promise<CompressionResult> {
  const originalDataUrl = await readFileAsDataUrl(file);

  if (!needsCompression(file)) {
    return {
      dataUrl: originalDataUrl,
      size: file.size,
      wasCompressed: false,
    };
  }

  const image = await loadImage(originalDataUrl);
  const longestSide = Math.max(image.naturalWidth, image.naturalHeight);
  const scale = Math.min(1, MAX_COMPRESSED_IMAGE_EDGE / longestSide);
  const width = Math.round(image.naturalWidth * scale);
  const height = Math.round(image.naturalHeight * scale);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    return {
      dataUrl: originalDataUrl,
      size: file.size,
      wasCompressed: false,
    };
  }

  canvas.width = width;
  canvas.height = height;
  context.drawImage(image, 0, 0, width, height);

  const compressedDataUrl = canvas.toDataURL("image/jpeg", COMPRESSED_IMAGE_QUALITY);

  return {
    dataUrl: compressedDataUrl,
    size: estimateDataUrlBytes(compressedDataUrl),
    wasCompressed: true,
  };
}
