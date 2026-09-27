import { Check, Copy, Sparkles, UsersRound } from "lucide-react";

import { SectionPanel } from "@/features/story-memory/components/section-panel";
import {
  emptyUserPersonaDraft,
  type UserPersonaDraft,
  type UserPersonaGender,
} from "@/features/story-memory/types/user-persona";
import type { LoadedCharacterCard } from "@/features/story-memory/utils/character-card-parser";

export { emptyUserPersonaDraft };
export type { UserPersonaDraft };

export function formatUserPersonaDraft(draft: UserPersonaDraft) {
  return compactLines([
    `[${draft.displayName || "{{user}}"} Persona]`,
    draft.roleInStory ? `Role: ${draft.roleInStory}` : "",
    draft.tropeRelationshipWorldContext ? `Story fit:\n${draft.tropeRelationshipWorldContext}` : "",
    draft.appearancePresentation ? `Appearance + presentation:\n${draft.appearancePresentation}` : "",
    draft.selfConcept ? `Self-concept: ${draft.selfConcept}` : "",
    draft.connectionToCharacter ? `Connection to {{char}}: ${draft.connectionToCharacter}` : "",
    draft.relationalBackstory ? `Relational backstory + triggers:\n${draft.relationalBackstory}` : "",
    draft.psychologyInternalConflict ? `Psychology + internal conflict:\n${draft.psychologyInternalConflict}` : "",
    draft.romanticIntimateDynamics ? `Romantic + intimate dynamics:\n${draft.romanticIntimateDynamics}` : "",
    draft.compatibilityArchitecture ? `Compatibility + friction:\n${draft.compatibilityArchitecture}` : "",
    draft.interactionStyle ? `Interaction style:\n${draft.interactionStyle}` : "",
    draft.whatUserKnows ? `Starting knowledge: ${draft.whatUserKnows}` : "",
    draft.openingAngle ? `Opening position: ${draft.openingAngle}` : "",
    draft.narrativeArc ? `Narrative + romantic arc:\n${draft.narrativeArc}` : "",
    draft.sceneOpportunities ? `Scene hooks:\n${draft.sceneOpportunities}` : "",
    draft.voiceDialogue ? `Voice, dialogue + emotional expression:\n${draft.voiceDialogue}` : "",
    draft.boundaries ? `Agency + boundaries:\n${draft.boundaries}` : "",
    draft.cardFitNotes ? `Source card notes:\n${draft.cardFitNotes}` : "",
  ]).join("\n\n");
}

export function UserPersonaBuilderPanel({
  copied,
  draft,
  loadedCard,
  onChange,
  onCopy,
  onGenerate,
  onPersonaGenderChange,
  onSaveToUserBook,
  personaGender,
}: {
  copied: boolean;
  draft: UserPersonaDraft;
  loadedCard: LoadedCharacterCard | null;
  onChange: (field: keyof UserPersonaDraft, value: string) => void;
  onCopy: () => void;
  onGenerate: () => void;
  onPersonaGenderChange: (value: UserPersonaGender) => void;
  onSaveToUserBook?: () => void;
  personaGender: UserPersonaGender;
}) {
  const personaPreview = formatUserPersonaDraft(draft);

  return (
    <SectionPanel title="User Persona Builder" icon={UsersRound}>
      <div className="grid gap-4">
        <div className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm leading-6 text-zinc-600">
          {loadedCard ? (
            <>
              Source card: <span className="font-semibold text-zinc-900">{loadedCard.name ?? "Unnamed card"}</span>.
              This profile defines what {"{{user}}"} brings to that established card without taking over {"{{char}}"}.
              It works best after participants, relationships, and secrets are in place.
            </>
          ) : (
            <>
              Load a character card first for the strongest draft. You can still edit these fields
              manually, but persona-fit works best after the card, participants, relationships, and secrets exist.
            </>
          )}
        </div>

        <div className="grid gap-2 lg:grid-cols-[1fr_1fr_1fr_1fr]">
          <ControlledSelect
            label="Persona gender"
            onChange={onPersonaGenderChange}
            options={[
              { label: "Female", value: "female" },
              { label: "Male", value: "male" },
              { label: "Neutral / Any", value: "neutral" },
              { label: "Infer from card", value: "infer" },
            ]}
            value={personaGender}
          />
          <button
            className="flex h-10 self-end items-center justify-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-medium text-white hover:bg-zinc-800"
            onClick={onGenerate}
            type="button"
          >
            <Sparkles className="size-4" aria-hidden="true" />
            Generate From Card
          </button>
          {onSaveToUserBook ? (
            <button
              className="flex h-10 self-end items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              onClick={onSaveToUserBook}
              type="button"
            >
              Save as User Book
            </button>
          ) : null}
          <button
            className="flex h-10 self-end items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
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
            label="Story fit"
            onChange={(value) => onChange("tropeRelationshipWorldContext", value)}
            placeholder="Trope alignment, relationship dynamic, world logic, and conflict driver"
            value={draft.tropeRelationshipWorldContext}
          />
          <ControlledTextArea
            label="Appearance + presentation"
            onChange={(value) => onChange("appearancePresentation", value)}
            placeholder="Physical presence, fashion, scent, mannerisms, and visible insecurities"
            value={draft.appearancePresentation}
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
            label="Relational backstory + triggers"
            onChange={(value) => onChange("relationalBackstory", value)}
            placeholder="Family models, romantic history, wounds, secrets, and protective behaviors"
            value={draft.relationalBackstory}
          />
          <ControlledTextArea
            label="Psychology + internal conflict"
            onChange={(value) => onChange("psychologyInternalConflict", value)}
            placeholder="Temperament, core wound, coping, moral code, blind spots"
            value={draft.psychologyInternalConflict}
          />
          <ControlledTextArea
            label="Romantic + intimate dynamics"
            onChange={(value) => onChange("romanticIntimateDynamics", value)}
            placeholder="Attachment, love languages, attraction, jealousy, power dynamics"
            value={draft.romanticIntimateDynamics}
          />
          <ControlledTextArea
            label="Compatibility + friction"
            onChange={(value) => onChange("compatibilityArchitecture", value)}
            placeholder="Three sources of compatibility, three sources of conflict, and the emotional gap {{user}} fills"
            value={draft.compatibilityArchitecture}
          />
          <ControlledTextArea
            label="Interaction style"
            onChange={(value) => onChange("interactionStyle", value)}
            placeholder="Flirtation, communication, group vs one-on-one behavior, conflict approach"
            value={draft.interactionStyle}
          />
          <ControlledTextArea
            label="Starting knowledge"
            onChange={(value) => onChange("whatUserKnows", value)}
            placeholder="What {{user}} knows, suspects, or is hiding at the start"
            value={draft.whatUserKnows}
          />
          <ControlledTextArea
            label="Opening position"
            onChange={(value) => onChange("openingAngle", value)}
            placeholder="How {{user}} can enter the opening with agency"
            value={draft.openingAngle}
          />
          <ControlledTextArea
            label="Narrative + romantic arc"
            onChange={(value) => onChange("narrativeArc", value)}
            placeholder="Mismatch, tension, progression to trust, obstacles, payoff"
            value={draft.narrativeArc}
          />
          <ControlledTextArea
            label="Scene hooks"
            onChange={(value) => onChange("sceneOpportunities", value)}
            placeholder="Unique scenes and long-term RP hooks created by this pairing"
            value={draft.sceneOpportunities}
          />
          <ControlledTextArea
            label="Voice, dialogue + emotional expression"
            onChange={(value) => onChange("voiceDialogue", value)}
            placeholder="Tone, signature expressions, defensive lines, vulnerability, confession"
            value={draft.voiceDialogue}
          />
          <ControlledTextArea
            label="Agency + boundaries"
            onChange={(value) => onChange("boundaries", value)}
            placeholder="Player agency, consent, knowledge, and authorship boundaries for {{user}}"
            value={draft.boundaries}
          />
          <ControlledTextArea
            label="Source card notes"
            onChange={(value) => onChange("cardFitNotes", value)}
            placeholder="What the loaded character card contributes to this persona"
            value={draft.cardFitNotes}
          />
        </div>

        <article className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 bg-zinc-50 px-3 py-3">
            <h3 className="text-sm font-semibold text-zinc-950">Persona Preview</h3>
            <p className="mt-1 text-xs leading-5 text-zinc-500">
              Paste-ready draft. Save as a User Book to package it with the active StoryBook.
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

function ControlledSelect<TValue extends string>({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: TValue) => void;
  options: { label: string; value: TValue }[];
  value: TValue;
}) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium text-zinc-700">{label}</span>
      <select
        className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-zinc-950"
        onChange={(event) => onChange(event.target.value as TValue)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
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
