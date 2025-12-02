import { redirect, type Handle } from '@sveltejs/kit';
import { ADMIN_SECRET } from '$env/static/private';

export const handle: Handle = async ({ event, resolve }) => {
	// Check admin authentication for admin routes
	if (event.url.pathname.startsWith('/admin')) {
		const session = event.cookies.get('admin_session');

		// Allow access to login page
		if (event.url.pathname === '/admin/login') {
			// If already authenticated, redirect to admin dashboard
			if (session === ADMIN_SECRET) {
				throw redirect(303, '/admin');
			}
			return resolve(event);
		}

		// Check authentication for all other admin routes
		if (session !== ADMIN_SECRET) {
			throw redirect(303, '/admin/login');
		}

		event.locals.user = { isAdmin: true };
	}

	const response = await resolve(event, {
		// Preload fonts for better performance
		preload: ({ type }) => type === 'font' || type === 'css' || type === 'js'
	});

	// Security headers
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

	return response;
};
