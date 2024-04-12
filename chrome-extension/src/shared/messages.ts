import { ContentScriptMessage } from "./messages/content-script";
import { ServiceWorkerMessage } from "./messages/service-worker";

export type Message = ServiceWorkerMessage | ContentScriptMessage;
