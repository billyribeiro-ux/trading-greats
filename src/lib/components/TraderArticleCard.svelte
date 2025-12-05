<script lang="ts">
	import type { BlogPost, Trader } from '$lib/server/schema';
	import { cn } from '$lib/utils';
	import { Icon, type IconName } from '$lib/components/icons';

	interface Props {
		article: BlogPost;
		trader?: Trader | null;
		class?: string;
		index?: number;
		variant?: 'default' | 'compact' | 'featured';
	}

	let { article, trader = null, class: className, index = 0, variant = 'default' }: Props = $props();

	// Image load state
	let imageLoaded = $state(false);
	let imageError = $state(false);

	// Category icons mapping
	const categoryIcons: Record<string, IconName> = {
		strategy: 'trending-up',
		psychology: 'brain',
		analysis: 'bar-chart',
		biography: 'user',
		education: 'graduation-cap',
		'market-insights': 'line-chart',
		'book-review': 'book-marked'
	};

	const categoryIcon = $derived<IconName>(
		article.category ? categoryIcons[article.category] || 'tag' : 'tag'
	);

	// Format date
	function formatDate(dateString: string | null): string {
		if (!dateString) return '';
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	// Build article URL (supports both trader-specific and general blog)
	const articleUrl = $derived.by(() => {
		if (article.traderSlug) {
			return `/traders/${article.traderSlug}/articles/${article.slug}`;
		}
		return `/blog/${article.slug}`;
	});
</script>

{#if variant === 'compact'}
	<!-- Compact variant for sidebars/lists -->
	<a
		href={articleUrl}
		class={cn(
			'group flex gap-3 sm:gap-4 rounded-xl p-3 sm:p-4',
			'bg-midnight-900/30 border border-white/5',
			'transition-all duration-300',
			'hover:bg-midnight-800/50 hover:border-gold-500/20',
			'active:scale-[0.98]',
			className
		)}
	>
		<!-- Thumbnail -->
		<div class="relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 overflow-hidden rounded-lg bg-midnight-800">
			{#if article.heroImage && !imageError}
				<img
					src={article.heroImage}
					alt={article.heroImageAlt || article.title}
					class={cn(
						'h-full w-full object-cover transition-all duration-300',
						'group-hover:scale-105',
						imageLoaded ? 'opacity-100' : 'opacity-0'
					)}
					loading="lazy"
					onload={() => imageLoaded = true}
					onerror={() => imageError = true}
				/>
			{/if}
			{#if !imageLoaded || imageError}
				<div class="absolute inset-0 flex items-center justify-center">
					<Icon name="book-open" class="h-6 w-6 text-midnight-600" />
				</div>
			{/if}
		</div>

		<!-- Content -->
		<div class="flex flex-1 flex-col min-w-0">
			<h4 class="font-medium text-sm text-white group-hover:text-gold-400 transition-colors line-clamp-2">
				{article.title}
			</h4>
			<div class="mt-auto flex items-center gap-2 text-[10px] sm:text-xs text-midnight-400">
				{#if article.readingTime}
					<span class="flex items-center gap-1">
						<Icon name="clock" class="h-3 w-3" />
						{article.readingTime} min
					</span>
				{/if}
				{#if article.publishedAt}
					<span>{formatDate(article.publishedAt)}</span>
				{/if}
			</div>
		</div>
	</a>
{:else if variant === 'featured'}
	<!-- Featured variant for hero sections -->
	<a
		href={articleUrl}
		class={cn(
			'group relative flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl',
			'h-[320px] sm:h-[380px] lg:h-[420px]',
			'bg-midnight-900/80 border border-white/[0.08]',
			'transition-all duration-500',
			'hover:border-gold-500/40 hover:shadow-2xl hover:shadow-gold-500/10',
			'active:scale-[0.99]',
			className
		)}
	>
		<!-- Full-bleed image -->
		<div class="absolute inset-0 overflow-hidden">
			{#if article.heroImage && !imageError}
				<img
					src={article.heroImage}
					alt={article.heroImageAlt || article.title}
					class={cn(
						'h-full w-full object-cover transition-all duration-700',
						'group-hover:scale-105',
						imageLoaded ? 'opacity-100' : 'opacity-0'
					)}
					loading="lazy"
					onload={() => imageLoaded = true}
					onerror={() => imageError = true}
				/>
			{/if}
			<div class="absolute inset-0 bg-gradient-to-t from-midnight-950 via-midnight-950/70 to-midnight-950/20"></div>
		</div>

		<!-- Content overlay -->
		<div class="relative z-10 mt-auto p-5 sm:p-6 lg:p-8">
			<!-- Category & Trader badges -->
			<div class="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
				{#if article.category}
					<span class="inline-flex items-center gap-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 px-2.5 py-1 text-[10px] sm:text-xs font-medium text-gold-400">
						<Icon name={categoryIcon} class="h-3 w-3" />
						{article.category.replace('-', ' ')}
					</span>
				{/if}
				{#if trader}
					<span class="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] sm:text-xs font-medium text-white">
						<Icon name="user" class="h-3 w-3" />
						{trader.name}
					</span>
				{/if}
			</div>

			<h3 class="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-white group-hover:text-gold-400 transition-colors line-clamp-2">
				{article.title}
			</h3>

			{#if article.excerpt}
				<p class="mt-2 sm:mt-3 text-sm sm:text-base text-midnight-300 line-clamp-2">
					{article.excerpt}
				</p>
			{/if}

			<div class="mt-4 sm:mt-5 flex items-center justify-between">
				<div class="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-midnight-400">
					{#if article.publishedAt}
						<span class="flex items-center gap-1.5">
							<Icon name="calendar" class="h-3.5 w-3.5" />
							{formatDate(article.publishedAt)}
						</span>
					{/if}
					{#if article.readingTime}
						<span class="flex items-center gap-1.5">
							<Icon name="clock" class="h-3.5 w-3.5" />
							{article.readingTime} min read
						</span>
					{/if}
				</div>
				<Icon name="arrow-right" class="h-5 w-5 text-gold-500 transition-transform group-hover:translate-x-1" />
			</div>
		</div>
	</a>
{:else}
	<!-- Default variant -->
	<a
		href={articleUrl}
		class={cn(
			'group relative flex flex-col overflow-hidden rounded-xl sm:rounded-2xl',
			'h-[260px] sm:h-[300px] md:h-[340px]',
			'bg-midnight-900/80 border border-white/[0.08]',
			'transition-all duration-300',
			'hover:border-gold-500/30 hover:shadow-xl hover:shadow-gold-500/5',
			'md:hover:-translate-y-1',
			'active:scale-[0.98]',
			className
		)}
	>
		<!-- Image -->
		<div class="relative h-[120px] sm:h-[140px] md:h-[160px] flex-shrink-0 overflow-hidden bg-midnight-800">
			{#if article.heroImage && !imageError}
				<img
					src={article.heroImage}
					alt={article.heroImageAlt || article.title}
					class={cn(
						'h-full w-full object-cover transition-all duration-500',
						'group-hover:scale-105',
						imageLoaded ? 'opacity-100' : 'opacity-0'
					)}
					loading="lazy"
					onload={() => imageLoaded = true}
					onerror={() => imageError = true}
				/>
			{/if}
			{#if !imageLoaded || imageError}
				<div class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-midnight-800 to-midnight-900">
					<Icon name="book-open" class="h-10 w-10 text-midnight-600" />
				</div>
			{/if}
			<div class="absolute inset-0 bg-gradient-to-t from-midnight-900 via-transparent to-transparent"></div>

			<!-- Category badge -->
			{#if article.category}
				<div class="absolute top-3 left-3 z-10">
					<span class="inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-sm px-2 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white">
						<Icon name={categoryIcon} class="h-3 w-3 text-gold-400" />
						{article.category.replace('-', ' ')}
					</span>
				</div>
			{/if}
		</div>

		<!-- Content -->
		<div class="flex flex-1 flex-col p-3 sm:p-4">
			<!-- Trader attribution if present -->
			{#if trader}
				<div class="flex items-center gap-2 mb-2">
					{#if trader.photoUrl}
						<img src={trader.photoUrl} alt={trader.name} class="h-5 w-5 rounded-full object-cover" />
					{:else}
						<div class="h-5 w-5 rounded-full bg-gold-500/20 flex items-center justify-center">
							<Icon name="user" class="h-3 w-3 text-gold-400" />
						</div>
					{/if}
					<span class="text-[10px] sm:text-xs font-medium text-gold-400">{trader.name}</span>
				</div>
			{/if}

			<h3 class="font-display text-sm sm:text-base font-bold text-white line-clamp-2 group-hover:text-gold-400 transition-colors">
				{article.title}
			</h3>

			{#if article.excerpt}
				<p class="mt-1.5 text-[11px] sm:text-xs text-midnight-400 line-clamp-2 leading-relaxed">
					{article.excerpt}
				</p>
			{/if}

			<!-- Footer -->
			<div class="mt-auto pt-2 sm:pt-3 flex items-center justify-between border-t border-white/5">
				<div class="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-midnight-500">
					{#if article.publishedAt}
						<span>{formatDate(article.publishedAt)}</span>
					{/if}
					{#if article.readingTime}
						<span class="flex items-center gap-1">
							<Icon name="clock" class="h-3 w-3" />
							{article.readingTime}m
						</span>
					{/if}
				</div>
				<Icon name="arrow-right" class="h-4 w-4 text-gold-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
			</div>
		</div>
	</a>
{/if}
