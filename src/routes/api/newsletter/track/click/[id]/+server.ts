import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { trackClick } from '$lib/server/newsletter';

export const GET: RequestHandler = async ({ params, url, request, getClientAddress }) => {
	const { id } = params;
	const targetUrl = url.searchParams.get('url');

	if (!targetUrl) {
		throw redirect(302, '/');
	}

	// Decode the URL
	let decodedUrl: string;
	try {
		decodedUrl = decodeURIComponent(targetUrl);
	} catch {
		decodedUrl = targetUrl;
	}

	// Track the click asynchronously (don't block redirect)
	trackClick(id, decodedUrl, {
		ipAddress: getClientAddress(),
		userAgent: request.headers.get('user-agent') || undefined
	}).catch((err) => console.error('[Newsletter] Track click error:', err));

	// Redirect to the target URL
	throw redirect(302, decodedUrl);
};
