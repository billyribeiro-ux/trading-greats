import type { PageServerLoad } from './$types';
import { sanity, isSanityConfigured } from '$lib/sanity';
import { seedTraders } from '$lib/server/seed';
import type { Trader, NewTrader } from '$lib/server/schema';

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
	let traders: Trader[] = [];
	let tradingStyles: string[] = [];

	if (isSanityConfigured) {
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
		}
	}

	// Use ONLY seed data - this ensures all 37 traders show
	const allTraders = seedTraders.map((t, i) => seedToTrader(t, `seed-trader-${i}`));
	
	// Custom sort: Billy Ribeiro first, Mark Minervini second, John Carter last
	const priorityFirst = ['billy-ribeiro', 'mark-minervini'];
	const priorityLast = ['john-carter'];
	
	// Separate into priority groups
	const firstTraders = priorityFirst
		.map(slug => allTraders.find(t => t.slug === slug))
		.filter((t): t is Trader => t !== undefined);
	
	const lastTraders = priorityLast
		.map(slug => allTraders.find(t => t.slug === slug))
		.filter((t): t is Trader => t !== undefined);
	
	const middleTraders = allTraders.filter(
		t => !priorityFirst.includes(t.slug) && !priorityLast.includes(t.slug)
	);
	
	// Combine: first + middle + last
	traders = [...firstTraders, ...middleTraders, ...lastTraders];
	
	// Get all unique trading styles and count them BEFORE filtering
	const styleCounts: Record<string, number> = {};
	traders.forEach(t => {
		if (t.tradingStyle) {
			styleCounts[t.tradingStyle] = (styleCounts[t.tradingStyle] || 0) + 1;
		}
	});
	
	// Sort trading styles by count (most popular first), only include styles with 2+ traders for filter buttons
	tradingStyles = Object.entries(styleCounts)
		.filter(([_, count]) => count >= 2)
		.sort((a, b) => b[1] - a[1])
		.map(([style]) => style);
	
	// Apply style filter AFTER calculating style counts (so all traders show when no filter)
	if (styleFilter) {
		traders = traders.filter(t => 
			t.tradingStyle?.toLowerCase().includes(styleFilter.toLowerCase())
		);
	}

	return {
		traders,
		tradingStyles,
		currentFilter: styleFilter
	};
};
