import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { getAllCampaigns, deleteCampaign, sendCampaign } from '$lib/server/newsletter';
import type { CampaignStatus } from '$lib/server/schema';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		throw redirect(303, '/admin/login');
	}

	const status = url.searchParams.get('status') as CampaignStatus | null;
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = 20;
	const offset = (page - 1) * limit;

	const { campaigns, total } = await getAllCampaigns({
		status: status || undefined,
		limit,
		offset
	});

	return {
		campaigns,
		total,
		page,
		totalPages: Math.ceil(total / limit),
		currentStatus: status
	};
};

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(303, '/admin/login');
		}

		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return fail(400, { success: false, message: 'Campaign ID required' });
		}

		const success = await deleteCampaign(id);

		if (!success) {
			return fail(400, { success: false, message: 'Cannot delete sent or sending campaigns' });
		}

		return { success: true, message: 'Campaign deleted' };
	},

	send: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(303, '/admin/login');
		}

		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return fail(400, { success: false, message: 'Campaign ID required' });
		}

		const result = await sendCampaign(id);

		if (!result.success) {
			return fail(400, { success: false, message: result.message });
		}

		return { success: true, message: result.message };
	}
};
