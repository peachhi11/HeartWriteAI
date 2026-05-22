const USER_FACING_OPTION_LABELS: Record<string, string> = {
  Antagonistic: "Enemies to lovers",
  Asymmetric: "One leads, one follows",
  "Asymmetric (Bot Dominant)": "Character leads",
  "Asymmetric (User Dominant)": "User leads",
  Bracket_Monologue: "Bracketed inner thoughts",
  Clean_Prose: "Clean prose",
  Code_Block_Shielding: "Protected code blocks",
  Dynamic_User_Sliders: "User-controlled sliders",
  Dynamic_Variable_Loop: "Dynamic variables",
  Extended_Deep_Lore: "Extended deep lore",
  Monolithic_System_Prompt: "Single system prompt",
  Quote_Isolated_Prose: "Quoted dialogue prose",
  Raw_Agnostic_JSON: "Platform-neutral JSON",
  Raw_Script: "Script style",
  Segmented_Placements: "Section-by-section placement",
  Symmetric: "Balanced dynamic",
  Ultra_Lean_Context: "Lean context",
  V2_Card_Standard: "V2 card standard",
  V3_Card_Layout: "V3 card layout",
  Vercel_Structured_Zod: "Structured app schema",
  Weighted_Bold_Impact: "Bold emphasis",
};

export function humanizeOptionLabel(value: string) {
  const mappedLabel = USER_FACING_OPTION_LABELS[value];

  if (mappedLabel) {
    return mappedLabel;
  }

  return value
    .replace(/^Asymmetric\s+/, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\bAi\b/g, "AI")
    .replace(/\bJson\b/g, "JSON")
    .replace(/\bNpc\b/g, "NPC")
    .replace(/\bPov\b/g, "POV")
    .replace(/\bRpg\b/g, "RPG")
    .replace(/\bCta\b/g, "CTA")
    .replace(/\bEu\b/g, "EU")
    .replace(/\bNb\b/g, "NB")
    .replace(/\bId\b/g, "ID")
    .replace(/\bV([23])\b/g, "V$1");
}
