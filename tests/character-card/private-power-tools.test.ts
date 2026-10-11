import assert from "node:assert/strict";
import test from "node:test";

import { isPrivatePowerToolsEnabled } from "../../lib/app/privatePowerTools";

test("private power tools are enabled in the private desktop app by default", () => {
  assert.equal(
    isPrivatePowerToolsEnabled({
      isDesktopRuntime: true,
    }),
    true,
  );
});

test("private power tools stay hidden in public app builds", () => {
  assert.equal(
    isPrivatePowerToolsEnabled({
      isDesktopRuntime: true,
      publicAppFlag: "true",
    }),
    false,
  );
});

test("private power tools can be enabled explicitly for browser power users", () => {
  assert.equal(
    isPrivatePowerToolsEnabled({
      isDesktopRuntime: false,
      privateToolsFlag: "1",
    }),
    true,
  );
});

test("private power tools default off for public browser surfaces", () => {
  assert.equal(
    isPrivatePowerToolsEnabled({
      isDesktopRuntime: false,
    }),
    false,
  );
});
