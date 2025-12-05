import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		fs: {
			allow: ['..']
		}
	},
	ssr: {
		noExternal: ['lucide-svelte']
	},
	// Suppress specific warnings in console
	logLevel: 'info'
});
