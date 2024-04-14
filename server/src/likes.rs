use axum::{debug_handler, extract::State, Json};
use serde::Deserialize;
use sqlx::PgPool;
use tracing::instrument;

#[derive(Deserialize, Debug)]
pub struct NewLikesRequestTweet {
    author: String,
    tweet_id: String,
    outer_html: String,
}

#[derive(Deserialize, Debug)]
pub struct NewLikesRequest {
    user_handle: String,
    tweets: Vec<NewLikesRequestTweet>,
}

#[debug_handler]
#[instrument]
pub async fn handle_new_likes(State(pool): State<PgPool>, Json(req): Json<NewLikesRequest>) {
    let tweet_count = req.tweets.len();
    let mut tweet_authors = Vec::with_capacity(tweet_count);
    let mut tweet_ids = Vec::with_capacity(tweet_count);
    let mut tweet_outer_htmls = Vec::with_capacity(tweet_count);
    req.tweets.iter().for_each(|tweet| {
        tweet_authors.push(tweet.author.clone());
        tweet_ids.push(tweet.tweet_id.clone());
        tweet_outer_htmls.push(tweet.outer_html.clone());
    });

    sqlx::query!(
        r#"
        WITH inserted_tweets AS (
            INSERT INTO tweet (author, twitter_id, outer_html)
            SELECT author, twitter_id, outer_html
            FROM UNNEST($1::TEXT[], $2::TEXT[], $3::TEXT[]) as a(author, twitter_id, outer_html)
            ON CONFLICT DO NOTHING
            RETURNING id
        ), inserted_user AS (
            INSERT INTO tweetdex_user (handle)
            VALUES ($4)
            ON CONFLICT DO NOTHING
            RETURNING id, handle
        )
        INSERT INTO saved_tweet (tweet_id, user_id, saved_type)
        SELECT
            id,
            (
                (SELECT id FROM inserted_user WHERE handle = $4)
                UNION
                (SELECT id FROM tweetdex_user WHERE handle = $4)
            ) AS "user_id",
            'liked' AS "saved_type"
        FROM inserted_tweets
        ON CONFLICT DO NOTHING
    "#,
        &tweet_authors,
        &tweet_ids,
        &tweet_outer_htmls,
        req.user_handle
    )
    .execute(&pool)
    .await
    .unwrap();
}
