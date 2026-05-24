import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { traders as tradersTable, blogPosts, media, type Trader, type BlogPost, type Media } from '$lib/server/schema';
import { eq, and, ne, desc, asc } from 'drizzle-orm';

export const prerender = 'auto';

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;

	// Fetch trader from DB
	const [trader] = await db
		.select()
		.from(tradersTable)
		.where(and(eq(tradersTable.slug, slug), eq(tradersTable.status, 'published')))
		.limit(1);

	if (!trader) {
		throw error(404, 'Trader not found');
	}

	// Fetch related traders (same style, exclude current)
	const relatedTraders: Trader[] = trader.tradingStyle
		? await db
			.select()
			.from(tradersTable)
			.where(
				and(
					eq(tradersTable.tradingStyle, trader.tradingStyle),
					eq(tradersTable.status, 'published'),
					ne(tradersTable.slug, slug)
				)
			)
			.limit(3)
		: [];

	// Fetch articles for this trader
	let articles: BlogPost[] = [];
	try {
		articles = await db
			.select()
			.from(blogPosts)
			.where(and(eq(blogPosts.traderSlug, slug), eq(blogPosts.status, 'published')))
			.orderBy(desc(blogPosts.publishedAt))
			.limit(3);
	} catch (err) {
		console.error('DB fetch failed for trader articles:', err);
	}

	// Fetch gallery media for this trader
	let gallery: Media[] = [];
	try {
		gallery = await db
			.select()
			.from(media)
			.where(eq(media.traderId, trader.id))
			.orderBy(asc(media.displayOrder));
	} catch (err) {
		console.error('Failed to fetch trader gallery:', err);
	}

	return {
		trader,
		relatedTraders,
		articles,
		gallery
	};
};
