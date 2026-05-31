export type RegexScriptPlacementV3 =
  | "after_llm"
  | "before_llm"
  | "display_only";

export interface RegexScriptRuleV3 {
  disabled?: boolean;
  find: string;
  flags?: string;
  id: string;
  placement: RegexScriptPlacementV3;
  replace: string;
  scriptName: string;
}
