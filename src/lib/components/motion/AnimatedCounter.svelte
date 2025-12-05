<!--
  AnimatedCounter Component

  Smoothly animates a number from 0 to target value.
  Uses easing for natural feel, respects reduced motion.

  Usage:
  <AnimatedCounter value={1234} suffix="+" />
  <AnimatedCounter value={99.5} prefix="$" decimals={1} />
-->
<script lang="ts">
	import { browser } from '$app/environment';
	import { DURATION, prefersReducedMotion } from '$lib/utils/motion';
	import { cn } from '$lib/utils';

	// ============================================================================
	// PROPS
	// ============================================================================

	interface Props {
		/** Target value to count to */
		value: number;
		/** Animation duration (ms) */
		duration?: number;
		/** Number of decimal places */
		decimals?: number;
		/** Prefix (e.g., "$") */
		prefix?: string;
		/** Suffix (e.g., "+", "%") */
		suffix?: string;
		/** Delay before starting (ms) */
		delay?: number;
		/** Format with commas */
		formatNumber?: boolean;
		/** Additional classes */
		class?: string;
	}

	let {
		value,
		duration = DURATION.epic * 1.5,
		decimals = 0,
		prefix = '',
		suffix = '',
		delay = 0,
		formatNumber = true,
		class: className = ''
	}: Props = $props();

	// ============================================================================
	// STATE
	// ============================================================================

	let element: HTMLElement | undefined = $state(undefined);
	let currentValue = $state(0);
	let isVisible = $state(false);
	let hasAnimated = $state(false);

	// ============================================================================
	// DERIVED
	// ============================================================================

	const displayValue = $derived.by(() => {
		const num = currentValue.toFixed(decimals);
		if (formatNumber) {
			const [intPart, decPart] = num.split('.');
			const formatted = parseInt(intPart).toLocaleString('en-US');
			return decPart ? `${formatted}.${decPart}` : formatted;
		}
		return num;
	});

	// ============================================================================
	// INTERSECTION OBSERVER
	// ============================================================================

	$effect(() => {
		if (!browser || !element) return;

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
				threshold: 0.3,
				rootMargin: '0px',
			}
		);

		observer.observe(element);

		return () => {
			observer.disconnect();
		};
	});

	// ============================================================================
	// ANIMATION
	// ============================================================================

	$effect(() => {
		if (!browser || !isVisible) return;

		// Respect reduced motion
		if (prefersReducedMotion()) {
			currentValue = value;
			return;
		}

		const startTime = performance.now() + delay;
		let animationFrame: number;

		const animate = (now: number) => {
			const elapsed = now - startTime;

			if (elapsed < 0) {
				animationFrame = requestAnimationFrame(animate);
				return;
			}

			const progress = Math.min(elapsed / duration, 1);
			// Ease-out cubic for natural deceleration
			const eased = 1 - Math.pow(1 - progress, 3);
			currentValue = eased * value;

			if (progress < 1) {
				animationFrame = requestAnimationFrame(animate);
			} else {
				currentValue = value;
			}
		};

		animationFrame = requestAnimationFrame(animate);

		return () => {
			cancelAnimationFrame(animationFrame);
		};
	});
</script>

<span
	bind:this={element}
	class={cn('tabular-nums', className)}
	aria-label="{prefix}{value}{suffix}"
>
	{prefix}{displayValue}{suffix}
</span>
