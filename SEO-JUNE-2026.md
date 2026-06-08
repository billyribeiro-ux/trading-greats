# Google June 2026 SEO — Audit & Implementation Guide

> **May 2026 Core Update**: Rolled out May 21 – June 2, 2026 (12 days) · Now complete  
> **FAQ Rich Results**: Fully removed from Google SERP on May 7, 2026  
> **AI Mode**: Now a separate citation surface alongside AI Overviews  

---

## What Changed Since May 2026

### May 2026 Core Update ("The Disintermediation Update") — Complete June 2, 2026

| Signal | Direction | Notes |
|---|---|---|
| Direct brand authority | ↑ +8–26% | Airlines, banks, sports leagues, retailers, video platforms all gained |
| Aggregators & middlemen | ↓ −9–11% | Sites that summarise primary sources without adding value dropped sharply |
| E-E-A-T (all topics) | ↑ Stronger | Named authors + verifiable credentials now required across ALL niches |
| AI Overviews citations | ↑ New surface | Rankings and AI citations now move independently — both must be optimised |
| Topical authority depth | ↑ Required | Interlinked content clusters outperform broad shallow sites by up to 30% |
| AI-generated thin content | ↓ Penalised | Mass-produced generic AI content loses ground regardless of origin |
| News module SERP feature | ↓ −58% | Google collapsed News carousels in SERPs significantly |
| Discussions & Forums | ↓ −34.4% | Reddit/forum content visibility fell sharply in organic |

**Key data points (seoClarity research, June 2026):**
- 33.7% of tracked keywords got a brand-new #1 organic result in the week before Google's announcement
- 19.8% of total search query volume saw a complete top-organic shift
- Biggest winners: Video Platforms (+26.3%), Sports Brands (+19.3%), Finance Brands (+9.5%), Travel Brands (+8.2%)
- Biggest losers: Travel aggregators (−11.0%), Finance comparison/affiliate (−9.1%)

### FAQ Rich Results Fully Removed — May 7, 2026

| Element | Status | Timeline |
|---|---|---|
| FAQ rich result (SERP dropdown) | **Removed** | Effective May 7, 2026 |
| FAQPage schema validity | **Still valid** | Google + AI engines still parse it |
| Search Console FAQ report | Being removed | June 2026 |
| Search Console API FAQ support | Being removed | August 2026 |

**What this means for Trading Greats:**  
- Keep FAQPage schema — it is still parsed by Gemini, Bing/ChatGPT, Perplexity for AI answer extraction  
- Remove any UI elements that reference "FAQ rich results" as a KPI  
- Treat FAQPage as an **AEO asset** (AI citation), not a SERP decoration asset  
- HowTo schema also deprecated for rich results (since Sept 2023) — same pattern applies

### AI Mode — New Citation Surface (Launched alongside Google I/O 2026)

- AI Overviews now appear on **~48% of Google queries** (up from 31% in Feb 2025)
- AI Mode is a separate deep-research surface; pages cited there ≠ pages ranking #1 organically
- Getting cited in an AI Overview earns **35% more clicks** than holding a traditional rank alone
- AEO (Answer Engine Optimization) is now a first-class SEO priority alongside traditional rankings

### Schema Strategy Shift for AI (June 2026)

Old priority (2023–2024): FAQPage, HowTo → rich results  
**New priority (June 2026)**: Organization, Author/Person, Product, Service → entity identity + AI citations

| Schema Type | June 2026 Purpose | Priority |
|---|---|---|
| `Organization` | Entity identity anchor for all AI engines | Critical |
| `Person` (authors) | E-E-A-T signal — named credentials required | Critical |
| `ProfilePage` | Trader entity page — AI citation structure | High |
| `Article` with `speakable` | Blog content — AI answer extraction | High |
| `WebSite` with `SearchAction` | Sitelinks search box + entity anchor | High |
| `BreadcrumbList` | Navigation context | Medium |
| `FAQPage` | AI citation only — no SERP feature | Low–Medium |
| `HowTo` | AI parsing only — no SERP feature | Low |

### Entity Architecture for AI Agents (June 2026)

AI agents (ChatGPT, Gemini, Perplexity) verify facts via **entity depth chains**:

```
WebSite → Organization → Person (author) → Article
                              ↕ sameAs → social profiles
ProfilePage → Person (trader) → knowsAbout → topics
```

Critical requirements:
- Every `@id` must be a resolvable URL
- `sameAs` links must connect entities to known external sources (Twitter/X, LinkedIn, Wikipedia)
- `worksFor` must link author Person → Organization
- `isPartOf` must link every Article → WebSite

---

## Current Repo Implementation Audit (June 2026)

### ✅ Already Implemented

| Feature | File | Status |
|---|---|---|
| `<SEO>` component with title, desc, canonical, OG, Twitter | `src/lib/components/SEO.svelte` | ✅ |
| JSON-LD `WebSite` schema with correct `SearchAction` | `JsonLd.svelte` | ✅ Fixed in May 2026 |
| JSON-LD `Organization` with logo + sameAs | `JsonLd.svelte` | ✅ |
| JSON-LD `Person` schema (traders) | `JsonLd.svelte` | ✅ |
| JSON-LD `ProfilePage` schema | `JsonLd.svelte` | ✅ |
| JSON-LD `BreadcrumbList` | `JsonLd.svelte` | ✅ |
| JSON-LD `FAQPage` schema | `JsonLd.svelte` | ✅ (AI citation asset) |
| JSON-LD `Article` with `speakable` | `JsonLd.svelte` + `blog/[slug]/+page.svelte` | ✅ |
| JSON-LD `TraderArticle` with `speakable` | `JsonLd.svelte` | ✅ |
| `isPartOf` WebSite in Article schemas | `JsonLd.svelte` | ✅ |
| Dynamic sitemap from live DB | `sitemap.xml/+server.ts` | ✅ |
| Image sitemap extensions | `sitemap.xml/+server.ts` | ✅ |
| robots.txt with AI training opt-out | `robots.txt/+server.ts` | ✅ |
| AI citation bots allowed (ChatGPT-User, Perplexity) | `robots.txt/+server.ts` | ✅ Fixed June 2026 |
| `llms.txt` GEO guidance | `llms.txt/+server.ts` | ✅ |
| Author byline visible on blog posts | `blog/[slug]/+page.svelte` | ✅ |
| max-image-preview:large robots meta | `SEO.svelte` | ✅ |
| Canonical URL normalization | `SEO.svelte` | ✅ |
| LCP image preload | `SEO.svelte` | ✅ |
| RSS feed | `rss.xml/+server.ts` | ✅ |
| Theme-color meta | `+layout.svelte` | ✅ |

### ✅ Fixed in This June 2026 Update

| Fix | File | Impact |
|---|---|---|
| Article/TraderArticle author: `Organization` → named `Person` with `worksFor` | `JsonLd.svelte` | E-E-A-T signal — HIGH |
| Blog article author in inline schema: `Organization` → named `Person` | `blog/[slug]/+page.svelte` | E-E-A-T signal — HIGH |
| `Organization` schema: added `description` + `knowsAbout` | `JsonLd.svelte` | Entity depth — MEDIUM |
| `Person` trader schema: added `description` field | `JsonLd.svelte` | Entity clarity — MEDIUM |
| robots.txt: allow `ChatGPT-User` + `PerplexityBot` for AI citation | `robots.txt/+server.ts` | GEO/AEO — MEDIUM |
| `llms.txt`: Updated to June 2026 with AI Mode context | `llms.txt/+server.ts` | GEO — LOW–MEDIUM |

### ❌ Remaining Gaps

| Gap | Impact | Priority |
|---|---|---|
| **Author bio page** (`/about`) does not have a dedicated `Person` schema for the editorial team | E-E-A-T — named credentials | HIGH |
| **`og:article:author`** in `SEO.svelte` is wired but `blog/[slug]` page does not pass `author` prop to `<SEO>` (passed separately to `<svelte:head>`) | Fragmented OG data | MEDIUM |
| **No `dateModified` on static sitemap pages** — uses `now` instead of actual last-modified date | Crawl efficiency | LOW |
| **Trader `Person` schema missing `honorificSuffix` / `award`** — could signal authority for legendary traders | Entity richness | LOW |
| **No `WebPage` / `AboutPage` schema on `/about`** | Entity structure | LOW |
| **No `CollectionPage` schema on `/traders` index** | Category page context | LOW |

---

## June 2026 AEO (Answer Engine Optimization) Checklist

These are the practices that determine whether Trading Greats content is **cited inside AI answers**:

- [x] Direct, factual answer in the **first paragraph** of every trader bio and blog post  
- [x] `speakable` cssSelector defined on all Article schemas  
- [x] `FAQPage` schema on trader profiles (AI extraction asset)  
- [x] `ProfilePage` schema with `mainEntity → Person` for trader pages  
- [x] Named author `Person` with `worksFor → Organization` (fixed June 2026)  
- [x] `sameAs` on Organization schema linking to social profiles  
- [x] `sameAs` on trader `Person` schema from their `socialLinks`  
- [ ] `/about` page needs `Person` schema for editorial team  
- [ ] Structured FAQs in visible HTML (not just schema) for AI extraction fallback  

---

## Key Technical Rules for This Repo (SvelteKit + Svelte 5)

- Use `<svelte:head>` for all meta tags (SSR-rendered for SEO)
- Use `$derived` for reactive meta values (not `$effect`)
- JSON-LD via `{@html \`<script type="application/ld+json">...\`}` inside `<svelte:head>`
- Structured data in `+page.svelte`, not `+layout.svelte` (page-specific)
- `SEO.svelte` centralises all meta; avoid duplicate `<svelte:head>` for same tags
- Author field in all Article schemas must be a named `Person`, not `Organization`
- `FAQPage` schema: keep it — no longer produces SERP feature but still parsed by AI engines
- robots.txt: block training bots (GPTBot, CCBot, anthropic-ai); allow retrieval bots (ChatGPT-User, PerplexityBot)
