<script lang="ts">
	import { theme } from '$lib/stores/theme.svelte';
	import { Icon } from '$lib/components/icons';
	import { cn } from '$lib/utils';

	interface Props {
		class?: string;
	}

	let { class: className }: Props = $props();

	// Get icon based on current theme
	const iconName = $derived(
		theme.current === 'system'
			? 'monitor'
			: theme.current === 'dark'
				? 'moon'
				: 'sun'
	);

	// Accessible label
	const label = $derived(
		theme.current === 'system'
			? 'Using system theme'
			: theme.current === 'dark'
				? 'Dark mode'
				: 'Light mode'
	);
</script>

<button
	type="button"
	onclick={() => theme.toggle()}
	class={cn(
		'group relative inline-flex items-center justify-center',
		'h-11 w-11 rounded-full',
		'text-midnight-400',
		'hover:bg-white/5 hover:text-white',
		'active:scale-95 active:bg-white/10',
		'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50',
		className
	)}
	aria-label={`Toggle theme. Currently ${label}`}
	title={`Toggle theme (${label})`}
>
	<span class="sr-only">Toggle theme</span>

	<!-- Icon with smooth transition -->
	{#if theme.current === 'system'}
		<Icon name="monitor" class="h-5 w-5 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110" strokeWidth={2} />
	{:else if theme.current === 'dark'}
		<Icon name="moon" class="h-5 w-5 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110" strokeWidth={2} />
	{:else}
		<Icon name="sun" class="h-5 w-5 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110" strokeWidth={2} />
	{/if}
</button>
