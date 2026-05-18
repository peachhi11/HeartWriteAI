use serde::Serialize;
use std::fs;
use std::path::Path;

#[derive(Serialize, Debug, Clone, PartialEq)]
pub struct ExpressionSprite {
    pub name: String,
    pub local_uri: String,
    pub raw_path: String,
}

#[tauri::command]
pub async fn scan_character_expressions(
    card_file_path: String,
) -> Result<Vec<ExpressionSprite>, String> {
    scan_character_expressions_for_path(card_file_path)
}

pub fn scan_character_expressions_for_path<P: AsRef<Path>>(
    card_file_path: P,
) -> Result<Vec<ExpressionSprite>, String> {
    let card_path = card_file_path.as_ref();
    let base_dir = card_path
        .parent()
        .ok_or_else(|| "Failed resolving parent directory structure".to_string())?;
    let card_stem = card_path
        .file_stem()
        .and_then(|stem| stem.to_str())
        .ok_or_else(|| "Malformed file asset pointer handles".to_string())?;
    let expressions_dir = base_dir.join(format!("{card_stem}_assets/sprites"));

    scan_expression_directory(expressions_dir)
}

pub fn scan_expression_directory<P: AsRef<Path>>(
    expressions_dir: P,
) -> Result<Vec<ExpressionSprite>, String> {
    let expressions_dir = expressions_dir.as_ref();
    if !expressions_dir.exists() {
        return Ok(Vec::new());
    }

    let mut sprites = Vec::new();
    let mut entries = fs::read_dir(expressions_dir)
        .map_err(|error| format!("Failed reading expression directory: {error}"))?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|error| format!("Failed reading expression directory entry: {error}"))?;
    entries.sort_by_key(|entry| entry.path());

    for entry in entries {
        let path = entry.path();
        if !path.is_file() || !is_supported_expression_path(&path) {
            continue;
        }

        let file_name = path
            .file_name()
            .and_then(|file_name| file_name.to_str())
            .ok_or_else(|| "Expression sprite contains a non-UTF-8 file name.".to_string())?
            .to_string();
        let raw_path = path
            .canonicalize()
            .unwrap_or(path)
            .to_string_lossy()
            .into_owned();

        sprites.push(ExpressionSprite {
            name: file_name,
            local_uri: format!("ccv3-asset://localhost/{}", percent_encode_path(&raw_path)),
            raw_path,
        });
    }

    sprites.sort_by(|left, right| left.name.cmp(&right.name));
    Ok(sprites)
}

pub fn decode_asset_uri_path(encoded_path: &str) -> String {
    percent_decode_path(encoded_path.trim_start_matches('/'))
}

pub fn is_supported_expression_path(path: &Path) -> bool {
    path.extension()
        .and_then(|extension| extension.to_str())
        .map(|extension| {
            matches!(
                extension.to_ascii_lowercase().as_str(),
                "avif" | "jpeg" | "jpg" | "png" | "webp"
            )
        })
        .unwrap_or(false)
}

pub fn mime_type_for_expression_path(path: &Path) -> &'static str {
    match path
        .extension()
        .and_then(|extension| extension.to_str())
        .map(|extension| extension.to_ascii_lowercase())
        .as_deref()
    {
        Some("avif") => "image/avif",
        Some("jpeg" | "jpg") => "image/jpeg",
        Some("png") => "image/png",
        Some("webp") => "image/webp",
        _ => "application/octet-stream",
    }
}

fn percent_encode_path(path: &str) -> String {
    let mut encoded = String::new();
    for byte in path.bytes() {
        if byte.is_ascii_alphanumeric() || matches!(byte, b'-' | b'_' | b'.' | b'~') {
            encoded.push(byte as char);
        } else {
            encoded.push_str(&format!("%{byte:02X}"));
        }
    }
    encoded
}

fn percent_decode_path(path: &str) -> String {
    let mut decoded = Vec::with_capacity(path.len());
    let bytes = path.as_bytes();
    let mut index = 0;

    while index < bytes.len() {
        if bytes[index] == b'%' && index + 2 < bytes.len() {
            if let Ok(hex) = std::str::from_utf8(&bytes[index + 1..index + 3]) {
                if let Ok(value) = u8::from_str_radix(hex, 16) {
                    decoded.push(value);
                    index += 3;
                    continue;
                }
            }
        }

        decoded.push(bytes[index]);
        index += 1;
    }

    String::from_utf8_lossy(&decoded).into_owned()
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::PathBuf;

    #[test]
    fn scans_expression_sprites_in_stable_order() {
        let temp_dir = create_temp_dir("expression-scan");
        let card_path = temp_dir.join("mara.png");
        let sprite_dir = temp_dir.join("mara_assets/sprites");
        fs::create_dir_all(&sprite_dir).expect("sprite dir should be created");
        fs::write(sprite_dir.join("sad.webp"), b"webp").expect("sprite should write");
        fs::write(sprite_dir.join("blush.png"), b"png").expect("sprite should write");
        fs::write(sprite_dir.join("notes.txt"), b"nope").expect("ignored file should write");
        fs::write(&card_path, b"card").expect("card path fixture should write");

        let sprites = scan_character_expressions_for_path(&card_path).expect("sprites should scan");

        assert_eq!(sprites.len(), 2);
        assert_eq!(sprites[0].name, "blush.png");
        assert_eq!(sprites[1].name, "sad.webp");
        assert!(sprites[0].local_uri.starts_with("ccv3-asset://localhost/"));
    }

    #[test]
    fn missing_expression_directory_returns_empty_list() {
        let temp_dir = create_temp_dir("expression-missing");
        let card_path = temp_dir.join("mara.png");
        fs::write(&card_path, b"card").expect("card path fixture should write");

        let sprites =
            scan_character_expressions_for_path(&card_path).expect("missing dir should scan");

        assert!(sprites.is_empty());
    }

    #[test]
    fn encodes_and_decodes_asset_protocol_paths() {
        let original = "/tmp/character cards/mara blush.png";
        let uri = format!("ccv3-asset://localhost/{}", percent_encode_path(original));
        let encoded_path = uri
            .strip_prefix("ccv3-asset://localhost")
            .expect("uri prefix should strip");

        assert_eq!(decode_asset_uri_path(encoded_path), original);
    }

    fn create_temp_dir(name: &str) -> PathBuf {
        let path = std::env::temp_dir().join(format!("amourai-{name}-{}", std::process::id()));
        if path.exists() {
            fs::remove_dir_all(&path).expect("old temp dir should be removable");
        }
        fs::create_dir_all(&path).expect("temp dir should be created");
        path
    }
}
