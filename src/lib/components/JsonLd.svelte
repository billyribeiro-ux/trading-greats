<script lang="ts">
	import { page } from '$app/stores';
	import type { Trader, BlogPost } from '$lib/server/schema';

	// Default values that can be overridden by environment variables
	const SITE_NAME = 'Trading Greats';
	const SITE_URL = $derived($page.url.origin || 'https://tradinggreats.com');

	type SchemaType = 'WebSite' | 'Person' | 'BreadcrumbList' | 'Article' | 'TraderArticle';

	interface Props {
		type: SchemaType;
		trader?: Trader;
		article?: BlogPost;
		breadcrumbs?: { name: string; url: string }[];
	}

	let { type, trader, article, breadcrumbs }: Props = $props();

	function generateSchema() {
		switch (type) {
			case 'WebSite':
				return {
					'@context': 'https://schema.org',
					'@type': 'WebSite',
					name: SITE_NAME,
					url: SITE_URL,
					description: 'Explore the minds that moved markets. Discover legendary traders, their strategies, and timeless wisdom from the greatest investors in history.',
					potentialAction: {
						'@type': 'SearchAction',
						target: `${SITE_URL}/search?q={search_term_string}`,
						'query-input': 'required name=search_term_string'
					}
				};

			case 'Person':
				if (!trader) return null;
				return {
					'@context': 'https://schema.org',
					'@type': 'Person',
					name: trader.name,
					url: `${SITE_URL}/traders/${trader.slug}`,
					image: trader.photoUrl,
					description: trader.oneLiner,
					jobTitle: trader.tradingStyle ? `${trader.tradingStyle} Trader` : 'Trader',
					birthDate: trader.birthYear ? `${trader.birthYear}` : undefined,
					deathDate: trader.deathYear ? `${trader.deathYear}` : undefined,
					nationality: trader.nationality,
					knowsAbout: ['Trading', 'Financial Markets', trader.tradingStyle].filter(Boolean),
					sameAs: trader.socialLinks?.map(link => link.url) || []
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
					headline: `${trader.name} - ${trader.oneLiner}`,
					description: trader.bio?.substring(0, 200),
					image: trader.photoUrl,
					author: {
						'@type': 'Organization',
						name: SITE_NAME
					},
					publisher: {
						'@type': 'Organization',
						name: SITE_NAME,
						url: SITE_URL
					},
					datePublished: trader.createdAt,
					dateModified: trader.updatedAt,
					mainEntityOfPage: {
						'@type': 'WebPage',
						'@id': `${SITE_URL}/traders/${trader.slug}`
					}
				};

			case 'TraderArticle':
				// Dec 2025: Enhanced article schema with trader as subject
				if (!article || !trader) return null;
				return {
					'@context': 'https://schema.org',
					'@type': 'Article',
					headline: article.title,
					description: article.seoDescription || article.excerpt || '',
					image: article.ogImage || article.heroImage || trader.photoUrl,
					datePublished: article.publishedAt || new Date().toISOString(),
					dateModified: article.updatedAt || article.publishedAt || new Date().toISOString(),
					author: {
						'@type': 'Organization',
						name: SITE_NAME
					},
					publisher: {
						'@type': 'Organization',
						name: SITE_NAME,
						url: SITE_URL,
						logo: {
							'@type': 'ImageObject',
							url: `${SITE_URL}/favicon.svg`
						}
					},
					mainEntityOfPage: {
						'@type': 'WebPage',
						'@id': `${SITE_URL}/traders/${trader.slug}/articles/${article.slug}`
					},
					// Link to trader as the subject of the article
					about: {
						'@type': 'Person',
						name: trader.name,
						url: `${SITE_URL}/traders/${trader.slug}`,
						image: trader.photoUrl,
						jobTitle: trader.tradingStyle ? `${trader.tradingStyle} Trader` : 'Trader',
						knowsAbout: ['Trading', 'Financial Markets', trader.tradingStyle].filter(Boolean)
					},
					articleSection: article.category || 'Trading',
					keywords: article.tags?.join(', ') || trader.tradingStyle || 'trading',
					// Dec 2025: Voice search optimization
					speakable: {
						'@type': 'SpeakableSpecification',
						cssSelector: ['h1', '.article-excerpt', '.article-content p:first-of-type']
					}
				};

			default:
				return null;
		}
	}

	const schema = $derived(generateSchema());
</script>

<svelte:head>
	{#if schema}
		{@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
	{/if}
</svelte:head>
