import type {
  RegexScriptPlacementV3,
  RegexScriptRuleV3,
} from "@/types/character-card/RegexScriptRuleV3";

export interface RegexMacroContext {
  characterName?: string;
  location?: string;
  userName?: string;
}

export interface RegexRuleExecutionFault {
  error: string;
  ruleId: string;
  scriptName: string;
}

export interface RegexRuleExecutionResult {
  faults: RegexRuleExecutionFault[];
  output: string;
}

export interface RegexRuleApplyOptions {
  macroContext?: RegexMacroContext;
  maxInputLength?: number;
}

const DEFAULT_MAX_INPUT_LENGTH = 250_000;
const SUPPORTED_REGEX_FLAGS = new Set(["d", "g", "i", "m", "s", "u", "y"]);

export class RegexScriptRegistry {
  private readonly rules: RegexScriptRuleV3[];

  public constructor(rules: readonly RegexScriptRuleV3[] = []) {
    this.rules = rules.map(normalizeRegexRule);
  }

  public list(placement?: RegexScriptPlacementV3): RegexScriptRuleV3[] {
    const rules = placement
      ? this.rules.filter((rule) => rule.placement === placement)
      : this.rules;

    return rules.map((rule) => ({ ...rule }));
  }

  public upsert(rule: RegexScriptRuleV3): RegexScriptRegistry {
    const normalized = normalizeRegexRule(rule);
    const nextRules = this.rules.filter((item) => item.id !== normalized.id);
    return new RegexScriptRegistry([...nextRules, normalized]);
  }

  public remove(ruleId: string): RegexScriptRegistry {
    return new RegexScriptRegistry(this.rules.filter((rule) => rule.id !== ruleId));
  }

  public apply(
    text: string,
    placement: RegexScriptPlacementV3,
    options: RegexRuleApplyOptions = {},
  ): RegexRuleExecutionResult {
    return applyRegexRules(text, this.rules, placement, options);
  }
}

export function applyRegexRules(
  text: string,
  rules: readonly RegexScriptRuleV3[],
  placement: RegexScriptPlacementV3,
  options: RegexRuleApplyOptions = {},
): RegexRuleExecutionResult {
  let output = text;
  const faults: RegexRuleExecutionFault[] = [];
  const maxInputLength = options.maxInputLength ?? DEFAULT_MAX_INPUT_LENGTH;

  if (output.length > maxInputLength) {
    return {
      faults: [
        {
          error: `Regex input exceeds ${maxInputLength} characters.`,
          ruleId: "registry",
          scriptName: "Regex Script Registry",
        },
      ],
      output,
    };
  }

  for (const rule of rules.map(normalizeRegexRule)) {
    if (rule.disabled || rule.placement !== placement || !rule.find) {
      continue;
    }

    try {
      output = output.replace(
        new RegExp(rule.find, sanitizeRegexFlags(rule.flags)),
        rule.replace,
      );
    } catch (error) {
      faults.push({
        error: error instanceof Error ? error.message : String(error),
        ruleId: rule.id,
        scriptName: rule.scriptName,
      });
    }
  }

  return { faults, output: injectRegexMacros(output, options.macroContext) };
}

export function applyRegexRulesToMessages<
  TMessage extends { content: string },
>(
  messages: readonly TMessage[],
  rules: readonly RegexScriptRuleV3[],
  placement: RegexScriptPlacementV3,
  options: RegexRuleApplyOptions = {},
): TMessage[] {
  return messages.map((message) => ({
    ...message,
    content: applyRegexRules(message.content, rules, placement, options).output,
  }));
}

export function injectRegexMacros(
  text: string,
  macroContext: RegexMacroContext = {},
): string {
  return text
    .replaceAll("{{user}}", macroContext.userName ?? "{{user}}")
    .replaceAll("{{char}}", macroContext.characterName ?? "{{char}}")
    .replaceAll("{{location}}", macroContext.location ?? "{{location}}");
}

export function normalizeRegexRule(rule: RegexScriptRuleV3): RegexScriptRuleV3 {
  return {
    disabled: Boolean(rule.disabled),
    find: rule.find,
    flags: sanitizeRegexFlags(rule.flags),
    id: rule.id.trim(),
    placement: rule.placement,
    replace: rule.replace,
    scriptName: rule.scriptName.trim() || rule.id.trim() || "Regex Script",
  };
}

function sanitizeRegexFlags(flags = "g") {
  const normalizedFlags = Array.from(flags)
    .filter((flag, index, source) => {
      return SUPPORTED_REGEX_FLAGS.has(flag) && source.indexOf(flag) === index;
    })
    .join("");

  return normalizedFlags || "g";
}
