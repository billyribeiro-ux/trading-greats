<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { Icon } from '$lib/components/icons';
	import { fade, scale } from 'svelte/transition';
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
	let traders = $state<{ name: string; slug: string; tradingStyle: string | null; oneLiner: string | null }[]>([]);

	// Quick actions
	const quickActions = [
		{ label: 'View All Legends', href: '/traders', icon: 'users' as const },
		{ label: 'Compare Traders', href: '/compare', icon: 'bar-chart' as const },
		{ label: 'Read Blog', href: '/blog', icon: 'book-open' as const },
	];

	// ============================================================================
	// DERIVED
	// ============================================================================

	const totalResults = $derived(traders.length + (searchQuery ? 0 : quickActions.length));

	// ============================================================================
	// EFFECTS
	// ============================================================================

	let debounceTimer: ReturnType<typeof setTimeout>;

	// Fetch traders from API whenever query or open state changes
	$effect(() => {
		if (!open) {
			traders = [];
			return;
		}
		clearTimeout(debounceTimer);
		isLoading = true;
		debounceTimer = setTimeout(async () => {
			try {
				const params = new URLSearchParams();
				if (searchQuery.trim()) params.set('q', searchQuery.trim());
				params.set('limit', searchQuery.trim() ? '8' : '6');
				const res = await fetch(`/api/traders?${params}`);
				if (res.ok) traders = await res.json();
			} finally {
				isLoading = false;
			}
		}, searchQuery.trim() ? 200 : 0);
	});

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
			if (traders[selectedIndex]) {
				onClose();
				goto(`/traders/${traders[selectedIndex].slug}`);
			}
		} else {
			if (selectedIndex < quickActions.length) {
				onClose();
				goto(quickActions[selectedIndex].href);
			} else {
				const traderIndex = selectedIndex - quickActions.length;
				if (traders[traderIndex]) {
					onClose();
					goto(`/traders/${traders[traderIndex].slug}`);
				}
			}
		}
	}

	function handleTraderClick(slug: string) {
		onClose();
		goto(`/traders/${slug}`);
	}

	function handleActionClick(href: string) {
		onClose();
		goto(href);
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			onClose();
		}
	}
</script>

{#if open}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-100 flex items-start justify-center pt-[10vh] sm:pt-[15vh] px-4"
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
					{#each quickActions as action, i (action.href)}
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
				{:else if traders.length === 0 && !isLoading}
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
				{#each traders as trader, i (trader.slug)}
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
								? 'bg-linear-to-br from-gold-500 to-gold-600 text-midnight-950' 
								: 'bg-white/10 text-white'
						)}>
							{trader.name.split(' ').map(n => n[0]).join('')}
						</div>
						<div class="flex-1 min-w-0">
							<p class="font-medium truncate">{trader.name}</p>
							<p class="text-sm text-midnight-400 truncate">{trader.tradingStyle ?? ''}</p>
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
						{#if isLoading}
					Searching...
				{:else}
					{traders.length} {traders.length === 1 ? 'result' : 'results'}
				{/if}
					</span>
				</div>
			</div>
		</div>
	</div>
{/if}
