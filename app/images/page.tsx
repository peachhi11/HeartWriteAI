import { ImageIntakePreview } from "@/components/image-pipeline/image-intake-preview";
import { StudioShell } from "@/components/studio-shell";

export default function ImagesPage() {
  return (
    <StudioShell
      eyebrow="Images"
      title="Image Studio"
      subtitle="Prepare avatars, character art, and card images."
    >
      <ImageIntakePreview />
    </StudioShell>
  );
}
