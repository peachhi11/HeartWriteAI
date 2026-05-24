"use client";

import { FormEvent, useState } from "react";
import { SendHorizonal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRelationshipStore } from "../store";

const examples = [
  "I'm sorry. I shouldn't have left. I understand why that hurt you.",
  "I missed you. I am here, and I am not replacing you.",
  "You lied to me and kept this behind my back.",
];

export function MessageInput() {
  const [content, setContent] = useState("");
  const addMessage = useRelationshipStore((state) => state.addMessage);

  async function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      return;
    }

    await addMessage({
      content: trimmedContent,
      createdAt: Date.now(),
      role: "user",
    });
    setContent("");
  }

  return (
    <form className="grid gap-3" onSubmit={submitMessage}>
      <label className="text-sm font-medium" htmlFor="relationship-message">
        Add Recent Message
      </label>
      <Textarea
        id="relationship-message"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder={examples[0]}
        className="min-h-28 resize-y"
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {examples.slice(1).map((example) => (
            <Button
              key={example}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setContent(example)}
            >
              Use Example
            </Button>
          ))}
        </div>
        <Button type="submit">
          <SendHorizonal />
          Process
        </Button>
      </div>
    </form>
  );
}
