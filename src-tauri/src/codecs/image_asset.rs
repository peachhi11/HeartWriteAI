use std::fs::File;
use std::io::BufWriter;
use std::path::Path;

use image::{imageops::FilterType, GenericImageView, ImageFormat};

const STANDARD_PORTRAIT_WIDTH: u32 = 720;
const STANDARD_PORTRAIT_HEIGHT: u32 = 1280;

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

    let image = crop_to_portrait_nine_sixteen(image);

    image
        .write_to(&mut writer, ImageFormat::Png)
        .map_err(|error| format!("Failed writing normalized PNG pixel buffer: {error}"))
}

fn crop_to_portrait_nine_sixteen(image: image::DynamicImage) -> image::DynamicImage {
    let (width, height) = image.dimensions();
    let target_width = u64::from(STANDARD_PORTRAIT_WIDTH);
    let target_height = u64::from(STANDARD_PORTRAIT_HEIGHT);
    let source_width = u64::from(width);
    let source_height = u64::from(height);

    let (crop_width, crop_height) = if source_width * target_height > source_height * target_width {
        let crop_width = ((source_height * target_width) / target_height).max(1) as u32;
        (crop_width, height)
    } else {
        let crop_height = ((source_width * target_height) / target_width).max(1) as u32;
        (width, crop_height)
    };

    let crop_x = width.saturating_sub(crop_width) / 2;
    let crop_y = height.saturating_sub(crop_height) / 2;

    image
        .crop_imm(crop_x, crop_y, crop_width, crop_height)
        .resize_exact(
            STANDARD_PORTRAIT_WIDTH,
            STANDARD_PORTRAIT_HEIGHT,
            FilterType::Lanczos3,
        )
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

        let output = image::ImageReader::open(output_path)
            .expect("PNG should open")
            .with_guessed_format()
            .expect("format should be guessed");

        assert_eq!(output.format(), Some(ImageFormat::Png));
        assert_eq!(
            output.decode().expect("PNG should decode").dimensions(),
            (STANDARD_PORTRAIT_WIDTH, STANDARD_PORTRAIT_HEIGHT)
        );
    }

    #[test]
    fn normalizes_wide_images_to_nine_sixteen_portrait_png() {
        let temp_dir = create_temp_dir("image-wide-crop");
        let input_path = temp_dir.join("wide.png");
        let output_path = temp_dir.join("wide.standard.png");
        let image = RgbImage::from_pixel(36, 16, Rgb([24, 80, 140]));
        image
            .save_with_format(&input_path, ImageFormat::Png)
            .expect("wide PNG fixture should write");

        convert_to_standard_png(&input_path, &output_path).expect("image should convert to PNG");

        assert_eq!(
            image::ImageReader::open(output_path)
                .expect("PNG should open")
                .with_guessed_format()
                .expect("format should be guessed")
                .decode()
                .expect("PNG should decode")
                .dimensions(),
            (STANDARD_PORTRAIT_WIDTH, STANDARD_PORTRAIT_HEIGHT)
        );
    }

    #[test]
    fn normalizes_tall_images_to_nine_sixteen_portrait_png() {
        let temp_dir = create_temp_dir("image-tall-crop");
        let input_path = temp_dir.join("tall.png");
        let output_path = temp_dir.join("tall.standard.png");
        let image = RgbImage::from_pixel(9, 36, Rgb([180, 60, 120]));
        image
            .save_with_format(&input_path, ImageFormat::Png)
            .expect("tall PNG fixture should write");

        convert_to_standard_png(&input_path, &output_path).expect("image should convert to PNG");

        assert_eq!(
            image::ImageReader::open(output_path)
                .expect("PNG should open")
                .with_guessed_format()
                .expect("format should be guessed")
                .decode()
                .expect("PNG should decode")
                .dimensions(),
            (STANDARD_PORTRAIT_WIDTH, STANDARD_PORTRAIT_HEIGHT)
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
