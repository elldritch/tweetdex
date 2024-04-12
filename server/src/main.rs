/*

Routes:

1. Index a new public tweet
    - Take a list of tweet IDs to index (maybe need their contents too?)
    - Multiple users might like the same tweet, so this processing can be globally shared
    - Kicks off a background job for parsing and loading the tweet, and handling processing of images and stuff?
2. Index a new private tweet
    - Take a user's handle and a list of private tweets with their contents
    - Can't index publicly, so will need to rely on the user's extension to upload
    - Scope private tweets to the uploading user
3. Add a new like
    - Take a user's handle and a list of tweet IDs that they like
    - Associates a user to a tweet, so that tweet shows up as a search candidate

For now, we'll save flat file lists:
- A folder per tweet
- A folder per user

And then we'll process this into an index later for textual and semantic search.

*/

fn main() {
    println!("Hello, world!");
}
