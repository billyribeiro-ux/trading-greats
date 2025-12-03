import type { RequestHandler } from './$types';
import { seedTraders } from '$lib/server/seed';

const PUBLIC_SITE_URL = 'https://tradinggreats.com';

// Google Nov 2025: Enhanced sitemap with image and news extensions
export const GET: RequestHandler = async () => {
	// For now, using seed data. In production:
	// const traders = await db.select().from(traders).where(eq(traders.status, 'published'));
	
	const traders = seedTraders.filter(t => t.status === 'published');
	const now = new Date().toISOString().split('T')[0];

	interface SitemapPage {
		url: string;
		priority: string;
		changefreq: string;
		lastmod?: string;
		image?: { url: string; title: string };
	}

	const staticPages: SitemapPage[] = [
		{ url: '', priority: '1.0', changefreq: 'daily', lastmod: now },
		{ url: '/traders', priority: '0.9', changefreq: 'daily', lastmod: now },
		{ url: '/about', priority: '0.7', changefreq: 'monthly' },
		{ url: '/privacy', priority: '0.3', changefreq: 'yearly' },
		{ url: '/terms', priority: '0.3', changefreq: 'yearly' }
	];

	const traderPages: SitemapPage[] = traders.map(trader => ({
		url: `/traders/${trader.slug}`,
		priority: '0.8',
		changefreq: 'weekly',
		lastmod: trader.updatedAt?.split('T')[0] || now,
		image: trader.photoUrl ? { url: trader.photoUrl, title: trader.name } : undefined
	}));

	const allPages: SitemapPage[] = [...staticPages, ...traderPages];

	// Google Nov 2025: Include image sitemap extension for better image indexing
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allPages
	.map(
		page => `  <url>
    <loc>${PUBLIC_SITE_URL}${page.url}</loc>
    <lastmod>${page.lastmod || now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>${page.image ? `
    <image:image>
      <image:loc>${page.image.url}</image:loc>
      <image:title>${page.image.title}</image:title>
    </image:image>` : ''}
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600, s-maxage=3600',
			'X-Robots-Tag': 'noindex' // Sitemaps shouldn't be indexed themselves
		}
	});
};

// Enable prerendering for sitemap
export const prerender = true;
