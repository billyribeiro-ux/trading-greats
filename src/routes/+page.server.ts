import type { PageServerLoad } from './$types';
import { seedTraders } from '$lib/server/seed';

// ============================================================================
// RENDERING CONFIGURATION
// ============================================================================
export const ssr = true;      // SEO enabled
export const csr = true;      // Hydration enabled for interactions

// ============================================================================
// TYPES
// ============================================================================
interface TraderProfile {
    name: string;
    slug: string;
    tradingStyle: string;
    oneLiner: string;
    netWorth: string;
    photoUrl: string | null;
}

interface QuoteWithTrader {
    text: string;
    source?: string;
    traderName: string;
    traderSlug: string;
}

// ============================================================================
// DATA LOADING
// ============================================================================
export const load: PageServerLoad = async () => {
    // Custom order for "Most Studied This Month" - Billy Ribeiro first, Mark Minervini second
    // Exclude John Carter from featured list
    const featuredOrder = ['billy-ribeiro', 'mark-minervini', 'george-soros', 'warren-buffett', 'paul-tudor-jones', 'ray-dalio', 'jesse-livermore', 'peter-lynch'];
    const excludeSlugs = ['john-carter'];
    
    // Filter out excluded traders and sort by featured order
    const orderedTraders = seedTraders
        .filter(t => !excludeSlugs.includes(t.slug))
        .sort((a, b) => {
            const aIndex = featuredOrder.indexOf(a.slug);
            const bIndex = featuredOrder.indexOf(b.slug);
            // If both are in featured order, sort by that order
            if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
            // If only a is in featured order, a comes first
            if (aIndex !== -1) return -1;
            // If only b is in featured order, b comes first
            if (bIndex !== -1) return 1;
            // Otherwise keep original order
            return 0;
        });
    
    // Get featured traders from seed data (first 8)
    const traders: TraderProfile[] = orderedTraders
        .slice(0, 8)
        .map(t => ({
            name: t.name,
            slug: t.slug,
            tradingStyle: t.tradingStyle || 'Trading',
            oneLiner: t.oneLiner || 'Legendary Trader',
            netWorth: t.netWorth || 'Exceptional Returns',
            photoUrl: t.photoUrl || null
        }));

    // Extract all quotes from all traders for Quote of the Day
    const allQuotes: QuoteWithTrader[] = seedTraders
        .flatMap(trader =>
            (trader.quotes || []).map(quote => ({
                text: quote.text,
                source: quote.source,
                traderName: trader.name,
                traderSlug: trader.slug
            }))
        );

    const meta = {
        title: "Trading Greats - Study Strategies From The World's Greatest Traders",
        description: "Master proven trading methodologies from legendary investors. Study value investing from Buffett, momentum trading from Minervini, and macro strategies from Soros.",
        canonical: "https://tradinggreats.com"
    };

    return { traders, allQuotes, meta };
};
