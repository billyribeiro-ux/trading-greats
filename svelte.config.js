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
	},
	// Suppress known SvelteKit internal warnings
	onwarn: (warning, handler) => {
		// Ignore warnings from SvelteKit generated files
		if (warning.filename?.includes('.svelte-kit/generated')) return;
		// Ignore state_referenced_locally warnings from SvelteKit internals
		if (warning.code === 'state_referenced_locally' && warning.filename?.includes('.svelte-kit')) return;
		handler(warning);
	}
};

export default config;
