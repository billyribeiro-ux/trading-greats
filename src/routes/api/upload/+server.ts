import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { v2 as cloudinary } from 'cloudinary';
import { env } from '$env/dynamic/private';

// Configure Cloudinary if credentials are available
const isCloudinaryConfigured = env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
	cloudinary.config({
		cloud_name: env.CLOUDINARY_CLOUD_NAME,
		api_key: env.CLOUDINARY_API_KEY,
		api_secret: env.CLOUDINARY_API_SECRET
	});
}

export const POST: RequestHandler = async ({ request, cookies }) => {
	// Verify admin session
	const sessionToken = cookies.get('admin_session');
	if (!sessionToken) {
		throw error(401, 'Unauthorized');
	}

	// Check if Cloudinary is configured
	if (!isCloudinaryConfigured) {
		throw error(503, 'Cloudinary is not configured. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your environment variables.');
	}

	try {
		const formData = await request.formData();
		const file = formData.get('file') as File;
		const folder = formData.get('folder') as string || 'traders';

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

		// Convert file to base64 for Cloudinary upload
		const arrayBuffer = await file.arrayBuffer();
		const base64 = Buffer.from(arrayBuffer).toString('base64');
		const dataUri = `data:${file.type};base64,${base64}`;

		// Upload to Cloudinary with optimizations
		const result = await cloudinary.uploader.upload(dataUri, {
			folder: `trading-greats/${folder}`,
			resource_type: 'image',
			transformation: [
				{ quality: 'auto:best', fetch_format: 'auto' },
				{ width: 800, height: 800, crop: 'limit' }
			],
			eager: [
				// Thumbnail for lists
				{ width: 150, height: 150, crop: 'fill', gravity: 'face', quality: 'auto' },
				// Medium size for cards
				{ width: 400, height: 400, crop: 'fill', gravity: 'face', quality: 'auto' },
				// Large size for detail pages
				{ width: 800, height: 800, crop: 'limit', quality: 'auto' }
			],
			eager_async: true
		});

		return json({
			success: true,
			url: result.secure_url,
			publicId: result.public_id,
			width: result.width,
			height: result.height,
			format: result.format,
			// Responsive URLs
			urls: {
				thumbnail: cloudinary.url(result.public_id, {
					width: 150, height: 150, crop: 'fill', gravity: 'face', quality: 'auto', format: 'auto'
				}),
				medium: cloudinary.url(result.public_id, {
					width: 400, height: 400, crop: 'fill', gravity: 'face', quality: 'auto', format: 'auto'
				}),
				large: cloudinary.url(result.public_id, {
					width: 800, height: 800, crop: 'limit', quality: 'auto', format: 'auto'
				}),
				original: result.secure_url
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

// Delete image endpoint
export const DELETE: RequestHandler = async ({ request, cookies }) => {
	// Verify admin session
	const sessionToken = cookies.get('admin_session');
	if (!sessionToken) {
		throw error(401, 'Unauthorized');
	}

	// Check if Cloudinary is configured
	if (!isCloudinaryConfigured) {
		throw error(503, 'Cloudinary is not configured');
	}

	try {
		const { publicId } = await request.json();

		if (!publicId) {
			throw error(400, 'No public ID provided');
		}

		await cloudinary.uploader.destroy(publicId);

		return json({ success: true });
	} catch (err) {
		console.error('Delete error:', err);
		throw error(500, 'Failed to delete image');
	}
};
