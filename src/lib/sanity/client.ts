import { createClient, type SanityClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import { env } from '$env/dynamic/public';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageSource = any;

// Get env vars with fallbacks
const projectId = env.PUBLIC_SANITY_PROJECT_ID || '';
const dataset = env.PUBLIC_SANITY_DATASET || 'production';
const apiVersion = env.PUBLIC_SANITY_API_VERSION || '2024-01-01';

// Validate projectId format (only a-z, 0-9, and dashes allowed)
const isValidProjectId = /^[a-z0-9-]+$/.test(projectId);

// Check if Sanity is configured
export const isSanityConfigured = Boolean(projectId) && isValidProjectId;

// Create clients only if Sanity is configured
let client: SanityClient | null = null;
let previewClient: SanityClient | null = null;

if (isSanityConfigured) {
	client = createClient({
		projectId,
		dataset,
		apiVersion,
		useCdn: true,
		perspective: 'published'
	});

	previewClient = createClient({
		projectId,
		dataset,
		apiVersion,
		useCdn: false,
		perspective: 'previewDrafts',
		token: undefined
	});
}

export { client, previewClient };

// Image URL builder (only works if Sanity is configured)
const builder = client ? createImageUrlBuilder(client) : null;

export function urlFor(source: SanityImageSource) {
	if (!builder) return null;
	return builder.image(source);
}

// Helper to get image URL with defaults
export function getImageUrl(
	source: SanityImageSource | null | undefined,
	options: { width?: number; height?: number; quality?: number } = {}
): string | null {
	if (!source || !builder) return null;

	const { width = 800, height, quality = 85 } = options;

	let imageBuilder = builder.image(source).auto('format').quality(quality);

	if (width) imageBuilder = imageBuilder.width(width);
	if (height) imageBuilder = imageBuilder.height(height);

	return imageBuilder.url();
}
