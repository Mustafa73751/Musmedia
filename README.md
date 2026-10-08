# MusMedia

MusMedia is a social-media style front-end prototype with a photo-first Home feed and a YouTube-powered Media Feed.

## What's in this version
- Home feed with photo cards and real account links
- @mzzt4f4 Instagram account link
- Popular account cards for football/music/community accounts
- Media Feed with 5 video cards across on desktop
- Categories: For You, Islam, Basketball, Football, Music and Rap
- YouTube embeds using the official YouTube player
- YouTube search box
- Live YouTube search support when a YouTube Data API v3 key is added in `app.js`
- Pagination / Load more for live YouTube search results
- GitHub Pages friendly static files

## YouTube search setup
The official YouTube Data API is required for live in-site search. Add a restricted browser API key here in `app.js`:

`const YOUTUBE_API_KEY = "YOUR_KEY_HERE";`

Restrict the key to your GitHub Pages site and only the APIs you need. Without a key, the search button opens the matching search on YouTube itself.

## GitHub Pages
Upload these four files directly into the root of your repository:
- `index.html`
- `style.css`
- `app.js`
- `README.md`

Do not upload the ZIP itself. In GitHub Pages use:
- Branch: `main`
- Folder: `/ (root)`
