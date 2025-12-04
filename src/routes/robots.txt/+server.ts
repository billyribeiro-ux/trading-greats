import type { RequestHandler } from './$types';

const PUBLIC_SITE_URL = 'https://tradinggreats.com';

// Google Nov 2025: Enhanced robots.txt with crawler-specific rules
export const GET: RequestHandler = async () => {
	const robotsTxt = `# Trading Greats Robots.txt
# Updated for Google Nov 2025 crawler guidelines

# Default rules for all crawlers
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Disallow: /_app/

# Google-specific rules (Nov 2025 best practices)
User-agent: Googlebot
Allow: /
Disallow: /admin
Crawl-delay: 0

# Google Images
User-agent: Googlebot-Image
Allow: /

# Bing
User-agent: Bingbot
Allow: /
Disallow: /admin
Crawl-delay: 1

# AI Training Crawlers - Opt out (Google Nov 2025 guidance)
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

# Sitemap location
Sitemap: ${PUBLIC_SITE_URL}/sitemap.xml

# Host directive for search engines
Host: ${PUBLIC_SITE_URL}
`;

	return new Response(robotsTxt, {
		headers: {
			'Content-Type': 'text/plain',
			'Cache-Control': 'public, max-age=86400, s-maxage=86400'
		}
	});
};

// Enable prerendering for robots.txt
export const prerender = true;
