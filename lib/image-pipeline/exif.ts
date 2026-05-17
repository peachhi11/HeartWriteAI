export async function extractPhotoDate(file: File) {
  try {
    const exifr = await import("exifr");
    const exif = await exifr.parse(file, ["DateTimeOriginal"]);

    if (exif?.DateTimeOriginal instanceof Date) {
      return exif.DateTimeOriginal.toISOString();
    }
  } catch {
    // EXIF is optional and often stripped from screenshots or shared images.
  }

  if (file.lastModified) {
    return new Date(file.lastModified).toISOString();
  }

  return new Date().toISOString();
}
