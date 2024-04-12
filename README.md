# tweetdex

Have you ever liked a tweet, and then been in a conversation weeks later wishing you could find that liked tweet again?

Tweetdex indexes and searches tweets you've liked or bookmarked. This should be a Twitter feature, but they really don't want to build it for some reason.

:construction: This project is still WIP! Most features barely work! It's only public because I wanted to get some code review from friends.

## Usage

This repository contains a Chrome extension. It has two modes of operation:

1. You can do one-off "indexing" of previously liked or bookmarked tweets. In this mode, it goes to your profile's liked or bookmarked tweets tab, and scrolls down the tab, indexing tweets. Unfortunately, this is currently the only way to import previously liked tweets.
2. In the background, it also passively listens for clicks on the Twitter website. When it detects that you've clicked "like" or "bookmark" on a tweet, it indexes that tweet.

Indexed tweets have their text contents, ID, and author saved. In the future, I'd also like to save additional context (like replies, threads, and quote retweet sources), and I'd like to process media attachments (like images and videos) using AI so that they are searchable.

<!--

Is there a better way to list a user's liked tweets than scraping it using a Chrome extension?

Here are some alternatives I considered and rejected:

1. Use the web API. Unfortunately, the free API does not allow you to list a user's liked tweets, and the paid API is bonkers expensive. See: https://developer.twitter.com/en/docs/twitter-api/getting-started/about-twitter-api
2. Scrape a user's like from their public profile using a web crawler. Unfortunately, now that Twitter requires authentication, this is no longer doable.

If you have better ideas, or think an argument here is wrong, please raise a GitHub Issue.

-->
