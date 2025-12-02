import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { blogPosts } from '$lib/server/schema';
import { eq, desc } from 'drizzle-orm';

const SITE_URL = 'https://tradinggreats.com';
const SITE_TITLE = 'Trading Greats Blog';
const SITE_DESCRIPTION = 'Insights, strategies, and wisdom from legendary traders. Expert analysis and educational content for serious traders.';

function escapeXml(unsafe: string): string {
	return unsafe
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export const GET: RequestHandler = async () => {
	let posts: any[] = [];

	try {
		posts = await db
			.select()
			.from(blogPosts)
			.where(eq(blogPosts.status, 'published'))
			.orderBy(desc(blogPosts.publishedAt))
			.limit(50);
	} catch (e) {
		console.error('Failed to fetch posts for RSS:', e);
	}

	const items = posts
		.map((post) => {
			const pubDate = post.publishedAt ? new Date(post.publishedAt).toUTCString() : new Date().toUTCString();

			return `
		<item>
			<title>${escapeXml(post.title)}</title>
			<link>${SITE_URL}/blog/${escapeXml(post.slug)}</link>
			<guid isPermaLink="true">${SITE_URL}/blog/${escapeXml(post.slug)}</guid>
			<description>${escapeXml(post.excerpt || post.title)}</description>
			<pubDate>${pubDate}</pubDate>
			${post.author ? `<author>${escapeXml(post.author)}</author>` : ''}
			${post.category ? `<category>${escapeXml(post.category)}</category>` : ''}
			${post.heroImage ? `<enclosure url="${escapeXml(post.heroImage)}" type="image/jpeg" />` : ''}
		</item>`;
		})
		.join('\n');

	const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
	<channel>
		<title>${SITE_TITLE}</title>
		<link>${SITE_URL}</link>
		<description>${SITE_DESCRIPTION}</description>
		<language>en-us</language>
		<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
		<atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
		<image>
			<url>${SITE_URL}/favicon.png</url>
			<title>${SITE_TITLE}</title>
			<link>${SITE_URL}</link>
		</image>
		${items}
	</channel>
</rss>`;

	return new Response(rss.trim(), {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
};
