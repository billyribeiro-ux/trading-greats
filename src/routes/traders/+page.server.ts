import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { traders as tradersTable, type Trader } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ url }) => {
	const styleFilter = url.searchParams.get('style');

	const allTraders: Trader[] = await db
		.select()
		.from(tradersTable)
		.where(eq(tradersTable.status, 'published'));

	// Custom sort: Billy Ribeiro first, Mark Minervini second, John Carter last
	const priorityFirst = ['billy-ribeiro', 'mark-minervini'];
	const priorityLast = ['john-carter'];

	const firstTraders = priorityFirst
		.map(slug => allTraders.find(t => t.slug === slug))
		.filter((t): t is Trader => t !== undefined);

	const lastTraders = priorityLast
		.map(slug => allTraders.find(t => t.slug === slug))
		.filter((t): t is Trader => t !== undefined);

	const middleTraders = allTraders.filter(
		t => !priorityFirst.includes(t.slug) && !priorityLast.includes(t.slug)
	);

	let traders: Trader[] = [...firstTraders, ...middleTraders, ...lastTraders];

	// Get all unique trading styles and count them BEFORE filtering
	const styleCounts: Record<string, number> = {};
	traders.forEach(t => {
		if (t.tradingStyle) {
			styleCounts[t.tradingStyle] = (styleCounts[t.tradingStyle] || 0) + 1;
		}
	});

	const tradingStyles = Object.entries(styleCounts)
		.filter(([_, count]) => count >= 2)
		.sort((a, b) => b[1] - a[1])
		.map(([style]) => style);

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
