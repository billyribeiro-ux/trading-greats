<!--
  ParallaxSection Component

  Creates smooth parallax scrolling effects.
  GPU-accelerated with transform: translateY().
  Respects prefers-reduced-motion.

  Usage:
  <ParallaxSection speed={0.2}>
    <img src="..." alt="..." />
  </ParallaxSection>
-->
<script lang="ts">
	import { browser } from '$app/environment';
	import { prefersReducedMotion } from '$lib/utils/motion';
	import { cn } from '$lib/utils';

	// ============================================================================
	// PROPS
	// ============================================================================

	interface Props {
		/** Parallax speed (0.1 = subtle, 0.5 = dramatic) */
		speed?: number;
		/** Direction of parallax */
		direction?: 'up' | 'down';
		/** Additional classes */
		class?: string;
		/** Additional wrapper classes */
		wrapperClass?: string;
		/** Children */
		children: import('svelte').Snippet;
	}

	let {
		speed = 0.15,
		direction = 'up',
		class: className = '',
		wrapperClass = '',
		children
	}: Props = $props();

	// ============================================================================
	// STATE
	// ============================================================================

	let element: HTMLElement | undefined = $state(undefined);
	let offsetY = $state(0);

	// ============================================================================
	// DERIVED
	// ============================================================================

	const transformStyle = $derived(
		prefersReducedMotion()
			? ''
			: `transform: translate3d(0, ${direction === 'up' ? offsetY : -offsetY}px, 0);`
	);

	// ============================================================================
	// SCROLL HANDLER
	// ============================================================================

	$effect(() => {
		if (!browser || !element || prefersReducedMotion()) return;

		let ticking = false;

		const handleScroll = () => {
			if (!ticking) {
				requestAnimationFrame(() => {
					if (!element) return;

					const rect = element.getBoundingClientRect();
					const viewportHeight = window.innerHeight;

					// Calculate how far the element is from the center of the viewport
					const elementCenter = rect.top + rect.height / 2;
					const viewportCenter = viewportHeight / 2;
					const distance = elementCenter - viewportCenter;

					// Apply parallax based on distance from center
					offsetY = distance * speed;

					ticking = false;
				});
				ticking = true;
			}
		};

		// Initial calculation
		handleScroll();

		window.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('resize', handleScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleScroll);
		};
	});
</script>

<div bind:this={element} class={cn('relative overflow-hidden', wrapperClass)}>
	<div
		class={cn('will-change-transform', className)}
		style={transformStyle}
	>
		{@render children()}
	</div>
</div>
