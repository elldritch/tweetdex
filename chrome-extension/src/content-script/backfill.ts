import _ from "lodash";
import axios from "axios";

import { log } from "../shared/log";
import { SavedTweetType } from "../shared/messages/types";
import { waitForElement } from "../shared/waitForElement";
import { parseUsername } from "./parseUsername";

const tweetSelector = "[data-testid=tweet]";

// Request payload for API. See `likes.rs`.
type TweetPayload = {
  author: string;
  tweet_id: string;
  outer_html: string;
};

// See comment in `popup/main.ts#backfillTweets`.
export async function backfillTweets(tweetType: SavedTweetType) {
  // Wait for the tweets to load.
  log("Waiting for tweets to load");
  await waitForElement(tweetSelector);

  // Load username.
  const username = await parseUsername();

  // Scroll to the top, then scroll down the page. Every scroll will bring some
  // tweets into rendering and some tweets out of rendering.
  //
  // I don't have a good way to know when all tweets have been rendered, so
  // instead we count how many page scrolls cause no new tweets to render. When
  // that number reaches a heuristic threshold, we consider the backfill to be
  // complete.
  log("Indexing tweets");
  window.scrollTo(0, 0);
  let lastTweetsSeen: TweetPayload[] = [];
  let lastTweetsRepeatedCount = 0;
  while (true) {
    // Look for currently rendered tweets.
    const tweets = document.querySelectorAll(tweetSelector);
    log(`Found ${tweets.length} tweets rendered on page`);

    // For each tweet, get the tweet information to save.
    const tweetsPayload = Array.from(tweets).map((tweet) => {
      // Get and parse the tweet URL. This is of the form
      // `/:author/status/:tweet_id`.
      const href = tweet
        .querySelector("[data-testid=User-Name]")!
        .querySelector("a[aria-label]")!
        .getAttribute("href");
      log(href);

      if (!href) {
        log(tweet);
        throw new Error("Unable to find tweet URL");
      }
      const sections = href.split("/");
      if (sections.length != 4) {
        log(sections);
        throw new Error("Unable to parse tweet URL");
      }
      const [_unused, author, _unused2, tweet_id] = sections;

      return { author, tweet_id, outer_html: tweet.outerHTML };
    });
    log(tweetsPayload);

    // Check whether these tweets have been seen before.
    if (_.isEqual(tweetsPayload, lastTweetsSeen)) {
      lastTweetsRepeatedCount++;
      log("Tweet page repeated", lastTweetsRepeatedCount);

      // If over the threshold, the backfill is complete.
      if (lastTweetsRepeatedCount > 10) {
        log("Backfill finished");
        break;
      } else {
        // Otherwise, wait another second to let new tweets load and render.
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }
    } else {
      lastTweetsRepeatedCount = 0;
    }

    // Save the page of tweets.
    const req = {
      user_handle: username,
      tweets: tweetsPayload,
    };
    log("Request", req);
    await axios.post(`http://localhost:3000/likes`, req);

    // Pause to let new tweets load and render.
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Scroll to the next page.
    lastTweetsSeen = tweetsPayload;
    window.scrollTo(0, window.scrollY + window.innerHeight);
  }
}
