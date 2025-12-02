import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
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

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;
	let trader: Trader | null = null;
	let relatedTraders: Trader[] = [];

	if (PUBLIC_SANITY_PROJECT_ID) {
		try {
			trader = await sanity.getTraderBySlug(slug);
			if (trader && trader.tradingStyle) {
				relatedTraders = await sanity.getRelatedTraders(trader.tradingStyle, slug);
			}
		} catch (err) {
			console.error('Sanity fetch failed, falling back to seed data:', err);
			trader = null;
		}
	}

	// Fallback to seed data
	if (!trader) {
		const traderData = seedTraders.find(t => t.slug === slug);
		if (!traderData) {
			throw error(404, 'Trader not found');
		}
		trader = seedToTrader(traderData, `trader-${slug}`);
		relatedTraders = seedTraders
			.filter(t => t.slug !== slug && t.tradingStyle === trader!.tradingStyle)
			.slice(0, 3)
			.map((t, i) => seedToTrader(t, `trader-related-${i}`));
	}

	if (!trader) {
		throw error(404, 'Trader not found');
	}

	return {
		trader,
		relatedTraders
	};
};
