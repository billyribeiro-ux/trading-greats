<script lang="ts">
	import { Icon } from '$lib/components/icons';
	import { comparison } from '$lib/stores/comparison.svelte';
	import { cn } from '$lib/utils';
	import { browser } from '$app/environment';

	interface Props {
		slug: string;
		size?: 'sm' | 'md';
		class?: string;
	}

	let { slug, size = 'sm', class: className }: Props = $props();

	let mounted = $state(false);

	$effect(() => {
		if (browser) {
			mounted = true;
		}
	});

	const isSelected = $derived(mounted ? comparison.isInComparison(slug) : false);
	const isFull = $derived(mounted ? comparison.isFull : false);
	const canAdd = $derived(!isSelected && !isFull);

	function handleClick(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		comparison.toggle(slug);
	}

	const sizeClasses = {
		sm: 'p-1.5',
		md: 'p-2'
	};

	const iconSizes = {
		sm: 'h-3.5 w-3.5',
		md: 'h-4 w-4'
	};
</script>

<button
	type="button"
	onclick={handleClick}
	disabled={!canAdd && !isSelected}
	class={cn(
		'rounded-full transition-all duration-200',
		sizeClasses[size],
		isSelected
			? 'bg-violet-500/20 text-violet-400 hover:bg-violet-500/30'
			: canAdd
				? 'bg-white/10 text-midnight-400 hover:bg-white/20 hover:text-white'
				: 'bg-white/5 text-midnight-600 cursor-not-allowed',
		'backdrop-blur-sm',
		className
	)}
	aria-label={isSelected ? 'Remove from comparison' : canAdd ? 'Add to comparison' : 'Comparison full'}
	title={isSelected ? 'Remove from comparison' : canAdd ? 'Add to comparison' : `Max ${comparison.maxCompare} traders`}
>
	<Icon
		name="bar-chart"
		class={cn(
			iconSizes[size],
			isSelected && 'scale-110',
			'transition-transform duration-200'
		)}
	/>
</button>
