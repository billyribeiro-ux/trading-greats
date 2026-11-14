import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '#lib/server/db.ts';
import { traders as tradersTable, blogPosts, media, type Trader, type BlogPost, type Media } from '#lib/server/schema.ts';
import { eq, and, ne, desc, asc } from 'drizzle-orm';
import { portraitCredits, traderPhoto } from '#lib/server/trader-portraits.ts';
import { seedTraders } from '#lib/server/seed.ts';

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

	const photoUrl = traderPhoto(slug, trader.photoUrl);
	const seed = seedTraders.find((item) => item.slug === slug);
	const credit = portraitCredits[slug];

	return {
		photoCredit: credit?.url === photoUrl ? {
			...credit,
			licenseUrl: credit.license.startsWith('CC BY-SA ') ? `https://creativecommons.org/licenses/by-sa/${credit.license.slice(9)}/` :
				credit.license.startsWith('CC BY ') ? `https://creativecommons.org/licenses/by/${credit.license.slice(6)}/` :
				credit.license === 'CC0' ? 'https://creativecommons.org/publicdomain/zero/1.0/' : null,
			modified: slug === 'jesse-livermore'
		} : null,
		trader: {
			...trader,
			bio: trader.bio?.trim() ? trader.bio : (seed?.bio ?? null),
			photoUrl
		},
		relatedTraders: relatedTraders.map((related) => ({ ...related, photoUrl: traderPhoto(related.slug, related.photoUrl) })),
		articles,
		gallery
	};
};
