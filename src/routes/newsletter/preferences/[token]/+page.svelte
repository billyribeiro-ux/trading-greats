<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import SEO from '$lib/components/SEO.svelte';
	import { enhance } from '$app/forms';
	import { CircleCheck, CircleX, Settings, Mail, Bell, BookOpen, TrendingUp, ArrowRight } from 'lucide-svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let isSubmitting = $state(false);

	// Local state for preferences - initialized with defaults, synced via $effect
	let weeklyDigest = $state(true);
	let newTraderAlerts = $state(true);
	let blogPostAlerts = $state(true);
	let marketInsights = $state(false);

	// Sync preferences from data
	$effect(() => {
		if (data.preferences) {
			weeklyDigest = data.preferences.weeklyDigest ?? true;
			newTraderAlerts = data.preferences.newTraderAlerts ?? true;
			blogPostAlerts = data.preferences.blogPostAlerts ?? true;
			marketInsights = data.preferences.marketInsights ?? false;
		}
	});

	const preferenceOptions = [
		{
			key: 'weeklyDigest',
			label: 'Weekly Digest',
			description: 'A curated summary of the best trading insights each week',
			icon: Mail
		},
		{
			key: 'newTraderAlerts',
			label: 'New Trader Profiles',
			description: 'Get notified when we add new legendary traders',
			icon: TrendingUp
		},
		{
			key: 'blogPostAlerts',
			label: 'Blog Post Updates',
			description: 'New articles and deep dives into trading strategies',
			icon: BookOpen
		},
		{
			key: 'marketInsights',
			label: 'Market Insights',
			description: 'Occasional market analysis and commentary',
			icon: Bell
		}
	];

	function getPreferenceValue(key: string): boolean {
		switch (key) {
			case 'weeklyDigest': return weeklyDigest;
			case 'newTraderAlerts': return newTraderAlerts;
			case 'blogPostAlerts': return blogPostAlerts;
			case 'marketInsights': return marketInsights;
			default: return false;
		}
	}

	function togglePreference(key: string) {
		switch (key) {
			case 'weeklyDigest': weeklyDigest = !weeklyDigest; break;
			case 'newTraderAlerts': newTraderAlerts = !newTraderAlerts; break;
			case 'blogPostAlerts': blogPostAlerts = !blogPostAlerts; break;
			case 'marketInsights': marketInsights = !marketInsights; break;
		}
	}
</script>

<SEO
	title="Email Preferences - Trading Greats"
	description="Manage your Trading Greats newsletter preferences"
/>

<div class="min-h-screen bg-midnight-950 flex items-center justify-center px-4 py-12">
	<div class="max-w-lg w-full">
		{#if !data.valid}
			<!-- Invalid token -->
			<div class="bg-midnight-900/50 border border-midnight-800 rounded-2xl p-8 text-center">
				<div class="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
					<CircleX class="w-8 h-8 text-red-400" />
				</div>
				<h1 class="text-2xl font-bold text-white mb-3">Invalid Link</h1>
				<p class="text-midnight-400 mb-8">
					This preferences link is invalid or has expired.
				</p>
				<a
					href="/"
					class="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300"
				>
					Go to Homepage
					<ArrowRight class="w-4 h-4" />
				</a>
			</div>
		{:else if data.status === 'unsubscribed' || form?.action === 'unsubscribe'}
			<!-- Unsubscribed -->
			<div class="bg-midnight-900/50 border border-midnight-800 rounded-2xl p-8 text-center">
				<div class="mx-auto w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
					<CircleCheck class="w-8 h-8 text-emerald-400" />
				</div>
				<h1 class="text-2xl font-bold text-white mb-3">You're Unsubscribed</h1>
				<p class="text-midnight-400 mb-8">
					You won't receive any more emails from us.
				</p>
				<a
					href="/"
					class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-6 py-3 font-semibold text-midnight-950 shadow-lg shadow-gold-500/25 transition-all hover:shadow-xl hover:shadow-gold-500/30"
				>
					Visit Trading Greats
					<ArrowRight class="w-4 h-4" />
				</a>
			</div>
		{:else}
			<!-- Preferences form -->
			<div class="bg-midnight-900/50 border border-midnight-800 rounded-2xl p-8">
				<div class="text-center mb-8">
					<div class="mx-auto w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center mb-6">
						<Settings class="w-8 h-8 text-gold-400" />
					</div>
					<h1 class="text-2xl font-bold text-white mb-3">Email Preferences</h1>
					<p class="text-midnight-400">
						Manage what emails you receive at <span class="text-white font-medium">{data.email}</span>
					</p>
				</div>

				{#if form?.action === 'updatePreferences' && form?.success}
					<div class="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-3">
						<CircleCheck class="w-5 h-5 flex-shrink-0" />
						{form.message}
					</div>
				{/if}

				{#if form?.message && !form?.success}
					<div class="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
						{form.message}
					</div>
				{/if}

				<form
					method="POST"
					action="?/updatePreferences"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ update }) => {
							await update();
							isSubmitting = false;
						};
					}}
				>
					<div class="space-y-4 mb-8">
						{#each preferenceOptions as pref}
							<label class="flex items-start gap-4 p-4 rounded-xl border border-midnight-700 bg-midnight-800/30 cursor-pointer hover:border-midnight-600 transition-colors">
								<div class="relative flex items-center">
									<input
										type="checkbox"
										name={pref.key}
										checked={getPreferenceValue(pref.key)}
										onchange={() => togglePreference(pref.key)}
										class="w-5 h-5 rounded border-midnight-600 bg-midnight-800 text-gold-500 focus:ring-gold-500/50 focus:ring-offset-0"
									/>
								</div>
								<div class="flex-1">
									<div class="flex items-center gap-2 mb-1">
										<pref.icon class="w-4 h-4 text-gold-400" />
										<span class="font-medium text-white">{pref.label}</span>
									</div>
									<p class="text-sm text-midnight-400">{pref.description}</p>
								</div>
							</label>
						{/each}
					</div>

					<button
						type="submit"
						disabled={isSubmitting}
						class="w-full rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-6 py-3 font-semibold text-midnight-950 shadow-lg shadow-gold-500/25 transition-all hover:shadow-xl hover:shadow-gold-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isSubmitting ? 'Saving...' : 'Save Preferences'}
					</button>
				</form>

				<div class="mt-8 pt-6 border-t border-midnight-700">
					<p class="text-sm text-midnight-500 text-center mb-4">
						Want to stop all emails?
					</p>
					<form method="POST" action="?/unsubscribe" use:enhance>
						<button
							type="submit"
							class="w-full rounded-xl border border-red-500/20 bg-red-500/5 px-6 py-3 font-medium text-red-400 transition-all hover:bg-red-500/10"
						>
							Unsubscribe from all emails
						</button>
					</form>
				</div>
			</div>
		{/if}
	</div>
</div>
