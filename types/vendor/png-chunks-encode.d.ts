declare module "png-chunks-encode" {
  function encodeChunks(
    chunks: import("../character-card/PngChunk").PngChunk[],
  ): Uint8Array;

  export = encodeChunks;
}
