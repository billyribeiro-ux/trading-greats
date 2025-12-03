import type { RequestHandler } from './$types';
import { trackOpen } from '$lib/server/newsletter';

// 1x1 transparent GIF pixel
const TRACKING_PIXEL = Buffer.from(
	'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
	'base64'
);

export const GET: RequestHandler = async ({ params, request, getClientAddress }) => {
	const { id } = params;

	// Track the open asynchronously (don't block response)
	trackOpen(id, {
		ipAddress: getClientAddress(),
		userAgent: request.headers.get('user-agent') || undefined
	}).catch((err) => console.error('[Newsletter] Track open error:', err));

	// Return 1x1 transparent GIF
	return new Response(TRACKING_PIXEL, {
		status: 200,
		headers: {
			'Content-Type': 'image/gif',
			'Content-Length': TRACKING_PIXEL.length.toString(),
			'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
			Pragma: 'no-cache',
			Expires: '0'
		}
	});
};
