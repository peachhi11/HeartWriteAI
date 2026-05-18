use std::fs::File;
use std::io::BufWriter;
use std::path::Path;

use image::ImageFormat;

pub fn convert_to_standard_png<InputPath, OutputPath>(
    input_path: InputPath,
    output_path: OutputPath,
) -> Result<(), String>
where
    InputPath: AsRef<Path>,
    OutputPath: AsRef<Path>,
{
    let input_path = input_path.as_ref();
    let output_path = output_path.as_ref();
    let image = image::open(input_path)
        .map_err(|error| format!("Failed to read or decode source image file: {error}"))?;

    if let Some(parent_dir) = output_path.parent() {
        std::fs::create_dir_all(parent_dir).map_err(|error| {
            format!("Failed creating parent directory for normalized PNG: {error}")
        })?;
    }

    let output_file = File::create(output_path)
        .map_err(|error| format!("Failed to create destination PNG file: {error}"))?;
    let mut writer = BufWriter::new(output_file);

    image
        .write_to(&mut writer, ImageFormat::Png)
        .map_err(|error| format!("Failed writing normalized PNG pixel buffer: {error}"))
}

#[cfg(test)]
mod tests {
    use super::*;
    use image::{Rgb, RgbImage};
    use std::path::PathBuf;

    #[test]
    fn converts_jpeg_to_standard_png() {
        let temp_dir = create_temp_dir("image-convert");
        let input_path = temp_dir.join("avatar.jpg");
        let output_path = temp_dir.join("avatar.png");
        let image = RgbImage::from_pixel(2, 2, Rgb([255, 0, 128]));
        image
            .save_with_format(&input_path, ImageFormat::Jpeg)
            .expect("JPEG fixture should write");

        convert_to_standard_png(&input_path, &output_path).expect("image should convert to PNG");

        assert_eq!(
            image::ImageReader::open(output_path)
                .expect("PNG should open")
                .with_guessed_format()
                .expect("format should be guessed")
                .format(),
            Some(ImageFormat::Png)
        );
    }

    #[test]
    fn rejects_invalid_source_image() {
        let temp_dir = create_temp_dir("image-invalid");
        let input_path = temp_dir.join("avatar.txt");
        let output_path = temp_dir.join("avatar.png");
        std::fs::write(&input_path, b"not an image").expect("invalid fixture should write");

        let error =
            convert_to_standard_png(&input_path, &output_path).expect_err("decode should fail");

        assert!(error.contains("Failed to read or decode source image file"));
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
