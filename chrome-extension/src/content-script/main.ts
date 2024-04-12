import { installMessageLogger, log } from "../shared/log";
import { handleContentScriptMessages } from "../shared/messages/content-script";
import { backfillTweets } from "./backfill";
import { parseUsername } from "./parseUsername";

function main() {
  installMessageLogger("content-script");

  handleContentScriptMessages((message, reply): boolean => {
    switch (message.rpc) {
      case "backfill-tweets":
        backfillTweets(message.args.tweetType);
        return false;
      case "parse-username":
        parseUsername(reply);
        return true;
      default:
        const exhaustiveCheck: never = message;
        throw new Error(`Unknown RPC: ${exhaustiveCheck}`);
    }
  });
}

main();
