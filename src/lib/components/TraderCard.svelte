<script lang="ts">
	import type { Trader } from '$lib/server/schema';
	import { cn } from '$lib/utils';
	import { Icon } from '$lib/components/icons';

	interface Props {
		trader: Trader;
		class?: string;
		index?: number;
		featured?: boolean;
	}

	let { trader, class: className, index = 0, featured = false }: Props = $props();

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

<a
	href="/traders/{trader.slug}"
	class={cn(
		// Base - FIXED HEIGHT for consistent sizing
		'group relative flex flex-col overflow-hidden rounded-3xl',
		'h-[420px]', // FIXED HEIGHT - all cards exactly the same
		// Background & border
		'bg-gradient-to-b from-white/[0.06] to-transparent',
		'backdrop-blur-xl',
		'border border-white/[0.08]',
		// Netflix Cinematic Transitions
		'transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
		// Netflix Hover - Scale up, glow, lift
		'hover:scale-[1.04]',
		'hover:border-gold-500/40',
		'hover:shadow-[0_30px_100px_-20px_rgba(234,179,8,0.4)]',
		styleConfig.glow,
		// Active state
		'active:scale-[0.99] active:duration-100',
		className
	)}
>
	<!-- Netflix ambient glow overlay -->
	<div 
		class="absolute inset-0 rounded-3xl bg-gradient-to-t from-gold-500/0 via-transparent to-gold-500/0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-hover:from-gold-500/20 group-hover:to-transparent pointer-events-none"
		aria-hidden="true"
	></div>
	
	<!-- Image Container - FIXED aspect ratio -->
	<div class="relative h-[240px] flex-shrink-0 overflow-hidden">
		<!-- Image with Netflix zoom -->
		<img
			src={trader.photoUrl}
			alt={trader.name}
			class="h-full w-full object-cover transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.15]"
			loading="lazy"
		/>
		
		<!-- Cinematic gradient overlay -->
		<div 
			class="absolute inset-0 bg-gradient-to-t from-midnight-950 via-midnight-950/50 to-transparent"
			aria-hidden="true"
		></div>
		
		<!-- Netflix brightness boost on hover -->
		<div 
			class="absolute inset-0 bg-white/0 transition-all duration-500 group-hover:bg-white/[0.03]"
			aria-hidden="true"
		></div>
		
		<!-- Trading style badge -->
		{#if trader.tradingStyle}
			<div class="absolute top-4 left-4 z-10">
				<span class={cn(
					'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5',
					'bg-black/60 backdrop-blur-xl',
					'border border-white/10',
					'text-[10px] font-bold uppercase tracking-wider text-white',
					'shadow-xl',
					'transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105 group-hover:bg-black/70'
				)}>
					<span class={cn("h-2 w-2 rounded-full bg-gradient-to-r", styleConfig.gradient)}></span>
					{trader.tradingStyle}
				</span>
			</div>
		{/if}
	</div>

	<!-- Content Section - FIXED HEIGHT with flex layout -->
	<div class="relative flex flex-1 flex-col p-5">
		<!-- Name -->
		<h3 class="font-display text-xl font-bold text-white transition-colors duration-300 group-hover:text-gold-400 line-clamp-1">
				{trader.name}
			</h3>
			
		<!-- One-liner - FIXED to 2 lines -->
		<p class="mt-2 text-sm leading-relaxed text-midnight-300 line-clamp-2 h-[40px] transition-colors duration-300 group-hover:text-midnight-100">
				{trader.oneLiner}
			</p>

		<!-- Meta info - FIXED position -->
		<div class="mt-3 flex flex-wrap gap-2">
				{#if trader.nationality}
				<span class="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-2 py-1 text-[11px] text-midnight-400 border border-white/5 transition-all duration-300 group-hover:bg-gold-500/10 group-hover:border-gold-500/20 group-hover:text-gold-300">
					<Icon name="globe" class="h-3 w-3" />
						{trader.nationality}
					</span>
				{/if}
				{#if trader.netWorth}
				<span class="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-2 py-1 text-[11px] text-midnight-400 border border-white/5 transition-all duration-300 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 group-hover:text-emerald-300">
					<Icon name="dollar-sign" class="h-3 w-3" />
						{trader.netWorth}
					</span>
				{/if}
			</div>

		<!-- Footer - ALWAYS at bottom -->
		<div class="mt-auto pt-4 flex items-center justify-between">
			<span class="text-[10px] font-bold uppercase tracking-widest text-midnight-600">
				Legend
			</span>
			
			<!-- Animated CTA -->
			<span class="inline-flex items-center gap-1.5 text-xs font-bold text-gold-500 translate-x-4 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-0 group-hover:opacity-100">
					View Profile
				<Icon name="arrow-right" class="h-3.5 w-3.5" />
				</span>
			</div>
		</div>
	
	<!-- Netflix shine sweep on hover -->
	<div class="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none overflow-hidden rounded-3xl">
		<div class="absolute -inset-full top-0 h-[500%] w-[200%] -translate-x-full rotate-45 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent transition-transform duration-[1.5s] group-hover:translate-x-full"></div>
	</div>
	
	<!-- Bottom glow line -->
	<div 
		class="absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-gold-500/0 to-transparent transition-all duration-500 group-hover:via-gold-500/60"
		aria-hidden="true"
	></div>
</a>
