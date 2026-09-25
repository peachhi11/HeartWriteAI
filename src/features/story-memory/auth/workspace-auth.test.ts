import { describe, expect, it } from "vitest";

import {
  getCreateAccountSuccessMessage,
  getFriendlyAuthErrorMessage,
  validateWorkspaceAuthInput,
} from "./workspace-auth";

describe("validateWorkspaceAuthInput", () => {
  it("requires an email for every auth action", () => {
    expect(
      validateWorkspaceAuthInput({
        action: "magic-link",
        email: "",
        password: "",
      }),
    ).toBe("Enter an email address first.");
  });

  it("does not require a password for email-link actions", () => {
    expect(
      validateWorkspaceAuthInput({
        action: "reset-password",
        email: "writer@example.com",
        password: "",
      }),
    ).toBeNull();
  });

  it("requires a long enough password for password actions", () => {
    expect(
      validateWorkspaceAuthInput({
        action: "create-account",
        email: "writer@example.com",
        password: "short",
      }),
    ).toBe("Use at least 8 characters for the password.");
  });
});

describe("getFriendlyAuthErrorMessage", () => {
  it("turns invalid credentials into a next-step hint", () => {
    expect(getFriendlyAuthErrorMessage("Invalid login credentials")).toContain(
      "create a login or use Set/reset password first",
    );
  });

  it("turns email rate limits into a wait message", () => {
    expect(getFriendlyAuthErrorMessage("Email rate limit exceeded")).toContain(
      "Wait a little while",
    );
  });

  it("keeps unknown messages intact", () => {
    expect(getFriendlyAuthErrorMessage("Unexpected provider error")).toBe(
      "Unexpected provider error",
    );
  });

  it("explains missing password-link sessions", () => {
    expect(getFriendlyAuthErrorMessage("Auth session missing")).toContain(
      "Open the latest password setup email in this same browser",
    );
  });
});

describe("getCreateAccountSuccessMessage", () => {
  it("recognizes immediate sessions", () => {
    expect(getCreateAccountSuccessMessage({ hasSession: true })).toBe(
      "Signed in to saved workspace.",
    );
  });

  it("recognizes likely existing accounts", () => {
    expect(getCreateAccountSuccessMessage({ hasSession: false, identitiesCount: 0 })).toContain(
      "may already have a workspace login",
    );
  });
});
