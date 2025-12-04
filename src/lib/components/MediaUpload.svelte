<script lang="ts">
	import { Upload, X, Loader2, Image as ImageIcon, Library, Edit2 } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import type { Media } from '$lib/server/schema';

	interface Props {
		value?: string;
		mediaId?: string;
		name?: string;
		onSelect?: (media: Media) => void;
		onRemove?: () => void;
		folder?: string;
		showLibrary?: boolean;
		class?: string;
	}

	let {
		value = '',
		mediaId = '',
		name = 'mediaId',
		onSelect,
		onRemove,
		folder = 'uploads',
		showLibrary = true,
		class: className
	}: Props = $props();

	let uploading = $state(false);
	let dragOver = $state(false);
	let error = $state<string | null>(null);
	let showSeoModal = $state(false);
	let showLibraryModal = $state(false);

	// Current media state
	let currentMedia = $state<Partial<Media> | null>(value ? { url: value, id: mediaId } : null);

	// SEO fields for new uploads
	let seoTitle = $state('');
	let seoAltText = $state('');
	let seoDescription = $state('');
	let seoCaption = $state('');

	// Pending file for upload
	let pendingFile = $state<File | null>(null);

	let fileInput: HTMLInputElement;

	// Sync value prop
	$effect(() => {
		if (value && (!currentMedia || currentMedia.url !== value)) {
			currentMedia = { url: value, id: mediaId };
		}
	});

	function handleFileSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			prepareUpload(file);
		}
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragOver = false;
		const file = e.dataTransfer?.files?.[0];
		if (file) {
			prepareUpload(file);
		}
	}

	function prepareUpload(file: File) {
		// Validate file type
		const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
		if (!allowedTypes.includes(file.type)) {
			error = 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.';
			return;
		}

		// Validate file size (max 10MB)
		const maxSize = 10 * 1024 * 1024;
		if (file.size > maxSize) {
			error = 'File too large. Maximum size is 10MB.';
			return;
		}

		// Store file and show SEO modal
		pendingFile = file;
		seoTitle = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
		seoAltText = '';
		seoDescription = '';
		seoCaption = '';
		showSeoModal = true;
		error = null;
	}

	async function uploadWithSeo() {
		if (!pendingFile) return;

		uploading = true;
		showSeoModal = false;
		error = null;

		try {
			const formData = new FormData();
			formData.append('file', pendingFile);
			formData.append('folder', folder);
			formData.append('title', seoTitle);
			formData.append('altText', seoAltText);
			formData.append('description', seoDescription);
			formData.append('caption', seoCaption);

			const response = await fetch('/api/media', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				const data = await response.json().catch(() => ({}));
				throw new Error(data.message || 'Upload failed');
			}

			const data = await response.json();
			currentMedia = data.media;
			onSelect?.(data.media);
		} catch (err) {
			console.error('Upload error:', err);
			error = err instanceof Error ? err.message : 'Failed to upload image';
		} finally {
			uploading = false;
			pendingFile = null;
		}
	}

	function cancelUpload() {
		showSeoModal = false;
		pendingFile = null;
		if (fileInput) fileInput.value = '';
	}

	function removeMedia() {
		currentMedia = null;
		onRemove?.();
		if (fileInput) fileInput.value = '';
	}

	function triggerFileInput() {
		fileInput?.click();
	}

	function selectFromLibrary(media: Media) {
		currentMedia = media;
		onSelect?.(media);
		showLibraryModal = false;
	}
</script>

<div class={cn('relative', className)}>
	<!-- Hidden file input -->
	<input
		type="file"
		accept="image/jpeg,image/png,image/webp,image/gif"
		bind:this={fileInput}
		onchange={handleFileSelect}
		class="sr-only"
	/>

	<!-- Hidden inputs for form submission -->
	<input type="hidden" name={name} value={currentMedia?.id || ''} />
	<input type="hidden" name="{name}Url" value={currentMedia?.url || ''} />

	{#if currentMedia?.url}
		<!-- Image Preview -->
		<div class="relative group rounded-xl overflow-hidden border border-midnight-700 bg-midnight-800/50">
			<img
				src={currentMedia.url}
				alt={currentMedia.altText || 'Upload preview'}
				class="w-full h-48 object-cover"
			/>

			<!-- SEO Badge -->
			{#if currentMedia.altText}
				<div class="absolute top-2 left-2 px-2 py-1 bg-green-500/80 text-white text-xs rounded-full">
					SEO ✓
				</div>
			{/if}

			<div class="absolute inset-0 bg-midnight-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
				<button
					type="button"
					onclick={triggerFileInput}
					disabled={uploading}
					class="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/20 transition-colors min-h-[44px]"
				>
					<Upload class="h-4 w-4" />
					Replace
				</button>
				{#if showLibrary}
					<button
						type="button"
						onclick={() => showLibraryModal = true}
						disabled={uploading}
						class="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/20 transition-colors min-h-[44px]"
					>
						<Library class="h-4 w-4" />
						Library
					</button>
				{/if}
				<button
					type="button"
					onclick={removeMedia}
					disabled={uploading}
					class="flex items-center gap-1.5 rounded-lg bg-red-500/20 px-3 py-2 text-sm font-medium text-red-400 backdrop-blur-sm hover:bg-red-500/30 transition-colors min-h-[44px]"
				>
					<X class="h-4 w-4" />
					Remove
				</button>
			</div>

			<!-- Media Info -->
			{#if currentMedia.title || currentMedia.altText}
				<div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-midnight-950/90 to-transparent p-3">
					{#if currentMedia.title}
						<p class="text-sm font-medium text-white truncate">{currentMedia.title}</p>
					{/if}
					{#if currentMedia.altText}
						<p class="text-xs text-midnight-300 truncate">Alt: {currentMedia.altText}</p>
					{/if}
				</div>
			{/if}
		</div>
	{:else}
		<!-- Upload Area -->
		<button
			type="button"
			onclick={triggerFileInput}
			ondrop={handleDrop}
			ondragover={(e) => { e.preventDefault(); dragOver = true; }}
			ondragleave={() => dragOver = false}
			disabled={uploading}
			class={cn(
				'w-full h-48 rounded-xl border-2 border-dashed transition-all',
				'flex flex-col items-center justify-center gap-3',
				dragOver
					? 'border-gold-500 bg-gold-500/10'
					: 'border-midnight-700 bg-midnight-800/30 hover:border-midnight-600 hover:bg-midnight-800/50',
				uploading && 'cursor-not-allowed opacity-50'
			)}
		>
			{#if uploading}
				<Loader2 class="h-8 w-8 text-gold-500 animate-spin" />
				<span class="text-sm text-midnight-400">Uploading & optimizing...</span>
			{:else}
				<div class="flex h-12 w-12 items-center justify-center rounded-full bg-midnight-700/50">
					<ImageIcon class="h-6 w-6 text-midnight-400" />
				</div>
				<div class="text-center">
					<span class="text-sm font-medium text-midnight-200">Click to upload</span>
					<span class="block text-xs text-midnight-500 mt-1">or drag and drop</span>
				</div>
				<span class="text-xs text-midnight-500">Auto-optimized to WebP • Max 10MB</span>
			{/if}
		</button>

		{#if showLibrary}
			<button
				type="button"
				onclick={() => showLibraryModal = true}
				class="mt-2 w-full flex items-center justify-center gap-2 rounded-lg border border-midnight-700 bg-midnight-800/30 px-4 py-2.5 text-sm text-midnight-300 hover:bg-midnight-800/50 hover:text-midnight-200 transition-colors min-h-[44px]"
			>
				<Library class="h-4 w-4" />
				Choose from Media Library
			</button>
		{/if}
	{/if}

	{#if error}
		<p class="mt-2 text-sm text-red-400">{error}</p>
	{/if}
</div>

<!-- SEO Metadata Modal -->
{#if showSeoModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-sm">
		<div class="w-full max-w-lg rounded-2xl border border-midnight-700 bg-midnight-900 p-6 shadow-2xl">
			<h3 class="font-display text-xl font-bold text-white mb-2">Add SEO Metadata</h3>
			<p class="text-sm text-midnight-400 mb-6">
				Improve your SEO by adding descriptive metadata to this image.
			</p>

			{#if pendingFile}
				<div class="mb-6 rounded-lg overflow-hidden border border-midnight-700">
					<img
						src={URL.createObjectURL(pendingFile)}
						alt="Preview"
						class="w-full h-32 object-cover"
					/>
				</div>
			{/if}

			<div class="space-y-4">
				<div>
					<label for="seo-title" class="block text-sm font-medium text-midnight-300 mb-1">
						Title <span class="text-midnight-500">(for SEO)</span>
					</label>
					<input
						id="seo-title"
						type="text"
						bind:value={seoTitle}
						class="w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 min-h-[44px]"
						placeholder="e.g., Warren Buffett Portrait"
					/>
				</div>

				<div>
					<label for="seo-alt" class="block text-sm font-medium text-midnight-300 mb-1">
						Alt Text <span class="text-gold-400">*</span>
						<span class="text-midnight-500 font-normal">(required for accessibility)</span>
					</label>
					<input
						id="seo-alt"
						type="text"
						bind:value={seoAltText}
						class="w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 min-h-[44px]"
						placeholder="e.g., Warren Buffett smiling at Berkshire Hathaway annual meeting"
					/>
					<p class="mt-1 text-xs text-midnight-500">Describe what's in the image for screen readers</p>
				</div>

				<div>
					<label for="seo-description" class="block text-sm font-medium text-midnight-300 mb-1">
						Description <span class="text-midnight-500">(optional)</span>
					</label>
					<textarea
						id="seo-description"
						bind:value={seoDescription}
						rows="2"
						class="w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
						placeholder="Detailed description for internal reference..."
					></textarea>
				</div>

				<div>
					<label for="seo-caption" class="block text-sm font-medium text-midnight-300 mb-1">
						Caption <span class="text-midnight-500">(displayed under image)</span>
					</label>
					<input
						id="seo-caption"
						type="text"
						bind:value={seoCaption}
						class="w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-midnight-100 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 min-h-[44px]"
						placeholder="e.g., Photo credit: Berkshire Hathaway"
					/>
				</div>
			</div>

			<div class="mt-6 flex gap-3">
				<button
					type="button"
					onclick={cancelUpload}
					class="flex-1 rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-sm font-medium text-midnight-300 hover:bg-midnight-800 transition-colors min-h-[44px]"
				>
					Cancel
				</button>
				<button
					type="button"
					onclick={uploadWithSeo}
					class="flex-1 rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 px-4 py-2.5 text-sm font-semibold text-midnight-950 hover:shadow-lg hover:shadow-gold-500/25 transition-all min-h-[44px]"
				>
					Upload Image
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Media Library Modal (simplified - full page in admin) -->
{#if showLibraryModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-sm">
		<div class="w-full max-w-4xl max-h-[80vh] rounded-2xl border border-midnight-700 bg-midnight-900 p-6 shadow-2xl overflow-hidden flex flex-col">
			<div class="flex items-center justify-between mb-6">
				<h3 class="font-display text-xl font-bold text-white">Media Library</h3>
				<button
					type="button"
					onclick={() => showLibraryModal = false}
					class="rounded-lg p-2 text-midnight-400 hover:bg-midnight-800 hover:text-white transition-colors"
				>
					<X class="h-5 w-5" />
				</button>
			</div>

			<div class="flex-1 overflow-auto">
				<p class="text-center text-midnight-400 py-12">
					Media library will load here.<br />
					<a href="/admin/media" class="text-gold-400 hover:text-gold-300">
						Open full Media Library →
					</a>
				</p>
			</div>

			<div class="mt-4 pt-4 border-t border-midnight-700 flex justify-end">
				<button
					type="button"
					onclick={() => showLibraryModal = false}
					class="rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-2.5 text-sm font-medium text-midnight-300 hover:bg-midnight-800 transition-colors min-h-[44px]"
				>
					Close
				</button>
			</div>
		</div>
	</div>
{/if}
