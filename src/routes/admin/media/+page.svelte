<script lang="ts">
	import {
		Search,
		Trash2,
		Edit2,
		X,
		Upload,
		Image as ImageIcon,
		Copy,
		Check,
		ChevronLeft,
		ChevronRight,
		Filter,
		FolderOpen,
		Info
	} from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import MediaUpload from '$lib/components/MediaUpload.svelte';
	import type { Media } from '$lib/server/schema';

	let { data } = $props();

	let searchQuery = $state('');
	let selectedFolder = $state('');

	// Sync filters from URL/data
	$effect(() => {
		searchQuery = data.filters.search || '';
		selectedFolder = data.filters.folder || '';
	});
	let showUploadModal = $state(false);
	let editingMedia = $state<Media | null>(null);
	let deleteConfirm = $state<string | null>(null);
	let copiedUrl = $state<string | null>(null);

	// Edit form state
	let editTitle = $state('');
	let editAltText = $state('');
	let editDescription = $state('');
	let editCaption = $state('');

	function handleSearch() {
		const params = new URLSearchParams();
		if (searchQuery) params.set('search', searchQuery);
		if (selectedFolder) params.set('folder', selectedFolder);
		goto(`/admin/media?${params.toString()}`);
	}

	function handleFolderChange() {
		const params = new URLSearchParams();
		if (searchQuery) params.set('search', searchQuery);
		if (selectedFolder) params.set('folder', selectedFolder);
		goto(`/admin/media?${params.toString()}`);
	}

	function openEditModal(item: Media) {
		editingMedia = item;
		editTitle = item.title || '';
		editAltText = item.altText || '';
		editDescription = item.description || '';
		editCaption = item.caption || '';
	}

	function closeEditModal() {
		editingMedia = null;
	}

	async function copyUrl(url: string) {
		await navigator.clipboard.writeText(url);
		copiedUrl = url;
		setTimeout(() => (copiedUrl = null), 2000);
	}

	function formatFileSize(bytes: number): string {
		if (bytes < 1024) return bytes + ' B';
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
		return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
	}

	function formatDate(dateString: string | null): string {
		if (!dateString) return '—';
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function handleMediaUploaded(media: Media) {
		showUploadModal = false;
		// Refresh the page to show new media
		goto('/admin/media', { invalidateAll: true });
	}
</script>

<svelte:head>
	<title>Media Library | Admin</title>
</svelte:head>

<div class="min-h-screen bg-midnight-950">
	<!-- Header -->
	<header class="border-b border-midnight-800/50 bg-midnight-900/50 backdrop-blur-xl sticky top-0 z-50">
		<div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
			<div class="flex items-center gap-4">
				<a href="/admin" class="text-midnight-400 hover:text-midnight-200 transition-colors">
					← Dashboard
				</a>
			</div>
			<a
				href="/"
				target="_blank"
				class="text-sm text-midnight-400 hover:text-midnight-200 transition-colors"
			>
				View Site →
			</a>
		</div>
	</header>

	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Page Header -->
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
			<div>
				<h1 class="font-display text-3xl font-bold text-midnight-50">Media Library</h1>
				<p class="mt-2 text-midnight-400">Manage your images with SEO metadata</p>
			</div>
			<button
				type="button"
				onclick={() => (showUploadModal = true)}
				class="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-5 py-2.5 font-semibold text-midnight-950 shadow-lg shadow-gold-500/25 transition-all hover:shadow-xl hover:shadow-gold-500/30 hover:scale-[1.02] active:scale-[0.98] min-h-[44px]"
			>
				<Upload class="h-5 w-5" />
				Upload Media
			</button>
		</div>

		<!-- Filters -->
		<div class="flex flex-col sm:flex-row gap-4 mb-6">
			<!-- Search -->
			<form onsubmit={(e) => { e.preventDefault(); handleSearch(); }} class="relative flex-1">
				<Search class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-midnight-500" />
				<input
					type="text"
					placeholder="Search by title, alt text, filename..."
					bind:value={searchQuery}
					class="w-full rounded-xl border border-midnight-700 bg-midnight-800/50 py-3 pl-12 pr-4 text-midnight-100 placeholder-midnight-500 outline-none transition-all focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 min-h-[44px]"
				/>
			</form>

			<!-- Folder Filter -->
			<select
				bind:value={selectedFolder}
				onchange={handleFolderChange}
				class="rounded-xl border border-midnight-700 bg-midnight-800/50 px-4 py-3 text-midnight-100 outline-none transition-all focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 min-h-[44px]"
			>
				<option value="">All Folders</option>
				{#each data.folders as folder}
					<option value={folder}>{folder}</option>
				{/each}
			</select>
		</div>

		<!-- Media Grid -->
		{#if data.media.length === 0}
			<div class="rounded-2xl border border-midnight-800/50 bg-midnight-900/30 p-12 text-center">
				<ImageIcon class="h-16 w-16 text-midnight-600 mx-auto mb-4" />
				<h3 class="text-xl font-semibold text-midnight-100 mb-2">No media files yet</h3>
				<p class="text-midnight-400 mb-6">Upload your first image to get started</p>
				<button
					type="button"
					onclick={() => (showUploadModal = true)}
					class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-6 py-3 font-semibold text-midnight-950 shadow-lg shadow-gold-500/25 min-h-[44px]"
				>
					<Upload class="h-5 w-5" />
					Upload Your First Image
				</button>
			</div>
		{:else}
			<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
				{#each data.media as item (item.id)}
					<div class="group relative rounded-xl overflow-hidden border border-midnight-800/50 bg-midnight-900/30 hover:border-midnight-700 transition-all">
						<!-- Image -->
						<div class="aspect-square relative">
							<img
								src={item.thumbnailUrl || item.url}
								alt={item.altText || item.filename}
								class="w-full h-full object-cover"
								loading="lazy"
							/>

							<!-- SEO Badge -->
							{#if item.altText}
								<div class="absolute top-2 left-2 px-1.5 py-0.5 bg-green-500/80 text-white text-[10px] rounded-full font-medium">
									SEO
								</div>
							{:else}
								<div class="absolute top-2 left-2 px-1.5 py-0.5 bg-yellow-500/80 text-white text-[10px] rounded-full font-medium">
									No Alt
								</div>
							{/if}

							<!-- Hover Actions -->
							<div class="absolute inset-0 bg-midnight-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
								<button
									type="button"
									onclick={() => openEditModal(item)}
									class="rounded-lg bg-white/10 p-2 text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
									title="Edit SEO"
								>
									<Edit2 class="h-4 w-4" />
								</button>
								<button
									type="button"
									onclick={() => copyUrl(item.url)}
									class="rounded-lg bg-white/10 p-2 text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
									title="Copy URL"
								>
									{#if copiedUrl === item.url}
										<Check class="h-4 w-4 text-green-400" />
									{:else}
										<Copy class="h-4 w-4" />
									{/if}
								</button>
								{#if deleteConfirm === item.id}
									<form method="POST" action="?/delete" use:enhance={() => {
										return async ({ result }) => {
											if (result.type === 'success') {
												deleteConfirm = null;
												goto('/admin/media', { invalidateAll: true });
											}
										};
									}}>
										<input type="hidden" name="id" value={item.id} />
										<button
											type="submit"
											class="rounded-lg bg-red-500 px-2 py-2 text-xs font-medium text-white hover:bg-red-600 transition-colors"
										>
											Delete
										</button>
									</form>
									<button
										type="button"
										onclick={() => (deleteConfirm = null)}
										class="rounded-lg bg-midnight-700 px-2 py-2 text-xs font-medium text-midnight-300 hover:bg-midnight-600 transition-colors"
									>
										Cancel
									</button>
								{:else}
									<button
										type="button"
										onclick={() => (deleteConfirm = item.id)}
										class="rounded-lg bg-red-500/20 p-2 text-red-400 backdrop-blur-sm hover:bg-red-500/30 transition-colors"
										title="Delete"
									>
										<Trash2 class="h-4 w-4" />
									</button>
								{/if}
							</div>
						</div>

						<!-- Info -->
						<div class="p-2">
							<p class="text-xs font-medium text-midnight-200 truncate" title={item.title || item.filename}>
								{item.title || item.filename}
							</p>
							<p class="text-[10px] text-midnight-500">
								{formatFileSize(item.fileSize)}
								{#if item.width && item.height}
									• {item.width}×{item.height}
								{/if}
							</p>
						</div>
					</div>
				{/each}
			</div>

			<!-- Pagination -->
			{#if data.pagination.totalPages > 1}
				<div class="mt-8 flex items-center justify-center gap-2">
					<a
						href="/admin/media?page={Math.max(1, data.pagination.page - 1)}{searchQuery ? `&search=${searchQuery}` : ''}{selectedFolder ? `&folder=${selectedFolder}` : ''}"
						class="rounded-lg border border-midnight-700 bg-midnight-800/50 p-2 text-midnight-400 hover:bg-midnight-800 hover:text-midnight-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px] flex items-center justify-center"
						class:pointer-events-none={data.pagination.page === 1}
					>
						<ChevronLeft class="h-5 w-5" />
					</a>

					<span class="px-4 py-2 text-sm text-midnight-400">
						Page {data.pagination.page} of {data.pagination.totalPages}
					</span>

					<a
						href="/admin/media?page={Math.min(data.pagination.totalPages, data.pagination.page + 1)}{searchQuery ? `&search=${searchQuery}` : ''}{selectedFolder ? `&folder=${selectedFolder}` : ''}"
						class="rounded-lg border border-midnight-700 bg-midnight-800/50 p-2 text-midnight-400 hover:bg-midnight-800 hover:text-midnight-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px] flex items-center justify-center"
						class:pointer-events-none={data.pagination.page === data.pagination.totalPages}
					>
						<ChevronRight class="h-5 w-5" />
					</a>
				</div>
			{/if}

			<!-- Stats Footer -->
			<div class="mt-4 flex items-center justify-between text-sm text-midnight-500">
				<p>
					Showing {data.media.length} of {data.pagination.total} media files
				</p>
				<div class="flex items-center gap-4">
					<span class="flex items-center gap-1.5">
						<span class="h-2 w-2 rounded-full bg-green-500"></span>
						{data.media.filter((m) => m.altText).length} with SEO
					</span>
					<span class="flex items-center gap-1.5">
						<span class="h-2 w-2 rounded-full bg-yellow-500"></span>
						{data.media.filter((m) => !m.altText).length} missing alt text
					</span>
				</div>
			</div>
		{/if}
	</main>
</div>

<!-- Upload Modal -->
{#if showUploadModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-sm">
		<div class="w-full max-w-lg rounded-2xl border border-midnight-700 bg-midnight-900 p-6 shadow-2xl">
			<div class="flex items-center justify-between mb-6">
				<h3 class="font-display text-xl font-bold text-white">Upload Media</h3>
				<button
					type="button"
					onclick={() => (showUploadModal = false)}
					class="rounded-lg p-2 text-midnight-400 hover:bg-midnight-800 hover:text-white transition-colors"
				>
					<X class="h-5 w-5" />
				</button>
			</div>

			<MediaUpload
				folder="uploads"
				showLibrary={false}
				onSelect={handleMediaUploaded}
			/>

			<div class="mt-4 pt-4 border-t border-midnight-700 flex justify-end">
				<button
					type="button"
					onclick={() => (showUploadModal = false)}
					class="rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-sm font-medium text-midnight-300 hover:bg-midnight-800 transition-colors min-h-[44px]"
				>
					Close
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Edit SEO Modal -->
{#if editingMedia}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-sm">
		<div class="w-full max-w-lg rounded-2xl border border-midnight-700 bg-midnight-900 p-6 shadow-2xl">
			<div class="flex items-center justify-between mb-6">
				<h3 class="font-display text-xl font-bold text-white">Edit SEO Metadata</h3>
				<button
					type="button"
					onclick={closeEditModal}
					class="rounded-lg p-2 text-midnight-400 hover:bg-midnight-800 hover:text-white transition-colors"
				>
					<X class="h-5 w-5" />
				</button>
			</div>

			<!-- Preview -->
			<div class="mb-6 rounded-lg overflow-hidden border border-midnight-700">
				<img
					src={editingMedia.mediumUrl || editingMedia.url}
					alt={editingMedia.altText || 'Preview'}
					class="w-full h-32 object-cover"
				/>
			</div>

			<form
				method="POST"
				action="?/updateMetadata"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'success') {
							closeEditModal();
							goto('/admin/media', { invalidateAll: true });
						}
					};
				}}
				class="space-y-4"
			>
				<input type="hidden" name="id" value={editingMedia.id} />

				<div>
					<label for="edit-title" class="block text-sm font-medium text-midnight-300 mb-1">
						Title <span class="text-midnight-500">(for SEO)</span>
					</label>
					<input
						id="edit-title"
						type="text"
						name="title"
						bind:value={editTitle}
						class="w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 min-h-[44px]"
						placeholder="e.g., Warren Buffett Portrait"
					/>
				</div>

				<div>
					<label for="edit-alt" class="block text-sm font-medium text-midnight-300 mb-1">
						Alt Text <span class="text-gold-400">*</span>
						<span class="text-midnight-500 font-normal">(required for accessibility)</span>
					</label>
					<input
						id="edit-alt"
						type="text"
						name="altText"
						bind:value={editAltText}
						class="w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 min-h-[44px]"
						placeholder="e.g., Warren Buffett smiling at Berkshire Hathaway annual meeting"
					/>
					<p class="mt-1 text-xs text-midnight-500">Describe what's in the image for screen readers</p>
				</div>

				<div>
					<label for="edit-description" class="block text-sm font-medium text-midnight-300 mb-1">
						Description <span class="text-midnight-500">(optional)</span>
					</label>
					<textarea
						id="edit-description"
						name="description"
						bind:value={editDescription}
						rows="2"
						class="w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
						placeholder="Detailed description for internal reference..."
					></textarea>
				</div>

				<div>
					<label for="edit-caption" class="block text-sm font-medium text-midnight-300 mb-1">
						Caption <span class="text-midnight-500">(displayed under image)</span>
					</label>
					<input
						id="edit-caption"
						type="text"
						name="caption"
						bind:value={editCaption}
						class="w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 min-h-[44px]"
						placeholder="e.g., Photo credit: Berkshire Hathaway"
					/>
				</div>

				<!-- File Info -->
				<div class="p-3 rounded-lg bg-midnight-800/30 border border-midnight-700/50">
					<div class="flex items-center gap-2 text-xs text-midnight-400">
						<Info class="h-4 w-4" />
						<span>
							{editingMedia.filename} • {formatFileSize(editingMedia.fileSize)}
							{#if editingMedia.width && editingMedia.height}
								• {editingMedia.width}×{editingMedia.height}
							{/if}
						</span>
					</div>
				</div>

				<div class="flex gap-3 pt-2">
					<button
						type="button"
						onclick={closeEditModal}
						class="flex-1 rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-sm font-medium text-midnight-300 hover:bg-midnight-800 transition-colors min-h-[44px]"
					>
						Cancel
					</button>
					<button
						type="submit"
						class="flex-1 rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 px-4 py-2.5 text-sm font-semibold text-midnight-950 hover:shadow-lg hover:shadow-gold-500/25 transition-all min-h-[44px]"
					>
						Save Changes
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
