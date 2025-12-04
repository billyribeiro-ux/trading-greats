<script lang="ts">
	import { cn } from '$lib/utils';
	import { ScrollReveal } from '$lib/components/motion';
	import { Icon, type IconName } from '$lib/components/icons';
	import SEO from '$lib/components/SEO.svelte';
	import type { PageData } from './$types';

	// ============================================================================
	// PROPS (Svelte 5 - SSR data hydration)
	// ============================================================================
	let { data }: { data: PageData } = $props();

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

	// ============================================================================
	// HELPER FUNCTIONS
	// ============================================================================
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
		const cat = data.categories.find(c => c.value === value);
		return cat?.label || value;
	}

	function getCategoryIcon(category: string | null): IconName {
		if (!category) return 'tag';
		return categoryIcons[category] || 'tag';
	}

	// ============================================================================
	// JSON-LD STRUCTURED DATA (Dec 2025 SEO Best Practices)
	// ============================================================================
	const schemaOrg = $derived({
		blog: {
			"@context": "https://schema.org",
			"@type": "Blog",
			"name": "Trading Greats Blog",
			"description": data.meta.description,
			"url": "https://tradinggreats.com/blog",
			"publisher": {
				"@type": "Organization",
				"name": "Trading Greats",
				"logo": "https://tradinggreats.com/favicon.svg"
			}
		},
		itemList: {
			"@context": "https://schema.org",
			"@type": "ItemList",
			"name": "Trading Greats Blog Articles",
			"description": "Expert trading insights and strategies from legendary traders",
			"numberOfItems": data.posts.length + (data.featuredPost ? 1 : 0),
			"itemListElement": [
				...(data.featuredPost ? [{
					"@type": "ListItem",
					"position": 1,
					"name": data.featuredPost.title,
					"url": `https://tradinggreats.com/blog/${data.featuredPost.slug}`
				}] : []),
				...data.posts.map((post, i) => ({
					"@type": "ListItem",
					"position": (data.featuredPost ? 2 : 1) + i,
					"name": post.title,
					"url": `https://tradinggreats.com/blog/${post.slug}`
				}))
			]
		},
		breadcrumb: {
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			"itemListElement": [
				{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://tradinggreats.com" },
				{ "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://tradinggreats.com/blog" }
			]
		}
	});
</script>

<SEO
	title={data.meta.title}
	description={data.meta.description}
	keywords={['trading blog', 'trading strategies', 'market psychology', 'trading education', 'legendary traders', 'investment insights', 'trading analysis']}
/>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(schemaOrg.blog)}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(schemaOrg.itemList)}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(schemaOrg.breadcrumb)}</script>`}
</svelte:head>

<div class="min-h-screen bg-midnight-950">
	<!-- ============================================================================
	     HERO SECTION - Apple-style dramatic entrance
	============================================================================ -->
	<section class="relative overflow-hidden border-b border-midnight-800/50">
		<!-- Animated Background -->
		<div class="absolute inset-0">
			<div class="absolute inset-0 bg-gradient-to-br from-midnight-900 via-midnight-950 to-midnight-900"></div>
			<!-- Animated gradient orbs -->
			<div class="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-gradient-radial from-gold-500/15 via-gold-500/5 to-transparent blur-3xl animate-pulse-slower"></div>
			<div class="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-gradient-radial from-violet-500/10 via-violet-500/5 to-transparent blur-3xl animate-pulse-slow" style="animation-delay: 2s;"></div>
			<!-- Grid overlay -->
			<div class="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_50%,transparent_100%)]"></div>
		</div>

		<div class="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
			<div class="text-center max-w-4xl mx-auto">
				<!-- Badge with cinematic entrance -->
				<div 
					class="inline-flex items-center gap-2.5 rounded-full border border-gold-500/30 bg-gold-500/10 px-5 py-2 mb-8 backdrop-blur-sm opacity-0 animate-hero-fade"
					style="animation-delay: 100ms;"
				>
					<Icon name="book-open" class="h-4 w-4 text-gold-400" />
					<span class="text-sm font-semibold tracking-wide text-gold-300">Trading Insights</span>
				</div>

				<!-- Main heading with dramatic slide -->
				<h1 
					class="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight opacity-0 animate-hero-slide"
					style="animation-delay: 200ms;"
				>
					<span class="text-white">Learn from the</span>
					<br />
					<span class="relative inline-block">
						<span class="bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 bg-clip-text text-transparent">
							Legends
						</span>
						<!-- Animated underline -->
						<span class="absolute -bottom-2 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-0 animate-fade-in" style="animation-delay: 1s;"></span>
					</span>
				</h1>

				<p 
					class="mt-8 text-lg sm:text-xl text-midnight-300 max-w-2xl mx-auto leading-relaxed opacity-0 animate-hero-fade"
					style="animation-delay: 400ms;"
				>
					Dive deep into trading strategies, market psychology, and timeless wisdom from the world's
					greatest traders. <span class="text-white">Expert analysis for serious investors.</span>
				</p>
			</div>

			<!-- Category Filter with staggered entrance -->
			<div 
				class="mt-14 flex flex-wrap items-center justify-center gap-3 opacity-0 animate-hero-fade"
				style="animation-delay: 600ms;"
			>
				<a
					href="/blog"
					class={cn(
						'group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300',
						!data.currentCategory
							? 'bg-gradient-to-r from-gold-500 to-gold-600 text-midnight-950 shadow-lg shadow-gold-500/25'
							: 'bg-white/5 text-midnight-300 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'
					)}
				>
					<Icon name="filter" class="h-4 w-4" />
					All Posts
				</a>
				{#each data.categories as cat, i}
					<a
						href="/blog?category={cat.value}"
						class={cn(
							'group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300',
							data.currentCategory === cat.value
								? 'bg-gradient-to-r from-gold-500 to-gold-600 text-midnight-950 shadow-lg shadow-gold-500/25'
								: 'bg-white/5 text-midnight-300 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'
						)}
						style="animation-delay: {650 + i * 50}ms;"
					>
						<Icon name={getCategoryIcon(cat.value)} class="h-4 w-4" />
						{cat.label}
					</a>
				{/each}
			</div>
		</div>
	</section>

	<!-- ============================================================================
	     FEATURED POST - Netflix-style hero card
	============================================================================ -->
	{#if data.featuredPost && !data.currentCategory}
		<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
			<ScrollReveal animation="slideUp" duration={800}>
				<a
					href="/blog/{data.featuredPost.slug}"
					class="group relative block overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-midnight-900/80 to-midnight-900/40 backdrop-blur-sm transition-all duration-700 hover:border-gold-500/30 hover:shadow-2xl hover:shadow-gold-500/10"
				>
					<!-- Hover glow effect -->
					<div class="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

					<div class="grid lg:grid-cols-2 gap-0">
						<!-- Image with parallax-like zoom -->
						{#if data.featuredPost.heroImage}
							<div class="relative aspect-[16/10] lg:aspect-auto lg:min-h-[500px] overflow-hidden">
								<img
									src={data.featuredPost.heroImage}
									alt={data.featuredPost.heroImageAlt || data.featuredPost.title}
									class="h-full w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
								/>
								<!-- Gradient overlays -->
								<div class="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-midnight-950/95 hidden lg:block"></div>
								<div class="absolute inset-0 bg-gradient-to-t from-midnight-950/90 via-midnight-950/20 to-transparent lg:hidden"></div>
								
								<!-- Featured badge -->
								<div class="absolute top-6 left-6">
									<span class="inline-flex items-center gap-2 rounded-full bg-gold-500 px-4 py-1.5 text-xs font-bold text-midnight-950 shadow-lg shadow-gold-500/30">
										<Icon name="sparkles" class="h-3.5 w-3.5" />
										Featured Article
									</span>
								</div>
							</div>
						{/if}

						<!-- Content with cinematic entrance on hover -->
						<div class="relative p-8 lg:p-12 xl:p-16 flex flex-col justify-center">
							<!-- Ambient glow -->
							<div class="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-[100px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

							<div class="relative z-10">
								{#if data.featuredPost.category}
									<span class="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs font-medium text-midnight-300 mb-6">
										<Icon name={getCategoryIcon(data.featuredPost.category)} class="h-3.5 w-3.5 text-gold-500" />
										{getCategoryLabel(data.featuredPost.category)}
									</span>
								{/if}

								<h2 class="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.1] transition-colors duration-300 group-hover:text-gold-400">
									{data.featuredPost.title}
								</h2>

								{#if data.featuredPost.excerpt}
									<p class="mt-6 text-lg text-midnight-300 line-clamp-3 leading-relaxed">
										{data.featuredPost.excerpt}
									</p>
								{/if}

								<div class="mt-8 flex items-center gap-6 text-sm text-midnight-400">
									{#if data.featuredPost.publishedAt}
										<span class="flex items-center gap-2">
											<Icon name="calendar" class="h-4 w-4 text-gold-500/70" />
											{formatDate(data.featuredPost.publishedAt)}
										</span>
									{/if}
									{#if data.featuredPost.readingTime}
										<span class="flex items-center gap-2">
											<Icon name="clock" class="h-4 w-4 text-gold-500/70" />
											{data.featuredPost.readingTime} min read
										</span>
									{/if}
								</div>

								<!-- CTA with arrow animation -->
								<div class="mt-10">
									<span class="inline-flex items-center gap-3 text-gold-400 font-bold text-lg transition-all duration-300 group-hover:gap-5">
										Read Full Article
										<Icon name="arrow-right" class="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
									</span>
								</div>
							</div>
						</div>
					</div>
				</a>
			</ScrollReveal>
		</section>
	{/if}

	<!-- ============================================================================
	     POSTS GRID - Cinematic card animations
	============================================================================ -->
	<section class="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
		{#if data.posts.length > 0}
			<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
				{#each data.posts as post, i}
					<ScrollReveal delay={i * 100} animation="slideUp">
						<a
							href="/blog/{post.slug}"
							class="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-b from-midnight-900/60 to-midnight-900/30 backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:border-gold-500/30 hover:shadow-2xl hover:shadow-gold-500/10"
						>
							<!-- Hover glow effect -->
							<div class="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"></div>

							<!-- Image with zoom effect -->
							{#if post.heroImage}
								<div class="relative aspect-[16/10] overflow-hidden">
									<img
										src={post.heroImage}
										alt={post.heroImageAlt || post.title}
										class="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
										loading="lazy"
									/>
									<!-- Gradient overlay -->
									<div class="absolute inset-0 bg-gradient-to-t from-midnight-950/80 via-midnight-950/20 to-transparent"></div>

									<!-- Category badge -->
									{#if post.category}
										<div class="absolute top-4 left-4">
											<span class="inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-white border border-white/10 shadow-lg">
												<Icon name={getCategoryIcon(post.category)} class="h-3 w-3 text-gold-400" />
												{getCategoryLabel(post.category)}
											</span>
										</div>
									{/if}
								</div>
							{:else}
								<div class="relative aspect-[16/10] bg-gradient-to-br from-midnight-800 to-midnight-900 flex items-center justify-center">
									<Icon name="book-open" class="h-16 w-16 text-midnight-700 transition-transform duration-500 group-hover:scale-110" />
									{#if post.category}
										<div class="absolute top-4 left-4">
											<span class="inline-flex items-center gap-1.5 rounded-full bg-midnight-700/80 px-3 py-1.5 text-xs font-medium text-midnight-300">
												<Icon name={getCategoryIcon(post.category)} class="h-3 w-3" />
												{getCategoryLabel(post.category)}
											</span>
										</div>
									{/if}
								</div>
							{/if}

							<!-- Content -->
							<div class="relative flex flex-1 flex-col p-6">
								<!-- Subtle glow on hover -->
								<div class="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gold-500/5 blur-3xl transition-all duration-500 group-hover:bg-gold-500/10"></div>

								<h3 class="relative z-10 font-display text-xl font-bold text-white transition-colors duration-300 group-hover:text-gold-400 line-clamp-2">
									{post.title}
								</h3>

								{#if post.excerpt}
									<p class="relative z-10 mt-3 text-sm text-midnight-400 line-clamp-2 flex-1 leading-relaxed">
										{post.excerpt}
									</p>
								{/if}

								<div class="relative z-10 mt-5 flex items-center justify-between text-xs text-midnight-500">
									<div class="flex items-center gap-4">
										{#if post.publishedAt}
											<span class="flex items-center gap-1.5">
												<Icon name="calendar" class="h-3.5 w-3.5" />
												{formatDate(post.publishedAt)}
											</span>
										{/if}
										{#if post.readingTime}
											<span class="flex items-center gap-1.5">
												<Icon name="clock" class="h-3.5 w-3.5" />
												{post.readingTime} min
											</span>
										{/if}
									</div>
									
									<!-- Arrow indicator -->
									<Icon name="arrow-right" class="h-4 w-4 text-gold-500 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
								</div>
							</div>
						</a>
					</ScrollReveal>
				{/each}
			</div>
		{:else}
			<ScrollReveal>
				<div class="text-center py-24">
					<div class="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-midnight-800 to-midnight-900 flex items-center justify-center mb-6 border border-white/5">
						<Icon name="book-open" class="h-12 w-12 text-midnight-600" />
					</div>
					<h2 class="font-display text-3xl font-bold text-white">No Posts Yet</h2>
					<p class="mt-4 text-midnight-400 max-w-md mx-auto">
						{#if data.currentCategory}
							No posts found in this category. Check back soon!
						{:else}
							We're working on bringing you great content. Stay tuned!
						{/if}
					</p>
					{#if data.currentCategory}
						<a
							href="/blog"
							class="mt-8 inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 font-semibold transition-colors"
						>
							<Icon name="arrow-left" class="h-4 w-4" />
							View all posts
						</a>
					{/if}
				</div>
			</ScrollReveal>
		{/if}
	</section>

	<!-- ============================================================================
	     NEWSLETTER CTA - Premium section
	============================================================================ -->
	<section class="relative border-t border-midnight-800/50 overflow-hidden">
		<!-- Background effects -->
		<div class="absolute inset-0 bg-gradient-to-b from-midnight-900/50 to-midnight-950"></div>
		<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold-500/5 blur-[150px]"></div>

		<div class="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
			<ScrollReveal animation="scaleIn">
				<div class="text-center max-w-2xl mx-auto">
					<div class="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 mb-6">
						<Icon name="mail" class="h-4 w-4 text-gold-400" />
						<span class="text-sm font-medium text-gold-300">Newsletter</span>
					</div>

					<h2 class="font-display text-4xl font-bold text-white">
						Never Miss an <span class="text-gold-400">Insight</span>
					</h2>
					<p class="mt-4 text-midnight-400 text-lg">
						Join thousands of traders receiving our weekly digest of strategies, analysis, and wisdom
						from legendary traders.
					</p>

					<form class="mt-10 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
						<input
							type="email"
							placeholder="Enter your email"
							class="flex-1 rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder-midnight-500 outline-none transition-all duration-300 focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 focus:bg-white/10"
						/>
						<button
							type="submit"
							class="group rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-8 py-4 font-bold text-midnight-950 shadow-lg shadow-gold-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-gold-500/30 hover:scale-[1.02] active:scale-[0.98]"
						>
							<span class="flex items-center gap-2">
								Subscribe
								<Icon name="arrow-right" class="h-4 w-4 transition-transform group-hover:translate-x-1" />
							</span>
						</button>
					</form>

					<p class="mt-6 text-xs text-midnight-600">
						No spam. Unsubscribe anytime.
					</p>
				</div>
			</ScrollReveal>
		</div>
	</section>
</div>

<style>
	/* Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		.animate-hero-fade,
		.animate-hero-slide {
			animation: none !important;
			opacity: 1 !important;
			transform: none !important;
		}
	}
</style>
