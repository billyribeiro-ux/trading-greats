import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			$components: 'src/lib/components',
			$server: 'src/lib/server'
		}
	},
	// Svelte 5.44+ Dec 2025: Enable async SSR for better hydration
	compilerOptions: {
		experimental: {
			async: true
		}
	}
};

export default config;
