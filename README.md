# Naimap Website

The official marketing website for **Naimap**, a native iOS mind-mapping app for iPhone and iPad. Live (once deployed) at `https://naimap.app`.

This repository contains the site only — not the Naimap app itself.

## Overview

The site covers the full product story: home, feature deep-dives, App Store screenshots, Naimap Pro, privacy, FAQ, roadmap, changelog, support, and contact. It's built to be fast, accessible, and maintainable for years, without depending on any framework or build tool.

## Technology

Plain, dependency-free web fundamentals:

- **HTML5** — one static `.html` file per page, semantic markup throughout
- **CSS3** — a single hand-written design system (`assets/css/style.css`), custom properties for theming, no preprocessor
- **Vanilla JavaScript** — a single file (`assets/js/main.js`), no framework, no bundler

There is **no build step**. What's in this repository is exactly what gets served. The only external dependencies are the system font stack (no web fonts are loaded) and the App Store badge, which is why the site works instantly on GitHub Pages with zero configuration.

## Running locally

Because there's no build step, any static file server works. From the repository root:

```bash
# Python 3
python -m http.server 8000

# Node (if you have it)
npx serve .
```

Then open `http://localhost:8000`. Opening the HTML files directly via `file://` mostly works too, but a local server avoids edge cases with absolute paths (`/assets/...`).

## Deploying to GitHub Pages

1. Push this repository to GitHub.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`.
4. Save. GitHub will publish the site at `https://<username>.github.io/<repo>/` within a minute or two.
5. For a custom domain (e.g. `naimap.app`): add a `CNAME` file at the repo root containing the domain, and configure your DNS provider with the records GitHub Pages documents for apex/subdomain hosting. Then set the custom domain in the same **Pages** settings screen.

## Folder structure

```
naimap-website/
├── index.html
├── features.html
├── support.html
├── privacy.html
├── faq.html
├── roadmap.html
├── changelog.html
├── contact.html
├── 404.html
├── robots.txt
├── sitemap.xml
├── site.webmanifest
└── assets/
    ├── css/
    │   └── style.css
    ├── js/
    │   └── main.js
    └── images/
        ├── logo/
        ├── icons/
        └── screenshots/
            ├── iphone/
            └── ipad/
```

Every page shares the same header, footer, and design tokens by duplicating that markup at the top/bottom of each file — there's no templating engine, so consistency across pages is maintained by hand. When editing the header, footer, or nav, update all pages together.

## Screenshots

All App Store screenshots used across the site (Home gallery, Features page, social preview images) live in `assets/images/screenshots/` and are the same assets submitted to the App Store, so the site and the App Store listing always show the same product.

## Known placeholders

A few values in this repository are placeholders until the app and site are actually live, and should be replaced before or shortly after launch:

| Placeholder | Where | Replace with |
|---|---|---|
| `https://naimap.app` | canonical URLs, Open Graph, Twitter Card, JSON-LD, sitemap.xml, robots.txt | the real deployed domain |
| `https://apps.apple.com/app/naimap` | App Store CTA buttons | the real App Store listing URL |
| `support@naimap.app`, `privacy@naimap.app` | mailto links across all pages | real, monitored inboxes |
| `https://github.com/iannetta/naimap-website` | footer GitHub links | the real repository URL, once created |
| Testimonials on the homepage | `index.html`, marked with an HTML comment | real user quotes, once available |
| The "Download on the App Store" badge | `index.html` (inline SVG) | Apple's official badge asset, once available in this environment |

## Contributing

This is currently a single-maintainer project. If you spot a bug or have a suggestion:

1. Open an issue describing the problem or idea.
2. For content fixes (typos, broken links), a pull request against the relevant `.html` file is welcome.
3. For design or structural changes, please open an issue first to discuss — the site intentionally avoids frameworks and build tooling, and changes should keep that constraint.

## License

Copyright © Naimap. All rights reserved. The site's HTML/CSS/JS structure may be referenced for learning purposes; Naimap's name, logo, screenshots, and other brand assets may not be reused.

## Roadmap

This website will grow alongside the app — see [roadmap.html](roadmap.html) for what's planned for Naimap itself. For the site specifically, expected future additions include real testimonials, the official App Store badge asset, and a custom domain.
