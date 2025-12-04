<script lang="ts">
	import {
		Users,
		FileText,
		TrendingUp,
		Plus,
		LogOut,
		BookOpen,
		Eye,
		Edit,
		PenTool,
		BarChart3,
		Settings,
		Mail,
		Image as ImageIcon
	} from 'lucide-svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Admin Dashboard | Trading Greats</title>
</svelte:head>

<div class="min-h-screen bg-midnight-950">
	<!-- Header -->
	<header class="border-b border-midnight-800/50 bg-midnight-900/50 backdrop-blur-xl sticky top-0 z-50">
		<div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
			<div class="flex items-center gap-3">
				<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 shadow-lg shadow-gold-500/20">
					<TrendingUp class="h-5 w-5 text-midnight-950" />
				</div>
				<span class="font-display text-xl font-bold text-midnight-50">
					Trading<span class="text-gold-400">Greats</span>
					<span class="ml-2 rounded-full bg-gold-500/20 px-2.5 py-0.5 text-xs font-semibold text-gold-400 border border-gold-500/30">Admin</span>
				</span>
			</div>

			<div class="flex items-center gap-4">
				<a
					href="/"
					target="_blank"
					class="inline-flex items-center gap-2 text-sm text-midnight-400 hover:text-midnight-200 transition-colors"
				>
					<Eye class="h-4 w-4" />
					View Site
				</a>
				<a
					href="/admin/newsletter"
					class="inline-flex items-center gap-2 text-sm text-midnight-400 hover:text-midnight-200 transition-colors"
				>
					<Mail class="h-4 w-4" />
					Newsletter
				</a>
				<a
					href="/admin/settings"
					class="inline-flex items-center gap-2 text-sm text-midnight-400 hover:text-midnight-200 transition-colors"
				>
					<Settings class="h-4 w-4" />
					Settings
				</a>
				<form method="POST" action="/admin/logout">
					<button
						type="submit"
						class="flex items-center gap-2 text-sm text-midnight-400 hover:text-red-400 transition-colors"
					>
						<LogOut class="h-4 w-4" />
						Logout
					</button>
				</form>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Welcome -->
		<div class="mb-8">
			<h1 class="font-display text-3xl font-bold text-midnight-50">Dashboard</h1>
			<p class="mt-2 text-midnight-400">Welcome back! Manage your content and grow your library.</p>
		</div>

		<!-- Stats Grid -->
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
			<div class="rounded-2xl border border-midnight-800/50 bg-gradient-to-br from-midnight-900/80 to-midnight-900/40 p-6 backdrop-blur-sm">
				<div class="flex items-center justify-between">
					<Users class="h-8 w-8 text-gold-500" />
					<span class="text-xs font-medium text-midnight-500 uppercase tracking-wider">Traders</span>
				</div>
				<p class="mt-4 text-4xl font-bold text-midnight-50">{data.traderCount}</p>
				<p class="text-sm text-midnight-400">Total profiles</p>
			</div>

			<div class="rounded-2xl border border-midnight-800/50 bg-gradient-to-br from-midnight-900/80 to-midnight-900/40 p-6 backdrop-blur-sm">
				<div class="flex items-center justify-between">
					<FileText class="h-8 w-8 text-green-500" />
					<span class="text-xs font-medium text-midnight-500 uppercase tracking-wider">Published</span>
				</div>
				<p class="mt-4 text-4xl font-bold text-midnight-50">{data.publishedCount}</p>
				<p class="text-sm text-midnight-400">Live traders</p>
			</div>

			<div class="rounded-2xl border border-midnight-800/50 bg-gradient-to-br from-midnight-900/80 to-midnight-900/40 p-6 backdrop-blur-sm">
				<div class="flex items-center justify-between">
					<BookOpen class="h-8 w-8 text-violet-500" />
					<span class="text-xs font-medium text-midnight-500 uppercase tracking-wider">Blog</span>
				</div>
				<p class="mt-4 text-4xl font-bold text-midnight-50">{data.blogCount ?? 0}</p>
				<p class="text-sm text-midnight-400">Blog posts</p>
			</div>

			<div class="rounded-2xl border border-midnight-800/50 bg-gradient-to-br from-midnight-900/80 to-midnight-900/40 p-6 backdrop-blur-sm">
				<div class="flex items-center justify-between">
					<PenTool class="h-8 w-8 text-amber-500" />
					<span class="text-xs font-medium text-midnight-500 uppercase tracking-wider">Drafts</span>
				</div>
				<p class="mt-4 text-4xl font-bold text-midnight-50">{data.draftCount}</p>
				<p class="text-sm text-midnight-400">Pending review</p>
			</div>

			<div class="rounded-2xl border border-midnight-800/50 bg-gradient-to-br from-midnight-900/80 to-midnight-900/40 p-6 backdrop-blur-sm">
				<div class="flex items-center justify-between">
					<ImageIcon class="h-8 w-8 text-pink-500" />
					<span class="text-xs font-medium text-midnight-500 uppercase tracking-wider">Media</span>
				</div>
				<p class="mt-4 text-4xl font-bold text-midnight-50">{data.mediaCount ?? 0}</p>
				<p class="text-sm text-midnight-400">Uploaded files</p>
			</div>
		</div>

		<!-- Quick Actions -->
		<div class="mt-10">
			<h2 class="text-lg font-semibold text-midnight-100 mb-4">Quick Actions</h2>
			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
				<a
					href="/admin/traders/new"
					class="group flex items-center gap-4 rounded-2xl border border-midnight-800/50 bg-midnight-900/50 p-5 transition-all duration-300 hover:border-gold-500/30 hover:bg-midnight-800/50 hover:shadow-lg hover:shadow-gold-500/5"
				>
					<div class="flex h-14 w-14 items-center justify-center rounded-xl bg-gold-500/10 transition-transform duration-300 group-hover:scale-110">
						<Plus class="h-7 w-7 text-gold-500" />
					</div>
					<div>
						<p class="font-semibold text-midnight-100">Add Trader</p>
						<p class="text-sm text-midnight-400">Create new profile</p>
					</div>
				</a>

				<a
					href="/admin/traders"
					class="group flex items-center gap-4 rounded-2xl border border-midnight-800/50 bg-midnight-900/50 p-5 transition-all duration-300 hover:border-blue-500/30 hover:bg-midnight-800/50 hover:shadow-lg hover:shadow-blue-500/5"
				>
					<div class="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/10 transition-transform duration-300 group-hover:scale-110">
						<Users class="h-7 w-7 text-blue-500" />
					</div>
					<div>
						<p class="font-semibold text-midnight-100">Manage Traders</p>
						<p class="text-sm text-midnight-400">Edit existing profiles</p>
					</div>
				</a>

				<a
					href="/admin/blog/new"
					class="group flex items-center gap-4 rounded-2xl border border-midnight-800/50 bg-midnight-900/50 p-5 transition-all duration-300 hover:border-violet-500/30 hover:bg-midnight-800/50 hover:shadow-lg hover:shadow-violet-500/5"
				>
					<div class="flex h-14 w-14 items-center justify-center rounded-xl bg-violet-500/10 transition-transform duration-300 group-hover:scale-110">
						<PenTool class="h-7 w-7 text-violet-500" />
					</div>
					<div>
						<p class="font-semibold text-midnight-100">Write Post</p>
						<p class="text-sm text-midnight-400">Create blog content</p>
					</div>
				</a>

				<a
					href="/admin/blog"
					class="group flex items-center gap-4 rounded-2xl border border-midnight-800/50 bg-midnight-900/50 p-5 transition-all duration-300 hover:border-emerald-500/30 hover:bg-midnight-800/50 hover:shadow-lg hover:shadow-emerald-500/5"
				>
					<div class="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/10 transition-transform duration-300 group-hover:scale-110">
						<BookOpen class="h-7 w-7 text-emerald-500" />
					</div>
					<div>
						<p class="font-semibold text-midnight-100">Manage Blog</p>
						<p class="text-sm text-midnight-400">Edit blog posts</p>
					</div>
				</a>

				<a
					href="/admin/newsletter"
					class="group flex items-center gap-4 rounded-2xl border border-midnight-800/50 bg-midnight-900/50 p-5 transition-all duration-300 hover:border-pink-500/30 hover:bg-midnight-800/50 hover:shadow-lg hover:shadow-pink-500/5"
				>
					<div class="flex h-14 w-14 items-center justify-center rounded-xl bg-pink-500/10 transition-transform duration-300 group-hover:scale-110">
						<Mail class="h-7 w-7 text-pink-500" />
					</div>
					<div>
						<p class="font-semibold text-midnight-100">Newsletter</p>
						<p class="text-sm text-midnight-400">Email campaigns</p>
					</div>
				</a>

				<a
					href="/admin/media"
					class="group flex items-center gap-4 rounded-2xl border border-midnight-800/50 bg-midnight-900/50 p-5 transition-all duration-300 hover:border-cyan-500/30 hover:bg-midnight-800/50 hover:shadow-lg hover:shadow-cyan-500/5"
				>
					<div class="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/10 transition-transform duration-300 group-hover:scale-110">
						<ImageIcon class="h-7 w-7 text-cyan-500" />
					</div>
					<div>
						<p class="font-semibold text-midnight-100">Media Library</p>
						<p class="text-sm text-midnight-400">Manage images & SEO</p>
					</div>
				</a>
			</div>
		</div>

		<!-- Recent Content Grid -->
		<div class="mt-10 grid gap-8 lg:grid-cols-2">
			<!-- Recent Traders -->
			<div>
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-lg font-semibold text-midnight-100">Recent Traders</h2>
					<a href="/admin/traders" class="text-sm text-gold-400 hover:text-gold-300 transition-colors">
						View all →
					</a>
				</div>
				<div class="overflow-hidden rounded-2xl border border-midnight-800/50 bg-midnight-900/30">
					<table class="w-full">
						<thead class="bg-midnight-900/50">
							<tr>
								<th class="px-4 py-3 text-left text-xs font-medium text-midnight-400 uppercase tracking-wider">Name</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-midnight-400 uppercase tracking-wider">Status</th>
								<th class="px-4 py-3 text-right text-xs font-medium text-midnight-400 uppercase tracking-wider">Action</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-midnight-800/50">
							{#each data.recentTraders.slice(0, 5) as trader}
								<tr class="hover:bg-midnight-800/30 transition-colors">
									<td class="px-4 py-3">
										<div class="flex items-center gap-3">
											<img
												src={trader.photoUrl}
												alt={trader.name}
												class="h-10 w-10 rounded-lg object-cover"
											/>
											<div>
												<p class="font-medium text-midnight-100 text-sm">{trader.name}</p>
												<p class="text-xs text-midnight-500">{trader.tradingStyle}</p>
											</div>
										</div>
									</td>
									<td class="px-4 py-3">
										<span class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium {trader.status === 'published' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}">
											{trader.status}
										</span>
									</td>
									<td class="px-4 py-3 text-right">
										<a href="/admin/traders/{trader.id}" class="text-sm text-gold-400 hover:text-gold-300">
											<Edit class="h-4 w-4" />
										</a>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>

			<!-- Recent Blog Posts -->
			<div>
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-lg font-semibold text-midnight-100">Recent Posts</h2>
					<a href="/admin/blog" class="text-sm text-gold-400 hover:text-gold-300 transition-colors">
						View all →
					</a>
				</div>
				<div class="overflow-hidden rounded-2xl border border-midnight-800/50 bg-midnight-900/30">
					{#if data.recentPosts && data.recentPosts.length > 0}
						<table class="w-full">
							<thead class="bg-midnight-900/50">
								<tr>
									<th class="px-4 py-3 text-left text-xs font-medium text-midnight-400 uppercase tracking-wider">Title</th>
									<th class="px-4 py-3 text-left text-xs font-medium text-midnight-400 uppercase tracking-wider">Status</th>
									<th class="px-4 py-3 text-right text-xs font-medium text-midnight-400 uppercase tracking-wider">Action</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-midnight-800/50">
								{#each data.recentPosts.slice(0, 5) as post}
									<tr class="hover:bg-midnight-800/30 transition-colors">
										<td class="px-4 py-3">
											<p class="font-medium text-midnight-100 text-sm line-clamp-1">{post.title}</p>
											<p class="text-xs text-midnight-500">{post.category}</p>
										</td>
										<td class="px-4 py-3">
											<span class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium {post.status === 'published' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}">
												{post.status}
											</span>
										</td>
										<td class="px-4 py-3 text-right">
											<a href="/admin/blog/{post.id}" class="text-sm text-gold-400 hover:text-gold-300">
												<Edit class="h-4 w-4" />
											</a>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					{:else}
						<div class="p-8 text-center">
							<BookOpen class="h-12 w-12 text-midnight-600 mx-auto mb-3" />
							<p class="text-midnight-400 mb-4">No blog posts yet</p>
							<a
								href="/admin/blog/new"
								class="inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-400 hover:bg-violet-500/20 transition-colors"
							>
								<PenTool class="h-4 w-4" />
								Write your first post
							</a>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</main>
</div>
