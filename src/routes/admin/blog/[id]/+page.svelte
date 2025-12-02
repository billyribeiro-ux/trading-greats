<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import {
		Save,
		Eye,
		ArrowLeft,
		Image,
		Type,
		FileText,
		Tag,
		Users,
		Settings,
		Sparkles,
		AlertCircle,
		Trash2,
		ExternalLink
	} from 'lucide-svelte';
	import { slugify } from '$lib/utils';
	import type { PageData } from './$types';

	interface FormResult {
		error?: string;
		title?: string;
		excerpt?: string;
		content?: string;
	}

	let { data, form }: { data: PageData; form: FormResult | null } = $props();

	// Form state - pre-populated with existing post data
	let title = $state(form?.title ?? data.post.title ?? '');
	let excerpt = $state(form?.excerpt ?? data.post.excerpt ?? '');
	let content = $state(form?.content ?? data.post.content ?? '');
	let heroImage = $state(data.post.heroImage || '');
	let heroImageAlt = $state(data.post.heroImageAlt || '');
	let heroImageCaption = $state(data.post.heroImageCaption || '');
	let author = $state(data.post.author || 'Trading Greats Team');
	let category = $state(data.post.category || '');
	let tags = $state(data.post.tags?.join(', ') || '');
	let seoTitle = $state(data.post.seoTitle || '');
	let seoDescription = $state(data.post.seoDescription || '');
	let ogImage = $state(data.post.ogImage || '');
	let relatedTraderIds = $state(data.post.relatedTraderIds?.join(',') || '');
	let status = $state<'draft' | 'published'>(data.post.status === 'published' ? 'published' : 'draft');

	// UI state
	let activeTab = $state<'content' | 'media' | 'seo' | 'settings'>('content');
	let isSubmitting = $state(false);
	let showPreview = $state(false);
	let showDeleteConfirm = $state(false);
	let isDeleting = $state(false);

	// Derived
	const slug = $derived(title ? slugify(title) : data.post.slug);
	const wordCount = $derived(content.split(/\s+/).filter(Boolean).length);
	const readingTime = $derived(Math.max(1, Math.ceil(wordCount / 200)));

	const tabs = [
		{ id: 'content', label: 'Content', icon: FileText },
		{ id: 'media', label: 'Media', icon: Image },
		{ id: 'seo', label: 'SEO', icon: Sparkles },
		{ id: 'settings', label: 'Settings', icon: Settings }
	] as const;

	async function handleDelete() {
		isDeleting = true;
		try {
			const formData = new FormData();
			const response = await fetch('?/delete', {
				method: 'POST',
				body: formData
			});
			if (response.ok) {
				goto('/admin/blog');
			}
		} catch (e) {
			console.error('Failed to delete:', e);
		} finally {
			isDeleting = false;
		}
	}
</script>

<svelte:head>
	<title>Edit: {data.post.title} | Admin</title>
</svelte:head>

<div class="min-h-screen bg-midnight-950">
	<!-- Header -->
	<header class="border-b border-midnight-800/50 bg-midnight-900/50 backdrop-blur-xl sticky top-0 z-50">
		<div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
			<div class="flex items-center gap-4">
				<a
					href="/admin/blog"
					class="inline-flex items-center gap-2 text-midnight-400 hover:text-midnight-200 transition-colors"
				>
					<ArrowLeft class="h-4 w-4" />
					Back to Blog
				</a>
			</div>
			<div class="flex items-center gap-3">
				{#if data.post.status === 'published'}
					<a
						href="/blog/{data.post.slug}"
						target="_blank"
						class="inline-flex items-center gap-2 rounded-lg bg-midnight-800 px-4 py-2 text-sm font-medium text-midnight-300 hover:bg-midnight-700 hover:text-white transition-colors"
					>
						<ExternalLink class="h-4 w-4" />
						View Live
					</a>
				{/if}
				<button
					type="button"
					onclick={() => (showPreview = !showPreview)}
					class="inline-flex items-center gap-2 rounded-lg bg-midnight-800 px-4 py-2 text-sm font-medium text-midnight-300 hover:bg-midnight-700 hover:text-white transition-colors"
				>
					<Eye class="h-4 w-4" />
					Preview
				</button>
			</div>
		</div>
	</header>

	<form
		method="POST"
		action="?/update"
		use:enhance={() => {
			isSubmitting = true;
			return async ({ update }) => {
				await update();
				isSubmitting = false;
			};
		}}
		class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
	>
		<!-- Error Message -->
		{#if form?.error}
			<div class="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 flex items-center gap-3">
				<AlertCircle class="h-5 w-5 text-red-400 flex-shrink-0" />
				<p class="text-red-400">{form.error}</p>
			</div>
		{/if}

		<div class="grid gap-8 lg:grid-cols-3">
			<!-- Main Content -->
			<div class="lg:col-span-2 space-y-6">
				<!-- Title -->
				<div>
					<label for="title" class="block text-sm font-medium text-midnight-300 mb-2">
						Title <span class="text-red-400">*</span>
					</label>
					<input
						type="text"
						id="title"
						name="title"
						bind:value={title}
						placeholder="Enter a compelling title..."
						class="w-full rounded-xl border border-midnight-700 bg-midnight-800/50 px-4 py-3 text-xl font-display font-bold text-midnight-100 placeholder-midnight-600 outline-none transition-all focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
						required
					/>
					{#if slug}
						<p class="mt-2 text-sm text-midnight-500">
							URL: /blog/<span class="text-gold-400">{slug}</span>
						</p>
					{/if}
				</div>

				<!-- Tabs -->
				<div class="border-b border-midnight-800/50">
					<nav class="flex gap-1">
						{#each tabs as tab}
							<button
								type="button"
								onclick={() => (activeTab = tab.id)}
								class="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors {activeTab === tab.id
									? 'text-gold-400 border-b-2 border-gold-400 -mb-px'
									: 'text-midnight-400 hover:text-midnight-200'}"
							>
								<tab.icon class="h-4 w-4" />
								{tab.label}
							</button>
						{/each}
					</nav>
				</div>

				<!-- Tab Content -->
				<div class="min-h-[400px]">
					{#if activeTab === 'content'}
						<div class="space-y-6">
							<!-- Excerpt -->
							<div>
								<label for="excerpt" class="block text-sm font-medium text-midnight-300 mb-2">
									Excerpt
								</label>
								<textarea
									id="excerpt"
									name="excerpt"
									bind:value={excerpt}
									rows="2"
									placeholder="A brief summary that appears in previews..."
									class="w-full rounded-xl border border-midnight-700 bg-midnight-800/50 px-4 py-3 text-midnight-100 placeholder-midnight-600 outline-none transition-all focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 resize-none"
								></textarea>
							</div>

							<!-- Content -->
							<div>
								<div class="flex items-center justify-between mb-2">
									<label for="content" class="block text-sm font-medium text-midnight-300">
										Content (Markdown)
									</label>
									<div class="flex items-center gap-4 text-xs text-midnight-500">
										<span>{wordCount} words</span>
										<span>{readingTime} min read</span>
									</div>
								</div>
								<textarea
									id="content"
									name="content"
									bind:value={content}
									rows="20"
									placeholder="Write your post content in Markdown..."
									class="w-full rounded-xl border border-midnight-700 bg-midnight-800/50 px-4 py-3 font-mono text-sm text-midnight-100 placeholder-midnight-600 outline-none transition-all focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 resize-none"
								></textarea>
							</div>
						</div>
					{:else if activeTab === 'media'}
						<div class="space-y-6">
							<!-- Hero Image -->
							<div>
								<label for="heroImage" class="block text-sm font-medium text-midnight-300 mb-2">
									Hero Image URL
								</label>
								<input
									type="url"
									id="heroImage"
									name="heroImage"
									bind:value={heroImage}
									placeholder="https://example.com/image.jpg"
									class="w-full rounded-xl border border-midnight-700 bg-midnight-800/50 px-4 py-3 text-midnight-100 placeholder-midnight-600 outline-none transition-all focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
								/>
								{#if heroImage}
									<div class="mt-4 rounded-xl overflow-hidden border border-midnight-700">
										<img src={heroImage} alt="Preview" class="w-full h-48 object-cover" />
									</div>
								{/if}
							</div>

							<!-- Hero Image Alt -->
							<div>
								<label for="heroImageAlt" class="block text-sm font-medium text-midnight-300 mb-2">
									Image Alt Text
								</label>
								<input
									type="text"
									id="heroImageAlt"
									name="heroImageAlt"
									bind:value={heroImageAlt}
									placeholder="Describe the image for accessibility"
									class="w-full rounded-xl border border-midnight-700 bg-midnight-800/50 px-4 py-3 text-midnight-100 placeholder-midnight-600 outline-none transition-all focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
								/>
							</div>

							<!-- Hero Image Caption -->
							<div>
								<label for="heroImageCaption" class="block text-sm font-medium text-midnight-300 mb-2">
									Image Caption
								</label>
								<input
									type="text"
									id="heroImageCaption"
									name="heroImageCaption"
									bind:value={heroImageCaption}
									placeholder="Optional caption to display below the image"
									class="w-full rounded-xl border border-midnight-700 bg-midnight-800/50 px-4 py-3 text-midnight-100 placeholder-midnight-600 outline-none transition-all focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
								/>
							</div>
						</div>
					{:else if activeTab === 'seo'}
						<div class="space-y-6">
							<!-- SEO Title -->
							<div>
								<label for="seoTitle" class="block text-sm font-medium text-midnight-300 mb-2">
									SEO Title
								</label>
								<input
									type="text"
									id="seoTitle"
									name="seoTitle"
									bind:value={seoTitle}
									placeholder={title || 'Leave empty to use the post title'}
									class="w-full rounded-xl border border-midnight-700 bg-midnight-800/50 px-4 py-3 text-midnight-100 placeholder-midnight-600 outline-none transition-all focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
								/>
								<p class="mt-1 text-xs text-midnight-500">
									{(seoTitle || title).length}/60 characters
								</p>
							</div>

							<!-- SEO Description -->
							<div>
								<label for="seoDescription" class="block text-sm font-medium text-midnight-300 mb-2">
									SEO Description
								</label>
								<textarea
									id="seoDescription"
									name="seoDescription"
									bind:value={seoDescription}
									rows="3"
									placeholder={excerpt || 'Leave empty to use the excerpt'}
									class="w-full rounded-xl border border-midnight-700 bg-midnight-800/50 px-4 py-3 text-midnight-100 placeholder-midnight-600 outline-none transition-all focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 resize-none"
								></textarea>
								<p class="mt-1 text-xs text-midnight-500">
									{(seoDescription || excerpt).length}/160 characters
								</p>
							</div>

							<!-- OG Image -->
							<div>
								<label for="ogImage" class="block text-sm font-medium text-midnight-300 mb-2">
									Social Share Image
								</label>
								<input
									type="url"
									id="ogImage"
									name="ogImage"
									bind:value={ogImage}
									placeholder={heroImage || 'Leave empty to use hero image'}
									class="w-full rounded-xl border border-midnight-700 bg-midnight-800/50 px-4 py-3 text-midnight-100 placeholder-midnight-600 outline-none transition-all focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
								/>
							</div>
						</div>
					{:else if activeTab === 'settings'}
						<div class="space-y-6">
							<!-- Author -->
							<div>
								<label for="author" class="block text-sm font-medium text-midnight-300 mb-2">
									Author
								</label>
								<input
									type="text"
									id="author"
									name="author"
									bind:value={author}
									placeholder="Trading Greats Team"
									class="w-full rounded-xl border border-midnight-700 bg-midnight-800/50 px-4 py-3 text-midnight-100 placeholder-midnight-600 outline-none transition-all focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
								/>
							</div>

							<!-- Category -->
							<div>
								<label for="category" class="block text-sm font-medium text-midnight-300 mb-2">
									Category
								</label>
								<select
									id="category"
									name="category"
									bind:value={category}
									class="w-full rounded-xl border border-midnight-700 bg-midnight-800/50 px-4 py-3 text-midnight-100 outline-none transition-all focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
								>
									<option value="">Select a category</option>
									{#each data.categories as cat}
										<option value={cat.value}>{cat.label}</option>
									{/each}
								</select>
							</div>

							<!-- Tags -->
							<div>
								<label for="tags" class="block text-sm font-medium text-midnight-300 mb-2">
									Tags
								</label>
								<input
									type="text"
									id="tags"
									name="tags"
									bind:value={tags}
									placeholder="trading, strategy, education (comma separated)"
									class="w-full rounded-xl border border-midnight-700 bg-midnight-800/50 px-4 py-3 text-midnight-100 placeholder-midnight-600 outline-none transition-all focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
								/>
							</div>

							<!-- Related Traders -->
							<div>
								<label for="relatedTraderIds" class="block text-sm font-medium text-midnight-300 mb-2">
									Related Traders
								</label>
								<select
									id="relatedTraderIds"
									name="relatedTraderIds"
									multiple
									class="w-full rounded-xl border border-midnight-700 bg-midnight-800/50 px-4 py-3 text-midnight-100 outline-none transition-all focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 h-32"
								>
									{#each data.traders as trader}
										<option value={trader.id} selected={data.post.relatedTraderIds?.includes(trader.id)}>{trader.name}</option>
									{/each}
								</select>
								<p class="mt-1 text-xs text-midnight-500">
									Hold Ctrl/Cmd to select multiple traders
								</p>
							</div>
						</div>
					{/if}
				</div>
			</div>

			<!-- Sidebar -->
			<div class="lg:col-span-1">
				<div class="sticky top-24 space-y-6">
					<!-- Publish Card -->
					<div class="rounded-2xl border border-midnight-800/50 bg-midnight-900/50 p-6">
						<h3 class="font-semibold text-midnight-100 mb-4">Publish</h3>

						<!-- Status -->
						<div class="mb-4">
							<span class="block text-sm font-medium text-midnight-300 mb-2">Status</span>
							<div class="flex gap-2">
								<button
									type="button"
									onclick={() => (status = 'draft')}
									class="flex-1 rounded-lg py-2 text-sm font-medium transition-colors {status === 'draft'
										? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
										: 'bg-midnight-800 text-midnight-400 border border-transparent hover:bg-midnight-700'}"
								>
									Draft
								</button>
								<button
									type="button"
									onclick={() => (status = 'published')}
									class="flex-1 rounded-lg py-2 text-sm font-medium transition-colors {status === 'published'
										? 'bg-green-500/20 text-green-400 border border-green-500/30'
										: 'bg-midnight-800 text-midnight-400 border border-transparent hover:bg-midnight-700'}"
								>
									Published
								</button>
							</div>
							<input type="hidden" name="status" value={status} />
						</div>

						<!-- Meta Info -->
						<div class="mb-4 space-y-2 text-xs text-midnight-500">
							{#if data.post.createdAt}
								<p>Created: {new Date(data.post.createdAt).toLocaleDateString()}</p>
							{/if}
							{#if data.post.updatedAt}
								<p>Updated: {new Date(data.post.updatedAt).toLocaleDateString()}</p>
							{/if}
							{#if data.post.publishedAt}
								<p>Published: {new Date(data.post.publishedAt).toLocaleDateString()}</p>
							{/if}
						</div>

						<!-- Submit -->
						<button
							type="submit"
							disabled={isSubmitting || !title.trim()}
							class="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-4 py-3 font-semibold text-midnight-950 shadow-lg shadow-gold-500/25 transition-all hover:shadow-xl hover:shadow-gold-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<Save class="h-5 w-5" />
							{isSubmitting ? 'Saving...' : 'Save Changes'}
						</button>
					</div>

					<!-- Delete Card -->
					<div class="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
						<h3 class="font-semibold text-red-400 mb-2">Danger Zone</h3>
						<p class="text-sm text-midnight-400 mb-4">
							Permanently delete this post. This action cannot be undone.
						</p>
						{#if showDeleteConfirm}
							<div class="space-y-3">
								<p class="text-sm text-red-400">Are you sure?</p>
								<div class="flex gap-2">
									<button
										type="button"
										onclick={handleDelete}
										disabled={isDeleting}
										class="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors disabled:opacity-50"
									>
										<Trash2 class="h-4 w-4" />
										{isDeleting ? 'Deleting...' : 'Delete'}
									</button>
									<button
										type="button"
										onclick={() => (showDeleteConfirm = false)}
										class="flex-1 rounded-lg bg-midnight-800 px-4 py-2 text-sm font-medium text-midnight-300 hover:bg-midnight-700 transition-colors"
									>
										Cancel
									</button>
								</div>
							</div>
						{:else}
							<button
								type="button"
								onclick={() => (showDeleteConfirm = true)}
								class="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
							>
								<Trash2 class="h-4 w-4" />
								Delete Post
							</button>
						{/if}
					</div>

					<!-- Quick Tips -->
					<div class="rounded-2xl border border-midnight-800/50 bg-midnight-900/50 p-6">
						<h3 class="font-semibold text-midnight-100 mb-4">Writing Tips</h3>
						<ul class="space-y-3 text-sm text-midnight-400">
							<li class="flex items-start gap-2">
								<Type class="h-4 w-4 text-gold-500 mt-0.5 flex-shrink-0" />
								<span>Use clear, compelling headlines</span>
							</li>
							<li class="flex items-start gap-2">
								<FileText class="h-4 w-4 text-gold-500 mt-0.5 flex-shrink-0" />
								<span>Break content into scannable sections</span>
							</li>
							<li class="flex items-start gap-2">
								<Image class="h-4 w-4 text-gold-500 mt-0.5 flex-shrink-0" />
								<span>Add images to increase engagement</span>
							</li>
							<li class="flex items-start gap-2">
								<Tag class="h-4 w-4 text-gold-500 mt-0.5 flex-shrink-0" />
								<span>Use relevant tags for discoverability</span>
							</li>
							<li class="flex items-start gap-2">
								<Users class="h-4 w-4 text-gold-500 mt-0.5 flex-shrink-0" />
								<span>Link to related trader profiles</span>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</form>
</div>
