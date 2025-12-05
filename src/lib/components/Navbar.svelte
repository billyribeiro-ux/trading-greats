<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { cn } from '$lib/utils';
	import { Icon } from '$lib/components/icons';
	import { fade, fly, scale } from 'svelte/transition';
	import { cubicOut, backOut } from 'svelte/easing';

	// ============================================================================
	// STATE
	// ============================================================================
	
	let mobileMenuOpen = $state(false);
	let scrolled = $state(false);
	let menuButtonRef = $state<HTMLButtonElement | undefined>(undefined);
	let mobileNavRefs = $state<(HTMLAnchorElement | undefined)[]>([]);

	// ============================================================================
	// CONSTANTS
	// ============================================================================

	const NAV_LINKS = [
		{ href: '/', label: 'Home', iconType: 'home' as const },
		{ href: '/traders', label: 'Legends', iconType: 'users' as const },
		{ href: '/compare', label: 'Compare', iconType: 'bar-chart' as const },
		{ href: '/blog', label: 'Blog', iconType: 'book-open' as const },
	] as const;

	const SCROLL_THRESHOLD = 20;
	const TRANSITION_DURATION = 300;

	// ============================================================================
	// DERIVED STATE
	// ============================================================================

	const currentPath = $derived($page.url.pathname);

	// ============================================================================
	// EFFECTS
	// ============================================================================

	// Scroll detection with passive listener for performance
	$effect(() => {
		if (!browser) return;

		const handleScroll = () => {
			scrolled = window.scrollY > SCROLL_THRESHOLD;
		};

		handleScroll();

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	});

	// Body scroll lock when mobile menu is open
	$effect(() => {
		if (!browser) return;

		if (mobileMenuOpen) {
			const scrollY = window.scrollY;
			document.body.style.position = 'fixed';
			document.body.style.top = `-${scrollY}px`;
			document.body.style.left = '0';
			document.body.style.right = '0';
			document.body.style.overflow = 'hidden';

			return () => {
				document.body.style.position = '';
				document.body.style.top = '';
				document.body.style.left = '';
				document.body.style.right = '';
				document.body.style.overflow = '';
				window.scrollTo(0, scrollY);
			};
		}
	});

	// Focus management for accessibility
	$effect(() => {
		if (!browser) return;
		
		if (mobileMenuOpen && mobileNavRefs[0]) {
			requestAnimationFrame(() => {
				mobileNavRefs[0]?.focus();
			});
		}
	});

	// Keyboard handler
	$effect(() => {
		if (!browser) return;

		const handleKeydown = (event: KeyboardEvent): void => {
			if (event.key === 'Escape' && mobileMenuOpen) {
				event.preventDefault();
				closeMenu();
			}
		};

		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});

	// ============================================================================
	// HANDLERS
	// ============================================================================

	function isActive(href: string): boolean {
		if (href === '/') return currentPath === '/';
		return currentPath.startsWith(href);
	}

	function toggleMenu(): void {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMenu(): void {
		mobileMenuOpen = false;
		menuButtonRef?.focus();
	}

	function handleNavClick(): void {
		closeMenu();
	}
</script>

<header
	class={cn(
		'fixed top-0 left-0 right-0 z-50',
		'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
		'safe-top', /* MOBILE-FIRST: Support notched devices */
		scrolled
			? 'border-b border-white/[0.08] bg-midnight-950/85 py-2 sm:py-3 shadow-2xl shadow-black/20 backdrop-blur-2xl backdrop-saturate-150'
			: 'border-b border-transparent bg-transparent py-3 sm:py-5'
	)}
>
	<nav 
		class="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
		aria-label="Main navigation"
	>
		<!-- Logo with cinematic hover -->
		<a 
			href="/" 
			class="group flex items-center gap-3 rounded-lg outline-none ring-gold-500/50 transition-all duration-300 focus-visible:ring-2"
			aria-label="Trading Greats - Home"
		>
			<div 
				class={cn(
					'relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl',
					'bg-gradient-to-br from-gold-500 to-gold-600',
					'shadow-lg shadow-gold-500/25',
					'transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
					'will-change-transform',
					'group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-gold-500/40',
					'group-active:scale-95'
				)}
				aria-hidden="true"
			>
				<!-- Shine effect -->
				<div class="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
				<Icon name="candlestick" class="relative h-5 w-5 text-midnight-950 transition-transform duration-300 group-hover:scale-110" strokeWidth={2.5} />
			</div>
			<span class="font-display text-xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-gold-100">
				Trading<span class="text-gold-400 transition-colors duration-300 group-hover:text-gold-300">Greats</span>
			</span>
		</a>

		<!-- Desktop Navigation -->
		<div class="hidden items-center gap-1 md:flex" role="navigation">
			{#each NAV_LINKS as link (link.href)}
				{@const active = isActive(link.href)}
				<a
					href={link.href}
					class={cn(
						'group relative flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium',
						'outline-none ring-gold-500/50 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
						'focus-visible:ring-2',
						active
							? 'text-gold-400'
							: 'text-midnight-300 hover:text-white'
					)}
					aria-current={active ? 'page' : undefined}
				>
					{#if active}
						<div 
							class="absolute inset-0 rounded-full bg-gold-500/10 border border-gold-500/20"
							transition:scale={{ duration: TRANSITION_DURATION, easing: backOut, start: 0.9 }}
						></div>
					{/if}
					
					{#if link.iconType === 'home'}
						<Icon 
							name="candlestick"
							class={cn(
								'relative h-4 w-4 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
								active 
									? 'text-gold-400' 
									: 'text-midnight-400 group-hover:text-gold-400 group-hover:scale-110 group-hover:rotate-3'
							)} 
							strokeWidth={2}
						/>
					{:else if link.iconType === 'users'}
						<Icon 
							name="users"
							class={cn(
								'relative h-4 w-4 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
								active 
									? 'text-gold-400' 
									: 'text-midnight-400 group-hover:text-gold-400 group-hover:scale-110'
							)} 
							strokeWidth={2}
						/>
					{:else if link.iconType === 'book-open'}
						<Icon 
							name="book-open"
							class={cn(
								'relative h-4 w-4 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
								active 
									? 'text-gold-400' 
									: 'text-midnight-400 group-hover:text-gold-400 group-hover:scale-110'
							)} 
							strokeWidth={2}
						/>
					{/if}
					<span class="relative">{link.label}</span>
				</a>
			{/each}
		</div>

		<!-- Actions -->
		<div class="flex items-center gap-1 sm:gap-2">
			<!-- Search Button - MOBILE-FIRST: 44px touch target -->
			<button
				type="button"
				class={cn(
					'group flex h-11 w-11 items-center justify-center rounded-full', /* MOBILE-FIRST: 44px touch target */
					'text-midnight-400 outline-none ring-gold-500/50',
					'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
					'hover:bg-white/5 hover:text-white',
					'focus-visible:ring-2',
					'active:scale-95 active:bg-white/10' /* MOBILE-FIRST: Touch feedback */
				)}
				aria-label="Search traders"
			>
				<Icon 
					name="search"
					class="h-5 w-5 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110" 
					strokeWidth={2}
				/>
			</button>

			<!-- Desktop CTA with shimmer -->
			<a
				href="/about"
				class={cn(
					'hidden items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold md:flex',
					'bg-white text-midnight-950',
					'shadow-lg shadow-white/10',
					'outline-none ring-gold-500 ring-offset-2 ring-offset-midnight-950',
					'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
					'hover:bg-gold-50 hover:shadow-xl hover:shadow-gold-500/20 hover:scale-[1.02]',
					'focus-visible:ring-2',
					'active:scale-95',
					'relative overflow-hidden group'
				)}
			>
				<!-- Shimmer effect -->
				<div class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gold-200/50 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
				<span class="relative">Learn More</span>
				<Icon name="arrow-right" class="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2.5} />
			</a>

			<!-- Mobile Menu Toggle - MOBILE-FIRST: 44px touch target -->
			<button
				bind:this={menuButtonRef}
				type="button"
				class={cn(
					'relative flex h-11 w-11 items-center justify-center rounded-full', /* MOBILE-FIRST: 44px minimum touch target */
					'text-midnight-400 outline-none ring-gold-500/50',
					'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
					'hover:bg-white/5 hover:text-white',
					'focus-visible:ring-2',
					'active:scale-95 active:bg-white/10', /* MOBILE-FIRST: Touch feedback */
					'md:hidden'
				)}
				aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
				aria-expanded={mobileMenuOpen}
				aria-controls="mobile-menu"
				onclick={() => { mobileMenuOpen = !mobileMenuOpen; }}
			>
				{#if mobileMenuOpen}
					<Icon name="x" class="h-6 w-6 transition-transform duration-300" strokeWidth={2} />
				{:else}
					<Icon name="menu" class="h-6 w-6 transition-transform duration-300" strokeWidth={2} />
				{/if}
			</button>
		</div>
	</nav>

	<!-- Mobile Menu Overlay - MOBILE-FIRST: Full screen with safe areas -->
	{#if mobileMenuOpen}
		<div
			id="mobile-menu"
			class="fixed inset-x-0 top-[68px] sm:top-[72px] bottom-0 z-40 overflow-y-auto overscroll-contain bg-midnight-950/98 backdrop-blur-3xl md:hidden safe-bottom"
			transition:fade={{ duration: 200, easing: cubicOut }}
			role="dialog"
			aria-modal="true"
			aria-label="Mobile navigation menu"
		>
			<nav class="flex flex-col p-4 pb-8" aria-label="Mobile navigation">
				{#each NAV_LINKS as link, index (link.href)}
					{@const active = isActive(link.href)}
					<div 
						transition:fly={{ y: 20, duration: 300, delay: index * 50, easing: backOut }}
					>
						<a
							bind:this={mobileNavRefs[index]}
							href={link.href}
							class={cn(
								'flex items-center gap-4 rounded-2xl p-4 text-lg font-medium',
								'outline-none ring-gold-500/50',
								'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
								'focus-visible:ring-2',
								'active:scale-[0.98]',
								active
									? 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
									: 'text-midnight-200 hover:bg-white/5 hover:text-white border border-transparent'
							)}
							aria-current={active ? 'page' : undefined}
							onclick={() => { mobileMenuOpen = false; }}
						>
							<div 
								class={cn(
									'flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300',
									active ? 'bg-gold-500/20 shadow-lg shadow-gold-500/10' : 'bg-white/5'
								)}
								aria-hidden="true"
							>
								{#if link.iconType === 'home'}
									<Icon name="candlestick" class="h-5 w-5" strokeWidth={2} />
								{:else if link.iconType === 'users'}
									<Icon name="users" class="h-5 w-5" strokeWidth={2} />
								{:else if link.iconType === 'book-open'}
									<Icon name="book-open" class="h-5 w-5" strokeWidth={2} />
								{/if}
							</div>
							<span>{link.label}</span>
						</a>
					</div>
				{/each}
				
				<div 
					class="mt-6 border-t border-white/10 pt-6"
					transition:fly={{ y: 20, duration: 300, delay: 150, easing: backOut }}
				>
					<a
						href="/about"
						class={cn(
							'group flex w-full items-center justify-center gap-3 rounded-2xl p-4 text-lg font-bold',
							'bg-gradient-to-r from-gold-500 to-gold-600 text-midnight-950',
							'shadow-xl shadow-gold-500/20',
							'outline-none ring-gold-500 ring-offset-2 ring-offset-midnight-950',
							'transition-all duration-300',
							'focus-visible:ring-2',
							'active:scale-[0.98]',
							'relative overflow-hidden'
						)}
						onclick={() => { mobileMenuOpen = false; }}
					>
						<div class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
						<span class="relative">Learn More</span>
						<Icon name="arrow-right" class="relative h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
					</a>
				</div>
			</nav>
		</div>
	{/if}
</header>

<!-- Spacer - MOBILE-FIRST: Match header height -->
<div class="h-[68px] sm:h-[72px]" aria-hidden="true"></div>
