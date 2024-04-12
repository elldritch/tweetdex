import { installMessageLogger, log } from "../shared/log";
import { handleServiceWorkerMessages } from "../shared/messages/service-worker";
import { backfillTweets } from "./backfill";

function main() {
  installMessageLogger("service-worker");

  handleServiceWorkerMessages((message) => {
    switch (message.rpc) {
      case "backfill-tweets":
        return backfillTweets(message.args.tweetType);
      default:
        const exhaustiveCheck: never = message.rpc;
        throw new Error(`Unknown RPC: ${exhaustiveCheck}`);
    }
  });
}

main();
