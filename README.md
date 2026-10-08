# MusMedia V5

MusMedia is a front-end social/media prototype designed for GitHub Pages.

## V5 changes
- Home feed contains no fabricated posts/accounts.
- Messages contains no fabricated chats.
- Profile editor, follower counter/list UI and dark/light mode.
- Five-column desktop YouTube media discovery wall with infinite paging when the YouTube Data API is configured.
- YouTube search renders embedded videos inside MusMedia.
- Google / Apple / Facebook sign-in buttons are ready for a real OAuth backend.
- Special offer UI with Apple Pay, Google Pay and card options. Production payments must use a secure payment processor; never store raw card details in MusMedia.

## What still needs production credentials
GitHub Pages is static hosting. For real authentication, followers, posts and account data, connect an auth/database provider such as Supabase/Firebase and configure Google, Apple and Facebook OAuth credentials. The current `app.js` contains placeholders rather than pretending authentication is live.

For YouTube search, add a restricted YouTube Data API v3 browser key to `YOUTUBE_API_KEY` in `app.js`. Restrict the key to your GitHub Pages domain and enable only the required API.

For payments, use a payment processor/checkout flow and configure Apple Pay/Google Pay through that provider. Do not collect or store raw card numbers in this static front end.
