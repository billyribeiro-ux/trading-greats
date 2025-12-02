<script lang="ts">
	import type { PageData } from './$types';
	import TraderCard from '$lib/components/TraderCard.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import { 
		ArrowRight, 
		TrendingUp, 
		Award, 
		BookOpen, 
		Globe,
		Target,
		Users,
		BookMarked,
		Sparkles,
		ChevronRight,
		CheckCircle2
	} from 'lucide-svelte';
	import { browser } from '$app/environment';

	let { data }: { data: PageData } = $props();

	let mounted = $state(false);
	let heroRef = $state<HTMLElement | undefined>(undefined);
	
	// Animated stats counters
	let tradersCount = $state(0);
	let strategiesCount = $state(0);
	let yearsCount = $state(0);

	// Intersection observer for scroll reveals
	let revealsMap = $state(new Map<string, boolean>());

	// Mount effect for animations
	$effect(() => {
		if (!browser) return;
		mounted = true;

		// Animate stats counters on mount
		const duration = 2000;
		const startTime = Date.now();
		
		const animate = () => {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
			
			tradersCount = Math.floor(eased * data.traders.length);
			strategiesCount = Math.floor(eased * 12); // Number of unique strategies
			yearsCount = Math.floor(eased * 200); // Years of combined experience
			
			if (progress < 1) {
				requestAnimationFrame(animate);
			}
		};
		
		// Delay start slightly for better UX
		const timeout = setTimeout(animate, 300);
		
		return () => clearTimeout(timeout);
	});

	// Scroll reveal effect
	$effect(() => {
		if (!browser) return;

		// Immediately reveal all sections on mount - fixes visibility bug
		const sections = document.querySelectorAll('[data-reveal]');
		sections.forEach((section) => {
			if (section.id) {
				revealsMap.set(section.id, true);
			}
		});
		revealsMap = revealsMap; // Trigger reactivity

		return () => {};
	});

	// Helper to check if section is revealed
	function isRevealed(id: string): boolean {
		return revealsMap.get(id) ?? false;
	}

	// Trading strategies data
	const strategies = [
		{ 
			name: 'Value Investing', 
			iconType: 'trending' as const, 
			color: 'text-green-400', 
			bg: 'bg-green-500/10', 
			border: 'border-green-500/20',
			traders: ['Warren Buffett', 'Benjamin Graham', 'Peter Lynch'],
			description: 'Long-term wealth through undervalued assets'
		},
		{ 
			name: 'Momentum Growth', 
			iconType: 'award' as const, 
			color: 'text-purple-400', 
			bg: 'bg-purple-500/10', 
			border: 'border-purple-500/20',
			traders: ['Mark Minervini', 'William O\'Neil'],
			description: 'Ride powerful trends with precision timing'
		},
		{ 
			name: 'Macro Trading', 
			iconType: 'globe' as const, 
			color: 'text-blue-400', 
			bg: 'bg-blue-500/10', 
			border: 'border-blue-500/20',
			traders: ['George Soros', 'Paul Tudor Jones'],
			description: 'Global markets through economic forces'
		},
		{ 
			name: 'Technical Analysis', 
			iconType: 'book' as const, 
			color: 'text-orange-400', 
			bg: 'bg-orange-500/10', 
			border: 'border-orange-500/20',
			traders: ['Jesse Livermore', 'Richard Dennis'],
			description: 'Chart patterns and price action mastery'
		}
	];

	// Value propositions
	const valueProps = [
		{
			iconType: 'bookmarked' as const,
			title: 'Proven Methodologies',
			description: 'Study the exact strategies used by legends who turned thousands into billions'
		},
		{
			iconType: 'users' as const,
			title: 'Learn From The Best',
			description: 'Deep-dive profiles of history\'s most successful traders and their frameworks'
		},
		{
			iconType: 'target' as const,
			title: 'Evidence-Based Approach',
			description: 'Real trades, real results, real lessons from decades of market experience'
		}
	];
</script>

<SEO
	title="Trading Greats - Master Strategies From History's Greatest Traders"
	description="Study proven methodologies from legendary traders. Learn value investing from Buffett, momentum trading from Minervini, and macro strategies from Soros. Evidence-based trading education."
/>

<!-- Hero Section -->
<section 
	bind:this={heroRef}
	class="relative min-h-[95vh] w-full overflow-hidden bg-gradient-to-b from-midnight-950 via-midnight-900 to-midnight-950"
>
	<!-- Animated Background Pattern -->
	<div class="absolute inset-0 opacity-20">
		<div class="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
	</div>

	<!-- Ambient Glow Effects -->
	<div class="pointer-events-none absolute inset-0">
		<div class="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-gold-500/10 blur-[120px] animate-pulse-slow"></div>
		<div class="absolute top-1/3 right-1/4 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[100px] animate-pulse-slow" style="animation-delay: 1s;"></div>
	</div>

	<div class="relative z-10 mx-auto flex min-h-[95vh] max-w-7xl flex-col justify-center px-6 py-20 lg:px-8">
		<div class="mx-auto max-w-4xl text-center">
			<!-- Badge -->
			<div 
				class="hero-badge mb-8 inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-5 py-2 backdrop-blur-sm"
			>
				<Sparkles class="h-4 w-4 text-gold-400" />
				<span class="text-sm font-semibold text-gold-400">
					Evidence-Based Trading Education
				</span>
			</div>

			<!-- Main Headline -->
			<h1 class="hero-title font-display text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
				Master Strategies From<br />
				<span class="bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 bg-clip-text text-transparent">
					History's Greatest Traders
				</span>
			</h1>

			<!-- Supporting Copy -->
			<p class="hero-subtitle mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-midnight-200 sm:text-xl lg:text-2xl">
				Study the proven methodologies of legendary investors and traders. 
				From value investing to momentum trading—learn what actually works.
			</p>

			<!-- CTA Buttons -->
			<div class="hero-ctas mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
				<a 
					href="/traders"
					class="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 px-8 py-4 text-base font-bold text-midnight-950 shadow-xl shadow-gold-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-gold-500/40 active:scale-[0.98]"
				>
					<Target class="h-5 w-5" />
					Explore Strategies
					<ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
				</a>
				
				<a 
					href="/about"
					class="group inline-flex items-center gap-2 rounded-full border-2 border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10"
				>
					<BookOpen class="h-5 w-5" />
					Learn More
				</a>
			</div>

			<!-- Stats Bar -->
			<div class="hero-stats mt-20 grid grid-cols-3 gap-8 border-t border-white/10 pt-12">
				<div class="text-center">
					<div class="text-4xl font-bold text-white lg:text-5xl">
						{tradersCount}+
					</div>
					<div class="mt-2 text-sm text-midnight-400 lg:text-base">
						Trading Legends
					</div>
				</div>
				<div class="text-center">
					<div class="text-4xl font-bold text-white lg:text-5xl">
						{strategiesCount}+
					</div>
					<div class="mt-2 text-sm text-midnight-400 lg:text-base">
						Proven Strategies
					</div>
				</div>
				<div class="text-center">
					<div class="text-4xl font-bold text-white lg:text-5xl">
						{yearsCount}+
					</div>
					<div class="mt-2 text-sm text-midnight-400 lg:text-base">
						Years Experience
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Scroll Indicator -->
	{#if mounted}
		<div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
			<div class="flex flex-col items-center gap-2 text-midnight-500">
				<span class="text-xs font-medium uppercase tracking-wider">Scroll</span>
				<ChevronRight class="h-5 w-5 rotate-90" />
			</div>
		</div>
	{/if}
</section>

<!-- Value Props Section -->
<section 
	id="value-props"
	data-reveal
	class="relative z-20 bg-midnight-950 py-24 px-6 lg:px-8"
	class:opacity-0={!isRevealed('value-props')}
	class:translate-y-8={!isRevealed('value-props')}
	style="transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);"
>
	<div class="mx-auto max-w-7xl">
		<div class="mb-16 text-center">
			<h2 class="font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
				Why Study Trading Legends?
			</h2>
			<p class="mx-auto mt-4 max-w-2xl text-lg text-midnight-300">
				Learn from those who've already mastered the game
			</p>
		</div>

		<div class="grid gap-8 md:grid-cols-3">
			{#each valueProps as prop, i}
				<div 
					class="group relative overflow-hidden rounded-2xl border border-white/5 bg-midnight-900/50 p-8 backdrop-blur-sm transition-all duration-300 hover:border-gold-500/30 hover:bg-midnight-800/50"
					style="animation-delay: {i * 100}ms;"
				>
					<div class="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400 ring-1 ring-gold-500/20 transition-transform duration-300 group-hover:scale-110">
						{#if prop.iconType === 'bookmarked'}
							<BookMarked class="h-7 w-7" />
						{:else if prop.iconType === 'users'}
							<Users class="h-7 w-7" />
						{:else if prop.iconType === 'target'}
							<Target class="h-7 w-7" />
						{/if}
					</div>
					<h3 class="mb-3 font-display text-xl font-bold text-white">
						{prop.title}
					</h3>
					<p class="text-midnight-300 leading-relaxed">
						{prop.description}
					</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Featured Legends Section -->
<section 
	id="featured"
	data-reveal
	class="relative z-20 bg-midnight-900/30 py-24 px-6 lg:px-8"
	class:opacity-0={!isRevealed('featured')}
	class:translate-y-8={!isRevealed('featured')}
	style="transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s;"
>
	<div class="mx-auto max-w-7xl">
		<div class="mb-12 flex items-end justify-between">
			<div>
				<h2 class="font-display text-3xl font-bold text-white sm:text-4xl">
					Featured Legends
				</h2>
				<p class="mt-2 text-midnight-400">
					Most studied profiles this month
				</p>
			</div>
			<a 
				href="/traders" 
				class="group hidden items-center gap-2 text-sm font-semibold text-gold-500 transition-colors hover:text-gold-400 sm:flex"
			>
				View All
				<ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
			</a>
		</div>

		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each data.traders.slice(0, 4) as trader, i}
				<div style="animation-delay: {i * 80}ms;">
					<TraderCard {trader} index={i} />
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Trading Strategies Section -->
<section 
	id="strategies"
	data-reveal
	class="relative z-20 bg-midnight-950 py-24 px-6 lg:px-8"
	class:opacity-0={!isRevealed('strategies')}
	class:translate-y-8={!isRevealed('strategies')}
	style="transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s;"
>
	<div class="mx-auto max-w-7xl">
		<div class="mb-16 text-center">
			<h2 class="font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
				Explore By Strategy
			</h2>
			<p class="mx-auto mt-4 max-w-2xl text-lg text-midnight-300">
				From value investing to momentum trading—discover the methodology that fits your style
			</p>
		</div>

		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each strategies as strategy, i}
				<a 
					href="/traders?style={encodeURIComponent(strategy.name)}"
					class="group relative overflow-hidden rounded-2xl border {strategy.border} {strategy.bg} p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
					style="animation-delay: {i * 80}ms;"
				>
					<!-- Icon & Arrow -->
					<div class="mb-6 flex items-center justify-between">
						<div class="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 {strategy.color} transition-transform duration-300 group-hover:scale-110">
							{#if strategy.iconType === 'trending'}
								<TrendingUp class="h-6 w-6" />
							{:else if strategy.iconType === 'award'}
								<Award class="h-6 w-6" />
							{:else if strategy.iconType === 'globe'}
								<Globe class="h-6 w-6" />
							{:else if strategy.iconType === 'book'}
								<BookOpen class="h-6 w-6" />
							{/if}
						</div>
						<ArrowRight class="h-5 w-5 text-midnight-500 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 -translate-x-2" />
					</div>

					<!-- Title -->
					<h3 class="mb-3 font-display text-xl font-bold text-white">
						{strategy.name}
					</h3>

					<!-- Description -->
					<p class="mb-4 text-sm text-midnight-400 leading-relaxed">
						{strategy.description}
					</p>

					<!-- Traders Pills -->
					<div class="flex flex-wrap gap-2">
						{#each strategy.traders.slice(0, 2) as traderName}
							<span class="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-midnight-300">
								{traderName}
							</span>
						{/each}
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- All Legends Grid -->
<section 
	id="all-legends"
	data-reveal
	class="relative z-20 bg-midnight-900/30 py-24 px-6 lg:px-8"
	class:opacity-0={!isRevealed('all-legends')}
	class:translate-y-8={!isRevealed('all-legends')}
	style="transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s;"
>
	<div class="mx-auto max-w-7xl">
		<div class="mb-12 text-center">
			<h2 class="font-display text-3xl font-bold text-white sm:text-4xl">
				The Complete Library
			</h2>
			<p class="mt-4 text-midnight-400">
				Decades of market wisdom, all in one place
			</p>
		</div>

		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each data.traders.slice(4, 12) as trader, i}
				<div style="animation-delay: {i * 60}ms;">
					<TraderCard {trader} index={i + 4} />
				</div>
			{/each}
		</div>

		<div class="mt-16 text-center">
			<a 
				href="/traders"
				class="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 px-10 py-5 text-base font-bold text-midnight-950 shadow-xl shadow-gold-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-gold-500/40 active:scale-[0.98]"
			>
				Explore Full Library
				<ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
			</a>
		</div>
	</div>
</section>

<!-- Final CTA Section -->
<section class="relative z-20 bg-gradient-to-b from-midnight-950 to-midnight-900 py-32 px-6 lg:px-8">
	<div class="mx-auto max-w-4xl text-center">
		<div class="mb-8 inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-5 py-2">
			<CheckCircle2 class="h-4 w-4 text-gold-400" />
			<span class="text-sm font-semibold text-gold-400">
				100% Free to Explore
			</span>
		</div>

		<h2 class="font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
			Start Learning From<br />The Best Today
		</h2>

		<p class="mx-auto mt-6 max-w-2xl text-lg text-midnight-300 sm:text-xl">
			Access detailed profiles, trading strategies, and proven methodologies from history's most successful traders.
		</p>

		<div class="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
			<a 
				href="/traders"
				class="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 px-10 py-5 text-base font-bold text-midnight-950 shadow-xl shadow-gold-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-gold-500/40 active:scale-[0.98]"
			>
				<Users class="h-5 w-5" />
				Browse All Legends
				<ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
			</a>
		</div>
	</div>
</section>

<style>
	/* Hero animations */
	.hero-badge {
		animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
	}

	.hero-title {
		animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
	}

	.hero-subtitle {
		animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
	}

	.hero-ctas {
		animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both;
	}

	.hero-stats {
		animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s both;
	}

	@keyframes fade-in-up {
		from {
			opacity: 0;
			transform: translateY(24px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Slow pulse animation for ambient glows */
	@keyframes pulse-slow {
		0%, 100% {
			opacity: 0.3;
		}
		50% {
			opacity: 0.5;
		}
	}

	.animate-pulse-slow {
		animation: pulse-slow 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	/* Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		.hero-badge,
		.hero-title,
		.hero-subtitle,
		.hero-ctas,
		.hero-stats {
			animation: none;
			opacity: 1;
			transform: none;
		}

		.animate-pulse-slow {
			animation: none;
		}
	}
</style>
