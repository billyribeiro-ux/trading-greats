<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import SEO from '$lib/components/SEO.svelte';
	import { enhance } from '$app/forms';
	import { CircleCheck, CircleX, Mail, ArrowRight } from 'lucide-svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let isSubmitting = $state(false);
	let reason = $state('');

	const unsubscribeReasons = [
		'Too many emails',
		'Content not relevant',
		'Never signed up',
		'Other'
	];
</script>

<SEO
	title="Unsubscribe - Trading Greats"
	description="Unsubscribe from Trading Greats newsletter"
/>

<div class="min-h-screen bg-midnight-950 flex items-center justify-center px-4">
	<div class="max-w-md w-full">
		<div class="bg-midnight-900/50 border border-midnight-800 rounded-2xl p-8">
			{#if !data.valid}
				<!-- Invalid token -->
				<div class="text-center">
					<div class="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
						<CircleX class="w-8 h-8 text-red-400" />
					</div>
					<h1 class="text-2xl font-bold text-white mb-3">Invalid Link</h1>
					<p class="text-midnight-400 mb-8">
						This unsubscribe link is invalid or has expired.
					</p>
					<a
						href="/"
						class="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300"
					>
						Go to Homepage
						<ArrowRight class="w-4 h-4" />
					</a>
				</div>
			{:else if data.alreadyUnsubscribed || form?.success}
				<!-- Already unsubscribed or just unsubscribed -->
				<div class="text-center">
					<div class="mx-auto w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
						<CircleCheck class="w-8 h-8 text-emerald-400" />
					</div>
					<h1 class="text-2xl font-bold text-white mb-3">You're Unsubscribed</h1>
					<p class="text-midnight-400 mb-8">
						You won't receive any more emails from us. We're sorry to see you go!
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
				<!-- Unsubscribe form -->
				<div class="text-center mb-8">
					<div class="mx-auto w-16 h-16 bg-midnight-800 rounded-full flex items-center justify-center mb-6">
						<Mail class="w-8 h-8 text-midnight-400" />
					</div>
					<h1 class="text-2xl font-bold text-white mb-3">Unsubscribe</h1>
					<p class="text-midnight-400">
						Are you sure you want to unsubscribe <span class="text-white font-medium">{data.email}</span> from our newsletter?
					</p>
				</div>

				<form
					method="POST"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ update }) => {
							await update();
							isSubmitting = false;
						};
					}}
				>
					<fieldset class="mb-6">
						<legend class="block text-sm font-medium text-midnight-300 mb-3">
							Why are you unsubscribing? (optional)
						</legend>
						<div class="space-y-2">
							{#each unsubscribeReasons as reasonOption}
								<label class="flex items-center gap-3 p-3 rounded-lg border border-midnight-700 bg-midnight-800/50 cursor-pointer hover:border-midnight-600 transition-colors">
									<input
										type="radio"
										name="reason"
										value={reasonOption}
										bind:group={reason}
										class="w-4 h-4 text-gold-500 bg-midnight-800 border-midnight-600 focus:ring-gold-500/50"
									/>
									<span class="text-midnight-300">{reasonOption}</span>
								</label>
							{/each}
						</div>
					</fieldset>

					{#if form?.message && !form?.success}
						<div class="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
							{form.message}
						</div>
					{/if}

					<div class="flex flex-col gap-3">
						<button
							type="submit"
							disabled={isSubmitting}
							class="w-full rounded-xl bg-red-500/10 border border-red-500/20 px-6 py-3 font-semibold text-red-400 transition-all hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isSubmitting ? 'Unsubscribing...' : 'Yes, Unsubscribe Me'}
						</button>
						<a
							href="/"
							class="w-full text-center rounded-xl border border-midnight-700 px-6 py-3 font-semibold text-midnight-300 transition-all hover:bg-midnight-800"
						>
							Cancel
						</a>
					</div>
				</form>
			{/if}
		</div>
	</div>
</div>
