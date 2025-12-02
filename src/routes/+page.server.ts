import type { PageServerLoad } from './$types';
import { sanity } from '$lib/sanity';
import { seedTraders } from '$lib/server/seed';
import type { Trader, NewTrader } from '$lib/server/schema';
import { PUBLIC_SANITY_PROJECT_ID } from '$env/static/public';

// Fallback: Convert seed data to Trader type
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
	let traders: Trader[];
	let featuredTrader: Trader | null;

	// Use Sanity if configured, otherwise fall back to seed data
	if (PUBLIC_SANITY_PROJECT_ID) {
		try {
			[traders, featuredTrader] = await Promise.all([
				sanity.getAllTraders(),
				sanity.getFeaturedTrader()
			]);
		} catch (error) {
			console.error('Sanity fetch failed, falling back to seed data:', error);
			traders = seedTraders.map((t, i) => seedToTrader(t, `trader-${i}`));
			featuredTrader = traders[0] ?? null;
		}
	} else {
		// Fallback to seed data
		traders = seedTraders.map((t, i) => seedToTrader(t, `trader-${i}`));
		featuredTrader = traders[0] ?? null;
	}

	return {
		featuredTrader,
		traders
	};
};
