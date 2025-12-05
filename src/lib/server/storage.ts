/**
 * Storage Abstraction Layer
 *
 * Supports multiple storage providers:
 * - Local: Files saved to /static/media/ (development + small sites)
 * - R2: Cloudflare R2 cloud storage (production + scalable)
 *
 * Auto-selects based on STORAGE_PROVIDER env variable:
 * - 'local' = force local storage
 * - 'r2' = force R2 (requires R2 credentials)
 * - undefined = auto-detect (R2 if configured, else local)
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { env } from '$env/dynamic/private';
import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

// ============================================================================
// CONFIGURATION
// ============================================================================

const isR2Configured = Boolean(
	env.R2_ACCOUNT_ID &&
	env.R2_ACCESS_KEY_ID &&
	env.R2_SECRET_ACCESS_KEY &&
	env.R2_BUCKET_NAME
);

// Determine active provider
const storageProvider = env.STORAGE_PROVIDER || (isR2Configured ? 'r2' : 'local');

// R2 Client (initialized only if needed)
let s3Client: S3Client | null = null;
if (storageProvider === 'r2' && isR2Configured) {
	s3Client = new S3Client({
		region: 'auto',
		endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
		credentials: {
			accessKeyId: env.R2_ACCESS_KEY_ID!,
			secretAccessKey: env.R2_SECRET_ACCESS_KEY!
		}
	});
}

// Local storage base path (relative to project root)
const LOCAL_MEDIA_DIR = 'static/media';
const LOCAL_PUBLIC_PATH = '/media'; // URL path for serving

// ============================================================================
// TYPES
// ============================================================================

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
	storageProvider: 'local' | 'r2';
}

export type StorageProvider = 'local' | 'r2';

// ============================================================================
// IMAGE PROCESSING (Shared by both providers)
// ============================================================================

/**
 * Process image with Sharp - creates optimized WebP variants
 */
export async function processImage(file: File): Promise<ImageVariants> {
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

		// Medium - 400px, smart cropping for portraits
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

// ============================================================================
// LOCAL STORAGE PROVIDER
// ============================================================================

/**
 * Ensure local media directories exist
 */
async function ensureLocalDirectories(folder: string): Promise<void> {
	const fullPath = path.join(process.cwd(), LOCAL_MEDIA_DIR, folder);
	await fs.mkdir(fullPath, { recursive: true });
}

/**
 * Upload image to local storage
 */
async function uploadToLocal(
	file: File,
	folder: string = 'uploads'
): Promise<ProcessedImage> {
	// Ensure directory exists
	await ensureLocalDirectories(folder);

	// Generate unique filename
	const timestamp = Date.now();
	const randomId = crypto.randomUUID().slice(0, 8);
	const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
	const baseName = sanitizedName.replace(/\.[^.]+$/, '');
	const baseKey = `${folder}/${timestamp}-${randomId}-${baseName}`;

	// Process image with Sharp
	const variants = await processImage(file);

	// Define file paths
	const basePath = path.join(process.cwd(), LOCAL_MEDIA_DIR);
	const files = [
		{ key: `${baseKey}-original.webp`, buffer: variants.original.buffer },
		{ key: `${baseKey}.webp`, buffer: variants.optimized.buffer },
		{ key: `${baseKey}-large.webp`, buffer: variants.large.buffer },
		{ key: `${baseKey}-medium.webp`, buffer: variants.medium.buffer },
		{ key: `${baseKey}-thumb.webp`, buffer: variants.thumbnail.buffer }
	];

	// Write all files
	await Promise.all(
		files.map(({ key, buffer }) =>
			fs.writeFile(path.join(basePath, key), buffer)
		)
	);

	return {
		filename: `${baseName}.webp`,
		mimeType: 'image/webp',
		fileSize: variants.optimized.buffer.length,
		width: variants.optimized.width,
		height: variants.optimized.height,
		variants: {
			original: `${LOCAL_PUBLIC_PATH}/${baseKey}-original.webp`,
			optimized: `${LOCAL_PUBLIC_PATH}/${baseKey}.webp`,
			large: `${LOCAL_PUBLIC_PATH}/${baseKey}-large.webp`,
			medium: `${LOCAL_PUBLIC_PATH}/${baseKey}-medium.webp`,
			thumbnail: `${LOCAL_PUBLIC_PATH}/${baseKey}-thumb.webp`
		},
		storageKey: baseKey,
		storageProvider: 'local'
	};
}

/**
 * Delete image from local storage (all variants)
 */
async function deleteFromLocal(storageKey: string): Promise<void> {
	const basePath = path.join(process.cwd(), LOCAL_MEDIA_DIR);
	const variants = [
		`${storageKey}.webp`,
		`${storageKey}-original.webp`,
		`${storageKey}-large.webp`,
		`${storageKey}-medium.webp`,
		`${storageKey}-thumb.webp`
	];

	await Promise.all(
		variants.map(key =>
			fs.unlink(path.join(basePath, key)).catch(() => {})
		)
	);
}

// ============================================================================
// R2 CLOUD STORAGE PROVIDER
// ============================================================================

/**
 * Upload image to R2 storage
 */
async function uploadToR2Cloud(
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
	const variants = await processImage(file);

	// Upload all variants to R2 in parallel
	const uploadPromises = [
		s3Client.send(new PutObjectCommand({
			Bucket: env.R2_BUCKET_NAME,
			Key: `${baseKey}-original.webp`,
			Body: variants.original.buffer,
			ContentType: 'image/webp',
			CacheControl: 'public, max-age=31536000, immutable'
		})),
		s3Client.send(new PutObjectCommand({
			Bucket: env.R2_BUCKET_NAME,
			Key: `${baseKey}.webp`,
			Body: variants.optimized.buffer,
			ContentType: 'image/webp',
			CacheControl: 'public, max-age=31536000, immutable'
		})),
		s3Client.send(new PutObjectCommand({
			Bucket: env.R2_BUCKET_NAME,
			Key: `${baseKey}-large.webp`,
			Body: variants.large.buffer,
			ContentType: 'image/webp',
			CacheControl: 'public, max-age=31536000, immutable'
		})),
		s3Client.send(new PutObjectCommand({
			Bucket: env.R2_BUCKET_NAME,
			Key: `${baseKey}-medium.webp`,
			Body: variants.medium.buffer,
			ContentType: 'image/webp',
			CacheControl: 'public, max-age=31536000, immutable'
		})),
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
		storageKey: baseKey,
		storageProvider: 'r2'
	};
}

/**
 * Delete image from R2 storage (all variants)
 */
async function deleteFromR2Cloud(storageKey: string): Promise<void> {
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
			})).catch(() => {})
		)
	);
}

// ============================================================================
// UNIFIED API (Auto-selects provider)
// ============================================================================

/**
 * Upload image using the configured storage provider
 */
export async function uploadImage(
	file: File,
	folder: string = 'uploads'
): Promise<ProcessedImage> {
	if (storageProvider === 'r2') {
		return uploadToR2Cloud(file, folder);
	}
	return uploadToLocal(file, folder);
}

/**
 * Delete image using the appropriate storage provider
 */
export async function deleteImage(
	storageKey: string,
	provider?: StorageProvider
): Promise<void> {
	const targetProvider = provider || storageProvider;
	if (targetProvider === 'r2') {
		return deleteFromR2Cloud(storageKey);
	}
	return deleteFromLocal(storageKey);
}

/**
 * Check if storage is configured and ready
 */
export function isStorageConfigured(): boolean {
	// Local storage is always available
	if (storageProvider === 'local') return true;
	// R2 requires credentials
	return isR2Configured;
}

/**
 * Get current storage configuration info
 */
export function getStorageInfo(): {
	provider: StorageProvider;
	configured: boolean;
	details: Record<string, string | null>;
} {
	if (storageProvider === 'r2') {
		return {
			provider: 'r2',
			configured: isR2Configured,
			details: {
				bucket: env.R2_BUCKET_NAME || null,
				publicUrl: env.R2_PUBLIC_URL || null
			}
		};
	}
	return {
		provider: 'local',
		configured: true,
		details: {
			directory: LOCAL_MEDIA_DIR,
			publicPath: LOCAL_PUBLIC_PATH
		}
	};
}

/**
 * Get the active storage provider name
 */
export function getActiveProvider(): StorageProvider {
	return storageProvider as StorageProvider;
}

// ============================================================================
// BACKWARDS COMPATIBILITY EXPORTS
// ============================================================================

// These maintain compatibility with existing code that imports specific functions
export const uploadToR2 = uploadImage;
export const deleteFromR2 = deleteImage;

// ============================================================================
// UTILITY: Initialize local storage directories
// ============================================================================

/**
 * Initialize all required media directories
 * Call this on app startup or first upload
 */
export async function initializeLocalStorage(): Promise<void> {
	const folders = ['traders', 'blog', 'general', 'uploads'];
	const basePath = path.join(process.cwd(), LOCAL_MEDIA_DIR);

	await fs.mkdir(basePath, { recursive: true });

	await Promise.all(
		folders.map(folder =>
			fs.mkdir(path.join(basePath, folder), { recursive: true })
		)
	);

	// Create .gitkeep files to ensure folders are tracked
	await Promise.all(
		folders.map(folder =>
			fs.writeFile(
				path.join(basePath, folder, '.gitkeep'),
				'# This file ensures the folder is tracked by git\n'
			).catch(() => {})
		)
	);
}
