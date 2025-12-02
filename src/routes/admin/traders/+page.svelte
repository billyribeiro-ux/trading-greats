<script lang="ts">
	import { Plus, Edit, Trash2, Eye, Search } from 'lucide-svelte';

	let { data } = $props();
	let searchQuery = $state('');

	const filteredTraders = $derived(
		searchQuery
			? data.traders.filter((t: any) =>
					t.name.toLowerCase().includes(searchQuery.toLowerCase())
				)
			: data.traders
	);
</script>

<svelte:head>
	<title>Manage Traders | Admin</title>
</svelte:head>

<div class="min-h-screen bg-midnight-950">
	<!-- Header -->
	<header class="border-b border-midnight-800/50 bg-midnight-900/50">
		<div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
			<div class="flex items-center gap-4">
				<a href="/admin" class="text-midnight-400 hover:text-midnight-200">← Back to Dashboard</a>
			</div>
			<a href="/" class="text-sm text-midnight-400 hover:text-midnight-200" target="_blank">
				View Site →
			</a>
		</div>
	</header>

	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="font-display text-3xl font-bold text-midnight-50">Manage Traders</h1>
				<p class="mt-2 text-midnight-400">Add, edit, or remove trader profiles</p>
			</div>
			<a
				href="/admin/traders/new"
				class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-4 py-2 font-semibold text-midnight-950 shadow-lg shadow-gold-500/25 transition-all hover:shadow-xl hover:shadow-gold-500/30"
			>
				<Plus class="h-5 w-5" />
				Add Trader
			</a>
		</div>

		<!-- Search -->
		<div class="mt-8">
			<div class="relative max-w-md">
				<Search class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-midnight-500" />
				<input
					type="text"
					placeholder="Search traders..."
					bind:value={searchQuery}
					class="w-full rounded-xl border border-midnight-700 bg-midnight-800/50 py-3 pl-12 pr-4 text-midnight-100 placeholder-midnight-500 outline-none transition-all focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
				/>
			</div>
		</div>

		<!-- Traders Table -->
		<div class="mt-6 overflow-hidden rounded-xl border border-midnight-800/50">
			<table class="w-full">
				<thead class="bg-midnight-900/50">
					<tr>
						<th class="px-4 py-3 text-left text-sm font-medium text-midnight-400">Trader</th>
						<th class="px-4 py-3 text-left text-sm font-medium text-midnight-400">Style</th>
						<th class="px-4 py-3 text-left text-sm font-medium text-midnight-400">Net Worth</th>
						<th class="px-4 py-3 text-left text-sm font-medium text-midnight-400">Status</th>
						<th class="px-4 py-3 text-right text-sm font-medium text-midnight-400">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-midnight-800/50">
					{#each filteredTraders as trader}
						<tr class="bg-midnight-950/50 hover:bg-midnight-900/30">
							<td class="px-4 py-4">
								<div class="flex items-center gap-3">
									<img
										src={trader.photoUrl}
										alt={trader.name}
										class="h-12 w-12 rounded-lg object-cover"
									/>
									<div>
										<p class="font-medium text-midnight-100">{trader.name}</p>
										<p class="text-sm text-midnight-500">{trader.nationality}</p>
									</div>
								</div>
							</td>
							<td class="px-4 py-4 text-sm text-midnight-300">{trader.tradingStyle || '—'}</td>
							<td class="px-4 py-4 text-sm text-midnight-300">{trader.netWorth || '—'}</td>
							<td class="px-4 py-4">
								<span class="inline-flex rounded-full px-2 py-1 text-xs font-medium {trader.status === 'published' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}">
									{trader.status}
								</span>
							</td>
							<td class="px-4 py-4">
								<div class="flex items-center justify-end gap-2">
									<a
										href="/traders/{trader.slug}"
										target="_blank"
										class="rounded-lg p-2 text-midnight-400 hover:bg-midnight-800 hover:text-midnight-200"
										title="View"
									>
										<Eye class="h-4 w-4" />
									</a>
									<a
										href="/admin/traders/{trader.id}"
										class="rounded-lg p-2 text-midnight-400 hover:bg-midnight-800 hover:text-gold-400"
										title="Edit"
									>
										<Edit class="h-4 w-4" />
									</a>
									<button
										type="button"
										class="rounded-lg p-2 text-midnight-400 hover:bg-red-500/10 hover:text-red-400"
										title="Delete"
									>
										<Trash2 class="h-4 w-4" />
									</button>
								</div>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="5" class="px-4 py-12 text-center text-midnight-500">
								No traders found
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</main>
</div>
