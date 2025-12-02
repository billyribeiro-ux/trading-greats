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

export const load: PageServerLoad = async ({ url }) => {
	const styleFilter = url.searchParams.get('style');
	let traders: Trader[];
	let tradingStyles: string[];

	if (PUBLIC_SANITY_PROJECT_ID) {
		try {
			// Fetch from Sanity
			if (styleFilter) {
				traders = await sanity.getTradersByStyle(styleFilter);
			} else {
				traders = await sanity.getAllTraders();
			}
			tradingStyles = await sanity.getTradingStyles();
		} catch (error) {
			console.error('Sanity fetch failed, falling back to seed data:', error);
			traders = seedTraders.map((t, i) => seedToTrader(t, `trader-${i}`));
			if (styleFilter) {
				traders = traders.filter(t => 
					t.tradingStyle?.toLowerCase().includes(styleFilter.toLowerCase())
				);
			}
			tradingStyles = [...new Set(seedTraders.map(t => t.tradingStyle).filter((s): s is string => !!s))];
		}
	} else {
		// Fallback to seed data
		traders = seedTraders.map((t, i) => seedToTrader(t, `trader-${i}`));
		if (styleFilter) {
			traders = traders.filter(t => 
				t.tradingStyle?.toLowerCase().includes(styleFilter.toLowerCase())
			);
		}
		tradingStyles = [...new Set(seedTraders.map(t => t.tradingStyle).filter((s): s is string => !!s))];
	}

	return {
		traders,
		tradingStyles,
		currentFilter: styleFilter
	};
};
