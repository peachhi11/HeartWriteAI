"use client";

import { Dispatch, FormEvent, ReactNode, SetStateAction, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { ValidatedCharacterCardV3 } from "@/types/character-card/CharacterCardV3Schema";

interface StructuredCardEditorProps {
  activeCard: ValidatedCharacterCardV3;
  setActiveCard: Dispatch<SetStateAction<ValidatedCharacterCardV3 | null>>;
}

type EditorTab = "identity" | "behavior" | "greetings";

const EDITOR_TABS: EditorTab[] = ["identity", "behavior", "greetings"];

export default function StructuredCardEditor({
  activeCard,
  setActiveCard,
}: StructuredCardEditorProps) {
  const [activeTab, setActiveTab] = useState<EditorTab>("identity");
  const [newAlternateGreeting, setNewAlternateGreeting] = useState("");
  const [newGroupGreeting, setNewGroupGreeting] = useState("");

  function updateField<Key extends keyof ValidatedCharacterCardV3["data"]>(
    key: Key,
    value: ValidatedCharacterCardV3["data"][Key],
  ) {
    setActiveCard((currentCard) => {
      if (!currentCard) {
        return null;
      }

      return {
        ...currentCard,
        data: {
          ...currentCard.data,
          [key]: value,
        },
      };
    });
  }

  function handleAddAlternateGreeting(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const greeting = newAlternateGreeting.trim();
    if (!greeting) {
      return;
    }

    updateField("alternate_greetings", [
      ...activeCard.data.alternate_greetings,
      greeting,
    ]);
    setNewAlternateGreeting("");
  }

  function handleAddGroupGreeting(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const greeting = newGroupGreeting.trim();
    if (!greeting) {
      return;
    }

    updateField("group_only_greetings", [
      ...activeCard.data.group_only_greetings,
      greeting,
    ]);
    setNewGroupGreeting("");
  }

  function handleRemoveAlternateGreeting(indexToRemove: number) {
    updateField(
      "alternate_greetings",
      activeCard.data.alternate_greetings.filter(
        (_greeting, index) => index !== indexToRemove,
      ),
    );
  }

  function handleRemoveGroupGreeting(indexToRemove: number) {
    updateField(
      "group_only_greetings",
      activeCard.data.group_only_greetings.filter(
        (_greeting, index) => index !== indexToRemove,
      ),
    );
  }

  return (
    <section className="flex min-h-[520px] flex-1 flex-col overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/30">
      <div className="flex shrink-0 gap-1 border-b border-zinc-800 bg-zinc-950/60 p-1">
        {EDITOR_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-md px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
              activeTab === tab
                ? "border border-zinc-800 bg-zinc-900 text-violet-300"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        {activeTab === "identity" ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Name Key">
                <input
                  type="text"
                  value={activeCard.data.name}
                  onChange={(event) => updateField("name", event.currentTarget.value)}
                  className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                />
              </Field>

              <Field label="Card Version">
                <input
                  type="text"
                  value={activeCard.data.character_version}
                  onChange={(event) =>
                    updateField("character_version", event.currentTarget.value)
                  }
                  className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                />
              </Field>
            </div>

            <Field label="Core Personality Definitions">
              <textarea
                value={activeCard.data.personality}
                onChange={(event) =>
                  updateField("personality", event.currentTarget.value)
                }
                className="h-28 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
              />
            </Field>

            <Field label="Comprehensive World Description Matrix">
              <textarea
                value={activeCard.data.description}
                onChange={(event) =>
                  updateField("description", event.currentTarget.value)
                }
                className="h-44 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
              />
            </Field>

            <Field label="Creator Notes">
              <textarea
                value={activeCard.data.creator_notes}
                onChange={(event) =>
                  updateField("creator_notes", event.currentTarget.value)
                }
                className="h-28 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
              />
            </Field>
          </div>
        ) : null}

        {activeTab === "behavior" ? (
          <div className="space-y-4">
            <Field label="Active Encounter Scenario">
              <textarea
                value={activeCard.data.scenario}
                onChange={(event) => updateField("scenario", event.currentTarget.value)}
                className="h-28 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
              />
            </Field>

            <Field label="Example Messages">
              <textarea
                value={activeCard.data.mes_example}
                onChange={(event) =>
                  updateField("mes_example", event.currentTarget.value)
                }
                className="h-32 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
              />
            </Field>

            <Field label="Main System Prompt Overrides">
              <textarea
                value={activeCard.data.system_prompt}
                onChange={(event) =>
                  updateField("system_prompt", event.currentTarget.value)
                }
                className="h-32 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
              />
            </Field>

            <Field label="Post-History Instructions Injection">
              <textarea
                value={activeCard.data.post_history_instructions}
                onChange={(event) =>
                  updateField("post_history_instructions", event.currentTarget.value)
                }
                className="h-28 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
              />
            </Field>
          </div>
        ) : null}

        {activeTab === "greetings" ? (
          <div className="space-y-5">
            <Field label="Primary First Message">
              <textarea
                value={activeCard.data.first_mes}
                onChange={(event) =>
                  updateField("first_mes", event.currentTarget.value)
                }
                className="h-32 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
              />
            </Field>

            <GreetingList
              addLabel="Add alternate greeting"
              emptyLabel="No alternate variations defined for this character."
              greetings={activeCard.data.alternate_greetings}
              inputValue={newAlternateGreeting}
              label="Alternate Greetings Array"
              onAdd={handleAddAlternateGreeting}
              onInputChange={setNewAlternateGreeting}
              onRemove={handleRemoveAlternateGreeting}
            />

            <GreetingList
              addLabel="Add group greeting"
              emptyLabel="No group-only openings defined for this character."
              greetings={activeCard.data.group_only_greetings}
              inputValue={newGroupGreeting}
              label="Group Only Greetings Array"
              onAdd={handleAddGroupGreeting}
              onInputChange={setNewGroupGreeting}
              onRemove={handleRemoveGroupGreeting}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Field({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
        {label}
      </span>
      {children}
    </label>
  );
}

function GreetingList({
  addLabel,
  emptyLabel,
  greetings,
  inputValue,
  label,
  onAdd,
  onInputChange,
  onRemove,
}: {
  addLabel: string;
  emptyLabel: string;
  greetings: string[];
  inputValue: string;
  label: string;
  onAdd: (event: FormEvent<HTMLFormElement>) => void;
  onInputChange: (value: string) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="space-y-3 border-t border-zinc-800 pt-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
        {label}
      </h3>

      <form onSubmit={onAdd} className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(event) => onInputChange(event.currentTarget.value)}
          className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 p-2 text-xs text-zinc-200 outline-none focus:border-violet-500"
        />
        <button
          type="submit"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
          title={addLabel}
        >
          <Plus className="size-4" />
        </button>
      </form>

      {greetings.length === 0 ? (
        <p className="text-[11px] italic text-zinc-600">{emptyLabel}</p>
      ) : (
        <div className="space-y-2">
          {greetings.map((greeting, index) => (
            <div
              key={`${index}-${greeting}`}
              className="group flex items-start gap-3 rounded-lg border border-zinc-900 bg-zinc-950 p-3"
            >
              <span className="mt-0.5 select-none font-mono text-[10px] text-zinc-600">
                #{index + 1}
              </span>
              <p className="flex-1 break-words font-mono text-xs leading-relaxed text-zinc-400">
                {greeting}
              </p>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="flex size-7 items-center justify-center rounded border border-transparent text-zinc-600 transition hover:border-rose-500/20 hover:bg-rose-500/5 hover:text-rose-400"
                title="Remove greeting"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
