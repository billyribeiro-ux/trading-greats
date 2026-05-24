<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import JsonLd from '$lib/components/JsonLd.svelte';
	import TraderCard from '$lib/components/TraderCard.svelte';
	import TraderArticleCard from '$lib/components/TraderArticleCard.svelte';
	import SocialShareButtons from '$lib/components/SocialShareButtons.svelte';
	import { env } from '$env/dynamic/public';
	import { parse } from 'marked';

	const PUBLIC_SITE_URL = env.PUBLIC_SITE_URL || 'https://tradinggreats.com';
	import { Icon } from '$lib/components/icons';
	import type { PageData } from './$types';

	// ============================================================================
	// PROPS (Svelte 5 - SSR data hydration)
	// ============================================================================
	let { data }: { data: PageData } = $props();
	const trader = $derived(data.trader);
	const relatedTraders = $derived(data.relatedTraders);
	const articles = $derived(data.articles);
	const gallery = $derived(data.gallery ?? []);

	// Lightbox state
	let lightboxIndex = $state<number | null>(null);
	const lightboxImage = $derived(lightboxIndex !== null ? gallery[lightboxIndex] : null);

	function openLightbox(index: number) {
		lightboxIndex = index;
	}

	function closeLightbox() {
		lightboxIndex = null;
	}

	function lightboxNext() {
		if (lightboxIndex !== null && lightboxIndex < gallery.length - 1) {
			lightboxIndex = lightboxIndex + 1;
		}
	}

	function lightboxPrev() {
		if (lightboxIndex !== null && lightboxIndex > 0) {
			lightboxIndex = lightboxIndex - 1;
		}
	}

	const breadcrumbs = $derived([
		{ name: 'Home', url: PUBLIC_SITE_URL },
		{ name: 'Traders', url: `${PUBLIC_SITE_URL}/traders` },
		{ name: trader.name, url: `${PUBLIC_SITE_URL}/traders/${trader.slug}` }
	]);

	// Parse markdown bio
	const parsedBio = $derived(trader.bio ? parse(trader.bio) : '');

	// Calculate age or lifespan
	const lifespan = $derived.by(() => {
		if (!trader.birthYear) return null;
		if (trader.deathYear) {
			return `${trader.birthYear} - ${trader.deathYear} (${trader.deathYear - trader.birthYear} years)`;
		}
		const age = new Date().getFullYear() - trader.birthYear;
		return `Born ${trader.birthYear} (${age} years old)`;
	});

	// Page URL for sharing
	const pageUrl = $derived(`${PUBLIC_SITE_URL}/traders/${trader.slug}`);

	// Generate FAQ items for structured data
	const faqItems = $derived.by(() => {
		const faqs: { question: string; answer: string }[] = [];

		// Basic info questions
		faqs.push({
			question: `Who is ${trader.name}?`,
			answer: trader.bio?.split('\n')[0] || `${trader.name} is a legendary trader known for ${trader.oneLiner?.toLowerCase() || 'their exceptional trading strategies'}.`
		});

		if (trader.tradingStyle) {
			faqs.push({
				question: `What is ${trader.name}'s trading style?`,
				answer: `${trader.name} is known for ${trader.tradingStyle}. ${trader.philosophy ? trader.philosophy.substring(0, 200) + '...' : ''}`
			});
		}

		if (trader.netWorth) {
			faqs.push({
				question: `What is ${trader.name}'s net worth?`,
				answer: `${trader.name}'s estimated net worth is ${trader.netWorth}. This wealth was accumulated through their successful ${trader.tradingStyle?.toLowerCase() || 'trading'} strategies.`
			});
		}

		if (trader.books && trader.books.length > 0) {
			const bookTitles = trader.books.map(b => b.title).join(', ');
			faqs.push({
				question: `What books has ${trader.name} written?`,
				answer: `${trader.name} has authored several books on trading and investing, including: ${bookTitles}.`
			});
		}

		if (trader.quotes && trader.quotes.length > 0) {
			faqs.push({
				question: `What are ${trader.name}'s most famous quotes?`,
				answer: `One of ${trader.name}'s most famous quotes is: "${trader.quotes[0].text}". This reflects their core philosophy on trading and markets.`
			});
		}

		return faqs;
	});
</script>

<SEO
	title="{trader.name} - {trader.oneLiner}"
	description={trader.bio?.substring(0, 160) || `Learn about ${trader.name}, ${trader.oneLiner}. Discover their trading strategy, philosophy, and famous trades.`}
	image={trader.photoUrl || undefined}
	type="profile"
/>

<JsonLd type="Person" {trader} />
<JsonLd type="ProfilePage" {trader} />
<JsonLd type="Article" {trader} />
<JsonLd type="FAQPage" {faqItems} />

<div class="min-h-screen bg-midnight-950 pb-16 sm:pb-20 lg:pb-24">
	<!-- Hero Background - MOBILE-FIRST: Smaller orbs on mobile -->
	<div class="fixed inset-0 z-0 pointer-events-none">
		<div class="absolute top-0 left-0 right-0 h-[40vh] sm:h-[50vh] bg-linear-to-b from-midnight-900 to-midnight-950 opacity-50"></div>
		<div class="absolute top-[-10%] right-[-5%] h-[250px] w-[250px] sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px] rounded-full bg-gold-500/5 blur-[80px] sm:blur-[100px]"></div>
		<div class="absolute top-[20%] left-[-10%] h-[200px] w-[200px] sm:h-[300px] sm:w-[300px] lg:h-[400px] lg:w-[400px] rounded-full bg-blue-500/5 blur-[80px] sm:blur-[100px]"></div>
	</div>

	<div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-16">
		<!-- Hero Header Section -->
		<header class="mb-12 sm:mb-16 lg:mb-20">
			<div class="flex flex-col items-center text-center">
				<h1 class="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-4 sm:mb-6">
					{trader.name}
				</h1>
				<p class="text-lg sm:text-xl lg:text-2xl text-midnight-200 leading-relaxed mb-6 sm:mb-8 max-w-3xl">
					{trader.oneLiner}
				</p>
				<div class="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
					{#if trader.tradingStyle}
						<div class="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500/10 border border-gold-500/20">
							<span class="h-1.5 w-1.5 rounded-full bg-gold-500 animate-pulse"></span>
							<span class="text-sm font-medium text-gold-400">{trader.tradingStyle}</span>
						</div>
					{/if}
					{#if trader.netWorth}
						<div class="flex items-center gap-2 px-4 py-2 rounded-xl bg-midnight-800/50 border border-white/5">
							<Icon name="trending-up" class="h-4 w-4 text-green-400" />
							<span class="text-sm font-medium text-white">{trader.netWorth}</span>
						</div>
					{/if}
					{#if trader.nationality}
						<div class="flex items-center gap-2 px-4 py-2 rounded-xl bg-midnight-800/50 border border-white/5">
							<Icon name="globe" class="h-4 w-4 text-blue-400" />
							<span class="text-sm font-medium text-white">{trader.nationality}</span>
						</div>
					{/if}
				</div>
			</div>
			<div class="mt-8 sm:mt-10 h-px bg-linear-to-r from-transparent via-gold-500/30 to-transparent"></div>
		</header>

		<!-- MOBILE-FIRST: Stack on mobile, 2-column on desktop -->
		<div class="grid gap-8 sm:gap-10 lg:gap-12 lg:grid-cols-12">
			<!-- Left Column: Profile (4 cols) - MOBILE-FIRST: Full width on mobile, sticky on desktop -->
			<div class="lg:col-span-4">
				<div class="lg:sticky lg:top-24 space-y-4 sm:space-y-6">
					<!-- Profile Image Card - MOBILE-FIRST -->
					<div class="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-midnight-900/50 backdrop-blur-xl shadow-2xl">
						<div class="aspect-3/4 sm:aspect-4/5 w-full overflow-hidden">
							<img
								src={trader.photoUrl}
								alt={trader.name}
								class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
								style:view-transition-name="trader-image-{trader.slug}"
								loading="eager"
								fetchpriority="high"
								decoding="async"
							/>
							<div class="absolute inset-0 bg-linear-to-t from-midnight-950 via-transparent to-transparent opacity-60"></div>
						</div>

						<div class="absolute bottom-0 left-0 right-0 p-4 sm:p-5 lg:p-6">
							<h1 class="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-white">{trader.name}</h1>
							<p class="mt-1 sm:mt-2 text-sm sm:text-base text-gold-400 font-medium">{trader.tradingStyle}</p>
						</div>
					</div>

					<!-- Quick Stats - MOBILE-FIRST: Horizontal on mobile, stacked on desktop -->
					<div class="rounded-xl sm:rounded-2xl border border-white/5 bg-midnight-900/30 p-4 sm:p-5 lg:p-6 backdrop-blur-sm">
						<h3 class="mb-3 sm:mb-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-midnight-400">Key Stats</h3>
						<div class="grid grid-cols-3 lg:grid-cols-1 gap-3 sm:gap-4">
							{#if trader.netWorth}
								<div class="flex flex-col lg:flex-row items-center lg:items-center gap-1 lg:gap-3 text-center lg:text-left">
									<div class="flex h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 items-center justify-center rounded-full bg-green-500/10 text-green-500">
										<Icon name="dollar-sign" class="h-4 w-4 lg:h-5 lg:w-5" />
									</div>
									<div>
										<p class="text-[10px] sm:text-xs text-midnight-400 lg:mb-0">Net Worth</p>
										<p class="text-xs sm:text-sm lg:text-base font-medium text-white">{trader.netWorth}</p>
									</div>
								</div>
							{/if}
							{#if trader.nationality}
								<div class="flex flex-col lg:flex-row items-center lg:items-center gap-1 lg:gap-3 text-center lg:text-left">
									<div class="flex h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
										<Icon name="globe" class="h-4 w-4 lg:h-5 lg:w-5" />
									</div>
									<div>
										<p class="text-[10px] sm:text-xs text-midnight-400 lg:mb-0">Origin</p>
										<p class="text-xs sm:text-sm lg:text-base font-medium text-white">{trader.nationality}</p>
									</div>
								</div>
							{/if}
							{#if lifespan}
								<div class="flex flex-col lg:flex-row items-center lg:items-center gap-1 lg:gap-3 text-center lg:text-left">
									<div class="flex h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 items-center justify-center rounded-full bg-purple-500/10 text-purple-500">
										<Icon name="calendar" class="h-4 w-4 lg:h-5 lg:w-5" />
									</div>
									<div>
										<p class="text-[10px] sm:text-xs text-midnight-400 lg:mb-0">Lifespan</p>
										<p class="text-xs sm:text-sm lg:text-base font-medium text-white line-clamp-1">{lifespan}</p>
									</div>
								</div>
							{/if}
						</div>
					</div>

					<!-- Social / External Links -->
					{#if trader.socialLinks && trader.socialLinks.length > 0}
						<div class="rounded-xl sm:rounded-2xl border border-white/5 bg-midnight-900/30 p-4 sm:p-5 lg:p-6 backdrop-blur-sm">
							<h3 class="mb-3 sm:mb-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-midnight-400">Links & Resources</h3>
							<div class="flex flex-col gap-2">
								{#each trader.socialLinks as link (link.url)}
									{@const platform = link.platform.toLowerCase()}
									{@const icon = platform === 'twitter' || platform === 'x' ? 'twitter'
										: platform === 'linkedin' ? 'linkedin'
										: platform === 'facebook' ? 'facebook'
										: platform === 'github' ? 'github'
										: platform === 'website' || platform === 'profile' ? 'globe'
										: 'external-link'}
									{@const label = platform === 'website' ? 'Official Website'
										: platform === 'profile' ? 'Trader Profile'
										: platform === 'twitter' || platform === 'x' ? 'Twitter / X'
										: platform === 'youtube' ? 'YouTube Channel'
										: platform === 'medium' ? 'Medium Blog'
										: platform === 'amazon' ? 'Books on Amazon'
										: platform === 'wikipedia' ? 'Wikipedia'
										: link.platform}
									<a
										href={link.url}
										target="_blank"
										rel="noopener noreferrer"
										class="group flex items-center gap-3 rounded-lg border border-white/5 bg-midnight-800/30 px-3 py-2.5 text-sm text-midnight-200 transition-all hover:border-gold-500/30 hover:bg-midnight-800/60 hover:text-gold-400 active:scale-[0.98]"
									>
										<Icon name={icon} class="h-4 w-4 shrink-0 text-midnight-400 group-hover:text-gold-400 transition-colors" />
										<span class="flex-1 truncate font-medium">{label}</span>
										<Icon name="external-link" class="h-3.5 w-3.5 shrink-0 text-midnight-600 group-hover:text-gold-500 transition-colors" />
									</a>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Share / Actions - MOBILE-FIRST -->
					<div class="rounded-xl sm:rounded-2xl border border-white/5 bg-midnight-900/30 p-4 sm:p-5 backdrop-blur-sm">
						<SocialShareButtons
							url={pageUrl}
							title="{trader.name} - {trader.oneLiner}"
							description={trader.bio?.substring(0, 160) || ''}
							variant="compact"
						/>
					</div>
				</div>
			</div>

			<!-- Right Column: Content (8 cols) - MOBILE-FIRST -->
			<div class="lg:col-span-8 space-y-8 sm:space-y-10 lg:space-y-12">

				<!-- Bio Section - MOBILE-FIRST -->
				<section>
					<h2 class="mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 font-display text-lg sm:text-xl lg:text-2xl font-bold text-white">
						<Icon name="history" class="h-5 w-5 sm:h-6 sm:w-6 text-gold-500" />
						Biography
					</h2>
					<div class="prose prose-invert prose-sm sm:prose-base lg:prose-lg max-w-none prose-headings:font-display prose-a:text-gold-400 hover:prose-a:text-gold-300">
						{@html parsedBio}
					</div>
				</section>

				<!-- Philosophy Section - MOBILE-FIRST -->
				{#if trader.philosophy}
					<section class="relative overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl border border-white/10 bg-midnight-900/30 p-4 sm:p-6 lg:p-8 backdrop-blur-sm">
						<div class="hidden sm:block absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-gold-500/5 blur-3xl"></div>
						<h2 class="mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 font-display text-lg sm:text-xl lg:text-2xl font-bold text-white">
							<Icon name="lightbulb" class="h-5 w-5 sm:h-6 sm:w-6 text-gold-500" />
							Trading Philosophy
						</h2>
						<div class="prose prose-invert prose-sm sm:prose-base max-w-none text-midnight-100">
							<p>{trader.philosophy}</p>
						</div>
					</section>
				{/if}

				<!-- Photo Gallery - MOBILE-FIRST -->
			{#if gallery.length > 0}
				<section>
					<h2 class="mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 font-display text-lg sm:text-xl lg:text-2xl font-bold text-white">
						<Icon name="layout-grid" class="h-5 w-5 sm:h-6 sm:w-6 text-gold-500" />
						Photo Gallery
					</h2>
					<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
						{#each gallery as image, i (image)}
							<button
								type="button"
								onclick={() => openLightbox(i)}
								class="group relative aspect-square rounded-lg sm:rounded-xl overflow-hidden border border-white/5 hover:border-gold-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-gold-500/40"
							>
								<img
									src={image.mediumUrl || image.url}
									alt={image.altText || image.title || `${trader.name} photo ${i + 1}`}
									class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
									loading="lazy"
									decoding="async"
								/>
								<div class="absolute inset-0 bg-linear-to-t from-midnight-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
								{#if image.caption}
									<div class="absolute bottom-0 left-0 right-0 p-2 sm:p-3 opacity-0 group-hover:opacity-100 transition-opacity">
										<p class="text-[10px] sm:text-xs text-white/90 line-clamp-2">{image.caption}</p>
									</div>
								{/if}
							</button>
						{/each}
					</div>
				</section>
			{/if}

			<!-- Famous Trades - MOBILE-FIRST -->
			{#if trader.famousTrades && trader.famousTrades.length > 0}
					<section>
						<h2 class="mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 font-display text-lg sm:text-xl lg:text-2xl font-bold text-white">
							<Icon name="trending-up" class="h-5 w-5 sm:h-6 sm:w-6 text-gold-500" />
							Famous Trades
						</h2>
						<div class="grid gap-3 sm:gap-4">
							{#each trader.famousTrades as trade, i (i)}
								<div class="group rounded-lg sm:rounded-xl border border-white/5 bg-midnight-900/30 p-4 sm:p-5 lg:p-6 transition-all hover:border-gold-500/30 hover:bg-midnight-800/50 active:scale-[0.99]">
									<div class="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
										<div class="flex-1">
											<div class="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
												<span class="text-[10px] sm:text-xs font-medium text-midnight-400">{trade.date}</span>
												<span class="inline-flex items-center rounded-full px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium {trade.position === 'long' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}">
													{trade.position.toUpperCase()}
												</span>
											</div>
											<h3 class="text-sm sm:text-base font-bold text-white group-hover:text-gold-400 transition-colors">{trade.asset}</h3>
											<p class="mt-1 sm:mt-2 text-xs sm:text-sm text-midnight-300">{trade.description}</p>
										</div>
										<div class="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-0 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-white/5">
											<p class="text-[10px] sm:text-xs text-midnight-400">{trade.outcome}</p>
											<p class="text-sm sm:text-lg font-bold {trade.profitLoss.startsWith('+') ? 'text-green-400' : 'text-red-400'}">{trade.profitLoss}</p>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</section>
				{/if}

				<!-- Quotes - MOBILE-FIRST -->
				{#if trader.quotes && trader.quotes.length > 0}
					<section>
						<h2 class="mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 font-display text-lg sm:text-xl lg:text-2xl font-bold text-white">
							<Icon name="quote" class="h-5 w-5 sm:h-6 sm:w-6 text-gold-500" />
							Legendary Quotes
						</h2>
						<div class="grid gap-4 sm:gap-6">
							{#each trader.quotes as quote, i (i)}
								<figure class="relative rounded-xl sm:rounded-2xl bg-white/5 p-5 sm:p-6 lg:p-8">
									<Icon name="quote" class="absolute top-3 left-3 sm:top-4 sm:left-4 h-6 w-6 sm:h-8 sm:w-8 text-white/10 rotate-180" />
									<blockquote class="relative z-10 text-base sm:text-lg font-medium italic text-midnight-100">
										"{quote.text}"
									</blockquote>
									{#if quote.source}
										<figcaption class="mt-3 sm:mt-4 text-xs sm:text-sm text-midnight-400">
											— {quote.source}
										</figcaption>
									{/if}
								</figure>
							{/each}
						</div>
					</section>
				{/if}

				<!-- Books - MOBILE-FIRST -->
				{#if trader.books && trader.books.length > 0}
					<section>
						<h2 class="mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 font-display text-lg sm:text-xl lg:text-2xl font-bold text-white">
							<Icon name="book-open" class="h-5 w-5 sm:h-6 sm:w-6 text-gold-500" />
							Recommended Reading
						</h2>
						<div class="grid gap-3 sm:gap-4">
							{#each trader.books as book, i (i)}
								<div class="group rounded-lg sm:rounded-xl border border-white/5 bg-midnight-900/30 p-4 sm:p-5 lg:p-6 transition-all hover:border-gold-500/30 hover:bg-midnight-800/50 active:scale-[0.99]">
									<div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
										<div class="flex-1">
											<h3 class="text-sm sm:text-base font-bold text-white group-hover:text-gold-400 transition-colors">{book.title}</h3>
											{#if book.description}
												<p class="mt-1 sm:mt-2 text-xs sm:text-sm text-midnight-300">{book.description}</p>
											{/if}
										</div>
										{#if book.year}
											<span class="text-xs sm:text-sm text-midnight-400 sm:shrink-0">{book.year}</span>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</section>
				{/if}

				<!-- Articles Section - MOBILE-FIRST -->
				{#if articles && articles.length > 0}
					<section class="pt-8 sm:pt-10 lg:pt-12 border-t border-white/5">
						<div class="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
							<h2 class="flex items-center gap-2 sm:gap-3 font-display text-lg sm:text-xl lg:text-2xl font-bold text-white">
								<Icon name="book-open" class="h-5 w-5 sm:h-6 sm:w-6 text-gold-500" />
								Latest Articles
							</h2>
							<a
								href="/traders/{trader.slug}/articles"
								class="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gold-400 hover:text-gold-300 transition-colors"
							>
								View All
								<Icon name="arrow-right" class="h-3.5 w-3.5" />
							</a>
						</div>
						<div class="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
							{#each articles as article, i (article.slug)}
								<TraderArticleCard {article} {trader} variant="compact" />
							{/each}
						</div>
					</section>
				{/if}

				<!-- Related Traders - MOBILE-FIRST -->
				{#if relatedTraders && relatedTraders.length > 0}
					<section class="pt-8 sm:pt-10 lg:pt-12 border-t border-white/5">
						<h2 class="mb-4 sm:mb-6 lg:mb-8 font-display text-lg sm:text-xl lg:text-2xl font-bold text-white">Similar Legends</h2>
						<div class="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-2">
							{#each relatedTraders as related, i (related.slug)}
								<TraderCard trader={related} index={i} />
							{/each}
						</div>
					</section>
				{/if}
			</div>
		</div>
	</div>
</div>

<!-- Lightbox Modal -->
{#if lightboxImage}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-midnight-950/95 backdrop-blur-md"
		role="dialog"
		aria-modal="true"
		aria-label="Image lightbox"
	>
		<!-- Close button -->
		<button
			type="button"
			onclick={closeLightbox}
			class="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
			aria-label="Close lightbox"
		>
			<Icon name="x" class="h-6 w-6" />
		</button>

		<!-- Previous button -->
		{#if lightboxIndex !== null && lightboxIndex > 0}
			<button
				type="button"
				onclick={lightboxPrev}
				class="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
				aria-label="Previous image"
			>
				<Icon name="arrow-left" class="h-6 w-6" />
			</button>
		{/if}

		<!-- Next button -->
		{#if lightboxIndex !== null && lightboxIndex < gallery.length - 1}
			<button
				type="button"
				onclick={lightboxNext}
				class="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
				aria-label="Next image"
			>
				<Icon name="arrow-right" class="h-6 w-6" />
			</button>
		{/if}

		<!-- Image -->
		<div class="max-w-5xl max-h-[85vh] w-full mx-4 flex flex-col items-center">
			<img
				src={lightboxImage.largeUrl || lightboxImage.originalUrl || lightboxImage.url}
				alt={lightboxImage.altText || lightboxImage.title || 'Gallery image'}
				class="max-h-[75vh] w-auto max-w-full rounded-lg object-contain"
				decoding="async"
			/>

			<!-- Caption & metadata -->
			{#if lightboxImage.title || lightboxImage.caption}
				<div class="mt-4 text-center max-w-2xl">
					{#if lightboxImage.title}
						<p class="text-base sm:text-lg font-medium text-white">{lightboxImage.title}</p>
					{/if}
					{#if lightboxImage.caption}
						<p class="mt-1 text-sm text-midnight-400">{lightboxImage.caption}</p>
					{/if}
				</div>
			{/if}

			<!-- Counter -->
			{#if lightboxIndex !== null}
				<p class="mt-3 text-xs text-midnight-500">
					{lightboxIndex + 1} / {gallery.length}
				</p>
			{/if}
		</div>

		<!-- Click backdrop to close -->
		<button
			type="button"
			onclick={closeLightbox}
			class="absolute inset-0 -z-10 cursor-default"
			aria-label="Close lightbox"
		></button>
	</div>
{/if}
