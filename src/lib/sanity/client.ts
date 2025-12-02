import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import {
	PUBLIC_SANITY_PROJECT_ID,
	PUBLIC_SANITY_DATASET,
	PUBLIC_SANITY_API_VERSION
} from '$env/static/public';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageSource = any;

// Validate required environment variables
if (!PUBLIC_SANITY_PROJECT_ID) {
	console.warn('Missing PUBLIC_SANITY_PROJECT_ID - Sanity client will not work');
}

export const client = createClient({
	projectId: PUBLIC_SANITY_PROJECT_ID,
	dataset: PUBLIC_SANITY_DATASET || 'production',
	apiVersion: PUBLIC_SANITY_API_VERSION || '2024-01-01',
	useCdn: true, // Enable CDN for faster reads in production
	perspective: 'published' // Only fetch published documents
});

// Preview client for draft content (used in admin/preview mode)
export const previewClient = createClient({
	projectId: PUBLIC_SANITY_PROJECT_ID,
	dataset: PUBLIC_SANITY_DATASET || 'production',
	apiVersion: PUBLIC_SANITY_API_VERSION || '2024-01-01',
	useCdn: false,
	perspective: 'previewDrafts',
	token: undefined // Will be set dynamically when needed
});

// Image URL builder
const builder = createImageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
	return builder.image(source);
}

// Helper to get image URL with defaults
export function getImageUrl(
	source: SanityImageSource | null | undefined,
	options: { width?: number; height?: number; quality?: number } = {}
): string | null {
	if (!source) return null;

	const { width = 800, height, quality = 85 } = options;

	let imageBuilder = builder.image(source).auto('format').quality(quality);

	if (width) imageBuilder = imageBuilder.width(width);
	if (height) imageBuilder = imageBuilder.height(height);

	return imageBuilder.url();
}
