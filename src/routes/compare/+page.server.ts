import type { PageServerLoad } from './$types';
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
	const slugsParam = url.searchParams.get('traders');
	const slugs = slugsParam ? slugsParam.split(',').slice(0, 4) : [];

	// Get all traders for the selector
	const allTraders = seedTraders.map((t, i) => seedToTrader(t, `seed-trader-${i}`));

	// Get selected traders for comparison
	const selectedTraders = slugs
		.map(slug => allTraders.find(t => t.slug === slug))
		.filter((t): t is Trader => t !== undefined);

	return {
		allTraders,
		selectedTraders,
		selectedSlugs: slugs
	};
};
