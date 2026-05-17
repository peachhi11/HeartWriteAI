declare module "png-chunks-extract" {
  function extractChunks(
    data: Uint8Array,
  ): import("../character-card/PngChunk").PngChunk[];

  export = extractChunks;
}
