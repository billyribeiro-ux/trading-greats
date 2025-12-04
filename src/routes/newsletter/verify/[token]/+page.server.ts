import type { PageServerLoad } from './$types';
import { verifySubscriber } from '$lib/server/newsletter';

export const load: PageServerLoad = async ({ params }) => {
	const { token } = params;

	const result = await verifySubscriber(token);

	return {
		success: result.success,
		message: result.message
	};
};
