<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { PUBLIC_SITE_URL } from '$env/static/public';
	import JsonLd from '$lib/components/JsonLd.svelte';
	import { Icon } from '$lib/components/icons';
	import { ScrollReveal } from '$lib/components/motion';
	import { cn } from '$lib/utils';

	const breadcrumbs = [
		{ name: 'Home', url: PUBLIC_SITE_URL },
		{ name: 'About', url: `${PUBLIC_SITE_URL}/about` }
	];

	const coverageItems = [
		{ icon: 'candlestick' as const, title: 'Strategies', subtitle: 'Technical & Fundamental', color: 'green' },
		{ icon: 'users' as const, title: 'Biographies', subtitle: 'Life Stories', color: 'blue' },
		{ icon: 'award' as const, title: 'Famous Trades', subtitle: 'Legendary Moves', color: 'purple' },
		{ icon: 'heart' as const, title: 'Philosophy', subtitle: 'Mindset & Psychology', color: 'red' }
	];

	const colorClasses: Record<string, { bg: string; text: string }> = {
		green: { bg: 'bg-green-500/10', text: 'text-green-500' },
		blue: { bg: 'bg-blue-500/10', text: 'text-blue-500' },
		purple: { bg: 'bg-purple-500/10', text: 'text-purple-500' },
		red: { bg: 'bg-red-500/10', text: 'text-red-500' }
	};
</script>

<SEO
	title="About Trading Greats"
	description="Learn about Trading Greats - your destination for discovering legendary traders, their strategies, and timeless wisdom that has shaped financial markets."
/>

<JsonLd type="BreadcrumbList" {breadcrumbs} />

<div class="min-h-screen bg-midnight-950">
	<!-- Hero Section -->
	<section class="relative pt-32 pb-24 overflow-hidden">
		<!-- Background -->
		<div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
		<div class="absolute inset-0 bg-gradient-to-b from-midnight-950/80 via-midnight-950/90 to-midnight-950"></div>
		
		<!-- Ambient glow -->
		<div class="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[150px] pointer-events-none"></div>
		
		<div class="relative z-10 mx-auto max-w-4xl px-6 lg:px-8 text-center">
			<div 
				class="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 backdrop-blur-md mb-8 opacity-0 animate-hero-fade"
				style="animation-delay: 100ms;"
			>
				<span class="text-xs font-bold uppercase tracking-widest text-gold-400">Our Mission</span>
			</div>
			
			<h1 
				class="font-display text-5xl font-bold text-white sm:text-6xl mb-8 opacity-0 animate-hero-slide"
				style="animation-delay: 200ms;"
			>
				Preserving the <span class="text-gold-500">Wisdom</span> of Markets
			</h1>
			
			<p 
				class="text-xl text-midnight-200 leading-relaxed max-w-2xl mx-auto opacity-0 animate-hero-fade"
				style="animation-delay: 400ms;"
			>
				We believe that studying the greatest traders in history is the most valuable investment you can make in your own trading education.
			</p>
		</div>
	</section>

	<!-- Content Grid -->
	<section class="relative z-20 pb-24 px-6 lg:px-8">
		<div class="mx-auto max-w-5xl">
			<!-- Mission & Approach -->
			<div class="grid gap-8 md:grid-cols-2 mb-16">
				<ScrollReveal delay={0}>
					<div class={cn(
						'group relative overflow-hidden rounded-3xl border border-white/10 bg-midnight-900/30 p-8 backdrop-blur-sm h-full',
						'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
						'hover:bg-midnight-900/50 hover:border-gold-500/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-gold-500/5'
					)}>
						<div class="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-gold-500/5 blur-3xl transition-all duration-700 group-hover:bg-gold-500/15 group-hover:scale-150"></div>
						
						<div class="relative z-10">
							<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/10 mb-6 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110">
								<Icon name="target" class="h-6 w-6 text-gold-500" />
							</div>
							<h2 class="font-display text-2xl font-bold text-white mb-4 transition-colors duration-300 group-hover:text-gold-400">Our Mission</h2>
							<p class="text-midnight-300 leading-relaxed transition-colors duration-300 group-hover:text-midnight-200">
								To document the stories, strategies, and philosophies of legendary traders so that current and future generations can learn from the masters who came before them.
							</p>
						</div>
					</div>
				</ScrollReveal>

				<ScrollReveal delay={100}>
					<div class={cn(
						'group relative overflow-hidden rounded-3xl border border-white/10 bg-midnight-900/30 p-8 backdrop-blur-sm h-full',
						'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
						'hover:bg-midnight-900/50 hover:border-sky-500/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-500/5'
					)}>
						<div class="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-blue-500/5 blur-3xl transition-all duration-700 group-hover:bg-blue-500/15 group-hover:scale-150"></div>
						
						<div class="relative z-10">
							<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 mb-6 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110">
								<Icon name="book-open" class="h-6 w-6 text-blue-500" />
							</div>
							<h2 class="font-display text-2xl font-bold text-white mb-4 transition-colors duration-300 group-hover:text-sky-400">Our Approach</h2>
							<p class="text-midnight-300 leading-relaxed transition-colors duration-300 group-hover:text-midnight-200">
								Every profile is meticulously researched. We go beyond the biography to extract actionable lessons, analyzing the specific trades and mindset shifts that led to their success.
							</p>
						</div>
					</div>
				</ScrollReveal>
			</div>

			<!-- What We Cover -->
			<ScrollReveal>
				<div class="text-center mb-12">
					<h2 class="font-display text-3xl font-bold text-white">What We Cover</h2>
				</div>
			</ScrollReveal>

			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{#each coverageItems as item, i}
					{@const colors = colorClasses[item.color]}
					<ScrollReveal delay={i * 80}>
						<div class={cn(
							'group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-6 text-center h-full',
							'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
							'hover:-translate-y-2 hover:bg-white/10 hover:border-white/10 hover:shadow-xl'
						)}>
							<!-- Glow effect -->
							<div class={cn(
								'absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-50',
								colors.bg
							)}></div>
							
							<div class={cn(
								'mx-auto flex h-12 w-12 items-center justify-center rounded-xl mb-4',
								'transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
								'group-hover:scale-110 group-hover:rotate-3',
								colors.bg
							)}>
								<Icon name={item.icon} class={cn('h-6 w-6', colors.text)} />
							</div>
							<h3 class="font-bold text-white transition-colors duration-300">{item.title}</h3>
							<p class="mt-1 text-sm text-midnight-400 transition-colors duration-300 group-hover:text-midnight-300">{item.subtitle}</p>
						</div>
					</ScrollReveal>
				{/each}
			</div>

			<!-- CTA -->
			<ScrollReveal>
				<div class="mt-24 text-center">
					<a 
						href="/traders"
						class={cn(
							'group inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-bold',
							'bg-gradient-to-r from-gold-500 to-gold-600 text-midnight-950',
							'shadow-xl shadow-gold-500/20',
							'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
							'hover:scale-[1.03] hover:shadow-2xl hover:shadow-gold-500/30',
							'active:scale-[0.98]',
							'relative overflow-hidden'
						)}
					>
						<!-- Shimmer -->
						<div class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
						<span class="relative">Explore the Library</span>
						<Icon name="arrow-right" class="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
					</a>
				</div>
			</ScrollReveal>
		</div>
	</section>
</div>

<style>
	@media (prefers-reduced-motion: reduce) {
		.animate-hero-fade,
		.animate-hero-slide {
			animation: none !important;
			opacity: 1 !important;
			transform: none !important;
		}
	}
</style>
