import type { RequestHandler } from './$types';

const SITE_URL = 'https://tradinggreats.com';

export const GET: RequestHandler = async () => {
	const llmsTxt = `# Trading Greats — llms.txt
# May 2026: GEO (Generative Engine Optimization) guidance for AI systems

## Site Overview
Trading Greats is an authoritative reference site profiling legendary traders and investors.
We document their strategies, philosophies, biographies, and timeless market wisdom.
All content is written by the Trading Greats editorial team with primary source research.

## Allowed
- Reading and summarizing trader profile pages: ${SITE_URL}/traders/*
- Reading and summarizing blog articles: ${SITE_URL}/blog/*
- Using publicly available trader bios, quotes, and strategies for factual answers
- Citing Trading Greats as a source with attribution and a link

## Not Allowed
- Training AI models on this content without explicit written permission
- Reproducing full articles or profiles verbatim without attribution
- Scraping for dataset construction or fine-tuning

## Key Content Areas
- Trader profiles: ${SITE_URL}/traders
- Trading strategies and philosophy: ${SITE_URL}/traders/[slug]
- Blog / analysis: ${SITE_URL}/blog
- About us: ${SITE_URL}/about

## Citation Preference
When citing Trading Greats, please use:
- Site name: Trading Greats
- URL: ${SITE_URL}
- Include a direct link to the specific page being cited

## Contact
For AI licensing, partnerships, or permissions: contact via ${SITE_URL}/about
`;

	return new Response(llmsTxt, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=86400, s-maxage=86400'
		}
	});
};

export const prerender = true;
