<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import {
		ArrowLeft,
		Send,
		Eye,
		MousePointer,
		Users,
		Clock,
		CircleCheck,
		Play,
		Edit,
		Save,
		X,
		BarChart3,
		Activity,
		ExternalLink
	} from 'lucide-svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let isEditing = $state(false);
	let isSubmitting = $state(false);
	let sendConfirm = $state(false);

	// Editable fields - initialized empty, synced via $effect
	let subject = $state('');
	let previewText = $state('');
	let content = $state('');

	// Derived status checks
	const isDraft = $derived(data.campaign.status === 'draft');
	const isSent = $derived(data.campaign.status === 'sent');

	// Sync campaign data to editable fields
	$effect(() => {
		subject = data.campaign.subject ?? '';
		previewText = data.campaign.previewText || '';
		content = data.campaign.content ?? '';
	});

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

	function calculateRate(numerator: number | null, denominator: number | null): string {
		if (!denominator || denominator === 0) return '0%';
		const rate = ((numerator || 0) / denominator) * 100;
		return `${rate.toFixed(1)}%`;
	}

	function getEventIcon(eventType: string) {
		switch (eventType) {
			case 'sent': return Send;
			case 'delivered': return CircleCheck;
			case 'opened': return Eye;
			case 'clicked': return MousePointer;
			default: return Activity;
		}
	}

	function getEventColor(eventType: string): string {
		switch (eventType) {
			case 'sent': return 'text-blue-400';
			case 'delivered': return 'text-emerald-400';
			case 'opened': return 'text-violet-400';
			case 'clicked': return 'text-gold-400';
			case 'unsubscribed': return 'text-red-400';
			default: return 'text-midnight-400';
		}
	}

	function getStatusColor(status: string | null): string {
		switch (status) {
			case 'sent': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
			case 'draft': return 'bg-midnight-700 text-midnight-400 border-midnight-600';
			case 'sending': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
			default: return 'bg-midnight-700 text-midnight-400 border-midnight-600';
		}
	}
</script>

<svelte:head>
	<title>{data.campaign.subject} - Campaign | Trading Greats</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div class="flex items-center gap-4">
			<a
				href="/admin/newsletter/campaigns"
				class="flex h-10 w-10 items-center justify-center rounded-lg border border-midnight-700 bg-midnight-800/50 text-midnight-400 transition-colors hover:bg-midnight-700 hover:text-white"
			>
				<ArrowLeft class="h-5 w-5" />
			</a>
			<div>
				<div class="flex items-center gap-3">
					<h1 class="text-xl font-bold text-white">{data.campaign.subject}</h1>
					<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border {getStatusColor(data.campaign.status)}">
						{data.campaign.status}
					</span>
				</div>
				<p class="text-sm text-midnight-400">
					Created {formatDate(data.campaign.createdAt)}
				</p>
			</div>
		</div>

		{#if isDraft}
			<div class="flex gap-3">
				{#if !isEditing}
					<button
						onclick={() => (isEditing = true)}
						class="inline-flex items-center gap-2 rounded-xl border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-sm font-medium text-midnight-300 transition-colors hover:bg-midnight-700 hover:text-white"
					>
						<Edit class="h-4 w-4" />
						Edit
					</button>
				{/if}

				{#if sendConfirm}
					<div class="flex items-center gap-2">
						<form method="POST" action="?/send" use:enhance>
							<button
								type="submit"
								class="rounded-xl bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-400 hover:bg-emerald-500/20"
							>
								Confirm Send
							</button>
						</form>
						<button
							onclick={() => (sendConfirm = false)}
							class="rounded-xl bg-midnight-700 px-4 py-2.5 text-sm font-medium text-midnight-300 hover:bg-midnight-600"
						>
							Cancel
						</button>
					</div>
				{:else}
					<button
						onclick={() => (sendConfirm = true)}
						class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-4 py-2.5 text-sm font-semibold text-midnight-950 shadow-lg shadow-gold-500/25 transition-all hover:shadow-xl hover:shadow-gold-500/30"
					>
						<Play class="h-4 w-4" />
						Send Campaign
					</button>
				{/if}
			</div>
		{/if}
	</div>

	{#if form?.message}
		<div class="p-4 rounded-lg {form.success ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}">
			{form.message}
		</div>
	{/if}

	{#if isSent}
		<!-- Stats for sent campaigns -->
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
			<div class="rounded-xl border border-midnight-800 bg-midnight-900/50 p-5">
				<div class="flex items-center gap-3">
					<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
						<Send class="h-5 w-5 text-blue-400" />
					</div>
					<div>
						<p class="text-2xl font-bold text-white">{data.campaign.totalSent || 0}</p>
						<p class="text-xs text-midnight-400">Sent</p>
					</div>
				</div>
			</div>
			<div class="rounded-xl border border-midnight-800 bg-midnight-900/50 p-5">
				<div class="flex items-center gap-3">
					<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
						<Eye class="h-5 w-5 text-violet-400" />
					</div>
					<div>
						<p class="text-2xl font-bold text-white">{data.campaign.uniqueOpens || 0}</p>
						<p class="text-xs text-midnight-400">Opens ({calculateRate(data.campaign.uniqueOpens, data.campaign.totalSent)})</p>
					</div>
				</div>
			</div>
			<div class="rounded-xl border border-midnight-800 bg-midnight-900/50 p-5">
				<div class="flex items-center gap-3">
					<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-500/10">
						<MousePointer class="h-5 w-5 text-gold-400" />
					</div>
					<div>
						<p class="text-2xl font-bold text-white">{data.campaign.uniqueClicks || 0}</p>
						<p class="text-xs text-midnight-400">Clicks ({calculateRate(data.campaign.uniqueClicks, data.campaign.totalSent)})</p>
					</div>
				</div>
			</div>
			<div class="rounded-xl border border-midnight-800 bg-midnight-900/50 p-5">
				<div class="flex items-center gap-3">
					<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
						<Users class="h-5 w-5 text-red-400" />
					</div>
					<div>
						<p class="text-2xl font-bold text-white">{data.campaign.totalUnsubscribes || 0}</p>
						<p class="text-xs text-midnight-400">Unsubscribes</p>
					</div>
				</div>
			</div>
			<div class="rounded-xl border border-midnight-800 bg-midnight-900/50 p-5">
				<div class="flex items-center gap-3">
					<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
						<Clock class="h-5 w-5 text-emerald-400" />
					</div>
					<div>
						<p class="text-sm font-bold text-white">{formatDate(data.campaign.sentAt)}</p>
						<p class="text-xs text-midnight-400">Sent At</p>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<div class="grid gap-6 lg:grid-cols-2">
		<!-- Campaign Content -->
		<div class="space-y-6">
			{#if isEditing && isDraft}
				<!-- Edit Form -->
				<form
					method="POST"
					action="?/update"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ update }) => {
							await update();
							isSubmitting = false;
							isEditing = false;
						};
					}}
					class="space-y-4"
				>
					<div class="rounded-xl border border-midnight-800 bg-midnight-900/50 p-6 space-y-4">
						<div>
							<label for="subject" class="block text-sm font-medium text-white mb-2">Subject</label>
							<input
								type="text"
								id="subject"
								name="subject"
								bind:value={subject}
								required
								class="w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-3 text-white outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
							/>
						</div>
						<div>
							<label for="previewText" class="block text-sm font-medium text-white mb-2">Preview Text</label>
							<input
								type="text"
								id="previewText"
								name="previewText"
								bind:value={previewText}
								class="w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-3 text-white outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
							/>
						</div>
						<div>
							<label for="content" class="block text-sm font-medium text-white mb-2">Content (HTML)</label>
							<textarea
								id="content"
								name="content"
								bind:value={content}
								required
								rows="12"
								class="w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-3 text-white outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 font-mono text-sm"
							></textarea>
						</div>
					</div>

					<div class="flex gap-3">
						<button
							type="submit"
							disabled={isSubmitting}
							class="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-6 py-3 font-semibold text-midnight-950 shadow-lg shadow-gold-500/25 transition-all hover:shadow-xl hover:shadow-gold-500/30 disabled:opacity-50"
						>
							<Save class="h-5 w-5" />
							{isSubmitting ? 'Saving...' : 'Save Changes'}
						</button>
						<button
							type="button"
							onclick={() => {
								isEditing = false;
								subject = data.campaign.subject;
								previewText = data.campaign.previewText || '';
								content = data.campaign.content;
							}}
							class="inline-flex items-center justify-center gap-2 rounded-xl border border-midnight-700 bg-midnight-800/50 px-6 py-3 font-medium text-midnight-300 transition-colors hover:bg-midnight-700 hover:text-white"
						>
							<X class="h-5 w-5" />
							Cancel
						</button>
					</div>
				</form>
			{:else}
				<!-- View Mode -->
				<div class="rounded-xl border border-midnight-800 bg-midnight-900/50 p-6">
					<h3 class="text-sm font-medium text-midnight-400 mb-2">Subject</h3>
					<p class="text-lg text-white">{data.campaign.subject}</p>

					{#if data.campaign.previewText}
						<h3 class="text-sm font-medium text-midnight-400 mt-4 mb-2">Preview Text</h3>
						<p class="text-midnight-300">{data.campaign.previewText}</p>
					{/if}

					<h3 class="text-sm font-medium text-midnight-400 mt-4 mb-2">Type</h3>
					<p class="text-midnight-300 capitalize">{data.campaign.type?.replace('_', ' ') ?? 'N/A'}</p>
				</div>
			{/if}

			<!-- Email Preview -->
			<div class="rounded-xl border border-midnight-800 bg-midnight-900/50 overflow-hidden">
				<div class="border-b border-midnight-800 p-4">
					<h3 class="font-medium text-white flex items-center gap-2">
						<Eye class="h-4 w-4 text-gold-400" />
						Email Preview
					</h3>
				</div>
				<div class="p-6 bg-[#0a0a0f]">
					<div class="max-w-[600px] mx-auto bg-[#12121a] rounded-2xl overflow-hidden">
						<div class="p-8 text-center border-b border-[rgba(212,175,55,0.2)]">
							<h1 class="text-2xl font-bold text-[#d4af37]">Trading Greats</h1>
						</div>
						<div class="p-8">
							{@html isEditing ? content : data.campaign.content}
						</div>
						<div class="p-6 text-center border-t border-[rgba(255,255,255,0.1)]">
							<p class="text-xs text-[#6b7280]">
								<span class="text-[#d4af37] cursor-default">Manage preferences</span> ·
								<span class="text-[#6b7280] cursor-default">Unsubscribe</span>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Activity Feed (for sent campaigns) -->
		{#if isSent && data.events.length > 0}
			<div class="rounded-xl border border-midnight-800 bg-midnight-900/50 overflow-hidden">
				<div class="border-b border-midnight-800 p-4">
					<h3 class="font-medium text-white flex items-center gap-2">
						<Activity class="h-4 w-4 text-gold-400" />
						Recent Activity
					</h3>
				</div>
				<div class="divide-y divide-midnight-800 max-h-[600px] overflow-y-auto">
					{#each data.events as event}
						{@const EventIcon = getEventIcon(event.eventType)}
						<div class="p-4 hover:bg-midnight-800/30 transition-colors">
							<div class="flex items-start gap-3">
								<div class="mt-0.5">
									<EventIcon class="h-4 w-4 {getEventColor(event.eventType)}" />
								</div>
								<div class="flex-1 min-w-0">
									<p class="text-sm text-white capitalize">{event.eventType}</p>
									{#if event.linkUrl}
										<a
											href={event.linkUrl}
											target="_blank"
											rel="noopener noreferrer"
											class="text-xs text-gold-400 hover:text-gold-300 flex items-center gap-1 truncate"
										>
											{event.linkUrl}
											<ExternalLink class="h-3 w-3 flex-shrink-0" />
										</a>
									{/if}
									<div class="mt-1 flex items-center gap-2 text-xs text-midnight-500">
										<span>{formatDate(event.timestamp)}</span>
										{#if event.device}
											<span>· {event.device}</span>
										{/if}
										{#if event.emailClient}
											<span>· {event.emailClient}</span>
										{/if}
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{:else if isSent}
			<div class="rounded-xl border border-midnight-800 bg-midnight-900/50 p-12 text-center">
				<Activity class="mx-auto h-12 w-12 text-midnight-600" />
				<p class="mt-4 text-midnight-400">No activity recorded yet</p>
				<p class="mt-2 text-sm text-midnight-500">Events will appear as recipients interact with the email</p>
			</div>
		{/if}
	</div>
</div>
