import { log } from "../shared/log";
import {
  sendContentScriptMessageBackfillTweets,
  sendContentScriptMessageParseUsername,
} from "../shared/messages/content-script";
import { SavedTweetType } from "../shared/messages/types";

// See comment in `popup/main.ts#backfillTweets`.
export async function backfillTweets(tweetType: SavedTweetType) {
  // This Promise should resolve when the tab is done loading.
  let backfillTabPromise: Promise<chrome.tabs.Tab>;
  switch (tweetType) {
    case "bookmarked": {
      backfillTabPromise = new Promise(async (resolve) => {
        const t = await chrome.tabs.create({
          active: true,
          url: "https://twitter.com/i/bookmarks",
        });
        chrome.tabs.onUpdated.addListener(function listener(tabId, info, tab) {
          log("Got tab update", tabId, info, tab);
          if (tabId !== t.id) {
            return;
          }
          if (info.status === "complete") {
            chrome.tabs.onUpdated.removeListener(listener);
            resolve(t);
          }
        });
      });
      break;
    }
    case "liked": {
      // There's no URL for "my liked tweets", so we have to construct it by
      // reading the logged-in user's handle.
      backfillTabPromise = new Promise(async (resolve) => {
        const t = await chrome.tabs.create({
          active: true,
          url: "https://twitter.com",
        });

        let state: "TAB_CREATED" | "USERNAME_PARSED" = "TAB_CREATED";
        chrome.tabs.onUpdated.addListener(
          async function listener(tabId, info, tab) {
            log("Got tab update", tabId, info, tab);
            if (tabId !== t.id) {
              return;
            }
            if (info.status === "complete") {
              switch (state) {
                case "TAB_CREATED": {
                  log(
                    "Tab creation complete, sending message to parse username",
                  );
                  const username =
                    await sendContentScriptMessageParseUsername(tabId);
                  state = "USERNAME_PARSED";
                  log("Parsed username", username);
                  const url = `https://twitter.com/${username}/likes`;
                  log("Updating backfill tab URL to", url);
                  chrome.tabs.update(t.id, { url });
                  break;
                }
                case "USERNAME_PARSED": {
                  log("Backfill tab loaded");
                  chrome.tabs.onUpdated.removeListener(listener);
                  resolve(t);
                  break;
                }
                default:
                  const exhaustiveCheck: never = state;
                  throw new Error(`Unknown state: ${exhaustiveCheck}`);
              }
            }
          },
        );
      });
      break;
    }
    default:
      const exhaustiveCheck: never = tweetType;
      throw new Error(`Unknown tweet type: ${exhaustiveCheck}`);
  }

  const backfillTab = await backfillTabPromise;
  log("Backfill tab ready", backfillTab);

  // TODO: Index tweets in the backfill tab.
  sendContentScriptMessageBackfillTweets(backfillTab.id!, tweetType);
}
