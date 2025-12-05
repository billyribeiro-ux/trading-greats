<script lang="ts">
	import { Icon } from '$lib/components/icons';
	import { favorites } from '$lib/stores/favorites';
	import { cn } from '$lib/utils';
	import { browser } from '$app/environment';

	interface Props {
		slug: string;
		size?: 'sm' | 'md' | 'lg';
		variant?: 'icon' | 'button';
		class?: string;
	}

	let { slug, size = 'md', variant = 'icon', class: className }: Props = $props();

	// Track if component is mounted (for SSR)
	let mounted = $state(false);

	$effect(() => {
		if (browser) {
			mounted = true;
		}
	});

	const isFavorite = $derived(mounted ? favorites.isFavorite(slug) : false);

	const sizeClasses = {
		sm: 'h-3.5 w-3.5',
		md: 'h-4 w-4',
		lg: 'h-5 w-5'
	};

	const buttonSizeClasses = {
		sm: 'p-1.5',
		md: 'p-2',
		lg: 'p-2.5'
	};

	function handleClick(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		favorites.toggle(slug);
	}
</script>

{#if variant === 'button'}
	<button
		type="button"
		onclick={handleClick}
		class={cn(
			'inline-flex items-center gap-2 rounded-lg font-medium transition-all duration-200',
			'border',
			isFavorite
				? 'border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/20'
				: 'border-white/10 bg-white/5 text-midnight-300 hover:bg-white/10 hover:text-white',
			size === 'sm' && 'px-3 py-1.5 text-xs',
			size === 'md' && 'px-4 py-2 text-sm',
			size === 'lg' && 'px-5 py-2.5 text-base',
			className
		)}
		aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
	>
		<Icon
			name="heart"
			class={cn(
				sizeClasses[size],
				isFavorite && 'fill-current'
			)}
		/>
		{isFavorite ? 'Saved' : 'Save'}
	</button>
{:else}
	<button
		type="button"
		onclick={handleClick}
		class={cn(
			'rounded-full transition-all duration-200',
			buttonSizeClasses[size],
			isFavorite
				? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
				: 'bg-white/10 text-midnight-400 hover:bg-white/20 hover:text-white',
			'backdrop-blur-sm',
			className
		)}
		aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
	>
		<Icon
			name="heart"
			class={cn(
				sizeClasses[size],
				isFavorite && 'fill-current',
				'transition-transform duration-200',
				isFavorite && 'scale-110'
			)}
		/>
	</button>
{/if}
