"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { AuthGatekeeperResponse, AuthSessionState } from "@/types/auth";

const initialAuthState: AuthSessionState = {
  isProcessing: false,
  mfaRequired: false,
  tokenPayload: null,
  validationError: null,
};

export function WebLoginScreen() {
  const router = useRouter();
  const [identity, setIdentity] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [revealPassword, setRevealPassword] = useState(false);
  const [authState, setAuthState] =
    useState<AuthSessionState>(initialAuthState);

  async function handleFormSubmission(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanIdentity = identity.trim();
    const cleanPassphrase = passphrase.trim();

    if (!cleanIdentity || !cleanPassphrase) {
      setAuthState((current) => ({
        ...current,
        validationError: "Fields cannot be blank.",
      }));
      return;
    }

    if (/[<>{}]/.test(cleanIdentity) || /[<>{}]/.test(cleanPassphrase)) {
      setAuthState((current) => ({
        ...current,
        validationError: "Credential fields contain unsupported characters.",
      }));
      return;
    }

    setAuthState({
      isProcessing: true,
      mfaRequired: false,
      tokenPayload: null,
      validationError: null,
    });

    try {
      const response = await fetch("/api/v2/auth/gatekeeper", {
        body: JSON.stringify({
          identity: cleanIdentity,
          passphrase: cleanPassphrase,
        }),
        cache: "no-store",
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const payload = (await response.json()) as AuthGatekeeperResponse;

      if (!response.ok) {
        throw new Error(payload.message || "Invalid credentials provided.");
      }

      setAuthState({
        isProcessing: false,
        mfaRequired: payload.mfaStep ?? false,
        tokenPayload: payload.token ?? null,
        validationError: null,
      });

      router.push("/");
    } catch (caught) {
      setAuthState((current) => ({
        ...current,
        isProcessing: false,
        tokenPayload: null,
        validationError:
          caught instanceof Error ? caught.message : "Server handshake failure.",
      }));
    }
  }

  return (
    <main className="relative flex min-h-screen w-screen items-center justify-center overflow-hidden bg-zinc-950 p-6 text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(190,18,60,0.24),transparent_34%),radial-gradient(circle_at_72%_78%,rgba(236,72,153,0.16),transparent_30%),linear-gradient(to_bottom,rgba(76,5,25,0.3),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-x-8 top-8 h-px bg-gradient-to-r from-transparent via-rose-300/30 to-transparent" />

      <section className="animate-fade-in relative z-10 w-full max-w-sm rounded-2xl border border-zinc-800/70 bg-zinc-900/55 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <div className="space-y-6">
          <header className="space-y-3 text-center">
            <div className="mx-auto flex size-11 items-center justify-center rounded-full border border-rose-500/25 bg-rose-950/45 text-rose-200 shadow-inner">
              <KeyRound className="size-5" />
            </div>
            <div>
              <h1 className="text-xs font-black uppercase tracking-[0.22em] text-zinc-300">
                HeartWriteAI Web UI
              </h1>
              <p className="mt-1 text-[11px] leading-5 text-zinc-500">
                Secure access for synchronized playthrough archives.
              </p>
            </div>
          </header>

          <form className="space-y-4" onSubmit={handleFormSubmission}>
            <div className="space-y-1.5">
              <label
                className="block text-[10px] font-bold uppercase tracking-wide text-zinc-500"
                htmlFor="identity"
              >
                Account Identifier
              </label>
              <input
                autoComplete="username"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-700 focus:border-rose-500/70 disabled:cursor-wait disabled:opacity-50"
                disabled={authState.isProcessing}
                id="identity"
                inputMode="email"
                maxLength={160}
                onChange={(event) => setIdentity(event.currentTarget.value)}
                placeholder="Username or email address"
                type="text"
                value={identity}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <label
                  className="block text-[10px] font-bold uppercase tracking-wide text-zinc-500"
                  htmlFor="passphrase"
                >
                  Security Passphrase
                </label>
                <a
                  className="text-[10px] font-bold text-rose-400/80 transition-colors hover:text-rose-300"
                  href="#reset"
                >
                  Forgot?
                </a>
              </div>

              <div className="relative">
                <input
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 pl-3 pr-11 font-mono text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-800 focus:border-rose-500/70 disabled:cursor-wait disabled:opacity-50"
                  disabled={authState.isProcessing}
                  id="passphrase"
                  maxLength={256}
                  onChange={(event) => setPassphrase(event.currentTarget.value)}
                  placeholder="••••••••••••••••"
                  type={revealPassword ? "text" : "password"}
                  value={passphrase}
                />
                <button
                  aria-label={revealPassword ? "Hide password" : "Show password"}
                  aria-pressed={revealPassword}
                  className="absolute right-2.5 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-zinc-600 transition hover:bg-zinc-900 hover:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  disabled={authState.isProcessing}
                  onClick={() => setRevealPassword((current) => !current)}
                  onMouseDown={(event) => event.preventDefault()}
                  title={revealPassword ? "Hide password" : "Show password"}
                  type="button"
                >
                  {revealPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {authState.validationError ? (
              <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-3 text-left text-[11px] leading-normal text-red-300">
                <strong className="mb-1 flex items-center gap-1.5 font-sans text-[9px] uppercase tracking-wide text-red-300">
                  <AlertTriangle className="size-3.5" />
                  Auth exception
                </strong>
                <span className="font-mono">{authState.validationError}</span>
              </div>
            ) : null}

            {authState.mfaRequired ? (
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-[11px] text-amber-200">
                Additional verification is required before archive access.
              </div>
            ) : null}

            <button
              className={cn(
                "relative flex w-full items-center justify-center overflow-hidden rounded-xl py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-lg transition-all duration-300",
                authState.isProcessing
                  ? "cursor-wait border border-zinc-700/40 bg-zinc-800 text-zinc-500"
                  : "cursor-pointer bg-gradient-to-r from-rose-700 to-pink-600 shadow-rose-950/25 hover:from-rose-600 hover:to-pink-500 active:scale-[0.98]",
              )}
              disabled={authState.isProcessing}
              type="submit"
            >
              {authState.isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <LoaderCircle className="size-4 animate-spin" />
                  Verifying handshake
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <ShieldCheck className="size-4" />
                  Authorize Connection
                </span>
              )}
            </button>
          </form>

          <footer className="border-t border-zinc-800/70 pt-4 text-center">
            <span className="inline-flex items-center justify-center gap-1.5 text-[10px] font-medium text-zinc-600">
              <LockKeyhole className="size-3" />
              Local admin access requires configured server credentials.
            </span>
          </footer>
        </div>
      </section>
    </main>
  );
}
