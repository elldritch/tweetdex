// This variable is set by `esbuild`.
const DEBUG = (window as typeof window & { DEBUG: boolean }).DEBUG;

export function log(...args: any[]) {
  if (DEBUG) {
    console.log(...args);
  }
}

export function installMessageLogger(whoami: string) {
  chrome.runtime.onMessage.addListener(
    (request: object, sender: chrome.runtime.MessageSender): undefined => {
      log(
        `Received message in ${JSON.stringify(whoami)}`,
        request,
        "from sender",
        sender,
      );
    },
  );
}
