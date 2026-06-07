export interface ExportPrivacyScrubReport<T = unknown> {
  redactedCategories: string[];
  redactedCount: number;
  sanitizedPayload: T;
}

type SensitivePattern = {
  category: string;
  placeholder: string;
  regex: RegExp;
};

const SENSITIVE_PATTERNS: SensitivePattern[] = [
  {
    category: "anthropic_api_key",
    placeholder: "[REDACTED_ANTHROPIC_API_KEY]",
    regex: /\bsk-ant-[A-Za-z0-9_-]{32,}\b/,
  },
  {
    category: "openai_api_key",
    placeholder: "[REDACTED_OPENAI_API_KEY]",
    regex: /\bsk-(?!ant-)[A-Za-z0-9_-]{32,}\b/,
  },
  {
    category: "bearer_token",
    placeholder: "[REDACTED_BEARER_TOKEN]",
    regex: /\bbearer\s+[A-Za-z0-9\-._~+/]+=*\b/i,
  },
  {
    category: "inline_url_credentials",
    placeholder: "[REDACTED_URL_CREDENTIALS]",
    regex: /https?:\/\/[A-Za-z0-9_.~-]+:[A-Za-z0-9_.~!$&'()*+,;=-]+@[A-Za-z0-9.-]+/i,
  },
  {
    category: "assignment_credential",
    placeholder: "[REDACTED_ASSIGNMENT_CREDENTIAL]",
    regex: /\b(password|passwd|secret|api[-_]?key|token)\s*[:=]\s*["'][^"']{3,240}["']/i,
  },
];

const STRIPPED_EXPORT_KEYS = new Set([
  "chat_history",
  "chatHistory",
  "local_api_keys",
  "localApiKeys",
  "proxy_configurations",
  "proxyConfigurations",
  "user_settings",
  "userSettings",
]);

const OMITTED_EXPORT_KEYS = new Set(["semanticSeedIds"]);

export function scrubExportPayload<T>(payload: T): ExportPrivacyScrubReport<T> {
  const redactedCategories = new Set<string>();
  let redactedCount = 0;

  function markRedaction(category: string) {
    redactedCount += 1;
    redactedCategories.add(category);
  }

  function cleanNode(node: unknown, currentKey?: string): unknown {
    if (currentKey && STRIPPED_EXPORT_KEYS.has(currentKey)) {
      markRedaction(`field:${currentKey}`);
      return Array.isArray(node) ? [] : {};
    }

    if (typeof node === "string") {
      return scrubString(node, markRedaction);
    }

    if (Array.isArray(node)) {
      return node.map((item) => cleanNode(item));
    }

    if (isRecord(node)) {
      const entries: [string, unknown][] = [];
      for (const [key, value] of Object.entries(node)) {
        if (OMITTED_EXPORT_KEYS.has(key)) {
          markRedaction(`field:${key}`);
          continue;
        }

        entries.push([key, cleanNode(value, key)]);
      }

      return Object.fromEntries(entries);
    }

    return node;
  }

  const sanitizedPayload = cleanNode(payload) as T;

  return {
    redactedCategories: Array.from(redactedCategories),
    redactedCount,
    sanitizedPayload,
  };
}

export function scrubCardForPublicExport<T>(card: T): T {
  return scrubExportPayload(card).sanitizedPayload;
}

export function createExportPrivacyAuditNotice(report: ExportPrivacyScrubReport) {
  if (report.redactedCount === 0) {
    return "Export privacy check passed. No sensitive tokens or local config blocks were detected.";
  }

  return `Export privacy check redacted ${report.redactedCount} item(s): ${report.redactedCategories.join(", ")}.`;
}

function scrubString(
  value: string,
  markRedaction: (category: string) => void,
) {
  let output = value;

  for (const pattern of SENSITIVE_PATTERNS) {
    let match = output.match(pattern.regex);

    while (match?.index !== undefined) {
      const matchedText = match[0];
      output = `${output.slice(0, match.index)}${pattern.placeholder}${output.slice(
        match.index + matchedText.length,
      )}`;
      markRedaction(pattern.category);
      match = output.match(pattern.regex);
    }
  }

  return output;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}
