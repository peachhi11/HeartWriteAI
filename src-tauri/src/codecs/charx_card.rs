use std::fs::File;
use std::io::{Read, Seek, Write};
use std::path::{Component, Path};

use zip::write::SimpleFileOptions;
use zip::{ZipArchive, ZipWriter};

use crate::models::character_card::CharacterCardV3;

pub fn create_charx_bundle<OutputPath, AvatarPath, AssetsPath>(
    output_path: OutputPath,
    card_data: &CharacterCardV3,
    avatar_path: Option<AvatarPath>,
    additional_assets_dir: Option<AssetsPath>,
) -> Result<(), String>
where
    OutputPath: AsRef<Path>,
    AvatarPath: AsRef<Path>,
    AssetsPath: AsRef<Path>,
{
    let output_path = output_path.as_ref();
    if let Some(parent_dir) = output_path.parent() {
        std::fs::create_dir_all(parent_dir).map_err(|error| {
            format!("Failed creating parent directory for CHARX archive: {error}")
        })?;
    }

    let file = File::create(output_path)
        .map_err(|error| format!("Failed to create local CHARX archive file: {error}"))?;
    let mut zip = ZipWriter::new(file);
    let options = charx_file_options();

    write_card_json(&mut zip, card_data, options)?;

    if let Some(path) = avatar_path {
        append_avatar_to_zip(&mut zip, path.as_ref(), options)?;
    }

    if let Some(assets_dir) = additional_assets_dir {
        let assets_dir = assets_dir.as_ref();
        if assets_dir.is_dir() {
            append_directory_to_zip(&mut zip, assets_dir, "assets/other", options)?;
        }
    }

    zip.finish()
        .map_err(|error| format!("Failed finalizing CHARX archive stream: {error}"))?;

    Ok(())
}

pub fn extract_ccv3_from_charx<P: AsRef<Path>>(path: P) -> Result<CharacterCardV3, String> {
    let file =
        File::open(path).map_err(|error| format!("Failed to open CHARX archive file: {error}"))?;
    let mut archive =
        ZipArchive::new(file).map_err(|error| format!("Invalid CHARX zip archive: {error}"))?;
    let mut card_file = archive
        .by_name("card.json")
        .map_err(|error| format!("CHARX archive is missing root card.json: {error}"))?;
    let mut json_string = String::new();
    card_file
        .read_to_string(&mut json_string)
        .map_err(|error| format!("Failed reading CHARX card.json: {error}"))?;

    serde_json::from_str(&json_string)
        .map_err(|error| format!("CHARX card.json does not conform to CCV3 schema: {error}"))
}

fn write_card_json<W: Write + Seek>(
    zip: &mut ZipWriter<W>,
    card_data: &CharacterCardV3,
    options: SimpleFileOptions,
) -> Result<(), String> {
    zip.start_file("card.json", options)
        .map_err(|error| format!("Failed initializing card.json zip entry: {error}"))?;

    let json_string = serde_json::to_string_pretty(card_data)
        .map_err(|error| format!("Failed compiling CCV3 card JSON: {error}"))?;
    zip.write_all(json_string.as_bytes())
        .map_err(|error| format!("Failed writing card.json into CHARX archive: {error}"))
}

fn append_avatar_to_zip<W: Write + Seek>(
    zip: &mut ZipWriter<W>,
    avatar_path: &Path,
    options: SimpleFileOptions,
) -> Result<(), String> {
    let extension = safe_extension(avatar_path).unwrap_or_else(|| "png".to_string());
    let internal_path = format!("assets/icon/images/main.{extension}");

    append_file_to_zip(zip, avatar_path, &internal_path, options)
}

fn append_directory_to_zip<W: Write + Seek>(
    zip: &mut ZipWriter<W>,
    src_dir: &Path,
    target_internal_dir: &str,
    options: SimpleFileOptions,
) -> Result<(), String> {
    let mut entries = std::fs::read_dir(src_dir)
        .map_err(|error| format!("Failed reading assets directory: {error}"))?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|error| format!("Failed reading assets directory entry: {error}"))?;
    entries.sort_by_key(|entry| entry.path());

    for entry in entries {
        let path = entry.path();
        let file_name = entry
            .file_name()
            .into_string()
            .map_err(|_| "Asset path contains non-UTF-8 characters.".to_string())?;
        let safe_file_name = sanitize_zip_path_segment(&file_name);

        if safe_file_name.is_empty() {
            continue;
        }

        let internal_path = format!("{target_internal_dir}/{safe_file_name}");
        if path.is_dir() {
            append_directory_to_zip(zip, &path, &internal_path, options)?;
        } else if path.is_file() {
            append_file_to_zip(zip, &path, &internal_path, options)?;
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
        .map_err(|error| format!("Failed initializing CHARX asset entry: {error}"))?;

    let mut file =
        File::open(source_path).map_err(|error| format!("Failed opening asset file: {error}"))?;
    let mut buffer = Vec::new();
    file.read_to_end(&mut buffer)
        .map_err(|error| format!("Failed reading asset file: {error}"))?;
    zip.write_all(&buffer)
        .map_err(|error| format!("Failed writing asset into CHARX archive: {error}"))
}

fn charx_file_options() -> SimpleFileOptions {
    SimpleFileOptions::default()
        .compression_method(zip::CompressionMethod::Deflated)
        .unix_permissions(0o644)
}

fn safe_extension(path: &Path) -> Option<String> {
    path.extension()
        .and_then(|extension| extension.to_str())
        .map(|extension| sanitize_zip_path_segment(&extension.to_ascii_lowercase()))
        .filter(|extension| !extension.is_empty())
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
    use crate::models::character_card::CardDataV3;
    use std::collections::HashMap;
    use std::io::Read;
    use std::path::PathBuf;
    use zip::ZipArchive;

    #[test]
    fn creates_charx_bundle_with_card_json_and_avatar() {
        let temp_dir = create_temp_dir("charx-bundle");
        let output_path = temp_dir.join("mara.charx");
        let avatar_path = temp_dir.join("avatar.png");
        std::fs::write(&avatar_path, b"not really a png").expect("avatar fixture should write");
        let card = fixture_card();

        create_charx_bundle(&output_path, &card, Some(&avatar_path), None::<&PathBuf>)
            .expect("CHARX bundle should be created");

        let file = File::open(output_path).expect("CHARX archive should open");
        let mut archive = ZipArchive::new(file).expect("CHARX archive should parse");
        let mut card_json = String::new();
        archive
            .by_name("card.json")
            .expect("card.json should exist")
            .read_to_string(&mut card_json)
            .expect("card.json should be readable");

        assert!(card_json.contains("\"spec\": \"chara_card_v3\""));
        assert!(archive.by_name("assets/icon/images/main.png").is_ok());
    }

    #[test]
    fn extracts_card_json_from_charx_bundle() {
        let temp_dir = create_temp_dir("charx-import");
        let output_path = temp_dir.join("mara.charx");
        let card = fixture_card();

        create_charx_bundle(&output_path, &card, None::<&PathBuf>, None::<&PathBuf>)
            .expect("CHARX bundle should be created");

        let parsed_card =
            extract_ccv3_from_charx(&output_path).expect("CHARX bundle should import");

        assert_eq!(parsed_card.data.name, "Mara");
        assert_eq!(parsed_card.spec, "chara_card_v3");
    }

    #[test]
    fn sanitizes_asset_paths_when_appending_directory() {
        let temp_dir = create_temp_dir("charx-assets");
        let assets_dir = temp_dir.join("assets");
        std::fs::create_dir_all(&assets_dir).expect("assets directory should be created");
        std::fs::write(assets_dir.join("unsafe:name.txt"), b"lore")
            .expect("asset fixture should write");
        let output_path = temp_dir.join("assets.charx");
        let card = fixture_card();

        create_charx_bundle(&output_path, &card, None::<&PathBuf>, Some(&assets_dir))
            .expect("CHARX bundle should be created");

        let file = File::open(output_path).expect("CHARX archive should open");
        let mut archive = ZipArchive::new(file).expect("CHARX archive should parse");

        assert!(archive.by_name("assets/other/unsafe_name.txt").is_ok());
    }

    fn fixture_card() -> CharacterCardV3 {
        CharacterCardV3 {
            spec: "chara_card_v3".to_string(),
            spec_version: "3.0".to_string(),
            data: CardDataV3 {
                name: "Mara".to_string(),
                description: "A guarded thief.".to_string(),
                personality: String::new(),
                scenario: String::new(),
                first_mes: String::new(),
                mes_example: String::new(),
                creator_notes: String::new(),
                system_prompt: String::new(),
                post_history_instructions: String::new(),
                alternate_greetings: Vec::new(),
                group_only_greetings: Vec::new(),
                tags: Vec::new(),
                creator: String::new(),
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

    fn create_temp_dir(name: &str) -> PathBuf {
        let temp_dir = std::env::temp_dir().join(format!(
            "amourai-{name}-{}",
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .expect("system clock should be after Unix epoch")
                .as_nanos()
        ));
        std::fs::create_dir_all(&temp_dir).expect("temporary directory should be created");
        temp_dir
    }
}
