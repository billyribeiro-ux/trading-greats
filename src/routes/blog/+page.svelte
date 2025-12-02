<script lang="ts">
	import { page } from '$app/stores';
	import {
		Calendar,
		Clock,
		ArrowRight,
		Tag,
		Filter,
		BookOpen,
		TrendingUp,
		Brain,
		BarChart3,
		User,
		GraduationCap,
		LineChart,
		BookMarked
	} from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import ScrollReveal from '$lib/components/motion/ScrollReveal.svelte';

	let { data } = $props();

	// Category icons
	const categoryIcons: Record<string, any> = {
		strategy: TrendingUp,
		psychology: Brain,
		analysis: BarChart3,
		biography: User,
		education: GraduationCap,
		'market-insights': LineChart,
		'book-review': BookMarked
	};

	function formatDate(dateString: string | null): string {
		if (!dateString) return '';
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function getCategoryLabel(value: string | null): string {
		if (!value) return '';
		const cat = data.categories.find(c => c.value === value);
		return cat?.label || value;
	}
</script>

<svelte:head>
	<title>Blog | Trading Greats - Insights from Legendary Traders</title>
	<meta
		name="description"
		content="Discover trading strategies, psychology insights, and lessons from the world's greatest traders. Expert analysis and educational content for serious traders."
	/>
</svelte:head>

<div class="min-h-screen bg-midnight-950">
	<!-- Hero Section -->
	<section class="relative overflow-hidden border-b border-midnight-800/50">
		<!-- Background -->
		<div class="absolute inset-0">
			<div class="absolute inset-0 bg-gradient-to-br from-midnight-900 via-midnight-950 to-midnight-900"></div>
			<div class="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-gold-500/5 blur-3xl"></div>
			<div class="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-gold-500/5 blur-3xl"></div>
		</div>

		<div class="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
			<ScrollReveal>
				<div class="text-center max-w-3xl mx-auto">
					<div class="inline-flex items-center gap-2 rounded-full border border-gold-500/20 bg-gold-500/5 px-4 py-1.5 mb-6">
						<BookOpen class="h-4 w-4 text-gold-400" />
						<span class="text-sm font-medium text-gold-400">Trading Insights</span>
					</div>
					<h1 class="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white">
						Learn from the <span class="text-gold-400">Legends</span>
					</h1>
					<p class="mt-6 text-lg text-midnight-300 max-w-2xl mx-auto">
						Dive deep into trading strategies, market psychology, and timeless wisdom from the world's
						greatest traders. Expert analysis for serious investors.
					</p>
				</div>
			</ScrollReveal>

			<!-- Category Filter -->
			<ScrollReveal delay={150}>
				<div class="mt-12 flex flex-wrap items-center justify-center gap-3">
					<a
						href="/blog"
						class={cn(
							'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all',
							!data.currentCategory
								? 'bg-gold-500 text-midnight-950'
								: 'bg-midnight-800/50 text-midnight-300 hover:bg-midnight-700 hover:text-white'
						)}
					>
						<Filter class="h-4 w-4" />
						All Posts
					</a>
					{#each data.categories as cat}
						{@const Icon = categoryIcons[cat.value] || Tag}
						<a
							href="/blog?category={cat.value}"
							class={cn(
								'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all',
								data.currentCategory === cat.value
									? 'bg-gold-500 text-midnight-950'
									: 'bg-midnight-800/50 text-midnight-300 hover:bg-midnight-700 hover:text-white'
							)}
						>
							<Icon class="h-4 w-4" />
							{cat.label}
						</a>
					{/each}
				</div>
			</ScrollReveal>
		</div>
	</section>

	<!-- Featured Post -->
	{#if data.featuredPost && !data.currentCategory}
		<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
			<ScrollReveal>
				<a
					href="/blog/{data.featuredPost.slug}"
					class="group relative block overflow-hidden rounded-3xl border border-midnight-800/50 bg-midnight-900/30"
				>
					<div class="grid lg:grid-cols-2 gap-0">
						<!-- Image -->
						{#if data.featuredPost.heroImage}
							<div class="relative aspect-[16/10] lg:aspect-auto overflow-hidden">
								<img
									src={data.featuredPost.heroImage}
									alt={data.featuredPost.heroImageAlt || data.featuredPost.title}
									class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
								/>
								<div class="absolute inset-0 bg-gradient-to-r from-transparent to-midnight-950/80 lg:block hidden"></div>
								<div class="absolute inset-0 bg-gradient-to-t from-midnight-950/80 to-transparent lg:hidden"></div>
							</div>
						{/if}

						<!-- Content -->
						<div class="relative p-8 lg:p-12 flex flex-col justify-center">
							<div class="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl"></div>

							<div class="relative">
								<div class="flex items-center gap-3 mb-4">
									<span class="inline-flex items-center gap-1.5 rounded-full bg-gold-500/10 px-3 py-1 text-xs font-medium text-gold-400">
										Featured
									</span>
									{#if data.featuredPost.category}
										<span class="inline-flex items-center gap-1.5 rounded-full bg-midnight-800 px-3 py-1 text-xs font-medium text-midnight-300">
											{getCategoryLabel(data.featuredPost.category)}
										</span>
									{/if}
								</div>

								<h2 class="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-white group-hover:text-gold-400 transition-colors">
									{data.featuredPost.title}
								</h2>

								{#if data.featuredPost.excerpt}
									<p class="mt-4 text-midnight-300 line-clamp-3 text-lg">
										{data.featuredPost.excerpt}
									</p>
								{/if}

								<div class="mt-6 flex items-center gap-6 text-sm text-midnight-400">
									{#if data.featuredPost.publishedAt}
										<span class="flex items-center gap-1.5">
											<Calendar class="h-4 w-4" />
											{formatDate(data.featuredPost.publishedAt)}
										</span>
									{/if}
									{#if data.featuredPost.readingTime}
										<span class="flex items-center gap-1.5">
											<Clock class="h-4 w-4" />
											{data.featuredPost.readingTime} min read
										</span>
									{/if}
								</div>

								<div class="mt-8 inline-flex items-center gap-2 text-gold-400 font-semibold group-hover:gap-4 transition-all">
									Read Article
									<ArrowRight class="h-5 w-5" />
								</div>
							</div>
						</div>
					</div>
				</a>
			</ScrollReveal>
		</section>
	{/if}

	<!-- Posts Grid -->
	<section class="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
		{#if data.posts.length > 0}
			<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
				{#each data.posts as post, i}
					<ScrollReveal delay={i * 75}>
						<a
							href="/blog/{post.slug}"
							class="group flex flex-col overflow-hidden rounded-2xl border border-midnight-800/50 bg-midnight-900/30 transition-all duration-300 hover:border-gold-500/30 hover:bg-midnight-800/50 hover:-translate-y-1"
						>
							<!-- Image -->
							{#if post.heroImage}
								<div class="relative aspect-[16/10] overflow-hidden">
									<img
										src={post.heroImage}
										alt={post.heroImageAlt || post.title}
										class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
										loading="lazy"
									/>
									<div class="absolute inset-0 bg-gradient-to-t from-midnight-950/60 to-transparent"></div>

									{#if post.category}
										{@const Icon = categoryIcons[post.category] || Tag}
										<div class="absolute top-4 left-4">
											<span class="inline-flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-md px-3 py-1 text-xs font-medium text-white border border-white/10">
												<Icon class="h-3 w-3" />
												{getCategoryLabel(post.category)}
											</span>
										</div>
									{/if}
								</div>
							{:else}
								<div class="relative aspect-[16/10] bg-midnight-800 flex items-center justify-center">
									<BookOpen class="h-12 w-12 text-midnight-600" />
									{#if post.category}
										{@const Icon = categoryIcons[post.category] || Tag}
										<div class="absolute top-4 left-4">
											<span class="inline-flex items-center gap-1.5 rounded-full bg-midnight-700 px-3 py-1 text-xs font-medium text-midnight-300">
												<Icon class="h-3 w-3" />
												{getCategoryLabel(post.category)}
											</span>
										</div>
									{/if}
								</div>
							{/if}

							<!-- Content -->
							<div class="flex flex-1 flex-col p-6">
								<h3 class="font-display text-xl font-bold text-white group-hover:text-gold-400 transition-colors line-clamp-2">
									{post.title}
								</h3>

								{#if post.excerpt}
									<p class="mt-3 text-sm text-midnight-400 line-clamp-2 flex-1">
										{post.excerpt}
									</p>
								{/if}

								<div class="mt-4 flex items-center justify-between text-xs text-midnight-500">
									<div class="flex items-center gap-4">
										{#if post.publishedAt}
											<span class="flex items-center gap-1">
												<Calendar class="h-3 w-3" />
												{formatDate(post.publishedAt)}
											</span>
										{/if}
										{#if post.readingTime}
											<span class="flex items-center gap-1">
												<Clock class="h-3 w-3" />
												{post.readingTime} min
											</span>
										{/if}
									</div>
									<ArrowRight class="h-4 w-4 text-gold-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
								</div>
							</div>
						</a>
					</ScrollReveal>
				{/each}
			</div>
		{:else}
			<div class="text-center py-20">
				<BookOpen class="h-16 w-16 text-midnight-700 mx-auto mb-4" />
				<h2 class="font-display text-2xl font-bold text-midnight-300">No Posts Yet</h2>
				<p class="mt-2 text-midnight-500">
					{#if data.currentCategory}
						No posts found in this category. Check back soon!
					{:else}
						We're working on bringing you great content. Stay tuned!
					{/if}
				</p>
				{#if data.currentCategory}
					<a
						href="/blog"
						class="mt-6 inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors"
					>
						<ArrowRight class="h-4 w-4 rotate-180" />
						View all posts
					</a>
				{/if}
			</div>
		{/if}
	</section>

	<!-- Newsletter CTA -->
	<section class="border-t border-midnight-800/50 bg-midnight-900/30">
		<div class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
			<ScrollReveal>
				<div class="text-center max-w-2xl mx-auto">
					<h2 class="font-display text-3xl font-bold text-white">
						Never Miss an <span class="text-gold-400">Insight</span>
					</h2>
					<p class="mt-4 text-midnight-400">
						Join thousands of traders receiving our weekly digest of strategies, analysis, and wisdom
						from legendary traders.
					</p>
					<form class="mt-8 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
						<input
							type="email"
							placeholder="Enter your email"
							class="flex-1 rounded-xl border border-midnight-700 bg-midnight-800/50 px-4 py-3 text-midnight-100 placeholder-midnight-500 outline-none transition-all focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
						/>
						<button
							type="submit"
							class="rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-6 py-3 font-semibold text-midnight-950 shadow-lg shadow-gold-500/25 transition-all hover:shadow-xl hover:shadow-gold-500/30"
						>
							Subscribe
						</button>
					</form>
					<p class="mt-4 text-xs text-midnight-600">
						No spam. Unsubscribe anytime.
					</p>
				</div>
			</ScrollReveal>
		</div>
	</section>
</div>
