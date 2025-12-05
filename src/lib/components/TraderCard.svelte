<script lang="ts">
	import type { Trader } from '$lib/server/schema';
	import { cn } from '$lib/utils';
	import { Icon } from '$lib/components/icons';
	import FavoriteButton from './FavoriteButton.svelte';
	import CompareButton from './CompareButton.svelte';

	interface Props {
		trader: Trader;
		class?: string;
		index?: number;
		featured?: boolean;
	}

	let { trader, class: className, index = 0, featured = false }: Props = $props();

	// Image load state
	let imageLoaded = $state(false);
	let imageError = $state(false);

	// Get initials for fallback
	const initials = $derived(
		trader.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
	);

	// Trading style color mapping
	const styleColors: Record<string, { gradient: string; text: string; glow: string }> = {
		'Macro & Currency': {
			gradient: 'from-sky-500 to-cyan-500',
			text: 'text-sky-400',
			glow: 'group-hover:shadow-sky-500/25'
		},
		'Value Investing': {
			gradient: 'from-emerald-500 to-green-500',
			text: 'text-emerald-400',
			glow: 'group-hover:shadow-emerald-500/25'
		},
		'Momentum Growth': {
			gradient: 'from-violet-500 to-purple-500',
			text: 'text-violet-400',
			glow: 'group-hover:shadow-violet-500/25'
		},
		'Options & Technical Analysis': {
			gradient: 'from-orange-500 to-amber-500',
			text: 'text-orange-400',
			glow: 'group-hover:shadow-orange-500/25'
		},
		'Options & Price Action': {
			gradient: 'from-amber-500 to-yellow-500',
			text: 'text-amber-400',
			glow: 'group-hover:shadow-amber-500/25'
		},
		'Quantitative Trading': {
			gradient: 'from-blue-500 to-indigo-500',
			text: 'text-blue-400',
			glow: 'group-hover:shadow-blue-500/25'
		}
	};

	const styleConfig = $derived(styleColors[trader.tradingStyle || ''] || {
		gradient: 'from-gold-500 to-gold-600',
		text: 'text-gold-400',
		glow: 'group-hover:shadow-gold-500/25'
	});
</script>

<!-- MOBILE-FIRST: Fixed height card with consistent layout -->
<a
	href="/traders/{trader.slug}"
	class={cn(
		'group relative flex flex-col overflow-hidden rounded-2xl md:rounded-3xl',
		// MOBILE-FIRST: Consistent fixed height across all breakpoints
		'h-[280px] sm:h-[320px] md:h-[380px]',
		'bg-midnight-900/80',
		'border border-white/[0.08]',
		'transition-all duration-300',
		'active:scale-[0.98]',
		// Desktop hover effects
		'md:hover:scale-[1.02] md:hover:border-gold-500/40 md:hover:shadow-xl',
		className
	)}
>
	<!-- Image Container - Responsive height -->
	<div class="relative h-[140px] sm:h-[160px] md:h-[200px] flex-shrink-0 overflow-hidden bg-midnight-800">
		{#if trader.photoUrl && !imageError}
			<img
				src={trader.photoUrl}
				alt={trader.name}
				class={cn(
					'h-full w-full object-cover object-top transition-all duration-500',
					'md:group-hover:scale-105',
					imageLoaded ? 'opacity-100' : 'opacity-0'
				)}
				loading="lazy"
				onload={() => imageLoaded = true}
				onerror={() => imageError = true}
			/>
		{/if}
		
		<!-- Fallback: Initials (always rendered, hidden when image loads) -->
		<div 
			class={cn(
				'absolute inset-0 flex items-center justify-center',
				'bg-gradient-to-br from-midnight-800 to-midnight-900',
				(imageLoaded && !imageError) ? 'opacity-0' : 'opacity-100',
				'transition-opacity duration-300'
			)}
			aria-hidden={imageLoaded && !imageError}
		>
			<span class="text-4xl sm:text-5xl font-bold text-midnight-600 select-none">
				{initials}
			</span>
		</div>
		
		<!-- Gradient overlay -->
		<div class="absolute inset-0 bg-gradient-to-t from-midnight-900 via-midnight-900/40 to-transparent" aria-hidden="true"></div>
		
		<!-- Trading style badge -->
		{#if trader.tradingStyle}
			<div class="absolute top-3 left-3 z-10">
				<span class={cn(
					'inline-flex items-center gap-1 rounded-full px-2 py-1',
					'bg-black/60 backdrop-blur-sm',
					'text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white'
				)}>
					<span class={cn("h-1.5 w-1.5 rounded-full bg-gradient-to-r", styleConfig.gradient)}></span>
					{trader.tradingStyle}
				</span>
			</div>
		{/if}

		<!-- Action buttons -->
		<div class="absolute top-3 right-3 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 sm:opacity-100">
			<CompareButton slug={trader.slug} size="sm" />
			<FavoriteButton slug={trader.slug} size="sm" />
		</div>
	</div>

	<!-- Content Section - Fixed layout -->
	<div class="flex flex-1 flex-col p-3 sm:p-4">
		<!-- Name -->
		<h3 class="font-display text-base sm:text-lg font-bold text-white line-clamp-1 md:group-hover:text-gold-400 transition-colors">
			{trader.name}
		</h3>
		
		<!-- One-liner - Fixed 2 lines -->
		<p class="mt-1 text-xs sm:text-sm text-midnight-300 line-clamp-2 leading-snug">
			{trader.oneLiner}
		</p>

		<!-- Footer - Always at bottom -->
		<div class="mt-auto pt-2 sm:pt-3 flex items-center justify-between border-t border-white/5">
			<span class="text-[10px] font-medium text-midnight-500 uppercase tracking-wide">
				Track Record
			</span>
			{#if trader.netWorth}
				<span class="text-xs sm:text-sm font-bold text-emerald-400">
					{trader.netWorth}
				</span>
			{/if}
		</div>
	</div>
</a>
