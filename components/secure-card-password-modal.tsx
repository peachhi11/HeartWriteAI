"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { LockKeyhole, X } from "lucide-react";

type SecureCardPasswordModalProps = {
  isBusy?: boolean;
  isOpen: boolean;
  mode: "export" | "import";
  onCancel: () => void;
  onSubmit: (password: string) => void;
  statusMessage?: string | null;
};

export function SecureCardPasswordModal({
  isBusy = false,
  isOpen,
  mode,
  onCancel,
  onSubmit,
  statusMessage,
}: SecureCardPasswordModalProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isExport = mode === "export";
  const canSubmit =
    password.length >= 8 && (!isExport || password === confirmPassword);

  useEffect(() => {
    if (!isOpen) return;
    const timeout = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(timeout);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || isBusy) {
      return;
    }

    onSubmit(password);
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-background/75 p-4 backdrop-blur-sm">
      <form
        className="w-full max-w-md rounded-2xl border bg-card p-5 shadow-2xl"
        onSubmit={handleSubmit}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-xl border bg-muted p-2 text-muted-foreground">
              <LockKeyhole className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold">
                {isExport ? "Export Secure Card" : "Import Secure Card"}
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {isExport
                  ? "Creates a HeartWriteAI-only .hwcard file encrypted with your password. Export a normal PNG/CHARX when you need platform compatibility."
                  : "Decrypts a HeartWriteAI-only .hwcard file. Normal PNG/CHARX card imports do not use this password."}
              </p>
            </div>
          </div>
          <button
            aria-label="Close secure card modal"
            className="rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            disabled={isBusy}
            onClick={onCancel}
            type="button"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-5 grid gap-3">
          <label className="grid gap-1.5 text-sm font-medium">
            Password
            <input
              ref={inputRef}
              autoComplete={isExport ? "new-password" : "current-password"}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-[color:var(--liquid-accent)]"
              minLength={8}
              onChange={(event) => setPassword(event.currentTarget.value)}
              placeholder="Minimum 8 characters"
              type="password"
              value={password}
            />
          </label>

          {isExport ? (
            <label className="grid gap-1.5 text-sm font-medium">
              Confirm password
              <input
                autoComplete="new-password"
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-[color:var(--liquid-accent)]"
                minLength={8}
                onChange={(event) => setConfirmPassword(event.currentTarget.value)}
                placeholder="Type it again"
                type="password"
                value={confirmPassword}
              />
            </label>
          ) : null}

          {statusMessage ? (
            <p className="rounded-lg border bg-muted/45 px-3 py-2 text-xs text-muted-foreground">
              {statusMessage}
            </p>
          ) : null}

          {password.length > 0 && password.length < 8 ? (
            <p className="text-xs text-destructive">
              Secure card passwords must be at least 8 characters.
            </p>
          ) : null}
          {isExport && confirmPassword && password !== confirmPassword ? (
            <p className="text-xs text-destructive">Passwords do not match.</p>
          ) : null}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-muted disabled:opacity-50"
            disabled={isBusy}
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
            disabled={!canSubmit || isBusy}
            type="submit"
          >
            {isBusy
              ? "Working..."
              : isExport
                ? "Export .hwcard"
                : "Choose .hwcard"}
          </button>
        </div>
      </form>
    </div>
  );
}
