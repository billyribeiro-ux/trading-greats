/**
 * Favorites Store
 *
 * Manages user's favorite traders using localStorage for persistence.
 * Uses Svelte 5's $state for reactivity.
 */

import { browser } from '$app/environment';
import { SvelteSet } from 'svelte/reactivity';

const STORAGE_KEY = 'trading_greats_favorites';

// Load favorites from localStorage (silent fail for resilience)
function loadFavorites(): SvelteSet<string> {
	if (!browser) return new SvelteSet();

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			const parsed = JSON.parse(stored);
			return new SvelteSet(Array.isArray(parsed) ? parsed : []);
		}
	} catch {
		// Silent fail - localStorage may be unavailable (private browsing, etc.)
	}
	return new SvelteSet();
}

// Save favorites to localStorage (silent fail for resilience)
function saveFavorites(favorites: SvelteSet<string>): void {
	if (!browser) return;

	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]));
	} catch {
		// Silent fail - localStorage may be full or unavailable
	}
}

// Create the reactive favorites store
class FavoritesStore {
	#favorites = $state<SvelteSet<string>>(new SvelteSet());

	constructor() {
		// Initialize from localStorage when in browser
		if (browser) {
			this.#favorites = loadFavorites();
		}
	}

	get all(): string[] {
		return [...this.#favorites];
	}

	get count(): number {
		return this.#favorites.size;
	}

	isFavorite(slug: string): boolean {
		return this.#favorites.has(slug);
	}

	toggle(slug: string): boolean {
		if (this.#favorites.has(slug)) {
			this.#favorites.delete(slug);
		} else {
			this.#favorites.add(slug);
		}
		saveFavorites(this.#favorites);
		return this.#favorites.has(slug);
	}

	add(slug: string): void {
		if (!this.#favorites.has(slug)) {
			this.#favorites.add(slug);
			saveFavorites(this.#favorites);
		}
	}

	remove(slug: string): void {
		if (this.#favorites.has(slug)) {
			this.#favorites.delete(slug);
			saveFavorites(this.#favorites);
		}
	}

	clear(): void {
		this.#favorites.clear();
		saveFavorites(this.#favorites);
	}
}

// Export singleton instance
export const favorites = new FavoritesStore();
