import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { subscribeEmail } from '$lib/server/newsletter';

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	try {
		const data = await request.json();
		const { email, source, referrer } = data;

		if (!email || typeof email !== 'string') {
			return json({ success: false, message: 'Email is required' }, { status: 400 });
		}

		const result = await subscribeEmail(email, {
			source: source || 'api',
			referrer: referrer || request.headers.get('referer') || undefined,
			ipAddress: getClientAddress(),
			userAgent: request.headers.get('user-agent') || undefined
		});

		return json(result, { status: result.success ? 200 : 400 });
	} catch (error) {
		console.error('[Newsletter API] Subscribe error:', error);
		return json(
			{ success: false, message: 'An error occurred. Please try again.' },
			{ status: 500 }
		);
	}
};
