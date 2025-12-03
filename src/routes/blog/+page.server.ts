import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { blogPosts, BLOG_CATEGORIES, type BlogPost } from '$lib/server/schema';
import { eq, desc } from 'drizzle-orm';
import { seedBlogPosts } from '$lib/server/seedBlog';

// Convert seed post to BlogPost format
function seedToPost(post: typeof seedBlogPosts[0], id: string): BlogPost {
	return {
		id,
		title: post.title,
		slug: post.slug,
		excerpt: post.excerpt ?? null,
		content: post.content ?? null,
		heroImage: post.heroImage ?? null,
		heroImageAlt: post.heroImageAlt ?? null,
		heroImageCaption: post.heroImageCaption ?? null,
		author: post.author ?? 'Trading Greats Team',
		readingTime: post.readingTime ?? null,
		category: post.category ?? null,
		tags: post.tags ?? null,
		seoTitle: post.seoTitle ?? null,
		seoDescription: post.seoDescription ?? null,
		ogImage: post.ogImage ?? null,
		relatedTraderIds: post.relatedTraderIds ?? null,
		relatedPostIds: post.relatedPostIds ?? null,
		status: post.status ?? 'published',
		featured: post.featured ?? false,
		publishedAt: post.publishedAt ?? null,
		createdAt: post.createdAt ?? new Date().toISOString(),
		updatedAt: post.updatedAt ?? new Date().toISOString()
	};
}

export const load: PageServerLoad = async ({ url }) => {
	const category = url.searchParams.get('category');

	let posts: BlogPost[] = [];
	let featuredPost: BlogPost | null = null;

	try {
		// Get all published posts from database
		const allPosts = await db
			.select()
			.from(blogPosts)
			.where(eq(blogPosts.status, 'published'))
			.orderBy(desc(blogPosts.publishedAt));

		// Filter by category if specified
		posts = category
			? allPosts.filter(p => p.category === category)
			: allPosts;

		// Get featured post (first featured one, or first post)
		featuredPost = allPosts.find(p => p.featured) || allPosts[0] || null;

		// Remove featured from regular list if it exists
		if (featuredPost) {
			posts = posts.filter(p => p.id !== featuredPost!.id);
		}
	} catch (e) {
		console.error('Failed to fetch blog posts from DB, using seed data:', e);
	}

	// Fallback to seed data if database is empty or fails
	if (posts.length === 0 && !featuredPost) {
		const seedPosts = seedBlogPosts
			.filter(p => p.status === 'published')
			.map((p, i) => seedToPost(p, `seed-post-${i}`))
			.sort((a, b) => {
				const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
				const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
				return dateB - dateA;
			});

		// Filter by category if specified
		posts = category
			? seedPosts.filter(p => p.category === category)
			: seedPosts;

		// Get featured post
		featuredPost = seedPosts.find(p => p.featured) || seedPosts[0] || null;

		// Remove featured from regular list
		if (featuredPost) {
			posts = posts.filter(p => p.id !== featuredPost!.id);
		}
	}

	return {
		posts,
		featuredPost,
		categories: BLOG_CATEGORIES,
		currentCategory: category
	};
};
