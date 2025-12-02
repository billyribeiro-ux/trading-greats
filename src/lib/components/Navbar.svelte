<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { cn } from '$lib/utils';
	import { Menu, X, TrendingUp, Users, Search, ArrowRight } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

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
	] as const;

	const SCROLL_THRESHOLD = 20;
	const TRANSITION_DURATION = 200;

	// ============================================================================
	// DERIVED STATE
	// ============================================================================

	const currentPath = $derived($page.url.pathname);

	// ============================================================================
	// EFFECTS
	// ============================================================================

	// Scroll detection with passive listener for performance (Google best practice)
	$effect(() => {
		if (!browser) return;

		const handleScroll = () => {
			scrolled = window.scrollY > SCROLL_THRESHOLD;
		};

		// Initial check
		handleScroll();

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	});

	// Body scroll lock when mobile menu is open (Apple/Netflix pattern)
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

	// Focus management for accessibility (WCAG 2.1 AA compliance)
	$effect(() => {
		if (!browser) return;
		
		if (mobileMenuOpen && mobileNavRefs[0]) {
			// Small delay to ensure DOM is ready
			requestAnimationFrame(() => {
				mobileNavRefs[0]?.focus();
			});
		}
	});

	// Keyboard handler with SSR guard
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
		// Return focus to menu button (accessibility best practice)
		menuButtonRef?.focus();
	}

	function handleNavClick(): void {
		closeMenu();
	}
</script>

<header
	class={cn(
		'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out',
		scrolled
			? 'border-b border-white/[0.08] bg-midnight-950/80 py-3 shadow-xl shadow-black/10 backdrop-blur-xl backdrop-saturate-150'
			: 'border-b border-transparent bg-transparent py-5'
	)}
>
	<nav 
		class="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
		aria-label="Main navigation"
	>
		<!-- Logo -->
		<a 
			href="/" 
			class="group flex items-center gap-3 rounded-lg outline-none ring-gold-500/50 transition-all focus-visible:ring-2"
			aria-label="Trading Greats - Home"
		>
			<div 
				class="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 shadow-lg shadow-gold-500/25 transition-transform duration-300 will-change-transform group-hover:scale-105 group-active:scale-95"
				aria-hidden="true"
			>
				<TrendingUp class="h-5 w-5 text-midnight-950" strokeWidth={2.5} />
			</div>
			<span class="font-display text-xl font-bold tracking-tight text-white">
				Trading<span class="text-gold-400">Greats</span>
			</span>
		</a>

		<!-- Desktop Navigation -->
		<div class="hidden items-center gap-1 md:flex" role="navigation">
			{#each NAV_LINKS as link (link.href)}
				{@const active = isActive(link.href)}
				<a
					href={link.href}
					class={cn(
						'group relative flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium outline-none ring-gold-500/50 transition-all duration-200 focus-visible:ring-2',
						active
							? 'text-gold-400'
							: 'text-midnight-300 hover:text-white'
					)}
					aria-current={active ? 'page' : undefined}
				>
					{#if active}
						<div 
							class="absolute inset-0 rounded-full bg-gold-500/10"
							transition:fade={{ duration: TRANSITION_DURATION, easing: cubicOut }}
						></div>
					{/if}
					
					{#if link.iconType === 'home'}
						<TrendingUp 
							class={cn(
								'relative h-4 w-4 transition-all duration-200',
								active 
									? 'text-gold-400' 
									: 'text-midnight-400 group-hover:text-white group-hover:scale-110'
							)} 
							strokeWidth={2}
							aria-hidden="true"
						/>
					{:else}
						<Users 
							class={cn(
								'relative h-4 w-4 transition-all duration-200',
								active 
									? 'text-gold-400' 
									: 'text-midnight-400 group-hover:text-white group-hover:scale-110'
							)} 
							strokeWidth={2}
							aria-hidden="true"
						/>
					{/if}
					<span class="relative">{link.label}</span>
				</a>
			{/each}
		</div>

		<!-- Actions -->
		<div class="flex items-center gap-2">
			<!-- Search Button -->
			<button
				type="button"
				class="group flex h-10 w-10 items-center justify-center rounded-full text-midnight-400 outline-none ring-gold-500/50 transition-all duration-200 hover:bg-white/5 hover:text-white focus-visible:ring-2"
				aria-label="Search traders"
			>
				<Search 
					class="h-5 w-5 transition-transform duration-200 group-hover:scale-110" 
					strokeWidth={2}
					aria-hidden="true"
				/>
			</button>

			<!-- Desktop CTA -->
			<a
				href="/about"
				class="hidden items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-midnight-950 shadow-lg shadow-white/10 outline-none ring-gold-500 ring-offset-2 ring-offset-midnight-950 transition-all duration-200 hover:bg-gold-50 hover:shadow-white/20 focus-visible:ring-2 active:scale-95 md:flex"
			>
				Learn More
				<ArrowRight class="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
			</a>

			<!-- Mobile Menu Toggle -->
			<button
				bind:this={menuButtonRef}
				type="button"
				class="flex h-10 w-10 items-center justify-center rounded-full text-midnight-400 outline-none ring-gold-500/50 transition-all duration-200 hover:bg-white/5 hover:text-white focus-visible:ring-2 md:hidden"
				aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
				aria-expanded={mobileMenuOpen}
				aria-controls="mobile-menu"
				onclick={toggleMenu}
			>
				{#if mobileMenuOpen}
					<X class="h-6 w-6" strokeWidth={2} aria-hidden="true" />
				{:else}
					<Menu class="h-6 w-6" strokeWidth={2} aria-hidden="true" />
				{/if}
			</button>
		</div>
	</nav>

	<!-- Mobile Menu Overlay -->
	{#if mobileMenuOpen}
		<div 
			id="mobile-menu"
			class="fixed inset-x-0 top-[72px] bottom-0 z-40 overflow-y-auto overscroll-contain bg-midnight-950/98 backdrop-blur-2xl md:hidden"
			transition:fade={{ duration: TRANSITION_DURATION, easing: cubicOut }}
			role="dialog"
			aria-modal="true"
			aria-label="Mobile navigation menu"
		>
			<nav class="flex flex-col p-4" aria-label="Mobile navigation">
				{#each NAV_LINKS as link, index (link.href)}
					{@const active = isActive(link.href)}
					<a
						bind:this={mobileNavRefs[index]}
						href={link.href}
						class={cn(
							'flex items-center gap-4 rounded-2xl p-4 text-lg font-medium outline-none ring-gold-500/50 transition-all duration-200 focus-visible:ring-2 active:scale-[0.98]',
							active
								? 'bg-gold-500/10 text-gold-400'
								: 'text-midnight-200 hover:bg-white/5 hover:text-white'
						)}
						aria-current={active ? 'page' : undefined}
						onclick={handleNavClick}
					>
						<div 
							class={cn(
								'flex h-12 w-12 items-center justify-center rounded-xl transition-colors',
								active ? 'bg-gold-500/20' : 'bg-white/5'
							)}
							aria-hidden="true"
						>
							{#if link.iconType === 'home'}
								<TrendingUp class="h-5 w-5" strokeWidth={2} />
							{:else}
								<Users class="h-5 w-5" strokeWidth={2} />
							{/if}
						</div>
						<span>{link.label}</span>
					</a>
				{/each}
				
				<div class="mt-6 border-t border-white/10 pt-6">
					<a
						href="/about"
						class="flex w-full items-center justify-center gap-3 rounded-2xl bg-white p-4 text-lg font-bold text-midnight-950 shadow-xl shadow-white/10 outline-none ring-gold-500 ring-offset-2 ring-offset-midnight-950 transition-all duration-200 focus-visible:ring-2 active:scale-[0.98]"
						onclick={handleNavClick}
					>
						Learn More
						<ArrowRight class="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
					</a>
				</div>
			</nav>
		</div>
	{/if}
</header>

<!-- Spacer to prevent content from being hidden under fixed header -->
<div class="h-[72px]" aria-hidden="true"></div>
