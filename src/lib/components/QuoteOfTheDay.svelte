<script lang="ts">
	import { cn } from '#lib/utils/index.ts';

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
	<section class={cn('daily-quote', className)}>
		<div class="site-container daily-inner">
			<div class="daily-label"><span>FROM THE ARCHIVE</span><span> / QUOTE OF THE DAY</span></div>
			<blockquote>“{todayQuote.text}”</blockquote>
			<div class="daily-author"><span></span><div><a href="/traders/{todayQuote.traderSlug}">{todayQuote.traderName} ↗</a>{#if todayQuote.source}<p>{todayQuote.source}</p>{/if}</div></div>
		</div>
	</section>
{/if}
<style>
.daily-quote { background:#e8e3d9; color:#16232b; padding:clamp(4.5rem,8vw,8rem) 0; }
.daily-label { display:flex; flex-wrap:wrap; gap:.4rem; color:#705632; font-size:.7rem; font-weight:700; letter-spacing:.14em; }
blockquote { margin:2rem 0; max-width:60rem; font-family:'Playfair Display',Georgia,serif; font-size:clamp(1.8rem,2.5vw + 1rem,3.4rem); line-height:1.3; letter-spacing:-.025em; }
.daily-author { display:flex; gap:1rem; align-items:start; }.daily-author > span { margin-top:.65rem; width:2.2rem; height:1px; background:#987b4e; }.daily-author a { color:#293c46; font-size:.95rem; font-weight:700; text-decoration:none; }.daily-author p { margin:.35rem 0 0; font-size:.8rem; color:#58666a; }
</style>
