// Enable Static Site Generation (SSG) for the homepage
// This pre-renders the page at build time for optimal Core Web Vitals (LCP, FID, CLS)
export const prerender = true;

// Enable SSR for SEO - ensures crawlers get fully rendered HTML
export const ssr = true;

// Enable client-side hydration for interactivity
export const csr = true;
