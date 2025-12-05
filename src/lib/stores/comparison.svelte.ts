/**
 * Comparison Store
 *
 * Manages traders selected for comparison using localStorage for persistence.
 * Apple-style reactive store with proper Svelte 5 runes support.
 */

import { browser } from '$app/environment';

const STORAGE_KEY = 'trading_greats_comparison';
const MAX_COMPARE = 4; // Maximum traders to compare

function loadComparison(): string[] {
	if (!browser) return [];

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			const parsed = JSON.parse(stored);
			return Array.isArray(parsed) ? parsed.slice(0, MAX_COMPARE) : [];
		}
	} catch {
		// Silent fail - localStorage may be unavailable
	}
	return [];
}

function saveComparison(slugs: string[]): void {
	if (!browser) return;

	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs.slice(0, MAX_COMPARE)));
	} catch {
		// Silent fail - localStorage may be full or unavailable
	}
}

// Use a reactive object with public state for proper Svelte 5 reactivity
function createComparisonStore() {
	let slugs = $state<string[]>(browser ? loadComparison() : []);

	return {
		get all(): string[] {
			return slugs;
		},

		get count(): number {
			return slugs.length;
		},

		get isFull(): boolean {
			return slugs.length >= MAX_COMPARE;
		},

		get maxCompare(): number {
			return MAX_COMPARE;
		},

		isInComparison(slug: string): boolean {
			return slugs.includes(slug);
		},

		toggle(slug: string): boolean {
			if (slugs.includes(slug)) {
				slugs = slugs.filter(s => s !== slug);
			} else if (slugs.length < MAX_COMPARE) {
				slugs = [...slugs, slug];
			}
			saveComparison(slugs);
			return slugs.includes(slug);
		},

		add(slug: string): boolean {
			if (!slugs.includes(slug) && slugs.length < MAX_COMPARE) {
				slugs = [...slugs, slug];
				saveComparison(slugs);
				return true;
			}
			return false;
		},

		remove(slug: string): void {
			slugs = slugs.filter(s => s !== slug);
			saveComparison(slugs);
		},

		clear(): void {
			slugs = [];
			saveComparison(slugs);
			// Also clear localStorage directly to ensure sync
			if (browser) {
				try {
					localStorage.removeItem(STORAGE_KEY);
				} catch {
					// Silent fail
				}
			}
		}
	};
}

export const comparison = createComparisonStore();
