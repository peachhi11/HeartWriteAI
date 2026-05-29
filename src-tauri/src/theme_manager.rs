use serde::{Deserialize, Serialize};
use std::fs::{create_dir_all, rename, File};
use std::io::{Read, Write};
use std::path::{Path, PathBuf};
use std::sync::Mutex;
use tauri::{AppHandle, Manager, State};

use crate::wallpaper_compiler::compiled_wallpaper_payload_for_path;

const SETTINGS_FILE: &str = "settings.json";
const HEX_COLOR_LENGTH: usize = 7;
const MAX_ID_LENGTH: usize = 64;
const MAX_NAME_LENGTH: usize = 48;
const ALLOWED_DIM_COLORS: [&str; 3] = ["zinc", "rose", "indigo"];
const ALLOWED_FONT_FAMILIES: [&str; 3] = ["serif", "sans", "mono"];
const ALLOWED_BG_VIGNETTES: [&str; 4] = [
    "from-rose-950/40 via-transparent",
    "from-cyan-950/40 via-transparent",
    "from-amber-950/30 via-transparent",
    "from-zinc-900/60 via-transparent",
];

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq)]
pub struct UserThemeConfig {
    pub id: String,
    pub name: String,
    #[serde(rename = "primaryGlow")]
    pub primary_glow: String,
    #[serde(rename = "bgVignette")]
    pub bg_vignette: String,
    #[serde(rename = "fontFamily")]
    pub font_family: String,
    #[serde(rename = "cardOpacity")]
    pub card_opacity: u32,
    #[serde(rename = "customWallpaper", default)]
    pub custom_wallpaper: Option<WallpaperPreference>,
    #[serde(default)]
    pub legibility: LegibilityEngineConfig,
    #[serde(default)]
    pub transparency: InterfaceOpacityConfig,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq)]
pub struct LegibilityEngineConfig {
    #[serde(rename = "brightnessLevel")]
    pub brightness_level: u32,
    #[serde(rename = "blurRadius")]
    pub blur_radius: u32,
    #[serde(rename = "dimColor")]
    pub dim_color: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq)]
pub struct InterfaceOpacityConfig {
    #[serde(rename = "panelOpacity")]
    pub panel_opacity: u32,
    #[serde(rename = "borderOpacity")]
    pub border_opacity: u32,
    #[serde(rename = "textGlowAlpha")]
    pub text_glow_alpha: u32,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq)]
pub struct WallpaperPreference {
    #[serde(rename = "internalSandboxPath", alias = "rawAbsolutePath")]
    pub internal_sandbox_path: String,
    #[serde(rename = "assetProtocolUrl")]
    pub asset_protocol_url: String,
}

impl Default for LegibilityEngineConfig {
    fn default() -> Self {
        Self {
            brightness_level: 30,
            blur_radius: 8,
            dim_color: "zinc".to_string(),
        }
    }
}

impl Default for InterfaceOpacityConfig {
    fn default() -> Self {
        Self {
            panel_opacity: 45,
            border_opacity: 30,
            text_glow_alpha: 20,
        }
    }
}

impl Default for UserThemeConfig {
    fn default() -> Self {
        Self {
            id: "dark-romance".to_string(),
            name: "Crimson Velvet".to_string(),
            primary_glow: "#e11d48".to_string(),
            bg_vignette: "from-rose-950/40 via-transparent".to_string(),
            font_family: "serif".to_string(),
            card_opacity: 40,
            custom_wallpaper: None,
            legibility: LegibilityEngineConfig::default(),
            transparency: InterfaceOpacityConfig::default(),
        }
    }
}

pub struct AppSettingsState {
    pub current_theme: Mutex<UserThemeConfig>,
}

impl AppSettingsState {
    pub fn load_on_boot(app: &AppHandle) -> Self {
        let current_theme = Self::get_config_path(app)
            .and_then(|path| load_theme_from_path(&path))
            .unwrap_or_else(|error| {
                eprintln!("Theme settings boot load fell back to defaults: {error}");
                UserThemeConfig::default()
            });

        Self {
            current_theme: Mutex::new(current_theme),
        }
    }

    pub fn save_to_disk(
        &self,
        app: AppHandle,
        incoming_config: UserThemeConfig,
    ) -> Result<UserThemeConfig, String> {
        let safe_config = normalize_theme_config(incoming_config);

        *self
            .current_theme
            .lock()
            .map_err(|_| "Theme settings mutex poisoned".to_string())? = safe_config.clone();

        let disk_snapshot = safe_config.clone();
        std::thread::spawn(move || {
            match Self::get_config_path(&app)
                .and_then(|target_path| persist_theme_to_path(&target_path, &disk_snapshot))
            {
                Ok(()) => {}
                Err(error) => eprintln!("Theme settings save failed: {error}"),
            }
        });

        Ok(safe_config)
    }

    fn get_config_path(app: &AppHandle) -> Result<PathBuf, String> {
        let mut path = app
            .path()
            .app_config_dir()
            .map_err(|_| "Failed to locate native OS app configuration path".to_string())?;

        create_dir_all(&path).map_err(|error| format!("OS directory allocation fault: {error}"))?;
        path.push(SETTINGS_FILE);
        Ok(path)
    }
}

#[tauri::command]
pub fn export_user_theme_preferences(
    config: UserThemeConfig,
    app: AppHandle,
    settings: State<'_, AppSettingsState>,
) -> Result<UserThemeConfig, String> {
    settings.save_to_disk(app, config)
}

#[tauri::command]
pub fn get_boot_theme_settings(
    settings: State<'_, AppSettingsState>,
) -> Result<UserThemeConfig, String> {
    settings
        .current_theme
        .lock()
        .map(|theme| theme.clone())
        .map_err(|_| "Theme settings read lock failure".to_string())
}

fn load_theme_from_path(path: &Path) -> Result<UserThemeConfig, String> {
    if !path.exists() {
        return Ok(UserThemeConfig::default());
    }

    let mut file =
        File::open(path).map_err(|error| format!("Theme settings open failed: {error}"))?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)
        .map_err(|error| format!("Theme settings read failed: {error}"))?;
    let theme: UserThemeConfig = serde_json::from_str(&contents)
        .map_err(|error| format!("Theme settings JSON parse failed: {error}"))?;

    Ok(normalize_theme_config(theme))
}

fn persist_theme_to_path(path: &Path, theme: &UserThemeConfig) -> Result<(), String> {
    if let Some(parent) = path.parent() {
        create_dir_all(parent)
            .map_err(|error| format!("Theme settings directory create failed: {error}"))?;
    }

    let tmp_path = path.with_extension("json.tmp");
    let serialized = serde_json::to_string_pretty(theme)
        .map_err(|error| format!("Theme settings JSON serialization failed: {error}"))?;
    let mut file = File::create(&tmp_path)
        .map_err(|error| format!("Theme settings temp create failed: {error}"))?;

    file.write_all(serialized.as_bytes())
        .map_err(|error| format!("Theme settings temp write failed: {error}"))?;
    file.sync_all()
        .map_err(|error| format!("Theme settings temp sync failed: {error}"))?;
    drop(file);

    if path.exists() {
        std::fs::remove_file(path)
            .map_err(|error| format!("Existing theme settings replace failed: {error}"))?;
    }

    rename(&tmp_path, path).map_err(|error| format!("Theme settings replace failed: {error}"))?;

    Ok(())
}

fn normalize_theme_config(theme: UserThemeConfig) -> UserThemeConfig {
    let fallback = UserThemeConfig::default();

    UserThemeConfig {
        id: normalize_theme_id(&theme.id, &fallback.id),
        name: normalize_theme_name(&theme.name, &fallback.name),
        primary_glow: if is_hex_color(&theme.primary_glow) {
            theme.primary_glow
        } else {
            fallback.primary_glow
        },
        bg_vignette: if ALLOWED_BG_VIGNETTES.contains(&theme.bg_vignette.as_str()) {
            theme.bg_vignette
        } else {
            fallback.bg_vignette
        },
        font_family: if ALLOWED_FONT_FAMILIES.contains(&theme.font_family.as_str()) {
            theme.font_family
        } else {
            fallback.font_family
        },
        card_opacity: theme.card_opacity.clamp(10, 90),
        custom_wallpaper: normalize_wallpaper_preference(theme.custom_wallpaper),
        legibility: normalize_legibility_config(theme.legibility),
        transparency: normalize_transparency_config(theme.transparency),
    }
}

fn normalize_transparency_config(config: InterfaceOpacityConfig) -> InterfaceOpacityConfig {
    InterfaceOpacityConfig {
        panel_opacity: config.panel_opacity.clamp(10, 95),
        border_opacity: config.border_opacity.min(100),
        text_glow_alpha: config.text_glow_alpha.min(100),
    }
}

fn normalize_legibility_config(config: LegibilityEngineConfig) -> LegibilityEngineConfig {
    let fallback = LegibilityEngineConfig::default();

    LegibilityEngineConfig {
        brightness_level: config.brightness_level.min(100),
        blur_radius: config.blur_radius.min(20),
        dim_color: if ALLOWED_DIM_COLORS.contains(&config.dim_color.as_str()) {
            config.dim_color
        } else {
            fallback.dim_color
        },
    }
}

fn normalize_wallpaper_preference(
    wallpaper: Option<WallpaperPreference>,
) -> Option<WallpaperPreference> {
    let wallpaper = wallpaper?;
    let payload =
        compiled_wallpaper_payload_for_path(PathBuf::from(wallpaper.internal_sandbox_path)).ok()?;

    Some(WallpaperPreference {
        asset_protocol_url: payload.asset_protocol_url,
        internal_sandbox_path: payload.internal_sandbox_path,
    })
}

fn normalize_theme_id(id: &str, fallback: &str) -> String {
    let candidate = id.trim();
    let is_safe = !candidate.is_empty()
        && candidate.len() <= MAX_ID_LENGTH
        && candidate
            .chars()
            .all(|character| character.is_ascii_alphanumeric() || matches!(character, '-' | '_'));

    if is_safe {
        candidate.to_string()
    } else {
        fallback.to_string()
    }
}

fn normalize_theme_name(name: &str, fallback: &str) -> String {
    let candidate = name.trim();

    if candidate.is_empty() {
        return fallback.to_string();
    }

    candidate.chars().take(MAX_NAME_LENGTH).collect()
}

fn is_hex_color(value: &str) -> bool {
    value.len() == HEX_COLOR_LENGTH
        && value.starts_with('#')
        && value
            .chars()
            .skip(1)
            .all(|character| character.is_ascii_hexdigit())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn default_theme_matches_frontend_builtin() {
        let theme = UserThemeConfig::default();

        assert_eq!(theme.id, "dark-romance");
        assert_eq!(theme.name, "Crimson Velvet");
        assert_eq!(theme.primary_glow, "#e11d48");
        assert_eq!(theme.bg_vignette, "from-rose-950/40 via-transparent");
        assert_eq!(theme.font_family, "serif");
        assert_eq!(theme.card_opacity, 40);
    }

    #[test]
    fn normalizes_untrusted_theme_values() {
        let theme = normalize_theme_config(UserThemeConfig {
            id: "../escape".to_string(),
            name: "   ".to_string(),
            primary_glow: "javascript:alert(1)".to_string(),
            bg_vignette: "from-red-500".to_string(),
            font_family: "script".to_string(),
            card_opacity: 999,
            custom_wallpaper: Some(WallpaperPreference {
                internal_sandbox_path: "/no/such/wallpaper.png".to_string(),
                asset_protocol_url: "file:///no/such/wallpaper.png".to_string(),
            }),
            legibility: LegibilityEngineConfig {
                brightness_level: 500,
                blur_radius: 99,
                dim_color: "neon".to_string(),
            },
            transparency: InterfaceOpacityConfig {
                panel_opacity: 2,
                border_opacity: 222,
                text_glow_alpha: 180,
            },
        });

        assert_eq!(theme.id, UserThemeConfig::default().id);
        assert_eq!(theme.name, UserThemeConfig::default().name);
        assert_eq!(theme.primary_glow, UserThemeConfig::default().primary_glow);
        assert_eq!(theme.bg_vignette, UserThemeConfig::default().bg_vignette);
        assert_eq!(theme.font_family, UserThemeConfig::default().font_family);
        assert_eq!(theme.card_opacity, 90);
        assert_eq!(theme.custom_wallpaper, None);
        assert_eq!(
            theme.legibility,
            LegibilityEngineConfig {
                brightness_level: 100,
                blur_radius: 20,
                dim_color: "zinc".to_string(),
            }
        );
        assert_eq!(
            theme.transparency,
            InterfaceOpacityConfig {
                panel_opacity: 10,
                border_opacity: 100,
                text_glow_alpha: 100,
            }
        );
    }

    #[test]
    fn clamps_opacity_and_preserves_safe_custom_theme() {
        let theme = normalize_theme_config(UserThemeConfig {
            id: "custom_theme-1".to_string(),
            name: "  Custom Setup  ".to_string(),
            primary_glow: "#06b6d4".to_string(),
            bg_vignette: "from-cyan-950/40 via-transparent".to_string(),
            font_family: "mono".to_string(),
            card_opacity: 3,
            custom_wallpaper: None,
            legibility: LegibilityEngineConfig::default(),
            transparency: InterfaceOpacityConfig::default(),
        });

        assert_eq!(theme.id, "custom_theme-1");
        assert_eq!(theme.name, "Custom Setup");
        assert_eq!(theme.primary_glow, "#06b6d4");
        assert_eq!(theme.bg_vignette, "from-cyan-950/40 via-transparent");
        assert_eq!(theme.font_family, "mono");
        assert_eq!(theme.card_opacity, 10);
    }

    #[test]
    fn persists_and_loads_theme_data_from_disk() {
        let save_path = unique_test_path("settings.json");
        let theme = UserThemeConfig {
            id: "custom".to_string(),
            name: "Moonlit Console".to_string(),
            primary_glow: "#71717a".to_string(),
            bg_vignette: "from-zinc-900/60 via-transparent".to_string(),
            font_family: "sans".to_string(),
            card_opacity: 15,
            custom_wallpaper: None,
            legibility: LegibilityEngineConfig {
                brightness_level: 64,
                blur_radius: 4,
                dim_color: "rose".to_string(),
            },
            transparency: InterfaceOpacityConfig {
                panel_opacity: 55,
                border_opacity: 44,
                text_glow_alpha: 33,
            },
        };

        persist_theme_to_path(&save_path, &theme).expect("theme should persist");
        let loaded = load_theme_from_path(&save_path).expect("theme should reload");

        assert_eq!(loaded, theme);

        let _ = std::fs::remove_file(save_path);
    }

    #[test]
    fn normalizes_transparency_settings() {
        let config = normalize_transparency_config(InterfaceOpacityConfig {
            panel_opacity: 99,
            border_opacity: 150,
            text_glow_alpha: 120,
        });

        assert_eq!(
            config,
            InterfaceOpacityConfig {
                panel_opacity: 95,
                border_opacity: 100,
                text_glow_alpha: 100,
            }
        );
    }

    #[test]
    fn normalizes_legibility_settings() {
        let config = normalize_legibility_config(LegibilityEngineConfig {
            brightness_level: 101,
            blur_radius: 44,
            dim_color: "bad".to_string(),
        });

        assert_eq!(
            config,
            LegibilityEngineConfig {
                brightness_level: 100,
                blur_radius: 20,
                dim_color: "zinc".to_string(),
            }
        );
    }

    #[test]
    fn normalizes_wallpaper_preferences_to_local_asset_protocol() {
        let wallpaper_path = unique_test_path("wallpaper.png");
        std::fs::write(&wallpaper_path, b"png placeholder").expect("fixture should write");

        let theme = normalize_theme_config(UserThemeConfig {
            custom_wallpaper: Some(WallpaperPreference {
                internal_sandbox_path: wallpaper_path.to_string_lossy().into_owned(),
                asset_protocol_url: "file:///bad/path.png".to_string(),
            }),
            ..UserThemeConfig::default()
        });

        let wallpaper = theme
            .custom_wallpaper
            .expect("supported existing wallpaper should remain");
        assert!(wallpaper.internal_sandbox_path.ends_with("wallpaper.png"));
        assert!(wallpaper
            .asset_protocol_url
            .starts_with("ccv3-asset://localhost/"));

        let _ = std::fs::remove_file(wallpaper_path);
    }

    fn unique_test_path(file_name: &str) -> PathBuf {
        let mut path = std::env::temp_dir();
        path.push(format!(
            "heartwriteai-theme-{}-{file_name}",
            std::process::id()
        ));
        path
    }
}
