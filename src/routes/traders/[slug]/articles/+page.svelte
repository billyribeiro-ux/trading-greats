<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import ScrollReveal from '$lib/components/motion/ScrollReveal.svelte';
	import TraderArticleCard from '$lib/components/TraderArticleCard.svelte';
	import { Icon } from '$lib/components/icons';
	import { PUBLIC_SITE_URL } from '$env/static/public';
	import type { PageData } from './$types';

	// ============================================================================
	// PROPS (Svelte 5 - SSR data hydration)
	// ============================================================================
	let { data }: { data: PageData } = $props();

	// ============================================================================
	// DERIVED DATA
	// ============================================================================
	const trader = $derived(data.trader);
	const articles = $derived(data.articles);
	const featuredArticle = $derived(articles[0] || null);
	const remainingArticles = $derived(articles.slice(1));

	// ============================================================================
	// JSON-LD Structured Data (Google Dec 2025 Best Practices)
	// ============================================================================
	const schemaOrg = $derived({
		breadcrumb: {
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			"itemListElement": [
				{ "@type": "ListItem", "position": 1, "name": "Home", "item": PUBLIC_SITE_URL },
				{ "@type": "ListItem", "position": 2, "name": "Traders", "item": `${PUBLIC_SITE_URL}/traders` },
				{ "@type": "ListItem", "position": 3, "name": trader.name, "item": `${PUBLIC_SITE_URL}/traders/${trader.slug}` },
				{ "@type": "ListItem", "position": 4, "name": "Articles", "item": `${PUBLIC_SITE_URL}/traders/${trader.slug}/articles` }
			]
		},
		collection: {
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			"name": `${trader.name} - Trading Articles & Insights`,
			"description": data.meta.description,
			"url": `${PUBLIC_SITE_URL}/traders/${trader.slug}/articles`,
			"isPartOf": {
				"@type": "WebSite",
				"name": "Trading Greats",
				"url": PUBLIC_SITE_URL
			},
			"about": {
				"@type": "Person",
				"name": trader.name,
				"url": `${PUBLIC_SITE_URL}/traders/${trader.slug}`
			},
			"numberOfItems": articles.length,
			"hasPart": articles.slice(0, 10).map(article => ({
				"@type": "Article",
				"headline": article.title,
				"url": `${PUBLIC_SITE_URL}/traders/${trader.slug}/articles/${article.slug}`
			}))
		}
	});
</script>

<SEO
	title={data.meta.title}
	description={data.meta.description}
	keywords={data.meta.keywords}
	image={trader.photoUrl || undefined}
/>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(schemaOrg.breadcrumb)}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(schemaOrg.collection)}</script>`}
</svelte:head>

<div class="min-h-screen bg-midnight-950">
	<!-- Hero Section - MOBILE-FIRST -->
	<section class="relative overflow-hidden">
		<!-- Background -->
		<div class="absolute inset-0 h-[35vh] sm:h-[40vh] min-h-[280px]">
			<div class="absolute inset-0 bg-gradient-to-br from-midnight-900 via-midnight-950 to-midnight-900"></div>
			<div class="absolute top-0 left-1/4 h-48 w-48 sm:h-72 sm:w-72 rounded-full bg-gold-500/5 blur-3xl"></div>
			<div class="absolute bottom-0 right-1/4 h-48 w-48 sm:h-72 sm:w-72 rounded-full bg-gold-500/5 blur-3xl"></div>
		</div>

		<div class="relative mx-auto max-w-7xl px-4 pt-20 sm:pt-24 lg:pt-28 pb-10 sm:pb-12 sm:px-6 lg:px-8">
			<ScrollReveal>
				<!-- Breadcrumbs - MOBILE-FIRST -->
				<nav class="mb-5 sm:mb-6 flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-midnight-400">
					<a href="/" class="hover:text-gold-400 transition-colors">Home</a>
					<Icon name="chevron-right" class="h-3 w-3 sm:h-4 sm:w-4" />
					<a href="/traders" class="hover:text-gold-400 transition-colors">Traders</a>
					<Icon name="chevron-right" class="h-3 w-3 sm:h-4 sm:w-4" />
					<a href="/traders/{trader.slug}" class="hover:text-gold-400 transition-colors">{trader.name}</a>
					<Icon name="chevron-right" class="h-3 w-3 sm:h-4 sm:w-4" />
					<span class="text-white font-medium">Articles</span>
				</nav>

				<!-- Trader info header -->
				<div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
					{#if trader.photoUrl}
						<img
							src={trader.photoUrl}
							alt={trader.name}
							class="h-16 w-16 sm:h-20 sm:w-20 rounded-xl sm:rounded-2xl object-cover border-2 border-gold-500/30"
						/>
					{:else}
						<div class="h-16 w-16 sm:h-20 sm:w-20 rounded-xl sm:rounded-2xl bg-gold-500/20 flex items-center justify-center">
							<Icon name="user" class="h-8 w-8 text-gold-400" />
						</div>
					{/if}

					<div>
						<h1 class="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
							{trader.name}
						</h1>
						<p class="mt-1 text-sm sm:text-base text-midnight-300">
							{trader.tradingStyle || 'Trading'} Articles & Insights
						</p>
					</div>
				</div>

				<!-- Stats bar -->
				<div class="flex flex-wrap items-center gap-4 sm:gap-6 p-4 rounded-xl bg-midnight-900/50 border border-white/5">
					<div class="flex items-center gap-2">
						<Icon name="book-open" class="h-4 w-4 sm:h-5 sm:w-5 text-gold-500" />
						<span class="text-sm sm:text-base text-white font-medium">{articles.length} Articles</span>
					</div>
					{#if trader.tradingStyle}
						<div class="flex items-center gap-2">
							<Icon name="trending-up" class="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
							<span class="text-sm sm:text-base text-midnight-300">{trader.tradingStyle}</span>
						</div>
					{/if}
					<a
						href="/traders/{trader.slug}"
						class="ml-auto flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gold-400 hover:text-gold-300 transition-colors"
					>
						View Profile
						<Icon name="arrow-right" class="h-3.5 w-3.5" />
					</a>
				</div>
			</ScrollReveal>
		</div>
	</section>

	<!-- Articles Section - MOBILE-FIRST -->
	<section class="relative py-10 sm:py-12 lg:py-16">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			{#if articles.length === 0}
				<!-- Empty state -->
				<ScrollReveal>
					<div class="flex flex-col items-center justify-center py-16 sm:py-20 text-center">
						<div class="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-midnight-800 flex items-center justify-center mb-4 sm:mb-6">
							<Icon name="book-open" class="h-8 w-8 sm:h-10 sm:w-10 text-midnight-600" />
						</div>
						<h2 class="font-display text-xl sm:text-2xl font-bold text-white mb-2">
							No articles yet
						</h2>
						<p class="text-sm sm:text-base text-midnight-400 max-w-md mb-6">
							We're working on in-depth articles about {trader.name}'s trading strategies and insights.
							Check back soon!
						</p>
						<a
							href="/traders/{trader.slug}"
							class="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-semibold text-midnight-950 hover:bg-gold-400 transition-colors"
						>
							<Icon name="arrow-left" class="h-4 w-4" />
							Back to Profile
						</a>
					</div>
				</ScrollReveal>
			{:else}
				<!-- Featured Article -->
				{#if featuredArticle}
					<ScrollReveal>
						<div class="mb-8 sm:mb-10 lg:mb-12">
							<h2 class="font-display text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
								<Icon name="sparkles" class="h-5 w-5 text-gold-500" />
								Featured Article
							</h2>
							<TraderArticleCard
								article={featuredArticle}
								trader={trader}
								variant="featured"
							/>
						</div>
					</ScrollReveal>
				{/if}

				<!-- Remaining Articles Grid -->
				{#if remainingArticles.length > 0}
					<ScrollReveal delay={100}>
						<h2 class="font-display text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
							<Icon name="book-open" class="h-5 w-5 text-gold-500" />
							All Articles
						</h2>
						<div class="grid gap-4 sm:gap-5 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
							{#each remainingArticles as article, i}
								<ScrollReveal delay={i * 50}>
									<TraderArticleCard {article} trader={trader} />
								</ScrollReveal>
							{/each}
						</div>
					</ScrollReveal>
				{/if}
			{/if}
		</div>
	</section>

	<!-- Back to Trader CTA - MOBILE-FIRST -->
	<section class="border-t border-midnight-800/50">
		<div class="mx-auto max-w-7xl px-4 py-8 sm:py-10 lg:py-12 sm:px-6 lg:px-8">
			<div class="flex flex-col sm:flex-row items-center justify-between gap-4">
				<div class="text-center sm:text-left">
					<p class="text-sm text-midnight-400">Explore more about</p>
					<p class="font-display text-lg sm:text-xl font-bold text-white">{trader.name}</p>
				</div>
				<div class="flex items-center gap-3">
					<a
						href="/traders/{trader.slug}"
						class="inline-flex items-center gap-2 rounded-lg bg-midnight-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-midnight-700 transition-colors"
					>
						<Icon name="user" class="h-4 w-4" />
						View Profile
					</a>
					<a
						href="/traders"
						class="inline-flex items-center gap-2 rounded-lg border border-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/5 transition-colors"
					>
						<Icon name="users" class="h-4 w-4" />
						All Traders
					</a>
				</div>
			</div>
		</div>
	</section>
</div>
