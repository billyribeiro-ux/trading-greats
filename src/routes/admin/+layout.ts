// Admin section: Internal dashboard, non-indexed
// Dec 2025 Policy: SSR for auth but no prerender (dynamic per-request)
export const prerender = false;

// Keep SSR for initial auth check, CSR for dashboard interactivity
export const ssr = true;
export const csr = true;
