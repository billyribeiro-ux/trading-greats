<script lang="ts">
	import { PUBLIC_SITE_URL, PUBLIC_SITE_NAME } from '$env/static/public';
	import type { Trader } from '$server/schema';

	type SchemaType = 'WebSite' | 'Person' | 'BreadcrumbList' | 'Article';

	interface Props {
		type: SchemaType;
		trader?: Trader;
		breadcrumbs?: { name: string; url: string }[];
	}

	let { type, trader, breadcrumbs }: Props = $props();

	function generateSchema() {
		switch (type) {
			case 'WebSite':
				return {
					'@context': 'https://schema.org',
					'@type': 'WebSite',
					name: PUBLIC_SITE_NAME,
					url: PUBLIC_SITE_URL,
					description: 'Explore the minds that moved markets. Discover legendary traders, their strategies, and timeless wisdom from the greatest investors in history.',
					potentialAction: {
						'@type': 'SearchAction',
						target: `${PUBLIC_SITE_URL}/search?q={search_term_string}`,
						'query-input': 'required name=search_term_string'
					}
				};

			case 'Person':
				if (!trader) return null;
				return {
					'@context': 'https://schema.org',
					'@type': 'Person',
					name: trader.name,
					url: `${PUBLIC_SITE_URL}/traders/${trader.slug}`,
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
						name: PUBLIC_SITE_NAME
					},
					publisher: {
						'@type': 'Organization',
						name: PUBLIC_SITE_NAME,
						url: PUBLIC_SITE_URL
					},
					datePublished: trader.createdAt,
					dateModified: trader.updatedAt,
					mainEntityOfPage: {
						'@type': 'WebPage',
						'@id': `${PUBLIC_SITE_URL}/traders/${trader.slug}`
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
