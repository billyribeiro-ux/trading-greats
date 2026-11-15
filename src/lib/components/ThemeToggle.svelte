<script lang="ts">
	import { theme } from '#lib/stores/theme.svelte.ts';
	import { IconDeviceDesktop, IconMoon, IconSun } from '@tabler/icons-svelte';
	import { cn } from '#lib/utils/index.ts';

	interface Props {
		class?: string;
	}

	let { class: className }: Props = $props();

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
		<IconDeviceDesktop size={20} stroke={1.6} />
	{:else if theme.current === 'dark'}
		<IconMoon size={20} stroke={1.6} />
	{:else}
		<IconSun size={20} stroke={1.6} />
	{/if}
</button>
