// ============================================================================
// ROOT LAYOUT CONFIG - Svelte 5 / SvelteKit Dec 2025 Best Practices
// ============================================================================

// Global defaults for all routes (can be overridden per-route)
// SSR: Server-side render for SEO - crawlers get full HTML
export const ssr = true;

// CSR: Client-side hydration for interactivity
export const csr = true;

// Trailing slash normalization for canonical URLs
export const trailingSlash = 'never';
