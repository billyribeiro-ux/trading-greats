<script lang="ts">
	import { Icon } from '$lib/components/icons';
	import { cn } from '$lib/utils';

	interface Quote {
		text: string;
		source?: string;
		traderName: string;
		traderSlug: string;
	}

	interface Props {
		quotes: Quote[];
		class?: string;
	}

	let { quotes, class: className }: Props = $props();

	// Get a deterministic quote based on the current date
	// This ensures all users see the same quote on the same day
	const todayQuote = $derived.by(() => {
		if (!quotes || quotes.length === 0) return null;

		// Use date to create a deterministic index
		const today = new Date();
		const dayOfYear = Math.floor(
			(today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
		);
		const index = dayOfYear % quotes.length;
		return quotes[index];
	});
</script>

{#if todayQuote}
	<section class={cn('relative z-20 bg-[#020617] py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden', className)}>
		<!-- Background glow -->
		<div class="absolute inset-0 overflow-hidden">
			<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] lg:w-[900px] h-[300px] sm:h-[400px] lg:h-[500px] bg-[radial-gradient(circle,rgba(234,179,8,0.08)_0%,transparent_60%)] blur-3xl"></div>
		</div>

		<div class="relative mx-auto max-w-4xl text-center">
			<!-- Badge -->
			<span class="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#FACC15] mb-6 sm:mb-8 border border-white/10">
				<Icon name="quote" class="h-3.5 w-3.5" />
				Quote of the Day
			</span>

			<!-- Quote Icon -->
			<div class="flex justify-center mb-4 sm:mb-6">
				<div class="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#EAB308]/20 to-[#CA8A04]/10 text-[#FACC15] ring-1 ring-[#EAB308]/30">
					<Icon name="quote" class="h-6 w-6 sm:h-7 sm:w-7 rotate-180" />
				</div>
			</div>

			<!-- Quote Text -->
			<blockquote class="relative">
				<p class="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-relaxed italic">
					"{todayQuote.text}"
				</p>
			</blockquote>

			<!-- Attribution -->
			<div class="mt-6 sm:mt-8 flex flex-col items-center gap-2">
				<a
					href="/traders/{todayQuote.traderSlug}"
					class="group flex items-center gap-2 text-lg sm:text-xl font-semibold text-[#EAB308] hover:text-[#FACC15] transition-colors"
				>
					{todayQuote.traderName}
					<Icon name="arrow-right" class="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
				</a>
				{#if todayQuote.source}
					<p class="text-sm text-slate-500">
						{todayQuote.source}
					</p>
				{/if}
			</div>

			<!-- See more quotes link -->
			<div class="mt-8 sm:mt-10">
				<a
					href="/traders/{todayQuote.traderSlug}#quotes"
					class="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
				>
					<Icon name="book-open" class="h-4 w-4" />
					Read more wisdom from {todayQuote.traderName}
				</a>
			</div>
		</div>
	</section>
{/if}
