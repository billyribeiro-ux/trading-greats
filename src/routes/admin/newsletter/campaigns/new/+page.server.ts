import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { createCampaign } from '$lib/server/newsletter';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/admin/login');
	}

	return {};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(303, '/admin/login');
		}

		const formData = await request.formData();
		const subject = formData.get('subject')?.toString();
		const previewText = formData.get('previewText')?.toString();
		const content = formData.get('content')?.toString();
		const type = formData.get('type')?.toString() as 'manual' | 'weekly_digest' | 'new_trader' | 'blog_post';

		if (!subject || !content) {
			return fail(400, {
				success: false,
				message: 'Subject and content are required',
				data: { subject, previewText, content, type }
			});
		}

		const campaign = await createCampaign({
			subject,
			previewText: previewText || undefined,
			content,
			type: type || 'manual'
		});

		if (!campaign) {
			return fail(500, {
				success: false,
				message: 'Failed to create campaign',
				data: { subject, previewText, content, type }
			});
		}

		throw redirect(303, `/admin/newsletter/campaigns/${campaign.id}`);
	}
};
