# Score OS homepage — interactive AI video home screen (PREVIEW)

Static preview only. **Do not deploy to or change live scoresos.com.**

- Local path: `/workspace/projects/scoresos-homepage/interactive-ai-preview/`
- noindex + `robots.txt` Disallow
- Placeholder film: `media/hero-placeholder.{mp4,webm}` + `media/hero-poster.jpg`
- Swap in the real video via **one config spot**: `HERO_VIDEO` at the top of `app.js`
- Teammate delivers MP4 + WebM + poster to `/workspace/projects/scoresos-homepage/hero-video/` — copy into `media/`, then update those three paths (HTML comment also documents this)

## What's on this preview

1. **Full-screen video hero** with a lightweight canvas neural/particle mesh that reacts to the cursor
2. **Ask Maxine** glassy prompt bar — typing sample prompts + scripted streaming replies (no backend; clearly labeled Demo/Simulated)
3. **Credit score simulator** — drag "negative items removed"; sample dial animates (example data)
4. **Pick-your-role tiles** — Agency Owner → `/login`, Outsourcer → `/outsourcer/login`, Client → `/for-clients`
5. **AI working live ticker** — simulated events, labeled demo

## Links (confirmed against live SPA)

| Label | URL |
|-------|-----|
| Login | https://scoresos.com/login |
| Pricing | https://scoresos.com/#pricing |
| Info | https://scoresos.com/#about |
| Outsourcer | https://scoresos.com/outsourcer/login |
| For clients | https://scoresos.com/for-clients |

## Real vs simulated

| Real | Simulated (demo only) |
|------|------------------------|
| Top-bar links to live scoresos.com | Ask Maxine replies (scripted) |
| Role-tile destinations | Score dial numbers / bullet steps |
| Video / poster / brand chrome | AI ticker events |
| Cursor-reactive mesh (local canvas) | — |

No forms collect data. No analytics. No API calls.

## Hosting

Public GitHub repo + Render static site (`onrender.com`), free, noindex. Sibling to `scoresos-video-hero-preview` — that older preview stays intact.

Does not touch scoresos.com DNS or the Replit production app.

## Live preview URL

- https://scoresos-interactive-ai-preview.onrender.com
- GitHub: https://github.com/onelifequest-cmd/scoresos-interactive-ai-preview

Sibling of https://scoresos-video-hero-preview.onrender.com (kept intact).
