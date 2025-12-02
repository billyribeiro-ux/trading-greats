import type { RequestHandler } from './$types';
import { seedTraders } from '$lib/server/seed';

const PUBLIC_SITE_URL = 'https://tradinggreats.com';

export const GET: RequestHandler = async () => {
	// For now, using seed data. In production:
	// const traders = await db.select().from(traders).where(eq(traders.status, 'published'));
	
	const traders = seedTraders.filter(t => t.status === 'published');

	interface SitemapPage {
		url: string;
		priority: string;
		changefreq: string;
		lastmod?: string;
	}

	const staticPages: SitemapPage[] = [
		{ url: '', priority: '1.0', changefreq: 'weekly' },
		{ url: '/traders', priority: '0.9', changefreq: 'weekly' },
		{ url: '/about', priority: '0.7', changefreq: 'monthly' },
		{ url: '/privacy', priority: '0.3', changefreq: 'yearly' },
		{ url: '/terms', priority: '0.3', changefreq: 'yearly' }
	];

	const traderPages: SitemapPage[] = traders.map(trader => ({
		url: `/traders/${trader.slug}`,
		priority: '0.8',
		changefreq: 'monthly',
		lastmod: trader.updatedAt || new Date().toISOString()
	}));

	const allPages: SitemapPage[] = [...staticPages, ...traderPages];

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
	.map(
		page => `  <url>
    <loc>${PUBLIC_SITE_URL}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    ${page.lastmod ? `<lastmod>${page.lastmod.split('T')[0]}</lastmod>` : ''}
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
};
