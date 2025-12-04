<script lang="ts">
	import { cn } from '$lib/utils';
	import ScrollReveal from '$lib/components/motion/ScrollReveal.svelte';
	import { Icon, type IconName } from '$lib/components/icons';
	import SEO from '$lib/components/SEO.svelte';
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
	// CATEGORY ICONS
	// ============================================================================
	const categoryIcons: Record<string, IconName> = {
		strategy: 'trending-up',
		psychology: 'brain',
		analysis: 'bar-chart',
		biography: 'user',
		education: 'graduation-cap',
		'market-insights': 'line-chart',
		'book-review': 'book-marked'
	};

	function formatDate(dateString: string | null): string {
		if (!dateString) return '';
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function getCategoryLabel(value: string | null): string {
		if (!value) return '';
		const cat = data.categories.find((c) => c.value === value);
		return cat?.label || value;
	}

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
		const text = encodeURIComponent(data.post.title);
		window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
	}

	function shareLinkedIn() {
		const url = encodeURIComponent(window.location.href);
		window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
	}

	// Simple markdown to HTML conversion for content
	function renderMarkdown(content: string): string {
		if (!content) return '';

		return (
			content
				// Code blocks
				.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
				// Inline code
				.replace(/`([^`]+)`/g, '<code>$1</code>')
				// Headers
				.replace(/^### (.*$)/gim, '<h3>$1</h3>')
				.replace(/^## (.*$)/gim, '<h2>$1</h2>')
				.replace(/^# (.*$)/gim, '<h1>$1</h1>')
				// Bold
				.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
				// Italic
				.replace(/\*(.*?)\*/g, '<em>$1</em>')
				// Blockquotes
				.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
				// Unordered lists
				.replace(/^\- (.*$)/gim, '<li>$1</li>')
				// Ordered lists
				.replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
				// Links
				.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
				// Images
				.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" />')
				// Paragraphs
				.replace(/\n\n/g, '</p><p>')
				// Line breaks
				.replace(/\n/g, '<br />')
		);
	}

	const categoryIcon = $derived<IconName>(
		data.post.category ? categoryIcons[data.post.category] || 'tag' : 'tag'
	);

	// ============================================================================
	// JSON-LD STRUCTURED DATA (Dec 2025 SEO Best Practices)
	// ============================================================================
	const schemaOrg = $derived({
		article: {
			"@context": "https://schema.org",
			"@type": "Article",
			"headline": data.post.title,
			"description": data.post.seoDescription || data.post.excerpt || '',
			"image": data.post.ogImage || data.post.heroImage || "https://tradinggreats.com/favicon.svg",
			"datePublished": data.post.publishedAt || new Date().toISOString(),
			"dateModified": data.post.updatedAt || data.post.publishedAt || new Date().toISOString(),
			"author": {
				"@type": "Person",
				"name": data.post.author || "Trading Greats Team"
			},
			"publisher": {
				"@type": "Organization",
				"name": "Trading Greats",
				"logo": {
					"@type": "ImageObject",
					"url": "https://tradinggreats.com/favicon.svg"
				}
			},
			"mainEntityOfPage": {
				"@type": "WebPage",
				"@id": `https://tradinggreats.com/blog/${data.post.slug}`
			},
			"articleSection": data.post.category ? getCategoryLabel(data.post.category) : "Trading",
			"keywords": data.post.tags?.join(', ') || "trading, investing, finance"
		},
		breadcrumb: {
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			"itemListElement": [
				{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://tradinggreats.com" },
				{ "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://tradinggreats.com/blog" },
				{ "@type": "ListItem", "position": 3, "name": data.post.title, "item": `https://tradinggreats.com/blog/${data.post.slug}` }
			]
		}
	});
</script>

<SEO
	title={`${data.post.seoTitle || data.post.title} | Trading Greats`}
	description={data.post.seoDescription || data.post.excerpt || `Read ${data.post.title} on Trading Greats`}
	image={data.post.ogImage || data.post.heroImage || undefined}
	keywords={data.post.tags || ['trading', 'investing', 'finance']}
/>

<svelte:head>
	<!-- Article-specific meta tags -->
	<meta property="og:type" content="article" />
	{#if data.post.publishedAt}
		<meta property="article:published_time" content={data.post.publishedAt} />
	{/if}
	{#if data.post.updatedAt}
		<meta property="article:modified_time" content={data.post.updatedAt} />
	{/if}
	{#if data.post.author}
		<meta property="article:author" content={data.post.author} />
	{/if}
	{#if data.post.category}
		<meta property="article:section" content={getCategoryLabel(data.post.category)} />
	{/if}
	{#if data.post.tags}
		{#each data.post.tags as tag}
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
		<!-- Background - MOBILE-FIRST -->
		{#if data.post.heroImage}
			<div class="absolute inset-0 h-[50vh] sm:h-[55vh] lg:h-[60vh] min-h-[350px] sm:min-h-[400px] lg:min-h-[500px]">
				<img
					src={data.post.heroImage}
					alt={data.post.heroImageAlt || data.post.title}
					class="h-full w-full object-cover"
				/>
				<div class="absolute inset-0 bg-gradient-to-t from-midnight-950 via-midnight-950/80 to-midnight-950/40"></div>
			</div>
		{:else}
			<div class="absolute inset-0 h-[35vh] sm:h-[38vh] lg:h-[40vh] min-h-[280px] sm:min-h-[320px] lg:min-h-[400px]">
				<div class="absolute inset-0 bg-gradient-to-br from-midnight-900 via-midnight-950 to-midnight-900"></div>
				<div class="absolute top-0 left-1/4 h-48 w-48 sm:h-72 sm:w-72 lg:h-96 lg:w-96 rounded-full bg-gold-500/5 blur-3xl"></div>
				<div class="absolute bottom-0 right-1/4 h-48 w-48 sm:h-72 sm:w-72 lg:h-96 lg:w-96 rounded-full bg-gold-500/5 blur-3xl"></div>
			</div>
		{/if}

		<div class="relative mx-auto max-w-4xl px-4 pt-20 sm:pt-24 lg:pt-32 pb-10 sm:pb-12 lg:pb-16 sm:px-6 lg:px-8">
			<ScrollReveal>
				<!-- Breadcrumb - MOBILE-FIRST -->
				<nav class="mb-5 sm:mb-6 lg:mb-8">
					<a
						href="/blog"
						class="inline-flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base text-midnight-400 hover:text-white transition-colors active:scale-95"
					>
						<Icon name="arrow-left" class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
						Back to Blog
					</a>
				</nav>

				<!-- Meta - MOBILE-FIRST -->
				<div class="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-5 lg:mb-6">
					{#if data.post.category}
						<a
							href="/blog?category={data.post.category}"
							class="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 px-2.5 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium text-gold-400 hover:bg-gold-500/20 transition-colors active:scale-95"
						>
							<Icon name={categoryIcon} class="h-3 w-3 sm:h-3.5 sm:w-3.5" />
							{getCategoryLabel(data.post.category)}
						</a>
					{/if}
					{#if data.post.publishedAt}
						<span class="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-midnight-400">
							<Icon name="calendar" class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
							{formatDate(data.post.publishedAt)}
						</span>
					{/if}
					{#if data.post.readingTime}
						<span class="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-midnight-400">
							<Icon name="clock" class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
							{data.post.readingTime} min read
						</span>
					{/if}
				</div>

				<!-- Title - MOBILE-FIRST -->
				<h1 class="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
					{data.post.title}
				</h1>

				<!-- Excerpt - MOBILE-FIRST -->
				{#if data.post.excerpt}
					<p class="mt-4 sm:mt-5 lg:mt-6 text-base sm:text-lg lg:text-xl text-midnight-300 leading-relaxed">
						{data.post.excerpt}
					</p>
				{/if}

				<!-- Author & Share - MOBILE-FIRST -->
				<div class="mt-6 sm:mt-7 lg:mt-8 flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-4 pt-6 sm:pt-7 lg:pt-8 border-t border-midnight-800/50">
					{#if data.post.author}
						<div class="flex items-center gap-2.5 sm:gap-3">
							<div class="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
								<Icon name="user" class="h-4 w-4 sm:h-5 sm:w-5 text-midnight-950" />
							</div>
							<div>
								<p class="text-sm sm:text-base font-medium text-white">{data.post.author}</p>
								<p class="text-xs sm:text-sm text-midnight-500">Author</p>
							</div>
						</div>
					{/if}

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
							onclick={shareLinkedIn}
							class="rounded-lg p-2 sm:p-2.5 text-midnight-400 hover:bg-midnight-800 hover:text-white transition-colors active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"
							aria-label="Share on LinkedIn"
						>
							<Icon name="share" class="h-5 w-5" />
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
				<!-- Hero Image Caption - MOBILE-FIRST -->
				{#if data.post.heroImage && data.post.heroImageCaption}
					<p class="mb-8 sm:mb-10 lg:mb-12 text-center text-xs sm:text-sm text-midnight-500 italic">
						{data.post.heroImageCaption}
					</p>
				{/if}

				<!-- Main Content - MOBILE-FIRST: Responsive prose -->
				<div
					class="prose prose-invert prose-sm sm:prose-base lg:prose-lg max-w-none
						prose-headings:font-display prose-headings:text-white prose-headings:font-bold
						prose-h1:text-xl prose-h1:sm:text-2xl prose-h1:lg:text-3xl prose-h1:mt-8 prose-h1:sm:mt-10 prose-h1:lg:mt-12 prose-h1:mb-4 prose-h1:sm:mb-5 prose-h1:lg:mb-6
						prose-h2:text-lg prose-h2:sm:text-xl prose-h2:lg:text-2xl prose-h2:mt-6 prose-h2:sm:mt-8 prose-h2:lg:mt-10 prose-h2:mb-3 prose-h2:sm:mb-4 prose-h2:text-gold-400
						prose-h3:text-base prose-h3:sm:text-lg prose-h3:lg:text-xl prose-h3:mt-5 prose-h3:sm:mt-6 prose-h3:lg:mt-8 prose-h3:mb-2 prose-h3:sm:mb-3
						prose-p:text-midnight-200 prose-p:leading-relaxed
						prose-a:text-gold-400 prose-a:no-underline hover:prose-a:text-gold-300 hover:prose-a:underline
						prose-strong:text-white prose-strong:font-semibold
						prose-em:text-midnight-300
						prose-blockquote:border-l-gold-500 prose-blockquote:bg-midnight-900/50 prose-blockquote:py-3 prose-blockquote:sm:py-4 prose-blockquote:px-4 prose-blockquote:sm:px-6 prose-blockquote:rounded-r-lg prose-blockquote:sm:rounded-r-xl prose-blockquote:text-midnight-200 prose-blockquote:not-italic
						prose-code:text-gold-400 prose-code:bg-midnight-800 prose-code:px-1 prose-code:sm:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-xs prose-code:sm:text-sm prose-code:before:content-[''] prose-code:after:content-['']
						prose-pre:bg-midnight-900 prose-pre:border prose-pre:border-midnight-800 prose-pre:rounded-lg prose-pre:sm:rounded-xl prose-pre:overflow-x-auto
						prose-img:rounded-lg prose-img:sm:rounded-xl prose-img:my-6 prose-img:sm:my-8
						prose-ul:text-midnight-200 prose-ol:text-midnight-200
						prose-li:marker:text-gold-500"
				>
					{@html renderMarkdown(data.post.content || '')}
				</div>

				<!-- Tags - MOBILE-FIRST -->
				{#if data.post.tags && data.post.tags.length > 0}
					<div class="mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-7 lg:pt-8 border-t border-midnight-800/50">
						<div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
							<Icon name="tag" class="h-3.5 w-3.5 sm:h-4 sm:w-4 text-midnight-500" />
							{#each data.post.tags as tag}
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

	<!-- Related Posts - MOBILE-FIRST -->
	{#if data.relatedPosts.length > 0}
		<section class="border-t border-midnight-800/50 bg-midnight-900/30">
			<div class="mx-auto max-w-7xl px-4 py-10 sm:py-12 lg:py-16 sm:px-6 lg:px-8">
				<ScrollReveal>
					<h2 class="font-display text-xl sm:text-2xl font-bold text-white mb-5 sm:mb-6 lg:mb-8">
						Continue Reading
					</h2>

					<div class="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
						{#each data.relatedPosts as post, i}
							<ScrollReveal delay={i * 75}>
								<a
									href="/blog/{post.slug}"
									class="group flex flex-col overflow-hidden rounded-xl sm:rounded-2xl border border-midnight-800/50 bg-midnight-950/50 transition-all duration-300 hover:border-gold-500/30 hover:bg-midnight-800/50 md:hover:-translate-y-1 active:scale-[0.98]"
								>
									{#if post.heroImage}
										<div class="relative aspect-[16/9] sm:aspect-[16/10] overflow-hidden">
											<img
												src={post.heroImage}
												alt={post.heroImageAlt || post.title}
												class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
												loading="lazy"
											/>
											<div class="absolute inset-0 bg-gradient-to-t from-midnight-950/60 to-transparent"></div>
										</div>
									{:else}
										<div class="relative aspect-[16/9] sm:aspect-[16/10] bg-midnight-800 flex items-center justify-center">
											<Icon name="book-open" class="h-10 w-10 sm:h-12 sm:w-12 text-midnight-600" />
										</div>
									{/if}

									<div class="flex flex-1 flex-col p-4 sm:p-5 lg:p-6">
										<h3 class="font-display text-base sm:text-lg font-bold text-white group-hover:text-gold-400 transition-colors line-clamp-2">
											{post.title}
										</h3>

										<div class="mt-3 sm:mt-4 flex items-center justify-between text-[10px] sm:text-xs text-midnight-500">
											<span class="flex items-center gap-1">
												<Icon name="clock" class="h-3 w-3" />
												{post.readingTime} min read
											</span>
											<Icon name="arrow-right" class="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gold-500 opacity-100 sm:opacity-0 sm:-translate-x-2 sm:group-hover:opacity-100 sm:group-hover:translate-x-0 transition-all" />
										</div>
									</div>
								</a>
							</ScrollReveal>
						{/each}
					</div>
				</ScrollReveal>
			</div>
		</section>
	{/if}

	<!-- Back to Blog CTA - MOBILE-FIRST -->
	<section class="border-t border-midnight-800/50">
		<div class="mx-auto max-w-7xl px-4 py-8 sm:py-10 lg:py-12 sm:px-6 lg:px-8">
			<div class="flex items-center justify-center">
				<a
					href="/blog"
					class="inline-flex items-center justify-center gap-2 rounded-lg sm:rounded-xl bg-midnight-800 px-5 sm:px-6 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-white hover:bg-midnight-700 transition-colors active:scale-95 min-h-[44px]"
				>
					<Icon name="arrow-left" class="h-4 w-4 sm:h-5 sm:w-5" />
					Back to All Posts
				</a>
			</div>
		</div>
	</section>
</div>
