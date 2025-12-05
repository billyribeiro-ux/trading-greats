import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { blogPosts, traders, type Trader, type BlogPost } from '$lib/server/schema';
import { eq, and, desc } from 'drizzle-orm';
import { sanity, isSanityConfigured } from '$lib/sanity';
import { seedTraders } from '$lib/server/seed';
import { seedBlogPosts } from '$lib/server/seedBlog';
import type { NewTrader } from '$lib/server/schema';

// ============================================================================
// Dec 2025 SvelteKit: ISR Configuration for Vercel
// Revalidate every 30 minutes for article list pages
// ============================================================================
export const config = {
	isr: {
		expiration: 1800 // 30 minutes
	}
};

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
	let articles: BlogPost[] = [];

	// ============================================================================
	// 1. Fetch trader data (from Sanity or seed data)
	// ============================================================================
	if (isSanityConfigured) {
		try {
			trader = await sanity.getTraderBySlug(slug);
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
	}

	if (!trader) {
		throw error(404, 'Trader not found');
	}

	// ============================================================================
	// 2. Fetch articles for this trader
	// ============================================================================
	try {
		// Try database first
		const dbArticles = await db
			.select()
			.from(blogPosts)
			.where(
				and(
					eq(blogPosts.traderSlug, slug),
					eq(blogPosts.status, 'published')
				)
			)
			.orderBy(desc(blogPosts.publishedAt));

		if (dbArticles.length > 0) {
			articles = dbArticles;
		}
	} catch (err) {
		console.error('DB fetch failed for trader articles:', err);
	}

	// Fallback: Use seed blog posts that mention this trader (via relatedTraderIds or matching trading style)
	if (articles.length === 0) {
		const traderName = trader.name.toLowerCase();
		const tradingStyle = trader.tradingStyle?.toLowerCase() || '';

		// Filter seed posts that are relevant to this trader
		articles = seedBlogPosts
			.filter(post => {
				// Check if post mentions trader by name in title, content, or tags
				const titleMatch = post.title?.toLowerCase().includes(traderName.split(' ')[1] || traderName);
				const contentMatch = post.content?.toLowerCase().includes(traderName);
				const styleMatch = tradingStyle && (
					post.tags?.some(tag => tag.toLowerCase().includes(tradingStyle)) ||
					post.content?.toLowerCase().includes(tradingStyle)
				);
				const categoryMatch = post.category === 'biography' || post.category === 'strategy';

				return post.status === 'published' && (titleMatch || contentMatch || styleMatch || categoryMatch);
			})
			.slice(0, 6)
			.map((post, index) => ({
				...post,
				id: post.id || `seed-article-${index}`,
				traderSlug: slug, // Associate with this trader for URL generation
				traderId: trader!.id
			})) as BlogPost[];
	}

	// ============================================================================
	// 3. SEO Metadata
	// ============================================================================
	const meta = {
		title: `${trader.name} Articles - Trading Insights & Analysis`,
		description: `Read in-depth articles about ${trader.name}'s trading strategies, philosophy, and market insights. Learn from ${trader.tradingStyle || 'legendary'} trading wisdom.`,
		keywords: [
			trader.name,
			trader.tradingStyle,
			'trading articles',
			'trading strategy',
			'market analysis',
			'trading education'
		].filter(Boolean) as string[]
	};

	return {
		trader,
		articles,
		meta
	};
};
