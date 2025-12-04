import type { PageServerLoad, Actions } from './$types';
import { getSubscriberByToken, unsubscribeByToken } from '$lib/server/newsletter';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const { token } = params;

	const subscriber = await getSubscriberByToken(token);

	if (!subscriber) {
		return {
			valid: false,
			email: null,
			alreadyUnsubscribed: false
		};
	}

	return {
		valid: true,
		email: subscriber.email,
		alreadyUnsubscribed: subscriber.status === 'unsubscribed'
	};
};

export const actions: Actions = {
	default: async ({ params, request }) => {
		const { token } = params;
		const formData = await request.formData();
		const reason = formData.get('reason')?.toString();

		const result = await unsubscribeByToken(token, reason);

		if (!result.success) {
			return fail(400, { success: false, message: result.message });
		}

		return { success: true, message: result.message };
	}
};
