import type { RequestHandler } from './$types';

const PUBLIC_SITE_URL = 'https://tradinggreats.com';

export const GET: RequestHandler = async () => {
	const robotsTxt = `# Trading Greats Robots.txt
User-agent: *
Allow: /

# Disallow admin pages
Disallow: /admin

# Sitemap
Sitemap: ${PUBLIC_SITE_URL}/sitemap.xml
`;

	return new Response(robotsTxt, {
		headers: {
			'Content-Type': 'text/plain',
			'Cache-Control': 'max-age=86400'
		}
	});
};
