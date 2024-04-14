use axum::{debug_handler, extract::State, Json};
use serde::Deserialize;
use sqlx::PgPool;

#[derive(Deserialize)]
pub struct NewUserRequest {
    handle: String,
}

#[debug_handler]
pub async fn handle_new_users(State(pool): State<PgPool>, Json(req): Json<NewUserRequest>) {
    sqlx::query!("INSERT INTO tweetdex_user (handle) VALUES ($1) ON CONFLICT DO NOTHING", req.handle)
        .execute(&pool)
        .await
        .unwrap();
}
