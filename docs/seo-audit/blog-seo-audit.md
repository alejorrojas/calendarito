# Calendarito Blog SEO Audit

Date: July 5, 2026

## Summary

Calendarito needed more indexable surface beyond the app landing pages. The new blog adds two crawlable, internally linked pages targeting:

- Brand/story trust: `/blog/why-we-built-calendarito`
- Category discovery and backlinks: `/blog/best-chrome-extensions-2026`

## Applied SEO Work

- Added `/blog` index page with metadata, canonical URL, Open Graph, Twitter metadata, and `Blog` JSON-LD.
- Added individual blog pages with metadata, canonical URLs, `BlogPosting` JSON-LD, and breadcrumb JSON-LD.
- Added `robots.txt` and `sitemap.xml`; sitemap includes the blog index and both blog posts.
- Added homepage link to `/blog` so the blog is reachable from the main navigation.
- Added visible `Add to Google Chrome` CTA on the homepage and blog pages.
- Added an external backlink from the Chrome extensions article to Tabu at `https://www.whatsappblur.com/`.

## Content Notes

The story post targets authentic product-origin queries around AI calendar creation, schedule screenshots, PDFs, images, and Google Calendar event creation.

The Chrome extensions post targets broader discovery intent and includes Calendarito as the scheduling extension plus Tabu as a promising WhatsApp Web privacy extension.

## Verification

- `bunx eslint app/page.tsx app/blog app/robots.ts app/sitemap.ts` passed for the files touched by this task.
- `RESEND_API_KEY=re_dummy_for_build bun run build` passed and generated static routes for:
  - `/blog`
  - `/blog/why-we-built-calendarito`
  - `/blog/best-chrome-extensions-2026`
  - `/robots.txt`
  - `/sitemap.xml`

## Existing Non-Blocking Issues

- `bun run lint` currently fails on pre-existing `react/no-unescaped-entities` errors in `app/privacy/page.tsx` and `app/terms/page.tsx`, plus warnings in `app/get-started/page.tsx`. These were not introduced by the blog changes.
- `bun run build` without environment variables fails because `/api/webhooks/supabase` requires a Resend API key at build/page-data collection time. Build passes when `RESEND_API_KEY` is provided.
