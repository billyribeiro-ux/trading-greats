import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { ADMIN_PASSWORD, ADMIN_SECRET } from '$env/static/private';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const password = formData.get('password');

		if (password !== ADMIN_PASSWORD) {
			return fail(401, { message: 'Invalid password' });
		}

		cookies.set('admin_session', ADMIN_SECRET, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 30 // 30 days
		});

		throw redirect(303, '/admin');
	}
};
