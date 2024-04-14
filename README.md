# tweetdex

Have you ever liked a tweet, and then been in a conversation weeks later wishing you could find that liked tweet again?

Tweetdex indexes and searches tweets you've liked. This should be a Twitter feature, but they really don't want to build it for some reason.

> :construction: Some of these features are still WIP or unimplemented. Use at your own risk. I mostly built this for myself, and made it public so friends can use it.

## Usage

This repository contains a Chrome extension. It has two modes of operation:

1. You can do one-off "indexing" of previously liked tweets. In this mode, it goes to your profile's liked tweets tab, and scrolls down the tab, indexing tweets. Unfortunately, this is currently the only way to import previously liked tweets.
2. :construction: In the background, it also passively listens for clicks on the Twitter website. When it detects that you've clicked "like" or "bookmark" on a tweet, it indexes that tweet.

Indexed tweets have their text contents, ID, and author saved. In the future, I'd also like to save additional context (like replies, threads, and quote retweet sources), and I'd like to process media attachments (like images and videos) using AI so that they are searchable.

## Quick start

For the Chrome extension:

1. `cd chrome-extension`
2. `npm run build`
3. In Chrome's extensions page, `Load unpacked` on the resulting `dist` folder

For the server:

1. `cd server`
2. `cargo run`

During development:

- In the Chrome extension, use `npm run dev` for automatic recompilation. Note that you will still need to manually reload the extension, but this will at least give you continuous typechecking.
- In the server, set `RUST_LOG` levels (see `tracing` and `tracing_subscriber`) for logging.

<!--

## To do

- Build a proper search UI
  - Tweet-specific operators like "by author" or "has image" or "liked at time X" or "authored at time X"
  - Maybe put together an inverted index if needed
- Add support for "bookmarked" saved tweet type
- Process tweets for more metadata to search on
  - Publish time
  - Upthread and downthread context
  - Retweeted quote sources
  - AI summarization of videos and pictures
  - "Show more" content

## Design notes

Is there a better way to list a user's liked tweets than scraping it using a Chrome extension?

Here are some alternatives I considered and rejected:

1. Use the web API. Unfortunately, the free API does not allow you to list a user's liked tweets, and the paid API is bonkers expensive. See: https://developer.twitter.com/en/docs/twitter-api/getting-started/about-twitter-api
2. Scrape a user's like from their public profile using a web crawler. Unfortunately, now that Twitter requires authentication, this is no longer doable.

If you have better ideas, or think an argument here is wrong, please raise a GitHub Issue.

-->
