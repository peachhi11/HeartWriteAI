#[cfg(test)]
mod tests {
    use crate::utils::{charx_bundler, image_converter, png_injector, png_parser};

    #[test]
    fn exposes_compatibility_utils_modules() {
        let _ = png_injector::inject_ccv3_into_png::<&str, &str>;
        let _ = png_parser::extract_ccv3_from_png::<&str>;
        let _ = image_converter::convert_to_standard_png::<&str, &str>;
        let _ = charx_bundler::create_charx_bundle::<&str, &str, &str>;
        let _ = charx_bundler::extract_ccv3_from_charx::<&str>;
    }
}
