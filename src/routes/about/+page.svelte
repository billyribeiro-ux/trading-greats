<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { PUBLIC_SITE_URL } from '$env/static/public';
	import JsonLd from '$lib/components/JsonLd.svelte';
	import { TrendingUp, Target, Users, BookOpen, Award, Heart, ArrowRight } from 'lucide-svelte';

	const breadcrumbs = [
		{ name: 'Home', url: PUBLIC_SITE_URL },
		{ name: 'About', url: `${PUBLIC_SITE_URL}/about` }
	];
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
		
		<div class="relative z-10 mx-auto max-w-4xl px-6 lg:px-8 text-center">
			<div class="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 backdrop-blur-md mb-8">
				<span class="text-xs font-bold uppercase tracking-widest text-gold-400">Our Mission</span>
			</div>
			
			<h1 class="font-display text-5xl font-bold text-white sm:text-6xl mb-8">
				Preserving the <span class="text-gold-500">Wisdom</span> of Markets
			</h1>
			
			<p class="text-xl text-midnight-200 leading-relaxed max-w-2xl mx-auto">
				We believe that studying the greatest traders in history is the most valuable investment you can make in your own trading education.
			</p>
		</div>
	</section>

	<!-- Content Grid -->
	<section class="relative z-20 pb-24 px-6 lg:px-8">
		<div class="mx-auto max-w-5xl">
			<!-- Mission & Approach -->
			<div class="grid gap-8 md:grid-cols-2 mb-16">
				<div class="group relative overflow-hidden rounded-3xl border border-white/10 bg-midnight-900/30 p-8 backdrop-blur-sm transition-all hover:bg-midnight-900/50">
					<div class="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-gold-500/5 blur-3xl transition-all group-hover:bg-gold-500/10"></div>
					
					<div class="relative z-10">
						<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/10 mb-6">
							<Target class="h-6 w-6 text-gold-500" />
						</div>
						<h2 class="font-display text-2xl font-bold text-white mb-4">Our Mission</h2>
						<p class="text-midnight-300 leading-relaxed">
							To document the stories, strategies, and philosophies of legendary traders so that current and future generations can learn from the masters who came before them.
						</p>
					</div>
				</div>

				<div class="group relative overflow-hidden rounded-3xl border border-white/10 bg-midnight-900/30 p-8 backdrop-blur-sm transition-all hover:bg-midnight-900/50">
					<div class="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-blue-500/5 blur-3xl transition-all group-hover:bg-blue-500/10"></div>
					
					<div class="relative z-10">
						<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 mb-6">
							<BookOpen class="h-6 w-6 text-blue-500" />
						</div>
						<h2 class="font-display text-2xl font-bold text-white mb-4">Our Approach</h2>
						<p class="text-midnight-300 leading-relaxed">
							Every profile is meticulously researched. We go beyond the biography to extract actionable lessons, analyzing the specific trades and mindset shifts that led to their success.
						</p>
					</div>
				</div>
			</div>

			<!-- What We Cover -->
			<div class="text-center mb-12">
				<h2 class="font-display text-3xl font-bold text-white">What We Cover</h2>
			</div>

			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
				<!-- Strategies -->
				<div class="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-6 text-center transition-all hover:-translate-y-1 hover:bg-white/10">
					<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 mb-4 transition-transform group-hover:scale-110">
						<TrendingUp class="h-6 w-6 text-green-500" />
					</div>
					<h3 class="font-bold text-white">Strategies</h3>
					<p class="mt-1 text-sm text-midnight-400">Technical & Fundamental</p>
				</div>
				<!-- Biographies -->
				<div class="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-6 text-center transition-all hover:-translate-y-1 hover:bg-white/10">
					<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 mb-4 transition-transform group-hover:scale-110">
						<Users class="h-6 w-6 text-blue-500" />
					</div>
					<h3 class="font-bold text-white">Biographies</h3>
					<p class="mt-1 text-sm text-midnight-400">Life Stories</p>
				</div>
				<!-- Famous Trades -->
				<div class="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-6 text-center transition-all hover:-translate-y-1 hover:bg-white/10">
					<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 mb-4 transition-transform group-hover:scale-110">
						<Award class="h-6 w-6 text-purple-500" />
					</div>
					<h3 class="font-bold text-white">Famous Trades</h3>
					<p class="mt-1 text-sm text-midnight-400">Legendary Moves</p>
				</div>
				<!-- Philosophy -->
				<div class="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-6 text-center transition-all hover:-translate-y-1 hover:bg-white/10">
					<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 mb-4 transition-transform group-hover:scale-110">
						<Heart class="h-6 w-6 text-red-500" />
					</div>
					<h3 class="font-bold text-white">Philosophy</h3>
					<p class="mt-1 text-sm text-midnight-400">Mindset & Psychology</p>
				</div>
			</div>

			<!-- CTA -->
			<div class="mt-24 text-center">
				<a 
					href="/traders"
					class="inline-flex items-center gap-2 rounded-full bg-gold-500 px-8 py-4 text-sm font-bold text-midnight-950 transition-all hover:bg-gold-400 hover:scale-105"
				>
					Explore the Library
					<ArrowRight class="h-4 w-4" />
				</a>
			</div>
		</div>
	</section>
</div>
