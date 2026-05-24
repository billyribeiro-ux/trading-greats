# Google May 2026 Core Update — SEO Audit & Implementation Guide

> Rolling out: **May 21, 2026** · Estimated completion: June 2–4, 2026

---

## What Changed in the May 2026 Core Update

### Core Signals Being Re-weighted

| Signal | Direction | Notes |
|---|---|---|
| E-E-A-T (Experience, Expertise, Authority, Trust) | ↑ Stronger | Now applies across ALL topic categories, not just YMYL |
| Named authors with verifiable credentials | ↑ New requirement | Anonymous content harder to rank; bio pages with qualifications required |
| Original, first-hand content | ↑ Heavily rewarded | Primary sources beat aggregators; unique angle, proprietary data |
| Topical authority + depth | ↑ Required | Narrow focus + comprehensive coverage wins over broad shallow sites |
| AI-generated thin content | ↓ Penalized | Mass-produced generic content loses ground regardless of AI origin |
| Aggregator/derivative pages | ↓ Penalized | Paraphrasing stronger sources without adding value demoted |
| Domain-level quality holism | ↑ Expanded | Low-quality pages anywhere drag down high-quality pages site-wide |
| AI Overviews citation signals | ↑ New factor | Rankings + citation structure together determine AI answer inclusion |
| Direct answers early in content | ↑ Citation driver | Pages cited in AI Overviews have structured answer at top |
| Internal linking / topical clusters | ↑ Authority signal | Connects related content, signals depth to Google |

### What March 2026 Analysis Showed (May 2026 continues the trend)
- 79.5% of top-3 URLs changed rankings (vs 66.8% in Dec 2025)
- 24% of top-10 pages dropped out of top 100
- Winners: Government, nonprofits, professional associations, transactional brands with direct subject relationships
- Losers: Aggregators, thin comparison pages, generic affiliate, pages that repackage primary sources

### AI Overviews & AI Mode (Parallel change at Google I/O)
- Google redesigned Search around AI Mode at I/O 2026
- Citations inside AI Overviews are now as important as traditional position 1
- Pages cited share: direct answer early, structured formatting (steps/definitions), strong topical authority, named author credentials, original data or first-hand perspective

---

## Current Repo SEO Audit

### ✅ Already Implemented

| Feature | File | Status |
|---|---|---|
| `<SEO>` component with title, desc, canonical, OG, Twitter | `src/lib/components/SEO.svelte` | ✅ Complete |
| JSON-LD WebSite schema | `src/routes/+layout.svelte` | ✅ |
| JSON-LD Person schema (traders) | `src/lib/components/JsonLd.svelte` | ✅ |
| JSON-LD BreadcrumbList | `JsonLd.svelte` | ✅ |
| JSON-LD Article schema | `JsonLd.svelte` | ✅ |
| JSON-LD FAQPage schema | `JsonLd.svelte` | ✅ |
| JSON-LD TraderArticle with speakable | `JsonLd.svelte` | ✅ |
| Dynamic sitemap.xml with image extensions | `src/routes/sitemap.xml/+server.ts` | ✅ |
| robots.txt with AI crawler opt-out | `src/routes/robots.txt/+server.ts` | ✅ |
| RSS feed | `src/routes/rss.xml/+server.ts` | ✅ |
| max-image-preview:large robots meta | `SEO.svelte` | ✅ |
| Canonical URL normalization | `SEO.svelte` | ✅ |
| LCP image preload | `SEO.svelte` | ✅ |
| Theme-color meta | `+layout.svelte` | ✅ |

### ❌ Gaps vs May 2026 Requirements

| Gap | Impact | Priority |
|---|---|---|
| **Author schema**: Article/TraderArticle JSON-LD uses `Organization` not named `Person` author | E-E-A-T signal loss | HIGH |
| **Author bio page**: No `/about/author` or author bio linked from articles | Named credential requirement | HIGH |
| **`author` prop missing from SEO component**: `<SEO>` accepts `author` but `blog/[slug]` passes it to `<svelte:head>` separately, not to `og:article:author` via SEO | Fragmented implementation | MEDIUM |
| **`ProfilePage` schema missing**: Trader pages have `Person` schema but no `ProfilePage` wrapping schema | Better SERP display | MEDIUM |
| **`isPartOf` / `WebSite` linkage missing in Article schema** | AI citation structure | MEDIUM |
| **`speakable` only on TraderArticle** — missing from blog Article schema | AI Overviews citation | MEDIUM |
| **No `llms.txt`** — Google sent mixed signals but Bing + AI crawlers respect it | GEO (Generative Engine Optimization) | LOW-MEDIUM |
| **Sitemap uses seed data** — production DB traders/posts not included dynamically | Index coverage | HIGH |
| **No `dateModified` on sitemap static pages** — only `now`, not actual last-modified | Crawl efficiency | LOW |
| **`IconSearchAction` typo** in WebSite schema — should be `SearchAction` | Broken structured data | HIGH |
| **No `Organization` schema with logo** at root level | Brand E-E-A-T | MEDIUM |
| **No `sameAs` linking Trading Greats org** to social profiles | Authoritativeness | MEDIUM |

---

## Implementation Plan

### Phase 1 — Critical (Broken/High-Impact)
1. Fix `IconSearchAction` → `SearchAction` in `JsonLd.svelte` WebSite schema
2. Change Article/TraderArticle author from `Organization` → named `Person` with `url` to bio
3. Add `Organization` schema with `logo`, `sameAs` to `JsonLd.svelte`
4. Add `speakable` to blog Article schema
5. Add `isPartOf` WebSite reference in Article schemas
6. Wire sitemap to live DB instead of seed data

### Phase 2 — E-E-A-T Signals
7. Add `ProfilePage` schema for trader pages
8. Add author bio section to `blog/[slug]` page
9. Add `llms.txt` route

### Phase 3 — GEO (AI Overviews Optimization)
10. Ensure first paragraph of trader bios and blog posts contains a direct answer
11. Add `speakable` cssSelector to all article schemas

---

## Key Technical Rules for This Repo (SvelteKit + Svelte 5)

- Use `<svelte:head>` for all meta tags (rendered server-side for SSR/SEO)
- Use `$derived` for reactive meta values (not `$effect`)
- JSON-LD via `{@html \`<script type="application/ld+json">...\`}` inside `<svelte:head>`
- Structured data should be in `+page.svelte`, not `+layout.svelte` (page-specific)
- `SEO.svelte` component centralizes all meta; avoid duplicate `<svelte:head>` for same tags
- Sitemap must use live DB queries (not seed) in production; currently broken for real data
