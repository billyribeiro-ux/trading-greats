import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { media } from '$lib/server/schema';
import { uploadToR2, deleteFromR2, isStorageConfigured } from '$lib/server/storage';
import { eq, desc, like, or } from 'drizzle-orm';

/**
 * GET /api/media - List all media with optional filtering
 */
export const GET: RequestHandler = async ({ url, cookies }) => {
	// Verify admin session
	const sessionToken = cookies.get('admin_session');
	if (!sessionToken) {
		throw error(401, 'Unauthorized');
	}

	const search = url.searchParams.get('search') || '';
	const folder = url.searchParams.get('folder') || '';
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = parseInt(url.searchParams.get('limit') || '24');
	const offset = (page - 1) * limit;

	try {
		let query = db.select().from(media);

		// Apply filters
		const conditions = [];
		if (search) {
			conditions.push(
				or(
					like(media.title, `%${search}%`),
					like(media.altText, `%${search}%`),
					like(media.filename, `%${search}%`)
				)
			);
		}
		if (folder) {
			conditions.push(eq(media.folder, folder));
		}

		const items = await db
			.select()
			.from(media)
			.where(conditions.length > 0 ? conditions[0] : undefined)
			.orderBy(desc(media.createdAt))
			.limit(limit)
			.offset(offset);

		// Get total count for pagination
		const allItems = await db.select({ id: media.id }).from(media);
		const total = allItems.length;

		return json({
			items,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit)
			}
		});
	} catch (err) {
		console.error('Error fetching media:', err);
		throw error(500, 'Failed to fetch media');
	}
};

/**
 * POST /api/media - Upload new media with SEO metadata
 */
export const POST: RequestHandler = async ({ request, cookies }) => {
	// Verify admin session
	const sessionToken = cookies.get('admin_session');
	if (!sessionToken) {
		throw error(401, 'Unauthorized');
	}

	// Check if storage is configured
	if (!isStorageConfigured()) {
		throw error(503, 'Storage is not configured. Please add R2 credentials to your environment variables.');
	}

	try {
		const formData = await request.formData();
		const file = formData.get('file') as File;
		const folder = (formData.get('folder') as string) || 'uploads';

		// SEO Metadata
		const title = formData.get('title') as string || '';
		const altText = formData.get('altText') as string || '';
		const description = formData.get('description') as string || '';
		const caption = formData.get('caption') as string || '';
		const tagsString = formData.get('tags') as string || '';
		const tags = tagsString ? tagsString.split(',').map(t => t.trim()).filter(Boolean) : [];

		if (!file) {
			throw error(400, 'No file provided');
		}

		// Validate file type
		const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
		if (!allowedTypes.includes(file.type)) {
			throw error(400, 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.');
		}

		// Validate file size (max 10MB)
		const maxSize = 10 * 1024 * 1024;
		if (file.size > maxSize) {
			throw error(400, 'File too large. Maximum size is 10MB.');
		}

		// Upload to R2 with Sharp optimization
		const processed = await uploadToR2(file, folder);

		// Save to database with SEO metadata
		const [newMedia] = await db.insert(media).values({
			filename: processed.filename,
			originalFilename: file.name,
			mimeType: processed.mimeType,
			fileSize: processed.fileSize,
			width: processed.width,
			height: processed.height,
			url: processed.variants.optimized,
			thumbnailUrl: processed.variants.thumbnail,
			mediumUrl: processed.variants.medium,
			largeUrl: processed.variants.large,
			originalUrl: processed.variants.original,
			storageKey: processed.storageKey,
			storageProvider: 'r2',
			title: title || file.name.replace(/\.[^.]+$/, ''),
			altText,
			description,
			caption,
			folder,
			tags: tags.length > 0 ? tags : null
		}).returning();

		return json({
			success: true,
			media: newMedia,
			// For backwards compatibility with existing ImageUpload component
			url: newMedia.url,
			urls: {
				thumbnail: newMedia.thumbnailUrl,
				medium: newMedia.mediumUrl,
				large: newMedia.largeUrl,
				original: newMedia.originalUrl
			}
		});
	} catch (err) {
		console.error('Upload error:', err);
		if (err instanceof Error && 'status' in err) {
			throw err;
		}
		throw error(500, 'Failed to upload image');
	}
};

/**
 * DELETE /api/media - Delete media by ID
 */
export const DELETE: RequestHandler = async ({ request, cookies }) => {
	// Verify admin session
	const sessionToken = cookies.get('admin_session');
	if (!sessionToken) {
		throw error(401, 'Unauthorized');
	}

	try {
		const { id } = await request.json();

		if (!id) {
			throw error(400, 'No media ID provided');
		}

		// Get media record
		const [mediaItem] = await db.select().from(media).where(eq(media.id, id));

		if (!mediaItem) {
			throw error(404, 'Media not found');
		}

		// Delete from R2
		if (mediaItem.storageKey) {
			await deleteFromR2(mediaItem.storageKey);
		}

		// Delete from database
		await db.delete(media).where(eq(media.id, id));

		return json({ success: true });
	} catch (err) {
		console.error('Delete error:', err);
		if (err instanceof Error && 'status' in err) {
			throw err;
		}
		throw error(500, 'Failed to delete media');
	}
};
