<script lang="ts">
	import { Users, FileText, TrendingUp, Plus, Settings, LogOut } from 'lucide-svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Admin Dashboard | Trading Greats</title>
</svelte:head>

<div class="min-h-screen bg-midnight-950">
	<!-- Header -->
	<header class="border-b border-midnight-800/50 bg-midnight-900/50">
		<div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
			<div class="flex items-center gap-3">
				<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-gold-500 to-gold-600">
					<TrendingUp class="h-5 w-5 text-midnight-950" />
				</div>
				<span class="font-display text-xl font-bold text-midnight-50">
					Trading<span class="text-gold-400">Greats</span>
					<span class="ml-2 rounded bg-gold-500/20 px-2 py-0.5 text-xs text-gold-400">Admin</span>
				</span>
			</div>

			<div class="flex items-center gap-4">
				<a href="/" class="text-sm text-midnight-400 hover:text-midnight-200" target="_blank">
					View Site →
				</a>
				<form method="POST" action="/admin/logout">
					<button type="submit" class="flex items-center gap-2 text-sm text-midnight-400 hover:text-red-400">
						<LogOut class="h-4 w-4" />
						Logout
					</button>
				</form>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<h1 class="font-display text-3xl font-bold text-midnight-50">Dashboard</h1>
		<p class="mt-2 text-midnight-400">Welcome back! Manage your traders and content.</p>

		<!-- Stats -->
		<div class="mt-8 grid gap-4 sm:grid-cols-3">
			<div class="rounded-xl border border-midnight-800/50 bg-midnight-900/50 p-6">
				<Users class="h-8 w-8 text-gold-500" />
				<p class="mt-4 text-3xl font-bold text-midnight-50">{data.traderCount}</p>
				<p class="text-sm text-midnight-400">Total Traders</p>
			</div>
			<div class="rounded-xl border border-midnight-800/50 bg-midnight-900/50 p-6">
				<FileText class="h-8 w-8 text-green-500" />
				<p class="mt-4 text-3xl font-bold text-midnight-50">{data.publishedCount}</p>
				<p class="text-sm text-midnight-400">Published</p>
			</div>
			<div class="rounded-xl border border-midnight-800/50 bg-midnight-900/50 p-6">
				<FileText class="h-8 w-8 text-yellow-500" />
				<p class="mt-4 text-3xl font-bold text-midnight-50">{data.draftCount}</p>
				<p class="text-sm text-midnight-400">Drafts</p>
			</div>
		</div>

		<!-- Quick Actions -->
		<div class="mt-8">
			<h2 class="text-lg font-semibold text-midnight-100">Quick Actions</h2>
			<div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<a
					href="/admin/traders/new"
					class="flex items-center gap-4 rounded-xl border border-midnight-800/50 bg-midnight-900/50 p-4 transition-all hover:border-gold-500/30 hover:bg-midnight-800/50"
				>
					<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-gold-500/10">
						<Plus class="h-6 w-6 text-gold-500" />
					</div>
					<div>
						<p class="font-medium text-midnight-100">Add Trader</p>
						<p class="text-sm text-midnight-400">Create a new profile</p>
					</div>
				</a>

				<a
					href="/admin/traders"
					class="flex items-center gap-4 rounded-xl border border-midnight-800/50 bg-midnight-900/50 p-4 transition-all hover:border-gold-500/30 hover:bg-midnight-800/50"
				>
					<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
						<Users class="h-6 w-6 text-blue-500" />
					</div>
					<div>
						<p class="font-medium text-midnight-100">Manage Traders</p>
						<p class="text-sm text-midnight-400">Edit existing profiles</p>
					</div>
				</a>
			</div>
		</div>

		<!-- Recent Traders -->
		<div class="mt-8">
			<div class="flex items-center justify-between">
				<h2 class="text-lg font-semibold text-midnight-100">Recent Traders</h2>
				<a href="/admin/traders" class="text-sm text-gold-400 hover:text-gold-300">View all →</a>
			</div>
			<div class="mt-4 overflow-hidden rounded-xl border border-midnight-800/50">
				<table class="w-full">
					<thead class="bg-midnight-900/50">
						<tr>
							<th class="px-4 py-3 text-left text-sm font-medium text-midnight-400">Name</th>
							<th class="px-4 py-3 text-left text-sm font-medium text-midnight-400">Style</th>
							<th class="px-4 py-3 text-left text-sm font-medium text-midnight-400">Status</th>
							<th class="px-4 py-3 text-right text-sm font-medium text-midnight-400">Actions</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-midnight-800/50">
						{#each data.recentTraders as trader}
							<tr class="bg-midnight-950/50">
								<td class="px-4 py-3">
									<div class="flex items-center gap-3">
										<img
											src={trader.photoUrl}
											alt={trader.name}
											class="h-10 w-10 rounded-lg object-cover"
										/>
										<div>
											<p class="font-medium text-midnight-100">{trader.name}</p>
											<p class="text-sm text-midnight-500">{trader.oneLiner?.substring(0, 40)}...</p>
										</div>
									</div>
								</td>
								<td class="px-4 py-3 text-sm text-midnight-300">{trader.tradingStyle}</td>
								<td class="px-4 py-3">
									<span class="inline-flex rounded-full px-2 py-1 text-xs font-medium {trader.status === 'published' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}">
										{trader.status}
									</span>
								</td>
								<td class="px-4 py-3 text-right">
									<a href="/admin/traders/{trader.id}" class="text-sm text-gold-400 hover:text-gold-300">
										Edit
									</a>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</main>
</div>
