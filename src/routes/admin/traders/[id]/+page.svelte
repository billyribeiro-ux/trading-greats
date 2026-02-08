<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { ArrowLeft, Save, Plus, X, TrendingUp, TrendingDown, Trash2, Edit2, ChevronUp, ChevronDown, Image as ImageIcon, Loader2 } from 'lucide-svelte';
	import MediaUpload from '$lib/components/MediaUpload.svelte';
	import type { PageData, ActionData } from './$types';
	import type { Media } from '$lib/server/schema';

	interface LocalQuote {
		text: string;
		source: string;
	}

	interface LocalTrade {
		date: string;
		asset: string;
		position: 'long' | 'short';
		outcome: string;
		profitLoss: string;
		description: string;
	}

	interface LocalBook {
		title: string;
		year: string;
		description: string;
	}

	interface LocalSocialLink {
		platform: string;
		url: string;
	}

	let { data, form }: { data: PageData; form: ActionData } = $props();
	const trader = $derived(data.trader);

	// ============================================================================
	// TRADER MEDIA GALLERY STATE
	// ============================================================================
	let galleryItems = $state<Media[]>([]);
	let showGalleryUpload = $state(false);
	let editingGalleryItem = $state<Media | null>(null);
	let editGalleryTitle = $state('');
	let editGalleryAltText = $state('');
	let galleryLoading = $state(false);
	let galleryDeleteConfirm = $state<string | null>(null);

	// Sync gallery items from server data
	$effect(() => {
		galleryItems = [...(data.traderMedia ?? [])];
	});

	function openGalleryEdit(item: Media) {
		editingGalleryItem = item;
		editGalleryTitle = item.title || '';
		editGalleryAltText = item.altText || '';
	}

	function closeGalleryEdit() {
		editingGalleryItem = null;
	}

	async function saveGalleryMetadata() {
		if (!editingGalleryItem) return;
		galleryLoading = true;
		try {
			const res = await fetch(`/api/media/${editingGalleryItem.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title: editGalleryTitle, altText: editGalleryAltText })
			});
			if (res.ok) {
				const { media } = await res.json();
				galleryItems = galleryItems.map(g => g.id === media.id ? media : g);
				closeGalleryEdit();
			}
		} catch (err) {
			console.error('Failed to update gallery item:', err);
		} finally {
			galleryLoading = false;
		}
	}

	async function deleteGalleryItem(id: string) {
		galleryLoading = true;
		try {
			const res = await fetch('/api/media', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id })
			});
			if (res.ok) {
				galleryItems = galleryItems.filter(g => g.id !== id);
				galleryDeleteConfirm = null;
			}
		} catch (err) {
			console.error('Failed to delete gallery item:', err);
		} finally {
			galleryLoading = false;
		}
	}

	async function moveGalleryItem(id: string, direction: 'up' | 'down') {
		const idx = galleryItems.findIndex(g => g.id === id);
		if (idx === -1) return;
		const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
		if (swapIdx < 0 || swapIdx >= galleryItems.length) return;

		// Swap locally
		const items = [...galleryItems];
		[items[idx], items[swapIdx]] = [items[swapIdx], items[idx]];
		galleryItems = items;

		// Persist new display orders
		await Promise.all([
			fetch(`/api/media/${items[idx].id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ displayOrder: idx })
			}),
			fetch(`/api/media/${items[swapIdx].id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ displayOrder: swapIdx })
			})
		]);
	}

	function handleGalleryUpload(media: Media) {
		galleryItems = [...galleryItems, media];
		showGalleryUpload = false;
	}

	// Initialize state from trader data
	let photoUrl = $state('');

	// Sync photoUrl from trader data
	$effect(() => {
		photoUrl = data.trader.photoUrl || '';
	});

	// svelte-ignore state_referenced_locally
	const initialQuotes: LocalQuote[] = data.trader.quotes?.map((q) => ({ text: q.text, source: q.source || '' })) || [{ text: '', source: '' }];
	// svelte-ignore state_referenced_locally
	const initialAchievements: string[] = data.trader.achievements || [''];
	// svelte-ignore state_referenced_locally
	const initialTrades: LocalTrade[] = data.trader.famousTrades?.map((t) => ({
		date: t.date,
		asset: t.asset,
		position: t.position,
		outcome: t.outcome,
		profitLoss: t.profitLoss,
		description: t.description
	})) || [];
	// svelte-ignore state_referenced_locally
	const initialBooks: LocalBook[] = data.trader.books?.map((b) => ({
		title: b.title,
		year: b.year?.toString() || '',
		description: b.description || ''
	})) || [];
	// svelte-ignore state_referenced_locally
	const initialSocialLinks: LocalSocialLink[] = data.trader.socialLinks?.map((s) => ({
		platform: s.platform,
		url: s.url
	})) || [];

	let quotes = $state<LocalQuote[]>(initialQuotes);
	let achievements = $state<string[]>(initialAchievements);
	let famousTrades = $state<LocalTrade[]>(initialTrades);
	let books = $state<LocalBook[]>(initialBooks);
	let socialLinks = $state<LocalSocialLink[]>(initialSocialLinks);

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
		famousTrades = famousTrades.filter((_: LocalTrade, i: number) => i !== index);
	}

	function addBook() {
		books = [...books, { title: '', year: '', description: '' }];
	}

	function removeBook(index: number) {
		books = books.filter((_: LocalBook, i: number) => i !== index);
	}

	function addSocialLink() {
		socialLinks = [...socialLinks, { platform: '', url: '' }];
	}

	function removeSocialLink(index: number) {
		socialLinks = socialLinks.filter((_: LocalSocialLink, i: number) => i !== index);
	}
</script>

<svelte:head>
	<title>Edit {trader.name} | Admin</title>
</svelte:head>

<div class="min-h-screen bg-midnight-950">
	<!-- Header -->
	<header class="border-b border-midnight-800/50 bg-midnight-900/50 sticky top-0 z-50">
		<div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
			<a href="/admin/traders" class="flex items-center gap-2 text-midnight-400 hover:text-midnight-200 min-h-[44px]">
				<ArrowLeft class="h-4 w-4" />
				Back to Traders
			</a>
			<a href="/traders/{trader.slug}" class="text-sm text-midnight-400 hover:text-midnight-200 min-h-[44px] flex items-center" target="_blank">
				View Profile →
			</a>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
		<h1 class="font-display text-2xl sm:text-3xl font-bold text-midnight-50">Edit {trader.name}</h1>
		<p class="mt-2 text-sm sm:text-base text-midnight-400">Update trader profile information</p>

		{#if form?.error}
			<div class="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400">
				{form.error}
			</div>
		{/if}

		<form method="POST" use:enhance class="mt-6 sm:mt-8 space-y-6 sm:space-y-8">
			<!-- Photo Upload -->
			<section class="rounded-xl border border-midnight-800/50 bg-midnight-900/50 p-4 sm:p-6">
				<h2 class="font-display text-lg sm:text-xl font-semibold text-midnight-100">Trader Photo</h2>
				<p class="mt-1 text-xs sm:text-sm text-midnight-500">Upload a high-quality photo with SEO metadata</p>

				<div class="mt-4">
					<MediaUpload
						value={photoUrl}
						name="photoUrl"
						folder="traders"
						traderId={trader.id}
						onSelect={(media: Media) => photoUrl = media.url}
						onRemove={() => photoUrl = ''}
					/>
				</div>
			</section>

			<!-- Trader Media Gallery -->
			<section class="rounded-xl border border-midnight-800/50 bg-midnight-900/50 p-4 sm:p-6">
				<div class="flex items-center justify-between">
					<div>
						<h2 class="font-display text-lg sm:text-xl font-semibold text-midnight-100">Media Gallery</h2>
						<p class="mt-1 text-xs sm:text-sm text-midnight-500">
							Manage multiple images for this trader with SEO metadata
							{#if galleryItems.length > 0}
								<span class="ml-1 text-midnight-400">({galleryItems.length} image{galleryItems.length !== 1 ? 's' : ''})</span>
							{/if}
						</p>
					</div>
					<button
						type="button"
						onclick={() => showGalleryUpload = !showGalleryUpload}
						class="flex items-center gap-1.5 text-sm text-gold-400 hover:text-gold-300 min-h-[44px] px-2"
					>
						<Plus class="h-4 w-4" />
						Add Image
					</button>
				</div>

				{#if showGalleryUpload}
					<div class="mt-4 rounded-lg border border-midnight-700 bg-midnight-800/30 p-4">
						<MediaUpload
							folder="traders"
							traderId={trader.id}
							showLibrary={false}
							onSelect={handleGalleryUpload}
						/>
						<button
							type="button"
							onclick={() => showGalleryUpload = false}
							class="mt-3 w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2 text-sm text-midnight-400 hover:bg-midnight-800 hover:text-midnight-200 transition-colors min-h-[44px]"
						>
							Cancel
						</button>
					</div>
				{/if}

				{#if galleryItems.length > 0}
					<div class="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
						{#each galleryItems as item, i (item.id)}
							<div class="group relative rounded-lg overflow-hidden border border-midnight-800/50 bg-midnight-800/30 hover:border-midnight-700 transition-all">
								<div class="aspect-square relative">
									<img
										src={item.thumbnailUrl || item.url}
										alt={item.altText || item.filename}
										class="w-full h-full object-cover"
										loading="lazy"
									/>

									{#if item.altText}
										<div class="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-green-500/80 text-white text-[10px] rounded-full font-medium">
											SEO
										</div>
									{:else}
										<div class="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-yellow-500/80 text-white text-[10px] rounded-full font-medium">
											No Alt
										</div>
									{/if}

									<div class="absolute inset-0 bg-midnight-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
										<button
											type="button"
											onclick={() => openGalleryEdit(item)}
											class="rounded-md bg-white/10 p-1.5 text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
											title="Edit title & alt text"
										>
											<Edit2 class="h-3.5 w-3.5" />
										</button>
										{#if i > 0}
											<button
												type="button"
												onclick={() => moveGalleryItem(item.id, 'up')}
												class="rounded-md bg-white/10 p-1.5 text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
												title="Move up"
											>
												<ChevronUp class="h-3.5 w-3.5" />
											</button>
										{/if}
										{#if i < galleryItems.length - 1}
											<button
												type="button"
												onclick={() => moveGalleryItem(item.id, 'down')}
												class="rounded-md bg-white/10 p-1.5 text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
												title="Move down"
											>
												<ChevronDown class="h-3.5 w-3.5" />
											</button>
										{/if}
										{#if galleryDeleteConfirm === item.id}
											<button
												type="button"
												onclick={() => deleteGalleryItem(item.id)}
												class="rounded-md bg-red-500 px-2 py-1.5 text-[10px] font-medium text-white hover:bg-red-600 transition-colors"
											>
												Confirm
											</button>
											<button
												type="button"
												onclick={() => galleryDeleteConfirm = null}
												class="rounded-md bg-midnight-700 px-2 py-1.5 text-[10px] font-medium text-midnight-300 hover:bg-midnight-600 transition-colors"
											>
												Cancel
											</button>
										{:else}
											<button
												type="button"
												onclick={() => galleryDeleteConfirm = item.id}
												class="rounded-md bg-red-500/20 p-1.5 text-red-400 backdrop-blur-sm hover:bg-red-500/30 transition-colors"
												title="Delete"
											>
												<Trash2 class="h-3.5 w-3.5" />
											</button>
										{/if}
									</div>
								</div>

								<div class="p-2">
									<p class="text-xs font-medium text-midnight-200 truncate" title={item.title || item.filename}>
										{item.title || item.filename}
									</p>
									{#if item.altText}
										<p class="text-[10px] text-midnight-500 truncate" title={item.altText}>
											Alt: {item.altText}
										</p>
									{/if}
								</div>
							</div>
						{/each}
					</div>

					<div class="mt-3 flex items-center gap-3 text-xs text-midnight-500">
						<span class="flex items-center gap-1">
							<span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
							{galleryItems.filter(g => g.altText).length} with alt text
						</span>
						<span class="flex items-center gap-1">
							<span class="h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
							{galleryItems.filter(g => !g.altText).length} missing alt text
						</span>
					</div>
				{:else if !showGalleryUpload}
					<div class="mt-4 rounded-lg border border-dashed border-midnight-700 bg-midnight-800/20 p-8 text-center">
						<ImageIcon class="h-10 w-10 text-midnight-600 mx-auto mb-3" />
						<p class="text-sm text-midnight-400 mb-1">No gallery images yet</p>
						<p class="text-xs text-midnight-500">Add images to create a photo gallery for this trader</p>
					</div>
				{/if}
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
							value={trader.name}
							class="mt-2 block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 min-h-[44px]"
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
							class="mt-2 block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 min-h-[44px]"
						/>
					</div>

					<div>
						<label for="nationality" class="block text-sm font-medium text-midnight-300">Nationality</label>
						<input
							type="text"
							id="nationality"
							name="nationality"
							value={trader.nationality || ''}
							class="mt-2 block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 min-h-[44px]"
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
							class="mt-2 block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 min-h-[44px]"
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
							value={trader.deathYear || ''}
							class="mt-2 block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 min-h-[44px]"
						/>
					</div>

					<div class="sm:col-span-2">
						<label for="netWorth" class="block text-sm font-medium text-midnight-300">Net Worth</label>
						<input
							type="text"
							id="netWorth"
							name="netWorth"
							value={trader.netWorth || ''}
							class="mt-2 block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 min-h-[44px]"
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
					>{trader.bio || ''}</textarea>
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
					>{trader.philosophy || ''}</textarea>
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
									<label for="tradeDate-{i}" class="block text-xs text-midnight-400 mb-1">Date/Period</label>
									<input
										type="text"
										id="tradeDate-{i}"
										name="tradeDate"
										bind:value={famousTrades[i].date}
										class="block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-3 py-2 text-sm text-midnight-100 outline-none focus:border-gold-500/50 min-h-[44px]"
										placeholder="e.g., 1992"
									/>
								</div>
								<div>
									<label for="tradeAsset-{i}" class="block text-xs text-midnight-400 mb-1">Asset</label>
									<input
										type="text"
										id="tradeAsset-{i}"
										name="tradeAsset"
										bind:value={famousTrades[i].asset}
										class="block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-3 py-2 text-sm text-midnight-100 outline-none focus:border-gold-500/50 min-h-[44px]"
										placeholder="e.g., British Pound"
									/>
								</div>
								<fieldset>
									<legend class="block text-xs text-midnight-400 mb-1">Position</legend>
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
								</fieldset>
								<div>
									<label for="tradeProfitLoss-{i}" class="block text-xs text-midnight-400 mb-1">Profit/Loss</label>
									<input
										type="text"
										id="tradeProfitLoss-{i}"
										name="tradeProfitLoss"
										bind:value={famousTrades[i].profitLoss}
										class="block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-3 py-2 text-sm text-midnight-100 outline-none focus:border-gold-500/50 min-h-[44px]"
										placeholder="e.g., +$1 Billion"
									/>
								</div>
								<div class="sm:col-span-2">
									<label for="tradeOutcome-{i}" class="block text-xs text-midnight-400 mb-1">Outcome</label>
									<input
										type="text"
										id="tradeOutcome-{i}"
										name="tradeOutcome"
										bind:value={famousTrades[i].outcome}
										class="block w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-3 py-2 text-sm text-midnight-100 outline-none focus:border-gold-500/50 min-h-[44px]"
										placeholder="e.g., Broke the Bank of England"
									/>
								</div>
								<div class="sm:col-span-2">
									<label for="tradeDescription-{i}" class="block text-xs text-midnight-400 mb-1">Description</label>
									<textarea
										id="tradeDescription-{i}"
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
							<option value="draft" selected={trader.status === 'draft'}>Draft</option>
							<option value="published" selected={trader.status === 'published'}>Published</option>
						</select>
					</div>

					<button
						type="submit"
						class="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-6 py-3 font-semibold text-midnight-950 shadow-lg shadow-gold-500/25 transition-all hover:shadow-xl hover:shadow-gold-500/30 active:scale-[0.98] min-h-[44px]"
					>
						<Save class="h-5 w-5" />
						Save Changes
					</button>
				</div>
			</section>
		</form>
	</main>
</div>

<!-- Gallery Edit Modal -->
{#if editingGalleryItem}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-sm">
		<div class="w-full max-w-lg rounded-2xl border border-midnight-700 bg-midnight-900 p-6 shadow-2xl">
			<div class="flex items-center justify-between mb-6">
				<h3 class="font-display text-xl font-bold text-white">Edit Image Metadata</h3>
				<button
					type="button"
					onclick={closeGalleryEdit}
					class="rounded-lg p-2 text-midnight-400 hover:bg-midnight-800 hover:text-white transition-colors"
				>
					<X class="h-5 w-5" />
				</button>
			</div>

			<div class="mb-6 rounded-lg overflow-hidden border border-midnight-700">
				<img
					src={editingGalleryItem.mediumUrl || editingGalleryItem.url}
					alt={editingGalleryItem.altText || 'Preview'}
					class="w-full h-32 object-cover"
				/>
			</div>

			<div class="space-y-4">
				<div>
					<label for="gallery-edit-title" class="block text-sm font-medium text-midnight-300 mb-1">
						Title <span class="text-midnight-500">(for SEO)</span>
					</label>
					<input
						id="gallery-edit-title"
						type="text"
						bind:value={editGalleryTitle}
						class="w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 min-h-[44px]"
						placeholder="e.g., Warren Buffett at Annual Meeting"
					/>
				</div>

				<div>
					<label for="gallery-edit-alt" class="block text-sm font-medium text-midnight-300 mb-1">
						Alt Text <span class="text-gold-400">*</span>
						<span class="text-midnight-500 font-normal">(required for accessibility)</span>
					</label>
					<input
						id="gallery-edit-alt"
						type="text"
						bind:value={editGalleryAltText}
						class="w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 min-h-[44px]"
						placeholder="e.g., Warren Buffett smiling at Berkshire Hathaway annual meeting"
					/>
					<p class="mt-1 text-xs text-midnight-500">Describe what's in the image for screen readers</p>
				</div>
			</div>

			<div class="mt-6 flex gap-3">
				<button
					type="button"
					onclick={closeGalleryEdit}
					class="flex-1 rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-sm font-medium text-midnight-300 hover:bg-midnight-800 transition-colors min-h-[44px]"
				>
					Cancel
				</button>
				<button
					type="button"
					onclick={saveGalleryMetadata}
					disabled={galleryLoading}
					class="flex-1 rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 px-4 py-2.5 text-sm font-semibold text-midnight-950 hover:shadow-lg hover:shadow-gold-500/25 transition-all min-h-[44px] disabled:opacity-50"
				>
					{#if galleryLoading}
						<Loader2 class="h-4 w-4 animate-spin mx-auto" />
					{:else}
						Save Changes
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}
