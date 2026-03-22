# Manual Content Update Guide

This file is your quick reference for updating website content manually.

## 1) Main Rule

Edit this file for content changes:

- `content/site-content.json`

Most visible text is loaded from JSON by `animations.js`.
So even if `index.html` has similar text, JSON is the source of truth.

---

## 2) Section Map (Where to Edit)

## Hero

In `content/site-content.json`:

- `hero.title`
- `hero.lead`
- `hero.typingWords` (array of rotating words)

Example:

```json
"hero": {
  "title": "Building Systems With Taste",
  "lead": "Your hero paragraph here.",
  "typingWords": [
    "Open to collaborate",
    "Building thoughtful products",
    "Shipping clean interfaces"
  ]
}
```

## Career

The homepage button fallback lives in `content/site-content.json`:

- `career.resumeUrl`
- `career.entries[]` (`period`, `org`, `role`, `highlights`, `images`)

The real resume routing now lives in:

- `resume-links.js`
- `vercel.json`

Use it for two things:

- `activeButtonPath` controls where the homepage `Download Resume` button goes.
- `vercel.json` controls where `/resume`, `/pm-resume`, etc. redirect at the hosting layer.

Example:

```js
window.RESUME_LINKS = {
  activeButtonPath: "/resume"
};
```

```json
{
  "redirects": [
    {
      "source": "/resume",
      "destination": "https://drive.google.com/file/d/...",
      "permanent": false
    },
    {
      "source": "/pm-resume",
      "destination": "https://drive.google.com/file/d/...",
      "permanent": false
    }
  ]
}
```

## Builds

In `content/site-content.json`:

- `builds[]`

Each item supports:

- `title`
- `description`
- `meta` (year + keywords shown above title)
- `imageSrc`
- `imageAlt`
- `href` (main click URL)
- optional: `liveUrl`, `repoUrl` (for your own reference)

Example:

```json
{
  "id": 1,
  "title": "NutriPlay",
  "description": "Gamified nutrition coach...",
  "meta": "2026 • Nutrition • Gamified Web App",
  "imageSrc": "assets/builds/build-1.png",
  "imageAlt": "NutriPlay preview",
  "href": "https://nutri-play.vercel.app/"
}
```

## Library - Recent Activities

In `content/site-content.json`:

- `library.activities[]`

For normal image cards:

- `title`, `description`, `imageSrc`, `imageAlt`, `href`

For embeds:

- LinkedIn/Instagram: `embedUrl` + `href`
- X/Twitter: `embedType: "twitter"` + `href`

Example (X post):

```json
{
  "title": "X Post",
  "description": "Short summary",
  "embedType": "twitter",
  "href": "https://twitter.com/yourhandle/status/1234567890"
}
```

## Library - Recommendations

In `content/site-content.json`:

- `library.recommendations[]`

Fields:

- `title`
- `description`
- `imageSrc`
- `imageAlt`
- `href`

## Library - Resources

In `content/site-content.json`:

- `library.resources[]`

Supports label badge:

- `mark`: `"Self"` or `"Reposted"`

Example:

```json
{
  "title": "Why MCP Won",
  "description": "A strong view on why MCP became default.",
  "mark": "Reposted",
  "imageSrc": "assets/library/resource-2.jpg",
  "imageAlt": "Article preview",
  "href": "https://www.latent.space/p/why-mcp-won"
}
```

## Connect Section

In `content/site-content.json`:

- `connect.email`
- `connect.formEndpoint`
- `connect.formAccessKey`
- `connect.socials[]`

Example:

```json
"connect": {
  "email": "hritikmehta.77@gmail.com",
  "formEndpoint": "https://api.web3forms.com/submit",
  "formAccessKey": "YOUR_KEY",
  "socials": [
    { "label": "GitHub", "href": "https://github.com/hritikmehta" },
    { "label": "LinkedIn", "href": "https://www.linkedin.com/in/hritik-mehta77/" },
    { "label": "X", "href": "https://x.com/HritikMehta_" },
    { "label": "Medium", "href": "https://medium.com/@hritik999" }
  ]
}
```

---

## 3) Image Locations

## Builds images

Put files in:

- `assets/builds/`

Current convention:

- `build-1.png`, `build-2.png`, `build-3-generated.svg`

## Library images

Put files in:

- `assets/library/`

Then reference exact file names in JSON.

Note:

- One file is intentionally named `Recommnedations-3.png` (typo in filename). Keep exact spelling unless you rename file + JSON path together.

---

## 4) Run Locally

From project root:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Open:

- `http://127.0.0.1:8000`

---

## 5) Quick Validation Before Push

Run:

```bash
jq empty content/site-content.json
node --check animations.js
node --check resume-links.js
jq empty vercel.json
```

If both pass, content syntax is good.

---

## 6) Push to Git

```bash
git add content/site-content.json
git commit -m "Update content"
git push
```

Add any changed assets too, for example:

```bash
git add assets/builds assets/library
```
