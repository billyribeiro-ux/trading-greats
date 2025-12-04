<script lang="ts">
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { ArrowLeft, Send, Eye, Type, FileText, Sparkles } from 'lucide-svelte';

	let { form }: { form: ActionData } = $props();

	// Derived form data for error recovery
	const formData = $derived(form?.data);

	let isSubmitting = $state(false);
	let subject = $state('');
	let previewText = $state('');
	let content = $state('');
	let campaignType = $state('manual');
	let showPreview = $state(false);
	let initialized = $state(false);

	// Initialize content and sync form error values
	$effect(() => {
		if (!initialized) {
			content = getDefaultTemplate();
			initialized = true;
		}
		if (formData) {
			if (formData.subject) subject = formData.subject;
			if (formData.previewText) previewText = formData.previewText;
			if (formData.content) content = formData.content;
			if (formData.type) campaignType = formData.type;
		}
	});

	const campaignTypes = [
		{ value: 'manual', label: 'Manual Campaign', description: 'One-time email campaign' },
		{ value: 'weekly_digest', label: 'Weekly Digest', description: 'Weekly newsletter summary' },
		{ value: 'new_trader', label: 'New Trader Alert', description: 'Notify about new trader profiles' },
		{ value: 'blog_post', label: 'Blog Post Alert', description: 'Notify about new blog posts' }
	];

	function getDefaultTemplate(): string {
		return `<h2 style="color: #ffffff; margin: 0 0 20px;">Your Newsletter Title</h2>

<p style="color: #9ca3af; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
  Welcome to this week's edition of Trading Greats! Here's what we have for you...
</p>

<h3 style="color: #d4af37; margin: 20px 0 10px;">Featured Content</h3>

<p style="color: #9ca3af; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
  Write your main content here. You can include trading insights, new strategies, or highlight legendary traders.
</p>

<a href="https://tradinggreats.com/traders" style="display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #d4af37, #b8962e); color: #0a0a0f; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 8px; margin: 20px 0;">
  Explore More
</a>

<p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
  Happy trading!<br>
  The Trading Greats Team
</p>`;
	}
</script>

<svelte:head>
	<title>New Campaign - Newsletter Admin | Trading Greats</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center gap-4">
		<a
			href="/admin/newsletter/campaigns"
			class="flex h-10 w-10 items-center justify-center rounded-lg border border-midnight-700 bg-midnight-800/50 text-midnight-400 transition-colors hover:bg-midnight-700 hover:text-white"
		>
			<ArrowLeft class="h-5 w-5" />
		</a>
		<div>
			<h1 class="text-2xl font-bold text-white">New Campaign</h1>
			<p class="text-sm text-midnight-400">Create a new email campaign</p>
		</div>
	</div>

	{#if form?.message && !form?.success}
		<div class="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
			{form.message}
		</div>
	{/if}

	<div class="grid gap-6 lg:grid-cols-2">
		<!-- Form -->
		<div class="space-y-6">
			<form
				method="POST"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						await update();
						isSubmitting = false;
					};
				}}
				class="space-y-6"
			>
				<!-- Campaign Type -->
				<fieldset class="rounded-xl border border-midnight-800 bg-midnight-900/50 p-6">
					<legend class="block text-sm font-medium text-white mb-4">Campaign Type</legend>
					<div class="grid gap-3 sm:grid-cols-2">
						{#each campaignTypes as type}
							<label class="relative flex cursor-pointer rounded-lg border p-4 transition-colors {
								campaignType === type.value
									? 'border-gold-500/50 bg-gold-500/5'
									: 'border-midnight-700 bg-midnight-800/30 hover:border-midnight-600'
							}">
								<input
									type="radio"
									name="type"
									value={type.value}
									bind:group={campaignType}
									class="sr-only"
								/>
								<div>
									<p class="font-medium text-white">{type.label}</p>
									<p class="mt-1 text-xs text-midnight-400">{type.description}</p>
								</div>
								{#if campaignType === type.value}
									<div class="absolute top-2 right-2 h-2 w-2 rounded-full bg-gold-500"></div>
								{/if}
							</label>
						{/each}
					</div>
				</fieldset>

				<!-- Subject & Preview -->
				<div class="rounded-xl border border-midnight-800 bg-midnight-900/50 p-6 space-y-4">
					<div>
						<label for="subject" class="block text-sm font-medium text-white mb-2">
							<span class="flex items-center gap-2">
								<Type class="h-4 w-4 text-gold-400" />
								Email Subject *
							</span>
						</label>
						<input
							type="text"
							id="subject"
							name="subject"
							bind:value={subject}
							required
							placeholder="Your compelling subject line..."
							class="w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-3 text-white placeholder-midnight-500 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
						/>
					</div>

					<div>
						<label for="previewText" class="block text-sm font-medium text-white mb-2">
							<span class="flex items-center gap-2">
								<Eye class="h-4 w-4 text-midnight-400" />
								Preview Text
							</span>
						</label>
						<input
							type="text"
							id="previewText"
							name="previewText"
							bind:value={previewText}
							placeholder="Brief preview shown in inbox..."
							class="w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-3 text-white placeholder-midnight-500 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
						/>
						<p class="mt-1 text-xs text-midnight-500">This text appears after the subject in most email clients</p>
					</div>
				</div>

				<!-- Content -->
				<div class="rounded-xl border border-midnight-800 bg-midnight-900/50 p-6">
					<div class="flex items-center justify-between mb-4">
						<label for="content" class="block text-sm font-medium text-white">
							<span class="flex items-center gap-2">
								<FileText class="h-4 w-4 text-gold-400" />
								Email Content (HTML) *
							</span>
						</label>
						<button
							type="button"
							onclick={() => (showPreview = !showPreview)}
							class="text-sm text-gold-400 hover:text-gold-300 flex items-center gap-1"
						>
							<Eye class="h-4 w-4" />
							{showPreview ? 'Hide' : 'Show'} Preview
						</button>
					</div>
					<textarea
						id="content"
						name="content"
						bind:value={content}
						required
						rows="16"
						placeholder="<h2>Your email content...</h2>"
						class="w-full rounded-lg border border-midnight-700 bg-midnight-800/50 px-4 py-3 text-white placeholder-midnight-500 outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 font-mono text-sm"
					></textarea>
					<p class="mt-2 text-xs text-midnight-500">
						Use inline styles for email compatibility. Links will automatically be tracked.
					</p>
				</div>

				<!-- Submit -->
				<div class="flex gap-3">
					<button
						type="submit"
						disabled={isSubmitting || !subject || !content}
						class="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-6 py-3 font-semibold text-midnight-950 shadow-lg shadow-gold-500/25 transition-all hover:shadow-xl hover:shadow-gold-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<Sparkles class="h-5 w-5" />
						{isSubmitting ? 'Creating...' : 'Create Campaign'}
					</button>
					<a
						href="/admin/newsletter/campaigns"
						class="inline-flex items-center justify-center gap-2 rounded-xl border border-midnight-700 bg-midnight-800/50 px-6 py-3 font-medium text-midnight-300 transition-colors hover:bg-midnight-700 hover:text-white"
					>
						Cancel
					</a>
				</div>
			</form>
		</div>

		<!-- Live Preview -->
		{#if showPreview}
			<div class="rounded-xl border border-midnight-800 bg-midnight-900/50 overflow-hidden">
				<div class="border-b border-midnight-800 p-4">
					<h3 class="font-medium text-white flex items-center gap-2">
						<Eye class="h-4 w-4 text-gold-400" />
						Email Preview
					</h3>
				</div>
				<div class="p-6 bg-[#0a0a0f]">
					<div class="max-w-[600px] mx-auto bg-[#12121a] rounded-2xl overflow-hidden">
						<!-- Header -->
						<div class="p-8 text-center border-b border-[rgba(212,175,55,0.2)]">
							<h1 class="text-2xl font-bold text-[#d4af37]">Trading Greats</h1>
						</div>
						<!-- Preview subject -->
						{#if subject}
							<div class="px-8 pt-6 pb-2">
								<p class="text-sm text-[#6b7280]">Subject: <span class="text-white">{subject}</span></p>
							</div>
						{/if}
						<!-- Content -->
						<div class="p-8">
							{@html content}
						</div>
						<!-- Footer -->
						<div class="p-6 text-center border-t border-[rgba(255,255,255,0.1)]">
							<p class="text-xs text-[#6b7280]">
								<span class="text-[#d4af37] cursor-default">Manage preferences</span> ·
								<span class="text-[#6b7280] cursor-default">Unsubscribe</span>
							</p>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
