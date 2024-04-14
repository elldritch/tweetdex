use axum::{routing::post, Router};
use sqlx::postgres::PgPoolOptions;

mod likes;
mod users;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    print!("Connecting to Postgres...");
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect("postgresql://tweetdex:tweetdex@localhost:5432/tweetdex")
        .await
        .unwrap();
    println!(" done!");

    print!("Running migrations...");
    sqlx::migrate!().run(&pool).await.unwrap();
    println!(" done!");

    print!("Setting up router...");
    let app = Router::new()
        .route("/likes", post(likes::handle_new_likes))
        .route("/users", post(users::handle_new_users))
        .with_state(pool)
        .layer(tower_http::trace::TraceLayer::new_for_http())
        .layer(tower_http::cors::CorsLayer::permissive());

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000")
        .await
        .unwrap();
    println!(" done!");

    println!("Listening on 127.0.0.1:3000");
    axum::serve(listener, app).await.unwrap()
}
