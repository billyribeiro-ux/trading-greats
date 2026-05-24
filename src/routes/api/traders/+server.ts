import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { traders } from '$lib/server/schema';
import { eq, or, ilike } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const q = url.searchParams.get('q')?.trim() ?? '';
	const limit = Math.min(Number(url.searchParams.get('limit') ?? '8'), 20);

	const rows = q
		? await db
				.select({
					name: traders.name,
					slug: traders.slug,
					tradingStyle: traders.tradingStyle,
					oneLiner: traders.oneLiner
				})
				.from(traders)
				.where(
					or(
						ilike(traders.name, `%${q}%`),
						ilike(traders.tradingStyle, `%${q}%`),
						ilike(traders.oneLiner, `%${q}%`)
					)
				)
				.limit(limit)
		: await db
				.select({
					name: traders.name,
					slug: traders.slug,
					tradingStyle: traders.tradingStyle,
					oneLiner: traders.oneLiner
				})
				.from(traders)
				.where(eq(traders.status, 'published'))
				.limit(limit);

	return json(rows);
};
