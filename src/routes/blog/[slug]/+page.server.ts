import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { blogPosts, BLOG_CATEGORIES } from '$lib/server/schema';
import { eq, and, ne, desc } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;

	let post;
	let relatedPosts: any[] = [];

	try {
		// Fetch the post
		const results = await db
			.select()
			.from(blogPosts)
			.where(and(eq(blogPosts.slug, slug), eq(blogPosts.status, 'published')));

		post = results[0];

		if (!post) {
			throw error(404, 'Post not found');
		}

		// Fetch related posts (same category or manually linked)
		const allPublished = await db
			.select()
			.from(blogPosts)
			.where(and(eq(blogPosts.status, 'published'), ne(blogPosts.id, post.id)))
			.orderBy(desc(blogPosts.publishedAt))
			.limit(10);

		// Prioritize manually linked posts, then same category
		if (post.relatedPostIds && post.relatedPostIds.length > 0) {
			const linked = allPublished.filter((p) => post.relatedPostIds?.includes(p.id));
			relatedPosts = linked.slice(0, 3);
		}

		if (relatedPosts.length < 3 && post.category) {
			const sameCategory = allPublished.filter(
				(p) => p.category === post.category && !relatedPosts.find((r) => r.id === p.id)
			);
			relatedPosts = [...relatedPosts, ...sameCategory].slice(0, 3);
		}

		// Fill remaining with latest posts
		if (relatedPosts.length < 3) {
			const remaining = allPublished.filter((p) => !relatedPosts.find((r) => r.id === p.id));
			relatedPosts = [...relatedPosts, ...remaining].slice(0, 3);
		}
	} catch (e: any) {
		if (e.status === 404) throw e;
		console.error('Failed to fetch blog post:', e);
		throw error(500, 'Failed to load post');
	}

	return {
		post,
		relatedPosts,
		categories: BLOG_CATEGORIES
	};
};
