import { installMessageLogger } from "../shared/log";
import { sendMessageToServiceWorker } from "../shared/messages/service-worker";
import { SavedTweetType } from "../shared/messages/types";

// The process of backfilling a tweet:
//
// 1. Open a new active tab to `https://twitter.com`.
// 2. Read the user's handle. Fail if not authenticated.
// 3. Go to the user's likes or bookmarks page.
// 4. Scroll down the page, recording liked or bookmarked tweets.
async function backfillTweets(tweetType: SavedTweetType) {
  // Why not just do the coordination in the popup's JS?
  //
  // Because the coordination we would like to do requires opening a new tab and
  // switching to that as the active tab. When changing active tabs, the
  // extension popup is closed. This actually terminates the popup's JS
  // execution! So any logic we implement in the popup that happens after the
  // tab is created will not run.
  //
  // To get around this, we instead message the service worker to create the tab
  // for us, since the service worker is always running in the background. The
  // service worker can then do all the follow-up logic, such as messaging the
  // new tab's content script to actually do the backfill.
  sendMessageToServiceWorker({
    target: "service-worker",
    rpc: "backfill-tweets",
    args: {
      tweetType,
    },
  });
}

function main() {
  installMessageLogger("content-script");

  window.addEventListener("load", (e) => {
    document
      .querySelector("button#index-likes")!
      .addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        backfillTweets("liked");
      });

    document
      .querySelector("button#index-bookmarks")!
      .addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        backfillTweets("bookmarked");
      });
  });
}

main();
