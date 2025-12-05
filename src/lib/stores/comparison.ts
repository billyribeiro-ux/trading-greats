/**
 * Comparison Store
 *
 * Manages traders selected for comparison using localStorage for persistence.
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
	} catch (e) {
		console.error('Failed to load comparison:', e);
	}
	return [];
}

function saveComparison(slugs: string[]): void {
	if (!browser) return;

	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs.slice(0, MAX_COMPARE)));
	} catch (e) {
		console.error('Failed to save comparison:', e);
	}
}

class ComparisonStore {
	#slugs = $state<string[]>([]);

	constructor() {
		if (browser) {
			this.#slugs = loadComparison();
		}
	}

	get all(): string[] {
		return [...this.#slugs];
	}

	get count(): number {
		return this.#slugs.length;
	}

	get isFull(): boolean {
		return this.#slugs.length >= MAX_COMPARE;
	}

	get maxCompare(): number {
		return MAX_COMPARE;
	}

	isInComparison(slug: string): boolean {
		return this.#slugs.includes(slug);
	}

	toggle(slug: string): boolean {
		if (this.#slugs.includes(slug)) {
			this.#slugs = this.#slugs.filter(s => s !== slug);
		} else if (this.#slugs.length < MAX_COMPARE) {
			this.#slugs = [...this.#slugs, slug];
		}
		saveComparison(this.#slugs);
		return this.#slugs.includes(slug);
	}

	add(slug: string): boolean {
		if (!this.#slugs.includes(slug) && this.#slugs.length < MAX_COMPARE) {
			this.#slugs = [...this.#slugs, slug];
			saveComparison(this.#slugs);
			return true;
		}
		return false;
	}

	remove(slug: string): void {
		this.#slugs = this.#slugs.filter(s => s !== slug);
		saveComparison(this.#slugs);
	}

	clear(): void {
		this.#slugs = [];
		saveComparison(this.#slugs);
	}
}

export const comparison = new ComparisonStore();
