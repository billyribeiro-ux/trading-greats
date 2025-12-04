import type { PageServerLoad, Actions } from './$types';
import { getSubscriberByToken, updateSubscriberPreferences, unsubscribeByToken } from '$lib/server/newsletter';
import { fail } from '@sveltejs/kit';
import { DEFAULT_SUBSCRIBER_PREFERENCES } from '$lib/server/schema';

export const load: PageServerLoad = async ({ params }) => {
	const { token } = params;

	const subscriber = await getSubscriberByToken(token);

	if (!subscriber) {
		return {
			valid: false,
			email: null,
			preferences: null,
			status: null
		};
	}

	return {
		valid: true,
		email: subscriber.email,
		preferences: subscriber.preferences || DEFAULT_SUBSCRIBER_PREFERENCES,
		status: subscriber.status
	};
};

export const actions: Actions = {
	updatePreferences: async ({ params, request }) => {
		const { token } = params;
		const formData = await request.formData();

		const preferences = {
			weeklyDigest: formData.get('weeklyDigest') === 'on',
			newTraderAlerts: formData.get('newTraderAlerts') === 'on',
			blogPostAlerts: formData.get('blogPostAlerts') === 'on',
			marketInsights: formData.get('marketInsights') === 'on'
		};

		const result = await updateSubscriberPreferences(token, preferences);

		if (!result.success) {
			return fail(400, { success: false, message: result.message, action: 'updatePreferences' });
		}

		return { success: true, message: 'Preferences updated successfully!', action: 'updatePreferences' };
	},

	unsubscribe: async ({ params }) => {
		const { token } = params;

		const result = await unsubscribeByToken(token, 'Unsubscribed from preferences page');

		if (!result.success) {
			return fail(400, { success: false, message: result.message, action: 'unsubscribe' });
		}

		return { success: true, message: result.message, action: 'unsubscribe' };
	}
};
