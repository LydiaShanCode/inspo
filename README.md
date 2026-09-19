# inspo

Visual inspiration diary — image-forward design references, motion work, and
creative bookmarks. The site is a dependency-free static page published with
GitHub Pages.

**Live site:** https://lydiashancode.github.io/inspo/

## One-time setup on GitHub

The deploy workflow is already in the repo, but Pages has to be switched on in
the repository settings once:

1. Go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Push to `main` (or run the *Deploy site to GitHub Pages* workflow manually
   from the **Actions** tab). The first run publishes the site.

After that, every push to `main` redeploys automatically.

## Running it locally

The page fetches `data/entries.json`, so it needs to be served over HTTP rather
than opened as a `file://` URL:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Adding an entry

Add an image to `images/` and prepend an object to `data/entries.json`:

```json
{
  "title": "Short description of the reference",
  "date": "2026-09-19",
  "image": "images/my-new-entry.jpg",
  "alt": "What the image shows, for screen readers",
  "note": "Why it was worth saving.",
  "tags": ["color", "layout"],
  "source": "https://example.com/original"
}
```

`tags` drives the filter chips at the top of the page, `source` is optional, and
entries are sorted by `date` automatically. The starter entries use generated
SVG placeholders — replace them with real images as the diary fills up.

## Layout

| Path | Purpose |
| --- | --- |
| `index.html` | Page markup |
| `styles.css` | Theme tokens, masonry grid, lightbox |
| `app.js` | Loads entries, renders cards, tag filtering, theme toggle |
| `data/entries.json` | The diary content |
| `images/` | Entry images and favicon |
| `.github/workflows/deploy-pages.yml` | Pages deployment |
