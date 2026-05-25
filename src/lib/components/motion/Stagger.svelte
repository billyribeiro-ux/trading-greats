<!--
  Stagger Component

  Animates children with staggered delays for a premium cascading effect.
  Perfect for lists, grids, and card layouts.

  Usage:
  <Stagger>
    {#each items as item, i}
      <StaggerItem index={i}>
        <YourCard />
      </StaggerItem>
    {/each}
  </Stagger>
-->
<script lang="ts" module>
	// Export context key for child components
	export const STAGGER_CTX = Symbol('stagger');

	export interface StaggerContext {
		baseDelay: number;
		staggerDelay: number;
		duration: number;
		easing: string;
		isVisible: boolean;
	}
</script>

<script lang="ts">
	import { setContext } from 'svelte';
	import { browser } from '$app/environment';
	import { EASING, DURATION, prefersReducedMotion } from '$lib/utils/motion';
	import { cn } from '$lib/utils';

	// ============================================================================
	// PROPS
	// ============================================================================

	interface Props {
		/** Base delay before first item animates (ms) */
		baseDelay?: number;
		/** Delay between each item (ms) */
		staggerDelay?: number;
		/** Animation duration per item (ms) */
		duration?: number;
		/** Easing function */
		easing?: string;
		/** Intersection threshold */
		threshold?: number;
		/** Root margin */
		rootMargin?: string;
		/** Only animate once */
		once?: boolean;
		/** Additional classes */
		class?: string;
		/** Element tag */
		as?: 'div' | 'ul' | 'ol' | 'section';
		/** Children */
		children: import('svelte').Snippet;
	}

	let {
		baseDelay = 0,
		staggerDelay = 80,
		duration = DURATION.cinematic,
		easing = EASING.cinematic,
		threshold = 0.1,
		rootMargin = '0px 0px -50px 0px',
		once = true,
		class: className = '',
		as = 'div',
		children
	}: Props = $props();

	// ============================================================================
	// STATE
	// ============================================================================

	let element: HTMLElement | undefined = $state(undefined);
	let isVisible = $state(false);
	let hasAnimated = $state(false);

	// ============================================================================
	// CONTEXT
	// ============================================================================

	// Provide context to StaggerItem children
	// Context must be set synchronously during init — use getters so children read latest values
	setContext<StaggerContext>(STAGGER_CTX, {
		get baseDelay() { return prefersReducedMotion() ? 0 : baseDelay; },
		get staggerDelay() { return prefersReducedMotion() ? 0 : staggerDelay; },
		get duration() { return prefersReducedMotion() ? 0 : duration; },
		get easing() { return easing; },
		get isVisible() { return isVisible || hasAnimated; }
	});

	// ============================================================================
	// INTERSECTION OBSERVER
	// ============================================================================

	$effect(() => {
		if (!browser || !element) {
			isVisible = true;
			return;
		}

		if (prefersReducedMotion()) {
			isVisible = true;
			hasAnimated = true;
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						isVisible = true;
						if (once) {
							hasAnimated = true;
							observer.disconnect();
						}
					} else if (!once && !hasAnimated) {
						isVisible = false;
					}
				});
			},
			{
				threshold,
				rootMargin,
			}
		);

		observer.observe(element);

		return () => {
			observer.disconnect();
		};
	});
</script>

<svelte:element this={as} bind:this={element} class={cn(className)}>
	{@render children()}
</svelte:element>
