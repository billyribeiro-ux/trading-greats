<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { Icon } from '$lib/components/icons';
	import { fade, fly, scale } from 'svelte/transition';
	import { cubicOut, backOut } from 'svelte/easing';
	import { cn } from '$lib/utils';

	// ============================================================================
	// PROPS
	// ============================================================================
	
	interface Props {
		open: boolean;
		onClose: () => void;
	}

	let { open = $bindable(), onClose }: Props = $props();

	// ============================================================================
	// STATE
	// ============================================================================
	
	let searchQuery = $state('');
	let searchInputRef = $state<HTMLInputElement | undefined>(undefined);
	let selectedIndex = $state(0);
	let isLoading = $state(false);

	// ============================================================================
	// TRADERS DATA (from seed - in production this would be an API call)
	// ============================================================================
	
	const allTraders = [
		{ name: 'Billy Ribeiro', slug: 'billy-ribeiro', style: 'Price Action & Options' },
		{ name: 'George Soros', slug: 'george-soros', style: 'Macro & Currency' },
		{ name: 'Warren Buffett', slug: 'warren-buffett', style: 'Value Investing' },
		{ name: 'Paul Tudor Jones', slug: 'paul-tudor-jones', style: 'Macro Trading' },
		{ name: 'Ray Dalio', slug: 'ray-dalio', style: 'Macro & Systematic' },
		{ name: 'Jesse Livermore', slug: 'jesse-livermore', style: 'Speculation & Tape Reading' },
		{ name: 'Stanley Druckenmiller', slug: 'stanley-druckenmiller', style: 'Macro Trading' },
		{ name: 'Mark Minervini', slug: 'mark-minervini', style: 'Momentum Growth' },
		{ name: 'Michael Burry', slug: 'michael-burry', style: 'Value Investing & Macro' },
		{ name: 'John Paulson', slug: 'john-paulson', style: 'Event-Driven & Macro' },
		{ name: 'Ed Seykota', slug: 'ed-seykota', style: 'Systematic & Trend Following' },
		{ name: 'Bruce Kovner', slug: 'bruce-kovner', style: 'Macro & Forex' },
		{ name: 'Richard Dennis', slug: 'richard-dennis', style: 'Trend Following' },
		{ name: 'Steve Cohen', slug: 'steve-cohen', style: 'Short-Term Trading' },
		{ name: 'Carl Icahn', slug: 'carl-icahn', style: 'Activist Investing' },
		{ name: 'David Tepper', slug: 'david-tepper', style: 'Distressed Debt' },
		{ name: 'Jim Rogers', slug: 'jim-rogers', style: 'Macro & Commodities' },
		{ name: 'Bill Lipschutz', slug: 'bill-lipschutz', style: 'Forex & Macro' },
		{ name: 'Andy Krieger', slug: 'andy-krieger', style: 'Forex & Macro' },
		{ name: 'Nick Leeson', slug: 'nick-leeson', style: 'Derivatives & Arbitrage' },
		{ name: 'Bill Gross', slug: 'bill-gross', style: 'Fixed Income & Bonds' },
		{ name: 'Peter Schiff', slug: 'peter-schiff', style: 'Macro & Commodities' },
		{ name: 'Nicolas Darvas', slug: 'nicolas-darvas', style: 'Momentum & Box Theory' },
		{ name: 'John Carter', slug: 'john-carter', style: 'Options & Technical Analysis' },
	];

	// Quick actions
	const quickActions = [
		{ label: 'View All Legends', href: '/traders', icon: 'users' as const },
		{ label: 'Compare Traders', href: '/compare', icon: 'bar-chart' as const },
		{ label: 'Read Blog', href: '/blog', icon: 'book-open' as const },
	];

	// ============================================================================
	// DERIVED
	// ============================================================================
	
	const filteredTraders = $derived.by(() => {
		if (!searchQuery.trim()) return allTraders.slice(0, 6);
		const query = searchQuery.toLowerCase();
		return allTraders
			.filter(t => 
				t.name.toLowerCase().includes(query) || 
				t.style.toLowerCase().includes(query)
			)
			.slice(0, 8);
	});

	const totalResults = $derived(filteredTraders.length + (searchQuery ? 0 : quickActions.length));

	// ============================================================================
	// EFFECTS
	// ============================================================================
	
	// Focus input when modal opens
	$effect(() => {
		if (open && browser) {
			requestAnimationFrame(() => {
				searchInputRef?.focus();
			});
		}
	});

	// Reset state when modal closes
	$effect(() => {
		if (!open) {
			searchQuery = '';
			selectedIndex = 0;
		}
	});

	// Lock body scroll when open
	$effect(() => {
		if (!browser) return;
		
		if (open) {
			document.body.style.overflow = 'hidden';
			return () => {
				document.body.style.overflow = '';
			};
		}
	});

	// ============================================================================
	// HANDLERS
	// ============================================================================
	
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			event.preventDefault();
			onClose();
		} else if (event.key === 'ArrowDown') {
			event.preventDefault();
			selectedIndex = Math.min(selectedIndex + 1, totalResults - 1);
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			selectedIndex = Math.max(selectedIndex - 1, 0);
		} else if (event.key === 'Enter') {
			event.preventDefault();
			selectCurrentItem();
		}
	}

	function selectCurrentItem() {
		if (searchQuery) {
			// Navigate to selected trader
			if (filteredTraders[selectedIndex]) {
				goto(`/traders/${filteredTraders[selectedIndex].slug}`);
				onClose();
			}
		} else {
			// Handle quick actions or traders
			if (selectedIndex < quickActions.length) {
				goto(quickActions[selectedIndex].href);
				onClose();
			} else {
				const traderIndex = selectedIndex - quickActions.length;
				if (filteredTraders[traderIndex]) {
					goto(`/traders/${filteredTraders[traderIndex].slug}`);
					onClose();
				}
			}
		}
	}

	function handleTraderClick(slug: string) {
		goto(`/traders/${slug}`);
		onClose();
	}

	function handleActionClick(href: string) {
		goto(href);
		onClose();
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			onClose();
		}
	}
</script>

{#if open}
	<!-- Backdrop -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] sm:pt-[15vh] px-4"
		transition:fade={{ duration: 200, easing: cubicOut }}
		onclick={handleBackdropClick}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		aria-label="Search traders"
		tabindex="-1"
	>
		<!-- Backdrop blur -->
		<div class="absolute inset-0 bg-midnight-950/80 backdrop-blur-xl"></div>

		<!-- Search Modal -->
		<div
			class="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-midnight-900/95 shadow-2xl shadow-black/50 backdrop-blur-2xl"
			transition:scale={{ duration: 300, easing: backOut, start: 0.95 }}
		>
			<!-- Search Input -->
			<div class="relative border-b border-white/10">
				<div class="absolute left-5 top-1/2 -translate-y-1/2">
					<Icon name="search" class="h-5 w-5 text-midnight-400" strokeWidth={2} />
				</div>
				<input
					bind:this={searchInputRef}
					bind:value={searchQuery}
					type="text"
					placeholder="Search legendary traders..."
					class={cn(
						'w-full bg-transparent py-5 pl-14 pr-14 text-lg text-white placeholder-midnight-500',
						'outline-none focus:ring-0',
						'font-medium'
					)}
					autocomplete="off"
					autocorrect="off"
					autocapitalize="off"
					spellcheck="false"
				/>
				{#if searchQuery}
					<button
						type="button"
						class="absolute right-5 top-1/2 -translate-y-1/2 rounded-full p-1 text-midnight-400 transition-colors hover:bg-white/10 hover:text-white"
						onclick={() => { searchQuery = ''; searchInputRef?.focus(); }}
						aria-label="Clear search"
					>
						<Icon name="x" class="h-4 w-4" strokeWidth={2} />
					</button>
				{:else}
					<div class="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-1">
						<kbd class="hidden sm:inline-flex h-6 items-center justify-center rounded bg-white/10 px-2 text-xs font-medium text-midnight-400">
							ESC
						</kbd>
					</div>
				{/if}
			</div>

			<!-- Results -->
			<div class="max-h-[60vh] overflow-y-auto overscroll-contain p-2">
				{#if !searchQuery}
					<!-- Quick Actions -->
					<div class="mb-2 px-3 py-2">
						<p class="text-xs font-semibold uppercase tracking-wider text-midnight-500">Quick Actions</p>
					</div>
					{#each quickActions as action, i}
						<button
							type="button"
							class={cn(
								'flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition-all duration-150',
								selectedIndex === i
									? 'bg-gold-500/10 text-white'
									: 'text-midnight-300 hover:bg-white/5 hover:text-white'
							)}
							onclick={() => handleActionClick(action.href)}
							onmouseenter={() => { selectedIndex = i; }}
						>
							<div class={cn(
								'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
								selectedIndex === i ? 'bg-gold-500/20 text-gold-400' : 'bg-white/5 text-midnight-400'
							)}>
								<Icon name={action.icon} class="h-5 w-5" strokeWidth={2} />
							</div>
							<span class="font-medium">{action.label}</span>
							<Icon name="arrow-right" class="ml-auto h-4 w-4 text-midnight-500" strokeWidth={2} />
						</button>
					{/each}

					<!-- Divider -->
					<div class="my-3 border-t border-white/5"></div>

					<!-- Popular Traders -->
					<div class="mb-2 px-3 py-2">
						<p class="text-xs font-semibold uppercase tracking-wider text-midnight-500">Popular Legends</p>
					</div>
				{:else if filteredTraders.length === 0}
					<!-- No Results -->
					<div class="flex flex-col items-center justify-center py-12 text-center">
						<div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
							<Icon name="search" class="h-8 w-8 text-midnight-500" strokeWidth={1.5} />
						</div>
						<p class="text-lg font-medium text-white">No traders found</p>
						<p class="mt-1 text-sm text-midnight-400">Try a different search term</p>
					</div>
				{/if}

				<!-- Trader Results -->
				{#each filteredTraders as trader, i}
					{@const index = searchQuery ? i : i + quickActions.length}
					<button
						type="button"
						class={cn(
							'flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition-all duration-150',
							selectedIndex === index
								? 'bg-gold-500/10 text-white'
								: 'text-midnight-300 hover:bg-white/5 hover:text-white'
						)}
						onclick={() => handleTraderClick(trader.slug)}
						onmouseenter={() => { selectedIndex = index; }}
					>
						<!-- Avatar placeholder -->
						<div class={cn(
							'flex h-10 w-10 items-center justify-center rounded-full font-display font-bold text-sm transition-colors',
							selectedIndex === index 
								? 'bg-gradient-to-br from-gold-500 to-gold-600 text-midnight-950' 
								: 'bg-white/10 text-white'
						)}>
							{trader.name.split(' ').map(n => n[0]).join('')}
						</div>
						<div class="flex-1 min-w-0">
							<p class="font-medium truncate">{trader.name}</p>
							<p class="text-sm text-midnight-400 truncate">{trader.style}</p>
						</div>
						<Icon name="arrow-right" class="h-4 w-4 text-midnight-500 shrink-0" strokeWidth={2} />
					</button>
				{/each}
			</div>

			<!-- Footer -->
			<div class="border-t border-white/10 px-4 py-3">
				<div class="flex items-center justify-between text-xs text-midnight-500">
					<div class="flex items-center gap-4">
						<span class="flex items-center gap-1.5">
							<kbd class="inline-flex h-5 items-center justify-center rounded bg-white/10 px-1.5 font-mono text-[10px]">↑</kbd>
							<kbd class="inline-flex h-5 items-center justify-center rounded bg-white/10 px-1.5 font-mono text-[10px]">↓</kbd>
							<span>Navigate</span>
						</span>
						<span class="flex items-center gap-1.5">
							<kbd class="inline-flex h-5 items-center justify-center rounded bg-white/10 px-1.5 font-mono text-[10px]">↵</kbd>
							<span>Select</span>
						</span>
					</div>
					<span class="hidden sm:inline">
						{filteredTraders.length} {filteredTraders.length === 1 ? 'result' : 'results'}
					</span>
				</div>
			</div>
		</div>
	</div>
{/if}
