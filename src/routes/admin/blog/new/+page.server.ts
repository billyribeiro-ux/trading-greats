import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { blogPosts, traders, BLOG_CATEGORIES, type BlogCategory } from '$lib/server/schema';
import { fail, redirect } from '@sveltejs/kit';
import { slugify } from '$lib/utils';
import { eq } from 'drizzle-orm';
import { sanity, isSanityConfigured } from '$lib/sanity';
import { seedTraders } from '$lib/server/seed';

export const load: PageServerLoad = async () => {
	// Fetch traders for relation selection
	let traderList: { id: string; name: string }[] = [];

	if (isSanityConfigured) {
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
		traders: traderList,
		categories: BLOG_CATEGORIES
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		// Extract form fields
		const title = formData.get('title') as string;
		const excerpt = formData.get('excerpt') as string;
		const content = formData.get('content') as string;
		const heroImage = formData.get('heroImage') as string;
		const heroImageAlt = formData.get('heroImageAlt') as string;
		const heroImageCaption = formData.get('heroImageCaption') as string;
		const author = formData.get('author') as string;
		const category = formData.get('category') as BlogCategory | null;
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

		// Generate slug
		let slug = slugify(title);

		// Check for duplicate slug
		try {
			const existing = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
			if (existing.length > 0) {
				slug = `${slug}-${Date.now()}`;
			}
		} catch {
			// Table might not exist
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

		// Create post
		try {
			const now = new Date().toISOString();
			await db.insert(blogPosts).values({
				title: title.trim(),
				slug,
				excerpt: excerpt?.trim() || null,
				content: content?.trim() || null,
				heroImage: heroImage?.trim() || null,
				heroImageAlt: heroImageAlt?.trim() || null,
				heroImageCaption: heroImageCaption?.trim() || null,
				author: author?.trim() || 'Trading Greats Team',
				readingTime,
				category: (category || null) as import('$lib/server/schema').BlogCategory | null,
				tags,
				seoTitle: seoTitle?.trim() || null,
				seoDescription: seoDescription?.trim() || null,
				ogImage: ogImage?.trim() || null,
				relatedTraderIds,
				relatedPostIds: null,
				status: status || 'draft',
				featured: false,
				publishedAt: status === 'published' ? now : null,
				createdAt: now,
				updatedAt: now
			});
		} catch (error) {
			console.error('Failed to create post:', error);
			return fail(500, {
				error: 'Failed to create post. Please try again.',
				title,
				excerpt,
				content
			});
		}

		throw redirect(303, '/admin/blog');
	}
};
