<script lang="ts">
	import { theme } from '$lib/stores/theme';
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
		'relative inline-flex items-center justify-center',
		'h-9 w-9 rounded-lg',
		'bg-midnight-800/50 dark:bg-midnight-800/50 light:bg-midnight-100',
		'border border-white/10 dark:border-white/10',
		'text-midnight-300 dark:text-midnight-300',
		'hover:bg-midnight-700/50 dark:hover:bg-midnight-700/50',
		'hover:text-white dark:hover:text-white',
		'transition-all duration-200',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-midnight-950',
		className
	)}
	aria-label={`Toggle theme. Currently ${label}`}
	title={`Toggle theme (${label})`}
>
	<span class="sr-only">Toggle theme</span>

	<!-- Icon with smooth transition -->
	<div class="relative h-4 w-4">
		{#if theme.current === 'system'}
			<Icon name="monitor" class="h-4 w-4" />
		{:else if theme.current === 'dark'}
			<Icon name="moon" class="h-4 w-4" />
		{:else}
			<Icon name="sun" class="h-4 w-4" />
		{/if}
	</div>
</button>
