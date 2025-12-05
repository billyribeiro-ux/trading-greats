import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { sanity, isSanityConfigured } from '$lib/sanity';
import { seedTraders } from '$lib/server/seed';
import { seedBlogPosts } from '$lib/server/seedBlog';
import { db } from '$lib/server/db';
import { blogPosts, type Trader, type NewTrader, type BlogPost } from '$lib/server/schema';
import { eq, and, desc } from 'drizzle-orm';

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
	let articles: BlogPost[] = [];

	if (isSanityConfigured) {
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

	// Fetch articles for this trader
	try {
		const dbArticles = await db
			.select()
			.from(blogPosts)
			.where(
				and(
					eq(blogPosts.traderSlug, slug),
					eq(blogPosts.status, 'published')
				)
			)
			.orderBy(desc(blogPosts.publishedAt))
			.limit(3);

		if (dbArticles.length > 0) {
			articles = dbArticles;
		}
	} catch (err) {
		console.error('DB fetch failed for trader articles:', err);
	}

	// Fallback: Use seed blog posts relevant to this trader
	if (articles.length === 0) {
		const traderName = trader.name.toLowerCase();
		const tradingStyle = trader.tradingStyle?.toLowerCase() || '';

		articles = seedBlogPosts
			.filter(post => {
				const titleMatch = post.title?.toLowerCase().includes(traderName.split(' ')[1] || traderName);
				const contentMatch = post.content?.toLowerCase().includes(traderName);
				const styleMatch = tradingStyle && (
					post.tags?.some(tag => tag.toLowerCase().includes(tradingStyle)) ||
					post.content?.toLowerCase().includes(tradingStyle)
				);
				return post.status === 'published' && (titleMatch || contentMatch || styleMatch);
			})
			.slice(0, 3)
			.map((post, index) => ({
				...post,
				id: post.id || `seed-article-${index}`,
				traderSlug: slug,
				traderId: trader!.id
			})) as BlogPost[];
	}

	return {
		trader,
		relatedTraders,
		articles
	};
};
