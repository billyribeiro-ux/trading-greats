<!--
  StaggerItem Component

  Used inside a Stagger component to create staggered animations.
  Automatically calculates delay based on index.

  Usage:
  <Stagger>
    {#each items as item, i}
      <StaggerItem index={i}>
        <YourCard />
      </StaggerItem>
    {/each}
  </Stagger>
-->
<script lang="ts">
	import { getContext } from 'svelte';
	import { STAGGER_CTX, type StaggerContext } from './Stagger.svelte';
	import { cn } from '$lib/utils';

	// ============================================================================
	// PROPS
	// ============================================================================

	interface Props {
		/** Item index for calculating stagger delay */
		index: number;
		/** Animation type */
		animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scaleIn';
		/** Additional classes */
		class?: string;
		/** Element tag */
		as?: 'div' | 'li' | 'article' | 'span';
		/** Children */
		children: import('svelte').Snippet;
	}

	let {
		index,
		animation = 'slideUp',
		class: className = '',
		as = 'div',
		children
	}: Props = $props();

	// ============================================================================
	// CONTEXT
	// ============================================================================

	const context = getContext<StaggerContext>(STAGGER_CTX);

	// ============================================================================
	// ANIMATION DEFINITIONS
	// ============================================================================

	const animations = {
		fadeIn: {
			initial: 'opacity-0',
			animate: 'opacity-100',
		},
		slideUp: {
			initial: 'opacity-0 translate-y-6',
			animate: 'opacity-100 translate-y-0',
		},
		slideLeft: {
			initial: 'opacity-0 translate-x-6',
			animate: 'opacity-100 translate-x-0',
		},
		slideRight: {
			initial: 'opacity-0 -translate-x-6',
			animate: 'opacity-100 translate-x-0',
		},
		scaleIn: {
			initial: 'opacity-0 scale-95',
			animate: 'opacity-100 scale-100',
		},
	};

	// ============================================================================
	// DERIVED STATE
	// ============================================================================

	const animationState = $derived(animations[animation]);
	const delay = $derived((context?.baseDelay ?? 0) + index * (context?.staggerDelay ?? 80));
	const isVisible = $derived(context?.isVisible ?? true);

	const currentClasses = $derived(
		isVisible ? animationState.animate : animationState.initial
	);

	const transitionStyle = $derived(
		`transition-property: opacity, transform; transition-duration: ${context?.duration ?? 500}ms; transition-timing-function: ${context?.easing ?? 'cubic-bezier(0.16, 1, 0.3, 1)'}; transition-delay: ${delay}ms;`
	);
</script>

{#if as === 'li'}
	<li
		class={cn('will-change-[opacity,transform]', currentClasses, className)}
		style={transitionStyle}
	>
		{@render children()}
	</li>
{:else if as === 'article'}
	<article
		class={cn('will-change-[opacity,transform]', currentClasses, className)}
		style={transitionStyle}
	>
		{@render children()}
	</article>
{:else if as === 'span'}
	<span
		class={cn('will-change-[opacity,transform]', currentClasses, className)}
		style={transitionStyle}
	>
		{@render children()}
	</span>
{:else}
	<div
		class={cn('will-change-[opacity,transform]', currentClasses, className)}
		style={transitionStyle}
	>
		{@render children()}
	</div>
{/if}
