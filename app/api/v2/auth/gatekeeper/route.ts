import { randomUUID, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";

type AuthRequestBody = {
  identity?: unknown;
  passphrase?: unknown;
};

const MAX_IDENTITY_LENGTH = 160;
const MAX_PASSPHRASE_LENGTH = 256;

export async function POST(request: NextRequest) {
  const originFailure = validateSameOriginRequest(request);
  if (originFailure) {
    return jsonError(originFailure, 403);
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return jsonError("Unsupported authentication payload type.", 415);
  }

  let body: AuthRequestBody;
  try {
    body = (await request.json()) as AuthRequestBody;
  } catch {
    return jsonError("Malformed authentication payload.", 400);
  }

  const identity = readBoundedString(body.identity, MAX_IDENTITY_LENGTH);
  const passphrase = readBoundedString(body.passphrase, MAX_PASSPHRASE_LENGTH);

  if (!identity || !passphrase) {
    return jsonError("Account identifier and passphrase are required.", 400);
  }

  if (containsMarkup(identity) || containsMarkup(passphrase)) {
    return jsonError("Credential payload contains unsupported characters.", 400);
  }

  const configuredIdentity = process.env.HEARTWRITEAI_AUTH_IDENTITY;
  const configuredPassphrase = process.env.HEARTWRITEAI_AUTH_SECRET;

  if (!configuredIdentity || !configuredPassphrase) {
    return jsonError(
      "Authentication gateway is not configured for this local build.",
      503,
    );
  }

  if (
    !constantTimeEqual(identity, configuredIdentity) ||
    !constantTimeEqual(passphrase, configuredPassphrase)
  ) {
    return jsonError("Invalid credentials provided.", 401);
  }

  const response = NextResponse.json(
    {
      mfaStep: false,
      token: `local-session-${randomUUID()}`,
    },
    { status: 200 },
  );
  response.headers.set("Cache-Control", "no-store");
  return response;
}

function validateSameOriginRequest(request: NextRequest) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") {
    return "Cross-site authentication request blocked.";
  }

  const origin = request.headers.get("origin");
  if (!origin) {
    return null;
  }

  const expectedOrigin = request.nextUrl.origin;
  if (origin !== expectedOrigin) {
    return "Origin mismatch blocked by authentication gatekeeper.";
  }

  return null;
}

function readBoundedString(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength) {
    return null;
  }

  return trimmed;
}

function containsMarkup(value: string) {
  return /[<>{}]/.test(value);
}

function constantTimeEqual(value: string, expected: string) {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);

  if (valueBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(valueBuffer, expectedBuffer);
}

function jsonError(message: string, status: number) {
  const response = NextResponse.json({ message }, { status });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
