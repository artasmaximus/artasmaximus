import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// The Vercel runtime comes from the build's Node version, so it follows the
		// Node.js Version in Vercel's project settings. This adapter accepts 20, 22, or 24.
		// Pinned to 6.3.0 because 6.3.1 and later crash on SvelteKit 2.13.
		adapter: adapter()
	}
};

export default config;
