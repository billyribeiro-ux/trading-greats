import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { blogPosts, BLOG_CATEGORIES } from '$lib/server/schema';
import { eq, desc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ url }) => {
	const category = url.searchParams.get('category');

	let posts: any[] = [];
	let featuredPost: any = null;

	try {
		// Get all published posts
		let query = db
			.select()
			.from(blogPosts)
			.where(eq(blogPosts.status, 'published'))
			.orderBy(desc(blogPosts.publishedAt));

		const allPosts = await query;

		// Filter by category if specified
		posts = category
			? allPosts.filter(p => p.category === category)
			: allPosts;

		// Get featured post (first featured one, or first post)
		featuredPost = allPosts.find(p => p.featured) || allPosts[0] || null;

		// Remove featured from regular list if it exists
		if (featuredPost) {
			posts = posts.filter(p => p.id !== featuredPost.id);
		}
	} catch (e) {
		console.error('Failed to fetch blog posts:', e);
		// Return empty state if table doesn't exist yet
	}

	return {
		posts,
		featuredPost,
		categories: BLOG_CATEGORIES,
		currentCategory: category
	};
};
