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
	// Note: experimental async SSR (compilerOptions.experimental.async) is OFF.
	// Turn it on only when a component genuinely needs top-level <await> or
	// async load-fn-in-component patterns. Today none do, and leaving experimental
	// flags on risks surprise behavior on minor Svelte upgrades.
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
