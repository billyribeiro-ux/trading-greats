import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { blogPosts, BLOG_CATEGORIES } from '$lib/server/schema';
import { fail, redirect, error } from '@sveltejs/kit';
import { slugify } from '$lib/utils';
import { eq, ne, and } from 'drizzle-orm';
import { sanity } from '$lib/sanity';
import { seedTraders } from '$lib/server/seed';
import { PUBLIC_SANITY_PROJECT_ID } from '$env/static/public';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	// Fetch the post
	let post;
	try {
		const results = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
		post = results[0];
	} catch (e) {
		console.error('Failed to fetch post:', e);
		throw error(500, 'Failed to load post');
	}

	if (!post) {
		throw error(404, 'Post not found');
	}

	// Fetch traders for relation selection
	let traderList: { id: string; name: string }[] = [];

	if (PUBLIC_SANITY_PROJECT_ID) {
		try {
			const traders = await sanity.getAllTraders();
			traderList = traders.map((t) => ({ id: t.id, name: t.name }));
		} catch {
			// Fallback to seed data
		}
	}

	if (traderList.length === 0) {
		traderList = seedTraders.map((t, i) => ({ id: `trader-${i}`, name: t.name }));
	}

	return {
		post,
		traders: traderList,
		categories: BLOG_CATEGORIES
	};
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const { id } = params;
		const formData = await request.formData();

		// Extract form fields
		const title = formData.get('title') as string;
		const excerpt = formData.get('excerpt') as string;
		const content = formData.get('content') as string;
		const heroImage = formData.get('heroImage') as string;
		const heroImageAlt = formData.get('heroImageAlt') as string;
		const heroImageCaption = formData.get('heroImageCaption') as string;
		const author = formData.get('author') as string;
		const category = formData.get('category') as string;
		const tagsRaw = formData.get('tags') as string;
		const seoTitle = formData.get('seoTitle') as string;
		const seoDescription = formData.get('seoDescription') as string;
		const ogImage = formData.get('ogImage') as string;
		const relatedTraderIdsRaw = formData.get('relatedTraderIds') as string;
		const status = formData.get('status') as 'draft' | 'published';

		// Validation
		if (!title?.trim()) {
			return fail(400, { error: 'Title is required', title, excerpt, content });
		}

		// Get current post to check slug changes
		let currentPost;
		try {
			const results = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
			currentPost = results[0];
		} catch {
			return fail(500, { error: 'Failed to load post' });
		}

		if (!currentPost) {
			return fail(404, { error: 'Post not found' });
		}

		// Generate slug only if title changed
		let slug = currentPost.slug;
		if (title.trim() !== currentPost.title) {
			slug = slugify(title);

			// Check for duplicate slug (excluding current post)
			try {
				const existing = await db
					.select()
					.from(blogPosts)
					.where(and(eq(blogPosts.slug, slug), ne(blogPosts.id, id)));
				if (existing.length > 0) {
					slug = `${slug}-${Date.now()}`;
				}
			} catch {
				// Table might not exist
			}
		}

		// Parse tags
		const tags = tagsRaw
			? tagsRaw
					.split(',')
					.map((t) => t.trim())
					.filter(Boolean)
			: null;

		// Parse related trader IDs
		const relatedTraderIds = relatedTraderIdsRaw
			? relatedTraderIdsRaw
					.split(',')
					.map((t) => t.trim())
					.filter(Boolean)
			: null;

		// Calculate reading time (rough estimate: 200 words per minute)
		const wordCount = content?.split(/\s+/).length || 0;
		const readingTime = Math.max(1, Math.ceil(wordCount / 200));

		// Determine publishedAt
		const now = new Date().toISOString();
		let publishedAt = currentPost.publishedAt;
		if (status === 'published' && !currentPost.publishedAt) {
			publishedAt = now;
		} else if (status === 'draft') {
			publishedAt = null;
		}

		// Update post
		try {
			await db
				.update(blogPosts)
				.set({
					title: title.trim(),
					slug,
					excerpt: excerpt?.trim() || null,
					content: content?.trim() || null,
					heroImage: heroImage?.trim() || null,
					heroImageAlt: heroImageAlt?.trim() || null,
					heroImageCaption: heroImageCaption?.trim() || null,
					author: author?.trim() || 'Trading Greats Team',
					readingTime,
					category: category || null,
					tags,
					seoTitle: seoTitle?.trim() || null,
					seoDescription: seoDescription?.trim() || null,
					ogImage: ogImage?.trim() || null,
					relatedTraderIds,
					status: status || 'draft',
					publishedAt,
					updatedAt: now
				})
				.where(eq(blogPosts.id, id));
		} catch (error) {
			console.error('Failed to update post:', error);
			return fail(500, {
				error: 'Failed to update post. Please try again.',
				title,
				excerpt,
				content
			});
		}

		throw redirect(303, '/admin/blog');
	},

	delete: async ({ params }) => {
		const { id } = params;

		try {
			await db.delete(blogPosts).where(eq(blogPosts.id, id));
		} catch (error) {
			console.error('Failed to delete post:', error);
			return fail(500, { error: 'Failed to delete post' });
		}

		throw redirect(303, '/admin/blog');
	}
};
