use std::fs::{self, File};
use std::io::{Read, Seek, Write};
use std::path::{Component, Path};

use zip::write::SimpleFileOptions;
use zip::ZipWriter;

use crate::models::character_card::CharacterCardV3;
use crate::utils::assets::is_supported_expression_path;

pub fn compile_full_charx_bundle<OutputPath, SourcePath>(
    output_bundle_path: OutputPath,
    card_data: &CharacterCardV3,
    source_card_file_path: SourcePath,
) -> Result<(), String>
where
    OutputPath: AsRef<Path>,
    SourcePath: AsRef<Path>,
{
    let output_bundle_path = output_bundle_path.as_ref();
    if let Some(parent_dir) = output_bundle_path.parent() {
        fs::create_dir_all(parent_dir)
            .map_err(|error| format!("Failed creating CHARX output directory: {error}"))?;
    }

    let file = File::create(output_bundle_path)
        .map_err(|error| format!("Failed to create local destination archive file: {error}"))?;
    let mut zip = ZipWriter::new(file);
    let options = charx_file_options();

    write_card_json(&mut zip, card_data, options)?;

    if let Some(expression_sprites_dir) = expression_sprites_dir_for(source_card_file_path) {
        if expression_sprites_dir.is_dir() {
            append_sprites_directory_to_archive(
                &mut zip,
                &expression_sprites_dir,
                "assets/sprites",
            )?;
        }
    }

    zip.finish()
        .map_err(|error| format!("Failed compiling physical .charx container file: {error}"))?;

    Ok(())
}

fn write_card_json<W: Write + Seek>(
    zip: &mut ZipWriter<W>,
    card_data: &CharacterCardV3,
    options: SimpleFileOptions,
) -> Result<(), String> {
    zip.start_file("card.json", options)
        .map_err(|error| format!("Failed initializing internal zip block: {error}"))?;
    let json_bytes = serde_json::to_string_pretty(card_data)
        .map_err(|error| format!("JSON compilation sequence failed unexpectedly: {error}"))?;
    zip.write_all(json_bytes.as_bytes())
        .map_err(|error| format!("Failed writing card.json payload to container: {error}"))
}

fn expression_sprites_dir_for<P: AsRef<Path>>(
    source_card_file_path: P,
) -> Option<std::path::PathBuf> {
    let source_path = source_card_file_path.as_ref();
    let base_dir = source_path.parent()?;
    let card_stem = source_path.file_stem()?.to_str()?;

    Some(base_dir.join(format!("{card_stem}_assets/sprites")))
}

fn append_sprites_directory_to_archive<W: Write + Seek>(
    zip: &mut ZipWriter<W>,
    src_dir: &Path,
    target_internal_root_dir: &str,
) -> Result<(), String> {
    let options = charx_file_options();
    let mut entries = fs::read_dir(src_dir)
        .map_err(|error| format!("Failed reading asset subdirectory: {error}"))?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|error| format!("Failed reading asset subdirectory entry: {error}"))?;
    entries.sort_by_key(|entry| entry.path());

    for entry in entries {
        let path = entry.path();
        let file_name = entry
            .file_name()
            .into_string()
            .map_err(|_| "Invalid filename characters inside asset directories.".to_string())?;
        let safe_file_name = sanitize_zip_path_segment(&file_name);

        if safe_file_name.is_empty() {
            continue;
        }

        let internal_zip_path = format!("{target_internal_root_dir}/{safe_file_name}");

        if path.is_dir() {
            append_sprites_directory_to_archive(zip, &path, &internal_zip_path)?;
        } else if path.is_file() && is_supported_expression_path(&path) {
            append_file_to_zip(zip, &path, &internal_zip_path, options)?;
        }
    }

    Ok(())
}

fn append_file_to_zip<W: Write + Seek>(
    zip: &mut ZipWriter<W>,
    source_path: &Path,
    internal_path: &str,
    options: SimpleFileOptions,
) -> Result<(), String> {
    let safe_internal_path = sanitize_zip_path(internal_path)?;
    zip.start_file(safe_internal_path, options)
        .map_err(|error| format!("Failed opening file path inside ZIP boundary: {error}"))?;

    let mut img_file = File::open(source_path)
        .map_err(|error| format!("Failed opening local source image context: {error}"))?;
    let mut img_buffer = Vec::new();
    img_file
        .read_to_end(&mut img_buffer)
        .map_err(|error| format!("Failed reading image file to array stream: {error}"))?;
    zip.write_all(&img_buffer)
        .map_err(|error| format!("Archive compression buffer stream write error: {error}"))
}

fn charx_file_options() -> SimpleFileOptions {
    SimpleFileOptions::default()
        .compression_method(zip::CompressionMethod::Deflated)
        .unix_permissions(0o644)
}

fn sanitize_zip_path(path: &str) -> Result<String, String> {
    let mut safe_components = Vec::new();

    for component in Path::new(path).components() {
        match component {
            Component::Normal(segment) => {
                let segment = segment
                    .to_str()
                    .ok_or_else(|| "CHARX internal path contains non-UTF-8 data.".to_string())?;
                let safe_segment = sanitize_zip_path_segment(segment);
                if !safe_segment.is_empty() {
                    safe_components.push(safe_segment);
                }
            }
            Component::CurDir => {}
            Component::ParentDir | Component::RootDir | Component::Prefix(_) => {
                return Err("CHARX internal paths must be relative archive paths.".to_string());
            }
        }
    }

    if safe_components.is_empty() {
        return Err("CHARX internal path cannot be empty.".to_string());
    }

    Ok(safe_components.join("/"))
}

fn sanitize_zip_path_segment(segment: &str) -> String {
    segment
        .chars()
        .map(|character| {
            if character.is_ascii_alphanumeric() || matches!(character, '.' | '_' | '-' | ' ') {
                character
            } else {
                '_'
            }
        })
        .collect::<String>()
        .trim_matches([' ', '.'])
        .to_string()
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::character_card::{CardDataV3, CharacterCardV3};
    use std::collections::HashMap;
    use zip::ZipArchive;

    #[test]
    fn compiles_charx_bundle_with_adjacent_expression_sprites() {
        let temp_dir = create_temp_dir("full-charx");
        let source_card_path = temp_dir.join("mara.png");
        let sprites_dir = temp_dir.join("mara_assets/sprites");
        let output_path = temp_dir.join("mara.charx");
        fs::create_dir_all(&sprites_dir).expect("sprites dir should be created");
        fs::write(&source_card_path, b"png").expect("source card should write");
        fs::write(sprites_dir.join("blush.png"), b"sprite").expect("sprite should write");
        fs::write(sprites_dir.join("notes.txt"), b"skip").expect("ignored file should write");
        let card = fixture_card();

        compile_full_charx_bundle(&output_path, &card, &source_card_path)
            .expect("CHARX should compile");

        let file = File::open(output_path).expect("CHARX archive should open");
        let mut archive = ZipArchive::new(file).expect("CHARX archive should parse");
        assert!(archive.by_name("card.json").is_ok());
        assert!(archive.by_name("assets/sprites/blush.png").is_ok());
        assert!(archive.by_name("assets/sprites/notes.txt").is_err());
    }

    #[test]
    fn compiles_charx_bundle_without_expression_directory() {
        let temp_dir = create_temp_dir("full-charx-empty");
        let source_card_path = temp_dir.join("mara.png");
        let output_path = temp_dir.join("mara.charx");
        fs::write(&source_card_path, b"png").expect("source card should write");
        let card = fixture_card();

        compile_full_charx_bundle(&output_path, &card, &source_card_path)
            .expect("CHARX should compile without sprites");

        let parsed = crate::codecs::charx_card::extract_ccv3_from_charx(&output_path)
            .expect("CHARX should parse");
        assert_eq!(parsed.data.name, "Mara");
    }

    fn fixture_card() -> CharacterCardV3 {
        CharacterCardV3 {
            spec: "chara_card_v3".to_string(),
            spec_version: "3.0".to_string(),
            data: CardDataV3 {
                name: "Mara".to_string(),
                description: "Fixture".to_string(),
                personality: String::new(),
                scenario: String::new(),
                first_mes: String::new(),
                mes_example: String::new(),
                creator_notes: String::new(),
                system_prompt: String::new(),
                post_history_instructions: String::new(),
                alternate_greetings: Vec::new(),
                group_only_greetings: Vec::new(),
                tags: vec!["fixture".to_string()],
                creator: "test".to_string(),
                character_version: String::new(),
                extensions: HashMap::new(),
                character_book: None,
                assets: Vec::new(),
                nickname: None,
                creator_notes_multilingual: HashMap::new(),
                source: Vec::new(),
                creation_date: None,
                modification_date: None,
                extra: HashMap::new(),
            },
        }
    }

    fn create_temp_dir(name: &str) -> std::path::PathBuf {
        let path = std::env::temp_dir().join(format!("amourai-{name}-{}", std::process::id()));
        if path.exists() {
            fs::remove_dir_all(&path).expect("old temp dir should be removable");
        }
        fs::create_dir_all(&path).expect("temp dir should be created");
        path
    }
}
