import { StudioSectionPage } from "@/components/studio-section-page";
import { sectionBlueprints } from "@/lib/studio/sections";

export default function SettingsPage() {
  return <StudioSectionPage {...sectionBlueprints.settings} />;
}
