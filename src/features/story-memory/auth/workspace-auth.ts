export type AuthAction = "sign-in" | "create-account" | "magic-link" | "reset-password";

export const minimumWorkspacePasswordLength = 8;

export function validateWorkspaceAuthInput({
  action,
  email,
  password,
}: {
  action: AuthAction;
  email: string;
  password: string;
}) {
  if (!email) {
    return "Enter an email address first.";
  }

  if (action === "magic-link" || action === "reset-password") {
    return null;
  }

  if (!password) {
    return action === "create-account"
      ? "Enter a password to create a saved workspace login."
      : "Enter your workspace password.";
  }

  if (password.length < minimumWorkspacePasswordLength) {
    return `Use at least ${minimumWorkspacePasswordLength} characters for the password.`;
  }

  return null;
}

export function getFriendlyAuthErrorMessage(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "That email and password did not work. If this is your first time using saved workspace sign-in, create a login or use Set/reset password first.";
  }

  if (normalized.includes("email not confirmed")) {
    return "That login exists, but the email is not confirmed yet. Open the confirmation email, then sign in again.";
  }

  if (normalized.includes("auth session missing") || normalized.includes("session missing")) {
    return "That password link is not active in this browser. Open the latest password setup email in this same browser, then try again.";
  }

  if (normalized.includes("rate limit") || normalized.includes("too many")) {
    return "Too many email links were requested. Wait a little while before sending another magic or password setup link.";
  }

  if (normalized.includes("already registered") || normalized.includes("already exists")) {
    return "That email already has a workspace login. Sign in, or use Set/reset password if you need a new password.";
  }

  return message;
}

export function getCreateAccountSuccessMessage({
  hasSession,
  identitiesCount,
}: {
  hasSession: boolean;
  identitiesCount?: number | null;
}) {
  if (hasSession) {
    return "Signed in to saved workspace.";
  }

  if (identitiesCount === 0) {
    return "That email may already have a workspace login. Try signing in, or use Set/reset password.";
  }

  return "Workspace login created. Check your email if Supabase asks you to confirm it, then sign in.";
}
