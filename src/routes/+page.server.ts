import type { PageServerLoad } from './$types';

// ============================================================================
// RENDERING CONFIGURATION
// ============================================================================
export const prerender = true; // Static generation for max speed
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
}

// ============================================================================
// DATA LOADING
// ============================================================================
export const load: PageServerLoad = async () => {
    const traders: TraderProfile[] = [
        { name: 'Warren Buffett', slug: 'warren-buffett', tradingStyle: 'Value Investing', oneLiner: 'The Oracle of Omaha', netWorth: '20% CAGR' },
        { name: 'George Soros', slug: 'george-soros', tradingStyle: 'Macro', oneLiner: 'The Man Who Broke the Bank of England', netWorth: '30% CAGR' },
        { name: 'Paul Tudor Jones', slug: 'paul-tudor-jones', tradingStyle: 'Macro / Technical', oneLiner: 'Legendary Macro Trader', netWorth: '100%+ Returns' },
        { name: 'Mark Minervini', slug: 'mark-minervini', tradingStyle: 'Momentum', oneLiner: 'US Investing Champion', netWorth: '33,000% Returns' },
        { name: 'Jesse Livermore', slug: 'jesse-livermore', tradingStyle: 'Technical', oneLiner: 'The Boy Plunger', netWorth: 'Legendary' },
        { name: 'Ray Dalio', slug: 'ray-dalio', tradingStyle: 'Macro', oneLiner: 'Founder of Bridgewater', netWorth: 'Market Principles' },
        { name: 'Stanley Druckenmiller', slug: 'stanley-druckenmiller', tradingStyle: 'Macro', oneLiner: 'No Down Years', netWorth: '30% Avg' },
        { name: 'Jim Simons', slug: 'jim-simons', tradingStyle: 'Quant', oneLiner: 'The Code Breaker', netWorth: '66% CAGR' }
    ];

    const meta = {
        title: "Trading Greats - Study Strategies From The World's Greatest Traders",
        description: "Master proven trading methodologies from legendary investors. Study value investing from Buffett, momentum trading from Minervini, and macro strategies from Soros.",
        canonical: "https://tradinggreats.com"
    };

    return { traders, meta };
};
