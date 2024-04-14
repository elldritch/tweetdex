CREATE TABLE tweetdex_user (
  id BIGSERIAL PRIMARY KEY,
  handle TEXT NOT NULL UNIQUE
);

CREATE TABLE tweet (
  id BIGSERIAL PRIMARY KEY,
  author TEXT NOT NULL,
  twitter_id TEXT UNIQUE NOT NULL,
  outer_html TEXT NOT NULL
);

CREATE TYPE saved_tweet_type AS ENUM ('liked', 'bookmarked');

CREATE TABLE saved_tweet (
  tweet_id BIGINT REFERENCES tweet(id),
  user_id BIGINT REFERENCES tweetdex_user(id),
  PRIMARY KEY(tweet_id, user_id),
  saved_type saved_tweet_type NOT NULL
);
