import { log } from "../log";
import { SavedTweetType } from "./types";

export type ContentScriptMessage =
  | ContentScriptMessageBackfillTweets
  | ContentScriptMessageParseUsername;

export type ContentScriptMessageBackfillTweets = {
  target: "content-script";
  rpc: "backfill-tweets";
  args: {
    tweetType: SavedTweetType;
  };
};

export async function sendContentScriptMessageBackfillTweets(
  tabId: number,
  tweetType: SavedTweetType,
): Promise<void> {
  return await chrome.tabs.sendMessage(tabId!, {
    target: "content-script",
    rpc: "backfill-tweets",
    args: {
      tweetType,
    },
  });
}

export type ContentScriptMessageParseUsername = {
  target: "content-script";
  rpc: "parse-username";
};

export async function sendContentScriptMessageParseUsername(
  tabId: number,
): Promise<string> {
  return await chrome.tabs.sendMessage(tabId!, {
    target: "content-script",
    rpc: "parse-username",
  });
}

function parseContentScriptMessage(
  message: object,
): message is ContentScriptMessage {
  return "target" in message && message.target === "content-script";
}

export function handleContentScriptMessages(
  handler: (message: ContentScriptMessage, reply: Function) => boolean,
): void {
  chrome.runtime.onMessage.addListener(
    (
      request: object,
      sender: chrome.runtime.MessageSender,
      reply: () => void,
    ): boolean | undefined => {
      log("Got message in content-script", request);
      if (parseContentScriptMessage(request)) {
        log("Message is targeted to content-script, running handler");
        return handler(request as ContentScriptMessage, reply);
      }
    },
  );
}
