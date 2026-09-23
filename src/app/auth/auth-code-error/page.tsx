import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-6 text-zinc-950">
      <section className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-zinc-500">Sign-in link expired</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-normal">Try sending a fresh magic link.</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          Supabase could not finish the sign-in from that link. Magic links can expire or be reused too late.
        </p>
        <Link
          className="mt-5 inline-flex h-10 items-center rounded-md bg-zinc-950 px-4 text-sm font-medium text-white hover:bg-zinc-800"
          href="/"
        >
          Back to HeartWriteAI
        </Link>
      </section>
    </main>
  );
}
