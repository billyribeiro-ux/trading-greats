<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import TraderCard from '$lib/components/TraderCard.svelte';
	import JsonLd from '$lib/components/JsonLd.svelte';
	import { ScrollReveal } from '$lib/components/motion';
	import { PUBLIC_SITE_URL } from '$env/static/public';
	import { cn } from '$lib/utils';
	import { Icon, type IconName } from '$lib/components/icons';

	// ============================================================================
	// DATA & STATE
	// ============================================================================

	let { data } = $props();

	let searchQuery = $state('');
	let viewMode = $state<'grid' | 'list'>('grid');

	// ============================================================================
	// DERIVED STATE
	// ============================================================================

	const filteredTraders = $derived(
		searchQuery
			? data.traders.filter((t) =>
					t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					t.tradingStyle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
					t.nationality?.toLowerCase().includes(searchQuery.toLowerCase()) ||
					t.oneLiner?.toLowerCase().includes(searchQuery.toLowerCase())
				)
			: data.traders
	);

	const tradingStyleCounts = $derived(() => {
		const counts: Record<string, number> = {};
		data.traders.forEach((trader) => {
			if (trader.tradingStyle) {
				counts[trader.tradingStyle] = (counts[trader.tradingStyle] || 0) + 1;
			}
		});
		return counts;
	});

	// ============================================================================
	// SEO DATA
	// ============================================================================

	const breadcrumbs = [
		{ name: 'Home', url: PUBLIC_SITE_URL },
		{ name: 'Legends', url: `${PUBLIC_SITE_URL}/traders` }
	];

	// ============================================================================
	// STYLE METADATA
	// ============================================================================

	const styleMetadata: Record<string, { icon: IconName; color: string; bg: string }> = {
		'Value Investing': { icon: 'trending-up', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
		'Momentum Growth': { icon: 'zap', color: 'text-violet-400', bg: 'bg-violet-500/10' },
		'Macro & Currency': { icon: 'globe', color: 'text-sky-400', bg: 'bg-sky-500/10' },
		'Options & Technical Analysis': { icon: 'line-chart', color: 'text-amber-400', bg: 'bg-amber-500/10' },
		'Options & Price Action': { icon: 'line-chart', color: 'text-orange-400', bg: 'bg-orange-500/10' }
	};

	function getStyleMeta(style: string | null): { icon: IconName; color: string; bg: string } {
		if (!style) return { icon: 'trending-up', color: 'text-gold-400', bg: 'bg-gold-500/10' };
		return styleMetadata[style] || { icon: 'trending-up', color: 'text-gold-400', bg: 'bg-gold-500/10' };
	}
</script>

<SEO
	title="Trading Legends - The World's Greatest Traders | Trading Greats"
	description="Explore comprehensive profiles of legendary traders. From value investors like Warren Buffett to macro traders like George Soros—discover the strategies, philosophies, and famous trades that built fortunes."
/>

<JsonLd type="BreadcrumbList" {breadcrumbs} />

<div class="min-h-screen bg-midnight-950">
	<!-- ========================================================================
	     HERO HEADER
	======================================================================== -->
	<section class="relative pt-28 pb-16 overflow-hidden">
		<!-- Background Elements -->
		<div class="absolute inset-0">
			<div class="absolute top-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-gradient-radial from-gold-500/10 via-gold-500/5 to-transparent blur-3xl"></div>
			<div class="absolute bottom-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-gradient-radial from-violet-500/10 via-violet-500/5 to-transparent blur-3xl"></div>
			<div class="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_50%,transparent_100%)]"></div>
		</div>

		<div class="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
			<!-- Breadcrumb -->
			<nav class="mb-8 flex items-center gap-2 text-sm text-midnight-400">
				<a href="/" class="hover:text-gold-400 transition-colors">Home</a>
				<Icon name="chevron-right" class="h-4 w-4" />
				<span class="text-white font-medium">Legends</span>
			</nav>

			<div class="text-center max-w-4xl mx-auto">
				<span class="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold-400 mb-6">
					<Icon name="sparkles" class="h-3.5 w-3.5" />
					The Complete Library
				</span>

				<h1 class="font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl mb-6 tracking-tight">
					The <span class="text-gold-400">Legends</span> of Trading
				</h1>

				<p class="mx-auto max-w-2xl text-lg text-midnight-300 leading-relaxed">
					Discover the masterminds who beat the market. Explore their strategies,
					learn their philosophies, and understand the psychology behind their greatest trades.
				</p>
			</div>

			<!-- Search & Filter Container -->
			<div class="mt-12 max-w-3xl mx-auto">
				<div class="relative group">
					<!-- Glow effect -->
					<div class="absolute -inset-1 bg-gradient-to-r from-gold-500/20 via-violet-500/20 to-gold-500/20 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>

					<div class="relative flex items-center bg-midnight-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-2 shadow-2xl">
						<Icon name="search" class="ml-4 h-5 w-5 text-midnight-400" />
						<input
							type="text"
							placeholder="Search by name, strategy, or nationality..."
							bind:value={searchQuery}
							class="w-full bg-transparent border-none px-4 py-3 text-white placeholder-midnight-500 focus:ring-0 focus:outline-none text-lg"
						/>
						{#if searchQuery}
							<button
								onclick={() => (searchQuery = '')}
								class="p-2 hover:bg-white/10 rounded-lg transition-colors mr-2"
								aria-label="Clear search"
							>
								<Icon name="x" class="h-5 w-5 text-midnight-400" />
							</button>
						{/if}
					</div>
				</div>

				<!-- Quick Filters -->
				<div class="mt-6 flex flex-wrap justify-center gap-2">
					<a
						href="/traders"
						class={cn(
							'group inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border',
							!data.currentFilter
								? 'bg-gold-500 text-midnight-950 border-gold-500 shadow-lg shadow-gold-500/20'
								: 'bg-white/5 text-midnight-300 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'
						)}
					>
						<Icon name="users" class="h-4 w-4" />
						All Legends
						<span class="ml-1 text-xs opacity-70">({data.traders.length})</span>
					</a>

					{#each data.tradingStyles as style}
						{@const meta = getStyleMeta(style)}
						<a
							href="/traders?style={encodeURIComponent(style || '')}"
							class={cn(
								'group inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border',
								data.currentFilter === style
									? 'bg-gold-500 text-midnight-950 border-gold-500 shadow-lg shadow-gold-500/20'
									: 'bg-white/5 text-midnight-300 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'
							)}
						>
							<Icon name={meta.icon} class="h-4 w-4" />
							{style}
							<span class="ml-1 text-xs opacity-70">({tradingStyleCounts()[style || ''] || 0})</span>
						</a>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- ========================================================================
	     RESULTS HEADER
	======================================================================== -->
	<section class="relative z-20 px-6 lg:px-8 pb-6">
		<div class="mx-auto max-w-7xl">
			<div class="flex items-center justify-between border-b border-white/5 pb-6">
				<div class="flex items-center gap-4">
					<p class="text-sm text-midnight-400">
						{#if searchQuery}
							<span class="text-white font-medium">{filteredTraders.length}</span> results for "<span class="text-gold-400">{searchQuery}</span>"
						{:else if data.currentFilter}
							<span class="text-white font-medium">{filteredTraders.length}</span> traders in <span class="text-gold-400">{data.currentFilter}</span>
						{:else}
							Showing <span class="text-white font-medium">{filteredTraders.length}</span> legendary traders
						{/if}
					</p>
				</div>

				<!-- View Toggle -->
				<div class="hidden sm:flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/5">
					<button
						onclick={() => (viewMode = 'grid')}
						class={cn(
							'p-2 rounded-md transition-all duration-200',
							viewMode === 'grid'
								? 'bg-white/10 text-white'
								: 'text-midnight-500 hover:text-white'
						)}
						aria-label="Grid view"
					>
						<Icon name="layout-grid" class="h-4 w-4" />
					</button>
					<button
						onclick={() => (viewMode = 'list')}
						class={cn(
							'p-2 rounded-md transition-all duration-200',
							viewMode === 'list'
								? 'bg-white/10 text-white'
								: 'text-midnight-500 hover:text-white'
						)}
						aria-label="List view"
					>
						<Icon name="list" class="h-4 w-4" />
					</button>
				</div>
			</div>
		</div>
	</section>

	<!-- ========================================================================
	     TRADERS GRID
	======================================================================== -->
	<section class="relative z-20 pb-24 px-6 lg:px-8">
		<div class="mx-auto max-w-7xl">
			{#if filteredTraders.length === 0}
				<!-- Empty State -->
				<ScrollReveal class="py-20">
					<div class="text-center">
						<div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-midnight-800/50 border border-white/5 mb-6">
							<Icon name="search" class="h-10 w-10 text-midnight-500" />
						</div>
						<h3 class="text-2xl font-display font-bold text-white mb-3">No legends found</h3>
						<p class="text-midnight-400 max-w-md mx-auto mb-8">
							We couldn't find any traders matching your search.
							Try adjusting your filters or search terms.
						</p>
						<button
							onclick={() => (searchQuery = '')}
							class="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-bold text-midnight-950 transition-all hover:bg-gold-400"
						>
							Clear Search
							<Icon name="arrow-right" class="h-4 w-4" />
						</button>
					</div>
				</ScrollReveal>
			{:else}
				<!-- Grid View -->
				{#if viewMode === 'grid'}
					<div class="trader-grid grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr">
						{#each filteredTraders as trader, i (trader.id)}
							<ScrollReveal delay={Math.min(i * 50, 400)} class="h-full">
								<TraderCard {trader} index={i} class="h-full" />
							</ScrollReveal>
						{/each}
					</div>
				{:else}
					<!-- List View -->
					<div class="space-y-4">
						{#each filteredTraders as trader, i (trader.id)}
							<ScrollReveal delay={Math.min(i * 30, 300)}>
								<a
									href="/traders/{trader.slug}"
									class="group flex items-center gap-6 p-4 rounded-2xl border border-white/5 bg-midnight-900/30 backdrop-blur-sm transition-all duration-300 hover:border-gold-500/30 hover:bg-midnight-800/50"
								>
									<!-- Image -->
									<div class="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl">
										<img
											src={trader.photoUrl}
											alt={trader.name}
											class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
											loading="lazy"
										/>
										<div class="absolute inset-0 bg-gradient-to-t from-midnight-950/60 to-transparent"></div>
									</div>

									<!-- Content -->
									<div class="flex-1 min-w-0">
										<div class="flex items-center gap-3 mb-1">
											<h3 class="font-display text-lg font-bold text-white group-hover:text-gold-400 transition-colors truncate">
												{trader.name}
											</h3>
											{#if trader.tradingStyle}
												{@const meta = getStyleMeta(trader.tradingStyle)}
												<span class={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium', meta.bg, meta.color)}>
													<Icon name={meta.icon} class="h-3 w-3" />
													{trader.tradingStyle}
												</span>
											{/if}
										</div>
										<p class="text-sm text-midnight-300 line-clamp-1">
											{trader.oneLiner}
										</p>
										<div class="flex items-center gap-4 mt-2 text-xs text-midnight-500">
											{#if trader.nationality}
												<span class="flex items-center gap-1">
													<Icon name="globe" class="h-3 w-3" />
													{trader.nationality}
												</span>
											{/if}
											{#if trader.netWorth}
												<span>{trader.netWorth}</span>
											{/if}
										</div>
									</div>

									<!-- Arrow -->
									<Icon name="arrow-right" class="h-5 w-5 text-midnight-600 transition-all duration-300 group-hover:text-gold-500 group-hover:translate-x-1 flex-shrink-0" />
								</a>
							</ScrollReveal>
						{/each}
					</div>
				{/if}
			{/if}
		</div>
	</section>

	<!-- ========================================================================
	     BOTTOM CTA
	======================================================================== -->
	{#if filteredTraders.length > 0}
		<ScrollReveal as="section" class="relative z-20 pb-24 px-6 lg:px-8">
			<div class="mx-auto max-w-4xl">
				<div class="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-midnight-900/80 to-midnight-900/40 p-8 sm:p-12 backdrop-blur-xl">
					<!-- Glow -->
					<div class="absolute top-0 right-0 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl"></div>

					<div class="relative z-10 text-center">
						<h3 class="font-display text-2xl font-bold text-white sm:text-3xl mb-4">
							Can't find what you're looking for?
						</h3>
						<p class="text-midnight-300 max-w-xl mx-auto mb-8">
							We're constantly adding new legendary traders to our library.
							If you know of a trading legend we should feature, let us know.
						</p>
						<a
							href="mailto:suggest@tradinggreats.com"
							class="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:border-white/20"
						>
							Suggest a Legend
							<Icon name="arrow-right" class="h-4 w-4" />
						</a>
					</div>
				</div>
			</div>
		</ScrollReveal>
	{/if}
</div>
