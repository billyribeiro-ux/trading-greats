// ============================================================================
// HOMEPAGE ROUTE CONFIG - Svelte 5 / SvelteKit Dec 2025 Best Practices
// ============================================================================

// SSG: Pre-render at build time for optimal Core Web Vitals (LCP, FID, CLS)
// This is the #1 SEO strategy for public marketing pages
export const prerender = true;

// SSR + CSR inherited from +layout.ts (ssr=true, csr=true)
// - SSR: Crawlers get fully rendered HTML on first paint
// - CSR: Hydration attaches listeners and reuses server data (no double-fetch)

// Dec 2025 Hydration Model:
// 1. SvelteKit SSRs the page with +page.server.ts data
// 2. HTML is embedded with serialized data
// 3. Svelte hydrates: checks DOM, attaches listeners, reuses data
// 4. With async SSR enabled, complex data loading avoids waterfalls
