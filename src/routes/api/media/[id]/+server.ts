import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { media } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

/**
 * GET /api/media/[id] - Get single media item
 */
export const GET: RequestHandler = async ({ params, cookies }) => {
	// Verify admin session
	const sessionToken = cookies.get('admin_session');
	if (!sessionToken) {
		throw error(401, 'Unauthorized');
	}

	const { id } = params;

	try {
		const [item] = await db.select().from(media).where(eq(media.id, id));

		if (!item) {
			throw error(404, 'Media not found');
		}

		return json(item);
	} catch (err) {
		console.error('Error fetching media:', err);
		if (err instanceof Error && 'status' in err) {
			throw err;
		}
		throw error(500, 'Failed to fetch media');
	}
};

/**
 * PATCH /api/media/[id] - Update media SEO metadata
 */
export const PATCH: RequestHandler = async ({ params, request, cookies }) => {
	// Verify admin session
	const sessionToken = cookies.get('admin_session');
	if (!sessionToken) {
		throw error(401, 'Unauthorized');
	}

	const { id } = params;

	try {
		const updates = await request.json();

		// Only allow updating specific fields
		const allowedFields = ['title', 'altText', 'description', 'caption', 'folder', 'tags'];
		const sanitizedUpdates: Record<string, unknown> = {};

		for (const [key, value] of Object.entries(updates)) {
			if (allowedFields.includes(key)) {
				sanitizedUpdates[key] = value;
			}
		}

		// Add updated timestamp
		sanitizedUpdates.updatedAt = new Date().toISOString();

		const [updated] = await db
			.update(media)
			.set(sanitizedUpdates)
			.where(eq(media.id, id))
			.returning();

		if (!updated) {
			throw error(404, 'Media not found');
		}

		return json({ success: true, media: updated });
	} catch (err) {
		console.error('Error updating media:', err);
		if (err instanceof Error && 'status' in err) {
			throw err;
		}
		throw error(500, 'Failed to update media');
	}
};
