<script lang="ts">
	import type { Trader } from '$lib/server/schema';
	import { cn } from '$lib/utils';
	import { TrendingUp, Globe, DollarSign, ArrowRight } from 'lucide-svelte';

	interface Props {
		trader: Trader;
		class?: string;
		index?: number;
		featured?: boolean;
	}

	let { trader, class: className, index = 0, featured = false }: Props = $props();

	const styleColors: Record<string, string> = {
		'Macro & Currency': 'from-blue-500 to-cyan-500',
		'Value Investing': 'from-green-500 to-emerald-500',
		'Momentum Growth': 'from-purple-500 to-pink-500',
		'Options & Technical Analysis': 'from-orange-500 to-red-500',
		'Options & Price Action': 'from-amber-500 to-yellow-500'
	};

	const gradientClass = $derived(styleColors[trader.tradingStyle || ''] || 'from-gold-500 to-gold-600');
</script>

<a
	href="/traders/{trader.slug}"
	class={cn(
		'group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-midnight-900/40 backdrop-blur-sm transition-all duration-500',
		'hover:border-gold-500/30 hover:bg-midnight-800/60 hover:shadow-2xl hover:shadow-gold-500/10 hover:-translate-y-1',
		featured ? 'md:col-span-2 md:flex-row' : '',
		className
	)}
	style="animation-delay: {index * 50}ms"
>
	<!-- Image Container -->
	<div class={cn(
		"relative overflow-hidden",
		featured ? "md:w-2/5 aspect-[4/5] md:aspect-auto" : "aspect-[3/4]"
	)}>
		<img
			src={trader.photoUrl}
			alt={trader.name}
			class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
			loading="lazy"
			style:view-transition-name="trader-image-{trader.slug}"
		/>
		<!-- Gradient overlay -->
		<div class="absolute inset-0 bg-gradient-to-t from-midnight-950 via-midnight-950/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-60"></div>
		
		<!-- Trading style badge -->
		{#if trader.tradingStyle}
			<div class="absolute top-3 left-3 z-10">
				<span class={cn(
					'inline-flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-md border border-white/10 shadow-lg transition-transform group-hover:scale-105',
				)}>
					<div class={cn("h-1.5 w-1.5 rounded-full bg-gradient-to-r", gradientClass)}></div>
					{trader.tradingStyle}
				</span>
			</div>
		{/if}
	</div>

	<!-- Content -->
	<div class="flex flex-1 flex-col p-5 relative">
		<!-- Subtle glow effect behind text -->
		<div class="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gold-500/5 blur-3xl transition-all duration-500 group-hover:bg-gold-500/10"></div>

		<div class="relative z-10 flex flex-col h-full">
			<h3 class="font-display text-xl font-bold text-white transition-colors group-hover:text-gold-400">
				{trader.name}
			</h3>
			
			<p class="mt-2 text-sm leading-relaxed text-midnight-200 line-clamp-2 group-hover:text-white/90 transition-colors">
				{trader.oneLiner}
			</p>

			<div class="mt-4 flex flex-wrap gap-3 text-xs text-midnight-400">
				{#if trader.nationality}
					<span class="flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1">
						<Globe class="h-3 w-3 text-gold-500/70" />
						{trader.nationality}
					</span>
				{/if}
				{#if trader.netWorth}
					<span class="flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1">
						<DollarSign class="h-3 w-3 text-green-500/70" />
						{trader.netWorth}
					</span>
				{/if}
			</div>

			<div class="mt-auto pt-6 flex items-center justify-between">
				<span class="text-xs font-medium text-midnight-500 uppercase tracking-wider">Legend</span>
				<span class="inline-flex items-center gap-2 text-xs font-bold text-gold-500 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
					View Profile
					<ArrowRight class="h-3.5 w-3.5" />
				</span>
			</div>
		</div>
	</div>
</a>
