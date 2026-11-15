<script lang="ts">
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { Icon } from '#lib/components/icons/index.ts';
	import { fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

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
	let dialogRef = $state<HTMLDivElement | undefined>(undefined);
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

	// Cancel pending searches so an older response cannot replace newer results.
	$effect(() => {
		if (!open) {
			traders = [];
			return;
		}
		const query = searchQuery.trim();
		const controller = new AbortController();
		isLoading = true;
		const timer = setTimeout(async () => {
			try {
				const params = new URLSearchParams();
				if (query) params.set('q', query);
				params.set('limit', query ? '8' : '6');
				const res = await fetch(`/api/traders?${params}`, { signal: controller.signal });
				if (res.ok) traders = await res.json();
			} catch (error) {
				if (!controller.signal.aborted) console.error('Trader search failed:', error);
			} finally {
				if (!controller.signal.aborted) isLoading = false;
			}
		}, query ? 200 : 0);
		return () => { clearTimeout(timer); controller.abort(); };
	});

	// Focus input when modal opens
	$effect(() => {
		if (open && browser) {
			const previousFocus = document.activeElement as HTMLElement | null;
			const frame = requestAnimationFrame(() => searchInputRef?.focus());
			return () => { cancelAnimationFrame(frame); previousFocus?.focus(); };
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
		} else if (event.key === 'Tab' && dialogRef) {
			const focusable = Array.from(dialogRef.querySelectorAll<HTMLElement>('input, button:not(:disabled), a[href]'));
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
			else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
		} else if (event.target === searchInputRef && event.key === 'ArrowDown') {
			event.preventDefault();
			selectedIndex = Math.max(0, Math.min(selectedIndex + 1, totalResults - 1));
		} else if (event.target === searchInputRef && event.key === 'ArrowUp') {
			event.preventDefault();
			selectedIndex = Math.max(selectedIndex - 1, 0);
		} else if (event.target === searchInputRef && event.key === 'Enter') {
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
	<div class="search-overlay" transition:fade={{ duration: 180, easing: cubicOut }} onclick={handleBackdropClick} onkeydown={handleKeydown} role="dialog" aria-modal="true" aria-labelledby="search-title" tabindex="-1">
		<div class="search-panel" bind:this={dialogRef} transition:scale={{ duration: 200, easing: cubicOut, start: 0.98 }}>
			<div class="search-heading">
				<div><p class="search-eyebrow">THE TRADING GREATS</p><h2 id="search-title">Explore the library</h2></div>
				<button type="button" class="close-button" onclick={onClose} aria-label="Close search"><Icon name="x" class="h-5 w-5" strokeWidth={1.7} /></button>
			</div>
			<div class="search-field">
				<Icon name="search" class="search-icon" strokeWidth={1.7} />
				<input bind:this={searchInputRef} bind:value={searchQuery} oninput={() => { selectedIndex = 0; }} type="search" aria-label="Search traders" placeholder="Search legendary traders..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />
				{#if searchQuery}<button type="button" class="clear-button" onclick={() => { searchQuery = ''; selectedIndex = 0; searchInputRef?.focus(); }} aria-label="Clear search"><Icon name="x" class="h-4 w-4" strokeWidth={1.7} /></button>{/if}
			</div>
			<div class="search-results">
				{#if !searchQuery}
					<p class="section-label">Quick actions</p>
					{#each quickActions as action, i (action.href)}
						<button type="button" class="result-row" class:selected={selectedIndex === i} onclick={() => handleActionClick(action.href)} onmouseenter={() => { selectedIndex = i; }}>
							<span class="result-icon"><Icon name={action.icon} class="h-5 w-5" strokeWidth={1.6} /></span>
							<span class="result-name">{action.label}</span><Icon name="arrow-right" class="result-arrow" strokeWidth={1.6} />
						</button>
					{/each}
					<p class="section-label section-divider">Popular legends</p>
				{:else if traders.length === 0 && !isLoading}
					<div class="empty-state"><Icon name="search" class="h-7 w-7" strokeWidth={1.5} /><p>No traders found</p><span>Try a different search term.</span></div>
				{/if}
				{#each traders as trader, i (trader.slug)}
					{@const index = searchQuery ? i : i + quickActions.length}
					<button type="button" class="result-row" class:selected={selectedIndex === index} onclick={() => handleTraderClick(trader.slug)} onmouseenter={() => { selectedIndex = index; }}>
						<span class="result-avatar">{trader.name.split(' ').map((n) => n[0]).join('')}</span>
						<span class="result-detail"><span class="result-name">{trader.name}</span><span class="result-style">{trader.tradingStyle ?? ''}</span></span>
						<Icon name="arrow-right" class="result-arrow" strokeWidth={1.6} />
					</button>
				{/each}
			</div>
			<div class="search-footer"><span class="keyboard-help"><kbd>↑</kbd><kbd>↓</kbd> Navigate <kbd>↵</kbd> Select <kbd>esc</kbd> Close</span><span aria-live="polite">{#if isLoading}Searching…{:else}{traders.length} {traders.length === 1 ? 'result' : 'results'}{/if}</span></div>
		</div>
	</div>
{/if}

<style>
	.search-overlay { --search-bg:#101d27; --search-text:#f3f1eb; --search-muted:#aeb9c0; --search-line:rgba(218,222,219,.15); --search-accent:#d7bd91; --search-hover:rgba(201,173,125,.1); --search-icon-bg:#1b2b35; position:fixed; inset:0; z-index:100; display:flex; justify-content:center; align-items:flex-start; overflow-y:auto; padding:clamp(1rem, 10vh, 6rem) 1rem; background:rgba(5,13,19,.76); backdrop-filter:blur(8px); }
	.search-panel { width:min(100%, 42rem); max-height:calc(100dvh - 2rem); display:flex; flex-direction:column; overflow:hidden; border:1px solid rgba(201,173,125,.35); background:var(--search-bg); color:var(--search-text); box-shadow:0 32px 80px rgba(0,0,0,.35); }
	.search-heading { display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; padding:1.5rem 1.5rem 1rem; }
	.search-eyebrow { margin:0 0 .5rem; color:var(--search-accent); font-size:.65rem; font-weight:700; letter-spacing:.16em; }
	.search-heading h2 { margin:0; font-family:'Playfair Display',Georgia,serif; font-size:clamp(1.55rem, 1.2rem + 1vw, 2rem); font-weight:400; line-height:1.2; letter-spacing:-.03em; }
	.close-button,.clear-button { display:grid; place-items:center; flex:none; width:2.75rem; height:2.75rem; border:1px solid var(--search-line); background:transparent; color:var(--search-muted); cursor:pointer; }
	.close-button:hover,.clear-button:hover { color:var(--search-text); border-color:var(--search-accent); }
	.search-field { display:flex; align-items:center; gap:.85rem; margin:0 1.5rem 1rem; padding:0 .8rem; border:1px solid var(--search-line); background:var(--search-hover); }
	.search-field:focus-within { border-color:var(--search-accent); }
	.search-field :global(.search-icon) { flex:none; width:1.25rem; height:1.25rem; color:var(--search-accent); }
	.search-field input { flex:1; min-width:0; height:3.25rem; padding:0; border:0; outline:0; background:transparent; color:var(--search-text); font-size:1rem; }
	.search-field input::placeholder { color:var(--search-muted); opacity:1; }
	.search-field input::-webkit-search-cancel-button { display:none; }
	.clear-button { width:2.25rem; height:2.25rem; border:0; }
	.search-results { flex:1; min-height:0; overflow-y:auto; overscroll-behavior:contain; padding:0 .75rem .75rem; }
	.section-label { margin:0; padding:.75rem .75rem .5rem; color:var(--search-accent); font-size:.65rem; font-weight:700; letter-spacing:.14em; text-transform:uppercase; }
	.section-divider { margin-top:.5rem; border-top:1px solid var(--search-line); }
	.result-row { display:flex; align-items:center; gap:.9rem; width:100%; min-height:3.65rem; padding:.55rem .75rem; border:0; background:transparent; color:var(--search-text); text-align:left; cursor:pointer; }
	.result-row:hover,.result-row.selected,.result-row:focus-visible { background:var(--search-hover); outline:0; }
	.result-row:focus-visible,.close-button:focus-visible,.clear-button:focus-visible { outline:2px solid var(--search-accent); outline-offset:-2px; }
	.result-icon,.result-avatar { display:grid; place-items:center; flex:none; width:2.5rem; height:2.5rem; background:var(--search-icon-bg); color:var(--search-accent); }
	.result-avatar { font-family:'Playfair Display',Georgia,serif; font-size:.9rem; }
	.result-detail { display:grid; flex:1; min-width:0; gap:.1rem; }
	.result-name { flex:1; min-width:0; overflow:hidden; color:var(--search-text); font-size:.9rem; font-weight:600; text-overflow:ellipsis; white-space:nowrap; }
	.result-style { overflow:hidden; color:var(--search-muted); font-size:.75rem; text-overflow:ellipsis; white-space:nowrap; }
	.result-row :global(.result-arrow) { flex:none; width:1rem; height:1rem; margin-left:auto; color:var(--search-muted); }
	.empty-state { display:grid; justify-items:center; gap:.5rem; padding:3rem 1rem; color:var(--search-muted); text-align:center; }
	.empty-state p { margin:0; color:var(--search-text); font-weight:600; }.empty-state span { font-size:.875rem; }
	.search-footer { display:flex; justify-content:space-between; align-items:center; gap:.75rem; padding:.85rem 1.5rem; border-top:1px solid var(--search-line); color:var(--search-muted); font-size:.75rem; }
	.keyboard-help { display:flex; align-items:center; gap:.3rem; }.keyboard-help kbd { padding:.1rem .3rem; border:1px solid var(--search-line); font:inherit; }
	:global(html:not(.dark)) .search-overlay { --search-bg:#f7f5f0; --search-text:#17232b; --search-muted:#53636c; --search-line:rgba(18,30,37,.19); --search-accent:#806336; --search-hover:rgba(128,99,54,.09); --search-icon-bg:#e9e6dd; }
	@media (max-width:25rem) { .search-heading { padding:1.1rem 1rem .8rem; }.search-field { margin:0 1rem .75rem; }.search-footer { padding:.75rem 1rem; }.keyboard-help { display:none; } }
	@media (prefers-reduced-motion:reduce) { .search-overlay,.search-panel { animation-duration:.01ms !important; transition-duration:.01ms !important; } }
</style>
