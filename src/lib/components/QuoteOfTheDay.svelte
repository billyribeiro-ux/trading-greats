<script lang="ts">
	import { IconArrowUpRight } from '@tabler/icons-svelte';
	import { cn } from '#lib/utils/index.ts';

	import type { DailyQuote } from '#lib/utils/daily-quote.ts';

	interface Props {
		quote: DailyQuote | null;
		class?: string;
	}

	let { quote, class: className }: Props = $props();
</script>

{#if quote}
	<section class={cn('daily-quote', className)}>
		<div class="site-container daily-inner">
			<div class="daily-label"><span>FROM THE ARCHIVE</span><span> / QUOTE OF THE DAY</span></div>
			<blockquote>“{quote.text}”</blockquote>
			<div class="daily-author"><span></span><div><a href="/traders/{quote.traderSlug}">{quote.traderName} <IconArrowUpRight size={16} stroke={1.6} aria-hidden="true" /></a>{#if quote.source}<p>{quote.source}</p>{/if}</div></div>
		</div>
	</section>
{/if}
<style>
.daily-quote { background:#e8e3d9; color:#16232b; padding:clamp(4.5rem,8vw,8rem) 0; }
.daily-label { display:flex; flex-wrap:wrap; gap:.4rem; color:#705632; font-size:.7rem; font-weight:700; letter-spacing:.14em; }
blockquote { margin:2rem 0; max-width:60rem; font-family:'Playfair Display',Georgia,serif; font-size:clamp(1.8rem,2.5vw + 1rem,3.4rem); line-height:1.3; letter-spacing:-.025em; }
.daily-author { display:flex; gap:1rem; align-items:start; }.daily-author > span { margin-top:.65rem; width:2.2rem; height:1px; background:#987b4e; }.daily-author a { display:inline-flex; align-items:center; gap:.3rem; color:#293c46; font-size:.95rem; font-weight:700; text-decoration:none; }.daily-author p { margin:.35rem 0 0; font-size:.8rem; color:#58666a; }
</style>
