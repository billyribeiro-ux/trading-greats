<script lang="ts">
	import {
		Calendar,
		Clock,
		ArrowLeft,
		ArrowRight,
		Share2,
		Twitter,
		Linkedin,
		Link2,
		Tag,
		User,
		TrendingUp,
		Brain,
		BarChart3,
		GraduationCap,
		LineChart,
		BookMarked,
		Check,
		BookOpen
	} from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import ScrollReveal from '$lib/components/motion/ScrollReveal.svelte';

	let { data } = $props();

	let copied = $state(false);

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
		const cat = data.categories.find((c) => c.value === value);
		return cat?.label || value;
	}

	async function copyLink() {
		try {
			await navigator.clipboard.writeText(window.location.href);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch (e) {
			console.error('Failed to copy link');
		}
	}

	function shareTwitter() {
		const url = encodeURIComponent(window.location.href);
		const text = encodeURIComponent(data.post.title);
		window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
	}

	function shareLinkedIn() {
		const url = encodeURIComponent(window.location.href);
		window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
	}

	// Simple markdown to HTML conversion for content
	function renderMarkdown(content: string): string {
		if (!content) return '';

		return (
			content
				// Code blocks
				.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
				// Inline code
				.replace(/`([^`]+)`/g, '<code>$1</code>')
				// Headers
				.replace(/^### (.*$)/gim, '<h3>$1</h3>')
				.replace(/^## (.*$)/gim, '<h2>$1</h2>')
				.replace(/^# (.*$)/gim, '<h1>$1</h1>')
				// Bold
				.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
				// Italic
				.replace(/\*(.*?)\*/g, '<em>$1</em>')
				// Blockquotes
				.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
				// Unordered lists
				.replace(/^\- (.*$)/gim, '<li>$1</li>')
				// Ordered lists
				.replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
				// Links
				.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
				// Images
				.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" />')
				// Paragraphs
				.replace(/\n\n/g, '</p><p>')
				// Line breaks
				.replace(/\n/g, '<br />')
		);
	}

	const CategoryIcon = $derived(
		data.post.category ? categoryIcons[data.post.category] || Tag : Tag
	);
</script>

<svelte:head>
	<title>{data.post.seoTitle || data.post.title} | Trading Greats</title>
	<meta
		name="description"
		content={data.post.seoDescription || data.post.excerpt || `Read ${data.post.title} on Trading Greats`}
	/>
	<meta property="og:title" content={data.post.seoTitle || data.post.title} />
	<meta
		property="og:description"
		content={data.post.seoDescription || data.post.excerpt || ''}
	/>
	{#if data.post.ogImage || data.post.heroImage}
		<meta property="og:image" content={data.post.ogImage || data.post.heroImage} />
	{/if}
	<meta property="og:type" content="article" />
	{#if data.post.publishedAt}
		<meta property="article:published_time" content={data.post.publishedAt} />
	{/if}
	{#if data.post.author}
		<meta property="article:author" content={data.post.author} />
	{/if}
	{#if data.post.category}
		<meta property="article:section" content={getCategoryLabel(data.post.category)} />
	{/if}
	{#if data.post.tags}
		{#each data.post.tags as tag}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}
</svelte:head>

<div class="min-h-screen bg-midnight-950">
	<!-- Hero Section -->
	<section class="relative overflow-hidden">
		<!-- Background -->
		{#if data.post.heroImage}
			<div class="absolute inset-0 h-[60vh] min-h-[500px]">
				<img
					src={data.post.heroImage}
					alt={data.post.heroImageAlt || data.post.title}
					class="h-full w-full object-cover"
				/>
				<div class="absolute inset-0 bg-gradient-to-t from-midnight-950 via-midnight-950/80 to-midnight-950/40"></div>
			</div>
		{:else}
			<div class="absolute inset-0 h-[40vh] min-h-[400px]">
				<div class="absolute inset-0 bg-gradient-to-br from-midnight-900 via-midnight-950 to-midnight-900"></div>
				<div class="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-gold-500/5 blur-3xl"></div>
				<div class="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-gold-500/5 blur-3xl"></div>
			</div>
		{/if}

		<div class="relative mx-auto max-w-4xl px-4 pt-32 pb-16 sm:px-6 lg:px-8">
			<ScrollReveal>
				<!-- Breadcrumb -->
				<nav class="mb-8">
					<a
						href="/blog"
						class="inline-flex items-center gap-2 text-midnight-400 hover:text-white transition-colors"
					>
						<ArrowLeft class="h-4 w-4" />
						Back to Blog
					</a>
				</nav>

				<!-- Meta -->
				<div class="flex flex-wrap items-center gap-4 mb-6">
					{#if data.post.category}
						<a
							href="/blog?category={data.post.category}"
							class="inline-flex items-center gap-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 px-3 py-1 text-sm font-medium text-gold-400 hover:bg-gold-500/20 transition-colors"
						>
							<CategoryIcon class="h-3.5 w-3.5" />
							{getCategoryLabel(data.post.category)}
						</a>
					{/if}
					{#if data.post.publishedAt}
						<span class="flex items-center gap-1.5 text-sm text-midnight-400">
							<Calendar class="h-4 w-4" />
							{formatDate(data.post.publishedAt)}
						</span>
					{/if}
					{#if data.post.readingTime}
						<span class="flex items-center gap-1.5 text-sm text-midnight-400">
							<Clock class="h-4 w-4" />
							{data.post.readingTime} min read
						</span>
					{/if}
				</div>

				<!-- Title -->
				<h1 class="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
					{data.post.title}
				</h1>

				<!-- Excerpt -->
				{#if data.post.excerpt}
					<p class="mt-6 text-xl text-midnight-300 leading-relaxed">
						{data.post.excerpt}
					</p>
				{/if}

				<!-- Author & Share -->
				<div class="mt-8 flex flex-wrap items-center justify-between gap-4 pt-8 border-t border-midnight-800/50">
					{#if data.post.author}
						<div class="flex items-center gap-3">
							<div class="h-10 w-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
								<User class="h-5 w-5 text-midnight-950" />
							</div>
							<div>
								<p class="font-medium text-white">{data.post.author}</p>
								<p class="text-sm text-midnight-500">Author</p>
							</div>
						</div>
					{/if}

					<div class="flex items-center gap-2">
						<span class="text-sm text-midnight-500 mr-2">Share:</span>
						<button
							type="button"
							onclick={shareTwitter}
							class="rounded-lg p-2 text-midnight-400 hover:bg-midnight-800 hover:text-white transition-colors"
							aria-label="Share on Twitter"
						>
							<Twitter class="h-5 w-5" />
						</button>
						<button
							type="button"
							onclick={shareLinkedIn}
							class="rounded-lg p-2 text-midnight-400 hover:bg-midnight-800 hover:text-white transition-colors"
							aria-label="Share on LinkedIn"
						>
							<Linkedin class="h-5 w-5" />
						</button>
						<button
							type="button"
							onclick={copyLink}
							class="rounded-lg p-2 text-midnight-400 hover:bg-midnight-800 hover:text-white transition-colors"
							aria-label="Copy link"
						>
							{#if copied}
								<Check class="h-5 w-5 text-green-400" />
							{:else}
								<Link2 class="h-5 w-5" />
							{/if}
						</button>
					</div>
				</div>
			</ScrollReveal>
		</div>
	</section>

	<!-- Content -->
	<article class="relative">
		<div class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
			<ScrollReveal>
				<!-- Hero Image Caption -->
				{#if data.post.heroImage && data.post.heroImageCaption}
					<p class="mb-12 text-center text-sm text-midnight-500 italic">
						{data.post.heroImageCaption}
					</p>
				{/if}

				<!-- Main Content -->
				<div
					class="prose prose-invert prose-lg max-w-none
						prose-headings:font-display prose-headings:text-white prose-headings:font-bold
						prose-h1:text-3xl prose-h1:mt-12 prose-h1:mb-6
						prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-gold-400
						prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
						prose-p:text-midnight-200 prose-p:leading-relaxed
						prose-a:text-gold-400 prose-a:no-underline hover:prose-a:text-gold-300 hover:prose-a:underline
						prose-strong:text-white prose-strong:font-semibold
						prose-em:text-midnight-300
						prose-blockquote:border-l-gold-500 prose-blockquote:bg-midnight-900/50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:text-midnight-200 prose-blockquote:not-italic
						prose-code:text-gold-400 prose-code:bg-midnight-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-[''] prose-code:after:content-['']
						prose-pre:bg-midnight-900 prose-pre:border prose-pre:border-midnight-800 prose-pre:rounded-xl
						prose-img:rounded-xl prose-img:my-8
						prose-ul:text-midnight-200 prose-ol:text-midnight-200
						prose-li:marker:text-gold-500"
				>
					{@html renderMarkdown(data.post.content || '')}
				</div>

				<!-- Tags -->
				{#if data.post.tags && data.post.tags.length > 0}
					<div class="mt-12 pt-8 border-t border-midnight-800/50">
						<div class="flex flex-wrap items-center gap-2">
							<Tag class="h-4 w-4 text-midnight-500" />
							{#each data.post.tags as tag}
								<span class="rounded-full bg-midnight-800 px-3 py-1 text-sm text-midnight-300">
									{tag}
								</span>
							{/each}
						</div>
					</div>
				{/if}
			</ScrollReveal>
		</div>
	</article>

	<!-- Related Posts -->
	{#if data.relatedPosts.length > 0}
		<section class="border-t border-midnight-800/50 bg-midnight-900/30">
			<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
				<ScrollReveal>
					<h2 class="font-display text-2xl font-bold text-white mb-8">
						Continue Reading
					</h2>

					<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
						{#each data.relatedPosts as post, i}
							<ScrollReveal delay={i * 75}>
								<a
									href="/blog/{post.slug}"
									class="group flex flex-col overflow-hidden rounded-2xl border border-midnight-800/50 bg-midnight-950/50 transition-all duration-300 hover:border-gold-500/30 hover:bg-midnight-800/50 hover:-translate-y-1"
								>
									{#if post.heroImage}
										<div class="relative aspect-[16/10] overflow-hidden">
											<img
												src={post.heroImage}
												alt={post.heroImageAlt || post.title}
												class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
												loading="lazy"
											/>
											<div class="absolute inset-0 bg-gradient-to-t from-midnight-950/60 to-transparent"></div>
										</div>
									{:else}
										<div class="relative aspect-[16/10] bg-midnight-800 flex items-center justify-center">
											<BookOpen class="h-12 w-12 text-midnight-600" />
										</div>
									{/if}

									<div class="flex flex-1 flex-col p-6">
										<h3 class="font-display text-lg font-bold text-white group-hover:text-gold-400 transition-colors line-clamp-2">
											{post.title}
										</h3>

										<div class="mt-4 flex items-center justify-between text-xs text-midnight-500">
											<span class="flex items-center gap-1">
												<Clock class="h-3 w-3" />
												{post.readingTime} min read
											</span>
											<ArrowRight class="h-4 w-4 text-gold-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
										</div>
									</div>
								</a>
							</ScrollReveal>
						{/each}
					</div>
				</ScrollReveal>
			</div>
		</section>
	{/if}

	<!-- Back to Blog CTA -->
	<section class="border-t border-midnight-800/50">
		<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
			<div class="flex items-center justify-center">
				<a
					href="/blog"
					class="inline-flex items-center gap-2 rounded-xl bg-midnight-800 px-6 py-3 font-semibold text-white hover:bg-midnight-700 transition-colors"
				>
					<ArrowLeft class="h-5 w-5" />
					Back to All Posts
				</a>
			</div>
		</div>
	</section>
</div>
