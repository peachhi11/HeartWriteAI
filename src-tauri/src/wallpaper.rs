use tauri::AppHandle;

use crate::wallpaper_compiler::{CompiledWallpaperPayload, WallpaperCompiler};

#[tauri::command]
pub async fn compile_and_register_wallpaper(
    app: AppHandle,
) -> Result<CompiledWallpaperPayload, String> {
    WallpaperCompiler::pick_and_compile(&app)
}

#[tauri::command]
pub async fn pick_custom_wallpaper_asset(
    app: AppHandle,
) -> Result<CompiledWallpaperPayload, String> {
    WallpaperCompiler::pick_and_compile(&app)
}
