use tiktoken_rs::bpe_for_model;

const MAX_TOKEN_COUNT_TEXT_BYTES: usize = 2 * 1024 * 1024;

#[tauri::command]
pub fn count_tokens(text: String, model: String) -> Result<usize, String> {
    count_tokens_for_model(&text, &model)
}

#[tauri::command]
pub fn count_tokens_native(text: String, model: String) -> Result<usize, String> {
    count_tokens_for_model(&text, &model)
}

fn count_tokens_for_model(text: &str, model: &str) -> Result<usize, String> {
    if text.len() > MAX_TOKEN_COUNT_TEXT_BYTES {
        return Err(format!(
            "Token count input is too large for safe native processing. Limit is {} MB.",
            MAX_TOKEN_COUNT_TEXT_BYTES / (1024 * 1024)
        ));
    }

    let bpe = bpe_for_model(model).map_err(|_| {
        format!("Model encoding not found for '{model}'. Try gpt-4o, gpt-4, or gpt-3.5-turbo.")
    })?;
    Ok(bpe.encode_with_special_tokens(text).len())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn counts_tokens_for_gpt_4o() {
        let count = count_tokens_for_model("hello world", "gpt-4o")
            .expect("gpt-4o encoding should be available");

        assert_eq!(count, 2);
    }

    #[test]
    fn rejects_unknown_models() {
        let error = count_tokens_for_model("hello", "not-a-real-model")
            .expect_err("unknown models should be rejected");

        assert!(error.contains("Model encoding not found"));
    }

    #[test]
    fn rejects_oversized_inputs() {
        let oversized = "x".repeat(MAX_TOKEN_COUNT_TEXT_BYTES + 1);
        let error = count_tokens_for_model(&oversized, "gpt-4o")
            .expect_err("oversized text should be rejected");

        assert!(error.contains("too large for safe native processing"));
    }
}
