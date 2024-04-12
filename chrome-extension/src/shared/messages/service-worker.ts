import { SavedTweetType } from "./types";

export type ServiceWorkerMessage = {
  target: "service-worker";
} & {
  rpc: "backfill-tweets";
  args: {
    tweetType: SavedTweetType;
  };
};

export async function sendMessageToServiceWorker(
  message: ServiceWorkerMessage,
): Promise<void> {
  return await chrome.runtime.sendMessage(message);
}

function parseServiceWorkerMessage(
  message: object,
): message is ServiceWorkerMessage {
  return "target" in message && message.target === "service-worker";
}

export function handleServiceWorkerMessages(
  handler: (message: ServiceWorkerMessage) => void,
): void {
  chrome.runtime.onMessage.addListener(
    (request: object, sender: chrome.runtime.MessageSender): undefined => {
      if (parseServiceWorkerMessage(request)) {
        handler(request as ServiceWorkerMessage);
      }
    },
  );
}
