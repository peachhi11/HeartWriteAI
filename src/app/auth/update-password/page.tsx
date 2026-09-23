"use client";

import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/browser";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [notice, setNotice] = useState("Enter a new password for this workspace.");
  const [isPending, startTransition] = useTransition();

  function updatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const password = getFormValue(form, "password");
    const confirmPassword = getFormValue(form, "confirmPassword");

    if (!password) {
      setNotice("Enter a new password.");
      return;
    }

    if (password.length < 8) {
      setNotice("Use at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setNotice("Passwords do not match.");
      return;
    }

    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setNotice(error.message);
        return;
      }

      setNotice("Password updated. Returning to HeartWriteAI...");
      router.push("/");
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-6 text-zinc-950">
      <section className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-zinc-500">Saved workspace</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-normal">Set your password</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          Use this after opening a Supabase password setup or recovery link.
        </p>

        <form className="mt-5 grid gap-3" onSubmit={updatePassword}>
          <input
            aria-label="New password"
            autoComplete="new-password"
            className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-zinc-950"
            name="password"
            placeholder="New password"
            type="password"
          />
          <input
            aria-label="Confirm new password"
            autoComplete="new-password"
            className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-zinc-950"
            name="confirmPassword"
            placeholder="Confirm new password"
            type="password"
          />
          <button
            className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isPending}
            type="submit"
          >
            Save password
          </button>
        </form>

        <p className="mt-3 text-xs leading-5 text-zinc-500" aria-live="polite">
          {notice}
        </p>

        <Link className="mt-5 inline-flex text-sm font-medium text-zinc-700 hover:text-zinc-950" href="/">
          Back to HeartWriteAI
        </Link>
      </section>
    </main>
  );
}

function getFormValue(form: HTMLFormElement, name: string) {
  const field = form.elements.namedItem(name);
  if (!field || !("value" in field)) return "";
  return String(field.value).trim();
}
