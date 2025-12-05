<script lang="ts">
	import { cn } from '$lib/utils';
	import ScrollReveal from '$lib/components/motion/ScrollReveal.svelte';
	import TraderArticleCard from '$lib/components/TraderArticleCard.svelte';
	import { Icon, type IconName } from '$lib/components/icons';
	import SEO from '$lib/components/SEO.svelte';
	import { PUBLIC_SITE_URL } from '$env/static/public';
	import type { PageData } from './$types';

	// ============================================================================
	// PROPS (Svelte 5 - SSR data hydration)
	// ============================================================================
	let { data }: { data: PageData } = $props();

	// ============================================================================
	// REACTIVE STATE
	// ============================================================================
	let copied = $state(false);

	// ============================================================================
	// DERIVED DATA
	// ============================================================================
	const trader = $derived(data.trader);
	const article = $derived(data.article);
	const relatedArticles = $derived(data.relatedArticles);

	// Category icons mapping
	const categoryIcons: Record<string, IconName> = {
		strategy: 'trending-up',
		psychology: 'brain',
		analysis: 'bar-chart',
		biography: 'user',
		education: 'graduation-cap',
		'market-insights': 'line-chart',
		'book-review': 'book-marked'
	};

	const categoryIcon = $derived<IconName>(
		article.category ? categoryIcons[article.category] || 'tag' : 'tag'
	);

	// Format date
	function formatDate(dateString: string | null): string {
		if (!dateString) return '';
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	// Simple markdown to HTML conversion
	function renderMarkdown(content: string): string {
		if (!content) return '';
		return content
			.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
			.replace(/`([^`]+)`/g, '<code>$1</code>')
			.replace(/^### (.*$)/gim, '<h3>$1</h3>')
			.replace(/^## (.*$)/gim, '<h2>$1</h2>')
			.replace(/^# (.*$)/gim, '<h1>$1</h1>')
			.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
			.replace(/\*(.*?)\*/g, '<em>$1</em>')
			.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
			.replace(/^\- (.*$)/gim, '<li>$1</li>')
			.replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
			.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
			.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" />')
			.replace(/\n\n/g, '</p><p>')
			.replace(/\n/g, '<br />');
	}

	// Share functions
	async function copyLink() {
		try {
			await navigator.clipboard.writeText(window.location.href);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch (e) {
			console.error('Failed to copy link');
		}
	}

	function shareTwitter() {
		const url = encodeURIComponent(window.location.href);
		const text = encodeURIComponent(`${article.title} - ${trader.name}`);
		window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
	}

	// ============================================================================
	// JSON-LD Structured Data (Google Dec 2025 Best Practices)
	// ============================================================================
	const schemaOrg = $derived({
		// Article schema with trader as about entity
		article: {
			"@context": "https://schema.org",
			"@type": "Article",
			"headline": article.title,
			"description": article.seoDescription || article.excerpt || '',
			"image": article.ogImage || article.heroImage || trader.photoUrl,
			"datePublished": article.publishedAt || new Date().toISOString(),
			"dateModified": article.updatedAt || article.publishedAt || new Date().toISOString(),
			"author": {
				"@type": "Organization",
				"name": "Trading Greats"
			},
			"publisher": {
				"@type": "Organization",
				"name": "Trading Greats",
				"logo": {
					"@type": "ImageObject",
					"url": `${PUBLIC_SITE_URL}/favicon.svg`
				}
			},
			"mainEntityOfPage": {
				"@type": "WebPage",
				"@id": `${PUBLIC_SITE_URL}/traders/${trader.slug}/articles/${article.slug}`
			},
			"about": {
				"@type": "Person",
				"name": trader.name,
				"url": `${PUBLIC_SITE_URL}/traders/${trader.slug}`,
				"image": trader.photoUrl,
				"jobTitle": trader.tradingStyle ? `${trader.tradingStyle} Trader` : "Trader"
			},
			"articleSection": article.category || "Trading",
			"keywords": article.tags?.join(', ') || trader.tradingStyle || "trading",
			// Dec 2025: speakable for voice search optimization
			"speakable": {
				"@type": "SpeakableSpecification",
				"cssSelector": ["h1", ".article-excerpt", ".article-content p:first-of-type"]
			}
		},
		// Breadcrumb schema
		breadcrumb: {
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			"itemListElement": [
				{ "@type": "ListItem", "position": 1, "name": "Home", "item": PUBLIC_SITE_URL },
				{ "@type": "ListItem", "position": 2, "name": "Traders", "item": `${PUBLIC_SITE_URL}/traders` },
				{ "@type": "ListItem", "position": 3, "name": trader.name, "item": `${PUBLIC_SITE_URL}/traders/${trader.slug}` },
				{ "@type": "ListItem", "position": 4, "name": "Articles", "item": `${PUBLIC_SITE_URL}/traders/${trader.slug}/articles` },
				{ "@type": "ListItem", "position": 5, "name": article.title, "item": `${PUBLIC_SITE_URL}/traders/${trader.slug}/articles/${article.slug}` }
			]
		}
	});
</script>

<SEO
	title={`${article.seoTitle || article.title} | ${trader.name}`}
	description={article.seoDescription || article.excerpt || `Read about ${article.title} - insights from ${trader.name}'s trading approach.`}
	image={article.ogImage || article.heroImage || trader.photoUrl || undefined}
	type="article"
	publishedTime={article.publishedAt || undefined}
	modifiedTime={article.updatedAt || undefined}
	author={trader.name}
	keywords={article.tags || [trader.name, trader.tradingStyle || 'trading']}
	preloadImage={true}
/>

<svelte:head>
	<!-- Article-specific meta tags -->
	<meta property="og:type" content="article" />
	{#if article.publishedAt}
		<meta property="article:published_time" content={article.publishedAt} />
	{/if}
	{#if article.updatedAt}
		<meta property="article:modified_time" content={article.updatedAt} />
	{/if}
	<meta property="article:author" content={trader.name} />
	{#if article.category}
		<meta property="article:section" content={article.category} />
	{/if}
	{#if article.tags}
		{#each article.tags as tag}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}

	<!-- JSON-LD Structured Data -->
	{@html `<script type="application/ld+json">${JSON.stringify(schemaOrg.article)}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(schemaOrg.breadcrumb)}</script>`}
</svelte:head>

<div class="min-h-screen bg-midnight-950">
	<!-- Hero Section - MOBILE-FIRST -->
	<section class="relative overflow-hidden">
		<!-- Background -->
		{#if article.heroImage}
			<div class="absolute inset-0 h-[50vh] sm:h-[55vh] lg:h-[60vh] min-h-[350px]">
				<img
					src={article.heroImage}
					alt={article.heroImageAlt || article.title}
					class="h-full w-full object-cover"
				/>
				<div class="absolute inset-0 bg-gradient-to-t from-midnight-950 via-midnight-950/80 to-midnight-950/40"></div>
			</div>
		{:else}
			<div class="absolute inset-0 h-[35vh] sm:h-[40vh] min-h-[280px]">
				<div class="absolute inset-0 bg-gradient-to-br from-midnight-900 via-midnight-950 to-midnight-900"></div>
				<div class="absolute top-0 left-1/4 h-48 w-48 sm:h-72 sm:w-72 rounded-full bg-gold-500/5 blur-3xl"></div>
				<div class="absolute bottom-0 right-1/4 h-48 w-48 sm:h-72 sm:w-72 rounded-full bg-gold-500/5 blur-3xl"></div>
			</div>
		{/if}

		<div class="relative mx-auto max-w-4xl px-4 pt-20 sm:pt-24 lg:pt-32 pb-10 sm:pb-12 sm:px-6 lg:px-8">
			<ScrollReveal>
				<!-- Breadcrumbs - MOBILE-FIRST -->
				<nav class="mb-5 sm:mb-6 flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-midnight-400">
					<a href="/traders/{trader.slug}" class="hover:text-gold-400 transition-colors flex items-center gap-1">
						<Icon name="arrow-left" class="h-3.5 w-3.5" />
						{trader.name}
					</a>
					<Icon name="chevron-right" class="h-3 w-3" />
					<a href="/traders/{trader.slug}/articles" class="hover:text-gold-400 transition-colors">Articles</a>
				</nav>

				<!-- Meta badges -->
				<div class="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
					{#if article.category}
						<span class="inline-flex items-center gap-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 px-2.5 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium text-gold-400">
							<Icon name={categoryIcon} class="h-3 w-3 sm:h-3.5 sm:w-3.5" />
							{article.category.replace('-', ' ')}
						</span>
					{/if}
					{#if article.publishedAt}
						<span class="flex items-center gap-1.5 text-xs sm:text-sm text-midnight-400">
							<Icon name="calendar" class="h-3.5 w-3.5" />
							{formatDate(article.publishedAt)}
						</span>
					{/if}
					{#if article.readingTime}
						<span class="flex items-center gap-1.5 text-xs sm:text-sm text-midnight-400">
							<Icon name="clock" class="h-3.5 w-3.5" />
							{article.readingTime} min read
						</span>
					{/if}
				</div>

				<!-- Title -->
				<h1 class="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
					{article.title}
				</h1>

				<!-- Excerpt -->
				{#if article.excerpt}
					<p class="article-excerpt mt-4 sm:mt-5 text-base sm:text-lg lg:text-xl text-midnight-300 leading-relaxed">
						{article.excerpt}
					</p>
				{/if}

				<!-- Author/Trader & Share row -->
				<div class="mt-6 sm:mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 sm:pt-8 border-t border-midnight-800/50">
					<!-- Trader attribution -->
					<a href="/traders/{trader.slug}" class="group flex items-center gap-3">
						{#if trader.photoUrl}
							<img
								src={trader.photoUrl}
								alt={trader.name}
								class="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover border-2 border-gold-500/30 group-hover:border-gold-500/60 transition-colors"
							/>
						{:else}
							<div class="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
								<Icon name="user" class="h-5 w-5 text-midnight-950" />
							</div>
						{/if}
						<div>
							<p class="text-sm sm:text-base font-medium text-white group-hover:text-gold-400 transition-colors">
								{trader.name}
							</p>
							<p class="text-xs sm:text-sm text-midnight-500">{trader.tradingStyle || 'Trading Legend'}</p>
						</div>
					</a>

					<!-- Share buttons -->
					<div class="flex items-center gap-1 sm:gap-2">
						<span class="text-xs sm:text-sm text-midnight-500 mr-1 sm:mr-2">Share:</span>
						<button
							type="button"
							onclick={shareTwitter}
							class="rounded-lg p-2 sm:p-2.5 text-midnight-400 hover:bg-midnight-800 hover:text-white transition-colors active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"
							aria-label="Share on Twitter"
						>
							<Icon name="twitter" class="h-5 w-5" />
						</button>
						<button
							type="button"
							onclick={copyLink}
							class="rounded-lg p-2 sm:p-2.5 text-midnight-400 hover:bg-midnight-800 hover:text-white transition-colors active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"
							aria-label="Copy link"
						>
							{#if copied}
								<Icon name="check" class="h-5 w-5 text-green-400" />
							{:else}
								<Icon name="external-link" class="h-5 w-5" />
							{/if}
						</button>
					</div>
				</div>
			</ScrollReveal>
		</div>
	</section>

	<!-- Content - MOBILE-FIRST -->
	<article class="relative">
		<div class="mx-auto max-w-4xl px-4 py-8 sm:py-10 lg:py-12 sm:px-6 lg:px-8">
			<ScrollReveal>
				<!-- Hero Image Caption -->
				{#if article.heroImage && article.heroImageCaption}
					<p class="mb-8 sm:mb-10 text-center text-xs sm:text-sm text-midnight-500 italic">
						{article.heroImageCaption}
					</p>
				{/if}

				<!-- Main Content -->
				<div
					class="article-content prose prose-invert prose-sm sm:prose-base lg:prose-lg max-w-none
						prose-headings:font-display prose-headings:text-white prose-headings:font-bold
						prose-h1:text-xl prose-h1:sm:text-2xl prose-h1:lg:text-3xl prose-h1:mt-8 prose-h1:mb-4
						prose-h2:text-lg prose-h2:sm:text-xl prose-h2:lg:text-2xl prose-h2:mt-6 prose-h2:mb-3 prose-h2:text-gold-400
						prose-h3:text-base prose-h3:sm:text-lg prose-h3:lg:text-xl prose-h3:mt-5 prose-h3:mb-2
						prose-p:text-midnight-200 prose-p:leading-relaxed
						prose-a:text-gold-400 prose-a:no-underline hover:prose-a:text-gold-300 hover:prose-a:underline
						prose-strong:text-white prose-strong:font-semibold
						prose-em:text-midnight-300
						prose-blockquote:border-l-gold-500 prose-blockquote:bg-midnight-900/50 prose-blockquote:py-3 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:text-midnight-200 prose-blockquote:not-italic
						prose-code:text-gold-400 prose-code:bg-midnight-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-[''] prose-code:after:content-['']
						prose-pre:bg-midnight-900 prose-pre:border prose-pre:border-midnight-800 prose-pre:rounded-xl
						prose-img:rounded-xl prose-img:my-6
						prose-ul:text-midnight-200 prose-ol:text-midnight-200
						prose-li:marker:text-gold-500"
				>
					{@html renderMarkdown(article.content || '')}
				</div>

				<!-- Tags -->
				{#if article.tags && article.tags.length > 0}
					<div class="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-midnight-800/50">
						<div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
							<Icon name="tag" class="h-3.5 w-3.5 sm:h-4 sm:w-4 text-midnight-500" />
							{#each article.tags as tag}
								<span class="rounded-full bg-midnight-800 px-2.5 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm text-midnight-300">
									{tag}
								</span>
							{/each}
						</div>
					</div>
				{/if}
			</ScrollReveal>
		</div>
	</article>

	<!-- Related Articles - MOBILE-FIRST -->
	{#if relatedArticles.length > 0}
		<section class="border-t border-midnight-800/50 bg-midnight-900/30">
			<div class="mx-auto max-w-7xl px-4 py-10 sm:py-12 lg:py-16 sm:px-6 lg:px-8">
				<ScrollReveal>
					<h2 class="font-display text-xl sm:text-2xl font-bold text-white mb-5 sm:mb-6 flex items-center gap-2">
						<Icon name="book-open" class="h-5 w-5 sm:h-6 sm:w-6 text-gold-500" />
						More from {trader.name}
					</h2>

					<div class="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
						{#each relatedArticles as relatedArticle, i}
							<ScrollReveal delay={i * 75}>
								<TraderArticleCard article={relatedArticle} {trader} />
							</ScrollReveal>
						{/each}
					</div>
				</ScrollReveal>
			</div>
		</section>
	{/if}

	<!-- Back to Trader CTA - MOBILE-FIRST -->
	<section class="border-t border-midnight-800/50">
		<div class="mx-auto max-w-7xl px-4 py-8 sm:py-10 lg:py-12 sm:px-6 lg:px-8">
			<div class="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
				<a
					href="/traders/{trader.slug}/articles"
					class="inline-flex items-center gap-2 rounded-lg bg-midnight-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-midnight-700 transition-colors"
				>
					<Icon name="arrow-left" class="h-4 w-4" />
					All {trader.name} Articles
				</a>
				<a
					href="/traders/{trader.slug}"
					class="inline-flex items-center gap-2 rounded-lg border border-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/5 transition-colors"
				>
					<Icon name="user" class="h-4 w-4" />
					View {trader.name}'s Profile
				</a>
			</div>
		</div>
	</section>
</div>
