import type { PageServerLoad } from './$types';
import { sanity } from '$lib/sanity';
import { seedTraders } from '$lib/server/seed';
import type { Trader, NewTrader } from '$lib/server/schema';
import { PUBLIC_SANITY_PROJECT_ID } from '$env/static/public';

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
	let traderCount = 0;
	let publishedCount = 0;
	let draftCount = 0;
	let recentTraders: Trader[] = [];

	if (PUBLIC_SANITY_PROJECT_ID) {
		try {
			const [stats, recent] = await Promise.all([
				sanity.getTraderStats(),
				sanity.getRecentTraders()
			]);
			traderCount = stats.total;
			publishedCount = stats.published;
			draftCount = stats.drafts;
			recentTraders = recent;
		} catch (error) {
			console.error('Sanity fetch failed, falling back to seed data:', error);
			const traders = seedTraders.map((t, i) => seedToTrader(t, `trader-${i}`));
			traderCount = traders.length;
			publishedCount = traders.filter(t => t.status === 'published').length;
			draftCount = traders.filter(t => t.status === 'draft').length;
			recentTraders = traders.slice(0, 5);
		}
	} else {
		const traders = seedTraders.map((t, i) => seedToTrader(t, `trader-${i}`));
		traderCount = traders.length;
		publishedCount = traders.filter(t => t.status === 'published').length;
		draftCount = traders.filter(t => t.status === 'draft').length;
		recentTraders = traders.slice(0, 5);
	}

	return {
		traderCount,
		publishedCount,
		draftCount,
		recentTraders
	};
};
