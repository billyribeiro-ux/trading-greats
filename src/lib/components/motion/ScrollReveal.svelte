<!--
  ScrollReveal Component

  A performant, GPU-accelerated scroll reveal animation component.
  Uses Intersection Observer for optimal performance.
  Fully respects prefers-reduced-motion.

  Usage:
  <ScrollReveal>
    <YourContent />
  </ScrollReveal>

  <ScrollReveal animation="slideUp" delay={200} duration={600}>
    <YourContent />
  </ScrollReveal>
-->
<script lang="ts">
	import { browser } from '$app/environment';
	import { EASING, DURATION, prefersReducedMotion } from '$lib/utils/motion';
	import { cn } from '$lib/utils';

	// ============================================================================
	// TYPES & PROPS
	// ============================================================================

	type AnimationType =
		| 'fadeIn'
		| 'slideUp'
		| 'slideDown'
		| 'slideLeft'
		| 'slideRight'
		| 'scaleIn'
		| 'blur'
		| 'none';

	interface Props {
		/** Animation type */
		animation?: AnimationType;
		/** Delay before animation starts (ms) */
		delay?: number;
		/** Animation duration (ms) */
		duration?: number;
		/** Easing function */
		easing?: string;
		/** Intersection threshold (0-1) */
		threshold?: number;
		/** Root margin for earlier/later trigger */
		rootMargin?: string;
		/** Only animate once */
		once?: boolean;
		/** Additional classes */
		class?: string;
		/** Element id for anchor links */
		id?: string;
		/** Element tag */
		as?: 'div' | 'section' | 'article' | 'aside' | 'header' | 'footer' | 'main' | 'span';
		/** Children */
		children: import('svelte').Snippet;
	}

	let {
		animation = 'slideUp',
		delay = 0,
		duration = DURATION.cinematic,
		easing = EASING.cinematic,
		threshold = 0.15,
		rootMargin = '0px 0px -80px 0px',
		once = true,
		class: className = '',
		id,
		as = 'div',
		children
	}: Props = $props();

	// ============================================================================
	// STATE
	// ============================================================================

	let element: HTMLElement | undefined = $state(undefined);
	// SSR-first: Start visible for SEO/accessibility
	let isVisible = $state(!browser);
	let hasAnimated = $state(false);

	// ============================================================================
	// ANIMATION DEFINITIONS
	// ============================================================================

	const animations: Record<AnimationType, { initial: string; animate: string }> = {
		fadeIn: {
			initial: 'opacity-0',
			animate: 'opacity-100',
		},
		slideUp: {
			initial: 'opacity-0 translate-y-8',
			animate: 'opacity-100 translate-y-0',
		},
		slideDown: {
			initial: 'opacity-0 -translate-y-8',
			animate: 'opacity-100 translate-y-0',
		},
		slideLeft: {
			initial: 'opacity-0 translate-x-8',
			animate: 'opacity-100 translate-x-0',
		},
		slideRight: {
			initial: 'opacity-0 -translate-x-8',
			animate: 'opacity-100 translate-x-0',
		},
		scaleIn: {
			initial: 'opacity-0 scale-95',
			animate: 'opacity-100 scale-100',
		},
		blur: {
			initial: 'opacity-0 blur-sm',
			animate: 'opacity-100 blur-0',
		},
		none: {
			initial: '',
			animate: '',
		},
	};

	// ============================================================================
	// DERIVED STATE
	// ============================================================================

	const shouldAnimate = $derived(!prefersReducedMotion() && animation !== 'none');
	const animationState = $derived(animations[animation]);

	const currentClasses = $derived(
		shouldAnimate
			? isVisible || hasAnimated
				? animationState.animate
				: animationState.initial
			: ''
	);

	const transitionStyle = $derived(
		shouldAnimate
			? `transition-property: opacity, transform, filter; transition-duration: ${duration}ms; transition-timing-function: ${easing}; transition-delay: ${delay}ms;`
			: ''
	);

	// ============================================================================
	// INTERSECTION OBSERVER
	// ============================================================================

	$effect(() => {
		if (!browser || !element) return;

		if (!shouldAnimate) {
			isVisible = true;
			return;
		}

		// Check if element is already in viewport on mount
		const rect = element.getBoundingClientRect();
		const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
		
		if (isInViewport) {
			// Already visible - animate immediately
			isVisible = true;
			hasAnimated = true;
			return;
		}

		// Not in viewport - set up observer
		isVisible = false;
		
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

{#if as === 'section'}
	<section
		bind:this={element}
		{id}
		class={cn('will-change-[opacity,transform]', currentClasses, className)}
		style={transitionStyle}
	>
		{@render children()}
	</section>
{:else if as === 'article'}
	<article
		bind:this={element}
		{id}
		class={cn('will-change-[opacity,transform]', currentClasses, className)}
		style={transitionStyle}
	>
		{@render children()}
	</article>
{:else if as === 'aside'}
	<aside
		bind:this={element}
		{id}
		class={cn('will-change-[opacity,transform]', currentClasses, className)}
		style={transitionStyle}
	>
		{@render children()}
	</aside>
{:else if as === 'header'}
	<header
		bind:this={element}
		{id}
		class={cn('will-change-[opacity,transform]', currentClasses, className)}
		style={transitionStyle}
	>
		{@render children()}
	</header>
{:else if as === 'footer'}
	<footer
		bind:this={element}
		{id}
		class={cn('will-change-[opacity,transform]', currentClasses, className)}
		style={transitionStyle}
	>
		{@render children()}
	</footer>
{:else if as === 'main'}
	<main
		bind:this={element}
		{id}
		class={cn('will-change-[opacity,transform]', currentClasses, className)}
		style={transitionStyle}
	>
		{@render children()}
	</main>
{:else if as === 'span'}
	<span
		bind:this={element}
		{id}
		class={cn('will-change-[opacity,transform]', currentClasses, className)}
		style={transitionStyle}
	>
		{@render children()}
	</span>
{:else}
	<div
		bind:this={element}
		{id}
		class={cn('will-change-[opacity,transform]', currentClasses, className)}
		style={transitionStyle}
	>
		{@render children()}
	</div>
{/if}
