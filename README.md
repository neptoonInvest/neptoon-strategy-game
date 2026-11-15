# Neptoon — Know Your Strategies

Static site. No build step and no dependencies.

## Play locally

Open this folder with any static server (ES modules do not load from a `file://` address):

```bash
python3 -m http.server 8080
```

Then open the site in a browser.

## GitHub Pages

1. Push these files to the root of a repository.
2. Settings → Pages → Deploy from the `main` branch, folder `/ (root)`.
3. The site is `index.html`. Paths are relative, so it also works as a project page.
