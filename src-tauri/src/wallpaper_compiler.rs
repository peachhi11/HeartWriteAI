use serde::Serialize;
use std::collections::hash_map::DefaultHasher;
use std::fs::{copy, create_dir_all, rename, File};
use std::hash::{Hash, Hasher};
use std::path::{Path, PathBuf};
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::{AppHandle, Manager};
use tauri_plugin_dialog::DialogExt;

use crate::utils::assets::{is_supported_expression_path, local_asset_uri_for_path};

const WALLPAPER_STORAGE_DIR: &str = "wallpapers";

#[derive(Debug, Serialize, Clone, PartialEq, Eq)]
pub struct CompiledWallpaperPayload {
    #[serde(rename = "internalSandboxPath")]
    pub internal_sandbox_path: String,
    #[serde(rename = "assetProtocolUrl")]
    pub asset_protocol_url: String,
}

pub struct WallpaperCompiler;

impl WallpaperCompiler {
    pub fn pick_and_compile(app: &AppHandle) -> Result<CompiledWallpaperPayload, String> {
        let file_picker = app
            .dialog()
            .file()
            .add_filter("Wallpaper Image", &["avif", "jpg", "jpeg", "png", "webp"])
            .set_title("Select Local Workspace Wallpaper");

        let chosen_path = file_picker
            .blocking_pick_file()
            .ok_or_else(|| "Wallpaper compiler aborted by user.".to_string())?
            .into_path()
            .map_err(|error| format!("Failed to resolve selected wallpaper path: {error}"))?;

        compile_wallpaper_from_path(app, chosen_path)
    }
}

pub fn compile_wallpaper_from_path(
    app: &AppHandle,
    source_path: PathBuf,
) -> Result<CompiledWallpaperPayload, String> {
    let target_dir = app_data_subdir(app, WALLPAPER_STORAGE_DIR)?;
    compile_wallpaper_to_dir(source_path, target_dir)
}

fn compile_wallpaper_to_dir(
    source_path: PathBuf,
    target_dir: PathBuf,
) -> Result<CompiledWallpaperPayload, String> {
    if !source_path.is_file() {
        return Err("Target wallpaper source file no longer exists on disk.".to_string());
    }

    if !is_supported_expression_path(&source_path) {
        return Err("Wallpapers must be PNG, JPG, JPEG, WebP, or AVIF images.".to_string());
    }

    create_dir_all(&target_dir)
        .map_err(|error| format!("Wallpaper storage directory create failed: {error}"))?;

    let compiled_path = unique_compiled_path(&source_path, &target_dir, "wp")?;
    let tmp_path = compiled_path.with_extension(format!(
        "{}.tmp",
        compiled_path
            .extension()
            .and_then(|extension| extension.to_str())
            .unwrap_or("asset")
    ));

    copy(&source_path, &tmp_path)
        .map_err(|error| format!("Wallpaper compiler copy operation failed: {error}"))?;

    File::open(&tmp_path)
        .and_then(|file| file.sync_all())
        .map_err(|error| format!("Wallpaper compiler sync failed: {error}"))?;

    rename(&tmp_path, &compiled_path)
        .map_err(|error| format!("Wallpaper compiler finalize failed: {error}"))?;

    compiled_wallpaper_payload_for_path(compiled_path)
}

pub fn compiled_wallpaper_payload_for_path(
    path: PathBuf,
) -> Result<CompiledWallpaperPayload, String> {
    if !path.is_file() {
        return Err("Compiled wallpaper file is missing from app storage.".to_string());
    }

    if !is_supported_expression_path(&path) {
        return Err("Compiled wallpaper must be PNG, JPG, JPEG, WebP, or AVIF.".to_string());
    }

    let canonical_path = path.canonicalize().unwrap_or(path);
    let internal_sandbox_path = canonical_path.to_string_lossy().into_owned();
    let asset_protocol_url = local_asset_uri_for_path(&canonical_path);

    Ok(CompiledWallpaperPayload {
        internal_sandbox_path,
        asset_protocol_url,
    })
}

fn app_data_subdir(app: &AppHandle, subdir: &str) -> Result<PathBuf, String> {
    let mut path = app
        .path()
        .app_data_dir()
        .map_err(|_| "Failed to resolve sandboxed runtime data directory".to_string())?;
    path.push(subdir);
    Ok(path)
}

fn unique_compiled_path(
    source_path: &Path,
    target_dir: &Path,
    prefix: &str,
) -> Result<PathBuf, String> {
    let extension = normalized_extension(source_path)?;
    let hash = source_file_hash(source_path);
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_nanos())
        .unwrap_or(0);

    for attempt in 0..1000_u16 {
        let candidate = target_dir.join(format!(
            "{prefix}_{hash:016x}_{timestamp}_{attempt}.{extension}"
        ));
        if !candidate.exists() {
            return Ok(candidate);
        }
    }

    Err("Could not allocate a unique wallpaper filename.".to_string())
}

fn normalized_extension(path: &Path) -> Result<String, String> {
    let extension = path
        .extension()
        .and_then(|extension| extension.to_str())
        .ok_or_else(|| "Wallpaper source file has no extension.".to_string())?
        .to_ascii_lowercase();

    if matches!(extension.as_str(), "avif" | "jpeg" | "jpg" | "png" | "webp") {
        Ok(extension)
    } else {
        Err("Wallpapers must be PNG, JPG, JPEG, WebP, or AVIF images.".to_string())
    }
}

fn source_file_hash(path: &Path) -> u64 {
    let mut hasher = DefaultHasher::new();
    path.to_string_lossy().hash(&mut hasher);

    if let Ok(metadata) = path.metadata() {
        metadata.len().hash(&mut hasher);
        if let Ok(modified) = metadata.modified() {
            modified.hash(&mut hasher);
        }
    }

    hasher.finish()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn compiles_wallpaper_into_target_directory() {
        let source_path = unique_test_path("source image.png");
        let target_dir = unique_test_dir("wallpaper-storage");
        std::fs::write(&source_path, b"png placeholder").expect("fixture should write");

        let payload =
            compile_wallpaper_to_dir(source_path.clone(), target_dir.clone()).expect("compile");

        assert!(payload.internal_sandbox_path.contains("wallpaper-storage"));
        assert!(payload.internal_sandbox_path.ends_with(".png"));
        assert!(payload
            .asset_protocol_url
            .starts_with("ccv3-asset://localhost/"));
        assert!(Path::new(&payload.internal_sandbox_path).is_file());
        assert!(source_path.is_file());

        let _ = std::fs::remove_file(source_path);
        let _ = std::fs::remove_dir_all(target_dir);
    }

    #[test]
    fn rejects_unsupported_wallpaper_extensions() {
        let source_path = unique_test_path("source.txt");
        let target_dir = unique_test_dir("wallpaper-storage-invalid");
        std::fs::write(&source_path, b"not an image").expect("fixture should write");

        let error =
            compile_wallpaper_to_dir(source_path.clone(), target_dir.clone()).expect_err("reject");

        assert!(error.contains("Wallpapers must be"));
        let _ = std::fs::remove_file(source_path);
        let _ = std::fs::remove_dir_all(target_dir);
    }

    #[test]
    fn validates_compiled_wallpaper_payload_paths() {
        let source_path = unique_test_path("compiled.webp");
        std::fs::write(&source_path, b"webp placeholder").expect("fixture should write");

        let payload =
            compiled_wallpaper_payload_for_path(source_path.clone()).expect("payload should build");

        assert!(payload.internal_sandbox_path.ends_with(".webp"));
        assert!(payload
            .asset_protocol_url
            .starts_with("ccv3-asset://localhost/"));
        let _ = std::fs::remove_file(source_path);
    }

    fn unique_test_path(file_name: &str) -> PathBuf {
        std::env::temp_dir().join(format!(
            "heartwriteai-compiler-{}-{file_name}",
            std::process::id()
        ))
    }

    fn unique_test_dir(name: &str) -> PathBuf {
        let path = std::env::temp_dir().join(format!(
            "heartwriteai-compiler-{}-{name}",
            std::process::id()
        ));
        let _ = std::fs::remove_dir_all(&path);
        path
    }
}
