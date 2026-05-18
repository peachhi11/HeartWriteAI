export function createStandardPngDestinationPath(filePath: string): string {
  const extensionStartIndex = filePath.lastIndexOf(".");

  if (extensionStartIndex <= 0) {
    return `${filePath}.standard.png`;
  }

  return `${filePath.slice(0, extensionStartIndex)}.standard.png`;
}
