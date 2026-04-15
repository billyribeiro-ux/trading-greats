import type { PageServerLoad } from './$types';
import { seedTraders } from '$lib/server/seed';
import type { Trader, NewTrader, BlogPost } from '$lib/server/schema';
import { db } from '$lib/server/db';
import { blogPosts, media } from '$lib/server/schema';
import { desc, eq, sql } from 'drizzle-orm';

function seedToTrader(t: NewTrader, id: string): Trader {
	return {
		id,
		name: t.name,
		slug: t.slug,
		photoUrl: t.photoUrl ?? null,
		oneLiner: t.oneLiner ?? null,
		birthYear: t.birthYear ?? null,
		deathYear: t.deathYear ?? null,
		nationality: t.nationality ?? null,
		tradingStyle: t.tradingStyle ?? null,
		netWorth: t.netWorth ?? null,
		bio: t.bio ?? null,
		philosophy: t.philosophy ?? null,
		achievements: t.achievements ?? null,
		famousTrades: t.famousTrades ?? null,
		quotes: t.quotes ?? null,
		books: t.books ?? null,
		socialLinks: t.socialLinks ?? null,
		status: t.status ?? 'published',
		createdAt: t.createdAt ?? new Date().toISOString(),
		updatedAt: t.updatedAt ?? new Date().toISOString()
	};
}

export const load: PageServerLoad = async () => {
	const traders = seedTraders.map((t, i) => seedToTrader(t, `trader-${i}`));
	const traderCount = traders.length;
	const publishedCount = traders.filter((t) => t.status === 'published').length;
	const draftCount = traders.filter((t) => t.status === 'draft').length;
	const recentTraders = traders.slice(0, 5);

	// Fetch blog data from database
	let blogCount = 0;
	let recentPosts: BlogPost[] = [];

	try {
		const [countResult, postsResult] = await Promise.all([
			db.select({ count: sql<number>`count(*)` }).from(blogPosts),
			db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt)).limit(5)
		]);
		blogCount = countResult[0]?.count ?? 0;
		recentPosts = postsResult;
	} catch (error) {
		// Blog table might not exist yet - that's ok
		console.log('Blog posts table not yet created');
	}

	// Fetch media count
	let mediaCount = 0;
	try {
		const [mediaCountResult] = await db.select({ count: sql<number>`count(*)` }).from(media);
		mediaCount = mediaCountResult?.count ?? 0;
	} catch (error) {
		// Media table might not exist yet
		console.log('Media table not yet created');
	}

	return {
		traderCount,
		publishedCount,
		draftCount,
		blogCount,
		mediaCount,
		recentTraders,
		recentPosts
	};
};
