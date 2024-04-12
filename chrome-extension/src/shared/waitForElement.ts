import { log } from "./log";

// Wait for an element to be added to the DOM.
export async function waitForElement(
  selector: string,
  timeoutMs?: number,
): Promise<Element> {
  return await new Promise<Element>((resolve, reject) => {
    let observer: MutationObserver;
    // Time out if it doesn't load in 10 seconds.
    const timeoutDuration = timeoutMs || 10000;
    const timeout = setTimeout(() => {
      log(
        "Timed out waiting for element after",
        timeoutDuration,
        "milliseconds",
      );
      log("Disconnecting observer");
      observer.disconnect();
      reject(new Error("Timed out waiting for element"));
    }, timeoutDuration);
    observer = new MutationObserver((e) => {
      const link = document.querySelector(selector);
      if (!link) {
        return;
      }
      log("Clearing timeout");
      clearTimeout(timeout);
      log("Disconnecting observer");
      observer.disconnect();
      resolve(link);
    });
    observer.observe(document, { subtree: true, childList: true });
  });
}
