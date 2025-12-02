import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
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

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;

	// For now, using seed data. In production:
	// const [trader] = await db.select().from(traders).where(eq(traders.slug, slug));
	
	const traderData = seedTraders.find(t => t.slug === slug);

	if (!traderData) {
		throw error(404, 'Trader not found');
	}

	const trader: Trader = seedToTrader(traderData, `trader-${slug}`);

	// Get related traders (same trading style)
	const relatedTraders: Trader[] = seedTraders
		.filter(t => t.slug !== slug && t.tradingStyle === trader.tradingStyle)
		.slice(0, 3)
		.map((t, i) => seedToTrader(t, `trader-related-${i}`));

	return {
		trader,
		relatedTraders
	};
};
