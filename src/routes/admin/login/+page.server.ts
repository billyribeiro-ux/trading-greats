import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import {
	verifyAdminPassword,
	createSession,
	checkRateLimit,
	recordLoginAttempt,
	logSecurityEvent,
	getClientIp,
	sanitizeUserAgent
} from '$lib/server/auth';

export const load: PageServerLoad = async ({ cookies }) => {
	// If already logged in, redirect to admin
	const sessionToken = cookies.get('admin_session');
	if (sessionToken) {
		// We'll validate in hooks, just redirect
		throw redirect(303, '/admin');
	}
	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const ipAddress = getClientIp(request);
		const userAgent = sanitizeUserAgent(request.headers.get('user-agent'));

		// Check rate limiting first
		const rateLimit = await checkRateLimit(ipAddress);
		if (!rateLimit.allowed) {
			await logSecurityEvent('rate_limit_exceeded', ipAddress, userAgent, {
				reason: rateLimit.reason
			});

			return fail(429, {
				message: rateLimit.reason || 'Too many attempts. Please try again later.',
				retryAfter: rateLimit.retryAfter
			});
		}

		const formData = await request.formData();
		const password = formData.get('password');

		if (!password || typeof password !== 'string') {
			return fail(400, { message: 'Password is required' });
		}

		// Verify password
		const isValid = await verifyAdminPassword(password);

		if (!isValid) {
			// Record failed attempt
			await recordLoginAttempt(ipAddress, userAgent, false);
			await logSecurityEvent('login_failed', ipAddress, userAgent);

			// Generic error message to prevent enumeration
			return fail(401, { message: 'Invalid credentials' });
		}

		// Successful login
		await recordLoginAttempt(ipAddress, userAgent, true);

		// Create session
		const session = await createSession(ipAddress, userAgent);

		await logSecurityEvent('login_success', ipAddress, userAgent, {
			sessionId: session.id
		});

		// Set secure cookie
		cookies.set('admin_session', session.token, {
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 // 24 hours (session handles actual expiry)
		});

		throw redirect(303, '/admin');
	}
};
