import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { env } from '$env/dynamic/private';
import sharp from 'sharp';

// R2 Configuration
const isR2Configured = Boolean(env.R2_ACCOUNT_ID && env.R2_ACCESS_KEY_ID && env.R2_SECRET_ACCESS_KEY && env.R2_BUCKET_NAME);

let s3Client: S3Client | null = null;

if (isR2Configured) {
	s3Client = new S3Client({
		region: 'auto',
		endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
		credentials: {
			accessKeyId: env.R2_ACCESS_KEY_ID!,
			secretAccessKey: env.R2_SECRET_ACCESS_KEY!
		}
	});
}

export interface ImageVariants {
	original: { buffer: Buffer; width: number; height: number };
	optimized: { buffer: Buffer; width: number; height: number };
	large: { buffer: Buffer; width: number; height: number };
	medium: { buffer: Buffer; width: number; height: number };
	thumbnail: { buffer: Buffer; width: number; height: number };
}

export interface ProcessedImage {
	filename: string;
	mimeType: string;
	fileSize: number;
	width: number;
	height: number;
	variants: {
		original: string;
		optimized: string;
		large: string;
		medium: string;
		thumbnail: string;
	};
	storageKey: string;
}

/**
 * Process image with Sharp - creates optimized variants
 */
export async function processImage(
	file: File,
	folder: string = 'uploads'
): Promise<ImageVariants> {
	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	// Get original metadata
	const metadata = await sharp(buffer).metadata();
	const originalWidth = metadata.width || 800;
	const originalHeight = metadata.height || 800;

	// Process variants in parallel for speed
	const [original, optimized, large, medium, thumbnail] = await Promise.all([
		// Original - just convert to WebP
		sharp(buffer)
			.webp({ quality: 95 })
			.toBuffer()
			.then(b => ({ buffer: b, width: originalWidth, height: originalHeight })),

		// Optimized - max 1200px, good quality
		sharp(buffer)
			.resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
			.webp({ quality: 85 })
			.toBuffer()
			.then(async b => {
				const m = await sharp(b).metadata();
				return { buffer: b, width: m.width || 1200, height: m.height || 1200 };
			}),

		// Large - 800px
		sharp(buffer)
			.resize(800, 800, { fit: 'inside', withoutEnlargement: true })
			.webp({ quality: 82 })
			.toBuffer()
			.then(async b => {
				const m = await sharp(b).metadata();
				return { buffer: b, width: m.width || 800, height: m.height || 800 };
			}),

		// Medium - 400px, face detection for portraits
		sharp(buffer)
			.resize(400, 400, { fit: 'cover', position: 'attention' })
			.webp({ quality: 80 })
			.toBuffer()
			.then(b => ({ buffer: b, width: 400, height: 400 })),

		// Thumbnail - 150px
		sharp(buffer)
			.resize(150, 150, { fit: 'cover', position: 'attention' })
			.webp({ quality: 75 })
			.toBuffer()
			.then(b => ({ buffer: b, width: 150, height: 150 }))
	]);

	return { original, optimized, large, medium, thumbnail };
}

/**
 * Upload image to R2 storage
 */
export async function uploadToR2(
	file: File,
	folder: string = 'uploads'
): Promise<ProcessedImage> {
	if (!s3Client || !isR2Configured) {
		throw new Error('R2 storage is not configured. Please add R2 credentials to your environment variables.');
	}

	// Generate unique filename
	const timestamp = Date.now();
	const randomId = crypto.randomUUID().slice(0, 8);
	const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
	const baseName = sanitizedName.replace(/\.[^.]+$/, '');
	const baseKey = `${folder}/${timestamp}-${randomId}-${baseName}`;

	// Process image with Sharp
	const variants = await processImage(file, folder);

	// Upload all variants to R2 in parallel
	const uploadPromises = [
		// Original
		s3Client.send(new PutObjectCommand({
			Bucket: env.R2_BUCKET_NAME,
			Key: `${baseKey}-original.webp`,
			Body: variants.original.buffer,
			ContentType: 'image/webp',
			CacheControl: 'public, max-age=31536000, immutable'
		})),
		// Optimized (main)
		s3Client.send(new PutObjectCommand({
			Bucket: env.R2_BUCKET_NAME,
			Key: `${baseKey}.webp`,
			Body: variants.optimized.buffer,
			ContentType: 'image/webp',
			CacheControl: 'public, max-age=31536000, immutable'
		})),
		// Large
		s3Client.send(new PutObjectCommand({
			Bucket: env.R2_BUCKET_NAME,
			Key: `${baseKey}-large.webp`,
			Body: variants.large.buffer,
			ContentType: 'image/webp',
			CacheControl: 'public, max-age=31536000, immutable'
		})),
		// Medium
		s3Client.send(new PutObjectCommand({
			Bucket: env.R2_BUCKET_NAME,
			Key: `${baseKey}-medium.webp`,
			Body: variants.medium.buffer,
			ContentType: 'image/webp',
			CacheControl: 'public, max-age=31536000, immutable'
		})),
		// Thumbnail
		s3Client.send(new PutObjectCommand({
			Bucket: env.R2_BUCKET_NAME,
			Key: `${baseKey}-thumb.webp`,
			Body: variants.thumbnail.buffer,
			ContentType: 'image/webp',
			CacheControl: 'public, max-age=31536000, immutable'
		}))
	];

	await Promise.all(uploadPromises);

	// Build public URLs
	const publicUrl = env.R2_PUBLIC_URL || `https://${env.R2_BUCKET_NAME}.${env.R2_ACCOUNT_ID}.r2.dev`;

	return {
		filename: `${baseName}.webp`,
		mimeType: 'image/webp',
		fileSize: variants.optimized.buffer.length,
		width: variants.optimized.width,
		height: variants.optimized.height,
		variants: {
			original: `${publicUrl}/${baseKey}-original.webp`,
			optimized: `${publicUrl}/${baseKey}.webp`,
			large: `${publicUrl}/${baseKey}-large.webp`,
			medium: `${publicUrl}/${baseKey}-medium.webp`,
			thumbnail: `${publicUrl}/${baseKey}-thumb.webp`
		},
		storageKey: baseKey
	};
}

/**
 * Delete image from R2 storage (all variants)
 */
export async function deleteFromR2(storageKey: string): Promise<void> {
	if (!s3Client || !isR2Configured) {
		throw new Error('R2 storage is not configured');
	}

	const variants = [
		`${storageKey}.webp`,
		`${storageKey}-original.webp`,
		`${storageKey}-large.webp`,
		`${storageKey}-medium.webp`,
		`${storageKey}-thumb.webp`
	];

	await Promise.all(
		variants.map(key =>
			s3Client!.send(new DeleteObjectCommand({
				Bucket: env.R2_BUCKET_NAME,
				Key: key
			})).catch(() => {}) // Ignore errors for non-existent files
		)
	);
}

/**
 * Check if R2 is configured
 */
export function isStorageConfigured(): boolean {
	return isR2Configured;
}

/**
 * Get storage stats
 */
export function getStorageInfo() {
	return {
		provider: 'cloudflare-r2',
		configured: isR2Configured,
		bucket: env.R2_BUCKET_NAME || null,
		publicUrl: env.R2_PUBLIC_URL || null
	};
}
