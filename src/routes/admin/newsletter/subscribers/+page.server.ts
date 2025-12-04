import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { getAllSubscribers, deleteSubscriber } from '$lib/server/newsletter';
import type { SubscriberStatus } from '$lib/server/schema';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		throw redirect(303, '/admin/login');
	}

	const status = url.searchParams.get('status') as SubscriberStatus | null;
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = 25;
	const offset = (page - 1) * limit;

	const { subscribers, total } = await getAllSubscribers({
		status: status || undefined,
		limit,
		offset
	});

	return {
		subscribers,
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
			return fail(400, { success: false, message: 'Subscriber ID required' });
		}

		await deleteSubscriber(id);

		return { success: true, message: 'Subscriber deleted' };
	}
};
