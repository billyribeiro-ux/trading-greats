import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		extend: {
			// ========================================================================
			// TYPOGRAPHY
			// ========================================================================
			fontFamily: {
				display: ['Playfair Display', 'Georgia', 'serif'],
				sans: ['DM Sans', 'system-ui', 'sans-serif'],
				mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
			},

			// ========================================================================
			// COLORS - Premium Gold & Midnight Palette
			// ========================================================================
			colors: {
				gold: {
					50: '#fefce8',
					100: '#fef9c3',
					200: '#fef08a',
					300: '#fde047',
					400: '#facc15',
					500: '#eab308',
					600: '#ca8a04',
					700: '#a16207',
					800: '#854d0e',
					900: '#713f12',
					950: '#422006',
				},
				midnight: {
					50: '#f8fafc',
					100: '#f1f5f9',
					200: '#e2e8f0',
					300: '#cbd5e1',
					400: '#94a3b8',
					500: '#64748b',
					600: '#475569',
					700: '#334155',
					800: '#1e293b',
					900: '#0f172a',
					950: '#020617',
				},
			},

			// ========================================================================
			// SPACING & SIZING
			// ========================================================================
			spacing: {
				'18': '4.5rem',
				'22': '5.5rem',
				'30': '7.5rem',
			},

			// ========================================================================
			// ANIMATIONS - Apple/Netflix Quality
			// ========================================================================
			animation: {
				// Standard UI animations
				'fade-in': 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
				'fade-out': 'fadeOut 0.3s cubic-bezier(0.4, 0, 1, 1) forwards',
				'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
				'slide-down': 'slideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
				'slide-left': 'slideLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
				'slide-right': 'slideRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
				'scale-in': 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
				'scale-out': 'scaleOut 0.3s cubic-bezier(0.4, 0, 1, 1) forwards',

				// Hero/cinematic animations
				'hero-fade': 'heroFade 1s cubic-bezier(0.19, 1, 0.22, 1) forwards',
				'hero-slide': 'heroSlide 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards',
				'hero-blur': 'heroBlur 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
				'text-reveal': 'textReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',

				// Looping/ambient animations
				'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'pulse-slower': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'float': 'float 6s ease-in-out infinite',
				'float-slow': 'float 10s ease-in-out infinite',
				'glow': 'glow 2s ease-in-out infinite alternate',
				'glow-slow': 'glow 4s ease-in-out infinite alternate',
				'shimmer': 'shimmer 2.5s linear infinite',
				'spin-slow': 'spin 8s linear infinite',
				'breathe': 'breathe 4s ease-in-out infinite',

				// Gradient animations
				'gradient-x': 'gradientX 8s ease infinite',
				'gradient-y': 'gradientY 8s ease infinite',
				'gradient-xy': 'gradientXY 8s ease infinite',

				// Subtle bounce/spring
				'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
				'wiggle': 'wiggle 1s ease-in-out infinite',

				// Progress/loading
				'progress': 'progress 1.5s ease-in-out infinite',
				'skeleton': 'skeleton 2s linear infinite',
			},

			keyframes: {
				// Standard fades
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				fadeOut: {
					'0%': { opacity: '1' },
					'100%': { opacity: '0' },
				},

				// Slides
				slideUp: {
					'0%': { opacity: '0', transform: 'translateY(24px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				slideDown: {
					'0%': { opacity: '0', transform: 'translateY(-24px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				slideLeft: {
					'0%': { opacity: '0', transform: 'translateX(24px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' },
				},
				slideRight: {
					'0%': { opacity: '0', transform: 'translateX(-24px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' },
				},

				// Scales
				scaleIn: {
					'0%': { opacity: '0', transform: 'scale(0.95)' },
					'100%': { opacity: '1', transform: 'scale(1)' },
				},
				scaleOut: {
					'0%': { opacity: '1', transform: 'scale(1)' },
					'100%': { opacity: '0', transform: 'scale(0.95)' },
				},

				// Hero/cinematic
				heroFade: {
					'0%': { opacity: '0', transform: 'translateY(40px) scale(0.98)' },
					'100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
				},
				heroSlide: {
					'0%': {
						opacity: '0',
						transform: 'translateY(60px)',
						filter: 'blur(4px)',
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)',
						filter: 'blur(0)',
					},
				},
				heroBlur: {
					'0%': { opacity: '0', filter: 'blur(12px)' },
					'100%': { opacity: '1', filter: 'blur(0)' },
				},
				textReveal: {
					'0%': { opacity: '0', transform: 'translateY(100%)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},

				// Ambient/looping
				float: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				glow: {
					'0%': { boxShadow: '0 0 20px rgba(234, 179, 8, 0.3)' },
					'100%': { boxShadow: '0 0 40px rgba(234, 179, 8, 0.6)' },
				},
				shimmer: {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' },
				},
				breathe: {
					'0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
					'50%': { opacity: '0.8', transform: 'scale(1.02)' },
				},

				// Gradients
				gradientX: {
					'0%, 100%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
				},
				gradientY: {
					'0%, 100%': { backgroundPosition: '50% 0%' },
					'50%': { backgroundPosition: '50% 100%' },
				},
				gradientXY: {
					'0%': { backgroundPosition: '0% 0%' },
					'25%': { backgroundPosition: '100% 0%' },
					'50%': { backgroundPosition: '100% 100%' },
					'75%': { backgroundPosition: '0% 100%' },
					'100%': { backgroundPosition: '0% 0%' },
				},

				// Subtle bounce
				bounceSubtle: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' },
				},
				wiggle: {
					'0%, 100%': { transform: 'rotate(-3deg)' },
					'50%': { transform: 'rotate(3deg)' },
				},

				// Progress/loading
				progress: {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' },
				},
				skeleton: {
					'0%': { backgroundPosition: '200% 0' },
					'100%': { backgroundPosition: '-200% 0' },
				},
			},

			// ========================================================================
			// TRANSITION TIMING FUNCTIONS
			// ========================================================================
			transitionTimingFunction: {
				'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
				'spring-smooth': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
				'spring-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				'cinematic': 'cubic-bezier(0.16, 1, 0.3, 1)',
				'cinematic-in': 'cubic-bezier(0.55, 0, 1, 0.45)',
				'cinematic-out': 'cubic-bezier(0, 0.55, 0.45, 1)',
				'expressive': 'cubic-bezier(0.19, 1, 0.22, 1)',
			},

			// ========================================================================
			// BACKGROUNDS
			// ========================================================================
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'noise':
					"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
				'shimmer':
					'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 20%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 80%, transparent 100%)',
				'skeleton':
					'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%)',
			},
			backgroundSize: {
				'shimmer': '200% 100%',
				'skeleton': '400% 100%',
			},

			// ========================================================================
			// BOX SHADOWS - Premium depth system
			// ========================================================================
			boxShadow: {
				'glow-sm': '0 0 10px rgba(234, 179, 8, 0.2)',
				'glow': '0 0 20px rgba(234, 179, 8, 0.3)',
				'glow-lg': '0 0 40px rgba(234, 179, 8, 0.4)',
				'glow-xl': '0 0 60px rgba(234, 179, 8, 0.5)',
				'inner-glow': 'inset 0 0 20px rgba(234, 179, 8, 0.1)',
				'premium': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
				'premium-sm': '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
				'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
				'card-hover':
					'0 20px 40px -12px rgba(234, 179, 8, 0.15), 0 8px 16px -8px rgba(0, 0, 0, 0.3)',
			},

			// ========================================================================
			// BLUR
			// ========================================================================
			blur: {
				xs: '2px',
			},

			// ========================================================================
			// ASPECT RATIOS
			// ========================================================================
			aspectRatio: {
				'4/5': '4 / 5',
				'3/4': '3 / 4',
				'2/3': '2 / 3',
				'21/9': '21 / 9',
			},
		},
	},
	plugins: [typography],
} satisfies Config;
