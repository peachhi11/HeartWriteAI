use crate::models::character_card::{AppMacroExtensions, CharacterCardV3};
use crate::models::search::{CacheItemSummary, PaginatedResponse, SearchFilters};
use rusqlite::{params, Connection};
use std::collections::hash_map::DefaultHasher;
use std::hash::{Hash, Hasher};
use std::path::Path;

#[derive(Debug, Clone, PartialEq)]
pub struct CachedCardRecord {
    pub id: String,
    pub file_path: String,
    pub name: String,
    pub framework: String,
    pub relationship: String,
    pub tags: Vec<String>,
    pub updated_at: i64,
}

pub struct CacheDatabase {
    conn: Connection,
}

impl CacheDatabase {
    /// Connects to or provisions a fresh SQLite card metadata cache.
    pub fn init<P: AsRef<Path>>(db_path: P) -> Result<Self, String> {
        let conn = Connection::open(db_path)
            .map_err(|error| format!("Database connection initialization failed: {error}"))?;

        conn.pragma_update(None, "journal_mode", "WAL")
            .map_err(|error| format!("Failed enabling SQLite WAL journal mode: {error}"))?;

        conn.execute(
            "CREATE TABLE IF NOT EXISTS card_cache (
                id TEXT PRIMARY KEY,
                file_path TEXT NOT NULL UNIQUE,
                name TEXT NOT NULL,
                framework TEXT NOT NULL,
                relationship TEXT NOT NULL,
                tags_json TEXT NOT NULL,
                updated_at INTEGER DEFAULT (strftime('%s', 'now'))
            );",
            [],
        )
        .map_err(|error| format!("Schema deployment exception: {error}"))?;

        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_macro ON card_cache (framework, relationship);",
            [],
        )
        .map_err(|error| format!("Failed creating macro cache index: {error}"))?;

        Ok(Self { conn })
    }

    /// Extends or overwrites a card metadata cache record.
    pub fn upsert_card(&self, file_path: &str, card: &CharacterCardV3) -> Result<(), String> {
        let macro_data = card
            .get_macro_extensions()
            .unwrap_or_else(default_macro_extensions);
        let card_id = cache_id_for_card(file_path, card);
        let tags_serialized = serde_json::to_string(&card.data.tags)
            .map_err(|error| format!("Failed serializing card tags for cache: {error}"))?;

        self.conn
            .execute(
                "INSERT INTO card_cache (id, file_path, name, framework, relationship, tags_json)
                 VALUES (?1, ?2, ?3, ?4, ?5, ?6)
                 ON CONFLICT(file_path) DO UPDATE SET
                    id = excluded.id,
                    name = excluded.name,
                    framework = excluded.framework,
                    relationship = excluded.relationship,
                    tags_json = excluded.tags_json,
                    updated_at = strftime('%s', 'now');",
                params![
                    card_id,
                    file_path,
                    card.data.name,
                    macro_data.framework,
                    macro_data.relationship,
                    tags_serialized
                ],
            )
            .map_err(|error| format!("Failed indexing card cache target row: {error}"))?;

        Ok(())
    }

    pub fn cached_card_for_path(
        &self,
        file_path: &str,
    ) -> Result<Option<CachedCardRecord>, String> {
        let mut statement = self
            .conn
            .prepare(
                "SELECT id, file_path, name, framework, relationship, tags_json, updated_at
                 FROM card_cache
                 WHERE file_path = ?1;",
            )
            .map_err(|error| format!("Failed preparing card cache lookup: {error}"))?;

        let mut rows = statement
            .query(params![file_path])
            .map_err(|error| format!("Failed querying card cache: {error}"))?;

        let Some(row) = rows
            .next()
            .map_err(|error| format!("Failed reading card cache row: {error}"))?
        else {
            return Ok(None);
        };

        Ok(Some(CachedCardRecord {
            id: row
                .get(0)
                .map_err(|error| format!("Failed reading cached card id: {error}"))?,
            file_path: row
                .get(1)
                .map_err(|error| format!("Failed reading cached card file path: {error}"))?,
            name: row
                .get(2)
                .map_err(|error| format!("Failed reading cached card name: {error}"))?,
            framework: row
                .get(3)
                .map_err(|error| format!("Failed reading cached card framework: {error}"))?,
            relationship: row
                .get(4)
                .map_err(|error| format!("Failed reading cached card relationship: {error}"))?,
            tags: deserialize_tags(
                row.get::<_, String>(5)
                    .map_err(|error| format!("Failed reading cached card tags: {error}"))?,
            )?,
            updated_at: row
                .get(6)
                .map_err(|error| format!("Failed reading cached card timestamp: {error}"))?,
        }))
    }

    pub fn query_library_page(&self, filter: SearchFilters) -> Result<PaginatedResponse, String> {
        let mut conditions = Vec::new();
        let mut sql_params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();

        if let Some(query) = normalized_filter_value(filter.query) {
            conditions.push("(name LIKE ? OR tags_json LIKE ?)".to_string());
            let search_pattern = format!("%{query}%");
            sql_params.push(Box::new(search_pattern.clone()));
            sql_params.push(Box::new(search_pattern));
        }

        if let Some(framework) = normalized_filter_value(filter.framework) {
            conditions.push("framework = ?".to_string());
            sql_params.push(Box::new(framework));
        }

        if let Some(relationship) = normalized_filter_value(filter.relationship) {
            conditions.push("relationship = ?".to_string());
            sql_params.push(Box::new(relationship));
        }

        let mut requested_tags = Vec::new();
        if let Some(tag) = normalized_filter_value(filter.tag) {
            requested_tags.push(tag);
        }
        if let Some(tags) = filter.tags {
            for tag in tags {
                if let Some(normalized_tag) = normalized_filter_value(Some(tag)) {
                    if !requested_tags
                        .iter()
                        .any(|existing| existing.eq_ignore_ascii_case(&normalized_tag))
                    {
                        requested_tags.push(normalized_tag);
                    }
                }
            }
        }

        for tag in requested_tags {
            conditions.push(
                "EXISTS (
                    SELECT 1
                    FROM json_each(card_cache.tags_json)
                    WHERE LOWER(json_each.value) = LOWER(?)
                )"
                .to_string(),
            );
            sql_params.push(Box::new(tag));
        }

        let where_clause = if conditions.is_empty() {
            String::new()
        } else {
            format!("WHERE {}", conditions.join(" AND "))
        };

        let count_query = format!("SELECT COUNT(*) FROM card_cache {where_clause};");
        let count_param_refs = sql_param_refs(&sql_params);
        let total_count: i32 = self
            .conn
            .query_row(&count_query, count_param_refs.as_slice(), |row| row.get(0))
            .map_err(|error| format!("Count evaluation failed: {error}"))?;

        let limit = filter.limit.max(1);
        let total_pages = total_pages_for(total_count, limit);
        let current_page = filter.page.max(1).min(total_pages);
        let offset = (current_page - 1) * limit;

        let fetch_query = format!(
            "SELECT id, file_path, name, framework, relationship, tags_json, updated_at
             FROM card_cache
             {where_clause}
             ORDER BY updated_at DESC, name ASC
             LIMIT ? OFFSET ?;"
        );

        sql_params.push(Box::new(limit));
        sql_params.push(Box::new(offset));
        let final_param_refs = sql_param_refs(&sql_params);

        let mut statement = self
            .conn
            .prepare(&fetch_query)
            .map_err(|error| format!("Failed preparing SQLite search statement: {error}"))?;

        let rows_mapped = statement
            .query_map(final_param_refs.as_slice(), |row| {
                let tags_raw_json: String = row.get(5)?;
                let parsed_tags = serde_json::from_str(&tags_raw_json).unwrap_or_default();

                Ok(CacheItemSummary {
                    id: row.get(0)?,
                    file_path: row.get(1)?,
                    name: row.get(2)?,
                    framework: row.get(3)?,
                    relationship: row.get(4)?,
                    tags: parsed_tags,
                    updated_at: row.get(6)?,
                })
            })
            .map_err(|error| format!("Query compilation layout error: {error}"))?;

        let mut items = Vec::new();
        for item in rows_mapped {
            items.push(item.map_err(|error| format!("Failed reading search result row: {error}"))?);
        }

        Ok(PaginatedResponse {
            items,
            total_count,
            total_pages,
            current_page,
        })
    }
}

fn cache_id_for_card(file_path: &str, card: &CharacterCardV3) -> String {
    let mut hasher = DefaultHasher::new();
    file_path.hash(&mut hasher);
    card.data.name.hash(&mut hasher);
    card.data.creator.hash(&mut hasher);

    let name = sanitize_id_fragment(&card.data.name);
    let creator = sanitize_id_fragment(&card.data.creator);
    format!("{name}_{creator}_{:x}", hasher.finish())
}

fn sanitize_id_fragment(value: &str) -> String {
    let fragment: String = value
        .chars()
        .map(|character| {
            if character.is_ascii_alphanumeric() {
                character
            } else {
                '_'
            }
        })
        .collect();

    let trimmed = fragment.trim_matches('_');
    if trimmed.is_empty() {
        "unknown".to_string()
    } else {
        trimmed.to_string()
    }
}

fn deserialize_tags(tags_json: String) -> Result<Vec<String>, String> {
    serde_json::from_str(&tags_json)
        .map_err(|error| format!("Failed deserializing cached card tags: {error}"))
}

fn normalized_filter_value(value: Option<String>) -> Option<String> {
    value
        .map(|inner| inner.trim().to_string())
        .filter(|inner| !inner.is_empty())
}

fn sql_param_refs(params: &[Box<dyn rusqlite::types::ToSql>]) -> Vec<&dyn rusqlite::types::ToSql> {
    params.iter().map(|param| param.as_ref()).collect()
}

fn total_pages_for(total_count: i32, limit: i32) -> i32 {
    if total_count <= 0 {
        1
    } else {
        ((total_count as f32) / (limit as f32)).ceil() as i32
    }
}

fn default_macro_extensions() -> AppMacroExtensions {
    AppMacroExtensions {
        framework: "Sandbox".to_string(),
        formatting: "W++".to_string(),
        relationship: "Symmetric".to_string(),
        tones: Vec::new(),
        micro_tropes: Vec::new(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::character_card::{CardDataV3, CharacterCardV3, AMOURAI_EXTENSION_NAMESPACE};
    use serde_json::json;
    use std::collections::HashMap;

    #[test]
    fn provisions_and_upserts_card_cache_record() {
        let temp_dir = create_temp_dir("card-cache-upsert");
        let db_path = temp_dir.join("cards.sqlite3");
        let cache = CacheDatabase::init(&db_path).expect("cache should initialize");
        let card = create_card_with_macro("Mara Voss", "Antagonistic");
        let file_path = "/tmp/mara.charx";

        cache
            .upsert_card(file_path, &card)
            .expect("card should upsert");

        let record = cache
            .cached_card_for_path(file_path)
            .expect("cache should query")
            .expect("record should exist");

        assert!(record.id.starts_with("Mara_Voss_Test_Creator_"));
        assert_eq!(record.file_path, file_path);
        assert_eq!(record.name, "Mara Voss");
        assert_eq!(record.framework, "Narrative RPG");
        assert_eq!(record.relationship, "Antagonistic");
        assert_eq!(record.tags, vec!["dark romance", "slow burn"]);
        assert!(record.updated_at > 0);
    }

    #[test]
    fn falls_back_to_default_macro_metadata() {
        let temp_dir = create_temp_dir("card-cache-defaults");
        let db_path = temp_dir.join("cards.sqlite3");
        let cache = CacheDatabase::init(&db_path).expect("cache should initialize");
        let mut card = create_card_with_macro("No Macro", "Antagonistic");
        card.data.extensions.clear();

        cache
            .upsert_card("/tmp/no-macro.json", &card)
            .expect("card should upsert");

        let record = cache
            .cached_card_for_path("/tmp/no-macro.json")
            .expect("cache should query")
            .expect("record should exist");

        assert_eq!(record.framework, "Sandbox");
        assert_eq!(record.relationship, "Symmetric");
    }

    #[test]
    fn queries_cache_by_text_and_paginates_results() {
        let cache = create_cache("card-cache-search");
        cache
            .upsert_card(
                "/tmp/mara.charx",
                &create_card_with_tags("Mara Voss", "Narrative RPG", "Antagonistic", &["spy"]),
            )
            .expect("first card should upsert");
        cache
            .upsert_card(
                "/tmp/maeve.charx",
                &create_card_with_tags("Maeve Thorn", "Narrative RPG", "Symmetric", &["spy"]),
            )
            .expect("second card should upsert");
        cache
            .upsert_card(
                "/tmp/seraphina.charx",
                &create_card_with_tags("Seraphina Vale", "Sandbox", "Symmetric", &["healer"]),
            )
            .expect("third card should upsert");

        let page = cache
            .query_library_page(SearchFilters {
                query: Some("Ma".to_string()),
                framework: None,
                relationship: None,
                tag: None,
                tags: None,
                page: 1,
                limit: 1,
            })
            .expect("search should query");

        assert_eq!(page.total_count, 2);
        assert_eq!(page.total_pages, 2);
        assert_eq!(page.current_page, 1);
        assert_eq!(page.items.len(), 1);
        assert!(page.items[0].name.starts_with("Maeve") || page.items[0].name.starts_with("Mara"));
    }

    #[test]
    fn queries_cache_by_macro_fields_and_tag_json() {
        let cache = create_cache("card-cache-filter");
        cache
            .upsert_card(
                "/tmp/mara.charx",
                &create_card_with_tags(
                    "Mara Voss",
                    "Narrative RPG",
                    "Antagonistic",
                    &["dark romance", "spy"],
                ),
            )
            .expect("first card should upsert");
        cache
            .upsert_card(
                "/tmp/seraphina.charx",
                &create_card_with_tags(
                    "Seraphina Vale",
                    "Sandbox",
                    "Symmetric",
                    &["cozy romance", "healer"],
                ),
            )
            .expect("second card should upsert");

        let page = cache
            .query_library_page(SearchFilters {
                query: None,
                framework: Some("Narrative RPG".to_string()),
                relationship: Some("Antagonistic".to_string()),
                tag: Some("dark romance".to_string()),
                tags: None,
                page: 1,
                limit: 12,
            })
            .expect("filtered search should query");

        assert_eq!(page.total_count, 1);
        assert_eq!(page.total_pages, 1);
        assert_eq!(page.items[0].name, "Mara Voss");
        assert_eq!(page.items[0].tags, vec!["dark romance", "spy"]);
    }

    #[test]
    fn queries_cache_by_multiple_case_insensitive_tags() {
        let cache = create_cache("card-cache-multi-tag-filter");
        cache
            .upsert_card(
                "/tmp/dominic.charx",
                &create_card_with_tags(
                    "Dominic Hale",
                    "Narrative RPG",
                    "Antagonistic",
                    &["malePOV", "dom", "enemies to lovers"],
                ),
            )
            .expect("first card should upsert");
        cache
            .upsert_card(
                "/tmp/noah.charx",
                &create_card_with_tags(
                    "Noah Vale",
                    "Narrative RPG",
                    "Symmetric",
                    &["malePOV", "sub", "slow burn"],
                ),
            )
            .expect("second card should upsert");

        let page = cache
            .query_library_page(SearchFilters {
                query: None,
                framework: Some("Narrative RPG".to_string()),
                relationship: None,
                tag: None,
                tags: Some(vec![
                    "malepov".to_string(),
                    "dom".to_string(),
                    "enemies to lovers".to_string(),
                ]),
                page: 1,
                limit: 12,
            })
            .expect("multi-tag search should query");

        assert_eq!(page.total_count, 1);
        assert_eq!(page.items[0].name, "Dominic Hale");
    }

    fn create_cache(name: &str) -> CacheDatabase {
        let temp_dir = create_temp_dir(name);
        let db_path = temp_dir.join("cards.sqlite3");
        CacheDatabase::init(db_path).expect("cache should initialize")
    }

    fn create_card_with_macro(name: &str, relationship: &str) -> CharacterCardV3 {
        create_card_with_tags(
            name,
            "Narrative RPG",
            relationship,
            &["dark romance", "slow burn"],
        )
    }

    fn create_card_with_tags(
        name: &str,
        framework: &str,
        relationship: &str,
        tags: &[&str],
    ) -> CharacterCardV3 {
        let mut extensions = HashMap::new();
        extensions.insert(
            AMOURAI_EXTENSION_NAMESPACE.to_string(),
            json!({
                "macro": {
                    "framework": framework,
                    "formatting": "W++",
                    "relationship": relationship,
                    "tones": ["Angsty"],
                    "micro_tropes": ["Only One Bed"]
                }
            }),
        );

        CharacterCardV3 {
            spec: "chara_card_v3".to_string(),
            spec_version: "3.0".to_string(),
            data: CardDataV3 {
                name: name.to_string(),
                description: String::new(),
                personality: String::new(),
                scenario: String::new(),
                first_mes: String::new(),
                mes_example: String::new(),
                creator_notes: String::new(),
                system_prompt: String::new(),
                post_history_instructions: String::new(),
                alternate_greetings: Vec::new(),
                group_only_greetings: Vec::new(),
                tags: tags.iter().map(|tag| (*tag).to_string()).collect(),
                creator: "Test Creator".to_string(),
                character_version: String::new(),
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

    fn create_temp_dir(name: &str) -> std::path::PathBuf {
        let path = std::env::temp_dir().join(format!("amourai-{name}-{}", std::process::id()));
        if path.exists() {
            std::fs::remove_dir_all(&path).expect("old temp dir should be removable");
        }
        std::fs::create_dir_all(&path).expect("temp dir should be created");
        path
    }
}
