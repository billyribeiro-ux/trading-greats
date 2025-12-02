<script lang="ts">
	import { enhance } from '$app/forms';
	import { ArrowLeft, Save, Plus, X } from 'lucide-svelte';
	import type { PageData, ActionData } from './$types';

	interface LocalQuote {
		text: string;
		source: string;
	}

	let { data, form }: { data: PageData; form: ActionData } = $props();
	const trader = $derived(data.trader);

	let quotes = $state<LocalQuote[]>(data.trader.quotes?.map((q) => ({ text: q.text, source: q.source || '' })) || [{ text: '', source: '' }]);
	let achievements = $state<string[]>(data.trader.achievements || ['']);

	function addQuote() {
		quotes = [...quotes, { text: '', source: '' }];
	}

	function removeQuote(index: number) {
		quotes = quotes.filter((_: LocalQuote, i: number) => i !== index);
	}

	function addAchievement() {
		achievements = [...achievements, ''];
	}

	function removeAchievement(index: number) {
		achievements = achievements.filter((_: string, i: number) => i !== index);
	}
</script>

<svelte:head>
	<title>Edit {trader.name} | Admin</title>
</svelte:head>

<div class="min-h-screen bg-midnight-950">
	<!-- Header -->
	<header class="border-b border-midnight-800/50 bg-midnight-900/50">
		<div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
			<a href="/admin/traders" class="flex items-center gap-2 text-midnight-400 hover:text-midnight-200">
				<ArrowLeft class="h-4 w-4" />
				Back to Traders
			</a>
			<a href="/traders/{trader.slug}" class="text-sm text-midnight-400 hover:text-midnight-200" target="_blank">
				View Profile →
			</a>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
		<h1 class="font-display text-3xl font-bold text-midnight-50">Edit {trader.name}</h1>
		<p class="mt-2 text-midnight-400">Update trader profile information</p>

		{#if form?.error}
			<div class="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400">
				{form.error}
			</div>
		{/if}

		<form method="POST" use:enhance class="mt-8 space-y-8">
			<!-- Basic Info -->
			<section class="rounded-xl border border-midnight-800/50 bg-midnight-900/50 p-6">
				<h2 class="font-display text-xl font-semibold text-midnight-100">Basic Information</h2>
				
				<div class="mt-6 grid gap-6 sm:grid-cols-2">
					<div class="sm:col-span-2">
						<label for="name" class="block text-sm font-medium text-midnight-300">Name *</label>
						<input
							type="text"
							id="name"
							name="name"
							required
							value={trader.name}
							class="mt-2 block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
						/>
					</div>

					<div class="sm:col-span-2">
						<label for="oneLiner" class="block text-sm font-medium text-midnight-300">One-Liner *</label>
						<input
							type="text"
							id="oneLiner"
							name="oneLiner"
							required
							value={trader.oneLiner || ''}
							class="mt-2 block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
						/>
					</div>

					<div>
						<label for="nationality" class="block text-sm font-medium text-midnight-300">Nationality</label>
						<input
							type="text"
							id="nationality"
							name="nationality"
							value={trader.nationality || ''}
							class="mt-2 block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
						/>
					</div>

					<div>
						<label for="tradingStyle" class="block text-sm font-medium text-midnight-300">Trading Style</label>
						<select
							id="tradingStyle"
							name="tradingStyle"
							class="mt-2 block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
						>
							<option value="">Select style...</option>
							<option value="Value Investing" selected={trader.tradingStyle === 'Value Investing'}>Value Investing</option>
							<option value="Momentum Growth" selected={trader.tradingStyle === 'Momentum Growth'}>Momentum Growth</option>
							<option value="Macro & Currency" selected={trader.tradingStyle === 'Macro & Currency'}>Macro & Currency</option>
							<option value="Options & Technical Analysis" selected={trader.tradingStyle === 'Options & Technical Analysis'}>Options & Technical Analysis</option>
							<option value="Options & Price Action" selected={trader.tradingStyle === 'Options & Price Action'}>Options & Price Action</option>
							<option value="Day Trading" selected={trader.tradingStyle === 'Day Trading'}>Day Trading</option>
							<option value="Swing Trading" selected={trader.tradingStyle === 'Swing Trading'}>Swing Trading</option>
							<option value="Quantitative" selected={trader.tradingStyle === 'Quantitative'}>Quantitative</option>
						</select>
					</div>

					<div>
						<label for="birthYear" class="block text-sm font-medium text-midnight-300">Birth Year</label>
						<input
							type="number"
							id="birthYear"
							name="birthYear"
							min="1800"
							max="2010"
							value={trader.birthYear || ''}
							class="mt-2 block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
						/>
					</div>

					<div>
						<label for="deathYear" class="block text-sm font-medium text-midnight-300">Death Year (if applicable)</label>
						<input
							type="number"
							id="deathYear"
							name="deathYear"
							min="1800"
							max="2030"
							value={trader.deathYear || ''}
							class="mt-2 block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
						/>
					</div>

					<div>
						<label for="netWorth" class="block text-sm font-medium text-midnight-300">Net Worth</label>
						<input
							type="text"
							id="netWorth"
							name="netWorth"
							value={trader.netWorth || ''}
							class="mt-2 block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
						/>
					</div>

					<div>
						<label for="photoUrl" class="block text-sm font-medium text-midnight-300">Photo URL</label>
						<input
							type="url"
							id="photoUrl"
							name="photoUrl"
							value={trader.photoUrl || ''}
							class="mt-2 block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
						/>
					</div>
				</div>
			</section>

			<!-- Biography -->
			<section class="rounded-xl border border-midnight-800/50 bg-midnight-900/50 p-6">
				<h2 class="font-display text-xl font-semibold text-midnight-100">Biography</h2>
				<p class="mt-1 text-sm text-midnight-500">Supports Markdown formatting</p>
				
				<div class="mt-4">
					<textarea
						id="bio"
						name="bio"
						rows="12"
						class="block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-3 font-mono text-sm text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
					>{trader.bio || ''}</textarea>
				</div>
			</section>

			<!-- Philosophy -->
			<section class="rounded-xl border border-midnight-800/50 bg-midnight-900/50 p-6">
				<h2 class="font-display text-xl font-semibold text-midnight-100">Trading Philosophy</h2>
				
				<div class="mt-4">
					<textarea
						id="philosophy"
						name="philosophy"
						rows="4"
						class="block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-3 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
					>{trader.philosophy || ''}</textarea>
				</div>
			</section>

			<!-- Achievements -->
			<section class="rounded-xl border border-midnight-800/50 bg-midnight-900/50 p-6">
				<div class="flex items-center justify-between">
					<h2 class="font-display text-xl font-semibold text-midnight-100">Achievements</h2>
					<button
						type="button"
						onclick={addAchievement}
						class="flex items-center gap-1 text-sm text-gold-400 hover:text-gold-300"
					>
						<Plus class="h-4 w-4" />
						Add
					</button>
				</div>
				
				<div class="mt-4 space-y-3">
					{#each achievements as achievement, i}
						<div class="flex gap-2">
							<input
								type="text"
								name="achievements"
								bind:value={achievements[i]}
								class="block flex-1 rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
								placeholder="e.g., Won U.S. Investing Championship"
							/>
							{#if achievements.length > 1}
								<button
									type="button"
									onclick={() => removeAchievement(i)}
									class="rounded-lg p-2 text-midnight-400 hover:bg-red-500/10 hover:text-red-400"
								>
									<X class="h-5 w-5" />
								</button>
							{/if}
						</div>
					{/each}
				</div>
			</section>

			<!-- Quotes -->
			<section class="rounded-xl border border-midnight-800/50 bg-midnight-900/50 p-6">
				<div class="flex items-center justify-between">
					<h2 class="font-display text-xl font-semibold text-midnight-100">Notable Quotes</h2>
					<button
						type="button"
						onclick={addQuote}
						class="flex items-center gap-1 text-sm text-gold-400 hover:text-gold-300"
					>
						<Plus class="h-4 w-4" />
						Add Quote
					</button>
				</div>
				
				<div class="mt-4 space-y-4">
					{#each quotes as quote, i}
						<div class="rounded-lg border border-midnight-700 bg-midnight-800/30 p-4">
							<div class="flex items-start justify-between gap-4">
								<div class="flex-1 space-y-3">
									<input
										type="text"
										name="quoteText"
										bind:value={quotes[i].text}
										class="block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
										placeholder="Quote text..."
									/>
									<input
										type="text"
										name="quoteSource"
										bind:value={quotes[i].source}
										class="block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
										placeholder="Source (e.g., Interview, Book title)"
									/>
								</div>
								{#if quotes.length > 1}
									<button
										type="button"
										onclick={() => removeQuote(i)}
										class="rounded-lg p-2 text-midnight-400 hover:bg-red-500/10 hover:text-red-400"
									>
										<X class="h-5 w-5" />
									</button>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</section>

			<!-- Status & Submit -->
			<section class="rounded-xl border border-midnight-800/50 bg-midnight-900/50 p-6">
				<div class="flex items-center justify-between">
					<div>
						<label for="status" class="block text-sm font-medium text-midnight-300">Status</label>
						<select
							id="status"
							name="status"
							class="mt-2 rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
						>
							<option value="draft" selected={trader.status === 'draft'}>Draft</option>
							<option value="published" selected={trader.status === 'published'}>Published</option>
						</select>
					</div>

					<button
						type="submit"
						class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-6 py-3 font-semibold text-midnight-950 shadow-lg shadow-gold-500/25 transition-all hover:shadow-xl hover:shadow-gold-500/30"
					>
						<Save class="h-5 w-5" />
						Save Changes
					</button>
				</div>
			</section>
		</form>
	</main>
</div>
