import { encode } from "blurhash";

function loadImage(dataUrl: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not decode image for blurhash."));
    image.src = dataUrl;
  });
}

export async function encodeImageToBlurhash(dataUrl: string) {
  const image = await loadImage(dataUrl);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });
  const width = 32;
  const height = Math.max(1, Math.round((image.naturalHeight / image.naturalWidth) * width));

  if (!context) {
    throw new Error("Canvas context is unavailable.");
  }

  canvas.width = width;
  canvas.height = height;
  context.drawImage(image, 0, 0, width, height);

  const imageData = context.getImageData(0, 0, width, height);

  return encode(imageData.data, width, height, 4, 3);
}
