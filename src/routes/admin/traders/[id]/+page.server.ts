import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { traders } from '$lib/server/schema';
import type { FamousTrade, Quote, Book, SocialLink } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { slugify } from '$lib/utils';
import { seedTraders } from '$lib/server/seed';
import type { Trader, NewTrader } from '$lib/server/schema';

// Helper to convert seed data to Trader type
function seedToTrader(t: NewTrader, id: string): Trader {
	return {
		id,
		name: t.name,
		slug: t.slug,
		photoUrl: t.photoUrl ?? null,
		oneLiner: t.oneLiner ?? null,
		birthYear: t.birthYear ?? null,
		deathYear: t.deathYear ?? null,
		nationality: t.nationality ?? null,
		tradingStyle: t.tradingStyle ?? null,
		netWorth: t.netWorth ?? null,
		bio: t.bio ?? null,
		philosophy: t.philosophy ?? null,
		achievements: t.achievements ?? null,
		famousTrades: t.famousTrades ?? null,
		quotes: t.quotes ?? null,
		books: t.books ?? null,
		socialLinks: t.socialLinks ?? null,
		status: t.status ?? 'published',
		createdAt: t.createdAt ?? new Date().toISOString(),
		updatedAt: t.updatedAt ?? new Date().toISOString()
	};
}

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	// First try to load from database
	const [dbTrader] = await db.select().from(traders).where(eq(traders.id, id));

	if (dbTrader) {
		return { trader: dbTrader };
	}

	// Fallback to seed data for development
	// Parse the id to get the index (format: trader-0, trader-1, etc.)
	if (id.startsWith('trader-')) {
		const index = parseInt(id.replace('trader-', ''));
		const traderData = seedTraders[index];

		if (traderData) {
			return { trader: seedToTrader(traderData, id) };
		}
	}

	throw error(404, 'Trader not found');
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const formData = await request.formData();
		const { id } = params;

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

		// Validation
		if (!name || !oneLiner) {
			return fail(400, { error: 'Name and one-liner are required' });
		}

		// Get achievements
		const achievementValues = formData.getAll('achievements') as string[];
		const achievements = achievementValues.filter(a => a.trim() !== '');

		// Get quotes
		const quoteTexts = formData.getAll('quoteText') as string[];
		const quoteSources = formData.getAll('quoteSource') as string[];
		const quotes: Quote[] = quoteTexts
			.map((text, i) => ({ text, source: quoteSources[i] || '' }))
			.filter(q => q.text.trim() !== '');

		// Get famous trades
		const tradeDates = formData.getAll('tradeDate') as string[];
		const tradeAssets = formData.getAll('tradeAsset') as string[];
		const tradePositions = formData.getAll('tradePosition') as string[];
		const tradeOutcomes = formData.getAll('tradeOutcome') as string[];
		const tradeProfitLosses = formData.getAll('tradeProfitLoss') as string[];
		const tradeDescriptions = formData.getAll('tradeDescription') as string[];
		const famousTrades: FamousTrade[] = tradeDates
			.map((date, i) => ({
				date,
				asset: tradeAssets[i] || '',
				position: (tradePositions[i] || 'long') as 'long' | 'short',
				outcome: tradeOutcomes[i] || '',
				profitLoss: tradeProfitLosses[i] || '',
				description: tradeDescriptions[i] || ''
			}))
			.filter(t => t.date.trim() !== '' || t.asset.trim() !== '');

		// Get books
		const bookTitles = formData.getAll('bookTitle') as string[];
		const bookYears = formData.getAll('bookYear') as string[];
		const bookDescriptions = formData.getAll('bookDescription') as string[];
		const books: Book[] = bookTitles
			.map((title, i) => ({
				title,
				year: bookYears[i] ? parseInt(bookYears[i]) : undefined,
				description: bookDescriptions[i] || undefined
			}))
			.filter(b => b.title.trim() !== '');

		// Get social links
		const socialPlatforms = formData.getAll('socialPlatform') as string[];
		const socialUrls = formData.getAll('socialUrl') as string[];
		const socialLinks: SocialLink[] = socialPlatforms
			.map((platform, i) => ({
				platform,
				url: socialUrls[i] || ''
			}))
			.filter(s => s.platform.trim() !== '' && s.url.trim() !== '');

		const slug = slugify(name);

		try {
			// Check if this is a seed trader (id starts with trader-)
			if (id.startsWith('trader-')) {
				// For seed traders, create a new database entry
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
					famousTrades: famousTrades.length > 0 ? famousTrades : null,
					books: books.length > 0 ? books : null,
					socialLinks: socialLinks.length > 0 ? socialLinks : null,
					status: status || 'draft'
				});
			} else {
				// Update existing database trader
				await db.update(traders)
					.set({
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
						famousTrades: famousTrades.length > 0 ? famousTrades : null,
						books: books.length > 0 ? books : null,
						socialLinks: socialLinks.length > 0 ? socialLinks : null,
						status: status || 'draft',
						updatedAt: new Date().toISOString()
					})
					.where(eq(traders.id, id));
			}
		} catch (err) {
			console.error('Error updating trader:', err);
			return fail(500, { error: 'Failed to update trader. Please try again.' });
		}

		throw redirect(303, '/admin/traders');
	}
};
