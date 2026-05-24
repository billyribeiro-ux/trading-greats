import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { traders } from '$lib/server/schema';
import { and, eq, or, ilike } from 'drizzle-orm';
import type { RequestHandler } from './$types';

const SELECT_FIELDS = {
	name: traders.name,
	slug: traders.slug,
	tradingStyle: traders.tradingStyle,
	oneLiner: traders.oneLiner
};

export const GET: RequestHandler = async ({ url }) => {
	const q = url.searchParams.get('q')?.trim() ?? '';
	const limit = Math.min(Number(url.searchParams.get('limit') ?? '8'), 20);

	const rows = q
		? await db
			.select(SELECT_FIELDS)
			.from(traders)
			.where(
				and(
					eq(traders.status, 'published'),
					or(
						ilike(traders.name, `%${q}%`),
						ilike(traders.tradingStyle, `%${q}%`),
						ilike(traders.oneLiner, `%${q}%`)
					)
				)
			)
			.limit(limit)
		: await db
			.select(SELECT_FIELDS)
			.from(traders)
			.where(eq(traders.status, 'published'))
			.limit(limit);

	return json(rows);
};
