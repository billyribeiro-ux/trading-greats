<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import TraderCard from '$lib/components/TraderCard.svelte';
	import JsonLd from '$lib/components/JsonLd.svelte';
	import { PUBLIC_SITE_URL } from '$env/static/public';
	import { cn } from '$lib/utils';
	import { Search, Filter, X, TrendingUp } from 'lucide-svelte';

	let { data } = $props();

	let searchQuery = $state('');

	const filteredTraders = $derived(
		searchQuery
			? data.traders.filter(t =>
					t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					t.tradingStyle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
					t.nationality?.toLowerCase().includes(searchQuery.toLowerCase())
				)
			: data.traders
	);

	const breadcrumbs = [
		{ name: 'Home', url: PUBLIC_SITE_URL },
		{ name: 'Traders', url: `${PUBLIC_SITE_URL}/traders` }
	];
</script>

<SEO
	title="Legendary Traders - Trading Greats"
	description="Explore our collection of legendary traders. From value investors like Warren Buffett to macro traders like George Soros, discover the strategies that built fortunes."
/>

<JsonLd type="BreadcrumbList" {breadcrumbs} />

<div class="min-h-screen bg-midnight-950">
	<!-- Header Section -->
	<section class="relative pt-32 pb-20 overflow-hidden">
		<!-- Background Elements -->
		<div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=2560&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
		<div class="absolute inset-0 bg-gradient-to-b from-midnight-950/80 via-midnight-950/90 to-midnight-950"></div>
		
		<div class="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
			<h1 class="font-display text-5xl font-bold text-white sm:text-6xl mb-6 tracking-tight">
				The <span class="text-gold-500">Legends</span> of Trading
			</h1>
			<p class="mx-auto max-w-2xl text-lg text-midnight-200 leading-relaxed">
				Discover the masterminds who beat the market. Explore their strategies, learn their philosophies, and understand the psychology behind their greatest trades.
			</p>

			<!-- Search & Filter Container -->
			<div class="mt-12 max-w-3xl mx-auto">
				<div class="relative group">
					<div class="absolute -inset-1 bg-gradient-to-r from-gold-500/20 to-purple-500/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
					<div class="relative flex items-center bg-midnight-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-2 shadow-2xl">
						<Search class="ml-4 h-5 w-5 text-midnight-400" />
						<input
							type="text"
							placeholder="Search by name, style, or strategy..."
							bind:value={searchQuery}
							class="w-full bg-transparent border-none px-4 py-3 text-white placeholder-midnight-500 focus:ring-0 text-lg"
						/>
						{#if searchQuery}
							<button 
								onclick={() => searchQuery = ''}
								class="p-2 hover:bg-white/10 rounded-lg transition-colors"
							>
								<X class="h-5 w-5 text-midnight-400" />
							</button>
						{/if}
					</div>
				</div>

				<!-- Quick Filters -->
				<div class="mt-6 flex flex-wrap justify-center gap-2">
					<a
						href="/traders"
						class={cn(
							'px-4 py-2 rounded-full text-sm font-medium transition-all border',
							!data.currentFilter
								? 'bg-gold-500 text-midnight-950 border-gold-500'
								: 'bg-white/5 text-midnight-300 border-white/5 hover:bg-white/10 hover:text-white'
						)}
					>
						All Legends
					</a>
					{#each data.tradingStyles as style}
						<a
							href="/traders?style={encodeURIComponent(style || '')}"
							class={cn(
								'px-4 py-2 rounded-full text-sm font-medium transition-all border',
								data.currentFilter === style
									? 'bg-gold-500 text-midnight-950 border-gold-500'
									: 'bg-white/5 text-midnight-300 border-white/5 hover:bg-white/10 hover:text-white'
							)}
						>
							{style}
						</a>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- Grid Section -->
	<section class="relative z-20 pb-24 px-6 lg:px-8">
		<div class="mx-auto max-w-7xl">
			{#if filteredTraders.length === 0}
				<div class="text-center py-20">
					<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-midnight-800/50 mb-4">
						<Search class="h-8 w-8 text-midnight-500" />
					</div>
					<h3 class="text-xl font-medium text-white">No legends found</h3>
					<p class="mt-2 text-midnight-400">Try adjusting your search or filters</p>
					<button 
						onclick={() => searchQuery = ''}
						class="mt-6 text-gold-500 hover:text-gold-400 font-medium"
					>
						Clear search
					</button>
				</div>
			{:else}
				<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{#each filteredTraders as trader, i (trader.id)}
						<TraderCard {trader} index={i} />
					{/each}
				</div>
			{/if}
		</div>
	</section>
</div>
