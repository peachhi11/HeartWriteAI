use chrono::Utc;
use serde::{Deserialize, Serialize};
use std::fs::{self, File};
use std::io::{Read, Write};
use std::path::{Component, Path, PathBuf};
use tauri::{AppHandle, Manager};
use zip::write::SimpleFileOptions;
use zip::{CompressionMethod, ZipArchive, ZipWriter};

const BACKUP_KIND: &str = "heartwriteai-local-backup";
const MAX_BACKUP_ARCHIVE_BYTES: u64 = 250 * 1024 * 1024;
const MAX_RESTORE_ENTRY_BYTES: u64 = 50 * 1024 * 1024;
const MAX_RESTORE_TOTAL_BYTES: u64 = 500 * 1024 * 1024;
const MAX_RESTORE_ENTRY_COUNT: usize = 10_000;
const APP_DATA_PREFIX: &str = "app_data";
const APP_CONFIG_PREFIX: &str = "app_config";

const APP_DATA_DIR_ALLOWLIST: &[&str] = &[
    "cache",
    "character-cards",
    "chat-session-trees",
    "lorebooks",
    "personas",
    "relationship-runtime-slots",
    "user_profiles",
    "wallpapers",
];

const APP_DATA_FILE_ALLOWLIST: &[&str] = &["library_cache.db", "relationship-runtime-profile.json"];

const APP_CONFIG_FILE_ALLOWLIST: &[&str] = &["inference-settings.json", "settings.json"];

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LocalBackupResult {
    pub archive_path: String,
    pub archived_files: usize,
    pub archive_bytes: u64,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LocalRestoreResult {
    pub restored_files: usize,
    pub skipped_directories: usize,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct LocalBackupManifest {
    archive_kind: &'static str,
    created_at: String,
    archived_roots: Vec<&'static str>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct LocalBackupManifestPayload {
    archive_kind: String,
}

#[tauri::command]
pub async fn export_local_backup(
    app_handle: AppHandle,
    destination_zip_path: String,
) -> Result<LocalBackupResult, String> {
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|_| "Failed to resolve native app data path".to_string())?;
    let app_config_dir = app_handle
        .path()
        .app_config_dir()
        .map_err(|_| "Failed to resolve native app config path".to_string())?;
    let destination_path = validate_backup_destination(&destination_zip_path)?;

    tauri::async_runtime::spawn_blocking(move || {
        export_local_backup_to_path(&app_data_dir, &app_config_dir, &destination_path)
    })
    .await
    .map_err(|error| format!("Backup export thread panicked: {error}"))?
}

#[tauri::command]
pub async fn restore_local_backup(
    app_handle: AppHandle,
    source_zip_path: String,
) -> Result<LocalRestoreResult, String> {
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|_| "Failed to resolve native app data path".to_string())?;
    let app_config_dir = app_handle
        .path()
        .app_config_dir()
        .map_err(|_| "Failed to resolve native app config path".to_string())?;
    let source_path = validate_restore_source(&source_zip_path)?;

    tauri::async_runtime::spawn_blocking(move || {
        restore_local_backup_from_path(&app_data_dir, &app_config_dir, &source_path)
    })
    .await
    .map_err(|error| format!("Backup restore thread panicked: {error}"))?
}

fn export_local_backup_to_path(
    app_data_dir: &Path,
    app_config_dir: &Path,
    destination_path: &Path,
) -> Result<LocalBackupResult, String> {
    if let Some(parent) = destination_path.parent() {
        fs::create_dir_all(parent)
            .map_err(|error| format!("Failed to prepare backup destination folder: {error}"))?;
    }

    let file = File::create(destination_path)
        .map_err(|error| format!("Failed to create backup archive: {error}"))?;
    let mut zip = ZipWriter::new(file);
    let options = backup_zip_options();
    let mut archived_files = 0;

    let manifest = LocalBackupManifest {
        archive_kind: BACKUP_KIND,
        created_at: Utc::now().to_rfc3339(),
        archived_roots: vec![APP_DATA_PREFIX, APP_CONFIG_PREFIX],
    };
    zip.start_file("manifest.json", options)
        .map_err(|error| format!("Failed to start backup manifest: {error}"))?;
    let manifest_json = serde_json::to_vec_pretty(&manifest)
        .map_err(|error| format!("Failed to serialize backup manifest: {error}"))?;
    zip.write_all(&manifest_json)
        .map_err(|error| format!("Failed to write backup manifest: {error}"))?;
    archived_files += 1;

    archived_files += archive_allowed_root(
        &mut zip,
        options,
        app_data_dir,
        APP_DATA_PREFIX,
        APP_DATA_DIR_ALLOWLIST,
        APP_DATA_FILE_ALLOWLIST,
    )?;
    archived_files += archive_allowed_root(
        &mut zip,
        options,
        app_config_dir,
        APP_CONFIG_PREFIX,
        &[],
        APP_CONFIG_FILE_ALLOWLIST,
    )?;

    zip.finish()
        .map_err(|error| format!("Failed to finish backup archive: {error}"))?;

    let archive_bytes = fs::metadata(destination_path)
        .map_err(|error| format!("Failed to inspect backup archive: {error}"))?
        .len();

    Ok(LocalBackupResult {
        archive_path: destination_path.to_string_lossy().into_owned(),
        archived_files,
        archive_bytes,
    })
}

fn restore_local_backup_from_path(
    app_data_dir: &Path,
    app_config_dir: &Path,
    source_path: &Path,
) -> Result<LocalRestoreResult, String> {
    let archive_bytes = fs::metadata(source_path)
        .map_err(|error| format!("Failed to inspect backup archive: {error}"))?
        .len();
    if archive_bytes > MAX_BACKUP_ARCHIVE_BYTES {
        return Err(format!(
            "Backup archive is too large to restore safely ({:.2} MB).",
            archive_bytes as f64 / (1024.0 * 1024.0)
        ));
    }

    let file = File::open(source_path)
        .map_err(|error| format!("Failed to open backup archive: {error}"))?;
    let mut archive =
        ZipArchive::new(file).map_err(|error| format!("Invalid backup zip archive: {error}"))?;

    if archive.len() > MAX_RESTORE_ENTRY_COUNT {
        return Err("Backup archive contains too many files to restore safely.".to_string());
    }

    validate_restore_archive(&mut archive)?;

    let mut restored_files = 0;
    let mut skipped_directories = 0;

    for index in 0..archive.len() {
        let mut entry = archive
            .by_index(index)
            .map_err(|error| format!("Could not read backup entry: {error}"))?;
        let entry_name = entry.name().to_string();
        if entry_name == "manifest.json" {
            continue;
        }

        let target_path = resolve_restore_target(app_data_dir, app_config_dir, &entry_name)?;

        if entry.is_dir() {
            fs::create_dir_all(&target_path)
                .map_err(|error| format!("Failed to restore backup directory: {error}"))?;
            skipped_directories += 1;
            continue;
        }

        if let Some(parent) = target_path.parent() {
            fs::create_dir_all(parent)
                .map_err(|error| format!("Failed to prepare restore directory: {error}"))?;
        }

        let mut output = File::create(&target_path)
            .map_err(|error| format!("Failed to create restored file: {error}"))?;
        std::io::copy(&mut entry, &mut output)
            .map_err(|error| format!("Failed to write restored file: {error}"))?;
        restored_files += 1;
    }

    Ok(LocalRestoreResult {
        restored_files,
        skipped_directories,
    })
}

fn archive_allowed_root<W: Write + std::io::Seek>(
    zip: &mut ZipWriter<W>,
    options: SimpleFileOptions,
    root_dir: &Path,
    zip_prefix: &str,
    allowed_dirs: &[&str],
    allowed_files: &[&str],
) -> Result<usize, String> {
    let mut archived_files = 0;

    for file_name in allowed_files {
        let path = root_dir.join(file_name);
        if path.is_file() {
            let archive_name = format!("{zip_prefix}/{file_name}");
            append_file_to_backup(zip, options, &path, &archive_name)?;
            archived_files += 1;
        }
    }

    for dir_name in allowed_dirs {
        let path = root_dir.join(dir_name);
        if path.is_dir() {
            archived_files += archive_directory(zip, options, root_dir, &path, zip_prefix)?;
        }
    }

    Ok(archived_files)
}

fn archive_directory<W: Write + std::io::Seek>(
    zip: &mut ZipWriter<W>,
    options: SimpleFileOptions,
    root_dir: &Path,
    current_dir: &Path,
    zip_prefix: &str,
) -> Result<usize, String> {
    let mut archived_files = 0;

    for entry in fs::read_dir(current_dir)
        .map_err(|error| format!("Failed to read backup directory: {error}"))?
    {
        let entry = entry.map_err(|error| format!("Failed to inspect backup file: {error}"))?;
        let path = entry.path();

        if path.is_dir() {
            archived_files += archive_directory(zip, options, root_dir, &path, zip_prefix)?;
            continue;
        }

        if !path.is_file() {
            continue;
        }

        let relative = path
            .strip_prefix(root_dir)
            .map_err(|error| format!("Failed to calculate backup path: {error}"))?
            .to_string_lossy()
            .replace('\\', "/");
        let archive_name = format!("{zip_prefix}/{relative}");
        append_file_to_backup(zip, options, &path, &archive_name)?;
        archived_files += 1;
    }

    Ok(archived_files)
}

fn append_file_to_backup<W: Write + std::io::Seek>(
    zip: &mut ZipWriter<W>,
    options: SimpleFileOptions,
    path: &Path,
    archive_name: &str,
) -> Result<(), String> {
    validate_safe_zip_components(archive_name)?;
    zip.start_file(archive_name, options)
        .map_err(|error| format!("Failed to start backup file entry: {error}"))?;

    let mut file =
        File::open(path).map_err(|error| format!("Failed to open backup source file: {error}"))?;
    std::io::copy(&mut file, zip)
        .map_err(|error| format!("Failed to write backup file entry: {error}"))?;
    Ok(())
}

fn validate_restore_archive<R: Read + std::io::Seek>(
    archive: &mut ZipArchive<R>,
) -> Result<(), String> {
    let mut has_manifest = false;
    let mut total_restore_bytes = 0_u64;

    for index in 0..archive.len() {
        let entry = archive
            .by_index(index)
            .map_err(|error| format!("Could not read backup entry: {error}"))?;
        let entry_name = entry.name().to_string();

        if entry_name == "manifest.json" {
            let manifest: LocalBackupManifestPayload = serde_json::from_reader(entry)
                .map_err(|error| format!("Backup manifest is invalid: {error}"))?;
            if manifest.archive_kind != BACKUP_KIND {
                return Err("Backup archive was not created by HeartWriteAI.".to_string());
            }
            has_manifest = true;
            continue;
        }

        if entry.size() > MAX_RESTORE_ENTRY_BYTES {
            return Err(format!(
                "Backup entry is too large to restore: {entry_name}"
            ));
        }
        total_restore_bytes = total_restore_bytes
            .checked_add(entry.size())
            .ok_or_else(|| "Backup archive restore size overflowed.".to_string())?;
        if total_restore_bytes > MAX_RESTORE_TOTAL_BYTES {
            return Err("Backup archive expands beyond the safe restore limit.".to_string());
        }

        validate_restore_entry_name(&entry_name)?;
    }

    if !has_manifest {
        return Err("Backup archive is missing its manifest.".to_string());
    }

    Ok(())
}

fn resolve_restore_target(
    app_data_dir: &Path,
    app_config_dir: &Path,
    entry_name: &str,
) -> Result<PathBuf, String> {
    validate_restore_entry_name(entry_name)?;
    let relative = Path::new(entry_name);
    let mut components = relative.components();
    let Some(Component::Normal(prefix)) = components.next() else {
        return Err("Backup entry is missing a restore root.".to_string());
    };

    let remaining = components.as_path();
    if prefix == APP_DATA_PREFIX {
        return Ok(app_data_dir.join(remaining));
    }
    if prefix == APP_CONFIG_PREFIX {
        return Ok(app_config_dir.join(remaining));
    }

    Err("Backup entry uses an unsupported restore root.".to_string())
}

fn validate_restore_entry_name(entry_name: &str) -> Result<(), String> {
    validate_safe_zip_components(entry_name)?;

    let path = Path::new(entry_name);
    let mut components = path.components();
    let Some(Component::Normal(prefix)) = components.next() else {
        return Err("Backup entry is missing a restore root.".to_string());
    };

    let prefix = prefix.to_string_lossy();
    let Some(Component::Normal(first_child)) = components.next() else {
        return Err("Backup entry is missing a restore target.".to_string());
    };
    let first_child = first_child.to_string_lossy();

    match prefix.as_ref() {
        APP_DATA_PREFIX => {
            if APP_DATA_DIR_ALLOWLIST.contains(&first_child.as_ref())
                || APP_DATA_FILE_ALLOWLIST.contains(&first_child.as_ref())
            {
                Ok(())
            } else {
                Err(format!(
                    "Backup app-data entry is not restorable: {first_child}"
                ))
            }
        }
        APP_CONFIG_PREFIX => {
            if APP_CONFIG_FILE_ALLOWLIST.contains(&first_child.as_ref()) {
                Ok(())
            } else {
                Err(format!(
                    "Backup config entry is not restorable: {first_child}"
                ))
            }
        }
        _ => Err("Backup entry uses an unsupported restore root.".to_string()),
    }
}

fn validate_safe_zip_components(path: &str) -> Result<(), String> {
    if path.trim().is_empty()
        || path.starts_with('/')
        || path.starts_with('\\')
        || path.contains('\\')
    {
        return Err("Backup entry has an unsafe path.".to_string());
    }

    for component in Path::new(path).components() {
        match component {
            Component::Normal(_) => {}
            _ => return Err("Backup entry contains unsafe path traversal.".to_string()),
        }
    }

    Ok(())
}

fn validate_backup_destination(path: &str) -> Result<PathBuf, String> {
    let path = PathBuf::from(path.trim());
    if path.as_os_str().is_empty() {
        return Err("Choose a backup destination first.".to_string());
    }
    if !path.is_absolute() {
        return Err("Backup destination must be an absolute file path.".to_string());
    }
    if path.extension().and_then(|extension| extension.to_str()) != Some("zip") {
        return Err("Backup destination must end in .zip.".to_string());
    }
    Ok(path)
}

fn validate_restore_source(path: &str) -> Result<PathBuf, String> {
    let path = PathBuf::from(path.trim());
    if path.as_os_str().is_empty() {
        return Err("Choose a backup archive first.".to_string());
    }
    if !path.is_absolute() {
        return Err("Backup source must be an absolute file path.".to_string());
    }
    if path.extension().and_then(|extension| extension.to_str()) != Some("zip") {
        return Err("Backup source must be a .zip archive.".to_string());
    }
    if !path.is_file() {
        return Err("Backup source file does not exist.".to_string());
    }
    Ok(path)
}

fn backup_zip_options() -> SimpleFileOptions {
    SimpleFileOptions::default()
        .compression_method(CompressionMethod::Deflated)
        .unix_permissions(0o600)
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::io::Cursor;

    #[test]
    fn validates_restore_entry_allowlist() {
        assert!(validate_restore_entry_name("app_data/chat-session-trees/a.json").is_ok());
        assert!(validate_restore_entry_name("app_data/library_cache.db").is_ok());
        assert!(validate_restore_entry_name("app_config/settings.json").is_ok());
        assert!(validate_restore_entry_name("app_data/../settings.json").is_err());
        assert!(validate_restore_entry_name("/app_data/chat-session-trees/a.json").is_err());
        assert!(validate_restore_entry_name("app_data/secrets.env").is_err());
        assert!(validate_restore_entry_name("app_config/unknown.json").is_err());
    }

    #[test]
    fn rejects_archives_without_manifest_or_with_unsafe_entries() {
        let mut raw = Cursor::new(Vec::new());
        {
            let mut zip = ZipWriter::new(&mut raw);
            zip.start_file("app_data/chat-session-trees/a.json", backup_zip_options())
                .unwrap();
            zip.write_all(b"{}").unwrap();
            zip.finish().unwrap();
        }
        raw.set_position(0);
        let mut archive = ZipArchive::new(raw).unwrap();
        assert!(validate_restore_archive(&mut archive).is_err());

        let mut raw = Cursor::new(Vec::new());
        {
            let mut zip = ZipWriter::new(&mut raw);
            zip.start_file("manifest.json", backup_zip_options())
                .unwrap();
            zip.write_all(br#"{"archiveKind":"heartwriteai-local-backup"}"#)
                .unwrap();
            zip.start_file("../escape.json", backup_zip_options())
                .unwrap();
            zip.write_all(b"bad").unwrap();
            zip.finish().unwrap();
        }
        raw.set_position(0);
        let mut archive = ZipArchive::new(raw).unwrap();
        assert!(validate_restore_archive(&mut archive).is_err());
    }

    #[test]
    fn exports_and_restores_allowed_local_backup_files() {
        let root = std::env::temp_dir().join(format!(
            "heartwriteai_local_backup_test_{}_{}",
            std::process::id(),
            Utc::now().timestamp_nanos_opt().unwrap_or_default()
        ));
        let app_data = root.join("data");
        let app_config = root.join("config");
        let restore_data = root.join("restore-data");
        let restore_config = root.join("restore-config");
        fs::create_dir_all(app_data.join("chat-session-trees")).unwrap();
        fs::create_dir_all(&app_config).unwrap();
        fs::write(
            app_data.join("chat-session-trees/session.json"),
            b"{\"ok\":true}",
        )
        .unwrap();
        fs::write(app_config.join("settings.json"), b"{\"theme\":\"rose\"}").unwrap();

        let archive_path = root.join("backup.zip");
        let result = export_local_backup_to_path(&app_data, &app_config, &archive_path).unwrap();
        assert!(result.archived_files >= 3);

        let restored =
            restore_local_backup_from_path(&restore_data, &restore_config, &archive_path).unwrap();
        assert_eq!(
            fs::read_to_string(restore_data.join("chat-session-trees/session.json")).unwrap(),
            "{\"ok\":true}"
        );
        assert_eq!(
            fs::read_to_string(restore_config.join("settings.json")).unwrap(),
            "{\"theme\":\"rose\"}"
        );
        assert!(restored.restored_files >= 2);

        let _ = fs::remove_dir_all(root);
    }
}
