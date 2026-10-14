import assert from "node:assert/strict";
import test from "node:test";
import { storyEvalPrivateToolsRenderContract } from "../../lib/character-card/storyEvalDashboard";

test("keeps the private StoryEval rendered UI contract complete", () => {
  const renderedCopy = Object.values(storyEvalPrivateToolsRenderContract).join(" ");

  assert.match(renderedCopy, /StoryEval Review Dashboard/);
  assert.match(renderedCopy, /Run Fixture/);
  assert.match(renderedCopy, /Refresh History/);
  assert.match(renderedCopy, /Export Selected CI/);
  assert.match(renderedCopy, /aggregate-only local eval runs/);
});
