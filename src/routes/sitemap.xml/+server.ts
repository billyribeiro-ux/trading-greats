import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { traders as tradersTable, blogPosts as blogPostsTable } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

const PUBLIC_SITE_URL = 'https://tradinggreats.com';

// May 2026: Live DB sitemap with image extensions and trader articles
export const GET: RequestHandler = async () => {
	const [traders, blogPosts] = await Promise.all([
		db.select({
			slug: tradersTable.slug,
			name: tradersTable.name,
			photoUrl: tradersTable.photoUrl,
			updatedAt: tradersTable.updatedAt
		}).from(tradersTable).where(eq(tradersTable.status, 'published')),
		db.select({
			slug: blogPostsTable.slug,
			title: blogPostsTable.title,
			heroImage: blogPostsTable.heroImage,
			traderSlug: blogPostsTable.traderSlug,
			publishedAt: blogPostsTable.publishedAt,
			updatedAt: blogPostsTable.updatedAt
		}).from(blogPostsTable).where(eq(blogPostsTable.status, 'published'))
	]);
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
		{ url: '/blog', priority: '0.8', changefreq: 'daily', lastmod: now },
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

	// Trader article list pages
	const traderArticleListPages: SitemapPage[] = traders.map(trader => ({
		url: `/traders/${trader.slug}/articles`,
		priority: '0.7',
		changefreq: 'weekly',
		lastmod: now
	}));

	// General blog post pages
	const blogPages: SitemapPage[] = blogPosts.map(post => ({
		url: `/blog/${post.slug}`,
		priority: '0.7',
		changefreq: 'monthly',
		lastmod: post.updatedAt?.split('T')[0] || post.publishedAt?.split('T')[0] || now,
		image: post.heroImage ? { url: post.heroImage, title: post.title } : undefined
	}));

	// Trader-specific article pages (for articles associated with traders)
	const traderArticlePages: SitemapPage[] = blogPosts
		.filter(post => post.traderSlug)
		.map(post => ({
			url: `/traders/${post.traderSlug}/articles/${post.slug}`,
			priority: '0.75',
			changefreq: 'monthly',
			lastmod: post.updatedAt?.split('T')[0] || post.publishedAt?.split('T')[0] || now,
			image: post.heroImage ? { url: post.heroImage, title: post.title } : undefined
		}));

	const allPages: SitemapPage[] = [
		...staticPages,
		...traderPages,
		...traderArticleListPages,
		...blogPages,
		...traderArticlePages
	];

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

// May 2026: Dynamic sitemap from live DB — not prerendered
export const prerender = false;
