import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { traders } from '$lib/server/schema';
import { slugify } from '$lib/utils';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const name = formData.get('name') as string;
		const oneLiner = formData.get('oneLiner') as string;
		const nationality = formData.get('nationality') as string;
		const tradingStyle = formData.get('tradingStyle') as string;
		const birthYear = formData.get('birthYear') as string;
		const deathYear = formData.get('deathYear') as string;
		const netWorth = formData.get('netWorth') as string;
		const photoUrl = formData.get('photoUrl') as string;
		const bio = formData.get('bio') as string;
		const philosophy = formData.get('philosophy') as string;
		const status = formData.get('status') as 'draft' | 'published';

		// Get achievements
		const achievementValues = formData.getAll('achievements') as string[];
		const achievements = achievementValues.filter(a => a.trim() !== '');

		// Get quotes
		const quoteTexts = formData.getAll('quoteText') as string[];
		const quoteSources = formData.getAll('quoteSource') as string[];
		const quotes = quoteTexts
			.map((text, i) => ({ text, source: quoteSources[i] || '' }))
			.filter(q => q.text.trim() !== '');

		// Validation
		if (!name || !oneLiner) {
			return fail(400, { error: 'Name and one-liner are required' });
		}

		const slug = slugify(name);

		try {
			await db.insert(traders).values({
				name,
				slug,
				oneLiner,
				nationality: nationality || null,
				tradingStyle: tradingStyle || null,
				birthYear: birthYear ? parseInt(birthYear) : null,
				deathYear: deathYear ? parseInt(deathYear) : null,
				netWorth: netWorth || null,
				photoUrl: photoUrl || null,
				bio: bio || null,
				philosophy: philosophy || null,
				achievements: achievements.length > 0 ? achievements : null,
				quotes: quotes.length > 0 ? quotes : null,
				status: status || 'draft'
			});
		} catch (error) {
			console.error('Error creating trader:', error);
			return fail(500, { error: 'Failed to create trader. Please try again.' });
		}

		throw redirect(303, '/admin/traders');
	}
};
