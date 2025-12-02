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

export const load: PageServerLoad = async () => {
	// For now, using seed data. In production, this would be:
	// const traders = await db.select().from(traders).where(eq(traders.status, 'published'));
	
	const traders: Trader[] = seedTraders.map((t, i) => seedToTrader(t, `trader-${i}`));

	return {
		featuredTrader: traders[0],
		traders
	};
};
