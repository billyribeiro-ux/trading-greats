<script lang="ts">
	import { page } from '$app/state';
	import type { Trader, BlogPost } from '$lib/server/schema';

	// Default values that can be overridden by environment variables
	const SITE_NAME = 'Trading Greats';
	const SITE_URL = $derived(page.url.origin || 'https://tradinggreats.com');

	type SchemaType = 'WebSite' | 'Organization' | 'Person' | 'ProfilePage' | 'BreadcrumbList' | 'Article' | 'TraderArticle' | 'FAQPage';

	interface FAQItem {
		question: string;
		answer: string;
	}

	interface Props {
		type: SchemaType;
		trader?: Trader;
		article?: BlogPost;
		breadcrumbs?: { name: string; url: string }[];
		faqItems?: FAQItem[];
	}

	let { type, trader, article, breadcrumbs, faqItems }: Props = $props();

	function generateSchema() {
		const orgSchema = {
			'@type': 'Organization',
			'@id': `${SITE_URL}/#organization`,
			name: SITE_NAME,
			url: SITE_URL,
			logo: {
				'@type': 'ImageObject',
				url: `${SITE_URL}/favicon.svg`,
				width: 512,
				height: 512
			},
			sameAs: [
				'https://twitter.com/tradinggreats',
				'https://linkedin.com/company/tradinggreats'
			]
		};

		switch (type) {
			case 'WebSite':
				return {
					'@context': 'https://schema.org',
					'@type': 'WebSite',
					'@id': `${SITE_URL}/#website`,
					name: SITE_NAME,
					url: SITE_URL,
					description: 'Explore the minds that moved markets. Discover legendary traders, their strategies, and timeless wisdom from the greatest investors in history.',
					publisher: { '@id': `${SITE_URL}/#organization` },
					potentialAction: {
						'@type': 'SearchAction',
						target: {
							'@type': 'EntryPoint',
							urlTemplate: `${SITE_URL}/traders?search={search_term_string}`
						},
						'query-input': 'required name=search_term_string'
					}
				};

			case 'Organization':
				return {
					'@context': 'https://schema.org',
					...orgSchema
				};

			case 'Person':
				if (!trader) return null;
				return {
					'@context': 'https://schema.org',
					'@type': 'Person',
					'@id': `${SITE_URL}/traders/${trader.slug}#person`,
					name: trader.name,
					url: `${SITE_URL}/traders/${trader.slug}`,
					image: trader.photoUrl,
					description: trader.oneLiner,
					jobTitle: trader.tradingStyle ? `${trader.tradingStyle} Trader` : 'Trader',
					birthDate: trader.birthYear ? `${trader.birthYear}` : undefined,
					deathDate: trader.deathYear ? `${trader.deathYear}` : undefined,
					nationality: trader.nationality,
					knowsAbout: ['Trading', 'Financial Markets', trader.tradingStyle].filter(Boolean),
					sameAs: trader.socialLinks?.map((link: { url: string }) => link.url) || []
				};

			case 'ProfilePage':
				if (!trader) return null;
				return {
					'@context': 'https://schema.org',
					'@type': 'ProfilePage',
					'@id': `${SITE_URL}/traders/${trader.slug}`,
					name: `${trader.name} - Trading Profile`,
					url: `${SITE_URL}/traders/${trader.slug}`,
					description: trader.bio?.substring(0, 200),
					dateModified: trader.updatedAt,
					mainEntity: {
						'@id': `${SITE_URL}/traders/${trader.slug}#person`
					},
					isPartOf: { '@id': `${SITE_URL}/#website` },
					breadcrumb: {
						'@type': 'BreadcrumbList',
						itemListElement: [
							{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
							{ '@type': 'ListItem', position: 2, name: 'Traders', item: `${SITE_URL}/traders` },
							{ '@type': 'ListItem', position: 3, name: trader.name, item: `${SITE_URL}/traders/${trader.slug}` }
						]
					}
				};

			case 'BreadcrumbList':
				if (!breadcrumbs) return null;
				return {
					'@context': 'https://schema.org',
					'@type': 'BreadcrumbList',
					itemListElement: breadcrumbs.map((item, index) => ({
						'@type': 'ListItem',
						position: index + 1,
						name: item.name,
						item: item.url
					}))
				};

			case 'Article':
				if (!trader) return null;
				return {
					'@context': 'https://schema.org',
					'@type': 'Article',
					'@id': `${SITE_URL}/traders/${trader.slug}#article`,
					headline: `${trader.name} - ${trader.oneLiner}`,
					description: trader.bio?.substring(0, 200),
					image: trader.photoUrl,
					author: {
						'@type': 'Organization',
						'@id': `${SITE_URL}/#organization`,
						name: SITE_NAME,
						url: SITE_URL
					},
					publisher: { '@id': `${SITE_URL}/#organization` },
					datePublished: trader.createdAt,
					dateModified: trader.updatedAt,
					isPartOf: { '@id': `${SITE_URL}/#website` },
					mainEntityOfPage: {
						'@type': 'WebPage',
						'@id': `${SITE_URL}/traders/${trader.slug}`
					},
					speakable: {
						'@type': 'SpeakableSpecification',
						cssSelector: ['h1', '.trader-one-liner', '.trader-bio p:first-of-type']
					}
				};

			case 'TraderArticle':
				if (!article || !trader) return null;
				return {
					'@context': 'https://schema.org',
					'@type': 'Article',
					'@id': `${SITE_URL}/traders/${trader.slug}/articles/${article.slug}#article`,
					headline: article.title,
					description: article.seoDescription || article.excerpt || '',
					image: article.ogImage || article.heroImage || trader.photoUrl,
					datePublished: article.publishedAt || new Date().toISOString(),
					dateModified: article.updatedAt || article.publishedAt || new Date().toISOString(),
					author: {
						'@type': 'Organization',
						'@id': `${SITE_URL}/#organization`,
						name: SITE_NAME,
						url: SITE_URL
					},
					publisher: { '@id': `${SITE_URL}/#organization` },
					isPartOf: { '@id': `${SITE_URL}/#website` },
					mainEntityOfPage: {
						'@type': 'WebPage',
						'@id': `${SITE_URL}/traders/${trader.slug}/articles/${article.slug}`
					},
					about: {
						'@type': 'Person',
						'@id': `${SITE_URL}/traders/${trader.slug}#person`,
						name: trader.name,
						url: `${SITE_URL}/traders/${trader.slug}`,
						image: trader.photoUrl,
						jobTitle: trader.tradingStyle ? `${trader.tradingStyle} Trader` : 'Trader',
						knowsAbout: ['Trading', 'Financial Markets', trader.tradingStyle].filter(Boolean)
					},
					articleSection: article.category || 'Trading',
					keywords: article.tags?.join(', ') || trader.tradingStyle || 'trading',
					speakable: {
						'@type': 'SpeakableSpecification',
						cssSelector: ['h1', '.article-excerpt', '.article-content p:first-of-type']
					}
				};

			case 'FAQPage':
				if (!faqItems || faqItems.length === 0) return null;
				return {
					'@context': 'https://schema.org',
					'@type': 'FAQPage',
					mainEntity: faqItems.map(item => ({
						'@type': 'Question',
						name: item.question,
						acceptedAnswer: {
							'@type': 'Answer',
							text: item.answer
						}
					}))
				};

			default:
				return null;
		}
	}

	const schema = $derived(generateSchema());
	// Escape angle brackets so any closing-tag-like substring cannot break out.
	const safe = $derived(schema ? JSON.stringify(schema).replace(/</g, '\\u003c').replace(/>/g, '\\u003e') : '');
</script>

<svelte:head>
	{#if schema}
		{@html `<script type="application/ld+json">${safe}</script>`}
	{/if}
</svelte:head>
