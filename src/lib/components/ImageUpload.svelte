<script lang="ts">
	import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-svelte';
	import { cn } from '$lib/utils';

	interface Props {
		value?: string;
		name?: string;
		onUpload?: (url: string) => void;
		onRemove?: () => void;
		folder?: string;
		class?: string;
	}

	let { value = '', name = 'photoUrl', onUpload, onRemove, folder = 'traders', class: className }: Props = $props();

	let uploading = $state(false);
	let dragOver = $state(false);
	let error = $state<string | null>(null);
	let currentUrl = $state('');
	let fileInput: HTMLInputElement;

	// Sync value prop to currentUrl (runs on mount and when value changes)
	$effect(() => {
		currentUrl = value;
	});

	async function handleFile(file: File) {
		if (!file) return;

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

		uploading = true;
		error = null;

		try {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('folder', folder);

			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				const data = await response.json().catch(() => ({}));
				throw new Error(data.message || 'Upload failed');
			}

			const data = await response.json();
			currentUrl = data.url;
			onUpload?.(data.url);
		} catch (err) {
			console.error('Upload error:', err);
			error = err instanceof Error ? err.message : 'Failed to upload image';
		} finally {
			uploading = false;
		}
	}

	function handleFileSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) handleFile(file);
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragOver = false;
		const file = e.dataTransfer?.files?.[0];
		if (file) handleFile(file);
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		dragOver = true;
	}

	function handleDragLeave() {
		dragOver = false;
	}

	function removeImage() {
		currentUrl = '';
		onRemove?.();
		if (fileInput) fileInput.value = '';
	}

	function triggerFileInput() {
		fileInput?.click();
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

	<!-- Hidden input for form submission -->
	<input type="hidden" {name} value={currentUrl} />

	{#if currentUrl}
		<!-- Image Preview -->
		<div class="relative group rounded-xl overflow-hidden border border-midnight-700 bg-midnight-800/50">
			<img
				src={currentUrl}
				alt="Upload preview"
				class="w-full h-48 object-cover"
			/>
			<div class="absolute inset-0 bg-midnight-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
				<button
					type="button"
					onclick={triggerFileInput}
					disabled={uploading}
					class="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
				>
					<Upload class="h-4 w-4" />
					Replace
				</button>
				<button
					type="button"
					onclick={removeImage}
					disabled={uploading}
					class="flex items-center gap-2 rounded-lg bg-red-500/20 px-4 py-2 text-sm font-medium text-red-400 backdrop-blur-sm hover:bg-red-500/30 transition-colors"
				>
					<X class="h-4 w-4" />
					Remove
				</button>
			</div>
		</div>
	{:else}
		<!-- Upload Area -->
		<button
			type="button"
			onclick={triggerFileInput}
			ondrop={handleDrop}
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
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
				<span class="text-sm text-midnight-400">Uploading...</span>
			{:else}
				<div class="flex h-12 w-12 items-center justify-center rounded-full bg-midnight-700/50">
					<ImageIcon class="h-6 w-6 text-midnight-400" />
				</div>
				<div class="text-center">
					<span class="text-sm font-medium text-midnight-200">Click to upload</span>
					<span class="block text-xs text-midnight-500 mt-1">or drag and drop</span>
				</div>
				<span class="text-xs text-midnight-500">PNG, JPG, WebP, GIF up to 10MB</span>
			{/if}
		</button>
	{/if}

	{#if error}
		<p class="mt-2 text-sm text-red-400">{error}</p>
	{/if}
</div>
