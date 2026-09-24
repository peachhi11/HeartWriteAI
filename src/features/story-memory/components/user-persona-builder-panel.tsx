import { Check, Copy, Sparkles, UsersRound } from "lucide-react";

import { SectionPanel } from "@/features/story-memory/components/section-panel";
import type { LoadedCharacterCard } from "@/features/story-memory/utils/character-card-parser";

export type UserPersonaDraft = {
  boundaries: string;
  cardFitNotes: string;
  connectionToCharacter: string;
  displayName: string;
  openingAngle: string;
  roleInStory: string;
  selfConcept: string;
  whatUserKnows: string;
};

export const emptyUserPersonaDraft: UserPersonaDraft = {
  boundaries: "",
  cardFitNotes: "",
  connectionToCharacter: "",
  displayName: "{{user}}",
  openingAngle: "",
  roleInStory: "",
  selfConcept: "",
  whatUserKnows: "",
};

export function formatUserPersonaDraft(draft: UserPersonaDraft) {
  return compactLines([
    `[${draft.displayName || "{{user}}"} Persona]`,
    draft.roleInStory ? `Role: ${draft.roleInStory}` : "",
    draft.selfConcept ? `Self-concept: ${draft.selfConcept}` : "",
    draft.connectionToCharacter ? `Connection to {{char}}: ${draft.connectionToCharacter}` : "",
    draft.whatUserKnows ? `Starting knowledge: ${draft.whatUserKnows}` : "",
    draft.openingAngle ? `Opening angle: ${draft.openingAngle}` : "",
    draft.boundaries ? `Boundaries:\n${draft.boundaries}` : "",
    draft.cardFitNotes ? `Card-fit notes:\n${draft.cardFitNotes}` : "",
  ]).join("\n\n");
}

export function UserPersonaBuilderPanel({
  copied,
  draft,
  loadedCard,
  onChange,
  onCopy,
  onGenerate,
}: {
  copied: boolean;
  draft: UserPersonaDraft;
  loadedCard: LoadedCharacterCard | null;
  onChange: (field: keyof UserPersonaDraft, value: string) => void;
  onCopy: () => void;
  onGenerate: () => void;
}) {
  const personaPreview = formatUserPersonaDraft(draft);

  return (
    <SectionPanel title="User Persona Builder" icon={UsersRound}>
      <div className="grid gap-4">
        <div className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm leading-6 text-zinc-600">
          {loadedCard ? (
            <>
              Source card: <span className="font-semibold text-zinc-900">{loadedCard.name ?? "Unnamed card"}</span>.
              Build what {"{{user}}"} brings to that established card without taking over {"{{char}}"}.
            </>
          ) : (
            <>
              Load a character card first for the strongest draft. You can still edit these fields
              manually, but persona-fit works best when the card is the source.
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            className="flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-medium text-white hover:bg-zinc-800"
            onClick={onGenerate}
            type="button"
          >
            <Sparkles className="size-4" aria-hidden="true" />
            Generate From Card
          </button>
          <button
            className="flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            onClick={onCopy}
            type="button"
          >
            {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
            {copied ? "Copied" : "Copy Persona"}
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <ControlledField
            label="Persona name"
            onChange={(value) => onChange("displayName", value)}
            placeholder="{{user}}"
            value={draft.displayName}
          />
          <ControlledField
            label="Role in story"
            onChange={(value) => onChange("roleInStory", value)}
            placeholder="Why this user player belongs in the card's premise"
            value={draft.roleInStory}
          />
          <ControlledTextArea
            label="Self-concept"
            onChange={(value) => onChange("selfConcept", value)}
            placeholder="What {{user}} believes about themself at the start"
            value={draft.selfConcept}
          />
          <ControlledTextArea
            label="Connection to {{char}}"
            onChange={(value) => onChange("connectionToCharacter", value)}
            placeholder="Why {{char}} and {{user}} are in each other's orbit"
            value={draft.connectionToCharacter}
          />
          <ControlledTextArea
            label="{{user}} knowledge"
            onChange={(value) => onChange("whatUserKnows", value)}
            placeholder="What {{user}} knows, suspects, or is hiding at the start"
            value={draft.whatUserKnows}
          />
          <ControlledTextArea
            label="Opening angle"
            onChange={(value) => onChange("openingAngle", value)}
            placeholder="How {{user}} can enter the opening with agency"
            value={draft.openingAngle}
          />
          <ControlledTextArea
            label="Persona boundaries"
            onChange={(value) => onChange("boundaries", value)}
            placeholder="What the AI must not write for {{user}}"
            value={draft.boundaries}
          />
          <ControlledTextArea
            label="Card-fit notes"
            onChange={(value) => onChange("cardFitNotes", value)}
            placeholder="What the loaded card already controls and what the persona should fit around"
            value={draft.cardFitNotes}
          />
        </div>

        <article className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 bg-zinc-50 px-3 py-3">
            <h3 className="text-sm font-semibold text-zinc-950">Persona Preview</h3>
            <p className="mt-1 text-xs leading-5 text-zinc-500">
              Paste-ready draft, still sessional until we add persistence.
            </p>
          </div>
          <pre className="max-h-80 overflow-auto whitespace-pre-wrap bg-zinc-950 p-3 text-sm leading-6 text-zinc-100">
            {personaPreview || "Generate or edit persona fields to build the preview."}
          </pre>
        </article>
      </div>
    </SectionPanel>
  );
}

function ControlledField({
  label,
  onChange,
  placeholder,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium text-zinc-700">{label}</span>
      <input
        className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-zinc-950"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </label>
  );
}

function ControlledTextArea({
  label,
  onChange,
  placeholder,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium text-zinc-700">{label}</span>
      <textarea
        className="min-h-24 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-zinc-950"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </label>
  );
}

function compactLines(lines: string[]) {
  return lines.filter((line) => line.trim().length > 0);
}
