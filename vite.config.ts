import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			preprocess: vitePreprocess(),
			adapter: adapter(),
			alias: { $components: 'src/lib/components', $server: 'src/lib/server' },
			vitePlugin: {
				onwarn: (warning, handler) => {
					// Ignore warnings from SvelteKit generated files
					if (warning.filename?.includes('.svelte-kit/generated')) return;

					// Ignore state_referenced_locally warnings from SvelteKit internals
					if (warning.code === 'state_referenced_locally' && warning.filename?.includes('.svelte-kit')) return;

					handler(warning);
				}
			}
		})
	],
	server: { fs: { allow: ['..'] } },
	ssr: { noExternal: ['lucide-svelte'] },
	// Suppress specific warnings in console
	logLevel: 'info'
});
