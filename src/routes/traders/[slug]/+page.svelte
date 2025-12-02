<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import JsonLd from '$lib/components/JsonLd.svelte';
	import TraderCard from '$lib/components/TraderCard.svelte';
	import { PUBLIC_SITE_URL } from '$env/static/public';
	import { marked } from 'marked';
	import {
		TrendingUp,
		Globe,
		DollarSign,
		Calendar,
		Award,
		Quote,
		BookOpen,
		ExternalLink,
		ArrowRight,
		ChevronRight,
		Target,
		Lightbulb,
		History,
		Share2
	} from 'lucide-svelte';

	let { data } = $props();
	const { trader, relatedTraders } = data;

	const breadcrumbs = [
		{ name: 'Home', url: PUBLIC_SITE_URL },
		{ name: 'Traders', url: `${PUBLIC_SITE_URL}/traders` },
		{ name: trader.name, url: `${PUBLIC_SITE_URL}/traders/${trader.slug}` }
	];

	// Parse markdown bio
	const parsedBio = $derived(trader.bio ? marked.parse(trader.bio) : '');

	// Calculate age or lifespan
	const lifespan = $derived.by(() => {
		if (!trader.birthYear) return null;
		if (trader.deathYear) {
			return `${trader.birthYear} - ${trader.deathYear} (${trader.deathYear - trader.birthYear} years)`;
		}
		const age = new Date().getFullYear() - trader.birthYear;
		return `Born ${trader.birthYear} (${age} years old)`;
	});
</script>

<SEO
	title="{trader.name} - {trader.oneLiner}"
	description={trader.bio?.substring(0, 160) || `Learn about ${trader.name}, ${trader.oneLiner}. Discover their trading strategy, philosophy, and famous trades.`}
	image={trader.photoUrl || undefined}
	type="profile"
/>

<JsonLd type="Person" {trader} />
<JsonLd type="BreadcrumbList" {breadcrumbs} />
<JsonLd type="Article" {trader} />

<div class="min-h-screen bg-midnight-950 pb-24">
	<!-- Hero Background -->
	<div class="fixed inset-0 z-0 pointer-events-none">
		<div class="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-midnight-900 to-midnight-950 opacity-50"></div>
		<div class="absolute top-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-gold-500/5 blur-[100px]"></div>
		<div class="absolute top-[20%] left-[-10%] h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[100px]"></div>
	</div>

	<div class="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 pt-32">
		<!-- Breadcrumbs -->
		<nav class="mb-8 flex items-center gap-2 text-sm text-midnight-400">
			<a href="/" class="hover:text-gold-400 transition-colors">Home</a>
			<ChevronRight class="h-4 w-4" />
			<a href="/traders" class="hover:text-gold-400 transition-colors">Traders</a>
			<ChevronRight class="h-4 w-4" />
			<span class="text-white font-medium">{trader.name}</span>
		</nav>

		<div class="grid gap-12 lg:grid-cols-12">
			<!-- Left Column: Sticky Profile (4 cols) -->
			<div class="lg:col-span-4">
				<div class="sticky top-32 space-y-6">
					<!-- Profile Image Card -->
					<div class="group relative overflow-hidden rounded-2xl border border-white/10 bg-midnight-900/50 backdrop-blur-xl shadow-2xl">
						<div class="aspect-[4/5] w-full overflow-hidden">
							<img
								src={trader.photoUrl}
								alt={trader.name}
								class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
								style:view-transition-name="trader-image-{trader.slug}"
							/>
							<div class="absolute inset-0 bg-gradient-to-t from-midnight-950 via-transparent to-transparent opacity-60"></div>
						</div>
						
						<div class="absolute bottom-0 left-0 right-0 p-6">
							<h1 class="font-display text-3xl font-bold text-white">{trader.name}</h1>
							<p class="mt-2 text-gold-400 font-medium">{trader.tradingStyle}</p>
						</div>
					</div>

					<!-- Quick Stats -->
					<div class="rounded-2xl border border-white/5 bg-midnight-900/30 p-6 backdrop-blur-sm">
						<h3 class="mb-4 text-sm font-bold uppercase tracking-wider text-midnight-400">Key Stats</h3>
						<div class="space-y-4">
							{#if trader.netWorth}
								<div class="flex items-center gap-3">
									<div class="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-500">
										<DollarSign class="h-5 w-5" />
									</div>
									<div>
										<p class="text-xs text-midnight-400">Net Worth</p>
										<p class="font-medium text-white">{trader.netWorth}</p>
									</div>
								</div>
							{/if}
							{#if trader.nationality}
								<div class="flex items-center gap-3">
									<div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
										<Globe class="h-5 w-5" />
									</div>
									<div>
										<p class="text-xs text-midnight-400">Nationality</p>
										<p class="font-medium text-white">{trader.nationality}</p>
									</div>
								</div>
							{/if}
							{#if lifespan}
								<div class="flex items-center gap-3">
									<div class="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10 text-purple-500">
										<Calendar class="h-5 w-5" />
									</div>
									<div>
										<p class="text-xs text-midnight-400">Lifespan</p>
										<p class="font-medium text-white">{lifespan}</p>
									</div>
								</div>
							{/if}
						</div>
					</div>

					<!-- Share / Actions -->
					<div class="flex gap-3">
						<button class="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors">
							<Share2 class="h-4 w-4" />
							Share Profile
						</button>
					</div>
				</div>
			</div>

			<!-- Right Column: Content (8 cols) -->
			<div class="lg:col-span-8 space-y-12">
				
				<!-- Bio Section -->
				<section>
					<h2 class="mb-6 flex items-center gap-3 font-display text-2xl font-bold text-white">
						<History class="h-6 w-6 text-gold-500" />
						Biography
					</h2>
					<div class="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-a:text-gold-400 hover:prose-a:text-gold-300">
						{@html parsedBio}
					</div>
				</section>

				<!-- Philosophy Section -->
				{#if trader.philosophy}
					<section class="relative overflow-hidden rounded-3xl border border-white/10 bg-midnight-900/30 p-8 backdrop-blur-sm">
						<div class="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-gold-500/5 blur-3xl"></div>
						<h2 class="mb-6 flex items-center gap-3 font-display text-2xl font-bold text-white">
							<Lightbulb class="h-6 w-6 text-gold-500" />
							Trading Philosophy
						</h2>
						<div class="prose prose-invert max-w-none text-midnight-100">
							<p>{trader.philosophy}</p>
						</div>
					</section>
				{/if}

				<!-- Famous Trades -->
				{#if trader.famousTrades && trader.famousTrades.length > 0}
					<section>
						<h2 class="mb-6 flex items-center gap-3 font-display text-2xl font-bold text-white">
							<TrendingUp class="h-6 w-6 text-gold-500" />
							Famous Trades
						</h2>
						<div class="grid gap-4">
							{#each trader.famousTrades as trade}
								<div class="group rounded-xl border border-white/5 bg-midnight-900/30 p-6 transition-all hover:border-gold-500/30 hover:bg-midnight-800/50">
									<h3 class="font-bold text-white group-hover:text-gold-400 transition-colors">{trade}</h3>
								</div>
							{/each}
						</div>
					</section>
				{/if}

				<!-- Quotes -->
				{#if trader.quotes && trader.quotes.length > 0}
					<section>
						<h2 class="mb-6 flex items-center gap-3 font-display text-2xl font-bold text-white">
							<Quote class="h-6 w-6 text-gold-500" />
							Legendary Quotes
						</h2>
						<div class="grid gap-6">
							{#each trader.quotes as quote}
								<figure class="relative rounded-2xl bg-white/5 p-8">
									<Quote class="absolute top-4 left-4 h-8 w-8 text-white/10 rotate-180" />
									<blockquote class="relative z-10 text-lg font-medium italic text-midnight-100">
										"{quote}"
									</blockquote>
								</figure>
							{/each}
						</div>
					</section>
				{/if}

				<!-- Related Traders -->
				{#if relatedTraders && relatedTraders.length > 0}
					<section class="pt-12 border-t border-white/5">
						<h2 class="mb-8 font-display text-2xl font-bold text-white">Similar Legends</h2>
						<div class="grid gap-6 sm:grid-cols-2">
							{#each relatedTraders as related, i}
								<TraderCard trader={related} index={i} />
							{/each}
						</div>
					</section>
				{/if}
			</div>
		</div>
	</div>
</div>
