import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { media } from '$lib/server/schema';
import { eq, desc, like, or, sql } from 'drizzle-orm';
import { deleteFromR2 } from '$lib/server/storage';

export const load: PageServerLoad = async ({ url }) => {
	const page = parseInt(url.searchParams.get('page') || '1');
	const search = url.searchParams.get('search') || '';
	const folder = url.searchParams.get('folder') || '';
	const limit = 24; // 6 columns x 4 rows
	const offset = (page - 1) * limit;

	// Build query
	let query = db.select().from(media);

	// Apply filters
	const conditions = [];

	if (search) {
		conditions.push(
			or(
				like(media.title, `%${search}%`),
				like(media.altText, `%${search}%`),
				like(media.filename, `%${search}%`),
				like(media.description, `%${search}%`)
			)
		);
	}

	if (folder) {
		conditions.push(eq(media.folder, folder));
	}

	// Get total count
	const [countResult] = await db
		.select({ count: sql<number>`count(*)` })
		.from(media);
	const totalCount = countResult?.count || 0;

	// Get paginated media
	let mediaItems;
	if (conditions.length > 0) {
		mediaItems = await db
			.select()
			.from(media)
			.where(conditions.length === 1 ? conditions[0] : sql`${conditions[0]} AND ${conditions[1]}`)
			.orderBy(desc(media.createdAt))
			.limit(limit)
			.offset(offset);
	} else {
		mediaItems = await db
			.select()
			.from(media)
			.orderBy(desc(media.createdAt))
			.limit(limit)
			.offset(offset);
	}

	// Get unique folders for filter
	const folders = await db
		.selectDistinct({ folder: media.folder })
		.from(media);

	return {
		media: mediaItems,
		folders: folders.map(f => f.folder).filter(Boolean) as string[],
		pagination: {
			page,
			limit,
			total: totalCount,
			totalPages: Math.ceil(totalCount / limit)
		},
		filters: {
			search,
			folder
		}
	};
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { error: 'No media ID provided' });
		}

		try {
			// Get media item
			const [item] = await db.select().from(media).where(eq(media.id, id));

			if (!item) {
				return fail(404, { error: 'Media not found' });
			}

			// Delete from R2
			await deleteFromR2(item.storageKey);

			// Delete from database
			await db.delete(media).where(eq(media.id, id));

			return { success: true };
		} catch (err) {
			console.error('Error deleting media:', err);
			return fail(500, { error: 'Failed to delete media' });
		}
	},

	updateMetadata: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const title = formData.get('title') as string;
		const altText = formData.get('altText') as string;
		const description = formData.get('description') as string;
		const caption = formData.get('caption') as string;

		if (!id) {
			return fail(400, { error: 'No media ID provided' });
		}

		try {
			await db
				.update(media)
				.set({
					title: title || null,
					altText: altText || null,
					description: description || null,
					caption: caption || null,
					updatedAt: new Date().toISOString()
				})
				.where(eq(media.id, id));

			return { success: true };
		} catch (err) {
			console.error('Error updating media:', err);
			return fail(500, { error: 'Failed to update media' });
		}
	}
};
