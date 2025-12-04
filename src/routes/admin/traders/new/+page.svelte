<script lang="ts">
	import { enhance } from '$app/forms';
	import { ArrowLeft, Save, Plus, X, TrendingUp, TrendingDown } from 'lucide-svelte';
	import ImageUpload from '$lib/components/ImageUpload.svelte';

	let { form } = $props();

	let photoUrl = $state('');
	let quotes = $state<{ text: string; source: string }[]>([{ text: '', source: '' }]);
	let achievements = $state<string[]>(['']);
	let famousTrades = $state<{
		date: string;
		asset: string;
		position: 'long' | 'short';
		outcome: string;
		profitLoss: string;
		description: string;
	}[]>([]);
	let books = $state<{ title: string; year: string; description: string }[]>([]);
	let socialLinks = $state<{ platform: string; url: string }[]>([]);

	function addQuote() {
		quotes = [...quotes, { text: '', source: '' }];
	}

	function removeQuote(index: number) {
		quotes = quotes.filter((_, i) => i !== index);
	}

	function addAchievement() {
		achievements = [...achievements, ''];
	}

	function removeAchievement(index: number) {
		achievements = achievements.filter((_, i) => i !== index);
	}

	function addFamousTrade() {
		famousTrades = [...famousTrades, {
			date: '',
			asset: '',
			position: 'long',
			outcome: '',
			profitLoss: '',
			description: ''
		}];
	}

	function removeFamousTrade(index: number) {
		famousTrades = famousTrades.filter((_, i) => i !== index);
	}

	function addBook() {
		books = [...books, { title: '', year: '', description: '' }];
	}

	function removeBook(index: number) {
		books = books.filter((_, i) => i !== index);
	}

	function addSocialLink() {
		socialLinks = [...socialLinks, { platform: '', url: '' }];
	}

	function removeSocialLink(index: number) {
		socialLinks = socialLinks.filter((_, i) => i !== index);
	}
</script>

<svelte:head>
	<title>Add New Trader | Admin</title>
</svelte:head>

<div class="min-h-screen bg-midnight-950">
	<!-- Header -->
	<header class="border-b border-midnight-800/50 bg-midnight-900/50 sticky top-0 z-50">
		<div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
			<a href="/admin/traders" class="flex items-center gap-2 text-midnight-400 hover:text-midnight-200 min-h-[44px]">
				<ArrowLeft class="h-4 w-4" />
				Back to Traders
			</a>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
		<h1 class="font-display text-2xl sm:text-3xl font-bold text-midnight-50">Add New Trader</h1>
		<p class="mt-2 text-sm sm:text-base text-midnight-400">Create a new trader profile with comprehensive details</p>

		{#if form?.error}
			<div class="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400">
				{form.error}
			</div>
		{/if}

		<form method="POST" use:enhance class="mt-6 sm:mt-8 space-y-6 sm:space-y-8">
			<!-- Photo Upload -->
			<section class="rounded-xl border border-midnight-800/50 bg-midnight-900/50 p-4 sm:p-6">
				<h2 class="font-display text-lg sm:text-xl font-semibold text-midnight-100">Trader Photo</h2>
				<p class="mt-1 text-xs sm:text-sm text-midnight-500">Upload a high-quality photo of the trader</p>

				<div class="mt-4">
					<ImageUpload
						value={photoUrl}
						name="photoUrl"
						folder="traders"
						onUpload={(url) => photoUrl = url}
						onRemove={() => photoUrl = ''}
					/>
				</div>
			</section>

			<!-- Basic Info -->
			<section class="rounded-xl border border-midnight-800/50 bg-midnight-900/50 p-4 sm:p-6">
				<h2 class="font-display text-lg sm:text-xl font-semibold text-midnight-100">Basic Information</h2>

				<div class="mt-4 sm:mt-6 grid gap-4 sm:gap-6 sm:grid-cols-2">
					<div class="sm:col-span-2">
						<label for="name" class="block text-sm font-medium text-midnight-300">Name *</label>
						<input
							type="text"
							id="name"
							name="name"
							required
							class="mt-2 block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 min-h-[44px]"
							placeholder="e.g., Warren Buffett"
						/>
					</div>

					<div class="sm:col-span-2">
						<label for="oneLiner" class="block text-sm font-medium text-midnight-300">One-Liner *</label>
						<input
							type="text"
							id="oneLiner"
							name="oneLiner"
							required
							class="mt-2 block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 min-h-[44px]"
							placeholder="e.g., The Oracle of Omaha"
						/>
					</div>

					<div>
						<label for="nationality" class="block text-sm font-medium text-midnight-300">Nationality</label>
						<input
							type="text"
							id="nationality"
							name="nationality"
							class="mt-2 block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 min-h-[44px]"
							placeholder="e.g., American"
						/>
					</div>

					<div>
						<label for="tradingStyle" class="block text-sm font-medium text-midnight-300">Trading Style</label>
						<select
							id="tradingStyle"
							name="tradingStyle"
							class="mt-2 block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 min-h-[44px]"
						>
							<option value="">Select style...</option>
							<option value="Value Investing">Value Investing</option>
							<option value="Momentum Growth">Momentum Growth</option>
							<option value="Macro & Currency">Macro & Currency</option>
							<option value="Options & Technical Analysis">Options & Technical Analysis</option>
							<option value="Options & Price Action">Options & Price Action</option>
							<option value="Day Trading">Day Trading</option>
							<option value="Swing Trading">Swing Trading</option>
							<option value="Quantitative">Quantitative</option>
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
							class="mt-2 block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 min-h-[44px]"
							placeholder="e.g., 1930"
						/>
					</div>

					<div>
						<label for="deathYear" class="block text-sm font-medium text-midnight-300">Death Year</label>
						<input
							type="number"
							id="deathYear"
							name="deathYear"
							min="1800"
							max="2030"
							class="mt-2 block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 min-h-[44px]"
							placeholder="Leave empty if alive"
						/>
					</div>

					<div class="sm:col-span-2">
						<label for="netWorth" class="block text-sm font-medium text-midnight-300">Net Worth</label>
						<input
							type="text"
							id="netWorth"
							name="netWorth"
							class="mt-2 block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 min-h-[44px]"
							placeholder="e.g., $100+ Billion"
						/>
					</div>
				</div>
			</section>

			<!-- Biography -->
			<section class="rounded-xl border border-midnight-800/50 bg-midnight-900/50 p-4 sm:p-6">
				<h2 class="font-display text-lg sm:text-xl font-semibold text-midnight-100">Biography</h2>
				<p class="mt-1 text-xs sm:text-sm text-midnight-500">Supports Markdown formatting</p>

				<div class="mt-4">
					<textarea
						id="bio"
						name="bio"
						rows="12"
						class="block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-3 font-mono text-sm text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
						placeholder="Write the trader's biography here...

## Early Life
...

## Trading Career
...

## Legacy
..."
					></textarea>
				</div>
			</section>

			<!-- Philosophy -->
			<section class="rounded-xl border border-midnight-800/50 bg-midnight-900/50 p-4 sm:p-6">
				<h2 class="font-display text-lg sm:text-xl font-semibold text-midnight-100">Trading Philosophy</h2>

				<div class="mt-4">
					<textarea
						id="philosophy"
						name="philosophy"
						rows="4"
						class="block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-3 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
						placeholder="Describe their core trading philosophy and beliefs..."
					></textarea>
				</div>
			</section>

			<!-- Achievements -->
			<section class="rounded-xl border border-midnight-800/50 bg-midnight-900/50 p-4 sm:p-6">
				<div class="flex items-center justify-between">
					<h2 class="font-display text-lg sm:text-xl font-semibold text-midnight-100">Achievements</h2>
					<button
						type="button"
						onclick={addAchievement}
						class="flex items-center gap-1 text-sm text-gold-400 hover:text-gold-300 min-h-[44px] px-2"
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
								class="block flex-1 rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 min-h-[44px]"
								placeholder="e.g., Won U.S. Investing Championship"
							/>
							{#if achievements.length > 1}
								<button
									type="button"
									onclick={() => removeAchievement(i)}
									class="rounded-lg p-2 text-midnight-400 hover:bg-red-500/10 hover:text-red-400 min-h-[44px] min-w-[44px] flex items-center justify-center"
								>
									<X class="h-5 w-5" />
								</button>
							{/if}
						</div>
					{/each}
				</div>
			</section>

			<!-- Famous Trades -->
			<section class="rounded-xl border border-midnight-800/50 bg-midnight-900/50 p-4 sm:p-6">
				<div class="flex items-center justify-between">
					<h2 class="font-display text-lg sm:text-xl font-semibold text-midnight-100">Famous Trades</h2>
					<button
						type="button"
						onclick={addFamousTrade}
						class="flex items-center gap-1 text-sm text-gold-400 hover:text-gold-300 min-h-[44px] px-2"
					>
						<Plus class="h-4 w-4" />
						Add Trade
					</button>
				</div>

				<div class="mt-4 space-y-4">
					{#each famousTrades as trade, i}
						<div class="rounded-lg border border-midnight-700 bg-midnight-800/30 p-4">
							<div class="flex items-start justify-between gap-4 mb-4">
								<h3 class="text-sm font-medium text-midnight-200">Trade #{i + 1}</h3>
								<button
									type="button"
									onclick={() => removeFamousTrade(i)}
									class="rounded-lg p-2 text-midnight-400 hover:bg-red-500/10 hover:text-red-400"
								>
									<X class="h-4 w-4" />
								</button>
							</div>
							<div class="grid gap-4 sm:grid-cols-2">
								<div>
									<label class="block text-xs text-midnight-400 mb-1">Date/Period</label>
									<input
										type="text"
										name="tradeDate"
										bind:value={famousTrades[i].date}
										class="block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-3 py-2 text-sm text-midnight-100 outline-none focus:border-gold-500/50 min-h-[44px]"
										placeholder="e.g., 1992"
									/>
								</div>
								<div>
									<label class="block text-xs text-midnight-400 mb-1">Asset</label>
									<input
										type="text"
										name="tradeAsset"
										bind:value={famousTrades[i].asset}
										class="block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-3 py-2 text-sm text-midnight-100 outline-none focus:border-gold-500/50 min-h-[44px]"
										placeholder="e.g., British Pound"
									/>
								</div>
								<div>
									<label class="block text-xs text-midnight-400 mb-1">Position</label>
									<div class="flex gap-2 mt-1">
										<button
											type="button"
											onclick={() => famousTrades[i].position = 'long'}
											class="flex-1 flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm transition-colors min-h-[44px] {famousTrades[i].position === 'long' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-midnight-800/50 text-midnight-400 border border-midnight-700'}"
										>
											<TrendingUp class="h-4 w-4" />
											Long
										</button>
										<button
											type="button"
											onclick={() => famousTrades[i].position = 'short'}
											class="flex-1 flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm transition-colors min-h-[44px] {famousTrades[i].position === 'short' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-midnight-800/50 text-midnight-400 border border-midnight-700'}"
										>
											<TrendingDown class="h-4 w-4" />
											Short
										</button>
									</div>
									<input type="hidden" name="tradePosition" value={famousTrades[i].position} />
								</div>
								<div>
									<label class="block text-xs text-midnight-400 mb-1">Profit/Loss</label>
									<input
										type="text"
										name="tradeProfitLoss"
										bind:value={famousTrades[i].profitLoss}
										class="block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-3 py-2 text-sm text-midnight-100 outline-none focus:border-gold-500/50 min-h-[44px]"
										placeholder="e.g., +$1 Billion"
									/>
								</div>
								<div class="sm:col-span-2">
									<label class="block text-xs text-midnight-400 mb-1">Outcome</label>
									<input
										type="text"
										name="tradeOutcome"
										bind:value={famousTrades[i].outcome}
										class="block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-3 py-2 text-sm text-midnight-100 outline-none focus:border-gold-500/50 min-h-[44px]"
										placeholder="e.g., Broke the Bank of England"
									/>
								</div>
								<div class="sm:col-span-2">
									<label class="block text-xs text-midnight-400 mb-1">Description</label>
									<textarea
										name="tradeDescription"
										bind:value={famousTrades[i].description}
										rows="2"
										class="block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-3 py-2 text-sm text-midnight-100 outline-none focus:border-gold-500/50"
										placeholder="Describe the trade..."
									></textarea>
								</div>
							</div>
						</div>
					{/each}
					{#if famousTrades.length === 0}
						<p class="text-sm text-midnight-500 text-center py-4">No famous trades added yet</p>
					{/if}
				</div>
			</section>

			<!-- Quotes -->
			<section class="rounded-xl border border-midnight-800/50 bg-midnight-900/50 p-4 sm:p-6">
				<div class="flex items-center justify-between">
					<h2 class="font-display text-lg sm:text-xl font-semibold text-midnight-100">Notable Quotes</h2>
					<button
						type="button"
						onclick={addQuote}
						class="flex items-center gap-1 text-sm text-gold-400 hover:text-gold-300 min-h-[44px] px-2"
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
										class="block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 min-h-[44px]"
										placeholder="Quote text..."
									/>
									<input
										type="text"
										name="quoteSource"
										bind:value={quotes[i].source}
										class="block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 min-h-[44px]"
										placeholder="Source (e.g., Interview, Book title)"
									/>
								</div>
								{#if quotes.length > 1}
									<button
										type="button"
										onclick={() => removeQuote(i)}
										class="rounded-lg p-2 text-midnight-400 hover:bg-red-500/10 hover:text-red-400 min-h-[44px] min-w-[44px] flex items-center justify-center"
									>
										<X class="h-5 w-5" />
									</button>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</section>

			<!-- Books -->
			<section class="rounded-xl border border-midnight-800/50 bg-midnight-900/50 p-4 sm:p-6">
				<div class="flex items-center justify-between">
					<h2 class="font-display text-lg sm:text-xl font-semibold text-midnight-100">Books</h2>
					<button
						type="button"
						onclick={addBook}
						class="flex items-center gap-1 text-sm text-gold-400 hover:text-gold-300 min-h-[44px] px-2"
					>
						<Plus class="h-4 w-4" />
						Add Book
					</button>
				</div>

				<div class="mt-4 space-y-4">
					{#each books as book, i}
						<div class="rounded-lg border border-midnight-700 bg-midnight-800/30 p-4">
							<div class="flex items-start justify-between gap-4">
								<div class="flex-1 space-y-3">
									<div class="grid gap-3 sm:grid-cols-4">
										<input
											type="text"
											name="bookTitle"
											bind:value={books[i].title}
											class="sm:col-span-3 block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 min-h-[44px]"
											placeholder="Book title"
										/>
										<input
											type="text"
											name="bookYear"
											bind:value={books[i].year}
											class="block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 min-h-[44px]"
											placeholder="Year"
										/>
									</div>
									<textarea
										name="bookDescription"
										bind:value={books[i].description}
										rows="2"
										class="block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50"
										placeholder="Brief description..."
									></textarea>
								</div>
								<button
									type="button"
									onclick={() => removeBook(i)}
									class="rounded-lg p-2 text-midnight-400 hover:bg-red-500/10 hover:text-red-400 min-h-[44px] min-w-[44px] flex items-center justify-center"
								>
									<X class="h-5 w-5" />
								</button>
							</div>
						</div>
					{/each}
					{#if books.length === 0}
						<p class="text-sm text-midnight-500 text-center py-4">No books added yet</p>
					{/if}
				</div>
			</section>

			<!-- Social Links -->
			<section class="rounded-xl border border-midnight-800/50 bg-midnight-900/50 p-4 sm:p-6">
				<div class="flex items-center justify-between">
					<h2 class="font-display text-lg sm:text-xl font-semibold text-midnight-100">Social Links</h2>
					<button
						type="button"
						onclick={addSocialLink}
						class="flex items-center gap-1 text-sm text-gold-400 hover:text-gold-300 min-h-[44px] px-2"
					>
						<Plus class="h-4 w-4" />
						Add Link
					</button>
				</div>

				<div class="mt-4 space-y-3">
					{#each socialLinks as link, i}
						<div class="flex gap-2">
							<select
								name="socialPlatform"
								bind:value={socialLinks[i].platform}
								class="rounded-lg border border-midnight-700 bg-midnight-800/50 px-3 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 min-h-[44px]"
							>
								<option value="">Platform...</option>
								<option value="twitter">Twitter</option>
								<option value="linkedin">LinkedIn</option>
								<option value="wikipedia">Wikipedia</option>
								<option value="website">Website</option>
								<option value="youtube">YouTube</option>
							</select>
							<input
								type="url"
								name="socialUrl"
								bind:value={socialLinks[i].url}
								class="flex-1 rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 min-h-[44px]"
								placeholder="https://..."
							/>
							<button
								type="button"
								onclick={() => removeSocialLink(i)}
								class="rounded-lg p-2 text-midnight-400 hover:bg-red-500/10 hover:text-red-400 min-h-[44px] min-w-[44px] flex items-center justify-center"
							>
								<X class="h-5 w-5" />
							</button>
						</div>
					{/each}
					{#if socialLinks.length === 0}
						<p class="text-sm text-midnight-500 text-center py-4">No social links added yet</p>
					{/if}
				</div>
			</section>

			<!-- Status & Submit -->
			<section class="rounded-xl border border-midnight-800/50 bg-midnight-900/50 p-4 sm:p-6">
				<div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
					<div>
						<label for="status" class="block text-sm font-medium text-midnight-300">Status</label>
						<select
							id="status"
							name="status"
							class="mt-2 rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 min-h-[44px]"
						>
							<option value="draft">Draft</option>
							<option value="published">Published</option>
						</select>
					</div>

					<button
						type="submit"
						class="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-6 py-3 font-semibold text-midnight-950 shadow-lg shadow-gold-500/25 transition-all hover:shadow-xl hover:shadow-gold-500/30 active:scale-[0.98] min-h-[44px]"
					>
						<Save class="h-5 w-5" />
						Save Trader
					</button>
				</div>
			</section>
		</form>
	</main>
</div>
