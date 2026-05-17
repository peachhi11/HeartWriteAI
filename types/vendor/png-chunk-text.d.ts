declare module "png-chunk-text" {
  export function encode(
    keyword: string,
    text: string,
  ): import("../character-card/PngChunk").PngChunk;
  export function decode(
    data: Uint8Array,
  ): import("../character-card/PngTextChunk").PngTextChunk;
}
