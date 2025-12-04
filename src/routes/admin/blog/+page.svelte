<script lang="ts">
	import {
		Plus,
		Edit,
		Trash2,
		Eye,
		Search,
		Calendar,
		Tag,
		FileText,
		ToggleLeft,
		ToggleRight,
		BookOpen
	} from 'lucide-svelte';
	import { enhance } from '$app/forms';

	let { data } = $props();

	// Use categories from data (passed from server) - reactive
	const BLOG_CATEGORIES = $derived(data.categories);
	let searchQuery = $state('');
	let filterStatus = $state<'all' | 'published' | 'draft'>('all');
	let filterCategory = $state<string>('all');
	let deleteConfirm = $state<string | null>(null);

	const filteredPosts = $derived(() => {
		let filtered = data.posts;

		// Search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(p) =>
					p.title.toLowerCase().includes(query) ||
					p.excerpt?.toLowerCase().includes(query) ||
					p.category?.toLowerCase().includes(query)
			);
		}

		// Status filter
		if (filterStatus !== 'all') {
			filtered = filtered.filter((p) => p.status === filterStatus);
		}

		// Category filter
		if (filterCategory !== 'all') {
			filtered = filtered.filter((p) => p.category === filterCategory);
		}

		return filtered;
	});

	function formatDate(dateString: string | null): string {
		if (!dateString) return '—';
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function getCategoryLabel(category: string | null): string {
		if (!category) return 'Uncategorized';
		return BLOG_CATEGORIES.find((c) => c.value === category)?.label || category;
	}
</script>

<svelte:head>
	<title>Manage Blog | Admin</title>
</svelte:head>

<div class="min-h-screen bg-midnight-950">
	<!-- Header -->
	<header class="border-b border-midnight-800/50 bg-midnight-900/50 backdrop-blur-xl sticky top-0 z-50">
		<div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
			<div class="flex items-center gap-4">
				<a href="/admin" class="text-midnight-400 hover:text-midnight-200 transition-colors">
					← Dashboard
				</a>
			</div>
			<a
				href="/"
				target="_blank"
				class="text-sm text-midnight-400 hover:text-midnight-200 transition-colors"
			>
				View Site →
			</a>
		</div>
	</header>

	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Page Header -->
		<div class="flex items-center justify-between mb-8">
			<div>
				<h1 class="font-display text-3xl font-bold text-midnight-50">Blog Posts</h1>
				<p class="mt-2 text-midnight-400">Create, edit, and manage your blog content</p>
			</div>
			<a
				href="/admin/blog/new"
				class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-5 py-2.5 font-semibold text-midnight-950 shadow-lg shadow-gold-500/25 transition-all hover:shadow-xl hover:shadow-gold-500/30 hover:scale-[1.02] active:scale-[0.98]"
			>
				<Plus class="h-5 w-5" />
				New Post
			</a>
		</div>

		<!-- Filters -->
		<div class="flex flex-col sm:flex-row gap-4 mb-6">
			<!-- Search -->
			<div class="relative flex-1">
				<Search class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-midnight-500" />
				<input
					type="text"
					placeholder="Search posts..."
					bind:value={searchQuery}
					class="w-full rounded-xl border border-midnight-700 bg-midnight-800/50 py-3 pl-12 pr-4 text-midnight-100 placeholder-midnight-500 outline-none transition-all focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
				/>
			</div>

			<!-- Status Filter -->
			<select
				bind:value={filterStatus}
				class="rounded-xl border border-midnight-700 bg-midnight-800/50 px-4 py-3 text-midnight-100 outline-none transition-all focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
			>
				<option value="all">All Status</option>
				<option value="published">Published</option>
				<option value="draft">Drafts</option>
			</select>

			<!-- Category Filter -->
			<select
				bind:value={filterCategory}
				class="rounded-xl border border-midnight-700 bg-midnight-800/50 px-4 py-3 text-midnight-100 outline-none transition-all focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
			>
				<option value="all">All Categories</option>
				{#each BLOG_CATEGORIES as cat}
					<option value={cat.value}>{cat.label}</option>
				{/each}
			</select>
		</div>

		<!-- Posts Table -->
		{#if filteredPosts().length === 0}
			<div class="rounded-2xl border border-midnight-800/50 bg-midnight-900/30 p-12 text-center">
				<BookOpen class="h-16 w-16 text-midnight-600 mx-auto mb-4" />
				<h3 class="text-xl font-semibold text-midnight-100 mb-2">No blog posts yet</h3>
				<p class="text-midnight-400 mb-6">Start creating content to build your audience</p>
				<a
					href="/admin/blog/new"
					class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-6 py-3 font-semibold text-midnight-950 shadow-lg shadow-gold-500/25"
				>
					<Plus class="h-5 w-5" />
					Write Your First Post
				</a>
			</div>
		{:else}
			<div class="overflow-hidden rounded-2xl border border-midnight-800/50">
				<table class="w-full">
					<thead class="bg-midnight-900/50">
						<tr>
							<th class="px-4 py-3 text-left text-xs font-medium text-midnight-400 uppercase tracking-wider">
								Post
							</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-midnight-400 uppercase tracking-wider hidden md:table-cell">
								Category
							</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-midnight-400 uppercase tracking-wider hidden lg:table-cell">
								Date
							</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-midnight-400 uppercase tracking-wider">
								Status
							</th>
							<th class="px-4 py-3 text-right text-xs font-medium text-midnight-400 uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-midnight-800/50">
						{#each filteredPosts() as post (post.id)}
							<tr class="bg-midnight-950/50 hover:bg-midnight-900/30 transition-colors">
								<td class="px-4 py-4">
									<div class="flex items-center gap-4">
										{#if post.heroImage}
											<img
												src={post.heroImage}
												alt=""
												class="h-12 w-16 rounded-lg object-cover hidden sm:block"
											/>
										{:else}
											<div class="h-12 w-16 rounded-lg bg-midnight-800 flex items-center justify-center hidden sm:flex">
												<FileText class="h-5 w-5 text-midnight-600" />
											</div>
										{/if}
										<div class="min-w-0">
											<p class="font-medium text-midnight-100 truncate">{post.title}</p>
											{#if post.excerpt}
												<p class="text-sm text-midnight-500 line-clamp-1">{post.excerpt}</p>
											{/if}
										</div>
									</div>
								</td>
								<td class="px-4 py-4 hidden md:table-cell">
									{#if post.category}
										<span class="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-400">
											<Tag class="h-3 w-3" />
											{getCategoryLabel(post.category)}
										</span>
									{:else}
										<span class="text-midnight-500 text-sm">—</span>
									{/if}
								</td>
								<td class="px-4 py-4 hidden lg:table-cell">
									<div class="flex items-center gap-2 text-sm text-midnight-400">
										<Calendar class="h-4 w-4" />
										{formatDate(post.publishedAt || post.createdAt)}
									</div>
								</td>
								<td class="px-4 py-4">
									<form method="POST" action="?/toggleStatus" use:enhance>
										<input type="hidden" name="id" value={post.id} />
										<input type="hidden" name="status" value={post.status} />
										<button
											type="submit"
											class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors {post.status ===
											'published'
												? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
												: 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'}"
										>
											{#if post.status === 'published'}
												<ToggleRight class="h-3.5 w-3.5" />
											{:else}
												<ToggleLeft class="h-3.5 w-3.5" />
											{/if}
											{post.status}
										</button>
									</form>
								</td>
								<td class="px-4 py-4">
									<div class="flex items-center justify-end gap-2">
										{#if post.status === 'published'}
											<a
												href="/blog/{post.slug}"
												target="_blank"
												class="rounded-lg p-2 text-midnight-400 hover:bg-midnight-800 hover:text-midnight-200 transition-colors"
												title="View"
											>
												<Eye class="h-4 w-4" />
											</a>
										{/if}
										<a
											href="/admin/blog/{post.id}"
											class="rounded-lg p-2 text-midnight-400 hover:bg-midnight-800 hover:text-gold-400 transition-colors"
											title="Edit"
										>
											<Edit class="h-4 w-4" />
										</a>
										{#if deleteConfirm === post.id}
											<form method="POST" action="?/delete" use:enhance class="flex items-center gap-1">
												<input type="hidden" name="id" value={post.id} />
												<button
													type="submit"
													class="rounded-lg bg-red-500 px-2 py-1 text-xs font-medium text-white hover:bg-red-600 transition-colors"
												>
													Confirm
												</button>
												<button
													type="button"
													onclick={() => (deleteConfirm = null)}
													class="rounded-lg bg-midnight-700 px-2 py-1 text-xs font-medium text-midnight-300 hover:bg-midnight-600 transition-colors"
												>
													Cancel
												</button>
											</form>
										{:else}
											<button
												type="button"
												onclick={() => (deleteConfirm = post.id)}
												class="rounded-lg p-2 text-midnight-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
												title="Delete"
											>
												<Trash2 class="h-4 w-4" />
											</button>
										{/if}
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<!-- Stats Footer -->
			<div class="mt-4 flex items-center justify-between text-sm text-midnight-500">
				<p>
					Showing {filteredPosts().length} of {data.posts.length} posts
				</p>
				<div class="flex items-center gap-4">
					<span class="flex items-center gap-1.5">
						<span class="h-2 w-2 rounded-full bg-green-500"></span>
						{data.posts.filter((p) => p.status === 'published').length} Published
					</span>
					<span class="flex items-center gap-1.5">
						<span class="h-2 w-2 rounded-full bg-yellow-500"></span>
						{data.posts.filter((p) => p.status === 'draft').length} Drafts
					</span>
				</div>
			</div>
		{/if}
	</main>
</div>
