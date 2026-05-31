use std::fs::File;
use std::io::{BufReader, BufWriter, Read};
use std::path::Path;

use base64::{engine::general_purpose, Engine as _};
use flate2::read::ZlibDecoder;
use png::{Decoder, Encoder};

use crate::codecs::card_path::normalize_card_to_v3;
use crate::models::character_card::CharacterCardV3;

const MAX_PNG_FILE_SIZE_BYTES: u64 = 20 * 1024 * 1024;
const MAX_TEXT_CHUNK_BYTES: usize = 2 * 1024 * 1024;
const MAX_TOTAL_DECODED_TEXT_BYTES: usize = 4 * 1024 * 1024;

pub fn extract_ccv3_from_png<P: AsRef<Path>>(path: P) -> Result<CharacterCardV3, String> {
    let metadata = std::fs::metadata(path.as_ref())
        .map_err(|error| format!("Failed to inspect PNG file metadata: {error}"))?;
    if metadata.len() > MAX_PNG_FILE_SIZE_BYTES {
        return Err(format!(
            "PNG file is too large for safe character card import. Limit is {} MB.",
            MAX_PNG_FILE_SIZE_BYTES / (1024 * 1024)
        ));
    }

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

    if trimmed_payload.len() > MAX_TOTAL_DECODED_TEXT_BYTES {
        return Err("PNG metadata payload is too large for safe decoding.".to_string());
    }

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
    if decoded_bytes.len() > MAX_TOTAL_DECODED_TEXT_BYTES {
        return Err("Decoded PNG metadata payload is too large for safe import.".to_string());
    }

    String::from_utf8(decoded_bytes)
        .map_err(|error| format!("Invalid UTF-8 string found in PNG metadata block: {error}"))
}

#[derive(Debug)]
struct PngTextChunk {
    keyword: String,
    text: String,
}

fn collect_text_chunks(png_data: &[u8]) -> Result<Vec<PngTextChunk>, String> {
    const PNG_SIGNATURE: &[u8; 8] = b"\x89PNG\r\n\x1a\n";

    if png_data.len() as u64 > MAX_PNG_FILE_SIZE_BYTES {
        return Err(format!(
            "PNG file is too large for safe character card import. Limit is {} MB.",
            MAX_PNG_FILE_SIZE_BYTES / (1024 * 1024)
        ));
    }

    if png_data.len() < PNG_SIGNATURE.len() || &png_data[..8] != PNG_SIGNATURE {
        return Err("Source file is not a PNG image.".to_string());
    }

    let mut text_chunks = Vec::new();
    let mut decoded_text_bytes = 0usize;
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
        let data_end = data_start
            .checked_add(length)
            .ok_or_else(|| "PNG chunk length overflowed parser bounds.".to_string())?;
        let next_cursor = data_end
            .checked_add(4)
            .ok_or_else(|| "PNG chunk cursor overflowed parser bounds.".to_string())?;

        if next_cursor > png_data.len() {
            return Err("PNG chunk table is truncated or corrupt.".to_string());
        }

        let chunk_data = &png_data[data_start..data_end];

        match chunk_type {
            b"tEXt" => {
                validate_text_chunk_size(length)?;
                if let Some(chunk) = decode_text_chunk(chunk_data) {
                    push_supported_text_chunk(&mut text_chunks, chunk, &mut decoded_text_bytes)?;
                }
            }
            b"zTXt" => {
                validate_text_chunk_size(length)?;
                if let Some(chunk) = decode_compressed_text_chunk(chunk_data, decoded_text_bytes)? {
                    push_supported_text_chunk(&mut text_chunks, chunk, &mut decoded_text_bytes)?;
                }
            }
            b"iTXt" => {
                validate_text_chunk_size(length)?;
                if let Some(chunk) =
                    decode_international_text_chunk(chunk_data, decoded_text_bytes)?
                {
                    push_supported_text_chunk(&mut text_chunks, chunk, &mut decoded_text_bytes)?;
                }
            }
            b"IEND" => break,
            _ => {}
        }

        cursor = next_cursor;
    }

    Ok(text_chunks)
}

fn validate_text_chunk_size(length: usize) -> Result<(), String> {
    if length > MAX_TEXT_CHUNK_BYTES {
        return Err(format!(
            "PNG text metadata chunk is too large for safe import. Limit is {} MB.",
            MAX_TEXT_CHUNK_BYTES / (1024 * 1024)
        ));
    }

    Ok(())
}

fn push_supported_text_chunk(
    text_chunks: &mut Vec<PngTextChunk>,
    chunk: PngTextChunk,
    decoded_text_bytes: &mut usize,
) -> Result<(), String> {
    let keyword = chunk.keyword.to_ascii_lowercase();
    if keyword != "ccv3" && keyword != "chara" {
        return Ok(());
    }

    *decoded_text_bytes = decoded_text_bytes
        .checked_add(chunk.text.len())
        .ok_or_else(|| "PNG metadata text accounting overflowed.".to_string())?;
    if *decoded_text_bytes > MAX_TOTAL_DECODED_TEXT_BYTES {
        return Err("Combined PNG metadata text is too large for safe import.".to_string());
    }

    text_chunks.push(chunk);
    Ok(())
}

fn decode_text_chunk(chunk_data: &[u8]) -> Option<PngTextChunk> {
    let separator_index = chunk_data.iter().position(|byte| *byte == 0)?;
    let keyword = String::from_utf8_lossy(&chunk_data[..separator_index]).to_string();
    let text = String::from_utf8_lossy(&chunk_data[separator_index + 1..]).to_string();

    Some(PngTextChunk { keyword, text })
}

fn decode_compressed_text_chunk(
    chunk_data: &[u8],
    current_decoded_text_bytes: usize,
) -> Result<Option<PngTextChunk>, String> {
    let separator_index = match chunk_data.iter().position(|byte| *byte == 0) {
        Some(index) => index,
        None => return Ok(None),
    };
    let keyword = String::from_utf8_lossy(&chunk_data[..separator_index]).to_string();
    if !is_supported_text_keyword(&keyword) {
        return Ok(None);
    }
    let compression_method = match chunk_data.get(separator_index + 1).copied() {
        Some(method) => method,
        None => return Ok(None),
    };
    if compression_method != 0 {
        return Err("Unsupported compression method in PNG zTXt chunk.".to_string());
    }
    let compressed_data = match chunk_data.get(separator_index + 2..) {
        Some(data) => data,
        None => return Ok(None),
    };
    let mut decoder = ZlibDecoder::new(compressed_data);
    let text = read_limited_utf8_text(&mut decoder, current_decoded_text_bytes)?;

    Ok(Some(PngTextChunk { keyword, text }))
}

fn decode_international_text_chunk(
    chunk_data: &[u8],
    current_decoded_text_bytes: usize,
) -> Result<Option<PngTextChunk>, String> {
    let Some(keyword_end) = chunk_data.iter().position(|byte| *byte == 0) else {
        return Ok(None);
    };
    let keyword = String::from_utf8_lossy(&chunk_data[..keyword_end]).to_string();
    if !is_supported_text_keyword(&keyword) {
        return Ok(None);
    }
    let Some(compression_flag) = chunk_data.get(keyword_end + 1).copied() else {
        return Ok(None);
    };
    let Some(compression_method) = chunk_data.get(keyword_end + 2).copied() else {
        return Ok(None);
    };
    if compression_flag == 1 && compression_method != 0 {
        return Err("Unsupported compression method in PNG iTXt chunk.".to_string());
    }
    if compression_flag > 1 {
        return Err("Unsupported compression flag in PNG iTXt chunk.".to_string());
    }
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
        read_limited_utf8_text(&mut decoder, current_decoded_text_bytes)?
    } else {
        String::from_utf8_lossy(&chunk_data[cursor..]).to_string()
    };

    Ok(Some(PngTextChunk { keyword, text }))
}

fn is_supported_text_keyword(keyword: &str) -> bool {
    matches!(keyword.to_ascii_lowercase().as_str(), "ccv3" | "chara")
}

fn read_limited_utf8_text<R: Read>(
    reader: &mut R,
    current_decoded_text_bytes: usize,
) -> Result<String, String> {
    let remaining_budget = MAX_TOTAL_DECODED_TEXT_BYTES
        .checked_sub(current_decoded_text_bytes)
        .ok_or_else(|| "Combined PNG metadata text is too large for safe import.".to_string())?;
    let mut limited_reader = reader.take((remaining_budget + 1) as u64);
    let mut output = String::new();

    limited_reader
        .read_to_string(&mut output)
        .map_err(|error| format!("Failed to decode compressed PNG text chunk: {error}"))?;
    if output.len() > remaining_budget {
        return Err("Compressed PNG metadata expands beyond safe import limits.".to_string());
    }

    Ok(output)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::character_card::{
        AppMacroExtensions, CardDataV3, AMOURAI_EXTENSION_NAMESPACE,
    };
    use flate2::{write::ZlibEncoder, Compression};
    use png::{BitDepth, ColorType};
    use serde_json::json;
    use std::collections::HashMap;
    use std::io::Write;
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
    fn rejects_png_files_over_safe_import_limit() {
        let mut oversized_png = Vec::with_capacity(MAX_PNG_FILE_SIZE_BYTES as usize + 1);
        oversized_png.extend_from_slice(b"\x89PNG\r\n\x1a\n");
        oversized_png.resize(MAX_PNG_FILE_SIZE_BYTES as usize + 1, 0);

        let error = collect_text_chunks(&oversized_png).expect_err("file should be rejected");

        assert!(error.contains("too large"));
    }

    #[test]
    fn rejects_oversized_raw_text_chunks_before_decoding() {
        let png_data = assemble_png_chunks(vec![(
            *b"tEXt",
            create_text_chunk("ccv3", &"x".repeat(MAX_TEXT_CHUNK_BYTES + 1)),
        )]);

        let error = collect_text_chunks(&png_data).expect_err("chunk should be rejected");

        assert!(error.contains("text metadata chunk is too large"));
    }

    #[test]
    fn rejects_compressed_text_chunks_that_expand_past_limit() {
        let oversized_text = "x".repeat(MAX_TOTAL_DECODED_TEXT_BYTES + 1);
        let compressed_payload = compress_zlib(oversized_text.as_bytes());
        let mut chunk_data = Vec::new();
        chunk_data.extend_from_slice(b"ccv3");
        chunk_data.push(0);
        chunk_data.push(0);
        chunk_data.extend_from_slice(&compressed_payload);
        let png_data = assemble_png_chunks(vec![(*b"zTXt", chunk_data)]);

        let error = collect_text_chunks(&png_data).expect_err("chunk should be rejected");

        assert!(error.contains("expands beyond safe import limits"));
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

    fn create_text_chunk(keyword: &str, text: &str) -> Vec<u8> {
        let mut chunk = Vec::with_capacity(keyword.len() + text.len() + 1);
        chunk.extend_from_slice(keyword.as_bytes());
        chunk.push(0);
        chunk.extend_from_slice(text.as_bytes());
        chunk
    }

    fn assemble_png_chunks(chunks: Vec<([u8; 4], Vec<u8>)>) -> Vec<u8> {
        let mut png_data = Vec::new();
        png_data.extend_from_slice(b"\x89PNG\r\n\x1a\n");

        for (chunk_type, chunk_data) in chunks {
            png_data.extend_from_slice(&(chunk_data.len() as u32).to_be_bytes());
            png_data.extend_from_slice(&chunk_type);
            png_data.extend_from_slice(&chunk_data);
            png_data.extend_from_slice(&0u32.to_be_bytes());
        }

        png_data.extend_from_slice(&0u32.to_be_bytes());
        png_data.extend_from_slice(b"IEND");
        png_data.extend_from_slice(&0u32.to_be_bytes());
        png_data
    }

    fn compress_zlib(bytes: &[u8]) -> Vec<u8> {
        let mut encoder = ZlibEncoder::new(Vec::new(), Compression::best());
        encoder
            .write_all(bytes)
            .expect("fixture compression should write");
        encoder.finish().expect("fixture compression should finish")
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
