import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = getSafeNextPath(requestUrl.searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(getRedirectUrl(request, requestUrl.origin, next));
    }
  }

  return NextResponse.redirect(getRedirectUrl(request, requestUrl.origin, "/auth/auth-code-error"));
}

function getSafeNextPath(next: string | null) {
  if (!next?.startsWith("/") || next.startsWith("//")) {
    return "/";
  }

  return next;
}

function getRedirectUrl(request: Request, origin: string, path: string) {
  const forwardedHost = request.headers.get("x-forwarded-host");

  if (process.env.NODE_ENV === "development" || !forwardedHost) {
    return `${origin}${path}`;
  }

  return `https://${forwardedHost}${path}`;
}
