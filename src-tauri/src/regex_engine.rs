use regex::RegexBuilder;

const MAX_REGEX_TEXT_BYTES: usize = 512 * 1024;
const MAX_REGEX_PATTERN_BYTES: usize = 8 * 1024;
const MAX_REGEX_REPLACEMENT_BYTES: usize = 64 * 1024;
const MAX_REGEX_MATCHES: usize = 1_000;

#[derive(Debug, serde::Deserialize)]
pub struct RegexExecutionRule {
    pub pattern: String,
    #[serde(default)]
    pub flags: String,
    #[serde(default)]
    pub replacement: Option<String>,
}

#[derive(Debug, serde::Serialize, PartialEq, Eq)]
pub struct RegexExecutionResult {
    pub matches: Vec<String>,
    pub output: String,
}

#[tauri::command]
pub fn execute_regex_native(
    pattern: String,
    text: String,
    flags: Option<String>,
) -> Result<Vec<String>, String> {
    ensure_size("Regex pattern", pattern.len(), MAX_REGEX_PATTERN_BYTES)?;
    ensure_size("Regex input", text.len(), MAX_REGEX_TEXT_BYTES)?;

    let regex = compile_regex(&pattern, flags.as_deref().unwrap_or(""))?;
    Ok(regex
        .find_iter(&text)
        .take(MAX_REGEX_MATCHES)
        .map(|mat| mat.as_str().to_string())
        .collect())
}

#[tauri::command]
pub fn apply_regex_native(
    rule: RegexExecutionRule,
    text: String,
) -> Result<RegexExecutionResult, String> {
    ensure_size("Regex pattern", rule.pattern.len(), MAX_REGEX_PATTERN_BYTES)?;
    ensure_size("Regex input", text.len(), MAX_REGEX_TEXT_BYTES)?;

    let replacement = rule.replacement.unwrap_or_default();
    ensure_size(
        "Regex replacement",
        replacement.len(),
        MAX_REGEX_REPLACEMENT_BYTES,
    )?;

    let regex = compile_regex(&rule.pattern, &rule.flags)?;
    let matches = regex
        .find_iter(&text)
        .take(MAX_REGEX_MATCHES)
        .map(|mat| mat.as_str().to_string())
        .collect();
    let output = regex.replace_all(&text, replacement.as_str()).to_string();

    Ok(RegexExecutionResult { matches, output })
}

fn compile_regex(pattern: &str, flags: &str) -> Result<regex::Regex, String> {
    let mut builder = RegexBuilder::new(pattern);

    for flag in flags.chars() {
        match flag {
            'i' => {
                builder.case_insensitive(true);
            }
            'm' => {
                builder.multi_line(true);
            }
            's' => {
                builder.dot_matches_new_line(true);
            }
            'u' | 'g' => {}
            other => {
                return Err(format!("Unsupported regex flag: {other}"));
            }
        }
    }

    builder
        .build()
        .map_err(|error| format!("Invalid regex pattern: {error}"))
}

fn ensure_size(label: &str, actual: usize, maximum: usize) -> Result<(), String> {
    if actual > maximum {
        Err(format!(
            "{label} exceeds safe regex limit ({actual} bytes > {maximum} bytes)."
        ))
    } else {
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn finds_matches_with_native_regex_engine() {
        let matches =
            execute_regex_native(r"\d+".to_string(), "A12 B340".to_string(), None).unwrap();

        assert_eq!(matches, vec!["12", "340"]);
    }

    #[test]
    fn applies_replacements_with_flags() {
        let result = apply_regex_native(
            RegexExecutionRule {
                flags: "i".to_string(),
                pattern: "alex".to_string(),
                replacement: Some("{{user}}".to_string()),
            },
            "Alex enters. alex waits.".to_string(),
        )
        .unwrap();

        assert_eq!(result.matches, vec!["Alex", "alex"]);
        assert_eq!(result.output, "{{user}} enters. {{user}} waits.");
    }

    #[test]
    fn rejects_unsupported_flags() {
        let error = execute_regex_native(
            "test".to_string(),
            "test".to_string(),
            Some("y".to_string()),
        )
        .unwrap_err();

        assert!(error.contains("Unsupported regex flag"));
    }

    #[test]
    fn rejects_oversized_input() {
        let error =
            execute_regex_native("x".to_string(), "x".repeat(MAX_REGEX_TEXT_BYTES + 1), None)
                .unwrap_err();

        assert!(error.contains("exceeds safe regex limit"));
    }
}
