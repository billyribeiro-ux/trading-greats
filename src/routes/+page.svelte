<script lang="ts">
	import type { PageData } from './$types';
	import TraderCard from '$lib/components/TraderCard.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import { ScrollReveal, AnimatedCounter } from '$lib/components/motion';
	import { Icon } from '$lib/components/icons';
	import { browser } from '$app/environment';
	import { cn } from '$lib/utils';

	// ============================================================================
	// DATA & STATE
	// ============================================================================

	let { data }: { data: PageData } = $props();

	let heroRef = $state<HTMLElement | undefined>(undefined);
	let mounted = $state(false);

	// ============================================================================
	// MOUNT EFFECT
	// ============================================================================

	$effect(() => {
		if (!browser) return;
		mounted = true;
	});

	// ============================================================================
	// CONTENT DATA
	// ============================================================================

	// Trading strategies - matches actual styles in database
	const strategies = [
		{
			name: 'Value Investing',
			icon: 'trending-up' as const,
			color: 'text-emerald-400',
			traders: ['Warren Buffett', 'Benjamin Graham', 'Carl Icahn'],
			description: 'Build lasting wealth through disciplined analysis of intrinsic value.'
		},
		{
			name: 'Momentum Growth',
			icon: 'zap' as const,
			color: 'text-violet-400',
			traders: ['Mark Minervini', 'William O\'Neil', 'Jesse Livermore'],
			description: 'Capture explosive moves with precision timing and trend analysis.'
		},
		{
			name: 'Macro & Currency',
			icon: 'globe' as const,
			color: 'text-sky-400',
			traders: ['George Soros', 'Ray Dalio', 'Paul Tudor Jones'],
			description: 'Navigate global markets through economic and geopolitical insight.'
		},
		{
			name: 'Options & Technical',
			icon: 'line-chart' as const,
			color: 'text-amber-400',
			traders: ['John Carter', 'Linda Raschke', 'Larry Williams'],
			description: 'Master chart patterns and derivatives for consistent edge.'
		}
	];

	// Value propositions - why study trading legends
	const valueProps = [
		{
			icon: 'brain' as const,
			title: 'Battle-Tested Frameworks',
			description: 'Every strategy profiled has survived multiple market cycles, bear markets, and black swan events.'
		},
		{
			icon: 'bar-chart' as const,
			title: 'Real Performance Data',
			description: 'Documented returns, famous trades, and the specific conditions that led to success.'
		},
		{
			icon: 'graduation-cap' as const,
			title: 'Actionable Lessons',
			description: 'Go beyond theory—extract principles you can apply to your own trading today.'
		}
	];

	// How it works steps
	const howItWorksSteps = [
		{
			step: '01',
			title: 'Choose Your Path',
			description: 'Browse by trading style—value, momentum, macro, or technical—to find strategies that match your personality.',
			icon: 'target' as const
		},
		{
			step: '02',
			title: 'Study The Masters',
			description: 'Deep-dive into comprehensive profiles covering biography, philosophy, famous trades, and key lessons.',
			icon: 'book-open' as const
		},
		{
			step: '03',
			title: 'Apply The Principles',
			description: 'Extract actionable frameworks and apply battle-tested strategies to your own trading journey.',
			icon: 'zap' as const
		}
	];

	// Social proof / testimonials
	const testimonials = [
		{
			quote: "Studying Minervini's SEPA methodology completely transformed my approach to growth stocks.",
			author: "Active Trader",
			role: "Momentum Investor"
		},
		{
			quote: "Finally, a resource that treats trading education with the depth it deserves. World-class content.",
			author: "Portfolio Manager",
			role: "Hedge Fund"
		},
		{
			quote: "The biographical context makes these strategies come alive. You understand not just what they did, but why.",
			author: "Retail Trader",
			role: "5 Years Experience"
		}
	];

	// FAQ items
	const faqItems = [
		{
			question: 'Is Trading Greats free to use?',
			answer: 'Yes. All trader profiles, strategies, and educational content are completely free to access. Our mission is to democratize access to world-class trading education.'
		},
		{
			question: 'How do you select which traders to feature?',
			answer: 'We feature traders with documented, verifiable track records spanning multiple market cycles. Each profile represents decades of proven methodology, not short-term luck.'
		},
		{
			question: 'Can I suggest a trader to be featured?',
			answer: 'Absolutely. We\'re always expanding our library. If you know of a legendary trader with a verified track record and unique methodology, let us know.'
		},
		{
			question: 'Is this financial advice?',
			answer: 'No. Trading Greats is educational content only. All trading involves risk, and past performance does not guarantee future results. Always do your own research.'
		}
	];
</script>

<SEO
	title="Trading Greats - Study Strategies From The World's Greatest Traders"
	description="Master proven trading methodologies from legendary investors. Study value investing from Buffett, momentum trading from Minervini, and macro strategies from Soros. Free, evidence-based trading education."
/>

<!-- ============================================================================
     HERO SECTION
     Cinematic, Apple-quality hero with animated gradient background
============================================================================ -->
<section
	bind:this={heroRef}
	class="relative min-h-[100vh] w-full overflow-hidden bg-midnight-950"
>
	<!-- Animated Gradient Background -->
	<div class="absolute inset-0">
		<!-- Primary gradient orbs -->
		<div class="absolute top-[-20%] left-[-10%] h-[800px] w-[800px] rounded-full bg-gradient-radial from-gold-500/20 via-gold-500/5 to-transparent blur-3xl animate-pulse-slower"></div>
		<div class="absolute top-[10%] right-[-15%] h-[600px] w-[600px] rounded-full bg-gradient-radial from-violet-500/15 via-violet-500/5 to-transparent blur-3xl animate-pulse-slow" style="animation-delay: 2s;"></div>
		<div class="absolute bottom-[-10%] left-[30%] h-[500px] w-[500px] rounded-full bg-gradient-radial from-sky-500/10 via-sky-500/5 to-transparent blur-3xl animate-pulse-slower" style="animation-delay: 4s;"></div>

		<!-- Grid pattern overlay -->
		<div class="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_50%,transparent_100%)]"></div>

		<!-- Noise texture -->
		<div class="absolute inset-0 bg-noise opacity-[0.03]"></div>
	</div>

	<div class="relative z-10 mx-auto flex min-h-[100vh] max-w-7xl flex-col justify-center px-6 py-24 lg:px-8">
		<div class="mx-auto max-w-5xl text-center">
			<!-- Trust Badge -->
			<div
				class="mb-10 inline-flex items-center gap-2.5 rounded-full border border-gold-500/30 bg-gold-500/10 px-5 py-2 backdrop-blur-sm opacity-0 animate-hero-fade"
				style="animation-delay: 100ms;"
			>
				<Icon name="sparkles" class="h-4 w-4 text-gold-400" />
				<span class="text-sm font-semibold tracking-wide text-gold-300">
					The Premier Trading Education Library
				</span>
			</div>

			<!-- Main Headline -->
			<h1
				class="font-display text-5xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl opacity-0 animate-hero-slide"
				style="animation-delay: 200ms;"
			>
				Learn From Traders<br />
				<span class="relative">
					<span class="bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 bg-clip-text text-transparent">
						Who Moved Markets
					</span>
					<!-- Animated underline -->
					<span class="absolute -bottom-2 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-0 animate-fade-in" style="animation-delay: 1s;"></span>
				</span>
			</h1>

			<!-- Supporting Copy -->
			<p
				class="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-midnight-300 sm:text-xl md:text-2xl opacity-0 animate-hero-fade"
				style="animation-delay: 400ms;"
			>
				Study the exact methodologies used by history's most successful investors.
				<span class="text-midnight-100">No hype. No shortcuts.</span> Just proven strategies
				that have generated billions.
			</p>

			<!-- CTA Buttons -->
			<div
				class="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row opacity-0 animate-hero-fade"
				style="animation-delay: 600ms;"
			>
				<a
					href="/traders"
					class="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 px-8 py-4 text-base font-bold text-midnight-950 shadow-xl shadow-gold-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-gold-500/30 active:scale-[0.98]"
				>
					<Icon name="users" class="h-5 w-5" />
					Explore All Legends
					<Icon name="arrow-right" class="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
				</a>

				<a
					href="#how-it-works"
					class="group inline-flex items-center gap-3 rounded-full border-2 border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10"
				>
					<Icon name="play" class="h-5 w-5" />
					How It Works
				</a>
			</div>

			<!-- Stats Bar -->
			<div
				class="mt-20 grid grid-cols-3 gap-8 border-t border-white/10 pt-12 opacity-0 animate-hero-fade"
				style="animation-delay: 800ms;"
			>
				<div class="text-center">
					<div class="font-display text-4xl font-bold text-white lg:text-5xl">
						<AnimatedCounter value={data.traders.length} suffix="+" delay={1000} />
					</div>
					<div class="mt-2 text-sm text-midnight-400 lg:text-base">
						Trading Legends
					</div>
				</div>
				<div class="text-center">
					<div class="font-display text-4xl font-bold text-white lg:text-5xl">
						<AnimatedCounter value={200} suffix="+" delay={1100} />
					</div>
					<div class="mt-2 text-sm text-midnight-400 lg:text-base">
						Years of Wisdom
					</div>
				</div>
				<div class="text-center">
					<div class="font-display text-4xl font-bold text-white lg:text-5xl">
						$<AnimatedCounter value={500} suffix="B+" delay={1200} />
					</div>
					<div class="mt-2 text-sm text-midnight-400 lg:text-base">
						Combined Net Worth
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Scroll Indicator -->
	{#if mounted}
		<div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
			<div class="flex flex-col items-center gap-2 text-midnight-500">
				<span class="text-xs font-medium uppercase tracking-widest">Discover</span>
				<Icon name="chevron-down" class="h-5 w-5" />
			</div>
		</div>
	{/if}
</section>

<!-- ============================================================================
     VALUE PROPOSITION SECTION - Apple/Netflix Cinematic
     Why study trading legends?
============================================================================ -->
<section class="relative z-20 bg-midnight-950 py-32 px-6 lg:px-8 overflow-hidden">
	<!-- Cinematic background glow -->
	<div class="absolute inset-0 overflow-hidden">
		<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gradient-radial from-gold-500/5 via-transparent to-transparent blur-3xl"></div>
	</div>

	<div class="relative mx-auto max-w-7xl">
		<!-- Section Header with Netflix-style reveal -->
		<div class="mb-20 text-center cinematic-reveal" style="--delay: 0;">
			<span class="inline-block rounded-full bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold-400 mb-6 border border-white/10">
				Why Trading Greats
			</span>
			<h2 class="font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl leading-[1.1]">
				The Unfair Advantage of<br />
				<span class="bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 bg-clip-text text-transparent">Studying The Best</span>
			</h2>
			<p class="mx-auto mt-8 max-w-2xl text-lg text-midnight-300 leading-relaxed">
				While others chase hot tips and short-term gains, you'll be building
				a foundation of timeless principles from traders who've already solved the game.
			</p>
		</div>

		<!-- Cards Grid - EXACT SAME SIZE with Netflix hover -->
		<div class="grid gap-6 md:grid-cols-3">
			{#each valueProps as prop, i}
				<div 
					class="cinematic-reveal group"
					style="--delay: {0.1 + i * 0.15};"
				>
					<div
						class="relative h-[320px] overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-8 backdrop-blur-xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03] hover:border-gold-500/40 hover:shadow-[0_20px_70px_-15px_rgba(234,179,8,0.3)] hover:bg-gradient-to-b hover:from-white/[0.12] hover:to-white/[0.04]"
					>
						<!-- Netflix-style ambient glow on hover -->
						<div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-gold-500/0 via-gold-500/0 to-gold-500/0 transition-all duration-700 group-hover:from-gold-500/10 group-hover:via-transparent group-hover:to-gold-500/5"></div>
						
						<!-- Content container with fixed layout -->
						<div class="relative z-10 flex h-full flex-col">
							<!-- Icon with Apple-style spring animation -->
							<div class="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-500/20 to-gold-600/10 text-gold-400 ring-1 ring-gold-500/30 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg group-hover:shadow-gold-500/20">
								<Icon name={prop.icon} class="h-8 w-8" />
							</div>
							
							<!-- Title - fixed height -->
							<h3 class="mb-4 font-display text-2xl font-bold text-white transition-colors duration-300 group-hover:text-gold-400">
								{prop.title}
							</h3>
							
							<!-- Description - fills remaining space -->
							<p class="flex-1 text-midnight-300 leading-relaxed text-base">
								{prop.description}
							</p>
						</div>
						
						<!-- Hover shine effect -->
						<div class="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 pointer-events-none overflow-hidden rounded-3xl">
							<div class="absolute -inset-full top-0 h-[500%] w-[200%] -translate-x-full rotate-45 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ============================================================================
     FEATURED LEGENDS SECTION - Netflix Cinematic
     Showcase top traders with premium cards
============================================================================ -->
<section class="relative z-20 bg-gradient-to-b from-midnight-950 via-midnight-900/50 to-midnight-950 py-32 px-6 lg:px-8 overflow-hidden">
	<!-- Ambient background effects -->
	<div class="absolute inset-0">
		<div class="absolute top-1/3 left-0 w-[500px] h-[500px] bg-gradient-radial from-gold-500/5 to-transparent blur-3xl"></div>
		<div class="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-radial from-violet-500/5 to-transparent blur-3xl"></div>
	</div>

	<div class="relative mx-auto max-w-7xl">
		<div class="mb-16 flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end cinematic-reveal" style="--delay: 0;">
			<div class="text-center sm:text-left">
				<span class="inline-block rounded-full bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold-400 mb-4 border border-white/10">
					Featured Legends
				</span>
				<h2 class="font-display text-4xl font-bold text-white sm:text-5xl">
					Most Studied This Month
				</h2>
			</div>
			<a
				href="/traders"
				class="group flex items-center gap-3 text-sm font-bold text-gold-500 transition-all duration-300 hover:text-gold-400 hover:gap-4"
			>
				View All Legends
				<Icon name="arrow-right" class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
			</a>
		</div>

		<!-- Grid - ALL CARDS SAME SIZE -->
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each data.traders.slice(0, 4) as trader, i}
				<div class="cinematic-reveal" style="--delay: {0.15 + i * 0.1};">
					<TraderCard {trader} index={i} />
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ============================================================================
     HOW IT WORKS SECTION
     Clear 3-step process
============================================================================ -->
<ScrollReveal as="section" id="how-it-works" class="relative z-20 bg-midnight-950 py-28 px-6 lg:px-8">
	<div class="mx-auto max-w-7xl">
		<div class="mb-20 text-center">
			<span class="inline-block rounded-full bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold-400 mb-6">
				How It Works
			</span>
			<h2 class="font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
				Your Path to Trading Mastery
			</h2>
			<p class="mx-auto mt-6 max-w-2xl text-lg text-midnight-300">
				Three simple steps to extract decades of market wisdom and apply it to your own journey.
			</p>
		</div>

		<div class="grid gap-8 lg:grid-cols-3">
			{#each howItWorksSteps as step, i}
				<ScrollReveal delay={i * 120}>
					<div class="group relative">
						<!-- Connection line (not on last item) -->
						{#if i < howItWorksSteps.length - 1}
							<div class="hidden lg:block absolute top-16 left-[calc(50%+60px)] w-[calc(100%-60px)] h-px bg-gradient-to-r from-gold-500/50 to-transparent"></div>
						{/if}

						<div class="relative flex flex-col items-center text-center">
							<!-- Step number -->
							<div class="relative mb-8">
								<div class="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-midnight-800 to-midnight-900 border border-white/10 transition-all duration-500 group-hover:border-gold-500/30 group-hover:shadow-2xl group-hover:shadow-gold-500/10">
									<Icon name={step.icon} class="h-12 w-12 text-gold-500 transition-transform duration-500 group-hover:scale-110" />
								</div>
								<div class="absolute -top-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-gold-500 text-sm font-bold text-midnight-950 shadow-lg shadow-gold-500/30">
									{step.step}
								</div>
							</div>

							<h3 class="mb-4 font-display text-xl font-bold text-white">
								{step.title}
							</h3>
							<p class="text-midnight-300 leading-relaxed max-w-xs">
								{step.description}
							</p>
						</div>
					</div>
				</ScrollReveal>
			{/each}
		</div>

		<div class="mt-16 text-center">
			<a
				href="/traders"
				class="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 px-10 py-5 text-base font-bold text-midnight-950 shadow-xl shadow-gold-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-gold-500/30 active:scale-[0.98]"
			>
				Start Your Journey
				<Icon name="arrow-right" class="h-5 w-5 transition-transform group-hover:translate-x-1" />
			</a>
		</div>
	</div>
</ScrollReveal>

<!-- ============================================================================
     TRADING STRATEGIES SECTION - Netflix Cinematic Cards
     Browse by methodology
============================================================================ -->
<section class="relative z-20 bg-gradient-to-b from-midnight-950 via-midnight-900/30 to-midnight-950 py-32 px-6 lg:px-8 overflow-hidden">
	<!-- Ambient background -->
	<div class="absolute inset-0">
		<div class="absolute top-0 left-1/4 w-[600px] h-[400px] bg-gradient-radial from-violet-500/5 to-transparent blur-3xl"></div>
		<div class="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-gradient-radial from-gold-500/5 to-transparent blur-3xl"></div>
	</div>

	<div class="relative mx-auto max-w-7xl">
		<div class="mb-20 text-center cinematic-reveal" style="--delay: 0;">
			<span class="inline-block rounded-full bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold-400 mb-6 border border-white/10">
				Trading Styles
			</span>
			<h2 class="font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl leading-[1.1]">
				Find Your <span class="bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 bg-clip-text text-transparent">Edge</span>
			</h2>
			<p class="mx-auto mt-8 max-w-2xl text-lg text-midnight-300 leading-relaxed">
				Every successful trader has a defined methodology. Explore the major schools of thought and discover which approach resonates with you.
			</p>
		</div>

		<!-- Cards Grid - EXACT SAME SIZE: 280px height -->
		<div class="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
			{#each strategies as strategy, i}
				<div 
					class="cinematic-reveal"
					style="--delay: {0.1 + i * 0.1};"
				>
					<a
						href="/traders?style={encodeURIComponent(strategy.name)}"
						class="group relative flex flex-col h-[280px] overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-transparent backdrop-blur-xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04] hover:border-gold-500/40 hover:shadow-[0_25px_80px_-20px_rgba(234,179,8,0.35)]"
					>
						<!-- Netflix hover glow -->
						<div class="absolute inset-0 rounded-3xl bg-gradient-to-t from-gold-500/0 to-gold-500/0 transition-all duration-500 group-hover:from-gold-500/15 group-hover:to-transparent"></div>
						
						<!-- Content -->
						<div class="relative z-10 flex flex-col h-full p-7">
							<!-- Icon with color -->
							<div class={cn(
								'mb-5 flex h-14 w-14 items-center justify-center rounded-2xl',
								'bg-gradient-to-br from-white/10 to-white/5 ring-1 ring-white/10',
								'transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
								'group-hover:scale-110 group-hover:rotate-6 group-hover:ring-gold-500/30',
								strategy.color
							)}>
								<Icon name={strategy.icon} class="h-7 w-7" />
							</div>

							<!-- Title -->
							<h3 class="mb-2 font-display text-xl font-bold text-white transition-colors duration-300 group-hover:text-gold-400">
								{strategy.name}
							</h3>

							<!-- Description - fixed 2 lines -->
							<p class="mb-auto text-sm text-midnight-400 leading-relaxed line-clamp-2">
								{strategy.description}
							</p>

							<!-- Traders Pills - always at bottom -->
							<div class="flex flex-wrap gap-1.5 mt-4">
								{#each strategy.traders as traderName}
									<span class="inline-flex items-center rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-medium text-midnight-300 border border-white/5 transition-all duration-300 group-hover:bg-gold-500/10 group-hover:border-gold-500/20 group-hover:text-gold-300">
										{traderName}
									</span>
								{/each}
							</div>
						</div>

						<!-- Arrow indicator with cinematic slide -->
						<div class="absolute top-6 right-6 opacity-0 translate-x-4 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:opacity-100 group-hover:translate-x-0">
							<Icon name="arrow-right" class="h-5 w-5 text-gold-400" />
						</div>
						
						<!-- Shine sweep effect -->
						<div class="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none overflow-hidden rounded-3xl">
							<div class="absolute -inset-full top-0 h-[500%] w-[200%] -translate-x-full rotate-45 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>
						</div>
					</a>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ============================================================================
     ALL LEGENDS GRID - Netflix Cinematic
     Complete library preview
============================================================================ -->
<section class="relative z-20 bg-midnight-950 py-32 px-6 lg:px-8 overflow-hidden">
	<div class="relative mx-auto max-w-7xl">
		<div class="mb-16 text-center cinematic-reveal" style="--delay: 0;">
			<span class="inline-block rounded-full bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold-400 mb-6 border border-white/10">
				The Library
			</span>
			<h2 class="font-display text-4xl font-bold text-white sm:text-5xl">
				Decades of <span class="bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 bg-clip-text text-transparent">Market Wisdom</span>
			</h2>
			<p class="mt-6 text-midnight-400 max-w-xl mx-auto text-lg">
				Each profile represents a lifetime of learning, distilled into actionable principles.
			</p>
		</div>

		<!-- Grid - ALL CARDS SAME SIZE -->
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each data.traders.slice(0, 8) as trader, i}
				<div class="cinematic-reveal" style="--delay: {0.1 + i * 0.08};">
					<TraderCard {trader} index={i} />
				</div>
			{/each}
		</div>

		<div class="mt-20 text-center cinematic-reveal" style="--delay: 0.8;">
			<a
				href="/traders"
				class="group inline-flex items-center gap-3 rounded-full bg-white/5 border border-white/10 px-12 py-5 text-base font-bold text-white backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white/10 hover:border-gold-500/30 hover:shadow-[0_20px_60px_-15px_rgba(234,179,8,0.2)] hover:scale-[1.02]"
			>
				View Complete Library
				<Icon name="arrow-right" class="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
			</a>
		</div>
	</div>
</section>

<!-- ============================================================================
     TESTIMONIALS SECTION
     Social proof
============================================================================ -->
<ScrollReveal as="section" class="relative z-20 bg-gradient-to-b from-midnight-950 via-midnight-900/30 to-midnight-950 py-28 px-6 lg:px-8">
	<div class="mx-auto max-w-7xl">
		<div class="mb-16 text-center">
			<span class="inline-block rounded-full bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold-400 mb-6">
				Community
			</span>
			<h2 class="font-display text-3xl font-bold text-white sm:text-4xl">
				Trusted by Serious Traders
			</h2>
		</div>

		<div class="grid gap-8 lg:grid-cols-3">
			{#each testimonials as testimonial, i}
				<ScrollReveal delay={i * 100}>
					<div class="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-b from-midnight-900/60 to-midnight-900/30 p-8 backdrop-blur-sm">
						<!-- Quote icon -->
						<Icon name="quote" class="absolute top-6 right-6 h-8 w-8 text-gold-500/20" />

						<!-- Stars -->
						<div class="flex gap-1 mb-6">
							{#each Array(5) as _, starIndex}
								<Icon name="star" class="h-4 w-4 fill-gold-500 text-gold-500" />
							{/each}
						</div>

						<blockquote class="relative z-10 text-lg text-midnight-200 leading-relaxed mb-6">
							"{testimonial.quote}"
						</blockquote>

						<div class="flex items-center gap-3">
							<div class="h-10 w-10 rounded-full bg-gradient-to-br from-gold-500/20 to-gold-600/20 flex items-center justify-center">
								<span class="text-sm font-bold text-gold-400">
									{testimonial.author[0]}
								</span>
							</div>
							<div>
								<p class="font-medium text-white">{testimonial.author}</p>
								<p class="text-sm text-midnight-400">{testimonial.role}</p>
							</div>
						</div>
					</div>
				</ScrollReveal>
			{/each}
		</div>
	</div>
</ScrollReveal>

<!-- ============================================================================
     FAQ SECTION
============================================================================ -->
<ScrollReveal as="section" class="relative z-20 bg-midnight-950 py-28 px-6 lg:px-8">
	<div class="mx-auto max-w-4xl">
		<div class="mb-16 text-center">
			<span class="inline-block rounded-full bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold-400 mb-6">
				FAQ
			</span>
			<h2 class="font-display text-3xl font-bold text-white sm:text-4xl">
				Frequently Asked Questions
			</h2>
		</div>

		<div class="space-y-4">
			{#each faqItems as faq, i}
				<ScrollReveal delay={i * 80}>
					<details class="group rounded-2xl border border-white/5 bg-midnight-900/30 backdrop-blur-sm overflow-hidden">
						<summary class="flex cursor-pointer items-center justify-between p-6 text-left font-medium text-white hover:text-gold-400 transition-colors">
							<span class="pr-6">{faq.question}</span>
							<Icon name="chevron-right" class="h-5 w-5 flex-shrink-0 text-midnight-500 transition-transform group-open:rotate-90" />
						</summary>
						<div class="px-6 pb-6 text-midnight-300 leading-relaxed">
							{faq.answer}
						</div>
					</details>
				</ScrollReveal>
			{/each}
		</div>
	</div>
</ScrollReveal>

<!-- ============================================================================
     FINAL CTA SECTION
============================================================================ -->
<ScrollReveal as="section" class="relative z-20 py-32 px-6 lg:px-8 overflow-hidden">
	<!-- Background gradient -->
	<div class="absolute inset-0 bg-gradient-to-b from-midnight-950 via-midnight-900 to-midnight-950"></div>
	<div class="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"></div>

	<!-- Ambient glow -->
	<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-gold-500/5 blur-[120px]"></div>

	<div class="relative z-10 mx-auto max-w-4xl text-center">
		<div class="mb-8 inline-flex items-center gap-2.5 rounded-full border border-gold-500/30 bg-gold-500/10 px-5 py-2 backdrop-blur-sm">
			<Icon name="check-circle" class="h-4 w-4 text-gold-400" />
			<span class="text-sm font-semibold text-gold-300">
				100% Free to Explore
			</span>
		</div>

		<h2 class="font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
			Start Learning From<br />
			<span class="text-gold-400">The Greatest Today</span>
		</h2>

		<p class="mx-auto mt-8 max-w-2xl text-lg text-midnight-300 sm:text-xl">
			Join thousands of traders who are building their edge with battle-tested
			strategies from history's most successful investors.
		</p>

		<div class="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
			<a
				href="/traders"
				class="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 px-10 py-5 text-base font-bold text-midnight-950 shadow-xl shadow-gold-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-gold-500/30 active:scale-[0.98]"
			>
				<Icon name="users" class="h-5 w-5" />
				Explore All Legends
				<Icon name="arrow-right" class="h-5 w-5 transition-transform group-hover:translate-x-1" />
			</a>
		</div>

		<!-- Trust indicators -->
		<div class="mt-16 flex flex-wrap items-center justify-center gap-8 text-midnight-500">
			<div class="flex items-center gap-2">
				<Icon name="shield" class="h-5 w-5" />
				<span class="text-sm">No Sign-up Required</span>
			</div>
			<div class="flex items-center gap-2">
				<Icon name="clock" class="h-5 w-5" />
				<span class="text-sm">Updated Regularly</span>
			</div>
			<div class="flex items-center gap-2">
				<Icon name="book-open" class="h-5 w-5" />
				<span class="text-sm">Research-Backed</span>
			</div>
		</div>
	</div>
</ScrollReveal>

<style>
	/* =========================================================================
	   APPLE/NETFLIX CINEMATIC ANIMATIONS
	   ========================================================================= */
	
	/* Cinematic scroll reveal - Netflix style blur + slide */
	.cinematic-reveal {
		opacity: 0;
		transform: translateY(60px) scale(0.95);
		filter: blur(10px);
		animation: cinematicReveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		animation-delay: calc(var(--delay, 0) * 1s + 0.2s);
	}
	
	@keyframes cinematicReveal {
		0% {
			opacity: 0;
			transform: translateY(60px) scale(0.95);
			filter: blur(10px);
		}
		100% {
			opacity: 1;
			transform: translateY(0) scale(1);
			filter: blur(0);
		}
	}
	
	/* Netflix card 3D perspective on hover */
	.netflix-card {
		perspective: 1000px;
		transform-style: preserve-3d;
	}
	
	.netflix-card:hover {
		transform: translateZ(20px);
	}
	
	/* Apple-style smooth text reveal */
	.text-reveal {
		overflow: hidden;
	}
	
	.text-reveal span {
		display: inline-block;
		animation: textSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		animation-delay: calc(var(--char-delay, 0) * 0.03s);
		opacity: 0;
		transform: translateY(100%);
	}
	
	@keyframes textSlideUp {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	/* Glow pulse for featured elements */
	.glow-pulse {
		animation: glowPulse 3s ease-in-out infinite;
	}
	
	@keyframes glowPulse {
		0%, 100% {
			box-shadow: 0 0 20px rgba(234, 179, 8, 0.2);
		}
		50% {
			box-shadow: 0 0 40px rgba(234, 179, 8, 0.4);
		}
	}
	
	/* Netflix hover brightness boost */
	.brightness-hover {
		transition: filter 0.5s ease;
	}
	
	.brightness-hover:hover {
		filter: brightness(1.1) saturate(1.1);
	}
	
	/* Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		.animate-hero-fade,
		.animate-hero-slide,
		.cinematic-reveal {
			animation: none !important;
			opacity: 1 !important;
			transform: none !important;
			filter: none !important;
		}
	}
</style>
