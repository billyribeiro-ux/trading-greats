<script lang="ts">
	import type { PageData } from './$types';
	import {
		Mail,
		Users,
		Send,
		Eye,
		MousePointer,
		TrendingUp,
		TrendingDown,
		Plus,
		ArrowRight,
		Clock,
		CircleCheck,
		CircleX,
		BarChart3
	} from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	const stats = $derived([
		{
			label: 'Total Subscribers',
			value: data.stats.totalSubscribers,
			icon: Users,
			color: 'text-blue-400',
			bg: 'bg-blue-500/10'
		},
		{
			label: 'Verified',
			value: data.stats.verifiedSubscribers,
			icon: CircleCheck,
			color: 'text-emerald-400',
			bg: 'bg-emerald-500/10'
		},
		{
			label: 'Campaigns Sent',
			value: data.stats.sentCampaigns,
			icon: Send,
			color: 'text-violet-400',
			bg: 'bg-violet-500/10'
		},
		{
			label: 'Avg Open Rate',
			value: `${data.stats.avgOpenRate}%`,
			icon: Eye,
			color: 'text-gold-400',
			bg: 'bg-gold-500/10'
		},
		{
			label: 'Avg Click Rate',
			value: `${data.stats.avgClickRate}%`,
			icon: MousePointer,
			color: 'text-sky-400',
			bg: 'bg-sky-500/10'
		},
		{
			label: 'New (30 days)',
			value: data.stats.subscribersLast30Days,
			icon: TrendingUp,
			color: 'text-emerald-400',
			bg: 'bg-emerald-500/10'
		}
	]);

	function formatDate(dateStr: string | null): string {
		if (!dateStr) return 'N/A';
		return new Date(dateStr).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function getCampaignStatusColor(status: string | null): string {
		switch (status) {
			case 'sent': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
			case 'draft': return 'bg-midnight-700 text-midnight-400 border-midnight-600';
			case 'sending': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
			case 'scheduled': return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
			default: return 'bg-midnight-700 text-midnight-400 border-midnight-600';
		}
	}
</script>

<svelte:head>
	<title>Newsletter - Admin | Trading Greats</title>
</svelte:head>

<div class="space-y-8">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div>
			<h1 class="text-3xl font-bold text-white">Newsletter</h1>
			<p class="mt-1 text-midnight-400">Manage your email marketing campaigns</p>
		</div>
		<div class="flex gap-3">
			<a
				href="/admin/newsletter/subscribers"
				class="inline-flex items-center gap-2 rounded-xl border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-sm font-medium text-midnight-300 transition-colors hover:bg-midnight-700 hover:text-white"
			>
				<Users class="h-4 w-4" />
				Subscribers
			</a>
			<a
				href="/admin/newsletter/campaigns/new"
				class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-4 py-2.5 text-sm font-semibold text-midnight-950 shadow-lg shadow-gold-500/25 transition-all hover:shadow-xl hover:shadow-gold-500/30"
			>
				<Plus class="h-4 w-4" />
				New Campaign
			</a>
		</div>
	</div>

	<!-- Stats Grid -->
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
		{#each stats as stat}
			<div class="rounded-xl border border-midnight-800 bg-midnight-900/50 p-5">
				<div class="flex items-center gap-3">
					<div class="flex h-10 w-10 items-center justify-center rounded-lg {stat.bg}">
						<stat.icon class="h-5 w-5 {stat.color}" />
					</div>
					<div>
						<p class="text-2xl font-bold text-white">{stat.value}</p>
						<p class="text-xs text-midnight-400">{stat.label}</p>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<div class="grid gap-6 lg:grid-cols-2">
		<!-- Recent Campaigns -->
		<div class="rounded-xl border border-midnight-800 bg-midnight-900/50">
			<div class="flex items-center justify-between border-b border-midnight-800 p-5">
				<h2 class="text-lg font-semibold text-white flex items-center gap-2">
					<Send class="h-5 w-5 text-gold-400" />
					Recent Campaigns
				</h2>
				<a
					href="/admin/newsletter/campaigns"
					class="text-sm text-gold-400 hover:text-gold-300 flex items-center gap-1"
				>
					View All
					<ArrowRight class="h-4 w-4" />
				</a>
			</div>
			<div class="divide-y divide-midnight-800">
				{#if data.recentCampaigns.length === 0}
					<div class="p-8 text-center">
						<Mail class="mx-auto h-12 w-12 text-midnight-600" />
						<p class="mt-4 text-midnight-400">No campaigns yet</p>
						<a
							href="/admin/newsletter/campaigns/new"
							class="mt-4 inline-flex items-center gap-2 text-sm text-gold-400 hover:text-gold-300"
						>
							<Plus class="h-4 w-4" />
							Create your first campaign
						</a>
					</div>
				{:else}
					{#each data.recentCampaigns as campaign}
						<a href="/admin/newsletter/campaigns/{campaign.id}" class="block p-4 hover:bg-midnight-800/30 transition-colors">
							<div class="flex items-start justify-between gap-4">
								<div class="min-w-0 flex-1">
									<p class="font-medium text-white truncate">{campaign.subject}</p>
									<div class="mt-1 flex items-center gap-3 text-sm text-midnight-400">
										<span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border {getCampaignStatusColor(campaign.status)}">
											{campaign.status}
										</span>
										{#if campaign.sentAt}
											<span class="flex items-center gap-1">
												<Clock class="h-3 w-3" />
												{formatDate(campaign.sentAt)}
											</span>
										{/if}
									</div>
								</div>
								{#if campaign.status === 'sent'}
									<div class="text-right text-sm">
										<p class="text-white">{campaign.uniqueOpens || 0} opens</p>
										<p class="text-midnight-400">{campaign.uniqueClicks || 0} clicks</p>
									</div>
								{/if}
							</div>
						</a>
					{/each}
				{/if}
			</div>
		</div>

		<!-- Recent Subscribers -->
		<div class="rounded-xl border border-midnight-800 bg-midnight-900/50">
			<div class="flex items-center justify-between border-b border-midnight-800 p-5">
				<h2 class="text-lg font-semibold text-white flex items-center gap-2">
					<Users class="h-5 w-5 text-gold-400" />
					Recent Subscribers
				</h2>
				<a
					href="/admin/newsletter/subscribers"
					class="text-sm text-gold-400 hover:text-gold-300 flex items-center gap-1"
				>
					View All
					<ArrowRight class="h-4 w-4" />
				</a>
			</div>
			<div class="divide-y divide-midnight-800">
				{#if data.recentSubscribers.length === 0}
					<div class="p-8 text-center">
						<Users class="mx-auto h-12 w-12 text-midnight-600" />
						<p class="mt-4 text-midnight-400">No subscribers yet</p>
						<p class="mt-2 text-sm text-midnight-500">
							Share your newsletter signup form to get started
						</p>
					</div>
				{:else}
					{#each data.recentSubscribers as subscriber}
						<div class="p-4">
							<div class="flex items-center justify-between gap-4">
								<div class="min-w-0 flex-1">
									<p class="font-medium text-white truncate">{subscriber.email}</p>
									<div class="mt-1 flex items-center gap-3 text-sm text-midnight-400">
										<span class="flex items-center gap-1">
											<Clock class="h-3 w-3" />
											{formatDate(subscriber.createdAt)}
										</span>
										{#if subscriber.source}
											<span class="text-midnight-500">via {subscriber.source}</span>
										{/if}
									</div>
								</div>
								<div class="text-right text-sm">
									<p class="text-midnight-300">{subscriber.totalOpens || 0} opens</p>
									<p class="text-midnight-500">{subscriber.totalClicks || 0} clicks</p>
								</div>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>

	<!-- Quick Stats Summary -->
	<div class="rounded-xl border border-midnight-800 bg-midnight-900/50 p-6">
		<h2 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
			<BarChart3 class="h-5 w-5 text-gold-400" />
			Performance Overview
		</h2>
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
			<div>
				<p class="text-sm text-midnight-400 mb-1">Pending Verification</p>
				<p class="text-2xl font-bold text-amber-400">{data.stats.pendingSubscribers}</p>
			</div>
			<div>
				<p class="text-sm text-midnight-400 mb-1">Unsubscribed</p>
				<p class="text-2xl font-bold text-red-400">{data.stats.unsubscribedCount}</p>
			</div>
			<div>
				<p class="text-sm text-midnight-400 mb-1">Total Campaigns</p>
				<p class="text-2xl font-bold text-white">{data.stats.totalCampaigns}</p>
			</div>
			<div>
				<p class="text-sm text-midnight-400 mb-1">Unsubscribes (30 days)</p>
				<p class="text-2xl font-bold text-red-400">{data.stats.unsubscribesLast30Days}</p>
			</div>
		</div>
	</div>
</div>
