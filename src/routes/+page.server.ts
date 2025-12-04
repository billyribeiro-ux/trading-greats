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

// ============================================================================
// DATA LOADING
// ============================================================================
export const load: PageServerLoad = async () => {
    // Get featured traders from seed data (first 8 with photos)
    const traders: TraderProfile[] = seedTraders
        .filter(t => t.photoUrl) // Only traders with photos
        .slice(0, 8)
        .map(t => ({
            name: t.name,
            slug: t.slug,
            tradingStyle: t.tradingStyle || 'Trading',
            oneLiner: t.oneLiner || 'Legendary Trader',
            netWorth: t.netWorth || 'Exceptional Returns',
            photoUrl: t.photoUrl || null
        }));

    const meta = {
        title: "Trading Greats - Study Strategies From The World's Greatest Traders",
        description: "Master proven trading methodologies from legendary investors. Study value investing from Buffett, momentum trading from Minervini, and macro strategies from Soros.",
        canonical: "https://tradinggreats.com"
    };

    return { traders, meta };
};
