<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { Icon } from '$lib/components/icons';
	import { comparison } from '$lib/stores/comparison';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { cn } from '$lib/utils';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let mounted = $state(false);
	let searchQuery = $state('');

	$effect(() => {
		if (browser) {
			mounted = true;
			// Sync URL with store on mount
			if (comparison.count > 0 && data.selectedSlugs.length === 0) {
				updateUrl();
			}
		}
	});

	const comparedSlugs = $derived(mounted ? comparison.all : data.selectedSlugs);

	const selectedTraders = $derived(
		comparedSlugs
			.map(slug => data.allTraders.find(t => t.slug === slug))
			.filter(t => t !== undefined)
	);

	const filteredTraders = $derived(
		searchQuery
			? data.allTraders.filter(t =>
					t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					t.tradingStyle?.toLowerCase().includes(searchQuery.toLowerCase())
				)
			: data.allTraders
	);

	const availableTraders = $derived(
		filteredTraders.filter(t => !comparedSlugs.includes(t.slug))
	);

	function updateUrl() {
		if (browser) {
			const slugs = comparison.all;
			if (slugs.length > 0) {
				goto(`/compare?traders=${slugs.join(',')}`, { replaceState: true });
			} else {
				goto('/compare', { replaceState: true });
			}
		}
	}

	function addTrader(slug: string) {
		comparison.add(slug);
		updateUrl();
	}

	function removeTrader(slug: string) {
		comparison.remove(slug);
		updateUrl();
	}

	function clearAll() {
		comparison.clear();
		updateUrl();
	}

	// Comparison rows
	const comparisonFields = [
		{ key: 'tradingStyle', label: 'Trading Style', icon: 'trending-up' as const },
		{ key: 'netWorth', label: 'Net Worth', icon: 'dollar-sign' as const },
		{ key: 'nationality', label: 'Nationality', icon: 'globe' as const },
		{ key: 'birthYear', label: 'Birth Year', icon: 'calendar' as const },
		{ key: 'philosophy', label: 'Philosophy', icon: 'lightbulb' as const }
	];
</script>

<SEO
	title="Compare Traders | Trading Greats"
	description="Compare legendary traders side-by-side. Analyze their trading styles, philosophies, and achievements to find the strategies that resonate with you."
/>

<div class="min-h-screen bg-midnight-950">
	<!-- Header -->
	<section class="relative pt-20 sm:pt-24 lg:pt-28 pb-8 sm:pb-10 overflow-hidden">
		<div class="absolute inset-0">
			<div class="absolute top-[-20%] right-[-10%] h-[400px] w-[400px] rounded-full bg-gradient-radial from-violet-500/10 via-violet-500/5 to-transparent blur-3xl"></div>
		</div>

		<div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<nav class="mb-6 flex items-center gap-2 text-sm text-midnight-400">
				<a href="/" class="hover:text-gold-400 transition-colors">Home</a>
				<Icon name="chevron-right" class="h-4 w-4" />
				<a href="/traders" class="hover:text-gold-400 transition-colors">Traders</a>
				<Icon name="chevron-right" class="h-4 w-4" />
				<span class="text-white font-medium">Compare</span>
			</nav>

			<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 class="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
						Compare <span class="text-violet-400">Traders</span>
					</h1>
					<p class="mt-2 text-midnight-300">
						Select up to {comparison.maxCompare} traders to compare side-by-side
					</p>
				</div>

				{#if selectedTraders.length > 0}
					<button
						onclick={clearAll}
						class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-midnight-300 hover:bg-white/10 hover:text-white transition-colors"
					>
						<Icon name="x" class="h-4 w-4" />
						Clear All
					</button>
				{/if}
			</div>
		</div>
	</section>

	<div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
		{#if selectedTraders.length === 0}
			<!-- Empty State -->
			<div class="text-center py-16">
				<div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-midnight-800/50 border border-white/5 mb-6">
					<Icon name="bar-chart" class="h-10 w-10 text-midnight-500" />
				</div>
				<h2 class="text-2xl font-display font-bold text-white mb-3">No traders selected</h2>
				<p class="text-midnight-400 max-w-md mx-auto mb-8">
					Add traders to compare their strategies, philosophies, and achievements.
				</p>
			</div>
		{:else}
			<!-- Comparison Table -->
			<div class="overflow-x-auto rounded-2xl border border-white/10 bg-midnight-900/50 backdrop-blur-sm">
				<table class="w-full min-w-[600px]">
					<!-- Header with trader cards -->
					<thead>
						<tr class="border-b border-white/10">
							<th class="p-4 text-left text-sm font-medium text-midnight-400 w-40">
								Trader
							</th>
							{#each selectedTraders as trader}
								<th class="p-4 text-center">
									<div class="relative">
										<button
											onclick={() => removeTrader(trader.slug)}
											class="absolute -top-1 -right-1 p-1 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
											aria-label="Remove {trader.name}"
										>
											<Icon name="x" class="h-3 w-3" />
										</button>
										<a href="/traders/{trader.slug}" class="group block">
											<div class="w-16 h-16 mx-auto rounded-xl overflow-hidden mb-2 bg-midnight-800">
												{#if trader.photoUrl}
													<img
														src={trader.photoUrl}
														alt={trader.name}
														class="w-full h-full object-cover group-hover:scale-105 transition-transform"
													/>
												{:else}
													<div class="w-full h-full flex items-center justify-center text-2xl font-bold text-midnight-600">
														{trader.name.split(' ').map(n => n[0]).join('')}
													</div>
												{/if}
											</div>
											<span class="font-display font-bold text-white group-hover:text-gold-400 transition-colors">
												{trader.name}
											</span>
										</a>
									</div>
								</th>
							{/each}
							{#if selectedTraders.length < comparison.maxCompare}
								<th class="p-4 w-32"></th>
							{/if}
						</tr>
					</thead>
					<tbody>
						{#each comparisonFields as field}
							<tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
								<td class="p-4">
									<div class="flex items-center gap-2 text-sm text-midnight-300">
										<Icon name={field.icon} class="h-4 w-4 text-midnight-500" />
										{field.label}
									</div>
								</td>
								{#each selectedTraders as trader}
									<td class="p-4 text-center">
										{#if field.key === 'philosophy'}
											<p class="text-xs text-midnight-300 line-clamp-3 max-w-[200px] mx-auto">
												{trader[field.key] || '—'}
											</p>
										{:else}
											<span class={cn(
												'text-sm',
												trader[field.key as keyof typeof trader] ? 'text-white' : 'text-midnight-600'
											)}>
												{trader[field.key as keyof typeof trader] || '—'}
											</span>
										{/if}
									</td>
								{/each}
								{#if selectedTraders.length < comparison.maxCompare}
									<td class="p-4"></td>
								{/if}
							</tr>
						{/each}

						<!-- Quotes row -->
						<tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
							<td class="p-4">
								<div class="flex items-center gap-2 text-sm text-midnight-300">
									<Icon name="quote" class="h-4 w-4 text-midnight-500" />
									Famous Quote
								</div>
							</td>
							{#each selectedTraders as trader}
								<td class="p-4 text-center">
									{#if trader.quotes && trader.quotes.length > 0}
										<p class="text-xs text-midnight-300 italic line-clamp-3 max-w-[200px] mx-auto">
											"{trader.quotes[0].text}"
										</p>
									{:else}
										<span class="text-midnight-600">—</span>
									{/if}
								</td>
							{/each}
							{#if selectedTraders.length < comparison.maxCompare}
								<td class="p-4"></td>
							{/if}
						</tr>

						<!-- Achievements row -->
						<tr class="hover:bg-white/5 transition-colors">
							<td class="p-4">
								<div class="flex items-center gap-2 text-sm text-midnight-300">
									<Icon name="award" class="h-4 w-4 text-midnight-500" />
									Key Achievement
								</div>
							</td>
							{#each selectedTraders as trader}
								<td class="p-4 text-center">
									{#if trader.achievements && trader.achievements.length > 0}
										<span class="text-xs text-gold-400 font-medium">
											{trader.achievements[0]}
										</span>
									{:else}
										<span class="text-midnight-600">—</span>
									{/if}
								</td>
							{/each}
							{#if selectedTraders.length < comparison.maxCompare}
								<td class="p-4"></td>
							{/if}
						</tr>
					</tbody>
				</table>
			</div>
		{/if}

		<!-- Add Trader Section -->
		{#if selectedTraders.length < comparison.maxCompare}
			<div class="mt-8">
				<h3 class="font-display text-lg font-bold text-white mb-4">
					Add Traders to Compare
				</h3>

				<!-- Search -->
				<div class="relative mb-4">
					<Icon name="search" class="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-midnight-500" />
					<input
						type="text"
						placeholder="Search traders..."
						bind:value={searchQuery}
						class="w-full bg-midnight-900/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-midnight-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
					/>
				</div>

				<!-- Trader Grid -->
				<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
					{#each availableTraders.slice(0, 12) as trader}
						<button
							onclick={() => addTrader(trader.slug)}
							class="group p-3 rounded-xl border border-white/10 bg-midnight-900/30 hover:border-violet-500/30 hover:bg-midnight-800/50 transition-all text-left"
						>
							<div class="w-12 h-12 rounded-lg overflow-hidden mb-2 bg-midnight-800">
								{#if trader.photoUrl}
									<img
										src={trader.photoUrl}
										alt={trader.name}
										class="w-full h-full object-cover"
									/>
								{:else}
									<div class="w-full h-full flex items-center justify-center text-lg font-bold text-midnight-600">
										{trader.name.split(' ').map(n => n[0]).join('')}
									</div>
								{/if}
							</div>
							<p class="font-medium text-sm text-white group-hover:text-violet-400 transition-colors line-clamp-1">
								{trader.name}
							</p>
							<p class="text-[10px] text-midnight-500 line-clamp-1">
								{trader.tradingStyle || 'Trader'}
							</p>
						</button>
					{/each}
				</div>

				{#if availableTraders.length > 12}
					<p class="mt-4 text-sm text-midnight-500 text-center">
						{availableTraders.length - 12} more traders available. Use search to find specific traders.
					</p>
				{/if}
			</div>
		{/if}
	</div>
</div>
