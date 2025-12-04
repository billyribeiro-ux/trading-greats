<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import {
		Users,
		ArrowLeft,
		Search,
		Filter,
		Trash2,
		Mail,
		CheckCircle2,
		Clock,
		XCircle,
		AlertCircle,
		ChevronLeft,
		ChevronRight,
		Eye,
		MousePointer
	} from 'lucide-svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let searchQuery = $state('');
	let deleteConfirmId = $state<string | null>(null);

	const statusFilters = [
		{ value: '', label: 'All', icon: Users },
		{ value: 'verified', label: 'Verified', icon: CheckCircle2 },
		{ value: 'pending', label: 'Pending', icon: Clock },
		{ value: 'unsubscribed', label: 'Unsubscribed', icon: XCircle },
		{ value: 'bounced', label: 'Bounced', icon: AlertCircle }
	];

	function formatDate(dateStr: string | null): string {
		if (!dateStr) return 'N/A';
		return new Date(dateStr).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getStatusColor(status: string): string {
		switch (status) {
			case 'verified': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
			case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
			case 'unsubscribed': return 'bg-red-500/10 text-red-400 border-red-500/20';
			case 'bounced': return 'bg-red-500/10 text-red-400 border-red-500/20';
			case 'complained': return 'bg-red-500/10 text-red-400 border-red-500/20';
			default: return 'bg-midnight-700 text-midnight-400 border-midnight-600';
		}
	}

	function filterByStatus(status: string) {
		const url = new URL(window.location.href);
		if (status) {
			url.searchParams.set('status', status);
		} else {
			url.searchParams.delete('status');
		}
		url.searchParams.delete('page');
		goto(url.toString());
	}

	function goToPage(page: number) {
		const url = new URL(window.location.href);
		url.searchParams.set('page', page.toString());
		goto(url.toString());
	}

	// Filter subscribers by search query (client-side)
	let filteredSubscribers = $derived(
		searchQuery
			? data.subscribers.filter(s =>
					s.email.toLowerCase().includes(searchQuery.toLowerCase())
				)
			: data.subscribers
	);
</script>

<svelte:head>
	<title>Subscribers - Newsletter Admin | Trading Greats</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center gap-4">
		<a
			href="/admin/newsletter"
			class="flex h-10 w-10 items-center justify-center rounded-lg border border-midnight-700 bg-midnight-800/50 text-midnight-400 transition-colors hover:bg-midnight-700 hover:text-white"
		>
			<ArrowLeft class="h-5 w-5" />
		</a>
		<div>
			<h1 class="text-2xl font-bold text-white">Subscribers</h1>
			<p class="text-sm text-midnight-400">{data.total} total subscribers</p>
		</div>
	</div>

	<!-- Filters & Search -->
	<div class="flex flex-col sm:flex-row gap-4">
		<!-- Status Filters -->
		<div class="flex flex-wrap gap-2">
			{#each statusFilters as filter}
				<button
					onclick={() => filterByStatus(filter.value)}
					class="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors {
						(data.currentStatus || '') === filter.value
							? 'bg-gold-500/10 text-gold-400 border border-gold-500/30'
							: 'bg-midnight-800/50 text-midnight-400 border border-midnight-700 hover:bg-midnight-700 hover:text-white'
					}"
				>
					<filter.icon class="h-4 w-4" />
					{filter.label}
				</button>
			{/each}
		</div>

		<!-- Search -->
		<div class="relative flex-1 max-w-sm">
			<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-midnight-500" />
			<input
				type="text"
				placeholder="Search by email..."
				bind:value={searchQuery}
				class="w-full rounded-lg border border-midnight-700 bg-midnight-800/50 py-2 pl-10 pr-4 text-white placeholder-midnight-500 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
			/>
		</div>
	</div>

	{#if form?.message}
		<div class="p-4 rounded-lg {form.success ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}">
			{form.message}
		</div>
	{/if}

	<!-- Subscribers Table -->
	<div class="rounded-xl border border-midnight-800 bg-midnight-900/50 overflow-hidden">
		{#if filteredSubscribers.length === 0}
			<div class="p-12 text-center">
				<Users class="mx-auto h-12 w-12 text-midnight-600" />
				<p class="mt-4 text-midnight-400">No subscribers found</p>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead class="border-b border-midnight-800 bg-midnight-900/50">
						<tr>
							<th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-midnight-400">Email</th>
							<th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-midnight-400">Status</th>
							<th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-midnight-400">Source</th>
							<th class="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-midnight-400">Opens</th>
							<th class="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-midnight-400">Clicks</th>
							<th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-midnight-400">Subscribed</th>
							<th class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-midnight-400">Actions</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-midnight-800">
						{#each filteredSubscribers as subscriber}
							<tr class="hover:bg-midnight-800/30 transition-colors">
								<td class="px-4 py-4">
									<div class="flex items-center gap-3">
										<div class="flex h-8 w-8 items-center justify-center rounded-full bg-midnight-800 text-midnight-400">
											<Mail class="h-4 w-4" />
										</div>
										<span class="font-medium text-white">{subscriber.email}</span>
									</div>
								</td>
								<td class="px-4 py-4">
									<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border {getStatusColor(subscriber.status)}">
										{subscriber.status}
									</span>
								</td>
								<td class="px-4 py-4 text-sm text-midnight-400">
									{subscriber.source || '-'}
								</td>
								<td class="px-4 py-4 text-center">
									<span class="inline-flex items-center gap-1 text-sm text-midnight-300">
										<Eye class="h-3 w-3 text-midnight-500" />
										{subscriber.totalOpens || 0}
									</span>
								</td>
								<td class="px-4 py-4 text-center">
									<span class="inline-flex items-center gap-1 text-sm text-midnight-300">
										<MousePointer class="h-3 w-3 text-midnight-500" />
										{subscriber.totalClicks || 0}
									</span>
								</td>
								<td class="px-4 py-4 text-sm text-midnight-400">
									{formatDate(subscriber.createdAt)}
								</td>
								<td class="px-4 py-4 text-right">
									{#if deleteConfirmId === subscriber.id}
										<div class="flex items-center justify-end gap-2">
											<form method="POST" action="?/delete" use:enhance>
												<input type="hidden" name="id" value={subscriber.id} />
												<button
													type="submit"
													class="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20"
												>
													Confirm
												</button>
											</form>
											<button
												onclick={() => (deleteConfirmId = null)}
												class="rounded-lg bg-midnight-700 px-3 py-1.5 text-xs font-medium text-midnight-300 hover:bg-midnight-600"
											>
												Cancel
											</button>
										</div>
									{:else}
										<button
											onclick={() => (deleteConfirmId = subscriber.id)}
											class="rounded-lg p-2 text-midnight-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
											title="Delete subscriber"
										>
											<Trash2 class="h-4 w-4" />
										</button>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<!-- Pagination -->
			{#if data.totalPages > 1}
				<div class="flex items-center justify-between border-t border-midnight-800 px-4 py-3">
					<p class="text-sm text-midnight-400">
						Page {data.page} of {data.totalPages}
					</p>
					<div class="flex gap-2">
						<button
							onclick={() => goToPage(data.page - 1)}
							disabled={data.page <= 1}
							class="inline-flex items-center gap-1 rounded-lg border border-midnight-700 bg-midnight-800/50 px-3 py-1.5 text-sm text-midnight-400 transition-colors hover:bg-midnight-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<ChevronLeft class="h-4 w-4" />
							Previous
						</button>
						<button
							onclick={() => goToPage(data.page + 1)}
							disabled={data.page >= data.totalPages}
							class="inline-flex items-center gap-1 rounded-lg border border-midnight-700 bg-midnight-800/50 px-3 py-1.5 text-sm text-midnight-400 transition-colors hover:bg-midnight-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Next
							<ChevronRight class="h-4 w-4" />
						</button>
					</div>
				</div>
			{/if}
		{/if}
	</div>
</div>
