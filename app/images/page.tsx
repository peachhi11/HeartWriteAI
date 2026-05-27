import { ImageIntakePreview } from "@/components/image-pipeline/image-intake-preview";
import { StudioShell } from "@/components/studio-shell";

export default function ImagesPage() {
  return (
    <StudioShell
      eyebrow="Image Generation"
      title="Image Studio"
      subtitle="Prepare visual assets, avatars, and card art workflows."
    >
      <ImageIntakePreview />
    </StudioShell>
  );
}
