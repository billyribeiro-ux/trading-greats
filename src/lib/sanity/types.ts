import type { Trader, FamousTrade, Quote, Book, SocialLink } from '$lib/server/schema';

// Sanity document response type
export interface SanityTrader {
	_id: string;
	_createdAt: string;
	_updatedAt: string;
	name: string;
	slug: string;
	photoUrl: string | null;
	oneLiner: string | null;
	birthYear: number | null;
	deathYear: number | null;
	nationality: string | null;
	tradingStyle: string | null;
	netWorth: string | null;
	bio: string | null;
	philosophy: string | null;
	achievements: string[] | null;
	famousTrades: FamousTrade[] | null;
	quotes: Quote[] | null;
	books: Book[] | null;
	socialLinks: SocialLink[] | null;
	status: 'draft' | 'published';
}

// Transform Sanity document to app Trader type
export function sanityToTrader(doc: SanityTrader): Trader {
	return {
		id: doc._id,
		name: doc.name,
		slug: doc.slug,
		photoUrl: doc.photoUrl,
		oneLiner: doc.oneLiner,
		birthYear: doc.birthYear,
		deathYear: doc.deathYear,
		nationality: doc.nationality,
		tradingStyle: doc.tradingStyle,
		netWorth: doc.netWorth,
		bio: doc.bio,
		philosophy: doc.philosophy,
		achievements: doc.achievements,
		famousTrades: doc.famousTrades,
		quotes: doc.quotes,
		books: doc.books,
		socialLinks: doc.socialLinks,
		status: doc.status,
		createdAt: doc._createdAt,
		updatedAt: doc._updatedAt
	};
}

// Transform array of Sanity documents
export function sanityToTraders(docs: SanityTrader[]): Trader[] {
	return docs.map(sanityToTrader);
}

// Stats response type
export interface TraderStats {
	total: number;
	published: number;
	drafts: number;
}
