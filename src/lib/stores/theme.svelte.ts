/**
 * Theme Store
 *
 * Manages dark/light mode with localStorage persistence.
 * Respects prefers-color-scheme as default.
 * Uses Svelte 5's $state for reactivity.
 */

import { browser } from '$app/environment';

const STORAGE_KEY = 'trading_greats_theme';

export type Theme = 'light' | 'dark' | 'system';

// Get system preference
function getSystemTheme(): 'light' | 'dark' {
	if (!browser) return 'dark';
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Load theme from localStorage
function loadTheme(): Theme {
	if (!browser) return 'system';

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored === 'light' || stored === 'dark' || stored === 'system') {
			return stored;
		}
	} catch {
		// Silent fail - localStorage may be unavailable
	}
	return 'system';
}

// Save theme to localStorage
function saveTheme(theme: Theme): void {
	if (!browser) return;

	try {
		localStorage.setItem(STORAGE_KEY, theme);
	} catch {
		// Silent fail - localStorage may be full or unavailable
	}
}

// Apply theme to document
function applyTheme(theme: Theme): void {
	if (!browser) return;

	const resolved = theme === 'system' ? getSystemTheme() : theme;
	const root = document.documentElement;

	if (resolved === 'dark') {
		root.classList.add('dark');
		root.style.colorScheme = 'dark';
	} else {
		root.classList.remove('dark');
		root.style.colorScheme = 'light';
	}
}

// Create the reactive theme store
class ThemeStore {
	#theme = $state<Theme>('system');
	#resolvedTheme = $state<'light' | 'dark'>('dark');

	constructor() {
		if (browser) {
			// Initialize from localStorage
			this.#theme = loadTheme();
			this.#resolvedTheme = this.#theme === 'system' ? getSystemTheme() : this.#theme;
			applyTheme(this.#theme);

			// Listen for system theme changes
			const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
			mediaQuery.addEventListener('change', (e) => {
				if (this.#theme === 'system') {
					this.#resolvedTheme = e.matches ? 'dark' : 'light';
					applyTheme('system');
				}
			});
		}
	}

	get current(): Theme {
		return this.#theme;
	}

	get resolved(): 'light' | 'dark' {
		return this.#resolvedTheme;
	}

	get isDark(): boolean {
		return this.#resolvedTheme === 'dark';
	}

	get isLight(): boolean {
		return this.#resolvedTheme === 'light';
	}

	set(theme: Theme): void {
		this.#theme = theme;
		this.#resolvedTheme = theme === 'system' ? getSystemTheme() : theme;
		saveTheme(theme);
		applyTheme(theme);
	}

	toggle(): void {
		// Cycle: system -> light -> dark -> system
		const next: Record<Theme, Theme> = {
			system: 'light',
			light: 'dark',
			dark: 'system'
		};
		this.set(next[this.#theme]);
	}

	setDark(): void {
		this.set('dark');
	}

	setLight(): void {
		this.set('light');
	}

	setSystem(): void {
		this.set('system');
	}
}

// Export singleton instance
export const theme = new ThemeStore();
