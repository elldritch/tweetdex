# tweetdex

Index and search tweets you've liked or bookmarked.

## Usage

This repository contains a Chrome extension. Install it. It has two modes of operation:

1. You can do one-off "indexing" of liked tweets. In this mode, it goes to your profile's liked tweets tab, and scrolls down the tab, recording tweets you've liked.
2. By default, it passively listens for clicks on the Twitter website. When it detects that you've clicked "like" on a tweet, it indexes that tweet.

<!--

TODO: Implement this for bookmarked tweets as well.

-->

<!--

Is there a better way to list a user's liked tweets than scraping it using a Chrome extension?

Here are some alternatives I considered and rejected:

1. Use the web API. Unfortunately, the free API does not allow you to list a user's liked tweets, and the paid API is bonkers expensive. See: https://developer.twitter.com/en/docs/twitter-api/getting-started/about-twitter-api
2. Scrape a user's like from their public profile using a web crawler. Unfortunately, now that Twitter requires authentication, this is no longer doable.

If you have better ideas, or think an argument here is wrong, please raise a GitHub Issue.

-->
