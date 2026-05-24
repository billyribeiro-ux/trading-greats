import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { traders as tradersTable, type Trader } from '$lib/server/schema';
import { eq, inArray } from 'drizzle-orm';

export const load: PageServerLoad = async ({ url }) => {
	const slugsParam = url.searchParams.get('traders');
	const slugs = slugsParam ? slugsParam.split(',').slice(0, 4) : [];

	const allTraders: Trader[] = await db
		.select()
		.from(tradersTable)
		.where(eq(tradersTable.status, 'published'));

	const selectedTraders: Trader[] = slugs.length > 0
		? await db
			.select()
			.from(tradersTable)
			.where(inArray(tradersTable.slug, slugs))
		: [];

	// Preserve URL slug order for selected traders
	const orderedSelected = slugs
		.map(slug => selectedTraders.find(t => t.slug === slug))
		.filter((t): t is Trader => t !== undefined);

	return {
		allTraders,
		selectedTraders: orderedSelected,
		selectedSlugs: slugs
	};
};
