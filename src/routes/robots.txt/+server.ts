import type { RequestHandler } from "./$types";

const PUBLIC_SITE_URL = "https://tradinggreats.com";

// June 2026: Updated robots.txt — training bots blocked, citation/retrieval bots allowed for GEO
export const GET: RequestHandler = async () => {
  const robotsTxt = `# Trading Greats Robots.txt
# Updated June 2026: Split AI crawler policy — block training, allow citation

# Default rules for all crawlers
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Disallow: /_app/

# Google-specific rules (June 2026 best practices)
User-agent: Googlebot
Allow: /
Disallow: /admin
Crawl-delay: 0

# Google Images
User-agent: Googlebot-Image
Allow: /

# Bing — also indexes for ChatGPT and Copilot grounding
User-agent: Bingbot
Allow: /
Disallow: /admin
Crawl-delay: 1

# AI Training Crawlers — Blocked: we do not consent to model training on our content
User-agent: GPTBot
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

User-agent: Meta-ExternalAgent
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: Bytespider
Disallow: /

# AI Citation/Retrieval Crawlers — Allowed for GEO (Generative Engine Optimization)
# These bots retrieve content to answer user questions, not to train models
# Allowing them increases Trading Greats citations in AI answers (AEO June 2026)
User-agent: ChatGPT-User
Allow: /
Disallow: /admin
Disallow: /api/

User-agent: PerplexityBot
Allow: /
Disallow: /admin
Disallow: /api/

# For full AI usage guidance, see: ${PUBLIC_SITE_URL}/llms.txt

# Sitemap location
Sitemap: ${PUBLIC_SITE_URL}/sitemap.xml

# Host directive for search engines
Host: ${PUBLIC_SITE_URL}
`;

  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
};

// Enable prerendering for robots.txt
export const prerender = true;
