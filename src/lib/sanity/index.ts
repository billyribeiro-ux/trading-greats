// Sanity CMS integration
// Re-export everything for clean imports

export { client, previewClient, urlFor, getImageUrl } from './client';
export * from './queries';
export * from './types';

import { client } from './client';
import {
	allTradersQuery,
	allTradersAdminQuery,
	traderBySlugQuery,
	traderByIdQuery,
	relatedTradersQuery,
	tradersByStyleQuery,
	tradingStylesQuery,
	featuredTraderQuery,
	traderStatsQuery,
	recentTradersQuery
} from './queries';
import { sanityToTrader, sanityToTraders, type SanityTrader, type TraderStats } from './types';
import type { Trader } from '$lib/server/schema';

/**
 * Sanity API - High-level functions for fetching data
 */
export const sanity = {
	/**
	 * Get all published traders
	 */
	async getAllTraders(): Promise<Trader[]> {
		const docs = await client.fetch<SanityTrader[]>(allTradersQuery);
		return sanityToTraders(docs || []);
	},

	/**
	 * Get all traders including drafts (for admin)
	 */
	async getAllTradersAdmin(): Promise<Trader[]> {
		const docs = await client.fetch<SanityTrader[]>(allTradersAdminQuery);
		return sanityToTraders(docs || []);
	},

	/**
	 * Get a single trader by slug
	 */
	async getTraderBySlug(slug: string): Promise<Trader | null> {
		const doc = await client.fetch<SanityTrader | null>(traderBySlugQuery, { slug });
		return doc ? sanityToTrader(doc) : null;
	},

	/**
	 * Get a single trader by ID
	 */
	async getTraderById(id: string): Promise<Trader | null> {
		const doc = await client.fetch<SanityTrader | null>(traderByIdQuery, { id });
		return doc ? sanityToTrader(doc) : null;
	},

	/**
	 * Get related traders by trading style
	 */
	async getRelatedTraders(tradingStyle: string, currentSlug: string): Promise<Trader[]> {
		const docs = await client.fetch<SanityTrader[]>(relatedTradersQuery, {
			tradingStyle,
			currentSlug
		});
		return sanityToTraders(docs || []);
	},

	/**
	 * Get traders by trading style
	 */
	async getTradersByStyle(style: string): Promise<Trader[]> {
		const docs = await client.fetch<SanityTrader[]>(tradersByStyleQuery, { style: `*${style}*` });
		return sanityToTraders(docs || []);
	},

	/**
	 * Get unique trading styles
	 */
	async getTradingStyles(): Promise<string[]> {
		const styles = await client.fetch<string[]>(tradingStylesQuery);
		return styles || [];
	},

	/**
	 * Get featured trader
	 */
	async getFeaturedTrader(): Promise<Trader | null> {
		const doc = await client.fetch<SanityTrader | null>(featuredTraderQuery);
		return doc ? sanityToTrader(doc) : null;
	},

	/**
	 * Get trader stats for admin
	 */
	async getTraderStats(): Promise<TraderStats> {
		const stats = await client.fetch<TraderStats>(traderStatsQuery);
		return stats || { total: 0, published: 0, drafts: 0 };
	},

	/**
	 * Get recent traders for admin dashboard
	 */
	async getRecentTraders(): Promise<Trader[]> {
		const docs = await client.fetch<SanityTrader[]>(recentTradersQuery);
		return sanityToTraders(docs || []);
	}
};
