import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
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
	const { id } = params;

	// For now, using seed data. In production:
	// const [trader] = await db.select().from(traders).where(eq(traders.id, id));
	
	// Parse the id to get the index (format: trader-0, trader-1, etc.)
	const index = parseInt(id.replace('trader-', ''));
	const traderData = seedTraders[index];

	if (!traderData) {
		throw error(404, 'Trader not found');
	}

	const trader: Trader = seedToTrader(traderData, id);

	return {
		trader
	};
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const formData = await request.formData();
		const { id } = params;

		const name = formData.get('name') as string;
		const oneLiner = formData.get('oneLiner') as string;

		// Validation
		if (!name || !oneLiner) {
			return fail(400, { error: 'Name and one-liner are required' });
		}

		// In production, this would update the database
		// For now, just redirect back to the traders list
		// await db.update(traders).set({...}).where(eq(traders.id, id));

		console.log('Would update trader:', id, Object.fromEntries(formData));

		throw redirect(303, '/admin/traders');
	}
};
