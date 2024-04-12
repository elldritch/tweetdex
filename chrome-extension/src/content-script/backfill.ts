import { log } from "../shared/log";
import { SavedTweetType } from "../shared/messages/types";
import { waitForElement } from "../shared/waitForElement";

const tweetSelector = "[data-testid=tweet]";

// See comment in `popup/main.ts#backfillTweets`.
export async function backfillTweets(tweetType: SavedTweetType) {
  // Wait for the tweets to load.
  log("Waiting for tweets to load");
  await waitForElement(tweetSelector);

  // Scroll to the top, then scroll down the page.
  log("Indexing tweets");
  window.scrollTo(0, 0);
  let lastScrollPosition = 0;
  while (true) {
    // On each page, look for tweets.
    const tweets = document.querySelectorAll(tweetSelector);
    log(`Found ${tweets.length} tweets rendered on page`);

    const getSeen = await chrome.storage.local.get("seenlist");
    const seenlist = getSeen.seenlist ? JSON.parse(getSeen.seenlist) : {};
    log("Initial seenlist");
    log(seenlist);

    // Save each tweet.
    await Promise.all(
      Array.from(tweets).map(async (tweet) => {
        // Get the tweet ID and HTML.
        const href = tweet
          .querySelector("[data-testid=User-Name]")!
          .querySelector("a[aria-label]")!
          .getAttribute("href");
        const key = `tweet:${href}`;

        // Save the tweet to storage if it's new.
        const size = await chrome.storage.local.getBytesInUse(key);
        log("Tweet ID:", href);
        if (size === 0) {
          log("New tweet, saving:", tweet.outerHTML);
          await chrome.storage.local.set({ [key]: tweet.outerHTML });
        } else {
          log("Tweet seen before");
        }

        // Update the seenlist.
        seenlist[key] = true;
      }),
    );

    // Save the new seenlist.
    log("Updating seenlist:");
    log(seenlist);
    log(JSON.stringify(seenlist));
    await chrome.storage.local.set({
      seenlist: JSON.stringify(seenlist),
    });

    // Pause to let new tweets load and render.
    await new Promise((resolve) => setTimeout(resolve, 1000));

    window.scrollTo(0, window.scrollY + window.innerHeight);
    if (window.scrollY == lastScrollPosition) {
      log("Done!");
      break;
    } else {
      lastScrollPosition = window.scrollY;
    }
  }
}
