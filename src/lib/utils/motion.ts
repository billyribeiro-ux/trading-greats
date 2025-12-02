/**
 * Motion Utilities for Trading Greats
 *
 * GPU-accelerated, 60fps animations with full accessibility support.
 * Follows Apple/Netflix motion design principles.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface AnimationConfig {
	duration?: number;
	delay?: number;
	easing?: string;
	fillMode?: 'forwards' | 'backwards' | 'both' | 'none';
}

export interface ScrollRevealConfig extends AnimationConfig {
	threshold?: number;
	rootMargin?: string;
	once?: boolean;
}

export interface StaggerConfig extends AnimationConfig {
	staggerDelay?: number;
	direction?: 'forward' | 'reverse' | 'center';
}

// ============================================================================
// EASING FUNCTIONS
// ============================================================================

/**
 * Premium easing curves following Apple's HIG and Netflix motion principles
 * These create smooth, natural-feeling animations
 */
export const EASING = {
	// Standard easings
	linear: 'linear',
	ease: 'ease',
	easeIn: 'ease-in',
	easeOut: 'ease-out',
	easeInOut: 'ease-in-out',

	// Apple-style spring easings (using cubic-bezier approximations)
	spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
	springSmooth: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
	springBounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',

	// Netflix-style cinematic easings
	cinematic: 'cubic-bezier(0.16, 1, 0.3, 1)',
	cinematicIn: 'cubic-bezier(0.55, 0, 1, 0.45)',
	cinematicOut: 'cubic-bezier(0, 0.55, 0.45, 1)',
	cinematicInOut: 'cubic-bezier(0.87, 0, 0.13, 1)',

	// Smooth deceleration (great for entrances)
	smoothOut: 'cubic-bezier(0, 0, 0.2, 1)',
	smoothIn: 'cubic-bezier(0.4, 0, 1, 1)',
	smoothInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',

	// Expressive (for hero animations)
	expressive: 'cubic-bezier(0.19, 1, 0.22, 1)',
	expressiveDecel: 'cubic-bezier(0, 0, 0.15, 1)',

	// Subtle (for micro-interactions)
	subtle: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
	subtleBounce: 'cubic-bezier(0.34, 1.2, 0.64, 1)',
} as const;

// ============================================================================
// TIMING CONSTANTS
// ============================================================================

/**
 * Duration constants following industry standards
 * Shorter = snappier UI, Longer = more cinematic
 */
export const DURATION = {
	// Micro-interactions (buttons, toggles)
	instant: 50,
	fast: 100,
	quick: 150,
	normal: 200,

	// Standard transitions
	medium: 300,
	slow: 400,
	slower: 500,

	// Cinematic (page transitions, heroes)
	cinematic: 600,
	dramatic: 800,
	epic: 1000,

	// Looping animations
	pulse: 2000,
	breathe: 4000,
	ambient: 8000,
} as const;

// ============================================================================
// ANIMATION PRESETS
// ============================================================================

/**
 * Pre-configured animation presets for common use cases
 */
export const PRESETS = {
	// Fade animations
	fadeIn: {
		keyframes: { opacity: [0, 1] },
		options: { duration: DURATION.medium, easing: EASING.smoothOut },
	},
	fadeOut: {
		keyframes: { opacity: [1, 0] },
		options: { duration: DURATION.medium, easing: EASING.smoothIn },
	},

	// Slide animations
	slideUp: {
		keyframes: {
			opacity: [0, 1],
			transform: ['translateY(24px)', 'translateY(0)']
		},
		options: { duration: DURATION.cinematic, easing: EASING.cinematic },
	},
	slideDown: {
		keyframes: {
			opacity: [0, 1],
			transform: ['translateY(-24px)', 'translateY(0)']
		},
		options: { duration: DURATION.cinematic, easing: EASING.cinematic },
	},
	slideLeft: {
		keyframes: {
			opacity: [0, 1],
			transform: ['translateX(24px)', 'translateX(0)']
		},
		options: { duration: DURATION.cinematic, easing: EASING.cinematic },
	},
	slideRight: {
		keyframes: {
			opacity: [0, 1],
			transform: ['translateX(-24px)', 'translateX(0)']
		},
		options: { duration: DURATION.cinematic, easing: EASING.cinematic },
	},

	// Scale animations
	scaleIn: {
		keyframes: {
			opacity: [0, 1],
			transform: ['scale(0.95)', 'scale(1)']
		},
		options: { duration: DURATION.medium, easing: EASING.spring },
	},
	scaleOut: {
		keyframes: {
			opacity: [1, 0],
			transform: ['scale(1)', 'scale(0.95)']
		},
		options: { duration: DURATION.quick, easing: EASING.smoothIn },
	},

	// Hero animations (dramatic entrance)
	heroTitle: {
		keyframes: {
			opacity: [0, 1],
			transform: ['translateY(40px) scale(0.98)', 'translateY(0) scale(1)'],
			filter: ['blur(4px)', 'blur(0)']
		},
		options: { duration: DURATION.epic, easing: EASING.expressive },
	},
	heroSubtitle: {
		keyframes: {
			opacity: [0, 1],
			transform: ['translateY(20px)', 'translateY(0)']
		},
		options: { duration: DURATION.dramatic, easing: EASING.cinematic },
	},

	// Card hover
	cardLift: {
		keyframes: {
			transform: ['translateY(0)', 'translateY(-4px)'],
			boxShadow: [
				'0 4px 6px -1px rgba(0, 0, 0, 0.1)',
				'0 20px 40px -12px rgba(234, 179, 8, 0.15)'
			]
		},
		options: { duration: DURATION.normal, easing: EASING.spring },
	},

	// Button press
	buttonPress: {
		keyframes: { transform: ['scale(1)', 'scale(0.97)', 'scale(1)'] },
		options: { duration: DURATION.quick, easing: EASING.spring },
	},

	// Glow pulse
	glowPulse: {
		keyframes: {
			opacity: [0.3, 0.6, 0.3],
			transform: ['scale(1)', 'scale(1.05)', 'scale(1)']
		},
		options: {
			duration: DURATION.ambient,
			easing: EASING.smoothInOut,
			iterations: Infinity
		},
	},
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
	if (typeof window === 'undefined') return false;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get safe animation duration (respects reduced motion)
 */
export function getSafeDuration(duration: number): number {
	return prefersReducedMotion() ? 0 : duration;
}

/**
 * Calculate stagger delay for an element in a sequence
 */
export function getStaggerDelay(
	index: number,
	totalItems: number,
	config: StaggerConfig = {}
): number {
	const { staggerDelay = 50, direction = 'forward', delay = 0 } = config;

	let effectiveIndex: number;
	switch (direction) {
		case 'reverse':
			effectiveIndex = totalItems - 1 - index;
			break;
		case 'center':
			const center = (totalItems - 1) / 2;
			effectiveIndex = Math.abs(index - center);
			break;
		default:
			effectiveIndex = index;
	}

	return delay + effectiveIndex * staggerDelay;
}

/**
 * Create CSS animation string from config
 */
export function createAnimationStyle(
	name: string,
	config: AnimationConfig = {}
): string {
	const {
		duration = DURATION.medium,
		delay = 0,
		easing = EASING.smoothOut,
		fillMode = 'both',
	} = config;

	const safeDuration = getSafeDuration(duration);
	const safeDelay = getSafeDuration(delay);

	return `${name} ${safeDuration}ms ${easing} ${safeDelay}ms ${fillMode}`;
}

/**
 * Create inline transform style for GPU acceleration
 * Using translateZ(0) to force GPU layer
 */
export function gpuAccelerate(): string {
	return 'translateZ(0)';
}

/**
 * Create CSS custom properties for animation timing
 */
export function createAnimationVars(config: AnimationConfig = {}): Record<string, string> {
	const {
		duration = DURATION.medium,
		delay = 0,
		easing = EASING.smoothOut,
	} = config;

	return {
		'--animation-duration': `${getSafeDuration(duration)}ms`,
		'--animation-delay': `${getSafeDuration(delay)}ms`,
		'--animation-easing': easing,
	};
}

// ============================================================================
// SCROLL ANIMATION HELPERS
// ============================================================================

/**
 * Configuration for Intersection Observer-based scroll reveals
 */
export function createScrollRevealConfig(config: ScrollRevealConfig = {}): IntersectionObserverInit {
	const { threshold = 0.1, rootMargin = '0px 0px -50px 0px' } = config;

	return {
		threshold,
		rootMargin,
		root: null,
	};
}

/**
 * Calculate parallax offset based on scroll position
 * @param scrollY - Current scroll position
 * @param elementTop - Element's top position relative to document
 * @param speed - Parallax speed multiplier (0.1 = subtle, 0.5 = dramatic)
 */
export function calculateParallax(
	scrollY: number,
	elementTop: number,
	speed: number = 0.2
): number {
	if (prefersReducedMotion()) return 0;
	return (scrollY - elementTop) * speed;
}

/**
 * Calculate scroll progress for an element (0-1)
 * @param scrollY - Current scroll position
 * @param elementTop - Element's top position
 * @param elementHeight - Element's height
 * @param viewportHeight - Viewport height
 */
export function calculateScrollProgress(
	scrollY: number,
	elementTop: number,
	elementHeight: number,
	viewportHeight: number
): number {
	const start = elementTop - viewportHeight;
	const end = elementTop + elementHeight;
	const current = scrollY;

	if (current <= start) return 0;
	if (current >= end) return 1;

	return (current - start) / (end - start);
}

// ============================================================================
// CSS-IN-JS ANIMATION GENERATORS
// ============================================================================

/**
 * Generate keyframe animation CSS
 */
export function generateKeyframes(name: string, frames: Record<string, Record<string, string>>): string {
	const frameStrings = Object.entries(frames)
		.map(([key, props]) => {
			const propStrings = Object.entries(props)
				.map(([prop, value]) => `${prop}: ${value}`)
				.join('; ');
			return `${key} { ${propStrings} }`;
		})
		.join('\n  ');

	return `@keyframes ${name} {\n  ${frameStrings}\n}`;
}

// ============================================================================
// EXPORTS
// ============================================================================

export const motion = {
	easing: EASING,
	duration: DURATION,
	presets: PRESETS,
	prefersReducedMotion,
	getSafeDuration,
	getStaggerDelay,
	createAnimationStyle,
	createAnimationVars,
	createScrollRevealConfig,
	calculateParallax,
	calculateScrollProgress,
	gpuAccelerate,
	generateKeyframes,
};

export default motion;
