window.addEventListener('load', (e) => {
  console.log('Extension loaded');
  console.log(chrome.storage);

  const matches = window.location.href.match(
    /https:\/\/twitter\.com\/([^/]+)\/likes/g
  );

  if (matches) {
    console.log('This is the likes page!');

    console.log('Waiting 4 seconds for liked tweets to render');
    // Wait for the tweets to load.
    //
    // TODO: There's probably a smarter way to watch the DOM tree.
    setTimeout(async () => {
      console.log('Parsing rendered tweets');

      // Scroll until I can't scroll anymore.
      window.scrollTo(0, 0);
      let lastScrollPosition = 0;
      while (true) {
        // On each page, look for tweets.
        const tweets = document.querySelectorAll('[data-testid=tweet]');
        console.log(`Found ${tweets.length} tweets rendered on page`);

        const getSeen = await chrome.storage.local.get('seenlist');
        const seenlist = getSeen.seenlist ? JSON.parse(getSeen.seenlist) : {};
        console.log('Initial seenlist');
        console.log(seenlist);

        // Save each tweet.
        await Promise.all(
          Array.from(tweets).map(async (tweet) => {
            // Get the tweet ID and HTML.
            const href = tweet
              .querySelector('[data-testid=User-Name]')
              .querySelector('a[aria-label]')
              .getAttribute('href');
            const key = `tweet:${href}`;

            // Save the tweet to storage if it's new.
            const size = await chrome.storage.local.getBytesInUse(key);
            console.log('Tweet ID:', href);
            if (size === 0) {
              console.log('New tweet, saving:', tweet.outerHTML);
              await chrome.storage.local.set({ [key]: tweet.outerHTML });
            } else {
              console.log('Tweet seen before');
            }

            // Update the seenlist.
            seenlist[key] = true;
          })
        );

        // Save the new seenlist.
        console.log('Updating seenlist:');
        console.log(seenlist);
        console.log(JSON.stringify(seenlist));
        await chrome.storage.local.set({ seenlist: JSON.stringify(seenlist) });

        // Pause to let new tweets load and render.
        await new Promise((resolve) => setTimeout(resolve, 1000));

        window.scrollTo(0, window.scrollY + window.innerHeight);
        if (window.scrollY == lastScrollPosition) {
          break;
        } else {
          lastScrollPosition = window.scrollY;
        }
      }
    }, 4000);
  } else {
    console.log('This is not the likes page');
  }
});
