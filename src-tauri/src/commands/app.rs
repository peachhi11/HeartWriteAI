use crate::ActiveSessionStore;

#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
pub fn get_app_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

#[tauri::command]
pub fn initialize_profile_with_resonance(
    archetype: String,
    name: String,
    primary_bias: String,
    resonance_score: u32,
    state: tauri::State<'_, ActiveSessionStore>,
) -> Result<String, String> {
    let mut session = state
        .profile
        .lock()
        .map_err(|_| "Failed to lock active session profile".to_string())?;

    session.dynamic_archetype = archetype;
    session.player_name = name;
    session.primary_bias = primary_bias;
    session.resonance_score = resonance_score.min(100);

    Ok(format!(
        "Native session bound to {} at {}% resonance.",
        session.dynamic_archetype, session.resonance_score
    ))
}
