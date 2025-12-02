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
	const styleFilter = url.searchParams.get('style');

	// For now, using seed data. In production:
	// const allTraders = await db.select().from(traders).where(eq(traders.status, 'published'));
	
	let traders: Trader[] = seedTraders.map((t, i) => seedToTrader(t, `trader-${i}`));

	if (styleFilter) {
		traders = traders.filter(t => 
			t.tradingStyle?.toLowerCase().includes(styleFilter.toLowerCase())
		);
	}

	const tradingStyles = [...new Set(seedTraders.map(t => t.tradingStyle).filter(Boolean))];

	return {
		traders,
		tradingStyles,
		currentFilter: styleFilter
	};
};
