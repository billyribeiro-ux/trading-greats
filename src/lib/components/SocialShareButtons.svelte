<script lang="ts">
	import { Icon, type IconName } from '$lib/components/icons';
	import { cn } from '$lib/utils';

	interface Props {
		url: string;
		title: string;
		description?: string;
		variant?: 'default' | 'compact' | 'icons-only';
		class?: string;
	}

	let {
		url,
		title,
		description = '',
		variant = 'default',
		class: className
	}: Props = $props();

	let copied = $state(false);

	const encodedUrl = $derived(encodeURIComponent(url));
	const encodedTitle = $derived(encodeURIComponent(title));
	const encodedDescription = $derived(encodeURIComponent(description));

	interface SharePlatform {
		name: string;
		icon: IconName;
		color: string;
		hoverBg: string;
		getUrl: () => string;
	}

	const platforms: SharePlatform[] = [
		{
			name: 'Twitter',
			icon: 'twitter',
			color: 'text-[#1DA1F2]',
			hoverBg: 'hover:bg-[#1DA1F2]/10',
			getUrl: () => `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
		},
		{
			name: 'Facebook',
			icon: 'facebook',
			color: 'text-[#1877F2]',
			hoverBg: 'hover:bg-[#1877F2]/10',
			getUrl: () => `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
		},
		{
			name: 'LinkedIn',
			icon: 'linkedin',
			color: 'text-[#0A66C2]',
			hoverBg: 'hover:bg-[#0A66C2]/10',
			getUrl: () => `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`
		},
		{
			name: 'Email',
			icon: 'mail',
			color: 'text-midnight-300',
			hoverBg: 'hover:bg-white/10',
			getUrl: () => `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
		}
	];

	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(url);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}

	function openShareWindow(shareUrl: string) {
		if (shareUrl.startsWith('mailto:')) {
			window.location.href = shareUrl;
		} else {
			window.open(shareUrl, 'share', 'width=600,height=400,scrollbars=yes');
		}
	}
</script>

{#if variant === 'icons-only'}
	<div class={cn('flex items-center gap-1', className)}>
		{#each platforms as platform}
			<button
				type="button"
				onclick={() => openShareWindow(platform.getUrl())}
				class={cn(
					'p-2 rounded-lg transition-all duration-200',
					platform.hoverBg,
					platform.color,
					'hover:scale-110'
				)}
				aria-label={`Share on ${platform.name}`}
			>
				<Icon name={platform.icon} class="h-4 w-4" />
			</button>
		{/each}
		<button
			type="button"
			onclick={copyToClipboard}
			class={cn(
				'p-2 rounded-lg transition-all duration-200',
				'hover:bg-white/10',
				copied ? 'text-green-400' : 'text-midnight-400'
			)}
			aria-label={copied ? 'Copied!' : 'Copy link'}
		>
			<Icon name={copied ? 'check' : 'link'} class="h-4 w-4" />
		</button>
	</div>
{:else if variant === 'compact'}
	<div class={cn('flex items-center gap-2', className)}>
		<span class="text-xs text-midnight-500">Share:</span>
		{#each platforms as platform}
			<button
				type="button"
				onclick={() => openShareWindow(platform.getUrl())}
				class={cn(
					'p-1.5 rounded-md transition-all duration-200',
					platform.hoverBg,
					platform.color,
					'hover:scale-105'
				)}
				aria-label={`Share on ${platform.name}`}
			>
				<Icon name={platform.icon} class="h-3.5 w-3.5" />
			</button>
		{/each}
		<button
			type="button"
			onclick={copyToClipboard}
			class={cn(
				'p-1.5 rounded-md transition-all duration-200',
				'hover:bg-white/10',
				copied ? 'text-green-400' : 'text-midnight-400'
			)}
			aria-label={copied ? 'Copied!' : 'Copy link'}
		>
			<Icon name={copied ? 'check' : 'copy'} class="h-3.5 w-3.5" />
		</button>
	</div>
{:else}
	<!-- Default variant -->
	<div class={cn('flex flex-col gap-4', className)}>
		<div class="flex items-center gap-2">
			<Icon name="share" class="h-4 w-4 text-midnight-400" />
			<span class="text-sm font-medium text-midnight-300">Share this page</span>
		</div>

		<div class="flex flex-wrap gap-2">
			{#each platforms as platform}
				<button
					type="button"
					onclick={() => openShareWindow(platform.getUrl())}
					class={cn(
						'flex items-center gap-2 px-4 py-2.5 rounded-xl',
						'border border-white/10 bg-white/5',
						'transition-all duration-200',
						platform.hoverBg,
						'hover:border-white/20 hover:scale-[1.02]',
						'text-sm font-medium'
					)}
				>
					<Icon name={platform.icon} class={cn('h-4 w-4', platform.color)} />
					<span class="text-white">{platform.name}</span>
				</button>
			{/each}

			<button
				type="button"
				onclick={copyToClipboard}
				class={cn(
					'flex items-center gap-2 px-4 py-2.5 rounded-xl',
					'border transition-all duration-200',
					copied
						? 'border-green-500/50 bg-green-500/10 text-green-400'
						: 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10',
					'text-sm font-medium hover:scale-[1.02]'
				)}
			>
				<Icon name={copied ? 'check' : 'copy'} class="h-4 w-4" />
				<span>{copied ? 'Copied!' : 'Copy Link'}</span>
			</button>
		</div>
	</div>
{/if}
