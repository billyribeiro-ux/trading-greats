<!--
  TextReveal Component

  Reveals text with word-by-word or character-by-character animation.
  Creates a premium, cinematic text entrance effect.

  Usage:
  <TextReveal text="Welcome to Trading Greats" />
  <TextReveal text="Premium Experience" mode="chars" />
-->
<script lang="ts">
	import { browser } from '$app/environment';
	import { EASING, DURATION, prefersReducedMotion } from '$lib/utils/motion';
	import { cn } from '$lib/utils';

	// ============================================================================
	// PROPS
	// ============================================================================

	interface Props {
		/** Text to reveal */
		text: string;
		/** Animation mode */
		mode?: 'words' | 'chars';
		/** Stagger delay between items (ms) */
		staggerDelay?: number;
		/** Animation duration per item (ms) */
		duration?: number;
		/** Base delay before animation starts (ms) */
		delay?: number;
		/** Easing function */
		easing?: string;
		/** Element tag */
		as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
		/** Additional classes */
		class?: string;
	}

	let {
		text,
		mode = 'words',
		staggerDelay = 40,
		duration = DURATION.cinematic,
		delay = 0,
		easing = EASING.cinematic,
		as = 'span',
		class: className = ''
	}: Props = $props();

	// ============================================================================
	// STATE
	// ============================================================================

	let element: HTMLElement | undefined = $state(undefined);
	let isVisible = $state(false);
	let hasAnimated = $state(false);

	// ============================================================================
	// DERIVED
	// ============================================================================

	const items = $derived(
		mode === 'words'
			? text.split(' ').map((word, i) => ({ content: word, isSpace: false, index: i }))
			: text.split('').map((char, i) => ({
					content: char,
					isSpace: char === ' ',
					index: i
				}))
	);

	const shouldAnimate = $derived(!prefersReducedMotion());

	// ============================================================================
	// INTERSECTION OBSERVER
	// ============================================================================

	$effect(() => {
		if (!browser || !element) {
			isVisible = true;
			return;
		}

		if (!shouldAnimate) {
			isVisible = true;
			hasAnimated = true;
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !hasAnimated) {
						isVisible = true;
						hasAnimated = true;
						observer.disconnect();
					}
				});
			},
			{
				threshold: 0.2,
				rootMargin: '0px',
			}
		);

		observer.observe(element);

		return () => {
			observer.disconnect();
		};
	});

	// ============================================================================
	// HELPER FUNCTIONS
	// ============================================================================

	function getItemStyle(index: number): string {
		if (!shouldAnimate) return '';

		const itemDelay = delay + index * staggerDelay;
		return `
			transition-property: opacity, transform;
			transition-duration: ${duration}ms;
			transition-timing-function: ${easing};
			transition-delay: ${itemDelay}ms;
		`;
	}

	function getItemClasses(index: number): string {
		if (!shouldAnimate) return '';

		return isVisible
			? 'opacity-100 translate-y-0'
			: 'opacity-0 translate-y-4';
	}
</script>

<svelte:element
	this={as}
	bind:this={element}
	class={cn('inline', className)}
	aria-label={text}
>
	{#each items as item, i (i)}
		{#if item.isSpace}
			{' '}
		{:else}
			<span
				class={cn(
					'inline-block will-change-[opacity,transform]',
					getItemClasses(i)
				)}
				style={getItemStyle(i)}
				aria-hidden="true"
			>{item.content}</span>{#if mode === 'words' && i < items.length - 1}{' '}{/if}
		{/if}
	{/each}
</svelte:element>
