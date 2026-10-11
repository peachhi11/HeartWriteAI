import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(scriptPath), "..");

const requiredFiles = [
  "AGENTS.md",
  "docs/agents/issue-tracker.md",
  "docs/agents/triage-labels.md",
  "docs/agents/domain.md",
  "docs/agents/work-rules.md",
];

const contentChecks = [
  {
    file: "AGENTS.md",
    includes: "HeartWriteAI Memory Vault",
    message: "AGENTS.md must point agents to the HeartWriteAI Memory Vault.",
  },
  {
    file: "docs/agents/domain.md",
    includes: "canonical product and domain memory",
    message: "docs/agents/domain.md must identify the Memory Vault as canonical domain memory.",
  },
  {
    file: "docs/agents/issue-tracker.md",
    includes: "Issue tracker: GitHub",
    message: "docs/agents/issue-tracker.md must preserve the selected GitHub issue tracker.",
  },
  {
    file: "docs/agents/triage-labels.md",
    includes: "ready-for-agent",
    message: "docs/agents/triage-labels.md must preserve the default triage label map.",
  },
  {
    file: "AGENTS.md",
    includes: "docs/agents/work-rules.md",
    message: "AGENTS.md must point agents to the repo work rules.",
  },
  {
    file: "docs/agents/work-rules.md",
    includes: "No completion claim without naming the evidence behind it.",
    message: "docs/agents/work-rules.md must preserve the evidence-label contract.",
  },
  {
    file: "docs/agents/work-rules.md",
    includes: "Push only when explicitly asked.",
    message: "docs/agents/work-rules.md must preserve explicit push authority.",
  },
];

const failures = [];

for (const relativePath of requiredFiles) {
  const fullPath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(fullPath)) {
    failures.push(`Missing required agent setup file: ${relativePath}`);
  }
}

for (const check of contentChecks) {
  const fullPath = path.join(repoRoot, check.file);
  if (!fs.existsSync(fullPath)) {
    continue;
  }

  const content = fs.readFileSync(fullPath, "utf8");
  if (!content.includes(check.includes)) {
    failures.push(check.message);
  }
}

if (failures.length > 0) {
  console.error("Agent setup check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Agent setup check passed.");
