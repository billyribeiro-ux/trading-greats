import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getNewsletterStats, getAllCampaigns, getAllSubscribers } from '$lib/server/newsletter';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/admin/login');
	}

	const [stats, campaignsData, subscribersData] = await Promise.all([
		getNewsletterStats(),
		getAllCampaigns({ limit: 5 }),
		getAllSubscribers({ status: 'verified', limit: 5 })
	]);

	return {
		stats,
		recentCampaigns: campaignsData.campaigns,
		recentSubscribers: subscribersData.subscribers
	};
};
