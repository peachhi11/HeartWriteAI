use std::path::PathBuf;

use tauri::{AppHandle, WebviewWindow};
use tauri_plugin_dialog::DialogExt;

#[tauri::command]
pub async fn capture_viewport_screenshot(
    app: AppHandle,
    window: WebviewWindow,
) -> Result<String, String> {
    let destination = pick_screenshot_destination(&app)?;

    #[cfg(target_os = "macos")]
    {
        window
            .set_focus()
            .map_err(|error| format!("Failed to focus capture target window: {error}"))?;

        let window_number = macos_window_number(&window)?;
        let output_path = destination.clone();
        let capture_result = tauri::async_runtime::spawn_blocking(move || {
            capture_macos_window(window_number, output_path)
        })
        .await
        .map_err(|error| format!("Screenshot worker thread failed: {error}"))?;

        capture_result?;
        Ok(destination.to_string_lossy().into_owned())
    }

    #[cfg(not(target_os = "macos"))]
    {
        let _ = window;
        let _ = destination;
        Err("Native viewport screenshot capture is currently implemented for macOS.".to_string())
    }
}

fn pick_screenshot_destination(app: &AppHandle) -> Result<PathBuf, String> {
    let selected_path = app
        .dialog()
        .file()
        .add_filter("PNG Image", &["png"])
        .set_file_name("story_moment.png")
        .set_title("Export Visual Screenshot Snap")
        .blocking_save_file()
        .ok_or_else(|| "Screenshot export aborted by player.".to_string())?
        .into_path()
        .map_err(|error| format!("Failed to resolve screenshot export path: {error}"))?;

    Ok(ensure_png_extension(selected_path))
}

fn ensure_png_extension(mut path: PathBuf) -> PathBuf {
    let already_png = path
        .extension()
        .and_then(|extension| extension.to_str())
        .is_some_and(|extension| extension.eq_ignore_ascii_case("png"));

    if !already_png {
        path.set_extension("png");
    }

    path
}

#[cfg(target_os = "macos")]
fn macos_window_number(window: &WebviewWindow) -> Result<i64, String> {
    let raw_window = window
        .ns_window()
        .map_err(|error| format!("Failed to resolve native AppKit window handle: {error}"))?;

    if raw_window.is_null() {
        return Err("Native AppKit window handle was null.".to_string());
    }

    let window_ref = unsafe { &*(raw_window.cast::<objc2_app_kit::NSWindow>()) };
    let window_number = window_ref.windowNumber();

    if window_number <= 0 {
        return Err("Native AppKit window number was unavailable.".to_string());
    }

    Ok(window_number as i64)
}

#[cfg(target_os = "macos")]
fn capture_macos_window(window_number: i64, destination: PathBuf) -> Result<(), String> {
    let output = std::process::Command::new("screencapture")
        .arg("-x")
        .arg("-l")
        .arg(window_number.to_string())
        .arg(&destination)
        .output()
        .map_err(|error| format!("Failed to start macOS screencapture: {error}"))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!(
            "macOS screencapture failed with status {}: {}",
            output.status,
            stderr.trim()
        ));
    }

    if !destination.is_file() {
        return Err("Screenshot export completed without creating a PNG file.".to_string());
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::ensure_png_extension;
    use std::path::PathBuf;

    #[test]
    fn keeps_existing_png_extension() {
        assert_eq!(
            ensure_png_extension(PathBuf::from("/tmp/story.PNG")),
            PathBuf::from("/tmp/story.PNG")
        );
    }

    #[test]
    fn adds_png_extension_when_missing() {
        assert_eq!(
            ensure_png_extension(PathBuf::from("/tmp/story_moment")),
            PathBuf::from("/tmp/story_moment.png")
        );
    }

    #[test]
    fn replaces_non_png_extension() {
        assert_eq!(
            ensure_png_extension(PathBuf::from("/tmp/story_moment.jpg")),
            PathBuf::from("/tmp/story_moment.png")
        );
    }
}
