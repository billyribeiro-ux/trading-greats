import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import {
	revokeSession,
	logSecurityEvent,
	getClientIp,
	sanitizeUserAgent
} from '$lib/server/auth';

export const actions: Actions = {
	default: async ({ cookies, request }) => {
		const sessionToken = cookies.get('admin_session');
		const ipAddress = getClientIp(request);
		const userAgent = sanitizeUserAgent(request.headers.get('user-agent'));

		if (sessionToken) {
			// Revoke the session in the database
			await revokeSession(sessionToken);
			await logSecurityEvent('logout', ipAddress, userAgent);
		}

		// Clear the cookie
		cookies.delete('admin_session', { path: '/' });

		throw redirect(303, '/');
	}
};
