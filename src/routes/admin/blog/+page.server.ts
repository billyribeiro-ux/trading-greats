import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { blogPosts, BLOG_CATEGORIES } from '$lib/server/schema';
import { desc, eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	try {
		const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
		return { posts, categories: BLOG_CATEGORIES };
	} catch (error) {
		console.log('Blog posts table may not exist yet');
		return { posts: [], categories: BLOG_CATEGORIES };
	}
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { error: 'Post ID is required' });
		}

		try {
			await db.delete(blogPosts).where(eq(blogPosts.id, id));
			return { success: true };
		} catch (error) {
			console.error('Failed to delete post:', error);
			return fail(500, { error: 'Failed to delete post' });
		}
	},

	toggleStatus: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const currentStatus = formData.get('status') as string;

		if (!id) {
			return fail(400, { error: 'Post ID is required' });
		}

		try {
			const newStatus = currentStatus === 'published' ? 'draft' : 'published';
			await db
				.update(blogPosts)
				.set({
					status: newStatus,
					publishedAt: newStatus === 'published' ? new Date().toISOString() : null,
					updatedAt: new Date().toISOString()
				})
				.where(eq(blogPosts.id, id));
			return { success: true };
		} catch (error) {
			console.error('Failed to update post status:', error);
			return fail(500, { error: 'Failed to update post status' });
		}
	}
};
