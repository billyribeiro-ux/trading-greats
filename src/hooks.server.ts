import { redirect, type Handle } from '@sveltejs/kit';
import {
	validateSession,
	logSecurityEvent,
	cleanupExpiredData,
	getClientIp,
	sanitizeUserAgent,
	isIpBlocked
} from '$lib/server/auth';

// Run cleanup periodically (every hour)
let lastCleanup = 0;
const CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour

export const handle: Handle = async ({ event, resolve }) => {
	const ipAddress = getClientIp(event.request);
	const userAgent = sanitizeUserAgent(event.request.headers.get('user-agent'));

	// Periodic cleanup
	const now = Date.now();
	if (now - lastCleanup > CLEANUP_INTERVAL) {
		lastCleanup = now;
		// Run cleanup in background (don't await)
		cleanupExpiredData().catch(console.error);
	}

	// Check admin authentication for admin routes
	if (event.url.pathname.startsWith('/admin')) {
		// Check if IP is blocked
		const blockStatus = await isIpBlocked(ipAddress);
		if (blockStatus.blocked && event.url.pathname !== '/admin/login') {
			// Return a 403 for blocked IPs trying to access admin
			return new Response('Access denied', { status: 403 });
		}

		const sessionToken = event.cookies.get('admin_session');

		// Allow access to login page
		if (event.url.pathname === '/admin/login') {
			if (sessionToken) {
				// Validate existing session
				const validation = await validateSession(sessionToken, ipAddress);
				if (validation.valid) {
					throw redirect(303, '/admin');
				}
				// Invalid session, clear cookie and let them login
				event.cookies.delete('admin_session', { path: '/' });
			}
			return resolve(event);
		}

		// Check authentication for all other admin routes
		if (!sessionToken) {
			throw redirect(303, '/admin/login');
		}

		// Validate session
		const validation = await validateSession(sessionToken, ipAddress);

		if (!validation.valid) {
			// Log the invalid session attempt
			await logSecurityEvent('session_expired', ipAddress, userAgent, {
				reason: validation.reason
			});

			// Clear invalid cookie
			event.cookies.delete('admin_session', { path: '/' });

			throw redirect(303, '/admin/login');
		}

		// Set user info in locals
		event.locals.user = {
			isAdmin: true,
			sessionId: validation.sessionId
		};
	}

	const response = await resolve(event, {
		// Preload fonts for better performance
		preload: ({ type }) => type === 'font' || type === 'css' || type === 'js'
	});

	// Security headers
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('X-XSS-Protection', '1; mode=block');

	// Content Security Policy (strict)
	if (event.url.pathname.startsWith('/admin')) {
		response.headers.set(
			'Content-Security-Policy',
			"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'"
		);
	}

	// Permissions Policy
	response.headers.set(
		'Permissions-Policy',
		'camera=(), microphone=(), geolocation=(), interest-cohort=()'
	);

	return response;
};
