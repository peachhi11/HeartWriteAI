use serde::{Deserialize, Serialize};

#[derive(Deserialize, Debug, Clone, PartialEq)]
pub struct SearchFilters {
    pub query: Option<String>,
    pub framework: Option<String>,
    pub relationship: Option<String>,
    pub tag: Option<String>,
    pub tags: Option<Vec<String>>,
    pub page: i32,
    pub limit: i32,
}

#[derive(Serialize, Debug, Clone, PartialEq)]
pub struct CacheItemSummary {
    pub id: String,
    pub file_path: String,
    pub name: String,
    pub framework: String,
    pub relationship: String,
    pub tags: Vec<String>,
    pub updated_at: i64,
}

#[derive(Serialize, Debug, Clone, PartialEq)]
pub struct PaginatedResponse {
    pub items: Vec<CacheItemSummary>,
    pub total_count: i32,
    pub total_pages: i32,
    pub current_page: i32,
}
