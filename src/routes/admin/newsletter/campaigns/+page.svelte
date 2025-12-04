<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import {
		Send,
		ArrowLeft,
		Plus,
		Filter,
		Trash2,
		Edit,
		Eye,
		MousePointer,
		Clock,
		CheckCircle2,
		ChevronLeft,
		ChevronRight,
		Play,
		FileText,
		Users
	} from 'lucide-svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let deleteConfirmId = $state<string | null>(null);
	let sendConfirmId = $state<string | null>(null);

	const statusFilters = [
		{ value: '', label: 'All' },
		{ value: 'draft', label: 'Drafts' },
		{ value: 'sent', label: 'Sent' },
		{ value: 'scheduled', label: 'Scheduled' }
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
			case 'sent': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
			case 'draft': return 'bg-midnight-700 text-midnight-400 border-midnight-600';
			case 'sending': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
			case 'scheduled': return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
			case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
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

	function calculateRate(numerator: number | null, denominator: number | null): string {
		if (!denominator || denominator === 0) return '0%';
		const rate = ((numerator || 0) / denominator) * 100;
		return `${rate.toFixed(1)}%`;
	}
</script>

<svelte:head>
	<title>Campaigns - Newsletter Admin | Trading Greats</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div class="flex items-center gap-4">
			<a
				href="/admin/newsletter"
				class="flex h-10 w-10 items-center justify-center rounded-lg border border-midnight-700 bg-midnight-800/50 text-midnight-400 transition-colors hover:bg-midnight-700 hover:text-white"
			>
				<ArrowLeft class="h-5 w-5" />
			</a>
			<div>
				<h1 class="text-2xl font-bold text-white">Campaigns</h1>
				<p class="text-sm text-midnight-400">{data.total} total campaigns</p>
			</div>
		</div>
		<a
			href="/admin/newsletter/campaigns/new"
			class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-4 py-2.5 text-sm font-semibold text-midnight-950 shadow-lg shadow-gold-500/25 transition-all hover:shadow-xl hover:shadow-gold-500/30"
		>
			<Plus class="h-4 w-4" />
			New Campaign
		</a>
	</div>

	<!-- Filters -->
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
				{filter.label}
			</button>
		{/each}
	</div>

	{#if form?.message}
		<div class="p-4 rounded-lg {form.success ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}">
			{form.message}
		</div>
	{/if}

	<!-- Campaigns List -->
	<div class="space-y-4">
		{#if data.campaigns.length === 0}
			<div class="rounded-xl border border-midnight-800 bg-midnight-900/50 p-12 text-center">
				<Send class="mx-auto h-12 w-12 text-midnight-600" />
				<p class="mt-4 text-midnight-400">No campaigns found</p>
				<a
					href="/admin/newsletter/campaigns/new"
					class="mt-4 inline-flex items-center gap-2 text-sm text-gold-400 hover:text-gold-300"
				>
					<Plus class="h-4 w-4" />
					Create your first campaign
				</a>
			</div>
		{:else}
			{#each data.campaigns as campaign}
				<div class="rounded-xl border border-midnight-800 bg-midnight-900/50 p-6 hover:border-midnight-700 transition-colors">
					<div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
						<div class="flex-1 min-w-0">
							<div class="flex items-center gap-3 mb-2">
								<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border {getStatusColor(campaign.status)}">
									{campaign.status}
								</span>
								<span class="text-xs text-midnight-500 uppercase">{campaign.type}</span>
							</div>
							<h3 class="text-lg font-semibold text-white truncate">{campaign.subject}</h3>
							{#if campaign.previewText}
								<p class="mt-1 text-sm text-midnight-400 truncate">{campaign.previewText}</p>
							{/if}
							<div class="mt-3 flex flex-wrap items-center gap-4 text-sm text-midnight-500">
								<span class="flex items-center gap-1">
									<Clock class="h-3.5 w-3.5" />
									{campaign.sentAt ? formatDate(campaign.sentAt) : formatDate(campaign.createdAt)}
								</span>
								{#if campaign.status === 'sent'}
									<span class="flex items-center gap-1">
										<Users class="h-3.5 w-3.5" />
										{campaign.totalSent} sent
									</span>
								{/if}
							</div>
						</div>

						{#if campaign.status === 'sent'}
							<!-- Stats for sent campaigns -->
							<div class="flex items-center gap-6">
								<div class="text-center">
									<div class="flex items-center gap-1 text-lg font-semibold text-white">
										<Eye class="h-4 w-4 text-blue-400" />
										{campaign.uniqueOpens || 0}
									</div>
									<p class="text-xs text-midnight-500">Opens ({calculateRate(campaign.uniqueOpens, campaign.totalSent)})</p>
								</div>
								<div class="text-center">
									<div class="flex items-center gap-1 text-lg font-semibold text-white">
										<MousePointer class="h-4 w-4 text-emerald-400" />
										{campaign.uniqueClicks || 0}
									</div>
									<p class="text-xs text-midnight-500">Clicks ({calculateRate(campaign.uniqueClicks, campaign.totalSent)})</p>
								</div>
							</div>
						{/if}

						<!-- Actions -->
						<div class="flex items-center gap-2">
							{#if campaign.status === 'draft'}
								{#if sendConfirmId === campaign.id}
									<div class="flex items-center gap-2">
										<form method="POST" action="?/send" use:enhance>
											<input type="hidden" name="id" value={campaign.id} />
											<button
												type="submit"
												class="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/20"
											>
												Confirm Send
											</button>
										</form>
										<button
											onclick={() => (sendConfirmId = null)}
											class="rounded-lg bg-midnight-700 px-3 py-2 text-sm font-medium text-midnight-300 hover:bg-midnight-600"
										>
											Cancel
										</button>
									</div>
								{:else}
									<button
										onclick={() => (sendConfirmId = campaign.id)}
										class="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors"
									>
										<Play class="h-4 w-4" />
										Send
									</button>
								{/if}
								<a
									href="/admin/newsletter/campaigns/{campaign.id}"
									class="inline-flex items-center gap-2 rounded-lg border border-midnight-700 bg-midnight-800/50 px-3 py-2 text-sm font-medium text-midnight-300 hover:bg-midnight-700 hover:text-white transition-colors"
								>
									<Edit class="h-4 w-4" />
									Edit
								</a>
							{:else}
								<a
									href="/admin/newsletter/campaigns/{campaign.id}"
									class="inline-flex items-center gap-2 rounded-lg border border-midnight-700 bg-midnight-800/50 px-3 py-2 text-sm font-medium text-midnight-300 hover:bg-midnight-700 hover:text-white transition-colors"
								>
									<FileText class="h-4 w-4" />
									View
								</a>
							{/if}

							{#if campaign.status === 'draft'}
								{#if deleteConfirmId === campaign.id}
									<div class="flex items-center gap-2">
										<form method="POST" action="?/delete" use:enhance>
											<input type="hidden" name="id" value={campaign.id} />
											<button
												type="submit"
												class="rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20"
											>
												Delete
											</button>
										</form>
										<button
											onclick={() => (deleteConfirmId = null)}
											class="rounded-lg bg-midnight-700 px-3 py-2 text-sm font-medium text-midnight-300 hover:bg-midnight-600"
										>
											Cancel
										</button>
									</div>
								{:else}
									<button
										onclick={() => (deleteConfirmId = campaign.id)}
										class="rounded-lg p-2 text-midnight-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
										title="Delete campaign"
									>
										<Trash2 class="h-4 w-4" />
									</button>
								{/if}
							{/if}
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>

	<!-- Pagination -->
	{#if data.totalPages > 1}
		<div class="flex items-center justify-between">
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
</div>
