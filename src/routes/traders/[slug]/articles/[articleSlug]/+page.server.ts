import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { blogPosts, traders, type Trader, type BlogPost } from '$lib/server/schema';
import { eq, and, ne, desc } from 'drizzle-orm';
import { sanity } from '$lib/sanity';
import { seedTraders } from '$lib/server/seed';
import { seedBlogPosts } from '$lib/server/seedBlog';
import type { NewTrader } from '$lib/server/schema';
import { PUBLIC_SANITY_PROJECT_ID } from '$env/static/public';

// ============================================================================
// Dec 2025 SvelteKit: ISR Configuration for Vercel
// Revalidate every hour for individual article pages (content is stable)
// ============================================================================
export const config = {
	isr: {
		expiration: 3600 // 1 hour
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
	const { slug: traderSlug, articleSlug } = params;
	let trader: Trader | null = null;
	let article: BlogPost | null = null;
	let relatedArticles: BlogPost[] = [];

	// ============================================================================
	// 1. Fetch trader data
	// ============================================================================
	if (PUBLIC_SANITY_PROJECT_ID && PUBLIC_SANITY_PROJECT_ID !== 'your-project-id') {
		try {
			trader = await sanity.getTraderBySlug(traderSlug);
		} catch (err) {
			console.error('Sanity fetch failed, falling back to seed data:', err);
		}
	}

	// Fallback to seed data
	if (!trader) {
		const traderData = seedTraders.find(t => t.slug === traderSlug);
		if (!traderData) {
			throw error(404, 'Trader not found');
		}
		trader = seedToTrader(traderData, `trader-${traderSlug}`);
	}

	// ============================================================================
	// 2. Fetch article
	// ============================================================================
	try {
		// Try database first
		const dbArticles = await db
			.select()
			.from(blogPosts)
			.where(
				and(
					eq(blogPosts.slug, articleSlug),
					eq(blogPosts.traderSlug, traderSlug),
					eq(blogPosts.status, 'published')
				)
			);

		if (dbArticles.length > 0) {
			article = dbArticles[0];
		}
	} catch (err) {
		console.error('DB fetch failed for article:', err);
	}

	// Fallback: Look in seed data
	if (!article) {
		const seedArticle = seedBlogPosts.find(
			post => post.slug === articleSlug && post.status === 'published'
		);

		if (seedArticle) {
			article = {
				...seedArticle,
				id: seedArticle.id || `seed-${articleSlug}`,
				traderSlug: traderSlug,
				traderId: trader.id
			} as BlogPost;
		}
	}

	if (!article) {
		throw error(404, 'Article not found');
	}

	// ============================================================================
	// 3. Fetch related articles (same trader or category)
	// ============================================================================
	try {
		const dbRelated = await db
			.select()
			.from(blogPosts)
			.where(
				and(
					eq(blogPosts.traderSlug, traderSlug),
					ne(blogPosts.slug, articleSlug),
					eq(blogPosts.status, 'published')
				)
			)
			.orderBy(desc(blogPosts.publishedAt))
			.limit(3);

		if (dbRelated.length > 0) {
			relatedArticles = dbRelated;
		}
	} catch (err) {
		console.error('DB fetch failed for related articles:', err);
	}

	// Fallback related articles from seed
	if (relatedArticles.length === 0) {
		relatedArticles = seedBlogPosts
			.filter(post =>
				post.slug !== articleSlug &&
				post.status === 'published' &&
				(post.category === article?.category || post.tags?.some(tag => article?.tags?.includes(tag)))
			)
			.slice(0, 3)
			.map((post, index) => ({
				...post,
				id: post.id || `seed-related-${index}`,
				traderSlug: traderSlug,
				traderId: trader!.id
			})) as BlogPost[];
	}

	return {
		trader,
		article,
		relatedArticles
	};
};
