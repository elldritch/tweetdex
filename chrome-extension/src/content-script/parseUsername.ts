import { log } from "../shared/log";
import { waitForElement } from "../shared/waitForElement";

export async function parseUsername(): Promise<string> {
  log("Parsing username");

  // Wait until the app actually loads and paints.
  const profileLink = await waitForElement(
    "[data-testid=AppTabBar_Profile_Link]",
  );
  log(profileLink);
  if (!profileLink) {
    throw new Error("Could not parse profile link");
  }

  const profileHref = profileLink.getAttribute("href");
  if (!profileHref) {
    throw new Error("Malformed profile link");
  }
  const username = profileHref.substring(1);
  log("Parsed username", username);
  return username;
}
