use std::fs::File;
use std::io::{BufReader, BufWriter, Read};
use std::path::Path;

use base64::{engine::general_purpose, Engine as _};
use flate2::read::ZlibDecoder;
use png::{Decoder, Encoder};

use crate::codecs::card_path::normalize_card_to_v3;
use crate::models::character_card::CharacterCardV3;

pub fn extract_ccv3_from_png<P: AsRef<Path>>(path: P) -> Result<CharacterCardV3, String> {
    let png_data =
        std::fs::read(path).map_err(|error| format!("Failed to open PNG file: {error}"))?;

    let raw_json_payload = find_character_card_payload(&png_data)?;
    let verified_json = decode_metadata_payload(&raw_json_payload)?;
    let card: CharacterCardV3 = serde_json::from_str(&verified_json).map_err(|error| {
        format!("PNG metadata JSON payload does not conform to the current CCV3 schema: {error}")
    })?;

    Ok(normalize_card_to_v3(card))
}

pub fn inject_ccv3_into_png<SourcePath, OutputPath>(
    source_image_path: SourcePath,
    output_png_path: OutputPath,
    card_data: &CharacterCardV3,
) -> Result<(), String>
where
    SourcePath: AsRef<Path>,
    OutputPath: AsRef<Path>,
{
    let source_file = File::open(source_image_path)
        .map_err(|error| format!("Failed to open base PNG source file: {error}"))?;
    let decoder = Decoder::new(BufReader::new(source_file));
    let mut image_reader = decoder
        .read_info()
        .map_err(|error| format!("Source file is not a valid readable PNG: {error}"))?;
    let mut image_data_buffer = vec![0; image_reader.output_buffer_size()];
    let output_info = image_reader
        .next_frame(&mut image_data_buffer)
        .map_err(|error| format!("Failed parsing PNG pixel bitstream: {error}"))?;
    let image_data = &image_data_buffer[..output_info.buffer_size()];
    let ccv3_json_string = serde_json::to_string(card_data)
        .map_err(|error| format!("Failed serializing CCV3 metadata: {error}"))?;

    let output_png_path = output_png_path.as_ref();
    if let Some(parent_dir) = output_png_path.parent() {
        std::fs::create_dir_all(parent_dir)
            .map_err(|error| format!("Failed creating PNG output directory: {error}"))?;
    }

    let output_file = File::create(output_png_path)
        .map_err(|error| format!("Failed creating PNG output file: {error}"))?;
    let mut encoder = Encoder::new(
        BufWriter::new(output_file),
        output_info.width,
        output_info.height,
    );
    encoder.set_color(output_info.color_type);
    encoder.set_depth(output_info.bit_depth);
    encoder
        .add_text_chunk("ccv3".to_string(), ccv3_json_string)
        .map_err(|error| format!("Failed appending CCV3 PNG metadata chunk: {error}"))?;

    let mut writer = encoder
        .write_header()
        .map_err(|error| format!("Failed writing PNG container header: {error}"))?;
    writer
        .write_image_data(image_data)
        .map_err(|error| format!("Disk IO write failure during PNG encoding: {error}"))
}

fn find_character_card_payload(png_data: &[u8]) -> Result<String, String> {
    let mut chara_payload: Option<String> = None;

    for text_chunk in collect_text_chunks(png_data)? {
        let keyword = text_chunk.keyword.to_ascii_lowercase();

        if keyword == "ccv3" {
            return Ok(text_chunk.text);
        }

        if keyword == "chara" && chara_payload.is_none() {
            chara_payload = Some(text_chunk.text);
        }
    }

    chara_payload.ok_or_else(|| {
        "No character card metadata was found in this PNG. Expected a 'ccv3' or legacy 'chara' text chunk."
            .to_string()
    })
}

fn decode_metadata_payload(payload: &str) -> Result<String, String> {
    let trimmed_payload = payload.trim();

    if trimmed_payload.starts_with('{') {
        return Ok(trimmed_payload.to_string());
    }

    let cleaned_payload: String = trimmed_payload
        .chars()
        .filter(|character| !character.is_whitespace())
        .collect();
    let decoded_bytes = general_purpose::STANDARD
        .decode(cleaned_payload)
        .map_err(|error| format!("Invalid base64 payload in PNG metadata: {error}"))?;

    String::from_utf8(decoded_bytes)
        .map_err(|error| format!("Invalid UTF-8 string found in PNG metadata block: {error}"))
}

struct PngTextChunk {
    keyword: String,
    text: String,
}

fn collect_text_chunks(png_data: &[u8]) -> Result<Vec<PngTextChunk>, String> {
    const PNG_SIGNATURE: &[u8; 8] = b"\x89PNG\r\n\x1a\n";

    if png_data.len() < PNG_SIGNATURE.len() || &png_data[..8] != PNG_SIGNATURE {
        return Err("Source file is not a PNG image.".to_string());
    }

    let mut text_chunks = Vec::new();
    let mut cursor = PNG_SIGNATURE.len();

    while cursor + 12 <= png_data.len() {
        let length = u32::from_be_bytes([
            png_data[cursor],
            png_data[cursor + 1],
            png_data[cursor + 2],
            png_data[cursor + 3],
        ]) as usize;
        let chunk_type = &png_data[cursor + 4..cursor + 8];
        let data_start = cursor + 8;
        let data_end = data_start + length;
        let next_cursor = data_end + 4;

        if next_cursor > png_data.len() {
            return Err("PNG chunk table is truncated or corrupt.".to_string());
        }

        let chunk_data = &png_data[data_start..data_end];

        match chunk_type {
            b"tEXt" => {
                if let Some(chunk) = decode_text_chunk(chunk_data) {
                    text_chunks.push(chunk);
                }
            }
            b"zTXt" => {
                if let Some(chunk) = decode_compressed_text_chunk(chunk_data)? {
                    text_chunks.push(chunk);
                }
            }
            b"iTXt" => {
                if let Some(chunk) = decode_international_text_chunk(chunk_data)? {
                    text_chunks.push(chunk);
                }
            }
            b"IEND" => break,
            _ => {}
        }

        cursor = next_cursor;
    }

    Ok(text_chunks)
}

fn decode_text_chunk(chunk_data: &[u8]) -> Option<PngTextChunk> {
    let separator_index = chunk_data.iter().position(|byte| *byte == 0)?;
    let keyword = String::from_utf8_lossy(&chunk_data[..separator_index]).to_string();
    let text = String::from_utf8_lossy(&chunk_data[separator_index + 1..]).to_string();

    Some(PngTextChunk { keyword, text })
}

fn decode_compressed_text_chunk(chunk_data: &[u8]) -> Result<Option<PngTextChunk>, String> {
    let separator_index = match chunk_data.iter().position(|byte| *byte == 0) {
        Some(index) => index,
        None => return Ok(None),
    };
    let keyword = String::from_utf8_lossy(&chunk_data[..separator_index]).to_string();
    let compressed_data = match chunk_data.get(separator_index + 2..) {
        Some(data) => data,
        None => return Ok(None),
    };
    let mut decoder = ZlibDecoder::new(compressed_data);
    let mut text = String::new();

    decoder
        .read_to_string(&mut text)
        .map_err(|error| format!("Failed to decode compressed PNG text chunk: {error}"))?;

    Ok(Some(PngTextChunk { keyword, text }))
}

fn decode_international_text_chunk(chunk_data: &[u8]) -> Result<Option<PngTextChunk>, String> {
    let Some(keyword_end) = chunk_data.iter().position(|byte| *byte == 0) else {
        return Ok(None);
    };
    let keyword = String::from_utf8_lossy(&chunk_data[..keyword_end]).to_string();
    let Some(compression_flag) = chunk_data.get(keyword_end + 1).copied() else {
        return Ok(None);
    };
    let mut cursor = keyword_end + 3;

    for _ in 0..2 {
        let Some(relative_separator) = chunk_data[cursor..].iter().position(|byte| *byte == 0)
        else {
            return Ok(None);
        };
        cursor += relative_separator + 1;
    }

    let text = if compression_flag == 1 {
        let mut decoder = ZlibDecoder::new(&chunk_data[cursor..]);
        let mut decoded_text = String::new();
        decoder.read_to_string(&mut decoded_text).map_err(|error| {
            format!("Failed to decode compressed UTF-8 PNG text chunk: {error}")
        })?;
        decoded_text
    } else {
        String::from_utf8_lossy(&chunk_data[cursor..]).to_string()
    };

    Ok(Some(PngTextChunk { keyword, text }))
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::character_card::{
        AppMacroExtensions, CardDataV3, AMOURAI_EXTENSION_NAMESPACE,
    };
    use png::{BitDepth, ColorType};
    use serde_json::json;
    use std::collections::HashMap;
    use std::path::PathBuf;

    #[test]
    fn decodes_raw_json_metadata_payload() {
        let payload = decode_metadata_payload(r#" { "spec": "chara_card_v3" } "#)
            .expect("raw JSON metadata should decode");

        assert_eq!(payload, r#"{ "spec": "chara_card_v3" }"#);
    }

    #[test]
    fn decodes_base64_metadata_payload() {
        let payload = decode_metadata_payload("eyAic3BlYyI6ICJjaGFyYV9jYXJkX3YzIiB9")
            .expect("base64 JSON metadata should decode");

        assert_eq!(payload, r#"{ "spec": "chara_card_v3" }"#);
    }

    #[test]
    fn rejects_invalid_base64_metadata_payload() {
        let error =
            decode_metadata_payload("this is not card json").expect_err("payload should fail");

        assert!(error.contains("Invalid base64 payload"));
    }

    #[test]
    fn injects_ccv3_metadata_into_png() {
        let temp_dir = create_temp_dir("png-inject");
        let source_path = temp_dir.join("source.png");
        let output_path = temp_dir.join("output.png");
        write_fixture_png(&source_path);
        let card = fixture_card();

        inject_ccv3_into_png(&source_path, &output_path, &card)
            .expect("CCV3 metadata should inject");
        let parsed_card = extract_ccv3_from_png(&output_path).expect("injected card should parse");

        assert_eq!(parsed_card.spec, "chara_card_v3");
        assert_eq!(parsed_card.data.name, "Mara");
    }

    #[test]
    fn preserves_ccv3_png_round_trip_integrity_with_macro_extensions() {
        let temp_dir = create_temp_dir("png-round-trip");
        let source_path = temp_dir.join("source.png");
        let output_path = temp_dir.join("output.png");
        write_mock_base_png(&source_path);
        let source_card = fixture_card_with_macro_extensions();

        inject_ccv3_into_png(&source_path, &output_path, &source_card)
            .expect("valid CCV3 metadata should inject into PNG");
        let extracted_card =
            extract_ccv3_from_png(&output_path).expect("compiled PNG should extract");

        assert_eq!(extracted_card.spec, "chara_card_v3");
        assert_eq!(extracted_card.spec_version, "3.0");
        assert_eq!(extracted_card.data.name, "Test Character");
        assert_eq!(extracted_card.data.tags.len(), 2);
        assert_eq!(extracted_card.data.tags[0], "Fantasy");

        let macro_extensions: AppMacroExtensions = extracted_card
            .get_macro_extensions()
            .expect("HeartWriteAI macro extensions should survive PNG round trip");

        assert_eq!(macro_extensions.framework, "Narrative RPG");
        assert_eq!(macro_extensions.formatting, "W++");
        assert_eq!(macro_extensions.relationship, "Antagonistic");
        assert!(macro_extensions.tones.contains(&"Slow-Burn".to_string()));
        assert!(macro_extensions
            .micro_tropes
            .contains(&"Only One Bed".to_string()));
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

    fn fixture_card_with_macro_extensions() -> CharacterCardV3 {
        let mut extensions = HashMap::new();
        extensions.insert(
            AMOURAI_EXTENSION_NAMESPACE.to_string(),
            json!({
                "framework": "Narrative RPG",
                "formatting": "W++",
                "relationship": "Antagonistic",
                "tones": ["Slow-Burn", "Dark Romance"],
                "micro_tropes": ["Only One Bed", "Who Hurt You?"]
            }),
        );

        CharacterCardV3 {
            spec: "chara_card_v3".to_string(),
            spec_version: "3.0".to_string(),
            data: CardDataV3 {
                name: "Test Character".to_string(),
                description: "A comprehensive description string testing buffer limits."
                    .to_string(),
                personality: "Cold, calculating".to_string(),
                scenario: "Stuck in an abandoned bunker.".to_string(),
                first_mes: "Hello user.".to_string(),
                mes_example: String::new(),
                creator_notes: "Unit test data vector.".to_string(),
                system_prompt: String::new(),
                post_history_instructions: String::new(),
                alternate_greetings: Vec::new(),
                group_only_greetings: Vec::new(),
                tags: vec!["Fantasy".to_string(), "Knight".to_string()],
                creator: "Tauri Test Suite".to_string(),
                character_version: "1.0.0".to_string(),
                extensions,
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

    fn write_fixture_png(path: &Path) {
        let file = File::create(path).expect("fixture PNG file should be created");
        let mut encoder = Encoder::new(BufWriter::new(file), 1, 1);
        encoder.set_color(ColorType::Rgba);
        encoder.set_depth(BitDepth::Eight);
        let mut writer = encoder.write_header().expect("PNG header should write");
        writer
            .write_image_data(&[255, 0, 128, 255])
            .expect("PNG pixels should write");
    }

    fn write_mock_base_png(path: &Path) {
        let file = File::create(path).expect("mock PNG file should be created");
        let mut encoder = Encoder::new(BufWriter::new(file), 2, 2);
        encoder.set_color(ColorType::Rgba);
        encoder.set_depth(BitDepth::Eight);
        let mut writer = encoder
            .write_header()
            .expect("mock PNG header should write");
        let mock_pixels: [u8; 16] = [255; 16];
        writer
            .write_image_data(&mock_pixels)
            .expect("mock PNG pixels should write");
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
