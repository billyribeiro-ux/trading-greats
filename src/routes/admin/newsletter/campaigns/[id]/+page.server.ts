import type { PageServerLoad, Actions } from './$types';
import { redirect, fail, error } from '@sveltejs/kit';
import { getCampaign, updateCampaign, sendCampaign, getCampaignEvents } from '$lib/server/newsletter';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) {
		throw redirect(303, '/admin/login');
	}

	const campaign = await getCampaign(params.id);

	if (!campaign) {
		throw error(404, 'Campaign not found');
	}

	// Get recent events for sent campaigns
	let events: Awaited<ReturnType<typeof getCampaignEvents>> = [];
	if (campaign.status === 'sent') {
		events = await getCampaignEvents(params.id, { limit: 50 });
	}

	return {
		campaign,
		events
	};
};

export const actions: Actions = {
	update: async ({ request, locals, params }) => {
		if (!locals.user) {
			throw redirect(303, '/admin/login');
		}

		const formData = await request.formData();
		const subject = formData.get('subject')?.toString();
		const previewText = formData.get('previewText')?.toString();
		const content = formData.get('content')?.toString();

		if (!subject || !content) {
			return fail(400, { success: false, message: 'Subject and content are required' });
		}

		await updateCampaign(params.id, {
			subject,
			previewText: previewText || undefined,
			content
		});

		return { success: true, message: 'Campaign updated successfully' };
	},

	send: async ({ locals, params }) => {
		if (!locals.user) {
			throw redirect(303, '/admin/login');
		}

		const result = await sendCampaign(params.id);

		if (!result.success) {
			return fail(400, { success: false, message: result.message });
		}

		return { success: true, message: result.message };
	}
};
